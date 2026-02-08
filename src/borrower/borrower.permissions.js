/**
 * M-Pesewa Borrower Permissions System
 * ENFORCES STRICT HIERARCHY: Global → Country → Groups → Borrowers
 * 
 * Permission Rules:
 * 1. Role-based access control (RBAC)
 * 2. Country isolation enforcement
 * 3. Group membership requirements
 * 4. State-dependent permissions
 * 5. Tier-based limitations
 */

class BorrowerPermissions {
    constructor() {
        // Permission matrix by borrower state
        this.permissionMatrix = {
            // NEW: Just registered, not verified
            NEW: {
                viewDashboard: false,
                requestLoan: false,
                viewGroups: false,
                joinGroup: true,
                leaveGroup: false,
                viewHistory: false,
                updateProfile: true,
                viewLedger: false,
                makeRepayment: false,
                viewBlacklist: false,
                appealBlacklist: false,
                viewCollectors: false,
                inviteMembers: false,
                rateLender: false,
                disputeLoan: false
            },

            // VERIFIED: Identity verified
            VERIFIED: {
                viewDashboard: true,
                requestLoan: false, // Must be ELIGIBLE
                viewGroups: true,
                joinGroup: true,
                leaveGroup: true,
                viewHistory: true,
                updateProfile: true,
                viewLedger: false,
                makeRepayment: false,
                viewBlacklist: true,
                appealBlacklist: false,
                viewCollectors: true,
                inviteMembers: false,
                rateLender: false,
                disputeLoan: false
            },

            // ELIGIBLE: Can request loans
            ELIGIBLE: {
                viewDashboard: true,
                requestLoan: true,
                viewGroups: true,
                joinGroup: true,
                leaveGroup: true,
                viewHistory: true,
                updateProfile: true,
                viewLedger: true,
                makeRepayment: false, // No active loan yet
                viewBlacklist: true,
                appealBlacklist: false,
                viewCollectors: true,
                inviteMembers: true,
                rateLender: false,
                disputeLoan: false
            },

            // BORROWING: Has active loan
            BORROWING: {
                viewDashboard: true,
                requestLoan: false, // One loan at a time
                viewGroups: true,
                joinGroup: false, // Cannot join while borrowing
                leaveGroup: false, // Cannot leave while borrowing
                viewHistory: true,
                updateProfile: true,
                viewLedger: true,
                makeRepayment: true,
                viewBlacklist: true,
                appealBlacklist: false,
                viewCollectors: true,
                inviteMembers: true,
                rateLender: false, // Can rate after repayment
                disputeLoan: true
            },

            // OVERDUE: Loan overdue (7+ days)
            OVERDUE: {
                viewDashboard: true,
                requestLoan: false,
                viewGroups: true,
                joinGroup: false,
                leaveGroup: false,
                viewHistory: true,
                updateProfile: true,
                viewLedger: true,
                makeRepayment: true,
                viewBlacklist: true,
                appealBlacklist: false,
                viewCollectors: true,
                inviteMembers: false,
                rateLender: false,
                disputeLoan: true
            },

            // DEFAULTED: 2+ months overdue
            DEFAULTED: {
                viewDashboard: true,
                requestLoan: false,
                viewGroups: true,
                joinGroup: false, // Blocked from all groups
                leaveGroup: true,
                viewHistory: true,
                updateProfile: false,
                viewLedger: true,
                makeRepayment: true,
                viewBlacklist: true,
                appealBlacklist: true,
                viewCollectors: true,
                inviteMembers: false,
                rateLender: false,
                disputeLoan: false
            },

            // BLACKLISTED: Platform-wide restriction
            BLACKLISTED: {
                viewDashboard: false,
                requestLoan: false,
                viewGroups: false,
                joinGroup: false,
                leaveGroup: false,
                viewHistory: false,
                updateProfile: false,
                viewLedger: false,
                makeRepayment: true, // Can still repay
                viewBlacklist: true,
                appealBlacklist: true,
                viewCollectors: false,
                inviteMembers: false,
                rateLender: false,
                disputeLoan: false
            },

            // REINSTATED: Was blacklisted, now cleared
            REINSTATED: {
                viewDashboard: true,
                requestLoan: false, // Must go through VERIFIED again
                viewGroups: true,
                joinGroup: true,
                leaveGroup: true,
                viewHistory: true,
                updateProfile: true,
                viewLedger: false,
                makeRepayment: false,
                viewBlacklist: true,
                appealBlacklist: false,
                viewCollectors: true,
                inviteMembers: false,
                rateLender: false,
                disputeLoan: false
            }
        };

        // Tier-based permission enhancements
        this.tierPermissions = {
            BASIC: {
                maxLoanAmount: 1500,
                canBusinessLoan: false,
                canAdvanceLoan: true,
                canMultipleLoans: false,
                canCrossGroupBorrow: false,
                referralBonus: false,
                prioritySupport: false
            },
            PREMIUM: {
                maxLoanAmount: 5000,
                canBusinessLoan: true,
                canAdvanceLoan: true,
                canMultipleLoans: false,
                canCrossGroupBorrow: true,
                referralBonus: true,
                prioritySupport: false
            },
            SUPER: {
                maxLoanAmount: 20000,
                canBusinessLoan: true,
                canAdvanceLoan: true,
                canMultipleLoans: true, // Across different groups
                canCrossGroupBorrow: true,
                referralBonus: true,
                prioritySupport: true
            }
        };

        // Group role permissions
        this.groupRolePermissions = {
            MEMBER: {
                canInvite: false,
                canRemove: false,
                canModerate: false,
                canViewStats: false,
                canExport: false
            },
            MODERATOR: {
                canInvite: true,
                canRemove: false,
                canModerate: true,
                canViewStats: true,
                canExport: false
            },
            ADMIN: {
                canInvite: true,
                canRemove: true,
                canModerate: true,
                canViewStats: true,
                canExport: true
            }
        };
    }

