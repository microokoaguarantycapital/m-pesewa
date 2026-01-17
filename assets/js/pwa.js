// assets/js/pwa.js - PWA-specific functionality for M-Pesewa

class MpesewaPWA {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isOnline = navigator.onLine;
        this.serviceWorker = null;
        
        this.init();
    }
    
    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupOfflineDetection();
        this.checkInstallation();
        this.setupPeriodicSync();
        this.setupBackgroundSync();
    }
    
    // Register Service Worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.serviceWorker = await navigator.serviceWorker.register('../service-worker.js', {
                    scope: '/'
                });
                
                console.log('Service Worker registered:', this.serviceWorker);
                
                // Listen for updates
                this.setupServiceWorkerUpdates();
                
                // Check for controller
                if (navigator.serviceWorker.controller) {
                    console.log('Service Worker is controlling the page');
                }
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        } else {
            console.log('Service Worker not supported');
        }
    }
    
    // Setup install prompt
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Update UI to show install button
            this.showInstallButton();
        });
        
        // Detect when app is installed
        window.addEventListener('appinstalled', (e) => {
            console.log('M-Pesewa was installed');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showToast('M-Pesewa installed successfully!', 'success');
            
            // Track installation in localStorage
            localStorage.setItem('mPesewaInstalled', 'true');
            localStorage.setItem('mPesewaInstallDate', new Date().toISOString());
        });
    }
    
    // Show install button
    showInstallButton() {
        // Remove existing install buttons
        const existingButtons = document.querySelectorAll('.install-btn');
        existingButtons.forEach(btn => btn.remove());
        
        // Check if already installed
        if (this.isInstalled || localStorage.getItem('mPesewaInstalled') === 'true') {
            return;
        }
        
        // Create install button
        const installBtn = document.createElement('button');
        installBtn.className = 'install-btn';
        installBtn.innerHTML = `
            <span class="install-icon">📱</span>
            <span class="install-text">Install M-Pesewa</span>
        `;
        
        // Style the button
        Object.assign(installBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '1000',
            padding: '12px 20px',
            backgroundColor: 'var(--primary-blue)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
        });
        
        installBtn.addEventListener('mouseenter', () => {
            installBtn.style.backgroundColor = 'var(--primary-blue-dark)';
            installBtn.style.transform = 'translateY(-2px)';
        });
        
        installBtn.addEventListener('mouseleave', () => {
            installBtn.style.backgroundColor = 'var(--primary-blue)';
            installBtn.style.transform = 'translateY(0)';
        });
        
        installBtn.addEventListener('click', () => this.promptInstallation());
        
        document.body.appendChild(installBtn);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (installBtn.parentNode) {
                installBtn.style.opacity = '0';
                installBtn.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (installBtn.parentNode) {
                        installBtn.remove();
                    }
                }, 300);
            }
        }, 10000);
    }
    
    // Hide install button
    hideInstallButton() {
        const installButtons = document.querySelectorAll('.install-btn');
        installButtons.forEach(btn => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            setTimeout(() => btn.remove(), 300);
        });
    }
    
    // Prompt installation
    async promptInstallation() {
        if (!this.deferredPrompt) {
            return;
        }
        
        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const choiceResult = await this.deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            this.isInstalled = true;
            this.showToast('Installing M-Pesewa...', 'info');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the deferred prompt
        this.deferredPrompt = null;
    }
    
    // Check if already installed
    checkInstallation() {
        // Check display mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('Running in standalone mode (installed)');
        }
        
        // Check localStorage
        if (localStorage.getItem('mPesewaInstalled') === 'true') {
            this.isInstalled = true;
        }
    }
    
    // Setup offline detection
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateOnlineStatus();
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateOnlineStatus();
        });
        
        this.updateOnlineStatus();
    }
    
    // Update online status UI
    updateOnlineStatus() {
        // Remove existing indicators
        const existingIndicators = document.querySelectorAll('.online-status-indicator');
        existingIndicators.forEach(ind => ind.remove());
        
        if (!this.isOnline) {
            // Create offline indicator
            const indicator = document.createElement('div');
            indicator.className = 'online-status-indicator offline';
            indicator.innerHTML = `
                <span class="status-icon">📶</span>
                <span class="status-text">You are offline</span>
            `;
            
            Object.assign(indicator.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                backgroundColor: 'var(--status-error)',
                color: 'white',
                padding: '8px 16px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500',
                zIndex: '9999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            });
            
            document.body.appendChild(indicator);
            
            // Show toast notification
            this.showToast('You are offline. Some features may be limited.', 'warning');
        } else {
            // Show reconnected toast
            this.showToast('You are back online!', 'success');
        }
    }
    
    // Setup periodic sync
    setupPeriodicSync() {
        if ('periodicSync' in window && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                // Register for periodic sync
                registration.periodicSync.register('update-data', {
                    minInterval: 24 * 60 * 60 * 1000 // 24 hours
                }).then(() => {
                    console.log('Periodic sync registered');
                }).catch(error => {
                    console.log('Periodic sync could not be registered:', error);
                });
            });
        }
    }
    
    // Setup background sync
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                // Register background sync for form submissions
                registration.sync.register('submit-loan-request')
                    .then(() => console.log('Background sync registered for loan requests'))
                    .catch(err => console.log('Background sync registration failed:', err));
            });
        }
    }
    
    // Sync offline data when back online
    syncOfflineData() {
        // Get offline submissions from IndexedDB
        this.getOfflineSubmissions().then(submissions => {
            if (submissions.length > 0) {
                this.showToast(`Syncing ${submissions.length} offline submissions...`, 'info');
                
                // Process each submission
                submissions.forEach(submission => {
                    this.submitToServer(submission)
                        .then(() => {
                            // Remove from offline storage on success
                            this.removeOfflineSubmission(submission.id);
                        })
                        .catch(error => {
                            console.error('Failed to sync submission:', error);
                        });
                });
            }
        });
    }
    
    // Get offline submissions (simulated)
    async getOfflineSubmissions() {
        // In a real app, this would read from IndexedDB
        return JSON.parse(localStorage.getItem('mPesewaOfflineSubmissions') || '[]');
    }
    
    // Remove offline submission
    removeOfflineSubmission(id) {
        const submissions = JSON.parse(localStorage.getItem('mPesewaOfflineSubmissions') || '[]');
        const filtered = submissions.filter(sub => sub.id !== id);
        localStorage.setItem('mPesewaOfflineSubmissions', JSON.stringify(filtered));
    }
    
    // Submit to server (simulated)
    async submitToServer(submission) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Submission synced:', submission);
                resolve();
            }, 1000);
        });
    }
    
    // Setup service worker updates
    setupServiceWorkerUpdates() {
        if (!this.serviceWorker) return;
        
        // Check for updates
        this.serviceWorker.addEventListener('updatefound', () => {
            const newWorker = this.serviceWorker.installing;
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New update available
                    this.showUpdateNotification();
                }
            });
        });
        
        // Listen for controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker controller changed');
            this.showToast('App updated successfully!', 'success');
        });
    }
    
    // Show update notification
    showUpdateNotification() {
        // Create update notification
        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification';
        updateNotification.innerHTML = `
            <div class="update-content">
                <span class="update-icon">🔄</span>
                <div class="update-text">
                    <strong>Update Available</strong>
                    <p>A new version of M-Pesewa is available.</p>
                </div>
                <button class="update-btn">Update Now</button>
                <button class="update-dismiss">Dismiss</button>
            </div>
        `;
        
        Object.assign(updateNotification.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            boxShadow: 'var(--shadow-xl)',
            zIndex: '9999',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        });
        
        // Style the buttons
        const updateBtn = updateNotification.querySelector('.update-btn');
        Object.assign(updateBtn.style, {
            padding: '8px 16px',
            backgroundColor: 'var(--primary-blue)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: '600'
        });
        
        const dismissBtn = updateNotification.querySelector('.update-dismiss');
        Object.assign(dismissBtn.style, {
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
        });
        
        // Add event listeners
        updateBtn.addEventListener('click', () => {
            // Skip waiting and reload
            if (this.serviceWorker && this.serviceWorker.waiting) {
                this.serviceWorker.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            location.reload();
        });
        
        dismissBtn.addEventListener('click', () => {
            updateNotification.style.opacity = '0';
            updateNotification.style.transform = 'translateY(20px)';
            setTimeout(() => updateNotification.remove(), 300);
        });
        
        document.body.appendChild(updateNotification);
        
        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            if (updateNotification.parentNode) {
                updateNotification.style.opacity = '0';
                updateNotification.style.transform = 'translateY(20px)';
                setTimeout(() => updateNotification.remove(), 300);
            }
        }, 30000);
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            Object.assign(toastContainer.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '10000',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;
        
        // Style toast based on type
        const typeColors = {
            success: 'var(--secondary-green)',
            error: 'var(--status-error)',
            warning: 'var(--cta-orange)',
            info: 'var(--primary-blue)'
        };
        
        Object.assign(toast.style, {
            backgroundColor: typeColors[type] || typeColors.info,
            color: 'white',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'toastSlideIn 0.3s ease-out'
        });
        
        // Style close button
        const closeBtn = toast.querySelector('.toast-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '10px'
        });
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Add close event
        closeBtn.addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(20px)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
    
    // Check storage quota
    async checkStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                const used = (estimate.usage / (1024 * 1024)).toFixed(2);
                const total = (estimate.quota / (1024 * 1024)).toFixed(2);
                const percentage = ((estimate.usage / estimate.quota) * 100).toFixed(1);
                
                console.log(`Storage: ${used} MB used of ${total} MB (${percentage}%)`);
                
                // Warn if storage is almost full
                if (percentage > 80) {
                    this.showToast('Storage is almost full. Some features may be limited.', 'warning');
                }
                
                return { used, total, percentage };
            } catch (error) {
                console.error('Error checking storage:', error);
                return null;
            }
        }
        return null;
    }
    
    // Clear cache
    async clearCache() {
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
                console.log('Cache cleared successfully');
                this.showToast('Cache cleared successfully', 'success');
                
                // Reload page to get fresh content
                setTimeout(() => location.reload(), 1000);
            } catch (error) {
                console.error('Error clearing cache:', error);
                this.showToast('Error clearing cache', 'error');
            }
        }
    }
    
    // Persist storage
    async persistStorage() {
        if ('storage' in navigator && 'persist' in navigator.storage) {
            const isPersisted = await navigator.storage.persisted();
            
            if (!isPersisted) {
                const result = await navigator.storage.persist();
                if (result) {
                    console.log('Storage persisted successfully');
                    this.showToast('Storage persisted for offline use', 'success');
                } else {
                    console.log('Could not persist storage');
                    this.showToast('Could not persist storage', 'warning');
                }
            }
        }
    }
    
    // Get app usage statistics
    getUsageStats() {
        const installDate = localStorage.getItem('mPesewaInstallDate');
        const usageCount = parseInt(localStorage.getItem('mPesewaUsageCount') || '0');
        
        // Increment usage count
        localStorage.setItem('mPesewaUsageCount', (usageCount + 1).toString());
        
        return {
            installed: !!localStorage.getItem('mPesewaInstalled'),
            installDate: installDate ? new Date(installDate) : null,
            usageCount: usageCount + 1,
            lastVisit: new Date().toISOString()
        };
    }
    
    // Save form data offline
    saveFormDataOffline(formId, formData) {
        const submissions = JSON.parse(localStorage.getItem('mPesewaOfflineSubmissions') || '[]');
        
        const submission = {
            id: `offline_${Date.now()}`,
            formId,
            formData,
            timestamp: new Date().toISOString(),
            synced: false
        };
        
        submissions.push(submission);
        localStorage.setItem('mPesewaOfflineSubmissions', JSON.stringify(submissions));
        
        // Register background sync if available
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('submit-loan-request');
            });
        }
        
        return submission.id;
    }
    
    // Check PWA capabilities
    checkCapabilities() {
        return {
            installable: !!this.deferredPrompt,
            installed: this.isInstalled,
            online: this.isOnline,
            serviceWorker: !!this.serviceWorker,
            backgroundSync: 'SyncManager' in window,
            periodicSync: 'periodicSync' in window,
            storagePersisted: 'storage' in navigator && 'persist' in navigator.storage,
            notifications: 'Notification' in window && Notification.permission === 'granted'
        };
    }
}

// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mPesewaPWA = new MpesewaPWA();
    
    // Save usage stats
    window.mPesewaPWA.getUsageStats();
    
    // Check storage quota periodically
    setTimeout(() => {
        window.mPesewaPWA.checkStorageQuota();
    }, 5000);
    
    // Persist storage if not already persisted
    setTimeout(() => {
        window.mPesewaPWA.persistStorage();
    }, 10000);
});

// Export for module usage (if supported)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MpesewaPWA;
}