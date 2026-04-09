import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { PlayerSymbol } from '@/types/game'
import { PIECES, rotatePiece, getCells, isValidPlacement } from './deriver'

interface BlokusDuoBoardProps {
  board: (PlayerSymbol | null)[]
  remainingPieces: { X: number[]; O: number[] }
  scores: { X: number; O: number }
  consecutivePasses: number
  currentTurn: PlayerSymbol
  isMyTurn: boolean
  isPlayable: boolean
  onPlacePiece: (pieceId: number, position: number, rotation: number, flip: boolean) => void
  onPass: () => void
}

const SIZE = 14
const START_CELL_X = 60
const START_CELL_O = 135

function MiniPieceGrid({ shape, isSelected, color }: { shape: [number, number][]; isSelected: boolean; color: string }) {
  const maxR = Math.max(...shape.map(([r]) => r)) + 1
  const maxC = Math.max(...shape.map(([, c]) => c)) + 1
  const cellSet = new Set(shape.map(([r, c]) => `${r},${c}`))

  return (
    <div
      className={cn(
        'grid gap-px p-1 rounded border-2 transition-colors cursor-pointer',
        isSelected ? 'border-yellow-400 bg-yellow-400/20' : 'border-border bg-surface hover:border-text/40',
      )}
      style={{ gridTemplateColumns: `repeat(${maxC}, 10px)` }}
    >
      {Array.from({ length: maxR * maxC }, (_, i) => {
        const r = Math.floor(i / maxC)
        const c = i % maxC
        const filled = cellSet.has(`${r},${c}`)
        return (
          <div
            key={i}
            className={cn(
              'w-[10px] h-[10px] rounded-sm',
              filled ? color : 'bg-transparent',
            )}
          />
        )
      })}
    </div>
  )
}

