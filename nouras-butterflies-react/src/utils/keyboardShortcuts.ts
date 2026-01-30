/**
 * Keyboard Shortcuts System
 * Provides global keyboard shortcut management for accessibility
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
  enabled?: boolean;
}

export interface KeyboardShortcutGroup {
  name: string;
  description: string;
  shortcuts: KeyboardShortcut[];
}

class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private groups: Map<string, KeyboardShortcutGroup> = new Map();
  private isEnabled: boolean = true;
  private helpModalOpen: boolean = false;

  /**
   * Register a new keyboard shortcut
   */
  register(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, { ...shortcut, enabled: shortcut.enabled !== false });
  }

  /**
   * Register a group of related shortcuts
   */
  registerGroup(group: KeyboardShortcutGroup): void {
    this.groups.set(group.name, group);
    group.shortcuts.forEach((shortcut) => this.register(shortcut));
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(key: string): void {
    this.shortcuts.delete(key);
  }

  /**
   * Enable/disable all shortcuts
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Enable/disable a specific shortcut
   */
  setShortcutEnabled(key: string, enabled: boolean): void {
    const shortcut = this.shortcuts.get(key);
    if (shortcut) {
      shortcut.enabled = enabled;
    }
  }

  /**
   * Get all registered shortcuts
   */
  getAllShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Get all shortcut groups
   */
  getAllGroups(): KeyboardShortcutGroup[] {
    return Array.from(this.groups.values());
  }

  /**
   * Generate a unique key for a shortcut
   */
  private getShortcutKey(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];
    if (shortcut.ctrlKey) parts.push('ctrl');
    if (shortcut.altKey) parts.push('alt');
    if (shortcut.shiftKey) parts.push('shift');
    if (shortcut.metaKey) parts.push('meta');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  /**
   * Check if an event matches a shortcut
   */
  private matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    return (
      event.key.toLowerCase() === shortcut.key.toLowerCase() &&
      !!event.ctrlKey === !!shortcut.ctrlKey &&
      !!event.altKey === !!shortcut.altKey &&
      !!event.shiftKey === !!shortcut.shiftKey &&
      !!event.metaKey === !!shortcut.metaKey
    );
  }

  /**
   * Handle keyboard events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isEnabled || this.helpModalOpen) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    for (const shortcut of this.shortcuts.values()) {
      if (shortcut.enabled && this.matchesShortcut(event, shortcut)) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
        break;
      }
    }
  };

  /**
   * Start listening for keyboard events
   */
  start(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Stop listening for keyboard events
   */
  stop(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Show help modal with all shortcuts
   */
  showHelp(): void {
    this.helpModalOpen = true;
    // Implementation would depend on your modal system
    console.log('Keyboard Shortcuts Help:');
    this.groups.forEach((group) => {
      console.log(`\n${group.name}: ${group.description}`);
      group.shortcuts.forEach((shortcut) => {
        const keys = [];
        if (shortcut.ctrlKey) keys.push('Ctrl');
        if (shortcut.altKey) keys.push('Alt');
        if (shortcut.shiftKey) keys.push('Shift');
        if (shortcut.metaKey) keys.push('Cmd');
        keys.push(shortcut.key);
        console.log(`  ${keys.join(' + ')} - ${shortcut.description}`);
      });
    });
  }

  /**
   * Hide help modal
   */
  hideHelp(): void {
    this.helpModalOpen = false;
  }
}

// Global instance
export const keyboardShortcuts = new KeyboardShortcutManager();

/**
 * Common application shortcuts
 */
export const registerCommonShortcuts = (): void => {
  // Navigation shortcuts
  keyboardShortcuts.registerGroup({
    name: 'Navigation',
    description: 'Navigate around the application',
    shortcuts: [
      {
        key: '/',
        description: 'Open search',
        action: () => {
          // Trigger search modal
          const searchEvent = new CustomEvent('open-search');
          document.dispatchEvent(searchEvent);
        },
      },
      {
        key: 'k',
        ctrlKey: true,
        description: 'Open search (Cmd+K on Mac)',
        action: () => {
          const searchEvent = new CustomEvent('open-search');
          document.dispatchEvent(searchEvent);
        },
      },
      {
        key: 'h',
        altKey: true,
        description: 'Go to homepage',
        action: () => {
          window.location.href = '/';
        },
      },
    ],
  });

  // Accessibility shortcuts
  keyboardShortcuts.registerGroup({
    name: 'Accessibility',
    description: 'Accessibility features',
    shortcuts: [
      {
        key: '?',
        description: 'Show keyboard shortcuts help',
        action: () => {
          keyboardShortcuts.showHelp();
        },
      },
      {
        key: 'Escape',
        description: 'Close modal or cancel action',
        action: () => {
          const closeEvent = new CustomEvent('close-modal');
          document.dispatchEvent(closeEvent);
        },
      },
      {
        key: 'Tab',
        shiftKey: true,
        description: 'Navigate backwards (built-in browser behavior)',
        action: () => {
          // Let browser handle this naturally
        },
      },
    ],
  });

  // Cart shortcuts
  keyboardShortcuts.registerGroup({
    name: 'Shopping',
    description: 'Shopping and cart actions',
    shortcuts: [
      {
        key: 'c',
        altKey: true,
        description: 'Open cart',
        action: () => {
          const cartEvent = new CustomEvent('open-cart');
          document.dispatchEvent(cartEvent);
        },
      },
      {
        key: 'w',
        altKey: true,
        description: 'Open wishlist',
        action: () => {
          const wishlistEvent = new CustomEvent('open-wishlist');
          document.dispatchEvent(wishlistEvent);
        },
      },
    ],
  });

  // Theme shortcuts
  keyboardShortcuts.registerGroup({
    name: 'Theme',
    description: 'Theme and display preferences',
    shortcuts: [
      {
        key: 'd',
        altKey: true,
        description: 'Toggle dark/light mode',
        action: () => {
          const themeEvent = new CustomEvent('toggle-theme');
          document.dispatchEvent(themeEvent);
        },
      },
    ],
  });
};

/**
 * Hook for components to listen for shortcut events
 */
export const useShortcutEvents = () => {
  const subscribe = (event: string, handler: () => void) => {
    document.addEventListener(event, handler as EventListener);
    return () => {
      document.removeEventListener(event, handler as EventListener);
    };
  };

  return {
    onOpenSearch: (handler: () => void) => subscribe('open-search', handler),
    onCloseModal: (handler: () => void) => subscribe('close-modal', handler),
    onOpenCart: (handler: () => void) => subscribe('open-cart', handler),
    onOpenWishlist: (handler: () => void) => subscribe('open-wishlist', handler),
    onToggleTheme: (handler: () => void) => subscribe('toggle-theme', handler),
  };
};

/**
 * Initialize keyboard shortcuts (call this in your app initialization)
 */
export const initializeKeyboardShortcuts = (): void => {
  registerCommonShortcuts();
  keyboardShortcuts.start();
};

/**
 * Format shortcut key for display
 */
export const formatShortcutKey = (shortcut: KeyboardShortcut): string => {
  const keys: string[] = [];

  if (shortcut.ctrlKey) keys.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
  if (shortcut.altKey) keys.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt');
  if (shortcut.shiftKey) keys.push(navigator.platform.includes('Mac') ? '⇧' : 'Shift');
  if (shortcut.metaKey) keys.push('⌘');

  // Format special keys
  let key = shortcut.key;
  switch (key.toLowerCase()) {
    case ' ':
      key = 'Space';
      break;
    case 'arrowup':
      key = '↑';
      break;
    case 'arrowdown':
      key = '↓';
      break;
    case 'arrowleft':
      key = '←';
      break;
    case 'arrowright':
      key = '→';
      break;
    case 'escape':
      key = 'Esc';
      break;
  }

  keys.push(key);
  return keys.join(navigator.platform.includes('Mac') ? '' : ' + ');
};
