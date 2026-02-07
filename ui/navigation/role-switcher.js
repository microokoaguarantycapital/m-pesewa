/**
 * M-PESEWA ROLE SWITCHER
 * Enforces strict role management and dual-role switching rules
 * Non-negotiable: Users can be both borrowers and lenders, but must switch contexts properly
 */

// ============================================================================
// 1️⃣ CONSTANTS & ROLE DEFINITIONS (STRICT HIERARCHY)
// ============================================================================

const ROLE_DEFINITIONS = Object.freeze({
    BORROWER: {
        id: 'borrower',
        name: 'Borrower',
        description: 'Requests emergency loans within trusted groups',
        icon: '💼',
        color: '#f37021', // Orange
        permissions: [
            'REQUEST_LOAN',
            'VIEW_ACTIVE_LOANS',
            'MAKE_REPAYMENT',
            'VIEW_CREDIT_RATING',
            'APPEAL_BLACKLIST',
            'JOIN_MULTIPLE_GROUPS'
        ],
        requirements: {
            subscription: false,
            groups_min: 1,
            groups_max: 4,
            rating_min: 0,
            blacklist_blocked: true
        },
        dashboards: ['borrower_dashboard', 'borrow_history', 'repayment_schedule']
    },
    
    LENDER: {
        id: 'lender',
        name: 'Lender',
        description: 'Provides loans within trusted groups with active subscription',
        icon: '🌱',
        color: '#28a745', // Green
        permissions: [
            'LEND_MONEY',
            'CREATE_LEDGER',
            'MANAGE_LEDGERS',
            'RATE_BORROWERS',
            'APPLY_BLACKLIST',
            'UPGRADE_SUBSCRIPTION'
        ],
        requirements: {
            subscription: true,
            subscription_active: true,
            groups_min: 1,
            groups_max: null,
            rating_min: null,
            blacklist_blocked: false
        },
        dashboards: ['lender_dashboard', 'lending_portfolio', 'ledger_management'],
        subscription_tiers: {
            BASIC: { max_weekly: 1500, monthly_fee: 50 },
            PREMIUM: { max_weekly: 5000, monthly_fee: 250 },
            SUPER: { max_weekly: 20000, monthly_fee: 1000 },
            LENDER_OF_LENDERS: { max_weekly: 50000, monthly_fee: 500 }
        }
    },
    
    GROUP_ADMIN: {
        id: 'group_admin',
        name: 'Group Administrator',
        description: 'Manages group members, invitations, and settings',
        icon: '👥',
        color: '#0099ff', // Blue
        permissions: [
            'INVITE_TO_GROUP',
            'MANAGE_GROUP_SETTINGS',
            'REMOVE_GROUP_MEMBER',
            'VIEW_GROUP_REPORTS',
            'MODERATE_DISPUTES'
        ],
        requirements: {
            subscription: false,
            is_founder: true,
            groups_min: 1,
            groups_max: 1
        },
        dashboards: ['group_admin_dashboard', 'member_management', 'group_reports']
    },
    
    PLATFORM_ADMIN: {
        id: 'platform_admin',
        name: 'Platform Administrator',
        description: 'Manages platform-wide operations and overrides',
        icon: '🖥️',
        color: '#003366', // Deep Blue
        permissions: [
            'OVERRIDE_BLACKLIST',
            'MANAGE_ALL_COUNTRIES',
            'VIEW_SYSTEM_AUDIT',
            'MANAGE_PLATFORM_ADMINS',
            'EXPORT_ALL_DATA'
        ],
        requirements: {
            subscription: false,
            super_user: true,
            requires_2fa: true
        },
        dashboards: ['platform_admin_dashboard', 'system_health', 'audit_logs']
    }
});

// ============================================================================
// 2️⃣ ROLE SWITCHING BUSINESS RULES (NON-NEGOTIABLE)
// ============================================================================

