// lender/lender.state-machine.js
/**
 * M-PESEWA LENDER STATE MACHINE
 * STRICT ENFORCEMENT OF GLOBAL HIERARCHY
 * 
 * Hierarchy: Global → Country → Groups → Lenders → Borrowers (Ledgers)
 * 
 * Lender States: NEW → SUBSCRIBED → ACTIVE → SUSPENDED → EXPIRED
 * 
 * Rules:
 * - SUBSCRIBED only valid before 28th of month
 * - EXPIRED = read-only access
 * - SUSPENDED blocks lending, not viewing
 * - Subscriptions are permissions, not billing
 * - Country isolation enforced
 * - Group isolation enforced (lenders only lend within their group)
 */

class LenderStateMachine {
    constructor() {
        // Supported African countries (12 Sub-Saharan)
        this.SUPPORTED_COUNTRIES = [
            'kenya', 'uganda', 'tanzania', 'rwanda', 'burundi', 'drc',
            'south-sudan', 'south-africa', 'nigeria', 'ghana', 'ethiopia', 'somalia'
        ];
        
        // Subscription tiers with limits
        this.SUBSCRIPTION_TIERS = {
            'basic': { maxWeekly: 1500, crbRequired: false },
            'premium': { maxWeekly: 5000, crbRequired: false },
            'super': { maxWeekly: 20000, crbRequired: true },
            'lender-of-lenders': { maxWeekly: 50000, crbRequired: true }
        };
        
        // Initialize state machine
        this.currentState = 'NEW';
        this.states = new Set(['NEW', 'SUBSCRIBED', 'ACTIVE', 'SUSPENDED', 'EXPIRED']);
        
        // State transitions with conditions
        this.transitions = {
            'NEW': {
                'SUBSCRIBED': this.canSubscribe.bind(this)
            },
            'SUBSCRIBED': {
                'ACTIVE': this.canActivate.bind(this),
                'EXPIRED': this.hasSubscriptionExpired.bind(this)
            },
            'ACTIVE': {
                'SUSPENDED': this.canSuspend.bind(this),
                'EXPIRED': this.hasSubscriptionExpired.bind(this)
            },
            'SUSPENDED': {
                'ACTIVE': this.canReactivate.bind(this),
                'EXPIRED': this.hasSubscriptionExpired.bind(this)
            },
            'EXPIRED': {
                'SUBSCRIBED': this.canResubscribe.bind(this)
            }
        };
        
        // Lender profile data
        this.profile = {
            id: null,
            fullName: '',
            brandName: '',
            country: '',
            groupId: null,
            groupName: '',
            nationalId: '',
            phone: '',
            location: '',
            username: '',
            subscription: {
                tier: null,
                startDate: null,
                expiryDate: null,
                status: 'inactive'
            },
            lendingCategories: [],
            ledgers: [],
            totalLent: 0,
            outstandingAmount: 0,
            activeLedgers: 0,
            clearedLedgers: 0
        };
    }

    /**
     * STRICT HIERARCHY VALIDATION
     * Global → Country → Groups → Lenders → Borrowers (Ledgers)
     */
    validateHierarchy(country, groupId) {
        // 1. Country validation
        if (!this.SUPPORTED_COUNTRIES.includes(country.toLowerCase())) {
            throw new Error(`Unsupported country: ${country}. Must be one of: ${this.SUPPORTED_COUNTRIES.join(', ')}`);
        }
        
        // 2. Country isolation - no cross-country operations
        if (this.profile.country && this.profile.country !== country) {
            throw new Error(`Country isolation violation: Lender from ${this.profile.country} cannot operate in ${country}`);
        }
        
        // 3. Group validation (must exist and be in same country)
        if (groupId && this.profile.groupId && this.profile.groupId !== groupId) {
            // Check if lender belongs to multiple groups (max 4 for borrowers, but lenders are single-group)
            // Lenders can only lend within their primary group
            throw new Error(`Group isolation violation: Lender can only operate in group ${this.profile.groupId}`);
        }
        
        return true;
    }

    /**
     * LENDER STATE TRANSITIONS
     */
    
