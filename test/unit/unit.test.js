import assert from 'node:assert/strict'
import test from 'node:test'

import { loadDist } from '../shared/loadDist.js'
import {
  FakeRTCPeerConnection,
  flushAsyncWork,
  installMockBrowserRuntime,
} from '../shared/mockBrowserRuntime.js'

function setupRuntime(t) {
  const runtime = installMockBrowserRuntime()
  t.after(() => runtime.restore())
  return runtime
}

test('unit: P2PConnectionError exposes code, message, and cause', async () => {
  const { P2PConnectionError } = await loadDist()

  const defaultError = new P2PConnectionError('CHANNEL_ERROR')
  assert.equal(defaultError.code, 'CHANNEL_ERROR')
  assert.equal(defaultError.message, '{@sovereignbase/peer2peer} CHANNEL_ERROR')

  const cause = new Error('root cause')
  const detailedError = new P2PConnectionError(
    'CONNECTION_NOT_READY',
    'specific failure',
    { cause }
  )
  assert.equal(detailedError.code, 'CONNECTION_NOT_READY')
  assert.equal(
    detailedError.message,
    '{@sovereignbase/peer2peer} specific failure'
  )
  assert.equal(detailedError.cause, cause)
})

test('unit: constructors reject unknown contracts with typed errors', async (t) => {
  setupRuntime(t)
  const { P2PConnection } = await loadDist()

  assert.throws(
    () =>
      new P2PConnection({
        role: 'offeror',
        offerId: 'missing-offer',
        answer: { type: 'answer', sdp: 'answer:missing-offer:initial' },
      }),
    /no pending offer exists/
  )

  assert.throws(
    () =>
      new P2PConnection({
        role: 'offeree',
        offerId: 'missing-offer',
      }),
    /no accepted offer exists/
  )
})

test('unit: makeOffer uses configured ICE servers and supports already-complete ICE', async (t) => {
  setupRuntime(t)
  FakeRTCPeerConnection.enqueueBehavior({ iceMode: 'complete' })

  const { P2PConnection } = await loadDist()
  const offer = await P2PConnection.makeOffer([{ urls: 'stun:example.test' }])

  assert.equal(offer.offerId, 'uuid-1')
  assert.equal(offer.description.type, 'offer')
  assert.equal(FakeRTCPeerConnection.instances.length, 1)
  assert.deepEqual(FakeRTCPeerConnection.instances[0].configuration, {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
      { urls: 'stun:example.test' },
    ],
    iceTransportPolicy: 'all',
  })
})

test('unit: makeOffer and acceptOffer surface missing local descriptions', async (t) => {
  setupRuntime(t)

  FakeRTCPeerConnection.enqueueBehavior({
    iceMode: 'complete',
    localDescriptionMode: 'null',
  })

  const { P2PConnection } = await loadDist()

  await assert.rejects(
    () => P2PConnection.makeOffer([]),
    /Failed to create an offer/
  )

  FakeRTCPeerConnection.reset()
  FakeRTCPeerConnection.enqueueBehavior({ iceMode: 'complete' })
  FakeRTCPeerConnection.enqueueBehavior({
    iceMode: 'candidate',
    localDescriptionMode: 'null',
  })

  const goodOffer = await P2PConnection.makeOffer([])

  await assert.rejects(
    () => P2PConnection.acceptOffer(goodOffer, []),
    /Failed to create an answer/
  )
})

test('unit: sendMessage rejects while the RTCDataChannel is not open', async (t) => {
  setupRuntime(t)

  FakeRTCPeerConnection.enqueueBehavior({
    iceMode: 'complete',
    initialOpenMode: 'manual',
  })
  FakeRTCPeerConnection.enqueueBehavior({ iceMode: 'complete' })

  const { P2PConnection } = await loadDist()

  const offer = await P2PConnection.makeOffer([])
  const copies = await P2PConnection.acceptOffer(offer, [])
  const offeror = new P2PConnection(copies.offeror)

  await flushAsyncWork()

  assert.throws(
    () => offeror.sendMessage({ kind: 'test' }),
    /RTCDataChannel is in the "connecting" state/
  )
})
