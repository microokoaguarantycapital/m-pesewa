/**
 * M-PESEWA APPLICATION CONSTANTS
 * Centralized definition of all constants for the platform
 * STRICT HIERARCHY: Global → Country → Groups → Lenders → Borrowers
 */

class MpesewaConstants {
    constructor() {
        // VERSION & ENVIRONMENT
        this.APP_VERSION = '1.0.0';
        this.APP_NAME = 'M-Pesewa';
        this.APP_DESCRIPTION = 'Emergency Micro-Lending in Trusted Circles';
        
        // STRICT HIERARCHY LEVELS (NON-NEGOTIABLE)
        this.HIERARCHY_LEVELS = {
            GLOBAL: 'global',
            COUNTRY: 'country',
            GROUP: 'group',
            LENDER: 'lender',
            BORROWER: 'borrower',
            LEDGER: 'ledger',
            ADMIN: 'admin'
        };
        
        // SUPPORTED COUNTRIES (12 Sub-Saharan African countries)
        this.COUNTRIES = [
            { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪', phoneCode: '+254' },
            { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬', phoneCode: '+256' },
            { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿', phoneCode: '+255' },
            { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼', phoneCode: '+250' },
            { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮', phoneCode: '+257' },
            { code: 'DRC', name: 'Democratic Republic of Congo', currency: 'CDF', flag: '🇨🇩', phoneCode: '+243' },
            { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸', phoneCode: '+211' },
            { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴', phoneCode: '+252' },
            { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬', phoneCode: '+234' },
            { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭', phoneCode: '+233' },
            { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦', phoneCode: '+27' },
            { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹', phoneCode: '+251' }
        ];
        
        // STRICT BUSINESS RULES (NON-NEGOTIABLE)
        this.BUSINESS_RULES = {
            // Country isolation
            COUNTRY_ISOLATION: true,
            NO_CROSS_COUNTRY_LENDING: true,
            
            // Group rules
            GROUP_MIN_MEMBERS: 5,
            GROUP_MAX_MEMBERS: 1000,
            GROUP_INVITATION_ONLY: true,
            GROUP_COUNTRY_LOCKED: true,
            
            // Borrower rules
            BORROWER_MAX_GROUPS: 4,
            BORROWER_MIN_RATING_FOR_ADDITIONAL_GROUPS: 3, // 3-star minimum
            BORROWER_NO_SUBSCRIPTION_FEES: true,
            
            // Lender rules
            LENDER_SUBSCRIPTION_REQUIRED: true,
            LENDER_ONLY_LEND_IN_GROUP: true,
            LENDER_SUBSCRIPTION_EXPIRY_DAY: 28, // 28th of each month
            LENDER_CAN_BE_BORROWER: true,
            
            // Loan rules
            LOAN_MAX_REPAYMENT_PERIOD_DAYS: 7,
            LOAN_INTEREST_RATE: 0.10, // 10%
            LOAN_PENALTY_RATE_DAILY: 0.05, // 5% daily after 7 days
            LOAN_DEFAULT_AFTER_DAYS: 60, // 2 months
            LOAN_MIN_AMOUNT: 5, // Minimum loan amount in local currency
            LOAN_MAX_ACTIVE_PER_GROUP: 1, // Max 1 active loan per group per borrower
            
            // Ledger rules
            LEDGER_AUTO_CREATE_ON_APPROVAL: true,
            LEDGER_UNLIMITED_PER_LENDER: true,
            LEDGER_APPEND_ONLY: true,
            
            // Blacklist rules
            BLACKLIST_AFTER_DEFAULT: true,
            BLACKLIST_REMOVAL_ADMIN_ONLY: true,
            BLACKLIST_REMOVAL_REQUIRES_FULL_PAYMENT: true,
            
            // Rating system
            RATING_SYSTEM_STARS: 5,
            RATING_MIN_FOR_GOOD_STANDING: 3,
            
            // Platform rules
            PLATFORM_EARN_ONLY_FROM_SUBSCRIPTIONS: true,
            NO_FUND_HANDLING: true,
            ALL_LOANS_OFF_PLATFORM: true
        };
        
        // SUBSCRIPTION PLANS (LENDERS ONLY)
        this.SUBSCRIPTION_PLANS = {
            BASIC: {
                code: 'basic',
                name: 'Basic',
                limits: {
                    weekly: 1500,
                    perLedger: 1500,
                    maxLedgers: 10
                },
                pricing: {
                    monthly: 50,
                    biAnnual: 250,
                    annual: 500
                },
                features: {
                    crbCheck: false,
                    allCategories: false,
                    advancedAnalytics: false,
                    customTerms: false
                },
                description: 'Start with small loans'
            },
            
            PREMIUM: {
                code: 'premium',
                name: 'Premium',
                limits: {
                    weekly: 5000,
                    perLedger: 10000,
                    maxLedgers: 50
                },
                pricing: {
                    monthly: 250,
                    biAnnual: 1500,
                    annual: 2500
                },
                features: {
                    crbCheck: false,
                    allCategories: true,
                    advancedAnalytics: true,
                    customTerms: false
                },
                description: 'For serious lenders'
            },
            
            SUPER: {
                code: 'super',
                name: 'Super',
                limits: {
                    weekly: 20000,
                    perLedger: 20000,
                    maxLedgers: Infinity
                },
                pricing: {
                    monthly: 1000,
                    biAnnual: 5000,
                    annual: 8500
                },
                features: {
                    crbCheck: true,
                    allCategories: true,
                    advancedAnalytics: true,
                    customTerms: false
                },
                description: 'For professional lenders'
            },
            
            LENDER_OF_LENDERS: {
                code: 'lender-of-lenders',
                name: 'Lender of Lenders',
                limits: {
                    weekly: 50000,
                    perLedger: 50000,
                    maxLedgers: Infinity
                },
                pricing: {
                    monthly: 500,
                    biAnnual: 3500,
                    annual: 6500
                },
                features: {
                    crbCheck: true,
                    allCategories: true,
                    advancedAnalytics: true,
                    customTerms: true,
                    customRepaymentPeriod: true
                },
                description: 'For institutional lending'
            }
        };
        
        // EMERGENCY CATEGORIES (20 categories)
        this.EMERGENCY_CATEGORIES = [
            { 
                code: 'transport', 
                name: 'M-pesewa Fare', 
                icon: '🚌', 
                description: 'Move on, don\'t stall—borrow for your journey.',
                typicalAmounts: { min: 100, max: 5000 }
            },
            { 
                code: 'data', 
                name: 'M-pesewa Data', 
                icon: '📶', 
                description: 'Stay connected, stay informed—borrow when your bundle runs out.',
                typicalAmounts: { min: 50, max: 1000 }
            },
            { 
                code: 'cooking-gas', 
                name: 'M-pesewa Cooking Gas', 
                icon: '🔥', 
                description: 'Cook with confidence—borrow when your gas is low.',
                typicalAmounts: { min: 500, max: 5000 }
            },
            { 
                code: 'food', 
                name: 'M-pesewa Food', 
                icon: '🍲', 
                description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.',
                typicalAmounts: { min: 200, max: 3000 }
            },
            { 
                code: 'wifi', 
                name: 'M-pesewa Wifi', 
                icon: '📡', 
                description: 'Stay connected at home.',
                typicalAmounts: { min: 500, max: 3000 }
            },
            { 
                code: 'water', 
                name: 'M-pesewa Water Bill', 
                icon: '🚰', 
                description: 'Stay hydrated—borrow for water needs or bills.',
                typicalAmounts: { min: 300, max: 5000 }
            },
            { 
                code: 'electricity', 
                name: 'M-pesewa Electricity Tokens', 
                icon: '⚡', 
                description: 'Stay lit, stay powered—borrow tokens when you need it.',
                typicalAmounts: { min: 100, max: 10000 }
            },
            { 
                code: 'tv', 
                name: 'M-pesewa TV Subscription', 
                icon: '📺', 
                description: 'Never miss your favorite shows.',
                typicalAmounts: { min: 500, max: 5000 }
            },
            { 
                code: 'fuel', 
                name: 'M-pesewa Fuel', 
                icon: '⛽', 
                description: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk).',
                typicalAmounts: { min: 300, max: 10000 }
            },
            { 
                code: 'repairs', 
                name: 'M-pesewa Repair', 
                icon: '🔧', 
                description: 'Fix it quick—borrow for minor repairs and keep going.',
                typicalAmounts: { min: 500, max: 20000 }
            },
            { 
                code: 'tools', 
                name: 'M-pesewa Credo', 
                icon: '🛠️', 
                description: 'Fix it fast—borrow for urgent repairs or tools.',
                typicalAmounts: { min: 1000, max: 15000 }
            },
            { 
                code: 'daily-sales', 
                name: 'M-Pesa Daily Sales Advance', 
                icon: '🧾', 
                description: 'Small Loan advance for everyday business.',
                typicalAmounts: { min: 500, max: 5000 }
            },
            { 
                code: 'working-capital', 
                name: 'M-Pesa Working Capital Advance', 
                icon: '🏪', 
                description: 'Working capital when your business needs it.',
                typicalAmounts: { min: 1000, max: 20000 }
            },
            { 
                code: 'market', 
                name: 'M-Pesewa Soko Loan', 
                icon: '🛒', 
                description: 'Market money when you need it.',
                typicalAmounts: { min: 500, max: 10000 }
            },
            { 
                code: 'stall', 
                name: 'M-Pesewa Kidandaski Loan', 
                icon: '🏗️', 
                description: 'Kibanda/stall money when you need it.',
                typicalAmounts: { min: 1000, max: 50000 }
            },
            { 
                code: 'hawker', 
                name: 'M-Pesewa Hawker Loan', 
                icon: '🚶‍♂️', 
                description: 'Be Street smart, cash flow all time.',
                typicalAmounts: { min: 500, max: 10000 }
            },
            { 
                code: 'fuliza', 
                name: 'M-fuliziwa Loan', 
                icon: '🔄', 
                description: 'Your fuliza is not enough? Top up here.',
                typicalAmounts: { min: 100, max: 50000 }
            },
            { 
                code: 'medicine', 
                name: 'M-pesewa Medicine', 
                icon: '💊', 
                description: 'Health first—borrow for urgent medicines.',
                typicalAmounts: { min: 200, max: 10000 }
            },
            { 
                code: 'school-fees', 
                name: 'M-pesewa School Fees', 
                icon: '🎓', 
                description: 'Secure your future without delay.',
                typicalAmounts: { min: 1000, max: 50000 }
            },
            { 
                code: 'advance', 
                name: 'M-pesewa Advance', 
                icon: '💸', 
                description: 'Quick cash when you need it most.',
                typicalAmounts: { min: 100, max: 50000 }
            }
        ];
        
        // USER ROLES
        this.USER_ROLES = {
            BORROWER: 'borrower',
            LENDER: 'lender',
            GROUP_ADMIN: 'group-admin',
            GROUP_FOUNDER: 'group-founder',
            PLATFORM_ADMIN: 'admin'
        };
        
        // LEDGER STATES
        this.LEDGER_STATES = {
            CREATED: 'created',
            ACTIVE: 'active',
            OVERDUE: 'overdue',
            DEFAULTED: 'defaulted',
            CLEARED: 'cleared',
            ARCHIVED: 'archived'
        };
        
        // BORROWER STATES
        this.BORROWER_STATES = {
            NEW: 'new',
            VERIFIED: 'verified',
            ELIGIBLE: 'eligible',
            BORROWING: 'borrowing',
            OVERDUE: 'overdue',
            DEFAULTED: 'defaulted',
            BLACKLISTED: 'blacklisted',
            REINSTATED: 'reinstated'
        };
        
        // LENDER STATES
        this.LENDER_STATES = {
            NEW: 'new',
            SUBSCRIBED: 'subscribed',
            ACTIVE: 'active',
            SUSPENDED: 'suspended',
            EXPIRED: 'expired'
        };
        
        // GROUP STATES
        this.GROUP_STATES = {
            CREATED: 'created',
            ACTIVE: 'active',
            LOCKED: 'locked',
            SUSPENDED: 'suspended',
            ARCHIVED: 'archived'
        };
        
        // SUBSCRIPTION STATES
        this.SUBSCRIPTION_STATES = {
            ACTIVE: 'active',
            EXPIRED: 'expired',
            SUSPENDED: 'suspended',
            CANCELLED: 'cancelled'
        };
        
        // COLOR PALETTE (STRICT BRAND GUIDELINES)
        this.COLORS = {
            PRIMARY_BLUE: '#003366',     // Headers, footers, main headings
            SECONDARY_BLUE: '#0099ff',   // Links, floating card glow, secondary highlights
            ACTION_ORANGE: '#f37021',    // Borrower buttons / Apply Now
            TRUST_GREEN: '#28a745',      // Lender sections, success indicators
            NEUTRAL_LIGHT: '#f8f9fa',    // Section separation background
            PURE_WHITE: '#ffffff',       // Main cards, body background
            DARK_TEXT: '#003366',        // Text on white background
            BODY_TEXT: '#555555',        // Body text color
            WHITE_TEXT: '#ffffff',       // Text on dark background
            FOOTER_BG: '#1f2a37',        // Footer background (different from header)
            SUCCESS: '#28a745',
            WARNING: '#ffc107',
            DANGER: '#dc3545',
            INFO: '#17a2b8'
        };
        
        // FORM VALIDATION RULES
        this.VALIDATION = {
            PASSWORD: {
                MIN_LENGTH: 8,
                MAX_LENGTH: 12,
                REQUIRE_UPPERCASE: true,
                REQUIRE_LOWERCASE: true,
                REQUIRE_NUMBERS: true,
                REQUIRE_SYMBOLS: true
            },
            USERNAME: {
                MIN_LENGTH: 3,
                MAX_LENGTH: 30,
                PATTERN: /^[a-zA-Z0-9_.-]+$/
            },
            EMAIL: {
                PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            PHONE: {
                MIN_LENGTH: 9,
                MAX_LENGTH: 15,
                PATTERN: /^\+?[\d\s\-()]+$/
            },
            NATIONAL_ID: {
                MIN_LENGTH: 5,
                MAX_LENGTH: 20
            }
        };
        
        // PLATFORM OBJECTIVES
        this.OBJECTIVES = [
            'Provide emergency access to small funds',
            'Reduce predatory lending in communities',
            'Monetize via subscriptions only',
            'Enforce hierarchy & isolation',
            'Build group accountability'
        ];
        
        // TARGET USERS
        this.TARGET_USERS = [
            'Individuals with emergency needs',
            'Informal & professional lenders',
            'Churches, families, and social groups',
            'Community lenders',
            'Small business associations'
        ];
        
        // SUCCESS METRICS
        this.SUCCESS_METRICS = {
            REPAYMENT_RATE_TARGET: 0.99, // 99%
            DEFAULT_RATE_TARGET: 0.01,   // 1%
            LENDER_PARTICIPATION_GROWTH: 0.20, // 20% monthly
            GROUP_GROWTH_TARGET: 0.15,   // 15% monthly
            EMERGENCY_ACCESS_IMPROVEMENT: 0.30 // 30% improvement
        };
        
        // PLATFORM FEATURES
        this.FEATURES = {
            DUAL_ROLE_SYSTEM: true,
            REFERRAL_ONLY_GROUPS: true,
            GROUP_INVITATION_SYSTEM: true,
            REPUTATION_SYSTEM: true,
            BLACKLIST_SYSTEM: true,
            DEBT_COLLECTORS_DIRECTORY: true,
            MULTI_COUNTRY_SUPPORT: true,
            PWA_CAPABILITIES: true,
            OFFLINE_MODE: true,
            REAL_TIME_NOTIFICATIONS: true
        };
        
        // ERROR CODES
        this.ERROR_CODES = {
            // Hierarchy violations
            HIERARCHY_001: 'CROSS_COUNTRY_ACCESS_VIOLATION',
            HIERARCHY_002: 'GROUP_CONTEXT_REQUIRED_FOR_LENDING',
            HIERARCHY_003: 'MAX_GROUPS_PER_BORROWER_REACHED',
            
            // Lender errors
            LENDER_001: 'ACTIVE_SUBSCRIPTION_REQUIRED_FOR_LENDING',
            LENDER_002: 'SUBSCRIPTION_EXPIRED_ON_28TH',
            LENDER_003: 'WEEKLY_LENDING_LIMIT_REACHED',
            LENDER_004: 'MAXIMUM_ACTIVE_LEDGERS_REACHED',
            
            // Borrower errors
            BORROWER_001: 'BORROWER_IS_BLACKLISTED',
            BORROWER_002: 'ACTIVE_LOAN_ALREADY_EXISTS_IN_THIS_GROUP',
            BORROWER_003: 'MINIMUM_3_STAR_RATING_REQUIRED_FOR_ADDITIONAL_GROUPS',
            BORROWER_004: 'DEFAULTED_LOANS_EXIST',
            
            // Admin errors
            ADMIN_001: 'ADMIN_PRIVILEGES_REQUIRED',
            ADMIN_002: 'INSUFFICIENT_OVERRIDE_PERMISSIONS',
            
            // Group errors
            GROUP_001: 'NOT_A_MEMBER_OF_THIS_GROUP',
            GROUP_002: 'GROUP_SIZE_LIMIT_1000_REACHED',
            GROUP_003: 'GROUP_ADMIN_PRIVILEGES_REQUIRED'
        };
        
        // CONTACT INFORMATION (Country-specific)
        this.CONTACTS = {
            KE: { phone: '+254 709 219 000', email: 'info@mpesewa.com' },
            UG: { phone: '+256 392 175 546', email: 'info@mpesewa.com' },
            TZ: { phone: '+255 659 073 010', email: 'info@mpesewa.com' },
            RW: { phone: '+250 791 590 801', email: 'info@mpesewa.com' },
            BI: { phone: '+257 79 000 000', email: 'info@mpesewa.com' },
            DRC: { phone: '+243 81 000 0000', email: 'info@mpesewa.com' },
            SS: { phone: '+211 000 000 000', email: 'info@mpesewa.com' },
            SO: { phone: '+252 63 0000000', email: 'info@mpesewa.com' },
            NG: { phone: '+234 800 000 0000', email: 'info@mpesewa.com' },
            GH: { phone: '+233 24 000 0000', email: 'info@mpesewa.com' },
            ZA: { phone: '+27 11 000 0000', email: 'info@mpesewa.com' },
            ET: { phone: '+251 00 000 0000', email: 'info@mpesewa.com' }
        };
        
        // DEBT COLLECTORS (Sample data - should have 200+ in production)
        this.DEBT_COLLECTORS_SAMPLE = [
            { name: 'Alpha Recovery Agency', phone: '+254 700 111 222', location: 'Nairobi, Kenya', country: 'KE' },
            { name: 'Creditor Solutions Ltd', phone: '+256 700 222 333', location: 'Kampala, Uganda', country: 'UG' },
            { name: 'Debt Masters Tanzania', phone: '+255 700 333 444', location: 'Dar es Salaam, Tanzania', country: 'TZ' }
        ];
        
        // TESTIMONIALS
        this.TESTIMONIALS = [
            {
                name: 'Mama Jimmy',
                story: 'Got a loan for gas when gas ended in the middle of cooking and yet they had no money to buy gas that day. Borrowed 1200 and repaid back after 7 days with 10% interest.',
                category: 'Cooking Gas'
            },
            {
                name: 'John Kimani',
                story: 'Was stranded at home because they had no transport money to go for an interview for a job. Lend 250 transport to go for an interview, repaid back after 7 days with 10% interest.',
                category: 'Transport'
            },
            {
                name: 'Pastor Ndungu',
                story: 'Was doing a gig online, they then run out of data, and borrowed 1000 money for data. Repaid back after 7 days with 10% interest.',
                category: 'Data'
            },
            {
                name: 'Ibrahim',
                story: 'Motorbike/bodaboda rider was transporting a passenger to town, when his motorbike ran out of fuel. Borrowed 500, which enabled him to complete his journey. Paid back after 7 days with 10% interest.',
                category: 'Fuel'
            }
        ];
        
        // PLATFORM PURPOSE STATEMENTS
        this.PURPOSE_STATEMENTS = {
            FOR_BORROWERS: [
                'No need to ask for help or favors',
                'Post your loan request in your group and receive offers based on your trust rating',
                'Borrow faster from people who already know and trust you',
                'No favors owed — lending is transparent and voluntary',
                'Fair interest rates agreed willingly by friends and family',
                'One request reaches many lenders when shared within the group',
                'Money when you need it — fast, easy, and affordable'
            ],
            FOR_LENDERS: [
                'Earn passive income from day one',
                'Lend confidently based on borrower ratings and group trust',
                'Start lending with as little as 0.1$',
                'No pressure to lend — you choose who to support',
                'Transparent interest rates you\'re comfortable with',
                'Support people you trust while earning returns',
                'No need to start big — grow at your own pace'
            ]
        };
        
        // INNOVATION COMPARISON (Why M-Pesewa is better)
        this.INNOVATION_POINTS = [
            'Real human trust vs algorithmic scoring',
            'Referral chains reduce default risk dramatically',
            'Specific utility lending prevents misuse',
            'Cross-group flexibility',
            'No debt traps (strict limits, short terms)',
            'Community empowerment',
            'Dual borrower/lender role',
            'Global scalability with local relevance'
        ];
        
        // CALCULATION CONSTANTS
        this.CALCULATIONS = {
            DAYS_IN_WEEK: 7,
            MONTHS_IN_YEAR: 12,
            HOURS_IN_DAY: 24,
            INTEREST_RATE: 0.10,
            PENALTY_RATE: 0.05,
            DEFAULT_DAYS: 60
        };
        
        // STORAGE KEYS
        this.STORAGE_KEYS = {
            USER: 'mpesewa_user',
            COUNTRY: 'mpesewa_country',
            CURRENT_GROUP: 'mpesewa_current_group',
            CURRENT_GROUP_NAME: 'mpesewa_current_group_name',
            AUTH_TOKEN: 'mpesewa_auth_token',
            SESSION_ID: 'mpesewa_session_id',
            BLACKLIST: 'mpesewa_blacklist',
            ERROR_LOGS: 'mpesewa_error_logs',
            AUDIT_LOGS: 'mpesewa_audit_logs',
            EVENT_HISTORY: 'mpesewa_event_history',
            PERMISSION_AUDIT: 'mpesewa_permission_audit',
            TELEMETRY_LOGS: 'mpesewa_telemetry_logs'
        };
        
        // API ENDPOINTS (Placeholder for future backend integration)
        this.API_ENDPOINTS = {
            BASE_URL: 'https://api.mpesewa.com/v1',
            AUTH: {
                LOGIN: '/auth/login',
                REGISTER: '/auth/register',
                LOGOUT: '/auth/logout',
                VERIFY: '/auth/verify'
            },
            LOANS: {
                REQUEST: '/loans/request',
                APPROVE: '/loans/approve',
                REPAY: '/loans/repay',
                HISTORY: '/loans/history'
            },
            LEDGERS: {
                CREATE: '/ledgers/create',
                UPDATE: '/ledgers/update',
                LIST: '/ledgers/list',
                DETAILS: '/ledgers/details'
            },
            SUBSCRIPTIONS: {
                PLANS: '/subscriptions/plans',
                SUBSCRIBE: '/subscriptions/subscribe',
                STATUS: '/subscriptions/status',
                RENEW: '/subscriptions/renew'
            }
        };
        
        // PWA CONFIGURATION
        this.PWA_CONFIG = {
            CACHE_NAME: 'mpesewa-pwa-cache-v1',
            OFFLINE_PAGE: 'offline.html',
            ASSETS_TO_CACHE: [
                '/',
                '/index.html',
                '/manifest.json',
                '/assets/css/main.css',
                '/assets/js/app.js',
                '/assets/images/logo.png'
            ],
            SYNC_TAG: 'mpesewa-sync'
        };
        
        // DATE FORMATS
        this.DATE_FORMATS = {
            DISPLAY: 'DD/MM/YYYY',
            DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
            API: 'YYYY-MM-DD',
            API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ssZ',
            SUBSCRIPTION_EXPIRY: '28th of MMMM YYYY'
        };
        
        // CURRENCY FORMATS
        this.CURRENCY_FORMATS = {
            KE: { symbol: 'KSh', decimal: 2, thousand: ',' },
            UG: { symbol: 'UGX', decimal: 0, thousand: ',' },
            TZ: { symbol: 'TZS', decimal: 0, thousand: ',' },
            RW: { symbol: 'RWF', decimal: 0, thousand: ',' },
            BI: { symbol: 'BIF', decimal: 0, thousand: ',' },
            DRC: { symbol: 'CDF', decimal: 0, thousand: '.' },
            SS: { symbol: 'SSP', decimal: 2, thousand: ',' },
            SO: { symbol: 'SOS', decimal: 0, thousand: ',' },
            NG: { symbol: '₦', decimal: 2, thousand: ',' },
            GH: { symbol: 'GH₵', decimal: 2, thousand: ',' },
            ZA: { symbol: 'R', decimal: 2, thousand: ' ' },
            ET: { symbol: 'Br', decimal: 2, thousand: ',' }
        };
        
        // LOCALIZATION
        this.LANGUAGES = [
            { code: 'en', name: 'English', native: 'English' },
            { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
            { code: 'fr', name: 'French', native: 'Français' }
        ];
    }
    
    // HELPER METHODS
    
    getCountryByCode(code) {
        return this.COUNTRIES.find(country => country.code === code) || null;
    }
    
    getCountryName(code) {
        const country = this.getCountryByCode(code);
        return country ? country.name : 'Unknown Country';
    }
    
    getCurrencySymbol(code) {
        const country = this.getCountryByCode(code);
        return country ? country.currency : '';
    }
    
    getCurrencyFormat(code) {
        return this.CURRENCY_FORMATS[code] || this.CURRENCY_FORMATS.KE;
    }
    
    getContactInfo(countryCode) {
        return this.CONTACTS[countryCode] || this.CONTACTS.KE;
    }
    
    getEmergencyCategory(code) {
        return this.EMERGENCY_CATEGORIES.find(cat => cat.code === code) || null;
    }
    
    getSubscriptionPlan(code) {
        return this.SUBSCRIPTION_PLANS[code.toUpperCase()] || this.SUBSCRIPTION_PLANS.BASIC;
    }
    
    formatCurrency(amount, countryCode) {
        const format = this.getCurrencyFormat(countryCode);
        const symbol = this.getCurrencySymbol(countryCode);
        
        const formattedAmount = amount.toFixed(format.decimal).replace(/\d(?=(\d{3})+\.)/g, '$&' + format.thousand);
        return `${symbol} ${formattedAmount}`;
    }
    
    calculateLoanDetails(principal, days = 7) {
        const interest = principal * this.CALCULATIONS.INTEREST_RATE;
        const total = principal + interest;
        const dailyRepayment = total / days;
        
        return {
            principal,
            interest,
            total,
            dailyRepayment,
            interestRate: this.CALCULATIONS.INTEREST_RATE * 100,
            days
        };
    }
    
    calculatePenalty(principal, overdueDays) {
        const dailyPenalty = principal * this.CALCULATIONS.PENALTY_RATE;
        const totalPenalty = dailyPenalty * overdueDays;
        return {
            dailyPenalty,
            totalPenalty,
            penaltyRate: this.CALCULATIONS.PENALTY_RATE * 100,
            overdueDays
        };
    }
    
    isSubscriptionExpired(expiryDate) {
        const today = new Date();
        const expiry = new Date(expiryDate);
        return today > expiry;
    }
    
    getDaysUntilExpiry(expiryDate) {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    
    // Get all constants as a plain object (for serialization)
    toJSON() {
        return {
            APP_VERSION: this.APP_VERSION,
            APP_NAME: this.APP_NAME,
            HIERARCHY_LEVELS: this.HIERARCHY_LEVELS,
            COUNTRIES: this.COUNTRIES,
            BUSINESS_RULES: this.BUSINESS_RULES,
            SUBSCRIPTION_PLANS: this.SUBSCRIPTION_PLANS,
            EMERGENCY_CATEGORIES: this.EMERGENCY_CATEGORIES,
            USER_ROLES: this.USER_ROLES,
            COLORS: this.COLORS,
            OBJECTIVES: this.OBJECTIVES,
            TARGET_USERS: this.TARGET_USERS,
            FEATURES: this.FEATURES,
            ERROR_CODES: this.ERROR_CODES,
            CALCULATIONS: this.CALCULATIONS
        };
    }
    
    // Validate if a user action is allowed based on hierarchy
    validateHierarchyAction(currentLevel, targetLevel) {
        const levels = Object.values(this.HIERARCHY_LEVELS);
        const currentIndex = levels.indexOf(currentLevel);
        const targetIndex = levels.indexOf(targetLevel);
        
        if (currentIndex === -1 || targetIndex === -1) {
            return { valid: false, reason: 'Invalid hierarchy level' };
        }
        
        // STRICT: Can only move downward in hierarchy (Global → Country → Group → Lender/Borrower)
        if (targetIndex < currentIndex) {
            return { 
                valid: false, 
                reason: `Cannot move from ${currentLevel} to ${targetLevel} in hierarchy` 
            };
        }
        
        return { valid: true };
    }
    
    // Check if cross-country access is attempted
    checkCountryIsolation(userCountry, targetCountry) {
        if (this.BUSINESS_RULES.COUNTRY_ISOLATION && userCountry !== targetCountry) {
            return {
                allowed: false,
                violation: this.ERROR_CODES.HIERARCHY_001,
                message: `Cross-country access from ${userCountry} to ${targetCountry} is prohibited`
            };
        }
        return { allowed: true };
    }
    
    // Get subscription limits for a plan
    getSubscriptionLimits(planCode) {
        const plan = this.getSubscriptionPlan(planCode);
        return plan ? plan.limits : this.SUBSCRIPTION_PLANS.BASIC.limits;
    }
    
    // Check if user has reached group limit
    checkGroupLimit(currentGroups, userRole) {
        if (userRole === this.USER_ROLES.BORROWER) {
            if (currentGroups >= this.BUSINESS_RULES.BORROWER_MAX_GROUPS) {
                return {
                    allowed: false,
                    violation: this.ERROR_CODES.HIERARCHY_003,
                    message: `Borrowers can only join ${this.BUSINESS_RULES.BORROWER_MAX_GROUPS} groups`
                };
            }
        }
        return { allowed: true };
    }
}

// Create global instance
window.mpesewaConstants = new MpesewaConstants();

// Export for module systems
export default MpesewaConstants;