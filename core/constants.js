/**
 * M-PESEWA APPLICATION CONSTANTS
 * All constant values used across the application
 * Strict adherence to business rules and hierarchy
 */

// ============================================
// 1️⃣ HIERARCHY CONSTANTS (NON-NEGOTIABLE)
// ============================================
export const HIERARCHY = {
    // Core hierarchy levels
    LEVELS: {
        GLOBAL: 'global',
        COUNTRY: 'country',
        GROUP: 'group',
        LENDER: 'lender',
        BORROWER: 'borrower',
        LEDGER: 'ledger'
    },
    
    // Hierarchy chain validation
    VALID_CHAIN: ['global', 'country', 'group', 'lender', 'borrower', 'ledger'],
    
    // Maximum nesting depth
    MAX_DEPTH: 6,
    
    // Parent-child relationships
    RELATIONSHIPS: {
        GLOBAL: 'country',
        COUNTRY: 'group',
        GROUP: ['lender', 'borrower'],
        LENDER: 'ledger',
        BORROWER: null,
        LEDGER: null
    }
};

// ============================================
// 2️⃣ COUNTRY CONSTANTS (12 COUNTRIES)
// ============================================
export const COUNTRIES = {
    // Country codes
    CODES: {
        KENYA: 'KE',
        UGANDA: 'UG',
        TANZANIA: 'TZ',
        RWANDA: 'RW',
        BURUNDI: 'BI',
        DRC: 'CD',
        NIGERIA: 'NG',
        GHANA: 'GH',
        SOUTH_SUDAN: 'SS',
        SOMALIA: 'SO',
        SOUTH_AFRICA: 'ZA',
        ETHIOPIA: 'ET'
    },
    
    // Country names
    NAMES: {
        KE: 'Kenya',
        UG: 'Uganda',
        TZ: 'Tanzania',
        RW: 'Rwanda',
        BI: 'Burundi',
        CD: 'DRC',
        NG: 'Nigeria',
        GH: 'Ghana',
        SS: 'South Sudan',
        SO: 'Somalia',
        ZA: 'South Africa',
        ET: 'Ethiopia'
    },
    
    // Currency codes
    CURRENCIES: {
        KE: 'KSh',
        UG: 'UGX',
        TZ: 'TZS',
        RW: 'RWF',
        BI: 'BIF',
        CD: 'CDF',
        NG: 'NGN',
        GH: 'GHS',
        SS: 'SSP',
        SO: 'SOS',
        ZA: 'ZAR',
        ET: 'ETB'
    },
    
    // Phone codes
    PHONE_CODES: {
        KE: '+254',
        UG: '+256',
        TZ: '+255',
        RW: '+250',
        BI: '+257',
        CD: '+243',
        NG: '+234',
        GH: '+233',
        SS: '+211',
        SO: '+252',
        ZA: '+27',
        ET: '+251'
    },
    
    // Flags
    FLAGS: {
        KE: '🇰🇪',
        UG: '🇺🇬',
        TZ: '🇹🇿',
        RW: '🇷🇼',
        BI: '🇧🇮',
        CD: '🇨🇩',
        NG: '🇳🇬',
        GH: '🇬🇭',
        SS: '🇸🇸',
        SO: '🇸🇴',
        ZA: '🇿🇦',
        ET: '🇪🇹'
    },
    
    // Timezones
    TIMEZONES: {
        KE: 'Africa/Nairobi',
        UG: 'Africa/Kampala',
        TZ: 'Africa/Dar_es_Salaam',
        RW: 'Africa/Kigali',
        BI: 'Africa/Bujumbura',
        CD: 'Africa/Kinshasa',
        NG: 'Africa/Lagos',
        GH: 'Africa/Accra',
        SS: 'Africa/Juba',
        SO: 'Africa/Mogadishu',
        ZA: 'Africa/Johannesburg',
        ET: 'Africa/Addis_Ababa'
    },
    
    // Contact information
    CONTACTS: {
        KE: '+254 709 219 000',
        UG: '+256 392 175 546',
        TZ: '+255 659 073 010',
        RW: '+250 791 590 801',
        BI: '+257 79 000 000',
        CD: '+243 81 000 0000',
        NG: '+234 800 000 0000',
        GH: '+233 24 000 0000',
        SS: '+211 955 000 000',
        SO: '+252 63 0000000',
        ZA: '+27 11 000 0000',
        ET: '+251 11 000 0000'
    },
    
    // Legal jurisdiction
    JURISDICTIONS: {
        KE: 'Kenyan Law',
        UG: 'Ugandan Law',
        TZ: 'Tanzanian Law',
        RW: 'Rwandan Law',
        BI: 'Burundian Law',
        CD: 'Congolese Law',
        NG: 'Nigerian Law',
        GH: 'Ghanaian Law',
        SS: 'South Sudanese Law',
        SO: 'Somali Law',
        ZA: 'South African Law',
        ET: 'Ethiopian Law'
    }
};

// ============================================
// 3️⃣ GROUP CONSTANTS
// ============================================
export const GROUPS = {
    // Size limits
    SIZE: {
        MIN_MEMBERS: 5,
        MAX_MEMBERS: 1000,
        MAX_GROUPS_PER_USER: 4
    },
    
    // Types
    TYPES: {
        FAMILY: 'Family',
        CHURCH: 'Church',
        PROFESSIONAL: 'Professional',
        LOCAL: 'Local',
        SOCIAL: 'Social',
        BUSINESS: 'Business',
        COMMUNITY: 'Community'
    },
    
    // Invitation rules
    INVITATION: {
        REQUIRED: true,
        MIN_REFERRALS: 2,
        REFERRAL_CONTACTS_REQUIRED: true
    },
    
    // Membership rules
    MEMBERSHIP: {
        COUNTRY_LOCKED: true,
        NO_CROSS_COUNTRY: true,
        DUAL_ROLE_ALLOWED: true,
        MAX_ACTIVE_LOANS: 1
    },
    
    // Group statuses
    STATUS: {
        ACTIVE: 'active',
        PENDING: 'pending',
        SUSPENDED: 'suspended',
        CLOSED: 'closed'
    }
};

// ============================================
// 4️⃣ LENDER CONSTANTS
// ============================================
export const LENDERS = {
    // Subscription levels
    SUBSCRIPTION_LEVELS: {
        BASIC: 'basic',
        PREMIUM: 'premium',
        SUPER: 'super',
        LENDER_OF_LENDERS: 'lender_of_lenders'
    },
    
    // Subscription level codes
    SUBSCRIPTION_CODES: {
        BASIC: 'BASIC',
        PREMIUM: 'PREMIUM',
        SUPER: 'SUPER',
        LOL: 'LOL'
    },
    
    // Weekly limits per subscription level
    WEEKLY_LIMITS: {
        BASIC: 1500,
        PREMIUM: 5000,
        SUPER: 20000,
        LOL: 50000
    },
    
    // Monthly fees (in local currency)
    MONTHLY_FEES: {
        BASIC: 50,
        PREMIUM: 250,
        SUPER: 1000,
        LOL: 500
    },
    
    // Bi-annual fees
    BIANNUAL_FEES: {
        BASIC: 250,
        PREMIUM: 1500,
        SUPER: 5000,
        LOL: 3500
    },
    
    // Annual fees
    ANNUAL_FEES: {
        BASIC: 500,
        PREMIUM: 2500,
        SUPER: 8500,
        LOL: 6500
    },
    
    // CRB requirements
    CRB_REQUIREMENTS: {
        BASIC: false,
        PREMIUM: false,
        SUPER: true,
        LOL: true
    },
    
    // Ledger limits
    LEDGER_LIMITS: {
        BASIC: 1500,
        PREMIUM: 10000,
        SUPER: 20000,
        LOL: 50000
    },
    
    // Subscription expiry
    SUBSCRIPTION_EXPIRY: {
        DAY_OF_MONTH: 28,
        GRACE_PERIOD_DAYS: 7,
        REMINDER_DAYS_BEFORE: 3
    },
    
    // Lending rules
    RULES: {
        LEND_WITHIN_GROUP_ONLY: true,
        UNLIMITED_LEDGERS: true,
        MINIMUM_LOAN: 0.1, // $0.1 equivalent
        MAXIMUM_LOAN_PER_BORROWER: null // No limit per borrower
    },
    
    // Lender statuses
    STATUS: {
        ACTIVE: 'active',
        SUSPENDED: 'suspended',
        EXPIRED: 'expired',
        BLOCKED: 'blocked'
    }
};

