import { P2PConnection } from './dist/index.js'
import { QR } from '@sovereignbase/qr'
import { CRList } from '@sovereignbase/convergent-replicated-list'
import { KVStore } from '@sovereignbase/offline-kv-store'

let peer = undefined

const messagesStore = new KVStore('messages')
const messagesElement = document.getElementById('messages')
const nameInput = document.getElementById('name')
let profile = (await messagesStore.get('profile')) ?? { name: '' }

nameInput.value = profile.name ?? ''

function appendMessage(message) {
  const value =
    message && typeof message === 'object'
      ? `${message.name || 'Anonymous'}: ${message.text || ''}`
      : String(message)
  messagesElement.append(document.createTextNode(value))
  messagesElement.append(document.createElement('br'))
}

function renderMessages() {
  messagesElement.textContent = ''

  for (const message of messages) {
    appendMessage(message)
  }
}

function closeQrDisplay() {
  window.dispatchEvent(new PointerEvent('pointerup'))
  window.dispatchEvent(new MouseEvent('mouseup'))
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
}

function setupPeer(nextPeer) {
  peer = nextPeer
  peer.onmessage((data) => {
    if (data === 'connected') {
      closeQrDisplay()
      return
    }

    if (data && typeof data === 'object' && data.type === 'snapshot') {
      messages.merge(data.payload)
      renderMessages()
      return
    }

    if (data && typeof data === 'object' && data.type === 'delta') {
      messages.merge(data.payload)
      return
    }

    messages.merge(data)
  })
}

document.getElementById('makeOffer').addEventListener('click', async () => {
  const offer = await P2PConnection.makeOffer()
  QR.display(JSON.stringify(offer))
})

document.getElementById('acceptOffer').addEventListener('click', async () => {
  const offer = JSON.parse(await QR.scan())
  const { offeror, offeree } = await P2PConnection.acceptOffer(offer)
  setupPeer(new P2PConnection(offeree))
  QR.display(JSON.stringify(offeror))
  await peer.ready()
  peer.sendMessage({ type: 'snapshot', payload: messages.toJSON() })
})

document.getElementById('finishOffer').addEventListener('click', async () => {
  const offeror = JSON.parse(await QR.scan())

  setupPeer(new P2PConnection(offeror))
  await peer.ready()

  closeQrDisplay()
  peer.sendMessage('connected')
  peer.sendMessage({ type: 'snapshot', payload: messages.toJSON() })
})

let snapshot = undefined

if (await messagesStore.has('messages')) {
  snapshot = await messagesStore.get('messages')
}

const messages = new CRList(snapshot)
renderMessages()

document.getElementById('sendMessage').addEventListener('click', (event) => {
  const msginput = document.getElementById('message-input')
  const text = msginput.value.trim()
  if (!text) return
  messages.append({
    name: nameInput.value.trim() || 'Anonymous',
    text,
  })
  msginput.value = ''
})

messages.addEventListener('delta', ({ detail }) => {
  if (peer) peer.sendMessage({ type: 'delta', payload: detail })
  messages.snapshot()
})

messages.addEventListener('change', ({ detail }) => {
  for (const value of Object.values(detail)) {
    appendMessage(value)
  }
})

messages.addEventListener('snapshot', ({ detail }) => {
  messagesStore.put('messages', detail)
})

nameInput.addEventListener('change', () => {
  profile = { name: nameInput.value.trim() }
  messagesStore.put('profile', profile)
})
