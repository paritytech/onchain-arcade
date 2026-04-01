// Wallet selection modal — lists installed wallets, handles account selection
// In Triangle host mode, the modal is never shown (host provides the wallet)
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Wallet } from '@talismn/connect-wallets';
import { usePolkadotWallet } from '../contexts/WalletContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
import {
  Wallet as WalletIcon,
  AlertCircle,
  ChevronRight,
  User,
  LogOut,
  Copy,
  Check,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { modalBackdrop, modalContent, staggerContainer, staggerItem } from '@/lib/animation-variants';

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

  const modalRef = useRef<HTMLDivElement>(null);

  // In host mode, auto-close the modal — wallet is managed by the host
  useEffect(() => {
    if (isOpen && mode === 'host') {
      onClose();
    }
  }, [isOpen, mode, onClose]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Focus trap & body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [error, setError] = useState<string | null>(null);
  const [showAccounts, setShowAccounts] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={isConnected ? 'Wallet' : 'Connect Wallet'}
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-[400px] max-h-[90vh] overflow-hidden bg-white dark:bg-grey-900/95 dark:backdrop-blur-xl rounded-3xl border border-grey-200 dark:border-grey-700/50 shadow-2xl dark:shadow-black/40"
          >
            {/* Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/15 via-brand/5 to-pink/10" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.12),transparent_60%)]" />
              <div className="relative flex items-center justify-between px-6 pt-6 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 flex items-center justify-center shadow-sm">
                    <WalletIcon className="w-5 h-5 text-brand" aria-label="Wallet" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-semibold text-text-primary leading-tight">
                      {isConnected && !showAccounts
                        ? 'Wallet'
                        : showAccounts
                          ? 'Select Account'
                          : 'Connect Wallet'}
                    </h2>
                    {!isConnected && !isConnecting && !showAccounts && (
                      <p className="text-caption text-text-tertiary mt-0.5">Choose a wallet to get started</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-grey-100/80 dark:bg-grey-800/80 hover:bg-grey-200 dark:hover:bg-grey-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-4.5 h-4.5 text-text-secondary" aria-label="Close" />
                </button>
              </div>
              <div className="mx-6 border-b border-grey-200/80 dark:border-grey-700/40" />
            </div>

            {/* Content */}
            <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-140px)]">
              {isConnecting ? (
                /* Connecting state */
                <div className="flex flex-col items-center gap-5 py-12">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-brand/20 blur-xl" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand/15 to-brand/5 border border-brand/20 flex items-center justify-center">
                      <LoadingSpinner size="lg" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-body-sm font-semibold text-text-primary">
                      Connecting...
                    </p>
                    <p className="text-caption text-text-secondary mt-1.5 max-w-[240px] mx-auto">
                      Approve the connection in your wallet extension
                    </p>
                  </div>
                </div>
              ) : isConnected && !showAccounts ? (
                /* Connected state */
                <div className="space-y-4">
                  {/* Account card */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-brand/5 to-pink/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,40,103,0.06),transparent_60%)]" />
                    <div className="relative border border-brand/15 dark:border-brand/10 rounded-2xl p-5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand to-pink blur-sm opacity-40" />
                          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-brand to-pink flex items-center justify-center shadow-lg shadow-brand/20">
                            <User className="w-5.5 h-5.5 text-white" aria-label="Account" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {accountName || 'Account'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-caption text-text-secondary font-mono truncate bg-grey-100/60 dark:bg-grey-800/60 px-2 py-0.5 rounded-md">
                              {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ''}
                            </p>
                            <button
                              onClick={handleCopyAddress}
                              className="p-1 rounded-md hover:bg-grey-200 dark:hover:bg-grey-700 transition-colors flex-shrink-0"
                              aria-label="Copy address"
                            >
                              {copied ? (
                                <Check className="w-3.5 h-3.5 text-success" aria-label="Copied" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-text-tertiary hover:text-text-secondary transition-colors" aria-label="Copy" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="mt-4 pt-4 border-t border-brand/10 dark:border-grey-700/40">
                        <p className="text-caption text-text-tertiary uppercase tracking-wider font-medium">Balance</p>
                        <p className="text-xl font-bold text-text-primary mt-1 font-sans tracking-tight">
                          {formatBalance()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5">
                    {accounts.length > 1 && (
                      <button
                        onClick={() => setShowAccounts(true)}
                        className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-grey-200 dark:border-grey-700/50 hover:border-brand/30 hover:bg-brand/5 transition-all duration-200 min-h-[44px] group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-grey-100 dark:bg-grey-800 flex items-center justify-center group-hover:bg-brand/10 transition-colors duration-200">
                          <User className="w-4 h-4 text-text-secondary group-hover:text-brand transition-colors duration-200" aria-label="Switch account" />
                        </div>
                        <span className="text-body-sm font-medium text-text-primary">
                          Switch Account
                        </span>
                        <ChevronRight className="w-4 h-4 text-text-tertiary ml-auto group-hover:text-brand group-hover:translate-x-0.5 transition-all duration-200" aria-label="Switch" />
                      </button>
                    )}

                    <button
                      onClick={handleDisconnect}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-error/15 hover:border-error/30 hover:bg-error/5 transition-all duration-200 min-h-[44px] group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-error/8 flex items-center justify-center group-hover:bg-error/15 transition-colors duration-200">
                        <LogOut className="w-4 h-4 text-error" aria-label="Disconnect" />
                      </div>
                      <span className="text-body-sm font-medium text-error/80 group-hover:text-error transition-colors duration-200">
                        Disconnect
                      </span>
                    </button>
                  </div>
                </div>
              ) : showAccounts ? (
                /* Account selection */
                <div className="space-y-2">
                  <p className="text-caption text-text-secondary mb-3 font-medium">
                    {accounts.length} account{accounts.length !== 1 ? 's' : ''} available
                  </p>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2"
                  >
                    {accounts.map((account) => (
                      <motion.button
                        key={account.address}
                        variants={staggerItem}
                        onClick={() => handleSelectAccount(account)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 min-h-[44px] ${
                          account.address === address
                            ? 'border-brand/30 bg-brand/5 shadow-sm shadow-brand/10 ring-1 ring-brand/10'
                            : 'border-grey-200 dark:border-grey-700/50 hover:border-brand/20 hover:bg-brand/[0.03]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                              account.address === address
                                ? 'bg-gradient-to-br from-brand to-pink shadow-md shadow-brand/20'
                                : 'bg-grey-100 dark:bg-grey-800'
                            }`}
                          >
                            <User
                              className={`w-4 h-4 ${
                                account.address === address ? 'text-white' : 'text-text-secondary'
                              }`}
                              aria-label="Account"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-body-sm font-medium text-text-primary">
                              {account.name || 'Account'}
                            </p>
                            <p className="text-caption text-text-secondary font-mono truncate mt-0.5">
                              {account.address.slice(0, 8)}...{account.address.slice(-6)}
                            </p>
                          </div>
                          {account.address === address && (
                            <span className="text-xs font-semibold text-brand bg-brand/10 px-2.5 py-1 rounded-full border border-brand/15">
                              Active
                            </span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                  <button
                    onClick={() => setShowAccounts(false)}
                    className="w-full mt-3 p-3 rounded-xl text-body-sm font-medium text-text-secondary hover:text-text-primary hover:bg-grey-100 dark:hover:bg-grey-800 transition-all duration-200 min-h-[44px]"
                  >
                    Back
                  </button>
                </div>
              ) : (
                /* Wallet list */
                <div>
                  {installedWallets.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="relative mx-auto w-16 h-16 mb-5">
                        <div className="absolute inset-0 rounded-2xl bg-grey-200 dark:bg-grey-700 blur-lg opacity-50" />
                        <div className="relative w-16 h-16 rounded-2xl bg-grey-100 dark:bg-grey-800 border border-grey-200 dark:border-grey-700 flex items-center justify-center">
                          <AlertCircle className="w-7 h-7 text-text-tertiary" aria-label="No wallets" />
                        </div>
                      </div>
                      <p className="text-body-sm font-semibold text-text-primary mb-1.5">
                        No wallets detected
                      </p>
                      <p className="text-caption text-text-secondary max-w-[260px] mx-auto leading-relaxed">
                        Install a Polkadot wallet extension like Talisman or SubWallet to get started.
                      </p>
                      <a
                        href="https://talisman.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-lg text-caption font-semibold text-brand bg-brand/10 hover:bg-brand/15 border border-brand/20 transition-all duration-200"
                      >
                        Get Talisman
                        <ExternalLink className="w-3.5 h-3.5" aria-label="External link" />
                      </a>
                    </div>
                  ) : (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-2.5"
                    >
                      {installedWallets.map((w) => (
                        <motion.button
                          key={w.extensionName}
                          variants={staggerItem}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleConnect(w)}
                          className="w-full flex items-center gap-4 p-4 rounded-xl border border-grey-200 dark:border-grey-700/50 hover:border-brand/30 hover:bg-brand/[0.03] hover:shadow-md hover:shadow-brand/5 transition-all duration-200 min-h-[44px] group"
                        >
                          {w.logo?.src ? (
                            <img
                              src={w.logo.src}
                              alt={w.logo.alt || w.title}
                              className="w-11 h-11 rounded-xl shadow-sm ring-1 ring-grey-200/50 dark:ring-grey-700/30"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-grey-100 dark:bg-grey-800 border border-grey-200 dark:border-grey-700 flex items-center justify-center">
                              <WalletIcon className="w-5 h-5 text-text-secondary" aria-label="Wallet" />
                            </div>
                          )}
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-text-primary group-hover:text-brand transition-colors duration-200">
                              {w.title}
                            </p>
                            <p className="text-caption text-text-tertiary mt-0.5">
                              {w.installed ? 'Ready to connect' : 'Not installed'}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-grey-100/80 dark:bg-grey-800/80 group-hover:bg-brand/10 flex items-center justify-center transition-all duration-200">
                            <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-brand group-hover:translate-x-0.5 transition-all duration-200" aria-label="Connect" />
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-xl bg-error/8 border border-error/15 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5 text-error" aria-label="Error" />
                      </div>
                      <p className="text-caption text-error leading-relaxed">{error}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isConnected && !isConnecting && (
              <div className="px-6 pb-5 pt-2">
                <div className="flex items-center justify-center gap-2 text-caption text-text-tertiary">
                  <Shield className="w-3.5 h-3.5 text-brand/50" aria-label="Secure" />
                  <span>Secured by Polkadot</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
