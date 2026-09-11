import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { track } from '../lib/analytics'
import { MetronomeEngine } from '../lib/metronomeEngine'
import { readStorage, writeStorage } from '../lib/storage'
import { addTap, bpmFromTaps, clampBpm } from '../lib/tempo'
import { MetronomeContext, type MetronomeState, type Suggestion } from './metronomeState'

export function MetronomeProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<MetronomeEngine | null>(null)
  const tapsRef = useRef<number[]>([])
  const [bpm, setBpmState] = useState(() => clampBpm(readStorage('metronome-bpm', 80)))
  const [eighths, setEighthsState] = useState(() => readStorage('metronome-eighths', false))
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState<MetronomeState['beat']>(null)
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)

  const setBpm = useCallback((value: number) => {
    const next = clampBpm(value)
    setBpmState(next)
    writeStorage('metronome-bpm', next)
    if (engineRef.current) engineRef.current.bpm = next
  }, [])

  const setEighths = useCallback((on: boolean) => {
    setEighthsState(on)
    writeStorage('metronome-eighths', on)
    engineRef.current?.setEighths(on)
  }, [])

  const toggle = useCallback(() => {
    const engine = (engineRef.current ??= new MetronomeEngine())
    if (engine.running) {
      engine.stop()
      setRunning(false)
      setBeat(null)
      return
    }
    engine.bpm = bpm
    engine.setEighths(eighths)
    engine.onClick = (index, off) => setBeat({ index, off })
    engine.start()
    setRunning(true)
    track('metronome-start', { bpm })
  }, [bpm, eighths])

  const tap = useCallback(() => {
    tapsRef.current = addTap(tapsRef.current, performance.now())
    const tapped = bpmFromTaps(tapsRef.current)
    if (tapped !== null) setBpm(tapped)
  }, [setBpm])

  useEffect(() => () => engineRef.current?.stop(), [])

  const value = useMemo<MetronomeState>(
    () => ({ bpm, setBpm, running, toggle, eighths, setEighths, beat, tap, suggestion, setSuggestion }),
    [bpm, setBpm, running, toggle, eighths, setEighths, beat, tap, suggestion],
  )

  return <MetronomeContext.Provider value={value}>{children}</MetronomeContext.Provider>
}
