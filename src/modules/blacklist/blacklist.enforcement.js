/**
 * M-PESEWA BLACKLIST ENFORCEMENT ENGINE
 * Enforces blacklist restrictions across the platform
 * Applies country-specific isolation rules
 */

class BlacklistEnforcement {
    constructor() {
        this.restrictions = new Map(); // userId -> restrictionSet
        this.blockedActions = new Map(); // userId -> blockedActions
        this.countryEnforcers = new Map(); // countryCode -> enforcerInstance
    }

    /**
     * Initialize enforcement engine
     */
    initialize() {
        console.log('🔒 Blacklist Enforcement Engine Initializing...');
        this.loadExistingRestrictions();
        this.setupEventListeners();
        console.log('✅ Blacklist Enforcement Engine Initialized');
    }

    /**
     * Load existing restrictions from storage
     */
    loadExistingRestrictions() {
        try {
            const storedRestrictions = localStorage.getItem('mpesewa_blacklist_restrictions');
            if (storedRestrictions) {
                const restrictions = JSON.parse(storedRestrictions);
                restrictions.forEach(restriction => {
                    this.restrictions.set(restriction.userId, restriction);
                });
            }
        } catch (error) {
            console.error('Error loading restrictions:', error);
        }
    }

    /**
     * Apply blacklist restrictions to user
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     */
    applyBlacklistRestrictions(userId, countryCode) {
        const restrictionSet = this.createRestrictionSet(userId, countryCode);
        
        // Store restrictions
        this.restrictions.set(userId, restrictionSet);
        
        // Apply UI restrictions immediately
        this.applyUIRestrictions(userId, restrictionSet);
        
        // Block platform actions
        this.blockPlatformActions(userId, restrictionSet);
        
        // Save to storage
        this.saveRestrictions();
        
        // Notify user and groups
        this.notifyRestrictionsApplied(userId, countryCode, restrictionSet);
        
        console.log(`🔒 Restrictions applied to user ${userId} in ${countryCode}`);
    }

    /**
     * Create restriction set for blacklisted user
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @returns {Object} - Restriction set
     */
    createRestrictionSet(userId, countryCode) {
        const now = new Date().toISOString();
        
        return {
            userId,
            countryCode,
            appliedAt: now,
            restrictions: {
                // Borrowing restrictions
                borrow: {
                    allowed: false,
                    maxAmount: 0,
                    maxGroups: 0,
                    message: 'Blacklisted users cannot borrow'
                },
                
                // Lending restrictions
                lend: {
                    allowed: false,
                    subscriptionBlocked: true,
                    ledgerCreation: false,
                    message: 'Blacklisted users cannot lend'
                },
                
                // Group restrictions
                groups: {
                    joinNew: false,
                    createNew: false,
                    inviteOthers: false,
                    maxMemberships: 0,
                    message: 'Blacklisted users cannot join or create groups'
                },
                
                // Platform feature restrictions
                platform: {
                    canRateOthers: false,
                    canBeRated: true,
                    visibility: 'REDUCED',
                    profileBadge: 'BLACKLISTED',
                    message: 'Platform features restricted due to blacklist status'
                },
                
                // Communication restrictions
                communication: {
                    canSendLoanRequests: false,
                    canReceiveLoanOffers: false,
                    canSendInvites: false,
                    message: 'Communication features restricted'
                }
            },
            enforcementLevel: 'FULL',
            overrideAllowed: false,
            overrideRequires: ['ADMIN_APPROVAL', 'FULL_REPAYMENT']
        };
    }

