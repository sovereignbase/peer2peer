/**
 * Enumerates stable, machine-readable peer-to-peer failure codes.
 */
export type P2PConnectionErrorCode =
  | 'CHANNEL_ERROR'
  | 'CHANNEL_CLOSED'
  | 'CHANNEL_NOT_AVAILABLE'
  | 'CONNECTION_NOT_READY'
  | 'UNKNOWN_PEER_CONTRACT'
  | 'MISSING_LOCAL_DESCRIPTION'

/**
 * Represents a typed peer-to-peer failure.
 */
export class P2PConnectionError extends Error {
  /**
   * Identifies the semantic error condition.
   */
  readonly code: P2PConnectionErrorCode

  /**
   * Creates a new `P2PConnectionError`.
   *
   * @param code The stable machine-readable error code.
   * @param message A specific human-readable explanation for the current failure.
   * @param options Standard `Error` options such as `cause`.
   */
  constructor(
    code: P2PConnectionErrorCode,
    message?: string,
    options?: ErrorOptions
  ) {
    const detail = message ?? code
    super(`{@sovereignbase/peer2peer} ${detail}`, options)
    this.code = code
    this.name = 'P2PConnectionError'
  }
}