const ROLE_SWITCHING_RULES = Object.freeze({
    // Rule 1: Cannot switch roles within same transaction/loan
    NO_SWITCH_DURING_ACTIVE_LOAN: {
        code: 'RS001',
        description: 'Cannot switch roles while having active loans in current role',
        check: (currentRole, targetRole, userData, activeLoans) => {
            if (currentRole === 'lender' && targetRole === 'borrower') {
                // Lender cannot become borrower if they have active lending
                const hasActiveLending = activeLoans?.lending?.some(loan => loan.status === 'active');
                return !hasActiveLending;
            }
            
            if (currentRole === 'borrower' && targetRole === 'lender') {
                // Borrower cannot become lender if they have active borrowing
                const hasActiveBorrowing = activeLoans?.borrowing?.some(loan => loan.status === 'active');
                return !hasActiveBorrowing;
            }
            
            return true;
        },
        errorMessage: 'Cannot switch roles while having active loans in current role'
    },
    
    // Rule 2: Lenders must have active subscription
    LENDER_SUBSCRIPTION_REQUIRED: {
        code: 'RS002',
        description: 'Lender role requires active subscription',
        check: (targetRole, subscription) => {
            if (targetRole === 'lender') {
                return subscription?.status === 'active' && subscription?.expiry_date > new Date();
            }
            return true;
        },
        errorMessage: 'Lender role requires active subscription'
    },
    
    // Rule 3: Blacklisted users cannot be lenders
    BLACKLISTED_CANNOT_LEND: {
        code: 'RS003',
        description: 'Blacklisted users cannot switch to lender role',
        check: (targetRole, userStatus) => {
            if (targetRole === 'lender') {
                return !userStatus?.is_blacklisted;
            }
            return true;
        },
        errorMessage: 'Blacklisted users cannot become lenders'
    },
    
    // Rule 4: Rating requirements for multiple groups as borrower
    BORROWER_RATING_FOR_MULTIPLE_GROUPS: {
        code: 'RS004',
        description: 'Borrowers need good rating to join more than 2 groups',
        check: (targetRole, userRating, currentGroups) => {
            if (targetRole === 'borrower' && currentGroups.length >= 2) {
                return userRating >= 3.5; // 3.5 star minimum
            }
            return true;
        },
        errorMessage: 'Need minimum 3.5 rating to join additional groups as borrower'
    },
    
    // Rule 5: Group admin can only be founder
    GROUP_ADMIN_MUST_BE_FOUNDER: {
        code: 'RS005',
        description: 'Group admin role can only be assigned to group founder',
        check: (targetRole, groupMembership) => {
            if (targetRole === 'group_admin') {
                return groupMembership?.is_founder === true;
            }
            return true;
        },
        errorMessage: 'Only group founder can be group administrator'
    },
    
    // Rule 6: Platform admin requires 2FA
    PLATFORM_ADMIN_REQUIRES_2FA: {
        code: 'RS006',
        description: 'Platform admin role requires two-factor authentication',
        check: (targetRole, securitySettings) => {
            if (targetRole === 'platform_admin') {
                return securitySettings?.two_factor_enabled === true;
            }
            return true;
        },
        errorMessage: 'Platform admin role requires two-factor authentication'
    },
    
    // Rule 7: Cannot switch while in dispute
    NO_SWITCH_DURING_DISPUTE: {
        code: 'RS007',
        description: 'Cannot switch roles while involved in active disputes',
        check: (currentRole, targetRole, activeDisputes) => {
            const hasActiveDisputes = activeDisputes?.some(dispute => dispute.status === 'active');
            return !hasActiveDisputes;
        },
        errorMessage: 'Cannot switch roles while involved in active disputes'
    },
    
    // Rule 8: Minimum time between role switches
    SWITCH_COOLDOWN: {
        code: 'RS008',
        description: 'Minimum 1 hour between role switches',
        check: (lastSwitchTime) => {
            if (!lastSwitchTime) return true;
            
            const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
            const timeSinceLastSwitch = Date.now() - new Date(lastSwitchTime).getTime();
            
            return timeSinceLastSwitch >= oneHour;
        },
        errorMessage: 'Please wait at least 1 hour before switching roles again'
    },
    
    // Rule 9: Subscription expiry check
    SUBSCRIPTION_EXPIRY_BLOCK: {
        code: 'RS009',
        description: 'Cannot switch to lender if subscription expires today or is expired',
        check: (targetRole, subscription) => {
            if (targetRole !== 'lender') return true;
            
            if (!subscription) return false;
            
            const today = new Date();
            const expiryDate = new Date(subscription.expiry_date);
            
            // Check if subscription expires today or has expired
            const isExpiringToday = expiryDate.toDateString() === today.toDateString();
            const isExpired = expiryDate < today;
            
            return !(isExpiringToday || isExpired);
        },
        errorMessage: 'Subscription expired or expiring today. Please renew to switch to lender role'
    },
    
    // Rule 10: Country-specific role restrictions
    COUNTRY_ROLE_RESTRICTIONS: {
        code: 'RS010',
        description: 'Certain countries may have role restrictions',
        check: (targetRole, country, userCountry) => {
            // Ensure user is switching within their country
            if (country !== userCountry) {
                return false;
            }
            
            // Country-specific restrictions (example: DRC might have different rules)
            const restrictedCountries = {
                'SO': ['lender'], // Somalia might restrict lender role
                'SS': ['platform_admin'] // South Sudan might restrict platform admin
            };
            
            const restrictions = restrictedCountries[country];
            if (restrictions && restrictions.includes(targetRole)) {
                return false;
            }
            
            return true;
        },
        errorMessage: 'This role is restricted in your country'
    }
});

// ============================================================================
// 3️⃣ ROLE SWITCHER CORE CLASS
// ============================================================================

class MpesewaRoleSwitcher {
    constructor(userData, navigationState, permissionChecker) {
        this.userData = userData;
        this.navigationState = navigationState;
        this.permissionChecker = permissionChecker;
        
        this._currentRole = null;
        this._availableRoles = [];
        this._switchHistory = [];
        this._validationErrors = [];
        this._switchCooldowns = new Map();
        
        this._initialize();
    }
    
    // ============================================================================
    // 3.1 Initialization
    // ============================================================================
    
