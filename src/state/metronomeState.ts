import { createContext, useContext } from 'react'

export interface Suggestion {
  stepName: string
  slow: number
  normal: number
}

export interface MetronomeState {
  bpm: number
  setBpm: (bpm: number) => void
  running: boolean
  toggle: () => void
  eighths: boolean
  setEighths: (on: boolean) => void
  /** The click currently sounding, or null when stopped. */
  beat: { index: number; off: boolean } | null
  tap: () => void
  /** Suggested tempos of the step on screen. */
  suggestion: Suggestion | null
  setSuggestion: (suggestion: Suggestion | null) => void
}

export const MetronomeContext = createContext<MetronomeState | null>(null)

export function useMetronome(): MetronomeState {
  const state = useContext(MetronomeContext)
  if (!state) throw new Error('useMetronome must be used inside <MetronomeProvider>')
  return state
}
