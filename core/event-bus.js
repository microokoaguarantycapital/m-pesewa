/**
 * M-PESEWA GLOBAL EVENT BUS
 * Centralized event system for cross-module communication
 * Strictly enforces country → group → lender → borrower hierarchy
 */

class MpesewaEventBus {
    constructor() {
        this.events = new Map();
        this.hierarchyValidators = new Map();
        this.countryLocks = new Set();
        this.setupHierarchyValidators();
    }

    // Strict hierarchy enforcement
    setupHierarchyValidators() {
        // Global → Country → Groups → Lenders → Borrowers (Ledgers)
        this.hierarchyValidators.set('country:selected', this.validateCountrySelection.bind(this));
        this.hierarchyValidators.set('group:joined', this.validateGroupMembership.bind(this));
        this.hierarchyValidators.set('lender:registered', this.validateLenderRegistration.bind(this));
        this.hierarchyValidators.set('borrower:registered', this.validateBorrowerRegistration.bind(this));
        this.hierarchyValidators.set('loan:requested', this.validateLoanRequest.bind(this));
        this.hierarchyValidators.set('loan:approved', this.validateLoanApproval.bind(this));
        this.hierarchyValidators.set('repayment:made', this.validateRepayment.bind(this));
        this.hierarchyValidators.set('subscription:expired', this.validateSubscriptionExpiry.bind(this));
    }

    // STRICT: Country isolation validator
    validateCountrySelection(data) {
        if (!data || !data.countryCode) {
            throw new Error('Country selection requires countryCode');
        }

        const validCountries = [
            'KE', // Kenya
            'UG', // Uganda
            'TZ', // Tanzania
            'RW', // Rwanda
            'CD', // DRC
            'BI', // Burundi
            'NG', // Nigeria
            'GH', // Ghana
            'SS', // South Sudan
            'SO', // Somalia
            'ZA', // South Africa
            'ET'  // Ethiopia
        ];

        if (!validCountries.includes(data.countryCode)) {
            throw new Error(`Invalid country code: ${data.countryCode}. Must be one of: ${validCountries.join(', ')}`);
        }

        // Lock country after selection
        if (this.countryLocks.has(data.userId)) {
            throw new Error('Country selection is locked after registration. Cannot change country.');
        }

        return true;
    }

    // STRICT: Group membership validator
    validateGroupMembership(data) {
        if (!data || !data.groupId || !data.countryCode || !data.userId || !data.role) {
            throw new Error('Group membership validation requires groupId, countryCode, userId, and role');
        }

        // User cannot belong to more than 4 groups
        const userGroups = this.getUserGroupCount(data.userId);
        if (userGroups >= 4) {
            throw new Error('User cannot join more than 4 groups (M-Pesewa Rule)');
        }

        // Group must be in same country as user
        const groupCountry = this.getGroupCountry(data.groupId);
        if (groupCountry !== data.countryCode) {
            throw new Error(`User from ${data.countryCode} cannot join group from ${groupCountry} (Country isolation rule)`);
        }

        // Minimum 5 members per group
        const groupSize = this.getGroupMemberCount(data.groupId);
        if (groupSize >= 1000) {
            throw new Error('Group has reached maximum capacity of 1000 members');
        }

        return true;
    }

    // STRICT: Lender registration validator
    validateLenderRegistration(data) {
        if (!data || !data.userId || !data.groupId || !data.subscriptionTier) {
            throw new Error('Lender registration requires userId, groupId, and subscriptionTier');
        }

        // Must have active subscription
        if (!this.isSubscriptionActive(data.userId)) {
            throw new Error('Lender must have active subscription before lending (Rule 4.1)');
        }

        // Subscription expires on 28th of each month
        const expiryDate = this.getSubscriptionExpiry(data.userId);
        if (expiryDate && new Date() > expiryDate) {
            throw new Error('Lender subscription expired on the 28th. Access blocked until payment.');
        }

        // Must specify lending categories
        if (!data.lendingCategories || data.lendingCategories.length === 0) {
            throw new Error('Lender must specify at least one lending category (Rule 4.1)');
        }

        return true;
    }

