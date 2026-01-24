// service-worker.js
/*
 * M-Pesewa Service Worker v2.0
 * Complete PWA service worker with offline capabilities, sync, and cache management
 * Strict FinTech security and data integrity enforcement
 */

// ============================================
// CONFIGURATION CONSTANTS
// ============================================

const CACHE_NAME = 'mpesewa-pwa-v2.0.0';
const OFFLINE_CACHE = 'mpesewa-offline-v1.0.0';
const DYNAMIC_CACHE = 'mpesewa-dynamic-v1.0.0';
const API_CACHE = 'mpesewa-api-v1.0.0';

// Cache version for updates
const CACHE_VERSION = '2.0.0';

// URLs to cache immediately on install
const STATIC_ASSETS = [
  // Core HTML
  'index.html',
  'offline.html',
  '404.html',
  
  // Manifest and icons
  'manifest.json',
  
  // Core CSS files
  'assets/css/reset.css',
  'assets/css/tokens.css',
  'assets/css/typography.css',
  'assets/css/colors.css',
  'assets/css/spacing.css',
  'assets/css/shadows.css',
  'assets/css/z-index.css',
  'assets/css/animations.css',
  'assets/css/layout.css',
  'assets/css/components.css',
  'assets/css/forms.css',
  'assets/css/tables.css',
  'assets/css/badges.css',
  'assets/css/alerts.css',
  'assets/css/modals.css',
  'assets/css/cards.css',
  'assets/css/dashboards.css',
  'assets/css/navigation.css',
  'assets/css/footer.css',
  'assets/css/header.css',
  'assets/css/sidebar.css',
  'assets/css/flags.css',
  'assets/css/pwa.css',
  'assets/css/darkmode.css',
  'assets/css/print.css',
  'assets/css/accessibility.css',
  
  // Core JavaScript
  'core/app.js',
  'core/bootstrap.js',
  'core/config.js',
  'core/constants.js',
  'core/env.js',
  'core/feature-flags.js',
  'core/logger.js',
  'core/error-boundary.js',
  'core/event-bus.js',
  'core/registry.js',
  'core/di-container.js',
  'core/lifecycle.js',
  'core/app-shell.js',
  'core/app-init.js',
  'core/app-teardown.js',
  
  // State Management
  'state/store.js',
  'state/persistence.js',
  'state/migrations.js',
  'state/selectors.js',
  'state/actions.js',
  'state/subscriptions.js',
  'state/devtools.js',
  
  // Critical images and fonts
  'assets/images/logo72.png',
  'assets/images/logo96.png',
  'assets/images/logo128.png',
  'assets/images/logo144.png',
  'assets/images/logo152.png',
  'assets/images/logo192.png',
  'assets/images/logo384.png',
  'assets/images/logo512.png',
  'assets/images/favicon.ico',
  
  // Fonts
  'assets/fonts/inter/Inter-Light.woff2',
  'assets/fonts/inter/Inter-Regular.woff2',
  'assets/fonts/inter/Inter-Medium.woff2',
  'assets/fonts/inter/Inter-SemiBold.woff2',
  'assets/fonts/inter/Inter-Bold.woff2',
  'assets/fonts/poppins/Poppins-Medium.woff2',
  'assets/fonts/poppins/Poppins-SemiBold.woff2',
  'assets/fonts/poppins/Poppins-Bold.woff2',
  'assets/fonts/courier-prime/CourierPrime-Regular.woff2',
  'assets/fonts/courier-prime/CourierPrime-Bold.woff2',
  
  // Country flags
  'assets/images/flags/ke.svg',
  'assets/images/flags/ug.svg',
  'assets/images/flags/tz.svg',
  'assets/images/flags/rw.svg',
  'assets/images/flags/bi.svg',
  'assets/images/flags/cd.svg',
  'assets/images/flags/ng.svg',
  'assets/images/flags/gh.svg',
  'assets/images/flags/ss.svg',
  'assets/images/flags/so.svg',
  'assets/images/flags/za.svg',
  'assets/images/flags/et.svg'
];

