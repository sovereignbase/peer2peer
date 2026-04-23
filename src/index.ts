/**
 * Public entry point for the `@sovereignbase/peer2peer` package.
 */
export type {
  Offer,
  Contract,
  OffereeCopy,
  OfferorCopy,
  ContractCopies,
  P2PConnectionEventMap,
  P2PConnectionEventListener,
  P2PConnectionEventListenerFor,
} from './.types/index.js'
/***/
export { P2PConnection } from './P2PConnection/class.js'
/***/
export {
  P2PConnectionError,
  type P2PConnectionErrorCode,
} from './.errors/class.js'
