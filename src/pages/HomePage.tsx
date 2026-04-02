import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Copy, Check, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { staggerContainer, staggerItem } from '@/lib/animation-variants'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useGame } from '@/contexts/GameContext'
import { useNotifications } from '@/contexts/NotificationProvider'
import type { GridSize } from '@/types/game'
import { WIN_LENGTH } from '@/types/game'

const GRID_OPTIONS: { size: GridSize; label: string }[] = [
  { size: 3, label: '3 x 3' },
  { size: 5, label: '5 x 5' },
  { size: 7, label: '7 x 7' },
]

export function HomePage() {
  const navigate = useNavigate()
  const { isConnected, address } = usePolkadotWallet()
  const { createGame, joinGame, isLoading } = useGame()
  const { addNotification } = useNotifications()
  const [joinCode, setJoinCode] = useState('')
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedGrid, setSelectedGrid] = useState<GridSize>(3)

  const handleCreate = async () => {
    const gameId = await createGame(selectedGrid)
    if (gameId) {
      setCreatedCode(gameId)
    }
  }

  const handleJoin = async () => {
    if (!joinCode.trim()) return
    const code = joinCode.trim().toUpperCase()
    const success = await joinGame(code)
    if (success) {
      navigate(`/play?game=${code}`)
    }
  }

  const handleCopyCode = async () => {
    if (!createdCode) return
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}#/play?game=${createdCode}&host=${address}`
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addNotification('info', `Game code: ${createdCode}`)
    }
  }

  const handleGoToGame = () => {
    if (createdCode) {
      navigate(`/play?game=${createdCode}`)
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 pt-8"
    >
      {/* Title */}
      <motion.div variants={staggerItem} className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 mb-4">
          <Grid3X3 className="w-8 h-8 text-brand" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-h1 text-text-primary mb-2">
          Tic-Tac-Toe
        </h1>
        <p className="text-body-lg text-text-secondary max-w-md mx-auto">
          Create a game, share the code, and play in real-time.
        </p>
      </motion.div>

      {/* Create Game */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-serif text-h3 text-text-primary mb-4 text-center">Create Game</h3>

            {/* Grid size selector */}
            <div className="flex justify-center gap-2 mb-3">
              {GRID_OPTIONS.map(opt => (
                <button
                  key={opt.size}
                  onClick={() => setSelectedGrid(opt.size)}
                  className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                    selectedGrid === opt.size
                      ? 'bg-brand text-white'
                      : 'bg-grey-800/50 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {selectedGrid > 3 && (
              <p className="text-caption text-text-secondary text-center mb-4">
                {WIN_LENGTH[selectedGrid]} in a row to win
              </p>
            )}

            <div className="flex justify-center">
              {isConnected ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCreate}
                  isLoading={isLoading}
                  leftIcon={<Gamepad2 className="w-5 h-5" />}
                >
                  Create Game
                </Button>
              ) : (
                <Button variant="primary" size="lg" disabled>
                  Connect Wallet to Play
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Created game code */}
      {createdCode && (
        <motion.div
          variants={staggerItem}
          className="p-px rounded-2xl bg-gradient-to-br from-brand/30 via-border to-border"
        >
          <div className="bg-surface rounded-[15px] p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-body-sm text-text-secondary mb-1">Share this link with your opponent</p>
                <p className="text-h2 font-mono text-brand tracking-widest">{createdCode}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyCode}
                  leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? 'Copied' : 'Copy Link'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGoToGame}
                >
                  Go to Game
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Join Game */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-serif text-h3 text-text-primary mb-2">Join a Game</h3>
            <p className="text-body-sm text-text-secondary mb-4">
              Enter the game code shared by your opponent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter game code"
                value={joinCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJoinCode(e.target.value)}
                inputSize="md"
                className="font-mono tracking-widest"
                aria-label="Game code"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleJoin}
                isLoading={isLoading}
                disabled={!isConnected || joinCode.trim().length < 4}
              >
                Join
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
