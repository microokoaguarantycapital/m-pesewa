/**
 * M-PESEWA BASE COUNTRY CLASS
 * Abstract base class for all country implementations
 * Enforces hierarchical structure and country-specific rules
 */

class BaseCountry {
    constructor(config = {}) {
        if (new.target === BaseCountry) {
            throw new Error('BaseCountry is abstract and cannot be instantiated directly');
        }

        // Required configuration validation
        this.validateConfig(config);

        // Core country properties
        this.code = config.code.toUpperCase();
        this.name = config.name;
        this.flag = config.flag || `🇺🇳`;
        this.region = config.region || 'Africa';
        this.active = config.active !== false;
        this.timezone = config.timezone || 'UTC';
        this.language = config.language || 'en';
        this.currency = this.validateCurrency(config.currency);
        this.legalAge = config.legalAge || 18;
        
        // Contact information
        this.contact = {
            phone: config.contact?.phone || '',
            email: config.contact?.email || 'support@mpesewa.com',
            whatsapp: config.contact?.whatsapp || '',
            address: config.contact?.address || '',
            supportHours: config.contact?.supportHours || '9:00 AM - 5:00 PM',
            emergencyContact: config.contact?.emergencyContact || ''
        };

        // Platform rules (country-specific)
        this.rules = {
            // Hierarchy rules
            maxGroupsPerUser: config.rules?.maxGroupsPerUser || 4,
            minGroupMembers: config.rules?.minGroupMembers || 5,
            maxGroupMembers: config.rules?.maxGroupMembers || 1000,
            subscriptionExpiryDay: config.rules?.subscriptionExpiryDay || 28,
            
            // Financial rules
            interestRate: config.rules?.interestRate || 0.10, // 10%
            penaltyRate: config.rules?.penaltyRate || 0.05, // 5% daily
            defaultLoanPeriod: config.rules?.defaultLoanPeriod || 7, // days
            blacklistPeriod: config.rules?.blacklistPeriod || 60, // days (2 months)
            minLoanAmount: config.rules?.minLoanAmount || 0.1,
            maxLoanAmount: config.rules?.maxLoanAmount || 50000,
            
            // Subscription tiers (in local currency)
            subscriptionTiers: config.rules?.subscriptionTiers || {
                basic: { weeklyLimit: 1500, monthlyFee: 50, biAnnualFee: 250, annualFee: 500, crbRequired: false },
                premium: { weeklyLimit: 5000, monthlyFee: 250, biAnnualFee: 1500, annualFee: 2500, crbRequired: false },
                super: { weeklyLimit: 20000, monthlyFee: 1000, biAnnualFee: 5000, annualFee: 8500, crbRequired: true },
                lenderOfLenders: { weeklyLimit: 50000, monthlyFee: 500, biAnnualFee: 3500, annualFee: 6500, crbRequired: true }
            },
            
            // Compliance rules
            requiresCRB: config.rules?.requiresCRB || false,
            kycRequired: config.rules?.kycRequired !== false,
            idVerification: config.rules?.idVerification !== false,
            addressVerification: config.rules?.addressVerification || false,
            incomeVerification: config.rules?.incomeVerification || false,
            
            // Legal requirements
            taxRate: config.rules?.taxRate || 0,
            transactionFee: config.rules?.transactionFee || 0,
            vatRate: config.rules?.vatRate || 0,
            
            // Operational rules
            bankingHours: config.rules?.bankingHours || '9:00 AM - 5:00 PM',
            holidays: config.rules?.holidays || [],
            disputeResolutionPeriod: config.rules?.disputeResolutionPeriod || 30, // days
            maxDisputesPerUser: config.rules?.maxDisputesPerUser || 3
        };

        // Statistics
        this.stats = {
            totalUsers: 0,
            totalGroups: 0,
            totalLenders: 0,
            totalBorrowers: 0,
            activeLenders: 0,
            activeBorrowers: 0,
            totalAmountLent: 0,
            totalAmountBorrowed: 0,
            repaymentRate: 0,
            defaultRate: 0,
            avgLoanAmount: 0,
            avgLoanDuration: 0,
            avgRating: 5,
            blacklistedUsers: 0,
            activeDisputes: 0,
            lastUpdated: new Date().toISOString()
        };

        // Internal state
        this.groups = new Map();
        this.users = new Map();
        this.ledgers = new Map();
        this.blacklist = new Set();
        this.disputes = new Map();
        this.subscriptions = new Map();
        
        // Cache for performance
        this.userCache = new Map();
        this.groupCache = new Map();
        this.ledgerCache = new Map();
        
        // Audit trail
        this.auditLog = [];
        this.isolationViolations = [];
        
        // Hierarchy enforcement
        this.hierarchy = {
            global: 'M-PESEWA',
            country: this.code,
            groups: new Map(),
            lenders: new Map(),
            borrowers: new Map(),
            ledgers: new Map()
        };

        // Initialize
        this.initializedAt = new Date().toISOString();
        this.lastSync = new Date().toISOString();
        
        console.log(`✅ BaseCountry initialized: ${this.name} (${this.code})`);
    }

