// layout/OfflineBanner.js
// M-Pesewa OfflineBanner Component - Offline Status & Sync Management

class MPOfflineBanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOnline = navigator.onLine;
        this.isVisible = false;
        this.pendingOperations = [];
        this.retryCount = 0;
        this.maxRetries = 3;
        this.syncInterval = null;
        this.lastSyncAttempt = null;
        this.offlineData = {
            pendingRequests: [],
            cachedPages: [],
            offlineForms: [],
            lastSync: null
        };
    }

    connectedCallback() {
        this.loadOfflineData();
        this.render();
        this.setupEventListeners();
        this.setupServiceWorker();
        this.checkConnectivity();
        
        // Show initial state
        setTimeout(() => {
            this.updateVisibility();
        }, 1000);
    }

    disconnectedCallback() {
        this.stopSyncInterval();
        window.removeEventListener('online', this.handleOnline.bind(this));
        window.removeEventListener('offline', this.handleOffline.bind(this));
    }

    loadOfflineData() {
        // Load offline data from localStorage
        const savedData = localStorage.getItem('mpesewa_offline_data');
        if (savedData) {
            try {
                this.offlineData = JSON.parse(savedData);
            } catch (error) {
                console.error('Failed to parse offline data:', error);
                this.offlineData = {
                    pendingRequests: [],
                    cachedPages: [],
                    offlineForms: [],
                    lastSync: null
                };
            }
        }

        // Load pending operations
        this.pendingOperations = JSON.parse(localStorage.getItem('mpesewa_pending_operations') || '[]');
    }

    saveOfflineData() {
        localStorage.setItem('mpesewa_offline_data', JSON.stringify(this.offlineData));
        localStorage.setItem('mpesewa_pending_operations', JSON.stringify(this.pendingOperations));
    }

    setupServiceWorker() {
        // Check if service worker is supported
        if ('serviceWorker' in navigator) {
            // Register service worker
            navigator.serviceWorker.register('service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                    
                    // Listen for service worker messages
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        this.handleServiceWorkerMessage(event.data);
                    });
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* OFFLINE BANNER STYLES */
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 9998;
                }
                
                .offline-banner {
                    background: ${this.isOnline ? '#28a745' : '#dc3545'};
                    color: white;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    transform: translateY(-100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .offline-banner.visible {
                    transform: translateY(0);
                }
                
                /* Online state */
                .offline-banner.online {
                    background: #28a745;
                }
                
                /* Offline state */
                .offline-banner.offline {
                    background: #dc3545;
                }
                
                /* Syncing state */
                .offline-banner.syncing {
                    background: #f37021;
                }
                
                /* Banner content */
                .banner-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                }
                
                .banner-icon {
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                }
                
                .banner-text {
                    flex: 1;
                    font-size: 14px;
                    font-weight: 500;
                }
                
                .banner-details {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-top: 2px;
                }
                
                /* Banner actions */
                .banner-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .banner-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                
                .banner-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                .banner-btn:active {
                    transform: translateY(1px);
                }
                
                .banner-btn.primary {
                    background: rgba(255, 255, 255, 0.3);
                    font-weight: 600;
                }
                
                /* Close button */
                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: background 0.2s ease;
                    margin-left: 4px;
                }
                
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                /* Progress bar */
                .progress-container {
                    width: 100%;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.2);
                    margin-top: 8px;
                    border-radius: 2px;
                    overflow: hidden;
                    display: none;
                }
                
                .progress-bar {
                    height: 100%;
                    background: white;
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 2px;
                }
                
                /* Offline content indicator */
                .offline-indicator {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #dc3545;
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
                    z-index: 9997;
                    transition: all 0.3s ease;
                    transform: scale(0);
                }
                
                .offline-indicator.visible {
                    transform: scale(1);
                }
                
                .offline-indicator:hover {
                    transform: scale(1.1);
                }
                
                .offline-indicator-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #f37021;
                    color: white;
                    font-size: 10px;
                    font-weight: 600;
                    min-width: 18px;
                    height: 18px;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 4px;
                }
                
                /* Offline panel */
                .offline-panel {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    width: 350px;
                    max-width: 90vw;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    z-index: 9996;
                    transform: translateY(20px) scale(0.95);
                    opacity: 0;
                    transition: all 0.3s ease;
                    display: none;
                }
                
                .offline-panel.visible {
                    display: block;
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                
                .panel-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    background: #003366;
                    color: white;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .panel-title {
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .panel-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    font-size: 20px;
                }
                
                .panel-content {
                    padding: 20px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .section-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                /* Pending operations */
                .pending-list {
                    margin-bottom: 20px;
                }
                
                .pending-item {
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .pending-info {
                    flex: 1;
                }
                
                .pending-title {
                    font-size: 13px;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 4px;
                }
                
                .pending-details {
                    font-size: 11px;
                    color: #6b7280;
                }
                
                .pending-actions {
                    display: flex;
                    gap: 6px;
                }
                
                .pending-btn {
                    padding: 4px 8px;
                    border: 1px solid #d1d5db;
                    background: white;
                    border-radius: 4px;
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .pending-btn.retry {
                    background: #003366;
                    color: white;
                    border-color: #003366;
                }
                
                .pending-btn.delete {
                    background: #dc3545;
                    color: white;
                    border-color: #dc3545;
                }
                
                /* Cached pages */
                .cached-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 8px;
                }
                
                .cached-item {
                    padding: 10px;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .cached-item:hover {
                    background: #f8f9fa;
                    border-color: #0099ff;
                }
                
                .cached-icon {
                    font-size: 20px;
                    margin-bottom: 6px;
                }
                
                .cached-name {
                    font-size: 11px;
                    color: #4b5563;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                /* Animations */
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                .syncing .banner-icon {
                    animation: pulse 1.5s infinite;
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .offline-banner.visible {
                    animation: slideDown 0.3s ease;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .offline-banner {
                        padding: 10px 15px;
                        flex-direction: column;
                        align-items: stretch;
                        gap: 10px;
                    }
                    
                    .banner-actions {
                        justify-content: flex-start;
                    }
                    
                    .offline-panel {
                        width: calc(100% - 40px);
                        right: 20px;
                        left: 20px;
                    }
                    
                    .offline-indicator {
                        bottom: 15px;
                        right: 15px;
                        width: 45px;
                        height: 45px;
                        font-size: 18px;
                    }
                }
                
                @media (max-width: 480px) {
                    .banner-text {
                        font-size: 13px;
                    }
                    
                    .banner-btn {
                        padding: 5px 10px;
                        font-size: 11px;
                    }
                    
                    .offline-panel {
                        width: calc(100% - 30px);
                        right: 15px;
                        left: 15px;
                    }
                }
                
                /* Dark mode */
                @media (prefers-color-scheme: dark) {
                    .offline-panel {
                        background: #1f2937;
                    }
                    
                    .panel-header {
                        background: #003366;
                        border-bottom-color: #374151;
                    }
                    
                    .section-title {
                        color: #e5e7eb;
                    }
                    
                    .pending-item {
                        border-color: #374151;
                        background: #374151;
                    }
                    
                    .pending-title {
                        color: #e5e7eb;
                    }
                    
                    .pending-btn {
                        background: #4b5563;
                        border-color: #6b7280;
                        color: #e5e7eb;
                    }
                    
                    .cached-item {
                        border-color: #374151;
                        background: #374151;
                    }
                    
                    .cached-item:hover {
                        background: #4b5563;
                        border-color: #0099ff;
                    }
                    
                    .cached-name {
                        color: #d1d5db;
                    }
                }
                
                /* Print styles */
                @media print {
                    .offline-banner,
                    .offline-indicator,
                    .offline-panel {
                        display: none !important;
                    }
                }
            </style>
            
            <!-- Main Banner -->
            <div class="offline-banner ${this.isOnline ? 'online' : 'offline'} ${this.isVisible ? 'visible' : ''}" id="offlineBanner">
                <div class="banner-content">
                    <div class="banner-icon" id="bannerIcon">
                        ${this.isOnline ? '🌐' : '📶'}
                    </div>
                    <div class="banner-text">
                        <div id="bannerMessage">
                            ${this.isOnline ? 'You are online' : 'You are offline'}
                        </div>
                        <div class="banner-details" id="bannerDetails">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                </div>
                
                <div class="banner-actions" id="bannerActions">
                    <!-- Filled dynamically -->
                </div>
                
                <button class="close-btn" id="closeBanner" aria-label="Close banner">
                    ×
                </button>
                
                <div class="progress-container" id="progressContainer">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
            </div>
            
            <!-- Offline Indicator (Floating) -->
            <div class="offline-indicator" id="offlineIndicator">
                📶
                <span class="offline-indicator-badge" id="offlineBadge">0</span>
            </div>
            
            <!-- Offline Panel -->
            <div class="offline-panel" id="offlinePanel">
                <div class="panel-header">
                    <div class="panel-title">
                        <span>📶</span>
                        <span>Offline Mode</span>
                    </div>
                    <button class="panel-close" id="closePanel">×</button>
                </div>
                <div class="panel-content" id="panelContent">
                    <!-- Filled dynamically -->
                </div>
            </div>
        `;
        
        this.updateBannerContent();
        this.updateOfflineIndicator();
    }

    setupEventListeners() {
        // Online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Close banner
        const closeBanner = this.shadowRoot.getElementById('closeBanner');
        if (closeBanner) {
            closeBanner.addEventListener('click', () => this.hideBanner());
        }
        
        // Offline indicator
        const offlineIndicator = this.shadowRoot.getElementById('offlineIndicator');
        if (offlineIndicator) {
            offlineIndicator.addEventListener('click', () => this.toggleOfflinePanel());
        }
        
        // Close panel
        const closePanel = this.shadowRoot.getElementById('closePanel');
        if (closePanel) {
            closePanel.addEventListener('click', () => this.hideOfflinePanel());
        }
        
        // Click outside panel to close
        document.addEventListener('click', (e) => {
            const panel = this.shadowRoot.getElementById('offlinePanel');
            const indicator = this.shadowRoot.getElementById('offlineIndicator');
            
            if (panel && panel.classList.contains('visible') &&
                !panel.contains(e.target) &&
                !indicator?.contains(e.target)) {
                this.hideOfflinePanel();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideOfflinePanel();
            }
        });
        
        // Start sync interval
        this.startSyncInterval();
    }

    handleOnline() {
        this.isOnline = true;
        this.updateBannerState();
        this.attemptSync();
        
        // Show online notification
        this.showToast('You are back online. Syncing data...');
    }

    handleOffline() {
        this.isOnline = false;
        this.updateBannerState();
        
        // Show offline notification
        this.showToast('You are offline. Some features may be limited.');
    }

    updateBannerState() {
        const banner = this.shadowRoot.getElementById('offlineBanner');
        if (!banner) return;
        
        // Update classes
        banner.classList.remove('online', 'offline', 'syncing');
        banner.classList.add(this.isOnline ? 'online' : 'offline');
        
        // Update icon
        const bannerIcon = this.shadowRoot.getElementById('bannerIcon');
        if (bannerIcon) {
            bannerIcon.textContent = this.isOnline ? '🌐' : '📶';
        }
        
        // Update message
        const bannerMessage = this.shadowRoot.getElementById('bannerMessage');
        if (bannerMessage) {
            bannerMessage.textContent = this.isOnline ? 'You are online' : 'You are offline';
        }
        
        // Update visibility
        this.updateVisibility();
        
        // Update content
        this.updateBannerContent();
    }

    updateVisibility() {
        // Show banner if offline or if there are pending operations
        const shouldShow = !this.isOnline || this.pendingOperations.length > 0;
        
        if (shouldShow !== this.isVisible) {
            this.isVisible = shouldShow;
            const banner = this.shadowRoot.getElementById('offlineBanner');
            if (banner) {
                if (shouldShow) {
                    banner.classList.add('visible');
                } else {
                    banner.classList.remove('visible');
                }
            }
        }
        
        // Update offline indicator
        this.updateOfflineIndicator();
    }

    updateBannerContent() {
        const bannerDetails = this.shadowRoot.getElementById('bannerDetails');
        const bannerActions = this.shadowRoot.getElementById('bannerActions');
        
        if (!bannerDetails || !bannerActions) return;
        
        if (this.isOnline) {
            if (this.pendingOperations.length > 0) {
                // Online with pending operations
                bannerDetails.innerHTML = `
                    ${this.pendingOperations.length} pending operation${this.pendingOperations.length !== 1 ? 's' : ''} to sync
                `;
                
                bannerActions.innerHTML = `
                    <button class="banner-btn primary" id="syncNowBtn">
                        <span>🔄</span>
                        <span>Sync Now</span>
                    </button>
                `;
                
                // Add sync button listener
                setTimeout(() => {
                    const syncBtn = this.shadowRoot.getElementById('syncNowBtn');
                    if (syncBtn) {
                        syncBtn.addEventListener('click', () => this.attemptSync());
                    }
                }, 0);
            } else {
                // Online, no pending operations
                bannerDetails.innerHTML = 'All data is synced';
                bannerActions.innerHTML = '';
            }
        } else {
            // Offline
            bannerDetails.innerHTML = `
                ${this.pendingOperations.length} pending operation${this.pendingOperations.length !== 1 ? 's' : ''}
            `;
            
            bannerActions.innerHTML = `
                <button class="banner-btn" id="viewOfflineBtn">
                    <span>📋</span>
                    <span>View Offline Data</span>
                </button>
                <button class="banner-btn" id="retryConnectionBtn">
                    <span>↻</span>
                    <span>Retry Connection</span>
                </button>
            `;
            
            // Add button listeners
            setTimeout(() => {
                const viewBtn = this.shadowRoot.getElementById('viewOfflineBtn');
                if (viewBtn) {
                    viewBtn.addEventListener('click', () => this.showOfflinePanel());
                }
                
                const retryBtn = this.shadowRoot.getElementById('retryConnectionBtn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', () => this.checkConnectivity());
                }
            }, 0);
        }
    }

    updateOfflineIndicator() {
        const indicator = this.shadowRoot.getElementById('offlineIndicator');
        const badge = this.shadowRoot.getElementById('offlineBadge');
        
        if (!indicator || !badge) return;
        
        const pendingCount = this.pendingOperations.length;
        
        if (!this.isOnline || pendingCount > 0) {
            indicator.classList.add('visible');
            badge.textContent = pendingCount > 9 ? '9+' : pendingCount;
            
            // Update icon based on state
            const icon = indicator.querySelector('span:first-child');
            if (icon) {
                icon.textContent = this.isOnline ? '🔄' : '📶';
            }
        } else {
            indicator.classList.remove('visible');
        }
    }

    updateOfflinePanel() {
        const panelContent = this.shadowRoot.getElementById('panelContent');
        if (!panelContent) return;
        
        panelContent.innerHTML = `
            <!-- Pending Operations -->
            <div class="pending-section">
                <div class="section-title">
                    <span>⏳</span>
                    <span>Pending Operations (${this.pendingOperations.length})</span>
                </div>
                <div class="pending-list" id="pendingList">
                    ${this.pendingOperations.length > 0 ? 
                        this.pendingOperations.map(op => `
                            <div class="pending-item">
                                <div class="pending-info">
                                    <div class="pending-title">${op.type}</div>
                                    <div class="pending-details">${op.details || 'No details available'}</div>
                                </div>
                                <div class="pending-actions">
                                    ${this.isOnline ? `
                                        <button class="pending-btn retry" data-id="${op.id}">
                                            Retry
                                        </button>
                                    ` : ''}
                                    <button class="pending-btn delete" data-id="${op.id}">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        `).join('') :
                        '<div style="text-align: center; color: #6b7280; padding: 20px;">No pending operations</div>'
                    }
                </div>
            </div>
            
            <!-- Cached Pages -->
            <div class="cached-section">
                <div class="section-title">
                    <span>📄</span>
                    <span>Cached Pages (${this.offlineData.cachedPages.length})</span>
                </div>
                <div class="cached-list" id="cachedList">
                    ${this.offlineData.cachedPages.length > 0 ?
                        this.offlineData.cachedPages.map(page => `
                            <div class="cached-item" data-url="${page.url}">
                                <div class="cached-icon">${page.icon || '📄'}</div>
                                <div class="cached-name">${page.name}</div>
                            </div>
                        `).join('') :
                        '<div style="text-align: center; color: #6b7280; padding: 10px;">No cached pages</div>'
                    }
                </div>
            </div>
            
            <!-- Offline Forms -->
            ${this.offlineData.offlineForms.length > 0 ? `
                <div class="forms-section">
                    <div class="section-title">
                        <span>📝</span>
                        <span>Saved Forms (${this.offlineData.offlineForms.length})</span>
                    </div>
                    <div style="text-align: center; color: #6b7280; padding: 10px;">
                        Forms saved for when you're back online
                    </div>
                </div>
            ` : ''}
            
            <!-- Sync Status -->
            <div class="sync-section">
                <div class="section-title">
                    <span>⚙️</span>
                    <span>Sync Status</span>
                </div>
                <div style="font-size: 13px; color: #4b5563;">
                    <div>Status: ${this.isOnline ? 'Online' : 'Offline'}</div>
                    <div>Last sync: ${this.offlineData.lastSync ? 
                        new Date(this.offlineData.lastSync).toLocaleString() : 
                        'Never'}</div>
                    <div>Pending operations: ${this.pendingOperations.length}</div>
                </div>
            </div>
        `;
        
        // Add event listeners for pending operations
        setTimeout(() => {
            const pendingList = this.shadowRoot.getElementById('pendingList');
            if (pendingList) {
                pendingList.addEventListener('click', (e) => {
                    const retryBtn = e.target.closest('.pending-btn.retry');
                    const deleteBtn = e.target.closest('.pending-btn.delete');
                    
                    if (retryBtn) {
                        const opId = retryBtn.dataset.id;
                        this.retryOperation(opId);
                    } else if (deleteBtn) {
                        const opId = deleteBtn.dataset.id;
                        this.deleteOperation(opId);
                    }
                });
            }
            
            // Add event listeners for cached pages
            const cachedList = this.shadowRoot.getElementById('cachedList');
            if (cachedList) {
                cachedList.addEventListener('click', (e) => {
                    const cachedItem = e.target.closest('.cached-item');
                    if (cachedItem) {
                        const url = cachedItem.dataset.url;
                        this.openCachedPage(url);
                    }
                });
            }
        }, 0);
    }

    showOfflinePanel() {
        const panel = this.shadowRoot.getElementById('offlinePanel');
        if (panel) {
            this.updateOfflinePanel();
            panel.classList.add('visible');
        }
    }

    hideOfflinePanel() {
        const panel = this.shadowRoot.getElementById('offlinePanel');
        if (panel) {
            panel.classList.remove('visible');
        }
    }

    toggleOfflinePanel() {
        const panel = this.shadowRoot.getElementById('offlinePanel');
        if (panel) {
            if (panel.classList.contains('visible')) {
                this.hideOfflinePanel();
            } else {
                this.showOfflinePanel();
            }
        }
    }

    hideBanner() {
        this.isVisible = false;
        const banner = this.shadowRoot.getElementById('offlineBanner');
        if (banner) {
            banner.classList.remove('visible');
        }
    }

    async checkConnectivity() {
        // Simple connectivity check
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://httpbin.org/get', {
                mode: 'no-cors',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            this.isOnline = true;
            this.updateBannerState();
            this.showToast('Connection restored');
        } catch (error) {
            this.isOnline = false;
            this.updateBannerState();
            this.showToast('Still offline. Please check your connection.');
        }
    }

    startSyncInterval() {
        // Check for connectivity and sync every 30 seconds
        this.syncInterval = setInterval(() => {
            if (this.isOnline && this.pendingOperations.length > 0) {
                this.attemptSync();
            }
        }, 30000);
    }

    stopSyncInterval() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
    }

    async attemptSync() {
        if (!this.isOnline || this.pendingOperations.length === 0) {
            return;
        }
        
        // Update banner to show syncing state
        const banner = this.shadowRoot.getElementById('offlineBanner');
        if (banner) {
            banner.classList.add('syncing');
        }
        
        // Show progress bar
        const progressContainer = this.shadowRoot.getElementById('progressContainer');
        const progressBar = this.shadowRoot.getElementById('progressBar');
        if (progressContainer && progressBar) {
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';
        }
        
        try {
            let successCount = 0;
            const totalCount = this.pendingOperations.length;
            
            // Process each pending operation
            for (let i = 0; i < this.pendingOperations.length; i++) {
                const operation = this.pendingOperations[i];
                
                // Update progress
                if (progressBar) {
                    progressBar.style.width = `${((i + 1) / totalCount) * 100}%`;
                }
                
                // Simulate API call (replace with actual API calls)
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Random success/failure for simulation
                if (Math.random() > 0.2) { // 80% success rate
                    successCount++;
                    
                    // Remove successful operation
                    this.pendingOperations.splice(i, 1);
                    i--; // Adjust index after removal
                }
            }
            
            // Save updated operations
            this.saveOfflineData();
            
            // Update offline data
            this.offlineData.lastSync = new Date().toISOString();
            this.saveOfflineData();
            
            // Update UI
            this.updateBannerContent();
            this.updateOfflineIndicator();
            this.updateOfflinePanel();
            
            // Show success message
            if (successCount > 0) {
                this.showToast(`Successfully synced ${successCount} operation${successCount !== 1 ? 's' : ''}`);
            }
            
            // Hide banner if everything is synced
            if (this.pendingOperations.length === 0) {
                setTimeout(() => {
                    this.hideBanner();
                }, 2000);
            }
            
        } catch (error) {
            console.error('Sync failed:', error);
            this.showToast('Sync failed. Will retry later.');
        } finally {
            // Reset banner state
            if (banner) {
                banner.classList.remove('syncing');
            }
            
            // Hide progress bar
            if (progressContainer) {
                progressContainer.style.display = 'none';
            }
            
            // Reset retry count on success, increment on failure
            if (this.pendingOperations.length === 0) {
                this.retryCount = 0;
            } else {
                this.retryCount++;
                
                // Exponential backoff for retries
                const delay = Math.min(30000, Math.pow(2, this.retryCount) * 1000);
                setTimeout(() => this.attemptSync(), delay);
            }
        }
    }

    addPendingOperation(type, data, details = '') {
        const operation = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            type,
            data,
            details,
            timestamp: new Date().toISOString(),
            retryCount: 0
        };
        
        this.pendingOperations.push(operation);
        this.saveOfflineData();
        
        // Update UI
        this.updateVisibility();
        this.updateBannerContent();
        this.updateOfflineIndicator();
        
        // Auto-sync if online
        if (this.isOnline) {
            setTimeout(() => this.attemptSync(), 1000);
        }
        
        return operation.id;
    }

    retryOperation(operationId) {
        const operation = this.pendingOperations.find(op => op.id === operationId);
        if (!operation) return;
        
        operation.retryCount++;
        
        // Move to front of queue
        this.pendingOperations = this.pendingOperations.filter(op => op.id !== operationId);
        this.pendingOperations.unshift(operation);
        
        this.saveOfflineData();
        this.updateOfflinePanel();
        
        // Attempt sync if online
        if (this.isOnline) {
            this.attemptSync();
        }
    }

    deleteOperation(operationId) {
        this.pendingOperations = this.pendingOperations.filter(op => op.id !== operationId);
        this.saveOfflineData();
        
        // Update UI
        this.updateVisibility();
        this.updateBannerContent();
        this.updateOfflineIndicator();
        this.updateOfflinePanel();
        
        this.showToast('Operation deleted');
    }

    addCachedPage(url, name, icon = '📄') {
        // Check if already cached
        const existingIndex = this.offlineData.cachedPages.findIndex(page => page.url === url);
        
        if (existingIndex > -1) {
            this.offlineData.cachedPages[existingIndex] = { url, name, icon };
        } else {
            this.offlineData.cachedPages.push({ url, name, icon });
            
            // Limit to 20 cached pages
            if (this.offlineData.cachedPages.length > 20) {
                this.offlineData.cachedPages.shift();
            }
        }
        
        this.saveOfflineData();
        this.updateOfflinePanel();
    }

    openCachedPage(url) {
        // In a real PWA, this would navigate to the cached page
        // For now, just show a message
        this.showToast(`Opening cached page: ${url}`);
        
        // Simulate navigation
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    handleServiceWorkerMessage(message) {
        switch (message.type) {
            case 'CACHE_UPDATED':
                this.handleCacheUpdate(message.data);
                break;
            case 'SYNC_COMPLETED':
                this.handleSyncCompleted(message.data);
                break;
            case 'OFFLINE_REQUEST':
                this.handleOfflineRequest(message.data);
                break;
        }
    }

    handleCacheUpdate(data) {
        console.log('Cache updated:', data);
        // Update cached pages list
        this.updateOfflinePanel();
    }

    handleSyncCompleted(data) {
        console.log('Background sync completed:', data);
        // Update pending operations
        this.pendingOperations = this.pendingOperations.filter(op => 
            !data.completedOperations.includes(op.id)
        );
        
        this.saveOfflineData();
        this.updateBannerContent();
        this.updateOfflineIndicator();
        this.updateOfflinePanel();
    }

    handleOfflineRequest(data) {
        console.log('Offline request detected:', data);
        // Add to pending operations
        this.addPendingOperation('Offline Request', data, `Request to ${data.url}`);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #003366;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideUp 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Public methods
    getSyncStatus() {
        return {
            online: this.isOnline,
            pendingOperations: this.pendingOperations.length,
            lastSync: this.offlineData.lastSync,
            cachedPages: this.offlineData.cachedPages.length,
            offlineForms: this.offlineData.offlineForms.length
        };
    }

    simulateOfflineRequest(url, method = 'POST', data = {}) {
        const operationId = this.addPendingOperation(
            'HTTP Request',
            { url, method, data },
            `${method} request to ${url}`
        );
        
        this.showToast('Request saved for when you are back online');
        return operationId;
    }

    clearPendingOperations() {
        this.pendingOperations = [];
        this.saveOfflineData();
        
        // Update UI
        this.updateVisibility();
        this.updateBannerContent();
        this.updateOfflineIndicator();
        this.updateOfflinePanel();
        
        this.showToast('All pending operations cleared');
    }

    forceSync() {
        if (this.isOnline) {
            this.attemptSync();
        } else {
            this.showToast('Cannot sync while offline');
        }
    }
}

// Register custom element
customElements.define('mp-offline-banner', MPOfflineBanner);

// Export for module usage
export default MPOfflineBanner;