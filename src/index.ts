/**
 * Public entry point for the `@sovereignbase/peer2peer` package.
 */
export type {
  Offer,
  Contract,
  OffereeCopy,
  OfferorCopy,
  ContractCopies,
} from './.types/index.js'
/***/
export { P2PConnection } from './P2PConnection/class.js'
/***/
export {
  P2PConnectionError,
  type P2PConnectionErrorCode,
} from './.errors/class.js'
