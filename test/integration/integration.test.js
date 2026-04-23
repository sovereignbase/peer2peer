import assert from 'node:assert/strict'
import test from 'node:test'

import { encode } from '@msgpack/msgpack'

import { loadDist } from '../shared/loadDist.js'
import {
  FakeRTCPeerConnection,
  FakeTrack,
  createMediaStream,
  flushAsyncWork,
  installMockBrowserRuntime,
} from '../shared/mockBrowserRuntime.js'

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

function setupRuntime(t) {
  const runtime = installMockBrowserRuntime()
  t.after(() => runtime.restore())
  return runtime
}

async function createConnectedPair({
  offerorBehavior = {},
  offereeBehavior = {},
} = {}) {
  FakeRTCPeerConnection.enqueueBehavior({
    iceMode: 'state',
    ...offerorBehavior,
  })
  FakeRTCPeerConnection.enqueueBehavior({
    iceMode: 'candidate',
    ...offereeBehavior,
  })

  const api = await loadDist()
  const offer = await api.P2PConnection.makeOffer()
  const copies = await api.P2PConnection.acceptOffer(offer)
  const offeror = new api.P2PConnection(copies.offeror)
  const offeree = new api.P2PConnection(copies.offeree)

  await flushAsyncWork()

  return {
    ...api,
    offeror,
    offeree,
  }
}

test('integration: connects peers, exchanges messages, shares media, and renegotiates', async (t) => {
  const runtime = setupRuntime(t)
  const { P2PConnection, offeror, offeree } = await createConnectedPair()

  const offerorMessages = []
  const offereeMessages = []
  const removedListenerMessages = []
  const cameraEvents = []
  const screenEvents = []

  const removedListener = (event) => {
    removedListenerMessages.push(event.detail)
  }

  offeror.addEventListener('message', (event) => {
    offerorMessages.push(event.detail)
  })
  offeree.addEventListener('message', (event) => {
    offereeMessages.push(event.detail)
  })
  offeree.addEventListener('message', removedListener)
  offeree.removeEventListener('message', removedListener)
  offeree.addEventListener('camera', (event) => {
    cameraEvents.push(event.detail)
  })
  offeree.addEventListener('screen', (event) => {
    screenEvents.push(event.detail)
  })

  await Promise.all([offeror.ready(), offeree.ready()])
  await offeror.ready()

  offeror.sendMessage({ from: 'offeror', text: 'hello' })
  offeree.sendMessage({ from: 'offeree', text: 'hi back' })
  await flushAsyncWork()

  assert.deepEqual(offerorMessages, [{ from: 'offeree', text: 'hi back' }])
  assert.deepEqual(offereeMessages, [{ from: 'offeror', text: 'hello' }])
  assert.deepEqual(removedListenerMessages, [])

  runtime.queueUserMedia(
    createMediaStream({ audio: 1, video: 1, id: 'user-1' })
  )
  runtime.queueDisplayMedia(
    createMediaStream({ audio: 1, video: 1, id: 'display-1' })
  )

  await offeror.shareMicrophone()
  await flushAsyncWork()

  await offeror.shareCamera()
  await flushAsyncWork()

  await offeror.shareCamera()
  await flushAsyncWork()

  await offeror.shareScreen()
  await flushAsyncWork()

  await offeror.shareScreen()
  await flushAsyncWork()

  assert.equal(P2PConnection.localCameraVideoElement?.muted, true)
  assert.equal(P2PConnection.localScreenVideoElement?.muted, true)
  assert.equal(offeror.peerConnection.addedTracks.length, 7)
  assert.equal(offeree.remoteCameraVideoElement?.playCount >= 1, true)
  assert.equal(offeree.remoteScreenVideoElement?.playCount >= 1, true)
  assert.equal(cameraEvents.length >= 1, true)
  assert.equal(screenEvents.length >= 1, true)
  assert.equal(runtime.document.createdElements.length >= 2, true)
  assert.equal(offeror.peerConnection.remoteDescription?.phase, 'renegotiate')
  assert.equal(offeree.peerConnection.remoteDescription?.phase, 'renegotiate')

  offeror.stopSharingMicrophone()
  offeror.stopSharingMicrophone()
  offeror.stopSharingCamera()
  offeror.stopSharingCamera()
  offeror.stopSharingScreen()
  offeror.stopSharingScreen()

  assert.equal(offeror.peerConnection.removedTracks.length, 4)

  offeror.closeConnection()
  assert.equal(offeror.peerConnection.connectionState, 'closed')
  assert.equal(offeror.channel.readyState, 'closed')
})

test('integration: track events without streams fall back to a synthetic MediaStream', async (t) => {
  setupRuntime(t)
  const { offeree } = await createConnectedPair()

  await Promise.all([offeree.ready(), offeree.ready()])

  offeree.peerConnection.dispatchEvent(
    createEvent('track', {
      track: new FakeTrack('video'),
      streams: [],
    })
  )
  await flushAsyncWork()

  assert.equal(
    offeree.remoteCameraVideoElement?.srcObject instanceof MediaStream,
    true
  )
})

test('integration: ready resolves when the data channel opens after listeners attach', async (t) => {
  setupRuntime(t)
  const { offeror } = await createConnectedPair({
    offerorBehavior: {
      iceMode: 'complete',
      initialOpenMode: 'manual',
    },
    offereeBehavior: { iceMode: 'complete' },
  })

  const readyPromise = offeror.ready()
  await flushAsyncWork()
  offeror.channel.open()

  await readyPromise
})

