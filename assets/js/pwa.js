// assets/js/pwa.js - Install & offline handling

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.setupBeforeInstallPrompt();
        this.checkInstallStatus();
        this.setupOfflineUI();
        this.registerServiceWorker();
    }

    setupBeforeInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            window.deferredPrompt = e;
            
            // Update UI to show install button
            this.showInstallPrompt();
        });
    }

    setupInstallPrompt() {
        // Handle install button click
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.installPWA();
            });
        }

        // Handle dismiss button
        const dismissBtn = document.getElementById('dismissInstall');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                this.dismissInstallPrompt();
            });
        }
    }

    showInstallPrompt() {
        // Check if already installed
        if (this.isStandalone() || localStorage.getItem('installPromptDismissed')) {
            return;
        }

        // Show install prompt after a delay
        setTimeout(() => {
            const prompt = document.getElementById('installPrompt');
            if (prompt) {
                prompt.style.display = 'block';
                prompt.classList.add('slide-in-up');
            }
        }, 3000);
    }

    installPWA() {
        if (!this.deferredPrompt) {
            console.warn('No install prompt available');
            return;
        }

        this.deferredPrompt.prompt();
        
        this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                this.onInstallSuccess();
            } else {
                console.log('User dismissed the install prompt');
            }
            
            this.deferredPrompt = null;
            window.deferredPrompt = null;
            
            // Hide the install prompt
            this.dismissInstallPrompt();
        });
    }

    dismissInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.style.display = 'none';
            localStorage.setItem('installPromptDismissed', 'true');
        }
    }

    onInstallSuccess() {
        // Update UI to show installed state
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.textContent = '✓ Installed';
            installBtn.disabled = true;
        }

        // Show success message
        if (typeof app !== 'undefined' && app.showNotification) {
            app.showNotification('App installed successfully! You can now use it offline.', 'success');
        }
    }

    checkInstallStatus() {
        // Check if app is running in standalone mode
        if (this.isStandalone()) {
            console.log('App is running in standalone mode');
            this.hideInstallPrompt();
        }

        // Check for updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update();
            });
        }
    }

    isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://');
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.style.display = 'none';
        }
    }

    setupOfflineUI() {
        // Create offline indicator
        this.createOfflineIndicator();
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.updateOnlineStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.updateOnlineStatus(false);
        });
        
        // Initial status check
        this.updateOnlineStatus(navigator.onLine);
    }

    createOfflineIndicator() {
        // Create offline status bar
        const offlineBar = document.createElement('div');
        offlineBar.id = 'offline-indicator';
        offlineBar.className = 'offline-bar';
        offlineBar.innerHTML = `
            <div class="offline-content">
                <span class="offline-icon">📶</span>
                <span class="offline-message">You are offline. Some features may be limited.</span>
                <button class="offline-dismiss" onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .offline-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #f59e0b;
                color: #000;
                padding: 12px;
                text-align: center;
                z-index: 2000;
                display: none;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            }
            .offline-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .offline-icon {
                font-size: 1.2rem;
            }
            .offline-message {
                flex: 1;
                font-weight: 500;
            }
            .offline-dismiss {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0 8px;
                color: #000;
            }
            @media (max-width: 768px) {
                .offline-content {
                    flex-direction: column;
                    gap: 4px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(offlineBar);
    }

    updateOnlineStatus(isOnline) {
        const offlineBar = document.getElementById('offline-indicator');
        if (!offlineBar) return;
        
        if (isOnline) {
            offlineBar.style.display = 'none';
            
            // Show reconnection message
            if (typeof app !== 'undefined' && app.showNotification) {
                app.showNotification('You are back online', 'success');
            }
        } else {
            offlineBar.style.display = 'block';
            
            // Show offline warning
            if (typeof app !== 'undefined' && app.showNotification) {
                app.showNotification('You are offline. Some features may be limited.', 'warning');
            }
        }
    }

    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service workers are not supported');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registered with scope:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('New service worker found:', newWorker);
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New update available
                        this.showUpdatePrompt();
                    }
                });
            });
            
            // Check if page was loaded via service worker
            if (navigator.serviceWorker.controller) {
                console.log('Page is controlled by service worker');
            }
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    showUpdatePrompt() {
        // Create update prompt
        const updatePrompt = document.createElement('div');
        updatePrompt.id = 'update-prompt';
        updatePrompt.className = 'update-prompt';
        updatePrompt.innerHTML = `
            <div class="update-content">
                <span class="update-icon">🔄</span>
                <span class="update-message">A new version is available!</span>
                <div class="update-actions">
                    <button class="btn btn-primary small" onclick="pwaManager.updateApp()">
                        Update Now
                    </button>
                    <button class="btn btn-secondary small" onclick="pwaManager.dismissUpdate()">
                        Later
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .update-prompt {
                position: fixed;
                bottom: 70px;
                right: 20px;
                background: var(--neutral-white);
                border: 2px solid var(--primary-purple);
                border-radius: var(--radius-lg);
                padding: var(--spacing-lg);
                box-shadow: var(--shadow-xl);
                z-index: 2000;
                min-width: 300px;
                animation: slideInUp 0.3s ease;
            }
            .update-content {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
                align-items: center;
            }
            .update-icon {
                font-size: 2rem;
            }
            .update-message {
                font-weight: 600;
                color: var(--primary-purple);
                text-align: center;
            }
            .update-actions {
                display: flex;
                gap: var(--spacing-sm);
                width: 100%;
            }
            .update-actions .btn {
                flex: 1;
            }
            @media (max-width: 768px) {
                .update-prompt {
                    left: 20px;
                    right: 20px;
                    bottom: 20px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(updatePrompt);
    }

    updateApp() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update().then(() => {
                    // Force reload to activate new service worker
                    window.location.reload();
                });
            });
        }
    }

    dismissUpdate() {
        const updatePrompt = document.getElementById('update-prompt');
        if (updatePrompt) {
            updatePrompt.remove();
        }
    }

    // Cache management
    async clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('All caches cleared');
            
            if (typeof app !== 'undefined' && app.showNotification) {
                app.showNotification('Cache cleared successfully', 'success');
            }
        }
    }

    async getCacheStats() {
        if (!('caches' in window)) {
            return null;
        }
        
        const cacheNames = await caches.keys();
        const stats = {};
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            stats[cacheName] = {
                size: requests.length,
                urls: requests.map(req => req.url)
            };
        }
        
        return stats;
    }

    // Background sync
    setupBackgroundSync() {
        if ('sync' in navigator.serviceWorker) {
            navigator.serviceWorker.ready.then(registration => {
                // Register for sync
                registration.sync.register('sync-form-data')
                    .then(() => {
                        console.log('Background sync registered');
                    })
                    .catch(error => {
                        console.error('Background sync registration failed:', error);
                    });
            });
        }
    }

    // Push notifications
    async setupPushNotifications() {
        if (!('Notification' in window) || !('PushManager' in window)) {
            console.warn('Push notifications are not supported');
            return;
        }

        // Request permission
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            console.log('Push notification permission granted');
            await this.subscribeToPush();
        }
    }

    async subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY_HERE')
            });
            
            console.log('Push subscription successful:', subscription);
            // Send subscription to your server
            await this.sendSubscriptionToServer(subscription);
            
        } catch (error) {
            console.error('Push subscription failed:', error);
        }
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

    async sendSubscriptionToServer(subscription) {
        // Send subscription to your backend server
        // This is where you'd make an API call
        console.log('Sending subscription to server:', subscription);
    }

    // File system access (for PWA file handling)
    async setupFileHandlers() {
        if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
            // Handle file launches
            launchQueue.setConsumer(async (launchParams) => {
                if (!launchParams.files.length) {
                    return;
                }
                
                for (const fileHandle of launchParams.files) {
                    const file = await fileHandle.getFile();
                    // Handle the file
                    console.log('File opened:', file.name);
                }
            });
        }
    }

    // Install metrics
    trackInstallEvent() {
        // Track install events for analytics
        const isFirstVisit = !localStorage.getItem('appInstalled');
        
        if (isFirstVisit && this.isStandalone()) {
            localStorage.setItem('appInstalled', 'true');
            console.log('App installed for first time');
            
            // Send to analytics
            this.sendAnalyticsEvent('app_installed');
        }
    }

    sendAnalyticsEvent(eventName, data = {}) {
        // Send analytics event
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            ...data
        };
        
        console.log('Analytics event:', eventData);
        
        // In production, send to your analytics service
        // Example: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(eventData) });
    }
}

// Initialize PWA Manager
const pwaManager = new PWAManager();
window.pwaManager = pwaManager;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PWAManager };
}