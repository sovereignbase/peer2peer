import {
  createLocalAnswer,
  createLocalOffer,
  createMediaPlayer,
  waitForChannelOpen,
  waitForIncomingDataChannel,
  isInternalSignal,
} from '../.helpers/index.js'

import { decode, encode } from '@msgpack/msgpack'

import { P2PConnectionError } from '../.errors/class.js'

import type {
  Offer,
  Contract,
  ContractCopies,
  InternalSignal,
  P2PConnectionEventMap,
  P2PConnectionEventListenerFor,
} from '../.types/index.js'

/**
 * Provides a thin, browser-oriented wrapper around a WebRTC peer connection and
 * its application data channel.
 *
 * @template T The structured payload type sent through `sendMessage()` and
 * received via the `"message"` event.
 */
export class P2PConnection<T extends Record<string, unknown>> {
  static #userMediaStream: MediaStream | undefined
  static #displayMediaStream: MediaStream | undefined

  /**
   * Stores the shared local camera preview element, when camera sharing has
   * been enabled.
   */
  static localCameraVideoElement: HTMLVideoElement | undefined

  /**
   * Stores the shared local screen preview element, when screen sharing has
   * been enabled.
   */
  static localScreenVideoElement: HTMLVideoElement | undefined

  static #defaultIceServer: RTCIceServer = {
    urls: [
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
      'stun:stun4.l.google.com:19302',
    ],
  }

  //offeror
  static #pendingOffers = new Map<
    Offer['offerId'],
    {
      peerConnection: RTCPeerConnection
      channel: RTCDataChannel
    }
  >()

  /**
   * Creates a new offer and reserves the local offeror-side connection state
   * until the returned offer is later consumed by the constructor.
   *
   * @param additionalIceServers Optional additional ICE servers appended after
   * the built-in public STUN configuration.
   * @returns An offer that can be transported to the remote peer out-of-band.
   * @throws {P2PConnectionError} Throws `MISSING_LOCAL_DESCRIPTION` when the
   * browser does not expose the generated offer description.
   */
  static async makeOffer(
    additionalIceServers: RTCIceServer[] = []
  ): Promise<Offer> {
    const peerConnection = new RTCPeerConnection({
      iceServers: [P2PConnection.#defaultIceServer, ...additionalIceServers],
      iceTransportPolicy: 'all',
    })

    const channel = peerConnection.createDataChannel('data')

    const offerId = crypto.randomUUID()

    void P2PConnection.#pendingOffers.set(offerId, {
      peerConnection,
      channel,
    })

    return {
      offerId,
      description: await createLocalOffer(peerConnection),
    }
  }
  //offeree
  static #acceptedOffers = new Map<
    Offer['offerId'],
    {
      peerConnection: RTCPeerConnection
      channelPromise: Promise<RTCDataChannel>
    }
  >()

  /**
   * Accepts a remote offer and returns the paired contract copies needed by the
   * two peers to finalize the connection locally.
   *
   * @param offer The remote offer to accept.
   * @param additionalIceServers Optional additional ICE servers appended after
   * the built-in public STUN configuration.
   * @returns The contract copies for the offeror and offeree.
   * @throws {P2PConnectionError} Throws `MISSING_LOCAL_DESCRIPTION` when the
   * browser does not expose the generated answer description.
   */
  static async acceptOffer(
    offer: Offer,
    additionalIceServers: RTCIceServer[] = []
  ): Promise<ContractCopies> {
    const peerConnection = new RTCPeerConnection({
      iceServers: [P2PConnection.#defaultIceServer, ...additionalIceServers],
      iceTransportPolicy: 'all',
    })

    const channelPromise = waitForIncomingDataChannel(peerConnection)

    void (await peerConnection.setRemoteDescription(offer.description))
    const answer = await createLocalAnswer(peerConnection)

    void P2PConnection.#acceptedOffers.set(offer.offerId, {
      peerConnection,
      channelPromise,
    })

    return {
      offeror: {
        offerId: offer.offerId,
        role: 'offeror',
        answer,
      },
      offeree: {
        offerId: offer.offerId,
        role: 'offeree',
      },
    }
  }

  private readonly eventTarget: EventTarget
  private readonly polite: boolean
  private readonly peerConnection: RTCPeerConnection
  private readonly channelPromise: Promise<RTCDataChannel>
  private channel?: RTCDataChannel
  private makingOffer = false
  private ignoreOffer = false
  private isSettingRemoteAnswerPending = false

  private userAudioTrack: RTCRtpSender | undefined
  private userVideoTrack: RTCRtpSender | undefined

  private displayAudioTrack: RTCRtpSender | undefined
  private displayVideoTrack: RTCRtpSender | undefined
  private remoteUserMediaStreamId: string | undefined
  private remoteDisplayMediaStreamId: string | undefined

  /**
   * References the latest remote camera element created for this connection.
   */
  remoteCameraVideoElement: HTMLVideoElement | undefined

  /**
   * References the latest remote screen-share element created for this
   * connection.
   */
  remoteScreenVideoElement: HTMLVideoElement | undefined

  /**
   * Creates a live connection instance from one side of a previously exchanged
   * contract.
   *
   * @param contract The contract copy for the local role.
   * @throws {P2PConnectionError} Throws `UNKNOWN_PEER_CONTRACT` when the
   * provided contract does not match a reserved pending or accepted offer.
   */
  constructor(contract: Contract) {
    this.eventTarget = new EventTarget()
    this.polite = contract.role === 'offeree'
    let channelPromise: Promise<RTCDataChannel>

    if (contract.role === 'offeror') {
      const offer = P2PConnection.#pendingOffers.get(contract.offerId)
      if (!offer)
        throw new P2PConnectionError(
          'UNKNOWN_PEER_CONTRACT',
          `Failed to construct an offeror-side P2PConnection because no pending offer exists for offerId "${contract.offerId}".`
        )
      this.peerConnection = offer.peerConnection
      this.channel = offer.channel
      channelPromise = Promise.resolve(offer.channel)
      void P2PConnection.#pendingOffers.delete(contract.offerId)
      void this.peerConnection.setRemoteDescription(contract.answer)
    } else {
      const offer = P2PConnection.#acceptedOffers.get(contract.offerId)
      if (!offer)
        throw new P2PConnectionError(
          'UNKNOWN_PEER_CONTRACT',
          `Failed to construct an offeree-side P2PConnection because no accepted offer exists for offerId "${contract.offerId}".`
        )
      this.peerConnection = offer.peerConnection
      channelPromise = offer.channelPromise
      void P2PConnection.#acceptedOffers.delete(contract.offerId)
    }

    this.channelPromise = channelPromise.then((channel) => {
      this.channel = channel

      void this.channel.addEventListener('message', async ({ data }) => {
        const detail = decode(data)

        if (isInternalSignal(detail)) {
          void (await this.handleInternalSignal(detail))
          return
        }

        void this.eventTarget.dispatchEvent(
          new CustomEvent<T>('message', { detail: detail as T })
        )
      })

      return channel
    })

    if (this.peerConnection) {
      void this.peerConnection.addEventListener(
        'negotiationneeded',
        async () => {
          void (await this.handleNegotiationNeeded())
        }
      )

      void this.peerConnection.addEventListener('track', (ev) => {
        const stream = ev.streams[0] ?? new MediaStream([ev.track])

        if (
          !this.remoteUserMediaStreamId ||
          this.remoteUserMediaStreamId === stream.id
        ) {
          this.remoteUserMediaStreamId = stream.id

          if (!this.remoteCameraVideoElement) {
            this.remoteCameraVideoElement = createMediaPlayer()
          }

          this.remoteCameraVideoElement.srcObject = stream
          void this.remoteCameraVideoElement.play()
          void this.eventTarget.dispatchEvent(
            new CustomEvent('camera', {
              detail: this.remoteCameraVideoElement,
            })
          )
          return
        }

        if (
          !this.remoteDisplayMediaStreamId ||
          this.remoteDisplayMediaStreamId === stream.id
        ) {
          this.remoteDisplayMediaStreamId = stream.id

          if (!this.remoteScreenVideoElement) {
            this.remoteScreenVideoElement = createMediaPlayer()
          }

          this.remoteScreenVideoElement.srcObject = stream
          void this.remoteScreenVideoElement.play()
          void this.eventTarget.dispatchEvent(
            new CustomEvent('screen', {
              detail: this.remoteScreenVideoElement,
            })
          )
        }
      })
    }
  }

  /**
   * Resolves once the underlying data channel is fully open.
   *
   * @throws {P2PConnectionError} Throws `CHANNEL_CLOSED`, `CHANNEL_ERROR`, or
   * `CHANNEL_NOT_AVAILABLE` if the connection fails before the channel opens.
   */
  async ready(): Promise<void> {
    const channel = await this.channelPromise
    void (await waitForChannelOpen(channel))
  }

  /**
   * Starts sending the shared local microphone track to the remote peer.
   *
   * The first call lazily creates and caches the shared user-media stream.
   */
  async shareMicrophone(): Promise<void> {
    if (!P2PConnection.#userMediaStream) {
      P2PConnection.#userMediaStream =
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    }
    const audioTrack = P2PConnection.#userMediaStream.getAudioTracks()[0]

    if (!audioTrack) return

    this.userAudioTrack = this.peerConnection.addTrack(
      audioTrack,
      P2PConnection.#userMediaStream
    )
  }

  /**
   * Stops sending the local microphone track, if one is currently attached.
   */
  stopSharingMicrophone(): void {
    if (this.userAudioTrack) {
      void this.peerConnection.removeTrack(this.userAudioTrack)
      this.userAudioTrack = undefined
    }
  }

  /**
   * Starts sending the shared local camera track and populates the shared local
   * preview element.
   */
  async shareCamera(): Promise<void> {
    if (!P2PConnection.#userMediaStream) {
      P2PConnection.#userMediaStream =
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    }
    const videoTrack = P2PConnection.#userMediaStream.getVideoTracks()[0]

    if (!videoTrack) return

    this.userVideoTrack = this.peerConnection.addTrack(
      videoTrack,
      P2PConnection.#userMediaStream
    )

    if (!P2PConnection.localCameraVideoElement?.srcObject) {
      if (!P2PConnection.localCameraVideoElement) {
        P2PConnection.localCameraVideoElement = document.createElement('video')
        P2PConnection.localCameraVideoElement.autoplay = true
        P2PConnection.localCameraVideoElement.playsInline = true
        P2PConnection.localCameraVideoElement.muted = true
      }
      const stream = new MediaStream([videoTrack])
      P2PConnection.localCameraVideoElement.srcObject = stream
      void P2PConnection.localCameraVideoElement.play()
    }
  }

  /**
   * Stops sending the local camera track, if one is currently attached.
   */
  stopSharingCamera(): void {
    if (this.userVideoTrack) {
      void this.peerConnection.removeTrack(this.userVideoTrack)
      this.userVideoTrack = undefined
    }
  }

  /**
   * Starts sending the shared local display stream and populates the shared
   * local preview element.
   */
  async shareScreen(): Promise<void> {
    if (!P2PConnection.#displayMediaStream) {
      P2PConnection.#displayMediaStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })
    }
    const videoTrack = P2PConnection.#displayMediaStream.getVideoTracks()[0]

    if (videoTrack) {
      this.displayVideoTrack = this.peerConnection.addTrack(
        videoTrack,
        P2PConnection.#displayMediaStream
      )
    }

    const audioTrack = P2PConnection.#displayMediaStream.getAudioTracks()[0]

    if (audioTrack) {
      this.displayAudioTrack = this.peerConnection.addTrack(
        audioTrack,
        P2PConnection.#displayMediaStream
      )
    }

    if (!P2PConnection.localScreenVideoElement?.srcObject) {
      if (!P2PConnection.localScreenVideoElement) {
        P2PConnection.localScreenVideoElement = document.createElement('video')
        P2PConnection.localScreenVideoElement.autoplay = true
        P2PConnection.localScreenVideoElement.playsInline = true
        P2PConnection.localScreenVideoElement.muted = true
      }
      const stream = new MediaStream([videoTrack])
      P2PConnection.localScreenVideoElement.srcObject = stream
      void P2PConnection.localScreenVideoElement.play()
    }
  }

  /**
   * Stops sending the local display tracks, if any are currently attached.
   */
  stopSharingScreen(): void {
    if (this.displayVideoTrack) {
      void this.peerConnection.removeTrack(this.displayVideoTrack)
      this.displayVideoTrack = undefined
    }
    if (this.displayAudioTrack) {
      void this.peerConnection.removeTrack(this.displayAudioTrack)
      this.displayAudioTrack = undefined
    }
  }

  /**
   * Sends an application payload over the open data channel.
   *
   * @param message The structured payload to encode and transmit.
   * @throws {P2PConnectionError} Throws `CONNECTION_NOT_READY` when the data
   * channel has not reached the `"open"` state.
   */
  sendMessage(message: T): void {
    if (!this.channel || this.channel.readyState !== 'open') {
      const stateDescription = this.channel
        ? `in the "${this.channel.readyState}" state`
        : 'not available yet'
      throw new P2PConnectionError(
        'CONNECTION_NOT_READY',
        `Failed to execute "sendMessage" because the RTCDataChannel is ${stateDescription}.`
      )
    }
    void this.channel.send(encode(message))
  }

  /**
   * Closes the data channel and underlying peer connection.
   */
  closeConnection(): void {
    if (this.channel) this.channel.close()
    void this.peerConnection.close()
  }

  /**
   * Registers an event listener.
   *
   * @param type The event type to listen for.
   * @param listener The listener to register.
   * @param options Listener registration options.
   */
  addEventListener<K extends keyof P2PConnectionEventMap<T>>(
    type: K,
    listener: P2PConnectionEventListenerFor<T, K> | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    void this.eventTarget.addEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options
    )
  }

  /**
   * Removes an event listener.
   *
   * @param type The event type to stop listening for.
   * @param listener The listener to remove.
   * @param options Listener removal options.
   */
  removeEventListener<K extends keyof P2PConnectionEventMap<T>>(
    type: K,
    listener: P2PConnectionEventListenerFor<T, K> | null,
    options?: boolean | EventListenerOptions
  ): void {
    void this.eventTarget.removeEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options
    )
  }

  private async sendInternalSignal(signal: InternalSignal): Promise<void> {
    const channel = await this.channelPromise
    void (await waitForChannelOpen(channel))
    void channel.send(encode(signal))
  }

  private async handleNegotiationNeeded(): Promise<void> {
    if (!this.channel) return

    try {
      this.makingOffer = true

      const description = await createLocalOffer(this.peerConnection)

      void (await this.sendInternalSignal({
        __sovereignbase_peer2peer: 'renegotiate-offer',
        description: description.toJSON(),
      }))
    } finally {
      this.makingOffer = false
    }
  }

  private async handleInternalSignal(signal: InternalSignal): Promise<void> {
    const readyForOffer =
      !this.makingOffer &&
      (this.peerConnection.signalingState === 'stable' ||
        this.isSettingRemoteAnswerPending)

    const offerCollision =
      signal.__sovereignbase_peer2peer === 'renegotiate-offer' && !readyForOffer

    this.ignoreOffer = !this.polite && offerCollision

    if (this.ignoreOffer) return

    this.isSettingRemoteAnswerPending =
      signal.__sovereignbase_peer2peer === 'renegotiate-answer'

    void (await this.peerConnection.setRemoteDescription(signal.description))
    this.isSettingRemoteAnswerPending = false

    if (signal.__sovereignbase_peer2peer === 'renegotiate-offer') {
      const description = await createLocalAnswer(this.peerConnection)

      void (await this.sendInternalSignal({
        __sovereignbase_peer2peer: 'renegotiate-answer',
        description: description.toJSON(),
      }))
    }
  }
}
