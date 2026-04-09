import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { PlayerSymbol } from '@/types/game'
import type { TakCell, TakPiece } from '@/types/derived-game'

type PieceType = 'flat' | 'wall' | 'capstone'
type Direction = 'N' | 'S' | 'E' | 'W'

interface TakBoardProps {
  board: TakCell[][]
  flatStones: { X: number; O: number }
  capstones: { X: number; O: number }
  road: number[] | null
  currentTurn: PlayerSymbol
  isMyTurn: boolean
  isPlayable: boolean
  firstMoveDone: { X: boolean; O: boolean }
  onPlace: (position: number, pieceType: PieceType) => void
  onMove: (from: number, direction: Direction, drops: number[]) => void
}

type Mode = 'place' | 'move'

const DIR_LABELS: Record<Direction, string> = { N: '\u2191', S: '\u2193', E: '\u2192', W: '\u2190' }
const DIRECTIONS: Direction[] = ['N', 'S', 'E', 'W']

function PieceIcon({ piece, size = 'md' }: { piece: TakPiece; size?: 'sm' | 'md' }) {
  const isX = piece.owner === 'X'
  const base = isX
    ? 'bg-rose-500 border-rose-700'
    : 'bg-sky-400 border-sky-600'
  const dim = size === 'sm' ? 'w-3 h-3' : 'w-7 h-7'

  if (piece.type === 'capstone') {
    return <div className={cn(dim, 'rounded-full border-2', base)} />
  }
  if (piece.type === 'wall') {
    return (
      <div
        className={cn(
          'border-2 rounded-sm',
          base,
          size === 'sm' ? 'w-3 h-5' : 'w-4 h-8',
        )}
      />
    )
  }
  // flat
  return <div className={cn(dim, 'rounded-md border-2', base)} />
}

