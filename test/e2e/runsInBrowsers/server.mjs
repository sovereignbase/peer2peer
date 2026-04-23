import { createBrowserTestServer } from '../shared/createBrowserTestServer.mjs'

const server = createBrowserTestServer()
const port = Number.parseInt(process.env.PORT || '4173', 10)

await server.listen(port)
console.log(`peer2peer test server running at http://127.0.0.1:${port}`)

async function shutdown() {
  await server.close()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
