/**
 * M-PESEWA STRICT PERMISSIONS SYSTEM
 * Enforces global access rules and business logic permissions
 */

class MpesewaPermissions {
    constructor() {
        // Define all permissions with strict hierarchy
        this.permissionMatrix = {
            // GLOBAL PERMISSIONS (Everyone)
            global: {
                'view:home': true,
                'view:emergency-hub': true,
                'view:countries': true,
                'view:about': true,
                'view:terms': true,
                'view:privacy': true,
                'view:debt-collectors': true,
                'view:blacklist': true,
                'auth:login': true,
                'auth:register': true,
                'auth:logout': true
            },
            
            // ANONYMOUS USER PERMISSIONS
            anonymous: {
                // Inherits global permissions
                'auth:request-password-reset': true,
                'auth:verify-email': true
            },
            
            // COUNTRY-SPECIFIC PERMISSIONS (Once country is selected)
            country: {
                'country:select': true,
                'country:change': false, // Cannot change country without logout
                'view:country-dashboard': true,
                'groups:browse': true,
                'groups:create': true
            },
            
            // GROUP PERMISSIONS (Once in a group)
            group: {
                'group:view': true,
                'group:join': true,
                'group:leave': true,
                'group:invite': (user, group) => {
                    // Only group admins can invite
                    return user.groupRoles?.[group.id] === 'admin' || 
                           user.groupRoles?.[group.id] === 'founder';
                },
                'group:manage': (user, group) => {
                    // Only group admins/founders
                    return user.groupRoles?.[group.id] === 'admin' || 
                           user.groupRoles?.[group.id] === 'founder';
                },
                'group:view-members': true,
                'group:view-stats': true
            },
            
            // BORROWER PERMISSIONS
            borrower: {
                // Borrower role permissions
                'borrower:dashboard:view': true,
                'borrower:loan:request': (user, context) => {
                    // Check if borrower is eligible to request loan
                    return !user.isBlacklisted && 
                           user.rating >= 3 && // Minimum 3-star rating
                           context.activeLoans < 1 && // Max 1 loan per group
                           user.groups?.length <= 4; // Max 4 groups
                },
                'borrower:loan:view': true,
                'borrower:repayment:make': (user, loan) => {
                    // Can make repayment if loan is active/overdue
                    return ['active', 'overdue'].includes(loan.status);
                },
                'borrower:repayment:partial': true,
                'borrower:history:view': true,
                'borrower:profile:update': true,
                'borrower:groups:join': (user) => {
                    // Can join new group if rating is good and less than 4 groups
                    return user.rating >= 3 && user.groups?.length < 4;
                },
                'borrower:groups:leave': true,
                'borrower:dispute:create': true,
                'borrower:rating:view': true
            },
            
            // LENDER PERMISSIONS (Subscription-based)
            lender: {
                'lender:dashboard:view': true,
                'lender:subscription:view': true,
                'lender:subscription:upgrade': true,
                'lender:subscription:renew': (user, subscription) => {
                    // Can renew if expired or about to expire
                    const today = new Date();
                    const expiryDate = new Date(subscription.expiry);
                    return today > expiryDate || 
                           (expiryDate - today) / (1000 * 60 * 60 * 24) <= 7; // 7 days before expiry
                },
                'lender:loan:approve': (user, context) => {
                    // Can approve loan if subscription is active and within limits
                    const subscription = user.subscription;
                    if (!subscription || subscription.status !== 'active') return false;
                    
                    // Check if within weekly limit
                    const weeklyLent = this.calculateWeeklyLent(user.id);
                    const weeklyLimit = this.getSubscriptionLimit(subscription.plan).weekly;
                    
                    return weeklyLent < weeklyLimit;
                },
                'lender:loan:reject': true,
                'lender:ledger:create': (user) => {
                    // Can create ledger if subscription allows
                    const subscription = user.subscription;
                    if (!subscription) return false;
                    
                    const activeLedgers = this.countActiveLedgers(user.id);
                    const maxLedgers = this.getSubscriptionLimit(subscription.plan).maxLedgers;
                    
                    return activeLedgers < maxLedgers;
                },
                'lender:ledger:update': (user, ledger) => {
                    // Can update ledger if they created it
                    return ledger.lenderId === user.id;
                },
                'lender:ledger:view': true,
                'lender:portfolio:view': true,
                'lender:risk:analyze': true,
                'lender:borrower:rate': (user, borrower) => {
                    // Can rate borrower if they have an active ledger with them
                    return this.hasActiveLedgerWithBorrower(user.id, borrower.id);
                },
                'lender:borrower:blacklist': (user, borrower) => {
                    // Can blacklist borrower if they have defaulted ledger
                    return this.hasDefaultedLedgerWithBorrower(user.id, borrower.id);
                },
                'lender:history:view': true,
                'lender:categories:select': true,
                'lender:groups:lend': (user, group) => {
                    // Can lend only in their own groups
                    return user.groups?.includes(group.id);
                }
            },
            
            // GROUP ADMIN PERMISSIONS
            groupAdmin: {
                'group:members:manage': true,
                'group:rules:set': true,
                'group:invitations:manage': true,
                'group:disputes:resolve': true,
                'group:reports:generate': true,
                'group:settings:update': true,
                'group:members:remove': (admin, targetUser, group) => {
                    // Cannot remove group founder
                    return targetUser.groupRoles?.[group.id] !== 'founder';
                }
            },
            
            // PLATFORM ADMIN PERMISSIONS
            platformAdmin: {
                'admin:dashboard:view': true,
                'admin:users:view': true,
                'admin:users:manage': true,
                'admin:groups:view': true,
                'admin:groups:manage': true,
                'admin:ledgers:override': true,
                'admin:blacklist:override': true,
                'admin:subscriptions:manage': true,
                'admin:audit:view': true,
                'admin:system:manage': true,
                'admin:debt-collectors:manage': true,
                'admin:reports:generate': true,
                'admin:backup:create': true,
                'admin:impersonate': (admin, targetUser) => {
                    // Cannot impersonate other admins
                    return !targetUser.roles?.includes('admin');
                }
            },
            
            // SUBSCRIPTION-SPECIFIC PERMISSIONS
            subscriptions: {
                basic: {
                    'lend:limit:weekly': 1500,
                    'lend:limit:ledger': 1500,
                    'ledgers:max': 10,
                    'categories:all': false,
                    'crb:check': false,
                    'features:advanced-analytics': false
                },
                premium: {
                    'lend:limit:weekly': 5000,
                    'lend:limit:ledger': 10000,
                    'ledgers:max': 50,
                    'categories:all': true,
                    'crb:check': false,
                    'features:advanced-analytics': true
                },
                super: {
                    'lend:limit:weekly': 20000,
                    'lend:limit:ledger': 20000,
                    'ledgers:max': Infinity,
                    'categories:all': true,
                    'crb:check': true,
                    'features:advanced-analytics': true
                },
                'lender-of-lenders': {
                    'lend:limit:weekly': 50000,
                    'lend:limit:ledger': 50000,
                    'ledgers:max': Infinity,
                    'categories:all': true,
                    'crb:check': true,
                    'features:advanced-analytics': true,
                    'terms:custom': true,
                    'repayment-period:custom': true
                }
            }
        };
        
        // Initialize permission cache
        this.permissionCache = new Map();
        
        // Hook into event bus for permission changes
        if (window.mpesewaEventBus) {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        window.mpesewaEventBus.subscribe('auth:login', () => this.clearCache());
        window.mpesewaEventBus.subscribe('auth:logout', () => this.clearCache());
        window.mpesewaEventBus.subscribe('country:selected', () => this.clearCache());
        window.mpesewaEventBus.subscribe('group:joined', () => this.clearCache());
        window.mpesewaEventBus.subscribe('lender:subscription:active', () => this.clearCache());
        window.mpesewaEventBus.subscribe('borrower:blacklisted', () => this.clearCache());
    }
    
    clearCache() {
        this.permissionCache.clear();
    }
    
    /**
     * MAIN PERMISSION CHECK METHOD
     * Checks if a user has permission to perform an action
     */
    async can(user, permission, context = {}) {
        // Generate cache key
        const cacheKey = `${user?.id || 'anonymous'}:${permission}:${JSON.stringify(context)}`;
        
        // Check cache first
        if (this.permissionCache.has(cacheKey)) {
            return this.permissionCache.get(cacheKey);
        }
        
        // Get user with complete context
        const userWithContext = await this.getUserWithContext(user, context);
        
        // Check permission hierarchy
        let result = false;
        
        // 1. Check global permissions
        if (this.permissionMatrix.global[permission]) {
            result = true;
        }
        
        // 2. Check anonymous permissions (if not logged in)
        if (!userWithContext.id || userWithContext.id === 'anonymous') {
            if (this.permissionMatrix.anonymous[permission]) {
                result = true;
            }
        }
        
        // 3. Check country permissions
        if (userWithContext.country) {
            const countryPermission = this.permissionMatrix.country[permission];
            if (typeof countryPermission === 'function') {
                result = await countryPermission(userWithContext, context);
            } else if (countryPermission !== undefined) {
                result = countryPermission;
            }
        }
        
        // 4. Check group permissions
        if (userWithContext.currentGroup) {
            const groupPermission = this.permissionMatrix.group[permission];
            if (typeof groupPermission === 'function') {
                result = await groupPermission(userWithContext, context.group || userWithContext.currentGroup);
            } else if (groupPermission !== undefined) {
                result = groupPermission;
            }
        }
        
        // 5. Check role-specific permissions
        if (userWithContext.roles) {
            for (const role of userWithContext.roles) {
                const roleMatrix = this.permissionMatrix[role];
                if (roleMatrix && roleMatrix[permission] !== undefined) {
                    const rolePermission = roleMatrix[permission];
                    if (typeof rolePermission === 'function') {
                        result = await rolePermission(userWithContext, context);
                    } else {
                        result = rolePermission;
                    }
                    break; // First matching role wins
                }
            }
        }
        
        // 6. Check group admin permissions
        if (userWithContext.groupRoles && userWithContext.currentGroup) {
            const groupRole = userWithContext.groupRoles[userWithContext.currentGroup.id];
            if (groupRole === 'admin' || groupRole === 'founder') {
                const adminPermission = this.permissionMatrix.groupAdmin[permission];
                if (typeof adminPermission === 'function') {
                    result = await adminPermission(userWithContext, context.target, context.group);
                } else if (adminPermission !== undefined) {
                    result = adminPermission;
                }
            }
        }
        
        // 7. Check platform admin permissions
        if (userWithContext.roles?.includes('admin')) {
            const adminPermission = this.permissionMatrix.platformAdmin[permission];
            if (typeof adminPermission === 'function') {
                result = await adminPermission(userWithContext, context.target);
            } else if (adminPermission !== undefined) {
                result = adminPermission;
            }
        }
        
        // 8. Check subscription-based permissions for lenders
        if (userWithContext.roles?.includes('lender') && userWithContext.subscription) {
            const subscriptionType = userWithContext.subscription.plan;
            const subscriptionPermissions = this.permissionMatrix.subscriptions[subscriptionType];
            
            if (subscriptionPermissions && subscriptionPermissions[permission] !== undefined) {
                const subPermission = subscriptionPermissions[permission];
                if (typeof subPermission === 'function') {
                    result = await subPermission(userWithContext, context);
                } else {
                    result = subPermission;
                }
            }
        }
        
        // 9. SPECIAL BUSINESS RULES ENFORCEMENT
        result = await this.applyBusinessRules(userWithContext, permission, context, result);
        
        // Cache the result
        this.permissionCache.set(cacheKey, result);
        
        // Log permission check for audit
        this.logPermissionCheck(userWithContext, permission, context, result);
        
        return result;
    }
    
    async applyBusinessRules(user, permission, context, currentResult) {
        // If already denied, no need to check further
        if (!currentResult) return false;
        
        // STRICT BUSINESS RULES
        
        // 1. COUNTRY ISOLATION RULE
        if (permission.startsWith('lend:') || permission.startsWith('borrow:')) {
            const userCountry = user.country;
            const targetCountry = context.target?.country || context.group?.country;
            
            if (targetCountry && userCountry !== targetCountry) {
                this.logViolation(user, permission, 'CROSS_COUNTRY_VIOLATION', {
                    userCountry,
                    targetCountry
                });
                return false;
            }
        }
        
        // 2. GROUP ISOLATION RULE (Lenders can only lend within their group)
        if (permission.startsWith('lender:') && permission.includes(':lend')) {
            const userGroup = user.currentGroup?.id;
            const targetGroup = context.group?.id || context.target?.groupId;
            
            if (targetGroup && userGroup !== targetGroup) {
                this.logViolation(user, permission, 'CROSS_GROUP_LENDING_VIOLATION', {
                    userGroup,
                    targetGroup
                });
                return false;
            }
        }
        
        // 3. BORROWER GROUP LIMIT RULE (Max 4 groups)
        if (permission === 'borrower:groups:join') {
            if (user.groups?.length >= 4) {
                this.logViolation(user, permission, 'MAX_GROUPS_VIOLATION', {
                    currentGroups: user.groups?.length,
                    maxAllowed: 4
                });
                return false;
            }
            
            // Additional rule: Good rating required for additional groups
            if (user.groups?.length >= 1 && user.rating < 3) {
                this.logViolation(user, permission, 'RATING_VIOLATION', {
                    currentRating: user.rating,
                    requiredRating: 3
                });
                return false;
            }
        }
        
        // 4. SUBSCRIPTION EXPIRY RULE (28th of each month)
        if (permission.startsWith('lender:') && !permission.includes('subscription')) {
            if (user.subscription) {
                const today = new Date();
                const expiryDate = new Date(user.subscription.expiry);
                
                if (today > expiryDate) {
                    this.logViolation(user, permission, 'SUBSCRIPTION_EXPIRED', {
                        expiryDate,
                        today
                    });
                    return false;
                }
            }
        }
        
        // 5. BLACKLIST RULE
        if (permission.startsWith('borrower:') && permission.includes('loan')) {
            if (user.isBlacklisted) {
                this.logViolation(user, permission, 'BLACKLISTED_BORROWER', {
                    blacklistReason: user.blacklistReason
                });
                return false;
            }
        }
        
        // 6. ACTIVE LOAN PER GROUP RULE
        if (permission === 'borrower:loan:request') {
            const activeLoans = context.activeLoans || 0;
            if (activeLoans >= 1) {
                this.logViolation(user, permission, 'MAX_LOANS_PER_GROUP', {
                    activeLoans,
                    maxAllowed: 1
                });
                return false;
            }
        }
        
        // 7. LENDING LIMIT RULE
        if (permission === 'lender:loan:approve') {
            if (user.subscription) {
                const weeklyLent = this.calculateWeeklyLent(user.id);
                const weeklyLimit = this.getSubscriptionLimit(user.subscription.plan).weekly;
                
                if (weeklyLent >= weeklyLimit) {
                    this.logViolation(user, permission, 'WEEKLY_LENDING_LIMIT', {
                        weeklyLent,
                        weeklyLimit
                    });
                    return false;
                }
            }
        }
        
        return currentResult;
    }
    
    async getUserWithContext(user, context) {
        // If user is already complete, return it
        if (user && user.id && user.roles) {
            return {
                ...user,
                country: user.country || localStorage.getItem('mpesewa_country'),
                currentGroup: user.currentGroup || await this.getCurrentGroup(user.id),
                groups: user.groups || await this.getUserGroups(user.id),
                rating: user.rating || await this.getUserRating(user.id),
                isBlacklisted: user.isBlacklisted || await this.isUserBlacklisted(user.id),
                subscription: user.subscription || await this.getUserSubscription(user.id),
                groupRoles: user.groupRoles || await this.getUserGroupRoles(user.id)
            };
        }
        
        // Otherwise, load user from storage
        const userId = user?.id || 'anonymous';
        
        if (userId === 'anonymous') {
            return {
                id: 'anonymous',
                roles: [],
                country: null,
                currentGroup: null,
                groups: [],
                rating: 0,
                isBlacklisted: false,
                subscription: null,
                groupRoles: {}
            };
        }
        
        // Load user data from storage
        const userData = JSON.parse(localStorage.getItem(`user_${userId}`) || '{}');
        const country = localStorage.getItem('mpesewa_country');
        const currentGroup = await this.getCurrentGroup(userId);
        
        return {
            id: userId,
            roles: userData.roles || [],
            email: userData.email,
            country: country,
            currentGroup: currentGroup,
            groups: await this.getUserGroups(userId),
            rating: await this.getUserRating(userId),
            isBlacklisted: await this.isUserBlacklisted(userId),
            subscription: await this.getUserSubscription(userId),
            groupRoles: await this.getUserGroupRoles(userId),
            ...userData
        };
    }
    
    // HELPER METHODS
    async getCurrentGroup(userId) {
        const groupId = localStorage.getItem('mpesewa_current_group');
        if (!groupId) return null;
        
        const group = JSON.parse(localStorage.getItem(`group_${groupId}`) || 'null');
        return group;
    }
    
    async getUserGroups(userId) {
        const groups = JSON.parse(localStorage.getItem(`user_${userId}_groups`) || '[]');
        return groups;
    }
    
    async getUserRating(userId) {
        const ratings = JSON.parse(localStorage.getItem(`borrower_${userId}_ratings`) || '[]');
        if (ratings.length === 0) return 5;
        
        const sum = ratings.reduce((total, rating) => total + rating.score, 0);
        return sum / ratings.length;
    }
    
    async isUserBlacklisted(userId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        return blacklist.some(item => item.userId === userId);
    }
    
    async getUserSubscription(userId) {
        const subscription = JSON.parse(localStorage.getItem(`subscription_${userId}`) || 'null');
        return subscription;
    }
    
    async getUserGroupRoles(userId) {
        const groupRoles = JSON.parse(localStorage.getItem(`user_${userId}_group_roles`) || '{}');
        return groupRoles;
    }
    
    calculateWeeklyLent(userId) {
        const ledgers = JSON.parse(localStorage.getItem(`lender_${userId}_ledgers`) || '[]');
        const currentWeek = this.getCurrentWeek();
        
        return ledgers
            .filter(ledger => ledger.week === currentWeek && ledger.status === 'active')
            .reduce((sum, ledger) => sum + ledger.amount, 0);
    }
    
    getCurrentWeek() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        return Math.ceil(days / 7);
    }
    
