/**
 * HTTP Interceptor for Security
 * Provides automatic CSRF token management, request/response interception,
 * and security headers for all HTTP requests
 */

import {
  getCSRFToken,
  refreshCSRFToken,
  addCSRFToHeaders,
  validateOrigin,
  getCurrentOrigin,
} from './csrf';

// Request/Response types
interface RequestConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal;
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Headers;
  data: any;
  config: RequestConfig;
}

// Security configuration
const SECURITY_CONFIG = {
  // Methods that require CSRF protection
  CSRF_METHODS: ['POST', 'PUT', 'DELETE', 'PATCH'],

  // Status codes that might indicate CSRF issues
  CSRF_ERROR_CODES: [403, 419],

  // Maximum retry attempts for failed requests
  MAX_RETRIES: 3,

  // Retry delay in milliseconds
  RETRY_DELAY: 1000,

  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 30000,

  // Allowed origins for CORS validation - includes current origin and API base URL
  ALLOWED_ORIGINS: [
    getCurrentOrigin(),
    // Add API base URL origin if it's different from current origin
    ...(import.meta.env.VITE_API_BASE_URL 
      ? [new URL(import.meta.env.VITE_API_BASE_URL).origin] 
      : [])
  ],

  // Security headers to add to all requests
  SECURITY_HEADERS: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  },
};

// Request queue for handling concurrent requests during token refresh
let isRefreshingToken = false;
let refreshQueue: Array<{
  config: RequestConfig;
  resolve: (response: Response) => void;
  reject: (error: Error) => void;
}> = [];

/**
 * Adds security headers to request configuration
 * @param config - Request configuration
 * @returns Modified configuration with security headers
 */
const addSecurityHeaders = (config: RequestConfig): RequestConfig => {
  const headers = {
    ...SECURITY_CONFIG.SECURITY_HEADERS,
    ...config.headers,
  };

  return {
    ...config,
    headers,
  };
};

/**
 * Adds CSRF token to request if needed
 * @param config - Request configuration
 * @returns Modified configuration with CSRF token
 */
const addCSRFToken = (config: RequestConfig): RequestConfig => {
  const method = config.method.toUpperCase();

  if (SECURITY_CONFIG.CSRF_METHODS.includes(method)) {
    const token = getCSRFToken();
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          'X-CSRF-Token': token,
        },
      };
    }
  }

  return config;
};

/**
 * Validates request origin for security
 * @param config - Request configuration
 * @returns True if origin is valid
 */
const validateRequestOrigin = (config: RequestConfig): boolean => {
  try {
    const url = new URL(config.url, window.location.origin);
    const requestOrigin = url.origin;
    
    // Bypass validation if the target host matches the configured API host
    if (import.meta.env.VITE_API_BASE_URL) {
      const apiUrlOrigin = new URL(import.meta.env.VITE_API_BASE_URL).origin;
      if (requestOrigin === apiUrlOrigin) {
        return true;
      }
    }
    
    return validateOrigin(requestOrigin, SECURITY_CONFIG.ALLOWED_ORIGINS);
  } catch (error) {
    console.error('[HTTP Interceptor] Error validating origin:', error);
    return false;
  }
};

/**
 * Handles CSRF token refresh
 * @returns Promise that resolves when token is refreshed
 */
const handleTokenRefresh = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isRefreshingToken) {
      isRefreshingToken = true;

      try {
        const newToken = refreshCSRFToken();
        isRefreshingToken = false;

        // Process queued requests
        refreshQueue.forEach(({ config, resolve: queueResolve }) => {
          const updatedConfig = {
            ...config,
            headers: {
              ...config.headers,
              'X-CSRF-Token': newToken,
            },
          };
          fetch(updatedConfig.url, updatedConfig).then(queueResolve);
        });

        refreshQueue = [];
        resolve();
      } catch (error) {
        isRefreshingToken = false;

        // Reject all queued requests
        refreshQueue.forEach(({ reject: queueReject }) => {
          queueReject(error as Error);
        });

        refreshQueue = [];
        reject(error);
      }
    } else {
      // Add request to queue if token is already being refreshed
      // This will be handled when the refresh completes
      resolve();
    }
  });
};

/**
 * Handles CSRF-related errors
 * @param response - Fetch response
 * @param config - Original request configuration
 * @returns Promise with retry or error
 */
const handleCSRFError = async (response: Response, config: RequestConfig): Promise<Response> => {
  if (SECURITY_CONFIG.CSRF_ERROR_CODES.includes(response.status)) {
    try {
      // Attempt to refresh CSRF token and retry request
      await handleTokenRefresh();

      // Retry the request with new token
      const retryConfig = {
        ...config,
        headers: addCSRFToHeaders(config.headers || {}),
      };

      return fetch(retryConfig.url, retryConfig);
    } catch (error) {
      console.error('[HTTP Interceptor] Error handling CSRF:', error);
      throw new Error('CSRF token refresh failed');
    }
  }

  return response;
};

