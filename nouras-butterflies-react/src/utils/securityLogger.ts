/**
 * Security Logger Utilities
 * Provides comprehensive logging for security events, incidents, and monitoring
 */

// Security event types
export const SecurityEventType = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  XSS_ATTEMPT: 'xss_attempt',
  CSRF_VIOLATION: 'csrf_violation',
  SQL_INJECTION: 'sql_injection',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  DATA_BREACH: 'data_breach',
  MALICIOUS_REQUEST: 'malicious_request',
  VALIDATION_FAILURE: 'validation_failure',
  ENCRYPTION_ERROR: 'encryption_error',
  SESSION_HIJACK: 'session_hijack',
  BRUTE_FORCE: 'brute_force',
} as const;

export type SecurityEventType = (typeof SecurityEventType)[keyof typeof SecurityEventType];

// Security severity levels
export const SecuritySeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type SecuritySeverity = (typeof SecuritySeverity)[keyof typeof SecuritySeverity];

// Security event interface
interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  timestamp: number;
  message: string;
  details: Record<string, any>;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  statusCode?: number;
}

// Logger configuration
interface LoggerConfig {
  enableConsoleLogging: boolean;
  enableRemoteLogging: boolean;
  remoteEndpoint?: string;
  maxLogSize: number;
  retentionPeriod: number;
  logLevel: SecuritySeverity;
}

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
  enableConsoleLogging: true,
  enableRemoteLogging: false,
  maxLogSize: 1000,
  retentionPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
  logLevel: SecuritySeverity.LOW,
};

/**
 * Security Logger Class
 * Handles logging of security events with various severity levels
 */
