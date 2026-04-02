import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Share2, RotateCcw, Gamepad2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { GameBoard } from '@/lib/games/tic-tac-toe'
import { ConnectFourBoard } from '@/lib/games/connect-four'
import { NimBoard } from '@/lib/games/nim-game'
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
  const gameTypeParam = searchParams.get('type') as import('@/types/game').GameType | null
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

  // Auto-join when arriving via share link with host param and game not found locally
  const [autoJoinAttempted, setAutoJoinAttempted] = useState(false)
  useEffect(() => {
    if (gameId && !activeGame && !autoJoinAttempted) {
      const timer = setTimeout(async () => {
        if (!activeGame && hostAddress && isConnected) {
          setAutoJoinAttempted(true)
          await joinGame(gameId, hostAddress, gameTypeParam || undefined)
        } else if (!activeGame) {
          setGameNotFound(true)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
    if (activeGame) setGameNotFound(false)
  }, [gameId, activeGame, hostAddress, isConnected, autoJoinAttempted, joinGame])

  const handleJoinGame = async () => {
    if (!gameId) return
    const host = hostAddress || activeGame?.playerX || undefined
    const success = await joinGame(gameId, host, gameTypeParam || activeGame?.gameType)
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
    await makeMove(activeGame.id, { cellIndex: index })
  }

  const handleColumnClick = async (col: number) => {
    if (!activeGame || !isMyTurn) return
    await makeMove(activeGame.id, { column: col })
  }

  const handleNimMove = async (heap: number, count: number) => {
    if (!activeGame || !isMyTurn) return
    await makeMove(activeGame.id, { heap, count })
  }

  const handleShareCode = async () => {
    if (!activeGame) return
    try {
      // Share the full URL with host param so the other browser can join
      const shareUrl = `${window.location.origin}${window.location.pathname}#/play?game=${activeGame.id}&host=${activeGame.playerX}&type=${activeGame.gameType}`
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/10 flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-brand" />
          </div>
          {hostAddress && isConnected ? (
            <>
              <h2 className="font-serif text-h3 text-text-primary mb-2">Joining as Player O...</h2>
              <p className="text-text-secondary mb-6">
                Connecting to game <span className="font-mono text-brand">{gameId}</span>
              </p>
              <LoadingSpinner size="md" />
            </>
          ) : !isConnected ? (
            <>
              <h2 className="font-serif text-h3 text-text-primary mb-2">Connect Wallet</h2>
              <p className="text-text-secondary mb-6">
                Connect your wallet to join game <span className="font-mono text-brand">{gameId}</span>
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif text-h3 text-text-primary mb-2">Game Not Found</h2>
              <p className="text-text-secondary mb-6">
                Game <span className="font-mono text-brand">{gameId}</span> could not be found. Ask the host to share the full game link.
              </p>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Home
              </Button>
            </>
          )}
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

      {/* Join banner for spectators — prominent placement before the board */}
      {activeGame.status === 'waiting' && !playerRole && isConnected && (
        <motion.div variants={staggerItem}>
          <div className="p-px rounded-2xl bg-gradient-to-br from-brand/50 via-brand/20 to-border">
            <div className="bg-surface rounded-[15px] p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-body-sm font-semibold text-text-primary">This game needs a second player</p>
                <p className="text-caption text-text-secondary">Join now to play as O</p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleJoinGame}
                isLoading={isLoading}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Join as Player O
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Players */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
        <Card className={activeGame.currentTurn === 'X' && activeGame.status === 'playing' ? 'ring-2 ring-brand' : ''}>
          <CardContent className="p-4 text-center">
            <p className="text-h2 font-bold text-brand mb-1">X</p>
            <p className="text-caption text-text-secondary truncate">
              {activeGame.playerX === address
                ? 'You'
                : activeGame.playerXName || truncateAddress(activeGame.playerX)}
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
                  : activeGame.playerOName || truncateAddress(activeGame.playerO)
                : 'Waiting...'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Game Board — conditional by game type */}
      <motion.div variants={staggerItem} className="flex justify-center">
        {activeGame.gameType === 'connect-four' ? (
          <ConnectFourBoard
            board={activeGame.board}
            currentTurn={activeGame.currentTurn}
            winningLine={activeGame.winningLine}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onColumnClick={handleColumnClick}
          />
        ) : activeGame.gameType === 'nim' ? (
          <NimBoard
            heaps={activeGame.heaps}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onMove={handleNimMove}
          />
        ) : (
          <GameBoard
            board={activeGame.board}
            gridSize={activeGame.gridSize}
            currentTurn={activeGame.currentTurn}
            winningLine={activeGame.winningLine}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onCellClick={handleCellClick}
          />
        )}
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
            onClick={() => navigate('/')}
          >
            Home
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
