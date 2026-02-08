/**
 * M-PESEWA STRICT ROUTER
 * Enforces global hierarchy: Global → Country → Groups → Lenders → Borrowers
 * NO CROSS-COUNTRY ACCESS ALLOWED
 */

class MpesewaRouter {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.currentCountry = null;
        this.currentGroup = null;
        this.currentRole = null;
        
        // Hierarchy validation
        this.hierarchyStack = [];
        
        // Initialize router
        this.init();
    }
    
    init() {
        // Define strict route hierarchy
        this.defineRoutes();
        
        // Set up event listeners
        window.addEventListener('popstate', (e) => this.handleRouteChange());
        document.addEventListener('click', (e) => this.handleLinkClick(e));
        
        // Load initial route
        this.handleRouteChange();
    }
    
    defineRoutes() {
        // GLOBAL LEVEL ROUTES (No country context)
        this.routes.set('/', {
            file: 'index.html',
            level: 'global',
            guards: []
        });
        
        this.routes.set('/auth/login', {
            file: 'auth/login.html',
            level: 'global',
            guards: []
        });
        
        this.routes.set('/auth/register', {
            file: 'auth/register.html',
            level: 'global',
            guards: []
        });
        
        // COUNTRY LEVEL ROUTES (Requires country context)
        this.routes.set('/country/select', {
            file: 'global-pages/countries.html',
            level: 'country-select',
            guards: ['authenticated']
        });
        
        // GROUP LEVEL ROUTES (Requires group context)
        this.routes.set('/groups', {
            file: 'groups/pages/group-list.html',
            level: 'group',
            guards: ['authenticated', 'country-selected']
        });
        
        this.routes.set('/groups/create', {
            file: 'groups/pages/group-create.html',
            level: 'group',
            guards: ['authenticated', 'country-selected']
        });
        
        this.routes.set('/groups/:id/dashboard', {
            file: 'groups/pages/group-dashboard.html',
            level: 'group',
            guards: ['authenticated', 'country-selected', 'group-member']
        });
        
        // LENDER LEVEL ROUTES
        this.routes.set('/lender/dashboard', {
            file: 'lender/pages/lender-dashboard.html',
            level: 'lender',
            guards: ['authenticated', 'country-selected', 'group-member', 'lender-role', 'subscription-active']
        });
        
        this.routes.set('/lender/ledgers', {
            file: 'ledger/pages/ledger-list.html',
            level: 'lender',
            guards: ['authenticated', 'country-selected', 'group-member', 'lender-role', 'subscription-active']
        });
        
        this.routes.set('/lender/subscription', {
            file: 'subscription/status.html',
            level: 'lender',
            guards: ['authenticated', 'country-selected', 'group-member', 'lender-role']
        });
        
        // BORROWER LEVEL ROUTES
        this.routes.set('/borrower/dashboard', {
            file: 'borrower/pages/borrower-dashboard.html',
            level: 'borrower',
            guards: ['authenticated', 'country-selected', 'group-member', 'borrower-role', 'not-blacklisted']
        });
        
        this.routes.set('/borrower/apply', {
            file: 'borrower/pages/borrow-request.html',
            level: 'borrower',
            guards: ['authenticated', 'country-selected', 'group-member', 'borrower-role', 'not-blacklisted', 'eligible-to-borrow']
        });
        
        // EMERGENCY HUB ROUTES
        this.routes.set('/emergency-hub', {
            file: 'global-pages/emergency-hub.html',
            level: 'global',
            guards: []
        });
        
        this.routes.set('/emergency-hub/:category', {
            file: 'global-pages/emergency-category.html',
            level: 'global',
            guards: []
        });
        
        // ADMIN ROUTES
        this.routes.set('/admin/login', {
            file: 'admin/admin-login.html',
            level: 'admin',
            guards: []
        });
        
        this.routes.set('/admin/dashboard', {
            file: 'admin/admin-dashboard.html',
            level: 'admin',
            guards: ['authenticated', 'admin-role']
        });
        
        // GLOBAL PAGES
        this.routes.set('/about', {
            file: 'global-pages/about.html',
            level: 'global',
            guards: []
        });
        
        this.routes.set('/terms', {
            file: 'global-pages/terms.html',
            level: 'global',
            guards: []
        });
        
        this.routes.set('/privacy', {
            file: 'global-pages/privacy.html',
            level: 'global',
            guards: []
        });
        
        this.routes.set('/debt-collectors', {
            file: 'global-pages/collectors.html',
            level: 'global',
            guards: []
        });
        
        this.routes.set('/blacklist', {
            file: 'blacklist/pages/blacklist-public.html',
            level: 'global',
            guards: []
        });
    }
    
    async navigate(path, state = {}) {
        // Validate path exists
        if (!this.routes.has(path)) {
            console.error(`Route not found: ${path}`);
            this.navigate('/404');
            return;
        }
        
        const route = this.routes.get(path);
        
        // Run guards
        const guardResult = await this.runGuards(route.guards, path);
        if (!guardResult.allowed) {
            console.warn(`Navigation blocked: ${guardResult.reason}`);
            this.redirectToFallback(guardResult);
            return;
        }
        
        // Update browser history
        history.pushState(state, '', path);
        
        // Load route
        await this.loadRoute(route, path);
        
        // Update current state
        this.currentRoute = path;
        this.updateHierarchyStack(route.level);
        
        // Dispatch route change event
        window.dispatchEvent(new CustomEvent('routechange', {
            detail: { route: path, level: route.level }
        }));
    }
    
    async runGuards(guardNames, targetPath) {
        for (const guardName of guardNames) {
            const guard = this.guards[guardName];
            if (guard) {
                const result = await guard(targetPath);
                if (!result.allowed) {
                    return result;
                }
            }
        }
        return { allowed: true };
    }
    
    guards = {
        'authenticated': async (path) => {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || 'null');
            if (!user || !user.id) {
                return {
                    allowed: false,
                    reason: 'User not authenticated',
                    redirect: '/auth/login'
                };
            }
            return { allowed: true };
        },
        
        'country-selected': async (path) => {
            const country = localStorage.getItem('mpesewa_country');
            if (!country) {
                return {
                    allowed: false,
                    reason: 'Country not selected',
                    redirect: '/country/select'
                };
            }
            return { allowed: true };
        },
        
        'group-member': async (path) => {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || 'null');
            const groupId = localStorage.getItem('mpesewa_current_group');
            
            if (!groupId) {
                return {
                    allowed: false,
                    reason: 'Not a member of any group',
                    redirect: '/groups'
                };
            }
            
            // Check if user is member of this group
            const userGroups = JSON.parse(localStorage.getItem(`user_${user.id}_groups`) || '[]');
            if (!userGroups.includes(groupId)) {
                return {
                    allowed: false,
                    reason: 'Not a member of current group',
                    redirect: '/groups'
                };
            }
            
            return { allowed: true };
        },
        
        'lender-role': async (path) => {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || 'null');
            if (!user.roles || !user.roles.includes('lender')) {
                return {
                    allowed: false,
                    reason: 'User is not a lender',
                    redirect: '/borrower/dashboard'
                };
            }
            return { allowed: true };
        },
        
        'borrower-role': async (path) => {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || 'null');
            if (!user.roles || !user.roles.includes('borrower')) {
                return {
                    allowed: false,
                    reason: 'User is not a borrower',
                    redirect: '/lender/dashboard'
                };
            }
            return { allowed: true };
        },
        
        'subscription-active': async (path) => {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || 'null');
            const subscription = JSON.parse(localStorage.getItem(`subscription_${user.id}`) || 'null');
            
            if (!subscription || subscription.status !== 'active') {
                return {
                    allowed: false,
                    reason: 'Subscription not active',
                    redirect: '/lender/subscription'
                };
            }
            
            // Check expiry date (28th of each month)
            const today = new Date();
            const expiryDate = new Date(subscription.expiry);
            
            if (today > expiryDate) {
                return {
                    allowed: false,
                    reason: 'Subscription expired',
                    redirect: '/lender/subscription'
                };
            }
            
            return { allowed: true };
        },
        
        'not-blacklisted': async (path) => {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || 'null');
            const blacklistStatus = JSON.parse(localStorage.getItem(`blacklist_${user.id}`) || 'null');
            
            if (blacklistStatus && blacklistStatus.isBlacklisted) {
                return {
                    allowed: false,
                    reason: 'User is blacklisted',
                    redirect: '/blacklist'
                };
            }
            return { allowed: true };
        },
        
        'eligible-to-borrow': async (path) => {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || 'null');
            const groupId = localStorage.getItem('mpesewa_current_group');
            
            // Check if user has active loans in this group (max 1 per group)
            const activeLoans = JSON.parse(localStorage.getItem(`user_${user.id}_active_loons`) || '[]');
            const loansInGroup = activeLoans.filter(loan => loan.groupId === groupId);
            
            if (loansInGroup.length >= 1) {
                return {
                    allowed: false,
                    reason: 'Maximum active loans per group reached',
                    redirect: '/borrower/dashboard'
                };
            }
            
            return { allowed: true };
        },
        
        'admin-role': async (path) => {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || 'null');
            if (!user.roles || !user.roles.includes('admin')) {
                return {
                    allowed: false,
                    reason: 'Admin access required',
                    redirect: '/'
                };
            }
            return { allowed: true };
        }
    };
    
    redirectToFallback(guardResult) {
        if (guardResult.redirect) {
            this.navigate(guardResult.redirect);
        } else {
            this.navigate('/');
        }
    }
    
    async loadRoute(route, path) {
        try {
            // Load the HTML file
            const response = await fetch(route.file);
            if (!response.ok) {
                throw new Error(`Failed to load ${route.file}`);
            }
            
            const html = await response.text();
            
            // Inject into main container
            const appContainer = document.getElementById('app-container') || document.body;
            appContainer.innerHTML = html;
            
            // Execute any scripts in the loaded HTML
            this.executeScripts(appContainer);
            
            // Update page title
            this.updatePageTitle(path);
            
            // Dispatch loaded event
            window.dispatchEvent(new CustomEvent('pageloaded', {
                detail: { path, route }
            }));
            
        } catch (error) {
            console.error('Route load error:', error);
            this.navigate('/error');
        }
    }
    
    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
    
    updatePageTitle(path) {
        const titleMap = {
            '/': 'M-Pesewa - Emergency Micro-Lending',
            '/lender/dashboard': 'Lender Dashboard - M-Pesewa',
            '/borrower/dashboard': 'Borrower Dashboard - M-Pesewa',
            '/emergency-hub': 'Emergency Loan Categories - M-Pesewa',
            '/admin/dashboard': 'Admin Dashboard - M-Pesewa'
        };
        
        document.title = titleMap[path] || 'M-Pesewa';
    }
    
    updateHierarchyStack(level) {
        // Maintain hierarchy stack for breadcrumbs
        switch(level) {
            case 'global':
                this.hierarchyStack = ['Global'];
                break;
            case 'country':
                const country = localStorage.getItem('mpesewa_country') || 'Country';
                this.hierarchyStack = ['Global', country];
                break;
            case 'group':
                const groupName = localStorage.getItem('mpesewa_current_group_name') || 'Group';
                this.hierarchyStack = ['Global', 
                    localStorage.getItem('mpesewa_country') || 'Country', 
                    groupName];
                break;
            case 'lender':
                this.hierarchyStack = ['Global',
                    localStorage.getItem('mpesewa_country') || 'Country',
                    localStorage.getItem('mpesewa_current_group_name') || 'Group',
                    'Lender'];
                break;
            case 'borrower':
                this.hierarchyStack = ['Global',
                    localStorage.getItem('mpesewa_country') || 'Country',
                    localStorage.getItem('mpesewa_current_group_name') || 'Group',
                    'Borrower'];
                break;
        }
        
        // Update breadcrumbs in UI
        this.updateBreadcrumbs();
    }
    
    updateBreadcrumbs() {
        const breadcrumbContainer = document.getElementById('breadcrumbs');
        if (!breadcrumbContainer) return;
        
        breadcrumbContainer.innerHTML = this.hierarchyStack
            .map((item, index) => {
                if (index === this.hierarchyStack.length - 1) {
                    return `<span class="breadcrumb-current">${item}</span>`;
                }
                return `<span class="breadcrumb-item">${item}</span>`;
            })
            .join(' › ');
    }
    
    handleRouteChange() {
        const path = window.location.pathname || '/';
        this.navigate(path);
    }
    
    handleLinkClick(e) {
        // Handle internal navigation
        const link = e.target.closest('a[data-internal]');
        if (link && link.href) {
            e.preventDefault();
            const url = new URL(link.href);
            this.navigate(url.pathname);
        }
    }
    
    // Helper methods for app
    setCountry(countryCode) {
        localStorage.setItem('mpesewa_country', countryCode);
        this.currentCountry = countryCode;
        window.dispatchEvent(new CustomEvent('countrychanged', {
            detail: { country: countryCode }
        }));
    }
    
    setGroup(groupId, groupName) {
        localStorage.setItem('mpesewa_current_group', groupId);
        localStorage.setItem('mpesewa_current_group_name', groupName);
        this.currentGroup = groupId;
        window.dispatchEvent(new CustomEvent('groupchanged', {
            detail: { groupId, groupName }
        }));
    }
    
    setRole(role) {
        this.currentRole = role;
        window.dispatchEvent(new CustomEvent('rolechanged', {
            detail: { role }
        }));
    }
    
    // Country isolation enforcement
    enforceCountryIsolation() {
        const userCountry = localStorage.getItem('mpesewa_country');
        const currentPath = window.location.pathname;
        
        // Block cross-country access
        if (userCountry && currentPath.includes('/country/') && !currentPath.includes('/country/select')) {
            const pathCountry = currentPath.split('/')[2];
            if (pathCountry !== userCountry) {
                console.warn(`Cross-country access blocked: ${pathCountry} vs ${userCountry}`);
                this.navigate(`/country/${userCountry}/dashboard`);
            }
        }
    }
    
    // Group isolation enforcement
    enforceGroupIsolation() {
        const userGroup = localStorage.getItem('mpesewa_current_group');
        
        // If user tries to access group-specific pages without group context
        const groupPaths = ['/groups/', '/lender/', '/borrower/', '/ledger/'];
        const isGroupPath = groupPaths.some(path => window.location.pathname.includes(path));
        
        if (isGroupPath && !userGroup) {
            this.navigate('/groups');
        }
    }
}

// Export singleton instance
const mpesewaRouter = new MpesewaRouter();
window.MpesewaRouter = mpesewaRouter;
export default mpesewaRouter;