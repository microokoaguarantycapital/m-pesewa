// lender/lender.rules.js
/**
 * M-PESEWA LENDER BUSINESS RULES
 * STRICT ENFORCEMENT OF ALL BUSINESS LOGIC
 * 
 * NON-NEGOTIABLE RULES:
 * 1. Country isolation: No cross-country lending or borrowing
 * 2. Group isolation: Lenders can only lend within their group
 * 3. Subscription enforcement: Lenders blocked when subscription expires
 * 4. Subscription expiry: 28th of each month
 * 5. Admin supremacy: Admin can override any blacklist or ledger
 */

class LenderRules {
    constructor() {
        // Core business rules (immutable)
        this.RULES = Object.freeze({
            // HIERARCHY RULES
            HIERARCHY: {
                chain: 'Global → Country → Groups → Lenders → Borrowers (Ledgers)',
                isolation: {
                    country: true,
                    group: true
                },
                maxGroupsPerBorrower: 4,
                minGroupMembers: 5,
                maxGroupMembers: 1000
            },
            
            // LENDING RULES
            LENDING: {
                maxRepaymentPeriod: 7, // days
                interestRate: 0.10, // 10%
                dailyPartialRepayments: true,
                penaltyRate: 0.05, // 5% daily after 7 days
                defaultPeriod: 60, // days (2 months)
                minLoanAmount: 5,
                oneActiveLoanPerGroup: true
            },
            
            // SUBSCRIPTION RULES
            SUBSCRIPTION: {
                expiryDayOfMonth: 28,
                gracePeriod: 0, // no grace period
                tiers: this.getSubscriptionTiers(),
                enforcement: {
                    blockOnExpiry: true,
                    autoRenew: false
                }
            },
            
            // REPUTATION RULES
            REPUTATION: {
                ratingSystem: {
                    minRating: 1,
                    maxRating: 5,
                    defaultRating: 3
                },
                blacklist: {
                    autoBlacklistAfterDefault: true,
                    defaultPeriod: 60, // days
                    removalOnlyByAdmin: true,
                    globalVisibility: true
                }
            },
            
            // LEDGER RULES
            LEDGER: {
                appendOnly: true,
                unlimitedPerLender: true,
                manualUpdates: true,
                adminOverride: true,
                fields: [
                    'borrowerName',
                    'borrowerContact',
                    'borrowerLocation',
                    'guarantors',
                    'loanCategory',
                    'amountBorrowed',
                    'dateBorrowed',
                    'dueDate',
                    'interest',
                    'penalty',
                    'status',
                    'amountOverdue'
                ]
            },
            
            // VALIDATION RULES
            VALIDATION: {
                registration: {
                    requiredFields: [
                        'fullName',
                        'country',
                        'groupId',
                        'nationalId',
                        'phone',
                        'location',
                        'username',
                        'password',
                        'subscriptionTier'
                    ],
                    password: {
                        minLength: 8,
                        maxLength: 12,
                        requireUpperCase: true,
                        requireLowerCase: true,
                        requireNumbers: true,
                        requireSymbols: true
                    }
                },
                loan: {
                    maxAmountByTier: this.getTierLimits(),
                    categories: this.getLoanCategories(),
                    referralRequired: true,
                    guarantorsRequired: 2
                }
            }
        });
        
        // Country-specific rules
        this.COUNTRY_RULES = this.initializeCountryRules();
    }
    
    /**
     * SUBSCRIPTION TIER RULES
     */
    getSubscriptionTiers() {
        return Object.freeze({
            basic: {
                name: 'Basic',
                maxWeekly: 1500,
                monthlyFee: 50,
                biAnnualFee: 250,
                annualFee: 500,
                crbRequired: false,
                ledgerLimit: 1500,
                description: 'Start small, grow steadily'
            },
            premium: {
                name: 'Premium',
                maxWeekly: 5000,
                monthlyFee: 250,
                biAnnualFee: 1500,
                annualFee: 2500,
                crbRequired: false,
                ledgerLimit: 10000,
                description: 'Medium volume lending'
            },
            super: {
                name: 'Super',
                maxWeekly: 20000,
                monthlyFee: 1000,
                biAnnualFee: 5000,
                annualFee: 8500,
                crbRequired: true,
                ledgerLimit: 20000,
                description: 'High-volume professional lending'
            },
            'lender-of-lenders': {
                name: 'Lender of Lenders',
                maxWeekly: 50000,
                monthlyFee: 500,
                biAnnualFee: 3500,
                annualFee: 6500,
                crbRequired: true,
                minRepaymentPeriod: 30, // days
                description: 'Professional lending with flexible terms',
                specialRules: {
                    interestNegotiable: true,
                    repaymentPeriodNegotiable: true
                }
            }
        });
    }
    
