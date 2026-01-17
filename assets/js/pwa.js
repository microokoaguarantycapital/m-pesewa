/* M-PESEWA PWA.JS */
/* Progressive Web App functionality: installation, offline handling, service worker */

// ===== PWA INSTALLATION HANDLER =====
class PWAInstallHandler {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.installEvent = null;
        this.isInstalled = false;
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        
        this.init();
    }
    
    init() {
        this.detectInstallation();
        this.setupEventListeners();
        this.createInstallUI();
        this.checkServiceWorker();
    }
    
    // Detect if app is already installed
    detectInstallation() {
        // Check for standalone mode
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        
        // Check for iOS standalone
        if (window.navigator.standalone) {
            this.isStandalone = true;
        }
        
        // Check localStorage for previous installation
        if (localStorage.getItem('mpesewa_pwa_installed') === 'true') {
            this.isInstalled = true;
        }
        
        // Update UI based on installation status
        this.updateInstallUI();
    }
    
    // Create install button and prompt UI
    createInstallUI() {
        // Check if install button already exists
        this.installButton = document.getElementById('install-btn');
        
        if (!this.installButton) {
            // Create install button if it doesn't exist
            this.installButton = document.createElement('button');
            this.installButton.id = 'install-btn';
            this.installButton.className = 'btn btn-outline btn-small';
            this.installButton.innerHTML = '📱 Install App';
            this.installButton.style.display = 'none';
            
            // Add to page if there's a PWA container
            const pwaContainer = document.querySelector('.footer-pwa') || document.querySelector('.nav-actions');
            if (pwaContainer) {
                pwaContainer.appendChild(this.installButton);
            } else {
                // Add to body as floating button
                this.installButton.style.position = 'fixed';
                this.installButton.style.bottom = '20px';
                this.installButton.style.right = '20px';
                this.installButton.style.zIndex = '1000';
                document.body.appendChild(this.installButton);
            }
        }
        
        // Create install prompt banner
        this.createInstallPrompt();
    }
    
    createInstallPrompt() {
        // Remove existing prompt if any
        const existingPrompt = document.getElementById('install-prompt');
        if (existingPrompt) existingPrompt.remove();
        
        // Create prompt banner
        const prompt = document.createElement('div');
        prompt.id = 'install-prompt';
        prompt.className = 'install-prompt hidden';
        prompt.innerHTML = `
            <div class="install-prompt-content">
                <span class="install-prompt-icon">📱</span>
                <div class="install-prompt-text">
                    <strong>Install M-Pesewa</strong>
                    <p>Get quick access on your home screen</p>
                </div>
            </div>
            <div class="install-prompt-actions">
                <button class="btn btn-outline btn-small" id="dismiss-install">Later</button>
                <button class="btn btn-primary btn-small" id="accept-install">Install</button>
            </div>
        `;
        
        document.body.appendChild(prompt);
    }
    
    // Setup event listeners for PWA installation
    setupEventListeners() {
        // Before install prompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            this.installEvent = e;
            
            // Show install button
            this.showInstallButton();
            
            // Show prompt after 5 seconds if not dismissed before
            setTimeout(() => {
                if (this.deferredPrompt && !this.isInstalled) {
                    this.showInstallPrompt();
                }
            }, 5000);
        });
        
        // App installed event
        window.addEventListener('appinstalled', (e) => {
            console.log('PWA installed successfully');
            this.isInstalled = true;
            this.isStandalone = true;
            
            // Mark as installed in localStorage
            localStorage.setItem('mpesewa_pwa_installed', 'true');
            
            // Hide install UI
            this.hideInstallUI();
            
            // Show success message
            this.showToast('M-Pesewa installed successfully!', 'success');
            
            // Track installation
            this.trackInstallation();
        });
        
        // Display mode changes (e.g., from browser to standalone)
        window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
            this.isStandalone = e.matches;
            this.updateInstallUI();
        });
        
        // Online/offline events
        window.addEventListener('online', () => {
            this.updateOnlineStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.updateOnlineStatus(false);
        });
    }
    
    // Show install button
    showInstallButton() {
        if (this.installButton && !this.isInstalled && !this.isStandalone) {
            this.installButton.style.display = 'inline-block';
            
            // Add click handler
            this.installButton.onclick = (e) => {
                e.preventDefault();
                this.promptInstallation();
            };
        }
    }
    
    // Hide install UI
    hideInstallUI() {
        if (this.installButton) {
            this.installButton.style.display = 'none';
        }
        
        this.hideInstallPrompt();
    }
    
    // Show install prompt banner
    showInstallPrompt() {
        const prompt = document.getElementById('install-prompt');
        if (!prompt) return;
        
        // Check if user has dismissed before
        if (localStorage.getItem('mpesewa_install_dismissed') === 'true') {
            return;
        }
        
        prompt.classList.remove('hidden');
        
        // Add event listeners to prompt buttons
        const dismissBtn = document.getElementById('dismiss-install');
        const acceptBtn = document.getElementById('accept-install');
        
        if (dismissBtn) {
            dismissBtn.onclick = () => {
                prompt.classList.add('hidden');
                localStorage.setItem('mpesewa_install_dismissed', 'true');
            };
        }
        
        if (acceptBtn) {
            acceptBtn.onclick = () => {
                this.promptInstallation();
                prompt.classList.add('hidden');
            };
        }
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (prompt.classList.contains('hidden')) return;
            prompt.classList.add('hidden');
        }, 30000);
    }
    
    // Hide install prompt
    hideInstallPrompt() {
        const prompt = document.getElementById('install-prompt');
        if (prompt) {
            prompt.classList.add('hidden');
        }
    }
    
    // Trigger installation prompt
    async promptInstallation() {
        if (!this.deferredPrompt) {
            console.log('No install prompt available');
            this.showToast('Installation not available in this browser', 'info');
            return;
        }
        
        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const choiceResult = await this.deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                this.showToast('Installing M-Pesewa...', 'success');
            } else {
                console.log('User dismissed the install prompt');
                this.showToast('Installation cancelled', 'info');
            }
            
            // Clear the deferred prompt variable
            this.deferredPrompt = null;
            
        } catch (error) {
            console.error('Error during installation:', error);
            this.showToast('Installation failed', 'error');
        }
    }
    
    // Update install UI based on current state
    updateInstallUI() {
        if (this.isInstalled || this.isStandalone) {
            this.hideInstallUI();
            
            // Change install button to "Installed" if visible
            if (this.installButton) {
                this.installButton.innerHTML = '✅ Installed';
                this.installButton.disabled = true;
            }
        } else {
            this.showInstallButton();
        }
    }
    
    // Check service worker status
    async checkServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                console.log('Service Worker registered:', registration);
                
                // Check for updates
                this.checkForUpdates();
                
            } catch (error) {
                console.log('Service Worker not ready:', error);
            }
        }
    }
    
    // Check for app updates
    async checkForUpdates() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('Service Worker update found:', newWorker);
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New update available
                            this.showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.error('Error checking for updates:', error);
            }
        }
    }
    
    // Show update notification
    showUpdateNotification() {
        // Remove existing notification
        const existingNotification = document.getElementById('update-notification');
        if (existingNotification) existingNotification.remove();
        
        // Create update notification
        const notification = document.createElement('div');
        notification.id = 'update-notification';
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span class="update-icon">🔄</span>
                <div class="update-text">
                    <strong>Update Available</strong>
                    <p>A new version of M-Pesewa is available</p>
                </div>
            </div>
            <div class="update-actions">
                <button class="btn btn-outline btn-small" id="dismiss-update">Later</button>
                <button class="btn btn-primary btn-small" id="refresh-update">Update Now</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Add event listeners
        const dismissBtn = document.getElementById('dismiss-update');
        const refreshBtn = document.getElementById('refresh-update');
        
        if (dismissBtn) {
            dismissBtn.onclick = () => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            };
        }
        
        if (refreshBtn) {
            refreshBtn.onclick = () => {
                this.refreshApp();
            };
        }
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 30000);
    }
    
    // Refresh the app to apply updates
    async refreshApp() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                
                // Send message to service worker to skip waiting
                registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
                
                // Reload the page
                window.location.reload();
                
            } catch (error) {
                console.error('Error refreshing app:', error);
                window.location.reload();
            }
        } else {
            window.location.reload();
        }
    }
    
    // Update online/offline status
    updateOnlineStatus(isOnline) {
        // Create or update offline indicator
        let indicator = document.getElementById('offline-indicator');
        
        if (!isOnline) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'offline-indicator';
                indicator.className = 'offline-indicator';
                indicator.innerHTML = `
                    <span class="offline-icon">📡</span>
                    <span class="offline-text">You are offline. Some features may be limited.</span>
                `;
                document.body.appendChild(indicator);
            }
            indicator.classList.add('show');
            
            // Show toast notification
            this.showToast('You are offline. Some features may be limited.', 'warning');
            
        } else {
            if (indicator) {
                indicator.classList.remove('show');
                
                // Remove after animation
                setTimeout(() => {
                    if (indicator && indicator.classList.contains('show') === false) {
                        indicator.remove();
                    }
                }, 300);
            }
            
            // Show reconnected toast
            this.showToast('You are back online!', 'success');
        }
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.getElementById('pwa-toast');
        if (existingToast) existingToast.remove();
        
        // Create toast
        const toast = document.createElement('div');
        toast.id = 'pwa-toast';
        toast.className = `pwa-toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this.getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Add close handler
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            };
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
    
    getToastIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }
    
    // Track installation for analytics
    trackInstallation() {
        // In a real app, you would send this to your analytics
        console.log('PWA installation tracked');
        
        // Store installation timestamp
        localStorage.setItem('mpesewa_pwa_install_date', new Date().toISOString());
    }
}

// ===== SERVICE WORKER MANAGER =====
class ServiceWorkerManager {
    constructor() {
        this.registration = null;
        this.isSupported = 'serviceWorker' in navigator;
        this.isActive = false;
        
        this.init();
    }
    
    async init() {
        if (!this.isSupported) {
            console.log('Service Worker not supported');
            return;
        }
        
        await this.registerServiceWorker();
        this.setupEventListeners();
        this.checkCacheStatus();
    }
    
    // Register service worker
    async registerServiceWorker() {
        try {
            this.registration = await navigator.serviceWorker.register('service-worker.js', {
                scope: '/m-pesewa/'
            });
            
            console.log('Service Worker registered:', this.registration);
            this.isActive = true;
            
            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;
            
            // Send initial message
            this.sendMessage({ type: 'INIT', data: { version: '1.0.0' } });
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            this.isActive = false;
        }
    }
    
    // Setup service worker event listeners
    setupEventListeners() {
        if (!this.isSupported) return;
        
        // Service worker state changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker controller changed');
            this.isActive = !!navigator.serviceWorker.controller;
        });
        
        // Service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
            this.handleServiceWorkerMessage(event.data);
        });
    }
    
    // Handle messages from service worker
    handleServiceWorkerMessage(data) {
        switch (data.type) {
            case 'CACHE_STATUS':
                console.log('Cache status:', data.data);
                break;
                
            case 'UPDATE_AVAILABLE':
                console.log('Update available from Service Worker');
                // Trigger update notification
                if (window.pwaHandler) {
                    window.pwaHandler.showUpdateNotification();
                }
                break;
                
            case 'OFFLINE_READY':
                console.log('App is ready for offline use');
                if (window.pwaHandler) {
                    window.pwaHandler.showToast('App is ready for offline use', 'success');
                }
                break;
                
            case 'SYNC_COMPLETE':
                console.log('Background sync complete:', data.data);
                break;
        }
    }
    
    // Send message to service worker
    sendMessage(message) {
        if (!this.isActive || !this.registration) return;
        
        navigator.serviceWorker.controller?.postMessage(message);
    }
    
    // Check cache status
    async checkCacheStatus() {
        if (!this.isActive) return;
        
        this.sendMessage({ type: 'GET_CACHE_STATUS' });
    }
    
    // Clear all caches
    async clearCaches() {
        if (!this.isSupported) return;
        
        try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
            console.log('All caches cleared');
            
            // Reload service worker
            if (this.registration) {
                this.registration.unregister().then(() => {
                    window.location.reload();
                });
            }
            
        } catch (error) {
            console.error('Error clearing caches:', error);
        }
    }
    
    // Update service worker
    async updateServiceWorker() {
        if (!this.registration) return;
        
        try {
            await this.registration.update();
            console.log('Service Worker updated');
            
        } catch (error) {
            console.error('Error updating Service Worker:', error);
        }
    }
    
    // Get service worker registration
    getRegistration() {
        return this.registration;
    }
}

// ===== PUSH NOTIFICATION MANAGER =====
class PushNotificationManager {
    constructor() {
        this.permission = Notification.permission;
        this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
        this.registration = null;
        
        this.init();
    }
    
    async init() {
        if (!this.isSupported) {
            console.log('Push notifications not supported');
            return;
        }
        
        // Get service worker registration
        if (window.swManager) {
            this.registration = window.swManager.getRegistration();
        }
        
        this.setupEventListeners();
        this.updatePermissionUI();
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Listen for notification clicks
        self.addEventListener('notificationclick', (event) => {
            event.notification.close();
            
            // Handle notification click
            this.handleNotificationClick(event);
        });
    }
    
    // Request notification permission
    async requestPermission() {
        if (!this.isSupported) {
            console.log('Notifications not supported');
            return 'denied';
        }
        
        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            this.updatePermissionUI();
            
            if (permission === 'granted') {
                console.log('Notification permission granted');
                this.subscribeToPush();
                return 'granted';
            } else {
                console.log('Notification permission denied');
                return 'denied';
            }
            
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
        }
    }
    
    // Subscribe to push notifications
    async subscribeToPush() {
        if (!this.isSupported || !this.registration) {
            console.log('Push subscription not available');
            return;
        }
        
        try {
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.getPublicKey())
            });
            
            console.log('Push subscription successful:', subscription);
            this.saveSubscription(subscription);
            
        } catch (error) {
            console.error('Error subscribing to push:', error);
        }
    }
    
    // Show local notification
    async showNotification(title, options = {}) {
        if (!this.isSupported || this.permission !== 'granted') {
            console.log('Cannot show notification - permission not granted');
            return;
        }
        
        try {
            const notificationOptions = {
                icon: '/m-pesewa/assets/images/icons/icon-192x192.png',
                badge: '/m-pesewa/assets/images/icons/badge-72x72.png',
                ...options
            };
            
            if (this.registration) {
                this.registration.showNotification(title, notificationOptions);
            } else {
                new Notification(title, notificationOptions);
            }
            
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }
    
    // Handle notification click
    handleNotificationClick(event) {
        const url = event.notification.data?.url || '/m-pesewa/';
        
        // Open the app
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((windowClients) => {
                    // Check if there's already a window open
                    for (const client of windowClients) {
                        if (client.url.includes(url) && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    
                    // Open a new window
                    if (clients.openWindow) {
                        return clients.openWindow(url);
                    }
                })
        );
    }
    
    // Update permission UI
    updatePermissionUI() {
        const permissionBtn = document.getElementById('notification-permission-btn');
        if (!permissionBtn) return;
        
        switch (this.permission) {
            case 'granted':
                permissionBtn.innerHTML = '🔔 Notifications Enabled';
                permissionBtn.disabled = true;
                break;
                
            case 'denied':
                permissionBtn.innerHTML = '🔕 Notifications Blocked';
                permissionBtn.disabled = true;
                break;
                
            default:
                permissionBtn.innerHTML = '🔔 Enable Notifications';
                permissionBtn.disabled = false;
                permissionBtn.onclick = () => this.requestPermission();
        }
    }
    
    // Helper methods
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
    
    getPublicKey() {
        // In a real app, this would be your VAPID public key
        return 'BPzF6vQz7YJwQ8W4X4L8K3N9P2R1T5Y7U9I0O3P5Q2A4S6D8F0G2H4J6K8L0M2N4P6R8T0';
    }
    
    saveSubscription(subscription) {
        // In a real app, you would send this to your server
        localStorage.setItem('mpesewa_push_subscription', JSON.stringify(subscription));
        console.log('Push subscription saved locally');
    }
}

// ===== BACKGROUND SYNC MANAGER =====
class BackgroundSyncManager {
    constructor() {
        this.isSupported = 'serviceWorker' in navigator && 'SyncManager' in window;
        this.registration = null;
        
        this.init();
    }
    
    async init() {
        if (!this.isSupported) {
            console.log('Background Sync not supported');
            return;
        }
        
        // Get service worker registration
        if (window.swManager) {
            this.registration = window.swManager.getRegistration();
        }
    }
    
    // Register background sync
    async registerSync(tag, data = {}) {
        if (!this.isSupported || !this.registration) {
            console.log('Background Sync not available');
            return false;
        }
        
        try {
            // Check if permission is granted
            const permission = await navigator.permissions.query({
                name: 'periodic-background-sync'
            });
            
            if (permission.state !== 'granted') {
                console.log('Background Sync permission not granted');
                return false;
            }
            
            // Register sync
            await this.registration.sync.register(tag);
            console.log('Background Sync registered for tag:', tag);
            
            // Store data in IndexedDB or localStorage
            this.storeSyncData(tag, data);
            
            return true;
            
        } catch (error) {
            console.error('Error registering Background Sync:', error);
            return false;
        }
    }
    
    // Store sync data
    storeSyncData(tag, data) {
        const syncData = JSON.parse(localStorage.getItem('mpesewa_sync_data') || '{}');
        syncData[tag] = {
            data,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('mpesewa_sync_data', JSON.stringify(syncData));
    }
    
    // Get sync data
    getSyncData(tag) {
        const syncData = JSON.parse(localStorage.getItem('mpesewa_sync_data') || '{}');
        return syncData[tag] || null;
    }
    
    // Clear sync data
    clearSyncData(tag) {
        const syncData = JSON.parse(localStorage.getItem('mpesewa_sync_data') || '{}');
        delete syncData[tag];
        localStorage.setItem('mpesewa_sync_data', JSON.stringify(syncData));
    }
}

// ===== PWA MAIN INITIALIZATION =====
class MpesewaPWA {
    constructor() {
        this.installHandler = null;
        this.swManager = null;
        this.pushManager = null;
        this.syncManager = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        if (this.isInitialized) return;
        
        console.log('Initializing M-Pesewa PWA...');
        
        // Initialize handlers
        this.installHandler = new PWAInstallHandler();
        this.swManager = new ServiceWorkerManager();
        this.pushManager = new PushNotificationManager();
        this.syncManager = new BackgroundSyncManager();
        
        // Make handlers globally available
        window.pwaHandler = this.installHandler;
        window.swManager = this.swManager;
        window.pushManager = this.pushManager;
        window.syncManager = this.syncManager;
        
        // Set up periodic sync for cache updates (every 24 hours)
        if (this.syncManager.isSupported) {
            setTimeout(() => {
                this.syncManager.registerSync('update-cache');
            }, 60000); // Wait 1 minute before registering
        }
        
        // Check if app is running in standalone mode
        this.checkStandaloneMode();
        
        // Initialize offline capabilities
        this.initOfflineCapabilities();
        
        this.isInitialized = true;
        console.log('M-Pesewa PWA initialized');
    }
    
    // Check if app is running in standalone mode
    checkStandaloneMode() {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone;
        
        if (isStandalone) {
            document.body.classList.add('pwa-standalone');
            
            // Add standalone-specific behaviors
            this.addStandaloneBehaviors();
        }
    }
    
    // Add behaviors specific to standalone mode
    addStandaloneBehaviors() {
        // Hide browser UI elements
        const elementsToHide = document.querySelectorAll('.pwa-hidden');
        elementsToHide.forEach(el => {
            el.style.display = 'none';
        });
        
        // Add standalone class to body for CSS targeting
        document.body.classList.add('standalone-mode');
    }
    
    // Initialize offline capabilities
    initOfflineCapabilities() {
        // Create offline page if it doesn't exist
        this.createOfflinePage();
        
        // Add offline event listeners
        window.addEventListener('online', () => {
            this.handleOnline();
        });
        
        window.addEventListener('offline', () => {
            this.handleOffline();
        });
    }
    
    // Create offline page content
    createOfflinePage() {
        // This would create an offline.html page dynamically
        // For now, we'll just ensure the service worker handles offline
        console.log('Offline capabilities initialized');
    }
    
    // Handle when app comes online
    handleOnline() {
        console.log('App is online');
        
        // Sync any pending data
        if (this.syncManager.isSupported) {
            this.syncManager.registerSync('submit-form');
        }
        
        // Update cache
        if (this.swManager.isActive) {
            this.swManager.updateServiceWorker();
        }
    }
    
    // Handle when app goes offline
    handleOffline() {
        console.log('App is offline');
        
        // Show offline indicator
        if (this.installHandler) {
            this.installHandler.updateOnlineStatus(false);
        }
    }
    
    // Install app shortcut
    addShortcut(title, url, icon) {
        if (!this.installHandler || !this.installHandler.deferredPrompt) {
            return false;
        }
        
        // In a real PWA, shortcuts are defined in the manifest
        // This is just for demonstration
        console.log('Adding shortcut:', title, url);
        return true;
    }
    
    // Get PWA status
    getStatus() {
        return {
            installed: this.installHandler?.isInstalled || false,
            standalone: this.installHandler?.isStandalone || false,
            serviceWorker: this.swManager?.isActive || false,
            notifications: this.pushManager?.permission || 'default',
            backgroundSync: this.syncManager?.isSupported || false
        };
    }
}

// ===== GLOBAL PWA INITIALIZATION =====
// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on HTTPS or localhost (required for PWA)
    const isSecure = window.location.protocol === 'https:' || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
    
    if (!isSecure) {
        console.warn('PWA features may not work properly on non-HTTPS connections');
    }
    
    // Initialize PWA
    window.mpesewaPWA = new MpesewaPWA();
    
    // Add PWA status to window for debugging
    window.getPWAStatus = () => {
        return window.mpesewaPWA?.getStatus() || { error: 'PWA not initialized' };
    };
    
    // Add manual install trigger for testing
    window.triggerPWAInstall = () => {
        if (window.pwaHandler) {
            window.pwaHandler.promptInstallation();
        }
    };
});

// Export for module usage (if supported)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MpesewaPWA,
        PWAInstallHandler,
        ServiceWorkerManager,
        PushNotificationManager,
        BackgroundSyncManager
    };
}