import React, { createContext, useContext, useState, useCallback, useEffect, useSyncExternalStore } from 'react'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useNotifications } from '@/contexts/NotificationProvider'
import { statementStore, type DerivedGame } from '@/lib/statementStore'
import { statementStoreHost } from '@/lib/statementStoreHost'
import type { GameStatement, PlayerSymbol, GameType, GridSize } from '@/types/game'
import { generateGameId } from '@/types/game'

export type { DerivedGame as Game, DerivedTicTacToe, DerivedConnectFour, DerivedNim } from '@/types/derived-game'

export type MovePayload =
  | { cellIndex: number }
  | { column: number }
  | { heap: number; count: number }
  | { edge: string }
  | { pit: number }
  | { ghostLetter: string }
  | { ghostChallenge: true }
  | { hackenbushEdge: number }
  | { entropyPlace: number }
  | { entropySlide: { from: number; to: number } }
  | { entropyPass: true }
  | { blokusMove: { pieceId: number; position: number; rotation: number; flip: boolean } }
  | { blokusPass: true }
  | { takPlace: { position: number; pieceType: 'flat' | 'wall' | 'capstone' } }
  | { takMove: { from: number; direction: 'N' | 'S' | 'E' | 'W'; drops: number[] } }
  | { emojiClue: string }
  | { guess: string }
  | { skipRound: true }

