import { QR } from '@sovereignbase/qr'
import { CRList } from '@sovereignbase/convergent-replicated-list'
import { KVStore } from '@sovereignbase/offline-kv-store'
import { P2PConnection } from './dist/index.js'

let peer = undefined

const messagesStore = new KVStore('messages')
const messagesElement = document.getElementById('messages')
const nameInput = document.getElementById('name')
const controlsElement = document.getElementById('controls')
const qrModeButton = document.getElementById('qrMode')
const copyPasteModeButton = document.getElementById('copyPasteMode')
let profile = (await messagesStore.get('profile')) ?? { name: '', demoMode: 'qr' }
let demoMode = profile.demoMode ?? 'qr'

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
  if (demoMode !== 'qr') return

  queueMicrotask(() => {
    window.dispatchEvent(new PointerEvent('pointerup'))
    window.dispatchEvent(new MouseEvent('mouseup'))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
  })
}

function setDemoMode(nextMode) {
  demoMode = nextMode
  profile = { ...profile, demoMode: nextMode }
  messagesStore.put('profile', profile)
  qrModeButton.setAttribute('aria-pressed', String(nextMode === 'qr'))
  copyPasteModeButton.setAttribute('aria-pressed', String(nextMode === 'copy'))
  renderControls()
}

function renderControls() {
  if (demoMode === 'qr') {
    controlsElement.innerHTML = `
      <div class="control-card">
        <h5>Step 1 (Device A)</h5>
        <p>Displays an RTCPeerConnection offer as a QR code.</p>
        <button id="makeOffer">Make an offer</button>
      </div>

      <div class="control-card">
        <h5>Step 2 (Device B)</h5>
        <p>Starts a QR scanner, processes the RTCPeerConnection offer, and displays an answer as a QR code.</p>
        <button id="acceptOffer">Accept the offer</button>
      </div>

      <div class="control-card">
        <h5>Step 3 (Device A)</h5>
        <p>Scans the QR code and completes the RTCPeerConnection setup.</p>
        <button id="finishOffer">Finish the offer</button>
      </div>
    `
  } else {
    controlsElement.innerHTML = `
      <div class="control-card">
        <h5>Step 1 (Device A)</h5>
        <p>Create an RTCPeerConnection offer and copy it to any channel you want.</p>
        <button id="makeOffer">Make an offer</button>
        <textarea id="offerOutput" placeholder="Offer appears here." readonly></textarea>
        <div class="field-actions">
          <button id="copyOffer" class="icon-button" type="button" aria-label="Copy offer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      <div class="control-card">
        <h5>Step 2 (Device B)</h5>
        <p>Paste the offer, process it, and copy the answer back to device A.</p>
        <textarea id="offerInput" placeholder="Paste offer here."></textarea>
        <div class="field-actions">
          <button id="pasteOffer" class="icon-button" type="button" aria-label="Paste offer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 4h-3.18C15.4 2.84 14.3 2 13 2h-2c-1.3 0-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7v-2H5V6h2v3h10V6h2v5h2V6a2 2 0 0 0-2-2Zm-8-1h2a1 1 0 0 1 1 1h-4a1 1 0 0 1 1-1Zm6 4H7V6h10v1Zm3 6v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2Z" />
            </svg>
            Paste
          </button>
        </div>
        <button id="acceptOffer">Accept the offer</button>
        <textarea id="answerOutput" placeholder="Answer appears here." readonly></textarea>
        <div class="field-actions">
          <button id="copyAnswer" class="icon-button" type="button" aria-label="Copy answer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      <div class="control-card">
        <h5>Step 3 (Device A)</h5>
        <p>Paste the answer and complete the RTCPeerConnection setup.</p>
        <textarea id="answerInput" placeholder="Paste answer here."></textarea>
        <div class="field-actions">
          <button id="pasteAnswer" class="icon-button" type="button" aria-label="Paste answer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 4h-3.18C15.4 2.84 14.3 2 13 2h-2c-1.3 0-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7v-2H5V6h2v3h10V6h2v5h2V6a2 2 0 0 0-2-2Zm-8-1h2a1 1 0 0 1 1 1h-4a1 1 0 0 1 1-1Zm6 4H7V6h10v1Zm3 6v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2Z" />
            </svg>
            Paste
          </button>
        </div>
        <button id="finishOffer">Finish the offer</button>
      </div>
    `
  }

  bindControlEvents()
}

function readHandshakeValue(id) {
  return JSON.parse(document.getElementById(id).value)
}

async function readSignal(kind) {
  if (demoMode === 'qr') return JSON.parse(await QR.scan())

  return readHandshakeValue(kind === 'offer' ? 'offerInput' : 'answerInput')
}

function writeSignal(kind, value) {
  const serialized = JSON.stringify(value)

  if (demoMode === 'qr') {
    QR.display(serialized)
    return
  }

  document.getElementById(kind === 'offer' ? 'offerOutput' : 'answerOutput').value =
    serialized
}

async function copyField(id) {
  const field = document.getElementById(id)
  if (!field?.value) return
  await navigator.clipboard.writeText(field.value)
}

async function pasteField(id) {
  const field = document.getElementById(id)
  if (!field) return
  field.value = await navigator.clipboard.readText()
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

function bindControlEvents() {
  document.getElementById('makeOffer').onclick = async () => {
    const offer = await P2PConnection.makeOffer()
    writeSignal('offer', offer)
  }

  document.getElementById('acceptOffer').onclick = async () => {
    const offer = await readSignal('offer')
    const { offeror, offeree } = await P2PConnection.acceptOffer(offer)
    setupPeer(new P2PConnection(offeree))
    writeSignal('answer', offeror)

    await peer.ready()
    peer.sendMessage({ type: 'snapshot', payload: messages.toJSON() })
  }

  document.getElementById('finishOffer').onclick = async () => {
    const offeror = await readSignal('answer')

    setupPeer(new P2PConnection(offeror))
    await peer.ready()

    closeQrDisplay()
    peer.sendMessage('connected')
    peer.sendMessage({ type: 'snapshot', payload: messages.toJSON() })
  }

  if (demoMode === 'copy') {
    document.getElementById('copyOffer').onclick = async () => {
      await copyField('offerOutput')
    }
    document.getElementById('pasteOffer').onclick = async () => {
      await pasteField('offerInput')
    }
    document.getElementById('copyAnswer').onclick = async () => {
      await copyField('answerOutput')
    }
    document.getElementById('pasteAnswer').onclick = async () => {
      await pasteField('answerInput')
    }
  }
}

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
  profile = { ...profile, name: nameInput.value.trim() }
  messagesStore.put('profile', profile)
})

qrModeButton.addEventListener('click', () => {
  setDemoMode('qr')
})

copyPasteModeButton.addEventListener('click', () => {
  setDemoMode('copy')
})

setDemoMode(demoMode)
