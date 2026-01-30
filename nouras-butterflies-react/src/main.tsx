import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppFallback } from '@/components/AppFallback';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { initializeCSRFProtection, cleanupCSRFProtection } from '@/utils/csrf';
import { initializeHTTPInterceptor, cleanupHTTPInterceptor } from '@/utils/httpInterceptor';
import { initializeRateLimiting, cleanupRateLimiting } from '@/utils/rateLimiter';
import { initializeSecureStorage, cleanupSecureStorage } from '@/utils/secureStorage';
import { initPerformanceMonitoring } from '@/utils/performance';
import { startPerformanceMonitoring } from '@/services/performanceMonitoring';
import './index.css';
import App from './App.tsx';

console.log("[App] Starting Noura's Butterflies application...");
console.log('[App] Build mode:', import.meta.env.MODE);
console.log('[App] Dev mode:', import.meta.env.DEV);
console.log('[App] Prod mode:', import.meta.env.PROD);

// Update environment info in loading screen
const updateEnvironmentInfo = () => {
  const envInfo = document.getElementById('environment-info');
  if (envInfo) {
    envInfo.textContent = `Environment: ${import.meta.env.MODE} | Dev: ${import.meta.env.DEV}`;
  }
};

updateEnvironmentInfo();

// Initialize GTM
if (import.meta.env['VITE_GTM_ID']) {
  // Initialize GTM dataLayer
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });
  
  // Load GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${import.meta.env['VITE_GTM_ID']}`;
  document.head.appendChild(script);
  
  console.log('[App] GTM initialized with ID:', import.meta.env['VITE_GTM_ID']);
} else {
  console.log('[App] GTM ID not found, skipping initialization');
}

// Initialize Sentry
if (import.meta.env['VITE_SENTRY_DSN']) {
  Sentry.init({
    dsn: import.meta.env['VITE_SENTRY_DSN'],
    environment: import.meta.env['VITE_SENTRY_ENVIRONMENT'] || 'production',
    release: import.meta.env['VITE_SENTRY_RELEASE'] || '1.0.0',
    tracesSampleRate: 1.0,
  });
  console.log('[App] Sentry initialized');
} else {
  console.log('[App] Sentry DSN not found, skipping initialization');
}

// Hide loading screen
const hideLoadingScreen = () => {
  const loading = document.getElementById('i18n-loading');
  if (loading) {
    loading.style.display = 'none';
  }
};

// Show loading error
const showLoadingError = (error?: Error) => {
  const loading = document.getElementById('i18n-loading');
  if (loading) {
    const progressBar = document.getElementById('progress-bar');
    const countdownEl = document.getElementById('countdown');
    const loadingStatus = document.getElementById('loading-status');
    const errorInfo = document.getElementById('error-info');

    if (progressBar) progressBar.style.display = 'none';
    if (countdownEl) countdownEl.style.display = 'none';
    if (loadingStatus) loadingStatus.textContent = 'Error detected during loading';
    if (errorInfo) errorInfo.style.display = 'block';

    const loadingText = loading.querySelector('div:nth-child(2)');
    if (loadingText) loadingText.textContent = 'App Failed to Load';

    if (error) {
      console.error('[App] Loading error details:', error.message);
    }
  }
};

// Render timeout detection
const renderTimeout = setTimeout(() => {
  console.error('[App] App render timeout detected');
  showLoadingError();
}, 30000); // 30 seconds timeout

// Test localStorage availability
const testLocalStorage = () => {
  try {
    const testKey = '__noura_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    console.log('[App] localStorage is available');
    return true;
  } catch (error) {
    console.error('[App] localStorage is not available:', error);
    return false;
  }
};

// Initialize application
const startApp = async () => {
  try {
    console.log('[App] Initializing application...');

    // Initialize security systems first
    console.log('[App] Initializing security systems...');
    initializeSecureStorage();
    initializeCSRFProtection();
    initializeHTTPInterceptor();
    initializeRateLimiting();
    console.log('[App] Security systems initialized');

    // Initialize performance monitoring
    console.log('[App] Initializing performance monitoring...');
    if (typeof window !== 'undefined' && import.meta.env['VITE_ENABLE_ANALYTICS']) {
      initPerformanceMonitoring();
      startPerformanceMonitoring();
      console.log('[App] Performance monitoring initialized');
    } else {
      console.log('[App] Performance monitoring disabled or window not available');
    }

    // Test localStorage
    const localStorageAvailable = testLocalStorage();
    if (!localStorageAvailable) {
      console.warn('[App] localStorage not available, some features may be limited');
    }

    console.log('[App] Creating React root...');
    const root = createRoot(document.getElementById('root')!);

    console.log('[App] Starting React render...');
    root.render(
      <StrictMode>
        <ErrorBoundary fallback={<AppFallback error="Failed to initialize the application" />}>
          <HelmetProvider>
            <LanguageProvider>
              <ThemeProvider>
                <CartProvider>
                  <AuthProvider>
                    <App />
                  </AuthProvider>
                </CartProvider>
              </ThemeProvider>
            </LanguageProvider>
          </HelmetProvider>
        </ErrorBoundary>
      </StrictMode>
    );

    console.log('[App] React app rendered successfully');
    clearTimeout(renderTimeout);
    hideLoadingScreen();
  } catch (error) {
    console.error('[App] App initialization failed:', error);
    clearTimeout(renderTimeout);
    showLoadingError(error instanceof Error ? error : new Error('Unknown error'));
  }
};

// Start the application
startApp();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  console.log('[App] Cleaning up security systems...');
  cleanupCSRFProtection();
  cleanupHTTPInterceptor();
  cleanupRateLimiting();
  cleanupSecureStorage();
});

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('[App] Global error:', event.error);
  showLoadingError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[App] Unhandled promise rejection:', event.reason);
  showLoadingError(new Error(event.reason?.message || 'Promise rejected'));
});

console.log('[App] Application initialization started');
