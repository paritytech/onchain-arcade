// Production WalletContext — dual-mode: Triangle host-first, Talisman-fallback
// No visible "Restoring..." state — connection happens seamlessly in the background
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getWallets, type Wallet, type WalletAccount } from '@talismn/connect-wallets';
import { getPolkadotSignerFromPjs } from 'polkadot-api/pjs-signer';
import { getPAPIClient, ss58ToH160, disconnectPAPIClient, initChainClient } from '../lib/papi/client';
// NOTE: ss58ToH160 is synchronous (local keccak256, no RPC needed)
import { isInTriangleHost } from '../lib/triangle';
import { initStorage, getStorage } from '../lib/storage';

const DAPP_NAME = 'Tick-tack-toe';
const PAS_DECIMALS = 10;
const STORAGE_KEY_WALLET = 'Tick-tack-toe_wallet_name';
const STORAGE_KEY_ACCOUNT = 'Tick-tack-toe_account_address';

type WalletMode = 'detecting' | 'host' | 'standalone';

interface PolkadotWalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  mode: WalletMode;
  address: string | null;
  h160Address: string | null;
  accountName: string | null;
  balance: bigint;
  accounts: WalletAccount[];
  installedWallets: Wallet[];
  selectedWallet: Wallet | null;
  filteredEvmAccountsCount: number;
  connect: (wallet: Wallet) => Promise<void>;
  disconnect: () => void;
  selectAccount: (account: WalletAccount) => void;
  getSigner: () => ReturnType<typeof getPolkadotSignerFromPjs> | null;
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
      return null;
    }
  }, []);

  // Fetch balance for an SS58 address
  const fetchBalance = useCallback(async (ss58Address: string) => {
    try {
      const { api } = getPAPIClient();
      const accountInfo = await api.query.System.Account.getValue(ss58Address);
      setBalance(accountInfo.data.free);
    } catch (error) {
      console.error('[Wallet] Error fetching balance:', error);
      setBalance(0n);
    }
  }, []);

  // Connect to a wallet (standalone mode — Talisman/SubWallet/Polkadot.js)
  const connect = useCallback(async (selectedWallet: Wallet) => {
    setIsConnecting(true);
    try {
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
      setMode('host');
      console.log('[Wallet] Connected via Triangle host (Spektr)');
    } catch (error) {
      console.error('[Wallet] Host mode init failed, falling back to standalone:', error);
      setMode('standalone');
    }
  }, []);

  // Main init effect — run wallet + chain client in parallel for fast startup
  useEffect(() => {
    const init = async () => {
      // Storage init is synchronous (no-op), but call it to satisfy the contract
      await initStorage();

      // Determine mode immediately (sync check) — don't wait for chain client
      const hostMode = isInTriangleHost();

      // Run chain client + wallet setup in parallel — neither depends on the other
      const chainClientPromise = initChainClient().catch((err) =>
        console.error('[Wallet] Chain client init failed:', err)
      );

      if (hostMode) {
        // Host mode: start Spektr injection in parallel with chain client
        await Promise.all([chainClientPromise, initHostMode()]);
      } else {
        // Standalone mode: show Connect Wallet immediately, restore connection in parallel with chain client
        setMode('standalone');
        await Promise.all([chainClientPromise, restoreConnection()]);
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

  return (
    <PolkadotWalletContext.Provider
      value={{
        isConnected: !!selectedAccount,
        isConnecting,
        mode,
        address: selectedAccount?.address || null,
        h160Address,
        accountName: selectedAccount?.name || null,
        balance,
        accounts,
        installedWallets,
        selectedWallet: wallet,
        filteredEvmAccountsCount,
        connect,
        disconnect,
        selectAccount,
        getSigner,
        refreshBalance,
        formatBalance,
        truncatedAddress,
      }}
    >
      {children}
    </PolkadotWalletContext.Provider>
  );
}
