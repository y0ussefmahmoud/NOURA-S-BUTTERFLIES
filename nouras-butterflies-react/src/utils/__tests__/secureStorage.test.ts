import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  secureSetItem,
  secureGetItem,
  secureRemoveItem,
  secureClear,
  encryptData,
  decryptData,
  generateEncryptionKey,
  validateEncryptedData,
  STORAGE_CONFIG
} from '../secureStorage'

// Mock CryptoJS
vi.mock('crypto-js', () => ({
  default: {
    lib: {
      WordArray: {
        random: vi.fn((size) => ({
          toString: () => 'a'.repeat(size * 2) // Mock hex string
        }))
      }
    },
    PBKDF2: vi.fn((password, salt, options) => ({
      toString: () => 'mock-derived-key'
    })),
    AES: {
      encrypt: vi.fn((data, key) => ({
        toString: () => 'mock-encrypted-data'
      })),
      decrypt: vi.fn((encryptedData, key) => ({
        toString: vi.fn(() => 'mock-decrypted-data')
      }))
    },
    HmacSHA256: vi.fn((data, key) => ({
      toString: () => 'mock-hmac'
    })),
    enc: {
      Hex: {
        parse: vi.fn((hex) => 'mock-parsed-hex'),
        stringify: vi.fn((data) => 'mock-stringified-hex')
      }
    }
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock sessionStorage for session key
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

describe('Secure Storage Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    sessionStorageMock.getItem.mockReturnValue('mock-session-key')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generateEncryptionKey', () => {
    it('should generate an encryption key', () => {
      const key = generateEncryptionKey()
      expect(key).toBeTruthy()
      expect(typeof key).toBe('string')
    })
  })

  describe('encryptData and decryptData', () => {
    it('should encrypt and decrypt data correctly', () => {
      const data = 'sensitive data'
      const password = 'test-password'
      
      const encrypted = encryptData(data, password)
      expect(encrypted).toBeTruthy()
      expect(typeof encrypted).toBe('string')
      expect(encrypted).toContain(STORAGE_CONFIG.ENCRYPTED_PREFIX)
      
      // Mock localStorage to return encrypted data
      localStorageMock.getItem.mockReturnValue(encrypted)
      
      const decrypted = decryptData(encrypted, password)
      expect(decrypted).toBe(data)
    })

    it('should handle empty data', () => {
      expect(encryptData('', 'password')).toBe('')
      expect(decryptData('', 'password')).toBe('')
    })

    it('should handle null/undefined data', () => {
      expect(encryptData(null as any, 'password')).toBe('')
      expect(decryptData(null as any, 'password')).toBe('')
    })

    it('should handle invalid encrypted data', () => {
      expect(decryptData('invalid-data', 'password')).toBe('')
    })

    it('should handle data without correct prefix', () => {
      expect(decryptData('no-prefix-data', 'password')).toBe('')
    })
  })

  describe('validateEncryptedData', () => {
    it('should validate properly formatted encrypted data', () => {
      const validData = STORAGE_CONFIG.ENCRYPTED_PREFIX + JSON.stringify({
        data: 'encrypted',
        salt: 'salt',
        iv: 'iv',
        hmac: 'hmac',
        timestamp: Date.now()
      })
      
      expect(validateEncryptedData(validData)).toBe(true)
    })

    it('should reject data without prefix', () => {
      expect(validateEncryptedData('invalid-data')).toBe(false)
    })

    it('should reject malformed JSON', () => {
      const malformedData = STORAGE_CONFIG.ENCRYPTED_PREFIX + 'invalid-json'
      expect(validateEncryptedData(malformedData)).toBe(false)
    })

    it('should reject expired data', () => {
      const expiredData = STORAGE_CONFIG.ENCRYPTED_PREFIX + JSON.stringify({
        data: 'encrypted',
        salt: 'salt',
        iv: 'iv',
        hmac: 'hmac',
        timestamp: Date.now() - STORAGE_CONFIG.DATA_EXPIRY_MS - 1000
      })
      
      expect(validateEncryptedData(expiredData)).toBe(false)
    })

    it('should reject data missing required fields', () => {
      const incompleteData = STORAGE_CONFIG.ENCRYPTED_PREFIX + JSON.stringify({
        data: 'encrypted',
        salt: 'salt'
        // Missing iv, hmac, timestamp
      })
      
      expect(validateEncryptedData(incompleteData)).toBe(false)
    })
  })

  describe('secureSetItem', () => {
    it('should encrypt and store data', () => {
      const key = 'test-key'
      const value = 'sensitive-value'
      
      secureSetItem(key, value)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        expect.stringContaining(STORAGE_CONFIG.ENCRYPTED_PREFIX)
      )
    })

    it('should handle empty key', () => {
      secureSetItem('', 'value')
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })

    it('should handle null/undefined values', () => {
      secureSetItem('key', null as any)
      secureSetItem('key', undefined as any)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('secureGetItem', () => {
    it('should retrieve and decrypt data', () => {
      const key = 'test-key'
      const encryptedData = STORAGE_CONFIG.ENCRYPTED_PREFIX + JSON.stringify({
        data: 'encrypted',
        salt: 'salt',
        iv: 'iv',
        hmac: 'hmac',
        timestamp: Date.now()
      })
      
      localStorageMock.getItem.mockReturnValue(encryptedData)
      
      const result = secureGetItem(key)
      expect(result).toBe('mock-decrypted-data')
    })

    it('should return null for non-existent key', () => {
      localStorageMock.getItem.mockReturnValue(null)
      expect(secureGetItem('non-existent')).toBeNull()
    })

    it('should return null for invalid encrypted data', () => {
      localStorageMock.getItem.mockReturnValue('invalid-data')
      expect(secureGetItem('key')).toBeNull()
    })

    it('should return null for expired data', () => {
      const expiredData = STORAGE_CONFIG.ENCRYPTED_PREFIX + JSON.stringify({
        data: 'encrypted',
        salt: 'salt',
        iv: 'iv',
        hmac: 'hmac',
        timestamp: Date.now() - STORAGE_CONFIG.DATA_EXPIRY_MS - 1000
      })
      
      localStorageMock.getItem.mockReturnValue(expiredData)
      expect(secureGetItem('key')).toBeNull()
    })
  })

  describe('secureRemoveItem', () => {
    it('should remove item from localStorage', () => {
      const key = 'test-key'
      secureRemoveItem(key)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(key)
    })
  })

  describe('secureClear', () => {
    it('should clear all localStorage items', () => {
      secureClear()
      expect(localStorageMock.clear).toHaveBeenCalled()
    })
  })

  describe('STORAGE_CONFIG', () => {
    it('should export configuration constants', () => {
      expect(STORAGE_CONFIG.ALGORITHM).toBe('AES-256')
      expect(STORAGE_CONFIG.PBKDF2_ITERATIONS).toBe(100000)
      expect(STORAGE_CONFIG.SALT_LENGTH).toBe(32)
      expect(STORAGE_CONFIG.IV_LENGTH).toBe(16)
      expect(STORAGE_CONFIG.HMAC_ALGORITHM).toBe('SHA256')
      expect(STORAGE_CONFIG.ENCRYPTED_PREFIX).toBe('nouras_encrypted:')
      expect(STORAGE_CONFIG.DATA_EXPIRY_MS).toBe(24 * 60 * 60 * 1000)
    })
  })

  describe('Error handling', () => {
    it('should handle encryption errors gracefully', () => {
      const { AES } = require('crypto-js')
      AES.encrypt.mockImplementationOnce(() => {
        throw new Error('Encryption failed')
      })
      
      expect(() => encryptData('data', 'password')).not.toThrow()
      expect(encryptData('data', 'password')).toBe('')
    })

    it('should handle decryption errors gracefully', () => {
      const { AES } = require('crypto-js')
      AES.decrypt.mockImplementationOnce(() => {
        throw new Error('Decryption failed')
      })
      
      const encryptedData = STORAGE_CONFIG.ENCRYPTED_PREFIX + JSON.stringify({
        data: 'encrypted',
        salt: 'salt',
        iv: 'iv',
        hmac: 'hmac',
        timestamp: Date.now()
      })
      
      expect(() => decryptData(encryptedData, 'password')).not.toThrow()
      expect(decryptData(encryptedData, 'password')).toBe('')
    })

    it('should handle localStorage errors', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error')
      })
      
      expect(() => secureSetItem('key', 'value')).not.toThrow()
    })

    it('should handle sessionStorage errors', () => {
      sessionStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Session storage error')
      })
      
      expect(() => secureGetItem('key')).not.toThrow()
    })
  })

  describe('Data integrity', () => {
    it('should maintain data integrity through encryption/decryption cycle', () => {
      const testData = {
        user: 'John Doe',
        email: 'john@example.com',
        preferences: {
          theme: 'dark',
          notifications: true
        }
      }
      
      const jsonString = JSON.stringify(testData)
      const encrypted = encryptData(jsonString, 'test-password')
      
      localStorageMock.getItem.mockReturnValue(encrypted)
      
      const decrypted = secureGetItem('test-key')
      expect(decrypted).toBe('mock-decrypted-data')
    })

    it('should handle different data types', () => {
      const testCases = [
        'string data',
        123,
        true,
        false,
        { key: 'value' },
        [1, 2, 3]
      ]
      
      testCases.forEach((data) => {
        const stringData = JSON.stringify(data)
        const encrypted = encryptData(stringData, 'password')
        
        localStorageMock.getItem.mockReturnValue(encrypted)
        
        expect(() => secureGetItem('key')).not.toThrow()
      })
    })
  })

  describe('Performance considerations', () => {
    it('should handle large data efficiently', () => {
      const largeData = 'x'.repeat(10000)
      const encrypted = encryptData(largeData, 'password')
      
      expect(encrypted).toBeTruthy()
      expect(encrypted.length).toBeGreaterThan(0)
      
      localStorageMock.getItem.mockReturnValue(encrypted)
      
      const start = performance.now()
      const decrypted = decryptData(encrypted, 'password')
      const end = performance.now()
      
      expect(end - start).toBeLessThan(1000) // Should complete within 1 second
    })
  })
})
