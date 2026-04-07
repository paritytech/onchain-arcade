// Production WalletContext — dual-mode: Triangle host-first, Talisman-fallback
// No visible "Restoring..." state — connection happens seamlessly in the background
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getWallets, type Wallet, type WalletAccount } from '@talismn/connect-wallets';
import { getPolkadotSignerFromPjs } from 'polkadot-api/pjs-signer';
import { AccountId } from 'polkadot-api';
import { getPAPIClient, ss58ToH160, disconnectPAPIClient, initChainClient, isPAPIClientReady } from '../lib/papi/client';
// NOTE: ss58ToH160 is synchronous (local keccak256, no RPC needed)
import { isInTriangleHost } from '../lib/triangle';
import { initStorage, getStorage } from '../lib/storage';
import type { ProductAccountId } from '@novasamatech/product-sdk';

const DAPP_NAME = 'onchain-arcade';
const PAS_DECIMALS = 10;
const STORAGE_KEY_WALLET = 'onchain_arcade_wallet_name';
const STORAGE_KEY_ACCOUNT = 'onchain_arcade_account_address';

type WalletMode = 'detecting' | 'host' | 'standalone';

type SignRawFn = (raw: { address: string; data: string; type: 'bytes' | 'payload' }) => Promise<{ signature: string }>;

interface PolkadotWalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  mode: WalletMode;
  address: string | null;
  h160Address: string | null;
  accountName: string | null;
  /** DotNS alias from getNonProductAccounts() (e.g. "pranay.23"). Null in standalone mode. */
  accountAlias: string | null;
  /** Display name: alias if available, otherwise accountName, otherwise truncated address. */
  displayName: string | null;
  balance: bigint;
  accounts: WalletAccount[];
  installedWallets: Wallet[];
  selectedWallet: Wallet | null;
  filteredEvmAccountsCount: number;
  error: string | null;
  /** ProductAccountId for Statement Store signing via host SDK. Null in standalone mode. */
  productAccountId: ProductAccountId | null;
  connect: (wallet: Wallet) => Promise<void>;
  disconnect: () => void;
  selectAccount: (account: WalletAccount) => void;
  getSigner: () => ReturnType<typeof getPolkadotSignerFromPjs> | null;
  getSignRaw: () => SignRawFn | null;
  getPublicKey: () => Uint8Array | null;
  refreshBalance: () => Promise<void>;
  formatBalance: (amount?: bigint) => string;
  truncatedAddress: string | null;
}

const PolkadotWalletContext = createContext<PolkadotWalletContextType | undefined>(undefined);

export function usePolkadotWallet() {
  const context = useContext(PolkadotWalletContext);
  if (!context) {
    throw new Error('usePolkadotWallet must be used within a PolkadotWalletProvider');
  }
  return context;
}

// Filter out EVM (0x) accounts — wallets can expose both SS58 and EVM accounts
function isEvmAddress(address: string): boolean {
  return address.startsWith('0x') && address.length === 42;
}

function filterSubstrateAccounts(accounts: WalletAccount[]): {
  substrateAccounts: WalletAccount[];
  evmCount: number;
} {
  const substrateAccounts: WalletAccount[] = [];
  let evmCount = 0;
  for (const account of accounts) {
    if (isEvmAddress(account.address)) {
      evmCount++;
    } else {
      substrateAccounts.push(account);
    }
  }
  return { substrateAccounts, evmCount };
}

