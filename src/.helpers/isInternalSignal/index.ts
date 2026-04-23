import type { InternalSignal } from '../../.types/index.js'

/**
 * Determines whether an unknown decoded payload is an internal renegotiation
 * signal.
 *
 * @param value The decoded payload to inspect.
 * @returns `true` when `value` matches the internal signal shape.
 */
export function isInternalSignal(value: unknown): value is InternalSignal {
  if (!value || typeof value !== 'object') return false

  const signal = value as Partial<InternalSignal>

  return (
    (signal.__sovereignbase_peer2peer === 'renegotiate-offer' ||
      signal.__sovereignbase_peer2peer === 'renegotiate-answer') &&
    !!signal.description &&
    typeof signal.description === 'object'
  )
}
