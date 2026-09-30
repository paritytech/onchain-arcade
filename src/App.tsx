import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationProvider'
import { WalletProvider } from './contexts/WalletProvider'
import { MotionConfig } from 'framer-motion'
import { GameProvider } from './contexts/GameContext'
import { VoiceProvider } from './contexts/VoiceContext'
import { Header } from './components/Header'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { GamePage } from './pages/GamePage'

export default function App() {
  return (
    <ErrorBoundary>
      {/* Respect the OS "reduce motion" setting across every animation in the
          app. `reducedMotion="user"` keeps the state CHANGE — opacity, colour,
          the fact that something appeared — and drops the travel, which is the
          guidance: reduce, don't eliminate. One line here beats threading
          useReducedMotion() through every board. */}
      <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <NotificationProvider>
          <WalletProvider>
            <HashRouter>
              <GameProvider>
                <VoiceProvider>
                <div className="min-h-screen bg-bg">
                  <Header />
                  <main className="px-4 md:px-8 py-6">
                    <div className="max-w-3xl mx-auto">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/play" element={<GamePage />} />
                      </Routes>
                    </div>
                  </main>
                </div>
                </VoiceProvider>
              </GameProvider>
            </HashRouter>
          </WalletProvider>
        </NotificationProvider>
      </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  )
}
