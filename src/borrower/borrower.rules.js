/**
 * M-Pesewa Borrower Rules Engine
 * ENFORCES STRICT HIERARCHY: Global → Country → Groups → Borrowers
 * 
 * Business Rules:
 * 1. Country isolation: No cross-country borrowing
 * 2. Group isolation: Borrow within groups only
 * 3. Max 4 groups with good rating
 * 4. 7-day loan period, 10% interest
 * 5. 5% daily penalty after 7 days
 * 6. Default after 2 months
 * 7. Blacklist enforcement
 * 8. Subscription-free for borrowers
 */

class BorrowerRules {
    constructor() {
        // STRICT RULES CONFIGURATION
        this.rules = {
            // HIERARCHY RULES
            MAX_GROUPS_PER_BORROWER: 4,
            MIN_GROUP_MEMBERS: 5,
            MAX_GROUP_MEMBERS: 1000,
            
            // LOAN RULES
            LOAN_PERIOD_DAYS: 7,
            INTEREST_RATE: 0.10, // 10%
            PENALTY_RATE_DAILY: 0.05, // 5% daily after 7 days
            DEFAULT_PERIOD_MONTHS: 2,
            
            // BORROWING LIMITS PER TIER (in local currency)
            TIER_LIMITS: {
                BASIC: 1500,    // ≤ 1,500 per week
                PREMIUM: 5000,  // ≤ 5,000 per week
                SUPER: 20000    // ≤ 20,000 per week
            },
            
            // RATING RULES
            MIN_GOOD_RATING: 3.5, // 3.5+ stars
            RATING_DECAY_PER_DEFAULT: 1.5, // Stars lost per default
            RATING_RECOVERY_PER_GOOD_REPAYMENT: 0.25, // Stars gained
            
            // BLACKLIST RULES
            BLACKLIST_AUTO_DAYS: 60, // 2 months = 60 days
            BLACKLIST_GLOBAL: true, // Blacklisted across all countries
            
            // REFERRAL RULES
            MIN_REFERRERS: 2, // Must provide 2 referrers/guarantors
            REFERRER_SAME_GROUP: true, // Referrers must be in same group
            
            // COUNTRY SPECIFIC RULES
            COUNTRIES: [
                'KE', 'UG', 'TZ', 'RW', 'BI', 'CD', 'SS', 'ZA', 'NG', 'GH', 'ET', 'SO'
            ]
        };

        // CURRENCY CONFIGURATION
        this.currencies = {
            KE: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
            UG: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
            TZ: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
            RW: { code: 'RWF', symbol: 'RF', name: 'Rwandan Franc' },
            BI: { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc' },
            CD: { code: 'CDF', symbol: 'FC', name: 'Congolese Franc' },
            SS: { code: 'SSP', symbol: '£', name: 'South Sudanese Pound' },
            ZA: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
            NG: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
            GH: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
            ET: { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
            SO: { code: 'SOS', symbol: 'Sh.So.', name: 'Somali Shilling' }
        };
    }

    /**
     * Validate borrower eligibility
     */
    validateBorrowerEligibility(borrower, loanRequest) {
        const errors = [];
        const warnings = [];

        // 1. COUNTRY ISOLATION VALIDATION
        if (!this.validateCountryIsolation(borrower, loanRequest)) {
            errors.push('Country isolation violation: Cannot borrow across countries');
        }

        // 2. GROUP MEMBERSHIP VALIDATION
        if (!this.validateGroupMembership(borrower, loanRequest)) {
            errors.push('Group isolation violation: Borrower not in requested group');
        }

        // 3. MAX GROUPS VALIDATION
        if (!this.validateMaxGroups(borrower)) {
            errors.push(`Maximum group limit reached: ${this.rules.MAX_GROUPS_PER_BORROWER} groups maximum`);
        }

        // 4. RATING VALIDATION
        if (!this.validateBorrowerRating(borrower)) {
            errors.push(`Minimum rating required: ${this.rules.MIN_GOOD_RATING} stars`);
        }

        // 5. ACTIVE LOAN VALIDATION
        if (!this.validateActiveLoans(borrower, loanRequest.groupId)) {
            errors.push('One active loan per group at a time');
        }

        // 6. TIER LIMIT VALIDATION
        if (!this.validateTierLimits(borrower, loanRequest.amount)) {
            const limit = this.rules.TIER_LIMITS[borrower.tier] || 0;
            errors.push(`Tier limit exceeded: Maximum ${limit} per week`);
        }

        // 7. BLACKLIST VALIDATION
        if (!this.validateBlacklistStatus(borrower)) {
            errors.push('Blacklisted borrowers cannot borrow');
        }

        // 8. DEFAULT STATUS VALIDATION
        if (!this.validateDefaultStatus(borrower)) {
            errors.push('Defaulted borrowers blocked from all groups');
        }

        // 9. REFERRER VALIDATION
        if (!this.validateReferrers(borrower)) {
            errors.push(`Must provide ${this.rules.MIN_REFERRERS} referrers/guarantors from same group`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            rulesApplied: this.rules
        };
    }

    /**
     * STRICT RULE: No cross-country borrowing
     */
    validateCountryIsolation(borrower, loanRequest) {
        // Borrower must be in same country as group
        if (borrower.countryCode !== loanRequest.countryCode) {
            console.error(`Country mismatch: Borrower ${borrower.countryCode}, Group ${loanRequest.countryCode}`);
            return false;
        }

        // Lender must be in same country
        if (loanRequest.lenderCountryCode && borrower.countryCode !== loanRequest.lenderCountryCode) {
            console.error(`Lender country mismatch: Borrower ${borrower.countryCode}, Lender ${loanRequest.lenderCountryCode}`);
            return false;
        }

        return true;
    }

    /**
     * STRICT RULE: Borrow within groups only
     */
    validateGroupMembership(borrower, loanRequest) {
        // Check if borrower is member of requested group
        const isGroupMember = borrower.groupIds.includes(loanRequest.groupId);
        
        if (!isGroupMember) {
            console.error(`Borrower not in group ${loanRequest.groupId}`);
            return false;
        }

        return true;
    }

    /**
     * STRICT RULE: Maximum 4 groups per borrower
     */
    validateMaxGroups(borrower) {
        if (borrower.groupIds.length > this.rules.MAX_GROUPS_PER_BORROWER) {
            console.error(`Borrower in ${borrower.groupIds.length} groups, maximum is ${this.rules.MAX_GROUPS_PER_BORROWER}`);
            return false;
        }
        return true;
    }

    /**
     * RULE: Good rating required for additional groups
     */
    validateBorrowerRating(borrower) {
        // Only need good rating if joining more than 1 group
        if (borrower.groupIds.length > 1) {
            return borrower.rating >= this.rules.MIN_GOOD_RATING;
        }
        return true; // No rating requirement for first group
    }

    /**
     * RULE: One active loan per group at a time
     */
    validateActiveLoans(borrower, groupId) {
        if (!borrower.activeLoans) return true;

        const activeLoanInGroup = borrower.activeLoans.find(loan => 
            loan.groupId === groupId && 
            loan.status === 'ACTIVE'
        );

        return !activeLoanInGroup;
    }

    /**
     * RULE: Tier-based borrowing limits
     */
    validateTierLimits(borrower, requestedAmount) {
        const tier = borrower.tier || 'BASIC';
        const weeklyLimit = this.rules.TIER_LIMITS[tier];
        
        if (!weeklyLimit) {
            console.error(`Invalid tier: ${tier}`);
            return false;
        }

        // Calculate weekly borrowing (would query ledger system)
        const weeklyBorrowed = this.calculateWeeklyBorrowing(borrower);
        
        if (weeklyBorrowed + requestedAmount > weeklyLimit) {
            console.error(`Tier limit: ${weeklyBorrowed} + ${requestedAmount} > ${weeklyLimit}`);
            return false;
        }

        return true;
    }

    /**
     * STRICT RULE: Blacklisted borrowers cannot borrow
     */
    validateBlacklistStatus(borrower) {
        if (borrower.isBlacklisted) {
            console.error('Borrower is blacklisted');
            return false;
        }
        return true;
    }

    /**
     * STRICT RULE: Defaulted borrowers blocked from all groups
     */
    validateDefaultStatus(borrower) {
        if (borrower.isDefaulted) {
            console.error('Borrower is in default');
            return false;
        }
        return true;
    }

    /**
     * RULE: Must have 2 referrers/guarantors from same group
     */
    validateReferrers(borrower) {
        if (!borrower.referrers || borrower.referrers.length < this.rules.MIN_REFERRERS) {
            return false;
        }

        if (this.rules.REFERRER_SAME_GROUP) {
            // Check all referrers are in at least one common group with borrower
            const commonGroups = borrower.referrers.every(ref => 
                ref.groups.some(groupId => borrower.groupIds.includes(groupId))
            );
            return commonGroups;
        }

        return true;
    }

    /**
     * Calculate loan repayment schedule
     */
    calculateRepaymentSchedule(principal, countryCode) {
        const currency = this.currencies[countryCode] || this.currencies.KE;
        
        const interest = principal * this.rules.INTEREST_RATE;
        const totalDue = principal + interest;
        const dailyRepayment = totalDue / this.rules.LOAN_PERIOD_DAYS;

        return {
            principal: {
                amount: principal,
                currency: currency.symbol
            },
            interest: {
                rate: this.rules.INTEREST_RATE * 100, // Percentage
                amount: interest,
                currency: currency.symbol
            },
            totalDue: {
                amount: totalDue,
                currency: currency.symbol
            },
            periodDays: this.rules.LOAN_PERIOD_DAYS,
            dailyRepayment: {
                amount: dailyRepayment,
                currency: currency.symbol
            },
            dueDate: this.calculateDueDate(),
            penaltyRule: {
                appliesAfterDays: this.rules.LOAN_PERIOD_DAYS,
                rate: this.rules.PENALTY_RATE_DAILY * 100, // Percentage
                description: `${this.rules.PENALTY_RATE_DAILY * 100}% daily after ${this.rules.LOAN_PERIOD_DAYS} days`
            }
        };
    }

    /**
     * Calculate due date (7 days from now)
     */
    calculateDueDate() {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + this.rules.LOAN_PERIOD_DAYS);
        return dueDate.toISOString();
    }

    /**
     * Calculate penalties for overdue loan
     */
    calculatePenalties(principal, overdueDays) {
        if (overdueDays <= this.rules.LOAN_PERIOD_DAYS) {
            return {
                penaltyDays: 0,
                dailyPenalty: 0,
                totalPenalty: 0,
                nextPenaltyDate: null
            };
        }

        const penaltyDays = overdueDays - this.rules.LOAN_PERIOD_DAYS;
        const dailyPenalty = principal * this.rules.PENALTY_RATE_DAILY;
        const totalPenalty = dailyPenalty * penaltyDays;

        return {
            penaltyDays,
            dailyPenalty,
            totalPenalty,
            nextPenaltyDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            warning: `5% daily penalty applied (${penaltyDays} days overdue)`
        };
    }

    /**
     * Calculate if loan should be marked as defaulted
     */
    shouldMarkAsDefaulted(disbursementDate) {
        const disbursement = new Date(disbursementDate);
        const today = new Date();
        
        const monthsDiff = (today.getFullYear() - disbursement.getFullYear()) * 12 + 
                          (today.getMonth() - disbursement.getMonth());
        
        return monthsDiff >= this.rules.DEFAULT_PERIOD_MONTHS;
    }

    /**
     * Calculate weekly borrowing total
     */
    calculateWeeklyBorrowing(borrower) {
        // This would query ledger system
        // For simulation, return 0 or use provided data
        return borrower.weeklyBorrowed || 0;
    }

    /**
     * Update borrower rating based on repayment behavior
     */
    updateBorrowerRating(currentRating, repaymentBehavior) {
        let newRating = currentRating;

        switch (repaymentBehavior) {
            case 'ON_TIME':
                newRating += this.rules.RATING_RECOVERY_PER_GOOD_REPAYMENT;
                break;
            case 'LATE_1_7_DAYS':
                newRating -= 0.5;
                break;
            case 'LATE_8_30_DAYS':
                newRating -= 1.0;
                break;
            case 'DEFAULTED':
                newRating -= this.rules.RATING_DECAY_PER_DEFAULT;
                break;
            case 'BLACKLISTED':
                newRating = 1.0; // Minimum rating
                break;
        }

        // Clamp between 1.0 and 5.0
        return Math.max(1.0, Math.min(5.0, newRating));
    }

    /**
     * Check if borrower can join another group
     */
    canJoinGroup(borrower, targetGroup) {
        const validations = [
            {
                rule: 'MAX_GROUPS',
                check: () => borrower.groupIds.length < this.rules.MAX_GROUPS_PER_BORROWER,
                message: `Maximum ${this.rules.MAX_GROUPS_PER_BORROWER} groups allowed`
            },
            {
                rule: 'COUNTRY_ISOLATION',
                check: () => borrower.countryCode === targetGroup.countryCode,
                message: 'Cannot join group in different country'
            },
            {
                rule: 'RATING_FOR_ADDITIONAL_GROUPS',
                check: () => {
                    if (borrower.groupIds.length >= 1) {
                        return borrower.rating >= this.rules.MIN_GOOD_RATING;
                    }
                    return true;
                },
                message: `Good rating (${this.rules.MIN_GOOD_RATING}+ stars) required for additional groups`
            },
            {
                rule: 'NOT_BLACKLISTED',
                check: () => !borrower.isBlacklisted,
                message: 'Blacklisted borrowers cannot join new groups'
            },
            {
                rule: 'NOT_DEFAULTED',
                check: () => !borrower.isDefaulted,
                message: 'Defaulted borrowers blocked from all groups'
            }
        ];

        const failures = validations.filter(v => !v.check());
        
        return {
            canJoin: failures.length === 0,
            failures: failures.map(f => ({ rule: f.rule, message: f.message })),
            currentGroups: borrower.groupIds.length,
            maxGroups: this.rules.MAX_GROUPS_PER_BORROWER,
            rating: borrower.rating,
            minRating: this.rules.MIN_GOOD_RATING
        };
    }

    /**
     * Get currency info for country
     */
    getCurrencyInfo(countryCode) {
        return this.currencies[countryCode] || this.currencies.KE;
    }

    /**
     * Validate country code
     */
    isValidCountryCode(countryCode) {
        return this.rules.COUNTRIES.includes(countryCode);
    }

    /**
     * Get all rules for display/audit
     */
    getAllRules() {
        return {
            ...this.rules,
            currencies: this.currencies,
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BorrowerRules };
}

// Browser global export
if (typeof window !== 'undefined') {
    window.BorrowerRules = BorrowerRules;
}