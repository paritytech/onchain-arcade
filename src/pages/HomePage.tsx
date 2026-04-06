import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Copy, Check, Grid3X3, Layers, CircleDot, Box, Gem, Disc, Info, Type, Scissors, Shuffle, Puzzle, Castle, Smile } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { staggerContainer, staggerItem } from '@/lib/animation-variants'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useGame } from '@/contexts/GameContext'
import { useNotifications } from '@/contexts/NotificationProvider'
import { GAME_RULES } from '@/lib/game-rules'
import type { GameType, GridSize } from '@/types/game'
import { WIN_LENGTH } from '@/types/game'

const GRID_OPTIONS: { size: GridSize; label: string }[] = [
  { size: 3, label: '3x3' },
  { size: 5, label: '5x5' },
  { size: 7, label: '7x7' },
]

const NIM_PRESETS: { label: string; heaps: number[] }[] = [
  { label: 'Quick', heaps: [1, 2, 3] },
  { label: 'Classic', heaps: [3, 4, 5] },
  { label: 'Big', heaps: [3, 5, 7] },
]

export function HomePage() {
  const navigate = useNavigate()
  const { isConnected, address } = usePolkadotWallet()
  const { createGame, isLoading } = useGame()
  const { addNotification } = useNotifications()
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [createdGameType, setCreatedGameType] = useState<GameType>('tic-tac-toe')
  const [copied, setCopied] = useState(false)
  const [selectedGrid, setSelectedGrid] = useState<GridSize>(3)
  const [selectedNimPreset, setSelectedNimPreset] = useState(1)
  const [rulesGame, setRulesGame] = useState<GameType | null>(null)
  const [emojiPlayers, setEmojiPlayers] = useState(3)

  const notConnected = !isConnected

  const handleCreate = async (gameType: GameType, vsComputer = false) => {
    let gameId: string | null = null
    switch (gameType) {
      case 'tic-tac-toe':
        gameId = await createGame('tic-tac-toe', { gridSize: selectedGrid, vsComputer })
        break
      case 'connect-four':
        gameId = await createGame('connect-four', { vsComputer })
        break
      case 'nim':
        gameId = await createGame('nim', { nimConfig: NIM_PRESETS[selectedNimPreset].heaps, vsComputer })
        break
      case 'dots-and-boxes':
      case 'mancala':
      case 'reversi':
      case 'ghost':
      case 'hackenbush':
      case 'entropy':
      case 'blokus-duo':
      case 'tak':
        gameId = await createGame(gameType, { vsComputer })
        break
      case 'emoji-pictionary':
        gameId = await createGame('emoji-pictionary', { maxPlayers: emojiPlayers })
        break
    }
    if (gameId) {
      if (vsComputer) {
        navigate(`/play?game=${gameId}`)
        return
      }
      setCreatedCode(gameId)
      setCreatedGameType(gameType)
    }
  }

  const handleCopyCode = async () => {
    if (!createdCode) return
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}#/play?game=${createdCode}&host=${address}&type=${createdGameType}`
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addNotification('info', `Game code: ${createdCode}`)
    }
  }

  const handleGoToGame = () => {
    if (createdCode) navigate(`/play?game=${createdCode}`)
  }

  const InfoBtn = ({ game }: { game: GameType }) => (
    <button
      onClick={(e) => { e.stopPropagation(); setRulesGame(game) }}
      className="p-1 rounded-lg hover:bg-white/10 transition-colors text-grey-500 hover:text-grey-300"
      aria-label="Game rules"
    >
      <Info className="w-4 h-4" />
    </button>
  )

  const GameButtons = ({ game }: { game: GameType }) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleCreate(game)}
        disabled={notConnected || isLoading}
        className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all bg-white/5 text-grey-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 hover:border-white/20"
      >
        {notConnected ? 'Connect Wallet' : 'Multiplayer'}
      </button>
      <button
        onClick={() => handleCreate(game, true)}
        disabled={notConnected || isLoading}
        className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all bg-white/10 text-grey-200 hover:bg-white/15 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-white/15 hover:border-white/25"
      >
        vs Computer
      </button>
    </div>
  )

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 pt-4"
    >
      {/* Title */}
      <motion.div variants={staggerItem} className="text-center">
        <h1 className="font-serif text-h1 text-text-primary mb-1">Game Arena</h1>
        <p className="text-body-sm text-text-secondary">Pick a game, share the code, play in real-time</p>
      </motion.div>

      {/* Created game code */}
      {createdCode && (
        <motion.div
          variants={staggerItem}
          className="p-px rounded-2xl bg-gradient-to-br from-brand/30 via-border to-border"
        >
          <div className="bg-surface rounded-[15px] p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-body-sm text-text-secondary mb-1">Share this link with your opponent</p>
                <p className="text-h3 font-mono text-brand tracking-widest">{createdCode}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyCode}
                  leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? 'Copied' : 'Copy Link'}
                </Button>
                <Button variant="primary" size="sm" onClick={handleGoToGame}>
                  Go to Game
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Game Cards */}
      <motion.div variants={staggerItem} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        {/* --- Tic-Tac-Toe --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-gradient-to-b from-pink-950/40 to-grey-900/80">
          <div className="absolute top-4 right-4 grid grid-cols-3 gap-1 opacity-[0.07] group-hover:opacity-[0.15] transition-opacity" aria-hidden="true">
            {['X','O','','','X','','O','','X'].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center border border-pink-300">{c}</div>
            ))}
          </div>
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center mb-3">
                <Grid3X3 className="w-5 h-5 text-pink-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Tic-Tac-Toe</h3>
                <InfoBtn game="tic-tac-toe" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Classic grid strategy</p>
            </div>
            <div className="flex gap-1.5">
              {GRID_OPTIONS.map(opt => (
                <button key={opt.size} onClick={() => setSelectedGrid(opt.size)} className={`flex-1 py-2 rounded-lg text-caption font-semibold transition-all ${selectedGrid === opt.size ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'bg-white/5 text-grey-400 hover:bg-white/10 hover:text-grey-200'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-caption text-grey-500 text-center h-4">
              {selectedGrid > 3 ? `${WIN_LENGTH[selectedGrid]} in a row to win` : ''}
            </p>
            <GameButtons game="tic-tac-toe" />
          </div>
        </motion.div>

        {/* --- Connect Four --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/40 to-grey-900/80">
          <div className="absolute top-4 right-4 flex gap-1 opacity-[0.12] group-hover:opacity-[0.22] transition-opacity" aria-hidden="true">
            {[0,1,2,3].map(i => (
              <div key={i} className="flex flex-col gap-1">
                {[0,1,2].map(j => (
                  <div key={j} className={`w-4 h-4 rounded-full ${(i+j)%3===0?'bg-red-400':(i+j)%3===1?'bg-yellow-400':'bg-blue-300/30'}`} />
                ))}
              </div>
            ))}
          </div>
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Connect Four</h3>
                <InfoBtn game="connect-four" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Drop discs, get 4 in a row</p>
            </div>
            <p className="text-caption text-grey-500 leading-relaxed">
              7 x 6 grid with gravity. Connect 4 horizontally, vertically, or diagonally to win.
            </p>
            <GameButtons game="connect-four" />
          </div>
        </motion.div>

        {/* --- Nim --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-grey-900/80">
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 opacity-[0.12] group-hover:opacity-[0.22] transition-opacity" aria-hidden="true">
            {[3,4,5].map((n, row) => (
              <div key={row} className="flex gap-1">
                {Array.from({ length: n }, (_, i) => (<div key={i} className="w-3.5 h-3.5 rounded-full bg-amber-400" />))}
              </div>
            ))}
          </div>
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center mb-3">
                <CircleDot className="w-5 h-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Nim</h3>
                <InfoBtn game="nim" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Take tokens, avoid the last</p>
            </div>
            <div className="flex gap-1.5">
              {NIM_PRESETS.map((preset, idx) => (
                <button key={preset.label} onClick={() => setSelectedNimPreset(idx)} className={`flex-1 py-2 rounded-lg text-caption font-semibold transition-all ${selectedNimPreset === idx ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 'bg-white/5 text-grey-400 hover:bg-white/10 hover:text-grey-200'}`}>
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="text-caption text-grey-500 text-center">Heaps: [{NIM_PRESETS[selectedNimPreset].heaps.join(', ')}]</p>
            <GameButtons game="nim" />
          </div>
        </motion.div>

        {/* --- Dots and Boxes --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/40 to-grey-900/80">
          <div className="absolute top-4 right-4 grid grid-cols-3 gap-0.5 opacity-[0.08] group-hover:opacity-[0.18] transition-opacity" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => (<div key={i} className="w-2 h-2 rounded-full bg-emerald-400" />))}
          </div>
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-3">
                <Box className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Dots & Boxes</h3>
                <InfoBtn game="dots-and-boxes" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Draw lines, claim boxes</p>
            </div>
            <p className="text-caption text-grey-500 leading-relaxed">
              Connect dots with lines. Complete a box to claim it and earn an extra turn. Most boxes wins.
            </p>
            <GameButtons game="dots-and-boxes" />
          </div>
        </motion.div>

        {/* --- Mancala --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-950/40 to-grey-900/80">
          <div className="absolute top-4 right-4 flex gap-2 opacity-[0.08] group-hover:opacity-[0.18] transition-opacity" aria-hidden="true">
            {[3,4,3].map((n, row) => (
              <div key={row} className="flex flex-col gap-1">
                {Array.from({ length: n }, (_, i) => (<div key={i} className="w-3 h-3 rounded-full bg-violet-400" />))}
              </div>
            ))}
          </div>
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center mb-3">
                <Gem className="w-5 h-5 text-violet-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Mancala</h3>
                <InfoBtn game="mancala" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Sow stones, capture to win</p>
            </div>
            <p className="text-caption text-grey-500 leading-relaxed">
              Pick up stones, sow them counterclockwise. Land in your store for an extra turn. Most stones wins.
            </p>
            <GameButtons game="mancala" />
          </div>
        </motion.div>

        {/* --- Reversi --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-b from-teal-950/40 to-grey-900/80">
          <div className="absolute top-4 right-4 grid grid-cols-3 gap-1 opacity-[0.08] group-hover:opacity-[0.18] transition-opacity" aria-hidden="true">
            {[1,0,1,0,1,0,1,0,1].map((v, i) => (
              <div key={i} className={`w-4 h-4 rounded-full ${v ? 'bg-grey-300' : 'bg-grey-700'}`} />
            ))}
          </div>
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center mb-3">
                <Disc className="w-5 h-5 text-teal-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Reversi</h3>
                <InfoBtn game="reversi" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Flip discs, control the board</p>
            </div>
            <p className="text-caption text-grey-500 leading-relaxed">
              Place discs to flip opponent pieces. Most discs when no moves remain wins. Classic Othello rules.
            </p>
            <GameButtons game="reversi" />
          </div>
        </motion.div>

        {/* --- Ghost --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-b from-rose-950/40 to-grey-900/80">
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center mb-3">
                <Type className="w-5 h-5 text-rose-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Ghost</h3>
                <InfoBtn game="ghost" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Word game — don't finish the word</p>
            </div>
            <p className="text-caption text-grey-500 leading-relaxed">
              Add letters to a growing word. Complete a 4+ letter word and you lose. Accumulate G-H-O-S-T and you're out.
            </p>
            <GameButtons game="ghost" />
          </div>
        </motion.div>

        {/* --- Hackenbush --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-950/40 to-grey-900/80">
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center mb-3">
                <Scissors className="w-5 h-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Hackenbush</h3>
                <InfoBtn game="hackenbush" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Cut edges, collapse the graph</p>
            </div>
            <p className="text-caption text-grey-500 leading-relaxed">
              Remove colored edges from a graph. Disconnected parts fall. Last player to move wins.
            </p>
            <GameButtons game="hackenbush" />
          </div>
        </motion.div>

        {/* --- Entropy --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-950/40 to-grey-900/80">
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center mb-3">
                <Shuffle className="w-5 h-5 text-sky-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Entropy</h3>
                <InfoBtn game="entropy" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Chaos vs Order — asymmetric strategy</p>
            </div>
            <p className="text-caption text-grey-500 leading-relaxed">
              Chaos places colored pieces randomly. Order slides them into scoring rows. Roles swap after round 1.
            </p>
            <GameButtons game="entropy" />
          </div>
        </motion.div>

        {/* --- Blokus Duo --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-gradient-to-b from-fuchsia-950/40 to-grey-900/80">
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/15 flex items-center justify-center mb-3">
                <Puzzle className="w-5 h-5 text-fuchsia-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Blokus Duo</h3>
                <InfoBtn game="blokus-duo" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Polyomino spatial puzzle</p>
            </div>
            <p className="text-caption text-grey-500 leading-relaxed">
              Place tetromino-style shapes on a 14x14 board. Touch corners only, never edges. Most squares wins.
            </p>
            <GameButtons game="blokus-duo" />
          </div>
        </motion.div>

        {/* --- Tak --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-b from-orange-950/40 to-grey-900/80">
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center mb-3">
                <Castle className="w-5 h-5 text-orange-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Tak</h3>
                <InfoBtn game="tak" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">Stack pieces, build roads</p>
            </div>
            <p className="text-caption text-grey-500 leading-relaxed">
              Place and stack flat stones, walls, and capstones on a 5x5 board. Build a road to connect opposite edges.
            </p>
            <GameButtons game="tak" />
          </div>
        </motion.div>

        {/* --- Emoji Pictionary --- */}
        <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-b from-yellow-950/40 to-grey-900/80">
          <div className="relative p-6 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center mb-3">
                <Smile className="w-5 h-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Emoji Pictionary</h3>
                <InfoBtn game="emoji-pictionary" />
              </div>
              <p className="text-caption text-grey-400 mt-0.5">3-8 players — describe with emoji!</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-caption text-grey-500">Players:</span>
              {[3, 4, 5, 6].map(n => (
                <button
                  key={n}
                  onClick={() => setEmojiPlayers(n)}
                  className={`w-8 h-8 rounded-lg text-caption font-semibold transition-all ${
                    emojiPlayers === n
                      ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25'
                      : 'bg-white/5 text-grey-400 hover:bg-white/10'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleCreate('emoji-pictionary')}
              disabled={notConnected || isLoading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all bg-white/5 text-grey-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 hover:border-white/20"
            >
              {notConnected ? 'Connect Wallet' : 'Create Lobby'}
            </button>
          </div>
        </motion.div>

      </motion.div>

      {/* Rules Modal */}
      <Modal
        isOpen={rulesGame !== null}
        onClose={() => setRulesGame(null)}
        title={rulesGame ? GAME_RULES[rulesGame].title : ''}
      >
        {rulesGame && (
          <div className="space-y-3">
            <p className="text-body-sm text-text-secondary">{GAME_RULES[rulesGame].description}</p>
            <ul className="space-y-2">
              {GAME_RULES[rulesGame].rules.map((rule, i) => (
                <li key={i} className="flex gap-2 text-body-sm text-text-primary">
                  <span className="text-brand font-bold shrink-0">{i + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

    </motion.div>
  )
}
