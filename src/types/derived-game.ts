import type { GameType, GameStatus, GameResult, PlayerSymbol, GridSize, CellValue } from './game'

export interface DerivedGameBase {
  id: string
  gameType: GameType
  playerX: string
  playerXName: string | null
  playerO: string | null
  playerOName: string | null
  currentTurn: PlayerSymbol
  status: GameStatus
  result: GameResult
  moveCount: number
  createdAt: number
  updatedAt: number
}

export interface DerivedTicTacToe extends DerivedGameBase {
  gameType: 'tic-tac-toe'
  gridSize: GridSize
  board: CellValue[]
  winningLine: number[] | null
}

export interface DerivedConnectFour extends DerivedGameBase {
  gameType: 'connect-four'
  board: CellValue[]
  winningLine: number[] | null
}

export interface DerivedNim extends DerivedGameBase {
  gameType: 'nim'
  heaps: number[]
  lastMove: { heap: number; count: number } | null
}

export type DerivedGame = DerivedTicTacToe | DerivedConnectFour | DerivedNim
