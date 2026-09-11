import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, LEVEL_NUMBERS } from '../data/meta'
import { STEPS } from '../data/steps'
import { track } from '../lib/analytics'
import { EMPTY_FILTERS, filterSteps, type EssentialMode, type Filters, type ProgressMode } from '../lib/search'
import { useListState } from '../state/listState'
import { usePractice } from '../state/practiceState'
import { CloseIcon } from './icons'
import { BUTTON, BUTTON_ON, LevelDot } from './ui'

const ESSENTIAL_OPTIONS: { id: EssentialMode; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'essential', label: 'Essential' },
  { id: 'optional', label: 'Optional' },
]

const PROGRESS_OPTIONS: { id: ProgressMode; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'not-started', label: 'Not started' },
  { id: 'learning', label: 'Learning' },
  { id: 'learned', label: 'Learned' },
]

function toggled<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function FilterSheet({ onClose }: { onClose: () => void }) {
  const { filters, setFilters } = useListState()
  const { statuses } = usePractice()
  const [draft, setDraft] = useState<Filters>(filters)
  const count = useMemo(() => filterSteps(STEPS, draft, statuses).length, [draft, statuses])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  function apply() {
    setFilters(draft)
    track('filter-apply', {
      levels: draft.levels.join(',') || 'all',
      categories: draft.categories.join(',') || 'all',
      essential: draft.essential,
      progress: draft.progress,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center lg:items-center" role="dialog" aria-modal="true" aria-labelledby="filter-title">
      <button type="button" aria-label="Close filters" onClick={onClose} className="absolute inset-0 bg-ink/45" />
      <div className="relative flex max-h-[92dvh] w-full flex-col gap-5 overflow-y-auto rounded-t-[18px] border-t-[1.5px] border-ink bg-paper px-4 pb-5 pt-2.5 lg:max-w-md lg:rounded-[18px] lg:border-[1.5px]">
        <span className="mx-auto h-1 w-10 rounded-full bg-chip lg:invisible" />
        <div className="flex items-center justify-between">
          <h2 id="filter-title" className="m-0 font-hand text-[26px] font-bold">
            Filters
          </h2>
          <button type="button" onClick={onClose} aria-label="Close filters" className="flex size-11 items-center justify-center">
            <CloseIcon size={22} />
          </button>
        </div>

        <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
          <legend className="mb-2.5 p-0 text-[13px] tracking-wide text-muted">Level (select any)</legend>
          <div className="grid grid-cols-4 gap-2">
            {LEVEL_NUMBERS.map((level) => {
              const on = draft.levels.includes(level)
              return (
                <button
                  key={level}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setDraft({ ...draft, levels: toggled(draft.levels, level) })}
                  className={`${BUTTON} ${on ? BUTTON_ON : ''}`}
                >
                  <LevelDot level={level} />
                  Lv {level}
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="m-0 flex flex-col border-0 p-0">
          <legend className="mb-2.5 p-0 text-[13px] tracking-wide text-muted">Category (select any)</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const on = draft.categories.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setDraft({ ...draft, categories: toggled(draft.categories, c.id) })}
                  className={`${BUTTON} px-3.5 ${on ? BUTTON_ON : ''}`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="m-0 flex flex-col border-0 p-0">
          <legend className="mb-2.5 p-0 text-[13px] tracking-wide text-muted">Essential / Optional</legend>
          <div className="grid grid-cols-3 overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-card">
            {ESSENTIAL_OPTIONS.map((o, i) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={draft.essential === o.id}
                onClick={() => setDraft({ ...draft, essential: o.id })}
                className={`h-11 text-sm ${i > 0 ? 'border-l-[1.5px] border-ink' : ''} ${draft.essential === o.id ? BUTTON_ON : ''}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="m-0 flex flex-col border-0 p-0">
          <legend className="mb-2.5 p-0 text-[13px] tracking-wide text-muted">My progress</legend>
          <div className="grid grid-cols-4 overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-card">
            {PROGRESS_OPTIONS.map((o, i) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={draft.progress === o.id}
                onClick={() => setDraft({ ...draft, progress: o.id })}
                className={`h-11 px-1 text-[13px] ${i > 0 ? 'border-l-[1.5px] border-ink' : ''} ${draft.progress === o.id ? BUTTON_ON : ''}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex gap-2 pt-1.5">
          <button type="button" onClick={() => setDraft({ ...EMPTY_FILTERS, query: draft.query })} className={`${BUTTON} h-[52px] flex-1`}>
            Reset
          </button>
          <button type="button" onClick={apply} className={`${BUTTON} ${BUTTON_ON} h-[52px] flex-[2] text-base`}>
            Show {count} steps
          </button>
        </div>
      </div>
    </div>
  )
}
