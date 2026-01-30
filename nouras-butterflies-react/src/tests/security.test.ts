/**
 * Security Test Suite
 * Comprehensive tests for security utilities and functions
 */

import {
  sanitizeHTML,
  sanitizeInput,
  sanitizeEmail,
  sanitizeURL,
  sanitizeFormData,
  detectSQLInjection,
  validateFileUpload,
} from '../utils/sanitization';

import {
  generateCSRFToken,
  validateCSRFToken,
  setCSRFToken,
  getCSRFToken,
  clearCSRFToken,
} from '../utils/csrf';

import {
  encryptData,
  decryptData,
  setSecureItem,
  getSecureItem,
  removeSecureItem,
} from '../utils/secureStorage';

import { RateLimiter } from '../utils/rateLimiter';

import { SecurityLogger, SecurityEventType, SecuritySeverity } from '../utils/securityLogger';

// Test utilities
const expect = (actual: any) => ({
  toBe: (expected: any) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, but got ${actual}`);
    }
  },
  toEqual: (expected: any) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    }
  },
  toBeTruthy: () => {
    if (!actual) {
      throw new Error(`Expected truthy value, but got ${actual}`);
    }
  },
  toBeFalsy: () => {
    if (actual) {
      throw new Error(`Expected falsy value, but got ${actual}`);
    }
  },
  toContain: (expected: any) => {
    if (!actual.includes(expected)) {
      throw new Error(`Expected ${actual} to contain ${expected}`);
    }
  },
  toBeLessThan: (expected: number) => {
    if (actual >= expected) {
      throw new Error(`Expected ${actual} to be less than ${expected}`);
    }
  },
  not: {
    toContain: (expected: any) => {
      if (actual.includes(expected)) {
        throw new Error(`Expected ${actual} not to contain ${expected}`);
      }
    },
  },
});

// Test runner
const test = (name: string, fn: () => void) => {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}: ${(error as Error).message}`);
  }
};

// Sanitization Tests
test('sanitizeHTML should remove script tags', () => {
  const maliciousHTML = '<script>alert("xss")</script><p>Safe content</p>';
  const sanitized = sanitizeHTML(maliciousHTML);
  expect(sanitized).not.toContain('<script>');
  expect(sanitized).toContain('<p>Safe content</p>');
});

test('sanitizeHTML should remove event handlers', () => {
  const maliciousHTML = '<div onclick="alert(\'xss\')">Click me</div>';
  const sanitized = sanitizeHTML(maliciousHTML);
  expect(sanitized).not.toContain('onclick');
});

test('sanitizeInput should escape HTML entities', () => {
  const maliciousInput = '<script>alert("xss")</script>';
  const sanitized = sanitizeInput(maliciousInput);
  expect(sanitized).not.toContain('<script>');
  expect(sanitized).toContain('&lt;script&gt;');
});

test('sanitizeEmail should validate and clean email', () => {
  const validEmail = 'test@example.com';
  const invalidEmail = 'invalid-email';

  expect(sanitizeEmail(validEmail)).toBe(validEmail);
  expect(sanitizeEmail(invalidEmail)).toBe('');
});

test('sanitizeURL should block dangerous protocols', () => {
  const dangerousURL = 'javascript:alert("xss")';
  const safeURL = 'https://example.com';

  expect(sanitizeURL(dangerousURL)).toBe('');
  expect(sanitizeURL(safeURL)).toBe(safeURL);
});

test('sanitizeFormData should clean nested objects', () => {
  const formData = {
    name: '<script>alert("xss")</script>',
    email: 'test@example.com',
    nested: {
      dangerous: 'javascript:alert("xss")',
      safe: 'safe content',
    },
  };

  const sanitized = sanitizeFormData(formData);
  expect(sanitized.name).not.toContain('<script>');
  expect(sanitized.nested.dangerous).toBe('');
  expect(sanitized.nested.safe).toBe('safe content');
});

test('detectSQLInjection should identify SQL patterns', () => {
  const sqlInjection = "'; DROP TABLE users; --";
  expect(detectSQLInjection(sqlInjection)).toBeTruthy();

  const safeInput = 'normal user input';
  expect(detectSQLInjection(safeInput)).toBeFalsy();
});

