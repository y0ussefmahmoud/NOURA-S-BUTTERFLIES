import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  sanitizeHTML,
  sanitizeInput,
  sanitizeURL,
  sanitizeEmail,
  sanitizeName,
  sanitizePhone,
  sanitizeFormData,
  sanitizeByType,
  detectSQLInjection,
  validateFileUpload,
  escapeHTML,
  domPurifyConfig
} from '../sanitization'

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((html: string) => html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''))
  }
}))

// Mock validator
vi.mock('validator', () => ({
  default: {
    isURL: vi.fn((url: string) => {
      return /^https?:\/\/.+/.test(url)
    }),
    isEmail: vi.fn((email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    })
  }
}))

// Mock logger
vi.mock('../logger', () => ({
  logger: {
    error: vi.fn()
  }
}))

// Mock document for escapeHTML
Object.defineProperty(window, 'document', {
  value: {
    createElement: vi.fn(() => ({
      textContent: '',
      innerHTML: ''
    }))
  },
  writable: true
})

describe('Sanitization Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sanitizeHTML', () => {
    it('should remove script tags', () => {
      const maliciousHTML = '<script>alert("xss")</script><p>Safe content</p>'
      const result = sanitizeHTML(maliciousHTML)
      expect(result).not.toContain('<script>')
      expect(result).toContain('<p>Safe content</p>')
    })

    it('should handle empty input', () => {
      expect(sanitizeHTML('')).toBe('')
      expect(sanitizeHTML(null as any)).toBe('')
      expect(sanitizeHTML(undefined as any)).toBe('')
    })

    it('should handle non-string input', () => {
      expect(sanitizeHTML(123 as any)).toBe('')
      expect(sanitizeHTML({} as any)).toBe('')
    })

    it('should handle errors gracefully', () => {
      const { DOMPurify } = require('dompurify')
      DOMPurify.sanitize.mockImplementationOnce(() => {
        throw new Error('Test error')
      })
      
      expect(sanitizeHTML('<p>test</p>')).toBe('')
    })
  })

  describe('sanitizeInput', () => {
    it('should remove dangerous patterns', () => {
      const maliciousInput = 'javascript:alert("xss")'
      const result = sanitizeInput(maliciousInput)
      expect(result).not.toContain('javascript:')
    })

    it('should trim whitespace', () => {
      const input = '  test input  '
      expect(sanitizeInput(input)).toBe('test input')
    })

    it('should remove control characters', () => {
      const input = 'test\x00\x1F\x7Finput'
      expect(sanitizeInput(input)).toBe('testinput')
    })

    it('should limit length to prevent DoS', () => {
      const longInput = 'a'.repeat(15000)
      const result = sanitizeInput(longInput)
      expect(result.length).toBe(10000)
    })

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput(null as any)).toBe('')
    })
  })

  describe('sanitizeURL', () => {
    it('should allow valid HTTP/HTTPS URLs', () => {
      expect(sanitizeURL('https://example.com')).toBe('https://example.com')
      expect(sanitizeURL('http://localhost:3000')).toBe('http://localhost:3000')
    })

    it('should reject dangerous protocols', () => {
      expect(sanitizeURL('javascript:alert("xss")')).toBe('')
      expect(sanitizeURL('vbscript:msgbox("xss")')).toBe('')
      expect(sanitizeURL('data:text/html,<script>alert("xss")</script>')).toBe('')
      expect(sanitizeURL('file:///etc/passwd')).toBe('')
    })

    it('should reject invalid URLs', () => {
      expect(sanitizeURL('not-a-url')).toBe('')
      expect(sanitizeURL('ftp://example.com')).toBe('')
    })

    it('should handle empty input', () => {
      expect(sanitizeURL('')).toBe('')
      expect(sanitizeURL(null as any)).toBe('')
    })
  })

  describe('sanitizeEmail', () => {
    it('should validate and sanitize valid emails', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com')
      expect(sanitizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com')
    })

    it('should reject invalid emails', () => {
      expect(sanitizeEmail('invalid')).toBe('')
      expect(sanitizeEmail('test@')).toBe('')
      expect(sanitizeEmail('@example.com')).toBe('')
    })

    it('should reject emails with injection patterns', () => {
      expect(sanitizeEmail('test@example.com\r\nBcc: victim@example.com')).toBe('')
      expect(sanitizeEmail('test@example.com\nCc: victim@example.com')).toBe('')
    })

    it('should handle empty input', () => {
      expect(sanitizeEmail('')).toBe('')
      expect(sanitizeEmail(null as any)).toBe('')
    })
  })

  describe('sanitizeName', () => {
    it('should sanitize valid names', () => {
      expect(sanitizeName('John Doe')).toBe('John Doe')
      expect(sanitizeName('محمد أحمد')).toBe('محمد أحمد')
    })

    it('should remove dangerous characters', () => {
      expect(sanitizeName('John<script>alert("xss")</script>Doe')).toBe('JohnDoe')
      expect(sanitizeName('John"Doe')).toBe('JohnDoe')
    })

    it('should limit length', () => {
      const longName = 'a'.repeat(150)
      const result = sanitizeName(longName)
      expect(result.length).toBe(100)
    })

    it('should handle empty input', () => {
      expect(sanitizeName('')).toBe('')
      expect(sanitizeName(null as any)).toBe('')
    })
  })

  describe('sanitizePhone', () => {
    it('should sanitize valid phone numbers', () => {
      expect(sanitizePhone('0501234567')).toBe('0501234567')
      expect(sanitizePhone('+966501234567')).toBe('+966501234567')
      expect(sanitizePhone('05-012-345-67')).toBe('05-012-345-67')
    })

    it('should reject invalid phone numbers', () => {
      expect(sanitizePhone('123')).toBe('')
      expect(sanitizePhone('abc')).toBe('')
      expect(sanitizePhone('050123456')).toBe('')
    })

    it('should handle empty input', () => {
      expect(sanitizePhone('')).toBe('')
      expect(sanitizePhone(null as any)).toBe('')
    })
  })

  describe('sanitizeFormData', () => {
    it('should sanitize form data recursively', () => {
      const data = {
        name: '<script>alert("xss")</script>John',
        email: '  TEST@EXAMPLE.COM  ',
        address: {
          street: '123 Main St',
          city: 'Riyadh'
        },
        hobbies: ['reading', '<script>alert("xss")</script>coding']
      }

      const result = sanitizeFormData(data)
      
      expect(result.name).not.toContain('<script>')
      expect(result.email).toBe('test@example.com')
      expect(result.address.street).toBe('123 Main St')
      expect(result.hobbies[1]).not.toContain('<script>')
    })

    it('should handle null and undefined values', () => {
      const data = {
        name: null,
        email: undefined,
        age: 25
      }

      const result = sanitizeFormData(data)
      
      expect(result.name).toBeNull()
      expect(result.email).toBeUndefined()
      expect(result.age).toBe(25)
    })

    it('should handle empty input', () => {
      expect(sanitizeFormData(null as any)).toEqual({})
      expect(sanitizeFormData(undefined as any)).toEqual({})
    })
  })

  describe('sanitizeByType', () => {
    it('should route to correct sanitizer based on type', () => {
      expect(sanitizeByType('test@example.com', 'email')).toBe('test@example.com')
      expect(sanitizeByType('John Doe', 'name')).toBe('John Doe')
      expect(sanitizeByType('https://example.com', 'url')).toBe('https://example.com')
      expect(sanitizeByType('<p>test</p>', 'html')).toBe('<p>test</p>')
      expect(sanitizeByType('0501234567', 'phone')).toBe('0501234567')
      expect(sanitizeByType('test', 'text')).toBe('test')
    })

    it('should default to text sanitizer for unknown type', () => {
      expect(sanitizeByType('test', 'unknown' as any)).toBe('test')
    })
  })

  describe('detectSQLInjection', () => {
    it('should detect SQL injection patterns', () => {
      expect(detectSQLInjection("SELECT * FROM users")).toBe(true)
      expect(detectSQLInjection("'; DROP TABLE users; --")).toBe(true)
      expect(detectSQLInjection("' OR '1'='1")).toBe(true)
      expect(detectSQLInjection("UNION SELECT * FROM passwords")).toBe(true)
      expect(detectSQLInjection("INSERT INTO users VALUES")).toBe(true)
      expect(detectSQLInjection("DELETE FROM users WHERE")).toBe(true)
      expect(detectSQLInjection("UPDATE users SET")).toBe(true)
      expect(detectSQLInjection("EXEC xp_cmdshell")).toBe(true)
    })

    it('should not detect false positives', () => {
      expect(detectSQLInjection("This is a normal sentence")).toBe(false)
      expect(detectSQLInjection("I selected the red option")).toBe(false)
      expect(detectSQLInjection("Please update your profile")).toBe(false)
      expect(detectSQLInjection("The user deleted the file")).toBe(false)
    })

    it('should handle empty input', () => {
      expect(detectSQLInjection('')).toBe(false)
      expect(detectSQLInjection(null as any)).toBe(false)
      expect(detectSQLInjection(undefined as any)).toBe(false)
    })
  })

  describe('validateFileUpload', () => {
    it('should validate allowed file types', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      expect(validateFileUpload(file, ['image/jpeg'])).toBe(true)
    })

    it('should reject disallowed file types', () => {
      const file = new File(['content'], 'test.php', { type: 'application/x-php' })
      expect(validateFileUpload(file, ['image/jpeg'])).toBe(false)
    })

    it('should validate file size', () => {
      const largeFile = new File(['content'.repeat(1000000)], 'large.jpg', { type: 'image/jpeg' })
      expect(validateFileUpload(largeFile, ['image/jpeg'], 1000)).toBe(false)
    })

    it('should reject suspicious file names', () => {
      const suspiciousFile = new File(['content'], '../malicious.jpg', { type: 'image/jpeg' })
      expect(validateFileUpload(suspiciousFile)).toBe(false)
    })

    it('should handle null input', () => {
      expect(validateFileUpload(null as any)).toBe(false)
    })
  })

  describe('escapeHTML', () => {
    it('should escape HTML entities', () => {
      const mockElement = {
        textContent: '',
        innerHTML: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      }
      
      document.createElement.mockReturnValue(mockElement)
      
      const result = escapeHTML('<script>alert("xss")</script>')
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    })

    it('should handle empty input', () => {
      expect(escapeHTML('')).toBe('')
      expect(escapeHTML(null as any)).toBe('')
    })
  })

  describe('domPurifyConfig', () => {
    it('should export correct configuration', () => {
      expect(domPurifyConfig).toBeDefined()
      expect(domPurifyConfig.ALLOWED_TAGS).toContain('p')
      expect(domPurifyConfig.FORBID_TAGS).toContain('script')
      expect(domPurifyConfig.SANITIZE_DOM).toBe(true)
    })
  })
})
