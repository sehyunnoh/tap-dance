import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { categoryLabel } from '../data/meta'
import { hasDetails } from '../data/steps'
import { soundsLabel } from '../lib/format'
import type { Step } from '../types'
import { ChevronRightIcon } from './icons'
import { Tag } from './ui'

export function StepRow({ step, selected }: { step: Step; selected: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  return (
    <Link
      ref={ref}
      to={`/steps/${step.id}`}
      aria-current={selected ? 'page' : undefined}
      className={`flex min-h-[68px] items-center gap-3 border-t border-line px-4 py-2 lg:px-5 ${
        selected ? 'bg-ink text-paper' : 'hover:bg-soft'
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className={`font-hand text-[21px] font-bold leading-[1.1] ${step.essential || selected ? '' : 'text-ink-2'}`}>
            {step.name}
          </span>
          {step.aliases.length > 0 && (
            <span className={`text-xs ${selected ? 'text-line-2' : 'text-faint'}`}>aka {step.aliases.join(' · ')}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {!step.essential && <Tag variant="dashed">Optional</Tag>}
          <Tag>{categoryLabel(step.category)}</Tag>
          {step.sounds !== undefined && <Tag>{soundsLabel(step.sounds)}</Tag>}
          {!hasDetails(step) && <Tag variant="muted">Details soon</Tag>}
        </div>
      </div>
      <ChevronRightIcon className={selected ? 'text-paper' : 'text-faint'} />
    </Link>
  )
}
