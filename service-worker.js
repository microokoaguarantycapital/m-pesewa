/**
 * M-PESEWA Service Worker
 * Version: 2.1.0
 * Author: M-Pesewa Technology Pvt. Ltd.
 * Description: Progressive Web App Service Worker for offline functionality
 */

// Cache names with versioning
const CACHE_NAME = 'mpesewa-v2.1.0';
const RUNTIME_CACHE = 'mpesewa-runtime-v1';
const OFFLINE_CACHE = 'mpesewa-offline-v1';

// Core assets that should be cached immediately on install
const CORE_ASSETS = [
  // HTML Files
  '/m-pesewa/',
  '/m-pesewa/index.html',
  '/m-pesewa/offline.html',
  '/m-pesewa/404.html',
  
  // Core CSS Files
  '/m-pesewa/assets/css/reset.css',
  '/m-pesewa/assets/css/colors.css',
  '/m-pesewa/assets/css/typography.css',
  '/m-pesewa/assets/css/layout.css',
  '/m-pesewa/assets/css/navigation.css',
  '/m-pesewa/assets/css/header.css',
  '/m-pesewa/assets/css/footer.css',
  '/m-pesewa/assets/css/components.css',
  '/m-pesewa/assets/css/forms.css',
  '/m-pesewa/assets/css/cards.css',
  '/m-pesewa/assets/css/animations.css',
  '/m-pesewa/assets/css/accessibility.css',
  
  // Core JavaScript Files
  '/m-pesewa/core/app.js',
  '/m-pesewa/core/bootstrap.js',
  '/m-pesewa/state/store.js',
  '/m-pesewa/router/router.js',
  '/m-pesewa/utils/validation.js',
  
  // Manifest and Icons
  '/m-pesewa/manifest.json',
  '/m-pesewa/assets/images/favicon.ico',
  '/m-pesewa/assets/images/icons/icon-192x192.png',
  '/m-pesewa/assets/images/icons/icon-512x512.png',
  
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap'
];

// Critical API endpoints (cached for offline use)
const API_CACHE = [
  '/m-pesewa/data/countries.json',
  '/m-pesewa/data/subscriptions.json',
  '/m-pesewa/data/categories.json',
  '/m-pesewa/data/collectors.json'
];

// Image assets to cache
const IMAGE_ASSETS = [
  '/m-pesewa/assets/images/logo.svg',
  '/m-pesewa/assets/images/hero-bg.jpg',
  '/m-pesewa/assets/images/trust-badge.png',
  '/m-pesewa/assets/images/flags/ke.svg',
  '/m-pesewa/assets/images/flags/ug.svg',
  '/m-pesewa/assets/images/flags/tz.svg',
  '/m-pesewa/assets/images/flags/rw.svg'
];

/**
 * Install Event - Cache core assets
 */
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll([...CORE_ASSETS, ...IMAGE_ASSETS, ...API_CACHE]);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting for activation');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== OFFLINE_CACHE) {
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
    .catch(error => {
      console.error('[Service Worker] Activation failed:', error);
    })
  );
});

/**
 * Fetch Event - Network first, cache fallback strategy
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests and non-GET requests
  if (url.origin !== self.location.origin || request.method !== 'GET') {
    return;
  }
  
  // Handle different strategies based on request type
  if (isCoreAsset(request)) {
    // Core assets: Cache First
    event.respondWith(cacheFirst(request));
  } else if (isApiRequest(request)) {
    // API requests: Network First, Cache Fallback
    event.respondWith(networkFirst(request));
  } else if (isImageRequest(request)) {
    // Images: Cache First, Network Fallback
    event.respondWith(cacheFirst(request));
  } else {
    // Everything else: Network First, Cache Fallback
    event.respondWith(networkFirst(request));
  }
});

/**
 * Cache First Strategy
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    event.waitUntil(updateCache(request, cache));
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the new response
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, check runtime cache
    const runtimeCache = await caches.open(RUNTIME_CACHE);
    const runtimeResponse = await runtimeCache.match(request);
    
    if (runtimeResponse) {
      return runtimeResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('/m-pesewa/offline.html');
    }
    
    // Return 404 for other requests
    return new Response('Resource not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

/**
 * Network First Strategy
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Check core cache
    const coreCache = await caches.open(CACHE_NAME);
    const coreCachedResponse = await coreCache.match(request);
    
    if (coreCachedResponse) {
      return coreCachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('/m-pesewa/offline.html');
    }
    
    throw error;
  }
}

/**
 * Update cache in background
 */
async function updateCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silently fail - we already have cached version
    console.log('[Service Worker] Background update failed:', error);
  }
}

/**
 * Check if request is for core asset
 */
function isCoreAsset(request) {
  const url = new URL(request.url);
  
  return CORE_ASSETS.some(asset => 
    url.pathname.endsWith(asset.replace('/m-pesewa/', '')) ||
    url.pathname === asset
  );
}

/**
 * Check if request is for API
 */
function isApiRequest(request) {
  const url = new URL(request.url);
  
  return url.pathname.includes('/data/') ||
         url.pathname.includes('/api/') ||
         url.pathname.endsWith('.json');
}

/**
 * Check if request is for image
 */
function isImageRequest(request) {
  const url = new URL(request.url);
  
  return url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ||
         url.pathname.includes('/assets/images/') ||
         url.pathname.includes('/assets/icons/');
}

