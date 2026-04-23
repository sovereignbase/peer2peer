import { QR } from '@sovereignbase/qr'
import {
  CRList,
  type CRListDelta,
  type CRListSnapshot,
} from '@sovereignbase/convergent-replicated-list'
import { KVStore } from '@sovereignbase/offline-kv-store'
import { P2PConnection, type Offer, type OfferorCopy } from './dist/index.js'

type ChatMessage = {
  name: string
  text: string
}

type PeerMessage =
  | { kind: 'snapshot'; payload: CRListSnapshot<ChatMessage> }
  | { kind: 'delta'; payload: CRListDelta<ChatMessage> }
  | { kind: 'camera-shared' }
  | { kind: 'microphone-shared' }
  | { kind: 'screen-shared' }
  | { kind: 'camera-muted' }
  | { kind: 'microphone-muted' }
  | { kind: 'screen-muted' }

/** Pointers */
let peer: P2PConnection<PeerMessage> | undefined

const profileStore = new KVStore<string>('profile')
const messagesStore = new KVStore<CRListSnapshot<ChatMessage>>('messages')

const snapshot = (await messagesStore.get('messages')) ?? undefined
const messages = new CRList<ChatMessage>(snapshot)

const nameInput = document.getElementById('name')

const makeOfferButton = document.getElementById('makeOffer')
const acceptOfferButton = document.getElementById('acceptOffer')
const finishOfferButton = document.getElementById('finishOffer')

const messagesElement = document.getElementById('messages')
const messageInput = document.getElementById('message-input')
const sendMessageButton = document.getElementById('sendMessage')

const shareMicrophoneButton = document.getElementById('shareMicrophone')
const stopSharingMicrophoneButton = document.getElementById(
  'stopSharingMicrophone'
)
const unmuteRemoteMicrophoneButton = document.getElementById(
  'unmuteRemoteMicrophone'
)
const muteRemoteMicrophoneButton = document.getElementById(
  'muteRemoteMicrophone'
)

const localCameraMount = document.getElementById('localCameraMount')
const remoteCameraMount = document.getElementById('remoteCameraMount')
const shareCameraButton = document.getElementById('shareCamera')
const stopSharingCameraButton = document.getElementById('stopSharingCamera')
const showCameraButton = document.getElementById('showCamera')
const hideCameraButton = document.getElementById('hideCamera')

const shareScreenButton = document.getElementById('shareScreen')
const stopSharingScreenButton = document.getElementById('stopSharingScreen')
const showScreenButton = document.getElementById('showScreen')
const hideScreenButton = document.getElementById('hideScreen')
const localScreenMount = document.getElementById('localScreenMount')
const remoteScreenMount = document.getElementById('remoteScreenMount')

/** Helpers */
function appendMessage(message: ChatMessage): void {
  if (!messagesElement) return

  void messagesElement.append(
    document.createTextNode(`${message.name}: ${message.text}`)
  )
  void messagesElement.append(document.createElement('br'))
}

function renderMessages(messages: CRList<ChatMessage>): void {
  if (!messagesElement) return

  messagesElement.textContent = ''

  for (const message of messages) void appendMessage(message)
}

function setupWire(
  connection: P2PConnection<PeerMessage>,
  messages: CRList<ChatMessage>
): void {
  peer = connection
  remoteCameraMount?.replaceChildren()
  remoteScreenMount?.replaceChildren()

  void connection.addEventListener('camera', ({ detail }) => {
    remoteCameraMount?.replaceChildren(detail)
  })

  void connection.addEventListener('screen', ({ detail }) => {
    remoteScreenMount?.replaceChildren(detail)
  })

  void connection.addEventListener('message', ({ detail }) => {
    switch (detail.kind) {
      case 'snapshot': {
        void window.dispatchEvent(new PointerEvent('pointerup'))
        void messages.merge(detail.payload)
        void setTimeout(() => void renderMessages(messages), 10)
        break
      }
      case 'delta': {
        void messages.merge(detail.payload)
        break
      }
      case 'microphone-shared': {
        if (peer?.remoteCameraVideoElement) {
          peer.remoteCameraVideoElement.muted = false
        }
        break
      }
      case 'camera-shared': {
        if (remoteCameraMount && peer?.remoteCameraVideoElement) {
          void remoteCameraMount.replaceChildren(peer.remoteCameraVideoElement)
        }
        break
      }
      case 'screen-shared': {
        if (remoteScreenMount && peer?.remoteScreenVideoElement) {
          void remoteScreenMount.replaceChildren(peer.remoteScreenVideoElement)
        }
        break
      }
      case 'microphone-muted': {
        if (peer?.remoteCameraVideoElement) {
          peer.remoteCameraVideoElement.muted = true
        }
        break
      }
      case 'camera-muted': {
        if (peer?.remoteCameraVideoElement) {
          void document.head.append(peer.remoteCameraVideoElement)
        } else {
          void remoteCameraMount?.replaceChildren()
        }
        break
      }
      case 'screen-muted': {
        void remoteScreenMount?.replaceChildren()
        break
      }
    }
  })
}

/** Script */
if (nameInput instanceof HTMLInputElement) {
  nameInput.value = (await profileStore.get('name')) ?? ''

  void nameInput.addEventListener('change', () => {
    void profileStore.put('name', nameInput.value.trim())
  })
}

if (makeOfferButton instanceof HTMLButtonElement) {
  void makeOfferButton.addEventListener('click', async () => {
    const offer = await P2PConnection.makeOffer()
    const optimized = await QR.optimizeEncoding(JSON.stringify(offer))
    void QR.display(optimized)
  })
}

