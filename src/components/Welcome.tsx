import { Link } from 'react-router'
import { STEPS } from '../data/steps'
import { nextToPractice, progressOf } from '../lib/practice'
import { usePractice } from '../state/practiceState'

/** Desktop right pane before a step is picked. */
export function Welcome() {
  const { statuses } = usePractice()
  const next = nextToPractice(STEPS, statuses)
  const { learned, learning } = progressOf(STEPS, statuses)
  const started = learned + learning > 0

  return (
    <div className="flex max-w-xl flex-col gap-5 px-9 py-12">
      <h1 className="m-0 font-hand text-[46px] font-bold leading-none">Pick a step to practice</h1>
      <p className="m-0 text-[15px] leading-relaxed text-ink-2">
        {STEPS.length} tap steps in 7 levels, from single sounds to wings and pullbacks. Each step has a short description, the
        count, practice tips and videos you can slow down, loop and mirror. The metronome at the bottom works on every page.
      </p>
      {started && (
        <p className="m-0 text-[15px] text-ink-2">
          You’ve learned {learned} of {STEPS.length} steps{learning > 0 && ` and are working on ${learning}`}.
        </p>
      )}
      {next ? (
        <Link
          to={`/steps/${next.id}`}
          className="flex h-12 w-fit items-center gap-2 rounded-[10px] border-[1.5px] border-ink bg-ink px-4 text-[15px] text-paper"
        >
          {started ? 'Continue with' : 'Start with'} Level {next.level}: <span className="font-hand text-xl font-bold">{next.name}</span>
        </Link>
      ) : (
        <p className="m-0 text-[15px] font-bold">Every step is marked learned. Wonderful work!</p>
      )}
    </div>
  )
}
