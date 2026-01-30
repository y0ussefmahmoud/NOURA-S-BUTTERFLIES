/**
 * Form validation utilities for checkout and cart functionality
 * Enhanced with security sanitization
 */

import {
  sanitizeInput,
  sanitizeEmail,
  sanitizeName,
  sanitizePhone,
  sanitizeURL,
  detectSQLInjection,
} from './sanitization';

export type PasswordStrength = 'weak' | 'medium' | 'strong';

type ValidationResult = { isValid: boolean; sanitized: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const PHONE_REGEX = /^(00966|966)?5\d{8}$/;
const LOCAL_PHONE_REGEX = /^05\d{8}$/;
const POSTAL_CODE_REGEX = /^\d{5}$/;
const NAME_REGEX = /^[a-zA-Z\s\u0600-\u06FF\-'.]+$/;
const CITY_REGEX = /^[a-zA-Z\s\u0600-\u06FF\-']+$/;

const createSanitizedValidator = (
  sanitizeFn: (value: string, maxLength?: number) => string,
  regex?: RegExp,
  minLength = 2
) => {
  return (value: string, maxLength?: number): ValidationResult => {
    const sanitized = sanitizeFn(value, maxLength);
    const matches = regex ? regex.test(sanitized) : true;
    return {
      isValid: matches && sanitized.trim().length >= minLength,
      sanitized,
    };
  };
};

export const validateTextInput = (
  value: string,
  options: {
    maxLength?: number;
    minLength?: number;
    regex?: RegExp;
  } = {}
): ValidationResult => {
  const { maxLength, minLength = 2, regex = NAME_REGEX } = options;
  const validator = createSanitizedValidator(sanitizeName, regex, minLength);
  return validator(value, maxLength);
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  const sanitized = sanitizeInput(password);
  const lengthScore = sanitized.length >= 12 ? 2 : sanitized.length >= 8 ? 1 : 0;
  const hasNumber = /\d/.test(sanitized) ? 1 : 0;
  const hasSymbol = /[^A-Za-z0-9]/.test(sanitized) ? 1 : 0;
  const hasUpper = /[A-Z]/.test(sanitized) ? 1 : 0;

  const score = lengthScore + hasNumber + hasSymbol + hasUpper;
  if (score >= 4) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
};

/**
 * Creates a debounced validator for async or sync validation functions.
 * Useful for reducing validation calls while the user types.
 */
export const createDebouncedValidator = <T>(
  validator: (value: T) => Promise<string | null> | string | null,
  delay = 300
) => {
  let timeoutId: number | null = null;

  return (value: T) =>
    new Promise<string | null>((resolve) => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(async () => {
        const result = await validator(value);
        resolve(result);
        timeoutId = null;
      }, delay);
    });
};

/**
 * Validates a field progressively, handling required checks, format validation,
 * and optional async validation with controlled delays.
 */
export const validateFieldProgressive = async (
  value: string,
  options: {
    required?: boolean;
    requiredMessage?: string;
    formatValidator?: (value: string) => string | null;
    asyncValidator?: (value: string) => Promise<string | null>;
  }
): Promise<string | null> => {
  const { required, requiredMessage, formatValidator, asyncValidator } = options;

  if (required && !value.trim()) {
    return requiredMessage || 'هذا الحقل مطلوب';
  }

  if (!value.trim() && !required) {
    return null;
  }

  await new Promise((resolve) => window.setTimeout(resolve, 300));
  if (formatValidator) {
    const formatError = formatValidator(value);
    if (formatError) return formatError;
  }

  if (asyncValidator) {
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    return asyncValidator(value);
  }

  return null;
};

/**
 * Validate and sanitize email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const sanitized = sanitizeEmail(email);
  return {
    isValid: EMAIL_REGEX.test(sanitized),
    sanitized,
  };
};

/**
 * Validate and sanitize password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  const sanitized = sanitizeInput(password);
  // At least 8 characters, containing at least one letter and one number
  return {
    isValid: PASSWORD_REGEX.test(sanitized),
    sanitized,
  };
};

/**
 * Validate and sanitize phone number (basic validation for Saudi Arabia)
 */
export const validatePhone = (phone: string): ValidationResult => {
  const sanitized = sanitizePhone(phone);
  // Remove all non-digit characters for validation
  const cleanPhone = sanitized.replace(/\D/g, '');

  // Saudi Arabia phone numbers: 9-12 digits starting with 5, 0, or country code
  return {
    isValid: PHONE_REGEX.test(cleanPhone) || LOCAL_PHONE_REGEX.test(cleanPhone),
    sanitized,
  };
};

export const getPhoneErrorMessage = (phone: string): string | null => {
  const sanitized = sanitizePhone(phone);
  const cleanPhone = sanitized.replace(/\D/g, '');

  if (!cleanPhone) return 'رقم الهاتف مطلوب';
  if (!PHONE_REGEX.test(cleanPhone) && !LOCAL_PHONE_REGEX.test(cleanPhone)) {
    return 'رقم الهاتف غير صحيح. يجب أن يبدأ بـ 05 أو 966 ويحتوي على 10 أرقام للمحلي.';
  }
  return null;
};

/**
 * Validate credit card number using Luhn algorithm
 */
export const validateCardNumber = (number: string): boolean => {
  // Remove spaces and dashes
  const cleanNumber = number.replace(/[\s-]/g, '');

  // Check if it's all digits and has valid length
  if (!/^\d+$/.test(cleanNumber) || cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate expiry date (MM/YY format and not expired)
 */
export const validateExpiryDate = (expiry: string): boolean => {
  // Check format MM/YY
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) {
    return false;
  }

  const [month, year] = expiry.split('/').map(Number);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  // Check if year is in the future or current year
  if (year < currentYear) {
    return false;
  }

  // If same year, check if month is in the future
  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
};

/**
 * Validate CVV (3-4 digits)
 */
export const validateCVV = (cvv: string): boolean => {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
};

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate postal code (basic validation)
 */
export const validatePostalCode = (postalCode: string): boolean => {
  // Saudi Arabia postal codes: 5 digits
  return POSTAL_CODE_REGEX.test(postalCode);
};

/**
 * Validate and sanitize name (letters, spaces, and basic punctuation)
 */
export const validateName = (name: string): ValidationResult => {
  return validateTextInput(name, { regex: NAME_REGEX });
};

/**
 * Validate and sanitize address (basic validation)
 */
export const validateAddress = (address: string): ValidationResult => {
  const sanitized = sanitizeInput(address);
  return {
    isValid: sanitized.trim().length >= 5 && !detectSQLInjection(sanitized),
    sanitized,
  };
};

/**
 * Validate and sanitize city name
 */
export const validateCity = (city: string): ValidationResult => {
  return validateTextInput(city, { regex: CITY_REGEX, maxLength: 50 });
};

/**
 * Validate and sanitize country name
 */
export const validateCountry = (country: string): ValidationResult => {
  return validateTextInput(country, { regex: CITY_REGEX, maxLength: 50 });
};

/**
 * Validate minimum length
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

/**
 * Validate numeric input
 */
export const validateNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

/**
 * Validate and sanitize URL format
 */
export const validateURL = (url: string): ValidationResult => {
  const sanitized = sanitizeURL(url);
  try {
    if (!sanitized) {
      return { isValid: false, sanitized: '' };
    }
    new URL(sanitized);
    return { isValid: true, sanitized };
  } catch {
    return { isValid: false, sanitized: '' };
  }
};

/**
 * Complete shipping address validation with sanitization.
 * Returns a map of field errors and a sanitized payload.
 */
export const validateShippingAddress = (address: {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}): { errors: Record<string, string>; sanitized: typeof address } => {
  const errors: Record<string, string> = {};
  const sanitized: typeof address = {
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
  };

  // Full Name
  const nameValidation = validateName(address.fullName);
  sanitized.fullName = nameValidation.sanitized;
  if (!nameValidation.isValid) {
    errors.fullName = 'Please enter a valid full name';
  }

  // Phone
  const phoneValidation = validatePhone(address.phone);
  sanitized.phone = phoneValidation.sanitized;
  if (!phoneValidation.isValid) {
    errors.phone = getPhoneErrorMessage(address.phone) || 'Please enter a valid phone number';
  }

  // Street Address
  const addressValidation = validateAddress(address.streetAddress);
  sanitized.streetAddress = addressValidation.sanitized;
  if (!addressValidation.isValid) {
    errors.streetAddress = 'Please enter a valid street address';
  }

  // City
  const cityValidation = validateCity(address.city);
  sanitized.city = cityValidation.sanitized;
  if (!cityValidation.isValid) {
    errors.city = 'Please enter a valid city name';
  }

  // Postal Code
  sanitized.postalCode = sanitizeInput(address.postalCode);
  if (!validatePostalCode(sanitized.postalCode)) {
    errors.postalCode = 'Please enter a valid 5-digit postal code';
  }

  // Country
  const countryValidation = validateCountry(address.country);
  sanitized.country = countryValidation.sanitized;
  if (!countryValidation.isValid) {
    errors.country = 'Please enter a valid country name';
  }

  return { errors, sanitized };
};

/**
 * Complete payment details validation with sanitization.
 * Returns a map of field errors and a sanitized payload.
 */
export const validatePaymentDetails = (paymentDetails: {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}): { errors: Record<string, string>; sanitized: typeof paymentDetails } => {
  const errors: Record<string, string> = {};
  const sanitized: typeof paymentDetails = {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  };

  // Cardholder Name
  const nameValidation = validateName(paymentDetails.cardholderName);
  sanitized.cardholderName = nameValidation.sanitized;
  if (!nameValidation.isValid) {
    errors.cardholderName = 'Please enter a valid cardholder name';
  }

  // Card Number
  sanitized.cardNumber = sanitizeInput(paymentDetails.cardNumber);
  if (!validateCardNumber(sanitized.cardNumber)) {
    errors.cardNumber = 'Please enter a valid card number';
  }

  // Expiry Date
  sanitized.expiryDate = sanitizeInput(paymentDetails.expiryDate);
  if (!validateExpiryDate(sanitized.expiryDate)) {
    errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
  }

  // CVV
  sanitized.cvv = sanitizeInput(paymentDetails.cvv);
  if (!validateCVV(sanitized.cvv)) {
    errors.cvv = 'Please enter a valid CVV (3-4 digits)';
  }

  return { errors, sanitized };
};
