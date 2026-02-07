/**
 * M-PESEWA ROLE GUARD
 * Strict role-based access control and permissions
 * Enforces: Borrower vs Lender separation, Admin privileges, Dual-role switching
 */

class RoleGuard {
    constructor() {
        this.roles = {
            'borrower': {
                level: 1,
                title: 'Borrower',
                description: 'Can request emergency loans within trusted groups',
                color: '#f37021', // Orange
                icon: '💼',
                defaultRoute: '/borrower/dashboard.html',
                maxGroups: 4,
                canBorrow: true,
                canLend: false,
                requiresSubscription: false,
                dualRoleAllowed: true
            },
            'lender': {
                level: 2,
                title: 'Lender',
                description: 'Can provide loans within their group with active subscription',
                color: '#28a745', // Green
                icon: '🌱',
                defaultRoute: '/lender/dashboard.html',
                maxGroups: 1, // Lenders are limited to one group
                canBorrow: false, // By default, but can have dual role
                canLend: true,
                requiresSubscription: true,
                dualRoleAllowed: true,
                subscriptionTiers: ['basic', 'premium', 'super', 'lender-of-lenders']
            },
            'group-admin': {
                level: 3,
                title: 'Group Admin',
                description: 'Manages group members, invitations, and moderation',
                color: '#0099ff', // Blue
                icon: '👑',
                defaultRoute: '/groups/admin/dashboard.html',
                maxGroups: 1, // One group per admin
                canBorrow: false,
                canLend: false,
                requiresSubscription: false,
                dualRoleAllowed: false
            },
            'platform-admin': {
                level: 4,
                title: 'Platform Admin',
                description: 'Full system access, can override any restriction',
                color: '#003366', // Deep Blue
                icon: '⚡',
                defaultRoute: '/admin/dashboard.html',
                maxGroups: null, // Unlimited access
                canBorrow: false,
                canLend: false,
                requiresSubscription: false,
                dualRoleAllowed: false,
                canOverride: ['blacklist', 'ledgers', 'ratings', 'subscriptions']
            }
        };
        
        this.permissions = {
            // Borrower permissions
            'borrower:request-loan': {
                roles: ['borrower', 'dual-role'],
                description: 'Request emergency loans',
                conditions: ['!blacklisted', 'in-group', 'good-rating']
            },
            'borrower:view-history': {
                roles: ['borrower', 'dual-role'],
                description: 'View borrowing history'
            },
            'borrower:make-repayment': {
                roles: ['borrower', 'dual-role'],
                description: 'Make loan repayments'
            },
            'borrower:join-group': {
                roles: ['borrower', 'dual-role'],
                description: 'Join groups (max 4)',
                conditions: ['max-groups-not-reached', 'good-rating']
            },
            
            // Lender permissions
            'lender:view-requests': {
                roles: ['lender', 'dual-role'],
                description: 'View loan requests in group',
                conditions: ['active-subscription', 'in-group']
            },
            'lender:approve-loan': {
                roles: ['lender', 'dual-role'],
                description: 'Approve loan requests',
                conditions: ['active-subscription', 'in-group', 'within-limit']
            },
            'lender:create-ledger': {
                roles: ['lender', 'dual-role'],
                description: 'Create loan ledgers',
                conditions: ['active-subscription', 'in-group']
            },
            'lender:rate-borrower': {
                roles: ['lender', 'dual-role'],
                description: 'Rate borrowers (1-5 stars)',
                conditions: ['has-lent-to-borrower']
            },
            'lender:blacklist-borrower': {
                roles: ['lender', 'dual-role'],
                description: 'Blacklist defaulting borrowers',
                conditions: ['borrower-defaulted', 'in-same-group']
            },
            
            // Group Admin permissions
            'group-admin:invite-members': {
                roles: ['group-admin'],
                description: 'Invite new members to group'
            },
            'group-admin:remove-members': {
                roles: ['group-admin'],
                description: 'Remove members from group'
            },
            'group-admin:moderate-disputes': {
                roles: ['group-admin'],
                description: 'Moderate disputes within group'
            },
            'group-admin:view-group-stats': {
                roles: ['group-admin'],
                description: 'View group statistics and analytics'
            },
            
            // Platform Admin permissions
            'platform-admin:override-blacklist': {
                roles: ['platform-admin'],
                description: 'Override blacklist decisions'
            },
            'platform-admin:edit-ledgers': {
                roles: ['platform-admin'],
                description: 'Edit any ledger in the system'
            },
            'platform-admin:moderate-ratings': {
                roles: ['platform-admin'],
                description: 'Moderate borrower/lender ratings'
            },
            'platform-admin:view-all-data': {
                roles: ['platform-admin'],
                description: 'View all platform data across countries'
            },
            'platform-admin:system-config': {
                roles: ['platform-admin'],
                description: 'Configure system settings'
            }
        };
        
        this.roleRoutes = {
            // Borrower-specific routes
            'borrower': [
                '/borrower/dashboard.html',
                '/borrower/apply.html',
                '/borrower/history.html',
                '/borrower/repayments.html',
                '/borrower/disputes.html',
                '/emergency/request.html',
                '/groups/join.html'
            ],
            
            // Lender-specific routes
            'lender': [
                '/lender/dashboard.html',
                '/lender/portfolio.html',
                '/lender/history.html',
                '/lender/rules.html',
                '/lender/risk.html',
                '/lender/approve.html',
                '/ledger/create.html',
                '/ledger/manage.html',
                '/subscription/manage.html'
            ],
            
            // Group Admin routes
            'group-admin': [
                '/groups/admin/dashboard.html',
                '/groups/admin/members.html',
                '/groups/admin/invite.html',
                '/groups/admin/settings.html',
                '/groups/admin/analytics.html'
            ],
            
            // Platform Admin routes
            'platform-admin': [
                '/admin/dashboard.html',
                '/admin/users.html',
                '/admin/groups.html',
                '/admin/ledgers.html',
                '/admin/blacklist.html',
                '/admin/subscriptions.html',
                '/admin/audit.html',
                '/admin/settings.html',
                '/admin/system.html'
            ],
            
            // Shared routes (accessible by multiple roles)
            'shared': [
                '/dashboard.html',
                '/profile.html',
                '/settings.html',
                '/notifications.html',
                '/messages.html',
                '/help.html',
                '/countries/'
            ],
            
            // Public routes (no role required)
            'public': [
                '/',
                '/index.html',
                '/home.html',
                '/auth/login.html',
                '/auth/register.html',
                '/auth/forgot.html',
                '/about.html',
                '/contact.html',
                '/terms.html',
                '/privacy.html',
                '/how-it-works.html',
                '/faq.html',
                '/emergency/categories.html',
                '/collectors.html'
            ]
        };
        
        this.currentUserRole = null;
        this.currentUserData = null;
        this.dualRoleActive = null;
        this.initialized = false;
    }

