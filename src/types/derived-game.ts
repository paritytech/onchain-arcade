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

export interface DerivedDotsAndBoxes extends DerivedGameBase {
  gameType: 'dots-and-boxes'
  lines: string[]
  boxes: (PlayerSymbol | null)[]
  scores: { X: number; O: number }
}

export interface DerivedMancala extends DerivedGameBase {
  gameType: 'mancala'
  pits: number[]
  lastSowEnd: number | null
}

export interface DerivedReversi extends DerivedGameBase {
  gameType: 'reversi'
  board: CellValue[]
  validMoves: number[]
  skippedLastTurn: boolean
  scores: { X: number; O: number }
}

export type DerivedGame = DerivedTicTacToe | DerivedConnectFour | DerivedNim | DerivedDotsAndBoxes | DerivedMancala | DerivedReversi
