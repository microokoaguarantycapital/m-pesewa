/**
 * M-PESEWA ROUTE RESOLVER
 * Strict Hierarchy: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 * Non-negotiable structure enforcement
 */

class RouteResolver {
    constructor() {
        this.hierarchy = {
            global: {},
            countries: {},
            groups: {},
            lenders: {},
            borrowers: {},
            ledgers: {}
        };
        
        // Define the 12 Sub-Saharan African countries
        this.countries = [
            'kenya', 'uganda', 'tanzania', 'rwanda', 'drc', 'burundi',
            'nigeria', 'ghana', 'south-sudan', 'somalia', 'south-africa', 'ethiopia'
        ];
        
        this.countryCodes = {
            'kenya': 'KE',
            'uganda': 'UG',
            'tanzania': 'TZ',
            'rwanda': 'RW',
            'drc': 'CD',
            'burundi': 'BI',
            'nigeria': 'NG',
            'ghana': 'GH',
            'south-sudan': 'SS',
            'somalia': 'SO',
            'south-africa': 'ZA',
            'ethiopia': 'ET'
        };
        
        this.currencies = {
            'kenya': 'KSh',
            'uganda': 'UGX',
            'tanzania': 'TZS',
            'rwanda': 'RWF',
            'drc': 'CDF',
            'burundi': 'BIF',
            'nigeria': 'NGN',
            'ghana': 'GHS',
            'south-sudan': 'SSP',
            'somalia': 'SOS',
            'south-africa': 'ZAR',
            'ethiopia': 'ETB'
        };
        
        this.initialized = false;
    }

    /**
     * Initialize route resolver with current user context
     */
    initialize(userContext = {}) {
        console.log('[RouteResolver] Initializing with user context:', userContext);
        
        this.userContext = {
            isAuthenticated: userContext.isAuthenticated || false,
            userId: userContext.userId || null,
            userRole: userContext.userRole || null,
            country: userContext.country || null,
            groupId: userContext.groupId || null,
            isLender: userContext.isLender || false,
            isBorrower: userContext.isBorrower || false,
            isAdmin: userContext.isAdmin || false,
            subscription: userContext.subscription || null,
            subscriptionExpiry: userContext.subscriptionExpiry || null,
            isBlacklisted: userContext.isBlacklisted || false,
            borrowerRating: userContext.borrowerRating || null,
            groupsJoined: userContext.groupsJoined || 0,
            ledgerCount: userContext.ledgerCount || 0
        };
        
        // Validate and enforce country lock
        if (this.userContext.country) {
            this.enforceCountryLock(this.userContext.country);
        }
        
        // Validate hierarchy compliance
        this.validateHierarchyCompliance();
        
        this.initialized = true;
        return this;
    }

    /**
     * Resolve route based on hierarchy rules
     */
    resolve(path, params = {}) {
        if (!this.initialized) {
            console.warn('[RouteResolver] Not initialized. Initializing with empty context.');
            this.initialize();
        }
        
        console.log(`[RouteResolver] Resolving path: ${path} with params:`, params);
        
        // Parse path segments
        const segments = path.split('/').filter(segment => segment.trim() !== '');
        
        // Check for country isolation violation
        if (this.hasCountryIsolationViolation(segments, params)) {
            console.error('[RouteResolver] Country isolation violation detected!');
            return {
                allowed: false,
                redirect: this.getCountryRedirect(),
                error: 'COUNTRY_ISOLATION_VIOLATION',
                message: 'Cross-country access is strictly prohibited.'
            };
        }
        
        // Check for group isolation violation
        if (this.hasGroupIsolationViolation(segments, params)) {
            console.error('[RouteResolver] Group isolation violation detected!');
            return {
                allowed: false,
                redirect: '/groups/selector.html',
                error: 'GROUP_ISOLATION_VIOLATION',
                message: 'Lenders can only operate within their assigned groups.'
            };
        }
        
        // Check for borrower group limit violation
        if (this.hasBorrowerGroupLimitViolation(segments, params)) {
            console.error('[RouteResolver] Borrower group limit violation detected!');
            return {
                allowed: false,
                redirect: '/borrower/dashboard.html',
                error: 'BORROWER_GROUP_LIMIT_VIOLATION',
                message: 'Borrowers can join maximum of 4 groups only.'
            };
        }
        
        // Check for subscription enforcement
        if (this.hasSubscriptionViolation(segments, params)) {
            console.error('[RouteResolver] Subscription violation detected!');
            return {
                allowed: false,
                redirect: '/subscription/expired.html',
                error: 'SUBSCRIPTION_VIOLATION',
                message: 'Lender subscription expired. Access blocked until payment.'
            };
        }
        
        // Apply hierarchy-based resolution
        return this.applyHierarchyResolution(segments, params);
    }

