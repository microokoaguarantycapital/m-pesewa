/**
 * M-Pesewa Service Worker
 * Version: 2.0.0
 * Cache Strategy: Cache First, Network Fallback with Background Sync
 */

const CACHE_NAME = 'mpesewa-v2.0.0';
const DYNAMIC_CACHE = 'mpesewa-dynamic-v1.0.0';
const OFFLINE_CACHE = 'mpesewa-offline-v1.0.0';

// Core assets to cache on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/404.html',
  '/manifest.json',
  
  // Core CSS
  '/assets/css/reset.css',
  '/assets/css/tokens.css',
  '/assets/css/typography.css',
  '/assets/css/colors.css',
  '/assets/css/layout.css',
  '/assets/css/components.css',
  '/assets/css/navigation.css',
  '/assets/css/header.css',
  '/assets/css/footer.css',
  
  // Core JS
  '/core/app.js',
  '/core/bootstrap.js',
  '/state/store.js',
  '/router/router.js',
  '/navigation/menu-config.js',
  
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap',
  
  // Essential Images
  '/assets/images/logos/icon-72x72.png',
  '/assets/images/logos/icon-192x192.png',
  '/assets/images/logos/icon-512x512.png',
  
  // Critical Pages
  '/auth/login.html',
  '/auth/register.html',
  '/how-it-works.html',
  '/faq.html',
  '/contact.html'
];

// API endpoints that should be cached dynamically
const API_ENDPOINTS = [
  '/api/user/profile',
  '/api/groups/list',
  '/api/ledgers/active',
  '/api/subscription/status'
];

// Emergency pages that should be available offline
const EMERGENCY_PAGES = [
  '/emergency/transport.html',
  '/emergency/data.html',
  '/emergency/gas.html',
  '/emergency/food.html',
  '/emergency/medicine.html'
];

// Install Event - Cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Core assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches that don't match current version
          if (cacheName !== CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== OFFLINE_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || 
      url.protocol === 'chrome-extension:' || 
      request.url.includes('chrome-extension')) {
    return;
  }
  
  // Handle API requests with network-first strategy
  if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle HTML pages with stale-while-revalidate strategy
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(handleHtmlRequest(request));
    return;
  }
  
  // Handle static assets with cache-first strategy
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // Default: network-first strategy
  event.respondWith(handleDefaultRequest(request));
});

// Check if request is for API
function isApiRequest(request) {
  return request.url.includes('/api/') || API_ENDPOINTS.some(endpoint => 
    request.url.includes(endpoint)
  );
}

// Check if request is for static asset
function isStaticAsset(request) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico'];
  const url = request.url.toLowerCase();
  return staticExtensions.some(ext => url.endsWith(ext));
}

// Handle API requests (Network First)
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] API network failed, trying cache:', request.url);
    
    // Try cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline placeholder for API
    return new Response(
      JSON.stringify({ 
        error: 'offline', 
        message: 'You are offline. Please check your connection.',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle HTML requests (Stale While Revalidate)
async function handleHtmlRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Always try to update cache in background
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Network failed, do nothing
    });
  
  // Return cached response if available, otherwise wait for network
  if (cachedResponse) {
    // Don't wait for network for emergency pages
    if (EMERGENCY_PAGES.some(page => request.url.includes(page))) {
      return cachedResponse;
    }
    return cachedResponse;
  }
  
  // Wait for network if no cache
  try {
    const networkResponse = await fetchPromise;
    return networkResponse;
  } catch (error) {
    // Check if this is an emergency page
    if (EMERGENCY_PAGES.some(page => request.url.includes(page))) {
      const offlineResponse = await cache.match('/offline.html');
      return offlineResponse || new Response('Offline - Emergency information not available');
    }
    
    // For other pages, return offline page
    return caches.match('/offline.html');
  }
}

// Handle static assets (Cache First)
async function handleStaticAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
      })
      .catch(() => {
        // Network failed, keep cached version
      });
    
    return cachedResponse;
  }
  
  // If not in cache, try network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return appropriate offline response
    if (request.url.includes('.css')) {
      return new Response('/* Offline - CSS not available */', {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    
    if (request.url.includes('.js')) {
      return new Response('// Offline - JS not available', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    
    // For images, return a placeholder
    if (request.url.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
      return new Response(
        `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="#003366">
          <rect width="24" height="24" fill="#f8f9fa"/>
          <text x="12" y="12" text-anchor="middle" dy=".3em" font-size="3" fill="#003366">M-P</text>
        </svg>`,
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Handle default requests (Network First)
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok && !request.url.includes('sockjs') && !request.url.includes('chrome-extension')) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try offline cache
    const offlineResponse = await caches.match('/offline.html');
    return offlineResponse || new Response('Offline - Please check your internet connection');
  }
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-ledgers') {
    event.waitUntil(syncLedgers());
  }
  
  if (event.tag === 'sync-repayments') {
    event.waitUntil(syncRepayments());
  }
});

// Sync ledgers when back online
async function syncLedgers() {
  console.log('[Service Worker] Syncing ledgers...');
  
  try {
    // Get pending ledger updates from IndexedDB
    const pendingLedgers = await getPendingLedgers();
    
    for (const ledger of pendingLedgers) {
      await fetch('/api/ledgers/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ledger)
      });
      
      // Remove from pending after successful sync
      await removePendingLedger(ledger.id);
    }
    
    console.log('[Service Worker] Ledgers synced successfully');
  } catch (error) {
    console.error('[Service Worker] Ledger sync failed:', error);
  }
}

// Sync repayments when back online
async function syncRepayments() {
  console.log('[Service Worker] Syncing repayments...');
  
  try {
    const pendingRepayments = await getPendingRepayments();
    
    for (const repayment of pendingRepayments) {
      await fetch('/api/repayments/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(repayment)
      });
      
      await removePendingRepayment(repayment.id);
    }
    
    console.log('[Service Worker] Repayments synced successfully');
  } catch (error) {
    console.error('[Service Worker] Repayment sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    body: data.body || 'M-Pesewa Notification',
    icon: '/assets/images/logos/icon-192x192.png',
    badge: '/assets/images/logos/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'M-Pesewa', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event.notification.tag);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    console.log('[Service Worker] Periodic sync for cache update');
    event.waitUntil(updateCache());
  }
});

// Update cache periodically
async function updateCache() {
  console.log('[Service Worker] Updating cache...');
  
  const cache = await caches.open(CACHE_NAME);
  
  for (const asset of CORE_ASSETS) {
    try {
      const response = await fetch(asset);
      if (response.ok) {
        await cache.put(asset, response);
      }
    } catch (error) {
      console.log(`[Service Worker] Failed to update ${asset}:`, error);
    }
  }
  
  console.log('[Service Worker] Cache update complete');
}

// Helper functions for IndexedDB (simplified)
async function getPendingLedgers() {
  // In a real implementation, this would access IndexedDB
  return [];
}

async function removePendingLedger(id) {
  // In a real implementation, this would remove from IndexedDB
}

async function getPendingRepayments() {
  // In a real implementation, this would access IndexedDB
  return [];
}

async function removePendingRepayment(id) {
  // In a real implementation, this would remove from IndexedDB
}

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    updateCache();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('[Service Worker] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[Service Worker] Unhandled rejection:', event.reason);
});