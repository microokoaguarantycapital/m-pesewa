/**
 * M-PESEWA Group Rules
 * STRICT HIERARCHY RULES: Global → Country → Groups → Lenders → Borrowers
 * Non-negotiable business rules enforcement
 */

class GroupRules {
    constructor() {
        this.countries = [
            'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi',
            'DRC', 'South Sudan', 'South Africa', 'Nigeria', 'Ghana', 'Ethiopia'
        ];
        
        this.currencyMap = this.buildCurrencyMap();
        this.rules = this.buildRules();
    }

    /**
     * Build currency mapping
     * @returns {object} Currency map
     */
    buildCurrencyMap() {
        return {
            'Kenya': { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
            'Uganda': { code: 'UGX', symbol: 'UGX', name: 'Ugandan Shilling' },
            'Tanzania': { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
            'Rwanda': { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc' },
            'Burundi': { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc' },
            'DRC': { code: 'CDF', symbol: 'FC', name: 'Congolese Franc' },
            'South Sudan': { code: 'SSP', symbol: '£', name: 'South Sudanese Pound' },
            'South Africa': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
            'Nigeria': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
            'Ghana': { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
            'Ethiopia': { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' }
        };
    }

    /**
     * Build comprehensive rules object
     * @returns {object} Rules configuration
     */
    buildRules() {
        return {
            // HIERARCHY RULES (NON-NEGOTIABLE)
            hierarchy: {
                global: {
                    description: 'Global platform containing all countries',
                    children: ['countries']
                },
                countries: {
                    description: 'Country-level isolation',
                    min: 1,
                    max: 'unlimited',
                    isolation: 'STRICT_NO_CROSS_BORDER',
                    children: ['groups']
                },
                groups: {
                    description: 'Trust circles within countries',
                    minMembers: 5,
                    maxMembers: 1000,
                    isolation: 'STRICT_NO_CROSS_GROUP_LENDING',
                    children: ['lenders', 'borrowers']
                },
                lenders: {
                    description: 'Money providers within groups',
                    min: 1,
                    max: 'unlimited',
                    requires: 'SUBSCRIPTION',
                    children: ['ledgers']
                },
                borrowers: {
                    description: 'Money recipients within groups',
                    min: 1,
                    max: 'unlimited',
                    maxGroups: 4,
                    requires: 'GOOD_RATING',
                    children: []
                },
                ledgers: {
                    description: 'Loan obligation records',
                    perLender: 'UNLIMITED',
                    perBorrower: 1,
                    autoCreate: true
                }
            },

            // COUNTRY RULES
            country: {
                isolation: {
                    rule: 'NO_CROSS_COUNTRY_OPERATIONS',
                    enforcement: 'STRICT',
                    violationAction: 'BLOCK_AND_LOG'
                },
                registration: {
                    rule: 'ONE_COUNTRY_PER_USER',
                    changeAllowed: false,
                    changeRequires: 'LOGOUT_RELOGIN'
                },
                currency: {
                    rule: 'OPERATE_IN_LOCAL_CURRENCY_ONLY',
                    conversion: 'NO_AUTO_CONVERSION'
                }
            },

            // GROUP RULES
            group: {
                creation: {
                    minAge: 18,
                    requires: ['NATIONAL_ID', 'PHONE_VERIFICATION'],
                    adminRequirements: ['ACTIVE_SUBSCRIPTION_FOR_LENDER_GROUPS']
                },
                membership: {
                    joinMethod: 'INVITATION_OR_REFERRAL_ONLY',
                    referralRequired: true,
                    referralCount: 2,
                    maxMembers: 1000,
                    minMembers: 5
                },
                types: {
                    allowed: [
                        'FAMILY',
                        'CHURCH',
                        'PROFESSIONAL',
                        'LOCAL_COMMUNITY',
                        'SOCIAL',
                        'BUSINESS_ASSOCIATION',
                        'STUDENT',
                        'NEIGHBORHOOD'
                    ],
                    default: 'FAMILY'
                },
                administration: {
                    adminCount: 1,
                    adminPermissions: [
                        'INVITE_MEMBERS',
                        'REMOVE_MEMBERS',
                        'MODERATE_DISPUTES',
                        'VIEW_ALL_LEDGERS',
                        'LOCK_GROUP'
                    ],
                    adminSelection: 'FIRST_CREATOR'
                }
            },

            // LENDER RULES
            lender: {
                registration: {
                    requiredFields: [
                        'FULL_NAME',
                        'NATIONAL_ID',
                        'PHONE_NUMBER',
                        'LOCATION',
                        'CATEGORIES',
                        'SUBSCRIPTION_LEVEL',
                        'USERNAME',
                        'PASSWORD'
                    ],
                    optionalFields: ['BRAND_NAME', 'GOOGLE_LOGIN']
                },
                subscription: {
                    required: true,
                    tiers: this.buildSubscriptionTiers(),
                    expiryRule: '28TH_OF_EACH_MONTH',
                    expiryAction: 'BLOCK_LENDING_ACCESS',
                    gracePeriod: 'NONE'
                },
                lending: {
                    scope: 'WITHIN_GROUP_ONLY',
                    categorySelection: 'ALL_OR_SPECIFIC',
                    ledgerCreation: 'AUTOMATIC_ON_APPROVAL',
                    disbursement: 'MANUAL_OFF_PLATFORM',
                    limits: this.buildLendingLimits()
                },
                dualRole: {
                    allowed: true,
                    requires: 'SEPARATE_PROFILES',
                    switchMethod: 'LOGOUT_RELOGIN'
                }
            },

            // BORROWER RULES
            borrower: {
                registration: {
                    requiredFields: [
                        'FULL_NAME',
                        'NATIONAL_ID',
                        'PHONE_NUMBER',
                        'LOCATION',
                        'GROUP_SELECTION'
                    ],
                    optionalFields: ['GOOGLE_LOGIN'],
                    subscriptionRequired: false
                },
                borrowing: {
                    maxGroups: 4,
                    goodRatingThreshold: 4.0,
                    activeLoansPerGroup: 1,
                    requestMethod: 'SELECT_LENDER_IN_GROUP'
                },
                repayment: {
                    period: '7_DAYS',
                    interest: '10%',
                    partialPayments: 'ALLOWED_DAILY',
                    penaltyAfter7Days: '5%_DAILY',
                    defaultAfter: '2_MONTHS'
                },
                dualRole: {
                    allowed: true,
                    requires: 'SEPARATE_PROFILES',
                    switchMethod: 'LOGOUT_RELOGIN'
                }
            },

            // LOAN RULES
            loan: {
                terms: {
                    maxDuration: '7_DAYS',
                    interestRate: '10%_WEEKLY',
                    minAmount: 'EQUIVALENT_OF_5_KSH',
                    maxAmount: 'TIER_DEPENDENT',
                    partialRepayment: 'ALLOWED'
                },
                penalties: {
                    after7Days: '5%_DAILY_ON_OUTSTANDING',
                    after2Months: 'DEFAULT_STATUS',
                    defaultAction: 'BLACKLIST'
                },
                approval: {
                    method: 'LENDER_APPROVAL',
                    autoLedger: true,
                    disbursement: 'MANUAL_OFF_PLATFORM'
                }
            },

            // LEDGER RULES
            ledger: {
                creation: 'AUTO_ON_LOAN_APPROVAL',
                fields: [
                    'BORROWER_NAME',
                    'BORROWER_CONTACT',
                    'BORROWER_LOCATION',
                    'GUARANTOR_1_CONTACT',
                    'GUARANTOR_2_CONTACT',
                    'LOAN_CATEGORY',
                    'AMOUNT_BORROWED',
                    'DATE_BORROWED',
                    'DUE_DATE',
                    'INTEREST_10%',
                    'PENALTY_5%_DAILY',
                    'STATUS',
                    'AMOUNT_OVERDUE'
                ],
                management: {
                    update: 'MANUAL_BY_LENDER',
                    adminOverride: 'ALLOWED',
                    deletion: 'NEVER_ALLOWED'
                },
                states: ['ACTIVE', 'CLEARED', 'DEFAULTED']
            },

            // REPUTATION RULES
            reputation: {
                rating: {
                    system: '5_STAR',
                    givenBy: 'LENDERS_TO_BORROWERS',
                    affects: 'GROUP_ACCESS',
                    updateFrequency: 'AFTER_LOAN_COMPLETION'
                },
                blacklist: {
                    trigger: '2_MONTHS_DEFAULT',
                    effects: [
                        'CANNOT_BORROW',
                        'CANNOT_JOIN_NEW_GROUPS',
                        'VISIBLE_BADGE'
                    ],
                    removal: 'ADMIN_ONLY_AFTER_FULL_PAYMENT'
                }
            },

            // SUBSCRIPTION RULES (STRICT 28TH RULE)
            subscription: {
                tiers: this.buildSubscriptionTiers(),
                payment: {
                    method: 'M_PESEWA_TILL_REDIRECT',
                    confirmation: 'REQUIRED_BEFORE_ACCESS',
                    refund: 'NONE'
                },
                expiry: {
                    rule: '28TH_OF_EACH_MONTH',
                    action: 'BLOCK_LENDING_ACCESS',
                    reminder: '7_DAYS_BEFORE'
                },
                limits: this.buildSubscriptionLimits()
            },

            // EMERGENCY CATEGORIES (20 CATEGORIES)
            categories: [
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
            ],

            // VALIDATION RULES
            validation: {
                phone: {
                    kenya: /^\+254[17]\d{8}$/,
                    uganda: /^\+256[7]\d{8}$/,
                    tanzania: /^\+255[67]\d{8}$/,
                    rwanda: /^\+250[7]\d{8}$/,
                    default: /^\+[1-9]\d{1,14}$/
                },
                password: {
                    min: 8,
                    max: 12,
                    requirements: ['UPPERCASE', 'LOWERCASE', 'NUMBER', 'SYMBOL']
                },
                nationalId: {
                    kenya: /^\d{8}$/,
                    uganda: /^[A-Z]{2}\d{7}[A-Z]$/,
                    tanzania: /^\d{9}$/,
                    default: /^[A-Z0-9]{6,20}$/
                }
            }
        };
    }

    /**
     * Build subscription tiers with limits
     * @returns {object} Subscription tiers
     */
    buildSubscriptionTiers() {
        return {
            BASIC: {
                weeklyLimit: 1500,
                monthlyPrice: 50,
                biAnnualPrice: 250,
                annualPrice: 500,
                crbCheck: false,
                maxLedgers: 1500,
                features: ['BASIC_LENDING', 'NO_CRB', 'SINGLE_GROUP']
            },
            PREMIUM: {
                weeklyLimit: 5000,
                monthlyPrice: 250,
                biAnnualPrice: 1500,
                annualPrice: 2500,
                crbCheck: false,
                maxLedgers: 10000,
                features: ['HIGHER_LIMITS', 'MULTI_GROUP', 'PRIORITY_SUPPORT']
            },
            SUPER: {
                weeklyLimit: 20000,
                monthlyPrice: 1000,
                biAnnualPrice: 5000,
                annualPrice: 8500,
                crbCheck: true,
                maxLedgers: 20000,
                features: ['MAX_LIMITS', 'CRB_CHECK', 'DEDICATED_SUPPORT']
            },
            LENDER_OF_LENDERS: {
                weeklyLimit: 50000,
                monthlyPrice: 500,
                biAnnualPrice: 3500,
                annualPrice: 6500,
                crbCheck: true,
                maxLedgers: 50000,
                features: ['CUSTOM_TERMS', 'MIN_1_MONTH_REPAYMENT', 'WHITELABEL']
            }
        };
    }

    /**
     * Build lending limits per tier
     * @returns {object} Lending limits
     */
    buildLendingLimits() {
        return {
            perLoan: {
                BASIC: 1500,
                PREMIUM: 5000,
                SUPER: 20000,
                LENDER_OF_LENDERS: 50000
            },
            perWeek: {
                BASIC: 1500,
                PREMIUM: 5000,
                SUPER: 20000,
                LENDER_OF_LENDERS: 50000
            },
            perBorrower: {
                maxActiveLoans: 1,
                maxTotalExposure: 'TIER_LIMIT'
            }
        };
    }

    /**
     * Build subscription limits
     * @returns {object} Subscription limits
     */
    buildSubscriptionLimits() {
        return {
            BASIC: {
                maxBorrowers: 10,
                maxActiveLoans: 5,
                maxWeeklyTurnover: 1500
            },
            PREMIUM: {
                maxBorrowers: 50,
                maxActiveLoans: 25,
                maxWeeklyTurnover: 5000
            },
            SUPER: {
                maxBorrowers: 200,
                maxActiveLoans: 100,
                maxWeeklyTurnover: 20000
            },
            LENDER_OF_LENDERS: {
                maxBorrowers: 500,
                maxActiveLoans: 250,
                maxWeeklyTurnover: 50000
            }
        };
    }

    /**
     * Validate group creation against all rules
     * @param {object} groupData - Group data
     * @param {object} userData - User data
     * @returns {object} Validation result
     */
    validateGroupCreation(groupData, userData) {
        const errors = [];
        const warnings = [];

        // 1. HIERARCHY VALIDATION
        if (!this.countries.includes(userData.country)) {
            errors.push(`Country ${userData.country} not supported`);
        }

        // 2. USER VALIDATION
        if (userData.age < this.rules.group.creation.minAge) {
            errors.push(`Minimum age ${this.rules.group.creation.minAge} required`);
        }

        if (!userData.nationalIdVerified) {
            errors.push('National ID verification required');
        }

        if (!userData.phoneVerified) {
            errors.push('Phone verification required');
        }

        // 3. GROUP TYPE VALIDATION
        if (!this.rules.group.types.allowed.includes(groupData.type?.toUpperCase())) {
            errors.push(`Group type must be one of: ${this.rules.group.types.allowed.join(', ')}`);
        }

        // 4. SUBSCRIPTION VALIDATION FOR LENDER GROUPS
        const isLenderGroup = ['PROFESSIONAL', 'LENDER_GROUP', 'BUSINESS_ASSOCIATION'].includes(groupData.type?.toUpperCase());
        if (isLenderGroup && !userData.subscriptionActive) {
            errors.push('Active subscription required for lender groups');
        }

        // 5. NAME VALIDATION
        if (!groupData.name || groupData.name.length < 3) {
            errors.push('Group name must be at least 3 characters');
        }

        if (groupData.name.length > 100) {
            errors.push('Group name must be less than 100 characters');
        }

        // 6. USER GROUP LIMIT VALIDATION
        if (userData.groupCount >= 5) {
            errors.push('Maximum of 5 groups per user reached');
        }

        // 7. COUNTRY LOCK VALIDATION
        if (groupData.country !== userData.country) {
            errors.push('Group country must match user country');
        }

        // 8. REFERRAL VALIDATION (if joining existing group)
        if (groupData.referralRequired && !groupData.referrerId) {
            warnings.push('Referral recommended for trust building');
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }

    /**
     * Validate member joining against all rules
     * @param {object} memberData - Member data
     * @param {object} groupData - Group data
     * @param {object} userData - User data
     * @returns {object} Validation result
     */
    validateMemberJoin(memberData, groupData, userData) {
        const errors = [];

        // 1. GROUP STATE VALIDATION
        if (groupData.state !== 'ACTIVE') {
            errors.push(`Group is ${groupData.state.toLowerCase()}. Cannot join.`);
        }

        // 2. COUNTRY ISOLATION
        if (userData.country !== groupData.country) {
            errors.push('Cannot join group from different country');
        }

        // 3. GROUP CAPACITY
        if (groupData.memberCount >= this.rules.group.membership.maxMembers) {
            errors.push('Group is at maximum capacity (1000 members)');
        }

        // 4. BORROWER GROUP LIMIT
        if (userData.roles.includes('BORROWER')) {
            if (userData.groupIds.length >= this.rules.hierarchy.borrowers.maxGroups) {
                if (userData.rating < this.rules.borrower.borrowing.goodRatingThreshold) {
                    errors.push(`Maximum ${this.rules.hierarchy.borrowers.maxGroups} groups reached. Rating of ${this.rules.borrower.borrowing.goodRatingThreshold}+ required.`);
                }
            }
        }

        // 5. REFERRAL VALIDATION
        if (this.rules.group.membership.referralRequired && !memberData.referrerId) {
            errors.push('Referral from existing member required');
        }

        // 6. BLACKLIST VALIDATION
        if (userData.blacklisted) {
            errors.push('Blacklisted users cannot join new groups');
        }

        // 7. RATING VALIDATION FOR BORROWERS
        if (userData.roles.includes('BORROWER') && userData.rating < 3.0) {
            warnings.push('Low rating may affect borrowing eligibility');
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }

    /**
     * Validate loan request against all rules
     * @param {object} loanData - Loan data
     * @param {object} borrowerData - Borrower data
     * @param {object} lenderData - Lender data
     * @param {object} groupData - Group data
     * @returns {object} Validation result
     */
    validateLoanRequest(loanData, borrowerData, lenderData, groupData) {
        const errors = [];
        const warnings = [];

        // 1. GROUP STATE VALIDATION
        if (groupData.state !== 'ACTIVE') {
            errors.push(`Group is ${groupData.state.toLowerCase()}. Cannot process loans.`);
        }

        // 2. BORROWER ELIGIBILITY
        if (borrowerData.blacklisted) {
            errors.push('Borrower is blacklisted');
        }

        if (borrowerData.rating < 3.0) {
            errors.push('Borrower rating too low (minimum 3.0)');
        }

        // 3. LENDER ELIGIBILITY
        if (!lenderData.subscriptionActive) {
            errors.push('Lender subscription inactive');
        }

        if (this.isSubscriptionExpired(lenderData.subscriptionExpiry)) {
            errors.push('Lender subscription expired');
        }

        // 4. LOAN AMOUNT VALIDATION
        const tierLimit = this.rules.lending.limits.perLoan[lenderData.subscriptionTier];
        if (loanData.amount > tierLimit) {
            errors.push(`Loan amount exceeds ${lenderData.subscriptionTier} tier limit of ${tierLimit}`);
        }

        // 5. ACTIVE LOANS VALIDATION
        if (borrowerData.activeLoansInGroup >= this.rules.loan.terms.maxActiveLoansPerGroup) {
            errors.push('Borrower has active loan in this group');
        }

        // 6. CATEGORY VALIDATION
        if (!this.rules.categories.includes(loanData.category)) {
            warnings.push('Category not in standard emergency categories');
        }

        // 7. LENDER CATEGORY PREFERENCE
        if (!lenderData.categories.includes('ALL') && !lenderData.categories.includes(loanData.category)) {
            errors.push('Lender does not support this loan category');
        }

        // 8. REPAYMENT VALIDATION
        if (loanData.duration > 7) {
            errors.push('Maximum loan duration is 7 days');
        }

        // 9. INTEREST VALIDATION
        const expectedInterest = loanData.amount * 0.10;
        if (Math.abs(loanData.interest - expectedInterest) > 1) {
            warnings.push('Interest should be 10% of principal');
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            code: errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }

    /**
     * Check if subscription is expired (28th rule)
     * @param {string} expiryDate - Subscription expiry date
     * @returns {boolean} True if expired
     */
    isSubscriptionExpired(expiryDate) {
        if (!expiryDate) return true;
        
        const today = new Date();
        const expiry = new Date(expiryDate);
        
        // Check if past expiry date
        if (today > expiry) return true;
        
        // Check 28th rule
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const cutoffDay = Math.min(28, lastDayOfMonth);
        
        const cutoffDate = new Date(currentYear, currentMonth, cutoffDay);
        
        return today > cutoffDate;
    }

    /**
     * Calculate loan details
     * @param {number} amount - Loan amount
     * @param {string} tier - Subscription tier
     * @param {string} currency - Currency code
     * @returns {object} Loan calculation
     */
    calculateLoanDetails(amount, tier, currency) {
        const tierLimit = this.rules.lending.limits.perLoan[tier];
        
        if (amount > tierLimit) {
            throw new Error(`Amount exceeds ${tier} limit of ${tierLimit}`);
        }

        const interest = amount * 0.10; // 10%
        const totalRepayable = amount + interest;
        const dailyRepayment = totalRepayable / 7;
        
        // Penalty calculation
        const dailyPenalty = amount * 0.05; // 5% daily after 7 days

        return {
            principal: amount,
            interest: interest,
            totalRepayable: totalRepayable,
            dailyRepayment: dailyRepayment,
            dueInDays: 7,
            penaltyAfter7Days: dailyPenalty,
            maxAllowed: tierLimit,
            currency: currency
        };
    }

    /**
     * Get currency information for country
     * @param {string} country - Country name
     * @returns {object} Currency info
     */
    getCurrencyInfo(country) {
        return this.currencyMap[country] || {
            code: 'USD',
            symbol: '$',
            name: 'US Dollar'
        };
    }

    /**
     * Validate phone number for country
     * @param {string} phone - Phone number
     * @param {string} country - Country name
     * @returns {boolean} True if valid
     */
    validatePhoneNumber(phone, country) {
        const patterns = this.rules.validation.phone;
        const countryKey = country.toLowerCase();
        
        if (patterns[countryKey]) {
            return patterns[countryKey].test(phone);
        }
        
        return patterns.default.test(phone);
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {object} Validation result
     */
    validatePassword(password) {
        const errors = [];
        
        if (password.length < this.rules.validation.password.min) {
            errors.push(`Minimum ${this.rules.validation.password.min} characters`);
        }
        
        if (password.length > this.rules.validation.password.max) {
            errors.push(`Maximum ${this.rules.validation.password.max} characters`);
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push('At least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('At least one lowercase letter');
        }
        
        if (!/\d/.test(password)) {
            errors.push('At least one number');
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('At least one special character');
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            strength: this.calculatePasswordStrength(password)
        };
    }

    /**
     * Calculate password strength
     * @param {string} password - Password
     * @returns {string} Strength level
     */
    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        
        if (score >= 5) return 'STRONG';
        if (score >= 3) return 'MEDIUM';
        return 'WEAK';
    }

    /**
     * Get rule by path
     * @param {string} path - Rule path (e.g., 'hierarchy.countries.isolation')
     * @returns {any} Rule value
     */
    getRule(path) {
        const parts = path.split('.');
        let current = this.rules;
        
        for (const part of parts) {
            if (current[part] === undefined) {
                return null;
            }
            current = current[part];
        }
        
        return current;
    }

    /**
     * Get all rules as JSON
     * @returns {string} JSON string of rules
     */
    toJSON() {
        return JSON.stringify(this.rules, null, 2);
    }

    /**
     * Export rules for policy DSL
     * @returns {object} Policy rules
     */
    exportPolicyRules() {
        return {
            hierarchy: this.rules.hierarchy,
            country: this.rules.country,
            group: this.rules.group,
            lender: this.rules.lender,
            borrower: this.rules.borrower,
            loan: this.rules.loan,
            ledger: this.rules.ledger,
            subscription: this.rules.subscription,
            reputation: this.rules.reputation
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroupRules;
}