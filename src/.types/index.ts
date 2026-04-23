/**
 * Represents an offer that can be transported to a remote peer out-of-band.
 */
export type Offer = {
  /**
   * Correlates the offer and the later contract copies.
   */
  offerId: string
  /**
   * The local SDP offer produced by the offeror.
   */
  description: RTCSessionDescription
}

/**
 * Represents the contract copy that returns to the offeror after the offeree
 * accepts an offer.
 */
export type OfferorCopy = {
  /**
   * Correlates the contract copy back to the original offer.
   */
  offerId: string
  /**
   * Identifies the local role that should consume this copy.
   */
  role: 'offeror'
  /**
   * The SDP answer produced by the offeree.
   */
  answer: RTCSessionDescription
}

/**
 * Represents the contract copy retained by the offeree after accepting an
 * offer.
 */
export type OffereeCopy = {
  /**
   * Correlates the contract copy back to the original offer.
   */
  offerId: string
  /**
   * Identifies the local role that should consume this copy.
   */
  role: 'offeree'
}

/**
 * Represents either side of the out-of-band contract exchange.
 */
export type Contract = OfferorCopy | OffereeCopy

/**
 * Contains the pair of contract copies produced when an offer is accepted.
 */
export type ContractCopies = { offeror: OfferorCopy; offeree: OffereeCopy }

/**
 * Represents an internal renegotiation message exchanged over the data
 * channel.
 */
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
 * Maps `P2PConnection` event names to their corresponding
 * `CustomEvent.detail` payloads.
 */
export type P2PConnectionEventMap<T> = {
  message: T
  camera: HTMLVideoElement
  screen: HTMLVideoElement
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
