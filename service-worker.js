// service-worker.js - M-Pesewa PWA Service Worker
// Root scope - controls all pages under https://microokoaguarantycapital.github.io/m-pesewa/

const CACHE_NAME = 'm-pesewa-v1.0';
const OFFLINE_PAGE = '/offline.html';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  
  // Core CSS files
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/dashboard.css',
  '/assets/css/forms.css',
  '/assets/css/tables.css',
  '/assets/css/animations.css',
  
  // Core JS files
  '/assets/js/app.js',
  '/assets/js/auth.js',
  '/assets/js/roles.js',
  '/assets/js/groups.js',
  '/assets/js/lending.js',
  '/assets/js/borrowing.js',
  '/assets/js/ledger.js',
  '/assets/js/blacklist.js',
  '/assets/js/subscriptions.js',
  '/assets/js/countries.js',
  '/assets/js/collectors.js',
  '/assets/js/calculator.js',
  '/assets/js/pwa.js',
  '/assets/js/utils.js',
  
  // Logo and icons
  '/assets/images/logo.svg',
  
  // JSON data files
  '/data/countries.json',
  '/data/subscriptions.json',
  '/data/categories.json',
  '/data/collectors.json',
  '/data/demo-groups.json',
  '/data/demo-users.json',
  '/data/demo-ledgers.json',
  
  // Essential pages (skeleton)
  '/pages/about.html',
  '/pages/qa.html',
  '/pages/contact.html',
  '/pages/lending.html',
  '/pages/borrowing.html',
  '/pages/ledger.html',
  '/pages/groups.html',
  '/pages/subscriptions.html',
  '/pages/blacklist.html',
  '/pages/debt-collectors.html',
  
  // Countries pages
  '/pages/countries/index.html',
  '/pages/countries/kenya.html',
  '/pages/countries/uganda.html',
  '/pages/countries/tanzania.html',
  '/pages/countries/rwanda.html',
  '/pages/countries/nigeria.html',
  '/pages/countries/ghana.html',
  '/pages/countries/south-africa.html',
  '/pages/countries/egypt.html',
  '/pages/countries/morocco.html',
  '/pages/countries/ethiopia.html',
  '/pages/countries/senegal.html',
  
  // Dashboard pages
  '/pages/dashboard/borrower-dashboard.html',
  '/pages/dashboard/lender-dashboard.html',
  '/pages/dashboard/admin-dashboard.html'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[Service Worker] Installation failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
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
        console.log('[Service Worker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - network first with cache fallback for HTML, cache first for assets
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) return;
  
  // For API/data requests (JSON files) - cache first
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(networkResponse => {
              // Cache the response for future use
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseClone));
              return networkResponse;
            })
            .catch(() => {
              // If both cache and network fail, return offline fallback
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // For HTML pages - network first with cache fallback
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Cache the response for future use
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache, show offline page
              return caches.match(OFFLINE_PAGE);
            });
        })
    );
    return;
  }
  
  // For static assets (CSS, JS, images) - cache first with network fallback
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(request)
          .then(networkResponse => {
            // Cache the response for future use
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseClone));
            return networkResponse;
          })
          .catch(() => {
            // For CSS/JS, return empty response rather than offline page
            if (request.url.endsWith('.css')) {
              return new Response(
                '/* Offline - no styles available */',
                { headers: { 'Content-Type': 'text/css' } }
              );
            }
            if (request.url.endsWith('.js')) {
              return new Response(
                '// Offline - no script available',
                { headers: { 'Content-Type': 'application/javascript' } }
              );
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Background sync for form submissions when online
self.addEventListener('sync', event => {
  if (event.tag === 'submit-loan-request') {
    console.log('[Service Worker] Background sync for loan requests');
    // This would be implemented with IndexedDB in a real app
  }
});

// Push notification event
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from M-Pesewa',
    icon: '/assets/images/icons/icon-192x192.png',
    badge: '/assets/images/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/',
      dateOfArrival: Date.now()
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
    self.registration.showNotification('M-Pesewa', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});