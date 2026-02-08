/**
 * M-PESEWA ROUTER
 * Core router implementation for the emergency micro-lending platform
 * Strictly follows: Global → Countries → Groups → Lenders → Borrowers (Ledgers) hierarchy
 */

class MpesewaRouter {
    constructor() {
        this.currentRoute = null;
        this.previousRoute = null;
        this.routes = new Map();
        this.guards = new Map();
        this.history = [];
        this.maxHistory = 50;
        
        // Initialize router state
        this.state = {
            authenticated: false,
            userRole: null,
            userId: null,
            countryCode: null,
            groupId: null,
            subscriptionActive: false,
            subscriptionTier: null,
            subscriptionExpiry: null,
            blacklisted: false,
            isAdmin: false,
            deviceType: this.detectDeviceType(),
            isOnline: navigator.onLine,
            isPWAInstalled: this.checkPWAInstallation()
        };
        
        // Bind methods
        this.navigate = this.navigate.bind(this);
        this.back = this.back.bind(this);
        this.forward = this.forward.bind(this);
        this.refresh = this.refresh.bind(this);
        
        // Initialize event listeners
        this.initEventListeners();
        this.loadStateFromStorage();
    }
    
    /**
     * Initialize router
     */
    async init() {
        console.log('🚀 M-PESEWA Router Initializing...');
        
        try {
            // Load routes configuration
            await this.loadRoutes();
            
            // Initialize route guards
            await this.initGuards();
            
            // Set up initial route
            await this.resolveInitialRoute();
            
            // Start router
            this.start();
            
            console.log('✅ M-PESEWA Router Initialized Successfully');
            console.log('📊 Router State:', this.state);
            
            return true;
        } catch (error) {
            console.error('❌ Router Initialization Failed:', error);
            this.handleRouterError(error);
            return false;
        }
    }
    
    /**
     * Load routes from configuration
     */
    async loadRoutes() {
        try {
            // Import routes configuration
            const routesConfig = await import('./routes.js');
            const routeMap = await import('./route-map.js');
            
            // Register all routes
            for (const [path, config] of Object.entries(routesConfig.default)) {
                this.routes.set(path, {
                    ...config,
                    path,
                    guard: config.guard || [],
                    resolver: config.resolver || null
                });
            }
            
            // Set up route map for reverse lookups
            this.routeMap = routeMap.default;
            
            console.log(`✅ Loaded ${this.routes.size} routes`);
        } catch (error) {
            console.error('❌ Failed to load routes:', error);
            throw new Error('ROUTES_LOAD_FAILED');
        }
    }
    
    /**
     * Initialize route guards
     */
    async initGuards() {
        try {
            // Import all guard modules
            const guards = {
                auth: (await import('./guard-auth.js')).default,
                role: (await import('./guard-role.js')).default,
                country: (await import('./guard-country.js')).default,
                group: (await import('./guard-group.js')).default,
                subscription: (await import('./guard-subscription.js')).default,
                blacklist: (await import('./guard-blacklist.js')).default,
                admin: (await import('./guard-admin.js')).default,
                device: (await import('./guard-device.js')).default,
                offline: (await import('./guard-offline.js')).default
            };
            
            // Register each guard
            for (const [guardName, guardFn] of Object.entries(guards)) {
                this.guards.set(guardName, guardFn);
            }
            
            console.log(`✅ Initialized ${this.guards.size} route guards`);
        } catch (error) {
            console.error('❌ Failed to initialize guards:', error);
            throw new Error('GUARDS_INIT_FAILED');
        }
    }
    
    /**
     * Resolve initial route based on current URL
     */
    async resolveInitialRoute() {
        const path = window.location.pathname.replace(window.location.origin, '') || '/';
        const query = window.location.search;
        const hash = window.location.hash;
        
        console.log('📍 Initial Route Detection:', { path, query, hash });
        
        // Check for redirects first
        const redirects = await import('./redirects.js');
        const redirectedPath = redirects.default.checkRedirects(path);
        
        if (redirectedPath !== path) {
            console.log(`🔀 Redirecting from ${path} to ${redirectedPath}`);
            this.navigate(redirectedPath, { replace: true, silent: true });
            return;
        }
        
        // Resolve the route
        await this.resolveRoute(path, query, hash);
    }
    
