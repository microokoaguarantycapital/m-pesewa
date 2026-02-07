/**
 * M-PESEWA Group Permissions
 * STRICT HIERARCHY ENFORCEMENT: Global → Country → Groups → Roles
 * Non-negotiable permission rules
 */

class GroupPermissions {
    constructor() {
        this.roles = {
            ADMIN: 'ADMIN',
            LENDER: 'LENDER',
            BORROWER: 'BORROWER',
            GUEST: 'GUEST'
        };
        
        this.permissionMatrix = this.buildPermissionMatrix();
    }

    /**
     * Build comprehensive permission matrix
     * @returns {object} Permission matrix
     */
    buildPermissionMatrix() {
        return {
            // GROUP MANAGEMENT
            CREATE_GROUP: {
                ADMIN: true,
                LENDER: true,  // Can create groups if subscribed
                BORROWER: false,
                GUEST: false
            },
            
            EDIT_GROUP_INFO: {
                ADMIN: true,
                LENDER: false,
                BORROWER: false,
                GUEST: false
            },
            
            DELETE_GROUP: {
                ADMIN: true,
                LENDER: false,
                BORROWER: false,
                GUEST: false
            },
            
            VIEW_GROUP_DASHBOARD: {
                ADMIN: true,
                LENDER: true,
                BORROWER: true,
                GUEST: false
            },
            
            // MEMBER MANAGEMENT
            INVITE_MEMBERS: {
                ADMIN: true,
                LENDER: true,  // Lenders can invite
                BORROWER: false,
                GUEST: false
            },
            
            REMOVE_MEMBERS: {
                ADMIN: true,
                LENDER: false,
                BORROWER: false,
                GUEST: false
            },
            
            VIEW_MEMBER_LIST: {
                ADMIN: true,
                LENDER: true,
                BORROWER: true,
                GUEST: false
            },
            
            VIEW_MEMBER_DETAILS: {
                ADMIN: true,
                LENDER: true,  // For due diligence
                BORROWER: false,
                GUEST: false
            },
            
            // LENDING PERMISSIONS
            CREATE_LOAN_OFFER: {
                ADMIN: false,  // Admins don't lend
                LENDER: true,  // Subject to subscription
                BORROWER: false,
                GUEST: false
            },
            
            APPROVE_LOAN_REQUEST: {
                ADMIN: false,
                LENDER: true,  // Their own requests
                BORROWER: false,
                GUEST: false
            },
            
            VIEW_LENDING_HISTORY: {
                ADMIN: true,  // Can view all
                LENDER: true,  // Only their own
                BORROWER: false,
                GUEST: false
            },
            
            // BORROWING PERMISSIONS
            REQUEST_LOAN: {
                ADMIN: false,
                LENDER: false,  // Unless also borrower
                BORROWER: true,
                GUEST: false
            },
            
            VIEW_LOAN_REQUESTS: {
                ADMIN: true,
                LENDER: true,  // To see requests they can fulfill
                BORROWER: false,  // Only see own
                GUEST: false
            },
            
            // LEDGER PERMISSIONS
            CREATE_LEDGER: {
                ADMIN: false,
                LENDER: true,  // Auto-created on loan approval
                BORROWER: false,
                GUEST: false
            },
            
            UPDATE_LEDGER: {
                ADMIN: true,  // Can override
                LENDER: true,  // Their own ledgers
                BORROWER: false,
                GUEST: false
            },
            
            VIEW_LEDGERS: {
                ADMIN: true,  // All ledgers in group
                LENDER: true,  // Only their own
                BORROWER: true,  // Only ledgers involving them
                GUEST: false
            },
            
            // SUBSCRIPTION PERMISSIONS
            VIEW_SUBSCRIPTION_STATUS: {
                ADMIN: true,
                LENDER: true,
                BORROWER: false,
                GUEST: false
            },
            
            UPGRADE_SUBSCRIPTION: {
                ADMIN: false,
                LENDER: true,
                BORROWER: false,
                GUEST: false
            },
            
            // RATING PERMISSIONS
            RATE_BORROWER: {
                ADMIN: true,
                LENDER: true,  // After loan completion
                BORROWER: false,
                GUEST: false
            },
            
            RATE_LENDER: {
                ADMIN: true,
                LENDER: false,
                BORROWER: true,  // After loan completion
                GUEST: false
            },
            
            // BLACKLIST PERMISSIONS
            BLACKLIST_USER: {
                ADMIN: true,
                LENDER: true,  // Can blacklist their borrowers
                BORROWER: false,
                GUEST: false
            },
            
            REMOVE_BLACKLIST: {
                ADMIN: true,  // Only admin can remove
                LENDER: false,
                BORROWER: false,
                GUEST: false
            },
            
            VIEW_BLACKLIST: {
                ADMIN: true,
                LENDER: true,
                BORROWER: true,
                GUEST: false
            },
            
            // GROUP STATE PERMISSIONS
            CHANGE_GROUP_STATE: {
                ADMIN: true,
                LENDER: false,
                BORROWER: false,
                GUEST: false
            },
            
            // FINANCIAL REPORTS
            VIEW_FINANCIAL_REPORTS: {
                ADMIN: true,
                LENDER: true,  // Their own performance
                BORROWER: false,
                GUEST: false
            },
            
            // AUDIT LOGS
            VIEW_AUDIT_LOGS: {
                ADMIN: true,
                LENDER: false,
                BORROWER: false,
                GUEST: false
            }
        };
    }

