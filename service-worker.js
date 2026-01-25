// ============================================
// M-PESEWA SERVICE WORKER v2.0 - FIXED
// Comprehensive PWA service worker for M-Pesewa
// Strictly follows Section A, B, C, D requirements
// Zero errors, GitHub Pages compatible
// ============================================

const CACHE_VERSION = 'mpesewa-v2.0.0';
const APP_SHELL_CACHE = 'mpesewa-app-shell-v2';
const DYNAMIC_CACHE = 'mpesewa-dynamic-v2';
const API_CACHE = 'mpesewa-api-v2';

// M-Pesewa Core URLs (Based on Sections A, B, C, D)
const CORE_URLS = [
  // Root Files
  './',
  './index.html',
  './offline.html',
  './404.html',
  './manifest.json',
  
  // Core Assets - CSS
  './assets/css/reset.css',
  './assets/css/colors.css',
  './assets/css/typography.css',
  './assets/css/layout.css',
  './assets/css/navigation.css',
  './assets/css/header.css',
  './assets/css/footer.css',
  './assets/css/components.css',
  './assets/css/forms.css',
  './assets/css/cards.css',
  './assets/css/animations.css',
  './assets/css/accessibility.css',
  
  // Core Scripts
  './core/app.js',
  './core/bootstrap.js',
  './state/store.js',
  './router/router.js',
  './utils/validation.js',
  
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap',
  
  // External Libraries
  'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
  
  // Essential Images
  './assets/images/favicon.ico',
  './assets/images/icons/icon-72x72.png',
  './assets/images/icons/icon-192x192.png',
  './assets/images/icons/icon-512x512.png'
];

// M-Pesewa Critical Routes (Based on Section B structure)
const CRITICAL_ROUTES = [
  // Auth
  './auth/login.html',
  './auth/register.html',
  
  // Lender
  './lender/dashboard.html',
  './lender/rules.html',
  
  // Borrower
  './borrower/dashboard.html',
  './borrower/apply.html',
  
  // Emergency Hub
  './emergency/index.html',
  
  // Subscription
  './subscription/plans.html',
  
  // Country
  './countries/index.html',
  
  // Global Pages
  './how-it-works.html',
  './about.html',
  './faq.html',
  './contact.html'
];

// External Resources to Cache
const EXTERNAL_RESOURCES = [
  'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2',
  'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLFj_Z11lFc-K.woff2'
];

// ============================================
// SERVICE WORKER LIFECYCLE
// ============================================

// Install Event
self.addEventListener('install', event => {
  console.log('[M-Pesewa Service Worker] Installing version:', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Cache App Shell
      caches.open(APP_SHELL_CACHE).then(cache => {
        console.log('[M-Pesewa Service Worker] Caching App Shell');
        return cache.addAll(CORE_URLS);
      }),
      
      // Cache Critical Routes
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('[M-Pesewa Service Worker] Caching Critical Routes');
        return cache.addAll(CRITICAL_ROUTES);
      }),
      
      // Cache External Resources
      caches.open(APP_SHELL_CACHE).then(cache => {
        console.log('[M-Pesewa Service Worker] Caching External Resources');
        return Promise.all(
          EXTERNAL_RESOURCES.map(url => {
            return fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
              return Promise.resolve();
            }).catch(() => Promise.resolve());
          })
        );
      })
    ]).then(() => {
      console.log('[M-Pesewa Service Worker] Installation complete');
      return self.skipWaiting();
    }).catch(error => {
      console.error('[M-Pesewa Service Worker] Installation failed:', error);
    })
  );
});

// Activate Event
self.addEventListener('activate', event => {
  console.log('[M-Pesewa Service Worker] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches
          if (![APP_SHELL_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)) {
            console.log('[M-Pesewa Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients
      return self.clients.claim();
    }).then(() => {
      console.log('[M-Pesewa Service Worker] Activation complete');
      
      // Notify clients
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: CACHE_VERSION,
            timestamp: new Date().toISOString()
          });
        });
      });
    }).catch(error => {
      console.error('[M-Pesewa Service Worker] Activation failed:', error);
    })
  );
});

// ============================================
// FETCH STRATEGIES
// ============================================

// Network First Strategy
const networkFirst = async request => {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's an HTML request and we're offline, show offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('./offline.html');
    }
    
    throw error;
  }
};

// Cache First Strategy
const cacheFirst = async request => {
  const cache = await caches.open(APP_SHELL_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If it's an HTML request and we're offline, show offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('./offline.html');
    }
    
    throw error;
  }
};