interface GameContextType {
  games: DerivedGame[]
  activeGame: DerivedGame | null
  isLoading: boolean
  createGame: (gameType?: GameType, options?: { gridSize?: GridSize; nimConfig?: number[]; vsComputer?: boolean; maxPlayers?: number }) => Promise<string | null>
  joinGame: (gameId: string, hostAddress?: string, gameType?: GameType) => Promise<boolean>
  makeMove: (gameId: string, move: MovePayload) => Promise<boolean>
  loadGame: (gameId: string) => void
  leaveGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

function useStatementStoreGames(): DerivedGame[] {
  return useSyncExternalStore(
    (cb) => statementStore.subscribe(cb),
    () => statementStore.getAllGames()
  )
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { address, mode, hostSigningReady, displayName } = usePolkadotWallet()
  const { addNotification } = useNotifications()
  const games = useStatementStoreGames()
  const [activeGameId, setActiveGameId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const activeGame = activeGameId ? statementStore.getGame(activeGameId) : null

  // Surface transport failures. Both channels existed but were wired to
  // nothing, so "the host serves no Statement Store" and "your move was never
  // published" reached the console and stopped there — the player saw a game
  // that looked fine and an opponent who never moved.
  useEffect(() => {
    statementStoreHost.onFatalError = (err) => addNotification('error', err.message)
    statementStore.onSubmitError = (_err, stmt) => {
      const what = stmt.type === 'make_move' ? 'move' : 'game'
      addNotification(
        'error',
        `Your ${what} could not be published, so your opponent will not see it. Check your connection and try again.`,
      )
    }
    return () => {
      statementStoreHost.onFatalError = undefined
      statementStore.onSubmitError = undefined
    }
  }, [addNotification])

  const prevMoveCountRef = React.useRef<number>(0)
  useEffect(() => {
    if (!activeGame || !address) return
    const prevCount = prevMoveCountRef.current
    prevMoveCountRef.current = activeGame.moveCount

    if (activeGame.moveCount > prevCount && prevCount > 0 && activeGame.status === 'finished') {
      const playerRole = activeGame.playerX === address ? 'X' : activeGame.playerO === address ? 'O' : null
      if (activeGame.result === 'draw') {
        addNotification('info', "It's a draw!")
      } else if (activeGame.result === 'x_wins') {
        addNotification(playerRole === 'X' ? 'success' : 'info', playerRole === 'X' ? 'You win!' : 'X wins!')
      } else if (activeGame.result === 'o_wins') {
        addNotification(playerRole === 'O' ? 'success' : 'info', playerRole === 'O' ? 'You win!' : 'O wins!')
      }
    }
  }, [activeGame?.moveCount, activeGame?.status, activeGame?.result, address, addNotification, activeGame])

  const createGame = useCallback(async (
    gameType: GameType = 'tic-tac-toe',
    options?: { gridSize?: GridSize; nimConfig?: number[]; vsComputer?: boolean; maxPlayers?: number }
  ): Promise<string | null> => {
    if (!address) {
      addNotification('error', 'Connect your wallet to create a game')
      return null
    }

    setIsLoading(true)
    try {
      statementStore.connectRpc(mode, hostSigningReady)

      const gameId = generateGameId()
      const stmt: GameStatement = {
        type: 'create_game',
        gameId,
        playerX: address,
        playerXName: displayName || undefined,
        gameType: gameType !== 'tic-tac-toe' ? gameType : undefined,
        gridSize: options?.gridSize && options.gridSize !== 3 ? options.gridSize : undefined,
        nimConfig: options?.nimConfig,
        vsComputer: options?.vsComputer || undefined,
        maxPlayers: options?.maxPlayers,
        timestamp: Date.now(),
      }

      statementStore.applyAndSubmit(stmt)

      // Auto-join as computer opponent
      if (options?.vsComputer) {
        const joinStmt: GameStatement = {
          type: 'join_game',
          gameId,
          playerO: 'computer',
          playerOName: 'Computer',
          timestamp: Date.now(),
        }
        statementStore.applyLocal(joinStmt)
      }

      setActiveGameId(gameId)
      prevMoveCountRef.current = 0
      addNotification('success', options?.vsComputer ? 'Game started vs Computer!' : `Game created! Share code: ${gameId}`)
      return gameId
    } catch (err) {
      console.error('[Game] Create failed:', err)
      addNotification('error', 'Failed to create game')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [address, mode, hostSigningReady, displayName, addNotification])

  const joinGame = useCallback(async (gameId: string, hostAddress?: string, gameType?: GameType): Promise<boolean> => {
    if (!address) {
      addNotification('error', 'Wallet still connecting, please try again')
      return false
    }

    setIsLoading(true)
    try {
      statementStore.connectRpc(mode, hostSigningReady)

      const normalizedId = gameId.trim().toUpperCase()
      let game = statementStore.getGame(normalizedId)

      if (!game && hostAddress) {
        if (hostAddress === address) {
          addNotification('error', 'You cannot join your own game')
          return false
        }
        statementStore.applyLocal({
          type: 'create_game',
          gameId: normalizedId,
          playerX: hostAddress,
          gameType: gameType && gameType !== 'tic-tac-toe' ? gameType : undefined,
          timestamp: Date.now() - 1,
        })
        game = statementStore.getGame(normalizedId)
      }

      if (!game) {
        addNotification('error', 'Game not found. Make sure the game host is online.')
        return false
      }

      if (game.status !== 'waiting') {
        addNotification('error', 'This game is no longer available')
        return false
      }
      if (game.playerX === address) {
        addNotification('error', 'You cannot join your own game')
        return false
      }

      const joinStmt: GameStatement = {
        type: 'join_game',
        gameId: normalizedId,
        playerO: address,
        playerOName: displayName || undefined,
        timestamp: Date.now(),
      }
      statementStore.applyAndSubmit(joinStmt)
      setActiveGameId(normalizedId)
      prevMoveCountRef.current = 0
      addNotification('success', 'Joined game! You are O')
      return true
    } catch (err) {
      console.error('[Game] Join failed:', err)
      addNotification('error', 'Failed to join game')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [address, mode, hostSigningReady, displayName, addNotification])

  const makeMove = useCallback(async (gameId: string, move: MovePayload): Promise<boolean> => {
    if (!address) return false

    const game = statementStore.getGame(gameId)
    if (!game) return false
    if (game.status !== 'playing') return false

    const isPlayerX = game.playerX === address
    const isPlayerO = game.playerO === address
    if (!isPlayerX && !isPlayerO) return false

    const playerSymbol: PlayerSymbol = isPlayerX ? 'X' : 'O'
    if (game.currentTurn !== playerSymbol) return false

    const stmt: GameStatement = {
      type: 'make_move',
      gameId,
      player: address,
      ...('cellIndex' in move ? { cellIndex: move.cellIndex } : {}),
      ...('column' in move ? { column: move.column } : {}),
      ...('heap' in move ? { nimMove: { heap: move.heap, count: move.count } } : {}),
      ...('edge' in move ? { edge: move.edge } : {}),
      ...('pit' in move ? { pit: move.pit } : {}),
      ...('ghostLetter' in move ? { ghostLetter: move.ghostLetter } : {}),
      ...('ghostChallenge' in move ? { ghostChallenge: true } : {}),
      ...('hackenbushEdge' in move ? { hackenbushEdge: move.hackenbushEdge } : {}),
      ...('entropyPlace' in move ? { entropyPlace: move.entropyPlace } : {}),
      ...('entropySlide' in move ? { entropySlide: move.entropySlide } : {}),
      ...('entropyPass' in move ? { entropyPass: true } : {}),
      ...('blokusMove' in move ? { blokusMove: move.blokusMove } : {}),
      ...('blokusPass' in move ? { blokusPass: true } : {}),
      ...('takPlace' in move ? { takPlace: move.takPlace } : {}),
      ...('takMove' in move ? { takMove: move.takMove } : {}),
      ...('emojiClue' in move ? { emojiClue: move.emojiClue } : {}),
      ...('guess' in move ? { guess: move.guess } : {}),
      ...('skipRound' in move ? { skipRound: true } : {}),
      timestamp: Date.now(),
    }

    const updatedGame = await statementStore.applyAndSubmit(stmt)

    if (updatedGame?.status === 'finished') {
      if (updatedGame.result === 'draw') {
        addNotification('info', "It's a draw!")
      } else if (updatedGame.result === 'x_wins') {
        addNotification(isPlayerX ? 'success' : 'info', isPlayerX ? 'You win!' : 'X wins!')
      } else if (updatedGame.result === 'o_wins') {
        addNotification(isPlayerO ? 'success' : 'info', isPlayerO ? 'You win!' : 'O wins!')
      }
    }

    return true
  }, [address, addNotification])

  const loadGame = useCallback((gameId: string) => {
    const normalizedId = gameId.toUpperCase()
    setActiveGameId(normalizedId)
    prevMoveCountRef.current = statementStore.getGame(normalizedId)?.moveCount ?? 0
    statementStore.connectRpc(mode, hostSigningReady)
  }, [mode, hostSigningReady])

  const leaveGame = useCallback(() => {
    setActiveGameId(null)
  }, [])

  return (
    <GameContext.Provider
      value={{
        games,
        activeGame,
        isLoading,
        createGame,
        joinGame,
        makeMove,
        loadGame,
        leaveGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
