import { useRef, useCallback, useEffect } from 'react';

interface AriaAnnouncement {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
  timeout?: number;
  persistent?: boolean;
  timestamp: number;
}

interface UseAriaAnnounceOptions {
  maxQueueSize?: number;
  defaultTimeout?: number;
  rtl?: boolean;
}

export const useAriaAnnounce = (options: UseAriaAnnounceOptions = {}) => {
  const { maxQueueSize = 10, defaultTimeout = 3000, rtl = false } = options;

  const announcementsRef = useRef<AriaAnnouncement[]>([]);
  const timeoutsRef = useRef<Map<string, number>>(new Map());
  const politeRegionRef = useRef<HTMLDivElement>(null);
  const assertiveRegionRef = useRef<HTMLDivElement>(null);

  const clearTimeout = useCallback((id: string) => {
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const removeAnnouncement = useCallback(
    (id: string) => {
      clearTimeout(id);
      announcementsRef.current = announcementsRef.current.filter((ann) => ann.id !== id);
    },
    [clearTimeout]
  );

  const announce = useCallback(
    (
      message: string,
      priority: 'polite' | 'assertive' = 'polite',
      options: { timeout?: number; persistent?: boolean; id?: string } = {}
    ) => {
      const { timeout = defaultTimeout, persistent = false, id } = options;
      const announcementId =
        id || `announce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Remove existing announcement with same ID if it exists
      removeAnnouncement(announcementId);

      const announcement: AriaAnnouncement = {
        id: announcementId,
        message,
        priority,
        timeout,
        persistent,
        timestamp: Date.now(),
      };

      // Add to queue
      announcementsRef.current.push(announcement);

      // Maintain queue size
      if (announcementsRef.current.length > maxQueueSize) {
        const removed = announcementsRef.current.shift();
        if (removed && !removed.persistent) {
          removeAnnouncement(removed.id);
        }
      }

      // Select appropriate region and announce
      const region =
        priority === 'assertive' ? assertiveRegionRef.current : politeRegionRef.current;

      if (region) {
        // Clear previous content for non-persistent announcements
        if (!persistent) {
          region.textContent = '';
        }

        // Add new message
        region.textContent = rtl ? `\u202B${message}` : message;

        // Set timeout to clear if not persistent
        if (!persistent && timeout > 0) {
          const timeoutId = setTimeout(() => {
            if (region.textContent === message || region.textContent === `\u202B${message}`) {
              region.textContent = '';
            }
            removeAnnouncement(announcementId);
          }, timeout);

          timeoutsRef.current.set(announcementId, timeoutId);
        }
      }

      return announcementId;
    },
    [defaultTimeout, maxQueueSize, rtl, removeAnnouncement]
  );

  const announcePolite = useCallback(
    (message: string, options?: { timeout?: number; persistent?: boolean; id?: string }) => {
      return announce(message, 'polite', options);
    },
    [announce]
  );

  const announceAssertive = useCallback(
    (message: string, options?: { timeout?: number; persistent?: boolean; id?: string }) => {
      return announce(message, 'assertive', options);
    },
    [announce]
  );

  const clear = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current.clear();

    // Clear all announcements
    announcementsRef.current = [];

    // Clear regions
    if (politeRegionRef.current) {
      politeRegionRef.current.textContent = '';
    }
    if (assertiveRegionRef.current) {
      assertiveRegionRef.current.textContent = '';
    }
  }, []);

  const clearPriority = useCallback(
    (priority: 'polite' | 'assertive') => {
      const toRemove = announcementsRef.current.filter((ann) => ann.priority === priority);
      toRemove.forEach((ann) => removeAnnouncement(ann.id));

      const region =
        priority === 'assertive' ? assertiveRegionRef.current : politeRegionRef.current;
      if (region) {
        region.textContent = '';
      }
    },
    [removeAnnouncement]
  );

  const getAnnouncements = useCallback((priority?: 'polite' | 'assertive') => {
    return priority
      ? announcementsRef.current.filter((ann) => ann.priority === priority)
      : [...announcementsRef.current];
  }, []);

  const hasActiveAnnouncement = useCallback(
    (priority?: 'polite' | 'assertive') => {
      const announcements = getAnnouncements(priority);
      return announcements.some((ann) => !ann.timeout || Date.now() - ann.timestamp < ann.timeout);
    },
    [getAnnouncements]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  return {
    announce,
    announcePolite,
    announceAssertive,
    clear,
    clearPriority,
    getAnnouncements,
    hasActiveAnnouncement,
    removeAnnouncement,
    politeRegionRef,
    assertiveRegionRef,
  };
};
