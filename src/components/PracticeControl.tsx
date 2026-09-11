import type { PracticeStatus } from '../lib/practice'
import { usePractice } from '../state/practiceState'
import { CheckIcon, HalfCircleIcon } from './icons'
import { BUTTON_ON } from './ui'

const OPTIONS: { status: PracticeStatus | null; label: string }[] = [
  { status: null, label: 'Not started' },
  { status: 'learning', label: 'Learning' },
  { status: 'learned', label: 'Learned' },
]

/** Lets the user mark where they are with a step. */
export function PracticeControl({ stepId }: { stepId: string }) {
  const { statuses, setStatus } = usePractice()
  const current = statuses[stepId] ?? null

  return (
    <div className="flex flex-col gap-1.5">
      <span id="practice-label" className="text-xs tracking-wide text-muted">
        My progress
      </span>
      <div role="group" aria-labelledby="practice-label" className="grid w-full max-w-sm grid-cols-3 overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-card">
        {OPTIONS.map((o, i) => {
          const on = current === o.status
          return (
            <button
              key={o.label}
              type="button"
              aria-pressed={on}
              onClick={() => setStatus(stepId, o.status)}
              className={`flex h-11 items-center justify-center gap-1.5 text-sm ${i > 0 ? 'border-l-[1.5px] border-ink' : ''} ${on ? BUTTON_ON : ''}`}
            >
              {o.status === 'learning' && <HalfCircleIcon size={15} />}
              {o.status === 'learned' && <CheckIcon size={15} />}
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
