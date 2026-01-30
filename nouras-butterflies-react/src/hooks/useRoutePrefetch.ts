import { useCallback, useRef, useEffect } from 'react';
import { preloadOnHover, cancelHoverPreload, routePreloader } from '@/utils/routePreloader';

interface UseRoutePrefetchOptions {
  disabled?: boolean;
  hoverDelay?: number;
  preloadOnMount?: boolean;
  preloadOnVisible?: boolean;
  threshold?: number;
}

interface RoutePrefetchReturn {
  prefetchHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onTouchStart: () => void;
  };
  preload: () => Promise<void>;
  isPreloaded: boolean;
  elementRef?: (element: HTMLElement | null) => void;
}

// Hook for intelligent route prefetching
export const useRoutePrefetch = (
  chunkName: string,
  importFn?: () => Promise<void>,
  options: UseRoutePrefetchOptions = {}
): RoutePrefetchReturn => {
  const {
    disabled = false,
    preloadOnMount = false,
    preloadOnVisible = false,
    threshold = 0.1,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Check if chunk is already preloaded
  const isPreloaded = routePreloader.getPreloadedChunks().includes(chunkName);

  // Preload function
  const preload = useCallback(async () => {
    if (disabled || isPreloaded) return;

    if (importFn) {
      await routePreloader.preloadChunk(chunkName);
    } else {
      await routePreloader.preloadChunk(chunkName);
    }
  }, [chunkName, importFn, disabled, isPreloaded]);

  // Mouse enter handler
  const handleMouseEnter = useCallback(() => {
    if (disabled || isPreloaded) return;

    if (importFn) {
      preloadOnHover(chunkName, importFn);
    } else {
      preloadOnHover(chunkName, () => routePreloader.preloadChunk(chunkName));
    }
  }, [chunkName, importFn, disabled, isPreloaded]);

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    cancelHoverPreload(chunkName);
  }, [chunkName, disabled]);

  // Focus handler (for keyboard navigation)
  const handleFocus = useCallback(() => {
    if (disabled || isPreloaded) return;
    preload();
  }, [preload, disabled, isPreloaded]);

  // Blur handler
  const handleBlur = useCallback(() => {
    if (disabled) return;
    cancelHoverPreload(chunkName);
  }, [chunkName, disabled]);

  // Touch start handler (for mobile)
  const handleTouchStart = useCallback(() => {
    if (disabled || isPreloaded) return;
    preload();
  }, [preload, disabled, isPreloaded]);

  // Setup intersection observer for visibility-based preloading
  useEffect(() => {
    if (!preloadOnVisible || disabled || typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: preload immediately if IntersectionObserver is not supported
      preload();
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPreloaded) {
            preload();
            if (observerRef.current) {
              observerRef.current.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold,
        rootMargin: '50px',
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [preloadOnVisible, disabled, preload, threshold, isPreloaded]);

  // Preload on mount if requested
  useEffect(() => {
    if (preloadOnMount && !disabled && !isPreloaded) {
      // Use requestIdleCallback for non-critical preloading
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => preload(), { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => preload(), 100);
      }
    }
  }, [preloadOnMount, disabled, preload, isPreloaded]);

  // Observe element if ref is provided
  const observeElement = useCallback(
    (element: HTMLElement | null) => {
      if (!element || !observerRef.current || !preloadOnVisible) return;

      elementRef.current = element;
      observerRef.current.observe(element);
    },
    [preloadOnVisible]
  );

  return {
    prefetchHandlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onTouchStart: handleTouchStart,
    },
    preload,
    isPreloaded,
    elementRef: observeElement,
  };
};

// Enhanced version that returns a ref for automatic observation
export const useRoutePrefetchWithRef = (
  chunkName: string,
  importFn?: () => Promise<void>,
  options: UseRoutePrefetchOptions = {}
): RoutePrefetchReturn & { ref: (element: HTMLElement | null) => void } => {
  const { elementRef, ...rest } = useRoutePrefetch(chunkName, importFn, options);

  return {
    ...rest,
    ref: elementRef || (() => {}),
  };
};

// Hook for prefetching multiple routes
export const useMultipleRoutePrefetch = (
  routes: Array<{ chunkName: string; importFn?: () => Promise<void>; priority?: number }>,
  options: UseRoutePrefetchOptions = {}
) => {
  const prefetchStates = routes.map(({ chunkName, importFn }) =>
    useRoutePrefetch(chunkName, importFn, options)
  );

  const preloadAll = useCallback(async () => {
    const sortedRoutes = [...routes].sort((a, b) => (b.priority || 0) - (a.priority || 0));

    for (let i = 0; i < sortedRoutes.length; i++) {
      const state = prefetchStates[i];

      if (state && !state.isPreloaded) {
        await state.preload();
        // Add small delay between preloads to avoid overwhelming the network
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }, [routes, prefetchStates]);

  return {
    prefetchStates,
    preloadAll,
    allPreloaded: prefetchStates.every((state) => state.isPreloaded),
  };
};

export default useRoutePrefetch;
