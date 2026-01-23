/**
 * M-PESEWA Page Guard
 * Zero-bypass access control for protected pages
 * Version: 1.0.0
 */

class MPPageGuard {
    constructor() {
        this.protectedPages = {
            // Borrower pages
            'borrowing.html': ['borrower'],
            'borrower-dashboard.html': ['borrower'],
            
            // Lender pages
            'lending.html': ['lender'],
            'lender-dashboard.html': ['lender'],
            
            // Shared pages
            'groups.html': ['borrower', 'lender'],
            'countries/index.html': ['borrower', 'lender'],
            'blacklist.html': ['borrower', 'lender'],
            'debt-collectors.html': ['borrower', 'lender'],
            'profile.html': ['borrower', 'lender'],
            'ledger.html': ['lender'],
            'subscriptions.html': ['lender'],
            
            // Admin pages
            'admin-dashboard.html': ['admin']
        };
        
        this.publicPages = [
            'index.html',
            'about.html',
            'qa.html',
            'contact.html',
            'register.html',
            'login.html'
        ];
        
        this.currentPage = this.getCurrentPage();
        this.init();
    }
    
    /**
     * Initialize page guard
     */
    async init() {
        // Check if current page is public
        if (this.isPublicPage()) {
            return;
        }
        
        // Check if current page is protected
        if (this.isProtectedPage()) {
            await this.protectPage();
        }
    }
    
    /**
     * Get current page name
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        // Handle countries index page
        if (path.includes('/countries/') && (path.endsWith('/') || path.endsWith('/index.html'))) {
            return 'countries/index.html';
        }
        
        // Handle dashboard pages
        if (path.includes('/dashboard/')) {
            return path.split('/dashboard/').pop();
        }
        
        return page;
    }
    
    /**
     * Check if page is public
     */
    isPublicPage() {
        return this.publicPages.includes(this.currentPage);
    }
    
    /**
     * Check if page is protected
     */
    isProtectedPage() {
        return this.protectedPages.hasOwnProperty(this.currentPage);
    }
    
    /**
     * Protect page with authentication and authorization
     */
    async protectPage() {
        try {
            // Check if auth system is available
            if (!window.mpesewaAuth) {
                console.error('Auth system not available');
                this.redirectToLogin();
                return;
            }
            
            // Validate session
            const sessionValidation = await window.mpesewaAuth.validateSession();
            
            if (!sessionValidation.valid) {
                this.handleInvalidSession(sessionValidation.reason);
                return;
            }
            
            // Check page permission
            const permission = await window.mpesewaAuth.checkPagePermission(
                this.currentPage,
                sessionValidation.user
            );
            
            if (!permission.allowed) {
                this.handleUnauthorizedAccess(permission.reason, sessionValidation.user);
                return;
            }
            
            // Apply page-specific restrictions
            await this.applyPageRestrictions(sessionValidation.user, sessionValidation.profile);
            
            // Initialize page content based on user role and country
            this.initializePageContent(sessionValidation.user, sessionValidation.profile);
            
        } catch (error) {
            console.error('Page guard error:', error);
            this.redirectToLogin();
        }
    }
    
    /**
     * Handle invalid session
     */
    handleInvalidSession(reason) {
        console.log('Session invalid:', reason);
        
        switch (reason) {
            case 'no_session':
            case 'session_expired':
                this.redirectToLogin();
                break;
                
            case 'blacklisted':
                this.redirectToBlacklisted();
                break;
                
            case 'subscription_expired':
                this.redirectToSubscriptionExpired();
                break;
                
            default:
                this.redirectToLogin();
        }
    }
    
    /**
     * Handle unauthorized access
     */
    handleUnauthorizedAccess(reason, user) {
        console.log('Unauthorized access:', reason, user);
        
        switch (reason) {
            case 'role_restricted':
                this.redirectToRoleDashboard(user.role);
                break;
                
            default:
                this.redirectToLogin();
        }
    }
    