    /**
     * TIER LIMITS
     */
    getTierLimits() {
        const tiers = this.getSubscriptionTiers();
        return Object.keys(tiers).reduce((acc, tier) => {
            acc[tier] = tiers[tier].maxWeekly;
            return acc;
        }, {});
    }
    
    /**
     * LOAN CATEGORIES (20 EMERGENCY CATEGORIES)
     */
    getLoanCategories() {
        return Object.freeze([
            {
                id: 'transport',
                name: 'M-pesewa Fare',
                description: 'Move on, don\'t stall—borrow for your journey.',
                icon: '🚌',
                maxAmountMultiplier: 1.0
            },
            {
                id: 'data',
                name: 'M-pesewa Data',
                description: 'Stay connected, stay informed—borrow when your bundle runs out.',
                icon: '📶',
                maxAmountMultiplier: 0.8
            },
            {
                id: 'cooking-gas',
                name: 'M-pesewa Cooking Gas',
                description: 'Cook with confidence—borrow when your gas is low.',
                icon: '🔥',
                maxAmountMultiplier: 1.2
            },
            {
                id: 'food',
                name: 'M-pesewa Food',
                description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.',
                icon: '🍲',
                maxAmountMultiplier: 1.0
            },
            {
                id: 'wifi',
                name: 'M-pesewa Wifi',
                description: 'Stay connected at home.',
                icon: '📡',
                maxAmountMultiplier: 1.5
            },
            {
                id: 'water',
                name: 'M-pesewa Water Bill',
                description: 'Stay hydrated—borrow for water needs or bills.',
                icon: '🚰',
                maxAmountMultiplier: 1.0
            },
            {
                id: 'electricity',
                name: 'M-pesewa Electricity Tokens',
                description: 'Stay lit, stay powered—borrow tokens when you need it.',
                icon: '⚡',
                maxAmountMultiplier: 1.5
            },
            {
                id: 'tv',
                name: 'M-pesewa TV Subscription',
                description: 'Never miss your favorite shows.',
                icon: '📺',
                maxAmountMultiplier: 0.7
            },
            {
                id: 'fuel',
                name: 'M-pesewa Fuel',
                description: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk).',
                icon: '⛽',
                maxAmountMultiplier: 1.0
            },
            {
                id: 'repair',
                name: 'M-pesewa Repair',
                description: 'Fix it quick—borrow for minor repairs and keep going.',
                icon: '🔧',
                maxAmountMultiplier: 1.3
            },
            {
                id: 'credo',
                name: 'M-pesewa Credo',
                description: 'Fix it fast—borrow for urgent repairs or tools.',
                icon: '🛠️',
                maxAmountMultiplier: 1.5
            },
            {
                id: 'sales-advance',
                name: 'M-Pesa Daily Sales Advance',
                description: 'Small Loan advance for everyday business.',
                icon: '🧾',
                maxAmountMultiplier: 1.0
            },
            {
                id: 'working-capital',
                name: 'M-Pesa Working Capital Advance',
                description: 'Working capital when your business needs it.',
                icon: '🏪',
                maxAmountMultiplier: 2.0
            },
            {
                id: 'soko-loan',
                name: 'M-Pesewa Soko Loan',
                description: 'Market money when you need it.',
                icon: '🛒',
                maxAmountMultiplier: 1.5
            },
            {
                id: 'kidandaski-loan',
                name: 'M-Pesewa Kidandaski Loan',
                description: 'Kibanda/stall money when you need it.',
                icon: '🏗️',
                maxAmountMultiplier: 1.5
            },
            {
                id: 'hawker-loan',
                name: 'M-Pesewa Hawker Loan',
                description: 'Be Street smart, cash flow all time.',
                icon: '🚶‍♂️',
                maxAmountMultiplier: 1.0
            },
            {
                id: 'm-fuliziwa',
                name: 'M-fuliziwa Loan',
                description: 'Your fuliza is not enough? Top up here.',
                icon: '🔄',
                maxAmountMultiplier: 1.0
            },
            {
                id: 'medicine',
                name: 'M-pesewa Medicine',
                description: 'Health first—borrow for urgent medicines.',
                icon: '💊',
                maxAmountMultiplier: 1.0
            },
            {
                id: 'school-fees',
                name: 'M-pesewa School Fees',
                description: 'Secure your future without delay.',
                icon: '🎓',
                maxAmountMultiplier: 2.5
            },
            {
                id: 'advance',
                name: 'M-pesewa Advance',
                description: 'Quick cash when you need it most.',
                icon: '💸',
                maxAmountMultiplier: 1.0
            }
        ]);
    }
    
    /**
     * COUNTRY-SPECIFIC RULES
     */
    initializeCountryRules() {
        return Object.freeze({
            ke: {
                country: 'Kenya',
                currency: 'KSh',
                contact: '+254 709 219 000',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '24/7',
                    localLaws: 'CBK Regulations Apply',
                    taxRequired: false
                }
            },
            ug: {
                country: 'Uganda',
                currency: 'UGX',
                contact: '+256 392 175 546',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '24/7',
                    localLaws: 'Bank of Uganda Regulations',
                    taxRequired: false
                }
            },
            tz: {
                country: 'Tanzania',
                currency: 'TZS',
                contact: '+255 659 073 010',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '24/7',
                    localLaws: 'Bank of Tanzania Regulations',
                    taxRequired: false
                }
            },
            rw: {
                country: 'Rwanda',
                currency: 'RWF',
                contact: '+250 791 590 801',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '24/7',
                    localLaws: 'BNR Regulations',
                    taxRequired: false
                }
            },
            bi: {
                country: 'Burundi',
                currency: 'BIF',
                contact: '+257 79 000 000',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '8AM-6PM',
                    localLaws: 'BRB Regulations',
                    taxRequired: false
                }
            },
            cd: {
                country: 'DRC',
                currency: 'CDF',
                contact: '+243 81 000 0000',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '24/7',
                    localLaws: 'BCC Regulations',
                    taxRequired: false
                }
            },
            ss: {
                country: 'South Sudan',
                currency: 'SSP',
                contact: '+211 955 000 000',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '8AM-6PM',
                    localLaws: 'Bank of South Sudan',
                    taxRequired: false
                }
            },
            za: {
                country: 'South Africa',
                currency: 'ZAR',
                contact: '+27 11 000 0000',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '24/7',
                    localLaws: 'SARB Regulations',
                    taxRequired: true,
                    taxRate: 0.15
                }
            },
            ng: {
                country: 'Nigeria',
                currency: 'NGN',
                contact: '+234 800 000 0000',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '24/7',
                    localLaws: 'CBN Regulations',
                    taxRequired: false
                }
            },
            gh: {
                country: 'Ghana',
                currency: 'GHS',
                contact: '+233 24 000 0000',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '24/7',
                    localLaws: 'Bank of Ghana Regulations',
                    taxRequired: false
                }
            },
            et: {
                country: 'Ethiopia',
                currency: 'ETB',
                contact: '+251 11 000 0000',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '8AM-6PM',
                    localLaws: 'National Bank of Ethiopia',
                    taxRequired: true,
                    taxRate: 0.10
                }
            },
            so: {
                country: 'Somalia',
                currency: 'SOS',
                contact: '+252 63 0000000',
                email: 'info@mpesewa.com',
                rules: {
                    workingHours: '24/7',
                    localLaws: 'Central Bank of Somalia',
                    taxRequired: false
                }
            }
        });
    }
    
    /**
     * VALIDATION METHODS
     */
    
    validateRegistration(data) {
        const errors = [];
        const { VALIDATION } = this.RULES;
        
        // Check required fields
        VALIDATION.registration.requiredFields.forEach(field => {
            if (!data[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        });
        
        // Validate password
        if (data.password) {
            const passwordErrors = this.validatePassword(data.password);
            if (passwordErrors.length > 0) {
                errors.push(...passwordErrors);
            }
        }
        
        // Validate subscription tier
        if (data.subscriptionTier) {
            const tierErrors = this.validateSubscriptionTier(data.subscriptionTier, data);
            if (tierErrors.length > 0) {
                errors.push(...tierErrors);
            }
        }
        
        // Validate country
        if (data.country) {
            if (!this.COUNTRY_RULES[data.country.toLowerCase()]) {
                errors.push(`Unsupported country: ${data.country}`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    validatePassword(password) {
        const errors = [];
        const { password: passwordRules } = this.RULES.VALIDATION.registration;
        
        if (password.length < passwordRules.minLength) {
            errors.push(`Password must be at least ${passwordRules.minLength} characters`);
        }
        
        if (password.length > passwordRules.maxLength) {
            errors.push(`Password must be at most ${passwordRules.maxLength} characters`);
        }
        
        if (passwordRules.requireUpperCase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (passwordRules.requireLowerCase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (passwordRules.requireNumbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (passwordRules.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one symbol');
        }
        
        return errors;
    }
    
    validateSubscriptionTier(tier, data) {
        const errors = [];
        const tiers = this.RULES.SUBSCRIPTION.tiers;
        
        if (!tiers[tier]) {
            errors.push(`Invalid subscription tier: ${tier}`);
            return errors;
        }
        
        // Check CRB requirement for Super and Lender of Lenders
        if (['super', 'lender-of-lenders'].includes(tier)) {
            if (!data.crbVerified) {
                errors.push(`CRB verification required for ${tier} tier`);
            }
        }
        
        return errors;
    }
    
    validateLoanRequest(loanData, lenderData) {
        const errors = [];
        const { LENDING, VALIDATION } = this.RULES;
        
        // Check amount
        if (loanData.amount < LENDING.minLoanAmount) {
            errors.push(`Minimum loan amount is ${LENDING.minLoanAmount}`);
        }
        
        // Check against tier limit
        const tier = lenderData.subscription?.tier;
        if (tier) {
            const tierLimit = VALIDATION.loan.maxAmountByTier[tier];
            if (loanData.amount > tierLimit) {
                errors.push(`Loan amount exceeds tier limit of ${tierLimit}`);
            }
        }
        
        // Check category
        const category = this.getLoanCategories().find(c => c.id === loanData.category);
        if (!category) {
            errors.push(`Invalid loan category: ${loanData.category}`);
        }
        
        // Check referral/guarantor requirements
        if (VALIDATION.loan.referralRequired && (!loanData.referrers || loanData.referrers.length < 2)) {
            errors.push('Two referrers/guarantors are required');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            calculated: {
                interest: loanData.amount * LENDING.interestRate,
                totalDue: loanData.amount + (loanData.amount * LENDING.interestRate),
                dueDate: this.calculateDueDate()
            }
        };
    }
    
    calculateDueDate(startDate = new Date()) {
        const dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + this.RULES.LENDING.maxRepaymentPeriod);
        return dueDate;
    }
    
    calculatePenalty(amount, daysOverdue) {
        const { LENDING } = this.RULES;
        if (daysOverdue <= 0) return 0;
        
        let penalty = 0;
        for (let i = 1; i <= daysOverdue; i++) {
            penalty += amount * LENDING.penaltyRate;
        }
        return penalty;
    }
    
    /**
     * SUBSCRIPTION VALIDATION
     */
    validateSubscription(subscription) {
        const errors = [];
        
        if (!subscription.tier) {
            errors.push('Subscription tier is required');
        }
        
        if (!subscription.expiryDate) {
            errors.push('Subscription expiry date is required');
        } else {
            const expiry = new Date(subscription.expiryDate);
            const today = new Date();
            
            // Check if expired
            if (expiry < today) {
                errors.push('Subscription has expired');
            }
            
            // Check if expiry day is 28th
            if (expiry.getDate() !== this.RULES.SUBSCRIPTION.expiryDayOfMonth) {
                errors.push(`Subscription must expire on the ${this.RULES.SUBSCRIPTION.expiryDayOfMonth}th of the month`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * HIERARCHY VALIDATION
     */
    validateHierarchyChain(entities) {
        const errors = [];
        const { HIERARCHY } = this.RULES;
        
        // Check country isolation
        if (entities.lenderCountry && entities.borrowerCountry) {
            if (entities.lenderCountry !== entities.borrowerCountry) {
                errors.push(`Country isolation violation: ${entities.lenderCountry} ≠ ${entities.borrowerCountry}`);
            }
        }
        
        // Check group isolation
        if (entities.lenderGroupId && entities.borrowerGroupId) {
            if (entities.lenderGroupId !== entities.borrowerGroupId) {
                errors.push(`Group isolation violation: Lender can only lend within their group`);
            }
        }
        
        // Check borrower group limit
        if (entities.borrowerGroups && entities.borrowerGroups.length > HIERARCHY.maxGroupsPerBorrower) {
            errors.push(`Borrower cannot belong to more than ${HIERARCHY.maxGroupsPerBorrower} groups`);
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            chain: HIERARCHY.chain
        };
    }
    
    /**
     * REPUTATION & BLACKLIST RULES
     */
    calculateBorrowerRating(ratings) {
        if (!ratings || ratings.length === 0) {
            return this.RULES.REPUTATION.ratingSystem.defaultRating;
        }
        
        const sum = ratings.reduce((total, rating) => total + rating.value, 0);
        return parseFloat((sum / ratings.length).toFixed(1));
    }
    
    shouldBlacklistBorrower(ledger) {
        const { LENDING, REPUTATION } = this.RULES;
        
        if (!ledger.dueDate || ledger.status === 'CLEARED') {
            return false;
        }
        
        const dueDate = new Date(ledger.dueDate);
        const today = new Date();
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        
        return daysOverdue >= LENDING.defaultPeriod && REPUTATION.blacklist.autoBlacklistAfterDefault;
    }
    
    getBlacklistConditions() {
        return {
            trigger: '60 days overdue',
            consequences: [
                'Cannot borrow',
                'Cannot join new groups',
                'Visible platform-wide',
                'Requires admin approval for removal'
            ],
            removalConditions: [
                'Full repayment (principal + interest + penalties)',
                'Admin approval required',
                'Payment verification'
            ]
        };
    }
    
    /**
     * LEDGER RULES
     */
    validateLedgerUpdate(ledger, updates, updaterRole) {
        const errors = [];
        const { LEDGER } = this.RULES;
        
        // Check if ledger can be updated
        if (ledger.status === 'CLEARED' || ledger.status === 'ARCHIVED') {
            errors.push(`Cannot update ${ledger.status} ledger`);
        }
        
        // Check admin override permission
        if (updates.adminOverride && updaterRole !== 'admin') {
            errors.push('Only admin can perform overrides');
        }
        
        // Validate update fields
        const invalidFields = Object.keys(updates).filter(
            field => !LEDGER.fields.includes(field) && field !== 'adminOverride'
        );
        
        if (invalidFields.length > 0) {
            errors.push(`Invalid update fields: ${invalidFields.join(', ')}`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * PAYMENT RULES
     */
    validatePayment(payment, ledger) {
        const errors = [];
        
        if (payment.amount <= 0) {
            errors.push('Payment amount must be positive');
        }
        
        if (payment.amount > ledger.outstanding) {
            errors.push(`Payment amount (${payment.amount}) exceeds outstanding balance (${ledger.outstanding})`);
        }
        
        // Check if partial payments are allowed
        if (!this.RULES.LENDING.dailyPartialRepayments && payment.amount < ledger.outstanding) {
            errors.push('Partial payments are not allowed for this loan');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * UTILITY METHODS
     */
    getRuleSummary() {
        return {
            hierarchy: this.RULES.HIERARCHY.chain,
            lending: {
                interestRate: `${this.RULES.LENDING.interestRate * 100}%`,
                repaymentPeriod: `${this.RULES.LENDING.maxRepaymentPeriod} days`,
                penalty: `${this.RULES.LENDING.penaltyRate * 100}% daily after due date`,
                defaultPeriod: `${this.RULES.LENDING.defaultPeriod} days`
            },
            subscription: {
                expiryDay: this.RULES.SUBSCRIPTION.expiryDayOfMonth,
                tiers: Object.keys(this.RULES.SUBSCRIPTION.tiers)
            },
            countries: Object.keys(this.COUNTRY_RULES).length
        };
    }
    
    getAllRules() {
        return {
            ...this.RULES,
            countryRules: this.COUNTRY_RULES,
            loanCategories: this.getLoanCategories()
        };
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LenderRules;
} else if (typeof window !== 'undefined') {
    window.LenderRules = LenderRules;
}

// Auto-initialize and log rules
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('M-Pesewa Lender Rules loaded');
        const rules = new LenderRules();
        console.log('Rule Summary:', rules.getRuleSummary());
        console.log('Loan Categories:', rules.getLoanCategories().length);
        console.log('Supported Countries:', Object.keys(rules.COUNTRY_RULES).length);
    });
}