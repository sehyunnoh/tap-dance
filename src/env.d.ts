interface ImportMetaEnv {
  /** GoatCounter site code (the `CODE` in CODE.goatcounter.com). Analytics stay off when it is not set. */
  readonly VITE_GOATCOUNTER_CODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
