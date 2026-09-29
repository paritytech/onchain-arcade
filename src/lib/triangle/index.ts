/**
 * Polkadot host (Triangle) integration helpers.
 */
export { isInTriangleHost, isInHostContainer } from './hostDetection';
export { WELL_KNOWN_CHAINS, ASSET_HUB_GENESIS, DOTNS_SUFFIX } from './constants';
export type { ChainId } from './constants';
export type {
  WalletAccount,
  ChatMessageContent,
  ConnectionStatus,
  AccountConnectionStatus,
} from './types';
