// Route-based preloading utility for performance optimization
import React from 'react';

interface PreloadableComponent {
  preload: () => Promise<void>;
}

interface RoutePreloaderConfig {
  enabled: boolean;
  preloadOnHover: boolean;
  preloadOnIdle: boolean;
  hoverDelay: number;
  idleTimeout: number;
}

class RoutePreloader {
  private preloadedChunks = new Set<string>();
  private hoverTimeouts = new Map<string, number>();
  private config: RoutePreloaderConfig;

  constructor(config: Partial<RoutePreloaderConfig> = {}) {
    this.config = {
      enabled: true,
      preloadOnHover: true,
      preloadOnIdle: true,
      hoverDelay: 200,
      idleTimeout: 5000,
      ...config,
    };

    if (this.config.preloadOnIdle && typeof window !== 'undefined') {
      this.setupIdlePreloading();
    }
  }

  // Create a lazy component with preloading capability
  createLazyComponent<T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    chunkName: string
  ) {
    // Create React.lazy component without invoking importFn eagerly
    const LazyComponent = React.lazy(importFn);

    // Return preloadable component with separate preload function
    const preloadableComponent = {
      LazyComponent,
      preload: async () => {
        if (this.preloadedChunks.has(chunkName)) return;

        try {
          await importFn();
          this.preloadedChunks.add(chunkName);
          console.log(`[RoutePreloader] Preloaded chunk: ${chunkName}`);
        } catch (error) {
          console.error(`[RoutePreloader] Failed to preload chunk: ${chunkName}`, error);
        }
      },
    } as PreloadableComponent & { LazyComponent: React.LazyExoticComponent<T> };

    return preloadableComponent;
  }

  // Preload on hover with delay
  preloadOnHover(chunkName: string, importFn: () => Promise<void>) {
    if (!this.config.preloadOnHover || !this.config.enabled) return;

    // Clear existing timeout for this chunk
    const existingTimeout = this.hoverTimeouts.get(chunkName);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      importFn();
      this.hoverTimeouts.delete(chunkName);
    }, this.config.hoverDelay);

    this.hoverTimeouts.set(chunkName, timeout);
  }

  // Cancel hover preloading
  cancelHoverPreload(chunkName: string) {
    const timeout = this.hoverTimeouts.get(chunkName);
    if (timeout) {
      clearTimeout(timeout);
      this.hoverTimeouts.delete(chunkName);
    }
  }

  // Setup idle preloading for common routes
  private setupIdlePreloading() {
    if (!('requestIdleCallback' in window)) return;

    const preloadCommonRoutes = () => {
      if (!this.config.preloadOnIdle || !this.config.enabled) return;

      requestIdleCallback(
        () => {
          // Preload home page (most common)
          this.preloadChunk('home');

          // Preload products page (second most common)
          setTimeout(() => this.preloadChunk('products'), 1000);

          // Preload about page
          setTimeout(() => this.preloadChunk('about'), 2000);
        },
        { timeout: this.config.idleTimeout }
      );
    };

    // Start preloading after initial page load
    if (document.readyState === 'complete') {
      setTimeout(preloadCommonRoutes, 2000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(preloadCommonRoutes, 2000);
      });
    }
  }

  // Preload a specific chunk
  async preloadChunk(chunkName: string): Promise<void> {
    if (this.preloadedChunks.has(chunkName)) return;

    try {
      const importFn = this.getChunkImportFunction(chunkName);
      if (importFn) {
        await importFn();
        this.preloadedChunks.add(chunkName);
        console.log(`[RoutePreloader] Preloaded chunk: ${chunkName}`);
      }
    } catch (error) {
      console.error(`[RoutePreloader] Failed to preload chunk: ${chunkName}`, error);
    }
  }

  // Get import function for a chunk
  private getChunkImportFunction(chunkName: string): (() => Promise<void>) | null {
    const chunkImports: Record<string, () => Promise<void>> = {
      home: async () => {
        await import('@/pages/HomePage');
      },
      products: async () => {
        await import('@/pages/ProductCatalogPage');
      },
      about: async () => {
        await import('@/pages/AboutPage');
      },
      blog: async () => {
        await import('@/pages/BlogPage');
      },
      faq: async () => {
        await import('@/pages/FAQPage');
      },
      contact: async () => {
        await import('@/pages/ContactPage');
      },
      cart: async () => {
        await import('@/pages/CartPage');
      },
      login: async () => {
        await import('@/pages/LoginPage');
      },
      rewards: async () => {
        await import('@/pages/RewardsPage');
      },
    };

    return chunkImports[chunkName] || null;
  }

  // Add dynamic prefetch link to head
  addPrefetchLink(href: string, as: string = 'script'): void {
    if (typeof document === 'undefined') return;

    // Check if link already exists
    const existingLink = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = as;

    // Add to head
    document.head.appendChild(link);

    // Remove after 10 seconds to avoid clutter
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }, 10000);
  }

  // Get preloaded chunks status
  getPreloadedChunks(): string[] {
    return Array.from(this.preloadedChunks);
  }

  // Clear all preloaded chunks (useful for testing)
  clearPreloadedChunks(): void {
    this.preloadedChunks.clear();
    this.hoverTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.hoverTimeouts.clear();
  }

  // Enable/disable preloading
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.clearPreloadedChunks();
    }
  }
}

// Create singleton instance
export const routePreloader = new RoutePreloader();

// Export utility functions
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  chunkName: string
) => routePreloader.createLazyComponent(importFn, chunkName);

export const preloadRoute = (chunkName: string) => routePreloader.preloadChunk(chunkName);

export const preloadOnHover = (chunkName: string, importFn: () => Promise<void>) =>
  routePreloader.preloadOnHover(chunkName, importFn);

export const cancelHoverPreload = (chunkName: string) =>
  routePreloader.cancelHoverPreload(chunkName);

export default routePreloader;
