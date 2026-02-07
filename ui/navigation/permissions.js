/**
 * M-PESEWA PERMISSIONS SYSTEM
 * Enforces strict access control based on hierarchy and business rules
 * Non-negotiable permission structure for Global → Country → Groups → Lenders → Borrowers
 */

// ============================================================================
// 1️⃣ PERMISSION CONSTANTS & BIT MASKS
// ============================================================================

const PERMISSION_FLAGS = Object.freeze({
    // Global permissions (Platform Admin only)
    VIEW_GLOBAL_STATS: 1 << 0,
    MANAGE_ALL_COUNTRIES: 1 << 1,
    OVERRIDE_BLACKLIST: 1 << 2,
    MANAGE_PLATFORM_ADMINS: 1 << 3,
    VIEW_SYSTEM_AUDIT: 1 << 4,
    EXPORT_ALL_DATA: 1 << 5,
    
    // Country-level permissions
    VIEW_COUNTRY_DASHBOARD: 1 << 6,
    MANAGE_COUNTRY_GROUPS: 1 << 7,
    VIEW_COUNTRY_REPORTS: 1 << 8,
    MANAGE_COUNTRY_RULES: 1 << 9,
    EXPORT_COUNTRY_DATA: 1 << 10,
    
    // Group-level permissions
    CREATE_GROUP: 1 << 11,
    JOIN_GROUP: 1 << 12,
    VIEW_GROUP_DASHBOARD: 1 << 13,
    VIEW_GROUP_MEMBERS: 1 << 14,
    INVITE_TO_GROUP: 1 << 15,
    MANAGE_GROUP_SETTINGS: 1 << 16,
    REMOVE_GROUP_MEMBER: 1 << 17,
    VIEW_GROUP_REPORTS: 1 << 18,
    
    // Lender permissions
    LEND_MONEY: 1 << 19,
    CREATE_LEDGER: 1 << 20,
    VIEW_LENDING_PORTFOLIO: 1 << 21,
    MANAGE_LEDGERS: 1 << 22,
    RATE_BORROWERS: 1 << 23,
    APPLY_BLACKLIST: 1 << 24,
    VIEW_LENDING_HISTORY: 1 << 25,
    UPGRADE_SUBSCRIPTION: 1 << 26,
    
    // Borrower permissions
    REQUEST_LOAN: 1 << 27,
    VIEW_ACTIVE_LOANS: 1 << 28,
    VIEW_REPAYMENT_SCHEDULE: 1 << 29,
    MAKE_REPAYMENT: 1 << 30,
    VIEW_BORROWING_HISTORY: 1 << 31,
    VIEW_CREDIT_RATING: 1 << 32,
    APPEAL_BLACKLIST: 1 << 33,
    JOIN_MULTIPLE_GROUPS: 1 << 34,
    
    // Emergency Hub permissions
    VIEW_EMERGENCY_CATEGORIES: 1 << 35,
    REQUEST_EMERGENCY_LOAN: 1 << 36,
    VIEW_EMERGENCY_STATS: 1 << 37,
    
    // Shared permissions
    UPDATE_PROFILE: 1 << 38,
    CHANGE_PASSWORD: 1 << 39,
    VIEW_NOTIFICATIONS: 1 << 40,
    CONTACT_SUPPORT: 1 << 41,
    VIEW_TERMS: 1 << 42,
    EXPORT_PERSONAL_DATA: 1 << 43
});

// ============================================================================
// 2️⃣ ROLE PERMISSION MAPPINGS (STRICT RULES)
// ============================================================================