    _initialize() {
        if (!this.userData) {
            throw new Error('User data required for role switcher initialization');
        }
        
        // Set current role from user data
        if (this.userData.roles && this.userData.roles.length > 0) {
            this._currentRole = this.userData.roles[0];
        }
        
        // Determine available roles based on user data
        this._availableRoles = this._determineAvailableRoles();
        
        // Load switch history from localStorage
        this._loadSwitchHistory();
        
        this._log('Role switcher initialized', {
            userId: this.userData.id,
            currentRole: this._currentRole,
            availableRoles: this._availableRoles
        });
    }
    
    _determineAvailableRoles() {
        const availableRoles = [];
        
        // All users can be borrowers (no subscription required)
        availableRoles.push({
            ...ROLE_DEFINITIONS.BORROWER,
            can_switch: this._canSwitchToRole('borrower')
        });
        
        // Check if user can be lender
        const canBeLender = this._canSwitchToRole('lender');
        if (canBeLender.allowed) {
            availableRoles.push({
                ...ROLE_DEFINITIONS.LENDER,
                can_switch: canBeLender
            });
        }
        
        // Check if user can be group admin
        const canBeGroupAdmin = this._canSwitchToRole('group_admin');
        if (canBeGroupAdmin.allowed) {
            availableRoles.push({
                ...ROLE_DEFINITIONS.GROUP_ADMIN,
                can_switch: canBeGroupAdmin
            });
        }
        
        // Check if user can be platform admin
        const canBePlatformAdmin = this._canSwitchToRole('platform_admin');
        if (canBePlatformAdmin.allowed) {
            availableRoles.push({
                ...ROLE_DEFINITIONS.PLATFORM_ADMIN,
                can_switch: canBePlatformAdmin
            });
        }
        
        return availableRoles;
    }
    
    // ============================================================================
    // 3.2 Role Switching Core Logic
    // ============================================================================
    
    async switchToRole(targetRole, options = {}) {
        const startTime = Date.now();
        
        try {
            this._validationErrors = [];
            
            // Step 1: Validate target role
            if (!ROLE_DEFINITIONS[targetRole.toUpperCase()]) {
                throw new RoleSwitchError(`Invalid role: ${targetRole}`);
            }
            
            // Step 2: Check if already in target role
            if (this._currentRole === targetRole) {
                return {
                    success: true,
                    message: `Already in ${targetRole} role`,
                    role: targetRole,
                    is_switch: false
                };
            }
            
            // Step 3: Validate switch is allowed
            const validationResult = await this.validateRoleSwitch(targetRole, options);
            
            if (!validationResult.allowed) {
                throw new RoleSwitchError(
                    `Role switch not allowed: ${validationResult.reason}`,
                    validationResult.rule,
                    validationResult.details
                );
            }
            
            // Step 4: Perform pre-switch actions
            await this._performPreSwitchActions(this._currentRole, targetRole);
            
            // Step 5: Update current role
            const previousRole = this._currentRole;
            this._currentRole = targetRole;
            
            // Step 6: Update user data roles
            if (this.userData.roles && !this.userData.roles.includes(targetRole)) {
                this.userData.roles.push(targetRole);
            }
            
            // Step 7: Record switch in history
            const switchRecord = this._recordRoleSwitch(previousRole, targetRole, options);
            
            // Step 8: Update navigation state
            if (this.navigationState) {
                this.navigationState.switchRole(targetRole);
            }
            
            // Step 9: Perform post-switch actions
            await this._performPostSwitchActions(previousRole, targetRole);
            
            // Step 10: Update available roles
            this._availableRoles = this._determineAvailableRoles();
            
            const switchTime = Date.now() - startTime;
            
            this._log('Role switch completed', {
                from: previousRole,
                to: targetRole,
                duration: switchTime,
                userId: this.userData.id
            });
            
            return {
                success: true,
                previous_role: previousRole,
                new_role: targetRole,
                switch_record: switchRecord,
                available_roles: this._availableRoles,
                duration_ms: switchTime
            };
            
        } catch (error) {
            this._log('Role switch failed', {
                from: this._currentRole,
                to: targetRole,
                error: error.message,
                userId: this.userData.id
            });
            
            return {
                success: false,
                error: error.message,
                validation_errors: this._validationErrors,
                attempted_role: targetRole
            };
        }
    }
    
    // ============================================================================
    // 3.3 Role Switch Validation
    // ============================================================================
    