// ============================================
// 5️⃣ BORROWER CONSTANTS
// ============================================
export const BORROWERS = {
    // No subscription fees
    FEES: {
        SUBSCRIPTION: 0,
        REGISTRATION: 0,
        MAINTENANCE: 0
    },
    
    // Loan terms
    LOAN_TERMS: {
        MAX_REPAYMENT_DAYS: 7,
        INTEREST_RATE: 10, // 10%
        DAILY_PENALTY_RATE: 5, // 5% daily after day 7
        DEFAULT_DAYS: 60, // 2 months
        MIN_LOAN_AMOUNT: 5, // As low as 5 KSh equivalent
        PARTIAL_REPAYMENTS_ALLOWED: true
    },
    
    // Rating system
    RATING: {
        MIN: 1,
        MAX: 5,
        DEFAULT: 3,
        
        // Rating thresholds for group access
        THRESHOLDS: {
            EXCELLENT: 4.5, // 4 groups
            GOOD: 3.5,      // 3 groups
            FAIR: 2.5,      // 2 groups
            POOR: 1.5,      // 1 group
            BAD: 1.0        // No new groups
        },
        
        // Rating impact factors
        IMPACT_FACTORS: {
            ON_TIME_REPAYMENT: 0.2,
            EARLY_REPAYMENT: 0.3,
            LATE_REPAYMENT: -0.5,
            DEFAULT: -2.0,
            PARTIAL_REPAYMENT: 0.1
        }
    },
    
    // Borrower statuses
    STATUS: {
        ACTIVE: 'active',
        PENDING: 'pending',
        BLACKLISTED: 'blacklisted',
        RESTRICTED: 'restricted'
    }
};

// ============================================
// 6️⃣ LOAN CONSTANTS
// ============================================
export const LOANS = {
    // Loan categories (20 emergency categories)
    CATEGORIES: {
        FARE: 'fare',
        DATA: 'data',
        GAS: 'gas',
        FOOD: 'food',
        WIFI: 'wifi',
        WATER: 'water',
        ELECTRICITY: 'electricity',
        TV: 'tv',
        FUEL: 'fuel',
        REPAIR: 'repair',
        CREDO: 'credo',
        SALES: 'sales',
        CAPITAL: 'capital',
        SOKO: 'soko',
        KIDANDASKI: 'kidandaski',
        HAWKER: 'hawker',
        FULIZIWA: 'fuliziwa',
        MEDICINE: 'medicine',
        SCHOOL: 'school',
        ADVANCE: 'advance'
    },
    
    // Category names
    CATEGORY_NAMES: {
        fare: 'M-pesewa Fare',
        data: 'M-pesewa Data',
        gas: 'M-pesewa Cooking Gas',
        food: 'M-pesewa Food',
        wifi: 'M-pesewa Wifi',
        water: 'M-pesewa Water Bill',
        electricity: 'M-pesewa Electricity Tokens',
        tv: 'M-pesewa TV Subscription',
        fuel: 'M-pesewa Fuel',
        repair: 'M-pesewa Repair',
        credo: 'M-pesewa Credo',
        sales: 'M-Pesa Daily Sales Advance',
        capital: 'M-Pesa Working Capital Advance',
        soko: 'M-Pesewa Soko Loan',
        kidandaski: 'M-Pesewa Kidandaski Loan',
        hawker: 'M-Pesewa Hawker Loan',
        fuliziwa: 'M-fuliziwa Loan',
        medicine: 'M-pesewa Medicine',
        school: 'M-pesewa School Fees',
        advance: 'M-pesewa Advance'
    },
    
    // Category icons
    CATEGORY_ICONS: {
        fare: '🚌',
        data: '📶',
        gas: '🔥',
        food: '🍲',
        wifi: '📡',
        water: '🚰',
        electricity: '⚡',
        tv: '📺',
        fuel: '⛽',
        repair: '🔧',
        credo: '🛠️',
        sales: '🧾',
        capital: '🏪',
        soko: '🛒',
        kidandaski: '🏗️',
        hawker: '🚶‍♂️',
        fuliziwa: '🔄',
        medicine: '💊',
        school: '🎓',
        advance: '💸'
    },
    
    // Loan statuses
    STATUS: {
        PENDING: 'pending',
        APPROVED: 'approved',
        DISBURSED: 'disbursed',
        ACTIVE: 'active',
        PARTIALLY_REPAID: 'partially_repaid',
        REPAID: 'repaid',
        OVERDUE: 'overdue',
        DEFAULTED: 'defaulted',
        CANCELLED: 'cancelled'
    },
    
    // Repayment statuses
    REPAYMENT_STATUS: {
        PENDING: 'pending',
        PARTIAL: 'partial',
        COMPLETE: 'complete',
        OVERDUE: 'overdue',
        DEFAULTED: 'defaulted'
    },
    
    // Loan calculation constants
    CALCULATION: {
        INTEREST_RATE: 0.10, // 10%
        DAILY_PENALTY_RATE: 0.05, // 5%
        PENALTY_START_DAY: 8, // Day 8
        DEFAULT_START_DAY: 61 // Day 61
    }
};

// ============================================
// 7️⃣ LEDGER CONSTANTS
// ============================================
export const LEDGERS = {
    // Ledger types
    TYPES: {
        ACTIVE_LOAN: 'active_loan',
        REPAYMENT_HISTORY: 'repayment_history',
        PENALTY_RECORD: 'penalty_record'
    },
    
    // Ledger statuses
    STATUS: {
        ACTIVE: 'active',
        CLEARED: 'cleared',
        OVERDUE: 'overdue',
        DEFAULTED: 'defaulted',
        DISPUTED: 'disputed'
    },
    
    // Ledger fields
    FIELDS: {
        REQUIRED: [
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
        ],
        
        OPTIONAL: [
            'penaltyAmount',
            'amountOverdue',
            'daysOverdue',
            'lastRepaymentDate',
            'totalRepaid',
            'notes',
            'attachments'
        ]
    },
    
    // Update frequency
    UPDATE: {
        MANUAL: true,
        ADMIN_OVERRIDE: true,
        REAL_TIME: false
    }
};

// ============================================
// 8️⃣ REPUTATION CONSTANTS
// ============================================
export const REPUTATION = {
    // Blacklist constants
    BLACKLIST: {
        TRIGGER_DAYS: 60, // 2 months
        BADGE_COLOR: '#DC2626',
        BADGE_TEXT: 'BLACKLISTED',
        PUBLIC_VISIBILITY: true,
        
        // Removal conditions
        REMOVAL_CONDITIONS: {
            FULL_REPAYMENT_REQUIRED: true,
            ADMIN_APPROVAL_REQUIRED: true,
            WAITING_PERIOD_DAYS: 30
        }
    },
    
    // Rating constants
    RATING: {
        CALCULATION_METHOD: 'weighted_average',
        DECAY_RATE: 0.1, // 10% decay per month
        MIN_RATINGS_FOR_TRUST: 3
    },
    
    // Trust levels
    TRUST_LEVELS: {
        LEVEL_1: { min: 1.0, max: 1.9, label: 'New', color: '#EF4444' },
        LEVEL_2: { min: 2.0, max: 2.9, label: 'Basic', color: '#F59E0B' },
        LEVEL_3: { min: 3.0, max: 3.9, label: 'Trusted', color: '#10B981' },
        LEVEL_4: { min: 4.0, max: 4.9, label: 'Highly Trusted', color: '#3B82F6' },
        LEVEL_5: { min: 5.0, max: 5.0, label: 'Exceptional', color: '#8B5CF6' }
    }
};

// ============================================
// 9️⃣ ADMIN CONSTANTS
// ============================================
export const ADMIN = {
    // Admin roles
    ROLES: {
        SUPER_ADMIN: 'super_admin',
        COUNTRY_ADMIN: 'country_admin',
        GROUP_ADMIN: 'group_admin',
        SUPPORT: 'support'
    },
    
    // Admin permissions
    PERMISSIONS: {
        // Super admin
        SUPER_ADMIN: [
            'manage_all_countries',
            'manage_all_groups',
            'override_blacklist',
            'edit_any_ledger',
            'moderate_ratings',
            'validate_debt_collectors',
            'system_configuration',
            'user_impersonation'
        ],
        
        // Country admin
        COUNTRY_ADMIN: [
            'manage_country_groups',
            'view_country_reports',
            'manage_country_users',
            'override_country_blacklist',
            'edit_country_ledgers'
        ],
        
        // Group admin (Founder)
        GROUP_ADMIN: [
            'invite_members',
            'remove_members',
            'moderate_group',
            'view_group_reports',
            'set_group_rules'
        ]
    },
    
    // Admin access levels
    ACCESS_LEVELS: {
        READ_ONLY: 'read_only',
        READ_WRITE: 'read_write',
        FULL_ACCESS: 'full_access'
    }
};

