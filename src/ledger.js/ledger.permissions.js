/**
 * M-PESEWA LEDGER PERMISSIONS - STRICT ACCESS CONTROL
 * 
 * Who can do what, when, and under which conditions.
 */

class LedgerPermissions {
    constructor() {
        // PERMISSION MATRIX (Role × Action × Condition)
        this.PERMISSION_MATRIX = {
            // LENDER PERMISSIONS
            LENDER: {
                CREATE_LEDGER: {
                    allowed: true,
                    conditions: [
                        'ACTIVE_SUBSCRIPTION',
                        'IN_SAME_GROUP_AS_BORROWER',
                        'IN_SAME_COUNTRY_AS_BORROWER',
                        'BORROWER_NOT_BLACKLISTED',
                        'WITHIN_TIER_LIMITS',
                        'BORROWER_IN_ELIGIBLE_STATE'
                    ],
                    requires: ['BORROWER_CONSENT', 'GROUP_CONTEXT'],
                    scope: 'GROUP_ONLY'
                },
                
                VIEW_LEDGER: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'LEDGER_IN_VISIBLE_STATE'
                    ],
                    requires: [],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                UPDATE_LEDGER: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'LEDGER_ACTIVE_OR_OVERDUE',
                        'VALID_REPAYMENT_AMOUNT'
                    ],
                    requires: ['REPAYMENT_CONFIRMATION'],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                APPLY_INTEREST: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'INTEREST_DUE_DATE_PASSED',
                        'WITHIN_10_PERCENT_LIMIT'
                    ],
                    requires: [],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                APPLY_PENALTY: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'LOAN_OVERDUE',
                        'WITHIN_5_PERCENT_DAILY_LIMIT',
                        'NOT_ALREADY_DEFAULTED'
                    ],
                    requires: ['NOTIFICATION_TO_BORROWER'],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                REQUEST_BLACKLIST: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'LOAN_DEFAULTED',
                        'NO_RECENT_REPAYMENT',
                        'DEFAULT_OVER_30_DAYS'
                    ],
                    requires: ['ADMIN_APPROVAL'],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                RATE_BORROWER: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'LEDGER_CLEARED'
                    ],
                    requires: [],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                EXPORT_LEDGER: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER'
                    ],
                    requires: [],
                    scope: 'OWN_LEDGERS_ONLY'
                }
            },
            
            // BORROWER PERMISSIONS
            BORROWER: {
                VIEW_OWN_LEDGER: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'LEDGER_IN_VISIBLE_STATE'
                    ],
                    requires: [],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                REQUEST_LOAN: {
                    allowed: true,
                    conditions: [
                        'NOT_BLACKLISTED',
                        'IN_ELIGIBLE_GROUP',
                        'LESS_THAN_4_GROUPS',
                        'GOOD_RATING',
                        'NO_ACTIVE_LOAN_IN_GROUP'
                    ],
                    requires: ['GROUP_MEMBERSHIP', 'REFERRERS'],
                    scope: 'GROUP_ONLY'
                },
                
                MAKE_REPAYMENT: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'LEDGER_ACTIVE_OR_OVERDUE',
                        'WITHIN_7_DAY_WINDOW'
                    ],
                    requires: ['LENDER_CONFIRMATION'],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                REQUEST_EXTENSION: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'LEDGER_ACTIVE',
                        'BEFORE_DUE_DATE',
                        'FIRST_EXTENSION_REQUEST'
                    ],
                    requires: ['LENDER_APPROVAL'],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                APPEAL_DEFAULT: {
                    allowed: true,
                    conditions: [
                        'OWN_LEDGER',
                        'LEDGER_DEFAULTED',
                        'VALID_REASON'
                    ],
                    requires: ['ADMIN_REVIEW'],
                    scope: 'OWN_LEDGERS_ONLY'
                },
                
                VIEW_RATING: {
                    allowed: true,
                    conditions: [],
                    requires: [],
                    scope: 'OWN_PROFILE_ONLY'
                }
            },
            
            // GROUP ADMIN PERMISSIONS
            GROUP_ADMIN: {
                VIEW_ALL_LEDGERS: {
                    allowed: true,
                    conditions: [
                        'IN_OWN_GROUP'
                    ],
                    requires: [],
                    scope: 'GROUP_ONLY'
                },
                
                MEDIATE_DISPUTE: {
                    allowed: true,
                    conditions: [
                        'DISPUTE_IN_OWN_GROUP',
                        'BOTH_PARTIES_CONSENT'
                    ],
                    requires: [],
                    scope: 'GROUP_ONLY'
                },
                
                REPORT_TO_PLATFORM: {
                    allowed: true,
                    conditions: [
                        'ISSUE_IN_OWN_GROUP',
                        'ATTEMPTED_RESOLUTION'
                    ],
                    requires: [],
                    scope: 'GROUP_ONLY'
                },
                
                VIEW_GROUP_STATS: {
                    allowed: true,
                    conditions: [
                        'IN_OWN_GROUP'
                    ],
                    requires: [],
                    scope: 'GROUP_ONLY'
                }
            },
            
            // PLATFORM ADMIN PERMISSIONS
            ADMIN: {
                VIEW_ANY_LEDGER: {
                    allowed: true,
                    conditions: [],
                    requires: [],
                    scope: 'GLOBAL'
                },
                
                MODIFY_ANY_LEDGER: {
                    allowed: true,
                    conditions: [
                        'VALID_REASON',
                        'AUDIT_TRAIL'
                    ],
                    requires: ['JUSTIFICATION'],
                    scope: 'GLOBAL'
                },
                
                OVERRIDE_STATE: {
                    allowed: true,
                    conditions: [
                        'VALID_REASON'
                    ],
                    requires: ['AUDIT_TRAIL'],
                    scope: 'GLOBAL'
                },
                
                REMOVE_BLACKLIST: {
                    allowed: true,
                    conditions: [
                        'FULL_REPAYMENT_VERIFIED'
                    ],
                    requires: ['ADMIN_APPROVAL'],
                    scope: 'GLOBAL'
                },
                
                EXPORT_ANY_DATA: {
                    allowed: true,
                    conditions: [],
                    requires: [],
                    scope: 'GLOBAL'
                },
                
                AUDIT_ANY_ACTION: {
                    allowed: true,
                    conditions: [],
                    requires: [],
                    scope: 'GLOBAL'
                }
            },
            
            // DEBT COLLECTOR PERMISSIONS
            DEBT_COLLECTOR: {
                VIEW_ASSIGNED_LEDGERS: {
                    allowed: true,
                    conditions: [
                        'ASSIGNED_BY_LENDER',
                        'LEDGER_OVERDUE_OR_DEFAULTED'
                    ],
                    requires: ['CONTRACT_AGREEMENT'],
                    scope: 'ASSIGNED_ONLY'
                },
                
                UPDATE_COLLECTION_STATUS: {
                    allowed: true,
                    conditions: [
                        'ASSIGNED_LEDGER'
                    ],
                    requires: ['LENDER_NOTIFICATION'],
                    scope: 'ASSIGNED_ONLY'
                }
            }
        };

        // HIERARCHY LEVELS
        this.HIERARCHY_LEVELS = {
            GLOBAL: {
                level: 0,
                canSee: 'ALL',
                canModify: 'ADMIN_ONLY'
            },
            
            COUNTRY: {
                level: 1,
                canSee: 'SAME_COUNTRY',
                canModify: 'COUNTRY_ADMIN'
            },
            
            GROUP: {
                level: 2,
                canSee: 'SAME_GROUP',
                canModify: ['LENDER', 'GROUP_ADMIN']
            },
            
            LEDGER: {
                level: 3,
                canSee: ['LENDER', 'BORROWER', 'GROUP_ADMIN'],
                canModify: 'LENDER'
            },
            
            ENTRY: {
                level: 4,
                canSee: ['LENDER', 'ADMIN'],
                canModify: 'SYSTEM_ONLY' // Append-only
            }
        };

        // PERMISSION CONDITIONS LIBRARY
        this.CONDITIONS = {
            // Subscription conditions
            ACTIVE_SUBSCRIPTION: (context) => {
                const { lenderId, subscriptionStatus } = context;
                return subscriptionStatus === 'ACTIVE' && 
                       new Date() < new Date(subscriptionStatus.expiryDate);
            },
            
            WITHIN_TIER_LIMITS: (context) => {
                const { amount, tier, currency } = context;
                const tierLimits = {
                    BASIC: 1500,
                    PREMIUM: 5000,
                    SUPER: 20000,
                    LENDER_OF_LENDERS: 50000
                };
                return amount <= (tierLimits[tier] || 0);
            },
            
            // Group conditions
            IN_SAME_GROUP_AS_BORROWER: (context) => {
                return context.lenderGroupId === context.borrowerGroupId;
            },
            
            IN_SAME_COUNTRY_AS_BORROWER: (context) => {
                return context.lenderCountry === context.borrowerCountry;
            },
            
            IN_OWN_GROUP: (context) => {
                return context.userGroupId === context.targetGroupId;
            },
            
            // Borrower conditions
            BORROWER_NOT_BLACKLISTED: (context) => {
                return !context.borrowerBlacklisted;
            },
            
            NOT_BLACKLISTED: (context) => {
                return !context.userBlacklisted;
            },
            
            LESS_THAN_4_GROUPS: (context) => {
                return context.userGroupCount < 4;
            },
            
            GOOD_RATING: (context) => {
                return context.borrowerRating >= 3.0;
            },
            
            NO_ACTIVE_LOAN_IN_GROUP: (context) => {
                return context.activeLoansInGroup === 0;
            },
            
            // Ledger conditions
            OWN_LEDGER: (context) => {
                if (context.role === 'LENDER') {
                    return context.lenderId === context.ledgerLenderId;
                }
                if (context.role === 'BORROWER') {
                    return context.borrowerId === context.ledgerBorrowerId;
                }
                return false;
            },
            
            LEDGER_IN_VISIBLE_STATE: (context) => {
                const visibleStates = ['ACTIVE', 'OVERDUE', 'DEFAULTED', 'CLEARED'];
                return visibleStates.includes(context.ledgerState);
            },
            
            LEDGER_ACTIVE_OR_OVERDUE: (context) => {
                return ['ACTIVE', 'OVERDUE'].includes(context.ledgerState);
            },
            
            LOAN_OVERDUE: (context) => {
                return context.ledgerState === 'OVERDUE' || 
                       (context.daysSinceDisbursement > 7 && context.outstandingBalance > 0);
            },
            
            LOAN_DEFAULTED: (context) => {
                return context.ledgerState === 'DEFAULTED' || 
                       context.daysSinceDisbursement >= 60;
            },
            
            LEDGER_CLEARED: (context) => {
                return context.ledgerState === 'CLEARED';
            },
            
            // Date conditions
            INTEREST_DUE_DATE_PASSED: (context) => {
                return new Date() > new Date(context.disbursementDate);
            },
            
            BEFORE_DUE_DATE: (context) => {
                return new Date() < new Date(context.dueDate);
            },
            
            WITHIN_7_DAY_WINDOW: (context) => {
                const daysSinceDisbursement = Math.floor(
                    (new Date() - new Date(context.disbursementDate)) / (1000 * 60 * 60 * 24)
                );
                return daysSinceDisbursement <= 7;
            },
            
            DEFAULT_OVER_30_DAYS: (context) => {
                const defaultAge = Math.floor(
                    (new Date() - new Date(context.defaultDate || context.disbursementDate)) / (1000 * 60 * 60 * 24)
                );
                return defaultAge > 30;
            },
            
            // Amount conditions
            VALID_REPAYMENT_AMOUNT: (context) => {
                return context.repaymentAmount > 0 && 
                       context.repaymentAmount <= context.outstandingBalance;
            },
            
            WITHIN_10_PERCENT_LIMIT: (context) => {
                return context.interestRate <= 0.10;
            },
            
            WITHIN_5_PERCENT_DAILY_LIMIT: (context) => {
                return context.penaltyRate <= 0.05;
            },
            
            // State conditions
            NOT_ALREADY_DEFAULTED: (context) => {
                return context.ledgerState !== 'DEFAULTED';
            },
            
            BORROWER_IN_ELIGIBLE_STATE: (context) => {
                return context.borrowerState === 'ELIGIBLE';
            },
            
            // Other conditions
            NO_RECENT_REPAYMENT: (context) => {
                if (!context.lastRepaymentDate) return true;
                const daysSinceLastRepayment = Math.floor(
                    (new Date() - new Date(context.lastRepaymentDate)) / (1000 * 60 * 60 * 24)
                );
                return daysSinceLastRepayment > 30;
            },
            
            FULL_REPAYMENT_VERIFIED: (context) => {
                return context.outstandingBalance === 0 && 
                       context.penaltiesPaid === true;
            },
            
            VALID_REASON: (context) => {
                return context.reason && context.reason.length > 10;
            },
            
            ATTEMPTED_RESOLUTION: (context) => {
                return context.mediationAttempted === true;
            },
            
            BOTH_PARTIES_CONSENT: (context) => {
                return context.lenderConsent && context.borrowerConsent;
            }
        };
    }

    /**
     * CHECK PERMISSION
     */
    checkPermission(role, action, context) {
        // Get permission definition
        const permission = this.PERMISSION_MATRIX[role]?.[action];
        
        if (!permission) {
            return {
                allowed: false,
                reason: `Permission ${action} not defined for role ${role}`,
                code: 'PERM_001'
            };
        }

        // Check if action is allowed at all
        if (!permission.allowed) {
            return {
                allowed: false,
                reason: `Action ${action} is not allowed for role ${role}`,
                code: 'PERM_002'
            };
        }

        // Check scope
        const scopeCheck = this.checkScope(permission.scope, context);
        if (!scopeCheck.valid) {
            return {
                allowed: false,
                reason: scopeCheck.reason,
                code: 'PERM_003',
                scope: permission.scope
            };
        }

        // Check conditions
        const conditionsCheck = this.checkConditions(permission.conditions, context);
        if (!conditionsCheck.valid) {
            return {
                allowed: false,
                reason: conditionsCheck.reason,
                code: 'PERM_004',
                unmetConditions: conditionsCheck.unmet,
                totalConditions: permission.conditions.length
            };
        }

        // Check requirements
        const requirementsCheck = this.checkRequirements(permission.requires, context);
        if (!requirementsCheck.valid) {
            return {
                allowed: false,
                reason: requirementsCheck.reason,
                code: 'PERM_005',
                missingRequirements: requirementsCheck.missing,
                canRequest: requirementsCheck.canRequest
            };
        }

        // Check hierarchy level
        const hierarchyCheck = this.checkHierarchy(role, action, context);
        if (!hierarchyCheck.valid) {
            return {
                allowed: false,
                reason: hierarchyCheck.reason,
                code: 'PERM_006',
                hierarchyLevel: hierarchyCheck.level,
                requiredLevel: hierarchyCheck.required
            };
        }

        // All checks passed
        return {
            allowed: true,
            reason: `Permission granted for ${action}`,
            permission,
            context,
            timestamp: new Date(),
            expires: this.getPermissionExpiry(action, context),
            limitations: this.getLimitations(permission, context)
        };
    }

    /**
     * CHECK SCOPE
     */
    checkScope(scope, context) {
        switch (scope) {
            case 'OWN_LEDGERS_ONLY':
                if (context.role === 'LENDER' && context.lenderId !== context.ledgerLenderId) {
                    return {
                        valid: false,
                        reason: 'Can only access own ledgers'
                    };
                }
                if (context.role === 'BORROWER' && context.borrowerId !== context.ledgerBorrowerId) {
                    return {
                        valid: false,
                        reason: 'Can only access own ledgers'
                    };
                }
                break;
                
            case 'GROUP_ONLY':
                if (context.userGroupId !== context.targetGroupId) {
                    return {
                        valid: false,
                        reason: 'Can only access group resources'
                    };
                }
                break;
                
            case 'ASSIGNED_ONLY':
                if (!context.assignedLedgers?.includes(context.ledgerId)) {
                    return {
                        valid: false,
                        reason: 'Can only access assigned ledgers'
                    };
                }
                break;
                
            case 'GLOBAL':
                // No restrictions for global scope
                break;
        }
        
        return { valid: true, reason: 'Scope check passed' };
    }

    /**
     * CHECK CONDITIONS
     */
    checkConditions(conditionCodes, context) {
        const unmet = [];
        
        for (const conditionCode of conditionCodes) {
            const condition = this.CONDITIONS[conditionCode];
            if (!condition) {
                unmet.push({
                    condition: conditionCode,
                    reason: 'Condition evaluator not found',
                    details: null
                });
                continue;
            }
            
            try {
                const result = condition(context);
                if (!result) {
                    unmet.push({
                        condition: conditionCode,
                        reason: 'Condition not satisfied',
                        details: context
                    });
                }
            } catch (error) {
                unmet.push({
                    condition: conditionCode,
                    reason: `Condition evaluation failed: ${error.message}`,
                    details: { error: error.message }
                });
            }
        }
        
        return {
            valid: unmet.length === 0,
            reason: unmet.length > 0 ? `${unmet.length} conditions unmet` : 'All conditions met',
            unmet,
            total: conditionCodes.length,
            met: conditionCodes.length - unmet.length
        };
    }

    /**
     * CHECK REQUIREMENTS
     */
    checkRequirements(requirementCodes, context) {
        const missing = [];
        const canRequest = [];
        
        for (const requirementCode of requirementCodes) {
            const requirementMet = this.checkRequirement(requirementCode, context);
            
            if (!requirementMet.met) {
                missing.push({
                    requirement: requirementCode,
                    reason: requirementMet.reason,
                    canRequest: requirementMet.canRequest
                });
                
                if (requirementMet.canRequest) {
                    canRequest.push(requirementCode);
                }
            }
        }
        
        return {
            valid: missing.length === 0,
            reason: missing.length > 0 ? `${missing.length} requirements missing` : 'All requirements met',
            missing,
            canRequest,
            total: requirementCodes.length
        };
    }

    /**
     * CHECK REQUIREMENT
     */
    checkRequirement(requirementCode, context) {
        const requirementCheckers = {
            BORROWER_CONSENT: () => ({
                met: context.borrowerConsent === true,
                reason: 'Borrower consent required',
                canRequest: true
            }),
            
            GROUP_CONTEXT: () => ({
                met: context.groupId && context.countryCode,
                reason: 'Must be in group and country context',
                canRequest: false
            }),
            
            REPAYMENT_CONFIRMATION: () => ({
                met: context.repaymentConfirmed === true,
                reason: 'Repayment confirmation required',
                canRequest: true
            }),
            
            NOTIFICATION_TO_BORROWER: () => ({
                met: context.borrowerNotified === true,
                reason: 'Borrower must be notified',
                canRequest: true
            }),
            
            ADMIN_APPROVAL: () => ({
                met: context.adminApproved === true,
                reason: 'Admin approval required',
                canRequest: true
            }),
            
            GROUP_MEMBERSHIP: () => ({
                met: context.groupMembershipActive === true,
                reason: 'Active group membership required',
                canRequest: true
            }),
            
            REFERRERS: () => ({
                met: context.referrers?.length >= 2,
                reason: 'Two referrers required',
                canRequest: true
            }),
            
            LENDER_CONFIRMATION: () => ({
                met: context.lenderConfirmed === true,
                reason: 'Lender confirmation required',
                canRequest: true
            }),
            
            LENDER_APPROVAL: () => ({
                met: context.lenderApproved === true,
                reason: 'Lender approval required',
                canRequest: true
            }),
            
            ADMIN_REVIEW: () => ({
                met: context.adminReviewed === true,
                reason: 'Admin review required',
                canRequest: true
            }),
            
            CONTRACT_AGREEMENT: () => ({
                met: context.contractSigned === true,
                reason: 'Contract agreement required',
                canRequest: true
            }),
            
            JUSTIFICATION: () => ({
                met: context.justificationProvided === true,
                reason: 'Justification required',
                canRequest: true
            }),
            
            AUDIT_TRAIL: () => ({
                met: context.auditTrailEnabled === true,
                reason: 'Audit trail required',
                canRequest: false
            })
        };
        
        const checker = requirementCheckers[requirementCode];
        if (!checker) {
            return {
                met: false,
                reason: `Unknown requirement: ${requirementCode}`,
                canRequest: false
            };
        }
        
        return checker();
    }

    /**
     * CHECK HIERARCHY
     */
    checkHierarchy(role, action, context) {
        const hierarchyRules = {
            LENDER: {
                minLevel: 2, // GROUP level
                maxLevel: 3, // LEDGER level
                canCrossCountry: false,
                canCrossGroup: false
            },
            
            BORROWER: {
                minLevel: 3, // LEDGER level (own only)
                maxLevel: 3,
                canCrossCountry: false,
                canCrossGroup: false
            },
            
            GROUP_ADMIN: {
                minLevel: 2, // GROUP level
                maxLevel: 3, // LEDGER level (in group)
                canCrossCountry: false,
                canCrossGroup: false
            },
            
            ADMIN: {
                minLevel: 0, // GLOBAL level
                maxLevel: 4, // ENTRY level
                canCrossCountry: true,
                canCrossGroup: true
            },
            
            DEBT_COLLECTOR: {
                minLevel: 3, // LEDGER level (assigned)
                maxLevel: 3,
                canCrossCountry: false,
                canCrossGroup: false
            }
        };
        
        const rule = hierarchyRules[role];
        if (!rule) {
            return {
                valid: false,
                reason: `No hierarchy rules for role: ${role}`,
                level: null,
                required: null
            };
        }
        
        // Check if trying to cross country boundaries
        if (!rule.canCrossCountry && context.userCountry !== context.targetCountry) {
            return {
                valid: false,
                reason: 'Cross-country access not allowed',
                level: 'COUNTRY',
                required: 'SAME_COUNTRY'
            };
        }
        
        // Check if trying to cross group boundaries
        if (!rule.canCrossGroup && context.userGroupId !== context.targetGroupId) {
            return {
                valid: false,
                reason: 'Cross-group access not allowed',
                level: 'GROUP',
                required: 'SAME_GROUP'
            };
        }
        
        // Determine target hierarchy level based on action
        const targetLevel = this.getActionLevel(action, context);
        
        // Check level bounds
        if (targetLevel < rule.minLevel || targetLevel > rule.maxLevel) {
            return {
                valid: false,
                reason: `Action ${action} requires level ${targetLevel}, role ${role} can only access levels ${rule.minLevel}-${rule.maxLevel}`,
                level: targetLevel,
                required: `${rule.minLevel}-${rule.maxLevel}`
            };
        }
        
        return {
            valid: true,
            reason: 'Hierarchy check passed',
            level: targetLevel,
            required: `${rule.minLevel}-${rule.maxLevel}`
        };
    }

    /**
     * GET ACTION HIERARCHY LEVEL
     */
    getActionLevel(action, context) {
        const actionLevels = {
            // Level 0: GLOBAL actions
            VIEW_PLATFORM_STATS: 0,
            EXPORT_GLOBAL_DATA: 0,
            
            // Level 1: COUNTRY actions
            VIEW_COUNTRY_STATS: 1,
            MANAGE_COUNTRY_RULES: 1,
            
            // Level 2: GROUP actions
            CREATE_LEDGER: 2,
            VIEW_GROUP_STATS: 2,
            MEDIATE_DISPUTE: 2,
            
            // Level 3: LEDGER actions
            VIEW_LEDGER: 3,
            UPDATE_LEDGER: 3,
            APPLY_INTEREST: 3,
            APPLY_PENALTY: 3,
            
            // Level 4: ENTRY actions
            ADD_LEDGER_ENTRY: 4,
            MODIFY_LEDGER_ENTRY: 4,
            DELETE_LEDGER_ENTRY: 4
        };
        
        return actionLevels[action] || 3; // Default to LEDGER level
    }

    /**
     * GET PERMISSION EXPIRY
     */
    getPermissionExpiry(action, context) {
        const expiryRules = {
            CREATE_LEDGER: () => {
                // Permission expires when subscription expires
                return new Date(context.subscriptionExpiry);
            },
            
            UPDATE_LEDGER: () => {
                // Permission expires when ledger is cleared or archived
                if (['CLEARED', 'ARCHIVED'].includes(context.ledgerState)) {
                    return new Date(); // Already expired
                }
                // Or when subscription expires
                return new Date(context.subscriptionExpiry);
            },
            
            VIEW_LEDGER: () => {
                // View permission rarely expires
                return new Date('2099-12-31');
            },
            
            REQUEST_BLACKLIST: () => {
                // Time-limited request window
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + 30); // 30 days to request
                return expiry;
            }
        };
        
        const rule = expiryRules[action];
        if (rule) {
            return rule();
        }
        
        // Default: expires in 24 hours for sensitive actions
        const defaultExpiry = new Date();
        defaultExpiry.setHours(defaultExpiry.getHours() + 24);
        return defaultExpiry;
    }

    /**
     * GET LIMITATIONS
     */
    getLimitations(permission, context) {
        const limitations = [];
        
        // Time limitations
        if (permission.scope === 'OWN_LEDGERS_ONLY') {
            limitations.push('Limited to own ledgers only');
        }
        
        if (permission.scope === 'GROUP_ONLY') {
            limitations.push('Limited to own group only');
        }
        
        // Action limitations
        if (permission.requires.includes('ADMIN_APPROVAL')) {
            limitations.push('Requires admin approval');
        }
        
        if (permission.requires.includes('BORROWER_CONSENT')) {
            limitations.push('Requires borrower consent');
        }
        
        // State limitations
        if (permission.conditions.includes('LEDGER_ACTIVE_OR_OVERDUE')) {
            limitations.push('Only allowed for active or overdue ledgers');
        }
        
        if (permission.conditions.includes('LEDGER_CLEARED')) {
            limitations.push('Only allowed for cleared ledgers');
        }
        
        return limitations;
    }

    /**
     * BULK PERMISSION CHECK
     */
    checkBulkPermissions(role, actions, context) {
        const results = {};
        const granted = [];
        const denied = [];
        
        for (const action of actions) {
            const result = this.checkPermission(role, action, context);
            results[action] = result;
            
            if (result.allowed) {
                granted.push(action);
            } else {
                denied.push({
                    action,
                    reason: result.reason,
                    code: result.code
                });
            }
        }
        
        return {
            results,
            summary: {
                total: actions.length,
                granted: granted.length,
                denied: denied.length,
                grantedActions: granted,
                deniedActions: denied
            },
            canProceed: denied.length === 0,
            recommendations: this.getRecommendations(denied, context)
        };
    }

    /**
     * GET RECOMMENDATIONS
     */
    getRecommendations(deniedActions, context) {
        const recommendations = [];
        
        for (const denied of deniedActions) {
            switch (denied.code) {
                case 'PERM_003': // Scope violation
                    recommendations.push({
                        action: denied.action,
                        recommendation: 'Switch to appropriate scope or context',
                        fix: 'Ensure you are in the correct group/country'
                    });
                    break;
                    
                case 'PERM_004': // Conditions unmet
                    recommendations.push({
                        action: denied.action,
                        recommendation: 'Meet the required conditions',
                        fix: 'Check ledger state, subscription status, or other conditions'
                    });
                    break;
                    
                case 'PERM_005': // Requirements missing
                    recommendations.push({
                        action: denied.action,
                        recommendation: 'Obtain required approvals or consents',
                        fix: 'Request approval from admin or get consent from other party'
                    });
                    break;
                    
                case 'PERM_006': // Hierarchy violation
                    recommendations.push({
                        action: denied.action,
                        recommendation: 'Action requires different role or level',
                        fix: 'Contact admin or switch to appropriate role'
                    });
                    break;
            }
        }
        
        return recommendations;
    }

    /**
     * GET ALLOWED ACTIONS FOR CONTEXT
     */
    getAllowedActionsForContext(role, context) {
        const rolePermissions = this.PERMISSION_MATRIX[role];
        if (!rolePermissions) return [];
        
        const allowedActions = [];
        
        for (const [action, permission] of Object.entries(rolePermissions)) {
            if (!permission.allowed) continue;
            
            const check = this.checkPermission(role, action, context);
            if (check.allowed) {
                allowedActions.push({
                    action,
                    permission,
                    limitations: check.limitations,
                    expires: check.expires
                });
            }
        }
        
        return allowedActions.sort((a, b) => {
            // Sort by importance/priority
            const priority = {
                CREATE_LEDGER: 1,
                UPDATE_LEDGER: 2,
                VIEW_LEDGER: 3,
                APPLY_INTEREST: 4,
                APPLY_PENALTY: 5,
                REQUEST_BLACKLIST: 6,
                RATE_BORROWER: 7
            };
            
            return (priority[a.action] || 99) - (priority[b.action] || 99);
        });
    }

    /**
     * VALIDATE USER FOR ACTION
     */
    validateUserForAction(user, action, target) {
        const context = {
            role: user.role,
            userId: user.id,
            userGroupId: user.groupId,
            userCountry: user.countryCode,
            userBlacklisted: user.blacklisted,
            userGroupCount: user.groupCount,
            subscriptionStatus: user.subscriptionStatus,
            subscriptionExpiry: user.subscriptionExpiry,
            subscriptionTier: user.subscriptionTier,
            
            // Target context
            ledgerId: target.ledgerId,
            ledgerLenderId: target.lenderId,
            ledgerBorrowerId: target.borrowerId,
            ledgerState: target.state,
            targetGroupId: target.groupId,
            targetCountry: target.countryCode,
            outstandingBalance: target.outstandingBalance,
            daysSinceDisbursement: target.daysSinceDisbursement,
            disbursementDate: target.disbursementDate,
            dueDate: target.dueDate,
            defaultDate: target.defaultDate,
            lastRepaymentDate: target.lastRepaymentDate
        };
        
        return this.checkPermission(user.role, action, context);
    }

    /**
     * SIMULATE PERMISSION SCENARIO
     */
    simulatePermissionScenario(scenario) {
        const {
            user,
            action,
            target,
            additionalContext = {}
        } = scenario;
        
        const baseContext = {
            role: user.role,
            userId: user.id,
            userGroupId: user.groupId,
            userCountry: user.countryCode,
            userBlacklisted: user.blacklisted,
            subscriptionStatus: user.subscriptionStatus,
            
            ledgerId: target.ledgerId,
            ledgerLenderId: target.lenderId,
            ledgerBorrowerId: target.borrowerId,
            ledgerState: target.state,
            targetGroupId: target.groupId,
            targetCountry: target.countryCode
        };
        
        const context = { ...baseContext, ...additionalContext };
        const result = this.checkPermission(user.role, action, context);
        
        return {
            scenario,
            result,
            contextUsed: context,
            recommendations: result.allowed ? 
                [] : 
                this.getRecommendations([{ action, code: result.code }], context),
            alternativeActions: this.findAlternativeActions(user.role, action, context)
        };
    }

    /**
     * FIND ALTERNATIVE ACTIONS
     */
    findAlternativeActions(role, deniedAction, context) {
        const alternatives = [];
        const rolePermissions = this.PERMISSION_MATRIX[role];
        
        // Find similar actions that might be allowed
        for (const [action, permission] of Object.entries(rolePermissions)) {
            if (action === deniedAction || !permission.allowed) continue;
            
            // Check if this alternative is allowed
            const check = this.checkPermission(role, action, context);
            if (check.allowed) {
                alternatives.push({
                    action,
                    permission,
                    reason: `Alternative to ${deniedAction}`,
                    limitations: check.limitations
                });
            }
        }
        
        return alternatives;
    }

    /**
     * GENERATE PERMISSION REPORT
     */
    generatePermissionReport(user, targetContext) {
        const allowedActions = this.getAllowedActionsForContext(user.role, {
            ...targetContext,
            role: user.role,
            userId: user.id,
            userGroupId: user.groupId,
            userCountry: user.countryCode
        });
        
        return {
            user: {
                id: user.id,
                role: user.role,
                group: user.groupId,
                country: user.countryCode,
                subscription: user.subscriptionTier,
                blacklisted: user.blacklisted
            },
            
            context: targetContext,
            
            permissions: {
                totalAvailable: Object.keys(this.PERMISSION_MATRIX[user.role] || {}).length,
                allowed: allowedActions.length,
                denied: Object.keys(this.PERMISSION_MATRIX[user.role] || {}).length - allowedActions.length,
                allowedActions: allowedActions.map(a => a.action),
                
                byCategory: {
                    create: allowedActions.filter(a => a.action.includes('CREATE')).length,
                    read: allowedActions.filter(a => a.action.includes('VIEW')).length,
                    update: allowedActions.filter(a => a.action.includes('UPDATE') || a.action.includes('APPLY')).length,
                    delete: allowedActions.filter(a => a.action.includes('DELETE')).length,
                    admin: allowedActions.filter(a => a.action.includes('ADMIN') || a.action.includes('AUDIT')).length
                }
            },
            
            limitations: allowedActions.flatMap(a => a.limitations),
            
            recommendations: allowedActions.length === 0 ? 
                ['No actions available. Check subscription or contact admin.'] :
                []
        };
    }
}

// Export singleton instance
const ledgerPermissions = new LedgerPermissions();
export default ledgerPermissions;