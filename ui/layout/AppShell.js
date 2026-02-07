/**
 * M-PESEWA APP SHELL - Core Layout Component
 * Strictly enforces Country → Group → Lender → Borrower hierarchy
 * Implements all rules from Sections A, B, C, D
 */

class AppShell {
    constructor() {
        this.appState = {
            country: null,
            group: null,
            role: null,
            subscription: null,
            isAuthenticated: false,
            isMobile: false,
            isOffline: false,
            isLoading: false,
            isAdmin: false
        };
        
        this.countries = [
            { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪', phone: '+254 709 219 000' },
            { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬', phone: '+256 392 175 546' },
            { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿', phone: '+255 659 073 010' },
            { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼', phone: '+250 791 590 801' },
            { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮', phone: '+257 79 000 000' },
            { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩', phone: '+243 81 000 0000' },
            { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬', phone: '+234 800 000 0000' },
            { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭', phone: '+233 24 000 0000' },
            { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸', phone: '+211 955 000 000' },
            { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴', phone: '+252 63 0000000' },
            { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦', phone: '+27 11 000 0000' },
            { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹', phone: '+251 11 000 0000' }
        ];
        
        this.hierarchyVisualization = null;
        this.initialize();
    }
    
    initialize() {
        this.setupMediaQuery();
        this.loadStateFromStorage();
        this.setupServiceWorker();
        this.setupGlobalEvents();
        this.renderHierarchyVisualization();
        this.enforceCountryIsolation();
        this.setupAuthGuard();
    }
    
    setupMediaQuery() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        this.appState.isMobile = mediaQuery.matches;
        
        mediaQuery.addEventListener('change', (e) => {
            this.appState.isMobile = e.matches;
            this.dispatchEvent('appStateChange', { isMobile: e.matches });
        });
    }
    
    loadStateFromStorage() {
        // Load from localStorage
        const savedState = localStorage.getItem('mpesewa_app_state');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            this.appState = { ...this.appState, ...parsed };
            
            // Validate country exists
            if (this.appState.country && !this.countries.find(c => c.code === this.appState.country)) {
                this.appState.country = null;
            }
        }
        
        // Load session state
        const sessionState = sessionStorage.getItem('mpesewa_session');
        if (sessionState) {
            const session = JSON.parse(sessionState);
            this.appState.isAuthenticated = session.isAuthenticated || false;
            this.appState.role = session.role || null;
            this.appState.group = session.group || null;
        }
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'SYNC_COMPLETED') {
                    this.showNotification('Data synchronized successfully');
                }
            });
            
            // Check for updates
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
            }
        }
    }
    
    setupGlobalEvents() {
        // Online/Offline detection
        window.addEventListener('online', () => {
            this.appState.isOffline = false;
            this.dispatchEvent('networkStatusChange', { isOnline: true });
        });
        
        window.addEventListener('offline', () => {
            this.appState.isOffline = true;
            this.dispatchEvent('networkStatusChange', { isOnline: false });
        });
        
        // Before unload - save state
        window.addEventListener('beforeunload', () => {
            this.saveStateToStorage();
        });
        
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.checkSubscriptionExpiry();
            }
        });
    }
    
    saveStateToStorage() {
        // Save persistent state
        localStorage.setItem('mpesewa_app_state', JSON.stringify({
            country: this.appState.country,
            subscription: this.appState.subscription
        }));
        
        // Save session state
        sessionStorage.setItem('mpesewa_session', JSON.stringify({
            isAuthenticated: this.appState.isAuthenticated,
            role: this.appState.role,
            group: this.appState.group,
            timestamp: Date.now()
        }));
    }
    
    /**
     * Renders the Global → Country → Groups → Lenders → Borrowers hierarchy visualization
     * Strict enforcement of Section A hierarchy rules
     */
    renderHierarchyVisualization() {
        // Create hierarchy container if it doesn't exist
        if (!document.getElementById('hierarchy-visualization')) {
            const container = document.createElement('div');
            container.id = 'hierarchy-visualization';
            container.className = 'hierarchy-container';
            container.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #ffffff;
                border: 2px solid #003366;
                border-radius: 10px;
                padding: 15px;
                z-index: 1000;
                box-shadow: 0 4px 20px rgba(0, 51, 102, 0.15);
                max-width: 300px;
                font-size: 12px;
                display: none;
            `;
            document.body.appendChild(container);
        }
        
        this.hierarchyVisualization = document.getElementById('hierarchy-visualization');
        this.updateHierarchyDisplay();
        
        // Toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'hierarchy-toggle';
        toggleBtn.innerHTML = '🌍 Hierarchy';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #003366;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 12px;
            cursor: pointer;
            z-index: 1001;
            box-shadow: 0 2px 10px rgba(0, 51, 102, 0.3);
        `;
        toggleBtn.onclick = () => this.toggleHierarchy();
        document.body.appendChild(toggleBtn);
    }
    
    updateHierarchyDisplay() {
        const hierarchyHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                M-PESEWA HIERARCHY
            </div>
            
            <!-- Global Level -->
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="background: #003366; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; margin-right: 10px;">
                    GLOBAL
                </div>
                <div style="font-size: 11px; color: #666;">Platform Infrastructure</div>
            </div>
            
            <!-- Arrow -->
            <div style="text-align: center; margin: 5px 0; color: #0099ff;">↓</div>
            
            <!-- Country Level -->
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="background: #0099ff; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; margin-right: 10px;">
                    ${this.appState.country ? this.getCountryFlag(this.appState.country) + ' ' + this.getCountryName(this.appState.country) : 'COUNTRY'}
                </div>
                <div style="font-size: 11px; color: #666;">
                    ${this.appState.country ? 'Active: ' + this.appState.country : 'Select in Header'}
                </div>
            </div>
            
            <!-- Arrow -->
            <div style="text-align: center; margin: 5px 0; color: #0099ff;">↓</div>
            
            <!-- Group Level -->
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; margin-right: 10px;">
                    ${this.appState.group ? 'GROUP' : 'GROUPS'}
                </div>
                <div style="font-size: 11px; color: #666;">
                    ${this.appState.group ? this.appState.group : 'Unlimited per country'}
                </div>
            </div>
            
            <!-- Two-column layout for Lenders and Borrowers -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                <!-- Lenders Column -->
                <div>
                    <div style="background: #f37021; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; text-align: center; margin-bottom: 5px;">
                        LENDERS
                    </div>
                    <div style="font-size: 10px; color: #666; text-align: center;">
                        Min: 5, Max: 1000<br>
                        Subscription Required
                    </div>
                </div>
                
                <!-- Borrowers Column -->
                <div>
                    <div style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; text-align: center; margin-bottom: 5px;">
                        BORROWERS
                    </div>
                    <div style="font-size: 10px; color: #666; text-align: center;">
                        Unlimited per lender<br>
                        Max 4 groups
                    </div>
                </div>
            </div>
            
            <!-- Arrow under Lenders to Ledgers -->
            <div style="text-align: center; margin: 5px 0; color: #f37021; grid-column: 1;">↓</div>
            
            <!-- Ledgers under Lenders -->
            <div style="grid-column: 1; background: #f8f9fa; padding: 5px; border-radius: 4px; font-size: 10px; text-align: center;">
                <strong>LEDGERS</strong><br>
                Active loan records
            </div>
            
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee; font-size: 10px; color: #888;">
                <strong>Rules Enforced:</strong><br>
                • No cross-country lending<br>
                • Group isolation only<br>
                • Subscription blocks access<br>
                • Admin can override
            </div>
        `;
        
        if (this.hierarchyVisualization) {
            this.hierarchyVisualization.innerHTML = hierarchyHTML;
        }
    }
    
    toggleHierarchy() {
        if (this.hierarchyVisualization) {
            const isVisible = this.hierarchyVisualization.style.display === 'block';
            this.hierarchyVisualization.style.display = isVisible ? 'none' : 'block';
            
            // Move toggle button
            const toggleBtn = document.getElementById('hierarchy-toggle');
            if (toggleBtn) {
                if (isVisible) {
                    toggleBtn.style.right = '20px';
                    toggleBtn.innerHTML = '🌍 Hierarchy';
                } else {
                    toggleBtn.style.right = '340px';
                    toggleBtn.innerHTML = '× Close';
                }
            }
        }
    }
    
    enforceCountryIsolation() {
        // Check if user tries to access cross-country content
        const currentPath = window.location.pathname;
        const countryFromPath = this.extractCountryFromPath(currentPath);
        
        if (countryFromPath && this.appState.country && countryFromPath !== this.appState.country) {
            console.warn(`Country isolation violation: User from ${this.appState.country} trying to access ${countryFromPath}`);
            
            // Show warning
            this.showNotification({
                title: 'Country Isolation',
                message: `You cannot access content from ${this.getCountryName(countryFromPath)}. Your country is set to ${this.getCountryName(this.appState.country)}.`,
                type: 'warning',
                duration: 5000
            });
            
            // Redirect to user's country page or home
            setTimeout(() => {
                window.location.href = this.appState.country ? 
                    `/countries/${this.appState.country.toLowerCase()}.html` : 
                    '/index.html';
            }, 3000);
            
            return false;
        }
        
        return true;
    }
    
    extractCountryFromPath(path) {
        const countryMatch = path.match(/\/(ke|ug|tz|rw|bi|cd|ng|gh|ss|so|za|et)\//i);
        if (countryMatch) {
            return countryMatch[1].toUpperCase();
        }
        
        // Check for country pages
        const countryPageMatch = path.match(/\/countries\/(kenya|uganda|tanzania|rwanda|burundi|drc|nigeria|ghana|south-sudan|somalia|south-africa|ethiopia)/i);
        if (countryPageMatch) {
            const countryMap = {
                'kenya': 'KE', 'uganda': 'UG', 'tanzania': 'TZ', 'rwanda': 'RW',
                'burundi': 'BI', 'drc': 'CD', 'nigeria': 'NG', 'ghana': 'GH',
                'south-sudan': 'SS', 'somalia': 'SO', 'south-africa': 'ZA', 'ethiopia': 'ET'
            };
            return countryMap[countryPageMatch[1].toLowerCase()];
        }
        
        return null;
    }
    
    setupAuthGuard() {
        // Protect certain routes based on authentication
        const protectedPaths = [
            '/lender/', '/borrower/', '/dashboard', '/profile', '/ledger/',
            '/subscription/', '/group/', '/admin/'
        ];
        
        const currentPath = window.location.pathname;
        const isProtected = protectedPaths.some(path => currentPath.includes(path));
        
        if (isProtected && !this.appState.isAuthenticated) {
            // Redirect to login
            sessionStorage.setItem('mpesewa_redirect', currentPath);
            window.location.href = '/auth/login.html';
            return;
        }
        
        // Role-based access control
        if (this.appState.isAuthenticated && this.appState.role) {
            this.enforceRoleAccess(currentPath);
        }
    }
    
    enforceRoleAccess(path) {
        // Lender-only paths
        const lenderPaths = ['/lender/', '/portfolio', '/lending-'];
        const borrowerPaths = ['/borrower/', '/apply', '/borrow-'];
        
        if (this.appState.role === 'lender' && borrowerPaths.some(p => path.includes(p))) {
            this.showNotification({
                title: 'Access Denied',
                message: 'This section is for borrowers only. Switch to borrower role to access.',
                type: 'error'
            });
            window.location.href = '/lender/dashboard.html';
            return false;
        }
        
        if (this.appState.role === 'borrower' && lenderPaths.some(p => path.includes(p))) {
            this.showNotification({
                title: 'Access Denied',
                message: 'This section is for lenders only. Switch to lender role to access.',
                type: 'error'
            });
            window.location.href = '/borrower/dashboard.html';
            return false;
        }
        
        return true;
    }
    
    checkSubscriptionExpiry() {
        if (this.appState.role === 'lender' && this.appState.subscription) {
            const expiryDate = new Date(this.appState.subscription.expiry);
            const today = new Date();
            
            // Check if expired (28th of month rule)
            if (today > expiryDate) {
                this.appState.subscription.active = false;
                this.showNotification({
                    title: 'Subscription Expired',
                    message: 'Your lender subscription has expired. Please renew to continue lending.',
                    type: 'warning',
                    action: {
                        label: 'Renew',
                        url: '/subscription/renew.html'
                    }
                });
            }
            
            // Warn 3 days before expiry
            const threeDaysBefore = new Date(expiryDate);
            threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
            
            if (today >= threeDaysBefore && today < expiryDate) {
                const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                this.showNotification({
                    title: 'Subscription Expiring Soon',
                    message: `Your subscription expires in ${daysLeft} days. Renew to avoid interruption.`,
                    type: 'info',
                    action: {
                        label: 'Renew Now',
                        url: '/subscription/renew.html'
                    }
                });
            }
        }
    }
    
    getCountryFlag(code) {
        const country = this.countries.find(c => c.code === code);
        return country ? country.flag : '🏳️';
    }
    
    getCountryName(code) {
        const country = this.countries.find(c => c.code === code);
        return country ? country.name : 'Unknown';
    }
    
    setCountry(countryCode) {
        if (!this.countries.find(c => c.code === countryCode)) {
            console.error('Invalid country code:', countryCode);
            return false;
        }
        
        this.appState.country = countryCode;
        this.saveStateToStorage();
        this.updateHierarchyDisplay();
        this.dispatchEvent('countryChange', { country: countryCode });
        
        // Update UI elements
        this.updateCountryUI();
        
        return true;
    }
    
    updateCountryUI() {
        // Update flag in header
        const countryFlags = document.querySelectorAll('.country-flag');
        countryFlags.forEach(flag => {
            flag.textContent = this.getCountryFlag(this.appState.country);
        });
        
        // Update currency displays
        const currencyElements = document.querySelectorAll('[data-currency]');
        currencyElements.forEach(el => {
            const country = this.countries.find(c => c.code === this.appState.country);
            if (country) {
                el.textContent = country.currency;
            }
        });
    }
    
    setGroup(groupId) {
        // Validate group exists in current country
        // This would typically call an API, for now we simulate
        this.appState.group = groupId;
        this.saveStateToStorage();
        this.updateHierarchyDisplay();
        this.dispatchEvent('groupChange', { group: groupId });
    }
    
    setRole(role) {
        const validRoles = ['borrower', 'lender', 'admin'];
        if (!validRoles.includes(role)) {
            console.error('Invalid role:', role);
            return false;
        }
        
        this.appState.role = role;
        this.appState.isAdmin = role === 'admin';
        this.saveStateToStorage();
        this.dispatchEvent('roleChange', { role: role });
        
        return true;
    }
    
    setSubscription(subscriptionData) {
        this.appState.subscription = {
            ...subscriptionData,
            expiry: this.calculateSubscriptionExpiry()
        };
        this.saveStateToStorage();
        this.dispatchEvent('subscriptionChange', { subscription: this.appState.subscription });
    }
    
    calculateSubscriptionExpiry() {
        // Subscription expires on 28th of each month
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        // Create expiry date for 28th of current month
        let expiryDate = new Date(currentYear, currentMonth, 28);
        
        // If today is after 28th, set to 28th of next month
        if (now.getDate() > 28) {
            expiryDate = new Date(currentYear, currentMonth + 1, 28);
        }
        
        // Set time to end of day
        expiryDate.setHours(23, 59, 59, 999);
        
        return expiryDate.toISOString();
    }
    
    authenticate(credentials) {
        // Simulate authentication
        // In real implementation, this would call an API
        
        return new Promise((resolve) => {
            setTimeout(() => {
                this.appState.isAuthenticated = true;
                this.appState.role = credentials.role || 'borrower';
                
                if (credentials.role === 'lender') {
                    // Mock subscription for lenders
                    this.appState.subscription = {
                        plan: 'Basic',
                        limit: 1500,
                        expiry: this.calculateSubscriptionExpiry(),
                        active: true
                    };
                }
                
                this.saveStateToStorage();
                this.updateHierarchyDisplay();
                
                // Dispatch authentication event
                this.dispatchEvent('authenticationChange', { 
                    isAuthenticated: true, 
                    role: this.appState.role 
                });
                
                resolve({
                    success: true,
                    message: 'Authentication successful',
                    role: this.appState.role
                });
            }, 1000);
        });
    }
    
    logout() {
        this.appState.isAuthenticated = false;
        this.appState.role = null;
        this.appState.group = null;
        this.appState.isAdmin = false;
        
        // Clear session storage
        sessionStorage.removeItem('mpesewa_session');
        sessionStorage.removeItem('mpesewa_redirect');
        
        // Clear sensitive data from localStorage
        localStorage.removeItem('mpesewa_app_state');
        
        // Dispatch logout event
        this.dispatchEvent('authenticationChange', { 
            isAuthenticated: false, 
            role: null 
        });
        
        // Redirect to home
        window.location.href = '/index.html';
    }
    
    showLoading(show = true, message = 'Loading...') {
        this.appState.isLoading = show;
        
        // Create or update loading overlay
        let loadingOverlay = document.getElementById('app-loading-overlay');
        
        if (show) {
            if (!loadingOverlay) {
                loadingOverlay = document.createElement('div');
                loadingOverlay.id = 'app-loading-overlay';
                loadingOverlay.className = 'app-loading-overlay';
                loadingOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(3px);
                `;
                
                const spinner = document.createElement('div');
                spinner.className = 'app-spinner';
                spinner.style.cssText = `
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #003366;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                `;
                
                const text = document.createElement('div');
                text.className = 'app-loading-text';
                text.textContent = message;
                text.style.cssText = `
                    color: #003366;
                    font-size: 16px;
                    font-weight: 500;
                `;
                
                // Add spin animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                
                loadingOverlay.appendChild(spinner);
                loadingOverlay.appendChild(text);
                loadingOverlay.appendChild(style);
                document.body.appendChild(loadingOverlay);
            } else {
                loadingOverlay.style.display = 'flex';
                const text = loadingOverlay.querySelector('.app-loading-text');
                if (text) text.textContent = message;
            }
        } else if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        
        this.dispatchEvent('loadingChange', { isLoading: show, message });
    }
    
    showNotification(options) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'app-notification';
        
        const type = options.type || 'info';
        const duration = options.duration || 5000;
        
        const colors = {
            info: '#0099ff',
            success: '#28a745',
            warning: '#f37021',
            error: '#dc3545'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-left: 4px solid ${colors[type]};
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            min-width: 300px;
            max-width: 400px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-family: 'Inter', sans-serif;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: ${colors[type]}20;
                    color: ${colors[type]};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    flex-shrink: 0;
                ">
                    ${type === 'success' ? '✓' : type === 'error' ? '✕' : '!'}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #003366; margin-bottom: 4px;">
                        ${options.title || type.toUpperCase()}
                    </div>
                    <div style="color: #555; font-size: 14px; line-height: 1.4;">
                        ${options.message}
                    </div>
                    ${options.action ? `
                        <div style="margin-top: 8px;">
                            <a href="${options.action.url}" 
                               style="
                                    display: inline-block;
                                    background: ${colors[type]};
                                    color: white;
                                    padding: 6px 12px;
                                    border-radius: 4px;
                                    text-decoration: none;
                                    font-size: 13px;
                                    font-weight: 500;
                               ">
                                ${options.action.label}
                            </a>
                        </div>
                    ` : ''}
                </div>
                <button class="notification-close" style="
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    line-height: 1;
                ">×</button>
            </div>
        `;
        
        // Add animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.onclick = () => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOut 0.3s ease-out';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }
            }, duration);
        }
        
        // Dispatch notification event
        this.dispatchEvent('notification', { 
            type, 
            title: options.title, 
            message: options.message 
        });
    }
    
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`mpesewa:${eventName}`, {
            detail,
            bubbles: true,
            cancelable: true
        });
        
        window.dispatchEvent(event);
    }
    
    /**
     * Brand Block - Displays M-Pesewa branding with hierarchy info
     */
    renderBrandBlock(container) {
        const brandBlock = document.createElement('div');
        brandBlock.className = 'brand-block';
        brandBlock.style.cssText = `
            background: linear-gradient(135deg, #003366 0%, #004080 100%);
            color: white;
            padding: 24px;
            border-radius: 12px;
            margin: 20px 0;
            box-shadow: 0 4px 20px rgba(0, 51, 102, 0.15);
            position: relative;
            overflow: hidden;
        `;
        
        // Add subtle pattern
        const pattern = document.createElement('div');
        pattern.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-image: 
                radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
            pointer-events: none;
        `;
        
        brandBlock.innerHTML = `
            <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="
                        width: 48px;
                        height: 48px;
                        background: white;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        font-weight: bold;
                        color: #003366;
                    ">
                        M₱
                    </div>
                    <div>
                        <h2 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                            M-PESEWA
                        </h2>
                        <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">
                            Emergency Micro-Lending in Trusted Circles
                        </p>
                    </div>
                </div>
                
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 16px;
                    margin-top: 24px;
                ">
                    <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">COUNTRY</div>
                        <div style="font-size: 16px; font-weight: 600;">
                            ${this.appState.country ? this.getCountryFlag(this.appState.country) + ' ' + this.getCountryName(this.appState.country) : 'Not Selected'}
                        </div>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">ROLE</div>
                        <div style="font-size: 16px; font-weight: 600;">
                            ${this.appState.role ? this.appState.role.charAt(0).toUpperCase() + this.appState.role.slice(1) : 'Not Logged In'}
                        </div>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">STATUS</div>
                        <div style="font-size: 16px; font-weight: 600; color: ${this.appState.isAuthenticated ? '#28a745' : '#f37021'}">
                            ${this.appState.isAuthenticated ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                </div>
                
                ${this.appState.subscription && this.appState.role === 'lender' ? `
                    <div style="
                        margin-top: 20px;
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.15);
                        border-radius: 8px;
                        border-left: 4px solid #28a745;
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-size: 12px; opacity: 0.8;">SUBSCRIPTION</div>
                                <div style="font-size: 16px; font-weight: 600; margin-top: 4px;">
                                    ${this.appState.subscription.plan} Tier
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 12px; opacity: 0.8;">EXPIRES</div>
                                <div style="font-size: 14px; font-weight: 600; margin-top: 4px;">
                                    ${new Date(this.appState.subscription.expiry).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                    <div style="font-size: 12px; opacity: 0.8; margin-bottom: 8px;">HIERARCHY PATH</div>
                    <div style="
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 8px;
                        font-size: 14px;
                    ">
                        <span style="background: white; color: #003366; padding: 4px 8px; border-radius: 4px; font-weight: 500;">
                            Global
                        </span>
                        <span style="opacity: 0.5;">→</span>
                        <span style="background: ${this.appState.country ? '#0099ff' : 'rgba(255, 255, 255, 0.2)'}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: 500;">
                            ${this.appState.country ? this.appState.country : 'Country'}
                        </span>
                        <span style="opacity: 0.5;">→</span>
                        <span style="background: ${this.appState.group ? '#28a745' : 'rgba(255, 255, 255, 0.2)'}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: 500;">
                            ${this.appState.group ? 'Group' : 'Groups'}
                        </span>
                        <span style="opacity: 0.5;">→</span>
                        <span style="background: ${this.appState.role === 'lender' ? '#f37021' : 'rgba(255, 255, 255, 0.2)'}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: 500;">
                            ${this.appState.role === 'lender' ? 'Lenders' : 'Role'}
                        </span>
                        ${this.appState.role === 'lender' ? `
                            <span style="opacity: 0.5;">→</span>
                            <span style="background: #f8f9fa; color: #003366; padding: 4px 8px; border-radius: 4px; font-weight: 500;">
                                Ledgers
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        brandBlock.appendChild(pattern);
        
        if (container) {
            container.appendChild(brandBlock);
        }
        
        return brandBlock;
    }
    
    /**
     * Mobile Drawer - Enhanced mobile navigation
     */
    renderMobileDrawer() {
        const drawer = document.createElement('div');
        drawer.id = 'mpesewa-mobile-drawer';
        drawer.className = 'mobile-drawer';
        drawer.style.cssText = `
            position: fixed;
            top: 0;
            right: -320px;
            bottom: 0;
            width: 300px;
            background: white;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
            z-index: 9998;
            transition: transform 0.3s ease;
            padding: 20px;
            overflow-y: auto;
        `;
        
        drawer.innerHTML = `
            <div class="drawer-header" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="
                            width: 40px;
                            height: 40px;
                            background: #003366;
                            color: white;
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            font-size: 18px;
                        ">
                            M₱
                        </div>
                        <div>
                            <div style="font-weight: 700; color: #003366; font-size: 18px;">M-PESEWA</div>
                            <div style="font-size: 12px; color: #666;">Trusted Circles</div>
                        </div>
                    </div>
                    <button id="drawer-close" style="
                        background: #f8f9fa;
                        border: none;
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #666;
                    ">
                        ×
                    </button>
                </div>
            </div>
            
            <div class="drawer-user" style="
                background: linear-gradient(135deg, #003366, #004080);
                color: white;
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 24px;
            ">
                ${this.appState.isAuthenticated ? `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="
                            width: 48px;
                            height: 48px;
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 20px;
                            font-weight: bold;
                        ">
                            ${this.appState.role === 'lender' ? '💰' : '💼'}
                        </div>
                        <div>
                            <div style="font-weight: 600; font-size: 16px;">
                                ${this.appState.role === 'lender' ? 'Lender Account' : 'Borrower Account'}
                            </div>
                            <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">
                                ${this.appState.country ? this.getCountryFlag(this.appState.country) + ' ' + this.getCountryName(this.appState.country) : 'No Country'}
                            </div>
                        </div>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 8px 0;">
                        <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px;">Welcome!</div>
                        <div style="font-size: 14px; opacity: 0.9;">Sign in to access your account</div>
                    </div>
                `}
            </div>
            
            <nav class="drawer-nav" style="margin-bottom: 24px;">
                <div style="font-size: 12px; color: #999; text-transform: uppercase; font-weight: 600; margin-bottom: 12px; padding-left: 8px;">
                    Navigation
                </div>
                
                <a href="/index.html" class="drawer-nav-item" style="
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    color: #003366;
                    text-decoration: none;
                    border-radius: 8px;
                    margin-bottom: 4px;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                    <span style="margin-right: 12px; font-size: 18px;">🏠</span>
                    <span style="font-weight: 500;">Home</span>
                </a>
                
                <a href="/emergency/index.html" class="drawer-nav-item" style="
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    color: #003366;
                    text-decoration: none;
                    border-radius: 8px;
                    margin-bottom: 4px;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                    <span style="margin-right: 12px; font-size: 18px;">🚨</span>
                    <span style="font-weight: 500;">Emergency Hub</span>
                </a>
                
                ${this.appState.role === 'lender' ? `
                    <a href="/lender/dashboard.html" class="drawer-nav-item" style="
                        display: flex;
                        align-items: center;
                        padding: 12px 16px;
                        color: #003366;
                        text-decoration: none;
                        border-radius: 8px;
                        margin-bottom: 4px;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                        <span style="margin-right: 12px; font-size: 18px;">💰</span>
                        <span style="font-weight: 500;">Lender Dashboard</span>
                    </a>
                ` : ''}
                
                ${this.appState.role === 'borrower' ? `
                    <a href="/borrower/dashboard.html" class="drawer-nav-item" style="
                        display: flex;
                        align-items: center;
                        padding: 12px 16px;
                        color: #003366;
                        text-decoration: none;
                        border-radius: 8px;
                        margin-bottom: 4px;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                        <span style="margin-right: 12px; font-size: 18px;">💼</span>
                        <span style="font-weight: 500;">Borrower Dashboard</span>
                    </a>
                ` : ''}
            </nav>
            
            <div class="drawer-countries" style="margin-bottom: 24px;">
                <div style="font-size: 12px; color: #999; text-transform: uppercase; font-weight: 600; margin-bottom: 12px; padding-left: 8px;">
                    Countries
                </div>
                <div style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                ">
                    ${this.countries.slice(0, 6).map(country => `
                        <a href="/countries/${country.name.toLowerCase().replace(' ', '-')}.html" 
                           style="
                                display: flex;
                                align-items: center;
                                padding: 8px 12px;
                                background: ${this.appState.country === country.code ? '#003366' : '#f8f9fa'};
                                color: ${this.appState.country === country.code ? 'white' : '#003366'};
                                border-radius: 20px;
                                text-decoration: none;
                                font-size: 14px;
                                font-weight: 500;
                                transition: all 0.2s;
                           "
                           onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            ${country.flag} ${country.name}
                        </a>
                    `).join('')}
                </div>
            </div>
            
            <div class="drawer-auth" style="margin-top: auto;">
                ${this.appState.isAuthenticated ? `
                    <button id="drawer-logout" style="
                        width: 100%;
                        padding: 14px;
                        background: #f8f9fa;
                        color: #003366;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 15px;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='#f8f9fa'">
                        Log Out
                    </button>
                ` : `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <a href="/auth/login.html" style="
                            padding: 14px;
                            background: white;
                            color: #003366;
                            border: 1px solid #003366;
                            border-radius: 8px;
                            text-decoration: none;
                            font-weight: 600;
                            font-size: 15px;
                            text-align: center;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                            Sign In
                        </a>
                        <a href="/auth/register.html" style="
                            padding: 14px;
                            background: #003366;
                            color: white;
                            border: 1px solid #003366;
                            border-radius: 8px;
                            text-decoration: none;
                            font-weight: 600;
                            font-size: 15px;
                            text-align: center;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='#004080'" onmouseout="this.style.background='#003366'">
                            Sign Up
                        </a>
                    </div>
                `}
            </div>
        `;
        
        document.body.appendChild(drawer);
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.id = 'drawer-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9997;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            backdrop-filter: blur(3px);
        `;
        
        overlay.onclick = () => this.closeMobileDrawer();
        document.body.appendChild(overlay);
        
        // Setup event listeners
        const closeBtn = drawer.querySelector('#drawer-close');
        if (closeBtn) {
            closeBtn.onclick = () => this.closeMobileDrawer();
        }
        
        const logoutBtn = drawer.querySelector('#drawer-logout');
        if (logoutBtn) {
            logoutBtn.onclick = () => this.logout();
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileDrawer();
            }
        });
        
        return drawer;
    }
    
    openMobileDrawer() {
        const drawer = document.getElementById('mpesewa-mobile-drawer');
        const overlay = document.getElementById('drawer-overlay');
        
        if (drawer && overlay) {
            drawer.style.transform = 'translateX(-320px)';
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
        }
    }
    
    closeMobileDrawer() {
        const drawer = document.getElementById('mpesewa-mobile-drawer');
        const overlay = document.getElementById('drawer-overlay');
        
        if (drawer && overlay) {
            drawer.style.transform = 'translateX(0)';
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        }
    }
    
    /**
     * Public API methods
     */
    getState() {
        return { ...this.appState };
    }
    
    getCountries() {
        return [...this.countries];
    }
    
    isLender() {
        return this.appState.role === 'lender';
    }
    
    isBorrower() {
        return this.appState.role === 'borrower';
    }
    
    hasActiveSubscription() {
        return this.appState.subscription && this.appState.subscription.active;
    }
    
    getSubscriptionTier() {
        return this.appState.subscription ? this.appState.subscription.plan : null;
    }
    
    getLendingLimit() {
        if (!this.appState.subscription) return 0;
        
        const limits = {
            'Basic': 1500,
            'Premium': 5000,
            'Super': 20000,
            'Lender of Lenders': 50000
        };
        
        return limits[this.appState.subscription.plan] || 0;
    }
}

// Export as global module
window.MPesewaAppShell = AppShell;

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!window.mpesewa) {
        window.mpesewa = {};
    }
    
    window.mpesewa.AppShell = new AppShell();
    
    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('mpesewa:ready', {
        detail: { version: '1.0.0', initialized: true }
    }));
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppShell;
}