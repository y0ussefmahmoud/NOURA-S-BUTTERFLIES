import { useRef, useCallback } from 'react';

type AnnouncementPriority = 'polite' | 'assertive';

interface Announcement {
  message: string;
  priority: AnnouncementPriority;
  timestamp: number;
}

export const useAnnouncer = () => {
  const politeRegionRef = useRef<HTMLDivElement>(null);
  const assertiveRegionRef = useRef<HTMLDivElement>(null);
  const announcementsRef = useRef<Announcement[]>([]);

  const ensureLiveRegion = useCallback((priority: AnnouncementPriority) => {
    if (typeof document === 'undefined') return null;

    const ref = priority === 'assertive' ? assertiveRegionRef : politeRegionRef;
    if (ref.current) return ref.current;

    const existing = document.getElementById(`announcer-${priority}`) as HTMLDivElement | null;
    if (existing) {
      ref.current = existing;
      return existing;
    }

    const region = document.createElement('div');
    region.id = `announcer-${priority}`;
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('aria-relevant', 'additions text');
    region.style.position = 'absolute';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.margin = '-1px';
    region.style.border = '0';
    region.style.padding = '0';
    region.style.overflow = 'hidden';
    region.style.clip = 'rect(0 0 0 0)';
    region.style.whiteSpace = 'nowrap';

    document.body.appendChild(region);
    ref.current = region;
    return region;
  }, []);

  const announce = useCallback((message: string, priority: AnnouncementPriority = 'polite') => {
    const announcement: Announcement = {
      message,
      priority,
      timestamp: Date.now(),
    };

    // Add to queue
    announcementsRef.current.push(announcement);

    // Select appropriate region
    const region = ensureLiveRegion(priority);

    if (region) {
      // Clear previous content
      region.textContent = '';

      // Add new message
      region.textContent = message;

      // Clear after a delay to prevent screen reader clutter
      setTimeout(() => {
        if (region.textContent === message) {
          region.textContent = '';
        }
      }, 1000);
    }

    // Clean old announcements from queue (keep only last 10)
    if (announcementsRef.current.length > 10) {
      announcementsRef.current = announcementsRef.current.slice(-10);
    }
  }, []);

  const announcePolite = useCallback(
    (message: string) => {
      announce(message, 'polite');
    },
    [announce]
  );

  const announceAssertive = useCallback(
    (message: string) => {
      announce(message, 'assertive');
    },
    [announce]
  );

  const clear = useCallback(() => {
    if (ensureLiveRegion('polite')) {
      politeRegionRef.current!.textContent = '';
    }
    if (ensureLiveRegion('assertive')) {
      assertiveRegionRef.current!.textContent = '';
    }
    announcementsRef.current = [];
  }, [ensureLiveRegion]);

  const getRecentAnnouncements = useCallback((count: number = 5) => {
    return announcementsRef.current.slice(-count);
  }, []);

  return {
    announce,
    announcePolite,
    announceAssertive,
    clear,
    getRecentAnnouncements,
    politeRegionRef,
    assertiveRegionRef,
  };
};