    /**
     * Apply UI restrictions
     * @param {string} userId - User ID
     * @param {Object} restrictionSet - Restriction set
     */
    applyUIRestrictions(userId, restrictionSet) {
        // This would be called from UI components
        // For now, we'll dispatch a custom event
        const event = new CustomEvent('mpesewa:blacklist-restrictions', {
            detail: {
                userId,
                restrictions: restrictionSet.restrictions,
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
        
        // Update localStorage for UI to read
        localStorage.setItem(`mpesewa_user_${userId}_restrictions`, JSON.stringify(restrictionSet));
    }

    /**
     * Block platform actions for blacklisted user
     * @param {string} userId - User ID
     * @param {Object} restrictionSet - Restriction set
     */
    blockPlatformActions(userId, restrictionSet) {
        const blockedActions = [
            'loan-request-create',
            'loan-offer-accept',
            'group-join-request',
            'group-create',
            'subscription-purchase',
            'ledger-create',
            'rating-submit'
        ];
        
        this.blockedActions.set(userId, {
            actions: blockedActions,
            restrictionSet,
            lastChecked: new Date().toISOString()
        });
    }

    /**
     * Check if action is allowed for user
     * @param {string} userId - User ID
     * @param {string} action - Action to check
     * @returns {Object} - Authorization result
     */
    checkActionAuthorization(userId, action) {
        const userRestrictions = this.restrictions.get(userId);
        
        if (!userRestrictions) {
            return { allowed: true, reason: 'No restrictions found' };
        }
        
        // Check specific action restrictions
        let allowed = true;
        let reason = 'Action allowed';
        
        switch (action) {
            case 'borrow':
            case 'request-loan':
                allowed = userRestrictions.restrictions.borrow.allowed;
                reason = userRestrictions.restrictions.borrow.message;
                break;
                
            case 'lend':
            case 'offer-loan':
                allowed = userRestrictions.restrictions.lend.allowed;
                reason = userRestrictions.restrictions.lend.message;
                break;
                
            case 'join-group':
                allowed = userRestrictions.restrictions.groups.joinNew;
                reason = userRestrictions.restrictions.groups.message;
                break;
                
            case 'create-group':
                allowed = userRestrictions.restrictions.groups.createNew;
                reason = userRestrictions.restrictions.groups.message;
                break;
                
            case 'rate-user':
                allowed = userRestrictions.restrictions.platform.canRateOthers;
                reason = userRestrictions.restrictions.platform.message;
                break;
                
            case 'send-invite':
                allowed = userRestrictions.restrictions.communication.canSendInvites;
                reason = userRestrictions.restrictions.communication.message;
                break;
        }
        
        return {
            allowed,
            reason,
            userId,
            action,
            timestamp: new Date().toISOString(),
            restrictions: userRestrictions
        };
    }

    /**
     * Remove blacklist restrictions from user
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     */
    removeBlacklistRestrictions(userId, countryCode) {
        // Remove from restrictions map
        this.restrictions.delete(userId);
        
        // Remove from blocked actions
        this.blockedActions.delete(userId);
        
        // Clear UI restrictions
        this.clearUIRestrictions(userId);
        
        // Save updated restrictions
        this.saveRestrictions();
        
        // Clear localStorage
        localStorage.removeItem(`mpesewa_user_${userId}_restrictions`);
        
        // Notify of removal
        this.notifyRestrictionsRemoved(userId, countryCode);
        
        console.log(`✅ Restrictions removed from user ${userId} in ${countryCode}`);
    }

    /**
     * Clear UI restrictions
     * @param {string} userId - User ID
     */
    clearUIRestrictions(userId) {
        const event = new CustomEvent('mpesewa:blacklist-cleared', {
            detail: {
                userId,
                timestamp: new Date().toISOString(),
                message: 'Blacklist restrictions have been removed'
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Notify that restrictions have been applied
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @param {Object} restrictionSet - Restriction set
     */
    notifyRestrictionsApplied(userId, countryCode, restrictionSet) {
        // Notify user via UI
        this.showUserNotification(userId, 'blacklist-applied', {
            message: 'You have been added to the blacklist',
            restrictions: restrictionSet.restrictions,
            appealProcess: 'Contact support to appeal'
        });
        
        // Notify user's groups (admins only)
        this.notifyGroupAdmins(userId, countryCode, 'MEMBER_BLACKLISTED', {
            userId,
            restrictions: restrictionSet
        });
        
        // Log to audit trail
        this.logEnforcementAction({
            action: 'RESTRICTIONS_APPLIED',
            userId,
            countryCode,
            restrictionSet,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Notify that restrictions have been removed
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     */
    notifyRestrictionsRemoved(userId, countryCode) {
        // Notify user via UI
        this.showUserNotification(userId, 'blacklist-removed', {
            message: 'Your blacklist restrictions have been removed',
            nextSteps: 'You can now access all platform features'
        });
        
        // Notify user's groups (admins only)
        this.notifyGroupAdmins(userId, countryCode, 'MEMBER_REINSTATED', {
            userId,
            message: 'User has been removed from blacklist'
        });
        
        // Log to audit trail
        this.logEnforcementAction({
            action: 'RESTRICTIONS_REMOVED',
            userId,
            countryCode,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Show user notification
     * @param {string} userId - User ID
     * @param {string} type - Notification type
     * @param {Object} data - Notification data
     */
    showUserNotification(userId, type, data) {
        // Dispatch event for UI to handle
        const event = new CustomEvent('mpesewa:user-notification', {
            detail: {
                userId,
                type,
                data,
                timestamp: new Date().toISOString(),
                priority: 'HIGH'
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Notify group admins
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @param {string} eventType - Event type
     * @param {Object} data - Event data
     */
    notifyGroupAdmins(userId, countryCode, eventType, data) {
        // This would query user's groups and notify admins
        // For now, dispatch an event
        const event = new CustomEvent('mpesewa:admin-notification', {
            detail: {
                userId,
                countryCode,
                eventType,
                data,
                timestamp: new Date().toISOString(),
                audience: 'GROUP_ADMINS'
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Log enforcement action
     * @param {Object} actionData - Action data
     */
    logEnforcementAction(actionData) {
        // Store in enforcement log
        const logEntry = {
            ...actionData,
            logId: this.generateLogId(),
            enforcementVersion: '1.0'
        };
        
        // Save to localStorage (in production would be server-side)
        this.saveToEnforcementLog(logEntry);
    }

    /**
     * Generate unique log ID
     * @returns {string} - Log ID
     */
    generateLogId() {
        return `enf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Save to enforcement log
     * @param {Object} logEntry - Log entry
     */
    saveToEnforcementLog(logEntry) {
        try {
            const existingLogs = localStorage.getItem('mpesewa_enforcement_log');
            const logs = existingLogs ? JSON.parse(existingLogs) : [];
            logs.push(logEntry);
            
            // Keep only last 1000 entries
            if (logs.length > 1000) {
                logs.splice(0, logs.length - 1000);
            }
            
            localStorage.setItem('mpesewa_enforcement_log', JSON.stringify(logs));
        } catch (error) {
            console.error('Error saving to enforcement log:', error);
        }
    }

    /**
     * Setup event listeners for enforcement
     */
    setupEventListeners() {
        // Listen for actions that need authorization
        window.addEventListener('mpesewa:action-request', (event) => {
            const { userId, action, data } = event.detail;
            const authResult = this.checkActionAuthorization(userId, action);
            
            if (!authResult.allowed) {
                // Prevent action
                event.preventDefault();
                
                // Notify UI
                this.showUserNotification(userId, 'action-blocked', {
                    action,
                    reason: authResult.reason,
                    suggestedAction: 'Appeal blacklist status'
                });
            }
            
            // Dispatch response
            const responseEvent = new CustomEvent('mpesewa:action-auth-response', {
                detail: authResult
            });
            window.dispatchEvent(responseEvent);
        });
        
        // Listen for blacklist status checks
        window.addEventListener('mpesewa:check-blacklist-status', (event) => {
            const { userId } = event.detail;
            const isBlacklisted = this.restrictions.has(userId);
            
            const responseEvent = new CustomEvent('mpesewa:blacklist-status-response', {
                detail: {
                    userId,
                    isBlacklisted,
                    restrictions: isBlacklisted ? this.restrictions.get(userId) : null,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(responseEvent);
        });
    }

    /**
     * Save restrictions to storage
     */
    saveRestrictions() {
        try {
            const restrictionsArray = Array.from(this.restrictions.values());
            localStorage.setItem('mpesewa_blacklist_restrictions', JSON.stringify(restrictionsArray));
        } catch (error) {
            console.error('Error saving restrictions:', error);
        }
    }

    /**
     * Get enforcement statistics
     * @returns {Object} - Statistics
     */
    getStatistics() {
        const totalRestricted = this.restrictions.size;
        const countryBreakdown = {};
        
        // Count by country
        for (const [userId, restriction] of this.restrictions) {
            const country = restriction.countryCode;
            countryBreakdown[country] = (countryBreakdown[country] || 0) + 1;
        }
        
        // Count blocked actions
        let totalBlockedActions = 0;
        for (const [userId, blocked] of this.blockedActions) {
            totalBlockedActions += blocked.actions.length;
        }
        
        return {
            totalRestricted,
            countryBreakdown,
            totalBlockedActions,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Get user's restriction details
     * @param {string} userId - User ID
     * @returns {Object|null} - Restriction details
     */
    getUserRestrictions(userId) {
        return this.restrictions.get(userId) || null;
    }

    /**
     * Check if user has any restrictions
     * @param {string} userId - User ID
     * @returns {boolean} - True if restricted
     */
    isUserRestricted(userId) {
        return this.restrictions.has(userId);
    }

    /**
     * Emergency override (admin only)
     * @param {string} userId - User ID
     * @param {string} adminId - Admin ID
     * @param {string} reason - Override reason
     * @returns {boolean} - Success status
     */
    emergencyOverride(userId, adminId, reason) {
        // Check if user is restricted
        if (!this.isUserRestricted(userId)) {
            return false;
        }
        
        // In production, verify admin permissions here
        const isAdmin = this.verifyAdminPermissions(adminId);
        if (!isAdmin) {
            console.error(`User ${adminId} is not authorized for emergency override`);
            return false;
        }
        
        // Log override
        this.logEnforcementAction({
            action: 'EMERGENCY_OVERRIDE',
            userId,
            adminId,
            reason,
            timestamp: new Date().toISOString(),
            note: 'Manual admin override - use with caution'
        });
        
        // Temporarily lift restrictions (24 hours)
        this.applyTemporaryOverride(userId, adminId, reason);
        
        return true;
    }

    /**
     * Verify admin permissions
     * @param {string} adminId - Admin ID
     * @returns {boolean} - True if admin
     */
    verifyAdminPermissions(adminId) {
        // This would check against admin database
        // For demo, check localStorage
        const adminData = localStorage.getItem(`mpesewa_admin_${adminId}`);
        return adminData !== null;
    }

    /**
     * Apply temporary override
     * @param {string} userId - User ID
     * @param {string} adminId - Admin ID
     * @param {string} reason - Override reason
     */
    applyTemporaryOverride(userId, adminId, reason) {
        const originalRestrictions = this.restrictions.get(userId);
        
        // Create temporary permissions
        const temporaryPermissions = {
            ...originalRestrictions,
            override: {
                appliedBy: adminId,
                appliedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                reason,
                originalRestrictions
            },
            restrictions: {
                // Allow minimal access for emergency
                borrow: { allowed: false, message: 'Temporary override active' },
                lend: { allowed: false, message: 'Temporary override active' },
                groups: { 
                    joinNew: false,
                    createNew: false,
                    message: 'Limited group access'
                },
                platform: {
                    canRateOthers: false,
                    canBeRated: true,
                    visibility: 'NORMAL',
                    profileBadge: 'UNDER_REVIEW'
                }
            }
        };
        
        // Apply temporary permissions
        this.restrictions.set(userId, temporaryPermissions);
        
        // Schedule restoration
        setTimeout(() => {
            this.restoreOriginalRestrictions(userId);
        }, 24 * 60 * 60 * 1000); // 24 hours
        
        console.log(`⚠️ Temporary override applied for user ${userId} by admin ${adminId}`);
    }

    /**
     * Restore original restrictions after temporary override
     * @param {string} userId - User ID
     */
    restoreOriginalRestrictions(userId) {
        const currentRestrictions = this.restrictions.get(userId);
        
        if (currentRestrictions?.override) {
            // Restore original restrictions
            this.restrictions.set(userId, currentRestrictions.override.originalRestrictions);
            
            // Log restoration
            this.logEnforcementAction({
                action: 'OVERRIDE_EXPIRED',
                userId,
                originalAdmin: currentRestrictions.override.appliedBy,
                timestamp: new Date().toISOString(),
                note: 'Temporary override expired, original restrictions restored'
            });
            
            console.log(`🔄 Original restrictions restored for user ${userId}`);
        }
    }
}

// Export enforcement engine
export default BlacklistEnforcement;