/**
 * M-PESEWA CORE CONFIGURATION
 * Strictly follows all business rules from Sections A, B, C, D
 * Non-negotiable hierarchy enforcement
 */

const MpesewaConfig = {
    // ============================================
    // 1️⃣ STRICT HIERARCHY CONFIGURATION (NON-NEGOTIABLE)
    // ============================================
    HIERARCHY: {
        GLOBAL: 'global',
        COUNTRIES: 'countries',
        GROUPS: 'groups',
        LENDERS: 'lenders',
        BORROWERS: 'borrowers',
        LEDGERS: 'ledgers',
        
        // Strict chain: Global → Countries → Groups → Lenders/Borrowers → Ledgers
        getChain() {
            return {
                [this.GLOBAL]: {
                    [this.COUNTRIES]: {
                        [this.GROUPS]: {
                            [this.LENDERS]: this.LEDGERS,
                            [this.BORROWERS]: null
                        }
                    }
                }
            };
        }
    },

    // ============================================
    // 2️⃣ 12 SUB-SAHARAN AFRICAN COUNTRIES (MANDATORY)
    // ============================================
    COUNTRIES: [
        {
            code: 'KE',
            name: 'Kenya',
            currency: 'KSh',
            currencySymbol: 'KSh',
            phoneCode: '+254',
            flag: '🇰🇪',
            contact: '+254 709 219 000',
            isoCode: 'KEN',
            timezone: 'Africa/Nairobi'
        },
        {
            code: 'UG',
            name: 'Uganda',
            currency: 'UGX',
            currencySymbol: 'USh',
            phoneCode: '+256',
            flag: '🇺🇬',
            contact: '+256 392 175 546',
            isoCode: 'UGA',
            timezone: 'Africa/Kampala'
        },
        {
            code: 'TZ',
            name: 'Tanzania',
            currency: 'TZS',
            currencySymbol: 'TSh',
            phoneCode: '+255',
            flag: '🇹🇿',
            contact: '+255 659 073 010',
            isoCode: 'TZA',
            timezone: 'Africa/Dar_es_Salaam'
        },
        {
            code: 'RW',
            name: 'Rwanda',
            currency: 'RWF',
            currencySymbol: 'RF',
            phoneCode: '+250',
            flag: '🇷🇼',
            contact: '+250 791 590 801',
            isoCode: 'RWA',
            timezone: 'Africa/Kigali'
        },
        {
            code: 'BI',
            name: 'Burundi',
            currency: 'BIF',
            currencySymbol: 'FBu',
            phoneCode: '+257',
            flag: '🇧🇮',
            contact: '+257 79 000 000',
            isoCode: 'BDI',
            timezone: 'Africa/Bujumbura'
        },
        {
            code: 'CD',
            name: 'DRC',
            currency: 'CDF',
            currencySymbol: 'FC',
            phoneCode: '+243',
            flag: '🇨🇩',
            contact: '+243 81 000 0000',
            isoCode: 'COD',
            timezone: 'Africa/Kinshasa'
        },
        {
            code: 'NG',
            name: 'Nigeria',
            currency: 'NGN',
            currencySymbol: '₦',
            phoneCode: '+234',
            flag: '🇳🇬',
            contact: '+234 800 000 0000',
            isoCode: 'NGA',
            timezone: 'Africa/Lagos'
        },
        {
            code: 'GH',
            name: 'Ghana',
            currency: 'GHS',
            currencySymbol: 'GH₵',
            phoneCode: '+233',
            flag: '🇬🇭',
            contact: '+233 24 000 0000',
            isoCode: 'GHA',
            timezone: 'Africa/Accra'
        },
        {
            code: 'SS',
            name: 'South Sudan',
            currency: 'SSP',
            currencySymbol: 'SS£',
            phoneCode: '+211',
            flag: '🇸🇸',
            contact: '+211 955 000 000',
            isoCode: 'SSD',
            timezone: 'Africa/Juba'
        },
        {
            code: 'SO',
            name: 'Somalia',
            currency: 'SOS',
            currencySymbol: 'Sh.So.',
            phoneCode: '+252',
            flag: '🇸🇴',
            contact: '+252 63 0000000',
            isoCode: 'SOM',
            timezone: 'Africa/Mogadishu'
        },
        {
            code: 'ZA',
            name: 'South Africa',
            currency: 'ZAR',
            currencySymbol: 'R',
            phoneCode: '+27',
            flag: '🇿🇦',
            contact: '+27 11 000 0000',
            isoCode: 'ZAF',
            timezone: 'Africa/Johannesburg'
        },
        {
            code: 'ET',
            name: 'Ethiopia',
            currency: 'ETB',
            currencySymbol: 'Br',
            phoneCode: '+251',
            flag: '🇪🇹',
            contact: '+251 11 000 0000',
            isoCode: 'ETH',
            timezone: 'Africa/Addis_Ababa'
        }
    ],

    // ============================================
    // 3️⃣ GROUP CONFIGURATION (STRICT RULES)
    // ============================================
    GROUPS: {
        MIN_MEMBERS: 5,
        MAX_MEMBERS: 1000,
        MAX_GROUPS_PER_USER: 4,
        TYPES: ['Family', 'Church', 'Professional', 'Local', 'Social', 'Business', 'Community'],
        
        // Invitation-only enforcement
        INVITATION_REQUIRED: true,
        REFERRAL_REQUIRED: true,
        
        // Country isolation
        COUNTRY_LOCKED: true,
        NO_CROSS_COUNTRY: true
    },

    // ============================================
    // 4️⃣ LENDER CONFIGURATION (SUBSCRIPTION-BASED)
    // ============================================
    LENDERS: {
        // Subscription levels with strict limits
        SUBSCRIPTION_LEVELS: {
            BASIC: {
                code: 'basic',
                name: 'Basic',
                weeklyLimit: 1500,
                ledgerLimit: 1500,
                monthlyFee: 50,
                biAnnualFee: 250,
                annualFee: 500,
                requiresCRB: false,
                color: '#4CAF50'
            },
            PREMIUM: {
                code: 'premium',
                name: 'Premium',
                weeklyLimit: 5000,
                ledgerLimit: 10000,
                monthlyFee: 250,
                biAnnualFee: 1500,
                annualFee: 2500,
                requiresCRB: false,
                color: '#2196F3'
            },
            SUPER: {
                code: 'super',
                name: 'Super',
                weeklyLimit: 20000,
                ledgerLimit: 20000,
                monthlyFee: 1000,
                biAnnualFee: 5000,
                annualFee: 8500,
                requiresCRB: true,
                color: '#9C27B0'
            },
            LENDER_OF_LENDERS: {
                code: 'lol',
                name: 'Lender of Lenders',
                weeklyLimit: 50000,
                ledgerLimit: 50000,
                monthlyFee: 500,
                biAnnualFee: 3500,
                annualFee: 6500,
                requiresCRB: true,
                color: '#FF9800',
                minRepaymentPeriod: 30 // days
            }
        },
        
        // Subscription expiry - 28th of every month
        SUBSCRIPTION_EXPIRY_DAY: 28,
        
        // Group isolation
        LEND_WITHIN_GROUP_ONLY: true,
        
        // Unlimited ledgers per lender
        UNLIMITED_LEDGERS: true
    },

    // ============================================
    // 5️⃣ BORROWER CONFIGURATION (NO SUBSCRIPTION)
    // ============================================
    BORROWERS: {
        NO_SUBSCRIPTION_FEE: true,
        MAX_ACTIVE_LOANS_PER_GROUP: 1,
        DUAL_ROLE_ALLOWED: true,
        
        // Reputation system
        RATING_SYSTEM: {
            MIN_RATING: 1,
            MAX_RATING: 5,
            DEFAULT_RATING: 3
        }
    },

    // ============================================
    // 6️⃣ LOAN CONFIGURATION (STRICT TERMS)
    // ============================================
    LOANS: {
        // Core loan terms
        REPAYMENT_PERIOD_DAYS: 7,
        INTEREST_RATE: 10, // 10% per loan
        MIN_LOAN_AMOUNT: 5, // As low as 5 KSh equivalent
        
        // Penalty system
        DAILY_PENALTY_RATE: 5, // 5% daily after day 7
        PENALTY_START_DAY: 8, // Penalty starts on day 8
        DEFAULT_AFTER_DAYS: 60, // 2 months (60 days)
        
        // Partial repayments allowed
        ALLOW_PARTIAL_REPAYMENTS: true,
        
        // One active loan per group at a time
        ONE_ACTIVE_LOAN_PER_GROUP: true
    },

    // ============================================
    // 7️⃣ LEDGER SYSTEM CONFIGURATION (CORE FEATURE)
    // ============================================
    LEDGERS: {
        AUTO_GENERATE_ON_APPROVAL: true,
        UNLIMITED_PER_LENDER: true,
        
        // Statuses
        STATUSES: {
            ACTIVE: 'active',
            CLEARED: 'cleared',
            OVERDUE: 'overdue',
            DEFAULTED: 'defaulted'
        },
        
        // Required fields for each ledger
        REQUIRED_FIELDS: [
            'borrowerName',
            'borrowerContact',
            'borrowerLocation',
            'guarantor1Contact',
            'guarantor2Contact',
            'loanCategory',
            'amountBorrowed',
            'dateBorrowed',
            'dueDate',
            'interestRate',
            'status'
        ]
    },

    // ============================================
    // 8️⃣ BLACKLIST & REPUTATION SYSTEM
    // ============================================
    REPUTATION: {
        BLACKLIST_TRIGGER_DAYS: 60, // 2 months
        BLACKLIST_BADGE_COLOR: '#DC2626',
        BLACKLIST_BADGE_TEXT: 'BLACKLISTED',
        
        // Removal conditions
        BLACKLIST_REMOVAL_CONDITIONS: {
            FULL_REPAYMENT_REQUIRED: true,
            ADMIN_APPROVAL_REQUIRED: true,
            REQUIRES_PRINCIPAL: true,
            REQUIRES_INTEREST: true,
            REQUIRES_PENALTIES: true
        },
        
        // Rating impact on group access
        RATING_THRESHOLDS: {
            EXCELLENT: 4.5, // Can join 4 groups
            GOOD: 3.5,      // Can join 3 groups
            FAIR: 2.5,      // Can join 2 groups
            POOR: 1.5,      // Can join 1 group
            BAD: 1.0        // Restricted to current group
        }
    },

    // ============================================
    // 9️⃣ EMERGENCY CATEGORIES (20 CATEGORIES)
    // ============================================
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

    // ============================================
    // 🔟 PLATFORM ADMIN CONFIGURATION
    // ============================================
    ADMIN: {
        // Admin override powers
        OVERRIDE_POWERS: {
            BLACKLIST: true,
            LEDGERS: true,
            RATINGS: true,
            DEBT_COLLECTORS: true,
            GROUP_ADMIN: true
        },
        
        // Admin access levels
        ACCESS_LEVELS: {
            SUPER_ADMIN: 'super_admin',
            COUNTRY_ADMIN: 'country_admin',
            GROUP_ADMIN: 'group_admin'
        }
    },

    // ============================================
    // 1️⃣1️⃣ DEBT COLLECTORS CONFIGURATION
    // ============================================
    DEBT_COLLECTORS: {
        VETTED_COLLECTORS_COUNT: 200,
        PLATFORM_PARTICIPATION: false, // Platform does not participate in recovery
        REQUIRED_FIELDS: ['name', 'contact', 'location', 'country', 'specialization']
    },

    // ============================================
    // 1️⃣2️⃣ COLOR & UI CONFIGURATION (STRICT)
    // ============================================
    COLORS: {
        PRIMARY_BLUE: '#003366',
        SECONDARY_BLUE: '#0099ff',
        ACTION_ORANGE: '#f37021',
        TRUST_GREEN: '#28a745',
        NEUTRAL_LIGHT: '#f8f9fa',
        PURE_WHITE: '#ffffff',
        
        // Usage rules
        USAGE_RULES: {
            HEADER_BACKGROUND: '#003366',
            FOOTER_BACKGROUND: '#1f2a37',
            BORROWER_BUTTONS: '#f37021',
            LENDER_BUTTONS: '#28a745',
            CARD_GLOW: '#0099ff',
            SUCCESS_INDICATORS: '#28a745'
        }
    },

    // ============================================
    // 1️⃣3️⃣ VALIDATION RULES
    // ============================================
    VALIDATION: {
        PASSWORD: {
            MIN_LENGTH: 8,
            MAX_LENGTH: 12,
            REQUIRE_UPPERCASE: true,
            REQUIRE_LOWERCASE: true,
            REQUIRE_NUMBERS: true,
            REQUIRE_SYMBOLS: true
        },
        
        PHONE: {
            MIN_LENGTH: 9,
            MAX_LENGTH: 15,
            ALLOW_PLUS: true
        },
        
        NATIONAL_ID: {
            MIN_LENGTH: 5,
            MAX_LENGTH: 20
        }
    },

    // ============================================
    // 1️⃣4️⃣ STORAGE & CACHE CONFIGURATION
    // ============================================
    STORAGE: {
        PREFIX: 'mpesewa_',
        VERSION: '1.0.0',
        
        KEYS: {
            USER: 'user',
            COUNTRY: 'country',
            GROUP: 'group',
            ROLE: 'role',
            SUBSCRIPTION: 'subscription',
            SESSION: 'session',
            CACHE: 'cache'
        },
        
        TTL: {
            SESSION: 24 * 60 * 60 * 1000, // 24 hours
            CACHE: 5 * 60 * 1000, // 5 minutes
            TRANSACTION: 30 * 60 * 1000 // 30 minutes
        }
    },

    // ============================================
    // 1️⃣5️⃣ API & NETWORK CONFIGURATION
    // ============================================
    API: {
        BASE_URL: 'https://api.mpesewa.com/v1',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        
        ENDPOINTS: {
            AUTH: {
                LOGIN: '/auth/login',
                REGISTER: '/auth/register',
                VERIFY: '/auth/verify',
                LOGOUT: '/auth/logout',
                FORGOT_PASSWORD: '/auth/forgot-password',
                RESET_PASSWORD: '/auth/reset-password'
            },
            LENDERS: {
                DASHBOARD: '/lenders/dashboard',
                PORTFOLIO: '/lenders/portfolio',
                LEDGERS: '/lenders/ledgers',
                SUBSCRIPTION: '/lenders/subscription'
            },
            BORROWERS: {
                DASHBOARD: '/borrowers/dashboard',
                APPLY: '/borrowers/apply',
                HISTORY: '/borrowers/history',
                REPAYMENTS: '/borrowers/repayments'
            },
            GROUPS: {
                LIST: '/groups',
                CREATE: '/groups/create',
                MEMBERS: '/groups/members',
                INVITE: '/groups/invite'
            },
            ADMIN: {
                DASHBOARD: '/admin/dashboard',
                USERS: '/admin/users',
                GROUPS: '/admin/groups',
                LEDGERS: '/admin/ledgers',
                BLACKLIST: '/admin/blacklist'
            }
        }
    },

    // ============================================
    // 1️⃣6️⃣ PWA CONFIGURATION
    // ============================================
    PWA: {
        CACHE_NAME: 'mpesewa-pwa-v1',
        OFFLINE_PAGE: 'offline.html',
        NOT_FOUND_PAGE: '404.html',
        
        CACHE_ASSETS: [
            '/',
            '/index.html',
            '/offline.html',
            '/404.html',
            '/manifest.json',
            '/service-worker.js',
            '/assets/css/*',
            '/assets/images/*',
            '/assets/fonts/*'
        ],
        
        SYNC_TAGS: {
            LEDGER_UPDATE: 'ledger-update',
            REPAYMENT_SYNC: 'repayment-sync',
            PROFILE_SYNC: 'profile-sync'
        }
    },

    // ============================================
    // 1️⃣7️⃣ ERROR CODES & MESSAGES
    // ============================================
    ERRORS: {
        HIERARCHY_VIOLATION: 'HIERARCHY_VIOLATION',
        COUNTRY_ISOLATION: 'COUNTRY_ISOLATION',
        GROUP_ISOLATION: 'GROUP_ISOLATION',
        SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
        BLACKLISTED: 'BLACKLISTED',
        MAX_GROUPS_REACHED: 'MAX_GROUPS_REACHED',
        MAX_LIMIT_EXCEEDED: 'MAX_LIMIT_EXCEEDED',
        
        MESSAGES: {
            HIERARCHY_VIOLATION: 'Operation violates M-Pesewa hierarchy rules.',
            COUNTRY_ISOLATION: 'Cross-country operations are not allowed.',
            GROUP_ISOLATION: 'Lenders can only lend within their group.',
            SUBSCRIPTION_EXPIRED: 'Lender subscription expired. Please renew to continue.',
            BLACKLISTED: 'User is blacklisted and cannot borrow or join new groups.',
            MAX_GROUPS_REACHED: 'Maximum of 4 groups reached. Improve rating to join more.',
            MAX_LIMIT_EXCEEDED: 'Loan amount exceeds subscription limit.'
        }
    },

    // ============================================
    // 1️⃣8️⃣ FEATURE TOGGLES
    // ============================================
    FEATURES: {
        DUAL_ROLE: true,
        GOOGLE_LOGIN: true,
        OFFLINE_MODE: true,
        PUSH_NOTIFICATIONS: true,
        AUTO_LOGOUT: true,
        SESSION_TIMEOUT: 30, // minutes
        AUTO_SAVE: true,
        AUTO_SYNC: true
    },

    // ============================================
    // 1️⃣9️⃣ SECURITY CONFIGURATION
    // ============================================
    SECURITY: {
        JWT_EXPIRY: '24h',
        REFRESH_TOKEN_EXPIRY: '7d',
        SALT_ROUNDS: 10,
        CSRF_ENABLED: true,
        XSS_PROTECTION: true,
        CONTENT_SECURITY_POLICY: true,
        
        HEADERS: {
            STRICT_TRANSPORT_SECURITY: true,
            X_FRAME_OPTIONS: 'DENY',
            X_CONTENT_TYPE_OPTIONS: 'nosniff',
            REFERRER_POLICY: 'strict-origin-when-cross-origin'
        }
    },

    // ============================================
    // 2️⃣0️⃣ ANALYTICS & MONITORING
    // ============================================
    ANALYTICS: {
        ENABLED: true,
        PROVIDER: 'internal',
        
        EVENTS: {
            PAGE_VIEW: 'page_view',
            USER_REGISTRATION: 'user_registration',
            LOAN_APPLICATION: 'loan_application',
            LOAN_APPROVAL: 'loan_approval',
            REPAYMENT: 'repayment',
            SUBSCRIPTION_PAYMENT: 'subscription_payment',
            GROUP_JOIN: 'group_join',
            GROUP_CREATE: 'group_create'
        },
        
        METRICS: {
            REPAYMENT_RATE_TARGET: 99,
            DEFAULT_RATE_TARGET: 1,
            GROWTH_TARGET_MONTHLY: 10,
            USER_ACTIVITY_DAILY: 80
        }
    },

    // ============================================
    // 2️⃣1️⃣ INTERNATIONALIZATION
    // ============================================
    I18N: {
        DEFAULT_LANGUAGE: 'en',
        SUPPORTED_LANGUAGES: ['en', 'sw', 'fr', 'ar'],
        
        COUNTRY_LANGUAGES: {
            KE: ['en', 'sw'],
            UG: ['en', 'sw'],
            TZ: ['sw', 'en'],
            RW: ['rw', 'en', 'fr'],
            BI: ['fr', 'rn'],
            CD: ['fr', 'sw'],
            NG: ['en'],
            GH: ['en'],
            SS: ['en', 'ar'],
            SO: ['so', 'ar', 'en'],
            ZA: ['en', 'af', 'zu', 'xh'],
            ET: ['am', 'en']
        }
    },

    // ============================================
    // 2️⃣2️⃣ PLATFORM PURPOSE & OBJECTIVES
    // ============================================
    PURPOSE: {
        MISSION: 'Solve emergency consumer pain points',
        VISION: 'Build trust-based financial ecosystems across Africa',
        
        OBJECTIVES: [
            'Enable friends to help friends',
            'Create income opportunities for lenders',
            'Put idle money to productive use',
            'Reduce reliance on predatory lending',
            'Build trust through group accountability'
        ],
        
        TARGET_USERS: [
            'Individuals seeking emergency consumption loans',
            'Informal and professional lenders',
            'Families, churches, and social groups',
            'Community-based lenders',
            'Small business associations'
        ]
    },

    // ============================================
    // 2️⃣3️⃣ SUCCESS METRICS
    // ============================================
    SUCCESS_METRICS: {
        HIGH_REPAYMENT_RATE: 99, // Target: 99%
        GROWTH_IN_TRUSTED_GROUPS: true,
        REDUCED_DEFAULT_RATES: true,
        INCREASED_LENDER_PARTICIPATION: true,
        IMPROVED_EMERGENCY_ACCESS: true
    },

    // ============================================
    // 2️⃣4️⃣ LEGAL & COMPLIANCE
    // ============================================
    LEGAL: {
        TERMS_VERSION: 'v1',
        PRIVACY_VERSION: 'v1',
        COOKIE_POLICY_VERSION: 'v1',
        
        COMPLIANCE: {
            GDPR: true,
            CCPA: false,
            LOCAL_REGULATIONS: true,
            DATA_PROTECTION: true
        },
        
        DISCLAIMERS: {
            NOT_A_BANK: 'M-Pesewa is not a bank, not a lender, not a borrower, and does not hold user funds.',
            NO_GUARANTEES: 'M-Pesewa does not guarantee repayment, performance, or behavior of any user.',
            PRIVATE_AGREEMENTS: 'All loans are private agreements between users.',
            RISK_DISCLOSURE: 'Lending involves risk of total loss. You participate at your own risk.'
        }
    },

    // ============================================
    // 2️⃣5️⃣ UTILITY FUNCTIONS
    // ============================================
    utils: {
        /**
         * Validate if operation respects country isolation
         * @param {string} userCountry - User's country code
         * @param {string} targetCountry - Target country code
         * @returns {boolean} - True if operation is allowed
         */
        validateCountryIsolation(userCountry, targetCountry) {
            if (!userCountry || !targetCountry) return false;
            return userCountry === targetCountry;
        },

        /**
         * Validate group membership limits
         * @param {number} currentGroups - Current number of groups user belongs to
         * @param {number} userRating - User's rating (1-5)
         * @returns {boolean} - True if user can join more groups
         */
        validateGroupMembership(currentGroups, userRating) {
            if (currentGroups >= this.GROUPS.MAX_GROUPS_PER_USER) return false;
            
            const rating = userRating || this.BORROWERS.RATING_SYSTEM.DEFAULT_RATING;
            const thresholds = this.REPUTATION.RATING_THRESHOLDS;
            
            if (rating >= thresholds.EXCELLENT && currentGroups < 4) return true;
            if (rating >= thresholds.GOOD && currentGroups < 3) return true;
            if (rating >= thresholds.FAIR && currentGroups < 2) return true;
            if (rating >= thresholds.POOR && currentGroups < 1) return true;
            
            return false;
        },

        /**
         * Calculate loan repayment details
         * @param {number} amount - Loan amount
         * @param {string} currency - Currency code
         * @returns {object} - Repayment details
         */
        calculateRepayment(amount, currency = 'KSh') {
            const interest = (amount * this.LOANS.INTEREST_RATE) / 100;
            const total = amount + interest;
            
            return {
                principal: amount,
                interest: interest,
                total: total,
                dailyRepayment: total / this.LOANS.REPAYMENT_PERIOD_DAYS,
                dueDate: this.calculateDueDate(),
                currency: currency
            };
        },

        /**
         * Calculate due date (7 days from now)
         * @returns {Date} - Due date
         */
        calculateDueDate() {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + this.LOANS.REPAYMENT_PERIOD_DAYS);
            return dueDate;
        },

        /**
         * Calculate penalties for overdue loans
         * @param {number} amount - Outstanding amount
         * @param {number} overdueDays - Days overdue
         * @returns {number} - Penalty amount
         */
        calculatePenalties(amount, overdueDays) {
            if (overdueDays <= 0) return 0;
            
            const dailyPenaltyRate = this.LOANS.DAILY_PENALTY_RATE / 100;
            let penalty = 0;
            
            for (let i = 0; i < overdueDays; i++) {
                penalty += amount * dailyPenaltyRate;
                amount += penalty; // Compound penalty
            }
            
            return penalty;
        },

        /**
         * Get country by code
         * @param {string} code - Country code
         * @returns {object|null} - Country object
         */
        getCountryByCode(code) {
            return this.COUNTRIES.find(country => country.code === code) || null;
        },

        /**
         * Get subscription level by code
         * @param {string} code - Subscription code
         * @returns {object|null} - Subscription level object
         */
        getSubscriptionLevel(code) {
            return this.LENDERS.SUBSCRIPTION_LEVELS[code.toUpperCase()] || null;
        },

        /**
         * Validate lender subscription
         * @param {object} subscription - Subscription object
         * @returns {boolean} - True if subscription is valid
         */
        validateSubscription(subscription) {
            if (!subscription) return false;
            
            const now = new Date();
            const expiryDate = new Date(subscription.expiryDate);
            
            // Check if subscription is expired (28th of month rule)
            if (now > expiryDate) return false;
            
            // Check if today is after the 28th of current month
            const today = now.getDate();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            if (today > this.LENDERS.SUBSCRIPTION_EXPIRY_DAY) {
                // If today is after 28th, check if subscription is for next month
                const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
                const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
                
                if (expiryDate.getMonth() === nextMonth && expiryDate.getFullYear() === nextYear) {
                    return true;
                }
                return false;
            }
            
            return true;
        },

        /**
         * Format currency based on country
         * @param {number} amount - Amount to format
         * @param {string} countryCode - Country code
         * @returns {string} - Formatted currency string
         */
        formatCurrency(amount, countryCode) {
            const country = this.getCountryByCode(countryCode);
            if (!country) return `${amount} KSh`;
            
            return `${country.currencySymbol} ${amount.toLocaleString()}`;
        },

        /**
         * Get emergency category by ID
         * @param {string} id - Category ID
         * @returns {object|null} - Category object
         */
        getEmergencyCategory(id) {
            return this.EMERGENCY_CATEGORIES.find(cat => cat.id === id) || null;
        },

        /**
         * Check if user is blacklisted
         * @param {object} user - User object
         * @returns {boolean} - True if blacklisted
         */
        isBlacklisted(user) {
            if (!user || !user.blacklist) return false;
            
            const blacklistDate = new Date(user.blacklist.date);
            const now = new Date();
            const daysBlacklisted = Math.floor((now - blacklistDate) / (1000 * 60 * 60 * 24));
            
            return daysBlacklisted > 0 && user.blacklist.status === 'active';
        },

        /**
         * Get user's maximum borrowing limit based on groups
         * @param {object} user - User object
         * @param {string} subscriptionLevel - Subscription level code
         * @returns {number} - Maximum borrowing limit
         */
        getUserBorrowingLimit(user, subscriptionLevel) {
            if (!user || !subscriptionLevel) return 0;
            
            const subscription = this.getSubscriptionLevel(subscriptionLevel);
            if (!subscription) return 0;
            
            // Check if user has good rating for additional groups
            const rating = user.rating || this.BORROWERS.RATING_SYSTEM.DEFAULT_RATING;
            const groupCount = user.groups?.length || 0;
            
            // Base limit from subscription
            let limit = subscription.weeklyLimit;
            
            // Increase limit based on rating and group participation
            if (rating >= 4 && groupCount >= 2) {
                limit *= 1.5; // 50% increase for excellent users in multiple groups
            } else if (rating >= 3 && groupCount >= 2) {
                limit *= 1.25; // 25% increase for good users in multiple groups
            }
            
            return Math.floor(limit);
        },

        /**
         * Generate ledger ID
         * @param {string} lenderId - Lender ID
         * @param {string} borrowerId - Borrower ID
         * @returns {string} - Unique ledger ID
         */
        generateLedgerId(lenderId, borrowerId) {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substr(2, 5);
            return `LEDGER_${lenderId}_${borrowerId}_${timestamp}_${random}`.toUpperCase();
        },

        /**
         * Validate password strength
         * @param {string} password - Password to validate
         * @returns {object} - Validation result
         */
        validatePassword(password) {
            const rules = this.VALIDATION.PASSWORD;
            const result = {
                isValid: true,
                errors: []
            };
            
            if (password.length < rules.MIN_LENGTH) {
                result.isValid = false;
                result.errors.push(`Password must be at least ${rules.MIN_LENGTH} characters`);
            }
            
            if (password.length > rules.MAX_LENGTH) {
                result.isValid = false;
                result.errors.push(`Password must not exceed ${rules.MAX_LENGTH} characters`);
            }
            
            if (rules.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
                result.isValid = false;
                result.errors.push('Password must contain at least one uppercase letter');
            }
            
            if (rules.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
                result.isValid = false;
                result.errors.push('Password must contain at least one lowercase letter');
            }
            
            if (rules.REQUIRE_NUMBERS && !/\d/.test(password)) {
                result.isValid = false;
                result.errors.push('Password must contain at least one number');
            }
            
            if (rules.REQUIRE_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                result.isValid = false;
                result.errors.push('Password must contain at least one special character');
            }
            
            return result;
        },

        /**
         * Get platform statistics
         * @returns {object} - Platform statistics
         */
        getPlatformStats() {
            // This would typically come from backend
            return {
                totalUsers: 50000,
                activeLenders: 10000,
                activeBorrowers: 40000,
                totalGroups: 1000,
                totalLoans: 150000,
                repaymentRate: 99.2,
                totalAmountLent: 500000000,
                countriesActive: this.COUNTRIES.length
            };
        },

        /**
         * Check if date is subscription expiry date (28th of month)
         * @param {Date} date - Date to check
         * @returns {boolean} - True if date is 28th
         */
        isSubscriptionExpiryDate(date) {
            return date.getDate() === this.LENDERS.SUBSCRIPTION_EXPIRY_DAY;
        },

        /**
         * Get next subscription expiry date
         * @param {Date} fromDate - Starting date
         * @returns {Date} - Next expiry date (28th of next month)
         */
        getNextExpiryDate(fromDate = new Date()) {
            const expiryDate = new Date(fromDate);
            const currentDay = expiryDate.getDate();
            
            if (currentDay <= this.LENDERS.SUBSCRIPTION_EXPIRY_DAY) {
                // If before or on 28th, set to 28th of current month
                expiryDate.setDate(this.LENDERS.SUBSCRIPTION_EXPIRY_DAY);
            } else {
                // If after 28th, set to 28th of next month
                expiryDate.setMonth(expiryDate.getMonth() + 1);
                expiryDate.setDate(this.LENDERS.SUBSCRIPTION_EXPIRY_DAY);
            }
            
            return expiryDate;
        },

        /**
         * Calculate days until subscription expiry
         * @param {Date} expiryDate - Expiry date
         * @returns {number} - Days until expiry
         */
        daysUntilExpiry(expiryDate) {
            const now = new Date();
            const diffTime = expiryDate - now;
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
    }
};

