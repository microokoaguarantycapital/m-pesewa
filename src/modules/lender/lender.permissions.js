// lender/lender.permissions.js
/**
 * M-PESEWA LENDER PERMISSIONS SYSTEM
 * STRICT ROLE-BASED ACCESS CONTROL (RBAC) WITH HIERARCHY ENFORCEMENT
 * 
 * PERMISSION HIERARCHY:
 * 1. Global → Country → Groups → Lenders → Borrowers
 * 2. Country isolation enforced
 * 3. Group isolation enforced
 * 4. Subscription gates all lending operations
 */

class LenderPermissions {
    constructor(lenderState, profile, country, groupId) {
        // Core permission matrix
        this.PERMISSIONS = {
            // VIEW PERMISSIONS
            VIEW: {
                DASHBOARD: 'view_dashboard',
                LEDGER: 'view_ledger',
                PORTFOLIO: 'view_portfolio',
                HISTORY: 'view_history',
                REQUESTS: 'view_requests',
                RISK: 'view_risk',
                RULES: 'view_rules',
                PROFILE: 'view_profile',
                SUBSCRIPTION: 'view_subscription',
                BLACKLIST: 'view_blacklist',
                GROUP: 'view_group'
            },
            
            // ACTION PERMISSIONS
            ACTION: {
                CREATE_LEDGER: 'create_ledger',
                UPDATE_LEDGER: 'update_ledger',
                DELETE_LEDGER: 'delete_ledger',
                CREATE_LOAN: 'create_loan',
                APPROVE_LOAN: 'approve_loan',
                REJECT_LOAN: 'reject_loan',
                RATE_BORROWER: 'rate_borrower',
                BLACKLIST: 'blacklist_borrower',
                REMOVE_BLACKLIST: 'remove_blacklist',
                UPDATE_PROFILE: 'update_profile',
                UPDATE_SUBSCRIPTION: 'update_subscription',
                INVITE_MEMBER: 'invite_member',
                CREATE_GROUP: 'create_group',
                JOIN_GROUP: 'join_group',
                LEAVE_GROUP: 'leave_group',
                EXPORT_DATA: 'export_data',
                REQUEST_ADMIN: 'request_admin'
            },
            
            // ACCESS PERMISSIONS
            ACCESS: {
                LENDING_CART: 'access_lending_cart',
                LENDING_REQUESTS: 'access_lending_requests',
                LENDING_PORTFOLIO: 'access_lending_portfolio',
                LENDING_RISK: 'access_lending_risk',
                LENDING_RULES: 'access_lending_rules',
                ADMIN_PANEL: 'access_admin_panel',
                AUDIT_LOG: 'access_audit_log',
                SYSTEM_HEALTH: 'access_system_health'
            }
        };
        
        // State and profile
        this.state = lenderState;
        this.profile = profile || {};
        this.country = country || this.profile.country;
        this.groupId = groupId || this.profile.groupId;
        
        // Subscription status
        this.subscriptionActive = this.isSubscriptionActive();
        this.daysToExpiry = this.calculateDaysToExpiry();
        
        // Initialize permission cache
        this.permissionCache = new Map();
        
        // Load permission matrix
        this.permissionMatrix = this.buildPermissionMatrix();
    }
    