const ROLE_PERMISSIONS = Object.freeze({
    // Platform Administrator - Full access
    PLATFORM_ADMIN: [
        // Global
        PERMISSION_FLAGS.VIEW_GLOBAL_STATS,
        PERMISSION_FLAGS.MANAGE_ALL_COUNTRIES,
        PERMISSION_FLAGS.OVERRIDE_BLACKLIST,
        PERMISSION_FLAGS.MANAGE_PLATFORM_ADMINS,
        PERMISSION_FLAGS.VIEW_SYSTEM_AUDIT,
        PERMISSION_FLAGS.EXPORT_ALL_DATA,
        
        // Country
        PERMISSION_FLAGS.VIEW_COUNTRY_DASHBOARD,
        PERMISSION_FLAGS.MANAGE_COUNTRY_GROUPS,
        PERMISSION_FLAGS.VIEW_COUNTRY_REPORTS,
        PERMISSION_FLAGS.MANAGE_COUNTRY_RULES,
        PERMISSION_FLAGS.EXPORT_COUNTRY_DATA,
        
        // Group
        PERMISSION_FLAGS.CREATE_GROUP,
        PERMISSION_FLAGS.JOIN_GROUP,
        PERMISSION_FLAGS.VIEW_GROUP_DASHBOARD,
        PERMISSION_FLAGS.VIEW_GROUP_MEMBERS,
        PERMISSION_FLAGS.INVITE_TO_GROUP,
        PERMISSION_FLAGS.MANAGE_GROUP_SETTINGS,
        PERMISSION_FLAGS.REMOVE_GROUP_MEMBER,
        PERMISSION_FLAGS.VIEW_GROUP_REPORTS,
        
        // Shared
        PERMISSION_FLAGS.UPDATE_PROFILE,
        PERMISSION_FLAGS.CHANGE_PASSWORD,
        PERMISSION_FLAGS.VIEW_NOTIFICATIONS,
        PERMISSION_FLAGS.CONTACT_SUPPORT,
        PERMISSION_FLAGS.VIEW_TERMS,
        PERMISSION_FLAGS.EXPORT_PERSONAL_DATA
    ].reduce((acc, flag) => acc | flag, 0),
    
    // Group Administrator - Group management only
    GROUP_ADMIN: [
        // Group
        PERMISSION_FLAGS.VIEW_GROUP_DASHBOARD,
        PERMISSION_FLAGS.VIEW_GROUP_MEMBERS,
        PERMISSION_FLAGS.INVITE_TO_GROUP,
        PERMISSION_FLAGS.MANAGE_GROUP_SETTINGS,
        PERMISSION_FLAGS.REMOVE_GROUP_MEMBER,
        PERMISSION_FLAGS.VIEW_GROUP_REPORTS,
        
        // Can also be lender or borrower in their group
        PERMISSION_FLAGS.LEND_MONEY,
        PERMISSION_FLAGS.REQUEST_LOAN,
        
        // Shared
        PERMISSION_FLAGS.UPDATE_PROFILE,
        PERMISSION_FLAGS.CHANGE_PASSWORD,
        PERMISSION_FLAGS.VIEW_NOTIFICATIONS,
        PERMISSION_FLAGS.CONTACT_SUPPORT,
        PERMISSION_FLAGS.VIEW_TERMS,
        PERMISSION_FLAGS.EXPORT_PERSONAL_DATA
    ].reduce((acc, flag) => acc | flag, 0),
    
    // Lender - Lending operations only
    LENDER: [
        // Lender specific
        PERMISSION_FLAGS.LEND_MONEY,
        PERMISSION_FLAGS.CREATE_LEDGER,
        PERMISSION_FLAGS.VIEW_LENDING_PORTFOLIO,
        PERMISSION_FLAGS.MANAGE_LEDGERS,
        PERMISSION_FLAGS.RATE_BORROWERS,
        PERMISSION_FLAGS.APPLY_BLACKLIST,
        PERMISSION_FLAGS.VIEW_LENDING_HISTORY,
        PERMISSION_FLAGS.UPGRADE_SUBSCRIPTION,
        
        // Group
        PERMISSION_FLAGS.VIEW_GROUP_DASHBOARD,
        PERMISSION_FLAGS.VIEW_GROUP_MEMBERS,
        
        // Emergency
        PERMISSION_FLAGS.VIEW_EMERGENCY_CATEGORIES,
        PERMISSION_FLAGS.VIEW_EMERGENCY_STATS,
        
        // Shared
        PERMISSION_FLAGS.UPDATE_PROFILE,
        PERMISSION_FLAGS.CHANGE_PASSWORD,
        PERMISSION_FLAGS.VIEW_NOTIFICATIONS,
        PERMISSION_FLAGS.CONTACT_SUPPORT,
        PERMISSION_FLAGS.VIEW_TERMS,
        PERMISSION_FLAGS.EXPORT_PERSONAL_DATA
    ].reduce((acc, flag) => acc | flag, 0),
    
    // Borrower - Borrowing operations only
    BORROWER: [
        // Borrower specific
        PERMISSION_FLAGS.REQUEST_LOAN,
        PERMISSION_FLAGS.VIEW_ACTIVE_LOANS,
        PERMISSION_FLAGS.VIEW_REPAYMENT_SCHEDULE,
        PERMISSION_FLAGS.MAKE_REPAYMENT,
        PERMISSION_FLAGS.VIEW_BORROWING_HISTORY,
        PERMISSION_FLAGS.VIEW_CREDIT_RATING,
        PERMISSION_FLAGS.APPEAL_BLACKLIST,
        PERMISSION_FLAGS.JOIN_MULTIPLE_GROUPS,
        
        // Emergency
        PERMISSION_FLAGS.VIEW_EMERGENCY_CATEGORIES,
        PERMISSION_FLAGS.REQUEST_EMERGENCY_LOAN,
        PERMISSION_FLAGS.VIEW_EMERGENCY_STATS,
        
        // Group
        PERMISSION_FLAGS.VIEW_GROUP_DASHBOARD,
        PERMISSION_FLAGS.VIEW_GROUP_MEMBERS,
        
        // Shared
        PERMISSION_FLAGS.UPDATE_PROFILE,
        PERMISSION_FLAGS.CHANGE_PASSWORD,
        PERMISSION_FLAGS.VIEW_NOTIFICATIONS,
        PERMISSION_FLAGS.CONTACT_SUPPORT,
        PERMISSION_FLAGS.VIEW_TERMS,
        PERMISSION_FLAGS.EXPORT_PERSONAL_DATA
    ].reduce((acc, flag) => acc | flag, 0)
});

