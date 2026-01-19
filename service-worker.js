// service-worker.js
const CACHE_NAME = 'mpesewa-v1.0.0';
const urlsToCache = [
  '/m-pesewa/',
  '/m-pesewa/index.html',
  '/m-pesewa/manifest.json',
  
  // CSS Files
  '/m-pesewa/assets/css/main.css',
  '/m-pesewa/assets/css/components.css',
  '/m-pesewa/assets/css/animations.css',
  
  // JS Files
  '/m-pesewa/assets/js/app.js',
  '/m-pesewa/assets/js/pwa.js',
  '/m-pesewa/assets/js/utils.js',
  
  // Images
  '/m-pesewa/assets/images/logo.svg',
  '/m-pesewa/assets/images/icons/icon-192.png',
  '/m-pesewa/assets/images/icons/icon-512.png',
  
  // Pages
  '/m-pesewa/pages/lending.html',
  '/m-pesewa/pages/borrowing.html',
  '/m-pesewa/pages/groups.html',
  '/m-pesewa/pages/ledger.html',
  '/m-pesewa/pages/about.html',
  '/m-pesewa/pages/qa.html',
  '/m-pesewa/pages/contact.html',
  
  // Country Pages
  '/m-pesewa/pages/countries/index.html',
  '/m-pesewa/pages/countries/kenya.html'
];

// Install Event
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

// Activate Event
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

// Fetch Event with Network First Strategy for dynamic content
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests with network first strategy
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the API response if successful
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For HTML pages, use network first strategy
  if (event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              if (response) {
                return response;
              }
              // Return offline page if no cache
              return caches.match('/m-pesewa/offline.html');
            });
        })
    );
    return;
  }
  
  // For static assets (CSS, JS, images), use cache first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a successful response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return placeholder for images if offline
            if (event.request.destination === 'image') {
              return caches.match('/m-pesewa/assets/images/placeholder.png');
            }
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background Sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-loan-requests') {
    event.waitUntil(syncLoanRequests());
  }
});

// Push Notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from M-pesewa',
    icon: '/m-pesewa/assets/images/icons/icon-192.png',
    badge: '/m-pesewa/assets/images/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
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
    self.registration.showNotification('M-pesewa', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/m-pesewa/')
    );
  }
});

// Sync function for offline loan requests
async function syncLoanRequests() {
  const db = await openDatabase();
  const offlineRequests = await getAllOfflineRequests(db);
  
  for (const request of offlineRequests) {
    try {
      const response = await fetch('/api/loan-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.data)
      });
      
      if (response.ok) {
        await deleteOfflineRequest(db, request.id);
      }
    } catch (error) {
      console.error('Failed to sync request:', error);
    }
  }
}

// IndexedDB helper functions
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mpesewa-offline', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('loanRequests')) {
        db.createObjectStore('loanRequests', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

function getAllOfflineRequests(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['loanRequests'], 'readonly');
    const store = transaction.objectStore('loanRequests');
    const requests = [];
    
    store.openCursor().onsuccess = event => {
      const cursor = event.target.result;
      if (cursor) {
        requests.push(cursor.value);
        cursor.continue();
      } else {
        resolve(requests);
      }
    };
    
    transaction.onerror = event => reject(event.target.error);
  });
}

function deleteOfflineRequest(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['loanRequests'], 'readwrite');
    const store = transaction.objectStore('loanRequests');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = event => reject(event.target.error);
  });
}

// Periodic Sync for background updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  for (const url of urlsToCache) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.log('Failed to update:', url);
    }
  }
}