    /**
     * PERMISSION MATRIX BY LENDER STATE
     */
    buildPermissionMatrix() {
        // Base matrix by state
        const stateMatrix = {
            NEW: {
                view: [
                    this.PERMISSIONS.VIEW.RULES,
                    this.PERMISSIONS.VIEW.PROFILE,
                    this.PERMISSIONS.VIEW.SUBSCRIPTION
                ],
                action: [
                    this.PERMISSIONS.ACTION.UPDATE_PROFILE,
                    this.PERMISSIONS.ACTION.UPDATE_SUBSCRIPTION
                ],
                access: []
            },
            
            SUBSCRIBED: {
                view: [
                    this.PERMISSIONS.VIEW.DASHBOARD,
                    this.PERMISSIONS.VIEW.PROFILE,
                    this.PERMISSIONS.VIEW.SUBSCRIPTION,
                    this.PERMISSIONS.VIEW.GROUP,
                    this.PERMISSIONS.VIEW.RULES
                ],
                action: [
                    this.PERMISSIONS.ACTION.UPDATE_PROFILE,
                    this.PERMISSIONS.ACTION.INVITE_MEMBER,
                    this.PERMISSIONS.ACTION.JOIN_GROUP
                ],
                access: [
                    this.PERMISSIONS.ACCESS.LENDING_RULES
                ]
            },
            
            ACTIVE: {
                view: [
                    this.PERMISSIONS.VIEW.DASHBOARD,
                    this.PERMISSIONS.VIEW.LEDGER,
                    this.PERMISSIONS.VIEW.PORTFOLIO,
                    this.PERMISSIONS.VIEW.HISTORY,
                    this.PERMISSIONS.VIEW.REQUESTS,
                    this.PERMISSIONS.VIEW.RISK,
                    this.PERMISSIONS.VIEW.RULES,
                    this.PERMISSIONS.VIEW.PROFILE,
                    this.PERMISSIONS.VIEW.SUBSCRIPTION,
                    this.PERMISSIONS.VIEW.BLACKLIST,
                    this.PERMISSIONS.VIEW.GROUP
                ],
                action: [
                    this.PERMISSIONS.ACTION.CREATE_LEDGER,
                    this.PERMISSIONS.ACTION.UPDATE_LEDGER,
                    this.PERMISSIONS.ACTION.CREATE_LOAN,
                    this.PERMISSIONS.ACTION.APPROVE_LOAN,
                    this.PERMISSIONS.ACTION.REJECT_LOAN,
                    this.PERMISSIONS.ACTION.RATE_BORROWER,
                    this.PERMISSIONS.ACTION.BLACKLIST,
                    this.PERMISSIONS.ACTION.UPDATE_PROFILE,
                    this.PERMISSIONS.ACTION.INVITE_MEMBER,
                    this.PERMISSIONS.ACTION.CREATE_GROUP,
                    this.PERMISSIONS.ACTION.JOIN_GROUP,
                    this.PERMISSIONS.ACTION.LEAVE_GROUP,
                    this.PERMISSIONS.ACTION.EXPORT_DATA,
                    this.PERMISSIONS.ACTION.REQUEST_ADMIN
                ],
                access: [
                    this.PERMISSIONS.ACCESS.LENDING_CART,
                    this.PERMISSIONS.ACCESS.LENDING_REQUESTS,
                    this.PERMISSIONS.ACCESS.LENDING_PORTFOLIO,
                    this.PERMISSIONS.ACCESS.LENDING_RISK,
                    this.PERMISSIONS.ACCESS.LENDING_RULES
                ]
            },
            
            SUSPENDED: {
                view: [
                    this.PERMISSIONS.VIEW.DASHBOARD,
                    this.PERMISSIONS.VIEW.LEDGER,
                    this.PERMISSIONS.VIEW.HISTORY,
                    this.PERMISSIONS.VIEW.PROFILE,
                    this.PERMISSIONS.VIEW.SUBSCRIPTION,
                    this.PERMISSIONS.VIEW.RULES
                ],
                action: [
                    this.PERMISSIONS.ACTION.UPDATE_PROFILE,
                    this.PERMISSIONS.ACTION.REQUEST_ADMIN
                ],
                access: [
                    this.PERMISSIONS.ACCESS.LENDING_RULES
                ]
            },
            
            EXPIRED: {
                view: [
                    this.PERMISSIONS.VIEW.DASHBOARD,
                    this.PERMISSIONS.VIEW.HISTORY,
                    this.PERMISSIONS.VIEW.PROFILE,
                    this.PERMISSIONS.VIEW.SUBSCRIPTION,
                    this.PERMISSIONS.VIEW.RULES
                ],
                action: [
                    this.PERMISSIONS.ACTION.UPDATE_SUBSCRIPTION,
                    this.PERMISSIONS.ACTION.UPDATE_PROFILE
                ],
                access: [
                    this.PERMISSIONS.ACCESS.LENDING_RULES
                ]
            }
        };
        
        // Admin permissions (override all)
        const adminMatrix = {
            view: [...Object.values(this.PERMISSIONS.VIEW)],
            action: [...Object.values(this.PERMISSIONS.ACTION)],
            access: [...Object.values(this.PERMISSIONS.ACCESS)]
        };
        
        return {
            state: stateMatrix,
            admin: adminMatrix
        };
    }
    
