export type P2PConnectionErrorCode =
  | 'CHANNEL_ERROR'
  | 'CHANNEL_CLOSED'
  | 'CHANNEL_NOT_AVAILABLE'
  | 'CONNECTION_NOT_READY'
  | 'UNKNOWN_PEER_CONTRACT'
  | 'MISSING_LOCAL_DESCRIPTION'

export class P2PConnectionError extends Error {
  readonly code: P2PConnectionErrorCode

  constructor(code: P2PConnectionErrorCode, message?: string) {
    const detail = message ?? code
    super(`{@sovereignbase/peer2peer} ${detail}`)
    this.code = code
    this.name = 'P2PConnectionError'
  }
}