test('validateFileUpload should check file constraints', () => {
  const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
  expect(validateFileUpload(mockFile)).toBeTruthy();

  const mockLargeFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
  Object.defineProperty(mockLargeFile, 'size', { value: 10 * 1024 * 1024 }); // 10MB
  expect(validateFileUpload(mockLargeFile, ['image/jpeg'], 5 * 1024 * 1024)).toBeFalsy();
});

// CSRF Tests
test('CSRF token generation and validation', () => {
  const token = generateCSRFToken();
  expect(token).toBeTruthy();
  expect(token.length).toBe(64); // 32 bytes = 64 hex chars
});

test('CSRF token storage and retrieval', () => {
  const token = generateCSRFToken();
  setCSRFToken(token);

  const retrievedToken = getCSRFToken();
  expect(retrievedToken).toBe(token);

  clearCSRFToken();
  expect(getCSRFToken()).toBe(null);
});

test('CSRF token validation', () => {
  const token = generateCSRFToken();
  setCSRFToken(token);

  expect(validateCSRFToken(token)).toBeTruthy();
  expect(validateCSRFToken('invalid-token')).toBeFalsy();

  clearCSRFToken();
});

// Secure Storage Tests
test('Data encryption and decryption', () => {
  const testData = { message: 'secret data', number: 42 };

  const encrypted = encryptData(testData);
  expect(encrypted.data).toBeTruthy();
  expect(encrypted.salt).toBeTruthy();
  expect(encrypted.iv).toBeTruthy();
  expect(encrypted.hmac).toBeTruthy();

  const decrypted = decryptData(encrypted);
  expect(decrypted).toEqual(testData);
});

test('Secure item storage and retrieval', () => {
  const testData = { secret: 'confidential information' };

  setSecureItem('test-key', testData);
  const retrieved = getSecureItem('test-key');
  expect(retrieved).toEqual(testData);

  removeSecureItem('test-key');
  expect(getSecureItem('test-key')).toBe(null);
});

test('Secure storage should handle corrupted data', () => {
  // Simulate corrupted data
  localStorage.setItem('nouras_encrypted:corrupted', 'invalid-json');
  expect(getSecureItem('corrupted')).toBe(null);
});

// Rate Limiter Tests
test('Rate limiter should allow requests within limit', () => {
  const limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
  const identifier = 'test-user';

  const result1 = limiter.checkLimit(identifier);
  expect(result1.allowed).toBeTruthy();
  expect(result1.remaining).toBe(4);

  const result2 = limiter.checkLimit(identifier);
  expect(result2.allowed).toBeTruthy();
  expect(result2.remaining).toBe(3);
});

test('Rate limiter should block requests exceeding limit', () => {
  const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60000 });
  const identifier = 'test-user';

  limiter.checkLimit(identifier); // 1st request
  limiter.checkLimit(identifier); // 2nd request

  const result = limiter.checkLimit(identifier); // 3rd request
  expect(result.allowed).toBeFalsy();
  expect(result.remaining).toBe(0);
  expect(result.retryAfter).toBeTruthy();
});

test('Rate limiter should reset after window expires', async () => {
  const limiter = new RateLimiter({ maxRequests: 1, windowMs: 100 }); // 100ms window
  const identifier = 'test-user';

  limiter.checkLimit(identifier); // Use up the limit

  // Wait for window to expire
  await new Promise((resolve) => setTimeout(resolve, 150));

  const result = limiter.checkLimit(identifier);
  expect(result.allowed).toBeTruthy();
});

// Security Logger Tests
test('Security logger should create and store events', () => {
  const logger = new SecurityLogger({ enableConsoleLogging: false });

  logger.logEvent(SecurityEventType.XSS_ATTEMPT, SecuritySeverity.HIGH, 'Test XSS attempt', {
    input: '<script>alert("xss")</script>',
  });

  const logs = logger.getLogsByType(SecurityEventType.XSS_ATTEMPT);
  expect(logs.length).toBe(1);
  expect(logs[0].type).toBe(SecurityEventType.XSS_ATTEMPT);
  expect(logs[0].severity).toBe(SecuritySeverity.HIGH);
});

