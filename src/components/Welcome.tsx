import { Link } from 'react-router'
import { STEPS } from '../data/steps'

/** Desktop right pane before a step is picked. */
export function Welcome() {
  const first = STEPS[0]
  return (
    <div className="flex max-w-xl flex-col gap-5 px-9 py-12">
      <h1 className="m-0 font-hand text-[46px] font-bold leading-none">Pick a step to practice</h1>
      <p className="m-0 text-[15px] leading-relaxed text-ink-2">
        {STEPS.length} tap steps in 7 levels, from single sounds to wings and pullbacks. Each step has a short description, the
        count, practice tips and videos you can slow down, loop and mirror. The metronome at the bottom works on every page.
      </p>
      {first && (
        <Link
          to={`/steps/${first.id}`}
          className="flex h-12 w-fit items-center gap-2 rounded-[10px] border-[1.5px] border-ink bg-ink px-4 text-[15px] text-paper"
        >
          Start with Level 1: <span className="font-hand text-xl font-bold">{first.name}</span>
        </Link>
      )}
    </div>
  )
}