    // Check if can transition to SUBSCRIBED
    canSubscribe(data) {
        if (this.currentState !== 'NEW') return false;
        
        // Required fields for subscription
        const requiredFields = [
            'fullName', 'country', 'groupId', 'nationalId',
            'phone', 'location', 'username', 'subscriptionTier'
        ];
        
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Missing required field for subscription: ${field}`);
            }
        }
        
        // Validate hierarchy
        this.validateHierarchy(data.country, data.groupId);
        
        // Check if subscription tier is valid
        if (!this.SUBSCRIPTION_TIERS[data.subscriptionTier]) {
            throw new Error(`Invalid subscription tier: ${data.subscriptionTier}`);
        }
        
        // CRB check for Super and Lender of Lenders tiers
        if (['super', 'lender-of-lenders'].includes(data.subscriptionTier)) {
            if (!data.crbVerified) {
                throw new Error(`CRB verification required for ${data.subscriptionTier} tier`);
            }
        }
        
        // Calculate expiry date (28th of current month)
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // If today is after 28th, set to 28th of next month
        let expiryDay = 28;
        let expiryMonth = currentMonth;
        let expiryYear = currentYear;
        
        if (today.getDate() > 28) {
            expiryMonth = currentMonth + 1;
            if (expiryMonth > 11) {
                expiryMonth = 0;
                expiryYear++;
            }
        }
        
        this.profile.subscription.expiryDate = new Date(expiryYear, expiryMonth, expiryDay);
        this.profile.subscription.tier = data.subscriptionTier;
        this.profile.subscription.status = 'active';
        
        // Update profile
        Object.assign(this.profile, {
            fullName: data.fullName,
            brandName: data.brandName || '',
            country: data.country,
            groupId: data.groupId,
            groupName: data.groupName || '',
            nationalId: data.nationalId,
            phone: data.phone,
            location: data.location,
            username: data.username,
            lendingCategories: data.lendingCategories || ['All']
        });
        
        return true;
    }
    
    // Check if can transition to ACTIVE
    canActivate() {
        if (this.currentState !== 'SUBSCRIBED') return false;
        
        // Check subscription is valid (before 28th)
        if (this.hasSubscriptionExpired()) {
            return false;
        }
        
        // Check minimum group requirements (min 5 members)
        if (!this.validateGroupRequirements()) {
            throw new Error('Group must have minimum 5 members for activation');
        }
        
        return true;
    }
    
    // Check if can SUSPEND lender
    canSuspend(reason) {
        if (this.currentState !== 'ACTIVE') return false;
        
        // Suspension reasons (for audit logging)
        const validReasons = [
            'violation_of_terms',
            'suspicious_activity',
            'admin_discretion',
            'complaint_received'
        ];
        
        if (!reason || !validReasons.includes(reason)) {
            throw new Error('Valid suspension reason required');
        }
        
        return true;
    }
    
    // Check if can REACTIVATE from SUSPENDED
    canReactivate() {
        if (this.currentState !== 'SUSPENDED') return false;
        
        // Check subscription is still valid
        if (this.hasSubscriptionExpired()) {
            return false;
        }
        
        return true;
    }
    
    // Check if subscription has expired
    hasSubscriptionExpired() {
        if (!this.profile.subscription.expiryDate) return true;
        
        const today = new Date();
        const expiry = new Date(this.profile.subscription.expiryDate);
        
        // Expires on 28th of month - compare dates
        return today > expiry;
    }
    
    // Check if can RESUBSCRIBE after expiry
    canResubscribe(paymentData) {
        if (this.currentState !== 'EXPIRED') return false;
        
        // Validate payment data
        if (!paymentData || !paymentData.transactionId) {
            throw new Error('Valid payment confirmation required for resubscription');
        }
        
        // Recalculate expiry date
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        let expiryDay = 28;
        let expiryMonth = currentMonth;
        let expiryYear = currentYear;
        
        if (today.getDate() > 28) {
            expiryMonth = currentMonth + 1;
            if (expiryMonth > 11) {
                expiryMonth = 0;
                expiryYear++;
            }
        }
        
        this.profile.subscription.expiryDate = new Date(expiryYear, expiryMonth, expiryDay);
        this.profile.subscription.status = 'active';
        
        return true;
    }
    
    /**
     * LENDING OPERATIONS VALIDATION
     */
    
    // Validate lending request
    validateLendingRequest(loanData) {
        // Check state allows lending
        if (this.currentState !== 'ACTIVE') {
            throw new Error(`Lender state ${this.currentState} does not allow lending`);
        }
        
        // Check subscription not expired
        if (this.hasSubscriptionExpired()) {
            throw new Error('Subscription expired. Renew to continue lending');
        }
        
        // Validate hierarchy
        this.validateHierarchy(this.profile.country, loanData.groupId);
        
        // Check group isolation
        if (this.profile.groupId !== loanData.groupId) {
            throw new Error(`Group isolation: Lender can only lend in group ${this.profile.groupId}`);
        }
        
        // Check if lender supports this category
        if (!this.profile.lendingCategories.includes('All')) {
            if (!this.profile.lendingCategories.includes(loanData.category)) {
                throw new Error(`Lender does not support loan category: ${loanData.category}`);
            }
        }
        
        // Check weekly lending limit
        const tierLimit = this.SUBSCRIPTION_TIERS[this.profile.subscription.tier].maxWeekly;
        const weeklyTotal = this.calculateWeeklyLending();
        
        if (weeklyTotal + loanData.amount > tierLimit) {
            throw new Error(`Weekly lending limit of ${tierLimit} exceeded. Current: ${weeklyTotal}, Requested: ${loanData.amount}`);
        }
        
        // Validate loan terms
        if (loanData.amount <= 0) {
            throw new Error('Loan amount must be positive');
        }
        
        if (loanData.amount < 5) {
            throw new Error('Minimum loan amount is 5');
        }
        
        // 7-day repayment period
        const repaymentDate = new Date();
        repaymentDate.setDate(repaymentDate.getDate() + 7);
        
        return {
            valid: true,
            interest: loanData.amount * 0.10, // 10% interest
            repaymentDate: repaymentDate,
            penaltyRate: 0.05 // 5% daily after 7 days
        };
    }
    
    // Calculate weekly lending total
    calculateWeeklyLending() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return this.profile.ledgers
            .filter(ledger => new Date(ledger.date) > oneWeekAgo)
            .reduce((total, ledger) => total + ledger.amount, 0);
    }
    
    // Validate group requirements
    validateGroupRequirements() {
        // In real implementation, this would check group membership count
        // For now, return true (would be validated by group module)
        return true;
    }
    
    /**
     * LEDGER MANAGEMENT
     */
    
    // Create ledger entry (append-only)
    createLedger(borrowerData, loanData) {
        const validation = this.validateLendingRequest({
            groupId: borrowerData.groupId,
            category: loanData.category,
            amount: loanData.amount
        });
        
        if (!validation.valid) {
            throw new Error('Lending validation failed');
        }
        
        const ledgerId = `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const ledgerEntry = {
            id: ledgerId,
            borrowerId: borrowerData.id,
            borrowerName: borrowerData.fullName,
            borrowerContact: borrowerData.phone,
            borrowerLocation: borrowerData.location,
            guarantors: borrowerData.guarantors || [],
            category: loanData.category,
            amount: loanData.amount,
            date: new Date().toISOString(),
            dueDate: validation.repaymentDate.toISOString(),
            interest: validation.interest,
            penaltyRate: validation.penaltyRate,
            status: 'ACTIVE',
            payments: [],
            outstanding: loanData.amount + validation.interest,
            lenderNotes: '',
            borrowerRating: null,
            history: [
                {
                    action: 'CREATED',
                    timestamp: new Date().toISOString(),
                    by: this.profile.username,
                    details: `Loan of ${loanData.amount} created for ${borrowerData.fullName}`
                }
            ]
        };
        
        // Append to ledgers (immutable)
        this.profile.ledgers.push(ledgerEntry);
        this.profile.activeLedgers++;
        this.profile.totalLent += loanData.amount;
        this.profile.outstandingAmount += (loanData.amount + validation.interest);
        
        // Log audit trail
        this.logAudit('LEDGER_CREATED', {
            ledgerId,
            borrowerId: borrowerData.id,
            amount: loanData.amount
        });
        
        return ledgerEntry;
    }
    
