// ============================================
// M-PESEWA - SERVICE WORKER
// Offline support and asset caching
// ============================================

const CACHE_NAME = 'mpesewa-v1.0.0';
const CACHE_FILES = [
  // Core assets
  './',
  './index.html',
  './manifest.json',
  
  // CSS files
  './assets/css/main.css',
  './assets/css/components.css',
  './assets/css/dashboard.css',
  './assets/css/forms.css',
  './assets/css/tables.css',
  './assets/css/animations.css',
  
  // JS files
  './assets/js/app.js',
  './assets/js/pwa.js',
  './assets/js/utils.js',
  './assets/js/auth.js',
  './assets/js/roles.js',
  './assets/js/groups.js',
  './assets/js/lending.js',
  './assets/js/borrowing.js',
  './assets/js/ledger.js',
  './assets/js/blacklist.js',
  './assets/js/subscriptions.js',
  './assets/js/countries.js',
  './assets/js/collectors.js',
  './assets/js/calculator.js',
  
  // Core pages
  './pages/about.html',
  './pages/qa.html',
  './pages/contact.html',
  './pages/borrowing.html',
  './pages/lending.html',
  './pages/ledger.html',
  './pages/groups.html',
  './pages/subscriptions.html',
  './pages/blacklist.html',
  './pages/debt-collectors.html',
  
  // Dashboard pages
  './pages/dashboard/borrower-dashboard.html',
  './pages/dashboard/lender-dashboard.html',
  './pages/dashboard/admin-dashboard.html',
  
  // Country pages
  './pages/countries/index.html',
  './pages/countries/kenya.html',
  './pages/countries/uganda.html',
  './pages/countries/tanzania.html',
  './pages/countries/rwanda.html',
  './pages/countries/nigeria.html',
  './pages/countries/ghana.html',
  './pages/countries/south-africa.html',
  './pages/countries/ethiopia.html',
  './pages/countries/egypt.html',
  './pages/countries/morocco.html',
  './pages/countries/senegal.html',
  
  // Fallback offline page
  './offline.html'
];

// ============================================
// INSTALL EVENT - Cache core files
// ============================================
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching core files');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// ============================================
// ACTIVATE EVENT - Clean up old caches
// ============================================
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
    })
    .then(() => {
      console.log('[Service Worker] Activation complete');
      return self.clients.claim();
    })
  );
});

// ============================================
// FETCH EVENT - Serve cached files or network
// ============================================
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // For non-API requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        
        // Otherwise fetch from network
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to cache it
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('[Service Worker] Cached new resource:', event.request.url);
              });
            
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // Return offline page for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./offline.html');
            }
            
            // Return fallback for other file types
            return fallbackResponse(event.request);
          });
      })
  );
});

