// Centralized Analytics Utility for Noura's Butterflies
// Provides comprehensive event tracking, validation, and consent management

import { env } from './env';
import { logger } from './logger';

// Analytics event types
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId?: string;
  userId?: string;
}

// Analytics configuration
interface AnalyticsConfig {
  enableDebugging: boolean;
  sampleRate: number;
  consentRequired: boolean;
  batchSize: number;
  flushInterval: number;
  maxRetries: number;
  endpoint: string;
}

// User consent types
export type ConsentType = 'analytics' | 'marketing' | 'functional' | 'all';

// Default configuration
const DEFAULT_CONFIG: AnalyticsConfig = {
  enableDebugging: env.isDevelopment,
  sampleRate: 1.0, // 100% in development, 10% in production
  consentRequired: true,
  batchSize: 20,
  flushInterval: 10000, // 10 seconds
  maxRetries: 3,
  endpoint: `${env.apiBaseUrl}/analytics/events`,
};

class AnalyticsManager {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private consent: Partial<Record<ConsentType, boolean>> = {};
  private sessionId: string;
  private userId?: string;
  private isOnline: boolean = navigator.onLine;
  private retryCount: number = 0;
  private flushTimer?: number;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
    this.setupConnectivityTracking();
    this.setupPeriodicFlush();
    
    // Adjust sample rate for production
    if (env.isProduction) {
      this.config.sampleRate = 0.1; // 10% sampling in production
    }
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Setup connectivity tracking
  private setupConnectivityTracking(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushEvents(); // Flush queued events when back online
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Setup periodic flush
  private setupPeriodicFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flushTimer = setInterval(() => {
      if (this.isOnline && this.eventQueue.length > 0) {
        this.flushEvents();
      }
    }, this.config.flushInterval);
  }

  // Validate event data
  private validateEvent(event: Partial<AnalyticsEvent>): string[] {
    const errors: string[] = [];
    
    if (!event.category || typeof event.category !== 'string') {
      errors.push('Category is required and must be a string');
    }
    
    if (!event.action || typeof event.action !== 'string') {
      errors.push('Action is required and must be a string');
    }
    
    if (event.value !== undefined && (typeof event.value !== 'number' || isNaN(event.value))) {
      errors.push('Value must be a valid number');
    }
    
    if (event.properties && typeof event.properties !== 'object') {
      errors.push('Properties must be an object');
    }
    
    return errors;
  }

  // Sanitize event data
  private sanitizeEvent(event: Partial<AnalyticsEvent>): AnalyticsEvent {
    return {
      category: String(event.category || 'unknown').toLowerCase().trim(),
      action: String(event.action || 'unknown').toLowerCase().trim(),
      label: event.label ? String(event.label).trim() : undefined,
      value: event.value !== undefined ? Number(event.value) : undefined,
      properties: event.properties ? this.sanitizeProperties(event.properties) : {},
      timestamp: event.timestamp || Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
  }

  // Sanitize properties object
  private sanitizeProperties(properties: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(properties)) {
      // Remove sensitive data
      if (this.isSensitiveKey(key)) {
        continue;
      }
      
      // Sanitize key
      const sanitizedKey = String(key).toLowerCase().replace(/[^a-z0-9_]/g, '_');
      
      // Sanitize value
      if (typeof value === 'string') {
        sanitized[sanitizedKey] = value.substring(0, 500); // Limit string length
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[sanitizedKey] = value;
      } else if (Array.isArray(value)) {
        sanitized[sanitizedKey] = value.slice(0, 10); // Limit array size
      } else if (typeof value === 'object' && value !== null) {
        sanitized[sanitizedKey] = JSON.stringify(value).substring(0, 200);
      }
    }
    
    return sanitized;
  }

  // Check if key contains sensitive information
  private isSensitiveKey(key: string): boolean {
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /secret/i,
      /key/i,
      /auth/i,
      /session/i,
      /credit/i,
      /card/i,
      /ssn/i,
      /social/i,
      /phone/i,
      /email/i,
      /address/i,
    ];
    
