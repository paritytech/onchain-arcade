import type { GameStatement, PlayerSymbol } from '@/types/game'
import type { DerivedHackenbush, HackenbushEdge, HackenbushNode } from '@/types/derived-game'
import { initGameState } from '../shared'

// --- Predefined graph configs ---

interface GraphConfig {
  nodes: HackenbushNode[]
  edges: HackenbushEdge[]
  groundNodes: number[]
}

const TREE_GRAPH: GraphConfig = {
  nodes: [
    // Ground level
    { id: 0, x: 50, y: 95 },
    // Trunk
    { id: 1, x: 50, y: 75 },
    { id: 2, x: 50, y: 55 },
    // Left branch
    { id: 3, x: 30, y: 40 },
    { id: 4, x: 15, y: 25 },
    { id: 5, x: 40, y: 20 },
    // Right branch
    { id: 6, x: 70, y: 40 },
    { id: 7, x: 60, y: 20 },
    { id: 8, x: 85, y: 25 },
  ],
  edges: [
    { id: 0, from: 0, to: 1, color: 'R', alive: true },
    { id: 1, from: 1, to: 2, color: 'B', alive: true },
    { id: 2, from: 2, to: 3, color: 'R', alive: true },
    { id: 3, from: 3, to: 4, color: 'B', alive: true },
    { id: 4, from: 3, to: 5, color: 'R', alive: true },
    { id: 5, from: 2, to: 6, color: 'B', alive: true },
    { id: 6, from: 6, to: 7, color: 'R', alive: true },
    { id: 7, from: 6, to: 8, color: 'B', alive: true },
    { id: 8, from: 4, to: 5, color: 'B', alive: true },
    { id: 9, from: 7, to: 8, color: 'R', alive: true },
    { id: 10, from: 1, to: 3, color: 'R', alive: true },
    { id: 11, from: 1, to: 6, color: 'B', alive: true },
  ],
  groundNodes: [0],
}

const STICK_FIGURE_GRAPH: GraphConfig = {
  nodes: [
    // Feet (ground)
    { id: 0, x: 35, y: 95 },
    { id: 1, x: 65, y: 95 },
    // Knees
    { id: 2, x: 40, y: 75 },
    { id: 3, x: 60, y: 75 },
    // Hips
    { id: 4, x: 50, y: 60 },
    // Torso
    { id: 5, x: 50, y: 40 },
    // Hands
    { id: 6, x: 25, y: 45 },
    { id: 7, x: 75, y: 45 },
    // Neck
    { id: 8, x: 50, y: 28 },
    // Head top
    { id: 9, x: 50, y: 15 },
  ],
  edges: [
    // Left leg
    { id: 0, from: 0, to: 2, color: 'R', alive: true },
    { id: 1, from: 2, to: 4, color: 'B', alive: true },
    // Right leg
    { id: 2, from: 1, to: 3, color: 'B', alive: true },
    { id: 3, from: 3, to: 4, color: 'R', alive: true },
    // Torso
    { id: 4, from: 4, to: 5, color: 'R', alive: true },
    { id: 5, from: 5, to: 8, color: 'B', alive: true },
    // Left arm
    { id: 6, from: 5, to: 6, color: 'B', alive: true },
    // Right arm
    { id: 7, from: 5, to: 7, color: 'R', alive: true },
    // Head
    { id: 8, from: 8, to: 9, color: 'R', alive: true },
    { id: 9, from: 9, to: 8, color: 'B', alive: true },
    // Cross braces
    { id: 10, from: 2, to: 3, color: 'R', alive: true },
    { id: 11, from: 6, to: 8, color: 'B', alive: true },
    { id: 12, from: 7, to: 8, color: 'R', alive: true },
    { id: 13, from: 0, to: 3, color: 'B', alive: true },
    { id: 14, from: 1, to: 2, color: 'R', alive: true },
  ],
  groundNodes: [0, 1],
}