    countActiveLedgers(userId) {
        const ledgers = JSON.parse(localStorage.getItem(`lender_${userId}_ledgers`) || '[]');
        return ledgers.filter(ledger => ledger.status === 'active').length;
    }
    
    getSubscriptionLimit(plan) {
        return this.permissionMatrix.subscriptions[plan] || this.permissionMatrix.subscriptions.basic;
    }
    
    hasActiveLedgerWithBorrower(lenderId, borrowerId) {
        const ledgers = JSON.parse(localStorage.getItem(`lender_${lenderId}_ledgers`) || '[]');
        return ledgers.some(ledger => 
            ledger.borrowerId === borrowerId && 
            ['active', 'overdue'].includes(ledger.status)
        );
    }
    
    hasDefaultedLedgerWithBorrower(lenderId, borrowerId) {
        const ledgers = JSON.parse(localStorage.getItem(`lender_${lenderId}_ledgers`) || '[]');
        return ledgers.some(ledger => 
            ledger.borrowerId === borrowerId && 
            ledger.status === 'defaulted'
        );
    }
    
    logPermissionCheck(user, permission, context, result) {
        // Only log important permission checks
        const importantPermissions = [
            'lender:loan:approve',
            'borrower:loan:request',
            'admin:override:blacklist',
            'admin:override:ledger',
            'group:invite',
            'lender:borrower:blacklist'
        ];
        
        if (importantPermissions.includes(permission)) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                userId: user.id,
                permission,
                context,
                result,
                userAgent: navigator.userAgent,
                url: window.location.href,
                country: user.country,
                group: user.currentGroup?.id
            };
            