export class SecurityLogger {
  private config: LoggerConfig;
  private logs: SecurityEvent[] = [];
  private logKey = 'nouras_security_logs';

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadLogs();
    this.cleanupOldLogs();
  }

  /**
   * Logs a security event
   * @param type - Event type
   * @param severity - Event severity
   * @param message - Event message
   * @param details - Additional event details
   */
  logEvent(
    type: SecurityEventType,
    severity: SecuritySeverity,
    message: string,
    details: Record<string, any> = {}
  ): void {
    const event: SecurityEvent = {
      id: this.generateEventId(),
      type,
      severity,
      timestamp: Date.now(),
      message,
      details,
      userId: this.getCurrentUserId() || undefined,
      ipAddress: this.getClientIP() || undefined,
      userAgent: navigator.userAgent,
      url: window.location.href,
      method: details.method || 'GET',
      statusCode: details.statusCode || undefined,
    };

    this.addLog(event);
  }

  /**
   * Logs failed login attempt
   * @param email - User email
   * @param reason - Failure reason
   * @param details - Additional details
   */
  logFailedLogin(email: string, reason: string, details: Record<string, any> = {}): void {
    this.logEvent(
      SecurityEventType.AUTHENTICATION,
      SecuritySeverity.HIGH,
      `Failed login attempt for email: ${email}`,
      {
        email: this.sanitizeEmail(email),
        reason,
        ...details,
      }
    );
  }

  /**
   * Logs successful login
   * @param userId - User ID
   * @param details - Additional details
   */
  logSuccessfulLogin(userId: string, details: Record<string, any> = {}): void {
    this.logEvent(
      SecurityEventType.AUTHENTICATION,
      SecuritySeverity.LOW,
      `Successful login for user: ${userId}`,
      {
        userId,
        ...details,
      }
    );
  }

  /**
   * Logs XSS attempt
   * @param input - Suspicious input
   * @param location - Where the attempt was detected
   * @param details - Additional details
   */
  logXSSAttempt(input: string, location: string, details: Record<string, any> = {}): void {
    this.logEvent(
      SecurityEventType.XSS_ATTEMPT,
      SecuritySeverity.HIGH,
      `XSS attempt detected at: ${location}`,
      {
        input: this.sanitizeInput(input),
        location,
        ...details,
      }
    );
  }

  /**
   * Logs CSRF violation
   * @param details - Violation details
   */
  logCSRFViolation(details: Record<string, any> = {}): void {
    this.logEvent(
      SecurityEventType.CSRF_VIOLATION,
      SecuritySeverity.HIGH,
      'CSRF token validation failed',
      details
    );
  }

  /**
   * Logs SQL injection attempt
   * @param input - Suspicious input
   * @param location - Where the attempt was detected
   * @param details - Additional details
   */
  logSQLInjection(input: string, location: string, details: Record<string, any> = {}): void {
    this.logEvent(
      SecurityEventType.SQL_INJECTION,
      SecuritySeverity.CRITICAL,
      `SQL injection attempt detected at: ${location}`,
      {
        input: this.sanitizeInput(input),
        location,
        ...details,
      }
    );
  }

  /**
   * Logs rate limit exceeded
   * @param endpoint - API endpoint
   * @param identifier - Client identifier
   * @param details - Additional details
   */
  logRateLimitExceeded(
    endpoint: string,
    identifier: string,
    details: Record<string, any> = {}
  ): void {
    this.logEvent(
      SecurityEventType.RATE_LIMIT_EXCEEDED,
      SecuritySeverity.MEDIUM,
      `Rate limit exceeded for endpoint: ${endpoint}`,
      {
        endpoint,
        identifier: this.sanitizeInput(identifier),
        ...details,
      }
    );
  }

  /**
   * Logs suspicious activity
   * @param activity - Description of activity
   * @param details - Additional details
   */
  logSuspiciousActivity(activity: string, details: Record<string, any> = {}): void {
    this.logEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      SecuritySeverity.MEDIUM,
      `Suspicious activity detected: ${activity}`,
      {
        activity: this.sanitizeInput(activity),
        ...details,
      }
    );
  }

  /**
   * Logs validation failure
   * @param field - Field that failed validation
   * @param value - Invalid value
   * @param reason - Validation failure reason
   * @param details - Additional details
   */
  logValidationFailure(
    field: string,
    value: string,
    reason: string,
    details: Record<string, any> = {}
  ): void {
    this.logEvent(
      SecurityEventType.VALIDATION_FAILURE,
      SecuritySeverity.LOW,
      `Validation failed for field: ${field}`,
      {
        field,
        value: this.sanitizeInput(value),
        reason,
        ...details,
      }
    );
  }

  /**
   * Logs encryption/decryption error
   * @param operation - Operation type (encrypt/decrypt)
   * @param error - Error details
   * @param details - Additional details
   */
  logEncryptionError(operation: string, error: string, details: Record<string, any> = {}): void {
    this.logEvent(
      SecurityEventType.ENCRYPTION_ERROR,
      SecuritySeverity.HIGH,
      `Encryption error during ${operation}`,
      {
        operation,
        error: this.sanitizeInput(error),
        ...details,
      }
    );
  }

  /**
   * Gets logs by type
   * @param type - Event type
   * @param limit - Maximum number of logs to return
   * @returns Array of security events
   */
  getLogsByType(type: SecurityEventType, limit: number = 100): SecurityEvent[] {
    return this.logs
      .filter((log) => log.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Gets logs by severity
   * @param severity - Event severity
   * @param limit - Maximum number of logs to return
   * @returns Array of security events
   */
  getLogsBySeverity(severity: SecuritySeverity, limit: number = 100): SecurityEvent[] {
    return this.logs
      .filter((log) => log.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Gets recent logs
   * @param hours - Number of hours to look back
   * @param limit - Maximum number of logs to return
   * @returns Array of recent security events
   */
  getRecentLogs(hours: number = 24, limit: number = 100): SecurityEvent[] {
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return this.logs
      .filter((log) => log.timestamp >= cutoff)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Gets security statistics
   * @returns Security statistics object
   */
  getStatistics(): {
    totalEvents: number;
    eventsByType: Record<SecurityEventType, number>;
    eventsBySeverity: Record<SecuritySeverity, number>;
    recentEvents: number;
    criticalEvents: number;
  } {
    const eventsByType = {} as Record<SecurityEventType, number>;
    const eventsBySeverity = {} as Record<SecuritySeverity, number>;
    const recentCutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours

    Object.values(SecurityEventType).forEach((type) => {
      eventsByType[type] = 0;
    });

    Object.values(SecuritySeverity).forEach((severity) => {
      eventsBySeverity[severity] = 0;
    });

    let recentEvents = 0;
    let criticalEvents = 0;

    this.logs.forEach((log) => {
      eventsByType[log.type]++;
      eventsBySeverity[log.severity]++;

      if (log.timestamp >= recentCutoff) {
        recentEvents++;
      }

      if (log.severity === SecuritySeverity.CRITICAL) {
        criticalEvents++;
      }
    });

    return {
      totalEvents: this.logs.length,
      eventsByType,
      eventsBySeverity,
      recentEvents,
      criticalEvents,
    };
  }

  /**
   * Clears all logs
   */
  clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  /**
   * Exports logs to JSON
   * @param format - Export format (json/csv)
   * @returns Exported logs as string
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['ID', 'Type', 'Severity', 'Timestamp', 'Message', 'User ID', 'IP Address'];
      const rows = this.logs.map((log) => [
        log.id,
        log.type,
        log.severity,
        new Date(log.timestamp).toISOString(),
        log.message,
        log.userId || '',
        log.ipAddress || '',
      ]);

      return [headers, ...rows].map((row) => row.join(',')).join('\n');
    }

    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Adds a log entry
   * @param event - Security event to log
   */
  private addLog(event: SecurityEvent): void {
    // Check if event meets log level threshold
    if (!this.shouldLog(event.severity)) {
      return;
    }

    this.logs.push(event);

    // Maintain maximum log size
    if (this.logs.length > this.config.maxLogSize) {
      this.logs = this.logs.slice(-this.config.maxLogSize);
    }

    this.saveLogs();

    // Console logging
    if (this.config.enableConsoleLogging) {
      this.consoleLog(event);
    }

    // Remote logging
    if (this.config.enableRemoteLogging && this.config.remoteEndpoint) {
      this.sendToRemote(event);
    }
  }

  /**
   * Checks if event should be logged based on severity
   * @param severity - Event severity
   * @returns True if should log
   */
  private shouldLog(severity: SecuritySeverity): boolean {
    const severityLevels = {
      [SecuritySeverity.LOW]: 0,
      [SecuritySeverity.MEDIUM]: 1,
      [SecuritySeverity.HIGH]: 2,
      [SecuritySeverity.CRITICAL]: 3,
    };

    return severityLevels[severity] >= severityLevels[this.config.logLevel];
  }

  /**
   * Logs to console with appropriate styling
   * @param event - Security event
   */
  private consoleLog(event: SecurityEvent): void {
    const styles = {
      [SecuritySeverity.LOW]: 'color: #888',
      [SecuritySeverity.MEDIUM]: 'color: #f59e0b',
      [SecuritySeverity.HIGH]: 'color: #ef4444',
      [SecuritySeverity.CRITICAL]: 'color: #dc2626; font-weight: bold',
    };

    console.log(
      `%c[Security] ${event.type.toUpperCase()} - ${event.message}`,
      styles[event.severity],
      event
    );
  }

  /**
   * Sends log to remote endpoint
   * @param event - Security event
   */
  private async sendToRemote(event: SecurityEvent): Promise<void> {
    try {
      if (!this.config.remoteEndpoint) return;

      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('[Security Logger] Failed to send log to remote:', error);
    }
  }

  /**
   * Loads logs from localStorage
   */
  private loadLogs(): void {
    try {
      const stored = localStorage.getItem(this.logKey);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('[Security Logger] Failed to load logs:', error);
      this.logs = [];
    }
  }

  /**
   * Saves logs to localStorage
   */
  private saveLogs(): void {
    try {
      localStorage.setItem(this.logKey, JSON.stringify(this.logs));
    } catch (error) {
      console.error('[Security Logger] Failed to save logs:', error);
    }
  }

  /**
   * Cleans up old logs based on retention period
   */
  private cleanupOldLogs(): void {
    const cutoff = Date.now() - this.config.retentionPeriod;
    this.logs = this.logs.filter((log) => log.timestamp >= cutoff);
    this.saveLogs();
  }

  /**
   * Generates unique event ID
   * @returns Unique event ID
   */
  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gets current user ID (placeholder implementation)
   * @returns User ID or null
   */
  private getCurrentUserId(): string | null {
    // In a real implementation, this would get the actual user ID
    return localStorage.getItem('nouras-user-id') || null;
  }

  /**
   * Gets client IP address (placeholder implementation)
   * @returns IP address or null
   */
  private getClientIP(): string | null {
    // In a real implementation, this would get the actual IP address
    return null;
  }

  /**
   * Sanitizes email for logging
   * @param email - Email to sanitize
   * @returns Sanitized email
   */
  private sanitizeEmail(email: string): string {
    const [username, domain] = email.split('@');
    const sanitizedUsername = username.substring(0, 2) + '***';
    return `${sanitizedUsername}@${domain}`;
  }

  /**
   * Sanitizes input for logging
   * @param input - Input to sanitize
   * @returns Sanitized input
   */
  private sanitizeInput(input: string): string {
    if (input.length > 100) {
      return input.substring(0, 100) + '...';
    }
    return input;
  }
}

// Default logger instance
export const securityLogger = new SecurityLogger();

// Convenience functions for common logging operations
export const logFailedLogin = (email: string, reason: string, details?: Record<string, any>) =>
  securityLogger.logFailedLogin(email, reason, details);

export const logSuccessfulLogin = (userId: string, details?: Record<string, any>) =>
  securityLogger.logSuccessfulLogin(userId, details);

export const logXSSAttempt = (input: string, location: string, details?: Record<string, any>) =>
  securityLogger.logXSSAttempt(input, location, details);

export const logCSRFViolation = (details?: Record<string, any>) =>
  securityLogger.logCSRFViolation(details);

export const logSQLInjection = (input: string, location: string, details?: Record<string, any>) =>
  securityLogger.logSQLInjection(input, location, details);

export const logRateLimitExceeded = (
  endpoint: string,
  identifier: string,
  details?: Record<string, any>
) => securityLogger.logRateLimitExceeded(endpoint, identifier, details);

export const logSuspiciousActivity = (activity: string, details?: Record<string, any>) =>
  securityLogger.logSuspiciousActivity(activity, details);

export const logValidationFailure = (
  field: string,
  value: string,
  reason: string,
  details?: Record<string, any>
) => securityLogger.logValidationFailure(field, value, reason, details);

export const logEncryptionError = (
  operation: string,
  error: string,
  details?: Record<string, any>
) => securityLogger.logEncryptionError(operation, error, details);
