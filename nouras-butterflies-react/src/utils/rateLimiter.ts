/**
 * Rate Limiting Utilities
 * Provides sliding window rate limiting with exponential backoff
 * for API requests and form submissions
 */

// Rate limit configuration
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (identifier: string) => string;
}

// Rate limit record
interface RateLimitRecord {
  count: number;
  resetTime: number;
  lastRequest: number;
}

// Rate limit result
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// Default rate limit configurations
export const DEFAULT_LIMITS = {
  // Login attempts: 5 per 15 minutes
  LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 },

  // API calls: 100 per minute
  API: { maxRequests: 100, windowMs: 60 * 1000 },

  // Form submissions: 10 per hour
  FORM: { maxRequests: 10, windowMs: 60 * 60 * 1000 },

  // File uploads: 5 per hour
  UPLOAD: { maxRequests: 5, windowMs: 60 * 60 * 1000 },

  // Password reset: 3 per hour
  PASSWORD_RESET: { maxRequests: 3, windowMs: 60 * 60 * 1000 },

  // Search requests: 30 per minute
  SEARCH: { maxRequests: 30, windowMs: 60 * 1000 },

  // Review submissions: 5 per hour
  REVIEW: { maxRequests: 5, windowMs: 60 * 60 * 1000 },
} as const;

/**
 * Rate Limiter Class
 * Implements sliding window rate limiting with memory storage
 */
export class RateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: (id: string) => id,
      ...config,
    };

    // Set up cleanup interval
    setInterval(() => this.cleanup(), 60 * 1000); // Cleanup every minute
  }

  /**
   * Checks if a request is allowed under the rate limit
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @returns Rate limit result
   */
  checkLimit(identifier: string): RateLimitResult {
    const key = this.config.keyGenerator!(identifier);
    const now = Date.now();
    const record = this.store.get(key);

    if (!record) {
      // First request
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
        lastRequest: now,
      });

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
      };
    }

    // Check if window has expired
    if (now >= record.resetTime) {
      // Reset window
      record.count = 1;
      record.resetTime = now + this.config.windowMs;
      record.lastRequest = now;

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: record.resetTime,
      };
    }

    // Check if limit exceeded
    if (record.count >= this.config.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);

      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfter,
      };
    }

    // Increment count
    record.count++;
    record.lastRequest = now;

    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      resetTime: record.resetTime,
    };
  }

  /**
   * Records a successful request (if configured to skip successful requests)
   * @param identifier - Unique identifier
   */
  recordSuccess(identifier: string): void {
    if (this.config.skipSuccessfulRequests) {
      const key = this.config.keyGenerator!(identifier);
      const record = this.store.get(key);

      if (record && record.count > 0) {
        record.count--;
      }
    }
  }

  /**
   * Records a failed request (if configured to skip failed requests)
   * @param identifier - Unique identifier
   */
  recordFailure(identifier: string): void {
    if (this.config.skipFailedRequests) {
      const key = this.config.keyGenerator!(identifier);
      const record = this.store.get(key);

      if (record && record.count > 0) {
        record.count--;
      }
    }
  }

  /**
   * Gets current rate limit status for an identifier
   * @param identifier - Unique identifier
   * @returns Current rate limit status
   */
  getStatus(identifier: string): RateLimitResult | null {
    const key = this.config.keyGenerator!(identifier);
    const record = this.store.get(key);

    if (!record) {
      return null;
    }

    const now = Date.now();

    // Check if window has expired
    if (now >= record.resetTime) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs,
      };
    }

    return {
      allowed: record.count < this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - record.count),
      resetTime: record.resetTime,
      retryAfter:
        record.count >= this.config.maxRequests
          ? Math.ceil((record.resetTime - now) / 1000)
          : undefined,
    };
  }

  /**
   * Resets rate limit for an identifier
   * @param identifier - Unique identifier
   */
  resetLimit(identifier: string): void {
    const key = this.config.keyGenerator!(identifier);
    this.store.delete(key);
  }

  /**
   * Resets all rate limits
   */
  resetAll(): void {
    this.store.clear();
  }

  /**
   * Gets statistics for the rate limiter
   * @returns Rate limiter statistics
   */
  getStats(): {
    totalIdentifiers: number;
    activeIdentifiers: number;
    totalRequests: number;
  } {
    const now = Date.now();
    let totalRequests = 0;
    let activeIdentifiers = 0;

    for (const record of this.store.values()) {
      totalRequests += record.count;
      if (now < record.resetTime) {
        activeIdentifiers++;
      }
    }

    return {
      totalIdentifiers: this.store.size,
      activeIdentifiers,
      totalRequests,
    };
  }

  /**
   * Cleans up expired records
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, record] of this.store.entries()) {
      if (now >= record.resetTime) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => this.store.delete(key));
  }
}

// Pre-configured rate limiters
export const rateLimiters = {
  login: new RateLimiter(DEFAULT_LIMITS.LOGIN),
  register: new RateLimiter(DEFAULT_LIMITS.LOGIN), // Use same limits as login
  api: new RateLimiter(DEFAULT_LIMITS.API),
  form: new RateLimiter(DEFAULT_LIMITS.FORM),
  upload: new RateLimiter(DEFAULT_LIMITS.UPLOAD),
  passwordReset: new RateLimiter(DEFAULT_LIMITS.PASSWORD_RESET),
  search: new RateLimiter(DEFAULT_LIMITS.SEARCH),
  review: new RateLimiter(DEFAULT_LIMITS.REVIEW),
};

/**
 * Rate limiting middleware for API calls
 * @param limiter - Rate limiter instance
 * @param identifier - Unique identifier
 * @returns Promise that resolves if request is allowed
 */
