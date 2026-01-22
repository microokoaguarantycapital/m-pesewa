// M-PESEWA Service Worker
// Version: 2.0.0
// Caching Strategy: Cache First, Network Fallback

const CACHE_NAME = 'mpesewa-v2';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',
  '/assets/js/app.js',
  '/assets/js/utils.js',
  '/assets/js/auth.js',
  '/assets/js/pwa.js',
  '/assets/images/logo.svg',
  '/offline.html'
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Install completed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activation completed');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // Handle static assets
  event.respondWith(cacheFirstStrategy(event.request));
});

// Cache First Strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    // Try to get from cache first
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }

    // If not in cache, fetch from network
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache the response for future use
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // If offline and request is for a page, show offline page
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    
    // For other requests, return error response
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Network First Strategy for API requests
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache either, return error
    return new Response('Network error and no cache available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Background Sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-loans') {
    console.log('[Service Worker] Background sync: loans');
    event.waitUntil(syncLoans());
  }
  
  if (event.tag === 'sync-ledgers') {
    console.log('[Service Worker] Background sync: ledgers');
    event.waitUntil(syncLedgers());
  }
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    console.log('[Service Worker] Periodic sync: updating cache');
    event.waitUntil(updateCache());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  const options = {
    body: event.data?.text() || 'New update from M-PESEWA',
    icon: '/assets/images/icons/icon-192.png',
    badge: '/assets/images/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'mpesewa-notification'
    },
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('M-PESEWA', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event.action);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Default action: open app
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Helper functions
async function syncLoans() {
  // Implement loan sync logic
  console.log('Syncing loans...');
}

async function syncLedgers() {
  // Implement ledger sync logic
  console.log('Syncing ledgers...');
}

async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  return Promise.all(
    requests.map(async (request) => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response);
        }
      } catch (error) {
        console.log(`Failed to update cache for ${request.url}:`, error);
      }
    })
  );
}
