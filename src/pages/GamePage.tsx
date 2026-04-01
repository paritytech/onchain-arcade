import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Share2, RotateCcw, Gamepad2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { GameBoard } from '@/components/GameBoard'
import { staggerContainer, staggerItem } from '@/lib/animation-variants'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useGame } from '@/contexts/GameContext'
import { useNotifications } from '@/contexts/NotificationProvider'
import { truncateAddress } from '@/lib/utils'

export function GamePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const gameId = searchParams.get('game')
  const hostAddress = searchParams.get('host')
  const { isConnected, address } = usePolkadotWallet()
  const { activeGame, loadGame, makeMove, createGame, joinGame, leaveGame, isLoading } = useGame()
  const { addNotification } = useNotifications()
  const [gameNotFound, setGameNotFound] = useState(false)

  useEffect(() => {
    if (gameId) {
      loadGame(gameId)
    }
    return () => leaveGame()
  }, [gameId, loadGame, leaveGame])

  // Detect when game is not found after load attempt
  useEffect(() => {
    if (gameId && !activeGame) {
      // Give loadGame a tick to complete, then check
      const timer = setTimeout(() => {
        if (!activeGame) setGameNotFound(true)
      }, 100)
      return () => clearTimeout(timer)
    }
    if (activeGame) setGameNotFound(false)
  }, [gameId, activeGame])

  const handleJoinGame = async () => {
    if (!gameId) return
    const host = hostAddress || activeGame?.playerX || undefined
    const success = await joinGame(gameId, host)
    if (success) {
      setGameNotFound(false)
    }
  }

  const playerRole = useMemo(() => {
    if (!activeGame || !address) return null
    if (activeGame.playerX === address) return 'X' as const
    if (activeGame.playerO === address) return 'O' as const
    return null
  }, [activeGame, address])

  const isMyTurn = activeGame?.status === 'playing' && activeGame.currentTurn === playerRole

  const handleCellClick = async (index: number) => {
    if (!activeGame || !isMyTurn) return
    if (activeGame.board[index] !== null) return
    await makeMove(activeGame.id, index)
  }

  const handleShareCode = async () => {
    if (!activeGame) return
    try {
      // Share the full URL with host param so the other browser can join
      const shareUrl = `${window.location.origin}${window.location.pathname}#/play?game=${activeGame.id}&host=${activeGame.playerX}`
      await navigator.clipboard.writeText(shareUrl)
      addNotification('success', 'Game link copied to clipboard!')
    } catch {
      addNotification('info', `Game code: ${activeGame.id}`)
    }
  }

  const handleNewGame = async () => {
    const id = await createGame()
    if (id) {
      navigate(`/play?game=${id}`)
    }
  }

  if (!gameId) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center py-20"
      >
        <motion.div variants={staggerItem} className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-grey-800/50 flex items-center justify-center">
            <Share2 className="w-8 h-8 text-grey-400" />
          </div>
          <h2 className="font-serif text-h3 text-text-primary mb-2">No Game Selected</h2>
          <p className="text-text-secondary mb-6">Create a new game or join one with a code.</p>
          <div className="flex gap-3 justify-center">
            {isConnected ? (
              <Button variant="primary" onClick={handleNewGame}>
                Create Game
              </Button>
            ) : (
              <Button variant="primary" disabled>
                Connect Wallet to Play
              </Button>
            )}
            <Button variant="secondary" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  if (!activeGame) {
    // Still loading (before the timeout fires)
    if (!gameNotFound) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-text-secondary">Loading game...</p>
        </div>
      )
    }

    // Game not found — show join UI for cross-browser access
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center py-20"
      >
        <motion.div variants={staggerItem} className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-grey-800/50 flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-grey-400" />
          </div>
          <h2 className="font-serif text-h3 text-text-primary mb-2">Game Not Found Locally</h2>
          <p className="text-text-secondary mb-2">
            Game <span className="font-mono text-brand">{gameId}</span> isn&apos;t in this browser yet.
          </p>
          {hostAddress ? (
            <p className="text-text-secondary mb-6">
              Click below to join this game as Player O.
            </p>
          ) : (
            <p className="text-text-secondary mb-6">
              If someone shared this code, ask them to share the full game link (with the host parameter) so you can join.
            </p>
          )}
          <div className="flex gap-3 justify-center">
            {isConnected && hostAddress ? (
              <Button variant="primary" onClick={handleJoinGame} isLoading={isLoading}>
                Join Game
              </Button>
            ) : !isConnected ? (
              <Button variant="primary" disabled>
                Connect Wallet to Join
              </Button>
            ) : null}
            <Button variant="secondary" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const statusText = (() => {
    if (activeGame.status === 'waiting') return 'Waiting for opponent...'
    if (activeGame.status === 'finished') {
      if (activeGame.result === 'draw') return "It's a draw!"
      if (activeGame.result === 'x_wins') {
        return playerRole === 'X' ? 'You win!' : 'X wins!'
      }
      if (activeGame.result === 'o_wins') {
        return playerRole === 'O' ? 'You win!' : 'O wins!'
      }
    }
    if (isMyTurn) return 'Your turn'
    return "Opponent's turn"
  })()

  const statusVariant = (() => {
    if (activeGame.status === 'waiting') return 'warning' as const
    if (activeGame.status === 'finished') {
      if (activeGame.result === 'draw') return 'default' as const
      const didWin =
        (activeGame.result === 'x_wins' && playerRole === 'X') ||
        (activeGame.result === 'o_wins' && playerRole === 'O')
      return didWin ? 'success' : 'error'
    }
    return isMyTurn ? 'success' : 'default'
  })()

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          aria-label="Back to home"
        >
          Back
        </Button>
        <span className="font-mono text-text-secondary text-body-sm">Game #{activeGame.id}</span>
      </motion.div>

      {/* Status Bar */}
      <motion.div variants={staggerItem}>
        <div className="p-px rounded-2xl bg-gradient-to-br from-brand/30 via-border to-border">
          <div className="bg-surface rounded-[15px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Badge variant={statusVariant} size="md">{statusText}</Badge>
              {playerRole && (
                <span className="text-body-sm text-text-secondary">
                  You are <span className="font-bold text-brand">{playerRole}</span>
                </span>
              )}
            </div>
            {activeGame.status === 'waiting' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShareCode}
                leftIcon={<Copy className="w-4 h-4" />}
              >
                Share Link
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Players */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
        <Card className={activeGame.currentTurn === 'X' && activeGame.status === 'playing' ? 'ring-2 ring-brand' : ''}>
          <CardContent className="p-4 text-center">
            <p className="text-h2 font-bold text-brand mb-1">X</p>
            <p className="text-caption text-text-secondary truncate">
              {activeGame.playerX === address
                ? 'You'
                : truncateAddress(activeGame.playerX)}
            </p>
          </CardContent>
        </Card>
        <Card className={activeGame.currentTurn === 'O' && activeGame.status === 'playing' ? 'ring-2 ring-brand' : ''}>
          <CardContent className="p-4 text-center">
            <p className="text-h2 font-bold text-brand mb-1">O</p>
            <p className="text-caption text-text-secondary truncate">
              {activeGame.playerO
                ? activeGame.playerO === address
                  ? 'You'
                  : truncateAddress(activeGame.playerO)
                : 'Waiting...'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Game Board */}
      <motion.div variants={staggerItem} className="flex justify-center">
        <GameBoard
          board={activeGame.board}
          currentTurn={activeGame.currentTurn}
          winningLine={activeGame.winningLine}
          isMyTurn={isMyTurn}
          isPlayable={activeGame.status === 'playing'}
          onCellClick={handleCellClick}
        />
      </motion.div>

      {/* Game Over Actions */}
      {activeGame.status === 'finished' && (
        <motion.div
          variants={staggerItem}
          className="flex justify-center gap-3"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleNewGame}
            leftIcon={<RotateCcw className="w-5 h-5" />}
          >
            New Game
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/games')}
          >
            View All Games
          </Button>
        </motion.div>
      )}

      {/* Join button for spectators viewing a waiting game from another browser */}
      {activeGame.status === 'waiting' && !playerRole && isConnected && (
        <motion.div variants={staggerItem} className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleJoinGame}
            isLoading={isLoading}
            leftIcon={<UserPlus className="w-5 h-5" />}
          >
            Join as Player O
          </Button>
        </motion.div>
      )}

      {/* Waiting hint for game creator */}
      {activeGame.status === 'waiting' && playerRole && isConnected && (
        <motion.div variants={staggerItem} className="text-center">
          <p className="text-text-secondary text-body-sm">
            Share the game link with a friend to start playing.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