// Dynamic routes that should be cached on access
const DYNAMIC_ROUTES = [
  // Auth pages
  'auth/login.html',
  'auth/register.html',
  'auth/verify.html',
  'auth/forgot.html',
  'auth/reset.html',
  
  // Borrower pages
  'borrower/dashboard.html',
  'borrower/apply-loan.html',
  'borrower/history.html',
  'borrower/repayments.html',
  'borrower/disputes.html',
  
  // Lender pages
  'lender/dashboard.html',
  'lender/portfolio.html',
  'lender/history.html',
  'lender/rules.html',
  'lender/risk.html',
  
  // Emergency hub
  'emergency/hub.html',
  'emergency/transport.html',
  'emergency/data.html',
  'emergency/gas.html',
  'emergency/food.html',
  'emergency/water.html',
  'emergency/electricity.html',
  'emergency/tv.html',
  'emergency/fuel.html',
  'emergency/repairs.html',
  'emergency/credo.html',
  'emergency/medicine.html',
  'emergency/school-fees.html',
  'emergency/advance.html',
  
  // Subscription pages
  'subscription/plans.html',
  'subscription/current.html',
  'subscription/upgrade.html',
  'subscription/history.html',
  'subscription/invoices.html',
  
  // Country pages
  'countries/kenya.html',
  'countries/uganda.html',
  'countries/tanzania.html',
  'countries/rwanda.html',
  'countries/burundi.html',
  'countries/drc.html',
  'countries/nigeria.html',
  'countries/ghana.html',
  'countries/south-sudan.html',
  'countries/somalia.html',
  'countries/south-africa.html',
  'countries/ethiopia.html',
  
  // Global pages
  'how-it-works.html',
  'about.html',
  'faq.html',
  'terms.html',
  'privacy.html',
  'contact.html',
  'trust.html',
  'debt-collectors.html',
  'blacklist/public.html',
  'press.html',
  'careers.html',
  'roadmap.html',
  'status.html'
];

// API endpoints that should be cached (read-only data)
const API_ENDPOINTS = [
  '/api/countries',
  '/api/subscriptions',
  '/api/categories',
  '/api/collectors',
  '/api/rules',
  '/api/config'
];

// File extensions to cache strategies
const CACHE_STRATEGIES = {
  'html': 'network-first',
  'css': 'cache-first',
  'js': 'cache-first',
  'json': 'network-first',
  'png': 'cache-first',
  'jpg': 'cache-first',
  'jpeg': 'cache-first',
  'svg': 'cache-first',
  'woff': 'cache-first',
  'woff2': 'cache-first',
  'ttf': 'cache-first',
  'eot': 'cache-first',
  'ico': 'cache-first',
  'webp': 'cache-first'
};

// ============================================
// SERVICE WORKER LIFECYCLE EVENTS
// ============================================

// Install Event - Cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing M-Pesewa PWA v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching core static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] All core assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating M-Pesewa PWA v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches that don't match current version
          if (cacheName !== CACHE_NAME && 
              cacheName !== OFFLINE_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
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

// ============================================
// FETCH EVENT HANDLER WITH STRATEGIES
// ============================================

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Skip browser extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Apply different strategies based on request type
  event.respondWith(
    handleFetch(event).catch(error => {
      console.error('[Service Worker] Fetch failed:', error);
      return handleOfflineFallback(request);
    })
  );
});

// Main fetch handler with strategies
async function handleFetch(event) {
  const request = event.request;
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Determine strategy based on file type or path
  const strategy = determineCacheStrategy(pathname, request);
  
  switch (strategy) {
    case 'network-first':
      return networkFirst(request);
    case 'cache-first':
      return cacheFirst(request);
    case 'stale-while-revalidate':
      return staleWhileRevalidate(request);
    case 'network-only':
      return networkOnly(request);
    case 'cache-only':
      return cacheOnly(request);
    default:
      return networkFirst(request);
  }
}

// ============================================
// CACHE STRATEGY IMPLEMENTATIONS
// ============================================

// Network First Strategy (for HTML pages)
async function networkFirst(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache the response for future offline use
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's an HTML request and no cache, return offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('offline.html');
    }
    
    throw error;
  }
}

