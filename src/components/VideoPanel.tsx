import { useEffect, useRef, useState } from 'react'
import { track } from '../lib/analytics'
import { formatTime } from '../lib/format'
import { readStorage, writeStorage } from '../lib/storage'
import { loadYouTubeApi, thumbnailUrl, watchUrl, type YTPlayer } from '../lib/youtube'
import type { Step, Video } from '../types'
import { CloseIcon, ExpandIcon, MirrorIcon, PauseIcon, PlayIcon, RepeatIcon } from './icons'
import { Timeline } from './Timeline'
import { BUTTON, BUTTON_ON } from './ui'

const RATES = [0.25, 0.5, 0.75, 1]

const VIDEO_LABELS: Record<Video['type'], string> = {
  tutorial: 'Tutorial',
  demo: 'Demo',
  routine: 'In a routine',
}

/**
 * YouTube player with practice controls: speed, A–B loop, ±5s and mirror.
 * "Practice mode" enlarges the same player in place (the iframe is never re-created).
 */
export function VideoPanel({ step }: { step: Step }) {
  const { videos } = step
  const [index, setIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [rate, setRate] = useState(1)
  const [mirror, setMirror] = useState(() => readStorage('mirror', false))
  const [loopA, setLoopA] = useState<number | null>(null)
  const [loopB, setLoopB] = useState<number | null>(null)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)

  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  // Latest values for the player callbacks and the polling loop.
  const latest = useRef({ index, rate, loopA, loopB })
  useEffect(() => {
    latest.current = { index, rate, loopA, loopB }
  })

  const video = videos[index]

  // Create the player once the viewer presses play. YouTube replaces `target`
  // with its iframe, so React only ever owns the empty host element.
  useEffect(() => {
    const host = hostRef.current
    if (!started || !host) return
    let cancelled = false
    const target = document.createElement('div')
    host.appendChild(target)
    loadYouTubeApi().then((YT) => {
      if (cancelled) return
      playerRef.current = new YT.Player(target, {
        videoId: videos[latest.current.index].youtubeId,
        width: '100%',
        height: '100%',
        playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: ({ target: p }) => {
            p.setPlaybackRate(latest.current.rate)
            p.playVideo()
          },
          onStateChange: ({ target: p, data }) => {
            setPlaying(data === YT.PlayerState.PLAYING)
            if (data === YT.PlayerState.PLAYING) {
              setDuration(p.getDuration())
              // YouTube resets the speed when a new video loads.
              if (p.getPlaybackRate() !== latest.current.rate) p.setPlaybackRate(latest.current.rate)
            }
          },
        },
      })
    })
    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
      host.replaceChildren()
    }
  }, [started, videos])

  // Track the position and enforce the A–B loop.
  useEffect(() => {
    if (!started) return
    const timer = window.setInterval(() => {
      const p = readyPlayer()
      if (!p) return
      const t = p.getCurrentTime()
      setTime(t)
      const { loopA: a, loopB: b } = latest.current
      if (a !== null && b !== null && (t >= b || t < a - 1)) p.seekTo(a, true)
    }, 150)
    return () => window.clearInterval(timer)
  }, [started])

  useEffect(() => {
    if (!expanded) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [expanded])

  /** The player, once its API methods are available. */
  function readyPlayer(): YTPlayer | null {
    const p = playerRef.current
    return p && typeof p.getCurrentTime === 'function' ? p : null
  }

  function start() {
    if (started) return
    setStarted(true)
    track('video-play', { step: step.id, video: video.youtubeId })
  }

  function selectVideo(i: number) {
    if (i === index) return
    setIndex(i)
    setLoopA(null)
    setLoopB(null)
    setTime(0)
    setDuration(0)
    readyPlayer()?.loadVideoById(videos[i].youtubeId)
  }

  function changeRate(r: number) {
    setRate(r)
    readyPlayer()?.setPlaybackRate(r)
    track('speed-change', { rate: r })
  }

  function markA() {
    const p = readyPlayer()
    if (!p) return
    const t = p.getCurrentTime()
    setLoopA(t)
    if (loopB !== null && loopB <= t) setLoopB(null)
  }

  function markB() {
    const p = readyPlayer()
    if (!p || loopA === null) return
    const t = p.getCurrentTime()
    if (t <= loopA + 0.3) return
    setLoopB(t)
    p.seekTo(loopA, true)
    track('loop-set', { step: step.id })
  }

  function clearLoop() {
    setLoopA(null)
    setLoopB(null)
  }

  function loopSuggested() {
    if (!video.loop) return
    setLoopA(video.loop.start)
    setLoopB(video.loop.end)
    if (!started) start()
    readyPlayer()?.seekTo(video.loop.start, true)
    track('loop-set', { step: step.id, suggested: true })
  }

  function skip(seconds: number) {
    const p = readyPlayer()
    if (p) p.seekTo(Math.max(0, p.getCurrentTime() + seconds), true)
  }

  function togglePlay() {
    if (!started) return start()
    const p = readyPlayer()
    if (!p) return
    if (playing) p.pauseVideo()
    else p.playVideo()
  }

  function toggleMirror() {
    const next = !mirror
    setMirror(next)
    writeStorage('mirror', next)
    track('mirror-toggle', { on: next })
  }

  function openPractice() {
    setExpanded(true)
    track('practice-mode', { step: step.id })
  }

  const ready = started && duration > 0
  const flip = mirror ? '-scale-x-100' : ''

  const speedPicker = (big: boolean) => (
    <div role="group" aria-label="Playback speed" className="grid flex-1 grid-cols-4 overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-card">
      {RATES.map((r, i) => (
        <button
          key={r}
          type="button"
          aria-pressed={rate === r}
          onClick={() => changeRate(r)}
          className={`${big ? 'h-12 text-[15px]' : 'h-11 text-sm'} ${i > 0 ? 'border-l-[1.5px] border-ink' : ''} ${rate === r ? BUTTON_ON : ''}`}
        >
          {r}x
        </button>
      ))}
    </div>
  )

  const loopButtons = (big: boolean) => (
    <div className="grid flex-1 grid-cols-3 gap-2">
      <button type="button" disabled={!ready} onClick={markA} className={`${BUTTON} ${big ? 'h-12' : ''} ${loopA !== null ? BUTTON_ON : ''}`}>
        {loopA !== null ? `A ${formatTime(loopA)}` : 'Set A'}
      </button>
      <button
        type="button"
        disabled={!ready || loopA === null}
        onClick={markB}
        className={`${BUTTON} ${big ? 'h-12' : ''} ${loopB !== null ? BUTTON_ON : ''}`}
      >
        {loopB !== null ? `B ${formatTime(loopB)}` : 'Set B'}
      </button>
      <button type="button" disabled={loopA === null} onClick={clearLoop} className={`${BUTTON} ${big ? 'h-12' : ''}`}>
        Clear
      </button>
    </div>
  )

  return (
    <section
      aria-label="Videos"
      className={expanded ? 'fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper pb-20' : 'flex flex-col gap-3'}
    >
      {expanded && (
        <div className="flex h-14 shrink-0 items-center gap-1 pl-1 pr-3">
          <button type="button" onClick={() => setExpanded(false)} aria-label="Close practice mode" className="flex size-11 items-center justify-center">
            <CloseIcon size={22} />
          </button>
          <span className="flex-1 truncate font-hand text-2xl font-bold">{step.name}</span>
          <span className="text-xs text-muted">
            Practice mode · Video {index + 1} / {videos.length}
          </span>
        </div>
      )}
      {!expanded && (
        <div className="flex items-center justify-between">
          <span className="text-xs tracking-wide text-muted">
            Video {index + 1} / {videos.length} · {VIDEO_LABELS[video.type]}
          </span>
          <button type="button" onClick={openPractice} className="flex h-11 items-center gap-1 text-[13px] underline">
            <ExpandIcon size={16} />
            Practice mode
          </button>
        </div>
      )}

      <div className={expanded ? 'shrink-0 border-y-[1.5px] border-ink bg-fill' : ''}>
        <div
          className={`relative aspect-video overflow-hidden bg-fill ${
            expanded ? 'mx-auto w-full max-w-[calc(62dvh*16/9)]' : 'rounded-[10px] border-[1.5px] border-ink'
          }`}
        >
          <div ref={hostRef} className={`absolute inset-0 [&>iframe]:size-full ${flip}`} />
          {!started && (
            <button type="button" onClick={start} aria-label={`Play video: ${video.title}`} className="absolute inset-0 flex items-center justify-center">
              <img src={thumbnailUrl(video.youtubeId)} alt="" className={`absolute inset-0 size-full object-cover ${flip}`} />
              <span className="relative flex size-[60px] items-center justify-center rounded-full bg-ink text-paper">
                <PlayIcon size={24} />
              </span>
            </button>
          )}
          {mirror && (
            <span className="pointer-events-none absolute left-2.5 top-2.5 flex h-[26px] items-center gap-1.5 rounded-full bg-ink px-2.5 text-xs text-paper">
              <MirrorIcon size={14} />
              Mirror on
            </span>
          )}
          {rate !== 1 && (
            <span className="pointer-events-none absolute right-2.5 top-2.5 flex h-[26px] items-center rounded-full border-[1.2px] border-ink bg-card px-2.5 text-xs">
              {rate}x
            </span>
          )}
        </div>
      </div>

      <div className={expanded ? 'flex flex-col gap-[18px] px-4 pt-3 lg:mx-auto lg:w-full lg:max-w-2xl' : 'flex flex-col gap-3'}>
        <a href={watchUrl(video.youtubeId)} target="_blank" rel="noreferrer" className="text-[13px] text-muted hover:underline">
          {video.title} · {video.channel}
        </a>

        {started && <Timeline time={time} duration={duration} loopA={loopA} loopB={loopB} onSeek={(s) => readyPlayer()?.seekTo(s, true)} />}

        {videos.length > 1 && (
          <div className="grid grid-cols-3 gap-2">
            {videos.map((v, i) => (
              <button key={v.youtubeId} type="button" onClick={() => selectVideo(i)} aria-pressed={i === index} className="flex flex-col gap-1 text-left">
                <img
                  src={thumbnailUrl(v.youtubeId, 'mqdefault')}
                  alt=""
                  className={`aspect-video w-full rounded-lg bg-fill object-cover ${i === index ? 'border-[2.5px] border-ink' : 'border-[1.5px] border-chip'}`}
                />
                <span className={`text-xs ${i === index ? 'font-bold' : 'text-muted'}`}>{VIDEO_LABELS[v.type]}</span>
              </button>
            ))}
          </div>
        )}

        {expanded ? (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-wide text-muted">Speed</span>
              {speedPicker(true)}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-wide text-muted">A–B loop</span>
              {loopButtons(true)}
            </div>
            <div className="flex items-center justify-center gap-7 py-1">
              <button type="button" disabled={!ready} onClick={() => skip(-5)} className="size-[60px] rounded-full border-[1.5px] border-ink bg-card text-[15px] disabled:border-line-2 disabled:text-faint">
                −5s
              </button>
              <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className="flex size-[76px] items-center justify-center rounded-full bg-ink text-paper">
                {playing ? <PauseIcon size={28} /> : <PlayIcon size={30} />}
              </button>
              <button type="button" disabled={!ready} onClick={() => skip(5)} className="size-[60px] rounded-full border-[1.5px] border-ink bg-card text-[15px] disabled:border-line-2 disabled:text-faint">
                +5s
              </button>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={mirror}
              onClick={toggleMirror}
              className="flex h-[52px] items-center gap-3 rounded-[10px] border-[1.5px] border-ink bg-card px-3.5 text-left"
            >
              <MirrorIcon />
              <span className="flex-1 text-[15px]">Mirror</span>
              <span className={`relative h-7 w-12 rounded-full ${mirror ? 'bg-ink' : 'bg-line-2'}`}>
                <span className={`absolute top-[3px] size-[22px] rounded-full bg-paper transition-all ${mirror ? 'left-[23px]' : 'left-[3px]'}`} />
              </span>
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3 rounded-xl border-[1.5px] border-dashed border-chip p-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-11 text-xs tracking-wide text-muted">Speed</span>
              {speedPicker(false)}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-11 text-xs tracking-wide text-muted">Loop</span>
              {loopButtons(false)}
            </div>
            {video.loop && (
              <button type="button" onClick={loopSuggested} className={`${BUTTON} justify-start`}>
                <RepeatIcon size={18} />
                <span>Loop the key part</span>
                <span className="ml-auto text-[13px] text-muted">
                  {formatTime(video.loop.start)} – {formatTime(video.loop.end)}
                </span>
              </button>
            )}
            <div className="grid grid-cols-3 gap-2">
              <button type="button" disabled={!ready} onClick={() => skip(-5)} className={BUTTON}>
                −5s
              </button>
              <button type="button" disabled={!ready} onClick={() => skip(5)} className={BUTTON}>
                +5s
              </button>
              <button type="button" aria-pressed={mirror} onClick={toggleMirror} className={`${BUTTON} ${mirror ? BUTTON_ON : ''}`}>
                <MirrorIcon size={18} />
                Mirror
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
