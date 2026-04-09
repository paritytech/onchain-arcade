import { useState } from 'react'
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

const SVG_WIDTH = 440
const SVG_HEIGHT = 500
const GROUND_Y = 470
const NODE_RADIUS = 6

function scaleX(x: number): number {
  return (x / 100) * (SVG_WIDTH - 60) + 30
}

function scaleY(y: number): number {
  return (y / 100) * (SVG_HEIGHT - 80) + 20
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
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null)

  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  const getEdgeColor = (edge: HackenbushEdge, hovered: boolean): string => {
    if (!edge.alive) return '#9ca3af' // gray-400
    if (edge.color === 'R') return hovered ? '#dc2626' : '#b91c1c' // red-600 / red-700
    return hovered ? '#2563eb' : '#1d4ed8' // blue-600 / blue-700
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
        className="w-full max-w-[480px] aspect-[44/50] bg-surface rounded-lg border border-border"
        role="img"
        aria-label="Hackenbush game board"
      >
        {/* Ground line */}
        <line
          x1={10}
          y1={GROUND_Y}
          x2={SVG_WIDTH - 10}
          y2={GROUND_Y}
          className="stroke-amber-800 dark:stroke-amber-600"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Ground hash marks */}
        {Array.from({ length: 14 }, (_, i) => {
          const x = 15 + i * ((SVG_WIDTH - 30) / 13)
          return (
            <line
              key={`hash-${i}`}
              x1={x}
              y1={GROUND_Y}
              x2={x - 6}
              y2={GROUND_Y + 10}
              className="stroke-amber-800 dark:stroke-amber-600"
              strokeWidth={2}
            />
          )
        })}

        {/* Invisible wider hit areas for edge clicking */}
        {edges.map(edge => {
          const fromNode = nodeMap.get(edge.from)
          const toNode = nodeMap.get(edge.to)
          if (!fromNode || !toNode) return null
          const clickable = isClickable(edge)
          if (!clickable) return null

          return (
            <line
              key={`hit-${edge.id}`}
              x1={scaleX(fromNode.x)}
              y1={scaleY(fromNode.y)}
              x2={scaleX(toNode.x)}
              y2={scaleY(toNode.y)}
              stroke="transparent"
              strokeWidth={16}
              className="cursor-pointer"
              onClick={() => onRemoveEdge(edge.id)}
              onMouseEnter={() => setHoveredEdge(edge.id)}
              onMouseLeave={() => setHoveredEdge(null)}
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
            const hovered = hoveredEdge === edge.id

            const color = getEdgeColor(edge, hovered && clickable)
            return (
              <motion.line
                key={`edge-${edge.id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={hovered && clickable ? 8 : clickable ? 6 : 4.5}
                strokeLinecap="round"
                initial={{ opacity: 1 }}
                animate={{ opacity: getEdgeOpacity(edge) }}
                exit={{ opacity: 0, strokeWidth: 0 }}
                transition={{ duration: 0.4 }}
                onClick={clickable ? () => onRemoveEdge(edge.id) : undefined}
                onMouseEnter={clickable ? () => setHoveredEdge(edge.id) : undefined}
                onMouseLeave={clickable ? () => setHoveredEdge(null) : undefined}
                className={clickable ? 'cursor-pointer' : ''}
                style={{
                  stroke: color,
                  ...(clickable ? { filter: 'url(#glow)' } : {}),
                }}
              />
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
              className={isGround
                ? 'fill-amber-700 stroke-amber-800 dark:fill-amber-600 dark:stroke-amber-700'
                : 'fill-gray-300 stroke-gray-400 dark:fill-gray-500 dark:stroke-gray-600'}
              strokeWidth={1.5}
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
              className="stroke-amber-800 dark:stroke-amber-600"
              strokeWidth={3}
              strokeDasharray="6 4"
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
