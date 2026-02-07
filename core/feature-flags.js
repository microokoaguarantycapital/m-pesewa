/**
 * M-PESEWA FEATURE FLAGS SYSTEM
 * Strictly enforces country isolation and role-based access
 * Last Updated: 2024
 */

class MpesewaFeatureFlags {
    constructor() {
        this.flags = {
            // Core Platform Features (Non-Negotiable)
            STRICT_COUNTRY_ISOLATION: true,
            GROUP_BASED_LENDING: true,
            SUBSCRIPTION_ENFORCEMENT: true,
            BLACKLIST_SYSTEM: true,
            LEDGER_SYSTEM: true,
            REFERRAL_ONLY_REGISTRATION: true,
            
            // Country-Specific Features
            COUNTRIES: {
                KE: { // Kenya
                    CURRENCY: 'KSh',
                    MIN_LOAN: 50,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'KE',
                    LOCAL_LAWS: 'Kenya Financial Laws'
                },
                UG: { // Uganda
                    CURRENCY: 'UGX',
                    MIN_LOAN: 2000,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'UG',
                    LOCAL_LAWS: 'Uganda Financial Laws'
                },
                TZ: { // Tanzania
                    CURRENCY: 'TZS',
                    MIN_LOAN: 1000,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'TZ',
                    LOCAL_LAWS: 'Tanzania Financial Laws'
                },
                RW: { // Rwanda
                    CURRENCY: 'RWF',
                    MIN_LOAN: 500,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'RW',
                    LOCAL_LAWS: 'Rwanda Financial Laws'
                },
                CD: { // DRC
                    CURRENCY: 'CDF',
                    MIN_LOAN: 1000,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'CD',
                    LOCAL_LAWS: 'DRC Financial Laws'
                },
                BI: { // Burundi
                    CURRENCY: 'BIF',
                    MIN_LOAN: 1000,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'BI',
                    LOCAL_LAWS: 'Burundi Financial Laws'
                },
                NG: { // Nigeria
                    CURRENCY: 'NGN',
                    MIN_LOAN: 100,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'NG',
                    LOCAL_LAWS: 'Nigeria Financial Laws'
                },
                GH: { // Ghana
                    CURRENCY: 'GHS',
                    MIN_LOAN: 1,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'GH',
                    LOCAL_LAWS: 'Ghana Financial Laws'
                },
                SS: { // South Sudan
                    CURRENCY: 'SSP',
                    MIN_LOAN: 100,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'SS',
                    LOCAL_LAWS: 'South Sudan Financial Laws'
                },
                SO: { // Somalia
                    CURRENCY: 'SOS',
                    MIN_LOAN: 1000,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'SO',
                    LOCAL_LAWS: 'Somalia Financial Laws'
                },
                ZA: { // South Africa
                    CURRENCY: 'ZAR',
                    MIN_LOAN: 10,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'ZA',
                    LOCAL_LAWS: 'South Africa Financial Laws'
                },
                ET: { // Ethiopia
                    CURRENCY: 'ETB',
                    MIN_LOAN: 10,
                    MAX_GROUPS_PER_USER: 4,
                    SUPPORTED: true,
                    COUNTRY_CODE: 'ET',
                    LOCAL_LAWS: 'Ethiopia Financial Laws'
                }
            },
            
            // Subscription Tiers (Lenders Only)
            SUBSCRIPTION_TIERS: {
                BASIC: {
                    MAX_WEEKLY: 1500,
                    MONTHLY_FEE: 50,
                    BI_ANNUAL_FEE: 250,
                    ANNUAL_FEE: 500,
                    CRB_CHECK: false,
                    MAX_LEDGERS: 1500
                },
                PREMIUM: {
                    MAX_WEEKLY: 5000,
                    MONTHLY_FEE: 250,
                    BI_ANNUAL_FEE: 1500,
                    ANNUAL_FEE: 2500,
                    CRB_CHECK: false,
                    MAX_LEDGERS: 10000
                },
                SUPER: {
                    MAX_WEEKLY: 20000,
                    MONTHLY_FEE: 1000,
                    BI_ANNUAL_FEE: 5000,
                    ANNUAL_FEE: 8500,
                    CRB_CHECK: true,
                    MAX_LEDGERS: 20000
                },
                LENDER_OF_LENDERS: {
                    MAX_WEEKLY: 50000,
                    MONTHLY_FEE: 500,
                    BI_ANNUAL_FEE: 3500,
                    ANNUAL_FEE: 6500,
                    CRB_CHECK: true,
                    MIN_REPAYMENT_PERIOD: 30 // days
                }
            },
            
            // Loan Rules (STRICT)
            LOAN_RULES: {
                MAX_REPAYMENT_PERIOD: 7, // days
                INTEREST_RATE: 0.10, // 10%
                DAILY_PENALTY_AFTER_7_DAYS: 0.05, // 5%
                DEFAULT_AFTER_DAYS: 60, // 2 months
                PARTIAL_REPAYMENTS_ALLOWED: true,
                ONE_ACTIVE_LOAN_PER_GROUP: true
            },
            
            // Group Rules
            GROUP_RULES: {
                MIN_MEMBERS: 5,
                MAX_MEMBERS: 1000,
                MAX_GROUPS_PER_USER: 4,
                COUNTRY_LOCKED: true,
                INVITATION_ONLY: true,
                REFERRAL_REQUIRED: true
            },
            
            // User Role Rules
            USER_ROLES: {
                BORROWER: {
                    SUBSCRIPTION_REQUIRED: false,
                    MAX_GROUPS: 4,
                    DUAL_ROLE_ALLOWED: true
                },
                LENDER: {
                    SUBSCRIPTION_REQUIRED: true,
                    SUBSCRIPTION_EXPIRY_DAY: 28, // 28th of each month
                    MAX_LEDGERS: 'unlimited',
                    GROUP_RESTRICTED: true
                },
                GROUP_ADMIN: {
                    CAN_INVITE: true,
                    CAN_MODERATE: true,
                    CAN_OVERRIDE: false
                },
                PLATFORM_ADMIN: {
                    CAN_OVERRIDE_BLACKLIST: true,
                    CAN_EDIT_LEDGERS: true,
                    CAN_VALIDATE_COLLECTORS: true
                }
            },
            
            // Emergency Categories (20 Categories)
            EMERGENCY_CATEGORIES: [
                { id: 'fare', name: 'M-pesewa Fare', icon: '🚌', description: 'Move on, don\'t stall—borrow for your journey.' },
                { id: 'data', name: 'M-pesewa Data', icon: '📶', description: 'Stay connected, stay informed—borrow when your bundle runs out.' },
                { id: 'gas', name: 'M-pesewa Cooking Gas', icon: '🔥', description: 'Cook with confidence—borrow when your gas is low.' },
                { id: 'food', name: 'M-pesewa Food', icon: '🍲', description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.' },
                { id: 'wifi', name: 'M-pesewa Wifi', icon: '📡', description: 'Stay connected at home.' },
                { id: 'water', name: 'M-pesewa Water Bill', icon: '🚰', description: 'Stay hydrated—borrow for water needs or bills.' },
                { id: 'electricity', name: 'M-pesewa Electricity Tokens', icon: '⚡', description: 'Stay lit, stay powered—borrow tokens when you need it.' },
                { id: 'tv', name: 'M-pesewa TV Subscription', icon: '📺', description: 'Never miss your favorite shows.' },
                { id: 'fuel', name: 'M-pesewa Fuel', icon: '⛽', description: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk).' },
                { id: 'repair', name: 'M-pesewa Repair', icon: '🔧', description: 'Fix it quick—borrow for minor repairs and keep going.' },
                { id: 'credo', name: 'M-pesewa Credo', icon: '🛠️', description: 'Fix it fast—borrow for urgent repairs or tools.' },
                { id: 'sales', name: 'M-Pesa Daily Sales Advance', icon: '🧾', description: 'Small Loan advance for everyday business.' },
                { id: 'capital', name: 'M-Pesa Working Capital Advance', icon: '🏪', description: 'Working capital when your business needs it.' },
                { id: 'soko', name: 'M-Pesewa Soko Loan', icon: '🛒', description: 'Market money when you need it.' },
                { id: 'kidandaski', name: 'M-Pesewa Kidandaski Loan', icon: '🏗️', description: 'Kibanda/stall money when you need it.' },
                { id: 'hawker', name: 'M-Pesewa Hawker Loan', icon: '🚶‍♂️', description: 'Be Street smart, cash flow all time.' },
                { id: 'fuliziwa', name: 'M-fuliziwa Loan', icon: '🔄', description: 'Your fuliza is not enough? Top up here.' },
                { id: 'medicine', name: 'M-pesewa Medicine', icon: '💊', description: 'Health first—borrow for urgent medicines.' },
                { id: 'school', name: 'M-pesewa School Fees', icon: '🎓', description: 'Secure your future without delay.' },
                { id: 'advance', name: 'M-pesewa Advance', icon: '💸', description: 'Quick cash when you need it most.' }
            ],
            
            // Debt Collectors
            DEBT_COLLECTORS: {
                ENABLED: true,
                VETTED_COUNT: 200,
                PLATFORM_MANAGED: false
            },
            
            // Blacklist System
            BLACKLIST: {
                ENABLED: true,
                DEFAULT_AFTER_DAYS: 60,
                VISIBLE_PLATFORM_WIDE: true,
                REMOVAL_BY_ADMIN_ONLY: true,
                REQUIRE_FULL_REPAYMENT: true
            },
            
            // Rating System
            RATING_SYSTEM: {
                ENABLED: true,
                SCALE: 5, // 5-star system
                LENDER_CAN_RATE: true,
                AFFECTS_GROUP_ACCESS: true
            },
            
            // Payment Methods (Off-platform)
            PAYMENT_METHODS: [
                'M-PESA',
                'AIRTEL MONEY',
                'TIGO PESA',
                'VODACOM M-PESA',
                'MTN MOBILE MONEY',
                'ORANGE MONEY',
                'BANK TRANSFER',
                'CASH'
            ]
        };
    }

    // Getters for strict hierarchy enforcement
    getCountryConfig(countryCode) {
        const country = this.flags.COUNTRIES[countryCode.toUpperCase()];
        if (!country) {
            throw new Error(`Country ${countryCode} is not supported by M-Pesewa`);
        }
        return country;
    }

    getSubscriptionTier(tierName) {
        const tier = this.flags.SUBSCRIPTION_TIERS[tierName.toUpperCase()];
        if (!tier) {
            throw new Error(`Subscription tier ${tierName} does not exist`);
        }
        return tier;
    }

    getLoanRules() {
        return this.flags.LOAN_RULES;
    }

    getGroupRules() {
        return this.flags.GROUP_RULES;
    }

    getUserRoleRules(role) {
        return this.flags.USER_ROLES[role.toUpperCase()];
    }

    getEmergencyCategories() {
        return this.flags.EMERGENCY_CATEGORIES;
    }

    getEmergencyCategory(id) {
        return this.flags.EMERGENCY_CATEGORIES.find(cat => cat.id === id);
    }

    // Validation methods for strict rules
    validateCountryIsolation(userCountry, targetCountry) {
        if (!this.flags.STRICT_COUNTRY_ISOLATION) {
            return true;
        }
        return userCountry === targetCountry;
    }

    validateGroupMembership(currentMembers, isInvite = false) {
        const rules = this.flags.GROUP_RULES;
        
        if (currentMembers >= rules.MAX_MEMBERS) {
            return { valid: false, reason: `Group maximum capacity of ${rules.MAX_MEMBERS} reached` };
        }
        
        if (isInvite && !rules.INVITATION_ONLY) {
            return { valid: false, reason: 'Group is invitation only' };
        }
        
        return { valid: true };
    }

    validateLoanRequest(amount, userTier, countryCode) {
        const country = this.getCountryConfig(countryCode);
        const tier = this.getSubscriptionTier(userTier);
        
        if (amount < country.MIN_LOAN) {
            return { valid: false, reason: `Minimum loan amount is ${country.MIN_LOAN} ${country.CURRENCY}` };
        }
        
        if (amount > tier.MAX_WEEKLY) {
            return { valid: false, reason: `Maximum weekly loan for ${userTier} tier is ${tier.MAX_WEEKLY} ${country.CURRENCY}` };
        }
        
        return { valid: true };
    }

    validateUserCanJoinMoreGroups(currentGroups, userRating) {
        const rules = this.flags.GROUP_RULES;
        
        if (currentGroups >= rules.MAX_GROUPS_PER_USER) {
            return { valid: false, reason: `Maximum of ${rules.MAX_GROUPS_PER_USER} groups per user reached` };
        }
        
        // Only allow joining more than 2 groups with good rating
        if (currentGroups >= 2 && userRating < 4) {
            return { valid: false, reason: 'Good rating (4+ stars) required to join more than 2 groups' };
        }
        
        return { valid: true };
    }

    calculateLoanDetails(amount, days = 7) {
        const rules = this.flags.LOAN_RULES;
        
        if (days > rules.MAX_REPAYMENT_PERIOD) {
            throw new Error(`Maximum repayment period is ${rules.MAX_REPAYMENT_PERIOD} days`);
        }
        
        const interest = amount * rules.INTEREST_RATE;
        const totalRepayable = amount + interest;
        const dailyRepayment = totalRepayable / days;
        
        return {
            principal: amount,
            interest: interest,
            total: totalRepayable,
            dailyRepayment: dailyRepayment,
            dueDate: this.calculateDueDate(days)
        };
    }

    calculateDueDate(days = 7) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);
        return dueDate;
    }

    calculatePenalty(outstandingBalance, daysOverdue) {
        const rules = this.flags.LOAN_RULES;
        
        if (daysOverdue <= 7) {
            return 0;
        }
        
        const penaltyDays = daysOverdue - 7;
        const dailyPenalty = outstandingBalance * rules.DAILY_PENALTY_AFTER_7_DAYS;
        return dailyPenalty * penaltyDays;
    }

    // Subscription expiry check
    isSubscriptionActive(subscriptionEndDate) {
        if (!subscriptionEndDate) return false;
        
        const today = new Date();
        const expiryDate = new Date(subscriptionEndDate);
        
        // Subscription expires on 28th of each month
        const subscriptionDay = expiryDate.getDate();
        if (subscriptionDay !== 28) {
            // Adjust to 28th if not already
            expiryDate.setDate(28);
        }
        
        return today <= expiryDate;
    }

    getDaysUntilSubscriptionExpiry(subscriptionEndDate) {
        const today = new Date();
        const expiryDate = new Date(subscriptionEndDate);
        
        // Set to 28th of current month if not already
        if (expiryDate.getDate() !== 28) {
            expiryDate.setDate(28);
            // If 28th has passed this month, set to next month
            if (expiryDate < today) {
                expiryDate.setMonth(expiryDate.getMonth() + 1);
            }
        }
        
        const diffTime = expiryDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Blacklist validation
    shouldBlacklist(daysOverdue, amountOwed) {
        const rules = this.flags.BLACKLIST;
        const loanRules = this.flags.LOAN_RULES;
        
        if (daysOverdue >= loanRules.DEFAULT_AFTER_DAYS && amountOwed > 0) {
            return {
                shouldBlacklist: true,
                reason: `Defaulted after ${daysOverdue} days with ${amountOwed} outstanding`
            };
        }
        
        return { shouldBlacklist: false };
    }

    // Get all supported countries
    getSupportedCountries() {
        return Object.keys(this.flags.COUNTRIES)
            .filter(code => this.flags.COUNTRIES[code].SUPPORTED)
            .map(code => ({
                code: code,
                name: this.getCountryName(code),
                currency: this.flags.COUNTRIES[code].CURRENCY,
                flag: this.getCountryFlag(code)
            }));
    }

    getCountryName(countryCode) {
        const countryNames = {
            KE: 'Kenya',
            UG: 'Uganda',
            TZ: 'Tanzania',
            RW: 'Rwanda',
            CD: 'DRC',
            BI: 'Burundi',
            NG: 'Nigeria',
            GH: 'Ghana',
            SS: 'South Sudan',
            SO: 'Somalia',
            ZA: 'South Africa',
            ET: 'Ethiopia'
        };
        
        return countryNames[countryCode.toUpperCase()] || countryCode;
    }

    getCountryFlag(countryCode) {
        const countryFlags = {
            KE: '🇰🇪',
            UG: '🇺🇬',
            TZ: '🇹🇿',
            RW: '🇷🇼',
            CD: '🇨🇩',
            BI: '🇧🇮',
            NG: '🇳🇬',
            GH: '🇬🇭',
            SS: '🇸🇸',
            SO: '🇸🇴',
            ZA: '🇿🇦',
            ET: '🇪🇹'
        };
        
        return countryFlags[countryCode.toUpperCase()] || '🏳️';
    }

    // Check if feature is enabled
    isEnabled(feature) {
        return this.flags[feature] !== undefined ? this.flags[feature] : false;
    }

    // Update feature flag (Admin only)
    updateFeatureFlag(feature, value) {
        if (this.flags[feature] !== undefined) {
            this.flags[feature] = value;
            this.persistFlags();
            return true;
        }
        return false;
    }

    // Persist flags to localStorage
    persistFlags() {
        try {
            localStorage.setItem('mpesewa_feature_flags', JSON.stringify(this.flags));
        } catch (error) {
            console.error('Failed to persist feature flags:', error);
        }
    }

    // Load flags from localStorage
    loadFlags() {
        try {
            const savedFlags = localStorage.getItem('mpesewa_feature_flags');
            if (savedFlags) {
                this.flags = JSON.parse(savedFlags);
            }
        } catch (error) {
            console.error('Failed to load feature flags:', error);
        }
    }

    // Reset to defaults
    resetToDefaults() {
        this.flags = new MpesewaFeatureFlags().flags;
        this.persistFlags();
    }
}

// Singleton instance
let featureFlagsInstance = null;

export function getFeatureFlags() {
    if (!featureFlagsInstance) {
        featureFlagsInstance = new MpesewaFeatureFlags();
        featureFlagsInstance.loadFlags();
    }
    return featureFlagsInstance;
}

export default getFeatureFlags();