    // ============================================================================
    // 1️⃣ CONFIGURATION & VALIDATION
    // ============================================================================

    validateConfig(config) {
        const required = ['code', 'name', 'currency'];
        const missing = required.filter(field => !config[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required configuration: ${missing.join(', ')}`);
        }

        // Validate country code
        if (!/^[A-Z]{2}$/.test(config.code)) {
            throw new Error('Country code must be 2-letter ISO code');
        }

        // Validate currency
        if (!config.currency.code || !config.currency.symbol) {
            throw new Error('Currency must have code and symbol');
        }
    }

    validateCurrency(currency) {
        const defaultCurrency = {
            code: 'USD',
            symbol: '$',
            name: 'US Dollar',
            decimals: 2,
            format: '{{symbol}}{{amount}}',
            exchangeRate: 1,
            lastUpdated: new Date().toISOString()
        };

        return {
            ...defaultCurrency,
            ...currency,
            decimals: currency.decimals || 2
        };
    }

    // ============================================================================
    // 2️⃣ HIERARCHY ENFORCEMENT METHODS (STRICT)
    // ============================================================================

    /**
     * Add user to country hierarchy
     * @param {Object} user - User object
     * @returns {Object} - Added user with country context
     */
    addUserToHierarchy(user) {
        this.validateUserForCountry(user);

        // Check if user already exists in another country
        if (user.countryCode && user.countryCode !== this.code) {
            throw new Error(`User ${user.id} belongs to ${user.countryCode}, cannot add to ${this.code}`);
        }

        // Update user with country context
        const userWithCountry = {
            ...user,
            countryCode: this.code,
            registeredAt: user.registeredAt || new Date().toISOString(),
            rating: user.rating || 5,
            groups: user.groups || [],
            activeLoans: user.activeLoans || [],
            blacklisted: user.blacklisted || false,
            subscription: user.role === 'lender' ? this.initializeSubscription(user) : null
        };

        // Store in hierarchy
        if (user.role === 'lender') {
            this.hierarchy.lenders.set(user.id, userWithCountry);
            this.stats.totalLenders++;
            this.stats.activeLenders++;
        } else if (user.role === 'borrower') {
            this.hierarchy.borrowers.set(user.id, userWithCountry);
            this.stats.totalBorrowers++;
            this.stats.activeBorrowers++;
        }

        // Store in users map
        this.users.set(user.id, userWithCountry);
        this.stats.totalUsers++;

        // Log hierarchy addition
        this.logAudit('user_added_to_hierarchy', {
            userId: user.id,
            role: user.role,
            country: this.code,
            timestamp: new Date().toISOString()
        });

        return userWithCountry;
    }

    /**
     * Create group in country hierarchy
     * @param {Object} groupData - Group data
     * @returns {Object} - Created group
     */
    createGroupInHierarchy(groupData) {
        // Validate group data
        this.validateGroupData(groupData);

        // Ensure founder exists in this country
        const founder = this.users.get(groupData.founderId);
        if (!founder || founder.countryCode !== this.code) {
            throw new Error('Founder must be registered in this country');
        }

        // Create group ID with country prefix
        const groupId = `${this.code}_group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const group = {
            id: groupId,
            countryCode: this.code,
            ...groupData,
            members: [groupData.founderId],
            lenders: groupData.founderRole === 'lender' ? [groupData.founderId] : [],
            borrowers: groupData.founderRole === 'borrower' ? [groupData.founderId] : [],
            memberCount: 1,
            activeLoans: 0,
            totalLent: 0,
            successfulRepaymentRate: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
            type: groupData.type || 'community',
            nickname: groupData.nickname || `${this.name} Group`,
            rules: groupData.rules || {},
            invitations: [],
            requests: []
        };

        // Store in hierarchy
        this.hierarchy.groups.set(groupId, group);
        this.groups.set(groupId, group);
        this.stats.totalGroups++;

        // Add founder to group
        this.addUserToGroup(groupId, groupData.founderId, groupData.founderRole);

        // Log group creation
        this.logAudit('group_created_in_hierarchy', {
            groupId,
            founderId: groupData.founderId,
            country: this.code,
            timestamp: new Date().toISOString()
        });

        return group;
    }

    /**
     * Add user to group with hierarchy validation
     * @param {string} groupId - Group ID
     * @param {string} userId - User ID
     * @param {string} role - User role in group
     * @returns {Object} - Operation result
     */
    addUserToGroup(groupId, userId, role) {
        const group = this.groups.get(groupId);
        const user = this.users.get(userId);

        if (!group) {
            throw new Error(`Group ${groupId} not found`);
        }

        if (!user) {
            throw new Error(`User ${userId} not found`);
        }

        // Validate country isolation
        if (group.countryCode !== user.countryCode) {
            this.logIsolationViolation({
                type: 'cross_country_group_attempt',
                userId,
                groupId,
                userCountry: user.countryCode,
                groupCountry: group.countryCode,
                timestamp: new Date().toISOString()
            });
            throw new Error('Cross-country group membership prohibited');
        }

        // Validate group size limits
        if (group.memberCount >= this.rules.maxGroupMembers) {
            throw new Error(`Group has reached maximum members (${this.rules.maxGroupMembers})`);
        }

        if (group.memberCount < this.rules.minGroupMembers - 1) {
            console.warn(`Group has only ${group.memberCount + 1} members (minimum ${this.rules.minGroupMembers} required for full operations)`);
        }

        // Validate borrower group limits
        if (role === 'borrower') {
            const userGroups = user.groups || [];
            if (userGroups.length >= this.rules.maxGroupsPerUser) {
                if (user.rating < 4) {
                    throw new Error(`Borrower already in ${userGroups.length} groups. Good rating (4+) required to join more than ${this.rules.maxGroupsPerUser} groups.`);
                }
            }
        }

        // Add user to group
        if (!group.members.includes(userId)) {
            group.members.push(userId);
            group.memberCount++;

            if (role === 'lender' && !group.lenders.includes(userId)) {
                group.lenders.push(userId);
            } else if (role === 'borrower' && !group.borrowers.includes(userId)) {
                group.borrowers.push(userId);
            }

            group.updatedAt = new Date().toISOString();
        }

        // Add group to user
        if (!user.groups.includes(groupId)) {
            user.groups.push(groupId);
        }

        // Update user role in group context
        user.groupRoles = user.groupRoles || {};
        user.groupRoles[groupId] = role;

        // Log hierarchy update
        this.logAudit('user_added_to_group', {
            groupId,
            userId,
            role,
            country: this.code,
            timestamp: new Date().toISOString()
        });

        return { success: true, group, user };
    }

    /**
     * Create ledger in hierarchy (Lender → Ledger → Borrower)
     * @param {Object} loanData - Loan data
     * @returns {Object} - Created ledger
     */
    createLedgerInHierarchy(loanData) {
        const { lenderId, borrowerId, groupId, amount, category, guarantors } = loanData;

        // Validate participants exist in same country and group
        const lender = this.users.get(lenderId);
        const borrower = this.users.get(borrowerId);
        const group = this.groups.get(groupId);

        if (!lender || lender.role !== 'lender') {
            throw new Error('Invalid lender');
        }

        if (!borrower || borrower.role !== 'borrower') {
            throw new Error('Invalid borrower');
        }

        if (!group) {
            throw new Error('Group not found');
        }

        // Validate country and group isolation
        if (lender.countryCode !== this.code || borrower.countryCode !== this.code || group.countryCode !== this.code) {
            throw new Error('All participants must be in the same country');
        }

        if (!group.members.includes(lenderId) || !group.members.includes(borrowerId)) {
            throw new Error('Lender and borrower must be members of the group');
        }

        // Validate lender subscription
        if (!lender.subscription?.active) {
            throw new Error('Lender subscription is not active. Expires on 28th of each month.');
        }

        // Validate lending limits
        const subscriptionTier = this.rules.subscriptionTiers[lender.subscription.level];
        if (amount > subscriptionTier.weeklyLimit) {
            throw new Error(`Amount exceeds weekly limit for ${lender.subscription.level} tier (${this.formatCurrency(subscriptionTier.weeklyLimit)})`);
        }

        // Calculate loan details
        const interestRate = this.rules.interestRate;
        const interest = amount * interestRate;
        const totalDue = amount + interest;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + this.rules.defaultLoanPeriod);

        // Create ledger ID
        const ledgerId = `${this.code}_ledger_${Date.now()}_${lenderId}_${borrowerId}`;

        const ledger = {
            id: ledgerId,
            countryCode: this.code,
            groupId,
            lenderId,
            borrowerId,
            amount,
            interestRate,
            interest,
            totalDue,
            amountPaid: 0,
            amountOverdue: 0,
            category,
            status: 'active',
            createdAt: new Date().toISOString(),
            disbursedAt: new Date().toISOString(),
            dueDate: dueDate.toISOString(),
            guarantors: guarantors || [],
            repayments: [],
            penalties: [],
            daysOverdue: 0,
            rating: null,
            notes: '',
            metadata: {
                currency: this.currency.code,
                subscriptionTier: lender.subscription.level,
                crbRequired: subscriptionTier.crbRequired,
                autoGenerated: true
            }
        };

        // Store in hierarchy
        this.hierarchy.ledgers.set(ledgerId, ledger);
        this.ledgers.set(ledgerId, ledger);

        // Update lender's active ledgers
        lender.activeLedgers = lender.activeLedgers || [];
        lender.activeLedgers.push(ledgerId);

        // Update borrower's active loans
        borrower.activeLoans = borrower.activeLoans || [];
        borrower.activeLoans.push(ledgerId);

        // Update group statistics
        group.activeLoans = (group.activeLoans || 0) + 1;
        group.totalLent = (group.totalLent || 0) + amount;
        group.updatedAt = new Date().toISOString();

        // Update country statistics
        this.stats.totalAmountLent += amount;
        this.stats.totalAmountBorrowed += amount;
        this.stats.avgLoanAmount = (this.stats.totalAmountLent / this.ledgers.size) || 0;

        // Log ledger creation
        this.logAudit('ledger_created_in_hierarchy', {
            ledgerId,
            lenderId,
            borrowerId,
            groupId,
            amount,
            country: this.code,
            timestamp: new Date().toISOString()
        });

        return ledger;
    }

    // ============================================================================
    // 3️⃣ VALIDATION METHODS
    // ============================================================================

    validateUserForCountry(user) {
        const errors = [];

        if (!user.id) errors.push('User ID required');
        if (!user.fullName) errors.push('Full name required');
        if (!user.nationalId) errors.push('National ID required');
        if (!user.phone) errors.push('Phone number required');
        if (!user.role) errors.push('Role required (lender or borrower)');

        if (user.role === 'lender' && !user.subscriptionLevel) {
            errors.push('Lender must select subscription level');
        }

        // Country-specific phone validation
        if (this.code === 'KE' && user.phone && !user.phone.startsWith('+254')) {
            errors.push('Kenyan phone number must start with +254');
        }

        if (this.code === 'NG' && user.phone && !user.phone.startsWith('+234')) {
            errors.push('Nigerian phone number must start with +234');
        }

        if (errors.length > 0) {
            throw new Error(`User validation failed: ${errors.join(', ')}`);
        }

        return true;
    }

    validateGroupData(groupData) {
        const errors = [];

        if (!groupData.founderId) errors.push('Founder ID required');
        if (!groupData.founderRole) errors.push('Founder role required');
        if (!groupData.name) errors.push('Group name required');

        if (errors.length > 0) {
            throw new Error(`Group validation failed: ${errors.join(', ')}`);
        }

        return true;
    }

    // ============================================================================
    // 4️⃣ SUBSCRIPTION MANAGEMENT
    // ============================================================================

    initializeSubscription(user) {
        const tier = this.rules.subscriptionTiers[user.subscriptionLevel];
        if (!tier) {
            throw new Error(`Invalid subscription level: ${user.subscriptionLevel}`);
        }

        // Calculate expiry date (28th of current/next month)
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        let expiryDate = new Date(currentYear, currentMonth, this.rules.subscriptionExpiryDay);
        if (now.getDate() > this.rules.subscriptionExpiryDay) {
            expiryDate = new Date(currentYear, currentMonth + 1, this.rules.subscriptionExpiryDay);
        }

        return {
            level: user.subscriptionLevel,
            tier,
            active: false, // Requires payment confirmation
            expiresAt: expiryDate.toISOString(),
            paymentPending: true,
            maxLedgers: user.subscriptionLevel === 'basic' ? 1500 : 
                       user.subscriptionLevel === 'premium' ? 10000 : 
                       user.subscriptionLevel === 'super' ? 20000 : 50000,
            weeklyLimit: tier.weeklyLimit,
            crbRequired: tier.crbRequired,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    activateSubscription(userId, paymentDetails) {
        const user = this.users.get(userId);
        if (!user || user.role !== 'lender') {
            throw new Error('User is not a lender');
        }

        if (!user.subscription) {
            throw new Error('User has no subscription');
        }

        // Process payment (simulated)
        user.subscription.active = true;
        user.subscription.paymentPending = false;
        user.subscription.paymentConfirmedAt = new Date().toISOString();
        user.subscription.paymentDetails = paymentDetails;
        user.subscription.updatedAt = new Date().toISOString();

        // Update statistics
        this.stats.activeLenders++;

        // Log subscription activation
        this.logAudit('subscription_activated', {
            userId,
            subscriptionLevel: user.subscription.level,
            amount: paymentDetails.amount,
            country: this.code,
            timestamp: new Date().toISOString()
        });

        return user.subscription;
    }

    checkSubscriptionExpiry() {
        const now = new Date();
        const expiredLenders = [];

        for (const [userId, user] of this.users) {
            if (user.role === 'lender' && user.subscription?.active) {
                const expiryDate = new Date(user.subscription.expiresAt);
                if (now > expiryDate) {
                    user.subscription.active = false;
                    user.subscription.expiredAt = now.toISOString();
                    expiredLenders.push(userId);
                    
                    this.stats.activeLenders = Math.max(0, this.stats.activeLenders - 1);
                    
                    this.logAudit('subscription_expired', {
                        userId,
                        subscriptionLevel: user.subscription.level,
                        expiredAt: now.toISOString(),
                        country: this.code
                    });
                }
            }
        }

        return expiredLenders;
    }

    // ============================================================================
    // 5️⃣ BLACKLIST MANAGEMENT
    // ============================================================================

    addToBlacklist(userId, reason) {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.blacklisted) {
            throw new Error('User already blacklisted');
        }

        user.blacklisted = true;
        user.blacklistedAt = new Date().toISOString();
        user.blacklistReason = reason;
        this.blacklist.add(userId);
        this.stats.blacklistedUsers++;

        // Remove from active users
        if (user.role === 'lender') {
            this.stats.activeLenders = Math.max(0, this.stats.activeLenders - 1);
        } else if (user.role === 'borrower') {
            this.stats.activeBorrowers = Math.max(0, this.stats.activeBorrowers - 1);
        }

        this.logAudit('user_blacklisted', {
            userId,
            reason,
            country: this.code,
            timestamp: new Date().toISOString()
        });

        return user;
    }

    removeFromBlacklist(userId, adminId) {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.blacklisted) {
            throw new Error('User is not blacklisted');
        }

        // Only admin can remove from blacklist
        // In production, verify admin privileges
        user.blacklisted = false;
        user.blacklistRemovedAt = new Date().toISOString();
        user.blacklistRemovedBy = adminId;
        this.blacklist.delete(userId);
        this.stats.blacklistedUsers--;

        // Restore to active users if applicable
        if (user.role === 'lender' && user.subscription?.active) {
            this.stats.activeLenders++;
        } else if (user.role === 'borrower') {
            this.stats.activeBorrowers++;
        }

        this.logAudit('user_removed_from_blacklist', {
            userId,
            removedBy: adminId,
            country: this.code,
            timestamp: new Date().toISOString()
        });

        return user;
    }

    // ============================================================================
    // 6️⃣ STATISTICS & REPORTING
    // ============================================================================

    getStatistics() {
        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

        // Calculate recent activity
        const recentLedgers = Array.from(this.ledgers.values()).filter(ledger => 
            new Date(ledger.createdAt) > oneWeekAgo
        );

        const recentGroups = Array.from(this.groups.values()).filter(group => 
            new Date(group.createdAt) > oneMonthAgo
        );

        return {
            ...this.stats,
            recentActivity: {
                ledgersCreated: recentLedgers.length,
                groupsCreated: recentGroups.length,
                activeUsers: this.stats.activeLenders + this.stats.activeBorrowers,
                totalLedgers: this.ledgers.size,
                totalDisputes: this.disputes.size,
                blacklistedCount: this.blacklist.size
            },
            hierarchy: {
                totalGroups: this.groups.size,
                totalLenders: this.stats.totalLenders,
                totalBorrowers: this.stats.totalBorrowers,
                groupsWithMinMembers: Array.from(this.groups.values()).filter(g => g.memberCount >= this.rules.minGroupMembers).length,
                groupsAtCapacity: Array.from(this.groups.values()).filter(g => g.memberCount >= this.rules.maxGroupMembers).length
            },
            financials: {
                totalAmountLent: this.stats.totalAmountLent,
                totalAmountBorrowed: this.stats.totalAmountBorrowed,
                avgLoanAmount: this.stats.avgLoanAmount,
                estimatedInterest: this.stats.totalAmountLent * this.rules.interestRate,
                estimatedPlatformRevenue: this.calculatePlatformRevenue()
            },
            lastUpdated: new Date().toISOString()
        };
    }

    calculatePlatformRevenue() {
        let revenue = 0;
        for (const [userId, user] of this.users) {
            if (user.role === 'lender' && user.subscription) {
                const tier = this.rules.subscriptionTiers[user.subscription.level];
                if (tier) {
                    // Simplified: assume monthly subscription
                    revenue += tier.monthlyFee || 0;
                }
            }
        }
        return revenue;
    }

    // ============================================================================
    // 7️⃣ UTILITY METHODS
    // ============================================================================

    formatCurrency(amount) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.currency.code,
            minimumFractionDigits: this.currency.decimals,
            maximumFractionDigits: this.currency.decimals
        });

        return formatter.format(amount);
    }

    logAudit(event, data) {
        const auditEntry = {
            id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            event,
            ...data,
            country: this.code,
            timestamp: new Date().toISOString()
        };

        this.auditLog.push(auditEntry);

        // Keep only last 10,000 audit entries
        if (this.auditLog.length > 10000) {
            this.auditLog = this.auditLog.slice(-10000);
        }
    }

    logIsolationViolation(violation) {
        const violationEntry = {
            ...violation,
            id: `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            country: this.code,
            timestamp: new Date().toISOString(),
            severity: 'HIGH'
        };

        this.isolationViolations.push(violationEntry);
        console.error('🚨 ISOLATION VIOLATION:', violationEntry);

        // Keep only last 1000 violations
        if (this.isolationViolations.length > 1000) {
            this.isolationViolations = this.isolationViolations.slice(-1000);
        }
    }

    getAuditLog(filter = {}) {
        let logs = this.auditLog;

        if (filter.event) {
            logs = logs.filter(log => log.event === filter.event);
        }

        if (filter.userId) {
            logs = logs.filter(log => log.userId === filter.userId);
        }

        if (filter.groupId) {
            logs = logs.filter(log => log.groupId === filter.groupId);
        }

        if (filter.startDate) {
            const start = new Date(filter.startDate);
            logs = logs.filter(log => new Date(log.timestamp) >= start);
        }

        if (filter.endDate) {
            const end = new Date(filter.endDate);
            logs = logs.filter(log => new Date(log.timestamp) <= end);
        }

        if (filter.limit) {
            logs = logs.slice(-filter.limit);
        }

        return logs;
    }

    getIsolationViolations(filter = {}) {
        let violations = this.isolationViolations;

        if (filter.type) {
            violations = violations.filter(v => v.type === filter.type);
        }

        if (filter.severity) {
            violations = violations.filter(v => v.severity === filter.severity);
        }

        if (filter.startDate) {
            const start = new Date(filter.startDate);
            violations = violations.filter(v => new Date(v.timestamp) >= start);
        }

        if (filter.endDate) {
            const end = new Date(filter.endDate);
            violations = violations.filter(v => new Date(v.timestamp) <= end);
        }

        return violations;
    }

    // ============================================================================
    // 8️⃣ EXPORT/IMPORT
    // ============================================================================

    exportData() {
        return {
            metadata: {
                country: this.code,
                exportedAt: new Date().toISOString(),
                version: '1.0.0'
            },
            config: {
                code: this.code,
                name: this.name,
                currency: this.currency,
                rules: this.rules,
                contact: this.contact
            },
            statistics: this.getStatistics(),
            hierarchy: {
                groups: Array.from(this.groups.values()),
                lenders: Array.from(this.hierarchy.lenders.values()),
                borrowers: Array.from(this.hierarchy.borrowers.values()),
                ledgers: Array.from(this.ledgers.values())
            },
            auditLog: this.auditLog.slice(-1000),
            isolationViolations: this.isolationViolations
        };
    }

    importData(data) {
        if (!data || data.config?.code !== this.code) {
            throw new Error('Invalid import data for this country');
        }

        // Import configuration updates
        if (data.config) {
            Object.assign(this, data.config);
        }

        // Import statistics
        if (data.statistics) {
            Object.assign(this.stats, data.statistics);
        }

        // Import hierarchy data
        if (data.hierarchy) {
            this.groups.clear();
            data.hierarchy.groups?.forEach(group => {
                this.groups.set(group.id, group);
            });

            this.users.clear();
            data.hierarchy.lenders?.forEach(lender => {
                this.users.set(lender.id, lender);
                this.hierarchy.lenders.set(lender.id, lender);
            });

            data.hierarchy.borrowers?.forEach(borrower => {
                this.users.set(borrower.id, borrower);
                this.hierarchy.borrowers.set(borrower.id, borrower);
            });

            this.ledgers.clear();
            data.hierarchy.ledgers?.forEach(ledger => {
                this.ledgers.set(ledger.id, ledger);
                this.hierarchy.ledgers.set(ledger.id, ledger);
            });
        }

        // Import audit logs
        if (data.auditLog) {
            this.auditLog = data.auditLog;
        }

        if (data.isolationViolations) {
            this.isolationViolations = data.isolationViolations;
        }

        this.logAudit('data_imported', {
            source: data.metadata?.exportedAt || 'unknown',
            timestamp: new Date().toISOString()
        });

        return true;
    }

    // ============================================================================
    // 9️⃣ CLEANUP & MAINTENANCE
    // ============================================================================

    cleanupOldData(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        // Clean audit logs
        this.auditLog = this.auditLog.filter(log => 
            new Date(log.timestamp) > cutoffDate
        );

        // Clean isolation violations
        this.isolationViolations = this.isolationViolations.filter(violation =>
            new Date(violation.timestamp) > cutoffDate
        );

        // Clean cache
        this.userCache.clear();
        this.groupCache.clear();
        this.ledgerCache.clear();

        this.logAudit('data_cleanup', {
            daysOld,
            timestamp: new Date().toISOString()
        });

        return {
            auditLogsRemoved: this.auditLog.length,
            violationsRemoved: this.isolationViolations.length,
            cacheCleared: true
        };
    }

    // ============================================================================
    // 🔟 GETTERS & SETTERS
    // ============================================================================

    get totalUsers() {
        return this.stats.totalUsers;
    }

    get totalGroups() {
        return this.stats.totalGroups;
    }

    get activeLenders() {
        return this.stats.activeLenders;
    }

    get activeBorrowers() {
        return this.stats.activeBorrowers;
    }

    get totalAmountLent() {
        return this.stats.totalAmountLent;
    }

    get currencySymbol() {
        return this.currency.symbol;
    }

    get isActive() {
        return this.active;
    }

    set isActive(value) {
        this.active = value;
        this.logAudit('country_status_changed', {
            active: value,
            timestamp: new Date().toISOString()
        });
    }
}

// Export the class
export default BaseCountry;

// Export for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseCountry;
}