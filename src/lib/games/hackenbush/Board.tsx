import { motion, AnimatePresence } from 'framer-motion'
import type { HackenbushEdge, HackenbushNode } from '@/types/derived-game'

interface HackenbushBoardProps {
  edges: HackenbushEdge[]
  nodes: HackenbushNode[]
  groundNodes: number[]
  currentTurn: 'X' | 'O'
  isMyTurn: boolean
  isPlayable: boolean
  onRemoveEdge: (edgeId: number) => void
}

const SVG_WIDTH = 300
const SVG_HEIGHT = 400
const GROUND_Y = 380
const NODE_RADIUS = 5

function scaleX(x: number): number {
  return (x / 100) * (SVG_WIDTH - 40) + 20
}

function scaleY(y: number): number {
  return (y / 100) * (SVG_HEIGHT - 60) + 20
}

export function HackenbushBoard({
  edges,
  nodes,
  groundNodes,
  currentTurn,
  isMyTurn,
  isPlayable,
  onRemoveEdge,
}: HackenbushBoardProps) {
  const canInteract = isMyTurn && isPlayable
  const myColor = currentTurn === 'X' ? 'R' : 'B'

  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  const getEdgeColor = (edge: HackenbushEdge, hovered: boolean): string => {
    if (!edge.alive) return '#6b7280' // gray-500
    if (edge.color === 'R') return hovered ? '#f87171' : '#ef4444' // red-400 / red-500
    return hovered ? '#60a5fa' : '#3b82f6' // blue-400 / blue-500
  }

  const getEdgeOpacity = (edge: HackenbushEdge): number => {
    if (!edge.alive) return 0.2
    return 1
  }

  const isClickable = (edge: HackenbushEdge): boolean => {
    return canInteract && edge.alive && edge.color === myColor
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-caption text-text-secondary text-center">
        {currentTurn === 'X' ? 'Red' : 'Blue'} player&apos;s turn.
        Remove an edge of your color. Disconnected parts fall.
      </p>

      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full max-w-[360px] aspect-[3/4] bg-surface rounded-lg border border-border"
        role="img"
        aria-label="Hackenbush game board"
      >
        {/* Ground line */}
        <line
          x1={10}
          y1={GROUND_Y}
          x2={SVG_WIDTH - 10}
          y2={GROUND_Y}
          stroke="#92400e"
          strokeWidth={4}
          strokeLinecap="round"
          className="dark:stroke-amber-700"
        />
        {/* Ground hash marks */}
        {Array.from({ length: 12 }, (_, i) => {
          const x = 15 + i * ((SVG_WIDTH - 30) / 11)
          return (
            <line
              key={`hash-${i}`}
              x1={x}
              y1={GROUND_Y}
              x2={x - 6}
              y2={GROUND_Y + 10}
              stroke="#92400e"
              strokeWidth={2}
              className="dark:stroke-amber-700"
            />
          )
        })}

        {/* Edges */}
        <AnimatePresence>
          {edges.map(edge => {
            const fromNode = nodeMap.get(edge.from)
            const toNode = nodeMap.get(edge.to)
            if (!fromNode || !toNode) return null

            const x1 = scaleX(fromNode.x)
            const y1 = scaleY(fromNode.y)
            const x2 = scaleX(toNode.x)
            const y2 = scaleY(toNode.y)
            const clickable = isClickable(edge)

            return (
              <motion.line
                key={`edge-${edge.id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={getEdgeColor(edge, false)}
                strokeWidth={clickable ? 5 : 3.5}
                strokeLinecap="round"
                opacity={getEdgeOpacity(edge)}
                initial={{ opacity: 1 }}
                animate={{ opacity: getEdgeOpacity(edge) }}
                exit={{ opacity: 0, strokeWidth: 0 }}
                transition={{ duration: 0.4 }}
                onClick={clickable ? () => onRemoveEdge(edge.id) : undefined}
                className={clickable ? 'cursor-pointer' : ''}
                style={clickable ? { filter: 'url(#glow)' } : undefined}
              >
                {clickable && (
                  <set attributeName="stroke-width" to="7" begin="mouseover" />
                )}
                {clickable && (
                  <set attributeName="stroke-width" to="5" begin="mouseout" />
                )}
              </motion.line>
            )
          })}
        </AnimatePresence>

        {/* Nodes */}
        {nodes.map(node => {
          const isGround = groundNodes.includes(node.id)
          const hasAliveEdge = edges.some(
            e => e.alive && (e.from === node.id || e.to === node.id)
          )
          if (!hasAliveEdge && !isGround) return null

          return (
            <circle
              key={`node-${node.id}`}
              cx={scaleX(node.x)}
              cy={scaleY(node.y)}
              r={isGround ? NODE_RADIUS + 2 : NODE_RADIUS}
              fill={isGround ? '#92400e' : '#e5e7eb'}
              stroke={isGround ? '#78350f' : '#9ca3af'}
              strokeWidth={1.5}
              className={isGround ? 'dark:fill-amber-700 dark:stroke-amber-800' : 'dark:fill-gray-500 dark:stroke-gray-600'}
            />
          )
        })}

        {/* Ground node connectors (lines from ground nodes down to the ground line) */}
        {groundNodes.map(gId => {
          const node = nodeMap.get(gId)
          if (!node) return null
          return (
            <line
              key={`ground-conn-${gId}`}
              x1={scaleX(node.x)}
              y1={scaleY(node.y)}
              x2={scaleX(node.x)}
              y2={GROUND_Y}
              stroke="#92400e"
              strokeWidth={2}
              strokeDasharray="4 3"
              className="dark:stroke-amber-700"
            />
          )
        })}

        {/* Glow filter for hover effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Legend */}
      <div className="flex gap-6 text-caption text-text-secondary">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-1 rounded bg-red-500" />
          <span>Red (Player X)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-1 rounded bg-blue-500" />
          <span>Blue (Player O)</span>
        </div>
      </div>
    </div>
  )
}