/**
 * Sync Event - Handle background sync
 */
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-loan-applications') {
    event.waitUntil(syncLoanApplications());
  } else if (event.tag === 'sync-repayments') {
    event.waitUntil(syncRepayments());
  }
});

/**
 * Sync loan applications that were created offline
 */
async function syncLoanApplications() {
  try {
    const db = await openDatabase();
    const applications = await db.getAll('loanApplications');
    
    for (const application of applications) {
      const response = await fetch('/m-pesewa/api/loan-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(application)
      });
      
      if (response.ok) {
        await db.delete('loanApplications', application.id);
      }
    }
    
    console.log('[Service Worker] Loan applications synced');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    throw error;
  }
}

/**
 * Sync repayment records
 */
async function syncRepayments() {
  try {
    const db = await openDatabase();
    const repayments = await db.getAll('repayments');
    
    for (const repayment of repayments) {
      const response = await fetch('/m-pesewa/api/repayments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(repayment)
      });
      
      if (response.ok) {
        await db.delete('repayments', repayment.id);
      }
    }
    
    console.log('[Service Worker] Repayments synced');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    throw error;
  }
}

/**
 * Open IndexedDB for offline data
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MpesewaOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains('loanApplications')) {
        const loanStore = db.createObjectStore('loanApplications', { keyPath: 'id' });
        loanStore.createIndex('timestamp', 'timestamp', { unique: false });
        loanStore.createIndex('status', 'status', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('repayments')) {
        const repaymentStore = db.createObjectStore('repayments', { keyPath: 'id' });
        repaymentStore.createIndex('ledgerId', 'ledgerId', { unique: false });
        repaymentStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('userActions')) {
        const actionStore = db.createObjectStore('userActions', { keyPath: 'id' });
        actionStore.createIndex('type', 'type', { unique: false });
        actionStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Push Notification Event
 */
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received');
  
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'M-Pesewa Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/m-pesewa/assets/images/icons/icon-192x192.png',
    badge: '/m-pesewa/assets/images/icons/badge-96x96.png',
    tag: data.tag || 'general',
    data: data.url || '/m-pesewa/',
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    vibrate: [200, 100, 200],
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * Notification Click Event
 */
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data || '/m-pesewa/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

/**
 * Background Periodic Sync
 */
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-exchange-rates') {
    event.waitUntil(updateExchangeRates());
  } else if (event.tag === 'update-categories') {
    event.waitUntil(updateCategories());
  }
});

/**
 * Update exchange rates periodically
 */
async function updateExchangeRates() {
  try {
    const response = await fetch('/m-pesewa/api/exchange-rates');
    const data = await response.json();
    
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put('/m-pesewa/api/exchange-rates', new Response(JSON.stringify(data)));
    
    console.log('[Service Worker] Exchange rates updated');
  } catch (error) {
    console.error('[Service Worker] Failed to update exchange rates:', error);
  }
}

/**
 * Update emergency categories
 */
async function updateCategories() {
  try {
    const response = await fetch('/m-pesewa/api/categories');
    const data = await response.json();
    
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put('/m-pesewa/api/categories', new Response(JSON.stringify(data)));
    
    console.log('[Service Worker] Categories updated');
  } catch (error) {
    console.error('[Service Worker] Failed to update categories:', error);
  }
}

/**
 * Message Event - Communication with clients
 */
self.addEventListener('message', event => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CLEAR_CACHE') {
    clearCache();
  } else if (event.data.type === 'GET_CACHE_INFO') {
    getCacheInfo().then(info => {
      event.ports[0].postMessage(info);
    });
  } else if (event.data.type === 'UPDATE_CACHE') {
    updateSpecificCache(event.data.url);
  }
});

/**
 * Clear all caches
 */
async function clearCache() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  console.log('[Service Worker] All caches cleared');
}

/**
 * Get cache information
 */
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const cacheInfo = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    cacheInfo[cacheName] = {
      size: requests.length,
      urls: requests.slice(0, 10).map(req => req.url)
    };
  }
  
  return cacheInfo;
}

/**
 * Update specific URL in cache
 */
async function updateSpecificCache(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(url, response.clone());
      console.log(`[Service Worker] Updated cache for: ${url}`);
      return true;
    }
  } catch (error) {
    console.error(`[Service Worker] Failed to update cache for ${url}:`, error);
  }
  return false;
}

/**
 * Error handler for service worker
 */
self.addEventListener('error', event => {
  console.error('[Service Worker] Error:', event.error);
  
  // Report error to analytics
  if (self.registration && self.registration.scope) {
    fetch('/m-pesewa/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'service-worker',
        message: event.error.message,
        stack: event.error.stack,
        timestamp: new Date().toISOString(),
        url: event.filename,
        line: event.lineno,
        column: event.colno
      })
    }).catch(() => {
      // Silently fail - we don't want to cause more errors
    });
  }
});

/**
 * Unhandled rejection handler
 */
self.addEventListener('unhandledrejection', event => {
  console.error('[Service Worker] Unhandled rejection:', event.reason);
  
  // Report to analytics
  if (self.registration && self.registration.scope) {
    fetch('/m-pesewa/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'service-worker-rejection',
        message: event.reason.message,
        stack: event.reason.stack,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {
      // Silently fail
    });
  }
});

console.log('[Service Worker] Loaded successfully');
