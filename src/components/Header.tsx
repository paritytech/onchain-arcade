import { Wallet, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-grey-950/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="text-lg font-serif text-text-primary">Tick-tack-toe</h1>
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
          <Button variant="secondary" size="sm" leftIcon={<Wallet className="w-4 h-4" aria-label="Wallet" />}>
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  )
}