    // STRICT: Borrower registration validator
    validateBorrowerRegistration(data) {
        if (!data || !data.userId || !data.groupId) {
            throw new Error('Borrower registration requires userId and groupId');
        }

        // Borrower cannot be blacklisted
        if (this.isUserBlacklisted(data.userId)) {
            throw new Error('Blacklisted users cannot register as borrowers');
        }

        // Borrower must have 2 referrers/guarantors
        if (!data.referrers || data.referrers.length < 2) {
            throw new Error('Borrower must provide 2 referrers/guarantors from the same group (Trust-First Rule)');
        }

        // Check good rating for joining 4th group
        const userGroups = this.getUserGroupCount(data.userId);
        if (userGroups >= 3) { // Already in 3 groups, trying for 4th
            const rating = this.getUserRating(data.userId);
            if (rating < 4) { // Less than 4-star rating
                throw new Error('Borrower needs good rating (4+ stars) to join 4th group');
            }
        }

        return true;
    }

    // STRICT: Loan request validator
    validateLoanRequest(data) {
        if (!data || !data.borrowerId || !data.lenderId || !data.groupId || !data.amount || !data.category) {
            throw new Error('Loan request requires borrowerId, lenderId, groupId, amount, and category');
        }

        // No cross-group lending
        const borrowerGroups = this.getUserGroups(data.borrowerId);
        const lenderGroups = this.getUserGroups(data.lenderId);
        
        const commonGroups = borrowerGroups.filter(group => lenderGroups.includes(group));
        if (commonGroups.length === 0) {
            throw new Error('Borrower and lender must be in the same group (Group isolation rule)');
        }

        if (!commonGroups.includes(data.groupId)) {
            throw new Error('Loan must be within the same group');
        }

        // One active loan per group at a time
        if (this.hasActiveLoanInGroup(data.borrowerId, data.groupId)) {
            throw new Error('Borrower can have only one active loan per group at a time');
        }

        // Check subscription limits
        const subscriptionTier = this.getSubscriptionTier(data.lenderId);
        const maxAmount = this.getTierLimit(subscriptionTier);
        if (data.amount > maxAmount) {
            throw new Error(`Amount exceeds ${subscriptionTier} tier limit of ${maxAmount}`);
        }

        // Loan duration: 7 days maximum
        if (data.duration && data.duration > 7) {
            throw new Error('Maximum repayment period is 7 days (Rule 5.4)');
        }

        return true;
    }

    // STRICT: Loan approval validator
    validateLoanApproval(data) {
        if (!data || !data.loanId || !data.lenderId) {
            throw new Error('Loan approval requires loanId and lenderId');
        }

        // Lender must have active subscription
        if (!this.isSubscriptionActive(data.lenderId)) {
            throw new Error('Lender subscription expired. Cannot approve loan.');
        }

        // Generate ledger automatically
        this.trigger('ledger:created', {
            loanId: data.loanId,
            borrowerId: data.borrowerId,
            lenderId: data.lenderId,
            amount: data.amount,
            interestRate: 0.10, // 10% fixed
            dueDate: this.calculateDueDate(7), // 7 days from now
            status: 'active'
        });

        return true;
    }

    // STRICT: Repayment validator
    validateRepayment(data) {
        if (!data || !data.loanId || !data.amount) {
            throw new Error('Repayment requires loanId and amount');
        }

        const loan = this.getLoan(data.loanId);
        if (!loan) {
            throw new Error('Loan not found');
        }

        // Calculate penalties if overdue
        const now = new Date();
        const dueDate = new Date(loan.dueDate);
        
        if (now > dueDate) {
            const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
            if (daysOverdue > 60) { // 2 months
                // Auto-blacklist after 2 months
                this.trigger('borrower:blacklisted', {
                    borrowerId: loan.borrowerId,
                    loanId: data.loanId,
                    amount: loan.amount,
                    daysOverdue: daysOverdue
                });
                throw new Error('Loan in default for 2+ months. Borrower blacklisted.');
            }
            
            // Apply 5% daily penalty after 7 days
            const penaltyRate = 0.05;
            const penalty = loan.amount * penaltyRate * daysOverdue;
            data.penalty = penalty;
        }

        return true;
    }

