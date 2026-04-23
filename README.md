[![npm version](https://img.shields.io/npm/v/@sovereignbase/peer2peer)](https://www.npmjs.com/package/@sovereignbase/peer2peer)
[![CI](https://github.com/sovereignbase/peer2peer/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/peer2peer/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/peer2peer/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/peer2peer)
[![license](https://img.shields.io/npm/l/@sovereignbase/peer2peer)](LICENSE)

# peer2peer

Simple WebRTC wrapper for peer to peer connection setup in browsers. It creates
portable offer and contract objects that you move through your own signaling channel.

- [Try the demo](https://sovereignbase.dev/peer2peer)

- [Read the specification](https://sovereignbase.dev/peer2peer/spec)

- [Check the documentation](https://sovereignbase.dev/peer2peer/docs)

## Compatibility

- Runtimes: modern browsers with WebRTC support;
- Module format: ESM and CJS.
- Required globals / APIs: `RTCPeerConnection`, `RTCDataChannel`,
  `MediaStream`, `EventTarget`, `CustomEvent`, `crypto.randomUUID`; media
  sharing also needs `navigator.mediaDevices` and `document`.
- TypeScript: bundled types.

## Installation

```sh
npm install @sovereignbase/peer2peer
# or
pnpm add @sovereignbase/peer2peer
# or
yarn add @sovereignbase/peer2peer
# or
bun add @sovereignbase/peer2peer
# or
deno add jsr:@sovereignbase/peer2peer
# or
vlt install jsr:@sovereignbase/peer2peer
```

## Usage

### Create a connection

```ts
import { P2PConnection } from '@sovereignbase/peer2peer'

type Message = {
  type: 'chat'
  text: string
}

/**
 * Package uses 4 Google STUN Servers by default,
 * you can add additional turn or stun servers.
 *
 * For example `https://developers.cloudflare.com/realtime/turn/`.
 *
 * WebRTC is end-to-end encrypted by default.
 * As long as you stick to standard STUN or TURN servers and not use
 * something  like an SFU, all data is e2ee via DTLS
 */

const additionalIceServers: RTCIceServer[] = []

// Peer A
const offer = await P2PConnection.makeOffer(additionalIceServers)
// send `offer` to peer B using your own transport

// Peer B
const copies = await P2PConnection.acceptOffer(offer, additionalIceServers)
// send `copies.offeror` back to peer A
// keep `copies.offeree` on peer B

const peerA = new P2PConnection<Message>(copies.offeror)
const peerB = new P2PConnection<Message>(copies.offeree)

peerA.addEventListener('message', (event) => {
  console.log('peer A received', event.detail)
})

peerB.addEventListener('message', (event) => {
  console.log('peer B received', event.detail)
})

await peerA.ready()
await peerB.ready()

peerA.sendMessage({
  type: 'chat',
  text: 'hello from peer A',
})
```

### Share media

```ts
connection.addEventListener('camera', (event) => {
  document.body.append(event.detail) // HTMLVideoElement
})

connection.addEventListener('screen', (event) => {
  document.body.append(event.detail) // HTMLVideoElement
})

// Stream data
await connection.shareMicrophone()
await connection.shareCamera()
await connection.shareScreen()

// Stop streaming data
connection.stopSharingMicrophone()
connection.stopSharingCamera()
connection.stopSharingScreen()
```

Local preview elements are exposed as:

- `P2PConnection.localCameraVideoElement`
- `P2PConnection.localScreenVideoElement`

## Runtime behaviour

- Package does not provide signaling transport. You move `Offer` and `Contract`
  objects through your own channel, for example WebSocket, HTTP, QR, copy-paste
  or any other out-of-band transport.
- `P2PConnection.makeOffer()` and `P2PConnection.acceptOffer()` always include 4
  public Google STUN servers by default and append any additional ICE servers
  you pass in.
- `ready()` resolves only after the underlying `RTCDataChannel` reaches the
  `"open"` state. If the peer connection fails, closes, or the channel errors
  first, it rejects with a typed `P2PConnectionError`.
- `sendMessage()` uses MessagePack encoding via `@msgpack/msgpack`. The
  `"message"` event receives the decoded payload as `event.detail`.
- Media sharing is lazy and shared. `shareMicrophone()` and `shareCamera()`
  reuse one cached `getUserMedia()` stream, and `shareScreen()` reuses one
  cached `getDisplayMedia()` stream.
- Local preview elements are also shared through the static
  `P2PConnection.localCameraVideoElement` and
  `P2PConnection.localScreenVideoElement` properties.
- Track additions trigger automatic in-band renegotiation over the existing data
  channel. The offeree side behaves as the polite peer during glare handling.

### Errors

Failures throw `P2PConnectionError`. The `code` is stable and the `message`
describes the specific failure site.

Supported error codes:

- `CHANNEL_ERROR`
- `CHANNEL_CLOSED`
- `CHANNEL_NOT_AVAILABLE`
- `CONNECTION_NOT_READY`
- `UNKNOWN_PEER_CONTRACT`
- `MISSING_LOCAL_DESCRIPTION`

## Tests

```sh
npm test
```

- Unit tests cover typed errors, contract validation, ICE setup, local
  description failures and readiness guards.
- Integration tests cover connection setup, message exchange, renegotiation,
  media sharing, fallback media behavior and failure paths.
- Browser E2E tests use Playwright with separate browser contexts and a
  WebSocket signaling server to verify real WebRTC connection establishment and
  isolated simultaneous peer pairs.
- Current automated coverage is `100%` for statements, branches, functions and
  lines on the published runtime bundle.

## Benchmarks

```sh
npm run bench
```

Last measured on Node `v22.14.0` (`win32 x64`):

| Benchmark                        |      Average |       Min |       Max |
| -------------------------------- | -----------: | --------: | --------: |
| websocket-signaled `ready()`     |    242.39 ms | 229.80 ms | 284.30 ms |
| one-way `sendMessage()` delivery |      5.36 ms |   3.21 ms |   8.50 ms |
| message throughput               | 186.72 msg/s |         - |         - |

## License

Apache-2.0
