/**
 * M-Pesewa Blacklist Check Flow Orchestrator
 * Verifies user/group against blacklist before allowing actions
 * Enforces strict blacklist rules and admin overrides
 */

class BlacklistCheckFlow {
    constructor() {
        this.currentState = 'IDLE';
        this.states = {
            IDLE: 'IDLE',
            CHECKING: 'CHECKING',
            CLEAN: 'CLEAN',
            FLAGGED: 'FLAGGED',
            BLACKLISTED: 'BLACKLISTED',
            UNDER_REVIEW: 'UNDER_REVIEW',
            APPEAL_PENDING: 'APPEAL_PENDING',
            CLEARED: 'CLEARED',
            ADMIN_OVERRIDE: 'ADMIN_OVERRIDE'
        };
        
        this.checkResult = null;
        this.userData = null;
        this.blacklistEntry = null;
        this.checkContext = null;
    }

    // MAIN BLACKLIST CHECK METHODS

    async checkUser(userId, context = {}) {
        try {
            this.currentState = this.states.CHECKING;
            this.checkContext = context;
            
            // Load user data
            this.userData = await this.getUserData(userId);
            
            if (!this.userData) {
                throw new Error('User not found');
            }
            
            // Check if user is blacklisted
            const blacklistStatus = await this.checkBlacklistStatus(userId);
            
            if (blacklistStatus.blacklisted) {
                this.currentState = this.states.BLACKLISTED;
                this.blacklistEntry = blacklistEntry;
                
                return {
                    success: false,
                    state: this.currentState,
                    blacklisted: true,
                    entry: blacklistStatus.entry,
                    restrictions: this.getBlacklistRestrictions(),
                    message: 'User is blacklisted',
                    action: 'APPEAL_OR_REPAY'
                };
            }
            
            // Check if user has any flags
            const flags = await this.checkUserFlags(userId);
            
            if (flags.length > 0) {
                this.currentState = this.states.FLAGGED;
                
                return {
                    success: true,
                    state: this.currentState,
                    blacklisted: false,
                    flagged: true,
                    flags: flags,
                    warning: 'User has warning flags',
                    message: 'User check completed with flags'
                };
            }
            
            // User is clean
            this.currentState = this.states.CLEAN;
            
            return {
                success: true,
                state: this.currentState,
                blacklisted: false,
                flagged: false,
                message: 'User check passed. No blacklist entries found.'
            };
            
        } catch (error) {
            this.currentState = this.states.IDLE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async checkGroup(groupId, context = {}) {
        try {
            this.currentState = this.states.CHECKING;
            this.checkContext = context;
            
            // Load group data
            const groupData = await this.getGroupData(groupId);
            
            if (!groupData) {
                throw new Error('Group not found');
            }
            
            // Check group blacklist status
            const groupBlacklist = await this.checkGroupBlacklist(groupId);
            
            if (groupBlacklist.blacklisted) {
                this.currentState = this.states.BLACKLISTED;
                
                return {
                    success: false,
                    state: this.currentState,
                    blacklisted: true,
                    entityType: 'GROUP',
                    entry: groupBlacklist.entry,
                    restrictions: this.getGroupBlacklistRestrictions(),
                    message: 'Group is blacklisted'
                };
            }
            
            // Check group member blacklist rates
            const memberStats = await this.getGroupMemberBlacklistStats(groupId);
            
            if (memberStats.blacklistRate > 0.3) { // 30% threshold
                this.currentState = this.states.FLAGGED;
                
                return {
                    success: true,
                    state: this.currentState,
                    blacklisted: false,
                    flagged: true,
                    stats: memberStats,
                    warning: 'High blacklist rate among group members',
                    message: 'Group check completed with warning'
                };
            }
            
            this.currentState = this.states.CLEAN;
            
            return {
                success: true,
                state: this.currentState,
                blacklisted: false,
                flagged: false,
                stats: memberStats,
                message: 'Group check passed'
            };
            
        } catch (error) {
            this.currentState = this.states.IDLE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async checkBeforeAction(userId, actionType, actionData = {}) {
        try {
            this.currentState = this.states.CHECKING;
            this.checkContext = {
                actionType: actionType,
                ...actionData
            };
            
            // Get user data
            this.userData = await this.getUserData(userId);
            
            if (!this.userData) {
                throw new Error('User not found');
            }
            
            // Action-specific checks
            let checkResult;
            
            switch (actionType) {
                case 'BORROW':
                    checkResult = await this.checkBeforeBorrow(userId, actionData);
                    break;
                    
                case 'LEND':
                    checkResult = await this.checkBeforeLend(userId, actionData);
                    break;
                    
                case 'JOIN_GROUP':
                    checkResult = await this.checkBeforeJoinGroup(userId, actionData);
                    break;
                    
                case 'CREATE_GROUP':
                    checkResult = await this.checkBeforeCreateGroup(userId, actionData);
                    break;
                    
                case 'RATE_USER':
                    checkResult = await this.checkBeforeRate(userId, actionData);
                    break;
                    
                default:
                    // General blacklist check
                    checkResult = await this.checkUser(userId, this.checkContext);
            }
            
            this.checkResult = checkResult;
            
            if (checkResult.blacklisted) {
                this.currentState = this.states.BLACKLISTED;
                return {
                    blocked: true,
                    reason: 'USER_BLACKLISTED',
                    details: checkResult,
                    message: 'Action blocked: User is blacklisted'
                };
            }
            
            if (checkResult.flagged && actionType === 'BORROW') {
                // For borrowing, flags might block the action
                const blockBorrow = await this.shouldBlockBorrowDueToFlags(userId, actionData);
                
                if (blockBorrow) {
                    this.currentState = this.states.FLAGGED;
                    return {
                        blocked: true,
                        reason: 'USER_FLAGGED',
                        details: checkResult,
                        message: 'Action blocked: User has warning flags'
                    };
                }
            }
            
            this.currentState = this.states.CLEAN;
            return {
                blocked: false,
                details: checkResult,
                message: 'Action check passed'
            };
            
        } catch (error) {
            this.currentState = this.states.IDLE;
            return {
                blocked: true,
                error: error.message,
                message: 'Action check failed'
            };
        }
    }

    async addToBlacklist(blacklistData) {
        try {
            // Validate blacklist data
            const validation = this.validateBlacklistData(blacklistData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Check if user is already blacklisted
            const existing = await this.getBlacklistEntry(blacklistData.userId);
            if (existing && existing.status === 'ACTIVE') {
                return {
                    success: false,
                    message: 'User is already blacklisted',
                    existingEntry: existing
                };
            }
            
            // Create blacklist entry
            const blacklistEntry = this.createBlacklistEntry(blacklistData);
            
            // Store entry
            await this.storeBlacklistEntry(blacklistEntry);
            
            // Apply restrictions
            await this.applyBlacklistRestrictions(blacklistData.userId, blacklistEntry);
            
            // Notify user
            await this.notifyUserOfBlacklisting(blacklistData.userId, blacklistEntry);
            
            // Log action
            await this.logBlacklistAction(blacklistData, blacklistEntry);
            
            return {
                success: true,
                entryId: blacklistEntry.id,
                userId: blacklistData.userId,
                restrictionsApplied: true,
                message: 'User added to blacklist successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async removeFromBlacklist(userId, removalData) {
        try {
            // Get blacklist entry
            const blacklistEntry = await this.getBlacklistEntry(userId);
            
            if (!blacklistEntry || blacklistEntry.status !== 'ACTIVE') {
                return {
                    success: false,
                    message: 'User is not blacklisted'
                };
            }
            
            // Check if requester has permission
            const canRemove = await this.canRemoveFromBlacklist(removalData.requesterId, blacklistEntry);
            
            if (!canRemove) {
                return {
                    success: false,
                    message: 'Not authorized to remove blacklist entry'
                };
            }
            
            // Validate removal reason
            if (removalData.reason === 'REPAID' && !removalData.proofOfPayment) {
                return {
                    success: false,
                    message: 'Proof of payment required for repayment-based removal'
                };
            }
            
            // Update blacklist entry
            const updatedEntry = await this.updateBlacklistEntryStatus(
                blacklistEntry.id, 
                'REMOVED', 
                removalData
            );
            
            // Remove restrictions
            await this.removeBlacklistRestrictions(userId);
            
            // Notify user
            await this.notifyUserOfRemoval(userId, updatedEntry);
            
            // Log action
            await this.logRemovalAction(userId, removalData, updatedEntry);
            
            return {
                success: true,
                entryId: blacklistEntry.id,
                userId: userId,
                status: 'REMOVED',
                message: 'User removed from blacklist successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async appealBlacklist(userId, appealData) {
        try {
            // Get blacklist entry
            const blacklistEntry = await this.getBlacklistEntry(userId);
            
            if (!blacklistEntry || blacklistEntry.status !== 'ACTIVE') {
                return {
                    success: false,
                    message: 'User is not blacklisted'
                };
            }
            
            // Create appeal
            const appeal = this.createAppeal(blacklistEntry.id, appealData);
            
            // Store appeal
            await this.storeAppeal(appeal);
            
            // Update blacklist entry status
            await this.updateBlacklistEntryStatus(blacklistEntry.id, 'UNDER_REVIEW', {
                appealId: appeal.id
            });
            
            this.currentState = this.states.APPEAL_PENDING;
            
            // Notify admin
            await this.notifyAdminOfAppeal(appeal);
            
            return {
                success: true,
                appealId: appeal.id,
                status: 'APPEAL_PENDING',
                estimatedReviewTime: '3-5 business days',
                message: 'Blacklist appeal submitted successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async reviewAppeal(appealId, reviewData) {
        try {
            // Get appeal
            const appeal = await this.getAppeal(appealId);
            
            if (!appeal) {
                throw new Error('Appeal not found');
            }
            
            // Check if reviewer is admin
            const isAdmin = await this.isAdmin(reviewData.reviewerId);
            if (!isAdmin) {
                throw new Error('Only admins can review appeals');
            }
            
            // Get blacklist entry
            const blacklistEntry = await this.getBlacklistEntryById(appeal.blacklistEntryId);
            
            if (!blacklistEntry) {
                throw new Error('Blacklist entry not found');
            }
            
            // Process review
            let newStatus;
            let message;
            
            if (reviewData.approved) {
                newStatus = 'CLEARED';
                message = 'Appeal approved. User removed from blacklist.';
                
                // Remove restrictions
                await this.removeBlacklistRestrictions(blacklistEntry.userId);
                
                // Update blacklist entry
                await this.updateBlacklistEntryStatus(
                    blacklistEntry.id, 
                    'CLEARED', 
                    reviewData
                );
                
            } else {
                newStatus = 'ACTIVE';
                message = 'Appeal rejected. Blacklist status remains.';
                
                // Update blacklist entry
                await this.updateBlacklistEntryStatus(
                    blacklistEntry.id, 
                    'ACTIVE', 
                    { ...reviewData, appealRejected: true }
                );
            }
            
            // Update appeal status
            await this.updateAppealStatus(appealId, reviewData.approved ? 'APPROVED' : 'REJECTED', reviewData);
            
            // Notify user of decision
            await this.notifyUserOfAppealDecision(blacklistEntry.userId, reviewData.approved, reviewData.reason);
            
            this.currentState = newStatus === 'CLEARED' ? this.states.CLEARED : this.states.BLACKLISTED;
            
            return {
                success: true,
                appealId: appealId,
                userId: blacklistEntry.userId,
                decision: reviewData.approved ? 'APPROVED' : 'REJECTED',
                newStatus: newStatus,
                message: message
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async adminOverride(userId, overrideData) {
        try {
            // Verify admin permissions
            const isAdmin = await this.isAdmin(overrideData.adminId);
            if (!isAdmin) {
                throw new Error('Admin permissions required');
            }
            
            // Get user data
            const userData = await this.getUserData(userId);
            if (!userData) {
                throw new Error('User not found');
            }
            
            // Perform override action
            let result;
            
            switch (overrideData.action) {
                case 'REMOVE_BLACKLIST':
                    result = await this.adminRemoveBlacklist(userId, overrideData);
                    break;
                    
                case 'ADD_BLACKLIST':
                    result = await this.adminAddBlacklist(userId, overrideData);
                    break;
                    
                case 'MODIFY_ENTRY':
                    result = await this.adminModifyEntry(userId, overrideData);
                    break;
                    
                case 'VIEW_HISTORY':
                    result = await this.getUserBlacklistHistory(userId);
                    break;
                    
                default:
                    throw new Error('Invalid admin action');
            }
            
            this.currentState = this.states.ADMIN_OVERRIDE;
            
            // Log admin action
            await this.logAdminAction(overrideData.adminId, userId, overrideData.action, result);
            
            return {
                success: true,
                action: overrideData.action,
                userId: userId,
                result: result,
                message: `Admin override completed: ${overrideData.action}`
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // HELPER METHODS

    async getUserData(userId) {
        // Try borrowers first
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        let user = borrowers.find(b => b.userId === userId);
        
        if (!user) {
            // Try lenders
            const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
            user = lenders.find(l => l.userId === userId);
        }
        
        if (!user) {
            // Try general users
            const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
            user = users.find(u => u.userId === userId);
        }
        
        return user;
    }

    async checkBlacklistStatus(userId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        
        const activeEntry = blacklist.find(entry => 
            entry.userId === userId && 
            entry.status === 'ACTIVE'
        );
        
        if (activeEntry) {
            return {
                blacklisted: true,
                entry: activeEntry,
                daysBlacklisted: this.calculateDaysBlacklisted(activeEntry),
                amountOwed: activeEntry.amountOwed || 0
            };
        }
        
        return {
            blacklisted: false,
            entry: null
        };
    }

    async checkUserFlags(userId) {
        const flags = JSON.parse(localStorage.getItem('mpesewa_user_flags') || '[]');
        return flags.filter(flag => 
            flag.userId === userId && 
            flag.status === 'ACTIVE'
        );
    }

    getBlacklistRestrictions() {
        return {
            cannotBorrow: true,
            cannotJoinNewGroups: true,
            cannotCreateLoans: true,
            visibleBadge: true,
            platformWideVisibility: true,
            restrictionsApply: 'ALL_GROUPS'
        };
    }

    async getGroupData(groupId) {
        // Get group from any country
        const countries = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'DRC', 
                         'South Sudan', 'South Africa', 'Nigeria', 'Ghana', 'Ethiopia'];
        
        for (const country of countries) {
            const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${country}`) || '[]');
            const group = groups.find(g => g.id === groupId);
            
            if (group) {
                group.country = country;
                return group;
            }
        }
        
        return null;
    }

    async checkGroupBlacklist(groupId) {
        const groupBlacklist = JSON.parse(localStorage.getItem('mpesewa_group_blacklist') || '[]');
        
        const activeEntry = groupBlacklist.find(entry => 
            entry.groupId === groupId && 
            entry.status === 'ACTIVE'
        );
        
        if (activeEntry) {
            return {
                blacklisted: true,
                entry: activeEntry
            };
        }
        
        return {
            blacklisted: false,
            entry: null
        };
    }

    getGroupBlacklistRestrictions() {
        return {
            cannotAddNewMembers: true,
            cannotCreateNewLoans: true,
            existingLoansContinue: true,
            groupFrozen: true,
            adminNotified: true
        };
    }

    async getGroupMemberBlacklistStats(groupId) {
        // Get all members of the group
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        const groupMembers = userGroups.filter(ug => ug.groupId === groupId);
        
        // Check blacklist status for each member
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        
        let blacklistedCount = 0;
        const blacklistedMembers = [];
        
        for (const member of groupMembers) {
            const isBlacklisted = blacklist.some(entry => 
                entry.userId === member.userId && 
                entry.status === 'ACTIVE'
            );
            
            if (isBlacklisted) {
                blacklistedCount++;
                blacklistedMembers.push(member.userId);
            }
        }
        
        const totalMembers = groupMembers.length;
        const blacklistRate = totalMembers > 0 ? blacklistedCount / totalMembers : 0;
        
        return {
            totalMembers: totalMembers,
            blacklistedCount: blacklistedCount,
            blacklistRate: blacklistRate,
            blacklistedMembers: blacklistedMembers,
            riskLevel: this.calculateRiskLevel(blacklistRate)
        };
    }

    calculateRiskLevel(blacklistRate) {
        if (blacklistRate === 0) return 'LOW';
        if (blacklistRate <= 0.1) return 'MEDIUM';
        if (blacklistRate <= 0.3) return 'HIGH';
        return 'CRITICAL';
    }

    async checkBeforeBorrow(userId, actionData) {
        // Check user blacklist status
        const userCheck = await this.checkUser(userId, { action: 'BORROW', ...actionData });
        
        if (userCheck.blacklisted) {
            return userCheck;
        }
        
        // Check if user has too many active loans
        const activeLoans = await this.getActiveLoansCount(userId, actionData.groupId);
        if (activeLoans >= 1) { // Max 1 active loan per group
            return {
                blacklisted: false,
                flagged: true,
                flags: [{
                    type: 'MAX_ACTIVE_LOANS',
                    message: 'Already has active loan in this group',
                    severity: 'HIGH'
                }],
                blocked: true
            };
        }
        
        // Check repayment history
        const repaymentHistory = await this.getRepaymentHistory(userId);
        if (repaymentHistory.defaultRate > 0.5) { // 50% default rate
            return {
                blacklisted: false,
                flagged: true,
                flags: [{
                    type: 'HIGH_DEFAULT_RATE',
                    message: 'High default rate in repayment history',
                    severity: 'MEDIUM'
                }],
                warning: 'High risk borrower'
            };
        }
        
        return userCheck;
    }

    async checkBeforeLend(userId, actionData) {
        // Check user blacklist status
        const userCheck = await this.checkUser(userId, { action: 'LEND', ...actionData });
        
        if (userCheck.blacklisted) {
            return userCheck;
        }
        
        // Check subscription status for lenders
        const subscription = await this.getUserSubscription(userId);
        if (!subscription || subscription.status !== 'ACTIVE') {
            return {
                blacklisted: false,
                flagged: true,
                flags: [{
                    type: 'NO_ACTIVE_SUBSCRIPTION',
                    message: 'Lender does not have active subscription',
                    severity: 'HIGH'
                }],
                blocked: true
            };
        }
        
        // Check weekly lending limit
        const weeklyLent = await this.getWeeklyLentAmount(userId);
        const limit = subscription.weeklyLimit || 0;
        
        if (weeklyLent >= limit) {
            return {
                blacklisted: false,
                flagged: true,
                flags: [{
                    type: 'WEEKLY_LIMIT_REACHED',
                    message: 'Weekly lending limit reached',
                    severity: 'MEDIUM'
                }],
                blocked: true
            };
        }
        
        return userCheck;
    }

    async checkBeforeJoinGroup(userId, actionData) {
        // Check user blacklist status
        const userCheck = await this.checkUser(userId, { action: 'JOIN_GROUP', ...actionData });
        
        if (userCheck.blacklisted) {
            return {
                ...userCheck,
                blocked: true,
                restriction: 'BLACKLISTED_USERS_CANNOT_JOIN_GROUPS'
            };
        }
        
        // Check if user is already in 4 groups (max for borrowers)
        const userGroups = await this.getUserGroups(userId);
        if (userGroups.length >= 4) {
            return {
                blacklisted: false,
                flagged: true,
                flags: [{
                    type: 'MAX_GROUPS_REACHED',
                    message: 'Already in maximum of 4 groups',
                    severity: 'MEDIUM'
                }],
                blocked: true
            };
        }
        
        // Check group blacklist status
        const groupCheck = await this.checkGroup(actionData.groupId, { action: 'JOIN_GROUP' });
        
        if (groupCheck.blacklisted) {
            return {
                blacklisted: false,
                flagged: true,
                flags: [{
                    type: 'GROUP_BLACKLISTED',
                    message: 'Target group is blacklisted',
                    severity: 'HIGH'
                }],
                blocked: true
            };
        }
        
        return userCheck;
    }

    async checkBeforeCreateGroup(userId, actionData) {
        // Check user blacklist status
        const userCheck = await this.checkUser(userId, { action: 'CREATE_GROUP', ...actionData });
        
        if (userCheck.blacklisted) {
            return {
                ...userCheck,
                blocked: true,
                restriction: 'BLACKLISTED_USERS_CANNOT_CREATE_GROUPS'
            };
        }
        
        // Check if user has good rating (minimum 4 stars)
        const userRating = await this.getUserRating(userId);
        if (userRating < 4) {
            return {
                blacklisted: false,
                flagged: true,
                flags: [{
                    type: 'LOW_RATING',
                    message: 'Insufficient rating to create group',
                    severity: 'MEDIUM'
                }],
                blocked: true
            };
        }
        
        return userCheck;
    }

    async checkBeforeRate(userId, actionData) {
        // Check if rater is blacklisted
        const raterCheck = await this.checkUser(userId, { action: 'RATE_USER', ...actionData });
        
        if (raterCheck.blacklisted) {
            return {
                ...raterCheck,
                blocked: true,
                restriction: 'BLACKLISTED_USERS_CANNOT_RATE_OTHERS'
            };
        }
        
        // Check if user being rated is in same group
        const sameGroup = await this.areUsersInSameGroup(userId, actionData.rateeId);
        if (!sameGroup) {
            return {
                blacklisted: false,
                flagged: true,
                flags: [{
                    type: 'DIFFERENT_GROUP',
                    message: 'Can only rate users in same group',
                    severity: 'MEDIUM'
                }],
                blocked: true
            };
        }
        
        return raterCheck;
    }

    async shouldBlockBorrowDueToFlags(userId, actionData) {
        const flags = await this.checkUserFlags(userId);
        
        // Check for high severity flags that should block borrowing
        const blockingFlags = flags.filter(flag => 
            flag.severity === 'HIGH' || 
            flag.type === 'RECENT_DEFAULT' ||
            flag.type === 'MULTIPLE_OVERDUE'
        );
        
        return blockingFlags.length > 0;
    }

    async getActiveLoansCount(userId, groupId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        
        return loans.filter(loan => 
            loan.borrowerId === userId && 
            loan.groupId === groupId && 
            ['ACTIVE', 'OVERDUE', 'PARTIAL_REPAYMENT'].includes(loan.status)
        ).length;
    }

    async getRepaymentHistory(userId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const userLoans = loans.filter(loan => loan.borrowerId === userId);
        
        const totalLoans = userLoans.length;
        const defaultedLoans = userLoans.filter(loan => loan.status === 'DEFAULTED').length;
        const repaidLoans = userLoans.filter(loan => loan.status === 'CLEARED').length;
        
        return {
            totalLoans: totalLoans,
            defaultedLoans: defaultedLoans,
            repaidLoans: repaidLoans,
            defaultRate: totalLoans > 0 ? defaultedLoans / totalLoans : 0,
            repaymentRate: totalLoans > 0 ? repaidLoans / totalLoans : 1
        };
    }

    async getUserSubscription(userId) {
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        return subscriptions.find(sub => 
            sub.userId === userId && 
            sub.status === 'ACTIVE'
        );
    }

    async getWeeklyLentAmount(userId) {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        
        return loans
            .filter(loan => 
                loan.lenderId === userId && 
                new Date(loan.disbursementDate) > oneWeekAgo
            )
            .reduce((sum, loan) => sum + loan.amount, 0);
    }

    async getUserGroups(userId) {
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        return userGroups.filter(ug => ug.userId === userId && ug.status === 'ACTIVE');
    }

    async getUserRating(userId) {
        const ratings = JSON.parse(localStorage.getItem('mpesewa_ratings') || '[]');
        const userRatings = ratings.filter(r => r.rateeId === userId);
        
        if (userRatings.length === 0) return 5; // Default rating
        
        const total = userRatings.reduce((sum, r) => sum + r.rating, 0);
        return total / userRatings.length;
    }

    async areUsersInSameGroup(userId1, userId2) {
        const user1Groups = await this.getUserGroups(userId1);
        const user2Groups = await this.getUserGroups(userId2);
        
        const user1GroupIds = user1Groups.map(ug => ug.groupId);
        const user2GroupIds = user2Groups.map(ug => ug.groupId);
        
        return user1GroupIds.some(groupId => user2GroupIds.includes(groupId));
    }

    validateBlacklistData(blacklistData) {
        const requiredFields = ['userId', 'reason', 'amountOwed', 'lenderId'];
        
        for (const field of requiredFields) {
            if (!blacklistData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        // Validate reason
        const validReasons = ['DEFAULTED_LOAN', 'FRAUD', 'MISCONDUCT', 'VIOLATION_OF_TERMS'];
        if (!validReasons.includes(blacklistData.reason)) {
            return {
                valid: false,
                message: 'Invalid blacklist reason'
            };
        }
        
        // Validate amount
        if (blacklistData.amountOwed <= 0) {
            return {
                valid: false,
                message: 'Amount owed must be greater than 0'
            };
        }
        
        return {
            valid: true,
            message: 'Blacklist data validated'
        };
    }

    createBlacklistEntry(blacklistData) {
        const entryId = 'BL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        return {
            id: entryId,
            userId: blacklistData.userId,
            lenderId: blacklistData.lenderId,
            groupId: blacklistData.groupId,
            country: blacklistData.country,
            reason: blacklistData.reason,
            amountOwed: blacklistData.amountOwed,
            daysOverdue: blacklistData.daysOverdue || 60, // Default 60 days for default
            evidence: blacklistData.evidence || [],
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            createdBy: blacklistData.createdBy || 'SYSTEM',
            restrictions: this.getBlacklistRestrictions(),
            appealable: true,
            appealDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        };
    }

    async storeBlacklistEntry(entry) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        blacklist.push(entry);
        localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
    }

    async applyBlacklistRestrictions(userId, blacklistEntry) {
        // Update user status
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        const borrowerIndex = borrowers.findIndex(b => b.userId === userId);
        
        if (borrowerIndex !== -1) {
            borrowers[borrowerIndex].blacklisted = true;
            borrowers[borrowerIndex].blacklistEntryId = blacklistEntry.id;
            borrowers[borrowerIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_borrowers', JSON.stringify(borrowers));
        }
        
        // Update user groups to mark as restricted
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        userGroups.forEach(ug => {
            if (ug.userId === userId) {
                ug.blacklisted = true;
            }
        });
        localStorage.setItem('mpesewa_user_groups', JSON.stringify(userGroups));
        
        // Update user permissions
        const permissions = JSON.parse(localStorage.getItem('mpesewa_user_permissions') || '{}');
        if (permissions[userId]) {
            permissions[userId].canBorrow = false;
            permissions[userId].canJoinNewGroups = false;
            localStorage.setItem('mpesewa_user_permissions', JSON.stringify(permissions));
        }
    }

    async notifyUserOfBlacklisting(userId, blacklistEntry) {
        const notification = {
            userId: userId,
            type: 'BLACKLIST_ADDED',
            title: 'Blacklisted',
            message: `You have been blacklisted. Reason: ${blacklistEntry.reason}. Amount owed: ${blacklistEntry.amountOwed}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                entryId: blacklistEntry.id,
                reason: blacklistEntry.reason,
                amountOwed: blacklistEntry.amountOwed,
                appealDeadline: blacklistEntry.appealDeadline
            },
            actionRequired: true,
            actionUrl: '/blacklist/appeal.html'
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async logBlacklistAction(blacklistData, blacklistEntry) {
        const auditLog = {
            action: 'ADD_TO_BLACKLIST',
            userId: blacklistData.createdBy || 'SYSTEM',
            targetUserId: blacklistData.userId,
            entryId: blacklistEntry.id,
            data: {
                reason: blacklistData.reason,
                amountOwed: blacklistData.amountOwed,
                evidence: blacklistData.evidence || []
            },
            timestamp: new Date().toISOString(),
            ip: blacklistData.ip || 'N/A'
        };
        
        const auditLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
        auditLogs.push(auditLog);
        localStorage.setItem('mpesewa_audit_logs', JSON.stringify(auditLogs));
    }

    async getBlacklistEntry(userId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        return blacklist.find(entry => 
            entry.userId === userId && 
            ['ACTIVE', 'UNDER_REVIEW'].includes(entry.status)
        );
    }

    async getBlacklistEntryById(entryId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        return blacklist.find(entry => entry.id === entryId);
    }

    async canRemoveFromBlacklist(requesterId, blacklistEntry) {
        // Check if requester is the lender who blacklisted
        if (requesterId === blacklistEntry.lenderId) {
            return true;
        }
        
        // Check if requester is admin
        const isAdmin = await this.isAdmin(requesterId);
        if (isAdmin) {
            return true;
        }
        
        // Check if requester is the blacklisted user with proof of payment
        if (requesterId === blacklistEntry.userId) {
            // User can request removal with proof of payment
            return true;
        }
        
        return false;
    }

    async isAdmin(userId) {
        const admins = JSON.parse(localStorage.getItem('mpesewa_admins') || '[]');
        return admins.some(admin => admin.userId === userId && admin.active);
    }

    async updateBlacklistEntryStatus(entryId, newStatus, updateData = {}) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        const entryIndex = blacklist.findIndex(entry => entry.id === entryId);
        
        if (entryIndex !== -1) {
            blacklist[entryIndex].status = newStatus;
            blacklist[entryIndex].lastUpdated = new Date().toISOString();
            
            // Add update data
            Object.keys(updateData).forEach(key => {
                if (key !== 'entryId') {
                    blacklist[entryIndex][key] = updateData[key];
                }
            });
            
            // Add status change timestamp
            blacklist[entryIndex].statusHistory = blacklist[entryIndex].statusHistory || [];
            blacklist[entryIndex].statusHistory.push({
                status: newStatus,
                timestamp: new Date().toISOString(),
                updatedBy: updateData.updatedBy || 'SYSTEM'
            });
            
            localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
            
            return blacklist[entryIndex];
        }
        
        return null;
    }

    async removeBlacklistRestrictions(userId) {
        // Update borrower status
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        const borrowerIndex = borrowers.findIndex(b => b.userId === userId);
        
        if (borrowerIndex !== -1) {
            borrowers[borrowerIndex].blacklisted = false;
            borrowers[borrowerIndex].blacklistEntryId = null;
            borrowers[borrowerIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_borrowers', JSON.stringify(borrowers));
        }
        
        // Update user groups
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        userGroups.forEach(ug => {
            if (ug.userId === userId) {
                ug.blacklisted = false;
            }
        });
        localStorage.setItem('mpesewa_user_groups', JSON.stringify(userGroups));
        
        // Update permissions
        const permissions = JSON.parse(localStorage.getItem('mpesewa_user_permissions') || '{}');
        if (permissions[userId]) {
            permissions[userId].canBorrow = true;
            permissions[userId].canJoinNewGroups = true;
            localStorage.setItem('mpesewa_user_permissions', JSON.stringify(permissions));
        }
    }

    async notifyUserOfRemoval(userId, blacklistEntry) {
        const notification = {
            userId: userId,
            type: 'BLACKLIST_REMOVED',
            title: 'Blacklist Removed',
            message: 'You have been removed from the blacklist. All restrictions lifted.',
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                entryId: blacklistEntry.id,
                removedAt: new Date().toISOString()
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async logRemovalAction(userId, removalData, blacklistEntry) {
        const auditLog = {
            action: 'REMOVE_FROM_BLACKLIST',
            userId: removalData.requesterId,
            targetUserId: userId,
            entryId: blacklistEntry.id,
            data: {
                reason: removalData.reason,
                proofOfPayment: removalData.proofOfPayment || null
            },
            timestamp: new Date().toISOString(),
            ip: removalData.ip || 'N/A'
        };
        
        const auditLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
        auditLogs.push(auditLog);
        localStorage.setItem('mpesewa_audit_logs', JSON.stringify(auditLogs));
    }

    createAppeal(blacklistEntryId, appealData) {
        const appealId = 'APPEAL-' + Date.now();
        
        return {
            id: appealId,
            blacklistEntryId: blacklistEntryId,
            userId: appealData.userId,
            reason: appealData.reason,
            explanation: appealData.explanation,
            evidence: appealData.evidence || [],
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            reviewedBy: null,
            reviewedAt: null,
            reviewNotes: null
        };
    }

    async storeAppeal(appeal) {
        const appeals = JSON.parse(localStorage.getItem('mpesewa_appeals') || '[]');
        appeals.push(appeal);
        localStorage.setItem('mpesewa_appeals', JSON.stringify(appeals));
    }

    async notifyAdminOfAppeal(appeal) {
        // Get admins
        const admins = JSON.parse(localStorage.getItem('mpesewa_admins') || '[]');
        
        // Create notification for each admin
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        
        admins.forEach(admin => {
            if (admin.active && admin.notificationsEnabled) {
                const notification = {
                    userId: admin.userId,
                    type: 'BLACKLIST_APPEAL',
                    title: 'New Blacklist Appeal',
                    message: `New blacklist appeal submitted. Appeal ID: ${appeal.id}`,
                    priority: 'HIGH',
                    createdAt: new Date().toISOString(),
                    data: {
                        appealId: appeal.id,
                        userId: appeal.userId
                    },
                    actionRequired: true,
                    actionUrl: `/admin/appeals/review.html?id=${appeal.id}`
                };
                
                notifications.push(notification);
            }
        });
        
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async getAppeal(appealId) {
        const appeals = JSON.parse(localStorage.getItem('mpesewa_appeals') || '[]');
        return appeals.find(appeal => appeal.id === appealId);
    }

    async updateAppealStatus(appealId, status, reviewData) {
        const appeals = JSON.parse(localStorage.getItem('mpesewa_appeals') || '[]');
        const appealIndex = appeals.findIndex(appeal => appeal.id === appealId);
        
        if (appealIndex !== -1) {
            appeals[appealIndex].status = status;
            appeals[appealIndex].reviewedBy = reviewData.reviewerId;
            appeals[appealIndex].reviewedAt = new Date().toISOString();
            appeals[appealIndex].reviewNotes = reviewData.reason;
            
            localStorage.setItem('mpesewa_appeals', JSON.stringify(appeals));
            
            return appeals[appealIndex];
        }
        
        return null;
    }

    async notifyUserOfAppealDecision(userId, approved, reason) {
        const notification = {
            userId: userId,
            type: approved ? 'APPEAL_APPROVED' : 'APPEAL_REJECTED',
            title: approved ? 'Appeal Approved' : 'Appeal Rejected',
            message: approved ? 
                'Your blacklist appeal has been approved. Restrictions removed.' :
                `Your blacklist appeal has been rejected. Reason: ${reason}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                approved: approved,
                reason: reason
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async adminRemoveBlacklist(userId, overrideData) {
        const blacklistEntry = await this.getBlacklistEntry(userId);
        
        if (!blacklistEntry) {
            return {
                removed: false,
                message: 'User not blacklisted'
            };
        }
        
        // Remove from blacklist
        await this.updateBlacklistEntryStatus(blacklistEntry.id, 'ADMIN_REMOVED', {
            updatedBy: overrideData.adminId,
            adminReason: overrideData.reason
        });
        
        // Remove restrictions
        await this.removeBlacklistRestrictions(userId);
        
        return {
            removed: true,
            entryId: blacklistEntry.id,
            message: 'Admin override: Blacklist removed'
        };
    }

    async adminAddBlacklist(userId, overrideData) {
        // Check if already blacklisted
        const existing = await this.getBlacklistEntry(userId);
        if (existing) {
            return {
                added: false,
                message: 'User already blacklisted'
            };
        }
        
        // Create blacklist entry
        const blacklistData = {
            userId: userId,
            reason: overrideData.reason || 'ADMIN_OVERRIDE',
            amountOwed: overrideData.amountOwed || 0,
            lenderId: overrideData.adminId,
            createdBy: overrideData.adminId,
            evidence: overrideData.evidence || []
        };
        
        const result = await this.addToBlacklist(blacklistData);
        
        return {
            added: result.success,
            entryId: result.entryId,
            message: 'Admin override: Added to blacklist'
        };
    }

    async adminModifyEntry(userId, overrideData) {
        const blacklistEntry = await this.getBlacklistEntry(userId);
        
        if (!blacklistEntry) {
            return {
                modified: false,
                message: 'User not blacklisted'
            };
        }
        
        // Update entry
        const updates = {};
        if (overrideData.newAmount) updates.amountOwed = overrideData.newAmount;
        if (overrideData.newReason) updates.reason = overrideData.newReason;
        if (overrideData.newStatus) updates.status = overrideData.newStatus;
        
        Object.keys(updates).forEach(key => {
            blacklistEntry[key] = updates[key];
        });
        
        blacklistEntry.lastUpdated = new Date().toISOString();
        blacklistEntry.modifiedByAdmin = overrideData.adminId;
        blacklistEntry.modificationReason = overrideData.reason;
        
        // Save updated entry
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        const entryIndex = blacklist.findIndex(entry => entry.id === blacklistEntry.id);
        
        if (entryIndex !== -1) {
            blacklist[entryIndex] = blacklistEntry;
            localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
        }
        
        return {
            modified: true,
            entryId: blacklistEntry.id,
            updates: updates,
            message: 'Admin override: Blacklist entry modified'
        };
    }

    async getUserBlacklistHistory(userId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        return blacklist.filter(entry => entry.userId === userId);
    }

    async logAdminAction(adminId, userId, action, result) {
        const auditLog = {
            action: `ADMIN_${action}`,
            userId: adminId,
            targetUserId: userId,
            data: result,
            timestamp: new Date().toISOString(),
            adminAction: true
        };
        
        const auditLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
        auditLogs.push(auditLog);
        localStorage.setItem('mpesewa_audit_logs', JSON.stringify(auditLogs));
    }

    calculateDaysBlacklisted(blacklistEntry) {
        const createdDate = new Date(blacklistEntry.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Public API methods
    getCurrentState() {
        return {
            state: this.currentState,
            userData: this.userData ? {
                userId: this.userData.userId,
                name: this.userData.fullName
            } : null,
            checkResult: this.checkResult,
            blacklistEntry: this.blacklistEntry
        };
    }

    reset() {
        this.currentState = 'IDLE';
        this.checkResult = null;
        this.userData = null;
        this.blacklistEntry = null;
        this.checkContext = null;
    }

    async getPublicBlacklist() {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        
        return blacklist
            .filter(entry => entry.status === 'ACTIVE')
            .map(entry => ({
                userId: entry.userId,
                reason: entry.reason,
                amountOwed: entry.amountOwed,
                daysOverdue: entry.daysOverdue,
                country: entry.country,
                groupId: entry.groupId,
                createdAt: entry.createdAt
            }));
    }

    async getBlacklistStats() {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        const activeEntries = blacklist.filter(entry => entry.status === 'ACTIVE');
        
        // Calculate statistics
        const total = activeEntries.length;
        const totalAmount = activeEntries.reduce((sum, entry) => sum + (entry.amountOwed || 0), 0);
        
        // Group by reason
        const byReason = {};
        activeEntries.forEach(entry => {
            byReason[entry.reason] = (byReason[entry.reason] || 0) + 1;
        });
        
        // Group by country
        const byCountry = {};
        activeEntries.forEach(entry => {
            byCountry[entry.country] = (byCountry[entry.country] || 0) + 1;
        });
        
        return {
            total: total,
            totalAmount: totalAmount,
            averageAmount: total > 0 ? totalAmount / total : 0,
            byReason: byReason,
            byCountry: byCountry,
            lastUpdated: new Date().toISOString()
        };
    }

    async searchBlacklist(searchCriteria) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        
        return blacklist.filter(entry => {
            // Search by user ID
            if (searchCriteria.userId && entry.userId !== searchCriteria.userId) {
                return false;
            }
            
            // Search by country
            if (searchCriteria.country && entry.country !== searchCriteria.country) {
                return false;
            }
            
            // Search by group
            if (searchCriteria.groupId && entry.groupId !== searchCriteria.groupId) {
                return false;
            }
            
            // Search by reason
            if (searchCriteria.reason && entry.reason !== searchCriteria.reason) {
                return false;
            }
            
            // Search by status
            if (searchCriteria.status && entry.status !== searchCriteria.status) {
                return false;
            }
            
            // Search by amount range
            if (searchCriteria.minAmount && entry.amountOwed < searchCriteria.minAmount) {
                return false;
            }
            
            if (searchCriteria.maxAmount && entry.amountOwed > searchCriteria.maxAmount) {
                return false;
            }
            
            return true;
        });
    }
}

// Export singleton instance
const blacklistCheckFlow = new BlacklistCheckFlow();
export default blacklistCheckFlow;