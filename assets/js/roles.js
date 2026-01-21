// assets/js/roles.js - Role management

class RoleManager {
    constructor() {
        this.roles = {
            'borrower': this.getBorrowerPermissions(),
            'lender': this.getLenderPermissions(),
            'both': this.getBothPermissions(),
            'admin': this.getAdminPermissions()
        };
        this.currentRole = null;
        this.init();
    }

    init() {
        this.loadCurrentRole();
        this.setupEventListeners();
        this.updateRoleUI();
    }

    // ===== PERMISSION DEFINITIONS =====
    getBorrowerPermissions() {
        return {
            // Dashboard access
            dashboard: ['borrower-dashboard'],
            
            // Page access
            pages: [
                'borrowing',
                'groups',
                'subscriptions',
                'blacklist',
                'debt-collectors',
                'about',
                'qa',
                'contact'
            ],
            
            // Actions
            actions: [
                'request_loan',
                'view_loan_requests',
                'view_groups',
                'join_group',
                'leave_group',
                'view_ratings',
                'update_profile',
                'view_blacklist',
                'view_collectors'
            ],
            
            // Restrictions
            restrictions: {
                maxGroups: 4,
                maxActiveLoansPerGroup: 1,
                canLend: false,
                requiresSubscription: false,
                canAccessLendingPage: false,
                canAccessLedgerPage: false,
                canAccessAdminPages: false
            },
            
            // Features
            features: {
                emergencyLoans: true,
                groupBased: true,
                ratingSystem: true,
                blacklistProtection: true
            }
        };
    }

    getLenderPermissions() {
        return {
            // Dashboard access
            dashboard: ['lender-dashboard'],
            
            // Page access
            pages: [
                'lending',
                'ledger',
                'groups',
                'subscriptions',
                'blacklist',
                'debt-collectors',
                'about',
                'qa',
                'contact'
            ],
            
            // Actions
            actions: [
                'fund_loan',
                'view_borrowing_opportunities',
                'create_ledger',
                'update_ledger',
                'mark_cleared',
                'report_default',
                'manage_subscription',
                'view_groups',
                'view_ratings',
                'update_profile',
                'view_blacklist',
                'view_collectors'
            ],
            
            // Restrictions
            restrictions: {
                requiresSubscription: true,
                subscriptionExpiryDay: 28,
                maxWeeklyLimit: {
                    'basic': 1500,
                    'premium': 5000,
                    'super': 20000,
                    'lender_of_lenders': 50000
                },
                maxLedgers: {
                    'basic': 5,
                    'premium': 20,
                    'super': 50,
                    'lender_of_lenders': null // unlimited
                },
                canBorrow: false,
                canAccessBorrowingPage: false,
                canAccessAdminPages: false
            },
            
            // Features
            features: {
                passiveIncome: true,
                groupScoped: true,
                subscriptionBased: true,
                ledgerManagement: true,
                blacklistEnforcement: true
            }
        };
    }

    getBothPermissions() {
        const borrowerPerms = this.getBorrowerPermissions();
        const lenderPerms = this.getLenderPermissions();
        
        return {
            // Dashboard access - can access both
            dashboard: ['borrower-dashboard', 'lender-dashboard'],
            
            // Page access - combined
            pages: [
                ...new Set([...borrowerPerms.pages, ...lenderPerms.pages])
            ],
            
            // Actions - combined
            actions: [
                ...new Set([...borrowerPerms.actions, ...lenderPerms.actions])
            ],
            
            // Restrictions - more permissive
            restrictions: {
                maxGroups: 4,
                maxActiveLoansPerGroup: 1,
                requiresSubscription: true, // for lending
                subscriptionExpiryDay: 28,
                maxWeeklyLimit: lenderPerms.restrictions.maxWeeklyLimit,
                maxLedgers: lenderPerms.restrictions.maxLedgers,
                canLend: true,
                canBorrow: true,
                canAccessLendingPage: true,
                canAccessBorrowingPage: true,
                canAccessLedgerPage: true,
                canAccessAdminPages: false
            },
            
            // Features - combined
            features: {
                ...borrowerPerms.features,
                ...lenderPerms.features
            }
        };
    }

