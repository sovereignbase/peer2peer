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

function resolveConnection(
  connection: P2PConnection<PeerMessage>,
  messages: CRList<ChatMessage>
): void {
  peer = connection
  void connection.addEventListener('message', ({ detail }) => {
    switch (detail.kind) {
      case 'snapshot': {
        void window.dispatchEvent(new PointerEvent('pointerup'))
        void messages.merge(detail.payload)
        void renderMessages(messages)
        break
      }
      case 'delta': {
        void messages.merge(detail.payload)
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
    const offer = await P2PConnection.makeOffer([])
    const optimized = await QR.optimizeEncoding(JSON.stringify(offer))
    void QR.display(optimized)
  })
}

if (acceptOfferButton instanceof HTMLButtonElement) {
  void acceptOfferButton.addEventListener('click', async () => {
    const signal = await QR.scan()
    const offer = JSON.parse(await QR.restoreEncoding(signal)) as Offer
    const { offeror, offeree } = await P2PConnection.acceptOffer(offer, [])

    void resolveConnection(new P2PConnection(offeree), messages)
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

    void resolveConnection(new P2PConnection(offeror), messages)

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
