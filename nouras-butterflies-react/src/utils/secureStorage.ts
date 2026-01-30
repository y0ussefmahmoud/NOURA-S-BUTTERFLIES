/**
 * Secure Storage Utilities
 * Provides encrypted storage for sensitive data using AES-256 encryption
 * with PBKDF2 key derivation and HMAC integrity verification
 */

import CryptoJS from 'crypto-js';

// Storage configuration
const STORAGE_CONFIG = {
  // Encryption algorithm
  ALGORITHM: 'AES-256',

  // Key derivation iterations
  PBKDF2_ITERATIONS: 100000,

  // Salt length in bytes
  SALT_LENGTH: 32,

  // IV length in bytes
  IV_LENGTH: 16,

  // HMAC algorithm
  HMAC_ALGORITHM: 'SHA256',

  // Session key storage (in sessionStorage for security)
  SESSION_KEY_KEY: 'nouras-session-key',

  // Encrypted data prefix
  ENCRYPTED_PREFIX: 'nouras_encrypted:',

  // Data expiration time (24 hours)
  DATA_EXPIRY_MS: 24 * 60 * 60 * 1000,
};

// Storage interface for encrypted data
interface EncryptedData {
  data: string;
  salt: string;
  iv: string;
  hmac: string;
  timestamp: number;
}

/**
 * Generates a cryptographically secure random salt
 * @returns Random salt as hex string
 */
const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(STORAGE_CONFIG.SALT_LENGTH).toString();
};

/**
 * Generates a cryptographically secure random IV
 * @returns Random IV as hex string
 */
const generateIV = (): string => {
  return CryptoJS.lib.WordArray.random(STORAGE_CONFIG.IV_LENGTH).toString();
};

/**
 * Derives encryption key from password and salt using PBKDF2
 * @param password - The password or seed
 * @param salt - The salt
 * @returns Derived key
 */
const deriveKey = (password: string, salt: string): CryptoJS.lib.WordArray => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256 bits
    iterations: STORAGE_CONFIG.PBKDF2_ITERATIONS,
  });
};

/**
 * Creates HMAC for data integrity verification
 * @param data - The data to sign
 * @param key - The HMAC key
 * @returns HMAC as hex string
 */
const createHMAC = (data: string, key: CryptoJS.lib.WordArray): string => {
  return CryptoJS.HmacSHA256(data, key).toString();
};

/**
 * Verifies HMAC for data integrity
 * @param data - The data to verify
 * @param hmac - The expected HMAC
 * @param key - The HMAC key
 * @returns True if HMAC is valid
 */
const verifyHMAC = (data: string, hmac: string, key: CryptoJS.lib.WordArray): boolean => {
  const expectedHMAC = createHMAC(data, key);
  return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Hex.parse(hmac)) === expectedHMAC;
};

/**
 * Gets or creates a session key for encryption
 * @returns Session key
 */
const getSessionKey = (): string => {
  try {
    let sessionKey = sessionStorage.getItem(STORAGE_CONFIG.SESSION_KEY_KEY);

    if (!sessionKey) {
      // Generate new session key
      sessionKey = CryptoJS.lib.WordArray.random(256 / 8).toString();
      sessionStorage.setItem(STORAGE_CONFIG.SESSION_KEY_KEY, sessionKey);
    }

    return sessionKey;
  } catch (error) {
    console.error('[Secure Storage] Error getting session key:', error);
    throw new Error('Failed to get session key');
  }
};

/**
 * Encrypts data using AES-256 with PBKDF2 key derivation
 * @param data - The data to encrypt
 * @param key - Optional custom key (uses session key if not provided)
 * @returns Encrypted data object
 */
