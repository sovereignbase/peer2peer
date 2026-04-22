import type { InternalSignal } from '../../.types/index.js'

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
