// features/pwa-flow.js
// PWA-specific features: install prompts, update, offline handling

class PWAFlow {
    constructor() {
        this.deferredPrompt = null;
        this.updateAvailable = false;
        this.registration = null;
        this.isInstalled = false;
        this.isOnline = navigator.onLine;
        this.offlineQueue = [];
        this.init();
    }

    init() {
        // Check if app is installed
        this.checkInstallStatus();
        
        // Set up install prompt
        this.setupInstallPrompt();
        
        // Set up update detection
        this.setupUpdateDetection();
        
        // Set up online/offline detection
        this.setupConnectivityDetection();
        
        // Set up offline queue processing
        this.setupOfflineQueue();
        
        // Register service worker
        this.registerServiceWorker();
    }

    // Check if app is installed
    checkInstallStatus() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('App is installed as PWA');
        }
        
        // Check for iOS standalone mode
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('App is installed on iOS');
        }
    }

    // Set up install prompt
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Show install button or banner
            this.showInstallBanner();
            
            console.log('Install prompt available');
        });
    }

    // Show install banner
    showInstallBanner() {
        // Check if we should show the banner (not shown if already installed)
        if (this.isInstalled || localStorage.getItem('pwa_install_dismissed')) {
            return;
        }
        
        // Create install banner
        const banner = document.createElement('div');
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="install-banner-content">
                <div class="install-icon">📱</div>
                <div class="install-text">
                    <strong>Install M-Pesewa</strong>
                    <p>Get the app experience. Install to your home screen for quick access.</p>
                </div>
                <div class="install-actions">
                    <button class="btn-install-primary">Install</button>
                    <button class="btn-install-secondary">Not Now</button>
                </div>
                <button class="install-close" aria-label="Close">&times;</button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(banner);
        
        // Add event listeners
        banner.querySelector('.btn-install-primary').addEventListener('click', () => {
            this.promptInstall();
            this.closeInstallBanner(banner);
        });
        
        banner.querySelector('.btn-install-secondary').addEventListener('click', () => {
            this.closeInstallBanner(banner);
        });
        
        banner.querySelector('.install-close').addEventListener('click', () => {
            this.closeInstallBanner(banner);
        });
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (document.body.contains(banner)) {
                this.closeInstallBanner(banner);
            }
        }, 10000);
    }

    // Prompt installation
    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('No install prompt available');
            return;
        }
        
        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const choiceResult = await this.deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                this.isInstalled = true;
                
                // Track installation
                this.trackInstallation();
                
                // Show success message
                this.showInstallSuccess();
            } else {
                console.log('User dismissed the install prompt');
            }
            
            // Clear the deferred prompt
            this.deferredPrompt = null;
        } catch (error) {
            console.error('Install prompt failed:', error);
        }
    }

    // Show installation success
    showInstallSuccess() {
        const toast = document.createElement('div');
        toast.className = 'pwa-install-success';
        toast.innerHTML = `
            <div class="install-success-content">
                <div class="success-icon">✅</div>
                <div class="success-text">
                    <strong>M-Pesewa Installed!</strong>
                    <p>App has been added to your home screen.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.classList.add('fade-out');
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }
        }, 3000);
    }

    // Close install banner
    closeInstallBanner(banner) {
        localStorage.setItem('pwa_install_dismissed', 'true');
        banner.classList.add('closing');
        setTimeout(() => {
            if (document.body.contains(banner)) {
                document.body.removeChild(banner);
            }
        }, 300);
    }

    // Track installation
    trackInstallation() {
        const installData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            isStandalone: this.isInstalled
        };
        
        localStorage.setItem('pwa_install_data', JSON.stringify(installData));
        
        // Emit installation event
        const event = new CustomEvent('pwa-installed', {
            detail: installData
        });
        window.dispatchEvent(event);
    }

    // Set up update detection
    setupUpdateDetection() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('New service worker controlling the page');
                this.showUpdateAvailable();
            });
        }
    }

    // Show update available banner
    showUpdateAvailable() {
        if (this.updateAvailable) return;
        
        this.updateAvailable = true;
        
        const banner = document.createElement('div');
        banner.className = 'pwa-update-banner';
        banner.innerHTML = `
            <div class="update-banner-content">
                <div class="update-icon">🔄</div>
                <div class="update-text">
                    <strong>Update Available</strong>
                    <p>A new version of M-Pesewa is available.</p>
                </div>
                <div class="update-actions">
                    <button class="btn-update-primary">Update Now</button>
                    <button class="btn-update-secondary">Later</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        banner.querySelector('.btn-update-primary').addEventListener('click', () => {
            this.applyUpdate();
            this.closeUpdateBanner(banner);
        });
        
        banner.querySelector('.btn-update-secondary').addEventListener('click', () => {
            this.closeUpdateBanner(banner);
        });
    }

    // Apply update
    applyUpdate() {
        if (this.registration && this.registration.waiting) {
            // Tell the waiting service worker to take control
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            // Reload the page
            window.location.reload();
        } else {
            // Fallback reload
            window.location.reload();
        }
    }

    // Close update banner
    closeUpdateBanner(banner) {
        banner.classList.add('closing');
        setTimeout(() => {
            if (document.body.contains(banner)) {
                document.body.removeChild(banner);
            }
        }, 300);
    }

    // Set up connectivity detection
    setupConnectivityDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleOnline();
            this.showOnlineStatus();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleOffline();
            this.showOfflineStatus();
        });
    }

    // Handle online status
    handleOnline() {
        console.log('App is online');
        
        // Process offline queue
        this.processOfflineQueue();
        
        // Sync data if needed
        this.syncData();
        
        // Emit online event
        const event = new CustomEvent('app-online');
        window.dispatchEvent(event);
    }

    // Handle offline status
    handleOffline() {
        console.log('App is offline');
        
        // Show offline UI
        this.showOfflineUI();
        
        // Emit offline event
        const event = new CustomEvent('app-offline');
        window.dispatchEvent(event);
    }

    // Show online status indicator
    showOnlineStatus() {
        this.showStatusIndicator('online', 'Back online');
    }

    // Show offline status indicator
    showOfflineStatus() {
        this.showStatusIndicator('offline', 'You are offline');
    }

    // Show status indicator
    showStatusIndicator(status, message) {
        // Remove existing indicator
        const existing = document.querySelector('.status-indicator');
        if (existing) {
            existing.remove();
        }
        
        const indicator = document.createElement('div');
        indicator.className = `status-indicator status-${status}`;
        indicator.innerHTML = `
            <div class="status-content">
                <span class="status-icon">${status === 'online' ? '✅' : '⚠️'}</span>
                <span class="status-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (document.body.contains(indicator)) {
                indicator.classList.add('fade-out');
                setTimeout(() => {
                    if (document.body.contains(indicator)) {
                        document.body.removeChild(indicator);
                    }
                }, 300);
            }
        }, 3000);
    }

    // Show offline UI
    showOfflineUI() {
        // You can add offline-specific UI here
        console.log('Showing offline UI');
    }

    // Set up offline queue
    setupOfflineQueue() {
        // Load existing queue
        const storedQueue = localStorage.getItem('pwa_offline_queue');
        if (storedQueue) {
            this.offlineQueue = JSON.parse(storedQueue);
        }
        
        // Set up periodic queue processing
        setInterval(() => {
            if (this.isOnline && this.offlineQueue.length > 0) {
                this.processOfflineQueue();
            }
        }, 30000); // Check every 30 seconds
    }

    // Add to offline queue
    addToOfflineQueue(action, data) {
        const queueItem = {
            id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            action,
            data,
            timestamp: new Date().toISOString(),
            retryCount: 0
        };
        
        this.offlineQueue.push(queueItem);
        this.saveOfflineQueue();
        
        console.log('Added to offline queue:', queueItem);
        
        return queueItem;
    }

    // Process offline queue
    async processOfflineQueue() {
        if (this.offlineQueue.length === 0 || !this.isOnline) {
            return;
        }
        
        console.log('Processing offline queue:', this.offlineQueue.length, 'items');
        
        // Process items in order
        for (let i = 0; i < this.offlineQueue.length; i++) {
            const item = this.offlineQueue[i];
            
            try {
                // Process based on action type
                const success = await this.processQueueItem(item);
                
                if (success) {
                    // Remove from queue
                    this.offlineQueue.splice(i, 1);
                    i--; // Adjust index after removal
                } else {
                    // Increment retry count
                    item.retryCount++;
                    
                    // Remove if too many retries
                    if (item.retryCount > 5) {
                        this.offlineQueue.splice(i, 1);
                        i--;
                        console.log('Removing item after too many retries:', item.id);
                    }
                }
            } catch (error) {
                console.error('Error processing queue item:', error);
                item.retryCount++;
            }
        }
        
        this.saveOfflineQueue();
    }

    // Process individual queue item
    async processQueueItem(item) {
        // This is a simplified version - in a real app, you would make API calls
        console.log('Processing queue item:', item);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we'll assume success
        return true;
    }

    // Save offline queue to localStorage
    saveOfflineQueue() {
        localStorage.setItem('pwa_offline_queue', JSON.stringify(this.offlineQueue));
    }

    // Register service worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.register('/service-worker.js', {
                    scope: '/'
                });
                
                console.log('Service Worker registered:', this.registration);
                
                // Check for updates
                await this.checkForUpdates();
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // Check for updates
    async checkForUpdates() {
        if (!this.registration) return;
        
        try {
            await this.registration.update();
            console.log('Service Worker update check completed');
        } catch (error) {
            console.error('Update check failed:', error);
        }
    }

    // Sync data when coming online
    async syncData() {
        // Sync user data
        await this.syncUserData();
        
        // Sync ledger data
        await this.syncLedgerData();
        
        // Sync group data
        await this.syncGroupData();
        
        console.log('Data sync completed');
    }

    // Sync user data
    async syncUserData() {
        // Implementation would depend on your backend
        console.log('Syncing user data...');
    }

    // Sync ledger data
    async syncLedgerData() {
        console.log('Syncing ledger data...');
    }

    // Sync group data
    async syncGroupData() {
        console.log('Syncing group data...');
    }

    // Get PWA capabilities
    getCapabilities() {
        return {
            installed: this.isInstalled,
            online: this.isOnline,
            serviceWorker: 'serviceWorker' in navigator,
            pushNotifications: 'PushManager' in window,
            backgroundSync: 'SyncManager' in window,
            storageEstimate: 'storage' in navigator,
            offlineQueueSize: this.offlineQueue.length,
            deferredPrompt: !!this.deferredPrompt,
            updateAvailable: this.updateAvailable
        };
    }

    // Clear PWA data
    clearPWAData() {
        localStorage.removeItem('pwa_offline_queue');
        localStorage.removeItem('pwa_install_dismissed');
        localStorage.removeItem('pwa_install_data');
        
        this.offlineQueue = [];
        this.deferredPrompt = null;
        this.updateAvailable = false;
        
        console.log('PWA data cleared');
    }
}

// Export singleton instance
const pwaFlow = new PWAFlow();
window.PWAFlow = pwaFlow;
export default pwaFlow;