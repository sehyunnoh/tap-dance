import { useEffect, useMemo, useState } from 'react'
import { LEVEL_NUMBERS, LEVELS } from '../data/meta'
import { STEP_BY_ID, STEPS, stepsInLevel } from '../data/steps'
import { track } from '../lib/analytics'
import { activeFilterCount, EMPTY_FILTERS, filterSteps, groupKey, isFiltering } from '../lib/search'
import { useListState } from '../state/listState'
import type { Level } from '../types'
import { FilterSheet } from './FilterSheet'
import { FilterIcon, SearchIcon } from './icons'
import { GROUP_LIMIT, LevelSection } from './LevelSection'

export function StepList({ selectedId }: { selectedId?: string }) {
  const { filters, setFilters, setQuery, openLevel, expandGroup } = useListState()
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = useMemo(() => filterSteps(STEPS, filters), [filters])
  const filtering = isFiltering(filters)
  const filterCount = activeFilterCount(filters)
  const essentialCount = filtered.filter((s) => s.essential).length

  // While searching or filtering, open every level that has a match.
  useEffect(() => {
    if (!filtering) return
    for (const level of new Set(filtered.map((s) => s.level))) openLevel(level)
  }, [filtering, filtered, openLevel])

  // Make sure the selected step is visible in the list (desktop sidebar, deep links).
  useEffect(() => {
    const step = selectedId ? STEP_BY_ID.get(selectedId) : undefined
    if (!step) return
    openLevel(step.level)
    const peers = stepsInLevel(step.level).filter((s) => s.essential === step.essential)
    if (peers.findIndex((s) => s.id === step.id) >= GROUP_LIMIT) expandGroup(groupKey(step.level, step.essential))
  }, [selectedId, openLevel, expandGroup])

  useEffect(() => {
    const q = filters.query.trim()
    if (q.length < 2) return
    const timer = window.setTimeout(() => track('search', { q, results: filtered.length }), 1200)
    return () => window.clearTimeout(timer)
  }, [filters.query, filtered.length])

  function jumpTo(level: Level) {
    openLevel(level)
    requestAnimationFrame(() => document.getElementById(`level-${level}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 px-4 pb-2 pt-3 lg:px-5 lg:pt-4">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-[10px] border-[1.5px] border-ink bg-card px-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink">
          <SearchIcon />
          <span className="sr-only">Search steps</span>
          <input
            type="search"
            value={filters.query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search steps or aliases"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
          />
        </label>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={`flex h-11 items-center gap-1.5 rounded-[10px] border-[1.5px] border-ink px-3 text-[15px] ${
            filterCount > 0 ? 'bg-ink text-paper' : 'bg-card'
          }`}
        >
          <FilterIcon />
          Filter{filterCount > 0 && ` · ${filterCount}`}
        </button>
      </div>

      <div className="flex flex-col gap-1.5 px-4 pb-3 pt-1.5 lg:px-5">
        <span className="text-xs tracking-wide text-muted">Jump to level</span>
        <div className="grid grid-cols-7 gap-1.5">
          {LEVEL_NUMBERS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => jumpTo(level)}
              aria-label={`Jump to Level ${level}, ${LEVELS[level].name}`}
              className="flex h-11 items-center justify-center rounded-[10px] font-hand text-[22px] font-bold"
              style={{ background: LEVELS[level].color, color: LEVELS[level].onColor }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-11 items-center justify-between border-t-[1.5px] border-dashed border-line-2 px-4 text-[13px] text-muted lg:px-5">
        <span aria-live="polite">
          {filtered.length} steps · {essentialCount} essential · {filtered.length - essentialCount} optional
        </span>
        {filtering ? (
          <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="h-11 text-ink underline">
            Clear all
          </button>
        ) : (
          <span>No filters</span>
        )}
      </div>

      {LEVEL_NUMBERS.map((level) => {
        const steps = filtered.filter((s) => s.level === level)
        if (filtering && steps.length === 0) return null
        return <LevelSection key={level} level={level} steps={steps} showAll={filtering} selectedId={selectedId} />
      })}

      {filtered.length === 0 && (
        <div className="flex flex-col items-start gap-3 border-t-[1.5px] border-ink px-4 py-8 lg:px-5">
          <p className="m-0 text-[15px]">No steps match your search.</p>
          <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="text-sm underline">
            Clear search and filters
          </button>
        </div>
      )}

      {sheetOpen && <FilterSheet onClose={() => setSheetOpen(false)} />}
    </div>
  )
}
