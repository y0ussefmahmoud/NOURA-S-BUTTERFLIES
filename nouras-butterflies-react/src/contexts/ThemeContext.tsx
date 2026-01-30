// Theme Context for Noura's Butterflies
// Provides theme (light/dark) and direction (LTR/RTL) state management

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  initializeTheme,
  setTheme,
  setDirection,
  getStoredTheme,
  getStoredDirection,
} from '../styles/utils';

// Theme types
export type ThemeMode = 'light' | 'dark';
export type TextDirection = 'ltr' | 'rtl';

// Theme context interface
interface ThemeContextType {
  theme: ThemeMode;
  direction: TextDirection;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleDirection: () => void;
  setDirectionMode: (dir: TextDirection) => void;
  isDark: boolean;
  isRTL: boolean;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  defaultDirection?: TextDirection;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  defaultDirection = 'ltr',
}) => {
  console.log('[Context] Initializing ThemeProvider...');
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [direction, setDirectionState] = useState<TextDirection>(defaultDirection);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme and direction on mount
  useEffect(() => {
    console.log('[Theme] Initializing theme system...');
    try {
      initializeTheme();

      // Load stored preferences
      const storedTheme = getStoredTheme();
      const storedDirection = getStoredDirection();

      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        setThemeState(storedTheme);
        console.log('[Theme] Loaded stored theme:', storedTheme);
      } else {
        console.log('[Theme] Using default theme:', defaultTheme);
      }

      if (storedDirection && (storedDirection === 'ltr' || storedDirection === 'rtl')) {
        setDirectionState(storedDirection);
        console.log('[Theme] Loaded stored direction:', storedDirection);
      } else {
        console.log('[Theme] Using default direction:', defaultDirection);
      }
    } catch (error) {
      console.error('[Theme] Error during theme initialization:', error);
      // Fallback to defaults
      setThemeState(defaultTheme);
      setDirectionState(defaultDirection);
    } finally {
      setIsInitialized(true);
      console.log('[Theme] Theme initialization completed');
    }
  }, [defaultTheme, defaultDirection]);

  // Apply theme changes to DOM
  useEffect(() => {
    if (isInitialized) {
      try {
        console.log('[Theme] Applying theme to DOM:', theme);
        setTheme(theme);
      } catch (error) {
        console.error('[Theme] Failed to apply theme to DOM:', error);
      }
    }
  }, [theme, isInitialized]);

  // Apply direction changes to DOM
  useEffect(() => {
    if (isInitialized) {
      try {
        console.log('[Theme] Applying direction to DOM:', direction);
        setDirection(direction);
      } catch (error) {
        console.error('[Theme] Failed to apply direction to DOM:', error);
      }
    }
  }, [direction, isInitialized]);

  // Theme toggle functions
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('[Theme] Toggling theme from', theme, 'to', newTheme);
    setThemeState(newTheme);
  };

  const setThemeMode = (mode: ThemeMode) => {
    if (!mode || (mode !== 'light' && mode !== 'dark')) {
      console.error('[Theme] Invalid theme mode provided:', mode);
      return;
    }
    console.log('[Theme] Setting theme mode to:', mode);
    setThemeState(mode);
  };

  // Direction toggle functions
  const toggleDirection = () => {
    const newDirection = direction === 'ltr' ? 'rtl' : 'ltr';
    console.log('[Theme] Toggling direction from', direction, 'to', newDirection);
    setDirectionState(newDirection);
  };

  const setDirectionMode = (dir: TextDirection) => {
    if (!dir || (dir !== 'ltr' && dir !== 'rtl')) {
      console.error('[Theme] Invalid direction provided:', dir);
      return;
    }
    console.log('[Theme] Setting direction to:', dir);
    setDirectionState(dir);
  };

  // Computed values
  const isDark = theme === 'dark';
  const isRTL = direction === 'rtl';

  const value: ThemeContextType = {
    theme,
    direction,
    toggleTheme,
    setThemeMode,
    toggleDirection,
    setDirectionMode,
    isDark,
    isRTL,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    console.error('[Theme] useTheme hook called outside ThemeProvider');
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  if (!context) {
    console.error('[Theme] ThemeContext is null or undefined');
    throw new Error('ThemeContext is not properly initialized');
  }
  return context;
};

// Hook to use only theme mode
export const useThemeMode = (): {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
} => {
  const { theme, isDark, toggleTheme, setThemeMode } = useTheme();
  return { theme, isDark, toggleTheme, setThemeMode };
};

// Hook to use only direction
export const useDirection = (): {
  direction: TextDirection;
  isRTL: boolean;
  toggleDirection: () => void;
  setDirectionMode: (dir: TextDirection) => void;
} => {
  const { direction, isRTL, toggleDirection, setDirectionMode } = useTheme();
  return { direction, isRTL, toggleDirection, setDirectionMode };
};

// Higher-order component for theme provider
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { theme?: ThemeMode; direction?: TextDirection }> => {
  return ({ theme, direction, ...props }) => (
    <ThemeProvider defaultTheme={theme} defaultDirection={direction}>
      <Component {...(props as P)} />
    </ThemeProvider>
  );
};

// Theme-aware component props
export interface ThemeAwareComponentProps {
  className?: string;
  children?: ReactNode;
}

// Utility component for conditional rendering based on theme
export interface ThemeConditionalProps {
  children: ReactNode;
  theme?: ThemeMode;
  direction?: TextDirection;
}

export const ThemeConditional: React.FC<ThemeConditionalProps> = ({
  children,
  theme,
  direction,
}) => {
  const { theme: currentTheme, direction: currentDirection } = useTheme();

  // Check if current theme/direction matches the required conditions
  const themeMatches = !theme || currentTheme === theme;
  const directionMatches = !direction || currentDirection === direction;

  if (themeMatches && directionMatches) {
    return <>{children}</>;
  }

  return null;
};

// Utility components for theme-specific rendering
export const LightMode: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeConditional theme="light">{children}</ThemeConditional>
);

export const DarkMode: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeConditional theme="dark">{children}</ThemeConditional>
);

export const LTRMode: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeConditional direction="ltr">{children}</ThemeConditional>
);

export const RTLMode: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeConditional direction="rtl">{children}</ThemeConditional>
);

export default ThemeContext;
