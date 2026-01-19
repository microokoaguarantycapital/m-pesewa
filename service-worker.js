const CACHE_NAME = 'm-pesewa-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/m-pesewa/',
  '/m-pesewa/index.html',
  '/m-pesewa/manifest.json',
  '/m-pesewa/assets/css/main.css',
  '/m-pesewa/assets/css/components.css',
  '/m-pesewa/assets/css/animations.css',
  '/m-pesewa/assets/js/app.js',
  '/m-pesewa/assets/js/auth.js',
  '/m-pesewa/assets/js/calculator.js',
  '/m-pesewa/assets/js/pwa.js',
  '/m-pesewa/assets/js/utils.js',
  '/m-pesewa/assets/images/logo.svg',
  '/m-pesewa/assets/images/icons/icon-72x72.png',
  '/m-pesewa/assets/images/icons/icon-96x96.png',
  '/m-pesewa/assets/images/icons/icon-128x128.png',
  '/m-pesewa/assets/images/icons/icon-144x144.png',
  '/m-pesewa/assets/images/icons/icon-152x152.png',
  '/m-pesewa/assets/images/icons/icon-192x192.png',
  '/m-pesewa/assets/images/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
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
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
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
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;

  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
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

            // Cache the response
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('[Service Worker] Fetch failed:', error);
            
            // Return offline page for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/m-pesewa/index.html');
            }
            
            // Return fallback for other requests
            return fallbackResponse(event.request);
          });
      })
  );
});

// Network-first strategy for API requests
function networkFirst(request) {
  return fetch(request)
    .then(response => {
      const responseClone = response.clone();
      caches.open(DYNAMIC_CACHE)
        .then(cache => {
          cache.put(request, responseClone);
        });
      return response;
    })
    .catch(() => {
      return caches.match(request);
    });
}

// Generate fallback response
function fallbackResponse(request) {
  if (request.url.includes('.css')) {
    return new Response('/* Fallback CSS */', {
      headers: { 'Content-Type': 'text/css' }
    });
  }
  
  if (request.url.includes('.js')) {
    return new Response('// Fallback JS', {
      headers: { 'Content-Type': 'application/javascript' }
    });
  }
  
  if (request.url.includes('.json')) {
    return new Response(JSON.stringify({ error: 'Offline' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Offline', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  try {
    const db = await openDatabase();
    const pendingForms = await getAllPendingForms(db);
    
    for (const form of pendingForms) {
      try {
        const response = await fetch(form.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          await deletePendingForm(db, form.id);
          console.log('[Service Worker] Synced form:', form.id);
        }
      } catch (error) {
        console.error('[Service Worker] Sync failed for form:', form.id, error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Sync error:', error);
  }
}

// Database helpers for background sync
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('m-pesewa-offline', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-forms')) {
        db.createObjectStore('pending-forms', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

function getAllPendingForms(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-forms'], 'readonly');
    const store = transaction.objectStore('pending-forms');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deletePendingForm(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-forms'], 'readwrite');
    const store = transaction.objectStore('pending-forms');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Push notifications
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'M-Pesewa';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/m-pesewa/assets/images/icons/icon-192x192.png',
    badge: '/m-pesewa/assets/images/icons/icon-72x72.png',
    data: data,
    actions: data.actions || [],
    tag: data.tag || 'default',
    renotify: data.renotify || false,
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/m-pesewa/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Periodic sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-content') {
      event.waitUntil(updateContent());
    }
  });
}

async function updateContent() {
  console.log('[Service Worker] Periodic sync: updating content');
  
  // Update cached content in the background
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // Add logic to update dynamic content
  // For example, fetch latest loan categories, groups, etc.
}

// Message handler for communication with client
self.addEventListener('message', event => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(STATIC_CACHE);
    caches.delete(DYNAMIC_CACHE);
  }
});
