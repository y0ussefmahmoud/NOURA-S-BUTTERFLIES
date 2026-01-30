/**
 * Responsive utilities for Noura's Butterflies
 * Provides hooks and helpers for responsive design
 */

import { useState, useEffect, useRef } from 'react';

// Breakpoint values matching Tailwind config
export const breakpoints = {
  mobileLg: 480,
  sm: 640,
  md: 768,
  tablet: 900,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Hook to get current breakpoint
 */
export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      let newBreakpoint: Breakpoint;

      if (width < breakpoints.mobileLg) newBreakpoint = 'mobileLg';
      else if (width < breakpoints.sm) newBreakpoint = 'sm';
      else if (width < breakpoints.md) newBreakpoint = 'md';
      else if (width < breakpoints.tablet) newBreakpoint = 'tablet';
      else if (width < breakpoints.lg) newBreakpoint = 'lg';
      else if (width < breakpoints.xl) newBreakpoint = 'xl';
      else newBreakpoint = '2xl';

      setBreakpoint(newBreakpoint);
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

/**
 * Hook to check if media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

/**
 * Helper functions to check device types
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
};

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
};

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
};

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Hooks for device type checking
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`);
};

export const useIsTablet = (): boolean => {
  return useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`);
};

export const useIsDesktop = (): boolean => {
  return useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
};

export const useIsTouchDevice = (): boolean => {
  return useMediaQuery('(pointer: coarse)');
};

/**
 * Responsive value selector hook
 */
export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>): T | undefined => {
  const breakpoint = useBreakpoint();

  // Find the largest breakpoint that's <= current breakpoint
  const breakpointOrder: Breakpoint[] = ['mobileLg', 'sm', 'md', 'tablet', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
};

/**
 * Get responsive class names
 */
export const getResponsiveClass = (mobile: string, tablet?: string, desktop?: string): string => {
  const classes = [mobile];
  if (tablet) classes.push(tablet);
  if (desktop) classes.push(desktop);
  return classes.join(' ');
};

/**
 * Safe area utilities
 */
export const getSafeAreaClass = (position: 'top' | 'bottom' | 'left' | 'right'): string => {
  return `p-safe-${position}`;
};

/**
 * Touch target utilities
 */
export const getTouchTargetClass = (): string => {
  return 'touch-target';
};

/**
 * Responsive spacing utilities
 */
export const getResponsiveSpacing = (size: 'sm' | 'md' | 'lg'): string => {
  const spacingMap = {
    sm: {
      mobile: 'p-2',
      tablet: 'p-3',
      desktop: 'p-4',
    },
    md: {
      mobile: 'p-4',
      tablet: 'p-6',
      desktop: 'p-8',
    },
    lg: {
      mobile: 'p-6',
      tablet: 'p-8',
      desktop: 'p-12',
    },
  };

  const spacing = spacingMap[size];
  return getResponsiveClass(spacing.mobile, spacing.tablet, spacing.desktop);
};

/**
 * Device detection utilities
 */
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isTouchDevice: false,
      width: 0,
      height: 0,
    };
  }

  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    isTouchDevice: isTouchDevice(),
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Viewport utilities
 */
export const getViewportSize = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Orientation utilities
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);

    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  return orientation;
};

/**
 * Responsive image utilities
 */
export const getResponsiveImageSrc = (
  baseUrl: string,
  options?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }
) => {
  const deviceInfo = getDeviceInfo();

  if (deviceInfo.isMobile && options?.mobile) {
    return `${baseUrl}${options.mobile}`;
  }
  if (deviceInfo.isTablet && options?.tablet) {
    return `${baseUrl}${options.tablet}`;
  }
  if (deviceInfo.isDesktop && options?.desktop) {
    return `${baseUrl}${options.desktop}`;
  }

  return baseUrl;
};

/**
 * Performance utilities for responsive components
 */
export const useDebounce = <T extends (...args: any[]) => any>(callback: T, delay: number): T => {
  const timeoutRef = useRef<number | undefined>();

  return ((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => callback(...args), delay);
  }) as T;
};

/**
 * Throttle utility for resize events
 */
export const useThrottle = <T extends (...args: any[]) => any>(callback: T, delay: number): T => {
  const lastRun = useRef(Date.now());

  return ((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }) as T;
};