test('Security logger should provide statistics', () => {
  const logger = new SecurityLogger({ enableConsoleLogging: false });

  logger.logEvent(SecurityEventType.AUTHENTICATION, SecuritySeverity.LOW, 'Login success');
  logger.logEvent(SecurityEventType.XSS_ATTEMPT, SecuritySeverity.HIGH, 'XSS attempt');
  logger.logEvent(SecurityEventType.CSRF_VIOLATION, SecuritySeverity.HIGH, 'CSRF violation');

  const stats = logger.getStatistics();
  expect(stats.totalEvents).toBe(3);
  expect(stats.eventsByType[SecurityEventType.XSS_ATTEMPT]).toBe(1);
  expect(stats.eventsBySeverity[SecuritySeverity.HIGH]).toBe(2);
});

test('Security logger should export logs', () => {
  const logger = new SecurityLogger({ enableConsoleLogging: false });

  logger.logEvent(SecurityEventType.AUTHENTICATION, SecuritySeverity.LOW, 'Test event');

  const jsonExport = logger.exportLogs('json');
  expect(jsonExport).toContain('Test event');

  const csvExport = logger.exportLogs('csv');
  expect(csvExport).toContain('Type,Severity,Timestamp');
});

// Integration Tests
test('Complete security workflow', () => {
  // 1. Sanitize user input
  const userInput = '<script>alert("xss")</script>';
  const sanitizedInput = sanitizeInput(userInput);

  // 2. Validate email
  const email = sanitizeEmail('test@example.com');
  expect(email).toBe('test@example.com');

  // 3. Generate CSRF token
  const csrfToken = generateCSRFToken();
  setCSRFToken(csrfToken);

  // 4. Store sensitive data securely
  const sensitiveData = { token: 'secret-token', userId: 'user123' };
  setSecureItem('user-session', sensitiveData);

  // 5. Log security event
  const logger = new SecurityLogger({ enableConsoleLogging: false });
  logger.logSuccessfulLogin('user123');

  // 6. Verify everything worked
  expect(sanitizedInput).not.toContain('<script>');
  expect(validateCSRFToken(csrfToken)).toBeTruthy();
  expect(getSecureItem('user-session')).toEqual(sensitiveData);

  const loginLogs = logger.getLogsByType(SecurityEventType.AUTHENTICATION);
  expect(loginLogs.length).toBe(1);

  // Cleanup
  clearCSRFToken();
  removeSecureItem('user-session');
});

// Performance Tests
test('Sanitization performance', () => {
  const largeInput = '<script>'.repeat(1000) + 'Safe content'.repeat(1000);

  const startTime = performance.now();
  const sanitized = sanitizeHTML(largeInput);
  const endTime = performance.now();

  expect(sanitized).not.toContain('<script>');
  expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
});

test('Encryption performance', () => {
  const largeData = { data: 'x'.repeat(10000) };

  const startTime = performance.now();
  const encrypted = encryptData(largeData);
  const decrypted = decryptData(encrypted);
  const endTime = performance.now();

  expect(decrypted).toEqual(largeData);
  expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
});

// Edge Cases
test('Handle null and undefined inputs', () => {
  expect(sanitizeInput('')).toBe('');
  expect(sanitizeInput(null as any)).toBe('');
  expect(sanitizeInput(undefined as any)).toBe('');
  expect(sanitizeEmail('')).toBe('');
  expect(sanitizeURL('')).toBe('');
});

test('Handle empty and malformed data', () => {
  expect(encryptData(null)).toBeTruthy();
  expect(encryptData(undefined)).toBeTruthy();
  expect(encryptData('')).toBeTruthy();

  const logger = new SecurityLogger({ enableConsoleLogging: false });
  logger.logEvent(SecurityEventType.XSS_ATTEMPT, SecuritySeverity.HIGH, '');
  expect(logger.getStatistics().totalEvents).toBe(1);
});

console.log('\n🔒 Security Tests Complete!');
console.log('Run this file in your browser console or Node.js environment to execute all tests.');