    /**
     * Start router and listen for navigation events
     */
    start() {
        // Listen for popstate (browser back/forward)
        window.addEventListener('popstate', (event) => {
            const path = window.location.pathname.replace(window.location.origin, '') || '/';
            this.resolveRoute(path, window.location.search, window.location.hash, {
                fromPopState: true
            });
        });
        
        // Listen for online/offline status
        window.addEventListener('online', () => {
            this.state.isOnline = true;
            this.broadcastStateChange('online');
        });
        
        window.addEventListener('offline', () => {
            this.state.isOnline = false;
            this.broadcastStateChange('offline');
        });
        
        // Listen for authentication state changes
        document.addEventListener('mpesewa:auth:change', (event) => {
            this.state.authenticated = event.detail.authenticated;
            this.state.userRole = event.detail.role;
            this.state.userId = event.detail.userId;
            this.saveStateToStorage();
        });
        
        // Listen for country selection changes
        document.addEventListener('mpesewa:country:change', (event) => {
            this.state.countryCode = event.detail.countryCode;
            this.saveStateToStorage();
        });
        
        // Listen for group selection changes
        document.addEventListener('mpesewa:group:change', (event) => {
            this.state.groupId = event.detail.groupId;
            this.saveStateToStorage();
        });
        
        console.log('🚀 Router started successfully');
    }
    
    /**
     * Navigate to a new route
     */
    async navigate(path, options = {}) {
        const {
            replace = false,
            silent = false,
            state = {},
            force = false
        } = options;
        
        // Validate path
        if (!path || typeof path !== 'string') {
            console.error('❌ Invalid path provided for navigation:', path);
            return false;
        }
        
        // Clean path
        const cleanPath = path.split('?')[0];
        
        // Check if route exists
        if (!this.routes.has(cleanPath) && !force) {
            console.error(`❌ Route not found: ${cleanPath}`);
            await this.navigate('/404', { replace: true });
            return false;
        }
        
        // Store previous route
        this.previousRoute = this.currentRoute;
        
        // Resolve the new route
        const success = await this.resolveRoute(path, options.query, options.hash, {
            navigation: true,
            replace,
            silent,
            state
        });
        
        if (success && !silent) {
            // Update browser history
            if (replace) {
                window.history.replaceState(state, '', path);
            } else {
                window.history.pushState(state, '', path);
            }
            
            // Add to history
            this.addToHistory(path, state);
        }
        
        return success;
    }
    
    /**
     * Resolve a route with all guards and resolvers
     */
    async resolveRoute(path, query = '', hash = '', options = {}) {
        const {
            navigation = false,
            replace = false,
            silent = false,
            state = {},
            fromPopState = false
        } = options;
        
        // Clean path for route lookup
        const cleanPath = path.split('?')[0];
        const routeConfig = this.routes.get(cleanPath);
        
        if (!routeConfig && cleanPath !== '/404') {
            console.warn(`⚠️ Route not configured: ${cleanPath}, redirecting to 404`);
            return this.navigate('/404', { replace: true });
        }
        
        try {
            // Run route guards
            const guardResult = await this.runGuards(routeConfig?.guard || [], {
                to: cleanPath,
                from: this.currentRoute,
                query,
                hash,
                state
            });
            
            if (!guardResult.allowed) {
                console.warn(`⛔ Route guard blocked navigation to ${cleanPath}:`, guardResult.reason);
                
                // Handle guard rejection
                await this.handleGuardRejection(guardResult);
                return false;
            }
            
            // Run route resolver if exists
            let routeData = {};
            if (routeConfig?.resolver) {
                const resolver = await import('./route-resolver.js');
                routeData = await resolver.default.resolve(cleanPath, {
                    query,
                    hash,
                    state,
                    routerState: this.state
                });
            }
            
            // Update current route
            this.currentRoute = cleanPath;
            
            // Load the route content
            await this.loadRouteContent(routeConfig, {
                path: cleanPath,
                query,
                hash,
                data: routeData,
                state
            });
            
            // Run transitions
            if (!silent) {
                await this.runTransitions(this.previousRoute, cleanPath);
            }
            
            // Broadcast route change event
            if (!silent) {
                this.broadcastRouteChange({
                    to: cleanPath,
                    from: this.previousRoute,
                    query,
                    hash,
                    data: routeData,
                    state
                });
            }
            
            console.log(`✅ Navigated to ${cleanPath}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Route resolution failed for ${cleanPath}:`, error);
            
            // Fallback to error page
            if (cleanPath !== '/500') {
                await this.navigate('/500', { replace: true });
            }
            
            return false;
        }
    }
    
