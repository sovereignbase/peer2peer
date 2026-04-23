let uuidCounter = 0
let peerConnectionCounter = 0
let streamCounter = 0
let trackCounter = 0

function createEvent(type, properties = {}) {
  const event = new Event(type)

  for (const [key, value] of Object.entries(properties)) {
    Object.defineProperty(event, key, {
      configurable: true,
      enumerable: true,
      value,
    })
  }

  return event
}

function createCustomEvent(type, detail) {
  const event = new Event(type)
  Object.defineProperty(event, 'detail', {
    configurable: true,
    enumerable: true,
    value: detail,
  })
  return event
}

function createDescription(type, ownerId, phase = 'initial') {
  return {
    type,
    sdp: `${type}:${ownerId}:${phase}`,
    ownerId,
    phase,
    toJSON() {
      return {
        type: this.type,
        sdp: this.sdp,
        ownerId: this.ownerId,
        phase: this.phase,
      }
    },
  }
}

function normalizeDescription(description, fallbackOwnerId) {
  return {
    type: description.type,
    sdp:
      description.sdp ?? `${description.type}:${fallbackOwnerId ?? 'remote'}`,
    ownerId: description.ownerId ?? fallbackOwnerId ?? 'remote',
    phase: description.phase ?? 'initial',
    toJSON() {
      return {
        type: this.type,
        sdp: this.sdp,
        ownerId: this.ownerId,
        phase: this.phase,
      }
    },
  }
}

export class FakeTrack {
  constructor(kind, id = `${kind}-${++trackCounter}`) {
    this.kind = kind
    this.id = id
  }
}

export class FakeMediaStream {
  constructor(tracks = [], id = `stream-${++streamCounter}`) {
    this.id = id
    this._tracks = [...tracks]
  }

  getAudioTracks() {
    return this._tracks.filter((track) => track.kind === 'audio')
  }

  getVideoTracks() {
    return this._tracks.filter((track) => track.kind === 'video')
  }
}

export class FakeVideoElement {
  constructor() {
    this.autoplay = false
    this.playsInline = false
    this.muted = false
    this.srcObject = undefined
    this.playCount = 0
  }

  async play() {
    this.playCount += 1
  }
}

class FakeDocument {
  constructor() {
    this.createdElements = []
    this.head = {
      appended: [],
      append: (...nodes) => {
        this.head.appended.push(...nodes)
      },
    }
  }

  createElement(tagName) {
    if (tagName !== 'video') {
      throw new Error(`Unsupported tag requested in test runtime: ${tagName}`)
    }

    const element = new FakeVideoElement()
    this.createdElements.push(element)
    return element
  }
}

export class FakeRTCDataChannel extends EventTarget {
  constructor(label = 'data') {
    super()
    this.label = label
    this.readyState = 'connecting'
    this.sent = []
    this.peer = undefined
  }

  link(peer) {
    this.peer = peer
  }

  send(data) {
    this.sent.push(data)

    if (!this.peer) return

    queueMicrotask(() => {
      this.peer.dispatchEvent(createEvent('message', { data }))
    })
  }

  open() {
    if (this.readyState === 'open') return
    this.readyState = 'open'
    this.dispatchEvent(new Event('open'))
  }

  fail() {
    this.dispatchEvent(new Event('error'))
  }

  close() {
    if (this.readyState === 'closed') return
    this.readyState = 'closed'
    this.dispatchEvent(new Event('close'))
  }
}

export class FakeRTCPeerConnection extends EventTarget {
  static behaviorQueue = []
  static instances = []
  static instancesById = new Map()

  static enqueueBehavior(behavior = {}) {
    this.behaviorQueue.push(behavior)
  }

  static reset() {
    this.behaviorQueue = []
    this.instances = []
    this.instancesById = new Map()
    peerConnectionCounter = 0
  }

  constructor(configuration) {
    super()
    this.configuration = configuration
    this.id = `pc-${++peerConnectionCounter}`
    this.behavior = {
      iceMode: 'state',
      localDescriptionMode: 'set',
      initialDataChannelMode: 'emit',
      initialOpenMode: 'auto',
      ...FakeRTCPeerConnection.behaviorQueue.shift(),
    }
    this.iceGatheringState =
      this.behavior.iceMode === 'complete' ? 'complete' : 'gathering'
    this.connectionState = 'new'
    this.signalingState = 'stable'
    this.localDescription = null
    this.remoteDescription = null
    this.localDataChannel = undefined
    this.remoteDataChannel = undefined
    this.remotePeer = undefined
    this.addedTracks = []
    this.removedTracks = []

    FakeRTCPeerConnection.instances.push(this)
    FakeRTCPeerConnection.instancesById.set(this.id, this)
  }

  async createOffer() {
    const phase = this.remotePeer ? 'renegotiate' : 'initial'
    return createDescription('offer', this.id, phase)
  }

  async createAnswer() {
    const phase =
      this.remoteDescription?.phase === 'renegotiate'
        ? 'renegotiate'
        : 'initial'
    return createDescription('answer', this.id, phase)
  }

  createDataChannel(label) {
    this.localDataChannel = new FakeRTCDataChannel(label)
    return this.localDataChannel
  }

