/**
 * Advanced Screen Reader Utilities
 * Provides comprehensive accessibility support for screen readers
 */

/**
 * Announce a message to screen readers using ARIA live regions
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  // Find or create live region
  let liveRegion = document.getElementById(`sr-live-region-${priority}`);

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = `sr-live-region-${priority}`;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }

  // Clear previous content and set new message
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);

  // Clear after announcement
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 1000);
};

/**
 * Generate dynamic ARIA labels based on context
 */
export const getAriaLabel = (key: string, params: Record<string, string | number> = {}): string => {
  const labels: Record<string, string> = {
    'button.close': 'Close',
    'button.menu': 'Menu',
    'button.search': 'Search',
    'button.cart': 'Shopping cart',
    'button.wishlist': 'Wishlist',
    'button.expand': 'Expand section',
    'button.collapse': 'Collapse section',
    'product.rating': 'Rating {value} out of {max}',
    'product.price': 'Price {price}',
    'product.add_to_cart': 'Add {name} to cart',
    'product.add_to_wishlist': 'Add {name} to wishlist',
    'cart.item_count': '{count} items in cart',
    'cart.total': 'Total {total}',
    'search.results': '{count} results found',
    'search.no_results': 'No results found',
    'form.required': 'Required field',
    'form.optional': 'Optional field',
    'form.error': 'Error: {message}',
    'form.success': 'Success: {message}',
    loading: 'Loading content',
    'modal.open': 'Modal opened: {title}',
    'modal.close': 'Modal closed',
    'navigation.current_page': 'Current page: {page}',
    'navigation.page_change': 'Navigated to {page}',
  };

  let label = labels[key] || key;

  // Replace parameters
  Object.entries(params).forEach(([param, value]) => {
    label = label.replace(new RegExp(`{${param}}`, 'g'), String(value));
  });

  return label;
};

/**
 * Check if an element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  if (!element || (element as any).disabled) {
    return false;
  }

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
  ];

  return focusableSelectors.some((selector) => {
    try {
      return element.matches(selector);
    } catch {
      return false;
    }
  });
};

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
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
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      !element.hasAttribute('disabled') &&
      !element.hasAttribute('aria-hidden')
    );
  });
};

/**
 * Trap focus within a container element
 */
export const trapFocus = (
  container: HTMLElement
): { activate: () => void; deactivate: () => void } => {
  let previousActiveElement: HTMLElement | null = null;
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  const activate = (): void => {
    // Store the previously focused element
    previousActiveElement = document.activeElement as HTMLElement;

    // Focus the first focusable element
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add keyboard event listener
    keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements(container);
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', keydownHandler);
  };

  const deactivate = (): void => {
    // Remove event listener
    if (keydownHandler) {
      container.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }

    // Restore focus to previous element
    if (previousActiveElement) {
      previousActiveElement.focus();
      previousActiveElement = null;
    }
  };

  return { activate, deactivate };
};

/**
 * Restore focus to a specific element
 */
export const restoreFocus = (element: HTMLElement | null): void => {
  if (element && isFocusable(element)) {
    setTimeout(() => {
      element.focus();
    }, 100);
  }
};

/**
 * Get the accessible name of an element
 */
export const getAccessibleName = (element: HTMLElement): string => {
  // Check for explicit aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  // Check for aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) {
      return labelElement.textContent?.trim() || '';
    }
  }

  // Check for alt text on images
  if (element.tagName === 'IMG') {
    const alt = element.getAttribute('alt');
    return alt?.trim() || '';
  }

  // Check for title attribute
  const title = element.getAttribute('title');
  if (title) {
    return title.trim();
  }

  // Use text content as fallback
  return element.textContent?.trim() || '';
};

/**
 * Set up keyboard navigation for a component
 */
export const setupKeyboardNavigation = (
  container: HTMLElement,
  options: {
    orientation?: 'horizontal' | 'vertical';
    loop?: boolean;
    onActivate?: (element: HTMLElement, index: number) => void;
    onCancel?: () => void;
  } = {}
): { activate: () => void; deactivate: () => void } => {
  const { orientation = 'vertical', loop = true, onActivate, onCancel } = options;
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  const activate = (): void => {
    keydownHandler = (e: KeyboardEvent) => {
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      let newIndex = currentIndex;
      let handled = false;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          if (
            (orientation === 'vertical' && e.key === 'ArrowDown') ||
            (orientation === 'horizontal' && e.key === 'ArrowRight')
          ) {
            newIndex = currentIndex + 1;
            handled = true;
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          if (
            (orientation === 'vertical' && e.key === 'ArrowUp') ||
            (orientation === 'horizontal' && e.key === 'ArrowLeft')
          ) {
            newIndex = currentIndex - 1;
            handled = true;
          }
          break;

        case 'Home':
          newIndex = 0;
          handled = true;
          break;

        case 'End':
          newIndex = focusableElements.length - 1;
          handled = true;
          break;

        case 'Enter':
        case ' ':
          if (currentIndex >= 0) {
            const element = focusableElements[currentIndex];
            if (onActivate) {
              onActivate(element, currentIndex);
            } else {
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
        e.preventDefault();
        e.stopPropagation();

        // Handle looping
        if (loop) {
          if (newIndex < 0) {
            newIndex = focusableElements.length - 1;
          } else if (newIndex >= focusableElements.length) {
            newIndex = 0;
          }
        } else {
          // Clamp to bounds
          newIndex = Math.max(0, Math.min(focusableElements.length - 1, newIndex));
        }

        // Focus new element
        if (newIndex >= 0 && newIndex < focusableElements.length && newIndex !== currentIndex) {
          focusableElements[newIndex].focus();
        }
      }
    };

    container.addEventListener('keydown', keydownHandler);
  };

  const deactivate = (): void => {
    if (keydownHandler) {
      container.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
  };

  return { activate, deactivate };
};

/**
 * Check if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if high contrast mode is preferred
 */
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Get the current language direction
 */
export const getTextDirection = (): 'ltr' | 'rtl' => {
  return document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
};

/**
 * Create a skip link for keyboard navigation
 */
export const createSkipLink = (
  targetId: string,
  label: string = 'Skip to main content'
): HTMLElement => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = 'sr-link';
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '6px';
  skipLink.style.background = '#000';
  skipLink.style.color = '#fff';
  skipLink.style.padding = '8px';
  skipLink.style.textDecoration = 'none';
  skipLink.style.borderRadius = '4px';
  skipLink.style.zIndex = '9999';
  skipLink.style.transition = 'top 0.3s';

  // Show on focus
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  return skipLink;
};
