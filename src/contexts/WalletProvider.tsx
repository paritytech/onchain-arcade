// Re-export the production wallet provider from WalletContext
// App.tsx imports WalletProvider — this bridges to the real implementation.
// Frontend Agent: use usePolkadotWallet() from './WalletContext' in components.
export { PolkadotWalletProvider as WalletProvider } from './WalletContext';
export { usePolkadotWallet as useWallet } from './WalletContext';
