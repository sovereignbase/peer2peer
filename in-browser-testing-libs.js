import { P2PConnection } from './dist/index.js'
import { QR } from '@sovereignbase/qr'
import { CRList } from '@sovereignbase/convergent-replicated-list'
import { KVStore } from '@sovereignbase/offline-kv-store'

let peer = undefined

const messagesStore = new KVStore('messages')

document.getElementById('makeOffer').addEventListener('click', async () => {
  const offer = await P2PConnection.makeOffer()
  QR.display(JSON.stringify(offer))
})

document.getElementById('acceptOffer').addEventListener('click', async () => {
  const offer = JSON.parse(await QR.scan())
  const { offeror, offeree } = await P2PConnection.acceptOffer(offer)
  peer = new P2PConnection(offeree)
  QR.display(JSON.stringify(offeror))
  await peer.ready()

  peer.onmessage((data) => {
    document.body.append(document.createTextNode(String(data)))
    document.body.append(document.createElement('br'))
  })
})

document.getElementById('finishOffer').addEventListener('click', async () => {
  const offeror = JSON.parse(await QR.scan())

  peer = new P2PConnection(offeror)
  await peer.ready()

  peer.onmessage((data) => {
    messages.merge(data)
  })
})

let snapshot = undefined

if (await messagesStore.has('messages')) {
  snapshot = await messagesStore.get('messages')
}

const messages = new CRList(snapshot)

const messagesElement = document.getElementById('messages')

for (const message of messages) {
  messagesElement.append(document.createTextNode(String(message)))
  messagesElement.append(document.createElement('br'))
}

document.getElementById('send').addEventListener('click', (event) => {
  const msginput = document.getElementById('message-input')
  peer.send(msginput.value)
  msginput.value = 0
})

messages.addEventListener('delta', ({ detail }) => {
  peer.send(detail)
  messages.snapshot()
})

messages.addEventListener('change', ({ detail }) => {
  for (const value of Object.values(detail)) {
    messagesElement.append(document.createTextNode(String(value)))
    messagesElement.append(document.createElement('br'))
  }
})

messages.addEventListener('snapshot', ({ detail }) => {
  messagesStore.put('messages', detail)
})
