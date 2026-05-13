/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ORIGIN?: string;
  readonly VITE_USE_API_SHIMS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
