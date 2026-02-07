/**
 * M-PESEWA ROUTE GUARDS
 * Comprehensive guard system for enforcing business rules and hierarchy
 */

class RouteGuards {
    constructor() {
        this.guards = new Map();
        this.guardChain = [];
        this.routeResolver = null;
        
        // Initialize all guards
        this.initializeGuards();
    }

    /**
     * Initialize all route guards
     */
    initializeGuards() {
        // Core authentication guard
        this.registerGuard('auth', {
            name: 'Authentication Guard',
            description: 'Ensures user is authenticated',
            priority: 100,
            handler: this.authGuardHandler.bind(this)
        });

        // Role-based guard
        this.registerGuard('role', {
            name: 'Role Guard',
            description: 'Enforces user role permissions',
            priority: 90,
            handler: this.roleGuardHandler.bind(this)
        });

        // Country isolation guard
        this.registerGuard('country', {
            name: 'Country Guard',
            description: 'Enforces country isolation rules',
            priority: 80,
            handler: this.countryGuardHandler.bind(this)
        });

        // Group isolation guard
        this.registerGuard('group', {
            name: 'Group Guard',
            description: 'Enforces group isolation for lenders',
            priority: 70,
            handler: this.groupGuardHandler.bind(this)
        });

        // Subscription guard
        this.registerGuard('subscription', {
            name: 'Subscription Guard',
            description: 'Enforces lender subscription requirements',
            priority: 60,
            handler: this.subscriptionGuardHandler.bind(this)
        });

        // Blacklist guard
        this.registerGuard('blacklist', {
            name: 'Blacklist Guard',
            description: 'Blocks blacklisted users from borrowing',
            priority: 50,
            handler: this.blacklistGuardHandler.bind(this)
        });

        // Admin guard
        this.registerGuard('admin', {
            name: 'Admin Guard',
            description: 'Restricts access to admin-only routes',
            priority: 40,
            handler: this.adminGuardHandler.bind(this)
        });

        // Device guard
        this.registerGuard('device', {
            name: 'Device Guard',
            description: 'Validates device compatibility',
            priority: 30,
            handler: this.deviceGuardHandler.bind(this)
        });

        // Offline guard
        this.registerGuard('offline', {
            name: 'Offline Guard',
            description: 'Handles offline mode limitations',
            priority: 20,
            handler: this.offlineGuardHandler.bind(this)
        });

        // Hierarchy guard
        this.registerGuard('hierarchy', {
            name: 'Hierarchy Guard',
            description: 'Enforces Global→Country→Groups→Lenders→Borrowers hierarchy',
            priority: 10,
            handler: this.hierarchyGuardHandler.bind(this)
        });

        console.log('[RouteGuards] All guards initialized');
    }

    /**
     * Register a new guard
     */
    registerGuard(name, config) {
        if (this.guards.has(name)) {
            console.warn(`[RouteGuards] Guard '${name}' already registered, overwriting`);
        }
        
        this.guards.set(name, {
            ...config,
            enabled: true,
            failures: 0,
            lastCheck: null
        });
        
        // Add to guard chain in priority order
        this.updateGuardChain();
        
        return this;
    }

    /**
     * Update guard execution chain based on priority
     */
    updateGuardChain() {
        this.guardChain = Array.from(this.guards.values())
            .filter(guard => guard.enabled)
            .sort((a, b) => b.priority - a.priority);
    }

    /**
     * Set route resolver instance
     */
    setRouteResolver(resolver) {
        this.routeResolver = resolver;
        console.log('[RouteGuards] Route resolver set');
        return this;
    }

