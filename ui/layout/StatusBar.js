// layout/StatusBar.js
// M-Pesewa StatusBar Component - System Status & Connectivity Indicator

class MPStatusBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.status = {
            online: navigator.onLine,
            sync: 'up-to-date',
            subscription: null,
            country: localStorage.getItem('mpesewa_country'),
            lastUpdated: new Date().toISOString(),
            warnings: []
        };
        this.isVisible = true;
        this.autoUpdateInterval = null;
    }

    connectedCallback() {
        this.checkStatus();
        this.render();
        this.setupEventListeners();
        this.startAutoUpdate();
    }

    disconnectedCallback() {
        this.stopAutoUpdate();
    }

    async checkStatus() {
        // Check online status
        this.status.online = navigator.onLine;
        
        // Check subscription status for lenders
        const userRole = localStorage.getItem('mpesewa_user_role');
        if (userRole === 'lender') {
            const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || 'null');
            if (subscription) {
                this.status.subscription = {
                    level: subscription.level,
                    expires: subscription.expires,
                    daysLeft: this.calculateDaysUntil(subscription.expires),
                    status: this.calculateSubscriptionStatus(subscription.expires)
                };
            }
        }
        
        // Check sync status
        this.status.sync = await this.checkSyncStatus();
        
        // Check for warnings
        this.status.warnings = this.checkWarnings();
        
        // Update timestamp
        this.status.lastUpdated = new Date().toISOString();
    }

    async checkSyncStatus() {
        // Check if there are pending sync operations
        const pendingSync = JSON.parse(localStorage.getItem('mpesewa_pending_sync') || '[]');
        
        if (pendingSync.length > 0) {
            // Try to sync
            try {
                // This would be an actual sync operation in production
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // For demo, simulate success 80% of the time
                if (Math.random() > 0.2) {
                    localStorage.removeItem('mpesewa_pending_sync');
                    return 'up-to-date';
                } else {
                    return 'pending';
                }
            } catch (error) {
                return 'error';
            }
        }
        
        return 'up-to-date';
    }

    checkWarnings() {
        const warnings = [];
        const userRole = localStorage.getItem('mpesewa_user_role');
        
        // Check if country is set
        if (!this.status.country) {
            warnings.push({
                type: 'warning',
                message: 'Country not selected. Please select your country.',
                action: 'select-country'
            });
        }
        
        // Check subscription for lenders
        if (userRole === 'lender' && this.status.subscription) {
            if (this.status.subscription.daysLeft <= 7) {
                warnings.push({
                    type: this.status.subscription.daysLeft <= 3 ? 'danger' : 'warning',
                    message: `Subscription expires in ${this.status.subscription.daysLeft} days`,
                    action: 'renew-subscription'
                });
            }
        }
        
        // Check for overdue loans for borrowers
        if (userRole === 'borrower') {
            const loans = JSON.parse(localStorage.getItem('mpesewa_user_loans') || '[]');
            const overdueLoans = loans.filter(loan => {
                if (loan.status !== 'active') return false;
                const dueDate = new Date(loan.dueDate);
                return dueDate < new Date();
            });
            
            if (overdueLoans.length > 0) {
                warnings.push({
                    type: 'danger',
                    message: `${overdueLoans.length} overdue loan${overdueLoans.length > 1 ? 's' : ''}`,
                    action: 'view-loans'
                });
            }
        }
        
        // Check connectivity
        if (!this.status.online) {
            warnings.push({
                type: 'danger',
                message: 'You are offline. Some features may be limited.',
                action: 'check-connection'
            });
        }
        
        return warnings;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* STATUS BAR STYLES */
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                
                .status-bar {
                    background: #1f2937;
                    color: #ffffff;
                    padding: 6px 20px;
                    font-size: 11px;
                    position: relative;
                    z-index: 20;
                    border-top: 1px solid #374151;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                }
                
                .status-left {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .status-right {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: background 0.2s ease;
                }
                
                .status-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .status-icon {
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                }
                
                .status-text {
                    font-weight: 500;
                }
                
                /* Status indicators */
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-left: 4px;
                }
                
                .status-online { background: #28a745; animation: pulse 2s infinite; }
                .status-offline { background: #dc3545; }
                .status-syncing { background: #f37021; animation: pulse 1s infinite; }
                .status-error { background: #dc3545; animation: pulse 1s infinite; }
                
                .status-warning {
                    background: #f37021;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: 600;
                    margin-left: 4px;
                }
                
                .status-danger {
                    background: #dc3545;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: 600;
                    margin-left: 4px;
                    animation: pulse 1s infinite;
                }
                
                /* Country badge */
                .country-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                }
                
                /* Subscription badge */
                .subscription-badge {
                    background: linear-gradient(135deg, #003366, #0099ff);
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                }
                
                .subscription-badge.warning {
                    background: linear-gradient(135deg, #f37021, #ff8c42);
                }
                
                .subscription-badge.danger {
                    background: linear-gradient(135deg, #dc3545, #ff6b6b);
                }
                
                /* Last updated */
                .last-updated {
                    color: #9ca3af;
                    font-size: 10px;
                }
                
                /* Warnings panel */
                .warnings-panel {
                    position: absolute;
                    bottom: 100%;
                    right: 0;
                    background: #1f2937;
                    border: 1px solid #374151;
                    border-radius: 8px;
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
                    min-width: 300px;
                    max-height: 400px;
                    overflow-y: auto;
                    display: none;
                    z-index: 100;
                }
                
                .warnings-panel.visible {
                    display: block;
                    animation: slideUp 0.3s ease;
                }
                
                .warnings-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid #374151;
                    font-weight: 600;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .warnings-count {
                    background: #dc3545;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                }
                
                .warnings-list {
                    padding: 8px 0;
                }
                
                .warning-item {
                    padding: 10px 16px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-bottom: 1px solid #374151;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                
                .warning-item:last-child {
                    border-bottom: none;
                }
                
                .warning-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .warning-icon {
                    font-size: 14px;
                }
                
                .warning-content {
                    flex: 1;
                }
                
                .warning-message {
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .warning-action {
                    font-size: 10px;
                    color: #9ca3af;
                    margin-top: 2px;
                }
                
                /* Animations */
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .status-bar {
                        padding: 6px 15px;
                        flex-direction: column;
                        align-items: stretch;
                        gap: 8px;
                    }
                    
                    .status-left, .status-right {
                        justify-content: space-between;
                    }
                    
                    .last-updated {
                        display: none;
                    }
                }
                
                @media (max-width: 480px) {
                    .status-bar {
                        font-size: 10px;
                    }
                    
                    .status-item .status-text {
                        display: none;
                    }
                    
                    .country-badge span:not(.country-flag) {
                        display: none;
                    }
                }
                
                /* Dark mode adjustments */
                @media (prefers-color-scheme: dark) {
                    .status-bar {
                        background: #111827;
                        border-top-color: #374151;
                    }
                    
                    .warnings-panel {
                        background: #1f2937;
                        border-color: #374151;
                    }
                }
                
                /* Print styles */
                @media print {
                    .status-bar {
                        display: none !important;
                    }
                }
            </style>
            
            <div class="status-bar" id="statusBar">
                <!-- Left section -->
                <div class="status-left">
                    <!-- Connectivity status -->
                    <div class="status-item" id="connectivityStatus" title="Internet connection">
                        <span class="status-icon">🌐</span>
                        <span class="status-text">${this.status.online ? 'Online' : 'Offline'}</span>
                        <div class="status-indicator ${this.status.online ? 'status-online' : 'status-offline'}"></div>
                    </div>
                    
                    <!-- Sync status -->
                    <div class="status-item" id="syncStatus" title="Data synchronization">
                        <span class="status-icon">🔄</span>
                        <span class="status-text">${this.getSyncLabel(this.status.sync)}</span>
                        <div class="status-indicator ${this.getSyncIndicatorClass(this.status.sync)}"></div>
                    </div>
                    
                    <!-- Country status -->
                    ${this.status.country ? `
                        <div class="country-badge" id="countryStatus" title="${this.getCountryName(this.status.country)}">
                            <span class="country-flag">${this.getCountryFlag(this.status.country)}</span>
                            <span>${this.getCountryCode(this.status.country)}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Right section -->
                <div class="status-right">
                    <!-- Subscription status (for lenders) -->
                    ${this.status.subscription ? `
                        <div class="subscription-badge ${this.status.subscription.status}" 
                             id="subscriptionStatus"
                             title="Subscription: ${this.status.subscription.level}">
                            ${this.status.subscription.level}
                            ${this.status.subscription.daysLeft <= 7 ? 
                              `<span class="status-${this.status.subscription.status}">${this.status.subscription.daysLeft}d</span>` : ''}
                        </div>
                    ` : ''}
                    
                    <!-- Warnings indicator -->
                    ${this.status.warnings.length > 0 ? `
                        <div class="status-item" id="warningsIndicator" title="${this.status.warnings.length} warnings">
                            <span class="status-icon">⚠️</span>
                            <span class="status-text">Warnings</span>
                            <span class="status-${this.status.warnings.some(w => w.type === 'danger') ? 'danger' : 'warning'}">
                                ${this.status.warnings.length}
                            </span>
                        </div>
                    ` : ''}
                    
                    <!-- Last updated -->
                    <div class="last-updated" id="lastUpdated" title="Last status update">
                        Updated: ${this.formatTime(this.status.lastUpdated)}
                    </div>
                </div>
                
                <!-- Warnings panel (hidden by default) -->
                <div class="warnings-panel" id="warningsPanel">
                    <div class="warnings-header">
                        <span>System Warnings</span>
                        ${this.status.warnings.length > 0 ? `
                            <span class="warnings-count">${this.status.warnings.length}</span>
                        ` : ''}
                    </div>
                    <div class="warnings-list" id="warningsList">
                        <!-- Filled dynamically -->
                    </div>
                </div>
            </div>
        `;
        
        this.renderWarnings();
    }

    renderWarnings() {
        if (this.status.warnings.length === 0) return;
        
        const warningsList = this.shadowRoot.getElementById('warningsList');
        if (!warningsList) return;
        
        warningsList.innerHTML = this.status.warnings.map(warning => `
            <div class="warning-item" data-action="${warning.action}">
                <span class="warning-icon">${warning.type === 'danger' ? '🚨' : '⚠️'}</span>
                <div class="warning-content">
                    <div class="warning-message">${warning.message}</div>
                    <div class="warning-action">Click to ${warning.action.replace('-', ' ')}</div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Connectivity status click
        const connectivityStatus = this.shadowRoot.getElementById('connectivityStatus');
        if (connectivityStatus) {
            connectivityStatus.addEventListener('click', () => this.handleConnectivityClick());
        }
        
        // Sync status click
        const syncStatus = this.shadowRoot.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.addEventListener('click', () => this.handleSyncClick());
        }
        
        // Country status click
        const countryStatus = this.shadowRoot.getElementById('countryStatus');
        if (countryStatus) {
            countryStatus.addEventListener('click', () => this.handleCountryClick());
        }
        
        // Subscription status click
        const subscriptionStatus = this.shadowRoot.getElementById('subscriptionStatus');
        if (subscriptionStatus) {
            subscriptionStatus.addEventListener('click', () => this.handleSubscriptionClick());
        }
        
        // Warnings indicator click
        const warningsIndicator = this.shadowRoot.getElementById('warningsIndicator');
        if (warningsIndicator) {
            warningsIndicator.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleWarningsPanel();
            });
        }
        
        // Warnings panel items
        const warningsList = this.shadowRoot.getElementById('warningsList');
        if (warningsList) {
            warningsList.addEventListener('click', (e) => {
                const warningItem = e.target.closest('.warning-item');
                if (warningItem) {
                    this.handleWarningAction(warningItem.dataset.action);
                }
            });
        }
        
        // Close warnings panel when clicking outside
        document.addEventListener('click', (e) => {
            const warningsPanel = this.shadowRoot.getElementById('warningsPanel');
            const warningsIndicator = this.shadowRoot.getElementById('warningsIndicator');
            
            if (warningsPanel && warningsPanel.classList.contains('visible') &&
                !warningsPanel.contains(e.target) &&
                !warningsIndicator?.contains(e.target)) {
                warningsPanel.classList.remove('visible');
            }
        });
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnlineStatusChange(true));
        window.addEventListener('offline', () => this.handleOnlineStatusChange(false));
        
        // Listen for storage changes (for subscription, etc.)
        window.addEventListener('storage', (e) => {
            if (e.key === 'mpesewa_subscription' || 
                e.key === 'mpesewa_country' ||
                e.key === 'mpesewa_user_loans') {
                this.refreshStatus();
            }
        });
    }

    handleConnectivityClick() {
        if (!this.status.online) {
            this.showToast('You are offline. Please check your internet connection.');
        } else {
            // Test connection speed
            this.testConnectionSpeed();
        }
    }

    handleSyncClick() {
        if (this.status.sync === 'pending' || this.status.sync === 'error') {
            this.forceSync();
        } else {
            this.showToast('Your data is up to date.');
        }
    }

    handleCountryClick() {
        if (!this.status.country) {
            window.location.href = 'countries/index.html';
        } else {
            this.showToast(`${this.getCountryName(this.status.country)} - Country selection is locked after registration.`);
        }
    }

    handleSubscriptionClick() {
        const userRole = localStorage.getItem('mpesewa_user_role');
        if (userRole === 'lender') {
            window.location.href = 'subscription/current.html';
        }
    }

    handleWarningAction(action) {
        switch (action) {
            case 'select-country':
                window.location.href = 'countries/index.html';
                break;
            case 'renew-subscription':
                window.location.href = 'subscription/upgrade.html';
                break;
            case 'view-loans':
                window.location.href = 'borrower/loans.html';
                break;
            case 'check-connection':
                this.testConnectionSpeed();
                break;
        }
        this.hideWarningsPanel();
    }

    toggleWarningsPanel() {
        const warningsPanel = this.shadowRoot.getElementById('warningsPanel');
        if (warningsPanel) {
            warningsPanel.classList.toggle('visible');
        }
    }

    hideWarningsPanel() {
        const warningsPanel = this.shadowRoot.getElementById('warningsPanel');
        if (warningsPanel) {
            warningsPanel.classList.remove('visible');
        }
    }

    async testConnectionSpeed() {
        const startTime = Date.now();
        
        // Show testing indicator
        const connectivityStatus = this.shadowRoot.getElementById('connectivityStatus');
        if (connectivityStatus) {
            const originalText = connectivityStatus.querySelector('.status-text').textContent;
            connectivityStatus.querySelector('.status-text').textContent = 'Testing...';
            
            try {
                // Simple network test
                const testUrl = 'https://httpbin.org/get';
                const response = await fetch(testUrl, { mode: 'no-cors' });
                const endTime = Date.now();
                const latency = endTime - startTime;
                
                this.showToast(`Connection test successful. Latency: ${latency}ms`);
            } catch (error) {
                this.showToast('Connection test failed. You may be offline.');
            } finally {
                connectivityStatus.querySelector('.status-text').textContent = originalText;
            }
        }
    }

    async forceSync() {
        // Show syncing indicator
        const syncStatus = this.shadowRoot.getElementById('syncStatus');
        if (syncStatus) {
            const originalText = syncStatus.querySelector('.status-text');
            originalText.textContent = 'Syncing...';
            
            // Update indicator
            const indicator = syncStatus.querySelector('.status-indicator');
            indicator.className = 'status-indicator status-syncing';
            
            try {
                // Simulate sync process
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if we're still online
                if (!navigator.onLine) {
                    throw new Error('Offline');
                }
                
                // Clear pending sync
                localStorage.removeItem('mpesewa_pending_sync');
                
                // Update status
                this.status.sync = 'up-to-date';
                originalText.textContent = 'Up to date';
                indicator.className = 'status-indicator status-online';
                
                this.showToast('Sync completed successfully.');
                
                // Refresh warnings
                this.status.warnings = this.checkWarnings();
                this.renderWarnings();
                
            } catch (error) {
                this.status.sync = 'error';
                originalText.textContent = 'Sync error';
                indicator.className = 'status-indicator status-error';
                
                this.showToast('Sync failed. Please check your connection.');
            }
        }
    }

    handleOnlineStatusChange(isOnline) {
        this.status.online = isOnline;
        
        // Update UI
        const connectivityStatus = this.shadowRoot.getElementById('connectivityStatus');
        if (connectivityStatus) {
            const text = connectivityStatus.querySelector('.status-text');
            const indicator = connectivityStatus.querySelector('.status-indicator');
            
            text.textContent = isOnline ? 'Online' : 'Offline';
            indicator.className = `status-indicator ${isOnline ? 'status-online' : 'status-offline'}`;
        }
        
        // Show notification
        if (isOnline) {
            this.showToast('You are back online. Syncing data...');
            // Auto-sync when coming back online
            setTimeout(() => this.forceSync(), 1000);
        } else {
            this.showToast('You are offline. Some features may be limited.');
        }
        
        // Update warnings
        this.status.warnings = this.checkWarnings();
        this.renderWarnings();
    }

    startAutoUpdate() {
        // Update status every 60 seconds
        this.autoUpdateInterval = setInterval(() => {
            this.refreshStatus();
        }, 60000);
        
        // Update time every second
        this.timeUpdateInterval = setInterval(() => {
            this.updateTimeDisplay();
        }, 1000);
    }

    stopAutoUpdate() {
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
        }
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }
    }

    async refreshStatus() {
        await this.checkStatus();
        
        // Update all status indicators
        this.updateAllIndicators();
        
        // Update warnings
        this.renderWarnings();
    }

    updateAllIndicators() {
        // Connectivity
        const connectivityStatus = this.shadowRoot.getElementById('connectivityStatus');
        if (connectivityStatus) {
            const text = connectivityStatus.querySelector('.status-text');
            const indicator = connectivityStatus.querySelector('.status-indicator');
            
            text.textContent = this.status.online ? 'Online' : 'Offline';
            indicator.className = `status-indicator ${this.status.online ? 'status-online' : 'status-offline'}`;
        }
        
        // Sync
        const syncStatus = this.shadowRoot.getElementById('syncStatus');
        if (syncStatus) {
            const text = syncStatus.querySelector('.status-text');
            const indicator = syncStatus.querySelector('.status-indicator');
            
            text.textContent = this.getSyncLabel(this.status.sync);
            indicator.className = `status-indicator ${this.getSyncIndicatorClass(this.status.sync)}`;
        }
        
        // Subscription
        const subscriptionStatus = this.shadowRoot.getElementById('subscriptionStatus');
        if (subscriptionStatus && this.status.subscription) {
            subscriptionStatus.className = `subscription-badge ${this.status.subscription.status}`;
            subscriptionStatus.innerHTML = `
                ${this.status.subscription.level}
                ${this.status.subscription.daysLeft <= 7 ? 
                  `<span class="status-${this.status.subscription.status}">${this.status.subscription.daysLeft}d</span>` : ''}
            `;
        }
        
        // Warnings indicator
        const warningsIndicator = this.shadowRoot.getElementById('warningsIndicator');
        if (warningsIndicator) {
            if (this.status.warnings.length > 0) {
                warningsIndicator.style.display = 'flex';
                const warningCount = warningsIndicator.querySelector(`.status-danger, .status-warning`);
                if (warningCount) {
                    warningCount.textContent = this.status.warnings.length;
                    warningCount.className = `status-${this.status.warnings.some(w => w.type === 'danger') ? 'danger' : 'warning'}`;
                }
            } else {
                warningsIndicator.style.display = 'none';
            }
        }
    }

    updateTimeDisplay() {
        const lastUpdated = this.shadowRoot.getElementById('lastUpdated');
        if (lastUpdated) {
            lastUpdated.textContent = `Updated: ${this.formatTime(this.status.lastUpdated)}`;
        }
    }

    getSyncLabel(syncStatus) {
        switch (syncStatus) {
            case 'up-to-date': return 'Up to date';
            case 'pending': return 'Pending sync';
            case 'syncing': return 'Syncing';
            case 'error': return 'Sync error';
            default: return 'Unknown';
        }
    }

    getSyncIndicatorClass(syncStatus) {
        switch (syncStatus) {
            case 'up-to-date': return 'status-online';
            case 'pending': return 'status-warning';
            case 'syncing': return 'status-syncing';
            case 'error': return 'status-error';
            default: return 'status-offline';
        }
    }

    calculateSubscriptionStatus(expiryDate) {
        if (!expiryDate) return 'active';
        
        const daysLeft = this.calculateDaysUntil(expiryDate);
        if (daysLeft <= 0) return 'expired';
        if (daysLeft <= 3) return 'danger';
        if (daysLeft <= 7) return 'warning';
        return 'active';
    }

    calculateDaysUntil(dateStr) {
        if (!dateStr) return 28;
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = date - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getCountryName(code) {
        const countries = [
            { code: 'KE', name: 'Kenya' },
            { code: 'UG', name: 'Uganda' },
            { code: 'TZ', name: 'Tanzania' },
            { code: 'RW', name: 'Rwanda' },
            { code: 'BI', name: 'Burundi' },
            { code: 'CD', name: 'DRC' },
            { code: 'NG', name: 'Nigeria' },
            { code: 'GH', name: 'Ghana' },
            { code: 'SS', name: 'South Sudan' },
            { code: 'SO', name: 'Somalia' },
            { code: 'ZA', name: 'South Africa' },
            { code: 'ET', name: 'Ethiopia' }
        ];
        const country = countries.find(c => c.code === code);
        return country ? country.name : 'Select Country';
    }

    getCountryFlag(code) {
        const flags = {
            'KE': '🇰🇪', 'UG': '🇺🇬', 'TZ': '🇹🇿', 'RW': '🇷🇼',
            'BI': '🇧🇮', 'CD': '🇨🇩', 'NG': '🇳🇬', 'GH': '🇬🇭',
            'SS': '🇸🇸', 'SO': '🇸🇴', 'ZA': '🇿🇦', 'ET': '🇪🇹'
        };
        return flags[code] || '🏳️';
    }

    getCountryCode(code) {
        return code || 'XX';
    }

    formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 20px;
            background: #003366;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Public methods
    setVisibility(visible) {
        this.isVisible = visible;
        const statusBar = this.shadowRoot.getElementById('statusBar');
        if (statusBar) {
            statusBar.style.display = visible ? 'flex' : 'none';
        }
    }

    showWarning(message, type = 'warning', action = null) {
        this.status.warnings.push({
            type,
            message,
            action: action || 'dismiss'
        });
        
        this.renderWarnings();
        this.updateAllIndicators();
        
        // Auto-remove after 1 hour
        setTimeout(() => {
            const index = this.status.warnings.findIndex(w => w.message === message);
            if (index > -1) {
                this.status.warnings.splice(index, 1);
                this.renderWarnings();
                this.updateAllIndicators();
            }
        }, 3600000);
    }

    clearWarnings() {
        this.status.warnings = [];
        this.renderWarnings();
        this.updateAllIndicators();
    }

    simulateSyncError() {
        this.status.sync = 'error';
        this.updateAllIndicators();
        this.showWarning('Sync error detected. Click to retry.', 'danger', 'force-sync');
    }

    simulateSubscriptionWarning() {
        if (this.status.subscription) {
            this.status.subscription.daysLeft = 3;
            this.status.subscription.status = 'danger';
            this.updateAllIndicators();
            this.showWarning('Subscription expires in 3 days!', 'danger', 'renew-subscription');
        }
    }
}

// Register custom element
customElements.define('mp-status-bar', MPStatusBar);

// Export for module usage
export default MPStatusBar;