    /**
     * Check if borrower has permission for action
     */
    hasPermission(borrowerState, action, context = {}) {
        // Get base permissions for state
        const statePermissions = this.permissionMatrix[borrowerState];
        
        if (!statePermissions) {
            console.error(`Unknown borrower state: ${borrowerState}`);
            return false;
        }

        // Check if action exists in permissions
        if (!statePermissions.hasOwnProperty(action)) {
            console.error(`Unknown permission action: ${action}`);
            return false;
        }

        let hasBasePermission = statePermissions[action];

        // Apply additional context-based checks
        if (hasBasePermission) {
            hasBasePermission = this.applyContextChecks(borrowerState, action, context, hasBasePermission);
        }

        return hasBasePermission;
    }

    /**
     * Apply context-specific permission checks
     */
    applyContextChecks(borrowerState, action, context, basePermission) {
        if (!basePermission) return false;

        const borrower = context.borrower || {};
        const targetGroup = context.targetGroup || {};
        const loan = context.loan || {};

        switch (action) {
            case 'requestLoan':
                // STRICT RULE: Must be in ELIGIBLE state
                if (borrowerState !== 'ELIGIBLE') return false;
                
                // STRICT RULE: One active loan per group
                if (this.hasActiveLoanInGroup(borrower, targetGroup.id)) return false;
                
                // STRICT RULE: Check tier limits
                if (!this.withinTierLimit(borrower, context.amount)) return false;
                
                // STRICT RULE: Not blacklisted
                if (borrower.isBlacklisted) return false;
                
                // STRICT RULE: Good rating for additional groups
                if (borrower.groupIds && borrower.groupIds.length > 1) {
                    if (!this.hasGoodRating(borrower)) return false;
                }
                break;

            case 'joinGroup':
                // STRICT RULE: Max 4 groups
                if (borrower.groupIds && borrower.groupIds.length >= 4) return false;
                
                // STRICT RULE: Country isolation
                if (borrower.countryCode !== targetGroup.countryCode) return false;
                
                // STRICT RULE: Not defaulted (blocks all groups)
                if (borrowerState === 'DEFAULTED') return false;
                
                // STRICT RULE: Good rating for additional groups
                if (borrower.groupIds && borrower.groupIds.length >= 1) {
                    if (!this.hasGoodRating(borrower)) return false;
                }
                break;

            case 'makeRepayment':
                // Must have an active loan
                if (!this.hasActiveLoan(borrower, loan.id)) return false;
                
                // Loan must not be cleared
                if (loan.status === 'CLEARED') return false;
                break;

            case 'rateLender':
                // Can only rate after loan is cleared
                if (!loan || loan.status !== 'CLEARED') return false;
                
                // Can only rate once per loan
                if (loan.rated) return false;
                
                // Must be the borrower of that loan
                if (loan.borrowerId !== borrower.id) return false;
                break;

            case 'disputeLoan':
                // Must have active or overdue loan
                if (!['BORROWING', 'OVERDUE'].includes(borrowerState)) return false;
                
                // Dispute window (first 3 days of loan)
                if (loan.disbursementDate) {
                    const loanDate = new Date(loan.disbursementDate);
                    const today = new Date();
                    const daysDiff = Math.floor((today - loanDate) / (1000 * 60 * 60 * 24));
                    if (daysDiff > 3) return false;
                }
                break;

            case 'appealBlacklist':
                // Only BLACKLISTED or DEFAULTED can appeal
                if (!['BLACKLISTED', 'DEFAULTED'].includes(borrowerState)) return false;
                
                // Must have attempted repayment
                if (!context.hasRepaymentAttempt) return false;
                break;

            case 'inviteMembers':
                // Must be in group for at least 30 days
                if (context.groupJoinDate) {
                    const joinDate = new Date(context.groupJoinDate);
                    const today = new Date();
                    const daysInGroup = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
                    if (daysInGroup < 30) return false;
                }
                
                // Must have good rating
                if (!this.hasGoodRating(borrower)) return false;
                break;
        }

        return true;
    }