// ============================================================================
// 3️⃣ BUSINESS RULE CONSTRAINTS
// ============================================================================

const BUSINESS_RULES = Object.freeze({
    // Country isolation rules
    COUNTRY_ISOLATION: {
        description: 'No cross-country lending or borrowing',
        check: (userCountry, targetCountry, action) => {
            return userCountry === targetCountry;
        },
        errorMessage: (action, userCountry, targetCountry) => 
            `${action} not allowed across countries. User in ${userCountry}, target in ${targetCountry}`
    },
    
    // Group isolation rules
    GROUP_ISOLATION: {
        description: 'Lenders can only lend within their group',
        check: (userGroup, targetGroup, action) => {
            return userGroup === targetGroup || action !== 'LEND_MONEY';
        },
        errorMessage: (action, userGroup, targetGroup) =>
            `Lending not allowed outside group. User in ${userGroup}, target in ${targetGroup}`
    },
    
    // Borrower group limit rules
    BORROWER_GROUP_LIMIT: {
        description: 'Borrowers can join max 4 groups with good rating',
        check: (currentGroups, rating, action) => {
            if (action === 'JOIN_GROUP') {
                if (currentGroups.length >= 4) {
                    return false;
                }
                if (currentGroups.length >= 2 && rating < 3.5) {
                    return false;
                }
            }
            return true;
        },
        errorMessage: (currentGroups, rating) => {
            if (currentGroups.length >= 4) {
                return 'Maximum of 4 groups reached';
            }
            if (currentGroups.length >= 2 && rating < 3.5) {
                return 'Rating too low to join additional groups';
            }
            return '';
        }
    },
    
    // Subscription enforcement rules
    SUBSCRIPTION_ENFORCEMENT: {
        description: 'Lenders blocked when subscription expires',
        check: (subscription, action) => {
            if (action === 'LEND_MONEY' || action === 'CREATE_LEDGER') {
                return subscription?.is_active === true;
            }
            return true;
        },
        errorMessage: (subscription) => {
            if (!subscription) return 'Subscription required';
            if (!subscription.is_active) return 'Subscription expired';
            return '';
        }
    },
    
    // Loan amount limits by tier
    LOAN_AMOUNT_LIMITS: {
        BASIC: 1500,
        PREMIUM: 5000,
        SUPER: 20000,
        LENDER_OF_LENDERS: 50000,
        check: (tier, amount, currency) => {
            const limits = this.LOAN_AMOUNT_LIMITS;
            const limit = limits[tier?.toUpperCase()] || limits.BASIC;
            return amount <= limit;
        },
        errorMessage: (tier, amount, limit) =>
            `Loan amount ${amount} exceeds ${tier} tier limit of ${limit}`
    },
    
    // Repayment rules
    REPAYMENT_RULES: {
        INTEREST_RATE: 0.10, // 10%
        PENALTY_RATE: 0.05, // 5% daily after 7 days
        MAX_REPAYMENT_DAYS: 7,
        DEFAULT_DAYS: 60, // 2 months
        check: (daysOverdue, amount, interestPaid) => {
            if (daysOverdue > this.DEFAULT_DAYS) {
                return { allowed: false, status: 'DEFAULTED' };
            }
            if (daysOverdue > this.MAX_REPAYMENT_DAYS) {
                const penalty = amount * this.PENALTY_RATE * (daysOverdue - this.MAX_REPAYMENT_DAYS);
                return { allowed: true, status: 'PENALTY_APPLIED', penalty };
            }
            return { allowed: true, status: 'ACTIVE' };
        }
    }
});