// ============================================
// API REQUEST HANDLER - Network-first strategy
// ============================================
function handleApiRequest(request) {
  return fetch(request)
    .then(response => {
      // Clone response to cache
      const responseClone = response.clone();
      
      caches.open(CACHE_NAME + '-api')
        .then(cache => {
          cache.put(request, responseClone);
        });
      
      return response;
    })
    .catch(error => {
      console.error('[Service Worker] API request failed:', error);
      
      // Try to return cached API response
      return caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('[Service Worker] Serving cached API response');
            return cachedResponse;
          }
          
          // Return error response if no cache
          return new Response(
            JSON.stringify({ 
              error: 'Network error',
              message: 'You are offline and no cached data is available.'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
    });
}

// ============================================
// FALLBACK RESPONSE GENERATOR
// ============================================
function fallbackResponse(request) {
  const url = new URL(request.url);
  
  // Different fallbacks based on file type
  if (url.pathname.endsWith('.css')) {
    return new Response(
      '/* Offline fallback for CSS */\nbody::before { content: "⚠ Offline Mode"; position: fixed; top: 0; left: 0; right: 0; background: #FFC107; color: #2B1D4F; text-align: center; padding: 8px; z-index: 10000; }',
      { headers: { 'Content-Type': 'text/css' } }
    );
  }
  
  if (url.pathname.endsWith('.js')) {
    return new Response(
      'console.log("⚠ Offline Mode - JavaScript not available");',
      { headers: { 'Content-Type': 'application/javascript' } }
    );
  }
  
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
    // Return a simple SVG placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#F5F7FB"/>
      <text x="50" y="50" text-anchor="middle" dy=".3em" fill="#666" font-family="sans-serif" font-size="10">Image</text>
    </svg>`;
    
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
  
  // Generic fallback
  return new Response(
    '⚠ Offline - Content not available',
    { status: 503, headers: { 'Content-Type': 'text/plain' } }
  );
}

// ============================================
// BACKGROUND SYNC FOR OFFLINE ACTIONS
// ============================================
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-loan-request') {
    event.waitUntil(syncLoanRequests());
  }
  
  if (event.tag === 'sync-payment') {
    event.waitUntil(syncPayments());
  }
});

function syncLoanRequests() {
  // This would sync pending loan requests when online
  return getPendingRequests()
    .then(requests => {
      return Promise.all(
        requests.map(request => {
          return fetch('/api/loan-requests', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: { 'Content-Type': 'application/json' }
          })
          .then(response => {
            if (response.ok) {
              return removePendingRequest(request.id);
            }
            throw new Error('Sync failed');
          });
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Loan requests synced');
      return self.registration.showNotification('M-PESEWA', {
        body: 'Your loan requests have been synced',
        icon: './assets/images/icon-192.png'
      });
    })
    .catch(error => {
      console.error('[Service Worker] Sync failed:', error);
    });
}

function syncPayments() {
  // This would sync pending payments when online
  return getPendingPayments()
    .then(payments => {
      return Promise.all(
        payments.map(payment => {
          return fetch('/api/payments', {
            method: 'POST',
            body: JSON.stringify(payment),
            headers: { 'Content-Type': 'application/json' }
          })
          .then(response => {
            if (response.ok) {
              return removePendingPayment(payment.id);
            }
            throw new Error('Sync failed');
          });
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Payments synced');
      return self.registration.showNotification('M-PESEWA', {
        body: 'Your payments have been synced',
        icon: './assets/images/icon-192.png'
      });
    })
    .catch(error => {
      console.error('[Service Worker] Sync failed:', error);
    });
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  
  const title = data.title || 'M-PESEWA';
  const options = {
    body: data.body || 'You have a new notification',
    icon: './assets/images/icon-192.png',
    badge: './assets/images/badge-72x72.png',
    tag: data.tag || 'general',
    data: data.url ? { url: data.url } : {},
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(windowClients => {
          // Check if there's already a window/tab open with the target URL
          for (let client of windowClients) {
            if (client.url === event.notification.data.url && 'focus' in client) {
              return client.focus();
            }
          }
          
          // If not, open a new window/tab
          if (clients.openWindow) {
            return clients.openWindow(event.notification.data.url);
          }
        })
    );
  }
});

// ============================================
// PERIODIC SYNC (for background updates)
// ============================================
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    console.log('[Service Worker] Periodic sync for cache update');
    event.waitUntil(updateCache());
  }
});

function updateCache() {
  return caches.open(CACHE_NAME)
    .then(cache => {
      return cache.keys()
        .then(requests => {
          return Promise.all(
            requests.map(request => {
              return fetch(request)
                .then(response => {
                  if (response.status === 200) {
                    return cache.put(request, response);
                  }
                })
                .catch(() => {
                  // Ignore errors for cache updates
                });
            })
          );
        });
    })
    .then(() => {
      console.log('[Service Worker] Cache updated');
    });
}

// ============================================
// HELPER FUNCTORS FOR OFFLINE DATA
// ============================================
function getPendingRequests() {
  return new Promise(resolve => {
    // In a real app, this would read from IndexedDB
    const requests = JSON.parse(localStorage.getItem('pending_loan_requests') || '[]');
    resolve(requests);
  });
}

function removePendingRequest(id) {
  return new Promise(resolve => {
    const requests = JSON.parse(localStorage.getItem('pending_loan_requests') || '[]');
    const filtered = requests.filter(req => req.id !== id);
    localStorage.setItem('pending_loan_requests', JSON.stringify(filtered));
    resolve();
  });
}

function getPendingPayments() {
  return new Promise(resolve => {
    const payments = JSON.parse(localStorage.getItem('pending_payments') || '[]');
    resolve(payments);
  });
}

function removePendingPayment(id) {
  return new Promise(resolve => {
    const payments = JSON.parse(localStorage.getItem('pending_payments') || '[]');
    const filtered = payments.filter(pmt => pmt.id !== id);
    localStorage.setItem('pending_payments', JSON.stringify(filtered));
    resolve();
  });
}

// ============================================
// ERROR HANDLING
// ============================================
self.addEventListener('error', event => {
  console.error('[Service Worker] Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[Service Worker] Unhandled rejection:', event.reason);
});