    /**
     * Run all guards for a route
     */
    async runGuards(guardNames, context) {
        const result = {
            allowed: true,
            reason: null,
            redirect: null,
            data: {}
        };
        
        for (const guardName of guardNames) {
            const guard = this.guards.get(guardName);
            
            if (!guard) {
                console.warn(`⚠️ Guard not found: ${guardName}`);
                continue;
            }
            
            try {
                const guardResult = await guard(context, this.state);
                
                if (!guardResult.allowed) {
                    result.allowed = false;
                    result.reason = guardResult.reason || `Blocked by ${guardName} guard`;
                    result.redirect = guardResult.redirect;
                    result.data = guardResult.data || {};
                    break;
                }
                
                // Merge guard data
                if (guardResult.data) {
                    result.data = { ...result.data, ...guardResult.data };
                }
                
            } catch (error) {
                console.error(`❌ Guard ${guardName} execution failed:`, error);
                result.allowed = false;
                result.reason = `Guard ${guardName} failed: ${error.message}`;
                break;
            }
        }
        
        return result;
    }
    
    /**
     * Handle guard rejection
     */
    async handleGuardRejection(guardResult) {
        if (guardResult.redirect) {
            // Redirect to specified path
            await this.navigate(guardResult.redirect, { replace: true });
        } else {
            // Default handling based on guard type
            if (guardResult.reason.includes('auth')) {
                await this.navigate('/auth/login', {
                    replace: true,
                    state: { returnTo: this.previousRoute || '/' }
                });
            } else if (guardResult.reason.includes('subscription')) {
                await this.navigate('/subscription/expired', { replace: true });
            } else if (guardResult.reason.includes('country')) {
                await this.navigate('/countries', { replace: true });
            } else if (guardResult.reason.includes('blacklist')) {
                await this.navigate('/blacklist/status', { replace: true });
            } else {
                await this.navigate('/403', { replace: true });
            }
        }
    }
    
    /**
     * Load route content
     */
    async loadRouteContent(routeConfig, context) {
        const { path, data } = context;
        
        // Get the target container
        const container = document.querySelector('[data-router-view]') || document.getElementById('app-content');
        
        if (!container) {
            console.error('❌ Router view container not found');
            return;
        }
        
        try {
            // Show loading state
            container.innerHTML = this.getLoadingTemplate();
            
            // Determine content source
            let content = '';
            
            if (routeConfig.component) {
                // Load component
                content = await this.loadComponent(routeConfig.component);
            } else if (routeConfig.html) {
                // Load HTML file
                content = await this.loadHTML(routeConfig.html);
            } else if (routeConfig.template) {
                // Use inline template
                content = routeConfig.template;
            } else {
                throw new Error(`No content source defined for route: ${path}`);
            }
            
            // Inject content
            container.innerHTML = content;
            
            // Inject route data
            this.injectRouteData(container, data);
            
            // Initialize route scripts
            await this.initRouteScripts(container, routeConfig);
            
            // Update page title and meta
            this.updatePageMeta(routeConfig, data);
            
            // Scroll to top
            if (!context.hash) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
        } catch (error) {
            console.error(`❌ Failed to load route content for ${path}:`, error);
            container.innerHTML = this.getErrorTemplate(error);
        }
    }
    
    /**
     * Load component
     */
    async loadComponent(componentPath) {
        // In a real implementation, this would dynamically import the component
        // For now, we'll simulate loading
        console.log(`📦 Loading component: ${componentPath}`);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Return a placeholder - in production, this would fetch the actual component
        return `
            <div class="route-component" data-component="${componentPath}">
                <div class="component-loading">Loading component...</div>
            </div>
        `;
    }
    
    /**
     * Load HTML file
     */
    async loadHTML(htmlPath) {
        try {
            const response = await fetch(htmlPath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error(`❌ Failed to load HTML: ${htmlPath}`, error);
            throw error;
        }
    }
    
    /**
     * Initialize route scripts
     */
    async initRouteScripts(container, routeConfig) {
        // Execute inline scripts
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            
            // Copy attributes
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            script.parentNode.replaceChild(newScript, script);
        });
        
