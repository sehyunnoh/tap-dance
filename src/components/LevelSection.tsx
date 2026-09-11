import { LEVELS } from '../data/meta'
import { stepsInLevel } from '../data/steps'
import { progressOf } from '../lib/practice'
import { groupKey } from '../lib/search'
import { useListState } from '../state/listState'
import { usePractice } from '../state/practiceState'
import type { Level, Step } from '../types'
import { ChevronDownIcon, ChevronUpIcon } from './icons'
import { StepRow } from './StepRow'
import { LevelSquare } from './ui'

/** Rows shown per group before "Show N more". */
export const GROUP_LIMIT = 8

interface Props {
  level: Level
  steps: Step[]
  /** Show every row (used while searching or filtering). */
  showAll: boolean
  selectedId?: string
}

export function LevelSection({ level, steps, showAll, selectedId }: Props) {
  const { openLevels, toggleLevel, expandedGroups, expandGroup } = useListState()
  const open = openLevels.has(level)
  const essential = steps.filter((s) => s.essential)
  const optional = steps.filter((s) => !s.essential)
  // Progress covers the whole level, even while the list is filtered.
  const progress = progressOf(stepsInLevel(level), usePractice().statuses)
  const started = progress.learned + progress.learning > 0
  const percent = (n: number) => `${(n / progress.total) * 100}%`

  const group = (list: Step[], isEssential: boolean) => {
    const key = groupKey(level, isEssential)
    const shown = showAll || expandedGroups.has(key) ? list : list.slice(0, GROUP_LIMIT)
    return (
      <>
        <ul className="m-0 list-none p-0">
          {shown.map((step) => (
            <li key={step.id}>
              <StepRow step={step} selected={step.id === selectedId} />
            </li>
          ))}
        </ul>
        {shown.length < list.length && (
          <div className="px-4 pt-1 lg:px-5">
            <button
              type="button"
              onClick={() => expandGroup(key)}
              className="flex h-12 w-full items-center justify-center rounded-[10px] border-[1.5px] border-dashed border-chip text-sm text-ink-2 hover:bg-soft"
            >
              Show {list.length - shown.length} more {isEssential ? 'essential' : 'optional'} steps
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <section id={`level-${level}`} className="scroll-mt-2 border-t-[1.5px] border-ink" aria-labelledby={`level-${level}-title`}>
      <h2 className="m-0">
        <button
          type="button"
          onClick={() => toggleLevel(level)}
          aria-expanded={open}
          className="flex min-h-[76px] w-full items-center gap-3 px-4 text-left lg:px-5"
        >
          <LevelSquare level={level} />
          <span className="flex flex-1 flex-col gap-0.5">
            <span id={`level-${level}-title`} className="font-hand text-[23px] font-bold leading-[1.1]">
              Level {level} · {LEVELS[level].name}
            </span>
            <span className="text-[13px] font-normal text-muted">
              {essential.length} essential · {optional.length} optional
              {started && ` · ${progress.learned}/${progress.total} learned`}
            </span>
            {started && (
              <span aria-hidden="true" className="mt-1 flex h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-fill">
                <span className="bg-ink" style={{ width: percent(progress.learned) }} />
                <span className="bg-chip" style={{ width: percent(progress.learning) }} />
              </span>
            )}
          </span>
          {open ? <ChevronUpIcon size={22} /> : <ChevronDownIcon size={22} />}
        </button>
      </h2>
      {open && (
        <div className="pb-4">
          {group(essential, true)}
          {optional.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-4 pb-1.5 pt-5 text-xs tracking-wide text-muted lg:px-5">
                <span>Optional steps</span>
                <span className="flex-1 border-t-[1.5px] border-dashed border-line-2" />
              </div>
              {group(optional, false)}
            </>
          )}
        </div>
      )}
    </section>
  )
}
