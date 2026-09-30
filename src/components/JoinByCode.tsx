// Join a game by typing its code.
//
// This did not exist: the only way in was clicking a share link. Jackbox,
// Among Us and Kahoot all centre the typed code, and a link is useless the
// moment it is read out over the voice channel we just added.
//
// The input is forgiving by design — uppercase, separators stripped, and the
// confusable characters absorbed by normalizeGameId rather than by the player.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft } from 'lucide-react'

import { cn } from '@/lib/cn'
import { GAME_ID_LENGTH, isValidGameId, normalizeGameId } from '@/types/game'
import { statementStore } from '@/lib/statementStore'

export function JoinByCode() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const complete = code.length === GAME_ID_LENGTH
  const known = complete && statementStore.hasGame(code)

  const submit = () => {
    if (!isValidGameId(code)) {
      setError(`Game codes are ${GAME_ID_LENGTH} characters.`)
      return
    }
    setError(null)
    navigate(`/play?game=${code}`)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <label htmlFor="join-code" className="block text-body-sm font-semibold text-text-primary mb-2">
        Have a code?
      </label>
      <div className="flex gap-2">
        <input
          id="join-code"
          value={code}
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          placeholder="ABC234"
          aria-describedby={error ? 'join-code-error' : 'join-code-hint'}
          aria-invalid={!!error}
          onChange={(e) => { setCode(normalizeGameId(e.target.value)); setError(null) }}
          onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
          className={cn(
            'flex-1 min-h-[48px] px-4 rounded-xl bg-bg border font-mono text-body-lg tracking-[0.25em] uppercase',
            'text-text-primary placeholder:text-text-tertiary placeholder:tracking-[0.25em]',
            'focus:outline-none focus:ring-2 focus:ring-brand',
            error ? 'border-error' : 'border-border',
          )}
        />
        <button
          onClick={submit}
          disabled={!complete}
          className="px-4 min-h-[48px] rounded-xl bg-accent text-white text-body-sm font-medium disabled:opacity-40 flex items-center gap-2"
        >
          Join
          <CornerDownLeft className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Confirm before commit: say what the code resolves to before the player
          leaves this screen, so a mistyped or stale code is caught here rather
          than on an empty game page. */}
      <p
        id={error ? 'join-code-error' : 'join-code-hint'}
        className={cn('text-caption mt-2 h-4', error ? 'text-error' : 'text-text-tertiary')}
      >
        {error
          ? error
          : known
            ? 'Found it — press Join.'
            : complete
              ? 'No local copy yet. Joining will look for it.'
              : 'Six characters. Case and dashes do not matter.'}
      </p>
    </div>
  )
}