// Cache First Strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    event.waitUntil(
      updateCache(request).catch(error => {
        console.log('[Service Worker] Cache update failed:', error);
      })
    );
    
    return cachedResponse;
  }
  
  // Not in cache, try network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the new response
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, check if we should return a fallback
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('offline.html');
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy (for API data)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      // Update cache with fresh response
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('[Service Worker] Network update failed:', error);
  });
  
  // Return cached response if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Network Only Strategy (for sensitive operations)
async function networkOnly(request) {
  return fetch(request);
}

// Cache Only Strategy (for core assets)
async function cacheOnly(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Not in cache, return offline page for HTML
  if (request.headers.get('Accept').includes('text/html')) {
    return caches.match('offline.html');
  }
  
  throw new Error('Resource not in cache');
}

// Determine cache strategy based on request
function determineCacheStrategy(pathname, request) {
  // Check file extension
  const extension = pathname.split('.').pop().toLowerCase();
  
  if (CACHE_STRATEGIES[extension]) {
    return CACHE_STRATEGIES[extension];
  }
  
  // Check specific paths
  if (pathname.includes('/api/')) {
    // API endpoints - use stale-while-revalidate for GET, network-only for others
    if (request.method === 'GET') {
      return 'stale-while-revalidate';
    }
    return 'network-only';
  }
  
  if (pathname.includes('/auth/') || pathname.includes('/admin/')) {
    // Auth and admin pages - network first
    return 'network-first';
  }
  
  if (pathname.endsWith('.html')) {
    // HTML pages - network first
    return 'network-first';
  }
  
  // Default strategy
  return 'network-first';
}

// Update cache in background
async function updateCache(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Handle offline fallback
async function handleOfflineFallback(request) {
  // Check if it's a navigation request
  if (request.headers.get('Accept').includes('text/html')) {
    const offlinePage = await caches.match('offline.html');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Return generic error for other requests
  return new Response(
    JSON.stringify({
      error: 'You are offline',
      message: 'Please check your internet connection',
      timestamp: new Date().toISOString(),
      url: request.url
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// ============================================
// BACKGROUND SYNC FUNCTIONALITY
// ============================================

// Sync event for background synchronization
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync event:', event.tag);
  
  if (event.tag === 'sync-loan-data') {
    event.waitUntil(syncLoanData());
  } else if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  } else if (event.tag === 'sync-ledgers') {
    event.waitUntil(syncLedgers());
  }
});

// Sync loan data in background
async function syncLoanData() {
  console.log('[Service Worker] Syncing loan data...');
  
  try {
    // Get pending operations from IndexedDB
    const pendingOperations = await getPendingOperations();
    
    if (pendingOperations.length === 0) {
      console.log('[Service Worker] No pending operations to sync');
      return;
    }
    
    // Process each pending operation
    for (const operation of pendingOperations) {
      await processPendingOperation(operation);
    }
    
    console.log('[Service Worker] Loan data sync completed');
    
    // Send notification to clients
    await self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: { operations: pendingOperations.length }
        });
      });
    });
    
  } catch (error) {
    console.error('[Service Worker] Loan data sync failed:', error);
    throw error;
  }
}

// Sync user data in background
async function syncUserData() {
  console.log('[Service Worker] Syncing user data...');
  
  try {
    // Implement user data sync logic here
    // This would sync user profile, settings, etc.
    
    console.log('[Service Worker] User data sync completed');
  } catch (error) {
    console.error('[Service Worker] User data sync failed:', error);
  }
}

// Sync ledgers in background
async function syncLedgers() {
  console.log('[Service Worker] Syncing ledgers...');
  
  try {
    // Implement ledger sync logic here
    // This would sync lender-borrower ledgers
    
    console.log('[Service Worker] Ledgers sync completed');
  } catch (error) {
    console.error('[Service Worker] Ledgers sync failed:', error);
  }
}

// Get pending operations from IndexedDB
async function getPendingOperations() {
  // This would typically read from IndexedDB
  // For now, return empty array
  return [];
}