// ============================================================================
// 4️⃣ PERMISSION CHECKER CLASS
// ============================================================================

class MpesewaPermissionChecker {
    constructor(userContext, navigationState) {
        this.userContext = userContext;
        this.navigationState = navigationState;
        this._permissionCache = new Map();
        this._validationHistory = [];
    }
    
    // ============================================================================
    // 4.1 Core Permission Checking
    // ============================================================================
    
    hasPermission(permissionFlag, context = {}) {
        const cacheKey = `${permissionFlag}_${JSON.stringify(context)}`;
        
        // Check cache first
        if (this._permissionCache.has(cacheKey)) {
            return this._permissionCache.get(cacheKey);
        }
        
        // Get user's permission mask
        const userPermissionMask = this._getUserPermissionMask();
        
        // Check if permission is in mask
        const hasFlag = (userPermissionMask & permissionFlag) !== 0;
        
        if (!hasFlag) {
            this._logValidation(permissionFlag, 'DENIED', 'Permission flag not in user mask');
            this._permissionCache.set(cacheKey, false);
            return false;
        }
        
        // Apply business rule constraints
        const ruleCheck = this._checkBusinessRules(permissionFlag, context);
        
        if (!ruleCheck.allowed) {
            this._logValidation(permissionFlag, 'DENIED', ruleCheck.reason);
            this._permissionCache.set(cacheKey, false);
            return false;
        }
        
        this._logValidation(permissionFlag, 'GRANTED', 'All checks passed');
        this._permissionCache.set(cacheKey, true);
        return true;
    }
    
    canPerform(action, resource, context = {}) {
        const permissionFlag = this._actionToPermissionFlag(action, resource);
        
        if (!permissionFlag) {
            this._logValidation(action, 'DENIED', `Unknown action: ${action}`);
            return { allowed: false, reason: 'Unknown action' };
        }
        
        const allowed = this.hasPermission(permissionFlag, context);
        
        return {
            allowed,
            permission: PERMISSION_FLAGS[permissionFlag],
            context,
            timestamp: new Date().toISOString(),
            userId: this.userContext?.id
        };
    }
    
    // ============================================================================
    // 4.2 Bulk Permission Checking
    // ============================================================================
    
    checkMultiplePermissions(permissions, context = {}) {
        const results = {};
        
        permissions.forEach(permission => {
            if (typeof permission === 'string') {
                // Convert action string to permission flag
                const [action, resource] = permission.split(':');
                const flag = this._actionToPermissionFlag(action, resource);
                if (flag) {
                    results[permission] = this.hasPermission(flag, context);
                }
            } else if (typeof permission === 'number') {
                // Already a permission flag
                const flagName = Object.keys(PERMISSION_FLAGS).find(key => PERMISSION_FLAGS[key] === permission);
                results[flagName] = this.hasPermission(permission, context);
            }
        });
        
        return results;
    }
    
    getUserPermissions() {
        const userPermissionMask = this._getUserPermissionMask();
        const permissions = [];
        
        Object.keys(PERMISSION_FLAGS).forEach(flagName => {
            const flag = PERMISSION_FLAGS[flagName];
            if ((userPermissionMask & flag) !== 0) {
                permissions.push({
                    name: flagName,
                    flag: flag,
                    description: this._getPermissionDescription(flagName)
                });
            }
        });
        
        return permissions;
    }
    
    // ============================================================================
    // 4.3 Business Rule Enforcement
    // ============================================================================
    
