// M-PESEWA SERVICE WORKER
const CACHE_NAME = 'mpesewa-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  
  // CSS
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/dashboard.css',
  '/assets/css/forms.css',
  '/assets/css/tables.css',
  '/assets/css/animations.css',
  
  // JS
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
  
  // Data
  '/data/countries.json',
  '/data/subscriptions.json',
  '/data/categories.json',
  '/data/collectors.json',
  '/data/demo-groups.json',
  '/data/demo-users.json',
  '/data/demo-ledgers.json',
  
  // Pages
  '/pages/lending.html',
  '/pages/borrowing.html',
  '/pages/ledger.html',
  '/pages/groups.html',
  '/pages/subscriptions.html',
  '/pages/blacklist.html',
  '/pages/debt-collectors.html',
  '/pages/about.html',
  '/pages/qa.html',
  '/pages/contact.html',
  
  // Dashboard Pages
  '/pages/dashboard/borrower-dashboard.html',
  '/pages/dashboard/lender-dashboard.html',
  '/pages/dashboard/admin-dashboard.html',
  
  // Country Pages
  '/pages/countries/index.html',
  '/pages/countries/kenya.html',
  '/pages/countries/uganda.html',
  '/pages/countries/tanzania.html',
  '/pages/countries/rwanda.html',
  '/pages/countries/burundi.html',
  '/pages/countries/somalia.html',
  '/pages/countries/south-sudan.html',
  '/pages/countries/ethiopia.html',
  '/pages/countries/DRC.html',
  '/pages/countries/nigeria.html',
  '/pages/countries/south-africa.html',
  '/pages/countries/ghana.html',
  
  // Offline page
  '/offline.html'
];

// Install event - precache assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Install completed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For HTML pages, try network first
  if (event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Update cache with fresh version
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // If offline, return cached version or offline page
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For other assets, try cache first
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Update cache in background
          fetch(event.request)
            .then(response => {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            })
            .catch(() => {
              // Ignore fetch errors for background update
            });
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Cache the new response
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
            return response;
          })
          .catch(error => {
            console.log('[Service Worker] Fetch failed:', error);
            // Return a fallback for images
            if (event.request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#F3E5F5"/><text x="100" y="100" text-anchor="middle" fill="#7B1FA2" font-family="sans-serif" font-size="16">M-Pesewa</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            throw error;
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'submit-loan-request') {
    event.waitUntil(
      syncPendingSubmissions()
    );
  }
});

// Push notification event
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'New notification from M-Pesewa',
    icon: '/assets/images/logo-192x192.png',
    badge: '/assets/images/logo-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
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

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if there's already a window/tab open
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url || '/');
        }
      })
  );
});

// Helper function to sync pending submissions
async function syncPendingSubmissions() {
  console.log('[Service Worker] Syncing pending submissions...');
  // This would interact with IndexedDB in a real implementation
  // For now, we'll just log
  return Promise.resolve();
}

// Periodic sync for updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    event.waitUntil(
      updateCachedContent()
    );
  }
});

// Helper function to update cached content
async function updateCachedContent() {
  console.log('[Service Worker] Updating cached content...');
  // This would update cached content in the background
  return Promise.resolve();
}