// ============================================
// 🔟 DEBT COLLECTORS CONSTANTS
// ============================================
export const DEBT_COLLECTORS = {
    // Collector status
    STATUS: {
        VETTED: 'vetted',
        PENDING: 'pending',
        SUSPENDED: 'suspended',
        BLACKLISTED: 'blacklisted'
    },
    
    // Specializations
    SPECIALIZATIONS: {
        INDIVIDUAL: 'individual',
        SMALL_BUSINESS: 'small_business',
        CORPORATE: 'corporate',
        LEGAL: 'legal',
        NEGOTIATION: 'negotiation'
    },
    
    // Regions
    REGIONS: {
        EAST_AFRICA: 'east_africa',
        WEST_AFRICA: 'west_africa',
        CENTRAL_AFRICA: 'central_africa',
        SOUTHERN_AFRICA: 'southern_africa',
        HORN_OF_AFRICA: 'horn_of_africa'
    },
    
    // Vetting criteria
    VETTING_CRITERIA: {
        MINIMUM_EXPERIENCE_YEARS: 2,
        LEGAL_CLEARANCE_REQUIRED: true,
        REFERENCES_REQUIRED: 3,
        CONTRACT_REQUIRED: true
    }
};

// ============================================
// 1️⃣1️⃣ USER CONSTANTS
// ============================================
export const USERS = {
    // User roles
    ROLES: {
        LENDER: 'lender',
        BORROWER: 'borrower',
        DUAL_ROLE: 'dual_role',
        ADMIN: 'admin'
    },
    
    // User statuses
    STATUS: {
        ACTIVE: 'active',
        PENDING: 'pending',
        SUSPENDED: 'suspended',
        BLOCKED: 'blocked',
        DELETED: 'deleted'
    },
    
    // Verification status
    VERIFICATION: {
        PENDING: 'pending',
        VERIFIED: 'verified',
        REJECTED: 'rejected',
        UNDER_REVIEW: 'under_review'
    },
    
    // Profile completion levels
    PROFILE_COMPLETION: {
        BASIC: 25,
        INTERMEDIATE: 50,
        ADVANCED: 75,
        COMPLETE: 100
    }
};

// ============================================
// 1️⃣2️⃣ PAYMENT CONSTANTS
// ============================================
export const PAYMENTS = {
    // Payment methods
    METHODS: {
        MPESA: 'mpesa',
        TILL: 'till',
        PAYBILL: 'paybill',
        BANK: 'bank',
        MOBILE_MONEY: 'mobile_money',
        CASH: 'cash'
    },
    
    // Payment statuses
    STATUS: {
        PENDING: 'pending',
        PROCESSING: 'processing',
        COMPLETED: 'completed',
        FAILED: 'failed',
        REFUNDED: 'refunded',
        CANCELLED: 'cancelled'
    },
    
    // Payment types
    TYPES: {
        SUBSCRIPTION: 'subscription',
        LOAN_REPAYMENT: 'loan_repayment',
        PENALTY: 'penalty',
        FEE: 'fee',
        REFUND: 'refund'
    },
    
    // Currency conversion rates (example - would come from API)
    CONVERSION_RATES: {
        USD_TO_KES: 150,
        USD_TO_UGX: 3700,
        USD_TO_TZS: 2500,
        USD_TO_RWF: 1300,
        USD_TO_BIF: 2800,
        USD_TO_CDF: 2500,
        USD_TO_NGN: 1500,
        USD_TO_GHS: 12,
        USD_TO_SSP: 1300,
        USD_TO_SOS: 570,
        USD_TO_ZAR: 18,
        USD_TO_ETB: 55
    }
};

// ============================================
// 1️⃣3️⃣ NOTIFICATION CONSTANTS
// ============================================
export const NOTIFICATIONS = {
    // Notification types
    TYPES: {
        LOAN_REQUEST: 'loan_request',
        LOAN_APPROVAL: 'loan_approval',
        LOAN_DISBURSEMENT: 'loan_disbursement',
        REPAYMENT_REMINDER: 'repayment_reminder',
        REPAYMENT_RECEIVED: 'repayment_received',
        SUBSCRIPTION_EXPIRY: 'subscription_expiry',
        GROUP_INVITATION: 'group_invitation',
        RATING_UPDATE: 'rating_update',
        BLACKLIST_UPDATE: 'blacklist_update',
        SYSTEM_ANNOUNCEMENT: 'system_announcement'
    },
    
    // Notification channels
    CHANNELS: {
        EMAIL: 'email',
        SMS: 'sms',
        PUSH: 'push',
        IN_APP: 'in_app'
    },
    
    // Priority levels
    PRIORITY: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        URGENT: 'urgent'
    },
    
    // Delivery status
    DELIVERY_STATUS: {
        PENDING: 'pending',
        SENT: 'sent',
        DELIVERED: 'delivered',
        FAILED: 'failed',
        READ: 'read'
    }
};

// ============================================
// 1️⃣4️⃣ VALIDATION CONSTANTS
// ============================================
export const VALIDATION = {
    // Password requirements
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 12,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBERS: true,
        REQUIRE_SYMBOLS: true,
        
        // Common patterns to reject
        PATTERNS_TO_REJECT: [
            'password',
            '123456',
            'qwerty',
            'admin',
            'welcome',
            'mpesewa'
        ]
    },
    
    // Phone validation
    PHONE: {
        MIN_LENGTH: 9,
        MAX_LENGTH: 15,
        ALLOW_PLUS: true,
        
        // Country-specific formats
        FORMATS: {
            KE: /^\+254[17]\d{8}$/,
            UG: /^\+256[0-9]{9}$/,
            TZ: /^\+255[0-9]{9}$/,
            RW: /^\+250[0-9]{9}$/,
            BI: /^\+257[0-9]{8}$/,
            CD: /^\+243[0-9]{9}$/,
            NG: /^\+234[0-9]{10}$/,
            GH: /^\+233[0-9]{9}$/,
            SS: /^\+211[0-9]{9}$/,
            SO: /^\+252[0-9]{8}$/,
            ZA: /^\+27[0-9]{9}$/,
            ET: /^\+251[0-9]{9}$/
        }
    },
    
    // Email validation
    EMAIL: {
        PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        MAX_LENGTH: 254
    },
    
    // National ID validation
    NATIONAL_ID: {
        MIN_LENGTH: 5,
        MAX_LENGTH: 20,
        
        // Country-specific patterns (examples)
        PATTERNS: {
            KE: /^\d{8}$/, // Kenyan ID: 8 digits
            UG: /^[A-Z]{2}\d{7}[A-Z]$/, // Ugandan ID: 2 letters + 7 digits + 1 letter
            TZ: /^\d{9}$/, // Tanzanian ID: 9 digits
            NG: /^\d{11}$/ // Nigerian NIN: 11 digits
        }
    }
};