    _checkBusinessRules(permissionFlag, context) {
        const flagName = Object.keys(PERMISSION_FLAGS).find(key => PERMISSION_FLAGS[key] === permissionFlag);
        
        if (!flagName) {
            return { allowed: false, reason: 'Unknown permission flag' };
        }
        
        // Check country isolation for cross-country actions
        if (this._isCrossCountryAction(flagName, context)) {
            const userCountry = this.userContext?.country;
            const targetCountry = context.targetCountry || context.country;
            
            if (!BUSINESS_RULES.COUNTRY_ISOLATION.check(userCountry, targetCountry, flagName)) {
                return {
                    allowed: false,
                    reason: BUSINESS_RULES.COUNTRY_ISOLATION.errorMessage(flagName, userCountry, targetCountry)
                };
            }
        }
        
        // Check group isolation for lending actions
        if (flagName === 'LEND_MONEY' || flagName === 'CREATE_LEDGER') {
            const userGroup = context.userGroup || this.navigationState?.currentGroup?.id;
            const targetGroup = context.targetGroup;
            
            if (!BUSINESS_RULES.GROUP_ISOLATION.check(userGroup, targetGroup, flagName)) {
                return {
                    allowed: false,
                    reason: BUSINESS_RULES.GROUP_ISOLATION.errorMessage(flagName, userGroup, targetGroup)
                };
            }
        }
        
        // Check subscription for lender actions
        if (flagName === 'LEND_MONEY' || flagName === 'CREATE_LEDGER' || flagName === 'UPGRADE_SUBSCRIPTION') {
            const subscription = this.userContext?.subscription || this.navigationState?.subscriptionStatus;
            
            if (!BUSINESS_RULES.SUBSCRIPTION_ENFORCEMENT.check(subscription, flagName)) {
                return {
                    allowed: false,
                    reason: BUSINESS_RULES.SUBSCRIPTION_ENFORCEMENT.errorMessage(subscription)
                };
            }
        }
        
        // Check loan amount limits
        if (flagName === 'REQUEST_LOAN') {
            const tier = this.userContext?.subscription?.tier || 'BASIC';
            const amount = context.amount;
            
            if (amount && !BUSINESS_RULES.LOAN_AMOUNT_LIMITS.check(tier, amount)) {
                const limit = BUSINESS_RULES.LOAN_AMOUNT_LIMITS[tier.toUpperCase()];
                return {
                    allowed: false,
                    reason: BUSINESS_RULES.LOAN_AMOUNT_LIMITS.errorMessage(tier, amount, limit)
                };
            }
        }
        
        // Check borrower group limits
        if (flagName === 'JOIN_GROUP' && this.userContext?.roles?.includes('BORROWER')) {
            const currentGroups = this.userContext?.groups || [];
            const rating = this.userContext?.rating || 0;
            
            if (!BUSINESS_RULES.BORROWER_GROUP_LIMIT.check(currentGroups, rating, flagName)) {
                return {
                    allowed: false,
                    reason: BUSINESS_RULES.BORROWER_GROUP_LIMIT.errorMessage(currentGroups, rating)
                };
            }
        }
        
        return { allowed: true, reason: 'All business rules satisfied' };
    }
    
    // ============================================================================
    // 4.4 Utility Methods
    // ============================================================================
    
    _getUserPermissionMask() {
        if (!this.userContext || !this.userContext.roles) {
            return 0;
        }
        
        let permissionMask = 0;
        
        // Combine permissions from all roles
        this.userContext.roles.forEach(role => {
            const roleKey = role.toUpperCase();
            if (ROLE_PERMISSIONS[roleKey]) {
                permissionMask |= ROLE_PERMISSIONS[roleKey];
            }
        });
        
        // Apply role-specific adjustments
        if (this.userContext.roles.includes('BORROWER')) {
            // Borrowers cannot have lender permissions
            permissionMask &= ~(
                PERMISSION_FLAGS.LEND_MONEY |
                PERMISSION_FLAGS.CREATE_LEDGER |
                PERMISSION_FLAGS.APPLY_BLACKLIST |
                PERMISSION_FLAGS.UPGRADE_SUBSCRIPTION
            );
        }
        
        if (this.userContext.roles.includes('LENDER')) {
            // Lenders without subscription cannot lend
            if (!this.userContext.subscription?.is_active) {
                permissionMask &= ~(
                    PERMISSION_FLAGS.LEND_MONEY |
                    PERMISSION_FLAGS.CREATE_LEDGER |
                    PERMISSION_FLAGS.APPLY_BLACKLIST
                );
            }
        }
        
        return permissionMask;
    }
    
