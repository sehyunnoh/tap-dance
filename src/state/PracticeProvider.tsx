import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { track } from '../lib/analytics'
import { PRACTICE_STORAGE_KEY, sanitizeStatuses, withStatus, type PracticeStatus, type PracticeStatuses } from '../lib/practice'
import { readStorage, writeStorage } from '../lib/storage'
import { PracticeContext, type PracticeState } from './practiceState'

const load = (): PracticeStatuses => sanitizeStatuses(readStorage<unknown>(PRACTICE_STORAGE_KEY, {}))

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<PracticeStatuses>(load)

  useEffect(() => {
    writeStorage(PRACTICE_STORAGE_KEY, statuses)
  }, [statuses])

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PRACTICE_STORAGE_KEY) setStatuses(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setStatus = useCallback((stepId: string, status: PracticeStatus | null) => {
    setStatuses((prev) => withStatus(prev, stepId, status))
    track('practice-status', { step: stepId, status: status ?? 'not-started' })
  }, [])

  const value = useMemo<PracticeState>(() => ({ statuses, setStatus }), [statuses, setStatus])

  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>
}
