/**
 * M-pesewa PWA Handler
 * Clean, production-ready PWA implementation
 */

class PWAHandler {
    constructor() {
        this.deferredPrompt = null;
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone;
        this.installPromptShown = false;
        
        this.init();
    }
    
    async init() {
        console.log('PWA Handler Initializing...');
        
        // Setup install prompt
        this.setupInstallPrompt();
        
        // Setup offline detection
        this.setupOfflineDetection();
        
        // Setup periodic sync
        await this.setupPeriodicSync();
        
        // Setup push notifications if supported
        await this.setupPushNotifications();
        
        console.log('PWA Handler Ready');
    }
    
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Show install button after delay
            setTimeout(() => this.showInstallButton(), 3000);
        });
        
        // Track if app was installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.deferredPrompt = null;
            this.hideInstallButton();
            this.trackInstallation();
        });
    }
    
    showInstallButton() {
        // Don't show if already installed or prompt was shown
        if (this.isStandalone || this.installPromptShown) return;
        
        // Check if install button already exists
        let installBtn = document.getElementById('pwa-install-btn');
        
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'pwa-install-btn';
            installBtn.innerHTML = `
                <i class="fas fa-download"></i>
                <span>Install App</span>
            `;
            
            installBtn.addEventListener('click', () => this.promptInstall());
            document.body.appendChild(installBtn);
        }
        
        // Show button with animation
        installBtn.style.display = 'flex';
        setTimeout(() => {
            installBtn.classList.add('show');
        }, 100);
        
        this.installPromptShown = true;
    }
    
    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.classList.remove('show');
            setTimeout(() => {
                installBtn.style.display = 'none';
            }, 300);
        }
    }
    
    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('Install prompt not available');
            return;
        }
        
        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`User response to install prompt: ${outcome}`);
            
            // Clear the saved prompt since it can't be used again
            this.deferredPrompt = null;
            
            // Hide the install button
            this.hideInstallButton();
        } catch (error) {
            console.error('Error showing install prompt:', error);
        }
    }
    
    setupOfflineDetection() {
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Initial status check
        this.updateOnlineStatus(navigator.onLine);
    }
    
    updateOnlineStatus(isOnline) {
        if (isOnline) {
            document.body.classList.remove('offline');
            document.body.classList.add('online');
            this.hideOfflineIndicator();
        } else {
            document.body.classList.remove('online');
            document.body.classList.add('offline');
            this.showOfflineIndicator();
        }
    }
    
    handleOnline() {
        console.log('App is online');
        this.updateOnlineStatus(true);
        
        // Sync any pending data
        this.syncPendingData();
    }
    
    handleOffline() {
        console.log('App is offline');
        this.updateOnlineStatus(false);
    }
    
    showOfflineIndicator() {
        // Remove existing indicator if any
        this.hideOfflineIndicator();
        
        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.className = 'offline-indicator';
        indicator.innerHTML = `
            <i class="fas fa-wifi-slash"></i>
            <span>You are offline. Working in limited mode.</span>
        `;
        
        document.body.appendChild(indicator);
        
        // Show with animation
        setTimeout(() => {
            indicator.classList.add('show');
        }, 100);
    }
    
    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.classList.remove('show');
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.remove();
                }
            }, 300);
        }
    }
    
    async setupPeriodicSync() {
        // Check if periodic sync is supported
        if ('periodicSync' in self.registration && 'periodicSync' in self.registration) {
            try {
                const status = await self.registration.periodicSync.getTags();
                if (!status.includes('update-content')) {
                    await self.registration.periodicSync.register('update-content', {
                        minInterval: 24 * 60 * 60 * 1000 // 24 hours
                    });
                    console.log('Periodic sync registered');
                }
            } catch (error) {
                console.log('Periodic sync not supported:', error);
            }
        }
    }
    
    async setupPushNotifications() {
        // Check if notifications are supported
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            console.log('Push notifications not supported');
            return;
        }
        
        // Request permission if not already granted/denied
        if (Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    await this.subscribeToPush();
                }
            } catch (error) {
                console.log('Notification permission error:', error);
            }
        } else if (Notification.permission === 'granted') {
            await this.subscribeToPush();
        }
    }
    
    async subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready;
            
            // Use VAPID public key (in production, this should be from your server)
            const vapidPublicKey = 'BLHkqX8Vq3tYz7wC6rT9uM2nP5sK1jF4';
            
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
            });
            
            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);
            
            console.log('Push subscription successful');
        } catch (error) {
            console.error('Push subscription failed:', error);
        }
    }
    
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        
        return outputArray;
    }
    
    async sendSubscriptionToServer(subscription) {
        // In a real app, you would send this to your backend
        // For demo purposes, store locally
        try {
            localStorage.setItem('pushSubscription', JSON.stringify(subscription));
            console.log('Push subscription saved locally');
        } catch (error) {
            console.error('Error saving push subscription:', error);
        }
    }
    
    async syncPendingData() {
        // Get pending data from IndexedDB or localStorage
        const pendingData = this.getPendingData();
        
        if (pendingData.length === 0) {
            return;
        }
        
        console.log(`Syncing ${pendingData.length} pending items`);
        
        try {
            // Simulate API calls for each pending item
            for (const data of pendingData) {
                await this.sendDataToServer(data);
            }
            
            // Clear pending data after successful sync
            this.clearPendingData();
            
            // Show success notification
            this.showNotification('Sync Complete', 'Your offline data has been synced');
        } catch (error) {
            console.error('Sync failed:', error);
            // Keep data for next sync attempt
        }
    }
    
    getPendingData() {
        try {
            return JSON.parse(localStorage.getItem('pendingData') || '[]');
        } catch (error) {
            console.error('Error getting pending data:', error);
            return [];
        }
    }
    
    clearPendingData() {
        try {
            localStorage.removeItem('pendingData');
        } catch (error) {
            console.error('Error clearing pending data:', error);
        }
    }
    
    async sendDataToServer(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Data sent to server:', data);
                resolve();
            }, 500);
        });
    }
    
    trackInstallation() {
        const analyticsData = {
            event: 'pwa_installed',
            timestamp: new Date().toISOString(),
            platform: navigator.platform,
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        try {
            // Store locally
            const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
            analytics.push(analyticsData);
            localStorage.setItem('analytics', JSON.stringify(analytics.slice(-100))); // Keep last 100 entries
            
            // Send to analytics server when online
            if (navigator.onLine) {
                this.sendAnalytics(analyticsData);
            }
        } catch (error) {
            console.error('Error tracking installation:', error);
        }
    }
    
    async sendAnalytics(data) {
        // Simulate sending analytics
        console.log('Analytics sent:', data);
    }
    
    showNotification(title, body) {
        // Check if notifications are supported and permission is granted
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }
        
        // Check if service worker is ready
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body: body,
                    icon: '/assets/images/icons/icon-192x192.png',
                    badge: '/assets/images/icons/badge-72x72.png',
                    tag: 'sync-notification',
                    silent: false
                });
            });
        } else {
            // Fallback to Web Notifications API
            new Notification(title, {
                body: body,
                icon: '/assets/images/icons/icon-192x192.png'
            });
        }
    }
    
    // Utility methods
    isPWAInstalled() {
        return this.isStandalone || 
               window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone;
    }
    
    getDisplayMode() {
        if (this.isStandalone) return 'standalone';
        if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
        if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
        if (window.matchMedia('(display-mode: browser)').matches) return 'browser';
        return 'browser';
    }
    
    // Add to homescreen for iOS
    showiOSInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS && !this.isPWAInstalled()) {
            const instructions = document.createElement('div');
            instructions.className = 'ios-install-instructions';
            instructions.innerHTML = `
                <div class="instructions-content">
                    <button class="close-instructions">&times;</button>
                    <h4>Install M-pesewa</h4>
                    <p>Tap <i class="fas fa-share"></i> then "Add to Home Screen"</p>
                    <div class="ios-steps">
                        <div class="step">
                            <i class="fas fa-share"></i>
                            <span>Tap Share</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-plus"></i>
                            <span>Add to Home Screen</span>
                        </div>
                    </div>
                </div>
            `;
            
            instructions.querySelector('.close-instructions').addEventListener('click', () => {
                instructions.remove();
            });
            
            document.body.appendChild(instructions);
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (instructions.parentNode) {
                    instructions.remove();
                }
            }, 10000);
        }
    }
}

