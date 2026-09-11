// Minimal typings and loader for the YouTube IFrame Player API.
// https://developers.google.com/youtube/iframe_api_reference

export interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  getCurrentTime(): number
  getDuration(): number
  setPlaybackRate(rate: number): void
  getPlaybackRate(): number
  loadVideoById(videoId: string): void
  destroy(): void
}

interface YTPlayerEvent {
  target: YTPlayer
  data: number
}

interface YTPlayerOptions {
  videoId: string
  width?: string | number
  height?: string | number
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: (event: YTPlayerEvent) => void
    onStateChange?: (event: YTPlayerEvent) => void
  }
}

export interface YTNamespace {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YTNamespace> | null = null

export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  apiPromise ??= new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      if (window.YT) resolve(window.YT)
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
  return apiPromise
}

export function thumbnailUrl(videoId: string, quality: 'mqdefault' | 'hqdefault' = 'hqdefault'): string {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
}

export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}
