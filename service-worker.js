// service-worker.js
'use strict';

// Service Worker for M-PESEWA PWA
// Version: 2.0.0

const CACHE_NAME = 'mpesewa-pwa-cache-v2';
const OFFLINE_URL = './offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  
  // CSS Files
  './assets/css/main.css',
  './assets/css/components.css',
  './assets/css/dashboard.css',
  './assets/css/forms.css',
  './assets/css/tables.css',
  './assets/css/animations.css',
  
  // JS Files
  './assets/js/app.js',
  './assets/js/pwa.js',
  './assets/js/utils.js',
  './assets/js/auth.js',
  './assets/js/roles.js',
  './assets/js/groups.js',
  './assets/js/lending.js',
  './assets/js/borrowing.js',
  './assets/js/ledger.js',
  './assets/js/blacklist.js',
  './assets/js/subscriptions.js',
  './assets/js/countries.js',
  './assets/js/collectors.js',
  './assets/js/calculator.js',
  
  // Core Pages
  './pages/about.html',
  './pages/qa.html',
  './pages/contact.html',
  './pages/borrowing.html',
  './pages/lending.html',
  './pages/ledger.html',
  './pages/groups.html',
  './pages/subscriptions.html',
  './pages/blacklist.html',
  './pages/debt-collectors.html',
  
  // Dashboard Pages
  './pages/dashboard/borrower-dashboard.html',
  './pages/dashboard/lender-dashboard.html',
  './pages/dashboard/admin-dashboard.html',
  
  // Country Pages
  './pages/countries/index.html',
  './pages/countries/kenya.html',
  './pages/countries/uganda.html',
  './pages/countries/tanzania.html',
  './pages/countries/rwanda.html',
  './pages/countries/nigeria.html',
  './pages/countries/ghana.html',
  './pages/countries/south-africa.html',
  './pages/countries/ethiopia.html',
  
  // Core Assets
  './manifest.json',
  
  // Images (critical ones)
  './assets/images/logo.svg',
  './assets/images/favicon.ico',
  './assets/images/icon-192x192.png',
  './assets/images/icon-512x512.png',
  './assets/images/pattern.svg'
];

// Fonts to cache
const FONTS_TO_CACHE = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install Event - Cache core assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Core assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
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

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // Skip analytics and tracking
  if (event.request.url.includes('google-analytics') || 
      event.request.url.includes('googletagmanager')) {
    return;
  }
  
  const requestUrl = new URL(event.request.url);
  
  // Handle API requests differently
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the page
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          // If offline and HTML request, return offline page
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  
  // For other assets, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        
        // Not in cache, fetch from network
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the new resource
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // For images, return a placeholder
            if (event.request.destination === 'image') {
              return caches.match('./assets/images/placeholder.svg');
            }
            
            // For CSS/JS, return empty response
            if (event.request.destination === 'style' || 
                event.request.destination === 'script') {
              return new Response('', {
                headers: { 'Content-Type': 'text/css' }
              });
            }
            
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Handle API requests with cache-first strategy
function handleApiRequest(request) {
  const requestUrl = new URL(request.url);
  const cacheKey = `api-cache-${requestUrl.pathname}`;
  
  return caches.open('api-cache')
    .then(cache => {
      return cache.match(request)
        .then(response => {
          // If cached and less than 5 minutes old, use cache
          if (response) {
            const cachedTime = new Date(response.headers.get('date')).getTime();
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000;
            
            if (now - cachedTime < fiveMinutes) {
              console.log('[Service Worker] Serving API from cache:', requestUrl.pathname);
              return response;
            }
          }
          
          // Otherwise fetch from network
          return fetch(request)
            .then(networkResponse => {
              // Cache the response
              const clonedResponse = networkResponse.clone();
              cache.put(request, clonedResponse);
              return networkResponse;
            })
            .catch(error => {
              console.error('[Service Worker] API fetch failed:', error);
              
              // If we have cached data, return it even if stale
              if (response) {
                console.log('[Service Worker] Using stale API cache:', requestUrl.pathname);
                return response;
              }
              
              // Return error response
              return new Response(JSON.stringify({
                error: 'Network error',
                message: 'Cannot connect to server'
              }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            });
        });
    });
}

// Background Sync for offline actions
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-loan-requests') {
    event.waitUntil(syncLoanRequests());
  }
  
  if (event.tag === 'sync-repayments') {
    event.waitUntil(syncRepayments());
  }
});

