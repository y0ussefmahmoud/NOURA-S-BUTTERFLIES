import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateRequired,
  validatePostalCode,
  validateAddress,
  validateCity,
  validateCountry,
  validateMinLength,
  validateMaxLength,
  validateNumeric,
  validatePositiveNumber,
  validateURL,
  validateShippingAddress,
  validatePaymentDetails,
  getPasswordStrength,
  getPhoneErrorMessage,
  createDebouncedValidator,
  validateFieldProgressive,
  validateTextInput
} from '../validation'

// Mock the sanitization functions
vi.mock('../sanitization', () => ({
  sanitizeInput: (value: string) => value.trim(),
  sanitizeEmail: (value: string) => value.trim().toLowerCase(),
  sanitizeName: (value: string) => value.trim(),
  sanitizePhone: (value: string) => value.replace(/\D/g, ''),
  sanitizeURL: (value: string) => value.trim(),
  detectSQLInjection: () => false
}))

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com').isValid).toBe(true)
      expect(validateEmail('user.name@domain.co.uk').isValid).toBe(true)
      expect(validateEmail('user+tag@example.org').isValid).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid').isValid).toBe(false)
      expect(validateEmail('test@').isValid).toBe(false)
      expect(validateEmail('@example.com').isValid).toBe(false)
      expect(validateEmail('test@.com').isValid).toBe(false)
      expect(validateEmail('').isValid).toBe(false)
    })

    it('should sanitize email input', () => {
      const result = validateEmail('  TEST@EXAMPLE.COM  ')
      expect(result.sanitized).toBe('test@example.com')
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Password123').isValid).toBe(true)
      expect(validatePassword('MyP@ssw0rd').isValid).toBe(true)
      expect(validatePassword('SecurePass1').isValid).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(validatePassword('short').isValid).toBe(false)
      expect(validatePassword('12345678').isValid).toBe(false)
      expect(validatePassword('onlyletters').isValid).toBe(false)
      expect(validatePassword('').isValid).toBe(false)
    })

    it('should sanitize password input', () => {
      const result = validatePassword('  Password123  ')
      expect(result.sanitized).toBe('Password123')
    })
  })

  describe('validatePhone', () => {
    it('should validate Saudi phone numbers', () => {
      expect(validatePhone('0501234567').isValid).toBe(true)
      expect(validatePhone('0511234567').isValid).toBe(true)
      expect(validatePhone('0571234567').isValid).toBe(true)
      expect(validatePhone('966501234567').isValid).toBe(true)
      expect(validatePhone('00966501234567').isValid).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123').isValid).toBe(false)
      expect(validatePhone('0301234567').isValid).toBe(false)
      expect(validatePhone('050123456').isValid).toBe(false)
      expect(validatePhone('abc').isValid).toBe(false)
      expect(validatePhone('').isValid).toBe(false)
    })

    it('should sanitize phone input', () => {
      const result = validatePhone('05-012-345-67')
      expect(result.sanitized).toBe('0501234567')
    })
  })

  describe('validateName', () => {
    it('should validate correct names', () => {
      expect(validateName('John Doe').isValid).toBe(true)
      expect(validateName('محمد أحمد').isValid).toBe(true)
      expect(validateName('Mary-Jane O\'Connor').isValid).toBe(true)
    })

    it('should reject invalid names', () => {
      expect(validateName('John123').isValid).toBe(false)
      expect(validateName('').isValid).toBe(false)
      expect(validateName('  ').isValid).toBe(false)
      expect(validateName('John@Doe').isValid).toBe(false)
    })
  })

  describe('validateCardNumber', () => {
    it('should validate valid card numbers', () => {
      expect(validateCardNumber('4111111111111111')).toBe(true) // Visa test number
      expect(validateCardNumber('4111 1111 1111 1111')).toBe(true) // With spaces
      expect(validateCardNumber('4111-1111-1111-1111')).toBe(true) // With dashes
    })

    it('should reject invalid card numbers', () => {
      expect(validateCardNumber('1234567890123456')).toBe(false)
      expect(validateCardNumber('4111111111111112')).toBe(false)
      expect(validateCardNumber('1234')).toBe(false)
      expect(validateCardNumber('')).toBe(false)
      expect(validateCardNumber('abcd1234')).toBe(false)
    })
  })

  describe('validateExpiryDate', () => {
    it('should validate future expiry dates', () => {
      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + 2)
      const month = String(futureDate.getMonth() + 1).padStart(2, '0')
      const year = String(futureDate.getFullYear() % 100).padStart(2, '0')
      
      expect(validateExpiryDate(`${month}/${year}`)).toBe(true)
    })

    it('should reject past expiry dates', () => {
      expect(validateExpiryDate('01/20')).toBe(false)
      expect(validateExpiryDate('12/22')).toBe(false)
    })

    it('should reject invalid formats', () => {
      expect(validateExpiryDate('13/25')).toBe(false)
      expect(validateExpiryDate('00/25')).toBe(false)
      expect(validateExpiryDate('1/25')).toBe(false)
      expect(validateExpiryDate('12/5')).toBe(false)
      expect(validateExpiryDate('2025')).toBe(false)
    })
  })

  describe('validateCVV', () => {
    it('should validate 3-digit CVV', () => {
      expect(validateCVV('123')).toBe(true)
      expect(validateCVV('999')).toBe(true)
    })

    it('should validate 4-digit CVV', () => {
      expect(validateCVV('1234')).toBe(true)
      expect(validateCVV('9999')).toBe(true)
    })

    it('should reject invalid CVV', () => {
      expect(validateCVV('12')).toBe(false)
      expect(validateCVV('12345')).toBe(false)
      expect(validateCVV('abc')).toBe(false)
      expect(validateCVV('')).toBe(false)
    })
  })

  describe('validateRequired', () => {
    it('should pass for non-empty values', () => {
      expect(validateRequired('test', 'Field')).toBeNull()
      expect(validateRequired('  test  ', 'Field')).toBeNull()
    })

    it('should fail for empty values', () => {
      expect(validateRequired('', 'Field')).toBe('Field is required')
      expect(validateRequired('   ', 'Field')).toBe('Field is required')
      expect(validateRequired(null as any, 'Field')).toBe('Field is required')
    })
  })

  describe('validatePostalCode', () => {
    it('should validate 5-digit postal codes', () => {
      expect(validatePostalCode('12345')).toBe(true)
      expect(validatePostalCode('00000')).toBe(true)
    })

    it('should reject invalid postal codes', () => {
      expect(validatePostalCode('1234')).toBe(false)
      expect(validatePostalCode('123456')).toBe(false)
      expect(validatePostalCode('abcde')).toBe(false)
    })
  })

  describe('validateAddress', () => {
    it('should validate valid addresses', () => {
      expect(validateAddress('123 Main Street').isValid).toBe(true)
      expect(validateAddress('شارع الملك فهد، الرياض').isValid).toBe(true)
    })

    it('should reject short addresses', () => {
      expect(validateAddress('123').isValid).toBe(false)
      expect(validateAddress('').isValid).toBe(false)
    })
  })

  describe('validateCity', () => {
    it('should validate valid cities', () => {
      expect(validateCity('Riyadh').isValid).toBe(true)
      expect(validateCity('الرياض').isValid).toBe(true)
      expect(validateCity('New York').isValid).toBe(true)
    })

    it('should reject invalid cities', () => {
      expect(validateCity('City123').isValid).toBe(false)
      expect(validateCity('').isValid).toBe(false)
    })
  })

  describe('validateMinLength', () => {
    it('should pass for strings meeting minimum length', () => {
      expect(validateMinLength('test', 3, 'Field')).toBeNull()
      expect(validateMinLength('test', 4, 'Field')).toBeNull()
    })

    it('should fail for strings below minimum length', () => {
      expect(validateMinLength('test', 5, 'Field')).toBe('Field must be at least 5 characters long')
    })
  })

  describe('validateMaxLength', () => {
    it('should pass for strings within maximum length', () => {
      expect(validateMaxLength('test', 5, 'Field')).toBeNull()
      expect(validateMaxLength('test', 4, 'Field')).toBeNull()
    })

    it('should fail for strings exceeding maximum length', () => {
      expect(validateMaxLength('testing', 5, 'Field')).toBe('Field must not exceed 5 characters')
    })
  })

  describe('validateNumeric', () => {
    it('should validate numeric strings', () => {
      expect(validateNumeric('123')).toBe(true)
      expect(validateNumeric('0')).toBe(true)
    })

    it('should reject non-numeric strings', () => {
      expect(validateNumeric('123abc')).toBe(false)
      expect(validateNumeric('abc')).toBe(false)
      expect(validateNumeric('12.3')).toBe(false)
    })
  })

  describe('validatePositiveNumber', () => {
    it('should validate positive numbers', () => {
      expect(validatePositiveNumber(1)).toBe(true)
      expect(validatePositiveNumber(100.5)).toBe(true)
    })

    it('should reject non-positive numbers', () => {
      expect(validatePositiveNumber(0)).toBe(false)
      expect(validatePositiveNumber(-1)).toBe(false)
      expect(validatePositiveNumber(NaN)).toBe(false)
    })
  })

  describe('validateURL', () => {
    it('should validate valid URLs', () => {
      expect(validateURL('https://example.com').isValid).toBe(true)
      expect(validateURL('http://localhost:3000').isValid).toBe(true)
      expect(validateURL('https://www.example.com/path').isValid).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validateURL('not-a-url').isValid).toBe(false)
      expect(validateURL('').isValid).toBe(false)
      expect(validateURL('ftp://example.com').isValid).toBe(true) // FTP is valid URL protocol
    })
  })

  describe('validateShippingAddress', () => {
    it('should validate complete shipping address', () => {
      const address = {
        fullName: 'John Doe',
        phone: '0501234567',
        streetAddress: '123 Main Street',
        city: 'Riyadh',
        postalCode: '12345',
        country: 'Saudi Arabia'
      }
      
      const result = validateShippingAddress(address)
      expect(Object.keys(result.errors)).toHaveLength(0)
      expect(result.sanitized.fullName).toBe('John Doe')
    })

    it('should return errors for invalid address', () => {
      const address = {
        fullName: '',
        phone: '123',
        streetAddress: '123',
        city: '',
        postalCode: '123',
        country: ''
      }
      
      const result = validateShippingAddress(address)
      expect(Object.keys(result.errors)).toHaveLength(6)
    })
  })

  describe('validatePaymentDetails', () => {
    it('should validate complete payment details', () => {
      const payment = {
        cardholderName: 'John Doe',
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123'
      }
      
      const result = validatePaymentDetails(payment)
      expect(Object.keys(result.errors)).toHaveLength(0)
      expect(result.sanitized.cardholderName).toBe('John Doe')
    })

    it('should return errors for invalid payment details', () => {
      const payment = {
        cardholderName: '',
        cardNumber: '123',
        expiryDate: '13/20',
        cvv: '12'
      }
      
      const result = validatePaymentDetails(payment)
      expect(Object.keys(result.errors)).toHaveLength(4)
    })
  })

  describe('getPasswordStrength', () => {
    it('should rate strong passwords highly', () => {
      expect(getPasswordStrength('MyP@ssw0rd123')).toBe('strong')
      expect(getPasswordStrength('SecurePass123!')).toBe('strong')
    })

    it('should rate medium passwords', () => {
      expect(getPasswordStrength('Password123')).toBe('medium')
      expect(getPasswordStrength('mypassword1')).toBe('medium')
    })

    it('should rate weak passwords', () => {
      expect(getPasswordStrength('weak')).toBe('weak')
      expect(getPasswordStrength('12345678')).toBe('weak')
    })
  })

  describe('getPhoneErrorMessage', () => {
    it('should return appropriate error messages', () => {
      expect(getPhoneErrorMessage('')).toBe('رقم الهاتف مطلوب')
      expect(getPhoneErrorMessage('123')).toContain('رقم الهاتف غير صحيح')
    })

    it('should return null for valid phone numbers', () => {
      expect(getPhoneErrorMessage('0501234567')).toBeNull()
    })
  })

  describe('createDebouncedValidator', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should debounce validation calls', async () => {
      const mockValidator = vi.fn().mockResolvedValue('error')
      const debouncedValidator = createDebouncedValidator(mockValidator, 100)

      const promise1 = debouncedValidator('test')
      const promise2 = debouncedValidator('test2')
      const promise3 = debouncedValidator('test3')

      expect(mockValidator).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      await Promise.all([promise1, promise2, promise3])

      expect(mockValidator).toHaveBeenCalledTimes(1)
      expect(mockValidator).toHaveBeenCalledWith('test3')
    })
  })

  describe('validateFieldProgressive', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should validate required field first', async () => {
      const result = await validateFieldProgressive('', {
        required: true,
        requiredMessage: 'Field is required'
      })
      expect(result).toBe('Field is required')
    })

    it('should validate format after delay', async () => {
      const formatValidator = vi.fn().mockReturnValue('Invalid format')
      const promise = validateFieldProgressive('test', {
        formatValidator
      })

      vi.advanceTimersByTime(300)
      const result = await promise

      expect(formatValidator).toHaveBeenCalledWith('test')
      expect(result).toBe('Invalid format')
    })

    it('should validate async after additional delay', async () => {
      const asyncValidator = vi.fn().mockResolvedValue('Async error')
      const promise = validateFieldProgressive('test', {
        asyncValidator
      })

      vi.advanceTimersByTime(800) // 300 + 500
      const result = await promise

      expect(asyncValidator).toHaveBeenCalledWith('test')
      expect(result).toBe('Async error')
    })
  })

  describe('validateTextInput', () => {
    it('should validate text with default options', () => {
      const result = validateTextInput('John Doe')
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe('John Doe')
    })

    it('should validate with custom regex', () => {
      const result = validateTextInput('ABC123', {
        regex: /^[A-Z0-9]+$/
      })
      expect(result.isValid).toBe(true)
    })

    it('should validate with custom length', () => {
      const result = validateTextInput('A', {
        minLength: 1
      })
      expect(result.isValid).toBe(true)
    })
  })
})