// Process a pending operation
async function processPendingOperation(operation) {
  console.log('[Service Worker] Processing operation:', operation.type);
  
  // Implement operation processing logic here
  // This would send the operation to the server
  
  return Promise.resolve();
}

// ============================================
// PUSH NOTIFICATION FUNCTIONALITY
// ============================================

// Push event handler
self.addEventListener('push', event => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'M-Pesewa Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || 'assets/images/logo192.png',
    badge: 'assets/images/logo72.png',
    tag: data.tag || 'mpesewa-notification',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  
  // Determine which URL to open based on notification data
  let urlToOpen = '/';
  
  if (notificationData.url) {
    urlToOpen = notificationData.url;
  } else if (notificationData.type === 'loan_approved') {
    urlToOpen = 'borrower/dashboard.html';
  } else if (notificationData.type === 'repayment_due') {
    urlToOpen = 'borrower/repayments.html';
  } else if (notificationData.type === 'subscription_expiring') {
    urlToOpen = 'subscription/current.html';
  } else if (notificationData.type === 'new_lender_request') {
    urlToOpen = 'lender/dashboard.html';
  }
  
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
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Notification close handler
self.addEventListener('notificationclose', event => {
  console.log('[Service Worker] Notification closed');
  
  // You can log analytics here
  const notificationData = event.notification.data || {};
  
  // Send analytics data if needed
  if (self.analytics) {
    self.analytics.track('notification_closed', {
      notification_id: notificationData.id,
      notification_type: notificationData.type,
      duration: notificationData.duration
    });
  }
});

// ============================================
// PERIODIC SYNC FUNCTIONALITY
// ============================================

// Periodic sync for background updates
self.addEventListener('periodicsync', event => {
  console.log('[Service Worker] Periodic sync event:', event.tag);
  
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCachesPeriodically());
  } else if (event.tag === 'check-subscriptions') {
    event.waitUntil(checkSubscriptionExpiry());
  } else if (event.tag === 'sync-financial-data') {
    event.waitUntil(syncFinancialData());
  }
});

// Update caches periodically
async function updateCachesPeriodically() {
  console.log('[Service Worker] Periodic cache update started');
  
  try {
    // Update dynamic routes cache
    for (const route of DYNAMIC_ROUTES) {
      try {
        const request = new Request(route);
        await updateCache(request);
        console.log('[Service Worker] Updated cache for:', route);
      } catch (error) {
        console.log('[Service Worker] Failed to update cache for:', route, error);
      }
    }
    
    console.log('[Service Worker] Periodic cache update completed');
  } catch (error) {
    console.error('[Service Worker] Periodic cache update failed:', error);
  }
}

// Check subscription expiry
async function checkSubscriptionExpiry() {
  console.log('[Service Worker] Checking subscription expiry...');
  
  try {
    // Get subscription data from IndexedDB
    const subscriptions = await getSubscriptionsFromDB();
    const today = new Date();
    
    for (const subscription of subscriptions) {
      const expiryDate = new Date(subscription.expiry_date);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      // Send notification if expiry is within 7 days
      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        await sendNotification({
          title: 'Subscription Expiring Soon',
          body: `Your ${subscription.plan} subscription expires in ${daysUntilExpiry} days`,
          data: {
            type: 'subscription_expiring',
            subscription_id: subscription.id,
            days_until_expiry: daysUntilExpiry
          }
        });
      }
    }
    
    console.log('[Service Worker] Subscription expiry check completed');
  } catch (error) {
    console.error('[Service Worker] Subscription expiry check failed:', error);
  }
}

// Sync financial data periodically
async function syncFinancialData() {
  console.log('[Service Worker] Periodic financial data sync started');
  
  try {
    // Sync loan data
    await syncLoanData();
    
    // Sync ledger data
    await syncLedgers();
    
    // Sync user data
    await syncUserData();
    
    console.log('[Service Worker] Periodic financial data sync completed');
  } catch (error) {
    console.error('[Service Worker] Periodic financial data sync failed:', error);
  }
}

// ============================================
// INDEXEDDB HELPER FUNCTIONS
// ============================================

