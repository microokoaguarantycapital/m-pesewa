// PWA Installation and Offline Handling - M-pesewa

class PWAHandler {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupOfflineDetection();
        this.setupBackgroundSync();
    }

    // Service Worker Registration
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered:', registration);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });

                // Check for controller change
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('Service Worker controller changed');
                });

            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // Install Prompt Handling
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Show install button
            this.showInstallBanner();
            
            // Log install prompt
            console.log('Before install prompt fired');
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA installed');
            this.deferredPrompt = null;
            
            // Hide install banner
            this.hideInstallBanner();
            
            // Track installation
            this.trackInstallation();
        });
    }

    // Install Methods
    async installApp() {
        if (!this.deferredPrompt) {
            console.log('No install prompt available');
            return;
        }

        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`User ${outcome} the install prompt`);
            
            if (outcome === 'accepted') {
                this.showNotification('M-pesewa installed successfully!', 'success');
            }
            
            this.deferredPrompt = null;
            this.hideInstallBanner();
            
        } catch (error) {
            console.error('Installation failed:', error);
            this.showNotification('Installation failed. Please try again.', 'error');
        }
    }

    showInstallBanner() {
        // Don't show if already installed or banner dismissed
        if (this.isAppInstalled() || this.isBannerDismissed()) {
            return;
        }

        const banner = document.getElementById('installBanner');
        if (banner) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 3000);
        } else {
            this.createInstallBanner();
        }
    }

    hideInstallBanner() {
        const banner = document.getElementById('installBanner');
        if (banner) {
            banner.classList.remove('show');
        }
        localStorage.setItem('installBannerDismissed', 'true');
    }

    createInstallBanner() {
        const banner = document.createElement('div');
        banner.id = 'installBanner';
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div class="install-content">
                <span>Install M-pesewa for faster access and offline use</span>
                <div class="install-buttons">
                    <button class="btn btn-sm" id="installButton">Install</button>
                    <button class="btn btn-sm btn-outline" id="dismissInstall">Not Now</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Add event listeners
        document.getElementById('installButton').addEventListener('click', () => this.installApp());
        document.getElementById('dismissInstall').addEventListener('click', () => this.hideInstallBanner());
        
        // Show after delay
        setTimeout(() => banner.classList.add('show'), 3000);
    }

    // Offline Detection
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.updateOnlineStatus(true);
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.updateOnlineStatus(false);
        });

        // Initial status
        this.updateOnlineStatus(navigator.onLine);
    }

    updateOnlineStatus(online) {
        const statusElement = document.getElementById('onlineStatus');
        
        if (online) {
            document.body.classList.remove('offline');
            document.body.classList.add('online');
            
            if (statusElement) {
                statusElement.textContent = 'Online';
                statusElement.className = 'badge badge-success';
            }
        } else {
            document.body.classList.remove('online');
            document.body.classList.add('offline');
            
            if (statusElement) {
                statusElement.textContent = 'Offline';
                statusElement.className = 'badge badge-warning';
            }
            
            this.showNotification('You are offline. Some features may be limited.', 'warning');
        }
    }

    // Background Sync
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                // Register sync events
                this.registerSyncEvents(registration.sync);
            });
        }
    }

    async registerSyncEvents(syncManager) {
        try {
            // Register sync tags
            await syncManager.register('sync-loans');
            await syncManager.register('sync-repayments');
            await syncManager.register('sync-groups');
            
            console.log('Background sync registered');
        } catch (error) {
            console.error('Background sync registration failed:', error);
        }
    }

    async triggerBackgroundSync(tag) {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register(tag);
                console.log(`Background sync triggered: ${tag}`);
            } catch (error) {
                console.error(`Background sync failed for ${tag}:`, error);
            }
        }
    }

    // Offline Data Management
    async syncOfflineData() {
        const offlineData = JSON.parse(localStorage.getItem('offline_data') || '[]');
        
        if (offlineData.length === 0) return;
        
        this.showNotification('Syncing offline data...', 'info');
        
        for (const data of offlineData) {
            try {
                await this.syncDataItem(data);
                offlineData.splice(offlineData.indexOf(data), 1);
            } catch (error) {
                console.error('Failed to sync data item:', error);
            }
        }
        
        localStorage.setItem('offline_data', JSON.stringify(offlineData));
        
        if (offlineData.length === 0) {
            this.showNotification('All data synced successfully!', 'success');
        } else {
            this.showNotification(`Failed to sync ${offlineData.length} items`, 'warning');
        }
    }

    async syncDataItem(data) {
        // Implement based on data type
        switch (data.type) {
            case 'loan_request':
                return this.syncLoanRequest(data);
            case 'repayment':
                return this.syncRepayment(data);
            case 'group_join':
                return this.syncGroupJoin(data);
            default:
                throw new Error(`Unknown data type: ${data.type}`);
        }
    }

    async syncLoanRequest(data) {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Synced loan request:', data);
                resolve();
            }, 500);
        });
    }

    // Storage Management
    manageStorage() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(estimate => {
                const used = estimate.usage;
                const quota = estimate.quota;
                const percentage = (used / quota) * 100;
                
                console.log(`Storage used: ${this.formatBytes(used)} / ${this.formatBytes(quota)} (${percentage.toFixed(2)}%)`);
                
                if (percentage > 80) {
                    this.cleanupOldData();
                }
            });
        }
    }

    cleanupOldData() {
        const cacheNames = ['mpesewa-static', 'mpesewa-dynamic'];
        
        caches.keys().then(names => {
            names.forEach(name => {
                if (cacheNames.includes(name)) {
                    caches.delete(name);
                    console.log(`Cleared cache: ${name}`);
                }
            });
        });
        
        // Clear old localStorage data
        const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const itemsToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('offline_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp && data.timestamp < oneMonthAgo) {
                        itemsToRemove.push(key);
                    }
                } catch (error) {
                    // Skip invalid JSON
                }
            }
        }
        
        itemsToRemove.forEach(key => localStorage.removeItem(key));
    }

    // Update Notification
    showUpdateNotification() {
        if (confirm('A new version of M-pesewa is available. Update now?')) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.update();
                });
            }
            window.location.reload();
        }
    }

    // Utility Methods
    isAppInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }

    isBannerDismissed() {
        return localStorage.getItem('installBannerDismissed') === 'true';
    }

    trackInstallation() {
        // Track installation for analytics
        const installData = {
            timestamp: new Date().toISOString(),
            platform: navigator.platform,
            userAgent: navigator.userAgent
        };
        
        localStorage.setItem('app_installation', JSON.stringify(installData));
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        // Use app's notification system
        if (window.app?.showNotification) {
            window.app.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // API for other modules
    saveOfflineAction(type, data) {
        const offlineData = JSON.parse(localStorage.getItem('offline_data') || '[]');
        
        const action = {
            type,
            data,
            timestamp: Date.now(),
            id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        offlineData.push(action);
        localStorage.setItem('offline_data', JSON.stringify(offlineData));
        
        // Trigger background sync
        this.triggerBackgroundSync(`sync-${type}s`);
        
        return action.id;
    }

    // Check if feature is available
    isFeatureAvailable(feature) {
        switch (feature) {
            case 'background-sync':
                return 'serviceWorker' in navigator && 'SyncManager' in window;
            case 'push-notifications':
                return 'Notification' in window && 'serviceWorker' in navigator;
            case 'storage':
                return 'storage' in navigator && 'estimate' in navigator.storage;
            case 'install':
                return !!this.deferredPrompt;
            default:
                return false;
        }
    }

    // Get PWA capabilities
    getCapabilities() {
        return {
            installable: !!this.deferredPrompt,
            offline: 'serviceWorker' in navigator,
            backgroundSync: this.isFeatureAvailable('background-sync'),
            pushNotifications: this.isFeatureAvailable('push-notifications'),
            storageEstimate: this.isFeatureAvailable('storage')
        };
    }
}

// Initialize PWA handler
const pwa = new PWAHandler();

// Make available globally
window.pwa = pwa;

// Global PWA functions
function installApp() {
    pwa.installApp();
}

function dismissInstallBanner() {
    pwa.hideInstallBanner();
}

// Check PWA features on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('PWA Capabilities:', pwa.getCapabilities());
    
    // Show install banner if appropriate
    setTimeout(() => {
        pwa.showInstallBanner();
    }, 1000);
    
    // Manage storage
    pwa.manageStorage();
});

// Export for modules
export { pwa };