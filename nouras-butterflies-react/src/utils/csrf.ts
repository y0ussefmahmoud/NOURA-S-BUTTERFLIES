/**
 * CSRF (Cross-Site Request Forgery) Protection Utilities
 * Provides token generation, validation, and management for CSRF protection
 */

// CSRF token configuration
const CSRF_TOKEN_KEY = 'nouras-csrf-token';
const CSRF_TOKEN_EXPIRY_KEY = 'nouras-csrf-token-expiry';
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generates a cryptographically secure random CSRF token
 * @returns A random CSRF token string
 */
export const generateCSRFToken = (): string => {
  try {
    const array = new Uint8Array(CSRF_TOKEN_LENGTH);
    crypto.getRandomValues(array);

    // Convert to hex string
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('[CSRF] Error generating token:', error);
    // Fallback to less secure method if crypto API fails
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Date.now().toString(36)
    );
  }
};

/**
 * Stores CSRF token in sessionStorage (not localStorage for security)
 * @param token - The CSRF token to store
 */
export const setCSRFToken = (token: string): void => {
  try {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    sessionStorage.setItem(CSRF_TOKEN_EXPIRY_KEY, (Date.now() + CSRF_TOKEN_EXPIRY_MS).toString());
  } catch (error) {
    console.error('[CSRF] Error storing token:', error);
  }
};

/**
 * Retrieves CSRF token from sessionStorage
 * @returns The CSRF token or null if not found/expired
 */
export const getCSRFToken = (): string | null => {
  try {
    const token = sessionStorage.getItem(CSRF_TOKEN_KEY);
    const expiry = sessionStorage.getItem(CSRF_TOKEN_EXPIRY_KEY);

    if (!token || !expiry) {
      return null;
    }

    // Check if token has expired
    if (Date.now() > parseInt(expiry, 10)) {
      clearCSRFToken();
      return null;
    }

    return token;
  } catch (error) {
    console.error('[CSRF] Error retrieving token:', error);
    return null;
  }
};

/**
 * Validates a CSRF token against the stored token
 * @param token - The token to validate
 * @returns True if token is valid, false otherwise
 */
export const validateCSRFToken = (token: string): boolean => {
  try {
    const storedToken = getCSRFToken();

    if (!storedToken || !token) {
      return false;
    }

    // Use constant-time comparison to prevent timing attacks
    return constantTimeCompare(token, storedToken);
  } catch (error) {
    console.error('[CSRF] Error validating token:', error);
    return false;
  }
};

/**
 * Clears CSRF token from sessionStorage
 */
export const clearCSRFToken = (): void => {
  try {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
    sessionStorage.removeItem(CSRF_TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('[CSRF] Error clearing token:', error);
  }
};

/**
 * Refreshes CSRF token with a new one
 * @returns The new CSRF token
 */
export const refreshCSRFToken = (): string => {
  try {
    const newToken = generateCSRFToken();
    setCSRFToken(newToken);
    return newToken;
  } catch (error) {
    console.error('[CSRF] Error refreshing token:', error);
    return '';
  }
};

/**
 * Checks if CSRF token exists and is valid
 * @returns True if token is valid, false otherwise
 */
export const hasValidCSRFToken = (): boolean => {
  return getCSRFToken() !== null;
};

/**
 * Ensures a valid CSRF token exists, generates one if needed
 * @returns The current or new CSRF token
 */
export const ensureCSRFToken = (): string => {
  const existingToken = getCSRFToken();
  if (existingToken) {
    return existingToken;
  }

  return refreshCSRFToken();
};

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns True if strings are equal
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Adds CSRF token to a request headers object
 * @param headers - Existing headers object
 * @returns Headers object with CSRF token added
 */
export const addCSRFToHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
  const token = getCSRFToken();
  if (token) {
    headers['X-CSRF-Token'] = token;
  }
  return headers;
};

/**
 * Validates CSRF token from request headers
 * @param headers - Request headers object
 * @returns True if CSRF token is valid
 */
export const validateCSRFFromHeaders = (headers: Record<string, string>): boolean => {
  const token = headers['X-CSRF-Token'] || headers['x-csrf-token'];
  return token ? validateCSRFToken(token) : false;
};

/**
 * CSRF middleware for API requests
 * @param config - Request configuration
 * @returns Modified config with CSRF token
 */
export const csrfMiddleware = (config: {
  method?: string;
  headers?: Record<string, string>;
  url?: string;
}): {
  method?: string;
  headers?: Record<string, string>;
  url?: string;
} => {
  // Only add CSRF token to state-changing methods
  const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  const method = config.method?.toUpperCase();

  if (method && stateChangingMethods.includes(method)) {
    return {
      ...config,
      headers: addCSRFToHeaders(config.headers || {}),
    };
  }

  return config;
};

/**
 * Initializes CSRF protection for the application
 * Should be called when the application starts
 */
export const initializeCSRFProtection = (): void => {
  try {
    // Generate initial token if none exists
    ensureCSRFToken();

    // Set up automatic token refresh
    setInterval(() => {
      const token = getCSRFToken();
      if (!token) {
        refreshCSRFToken();
      }
    }, CSRF_TOKEN_EXPIRY_MS / 2); // Refresh at half the expiry time

    console.log('[CSRF] CSRF protection initialized');
  } catch (error) {
    console.error('[CSRF] Error initializing CSRF protection:', error);
  }
};

/**
 * Cleanup function to remove CSRF protection
 * Should be called when user logs out
 */
export const cleanupCSRFProtection = (): void => {
  try {
    clearCSRFToken();
    console.log('[CSRF] CSRF protection cleaned up');
  } catch (error) {
    console.error('[CSRF] Error cleaning up CSRF protection:', error);
  }
};

/**
 * Validates origin for additional CSRF protection
 * @param origin - The origin to validate
 * @param allowedOrigins - Array of allowed origins
 * @returns True if origin is allowed
 */
export const validateOrigin = (
  origin: string,
  allowedOrigins: string[] = [window.location.origin]
): boolean => {
  try {
    return allowedOrigins.includes(origin);
  } catch (error) {
    console.error('[CSRF] Error validating origin:', error);
    return false;
  }
};

/**
 * Gets the current origin for validation
 * @returns The current origin
 */
export const getCurrentOrigin = (): string => {
  return window.location.origin;
};

/**
 * CSRF protection for form submissions
 * @param formData - Form data to submit
 * @returns Form data with CSRF token added
 */
export const addCSRFToFormData = (formData: FormData): FormData => {
  const token = getCSRFToken();
  if (token) {
    formData.set('csrf_token', token);
  }
  return formData;
};

/**
 * Validates CSRF token from form data
 * @param formData - Form data containing CSRF token
 * @returns True if CSRF token is valid
 */
export const validateCSRFFromFormData = (formData: FormData): boolean => {
  const token = formData.get('csrf_token') as string;
  return token ? validateCSRFToken(token) : false;
};

// Export constants for external use
export const CSRF_CONFIG = {
  TOKEN_KEY: CSRF_TOKEN_KEY,
  TOKEN_EXPIRY_KEY: CSRF_TOKEN_EXPIRY_KEY,
  TOKEN_LENGTH: CSRF_TOKEN_LENGTH,
  TOKEN_EXPIRY_MS: CSRF_TOKEN_EXPIRY_MS,
} as const;