    async validateRoleSwitch(targetRole, options = {}) {
        const validationResults = {
            allowed: true,
            failed_rules: [],
            passed_rules: [],
            reason: null,
            rule: null
        };
        
        // Get user context for validation
        const userContext = {
            currentRole: this._currentRole,
            targetRole: targetRole,
            userData: this.userData,
            subscription: this.userData.subscription,
            rating: this.userData.rating || 0,
            groups: this.userData.groups || [],
            is_blacklisted: this.userData.is_blacklisted || false,
            security_settings: this.userData.security_settings || {},
            country: this.userData.country,
            active_loans: options.activeLoans || { lending: [], borrowing: [] },
            active_disputes: options.activeDisputes || [],
            last_switch_time: this._getLastSwitchTime()
        };
        
        // Apply all business rules
        Object.keys(ROLE_SWITCHING_RULES).forEach(ruleKey => {
            const rule = ROLE_SWITCHING_RULES[ruleKey];
            
            try {
                const checkResult = rule.check(
                    userContext.currentRole,
                    userContext.targetRole,
                    userContext.userData,
                    userContext.active_loans,
                    userContext.active_disputes,
                    userContext.last_switch_time,
                    userContext.subscription,
                    userContext.rating,
                    userContext.groups,
                    userContext.is_blacklisted,
                    userContext.security_settings,
                    userContext.country
                );
                
                if (!checkResult) {
                    validationResults.allowed = false;
                    validationResults.failed_rules.push({
                        rule: rule.code,
                        description: rule.description,
                        error_message: rule.errorMessage
                    });
                    
                    if (!validationResults.reason) {
                        validationResults.reason = rule.errorMessage;
                        validationResults.rule = rule.code;
                    }
                } else {
                    validationResults.passed_rules.push({
                        rule: rule.code,
                        description: rule.description
                    });
                }
            } catch (error) {
                console.error(`Error checking rule ${rule.code}:`, error);
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: rule.code,
                    description: rule.description,
                    error: error.message,
                    error_message: 'Rule check failed'
                });
            }
        });
        
        // Additional validation based on role requirements
        const roleRequirements = ROLE_DEFINITIONS[targetRole.toUpperCase()]?.requirements;
        
        if (roleRequirements) {
            // Check subscription requirement for lender
            if (roleRequirements.subscription && !userContext.subscription?.status === 'active') {
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: 'ROLE_REQUIREMENT',
                    description: `${targetRole} role requires active subscription`,
                    error_message: `${targetRole} role requires active subscription`
                });
            }
            
            // Check group requirements
            if (roleRequirements.groups_min && userContext.groups.length < roleRequirements.groups_min) {
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: 'GROUP_REQUIREMENT',
                    description: `${targetRole} role requires minimum ${roleRequirements.groups_min} group(s)`,
                    error_message: `Must be in at least ${roleRequirements.groups_min} group(s) to be ${targetRole}`
                });
            }
            
            // Check blacklist restriction
            if (roleRequirements.blacklist_blocked && userContext.is_blacklisted) {
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: 'BLACKLIST_RESTRICTION',
                    description: 'Blacklisted users cannot access this role',
                    error_message: 'Blacklisted users cannot access this role'
                });
            }
        }
        
        // Check permission system
        if (this.permissionChecker) {
            const canSwitch = this.permissionChecker.canPerform('switch', 'role', {
                from_role: userContext.currentRole,
                to_role: targetRole
            });
            
            if (!canSwitch.allowed) {
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: 'PERMISSION_DENIED',
                    description: 'Permission system denied role switch',
                    error_message: canSwitch.reason || 'Permission denied'
                });
            }
        }
        
        return validationResults;
    }
    
    // ============================================================================
    // 3.4 Pre and Post Switch Actions
    // ============================================================================
    
    async _performPreSwitchActions(fromRole, toRole) {
        this._log('Performing pre-switch actions', { from: fromRole, to: toRole });
        
        // Clear any cached data from previous role
        if (fromRole === 'lender') {
            await this._clearLenderCache();
        } else if (fromRole === 'borrower') {
            await this._clearBorrowerCache();
        }
        
        // Set switch cooldown
        this._setSwitchCooldown(fromRole, toRole);
        
        // Notify any active sessions
        await this._notifySessionsAboutRoleChange(fromRole, toRole);
        
        // Save current state before switch
        await this._saveRoleState(fromRole);
    }
    
    async _performPostSwitchActions(fromRole, toRole) {
        this._log('Performing post-switch actions', { from: fromRole, to: toRole });
        
        // Load dashboard for new role
        await this._loadRoleDashboard(toRole);
        
        // Update UI components
        await this._updateUIForRole(toRole);
        
        // Send notification about role change
        await this._sendRoleChangeNotification(fromRole, toRole);
        
        // Log security event
        await this._logSecurityEvent('ROLE_SWITCH', {
            user_id: this.userData.id,
            from_role: fromRole,
            to_role: toRole,
            timestamp: new Date().toISOString()
        });
        
        // Persist role change
        await this._persistRoleChange(toRole);
    }
    
    async _clearLenderCache() {
        // Clear lender-specific cached data
        if (window.localStorage) {
            localStorage.removeItem('mpesewa_lender_portfolio');
            localStorage.removeItem('mpesewa_active_ledgers');
            localStorage.removeItem('mpesewa_lending_history');
        }
    }
    
    async _clearBorrowerCache() {
        // Clear borrower-specific cached data
        if (window.localStorage) {
            localStorage.removeItem('mpesewa_active_loans');
            localStorage.removeItem('mpesewa_repayment_schedule');
            localStorage.removeItem('mpesewa_borrow_history');
        }
    }
    
    async _loadRoleDashboard(role) {
        // Load appropriate dashboard for role
        const dashboardConfig = ROLE_DEFINITIONS[role.toUpperCase()]?.dashboards;
        
        if (dashboardConfig && dashboardConfig.length > 0) {
            // Emit event for dashboard controller to handle
            const event = new CustomEvent('mpesewa:role-dashboard-load', {
                detail: {
                    role: role,
                    dashboards: dashboardConfig,
                    userId: this.userData.id
                }
            });
            window.dispatchEvent(event);
        }
    }
    
    async _updateUIForRole(role) {
        // Update UI elements based on role
        const roleConfig = ROLE_DEFINITIONS[role.toUpperCase()];
        
        if (roleConfig) {
            // Update theme color
            document.documentElement.style.setProperty('--role-color', roleConfig.color);
            
            // Update role indicator in UI
            const roleIndicator = document.getElementById('role-indicator');
            if (roleIndicator) {
                roleIndicator.innerHTML = `
                    <span class="role-icon">${roleConfig.icon}</span>
                    <span class="role-name">${roleConfig.name}</span>
                `;
                roleIndicator.style.color = roleConfig.color;
            }
            
            // Emit UI update event
            const event = new CustomEvent('mpesewa:ui-role-update', {
                detail: {
                    role: role,
                    config: roleConfig,
                    user: this.userData
                }
            });
            window.dispatchEvent(event);
        }
    }
    
    // ============================================================================
    // 3.5 History and State Management
    // ============================================================================
    
    _recordRoleSwitch(fromRole, toRole, options) {
        const switchRecord = {
            id: `switch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            from_role: fromRole,
            to_role: toRole,
            timestamp: new Date().toISOString(),
            user_id: this.userData.id,
            country: this.userData.country,
            group: this.navigationState?.currentGroup?.id,
            ip_address: options.ipAddress || 'unknown',
            user_agent: navigator.userAgent,
            metadata: options.metadata || {}
        };
        
        this._switchHistory.unshift(switchRecord);
        
        // Keep only last 50 switches
        if (this._switchHistory.length > 50) {
            this._switchHistory.pop();
        }
        
        // Save to localStorage
        this._saveSwitchHistory();
        
        return switchRecord;
    }
    
    _getLastSwitchTime() {
        if (this._switchHistory.length === 0) return null;
        
        const lastSwitch = this._switchHistory[0];
        return lastSwitch.timestamp;
    }
    
    _loadSwitchHistory() {
        try {
            if (window.localStorage) {
                const savedHistory = localStorage.getItem('mpesewa_role_switch_history');
                if (savedHistory) {
                    this._switchHistory = JSON.parse(savedHistory);
                }
            }
        } catch (error) {
            console.warn('Failed to load switch history:', error);
        }
    }
    
    _saveSwitchHistory() {
        try {
            if (window.localStorage) {
                localStorage.setItem(
                    'mpesewa_role_switch_history',
                    JSON.stringify(this._switchHistory)
                );
            }
        } catch (error) {
            console.warn('Failed to save switch history:', error);
        }
    }
    
    _setSwitchCooldown(fromRole, toRole) {
        const cooldownKey = `${fromRole}_${toRole}`;
        const cooldownDuration = 60 * 60 * 1000; // 1 hour
        
        this._switchCooldowns.set(cooldownKey, {
            timestamp: Date.now(),
            expires: Date.now() + cooldownDuration
        });
    }
    
    _checkSwitchCooldown(fromRole, toRole) {
        const cooldownKey = `${fromRole}_${toRole}`;
        const cooldown = this._switchCooldowns.get(cooldownKey);
        
        if (!cooldown) return true;
        
        return Date.now() > cooldown.expires;
    }
    
    // ============================================================================
    // 3.6 Utility Methods
    // ============================================================================
    
    _canSwitchToRole(targetRole) {
        const validation = {
            allowed: true,
            reasons: [],
            requirements: []
        };
        
        // Basic validation
        if (!ROLE_DEFINITIONS[targetRole.toUpperCase()]) {
            validation.allowed = false;
            validation.reasons.push(`Invalid role: ${targetRole}`);
            return validation;
        }
        
        // Check if user already has this role
        if (this.userData.roles && this.userData.roles.includes(targetRole)) {
            validation.allowed = true;
            validation.reasons.push('User already has this role');
            return validation;
        }
        
        // Get role requirements
        const roleRequirements = ROLE_DEFINITIONS[targetRole.toUpperCase()]?.requirements;
        
        if (roleRequirements) {
            // Check subscription requirement
            if (roleRequirements.subscription && !this.userData.subscription?.status === 'active') {
                validation.allowed = false;
                validation.reasons.push('Active subscription required');
                validation.requirements.push('Active subscription');
            }
            
            // Check group requirements
            if (roleRequirements.groups_min) {
                const userGroups = this.userData.groups || [];
                if (userGroups.length < roleRequirements.groups_min) {
                    validation.allowed = false;
                    validation.reasons.push(`Need at least ${roleRequirements.groups_min} group(s)`);
                    validation.requirements.push(`Minimum ${roleRequirements.groups_min} group(s)`);
                }
            }
            
            // Check founder requirement for group admin
            if (roleRequirements.is_founder && !this.userData.is_group_founder) {
                validation.allowed = false;
                validation.reasons.push('Must be group founder');
                validation.requirements.push('Group founder status');
            }
            
            // Check blacklist restriction
            if (roleRequirements.blacklist_blocked && this.userData.is_blacklisted) {
                validation.allowed = false;
                validation.reasons.push('Blacklisted users cannot access this role');
                validation.requirements.push('Not blacklisted');
            }
        }
        
        return validation;
    }
    
    _log(message, data = {}) {
        console.log(`[M-Pesewa Role Switcher] ${message}`, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }
    
    async _saveRoleState(role) {
        // Save role-specific state
        try {
            if (window.localStorage) {
                const stateKey = `mpesewa_role_state_${role}`;
                const state = {
                    last_accessed: new Date().toISOString(),
                    user_id: this.userData.id
                };
                
                localStorage.setItem(stateKey, JSON.stringify(state));
            }
        } catch (error) {
            console.warn('Failed to save role state:', error);
        }
    }
    
    async _persistRoleChange(role) {
        // Persist role change to backend
        try {
            // This would typically be an API call
            const response = await fetch('/api/user/update-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.userData.token}`
                },
                body: JSON.stringify({
                    user_id: this.userData.id,
                    new_role: role,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to persist role change');
            }
            
            return await response.json();
        } catch (error) {
            console.warn('Failed to persist role change:', error);
            // Continue anyway - role change is already reflected locally
        }
    }
    
    async _notifySessionsAboutRoleChange(fromRole, toRole) {
        // Notify other active sessions about role change
        if (window.BroadcastChannel) {
            try {
                const channel = new BroadcastChannel('mpesewa_role_changes');
                channel.postMessage({
                    type: 'ROLE_CHANGED',
                    user_id: this.userData.id,
                    from_role: fromRole,
                    to_role: toRole,
                    timestamp: new Date().toISOString()
                });
                channel.close();
            } catch (error) {
                console.warn('Failed to notify sessions:', error);
            }
        }
    }
    
    async _sendRoleChangeNotification(fromRole, toRole) {
        // Send notification to user about role change
        try {
            const notificationEvent = new CustomEvent('mpesewa:notification', {
                detail: {
                    type: 'role_change',
                    title: 'Role Changed',
                    message: `Your role has been changed from ${fromRole} to ${toRole}`,
                    icon: ROLE_DEFINITIONS[toRole.toUpperCase()]?.icon,
                    color: ROLE_DEFINITIONS[toRole.toUpperCase()]?.color,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(notificationEvent);
        } catch (error) {
            console.warn('Failed to send notification:', error);
        }
    }
    
    async _logSecurityEvent(eventType, data) {
        // Log security event
        try {
            const securityEvent = new CustomEvent('mpesewa:security-event', {
                detail: {
                    event_type: eventType,
                    ...data,
                    severity: 'medium',
                    source: 'role_switcher'
                }
            });
            window.dispatchEvent(securityEvent);
        } catch (error) {
            console.warn('Failed to log security event:', error);
        }
    }
    
    // ============================================================================
    // 3.7 Public API Methods
    // ============================================================================
    
    getCurrentRole() {
        return this._currentRole;
    }
    
    getCurrentRoleConfig() {
        if (!this._currentRole) return null;
        return ROLE_DEFINITIONS[this._currentRole.toUpperCase()];
    }
    
    getAvailableRoles() {
        return this._availableRoles;
    }
    
    getSwitchHistory(limit = 10) {
        return this._switchHistory.slice(0, limit);
    }
    
    getRoleRequirements(role) {
        const roleDef = ROLE_DEFINITIONS[role.toUpperCase()];
        if (!roleDef) return null;
        
        return {
            role: roleDef,
            requirements: roleDef.requirements,
            can_switch: this._canSwitchToRole(role)
        };
    }
    
    canAccessDashboard(dashboardName) {
        if (!this._currentRole) return false;
        
        const roleConfig = ROLE_DEFINITIONS[this._currentRole.toUpperCase()];
        if (!roleConfig || !roleConfig.dashboards) return false;
        
        return roleConfig.dashboards.includes(dashboardName);
    }
    
    getDashboardUrl() {
        if (!this._currentRole) return '/dashboard';
        
        const roleConfig = ROLE_DEFINITIONS[this._currentRole.toUpperCase()];
        if (!roleConfig || !roleConfig.dashboards) return '/dashboard';
        
        const defaultDashboard = roleConfig.dashboards[0];
        return `/${this._currentRole}/${defaultDashboard}`;
    }
    
    // ============================================================================
    // 3.8 Static Methods
    // ============================================================================
    
    static get ROLE_DEFINITIONS() {
        return ROLE_DEFINITIONS;
    }
    
    static get ROLE_SWITCHING_RULES() {
        return ROLE_SWITCHING_RULES;
    }
    
    static createForUser(userData, navigationState = null, permissionChecker = null) {
        return new MpesewaRoleSwitcher(userData, navigationState, permissionChecker);
    }
}

// ============================================================================
// 4️⃣ ERROR CLASSES
// ============================================================================

class RoleSwitchError extends Error {
    constructor(message, rule = null, details = null) {
        super(message);
        this.name = 'RoleSwitchError';
        this.rule = rule;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
    
    toJSON() {
        return {
            error: this.name,
            message: this.message,
            rule: this.rule,
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

// ============================================================================
// 5️⃣ ROLE SWITCHER UI COMPONENT
// ============================================================================

class MpesewaRoleSwitcherUI {
    constructor(roleSwitcher, containerSelector = '#role-switcher') {
        this.roleSwitcher = roleSwitcher;
        this.containerSelector = containerSelector;
        this.container = null;
        this._isOpen = false;
        this._eventListeners = new Map();
        
        this._initializeUI();
    }
    
    async _initializeUI() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        this.container = document.querySelector(this.containerSelector);
        
        if (!this.container) {
            console.warn(`Role switcher container not found: ${this.containerSelector}`);
            return;
        }
        
        this._render();
        this._attachEventListeners();
        this._setupEventHandlers();
    }
    
    _render() {
        const currentRole = this.roleSwitcher.getCurrentRole();
        const currentRoleConfig = this.roleSwitcher.getCurrentRoleConfig();
        const availableRoles = this.roleSwitcher.getAvailableRoles();
        
        this.container.innerHTML = `
            <div class="role-switcher-wrapper">
                <button class="role-switcher-toggle" id="role-switcher-toggle" 
                        aria-label="Switch role" aria-haspopup="true" aria-expanded="${this._isOpen}">
                    <span class="current-role-indicator">
                        <span class="role-icon">${currentRoleConfig?.icon || '👤'}</span>
                        <span class="role-name">${currentRoleConfig?.name || 'Select Role'}</span>
                        <span class="dropdown-arrow">▾</span>
                    </span>
                </button>
                
                <div class="role-switcher-dropdown" id="role-switcher-dropdown" 
                     aria-hidden="${!this._isOpen}" style="display: ${this._isOpen ? 'block' : 'none'}">
                    <div class="dropdown-header">
                        <h3>Switch Role</h3>
                        <p class="dropdown-subtitle">Choose a different role to access specific features</p>
                    </div>
                    
                    <div class="roles-list" id="roles-list">
                        ${this._renderRolesList(availableRoles)}
                    </div>
                    
                    <div class="dropdown-footer">
                        <div class="current-context">
                            <span class="context-label">Country:</span>
                            <span class="context-value">${this.roleSwitcher.userData?.country || 'KE'}</span>
                            <span class="context-label">Group:</span>
                            <span class="context-value">${this.roleSwitcher.navigationState?.currentGroup?.name || 'None'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    _renderRolesList(availableRoles) {
        if (!availableRoles || availableRoles.length === 0) {
            return '<div class="no-roles-message">No roles available</div>';
        }
        
        return availableRoles.map(role => {
            const isCurrent = role.id === this.roleSwitcher.getCurrentRole();
            const isAvailable = role.can_switch?.allowed !== false;
            const requirements = role.can_switch?.requirements || [];
            
            return `
                <div class="role-option ${isCurrent ? 'current' : ''} ${!isAvailable ? 'disabled' : ''}" 
                     data-role="${role.id}"
                     aria-disabled="${!isAvailable}">
                    <div class="role-option-content">
                        <span class="role-icon">${role.icon}</span>
                        <div class="role-info">
                            <h4 class="role-title">${role.name}</h4>
                            <p class="role-description">${role.description}</p>
                            
                            ${requirements.length > 0 ? `
                                <div class="role-requirements">
                                    <strong>Requirements:</strong>
                                    <ul>
                                        ${requirements.map(req => `<li>${req}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${!isAvailable && role.can_switch?.reasons ? `
                                <div class="role-unavailable">
                                    <strong>Not available:</strong>
                                    <ul>
                                        ${role.can_switch.reasons.map(reason => `<li>${reason}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${isCurrent ? `
                        <div class="role-status current">
                            <span class="status-badge">Current</span>
                        </div>
                    ` : isAvailable ? `
                        <button class="switch-role-btn" data-role="${role.id}" 
                                aria-label="Switch to ${role.name} role">
                            Switch
                        </button>
                    ` : `
                        <div class="role-status unavailable">
                            <span class="status-badge">Unavailable</span>
                        </div>
                    `}
                </div>
            `;
        }).join('');
    }
    
    _attachEventListeners() {
        // Toggle dropdown
        const toggleBtn = this.container.querySelector('#role-switcher-toggle');
        if (toggleBtn) {
            this._addEventListener(toggleBtn, 'click', (e) => {
                e.stopPropagation();
                this._toggleDropdown();
            });
        }
        
        // Switch role buttons
        const switchButtons = this.container.querySelectorAll('.switch-role-btn');
        switchButtons.forEach(button => {
            this._addEventListener(button, 'click', async (e) => {
                e.stopPropagation();
                const targetRole = button.getAttribute('data-role');
                await this._switchRole(targetRole);
            });
        });
        
        // Close dropdown when clicking outside
        this._addEventListener(document, 'click', (e) => {
            if (!this.container.contains(e.target) && this._isOpen) {
                this._closeDropdown();
            }
        });
        
        // Handle escape key
        this._addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this._isOpen) {
                this._closeDropdown();
            }
        });
    }
    
    _setupEventHandlers() {
        // Listen for role changes from other components
        this._addEventListener(window, 'mpesewa:role-changed', (e) => {
            this._updateUI();
        });
        
        // Listen for user data updates
        this._addEventListener(window, 'mpesewa:user-updated', (e) => {
            this.roleSwitcher.userData = e.detail.userData;
            this._updateUI();
        });
        
        // Listen for subscription updates
        this._addEventListener(window, 'mpesewa:subscription-updated', (e) => {
            if (this.roleSwitcher.userData) {
                this.roleSwitcher.userData.subscription = e.detail.subscription;
                this._updateUI();
            }
        });
    }
    
    async _switchRole(targetRole) {
        try {
            // Show loading state
            this._showLoading(targetRole);
            
            // Perform role switch
            const result = await this.roleSwitcher.switchToRole(targetRole);
            
            if (result.success) {
                // Show success message
                this._showSuccess(targetRole);
                
                // Update UI
                this._updateUI();
                
                // Close dropdown
                this._closeDropdown();
                
                // Navigate to appropriate dashboard
                setTimeout(() => {
                    const dashboardUrl = this.roleSwitcher.getDashboardUrl();
                    window.location.href = dashboardUrl;
                }, 1000);
            } else {
                // Show error message
                this._showError(targetRole, result.error);
            }
        } catch (error) {
            console.error('Role switch failed:', error);
            this._showError(targetRole, error.message);
        }
    }
    
    _showLoading(role) {
        const roleOption = this.container.querySelector(`[data-role="${role}"]`);
        if (roleOption) {
            const button = roleOption.querySelector('.switch-role-btn');
            if (button) {
                button.innerHTML = '<span class="loading-spinner"></span> Switching...';
                button.disabled = true;
            }
        }
    }
    
    _showSuccess(role) {
        // Show notification
        const notificationEvent = new CustomEvent('mpesewa:notification', {
            detail: {
                type: 'success',
                title: 'Role Switched',
                message: `Successfully switched to ${role} role`,
                duration: 3000
            }
        });
        window.dispatchEvent(notificationEvent);
    }
    
    _showError(role, errorMessage) {
        // Show notification
        const notificationEvent = new CustomEvent('mpesewa:notification', {
            detail: {
                type: 'error',
                title: 'Role Switch Failed',
                message: errorMessage,
                duration: 5000
            }
        });
        window.dispatchEvent(notificationEvent);
        
        // Reset button
        const roleOption = this.container.querySelector(`[data-role="${role}"]`);
        if (roleOption) {
            const button = roleOption.querySelector('.switch-role-btn');
            if (button) {
                button.innerHTML = 'Switch';
                button.disabled = false;
            }
        }
    }
    
    _toggleDropdown() {
        this._isOpen = !this._isOpen;
        
        const dropdown = this.container.querySelector('#role-switcher-dropdown');
        const toggle = this.container.querySelector('#role-switcher-toggle');
        
        if (dropdown) {
            dropdown.style.display = this._isOpen ? 'block' : 'none';
            dropdown.setAttribute('aria-hidden', !this._isOpen);
        }
        
        if (toggle) {
            toggle.setAttribute('aria-expanded', this._isOpen);
        }
        
        // Update dropdown position
        if (this._isOpen) {
            this._updateDropdownPosition();
        }
    }
    
    _closeDropdown() {
        this._isOpen = false;
        
        const dropdown = this.container.querySelector('#role-switcher-dropdown');
        const toggle = this.container.querySelector('#role-switcher-toggle');
        
        if (dropdown) {
            dropdown.style.display = 'none';
            dropdown.setAttribute('aria-hidden', true);
        }
        
        if (toggle) {
            toggle.setAttribute('aria-expanded', false);
        }
    }
    
    _updateDropdownPosition() {
        const dropdown = this.container.querySelector('#role-switcher-dropdown');
        if (!dropdown) return;
        
        const toggle = this.container.querySelector('#role-switcher-toggle');
        const toggleRect = toggle.getBoundingClientRect();
        
        // Position dropdown below toggle button
        dropdown.style.position = 'absolute';
        dropdown.style.top = `${toggleRect.bottom + window.scrollY + 5}px`;
        dropdown.style.left = `${toggleRect.left + window.scrollX}px`;
        dropdown.style.minWidth = `${toggleRect.width}px`;
    }
    
    _updateUI() {
        this._render();
        this._attachEventListeners();
    }
    
    _addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        const key = `${element.id || element.className}_${event}`;
        if (!this._eventListeners.has(key)) {
            this._eventListeners.set(key, []);
        }
        this._eventListeners.get(key).push(handler);
    }
    
    cleanup() {
        // Remove all event listeners
        this._eventListeners.forEach((handlers, key) => {
            const [elementId, event] = key.split('_');
            const element = document.getElementById(elementId) || 
                           document.querySelector(`.${elementId}`);
            if (element) {
                handlers.forEach(handler => {
                    element.removeEventListener(event, handler);
                });
            }
        });
        this._eventListeners.clear();
    }
}

// ============================================================================
// 6️⃣ EXPORTS
// ============================================================================

export {
    MpesewaRoleSwitcher,
    MpesewaRoleSwitcherUI,
    RoleSwitchError,
    ROLE_DEFINITIONS,
    ROLE_SWITCHING_RULES
};

// Default export
export default MpesewaRoleSwitcher;