'use strict';

// PWA functionality for M-Pesewa
class PWAHandler {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isOnline = true;
        this.init();
    }

    init() {
        this.checkInstallStatus();
        this.setupInstallPrompt();
        this.setupOnlineStatus();
        this.setupServiceWorker();
        this.renderPWAButtons();
        this.setupEventListeners();
    }

    checkInstallStatus() {
        // Check if app is running in standalone mode (installed)
        this.isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone === true;
        
        // Check localStorage for installation status
        if (localStorage.getItem('pwaInstalled')) {
            this.isInstalled = true;
        }
    }

    setupInstallPrompt() {
        // Capture the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Update UI to show install button
            this.showInstallButton();
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.onAppInstalled();
        });
    }

    setupOnlineStatus() {
        // Check initial online status
        this.isOnline = navigator.onLine;
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.onOnline();
        });
        
        window.addEventListener('offline', () => {
            this.onOffline();
        });
        
        // Update UI
        this.updateOnlineStatus();
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Register service worker
            window.addEventListener('load', () => {
                this.registerServiceWorker();
            });
        }
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('../service-worker.js');
            console.log('ServiceWorker registration successful:', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('ServiceWorker update found:', newWorker);
            });
            
        } catch (error) {
            console.error('ServiceWorker registration failed:', error);
        }
    }

    renderPWAButtons() {
        // Only show install button if not already installed and prompt is available
        if (!this.isInstalled && this.deferredPrompt) {
            this.showInstallButton();
        }
        
        // Always show offline indicator if needed
        this.updateOnlineStatus();
    }

    showInstallButton() {
        // Check if install button already exists
        if (document.getElementById('pwa-install-button')) {
            return;
        }
        
        // Create install button
        const installButton = document.createElement('button');
        installButton.id = 'pwa-install-button';
        installButton.className = 'btn btn-primary pwa-install-btn';
        installButton.innerHTML = `
            <span class="pwa-icon">📱</span>
            <span class="pwa-text">Install App</span>
        `;
        installButton.addEventListener('click', () => this.promptInstall());
        
        // Add to page - look for appropriate container
        const headerActions = document.querySelector('.header-actions');
        const mainNav = document.querySelector('nav');
        const mainHeader = document.querySelector('header');
        
        if (headerActions) {
            headerActions.appendChild(installButton);
        } else if (mainNav) {
            mainNav.appendChild(installButton);
        } else if (mainHeader) {
            mainHeader.appendChild(installButton);
        } else {
            // Add to body as floating button
            installButton.className += ' pwa-install-floating';
            document.body.appendChild(installButton);
        }
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (installButton && !this.isInstalled) {
                installButton.classList.add('pwa-install-hiding');
                setTimeout(() => {
                    if (installButton && !this.isInstalled) {
                        installButton.remove();
                    }
                }, 1000);
            }
        }, 30000);
    }

    promptInstall() {
        if (!this.deferredPrompt) {
            this.showNotification('Installation not available', 'warning');
            return;
        }
        
        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                this.onAppInstalled();
            } else {
                console.log('User dismissed the install prompt');
                this.showNotification('Installation cancelled', 'info');
            }
            
            // Clear the deferredPrompt variable
            this.deferredPrompt = null;
            
            // Hide install button
            const installButton = document.getElementById('pwa-install-button');
            if (installButton) {
                installButton.remove();
            }
        });
    }

    onAppInstalled() {
        this.isInstalled = true;
        localStorage.setItem('pwaInstalled', 'true');
        
        // Hide install button
        const installButton = document.getElementById('pwa-install-button');
        if (installButton) {
            installButton.remove();
        }
        
        // Show success message
        this.showNotification('M-Pesewa installed successfully!', 'success');
        
        // Track installation in analytics (if available)
        this.trackInstallation();
    }

    onOnline() {
        this.isOnline = true;
        this.updateOnlineStatus();
        this.showNotification('You are back online', 'success');
        
        // Sync any pending data
        this.syncPendingData();
    }

    onOffline() {
        this.isOnline = false;
        this.updateOnlineStatus();
        this.showNotification('You are offline. Some features may be limited.', 'warning');
    }

    updateOnlineStatus() {
        // Update online status indicator
        const onlineIndicator = document.getElementById('online-status');
        
        if (onlineIndicator) {
            if (this.isOnline) {
                onlineIndicator.className = 'online-status online';
                onlineIndicator.innerHTML = '🟢 Online';
                onlineIndicator.title = 'You are online';
            } else {
                onlineIndicator.className = 'online-status offline';
                onlineIndicator.innerHTML = '🔴 Offline';
                onlineIndicator.title = 'You are offline';
            }
        } else if (!this.isOnline) {
            // Create offline indicator if it doesn't exist
            this.createOfflineIndicator();
        }
    }

    createOfflineIndicator() {
        if (document.getElementById('offline-indicator')) {
            return;
        }
        
        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.className = 'offline-indicator';
        indicator.innerHTML = `
            <div class="offline-content">
                <span class="offline-icon">🔴</span>
                <span class="offline-text">You are offline</span>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Add CSS if not already added
        if (!document.querySelector('#offline-indicator-style')) {
            const style = document.createElement('style');
            style.id = 'offline-indicator-style';
            style.textContent = `
                .offline-indicator {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--alert-red);
                    color: white;
                    padding: 10px 20px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    z-index: 9999;
                    animation: slideUp 0.3s ease;
                }
                
                .offline-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .offline-icon {
                    font-size: 1.2em;
                }
                
                .offline-text {
                    font-weight: 600;
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateX(-50%) translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove when back online
        if (this.isOnline) {
            indicator.remove();
        }
    }

    syncPendingData() {
        // Check for pending form submissions or data
        const pendingData = localStorage.getItem('pendingSubmissions');
        
        if (pendingData) {
            try {
                const submissions = JSON.parse(pendingData);
                console.log('Syncing pending submissions:', submissions.length);
                
                // In a real app, this would send data to server
                // For now, just clear and notify
                localStorage.removeItem('pendingSubmissions');
                
                this.showNotification(`${submissions.length} pending items synced`, 'success');
            } catch (error) {
                console.error('Failed to sync pending data:', error);
            }
        }
    }

    setupEventListeners() {
        // Listen for messages from service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                this.handleServiceWorkerMessage(event.data);
            });
        }
        
        // Add beforeunload listener to save state
        window.addEventListener('beforeunload', () => {
            this.saveAppState();
        });
        
        // Add visibility change listener
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.onAppVisible();
            }
        });
    }

    handleServiceWorkerMessage(message) {
        switch (message.type) {
            case 'UPDATE_AVAILABLE':
                this.showUpdateNotification(message.payload);
                break;
                
            case 'SYNC_COMPLETED':
                this.showNotification('Data synced successfully', 'success');
                break;
                
            case 'PUSH_NOTIFICATION':
                this.handlePushNotification(message.payload);
                break;
        }
    }

    showUpdateNotification(updateInfo) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-info';
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">Update Available</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="notification-content">
                <p>A new version of M-Pesewa is available.</p>
                <button class="btn btn-sm btn-primary mt-2" onclick="pwaHandler.updateApp()">
                    Update Now
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
    }

    updateApp() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.update();
                this.showNotification('Updating app...', 'info');
            });
        }
    }

    handlePushNotification(payload) {
        // Check if we have Notification API permission
        if (!('Notification' in window)) {
            return;
        }
        
        if (Notification.permission === 'granted') {
            this.showPushNotification(payload);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    this.showPushNotification(payload);
                }
            });
        }
    }

    showPushNotification(payload) {
        const options = {
            body: payload.body,
            icon: '../assets/images/icons/icon-192x192.png',
            badge: '../assets/images/icons/icon-72x72.png',
            tag: payload.tag || 'mpesewa-notification',
            data: payload.data || {},
            actions: payload.actions || []
        };
        
        const notification = new Notification(payload.title || 'M-Pesewa', options);
        
        notification.addEventListener('click', () => {
            window.focus();
            notification.close();
            
            // Handle notification click
            if (payload.data && payload.data.url) {
                window.location.href = payload.data.url;
            }
        });
    }

    saveAppState() {
        // Save current page state
        const state = {
            url: window.location.href,
            timestamp: Date.now(),
            user: localStorage.getItem('userId')
        };
        
        localStorage.setItem('appState', JSON.stringify(state));
    }

    onAppVisible() {
        // Check for updates when app becomes visible
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.update();
            });
        }
        
        // Sync data
        if (this.isOnline) {
            this.syncPendingData();
        }
    }

    trackInstallation() {
        // Send installation event to analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'install', {
                'event_category': 'pwa',
                'event_label': 'app_installed'
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="notification-content">${message}</div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Method to check if app is installed
    isAppInstalled() {
        return this.isInstalled;
    }

    // Method to check if online
    isAppOnline() {
        return this.isOnline;
    }

    // Method to get storage usage
    async getStorageUsage() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                used: estimate.usage,
                quota: estimate.quota,
                percentage: (estimate.usage / estimate.quota * 100).toFixed(1)
            };
        }
        return null;
    }

    // Method to clear app cache
    async clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            this.showNotification('Cache cleared successfully', 'success');
            return true;
        }
        return false;
    }

    // Method to request notification permission
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        
        if (Notification.permission === 'granted') {
            return 'granted';
        }
        
        if (Notification.permission === 'denied') {
            return 'denied';
        }
        
        const permission = await Notification.requestPermission();
        return permission;
    }
}

// Initialize PWA handler
const pwaHandler = new PWAHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pwaHandler;
}