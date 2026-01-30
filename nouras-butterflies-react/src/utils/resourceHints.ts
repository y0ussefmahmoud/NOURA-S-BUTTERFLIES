// Dynamic resource hints utility for performance optimization

export interface ResourceHintOptions {
  href: string;
  as?: 'script' | 'style' | 'font' | 'image' | 'document' | 'fetch';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  fetchPriority?: 'high' | 'low' | 'auto';
  integrity?: string;
  media?: string;
}

export interface PreconnectOptions {
  href: string;
  crossorigin?: 'anonymous' | 'use-credentials';
}

export interface DnsPrefetchOptions {
  href: string;
}

// Add preconnect hint
export const addPreconnect = (options: PreconnectOptions): HTMLLinkElement => {
  if (typeof document === 'undefined') {
    throw new Error('addPreconnect can only be used in a browser environment');
  }

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = options.href;

  if (options.crossorigin) {
    link.crossOrigin = options.crossorigin;
  }

  document.head.appendChild(link);
  return link;
};

// Add DNS prefetch hint
export const addDnsPrefetch = (options: DnsPrefetchOptions): HTMLLinkElement => {
  if (typeof document === 'undefined') {
    throw new Error('addDnsPrefetch can only be used in a browser environment');
  }

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = options.href;

  document.head.appendChild(link);
  return link;
};

// Add preload hint
export const addPreload = (options: ResourceHintOptions): HTMLLinkElement => {
  if (typeof document === 'undefined') {
    throw new Error('addPreload can only be used in a browser environment');
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = options.href;

  if (options.as) {
    link.as = options.as;
  }

  if (options.type) {
    link.type = options.type;
  }

  if (options.crossorigin) {
    link.crossOrigin = options.crossorigin;
  }

  if (options.fetchPriority) {
    link.setAttribute('fetchpriority', options.fetchPriority);
  }

  if (options.integrity) {
    link.integrity = options.integrity;
  }

  if (options.media) {
    link.media = options.media;
  }

  document.head.appendChild(link);
  return link;
};

// Add prefetch hint
export const addPrefetch = (options: ResourceHintOptions): HTMLLinkElement => {
  if (typeof document === 'undefined') {
    throw new Error('addPrefetch can only be used in a browser environment');
  }

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = options.href;

  if (options.as) {
    link.as = options.as;
  }

  if (options.type) {
    link.type = options.type;
  }

  if (options.crossorigin) {
    link.crossOrigin = options.crossorigin;
  }

  if (options.integrity) {
    link.integrity = options.integrity;
  }

  if (options.media) {
    link.media = options.media;
  }

  document.head.appendChild(link);
  return link;
};

// Add modulepreload hint
export const addModulePreload = (
  href: string,
  options: Partial<ResourceHintOptions> = {}
): HTMLLinkElement => {
  return addPreload({
    href,
    as: 'script',
    type: 'module',
    ...options,
  });
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof document === 'undefined') return;

  const criticalResources = [
    // Critical CSS
    { href: '/src/index.css', as: 'style' as const },

    // Critical fonts
    {
      href: 'https://fonts.gstatic.com/s/notoserif/v22/ga6Iaw1J5X9T9RW6j9bNfFcWbQ.woff2',
      as: 'font' as const,
      type: 'font/woff2',
      crossorigin: 'anonymous' as const,
    },
    {
      href: 'https://fonts.gstatic.com/s/plusjakartasans/v3/LDIbaomQNQcsA88c7O9yZ4KMCoZ4wF8X0P3pxZSzXGQ.woff2',
      as: 'font' as const,
      type: 'font/woff2',
      crossorigin: 'anonymous' as const,
    },
  ];

  criticalResources.forEach((resource) => {
    try {
      addPreload(resource);
    } catch (error) {
      console.warn('Failed to preload resource:', resource.href, error);
    }
  });
};

// Prefetch likely next pages
export const prefetchLikelyPages = () => {
  if (typeof document === 'undefined') return;

  const likelyPages = [
    { href: '/products', as: 'document' as const },
    { href: '/about', as: 'document' as const },
    { href: '/blog', as: 'document' as const },
    { href: '/contact', as: 'document' as const },
  ];

  likelyPages.forEach((page) => {
    try {
      addPrefetch(page);
    } catch (error) {
      console.warn('Failed to prefetch page:', page.href, error);
    }
  });
};

// Setup network hints for common third-party domains
export const setupNetworkHints = () => {
  if (typeof document === 'undefined') return;

  const domains = [
    // Google services
    {
      href: 'https://fonts.googleapis.com',
      type: 'preconnect' as const,
      crossorigin: 'anonymous' as const,
    },
    {
      href: 'https://fonts.gstatic.com',
      type: 'preconnect' as const,
      crossorigin: 'anonymous' as const,
    },

    // Analytics
    { href: '//www.google-analytics.com', type: 'dns-prefetch' as const },
    { href: '//stats.g.doubleclick.net', type: 'dns-prefetch' as const },

    // Social media
    { href: '//connect.facebook.net', type: 'dns-prefetch' as const },
    { href: '//platform.twitter.com', type: 'dns-prefetch' as const },
  ];

  domains.forEach((domain) => {
    try {
      if (domain.type === 'preconnect') {
        addPreconnect({ href: domain.href, crossorigin: domain.crossorigin });
      } else {
        addDnsPrefetch({ href: domain.href });
      }
    } catch (error) {
      console.warn('Failed to setup network hint for:', domain.href, error);
    }
  });
};

// Remove resource hint
export const removeResourceHint = (element: HTMLLinkElement): void => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

// Batch add resource hints
export const addResourceHints = (
  hints: Array<{
    type: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch' | 'modulepreload';
    options: any;
  }>
): HTMLLinkElement[] => {
  return hints
    .map((hint) => {
      try {
        switch (hint.type) {
          case 'preconnect':
            return addPreconnect(hint.options);
          case 'dns-prefetch':
            return addDnsPrefetch(hint.options);
          case 'preload':
            return addPreload(hint.options);
          case 'prefetch':
            return addPrefetch(hint.options);
          case 'modulepreload':
            return addModulePreload(hint.options.href, hint.options);
          default:
            throw new Error(`Unknown hint type: ${hint.type}`);
        }
      } catch (error) {
        console.warn('Failed to add resource hint:', hint, error);
        return null as any;
      }
    })
    .filter(Boolean);
};

// Initialize all resource hints
export const initializeResourceHints = () => {
  if (typeof document === 'undefined') return;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupNetworkHints();
      preloadCriticalResources();

      // Prefetch pages after a short delay to not block initial load
      setTimeout(() => {
        prefetchLikelyPages();
      }, 2000);
    });
  } else {
    setupNetworkHints();
    preloadCriticalResources();
    setTimeout(() => {
      prefetchLikelyPages();
    }, 2000);
  }
};

export default {
  addPreconnect,
  addDnsPrefetch,
  addPreload,
  addPrefetch,
  addModulePreload,
  preloadCriticalResources,
  prefetchLikelyPages,
  setupNetworkHints,
  removeResourceHint,
  addResourceHints,
  initializeResourceHints,
};