    /**
     * SUBSCRIPTION VALIDATION
     */
    isSubscriptionActive() {
        if (!this.profile.subscription || !this.profile.subscription.expiryDate) {
            return false;
        }
        
        const expiryDate = new Date(this.profile.subscription.expiryDate);
        const today = new Date();
        
        // Expires on 28th - check if today is before expiry
        return today <= expiryDate;
    }
    
    calculateDaysToExpiry() {
        if (!this.profile.subscription || !this.profile.subscription.expiryDate) {
            return 0;
        }
        
        const expiryDate = new Date(this.profile.subscription.expiryDate);
        const today = new Date();
        const diffTime = expiryDate - today;
        
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    /**
     * PERMISSION CHECK METHODS
     */
    
    // Check if has permission
    hasPermission(permissionType, permissionName, context = {}) {
        const cacheKey = `${permissionType}_${permissionName}_${JSON.stringify(context)}`;
        
        if (this.permissionCache.has(cacheKey)) {
            return this.permissionCache.get(cacheKey);
        }
        
        let hasPermission = false;
        
        // Check if user is admin (full access)
        if (this.profile.role === 'admin') {
            hasPermission = true;
        } else {
            // Check state-based permissions
            const statePermissions = this.permissionMatrix.state[this.state];
            if (statePermissions && statePermissions[permissionType]) {
                hasPermission = statePermissions[permissionType].includes(permissionName);
            }
            
            // Additional checks based on context
            if (hasPermission) {
                hasPermission = this.validateContextPermission(permissionName, context);
            }
        }
        
        this.permissionCache.set(cacheKey, hasPermission);
        return hasPermission;
    }
    
    // Validate permission in context
    validateContextPermission(permissionName, context) {
        switch (permissionName) {
            case this.PERMISSIONS.ACTION.CREATE_LEDGER:
            case this.PERMISSIONS.ACTION.APPROVE_LOAN:
            case this.PERMISSIONS.ACTION.CREATE_LOAN:
                // Lending operations require active subscription
                if (!this.subscriptionActive) {
                    return false;
                }
                
                // Check country isolation
                if (context.country && this.country !== context.country) {
                    return false;
                }
                
                // Check group isolation
                if (context.groupId && this.groupId !== context.groupId) {
                    return false;
                }
                
                // Check weekly lending limit
                if (context.amount) {
                    const weeklyLimit = this.getWeeklyLendingLimit();
                    const weeklyUsed = this.getWeeklyLendingUsed();
                    if (weeklyUsed + context.amount > weeklyLimit) {
                        return false;
                    }
                }
                
                return true;
                
            case this.PERMISSIONS.ACTION.UPDATE_LEDGER:
                // Can only update own ledgers
                if (context.ledgerLenderId && this.profile.id !== context.ledgerLenderId) {
                    return false;
                }
                
                // Cannot update cleared or archived ledgers
                if (context.ledgerStatus && ['CLEARED', 'ARCHIVED'].includes(context.ledgerStatus)) {
                    return false;
                }
                
                return true;
                
            case this.PERMISSIONS.ACTION.BLACKLIST:
                // Can only blacklist from own ledgers
                if (context.ledgerLenderId && this.profile.id !== context.ledgerLenderId) {
                    return false;
                }
                
                // Check if overdue for 60+ days
                if (context.daysOverdue && context.daysOverdue < 60) {
                    return false;
                }
                
                return true;
                
            case this.PERMISSIONS.ACTION.REMOVE_BLACKLIST:
                // Only admin or original lender can remove
                return this.profile.role === 'admin' || 
                       (context.blacklistedBy && context.blacklistedBy === this.profile.id);
                
            case this.PERMISSIONS.VIEW.LEDGER:
            case this.PERMISSIONS.VIEW.PORTFOLIO:
                // Can only view own ledgers unless admin
                if (context.lenderId && this.profile.id !== context.lenderId && this.profile.role !== 'admin') {
                    return false;
                }
                
                return true;
                
            case this.PERMISSIONS.VIEW.GROUP:
                // Can only view groups in same country
                if (context.groupCountry && this.country !== context.groupCountry) {
                    return false;
                }
                
                return true;
                
            case this.PERMISSIONS.ACCESS.ADMIN_PANEL:
            case this.PERMISSIONS.ACCESS.AUDIT_LOG:
            case this.PERMISSIONS.ACCESS.SYSTEM_HEALTH:
                // Admin only access
                return this.profile.role === 'admin';
                
            default:
                return true;
        }
    }
    
    /**
     * HIERARCHY-BASED PERMISSION CHECKS
     */
    
    // Check country isolation
    canOperateInCountry(targetCountry) {
        if (!targetCountry) return false;
        
        // Admin can operate in any country
        if (this.profile.role === 'admin') return true;
        
        // Lenders can only operate in their registered country
        return this.country && this.country.toLowerCase() === targetCountry.toLowerCase();
    }
    
    // Check group isolation
    canOperateInGroup(targetGroupId) {
        if (!targetGroupId) return false;
        
        // Admin can operate in any group
        if (this.profile.role === 'admin') return true;
        
        // Lenders can only operate in their primary group
        return this.groupId && this.groupId === targetGroupId;
    }
    
    // Check if can lend to borrower
    canLendToBorrower(borrowerData) {
        // Check basic permissions
        if (!this.hasPermission('action', this.PERMISSIONS.ACTION.CREATE_LEDGER)) {
            return {
                allowed: false,
                reason: 'Lender does not have permission to create ledgers'
            };
        }
        
        // Check subscription
        if (!this.subscriptionActive) {
            return {
                allowed: false,
                reason: 'Subscription expired. Renew to continue lending'
            };
        }
        
        // Check country isolation
        if (!this.canOperateInCountry(borrowerData.country)) {
            return {
                allowed: false,
                reason: `Country isolation: Lender from ${this.country} cannot lend to borrower in ${borrowerData.country}`
            };
        }
        
        // Check group isolation
        if (!this.canOperateInGroup(borrowerData.groupId)) {
            return {
                allowed: false,
                reason: `Group isolation: Lender can only lend within group ${this.groupId}`
            };
        }
        
        // Check if borrower is in same group
        if (borrowerData.groupId !== this.groupId) {
            return {
                allowed: false,
                reason: 'Borrower is not in the same group as lender'
            };
        }
        
        // Check if borrower is blacklisted
        if (borrowerData.isBlacklisted) {
            return {
                allowed: false,
                reason: 'Borrower is blacklisted'
            };
        }
        
        // Check borrower rating if applicable
        if (borrowerData.rating && borrowerData.rating < 2) {
            return {
                allowed: false,
                reason: 'Borrower rating is too low'
            };
        }
        
        // Check if borrower already has active loan in this group
        if (borrowerData.activeLoans && borrowerData.activeLoans > 0) {
            return {
                allowed: false,
                reason: 'Borrower already has an active loan in this group'
            };
        }
        
        return {
            allowed: true,
            reason: 'All checks passed'
        };
    }
    
    /**
     * SUBSCRIPTION-BASED PERMISSIONS
     */
    
    getWeeklyLendingLimit() {
        if (!this.profile.subscription || !this.profile.subscription.tier) {
            return 0;
        }
        
        const tierLimits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        
        return tierLimits[this.profile.subscription.tier] || 0;
    }
    
    getWeeklyLendingUsed() {
        // In production, this would calculate from ledger data
        return this.profile.weeklyLent || 0;
    }
    
    canLendAmount(amount) {
        const weeklyLimit = this.getWeeklyLendingLimit();
        const weeklyUsed = this.getWeeklyLendingUsed();
        
        if (weeklyUsed + amount > weeklyLimit) {
            return {
                allowed: false,
                remaining: weeklyLimit - weeklyUsed,
                reason: `Weekly lending limit exceeded. Limit: ${weeklyLimit}, Used: ${weeklyUsed}, Requested: ${amount}`
            };
        }
        
        return {
            allowed: true,
            remaining: weeklyLimit - weeklyUsed - amount
        };
    }
    
    /**
     * LEDGER OPERATION PERMISSIONS
     */
    
    canUpdateLedger(ledgerData) {
        // Check basic permission
        if (!this.hasPermission('action', this.PERMISSIONS.ACTION.UPDATE_LEDGER, {
            ledgerLenderId: ledgerData.lenderId,
            ledgerStatus: ledgerData.status
        })) {
            return {
                allowed: false,
                reason: 'Cannot update this ledger'
            };
        }
        
        // Check if ledger is in same group
        if (ledgerData.groupId !== this.groupId) {
            return {
                allowed: false,
                reason: 'Ledger belongs to different group'
            };
        }
        
        // Cannot update cleared or archived ledgers
        if (['CLEARED', 'ARCHIVED'].includes(ledgerData.status)) {
            return {
                allowed: false,
                reason: `Cannot update ${ledgerData.status.toLowerCase()} ledger`
            };
        }
        
        return {
            allowed: true,
            reason: 'Can update ledger'
        };
    }
    
    canRateBorrower(borrowerId, ledgerId) {
        // Check basic permission
        if (!this.hasPermission('action', this.PERMISSIONS.ACTION.RATE_BORROWER)) {
            return {
                allowed: false,
                reason: 'Cannot rate borrowers'
            };
        }
        
        // Can only rate borrowers from own ledgers
        // In production, would check if borrower is in any of lender's ledgers
        return {
            allowed: true,
            reason: 'Can rate borrower'
        };
    }
    
    /**
     * GROUP OPERATION PERMISSIONS
     */
    
    canCreateGroup(country) {
        // Check basic permission
        if (!this.hasPermission('action', this.PERMISSIONS.ACTION.CREATE_GROUP)) {
            return {
                allowed: false,
                reason: 'Cannot create groups'
            };
        }
        
        // Check country permission
        if (!this.canOperateInCountry(country)) {
            return {
                allowed: false,
                reason: `Cannot create group in ${country}. Lender is registered in ${this.country}`
            };
        }
        
        // Check if lender is already group admin elsewhere
        // (In production, would check existing groups)
        
        return {
            allowed: true,
            reason: 'Can create group'
        };
    }
    
    canJoinGroup(groupData) {
        // Check basic permission
        if (!this.hasPermission('action', this.PERMISSIONS.ACTION.JOIN_GROUP)) {
            return {
                allowed: false,
                reason: 'Cannot join groups'
            };
        }
        
        // Check country match
        if (groupData.country !== this.country) {
            return {
                allowed: false,
                reason: `Cannot join group in ${groupData.country}. Lender is registered in ${this.country}`
            };
        }
        
        // Check group capacity
        if (groupData.memberCount && groupData.memberCount >= 1000) {
            return {
                allowed: false,
                reason: 'Group has reached maximum capacity (1000 members)'
            };
        }
        
        // Lenders can only belong to one group
        if (this.groupId) {
            return {
                allowed: false,
                reason: 'Lender already belongs to a group'
            };
        }
        
        return {
            allowed: true,
            reason: 'Can join group'
        };
    }
    
    /**
     * UI PERMISSION HELPERS
     */
    
    // Get all allowed pages for current state
    getAllowedPages() {
        const pages = {
            dashboard: this.hasPermission('access', this.PERMISSIONS.ACCESS.LENDING_CART),
            portfolio: this.hasPermission('access', this.PERMISSIONS.ACCESS.LENDING_PORTFOLIO),
            requests: this.hasPermission('access', this.PERMISSIONS.ACCESS.LENDING_REQUESTS),
            risk: this.hasPermission('access', this.PERMISSIONS.ACCESS.LENDING_RISK),
            rules: this.hasPermission('access', this.PERMISSIONS.ACCESS.LENDING_RULES),
            history: this.hasPermission('view', this.PERMISSIONS.VIEW.HISTORY),
            profile: this.hasPermission('view', this.PERMISSIONS.VIEW.PROFILE),
            subscription: this.hasPermission('view', this.PERMISSIONS.VIEW.SUBSCRIPTION),
            blacklist: this.hasPermission('view', this.PERMISSIONS.VIEW.BLACKLIST),
            group: this.hasPermission('view', this.PERMISSIONS.VIEW.GROUP)
        };
        
        // Filter to only true values
        return Object.keys(pages).filter(page => pages[page]);
    }
    
    // Get all allowed actions
    getAllowedActions() {
        const actions = {
            createLoan: this.hasPermission('action', this.PERMISSIONS.ACTION.CREATE_LOAN),
            approveLoan: this.hasPermission('action', this.PERMISSIONS.ACTION.APPROVE_LOAN),
            updateLedger: this.hasPermission('action', this.PERMISSIONS.ACTION.UPDATE_LEDGER),
            rateBorrower: this.hasPermission('action', this.PERMISSIONS.ACTION.RATE_BORROWER),
            blacklist: this.hasPermission('action', this.PERMISSIONS.ACTION.BLACKLIST),
            inviteMember: this.hasPermission('action', this.PERMISSIONS.ACTION.INVITE_MEMBER),
            createGroup: this.hasPermission('action', this.PERMISSIONS.ACTION.CREATE_GROUP),
            exportData: this.hasPermission('action', this.PERMISSIONS.ACTION.EXPORT_DATA)
        };
        
        // Filter to only true values
        return Object.keys(actions).filter(action => actions[action]);
    }
    
    /**
     * PERMISSION CHECK WRAPPERS FOR UI
     */
    
    // Quick permission checks for common operations
    canViewDashboard() {
        return this.hasPermission('view', this.PERMISSIONS.VIEW.DASHBOARD);
    }
    
    canCreateLoan() {
        return this.hasPermission('action', this.PERMISSIONS.ACTION.CREATE_LOAN) && 
               this.subscriptionActive;
    }
    
    canUpdateProfile() {
        return this.hasPermission('action', this.PERMISSIONS.ACTION.UPDATE_PROFILE);
    }
    
    canManageSubscription() {
        return this.hasPermission('action', this.PERMISSIONS.ACTION.UPDATE_SUBSCRIPTION);
    }
    
    canViewBlacklist() {
        return this.hasPermission('view', this.PERMISSIONS.VIEW.BLACKLIST);
    }
    
    canAccessAdmin() {
        return this.hasPermission('access', this.PERMISSIONS.ACCESS.ADMIN_PANEL);
    }
    
    /**
     * PERMISSION SUMMARY
     */
    
    getPermissionSummary() {
        return {
            state: this.state,
            subscriptionActive: this.subscriptionActive,
            daysToExpiry: this.daysToExpiry,
            country: this.country,
            groupId: this.groupId,
            allowedPages: this.getAllowedPages(),
            allowedActions: this.getAllowedActions(),
            weeklyLimit: this.getWeeklyLendingLimit(),
            weeklyRemaining: this.getWeeklyLendingLimit() - this.getWeeklyLendingUsed(),
            hierarchy: {
                countryIsolation: true,
                groupIsolation: true,
                canOperateInCountry: this.canOperateInCountry(this.country),
                canOperateInGroup: this.canOperateInGroup(this.groupId)
            }
        };
    }
    
    /**
     * PERMISSION VALIDATION FOR ROUTES
     */
    
    validateRouteAccess(routePath) {
        const routePermissions = {
            '/lender/dashboard': this.canViewDashboard(),
            '/lender/portfolio': this.hasPermission('access', this.PERMISSIONS.ACCESS.LENDING_PORTFOLIO),
            '/lender/requests': this.hasPermission('access', this.PERMISSIONS.ACCESS.LENDING_REQUESTS),
            '/lender/risk': this.hasPermission('access', this.PERMISSIONS.ACCESS.LENDING_RISK),
            '/lender/rules': this.hasPermission('access', this.PERMISSIONS.ACCESS.LENDING_RULES),
            '/lender/history': this.hasPermission('view', this.PERMISSIONS.VIEW.HISTORY),
            '/lender/profile': this.hasPermission('view', this.PERMISSIONS.VIEW.PROFILE),
            '/lender/subscription': this.hasPermission('view', this.PERMISSIONS.VIEW.SUBSCRIPTION),
            '/lender/blacklist': this.canViewBlacklist(),
            '/admin': this.canAccessAdmin()
        };
        
        return routePermissions[routePath] || false;
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LenderPermissions;
} else if (typeof window !== 'undefined') {
    window.LenderPermissions = LenderPermissions;
}

// Auto-initialize with example
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('M-Pesewa Lender Permissions loaded');
        
        // Example usage
        const exampleProfile = {
            id: 'lender_001',
            role: 'lender',
            country: 'ke',
            groupId: 'group_001',
            subscription: {
                tier: 'premium',
                expiryDate: new Date(new Date().getFullYear(), new Date().getMonth(), 28).toISOString()
            },
            weeklyLent: 1500
        };
        
        const permissions = new LenderPermissions('ACTIVE', exampleProfile);
        console.log('Permission Summary:', permissions.getPermissionSummary());
        console.log('Allowed Pages:', permissions.getAllowedPages());
        console.log('Allowed Actions:', permissions.getAllowedActions());
    });
}