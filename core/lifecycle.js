/**
 * M-PESEWA APPLICATION LIFECYCLE MANAGER
 * Enforces strict global hierarchy and application state transitions
 */

class MPesewaLifecycle {
    constructor() {
        this.state = {
            appStatus: 'BOOTING',
            hierarchy: this.initializeHierarchy(),
            currentUser: null,
            currentCountry: null,
            currentGroup: null,
            currentRole: null,
            subscriptionStatus: 'INACTIVE'
        };

        // Application lifecycle phases
        this.phases = {
            BOOTING: 'BOOTING',
            INITIALIZING: 'INITIALIZING',
            COUNTRY_SELECTED: 'COUNTRY_SELECTED',
            GROUP_SELECTED: 'GROUP_SELECTED',
            ROLE_SELECTED: 'ROLE_SELECTED',
            SUBSCRIPTION_ACTIVE: 'SUBSCRIPTION_ACTIVE',
            LENDING_ACTIVE: 'LENDING_ACTIVE',
            BORROWING_ACTIVE: 'BORROWING_ACTIVE',
            SUSPENDED: 'SUSPENDED',
            TERMINATED: 'TERMINATED'
        };

        // Country isolation enforcement
        this.supportedCountries = [
            { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
            { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
            { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
            { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
            { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩' },
            { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
            { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
            { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
            { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
            { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴' },
            { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
            { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' }
        ];

        // Event listeners
        this.listeners = new Map();
        this.initializeEventSystem();
    }

    /**
     * STRICT HIERARCHY INITIALIZATION - NON-NEGOTIABLE STRUCTURE
     * Global → Country → Groups → Lenders → Borrowers (Ledgers)
     */
    initializeHierarchy() {
        return {
            level: 'GLOBAL',
            children: this.supportedCountries.map(country => ({
                level: 'COUNTRY',
                code: country.code,
                name: country.name,
                currency: country.currency,
                flag: country.flag,
                groups: [], // Unlimited groups per country
                rules: {
                    countryIsolation: true,
                    noCrossCountryLending: true,
                    noCrossCountryBorrowing: true,
                    currencySpecific: true
                }
            })),
            rules: {
                // Global rules that apply to all countries
                maxGroupsPerBorrower: 4,
                groupSizeMin: 5,
                groupSizeMax: 1000,
                loanDurationDays: 7,
                interestRate: 0.10, // 10%
                dailyPenaltyRate: 0.05, // 5% after day 7
                defaultThresholdDays: 60, // 2 months
                subscriptionExpiryDay: 28 // 28th of each month
            }
        };
    }

    initializeEventSystem() {
        // Lifecycle event handlers
        this.on('app:boot', this.handleAppBoot.bind(this));
        this.on('country:select', this.handleCountrySelect.bind(this));
        this.on('group:join', this.handleGroupJoin.bind(this));
        this.on('role:select', this.handleRoleSelect.bind(this));
        this.on('subscription:activate', this.handleSubscriptionActivate.bind(this));
        this.on('subscription:expire', this.handleSubscriptionExpire.bind(this));
        this.on('loan:create', this.handleLoanCreate.bind(this));
        this.on('loan:repay', this.handleLoanRepay.bind(this));
        this.on('blacklist:add', this.handleBlacklistAdd.bind(this));
        this.on('blacklist:remove', this.handleBlacklistRemove.bind(this));
    }

    /**
     * LIFECYCLE TRANSITION METHODS
     * Each method enforces business rules during state transitions
     */

    async transitionTo(newPhase, data = {}) {
        console.log(`[LIFECYCLE] Transitioning from ${this.state.appStatus} to ${newPhase}`);
        
        // Validate transition
        if (!this.validateTransition(this.state.appStatus, newPhase)) {
            throw new Error(`Invalid transition from ${this.state.appStatus} to ${newPhase}`);
        }

        // Execute pre-transition hooks
        await this.executePreHooks(newPhase, data);

        // Update state
        const previousPhase = this.state.appStatus;
        this.state.appStatus = newPhase;

        // Execute post-transition hooks
        await this.executePostHooks(previousPhase, newPhase, data);

        // Emit transition event
        this.emit('lifecycle:transition', {
            from: previousPhase,
            to: newPhase,
            timestamp: new Date().toISOString(),
            data
        });

        return this.state;
    }

    validateTransition(fromPhase, toPhase) {
        const validTransitions = {
            'BOOTING': ['INITIALIZING', 'SUSPENDED'],
            'INITIALIZING': ['COUNTRY_SELECTED', 'SUSPENDED'],
            'COUNTRY_SELECTED': ['GROUP_SELECTED', 'COUNTRY_SELECTED', 'SUSPENDED'],
            'GROUP_SELECTED': ['ROLE_SELECTED', 'GROUP_SELECTED', 'COUNTRY_SELECTED', 'SUSPENDED'],
            'ROLE_SELECTED': ['SUBSCRIPTION_ACTIVE', 'BORROWING_ACTIVE', 'ROLE_SELECTED', 'GROUP_SELECTED', 'SUSPENDED'],
            'SUBSCRIPTION_ACTIVE': ['LENDING_ACTIVE', 'SUBSCRIPTION_ACTIVE', 'ROLE_SELECTED', 'SUSPENDED'],
            'LENDING_ACTIVE': ['SUBSCRIPTION_ACTIVE', 'SUSPENDED'],
            'BORROWING_ACTIVE': ['ROLE_SELECTED', 'SUSPENDED'],
            'SUSPENDED': ['TERMINATED', 'INITIALIZING'],
            'TERMINATED': [] // Terminal state
        };

        return validTransitions[fromPhase]?.includes(toPhase) || false;
    }

    /**
     * COUNTRY-LEVEL ENFORCEMENT
     * Strict country isolation rules
     */
    async handleCountrySelect(countryCode) {
        const country = this.supportedCountries.find(c => c.code === countryCode);
        
        if (!country) {
            throw new Error(`Country ${countryCode} not supported`);
        }

        // Enforce country isolation - clear previous country data
        this.state.currentCountry = country.code;
        this.state.currentGroup = null;
        this.state.currentRole = null;

        // Load country-specific rules and data
        await this.loadCountryData(countryCode);

        // Transition to country selected phase
        await this.transitionTo(this.phases.COUNTRY_SELECTED, { country });

        return country;
    }

    async loadCountryData(countryCode) {
        // Load country-specific configuration
        const countryConfig = {
            legalRequirements: this.getCountryLegalRequirements(countryCode),
            currencyRules: this.getCurrencyRules(countryCode),
            contactInfo: this.getCountryContactInfo(countryCode),
            groups: await this.loadCountryGroups(countryCode)
        };

        // Store in state
        this.state.countryConfig = countryConfig;

        return countryConfig;
    }

    /**
     * GROUP-LEVEL ENFORCEMENT
     * Trusted circles with strict membership rules
     */
    async handleGroupJoin(groupId, userData) {
        // Validate group exists in current country
        const group = await this.validateGroupMembership(groupId);
        
        if (!group) {
            throw new Error(`Group ${groupId} not found or not in current country`);
        }

        // Check group capacity (5-1000 members)
        if (group.members >= 1000) {
            throw new Error('Group has reached maximum capacity (1000 members)');
        }

        // Check if user is already in 4 groups (borrower limit)
        if (userData.role === 'BORROWER') {
            const userGroups = await this.getUserGroups(userData.id);
            if (userGroups.length >= 4) {
                throw new Error('Borrower cannot join more than 4 groups');
            }
        }

        // Check if user has good rating (for borrowers)
        if (userData.role === 'BORROWER') {
            const rating = await this.getUserRating(userData.id);
            if (rating < 3) { // Less than 3-star rating
                throw new Error('Borrower rating too low to join new groups');
            }
        }

        // Add user to group
        this.state.currentGroup = groupId;
        
        // Update group membership
        await this.updateGroupMembership(groupId, userData);

        // Transition to group selected phase
        await this.transitionTo(this.phases.GROUP_SELECTED, { group });

        return group;
    }

    /**
     * ROLE-LEVEL ENFORCEMENT
     * Lender vs Borrower with different rules
     */
    async handleRoleSelect(role, userData) {
        // Validate role
        if (!['LENDER', 'BORROWER'].includes(role)) {
            throw new Error('Invalid role. Must be LENDER or BORROWER');
        }

        // Check if user is already in this role in current group
        const existingRole = await this.getUserRoleInGroup(
            userData.id, 
            this.state.currentGroup
        );
        
        if (existingRole === role) {
            throw new Error(`User is already a ${role} in this group`);
        }

        // Set current role
        this.state.currentRole = role;

        // Role-specific initialization
        if (role === 'LENDER') {
            await this.initializeLender(userData);
        } else if (role === 'BORROWER') {
            await this.initializeBorrower(userData);
        }

        // Transition to role selected phase
        await this.transitionTo(this.phases.ROLE_SELECTED, { role, userData });

        return role;
    }

    /**
     * SUBSCRIPTION ENFORCEMENT
     * Lenders must have active subscription
     */
    async handleSubscriptionActivate(subscriptionData) {
        if (this.state.currentRole !== 'LENDER') {
            throw new Error('Only lenders can activate subscriptions');
        }

        const { tier, paymentMethod, duration } = subscriptionData;
        
        // Validate subscription tier
        const validTiers = ['BASIC', 'PREMIUM', 'SUPER', 'LENDER_OF_LENDERS'];
        if (!validTiers.includes(tier)) {
            throw new Error(`Invalid subscription tier. Must be one of: ${validTiers.join(', ')}`);
        }

        // Calculate expiry date (28th of current/next month)
        const expiryDate = this.calculateSubscriptionExpiry(duration);
        
        // Activate subscription
        this.state.subscriptionStatus = 'ACTIVE';
        this.state.subscriptionData = {
            tier,
            activated: new Date().toISOString(),
            expires: expiryDate,
            paymentMethod,
            lendingLimit: this.getLendingLimit(tier)
        };

        // Transition to subscription active phase
        await this.transitionTo(this.phases.SUBSCRIPTION_ACTIVE, {
            subscription: this.state.subscriptionData
        });

        return this.state.subscriptionData;
    }

    async handleSubscriptionExpire() {
        if (this.state.currentRole !== 'LENDER') {
            return; // Only lenders have subscriptions
        }

        // Check if subscription is expired
        const now = new Date();
        const expiry = new Date(this.state.subscriptionData.expires);
        
        if (now > expiry) {
            this.state.subscriptionStatus = 'EXPIRED';
            
            // Block lender access
            await this.blockLenderAccess();
            
            // Transition to suspended phase
            await this.transitionTo(this.phases.SUSPENDED, {
                reason: 'SUBSCRIPTION_EXPIRED',
                expiredDate: expiry.toISOString()
            });
        }
    }

    /**
     * LOAN LEDGER MANAGEMENT
     * Core lending/borrowing operations
     */
    async handleLoanCreate(loanData) {
        // STRICT RULE: Lenders can only lend within their group
        if (this.state.currentRole !== 'LENDER') {
            throw new Error('Only lenders can create loans');
        }

        // Check lender subscription status
        if (this.state.subscriptionStatus !== 'ACTIVE') {
            throw new Error('Lender subscription not active');
        }

        // Check lending limit
        const totalLent = await this.getTotalLent(this.state.currentUser.id);
        const limit = this.state.subscriptionData.lendingLimit;
        
        if (totalLent + loanData.amount > limit) {
            throw new Error(`Loan amount exceeds subscription limit (${limit})`);
        }

        // Validate borrower is in same group
        const borrowerInGroup = await this.validateBorrowerInGroup(
            loanData.borrowerId,
            this.state.currentGroup
        );
        
        if (!borrowerInGroup) {
            throw new Error('Borrower must be in the same group');
        }

        // Check borrower is not blacklisted
        const isBlacklisted = await this.checkBlacklistStatus(loanData.borrowerId);
        if (isBlacklisted) {
            throw new Error('Borrower is blacklisted');
        }

        // Check borrower doesn't have active loan in this group
        const hasActiveLoan = await this.checkActiveLoan(
            loanData.borrowerId,
            this.state.currentGroup
        );
        
        if (hasActiveLoan) {
            throw new Error('Borrower already has an active loan in this group');
        }

        // Create ledger entry
        const ledgerId = await this.createLedger(loanData);
        
        // Update borrower status to "in loan"
        await this.updateBorrowerStatus(loanData.borrowerId, 'IN_LOAN', ledgerId);

        // Transition to lending active phase
        await this.transitionTo(this.phases.LENDING_ACTIVE, {
            ledgerId,
            loanData
        });

        return ledgerId;
    }

    async handleLoanRepay(ledgerId, repaymentData) {
        const ledger = await this.getLedger(ledgerId);
        
        if (!ledger) {
            throw new Error('Ledger not found');
        }

        // Calculate interest and penalties
        const calculations = this.calculateRepaymentAmount(ledger);
        
        // Update ledger with repayment
        await this.updateLedger(ledgerId, {
            ...repaymentData,
            status: repaymentData.fullAmount ? 'CLEARED' : 'PARTIAL',
            lastRepayment: new Date().toISOString(),
            amountDue: calculations.amountDue - repaymentData.amount
        });

        // If fully repaid, update borrower status
        if (repaymentData.fullAmount) {
            await this.updateBorrowerStatus(ledger.borrowerId, 'AVAILABLE', null);
            
            // Update borrower rating
            await this.updateBorrowerRating(
                ledger.borrowerId,
                repaymentData.onTime ? 5 : 3
            );
        }

        // Emit repayment event
        this.emit('loan:repaid', {
            ledgerId,
            repaymentData,
            calculations
        });
    }

    /**
     * BLACKLIST SYSTEM ENFORCEMENT
     * Default after 2 months, removal only by admin
     */
    async handleBlacklistAdd(borrowerId, reason) {
        // Check if borrower has defaulted for 2 months
        const defaulted = await this.checkDefaultStatus(borrowerId);
        
        if (!defaulted) {
            throw new Error('Borrower has not defaulted for 2 months');
        }

        // Add to blacklist
        await this.addToBlacklist(borrowerId, reason);

        // Update borrower status in all groups
        await this.updateBorrowerStatusInAllGroups(borrowerId, 'BLACKLISTED');

        // Emit blacklist event
        this.emit('blacklist:added', {
            borrowerId,
            reason,
            timestamp: new Date().toISOString()
        });
    }

    async handleBlacklistRemove(borrowerId, adminId, reason) {
        // STRICT RULE: Only admin can remove from blacklist
        const isAdmin = await this.checkAdminStatus(adminId);
        
        if (!isAdmin) {
            throw new Error('Only platform admin can remove from blacklist');
        }

        // Check if borrower has fully repaid
        const fullyRepaid = await this.checkFullRepayment(borrowerId);
        
        if (!fullyRepaid) {
            throw new Error('Borrower must fully repay before removal from blacklist');
        }

        // Remove from blacklist
        await this.removeFromBlacklist(borrowerId, reason);

        // Update borrower status
        await this.updateBorrowerStatusInAllGroups(borrowerId, 'AVAILABLE');

        // Emit removal event
        this.emit('blacklist:removed', {
            borrowerId,
            adminId,
            reason,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * HELPER METHODS
     */
    calculateSubscriptionExpiry(duration) {
        const now = new Date();
        let expiry = new Date(now);
        
        switch (duration) {
            case 'MONTHLY':
                expiry.setMonth(expiry.getMonth() + 1);
                break;
            case 'BIANNUAL':
                expiry.setMonth(expiry.getMonth() + 6);
                break;
            case 'ANNUAL':
                expiry.setFullYear(expiry.getFullYear() + 1);
                break;
            default:
                throw new Error('Invalid subscription duration');
        }

        // Set to 28th of the month
        expiry.setDate(28);
        return expiry.toISOString();
    }

    getLendingLimit(tier) {
        const limits = {
            'BASIC': 1500,
            'PREMIUM': 5000,
            'SUPER': 20000,
            'LENDER_OF_LENDERS': 50000
        };
        return limits[tier] || 0;
    }

    calculateRepaymentAmount(ledger) {
        const borrowedDate = new Date(ledger.dateBorrowed);
        const today = new Date();
        const daysDiff = Math.floor((today - borrowedDate) / (1000 * 60 * 60 * 24));
        
        let interest = ledger.amount * 0.10; // 10% interest
        let penalty = 0;
        
        if (daysDiff > 7) {
            const overdueDays = daysDiff - 7;
            penalty = ledger.amount * 0.05 * overdueDays; // 5% daily penalty
        }
        
        if (daysDiff > 60) {
            // Borrower is in default (2 months)
            this.emit('borrower:default', {
                borrowerId: ledger.borrowerId,
                daysOverdue: daysDiff,
                amount: ledger.amount + interest + penalty
            });
        }
        
        return {
            principal: ledger.amount,
            interest,
            penalty,
            total: ledger.amount + interest + penalty,
            daysSinceBorrow: daysDiff,
            isOverdue: daysDiff > 7,
            isDefault: daysDiff > 60
        };
    }

    /**
     * EVENT SYSTEM
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    async executePreHooks(phase, data) {
        const hooks = {
            'SUBSCRIPTION_ACTIVE': [this.validateLenderEligibility.bind(this)],
            'LENDING_ACTIVE': [this.checkSubscriptionStatus.bind(this)],
            'BORROWING_ACTIVE': [this.checkBorrowerRating.bind(this)]
        };
        
        if (hooks[phase]) {
            for (const hook of hooks[phase]) {
                await hook(data);
            }
        }
    }

    async executePostHooks(previousPhase, newPhase, data) {
        const hooks = {
            'SUBSCRIPTION_ACTIVE': [this.notifySubscriptionActivation.bind(this)],
            'LENDING_ACTIVE': [this.updateLenderActivity.bind(this)],
            'BORROWING_ACTIVE': [this.updateBorrowerActivity.bind(this)]
        };
        
        if (hooks[newPhase]) {
            for (const hook of hooks[newPhase]) {
                await hook(data);
            }
        }
    }

    /**
     * Validation methods that would be implemented with actual data
     */
    async validateGroupMembership(groupId) {
        // Implementation would check database
        return { id: groupId, members: 50, country: this.state.currentCountry };
    }

    async getUserGroups(userId) {
        // Implementation would query database
        return [];
    }

    async getUserRating(userId) {
        // Implementation would calculate rating
        return 5;
    }

    async getTotalLent(lenderId) {
        // Implementation would sum all loans
        return 0;
    }

    async validateBorrowerInGroup(borrowerId, groupId) {
        // Implementation would check group membership
        return true;
    }

    async checkBlacklistStatus(borrowerId) {
        // Implementation would check blacklist
        return false;
    }

    async checkActiveLoan(borrowerId, groupId) {
        // Implementation would check for active loans
        return false;
    }

    async createLedger(loanData) {
        // Implementation would create ledger in database
        return 'ledger-' + Date.now();
    }

    async getLedger(ledgerId) {
        // Implementation would fetch from database
        return null;
    }

    async updateLedger(ledgerId, data) {
        // Implementation would update database
    }

    async updateBorrowerStatus(borrowerId, status, ledgerId) {
        // Implementation would update database
    }

    async updateBorrowerRating(borrowerId, rating) {
        // Implementation would update database
    }

    async checkDefaultStatus(borrowerId) {
        // Implementation would check default status
        return false;
    }

    async addToBlacklist(borrowerId, reason) {
        // Implementation would add to blacklist
    }

    async checkAdminStatus(userId) {
        // Implementation would check admin role
        return false;
    }

    async checkFullRepayment(borrowerId) {
        // Implementation would check repayment status
        return true;
    }

    async removeFromBlacklist(borrowerId, reason) {
        // Implementation would remove from blacklist
    }

    async validateLenderEligibility(data) {
        // Implementation would validate lender
    }

    async checkSubscriptionStatus(data) {
        // Implementation would check subscription
    }

    async checkBorrowerRating(data) {
        // Implementation would check rating
    }

    async notifySubscriptionActivation(data) {
        // Implementation would send notification
    }

    async updateLenderActivity(data) {
        // Implementation would update activity
    }

    async updateBorrowerActivity(data) {
        // Implementation would update activity
    }

    async blockLenderAccess() {
        // Implementation would block access
    }

    async getUserRoleInGroup(userId, groupId) {
        // Implementation would check role
        return null;
    }

    async initializeLender(userData) {
        // Implementation would initialize lender
    }

    async initializeBorrower(userData) {
        // Implementation would initialize borrower
    }

    async updateGroupMembership(groupId, userData) {
        // Implementation would update membership
    }

    async updateBorrowerStatusInAllGroups(borrowerId, status) {
        // Implementation would update all groups
    }

    getCountryLegalRequirements(countryCode) {
        // Implementation would return legal requirements
        return {};
    }

    getCurrencyRules(countryCode) {
        // Implementation would return currency rules
        return {};
    }

    getCountryContactInfo(countryCode) {
        // Implementation would return contact info
        return {};
    }

    async loadCountryGroups(countryCode) {
        // Implementation would load groups
        return [];
    }
}

// Singleton instance
let lifecycleInstance = null;

export function getLifecycleManager() {
    if (!lifecycleInstance) {
        lifecycleInstance = new MPesewaLifecycle();
    }
    return lifecycleInstance;
}

export function resetLifecycle() {
    lifecycleInstance = null;
}

// Export for use in other modules
export default MPesewaLifecycle;