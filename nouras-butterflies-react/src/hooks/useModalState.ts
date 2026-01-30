import { useState, useEffect, useCallback } from 'react';

export interface UseModalStateOptions {
  delay?: number;
  sessionStorageKey?: string;
  autoShow?: boolean;
}

export interface UseModalStateReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  wasShown: boolean;
  markAsShown: () => void;
}

export const useModalState = (options: UseModalStateOptions = {}): UseModalStateReturn => {
  const { delay = 0, sessionStorageKey, autoShow = false } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [wasShown, setWasShown] = useState(false);

  // Check if modal was shown before (from sessionStorage)
  useEffect(() => {
    if (sessionStorageKey) {
      const shown = sessionStorage.getItem(sessionStorageKey) === 'true';
      setWasShown(shown);

      if (autoShow && !shown) {
        // Auto-show after delay if never shown before
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, delay);

        return () => clearTimeout(timer);
      }
    }
  }, [sessionStorageKey, autoShow, delay]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const markAsShown = useCallback(() => {
    if (sessionStorageKey) {
      sessionStorage.setItem(sessionStorageKey, 'true');
      setWasShown(true);
    }
  }, [sessionStorageKey]);

  return {
    isOpen,
    open,
    close,
    toggle,
    wasShown,
    markAsShown,
  };
};
