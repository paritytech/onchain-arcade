import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Share2, RotateCcw, Gamepad2, UserPlus, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { GameBoard, getBestMove } from '@/lib/games/tic-tac-toe'
import { ConnectFourBoard, getBestColumnMove } from '@/lib/games/connect-four'
import { NimBoard, getBestNimMove } from '@/lib/games/nim-game'
import { DotsAndBoxesBoard, getBestEdgeMove } from '@/lib/games/dots-and-boxes'
import { MancalaBoard, getBestPitMove } from '@/lib/games/mancala'
import { ReversiBoard, getBestReversiMove } from '@/lib/games/reversi'
import { GhostBoard, getBestGhostMove } from '@/lib/games/ghost'
import { HackenbushBoard, getBestHackenbushMove } from '@/lib/games/hackenbush'
import { EntropyBoard, getBestEntropyMove } from '@/lib/games/entropy'
import { BlokusDuoBoard, getBestBlokusMove } from '@/lib/games/blokus-duo'
import { TakBoard, getBestTakMove } from '@/lib/games/tak'
import { EmojiPictionaryBoard } from '@/lib/games/emoji-pictionary'
import { staggerContainer, staggerItem } from '@/lib/animation-variants'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useGame } from '@/contexts/GameContext'
import { useNotifications } from '@/contexts/NotificationProvider'
import { truncateAddress } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { GAME_RULES } from '@/lib/game-rules'

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
  const [showRules, setShowRules] = useState(false)

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
    if (!activeGame) return null
    if (activeGame.playerX === address) return 'X' as const
    if (activeGame.playerO === address) return 'O' as const
    return null
  }, [activeGame, address])

  const isMyTurn = activeGame?.status === 'playing' && activeGame.currentTurn === playerRole

  // Computer auto-move for vs Computer TTT games
  // Computer auto-move for all vs Computer games
  useEffect(() => {
    if (!activeGame || activeGame.status !== 'playing' || !activeGame.vsComputer) return
    if (activeGame.currentTurn !== 'O') return // Computer is always O

    const timer = setTimeout(() => {
      let stmt: any = null

      switch (activeGame.gameType) {
        case 'tic-tac-toe': {
          const cell = getBestMove(activeGame.board, activeGame.gridSize, 'O')
          if (cell >= 0) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', cellIndex: cell, timestamp: Date.now() }
          break
        }
        case 'connect-four': {
          const col = getBestColumnMove(activeGame.board, 'O')
          if (col >= 0) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', column: col, timestamp: Date.now() }
          break
        }
        case 'nim': {
          const move = getBestNimMove(activeGame.heaps)
          stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', nimMove: move, timestamp: Date.now() }
          break
        }
        case 'dots-and-boxes': {
          const edge = getBestEdgeMove(activeGame.lines)
          if (edge) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', edge, timestamp: Date.now() }
          break
        }
        case 'mancala': {
          const pit = getBestPitMove(activeGame.pits, false) // Computer is O (not X)
          if (pit >= 0) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', pit, timestamp: Date.now() }
          break
        }
        case 'reversi': {
          const cell = getBestReversiMove(activeGame.board, 'O', activeGame.validMoves)
          if (cell >= 0) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', cellIndex: cell, timestamp: Date.now() }
          break
        }
        case 'ghost': {
          const move = getBestGhostMove(activeGame.fragment)
          if ('ghostLetter' in move) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', ghostLetter: move.ghostLetter, timestamp: Date.now() }
          else stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', ghostChallenge: true, timestamp: Date.now() }
          break
        }
        case 'hackenbush': {
          const edgeId = getBestHackenbushMove(activeGame.edges, activeGame.nodes, activeGame.groundNodes, 'B')
          if (edgeId >= 0) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', hackenbushEdge: edgeId, timestamp: Date.now() }
          break
        }
        case 'entropy': {
          const move = getBestEntropyMove(activeGame.board, activeGame.nextPiece, activeGame.phase, activeGame.piecesPlaced)
          if ('entropyPlace' in move) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', entropyPlace: move.entropyPlace, timestamp: Date.now() }
          else if ('entropySlide' in move) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', entropySlide: move.entropySlide, timestamp: Date.now() }
          else stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', entropyPass: true, timestamp: Date.now() }
          break
        }
        case 'blokus-duo': {
          const move = getBestBlokusMove(activeGame.board, activeGame.remainingPieces.O, 'O', activeGame.scores.O === 0)
          if (move && 'blokusMove' in move) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', blokusMove: move.blokusMove, timestamp: Date.now() }
          else stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', blokusPass: true, timestamp: Date.now() }
          break
        }
        case 'tak': {
          const move = getBestTakMove(activeGame.board, activeGame.flatStones, activeGame.capstones, 'O', activeGame.firstMoveDone)
          if (move && 'takPlace' in move) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', takPlace: move.takPlace, timestamp: Date.now() }
          else if (move && 'takMove' in move) stmt = { type: 'make_move', gameId: activeGame.id, player: 'computer', takMove: move.takMove, timestamp: Date.now() }
          break
        }
      }

      if (stmt) {
        import('@/lib/statementStore').then(({ statementStore }) => {
          statementStore.applyLocal(stmt)
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [activeGame?.id, activeGame?.status, activeGame?.currentTurn, activeGame?.vsComputer, activeGame?.moveCount])

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

  const handleEdgeClick = async (edge: string) => {
    if (!activeGame || !isMyTurn) return
    await makeMove(activeGame.id, { edge })
  }

  const handlePitClick = async (pit: number) => {
    if (!activeGame || !isMyTurn) return
    await makeMove(activeGame.id, { pit })
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
    const gameType = activeGame?.gameType || 'tic-tac-toe'
    const vsComp = activeGame?.vsComputer || false
    const id = await createGame(gameType, { vsComputer: vsComp })
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
            <Button variant="primary" onClick={handleNewGame}>
              Create Game
            </Button>
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
          {hostAddress ? (
            <>
              <h2 className="font-serif text-h3 text-text-primary mb-2">Joining as Player O...</h2>
              <p className="text-text-secondary mb-6">
                Connecting to game <span className="font-mono text-brand">{gameId}</span>
              </p>
              <LoadingSpinner size="md" />
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
    if (activeGame.status === 'waiting') {
      if (activeGame.gameType === 'emoji-pictionary') {
        return `Waiting for players (${activeGame.players.length}/${activeGame.maxPlayers})...`
      }
      return 'Waiting for opponent...'
    }
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
        <button
          onClick={() => setShowRules(true)}
          className="p-1 rounded-lg hover:bg-grey-800/50 transition-colors text-grey-500 hover:text-grey-300"
          aria-label="Game rules"
        >
          <Info className="w-4 h-4" />
        </button>
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

      {/* Players — compact inline */}
      <motion.div variants={staggerItem} className="flex justify-center gap-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${activeGame.currentTurn === 'X' && activeGame.status === 'playing' ? 'border-brand bg-brand/10' : 'border-grey-700 bg-grey-800/30'}`}>
          <span className="text-sm font-bold text-brand">X</span>
          <span className="text-caption text-text-secondary truncate max-w-[120px]">
            {activeGame.playerX === address ? 'You' : activeGame.playerXName || truncateAddress(activeGame.playerX)}
          </span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${activeGame.currentTurn === 'O' && activeGame.status === 'playing' ? 'border-brand bg-brand/10' : 'border-grey-700 bg-grey-800/30'}`}>
          <span className="text-sm font-bold text-brand">O</span>
          <span className="text-caption text-text-secondary truncate max-w-[120px]">
            {activeGame.playerO ? (activeGame.playerO === address ? 'You' : activeGame.playerOName || truncateAddress(activeGame.playerO)) : 'Waiting...'}
          </span>
        </div>
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
        ) : activeGame.gameType === 'dots-and-boxes' ? (
          <DotsAndBoxesBoard
            lines={activeGame.lines}
            boxes={activeGame.boxes}
            scores={activeGame.scores}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onEdgeClick={handleEdgeClick}
          />
        ) : activeGame.gameType === 'mancala' ? (
          <MancalaBoard
            pits={activeGame.pits}
            lastSowEnd={activeGame.lastSowEnd}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            isPlayerX={playerRole === 'X'}
            onPitClick={handlePitClick}
          />
        ) : activeGame.gameType === 'reversi' ? (
          <ReversiBoard
            board={activeGame.board}
            validMoves={activeGame.validMoves}
            scores={activeGame.scores}
            currentTurn={activeGame.currentTurn}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onCellClick={handleCellClick}
          />
        ) : activeGame.gameType === 'nim' ? (
          <NimBoard
            heaps={activeGame.heaps}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onMove={handleNimMove}
          />
        ) : activeGame.gameType === 'ghost' ? (
          <GhostBoard
            fragment={activeGame.fragment}
            ghostLetters={activeGame.ghostLetters}
            challengeResult={activeGame.challengeResult}
            currentTurn={activeGame.currentTurn}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onAddLetter={(l) => makeMove(activeGame.id, { ghostLetter: l })}
            onChallenge={() => makeMove(activeGame.id, { ghostChallenge: true })}
          />
        ) : activeGame.gameType === 'hackenbush' ? (
          <HackenbushBoard
            edges={activeGame.edges}
            nodes={activeGame.nodes}
            groundNodes={activeGame.groundNodes}
            currentTurn={activeGame.currentTurn}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onRemoveEdge={(id) => makeMove(activeGame.id, { hackenbushEdge: id })}
          />
        ) : activeGame.gameType === 'entropy' ? (
          <EntropyBoard
            board={activeGame.board}
            nextPiece={activeGame.nextPiece}
            piecesPlaced={activeGame.piecesPlaced}
            round={activeGame.round}
            phase={activeGame.phase}
            scores={activeGame.scores}
            chaosPlayer={activeGame.chaosPlayer}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onPlace={(i) => makeMove(activeGame.id, { entropyPlace: i })}
            onSlide={(f, t) => makeMove(activeGame.id, { entropySlide: { from: f, to: t } })}
            onPassSlide={() => makeMove(activeGame.id, { entropyPass: true })}
          />
        ) : activeGame.gameType === 'blokus-duo' ? (
          <BlokusDuoBoard
            board={activeGame.board}
            remainingPieces={activeGame.remainingPieces}
            scores={activeGame.scores}
            consecutivePasses={activeGame.consecutivePasses}
            currentTurn={activeGame.currentTurn}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            onPlacePiece={(pid, pos, rot, flip) => makeMove(activeGame.id, { blokusMove: { pieceId: pid, position: pos, rotation: rot, flip } })}
            onPass={() => makeMove(activeGame.id, { blokusPass: true })}
          />
        ) : activeGame.gameType === 'tak' ? (
          <TakBoard
            board={activeGame.board}
            flatStones={activeGame.flatStones}
            capstones={activeGame.capstones}
            road={activeGame.road}
            currentTurn={activeGame.currentTurn}
            isMyTurn={isMyTurn}
            isPlayable={activeGame.status === 'playing'}
            firstMoveDone={activeGame.firstMoveDone}
            onPlace={(pos, type) => makeMove(activeGame.id, { takPlace: { position: pos, pieceType: type } })}
            onMove={(from, dir, drops) => makeMove(activeGame.id, { takMove: { from, direction: dir, drops } })}
          />
        ) : activeGame.gameType === 'emoji-pictionary' ? (
          <EmojiPictionaryBoard
            players={activeGame.players}
            currentDescriber={activeGame.currentDescriber}
            currentWord={activeGame.currentWord}
            clues={activeGame.clues}
            guesses={activeGame.guesses}
            roundNumber={activeGame.roundNumber}
            totalRounds={activeGame.totalRounds}
            wordGuessed={activeGame.wordGuessed}
            myPlayerIndex={activeGame.players.findIndex(p => p.address === address)}
            isPlayable={activeGame.status === 'playing'}
            onSendClue={(clue) => makeMove(activeGame.id, { emojiClue: clue })}
            onGuess={(g) => makeMove(activeGame.id, { guess: g })}
            onSkip={() => makeMove(activeGame.id, { skipRound: true })}
          />
        ) : (
          <GameBoard
            board={(activeGame as any).board}
            gridSize={(activeGame as any).gridSize}
            currentTurn={activeGame.currentTurn}
            winningLine={(activeGame as any).winningLine}
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
      {activeGame.status === 'waiting' && playerRole && (
        <motion.div variants={staggerItem} className="text-center">
          <p className="text-text-secondary text-body-sm">
            Share the game link with a friend to start playing.
          </p>
        </motion.div>
      )}
      {/* Rules Modal */}
      <Modal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        title={GAME_RULES[activeGame.gameType]?.title || 'Rules'}
      >
        {(() => {
          const rules = GAME_RULES[activeGame.gameType]
          if (!rules) return null
          return (
            <div className="space-y-3">
              <p className="text-body-sm text-text-secondary">{rules.description}</p>
              <ul className="space-y-2">
                {rules.rules.map((rule, i) => (
                  <li key={i} className="flex gap-2 text-body-sm text-text-primary">
                    <span className="text-brand font-bold shrink-0">{i + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })()}
      </Modal>
    </motion.div>
  )
}