export const encryptData = (data: any, key?: string): EncryptedData => {
  try {
    const salt = generateSalt();
    const iv = generateIV();
    const encryptionKey = key || getSessionKey();
    const derivedKey = deriveKey(encryptionKey, salt);

    // Convert data to JSON string
    const dataString = JSON.stringify(data);

    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(dataString, derivedKey, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Create HMAC for integrity
    const hmac = createHMAC(encrypted.toString(), derivedKey);

    return {
      data: encrypted.toString(),
      salt,
      iv,
      hmac,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('[Secure Storage] Error encrypting data:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypts data using AES-256 with PBKDF2 key derivation
 * @param encryptedData - The encrypted data object
 * @param key - Optional custom key (uses session key if not provided)
 * @returns Decrypted data
 */
export const decryptData = (encryptedData: EncryptedData, key?: string): any => {
  try {
    const encryptionKey = key || getSessionKey();
    const derivedKey = deriveKey(encryptionKey, encryptedData.salt);

    // Verify HMAC for integrity
    if (!verifyHMAC(encryptedData.data, encryptedData.hmac, derivedKey)) {
      throw new Error('Data integrity check failed');
    }

    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(encryptedData.data, derivedKey, {
      iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert to string and parse JSON
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) {
      throw new Error('Failed to decrypt data');
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('[Secure Storage] Error decrypting data:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Stores encrypted data in localStorage
 * @param key - Storage key
 * @param value - Value to store
 * @param customKey - Optional custom encryption key
 */
export const setSecureItem = (key: string, value: any, customKey?: string): void => {
  try {
    const encrypted = encryptData(value, customKey);
    const storageKey = `${STORAGE_CONFIG.ENCRYPTED_PREFIX}${key}`;
    localStorage.setItem(storageKey, JSON.stringify(encrypted));
  } catch (error) {
    console.error('[Secure Storage] Error setting secure item:', error);
    throw new Error('Failed to store secure data');
  }
};

/**
 * Retrieves and decrypts data from localStorage
 * @param key - Storage key
 * @param customKey - Optional custom encryption key
 * @returns Decrypted data or null if not found
 */
export const getSecureItem = (key: string, customKey?: string): any | null => {
  try {
    const storageKey = `${STORAGE_CONFIG.ENCRYPTED_PREFIX}${key}`;
    const storedData = localStorage.getItem(storageKey);

    if (!storedData) {
      return null;
    }

    const encryptedData: EncryptedData = JSON.parse(storedData);

    // Check if data has expired
    if (Date.now() - encryptedData.timestamp > STORAGE_CONFIG.DATA_EXPIRY_MS) {
      removeSecureItem(key);
      return null;
    }

    return decryptData(encryptedData, customKey);
  } catch (error) {
    console.error('[Secure Storage] Error getting secure item:', error);
    // Remove corrupted data
    removeSecureItem(key);
    return null;
  }
};

/**
 * Removes encrypted data from localStorage
 * @param key - Storage key
 */
export const removeSecureItem = (key: string): void => {
  try {
    const storageKey = `${STORAGE_CONFIG.ENCRYPTED_PREFIX}${key}`;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('[Secure Storage] Error removing secure item:', error);
  }
};

/**
 * Clears all encrypted data from localStorage
 */
export const clearSecureStorage = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_CONFIG.ENCRYPTED_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('[Secure Storage] Error clearing secure storage:', error);
  }
};

/**
 * Lists all secure storage keys (without prefix)
 * @returns Array of secure storage keys
 */
export const listSecureKeys = (): string[] => {
  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter((key) => key.startsWith(STORAGE_CONFIG.ENCRYPTED_PREFIX))
      .map((key) => key.replace(STORAGE_CONFIG.ENCRYPTED_PREFIX, ''));
  } catch (error) {
    console.error('[Secure Storage] Error listing secure keys:', error);
    return [];
  }
};

/**
 * Checks if a secure item exists and is not expired
 * @param key - Storage key
 * @returns True if item exists and is valid
 */
export const hasSecureItem = (key: string): boolean => {
  try {
    const storageKey = `${STORAGE_CONFIG.ENCRYPTED_PREFIX}${key}`;
    const storedData = localStorage.getItem(storageKey);

    if (!storedData) {
      return false;
    }

    const encryptedData: EncryptedData = JSON.parse(storedData);

    // Check if data has expired
    if (Date.now() - encryptedData.timestamp > STORAGE_CONFIG.DATA_EXPIRY_MS) {
      removeSecureItem(key);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Secure Storage] Error checking secure item:', error);
    return false;
  }
};

/**
 * Rotates the session key and re-encrypts all data
 * @returns Promise that resolves when rotation is complete
 */
export const rotateSessionKey = async (): Promise<void> => {
  try {
    // Get current encrypted data
    const keys = listSecureKeys();
    const currentData: Record<string, any> = {};

    // Decrypt all data with current key
    keys.forEach((key) => {
      const data = getSecureItem(key);
      if (data !== null) {
        currentData[key] = data;
      }
    });

    // Clear current session key
    sessionStorage.removeItem(STORAGE_CONFIG.SESSION_KEY_KEY);

    // Get new session key
    const newSessionKey = getSessionKey();

    // Re-encrypt all data with new key
    Object.entries(currentData).forEach(([key, value]) => {
      setSecureItem(key, value, newSessionKey);
    });

    console.log('[Secure Storage] Session key rotated successfully');
  } catch (error) {
    console.error('[Secure Storage] Error rotating session key:', error);
    throw new Error('Failed to rotate session key');
  }
};

/**
 * Initializes secure storage
 */
export const initializeSecureStorage = (): void => {
  try {
    // Ensure session key exists
    getSessionKey();

    // Clean up expired data
    const keys = listSecureKeys();
    keys.forEach((key) => {
      if (!hasSecureItem(key)) {
        removeSecureItem(key);
      }
    });

    console.log('[Secure Storage] Secure storage initialized');
  } catch (error) {
    console.error('[Secure Storage] Error initializing secure storage:', error);
  }
};

/**
 * Cleanup function for secure storage
 */
export const cleanupSecureStorage = (): void => {
  try {
    // Clear session key
    sessionStorage.removeItem(STORAGE_CONFIG.SESSION_KEY_KEY);

    console.log('[Secure Storage] Secure storage cleaned up');
  } catch (error) {
    console.error('[Secure Storage] Error cleaning up secure storage:', error);
  }
};

/**
 * Gets storage usage statistics
 * @returns Storage usage information
 */
export const getStorageStats = (): {
  totalItems: number;
  totalSize: number;
  expiredItems: number;
} => {
  try {
    const keys = listSecureKeys();
    let totalSize = 0;
    let expiredItems = 0;

    keys.forEach((key) => {
      const storageKey = `${STORAGE_CONFIG.ENCRYPTED_PREFIX}${key}`;
      const storedData = localStorage.getItem(storageKey);

      if (storedData) {
        totalSize += storedData.length;

        try {
          const encryptedData: EncryptedData = JSON.parse(storedData);
          if (Date.now() - encryptedData.timestamp > STORAGE_CONFIG.DATA_EXPIRY_MS) {
            expiredItems++;
          }
        } catch {
          // corrupted data
          expiredItems++;
        }
      }
    });

    return {
      totalItems: keys.length,
      totalSize,
      expiredItems,
    };
  } catch (error) {
    console.error('[Secure Storage] Error getting storage stats:', error);
    return {
      totalItems: 0,
      totalSize: 0,
      expiredItems: 0,
    };
  }
};

// Export configuration for external use
export { STORAGE_CONFIG };
