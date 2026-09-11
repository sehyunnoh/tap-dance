import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { LEVEL_NUMBERS, LEVELS } from '../data/meta'
import { STEP_BY_ID, stepsInLevel } from '../data/steps'
import { progressOf, type PracticeStatuses } from '../lib/practice'
import { buildRoadmap, readinessOf, type Readiness } from '../lib/roadmap'
import { usePractice } from '../state/practiceState'
import type { Level, Step } from '../types'
import { CheckIcon, ChevronLeftIcon, CloseIcon, HalfCircleIcon } from './icons'
import { BUTTON, BUTTON_ON, LevelDot } from './ui'

const LOOK: Record<Readiness, string> = {
  learned: 'border-ink bg-ink text-paper',
  learning: 'border-ink bg-card',
  ready: 'border-ink bg-card',
  blocked: 'border-dashed border-chip bg-card text-muted',
}

const READINESS_LABEL: Record<Readiness, string> = {
  learned: 'Learned',
  learning: 'Learning',
  ready: 'Ready to try',
  blocked: 'Learn the steps before it first',
}

function ReadinessIcon({ readiness, level }: { readiness: Readiness; level: Level }) {
  if (readiness === 'learned') return <CheckIcon size={14} />
  if (readiness === 'learning') return <HalfCircleIcon size={14} />
  if (readiness === 'ready') return <LevelDot level={level} />
  return null
}

function unique(ids: string[]): Step[] {
  return [...new Set(ids)].map((id) => STEP_BY_ID.get(id)).filter((s): s is Step => s !== undefined)
}

