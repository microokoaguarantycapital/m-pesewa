/**
 * M-PESEWA Group Service
 * STRICT HIERARCHY: Global → Country → Groups → Lenders → Borrowers (Ledgers)
 * Non-negotiable structure enforcement
 */

class GroupService {
    constructor() {
        this.currentCountry = this.getCurrentCountry();
        this.currentUser = this.getCurrentUser();
        this.groupStateMachine = new GroupStateMachine();
    }

    /**
     * Get current country from localStorage
     * @returns {string} Current country code
     */
    getCurrentCountry() {
        const country = localStorage.getItem('mpesewa_country');
        if (!country) {
            console.error('No country selected. Redirecting to country selection.');
            window.location.href = 'pages/countries/';
            return null;
        }
        return country;
    }

    /**
     * Get current user from auth state
     * @returns {object} User object with roles and permissions
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('mpesewa_user');
        if (!userStr) return null;
        
        try {
            const user = JSON.parse(userStr);
            return {
                id: user.id,
                username: user.username,
                roles: user.roles || [],
                country: user.country,
                groupIds: user.groupIds || [],
                subscription: user.subscription,
                rating: user.rating || 5.0,
                blacklisted: user.blacklisted || false
            };
        } catch (e) {
            console.error('Failed to parse user data:', e);
            return null;
        }
    }

    /**
     * Create a new group with strict hierarchy enforcement
     * @param {object} groupData - Group creation data
     * @returns {object} Created group or error
     */
    async createGroup(groupData) {
        // VALIDATION CHAIN
        const validation = await this.validateGroupCreation(groupData);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
                code: validation.code
            };
        }

        // ENFORCE HIERARCHY: Country → Groups
        const groupId = this.generateGroupId();
        
        const group = {
            id: groupId,
            name: groupData.name,
            nickname: groupData.nickname,
            description: groupData.description,
            country: this.currentCountry,
            type: groupData.type || 'Family',
            adminUserId: this.currentUser.id,
            adminUsername: this.currentUser.username,
            
            // State management
            state: 'CREATED',
            stateHistory: [{
                state: 'CREATED',
                timestamp: new Date().toISOString(),
                userId: this.currentUser.id
            }],
            
            // Membership
            members: [{
                userId: this.currentUser.id,
                username: this.currentUser.username,
                role: 'ADMIN',
                joinedAt: new Date().toISOString(),
                invitedBy: 'SELF_CREATED'
            }],
            memberCount: 1,
            maxMembers: 1000,
            
            // Financial stats
            totalAmountLent: 0,
            successfulRepaymentRate: 0,
            totalLoans: 0,
            activeLoans: 0,
            
            // Counts
            lenderCount: 0,
            borrowerCount: 0,
            
            // Metadata
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: this.currentUser.id,
            countryFlag: this.getCountryFlag(this.currentCountry),
            currency: this.getCurrencyForCountry(this.currentCountry),
            
            // Group-specific rules
            internalRules: groupData.internalRules || '',
            inviteOnly: true,
            referralRequired: true,
            
            // Reputation
            groupRating: 5.0,
            trustScore: 100
        };

        // TRANSITION TO ACTIVE if admin has subscription (for lender groups)
        if (this.currentUser.roles.includes('LENDER')) {
            const canActivate = await this.validateAdminSubscription(this.currentUser);
            if (canActivate) {
                await this.groupStateMachine.transition(group, 'ACTIVATE', this.currentUser);
            }
        }

        // Save to localStorage (simulating backend)
        this.saveGroup(group);
        
        // Update user's group membership
        this.addUserToGroup(this.currentUser.id, groupId, 'ADMIN');

        return {
            success: true,
            group: group,
            message: `Group "${group.name}" created successfully in ${this.currentCountry}`
        };
    }

    /**
     * Join an existing group with referral validation
     * @param {string} groupId - Group ID to join
     * @param {object} referralData - Referral information
     * @returns {object} Result of join operation
     */
    async joinGroup(groupId, referralData) {
        const group = this.getGroup(groupId);
        if (!group) {
            return {
                success: false,
                error: 'Group not found',
                code: 'GROUP_NOT_FOUND'
            };
        }

        // ENFORCE HIERARCHY: Country isolation
        if (group.country !== this.currentCountry) {
            return {
                success: false,
                error: 'Cannot join group from different country',
                code: 'CROSS_COUNTRY_VIOLATION'
            };
        }

        // ENFORCE: Group state must be ACTIVE
        if (group.state !== 'ACTIVE') {
            return {
                success: false,
                error: `Group is ${group.state.toLowerCase()}. Cannot join at this time.`,
                code: 'GROUP_INACTIVE'
            };
        }

        // ENFORCE: Max 4 groups per user (for borrowers)
        if (this.currentUser.roles.includes('BORROWER')) {
            const userGroups = this.getUserGroups(this.currentUser.id);
            if (userGroups.length >= 4) {
                // Check if user has good rating
                if (this.currentUser.rating < 4.0) {
                    return {
                        success: false,
                        error: 'Maximum of 4 groups reached. Requires good rating (4.0+) to join more.',
                        code: 'MAX_GROUPS_REACHED'
                    };
                }
            }
        }

        // ENFORCE: Referral validation
        const referralValid = await this.validateReferral(groupId, referralData);
        if (!referralValid) {
            return {
                success: false,
                error: 'Invalid referral. Must be referred by existing group member.',
                code: 'INVALID_REFERRAL'
            };
        }

        // ENFORCE: Group capacity
        if (group.memberCount >= group.maxMembers) {
            return {
                success: false,
                error: 'Group is at maximum capacity (1000 members)',
                code: 'GROUP_FULL'
            };
        }

        // Add user to group
        const memberRole = this.currentUser.roles.includes('LENDER') ? 'LENDER' : 'BORROWER';
        
        const newMember = {
            userId: this.currentUser.id,
            username: this.currentUser.username,
            role: memberRole,
            joinedAt: new Date().toISOString(),
            invitedBy: referralData.referrerId,
            rating: this.currentUser.rating,
            blacklisted: this.currentUser.blacklisted
        };

        group.members.push(newMember);
        group.memberCount++;
        
        if (memberRole === 'LENDER') {
            group.lenderCount++;
        } else {
            group.borrowerCount++;
        }

        group.updatedAt = new Date().toISOString();
        
        // Update group stats
        this.updateGroupStats(group);
        
        // Save changes
        this.saveGroup(group);
        
        // Update user's group list
        this.addUserToGroup(this.currentUser.id, groupId, memberRole);

        // Audit log
        this.auditLog({
            action: 'JOIN_GROUP',
            groupId: groupId,
            userId: this.currentUser.id,
            details: { role: memberRole, referrer: referralData.referrerId },
            timestamp: new Date().toISOString()
        });

        return {
            success: true,
            group: group,
            member: newMember,
            message: `Successfully joined group "${group.name}" as ${memberRole}`
        };
    }

    /**
     * Get all groups for current country
     * @returns {Array} List of groups in current country
     */
    getGroupsForCurrentCountry() {
        const groups = this.getAllGroups();
        return groups.filter(group => group.country === this.currentCountry);
    }

    /**
     * Get group dashboard data
     * @param {string} groupId - Group ID
     * @returns {object} Dashboard data
     */
    getGroupDashboard(groupId) {
        const group = this.getGroup(groupId);
        if (!group) return null;

        // ENFORCE: User must be member of group
        const isMember = group.members.some(m => m.userId === this.currentUser.id);
        if (!isMember) {
            return {
                error: 'Access denied. You are not a member of this group.',
                code: 'NOT_MEMBER'
            };
        }

        const dashboard = {
            groupInfo: {
                id: group.id,
                name: group.name,
                nickname: group.nickname,
                type: group.type,
                country: group.country,
                state: group.state,
                flag: group.countryFlag,
                currency: group.currency
            },
            
            stats: {
                totalMembers: group.memberCount,
                lenders: group.lenderCount,
                borrowers: group.borrowerCount,
                totalAmountLent: group.totalAmountLent,
                repaymentRate: group.successfulRepaymentRate,
                activeLoans: group.activeLoans,
                totalLoans: group.totalLoans,
                groupRating: group.groupRating,
                trustScore: group.trustScore
            },
            
            financials: {
                weeklyLimit: this.getWeeklyLimitForGroup(group),
                availableLenders: this.getActiveLenders(group),
                loanCategories: this.getGroupLoanCategories(group),
                recentActivity: this.getGroupRecentActivity(groupId)
            },
            
            members: {
                admin: group.members.find(m => m.role === 'ADMIN'),
                topLenders: this.getTopLenders(group),
                recentBorrowers: this.getRecentBorrowers(group),
                memberList: group.members.slice(0, 50) // First 50 members
            },
            
            restrictions: {
                canCreateLoan: this.canCreateLoan(group),
                canLend: this.canLendInGroup(group),
                canInvite: this.canInviteMembers(group),
                stateRestrictions: this.getStateRestrictions(group.state)
            },
            
            timestamp: new Date().toISOString()
        };

        return dashboard;
    }

    /**
     * Validate group creation data
     * @param {object} groupData - Group data to validate
     * @returns {object} Validation result
     */
    async validateGroupCreation(groupData) {
        const errors = [];
        
        // Required fields
        if (!groupData.name || groupData.name.trim().length < 3) {
            errors.push('Group name must be at least 3 characters');
        }
        
        if (!groupData.type) {
            errors.push('Group type is required');
        }
        
        // ENFORCE: Admin must exist in current country
        if (!this.currentUser) {
            errors.push('User must be logged in to create a group');
        }
        
        // ENFORCE: Country must be selected
        if (!this.currentCountry) {
            errors.push('Country must be selected before creating a group');
        }
        
        // ENFORCE: User can't create too many groups (limit: 5)
        const userGroups = this.getUserGroups(this.currentUser.id);
        if (userGroups.length >= 5) {
            errors.push('Maximum of 5 groups per user reached');
        }
        
        // ENFORCE: For lender groups, subscription required
        if (groupData.type === 'LENDER_GROUP' || groupData.type === 'PROFESSIONAL') {
            if (!this.currentUser.subscription || this.currentUser.subscription.status !== 'ACTIVE') {
                errors.push('Active subscription required to create lender groups');
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            error: errors.length > 0 ? errors.join(', ') : null,
            code: errors.length > 0 ? 'VALIDATION_FAILED' : 'VALID'
        };
    }

    /**
     * Validate referral for group join
     * @param {string} groupId - Group ID
     * @param {object} referralData - Referral information
     * @returns {boolean} True if referral is valid
     */
    async validateReferral(groupId, referralData) {
        const group = this.getGroup(groupId);
        
        // Check if referrer exists in group
        const referrerExists = group.members.some(m => 
            m.userId === referralData.referrerId || 
            m.username === referralData.referrerUsername
        );
        
        if (!referrerExists) return false;
        
        // Check if referrer has invitation privileges
        const referrer = group.members.find(m => m.userId === referralData.referrerId);
        if (!referrer) return false;
        
        // Admins and lenders can invite
        const canInvite = referrer.role === 'ADMIN' || referrer.role === 'LENDER';
        if (!canInvite) return false;
        
        // Check if user is already in group
        const alreadyMember = group.members.some(m => m.userId === this.currentUser.id);
        if (alreadyMember) return false;
        
        return true;
    }

    /**
     * Generate unique group ID
     * @returns {string} Group ID
     */
    generateGroupId() {
        const countryCode = this.currentCountry.substring(0, 2).toUpperCase();
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `GRP_${countryCode}_${timestamp}_${random}`;
    }

    /**
     * Get country flag emoji
     * @param {string} country - Country name
     * @returns {string} Flag emoji
     */
    getCountryFlag(country) {
        const flags = {
            'Kenya': '🇰🇪',
            'Uganda': '🇺🇬',
            'Tanzania': '🇹🇿',
            'Rwanda': '🇷🇼',
            'Burundi': '🇧🇮',
            'DRC': '🇨🇩',
            'South Sudan': '🇸🇸',
            'South Africa': '🇿🇦',
            'Nigeria': '🇳🇬',
            'Ghana': '🇬🇭',
            'Ethiopia': '🇪🇹'
        };
        return flags[country] || '🇺🇳';
    }

    /**
     * Get currency for country
     * @param {string} country - Country name
     * @returns {string} Currency code
     */
    getCurrencyForCountry(country) {
        const currencies = {
            'Kenya': 'KSh',
            'Uganda': 'UGX',
            'Tanzania': 'TZS',
            'Rwanda': 'RWF',
            'Burundi': 'BIF',
            'DRC': 'CDF',
            'South Sudan': 'SSP',
            'South Africa': 'ZAR',
            'Nigeria': 'NGN',
            'Ghana': 'GHS',
            'Ethiopia': 'ETB'
        };
        return currencies[country] || 'USD';
    }

    /**
     * Save group to storage
     * @param {object} group - Group object
     */
    saveGroup(group) {
        const groups = this.getAllGroups();
        const index = groups.findIndex(g => g.id === group.id);
        
        if (index >= 0) {
            groups[index] = group;
        } else {
            groups.push(group);
        }
        
        localStorage.setItem('mpesewa_groups', JSON.stringify(groups));
    }

    /**
     * Get all groups from storage
     * @returns {Array} List of groups
     */
    getAllGroups() {
        const groupsStr = localStorage.getItem('mpesewa_groups');
        return groupsStr ? JSON.parse(groupsStr) : [];
    }

    /**
     * Get specific group
     * @param {string} groupId - Group ID
     * @returns {object} Group object
     */
    getGroup(groupId) {
        const groups = this.getAllGroups();
        return groups.find(g => g.id === groupId);
    }

    /**
     * Get user's groups
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
     * Add user to group in user's profile
     * @param {string} userId - User ID
     * @param {string} groupId - Group ID
     * @param {string} role - User role in group
     */
    addUserToGroup(userId, groupId, role) {
        const user = this.currentUser;
        if (!user.groupIds) user.groupIds = [];
        
        if (!user.groupIds.includes(groupId)) {
            user.groupIds.push({
                groupId: groupId,
                role: role,
                joinedAt: new Date().toISOString()
            });
            
            localStorage.setItem('mpesewa_user', JSON.stringify(user));
        }
    }

    /**
     * Update group statistics
     * @param {object} group - Group object
     */
    updateGroupStats(group) {
        // Calculate repayment rate
        const completedLoans = group.totalLoans - group.activeLoans;
        if (completedLoans > 0) {
            // This would normally come from ledger data
            group.successfulRepaymentRate = 95; // Placeholder
        }
        
        // Update group rating based on member ratings
        const memberRatings = group.members
            .filter(m => m.rating)
            .map(m => m.rating);
        
        if (memberRatings.length > 0) {
            const avgRating = memberRatings.reduce((a, b) => a + b, 0) / memberRatings.length;
            group.groupRating = Math.round(avgRating * 10) / 10;
        }
        
        // Update trust score
        group.trustScore = this.calculateTrustScore(group);
    }

    /**
     * Calculate group trust score
     * @param {object} group - Group object
     * @returns {number} Trust score 0-100
     */
    calculateTrustScore(group) {
        let score = 50; // Base
        
        // Factors
        if (group.memberCount >= 10) score += 10;
        if (group.memberCount >= 50) score += 10;
        
        if (group.successfulRepaymentRate >= 90) score += 20;
        if (group.successfulRepaymentRate >= 95) score += 10;
        
        if (group.groupRating >= 4.0) score += 10;
        if (group.groupRating >= 4.5) score += 10;
        
        // Penalties
        if (group.activeLoans > group.memberCount * 0.5) score -= 10;
        
        return Math.min(100, Math.max(0, score));
    }

    /**
     * Check if user can create loan in group
     * @param {object} group - Group object
     * @returns {boolean} True if allowed
     */
    canCreateLoan(group) {
        // ENFORCE GROUP STATE RULES
        const stateRestrictions = this.getStateRestrictions(group.state);
        if (!stateRestrictions.allowNewLoans) return false;
        
        // ENFORCE: Borrower must have good rating
        if (this.currentUser.roles.includes('BORROWER')) {
            if (this.currentUser.rating < 3.0) return false;
            if (this.currentUser.blacklisted) return false;
        }
        
        // ENFORCE: Lender must have active subscription
        if (this.currentUser.roles.includes('LENDER')) {
            if (!this.currentUser.subscription || this.currentUser.subscription.status !== 'ACTIVE') {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Check if user can lend in group
     * @param {object} group - Group object
     * @returns {boolean} True if allowed
     */
    canLendInGroup(group) {
        // ENFORCE: User must be lender
        if (!this.currentUser.roles.includes('LENDER')) return false;
        
        // ENFORCE: Group must be active
        if (group.state !== 'ACTIVE') return false;
        
        // ENFORCE: Subscription must be active
        if (!this.currentUser.subscription || this.currentUser.subscription.status !== 'ACTIVE') {
            return false;
        }
        
        // ENFORCE: Not expired (check 28th rule)
        if (this.isSubscriptionExpired(this.currentUser.subscription)) {
            return false;
        }
        
        return true;
    }

    /**
     * Check if subscription is expired (28th rule)
     * @param {object} subscription - Subscription object
     * @returns {boolean} True if expired
     */
    isSubscriptionExpired(subscription) {
        if (!subscription.expiryDate) return true;
        
        const today = new Date();
        const expiry = new Date(subscription.expiryDate);
        
        // Check if expired (after 28th of current month)
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const expiryDay = Math.min(28, lastDayOfMonth);
        
        const expiryThisMonth = new Date(currentYear, currentMonth, expiryDay);
        
        return today > expiryThisMonth;
    }

    /**
     * Check if user can invite members
     * @param {object} group - Group object
     * @returns {boolean} True if allowed
     */
    canInviteMembers(group) {
        const userMember = group.members.find(m => m.userId === this.currentUser.id);
        if (!userMember) return false;
        
        // ENFORCE: Only admins and lenders can invite
        return userMember.role === 'ADMIN' || userMember.role === 'LENDER';
    }

    /**
     * Get state restrictions for group
     * @param {string} state - Group state
     * @returns {object} Restrictions object
     */
    getStateRestrictions(state) {
        const restrictions = {
            'CREATED': {
                allowNewLoans: false,
                allowRepayments: false,
                allowInvites: true,
                allowJoining: false,
                allowLending: false,
                allowBorrowing: false
            },
            'ACTIVE': {
                allowNewLoans: true,
                allowRepayments: true,
                allowInvites: true,
                allowJoining: true,
                allowLending: true,
                allowBorrowing: true
            },
            'LOCKED': {
                allowNewLoans: false,
                allowRepayments: true,
                allowInvites: false,
                allowJoining: false,
                allowLending: false,
                allowBorrowing: false
            },
            'SUSPENDED': {
                allowNewLoans: false,
                allowRepayments: false,
                allowInvites: false,
                allowJoining: false,
                allowLending: false,
                allowBorrowing: false
            },
            'ARCHIVED': {
                allowNewLoans: false,
                allowRepayments: false,
                allowInvites: false,
                allowJoining: false,
                allowLending: false,
                allowBorrowing: false,
                readOnly: true
            }
        };
        
        return restrictions[state] || restrictions['SUSPENDED'];
    }

    /**
     * Get weekly limit for group based on subscription tiers
     * @param {object} group - Group object
     * @returns {object} Limit information
     */
    getWeeklyLimitForGroup(group) {
        const lenders = group.members.filter(m => m.role === 'LENDER');
        
        if (lenders.length === 0) {
            return { amount: 0, currency: group.currency };
        }
        
        // Get highest subscription tier among lenders
        let maxLimit = 0;
        lenders.forEach(lender => {
            const limit = this.getSubscriptionLimit(lender.subscriptionTier);
            if (limit > maxLimit) maxLimit = limit;
        });
        
        return {
            amount: maxLimit,
            currency: group.currency,
            perLender: this.getSubscriptionLimit('BASIC') // Default per lender
        };
    }

    /**
     * Get subscription limit
     * @param {string} tier - Subscription tier
     * @returns {number} Weekly limit
     */
    getSubscriptionLimit(tier) {
        const limits = {
            'BASIC': 1500,
            'PREMIUM': 5000,
            'SUPER': 20000,
            'LENDER_OF_LENDERS': 50000
        };
        return limits[tier] || 1500;
    }

    /**
     * Get active lenders in group
     * @param {object} group - Group object
     * @returns {Array} Active lenders
     */
    getActiveLenders(group) {
        return group.members
            .filter(m => m.role === 'LENDER')
            .map(lender => ({
                id: lender.userId,
                username: lender.username,
                rating: lender.rating,
                totalLent: 0, // Would come from ledger
                activeLoans: 0
            }));
    }

    /**
     * Get group loan categories
     * @param {object} group - Group object
     * @returns {Array} Available categories
     */
    getGroupLoanCategories(group) {
        // Default emergency categories
        const allCategories = [
            'M-pesewa Fare',
            'M-pesewa Data',
            'M-pesewa Cooking Gas',
            'M-pesewa Food',
            'M-pesewa Wifi',
            'M-pesewa Water Bill',
            'M-pesewa Electricity Tokens',
            'M-pesewa TV Subscription',
            'M-pesewa Fuel',
            'M-pesewa Repair',
            'M-pesewa Credo',
            'M-Pesa Daily Sales Advance',
            'M-Pesa Working Capital Advance',
            'M-Pesewa Soko Loan',
            'M-Pesewa Kidandaski Loan',
            'M-Pesewa Hawker Loan',
            'M-fuliziwa Loan',
            'M-pesewa Medicine',
            'M-pesewa School Fees',
            'M-pesewa Advance'
        ];
        
        // Filter by what lenders in this group support
        return allCategories;
    }

    /**
     * Get recent group activity
     * @param {string} groupId - Group ID
     * @returns {Array} Recent activities
     */
    getGroupRecentActivity(groupId) {
        // This would normally come from audit logs
        return [
            {
                type: 'LOAN_CREATED',
                user: 'JohnDoe',
                amount: 1500,
                currency: 'KSh',
                timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
                type: 'MEMBER_JOINED',
                user: 'JaneSmith',
                role: 'BORROWER',
                timestamp: new Date(Date.now() - 7200000).toISOString()
            }
        ];
    }

    /**
     * Get top lenders in group
     * @param {object} group - Group object
     * @returns {Array} Top lenders
     */
    getTopLenders(group) {
        // This would come from ledger data
        return group.members
            .filter(m => m.role === 'LENDER')
            .slice(0, 5)
            .map(lender => ({
                username: lender.username,
                totalLent: 0, // Placeholder
                activeLoans: 0,
                rating: lender.rating || 5.0
            }));
    }

    /**
     * Get recent borrowers
     * @param {object} group - Group object
     * @returns {Array} Recent borrowers
     */
    getRecentBorrowers(group) {
        return group.members
            .filter(m => m.role === 'BORROWER')
            .slice(0, 10)
            .map(borrower => ({
                username: borrower.username,
                lastLoan: null, // Placeholder
                rating: borrower.rating || 5.0,
                status: borrower.blacklisted ? 'BLACKLISTED' : 'ACTIVE'
            }));
    }

    /**
     * Validate admin subscription for group activation
     * @param {object} user - User object
     * @returns {boolean} True if valid
     */
    async validateAdminSubscription(user) {
        if (!user.subscription) return false;
        
        // Check subscription status
        if (user.subscription.status !== 'ACTIVE') return false;
        
        // Check expiry (28th rule)
        if (this.isSubscriptionExpired(user.subscription)) return false;
        
        return true;
    }

    /**
     * Audit log for group actions
     * @param {object} logEntry - Log entry
     */
    auditLog(logEntry) {
        const auditLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
        auditLogs.push(logEntry);
        localStorage.setItem('mpesewa_audit_logs', JSON.stringify(auditLogs.slice(-1000))); // Keep last 1000
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroupService;
}