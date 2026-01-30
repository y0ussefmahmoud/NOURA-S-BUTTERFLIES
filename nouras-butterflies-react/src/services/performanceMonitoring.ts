// Performance Monitoring Service for Noura's Butterflies
// Provides real-time performance metrics collection and analysis

import { env } from '../utils/env';
import { logger } from '../utils/logger';
import { trackEvent } from '../utils/performance';

// Performance metric types
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
  deviceInfo: DeviceInfo;
  sessionId: string;
  userId?: string;
}

export interface DeviceInfo {
  screenResolution: string;
  viewportSize: string;
  deviceMemory?: number;
  hardwareConcurrency: number;
  connectionType?: string;
  effectiveType?: string;
  platform: string;
}

export interface PerformanceScore {
  overall: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  inp: number;
  timestamp: number;
}

export interface PerformanceThresholds {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fcp: number; // First Contentful Paint
  inp: number; // Interaction to Next Paint
}

// Performance thresholds based on Web Vitals standards
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: 2500, // Good: <2.5s, Needs Improvement: 2.5s-4s, Poor: >4s
  fid: 100,  // Good: <100ms, Needs Improvement: 100-300ms, Poor: >300ms
  cls: 0.1,  // Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25
  ttfb: 800, // Good: <800ms, Needs Improvement: 800-1800ms, Poor: >1800ms
  fcp: 1800, // Good: <1.8s, Needs Improvement: 1.8-3s, Poor: >3s
  inp: 200,  // Good: <200ms, Needs Improvement: 200-500ms, Poor: >500ms
};

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private thresholds: PerformanceThresholds;
  private sessionId: string;
  private userId?: string;
  private isMonitoring: boolean = false;
  private observers: PerformanceObserver[] = [];
  private scoreHistory: PerformanceScore[] = [];
  private customMarks: Map<string, number> = new Map();

  constructor(thresholds: Partial<PerformanceThresholds> = {}) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    this.sessionId = this.generateSessionId();
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get device information
  private getDeviceInfo(): DeviceInfo {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    return {
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      connectionType: connection?.effectiveType,
      effectiveType: connection?.effectiveType,
      platform: navigator.platform,
    };
  }

  // Calculate performance score for a single metric
  private calculateMetricScore(metricName: string, value: number): number {
    const threshold = this.thresholds[metricName as keyof PerformanceThresholds];
    if (!threshold) return 100;

    if (value <= threshold) {
      return 100; // Good
    } else if (value <= threshold * 2) {
      // Needs improvement - linear degradation
      return 100 - ((value - threshold) / threshold) * 50;
    } else {
      // Poor - minimum score
      return Math.max(0, 50 - ((value - threshold * 2) / threshold) * 25);
    }
  }

  // Calculate overall performance score
  private calculateOverallScore(metrics: PerformanceMetric[]): PerformanceScore {
    const metricValues: Record<string, number> = {};
    
    metrics.forEach(metric => {
      metricValues[metric.name.toLowerCase()] = metric.value;
    });

    const scores: PerformanceScore = {
      overall: 0,
      lcp: this.calculateMetricScore('lcp', metricValues['lcp'] || 0),
      fid: this.calculateMetricScore('fid', metricValues['fid'] || 0),
      cls: this.calculateMetricScore('cls', metricValues['cls'] || 0),
      ttfb: this.calculateMetricScore('ttfb', metricValues['ttfb'] || 0),
      fcp: this.calculateMetricScore('fcp', metricValues['fcp'] || 0),
      inp: this.calculateMetricScore('inp', metricValues['inp'] || 0),
      timestamp: Date.now(),
    };

    // Calculate overall score (weighted average)
    const weights = {
      lcp: 0.25,
      fid: 0.20,
      cls: 0.20,
      ttfb: 0.15,
      fcp: 0.10,
      inp: 0.10,
    };

    scores.overall = Math.round(
      scores.lcp * weights.lcp +
      scores.fid * weights.fid +
      scores.cls * weights.cls +
      scores.ttfb * weights.ttfb +
      scores.fcp * weights.fcp +
      scores.inp * weights.inp
    );

    return scores;
  }

  // Record a performance metric
  private recordMetric(name: string, value: number, entries?: PerformanceEntry[]): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      deviceInfo: this.getDeviceInfo(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.metrics.push(metric);

    // Check if metric exceeds threshold
    const threshold = this.thresholds[name.toLowerCase() as keyof PerformanceThresholds];
    if (threshold && value > threshold) {
      this.handlePerformanceIssue(metric, threshold);
    }

    // Track in analytics
    trackEvent('performance', 'metric', name, value);

    // Log in development
    if (env.isDevelopment) {
      logger.debug(`[Performance] ${name}: ${value}ms`, {
        threshold,
        exceedsThreshold: value > threshold,
      });
    }
  }

  // Handle performance issues
  private handlePerformanceIssue(metric: PerformanceMetric, threshold: number): void {
    const severity = this.getIssueSeverity(metric.value, threshold);
    
    // Track performance issue
    trackEvent('performance', 'issue', metric.name, metric.value);

    // Log warning
    logger.warn(`[Performance] ${metric.name} exceeds threshold:`, {
      value: metric.value,
      threshold,
      severity,
      url: metric.url,
    });

    // Could trigger alerts here for critical issues
    if (severity === 'critical') {
      this.triggerCriticalAlert(metric);
    }
  }

  // Get issue severity
  private getIssueSeverity(value: number, threshold: number): 'minor' | 'moderate' | 'major' | 'critical' {
    const ratio = value / threshold;
    if (ratio <= 1.5) return 'minor';
    if (ratio <= 2) return 'moderate';
    if (ratio <= 3) return 'major';
    return 'critical';
  }

  // Trigger critical alert (could integrate with notification system)
  private triggerCriticalAlert(metric: PerformanceMetric): void {
    // Implementation would depend on your alerting system
    logger.error(`[Performance] CRITICAL: ${metric.name} is severely degraded:`, metric);
  }

  // Setup Core Web Vitals monitoring
  private setupWebVitalsMonitoring(): void {
    // Import web-vitals dynamically to avoid SSR issues
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB, getINP }) => {
      getCLS((metric) => this.recordMetric('CLS', metric.value, metric.entries));
      getFID((metric) => this.recordMetric('FID', metric.value, metric.entries));
      getFCP((metric) => this.recordMetric('FCP', metric.value, metric.entries));
      getLCP((metric) => this.recordMetric('LCP', metric.value, metric.entries));
      getTTFB((metric) => this.recordMetric('TTFB', metric.value, metric.entries));
      getINP((metric) => this.recordMetric('INP', metric.value, metric.entries));
    }).catch(error => {
      logger.error('[Performance] Failed to load web-vitals:', error);
    });
  }

  // Setup resource timing monitoring
  private setupResourceTimingMonitoring(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming;
            
            // Track slow resources
            if (resource.duration > 3000) {
              this.recordMetric('SlowResource', resource.duration, [resource]);
            }
            
            // Track failed resources
            if ((resource as any).transferSize === 0 && resource.name.match(/\.(js|css|png|jpg|jpeg|webp)$/i)) {
              this.recordMetric('FailedResource', resource.duration, [resource]);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      logger.debug('[Performance] Resource timing observation not supported:', error);
    }
  }

  // Setup long task monitoring
  private setupLongTaskMonitoring(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Long task threshold
            this.recordMetric('LongTask', entry.duration, [entry]);
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (error) {
      logger.debug('[Performance] Long task observation not supported:', error);
    }
  }

  // Setup navigation timing monitoring
  private setupNavigationTimingMonitoring(): void {
    if (!window.performance || !window.performance.timing) return;

    const timing = window.performance.timing;
    const navigation = window.performance.navigation;

    // Calculate navigation metrics
    const metrics = [
      { name: 'DNSLookup', value: timing.domainLookupEnd - timing.domainLookupStart },
      { name: 'TCPConnect', value: timing.connectEnd - timing.connectStart },
      { name: 'Request', value: timing.responseStart - timing.requestStart },
      { name: 'Response', value: timing.responseEnd - timing.responseStart },
      { name: 'DOMProcessing', value: timing.domComplete - timing.domLoading },
      { name: 'PageLoad', value: timing.loadEventEnd - timing.navigationStart },
    ];

    metrics.forEach(metric => {
      if (metric.value > 0) {
        this.recordMetric(metric.name, metric.value);
      }
    });
  }

  // Start performance monitoring
  public start(): void {
    if (this.isMonitoring) {
      logger.warn('[Performance] Monitoring already started');
      return;
    }

    this.isMonitoring = true;
    logger.info('[Performance] Starting monitoring...');

    // Setup various monitoring observers
    this.setupWebVitalsMonitoring();
    this.setupResourceTimingMonitoring();
    this.setupLongTaskMonitoring();
    this.setupNavigationTimingMonitoring();

    // Start periodic score calculation
    this.startScoreCalculation();
  }

  // Stop performance monitoring
  public stop(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    logger.info('[Performance] Monitoring stopped');
  }

  // Start periodic score calculation
  private startScoreCalculation(): void {
    setInterval(() => {
      if (this.metrics.length > 0) {
        const recentMetrics = this.metrics.slice(-50); // Last 50 metrics
        const score = this.calculateOverallScore(recentMetrics);
        this.scoreHistory.push(score);
        
        // Keep only last 100 scores
        if (this.scoreHistory.length > 100) {
          this.scoreHistory.shift();
        }
        
        // Track score
        trackEvent('performance', 'score', 'overall', score.overall);
      }
    }, 30000); // Every 30 seconds
  }

  // Add custom performance mark
  public mark(name: string): void {
    const timestamp = performance.now();
    this.customMarks.set(name, timestamp);
    
    if (env.isDevelopment) {
      logger.debug(`[Performance] Mark: ${name} at ${timestamp}ms`);
    }
  }

  // Measure time between marks
  public measure(name: string, startMark: string, endMark?: string): number {
    const startTime = this.customMarks.get(startMark);
    if (!startTime) {
      logger.error(`[Performance] Start mark not found: ${startMark}`);
      return 0;
    }

    const endTime = endMark ? this.customMarks.get(endMark) : performance.now();
    if (!endTime) {
      logger.error(`[Performance] End mark not found: ${endMark}`);
      return 0;
    }

    const duration = endTime - startTime;
    this.recordMetric(`Custom_${name}`, duration);
    
    return duration;
  }

  // Get current performance score
  public getCurrentScore(): PerformanceScore | null {
    if (this.metrics.length === 0) return null;
    
    const recentMetrics = this.metrics.slice(-20); // Last 20 metrics
    return this.calculateOverallScore(recentMetrics);
  }

  // Get score history
  public getScoreHistory(): PerformanceScore[] {
    return [...this.scoreHistory];
  }

  // Get performance trends
  public getTrends(hours: number = 24): {
    average: PerformanceScore;
    trend: 'improving' | 'stable' | 'degrading';
  } | null {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    const recentScores = this.scoreHistory.filter(score => 
      score.timestamp && score.timestamp > cutoff
    );

    if (recentScores.length < 2) return null;

    const average: PerformanceScore = {
      overall: Math.round(recentScores.reduce((sum, s) => sum + s.overall, 0) / recentScores.length),
      lcp: Math.round(recentScores.reduce((sum, s) => sum + s.lcp, 0) / recentScores.length),
      fid: Math.round(recentScores.reduce((sum, s) => sum + s.fid, 0) / recentScores.length),
      cls: Math.round(recentScores.reduce((sum, s) => sum + s.cls, 0) / recentScores.length),
      ttfb: Math.round(recentScores.reduce((sum, s) => sum + s.ttfb, 0) / recentScores.length),
      fcp: Math.round(recentScores.reduce((sum, s) => sum + s.fcp, 0) / recentScores.length),
      inp: Math.round(recentScores.reduce((sum, s) => sum + s.inp, 0) / recentScores.length),
      timestamp: Date.now(),
    };

    // Calculate trend
    const recent = recentScores.slice(-5);
    const older = recentScores.slice(0, -5);
    
    if (older.length === 0) {
      return { average, trend: 'stable' };
    }

    const recentAvg = recent.reduce((sum, s) => sum + s.overall, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.overall, 0) / older.length;
    
    let trend: 'improving' | 'stable' | 'degrading';
    if (recentAvg > olderAvg + 5) {
      trend = 'improving';
    } else if (recentAvg < olderAvg - 5) {
      trend = 'degrading';
    } else {
      trend = 'stable';
    }

    return { average, trend };
  }

  // Set user ID
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  // Get metrics by type
  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  // Get all metrics
  public getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Clear metrics
  public clearMetrics(): void {
    this.metrics = [];
    this.scoreHistory = [];
    this.customMarks.clear();
  }

  // Export metrics for analysis
  public exportMetrics(): string {
    const exportData = {
      sessionId: this.sessionId,
      userId: this.userId,
      thresholds: this.thresholds,
      metrics: this.metrics,
      scoreHistory: this.scoreHistory,
      exportTime: Date.now(),
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitoringService();

// Export convenience functions
export const startPerformanceMonitoring = (): void => {
  performanceMonitor.start();
};

export const stopPerformanceMonitoring = (): void => {
  performanceMonitor.stop();
};

export const markPerformance = (name: string): void => {
  performanceMonitor.mark(name);
};

export const measurePerformance = (name: string, startMark: string, endMark?: string): number => {
  return performanceMonitor.measure(name, startMark, endMark);
};

export const getPerformanceScore = (): PerformanceScore | null => {
  return performanceMonitor.getCurrentScore();
};

export const getPerformanceTrends = (hours?: number) => {
  return performanceMonitor.getTrends(hours);
};

export const setPerformanceUserId = (userId: string): void => {
  performanceMonitor.setUserId(userId);
};