    getAdminPermissions() {
        return {
            // Dashboard access
            dashboard: ['admin-dashboard'],
            
            // Page access - all pages
            pages: [
                'lending',
                'borrowing',
                'ledger',
                'groups',
                'subscriptions',
                'blacklist',
                'debt-collectors',
                'about',
                'qa',
                'contact',
                'countries'
            ],
            
            // Actions - all actions plus admin actions
            actions: [
                'override_blacklist',
                'override_ledger',
                'manage_subscriptions',
                'audit_groups',
                'validate_collectors',
                'view_all_users',
                'view_all_transactions',
                'manage_system_settings'
            ],
            
            // Restrictions - minimal
            restrictions: {
                canLend: false,
                canBorrow: false,
                requiresSubscription: false,
                countryBound: false,
                groupBound: false
            },
            
            // Features
            features: {
                systemWideAccess: true,
                overrideCapabilities: true,
                auditTrail: true,
                reporting: true
            }
        };
    }

    // ===== ROLE MANAGEMENT =====
    loadCurrentRole() {
        // Get role from auth system or localStorage
        if (typeof auth !== 'undefined' && auth.currentUser) {
            this.currentRole = auth.currentUser.role;
        } else {
            this.currentRole = localStorage.getItem('currentRole') || null;
        }
    }

    setCurrentRole(role) {
        if (!this.roles[role]) {
            throw new Error(`Invalid role: ${role}`);
        }
        
        this.currentRole = role;
        localStorage.setItem('currentRole', role);
        this.updateRoleUI();
        this.dispatchRoleEvent('role_changed', { role });
    }

    getCurrentRole() {
        return this.currentRole;
    }

    getCurrentPermissions() {
        if (!this.currentRole) {
            return this.getBorrowerPermissions(); // Default to most restrictive
        }
        return this.roles[this.currentRole];
    }

    // ===== PERMISSION CHECKS =====
    hasPermission(permission) {
        const perms = this.getCurrentPermissions();
        
        // Check actions
        if (perms.actions.includes(permission)) {
            return true;
        }
        
        // Check page access
        if (permission.startsWith('page_')) {
            const page = permission.replace('page_', '');
            return perms.pages.includes(page);
        }
        
        // Check dashboard access
        if (permission.startsWith('dashboard_')) {
            const dashboard = permission.replace('dashboard_', '');
            return perms.dashboard.includes(dashboard);
        }
        
        return false;
    }

    canAccessPage(pageName) {
        const perms = this.getCurrentPermissions();
        return perms.pages.includes(pageName);
    }

    canAccessDashboard(dashboardName) {
        const perms = this.getCurrentPermissions();
        return perms.dashboard.includes(dashboardName);
    }

    canPerformAction(action) {
        return this.hasPermission(action);
    }

    // ===== RESTRICTION CHECKS =====
    checkRestrictions(context) {
        const perms = this.getCurrentPermissions();
        const restrictions = perms.restrictions;
        
        switch (context.type) {
            case 'join_group':
                if (this.currentRole === 'borrower' || this.currentRole === 'both') {
                    const userGroups = context.userGroups || [];
                    if (userGroups.length >= restrictions.maxGroups) {
                        return {
                            allowed: false,
                            reason: `Borrowers can join maximum ${restrictions.maxGroups} groups`
                        };
                    }
                }
                break;
                
            case 'request_loan':
                if (this.currentRole === 'borrower' || this.currentRole === 'both') {
                    const activeLoansInGroup = context.activeLoansInGroup || 0;
                    if (activeLoansInGroup >= restrictions.maxActiveLoansPerGroup) {
                        return {
                            allowed: false,
                            reason: `Cannot have more than ${restrictions.maxActiveLoansPerGroup} active loan in the same group`
                        };
                    }
                }
                break;
                
            case 'fund_loan':
                if (this.currentRole === 'lender' || this.currentRole === 'both') {
                    // Check subscription
                    if (restrictions.requiresSubscription && !context.hasActiveSubscription) {
                        return {
                            allowed: false,
                            reason: 'Active subscription required to fund loans'
                        };
                    }
                    
                    // Check weekly limit
                    const subscriptionLevel = context.subscriptionLevel || 'basic';
                    const weeklyLent = context.weeklyLent || 0;
                    const weeklyLimit = restrictions.maxWeeklyLimit[subscriptionLevel];
                    
                    if (weeklyLimit && weeklyLent >= weeklyLimit) {
                        return {
                            allowed: false,
                            reason: `Weekly lending limit of ${utils.formatCurrency(weeklyLimit, context.country)} reached`
                        };
                    }
                    
                    // Check ledger limit
                    const activeLedgers = context.activeLedgers || 0;
                    const maxLedgers = restrictions.maxLedgers[subscriptionLevel];
                    
                    if (maxLedgers && activeLedgers >= maxLedgers) {
                        return {
                            allowed: false,
                            reason: `Maximum of ${maxLedgers} active ledgers reached for ${subscriptionLevel} subscription`
                        };
                    }
                }
                break;
                
            case 'access_page':
                const page = context.page;
                
                if (page === 'lending' && !restrictions.canAccessLendingPage) {
                    return {
                        allowed: false,
                        reason: 'Lending page not available for your role'
                    };
                }
                
                if (page === 'borrowing' && !restrictions.canAccessBorrowingPage) {
                    return {
                        allowed: false,
                        reason: 'Borrowing page not available for your role'
                    };
                }
                
                if (page === 'ledger' && !restrictions.canAccessLedgerPage) {
                    return {
                        allowed: false,
                        reason: 'Ledger page not available for your role'
                    };
                }
                
                if (page.includes('admin') && !restrictions.canAccessAdminPages) {
                    return {
                        allowed: false,
                        reason: 'Admin pages not available for your role'
                    };
                }
                break;
        }
        
        return { allowed: true };
    }