// ============================================
// 1️⃣5️⃣ UI CONSTANTS
// ============================================
export const UI = {
    // Color scheme (STRICT - from Section C)
    COLORS: {
        PRIMARY_BLUE: '#003366',
        SECONDARY_BLUE: '#0099ff',
        ACTION_ORANGE: '#f37021',
        TRUST_GREEN: '#28a745',
        NEUTRAL_LIGHT: '#f8f9fa',
        PURE_WHITE: '#ffffff',
        
        // Semantic colors
        SUCCESS: '#10B981',
        WARNING: '#F59E0B',
        ERROR: '#EF4444',
        INFO: '#3B82F6',
        
        // Background colors
        BACKGROUND: '#ffffff',
        CARD_BACKGROUND: '#ffffff',
        HEADER_BACKGROUND: '#003366',
        FOOTER_BACKGROUND: '#1f2a37',
        SIDEBAR_BACKGROUND: '#f8f9fa'
    },
    
    // Typography
    TYPOGRAPHY: {
        FONT_FAMILY: {
            PRIMARY: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
            SECONDARY: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
        },
        
        FONT_SIZES: {
            XS: '0.75rem',    // 12px
            SM: '0.875rem',   // 14px
            BASE: '1rem',     // 16px
            LG: '1.125rem',   // 18px
            XL: '1.25rem',    // 20px
            '2XL': '1.5rem',  // 24px
            '3XL': '1.875rem', // 30px
            '4XL': '2.25rem',  // 36px
            '5XL': '3rem'     // 48px
        },
        
        FONT_WEIGHTS: {
            LIGHT: 300,
            NORMAL: 400,
            MEDIUM: 500,
            SEMIBOLD: 600,
            BOLD: 700
        },
        
        LINE_HEIGHTS: {
            TIGHT: 1.25,
            SNUG: 1.375,
            NORMAL: 1.5,
            RELAXED: 1.625,
            LOOSE: 2
        }
    },
    
    // Spacing
    SPACING: {
        PX: '1px',
        0: '0',
        0.5: '0.125rem',  // 2px
        1: '0.25rem',     // 4px
        1.5: '0.375rem',  // 6px
        2: '0.5rem',      // 8px
        2.5: '0.625rem',  // 10px
        3: '0.75rem',     // 12px
        3.5: '0.875rem',  // 14px
        4: '1rem',        // 16px
        5: '1.25rem',     // 20px
        6: '1.5rem',      // 24px
        7: '1.75rem',     // 28px
        8: '2rem',        // 32px
        9: '2.25rem',     // 36px
        10: '2.5rem',     // 40px
        12: '3rem',       // 48px
        14: '3.5rem',     // 56px
        16: '4rem',       // 64px
        20: '5rem',       // 80px
        24: '6rem',       // 96px
        28: '7rem',       // 112px
        32: '8rem',       // 128px
        36: '9rem',       // 144px
        40: '10rem',      // 160px
        44: '11rem',      // 176px
        48: '12rem',      // 192px
        52: '13rem',      // 208px
        56: '14rem',      // 224px
        60: '15rem',      // 240px
        64: '16rem',      // 256px
        72: '18rem',      // 288px
        80: '20rem',      // 320px
        96: '24rem'       // 384px
    },
    
    // Border radius
    BORDER_RADIUS: {
        NONE: '0',
        SM: '0.125rem',  // 2px
        DEFAULT: '0.25rem', // 4px
        MD: '0.375rem',  // 6px
        LG: '0.5rem',    // 8px
        XL: '0.75rem',   // 12px
        '2XL': '1rem',   // 16px
        '3XL': '1.5rem', // 24px
        FULL: '9999px'
    },
    
    // Shadows
    SHADOWS: {
        SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        
        // Card glow (from Section C)
        CARD_GLOW: '0 0 20px rgba(0, 153, 255, 0.1)'
    },
    
    // Z-index layers
    Z_INDEX: {
        HIDDEN: -1,
        AUTO: 'auto',
        BASE: 0,
        DROPDOWN: 1000,
        STICKY: 1100,
        BANNER: 1200,
        OVERLAY: 1300,
        MODAL: 1400,
        POPOVER: 1500,
        TOOLTIP: 1600,
        NOTIFICATION: 1700
    },
    
    // Breakpoints
    BREAKPOINTS: {
        SM: '640px',
        MD: '768px',
        LG: '1024px',
        XL: '1280px',
        '2XL': '1536px'
    },
    
    // Animation durations
    ANIMATION_DURATIONS: {
        FAST: '150ms',
        NORMAL: '300ms',
        SLOW: '500ms',
        VERY_SLOW: '1000ms'
    },
    
    // Transitions
    TRANSITIONS: {
        EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
        EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
        EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// ============================================
// 1️⃣6️⃣ ERROR CONSTANTS
// ============================================
export const ERRORS = {
    // Error codes
    CODES: {
        // Hierarchy violations
        HIERARCHY_VIOLATION: 'ERR_HIERARCHY_001',
        COUNTRY_ISOLATION: 'ERR_COUNTRY_001',
        GROUP_ISOLATION: 'ERR_GROUP_001',
        
        // Subscription errors
        SUBSCRIPTION_EXPIRED: 'ERR_SUBSCRIPTION_001',
        SUBSCRIPTION_REQUIRED: 'ERR_SUBSCRIPTION_002',
        LIMIT_EXCEEDED: 'ERR_SUBSCRIPTION_003',
        
        // User errors
        BLACKLISTED: 'ERR_USER_001',
        MAX_GROUPS_REACHED: 'ERR_USER_002',
        RATING_TOO_LOW: 'ERR_USER_003',
        VERIFICATION_REQUIRED: 'ERR_USER_004',
        
        // Loan errors
        LOAN_LIMIT_EXCEEDED: 'ERR_LOAN_001',
        ACTIVE_LOAN_EXISTS: 'ERR_LOAN_002',
        DEFAULTED_LOAN: 'ERR_LOAN_003',
        
        // Validation errors
        VALIDATION_FAILED: 'ERR_VALIDATION_001',
        REQUIRED_FIELD: 'ERR_VALIDATION_002',
        INVALID_FORMAT: 'ERR_VALIDATION_003',
        
        // Authentication errors
        UNAUTHORIZED: 'ERR_AUTH_001',
        INVALID_CREDENTIALS: 'ERR_AUTH_002',
        SESSION_EXPIRED: 'ERR_AUTH_003',
        
        // System errors
        NETWORK_ERROR: 'ERR_SYSTEM_001',
        SERVER_ERROR: 'ERR_SYSTEM_002',
        MAINTENANCE: 'ERR_SYSTEM_003',
        
        // Payment errors
        PAYMENT_FAILED: 'ERR_PAYMENT_001',
        INSUFFICIENT_FUNDS: 'ERR_PAYMENT_002',
        PAYMENT_GATEWAY: 'ERR_PAYMENT_003'
    },
    
    // Error messages
    MESSAGES: {
        // Hierarchy violations
        HIERARCHY_VIOLATION: 'Operation violates M-Pesewa hierarchy rules.',
        COUNTRY_ISOLATION: 'Cross-country operations are not allowed.',
        GROUP_ISOLATION: 'Lenders can only lend within their group.',
        
        // Subscription errors
        SUBSCRIPTION_EXPIRED: 'Lender subscription expired. Please renew to continue.',
        SUBSCRIPTION_REQUIRED: 'Subscription required to perform this action.',
        LIMIT_EXCEEDED: 'Amount exceeds your subscription limit.',
        
        // User errors
        BLACKLISTED: 'User is blacklisted and cannot borrow or join new groups.',
        MAX_GROUPS_REACHED: 'Maximum of 4 groups reached. Improve rating to join more.',
        RATING_TOO_LOW: 'Rating too low for this action.',
        VERIFICATION_REQUIRED: 'Account verification required.',
        
        // Loan errors
        LOAN_LIMIT_EXCEEDED: 'Loan amount exceeds your limit.',
        ACTIVE_LOAN_EXISTS: 'You already have an active loan in this group.',
        DEFAULTED_LOAN: 'You have a defaulted loan that must be cleared first.',
        
        // Validation errors
        VALIDATION_FAILED: 'Please check your input and try again.',
        REQUIRED_FIELD: 'This field is required.',
        INVALID_FORMAT: 'Invalid format.',
        
        // Authentication errors
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        INVALID_CREDENTIALS: 'Invalid username or password.',
        SESSION_EXPIRED: 'Your session has expired. Please login again.',
        
        // System errors
        NETWORK_ERROR: 'Network error. Please check your connection.',
        SERVER_ERROR: 'Server error. Please try again later.',
        MAINTENANCE: 'System under maintenance. Please try again later.',
        
        // Payment errors
        PAYMENT_FAILED: 'Payment failed. Please try again.',
        INSUFFICIENT_FUNDS: 'Insufficient funds.',
        PAYMENT_GATEWAY: 'Payment gateway error.'
    },
    
    // Error severity levels
    SEVERITY: {
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        CRITICAL: 'critical'
    }
};

// ============================================
// 1️⃣7️⃣ STORAGE CONSTANTS
// ============================================
export const STORAGE = {
    // Storage keys
    KEYS: {
        // User data
        USER: 'mpesewa_user',
        SESSION: 'mpesewa_session',
        TOKEN: 'mpesewa_token',
        REFRESH_TOKEN: 'mpesewa_refresh_token',
        
        // App state
        COUNTRY: 'mpesewa_country',
        GROUP: 'mpesewa_group',
        ROLE: 'mpesewa_role',
        SUBSCRIPTION: 'mpesewa_subscription',
        
        // Settings
        SETTINGS: 'mpesewa_settings',
        PREFERENCES: 'mpesewa_preferences',
        LANGUAGE: 'mpesewa_language',
        
        // Cache
        CACHE_PREFIX: 'mpesewa_cache_',
        LEDGER_CACHE: 'mpesewa_ledger_cache',
        GROUP_CACHE: 'mpesewa_group_cache',
        USER_CACHE: 'mpesewa_user_cache',
        
        // Offline data
        OFFLINE_QUEUE: 'mpesewa_offline_queue',
        SYNC_QUEUE: 'mpesewa_sync_queue',
        
        // Analytics
        ANALYTICS: 'mpesewa_analytics',
        EVENTS: 'mpesewa_events'
    },
    
    // Storage types
    TYPES: {
        LOCAL_STORAGE: 'localStorage',
        SESSION_STORAGE: 'sessionStorage',
        INDEXED_DB: 'indexedDB',
        COOKIES: 'cookies'
    },
    
    // TTL (Time To Live) in milliseconds
    TTL: {
        SESSION: 24 * 60 * 60 * 1000, // 24 hours
        CACHE_SHORT: 5 * 60 * 1000,   // 5 minutes
        CACHE_MEDIUM: 30 * 60 * 1000, // 30 minutes
        CACHE_LONG: 60 * 60 * 1000,   // 1 hour
        CACHE_VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours
    },
    
    // Storage quotas
    QUOTAS: {
        LOCAL_STORAGE: 5 * 1024 * 1024, // 5MB
        SESSION_STORAGE: 5 * 1024 * 1024, // 5MB
        INDEXED_DB: 50 * 1024 * 1024 // 50MB
    }
};

// ============================================
// 1️⃣8️⃣ API CONSTANTS
// ============================================
export const API = {
    // Base URLs
    BASE_URL: 'https://api.mpesewa.com/v1',
    BASE_URL_DEV: 'https://api.dev.mpesewa.com/v1',
    BASE_URL_LOCAL: 'http://localhost:3000/v1',
    
    // Endpoints
    ENDPOINTS: {
        // Authentication
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            VERIFY: '/auth/verify',
            LOGOUT: '/auth/logout',
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password',
            GOOGLE_LOGIN: '/auth/google',
            REFRESH_TOKEN: '/auth/refresh-token'
        },
        
        // Users
        USERS: {
            PROFILE: '/users/profile',
            UPDATE: '/users/update',
            VERIFICATION: '/users/verification',
            PREFERENCES: '/users/preferences',
            DEVICES: '/users/devices',
            SESSIONS: '/users/sessions',
            DELETE: '/users/delete'
        },
        
        // Lenders
        LENDERS: {
            DASHBOARD: '/lenders/dashboard',
            PORTFOLIO: '/lenders/portfolio',
            HISTORY: '/lenders/history',
            RULES: '/lenders/rules',
            RISK: '/lenders/risk',
            LEDGERS: '/lenders/ledgers',
            SUBSCRIPTION: '/lenders/subscription',
            STATS: '/lenders/stats'
        },
        
        // Borrowers
        BORROWERS: {
            DASHBOARD: '/borrowers/dashboard',
            APPLY: '/borrowers/apply',
            HISTORY: '/borrowers/history',
            REPAYMENTS: '/borrowers/repayments',
            DISPUTES: '/borrowers/disputes',
            RESTRICTIONS: '/borrowers/restrictions',
            RATING: '/borrowers/rating'
        },
        
        // Groups
        GROUPS: {
            LIST: '/groups',
            CREATE: '/groups/create',
            DETAIL: '/groups/:id',
            MEMBERS: '/groups/:id/members',
            INVITE: '/groups/:id/invite',
            SETTINGS: '/groups/:id/settings',
            ADMIN: '/groups/:id/admin',
            REQUESTS: '/groups/:id/requests'
        },
        
        // Loans
        LOANS: {
            APPLY: '/loans/apply',
            APPROVE: '/loans/approve',
            DISBURSE: '/loans/disburse',
            REPAY: '/loans/repay',
            HISTORY: '/loans/history',
            DETAIL: '/loans/:id',
            CALCULATE: '/loans/calculate'
        },
        
        // Ledgers
        LEDGERS: {
            LIST: '/ledgers',
            CREATE: '/ledgers/create',
            UPDATE: '/ledgers/update',
            HISTORY: '/ledgers/history',
            DISPUTES: '/ledgers/disputes',
            AUDIT: '/ledgers/audit',
            FREEZE: '/ledgers/freeze',
            CLOSURE: '/ledgers/closure'
        },
        
        // Subscriptions
        SUBSCRIPTIONS: {
            PLANS: '/subscriptions/plans',
            SUBSCRIBE: '/subscriptions/subscribe',
            STATUS: '/subscriptions/status',
            EXPIRED: '/subscriptions/expired',
            HISTORY: '/subscriptions/history',
            INVOICES: '/subscriptions/invoices',
            RECEIPTS: '/subscriptions/receipts'
        },
        
        // Blacklist
        BLACKLIST: {
            STATUS: '/blacklist/status',
            PUBLIC: '/blacklist/public',
            APPEAL: '/blacklist/appeal',
            HISTORY: '/blacklist/history'
        },
        
        // Debt Collectors
        COLLECTORS: {
            LIST: '/collectors',
            DETAIL: '/collectors/:id',
            SEARCH: '/collectors/search',
            VET: '/collectors/vet'
        },
        
        // Countries
        COUNTRIES: {
            LIST: '/countries',
            DETAIL: '/countries/:code',
            RULES: '/countries/:code/rules',
            CONTACT: '/countries/:code/contact',
            CALCULATOR: '/countries/:code/calculator'
        },
        
        // Emergency Categories
        EMERGENCY: {
            CATEGORIES: '/emergency/categories',
            CATEGORY: '/emergency/categories/:id',
            STATS: '/emergency/stats'
        },
        
        // Admin
        ADMIN: {
            DASHBOARD: '/admin/dashboard',
            USERS: '/admin/users',
            GROUPS: '/admin/groups',
            LEDGERS: '/admin/ledgers',
            BLACKLIST: '/admin/blacklist',
            SUBSCRIPTIONS: '/admin/subscriptions',
            AUDIT: '/admin/audit',
            SETTINGS: '/admin/settings',
            IMPERSONATE: '/admin/impersonate',
            FREEZE: '/admin/freeze',
            SYSTEM_HEALTH: '/admin/system-health'
        },
        
        // Notifications
        NOTIFICATIONS: {
            LIST: '/notifications',
            READ: '/notifications/read',
            DELETE: '/notifications/delete',
            SETTINGS: '/notifications/settings'
        },
        
        // Payments
        PAYMENTS: {
            INITIATE: '/payments/initiate',
            STATUS: '/payments/status',
            HISTORY: '/payments/history',
            RECEIPTS: '/payments/receipts'
        },
        
        // Reports
        REPORTS: {
            GENERATE: '/reports/generate',
            DOWNLOAD: '/reports/download',
            HISTORY: '/reports/history'
        },
        
        // Analytics
        ANALYTICS: {
            TRACK: '/analytics/track',
            EVENTS: '/analytics/events',
            FUNNELS: '/analytics/funnels',
            HEATMAPS: '/analytics/heatmaps',
            PERFORMANCE: '/analytics/performance'
        }
    },
    
    // HTTP methods
    METHODS: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        PATCH: 'PATCH',
        DELETE: 'DELETE',
        HEAD: 'HEAD',
        OPTIONS: 'OPTIONS'
    },
    
    // HTTP status codes
    STATUS_CODES: {
        // Success
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
        
        // Client errors
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        CONFLICT: 409,
        UNPROCESSABLE_ENTITY: 422,
        TOO_MANY_REQUESTS: 429,
        
        // Server errors
        INTERNAL_SERVER_ERROR: 500,
        NOT_IMPLEMENTED: 501,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503,
        GATEWAY_TIMEOUT: 504
    },
    
    // Headers
    HEADERS: {
        CONTENT_TYPE: 'Content-Type',
        AUTHORIZATION: 'Authorization',
        ACCEPT: 'Accept',
        USER_AGENT: 'User-Agent',
        X_API_KEY: 'X-API-Key',
        X_CSRF_TOKEN: 'X-CSRF-Token',
        X_REQUEST_ID: 'X-Request-ID'
    },
    
    // Content types
    CONTENT_TYPES: {
        JSON: 'application/json',
        FORM_URLENCODED: 'application/x-www-form-urlencoded',
        MULTIPART_FORM_DATA: 'multipart/form-data',
        TEXT_PLAIN: 'text/plain',
        TEXT_HTML: 'text/html'
    },
    
    // Timeouts
    TIMEOUTS: {
        DEFAULT: 30000, // 30 seconds
        SHORT: 10000,   // 10 seconds
        LONG: 60000,    // 60 seconds
        UPLOAD: 120000  // 120 seconds
    },
    
    // Retry configuration
    RETRY: {
        MAX_ATTEMPTS: 3,
        DELAY: 1000, // 1 second
        BACKOFF_FACTOR: 2
    }
};

