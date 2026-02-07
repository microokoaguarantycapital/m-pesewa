/**
 * M-PESEWA SERVICE REGISTRY
 * Central registry for all services, components, and country configurations
 * Enforces strict hierarchy and dependency management
 */

class MpesewaRegistry {
    constructor() {
        this.services = new Map();
        this.components = new Map();
        this.countries = new Map();
        this.groups = new Map();
        this.lenders = new Map();
        this.borrowers = new Map();
        this.ledgers = new Map();
        this.subscriptions = new Map();
        this.blacklist = new Map();
        this.validators = new Map();
        this.initializeDefaultRegistries();
    }

    // Initialize with strict hierarchy
    initializeDefaultRegistries() {
        // Register 12 Sub-Saharan African countries
        this.registerCountries();
        
        // Register subscription tiers
        this.registerSubscriptionTiers();
        
        // Register emergency categories (20 categories)
        this.registerEmergencyCategories();
        
        // Register validators
        this.registerValidators();
        
        // Register debt collectors (200+)
        this.registerDebtCollectors();
    }

    // STRICT: Register all 12 countries with their configurations
    registerCountries() {
        const countries = [
            {
                code: 'KE',
                name: 'Kenya',
                currency: 'KSh',
                symbol: 'KSh',
                flag: '🇰🇪',
                contact: '+254 709 219 000',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Nairobi',
                locale: 'en-KE',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'UG',
                name: 'Uganda',
                currency: 'UGX',
                symbol: 'USh',
                flag: '🇺🇬',
                contact: '+256 392 175 546',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Kampala',
                locale: 'en-UG',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'TZ',
                name: 'Tanzania',
                currency: 'TZS',
                symbol: 'TSh',
                flag: '🇹🇿',
                contact: '+255 659 073 010',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Dar_es_Salaam',
                locale: 'sw-TZ',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'RW',
                name: 'Rwanda',
                currency: 'RWF',
                symbol: 'RF',
                flag: '🇷🇼',
                contact: '+250 791 590 801',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Kigali',
                locale: 'rw-RW',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'CD',
                name: 'DR Congo',
                currency: 'CDF',
                symbol: 'FC',
                flag: '🇨🇩',
                contact: '+243 81 000 0000',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Kinshasa',
                locale: 'fr-CD',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'BI',
                name: 'Burundi',
                currency: 'BIF',
                symbol: 'FBu',
                flag: '🇧🇮',
                contact: '+257 79 000 000',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Bujumbura',
                locale: 'fr-BI',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'NG',
                name: 'Nigeria',
                currency: 'NGN',
                symbol: '₦',
                flag: '🇳🇬',
                contact: '+234 800 000 0000',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Lagos',
                locale: 'en-NG',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'GH',
                name: 'Ghana',
                currency: 'GHS',
                symbol: 'GH₵',
                flag: '🇬🇭',
                contact: '+233 24 000 0000',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Accra',
                locale: 'en-GH',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'SS',
                name: 'South Sudan',
                currency: 'SSP',
                symbol: 'SS£',
                flag: '🇸🇸',
                contact: '+211 955 000 000',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Juba',
                locale: 'en-SS',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'SO',
                name: 'Somalia',
                currency: 'SOS',
                symbol: 'Sh.So.',
                flag: '🇸🇴',
                contact: '+252 63 0000000',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Mogadishu',
                locale: 'so-SO',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'ZA',
                name: 'South Africa',
                currency: 'ZAR',
                symbol: 'R',
                flag: '🇿🇦',
                contact: '+27 11 000 0000',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Johannesburg',
                locale: 'en-ZA',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            },
            {
                code: 'ET',
                name: 'Ethiopia',
                currency: 'ETB',
                symbol: 'Br',
                flag: '🇪🇹',
                contact: '+251 11 000 0000',
                email: 'info@mpesewa.com',
                timezone: 'Africa/Addis_Ababa',
                locale: 'am-ET',
                rules: {
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    interestRate: 0.10,
                    penaltyRate: 0.05,
                    repaymentDays: 7,
                    defaultDays: 60
                }
            }
        ];

        countries.forEach(country => {
            this.countries.set(country.code, country);
        });
    }