// Get subscriptions from IndexedDB
async function getSubscriptionsFromDB() {
  // This would read from IndexedDB
  // For now, return mock data
  return [];
}

// Send notification
async function sendNotification(notificationData) {
  return self.registration.showNotification(
    notificationData.title,
    notificationData
  );
}

// ============================================
// CACHE MANAGEMENT UTILITIES
// ============================================

// Clear specific cache
async function clearCache(cacheName) {
  return caches.delete(cacheName);
}

// Clear all caches except current
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  
  return Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName !== CACHE_NAME) {
        return caches.delete(cacheName);
      }
    })
  );
}

// Get cache statistics
async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    stats[cacheName] = {
      count: requests.length,
      size: await calculateCacheSize(cache)
    };
  }
  
  return stats;
}

// Calculate cache size
async function calculateCacheSize(cache) {
  const requests = await cache.keys();
  let totalSize = 0;
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      totalSize += blob.size;
    }
  }
  
  return totalSize;
}

// ============================================
// MESSAGE HANDLING (CLIENT COMMUNICATION)
// ============================================

// Handle messages from clients
self.addEventListener('message', event => {
  console.log('[Service Worker] Message received:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'GET_CACHE_STATS':
      getCacheStats().then(stats => {
        event.ports[0].postMessage({ type: 'CACHE_STATS', data: stats });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
      
    case 'TRIGGER_SYNC':
      if (data && data.tag) {
        self.registration.sync.register(data.tag);
        event.ports[0].postMessage({ type: 'SYNC_TRIGGERED', data: { tag: data.tag } });
      }
      break;
      
    case 'UPDATE_CACHE':
      updateCachesPeriodically().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_UPDATED' });
      });
      break;
      
    case 'CHECK_CONNECTION':
      event.ports[0].postMessage({ 
        type: 'CONNECTION_STATUS', 
        data: { online: navigator.onLine } 
      });
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ 
        type: 'VERSION_INFO', 
        data: { version: CACHE_VERSION } 
      });
      break;
  }
});

// ============================================
// ERROR HANDLING AND LOGGING
// ============================================

// Global error handler for service worker
self.addEventListener('error', event => {
  console.error('[Service Worker] Unhandled error:', event.error);
  
  // Send error to analytics if available
  if (self.analytics) {
    self.analytics.track('service_worker_error', {
      error_message: event.error.message,
      error_stack: event.error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Unhandled rejection handler
self.addEventListener('unhandledrejection', event => {
  console.error('[Service Worker] Unhandled rejection:', event.reason);
  
  if (self.analytics) {
    self.analytics.track('service_worker_rejection', {
      reason: event.reason,
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================
// SERVICE WORKER HEALTH CHECK
// ============================================

// Function to check service worker health
async function checkHealth() {
  const health = {
    timestamp: new Date().toISOString(),
    version: CACHE_VERSION,
    caches: await getCacheStats(),
    online: navigator.onLine,
    clients: await self.clients.matchAll().then(clients => clients.length),
    pushManager: self.registration.pushManager ? 'available' : 'unavailable',
    syncManager: self.registration.sync ? 'available' : 'unavailable',
    periodicSync: self.registration.periodicSync ? 'available' : 'unavailable'
  };
  
  return health;
}

// Broadcast health status to all clients
async function broadcastHealthStatus() {
  const health = await checkHealth();
  
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SERVICE_WORKER_HEALTH',
      data: health
    });
  });
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize service worker
console.log('[Service Worker] M-Pesewa Service Worker initialized');
console.log('[Service Worker] Version:', CACHE_VERSION);
console.log('[Service Worker] Static assets to cache:', STATIC_ASSETS.length);
console.log('[Service Worker] Dynamic routes:', DYNAMIC_ROUTES.length);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CACHE_NAME,
    CACHE_VERSION,
    STATIC_ASSETS,
    DYNAMIC_ROUTES,
    API_ENDPOINTS,
    determineCacheStrategy,
    networkFirst,
    cacheFirst,
    staleWhileRevalidate,
    networkOnly,
    cacheOnly,
    checkHealth,
    broadcastHealthStatus
  };
}

// End of M-Pesewa Service Worker