    _actionToPermissionFlag(action, resource) {
        const actionMap = {
            // Global actions
            'view:global_stats': PERMISSION_FLAGS.VIEW_GLOBAL_STATS,
            'manage:all_countries': PERMISSION_FLAGS.MANAGE_ALL_COUNTRIES,
            
            // Country actions
            'view:country_dashboard': PERMISSION_FLAGS.VIEW_COUNTRY_DASHBOARD,
            'manage:country_groups': PERMISSION_FLAGS.MANAGE_COUNTRY_GROUPS,
            
            // Group actions
            'create:group': PERMISSION_FLAGS.CREATE_GROUP,
            'join:group': PERMISSION_FLAGS.JOIN_GROUP,
            'view:group_members': PERMISSION_FLAGS.VIEW_GROUP_MEMBERS,
            
            // Lender actions
            'lend:money': PERMISSION_FLAGS.LEND_MONEY,
            'create:ledger': PERMISSION_FLAGS.CREATE_LEDGER,
            'rate:borrower': PERMISSION_FLAGS.RATE_BORROWERS,
            
            // Borrower actions
            'request:loan': PERMISSION_FLAGS.REQUEST_LOAN,
            'view:active_loans': PERMISSION_FLAGS.VIEW_ACTIVE_LOANS,
            'make:repayment': PERMISSION_FLAGS.MAKE_REPAYMENT,
            
            // Emergency actions
            'view:emergency_categories': PERMISSION_FLAGS.VIEW_EMERGENCY_CATEGORIES,
            'request:emergency_loan': PERMISSION_FLAGS.REQUEST_EMERGENCY_LOAN,
            
            // User actions
            'update:profile': PERMISSION_FLAGS.UPDATE_PROFILE,
            'change:password': PERMISSION_FLAGS.CHANGE_PASSWORD
        };
        
        const key = `${action}:${resource}`;
        return actionMap[key];
    }
    
    _isCrossCountryAction(flagName, context) {
        const crossCountryFlags = [
            'MANAGE_ALL_COUNTRIES',
            'VIEW_GLOBAL_STATS',
            'EXPORT_ALL_DATA'
        ];
        
        // Platform admin actions can be cross-country
        if (crossCountryFlags.includes(flagName)) {
            return false;
        }
        
        // If context specifies a different country, it's cross-country
        if (context.targetCountry && context.targetCountry !== this.userContext?.country) {
            return true;
        }
        
        return false;
    }
    
    _getPermissionDescription(flagName) {
        const descriptions = {
            VIEW_GLOBAL_STATS: 'View platform-wide statistics and metrics',
            LEND_MONEY: 'Provide loans to borrowers within the same group',
            REQUEST_LOAN: 'Request emergency loans for specific categories',
            CREATE_LEDGER: 'Create and manage loan ledgers for borrowers',
            RATE_BORROWERS: 'Rate borrowers after loan completion',
            APPLY_BLACKLIST: 'Blacklist defaulting borrowers',
            OVERRIDE_BLACKLIST: 'Override blacklist decisions (Admin only)',
            JOIN_MULTIPLE_GROUPS: 'Join up to 4 groups (Borrowers with good rating)',
            UPGRADE_SUBSCRIPTION: 'Upgrade lending subscription tier'
        };
        
        return descriptions[flagName] || `${flagName.replace(/_/g, ' ').toLowerCase()}`;
    }
    
