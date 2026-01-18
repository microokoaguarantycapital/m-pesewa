/* =====================================================
   M-Pesewa Service Worker
   FinTech PWA – Safe, Offline-First (Static Assets Only)
   ===================================================== */

const CACHE_NAME = 'mpesewa-v1.0.0';

/* ---- Files safe to cache (STATIC ONLY) ---- */
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',

  /* CSS */
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',

  /* Images / Icons */
  '/assets/images/favicon.ico',
  '/assets/images/logo.png',

  /* Pages (static only) */
  '/pages/about.html',
  '/pages/contact.html',
  '/pages/qa.html'
];

/* =====================================================
   INSTALL
   ===================================================== */
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing');

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

/* =====================================================
   ACTIVATE
   ===================================================== */
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating');

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

/* =====================================================
   FETCH STRATEGY
   - Cache First for static assets
   - Network Only for APIs / auth / payments
   ===================================================== */
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  /* ---- DO NOT CACHE API / AUTH / PAYMENTS ---- */
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.includes('auth') ||
    url.pathname.includes('login') ||
    url.pathname.includes('payment')
  ) {
    return;
  }

  /* ---- Only handle GET requests ---- */
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then(networkResponse => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          /* Optional offline fallback */
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
    })
  );
});
