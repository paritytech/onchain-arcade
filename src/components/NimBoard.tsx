import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Check } from 'lucide-react'

interface NimBoardProps {
  heaps: number[]
  isMyTurn: boolean
  isPlayable: boolean
  onMove: (heap: number, count: number) => void
}

export function NimBoard({ heaps, isMyTurn, isPlayable, onMove }: NimBoardProps) {
  const [selectedHeap, setSelectedHeap] = useState<number | null>(null)
  const [selectedCount, setSelectedCount] = useState(0)

  const canInteract = isMyTurn && isPlayable

  const handleTokenClick = (heapIdx: number, tokenIdx: number) => {
    if (!canInteract) return
    if (heaps[heapIdx] === 0) return

    if (selectedHeap !== heapIdx) {
      setSelectedHeap(heapIdx)
      setSelectedCount(tokenIdx + 1)
    } else {
      // Toggle: clicking the same token deselects, clicking different adjusts count
      if (selectedCount === tokenIdx + 1) {
        setSelectedHeap(null)
        setSelectedCount(0)
      } else {
        setSelectedCount(tokenIdx + 1)
      }
    }
  }

  const handleConfirm = () => {
    if (selectedHeap == null || selectedCount === 0) return
    onMove(selectedHeap, selectedCount)
    setSelectedHeap(null)
    setSelectedCount(0)
  }

  const allEmpty = heaps.every(h => h === 0)

  return (
    <div className="space-y-6">
      <p className="text-caption text-text-secondary text-center">
        Take tokens from any heap. Take the last token and you lose.
      </p>

      <div className="space-y-4">
        {heaps.map((heapSize, heapIdx) => (
          <div key={heapIdx} className="flex items-center gap-4">
            <span className="text-body-sm text-text-secondary w-16 text-right shrink-0">
              Heap {heapIdx + 1}
            </span>
            <div className="flex gap-2 flex-wrap">
              <AnimatePresence>
                {Array.from({ length: heapSize }, (_, tokenIdx) => {
                  const isSelected = selectedHeap === heapIdx && tokenIdx < selectedCount
                  return (
                    <motion.button
                      key={tokenIdx}
                      onClick={() => handleTokenClick(heapIdx, tokenIdx)}
                      disabled={!canInteract}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={canInteract ? { scale: 1.15 } : undefined}
                      whileTap={canInteract ? { scale: 0.9 } : undefined}
                      className={cn(
                        'w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-colors',
                        isSelected
                          ? 'bg-red-500/30 border-red-400 shadow-md shadow-red-500/20'
                          : 'bg-brand/10 border-brand/40',
                        canInteract && !isSelected && 'hover:border-brand hover:bg-brand/20',
                        !canInteract && 'opacity-60 cursor-default'
                      )}
                      aria-label={`Heap ${heapIdx + 1}, token ${tokenIdx + 1}${isSelected ? ' (selected for removal)' : ''}`}
                    >
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-red-400 text-lg"
                        >
                          x
                        </motion.span>
                      )}
                    </motion.button>
                  )
                })}
              </AnimatePresence>
              {heapSize === 0 && (
                <span className="text-text-secondary text-body-sm italic self-center">empty</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm button */}
      {canInteract && !allEmpty && (
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="md"
            onClick={handleConfirm}
            disabled={selectedHeap == null || selectedCount === 0}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Remove {selectedCount} from Heap {selectedHeap != null ? selectedHeap + 1 : '?'}
          </Button>
        </div>
      )}
    </div>
  )
}