    /**
     * Check if user has permission for action
     * @param {string} userId - User ID
     * @param {string} groupId - Group ID
     * @param {string} action - Action to check
     * @returns {object} Permission check result
     */
    checkPermission(userId, groupId, action) {
        // Get user and group
        const user = this.getUser(userId);
        const group = this.getGroup(groupId);
        
        if (!user || !group) {
            return {
                allowed: false,
                reason: 'User or group not found',
                code: 'NOT_FOUND'
            };
        }

        // ENFORCE: User must be member of group
        const membership = group.members.find(m => m.userId === userId);
        if (!membership) {
            return {
                allowed: false,
                reason: 'User is not a member of this group',
                code: 'NOT_MEMBER'
            };
        }

        const userRole = membership.role;
        
        // ENFORCE: Country isolation
        if (user.country !== group.country) {
            return {
                allowed: false,
                reason: 'Cross-country operations not allowed',
                code: 'CROSS_COUNTRY_VIOLATION'
            };
        }

        // ENFORCE: Group state restrictions
        const stateRestricted = this.checkGroupStateRestrictions(group.state, action, userRole);
        if (stateRestricted) {
            return {
                allowed: false,
                reason: `Action not allowed while group is ${group.state.toLowerCase()}`,
                code: 'GROUP_STATE_RESTRICTED'
            };
        }

        // ENFORCE: Subscription requirements for lenders
        if (userRole === 'LENDER' && this.requiresSubscription(action)) {
            const subscriptionValid = this.validateLenderSubscription(user);
            if (!subscriptionValid.allowed) {
                return subscriptionValid;
            }
        }

        // ENFORCE: Borrower rating requirements
        if (userRole === 'BORROWER' && this.requiresGoodRating(action)) {
            if (user.rating < 3.0) {
                return {
                    allowed: false,
                    reason: 'Minimum rating of 3.0 required for this action',
                    code: 'RATING_TOO_LOW'
                };
            }
            
            if (user.blacklisted) {
                return {
                    allowed: false,
                    reason: 'Blacklisted users cannot perform this action',
                    code: 'BLACKLISTED'
                };
            }
        }

        // ENFORCE: Maximum groups for borrowers
        if (userRole === 'BORROWER' && action === 'JOIN_GROUP') {
            const userGroups = this.getUserGroups(userId);
            if (userGroups.length >= 4 && user.rating < 4.0) {
                return {
                    allowed: false,
                    reason: 'Maximum of 4 groups reached. Requires rating of 4.0+',
                    code: 'MAX_GROUPS_REACHED'
                };
            }
        }

        // Check permission matrix
        const permission = this.permissionMatrix[action];
        if (!permission) {
            return {
                allowed: false,
                reason: 'Permission not defined for this action',
                code: 'PERMISSION_UNDEFINED'
            };
        }

        const allowed = permission[userRole] || false;

        return {
            allowed: allowed,
            reason: allowed ? 'Permission granted' : `Role ${userRole} cannot ${action}`,
            code: allowed ? 'GRANTED' : 'ROLE_RESTRICTED',
            role: userRole,
            groupState: group.state
        };
    }

