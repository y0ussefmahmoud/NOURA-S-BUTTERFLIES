import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateCSRFToken,
  setCSRFToken,
  getCSRFToken,
  validateCSRFToken,
  clearCSRFToken,
  refreshCSRFToken,
  hasValidCSRFToken,
  ensureCSRFToken,
  addCSRFToHeaders,
  validateCSRFFromHeaders,
  csrfMiddleware,
  initializeCSRFProtection,
  cleanupCSRFProtection,
  validateOrigin,
  getCurrentOrigin,
  addCSRFToFormData,
  validateCSRFFromFormData,
  CSRF_CONFIG
} from '../csrf'

// Mock crypto API
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn((array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    })
  },
  writable: true
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
})

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://example.com'
  },
  writable: true
})

// Mock console methods
const consoleSpy = {
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  log: vi.spyOn(console, 'log').mockImplementation(() => {})
}

describe('CSRF Protection Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorageMock.getItem.mockReturnValue(null)
    sessionStorageMock.setItem.mockImplementation(() => {})
    sessionStorageMock.removeItem.mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generateCSRFToken', () => {
    it('should generate a token of correct length', () => {
      const token = generateCSRFToken()
      expect(token).toHaveLength(64) // 32 bytes * 2 hex chars
      expect(/^[a-f0-9]{64}$/.test(token)).toBe(true)
    })

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken()
      const token2 = generateCSRFToken()
      expect(token1).not.toBe(token2)
    })

    it('should handle crypto API failure gracefully', () => {
      const originalGetRandomValues = crypto.getRandomValues
      crypto.getRandomValues = vi.fn().mockImplementation(() => {
        throw new Error('Crypto API failed')
      })

      const token = generateCSRFToken()
      expect(token).toBeTruthy()
      expect(token.length).toBeGreaterThan(0)

      crypto.getRandomValues = originalGetRandomValues
    })
  })

  describe('setCSRFToken and getCSRFToken', () => {
    it('should store and retrieve token', () => {
      const token = 'test-token'
      setCSRFToken(token)
      
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        CSRF_CONFIG.TOKEN_KEY,
        token
      )
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        expect.stringContaining('expiry'),
        expect.any(String)
      )
    })

    it('should retrieve valid token', () => {
      const token = 'test-token'
      const expiry = (Date.now() + 3600000).toString()
      
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return expiry
        return null
      })

      const retrieved = getCSRFToken()
      expect(retrieved).toBe(token)
    })

    it('should return null for expired token', () => {
      const token = 'test-token'
      const expiredExpiry = (Date.now() - 3600000).toString()
      
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return expiredExpiry
        return null
      })

      const retrieved = getCSRFToken()
      expect(retrieved).toBeNull()
      expect(sessionStorageMock.removeItem).toHaveBeenCalledTimes(2)
    })

    it('should return null when no token exists', () => {
      sessionStorageMock.getItem.mockReturnValue(null)
      const retrieved = getCSRFToken()
      expect(retrieved).toBeNull()
    })
  })

  describe('validateCSRFToken', () => {
    it('should validate matching tokens', () => {
      const token = 'test-token'
      
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      expect(validateCSRFToken(token)).toBe(true)
    })

    it('should reject non-matching tokens', () => {
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return 'different-token'
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      expect(validateCSRFToken('test-token')).toBe(false)
    })

    it('should reject null tokens', () => {
      expect(validateCSRFToken('')).toBe(false)
      expect(validateCSRFToken(null as any)).toBe(false)
    })
  })

  describe('clearCSRFToken', () => {
    it('should clear token from sessionStorage', () => {
      clearCSRFToken()
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(CSRF_CONFIG.TOKEN_KEY)
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(
        expect.stringContaining('expiry')
      )
    })
  })

  describe('refreshCSRFToken', () => {
    it('should generate and store new token', () => {
      const newToken = refreshCSRFToken()
      expect(newToken).toBeTruthy()
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        CSRF_CONFIG.TOKEN_KEY,
        newToken
      )
    })
  })

  describe('hasValidCSRFToken', () => {
    it('should return true when valid token exists', () => {
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return 'test-token'
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      expect(hasValidCSRFToken()).toBe(true)
    })

    it('should return false when no valid token exists', () => {
      sessionStorageMock.getItem.mockReturnValue(null)
      expect(hasValidCSRFToken()).toBe(false)
    })
  })

  describe('ensureCSRFToken', () => {
    it('should return existing token if valid', () => {
      const existingToken = 'existing-token'
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return existingToken
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      const token = ensureCSRFToken()
      expect(token).toBe(existingToken)
    })

    it('should generate new token if none exists', () => {
      sessionStorageMock.getItem.mockReturnValue(null)
      const token = ensureCSRFToken()
      expect(token).toBeTruthy()
      expect(sessionStorageMock.setItem).toHaveBeenCalled()
    })
  })

  describe('addCSRFToHeaders', () => {
    it('should add CSRF token to headers', () => {
      const token = 'test-token'
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      const headers = addCSRFToHeaders({ 'Content-Type': 'application/json' })
      expect(headers['X-CSRF-Token']).toBe(token)
      expect(headers['Content-Type']).toBe('application/json')
    })

    it('should not modify headers if no token exists', () => {
      sessionStorageMock.getItem.mockReturnValue(null)
      const headers = addCSRFToHeaders({ 'Content-Type': 'application/json' })
      expect(headers['X-CSRF-Token']).toBeUndefined()
      expect(headers['Content-Type']).toBe('application/json')
    })
  })

  describe('validateCSRFFromHeaders', () => {
    it('should validate CSRF token from headers', () => {
      const token = 'test-token'
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      const headers = { 'X-CSRF-Token': token }
      expect(validateCSRFFromHeaders(headers)).toBe(true)
    })

    it('should handle case-insensitive header names', () => {
      const token = 'test-token'
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      const headers = { 'x-csrf-token': token }
      expect(validateCSRFFromHeaders(headers)).toBe(true)
    })
  })

  describe('csrfMiddleware', () => {
    it('should add CSRF token to state-changing requests', () => {
      const token = 'test-token'
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      const config = { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      const result = csrfMiddleware(config)
      
      expect(result.headers['X-CSRF-Token']).toBe(token)
    })

    it('should not add CSRF token to GET requests', () => {
      const config = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      const result = csrfMiddleware(config)
      
      expect(result.headers['X-CSRF-Token']).toBeUndefined()
    })

    it('should handle case-insensitive methods', () => {
      const token = 'test-token'
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      const config = { method: 'post', headers: {} }
      const result = csrfMiddleware(config)
      
      expect(result.headers['X-CSRF-Token']).toBe(token)
    })
  })

  describe('validateOrigin', () => {
    it('should validate allowed origins', () => {
      const allowedOrigins = ['https://example.com', 'https://api.example.com']
      expect(validateOrigin('https://example.com', allowedOrigins)).toBe(true)
      expect(validateOrigin('https://api.example.com', allowedOrigins)).toBe(true)
    })

    it('should reject disallowed origins', () => {
      const allowedOrigins = ['https://example.com']
      expect(validateOrigin('https://malicious.com', allowedOrigins)).toBe(false)
    })

    it('should use current origin as default', () => {
      expect(validateOrigin('https://example.com')).toBe(true)
      expect(validateOrigin('https://malicious.com')).toBe(false)
    })
  })

  describe('getCurrentOrigin', () => {
    it('should return current origin', () => {
      expect(getCurrentOrigin()).toBe('https://example.com')
    })
  })

  describe('addCSRFToFormData', () => {
    it('should add CSRF token to FormData', () => {
      const token = 'test-token'
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      const formData = new FormData()
      formData.set('name', 'John')
      
      const result = addCSRFToFormData(formData)
      expect(result.get('csrf_token')).toBe(token)
      expect(result.get('name')).toBe('John')
    })
  })

  describe('validateCSRFFromFormData', () => {
    it('should validate CSRF token from FormData', () => {
      const token = 'test-token'
      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === CSRF_CONFIG.TOKEN_KEY) return token
        if (key.includes('expiry')) return (Date.now() + 3600000).toString()
        return null
      })

      const formData = new FormData()
      formData.set('csrf_token', token)
      
      expect(validateCSRFFromFormData(formData)).toBe(true)
    })

    it('should reject FormData without CSRF token', () => {
      const formData = new FormData()
      formData.set('name', 'John')
      
      expect(validateCSRFFromFormData(formData)).toBe(false)
    })
  })

  describe('CSRF_CONFIG', () => {
    it('should export configuration constants', () => {
      expect(CSRF_CONFIG.TOKEN_KEY).toBe('nouras-csrf-token')
    })
  })

  describe('initializeCSRFProtection', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should initialize CSRF protection', () => {
      initializeCSRFProtection()
      expect(consoleSpy.log).toHaveBeenCalledWith('[CSRF] CSRF protection initialized')
    })

    it('should set up token refresh interval', () => {
      initializeCSRFProtection()
      
      // Fast-forward time
      vi.advanceTimersByTime(30 * 60 * 1000) // 30 minutes
      
      expect(sessionStorageMock.setItem).toHaveBeenCalled()
    })
  })

  describe('cleanupCSRFProtection', () => {
    it('should clean up CSRF protection', () => {
      cleanupCSRFProtection()
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(CSRF_CONFIG.TOKEN_KEY)
      expect(consoleSpy.log).toHaveBeenCalledWith('[CSRF] CSRF protection cleaned up')
    })
  })
})
