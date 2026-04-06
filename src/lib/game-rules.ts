import type { GameType } from '@/types/game'

export interface GameRules {
  title: string
  description: string
  rules: string[]
}

export const GAME_RULES: Record<GameType, GameRules> = {
  'tic-tac-toe': {
    title: 'Tic-Tac-Toe',
    description: 'Get N marks in a row to win.',
    rules: [
      'Two players take turns placing X or O on a grid.',
      'The first player to get 3 (or more, on larger grids) marks in a row wins.',
      'Rows can be horizontal, vertical, or diagonal.',
      'If all cells are filled with no winner, the game is a draw.',
      'On 5x5 grids, you need 4 in a row. On 7x7 grids, you need 5.',
    ],
  },
  'connect-four': {
    title: 'Connect Four',
    description: 'Drop discs and connect 4 in a row.',
    rules: [
      'Players take turns dropping colored discs into a 7-column, 6-row grid.',
      'Discs fall to the lowest available position in the column (gravity).',
      'The first player to connect 4 discs in a row wins.',
      'Connections can be horizontal, vertical, or diagonal.',
      'If the board fills up with no winner, the game is a draw.',
    ],
  },
  'nim': {
    title: 'Nim',
    description: 'Remove tokens from heaps. Avoid the last one.',
    rules: [
      'The board has several heaps of tokens.',
      'On your turn, remove one or more tokens from a single heap.',
      'You must take at least one token per turn.',
      'The player who takes the LAST token loses (misere rules).',
      'Strategy tip: try to leave your opponent with only single-token heaps.',
    ],
  },
  'dots-and-boxes': {
    title: 'Dots & Boxes',
    description: 'Draw lines between dots and claim boxes.',
    rules: [
      'Players take turns drawing a line between two adjacent dots.',
      'When you complete the 4th side of a box, you claim it and get an extra turn.',
      'Claiming multiple boxes in one move gives you additional extra turns.',
      'The game ends when all lines are drawn.',
      'The player with the most boxes wins.',
    ],
  },
  'mancala': {
    title: 'Mancala',
    description: 'Sow stones around the board and capture.',
    rules: [
      'Each player has 6 pits and a store. Your pits are on the bottom.',
      'Pick up all stones from one of YOUR pits and sow them counterclockwise, one per pit.',
      'Skip your opponent\'s store during sowing.',
      'If your last stone lands in your store, you get an extra turn.',
      'If your last stone lands in an empty pit on your side, capture it and the opposite pit\'s stones into your store.',
      'When one side is empty, the other player collects remaining stones.',
      'The player with the most stones in their store wins.',
    ],
  },
  'reversi': {
    title: 'Reversi',
    description: 'Place discs to flip opponent pieces.',
    rules: [
      'Players take turns placing discs on an 8x8 board.',
      'You must place your disc so it flips at least one opponent disc.',
      'Flipping: all opponent discs in a straight line between your new disc and another of your discs are flipped.',
      'Lines can be horizontal, vertical, or diagonal.',
      'If you have no valid moves, your turn is skipped.',
      'The game ends when neither player can move.',
      'The player with the most discs wins.',
    ],
  },
}