    /**
     * Apply page-specific restrictions
     */
    async applyPageRestrictions(user, profile) {
        // Get user's country and groups
        const userCountry = user.country;
        const userGroups = user.groups || [];
        
        // Apply country restriction
        this.applyCountryRestriction(userCountry);
        
        // Apply group restriction for group-specific pages
        if (this.currentPage === 'groups.html' || 
            this.currentPage === 'lending.html' ||
            this.currentPage === 'borrowing.html') {
            this.applyGroupRestriction(userGroups);
        }
        
        // Apply subscription check for lender pages
        if (user.role === 'lender' && profile.subscription) {
            await this.checkSubscriptionStatus(profile.subscription);
        }
        
        // Apply blacklist check
        if (profile.blacklistStatus === 'blacklisted') {
            this.redirectToBlacklisted();
            return;
        }
        
        // Apply borrower loan limits
        if (user.role === 'borrower') {
            await this.checkBorrowerLimits(user.id, profile);
        }
    }
    
    /**
     * Apply country restriction
     */
    applyCountryRestriction(userCountry) {
        // Hide elements from other countries
        const countryElements = document.querySelectorAll('[data-country]');
        countryElements.forEach(element => {
            const elementCountry = element.getAttribute('data-country');
            if (elementCountry && elementCountry !== userCountry) {
                element.style.display = 'none';
            }
        });
        
        // Update page title with country
        const countryNames = {
            'kenya': 'Kenya',
            'uganda': 'Uganda',
            'tanzania': 'Tanzania',
            'rwanda': 'Rwanda',
            'nigeria': 'Nigeria',
            'ghana': 'Ghana',
            'south-africa': 'South Africa',
            'egypt': 'Egypt',
            'ethiopia': 'Ethiopia',
            'senegal': 'Senegal'
        };
        
        const countryName = countryNames[userCountry] || userCountry;
        document.title = `${document.title} | ${countryName}`;
        
        // Add country badge to header
        this.addCountryBadge(userCountry, countryName);
    }
    
    /**
     * Apply group restriction
     */
    applyGroupRestriction(userGroups) {
        // Hide elements from other groups
        const groupElements = document.querySelectorAll('[data-group]');
        groupElements.forEach(element => {
            const elementGroup = element.getAttribute('data-group');
            if (elementGroup && !userGroups.includes(elementGroup)) {
                element.style.display = 'none';
            }
        });
        
        // Show only user's groups
        const groupSelects = document.querySelectorAll('select[data-filter="group"]');
        groupSelects.forEach(select => {
            const options = Array.from(select.options);
            options.forEach(option => {
                if (option.value && !userGroups.includes(option.value)) {
                    option.style.display = 'none';
                }
            });
        });
    }
    
    /**
     * Check subscription status for lenders
     */
    async checkSubscriptionStatus(subscription) {
        if (subscription.status !== 'active') {
            this.showSubscriptionWarning('Subscription inactive');
            return;
        }
        
        const expiresAt = new Date(subscription.expiresAt);
        if (expiresAt < new Date()) {
            this.showSubscriptionWarning('Subscription expired');
            return;
        }
        
        // Check if today is 28th (expiry day)
        const today = new Date();
        if (today.getDate() === 28 && today.getMonth() === expiresAt.getMonth()) {
            this.showSubscriptionWarning('Subscription expires today');
        }
        
        // Show days remaining
        const daysRemaining = Math.ceil((expiresAt - today) / (1000 * 60 * 60 * 24));
        if (daysRemaining <= 7) {
            this.showSubscriptionWarning(`Subscription expires in ${daysRemaining} days`);
        }
    }
    
    /**
     * Check borrower limits
     */
    async checkBorrowerLimits(userId, profile) {
        // Check max groups (4)
        if (profile.groups && profile.groups.length >= 4) {
            this.disableGroupJoining();
        }
        
        // Check max loans (4 total, 1 per group)
        if (profile.stats && profile.stats.activeLoans >= 4) {
            this.disableLoanRequests();
        }
    }
    
