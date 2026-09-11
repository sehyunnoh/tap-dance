import { useEffect, useState } from 'react'
import { MAX_BPM, MIN_BPM } from '../lib/tempo'
import { useMetronome, type MetronomeState } from '../state/metronomeState'
import { ChevronDownIcon, CloseIcon, MetronomeIcon, PlayIcon, StopIcon } from './icons'
import { BUTTON, BUTTON_ON } from './ui'

function BeatDots({ beat, large = false }: { beat: MetronomeState['beat']; large?: boolean }) {
  return (
    <div className={`flex items-center ${large ? 'gap-3.5' : 'gap-1.5'}`} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => {
        const lit = beat !== null && beat.index === i && !beat.off
        const accent = i === 0
        const size = large ? (accent ? 22 : 16) : accent ? 10 : 8
        return (
          <span
            key={i}
            className={`rounded-full border-ink ${lit ? 'bg-ink' : accent && beat === null ? 'bg-ink' : ''}`}
            style={{ width: size, height: size, borderWidth: lit || (accent && beat === null) ? 0 : large ? 2 : 1.5 }}
          />
        )
      })}
    </div>
  )
}

function StartButton({ big = false }: { big?: boolean }) {
  const { running, toggle } = useMetronome()
  if (big) {
    return (
      <button type="button" onClick={toggle} className={`${BUTTON} ${BUTTON_ON} h-14 text-[17px]`}>
        {running ? <StopIcon size={20} /> : <PlayIcon size={20} />}
        {running ? 'Stop' : 'Start'}
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={running ? 'Stop metronome' : 'Start metronome'}
      className={`flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink ${running ? BUTTON_ON : ''}`}
    >
      {running ? <StopIcon size={18} /> : <PlayIcon size={18} />}
    </button>
  )
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className={`${BUTTON} h-14 justify-between`}>
      <span>{label}</span>
      <span className={`relative h-[26px] w-11 rounded-full ${on ? 'bg-ink' : 'bg-line-2'}`}>
        <span className={`absolute top-[3px] size-5 rounded-full bg-card transition-all ${on ? 'left-[21px]' : 'left-[3px]'}`} />
      </span>
    </button>
  )
}

/** Pinned to the bottom of every screen; tap it to open the full metronome. */
export function MetronomeBar() {
  const m = useMetronome()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const suggestionText = m.suggestion ? `Suggested ${m.suggestion.slow}–${m.suggestion.normal}` : null

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[60] flex h-16 items-center gap-3 border-t-[1.5px] border-ink bg-card px-4 pb-[env(safe-area-inset-bottom)] lg:gap-3 lg:px-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open metronome"
          className="flex h-11 min-w-0 flex-1 items-center gap-3 text-left lg:flex-none"
        >
          <MetronomeIcon size={22} />
          <span className="flex items-baseline gap-1">
            <span className="font-hand text-[28px] font-bold tabular-nums">{m.bpm}</span>
            <span className="text-xs text-muted">BPM</span>
          </span>
          <span className="lg:hidden">
            <BeatDots beat={m.beat} />
          </span>
          {suggestionText && <span className="truncate text-xs text-muted lg:hidden">{suggestionText}</span>}
        </button>

        <div className="hidden flex-1 items-center gap-3 lg:flex">
          <button type="button" onClick={() => m.setBpm(m.bpm - 5)} className={`${BUTTON} h-10`}>
            −5
          </button>
          <button type="button" onClick={() => m.setBpm(m.bpm + 5)} className={`${BUTTON} h-10`}>
            +5
          </button>
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={m.bpm}
            onChange={(e) => m.setBpm(Number(e.target.value))}
            aria-label="Tempo"
            className="h-10 w-40 accent-ink"
          />
          <button type="button" onClick={m.tap} className={`${BUTTON} h-10 border-dashed`}>
            Tap tempo
          </button>
          {m.suggestion && (
            <>
              <button type="button" onClick={() => m.setBpm(m.suggestion!.slow)} className={`${BUTTON} h-10`}>
                Slow {m.suggestion.slow}
              </button>
              <button type="button" onClick={() => m.setBpm(m.suggestion!.normal)} className={`${BUTTON} h-10`}>
                Normal {m.suggestion.normal}
              </button>
            </>
          )}
          <button
            type="button"
            role="switch"
            aria-checked={m.eighths}
            onClick={() => m.setEighths(!m.eighths)}
            className={`${BUTTON} h-10 ${m.eighths ? BUTTON_ON : ''}`}
          >
            8th notes
          </button>
          <BeatDots beat={m.beat} />
        </div>

        <StartButton />
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center" role="dialog" aria-modal="true" aria-labelledby="metronome-title">
          <button type="button" aria-label="Close metronome" onClick={() => setOpen(false)} className="absolute inset-0 bg-scrim/45" />
          <div className="relative flex w-full flex-col gap-5 rounded-t-[18px] border-t-[1.5px] border-ink bg-paper px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2.5 lg:max-w-md lg:rounded-[18px] lg:border-[1.5px] lg:pb-5">
            <span className="mx-auto h-1 w-10 rounded-full bg-chip lg:invisible" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MetronomeIcon size={22} />
                <h2 id="metronome-title" className="m-0 font-hand text-[26px] font-bold">
                  Metronome
                </h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close metronome" className="flex size-11 items-center justify-center">
                <span className="lg:hidden">
                  <ChevronDownIcon size={22} />
                </span>
                <span className="hidden lg:inline">
                  <CloseIcon size={22} />
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => m.setBpm(m.bpm - 5)} className="size-[60px] rounded-full border-[1.5px] border-ink bg-card text-[17px]">
                −5
              </button>
              <div className="flex items-baseline gap-1.5">
                <span className="font-hand text-[76px] font-bold leading-none tabular-nums">{m.bpm}</span>
                <span className="text-[15px] text-muted">BPM</span>
              </div>
              <button type="button" onClick={() => m.setBpm(m.bpm + 5)} className="size-[60px] rounded-full border-[1.5px] border-ink bg-card text-[17px]">
                +5
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <input
                type="range"
                min={MIN_BPM}
                max={MAX_BPM}
                value={m.bpm}
                onChange={(e) => m.setBpm(Number(e.target.value))}
                aria-label="Tempo"
                className="h-11 w-full accent-ink"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>{MIN_BPM}</span>
                <span>{MAX_BPM}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3.5">
              <BeatDots beat={m.beat} large />
              <span className="ml-1.5 text-xs tracking-wide text-muted">4 beats · accent on 1</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={m.tap} className={`${BUTTON} h-14 border-2 border-dashed`}>
                Tap tempo
              </button>
              <Switch on={m.eighths} onChange={m.setEighths} label="8th notes" />
            </div>

            {m.suggestion && (
              <div className="flex flex-col gap-2">
                <span className="text-xs tracking-wide text-muted">Suggested tempo for {m.suggestion.stepName}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => m.setBpm(m.suggestion!.slow)} className={`${BUTTON} h-12 text-[15px]`}>
                    Slow · {m.suggestion.slow}
                  </button>
                  <button type="button" onClick={() => m.setBpm(m.suggestion!.normal)} className={`${BUTTON} h-12 text-[15px]`}>
                    Normal · {m.suggestion.normal}
                  </button>
                </div>
              </div>
            )}

            <StartButton big />
          </div>
        </div>
      )}
    </>
  )
}
