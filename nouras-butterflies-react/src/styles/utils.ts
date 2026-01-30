// Theme utility functions for Noura's Butterflies
// This file provides helper functions for accessing theme values and RTL/LTR support

import { theme } from './theme';
import type { Theme } from './theme';

// Theme Access Helper
export function getThemeValue<T extends keyof Theme>(path: T): Theme[T] {
  return theme[path];
}

// Access nested theme properties safely
export function getNestedThemeValue<T extends keyof Theme, K extends keyof Theme[T]>(
  category: T,
  property: K
): Theme[T][K] {
  return theme[category][property];
}

// Color Utilities
export function hexToRgba(hex: string, opacity: number): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function getColorWithOpacity(colorName: keyof typeof theme.colors, opacity: number): string {
  const color = theme.colors[colorName];

  // Handle nested color objects
  if (typeof color === 'object' && color !== null) {
    throw new Error(`Color '${colorName}' is a nested object. Please specify a sub-property.`);
  }

  return hexToRgba(color, opacity);
}

// Responsive Helpers
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type BreakpointKey = keyof typeof breakpoints;

export function mediaQuery(breakpoint: BreakpointKey): string {
  return `@media (min-width: ${breakpoints[breakpoint]})`;
}

// RTL/LTR Helpers
export function isRTL(): boolean {
  return document.documentElement.getAttribute('dir') === 'rtl';
}

export function getDirectionalValue<T>(ltrValue: T, rtlValue: T): T {
  return isRTL() ? rtlValue : ltrValue;
}

export function flipForRTL(value: number): number {
  // For flipping margins, padding, etc. in RTL layouts
  return isRTL() ? -value : value;
}

export function getDirectionalProperty(
  property: 'margin' | 'padding' | 'border',
  side: 'start' | 'end'
): string {
  const direction = isRTL() ? 'rtl' : 'ltr';

  const propertyMap = {
    ltr: {
      start: 'left',
      end: 'right',
    },
    rtl: {
      start: 'right',
      end: 'left',
    },
  };

  return `${property}-${propertyMap[direction][side]}`;
}

// Theme validation helpers
export function isValidColor(colorName: string): boolean {
  return colorName in theme.colors;
}

export function isValidSpacing(spacingValue: string): boolean {
  return spacingValue in theme.spacing;
}

// CSS Custom Property helpers
export function setCSSVariable(name: string, value: string): void {
  document.documentElement.style.setProperty(`--${name}`, value);
}

export function getCSSVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

// Theme switching helpers
export function setTheme(theme: 'light' | 'dark'): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Persist preference
  localStorage.setItem('theme', theme);
}

export function getStoredTheme(): 'light' | 'dark' | null {
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : null;
}

export function toggleTheme(): void {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
}

// Direction switching helpers
export function setDirection(direction: 'ltr' | 'rtl'): void {
  document.documentElement.setAttribute('dir', direction);
  localStorage.setItem('direction', direction);
}

export function getStoredDirection(): 'ltr' | 'rtl' | null {
  const stored = localStorage.getItem('direction');
  return stored === 'ltr' || stored === 'rtl' ? stored : null;
}

export function toggleDirection(): void {
  const currentDir = (document.documentElement.getAttribute('dir') as 'ltr' | 'rtl') || 'ltr';
  setDirection(currentDir === 'ltr' ? 'rtl' : 'ltr');
}

// Initialize theme and direction from localStorage
export function initializeTheme(): void {
  // Initialize theme
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    setTheme(storedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  // Initialize direction
  const storedDirection = getStoredDirection();
  if (storedDirection) {
    setDirection(storedDirection);
  }
}

// Utility for creating responsive style objects
export function createResponsiveStyle<T extends Record<string, any>>(
  base: T,
  responsive?: Partial<Record<BreakpointKey, Partial<T>>>
): T {
  return {
    ...base,
    ...responsive,
  } as T;
}

// Export commonly used theme values for convenience
export const { colors, typography, spacing, layout, borderRadius, shadows, transitions } = theme;

// Export types for external use
export type {
  Theme,
  BrandColors,
  Typography,
  Spacing,
  Layout,
  BorderRadius,
  Shadows,
  Transitions,
} from './theme';
