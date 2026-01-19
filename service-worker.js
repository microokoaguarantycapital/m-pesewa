// Service Worker for M-pesewa PWA

const CACHE_NAME = 'm-pesewa-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  
  // CSS Files
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',
  
  // JS Files
  '/assets/js/app.js',
  '/assets/js/pwa.js',
  
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  
  // Images (fallback to placeholders)
  '/assets/images/logo.svg',
  
  // Pages
  '/pages/lending.html',
  '/pages/borrowing.html',
  '/pages/groups.html',
  '/pages/ledger.html',
  '/pages/subscriptions.html',
  '/pages/blacklist.html',
  '/pages/debt-collectors.html',
  '/pages/about.html',
  '/pages/qa.html',
  '/pages/contact.html',
  
  // Country Pages
  '/pages/countries/index.html',
  '/pages/countries/kenya.html',
  '/pages/countries/uganda.html',
  '/pages/countries/tanzania.html',
  '/pages/countries/rwanda.html'
];

// Install event - cache essential assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.log('[Service Worker] Fetch failed; returning offline page instead.', error);
            
            // If request is for a page, return offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            // For other file types, return appropriate fallback
            if (event.request.url.match(/\.(css|js)$/)) {
              return new Response('/* Offline - Resource not available */', {
                headers: { 'Content-Type': 'text/css' }
              });
            }
            
            if (event.request.url.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
              return fetch('/assets/images/fallback-image.png');
            }
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// Sync pending form submissions
function syncForms() {
  return new Promise((resolve, reject) => {
    // Get pending submissions from IndexedDB
    // This would be implemented with actual IndexedDB logic
    console.log('[Service Worker] Syncing pending form submissions');
    resolve();
  });
}

// Push notifications
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received.');
  
  const title = 'M-pesewa';
  const options = {
    body: event.data ? event.data.text() : 'New update from M-pesewa',
    icon: '/assets/images/icons/icon-192x192.png',
    badge: '/assets/images/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click received.');
  
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
          return clients.openWindow('/');
        }
      })
  );
});

// Periodic sync for background updates
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-content') {
      event.waitUntil(updateContent());
    }
  });
}

// Update cached content in background
function updateContent() {
  return caches.open(CACHE_NAME)
    .then(cache => {
      return fetch('/')
        .then(response => {
          if (response.ok) {
            cache.put('/', response.clone());
          }
        })
        .catch(error => {
          console.log('[Service Worker] Background update failed:', error);
        });
    });
}

// Handle messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_NEW_ROUTE') {
    caches.open(CACHE_NAME)
      .then(cache => cache.add(event.data.url))
      .then(() => console.log('[Service Worker] Cached new route:', event.data.url));
  }
});