export function TakBoard({
  board,
  flatStones,
  capstones,
  road,
  currentTurn,
  isMyTurn,
  isPlayable,
  firstMoveDone,
  onPlace,
  onMove,
}: TakBoardProps) {
  const [mode, setMode] = useState<Mode>('place')
  const [selectedPieceType, setSelectedPieceType] = useState<PieceType>('flat')
  const [selectedStack, setSelectedStack] = useState<number | null>(null)

  const canAct = isMyTurn && isPlayable
  const roadSet = new Set(road ?? [])
  const isFirstMove = !firstMoveDone[currentTurn]

  function handleCellClick(r: number, c: number) {
    if (!canAct) return
    const pos = r * 5 + c
    const cell = board[r][c]

    if (mode === 'place') {
      if (cell.stack.length > 0) return
      onPlace(pos, isFirstMove ? 'flat' : selectedPieceType)
      resetSelection()
    } else {
      // Move mode
      if (selectedStack === null) {
        // Select a stack
        if (cell.stack.length === 0) return
        const top = cell.stack[cell.stack.length - 1]
        if (top.owner !== currentTurn) return
        setSelectedStack(pos)
      }
    }
  }

  function handleDirectionClick(dir: Direction) {
    if (selectedStack === null) return
    // Default drops: 1 per cell for entire pickup (up to stack size or MAX_CARRY)
    const sr = Math.floor(selectedStack / 5)
    const sc = selectedStack % 5
    const stackSize = board[sr][sc].stack.length
    const pickup = Math.min(stackSize, 5)

    const offsets: Record<Direction, [number, number]> = {
      N: [-1, 0], S: [1, 0], E: [0, 1], W: [0, -1],
    }
    const [dr, dc] = offsets[dir]

    // Calculate max cells we can drop into
    let maxCells = 0
    let cr = sr, cc = sc
    for (let i = 0; i < pickup; i++) {
      cr += dr
      cc += dc
      if (cr < 0 || cr >= 5 || cc < 0 || cc >= 5) break
      const destTop = board[cr][cc].stack.length > 0 ? board[cr][cc].stack[board[cr][cc].stack.length - 1] : null
      if (destTop && destTop.type === 'capstone') break
      if (destTop && destTop.type === 'wall') {
        // Only ok if this is the last cell and we're dropping a capstone
        maxCells++
        break
      }
      maxCells++
    }

    if (maxCells === 0) return

    // Default: spread 1 per cell, remaining on last cell
    const drops: number[] = []
    let remaining = pickup
    for (let i = 0; i < maxCells && remaining > 0; i++) {
      if (i === maxCells - 1) {
        drops.push(remaining)
      } else {
        drops.push(1)
        remaining--
      }
    }

    onMove(selectedStack, dir, drops)
    resetSelection()
  }

  function resetSelection() {
    setSelectedStack(null)
  }

  return (
    <div className="space-y-4">
      {/* Piece inventory */}
      <div className="flex justify-center gap-6 text-body-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-rose-500 border border-rose-700" />
          <span className="text-text">X: {flatStones.X}F / {capstones.X}C</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-sky-400 border border-sky-600" />
          <span className="text-text">O: {flatStones.O}F / {capstones.O}C</span>
        </div>
      </div>

      {/* Mode + piece type selector */}
      {canAct && !isFirstMove && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => { setMode('place'); resetSelection() }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors',
              mode === 'place'
                ? 'bg-accent text-white'
                : 'bg-surface text-text border border-border hover:bg-surface/80',
            )}
          >
            Place
          </button>
          <button
            onClick={() => { setMode('move'); resetSelection() }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors',
              mode === 'move'
                ? 'bg-accent text-white'
                : 'bg-surface text-text border border-border hover:bg-surface/80',
            )}
          >
            Move Stack
          </button>

          {mode === 'place' && (
            <div className="flex gap-1 ml-2">
              {(['flat', 'wall', 'capstone'] as PieceType[]).map(pt => (
                <button
                  key={pt}
                  onClick={() => setSelectedPieceType(pt)}
                  disabled={pt === 'capstone' ? capstones[currentTurn] <= 0 : flatStones[currentTurn] <= 0}
                  className={cn(
                    'px-2 py-1.5 rounded-lg text-body-sm capitalize transition-colors',
                    selectedPieceType === pt
                      ? 'bg-accent/80 text-white'
                      : 'bg-surface text-text border border-border hover:bg-surface/80',
                    (pt === 'capstone' ? capstones[currentTurn] <= 0 : flatStones[currentTurn] <= 0) && 'opacity-40 cursor-not-allowed',
                  )}
                >
                  {pt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isFirstMove && canAct && (
        <p className="text-center text-body-sm text-text/60">
          First move: place opponent's flat stone on an empty cell
        </p>
      )}

      {/* Direction selector for move mode */}
      {selectedStack !== null && mode === 'move' && (
        <div className="flex justify-center gap-2">
          <span className="text-body-sm text-text/60 mr-2">Direction:</span>
          {DIRECTIONS.map(dir => (
            <button
              key={dir}
              onClick={() => handleDirectionClick(dir)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface border border-border hover:bg-accent hover:text-white transition-colors text-lg font-bold"
              aria-label={`Move ${dir}`}
            >
              {DIR_LABELS[dir]}
            </button>
          ))}
          <button
            onClick={resetSelection}
            className="px-2 py-1 rounded-lg text-body-sm bg-surface border border-border hover:bg-red-500/20 text-text transition-colors ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Board grid */}
      <div className="relative">
        <div
          className="grid gap-1.5 w-fit mx-auto bg-amber-800 dark:bg-amber-950/80 p-2.5 rounded-xl border border-amber-700 dark:border-amber-900"
          style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const pos = r * 5 + c
              const isRoad = roadSet.has(pos)
              const isSelected = selectedStack === pos
              const top = cell.stack.length > 0 ? cell.stack[cell.stack.length - 1] : null
              const isEmpty = cell.stack.length === 0
              const clickable = canAct && (
                (mode === 'place' && isEmpty) ||
                (mode === 'move' && selectedStack === null && !isEmpty && top?.owner === currentTurn) ||
                false
              )

              return (
                <motion.button
                  key={pos}
                  onClick={() => handleCellClick(r, c)}
                  disabled={!clickable && !isSelected}
                  className={cn(
                    'w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center relative',
                    'bg-amber-200 dark:bg-amber-800/70 rounded-md transition-all border border-amber-300 dark:border-amber-700/50',
                    isRoad && 'ring-2 ring-yellow-400 bg-yellow-100 dark:bg-yellow-900/40',
                    isSelected && 'ring-2 ring-accent bg-accent/10',
                    clickable && 'cursor-pointer hover:bg-amber-300 dark:hover:bg-amber-700/70',
                    !clickable && !isSelected && 'cursor-default',
                  )}
                  whileTap={clickable ? { scale: 0.95 } : undefined}
                  aria-label={
                    top ? `${top.owner} ${top.type}${cell.stack.length > 1 ? ` (stack of ${cell.stack.length})` : ''}` : 'Empty cell'
                  }
                >
                  {top && <PieceIcon piece={top} />}
                  {cell.stack.length > 1 && (
                    <span className="absolute top-0.5 right-1 text-[10px] font-bold text-text/70 bg-surface/80 rounded-full w-4 h-4 flex items-center justify-center">
                      {cell.stack.length}
                    </span>
                  )}
                </motion.button>
              )
            }),
          )}
        </div>

        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-15 bg-gradient-to-br from-amber-500 via-transparent to-amber-500/30 rounded-3xl"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