    // Update ledger (manual updates by lender)
    updateLedger(ledgerId, updateData) {
        const ledgerIndex = this.profile.ledgers.findIndex(l => l.id === ledgerId);
        
        if (ledgerIndex === -1) {
            throw new Error(`Ledger ${ledgerId} not found`);
        }
        
        const ledger = this.profile.ledgers[ledgerIndex];
        
        // Create updated copy (immutable pattern)
        const updatedLedger = { ...ledger };
        
        // Only allow specific updates
        if (updateData.payment) {
            // Record payment
            updatedLedger.payments.push({
                amount: updateData.payment.amount,
                date: new Date().toISOString(),
                method: updateData.payment.method || 'manual',
                reference: updateData.payment.reference || ''
            });
            
            // Update outstanding amount
            updatedLedger.outstanding -= updateData.payment.amount;
            
            // Check if cleared
            if (updatedLedger.outstanding <= 0) {
                updatedLedger.status = 'CLEARED';
                this.profile.clearedLedgers++;
                this.profile.activeLedgers--;
                this.profile.outstandingAmount -= (ledger.amount + ledger.interest);
            }
            
            // Log history
            updatedLedger.history.push({
                action: 'PAYMENT_RECEIVED',
                timestamp: new Date().toISOString(),
                by: this.profile.username,
                details: `Payment of ${updateData.payment.amount} received`
            });
        }
        
        if (updateData.rating && [1, 2, 3, 4, 5].includes(updateData.rating)) {
            updatedLedger.borrowerRating = updateData.rating;
            updatedLedger.history.push({
                action: 'RATING_UPDATED',
                timestamp: new Date().toISOString(),
                by: this.profile.username,
                details: `Borrower rated ${updateData.rating} stars`
            });
        }
        
        if (updateData.notes) {
            updatedLedger.lenderNotes = updateData.notes;
        }
        
        // Apply penalty if overdue
        if (updateData.applyPenalty) {
            const dueDate = new Date(ledger.dueDate);
            const today = new Date();
            
            if (today > dueDate) {
                const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                if (daysOverdue > 0) {
                    const penalty = ledger.outstanding * ledger.penaltyRate * daysOverdue;
                    updatedLedger.outstanding += penalty;
                    updatedLedger.history.push({
                        action: 'PENALTY_APPLIED',
                        timestamp: new Date().toISOString(),
                        by: this.profile.username,
                        details: `Penalty of ${penalty} applied for ${daysOverdue} days overdue`
                    });
                }
            }
        }
        
        // Update ledger in array (immutable replacement)
        this.profile.ledgers[ledgerIndex] = updatedLedger;
        
        // Log audit
        this.logAudit('LEDGER_UPDATED', {
            ledgerId,
            updates: Object.keys(updateData)
        });
        
        return updatedLedger;
    }
    
