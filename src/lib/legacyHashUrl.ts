/**
 * The site used hash routes (…/tap-dance/#/steps/shuffle) before switching to real paths.
 * Links and bookmarks made back then would land on the step list, so rewrite them in place
 * before the router reads the URL. `replaceState` keeps the old entry out of the history.
 */
export function redirectLegacyHashUrl(): void {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const { hash, pathname } = location
  if (!hash.startsWith('#/') || pathname.replace(/\/$/, '') !== base) return
  history.replaceState(null, '', base + hash.slice(1))
}