    /**
     * STRICT: Country isolation enforcement
     * No cross-country lending or borrowing
     */
    hasCountryIsolationViolation(segments, params) {
        if (!this.userContext.country) return false;
        
        // Extract target country from segments or params
        let targetCountry = null;
        
        // Check URL segments for country paths
        segments.forEach((segment, index) => {
            if (segment === 'countries' && segments[index + 1]) {
                targetCountry = segments[index + 1];
            }
        });
        
        // Check params for country
        if (params.country) {
            targetCountry = params.country;
        }
        
        // If no target country specified, assume it's global or country-neutral
        if (!targetCountry) return false;
        
        // Normalize country names
        const normalizedUserCountry = this.normalizeCountryName(this.userContext.country);
        const normalizedTargetCountry = this.normalizeCountryName(targetCountry);
        
        // STRICT ENFORCEMENT: User can only access their own country's resources
        if (normalizedTargetCountry && normalizedUserCountry !== normalizedTargetCountry) {
            console.error(`[Country Isolation] User from ${normalizedUserCountry} attempting to access ${normalizedTargetCountry}`);
            return true;
        }
        
        return false;
    }

    /**
     * STRICT: Group isolation enforcement
     * Lenders can only lend within their group
     */
    hasGroupIsolationViolation(segments, params) {
        if (!this.userContext.isLender || !this.userContext.groupId) return false;
        
        // Extract target group from segments or params
        let targetGroupId = null;
        
        segments.forEach((segment, index) => {
            if (segment === 'groups' && segments[index + 1]) {
                targetGroupId = segments[index + 1];
            }
            if (segment === 'lender' && segments[index + 1] === 'portfolio') {
                // Lender portfolio should only show their group's data
                if (params.groupId) {
                    targetGroupId = params.groupId;
                }
            }
        });
        
        // If no target group specified, assume it's the user's group
        if (!targetGroupId) return false;
        
        // STRICT ENFORCEMENT: Lenders can only access their own group
        if (this.userContext.groupId !== targetGroupId) {
            console.error(`[Group Isolation] Lender from group ${this.userContext.groupId} attempting to access group ${targetGroupId}`);
            return true;
        }
        
        return false;
    }

    /**
     * STRICT: Borrower group limit enforcement
     * Maximum of 4 groups, only with good rating
     */
    hasBorrowerGroupLimitViolation(segments, params) {
        if (!this.userContext.isBorrower) return false;
        
        // Check if borrower is trying to join a new group
        if (segments.includes('groups') && segments.includes('join')) {
            // Check current group count
            if (this.userContext.groupsJoined >= 4) {
                console.error(`[Borrower Group Limit] Borrower already in ${this.userContext.groupsJoined} groups`);
                return true;
            }
            
            // Check borrower rating for new groups
            if (this.userContext.groupsJoined > 0 && this.userContext.borrowerRating < 3) {
                console.error(`[Borrower Group Limit] Borrower rating ${this.userContext.borrowerRating} too low for additional groups`);
                return true;
            }
        }
        
        return false;
    }

    /**
     * STRICT: Subscription enforcement
     * Lenders blocked when subscription expires (28th of each month)
     */
    hasSubscriptionViolation(segments, params) {
        if (!this.userContext.isLender) return false;
        
        // Check if route requires active subscription
        const subscriptionRequiredRoutes = [
            'lender/dashboard',
            'lender/portfolio',
            'lending',
            'ledger'
        ];
        
        const currentRoute = segments.join('/');
        const requiresSubscription = subscriptionRequiredRoutes.some(route => 
            currentRoute.includes(route)
        );
        
        if (!requiresSubscription) return false;
        
        // Check subscription status
        if (!this.userContext.subscription) {
            console.error('[Subscription] Lender has no subscription');
            return true;
        }
        
        // Check subscription expiry (28th of each month)
        if (this.isSubscriptionExpired()) {
            console.error('[Subscription] Lender subscription expired');
            return true;
        }
        
        // Check lending limits based on subscription tier
        if (this.exceedsSubscriptionLimit(segments, params)) {
            console.error('[Subscription] Exceeds subscription tier limit');
            return true;
        }
        
        return false;
    }

    /**
     * Apply hierarchy-based resolution
     * Global → Country → Groups → Lenders → Borrowers → Ledgers
     */
    applyHierarchyResolution(segments, params) {
        const result = {
            allowed: true,
            redirect: null,
            hierarchyPath: [],
            enforcedContext: {},
            warnings: []
        };
        
        // Build hierarchy path
        const hierarchyPath = this.buildHierarchyPath(segments);
        result.hierarchyPath = hierarchyPath;
        
        // Enforce hierarchy order
        if (!this.validateHierarchyOrder(hierarchyPath)) {
            result.allowed = false;
            result.redirect = '/404.html';
            result.error = 'HIERARCHY_ORDER_VIOLATION';
            result.message = 'Invalid hierarchy path order';
            return result;
        }
        
        // Apply context based on hierarchy
        result.enforcedContext = this.applyHierarchyContext(hierarchyPath, params);
        
        // Check admin override capabilities
        if (this.userContext.isAdmin) {
            result.warnings.push('Admin override privileges active');
            // Admin can bypass some restrictions
            if (result.enforcedContext.country && result.enforcedContext.country !== this.userContext.country) {
                result.warnings.push('Admin accessing foreign country data');
            }
        }
        
        return result;
    }

