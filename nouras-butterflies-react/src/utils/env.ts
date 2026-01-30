export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  cdnUrl: import.meta.env.VITE_CDN_URL,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  gtmId: import.meta.env.VITE_GTM_ID,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
