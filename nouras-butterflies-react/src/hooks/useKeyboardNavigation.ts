import { useEffect, useRef, useCallback } from 'react';

interface KeyboardNavigationOptions {
  items: HTMLElement[];
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  onActivate?: (index: number, element: HTMLElement) => void;
  onCancel?: () => void;
  onNavigate?: (index: number, element: HTMLElement) => void;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const {
    items,
    orientation = 'vertical',
    loop = true,
    onActivate,
    onCancel,
    onNavigate,
  } = options;

  const currentIndexRef = useRef<number>(-1);
  const containerRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (items.length === 0) return;

      let newIndex = currentIndexRef.current;
      let handled = false;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          if (orientation === 'vertical' && event.key === 'ArrowDown') {
            newIndex = currentIndexRef.current + 1;
            handled = true;
          } else if (orientation === 'horizontal' && event.key === 'ArrowRight') {
            newIndex = currentIndexRef.current + 1;
            handled = true;
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          if (orientation === 'vertical' && event.key === 'ArrowUp') {
            newIndex = currentIndexRef.current - 1;
            handled = true;
          } else if (orientation === 'horizontal' && event.key === 'ArrowLeft') {
            newIndex = currentIndexRef.current - 1;
            handled = true;
          }
          break;

        case 'Home':
          newIndex = 0;
          handled = true;
          break;

        case 'End':
          newIndex = items.length - 1;
          handled = true;
          break;

        case 'Enter':
        case ' ':
          if (currentIndexRef.current >= 0 && currentIndexRef.current < items.length) {
            const element = items[currentIndexRef.current];
            if (onActivate) {
              onActivate(currentIndexRef.current, element);
            } else {
              // Default behavior: click the element
              element.click();
            }
            handled = true;
          }
          break;

        case 'Escape':
          if (onCancel) {
            onCancel();
            handled = true;
          }
          break;
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();

        // Handle looping
        if (loop) {
          if (newIndex < 0) {
            newIndex = items.length - 1;
          } else if (newIndex >= items.length) {
            newIndex = 0;
          }
        } else {
          // Clamp to bounds
          newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
        }

        // Update current index and focus
        if (newIndex !== currentIndexRef.current && newIndex >= 0 && newIndex < items.length) {
          currentIndexRef.current = newIndex;
          const element = items[newIndex];
          element.focus();

          if (onNavigate) {
            onNavigate(newIndex, element);
          }
        }
      }
    },
    [items, orientation, loop, onActivate, onCancel, onNavigate]
  );

  const focusFirst = useCallback(() => {
    if (items.length > 0) {
      currentIndexRef.current = 0;
      items[0].focus();
      if (onNavigate) {
        onNavigate(0, items[0]);
      }
    }
  }, [items, onNavigate]);

  const focusLast = useCallback(() => {
    if (items.length > 0) {
      currentIndexRef.current = items.length - 1;
      items[items.length - 1].focus();
      if (onNavigate) {
        onNavigate(items.length - 1, items[items.length - 1]);
      }
    }
  }, [items, onNavigate]);

  const focusIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < items.length) {
        currentIndexRef.current = index;
        items[index].focus();
        if (onNavigate) {
          onNavigate(index, items[index]);
        }
      }
    },
    [items, onNavigate]
  );

  const reset = useCallback(() => {
    currentIndexRef.current = -1;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  return {
    containerRef,
    currentIndex: currentIndexRef.current,
    focusFirst,
    focusLast,
    focusIndex,
    reset,
  };
};
