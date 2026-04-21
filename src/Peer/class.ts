import { decode, encode } from '@msgpack/msgpack'

const iceServers: RTCIceServer[] = [
  {
    urls: [
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
      'stun:stun4.l.google.com:19302',
    ],
  },
]

type WireDescription = {
  type: 'offer' | 'answer'
  sdp: string
}

export type Offer = {
  offerId: string
  description: WireDescription
}

export type OfferorPeerInit = {
  offerId: string
  side: 'offeror'
  answer: WireDescription
}

export type OffereePeerInit = {
  offerId: string
  side: 'offeree'
}

export type PeerInit = OfferorPeerInit | OffereePeerInit

function serializeDescription(
  description: RTCSessionDescription | RTCSessionDescriptionInit
): WireDescription {
  if (description.type !== 'offer' && description.type !== 'answer')
    throw new TypeError('BAD_DESCRIPTION_TYPE')

  if (!description.sdp) throw new TypeError('MISSING_SDP')

  return {
    type: description.type,
    sdp: description.sdp,
  }
}

async function waitForIceComplete(
  peerConnection: RTCPeerConnection
): Promise<void> {
  if (peerConnection.iceGatheringState === 'complete') return

  await new Promise<void>((resolve) => {
    const cleanup = (): void => {
      peerConnection.removeEventListener(
        'icegatheringstatechange',
        onIceGatheringStateChange
      )
      peerConnection.removeEventListener('icecandidate', onIceCandidate)
      resolve()
    }

    const onIceGatheringStateChange = (): void => {
      if (peerConnection.iceGatheringState === 'complete') cleanup()
    }

    const onIceCandidate = (event: RTCPeerConnectionIceEvent): void => {
      if (!event.candidate) cleanup()
    }

    peerConnection.addEventListener(
      'icegatheringstatechange',
      onIceGatheringStateChange
    )
    peerConnection.addEventListener('icecandidate', onIceCandidate)
  })
}

function waitForIncomingDataChannel(
  peerConnection: RTCPeerConnection
): Promise<RTCDataChannel> {
  return new Promise<RTCDataChannel>((resolve, reject) => {
    const cleanup = (): void => {
      peerConnection.removeEventListener('datachannel', onDataChannel)
      peerConnection.removeEventListener(
        'connectionstatechange',
        onConnectionStateChange
      )
    }

    const onDataChannel = (event: RTCDataChannelEvent): void => {
      cleanup()
      resolve(event.channel)
    }

    const onConnectionStateChange = (): void => {
      if (
        peerConnection.connectionState === 'failed' ||
        peerConnection.connectionState === 'closed'
      ) {
        cleanup()
        reject(new TypeError('CHANNEL_NOT_AVAILABLE'))
      }
    }

    peerConnection.addEventListener('datachannel', onDataChannel)
    peerConnection.addEventListener(
      'connectionstatechange',
      onConnectionStateChange
    )
  })
}

function waitForChannelOpen(channel: RTCDataChannel): Promise<void> {
  if (channel.readyState === 'open') return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const cleanup = (): void => {
      channel.removeEventListener('open', onOpen)
      channel.removeEventListener('close', onClose)
      channel.removeEventListener('error', onError)
    }

    const onOpen = (): void => {
      cleanup()
      resolve()
    }

    const onClose = (): void => {
      cleanup()
      reject(new TypeError('CHANNEL_CLOSED'))
    }

    const onError = (): void => {
      cleanup()
      reject(new TypeError('CHANNEL_ERROR'))
    }

    channel.addEventListener('open', onOpen)
    channel.addEventListener('close', onClose)
    channel.addEventListener('error', onError)
  })
}

export class P2PConnection {
  static #pendingOfferorSide = new Map<
    Offer['offerId'],
    {
      peerConnection: RTCPeerConnection
      channel: RTCDataChannel
    }
  >()

