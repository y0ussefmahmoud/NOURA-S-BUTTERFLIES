// Service Worker with advanced caching strategies for Noura's Butterflies
const CACHE_VERSION = 'v2.0.0';
const STATIC_CACHE = `nouras-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `nouras-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `nouras-images-${CACHE_VERSION}`;
const API_CACHE = `nouras-api-${CACHE_VERSION}`;

// Cache configuration
const CACHE_CONFIG = {
  static: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 100,
  },
  images: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 500,
  },
  api: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50,
  },
  dynamic: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxEntries: 200,
  },
};

// Critical assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  '/safari-pinned-tab.svg',
  '/offline.html', // Add offline page
];

// Critical CSS and JS files - will be dynamically populated at build time
const CRITICAL_ASSETS = [
  // These will be replaced with actual hashed asset names at build time
  // Example: '/assets/index-[hash].css', '/assets/main-[hash].js'
];

// Critical fonts
const CRITICAL_FONTS = [
  'https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/notoserif/v22/ga6Iaw1J5X9T9RW6j9bNfFcWbQ.woff2',
  'https://fonts.gstatic.com/s/plusjakartasans/v3/LDIbaomQNQcsA88c7O9yZ4KMCoZ4wF8X0P3pxZSzXGQ.woff2',
];

// Function to get critical assets dynamically
const getCriticalAssets = async () => {
  try {
    // Try to get the asset manifest from the build
    const response = await fetch('/asset-manifest.json');
    if (response.ok) {
      const manifest = await response.json();
      return [
        manifest['main.js'],
        manifest['main.css'],
        manifest['index.html'],
        // Add other critical assets from manifest
      ].filter(Boolean);
    }
  } catch (error) {
    console.warn('[SW] Could not load asset manifest, using fallback');
  }
  
  // Fallback to common patterns
  return CRITICAL_ASSETS;
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(async (cache) => {
        console.log('[SW] Caching static assets');
        
        // Cache static assets
        await cache.addAll(STATIC_ASSETS);
        
        // Get and cache critical assets dynamically
        try {
          const criticalAssets = await getCriticalAssets();
          if (criticalAssets.length > 0) {
            console.log('[SW] Caching critical assets:', criticalAssets);
            await cache.addAll(criticalAssets);
          }
        } catch (error) {
          console.warn('[SW] Failed to cache critical assets:', error);
        }
        
        // Cache critical fonts
        try {
          await cache.addAll(CRITICAL_FONTS);
          console.log('[SW] Cached critical fonts');
        } catch (error) {
          console.warn('[SW] Failed to cache critical fonts:', error);
        }
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          }).filter(Boolean)
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        // Take control of all open pages
        return self.clients.claim();
      })
  );
});

// Determine cache strategy based on request type
const getCacheStrategy = (request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // API requests - Stale-While-Revalidate
  if (pathname.startsWith('/api/') || url.hostname.includes('api.')) {
    return { strategy: 'staleWhileRevalidate', cache: API_CACHE };
  }
  
  // Images - Cache-First with long TTL
  if (/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i.test(pathname)) {
    return { strategy: 'cacheFirst', cache: IMAGE_CACHE };
  }
  
  // Fonts - Cache-First
  if (/\.(woff|woff2|ttf|eot)$/i.test(pathname) || url.hostname.includes('fonts.gstatic.com')) {
    return { strategy: 'cacheFirst', cache: STATIC_CACHE };
  }
  
  // CSS and JS - Cache-First for versioned files
  if (/\.(css|js)$/i.test(pathname) && pathname.includes('-[hash]')) {
    return { strategy: 'cacheFirst', cache: STATIC_CACHE };
  }
  
  // HTML pages - Network-First
  if (pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.')) {
    return { strategy: 'networkFirst', cache: DYNAMIC_CACHE };
  }
  
  // Default - Stale-While-Revalidate
  return { strategy: 'staleWhileRevalidate', cache: DYNAMIC_CACHE };
};

// Cache-First strategy
const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache entry is still valid
    const dateHeader = cachedResponse.headers.get('sw-cached-at');
    if (dateHeader) {
      const cacheAge = Date.now() - parseInt(dateHeader);
      const maxAge = cacheName.includes(IMAGE_CACHE) ? CACHE_CONFIG.images.maxAge : CACHE_CONFIG.static.maxAge;
      
      if (cacheAge < maxAge) {
        return cachedResponse;
      }
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Add cache timestamp
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });
      
      await cache.put(request, modifiedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network failed, returning cached response:', error);
    return cachedResponse || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
};

// Network-First strategy
const networkFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network failed, trying cache:', error);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html') || new Response('Offline', { 
        status: 503, 
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
};

// Stale-While-Revalidate strategy
const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to update from network
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.warn('[SW] Network update failed:', error);
      return null;
    });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If no cache, wait for network
  return fetchPromise;
};

// Main fetch event handler
self.addEventListener('fetch', (event) => {
  const { strategy, cache } = getCacheStrategy(event.request);
  
  event.respondWith(
    (async () => {
      switch (strategy) {
        case 'cacheFirst':
          return cacheFirst(event.request, cache);
        case 'networkFirst':
          return networkFirst(event.request, cache);
        case 'staleWhileRevalidate':
          return staleWhileRevalidate(event.request, cache);
        default:
          return fetch(event.request);
      }
    })()
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Retry failed requests
      console.log('[SW] Background sync triggered')
    );
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  const title = data?.title || 'Noura\'s Butterflies';
  const options = {
    body: data?.body || 'New updates available',
    icon: '/favicon-32x32.png',
    badge: '/favicon-16x16.png',
    data: data?.data || {},
    actions: [
      {
        action: 'explore',
        title: 'Explore Products',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const urlToOpen = action === 'explore' ? '/products' : '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Focus existing tab if available
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Periodic sync for background updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-update') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          // Update dynamic content
          return cache.addAll(['/products', '/blog']);
        })
    );
  }
});

console.log('[SW] Service worker loaded:', CACHE_VERSION);
