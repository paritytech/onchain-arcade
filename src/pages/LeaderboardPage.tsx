import { motion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { staggerContainer, staggerItem } from '@/lib/animation-variants'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useGame } from '@/contexts/GameContext'
import { truncateAddress } from '@/lib/utils'

const rankIcons = [Trophy, Medal, Award]

export function LeaderboardPage() {
  const { address } = usePolkadotWallet()
  const { leaderboard, games } = useGame()

  const totalFinished = games.filter(g => g.status === 'finished').length
  const totalPlayers = leaderboard.length

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <h2 className="font-serif text-h2 text-text-primary">Leaderboard</h2>
        <p className="text-body-sm text-text-secondary">Top players ranked by wins</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-h2 font-bold text-brand">{totalPlayers}</p>
            <p className="text-caption text-text-secondary">Players</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-h2 font-bold text-brand">{totalFinished}</p>
            <p className="text-caption text-text-secondary">Games Played</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Leaderboard Table */}
      {leaderboard.length === 0 ? (
        <motion.div variants={staggerItem} className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 rounded-full bg-grey-800/50 flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-grey-400" />
          </div>
          <h3 className="font-serif text-h4 text-text-primary mb-1">No rankings yet</h3>
          <p className="text-text-secondary text-body-sm">Complete some games to see the leaderboard.</p>
        </motion.div>
      ) : (
        <motion.div variants={staggerItem}>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="Leaderboard rankings">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-caption uppercase tracking-wide text-text-secondary font-medium">Rank</th>
                    <th className="text-left px-6 py-3 text-caption uppercase tracking-wide text-text-secondary font-medium">Player</th>
                    <th className="text-center px-6 py-3 text-caption uppercase tracking-wide text-text-secondary font-medium">Wins</th>
                    <th className="text-center px-6 py-3 text-caption uppercase tracking-wide text-text-secondary font-medium">Losses</th>
                    <th className="text-center px-6 py-3 text-caption uppercase tracking-wide text-text-secondary font-medium">Draws</th>
                    <th className="text-center px-6 py-3 text-caption uppercase tracking-wide text-text-secondary font-medium">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const RankIcon = rankIcons[index]
                    const isCurrentUser = entry.address === address
                    const winRate = entry.totalGames > 0
                      ? Math.round((entry.wins / entry.totalGames) * 100)
                      : 0

                    return (
                      <motion.tr
                        key={entry.address}
                        whileHover={{ backgroundColor: 'rgba(120,113,108,0.08)' }}
                        className={`border-b border-border/50 transition-colors ${
                          isCurrentUser ? 'bg-brand-soft/20' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {RankIcon ? (
                              <RankIcon className={`w-5 h-5 ${
                                index === 0 ? 'text-amber-400' :
                                index === 1 ? 'text-grey-300' :
                                'text-amber-600'
                              }`} />
                            ) : (
                              <span className="text-body-sm text-text-secondary w-5 text-center">{index + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-body-sm text-text-primary">
                              {truncateAddress(entry.address)}
                            </span>
                            {isCurrentUser && (
                              <Badge variant="success" size="sm">You</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-emerald-400">{entry.wins}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-red-400">{entry.losses}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-text-secondary">{entry.draws}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={winRate >= 50 ? 'success' : 'default'} size="sm">
                            {winRate}%
                          </Badge>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
