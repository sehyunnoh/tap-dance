interface ImportMetaEnv {
  /** Umami Cloud website id. Analytics stay off when it is not set. */
  readonly VITE_UMAMI_WEBSITE_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