    // STRICT: Subscription expiry validator
    validateSubscriptionExpiry(data) {
        if (!data || !data.userId) {
            throw new Error('Subscription expiry check requires userId');
        }

        const expiryDate = this.getSubscriptionExpiry(data.userId);
        const today = new Date();
        
        // Subscription expires on 28th of each month
        if (expiryDate && today > expiryDate) {
            // Block lender access
            this.trigger('lender:blocked', {
                userId: data.userId,
                reason: 'Subscription expired on 28th',
                expiryDate: expiryDate
            });
            
            return false;
        }

        return true;
    }

    // Event bus core methods
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events.has(event)) return;
        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    async trigger(event, data = {}) {
        if (!this.events.has(event)) return;

        // Run hierarchy validation if exists
        if (this.hierarchyValidators.has(event)) {
            const validator = this.hierarchyValidators.get(event);
            try {
                validator(data);
            } catch (error) {
                console.error(`Hierarchy validation failed for ${event}:`, error.message);
                this.trigger('validation:failed', { event, error: error.message, data });
                throw error;
            }
        }

        const callbacks = this.events.get(event);
        const results = [];
        
        for (const callback of callbacks) {
            try {
                const result = await callback(data);
                results.push(result);
            } catch (error) {
                console.error(`Error in ${event} handler:`, error);
                this.trigger('error:handler', { event, error, data });
            }
        }
        
        return results;
    }

    // Helper methods for validation
    getUserGroupCount(userId) {
        // In production, this would query the database
        const userGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_groups`) || '[]');
        return userGroups.length;
    }

    getGroupCountry(groupId) {
        const group = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}`) || '{}');
        return group.countryCode || 'KE'; // Default to Kenya
    }

    getGroupMemberCount(groupId) {
        const members = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_members`) || '[]');
        return members.length;
    }

    isSubscriptionActive(userId) {
        const subscription = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_subscription`) || '{}');
        const expiryDate = new Date(subscription.expiryDate);
        return subscription.tier && new Date() <= expiryDate;
    }

    getSubscriptionExpiry(userId) {
        const subscription = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_subscription`) || '{}');
        if (!subscription.expiryDate) return null;
        
        // Force expiry on 28th of month
        const expiry = new Date(subscription.expiryDate);
        expiry.setDate(28);
        return expiry;
    }

    isUserBlacklisted(userId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        return blacklist.some(entry => entry.userId === userId);
    }

    getUserRating(userId) {
        const ratings = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_ratings`) || '[]');
        if (ratings.length === 0) return 5; // Default 5-star for new users
        return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    }

    getUserGroups(userId) {
        return JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_groups`) || '[]');
    }

    hasActiveLoanInGroup(borrowerId, groupId) {
        const loans = JSON.parse(localStorage.getItem(`mpesewa_borrower_${borrowerId}_loans`) || '[]');
        return loans.some(loan => loan.groupId === groupId && loan.status === 'active');
    }

    getSubscriptionTier(userId) {
        const subscription = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_subscription`) || '{}');
        return subscription.tier || 'basic';
    }

    getTierLimit(tier) {
        const limits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        return limits[tier] || 1500;
    }

    calculateDueDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }

    getLoan(loanId) {
        return JSON.parse(localStorage.getItem(`mpesewa_loan_${loanId}`) || 'null');
    }
}

// Create singleton instance
const mpesewaEventBus = new MpesewaEventBus();

// Export for use in modules
export default mpesewaEventBus;

