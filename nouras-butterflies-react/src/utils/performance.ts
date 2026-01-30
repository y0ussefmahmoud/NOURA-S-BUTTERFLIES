import { getCLS, getFID, getFCP, getLCP, getTTFB, getINP } from 'web-vitals';
import { env } from './env';
import { logger } from './logger';

// Performance metric type
interface Metric {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

// Device information for context
interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  viewportSize: string;
  deviceMemory?: number;
  hardwareConcurrency: number;
  connectionType?: string;
  effectiveType?: string;
  platform: string;
}

// Performance budget thresholds
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500,
  FID: 100,
  INP: 200,
  CLS: 0.1,
  FCP: 1800,
  TTFB: 800,
  TTI: 3800,
} as const;

// Performance monitoring state
let sessionId: string;
let metricsQueue: Metric[] = [];
let isOnline = navigator.onLine;
let retryCount = 0;
const MAX_RETRIES = 3;
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds

// Generate unique session ID
const generateSessionId = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get device information
const getDeviceInfo = (): DeviceInfo => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    deviceMemory: (navigator as any).deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    connectionType: connection?.effectiveType,
    effectiveType: connection?.effectiveType,
    platform: navigator.platform,
  };
};

// Calculate performance score
const calculatePerformanceScore = (metrics: Metric[]): number => {
  let score = 100;
  
  metrics.forEach(metric => {
    const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS];
    if (threshold) {
      const ratio = metric.value / threshold;
      if (ratio > 1) {
        score -= Math.min(50, (ratio - 1) * 50);
      }
    }
  });
  
  return Math.max(0, Math.round(score));
};

// Enhanced metric reporting with device context
const reportWebVitals = (metric: Metric) => {
  if (!env.enableAnalytics) return;

  // Add device context to metric
  const enhancedMetric = {
    ...metric,
    sessionId,
    timestamp: Date.now(),
    url: window.location.href,
    deviceInfo: getDeviceInfo(),
    performanceScore: calculatePerformanceScore([metric]),
  };

  // Check if metric exceeds threshold
  const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS];
  if (threshold && metric.value > threshold) {
    logger.warn(`[Performance] ${metric.name} exceeds threshold:`, {
      value: metric.value,
      threshold,
      url: window.location.href,
    });
  }

  // In development, log to console
  if (env.isDevelopment) {
    logger.debug('[Vitals]', enhancedMetric);
    return;
  }

  // Add to queue for batching
  metricsQueue.push(enhancedMetric);
  
  // Flush if queue is full or it's a critical metric
  if (metricsQueue.length >= BATCH_SIZE || ['LCP', 'CLS', 'INP'].includes(metric.name)) {
    flushMetrics();
  }
};

// Flush metrics queue to server
const flushMetrics = async () => {
  if (metricsQueue.length === 0) return;
  
  const metricsToSend = [...metricsQueue];
  metricsQueue = [];
  
  try {
    const analyticsEndpoint = `${env.apiBaseUrl}/analytics/vitals`;
    const body = JSON.stringify({
      metrics: metricsToSend,
      sessionId,
      deviceInfo: getDeviceInfo(),
      timestamp: Date.now(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(analyticsEndpoint, body);
    } else {
      await fetch(analyticsEndpoint, {
        body,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      });
    }
    
    retryCount = 0;
    logger.debug(`[Performance] Sent ${metricsToSend.length} metrics`);
  } catch (error) {
    logger.error('[Performance] Failed to send metrics:', error);
    
    // Add metrics back to queue for retry
    metricsQueue.unshift(...metricsToSend);
    
    // Exponential backoff retry
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      const delay = Math.pow(2, retryCount) * 1000;
      setTimeout(flushMetrics, delay);
    }
  }
};

// Track resource timing
const trackResourceTiming = () => {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  resources.forEach(resource => {
    if (resource.duration > 3000) { // Track slow resources
      reportWebVitals({
        name: 'SlowResource',
        value: resource.duration,
        id: `resource-${resource.name}-${Date.now()}`,
        delta: resource.duration,
        entries: [resource],
      });
    }
  });
};

// Track long tasks
const trackLongTasks = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Long task threshold
          reportWebVitals({
            name: 'LongTask',
            value: entry.duration,
            id: `longtask-${Date.now()}`,
            delta: entry.duration,
            entries: [entry],
          });
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      logger.debug('[Performance] Long task observation not supported');
    }
  }
};

// Track memory usage
const trackMemoryUsage = () => {
  if ((performance as any).memory) {
    const memory = (performance as any).memory;
    reportWebVitals({
      name: 'MemoryUsage',
      value: memory.usedJSHeapSize,
      id: `memory-${Date.now()}`,
      delta: memory.usedJSHeapSize - memory.totalJSHeapSize,
      entries: [],
    });
  }
};

// Calculate Time to Interactive (TTI)
const calculateTTI = () => {
  const timing = window.performance.timing;
  const navigation = window.performance.navigation;
  
  if (timing && navigation.type === 0) { // Only for normal navigation
    const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    const loadComplete = timing.loadEventEnd - timing.navigationStart;
    const tti = Math.max(domContentLoaded, loadComplete);
    
    reportWebVitals({
      name: 'TTI',
      value: tti,
      id: 'tti-calculation',
      delta: tti,
      entries: [],
    });
  }
};