// ============================================
// 1️⃣9️⃣ PWA CONSTANTS
// ============================================
export const PWA = {
    // Service worker
    SERVICE_WORKER: {
        FILE_NAME: 'service-worker.js',
        SCOPE: '/',
        CACHE_NAME: 'mpesewa-pwa-v1',
        
        // Cache strategies
        STRATEGIES: {
            CACHE_FIRST: 'cacheFirst',
            NETWORK_FIRST: 'networkFirst',
            STALE_WHILE_REVALIDATE: 'staleWhileRevalidate',
            NETWORK_ONLY: 'networkOnly',
            CACHE_ONLY: 'cacheOnly'
        }
    },
    
    // Manifest
    MANIFEST: {
        FILE_NAME: 'manifest.json',
        SHORT_NAME: 'M-Pesewa',
        NAME: 'M-Pesewa - Emergency Micro-Lending',
        DESCRIPTION: 'Africa\'s trusted peer-to-peer emergency micro-lending platform',
        THEME_COLOR: '#003366',
        BACKGROUND_COLOR: '#ffffff',
        DISPLAY: 'standalone',
        ORIENTATION: 'portrait',
        
        // Icons
        ICONS: {
            '192': '/assets/images/icons/icon-192x192.png',
            '512': '/assets/images/icons/icon-512x512.png'
        },
        
        // Start URL
        START_URL: '/',
        
        // Scope
        SCOPE: '/'
    },
    
    // Cache
    CACHE: {
        // Assets to cache
        ASSETS: [
            '/',
            '/index.html',
            '/offline.html',
            '/404.html',
            '/manifest.json',
            '/service-worker.js',
            
            // CSS
            '/assets/css/reset.css',
            '/assets/css/colors.css',
            '/assets/css/typography.css',
            '/assets/css/layout.css',
            '/assets/css/navigation.css',
            '/assets/css/header.css',
            '/assets/css/footer.css',
            '/assets/css/components.css',
            '/assets/css/forms.css',
            '/assets/css/cards.css',
            '/assets/css/animations.css',
            '/assets/css/accessibility.css',
            
            // JavaScript
            '/core/app.js',
            '/core/bootstrap.js',
            '/core/config.js',
            '/core/constants.js',
            '/core/env.js',
            '/state/store.js',
            '/router/router.js',
            '/utils/validation.js',
            
            // Fonts
            '/assets/fonts/inter-var.woff2',
            '/assets/fonts/poppins-var.woff2',
            
            // Images
            '/assets/images/favicon.ico',
            '/assets/images/logo.png',
            '/assets/images/icons/icon-192x192.png',
            '/assets/images/icons/icon-512x512.png'
        ],
        
        // API endpoints to cache
        API_ENDPOINTS: [
            '/api/v1/countries',
            '/api/v1/subscriptions/plans',
            '/api/v1/emergency/categories',
            '/api/v1/groups'
        ]
    },
    
    // Sync
    SYNC: {
        TAGS: {
            LEDGER_UPDATE: 'ledger-update',
            REPAYMENT_SYNC: 'repayment-sync',
            PROFILE_SYNC: 'profile-sync',
            GROUP_SYNC: 'group-sync'
        },
        
        // Sync intervals
        INTERVALS: {
            IMMEDIATE: 0,
            SHORT: 5000,     // 5 seconds
            MEDIUM: 30000,   // 30 seconds
            LONG: 300000     // 5 minutes
        }
    },
    
    // Background sync
    BACKGROUND_SYNC: {
        ENABLED: true,
        MAX_RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 5000 // 5 seconds
    },
    
    // Push notifications
    PUSH_NOTIFICATIONS: {
        ENABLED: true,
        VAPID_PUBLIC_KEY: 'YOUR_VAPID_PUBLIC_KEY',
        
        // Notification categories
        CATEGORIES: {
            LOAN: 'loan',
            REPAYMENT: 'repayment',
            SUBSCRIPTION: 'subscription',
            GROUP: 'group',
            SYSTEM: 'system'
        }
    },
    
    // Installation
    INSTALLATION: {
        PROMPT_DELAY: 10000, // 10 seconds
        MINIMUM_VISITS: 2
    },
    
    // Updates
    UPDATES: {
        CHECK_INTERVAL: 3600000, // 1 hour
        PROMPT_DELAY: 5000 // 5 seconds
    }
};