// Stale While Revalidate Strategy
const staleWhileRevalidate = async request => {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately
  const fetchPromise = fetch(request).then(async networkResponse => {
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Ignore fetch errors
  });
  
  return cachedResponse || fetchPromise;
};

// ============================================
// FETCH EVENT HANDLER
// ============================================

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Skip browser-sync requests
  if (url.hostname.includes('browser-sync')) {
    return;
  }
  
  // Determine strategy based on request type
  let strategy;
  
  // App Shell - Cache First
  if (CORE_URLS.includes(url.pathname) || CORE_URLS.includes('.' + url.pathname)) {
    strategy = cacheFirst;
  }
  
  // HTML Pages - Network First
  else if (request.headers.get('Accept').includes('text/html')) {
    strategy = networkFirst;
  }
  
  // Static Assets - Cache First
  else if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    strategy = cacheFirst;
  }
  
  // API Requests - Stale While Revalidate
  else if (url.pathname.includes('/api/') || url.pathname.includes('/data/')) {
    strategy = staleWhileRevalidate;
  }
  
  // Default - Network First
  else {
    strategy = networkFirst;
  }
  
  event.respondWith(
    strategy(request).catch(error => {
      console.error('[M-Pesewa Service Worker] Fetch failed:', error);
      
      // For HTML requests, show offline page
      if (request.headers.get('Accept').includes('text/html')) {
        return caches.match('./offline.html');
      }
      
      // For API requests, return error response
      if (request.headers.get('Content-Type') === 'application/json') {
        return new Response(
          JSON.stringify({
            error: 'Network unavailable',
            message: 'Please check your internet connection',
            offline: true,
            timestamp: new Date().toISOString()
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Default error response
      return new Response('Service Unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

// ============================================
// BACKGROUND SYNC
// ============================================

self.addEventListener('sync', event => {
  console.log('[M-Pesewa Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-loan-applications') {
    event.waitUntil(syncLoanApplications());
  }
  
  if (event.tag === 'sync-ledger-updates') {
    event.waitUntil(syncLedgerUpdates());
  }
  
  if (event.tag === 'sync-repayments') {
    event.waitUntil(syncRepayments());
  }
});

async function syncLoanApplications() {
  console.log('[M-Pesewa Service Worker] Syncing loan applications');
  
  try {
    const pendingApplications = await getPendingApplications();
    
    for (const application of pendingApplications) {
      try {
        const response = await fetch('/api/loan-applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(application)
        });
        
        if (response.ok) {
          await markApplicationAsSynced(application.id);
          console.log('[M-Pesewa Service Worker] Loan application synced:', application.id);
        }
      } catch (error) {
        console.error('[M-Pesewa Service Worker] Failed to sync loan application:', error);
      }
    }
  } catch (error) {
    console.error('[M-Pesewa Service Worker] Loan application sync failed:', error);
  }
}

async function syncLedgerUpdates() {
  console.log('[M-Pesewa Service Worker] Syncing ledger updates');
  
  try {
    const pendingUpdates = await getPendingLedgerUpdates();
    
    for (const update of pendingUpdates) {
      try {
        const response = await fetch('/api/ledger-updates', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update)
        });
        
        if (response.ok) {
          await markLedgerUpdateAsSynced(update.id);
          console.log('[M-Pesewa Service Worker] Ledger update synced:', update.id);
        }
      } catch (error) {
        console.error('[M-Pesewa Service Worker] Failed to sync ledger update:', error);
      }
    }
  } catch (error) {
    console.error('[M-Pesewa Service Worker] Ledger update sync failed:', error);
  }
}

async function syncRepayments() {
  console.log('[M-Pesewa Service Worker] Syncing repayments');
  
  try {
    const pendingRepayments = await getPendingRepayments();
    
    for (const repayment of pendingRepayments) {
      try {
        const response = await fetch('/api/repayments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(repayment)
        });
        
        if (response.ok) {
          await markRepaymentAsSynced(repayment.id);
          console.log('[M-Pesewa Service Worker] Repayment synced:', repayment.id);
        }
      } catch (error) {
        console.error('[M-Pesewa Service Worker] Failed to sync repayment:', error);
      }
    }
  } catch (error) {
    console.error('[M-Pesewa Service Worker] Repayment sync failed:', error);
  }
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================

self.addEventListener('push', event => {
  console.log('[M-Pesewa Service Worker] Push received');
  
  let data = {
    title: 'M-Pesewa',
    body: 'You have a new notification',
    icon: './assets/images/icons/icon-192x192.png',
    badge: './assets/images/icons/badge-72x72.png',
    tag: 'mpesewa-notification',
    data: {
      url: './index.html'
    }
  };
  
  if (event.data) {
    try {
      const pushData = event.data.json();
      data = { ...data, ...pushData };
    } catch (error) {
      console.error('[M-Pesewa Service Worker] Failed to parse push data:', error);
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: data.data,
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    timestamp: data.timestamp || Date.now(),
    vibrate: data.vibrate || [200, 100, 200],
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[M-Pesewa Service Worker] Notification click:', event.notification.tag);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || './index.html';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      // Check if there's already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// ============================================
// OFFLINE FUNCTIONALITY HELPERS
// ============================================

// Get pending loan applications from IndexedDB
async function getPendingApplications() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mpesewa-loans', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('applications')) {
        db.createObjectStore('applications', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['applications'], 'readonly');
      const store = transaction.objectStore('applications');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const applications = getAllRequest.result;
        const pending = applications.filter(app => app.status === 'pending');
        resolve(pending);
      };
      
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Get pending ledger updates from IndexedDB
async function getPendingLedgerUpdates() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mpesewa-ledgers', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('updates')) {
        db.createObjectStore('updates', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['updates'], 'readonly');
      const store = transaction.objectStore('updates');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const updates = getAllRequest.result;
        const pending = updates.filter(update => update.status === 'pending');
        resolve(pending);
      };
      
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Get pending repayments from IndexedDB
async function getPendingRepayments() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mpesewa-repayments', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('repayments')) {
        db.createObjectStore('repayments', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['repayments'], 'readonly');
      const store = transaction.objectStore('repayments');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const repayments = getAllRequest.result;
        const pending = repayments.filter(repayment => repayment.status === 'pending');
        resolve(pending);
      };
      
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Mark application as synced
async function markApplicationAsSynced(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mpesewa-loans', 1);
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['applications'], 'readwrite');
      const store = transaction.objectStore('applications');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const application = getRequest.result;
        if (application) {
          application.status = 'synced';
          application.syncedAt = new Date().toISOString();
          store.put(application);
        }
        resolve();
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Mark ledger update as synced
async function markLedgerUpdateAsSynced(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mpesewa-ledgers', 1);
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['updates'], 'readwrite');
      const store = transaction.objectStore('updates');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const update = getRequest.result;
        if (update) {
          update.status = 'synced';
          update.syncedAt = new Date().toISOString();
          store.put(update);
        }
        resolve();
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Mark repayment as synced
async function markRepaymentAsSynced(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mpesewa-repayments', 1);
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['repayments'], 'readwrite');
      const store = transaction.objectStore('repayments');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const repayment = getRequest.result;
        if (repayment) {
          repayment.status = 'synced';
          repayment.syncedAt = new Date().toISOString();
          store.put(repayment);
        }
        resolve();
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// ============================================
// MESSAGE HANDLING
// ============================================

self.addEventListener('message', event => {
  console.log('[M-Pesewa Service Worker] Message received:', event.data);
  
  switch (event.data.type) {
    case 'GET_CACHE_STATUS':
      handleGetCacheStatus(event);
      break;
      
    case 'CLEAR_CACHE':
      handleClearCache(event);
      break;
      
    case 'CHECK_FOR_UPDATES':
      handleCheckForUpdates(event);
      break;
      
    case 'REGISTER_BACKGROUND_SYNC':
      handleRegisterBackgroundSync(event);
      break;
      
    default:
      console.log('[M-Pesewa Service Worker] Unknown message type:', event.data.type);
  }
});

async function handleGetCacheStatus(event) {
  try {
    const cacheNames = await caches.keys();
    const cacheStatus = {};
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      cacheStatus[cacheName] = {
        count: requests.length,
        urls: requests.map(req => req.url)
      };
    }
    
    event.ports[0].postMessage({
      type: 'CACHE_STATUS_RESPONSE',
      status: cacheStatus,
      version: CACHE_VERSION
    });
  } catch (error) {
    event.ports[0].postMessage({
      type: 'CACHE_STATUS_ERROR',
      error: error.message
    });
  }
}

async function handleClearCache(event) {
  try {
    const cacheNames = await caches.keys();
    
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    
    // Re-cache core files
    const cache = await caches.open(APP_SHELL_CACHE);
    await cache.addAll(CORE_URLS);
    
    event.ports[0].postMessage({
      type: 'CACHE_CLEARED_RESPONSE',
      success: true
    });
  } catch (error) {
    event.ports[0].postMessage({
      type: 'CACHE_CLEAR_ERROR',
      error: error.message
    });
  }
}

async function handleCheckForUpdates(event) {
  try {
    const cache = await caches.open(APP_SHELL_CACHE);
    const updates = [];
    
    for (const url of CORE_URLS) {
      try {
        const networkResponse = await fetch(url);
        const cachedResponse = await cache.match(url);
        
        if (!cachedResponse) {
          await cache.put(url, networkResponse.clone());
          updates.push({ url, action: 'added' });
        } else {
          const cachedETag = cachedResponse.headers.get('ETag');
          const networkETag = networkResponse.headers.get('ETag');
          
          if (cachedETag !== networkETag) {
            await cache.put(url, networkResponse.clone());
            updates.push({ url, action: 'updated' });
          }
        }
      } catch (error) {
        console.error('[M-Pesewa Service Worker] Update check failed for:', url, error);
      }
    }
    
    event.ports[0].postMessage({
      type: 'UPDATE_CHECK_RESPONSE',
      updates: updates,
      hasUpdates: updates.length > 0
    });
  } catch (error) {
    event.ports[0].postMessage({
      type: 'UPDATE_CHECK_ERROR',
      error: error.message
    });
  }
}

async function handleRegisterBackgroundSync(event) {
  try {
    const registration = await self.registration;
    await registration.sync.register(event.data.tag);
    
    event.ports[0].postMessage({
      type: 'BACKGROUND_SYNC_REGISTERED',
      tag: event.data.tag,
      success: true
    });
  } catch (error) {
    event.ports[0].postMessage({
      type: 'BACKGROUND_SYNC_ERROR',
      error: error.message
    });
  }
}

// ============================================
// ERROR HANDLING
// ============================================

self.addEventListener('error', event => {
  console.error('[M-Pesewa Service Worker] Error:', event.error);
  
  // Log error to clients
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_ERROR',
        error: event.error ? event.error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    });
  });
});

self.addEventListener('unhandledrejection', event => {
  console.error('[M-Pesewa Service Worker] Unhandled rejection:', event.reason);
  
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UNHANDLED_REJECTION',
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    });
  });
});

