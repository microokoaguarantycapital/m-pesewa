// Service Worker for M-Pesewa PWA
const CACHE_NAME = 'm-pesewa-v1.0';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',
  '/assets/css/dashboard.css',
  '/assets/css/forms.css',
  '/assets/css/tables.css',
  '/assets/js/app.js',
  '/assets/js/auth.js',
  '/assets/js/calculator.js',
  '/assets/js/pwa.js',
  '/assets/js/utils.js',
  '/assets/images/logo.svg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For API/data requests, network only
  if (event.request.url.includes('/data/') || event.request.url.includes('.json')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => new Response(JSON.stringify({ error: 'Network failed, data unavailable' }), {
          headers: { 'Content-Type': 'application/json' }
        }))
    );
    return;
  }

  // For static assets, cache first with network fallback
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, return offline page for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            return new Response('Offline content unavailable', {
              status: 503,
              statusText: 'Service Unavailable'
            });
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

async function syncForms() {
  // This would sync form data when online
  // Implementation depends on backend
  console.log('Syncing form data...');
}

// Push notification handling
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New update from M-Pesewa',
    icon: '/assets/images/icons/icon-192x192.png',
    badge: '/assets/images/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
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

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(windowClients => {
          if (windowClients.length > 0) {
            return windowClients[0].focus();
          }
          return clients.openWindow(event.notification.data.url || '/');
        })
    );
  }
});