    /**
     * Build hierarchy path from segments
     */
    buildHierarchyPath(segments) {
        const path = [];
        
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            
            switch(segment) {
                case 'countries':
                    if (segments[i + 1] && this.countries.includes(segments[i + 1])) {
                        path.push({
                            level: 'country',
                            id: segments[i + 1],
                            name: this.formatCountryName(segments[i + 1]),
                            code: this.countryCodes[segments[i + 1]]
                        });
                        i++; // Skip next segment as it's the country identifier
                    }
                    break;
                    
                case 'groups':
                    if (segments[i + 1] && segments[i + 1] !== 'create' && segments[i + 1] !== 'join') {
                        path.push({
                            level: 'group',
                            id: segments[i + 1],
                            requiresAuth: true
                        });
                        i++;
                    }
                    break;
                    
                case 'lender':
                case 'lenders':
                    path.push({
                        level: 'lender',
                        requiresAuth: true,
                        requiresSubscription: true
                    });
                    break;
                    
                case 'borrower':
                case 'borrowers':
                    path.push({
                        level: 'borrower',
                        requiresAuth: true
                    });
                    break;
                    
                case 'ledger':
                case 'ledgers':
                    path.push({
                        level: 'ledger',
                        requiresAuth: true,
                        requiresGroupContext: true
                    });
                    break;
                    
                case 'admin':
                    path.push({
                        level: 'admin',
                        requiresAuth: true,
                        requiresAdmin: true
                    });
                    break;
            }
        }
        
