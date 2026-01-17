// M-PESEWA - PWA.js
// Progressive Web App functionality: installation, offline handling, updates

class MpesewaPWA {
    constructor() {
        this.deferredPrompt = null;
        this.isStandalone = false;
        this.isOnline = navigator.onLine;
        this.serviceWorkerRegistration = null;
        
        // Initialize PWA features
        this.init();
    }

    // ======================
    // INITIALIZATION
    // ======================

    async init() {
        console.log('Initializing M-Pesewa PWA...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Initialize PWA features
        this.checkInstallStatus();
        this.initServiceWorker();
        this.initNetworkDetection();
        this.initInstallPrompt();
        this.initUpdateDetection();
        this.initBackgroundSync();
        this.initPushNotifications();

        // Initialize UI elements
        this.initInstallButton();
        this.initOfflineUI();

        console.log('M-Pesewa PWA initialized');
    }

    // ======================
    // SERVICE WORKER
    // ======================

    async initServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service workers are not supported');
            return;
        }

        try {
            // Register service worker
            this.serviceWorkerRegistration = await navigator.serviceWorker.register(
                '/m-pesewa/service-worker.js',
                {
                    scope: '/m-pesewa/',
                    updateViaCache: 'none'
                }
            );

            console.log('Service Worker registered:', this.serviceWorkerRegistration);

            // Listen for service worker updates
            this.serviceWorkerRegistration.addEventListener('updatefound', () => {
                const newWorker = this.serviceWorkerRegistration.installing;
                console.log('New service worker found:', newWorker.state);

                newWorker.addEventListener('statechange', () => {
                    console.log('Service worker state changed:', newWorker.state);
                    
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateNotification();
                    }
                });
            });

            // Check for updates periodically
            setInterval(() => {
                this.checkForUpdates();
            }, 60 * 60 * 1000); // Check every hour

        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    async checkForUpdates() {
        if (!this.serviceWorkerRegistration) return;

        try {
            await this.serviceWorkerRegistration.update();
            console.log('Service Worker update check completed');
        } catch (error) {
            console.error('Failed to check for updates:', error);
        }
    }

    async updateServiceWorker() {
        if (!this.serviceWorkerRegistration || !this.serviceWorkerRegistration.waiting) {
            return;
        }

        try {
            // Send skip waiting message
            this.serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            // Reload page after update
            window.location.reload();
        } catch (error) {
            console.error('Failed to update service worker:', error);
        }
    }

    // ======================
    // INSTALLATION
    // ======================

    initInstallPrompt() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Update UI to show install button
            this.showInstallButton();
            
            // Log install availability
            this.logInstallEvent('install-available');
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', (e) => {
            console.log('App installed successfully');
            
            // Clear the deferredPrompt
            this.deferredPrompt = null;
            
            // Hide install button
            this.hideInstallButton();
            
            // Log installation
            this.logInstallEvent('installed');
            