    // STRICT: Register subscription tiers with exact pricing
    registerSubscriptionTiers() {
        const tiers = [
            {
                code: 'basic',
                name: 'Basic Tier',
                limits: {
                    weekly: 1500,
                    ledgers: 1500
                },
                pricing: {
                    monthly: 50,
                    biAnnual: 250,
                    annual: 500
                },
                features: [
                    'Max: ≤ 1,500 local currency per week',
                    'No CRB check required',
                    'Ledgers cannot exceed 1,500',
                    'Subscription expires 28th each month'
                ],
                requirements: []
            },
            {
                code: 'premium',
                name: 'Premium Tier',
                limits: {
                    weekly: 5000,
                    ledgers: 10000
                },
                pricing: {
                    monthly: 250,
                    biAnnual: 1500,
                    annual: 2500
                },
                features: [
                    'Max: ≤ 5,000 per week',
                    'No CRB check required',
                    'Ledgers cannot exceed 10,000',
                    'Higher lending capacity'
                ],
                requirements: []
            },
            {
                code: 'super',
                name: 'Super Tier',
                limits: {
                    weekly: 20000,
                    ledgers: 20000
                },
                pricing: {
                    monthly: 1000,
                    biAnnual: 5000,
                    annual: 8500
                },
                features: [
                    'Max: ≤ 20,000 per week',
                    'CRB check required',
                    'Ledgers cannot exceed 20,000',
                    'Premium support'
                ],
                requirements: ['CRB check']
            },
            {
                code: 'lender-of-lenders',
                name: 'Lender of Lenders',
                limits: {
                    weekly: 50000,
                    ledgers: 50000
                },
                pricing: {
                    monthly: 500,
                    biAnnual: 3500,
                    annual: 6500
                },
                features: [
                    'Max: ≤ 50,000',
                    'CRB required',
                    'Custom interest rates',
                    'Minimum repayment: 1 month'
                ],
                requirements: ['CRB check', 'Verification']
            }
        ];

        tiers.forEach(tier => {
            this.subscriptions.set(tier.code, tier);
        });
    }