    /**
     * Execute all guards for a route
     */
    async executeGuards(route, context = {}) {
        if (!this.routeResolver) {
            console.error('[RouteGuards] No route resolver set');
            return {
                allowed: false,
                redirect: '/error.html',
                error: 'NO_ROUTE_RESOLVER',
                message: 'Route resolver not configured'
            };
        }

        const guardResults = {
            passed: [],
            failed: [],
            warnings: [],
            context: { ...context },
            startTime: Date.now()
        };

        // Execute guards in priority order
        for (const guard of this.guardChain) {
            try {
                guard.lastCheck = new Date().toISOString();
                
                const result = await guard.handler(route, guardResults.context);
                
                if (result.allowed) {
                    guardResults.passed.push({
                        guard: guard.name,
                        priority: guard.priority,
                        duration: result.duration || 0
                    });
                    
                    // Merge context updates
                    if (result.context) {
                        Object.assign(guardResults.context, result.context);
                    }
                    
                    // Add warnings if any
                    if (result.warnings) {
                        guardResults.warnings.push(...result.warnings.map(w => `${guard.name}: ${w}`));
                    }
                } else {
                    guard.failures++;
                    guardResults.failed.push({
                        guard: guard.name,
                        priority: guard.priority,
                        error: result.error,
                        message: result.message,
                        redirect: result.redirect,
                        duration: result.duration || 0
                    });
                    
                    // Stop execution on first failure (unless it's a warning)
                    if (!result.warningOnly) {
                        guardResults.endTime = Date.now();
                        guardResults.totalDuration = guardResults.endTime - guardResults.startTime;
                        guardResults.allowed = false;
                        guardResults.finalRedirect = result.redirect;
                        guardResults.finalError = result.error;
                        guardResults.finalMessage = result.message;
                        
                        console.warn(`[RouteGuards] Guard '${guard.name}' blocked route: ${route}`);
                        return guardResults;
                    }
                }
            } catch (error) {
                console.error(`[RouteGuards] Error in guard '${guard.name}':`, error);
                guard.failures++;
                
                guardResults.failed.push({
                    guard: guard.name,
                    priority: guard.priority,
                    error: 'GUARD_EXECUTION_ERROR',
                    message: error.message,
                    redirect: '/error.html'
                });
                
                guardResults.endTime = Date.now();
                guardResults.totalDuration = guardResults.endTime - guardResults.startTime;
                guardResults.allowed = false;
                guardResults.finalRedirect = '/error.html';
                guardResults.finalError = 'GUARD_EXECUTION_ERROR';
                guardResults.finalMessage = `Guard execution failed: ${error.message}`;
                
                return guardResults;
            }
        }

        // All guards passed
        guardResults.endTime = Date.now();
        guardResults.totalDuration = guardResults.endTime - guardResults.startTime;
        guardResults.allowed = true;
        
        console.log(`[RouteGuards] All guards passed for route: ${route}`);
        return guardResults;
    }

