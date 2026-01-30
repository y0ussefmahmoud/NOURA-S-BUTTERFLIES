/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CDN_URL: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_GTM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
