import DOMPurify from 'dompurify';
import validator from 'validator';
import { logger } from './logger';

// DOMPurify configuration for strict security
const domPurifyConfig = {
  ALLOWED_TAGS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'strong',
    'em',
    'u',
    'i',
    'b',
    'ul',
    'ol',
    'li',
    'a',
    'span',
    'div',
  ],
  ALLOWED_ATTR: ['href', 'title', 'alt', 'class', 'id'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: [
    'script',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'textarea',
    'button',
    'select',
    'option',
    'link',
    'meta',
    'style',
  ],
  FORBID_ATTR: [
    'onclick',
    'onload',
    'onerror',
    'onmouseover',
    'onmouseout',
    'onfocus',
    'onblur',
    'onchange',
    'onsubmit',
    'onreset',
    'javascript:',
    'vbscript:',
    'data:',
    'src',
    'background',
  ],
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
  WHOLE_DOCUMENT: false,
  CUSTOM_ELEMENT_HANDLING: {
    tagNameCheck: null,
    attributeNameCheck: null,
    allowCustomizedBuiltInElements: false,
  },
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    return DOMPurify.sanitize(html, domPurifyConfig);
  } catch (error) {
    logger.error('[Sanitization] Error sanitizing HTML:', error);
    return '';
  }
};

/**
 * Sanitizes text input to prevent XSS and injection attacks
 * @param input - The text input to sanitize
 * @returns Sanitized text string
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  try {
    // Trim whitespace
    let sanitized = input.trim();

    // Remove null bytes and control characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    // Escape HTML entities
    sanitized = escapeHTML(sanitized);

    // Remove potential XSS patterns
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/vbscript:/gi, '');
    sanitized = sanitized.replace(/data:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');

    // Limit length to prevent DoS
    if (sanitized.length > 10000) {
      sanitized = sanitized.substring(0, 10000);
    }

    return sanitized;
  } catch (error) {
    logger.error('[Sanitization] Error sanitizing input:', error);
    return '';
  }
};

/**
 * Validates and sanitizes URLs
 * @param url - The URL to validate and sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeURL = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const trimmedUrl = url.trim();

    // Check for dangerous protocols
    if (/^(javascript:|vbscript:|data:|file:)/i.test(trimmedUrl)) {
      return '';
    }

    // Validate URL format
    if (
      !validator.isURL(trimmedUrl, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
      })
    ) {
      return '';
    }

    return trimmedUrl;
  } catch (error) {
    logger.error('[Sanitization] Error sanitizing URL:', error);
    return '';
  }
};

/**
 * Escapes HTML entities to prevent XSS
 * @param text - The text to escape
 * @returns Escaped HTML string
 */
export const escapeHTML = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Sanitizes form data object recursively
 * @param data - The form data object to sanitize
 * @returns Sanitized form data object
 */
export const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }

    if (typeof value === 'string') {
      // Check if it might be HTML content
      if (/<[^>]*>/.test(value)) {
        sanitized[key] = sanitizeHTML(value);
      } else {
        sanitized[key] = sanitizeInput(value);
      }
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === 'string'
            ? sanitizeInput(item)
            : typeof item === 'object'
              ? sanitizeFormData(item)
              : item
        );
      } else {
        sanitized[key] = sanitizeFormData(value);
      }
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Validates and sanitizes email addresses
 * @param email - The email to validate and sanitize
 * @returns Sanitized email or empty string if invalid
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();

    if (!validator.isEmail(trimmedEmail)) {
      return '';
    }

    // Additional validation for common email injection patterns
    if (/[\r\n]/.test(trimmedEmail)) {
      return '';
    }

    return trimmedEmail;
  } catch (error) {
    logger.error('[Sanitization] Error sanitizing email:', error);
    return '';
  }
};

/**
 * Sanitizes names and other text fields
 * @param name - The name to sanitize
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized name
 */
export const sanitizeName = (name: string, maxLength: number = 100): string => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  try {
    let sanitized = name.trim();

    // Remove special characters that could be used for injection
    sanitized = sanitized.replace(/[<>\"'&]/g, '');

    // Remove control characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    // Limit length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  } catch (error) {
    logger.error('[Sanitization] Error sanitizing name:', error);
    return '';
  }
};

/**
 * Sanitizes phone numbers
 * @param phone - The phone number to sanitize
 * @returns Sanitized phone number
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  try {
    // Remove all non-digit characters except +, -, (, )
    const sanitized = phone.replace(/[^\d\+\-\(\)\s]/g, '').trim();

    // Basic validation for phone number format
    if (!/^\+?[\d\s\-\(\)]{10,}$/.test(sanitized)) {
      return '';
    }

    return sanitized;
  } catch (error) {
    logger.error('[Sanitization] Error sanitizing phone number:', error);
    return '';
  }
};

/**
 * Validates file uploads for security
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @returns True if file is safe, false otherwise
 */
export const validateFileUpload = (
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSize: number = 5 * 1024 * 1024
): boolean => {
  if (!file) {
    return false;
  }

  try {
    // Check file size
    if (file.size > maxSize) {
      return false;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    // Check file name for suspicious patterns
    const fileName = file.name.toLowerCase();
    if (fileName.includes('../') || fileName.includes('..\\') || fileName.includes('.php')) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Sanitization] Error validating file upload:', error);
    return false;
  }
};

/**
 * Detects potential SQL injection patterns
 * @param input - The input to check
 * @returns True if SQL injection pattern is detected
 */
export const detectSQLInjection = (input: string): boolean => {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(('|(\\')|(\')|(\%27))(\s*(OR|AND)\s+.+\s*=\s*.+))/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /UNION(\s+|\+)SELECT/i,
    /INSERT(\s+|\+)INTO/i,
    /DELETE(\s+|\+)FROM/i,
    /UPDATE(\s+|\+)\w+(\s+|\+)SET/i,
    /DROP(\s+|\+)TABLE/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
};

/**
 * Comprehensive input sanitization and validation
 * @param input - The input to process
 * @param type - The type of input (email, name, url, html, text)
 * @returns Sanitized and validated input
 */
export const sanitizeByType = (
  input: string,
  type: 'email' | 'name' | 'url' | 'html' | 'text' | 'phone'
): string => {
  switch (type) {
    case 'email':
      return sanitizeEmail(input);
    case 'name':
      return sanitizeName(input);
    case 'url':
      return sanitizeURL(input);
    case 'html':
      return sanitizeHTML(input);
    case 'phone':
      return sanitizePhone(input);
    case 'text':
    default:
      return sanitizeInput(input);
  }
};

// Export default configuration for external use
export { domPurifyConfig };