        return path;
    }

    /**
     * Validate hierarchy order
     * Must follow: Global → Country → Groups → (Lenders|Borrowers) → Ledgers
     */
    validateHierarchyOrder(hierarchyPath) {
        const validOrder = [
            [], // Global only
            ['country'], // Country level
            ['country', 'group'], // Group within country
            ['country', 'group', 'lender'], // Lender within group within country
            ['country', 'group', 'borrower'], // Borrower within group within country
            ['country', 'group', 'lender', 'ledger'], // Ledger within lender within group within country
            ['admin'] // Admin special path
        ];
        
        const currentOrder = hierarchyPath.map(item => item.level);
        
        // Check if current order matches any valid order
        const isValid = validOrder.some(valid => {
            if (valid.length !== currentOrder.length) return false;
            return valid.every((level, index) => level === currentOrder[index]);
        });
        
        if (!isValid) {
            console.error(`[Hierarchy] Invalid order: ${currentOrder.join(' → ')}`);
        }
        
        return isValid;
    }

    /**
     * Apply hierarchy context to route
     */
    applyHierarchyContext(hierarchyPath, params) {
        const context = {
            country: null,
            group: null,
            role: null,
            currency: null,
            restrictions: [],
            permissions: []
        };
        
        hierarchyPath.forEach(item => {
            switch(item.level) {
                case 'country':
                    context.country = item.id;
                    context.currency = this.currencies[item.id] || 'USD';
                    context.restrictions.push('NO_CROSS_COUNTRY');
                    break;
                    
                case 'group':
                    context.group = item.id;
                    context.restrictions.push('GROUP_ISOLATION');
                    context.permissions.push('VIEW_GROUP_MEMBERS');
                    break;
                    
                case 'lender':
                    context.role = 'lender';
                    context.permissions.push('CREATE_LEDGERS', 'APPROVE_LOANS', 'RATE_BORROWERS');
                    context.restrictions.push('SUBSCRIPTION_REQUIRED');
                    break;
                    
                case 'borrower':
                    context.role = 'borrower';
                    context.permissions.push('REQUEST_LOANS', 'VIEW_ACTIVE_LOANS');
                    context.restrictions.push('MAX_4_GROUPS');
                    break;
                    
                case 'ledger':
                    context.permissions.push('VIEW_LEDGER', 'UPDATE_REPAYMENTS');
                    break;
                    
                case 'admin':
                    context.role = 'admin';
                    context.permissions.push('OVERRIDE_BLACKLIST', 'EDIT_LEDGERS', 'MODERATE_RATINGS');
                    break;
            }
        });
        
        // Apply user context if available
        if (this.userContext.country && !context.country) {
            context.country = this.userContext.country;
            context.currency = this.currencies[this.userContext.country] || 'USD';
        }
        
        return context;
    }

    /**
     * Check if subscription is expired
     * Subscription expires on 28th of each month
     */
    isSubscriptionExpired() {
        if (!this.userContext.subscriptionExpiry) return true;
        
        const expiryDate = new Date(this.userContext.subscriptionExpiry);
        const today = new Date();
        
        // Check if it's past the 28th of current month
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const expiryDay = new Date(currentYear, currentMonth, 28);
        
        return today > expiryDay;
    }

    /**
     * Check if request exceeds subscription tier limits
     */
    exceedsSubscriptionLimit(segments, params) {
        if (!this.userContext.subscription) return true;
        
        const tier = this.userContext.subscription.tier; // basic, premium, super
        const amount = params.amount || 0;
        
        // Weekly limits per tier
        const tierLimits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        
        const limit = tierLimits[tier] || 0;
        
        // Check if this is a lending action with amount
        if (segments.includes('lend') || segments.includes('approve')) {
            if (amount > limit) {
                console.error(`[Subscription] Amount ${amount} exceeds tier ${tier} limit ${limit}`);
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get country-specific redirect
     */
    getCountryRedirect() {
        if (!this.userContext.country) {
            return '/countries/selector.html';
        }
        
        return `/countries/${this.userContext.country}/dashboard.html`;
    }

    /**
     * Normalize country name for comparison
     */
    normalizeCountryName(country) {
        if (!country) return null;
        
        return country.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }

    /**
     * Format country name for display
     */
    formatCountryName(countrySlug) {
        return countrySlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Enforce country lock - no changing after registration
     */
    enforceCountryLock(country) {
        // Store in localStorage to persist across sessions
        localStorage.setItem('mpesewa_country', country);
        localStorage.setItem('mpesewa_country_locked', 'true');
        
        console.log(`[Country Lock] User locked to country: ${country}`);
    }

    /**
     * Validate hierarchy compliance
     */
    validateHierarchyCompliance() {
        const violations = [];
        
        // Check country lock
        const storedCountry = localStorage.getItem('mpesewa_country');
        if (storedCountry && this.userContext.country && storedCountry !== this.userContext.country) {
            violations.push('Country mismatch between session and storage');
        }
        
        // Check group consistency
        if (this.userContext.groupId && this.userContext.groupsJoined > 4) {
            violations.push('Borrower in more than 4 groups');
        }
        
        // Check subscription consistency for lenders
        if (this.userContext.isLender && !this.userContext.subscription) {
            violations.push('Lender has no subscription');
        }
        
        if (violations.length > 0) {
            console.warn('[Hierarchy Compliance] Violations detected:', violations);
            return false;
        }
        
        return true;
    }

    /**
     * Get current hierarchy path for UI display
     */
    getCurrentHierarchyPath() {
        const path = ['Global'];
        
        if (this.userContext.country) {
            path.push(this.formatCountryName(this.userContext.country));
        }
        
        if (this.userContext.groupId) {
            path.push(`Group: ${this.userContext.groupId.substring(0, 8)}...`);
        }
        
        if (this.userContext.isLender) {
            path.push('Lender');
            if (this.userContext.ledgerCount > 0) {
                path.push(`Ledgers: ${this.userContext.ledgerCount}`);
            }
        }
        
        if (this.userContext.isBorrower) {
            path.push('Borrower');
        }
        
        return path.join(' → ');
    }

    /**
     * Get subscription status with expiry info
     */
    getSubscriptionStatus() {
        if (!this.userContext.subscription) {
            return {
                active: false,
                tier: null,
                expires: null,
                daysRemaining: 0,
                status: 'NO_SUBSCRIPTION'
            };
        }
        
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const expiryDate = new Date(currentYear, currentMonth, 28);
        
        const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        return {
            active: daysRemaining > 0,
            tier: this.userContext.subscription.tier,
            expires: expiryDate.toISOString().split('T')[0],
            daysRemaining: Math.max(0, daysRemaining),
            status: daysRemaining > 0 ? 'ACTIVE' : 'EXPIRED'
        };
    }

    /**
     * Reset resolver (for logout)
     */
    reset() {
        this.userContext = {};
        this.initialized = false;
        console.log('[RouteResolver] Reset complete');
    }

    /**
     * Export current state for debugging
     */
    exportState() {
        return {
            userContext: this.userContext,
            hierarchy: this.hierarchy,
            countries: this.countries,
            initialized: this.initialized,
            currentHierarchyPath: this.getCurrentHierarchyPath(),
            subscriptionStatus: this.getSubscriptionStatus()
        };
    }
}

// Create singleton instance
const routeResolver = new RouteResolver();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = routeResolver;
} else {
    window.RouteResolver = routeResolver;
}