            // Show welcome message
            this.showToast('M-Pesewa installed successfully! You can now use it offline.', 'success');
        });
    }

    initInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (!installBtn) return;

        installBtn.addEventListener('click', () => {
            this.installApp();
        });

        // Initially hide the button if app is already installed
        if (this.isStandalone || !this.deferredPrompt) {
            installBtn.style.display = 'none';
        }
    }

    async installApp() {
        if (!this.deferredPrompt) {
            console.log('No install prompt available');
            return;
        }

        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`User response to install prompt: ${outcome}`);
            
            // Log the outcome
            this.logInstallEvent(`install-${outcome}`);
            
            // Clear the deferredPrompt
            this.deferredPrompt = null;
            
            // Hide the install button
            this.hideInstallButton();
            
        } catch (error) {
            console.error('Error during install:', error);
            this.logInstallEvent('install-error', error.message);
        }
    }

    showInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'flex';
            
            // Add animation
            installBtn.classList.add('pulse');
            setTimeout(() => {
                installBtn.classList.remove('pulse');
            }, 2000);
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    checkInstallStatus() {
        // Check if app is running in standalone mode
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone ||
                           document.referrer.includes('android-app://');
        
        // Check if app is installed via other methods
        if ('getInstalledRelatedApps' in navigator) {
            navigator.getInstalledRelatedApps().then(apps => {
                if (apps.length > 0) {
                    this.isStandalone = true;
                }
            });
        }

        console.log('App is standalone:', this.isStandalone);
        return this.isStandalone;
    }

    // ======================
    // NETWORK DETECTION
    // ======================

    initNetworkDetection() {
        // Online event
        window.addEventListener('online', () => {
            console.log('Device is online');
            this.isOnline = true;
            this.hideOfflineIndicator();
            this.handleOnlineStatus();
        });

        // Offline event
        window.addEventListener('offline', () => {
            console.log('Device is offline');
            this.isOnline = false;
            this.showOfflineIndicator();
            this.handleOfflineStatus();
        });

        // Initial check
        if (!this.isOnline) {
            this.showOfflineIndicator();
            this.handleOfflineStatus();
        }
    }

    initOfflineUI() {
        // Create offline indicator if it doesn't exist
        let indicator = document.getElementById('offline-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.className = 'offline-indicator';
            indicator.innerHTML = `
                <span class="offline-icon">📶</span>
                <span class="offline-text">You are offline</span>
            `;
            indicator.style.display = 'none';
            document.body.appendChild(indicator);
        }

        // Create online indicator
        let onlineIndicator = document.getElementById('online-indicator');
        if (!onlineIndicator) {
            onlineIndicator = document.createElement('div');
            onlineIndicator.id = 'online-indicator';
            onlineIndicator.className = 'online-indicator';
            onlineIndicator.innerHTML = `
                <span class="online-icon">✅</span>
                <span class="online-text">Back online</span>
            `;
            onlineIndicator.style.display = 'none';
            document.body.appendChild(onlineIndicator);
        }
    }

    showOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
            setTimeout(() => {
                indicator.classList.add('show');
            }, 10);
        }
    }

    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.classList.remove('show');
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 300);
        }
    }

    showOnlineIndicator() {
        const indicator = document.getElementById('online-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
            setTimeout(() => {
                indicator.classList.add('show');
            }, 10);
            
            // Auto hide after 3 seconds
            setTimeout(() => {
                this.hideOnlineIndicator();
            }, 3000);
        }
    }

    hideOnlineIndicator() {
        const indicator = document.getElementById('online-indicator');
        if (indicator) {
            indicator.classList.remove('show');
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 300);
        }
    }

    handleOnlineStatus() {
        // Show online indicator
        this.showOnlineIndicator();
        
        // Show toast notification
        this.showToast('You are back online. Syncing data...', 'success');
        
        // Sync any pending data
        this.syncPendingData();
        
        // Update UI elements
        document.body.classList.remove('offline');
        document.body.classList.add('online');
        
        // Log network event
        this.logNetworkEvent('online');
    }

    handleOfflineStatus() {
        // Show toast notification
        this.showToast('You are offline. Some features may not work.', 'warning', 5000);
        
        // Update UI elements
        document.body.classList.remove('online');
        document.body.classList.add('offline');
        
        // Show cached data indicator
        this.showCachedDataNotice();
        
        // Log network event
        this.logNetworkEvent('offline');
    }

    showCachedDataNotice() {
        // Check if we're showing cached data
        if (window.performance && performance.getEntriesByType('navigation')[0]) {
            const navEntry = performance.getEntriesByType('navigation')[0];
            if (navEntry.type === 'back_forward') {
                this.showToast('Showing cached data from your last visit', 'info', 3000);
            }
        }
    }

    // ======================
    // BACKGROUND SYNC
    // ======================

    initBackgroundSync() {
        if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
            console.log('Background sync not supported');
            return;
        }

        // Listen for sync events
        navigator.serviceWorker.ready.then(registration => {
            registration.sync.register('submit-form')
                .then(() => {
                    console.log('Background sync registered');
                })
                .catch(err => {
                    console.error('Background sync registration failed:', err);
                });
        });
    }

    async syncPendingData() {
        // This would sync any pending form submissions or data
        console.log('Syncing pending data...');
        
        // Example: Sync pending loan requests
        const pendingRequests = this.getPendingRequests();
        
        if (pendingRequests.length > 0) {
            this.showToast(`Syncing ${pendingRequests.length} pending requests...`, 'info');
            
            // Simulate sync
            for (const request of pendingRequests) {
                await this.syncRequest(request);
            }
            
            this.showToast('All pending requests synced successfully', 'success');
        }
    }

    getPendingRequests() {
        // Get pending requests from IndexedDB or localStorage
        const pending = localStorage.getItem('mpesewa_pending_requests');
        return pending ? JSON.parse(pending) : [];
    }

    async syncRequest(request) {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Synced request:', request);
                resolve(true);
            }, 1000);
        });
    }

    // ======================
    // PUSH NOTIFICATIONS
    // ======================

    initPushNotifications() {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            console.log('Push notifications not supported');
            return;
        }

        // Check current permission
        this.checkNotificationPermission();
        
        // Request permission on user interaction
        this.initNotificationButton();
    }

    checkNotificationPermission() {
        if (Notification.permission === 'granted') {
            console.log('Notification permission granted');
            this.subscribeToPush();
        } else if (Notification.permission === 'denied') {
            console.log('Notification permission denied');
        }
    }

    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('Notification permission granted');
                this.showToast('Notifications enabled', 'success');
                this.subscribeToPush();
                return true;
            } else {
                console.log('Notification permission denied');
                this.showToast('Notifications disabled', 'warning');
                return false;
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    async subscribeToPush() {
        if (!this.serviceWorkerRegistration) {
            console.log('Service worker not registered');
            return;
        }

        try {
            const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.getPublicKey())
            });

            console.log('Push subscription successful:', subscription);
            
            // Send subscription to server (in real implementation)
            // await this.sendSubscriptionToServer(subscription);
            
            return subscription;
        } catch (error) {
            if (Notification.permission === 'denied') {
                console.log('Notification permission denied');
            } else {
                console.error('Failed to subscribe to push:', error);
            }
            return null;
        }
    }

    initNotificationButton() {
        const notifyBtn = document.getElementById('notify-btn');
        if (notifyBtn) {
            notifyBtn.addEventListener('click', () => {
                this.requestNotificationPermission();
            });
        }
    }

    getPublicKey() {
        // This would be your VAPID public key
        // For demo purposes, using a placeholder
        return 'BL1Vnz-xpjXgH7pL7w_6JQ6t6K7y8nLw6JQ6t6K7y8nLw6JQ6t6K7y8nLw6JQ6t6K7y8nLw6JQ6t6K7y8';
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // ======================
    // UPDATE MANAGEMENT
    // ======================

    initUpdateDetection() {
        // Listen for controller change (when new service worker takes over)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service worker controller changed');
            this.showUpdateReadyNotification();
        });

        // Check for updates on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkForUpdates();
            }
        });
    }

    showUpdateNotification() {
        // Create update notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-icon">🔄</div>
                <div class="update-text">
                    <div class="update-title">Update Available</div>
                    <div class="update-message">A new version of M-Pesewa is available.</div>
                </div>
                <div class="update-actions">
                    <button class="btn btn-outline btn-small" id="update-later">Later</button>
                    <button class="btn btn-primary btn-small" id="update-now">Update Now</button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Add event listeners
        document.getElementById('update-now').addEventListener('click', () => {
            this.updateServiceWorker();
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        document.getElementById('update-later').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 30000);
    }

    showUpdateReadyNotification() {
        this.showToast('App updated! Reload to use the latest version.', 'info', 10000, [
            {
                label: 'Reload',
                action: () => window.location.reload()
            }
        ]);
    }

    // ======================
    // OFFLINE FUNCTIONALITY
    // ======================

    async cacheEssentialData() {
        if (!this.isOnline) return;

        try {
            // Cache essential data for offline use
            const essentialEndpoints = [
                '/m-pesewa/data/countries.json',
                '/m-pesewa/data/categories.json',
                '/m-pesewa/data/subscriptions.json'
            ];

            const cache = await caches.open('mpesewa-data-v1');
            
            for (const endpoint of essentialEndpoints) {
                try {
                    await cache.add(endpoint);
                    console.log('Cached:', endpoint);
                } catch (error) {
                    console.warn('Failed to cache:', endpoint, error);
                }
            }

            console.log('Essential data cached for offline use');
        } catch (error) {
            console.error('Failed to cache essential data:', error);
        }
    }

    async getCachedData(endpoint) {
        try {
            const cache = await caches.open('mpesewa-data-v1');
            const response = await cache.match(endpoint);
            
            if (response) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to get cached data:', error);
        }
        
        return null;
    }

    // ======================
    // ANALYTICS & LOGGING
    // ======================

    logInstallEvent(event, details = '') {
        const logEntry = {
            event,
            details,
            timestamp: new Date().toISOString(),
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            standalone: this.isStandalone
        };

        console.log('Install event:', logEntry);

        // Store in localStorage for analytics
        const logs = JSON.parse(localStorage.getItem('mpesewa_install_logs') || '[]');
        logs.push(logEntry);
        localStorage.setItem('mpesewa_install_logs', JSON.stringify(logs.slice(-100))); // Keep last 100 entries
    }

    logNetworkEvent(event) {
        const logEntry = {
            event,
            timestamp: new Date().toISOString(),
            online: this.isOnline
        };

        console.log('Network event:', logEntry);

        // Store in localStorage
        const logs = JSON.parse(localStorage.getItem('mpesewa_network_logs') || '[]');
        logs.push(logEntry);
        localStorage.setItem('mpesewa_network_logs', JSON.stringify(logs.slice(-50)));
    }

    logServiceWorkerEvent(event, details = '') {
        const logEntry = {
            event,
            details,
            timestamp: new Date().toISOString(),
            registration: this.serviceWorkerRegistration ? true : false
        };

        console.log('Service Worker event:', logEntry);

        // Store in localStorage
        const logs = JSON.parse(localStorage.getItem('mpesewa_sw_logs') || '[]');
        logs.push(logEntry);
        localStorage.setItem('mpesewa_sw_logs', JSON.stringify(logs.slice(-50)));
    }

    // ======================
    // UI HELPERS
    // ======================

    showToast(message, type = 'info', duration = 3000, actions = []) {
        // Create toast container if it doesn't exist
        let container = document.getElementById('pwa-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'pwa-toast-container';
            container.className = 'pwa-toast-container';
            document.body.appendChild(container);
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = `pwa-toast toast-${type}`;
        
        let actionsHTML = '';
        if (actions.length > 0) {
            actionsHTML = `<div class="toast-actions">${actions.map(action => 
                `<button class="toast-action" data-action="${action.label}">${action.label}</button>`
            ).join('')}</div>`;
        }

        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-message">${message}</div>
                ${actionsHTML}
            </div>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Show toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Add event listeners
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.hideToast(toast);
        });

        actions.forEach((action, index) => {
            toast.querySelector(`.toast-action[data-action="${action.label}"]`)?.addEventListener('click', () => {
                action.action();
                this.hideToast(toast);
            });
        });

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hideToast(toast);
            }, duration);
        }

        return toast;
    }

    hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // ======================
    // UTILITIES
    // ======================

    getStorageEstimate() {
        if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
            return Promise.resolve(null);
        }

        return navigator.storage.estimate().then(estimate => {
            const percentUsed = (estimate.usage / estimate.quota * 100).toFixed(1);
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                percentUsed: percentUsed
            };
        });
    }

    clearCache() {
        if (!('caches' in window)) return Promise.resolve();

        return caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        });
    }

    getAppInfo() {
        return {
            version: '1.0.0',
            installStatus: this.isStandalone ? 'installed' : 'not-installed',
            online: this.isOnline,
            serviceWorker: this.serviceWorkerRegistration ? 'registered' : 'not-registered',
            pushPermission: Notification.permission,
            platform: navigator.platform,
            userAgent: navigator.userAgent
        };
    }

    // ======================
    // ERROR HANDLING
    // ======================

    handleServiceWorkerError(error) {
        console.error('Service Worker error:', error);
        
        this.showToast('Service Worker error. Try refreshing the page.', 'error', 5000, [
            {
                label: 'Refresh',
                action: () => window.location.reload()
            }
        ]);
    }

    handleCacheError(error) {
        console.error('Cache error:', error);
        
        if (this.isOnline) {
            this.showToast('Cache error. Some features may not work offline.', 'warning');
        }
    }

    handleNetworkError(error) {
        console.error('Network error:', error);
        
        if (!this.isOnline) {
            this.showToast('Network error. You are offline.', 'error', 3000);
        }
    }
}

// Initialize PWA
window.mpesewaPWA = new MpesewaPWA();

// Make it available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MpesewaPWA;
}