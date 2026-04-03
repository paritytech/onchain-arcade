import type { GameStatement, PlayerSymbol } from '@/types/game'
import type { DerivedDotsAndBoxes } from '@/types/derived-game'
import { initGameState } from '../shared'

const DOTS_ROWS = 4
const DOTS_COLS = 4
const BOX_ROWS = 3
const BOX_COLS = 3
export const TOTAL_EDGES = 24 // 12 horizontal + 12 vertical

const EDGE_RE = /^([hv])-(\d+)-(\d+)$/

export function isValidEdge(edge: string): boolean {
  const m = EDGE_RE.exec(edge)
  if (!m) return false
  const [, dir, r, c] = m
  const row = parseInt(r), col = parseInt(c)
  if (dir === 'h') return row >= 0 && row < DOTS_ROWS && col >= 0 && col < DOTS_COLS - 1
  if (dir === 'v') return row >= 0 && row < DOTS_ROWS - 1 && col >= 0 && col < DOTS_COLS
  return false
}

function checkBoxCompleted(lines: Set<string>, row: number, col: number): boolean {
  return (
    lines.has(`h-${row}-${col}`) &&
    lines.has(`h-${row + 1}-${col}`) &&
    lines.has(`v-${row}-${col}`) &&
    lines.has(`v-${row}-${col + 1}`)
  )
}

function countNewBoxes(lines: Set<string>, edge: string): number[] {
  const m = EDGE_RE.exec(edge)!
  const [, dir, r, c] = m
  const row = parseInt(r), col = parseInt(c)
  const completed: number[] = []

  if (dir === 'h') {
    // Horizontal edge: can complete box above (row-1, col) and below (row, col)
    if (row > 0 && checkBoxCompleted(lines, row - 1, col)) completed.push((row - 1) * BOX_COLS + col)
    if (row < BOX_ROWS && checkBoxCompleted(lines, row, col)) completed.push(row * BOX_COLS + col)
  } else {
    // Vertical edge: can complete box left (row, col-1) and right (row, col)
    if (col > 0 && checkBoxCompleted(lines, row, col - 1)) completed.push(row * BOX_COLS + col - 1)
    if (col < BOX_COLS && checkBoxCompleted(lines, row, col)) completed.push(row * BOX_COLS + col)
  }

  return completed
}

export function deriveDotsAndBoxes(gameId: string, stmts: GameStatement[]): DerivedDotsAndBoxes | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const lines = new Set<string>()
  const boxes: (PlayerSymbol | null)[] = Array(BOX_ROWS * BOX_COLS).fill(null)
  let scoreX = 0, scoreO = 0
  let currentTurn: PlayerSymbol = 'X'

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue
    if (!stmt.edge || !isValidEdge(stmt.edge)) continue
    if (lines.has(stmt.edge)) continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    if (symbol !== currentTurn) continue

    lines.add(stmt.edge)
    moveCount++
    updatedAt = stmt.timestamp

    const newBoxes = countNewBoxes(lines, stmt.edge)
    for (const boxIdx of newBoxes) {
      boxes[boxIdx] = symbol
      if (symbol === 'X') scoreX++; else scoreO++
    }

    // Extra turn if at least one box was completed
    if (newBoxes.length === 0) {
      currentTurn = currentTurn === 'X' ? 'O' : 'X'
    }

    if (lines.size === TOTAL_EDGES) {
      status = 'finished'
      if (scoreX > scoreO) result = 'x_wins'
      else if (scoreO > scoreX) result = 'o_wins'
      else result = 'draw'
    }
  }

  return {
    id: gameId,
    gameType: 'dots-and-boxes',
    lines: [...lines],
    boxes,
    scores: { X: scoreX, O: scoreO },
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO: init.playerO,
    playerOName: init.playerOName,
    currentTurn,
    status,
    result,
    moveCount,
    createdAt: create.timestamp,
    updatedAt,
  }
}