// ============================================
// 2️⃣0️⃣ ANALYTICS CONSTANTS
// ============================================
export const ANALYTICS = {
    // Events
    EVENTS: {
        // Page views
        PAGE_VIEW: 'page_view',
        
        // User events
        USER_REGISTRATION: 'user_registration',
        USER_LOGIN: 'user_login',
        USER_LOGOUT: 'user_logout',
        USER_PROFILE_UPDATE: 'user_profile_update',
        
        // Lender events
        LENDER_REGISTRATION: 'lender_registration',
        LENDER_SUBSCRIPTION: 'lender_subscription',
        LENDER_LENDING: 'lender_lending',
        LENDER_LEDGER_CREATE: 'lender_ledger_create',
        LENDER_LEDGER_UPDATE: 'lender_ledger_update',
        
        // Borrower events
        BORROWER_REGISTRATION: 'borrower_registration',
        BORROWER_LOAN_APPLICATION: 'borrower_loan_application',
        BORROWER_LOAN_REPAYMENT: 'borrower_loan_repayment',
        
        // Group events
        GROUP_CREATE: 'group_create',
        GROUP_JOIN: 'group_join',
        GROUP_INVITE: 'group_invite',
        GROUP_LEAVE: 'group_leave',
        
        // Loan events
        LOAN_APPLICATION: 'loan_application',
        LOAN_APPROVAL: 'loan_approval',
        LOAN_DISBURSEMENT: 'loan_disbursement',
        LOAN_REPAYMENT: 'loan_repayment',
        LOAN_DEFAULT: 'loan_default',
        
        // Subscription events
        SUBSCRIPTION_PURCHASE: 'subscription_purchase',
        SUBSCRIPTION_RENEWAL: 'subscription_renewal',
        SUBSCRIPTION_EXPIRY: 'subscription_expiry',
        SUBSCRIPTION_UPGRADE: 'subscription_upgrade',
        SUBSCRIPTION_DOWNGRADE: 'subscription_downgrade',
        
        // Blacklist events
        BLACKLIST_ADD: 'blacklist_add',
        BLACKLIST_REMOVE: 'blacklist_remove',
        BLACKLIST_APPEAL: 'blacklist_appeal',
        
        // Emergency category events
        EMERGENCY_CATEGORY_VIEW: 'emergency_category_view',
        EMERGENCY_CATEGORY_SELECT: 'emergency_category_select',
        
        // Country events
        COUNTRY_SELECT: 'country_select',
        COUNTRY_SWITCH: 'country_switch',
        
        // Payment events
        PAYMENT_INITIATE: 'payment_initiate',
        PAYMENT_SUCCESS: 'payment_success',
        PAYMENT_FAILURE: 'payment_failure',
        PAYMENT_REFUND: 'payment_refund',
        
        // Search events
        SEARCH: 'search',
        SEARCH_RESULT_CLICK: 'search_result_click',
        
        // Navigation events
        NAVIGATION: 'navigation',
        DROPDOWN_OPEN: 'dropdown_open',
        DROPDOWN_CLOSE: 'dropdown_close',
        
        // Form events
        FORM_START: 'form_start',
        FORM_COMPLETE: 'form_complete',
        FORM_ERROR: 'form_error',
        
        // Button clicks
        BUTTON_CLICK: 'button_click',
        CTA_CLICK: 'cta_click',
        
        // Error events
        ERROR: 'error',
        VALIDATION_ERROR: 'validation_error',
        NETWORK_ERROR: 'network_error',
        
        // Performance events
        PERFORMANCE: 'performance',
        LOAD_TIME: 'load_time',
        RENDER_TIME: 'render_time',
        
        // PWA events
        PWA_INSTALL: 'pwa_install',
        PWA_UPDATE: 'pwa_update',
        OFFLINE_MODE: 'offline_mode',
        ONLINE_MODE: 'online_mode'
    },
    
    // Event parameters
    PARAMETERS: {
        // Common parameters
        USER_ID: 'user_id',
        USER_ROLE: 'user_role',
        USER_COUNTRY: 'user_country',
        USER_RATING: 'user_rating',
        USER_SUBSCRIPTION: 'user_subscription',
        
        // Page parameters
        PAGE_TITLE: 'page_title',
        PAGE_PATH: 'page_path',
        PAGE_REFERRER: 'page_referrer',
        
        // Loan parameters
        LOAN_AMOUNT: 'loan_amount',
        LOAN_CATEGORY: 'loan_category',
        LOAN_INTEREST: 'loan_interest',
        LOAN_DURATION: 'loan_duration',
        
        // Group parameters
        GROUP_ID: 'group_id',
        GROUP_TYPE: 'group_type',
        GROUP_SIZE: 'group_size',
        GROUP_COUNTRY: 'group_country',
        
        // Subscription parameters
        SUBSCRIPTION_LEVEL: 'subscription_level',
        SUBSCRIPTION_AMOUNT: 'subscription_amount',
        SUBSCRIPTION_DURATION: 'subscription_duration',
        
        // Payment parameters
        PAYMENT_METHOD: 'payment_method',
        PAYMENT_AMOUNT: 'payment_amount',
        PAYMENT_CURRENCY: 'payment_currency',
        PAYMENT_STATUS: 'payment_status',
        
        // Error parameters
        ERROR_CODE: 'error_code',
        ERROR_MESSAGE: 'error_message',
        ERROR_STACK: 'error_stack',
        
        // Performance parameters
        LOAD_TIME: 'load_time',
        DOM_CONTENT_LOADED: 'dom_content_loaded',
        TIME_TO_INTERACTIVE: 'time_to_interactive',
        FIRST_CONTENTFUL_PAINT: 'first_contentful_paint',
        LARGEST_CONTENTFUL_PAINT: 'largest_contentful_paint',
        CUMULATIVE_LAYOUT_SHIFT: 'cumulative_layout_shift',
        FIRST_INPUT_DELAY: 'first_input_delay'
    },
    
    // Metrics
    METRICS: {
        // User metrics
        DAILY_ACTIVE_USERS: 'daily_active_users',
        MONTHLY_ACTIVE_USERS: 'monthly_active_users',
        USER_RETENTION: 'user_retention',
        USER_CHURN: 'user_churn',
        
        // Financial metrics
        TOTAL_LOANS: 'total_loans',
        TOTAL_AMOUNT_LENT: 'total_amount_lent',
        AVERAGE_LOAN_SIZE: 'average_loan_size',
        REPAYMENT_RATE: 'repayment_rate',
        DEFAULT_RATE: 'default_rate',
        
        // Group metrics
        TOTAL_GROUPS: 'total_groups',
        AVERAGE_GROUP_SIZE: 'average_group_size',
        GROUP_GROWTH_RATE: 'group_growth_rate',
        
        // Subscription metrics
        TOTAL_SUBSCRIPTIONS: 'total_subscriptions',
        SUBSCRIPTION_RENEWAL_RATE: 'subscription_renewal_rate',
        AVERAGE_REVENUE_PER_USER: 'average_revenue_per_user',
        
        // Platform metrics
        PLATFORM_UPTIME: 'platform_uptime',
        API_SUCCESS_RATE: 'api_success_rate',
        AVERAGE_RESPONSE_TIME: 'average_response_time',
        
        // Country metrics
        USERS_PER_COUNTRY: 'users_per_country',
        LOANS_PER_COUNTRY: 'loans_per_country',
        REPAYMENT_RATE_PER_COUNTRY: 'repayment_rate_per_country'
    },
    
    // Funnels
    FUNNELS: {
        // Registration funnel
        REGISTRATION: [
            'landing_page_view',
            'registration_start',
            'registration_form_complete',
            'email_verification',
            'registration_complete'
        ],
        
        // Lender onboarding funnel
        LENDER_ONBOARDING: [
            'lender_registration_start',
            'subscription_selection',
            'payment_processing',
            'lender_dashboard_view',
            'first_loan_approval'
        ],
        
        // Borrower loan funnel
        BORROWER_LOAN: [
            'loan_application_start',
            'loan_details_entry',
            'lender_selection',
            'loan_approval',
            'loan_disbursement'
        ],
        
        // Group creation funnel
        GROUP_CREATION: [
            'group_creation_start',
            'group_details_entry',
            'member_invitation',
            'group_activation',
            'first_loan_in_group'
        ]
    },
    
    // Goals
    GOALS: {
        // Conversion goals
        USER_REGISTRATION: 'user_registration',
        LENDER_SUBSCRIPTION: 'lender_subscription',
        LOAN_APPLICATION: 'loan_application',
        LOAN_APPROVAL: 'loan_approval',
        LOAN_REPAYMENT: 'loan_repayment',
        
        // Engagement goals
        DAILY_LOGIN: 'daily_login',
        PROFILE_COMPLETION: 'profile_completion',
        GROUP_PARTICIPATION: 'group_participation',
        MULTIPLE_LOANS: 'multiple_loans',
        
        // Retention goals
        USER_RETENTION_7_DAYS: 'user_retention_7_days',
        USER_RETENTION_30_DAYS: 'user_retention_30_days',
        SUBSCRIPTION_RENEWAL: 'subscription_renewal',
        GROUP_RETENTION: 'group_retention'
    }
};

