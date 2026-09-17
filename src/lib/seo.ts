import { categoryLabel, LEVEL_NUMBERS, LEVELS } from '../data/meta'
import { STEPS, stepsInLevel } from '../data/steps'
import type { Level, Step } from '../types'
import { soundsLabel } from './format'

// Where the built site lives. `BASE` must match `base` in vite.config.ts.
export const ORIGIN = 'https://sehyunnoh.github.io'
export const BASE = '/tap-dance/'
export const SITE_NAME = 'Tap Steps'

export const SITE_TITLE = 'Tap Steps · Tap dance steps from beginner to expert'
export const SITE_DESCRIPTION =
  'Tap dance steps from beginner to expert, grouped into 7 levels, with videos, slow motion, A–B looping, mirror view and a metronome for practice.'

/** Search engines cut descriptions off around here, so keep them shorter than this. */
const DESCRIPTION_LIMIT = 155

/** One entry of the trail shown in search results: Tap Steps › Level 3 › Shuffle. */
export interface Crumb {
  name: string
  path: string
}

/** A page to prerender: an app route plus the meta that describes it. */
export interface Page {
  /** Route path as `<Routes>` sees it, e.g. `/steps/shuffle`. */
  path: string
  title: string
  description: string
  /** Ancestors of this page, root first; empty on the root itself. */
  breadcrumb: Crumb[]
}

/** Absolute URL of a route, with the trailing slash GitHub Pages redirects to. */
export function canonical(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return ORIGIN + BASE + (clean ? `${clean}/` : '')
}

/** Trims to a whole word within the limit and keeps sentence-ending punctuation tidy. */
function shorten(text: string): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= DESCRIPTION_LIMIT) return flat
  const cut = flat.slice(0, DESCRIPTION_LIMIT - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.–—]$/, '')}…`
}

export function titleForStep(step: Step): string {
  return `${step.name} · Level ${step.level} tap dance step · ${SITE_NAME}`
}

export function titleForLevel(level: Level): string {
  return `Level ${level}: ${LEVELS[level].name} roadmap · ${SITE_NAME}`
}

/**
 * The step's own description when it has one; otherwise the facts the page does show,
 * so every step still gets a useful search snippet.
 */
export function descriptionForStep(step: Step): string {
  if (step.description) return shorten(step.description)
  const facts = [`Level ${step.level} ${LEVELS[step.level].name.toLowerCase()}`, categoryLabel(step.category).toLowerCase()]
  if (step.sounds !== undefined) facts.push(soundsLabel(step.sounds))
  const videos = step.videos.length > 0 ? ` ${step.videos.length} video${step.videos.length === 1 ? '' : 's'} to slow down, loop and mirror.` : ''
  return shorten(`${step.name} — a tap dance step. ${facts.join(' · ')}.${videos}`)
}

const ROOT_CRUMB: Crumb = { name: SITE_NAME, path: '/' }

function levelPage(level: Level): Page {
  const { name } = LEVELS[level]
  const steps = stepsInLevel(level)
  const essential = steps.filter((s) => s.essential).length
  return {
    path: `/roadmap/${level}`,
    title: titleForLevel(level),
    description: shorten(
      `The Level ${level} (${name}) tap dance roadmap: ${steps.length} steps, ${essential} of them essential, laid out in the order they build on each other.`,
    ),
    breadcrumb: [ROOT_CRUMB],
  }
}

function stepPage(step: Step): Page {
  return {
    path: `/steps/${step.id}`,
    title: titleForStep(step),
    description: descriptionForStep(step),
    breadcrumb: [ROOT_CRUMB, { name: `Level ${step.level}: ${LEVELS[step.level].name}`, path: `/roadmap/${step.level}` }],
  }
}

/** Every route the site has, in sitemap order. */
export function pages(): Page[] {
  return [
    { path: '/', title: SITE_TITLE, description: SITE_DESCRIPTION, breadcrumb: [] },
    {
      path: '/roadmap',
      title: `Learning roadmap · ${SITE_NAME}`,
      description: shorten(
        `A tap dance learning roadmap: ${STEPS.length} steps across 7 levels, each one placed after the steps it builds on, with your own progress marked.`,
      ),
      breadcrumb: [ROOT_CRUMB],
    },
    ...LEVEL_NUMBERS.map(levelPage),
    ...STEPS.map(stepPage),
  ]
}