// Track navigation timing breakdown
const trackNavigationTiming = () => {
  const timing = window.performance.timing;
  if (!timing) return;
  
  const navigationStart = timing.navigationStart;
  
  const metrics = [
    { name: 'DNSLookup', value: timing.domainLookupEnd - timing.domainLookupStart },
    { name: 'TCPConnect', value: timing.connectEnd - timing.connectStart },
    { name: 'Request', value: timing.responseStart - timing.requestStart },
    { name: 'Response', value: timing.responseEnd - timing.responseStart },
    { name: 'DOMProcessing', value: timing.domComplete - timing.domLoading },
  ];
  
  metrics.forEach(metric => {
    if (metric.value > 0) {
      reportWebVitals({
        name: metric.name,
        value: metric.value,
        id: `nav-${metric.name.toLowerCase()}`,
        delta: metric.value,
        entries: [],
      });
    }
  });
};

// Setup online/offline tracking
const setupConnectivityTracking = () => {
  window.addEventListener('online', () => {
    isOnline = true;
    flushMetrics(); // Flush queued metrics when back online
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
  });
};

// Setup periodic flushing
const setupPeriodicFlush = () => {
  setInterval(() => {
    if (isOnline && metricsQueue.length > 0) {
      flushMetrics();
    }
  }, FLUSH_INTERVAL);
};

/**
 * Initialize Web Vitals tracking and supplemental performance measurements.
 */
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Only run in production or when explicitly enabled
  if (!env.isProduction && !env.enableAnalytics) return;

  try {
    // Initialize session ID
    sessionId = generateSessionId();
    
    // Setup connectivity and periodic flushing
    setupConnectivityTracking();
    setupPeriodicFlush();

    // Track Core Web Vitals including INP
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
    getINP(reportWebVitals);

    // Track page load time
    if ('timing' in window.performance) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;

      reportWebVitals({
        name: 'PageLoad',
        value: loadTime,
        id: 'page-load',
        delta: loadTime,
        entries: [],
      });
    }

    // Track first input delay (legacy)
    const firstInputEntry = performance.getEntriesByType(
      'first-input'
    )[0] as PerformanceEventTiming;
    if (firstInputEntry) {
      const firstInputDelay = firstInputEntry.processingStart - firstInputEntry.startTime;

      reportWebVitals({
        name: 'FirstInputDelay',
        value: firstInputDelay,
        id: 'first-input-delay',
        delta: firstInputDelay,
        entries: [firstInputEntry],
      });
    }

    // Initialize advanced tracking
    trackResourceTiming();
    trackLongTasks();
    trackMemoryUsage();
    calculateTTI();
    trackNavigationTiming();
    
    // Setup route transition tracking
    setupRouteTransitionTracking();
    
    logger.debug('[Performance] Advanced monitoring initialized');
  } catch (error) {
    logger.error('[Performance] Error initializing monitoring:', error);
  }
};

// Track route transitions
const setupRouteTransitionTracking = () => {
  let lastPath = window.location.pathname;
  let transitionStart = performance.now();
  
  const checkRouteChange = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      const transitionTime = performance.now() - transitionStart;
      
      reportWebVitals({
        name: 'RouteTransition',
        value: transitionTime,
        id: `route-${lastPath}-${currentPath}`,
        delta: transitionTime,
        entries: [],
      });
      
      lastPath = currentPath;
      transitionStart = performance.now();
    }
  };
  
  // Check for route changes every 100ms
  setInterval(checkRouteChange, 100);
};

// Public API for manual metric reporting
export const reportCustomMetric = (name: string, value: number, context?: Record<string, any>) => {
  reportWebVitals({
    name,
    value,
    id: `custom-${name}-${Date.now()}`,
    delta: value,
    entries: [],
  });
};

// Get current performance score
export const getPerformanceScore = (): number => {
  return calculatePerformanceScore(metricsQueue);
};

// Force flush metrics queue
export const flushPerformanceMetrics = () => {
  flushMetrics();
};

/**
 * Track page view events for analytics.
 */
export const trackPageView = (path: string) => {
  if (!env.enableAnalytics) return;

  const pageViewData = {
    event: 'pageview',
    page: path,
    timestamp: new Date().toISOString(),
    referrer: document.referrer,
  };

  if (env.isDevelopment) {
    logger.debug('[Analytics] Page view:', pageViewData);
    return;
  }

  // In production, send to your analytics service
  const analyticsEndpoint = `${env.apiBaseUrl}/analytics/pageview`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(analyticsEndpoint, JSON.stringify(pageViewData));
  } else {
    fetch(analyticsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageViewData),
      keepalive: true,
    }).catch((error) => logger.error('[Analytics] Page view failed:', error));
  }
};

/**
 * Track custom analytics events.
 */
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (!env.enableAnalytics) return;

  const eventData = {
    event: 'custom_event',
    category,
    action,
    label,
    value,
    timestamp: new Date().toISOString(),
  };

  // Push to GTM dataLayer
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push(eventData);
  }

  if (env.isDevelopment) {
    logger.debug('[Analytics] Custom event:', eventData);
    return;
  }

  // In production, send to your analytics service
  const analyticsEndpoint = `${env.apiBaseUrl}/analytics/event`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(analyticsEndpoint, JSON.stringify(eventData));
  } else {
    fetch(analyticsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
      keepalive: true,
    }).catch((error) => logger.error('[Analytics] Event tracking failed:', error));
  }
};

/**
 * Track runtime errors through analytics pipelines.
 */
export const trackError = (error: Error, componentStack?: string) => {
  if (!env.enableAnalytics) return;

  const errorData = {
    event: 'error',
    name: error.name,
    message: error.message,
    stack: error.stack,
    componentStack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  if (env.isDevelopment) {
    logger.error('[Analytics] Error tracked:', errorData);
    return;
  }

  // In production, send to your error tracking service
  const errorEndpoint = `${env.apiBaseUrl}/analytics/error`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(errorEndpoint, JSON.stringify(errorData));
  } else {
    fetch(errorEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData),
      keepalive: true,
    }).catch((err) => logger.error('[Analytics] Error tracking failed:', err));
  }
};
