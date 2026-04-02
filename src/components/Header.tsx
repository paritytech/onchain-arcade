import { useState } from 'react'
import { Wallet, Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { Button } from '@/components/ui/Button'
import { WalletModal } from '@/components/WalletModal'
import { truncateAddress } from '@/lib/utils'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { isConnected, address, displayName, disconnect, formatBalance, balance, refreshBalance } = usePolkadotWallet()
  const [showWallet, setShowWallet] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-grey-950/95 backdrop-blur-xl border-b border-border">
        <div className="px-6 h-16 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors text-text-secondary"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" aria-label="Light mode" />
              ) : (
                <Moon className="w-5 h-5" aria-label="Dark mode" />
              )}
            </button>
            {isConnected && address ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refreshBalance()}
                  className="hidden sm:inline text-body-sm text-brand font-mono hover:text-brand/80 transition-colors"
                  title="Click to refresh balance"
                >
                  {formatBalance(balance)}
                </button>
                <span className={`hidden sm:inline text-body-sm text-text-secondary ${displayName && displayName === address ? 'font-mono' : ''}`}>
                  {displayName || truncateAddress(address)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => disconnect()}
                  leftIcon={<LogOut className="w-4 h-4" />}
                  aria-label="Disconnect wallet"
                >
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowWallet(true)}
                leftIcon={<Wallet className="w-4 h-4" aria-label="Wallet" />}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>
      <WalletModal isOpen={showWallet} onClose={() => setShowWallet(false)} />
    </>
  )
}