    /**
     * Authentication Guard Handler
     */
    async authGuardHandler(route, context) {
        const startTime = Date.now();
        
        // Check if route requires authentication
        const authRequiredRoutes = [
            '/dashboard',
            '/lender/',
            '/borrower/',
            '/groups/',
            '/ledger/',
            '/subscription/',
            '/profile'
        ];
        
        const requiresAuth = authRequiredRoutes.some(authRoute => 
            route.startsWith(authRoute)
        );
        
        if (!requiresAuth) {
            return {
                allowed: true,
                duration: Date.now() - startTime,
                context: { authRequired: false }
            };
        }
        
        // Check authentication status
        const isAuthenticated = localStorage.getItem('mpesewa_auth_token') !== null;
        const userData = JSON.parse(localStorage.getItem('mpesewa_user_data') || '{}');
        
        if (!isAuthenticated || !userData.userId) {
            return {
                allowed: false,
                redirect: '/auth/login.html',
                error: 'AUTHENTICATION_REQUIRED',
                message: 'Please sign in to access this page',
                duration: Date.now() - startTime
            };
        }
        
        // Update context with user data
        context.userId = userData.userId;
        context.userRole = userData.role;
        context.isAuthenticated = true;
        context.username = userData.username;
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                authRequired: true,
                userId: userData.userId,
                userRole: userData.role,
                username: userData.username
            }
        };
    }

    /**
     * Role Guard Handler
     */
    async roleGuardHandler(route, context) {
        const startTime = Date.now();
        const userRole = context.userRole;
        
        // Define role-based access rules
        const roleRules = {
            'lender': {
                allowed: ['/lender/', '/dashboard', '/portfolio', '/ledger/', '/subscription/'],
                denied: ['/borrower/apply', '/borrower/request']
            },
            'borrower': {
                allowed: ['/borrower/', '/dashboard', '/emergency/', '/apply'],
                denied: ['/lender/portfolio', '/lender/approve', '/subscription/manage']
            },
            'admin': {
                allowed: ['/admin/', '/dashboard', '/users', '/groups', '/override'],
                denied: []
            },
            'group-admin': {
                allowed: ['/groups/manage/', '/members/', '/invite'],
                denied: ['/admin/system']
            }
        };
        
        // If no role specified, check route requirements
        if (!userRole) {
            // Some routes don't require specific roles
            const roleNeutralRoutes = ['/', '/home', '/about', '/contact', '/countries/', '/emergency/categories'];
            if (roleNeutralRoutes.some(neutralRoute => route.startsWith(neutralRoute))) {
                return {
                    allowed: true,
                    duration: Date.now() - startTime,
                    context: { roleRequired: false }
                };
            }
            
            return {
                allowed: false,
                redirect: '/auth/register.html',
                error: 'ROLE_REQUIRED',
                message: 'Please register and select a role',
                duration: Date.now() - startTime
            };
        }
        
        // Get rules for user's role
        const rules = roleRules[userRole] || roleRules.borrower;
        
        // Check if route is allowed for this role
        const isAllowed = rules.allowed.some(allowedRoute => 
            route.startsWith(allowedRoute)
        );
        
        // Check if route is explicitly denied
        const isDenied = rules.denied.some(deniedRoute => 
            route.startsWith(deniedRoute)
        );
        
        if (!isAllowed || isDenied) {
            return {
                allowed: false,
                redirect: '/access-denied.html',
                error: 'ROLE_ACCESS_DENIED',
                message: `Your role (${userRole}) does not have access to this page`,
                duration: Date.now() - startTime
            };
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                roleRequired: true,
                userRole: userRole,
                rolePermissions: rules.allowed
            }
        };
    }

    /**
     * Country Guard Handler
     */
    async countryGuardHandler(route, context) {
        const startTime = Date.now();
        
        // Get user's country from storage
        const userCountry = localStorage.getItem('mpesewa_country');
        const countryLocked = localStorage.getItem('mpesewa_country_locked') === 'true';
        
        // Check if route is country-specific
        const countrySpecificRoutes = route.match(/\/countries\/([^\/]+)/);
        
        if (countrySpecificRoutes) {
            const routeCountry = countrySpecificRoutes[1];
            
            // STRICT ENFORCEMENT: No cross-country access
            if (countryLocked && userCountry && userCountry !== routeCountry) {
                return {
                    allowed: false,
                    redirect: `/countries/${userCountry}/dashboard.html`,
                    error: 'COUNTRY_ISOLATION_VIOLATION',
                    message: 'Cross-country access is strictly prohibited',
                    duration: Date.now() - startTime
                };
            }
            
            // Update context with route country
            context.routeCountry = routeCountry;
        }
        
        // Set user country in context if available
        if (userCountry) {
            context.userCountry = userCountry;
            context.countryLocked = countryLocked;
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                ...context,
                countryChecked: true
            }
        };
    }

    /**
     * Group Guard Handler
     */
    async groupGuardHandler(route, context) {
        const startTime = Date.now();
        const userRole = context.userRole;
        
        // Get user's group from storage
        const userGroupId = localStorage.getItem('mpesewa_group_id');
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        
        // Check if route is group-specific
        const groupSpecificRoutes = route.match(/\/groups\/([^\/]+)/);
        
        if (groupSpecificRoutes && groupSpecificRoutes[1] !== 'create' && groupSpecificRoutes[1] !== 'join') {
            const routeGroupId = groupSpecificRoutes[1];
            
            // For lenders: STRICT group isolation
            if (userRole === 'lender' && userGroupId && userGroupId !== routeGroupId) {
                return {
                    allowed: false,
                    redirect: `/groups/${userGroupId}/dashboard.html`,
                    error: 'GROUP_ISOLATION_VIOLATION',
                    message: 'Lenders can only operate within their assigned group',
                    duration: Date.now() - startTime
                };
            }
            
            // For borrowers: Check if they're member of this group
            if (userRole === 'borrower' && !userGroups.includes(routeGroupId)) {
                return {
                    allowed: false,
                    redirect: '/groups/selector.html',
                    error: 'GROUP_MEMBERSHIP_REQUIRED',
                    message: 'You are not a member of this group',
                    duration: Date.now() - startTime
                };
            }
            
            context.routeGroupId = routeGroupId;
        }
        
        // Set user group info in context
        if (userGroupId) {
            context.userGroupId = userGroupId;
        }
        if (userGroups.length > 0) {
            context.userGroups = userGroups;
            context.groupCount = userGroups.length;
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                ...context,
                groupChecked: true
            }
        };
    }

    /**
     * Subscription Guard Handler
     */
    async subscriptionGuardHandler(route, context) {
        const startTime = Date.now();
        const userRole = context.userRole;
        
        // Only lenders require subscriptions
        if (userRole !== 'lender') {
            return {
                allowed: true,
                duration: Date.now() - startTime,
                context: { subscriptionRequired: false }
            };
        }
        
        // Check subscription status
        const subscriptionData = JSON.parse(localStorage.getItem('mpesewa_subscription') || '{}');
        const subscriptionExpiry = subscriptionData.expiry;
        
        // Routes that require active subscription
        const subscriptionRequiredRoutes = [
            '/lender/portfolio',
            '/lender/approve',
            '/lender/lend',
            '/ledger/create'
        ];
        
        const requiresSubscription = subscriptionRequiredRoutes.some(subRoute => 
            route.includes(subRoute)
        );
        
        if (!requiresSubscription) {
            return {
                allowed: true,
                duration: Date.now() - startTime,
                context: { subscriptionRequired: false }
            };
        }
        
        // Check if subscription exists
        if (!subscriptionData.tier) {
            return {
                allowed: false,
                redirect: '/subscription/plans.html',
                error: 'SUBSCRIPTION_REQUIRED',
                message: 'Lender subscription required to access lending features',
                duration: Date.now() - startTime
            };
        }
        
        // Check subscription expiry (28th of each month)
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const expiryDate = new Date(currentYear, currentMonth, 28);
        
        if (today > expiryDate) {
            return {
                allowed: false,
                redirect: '/subscription/expired.html',
                error: 'SUBSCRIPTION_EXPIRED',
                message: 'Your subscription has expired. Please renew to continue lending.',
                duration: Date.now() - startTime
            };
        }
        
        // Check tier limits if applicable
        const loanAmount = context.loanAmount;
        if (loanAmount) {
            const tierLimits = {
                'basic': 1500,
                'premium': 5000,
                'super': 20000
            };
            
            const limit = tierLimits[subscriptionData.tier] || 0;
            if (loanAmount > limit) {
                return {
                    allowed: false,
                    redirect: '/subscription/upgrade.html',
                    error: 'SUBSCRIPTION_LIMIT_EXCEEDED',
                    message: `Loan amount exceeds your ${subscriptionData.tier} tier limit of ${limit}`,
                    duration: Date.now() - startTime
                };
            }
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                subscriptionRequired: true,
                subscriptionTier: subscriptionData.tier,
                subscriptionExpiry: expiryDate.toISOString().split('T')[0],
                subscriptionActive: true
            }
        };
    }

    /**
     * Blacklist Guard Handler
     */
    async blacklistGuardHandler(route, context) {
        const startTime = Date.now();
        const userRole = context.userRole;
        
        // Only affects borrowers
        if (userRole !== 'borrower') {
            return {
                allowed: true,
                duration: Date.now() - startTime,
                context: { blacklistChecked: false }
            };
        }
        
        // Check if user is blacklisted
        const blacklistStatus = JSON.parse(localStorage.getItem('mpesewa_blacklist_status') || '{}');
        
        if (blacklistStatus.isBlacklisted) {
            // Routes blocked for blacklisted users
            const blockedRoutes = [
                '/borrower/apply',
                '/emergency/request',
                '/groups/join'
            ];
            
            const isBlockedRoute = blockedRoutes.some(blockedRoute => 
                route.includes(blockedRoute)
            );
            
            if (isBlockedRoute) {
                return {
                    allowed: false,
                    redirect: '/blacklist/status.html',
                    error: 'BLACKLISTED_USER',
                    message: `You are blacklisted. Amount owed: ${blacklistStatus.amountOwed}. Days overdue: ${blacklistStatus.daysOverdue}`,
                    duration: Date.now() - startTime
                };
            }
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                blacklistChecked: true,
                isBlacklisted: blacklistStatus.isBlacklisted || false,
                blacklistReason: blacklistStatus.reason,
                blacklistAmount: blacklistStatus.amountOwed
            }
        };
    }

    /**
     * Admin Guard Handler
     */
    async adminGuardHandler(route, context) {
        const startTime = Date.now();
        
        // Check if route is admin-only
        if (!route.startsWith('/admin/')) {
            return {
                allowed: true,
                duration: Date.now() - startTime,
                context: { adminRequired: false }
            };
        }
        
        // Check admin authentication
        const isAdmin = localStorage.getItem('mpesewa_admin_token') !== null;
        const adminData = JSON.parse(localStorage.getItem('mpesewa_admin_data') || '{}');
        
        if (!isAdmin || !adminData.adminId) {
            return {
                allowed: false,
                redirect: '/admin/login.html',
                error: 'ADMIN_ACCESS_REQUIRED',
                message: 'Admin authentication required',
                duration: Date.now() - startTime
            };
        }
        
        // Check admin permissions
        const routePermission = route.split('/')[2]; // e.g., /admin/users → users
        const adminPermissions = adminData.permissions || [];
        
        if (!adminPermissions.includes(routePermission) && !adminPermissions.includes('*')) {
            return {
                allowed: false,
                redirect: '/admin/dashboard.html',
                error: 'INSUFFICIENT_ADMIN_PERMISSIONS',
                message: `You don't have permission to access ${routePermission} section`,
                duration: Date.now() - startTime
            };
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                adminRequired: true,
                adminId: adminData.adminId,
                adminPermissions: adminPermissions,
                adminLevel: adminData.level || 'standard'
            }
        };
    }

    /**
     * Device Guard Handler
     */
    async deviceGuardHandler(route, context) {
        const startTime = Date.now();
        
        // Check device capabilities
        const deviceInfo = {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isTablet: /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent),
            isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            pwaInstalled: window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true
        };
        
        // Check for required features
        const requiredFeatures = [];
        
        // Routes that require specific features
        if (route.includes('/ledger/') || route.includes('/portfolio')) {
            requiredFeatures.push('localStorage', 'indexedDB');
        }
        
        if (route.includes('/emergency/')) {
            requiredFeatures.push('geolocation');
        }
        
        // Validate features
        const missingFeatures = requiredFeatures.filter(feature => {
            switch(feature) {
                case 'localStorage':
                    return typeof localStorage === 'undefined';
                case 'indexedDB':
                    return typeof indexedDB === 'undefined';
                case 'geolocation':
                    return typeof navigator.geolocation === 'undefined';
                default:
                    return false;
            }
        });
        
        if (missingFeatures.length > 0) {
            return {
                allowed: false,
                redirect: '/device/unsupported.html',
                error: 'DEVICE_FEATURE_MISSING',
                message: `Required features not available: ${missingFeatures.join(', ')}`,
                warningOnly: true,
                duration: Date.now() - startTime
            };
        }
        
        // Check screen size for complex routes
        if ((route.includes('/dashboard') || route.includes('/portfolio')) && deviceInfo.screenWidth < 768) {
            return {
                allowed: true,
                duration: Date.now() - startTime,
                context: { ...context, deviceInfo },
                warnings: ['Dashboard may not be optimal on small screens']
            };
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                ...context,
                deviceInfo,
                deviceChecked: true
            }
        };
    }

    /**
     * Offline Guard Handler
     */
    async offlineGuardHandler(route, context) {
        const startTime = Date.now();
        
        // Check online status
        const isOnline = navigator.onLine;
        
        // Routes that require online connection
        const onlineRequiredRoutes = [
            '/auth/login',
            '/auth/register',
            '/lender/approve',
            '/borrower/apply',
            '/subscription/payment',
            '/admin/sync'
        ];
        
        const requiresOnline = onlineRequiredRoutes.some(onlineRoute => 
            route.includes(onlineRoute)
        );
        
        if (requiresOnline && !isOnline) {
            return {
                allowed: false,
                redirect: '/offline.html',
                error: 'OFFLINE_MODE_RESTRICTION',
                message: 'This feature requires an internet connection',
                duration: Date.now() - startTime
            };
        }
        
        // Routes available offline
        const offlineAvailableRoutes = [
            '/dashboard',
            '/ledger/view',
            '/borrower/history',
            '/lender/portfolio',
            '/profile'
        ];
        
        const availableOffline = offlineAvailableRoutes.some(offlineRoute => 
            route.includes(offlineRoute)
        );
        
        if (!isOnline && !availableOffline) {
            return {
                allowed: false,
                redirect: '/offline.html',
                error: 'OFFLINE_MODE',
                message: 'This page is not available offline',
                duration: Date.now() - startTime
            };
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                ...context,
                isOnline,
                offlineMode: !isOnline,
                offlineChecked: true
            }
        };
    }

    /**
     * Hierarchy Guard Handler
     */
    async hierarchyGuardHandler(route, context) {
        const startTime = Date.now();
        
        if (!this.routeResolver) {
            return {
                allowed: true,
                duration: Date.now() - startTime,
                context,
                warnings: ['Route resolver not available for hierarchy validation']
            };
        }
        
        // Use route resolver to validate hierarchy
        const hierarchyResult = this.routeResolver.resolve(route, context);
        
        if (!hierarchyResult.allowed) {
            return {
                allowed: false,
                redirect: hierarchyResult.redirect || '/hierarchy-error.html',
                error: hierarchyResult.error || 'HIERARCHY_VIOLATION',
                message: hierarchyResult.message || 'Hierarchy rule violation',
                duration: Date.now() - startTime
            };
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                ...context,
                ...hierarchyResult.enforcedContext,
                hierarchyPath: hierarchyResult.hierarchyPath,
                hierarchyValidated: true
            },
            warnings: hierarchyResult.warnings || []
        };
    }

    /**
     * Enable/disable specific guard
     */
    setGuardEnabled(guardName, enabled) {
        const guard = this.guards.get(guardName);
        if (guard) {
            guard.enabled = enabled;
            this.updateGuardChain();
            console.log(`[RouteGuards] Guard '${guardName}' ${enabled ? 'enabled' : 'disabled'}`);
        }
        return this;
    }

    /**
     * Get guard statistics
     */
    getGuardStats() {
        const stats = {
            totalGuards: this.guards.size,
            enabledGuards: this.guardChain.length,
            disabledGuards: Array.from(this.guards.values()).filter(g => !g.enabled).length,
            guardDetails: {}
        };
        
        this.guards.forEach((guard, name) => {
            stats.guardDetails[name] = {
                enabled: guard.enabled,
                priority: guard.priority,
                failures: guard.failures,
                lastCheck: guard.lastCheck,
                description: guard.description
            };
        });
        
        return stats;
    }

    /**
     * Reset all guard failures
     */
    resetGuardFailures() {
        this.guards.forEach(guard => {
            guard.failures = 0;
        });
        console.log('[RouteGuards] All guard failures reset');
        return this;
    }

    /**
     * Export guard configuration
     */
    exportConfiguration() {
        return {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            guards: Array.from(this.guards.entries()).map(([name, config]) => ({
                name,
                priority: config.priority,
                enabled: config.enabled,
                description: config.description
            })),
            guardChain: this.guardChain.map(g => ({
                name: g.name,
                priority: g.priority
            }))
        };
    }
}

// Create singleton instance
const routeGuards = new RouteGuards();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = routeGuards;
} else {
    window.RouteGuards = routeGuards;
}