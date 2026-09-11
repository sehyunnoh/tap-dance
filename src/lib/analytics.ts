type EventData = Record<string, string | number | boolean>

declare global {
  interface Window {
    umami?: { track: (event: string, data?: EventData) => void }
  }
}

/** Loads Umami only on the deployed site and only when a website id is configured. */
export function initAnalytics(): void {
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
  if (!websiteId) return
  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://cloud.umami.is/script.js'
  script.dataset.websiteId = websiteId
  script.dataset.domains = 'sehyunnoh.github.io'
  document.head.appendChild(script)
}

export function track(event: string, data?: EventData): void {
  try {
    window.umami?.track(event, data)
  } catch {
    // Analytics must never break the app (blocked scripts, etc.).
  }
}
