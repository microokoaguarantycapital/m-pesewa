// M-Pesewa Service Worker
// Version: 1.0.0
// Cache: m-pesewa-v1

const CACHE_NAME = 'm-pesewa-v1';
const STATIC_CACHE = 'm-pesewa-static-v1';
const DYNAMIC_CACHE = 'm-pesewa-dynamic-v1';

// Core static assets to cache on install
const STATIC_ASSETS = [
  '/m-pesewa/',
  '/m-pesewa/index.html',
  '/m-pesewa/manifest.json',
  
  // Core CSS
  '/m-pesewa/assets/css/main.css',
  '/m-pesewa/assets/css/components.css',
  '/m-pesewa/assets/css/animations.css',
  '/m-pesewa/assets/css/dashboard.css',
  '/m-pesewa/assets/css/forms.css',
  '/m-pesewa/assets/css/tables.css',
  
  // Core JS
  '/m-pesewa/assets/js/app.js',
  '/m-pesewa/assets/js/utils.js',
  '/m-pesewa/assets/js/auth.js',
  '/m-pesewa/assets/js/pwa.js',
  '/m-pesewa/assets/js/roles.js',
  '/m-pesewa/assets/js/groups.js',
  '/m-pesewa/assets/js/lending.js',
  '/m-pesewa/assets/js/borrowing.js',
  '/m-pesewa/assets/js/calculator.js',
  '/m-pesewa/assets/js/countries.js',
  
  // Images & Icons
  '/m-pesewa/assets/images/logo.svg',
  
  // Pages (app shell)
  '/m-pesewa/pages/about.html',
  '/m-pesewa/pages/qa.html',
  '/m-pesewa/pages/contact.html'
];

// Install Event - Cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Service Worker] Caching core static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting on install');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Cache install failed:', error);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch Event - Network with cache fallback
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // For HTML pages, try network first, then cache
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      networkFirstStrategy(request)
    );
    return;
  }
  
  // For CSS, JS, images - cache first, then network
  if (request.url.match(/\.(css|js|svg|png|jpg|jpeg|gif|ico)$/)) {
    event.respondWith(
      cacheFirstStrategy(request)
    );
    return;
  }
  
  // For JSON data - stale-while-revalidate
  if (request.url.match(/\.(json)$/)) {
    event.respondWith(
      staleWhileRevalidateStrategy(request)
    );
    return;
  }
  
  // Default: network first
  event.respondWith(
    networkFirstStrategy(request)
  );
});

// Network First Strategy
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache and offline, return offline page
    if (!navigator.onLine) {
      return caches.match('/m-pesewa/offline.html') || 
             new Response('You are offline. Please check your internet connection.', {
               status: 503,
               headers: { 'Content-Type': 'text/plain' }
             });
    }
    
    throw error;
  }
}

// Cache First Strategy
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the new response
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed and not in cache
    console.log('[Service Worker] Cache miss and network failed:', request.url);
    
    // Return generic fallbacks for specific file types
    if (request.url.match(/\.(css)$/)) {
      return new Response('/* Offline - CSS not available */', {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    
    if (request.url.match(/\.(js)$/)) {
      return new Response('// Offline - JS not available', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    
    if (request.url.match(/\.(svg|png|jpg|jpeg|gif)$/)) {
      // Return a simple SVG placeholder
      const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#f0f0f0"/>
        <text x="50" y="50" text-anchor="middle" dy=".3em" fill="#999" font-size="12">Image</text>
      </svg>`;
      return new Response(placeholder, {
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  // Not in cache, fetch fresh
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] JSON fetch failed:', request.url);
    return new Response('{}', {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Update cache in background
async function updateCacheInBackground(request) {
  if (!navigator.onLine) return;
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('[Service Worker] Background cache update failed:', request.url);
  }
}

// Background Sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'submit-form') {
    console.log('[Service Worker] Background sync for form submission');
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  // This would handle offline form submissions
  // For now, just log
  console.log('[Service Worker] Syncing offline forms');
}

// Push Notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from M-Pesewa',
    icon: '/m-pesewa/assets/images/icons/icon-192x192.png',
    badge: '/m-pesewa/assets/images/icons/badge-72x72.png',
    tag: 'm-pesewa-notification',
    requireInteraction: true,
    data: {
      url: '/m-pesewa/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('M-Pesewa', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there's already a window/tab open
        for (const client of windowClients) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/m-pesewa/');
        }
      })
  );
});

// Handle offline.html
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/m-pesewa/offline.html');
        })
    );
  }
});

// Periodic cache updates (every 24 hours)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  console.log('[Service Worker] Periodic cache update');
  
  try {
    const cache = await caches.open(STATIC_CACHE);
    const requests = STATIC_ASSETS.map(url => new Request(url));
    
    const responses = await Promise.all(
      requests.map(request => fetch(request).catch(() => null))
    );
    
    responses.forEach((response, index) => {
      if (response && response.ok) {
        cache.put(requests[index], response);
      }
    });
    
    console.log('[Service Worker] Cache updated successfully');
  } catch (error) {
    console.error('[Service Worker] Periodic update failed:', error);
  }
}

// Message handling from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.ports[0].postMessage({
      staticCache: STATIC_CACHE,
      dynamicCache: DYNAMIC_CACHE,
      version: '1.0.0'
    });
  }
});

// Error handling
self.addEventListener('error', event => {
  console.error('[Service Worker] Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[Service Worker] Unhandled rejection:', event.reason);
});