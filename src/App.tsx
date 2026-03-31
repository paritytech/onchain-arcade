import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationProvider'
import { WalletProvider } from './contexts/WalletProvider'
import { Header } from './components/Header'
import { HashRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <WalletProvider>
            <HashRouter>
              <div className="min-h-screen bg-bg">
                <Header />
                <main className="max-w-7xl mx-auto p-8">
                  <Routes>
                    {/* Frontend Agent will add route elements here */}
                    <Route path="/" element={<div>Loading...</div>} />
                  </Routes>
                </main>
              </div>
            </HashRouter>
          </WalletProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