    /**
     * Check group state restrictions for action
     * @param {string} groupState - Current group state
     * @param {string} action - Action to check
     * @param {string} userRole - User role
     * @returns {boolean} True if restricted
     */
    checkGroupStateRestrictions(groupState, action, userRole) {
        const stateRules = {
            'CREATED': {
                restrictedActions: [
                    'REQUEST_LOAN', 'CREATE_LOAN_OFFER', 'APPROVE_LOAN_REQUEST',
                    'JOIN_GROUP', 'INVITE_MEMBERS'
                ],
                allowedRoles: ['ADMIN']
            },
            'ACTIVE': {
                restrictedActions: [], // All allowed
                allowedRoles: ['ADMIN', 'LENDER', 'BORROWER']
            },
            'LOCKED': {
                restrictedActions: [
                    'REQUEST_LOAN', 'CREATE_LOAN_OFFER', 'APPROVE_LOAN_REQUEST',
                    'JOIN_GROUP', 'INVITE_MEMBERS', 'CREATE_GROUP'
                ],
                allowedRoles: ['ADMIN', 'LENDER', 'BORROWER']
            },
            'SUSPENDED': {
                restrictedActions: 'ALL', // All actions restricted
                allowedRoles: ['ADMIN'] // Only admin can view
            },
            'ARCHIVED': {
                restrictedActions: 'ALL',
                allowedRoles: ['ADMIN'],
                readOnly: true
            }
        };

        const rules = stateRules[groupState];
        if (!rules) return true; // Restrict if state unknown

        // Check if all actions restricted
        if (rules.restrictedActions === 'ALL') {
            // Only admin can view archived/suspended groups
            return userRole !== 'ADMIN' || action !== 'VIEW_GROUP_DASHBOARD';
        }

        // Check if action is restricted for this state
        return rules.restrictedActions.includes(action);
    }

    /**
     * Check if action requires subscription
     * @param {string} action - Action to check
     * @returns {boolean} True if requires subscription
     */
    requiresSubscription(action) {
        const subscriptionRequired = [
            'CREATE_LOAN_OFFER',
            'APPROVE_LOAN_REQUEST',
            'CREATE_LEDGER',
            'UPDATE_LEDGER',
            'BLACKLIST_USER',
            'RATE_BORROWER'
        ];
        
        return subscriptionRequired.includes(action);
    }

    /**
     * Check if action requires good rating
     * @param {string} action - Action to check
     * @returns {boolean} True if requires good rating
     */
    requiresGoodRating(action) {
        const ratingRequired = [
            'REQUEST_LOAN',
            'JOIN_GROUP',
            'RATE_LENDER'
        ];
        
        return ratingRequired.includes(action);
    }

    /**
     * Validate lender subscription
     * @param {object} user - User object
     * @returns {object} Validation result
     */
    validateLenderSubscription(user) {
        if (!user.subscription) {
            return {
                allowed: false,
                reason: 'Subscription required for lending actions',
                code: 'NO_SUBSCRIPTION'
            };
        }

        if (user.subscription.status !== 'ACTIVE') {
            return {
                allowed: false,
                reason: 'Subscription must be active',
                code: 'SUBSCRIPTION_INACTIVE'
            };
        }

        // Check 28th expiry rule
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const expiryDay = Math.min(28, lastDayOfMonth);
        
        const expiryThisMonth = new Date(currentYear, currentMonth, expiryDay);
        
        if (today > expiryThisMonth) {
            return {
                allowed: false,
                reason: 'Subscription expired on 28th of month',
                code: 'SUBSCRIPTION_EXPIRED'
            };
        }

        return {
            allowed: true,
            reason: 'Subscription valid',
            code: 'SUBSCRIPTION_VALID'
        };
    }