test('integration: shareCamera initializes user media when called first', async (t) => {
  const runtime = setupRuntime(t)
  const { P2PConnection, offeror, offeree } = await createConnectedPair()

  await Promise.all([offeror.ready(), offeree.ready()])

  runtime.queueUserMedia(
    createMediaStream({ audio: 1, video: 1, id: 'camera-first' })
  )

  await offeror.shareCamera()
  await flushAsyncWork()

  assert.equal(P2PConnection.localCameraVideoElement?.playCount, 1)
  assert.equal(offeror.peerConnection.addedTracks.length, 1)
})

test('integration: decoded null payloads are treated as application messages', async (t) => {
  setupRuntime(t)
  const { offeror, offeree } = await createConnectedPair()

  await Promise.all([offeror.ready(), offeree.ready()])

  const messages = []
  offeror.addEventListener('message', (event) => {
    messages.push(event.detail)
  })

  offeror.channel.dispatchEvent(
    createEvent('message', {
      data: encode(null),
    })
  )
  await flushAsyncWork()

  assert.deepEqual(messages, [null])
})

test('integration: share methods tolerate missing tracks and idle stop calls', async (t) => {
  const runtime = setupRuntime(t)
  const { P2PConnection, offeror, offeree } = await createConnectedPair()

  await Promise.all([offeror.ready(), offeree.ready()])

  offeror.stopSharingMicrophone()
  offeror.stopSharingCamera()
  offeror.stopSharingScreen()

  runtime.queueUserMedia(
    createMediaStream({ audio: 0, video: 0, id: 'empty-user' })
  )
  runtime.queueDisplayMedia(
    createMediaStream({ audio: 0, video: 0, id: 'empty-display' })
  )

  await offeror.shareMicrophone()
  await offeror.shareCamera()
  await offeror.shareScreen()
  await flushAsyncWork()

  assert.equal(offeror.peerConnection.addedTracks.length, 0)
  assert.equal(P2PConnection.localCameraVideoElement, undefined)
  assert.equal(P2PConnection.localScreenVideoElement?.playCount, 1)
})

test('integration: negotiationneeded is ignored when no data channel is attached yet', async (t) => {
  setupRuntime(t)

  FakeRTCPeerConnection.enqueueBehavior({ iceMode: 'complete' })
  FakeRTCPeerConnection.enqueueBehavior({
    iceMode: 'complete',
    initialDataChannelMode: 'none',
  })

  const { P2PConnection } = await loadDist()
  const offer = await P2PConnection.makeOffer()
  const copies = await P2PConnection.acceptOffer(offer)
  const offeree = new P2PConnection(copies.offeree)

  offeree.peerConnection.dispatchEvent(new Event('negotiationneeded'))
  await flushAsyncWork()

  const readyPromise = offeree.ready()
  offeree.closeConnection()

  await assert.rejects(
    () => readyPromise,
    /entered the "closed" state before it emitted a "datachannel" event/
  )
})

test('integration: ready rejects when the peer connection fails before a data channel arrives', async (t) => {
  setupRuntime(t)

  FakeRTCPeerConnection.enqueueBehavior({ iceMode: 'complete' })
  FakeRTCPeerConnection.enqueueBehavior({
    iceMode: 'complete',
    initialDataChannelMode: 'none',
  })

  const { P2PConnection } = await loadDist()
  const offer = await P2PConnection.makeOffer()
  const copies = await P2PConnection.acceptOffer(offer)
  const offeree = new P2PConnection(copies.offeree)

  const readyPromise = offeree.ready()
  offeree.peerConnection.failConnection()

  await assert.rejects(
    () => readyPromise,
    /entered the "failed" state before it emitted a "datachannel" event/
  )
})

test('integration: ready rejects when the data channel closes before opening', async (t) => {
  setupRuntime(t)
  const { offeror } = await createConnectedPair({
    offerorBehavior: {
      iceMode: 'complete',
      initialOpenMode: 'manual',
    },
    offereeBehavior: { iceMode: 'complete' },
  })

  const readyPromise = offeror.ready()
  await flushAsyncWork()
  offeror.channel.close()

  await assert.rejects(
    () => readyPromise,
    /closed before it reached the "open" state/
  )
})

test('integration: ready rejects when the data channel errors before opening', async (t) => {
  setupRuntime(t)
  const { offeror } = await createConnectedPair({
    offerorBehavior: {
      iceMode: 'complete',
      initialOpenMode: 'manual',
    },
    offereeBehavior: { iceMode: 'complete' },
  })

  const readyPromise = offeror.ready()
  await flushAsyncWork()
  offeror.channel.fail()

  await assert.rejects(
    () => readyPromise,
    /fired an "error" event before it reached the "open" state/
  )
})

test('integration: impolite peers ignore colliding renegotiation offers', async (t) => {
  setupRuntime(t)
  const { offeror, offeree } = await createConnectedPair()

  await Promise.all([offeror.ready(), offeree.ready()])

  offeror.peerConnection.signalingState = 'have-local-offer'
  const originalRemoteDescription = offeror.peerConnection.remoteDescription

  offeror.channel.dispatchEvent(
    createEvent('message', {
      data: encode({
        __anbs_peer2peer: 'renegotiate-offer',
        description: {
          type: 'offer',
          sdp: 'offer:collision:renegotiate',
          ownerId: 'collision-peer',
          phase: 'renegotiate',
        },
      }),
    })
  )

  await flushAsyncWork()

  assert.equal(
    offeror.peerConnection.remoteDescription,
    originalRemoteDescription
  )
})
