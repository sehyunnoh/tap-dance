import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { EMPTY_FILTERS, type Filters } from '../lib/search'
import type { Level } from '../types'
import { ListContext, type ListState } from './listState'

export function ListProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [openLevels, setOpenLevels] = useState<ReadonlySet<Level>>(() => new Set<Level>([1]))
  const [expandedGroups, setExpandedGroups] = useState<ReadonlySet<string>>(() => new Set<string>())

  const setQuery = useCallback((query: string) => setFilters((f) => ({ ...f, query })), [])

  const toggleLevel = useCallback((level: Level) => {
    setOpenLevels((prev) => {
      const next = new Set(prev)
      if (next.has(level)) next.delete(level)
      else next.add(level)
      return next
    })
  }, [])

  const openLevel = useCallback((level: Level) => {
    setOpenLevels((prev) => (prev.has(level) ? prev : new Set(prev).add(level)))
  }, [])

  const expandGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))
  }, [])

  const value = useMemo<ListState>(
    () => ({ filters, setFilters, setQuery, openLevels, toggleLevel, openLevel, expandedGroups, expandGroup }),
    [filters, setQuery, openLevels, toggleLevel, openLevel, expandedGroups, expandGroup],
  )

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>
}