/** One level's steps laid out in stages, colored by the user's progress; tapping a step shows its links. */
export function Roadmap({ level }: { level: Level }) {
  const { statuses } = usePractice()
  const navigate = useNavigate()
  const initialFocus = (useLocation().state as { focus?: string } | null)?.focus
  const steps = stepsInLevel(level)
  const roadmap = useMemo(() => buildRoadmap(steps), [steps])
  const [focusId, setFocusId] = useState<string | null>(initialFocus ?? null)
  const focus = focusId ? STEP_BY_ID.get(focusId) : undefined

  const containerRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef(new Map<string, HTMLButtonElement>())
  const [lines, setLines] = useState<{ d: string; toFocus: boolean }[]>([])

  const related = useMemo(
    () => (focus ? new Set([focus.id, ...roadmap.parents.get(focus.id)!, ...roadmap.children.get(focus.id)!]) : null),
    [focus, roadmap],
  )

  // Draw arrows from the focused step's prerequisites to it, and from it to its next steps.
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !focus) {
      setLines([])
      return
    }
    const measure = () => {
      const box = container.getBoundingClientRect()
      const rectOf = (id: string) => chipRefs.current.get(id)?.getBoundingClientRect()
      const connect = (from: DOMRect, to: DOMRect) => {
        const x1 = from.left + from.width / 2 - box.left
        const x2 = to.left + to.width / 2 - box.left
        if (Math.abs(from.top - to.top) < 4) {
          const y = from.bottom - box.top
          return `M${x1},${y} C${x1},${y + 26} ${x2},${y + 26} ${x2},${y + 3}`
        }
        const down = from.top < to.top
        const y1 = (down ? from.bottom : from.top) - box.top
        const y2 = (down ? to.top - 3 : to.bottom + 3) - box.top
        const mid = (y1 + y2) / 2
        return `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`
      }
      const self = rectOf(focus.id)
      if (!self) return
      const next: { d: string; toFocus: boolean }[] = []
      for (const id of roadmap.parents.get(focus.id)!) {
        const rect = rectOf(id)
        if (rect) next.push({ d: connect(rect, self), toFocus: true })
      }
      for (const id of roadmap.children.get(focus.id)!) {
        const rect = rectOf(id)
        if (rect) next.push({ d: connect(self, rect), toFocus: false })
      }
      setLines(next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [focus, roadmap])

  // Bring the focused step into view above the panel, e.g. after "Show on the roadmap" or a pick in the panel.
  // A passive effect, so it runs after the page's own scroll-to-top on arrival.
  useEffect(() => {
    if (focusId) chipRefs.current.get(focusId)?.scrollIntoView({ block: 'nearest' })
  }, [focusId])

  const progress = progressOf(steps, statuses)
  const readyCount = steps.filter((s) => readinessOf(s, statuses) === 'ready').length

  function pick(step: Step) {
    if (step.level === level) setFocusId(step.id)
    else navigate(`/roadmap/${step.level}`, { state: { focus: step.id } })
  }

  return (
    // While the panel is open, leave room under the last stage so any step can scroll above it.
    <div className={`flex flex-col ${focus ? 'pb-[calc(48dvh+2rem)]' : 'pb-8'}`}>
      <div className="flex h-14 items-center justify-between border-b-[1.5px] border-ink pl-1 pr-3 lg:hidden">
        <Link to="/" className="flex h-11 items-center gap-0.5 px-2 text-[15px]">
          <ChevronLeftIcon size={22} />
          All steps
        </Link>
        <span className="text-[13px] text-muted">Roadmap</span>
      </div>

      <div className="flex flex-col gap-5 px-4 pt-5 lg:px-9 lg:pt-7">
        <header className="flex flex-col gap-2">
          <h1 className="m-0 font-hand text-[38px] font-bold leading-none lg:text-[46px]">Roadmap</h1>
          <p className="m-0 max-w-[65ch] text-[15px] leading-relaxed text-ink-2">
            Each stage builds on the ones above it. Tap a step to see what it needs and where it leads.
          </p>
        </header>

        <nav aria-label="Level" className="grid max-w-md grid-cols-7 gap-1.5">
          {LEVEL_NUMBERS.map((l) => (
            <Link
              key={l}
              to={`/roadmap/${l}`}
              aria-current={l === level ? 'page' : undefined}
              aria-label={`Level ${l}, ${LEVELS[l].name}`}
              className={`flex h-11 items-center justify-center rounded-[10px] font-hand text-[22px] font-bold ${
                l === level ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'opacity-50 hover:opacity-80'
              }`}
              style={{ background: LEVELS[l].color, color: LEVELS[l].onColor }}
            >
              {l}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-1">
          <h2 className="m-0 font-hand text-[26px] font-bold leading-tight">
            Level {level} · {LEVELS[level].name}
          </h2>
          <span className="text-[13px] text-muted">
            {progress.learned}/{progress.total} learned · {progress.learning} learning · {readyCount} ready to try
          </span>
        </div>

        <ul aria-label="Legend" className="m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-xs text-ink-2">
          {(['learned', 'learning', 'ready', 'blocked'] as const).map((r) => (
            <li key={r} className="flex items-center gap-1.5">
              <span className={`flex h-5 min-w-8 items-center justify-center rounded-md border-[1.5px] px-1 ${LOOK[r]}`}>
                <ReadinessIcon readiness={r} level={level} />
              </span>
              {READINESS_LABEL[r]}
            </li>
          ))}
          <li className="text-muted">Optional steps in lighter text</li>
        </ul>

        <div ref={containerRef} className="relative flex flex-col gap-7 pt-1">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible text-ink">
            <defs>
              <marker id="roadmap-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
              </marker>
            </defs>
            {lines.map((line) => (
              <path
                key={line.d}
                d={line.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray={line.toFocus ? undefined : '6 4'}
                markerEnd="url(#roadmap-arrow)"
              />
            ))}
          </svg>

          {roadmap.stages.map((stage, i) => (
            <section key={i} className="flex flex-col gap-2">
              <h3 className="m-0 text-xs font-normal tracking-wide text-muted">
                Stage {i + 1}
                {i === 0 && (level === 1 ? ' · start here' : ' · builds on earlier levels')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {stage.map((step) => {
                  const readiness = readinessOf(step, statuses)
                  const focused = focus?.id === step.id
                  return (
                    <button
                      key={step.id}
                      ref={(el) => {
                        if (el) chipRefs.current.set(step.id, el)
                        else chipRefs.current.delete(step.id)
                      }}
                      type="button"
                      aria-pressed={focused}
                      aria-label={`${step.name}, ${READINESS_LABEL[readiness]}`}
                      onClick={() => setFocusId(focused ? null : step.id)}
                      className={`relative flex min-h-10 scroll-mt-24 scroll-mb-[calc(48dvh+5rem)] items-center gap-1.5 rounded-[10px] border-[1.5px] px-2.5 py-1 text-left font-hand text-[17px] leading-tight transition-opacity ${
                        LOOK[readiness]
                      } ${step.essential ? 'font-bold' : 'font-normal'} ${related && !related.has(step.id) ? 'opacity-25' : ''} ${
                        focused ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : ''
                      }`}
                    >
                      <ReadinessIcon readiness={readiness} level={level} />
                      {step.name}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {focus && (
        <FocusPanel
          step={focus}
          statuses={statuses}
          before={unique([...(focus.prerequisites ?? []), ...roadmap.parents.get(focus.id)!])}
          after={unique([...(focus.nextSteps ?? []), ...roadmap.children.get(focus.id)!])}
          onPick={pick}
          onClose={() => setFocusId(null)}
        />
      )}
    </div>
  )
}

interface PanelProps {
  step: Step
  statuses: PracticeStatuses
  before: Step[]
  after: Step[]
  onPick: (step: Step) => void
  onClose: () => void
}

function FocusPanel({ step, statuses, before, after, onPick, onClose }: PanelProps) {
  const readiness = readinessOf(step, statuses)
  const missing = before.filter((s) => statuses[s.id] !== 'learned').length

  const chip = (s: Step) => (
    <button key={s.id} type="button" onClick={() => onPick(s)} className={`${BUTTON} h-9 px-2.5 hover:bg-soft`}>
      <LevelDot level={s.level} />
      {statuses[s.id] === 'learned' && <CheckIcon size={13} />}
      {statuses[s.id] === 'learning' && <HalfCircleIcon size={13} />}
      <span className="font-hand text-base font-bold">{s.name}</span>
    </button>
  )

  return (
    <div
      role="region"
      aria-label={`${step.name} on the roadmap`}
      className="fixed inset-x-0 bottom-16 z-50 flex max-h-[48dvh] flex-col gap-3 overflow-y-auto border-t-[1.5px] border-ink bg-paper px-4 pb-4 pt-3 shadow-[0_-6px_20px_rgba(38,37,33,0.12)] lg:left-[400px] lg:px-9"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-hand text-[26px] font-bold leading-tight">{step.name}</span>
          <span className="text-[13px] text-muted">
            {READINESS_LABEL[readiness]}
            {readiness === 'blocked' && ` · ${missing} to go`}
          </span>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="flex size-11 shrink-0 items-center justify-center">
          <CloseIcon size={22} />
        </button>
      </div>

      {before.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs tracking-wide text-muted">Learn first</span>
          <div className="flex flex-wrap gap-1.5">{before.map(chip)}</div>
        </div>
      )}
      {after.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs tracking-wide text-muted">Leads to</span>
          <div className="flex flex-wrap gap-1.5">{after.map(chip)}</div>
        </div>
      )}

      <Link to={`/steps/${step.id}`} className={`${BUTTON} ${BUTTON_ON} w-full max-w-sm`}>
        Open {step.name}
      </Link>
    </div>
  )
}
