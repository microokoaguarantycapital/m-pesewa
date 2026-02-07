/**
 * M-PESEWA CONTEXT RESOLVER
 * Strict Hierarchy: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 * Version: 1.0.0
 * Last Updated: 2024-01-24
 */

// Strict country definitions - NO ALTERATION ALLOWED
const MPESEWA_COUNTRIES = [
    { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪', phone: '+254 709 219 000', enabled: true },
    { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬', phone: '+256 392 175 546', enabled: true },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿', phone: '+255 659 073 010', enabled: true },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼', phone: '+250 791 590 801', enabled: true },
    { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮', phone: '+257 79 000 000', enabled: true },
    { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩', phone: '+243 81 000 0000', enabled: true },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬', phone: '+234 800 000 0000', enabled: true },
    { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭', phone: '+233 24 000 0000', enabled: true },
    { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸', phone: '+211 955 000 000', enabled: true },
    { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴', phone: '+252 63 0000000', enabled: true },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦', phone: '+27 11 000 0000', enabled: true },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹', phone: '+251 11 000 0000', enabled: true }
];

// STRICT USER ROLES DEFINITION - NO ALTERATION
const MPESEWA_ROLES = {
    BORROWER: 'borrower',
    LENDER: 'lender',
    GROUP_ADMIN: 'group_admin',
    PLATFORM_ADMIN: 'platform_admin',
    GUEST: 'guest'
};

// STRICT HIERARCHY LEVELS - NON-NEGOTIABLE
const HIERARCHY_LEVELS = {
    GLOBAL: 'global',
    COUNTRY: 'country',
    GROUP: 'group',
    LENDER: 'lender',
    BORROWER: 'borrower',
    LEDGER: 'ledger'
};

// Strict subscription tiers
const SUBSCRIPTION_TIERS = {
    BASIC: { code: 'basic', maxAmount: 1500, priceMonthly: 50, priceBiAnnual: 250, priceAnnual: 500, crbRequired: false },
    PREMIUM: { code: 'premium', maxAmount: 5000, priceMonthly: 250, priceBiAnnual: 1500, priceAnnual: 2500, crbRequired: false },
    SUPER: { code: 'super', maxAmount: 20000, priceMonthly: 1000, priceBiAnnual: 5000, priceAnnual: 8500, crbRequired: true },
    LENDER_OF_LENDERS: { code: 'lender_of_lenders', maxAmount: 50000, priceMonthly: 500, priceBiAnnual: 3500, priceAnnual: 6500, crbRequired: true }
};

class MpesewaContextResolver {
    constructor() {
        this.currentContext = null;
        this.userState = null;
        this.hierarchyStack = [];
        this.validationRules = this._initializeValidationRules();
        this.init();
    }

    init() {
        this._loadUserState();
        this._resolveCurrentContext();
        this._buildHierarchyStack();
        this._validateContext();
    }

    // STRICT CONTEXT RESOLUTION - ENFORCES HIERARCHY
    _resolveCurrentContext() {
        const path = window.location.pathname;
        const queryParams = new URLSearchParams(window.location.search);
        
        // Get user data from localStorage (simulating backend)
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const country = userData.country || localStorage.getItem('mpesewa_country') || null;
        const groupId = userData.groupId || localStorage.getItem('mpesewa_group') || null;
        const userRole = userData.role || MPESEWA_ROLES.GUEST;
        const userId = userData.id || null;
        
        // Base context
        this.currentContext = {
            level: HIERARCHY_LEVELS.GLOBAL,
            country: null,
            group: null,
            role: userRole,
            userId: userId,
            subscription: userData.subscription || null,
            permissions: this._resolvePermissions(userRole, userData)
        };

        // 1. COUNTRY LEVEL RESOLUTION - STRICT ISOLATION
        const countryMatch = path.match(/\/(countries|country)\/([a-z-]+)/i);
        if (countryMatch) {
            const countryCode = this._normalizeCountryCode(countryMatch[2]);
            if (this._validateCountryAccess(countryCode, userData)) {
                this.currentContext.country = countryCode;
                this.currentContext.level = HIERARCHY_LEVELS.COUNTRY;
            } else {
                this._redirectToCountrySelection();
                return;
            }
        } else if (country && this._validateCountryAccess(country, userData)) {
            this.currentContext.country = country;
            this.currentContext.level = HIERARCHY_LEVELS.COUNTRY;
        }

        // 2. GROUP LEVEL RESOLUTION - STRICT GROUP ISOLATION
        const groupMatch = path.match(/\/groups?\/([^\/]+)/i);
        if (groupMatch) {
            const groupIdentifier = groupMatch[1];
            if (this.currentContext.country && this._validateGroupAccess(groupIdentifier, userData)) {
                this.currentContext.group = groupIdentifier;
                this.currentContext.level = HIERARCHY_LEVELS.GROUP;
            } else {
                this._redirectToGroups();
                return;
            }
        } else if (groupId && this.currentContext.country) {
            this.currentContext.group = groupId;
            this.currentContext.level = HIERARCHY_LEVELS.GROUP;
        }

        // 3. LENDER LEVEL RESOLUTION - SUBSCRIPTION REQUIRED
        if (path.includes('/lender/') && userRole === MPESEWA_ROLES.LENDER) {
            this.currentContext.level = HIERARCHY_LEVELS.LENDER;
            
            // Check subscription validity (expires 28th of each month)
            if (this.currentContext.subscription) {
                const expiryDate = new Date(this.currentContext.subscription.expiryDate);
                const today = new Date();
                if (today > expiryDate) {
                    this._redirectToSubscriptionExpired();
                    return;
                }
            }
            
            // Ledger specific context
            const ledgerMatch = path.match(/\/ledgers?\/([^\/]+)/i);
            if (ledgerMatch) {
                this.currentContext.ledger = ledgerMatch[1];
                this.currentContext.level = HIERARCHY_LEVELS.LEDGER;
            }
        }

        // 4. BORROWER LEVEL RESOLUTION - NO SUBSCRIPTION REQUIRED
        if (path.includes('/borrower/') && userRole === MPESEWA_ROLES.BORROWER) {
            this.currentContext.level = HIERARCHY_LEVELS.BORROWER;
            
            // Check borrower limits (max 4 groups, good rating required)
            if (userData.groups && userData.groups.length > 4 && userData.rating < 3) {
                this._redirectToBorrowerRestricted();
                return;
            }
        }

        // Store context for breadcrumbs and navigation
        localStorage.setItem('mpesewa_context', JSON.stringify(this.currentContext));
    }

    // STRICT PERMISSION RESOLUTION
    _resolvePermissions(role, userData) {
        const basePermissions = {
            canView: [],
            canEdit: [],
            canCreate: [],
            canDelete: [],
            canLend: false,
            canBorrow: false,
            canJoinGroups: false,
            canCreateGroups: false,
            canInvite: false,
            canModerate: false,
            canAdminOverride: false
        };

        switch(role) {
            case MPESEWA_ROLES.BORROWER:
                basePermissions.canBorrow = true;
                basePermissions.canJoinGroups = true;
                basePermissions.canView = ['borrower_dashboard', 'emergency_categories', 'loan_history', 'repayment_schedule'];
                basePermissions.canCreate = ['loan_request'];
                basePermissions.canEdit = ['profile', 'repayments'];
                break;

            case MPESEWA_ROLES.LENDER:
                basePermissions.canLend = true;
                basePermissions.canJoinGroups = true;
                basePermissions.canView = ['lender_dashboard', 'portfolio', 'ledgers', 'borrower_profiles', 'blacklist'];
                basePermissions.canCreate = ['ledgers', 'loan_offers'];
                basePermissions.canEdit = ['ledgers', 'borrower_ratings'];
                basePermissions.canDelete = ['ledgers'];
                break;

            case MPESEWA_ROLES.GROUP_ADMIN:
                basePermissions.canLend = true;
                basePermissions.canBorrow = true;
                basePermissions.canJoinGroups = true;
                basePermissions.canCreateGroups = true;
                basePermissions.canInvite = true;
                basePermissions.canModerate = true;
                basePermissions.canView = ['group_dashboard', 'member_list', 'group_ledgers', 'group_blacklist'];
                basePermissions.canCreate = ['groups', 'invites', 'group_rules'];
                basePermissions.canEdit = ['group_settings', 'member_roles', 'group_ledgers'];
                basePermissions.canDelete = ['members', 'invites'];
                break;

            case MPESEWA_ROLES.PLATFORM_ADMIN:
                basePermissions.canAdminOverride = true;
                basePermissions.canLend = true;
                basePermissions.canBorrow = true;
                basePermissions.canJoinGroups = true;
                basePermissions.canCreateGroups = true;
                basePermissions.canInvite = true;
                basePermissions.canModerate = true;
                basePermissions.canView = ['admin_dashboard', 'all_users', 'all_groups', 'all_ledgers', 'system_logs'];
                basePermissions.canCreate = ['all'];
                basePermissions.canEdit = ['all'];
                basePermissions.canDelete = ['all'];
                break;

            case MPESEWA_ROLES.GUEST:
                basePermissions.canView = ['home', 'about', 'countries', 'emergency_hub', 'subscription_plans', 'trust_section'];
                break;
        }

        // Additional rules based on subscription
        if (userData.subscription) {
            const tier = userData.subscription.tier;
            basePermissions.lendingLimit = SUBSCRIPTION_TIERS[tier.toUpperCase()]?.maxAmount || 0;
            
            if (tier === 'super' || tier === 'lender_of_lenders') {
                basePermissions.canView.push('crb_reports');
                basePermissions.canCreate.push('high_value_loans');
            }
        }

        // Group-specific permissions
        if (userData.groupId) {
            basePermissions.currentGroupId = userData.groupId;
            basePermissions.canInvite = basePermissions.canInvite && userData.groupRole === 'admin';
        }

        return basePermissions;
    }

    // STRICT COUNTRY VALIDATION - NO CROSS-COUNTRY ACCESS
    _validateCountryAccess(countryCode, userData) {
        // Platform admin can access all countries
        if (userData.role === MPESEWA_ROLES.PLATFORM_ADMIN) {
            return true;
        }

        // Registered users must match their country
        if (userData.country && userData.country !== countryCode) {
            console.error(`Country access violation: User from ${userData.country} trying to access ${countryCode}`);
            return false;
        }

        // Country must exist in our list
        const countryExists = MPESEWA_COUNTRIES.some(c => c.code === countryCode);
        if (!countryExists) {
            console.error(`Invalid country code: ${countryCode}`);
            return false;
        }

        return true;
    }

    // STRICT GROUP VALIDATION - NO CROSS-GROUP LENDING
    _validateGroupAccess(groupIdentifier, userData) {
        // Platform admin can access all groups
        if (userData.role === MPESEWA_ROLES.PLATFORM_ADMIN) {
            return true;
        }

        // User must be a member of the group
        const userGroups = userData.groups || [];
        const isMember = userGroups.some(g => 
            g.id === groupIdentifier || g.slug === groupIdentifier || g.name === groupIdentifier
        );

        if (!isMember) {
            console.error(`Group access violation: User not member of group ${groupIdentifier}`);
            return false;
        }

        // Check group-country consistency
        const groupCountry = this._getGroupCountry(groupIdentifier);
        if (groupCountry && groupCountry !== userData.country) {
            console.error(`Group-country mismatch: Group in ${groupCountry}, user in ${userData.country}`);
            return false;
        }

        return true;
    }

    // HIERARCHY STACK BUILDER - ENFORCES STRUCTURE
    _buildHierarchyStack() {
        this.hierarchyStack = [];
        
        // Always start with Global
        this.hierarchyStack.push({
            level: HIERARCHY_LEVELS.GLOBAL,
            label: 'M-Pesewa',
            path: '/'
        });

        // Add Country if present
        if (this.currentContext.country) {
            const country = MPESEWA_COUNTRIES.find(c => c.code === this.currentContext.country);
            if (country) {
                this.hierarchyStack.push({
                    level: HIERARCHY_LEVELS.COUNTRY,
                    label: `${country.flag} ${country.name}`,
                    path: `/countries/${country.code.toLowerCase()}`
                });
            }
        }

        // Add Group if present
        if (this.currentContext.group) {
            this.hierarchyStack.push({
                level: HIERARCHY_LEVELS.GROUP,
                label: this._getGroupName(this.currentContext.group),
                path: `/groups/${this.currentContext.group}`
            });
        }

        // Add Lender/Borrower context
        if (this.currentContext.level === HIERARCHY_LEVELS.LENDER || this.currentContext.level === HIERARCHY_LEVELS.BORROWER) {
            const roleLabel = this.currentContext.role === MPESEWA_ROLES.LENDER ? 'Lender Dashboard' : 'Borrower Dashboard';
            this.hierarchyStack.push({
                level: this.currentContext.level,
                label: roleLabel,
                path: `/${this.currentContext.role}/dashboard`
            });
        }

        // Add Ledger if present
        if (this.currentContext.ledger) {
            this.hierarchyStack.push({
                level: HIERARCHY_LEVELS.LEDGER,
                label: `Ledger: ${this.currentContext.ledger}`,
                path: `/ledgers/${this.currentContext.ledger}`
            });
        }
    }

    // VALIDATION RULES INITIALIZATION
    _initializeValidationRules() {
        return {
            // STRICT: No cross-country lending/borrowing
            crossCountryRestriction: (userCountry, targetCountry) => {
                return userCountry === targetCountry;
            },
            
            // STRICT: Lenders can only lend within their group
            groupLendingRestriction: (lenderGroupId, borrowerGroupId) => {
                return lenderGroupId === borrowerGroupId;
            },
            
            // STRICT: Borrower limits (max 4 groups, good rating required)
            borrowerGroupLimit: (userGroups, userRating) => {
                const maxGroups = userRating >= 3 ? 4 : 1; // Good rating = 3+ stars
                return userGroups.length <= maxGroups;
            },
            
            // STRICT: Subscription enforcement
            subscriptionValidity: (subscription) => {
                if (!subscription) return false;
                
                const expiryDate = new Date(subscription.expiryDate);
                const today = new Date();
                
                // Subscription expires on 28th of each month
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
                const expiryDay = Math.min(28, lastDay);
                
                const expectedExpiry = new Date(currentYear, currentMonth, expiryDay);
                
                return today <= expectedExpiry;
            },
            
            // STRICT: Loan amount limits per subscription tier
            loanAmountLimit: (amount, subscriptionTier) => {
                const tier = SUBSCRIPTION_TIERS[subscriptionTier?.toUpperCase()];
                if (!tier) return false;
                
                return amount <= tier.maxAmount;
            },
            
            // STRICT: Loan duration (7 days maximum)
            loanDurationLimit: (durationDays) => {
                return durationDays <= 7;
            },
            
            // STRICT: Interest rate (10% fixed)
            interestRate: () => {
                return 0.10; // 10%
            },
            
            // STRICT: Penalty after day 7 (5% daily)
            penaltyRate: (daysOverdue) => {
                return daysOverdue > 7 ? 0.05 : 0; // 5% daily after 7 days
            },
            
            // STRICT: Default after 2 months
            defaultThreshold: (daysOverdue) => {
                return daysOverdue > 60; // 2 months = ~60 days
            }
        };
    }

    // UTILITY METHODS
    _loadUserState() {
        try {
            const userData = localStorage.getItem('mpesewa_user');
            const contextData = localStorage.getItem('mpesewa_context');
            
            this.userState = userData ? JSON.parse(userData) : {
                role: MPESEWA_ROLES.GUEST,
                isAuthenticated: false
            };
            
            if (contextData) {
                this.currentContext = JSON.parse(contextData);
            }
        } catch (error) {
            console.error('Error loading user state:', error);
            this.userState = { role: MPESEWA_ROLES.GUEST, isAuthenticated: false };
        }
    }

    _normalizeCountryCode(input) {
        const normalized = input.toUpperCase();
        return MPESEWA_COUNTRIES.find(c => 
            c.code === normalized || 
            c.name.toLowerCase() === input.toLowerCase()
        )?.code || input.toUpperCase();
    }

    _getGroupName(groupId) {
        // In production, this would fetch from API
        const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '{}');
        return groups[groupId]?.name || `Group: ${groupId}`;
    }

    _getGroupCountry(groupId) {
        const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '{}');
        return groups[groupId]?.country;
    }

    // REDIRECTION METHODS (for violations)
    _redirectToCountrySelection() {
        if (!window.location.pathname.includes('/countries/')) {
            window.location.href = '/countries/selection.html';
        }
    }

    _redirectToGroups() {
        if (!window.location.pathname.includes('/groups/')) {
            window.location.href = '/groups/selection.html';
        }
    }

    _redirectToSubscriptionExpired() {
        window.location.href = '/subscription/expired.html';
    }

    _redirectToBorrowerRestricted() {
        window.location.href = '/borrower/restricted.html';
    }

    // PUBLIC API METHODS
    getCurrentContext() {
        return { ...this.currentContext };
    }

    getHierarchyStack() {
        return [...this.hierarchyStack];
    }

    getUserPermissions() {
        return this.currentContext?.permissions || {};
    }

    validateAction(action, params = {}) {
        const rules = this.validationRules;
        
        switch(action) {
            case 'CREATE_LOAN':
                return rules.loanAmountLimit(params.amount, this.currentContext.subscription?.tier) &&
                       rules.loanDurationLimit(params.duration) &&
                       rules.groupLendingRestriction(params.lenderGroup, params.borrowerGroup);
            
            case 'JOIN_GROUP':
                return rules.borrowerGroupLimit(params.userGroups, params.userRating);
            
            case 'LEND_MONEY':
                return rules.subscriptionValidity(this.currentContext.subscription) &&
                       rules.loanAmountLimit(params.amount, this.currentContext.subscription?.tier);
            
            case 'CROSS_COUNTRY':
                return rules.crossCountryRestriction(params.userCountry, params.targetCountry);
            
            default:
                return false;
        }
    }

    // Check if user can access a specific resource
    canAccess(resourceType, resourceId) {
        const permissions = this.getUserPermissions();
        
        switch(resourceType) {
            case 'GROUP':
                return permissions.canJoinGroups && 
                       this.userState.groups?.some(g => g.id === resourceId);
            
            case 'LEDGER':
                return permissions.canView.includes('ledgers') && 
                       (this.userState.role === MPESEWA_ROLES.LENDER || 
                        this.userState.role === MPESEWA_ROLES.GROUP_ADMIN);
            
            case 'BORROWER_PROFILE':
                return permissions.canView.includes('borrower_profiles') && 
                       this.userState.role === MPESEWA_ROLES.LENDER;
            
            case 'ADMIN_PANEL':
                return permissions.canAdminOverride;
            
            default:
                return false;
        }
    }

    // Switch between borrower/lender roles
    switchRole(newRole) {
        if (![MPESEWA_ROLES.BORROWER, MPESEWA_ROLES.LENDER].includes(newRole)) {
            throw new Error('Invalid role switch');
        }

        // For dual-role users, switch contexts
        if (this.userState.roles && this.userState.roles.includes(newRole)) {
            this.currentContext.role = newRole;
            this.currentContext.permissions = this._resolvePermissions(newRole, this.userState);
            this._buildHierarchyStack();
            
            // Save to localStorage
            localStorage.setItem('mpesewa_context', JSON.stringify(this.currentContext));
            
            // Redirect to appropriate dashboard
            window.location.href = `/${newRole}/dashboard.html`;
            return true;
        }
        
        return false;
    }

    // Get country-specific configuration
    getCountryConfig(countryCode) {
        return MPESEWA_COUNTRIES.find(c => c.code === countryCode);
    }

    // Validate entire context
    _validateContext() {
        const errors = [];
        
        // Check country isolation
        if (this.currentContext.country && this.userState.country && 
            this.currentContext.country !== this.userState.country) {
            errors.push('Country isolation violation');
        }
        
        // Check group membership for group context
        if (this.currentContext.group && !this._validateGroupAccess(this.currentContext.group, this.userState)) {
            errors.push('Group access violation');
        }
        
        // Check subscription for lenders
        if (this.currentContext.role === MPESEWA_ROLES.LENDER && 
            !this.validationRules.subscriptionValidity(this.currentContext.subscription)) {
            errors.push('Subscription expired or invalid');
        }
        
        // Check borrower group limits
        if (this.currentContext.role === MPESEWA_ROLES.BORROWER && 
            this.userState.groups && 
            !this.validationRules.borrowerGroupLimit(this.userState.groups, this.userState.rating || 0)) {
            errors.push('Borrower group limit exceeded');
        }
        
        if (errors.length > 0) {
            console.error('Context validation errors:', errors);
            this._handleValidationErrors(errors);
            return false;
        }
        
        return true;
    }

    _handleValidationErrors(errors) {
        // Redirect based on error type
        if (errors.some(e => e.includes('Country isolation'))) {
            this._redirectToCountrySelection();
        } else if (errors.some(e => e.includes('Group access'))) {
            this._redirectToGroups();
        } else if (errors.some(e => e.includes('Subscription'))) {
            this._redirectToSubscriptionExpired();
        } else if (errors.some(e => e.includes('Borrower group limit'))) {
            this._redirectToBorrowerRestricted();
        }
    }
}

// Initialize and export singleton instance
const contextResolver = new MpesewaContextResolver();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = contextResolver;
} else {
    window.MpesewaContextResolver = contextResolver;
}