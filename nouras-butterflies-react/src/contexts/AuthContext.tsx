import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData, AuthResponse } from '../types/user';
import { initializeAuth, handleAuthSuccess, handleAuthFailure, clearAuthData } from '../utils/auth';
import { cleanupCSRFProtection } from '../utils/csrf';
import { getSecureItem, setSecureItem } from '../utils/secureStorage';
import { logger } from '../utils/logger';
import { trackEvent } from '../utils/performance';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_READY' }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

const authReducer = (
  state: AuthState & { error: string | null },
  action: AuthAction
): AuthState & { error: string | null } => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_READY':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

const initialState: AuthState & { error: string | null } = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  error: null,
};

// Mock authentication functions
const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (email === 'user@example.com' && password === 'password') {
    const user: User = {
      id: '1',
      name: 'Sarah Johnson',
      email: 'user@example.com',
      avatar: '/api/placeholder/150/150',
      membershipTier: 'gold',
      points: 1250,
      phone: '+1 (555) 123-4567',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      user,
      token: 'mock-jwt-token-' + Date.now(),
      message: 'Login successful',
    };
  }

  throw new Error('Invalid email or password');
};

const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user: User = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    membershipTier: 'bronze',
    points: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    user,
    token: 'mock-jwt-token-' + Date.now(),
    message: 'Registration successful',
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  logger.debug('[Context] Initializing AuthProvider...');
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Analytics tracking helper
  const trackAuthEvent = (action: string, properties: Record<string, any>) => {
    try {
      trackEvent('auth', action, JSON.stringify(properties), 0);
    } catch (error) {
      logger.error('[Auth] Failed to track analytics event:', error);
    }
  };

  // Track session start time
  useEffect(() => {
    (window as any).sessionStartTime = Date.now();
  }, []);

  useEffect(() => {
    logger.debug('[Auth] Initializing authentication system...');

    // Initialize secure storage and CSRF
    initializeAuth();

    // Check for existing session
    try {
      const token = localStorage.getItem('nouras-auth-token'); // Check for migration
      const userData = localStorage.getItem('nouras-user-data'); // Check for migration

      if (token && userData) {
        logger.debug('[Auth] Found legacy session, migrating to secure storage...');
        // Migration logic would go here in a real scenario
        // For now, clear legacy data and use secure storage
        localStorage.removeItem('nouras-auth-token');
        localStorage.removeItem('nouras-user-data');
      }

      // Check secure storage for existing session
      const secureToken = getSecureItem('nouras-auth-token');
      const secureUserData = getSecureItem('nouras-user-data');

      if (secureToken && secureUserData) {
        logger.debug('[Auth] Found existing secure session, validating...');
        if (secureUserData && secureUserData.id && secureUserData.email) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: secureUserData, token: secureToken },
          });
          logger.debug('[Auth] Secure session restored successfully');
        } else {
          throw new Error('Invalid user data structure');
        }
      } else {
        logger.debug('[Auth] No existing session found');
        dispatch({ type: 'AUTH_READY' });
      }
    } catch (error) {
      logger.error('[Auth] Error during session check:', error);
      dispatch({ type: 'AUTH_READY' });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    logger.debug('[Auth] Starting login process for:', credentials.email);
    dispatch({ type: 'AUTH_START' });
    
    const loginStartTime = Date.now();

    try {
      const response = await mockLogin(credentials.email, credentials.password);
      const loginDuration = Date.now() - loginStartTime;

      try {
        // Use secure auth success handler
        handleAuthSuccess(response.user, response.token);

        if (credentials.rememberMe) {
          localStorage.setItem('nouras-remember-me', 'true');
        }

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user, token: response.token },
        });

        logger.debug('[Auth] Login successful for:', credentials.email);
        
        // Track successful login
        trackAuthEvent('login', {
          method: 'email',
          success: true,
          loginDuration,
          email: credentials.email,
          rememberMe: credentials.rememberMe,
          userId: response.user.id,
          membershipTier: response.user.membershipTier,
          timestamp: Date.now(),
        });
        
        return response;
      } catch (storageError) {
        logger.error('[Auth] Failed to store session data:', storageError);
        
        // Track storage failure
        trackAuthEvent('login', {
          method: 'email',
          success: false,
          error: 'storage_failed',
          loginDuration,
          email: credentials.email,
        });
        
        dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to save session' });
        throw new Error('Failed to save session');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      const loginDuration = Date.now() - loginStartTime;
      logger.error('[Auth] Login failed:', errorMessage);

      // Log failed login attempt
      handleAuthFailure(credentials.email, errorMessage);

      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      
      // Track failed login
      trackAuthEvent('login', {
        method: 'email',
        success: false,
        error: errorMessage,
        loginDuration,
        email: credentials.email,
        rememberMe: credentials.rememberMe,
        timestamp: Date.now(),
      });
      
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    logger.debug('[Auth] Starting registration process for:', data.email);
    dispatch({ type: 'AUTH_START' });
    
    const registerStartTime = Date.now();

    try {
      const response = await mockRegister(data);
      const registerDuration = Date.now() - registerStartTime;

      try {
        // Use secure auth success handler
        handleAuthSuccess(response.user, response.token);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user, token: response.token },
        });

        logger.debug('[Auth] Registration successful for:', data.email);
        
        // Track successful registration
        trackAuthEvent('register', {
          success: true,
          registerDuration,
          email: data.email,
          name: data.name,
          phone: data.phone,
          userId: response.user.id,
          membershipTier: response.user.membershipTier,
          timestamp: Date.now(),
        });
        
        return response;
      } catch (storageError) {
        logger.error('[Auth] Failed to store registration data:', storageError);
        
        // Track storage failure
        trackAuthEvent('register', {
          success: false,
          error: 'storage_failed',
          registerDuration,
          email: data.email,
        });
        
        dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to save session' });
        throw new Error('Failed to save session');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      const registerDuration = Date.now() - registerStartTime;
      logger.error('[Auth] Registration failed:', errorMessage);

      // Log failed registration attempt
      handleAuthFailure(data.email, errorMessage);

      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      
      // Track failed registration
      trackAuthEvent('register', {
        success: false,
        error: errorMessage,
        registerDuration,
        email: data.email,
        name: data.name,
        timestamp: Date.now(),
      });
      
      throw error;
    }
  };

  const logout = () => {
    logger.debug('[Auth] Logging out user...');
    
    const sessionDuration = state.user ? Date.now() - (window as any).sessionStartTime : 0;
    const userId = state.user?.id;
    const membershipTier = state.user?.membershipTier;
    
    try {
      // Clear all auth data including CSRF
      clearAuthData();
      cleanupCSRFProtection();

      // Clear non-sensitive data
      localStorage.removeItem('nouras-remember-me');

      dispatch({ type: 'LOGOUT' });
      logger.debug('[Auth] Logout completed');
      
      // Track logout event
      trackAuthEvent('logout', {
        userId,
        membershipTier,
        sessionDuration,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('[Auth] Error during logout:', error);
      
      // Track logout error
      trackAuthEvent('logout', {
        userId,
        membershipTier,
        sessionDuration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      });
      
      // Still dispatch logout even if cleanup fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) {
      logger.error('[Auth] Cannot update profile: no authenticated user');
      return;
    }

    logger.debug('[Auth] Updating profile for user:', state.user.id, updates);
    
    const profileUpdateStartTime = Date.now();

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const profileUpdateDuration = Date.now() - profileUpdateStartTime;
      const updatedUser = { ...state.user, ...updates, updatedAt: new Date().toISOString() };

      try {
        // Use secure storage for updated profile
        setSecureItem('nouras-user-data', updatedUser);
        dispatch({ type: 'UPDATE_PROFILE', payload: updates });
        logger.debug('[Auth] Profile updated successfully');
        
        // Track successful profile update
        trackAuthEvent('profile_update', {
          userId: state.user.id,
          success: true,
          profileUpdateDuration,
          updatedFields: Object.keys(updates),
          membershipTier: state.user.membershipTier,
          timestamp: Date.now(),
        });
      } catch (storageError) {
        logger.error('[Auth] Failed to save updated profile:', storageError);
        
        // Track storage failure
        trackAuthEvent('profile_update', {
          userId: state.user.id,
          success: false,
          error: 'storage_failed',
          profileUpdateDuration,
          updatedFields: Object.keys(updates),
        });
        
        throw new Error('Failed to save profile updates');
      }
    } catch (error) {
      logger.error('[Auth] Profile update failed:', error);
      
      // Track profile update failure
      trackAuthEvent('profile_update', {
        userId: state.user.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        profileUpdateDuration: Date.now() - profileUpdateStartTime,
        updatedFields: Object.keys(updates),
        timestamp: Date.now(),
      });
      
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    logger.error('[Auth] useAuth hook called outside AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  if (!context) {
    logger.error('[Auth] AuthContext is null or undefined');
    throw new Error('AuthContext is not properly initialized');
  }
  return context;
};
