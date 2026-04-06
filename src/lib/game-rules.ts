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
  'ghost': {
    title: 'Ghost',
    description: 'Add letters to a growing word — but don\'t complete it.',
    rules: [
      'Players take turns adding one letter to a growing fragment.',
      'If the fragment becomes a valid word (4+ letters), you lose that round.',
      'You can challenge if you think the fragment isn\'t a prefix of any word.',
      'Wrong challenge = you get a ghost letter. Correct challenge = opponent gets one.',
      'Accumulate G-H-O-S-T (5 letters) and you\'re eliminated.',
    ],
  },
  'hackenbush': {
    title: 'Hackenbush',
    description: 'Remove colored edges from a graph — don\'t get disconnected.',
    rules: [
      'A graph of red and blue edges is connected to a ground line.',
      'Red player removes red edges, blue player removes blue edges.',
      'After removing an edge, anything disconnected from the ground falls away.',
      'The last player able to make a move wins.',
      'Choose your cuts carefully — one removal can cascade!',
    ],
  },
  'entropy': {
    title: 'Entropy',
    description: 'Chaos places pieces, Order arranges them — asymmetric strategy.',
    rules: [
      '35 colored pieces (5 colors × 7) are placed on a 7×7 board.',
      'Chaos places each piece on any empty cell.',
      'After each placement, Order can slide one piece orthogonally.',
      'Score is based on consecutive runs of the same color in rows and columns.',
      'After all pieces are placed, roles swap for round 2.',
      'The Order player with the highest total score wins.',
    ],
  },
  'blokus-duo': {
    title: 'Blokus Duo',
    description: 'Place polyomino shapes — corners only, no edges.',
    rules: [
      'Each player has 21 polyomino pieces (1-5 squares each).',
      'Place pieces so they touch your color only at corners, never edges.',
      'Your first piece must cover your starting corner.',
      'If you can\'t place, you pass. Two consecutive passes end the game.',
      'The player with the most squares placed wins.',
    ],
  },
  'tak': {
    title: 'Tak',
    description: 'Place and stack pieces to build a road across the board.',
    rules: [
      'Place flat stones, walls, or capstones on a 5×5 board.',
      'First move: you must place your opponent\'s flat stone.',
      'Move stacks in a straight line, dropping pieces along the way.',
      'Capstones can flatten walls when landing on them.',
      'Win by building a road — connected flat stones/capstones from one edge to the opposite.',
      'If the board fills, the player with more flat stones on top wins.',
    ],
  },
  'emoji-pictionary': {
    title: 'Emoji Pictionary',
    description: 'Describe words using only emoji — others guess!',
    rules: [
      '3-8 players take turns being the describer.',
      'The describer gets a secret word and must describe it using only emoji.',
      'Other players type their guesses. First correct guess scores the most!',
      'First correct guess = 3 pts, second = 2 pts, third = 1 pt. Describer gets 1 pt if guessed.',
      'After each player has described once, the game ends. Most points wins!',
      'The describer can skip their turn if the word is too hard.',
    ],
  },
}