    // ===== ROLE SWITCHING =====
    async switchRole(newRole) {
        try {
            if (!this.roles[newRole]) {
                throw new Error(`Invalid role: ${newRole}`);
            }
            
            const oldRole = this.currentRole;
            this.setCurrentRole(newRole);
            
            // Update UI
            this.updateRoleUI();
            
            // Show notification
            this.showNotification(`Switched to ${newRole} role`, 'success');
            
            // Redirect to appropriate dashboard
            this.redirectToDashboard(newRole);
            
            this.dispatchRoleEvent('role_switched', { oldRole, newRole });
            
        } catch (error) {
            console.error('Role switch error:', error);
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    redirectToDashboard(role) {
        const dashboards = {
            'borrower': '/pages/dashboard/borrower-dashboard.html',
            'lender': '/pages/dashboard/lender-dashboard.html',
            'both': '/pages/dashboard/borrower-dashboard.html', // Default to borrower dashboard
            'admin': '/pages/dashboard/admin-dashboard.html'
        };
        
        const dashboard = dashboards[role];
        if (dashboard && window.location.pathname.includes('dashboard')) {
            window.location.href = dashboard;
        }
    }

    // ===== UI MANAGEMENT =====
    updateRoleUI() {
        const role = this.currentRole;
        if (!role) return;
        
        // Update role indicator
        const roleIndicator = document.getElementById('role-indicator');
        if (roleIndicator) {
            roleIndicator.textContent = utils.capitalize(role);
            roleIndicator.className = `role-indicator role-${role}`;
        }
        
        // Show/hide role-specific elements
        document.querySelectorAll('[data-role-access]').forEach(element => {
            const allowedRoles = element.getAttribute('data-role-access').split(' ');
            if (allowedRoles.includes(role) || allowedRoles.includes('all')) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
        
        // Update navigation
        this.updateNavigation();
        
        // Update dashboard links
        this.updateDashboardLinks();
    }

    updateNavigation() {
        const role = this.currentRole;
        const perms = this.getCurrentPermissions();
        
        // Update main navigation
        const navItems = document.querySelectorAll('.main-nav a, .sidebar-nav a');
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href) {
                const pageMatch = href.match(/\/([^\/]+)\.html$/);
                if (pageMatch) {
                    const page = pageMatch[1];
                    
                    // Check if user can access this page
                    if (!perms.pages.includes(page) && page !== 'index') {
                        item.style.display = 'none';
                        item.setAttribute('disabled', 'true');
                    } else {
                        item.style.display = '';
                        item.removeAttribute('disabled');
                    }
                }
            }
        });
        
        // Update dashboard link
        const dashboardLink = document.querySelector('a[href*="dashboard"]');
        if (dashboardLink && perms.dashboard.length > 0) {
            dashboardLink.href = `/pages/dashboard/${perms.dashboard[0]}.html`;
        }
    }

    updateDashboardLinks() {
        const role = this.currentRole;
        
        // Update quick switch links
        const switchLinks = document.querySelectorAll('[data-switch-role]');
        switchLinks.forEach(link => {
            const targetRole = link.getAttribute('data-switch-role');
            link.style.display = targetRole === role ? 'none' : 'inline-flex';
            
            if (targetRole !== role) {
                link.onclick = (e) => {
                    e.preventDefault();
                    this.switchRole(targetRole);
                };
            }
        });
    }

    createRoleSwitchUI() {
        // Create role switch dropdown if user has multiple roles
        const user = auth.currentUser;
        if (!user || user.role !== 'both') return;
        
        const roleSwitch = document.createElement('div');
        roleSwitch.className = 'role-switch';
        roleSwitch.innerHTML = `
            <div class="role-switch-current">
                <span>Current: <strong>${utils.capitalize(this.currentRole)}</strong></span>
                <button class="role-switch-toggle">▼</button>
            </div>
            <div class="role-switch-options">
                <button class="role-option ${this.currentRole === 'borrower' ? 'active' : ''}" 
                        data-role="borrower">
                    👤 Borrower
                </button>
                <button class="role-option ${this.currentRole === 'lender' ? 'active' : ''}" 
                        data-role="lender">
                    💰 Lender
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .role-switch {
                position: relative;
                display: inline-block;
            }
            .role-switch-current {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: var(--neutral-light);
                border-radius: var(--radius-md);
                cursor: pointer;
                user-select: none;
            }
            .role-switch-toggle {
                background: none;
                border: none;
                font-size: 12px;
                cursor: pointer;
            }
            .role-switch-options {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--neutral-white);
                border: 1px solid var(--neutral-light);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                display: none;
                z-index: 1000;
                margin-top: 4px;
            }
            .role-switch:hover .role-switch-options {
                display: block;
            }
            .role-option {
                display: block;
                width: 100%;
                padding: 12px;
                text-align: left;
                background: none;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .role-option:hover {
                background: var(--neutral-light);
            }
            .role-option.active {
                background: var(--primary-purple);
                color: var(--neutral-white);
            }
        `;
        
        document.head.appendChild(style);
        
        // Add to header or sidebar
        const headerActions = document.querySelector('.header-actions');
        const sidebarHeader = document.querySelector('.sidebar-header');
        
        if (headerActions) {
            headerActions.prepend(roleSwitch);
        } else if (sidebarHeader) {
            sidebarHeader.appendChild(roleSwitch);
        }
        
        // Add event listeners
        roleSwitch.querySelectorAll('.role-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const newRole = e.target.getAttribute('data-role');
                this.switchRole(newRole);
            });
        });
    }

    // ===== EVENT HANDLING =====
    setupEventListeners() {
        // Listen for auth state changes
        window.addEventListener('auth_state_changed', (e) => {
            this.loadCurrentRole();
            this.updateRoleUI();
            
            if (e.detail.isAuthenticated && e.detail.user.role === 'both') {
                this.createRoleSwitchUI();
            }
        });
        
        // Listen for page navigation
        window.addEventListener('popstate', () => {
            this.checkPageAccess();
        });
        
        window.addEventListener('hashchange', () => {
            this.checkPageAccess();
        });
        
        // Check page access on load
        setTimeout(() => {
            this.checkPageAccess();
        }, 100);
    }

    checkPageAccess() {
        const currentPage = window.location.pathname;
        const pageMatch = currentPage.match(/\/([^\/]+)\.html$/);
        
        if (pageMatch) {
            const page = pageMatch[1];
            
            // Skip check for index page
            if (page === 'index' || page === '') return;
            
            // Check if user can access this page
            if (!this.canAccessPage(page)) {
                const restriction = this.checkRestrictions({
                    type: 'access_page',
                    page: page
                });
                
                if (!restriction.allowed) {
                    this.showNotification(restriction.reason, 'error');
                    
                    // Redirect to appropriate page
                    const perms = this.getCurrentPermissions();
                    if (perms.dashboard.length > 0) {
                        window.location.href = `/pages/dashboard/${perms.dashboard[0]}.html`;
                    } else {
                        window.location.href = '/';
                    }
                }
            }
        }
    }

    dispatchRoleEvent(eventName, data = {}) {
        const event = new CustomEvent(`role_${eventName}`, {
            detail: { ...data, timestamp: new Date().toISOString() }
        });
        window.dispatchEvent(event);
    }

    // ===== NOTIFICATION METHODS =====
    showNotification(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showNotification) {
            app.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // ===== ROLE VALIDATION =====
    validateRoleTransition(oldRole, newRole) {
        // Define allowed transitions
        const allowedTransitions = {
            'borrower': ['both'], // Borrower can become both
            'lender': ['both'],   // Lender can become both
            'both': ['borrower', 'lender'], // Both can switch between
            'admin': [] // Admin cannot switch
        };
        
        if (!allowedTransitions[oldRole] || !allowedTransitions[oldRole].includes(newRole)) {
            throw new Error(`Cannot switch from ${oldRole} to ${newRole}`);
        }
        
        return true;
    }

    // ===== ROLE-BASED DATA FILTERING =====
    filterDataByRole(data, context) {
        const role = this.currentRole;
        const perms = this.getCurrentPermissions();
        
        if (!role || !data) return data;
        
        switch (context) {
            case 'groups':
                // For borrowers and lenders, show only groups in their country
                if (role !== 'admin') {
                    const userCountry = auth.currentUser?.country;
                    return data.filter(group => group.country === userCountry);
                }
                break;
                
            case 'loan_requests':
                // For lenders, show only requests from their groups
                if (role === 'lender' || role === 'both') {
                    const userGroups = auth.currentUser?.groups || [];
                    return data.filter(request => 
                        userGroups.includes(request.groupId)
                    );
                }
                // For borrowers, show only their own requests
                else if (role === 'borrower') {
                    const userId = auth.currentUser?.id;
                    return data.filter(request => request.borrowerId === userId);
                }
                break;
                
            case 'ledgers':
                // For lenders, show only their ledgers
                if (role === 'lender' || role === 'both') {
                    const userId = auth.currentUser?.id;
                    return data.filter(ledger => ledger.lenderId === userId);
                }
                // For borrowers, show only ledgers where they are the borrower
                else if (role === 'borrower') {
                    const userId = auth.currentUser?.id;
                    return data.filter(ledger => ledger.borrowerId === userId);
                }
                break;
                
            case 'users':
                // For non-admins, restrict user data visibility
                if (role !== 'admin') {
                    return data.map(user => ({
                        id: user.id,
                        name: user.name,
                        rating: user.rating,
                        groups: user.groups,
                        // Hide sensitive information
                        email: user.email ? user.email.charAt(0) + '***' + user.email.split('@')[1] : '',
                        phone: user.phone ? user.phone.slice(0, -4) + '****' : '',
                        country: user.country
                    }));
                }
                break;
        }
        
        return data;
    }

    // ===== ROLE-BASED FEATURE FLAGS =====
    getFeatureFlags() {
        const perms = this.getCurrentPermissions();
        return perms.features;
    }

    isFeatureEnabled(feature) {
        const flags = this.getFeatureFlags();
        return flags[feature] === true;
    }

    // ===== ROLE METRICS =====
    getRoleMetrics() {
        const role = this.currentRole;
        const user = auth.currentUser;
        
        if (!role || !user) return null;
        
        const metrics = {
            role: role,
            features: Object.keys(this.getFeatureFlags()).filter(f => this.isFeatureEnabled(f)),
            restrictions: this.getCurrentPermissions().restrictions,
            stats: {}
        };
        
        // Add role-specific stats
        switch (role) {
            case 'borrower':
                metrics.stats = {
                    activeLoans: user.activeLoans || 0,
                    totalLoans: user.totalLoans || 0,
                    repaymentRate: user.repaymentRate || 0,
                    groups: user.groups?.length || 0,
                    rating: user.rating || 0
                };
                break;
                
            case 'lender':
                metrics.stats = {
                    totalLent: user.totalLent || 0,
                    activeLedgers: user.activeLedgers || 0,
                    subscription: user.subscription || 'none',
                    subscriptionExpiry: user.subscriptionExpiry,
                    rating: user.rating || 0
                };
                break;
                
            case 'both':
                metrics.stats = {
                    activeLoans: user.activeLoans || 0,
                    totalLoans: user.totalLoans || 0,
                    totalLent: user.totalLent || 0,
                    activeLedgers: user.activeLedgers || 0,
                    groups: user.groups?.length || 0,
                    subscription: user.subscription || 'none',
                    repaymentRate: user.repaymentRate || 0,
                    rating: user.rating || 0
                };
                break;
        }
        
        return metrics;
    }
}

// Create global instance
const roleManager = new RoleManager();

// Make available globally
window.roleManager = roleManager;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RoleManager, roleManager };
}