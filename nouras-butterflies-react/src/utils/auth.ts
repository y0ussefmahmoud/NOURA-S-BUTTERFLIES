import type { User } from '../types/user';
import {
  setSecureItem,
  getSecureItem,
  removeSecureItem,
  initializeSecureStorage,
} from './secureStorage';
import { setCSRFToken, getCSRFToken, clearCSRFToken, refreshCSRFToken } from './csrf';
import { logSuccessfulLogin, logFailedLogin } from './securityLogger';
import { rateLimiters } from './rateLimiter';
import { http } from './httpInterceptor';

// Token management
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return getSecureItem('nouras-auth-token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  setSecureItem('nouras-auth-token', token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  removeSecureItem('nouras-auth-token');
};

// User data management
export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    return getSecureItem('nouras-user-data');
  } catch (error) {
    console.error('Error retrieving stored user data:', error);
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  if (typeof window === 'undefined') return;

  try {
    setSecureItem('nouras-user-data', user);
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const removeStoredUser = (): void => {
  if (typeof window === 'undefined') return;
  removeSecureItem('nouras-user-data');
};

// Authentication status
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getStoredUser();

  if (!token || !user) return false;

  // Check if token is not expired (mock implementation)
  // In a real app, you'd decode the JWT token
  try {
    // Mock token validation - check if token exists and has reasonable format
    return Boolean(token.startsWith('mock-jwt-token-') && user?.id);
  } catch {
    return false;
  }
};

// Validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, containing at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\u0600-\u06FF\-'.]+$/;
  return nameRegex.test(name) && name.trim().length >= 2;
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Saudi Arabia phone numbers: 9-12 digits starting with 5, 0, or country code
  const phoneRegex = /^(00966|966|\+966)?5\d{8}$/;
  return phoneRegex.test(cleanPhone) || cleanPhone.length >= 9;
};

// Password strength checker
export const checkPasswordStrength = (
  password: string
): {
  score: number;
  feedback: string[];
  color: string;
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include lowercase letters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include uppercase letters');
  }

  // Numbers check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include numbers');
  }

  // Special characters check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include special characters');
  }

  // Determine color based on score
  let color = 'bg-red-500';
  if (score >= 4) color = 'bg-green-500';
  else if (score >= 3) color = 'bg-blue-500';
  else if (score >= 2) color = 'bg-yellow-500';

  return { score, feedback, color };
};

// Token expiry checker (mock implementation)
export const isTokenExpired = (): boolean => {
  const token = getAuthToken();
  if (!token) return true;

  // Mock implementation - in real app, decode JWT token
  try {
    // Extract timestamp from mock token
    const timestamp = token.split('-').pop();
    if (!timestamp) return true;

    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const tokenAge = currentTime - tokenTime;

    // Consider token expired after 24 hours
    return tokenAge > 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeAuthToken();
  removeStoredUser();
  clearCSRFToken();

  // Clear non-sensitive data from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nouras-remember-me');
    localStorage.removeItem('nouras-redirect-path');
  }
};

// Remember me functionality
export const setRememberMe = (remember: boolean): void => {
  if (typeof window === 'undefined') return;

  if (remember) {
    localStorage.setItem('nouras-remember-me', 'true');
  } else {
    localStorage.removeItem('nouras-remember-me');
  }
};

export const shouldRememberMe = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('nouras-remember-me') === 'true';
};

// Authentication success handler with CSRF
export const handleAuthSuccess = (user: User, token: string): void => {
  // Store auth data securely
  setAuthToken(token);
  setStoredUser(user);

  // Generate and store CSRF token
  const csrfToken = refreshCSRFToken();
  setCSRFToken(csrfToken);

  // Log successful login
  logSuccessfulLogin(user.id, { email: user.email, name: user.name });
};

// Authentication failure handler
export const handleAuthFailure = (email: string, reason: string): void => {
  // Log failed login attempt
  logFailedLogin(email, reason);
};

// Login with rate limiting
export const login = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Check rate limit before processing
  if (!rateLimiters.login.checkLimit(email)) {
    throw new Error('Too many login attempts. Please try again later.');
  }

  try {
    // Validate input
    if (!validateEmail(email)) {
      throw new Error('Invalid email address');
    }

    if (!validatePassword(password)) {
      throw new Error('Invalid password format');
    }

    // Make API call with rate limiting
    const response = await http.post('/api/auth/login', { email, password });
    const { user, token } = response.data;

    // Handle successful authentication
    handleAuthSuccess(user, token);

    // Record successful request for rate limiting
    rateLimiters.login.recordSuccess(email);

    return { user, token };
  } catch (error) {
    // Record failed request for rate limiting
    rateLimiters.login.recordFailure(email);

    // Handle authentication failure
    handleAuthFailure(email, error instanceof Error ? error.message : 'Unknown error');

    throw error;
  }
};

// Register with rate limiting
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ user: User; token: string }> => {
  // Check rate limit before processing
  if (!rateLimiters.register.checkLimit(userData.email)) {
    throw new Error('Too many registration attempts. Please try again later.');
  }

  try {
    // Validate input
    if (!validateName(userData.name)) {
      throw new Error('Invalid name format');
    }

    if (!validateEmail(userData.email)) {
      throw new Error('Invalid email address');
    }

    if (!validatePassword(userData.password)) {
      throw new Error('Password does not meet requirements');
    }

    if (userData.phone && !validatePhone(userData.phone)) {
      throw new Error('Invalid phone number format');
    }

    // Make API call with rate limiting
    const response = await http.post('/api/auth/register', userData);
    const { user, token } = response.data;

    // Handle successful authentication
    handleAuthSuccess(user, token);

    // Record successful request for rate limiting
    rateLimiters.register.recordSuccess(userData.email);

    return { user, token };
  } catch (error) {
    // Record failed request for rate limiting
    rateLimiters.register.recordFailure(userData.email);

    // Handle authentication failure
    handleAuthFailure(
      userData.email,
      error instanceof Error ? error.message : 'Registration failed'
    );

    throw error;
  }
};

// Initialize authentication system
export const initializeAuth = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // Initialize secure storage
    initializeSecureStorage();

    // Ensure CSRF token exists
    const existingToken = getCSRFToken();
    if (!existingToken) {
      refreshCSRFToken();
    }

    console.log('[Auth] Authentication system initialized');
  } catch (error) {
    console.error('[Auth] Failed to initialize authentication:', error);
  }
};