    /**
     * Initialize role guard with current user
     */
    initialize(userData = null) {
        if (this.initialized) {
            console.warn('[RoleGuard] Already initialized');
            return this;
        }
        
        if (!userData) {
            // Try to get from localStorage
            const storedData = localStorage.getItem('mpesewa_user_data');
            if (storedData) {
                userData = JSON.parse(storedData);
            }
        }
        
        if (userData && userData.userId) {
            this.currentUserData = userData;
            this.currentUserRole = userData.role;
            
            // Check for dual role
            if (userData.dualRole) {
                this.dualRoleActive = userData.activeRole || userData.role;
                console.log(`[RoleGuard] Dual role user: ${userData.role} with active role: ${this.dualRoleActive}`);
            }
            
            console.log(`[RoleGuard] Initialized for user: ${userData.userId}, role: ${this.currentUserRole}`);
        } else {
            console.log('[RoleGuard] Initialized without user (public mode)');
        }
        
        this.initialized = true;
        return this;
    }

    /**
     * Validate route access based on role
     */
    validateRoute(route, context = {}) {
        const startTime = Date.now();
        
        // If no user data, check if route is public
        if (!this.currentUserData) {
            return this.validatePublicRoute(route, context, startTime);
        }
        
        // Get effective role (considering dual role)
        const effectiveRole = this.getEffectiveRole();
        
        // Check if route is restricted based on role
        const roleValidation = this.validateRoleForRoute(route, effectiveRole);
        
        if (!roleValidation.allowed) {
            return {
                allowed: false,
                redirect: roleValidation.redirect || this.roles[effectiveRole].defaultRoute,
                error: 'ROLE_ACCESS_DENIED',
                message: roleValidation.message || `Your role (${effectiveRole}) cannot access this page`,
                duration: Date.now() - startTime,
                metadata: {
                    requestedRoute: route,
                    userRole: this.currentUserRole,
                    effectiveRole,
                    dualRole: this.dualRoleActive !== null
                }
            };
        }
        
        // Check additional conditions for this route
        const conditionValidation = this.validateRouteConditions(route, effectiveRole, context);
        
        if (!conditionValidation.allowed) {
            return {
                allowed: false,
                redirect: conditionValidation.redirect || this.roles[effectiveRole].defaultRoute,
                error: 'ROLE_CONDITION_NOT_MET',
                message: conditionValidation.message || 'Additional conditions not met',
                duration: Date.now() - startTime,
                metadata: conditionValidation.metadata
            };
        }
        
        // Check if role switching is required
        const switchValidation = this.validateRoleSwitching(route, effectiveRole);
        
        if (switchValidation.requiresSwitch) {
            return {
                allowed: true,
                redirect: null,
                requiresRoleSwitch: true,
                targetRole: switchValidation.targetRole,
                currentRole: effectiveRole,
                duration: Date.now() - startTime,
                context: {
                    ...context,
                    role: effectiveRole,
                    permissions: this.getRolePermissions(effectiveRole),
                    roleSwitchAvailable: this.canSwitchRole(),
                    roleSwitchTarget: switchValidation.targetRole
                }
            };
        }
        
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: {
                ...context,
                role: effectiveRole,
                roleTitle: this.roles[effectiveRole]?.title || effectiveRole,
                roleColor: this.roles[effectiveRole]?.color || '#000000',
                permissions: this.getRolePermissions(effectiveRole),
                roleSwitchAvailable: this.canSwitchRole(),
                dualRole: this.dualRoleActive !== null
            },
            metadata: {
                role: effectiveRole,
                routeCategory: roleValidation.category,
                conditionsMet: conditionValidation.conditions
            }
        };
    }

    /**
     * Validate public route access
     */
    validatePublicRoute(route, context, startTime) {
        // Check if route is public
        const isPublic = this.roleRoutes.public.some(publicRoute => 
            route === publicRoute || route.startsWith(publicRoute + '/')
        );
        
        if (isPublic) {
            return {
                allowed: true,
                duration: Date.now() - startTime,
                context: { ...context, authRequired: false, role: 'public' }
            };
        }
        
        // Check if route requires authentication (but user not logged in)
        const requiresAuth = this.roleRoutes.borrower.concat(
            this.roleRoutes.lender,
            this.roleRoutes['group-admin'],
            this.roleRoutes['platform-admin'],
            this.roleRoutes.shared
        ).some(authRoute => route.startsWith(authRoute));
        
        if (requiresAuth) {
            return {
                allowed: false,
                redirect: '/auth/login.html',
                error: 'AUTHENTICATION_REQUIRED',
                message: 'Please sign in to access this page',
                duration: Date.now() - startTime
            };
        }
        
        // Default: allow access (might be a country page or other semi-public route)
        return {
            allowed: true,
            duration: Date.now() - startTime,
            context: { ...context, authRequired: false, role: 'public' }
        };
    }

    /**
     * Validate if role can access route
     */
    validateRoleForRoute(route, role) {
        // Platform admin can access everything
        if (role === 'platform-admin') {
            return {
                allowed: true,
                category: 'admin'
            };
        }
        
        // Check role-specific routes
        const roleSpecificRoutes = this.roleRoutes[role];
        if (roleSpecificRoutes && roleSpecificRoutes.some(roleRoute => route.startsWith(roleRoute))) {
            return {
                allowed: true,
                category: role
            };
        }
        
        // Check shared routes
        if (this.roleRoutes.shared.some(sharedRoute => route.startsWith(sharedRoute))) {
            return {
                allowed: true,
                category: 'shared'
            };
        }
        
        // Check public routes (even though user is logged in)
        if (this.roleRoutes.public.some(publicRoute => route.startsWith(publicRoute))) {
            return {
                allowed: true,
                category: 'public'
            };
        }
        
        // Check if user has dual role and route belongs to other role
        if (this.dualRoleActive !== null && this.currentUserData.dualRole) {
            const otherRole = this.currentUserRole === 'borrower' ? 'lender' : 'borrower';
            const otherRoleRoutes = this.roleRoutes[otherRole];
            
            if (otherRoleRoutes && otherRoleRoutes.some(otherRoute => route.startsWith(otherRoute))) {
                return {
                    allowed: false,
                    redirect: `/role/switch.html?target=${otherRole}&redirect=${encodeURIComponent(route)}`,
                    message: `Switch to ${otherRole} role to access this page`
                };
            }
        }
        
        return {
            allowed: false,
            redirect: this.roles[role].defaultRoute,
            message: `Route not accessible for ${role} role`
        };
    }

    /**
     * Validate route-specific conditions
     */
    validateRouteConditions(route, role, context) {
        const conditions = [];
        const failedConditions = [];
        
        // Get all permissions that apply to this route
        const routePermissions = this.getPermissionsForRoute(route, role);
        
        // Check each permission's conditions
        for (const permission of routePermissions) {
            if (permission.conditions) {
                for (const condition of permission.conditions) {
                    const conditionResult = this.checkCondition(condition, role, context);
                    
                    if (conditionResult.met) {
                        conditions.push({
                            permission: permission.name,
                            condition,
                            result: 'passed'
                        });
                    } else {
                        failedConditions.push({
                            permission: permission.name,
                            condition,
                            reason: conditionResult.reason,
                            result: 'failed'
                        });
                    }
                }
            }
        }
        
        if (failedConditions.length > 0) {
            const firstFailure = failedConditions[0];
            return {
                allowed: false,
                redirect: this.getConditionRedirect(firstFailure.condition, role),
                message: this.getConditionMessage(firstFailure.condition, firstFailure.reason),
                metadata: {
                    failedConditions,
                    passedConditions: conditions
                }
            };
        }
        
        return {
            allowed: true,
            conditions: conditions
        };
    }

    /**
     * Check specific condition
     */
    checkCondition(condition, role, context) {
        switch(condition) {
            case '!blacklisted':
                return this.checkNotBlacklisted();
                
            case 'in-group':
                return this.checkInGroup();
                
            case 'good-rating':
                return this.checkGoodRating();
                
            case 'max-groups-not-reached':
                return this.checkMaxGroupsNotReached();
                
            case 'active-subscription':
                return this.checkActiveSubscription();
                
            case 'within-limit':
                return this.checkWithinLimit(context);
                
            case 'has-lent-to-borrower':
                return this.checkHasLentToBorrower(context);
                
            case 'borrower-defaulted':
                return this.checkBorrowerDefaulted(context);
                
            case 'in-same-group':
                return this.checkInSameGroup(context);
                
            default:
                return { met: true, reason: 'Condition not implemented' };
        }
    }

    /**
     * Check if user is not blacklisted
     */
    checkNotBlacklisted() {
        const blacklistStatus = JSON.parse(localStorage.getItem('mpesewa_blacklist_status') || '{}');
        
        if (blacklistStatus.isBlacklisted) {
            return {
                met: false,
                reason: `Blacklisted: ${blacklistStatus.reason || 'Defaulted loan'}`
            };
        }
        
        return { met: true };
    }

    /**
     * Check if user is in a group
     */
    checkInGroup() {
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        
        if (userGroups.length === 0) {
            return {
                met: false,
                reason: 'Not a member of any group'
            };
        }
        
        return { met: true };
    }

    /**
     * Check if user has good rating (≥ 3 stars)
     */
    checkGoodRating() {
        const userData = this.currentUserData || JSON.parse(localStorage.getItem('mpesewa_user_data') || '{}');
        const rating = userData.profile?.rating || 0;
        
        if (rating < 3) {
            return {
                met: false,
                reason: `Rating too low: ${rating} stars (minimum 3 required)`
            };
        }
        
        return { met: true };
    }

    /**
     * Check if borrower hasn't reached max groups (4)
     */
    checkMaxGroupsNotReached() {
        if (this.currentUserRole !== 'borrower' && this.dualRoleActive !== 'borrower') {
            return { met: true, reason: 'Not a borrower' };
        }
        
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        
        if (userGroups.length >= 4) {
            return {
                met: false,
                reason: `Already in ${userGroups.length} groups (maximum 4)`
            };
        }
        
        return { met: true };
    }

    /**
     * Check if lender has active subscription
     */
    checkActiveSubscription() {
        if (this.currentUserRole !== 'lender' && this.dualRoleActive !== 'lender') {
            return { met: true, reason: 'Not a lender' };
        }
        
        const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || '{}');
        
        if (!subscription.tier) {
            return {
                met: false,
                reason: 'No subscription active'
            };
        }
        
        // Check if subscription expired (28th of each month)
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const expiryDate = new Date(currentYear, currentMonth, 28);
        
        if (today > expiryDate) {
            return {
                met: false,
                reason: 'Subscription expired'
            };
        }
        
        return { met: true };
    }

    /**
     * Check if within subscription tier limits
     */
    checkWithinLimit(context) {
        const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || '{}');
        const amount = context.loanAmount || 0;
        
        const tierLimits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        
        const limit = tierLimits[subscription.tier] || 0;
        
        if (amount > limit) {
            return {
                met: false,
                reason: `Amount ${amount} exceeds ${subscription.tier} tier limit of ${limit}`
            };
        }
        
        return { met: true };
    }

    /**
     * Check if lender has lent to specific borrower
     */
    checkHasLentToBorrower(context) {
        // In production, would check database
        // For demo, check localStorage
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        const borrowerId = context.borrowerId;
        
        if (!borrowerId) {
            return { met: false, reason: 'No borrower specified' };
        }
        
        const hasLent = ledgers.some(ledger => 
            ledger.lenderId === this.currentUserData.userId && 
            ledger.borrowerId === borrowerId
        );
        
        if (!hasLent) {
            return {
                met: false,
                reason: 'Never lent to this borrower'
            };
        }
        
        return { met: true };
    }

    /**
     * Check if borrower has defaulted
     */
    checkBorrowerDefaulted(context) {
        const borrowerId = context.borrowerId;
        
        if (!borrowerId) {
            return { met: false, reason: 'No borrower specified' };
        }
        
        // In production, would check database
        // For demo, check blacklist
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        const isDefaulted = blacklist.some(entry => entry.userId === borrowerId);
        
        if (!isDefaulted) {
            return {
                met: false,
                reason: 'Borrower has not defaulted'
            };
        }
        
        return { met: true };
    }

    /**
     * Check if in same group as context user
     */
    checkInSameGroup(context) {
        const targetUserId = context.targetUserId;
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        
        if (!targetUserId) {
            return { met: false, reason: 'No target user specified' };
        }
        
        // In production, would check database
        // For demo, assume they're in same group if both have groups
        return { met: userGroups.length > 0, reason: 'Group membership check' };
    }

    /**
     * Get redirect for failed condition
     */
    getConditionRedirect(condition, role) {
        const redirectMap = {
            '!blacklisted': '/blacklist/status.html',
            'in-group': '/groups/join.html',
            'good-rating': '/profile.html',
            'max-groups-not-reached': '/borrower/dashboard.html',
            'active-subscription': '/subscription/plans.html',
            'within-limit': '/subscription/upgrade.html',
            'has-lent-to-borrower': '/lender/portfolio.html',
            'borrower-defaulted': '/lender/portfolio.html',
            'in-same-group': '/groups/selector.html'
        };
        
        return redirectMap[condition] || this.roles[role].defaultRoute;
    }

    /**
     * Get condition failure message
     */
    getConditionMessage(condition, reason) {
        const messageMap = {
            '!blacklisted': 'You are blacklisted and cannot borrow',
            'in-group': 'You must join a group first',
            'good-rating': 'Your rating is too low for this action',
            'max-groups-not-reached': 'You have reached the maximum number of groups (4)',
            'active-subscription': 'Active subscription required for lending',
            'within-limit': 'Amount exceeds your subscription tier limit',
            'has-lent-to-borrower': 'You can only rate borrowers you have lent to',
            'borrower-defaulted': 'Borrower has not defaulted',
            'in-same-group': 'User is not in your group'
        };
        
        return messageMap[condition] || `Condition not met: ${reason}`;
    }

    /**
     * Validate if role switching is required
     */
    validateRoleSwitching(route, currentRole) {
        // Check if user has dual role capability
        if (!this.currentUserData.dualRole) {
            return { requiresSwitch: false };
        }
        
        // Check if route belongs to other role
        const otherRole = this.currentUserRole === 'borrower' ? 'lender' : 'borrower';
        const otherRoleRoutes = this.roleRoutes[otherRole];
        
        if (otherRoleRoutes && otherRoleRoutes.some(otherRoute => route.startsWith(otherRoute))) {
            // User is trying to access other role's route
            if (this.dualRoleActive !== otherRole) {
                return {
                    requiresSwitch: true,
                    targetRole: otherRole,
                    currentRole: this.dualRoleActive || currentRole
                };
            }
        }
        
        return { requiresSwitch: false };
    }

    /**
     * Get effective role (considering dual role)
     */
    getEffectiveRole() {
        if (this.dualRoleActive !== null) {
            return this.dualRoleActive;
        }
        return this.currentUserRole;
    }

    /**
     * Get permissions for current effective role
     */
    getRolePermissions(role) {
        const permissions = [];
        
        for (const [key, permission] of Object.entries(this.permissions)) {
            if (permission.roles.includes(role) || 
                (role === 'dual-role' && (permission.roles.includes('borrower') || permission.roles.includes('lender')))) {
                permissions.push({
                    key,
                    ...permission
                });
            }
        }
        
        return permissions;
    }

    /**
     * Get permissions that apply to a specific route
     */
    getPermissionsForRoute(route, role) {
        const routePermissions = [];
        const rolePermissions = this.getRolePermissions(role);
        
        // Simple mapping of route patterns to permissions
        const routePermissionMap = {
            '/borrower/apply.html': ['borrower:request-loan'],
            '/borrower/history.html': ['borrower:view-history'],
            '/groups/join.html': ['borrower:join-group'],
            '/lender/approve.html': ['lender:approve-loan', 'lender:create-ledger'],
            '/ledger/create.html': ['lender:create-ledger'],
            '/lender/rate.html': ['lender:rate-borrower'],
            '/blacklist/add.html': ['lender:blacklist-borrower']
        };
        
        // Find matching route pattern
        for (const [routePattern, permissionKeys] of Object.entries(routePermissionMap)) {
            if (route.startsWith(routePattern)) {
                for (const permissionKey of permissionKeys) {
                    const permission = rolePermissions.find(p => p.key === permissionKey);
                    if (permission) {
                        routePermissions.push(permission);
                    }
                }
                break;
            }
        }
        
        return routePermissions;
    }

    /**
     * Check if user can switch roles
     */
    canSwitchRole() {
        if (!this.currentUserData || !this.currentUserData.dualRole) {
            return false;
        }
        
        // Check if user has both roles configured
        return this.currentUserRole === 'borrower' || this.currentUserRole === 'lender';
    }

    /**
     * Switch active role (for dual-role users)
     */
    switchRole(targetRole) {
        if (!this.canSwitchRole()) {
            throw new Error('User cannot switch roles');
        }
        
        const validTarget = targetRole === 'borrower' || targetRole === 'lender';
        if (!validTarget) {
            throw new Error(`Invalid target role: ${targetRole}`);
        }
        
        if (targetRole === this.currentUserRole && this.dualRoleActive === targetRole) {
            throw new Error(`Already in ${targetRole} role`);
        }
        
        // Update dual role active state
        this.dualRoleActive = targetRole;
        
        // Update user data
        this.currentUserData.activeRole = targetRole;
        localStorage.setItem('mpesewa_user_data', JSON.stringify(this.currentUserData));
        
        // Log role switch
        this.logRoleEvent('ROLE_SWITCHED', {
            from: this.currentUserRole,
            to: targetRole,
            userId: this.currentUserData.userId
        });
        
        console.log(`[RoleGuard] Role switched to: ${targetRole}`);
        
        return {
            success: true,
            previousRole: this.currentUserRole,
            newRole: targetRole,
            defaultRoute: this.roles[targetRole].defaultRoute
        };
    }

    /**
     * Register dual role for user
     */
    registerDualRole(userId, secondRole) {
        if (secondRole !== 'borrower' && secondRole !== 'lender') {
            throw new Error('Second role must be either borrower or lender');
        }
        
        // In production, would update in database
        // For demo, update localStorage
        
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const userIndex = users.findIndex(u => u.userId === userId);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        
        // Check if user already has this role
        if (users[userIndex].role === secondRole) {
            throw new Error(`User already has ${secondRole} role`);
        }
        
        // Update user to dual role
        users[userIndex].dualRole = true;
        users[userIndex].roles = [users[userIndex].role, secondRole];
        users[userIndex].activeRole = users[userIndex].role;
        
        localStorage.setItem('mpesewa_users', JSON.stringify(users));
        
        // Update current user data if it's the current user
        if (this.currentUserData && this.currentUserData.userId === userId) {
            this.currentUserData = users[userIndex];
            this.currentUserData.dualRole = true;
            this.currentUserData.roles = [this.currentUserRole, secondRole];
            this.currentUserData.activeRole = this.currentUserRole;
            
            localStorage.setItem('mpesewa_user_data', JSON.stringify(this.currentUserData));
        }
        
        this.logRoleEvent('DUAL_ROLE_REGISTERED', {
            userId,
            primaryRole: users[userIndex].role,
            secondaryRole: secondRole
        });
        
        console.log(`[RoleGuard] Dual role registered: ${users[userIndex].role} + ${secondRole}`);
        
        return {
            success: true,
            primaryRole: users[userIndex].role,
            secondaryRole: secondRole,
            dualRole: true
        };
    }

    /**
     * Check if user can perform specific action
     */
    canPerform(action, context = {}) {
        const effectiveRole = this.getEffectiveRole();
        const permission = this.permissions[action];
        
        if (!permission) {
            return {
                allowed: false,
                reason: `Permission '${action}' not defined`
            };
        }
        
        // Check role
        if (!permission.roles.includes(effectiveRole) && 
            !(effectiveRole === 'dual-role' && (permission.roles.includes('borrower') || permission.roles.includes('lender')))) {
            return {
                allowed: false,
                reason: `Role '${effectiveRole}' cannot perform '${action}'`
            };
        }
        
        // Check conditions
        if (permission.conditions) {
            for (const condition of permission.conditions) {
                const conditionResult = this.checkCondition(condition, effectiveRole, context);
                if (!conditionResult.met) {
                    return {
                        allowed: false,
                        reason: `Condition '${condition}' not met: ${conditionResult.reason}`
                    };
                }
            }
        }
        
        return {
            allowed: true,
            role: effectiveRole,
            permission: permission.description
        };
    }

    /**
     * Get user's role information
     */
    getUserRoleInfo() {
        if (!this.currentUserData) {
            return null;
        }
        
        const effectiveRole = this.getEffectiveRole();
        const roleInfo = this.roles[effectiveRole];
        
        if (!roleInfo) {
            return null;
        }
        
        return {
            role: effectiveRole,
            title: roleInfo.title,
            color: roleInfo.color,
            icon: roleInfo.icon,
            description: roleInfo.description,
            dualRole: this.currentUserData.dualRole || false,
            activeRole: this.dualRoleActive,
            availableRoles: this.currentUserData.dualRole ? 
                [this.currentUserRole, this.currentUserRole === 'borrower' ? 'lender' : 'borrower'] : 
                [this.currentUserRole],
            permissions: this.getRolePermissions(effectiveRole).length
        };
    }

    /**
     * Log role events
     */
    logRoleEvent(eventType, metadata = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: eventType,
            userId: metadata.userId || this.currentUserData?.userId || 'unknown',
            metadata
        };
        
        // Store in localStorage
        const roleLogs = JSON.parse(localStorage.getItem('mpesewa_role_logs') || '[]');
        roleLogs.push(logEntry);
        
        // Keep only last 50 logs
        if (roleLogs.length > 50) {
            roleLogs.splice(0, roleLogs.length - 50);
        }
        
        localStorage.setItem('mpesewa_role_logs', JSON.stringify(roleLogs));
        
        console.log(`[RoleEvent] ${eventType}:`, metadata);
    }

    /**
     * Get role statistics
     */
    getRoleStats() {
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        
        const stats = {
            totalUsers: users.length,
            byRole: {},
            dualRoleUsers: users.filter(u => u.dualRole).length,
            activeSessions: this.currentUserData ? 1 : 0
        };
        
        users.forEach(user => {
            stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
        });
        
        return stats;
    }

    /**
     * Export role guard configuration
     */
    exportConfig() {
        return {
            version: '1.0.0',
            initialized: this.initialized,
            currentUser: this.currentUserData ? {
                userId: this.currentUserData.userId,
                role: this.currentUserRole,
                effectiveRole: this.getEffectiveRole(),
                dualRole: this.currentUserData.dualRole || false
            } : null,
            roles: Object.keys(this.roles),
            permissions: Object.keys(this.permissions).length,
            routeCategories: Object.keys(this.roleRoutes).reduce((acc, category) => {
                acc[category] = this.roleRoutes[category].length;
                return acc;
            }, {})
        };
    }
}

// Create singleton instance
const roleGuard = new RoleGuard();

// Auto-initialize
roleGuard.initialize();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = roleGuard;
} else {
    window.RoleGuard = roleGuard;
}