    // Blacklist borrower (after 2 months default)
    blacklistBorrower(ledgerId, reason) {
        const ledger = this.profile.ledgers.find(l => l.id === ledgerId);
        
        if (!ledger) {
            throw new Error(`Ledger ${ledgerId} not found`);
        }
        
        // Check if overdue for 2 months (60 days)
        const dueDate = new Date(ledger.dueDate);
        const today = new Date();
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        
        if (daysOverdue < 60) {
            throw new Error(`Borrower can only be blacklisted after 60 days overdue. Current: ${daysOverdue} days`);
        }
        
        // Create blacklist entry
        const blacklistEntry = {
            borrowerId: ledger.borrowerId,
            borrowerName: ledger.borrowerName,
            ledgerId: ledgerId,
            amountDefaulted: ledger.outstanding,
            daysOverdue: daysOverdue,
            dateBlacklisted: new Date().toISOString(),
            reason: reason || 'Default after 2 months',
            lenderId: this.profile.id,
            status: 'ACTIVE'
        };
        
        // Update ledger status
        const ledgerIndex = this.profile.ledgers.findIndex(l => l.id === ledgerId);
        this.profile.ledgers[ledgerIndex].status = 'DEFAULTED';
        
        // Log audit
        this.logAudit('BORROWER_BLACKLISTED', blacklistEntry);
        
        return blacklistEntry;
    }
    
    /**
     * STATE TRANSITION EXECUTION
     */
    
