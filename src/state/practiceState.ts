import { createContext, useContext } from 'react'
import type { PracticeStatus, PracticeStatuses } from '../lib/practice'

/** The user's own practice record, kept in this browser only. */
export interface PracticeState {
  statuses: PracticeStatuses
  /** `null` puts the step back to not started. */
  setStatus: (stepId: string, status: PracticeStatus | null) => void
}

export const PracticeContext = createContext<PracticeState | null>(null)

export function usePractice(): PracticeState {
  const state = useContext(PracticeContext)
  if (!state) throw new Error('usePractice must be used inside <PracticeProvider>')
  return state
}
