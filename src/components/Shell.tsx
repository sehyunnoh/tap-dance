import { useLayoutEffect, useRef } from 'react'
import { Link, useMatch } from 'react-router'
import { LEVEL_NUMBERS } from '../data/meta'
import { STEP_BY_ID, STEPS } from '../data/steps'
import { nextToPractice } from '../lib/practice'
import { SITE_NAME, SITE_TITLE, titleForLevel, titleForStep } from '../lib/seo'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { usePractice } from '../state/practiceState'
import type { Level } from '../types'
import { RoadmapIcon } from './icons'
import { MetronomeBar } from './MetronomeBar'
import { Roadmap } from './Roadmap'
import { StepDetail, StepNotFound } from './StepDetail'
import { StepList } from './StepList'
import { ThemeToggle } from './ThemeToggle'
import { Welcome } from './Welcome'

function parseLevel(value: string | undefined): Level | undefined {
  const n = Number(value)
  return LEVEL_NUMBERS.find((level) => level === n)
}

/**
 * Phones show either the list or a page (a step or the roadmap); desktops show both side by side.
 * The list stays mounted in both cases so its scroll position and open levels survive.
 */
export function Shell() {
  const stepMatch = useMatch('/steps/:id')
  const roadmapLevelMatch = useMatch('/roadmap/:level')
  const roadmapMatch = useMatch('/roadmap')
  const { statuses } = usePractice()
  const id = stepMatch?.params.id
  const step = id ? STEP_BY_ID.get(id) : undefined
  // Plain /roadmap opens the level the user is working on.
  const roadmapLevel = roadmapLevelMatch
    ? (parseLevel(roadmapLevelMatch.params.level) ?? 1)
    : roadmapMatch
      ? (nextToPractice(STEPS, statuses)?.level ?? 1)
      : undefined
  const page = id ?? (roadmapLevel ? `roadmap-${roadmapLevel}` : undefined)

  // The prerender sets the first title; this keeps it right after client-side navigation.
  useDocumentTitle(step ? titleForStep(step) : roadmapLevel ? titleForLevel(roadmapLevel) : id ? `Step not found · ${SITE_NAME}` : SITE_TITLE)

  const mainRef = useRef<HTMLElement>(null)
  const listScroll = useRef(0)
  const previousPage = useRef<string | undefined>(undefined)

  useLayoutEffect(() => {
    const wasOnList = previousPage.current === undefined
    if (page && wasOnList) listScroll.current = window.scrollY
    if (page) {
      window.scrollTo(0, 0)
      mainRef.current?.scrollTo(0, 0)
    } else if (!wasOnList) {
      window.scrollTo(0, listScroll.current)
    }
    previousPage.current = page
  }, [page])

  return (
    <div className="flex min-h-dvh flex-col pb-16 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
      <header
        className={`h-14 shrink-0 items-center justify-between border-b-[1.5px] border-ink px-4 lg:flex lg:h-[60px] lg:px-6 ${page ? 'hidden' : 'flex'}`}
      >
        <Link to="/" className="font-hand text-[28px] font-bold">
          Tap Steps
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/roadmap"
            aria-current={roadmapLevel ? 'page' : undefined}
            className={`flex h-10 items-center gap-1.5 rounded-[10px] border-[1.5px] border-ink px-3 text-sm ${
              roadmapLevel ? 'bg-ink text-paper' : 'bg-card hover:bg-soft'
            }`}
          >
            <RoadmapIcon size={18} />
            Roadmap
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 lg:grid lg:min-h-0 lg:grid-cols-[400px_minmax(0,1fr)]">
        <aside aria-label="All steps" className={`lg:block lg:overflow-y-auto lg:border-r-[1.5px] lg:border-ink ${page ? 'hidden' : ''}`}>
          <StepList selectedId={id} />
        </aside>
        <main ref={mainRef} className={`lg:block lg:overflow-y-auto ${page ? '' : 'hidden'}`}>
          {roadmapLevel ? (
            <Roadmap key={roadmapLevel} level={roadmapLevel} />
          ) : id ? (
            step ? (
              <StepDetail key={step.id} step={step} />
            ) : (
              <StepNotFound />
            )
          ) : (
            <Welcome />
          )}
        </main>
      </div>

      <MetronomeBar />
    </div>
  )
}
