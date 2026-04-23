import { expect, test } from '@playwright/test'

async function createPeer(page, options) {
  await page.evaluate((config) => {
    return window.__peer2peerTestKit.createSession(config)
  }, options)
}

async function waitForReady(page, sessionId) {
  return page.evaluate((id) => {
    return window.__peer2peerTestKit.waitForReady(id)
  }, sessionId)
}

async function sendMessage(page, sessionId, message) {
  await page.evaluate(
    ({ id, payload }) => window.__peer2peerTestKit.sendMessage(id, payload),
    { id: sessionId, payload: message }
  )
}

async function waitForMessages(page, sessionId, count) {
  return page.evaluate(
    ({ id, size }) => window.__peer2peerTestKit.waitForMessageCount(id, size),
    { id: sessionId, size: count }
  )
}

async function closePeer(page, sessionId) {
  await page.evaluate((id) => window.__peer2peerTestKit.closeSession(id), sessionId)
}

test('connects two pages through websocket signaling and exchanges messages', async ({
  browser,
}, testInfo) => {
  const roomId = `room-${testInfo.project.name}-${Date.now()}`
  const contextA = await browser.newContext()
  const contextB = await browser.newContext()
  const pageA = await contextA.newPage()
  const pageB = await contextB.newPage()

  try {
    await Promise.all([pageA.goto('/'), pageB.goto('/')])
    await Promise.all([
      pageA.waitForFunction(() => window.__peer2peerTestKit),
      pageB.waitForFunction(() => window.__peer2peerTestKit),
    ])

    await createPeer(pageB, {
      sessionId: 'peer-b',
      roomId,
      peerId: 'peer-b',
      remotePeerId: 'peer-a',
      initiator: false,
    })
    await createPeer(pageA, {
      sessionId: 'peer-a',
      roomId,
      peerId: 'peer-a',
      remotePeerId: 'peer-b',
      initiator: true,
    })

    const [metricsA, metricsB] = await Promise.all([
      waitForReady(pageA, 'peer-a'),
      waitForReady(pageB, 'peer-b'),
    ])

    expect(metricsA.readyDurationMs).toBeGreaterThan(0)
    expect(metricsB.readyDurationMs).toBeGreaterThan(0)

    await sendMessage(pageA, 'peer-a', {
      from: 'peer-a',
      text: 'hello from a',
    })
    await sendMessage(pageB, 'peer-b', {
      from: 'peer-b',
      text: 'hello from b',
    })

    const [messagesA, messagesB] = await Promise.all([
      waitForMessages(pageA, 'peer-a', 1),
      waitForMessages(pageB, 'peer-b', 1),
    ])

    expect(messagesA).toEqual([{ from: 'peer-b', text: 'hello from b' }])
    expect(messagesB).toEqual([{ from: 'peer-a', text: 'hello from a' }])
  } finally {
    await Promise.all([closePeer(pageA, 'peer-a'), closePeer(pageB, 'peer-b')])
    await Promise.all([contextA.close(), contextB.close()])
  }
})

test('keeps simultaneous websocket-signaled connections isolated', async ({
  browser,
}, testInfo) => {
  const roomOne = `room-one-${testInfo.project.name}-${Date.now()}`
  const roomTwo = `room-two-${testInfo.project.name}-${Date.now()}`
  const contexts = await Promise.all([
    browser.newContext(),
    browser.newContext(),
    browser.newContext(),
    browser.newContext(),
  ])
  const [contextA1, contextB1, contextA2, contextB2] = contexts
  const pages = await Promise.all(contexts.map((context) => context.newPage()))
  const [pageA1, pageB1, pageA2, pageB2] = pages

  try {
    await Promise.all(pages.map((page) => page.goto('/')))
    await Promise.all(
      pages.map((page) => page.waitForFunction(() => window.__peer2peerTestKit))
    )

    await Promise.all([
      createPeer(pageB1, {
        sessionId: 'pair-1-b',
        roomId: roomOne,
        peerId: 'pair-1-b',
        remotePeerId: 'pair-1-a',
        initiator: false,
      }),
      createPeer(pageB2, {
        sessionId: 'pair-2-b',
        roomId: roomTwo,
        peerId: 'pair-2-b',
        remotePeerId: 'pair-2-a',
        initiator: false,
      }),
    ])

    await Promise.all([
      createPeer(pageA1, {
        sessionId: 'pair-1-a',
        roomId: roomOne,
        peerId: 'pair-1-a',
        remotePeerId: 'pair-1-b',
        initiator: true,
      }),
      createPeer(pageA2, {
        sessionId: 'pair-2-a',
        roomId: roomTwo,
        peerId: 'pair-2-a',
        remotePeerId: 'pair-2-b',
        initiator: true,
      }),
    ])

    await Promise.all([
      waitForReady(pageA1, 'pair-1-a'),
      waitForReady(pageB1, 'pair-1-b'),
      waitForReady(pageA2, 'pair-2-a'),
      waitForReady(pageB2, 'pair-2-b'),
    ])

    await Promise.all([
      sendMessage(pageA1, 'pair-1-a', { room: 1, text: 'first pair' }),
      sendMessage(pageA2, 'pair-2-a', { room: 2, text: 'second pair' }),
    ])

    const [messagesB1, messagesB2] = await Promise.all([
      waitForMessages(pageB1, 'pair-1-b', 1),
      waitForMessages(pageB2, 'pair-2-b', 1),
    ])

    expect(messagesB1).toEqual([{ room: 1, text: 'first pair' }])
    expect(messagesB2).toEqual([{ room: 2, text: 'second pair' }])
  } finally {
    await Promise.all([
      closePeer(pageA1, 'pair-1-a'),
      closePeer(pageB1, 'pair-1-b'),
      closePeer(pageA2, 'pair-2-a'),
      closePeer(pageB2, 'pair-2-b'),
    ])
    await Promise.all(contexts.map((context) => context.close()))
  }
})
