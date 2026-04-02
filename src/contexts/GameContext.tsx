import React, { createContext, useContext, useState, useCallback, useEffect, useSyncExternalStore } from 'react'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useNotifications } from '@/contexts/NotificationProvider'
import { statementStore, type DerivedGame } from '@/lib/statementStore'
import type { GameStatement, PlayerSymbol, GridSize } from '@/types/game'
import { generateGameId } from '@/types/game'

export type { DerivedGame as Game } from '@/lib/statementStore'

interface GameContextType {
  games: DerivedGame[]
  activeGame: DerivedGame | null
  isLoading: boolean
  createGame: (gridSize?: GridSize) => Promise<string | null>
  joinGame: (gameId: string, hostAddress?: string) => Promise<boolean>
  makeMove: (gameId: string, cellIndex: number) => Promise<boolean>
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

/** Hook into statementStore changes via useSyncExternalStore for zero-lag React updates. */
function useStatementStoreGames(): DerivedGame[] {
  return useSyncExternalStore(
    (cb) => statementStore.subscribe(cb),
    () => statementStore.getAllGames()
  )
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, address, productAccountId, displayName } = usePolkadotWallet()
  const { addNotification } = useNotifications()
  const games = useStatementStoreGames()
  const [activeGameId, setActiveGameId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const activeGame = activeGameId ? statementStore.getGame(activeGameId) : null

  // Track previous move count to detect opponent moves for notifications
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

  // RPC connection is lazy — only opened when a game is created, joined, or loaded.
  // No always-on subscription from app startup.

  const createGame = useCallback(async (gridSize: GridSize = 3): Promise<string | null> => {
    if (!isConnected || !address) {
      addNotification('error', 'Connect your wallet to create a game')
      return null
    }

    setIsLoading(true)
    try {
      // Connect RPC lazily so we can receive the opponent's join
      statementStore.connectRpc(productAccountId)

      const gameId = generateGameId()
      const stmt: GameStatement = {
        type: 'create_game',
        gameId,
        playerX: address,
        playerXName: displayName || undefined,
        gridSize: gridSize !== 3 ? gridSize : undefined,
        timestamp: Date.now(),
      }

      // Submit to network so the opponent receives playerXName via subscription
      statementStore.applyAndSubmit(stmt)
      setActiveGameId(gameId)
      prevMoveCountRef.current = 0
      addNotification('success', `Game created! Share code: ${gameId}`)
      return gameId
    } catch (err) {
      console.error('[Game] Create failed:', err)
      addNotification('error', 'Failed to create game')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, address, productAccountId, displayName, addNotification])

  const joinGame = useCallback(async (gameId: string, hostAddress?: string): Promise<boolean> => {
    if (!isConnected || !address) {
      addNotification('error', 'Connect your wallet to join a game')
      return false
    }

    setIsLoading(true)
    try {
      statementStore.connectRpc(productAccountId)

      const normalizedId = gameId.trim().toUpperCase()
      const game = statementStore.getGame(normalizedId)

      if (game) {
        if (game.status !== 'waiting') {
          addNotification('error', 'This game is no longer available')
          return false
        }
        if (game.playerX === address) {
          addNotification('error', 'You cannot join your own game')
          return false
        }
      } else if (!hostAddress) {
        addNotification('error', 'Game not found. Make sure the game host is online.')
        return false
      }

      // Determine the host's playerX address
      const playerX = game?.playerX ?? hostAddress
      if (!playerX) {
        addNotification('error', 'Game not found. Make sure the game host is online.')
        return false
      }

      // Bootstrap locally if game doesn't exist yet (cross-browser join)
      if (!game && hostAddress) {
        if (hostAddress === address) {
          addNotification('error', 'You cannot join your own game')
          return false
        }
        statementStore.applyLocal({
          type: 'create_game',
          gameId: normalizedId,
          playerX: hostAddress,
          timestamp: Date.now() - 1,
        })
      }

      // Submit the create_game to the node (deferred from game creation).
      // This ensures the statement only reaches the node when someone actually joins.
      const createStmt: GameStatement = {
        type: 'create_game',
        gameId: normalizedId,
        playerX,
        playerXName: game?.playerXName || undefined,
        timestamp: game?.createdAt ?? Date.now() - 1,
      }
      statementStore.applyAndSubmit(createStmt)

      // Now submit the join
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
  }, [isConnected, address, productAccountId, displayName, addNotification])

  const makeMove = useCallback(async (gameId: string, cellIndex: number): Promise<boolean> => {
    if (!isConnected || !address) return false

    const game = statementStore.getGame(gameId)
    if (!game) return false
    if (game.status !== 'playing') return false
    if (game.board[cellIndex] !== null) return false

    const isPlayerX = game.playerX === address
    const isPlayerO = game.playerO === address
    if (!isPlayerX && !isPlayerO) return false

    const playerSymbol: PlayerSymbol = isPlayerX ? 'X' : 'O'
    if (game.currentTurn !== playerSymbol) return false

    const stmt: GameStatement = {
      type: 'make_move',
      gameId,
      player: address,
      cellIndex,
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
  }, [isConnected, address, addNotification])

  const loadGame = useCallback((gameId: string) => {
    const normalizedId = gameId.toUpperCase()
    setActiveGameId(normalizedId)
    prevMoveCountRef.current = statementStore.getGame(normalizedId)?.moveCount ?? 0
    // Connect lazily — only when viewing a game
    statementStore.connectRpc(productAccountId)
  }, [productAccountId])

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
