import type { MouseEvent } from 'react'
import { formatTime } from '../lib/format'

interface Props {
  time: number
  duration: number
  loopA: number | null
  loopB: number | null
  onSeek: (seconds: number) => void
}

/** Progress bar with the A–B loop marked. Click anywhere to seek. */
export function Timeline({ time, duration, loopA, loopB, onSeek }: Props) {
  const pct = (t: number) => (duration > 0 ? Math.min(100, Math.max(0, (t / duration) * 100)) : 0)

  function seek(e: MouseEvent<HTMLDivElement>) {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    onSeek(((e.clientX - rect.left) / rect.width) * duration)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="slider"
        tabIndex={-1}
        aria-label="Video position"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(time)}
        aria-valuetext={formatTime(time)}
        onClick={seek}
        className="relative h-11 cursor-pointer"
      >
        <div className="absolute inset-x-0 top-[22px] h-1 rounded-full bg-line-2" />
        <div className="absolute left-0 top-[22px] h-1 rounded-full bg-ink" style={{ width: `${pct(time)}%` }} />
        {loopA !== null && (
          <>
            <div
              className="absolute top-4 box-border h-4 rounded-[3px] border-[1.5px] border-dashed border-ink bg-ink/15"
              style={{ left: `${pct(loopA)}%`, width: `${Math.max(0.8, pct(loopB ?? loopA) - pct(loopA))}%` }}
            />
            <span className="absolute top-0 -translate-x-1/2 text-[11px] font-bold" style={{ left: `${pct(loopA)}%` }}>
              A
            </span>
          </>
        )}
        {loopB !== null && (
          <span className="absolute top-0 -translate-x-1/2 text-[11px] font-bold" style={{ left: `${pct(loopB)}%` }}>
            B
          </span>
        )}
        <div
          className="absolute top-[15px] size-[18px] -translate-x-1/2 rounded-full border-2 border-paper bg-ink"
          style={{ left: `${pct(time)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs tabular-nums text-muted">
        <span>
          {formatTime(time)} / {formatTime(duration)}
        </span>
        {loopA !== null && (
          <span className="text-ink">
            {loopB !== null ? `Looping A ${formatTime(loopA)} → B ${formatTime(loopB)}` : `A set at ${formatTime(loopA)} — now set B`}
          </span>
        )}
      </div>
    </div>
  )
}
