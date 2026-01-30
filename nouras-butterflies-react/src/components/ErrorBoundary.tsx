import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { env } from '../utils/env';
import { logger } from '../utils/logger';
import { trackError } from '../utils/performance';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  sentryOptions?: Sentry.ErrorBoundaryOptions;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Live region for error announcements
class ErrorAnnouncer extends Component<{ message: string }> {
  private announceRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.announceError();
  }

  componentDidUpdate(prevProps: { message: string }) {
    if (prevProps.message !== this.props.message) {
      this.announceError();
    }
  }

  private announceError = () => {
    if (this.announceRef.current) {
      this.announceRef.current.textContent = this.props.message;
    }
  };

  render() {
    return (
      <div
        ref={this.announceRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        }}
      />
    );
  }
}

export class ErrorBoundary extends Component<Props, State> {
  private refreshButtonRef = React.createRef<HTMLButtonElement>();

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🦋 ErrorBoundary caught an error:');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.table({
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 200),
    });

    // Collect comprehensive diagnostic information
    const diagnostics = {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      localStorage: (() => {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return 'available';
        } catch {
          return 'unavailable';
        }
      })(),
      buildMode: import.meta.env.MODE,
      isDev: import.meta.env.DEV,
      // Enhanced context data
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit,
      } : null,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt,
      } : null,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      // Recent user actions (if available)
      recentActions: this.getRecentUserActions(),
    };
    
    console.log('[ErrorBoundary] Enhanced diagnostics:', diagnostics);

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send to Sentry for production error tracking
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      this.sendToSentry(error, errorInfo, diagnostics);
    }

    // Send to our analytics endpoint
    trackError(error, errorInfo.componentStack);

    // Focus refresh button for keyboard users
    setTimeout(() => {
      if (this.refreshButtonRef.current) {
        this.refreshButtonRef.current.focus();
      }
    }, 100);
  }

  // Send error to Sentry with enhanced context
  private sendToSentry = (error: Error, errorInfo: ErrorInfo, diagnostics: any) => {
    try {
      // Get user context from auth if available
      const userContext = this.getUserContext();
      
      // Get recent console logs
      const consoleLogs = this.getRecentConsoleLogs();
      
      // Get network request history
      const networkHistory = this.getNetworkHistory();

      Sentry.captureException(error, {
        tags: {
          component: 'ErrorBoundary',
          errorType: error.constructor.name,
          severity: this.getErrorSeverity(error),
          userAgent: navigator.userAgent.split(' ')[0],
        },
        extra: {
          componentStack: errorInfo.componentStack,
          diagnostics,
          userContext,
          consoleLogs: consoleLogs.slice(0, 20), // Last 20 logs
          networkHistory: networkHistory.slice(0, 10), // Last 10 requests
          performanceMetrics: this.getPerformanceMetrics(),
          buildInfo: {
            version: import.meta.env.VITE_APP_VERSION || 'unknown',
            mode: import.meta.env.MODE,
            timestamp: import.meta.env.VITE_BUILD_TIME || 'unknown',
          },
        },
        user: userContext,
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
          browser: {
            name: navigator.appName,
            version: navigator.appVersion,
            userAgent: navigator.userAgent,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
          },
          device: {
            type: this.getDeviceType(),
            platform: navigator.platform,
            screen: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
          },
        },
        level: this.getSentryLevel(error),
        fingerprint: this.getErrorFingerprint(error, errorInfo),
      });
      
      logger.info('[ErrorBoundary] Error sent to Sentry successfully');
    } catch (sentryError) {
      logger.error('[ErrorBoundary] Failed to send error to Sentry:', sentryError);
    }
  };

  // Get user context from auth or localStorage
  private getUserContext = () => {
    try {
      const userData = localStorage.getItem('nouras-user-data');
      if (userData) {
        const user = JSON.parse(userData);
        return {
          id: user.id,
          email: user.email,
          username: user.name,
          membership_tier: user.membershipTier,
        };
      }
    } catch (e) {
      logger.debug('[ErrorBoundary] Could not get user context:', e);
    }
    return null;
  };

  // Get recent console logs
  private getRecentConsoleLogs = () => {
    const logs: Array<{ level: string; message: string; timestamp: number }> = [];
    
    // Override console methods to capture logs (in development only)
    if (import.meta.env.DEV && !(window as any).consoleCaptured) {
      const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
      };
      
      const captureLog = (level: string) => (...args: any[]) => {
        logs.push({
          level,
          message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
          timestamp: Date.now(),
        });
        
        // Keep only last 100 logs
        if (logs.length > 100) {
          logs.shift();
        }
        
        originalConsole[level as keyof typeof originalConsole](...args);
      };
      
      console.log = captureLog('log');
      console.warn = captureLog('warn');
      console.error = captureLog('error');
      
      (window as any).consoleCaptured = true;
    }
    
    return logs;
  };

  // Get network request history
  private getNetworkHistory = () => {
    const requests: Array<{ url: string; method: string; status: number; timestamp: number }> = [];
    
    // Override fetch to capture requests
    if (!(window as any).fetchCaptured) {
      const originalFetch = window.fetch;
      
      window.fetch = async (...args) => {
        const [url, options] = args;
        const timestamp = Date.now();
        
        try {
          const response = await originalFetch(...args);
          
          requests.push({
            url: typeof url === 'string' ? url : url.toString(),
            method: options?.method || 'GET',
            status: response.status,
            timestamp,
          });
          
          // Keep only last 50 requests
          if (requests.length > 50) {
            requests.shift();
          }
          
          return response;
        } catch (error) {
          requests.push({
            url: typeof url === 'string' ? url : url.toString(),
            method: options?.method || 'GET',
            status: 0,
            timestamp,
          });
          
          throw error;
        }
      };
      
      (window as any).fetchCaptured = true;
    }
    
    return requests;
  };

  // Get performance metrics
  private getPerformanceMetrics = () => {
    if (!window.performance) return null;
    
    const timing = window.performance.timing;
    const navigation = window.performance.navigation;
    
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: timing.responseStart - timing.navigationStart,
      navigationType: navigation.type,
      redirectCount: navigation.redirectCount,
    };
  };

  // Get device type
  private getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  // Get error severity
  private getErrorSeverity = (error: Error): 'low' | 'medium' | 'high' | 'critical' => {
    const criticalErrors = ['ChunkLoadError', 'TypeError', 'ReferenceError'];
    const highErrors = ['NetworkError', 'SyntaxError'];
    
    if (criticalErrors.includes(error.constructor.name)) return 'critical';
    if (highErrors.includes(error.constructor.name)) return 'high';
    if (error.message.includes('network') || error.message.includes('fetch')) return 'medium';
    return 'low';
  };

  // Get Sentry level
  private getSentryLevel = (error: Error): Sentry.SeverityLevel => {
    const severity = this.getErrorSeverity(error);
    switch (severity) {
      case 'critical': return 'fatal';
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  // Get error fingerprint for grouping
  private getErrorFingerprint = (error: Error, errorInfo: ErrorInfo): string[] => {
    const stack = error.stack || '';
    const componentStack = errorInfo.componentStack || '';
    
    // Extract relevant parts for fingerprinting
    const errorType = error.constructor.name;
    const errorMessage = error.message.substring(0, 100);
    const stackTrace = stack.split('\n').slice(0, 5).join('\n');
    const componentTrace = componentStack.split('\n').slice(0, 3).join('\n');
    
    return [
      '{{ default }}',
      errorType,
      errorMessage,
      stackTrace,
      componentTrace,
    ];
  };

  // Get recent user actions
  private getRecentUserActions = () => {
    // This would integrate with your analytics system
    // For now, return basic interaction data
    return {
      lastClick: (window as any).lastClickTime || null,
      lastRoute: (window as any).lastRouteChange || null,
      sessionDuration: Date.now() - ((window as any).sessionStart || Date.now()),
    };
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private getErrorMessage = (): string => {
    if (!this.state.error) return 'An unexpected error occurred';

    const userFriendlyMessages: Record<string, string> = {
      ChunkLoadError:
        'Failed to load application resources. Please check your internet connection and refresh.',
      TypeError: 'A data processing error occurred. Please refresh the page.',
      NetworkError: 'Network connection failed. Please check your internet connection.',
      SyntaxError: 'Application code error. Please refresh the page.',
    };

    const errorType = this.state.error.constructor.name;
    return (
      userFriendlyMessages[errorType] || 'An unexpected error occurred. Please refresh the page.'
    );
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.getErrorMessage();

      return (
        this.props.fallback || (
          <>
            <ErrorAnnouncer message={`Error: ${errorMessage}`} />
            <div
              className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4"
              role="main"
              aria-labelledby="error-title"
              aria-describedby="error-description"
            >
              <div className="max-w-md w-full text-center">
                <div className="mb-6">
                  <span
                    className="material-symbols-rounded text-6xl text-primary"
                    aria-hidden="true"
                  >
                    error
                  </span>
                </div>
                <h1
                  id="error-title"
                  className="text-3xl font-display font-bold text-text-dark dark:text-text-light mb-4"
                >
                  🦋 Oops! Something went wrong
                </h1>
                <p id="error-description" className="text-soft-text dark:text-text-light mb-6">
                  {errorMessage}
                </p>
                <button
                  ref={this.refreshButtonRef}
                  onClick={this.handleRefresh}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Refresh page to recover from error"
                >
                  Refresh Page
                </button>

                {import.meta.env.DEV && (
                  <button
                    onClick={() => {
                      const diagnostics = {
                        error: this.state.error?.toString(),
                        stack: this.state.error?.stack,
                        componentStack: this.state.error ? 'Available in console' : 'N/A',
                        userAgent: navigator.userAgent,
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                        localStorage: (() => {
                          try {
                            localStorage.setItem('test', 'test');
                            localStorage.removeItem('test');
                            return 'available';
                          } catch {
                            return 'unavailable';
                          }
                        })(),
                        buildMode: import.meta.env.MODE,
                        isDev: import.meta.env.DEV,
                      };
                      const errorDetails = `Error Diagnostics:\n${JSON.stringify(diagnostics, null, 2)}`;
                      navigator.clipboard.writeText(errorDetails);
                      alert('Complete error diagnostics copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                    aria-label="Copy error details to clipboard"
                  >
                    📋 Copy Error Details
                  </button>
                )}

                {import.meta.env.DEV && this.state.error && (
                  <section
                    className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left text-sm"
                    aria-labelledby="dev-error-title"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2
                        id="dev-error-title"
                        className="font-semibold text-red-600 dark:text-red-400"
                      >
                        Development Mode Error Details:
                      </h2>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Environment: {import.meta.env.MODE}
                      </span>
                    </div>
                    <p className="font-mono text-red-600 dark:text-red-400 mb-2">
                      {this.state.error.toString()}
                    </p>
                    <pre className="mt-2 text-xs text-red-500 dark:text-red-300 overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </section>
                )}
              </div>
            </div>
          </>
        )
      );
    }

    return this.props.children;
  }
}

// Component-level error boundary for smaller scopes
export class ComponentErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center"
          role="alert"
          aria-live="polite"
        >
          <p className="text-red-600 dark:text-red-400">Something went wrong in this component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
