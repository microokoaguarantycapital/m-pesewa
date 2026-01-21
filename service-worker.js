// M-PESEWA Service Worker
// Version: 2.0.0
const CACHE_NAME = 'mpesewa-v2';
const OFFLINE_CACHE = 'mpesewa-offline-v1';
const RUNTIME_CACHE = 'mpesewa-runtime-v1';

// Core assets that are required for the app to function
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/js/main.js',
  '/pages/offline.html'
];

// Assets to cache on install
const PRECACHE_ASSETS = [
  ...CORE_ASSETS,
  '/assets/css/forms.css',
  '/assets/js/dashboard.js',
  '/assets/js/ledger.js',
  '/pages/about.html',
  '/pages/borrowing.html',
  '/pages/lending.html',
  '/pages/ledger.html',
  '/pages/settings.html',
  '/pages/groups.html',
  '/pages/subscriptions.html',
  '/pages/countries/index.html',
  '/pages/blacklist.html',
  '/pages/debt-collectors.html',
  '/dashboard/borrower-dashboard.html',
  '/dashboard/lender-dashboard.html',
  '/dashboard/admin-dashboard.html'
];

// Install Event - Precache core assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      }),
      caches.open(OFFLINE_CACHE).then(cache => {
        console.log('[Service Worker] Caching offline page');
        return cache.add('/pages/offline.html');
      }),
      self.skipWaiting()
    ])
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache !== OFFLINE_CACHE && cache !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(event.request);
        })
    );
    return;
  }

  // For HTML pages, try network first, then cache, then offline page
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the page for future offline use
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Try to get from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline page if nothing in cache
              return caches.match('/pages/offline.html');
            });
        })
    );
    return;
  }

  // For static assets (CSS, JS, images), cache first, then network
  if (event.request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Update cache in background
            fetch(event.request)
              .then(response => {
                const responseClone = response.clone();
                caches.open(RUNTIME_CACHE).then(cache => {
                  cache.put(event.request, responseClone);
                });
              })
              .catch(() => {
                // Network request failed, keep cached version
              });
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(event.request)
            .then(response => {
              // Cache the response
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then(cache => {
                cache.put(event.request, responseClone);
              });
              return response;
            })
            .catch(error => {
              console.error('[Service Worker] Fetch failed:', error);
              // For CSS/JS files, return empty response instead of offline page
              if (event.request.url.includes('.css')) {
                return new Response('', { headers: { 'Content-Type': 'text/css' } });
              }
              if (event.request.url.includes('.js')) {
                return new Response('', { headers: { 'Content-Type': 'application/javascript' } });
              }
              throw error;
            });
        })
    );
    return;
  }

  // Default strategy: network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Background Sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-loan-requests') {
    event.waitUntil(syncLoanRequests());
  }
  if (event.tag === 'sync-payments') {
    event.waitUntil(syncPayments());
  }
});

// Sync loan requests when back online
async function syncLoanRequests() {
  try {
    const pendingRequests = await getPendingLoanRequests();
    for (const request of pendingRequests) {
      await fetch('/api/loan-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });
      await removePendingLoanRequest(request.id);
    }
    console.log('[Service Worker] Synced loan requests');
  } catch (error) {
    console.error('[Service Worker] Failed to sync loan requests:', error);
  }
}

// Sync payments when back online
async function syncPayments() {
  try {
    const pendingPayments = await getPendingPayments();
    for (const payment of pendingPayments) {
      await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment)
      });
      await removePendingPayment(payment.id);
    }
    console.log('[Service Worker] Synced payments');
  } catch (error) {
    console.error('[Service Worker] Failed to sync payments:', error);
  }
}

// Helper functions for IndexedDB (simplified for frontend)
async function getPendingLoanRequests() {
  // In a real app, this would use IndexedDB
  // For now, return empty array
  return [];
}

async function getPendingPayments() {
  // In a real app, this would use IndexedDB
  // For now, return empty array
  return [];
}

async function removePendingLoanRequest(id) {
  // In a real app, this would use IndexedDB
}

async function removePendingPayment(id) {
  // In a real app, this would use IndexedDB
}

// Push Notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from M-PESEWA',
    icon: 'assets/images/icon-192x192.png',
    badge: 'assets/images/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
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

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if (client.url.includes('/dashboard/') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-cache') {
      event.waitUntil(updateCache());
    }
  });
}

async function updateCache() {
  console.log('[Service Worker] Periodic cache update');
  
  // Update core assets
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
}

// Message handling for cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    });
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.keys().then(cacheNames => {
      const sizes = {};
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.open(cacheName).then(cache => {
            return cache.keys().then(requests => {
              sizes[cacheName] = requests.length;
            });
          });
        })
      ).then(() => {
        event.ports[0].postMessage(sizes);
      });
    });
  }
});