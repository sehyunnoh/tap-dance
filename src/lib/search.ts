import type { Category, Level, Step } from '../types'
import type { PracticeStatuses } from './practice'

export type EssentialMode = 'all' | 'essential' | 'optional'

export type ProgressMode = 'all' | 'not-started' | 'learning' | 'learned'

export interface Filters {
  query: string
  levels: Level[]
  categories: Category[]
  essential: EssentialMode
  progress: ProgressMode
}

export const EMPTY_FILTERS: Filters = { query: '', levels: [], categories: [], essential: 'all', progress: 'all' }

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Matches the step name or any alias; "pick up", "pick-up" and "pickup" all find Pullback. */
export function matchesQuery(step: Step, query: string): boolean {
  const q = normalize(query)
  if (!q) return true
  const tokens = q.split(' ')
  const compactQuery = q.replace(/ /g, '')
  return [step.name, ...step.aliases].some((text) => {
    const hay = normalize(text)
    return tokens.every((t) => hay.includes(t)) || hay.replace(/ /g, '').includes(compactQuery)
  })
}

function matchesProgress(step: Step, mode: ProgressMode, statuses: PracticeStatuses): boolean {
  if (mode === 'all') return true
  const status = statuses[step.id]
  return mode === 'not-started' ? status === undefined : status === mode
}

export function filterSteps(steps: Step[], filters: Filters, statuses: PracticeStatuses = {}): Step[] {
  return steps.filter(
    (step) =>
      (filters.levels.length === 0 || filters.levels.includes(step.level)) &&
      (filters.categories.length === 0 || filters.categories.includes(step.category)) &&
      (filters.essential === 'all' || (filters.essential === 'essential') === step.essential) &&
      matchesProgress(step, filters.progress, statuses) &&
      matchesQuery(step, filters.query),
  )
}

export function activeFilterCount(filters: Filters): number {
  return (
    filters.levels.length +
    filters.categories.length +
    (filters.essential === 'all' ? 0 : 1) +
    (filters.progress === 'all' ? 0 : 1)
  )
}

export function isFiltering(filters: Filters): boolean {
  return activeFilterCount(filters) > 0 || normalize(filters.query) !== ''
}

/** Key for the "show more" state of one level's essential or optional list. */
export function groupKey(level: Level, essential: boolean): string {
  return `${level}-${essential ? 'essential' : 'optional'}`
}
