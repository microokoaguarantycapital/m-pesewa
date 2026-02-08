/**
 * M-PESEWA OFFLINE GUARD
 * Ensures platform functionality during offline/limited connectivity
 * STRICT ENFORCEMENT: Offline capabilities are critical for financial access
 */

class OfflineGuard {
    constructor() {
        this.offlineStatus = {
            isOffline: !navigator.onLine,
            lastOnline: localStorage.getItem('mpesewa_last_online') || null,
            connectionType: null,
            syncQueue: [],
            criticalOperations: []
        };
        
        this.syncIntervals = {
            IMMEDIATE: 0,
            HIGH_PRIORITY: 1000, // 1 second
            MEDIUM_PRIORITY: 5000, // 5 seconds
            LOW_PRIORITY: 30000, // 30 seconds
            BACKGROUND: 60000 // 1 minute
        };
        
        this.storageQuotas = {
            critical: 1024 * 1024 * 10, // 10MB for critical data
            important: 1024 * 1024 * 50, // 50MB for important data
            regular: 1024 * 1024 * 100 // 100MB for regular data
        };
        
        this.initialize();
    }

    /**
     * Initialize offline guard
     */
    initialize() {
        console.log('[OfflineGuard] Initializing offline capabilities');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize storage
        this.initializeStorage();
        
        // Check initial status
        this.updateOfflineStatus();
        
        // Start sync manager
        this.startSyncManager();
        
        // Initialize background sync
        this.initializeBackgroundSync();
        
        console.log('[OfflineGuard] Offline guard initialized');
    }

    /**
     * Set up offline/online event listeners
     */
    setupEventListeners() {
        // Online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Visibility change (tab background/foreground)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Page freeze/resume
        document.addEventListener('freeze', () => this.handleFreeze());
        document.addEventListener('resume', () => this.handleResume());
        
        // Network information API
        if (navigator.connection) {
            navigator.connection.addEventListener('change', () => this.handleConnectionChange());
        }
    }

    /**
     * Initialize offline storage
     */
    async initializeStorage() {
        try {
            // Initialize IndexedDB for offline data
            this.db = await this.openDatabase();
            
            // Initialize caches
            await this.initializeCaches();
            
            // Load sync queue from storage
            await this.loadSyncQueue();
            
            // Load critical operations
            await this.loadCriticalOperations();
            
            console.log('[OfflineGuard] Storage initialized successfully');
        } catch (error) {
            console.error('[OfflineGuard] Storage initialization failed:', error);
            this.handleStorageFailure(error);
        }
    }

    /**
     * Open IndexedDB database
     */
    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('mpesewa_offline', 1);
            
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve(event.target.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores for different data types
                if (!db.objectStoreNames.contains('sync_queue')) {
                    const syncQueueStore = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
                    syncQueueStore.createIndex('priority', 'priority', { unique: false });
                    syncQueueStore.createIndex('status', 'status', { unique: false });
                    syncQueueStore.createIndex('created_at', 'created_at', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('critical_operations')) {
                    const criticalStore = db.createObjectStore('critical_operations', { keyPath: 'id' });
                    criticalStore.createIndex('type', 'type', { unique: false });
                    criticalStore.createIndex('attempts', 'attempts', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('offline_documents')) {
                    const documentsStore = db.createObjectStore('offline_documents', { keyPath: 'id' });
                    documentsStore.createIndex('document_type', 'document_type', { unique: false });
                    documentsStore.createIndex('user_id', 'user_id', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('ledger_updates')) {
                    const ledgerStore = db.createObjectStore('ledger_updates', { keyPath: 'id', autoIncrement: true });
                    ledgerStore.createIndex('ledger_id', 'ledger_id', { unique: false });
                    ledgerStore.createIndex('status', 'status', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('repayment_updates')) {
                    const repaymentStore = db.createObjectStore('repayment_updates', { keyPath: 'id', autoIncrement: true });
                    repaymentStore.createIndex('loan_id', 'loan_id', { unique: false });
                    repaymentStore.createIndex('status', 'status', { unique: false });
                }
                
                console.log('[OfflineGuard] IndexedDB schema created');
            };
        });
    }

    /**
     * Initialize service worker caches
     */
    async initializeCaches() {
        // Critical assets that must be available offline
        this.criticalAssets = [
            '/',
            '/index.html',
            '/offline.html',
            '/assets/css/colors.css',
            '/assets/css/typography.css',
            '/assets/css/layout.css',
            '/assets/js/core/app.js',
            '/manifest.json',
            '/service-worker.js'
        ];
        
        // Important assets for basic functionality
        this.importantAssets = [
            '/auth/login.html',
            '/auth/register.html',
            '/borrower/dashboard.html',
            '/lender/dashboard.html',
            '/emergency/index.html',
            '/countries/kenya.html'
        ];
        
        // Check if service worker is registered
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            
            // Cache critical assets
            await this.cacheAssets(this.criticalAssets, 'critical');
            
            // Cache important assets if storage available
            const storageAvailable = await this.checkStorageAvailability();
            if (storageAvailable) {
                await this.cacheAssets(this.importantAssets, 'important');
            }
        }
    }

