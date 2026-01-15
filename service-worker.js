const CACHE_NAME = 'm-pesewa-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',
  '/assets/js/app.js',
  '/assets/js/auth.js',
  '/assets/js/calculator.js',
  '/assets/js/utils.js',
  '/assets/images/logo.svg'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// Background sync for forms
self.addEventListener('sync', event => {
  if (event.tag === 'submit-form') {
    event.waitUntil(
      // Implement form submission sync
      console.log('Background sync for form submission')
    );
  }
});

// Push notification
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from M-Pesewa',
    icon: 'assets/images/icons/icon-192x192.png',
    badge: 'assets/images/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('M-Pesewa', options)
  );
});

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});