    // STRICT: Register all 20 emergency categories
    registerEmergencyCategories() {
        const categories = [
            { code: 'fare', name: 'M-pesewa Fare', icon: '🚌', description: 'Move on, don\'t stall—borrow for your journey.' },
            { code: 'data', name: 'M-pesewa Data', icon: '📶', description: 'Stay connected, stay informed—borrow when your bundle runs out.' },
            { code: 'gas', name: 'M-pesewa Cooking Gas', icon: '🔥', description: 'Cook with confidence—borrow when your gas is low.' },
            { code: 'food', name: 'M-pesewa Food', icon: '🍲', description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.' },
            { code: 'wifi', name: 'M-pesewa Wifi', icon: '📡', description: 'Stay connected at home.' },
            { code: 'water', name: 'M-pesewa Water Bill', icon: '🚰', description: 'Stay hydrated—borrow for water needs or bills.' },
            { code: 'electricity', name: 'M-pesewa Electricity Tokens', icon: '⚡', description: 'Stay lit, stay powered—borrow tokens when you need it.' },
            { code: 'tv', name: 'M-pesewa TV Subscription', icon: '📺', description: 'Never miss your favorite shows.' },
            { code: 'fuel', name: 'M-pesewa Fuel', icon: '⛽', description: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk).' },
            { code: 'repair', name: 'M-pesewa Repair', icon: '🔧', description: 'Fix it quick—borrow for minor repairs and keep going.' },
            { code: 'credo', name: 'M-pesewa Credo', icon: '🛠️', description: 'Fix it fast—borrow for urgent repairs or tools.' },
            { code: 'sales', name: 'M-Pesa Daily Sales Advance', icon: '🧾', description: 'Small Loan advance for everyday business.' },
            { code: 'capital', name: 'M-Pesa Working Capital Advance', icon: '🏪', description: 'Working capital when your business needs it.' },
            { code: 'soko', name: 'M-Pesewa Soko Loan', icon: '🛒', description: 'Market money when you need it.' },
            { code: 'kidandaski', name: 'M-Pesewa Kidandaski Loan', icon: '🏗️', description: 'Kibanda/stall money when you need it.' },
            { code: 'hawker', name: 'M-Pesewa Hawker Loan', icon: '🚶‍♂️', description: 'Be Street smart, cash flow all time.' },
            { code: 'fuliziwa', name: 'M-fuliziwa Loan', icon: '🔄', description: 'Your fuliza is not enough? Top up here.' },
            { code: 'medicine', name: 'M-pesewa Medicine', icon: '💊', description: 'Health first—borrow for urgent medicines.' },
            { code: 'school', name: 'M-pesewa School Fees', icon: '🎓', description: 'Secure your future without delay.' },
            { code: 'advance', name: 'M-pesewa Advance', icon: '💸', description: 'Quick cash when you need it most.' }
        ];

        categories.forEach(category => {
            this.services.set(`category:${category.code}`, category);
        });
    }

    // STRICT: Register all validators
    registerValidators() {
        const validators = {
            // Country validators
            'country:exists': this.validateCountryExists.bind(this),
            'country:isolation': this.validateCountryIsolation.bind(this),
            
            // Group validators
            'group:capacity': this.validateGroupCapacity.bind(this),
            'group:membership': this.validateGroupMembership.bind(this),
            'group:invitation': this.validateGroupInvitation.bind(this),
            
            // Lender validators
            'lender:subscription': this.validateLenderSubscription.bind(this),
            'lender:tier-limit': this.validateLenderTierLimit.bind(this),
            'lender:categories': this.validateLenderCategories.bind(this),
            
            // Borrower validators
            'borrower:rating': this.validateBorrowerRating.bind(this),
            'borrower:blacklist': this.validateBorrowerBlacklist.bind(this),
            'borrower:group-limit': this.validateBorrowerGroupLimit.bind(this),
            'borrower:referrers': this.validateBorrowerReferrers.bind(this),
            
            // Loan validators
            'loan:amount': this.validateLoanAmount.bind(this),
            'loan:duration': this.validateLoanDuration.bind(this),
            'loan:category': this.validateLoanCategory.bind(this),
            'loan:active-per-group': this.validateActiveLoansPerGroup.bind(this),
            
            // Ledger validators
            'ledger:fields': this.validateLedgerFields.bind(this),
            'ledger:status': this.validateLedgerStatus.bind(this),
            
            // Repayment validators
            'repayment:partial': this.validatePartialRepayment.bind(this),
            'repayment:penalty': this.validatePenaltyCalculation.bind(this),
            
            // Subscription validators
            'subscription:expiry': this.validateSubscriptionExpiry.bind(this),
            'subscription:payment': this.validateSubscriptionPayment.bind(this)
        };

        Object.entries(validators).forEach(([key, validator]) => {
            this.validators.set(key, validator);
        });
    }

    // Register 200+ debt collectors
    registerDebtCollectors() {
        // Sample debt collectors - in production this would be a database
        const collectors = [
            { id: 'dc001', name: 'Alpha Recovery Agency', country: 'KE', contact: '+254 700 111 111', email: 'alpha@recovery.com', rating: 4.5 },
            { id: 'dc002', name: 'Beta Debt Solutions', country: 'UG', contact: '+256 700 222 222', email: 'beta@debtsolutions.com', rating: 4.2 },
            { id: 'dc003', name: 'Gamma Collectors Ltd', country: 'TZ', contact: '+255 700 333 333', email: 'gamma@collectors.com', rating: 4.0 },
            // ... 197 more collectors
        ];

        collectors.forEach(collector => {
            this.services.set(`collector:${collector.id}`, collector);
        });
    }

    // Service registration methods
    registerService(name, service) {
        if (this.services.has(name)) {
            console.warn(`Service ${name} already registered. Overwriting.`);
        }
        this.services.set(name, service);
        return this;
    }

    getService(name) {
        if (!this.services.has(name)) {
            throw new Error(`Service ${name} not registered`);
        }
        return this.services.get(name);
    }

    hasService(name) {
        return this.services.has(name);
    }

    // Component registration
    registerComponent(name, component) {
        this.components.set(name, component);
        return this;
    }

    getComponent(name) {
        if (!this.components.has(name)) {
            throw new Error(`Component ${name} not registered`);
        }
        return this.components.get(name);
    }

    // Country methods
    getCountry(code) {
        if (!this.countries.has(code)) {
            throw new Error(`Country ${code} not registered`);
        }
        return this.countries.get(code);
    }

    getAllCountries() {
        return Array.from(this.countries.values());
    }

    getCountryByCurrency(currency) {
        return Array.from(this.countries.values()).find(c => c.currency === currency);
    }

    // Subscription methods
    getSubscriptionTier(code) {
        if (!this.subscriptions.has(code)) {
            throw new Error(`Subscription tier ${code} not registered`);
        }
        return this.subscriptions.get(code);
    }

    getAllSubscriptionTiers() {
        return Array.from(this.subscriptions.values());
    }

    // Group registration
    registerGroup(group) {
        // Validate group structure
        this.validateGroup(group);
        
        this.groups.set(group.id, {
            ...group,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            members: group.members || [],
            lenders: group.lenders || [],
            borrowers: group.borrowers || [],
            activeLoans: 0,
            totalLent: 0,
            repaymentRate: 100
        });
        
        return group.id;
    }

    getGroup(id) {
        if (!this.groups.has(id)) {
            throw new Error(`Group ${id} not found`);
        }
        return this.groups.get(id);
    }

    updateGroup(id, updates) {
        const group = this.getGroup(id);
        this.groups.set(id, {
            ...group,
            ...updates,
            updatedAt: new Date().toISOString()
        });
    }

    // Lender registration
    registerLender(lender) {
        // Validate lender structure
        this.validateLender(lender);
        
        this.lenders.set(lender.id, {
            ...lender,
            registeredAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            totalLent: 0,
            activeLedgers: 0,
            clearedLedgers: 0,
            outstandingAmount: 0,
            expectedInterest: 0,
            rating: 5.0,
            status: 'active'
        });
        
        return lender.id;
    }

    getLender(id) {
        if (!this.lenders.has(id)) {
            throw new Error(`Lender ${id} not found`);
        }
        return this.lenders.get(id);
    }

    // Borrower registration
    registerBorrower(borrower) {
        // Validate borrower structure
        this.validateBorrower(borrower);
        
        this.borrowers.set(borrower.id, {
            ...borrower,
            registeredAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            totalBorrowed: 0,
            activeLoans: 0,
            repaidLoans: 0,
            defaultedLoans: 0,
            rating: 5.0,
            blacklistStatus: null,
            status: 'active'
        });
        
        return borrower.id;
    }

    getBorrower(id) {
        if (!this.borrowers.has(id)) {
            throw new Error(`Borrower ${id} not found`);
        }
        return this.borrowers.get(id);
    }

    // Ledger registration
    registerLedger(ledger) {
        // Validate ledger structure
        this.validateLedger(ledger);
        
        this.ledgers.set(ledger.id, {
            ...ledger,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
            amountRepaid: 0,
            amountOverdue: 0,
            daysOverdue: 0,
            penaltyAccrued: 0
        });
        
        return ledger.id;
    }

    getLedger(id) {
        if (!this.ledgers.has(id)) {
            throw new Error(`Ledger ${id} not found`);
        }
        return this.ledgers.get(id);
    }

    // Blacklist management
    addToBlacklist(entry) {
        this.blacklist.set(entry.userId, {
            ...entry,
            blacklistedAt: new Date().toISOString(),
            status: 'active'
        });
        
        // Update borrower status
        const borrower = this.getBorrower(entry.userId);
        if (borrower) {
            borrower.blacklistStatus = 'active';
            borrower.status = 'blacklisted';
        }
    }

    removeFromBlacklist(userId) {
        if (!this.blacklist.has(userId)) {
            throw new Error(`User ${userId} not in blacklist`);
        }
        
        this.blacklist.delete(userId);
        
        // Update borrower status
        const borrower = this.getBorrower(userId);
        if (borrower) {
            borrower.blacklistStatus = null;
            borrower.status = 'active';
        }
    }

    isBlacklisted(userId) {
        return this.blacklist.has(userId);
    }

    // Validation methods
    validateCountryExists(countryCode) {
        if (!this.countries.has(countryCode)) {
            throw new Error(`Country ${countryCode} does not exist`);
        }
        return true;
    }

    validateCountryIsolation(userCountry, targetCountry) {
        if (userCountry !== targetCountry) {
            throw new Error(`Cross-country violation: ${userCountry} → ${targetCountry}`);
        }
        return true;
    }

    validateGroupCapacity(groupId) {
        const group = this.getGroup(groupId);
        if (group.members.length >= 1000) {
            throw new Error(`Group ${groupId} has reached maximum capacity of 1000 members`);
        }
        return true;
    }

    validateGroupMembership(userId, groupId) {
        const group = this.getGroup(groupId);
        if (!group.members.includes(userId)) {
            throw new Error(`User ${userId} is not a member of group ${groupId}`);
        }
        return true;
    }

    validateGroupInvitation(inviterId, inviteeId, groupId) {
        // Inviter must be in the group
        this.validateGroupMembership(inviterId, groupId);
        
        // Invitee cannot already be in 4 groups
        const userGroups = this.getUserGroups(inviteeId);
        if (userGroups.length >= 4) {
            throw new Error(`Invitee ${inviteeId} is already in 4 groups (maximum allowed)`);
        }
        
        return true;
    }

    validateLenderSubscription(lenderId) {
        const lender = this.getLender(lenderId);
        if (!lender.subscription || lender.subscription.status !== 'active') {
            throw new Error(`Lender ${lenderId} does not have active subscription`);
        }
        
        // Check expiry (28th of each month)
        const expiryDate = new Date(lender.subscription.expiryDate);
        const today = new Date();
        
        // Force check for 28th expiry
        if (today.getDate() > 28 || today > expiryDate) {
            throw new Error(`Lender subscription expired on the 28th. Please renew.`);
        }
        
        return true;
    }

    validateLenderTierLimit(lenderId, amount) {
        const lender = this.getLender(lenderId);
        const tier = this.getSubscriptionTier(lender.subscription.tier);
        
        if (amount > tier.limits.weekly) {
            throw new Error(`Amount ${amount} exceeds ${tier.name} weekly limit of ${tier.limits.weekly}`);
        }
        
        return true;
    }

    validateLenderCategories(lenderId, category) {
        const lender = this.getLender(lenderId);
        if (!lender.lendingCategories.includes('all') && 
            !lender.lendingCategories.includes(category)) {
            throw new Error(`Lender ${lenderId} does not lend in category ${category}`);
        }
        return true;
    }

    validateBorrowerRating(borrowerId) {
        const borrower = this.getBorrower(borrowerId);
        
        // Check if trying to join 4th group
        const userGroups = this.getUserGroups(borrowerId);
        if (userGroups.length >= 3 && borrower.rating < 4.0) {
            throw new Error(`Borrower needs rating ≥4.0 to join 4th group. Current: ${borrower.rating}`);
        }
        
        return true;
    }

    validateBorrowerBlacklist(borrowerId) {
        if (this.isBlacklisted(borrowerId)) {
            throw new Error(`Borrower ${borrowerId} is blacklisted and cannot borrow`);
        }
        return true;
    }

    validateBorrowerGroupLimit(borrowerId) {
        const userGroups = this.getUserGroups(borrowerId);
        if (userGroups.length >= 4) {
            throw new Error(`Borrower ${borrowerId} is already in 4 groups (maximum)`);
        }
        return true;
    }

    validateBorrowerReferrers(borrowerId, referrers) {
        if (!referrers || referrers.length < 2) {
            throw new Error('Borrower must provide 2 referrers/guarantors');
        }
        
        // Referrers must be in same country
        const borrower = this.getBorrower(borrowerId);
        referrers.forEach(referrer => {
            const referrerUser = this.getBorrower(referrer.id) || this.getLender(referrer.id);
            if (referrerUser.country !== borrower.country) {
                throw new Error(`Referrer ${referrer.id} is from different country`);
            }
        });
        
        return true;
    }

    validateLoanAmount(amount, lenderId) {
        this.validateLenderTierLimit(lenderId, amount);
        
        // Minimum loan amount
        if (amount < 5) {
            throw new Error('Minimum loan amount is 5 units');
        }
        
        return true;
    }

    validateLoanDuration(duration) {
        if (duration > 7) {
            throw new Error('Maximum repayment period is 7 days');
        }
        return true;
    }

    validateLoanCategory(category) {
        const validCategories = Array.from(this.services.values())
            .filter(s => s.code && s.code.startsWith('category:'))
            .map(s => s.code.replace('category:', ''));
        
        if (!validCategories.includes(category)) {
            throw new Error(`Invalid loan category: ${category}`);
        }
        return true;
    }

    validateActiveLoansPerGroup(borrowerId, groupId) {
        const activeLoans = this.getBorrowerActiveLoans(borrowerId);
        const hasLoanInGroup = activeLoans.some(loan => loan.groupId === groupId);
        
        if (hasLoanInGroup) {
            throw new Error('Borrower can have only one active loan per group at a time');
        }
        return true;
    }

    validateLedgerFields(ledger) {
        const requiredFields = [
            'borrowerId', 'lenderId', 'groupId', 'amount', 
            'interestRate', 'dueDate', 'category'
        ];
        
        const missingFields = requiredFields.filter(field => !ledger[field]);
        if (missingFields.length > 0) {
            throw new Error(`Missing required ledger fields: ${missingFields.join(', ')}`);
        }
        
        // Must have 2 guarantors
        if (!ledger.guarantors || ledger.guarantors.length < 2) {
            throw new Error('Ledger must have 2 guarantors/referrers');
        }
        
        return true;
    }

    validateLedgerStatus(ledgerId, newStatus) {
        const ledger = this.getLedger(ledgerId);
        const validTransitions = {
            'active': ['cleared', 'defaulted'],
            'cleared': [],
            'defaulted': ['cleared']
        };
        
        if (!validTransitions[ledger.status].includes(newStatus)) {
            throw new Error(`Invalid status transition: ${ledger.status} → ${newStatus}`);
        }
        
        return true;
    }

    validatePartialRepayment(loanId, amount) {
        const loan = this.getLedger(loanId);
        const remaining = loan.amount - loan.amountRepaid;
        
        if (amount <= 0) {
            throw new Error('Repayment amount must be positive');
        }
        
        if (amount > remaining) {
            throw new Error(`Repayment amount ${amount} exceeds remaining balance ${remaining}`);
        }
        
        return true;
    }

    validatePenaltyCalculation(loanId) {
        const loan = this.getLedger(loanId);
        const dueDate = new Date(loan.dueDate);
        const today = new Date();
        
        if (today <= dueDate) {
            return 0; // No penalty if not overdue
        }
        
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        
        // 5% daily penalty after 7 days
        if (daysOverdue > 7) {
            const penaltyDays = daysOverdue - 7;
            const penaltyRate = 0.05; // 5%
            return loan.amount * penaltyRate * penaltyDays;
        }
        
        return 0;
    }

    validateSubscriptionExpiry(userId) {
        const user = this.getLender(userId) || this.getBorrower(userId);
        
        if (user.role === 'lender' && user.subscription) {
            const expiryDate = new Date(user.subscription.expiryDate);
            const today = new Date();
            
            // Check if expired on 28th
            if (today.getDate() > 28 || today > expiryDate) {
                throw new Error('Subscription expired on the 28th. Please renew.');
            }
        }
        
        return true;
    }

    validateSubscriptionPayment(subscriptionTier, paymentType) {
        const tier = this.getSubscriptionTier(subscriptionTier);
        const validPaymentTypes = ['monthly', 'biAnnual', 'annual'];
        
        if (!validPaymentTypes.includes(paymentType)) {
            throw new Error(`Invalid payment type: ${paymentType}`);
        }
        
        if (!tier.pricing[paymentType]) {
            throw new Error(`Payment type ${paymentType} not available for ${tier.name}`);
        }
        
        return tier.pricing[paymentType];
    }

    // Helper methods
    getUserGroups(userId) {
        const groups = [];
        this.groups.forEach((group, id) => {
            if (group.members.includes(userId)) {
                groups.push(id);
            }
        });
        return groups;
    }

    getBorrowerActiveLoans(borrowerId) {
        const activeLoans = [];
        this.ledgers.forEach((ledger, id) => {
            if (ledger.borrowerId === borrowerId && ledger.status === 'active') {
                activeLoans.push({ ...ledger, id });
            }
        });
        return activeLoans;
    }

    validateGroup(group) {
        if (!group.id || !group.name || !group.country || !group.adminId) {
            throw new Error('Group must have id, name, country, and adminId');
        }
        
        if (group.members && group.members.length < 5) {
            throw new Error('Group must have at least 5 members');
        }
        
        this.validateCountryExists(group.country);
    }

    validateLender(lender) {
        const requiredFields = ['id', 'userId', 'groupId', 'subscription', 'lendingCategories'];
        const missingFields = requiredFields.filter(field => !lender[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing lender fields: ${missingFields.join(', ')}`);
        }
        
        this.validateCountryExists(lender.country);
        this.validateGroupMembership(lender.userId, lender.groupId);
    }

    validateBorrower(borrower) {
        const requiredFields = ['id', 'userId', 'groupId', 'country'];
        const missingFields = requiredFields.filter(field => !borrower[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing borrower fields: ${missingFields.join(', ')}`);
        }
        
        this.validateCountryExists(borrower.country);
        this.validateGroupMembership(borrower.userId, borrower.groupId);
    }

    validateLedger(ledger) {
        this.validateLedgerFields(ledger);
        
        // Validate all IDs exist
        this.getBorrower(ledger.borrowerId);
        this.getLender(ledger.lenderId);
        this.getGroup(ledger.groupId);
        
        // Validate loan amount against lender's tier
        this.validateLenderTierLimit(ledger.lenderId, ledger.amount);
        
        // Validate category
        this.validateLoanCategory(ledger.category);
    }

    // Statistics and reporting
    getPlatformStats() {
        const stats = {
            totalCountries: this.countries.size,
            totalGroups: this.groups.size,
            totalLenders: this.lenders.size,
            totalBorrowers: this.borrowers.size,
            totalLedgers: this.ledgers.size,
            totalBlacklisted: this.blacklist.size,
            totalActiveLoans: 0,
            totalAmountLent: 0,
            totalAmountRepaid: 0,
            totalAmountOverdue: 0,
            averageRepaymentRate: 0
        };

        // Calculate active loans
        this.ledgers.forEach(ledger => {
            if (ledger.status === 'active') {
                stats.totalActiveLoans++;
                stats.totalAmountLent += ledger.amount;
                stats.totalAmountOverdue += ledger.amountOverdue || 0;
                stats.totalAmountRepaid += ledger.amountRepaid || 0;
            }
        });

        // Calculate average repayment rate
        let totalRepaymentRate = 0;
        let groupCount = 0;
        
        this.groups.forEach(group => {
            totalRepaymentRate += group.repaymentRate || 100;
            groupCount++;
        });
        
        stats.averageRepaymentRate = groupCount > 0 ? totalRepaymentRate / groupCount : 100;

        return stats;
    }

    getCountryStats(countryCode) {
        const country = this.getCountry(countryCode);
        const stats = {
            country: country.name,
            currency: country.currency,
            totalGroups: 0,
            totalLenders: 0,
            totalBorrowers: 0,
            totalActiveLoans: 0,
            totalAmountLent: 0,
            averageRepaymentRate: 0
        };

        // Filter by country
        this.groups.forEach(group => {
            if (group.country === countryCode) {
                stats.totalGroups++;
                stats.averageRepaymentRate += group.repaymentRate || 100;
            }
        });

        stats.averageRepaymentRate = stats.totalGroups > 0 ? 
            stats.averageRepaymentRate / stats.totalGroups : 0;

        return stats;
    }

    // Export for backup
    exportRegistry() {
        return {
            services: Array.from(this.services.entries()),
            components: Array.from(this.components.entries()),
            countries: Array.from(this.countries.entries()),
            groups: Array.from(this.groups.entries()),
            lenders: Array.from(this.lenders.entries()),
            borrowers: Array.from(this.borrowers.entries()),
            ledgers: Array.from(this.ledgers.entries()),
            subscriptions: Array.from(this.subscriptions.entries()),
            blacklist: Array.from(this.blacklist.entries()),
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    // Import from backup
    importRegistry(data) {
        if (!data || !data.timestamp) {
            throw new Error('Invalid registry data');
        }

        this.services = new Map(data.services || []);
        this.components = new Map(data.components || []);
        this.countries = new Map(data.countries || []);
        this.groups = new Map(data.groups || []);
        this.lenders = new Map(data.lenders || []);
        this.borrowers = new Map(data.borrowers || []);
        this.ledgers = new Map(data.ledgers || []);
        this.subscriptions = new Map(data.subscriptions || []);
        this.blacklist = new Map(data.blacklist || []);

        console.log(`Registry imported from ${data.timestamp}, version ${data.version}`);
        return true;
    }

    // Clear registry (for testing)
    clear() {
        this.services.clear();
        this.components.clear();
        this.countries.clear();
        this.groups.clear();
        this.lenders.clear();
        this.borrowers.clear();
        this.ledgers.clear();
        this.subscriptions.clear();
        this.blacklist.clear();
        this.validators.clear();
        
        // Reinitialize defaults
        this.initializeDefaultRegistries();
    }
}

// Create singleton instance
const mpesewaRegistry = new MpesewaRegistry();

// Export constants
export const REGISTRY_CONSTANTS = {
    MAX_GROUPS_PER_USER: 4,
    MIN_GROUP_MEMBERS: 5,
    MAX_GROUP_MEMBERS: 1000,
    LOAN_REPAYMENT_DAYS: 7,
    LOAN_INTEREST_RATE: 0.10,
    PENALTY_RATE: 0.05,
    DEFAULT_DAYS: 60,
    SUBSCRIPTION_EXPIRY_DAY: 28,
    MIN_LOAN_AMOUNT: 5,
    MAX_REFERRERS: 2
};

// Export hierarchy enforcer
export function enforceHierarchy(action, data) {
    const validatorKey = `${action}:hierarchy`;
    
    if (mpesewaRegistry.validators.has(validatorKey)) {
        return mpesewaRegistry.validators.get(validatorKey)(data);
    }
    
    // Default hierarchy validation
    switch(action) {
        case 'country:select':
            return mpesewaRegistry.validateCountryExists(data.countryCode);
        case 'group:join':
            return mpesewaRegistry.validateGroupMembership(data.userId, data.groupId) &&
                   mpesewaRegistry.validateGroupCapacity(data.groupId);
        case 'lender:register':
            return mpesewaRegistry.validateLenderSubscription(data.userId);
        case 'borrower:register':
            return mpesewaRegistry.validateBorrowerGroupLimit(data.userId) &&
                   mpesewaRegistry.validateBorrowerBlacklist(data.userId) &&
                   mpesewaRegistry.validateBorrowerReferrers(data.userId, data.referrers);
        case 'loan:request':
            return mpesewaRegistry.validateLoanAmount(data.amount, data.lenderId) &&
                   mpesewaRegistry.validateLoanDuration(data.duration) &&
                   mpesewaRegistry.validateLoanCategory(data.category) &&
                   mpesewaRegistry.validateActiveLoansPerGroup(data.borrowerId, data.groupId);
        default:
            return true;
    }
}

// Export for use in modules
export default mpesewaRegistry;

// Named exports
export {
    mpesewaRegistry as Registry,
    enforceHierarchy
};