  static #acceptedOffereeSide = new Map<
    Offer['offerId'],
    {
      peerConnection: RTCPeerConnection
      channelPromise: Promise<RTCDataChannel>
    }
  >()

  static async makeOffer(): Promise<Offer> {
    const peerConnection = new RTCPeerConnection({
      iceServers,
      iceTransportPolicy: 'all',
    })

    const channel = peerConnection.createDataChannel('data')
    const offerId = crypto.randomUUID()

    P2PConnection.#pendingOfferorSide.set(offerId, {
      peerConnection,
      channel,
    })

    await peerConnection.setLocalDescription(await peerConnection.createOffer())
    await waitForIceComplete(peerConnection)

    if (!peerConnection.localDescription)
      throw new TypeError('MISSING_LOCAL_DESCRIPTION')

    return {
      offerId,
      description: serializeDescription(peerConnection.localDescription),
    }
  }

  static async acceptOffer(
    offer: Offer
  ): Promise<{ offeror: OfferorPeerInit; offeree: OffereePeerInit }> {
    const peerConnection = new RTCPeerConnection({
      iceServers,
      iceTransportPolicy: 'all',
    })

    const channelPromise = waitForIncomingDataChannel(peerConnection)

    await peerConnection.setRemoteDescription(offer.description)
    await peerConnection.setLocalDescription(
      await peerConnection.createAnswer()
    )
    await waitForIceComplete(peerConnection)

    if (!peerConnection.localDescription)
      throw new TypeError('MISSING_LOCAL_DESCRIPTION')

    const answer = serializeDescription(peerConnection.localDescription)

    P2PConnection.#acceptedOffereeSide.set(offer.offerId, {
      peerConnection,
      channelPromise,
    })

    return {
      offeror: {
        offerId: offer.offerId,
        side: 'offeror',
        answer,
      },
      offeree: {
        offerId: offer.offerId,
        side: 'offeree',
      },
    }
  }

  #peerConnection: RTCPeerConnection
  #channelPromise: Promise<RTCDataChannel>
  #channel?: RTCDataChannel

  constructor(init: PeerInit) {
    if (init.side === 'offeror') {
      const pending = P2PConnection.#pendingOfferorSide.get(init.offerId)

      if (!pending) throw new TypeError('UNKNOWN_PEER_INIT')

      this.#peerConnection = pending.peerConnection
      this.#channel = pending.channel
      this.#channelPromise = Promise.resolve(pending.channel)
      P2PConnection.#pendingOfferorSide.delete(init.offerId)
      void this.#peerConnection.setRemoteDescription(init.answer)
      return
    }

    const accepted = P2PConnection.#acceptedOffereeSide.get(init.offerId)

    if (!accepted) throw new TypeError('UNKNOWN_PEER_INIT')

    this.#peerConnection = accepted.peerConnection
    this.#channelPromise = accepted.channelPromise.then((channel) => {
      this.#channel = channel
      return channel
    })

    P2PConnection.#acceptedOffereeSide.delete(init.offerId)
  }

  async ready(): Promise<void> {
    const channel = await this.#channelPromise
    await waitForChannelOpen(channel)
  }

  async channel(): Promise<RTCDataChannel> {
    return await this.#channelPromise
  }

  sendMessage(data: unknown): void {
    if (!this.#channel) throw new TypeError('CALL_READY_FIRST')
    this.#channel.send(encode(data))
  }

  onmessage(listener: (data: unknown, event: MessageEvent) => void): void {
    void this.#channelPromise.then((channel) => {
      channel.addEventListener('message', async (event) => {
        let data = event.data

        if (data instanceof Blob) {
          data = new Uint8Array(await data.arrayBuffer())
        } else if (data instanceof ArrayBuffer) {
          data = new Uint8Array(data)
        }

        if (data instanceof Uint8Array) {
          listener(decode(data), event)
          return
        }

        listener(data, event)
      })
    })
  }

  close(): void {
    this.#channel?.close()
    this.#peerConnection.close()
  }
}
