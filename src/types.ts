export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type Category = 'basic' | 'combination' | 'rolls-riffs' | 'time-steps' | 'air' | 'turns' | 'classic'

export type VideoType = 'tutorial' | 'demo' | 'routine'

export interface Video {
  youtubeId: string
  title: string
  channel: string
  type: VideoType
  /** Suggested practice loop in seconds. */
  loop?: { start: number; end: number }
}

/** One sound of a step and the count it falls on. */
export interface CountBeat {
  sound: string
  beat: string
}

export interface Step {
  id: string
  name: string
  aliases: string[]
  level: Level
  essential: boolean
  category: Category
  sounds?: number
  breakdown?: string[]
  count?: CountBeat[]
  bpm?: { slow: number; normal: number }
  description?: string
  tips?: string[]
  trivia?: string
  prerequisites?: string[]
  nextSteps?: string[]
  videos: Video[]
}
