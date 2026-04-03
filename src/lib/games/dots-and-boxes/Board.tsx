import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { PlayerSymbol } from '@/types/game'

interface DotsAndBoxesBoardProps {
  lines: string[]
  boxes: (PlayerSymbol | null)[]
  scores: { X: number; O: number }
  isMyTurn: boolean
  isPlayable: boolean
  onEdgeClick: (edge: string) => void
}

const DOTS = 4
const BOXES = 3
const DOT_SIZE = 12
const CELL_SIZE = 72
const LINE_THICKNESS = 8
const TAP_ZONE = 44

function edgeId(dir: 'h' | 'v', row: number, col: number): string {
  return `${dir}-${row}-${col}`
}

export function DotsAndBoxesBoard({ lines, boxes, scores, isMyTurn, isPlayable, onEdgeClick }: DotsAndBoxesBoardProps) {
  const lineSet = new Set(lines)
  const canClick = isMyTurn && isPlayable

  const svgSize = (DOTS - 1) * CELL_SIZE + DOT_SIZE * 2
  const offset = DOT_SIZE // padding for dots at edges

  const dotPos = (idx: number) => offset + idx * CELL_SIZE

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-6 text-body-sm font-semibold">
        <span className="text-pink-400">X: {scores.X}</span>
        <span className="text-blue-400">O: {scores.O}</span>
      </div>

      <div className="relative flex justify-center">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="max-w-full"
        >
          {/* Box fills */}
          {Array.from({ length: BOXES * BOXES }, (_, i) => {
            const row = Math.floor(i / BOXES), col = i % BOXES
            const owner = boxes[i]
            if (!owner) return null
            return (
              <rect
                key={`box-${i}`}
                x={dotPos(col) + LINE_THICKNESS / 2}
                y={dotPos(row) + LINE_THICKNESS / 2}
                width={CELL_SIZE - LINE_THICKNESS}
                height={CELL_SIZE - LINE_THICKNESS}
                rx={6}
                fill={owner === 'X' ? 'rgba(236,72,153,0.15)' : 'rgba(96,165,250,0.15)'}
              />
            )
          })}

          {/* Horizontal lines */}
          {Array.from({ length: DOTS }, (_, row) =>
            Array.from({ length: DOTS - 1 }, (_, col) => {
              const id = edgeId('h', row, col)
              const drawn = lineSet.has(id)
              const x = dotPos(col)
              const y = dotPos(row) - LINE_THICKNESS / 2
              return (
                <g key={id}>
                  {/* Tap zone */}
                  <rect
                    x={x}
                    y={y - (TAP_ZONE - LINE_THICKNESS) / 2}
                    width={CELL_SIZE}
                    height={TAP_ZONE}
                    fill="transparent"
                    className={canClick && !drawn ? 'cursor-pointer' : ''}
                    onClick={() => canClick && !drawn && onEdgeClick(id)}
                  />
                  {/* Visual line */}
                  {drawn ? (
                    <motion.rect
                      x={x} y={y} width={CELL_SIZE} height={LINE_THICKNESS} rx={3}
                      fill="currentColor" className="text-text-primary"
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    />
                  ) : (
                    <rect
                      x={x} y={y} width={CELL_SIZE} height={LINE_THICKNESS} rx={3}
                      className={cn(
                        canClick ? 'fill-grey-700/30 hover:fill-grey-500/50' : 'fill-grey-800/20'
                      )}
                    />
                  )}
                </g>
              )
            })
          )}

          {/* Vertical lines */}
          {Array.from({ length: DOTS - 1 }, (_, row) =>
            Array.from({ length: DOTS }, (_, col) => {
              const id = edgeId('v', row, col)
              const drawn = lineSet.has(id)
              const x = dotPos(col) - LINE_THICKNESS / 2
              const y = dotPos(row)
              return (
                <g key={id}>
                  <rect
                    x={x - (TAP_ZONE - LINE_THICKNESS) / 2}
                    y={y}
                    width={TAP_ZONE}
                    height={CELL_SIZE}
                    fill="transparent"
                    className={canClick && !drawn ? 'cursor-pointer' : ''}
                    onClick={() => canClick && !drawn && onEdgeClick(id)}
                  />
                  {drawn ? (
                    <motion.rect
                      x={x} y={y} width={LINE_THICKNESS} height={CELL_SIZE} rx={3}
                      fill="currentColor" className="text-text-primary"
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    />
                  ) : (
                    <rect
                      x={x} y={y} width={LINE_THICKNESS} height={CELL_SIZE} rx={3}
                      className={cn(
                        canClick ? 'fill-grey-700/30 hover:fill-grey-500/50' : 'fill-grey-800/20'
                      )}
                    />
                  )}
                </g>
              )
            })
          )}

          {/* Dots */}
          {Array.from({ length: DOTS * DOTS }, (_, i) => {
            const row = Math.floor(i / DOTS), col = i % DOTS
            return (
              <circle
                key={`dot-${i}`}
                cx={dotPos(col)}
                cy={dotPos(row)}
                r={DOT_SIZE / 2}
                className="fill-text-primary"
              />
            )
          })}

          {/* Box owner labels */}
          {Array.from({ length: BOXES * BOXES }, (_, i) => {
            const row = Math.floor(i / BOXES), col = i % BOXES
            const owner = boxes[i]
            if (!owner) return null
            return (
              <text
                key={`label-${i}`}
                x={dotPos(col) + CELL_SIZE / 2}
                y={dotPos(row) + CELL_SIZE / 2 + 5}
                textAnchor="middle"
                className={cn('text-lg font-bold', owner === 'X' ? 'fill-pink-400' : 'fill-blue-400')}
              >
                {owner}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
