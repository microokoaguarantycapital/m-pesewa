// M-PESEWA Service Worker
// Version: 2.0.0

const CACHE_NAME = 'm-pesewa-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  
  // CSS files
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/dashboard.css',
  '/assets/css/forms.css',
  '/assets/css/tables.css',
  '/assets/css/animations.css',
  
  // JS files
  '/assets/js/app.js',
  '/assets/js/pwa.js',
  '/assets/js/utils.js',
  '/assets/js/auth.js',
  '/assets/js/roles.js',
  '/assets/js/groups.js',
  
  // Pages
  '/pages/lending.html',
  '/pages/ledger.html',
  '/pages/settings.html',
  '/pages/dashboard/borrower-dashboard.html',
  '/pages/dashboard/lender-dashboard.html',
  '/pages/dashboard/admin-dashboard.html',
  
  // Components
  '/components/header.html',
  '/components/footer.html',
  '/components/navbar.html',
  '/components/card.html',
  '/components/modal.html',
  
  // Fallback page
  '/offline.html'
];

// Install event - cache assets
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response(JSON.stringify({
            error: 'Network error',
            offline: true
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
        if (response) {
          return response;
        }
        
        return fetch(event.request)
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
            // If offline and page request, return offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // For other file types, return appropriate fallback
            if (event.request.url.includes('.css')) {
              return new Response('/* Offline */', {
                headers: { 'Content-Type': 'text/css' }
              });
            }
            
            if (event.request.url.includes('.js')) {
              return new Response('// Offline', {
                headers: { 'Content-Type': 'text/javascript' }
              });
            }
            
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-loan-requests') {
    event.waitUntil(syncLoanRequests());
  }
  
  if (event.tag === 'sync-ledger-updates') {
    event.waitUntil(syncLedgerUpdates());
  }
});

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from M-PESEWA',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/assets/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('M-PESEWA', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(windowClients => {
        // Check if there's already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Background sync functions
async function syncLoanRequests() {
  const db = await openLoanRequestDB();
  const requests = await getAllLoanRequests(db);
  
  for (const request of requests) {
    try {
      await fetch('/api/loan-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });
      
      // If successful, remove from local DB
      await deleteLoanRequest(db, request.id);
    } catch (error) {
      console.error('Failed to sync loan request:', error);
    }
  }
}

async function syncLedgerUpdates() {
  const db = await openLedgerDB();
  const updates = await getAllLedgerUpdates(db);
  
  for (const update of updates) {
    try {
      await fetch('/api/ledger-updates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update)
      });
      
      // If successful, remove from local DB
      await deleteLedgerUpdate(db, update.id);
    } catch (error) {
      console.error('Failed to sync ledger update:', error);
    }
  }
}

// IndexedDB helpers (simplified)
function openLoanRequestDB() {
  return new Promise((resolve) => {
    // In a real implementation, this would use IndexedDB
    resolve({});
  });
}

function getAllLoanRequests(db) {
  return Promise.resolve([]);
}

function deleteLoanRequest(db, id) {
  return Promise.resolve();
}

function openLedgerDB() {
  return new Promise((resolve) => {
    resolve({});
  });
}

function getAllLedgerUpdates(db) {
  return Promise.resolve([]);
}

function deleteLedgerUpdate(db, id) {
  return Promise.resolve();
}