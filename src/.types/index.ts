export type Offer = {
  offerId: string
  description: RTCSessionDescription
}

export type OfferorCopy = {
  offerId: string
  role: 'offeror'
  answer: RTCSessionDescription
}

export type OffereeCopy = {
  offerId: string
  role: 'offeree'
}

export type Contract = OfferorCopy | OffereeCopy

export type ContractCopies = { offeror: OfferorCopy; offeree: OffereeCopy }

export type InternalSignal =
  | {
      __sovereignbase_peer2peer: 'renegotiate-offer'
      description: RTCSessionDescriptionInit
    }
  | {
      __sovereignbase_peer2peer: 'renegotiate-answer'
      description: RTCSessionDescriptionInit
    }

/**
 * Maps `P2PConnection` event names to their corresponding `CustomEvent.detail` payloads.
 */
export type P2PConnectionEventMap<T> = {
  message: T
}

/**
 * Represents a strongly typed `P2PConnection` event listener.
 */
export type P2PConnectionEventListener<
  T,
  K extends keyof P2PConnectionEventMap<T>,
> =
  | ((event: CustomEvent<P2PConnectionEventMap<T>[K]>) => void)
  | { handleEvent(event: CustomEvent<P2PConnectionEventMap<T>[K]>): void }

/**
 * Resolves an event name to its corresponding listener type.
 */
export type P2PConnectionEventListenerFor<
  T,
  K extends string,
> = K extends keyof P2PConnectionEventMap<T>
  ? P2PConnectionEventListener<T, K>
  : EventListenerOrEventListenerObject