  async setLocalDescription(description) {
    const normalized = normalizeDescription(description, this.id)

    this.signalingState =
      normalized.type === 'offer' ? 'have-local-offer' : 'stable'
    this.localDescription =
      this.behavior.localDescriptionMode === 'null' ? null : normalized

    if (this.behavior.iceMode === 'state') {
      queueMicrotask(() => {
        this.iceGatheringState = 'complete'
        this.dispatchEvent(new Event('icegatheringstatechange'))
      })
    }

    if (this.behavior.iceMode === 'candidate') {
      queueMicrotask(() => {
        this.iceGatheringState = 'complete'
        this.dispatchEvent(createEvent('icecandidate', { candidate: null }))
      })
    }
  }

  async setRemoteDescription(description) {
    const normalized = normalizeDescription(description)

    this.remoteDescription = normalized
    this.signalingState =
      normalized.type === 'offer' ? 'have-remote-offer' : 'stable'

    if (
      normalized.type === 'offer' &&
      normalized.phase === 'initial' &&
      !this.remotePeer
    ) {
      const offeror = FakeRTCPeerConnection.instancesById.get(
        normalized.ownerId
      )

      if (
        offeror &&
        offeror.localDataChannel &&
        this.behavior.initialDataChannelMode === 'emit'
      ) {
        const incomingChannel = new FakeRTCDataChannel('data')
        offeror.localDataChannel.link(incomingChannel)
        incomingChannel.link(offeror.localDataChannel)
        offeror.remotePeer = this
        offeror.remoteDataChannel = incomingChannel
        this.remotePeer = offeror
        this.remoteDataChannel = incomingChannel

        queueMicrotask(() => {
          this.dispatchEvent(
            createEvent('datachannel', {
              channel: incomingChannel,
            })
          )
        })
      }
    }

    if (
      normalized.type === 'answer' &&
      normalized.phase === 'initial' &&
      this.localDataChannel &&
      this.remoteDataChannel
    ) {
      this.connectionState = 'connected'
      if (this.remotePeer) this.remotePeer.connectionState = 'connected'

      queueMicrotask(() => {
        this.dispatchEvent(new Event('connectionstatechange'))
        if (this.remotePeer) {
          this.remotePeer.dispatchEvent(new Event('connectionstatechange'))
        }
      })

      if (this.behavior.initialOpenMode === 'auto') {
        queueMicrotask(() => {
          this.localDataChannel.open()
          this.remoteDataChannel.open()
        })
      }
    }
  }

  addTrack(track, stream) {
    const sender = {
      id: `sender-${this.addedTracks.length + 1}`,
      track,
      stream,
    }

    this.addedTracks.push(sender)

    if (this.remotePeer) {
      queueMicrotask(() => {
        this.remotePeer.dispatchEvent(
          createEvent('track', {
            track,
            streams: [stream],
          })
        )
      })
    }

    queueMicrotask(() => {
      this.dispatchEvent(new Event('negotiationneeded'))
    })

    return sender
  }

  removeTrack(sender) {
    this.removedTracks.push(sender)
  }

  failConnection() {
    this.connectionState = 'failed'
    this.dispatchEvent(new Event('connectionstatechange'))
  }

  close() {
    this.connectionState = 'closed'
    this.dispatchEvent(new Event('connectionstatechange'))
  }
}

function createDefaultCustomEventClass() {
  return class CustomEventPolyfill extends Event {
    constructor(type, init = {}) {
      super(type)
      this.detail = init.detail
    }
  }
}

function setGlobal(name, value, originals) {
  originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  })
}

export function createMediaStream({ audio = 1, video = 1, id } = {}) {
  const tracks = []

  for (let index = 0; index < audio; index += 1) {
    tracks.push(new FakeTrack('audio'))
  }

  for (let index = 0; index < video; index += 1) {
    tracks.push(new FakeTrack('video'))
  }

  return new FakeMediaStream(tracks, id)
}

export async function flushAsyncWork() {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

export function installMockBrowserRuntime() {
  uuidCounter = 0
  streamCounter = 0
  trackCounter = 0
  FakeRTCPeerConnection.reset()

  const originals = new Map()
  const document = new FakeDocument()
  const userMediaQueue = []
  const displayMediaQueue = []

  setGlobal(
    'crypto',
    {
      randomUUID: () => `uuid-${++uuidCounter}`,
    },
    originals
  )
  setGlobal('document', document, originals)
  setGlobal(
    'navigator',
    {
      mediaDevices: {
        async getUserMedia() {
          return userMediaQueue.shift() ?? createMediaStream()
        },
        async getDisplayMedia() {
          return displayMediaQueue.shift() ?? createMediaStream()
        },
      },
    },
    originals
  )
  setGlobal('RTCPeerConnection', FakeRTCPeerConnection, originals)
  setGlobal('MediaStream', FakeMediaStream, originals)

  if (typeof globalThis.CustomEvent === 'undefined') {
    setGlobal('CustomEvent', createDefaultCustomEventClass(), originals)
  }

  return {
    document,
    queueUserMedia(stream) {
      userMediaQueue.push(stream)
    },
    queueDisplayMedia(stream) {
      displayMediaQueue.push(stream)
    },
    createMediaStream,
    createCustomEvent,
    restore() {
      for (const [name, descriptor] of originals.entries()) {
        if (descriptor) {
          Object.defineProperty(globalThis, name, descriptor)
          continue
        }

        delete globalThis[name]
      }
    },
  }
}