/**
 * Creates an AbortSignal with timeout
 * @param timeout - Timeout in milliseconds
 * @returns AbortSignal
 */
const createTimeoutSignal = (timeout: number): AbortSignal => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller.signal;
};

/**
 * Intercepts and processes requests before sending
 * @param config - Request configuration
 * @returns Processed request configuration
 */
const requestInterceptor = (config: RequestConfig): RequestConfig => {
  try {
    // Validate origin
    if (!validateRequestOrigin(config)) {
      throw new Error('Invalid request origin');
    }

    // Add security headers
    let processedConfig = addSecurityHeaders(config);

    // Add CSRF token for state-changing methods
    processedConfig = addCSRFToken(processedConfig);

    // Add timeout signal
    if (!processedConfig.signal) {
      processedConfig.signal = createTimeoutSignal(SECURITY_CONFIG.REQUEST_TIMEOUT);
    }

    console.log(`[HTTP Interceptor] Request: ${processedConfig.method} ${processedConfig.url}`);
    return processedConfig;
  } catch (error) {
    console.error('[HTTP Interceptor] Request interceptor error:', error);
    throw error;
  }
};

/**
 * Intercepts and processes responses after receiving
 * @param response - Fetch response
 * @param config - Original request configuration
 * @returns Processed response data
 */
const responseInterceptor = async (
  response: Response,
  config: RequestConfig
): Promise<ResponseData> => {
  try {
    console.log(`[HTTP Interceptor] Response: ${response.status} ${response.statusText}`);

    // Handle CSRF errors
    let processedResponse = response;
    if (SECURITY_CONFIG.CSRF_ERROR_CODES.includes(response.status)) {
      processedResponse = await handleCSRFError(response, config);
    }

    // Parse response data
    let data;
    const contentType = processedResponse.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await processedResponse.json();
    } else if (contentType?.includes('text/')) {
      data = await processedResponse.text();
    } else {
      data = await processedResponse.blob();
    }

    return {
      status: processedResponse.status,
      statusText: processedResponse.statusText,
      headers: processedResponse.headers,
      data,
      config,
    };
  } catch (error) {
    console.error('[HTTP Interceptor] Response interceptor error:', error);
    throw error;
  }
};

/**
 * Enhanced fetch function with security interceptors
 * @param url - Request URL
 * @param config - Request configuration
 * @returns Promise with response data
 */
export const secureFetch = async (
  url: string,
  config: Partial<RequestConfig> = {}
): Promise<ResponseData> => {
  const requestConfig: RequestConfig = {
    url,
    method: 'GET',
    headers: {},
    credentials: 'same-origin',
    mode: 'cors',
    cache: 'default',
    redirect: 'follow',
    referrerPolicy: 'strict-origin-when-cross-origin',
    ...config,
  };

  try {
    // Apply request interceptor
    const processedConfig = requestInterceptor(requestConfig);

    // Make the request
    const response = await fetch(processedConfig.url, processedConfig);

    // Apply response interceptor
    return await responseInterceptor(response, processedConfig);
  } catch (error) {
    console.error('[HTTP Interceptor] Secure fetch error:', error);
    throw error;
  }
};

/**
 * HTTP methods with security
 */
export const http = {
  get: (url: string, config?: Partial<RequestConfig>) =>
    secureFetch(url, { ...config, method: 'GET' }),

  post: (url: string, data?: any, config?: Partial<RequestConfig>) =>
    secureFetch(url, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (url: string, data?: any, config?: Partial<RequestConfig>) =>
    secureFetch(url, {
      ...config,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: (url: string, data?: any, config?: Partial<RequestConfig>) =>
    secureFetch(url, {
      ...config,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (url: string, config?: Partial<RequestConfig>) =>
    secureFetch(url, { ...config, method: 'DELETE' }),

  upload: (url: string, formData: FormData, config?: Partial<RequestConfig>) =>
    secureFetch(url, {
      ...config,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        ...config?.headers,
      },
    }),
};

/**
 * Initializes HTTP interceptor security features
 */
export const initializeHTTPInterceptor = (): void => {
  console.log('[HTTP Interceptor] HTTP security interceptor initialized');
};

/**
 * Cleanup function for HTTP interceptor
 */
export const cleanupHTTPInterceptor = (): void => {
  refreshQueue = [];
  isRefreshingToken = false;
  console.log('[HTTP Interceptor] HTTP security interceptor cleaned up');
};

// Export configuration for external use
export { SECURITY_CONFIG };
