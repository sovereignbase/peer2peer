import { createServer } from 'node:net'
import process from 'node:process'

import { chromium } from 'playwright'

import { createBrowserTestServer } from '../test/e2e/shared/createBrowserTestServer.mjs'

const HANDSHAKE_ITERATIONS = 10
const MESSAGE_ITERATIONS = 50

async function findOpenPort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()

      if (!address || typeof address === 'string') {
        server.close(() =>
          reject(new Error('failed to resolve benchmark port'))
        )
        return
      }

      server.close((error) => {
        if (error) reject(error)
        else resolvePort(address.port)
      })
    })
  })
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function minimum(values) {
  return values.reduce((current, value) => Math.min(current, value), values[0])
}

function maximum(values) {
  return values.reduce((current, value) => Math.max(current, value), values[0])
}

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
  await page.evaluate(
    (id) => window.__peer2peerTestKit.closeSession(id),
    sessionId
  )
}

async function main() {
  const port = await findOpenPort()
  const baseUrl = `http://127.0.0.1:${port}`
  const server = createBrowserTestServer()
  await server.listen(port)

  const browser = await chromium.launch()
  const handshakeSamples = []
  const messageSamples = []

  try {
    for (let index = 0; index < HANDSHAKE_ITERATIONS; index += 1) {
      const roomId = `bench-room-${index}-${Date.now()}`
      const contextA = await browser.newContext()
      const contextB = await browser.newContext()
      const pageA = await contextA.newPage()
      const pageB = await contextB.newPage()

      try {
        await Promise.all([pageA.goto(baseUrl), pageB.goto(baseUrl)])
        await Promise.all([
          pageA.waitForFunction(() => window.__peer2peerTestKit),
          pageB.waitForFunction(() => window.__peer2peerTestKit),
        ])

        await createPeer(pageB, {
          sessionId: 'bench-b',
          roomId,
          peerId: 'bench-b',
          remotePeerId: 'bench-a',
          initiator: false,
        })
        await createPeer(pageA, {
          sessionId: 'bench-a',
          roomId,
          peerId: 'bench-a',
          remotePeerId: 'bench-b',
          initiator: true,
        })

        const [metricsA, metricsB] = await Promise.all([
          waitForReady(pageA, 'bench-a'),
          waitForReady(pageB, 'bench-b'),
        ])

        handshakeSamples.push(
          Math.max(metricsA.readyDurationMs, metricsB.readyDurationMs)
        )

        for (
          let messageIndex = 0;
          messageIndex < MESSAGE_ITERATIONS;
          messageIndex += 1
        ) {
          const startedAt = performance.now()

          await sendMessage(pageA, 'bench-a', {
            iteration: index,
            sequence: messageIndex,
          })
          await waitForMessages(pageB, 'bench-b', messageIndex + 1)

          messageSamples.push(performance.now() - startedAt)
        }
      } finally {
        await Promise.all([
          closePeer(pageA, 'bench-a'),
          closePeer(pageB, 'bench-b'),
        ])
        await Promise.all([contextA.close(), contextB.close()])
      }
    }
  } finally {
    await browser.close()
    await server.close()
  }

  const totalMessageTime = messageSamples.reduce((sum, value) => sum + value, 0)
  const messageThroughput = (messageSamples.length / totalMessageTime) * 1000

  console.log('peer2peer benchmark')
  console.log(`Environment: Node ${process.version} + Playwright Chromium`)
  console.log(`Base URL: ${baseUrl}`)
  console.log(`Handshake iterations: ${HANDSHAKE_ITERATIONS}`)
  console.log(`Message samples: ${messageSamples.length}`)
  console.log('')
  console.log('| Benchmark | Average | Min | Max |')
  console.log('| --- | ---: | ---: | ---: |')
  console.log(
    `| websocket-signaled ready() | ${average(handshakeSamples).toFixed(2)} ms | ${minimum(handshakeSamples).toFixed(2)} ms | ${maximum(handshakeSamples).toFixed(2)} ms |`
  )
  console.log(
    `| one-way sendMessage() delivery | ${average(messageSamples).toFixed(2)} ms | ${minimum(messageSamples).toFixed(2)} ms | ${maximum(messageSamples).toFixed(2)} ms |`
  )
  console.log(
    `| message throughput | ${messageThroughput.toFixed(2)} msg/s | - | - |`
  )
  console.log('')
  console.log('Results vary by machine.')
}

await main()