export function BlokusDuoBoard({
  board,
  remainingPieces,
  scores,
  consecutivePasses,
  currentTurn,
  isMyTurn,
  isPlayable,
  onPlacePiece,
  onPass,
}: BlokusDuoBoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)
  const [flip, setFlip] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canAct = isMyTurn && isPlayable
  const myPieces = remainingPieces[currentTurn]
  const pieceColor = currentTurn === 'X' ? 'bg-rose-500' : 'bg-blue-500'
  const pieceBoardColor = currentTurn === 'X' ? 'bg-rose-400/40' : 'bg-blue-400/40'

  // Compute ghost cells for hovered position
  const ghostCells = useMemo(() => {
    if (selectedPiece == null || hoveredCell == null) return new Set<number>()
    const pieceDef = PIECES.find(p => p.id === selectedPiece)
    if (!pieceDef) return new Set<number>()
    const transformed = rotatePiece(pieceDef.shape, rotation, flip)
    const cells = getCells(hoveredCell, transformed)
    if (!cells) return new Set<number>()
    return new Set(cells)
  }, [selectedPiece, hoveredCell, rotation, flip])

  function handleCellClick(index: number) {
    if (!canAct || selectedPiece == null) return
    setError(null)

    const pieceDef = PIECES.find(p => p.id === selectedPiece)
    if (!pieceDef) return

    const transformed = rotatePiece(pieceDef.shape, rotation, flip)
    const cells = getCells(index, transformed)
    if (!cells) {
      setError('Piece goes off the board')
      return
    }

    const isFirstMove = currentTurn === 'X'
      ? !board.some(c => c === 'X')
      : !board.some(c => c === 'O')
    const startCell = currentTurn === 'X' ? START_CELL_X : START_CELL_O

    if (!isValidPlacement(board, cells, currentTurn, isFirstMove, startCell)) {
      setError('Invalid placement: check corner/edge rules')
      return
    }

    onPlacePiece(selectedPiece, index, rotation, flip)
    setSelectedPiece(null)
    setRotation(0)
    setFlip(false)
    setError(null)
  }

  function handlePass() {
    if (!canAct) return
    onPass()
    setSelectedPiece(null)
    setError(null)
  }

  return (
    <div className="space-y-3">
      {/* Scores */}
      <div className="flex justify-center gap-6 text-body-sm font-semibold">
        <span className="text-rose-400">X (Pink): {scores.X}</span>
        <span className="text-blue-400">O (Blue): {scores.O}</span>
        {consecutivePasses > 0 && (
          <span className="text-text/60">Passes: {consecutivePasses}/2</span>
        )}
      </div>

      {/* Board */}
      <div className="relative">
        <div
          className="grid gap-0 w-fit mx-auto bg-grey-200 dark:bg-grey-800 p-1 rounded-xl border border-grey-300 dark:border-grey-700"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
        >
          {board.map((cell, index) => {
            const isStartX = index === START_CELL_X
            const isStartO = index === START_CELL_O
            const isGhost = ghostCells.has(index)

            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                onMouseEnter={() => setHoveredCell(index)}
                onMouseLeave={() => setHoveredCell(null)}
                disabled={!canAct}
                className={cn(
                  'w-[22px] h-[22px] border border-grey-300 dark:border-grey-700 flex items-center justify-center transition-colors',
                  'bg-grey-100 dark:bg-grey-900',
                  canAct && selectedPiece != null && 'cursor-crosshair hover:bg-grey-200 dark:hover:bg-grey-700',
                  !canAct && 'cursor-default',
                )}
                aria-label={
                  cell ? `${cell} piece` :
                  isStartX ? 'X start' :
                  isStartO ? 'O start' :
                  'Empty'
                }
              >
                {cell === 'X' ? (
                  <motion.div
                    className="w-[18px] h-[18px] rounded-sm bg-rose-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                ) : cell === 'O' ? (
                  <motion.div
                    className="w-[18px] h-[18px] rounded-sm bg-blue-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                ) : isGhost && canAct ? (
                  <div className={cn('w-[18px] h-[18px] rounded-sm opacity-50', pieceBoardColor)} />
                ) : (isStartX || isStartO) ? (
                  <div className={cn(
                    'w-[10px] h-[10px] rounded-full opacity-60',
                    isStartX ? 'bg-rose-400' : 'bg-blue-400',
                  )} />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      {canAct && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setRotation((rotation + 1) % 4)}
              className="px-3 py-1 text-body-sm rounded bg-surface border border-border hover:bg-text/10 transition-colors"
              aria-label="Rotate piece"
            >
              Rotate ({rotation * 90})
            </button>
            <button
              onClick={() => setFlip(!flip)}
              className={cn(
                'px-3 py-1 text-body-sm rounded border transition-colors',
                flip ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' : 'bg-surface border-border hover:bg-text/10',
              )}
              aria-label="Flip piece"
            >
              Flip {flip ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handlePass}
              className="px-3 py-1 text-body-sm rounded bg-red-900/30 border border-red-700 hover:bg-red-800/40 text-red-300 transition-colors"
              aria-label="Pass turn"
            >
              Pass
            </button>
          </div>

          {error && (
            <p className="text-center text-body-sm text-red-400">{error}</p>
          )}
        </div>
      )}

      {/* Piece Palette */}
      {canAct && (
        <div className="space-y-1">
          <p className="text-body-sm text-text/60 text-center">Select a piece:</p>
          <div className="flex flex-wrap justify-center gap-2 max-h-48 overflow-y-auto p-2">
            {myPieces.map(pieceId => {
              const pieceDef = PIECES.find(p => p.id === pieceId)
              if (!pieceDef) return null
              const transformed = rotatePiece(pieceDef.shape, rotation, flip)
              return (
                <div
                  key={pieceId}
                  onClick={() => setSelectedPiece(selectedPiece === pieceId ? null : pieceId)}
                  title={pieceDef.name}
                >
                  <MiniPieceGrid
                    shape={transformed}
                    isSelected={selectedPiece === pieceId}
                    color={pieceColor}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
