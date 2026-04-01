import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Users, Trophy, Zap, ArrowRight, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { staggerContainer, staggerItem } from '@/lib/animation-variants'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useGame } from '@/contexts/GameContext'
import { useNotifications } from '@/contexts/NotificationProvider'

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    const duration = 1200
    const steps = 30
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count}</span>
}

export function HomePage() {
  const navigate = useNavigate()
  const { isConnected, address } = usePolkadotWallet()
  const { games, createGame, joinGame, isLoading } = useGame()
  const { addNotification } = useNotifications()
  const [joinCode, setJoinCode] = useState('')
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const totalGames = games.length
  const activeGames = games.filter(g => g.status === 'playing' || g.status === 'waiting').length
  const finishedGames = games.filter(g => g.status === 'finished').length

  const handleCreate = async () => {
    const gameId = await createGame()
    if (gameId) {
      setCreatedCode(gameId)
    }
  }

  const handleJoin = async () => {
    if (!joinCode.trim()) return
    const code = joinCode.trim().toUpperCase()
    // Try local join first
    const success = await joinGame(code)
    if (success) {
      navigate(`/play?game=${code}`)
    } else {
      // Game not found locally — navigate to game page where the relay can fetch it
      navigate(`/play?game=${code}`)
    }
  }

  const handleCopyCode = async () => {
    if (!createdCode) return
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}#/play?game=${createdCode}&host=${address}`
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addNotification('info', `Game code: ${createdCode}`)
    }
  }

  const handleGoToGame = () => {
    if (createdCode) {
      navigate(`/play?game=${createdCode}`)
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Hero Section */}
      <motion.section
        variants={staggerItem}
        className="relative overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_top_right,var(--color-brand-soft),transparent_70%)] p-8 md:p-12"
      >
        <div className="relative z-10 max-w-2xl">
          <Badge variant="success" size="md" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            On-Chain Gaming
          </Badge>
          <h2 className="font-serif text-h1 text-text-primary mb-4">
            Play <span className="text-brand">Tic-Tac-Toe</span> with Friends
          </h2>
          <p className="text-body-lg text-text-secondary mb-8 max-w-lg">
            Create a game, share the code with a friend, and battle it out in real-time.
            Powered by Polkadot.
          </p>
          <div className="flex flex-wrap gap-3">
            {isConnected ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleCreate}
                isLoading={isLoading}
                leftIcon={<Gamepad2 className="w-5 h-5" />}
              >
                Create Game
              </Button>
            ) : (
              <Button variant="primary" size="lg" disabled>
                Connect Wallet to Play
              </Button>
            )}
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/games')}
              leftIcon={<ArrowRight className="w-5 h-5" />}
            >
              Browse Games
            </Button>
          </div>
        </div>
        {/* Decorative grid */}
        <div className="absolute top-8 right-8 opacity-10 hidden lg:grid grid-cols-3 gap-3" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-lg border-2 border-text-primary flex items-center justify-center text-2xl font-bold"
            >
              {i % 3 === 0 ? 'X' : i % 3 === 1 ? 'O' : ''}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Created game code display */}
      {createdCode && (
        <motion.section
          variants={staggerItem}
          className="p-px rounded-2xl bg-gradient-to-br from-brand/30 via-border to-border"
        >
          <div className="bg-surface rounded-[15px] p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-body-sm text-text-secondary mb-1">Share this link with your opponent</p>
                <p className="text-h2 font-mono text-brand tracking-widest">{createdCode}</p>
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGoToGame}
                >
                  Go to Game
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Stats Row */}
      <motion.section variants={staggerItem}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Games', value: totalGames, icon: Gamepad2 },
            { label: 'Active Games', value: activeGames, icon: Users },
            { label: 'Completed', value: finishedGames, icon: Trophy },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 rounded-xl bg-brand-soft">
                    <Icon className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <p className="text-h2 font-bold text-brand">
                      <AnimatedCounter target={stat.value} />
                    </p>
                    <p className="text-caption text-text-secondary">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </motion.section>

      {/* Join Game Section */}
      <motion.section variants={staggerItem}>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-serif text-h3 text-text-primary mb-2">Join a Game</h3>
            <p className="text-body-sm text-text-secondary mb-4">
              Enter the game code shared by your opponent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="e.g. ABc3xK7m"
                value={joinCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJoinCode(e.target.value)}
                inputSize="md"
                className="font-mono tracking-widest"
                aria-label="Game code"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleJoin}
                isLoading={isLoading}
                disabled={!isConnected || joinCode.trim().length < 4}
              >
                Join Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Recent Games */}
      {games.length > 0 && (
        <motion.section variants={staggerItem}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-h3 text-text-primary">Recent Games</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/games')}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {games.slice(0, 5).map(game => (
              <Card key={game.id} variant="interactive">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-body-sm text-brand">{game.id}</span>
                    <Badge
                      variant={
                        game.status === 'waiting' ? 'warning' :
                        game.status === 'playing' ? 'success' :
                        'default'
                      }
                    >
                      {game.status === 'waiting' ? 'Waiting' :
                       game.status === 'playing' ? 'In Progress' :
                       'Finished'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/play?game=${game.id}`)}
                  >
                    {game.status === 'finished' ? 'View' : 'Play'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  )
}