    /**
     * Get user permissions for group
     * @param {string} userId - User ID
     * @param {string} groupId - Group ID
     * @returns {object} All permissions for user in group
     */
    getUserPermissions(userId, groupId) {
        const permissions = {};
        const user = this.getUser(userId);
        const group = this.getGroup(groupId);
        
        if (!user || !group) return permissions;
        
        const membership = group.members.find(m => m.userId === userId);
        if (!membership) return permissions;
        
        // Check each permission
        Object.keys(this.permissionMatrix).forEach(action => {
            const result = this.checkPermission(userId, groupId, action);
            permissions[action] = result.allowed;
        });
        
        return permissions;
    }

    /**
     * Get bulk permissions for multiple actions
     * @param {string} userId - User ID
     * @param {string} groupId - Group ID
     * @param {Array} actions - Actions to check
     * @returns {object} Permission results
     */
    getBulkPermissions(userId, groupId, actions) {
        const results = {};
        
        actions.forEach(action => {
            results[action] = this.checkPermission(userId, groupId, action);
        });
        
        return results;
    }

    /**
     * Get permission matrix for role
     * @param {string} role - User role
     * @returns {object} Permissions for role
     */
    getPermissionsForRole(role) {
        const permissions = {};
        
        Object.keys(this.permissionMatrix).forEach(action => {
            const matrix = this.permissionMatrix[action];
            permissions[action] = matrix[role] || false;
        });
        
        return permissions;
    }

    /**
     * Get user object (helper)
     * @param {string} userId - User ID
     * @returns {object} User object
     */
    getUser(userId) {
        const usersStr = localStorage.getItem('mpesewa_users');
        const users = usersStr ? JSON.parse(usersStr) : [];
        return users.find(u => u.id === userId);
    }

    /**
     * Get group object (helper)
     * @param {string} groupId - Group ID
     * @returns {object} Group object
     */
    getGroup(groupId) {
        const groupsStr = localStorage.getItem('mpesewa_groups');
        const groups = groupsStr ? JSON.parse(groupsStr) : [];
        return groups.find(g => g.id === groupId);
    }

    /**
     * Get user's groups (helper)
     * @param {string} userId - User ID
     * @returns {Array} User's groups
     */
    getUserGroups(userId) {
        const groups = this.getAllGroups();
        return groups.filter(group => 
            group.members.some(member => member.userId === userId)
        );
    }

    /**
     * Get all groups (helper)
     * @returns {Array} All groups
     */
    getAllGroups() {
        const groupsStr = localStorage.getItem('mpesewa_groups');
        return groupsStr ? JSON.parse(groupsStr) : [];
    }

    /**
     * Get role hierarchy
     * @returns {object} Role hierarchy
     */
    getRoleHierarchy() {
        return {
            ADMIN: 3, // Highest
            LENDER: 2,
            BORROWER: 1,
            GUEST: 0  // Lowest
        };
    }

    /**
     * Check if role can manage another role
     * @param {string} managerRole - Manager role
     * @param {string} targetRole - Target role
     * @returns {boolean} True if can manage
     */
    canManageRole(managerRole, targetRole) {
        const hierarchy = this.getRoleHierarchy();
        return hierarchy[managerRole] > hierarchy[targetRole];
    }

    /**
     * Get actions requiring admin approval
     * @returns {Array} Actions requiring admin approval
     */
    getAdminApprovalActions() {
        return [
            'REMOVE_BLACKLIST',
            'CHANGE_GROUP_STATE',
            'DELETE_GROUP',
            'REMOVE_MEMBERS'
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroupPermissions;
}