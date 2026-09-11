export const MIN_BPM = 40
export const MAX_BPM = 240

export function clampBpm(bpm: number): number {
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)))
}

/** Adds a tap time (ms). A pause longer than `resetAfterMs` starts a new series. */
export function addTap(taps: number[], now: number, resetAfterMs = 2000, keep = 6): number[] {
  const last = taps[taps.length - 1]
  const next = last !== undefined && now - last > resetAfterMs ? [now] : [...taps, now]
  return next.slice(-keep)
}

export function bpmFromTaps(taps: number[]): number | null {
  if (taps.length < 2) return null
  const total = taps[taps.length - 1] - taps[0]
  return clampBpm(60000 / (total / (taps.length - 1)))
}