    /**
     * Cache assets with specified priority
     */
    async cacheAssets(assets, priority = 'regular') {
        try {
            const cache = await caches.open(`mpesewa-${priority}`);
            
            for (const asset of assets) {
                try {
                    const response = await fetch(asset);
                    if (response.ok) {
                        await cache.put(asset, response);
                        console.log(`[OfflineGuard] Cached ${priority} asset: ${asset}`);
                    }
                } catch (error) {
                    console.warn(`[OfflineGuard] Failed to cache ${priority} asset ${asset}:`, error);
                }
            }
        } catch (error) {
            console.error(`[OfflineGuard] Failed to open cache for ${priority}:`, error);
        }
    }

    /**
     * Check storage availability
     */
    async checkStorageAvailability() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                const available = estimate.quota - estimate.usage;
                
                // Check if we have at least 10MB available
                return available > this.storageQuotas.critical;
            } catch (error) {
                console.warn('[OfflineGuard] Storage estimation failed:', error);
                return true; // Assume available if estimation fails
            }
        }
        return true; // Assume available if API not supported
    }

    /**
     * Update offline status
     */
    updateOfflineStatus() {
        this.offlineStatus.isOffline = !navigator.onLine;
        this.offlineStatus.lastChecked = new Date().toISOString();
        
        if (navigator.connection) {
            this.offlineStatus.connectionType = navigator.connection.effectiveType;
            this.offlineStatus.downlink = navigator.connection.downlink;
            this.offlineStatus.rtt = navigator.connection.rtt;
        }
        
        // Update UI
        this.updateOfflineUI();
        
        // Log status change
        this.logStatusChange();
    }

    /**
     * Update UI based on offline status
     */
    updateOfflineUI() {
        const body = document.body;
        
        if (this.offlineStatus.isOffline) {
            body.classList.add('offline');
            body.classList.remove('online');
            
            // Show offline banner
            this.showOfflineBanner();
            
            // Disable forms that require online connection
            this.disableOnlineForms();
        } else {
            body.classList.add('online');
            body.classList.remove('offline');
            
            // Hide offline banner
            this.hideOfflineBanner();
            
            // Enable forms
            this.enableOnlineForms();
            
            // Trigger sync
            this.triggerSync();
        }
    }

    /**
     * Show offline banner
     */
    showOfflineBanner() {
        // Remove existing banner
        const existingBanner = document.getElementById('offline-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        // Create banner
        const banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.className = 'offline-banner';
        banner.innerHTML = `
            <div class="offline-banner-content">
                <span class="offline-icon">📶</span>
                <span class="offline-text">You are offline. Some features may be limited.</span>
                <button class="offline-retry" onclick="window.MPesewaOfflineGuard.retryConnection()">
                    Retry Connection
                </button>
                <button class="offline-close" onclick="this.parentElement.parentElement.remove()">
                    ×
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .offline-banner {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(90deg, #ff6b6b 0%, #ff8e8e 100%);
                color: white;
                padding: 12px 20px;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                animation: slideDown 0.3s ease;
            }
            
            @keyframes slideDown {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
            
            .offline-banner-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .offline-icon {
                font-size: 20px;
                margin-right: 10px;
            }
            
            .offline-text {
                flex: 1;
                font-weight: 500;
            }
            
            .offline-retry {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                margin: 0 10px;
                transition: background 0.3s;
            }
            
            .offline-retry:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .offline-close {
                background: transparent;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        
        document.head.appendChild(style);
        document.body.prepend(banner);
    }

    /**
     * Hide offline banner
     */
    hideOfflineBanner() {
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.remove();
        }
    }

    /**
     * Disable forms that require online connection
     */
    disableOnlineForms() {
        const onlineForms = document.querySelectorAll('form[data-requires-online="true"]');
        onlineForms.forEach(form => {
            form.classList.add('form-offline');
            
            const inputs = form.querySelectorAll('input, select, textarea, button[type="submit"]');
            inputs.forEach(input => {
                input.disabled = true;
                input.setAttribute('data-was-disabled', 'true');
            });
            
            // Add offline message
            if (!form.querySelector('.offline-form-message')) {
                const message = document.createElement('div');
                message.className = 'offline-form-message';
                message.innerHTML = '<span style="color: #ff6b6b;">⚠️ This form requires an internet connection.</span>';
                form.prepend(message);
            }
        });
    }

    /**
     * Enable forms that were disabled
     */
    enableOnlineForms() {
        const onlineForms = document.querySelectorAll('form[data-requires-online="true"]');
        onlineForms.forEach(form => {
            form.classList.remove('form-offline');
            
            const inputs = form.querySelectorAll('input, select, textarea, button[type="submit"]');
            inputs.forEach(input => {
                if (input.getAttribute('data-was-disabled') === 'true') {
                    input.disabled = false;
                    input.removeAttribute('data-was-disabled');
                }
            });
            
            // Remove offline message
            const message = form.querySelector('.offline-form-message');
            if (message) {
                message.remove();
            }
        });
    }

    /**
     * Handle online event
     */
    handleOnline() {
        console.log('[OfflineGuard] Device is online');
        
        // Update status
        this.offlineStatus.isOffline = false;
        this.offlineStatus.lastOnline = new Date().toISOString();
        localStorage.setItem('mpesewa_last_online', this.offlineStatus.lastOnline);
        
        // Update UI
        this.updateOfflineUI();
        
        // Trigger sync
        this.triggerSync('IMMEDIATE');
        
        // Log event
        this.logNetworkEvent('online');
    }

    /**
     * Handle offline event
     */
    handleOffline() {
        console.log('[OfflineGuard] Device is offline');
        
        // Update status
        this.offlineStatus.isOffline = true;
        
        // Update UI
        this.updateOfflineUI();
        
        // Save unsaved data
        this.saveUnsavedData();
        
        // Log event
        this.logNetworkEvent('offline');
    }

    /**
     * Handle connection change
     */
    handleConnectionChange() {
        if (!navigator.connection) return;
        
        const conn = navigator.connection;
        console.log(`[OfflineGuard] Connection changed: ${conn.effectiveType}, downlink: ${conn.downlink}Mbps`);
        
        // Update status
        this.updateOfflineStatus();
        
        // Adjust sync intervals based on connection
        this.adjustSyncIntervals();
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // Tab became visible, check connection
            this.updateOfflineStatus();
            
            if (!this.offlineStatus.isOffline) {
                // Trigger sync when tab becomes visible
                this.triggerSync('HIGH_PRIORITY');
            }
        } else {
            // Tab became hidden, save state
            this.saveCurrentState();
        }
    }

    /**
     * Handle page freeze
     */
    handleFreeze() {
        console.log('[OfflineGuard] Page is freezing, saving state');
        this.saveCurrentState();
    }

    /**
     * Handle page resume
     */
    handleResume() {
        console.log('[OfflineGuard] Page resumed, checking connection');
        this.updateOfflineStatus();
    }

    /**
     * Save unsaved data before going offline
     */
    saveUnsavedData() {
        // Save form data
        const forms = document.querySelectorAll('form');
        forms.forEach((form, index) => {
            const formData = new FormData(form);
            const data = {};
            
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            if (Object.keys(data).length > 0) {
                this.saveToStorage(`unsaved_form_${index}`, data);
            }
        });
        
        // Save user input
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
        inputs.forEach(input => {
            if (input.value && input.dataset.saveOffline !== 'false') {
                this.saveToStorage(`unsaved_input_${input.name || input.id}`, {
                    value: input.value,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    /**
     * Save current application state
     */
    saveCurrentState() {
        const state = {
            url: window.location.href,
            scrollPosition: {
                x: window.scrollX,
                y: window.scrollY
            },
            timestamp: new Date().toISOString(),
            userData: {}
        };
        
        // Save to session storage for quick restore
        sessionStorage.setItem('mpesewa_last_state', JSON.stringify(state));
        
        // Also save to IndexedDB for persistence
        this.saveToStorage('last_application_state', state);
    }

    /**
     * Restore previous state
     */
    async restorePreviousState() {
        try {
            // Try session storage first
            const state = sessionStorage.getItem('mpesewa_last_state');
            if (state) {
                const parsed = JSON.parse(state);
                
                // Restore scroll position if on same page
                if (parsed.url === window.location.href) {
                    window.scrollTo(parsed.scrollPosition.x, parsed.scrollPosition.y);
                }
                
                return parsed;
            }
        } catch (error) {
            console.warn('[OfflineGuard] Failed to restore state from session storage:', error);
        }
        
        return null;
    }

    /**
     * Save data to storage
     */
    async saveToStorage(key, data) {
        try {
            localStorage.setItem(`mpesewa_offline_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn(`[OfflineGuard] Failed to save ${key} to localStorage:`, error);
            
            // Try IndexedDB as fallback
            try {
                await this.saveToIndexedDB('offline_documents', {
                    id: key,
                    data: data,
                    saved_at: new Date().toISOString()
                });
                return true;
            } catch (dbError) {
                console.error(`[OfflineGuard] Failed to save ${key} to IndexedDB:`, dbError);
                return false;
            }
        }
    }

    /**
     * Save to IndexedDB
     */
    async saveToIndexedDB(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Load sync queue from storage
     */
    async loadSyncQueue() {
        try {
            // Load from IndexedDB
            const queue = await this.getAllFromIndexedDB('sync_queue');
            this.offlineStatus.syncQueue = queue.filter(item => item.status !== 'completed');
            
            console.log(`[OfflineGuard] Loaded ${this.offlineStatus.syncQueue.length} items to sync queue`);
        } catch (error) {
            console.warn('[OfflineGuard] Failed to load sync queue:', error);
            this.offlineStatus.syncQueue = [];
        }
    }

    /**
     * Load critical operations
     */
    async loadCriticalOperations() {
        try {
            const operations = await this.getAllFromIndexedDB('critical_operations');
            this.offlineStatus.criticalOperations = operations;
            
            console.log(`[OfflineGuard] Loaded ${operations.length} critical operations`);
        } catch (error) {
            console.warn('[OfflineGuard] Failed to load critical operations:', error);
            this.offlineStatus.criticalOperations = [];
        }
    }

    /**
     * Get all records from IndexedDB store
     */
    async getAllFromIndexedDB(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve([]);
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Start sync manager
     */
    startSyncManager() {
        // Clear existing intervals
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        // Start sync interval based on connection
        let interval = this.syncIntervals.BACKGROUND;
        
        if (!this.offlineStatus.isOffline) {
            if (this.offlineStatus.connectionType === '4g') {
                interval = this.syncIntervals.MEDIUM_PRIORITY;
            } else if (this.offlineStatus.connectionType === '3g') {
                interval = this.syncIntervals.LOW_PRIORITY;
            }
        }
        
        this.syncInterval = setInterval(() => {
            if (!this.offlineStatus.isOffline) {
                this.processSyncQueue();
            }
        }, interval);
        
        console.log(`[OfflineGuard] Sync manager started with ${interval}ms interval`);
    }

    /**
     * Adjust sync intervals based on connection
     */
    adjustSyncIntervals() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.startSyncManager();
        }
    }

    /**
     * Initialize background sync
     */
    async initializeBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in registration) {
            try {
                const registration = await navigator.serviceWorker.ready;
                
                // Register background sync for critical operations
                await registration.sync.register('mpesewa-sync');
                
                console.log('[OfflineGuard] Background sync registered');
            } catch (error) {
                console.warn('[OfflineGuard] Background sync registration failed:', error);
            }
        }
    }

    /**
     * Trigger sync with specified priority
     */
    triggerSync(priority = 'MEDIUM_PRIORITY') {
        if (this.offlineStatus.isOffline) {
            console.log('[OfflineGuard] Cannot sync while offline');
            return;
        }
        
        // Process sync queue
        this.processSyncQueue();
        
        // Process critical operations
        this.processCriticalOperations();
        
        // Update last sync time
        localStorage.setItem('mpesewa_last_sync', new Date().toISOString());
        
        console.log(`[OfflineGuard] Sync triggered with ${priority} priority`);
    }

    /**
     * Process sync queue
     */
    async processSyncQueue() {
        if (this.offlineStatus.syncQueue.length === 0) {
            return;
        }
        
        console.log(`[OfflineGuard] Processing ${this.offlineStatus.syncQueue.length} sync items`);
        
        // Sort by priority
        const queue = [...this.offlineStatus.syncQueue].sort((a, b) => {
            return this.syncIntervals[a.priority] - this.syncIntervals[b.priority];
        });
        
        // Process up to 5 items at a time
        const itemsToProcess = queue.slice(0, 5);
        
        for (const item of itemsToProcess) {
            try {
                await this.processSyncItem(item);
                
                // Remove from queue
                this.offlineStatus.syncQueue = this.offlineStatus.syncQueue.filter(
                    i => i.id !== item.id
                );
                
                // Update in IndexedDB
                await this.updateSyncItemStatus(item.id, 'completed');
                
            } catch (error) {
                console.error(`[OfflineGuard] Failed to process sync item ${item.id}:`, error);
                
                // Increment retry count
                item.retries = (item.retries || 0) + 1;
                
                if (item.retries >= 3) {
                    // Move to critical operations after 3 failures
                    await this.addToCriticalOperations(item);
                    this.offlineStatus.syncQueue = this.offlineStatus.syncQueue.filter(
                        i => i.id !== item.id
                    );
                }
            }
        }
    }

    /**
     * Process critical operations
     */
    async processCriticalOperations() {
        if (this.offlineStatus.criticalOperations.length === 0) {
            return;
        }
        
        console.log(`[OfflineGuard] Processing ${this.offlineStatus.criticalOperations.length} critical operations`);
        
        for (const operation of this.offlineStatus.criticalOperations) {
            try {
                await this.processCriticalOperation(operation);
                
                // Remove from critical operations
                this.offlineStatus.criticalOperations = this.offlineStatus.criticalOperations.filter(
                    op => op.id !== operation.id
                );
                
                // Remove from IndexedDB
                await this.deleteCriticalOperation(operation.id);
                
            } catch (error) {
                console.error(`[OfflineGuard] Failed to process critical operation ${operation.id}:`, error);
                
                // Increment attempts
                operation.attempts = (operation.attempts || 0) + 1;
                
                if (operation.attempts >= 5) {
                    // Notify user after 5 failed attempts
                    this.notifyCriticalOperationFailure(operation);
                }
            }
        }
    }

    /**
     * Add item to sync queue
     */
    async addToSyncQueue(data, priority = 'MEDIUM_PRIORITY') {
        const item = {
            ...data,
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            priority: priority,
            status: 'pending',
            created_at: new Date().toISOString(),
            retries: 0
        };
        
        // Add to memory queue
        this.offlineStatus.syncQueue.push(item);
        
        // Save to IndexedDB
        await this.saveToIndexedDB('sync_queue', item);
        
        // Trigger immediate sync if online and high priority
        if (!this.offlineStatus.isOffline && priority === 'IMMEDIATE') {
            this.triggerSync('IMMEDIATE');
        }
        
        console.log(`[OfflineGuard] Added item to sync queue: ${item.id}`);
        return item.id;
    }

    /**
     * Add to critical operations
     */
    async addToCriticalOperations(item) {
        const operation = {
            id: item.id,
            type: item.type || 'unknown',
            data: item.data,
            original_timestamp: item.created_at,
            attempts: item.retries || 0,
            last_attempt: new Date().toISOString()
        };
        
        // Add to memory
        this.offlineStatus.criticalOperations.push(operation);
        
        // Save to IndexedDB
        await this.saveToIndexedDB('critical_operations', operation);
        
        console.log(`[OfflineGuard] Moved item to critical operations: ${operation.id}`);
    }

    /**
     * Process sync item
     */
    async processSyncItem(item) {
        // This would make actual API calls
        // For now, simulate network request
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate for simulation
                    resolve({ success: true, item });
                } else {
                    reject(new Error('Simulated network failure'));
                }
            }, 100);
        });
    }

    /**
     * Process critical operation
     */
    async processCriticalOperation(operation) {
        // Critical operations require special handling
        // For now, simulate processing
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.05) { // 95% success rate for critical
                    resolve({ success: true, operation });
                } else {
                    reject(new Error('Critical operation failed'));
                }
            }, 200);
        });
    }

    /**
     * Update sync item status in IndexedDB
     */
    async updateSyncItemStatus(id, status) {
        try {
            const transaction = this.db.transaction(['sync_queue'], 'readwrite');
            const store = transaction.objectStore('sync_queue');
            const request = store.get(id);
            
            request.onsuccess = () => {
                const item = request.result;
                if (item) {
                    item.status = status;
                    store.put(item);
                }
            };
        } catch (error) {
            console.warn(`[OfflineGuard] Failed to update sync item ${id}:`, error);
        }
    }

    /**
     * Delete critical operation
     */
    async deleteCriticalOperation(id) {
        try {
            const transaction = this.db.transaction(['critical_operations'], 'readwrite');
            const store = transaction.objectStore('critical_operations');
            store.delete(id);
        } catch (error) {
            console.warn(`[OfflineGuard] Failed to delete critical operation ${id}:`, error);
        }
    }

    /**
     * Notify critical operation failure
     */
    notifyCriticalOperationFailure(operation) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'critical-operation-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">⚠️</span>
                <div class="notification-text">
                    <strong>Sync Error</strong>
                    <p>Failed to sync ${operation.type} after multiple attempts.</p>
                </div>
                <button class="notification-action" onclick="this.parentElement.parentElement.remove()">
                    Dismiss
                </button>
            </div>
        `;
        
        // Add styles
        if (!document.querySelector('#critical-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'critical-notification-styles';
            style.textContent = `
                .critical-operation-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: linear-gradient(90deg, #ff6b6b 0%, #ff8e8e 100%);
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10001;
                    max-width: 400px;
                    animation: slideIn 0.3s ease;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .notification-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .notification-icon {
                    font-size: 24px;
                    flex-shrink: 0;
                }
                
                .notification-text {
                    flex: 1;
                }
                
                .notification-text strong {
                    display: block;
                    margin-bottom: 5px;
                }
                
                .notification-text p {
                    margin: 0;
                    font-size: 14px;
                    opacity: 0.9;
                }
                
                .notification-action {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    flex-shrink: 0;
                }
                
                .notification-action:hover {
                    background: rgba(255,255,255,0.3);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * Retry connection
     */
    retryConnection() {
        console.log('[OfflineGuard] Retrying connection...');
        
        // Hide offline banner
        this.hideOfflineBanner();
        
        // Check connection
        this.updateOfflineStatus();
        
        // If still offline, show banner again after delay
        if (this.offlineStatus.isOffline) {
            setTimeout(() => {
                if (this.offlineStatus.isOffline) {
                    this.showOfflineBanner();
                }
            }, 1000);
        }
    }

    /**
     * Log network event
     */
    logNetworkEvent(event) {
        const events = JSON.parse(localStorage.getItem('mpesewa_network_events') || '[]');
        
        events.push({
            event: event,
            timestamp: new Date().toISOString(),
            isOffline: this.offlineStatus.isOffline,
            connectionType: this.offlineStatus.connectionType
        });
        
        // Keep only last 1000 events
        if (events.length > 1000) {
            events.shift();
        }
        
        localStorage.setItem('mpesewa_network_events', JSON.stringify(events));
    }

    /**
     * Log status change
     */
    logStatusChange() {
        const changes = JSON.parse(localStorage.getItem('mpesewa_status_changes') || '[]');
        
        changes.push({
            ...this.offlineStatus,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 500 changes
        if (changes.length > 500) {
            changes.shift();
        }
        
        localStorage.setItem('mpesewa_status_changes', JSON.stringify(changes));
    }

    /**
     * Handle storage failure
     */
    handleStorageFailure(error) {
        console.error('[OfflineGuard] Storage failure:', error);
        
        // Try to recover
        this.tryStorageRecovery();
        
        // Notify user if critical
        if (error.message.includes('quota')) {
            this.showStorageWarning();
        }
    }

    /**
     * Try storage recovery
     */
    tryStorageRecovery() {
        // Clear old data
        const keysToKeep = [
            'mpesewa_last_online',
            'mpesewa_user_data',
            'mpesewa_country',
            'mpesewa_active_group'
        ];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('mpesewa_') && !keysToKeep.includes(key)) {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    // Ignore errors
                }
            }
        }
        
        console.log('[OfflineGuard] Attempted storage recovery');
    }

    /**
     * Show storage warning
     */
    showStorageWarning() {
        // Implementation for storage warning
        console.warn('[OfflineGuard] Storage space is low');
    }

    /**
     * Get offline statistics
     */
    getStatistics() {
        return {
            isOffline: this.offlineStatus.isOffline,
            lastOnline: this.offlineStatus.lastOnline,
            connectionType: this.offlineStatus.connectionType,
            syncQueueLength: this.offlineStatus.syncQueue.length,
            criticalOperations: this.offlineStatus.criticalOperations.length,
            storageUsage: this.getStorageUsage()
        };
    }

    /**
     * Get storage usage
     */
    getStorageUsage() {
        try {
            let total = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                total += key.length + (value ? value.length : 0);
            }
            return total;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Clean up offline guard
     */
    cleanup() {
        // Clear intervals
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        // Remove event listeners
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
        
        // Close database
        if (this.db) {
            this.db.close();
        }
        
        console.log('[OfflineGuard] Cleaned up');
    }
}

// Create global instance
window.MPesewaOfflineGuard = new OfflineGuard();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Already initialized in constructor
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OfflineGuard;
}

