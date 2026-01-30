import { useEffect, useRef, useCallback } from 'react';

interface FocusTrapOptions {
  isActive?: boolean;
  restoreFocus?: boolean;
  onEscape?: () => void;
}

export const useFocusTrap = (options: FocusTrapOptions = {}) => {
  const { isActive = true, restoreFocus = true, onEscape } = options;
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      'area[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'summary',
      'iframe',
      'object',
      'embed',
    ].join(', ');

    const elements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];

    return elements.filter((element) => {
      // Check if element is visible and not disabled
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        !element.hasAttribute('disabled') &&
        !element.hasAttribute('aria-hidden')
      );
    });
  }, []);

  const trapFocus = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current || !isActive) return;

      const focusableElements = getFocusableElements(containerRef.current);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab: Go to previous element
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: Go to next element
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      } else if (event.key === 'Escape' && onEscape) {
        onEscape();
      }
    },
    [isActive, getFocusableElements, onEscape]
  );

  const activate = useCallback(() => {
    if (!containerRef.current) return;

    // Store the previously focused element
    if (restoreFocus && document.activeElement) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Focus the first focusable element
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add event listener
    document.addEventListener('keydown', trapFocus);
  }, [restoreFocus, getFocusableElements, trapFocus]);

  const deactivate = useCallback(() => {
    // Remove event listener
    document.removeEventListener('keydown', trapFocus);

    // Restore focus to previous element
    if (restoreFocus && previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [restoreFocus, trapFocus]);

  useEffect(() => {
    if (isActive) {
      activate();
    } else {
      deactivate();
    }

    return () => {
      deactivate();
    };
  }, [isActive, activate, deactivate]);

  return {
    containerRef,
    activate,
    deactivate,
    getFocusableElements,
  };
};