if (acceptOfferButton instanceof HTMLButtonElement) {
  void acceptOfferButton.addEventListener('click', async () => {
    const signal = await QR.scan()
    const offer = JSON.parse(await QR.restoreEncoding(signal)) as Offer
    const { offeror, offeree } = await P2PConnection.acceptOffer(offer)

    void setupWire(new P2PConnection(offeree), messages)
    const optimized = await QR.optimizeEncoding(JSON.stringify(offeror))
    void QR.display(optimized)

    if (!peer) return

    void (await peer.ready())
    void peer.sendMessage({ kind: 'snapshot', payload: messages.toJSON() })
  })
}

if (finishOfferButton instanceof HTMLButtonElement) {
  void finishOfferButton.addEventListener('click', async () => {
    const signal = await QR.scan()
    const offeror = JSON.parse(await QR.restoreEncoding(signal)) as OfferorCopy

    void setupWire(new P2PConnection(offeror), messages)

    if (!peer) return

    void (await peer.ready())
    void peer.sendMessage({ kind: 'snapshot', payload: messages.toJSON() })
  })
}

if (
  sendMessageButton instanceof HTMLButtonElement &&
  messageInput instanceof HTMLInputElement &&
  nameInput instanceof HTMLInputElement
) {
  void sendMessageButton.addEventListener('click', () => {
    const text = messageInput.value.trim()
    if (!text) return

    void messages.append({
      name: nameInput.value.trim() || 'Anonymous',
      text,
    })

    messageInput.value = ''
  })
}

void messages.addEventListener('delta', ({ detail }) => {
  if (peer) void peer.sendMessage({ kind: 'delta', payload: detail })
  void messages.snapshot()
})

void messages.addEventListener('change', ({ detail }) => {
  for (const value of Object.values(detail)) {
    if (value) void appendMessage(value)
  }
})

void messages.addEventListener('snapshot', ({ detail }) => {
  void messagesStore.put('messages', detail)
})

void renderMessages(messages)

if (shareMicrophoneButton instanceof HTMLButtonElement) {
  void shareMicrophoneButton.addEventListener('click', async () => {
    if (!peer) return
    void (await peer.shareMicrophone())
    void peer.sendMessage({ kind: 'microphone-shared' })
  })
}

if (stopSharingMicrophoneButton instanceof HTMLButtonElement) {
  void stopSharingMicrophoneButton.addEventListener('click', () => {
    if (!peer) return
    void peer.stopSharingMicrophone()
    void peer.sendMessage({ kind: 'microphone-muted' })
  })
}

if (unmuteRemoteMicrophoneButton instanceof HTMLButtonElement) {
  void unmuteRemoteMicrophoneButton.addEventListener('click', () => {
    if (peer?.remoteCameraVideoElement) {
      peer.remoteCameraVideoElement.muted = false
    }
  })
}

if (muteRemoteMicrophoneButton instanceof HTMLButtonElement) {
  void muteRemoteMicrophoneButton.addEventListener('click', () => {
    if (peer?.remoteCameraVideoElement) {
      peer.remoteCameraVideoElement.muted = true
    }
  })
}

if (shareCameraButton instanceof HTMLButtonElement) {
  void shareCameraButton.addEventListener('click', async () => {
    if (!peer) return
    void (await peer.shareCamera())
    if (localCameraMount && P2PConnection.localCameraVideoElement) {
      void localCameraMount.replaceChildren(
        P2PConnection.localCameraVideoElement
      )
    }
    void peer.sendMessage({ kind: 'camera-shared' })
  })
}

if (stopSharingCameraButton instanceof HTMLButtonElement) {
  void stopSharingCameraButton.addEventListener('click', () => {
    if (!peer) return
    void peer.stopSharingCamera()
    void localCameraMount?.replaceChildren()
    void peer.sendMessage({ kind: 'camera-muted' })
  })
}

if (showCameraButton instanceof HTMLButtonElement) {
  void showCameraButton.addEventListener('click', () => {
    if (remoteCameraMount && peer?.remoteCameraVideoElement) {
      void remoteCameraMount.replaceChildren(peer.remoteCameraVideoElement)
    }
  })
}

if (hideCameraButton instanceof HTMLButtonElement) {
  void hideCameraButton.addEventListener('click', () => {
    if (peer?.remoteCameraVideoElement) {
      void document.head.append(peer.remoteCameraVideoElement)
    } else {
      void remoteCameraMount?.replaceChildren()
    }
  })
}

if (shareScreenButton instanceof HTMLButtonElement) {
  void shareScreenButton.addEventListener('click', async () => {
    if (!peer) return
    void (await peer.shareScreen())
    if (localScreenMount && P2PConnection.localScreenVideoElement) {
      void localScreenMount.replaceChildren(
        P2PConnection.localScreenVideoElement
      )
    }
    void peer.sendMessage({ kind: 'screen-shared' })
  })
}

if (stopSharingScreenButton instanceof HTMLButtonElement) {
  void stopSharingScreenButton.addEventListener('click', () => {
    if (!peer) return
    void peer.stopSharingScreen()
    void localScreenMount?.replaceChildren()
    void peer.sendMessage({ kind: 'screen-muted' })
  })
}

if (showScreenButton instanceof HTMLButtonElement) {
  void showScreenButton.addEventListener('click', () => {
    if (remoteScreenMount && peer?.remoteScreenVideoElement) {
      void remoteScreenMount.replaceChildren(peer.remoteScreenVideoElement)
    }
  })
}

if (hideScreenButton instanceof HTMLButtonElement) {
  void hideScreenButton.addEventListener('click', () => {
    if (peer?.remoteScreenVideoElement) {
      void document.head.append(peer.remoteScreenVideoElement)
    } else {
      void remoteScreenMount?.replaceChildren()
    }
  })
}
