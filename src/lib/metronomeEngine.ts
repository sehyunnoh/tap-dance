// Web Audio metronome using look-ahead scheduling, so clicks stay on time even
// when the main thread is busy (e.g. while a video is playing).

type ClickKind = 'accent' | 'beat' | 'off'

const LOOKAHEAD_S = 0.12
const TIMER_MS = 25
const BEATS_PER_BAR = 4

export class MetronomeEngine {
  bpm = 80
  /** Called on every click, timed to when it is heard. `beat` is 0–3, `off` marks the "&". */
  onClick: (beat: number, off: boolean) => void = () => {}

  private ctx: AudioContext | null = null
  private timer: number | null = null
  private nextTime = 0
  private tick = 0
  private eighths = false

  get running(): boolean {
    return this.timer !== null
  }

  start(): void {
    this.ctx ??= new AudioContext()
    void this.ctx.resume()
    this.tick = 0
    this.nextTime = this.ctx.currentTime + 0.06
    this.schedule()
    this.timer = window.setInterval(() => this.schedule(), TIMER_MS)
  }

  stop(): void {
    if (this.timer !== null) window.clearInterval(this.timer)
    this.timer = null
  }

  setEighths(on: boolean): void {
    if (on === this.eighths) return
    const beat = Math.ceil(this.tick / (this.eighths ? 2 : 1))
    this.eighths = on
    this.tick = (beat % BEATS_PER_BAR) * (on ? 2 : 1)
  }

  private schedule(): void {
    const ctx = this.ctx
    if (!ctx) return
    const subdivisions = this.eighths ? 2 : 1
    while (this.nextTime < ctx.currentTime + LOOKAHEAD_S) {
      const beat = Math.floor(this.tick / subdivisions)
      const off = this.tick % subdivisions !== 0
      this.click(this.nextTime, off ? 'off' : beat === 0 ? 'accent' : 'beat')
      const delay = Math.max(0, (this.nextTime - ctx.currentTime) * 1000)
      window.setTimeout(() => this.onClick(beat, off), delay)
      this.nextTime += 60 / this.bpm / subdivisions
      this.tick = (this.tick + 1) % (BEATS_PER_BAR * subdivisions)
    }
  }

  private click(time: number, kind: ClickKind): void {
    const ctx = this.ctx
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = kind === 'accent' ? 1600 : kind === 'beat' ? 1100 : 800
    const peak = kind === 'off' ? 0.25 : 0.6
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(peak, time + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
    osc.connect(gain).connect(ctx.destination)
    osc.start(time)
    osc.stop(time + 0.06)
  }
}
