import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Gamepad2, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { staggerContainer, staggerItem } from '@/lib/animation-variants'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useGame } from '@/contexts/GameContext'
import { truncateAddress } from '@/lib/utils'

type FilterTab = 'all' | 'waiting' | 'playing' | 'finished'

export function GamesListPage() {
  const navigate = useNavigate()
  const { address } = usePolkadotWallet()
  const { games, joinGame, isLoading } = useGame()
  const [filter, setFilter] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')

  const filteredGames = games.filter(g => {
    if (filter !== 'all' && g.status !== filter) return false
    if (search && !g.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleJoin = async (gameId: string) => {
    const success = await joinGame(gameId)
    if (success) {
      navigate(`/play?game=${gameId}`)
    }
  }

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: games.length },
    { key: 'waiting', label: 'Waiting', count: games.filter(g => g.status === 'waiting').length },
    { key: 'playing', label: 'In Progress', count: games.filter(g => g.status === 'playing').length },
    { key: 'finished', label: 'Finished', count: games.filter(g => g.status === 'finished').length },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-h2 text-text-primary">Games</h2>
          <p className="text-body-sm text-text-secondary">Browse, join, or review games</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/')}
          leftIcon={<Gamepad2 className="w-4 h-4" />}
        >
          Create Game
        </Button>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by game code..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            inputSize="md"
            aria-label="Search games"
          />
        </div>
        <div className="flex gap-1 bg-grey-900/50 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-brand-soft text-brand'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-label={`Filter: ${tab.label}`}
            >
              {tab.label}
              <span className="ml-1 text-caption opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Games List */}
      {filteredGames.length === 0 ? (
        <motion.div variants={staggerItem} className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 rounded-full bg-grey-800/50 flex items-center justify-center mb-4">
            <Gamepad2 className="w-6 h-6 text-grey-400" />
          </div>
          <h3 className="font-serif text-h4 text-text-primary mb-1">No games found</h3>
          <p className="text-text-secondary text-body-sm">
            {filter !== 'all' ? 'Try a different filter' : 'Create a new game to get started'}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={staggerItem} className="space-y-2">
          {filteredGames.map(game => {
            const isMyGame = game.playerX === address || game.playerO === address
            const canJoin = game.status === 'waiting' && !isMyGame && !!address

            return (
              <motion.div
                key={game.id}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <Card variant="interactive">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="shrink-0">
                        {game.status === 'waiting' ? (
                          <Clock className="w-5 h-5 text-amber-400" />
                        ) : game.status === 'playing' ? (
                          <Gamepad2 className="w-5 h-5 text-emerald-400" />
                        ) : game.result === 'draw' ? (
                          <XCircle className="w-5 h-5 text-grey-400" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-brand" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-body-sm font-bold text-text-primary">{game.id}</span>
                          <Badge
                            variant={
                              game.status === 'waiting' ? 'warning' :
                              game.status === 'playing' ? 'success' :
                              'default'
                            }
                            size="sm"
                          >
                            {game.status === 'waiting' ? 'Waiting' :
                             game.status === 'playing' ? 'Playing' :
                             game.result === 'draw' ? 'Draw' :
                             game.result === 'x_wins' ? 'X Wins' : 'O Wins'}
                          </Badge>
                          {isMyGame && (
                            <Badge variant="default" size="sm">Your Game</Badge>
                          )}
                        </div>
                        <p className="text-caption text-text-secondary truncate">
                          {truncateAddress(game.playerX)}
                          {game.playerO ? ` vs ${truncateAddress(game.playerO)}` : ' — waiting for opponent'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {canJoin && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleJoin(game.id)}
                          isLoading={isLoading}
                        >
                          Join
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/play?game=${game.id}`)}
                      >
                        {game.status === 'finished' ? 'View' : isMyGame ? 'Play' : 'Spectate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
