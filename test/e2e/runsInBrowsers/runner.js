import { P2PConnection } from '/dist/index.js'

const sessions = new Map()

function createDeferred() {
  let resolve
  let reject

  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

function createTimeout(promise, timeoutMs, label) {
  let timeoutId

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`timeout waiting for ${label} after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise,
  ])
}

function websocketUrl() {
  const url = new URL(window.location.href)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  url.pathname = '/ws'
  url.search = ''
  url.hash = ''
  return url.toString()
}

function bindPeer(session, peer) {
  session.peer = peer

  peer.addEventListener('message', ({ detail }) => {
    session.messages.push(detail)

    for (const waiter of [...session.messageWaiters]) {
      if (session.messages.length < waiter.count) continue

      waiter.resolve(structuredClone(session.messages))
      session.messageWaiters.delete(waiter)
    }
  })

  session.readyPromise = peer.ready().then(() => {
    session.readyAt = performance.now()
    session.ready.resolve({
      readyDurationMs: session.readyAt - session.createdAt,
    })
  })

  session.readyPromise.catch((error) => {
    session.ready.reject(error)
  })
}

async function handleSignal(session, payload) {
  if (payload.kind === 'offer') {
    const copies = await P2PConnection.acceptOffer(payload.offer, [])
    bindPeer(session, new P2PConnection(copies.offeree))

    session.socket.send(
      JSON.stringify({
        type: 'signal',
        toPeerId: session.remotePeerId,
        payload: {
          kind: 'contract',
          contract: copies.offeror,
        },
      })
    )
    return
  }

  if (payload.kind === 'contract') {
    bindPeer(session, new P2PConnection(payload.contract))
  }
}

window.__peer2peerTestKit = {
  async createSession({
    sessionId,
    roomId,
    peerId,
    remotePeerId,
    initiator,
  }) {
    const ready = createDeferred()
    const session = {
      createdAt: performance.now(),
      initiator,
      messageWaiters: new Set(),
      messages: [],
      peer: undefined,
      peerId,
      ready,
      readyAt: undefined,
      readyPromise: ready.promise,
      remotePeerId,
      roomId,
      sessionId,
      socket: new WebSocket(websocketUrl()),
    }

    session.socket.addEventListener('open', () => {
      session.socket.send(
        JSON.stringify({
          type: 'join',
          roomId,
          peerId,
        })
      )
    })

    session.socket.addEventListener('message', async ({ data }) => {
      const message = JSON.parse(String(data))

      if (message.type === 'joined') {
        if (!initiator) return

        const offer = await P2PConnection.makeOffer([])
        session.socket.send(
          JSON.stringify({
            type: 'signal',
            toPeerId: remotePeerId,
            payload: {
              kind: 'offer',
              offer,
            },
          })
        )
        return
      }

      if (message.type === 'signal') {
        await handleSignal(session, message.payload)
      }
    })

    sessions.set(sessionId, session)
  },

  async waitForReady(sessionId, timeoutMs = 5000) {
    const session = sessions.get(sessionId)
    return createTimeout(session.ready.promise, timeoutMs, `session ${sessionId}`)
  },

  async sendMessage(sessionId, message) {
    const session = sessions.get(sessionId)
    session.peer.sendMessage(message)
  },

  async waitForMessageCount(sessionId, count, timeoutMs = 5000) {
    const session = sessions.get(sessionId)

    if (session.messages.length >= count) {
      return structuredClone(session.messages)
    }

    const deferred = createDeferred()
    const waiter = {
      count,
      resolve: deferred.resolve,
    }

    session.messageWaiters.add(waiter)

    return createTimeout(
      deferred.promise.finally(() => {
        session.messageWaiters.delete(waiter)
      }),
      timeoutMs,
      `messages for session ${sessionId}`
    )
  },

  getMessages(sessionId) {
    return structuredClone(sessions.get(sessionId).messages)
  },

  getMetrics(sessionId) {
    const session = sessions.get(sessionId)

    return {
      readyDurationMs:
        session.readyAt === undefined
          ? undefined
          : session.readyAt - session.createdAt,
    }
  },

  async closeSession(sessionId) {
    const session = sessions.get(sessionId)
    if (!session) return

    session.peer?.closeConnection()
    session.socket.close()
    sessions.delete(sessionId)
  },
}

const status = document.getElementById('status')
if (status) status.textContent = 'ready'