    return sensitivePatterns.some(pattern => pattern.test(key));
  }

  // Check if sampling should apply
  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  // Check consent for event type
  private hasConsent(category: string): boolean {
    if (!this.config.consentRequired) {
      return true;
    }
    
    // Map categories to consent types
    const consentMapping: Record<string, ConsentType> = {
      'cart': 'analytics',
      'checkout': 'analytics',
      'auth': 'functional',
      'product': 'analytics',
      'search': 'analytics',
      'error': 'functional',
    };
    
    const requiredConsent = consentMapping[category] || 'analytics';
    return this.consent[requiredConsent] === true || this.consent['all'] === true;
  }

  // Track analytics event
  public track(
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ): void {
    try {
      // Check consent
      if (!this.hasConsent(category)) {
        if (this.config.enableDebugging) {
          logger.debug('[Analytics] Event blocked due to consent:', { category, action });
        }
        return;
      }
      
      // Check sampling
      if (!this.shouldSample()) {
        return;
      }
      
      // Create event
      const event: Partial<AnalyticsEvent> = {
        category,
        action,
        label,
        value,
        properties,
        timestamp: Date.now(),
      };
      
      // Validate event
      const errors = this.validateEvent(event);
      if (errors.length > 0) {
        logger.error('[Analytics] Event validation failed:', { event, errors });
        return;
      }
      
      // Sanitize event
      const sanitizedEvent = this.sanitizeEvent(event);
      
      // Add to queue
      this.eventQueue.push(sanitizedEvent);
      
      // Debug logging
      if (this.config.enableDebugging) {
        logger.debug('[Analytics] Event tracked:', sanitizedEvent);
      }
      
      // Flush if queue is full
      if (this.eventQueue.length >= this.config.batchSize) {
        this.flushEvents();
      }
    } catch (error) {
      logger.error('[Analytics] Failed to track event:', error);
    }
  }

  // Track page view
  public trackPage(path: string, title?: string, properties?: Record<string, any>): void {
    this.track('pageview', 'view', path, undefined, {
      title,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      ...properties,
    });
  }

  // Track user interaction
  public trackInteraction(
    element: string,
    action: string,
    properties?: Record<string, any>
  ): void {
    this.track('interaction', action, element, undefined, properties);
  }

  // Track error
  public trackError(
    error: Error,
    context?: string,
    properties?: Record<string, any>
  ): void {
    this.track('error', 'occurred', context, undefined, {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 1000), // Limit stack trace
      ...properties,
    });
  }

  // Track performance metric
  public trackPerformance(
    name: string,
    value: number,
    properties?: Record<string, any>
  ): void {
    this.track('performance', 'metric', name, value, properties);
  }

  // Flush events to server
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0 || !this.isOnline) {
      return;
    }
    
    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
          'X-User-ID': this.userId || 'anonymous',
        },
        body: JSON.stringify({
          events: eventsToSend,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
        keepalive: true,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      this.retryCount = 0;
      
      if (this.config.enableDebugging) {
        logger.debug(`[Analytics] Sent ${eventsToSend.length} events successfully`);
      }
    } catch (error) {
      logger.error('[Analytics] Failed to send events:', error);
      
      // Add events back to queue for retry
      this.eventQueue.unshift(...eventsToSend);
      
      // Exponential backoff retry
      if (this.retryCount < this.config.maxRetries) {
        this.retryCount++;
        const delay = Math.pow(2, this.retryCount) * 1000;
        setTimeout(() => this.flushEvents(), delay);
      }
    }
  }

  // Set user ID
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  // Set consent
  public setConsent(consentType: ConsentType, granted: boolean): void {
    this.consent[consentType] = granted;
    
    if (this.config.enableDebugging) {
      logger.debug('[Analytics] Consent updated:', { consentType, granted });
    }
  }

  // Set multiple consents
  public setConsents(consents: Partial<Record<ConsentType, boolean>>): void {
    Object.assign(this.consent, consents);
    
    if (this.config.enableDebugging) {
      logger.debug('[Analytics] Multiple consents updated:', consents);
    }
  }

  // Get current consent
  public getConsent(): Partial<Record<ConsentType, boolean>> {
    return { ...this.consent };
  }

  // Reset session
  public resetSession(): void {
    this.sessionId = this.generateSessionId();
    this.eventQueue = [];
    this.retryCount = 0;
    
    if (this.config.enableDebugging) {
      logger.debug('[Analytics] Session reset:', { sessionId: this.sessionId });
    }
  }

  // Enable/disable debugging
  public setDebugging(enabled: boolean): void {
    this.config.enableDebugging = enabled;
  }

  // Force flush all events
  public async forceFlush(): Promise<void> {
    await this.flushEvents();
  }

  // Get queue size
  public getQueueSize(): number {
    return this.eventQueue.length;
  }

  // Cleanup
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.forceFlush();
  }
}

// Create singleton instance
export const analytics = new AnalyticsManager();

// Export convenience functions
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  properties?: Record<string, any>
): void => {
  analytics.track(category, action, label, value, properties);
};

export const trackPageView = (
  path: string,
  title?: string,
  properties?: Record<string, any>
): void => {
  analytics.trackPage(path, title, properties);
};

export const trackInteraction = (
  element: string,
  action: string,
  properties?: Record<string, any>
): void => {
  analytics.trackInteraction(element, action, properties);
};

export const trackError = (
  error: Error,
  context?: string,
  properties?: Record<string, any>
): void => {
  analytics.trackError(error, context, properties);
};

export const trackPerformance = (
  name: string,
  value: number,
  properties?: Record<string, any>
): void => {
  analytics.trackPerformance(name, value, properties);
};

export const setUserId = (userId: string): void => {
  analytics.setUserId(userId);
};

export const setConsent = (consentType: ConsentType, granted: boolean): void => {
  analytics.setConsent(consentType, granted);
};

export const setConsents = (consents: Partial<Record<ConsentType, boolean>>): void => {
  analytics.setConsents(consents);
};

export const resetSession = (): void => {
  analytics.resetSession();
};

export const forceFlushAnalytics = (): Promise<void> => {
  return analytics.forceFlush();
};

// Export types
export type { AnalyticsConfig };