        // Dispatch route initialized event
        document.dispatchEvent(new CustomEvent('mpesewa:route:initialized', {
            detail: {
                route: routeConfig,
                container
            }
        }));
    }
    
    /**
     * Inject route data into the DOM
     */
    injectRouteData(container, data) {
        // Convert data to JSON and store in data attribute
        container.setAttribute('data-route-data', JSON.stringify(data));
        
        // Also store in window for easy access
        window.currentRouteData = data;
    }
    
    /**
     * Update page meta tags
     */
    updatePageMeta(routeConfig, data) {
        // Update title
        if (routeConfig.title) {
            let title = routeConfig.title;
            
            // Replace dynamic parts
            if (typeof title === 'function') {
                title = title(data);
            }
            
            document.title = `${title} | M-Pesewa`;
        }
        
        // Update meta description
        if (routeConfig.meta?.description) {
            let description = routeConfig.meta.description;
            
            if (typeof description === 'function') {
                description = description(data);
            }
            
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            }
        }
    }
    
    /**
     * Run route transitions
     */
    async runTransitions(fromRoute, toRoute) {
        try {
            const transitions = await import('./transitions.js');
            await transitions.default.run(fromRoute, toRoute);
        } catch (error) {
            console.warn('⚠️ Transitions failed:', error);
        }
    }
    
    /**
     * Go back in history
     */
    back() {
        if (this.history.length > 1) {
            window.history.back();
        } else {
            this.navigate('/');
        }
    }
    
    /**
     * Go forward in history
     */
    forward() {
        window.history.forward();
    }
    
    /**
     * Refresh current route
     */
    refresh() {
        if (this.currentRoute) {
            this.navigate(this.currentRoute, { replace: true });
        }
    }
    
    /**
     * Add route to history
     */
    addToHistory(path, state) {
        this.history.push({
            path,
            state,
            timestamp: Date.now()
        });
        
        // Trim history if too long
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }
    
    /**
     * Get loading template
     */
    getLoadingTemplate() {
        return `
            <div class="route-loading">
                <div class="loading-spinner"></div>
                <p>Loading M-Pesewa...</p>
            </div>
        `;
    }
    
    /**
     * Get error template
     */
    getErrorTemplate(error) {
        return `
            <div class="route-error">
                <h2>Something went wrong</h2>
                <p>${error.message || 'Failed to load page content'}</p>
                <button onclick="window.router.refresh()">Try Again</button>
            </div>
        `;
    }
    
    /**
     * Broadcast route change event
     */
    broadcastRouteChange(detail) {
        document.dispatchEvent(new CustomEvent('mpesewa:route:change', { detail }));
    }
    
    /**
     * Broadcast state change event
     */
    broadcastStateChange(type) {
        document.dispatchEvent(new CustomEvent('mpesewa:router:state:change', {
            detail: {
                type,
                state: this.state
            }
        }));
    }
    
    /**
     * Detect device type
     */
    detectDeviceType() {
        const ua = navigator.userAgent;
        
        if (/mobile|android|iphone|ipad|ipod/i.test(ua)) {
            return 'mobile';
        } else if (/tablet|ipad/i.test(ua)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    /**
     * Check if PWA is installed
     */
    checkPWAInstallation() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }
    
    /**
     * Load state from localStorage
     */
    loadStateFromStorage() {
        try {
            const savedState = localStorage.getItem('mpesewa_router_state');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.state = { ...this.state, ...parsed };
            }
        } catch (error) {
            console.warn('⚠️ Failed to load router state from storage:', error);
        }
    }
    
    /**
     * Save state to localStorage
     */
    saveStateToStorage() {
        try {
            localStorage.setItem('mpesewa_router_state', JSON.stringify(this.state));
        } catch (error) {
            console.warn('⚠️ Failed to save router state to storage:', error);
        }
    }
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Intercept link clicks
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[data-router-link]');
            
            if (link) {
                event.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    this.navigate(href);
                }
            }
        });
        
        // Handle programmatic navigation
        window.addEventListener('mpesewa:navigate', (event) => {
            if (event.detail?.path) {
                this.navigate(event.detail.path, event.detail.options);
            }
        });
        
        // Handle back/forward buttons
        window.addEventListener('mpesewa:navigate:back', () => this.back());
        window.addEventListener('mpesewa:navigate:forward', () => this.forward());
        window.addEventListener('mpesewa:navigate:refresh', () => this.refresh());
    }
    
    /**
     * Handle router errors
     */
    handleRouterError(error) {
        console.error('🚨 Router Error:', error);
        
        // Show error to user
        const errorEvent = new CustomEvent('mpesewa:router:error', {
            detail: { error }
        });
        document.dispatchEvent(errorEvent);
        
        // Fallback to offline page if needed
        if (!this.state.isOnline) {
            this.navigate('/offline', { replace: true });
        }
    }
    
    /**
     * Get current route information
     */
    getCurrentRoute() {
        return this.currentRoute ? this.routes.get(this.currentRoute) : null;
    }
    
    /**
     * Get route by path
     */
    getRoute(path) {
        return this.routes.get(path);
    }
    
    /**
     * Get all routes
     */
    getAllRoutes() {
        return Array.from(this.routes.values());
    }
    
    /**
     * Check if a route exists
     */
    hasRoute(path) {
        return this.routes.has(path);
    }
    
    /**
     * Generate URL for route with parameters
     */
    generateUrl(routeName, params = {}) {
        if (!this.routeMap?.[routeName]) {
            console.warn(`⚠️ Route name not found: ${routeName}`);
            return '/';
        }
        
        let url = this.routeMap[routeName];
        
        // Replace parameters
        for (const [key, value] of Object.entries(params)) {
            url = url.replace(`:${key}`, encodeURIComponent(value));
        }
        
        // Remove any remaining parameters
        url = url.replace(/\/:[^/]+/g, '');
        
        return url;
    }
    
    /**
     * Update router state
     */
    updateState(updates) {
        this.state = { ...this.state, ...updates };
        this.saveStateToStorage();
        this.broadcastStateChange('update');
    }
    
    /**
     * Reset router state
     */
    resetState() {
        this.state = {
            authenticated: false,
            userRole: null,
            userId: null,
            countryCode: null,
            groupId: null,
            subscriptionActive: false,
            subscriptionTier: null,
            subscriptionExpiry: null,
            blacklisted: false,
            isAdmin: false,
            deviceType: this.detectDeviceType(),
            isOnline: navigator.onLine,
            isPWAInstalled: this.checkPWAInstallation()
        };
        
        localStorage.removeItem('mpesewa_router_state');
        this.broadcastStateChange('reset');
    }
    
    /**
     * Check if user can access a route
     */
    async canAccess(path) {
        const route = this.routes.get(path);
        if (!route) return false;
        
        const guardResult = await this.runGuards(route.guard || [], {
            to: path,
            from: this.currentRoute
        });
        
        return guardResult.allowed;
    }
    
    /**
     * Get navigation history
     */
    getHistory() {
        return [...this.history];
    }
    
    /**
     * Clear navigation history
     */
    clearHistory() {
        this.history = [];
    }
    
    /**
     * Register a custom guard
     */
    registerGuard(name, guardFn) {
        if (this.guards.has(name)) {
            console.warn(`⚠️ Guard "${name}" already exists, overwriting`);
        }
        
        this.guards.set(name, guardFn);
        console.log(`✅ Registered custom guard: ${name}`);
    }
    
    /**
     * Register a custom route
     */
    registerRoute(path, config) {
        if (this.routes.has(path)) {
            console.warn(`⚠️ Route "${path}" already exists, overwriting`);
        }
        
        this.routes.set(path, {
            path,
            ...config
        });
        
        console.log(`✅ Registered custom route: ${path}`);
    }
}

// Create global router instance
const router = new MpesewaRouter();

// Export router instance
export default router;

// Export for global access
if (typeof window !== 'undefined') {
    window.MpesewaRouter = MpesewaRouter;
    window.router = router;
}

// Auto-initialize router on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        router.init().catch(error => {
            console.error('Failed to auto-initialize router:', error);
        });
    });
} else {
    router.init().catch(error => {
        console.error('Failed to auto-initialize router:', error);
    });
}