export function PolkadotWalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | null>(null);
  const [h160Address, setH160Address] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint>(0n);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mode, setMode] = useState<WalletMode>('detecting');
  const [filteredEvmAccountsCount, setFilteredEvmAccountsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [productAccountId, setProductAccountId] = useState<ProductAccountId | null>(null);
  const [accountAlias, setAccountAlias] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const installedWallets = getWallets().filter(w => w.installed);

  const saveConnectionState = useCallback((walletName: string, address: string) => {
    try {
      const storage = getStorage();
      storage.setItem(STORAGE_KEY_WALLET, walletName);
      storage.setItem(STORAGE_KEY_ACCOUNT, address);
    } catch {}
  }, []);

  const clearConnectionState = useCallback(() => {
    try {
      const storage = getStorage();
      storage.removeItem(STORAGE_KEY_WALLET);
      storage.removeItem(STORAGE_KEY_ACCOUNT);
    } catch {}
  }, []);

  // Convert SS58 → H160 (computed locally, no RPC needed)
  const convertToH160 = useCallback((ss58Address: string): string | null => {
    try {
      return ss58ToH160(ss58Address);
    } catch (error) {
      console.error('[Wallet] Error converting address:', error);
      setError(error instanceof Error ? error.message : 'Failed to convert address');
      return null;
    }
  }, []);

  // Fetch balance for an SS58 address (only when chain client is ready)
  const fetchBalance = useCallback(async (ss58Address: string) => {
    if (!isPAPIClientReady()) return;
    try {
      const { api } = getPAPIClient();
      const accountInfo = await api.query.System.Account.getValue(ss58Address);
      setBalance(accountInfo.data.free);
    } catch (error) {
      console.error('[Wallet] Error fetching balance:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch balance');
      setBalance(0n);
    }
  }, []);

  // Connect to a wallet (standalone mode — Talisman/SubWallet/Polkadot.js)
  const connect = useCallback(async (selectedWallet: Wallet) => {
    setIsConnecting(true);
    try {
      // Initialize chain client on first wallet connection (deferred from mount)
      if (!isPAPIClientReady()) {
        await initChainClient().catch((err) =>
          console.error('[Wallet] Chain client init failed:', err)
        );
      }

      await selectedWallet.enable(DAPP_NAME);
      const walletAccounts = await selectedWallet.getAccounts();
      const { substrateAccounts, evmCount } = filterSubstrateAccounts(walletAccounts);
      setFilteredEvmAccountsCount(evmCount);

      if (substrateAccounts.length === 0) {
        throw new Error('No Substrate accounts found. Please create a Polkadot/Substrate account in your wallet.');
      }

      setAccounts(substrateAccounts);
      setWallet(selectedWallet);
      setSelectedAccount(substrateAccounts[0]);
      saveConnectionState(selectedWallet.extensionName, substrateAccounts[0].address);

      // Subscribe for future account updates
      const unsubscribe = await selectedWallet.subscribeAccounts((updatedAccounts) => {
        if (updatedAccounts && updatedAccounts.length > 0) {
          const { substrateAccounts: filtered } = filterSubstrateAccounts(updatedAccounts);
          setAccounts(filtered);
        }
      });
      unsubscribeRef.current = unsubscribe as (() => void) | null;
    } finally {
      setIsConnecting(false);
    }
  }, [saveConnectionState]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setWallet(null);
    setAccounts([]);
    setSelectedAccount(null);
    setH160Address(null);
    setBalance(0n);
    clearConnectionState();
  }, [clearConnectionState]);

  // Select a different account
  const selectAccount = useCallback((account: WalletAccount) => {
    setSelectedAccount(account);
    if (wallet) {
      saveConnectionState(wallet.extensionName, account.address);
    }
  }, [wallet, saveConnectionState]);

  // Get PAPI signer from wallet extension (works for both Spektr and Talisman/SubWallet)
  const getSigner = useCallback(() => {
    if (!wallet?.extension?.signer || !selectedAccount) return null;
    return getPolkadotSignerFromPjs(
      selectedAccount.address,
      wallet.extension.signer.signPayload,
      wallet.extension.signer.signRaw
    );
  }, [wallet, selectedAccount]);

  // Get raw signing function for Statement Store submissions
  const getSignRaw = useCallback((): SignRawFn | null => {
    if (!wallet?.extension?.signer?.signRaw) return null;
    return wallet.extension.signer.signRaw;
  }, [wallet]);

  // Get the 32-byte public key for the selected account
  const getPublicKey = useCallback((): Uint8Array | null => {
    if (!selectedAccount) return null;
    try {
      return AccountId().enc(selectedAccount.address);
    } catch {
      return null;
    }
  }, [selectedAccount]);

  // Format balance (10 decimals for PAS)
  const formatBalance = useCallback((amount?: bigint): string => {
    const value = amount ?? balance;
    const divisor = 10n ** BigInt(PAS_DECIMALS);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;
    const fractionalStr = fractionalPart.toString().padStart(PAS_DECIMALS, '0');
    let trimmed = fractionalStr.replace(/0+$/, '');
    if (trimmed.length < 2) trimmed = fractionalStr.slice(0, 2);
    if (trimmed === '00' || trimmed.length === 0) return `${integerPart} PAS`;
    return `${integerPart}.${trimmed} PAS`;
  }, [balance]);

  // Refresh balance for current account
  const refreshBalance = useCallback(async () => {
    if (selectedAccount) {
      await fetchBalance(selectedAccount.address);
    }
  }, [selectedAccount, fetchBalance]);

  // When selected account changes: fetch balance + convert to H160
  useEffect(() => {
    if (selectedAccount) {
      fetchBalance(selectedAccount.address);
      const h160 = convertToH160(selectedAccount.address);
      if (h160) setH160Address(h160);
    }
  }, [selectedAccount, fetchBalance, convertToH160]);

  // Restore connection from storage (standalone mode — runs in background, no spinner)
  const restoreConnection = useCallback(async () => {
    try {
      const storage = getStorage();
      const savedWalletName = storage.getItem(STORAGE_KEY_WALLET);
      const savedAddress = storage.getItem(STORAGE_KEY_ACCOUNT);
      if (!savedWalletName) return;

      const wallets = getWallets();
      const savedWallet = wallets.find(w => w.installed && w.extensionName === savedWalletName);
      if (!savedWallet) return;

      // Initialize chain client when restoring a saved wallet connection
      if (!isPAPIClientReady()) {
        await initChainClient().catch((err) =>
          console.error('[Wallet] Chain client init failed:', err)
        );
      }

      await savedWallet.enable(DAPP_NAME);
      const walletAccounts = await savedWallet.getAccounts();
      const { substrateAccounts, evmCount } = filterSubstrateAccounts(walletAccounts);
      setFilteredEvmAccountsCount(evmCount);

      if (substrateAccounts.length === 0) return;

      setWallet(savedWallet);
      setAccounts(substrateAccounts);

      const targetAccount = savedAddress
        ? substrateAccounts.find(a => a.address === savedAddress) || substrateAccounts[0]
        : substrateAccounts[0];
      setSelectedAccount(targetAccount);
    } catch (error) {
      console.error('[Wallet] Could not restore connection:', error);
      setError(error instanceof Error ? error.message : 'Failed to restore wallet connection');
    }
  }, []);

  // Initialize: Triangle host auto-connect via Spektr extension injection
  const initHostMode = useCallback(async () => {
    try {
      const { injectSpektrExtension } = await import('@novasamatech/product-sdk');

      // injectSpektrExtension() injects into window.injectedWeb3 as "spektr"
      const injected = await injectSpektrExtension();
      if (!injected) {
        console.error('[Wallet] Spektr injection failed — falling back to standalone');
        setMode('standalone');
        return;
      }

      // @talismn/connect-wallets doesn't know about "spektr" — access injectedWeb3 directly
      const injectedWeb3 = (window as any).injectedWeb3;
      const spektrEntry = injectedWeb3?.['spektr'];
      if (!spektrEntry) {
        console.error('[Wallet] Spektr not found in injectedWeb3 — falling back to standalone');
        setMode('standalone');
        return;
      }

      const spektrExt = typeof spektrEntry.enable === 'function'
        ? await spektrEntry.enable(DAPP_NAME)
        : spektrEntry;

      const rawAccounts = await spektrExt.accounts.get();
      const walletAccounts: WalletAccount[] = rawAccounts.map((a: any) => ({
        address: a.address,
        name: a.name || 'Spektr Account',
        source: 'spektr',
      }));
      const { substrateAccounts, evmCount } = filterSubstrateAccounts(walletAccounts);
      setFilteredEvmAccountsCount(evmCount);

      if (substrateAccounts.length === 0) {
        console.error('[Wallet] No Substrate accounts from Spektr — falling back to standalone');
        setMode('standalone');
        return;
      }

      // Create a wallet shim so getSigner() works with the Spektr extension
      const spektrWalletShim = {
        extensionName: 'spektr',
        installed: true,
        extension: spektrExt,
        enable: async () => {},
        getAccounts: async () => walletAccounts,
        subscribeAccounts: (cb: any) => {
          spektrExt.accounts.subscribe?.((accs: any[]) => {
            cb(accs.map((a: any) => ({
              address: a.address,
              name: a.name || 'Spektr Account',
              source: 'spektr',
            })));
          });
          return () => {};
        },
      } as unknown as Wallet;

      setWallet(spektrWalletShim);
      setAccounts(substrateAccounts);
      setSelectedAccount(substrateAccounts[0]);
      // Non-product account pattern (from ignite's toProductAccount): ['', 0]
      setProductAccountId(['', 0] as ProductAccountId);
      setMode('host');
      console.log('[Wallet] Connected via Triangle host (Spektr)');

      // Resolve DotNS alias via createAccountsProvider
      try {
        const { createAccountsProvider } = await import('@novasamatech/product-sdk');
        const accountsProvider = createAccountsProvider();
        const result = accountsProvider.getNonProductAccounts();
        const accounts = await result.match(
          (accs: { publicKey: Uint8Array; name: string | undefined }[]) => accs,
          () => [] as { publicKey: Uint8Array; name: string | undefined }[],
        );
        if (accounts.length > 0 && accounts[0].name) {
          setAccountAlias(accounts[0].name);
          console.log('[Wallet] DotNS alias:', accounts[0].name);
        }
      } catch (err) {
        console.warn('[Wallet] Could not resolve DotNS alias:', err);
      }
    } catch (error) {
      console.error('[Wallet] Host mode init failed, falling back to standalone:', error);
      setError(error instanceof Error ? error.message : 'Host wallet initialization failed');
      setMode('standalone');
    }
  }, []);

  // Main init effect — detect wallet mode, defer chain client to when wallet connects
  useEffect(() => {
    const init = async () => {
      // Storage init is synchronous (no-op), but call it to satisfy the contract
      await initStorage();

      // Determine mode immediately (sync check)
      const hostMode = isInTriangleHost();

      if (hostMode) {
        // Host mode: init chain client + Spektr in parallel (host needs chain for Spektr)
        const chainClientPromise = initChainClient().catch((err) =>
          console.error('[Wallet] Chain client init failed:', err)
        );
        await Promise.all([chainClientPromise, initHostMode()]);
      } else {
        // Standalone mode: show Connect Wallet immediately, restore wallet state
        // Chain client is deferred until wallet actually connects (avoids WebSocket errors on load)
        setMode('standalone');
        await restoreConnection();
      }
    };

    init();
  }, [initHostMode, restoreConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      disconnectPAPIClient();
    };
  }, []);

  const truncatedAddress = selectedAccount
    ? `${selectedAccount.address.slice(0, 6)}...${selectedAccount.address.slice(-4)}`
    : null;

  const accountName = selectedAccount?.name || null;
  const displayName = accountAlias || accountName || truncatedAddress;
  return (
    <PolkadotWalletContext.Provider
      value={{
        isConnected: !!selectedAccount,
        isConnecting,
        mode,
        address: selectedAccount?.address || null,
        h160Address,
        accountName,
        accountAlias,
        displayName,
        balance,
        accounts,
        installedWallets,
        selectedWallet: wallet,
        filteredEvmAccountsCount,
        error,
        productAccountId,
        connect,
        disconnect,
        selectAccount,
        getSigner,
        getSignRaw,
        getPublicKey,
        refreshBalance,
        formatBalance,
        truncatedAddress,
      }}
    >
      {children}
    </PolkadotWalletContext.Provider>
  );
}