    _logValidation(permission, result, reason) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            userId: this.userContext?.id,
            permission,
            result,
            reason,
            context: {
                country: this.userContext?.country,
                role: this.userContext?.roles?.[0],
                group: this.navigationState?.currentGroup?.id
            }
        };
        
        this._validationHistory.push(logEntry);
        
        // Keep only last 100 entries
        if (this._validationHistory.length > 100) {
            this._validationHistory.shift();
        }
        
        // Console log for debugging
        if (result === 'DENIED') {
            console.warn('Permission denied:', logEntry);
        }
    }
    
    // ============================================================================
    // 4.5 Public API Methods
    // ============================================================================
    
    clearCache() {
        this._permissionCache.clear();
        return this;
    }
    
    getValidationHistory() {
        return [...this._validationHistory];
    }
    
    validateUserForAction(action, resource, context = {}) {
        const result = this.canPerform(action, resource, context);
        
        if (!result.allowed) {
            throw new Error(`Action not permitted: ${action}:${resource}. Reason: ${result.reason || 'No permission'}`);
        }
        
        return result;
    }
    
    // ============================================================================
    // 4.6 Static Methods
    // ============================================================================
    
    static get PERMISSION_FLAGS() {
        return PERMISSION_FLAGS;
    }
    
    static get ROLE_PERMISSIONS() {
        return ROLE_PERMISSIONS;
    }
    
    static get BUSINESS_RULES() {
        return BUSINESS_RULES;
    }
    
    static createForUser(userData, navigationState) {
        return new MpesewaPermissionChecker(userData, navigationState);
    }
}

// ============================================================================
// 5️⃣ PERMISSION MIDDLEWARE & GUARDS
// ============================================================================

class MpesewaPermissionGuard {
    constructor(permissionChecker) {
        this.permissionChecker = permissionChecker;
        this._routes = new Map();
        this._setupRouteGuards();
    }
    
    _setupRouteGuards() {
        // Define route permissions
        this._routes.set('/lender/dashboard', ['view:lending_portfolio']);
        this._routes.set('/lender/lend', ['lend:money']);
        this._routes.set('/lender/ledgers', ['create:ledger', 'manage:ledgers']);
        this._routes.set('/borrower/apply', ['request:loan']);
        this._routes.set('/borrower/loans', ['view:active_loans']);
        this._routes.set('/admin/dashboard', ['view:global_stats']);
        this._routes.set('/group/create', ['create:group']);
        this._routes.set('/group/join', ['join:group']);
        this._routes.set('/emergency', ['view:emergency_categories']);
        this._routes.set('/subscription/upgrade', ['upgrade:subscription']);
    }
    
    canAccessRoute(route, params = {}) {
        const requiredPermissions = this._routes.get(route);
        
        if (!requiredPermissions) {
            console.warn(`No permission requirements defined for route: ${route}`);
            return { allowed: true, reason: 'No permission requirements' };
        }
        
        // Check all required permissions
        for (const permission of requiredPermissions) {
            const [action, resource] = permission.split(':');
            const canPerform = this.permissionChecker.canPerform(action, resource, params);
            
            if (!canPerform.allowed) {
                return {
                    allowed: false,
                    route,
                    requiredPermission: permission,
                    reason: canPerform.reason,
                    details: canPerform
                };
            }
        }
        
        return { allowed: true, route, requiredPermissions };
    }
    
    guardRoute(route, params = {}) {
        const accessCheck = this.canAccessRoute(route, params);
        
        if (!accessCheck.allowed) {
            throw new PermissionError(
                `Access denied to ${route}`,
                accessCheck.requiredPermission,
                accessCheck.reason
            );
        }
        
        return accessCheck;
    }
    
    registerRoute(route, permissions) {
        this._routes.set(route, permissions);
        return this;
    }
    
    getRoutePermissions() {
        return new Map(this._routes);
    }
}

// ============================================================================
// 6️⃣ ERROR CLASSES
// ============================================================================

class PermissionError extends Error {
    constructor(message, permission, reason) {
        super(message);
        this.name = 'PermissionError';
        this.permission = permission;
        this.reason = reason;
        this.timestamp = new Date().toISOString();
    }
    
    toJSON() {
        return {
            error: this.name,
            message: this.message,
            permission: this.permission,
            reason: this.reason,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

class BusinessRuleViolation extends Error {
    constructor(rule, context, message) {
        super(message || `Business rule violation: ${rule}`);
        this.name = 'BusinessRuleViolation';
        this.rule = rule;
        this.context = context;
        this.timestamp = new Date().toISOString();
    }
}

// ============================================================================
// 7️⃣ EXPORTS
// ============================================================================

export {
    MpesewaPermissionChecker,
    MpesewaPermissionGuard,
    PermissionError,
    BusinessRuleViolation,
    PERMISSION_FLAGS,
    ROLE_PERMISSIONS,
    BUSINESS_RULES
};

// Default export for convenience
export default MpesewaPermissionChecker;