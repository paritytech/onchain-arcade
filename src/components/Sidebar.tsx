import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Gamepad2, Trophy, List, Menu, X, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/cn'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/play', label: 'Play', icon: Gamepad2 },
  { path: '/games', label: 'Games', icon: List },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export function Sidebar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navContent = (
    <nav className="flex flex-col h-full" aria-label="Main navigation">
      <div className="p-6 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
          <Grid3X3 className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <span className="text-lg font-serif text-text-primary">Tic Tac Toe</span>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const active = isActive(item.path)
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-soft border-l-2 border-brand text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-grey-800/50'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-border">
        <p className="text-caption text-text-secondary text-center">Built on Polkadot</p>
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-grey-900 border-r border-border z-30">
        {navContent}
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-surface border border-border shadow-md"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5 text-text-primary" aria-hidden="true" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-grey-900 border-r border-border md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-grey-800 transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-text-secondary" aria-hidden="true" />
              </button>
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