// Sync loan requests made while offline
function syncLoanRequests() {
  return getIndexedDBData('offline-loan-requests')
    .then(requests => {
      if (!requests || requests.length === 0) {
        return Promise.resolve();
      }
      
      return Promise.all(
        requests.map(request => {
          return fetch('./api/loan-requests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
          })
          .then(response => {
            if (response.ok) {
              return removeIndexedDBData('offline-loan-requests', request.id);
            }
            throw new Error('Sync failed');
          });
        })
      );
    })
    .catch(error => {
      console.error('[Service Worker] Loan request sync failed:', error);
    });
}

// Sync repayments made while offline
function syncRepayments() {
  return getIndexedDBData('offline-repayments')
    .then(repayments => {
      if (!repayments || repayments.length === 0) {
        return Promise.resolve();
      }
      
      return Promise.all(
        repayments.map(repayment => {
          return fetch('./api/repayments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(repayment)
          })
          .then(response => {
            if (response.ok) {
              return removeIndexedDBData('offline-repayments', repayment.id);
            }
            throw new Error('Sync failed');
          });
        })
      );
    })
    .catch(error => {
      console.error('[Service Worker] Repayment sync failed:', error);
    });
}

// IndexedDB helper functions
function getIndexedDBData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mpesewa-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onerror = () => reject(getAllRequest.error);
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-loan-requests')) {
        db.createObjectStore('offline-loan-requests', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('offline-repayments')) {
        db.createObjectStore('offline-repayments', { keyPath: 'id' });
      }
    };
  });
}

function removeIndexedDBData(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mpesewa-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onerror = () => reject(deleteRequest.error);
      deleteRequest.onsuccess = () => resolve();
    };
  });
}

// Push notification handler
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'M-PESEWA';
  const options = {
    body: data.body || 'You have a new notification',
    icon: './assets/images/icon-192x192.png',
    badge: './assets/images/badge.png',
    tag: data.tag || 'general',
    data: data.url || './',
    actions: data.actions || [
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
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  // Default action is to open the app
  const urlToOpen = event.notification.data || './';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(windowClients => {
      // Check if there's already a window open
      for (const client of windowClients) {
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

// Periodic Sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-cache') {
      console.log('[Service Worker] Periodic sync triggered');
      event.waitUntil(updateCache());
    }
  });
}

// Update cache with fresh content
function updateCache() {
  return caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './pages/borrowing.html',
        './pages/lending.html',
        './pages/ledger.html'
      ]);
    })
    .catch(error => {
      console.error('[Service Worker] Cache update failed:', error);
    });
}

// Message handler for communication with pages
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => {
        event.ports[0].postMessage({ success: true });
      })
      .catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
  }
});

// Network status change handler
self.addEventListener('offline', () => {
  console.log('[Service Worker] App is offline');
  
  // Broadcast to all clients
  self.clients.matchAll()
    .then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NETWORK_STATUS',
          status: 'offline'
        });
      });
    });
});

self.addEventListener('online', () => {
  console.log('[Service Worker] App is online');
  
  // Broadcast to all clients
  self.clients.matchAll()
    .then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NETWORK_STATUS',
          status: 'online'
        });
      });
    });
  
  // Trigger sync of offline data
  self.registration.sync.register('sync-loan-requests')
    .catch(error => {
      console.error('[Service Worker] Sync registration failed:', error);
    });
});