            // Save to localStorage for audit
            this.saveAuditLog('permission_check', logEntry);
            
            // Emit event
            if (window.mpesewaEventBus) {
                window.mpesewaEventBus.emit('permission:checked', logEntry);
            }
        }
    }
    
    logViolation(user, permission, violationType, details) {
        const violation = {
            timestamp: new Date().toISOString(),
            userId: user.id,
            permission,
            violationType,
            details,
            severity: this.getViolationSeverity(violationType),
            country: user.country,
            group: user.currentGroup?.id
        };
        
        // Save to localStorage
        this.saveAuditLog('permission_violation', violation);
        
        // Emit event
        if (window.mpesewaEventBus) {
            window.mpesewaEventBus.emit('permission:violation', violation);
        }
    }
    
    getViolationSeverity(violationType) {
        const severities = {
            'CROSS_COUNTRY_VIOLATION': 'CRITICAL',
            'CROSS_GROUP_LENDING_VIOLATION': 'HIGH',
            'SUBSCRIPTION_EXPIRED': 'HIGH',
            'BLACKLISTED_BORROWER': 'HIGH',
            'MAX_GROUPS_VIOLATION': 'MEDIUM',
            'RATING_VIOLATION': 'MEDIUM',
            'MAX_LOANS_PER_GROUP': 'MEDIUM',
            'WEEKLY_LENDING_LIMIT': 'LOW'
        };
        
        return severities[violationType] || 'MEDIUM';
    }
    
    saveAuditLog(type, data) {
        try {
            const logs = JSON.parse(localStorage.getItem('mpesewa_permission_audit') || '[]');
            logs.unshift({
                type,
                data,
                loggedAt: new Date().toISOString()
            });
            
            // Keep only last 500 logs
            if (logs.length > 500) {
                logs.pop();
            }
            
            localStorage.setItem('mpesewa_permission_audit', JSON.stringify(logs));
        } catch (e) {
            console.warn('Failed to save permission audit log:', e);
        }
    }
    
    // PUBLIC API METHODS
    
    /**
     * Check multiple permissions at once
     */
    async canAll(user, permissions, context = {}) {
        const results = {};
        for (const permission of permissions) {
            results[permission] = await this.can(user, permission, context);
        }
        return results;
    }
    
    /**
     * Check if any of the permissions is granted
     */
    async canAny(user, permissions, context = {}) {
        for (const permission of permissions) {
            if (await this.can(user, permission, context)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get all permissions for a user
     */
    async getAllPermissions(user) {
        const userWithContext = await this.getUserWithContext(user, {});
        const allPermissions = new Set();
        
        // Collect permissions from all levels
        const levels = ['global', 'anonymous', 'country', 'group', ...(userWithContext.roles || [])];
        
        for (const level of levels) {
            const matrix = this.permissionMatrix[level];
            if (matrix) {
                for (const permission in matrix) {
                    // Check if permission is granted
                    if (await this.can(user, permission, {})) {
                        allPermissions.add(permission);
                    }
                }
            }
        }
        
        return Array.from(allPermissions);
    }
    
    /**
     * Get user's subscription limits
     */
    getSubscriptionLimits(user) {
        if (!user.subscription) return null;
        
        const plan = user.subscription.plan;
        return this.permissionMatrix.subscriptions[plan] || 
               this.permissionMatrix.subscriptions.basic;
    }
    
    /**
     * Check if user can switch roles
     */
    async canSwitchRole(user, targetRole) {
        const currentRoles = user.roles || [];
        
        // Cannot switch to same role
        if (currentRoles.includes(targetRole)) {
            return false;
        }
        
        // Borrower to Lender switch
        if (targetRole === 'lender') {
            // Must have active subscription
            const subscription = await this.getUserSubscription(user.id);
            return subscription && subscription.status === 'active';
        }
        
        // Lender to Borrower switch
        if (targetRole === 'borrower') {
            // Cannot switch if blacklisted
            const isBlacklisted = await this.isUserBlacklisted(user.id);
            return !isBlacklisted;
        }
        
        return false;
    }
}

// Create global instance
window.mpesewaPermissions = new MpesewaPermissions();

// Export for module systems
export default MpesewaPermissions;