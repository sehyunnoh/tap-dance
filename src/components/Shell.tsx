import { useLayoutEffect, useRef } from 'react'
import { Link, useMatch } from 'react-router'
import { STEP_BY_ID } from '../data/steps'
import { MetronomeBar } from './MetronomeBar'
import { StepDetail, StepNotFound } from './StepDetail'
import { StepList } from './StepList'
import { Welcome } from './Welcome'

/**
 * Phones show either the list or a step; desktops show both side by side.
 * The list stays mounted in both cases so its scroll position and open levels survive.
 */
export function Shell() {
  const match = useMatch('/steps/:id')
  const id = match?.params.id
  const step = id ? STEP_BY_ID.get(id) : undefined
  const mainRef = useRef<HTMLElement>(null)
  const listScroll = useRef(0)
  const previousId = useRef<string | undefined>(undefined)

  useLayoutEffect(() => {
    const wasOnList = previousId.current === undefined
    if (id && wasOnList) listScroll.current = window.scrollY
    if (id) {
      window.scrollTo(0, 0)
      mainRef.current?.scrollTo(0, 0)
    } else if (!wasOnList) {
      window.scrollTo(0, listScroll.current)
    }
    previousId.current = id
  }, [id])

  return (
    <div className="flex min-h-dvh flex-col pb-16 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
      <header className={`h-14 shrink-0 items-center border-b-[1.5px] border-ink px-4 lg:flex lg:h-[60px] lg:px-6 ${id ? 'hidden' : 'flex'}`}>
        <Link to="/" className="font-hand text-[28px] font-bold">
          Tap Steps
        </Link>
      </header>

      <div className="flex-1 lg:grid lg:min-h-0 lg:grid-cols-[400px_minmax(0,1fr)]">
        <aside aria-label="All steps" className={`lg:block lg:overflow-y-auto lg:border-r-[1.5px] lg:border-ink ${id ? 'hidden' : ''}`}>
          <StepList selectedId={id} />
        </aside>
        <main ref={mainRef} className={`lg:block lg:overflow-y-auto ${id ? '' : 'hidden'}`}>
          {id ? step ? <StepDetail key={step.id} step={step} /> : <StepNotFound /> : <Welcome />}
        </main>
      </div>

      <MetronomeBar />
    </div>
  )
}