    // Transition to new state
    transitionTo(newState, data = {}) {
        if (!this.states.has(newState)) {
            throw new Error(`Invalid state: ${newState}`);
        }
        
        const possibleTransitions = this.transitions[this.currentState];
        
        if (!possibleTransitions || !possibleTransitions[newState]) {
            throw new Error(`Transition from ${this.currentState} to ${newState} not allowed`);
        }
        
        // Check transition condition
        const canTransition = possibleTransitions[newState](data);
        
        if (!canTransition) {
            throw new Error(`Transition condition failed for ${this.currentState} → ${newState}`);
        }
        
        // Execute transition
        const oldState = this.currentState;
        this.currentState = newState;
        
        // Log state change
        this.logAudit('STATE_CHANGED', {
            from: oldState,
            to: newState,
            timestamp: new Date().toISOString(),
            data: data
        });
        
        return {
            success: true,
            oldState,
            newState,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * AUDIT LOGGING
     */
    
    logAudit(action, details) {
        // In production, this would write to audit log
        console.log(`[AUDIT] ${action}:`, {
            lenderId: this.profile.id,
            username: this.profile.username,
            country: this.profile.country,
            groupId: this.profile.groupId,
            timestamp: new Date().toISOString(),
            details
        });
        
        return {
            action,
            timestamp: new Date().toISOString(),
            details
        };
    }
    
    /**
     * GETTERS FOR UI
     */
    
    getState() {
        return {
            current: this.currentState,
            allowedTransitions: Object.keys(this.transitions[this.currentState] || {}),
            subscriptionValid: !this.hasSubscriptionExpired(),
            subscriptionExpiry: this.profile.subscription.expiryDate,
            daysToExpiry: this.getDaysToExpiry()
        };
    }
    
    getDaysToExpiry() {
        if (!this.profile.subscription.expiryDate) return 0;
        
        const today = new Date();
        const expiry = new Date(this.profile.subscription.expiryDate);
        const diffTime = expiry - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    getProfile() {
        return {
            ...this.profile,
            state: this.currentState,
            canLend: this.currentState === 'ACTIVE' && !this.hasSubscriptionExpired(),
            weeklyLimit: this.SUBSCRIPTION_TIERS[this.profile.subscription.tier]?.maxWeekly || 0,
            weeklyUsed: this.calculateWeeklyLending(),
            weeklyRemaining: this.calculateWeeklyRemaining()
        };
    }
    
    calculateWeeklyRemaining() {
        const tierLimit = this.SUBSCRIPTION_TIERS[this.profile.subscription.tier]?.maxWeekly || 0;
        const weeklyUsed = this.calculateWeeklyLending();
        return Math.max(0, tierLimit - weeklyUsed);
    }
    
    getLedgers(filter = 'all') {
        switch (filter) {
            case 'active':
                return this.profile.ledgers.filter(l => l.status === 'ACTIVE');
            case 'cleared':
                return this.profile.ledgers.filter(l => l.status === 'CLEARED');
            case 'defaulted':
                return this.profile.ledgers.filter(l => l.status === 'DEFAULTED');
            default:
                return this.profile.ledgers;
        }
    }
    
    /**
     * INITIALIZATION
     */
    
    initialize(profileData) {
        if (!profileData || !profileData.id) {
            throw new Error('Valid profile data required for initialization');
        }
        
        // Set profile data
        this.profile = { ...this.profile, ...profileData };
        
        // Determine initial state based on subscription
        if (!this.profile.subscription || !this.profile.subscription.tier) {
            this.currentState = 'NEW';
        } else if (this.hasSubscriptionExpired()) {
            this.currentState = 'EXPIRED';
        } else if (this.profile.subscription.status === 'active') {
            this.currentState = 'ACTIVE';
        } else {
            this.currentState = 'SUBSCRIBED';
        }
        
        // Validate hierarchy
        this.validateHierarchy(this.profile.country, this.profile.groupId);
        
        return this.getState();
    }
    
    /**
     * STATIC METHODS FOR COUNTRY OPERATIONS
     */
    
    static getSupportedCountries() {
        return [
            { code: 'ke', name: 'Kenya', currency: 'KSh' },
            { code: 'ug', name: 'Uganda', currency: 'UGX' },
            { code: 'tz', name: 'Tanzania', currency: 'TZS' },
            { code: 'rw', name: 'Rwanda', currency: 'RWF' },
            { code: 'bi', name: 'Burundi', currency: 'BIF' },
            { code: 'cd', name: 'DRC', currency: 'CDF' },
            { code: 'ss', name: 'South Sudan', currency: 'SSP' },
            { code: 'za', name: 'South Africa', currency: 'ZAR' },
            { code: 'ng', name: 'Nigeria', currency: 'NGN' },
            { code: 'gh', name: 'Ghana', currency: 'GHS' },
            { code: 'et', name: 'Ethiopia', currency: 'ETB' },
            { code: 'so', name: 'Somalia', currency: 'SOS' }
        ];
    }
    
    static getSubscriptionTiers() {
        return {
            'basic': {
                name: 'Basic',
                maxWeekly: 1500,
                monthly: 50,
                biAnnual: 250,
                annual: 500,
                crbRequired: false,
                description: 'Start with small loans'
            },
            'premium': {
                name: 'Premium',
                maxWeekly: 5000,
                monthly: 250,
                biAnnual: 1500,
                annual: 2500,
                crbRequired: false,
                description: 'Medium-sized lending'
            },
            'super': {
                name: 'Super',
                maxWeekly: 20000,
                monthly: 1000,
                biAnnual: 5000,
                annual: 8500,
                crbRequired: true,
                description: 'High-volume lending'
            },
            'lender-of-lenders': {
                name: 'Lender of Lenders',
                maxWeekly: 50000,
                monthly: 500,
                biAnnual: 3500,
                annual: 6500,
                crbRequired: true,
                description: 'Professional lending'
            }
        };
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LenderStateMachine;
} else if (typeof window !== 'undefined') {
    window.LenderStateMachine = LenderStateMachine;
}

// Auto-initialize if in browser context
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('M-Pesewa Lender State Machine loaded');
        console.log('Supported countries:', LenderStateMachine.getSupportedCountries());
        console.log('Subscription tiers:', LenderStateMachine.getSubscriptionTiers());
    });
}