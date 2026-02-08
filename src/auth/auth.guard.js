/**
 * M-Pesewa Authentication Guard
 * Strict route protection and hierarchy enforcement
 */

class AuthGuard {
    constructor() {
        this.authService = window.AuthService || null;
        this.protectedRoutes = {
            // Borrower routes
            '/borrower/': 'borrower',
            '/pages/borrower/': 'borrower',
            
            // Lender routes
            '/lender/': 'lender',
            '/pages/lender/': 'lender',
            
            // Admin routes
            '/admin/': 'admin',
            '/pages/admin/': 'admin',
            
            // Group routes
            '/groups/': ['borrower', 'lender'],
            '/pages/groups/': ['borrower', 'lender'],
            
            // Ledger routes
            '/ledger/': 'lender',
            '/pages/ledger/': 'lender',
            
            // Subscription routes
            '/subscription/': 'lender',
            '/pages/subscription/': 'lender'
        };
        
        this.publicRoutes = [
            '/',
            '/index.html',
            '/auth/login.html',
            '/auth/register.html',
            '/auth/forgot.html',
            '/auth/reset.html',
            '/auth/verify.html',
            '/auth/device-verification.html',
            '/auth/session-expired.html',
            '/pages/global-pages/',
            '/pages/countries/'
        ];
        
        this.init();
    }

    init() {
        // Auto-protect on page load
        this.protectCurrentRoute();
        
        // Listen for navigation
        this.setupNavigationInterceptor();
    }

    /**
     * Protect current route based on access rules
     */
    protectCurrentRoute() {
        const currentPath = window.location.pathname;
        
        // Skip protection for public routes
        if (this.isPublicRoute(currentPath)) {
            return;
        }

        // Check authentication
        if (!this.authService || !this.authService.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }

        // Get required role for current route
        const requiredRole = this.getRequiredRole(currentPath);
        
        if (requiredRole) {
            // Check if user has required role
            if (Array.isArray(requiredRole)) {
                if (!requiredRole.includes(this.authService.getCurrentRole())) {
                    this.redirectToAccessDenied();
                    return;
                }
            } else if (this.authService.getCurrentRole() !== requiredRole) {
                this.redirectToAccessDenied();
                return;
            }
        }

        // Enforce country isolation
        this.enforceCountryIsolation(currentPath);
        
        // Enforce subscription requirements for lenders
        this.enforceSubscriptionRequirements();
        
        // Enforce blacklist restrictions
        this.enforceBlacklistRestrictions();
    }

    /**
     * Check if route is public
     * @param {string} path - Route path
     * @returns {boolean}
     */
    isPublicRoute(path) {
        return this.publicRoutes.some(route => path.includes(route));
    }

    /**
     * Get required role for route
     * @param {string} path - Route path
     * @returns {string|Array|null} - Required role(s)
     */
    getRequiredRole(path) {
        for (const [route, role] of Object.entries(this.protectedRoutes)) {
            if (path.includes(route)) {
                return role;
            }
        }
        return null;
    }