    /**
     * Check if borrower has active loan in specific group
     */
    hasActiveLoanInGroup(borrower, groupId) {
        if (!borrower.activeLoans) return false;
        
        return borrower.activeLoans.some(loan => 
            loan.groupId === groupId && 
            ['ACTIVE', 'OVERDUE'].includes(loan.status)
        );
    }

    /**
     * Check if borrower has any active loan
     */
    hasActiveLoan(borrower, excludeLoanId = null) {
        if (!borrower.activeLoans) return false;
        
        return borrower.activeLoans.some(loan => {
            if (excludeLoanId && loan.id === excludeLoanId) return false;
            return ['ACTIVE', 'OVERDUE'].includes(loan.status);
        });
    }

    /**
     * Check if within tier borrowing limit
     */
    withinTierLimit(borrower, requestedAmount) {
        const tier = borrower.tier || 'BASIC';
        const tierConfig = this.tierPermissions[tier];
        
        if (!tierConfig) return false;

        // Calculate weekly borrowing
        const weeklyBorrowed = this.calculateWeeklyBorrowing(borrower);
        
        return (weeklyBorrowed + requestedAmount) <= tierConfig.maxLoanAmount;
    }

    /**
     * Calculate weekly borrowing total
     */
    calculateWeeklyBorrowing(borrower) {
        if (!borrower.loanHistory) return 0;
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return borrower.loanHistory
            .filter(loan => new Date(loan.disbursementDate) > oneWeekAgo)
            .reduce((total, loan) => total + loan.principal, 0);
    }

    /**
     * Check if borrower has good rating (3.5+ stars)
     */
    hasGoodRating(borrower) {
        return borrower.rating >= 3.5;
    }

    /**
     * Get all permissions for borrower state
     */
    getPermissionsForState(borrowerState, borrower = {}, context = {}) {
        const statePermissions = this.permissionMatrix[borrowerState] || {};
        const tier = borrower.tier || 'BASIC';
        const tierPerms = this.tierPermissions[tier] || {};
        
        // Combine permissions
        const permissions = {
            ...statePermissions,
            tier: tierPerms,
            groupRole: this.groupRolePermissions[context.groupRole] || this.groupRolePermissions.MEMBER
        };

        // Apply context checks to each permission
        Object.keys(permissions).forEach(action => {
            if (typeof permissions[action] === 'boolean') {
                permissions[action] = this.hasPermission(
                    borrowerState, 
                    action, 
                    { ...context, borrower }
                );
            }
        });

        return permissions;
    }

    /**
     * Get tier-specific permissions
     */
    getTierPermissions(tier) {
        return this.tierPermissions[tier] || this.tierPermissions.BASIC;
    }

    /**
     * Get group role permissions
     */
    getGroupRolePermissions(role) {
        return this.groupRolePermissions[role] || this.groupRolePermissions.MEMBER;
    }

