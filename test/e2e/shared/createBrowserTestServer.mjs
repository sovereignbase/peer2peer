import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'

import { WebSocketServer } from 'ws'

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.map': 'application/json',
  '.mjs': 'text/javascript',
}

function safeResolve(base, pathname) {
  const resolved = resolve(base, '.' + pathname)

  if (!resolved.startsWith(base)) return null

  return resolved
}

export function createBrowserTestServer() {
  const root = resolve(process.cwd())
  const testRoot = resolve(root, 'test', 'e2e')
  const rooms = new Map()

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    let pathname = url.pathname

    if (pathname === '/') pathname = '/runsInBrowsers/index.html'

    const filePath = pathname.startsWith('/dist/')
      ? safeResolve(root, pathname)
      : safeResolve(testRoot, pathname)

    if (!filePath) {
      res.statusCode = 400
      res.end('Bad request')
      return
    }

    try {
      const data = await readFile(filePath)
      res.statusCode = 200
      res.setHeader(
        'Content-Type',
        mimeTypes[extname(filePath)] ?? 'application/octet-stream'
      )
      res.end(data)
    } catch {
      res.statusCode = 404
      res.end('Not found')
    }
  })

  const websocketServer = new WebSocketServer({ noServer: true })

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1')

    if (url.pathname !== '/ws') {
      socket.destroy()
      return
    }

    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit('connection', websocket)
    })
  })

  websocketServer.on('connection', (websocket) => {
    let currentRoomId
    let currentPeerId

    websocket.on('message', (raw) => {
      const message = JSON.parse(String(raw))

      if (message.type === 'join') {
        currentRoomId = message.roomId
        currentPeerId = message.peerId

        const room = rooms.get(currentRoomId) ?? new Map()
        room.set(currentPeerId, websocket)
        rooms.set(currentRoomId, room)

        websocket.send(
          JSON.stringify({
            type: 'joined',
            peerId: currentPeerId,
          })
        )
        return
      }

      if (
        message.type === 'signal' &&
        currentRoomId &&
        currentPeerId &&
        rooms.has(currentRoomId)
      ) {
        const room = rooms.get(currentRoomId)
        const targets = message.toPeerId
          ? [room.get(message.toPeerId)].filter(Boolean)
          : [...room.entries()]
              .filter(([peerId]) => peerId !== currentPeerId)
              .map(([, target]) => target)

        for (const target of targets) {
          target.send(
            JSON.stringify({
              type: 'signal',
              fromPeerId: currentPeerId,
              payload: message.payload,
            })
          )
        }
      }
    })

    websocket.on('close', () => {
      if (!currentRoomId || !currentPeerId) return

      const room = rooms.get(currentRoomId)
      if (!room) return

      room.delete(currentPeerId)

      if (room.size === 0) {
        rooms.delete(currentRoomId)
      }
    })
  })

  return {
    async listen(port) {
      await new Promise((resolve) => {
        server.listen(port, '127.0.0.1', resolve)
      })
    },
    async close() {
      for (const client of websocketServer.clients) {
        client.close()
      }

      await new Promise((resolve) => websocketServer.close(resolve))
      await new Promise((resolve) => server.close(resolve))
    },
  }
}