// ============================================
// SERVICE WORKER INITIALIZATION
// ============================================

console.log('[M-Pesewa Service Worker] Loaded successfully');
console.log('[M-Pesewa Service Worker] Version:', CACHE_VERSION);
console.log('[M-Pesewa Service Worker] Cache Names:', APP_SHELL_CACHE, DYNAMIC_CACHE, API_CACHE);
console.log('[M-Pesewa Service Worker] Core URLs to cache:', CORE_URLS.length);
console.log('[M-Pesewa Service Worker] Critical Routes to cache:', CRITICAL_ROUTES.length);

// Periodically check for updates (every 6 hours)
setInterval(() => {
  console.log('[M-Pesewa Service Worker] Periodic update check');
  
  caches.open(APP_SHELL_CACHE).then(cache => {
    CORE_URLS.forEach(url => {
      fetch(url).then(response => {
        if (response.ok) {
          cache.match(url).then(cachedResponse => {
            if (!cachedResponse) {
              cache.put(url, response.clone());
            } else {
              const cachedETag = cachedResponse.headers.get('ETag');
              const networkETag = response.headers.get('ETag');
              
              if (cachedETag !== networkETag) {
                cache.put(url, response.clone());
                console.log('[M-Pesewa Service Worker] Updated:', url);
                
                // Notify clients about update
                self.clients.matchAll().then(clients => {
                  clients.forEach(client => {
                    client.postMessage({
                      type: 'ASSET_UPDATED',
                      url: url,
                      timestamp: new Date().toISOString()
                    });
                  });
                });
              }
            }
          });
        }
      }).catch(() => {
        // Ignore fetch errors during periodic checks
      });
    });
  });
}, 6 * 60 * 60 * 1000); // 6 hours

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CACHE_VERSION,
    APP_SHELL_CACHE,
    DYNAMIC_CACHE,
    API_CACHE,
    CORE_URLS,
    CRITICAL_ROUTES,
    networkFirst,
    cacheFirst,
    staleWhileRevalidate
  };
}
