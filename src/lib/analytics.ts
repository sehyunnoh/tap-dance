type EventData = Record<string, string | number | boolean>

type CountVars = { path: string; title?: string; event?: boolean }

declare global {
  interface Window {
    goatcounter?: { no_onload?: boolean; count?: (vars: CountVars) => void }
  }
}

const SITE_HOST = 'sehyunnoh.github.io'

// A pageview requested before count.js finished loading.
let pendingPath: string | null = null

function send(vars: CountVars): boolean {
  try {
    const count = window.goatcounter?.count
    if (!count) return false
    count(vars)
    return true
  } catch {
    // Analytics must never break the app (blocked scripts, etc.).
    return true
  }
}

/** Loads GoatCounter only on the deployed site and only when a site code is configured. */
export function initAnalytics(): void {
  const code = import.meta.env.VITE_GOATCOUNTER_CODE
  if (!code || location.hostname !== SITE_HOST) return
  // The default pageview ignores the hash route, so pageviews are sent by `pageview()` instead.
  window.goatcounter = { no_onload: true }
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://gc.zgo.at/count.js'
  script.dataset.goatcounter = `https://${code}.goatcounter.com/count`
  script.addEventListener('load', () => {
    if (pendingPath) send({ path: pendingPath })
    pendingPath = null
  })
  document.head.appendChild(script)
}

/** Counts the current route, e.g. `/tap-dance/#/steps/maxie-ford`. */
export function pageview(): void {
  const path = location.pathname + location.search + location.hash
  if (!send({ path })) pendingPath = path
}

/**
 * GoatCounter events have only a name (path) and a title, and the dashboard groups by path,
 * so the details go into the path: `speed-change · rate=0.5`.
 */
export function track(event: string, data?: EventData): void {
  const details = data ? Object.entries(data).map(([key, value]) => `${key}=${value}`) : []
  send({ path: [event, ...details].join(' · '), event: true })
}
