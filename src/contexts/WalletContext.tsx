// WalletContext — dual-mode: Polkadot host container first, browser extension fallback.
//
// HOST MODE (Polkadot Desktop, Polkadot Mobile, the browser shell)
//   The host hands the product a PRODUCT ACCOUNT: one deterministic account per
//   (dotNsIdentifier, derivationIndex), distinct from the user's main wallet.
//   `getProductAccountSigner` returns a PAPI signer that routes signing through
//   the host itself, so nothing here goes near @polkadot-api/pjs-signer and its
//   hardcoded signed-extension table — which throws on the extensions Asset Hub
//   Next rides. This replaces the old `injectSpektrExtension()` + injectedWeb3
//   shim, which the current SDK no longer ships.
//
// STANDALONE MODE (plain browser tab)
//   Unchanged: Talisman / SubWallet / Nova via @talismn/connect-wallets.
//
// No visible "Restoring..." state — connection happens in the background.
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getWallets, type Wallet, type WalletAccount } from '@talismn/connect-wallets';
import { getPolkadotSignerFromPjs } from 'polkadot-api/pjs-signer';
import { AccountId, type PolkadotSigner } from 'polkadot-api';
import {
  formatHostError,
  getAccountsProvider,
  type AccountsProvider,
} from '@parity/product-sdk/host';
import { getPAPIClient, ss58ToH160, disconnectPAPIClient, initChainClient, isPAPIClientReady } from '../lib/papi/client';
// NOTE: ss58ToH160 is synchronous (local keccak256, no RPC needed)
import { isInHostContainer } from '../lib/triangle';
import { hostErrorTag } from '../lib/host/hostError';
import { PRODUCT_IDENTIFIER } from '../lib/host/productIdentifier';
import { DEADLINE, withDeadline, isDeadlineError } from '../lib/deadline';
import { initStorage, getStorage } from '../lib/storage';

const DAPP_NAME = 'onchain-arcade';
const PAS_DECIMALS = 10;
const STORAGE_KEY_WALLET = 'onchain_arcade_wallet_name';
const STORAGE_KEY_ACCOUNT = 'onchain_arcade_account_address';

/** Derivation index of the product account. One account per product, so 0. */
const PRODUCT_DERIVATION_INDEX = 0;

type WalletMode = 'detecting' | 'host' | 'standalone';

type SignRawFn = (raw: { address: string; data: string; type: 'bytes' | 'payload' }) => Promise<{ signature: string }>;

interface PolkadotWalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  mode: WalletMode;
  address: string | null;
  h160Address: string | null;
  accountName: string | null;
  /** RFC-0014 primary username from the host (the handle set in the Polkadot app). Null in standalone mode. */
  accountAlias: string | null;
  /** Display name: alias if available, otherwise accountName, otherwise truncated address. */
  displayName: string | null;
  balance: bigint;
  accounts: WalletAccount[];
  installedWallets: Wallet[];
  selectedWallet: Wallet | null;
  filteredEvmAccountsCount: number;
  error: string | null;
  /** True once the host has handed over a product account, i.e. the host
   *  Statement Store transport can sign. Always false in standalone mode,
   *  where the app signs statements with its own key. */
  hostSigningReady: boolean;
  connect: (wallet: Wallet) => Promise<void>;
  disconnect: () => void;
  selectAccount: (account: WalletAccount) => void;
  getSigner: () => PolkadotSigner | null;
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

// The accounts provider is async and returns null outside a host container. One
// cached promise keeps a single provider for the page.
//
// Only a RESOLVED promise is kept. Caching a rejected one would retain the
// failure for the page's lifetime, and every later caller — including the
// reconnect handler, which exists precisely to recover — would re-reject with it.
let accountsProviderPromise: Promise<AccountsProvider | null> | null = null;
function accountsProvider(): Promise<AccountsProvider | null> {
  accountsProviderPromise ??= getAccountsProvider().catch((err: unknown) => {
    accountsProviderPromise = null;
    throw err;
  });
  return accountsProviderPromise;
}

/** The provider, or a thrown error — for paths that cannot proceed without it. */
async function requireAccountsProvider(): Promise<AccountsProvider> {
  const provider = await accountsProvider();
  if (!provider) throw new Error('No host accounts provider — not inside a Polkadot host.');
  return provider;
}

