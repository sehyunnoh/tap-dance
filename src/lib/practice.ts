import type { Step } from '../types'

export type PracticeStatus = 'learning' | 'learned'

/** Practice status per step id. Steps without an entry haven't been started. */
export type PracticeStatuses = Readonly<Record<string, PracticeStatus>>

export const PRACTICE_STORAGE_KEY = 'practice-status'

/** Keeps only well-formed entries from stored data, which may be old or hand-edited. */
export function sanitizeStatuses(raw: unknown): PracticeStatuses {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, PracticeStatus> = {}
  for (const [id, status] of Object.entries(raw)) {
    if (status === 'learning' || status === 'learned') out[id] = status
  }
  return out
}

/** Returns a copy with one step changed; `null` puts it back to not started. */
export function withStatus(statuses: PracticeStatuses, stepId: string, status: PracticeStatus | null): PracticeStatuses {
  const next = { ...statuses }
  if (status) next[stepId] = status
  else delete next[stepId]
  return next
}

export interface Progress {
  learned: number
  learning: number
  total: number
}

export function progressOf(steps: readonly Step[], statuses: PracticeStatuses): Progress {
  let learned = 0
  let learning = 0
  for (const step of steps) {
    if (statuses[step.id] === 'learned') learned++
    else if (statuses[step.id] === 'learning') learning++
  }
  return { learned, learning, total: steps.length }
}

/** The step to continue with: the first essential step not yet learned, in syllabus order, then optional ones. */
export function nextToPractice(steps: readonly Step[], statuses: PracticeStatuses): Step | undefined {
  return steps.find((s) => s.essential && statuses[s.id] !== 'learned') ?? steps.find((s) => statuses[s.id] !== 'learned')
}
