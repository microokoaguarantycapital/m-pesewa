// service-worker.js

const CACHE_NAME = 'm-pesewa-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/dashboard.css',
  '/assets/css/forms.css',
  '/assets/css/tables.css',
  '/assets/css/animations.css',
  '/assets/js/app.js',
  '/assets/js/auth.js',
  '/assets/js/utils.js',
  '/assets/js/pwa.js',
  '/assets/images/logo.svg',
  '/assets/images/icons/icon-192.png',
  '/pages/borrowing.html',
  '/pages/lending.html',
  '/pages/groups.html',
  '/pages/subscriptions.html',
  '/pages/ledger.html',
  '/pages/blacklist.html',
  '/pages/debt-collectors.html',
  '/pages/about.html',
  '/pages/qa.html',
  '/pages/contact.html'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests separately
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Don't cache API responses
          return response;
        })
        .catch(() => {
          return new Response(JSON.stringify({
            error: 'You are offline. Please check your connection.'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
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
            // For HTML pages, return offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // For CSS and JS, return from cache if available
            if (event.request.url.includes('.css') || event.request.url.includes('.js')) {
              return caches.match(event.request);
            }
            
            // Return offline response for other assets
            return new Response('You are offline. Please check your connection.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

async function syncFormData() {
  try {
    const db = await openFormDB();
    const pendingSubmissions = await db.getAll('pendingSubmissions');
    
    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch(submission.url, {
          method: submission.method,
          headers: submission.headers,
          body: submission.body
        });
        
        if (response.ok) {
          await db.delete('pendingSubmissions', submission.id);
          console.log('Synced submission:', submission.id);
        }
      } catch (error) {
        console.error('Failed to sync submission:', submission.id, error);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

function openFormDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FormSubmissionsDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingSubmissions')) {
        const store = db.createObjectStore('pendingSubmissions', {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from M-PESEWA',
    icon: '/assets/images/icons/icon-192.png',
    badge: '/assets/images/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
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

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Periodic background sync for updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const updatedAssets = [
      '/',
      '/index.html',
      '/manifest.json'
    ];
    
    for (const asset of updatedAssets) {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          await cache.put(asset, response);
          console.log('Updated asset:', asset);
        }
      } catch (error) {
        console.error('Failed to update asset:', asset, error);
      }
    }
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cache update strategy
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    self.skipWaiting();
  }
});