// Freeze configuration to prevent modifications
Object.freeze(MpesewaConfig);
Object.freeze(MpesewaConfig.COUNTRIES);
Object.freeze(MpesewaConfig.GROUPS);
Object.freeze(MpesewaConfig.LENDERS);
Object.freeze(MpesewaConfig.LENDERS.SUBSCRIPTION_LEVELS);
Object.freeze(MpesewaConfig.BORROWERS);
Object.freeze(MpesewaConfig.LOANS);
Object.freeze(MpesewaConfig.LEDGERS);
Object.freeze(MpesewaConfig.REPUTATION);
Object.freeze(MpesewaConfig.EMERGENCY_CATEGORIES);
Object.freeze(MpesewaConfig.ADMIN);
Object.freeze(MpesewaConfig.DEBT_COLLECTORS);
Object.freeze(MpesewaConfig.COLORS);
Object.freeze(MpesewaConfig.VALIDATION);
Object.freeze(MpesewaConfig.STORAGE);
Object.freeze(MpesewaConfig.API);
Object.freeze(MpesewaConfig.PWA);
Object.freeze(MpesewaConfig.ERRORS);
Object.freeze(MpesewaConfig.FEATURES);
Object.freeze(MpesewaConfig.SECURITY);
Object.freeze(MpesewaConfig.ANALYTICS);
Object.freeze(MpesewaConfig.I18N);
Object.freeze(MpesewaConfig.PURPOSE);
Object.freeze(MpesewaConfig.SUCCESS_METRICS);
Object.freeze(MpesewaConfig.LEGAL);

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MpesewaConfig;
} else {
    window.MpesewaConfig = MpesewaConfig;
}