// ============================================
// 2️⃣1️⃣ INTERNATIONALIZATION CONSTANTS
// ============================================
export const I18N = {
    // Supported languages
    LANGUAGES: {
        ENGLISH: 'en',
        SWAHILI: 'sw',
        FRENCH: 'fr',
        ARABIC: 'ar',
        
        // Country-specific languages
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
    
    // Language codes
    LANGUAGE_CODES: {
        en: 'English',
        sw: 'Kiswahili',
        fr: 'Français',
        ar: 'العربية',
        rw: 'Kinyarwanda',
        rn: 'Kirundi',
        so: 'Soomaali',
        af: 'Afrikaans',
        zu: 'Zulu',
        xh: 'Xhosa',
        am: 'አማርኛ'
    },
    
    // Default language
    DEFAULT_LANGUAGE: 'en',
    
    // Fallback language
    FALLBACK_LANGUAGE: 'en',
    
    // Storage key
    STORAGE_KEY: 'mpesewa_language',
    
    // Direction
    DIRECTION: {
        LTR: 'ltr',
        RTL: 'rtl'
    }
};

// ============================================
// 2️⃣2️⃣ SECURITY CONSTANTS
// ============================================
export const SECURITY = {
    // JWT configuration
    JWT: {
        EXPIRY: '24h',
        REFRESH_EXPIRY: '7d',
        ALGORITHM: 'HS256',
        ISSUER: 'M-Pesewa',
        AUDIENCE: 'mpesewa-users'
    },
    
    // Password hashing
    PASSWORD: {
        SALT_ROUNDS: 10,
        ALGORITHM: 'bcrypt',
        MIN_ENTROPY: 60
    },
    
    // Session management
    SESSION: {
        TIMEOUT: 30, // minutes
        MAX_SESSIONS: 5,
        CONCURRENT_SESSIONS: false
    },
    
    // Rate limiting
    RATE_LIMIT: {
        REQUESTS_PER_MINUTE: 60,
        REQUESTS_PER_HOUR: 1000,
        REQUESTS_PER_DAY: 10000
    },
    
    // CSRF protection
    CSRF: {
        ENABLED: true,
        TOKEN_LENGTH: 32,
        HEADER_NAME: 'X-CSRF-Token',
        COOKIE_NAME: 'csrf_token'
    },
    
    // CORS configuration
    CORS: {
        ALLOWED_ORIGINS: [
            'https://mpesewa.com',
            'https://www.mpesewa.com',
            'https://microokoaguarantycapital.github.io'
        ],
        ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
        ALLOW_CREDENTIALS: true,
        MAX_AGE: 86400 // 24 hours
    },
    
    // Content Security Policy
    CSP: {
        DIRECTIVES: {
            DEFAULT_SRC: ["'self'"],
            SCRIPT_SRC: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            STYLE_SRC: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            IMG_SRC: ["'self'", "data:", "https:"],
            FONT_SRC: ["'self'", "https://fonts.gstatic.com"],
            CONNECT_SRC: ["'self'", "https://api.mpesewa.com"],
            FRAME_SRC: ["'none'"],
            OBJECT_SRC: ["'none'"],
            MEDIA_SRC: ["'self'"],
            MANIFEST_SRC: ["'self'"]
        }
    },
    
    // Headers
    HEADERS: {
        STRICT_TRANSPORT_SECURITY: 'max-age=31536000; includeSubDomains; preload',
        X_FRAME_OPTIONS: 'DENY',
        X_CONTENT_TYPE_OPTIONS: 'nosniff',
        X_XSS_PROTECTION: '1; mode=block',
        REFERRER_POLICY: 'strict-origin-when-cross-origin',
        PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation=()',
        CONTENT_SECURITY_POLICY: true
    },
    
    // Input validation
    INPUT_VALIDATION: {
        MAX_LENGTH: {
            USERNAME: 50,
            EMAIL: 254,
            PASSWORD: 100,
            PHONE: 20,
            NATIONAL_ID: 50,
            ADDRESS: 500,
            DESCRIPTION: 2000
        },
        
        SANITIZATION: {
            ALLOWED_TAGS: [],
            ALLOWED_ATTRIBUTES: {},
            ALLOWED_SCHEMES: []
        }
    },
    
    // Audit logging
    AUDIT: {
        ENABLED: true,
        
        // Events to audit
        EVENTS: [
            'user_login',
            'user_logout',
            'user_registration',
            'user_profile_update',
            'loan_application',
            'loan_approval',
            'loan_disbursement',
            'loan_repayment',
            'subscription_purchase',
            'subscription_renewal',
            'group_creation',
            'group_join',
            'group_leave',
            'blacklist_add',
            'blacklist_remove',
            'admin_action',
            'security_event'
        ],
        
        // Retention period (days)
        RETENTION_DAYS: 365
    },
    
    // Device fingerprinting
    DEVICE_FINGERPRINT: {
        ENABLED: true,
        COMPONENTS: [
            'userAgent',
            'language',
            'colorDepth',
            'screenResolution',
            'timezone',
            'sessionStorage',
            'localStorage',
            'indexedDB',
            'platform',
            'doNotTrack',
            'hardwareConcurrency',
            'deviceMemory'
        ]
    },
    
    // Threat detection
    THREAT_DETECTION: {
        ENABLED: true,
        
        // Suspicious patterns
        PATTERNS: {
            RAPID_REQUESTS: 100, // requests per minute
            MULTIPLE_FAILED_LOGINS: 5,
            SUSPICIOUS_USER_AGENT: true,
            UNUSUAL_LOCATION: true,
            UNUSUAL_TIME: true
        },
        
        // Actions on detection
        ACTIONS: {
            WARN: 'warn',
            THROTTLE: 'throttle',
            BLOCK: 'block',
            CAPTCHA: 'captcha'
        }
    }
};

// ============================================
// 2️⃣3️⃣ COMPLIANCE CONSTANTS
// ============================================
export const COMPLIANCE = {
    // GDPR
    GDPR: {
        ENABLED: true,
        
        // User rights
        RIGHTS: {
            RIGHT_TO_ACCESS: true,
            RIGHT_TO_RECTIFICATION: true,
            RIGHT_TO_ERASURE: true,
            RIGHT_TO_RESTRICTION: true,
            RIGHT_TO_DATA_PORTABILITY: true,
            RIGHT_TO_OBJECT: true,
            RIGHT_TO_WITHDRAW_CONSENT: true
        },
        
        // Data retention periods (days)
        RETENTION_PERIODS: {
            USER_DATA: 365,
            FINANCIAL_DATA: 730, // 2 years
            AUDIT_LOGS: 365,
            BACKUP_DATA: 730
        },
        
        // Privacy notices
        NOTICES: {
            COOKIES: true,
            DATA_COLLECTION: true,
            THIRD_PARTY_SHARING: true,
            DATA_PROCESSING: true
        }
    },
    
    // Local regulations
    LOCAL_REGULATIONS: {
        // Country-specific compliance
        BY_COUNTRY: {
            KE: {
                // Central Bank of Kenya regulations
                DATA_LOCALIZATION: true,
                REPORTING_REQUIREMENTS: true,
                INTEREST_RATE_CAPS: true,
                LICENSING_REQUIRED: true
            },
            UG: {
                // Bank of Uganda regulations
                DATA_LOCALIZATION: true,
                REPORTING_REQUIREMENTS: true,
                INTEREST_RATE_REGULATION: true
            },
            TZ: {
                // Bank of Tanzania regulations
                DATA_LOCALIZATION: true,
                REPORTING_REQUIREMENTS: true,
                LICENSING_REQUIRED: true
            },
            RW: {
                // National Bank of Rwanda regulations
                DATA_LOCALIZATION: true,
                REPORTING_REQUIREMENTS: true,
                FINTECH_LICENSE: true
            },
            // Add other countries as needed
        }
    },
    
    // KYC (Know Your Customer)
    KYC: {
        ENABLED: true,
        
        // Verification levels
        LEVELS: {
            BASIC: {
                REQUIREMENTS: ['name', 'phone', 'email'],
                LIMIT: 50000 // Local currency
            },
            INTERMEDIATE: {
                REQUIREMENTS: ['national_id', 'address', 'photo'],
                LIMIT: 500000
            },
            ADVANCED: {
                REQUIREMENTS: ['income_proof', 'bank_statement', 'references'],
                LIMIT: null // No limit
            }
        },
        
        // Document verification
        DOCUMENT_VERIFICATION: {
            ALLOWED_TYPES: ['jpg', 'jpeg', 'png', 'pdf'],
            MAX_SIZE: 5242880, // 5MB
            MIN_RESOLUTION: 300 // DPI
        }
    },
    
    // AML (Anti-Money Laundering)
    AML: {
        ENABLED: true,
        
        // Monitoring rules
        MONITORING: {
            TRANSACTION_THRESHOLD: 1000000, // Local currency
            DAILY_LIMIT: 5000000,
            MONTHLY_LIMIT: 20000000,
            SUSPICIOUS_PATTERNS: true
        },
        
        // Reporting
        REPORTING: {
            SUSPICIOUS_ACTIVITY: true,
            LARGE_TRANSACTIONS: true,
            INTERNATIONAL_TRANSFERS: false // Not applicable
        }
    },
    
    // Consumer protection
    CONSUMER_PROTECTION: {
        ENABLED: true,
        
        // Transparency requirements
        TRANSPARENCY: {
            INTEREST_RATES: true,
            FEES_CHARGES: true,
            TERMS_CONDITIONS: true,
            DISPUTE_RESOLUTION: true
        },
        
        // Fair lending practices
        FAIR_LENDING: {
            NO_DISCRIMINATION: true,
            EQUAL_ACCESS: true,
            RESPONSIBLE_LENDING: true,
            DEBT_COLLECTION_STANDARDS: true
        },
        
        // Complaint handling
        COMPLAINT_HANDLING: {
            GRIEVANCE_REDRESSAL: true,
            ESCALATION_PROCESS: true,
            RESOLUTION_TIMELINE: 30 // days
        }
    },
    
    // Data protection
    DATA_PROTECTION: {
        ENABLED: true,
        
        // Encryption
        ENCRYPTION: {
            IN_TRANSIT: 'TLS 1.3',
            AT_REST: 'AES-256',
            PASSWORD_HASHING: 'bcrypt'
        },
        
        // Access controls
        ACCESS_CONTROLS: {
            ROLE_BASED: true,
            PRINCIPLE_OF_LEAST_PRIVILEGE: true,
            MULTI_FACTOR_AUTHENTICATION: true,
            SESSION_MANAGEMENT: true
        },
        
        // Data minimization
        DATA_MINIMIZATION: {
            COLLECT_ONLY_NECESSARY: true,
            RETENTION_LIMITATION: true,
            PURPOSE_LIMITATION: true
        }
    },
    
    // Regulatory reporting
    REGULATORY_REPORTING: {
        ENABLED: true,
        
        // Reports
        REPORTS: {
            MONTHLY: ['user_stats', 'loan_stats', 'financial_stats'],
            QUARTERLY: ['compliance_report', 'risk_assessment'],
            ANNUAL: ['audit_report', 'financial_statements']
        },
        
        // Regulators
        REGULATORS: {
            KE: ['Central Bank of Kenya', 'Capital Markets Authority'],
            UG: ['Bank of Uganda'],
            TZ: ['Bank of Tanzania'],
            RW: ['National Bank of Rwanda'],
            // Add other countries
        }
    }
};

// ============================================
// 2️⃣4️⃣ EXPORT ALL CONSTANTS
// ============================================
export default {
    HIERARCHY,
    COUNTRIES,
    GROUPS,
    LENDERS,
    BORROWERS,
    LOANS,
    LEDGERS,
    REPUTATION,
    ADMIN,
    DEBT_COLLECTORS,
    USERS,
    PAYMENTS,
    NOTIFICATIONS,
    VALIDATION,
    UI,
    ERRORS,
    STORAGE,
    API,
    PWA,
    ANALYTICS,
    I18N,
    SECURITY,
    COMPLIANCE
};

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HIERARCHY,
        COUNTRIES,
        GROUPS,
        LENDERS,
        BORROWERS,
        LOANS,
        LEDGERS,
        REPUTATION,
        ADMIN,
        DEBT_COLLECTORS,
        USERS,
        PAYMENTS,
        NOTIFICATIONS,
        VALIDATION,
        UI,
        ERRORS,
        STORAGE,
        API,
        PWA,
        ANALYTICS,
        I18N,
        SECURITY,
        COMPLIANCE
    };
}