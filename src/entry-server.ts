import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { AppRoutes, BASENAME } from './App'

export { pages, canonical, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, ORIGIN, BASE } from './lib/seo'

/**
 * Renders one route to HTML for scripts/prerender.mjs. Nothing here touches the browser:
 * every `window`/`localStorage` read in the app sits in an effect or behind a guard, so the
 * markup is the app's "no saved progress yet" state. The browser then renders it again from
 * scratch (see src/main.tsx) rather than hydrating it.
 */
export function render(path: string): string {
  const location = BASENAME.replace(/\/$/, '') + path
  return renderToString(createElement(StaticRouter, { basename: BASENAME, location }, createElement(AppRoutes)))
}
