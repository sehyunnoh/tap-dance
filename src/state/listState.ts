import { createContext, useContext } from 'react'
import type { Filters } from '../lib/search'
import type { Level } from '../types'

/** List state that must survive moving between the list and a step (mobile) or across selections (desktop). */
export interface ListState {
  filters: Filters
  setFilters: (filters: Filters) => void
  setQuery: (query: string) => void
  openLevels: ReadonlySet<Level>
  toggleLevel: (level: Level) => void
  openLevel: (level: Level) => void
  expandedGroups: ReadonlySet<string>
  expandGroup: (key: string) => void
}

export const ListContext = createContext<ListState | null>(null)

export function useListState(): ListState {
  const state = useContext(ListContext)
  if (!state) throw new Error('useListState must be used inside <ListProvider>')
  return state
}
