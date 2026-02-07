/**
 * M-PESEWA REDIRECTS MANAGER
 * Handles all URL redirections based on business rules and hierarchy
 * STRICT ENFORCEMENT: All redirects must follow country→group→role hierarchy
 */

class RedirectsManager {
    constructor() {
        // Country code mappings
        this.countryCodes = {
            'KE': { name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
            'UG': { name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
            'TZ': { name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
            'RW': { name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
            'BI': { name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
            'CD': { name: 'DRC', currency: 'CDF', flag: '🇨🇩' },
            'NG': { name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
            'GH': { name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
            'SS': { name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
            'SO': { name: 'Somalia', currency: 'SOS', flag: '🇸🇴' },
            'ZA': { name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
            'ET': { name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' }
        };
        
        // Page access rules
        this.accessRules = {
            // Public pages (no auth required)
            public: [
                '/', '/index.html',
                '/auth/login.html', '/auth/register.html', '/auth/forgot.html',
                '/about.html', '/how-it-works.html', '/faq.html', '/contact.html',
                '/terms.html', '/privacy.html', '/countries.html',
                '/emergency/index.html', '/collectors.html',
                '/blacklist/public.html'
            ],
            
            // Borrower pages (requires borrower role)
            borrower: [
                '/borrower/dashboard.html', '/borrower/apply.html',
                '/borrower/history.html', '/borrower/repayments.html',
                '/borrower/disputes.html', '/borrower/profile.html'
            ],
            
            // Lender pages (requires lender role and active subscription)
            lender: [
                '/lender/dashboard.html', '/lender/portfolio.html',
                '/lender/history.html', '/lender/rules.html',
                '/lender/risk.html', '/lender/profile.html'
            ],
            
            // Admin pages (requires admin role)
            admin: [
                '/admin/dashboard.html', '/admin/users.html',
                '/admin/groups.html', '/admin/ledgers.html',
                '/admin/blacklist.html', '/admin/subscriptions.html',
                '/admin/settings.html', '/admin/impersonate.html'
            ],
            
            // Group pages (requires group membership)
            group: [
                '/groups/dashboard.html', '/groups/members.html',
                '/groups/settings.html', '/groups/invites.html'
            ],
            
            // Country-specific pages (requires country selection)
            country: [
                '/countries/kenya.html', '/countries/uganda.html',
                '/countries/tanzania.html', '/countries/rwanda.html',
                '/countries/burundi.html', '/countries/drc.html',
                '/countries/nigeria.html', '/countries/ghana.html',
                '/countries/south-sudan.html', '/countries/somalia.html',
                '/countries/south-africa.html', '/countries/ethiopia.html'
            ],
            
            // Subscription pages (lenders only)
            subscription: [
                '/subscription/plans.html', '/subscription/current.html',
                '/subscription/upgrade.html', '/subscription/history.html',
                '/subscription/invoices.html'
            ]
        };
        
        // Redirect mappings
        this.redirectMappings = {
            // Default redirects
            '/home': '/',
            '/index': '/',
            '/login': '/auth/login.html',
            '/register': '/auth/register.html',
            '/signup': '/auth/register.html',
            '/signin': '/auth/login.html',
            
            // Country redirects
            '/kenya': '/countries/kenya.html',
            '/uganda': '/countries/uganda.html',
            '/tanzania': '/countries/tanzania.html',
            '/rwanda': '/countries/rwanda.html',
            '/burundi': '/countries/burundi.html',
            '/drc': '/countries/drc.html',
            '/congo': '/countries/drc.html',
            '/nigeria': '/countries/nigeria.html',
            '/ghana': '/countries/ghana.html',
            '/south-sudan': '/countries/south-sudan.html',
            '/somalia': '/countries/somalia.html',
            '/south-africa': '/countries/south-africa.html',
            '/ethiopia': '/countries/ethiopia.html',
            
            // Emergency category redirects
            '/emergency': '/emergency/index.html',
            '/categories': '/emergency/index.html',
            '/loan-categories': '/emergency/index.html',
            
            // Legacy URL support
            '/old-dashboard': '/borrower/dashboard.html',
            '/old-portfolio': '/lender/portfolio.html',
            '/old-settings': '/user/settings.html'
        };
        
        this.initialize();
    }

    /**
     * Initialize redirects manager
     */
    initialize() {
        console.log('[RedirectsManager] Initializing redirect manager');
        
        // Set up URL change listener
        this.setupURLObserver();
        
        // Process current URL
        this.processCurrentURL();
        
        // Set up link interception
        this.setupLinkInterception();
        
        console.log('[RedirectsManager] Redirect manager initialized');
    }

    /**
     * Set up URL change observer
     */
    setupURLObserver() {
        // Store original pushState and replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        // Override pushState
        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            this.handleURLChange(window.location.href);
        };
        
        // Override replaceState
        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args);
            this.handleURLChange(window.location.href);
        };
        
        // Listen to popstate (back/forward navigation)
        window.addEventListener('popstate', () => {
            this.handleURLChange(window.location.href);
        });
        
        // Listen to hash changes
        window.addEventListener('hashchange', () => {
            this.handleURLChange(window.location.href);
        });
    }

    /**
     * Set up link click interception
     */
    setupLinkInterception() {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            
            if (!link || !link.href) return;
            
            // Check if it's a same-origin link
            const url = new URL(link.href);
            const currentUrl = new URL(window.location.href);
            
            if (url.origin === currentUrl.origin) {
                // Check if we need to process this link
                if (this.shouldProcessLink(link)) {
                    event.preventDefault();
                    this.processLinkClick(link);
                }
            }
        }, true); // Use capture phase to catch all links
    }

    /**
     * Check if link should be processed
     */
    shouldProcessLink(link) {
        const href = link.getAttribute('href');
        
        // Skip if no href or anchor link
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
            return false;
        }
        
        // Skip if target="_blank"
        if (link.target === '_blank') {
            return false;
        }
        
        // Skip download links
        if (link.hasAttribute('download')) {
            return false;
        }
        
        return true;
    }

    /**
     * Process link click
     */
    async processLinkClick(link) {
        const href = link.getAttribute('href');
        const targetUrl = new URL(href, window.location.origin);
        
        // Check access before navigation
        const canAccess = await this.checkPageAccess(targetUrl.pathname);
        
        if (canAccess) {
            // Navigate to page
            window.location.href = href;
        } else {
            // Show access denied
            this.showAccessDenied(targetUrl.pathname);
        }
    }

    /**
     * Process current URL
     */
    processCurrentURL() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const searchParams = new URLSearchParams(window.location.search);
        
        console.log(`[RedirectsManager] Processing URL: ${currentPath}`);
        
        // Check for redirect mappings
        const redirectTo = this.redirectMappings[currentPath];
        if (redirectTo && redirectTo !== currentPath) {
            console.log(`[RedirectsManager] Redirecting ${currentPath} → ${redirectTo}`);
            this.redirect(redirectTo, 301);
            return;
        }
        
        // Check page access
        this.checkPageAccess(currentPath).then(canAccess => {
            if (!canAccess) {
                this.handleAccessDenied(currentPath);
            }
        });
        
        // Process URL parameters
        this.processURLParameters(searchParams);
        
        // Process hash
        if (currentHash) {
            this.processHash(currentHash);
        }
    }

    /**
     * Handle URL change
     */
    handleURLChange(url) {
        const newUrl = new URL(url);
        const path = newUrl.pathname;
        
        console.log(`[RedirectsManager] URL changed to: ${path}`);
        
        // Update active navigation
        this.updateActiveNavigation(path);
        
        // Track page view
        this.trackPageView(path);
    }

    /**
     * Update active navigation state
     */
    updateActiveNavigation(path) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Find and activate current page link
        const normalizedPath = path.replace(/\.html$/, '');
        const selectors = [
            `a[href="${path}"], a[href="${normalizedPath}"]`,
            `a[href="${path}.html"]`,
            `a[href="${normalizedPath}.html"]`
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(link => {
                link.classList.add('active');
            });
        });
        
        // Update breadcrumbs if they exist
        this.updateBreadcrumbs(path);
    }

    /**
     * Update breadcrumbs
     */
    updateBreadcrumbs(path) {
        const breadcrumbs = document.getElementById('breadcrumbs');
        if (!breadcrumbs) return;
        
        const parts = path.split('/').filter(part => part);
        let html = '<nav class="breadcrumb-nav" aria-label="Breadcrumb">';
        html += '<ol>';
        
        // Home link
        html += '<li><a href="/">Home</a></li>';
        
        // Build breadcrumb trail
        let currentPath = '';
        parts.forEach((part, index) => {
            currentPath += '/' + part;
            const name = this.getPageName(part, index === parts.length - 1);
            
            if (index === parts.length - 1) {
                // Current page
                html += `<li aria-current="page">${name}</li>`;
            } else {
                // Parent page
                html += `<li><a href="${currentPath}">${name}</a></li>`;
            }
        });
        
        html += '</ol></nav>';
        breadcrumbs.innerHTML = html;
    }

    /**
     * Get page name for breadcrumbs
     */
    getPageName(pathPart, isCurrent) {
        // Remove .html extension
        const name = pathPart.replace('.html', '');
        
        // Map common paths to friendly names
        const nameMap = {
            'auth': 'Authentication',
            'login': 'Login',
            'register': 'Register',
            'borrower': 'Borrower',
            'lender': 'Lender',
            'dashboard': 'Dashboard',
            'apply': 'Apply for Loan',
            'history': 'History',
            'repayments': 'Repayments',
            'disputes': 'Disputes',
            'portfolio': 'Portfolio',
            'rules': 'Rules',
            'risk': 'Risk Management',
            'emergency': 'Emergency Hub',
            'subscription': 'Subscriptions',
            'plans': 'Subscription Plans',
            'current': 'Current Plan',
            'upgrade': 'Upgrade Plan',
            'invoices': 'Invoices',
            'admin': 'Administration',
            'users': 'User Management',
            'groups': 'Groups',
            'ledgers': 'Ledgers',
            'blacklist': 'Blacklist',
            'countries': 'Countries',
            'kenya': 'Kenya',
            'uganda': 'Uganda',
            'tanzania': 'Tanzania',
            'rwanda': 'Rwanda',
            'burundi': 'Burundi',
            'drc': 'DR Congo',
            'nigeria': 'Nigeria',
            'ghana': 'Ghana',
            'south-sudan': 'South Sudan',
            'somalia': 'Somalia',
            'south-africa': 'South Africa',
            'ethiopia': 'Ethiopia'
        };
        
        return nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
    }

    /**
     * Check if user can access page
     */
    async checkPageAccess(path) {
        // Normalize path
        const normalizedPath = this.normalizePath(path);
        
        // Check if page exists in access rules
        const pageType = this.getPageType(normalizedPath);
        
        // Public pages are always accessible
        if (this.accessRules.public.includes(normalizedPath)) {
            return true;
        }
        
        // Check authentication
        const isAuthenticated = this.checkAuthentication();
        if (!isAuthenticated) {
            // Redirect to login for non-public pages
            if (pageType !== 'public') {
                this.redirectToLogin(normalizedPath);
                return false;
            }
            return true;
        }
        
        // Get user data
        const userData = this.getUserData();
        if (!userData) {
            this.redirectToLogin(normalizedPath);
            return false;
        }
        
        // Check based on page type
        switch (pageType) {
            case 'borrower':
                return this.checkBorrowerAccess(userData, normalizedPath);
                
            case 'lender':
                return this.checkLenderAccess(userData, normalizedPath);
                
            case 'admin':
                return this.checkAdminAccess(userData, normalizedPath);
                
            case 'group':
                return this.checkGroupAccess(userData, normalizedPath);
                
            case 'country':
                return this.checkCountryAccess(userData, normalizedPath);
                
            case 'subscription':
                return this.checkSubscriptionAccess(userData, normalizedPath);
                
            default:
                // Unknown page type, allow access but log warning
                console.warn(`[RedirectsManager] Unknown page type for: ${normalizedPath}`);
                return true;
        }
    }

    /**
     * Get page type
     */
    getPageType(path) {
        for (const [type, pages] of Object.entries(this.accessRules)) {
            if (pages.includes(path)) {
                return type;
            }
        }
        
        // Check by path pattern
        if (path.startsWith('/borrower/')) return 'borrower';
        if (path.startsWith('/lender/')) return 'lender';
        if (path.startsWith('/admin/')) return 'admin';
        if (path.startsWith('/groups/')) return 'group';
        if (path.startsWith('/countries/')) return 'country';
        if (path.startsWith('/subscription/')) return 'subscription';
        
        return 'public';
    }

    /**
     * Check authentication status
     */
    checkAuthentication() {
        const token = localStorage.getItem('mpesewa_auth_token');
        const userData = localStorage.getItem('mpesewa_user_data');
        
        return !!(token && userData);
    }

    /**
     * Get user data from storage
     */
    getUserData() {
        try {
            const userData = localStorage.getItem('mpesewa_user_data');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('[RedirectsManager] Failed to parse user data:', error);
            return null;
        }
    }

    /**
     * Check borrower access
     */
    checkBorrowerAccess(userData, path) {
        // Check if user has borrower role
        if (!userData.roles || !userData.roles.includes('borrower')) {
            this.redirectToRoleSelection(path);
            return false;
        }
        
        // Check country access
        if (!this.checkCountryAccess(userData, path)) {
            return false;
        }
        
        // Check group access for group-specific pages
        if (path.includes('/groups/')) {
            return this.checkGroupAccess(userData, path);
        }
        
        return true;
    }

    /**
     * Check lender access
     */
    checkLenderAccess(userData, path) {
        // Check if user has lender role
        if (!userData.roles || !userData.roles.includes('lender')) {
            this.redirectToRoleSelection(path);
            return false;
        }
        
        // Check subscription status
        const subscription = userData.subscription;
        if (!subscription || subscription.status !== 'active') {
            this.redirectToSubscription(path);
            return false;
        }
        
        // Check if subscription is expired
        if (subscription.expiry_date) {
            const expiryDate = new Date(subscription.expiry_date);
            const today = new Date();
            
            if (expiryDate < today) {
                this.redirectToSubscriptionExpired(path);
                return false;
            }
        }
        
        // Check country access
        if (!this.checkCountryAccess(userData, path)) {
            return false;
        }
        
        // Check group access for group-specific pages
        if (path.includes('/groups/')) {
            return this.checkGroupAccess(userData, path);
        }
        
        return true;
    }

    /**
     * Check admin access
     */
    checkAdminAccess(userData, path) {
        // Check if user has admin role
        if (!userData.roles || !userData.roles.includes('admin')) {
            this.redirectToUnauthorized(path);
            return false;
        }
        
        // Check admin token
        const adminToken = localStorage.getItem('mpesewa_admin_token');
        if (!adminToken) {
            this.redirectToAdminLogin(path);
            return false;
        }
        
        return true;
    }

    /**
     * Check group access
     */
    checkGroupAccess(userData, path) {
        const userGroups = userData.groups || [];
        const currentGroup = localStorage.getItem('mpesewa_active_group');
        
        // Extract group ID from path if possible
        const groupIdFromPath = this.extractGroupIdFromPath(path);
        
        if (groupIdFromPath) {
            // Check if user is member of this specific group
            if (!userGroups.some(g => g.id === groupIdFromPath)) {
                this.redirectToGroupSelection(path);
                return false;
            }
            
            // Set as active group
            localStorage.setItem('mpesewa_active_group', groupIdFromPath);
            return true;
        }
        
        // Check if user has any groups
        if (userGroups.length === 0) {
            this.redirectToGroupJoin(path);
            return false;
        }
        
        // Use current group or first group
        if (!currentGroup || !userGroups.some(g => g.id === currentGroup)) {
            const firstGroup = userGroups[0].id;
            localStorage.setItem('mpesewa_active_group', firstGroup);
            
            // Redirect to group dashboard
            if (path !== '/groups/dashboard.html') {
                this.redirect('/groups/dashboard.html');
                return false;
            }
        }
        
        return true;
    }

    /**
     * Check country access
     */
    checkCountryAccess(userData, path) {
        const userCountry = userData.country;
        const currentCountry = localStorage.getItem('mpesewa_country');
        
        if (!userCountry && !currentCountry) {
            // No country selected, redirect to country selection
            this.redirectToCountrySelection(path);
            return false;
        }
        
        // Check if path is country-specific
        const countryFromPath = this.extractCountryFromPath(path);
        
        if (countryFromPath) {
            // Verify user has access to this country
            const userCountryCode = userCountry || currentCountry;
            
            if (userCountryCode !== countryFromPath) {
                // User trying to access different country, redirect to their country
                this.redirectToUserCountry(path, userCountryCode);
                return false;
            }
        }
        
        return true;
    }

    /**
     * Check subscription access
     */
    checkSubscriptionAccess(userData, path) {
        // Only lenders can access subscription pages
        if (!userData.roles || !userData.roles.includes('lender')) {
            this.redirectToUnauthorized(path);
            return false;
        }
        
        return true;
    }

    /**
     * Extract group ID from path
     */
    extractGroupIdFromPath(path) {
        const match = path.match(/\/groups\/([^\/]+)/);
        if (match && match[1] !== 'dashboard.html') {
            return match[1];
        }
        return null;
    }

    /**
     * Extract country from path
     */
    extractCountryFromPath(path) {
        const match = path.match(/\/countries\/([^\/]+)\.html/);
        if (match) {
            const countryName = match[1];
            // Convert to country code
            for (const [code, data] of Object.entries(this.countryCodes)) {
                if (data.name.toLowerCase() === countryName.toLowerCase()) {
                    return code;
                }
            }
        }
        return null;
    }

    /**
     * Handle access denied
     */
    handleAccessDenied(path) {
        console.warn(`[RedirectsManager] Access denied to: ${path}`);
        
        // Show access denied page
        this.showAccessDenied(path);
    }

    /**
     * Show access denied message
     */
    showAccessDenied(path) {
        // Create access denied overlay
        const overlay = document.createElement('div');
        overlay.id = 'access-denied-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        `;
        
        modal.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">🚫</div>
            <h2 style="color: #003366; margin-bottom: 10px;">Access Denied</h2>
            <p style="color: #555; margin-bottom: 20px;">
                You don't have permission to access this page.
            </p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="go-home" style="
                    background: #003366;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Go Home</button>
                <button id="go-back" style="
                    background: #f0f0f0;
                    color: #333;
                    border: 1px solid #ddd;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Go Back</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('go-home').onclick = () => {
            window.location.href = '/';
        };
        
        document.getElementById('go-back').onclick = () => {
            history.back();
            overlay.remove();
        };
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
                window.location.href = '/';
            }
        }, 10000);
    }

    /**
     * Redirect to login
     */
    redirectToLogin(originalPath) {
        // Store original path for redirect after login
        sessionStorage.setItem('mpesewa_redirect_after_login', originalPath);
        
        // Redirect to login
        this.redirect('/auth/login.html');
    }

    /**
     * Redirect to admin login
     */
    redirectToAdminLogin(originalPath) {
        sessionStorage.setItem('mpesewa_admin_redirect', originalPath);
        this.redirect('/admin/login.html');
    }

    /**
     * Redirect to role selection
     */
    redirectToRoleSelection(originalPath) {
        sessionStorage.setItem('mpesewa_role_redirect', originalPath);
        this.redirect('/auth/select-role.html');
    }

    /**
     * Redirect to subscription page
     */
    redirectToSubscription(originalPath) {
        sessionStorage.setItem('mpesewa_subscription_redirect', originalPath);
        this.redirect('/subscription/plans.html');
    }

    /**
     * Redirect to subscription expired page
     */
    redirectToSubscriptionExpired(originalPath) {
        sessionStorage.setItem('mpesewa_subscription_expired_redirect', originalPath);
        this.redirect('/subscription/expired.html');
    }

    /**
     * Redirect to group selection
     */
    redirectToGroupSelection(originalPath) {
        sessionStorage.setItem('mpesewa_group_redirect', originalPath);
        this.redirect('/groups/select.html');
    }

    /**
     * Redirect to group join
     */
    redirectToGroupJoin(originalPath) {
        sessionStorage.setItem('mpesewa_group_join_redirect', originalPath);
        this.redirect('/groups/join.html');
    }

    /**
     * Redirect to country selection
     */
    redirectToCountrySelection(originalPath) {
        sessionStorage.setItem('mpesewa_country_redirect', originalPath);
        this.redirect('/countries/select.html');
    }

    /**
     * Redirect to user's country
     */
    redirectToUserCountry(originalPath, countryCode) {
        const countryName = this.countryCodes[countryCode]?.name.toLowerCase();
        if (countryName) {
            this.redirect(`/countries/${countryName}.html`);
        } else {
            this.redirect('/countries.html');
        }
    }

    /**
     * Redirect to unauthorized page
     */
    redirectToUnauthorized(originalPath) {
        sessionStorage.setItem('mpesewa_unauthorized_redirect', originalPath);
        this.redirect('/unauthorized.html');
    }

    /**
     * Perform redirect
     */
    redirect(url, status = 302) {
        console.log(`[RedirectsManager] Redirecting to: ${url}`);
        
        // Use replace to avoid back button issues
        window.location.replace(url);
    }

    /**
     * Process URL parameters
     */
    processURLParameters(params) {
        // Check for role parameter
        const role = params.get('role');
        if (role && (role === 'borrower' || role === 'lender')) {
            this.handleRoleParameter(role);
        }
        
        // Check for country parameter
        const country = params.get('country');
        if (country && this.countryCodes[country.toUpperCase()]) {
            this.handleCountryParameter(country.toUpperCase());
        }
        
        // Check for group parameter
        const group = params.get('group');
        if (group) {
            this.handleGroupParameter(group);
        }
        
        // Check for redirect parameter
        const redirect = params.get('redirect');
        if (redirect) {
            this.handleRedirectParameter(redirect);
        }
        
        // Check for token parameter (for password reset, etc.)
        const token = params.get('token');
        if (token) {
            this.handleTokenParameter(token);
        }
    }

    /**
     * Handle role parameter
     */
    handleRoleParameter(role) {
        console.log(`[RedirectsManager] Role parameter detected: ${role}`);
        
        // Store role preference
        localStorage.setItem('mpesewa_preferred_role', role);
        
        // Update UI if on registration page
        if (window.location.pathname.includes('/auth/register.html')) {
            this.updateRegistrationForm(role);
        }
    }

    /**
     * Handle country parameter
     */
    handleCountryParameter(countryCode) {
        console.log(`[RedirectsManager] Country parameter detected: ${countryCode}`);
        
        // Store country selection
        localStorage.setItem('mpesewa_country', countryCode);
        
        // Update UI
        this.updateCountryUI(countryCode);
    }

    /**
     * Handle group parameter
     */
    handleGroupParameter(groupId) {
        console.log(`[RedirectsManager] Group parameter detected: ${groupId}`);
        
        // Store group selection
        localStorage.setItem('mpesewa_active_group', groupId);
        
        // Update UI if on group page
        if (window.location.pathname.includes('/groups/')) {
            this.updateGroupUI(groupId);
        }
    }

    /**
     * Handle redirect parameter
     */
    handleRedirectParameter(redirectUrl) {
        console.log(`[RedirectsManager] Redirect parameter detected: ${redirectUrl}`);
        
        // Decode URL if needed
        const decodedUrl = decodeURIComponent(redirectUrl);
        
        // Check if URL is safe (same origin)
        try {
            const url = new URL(decodedUrl, window.location.origin);
            
            if (url.origin === window.location.origin) {
                // Store for later redirect
                sessionStorage.setItem('mpesewa_pending_redirect', decodedUrl);
            }
        } catch (error) {
            console.warn('[RedirectsManager] Invalid redirect URL:', error);
        }
    }

    /**
     * Handle token parameter
     */
    handleTokenParameter(token) {
        console.log('[RedirectsManager] Token parameter detected');
        
        // Store token based on current page
        const path = window.location.pathname;
        
        if (path.includes('/auth/reset-password.html')) {
            localStorage.setItem('mpesewa_reset_token', token);
        } else if (path.includes('/auth/verify.html')) {
            localStorage.setItem('mpesewa_verify_token', token);
        } else if (path.includes('/auth/invite.html')) {
            localStorage.setItem('mpesewa_invite_token', token);
        }
    }

    /**
     * Process hash in URL
     */
    processHash(hash) {
        if (!hash || hash === '#') return;
        
        // Remove # symbol
        const targetId = hash.substring(1);
        
        // Scroll to element if it exists
        setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                
                // Add highlight effect
                element.classList.add('hash-highlight');
                setTimeout(() => {
                    element.classList.remove('hash-highlight');
                }, 2000);
            }
        }, 100);
    }

    /**
     * Update registration form based on role
     */
    updateRegistrationForm(role) {
        const borrowerSection = document.getElementById('borrower-section');
        const lenderSection = document.getElementById('lender-section');
        const roleTabs = document.querySelectorAll('.role-tab');
        
        if (borrowerSection && lenderSection && roleTabs.length > 0) {
            if (role === 'borrower') {
                borrowerSection.style.display = 'block';
                lenderSection.style.display = 'none';
                roleTabs.forEach(tab => {
                    if (tab.dataset.role === 'borrower') {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
            } else if (role === 'lender') {
                borrowerSection.style.display = 'none';
                lenderSection.style.display = 'block';
                roleTabs.forEach(tab => {
                    if (tab.dataset.role === 'lender') {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
            }
        }
    }

    /**
     * Update country UI
     */
    updateCountryUI(countryCode) {
        const countryData = this.countryCodes[countryCode];
        if (!countryData) return;
        
        // Update country selector if exists
        const countrySelect = document.getElementById('country-select');
        if (countrySelect) {
            countrySelect.value = countryCode;
        }
        
        // Update flag display
        const flagElements = document.querySelectorAll('.country-flag');
        flagElements.forEach(element => {
            element.textContent = countryData.flag;
        });
        
        // Update currency display
        const currencyElements = document.querySelectorAll('.country-currency');
        currencyElements.forEach(element => {
            element.textContent = countryData.currency;
        });
    }

    /**
     * Update group UI
     */
    updateGroupUI(groupId) {
        // Update group selector if exists
        const groupSelect = document.getElementById('group-select');
        if (groupSelect) {
            groupSelect.value = groupId;
        }
        
        // Update active group display
        const groupNameElements = document.querySelectorAll('.active-group-name');
        // This would typically fetch group name from storage or API
        const groupName = localStorage.getItem(`mpesewa_group_${groupId}_name`) || 'Group';
        groupNameElements.forEach(element => {
            element.textContent = groupName;
        });
    }

    /**
     * Normalize path
     */
    normalizePath(path) {
        // Remove trailing slash
        if (path.endsWith('/') && path !== '/') {
            path = path.slice(0, -1);
        }
        
        // Add .html extension if missing and path doesn't look like a directory
        if (!path.includes('.') && !path.endsWith('/')) {
            path += '.html';
        }
        
        // Ensure leading slash
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        
        return path;
    }

    /**
     * Track page view
     */
    trackPageView(path) {
        const pageViews = JSON.parse(localStorage.getItem('mpesewa_page_views') || '[]');
        
        pageViews.push({
            path: path,
            timestamp: new Date().toISOString(),
            referrer: document.referrer
        });
        
        // Keep only last 1000 views
        if (pageViews.length > 1000) {
            pageViews.shift();
        }
        
        localStorage.setItem('mpesewa_page_views', JSON.stringify(pageViews));
        
        // Send to analytics if online
        if (navigator.onLine) {
            this.sendAnalyticsEvent('page_view', { path });
        }
    }

    /**
     * Send analytics event
     */
    sendAnalyticsEvent(event, data) {
        // Implementation would send to analytics service
        console.log(`[RedirectsManager] Analytics: ${event}`, data);
    }

    /**
     * Clean up redirects manager
     */
    cleanup() {
        // Remove event listeners
        document.removeEventListener('click', this.setupLinkInterception);
        
        console.log('[RedirectsManager] Cleaned up');
    }
}

// Create global instance
window.MPesewaRedirects = new RedirectsManager();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Already initialized in constructor
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RedirectsManager;
}

/**
 * STRICT M-PESEWA REDIRECT RULES ENFORCEMENT
 * 
 * 1. HIERARCHY ENFORCEMENT:
 *    - Global → Country → Groups → Lenders/Borrowers → Ledgers
 *    - No skipping levels allowed
 *    - Country selection required before group access
 *    - Group membership required before lending/borrowing
 * 
 * 2. COUNTRY ISOLATION:
 *    - No cross-country redirects
 *    - Country locked after registration
 *    - Country-specific URLs enforced
 *    - Local currency displayed based on country
 * 
 * 3. ROLE-BASED ACCESS:
 *    - Borrowers: Free access, no subscription
 *    - Lenders: Subscription required, tier-based limits
 *    - Admins: Special access, audit trails
 *    - No role switching without logout
 * 
 * 4. GROUP RULES:
 *    - Minimum 5 members per group
 *    - Maximum 1000 members per group
 *    - Maximum 4 groups per user (with good rating)
 *    - Group-specific URLs
 *    - No cross-group lending
 * 
 * 5. SUBSCRIPTION ENFORCEMENT:
 *    - Subscription required for lenders
 *    - Expiry on 28th of each month
 *    - Block access when expired
 *    - Redirect to subscription page when inactive
 * 
 * 6. AUTHENTICATION FLOW:
 *    - Login required for protected pages
 *    - Session management with tokens
 *    - Auto-logout after inactivity
 *    - Password reset flow
 * 
 * 7. ERROR HANDLING:
 *    - 404: Page not found
 *    - 403: Access denied
 *    - 401: Authentication required
 *    - 500: Server error
 *    - Custom error pages for each
 * 
 * 8. URL STRUCTURE:
 *    - /country/group/role/action
 *    - SEO-friendly URLs
 *    - No exposed IDs in URLs when possible
 *    - Consistent URL patterns
 */