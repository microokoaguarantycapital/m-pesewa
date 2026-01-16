const CACHE_NAME = 'm-pesewa-v1';
const urlsToCache = [
  '/m-pesewa/',
  '/m-pesewa/index.html',
  '/m-pesewa/manifest.json',
  '/m-pesewa/assets/css/main.css',
  '/m-pesewa/assets/css/components.css',
  '/m-pesewa/assets/css/animations.css',
  '/m-pesewa/assets/js/app.js',
  '/m-pesewa/assets/js/utils.js',
  '/m-pesewa/assets/js/auth.js',
  '/m-pesewa/assets/images/logo.svg'
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
        return fetch(event.request).then(
          response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: 'assets/images/icons/icon-192x192.png',
    badge: 'assets/images/icons/icon-72x72.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('M-Pesewa', options)
  );
});