    /**
     * Initialize page content based on user role
     */
    initializePageContent(user, profile) {
        // Show role-specific content
        const roleElements = document.querySelectorAll('[data-role]');
        roleElements.forEach(element => {
            const elementRole = element.getAttribute('data-role');
            if (elementRole !== user.role) {
                element.style.display = 'none';
            }
        });
        
        // Update user info in header
        this.updateUserHeader(user, profile);
        
        // Load user-specific data
        this.loadUserData(user, profile);
    }
    
    /**
     * Update user header
     */
    updateUserHeader(user, profile) {
        // Add user info to header
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            // Remove existing user section
            const existingUserSection = headerActions.querySelector('.user-section');
            if (existingUserSection) {
                existingUserSection.remove();
            }
            
            // Create new user section
            const userSection = document.createElement('div');
            userSection.className = 'user-section';
            userSection.style.display = 'flex';
            userSection.style.alignItems = 'center';
            userSection.style.gap = '15px';
            
            userSection.innerHTML = `
                <div style="text-align: right;">
                    <div style="font-weight: 600; font-size: 14px;">${user.fullName}</div>
                    <div style="font-size: 12px; color: #666;">
                        ${user.role === 'borrower' ? 'Borrower' : 'Lender'}
                    </div>
                </div>
                <div class="avatar">${user.fullName.charAt(0)}</div>
                <button onclick="logout()" class="btn secondary small">Logout</button>
            `;
            
            headerActions.prepend(userSection);
        }
    }
    
    /**
     * Load user data
     */
    async loadUserData(user, profile) {
        // Load data based on page and role
        switch (this.currentPage) {
            case 'borrower-dashboard.html':
                await this.loadBorrowerDashboard(user, profile);
                break;
                
            case 'lender-dashboard.html':
                await this.loadLenderDashboard(user, profile);
                break;
                
            case 'groups.html':
                await this.loadGroupsPage(user, profile);
                break;
                
            case 'lending.html':
                await this.loadLendingPage(user, profile);
                break;
                
            case 'borrowing.html':
                await this.loadBorrowingPage(user, profile);
                break;
                
            case 'blacklist.html':
                await this.loadBlacklistPage(user.country);
                break;
                
            case 'debt-collectors.html':
                await this.loadDebtCollectorsPage(user.country);
                break;
        }
    }
    
    /**
     * Load borrower dashboard
     */
    async loadBorrowerDashboard(user, profile) {
        // Load borrower's active loans, groups, rating, etc.
        console.log('Loading borrower dashboard for:', user.id);
        
        // Update stats
        this.updateElementText('#activeLoansCount', profile.stats?.activeLoans || 0);
        this.updateElementText('#totalBorrowed', this.formatCurrency(profile.stats?.totalBorrowed || 0));
        this.updateElementText('#repaymentRate', `${profile.stats?.repaymentRate || 0}%`);
        this.updateElementText('#borrowerRating', '⭐'.repeat(profile.rating || 5));
        
        // Load groups
        await this.loadUserGroups(user.groups);
        
        // Load active loans
        await this.loadActiveLoans(user.id);
    }
    
    /**
     * Load lender dashboard
     */
    async loadLenderDashboard(user, profile) {
        // Load lender's ledgers, active loans, subscription, etc.
        console.log('Loading lender dashboard for:', user.id);
        
        // Update stats
        this.updateElementText('#activeLedgers', profile.stats?.activeLoans || 0);
        this.updateElementText('#totalLent', this.formatCurrency(profile.stats?.totalLent || 0));
        this.updateElementText('#expectedInterest', this.formatCurrency(profile.stats?.expectedInterest || 0));
        
        // Update subscription info
        if (profile.subscription) {
            this.updateElementText('#subscriptionPlan', profile.subscription.plan || 'None');
            
            const expiresAt = new Date(profile.subscription.expiresAt);
            const daysRemaining = Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60 * 24));
            this.updateElementText('#subscriptionDays', daysRemaining);
            
            if (daysRemaining <= 7) {
                this.showSubscriptionWarning(`Renew in ${daysRemaining} days`);
            }
        }
        
        // Load active ledgers
        await this.loadActiveLedgers(user.id);
    }
    
    /**
     * Load groups page
     */
    async loadGroupsPage(user, profile) {
        // Load groups for user's country
        const country = user.country;
        
        try {
            const response = await fetch(`../data/groups/${country}.json`);
            const groups = await response.json();
            
            // Filter user's groups
            const userGroups = groups.filter(group => 
                user.groups.includes(group.id)
            );
            
            // Filter available groups (not joined yet)
            const availableGroups = groups.filter(group => 
                !user.groups.includes(group.id) && 
                group.members < 1000 // Max group size
            );
            
            // Render groups
            this.renderGroups('userGroups', userGroups, 'Your Groups');
            this.renderGroups('availableGroups', availableGroups, 'Available Groups');
            
        } catch (error) {
            console.error('Error loading groups:', error);
        }
    }
    
    /**
     * Load lending page
     */
    async loadLendingPage(user, profile) {
        // Check subscription
        if (!profile.subscription || profile.subscription.status !== 'active') {
            this.showSubscriptionRequired();
            return;
        }
        
        // Load loan requests from user's groups
        await this.loadLoanRequests(user.groups, user.country);
    }
    
    /**
     * Load borrowing page
     */
    async loadBorrowingPage(user, profile) {
        // Check blacklist status
        if (profile.blacklistStatus === 'blacklisted') {
            this.showBlacklistedMessage();
            return;
        }
        
        // Check active loans limit
        if (profile.stats?.activeLoans >= 4) {
            this.showMaxLoansMessage();
            return;
        }
        
        // Load user's groups for loan requests
        await this.loadBorrowerGroups(user.groups);
    }
    
    /**
     * Load blacklist page
     */
    async loadBlacklistPage(country) {
        try {
            const response = await fetch(`../data/blacklist/${country}.json`);
            const blacklist = await response.json();
            
            this.renderBlacklist(blacklist);
            
        } catch (error) {
            console.error('Error loading blacklist:', error);
        }
    }
    
    /**
     * Load debt collectors page
     */
    async loadDebtCollectorsPage(country) {
        try {
            const response = await fetch(`../data/debtcollectors/${country}.json`);
            const collectors = await response.json();
            
            this.renderDebtCollectors(collectors);
            
        } catch (error) {
            console.error('Error loading debt collectors:', error);
        }
    }
    
    /**
     * Helper methods
     */
    updateElementText(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2
        }).format(amount);
    }
    
    addCountryBadge(countryCode, countryName) {
        const header = document.querySelector('.main-header .container');
        if (header) {
            const existingBadge = header.querySelector('.country-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            const badge = document.createElement('div');
            badge.className = 'country-badge';
            badge.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 5px;
                background: rgba(255,255,255,0.1);
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 12px;
                margin-left: 15px;
            `;
            badge.innerHTML = `
                <span>${this.getFlagEmoji(countryCode)}</span>
                <span>${countryName}</span>
            `;
            
            const logo = header.querySelector('.logo');
            if (logo) {
                logo.appendChild(badge);
            }
        }
    }
    
    getFlagEmoji(countryCode) {
        const flags = {
            'kenya': '🇰🇪',
            'uganda': '🇺🇬',
            'tanzania': '🇹🇿',
            'rwanda': '🇷🇼',
            'nigeria': '🇳🇬',
            'ghana': '🇬🇭',
            'south-africa': '🇿🇦',
            'egypt': '🇪🇬',
            'ethiopia': '🇪🇹',
            'senegal': '🇸🇳'
        };
        
        return flags[countryCode] || '🌍';
    }
    
    renderGroups(containerId, groups, title) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <h3>${title} (${groups.length})</h3>
            <div class="groups-grid">
                ${groups.map(group => `
                    <div class="group-card" data-group="${group.id}">
                        <h4>${group.name}</h4>
                        <div class="group-type">${group.type}</div>
                        <div class="group-stats">
                            <span>👥 ${group.members} members</span>
                            <span>💰 ${this.formatCurrency(group.totalLent || 0)} lent</span>
                        </div>
                        <div class="group-actions">
                            ${title === 'Your Groups' ? 
                                `<button onclick="enterGroup('${group.id}')" class="btn primary small">Enter</button>` :
                                `<button onclick="requestJoin('${group.id}')" class="btn outline small">Request Join</button>`
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderBlacklist(blacklist) {
        const container = document.getElementById('blacklistContainer');
        if (!container) return;
        
        container.innerHTML = `
            <h3>Defaulters Registry (${blacklist.length})</h3>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Group</th>
                            <th>Amount Defaulted</th>
                            <th>Days Overdue</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${blacklist.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.group}</td>
                                <td>${this.formatCurrency(item.amount)}</td>
                                <td>${item.daysOverdue}</td>
                                <td><span class="status-badge defaulted">Blacklisted</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    renderDebtCollectors(collectors) {
        const container = document.getElementById('collectorsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <h3>Vetted Debt Collectors (${collectors.length})</h3>
            <div class="warning-message" style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                ⚠️ <strong>Disclaimer:</strong> M-Pesewa does not participate in debt recovery.
                These are independent vetted collectors. Use at your own discretion.
            </div>
            <div class="collectors-grid">
                ${collectors.map(collector => `
                    <div class="collector-card">
                        <h4>${collector.name}</h4>
                        <div class="collector-info">
                            <div>📍 ${collector.city}, ${collector.country}</div>
                            <div>📞 ${collector.phone}</div>
                            <div>📧 ${collector.email}</div>
                        </div>
                        <div class="collector-rating">
                            ${'⭐'.repeat(collector.rating || 3)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    showSubscriptionWarning(message) {
        this.showMessage('warning', `Subscription: ${message}`);
    }
    
    showSubscriptionRequired() {
        this.showMessage('error', 'Active subscription required for lending. Please subscribe first.');
    }
    
    showBlacklistedMessage() {
        this.showMessage('error', 'Account blacklisted. Cannot borrow until cleared by admin.');
    }
    
    showMaxLoansMessage() {
        this.showMessage('warning', 'Maximum 4 active loans reached. Clear some loans to borrow more.');
    }
    
    showMessage(type, text) {
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#fee2e2' : type === 'warning' ? '#fef3c7' : '#d1fae5'};
            border: 1px solid ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};
            color: ${type === 'error' ? '#991b1b' : type === 'warning' ? '#92400e' : '#065f46'};
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    disableGroupJoining() {
        const joinButtons = document.querySelectorAll('button[onclick*="requestJoin"]');
        joinButtons.forEach(button => {
            button.disabled = true;
            button.textContent = 'Max groups reached';
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
    }
    
    disableLoanRequests() {
        const requestButtons = document.querySelectorAll('button[onclick*="requestLoan"]');
        requestButtons.forEach(button => {
            button.disabled = true;
            button.textContent = 'Max loans reached';
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
    }
    
    redirectToLogin() {
        window.location.href = '../pages/login.html';
    }
    
    redirectToBlacklisted() {
        window.location.href = '../pages/blacklisted.html';
    }
    
    redirectToSubscriptionExpired() {
        window.location.href = '../pages/subscriptions.html?expired=true';
    }
    
    redirectToRoleDashboard(role) {
        if (role === 'borrower') {
            window.location.href = '../pages/dashboard/borrower-dashboard.html';
        } else if (role === 'lender') {
            window.location.href = '../pages/dashboard/lender-dashboard.html';
        } else {
            window.location.href = '../pages/login.html';
        }
    }
    
    // Mock data loading methods (to be implemented with real APIs)
    async loadUserGroups(groupIds) {
        // Implementation for loading user's groups
    }
    
    async loadActiveLoans(userId) {
        // Implementation for loading active loans
    }
    
    async loadActiveLedgers(userId) {
        // Implementation for loading active ledgers
    }
    
    async loadLoanRequests(groupIds, country) {
        // Implementation for loading loan requests
    }
    
    async loadBorrowerGroups(groupIds) {
        // Implementation for loading borrower's groups
    }
}

// Global logout function
window.logout = async function() {
    if (window.mpesewaAuth) {
        await window.mpesewaAuth.logout();
    }
    localStorage.clear();
    window.location.href = '../pages/login.html';
};

// Initialize page guard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pageGuard = new MPPageGuard();
});