export const checkRateLimit = async (
  limiter: RateLimiter,
  identifier: string
): Promise<RateLimitResult> => {
  return limiter.checkLimit(identifier);
};

/**
 * Creates a rate-limited function wrapper
 * @param fn - Function to wrap
 * @param limiter - Rate limiter instance
 * @param identifier - Unique identifier
 * @returns Rate-limited function
 */
export const createRateLimitedFunction = <T extends (...args: any[]) => any>(
  fn: T,
  limiter: RateLimiter,
  identifier: string
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const result = limiter.checkLimit(identifier);

    if (!result.allowed) {
      throw new Error(`Rate limit exceeded. Try again in ${result.retryAfter} seconds.`);
    }

    try {
      const response = await fn(...args);
      limiter.recordSuccess(identifier);
      return response;
    } catch (error) {
      limiter.recordFailure(identifier);
      throw error;
    }
  };
};

/**
 * Exponential backoff utility
 * @param attempt - Current attempt number
 * @param baseDelay - Base delay in milliseconds
 * @param maxDelay - Maximum delay in milliseconds
 * @returns Delay in milliseconds
 */
export const getBackoffDelay = (
  attempt: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000
): number => {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
};

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxAttempts - Maximum number of attempts
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise with function result
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts - 1) {
        break;
      }

      const delay = getBackoffDelay(attempt, baseDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Gets client IP address (fallback implementation)
 * @returns Client IP address or fallback identifier
 */
export const getClientIdentifier = (): string => {
  // In a real implementation, this would get the actual IP address
  // For now, use a combination of user agent and timestamp
  const userAgent = navigator.userAgent;
  const timestamp = Date.now();
  return `${userAgent}-${timestamp}`;
};

/**
 * Rate limiting hook for React components
 * @param limiter - Rate limiter instance
 * @param identifier - Unique identifier
 * @returns Rate limiting state and functions
 */
export const useRateLimit = (limiter: RateLimiter, identifier: string) => {
  const [status, setStatus] = useState<RateLimitResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkLimit = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = limiter.checkLimit(identifier);
      setStatus(result);
      return result.allowed;
    } finally {
      setIsLoading(false);
    }
  }, [limiter, identifier]);

  const resetLimit = useCallback(() => {
    limiter.resetLimit(identifier);
    setStatus(null);
  }, [limiter, identifier]);

  return {
    status,
    isLoading,
    checkLimit,
    resetLimit,
  };
};

// Import useState and useCallback for the hook
import { useState, useCallback } from 'react';

/**
 * Initialize rate limiting for the application
 */
export const initializeRateLimiting = (): void => {
  console.log('[Rate Limiter] Rate limiting initialized');

  // Set up periodic cleanup
  setInterval(
    () => {
      Object.values(rateLimiters).forEach((limiter) => {
        const stats = limiter.getStats();
        console.log(`[Rate Limiter] Stats: ${JSON.stringify(stats)}`);
      });
    },
    5 * 60 * 1000
  ); // Log stats every 5 minutes
};

/**
 * Cleanup rate limiting
 */
export const cleanupRateLimiting = (): void => {
  Object.values(rateLimiters).forEach((limiter) => {
    limiter.resetAll();
  });
  console.log('[Rate Limiter] Rate limiting cleaned up');
};
