// Voice-call context: owns the single VoiceSession for the active game.
//
// Scoped to the ACTIVE game and its two players. Leaving the game, the
// opponent changing, or the wallet disconnecting all tear the call down — a
// call that outlived its match would keep a microphone open with no UI
// attached to it, which is the one failure mode worth being strict about.
//
// Sits inside GameProvider (it reads the active game) and inside
// NotificationProvider (it reports call failures).
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react'

import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useNotifications } from '@/contexts/NotificationProvider'
import { useGame } from '@/contexts/GameContext'
import { statementStore } from '@/lib/statementStore'
import { VoiceSession, type VoiceState } from '@/lib/voice/VoiceSession'
import { meterStream } from '@/lib/webrtc/microphone'
import type { VoiceStatement } from '@/types/voice'

interface VoiceContextType {
  /** Voice is only possible in a two-player game where both seats are filled. */
  available: boolean
  state: VoiceState
  /** Human-readable reason for `failed`/`declined`, if any. */
  detail: string | null
  muted: boolean
  /** 0..1 peak level of OUR microphone — drives the speaking indicator. */
  localLevel: number
  /** 0..1 peak level of the REMOTE stream. */
  remoteLevel: number
  /** The opponent's address, when there is one. */
  peerAddress: string | null
  invite: () => void
  accept: () => void
  decline: () => void
  hangUp: () => void
  toggleMute: () => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function useVoice() {
  const ctx = useContext(VoiceContext)
  if (!ctx) throw new Error('useVoice must be used within a VoiceProvider')
  return ctx
}

/** The opponent in a two-seat game, or null when there is not exactly one. */
function opponentOf(
  game: { playerX: string; playerO: string | null } | null,
  self: string | null,
): string | null {
  if (!game || !self) return null
  // 'computer' is a local AI seat, not a peer with a microphone.
  if (game.playerO === 'computer') return null
  if (game.playerX === self) return game.playerO
  if (game.playerO === self) return game.playerX
  return null
}

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const { address } = usePolkadotWallet()
  const { activeGame } = useGame()
  const { addNotification } = useNotifications()

  const [state, setState] = useState<VoiceState>('idle')
  const [detail, setDetail] = useState<string | null>(null)
  const [muted, setMuted] = useState(false)
  const [localLevel, setLocalLevel] = useState(0)
  const [remoteLevel, setRemoteLevel] = useState(0)

  const sessionRef = useRef<VoiceSession | null>(null)
  const audioElRef = useRef<HTMLAudioElement | null>(null)
  const meterStopRef = useRef<{ local?: () => void; remote?: () => void }>({})

  const gameId = activeGame?.id ?? null
  const peerAddress = opponentOf(activeGame ?? null, address)
  const available = !!(gameId && peerAddress && address)

  // One <audio> element for the whole provider. Created imperatively rather
  // than rendered: it must survive re-renders and never be unmounted mid-call,
  // and `playsInline` plus `autoplay` on a detached element is what keeps iOS
  // Safari from refusing to start the stream.
  useEffect(() => {
    const el = document.createElement('audio')
    el.autoplay = true
    el.setAttribute('playsinline', '')
    audioElRef.current = el
    return () => {
      el.srcObject = null
      audioElRef.current = null
    }
  }, [])

  const stopMeters = useCallback(() => {
    meterStopRef.current.local?.()
    meterStopRef.current.remote?.()
    meterStopRef.current = {}
    setLocalLevel(0)
    setRemoteLevel(0)
  }, [])

  // Build (and rebuild) the session whenever the pairing changes.
  useEffect(() => {
    if (!available || !gameId || !peerAddress || !address) {
      sessionRef.current?.destroy()
      sessionRef.current = null
      stopMeters()
      setState('idle')
      setDetail(null)
      return
    }

    const session = new VoiceSession({
      gameId,
      selfAddr: address,
      peerAddr: peerAddress,
      publish: (stmt) => statementStore.submitVoice(stmt),
      onState: (next, why) => {
        setState(next)
        setDetail(why ?? null)
        if (next === 'failed' && why) addNotification('error', why)
        if (next === 'declined') addNotification('info', 'Your opponent declined the call.')
      },
      onLocalStream: (stream) => {
        meterStopRef.current.local?.()
        meterStopRef.current.local = stream
          ? meterStream(stream, setLocalLevel)
          : undefined
        if (!stream) setLocalLevel(0)
        setMuted(false)
      },
      onRemoteStream: (stream) => {
        if (audioElRef.current) audioElRef.current.srcObject = stream
        meterStopRef.current.remote?.()
        meterStopRef.current.remote = stream
          ? meterStream(stream, setRemoteLevel)
          : undefined
        if (!stream) setRemoteLevel(0)
      },
    })
    sessionRef.current = session

    return () => {
      // Announce the hang-up so the opponent's UI does not sit on a dead call.
      void session.end(true)
      session.destroy()
      sessionRef.current = null
      stopMeters()
    }
  }, [available, gameId, peerAddress, address, addNotification, stopMeters])

  // Route inbound voice statements to the session.
  useEffect(() => {
    statementStore.onVoiceSignal = (stmt: VoiceStatement) => {
      // Drop anything not for this player, or not for the game on screen.
      // `to` and `gameId` are payload claims, not proofs — see the authorship
      // note in statementStoreHost.ts. They are a routing filter here, not a
      // security boundary, and the sealing is what protects the SDP.
      if (!address || stmt.to !== address) return
      if (!gameId || stmt.gameId !== gameId) return
      void sessionRef.current?.handleSignal(stmt)
    }
    return () => {
      statementStore.onVoiceSignal = undefined
    }
  }, [address, gameId])

  const invite = useCallback(() => { void sessionRef.current?.invite() }, [])
  const accept = useCallback(() => { void sessionRef.current?.accept() }, [])
  const decline = useCallback(() => { void sessionRef.current?.decline() }, [])
  const hangUp = useCallback(() => { void sessionRef.current?.end(true) }, [])
  const toggleMute = useCallback(() => {
    const session = sessionRef.current
    if (!session) return
    const next = !session.muted
    session.setMuted(next)
    setMuted(next)
  }, [])

  const value = useMemo<VoiceContextType>(() => ({
    available, state, detail, muted, localLevel, remoteLevel, peerAddress,
    invite, accept, decline, hangUp, toggleMute,
  }), [available, state, detail, muted, localLevel, remoteLevel, peerAddress,
       invite, accept, decline, hangUp, toggleMute])

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
}
