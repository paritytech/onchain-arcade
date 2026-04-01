import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationProvider'
import { WalletProvider } from './contexts/WalletProvider'
import { GameProvider } from './contexts/GameContext'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { GamePage } from './pages/GamePage'
import { GamesListPage } from './pages/GamesListPage'
import { LeaderboardPage } from './pages/LeaderboardPage'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <WalletProvider>
            <HashRouter>
              <GameProvider>
                <div className="min-h-screen bg-bg">
                  <Sidebar />
                  <Header />
                  <main className="md:ml-64 px-4 md:px-8 py-6">
                    <div className="max-w-5xl mx-auto">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/play" element={<GamePage />} />
                        <Route path="/games" element={<GamesListPage />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </GameProvider>
            </HashRouter>
          </WalletProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
