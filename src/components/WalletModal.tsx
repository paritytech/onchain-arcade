// Wallet selection modal — lists installed wallets, handles account selection
// In Triangle host mode, the modal is never shown (host provides the wallet)
import { useState, useEffect } from 'react';
import type { Wallet } from '@talismn/connect-wallets';
import { usePolkadotWallet } from '../contexts/WalletContext';
import { Modal } from './ui/Modal';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { Wallet as WalletIcon, AlertCircle, ChevronRight, User } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const {
    installedWallets,
    accounts,
    isConnecting,
    isConnected,
    mode,
    connect,
    disconnect,
    selectAccount,
    address,
    accountName,
    formatBalance,
  } = usePolkadotWallet();

  // In host mode, auto-close the modal — wallet is managed by the host
  useEffect(() => {
    if (isOpen && mode === 'host') {
      onClose();
    }
  }, [isOpen, mode, onClose]);

  const [error, setError] = useState<string | null>(null);
  const [showAccounts, setShowAccounts] = useState(false);

  const handleConnect = async (wallet: Wallet) => {
    setError(null);
    try {
      await connect(wallet);
      if (accounts.length <= 1) {
        onClose();
      } else {
        setShowAccounts(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const handleSelectAccount = (account: any) => {
    selectAccount(account);
    onClose();
    setShowAccounts(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setShowAccounts(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isConnected ? 'Wallet' : 'Connect Wallet'}>
      {isConnecting ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <LoadingSpinner size="lg" />
          <p className="text-body-sm text-text-secondary">Connecting to wallet...</p>
        </div>
      ) : isConnected && !showAccounts ? (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink/10 flex items-center justify-center">
                <User className="w-5 h-5 text-pink" aria-label="Account" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-text-primary truncate">
                  {accountName || 'Account'}
                </p>
                <p className="text-caption text-text-secondary font-mono truncate">{address}</p>
              </div>
            </div>
            <p className="mt-2 text-body-sm text-text-secondary">{formatBalance()}</p>
          </div>

          {accounts.length > 1 && (
            <button
              onClick={() => setShowAccounts(true)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              Switch Account
              <ChevronRight className="w-4 h-4" aria-label="Switch" />
            </button>
          )}

          <button
            onClick={handleDisconnect}
            className="btn-ghost w-full text-error"
          >
            Disconnect
          </button>
        </div>
      ) : showAccounts ? (
        <div className="space-y-2">
          <p className="text-body-sm text-text-secondary mb-3">Select an account:</p>
          {accounts.map((account) => (
            <button
              key={account.address}
              onClick={() => handleSelectAccount(account)}
              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                account.address === address
                  ? 'border-pink bg-pink/5'
                  : 'border-border hover:border-text-secondary'
              }`}
            >
              <p className="text-body-sm font-medium text-text-primary">
                {account.name || 'Account'}
              </p>
              <p className="text-caption text-text-secondary font-mono truncate">
                {account.address}
              </p>
            </button>
          ))}
          <button
            onClick={() => setShowAccounts(false)}
            className="btn-ghost w-full mt-2"
          >
            Back
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {installedWallets.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-text-secondary mx-auto mb-3" aria-label="No wallets" />
              <p className="text-body-sm text-text-secondary mb-2">No wallets detected</p>
              <p className="text-caption text-text-secondary">
                Install a Polkadot wallet extension like Talisman or SubWallet to continue.
              </p>
            </div>
          ) : (
            installedWallets.map((w) => (
              <button
                key={w.extensionName}
                onClick={() => handleConnect(w)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-text-secondary transition-colors"
              >
                {w.logo?.src ? (
                  <img src={w.logo.src} alt={w.logo.alt || w.title} className="w-8 h-8 rounded-lg" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
                    <WalletIcon className="w-4 h-4 text-text-secondary" aria-label="Wallet" />
                  </div>
                )}
                <span className="text-body-sm font-medium text-text-primary">{w.title}</span>
                <ChevronRight className="w-4 h-4 text-text-secondary ml-auto" aria-label="Connect" />
              </button>
            ))
          )}

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-error/10 border border-error/20">
              <p className="text-caption text-error">{error}</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