const TOWER_GRAPH: GraphConfig = {
  nodes: [
    // Base (ground)
    { id: 0, x: 30, y: 95 },
    { id: 1, x: 70, y: 95 },
    // Level 1
    { id: 2, x: 30, y: 70 },
    { id: 3, x: 70, y: 70 },
    // Level 2
    { id: 4, x: 30, y: 45 },
    { id: 5, x: 70, y: 45 },
    // Level 3
    { id: 6, x: 30, y: 20 },
    { id: 7, x: 70, y: 20 },
  ],
  edges: [
    // Verticals left
    { id: 0, from: 0, to: 2, color: 'R', alive: true },
    { id: 1, from: 2, to: 4, color: 'B', alive: true },
    { id: 2, from: 4, to: 6, color: 'R', alive: true },
    // Verticals right
    { id: 3, from: 1, to: 3, color: 'B', alive: true },
    { id: 4, from: 3, to: 5, color: 'R', alive: true },
    { id: 5, from: 5, to: 7, color: 'B', alive: true },
    // Horizontals
    { id: 6, from: 2, to: 3, color: 'R', alive: true },
    { id: 7, from: 4, to: 5, color: 'B', alive: true },
    { id: 8, from: 6, to: 7, color: 'R', alive: true },
    // Diagonals
    { id: 9, from: 2, to: 5, color: 'B', alive: true },
  ],
  groundNodes: [0, 1],
}

const GRAPHS: Record<string, GraphConfig> = {
  tree: TREE_GRAPH,
  'stick-figure': STICK_FIGURE_GRAPH,
  tower: TOWER_GRAPH,
}

/**
 * BFS from ground nodes to find all reachable node IDs through alive edges.
 */
function findConnectedToGround(
  groundNodes: number[],
  edges: HackenbushEdge[],
): Set<number> {
  const aliveEdges = edges.filter(e => e.alive)
  const adj = new Map<number, number[]>()
  for (const e of aliveEdges) {
    if (!adj.has(e.from)) adj.set(e.from, [])
    if (!adj.has(e.to)) adj.set(e.to, [])
    adj.get(e.from)!.push(e.to)
    adj.get(e.to)!.push(e.from)
  }

  const visited = new Set<number>()
  const queue = [...groundNodes]
  for (const g of queue) visited.add(g)

  while (queue.length > 0) {
    const node = queue.shift()!
    for (const neighbor of adj.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  return visited
}

/**
 * After removing an edge, mark all edges disconnected from ground as dead.
 */
function cascadeRemoval(edges: HackenbushEdge[], groundNodes: number[]): void {
  const connected = findConnectedToGround(groundNodes, edges)
  for (const e of edges) {
    if (e.alive && (!connected.has(e.from) || !connected.has(e.to))) {
      e.alive = false
    }
  }
}

export function deriveHackenbush(gameId: string, stmts: GameStatement[]): DerivedHackenbush | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const configName = create.hackenbushConfig ?? 'tree'
  const graphConfig = GRAPHS[configName] ?? GRAPHS['tree']

  const edges: HackenbushEdge[] = graphConfig.edges.map(e => ({ ...e }))
  const nodes: HackenbushNode[] = graphConfig.nodes.map(n => ({ ...n }))
  const groundNodes = [...graphConfig.groundNodes]

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue
    if (stmt.hackenbushEdge == null) continue

    const edgeId = stmt.hackenbushEdge
    const edge = edges.find(e => e.id === edgeId)
    if (!edge || !edge.alive) continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    const expectedTurn: PlayerSymbol = moveCount % 2 === 0 ? 'X' : 'O'
    if (symbol !== expectedTurn) continue

    // X plays R edges, O plays B edges
    const playerColor = symbol === 'X' ? 'R' : 'B'
    if (edge.color !== playerColor) continue

    // Remove the edge
    edge.alive = false
    moveCount++
    updatedAt = stmt.timestamp

    // Cascade: remove anything disconnected from ground
    cascadeRemoval(edges, groundNodes)

    // Check if next player has any moves
    const nextTurn: PlayerSymbol = moveCount % 2 === 0 ? 'X' : 'O'
    const nextColor = nextTurn === 'X' ? 'R' : 'B'
    const nextHasMoves = edges.some(e => e.alive && e.color === nextColor)

    if (!nextHasMoves) {
      // Current player wins (the player who just moved)
      result = isX ? 'x_wins' : 'o_wins'
      status = 'finished'
    }
  }

  return {
    id: gameId,
    gameType: 'hackenbush',
    edges,
    nodes,
    groundNodes,
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO: init.playerO,
    playerOName: init.playerOName,
    currentTurn: moveCount % 2 === 0 ? 'X' : 'O',
    status,
    result,
    moveCount,
    vsComputer: create.vsComputer ?? false,
    createdAt: create.timestamp,
    updatedAt,
  }
}

// Export for testing / AI
export { findConnectedToGround, cascadeRemoval, GRAPHS }
export type { GraphConfig }
