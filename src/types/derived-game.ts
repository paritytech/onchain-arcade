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
  vsComputer: boolean
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

export interface DerivedGhost extends DerivedGameBase {
  gameType: 'ghost'
  fragment: string
  ghostLetters: { X: number; O: number }
  completedWord: boolean
  challengeResult: 'challenger_wins' | 'challenger_loses' | null
}

export type EntropyColor = 'R' | 'G' | 'B' | 'Y' | 'P'

export interface DerivedEntropy extends DerivedGameBase {
  gameType: 'entropy'
  board: (EntropyColor | null)[]
  nextPiece: EntropyColor | null
  piecesPlaced: number
  round: 1 | 2
  phase: 'chaos' | 'order'
  scores: { X: number; O: number }
  chaosPlayer: PlayerSymbol
  orderPlayer: PlayerSymbol
}

export interface HackenbushEdge {
  id: number
  from: number
  to: number
  color: 'R' | 'B'
  alive: boolean
}

export interface HackenbushNode {
  id: number
  x: number
  y: number
}

export interface DerivedHackenbush extends DerivedGameBase {
  gameType: 'hackenbush'
  edges: HackenbushEdge[]
  nodes: HackenbushNode[]
  groundNodes: number[]
}

export interface DerivedBlokusDuo extends DerivedGameBase {
  gameType: 'blokus-duo'
  board: (PlayerSymbol | null)[]
  remainingPieces: { X: number[]; O: number[] }
  scores: { X: number; O: number }
  consecutivePasses: number
}

export interface TakPiece {
  owner: PlayerSymbol
  type: 'flat' | 'wall' | 'capstone'
}

export interface TakCell {
  stack: TakPiece[]
}

export interface DerivedTak extends DerivedGameBase {
  gameType: 'tak'
  board: TakCell[][]
  flatStones: { X: number; O: number }
  capstones: { X: number; O: number }
  road: number[] | null
  firstMoveDone: { X: boolean; O: boolean }
}

export interface EmojiPlayer {
  address: string
  name: string | null
  score: number
}

export interface EmojiGuess {
  playerIndex: number
  text: string
  correct: boolean
}

export interface DerivedEmojiPictionary extends DerivedGameBase {
  gameType: 'emoji-pictionary'
  players: EmojiPlayer[]
  maxPlayers: number
  currentDescriber: number
  currentWord: string
  clues: string[]
  guesses: EmojiGuess[]
  roundNumber: number
  totalRounds: number
  wordGuessed: boolean
}

export type DerivedGame = DerivedTicTacToe | DerivedConnectFour | DerivedNim | DerivedDotsAndBoxes | DerivedMancala | DerivedReversi | DerivedGhost | DerivedEntropy | DerivedHackenbush | DerivedBlokusDuo | DerivedTak | DerivedEmojiPictionary
