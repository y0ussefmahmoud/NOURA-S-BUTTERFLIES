// Service Worker configuration and utilities

export interface SWConfig {
  version: string;
  caches: {
    static: string;
    dynamic: string;
    images: string;
    api: string;
  };
  strategies: {
    static: 'cacheFirst';
    dynamic: 'networkFirst';
    images: 'cacheFirst';
    api: 'staleWhileRevalidate';
  };
  maxAge: {
    static: number;
    dynamic: number;
    images: number;
    api: number;
  };
  maxEntries: {
    static: number;
    dynamic: number;
    images: number;
    api: number;
  };
}

export const DEFAULT_SW_CONFIG: SWConfig = {
  version: 'v2.0.0',
  caches: {
    static: 'nouras-static-v2.0.0',
    dynamic: 'nouras-dynamic-v2.0.0',
    images: 'nouras-images-v2.0.0',
    api: 'nouras-api-v2.0.0',
  },
  strategies: {
    static: 'cacheFirst',
    dynamic: 'networkFirst',
    images: 'cacheFirst',
    api: 'staleWhileRevalidate',
  },
  maxAge: {
    static: 7 * 24 * 60 * 60 * 1000, // 7 days
    dynamic: 24 * 60 * 60 * 1000, // 24 hours
    images: 30 * 24 * 60 * 60 * 1000, // 30 days
    api: 5 * 60 * 1000, // 5 minutes
  },
  maxEntries: {
    static: 100,
    dynamic: 200,
    images: 500,
    api: 50,
  },
};

// Cache management utilities
export class CacheManager {
  private config: SWConfig;

  constructor(config: SWConfig = DEFAULT_SW_CONFIG) {
    this.config = config;
  }

  // Clean old caches based on version
  async cleanOldCaches(): Promise<void> {
    const cacheNames = await caches.keys();
    const currentVersion = this.config.version;

    const oldCaches = cacheNames.filter(
      (name) => name.includes('nouras-') && !name.includes(currentVersion)
    );

    await Promise.all(
      oldCaches.map((cacheName) => {
        console.log(`[SW] Deleting old cache: ${cacheName}`);
        return caches.delete(cacheName);
      })
    );
  }

  // Get cache size information
  async getCacheSize(): Promise<Record<string, number>> {
    const sizes: Record<string, number> = {};

    for (const [cacheType, cacheName] of Object.entries(this.config.caches)) {
      try {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        let totalSize = 0;

        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }

        sizes[cacheType] = totalSize;
      } catch (error) {
        console.warn(`[SW] Failed to get size for ${cacheType}:`, error);
        sizes[cacheType] = 0;
      }
    }

    return sizes;
  }

  // Limit cache entries
  async limitCacheEntries(cacheName: string, maxEntries: number): Promise<void> {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    if (requests.length > maxEntries) {
      // Remove oldest entries
      const toDelete = requests.slice(0, requests.length - maxEntries);
      await Promise.all(toDelete.map((request) => cache.delete(request)));
    }
  }

  // Clear specific cache
  async clearCache(cacheType: keyof SWConfig['caches']): Promise<void> {
    const cacheName = this.config.caches[cacheType];
    await caches.delete(cacheName);
    console.log(`[SW] Cleared cache: ${cacheType}`);
  }

  // Clear all caches
  async clearAllCaches(): Promise<void> {
    for (const cacheType of Object.keys(this.config.caches)) {
      await this.clearCache(cacheType as keyof SWConfig['caches']);
    }
  }
}

// Background sync manager
export class BackgroundSyncManager {
  private syncQueue: Array<{ url: string; options: RequestInit; timestamp: number }> = [];
  private readonly SYNC_TAG = 'background-sync';

  // Add failed request to sync queue
  addToSyncQueue(url: string, options: RequestInit): void {
    this.syncQueue.push({
      url,
      options,
      timestamp: Date.now(),
    });

    // Save to IndexedDB for persistence
    this.saveSyncQueue();
  }

  // Register for background sync
  async registerSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Type assertion for sync API
        const reg = registration as any;
        await reg.sync.register(this.SYNC_TAG);
        console.log('[SW] Background sync registered');
      } catch (error) {
        console.error('[SW] Failed to register background sync:', error);
      }
    }
  }

  // Save sync queue to IndexedDB
  private async saveSyncQueue(): Promise<void> {
    // Implementation would use IndexedDB to persist the queue
    // For now, just log it
    console.log('[SW] Sync queue updated:', this.syncQueue.length, 'items');
  }

  // Process sync queue
  async processSyncQueue(): Promise<void> {
    const failedRequests = [];

    for (const item of this.syncQueue) {
      try {
        const response = await fetch(item.url, item.options);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        console.log('[SW] Synced request:', item.url);
      } catch (error) {
        console.warn('[SW] Failed to sync request:', item.url, error);
        failedRequests.push(item);
      }
    }

    // Update queue with only failed requests
    this.syncQueue = failedRequests;
    await this.saveSyncQueue();
  }
}

// Push notification manager
export class PushNotificationManager {
  // Subscribe to push notifications
  async subscribe(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[SW] Push notifications not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          import.meta.env?.VITE_VAPID_PUBLIC_KEY || ''
        ),
      });

      console.log('[SW] Push subscription successful');
      return subscription;
    } catch (error) {
      console.error('[SW] Push subscription failed:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const unsubscribed = await subscription.unsubscribe();
        console.log('[SW] Push unsubscribe:', unsubscribed);
        return unsubscribed;
      }

      return true;
    } catch (error) {
      console.error('[SW] Push unsubscribe failed:', error);
      return false;
    }
  }

  // Convert URL base64 to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Performance monitoring for Service Worker
export class SWPerformanceMonitor {
  private metrics: {
    cacheHits: number;
    cacheMisses: number;
    networkRequests: number;
    backgroundSyncs: number;
  } = {
    cacheHits: 0,
    cacheMisses: 0,
    networkRequests: 0,
    backgroundSyncs: 0,
  };

  // Record cache hit
  recordCacheHit(): void {
    this.metrics.cacheHits++;
  }

  // Record cache miss
  recordCacheMiss(): void {
    this.metrics.cacheMisses++;
  }

  // Record network request
  recordNetworkRequest(): void {
    this.metrics.networkRequests++;
  }

  // Record background sync
  recordBackgroundSync(): void {
    this.metrics.backgroundSyncs++;
  }

  // Get performance metrics
  getMetrics(): typeof this.metrics {
    return { ...this.metrics };
  }

  // Calculate cache hit ratio
  getCacheHitRatio(): number {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? this.metrics.cacheHits / total : 0;
  }

  // Reset metrics
  reset(): void {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      networkRequests: 0,
      backgroundSyncs: 0,
    };
  }
}

// Export instances
export const cacheManager = new CacheManager();
export const syncManager = new BackgroundSyncManager();
export const pushManager = new PushNotificationManager();
export const performanceMonitor = new SWPerformanceMonitor();

export default {
  DEFAULT_SW_CONFIG,
  CacheManager,
  BackgroundSyncManager,
  PushNotificationManager,
  SWPerformanceMonitor,
  cacheManager,
  syncManager,
  pushManager,
  performanceMonitor,
};