// Global event constants
export const EVENTS = {
    // Country events
    COUNTRY_SELECTED: 'country:selected',
    COUNTRY_CHANGED: 'country:changed',
    COUNTRY_LOCKED: 'country:locked',
    
    // Group events
    GROUP_CREATED: 'group:created',
    GROUP_JOINED: 'group:joined',
    GROUP_LEFT: 'group:left',
    GROUP_INVITED: 'group:invited',
    
    // Lender events
    LENDER_REGISTERED: 'lender:registered',
    LENDER_SUBSCRIBED: 'lender:subscribed',
    LENDER_BLOCKED: 'lender:blocked',
    LENDER_UNBLOCKED: 'lender:unblocked',
    
    // Borrower events
    BORROWER_REGISTERED: 'borrower:registered',
    BORROWER_RATED: 'borrower:rated',
    BORROWER_BLACKLISTED: 'borrower:blacklisted',
    BORROWER_CLEARED: 'borrower:cleared',
    
    // Loan events
    LOAN_REQUESTED: 'loan:requested',
    LOAN_APPROVED: 'loan:approved',
    LOAN_REJECTED: 'loan:rejected',
    LOAN_DISBURSED: 'loan:disbursed',
    LOAN_REPAID: 'loan:repaid',
    LOAN_DEFAULTED: 'loan:defaulted',
    
    // Ledger events
    LEDGER_CREATED: 'ledger:created',
    LEDGER_UPDATED: 'ledger:updated',
    LEDGER_CLOSED: 'ledger:closed',
    
    // Repayment events
    REPAYMENT_MADE: 'repayment:made',
    REPAYMENT_PARTIAL: 'repayment:partial',
    REPAYMENT_OVERDUE: 'repayment:overdue',
    
    // Subscription events
    SUBSCRIPTION_PURCHASED: 'subscription:purchased',
    SUBSCRIPTION_EXPIRED: 'subscription:expired',
    SUBSCRIPTION_UPGRADED: 'subscription:upgraded',
    SUBSCRIPTION_RENEWED: 'subscription:renewed',
    
    // System events
    VALIDATION_FAILED: 'validation:failed',
    ERROR_HANDLER: 'error:handler',
    HIERARCHY_VIOLATION: 'hierarchy:violation',
    
    // UI events
    ROLE_SWITCHED: 'role:switched',
    DASHBOARD_CHANGED: 'dashboard:changed',
    NOTIFICATION_SHOWN: 'notification:shown'
};

// Hierarchy violation tracker
export class HierarchyViolationError extends Error {
    constructor(message, violationType) {
        super(message);
        this.name = 'HierarchyViolationError';
        this.violationType = violationType;
        this.timestamp = new Date().toISOString();
        
        // Log all hierarchy violations
        const violations = JSON.parse(localStorage.getItem('mpesewa_hierarchy_violations') || '[]');
        violations.push({
            type: violationType,
            message: message,
            timestamp: this.timestamp,
            stack: this.stack
        });
        localStorage.setItem('mpesewa_hierarchy_violations', JSON.stringify(violations));
        
        // Trigger violation event
        mpesewaEventBus.trigger(EVENTS.HIERARCHY_VIOLATION, {
            type: violationType,
            message: message,
            timestamp: this.timestamp
        });
    }
}

// Country isolation enforcer
export function enforceCountryIsolation(userCountry, targetCountry) {
    if (userCountry !== targetCountry) {
        throw new HierarchyViolationError(
            `Cross-country action attempted: ${userCountry} → ${targetCountry}`,
            'COUNTRY_ISOLATION_VIOLATION'
        );
    }
    return true;
}

// Group isolation enforcer
export function enforceGroupIsolation(userGroups, targetGroup) {
    if (!userGroups.includes(targetGroup)) {
        throw new HierarchyViolationError(
            `Cross-group action attempted. User groups: ${userGroups.join(', ')}, Target: ${targetGroup}`,
            'GROUP_ISOLATION_VIOLATION'
        );
    }
    return true;
}

// Subscription enforcement
export function enforceSubscription(lenderId) {
    const eventBus = mpesewaEventBus;
    const isActive = eventBus.isSubscriptionActive(lenderId);
    
    if (!isActive) {
        throw new HierarchyViolationError(
            `Lender ${lenderId} attempted action without active subscription`,
            'SUBSCRIPTION_VIOLATION'
        );
    }
    return true;
}

// Export utility functions
export {
    mpesewaEventBus as EventBus,
    enforceCountryIsolation,
    enforceGroupIsolation,
    enforceSubscription
};