// Initialize PWA handler
let pwaHandler = null;

document.addEventListener('DOMContentLoaded', () => {
    pwaHandler = new PWAHandler();
    
    // Check if running as PWA
    if (pwaHandler.isPWAInstalled()) {
        document.body.classList.add('pwa-mode');
        document.body.classList.add(`display-mode-${pwaHandler.getDisplayMode()}`);
        
        // Add standalone-specific behaviors
        if (pwaHandler.getDisplayMode() === 'standalone') {
            window.addEventListener('resize', handleStandaloneResize);
            handleStandaloneResize(); // Initial call
        }
    } else {
        // Show iOS install instructions if applicable
        setTimeout(() => {
            pwaHandler.showiOSInstallInstructions();
        }, 5000);
    }
});

function handleStandaloneResize() {
    // Handle safe areas for devices with notches
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Set CSS custom properties for safe areas
        document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top, 0px)');
        document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom, 0px)');
        document.documentElement.style.setProperty('--safe-area-left', 'env(safe-area-inset-left, 0px)');
        document.documentElement.style.setProperty('--safe-area-right', 'env(safe-area-inset-right, 0px)');
    }
}

// Service Worker message handling
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, data } = event.data;
        
        switch (type) {
            case 'UPDATE_AVAILABLE':
                showUpdateNotification(data);
                break;
                
            case 'SYNC_COMPLETED':
                if (pwaHandler) {
                    pwaHandler.showNotification('Sync Complete', data.message || 'Data synchronized');
                }
                break;
                
            case 'PUSH_RECEIVED':
                handlePushNotification(data);
                break;
                
            case 'OFFLINE_SAVE_SUCCESS':
                console.log('Data saved offline:', data);
                break;
        }
    });
}

function showUpdateNotification(data) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-sync-alt"></i>
            <div>
                <strong>Update Available</strong>
                <p>New version is ready. Refresh to update.</p>
            </div>
            <div class="update-actions">
                <button class="btn-update-now">Update Now</button>
                <button class="btn-update-later">Later</button>
            </div>
        </div>
    `;
    
    notification.querySelector('.btn-update-now').addEventListener('click', () => {
        // Tell service worker to skip waiting
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'SKIP_WAITING'
            });
        }
        
        // Reload the page
        window.location.reload();
    });
    
    notification.querySelector('.btn-update-later').addEventListener('click', () => {
        notification.remove();
    });
    
    document.body.appendChild(notification);
}

function handlePushNotification(data) {
    // Show notification to user
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(data.title || 'M-pesewa', {
            body: data.body || 'You have a new notification',
            icon: data.icon || '/assets/images/icons/icon-192x192.png',
            badge: '/assets/images/icons/badge-72x72.png',
            tag: data.tag || 'general',
            data: data.payload
        });
        
        notification.addEventListener('click', () => {
            // Handle notification click
            window.focus();
            
            if (data.url) {
                window.location.href = data.url;
            }
            
            notification.close();
        });
    }
}

// Export for use in other modules
window.PWAHandler = PWAHandler;