    /**
     * Check if borrower can perform cross-group borrowing
     */
    canCrossGroupBorrow(borrower) {
        const tierPerms = this.getTierPermissions(borrower.tier);
        
        // STRICT RULE: Must be in ELIGIBLE state
        if (borrower.state !== 'ELIGIBLE') return false;
        
        // STRICT RULE: Must have tier permission
        if (!tierPerms.canCrossGroupBorrow) return false;
        
        // STRICT RULE: Good rating required
        if (!this.hasGoodRating(borrower)) return false;
        
        // STRICT RULE: Not blacklisted
        if (borrower.isBlacklisted) return false;
        
        // STRICT RULE: No active loans in any group
        if (this.hasActiveLoan(borrower)) return false;

        return true;
    }

    /**
     * Check if borrower can migrate to new group
     */
    canMigrateGroup(borrower, sourceGroupId, targetGroupId) {
        // STRICT RULE: Good repayment record
        if (!this.hasGoodRepaymentRecord(borrower, sourceGroupId)) return false;
        
        // STRICT RULE: Referral from someone in target group
        if (!context.referralFromTargetGroup) return false;
        
        // STRICT RULE: Max 4 groups total
        if (borrower.groupIds && borrower.groupIds.length >= 4) return false;
        
        // STRICT RULE: Same country
        if (borrower.countryCode !== context.targetGroupCountry) return false;

        return true;
    }

    /**
     * Check if borrower has good repayment record in group
     */
    hasGoodRepaymentRecord(borrower, groupId) {
        if (!borrower.loanHistory) return false;
        
        const groupLoans = borrower.loanHistory.filter(loan => loan.groupId === groupId);
        
        if (groupLoans.length === 0) return true; // No loans yet
        
        const defaultedLoans = groupLoans.filter(loan => loan.status === 'DEFAULTED');
        const repaymentRate = (groupLoans.length - defaultedLoans.length) / groupLoans.length;
        
        return repaymentRate >= 0.9; // 90% repayment rate minimum
    }

    /**
     * Validate borrower can access country-specific content
     */
    canAccessCountryContent(borrower, countryCode) {
        // STRICT RULE: Country isolation
        return borrower.countryCode === countryCode;
    }

    /**
     * Get UI visibility flags for borrower dashboard
     */
    getDashboardVisibility(borrowerState, borrower = {}) {
        const permissions = this.getPermissionsForState(borrowerState, borrower);
        
        return {
            // Dashboard sections
            showLoanRequest: permissions.requestLoan,
            showActiveLoans: permissions.viewLedger,
            showRepaymentOptions: permissions.makeRepayment,
            showGroupManagement: permissions.viewGroups,
            showHistory: permissions.viewHistory,
            showBlacklistInfo: permissions.viewBlacklist,
            showCollectors: permissions.viewCollectors,
            showDisputeForm: permissions.disputeLoan,
            showRatingForm: permissions.rateLender,
            showAppealForm: permissions.appealBlacklist,
            showInviteMembers: permissions.inviteMembers,
            
            // Action buttons
            canApplyForLoan: permissions.requestLoan,
            canMakeRepayment: permissions.makeRepayment,
            canJoinGroup: permissions.joinGroup,
            canLeaveGroup: permissions.leaveGroup,
            canUpdateProfile: permissions.updateProfile,
            canViewLedger: permissions.viewLedger,
            
            // Restrictions
            isRestricted: borrowerState === 'BLACKLISTED' || borrowerState === 'DEFAULTED',
            canBorrow: permissions.requestLoan,
            canParticipateInGroups: permissions.joinGroup
        };
    }

    /**
     * Export permission configuration for audit
     */
    exportPermissionConfig() {
        return {
            permissionMatrix: this.permissionMatrix,
            tierPermissions: this.tierPermissions,
            groupRolePermissions: this.groupRolePermissions,
            version: '1.0.0',
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Import permission configuration
     */
    importPermissionConfig(config) {
        if (config.permissionMatrix) this.permissionMatrix = config.permissionMatrix;
        if (config.tierPermissions) this.tierPermissions = config.tierPermissions;
        if (config.groupRolePermissions) this.groupRolePermissions = config.groupRolePermissions;
        
        return this;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BorrowerPermissions };
}

// Browser global export
if (typeof window !== 'undefined') {
    window.BorrowerPermissions = BorrowerPermissions;
}

/**
 * Create borrower permissions instance with default configuration
 */
function createBorrowerPermissions() {
    return new BorrowerPermissions();
}

// Browser and Node.js compatible export
if (typeof window !== 'undefined') {
    window.createBorrowerPermissions = createBorrowerPermissions;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports.createBorrowerPermissions = createBorrowerPermissions;
}