/**
 * STRICT M-PESEWA OFFLINE RULES ENFORCEMENT
 * 
 * 1. OFFLINE FIRST ARCHITECTURE:
 *    - All critical functions must work offline
 *    - Data sync must be automatic when online
 *    - Conflict resolution must be clear
 * 
 * 2. SYNC PRIORITIES:
 *    - IMMEDIATE: Ledger updates, repayments, blacklist changes
 *    - HIGH: Loan applications, lender approvals
 *    - MEDIUM: Profile updates, group memberships
 *    - LOW: Analytics, usage statistics
 *    - BACKGROUND: Cache updates, asset preloading
 * 
 * 3. STORAGE QUOTAS:
 *    - Critical: 10MB (must always be available)
 *    - Important: 50MB (cleared after sync)
 *    - Regular: 100MB (cleared when full)
 * 
 * 4. NETWORK HANDLING:
 *    - 2G/3G: Reduced sync frequency, compressed data
 *    - 4G: Normal sync, full functionality
 *    - WiFi: Full sync, asset preloading
 *    - Offline: Local operations only
 * 
 * 5. ERROR RECOVERY:
 *    - 3 retries for normal operations
 *    - 5 retries for critical operations
 *    - User notification after final failure
 *    - Manual retry option always available
 * 
 * 6. DATA CONSISTENCY:
 *    - Last write wins for non-critical data
 *    - Manual resolution for financial data
 *    - Versioning for document updates
 *    - Timestamp-based conflict detection
 * 
 * 7. USER EXPERIENCE:
 *    - Clear offline indicators
 *    - Progress during sync
 *    - Notification of completed sync
 *    - Warning before data loss
 */