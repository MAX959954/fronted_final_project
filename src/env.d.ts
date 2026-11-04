/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of a real catalogue API. When unset, the static JSON in public/api is used. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