    /**
     * Enforce country isolation rules
     * @param {string} path - Current path
     */
    enforceCountryIsolation(path) {
        const userCountry = this.authService.getCurrentCountry();
        
        if (!userCountry) {
            this.redirectToCountrySelection();
            return;
        }

        // Check if accessing country-specific content
        const countryPaths = [
            '/countries/', '/ke/', '/ug/', '/tz/', '/rw/', '/bi/', '/cd/', '/ss/', '/za/', '/ng/', '/gh/', '/et/', '/so/'
        ];
        
        for (const countryPath of countryPaths) {
            if (path.includes(countryPath)) {
                const pathCountry = countryPath.replace(/\//g, '').toUpperCase();
                if (pathCountry && pathCountry !== 'COUNTRIES' && userCountry !== pathCountry) {
                    this.redirectToAccessDenied('Cross-country access is strictly prohibited');
                    return;
                }
            }
        }
    }

    /**
     * Enforce subscription requirements for lenders
     */
    enforceSubscriptionRequirements() {
        const userRole = this.authService.getCurrentRole();
        
        if (userRole === 'lender') {
            const subscription = this.authService.getSubscriptionStatus();
            
            if (!subscription || subscription.status !== 'active') {
                // Allow access to subscription pages
                const currentPath = window.location.pathname;
                const allowedPaths = ['/subscription/', '/auth/verify.html', '/auth/'];
                
                if (!allowedPaths.some(path => currentPath.includes(path))) {
                    this.redirectToSubscriptionRequired();
                    return;
                }
            }
            
            // Check if subscription is expired (expires on 28th)
            if (subscription && subscription.expiresAt) {
                const expiryDate = new Date(subscription.expiresAt);
                const today = new Date();
                
                if (today > expiryDate) {
                    this.authService.currentUser.subscription.status = 'expired';
                    localStorage.setItem('mpesewa_user_data', JSON.stringify(this.authService.currentUser));
                    
                    if (!window.location.pathname.includes('/subscription/expired.html')) {
                        window.location.href = '/pages/subscription/expired.html';
                    }
                }
            }
        }
    }

    /**
     * Enforce blacklist restrictions
     */
    enforceBlacklistRestrictions() {
        const userData = this.authService.currentUser;
        
        if (userData && userData.blacklistStatus && userData.blacklistStatus.isBlacklisted) {
            // Blacklisted users can only access certain pages
            const allowedForBlacklisted = [
                '/auth/login.html',
                '/auth/logout',
                '/pages/blacklist/',
                '/pages/global-pages/contact.html'
            ];
            
            const currentPath = window.location.pathname;
            const isAllowed = allowedForBlacklisted.some(path => currentPath.includes(path));
            
            if (!isAllowed) {
                this.redirectToBlacklistPage();
                return;
            }
        }
    }

    /**
     * Setup navigation interceptor
     */
    setupNavigationInterceptor() {
        // Intercept link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const href = link.href;
                const isSameOrigin = href.startsWith(window.location.origin);
                
                if (isSameOrigin) {
                    const path = new URL(href).pathname;
                    
                    // Check if navigation requires protection
                    if (!this.isPublicRoute(path)) {
                        if (!this.authService || !this.authService.isAuthenticated()) {
                            e.preventDefault();
                            this.redirectToLogin();
                            return;
                        }
                        
                        // Check role-based access
                        const requiredRole = this.getRequiredRole(path);
                        if (requiredRole) {
                            const userRole = this.authService.getCurrentRole();
                            
                            if (Array.isArray(requiredRole)) {
                                if (!requiredRole.includes(userRole)) {
                                    e.preventDefault();
                                    this.redirectToAccessDenied();
                                    return;
                                }
                            } else if (userRole !== requiredRole) {
                                e.preventDefault();
                                this.redirectToAccessDenied();
                                return;
                            }
                        }
                    }
                }
            }
        });

        // Intercept form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const action = form.getAttribute('action');
            
            if (action) {
                const isSameOrigin = action.startsWith(window.location.origin) || 
                                    action.startsWith('/') || 
                                    action.startsWith('./') || 
                                    action.startsWith('../');
                
                if (isSameOrigin) {
                    const url = new URL(action, window.location.href);
                    const path = url.pathname;
                    
                    if (!this.isPublicRoute(path)) {
                        if (!this.authService || !this.authService.isAuthenticated()) {
                            e.preventDefault();
                            this.redirectToLogin();
                            return;
                        }
                    }
                }
            }
        });
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        if (!window.location.pathname.includes('/auth/login.html')) {
            const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/auth/login.html?return=${returnUrl}`;
        }
    }

    /**
     * Redirect to access denied page
     * @param {string} message - Optional error message
     */
    redirectToAccessDenied(message = '') {
        if (!window.location.pathname.includes('/access-denied.html')) {
            const params = new URLSearchParams();
            if (message) params.set('message', message);
            window.location.href = `/pages/global-pages/access-denied.html?${params.toString()}`;
        }
    }

    /**
     * Redirect to country selection
     */
    redirectToCountrySelection() {
        if (!window.location.pathname.includes('/pages/countries/')) {
            window.location.href = '/pages/countries/countries.html';
        }
    }

    /**
     * Redirect to subscription required page
     */
    redirectToSubscriptionRequired() {
        if (!window.location.pathname.includes('/subscription/')) {
            window.location.href = '/pages/subscription/expired.html';
        }
    }

    /**
     * Redirect to blacklist page
     */
    redirectToBlacklistPage() {
        if (!window.location.pathname.includes('/pages/blacklist/')) {
            window.location.href = '/pages/blacklist/blacklist-status.html';
        }
    }

    /**
     * Check if user can access route
     * @param {string} route - Route to check
     * @returns {boolean}
     */
    canAccess(route) {
        if (this.isPublicRoute(route)) {
            return true;
        }

        if (!this.authService || !this.authService.isAuthenticated()) {
            return false;
        }

        const requiredRole = this.getRequiredRole(route);
        if (!requiredRole) {
            return true;
        }

        const userRole = this.authService.getCurrentRole();
        
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(userRole);
        }
        
        return userRole === requiredRole;
    }

    /**
     * Get user's accessible routes
     * @returns {Array} - Array of accessible route patterns
     */
    getAccessibleRoutes() {
        const userRole = this.authService ? this.authService.getCurrentRole() : null;
        const accessible = [...this.publicRoutes];
        
        for (const [route, role] of Object.entries(this.protectedRoutes)) {
            if (!role || (Array.isArray(role) && role.includes(userRole)) || role === userRole) {
                accessible.push(route);
            }
        }
        
        return accessible;
    }

    /**
     * Check if user is in a specific country
     * @param {string} countryCode - Country code to check
     * @returns {boolean}
     */
    isUserInCountry(countryCode) {
        return this.authService && this.authService.isInCountry(countryCode);
    }

    /**
     * Check if user has active subscription (for lenders)
     * @returns {boolean}
     */
    hasActiveSubscription() {
        return this.authService && this.authService.isSubscriptionActive();
    }

    /**
     * Get user's group access level
     * @param {string} groupId - Group ID to check
     * @returns {string} - Access level: 'admin', 'member', 'none'
     */
    getGroupAccessLevel(groupId) {
        if (!this.authService || !this.authService.currentUser) {
            return 'none';
        }
        
        const user = this.authService.currentUser;
        
        // Check if user is group admin
        if (user.groupId === groupId && user.isGroupAdmin) {
            return 'admin';
        }
        
        // Check if user is group member
        if (user.currentGroups && user.currentGroups.includes(groupId)) {
            return 'member';
        }
        
        return 'none';
    }

    /**
     * Check if user can join more groups
     * @returns {boolean}
     */
    canJoinMoreGroups() {
        if (!this.authService || !this.authService.currentUser) {
            return false;
        }
        
        const user = this.authService.currentUser;
        
        // Borrowers can join up to 4 groups
        if (user.role === 'borrower') {
            const currentGroups = user.currentGroups || [];
            return currentGroups.length < user.maxGroups;
        }
        
        // Lenders can only be in one group (their primary group)
        return false;
    }

    /**
     * Check if user has good rating (required for joining additional groups)
     * @returns {boolean}
     */
    hasGoodRating() {
        if (!this.authService || !this.authService.currentUser) {
            return false;
        }
        
        const user = this.authService.currentUser;
        
        // Only borrowers have ratings
        if (user.role !== 'borrower') {
            return true;
        }
        
        // Good rating is 3 stars or above
        return user.rating >= 3;
    }
}

// Initialize guard
const authGuard = new AuthGuard();
window.AuthGuard = authGuard;

export default authGuard;