import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Copy, Check, Grid3X3, Layers, CircleDot } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { staggerContainer, staggerItem } from '@/lib/animation-variants'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useGame } from '@/contexts/GameContext'
import { useNotifications } from '@/contexts/NotificationProvider'
import type { GameType, GridSize } from '@/types/game'
import { WIN_LENGTH } from '@/types/game'

const GRID_OPTIONS: { size: GridSize; label: string }[] = [
  { size: 3, label: '3x3' },
  { size: 5, label: '5x5' },
  { size: 7, label: '7x7' },
]

const NIM_PRESETS: { label: string; heaps: number[] }[] = [
  { label: 'Quick', heaps: [1, 2, 3] },
  { label: 'Classic', heaps: [3, 4, 5] },
  { label: 'Big', heaps: [3, 5, 7] },
]

export function HomePage() {
  const navigate = useNavigate()
  const { isConnected, address } = usePolkadotWallet()
  const { createGame, joinGame, isLoading } = useGame()
  const { addNotification } = useNotifications()
  const [joinCode, setJoinCode] = useState('')
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [createdGameType, setCreatedGameType] = useState<GameType>('tic-tac-toe')
  const [copied, setCopied] = useState(false)

  // Game-specific options
  const [selectedGrid, setSelectedGrid] = useState<GridSize>(3)
  const [selectedNimPreset, setSelectedNimPreset] = useState(1) // Classic

  const handleCreate = async (gameType: GameType) => {
    let gameId: string | null = null
    switch (gameType) {
      case 'tic-tac-toe':
        gameId = await createGame('tic-tac-toe', { gridSize: selectedGrid })
        break
      case 'connect-four':
        gameId = await createGame('connect-four')
        break
      case 'nim':
        gameId = await createGame('nim', { nimConfig: NIM_PRESETS[selectedNimPreset].heaps })
        break
    }
    if (gameId) {
      setCreatedCode(gameId)
      setCreatedGameType(gameType)
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
      const shareUrl = `${window.location.origin}${window.location.pathname}#/play?game=${createdCode}&host=${address}&type=${createdGameType}`
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addNotification('info', `Game code: ${createdCode}`)
    }
  }

  const handleGoToGame = () => {
    if (createdCode) navigate(`/play?game=${createdCode}`)
  }

  const notConnected = !isConnected

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 pt-4"
    >
      {/* Title */}
      <motion.div variants={staggerItem} className="text-center">
        <h1 className="font-serif text-h1 text-text-primary mb-1">Game Arena</h1>
        <p className="text-body-sm text-text-secondary">Pick a game, share the code, play in real-time</p>
      </motion.div>

      {/* Created game code */}
      {createdCode && (
        <motion.div
          variants={staggerItem}
          className="p-px rounded-2xl bg-gradient-to-br from-brand/30 via-border to-border"
        >
          <div className="bg-surface rounded-[15px] p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-body-sm text-text-secondary mb-1">Share this link with your opponent</p>
                <p className="text-h3 font-mono text-brand tracking-widest">{createdCode}</p>
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
                <Button variant="primary" size="sm" onClick={handleGoToGame}>
                  Go to Game
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Game Cards */}
      <motion.div variants={staggerItem} className="grid gap-4 md:grid-cols-3">
        {/* Tic-Tac-Toe */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand/10">
                <Grid3X3 className="w-6 h-6 text-brand" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-serif text-h4 text-text-primary">Tic-Tac-Toe</h3>
                <p className="text-caption text-text-secondary">Get N in a row</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {GRID_OPTIONS.map(opt => (
                <button
                  key={opt.size}
                  onClick={() => setSelectedGrid(opt.size)}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-caption font-medium transition-colors ${
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
              <p className="text-caption text-text-secondary text-center">
                {WIN_LENGTH[selectedGrid]} in a row to win
              </p>
            )}
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => handleCreate('tic-tac-toe')}
              isLoading={isLoading}
              disabled={notConnected}
              leftIcon={<Gamepad2 className="w-4 h-4" />}
            >
              {notConnected ? 'Connect Wallet' : 'Create'}
            </Button>
          </CardContent>
        </Card>

        {/* Connect Four */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Layers className="w-6 h-6 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-serif text-h4 text-text-primary">Connect Four</h3>
                <p className="text-caption text-text-secondary">4 in a row, gravity drops</p>
              </div>
            </div>
            <p className="text-caption text-text-secondary">
              Drop discs into a 7x6 grid. First to connect 4 horizontally, vertically, or diagonally wins.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => handleCreate('connect-four')}
              isLoading={isLoading}
              disabled={notConnected}
              leftIcon={<Gamepad2 className="w-4 h-4" />}
            >
              {notConnected ? 'Connect Wallet' : 'Create'}
            </Button>
          </CardContent>
        </Card>

        {/* Nim */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <CircleDot className="w-6 h-6 text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-serif text-h4 text-text-primary">Nim</h3>
                <p className="text-caption text-text-secondary">Don't take the last token</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {NIM_PRESETS.map((preset, idx) => (
                <button
                  key={preset.label}
                  onClick={() => setSelectedNimPreset(idx)}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-caption font-medium transition-colors ${
                    selectedNimPreset === idx
                      ? 'bg-amber-500 text-white'
                      : 'bg-grey-800/50 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="text-caption text-text-secondary text-center">
              Heaps: [{NIM_PRESETS[selectedNimPreset].heaps.join(', ')}]
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => handleCreate('nim')}
              isLoading={isLoading}
              disabled={notConnected}
              leftIcon={<Gamepad2 className="w-4 h-4" />}
            >
              {notConnected ? 'Connect Wallet' : 'Create'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Join Game */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardContent className="p-5">
            <h3 className="font-serif text-h4 text-text-primary mb-2">Join a Game</h3>
            <p className="text-caption text-text-secondary mb-3">
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
                disabled={notConnected || joinCode.trim().length < 4}
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
