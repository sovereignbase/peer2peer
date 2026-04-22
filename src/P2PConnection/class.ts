import {
  waitForIceComplete,
  waitForChannelOpen,
  waitForIncomingDataChannel,
} from '../.helpers/index.js'

import { decode, encode } from '@msgpack/msgpack'

import { P2PConnectionError } from '../.errors/class.js'

import type {
  Offer,
  Contract,
  ContractCopies,
  P2PConnectionEventMap,
  P2PConnectionEventListenerFor,
} from '../.types/index.js'

export class P2PConnection<T extends Record<string, unknown>> {
  static #userMediaStream: MediaStream | undefined
  static #displayMediaStream: MediaStream | undefined
  static localCameraVideoElement: HTMLVideoElement | undefined
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

  static async makeOffer(additionalIceServers: RTCIceServer[]): Promise<Offer> {
    const peerConnection = new RTCPeerConnection({
      iceServers: [P2PConnection.#defaultIceServer, ...additionalIceServers],
      iceTransportPolicy: 'all',
    })

    const channel = peerConnection.createDataChannel('data')
    const offerId = crypto.randomUUID()

    P2PConnection.#pendingOffers.set(offerId, {
      peerConnection,
      channel,
    })

    await peerConnection.setLocalDescription(await peerConnection.createOffer())
    await waitForIceComplete(peerConnection)

    if (!peerConnection.localDescription)
      throw new P2PConnectionError('MISSING_LOCAL_DESCRIPTION')

    return {
      offerId,
      description: peerConnection.localDescription,
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
  static async acceptOffer(
    offer: Offer,
    additionalIceServers: RTCIceServer[]
  ): Promise<ContractCopies> {
    const peerConnection = new RTCPeerConnection({
      iceServers: [P2PConnection.#defaultIceServer, ...additionalIceServers],
      iceTransportPolicy: 'all',
    })

    const channelPromise = waitForIncomingDataChannel(peerConnection)

    await peerConnection.setRemoteDescription(offer.description)
    await peerConnection.setLocalDescription(
      await peerConnection.createAnswer()
    )
    await waitForIceComplete(peerConnection)

    if (!peerConnection.localDescription)
      throw new P2PConnectionError('MISSING_LOCAL_DESCRIPTION')

    const answer = peerConnection.localDescription

    P2PConnection.#acceptedOffers.set(offer.offerId, {
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
  private readonly peerConnection: RTCPeerConnection
  private readonly channelPromise: Promise<RTCDataChannel>
  private channel?: RTCDataChannel

  private userAudioTrack: RTCRtpSender | undefined
  private userVideoTrack: RTCRtpSender | undefined

  private displayAudioTrack: RTCRtpSender | undefined
  private displayVideoTrack: RTCRtpSender | undefined

  remoteCameraVideoElement: HTMLVideoElement | undefined
  remoteScreenVideoElement: HTMLVideoElement | undefined

  constructor(contract: Contract) {
    this.eventTarget = new EventTarget()

    if (contract.role === 'offeror') {
      const pending = P2PConnection.#pendingOffers.get(contract.offerId)

      if (!pending) throw new P2PConnectionError('UNKNOWN_PEER_CONTRACT')

      this.channel = pending.channel
      this.peerConnection = pending.peerConnection
      this.channelPromise = Promise.resolve(pending.channel)
      P2PConnection.#pendingOffers.delete(contract.offerId)

      void this.peerConnection.setRemoteDescription(contract.answer)
    } else {
      const accepted = P2PConnection.#acceptedOffers.get(contract.offerId)

      if (!accepted) throw new P2PConnectionError('UNKNOWN_PEER_CONTRACT')

      this.peerConnection = accepted.peerConnection
      this.channelPromise = accepted.channelPromise.then((channel) => {
        this.channel = channel
        return channel
      })
      P2PConnection.#acceptedOffers.delete(contract.offerId)
    }

    if (this.channel)
      void this.channel.addEventListener('message', async ({ data }) => {
        this.eventTarget.dispatchEvent(
          new CustomEvent<T>('message', { detail: decode(data) as T })
        )
      })

    if (this.peerConnection) {
      void this.peerConnection.addEventListener('track', (ev) => {
        ev.streams[0]
        ev.track
      })
    }
  }

  async ready(): Promise<void> {
    const channel = await this.channelPromise
    await waitForChannelOpen(channel)
  }

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

  stopSharingMicrophone(): void {
    if (this.userAudioTrack) {
      this.peerConnection.removeTrack(this.userAudioTrack)
    }
  }

  async shareCamera(): Promise<void> {
    if (!P2PConnection.#userMediaStream) {
      P2PConnection.#userMediaStream =
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    }
    const videoTrack = P2PConnection.#userMediaStream.getVideoTracks()[0]

    if (!videoTrack) return

    void this.peerConnection.addTrack(
      videoTrack,
      P2PConnection.#userMediaStream
    )

    if (!P2PConnection.localCameraVideoElement?.srcObject) {
      if (!P2PConnection.localCameraVideoElement) {
        P2PConnection.localCameraVideoElement = new HTMLVideoElement()
      }
      const stream = new MediaStream([videoTrack])
      P2PConnection.localCameraVideoElement.srcObject = stream
      await P2PConnection.localCameraVideoElement.play()
    }
  }

  stopSharingCamera(): void {
    if (this.userVideoTrack) {
      this.peerConnection.removeTrack(this.userVideoTrack)
    }
  }

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
        P2PConnection.localScreenVideoElement = new HTMLVideoElement()
      }
      const stream = new MediaStream([videoTrack])
      P2PConnection.localScreenVideoElement.srcObject = stream
      await P2PConnection.localScreenVideoElement.play()
    }
  }

  stopSharingScreen(): void {
    if (this.displayVideoTrack) {
      void this.peerConnection.removeTrack(this.displayVideoTrack)
    }
    if (this.displayAudioTrack) {
      void this.peerConnection.removeTrack(this.displayAudioTrack)
    }
  }

  sendMessage(message: T): void {
    if (!this.channel) throw new P2PConnectionError('CONNECTION_NOT_READY')
    this.channel.send(encode(message))
  }

  closeConnection(): void {
    if (this.channel) this.channel.close()
    this.peerConnection.close()
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
    this.eventTarget.addEventListener(
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
    this.eventTarget.removeEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options
    )
  }
}
