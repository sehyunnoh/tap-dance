import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { LEVELS } from '../data/meta'
import type { Level, Step } from '../types'

export const BUTTON =
  'flex h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] border-[1.5px] border-ink bg-card px-3 text-sm disabled:border-line-2 disabled:text-faint'

export const BUTTON_ON = 'bg-ink text-paper'

export function Tag({ children, variant = 'plain' }: { children: ReactNode; variant?: 'plain' | 'dashed' | 'muted' }) {
  const look =
    variant === 'dashed'
      ? 'border-dashed border-chip text-muted'
      : variant === 'muted'
        ? 'border-line text-faint'
        : 'border-chip text-ink-2'
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md border-[1.2px] bg-card px-2 text-xs ${look}`}>
      {children}
    </span>
  )
}

export function LevelSquare({ level, size = 44 }: { level: Level; size?: number }) {
  const meta = LEVELS[level]
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-[10px] font-hand font-bold leading-none"
      style={{ width: size, height: size, background: meta.color, color: meta.onColor, fontSize: Math.round(size * 0.55) }}
    >
      {level}
    </span>
  )
}

export function LevelDot({ level }: { level: Level }) {
  return <span aria-hidden="true" className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: LEVELS[level].color }} />
}

export function StepChip({ step }: { step: Step }) {
  return (
    <Link to={`/steps/${step.id}`} className={`${BUTTON} hover:bg-soft`}>
      <LevelDot level={step.level} />
      <span className="font-hand text-lg font-bold">{step.name}</span>
    </Link>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="m-0 font-hand text-2xl font-bold">{children}</h2>
}