const accountIdCodec = AccountId();

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
  const [hostSigningReady, setHostSigningReady] = useState(false);
  const [accountAlias, setAccountAlias] = useState<string | null>(null);
  const [hostPublicKey, setHostPublicKey] = useState<Uint8Array | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  /** PAPI signer for the product account — host mode only. */
  const hostSignerRef = useRef<PolkadotSigner | null>(null);
  const connectionSubRef = useRef<{ unsubscribe: () => void } | null>(null);

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

  // Fetch balance for an SS58 address. Gated on isPAPIClientReady(): inside a
  // host that does not serve the configured chain there is no client at all,
  // which is a "no balance" state, not an error worth surfacing to the player.
  const fetchBalance = useCallback(async (ss58Address: string) => {
    if (!isPAPIClientReady()) return;
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

  // Select a different account. In host mode the product account is
  // deterministic — there is exactly one, so this is a no-op there.
  const selectAccount = useCallback((account: WalletAccount) => {
    if (mode === 'host') return;
    setSelectedAccount(account);
    if (wallet) {
      saveConnectionState(wallet.extensionName, account.address);
    }
  }, [wallet, mode, saveConnectionState]);

  // Get the PAPI signer. In host mode the host signs the full extrinsic itself;
  // in standalone mode the browser extension does.
  const getSigner = useCallback(() => {
    if (hostSignerRef.current) return hostSignerRef.current;
    if (!wallet?.extension?.signer || !selectedAccount) return null;
    return getPolkadotSignerFromPjs(
      selectedAccount.address,
      wallet.extension.signer.signPayload,
      wallet.extension.signer.signRaw
    );
  }, [wallet, selectedAccount]);

  // Raw signing, for the standalone Statement Store transport only. In host
  // mode statements are signed by the host via createProofAuthorized, which
  // needs no key material here — hence null.
  const getSignRaw = useCallback((): SignRawFn | null => {
    if (mode === 'host') return null;
    if (!wallet?.extension?.signer?.signRaw) return null;
    return wallet.extension.signer.signRaw;
  }, [wallet, mode]);

  // Get the 32-byte public key for the selected account
  const getPublicKey = useCallback((): Uint8Array | null => {
    if (hostPublicKey) return hostPublicKey;
    if (!selectedAccount) return null;
    try {
      return accountIdCodec.enc(selectedAccount.address);
    } catch {
      return null;
    }
  }, [selectedAccount, hostPublicKey]);

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

  /**
   * Fetch the product account for this product identifier and install a signer.
   * Returns true if an account was applied, false if the user must still sign in
   * on the host.
   */
  const applyProductAccount = useCallback(async (): Promise<boolean> => {
    // Bounded: a wedged host bridge answers nothing, and an unbounded await
    // leaves the UI waiting forever.
    //
    // hostDialog, not read: the host does not derive the product subtree key
    // locally. The first call for a product opens a host dialog and waits for
    // the user to confirm — on mobile, in the Polkadot app on their paired
    // phone. That round trip is human-paced. Later calls resolve from
    // persistence with no UI.
    //
    // Promise.resolve lifts the neverthrow ResultAsync (a PromiseLike, not a
    // Promise) into the shape withDeadline takes.
    const provider = await requireAccountsProvider();
    const result = await withDeadline(
      Promise.resolve(provider.getProductAccount(PRODUCT_IDENTIFIER, PRODUCT_DERIVATION_INDEX)),
      DEADLINE.hostDialog,
      'getProductAccount',
    );

    if (result.isErr()) {
      const tag = hostErrorTag(result.error);
      // Not signed in yet is not a failure — the UI waits for sign-in.
      if (tag === 'NotConnected') return false;
      throw new Error(
        `getProductAccount(${PRODUCT_IDENTIFIER}) failed: ${tag ?? formatHostError(result.error)}`,
      );
    }

    const publicKey = result.value.publicKey;
    const ss58 = accountIdCodec.dec(publicKey);

    // Resolve the user's RFC-0014 primary username (the handle set in the
    // Polkadot mobile app) for display. Raced against a short timeout so a slow
    // host bridge cannot block sign-in over a cosmetic field.
    let alias: string | null = null;
    try {
      const userId = await Promise.race([
        Promise.resolve(provider.getUserId()),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('getUserId timed out')), 3_000),
        ),
      ]);
      if (userId.isOk() && userId.value.primaryUsername) {
        alias = userId.value.primaryUsername;
      }
    } catch (err) {
      console.warn('[Wallet] getUserId failed — falling back to the product identifier:', err);
    }

    const account: WalletAccount = {
      address: ss58,
      name: alias ?? PRODUCT_IDENTIFIER,
      source: 'polkadot-host',
    };

    // The host signs the full extrinsic itself, so nothing here goes near
    // @polkadot-api/pjs-signer and its hardcoded signed-extension table.
    hostSignerRef.current = provider.getProductAccountSigner({
      publicKey,
      dotNsIdentifier: PRODUCT_IDENTIFIER,
      derivationIndex: PRODUCT_DERIVATION_INDEX,
    });

    setHostPublicKey(publicKey);
    setAccountAlias(alias);
    setAccounts([account]);
    setSelectedAccount(account);
    setHostSigningReady(true);
    setError(null);
    console.log('[Wallet] Connected as the product account', { identifier: PRODUCT_IDENTIFIER });
    return true;
  }, []);

  /** Host mode bootstrap: product account + reconnect subscription. */
  const initHostMode = useCallback(async () => {
    try {
      const signedIn = await applyProductAccount();
      if (!signedIn) {
        // Not a failure — the host has no active session yet. Say so, because
        // in host mode the wallet modal auto-closes and there is no in-app
        // Connect button: without this the player sees a dead "not connected"
        // state with nothing to act on. The subscription below picks the
        // account up as soon as they sign in, no reload needed.
        console.log('[Wallet] No active host session — waiting for sign-in');
        setError('Sign in to Polkadot on the host to play. This clears on its own once you do.');
      }

      // Re-fetch the product account when the host reports a new connection.
      const provider = await requireAccountsProvider();
      const sub = provider.subscribeAccountConnectionStatus(async (status) => {
        if (status === 'Disconnected') {
          hostSignerRef.current = null;
          setHostSigningReady(false);
          setSelectedAccount(null);
          setAccounts([]);
        } else if (status === 'Connected') {
          try {
            if (await applyProductAccount()) setError(null);
          } catch (err) {
            console.error('[Wallet] Product account read failed on reconnect:', err);
          }
        }
      });
      sub.onInterrupt(() => {
        hostSignerRef.current = null;
        setHostSigningReady(false);
      });
      connectionSubRef.current = sub;
    } catch (err) {
      // `detail` is its own field, not only part of `err`: a host error often
      // carries its reason in a tag the error message drops.
      const detail = hostErrorTag(err) ?? (err instanceof Error ? err.message : formatHostError(err));
      console.error('[Wallet] Host mode init failed:', detail, err);
      setError(
        isDeadlineError(err)
          ? 'The host never handed over an account. If the Polkadot app on your phone is showing a confirmation request, answer it and reload.'
          : detail,
      );
    }
  }, [applyProductAccount]);

  // Main init effect — pick the mode, then bootstrap it.
  useEffect(() => {
    const init = async () => {
      // Storage init is synchronous (no-op), but call it to satisfy the contract
      await initStorage();

      // Authoritative: completes the SDK handshake rather than guessing from
      // window markers, so a framed page with no working bridge falls through
      // to standalone instead of hanging on a host that is not there.
      const inHost = await isInHostContainer();

      if (inHost) {
        setMode('host');
        setIsConnecting(true);
        try {
          // The chain client and the product account are independent — the host
          // owns both connections, and neither blocks the other.
          await Promise.all([
            initChainClient().catch((err) =>
              console.error('[Wallet] Chain client init failed:', err)
            ),
            initHostMode(),
          ]);
        } finally {
          setIsConnecting(false);
        }
      } else {
        // Standalone: show Connect Wallet immediately, restore wallet state.
        // The chain client is deferred until a wallet actually connects, which
        // avoids WebSocket errors on load.
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
      connectionSubRef.current?.unsubscribe();
      connectionSubRef.current = null;
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
        hostSigningReady,
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
