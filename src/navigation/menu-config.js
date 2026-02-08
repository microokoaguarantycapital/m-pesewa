/**
 * M-Pesewa Navigation Configuration
 * STRICT HIERARCHY: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 * Enforces non-negotiable structural, hierarchy, and access rules
 */

// Brand Configuration
export const BRAND_CONFIG = {
    name: 'M-Pesewa',
    tagline: 'Trusted Circles Lending',
    colors: {
        primary: '#003366',    // Deep Blue
        secondary: '#0099ff',  // Sky Blue
        borrower: '#f37021',   // Action Orange
        lender: '#28a745',     // Trust Green
        neutral: '#f8f9fa',    // Light Background
        white: '#ffffff',      // Pure White
        darkText: '#003366',
        lightText: '#ffffff',
        grayText: '#555555'
    },
    logo: {
        text: 'M-PESEWA',
        tagline: 'Trusted Circles Lending',
        icon: '💰' // Placeholder for actual icon
    }
};

// Country Configuration - 12 Sub-Saharan African Countries
export const COUNTRIES = [
    { 
        code: 'KE', 
        name: 'Kenya', 
        flag: '🇰🇪', 
        currency: 'KSh',
        contact: '+254 709 219 000',
        timezone: 'Africa/Nairobi',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'UG', 
        name: 'Uganda', 
        flag: '🇺🇬', 
        currency: 'UGX',
        contact: '+256 392 175 546',
        timezone: 'Africa/Kampala',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'TZ', 
        name: 'Tanzania', 
        flag: '🇹🇿', 
        currency: 'TZS',
        contact: '+255 659 073 010',
        timezone: 'Africa/Dar_es_Salaam',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'RW', 
        name: 'Rwanda', 
        flag: '🇷🇼', 
        currency: 'RWF',
        contact: '+250 791 590 801',
        timezone: 'Africa/Kigali',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'BI', 
        name: 'Burundi', 
        flag: '🇧🇮', 
        currency: 'BIF',
        contact: '+257 79 000 000',
        timezone: 'Africa/Bujumbura',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'CD', 
        name: 'DRC', 
        flag: '🇨🇩', 
        currency: 'CDF',
        contact: '+243 81 000 0000',
        timezone: 'Africa/Kinshasa',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'NG', 
        name: 'Nigeria', 
        flag: '🇳🇬', 
        currency: 'NGN',
        contact: '+234 800 000 0000',
        timezone: 'Africa/Lagos',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'GH', 
        name: 'Ghana', 
        flag: '🇬🇭', 
        currency: 'GHS',
        contact: '+233 24 000 0000',
        timezone: 'Africa/Accra',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'SS', 
        name: 'South Sudan', 
        flag: '🇸🇸', 
        currency: 'SSP',
        contact: '+211 955 000 000',
        timezone: 'Africa/Juba',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'SO', 
        name: 'Somalia', 
        flag: '🇸🇴', 
        currency: 'SOS',
        contact: '+252 63 0000000',
        timezone: 'Africa/Mogadishu',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'ZA', 
        name: 'South Africa', 
        flag: '🇿🇦', 
        currency: 'ZAR',
        contact: '+27 11 000 0000',
        timezone: 'Africa/Johannesburg',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    },
    { 
        code: 'ET', 
        name: 'Ethiopia', 
        flag: '🇪🇹', 
        currency: 'ETB',
        contact: '+251 11 000 0000',
        timezone: 'Africa/Addis_Ababa',
        rules: { maxGroups: 1000, minGroupMembers: 5, maxGroupMembers: 1000 }
    }
];

// User Roles with Strict Permissions
export const USER_ROLES = {
    GUEST: {
        id: 'guest',
        name: 'Guest',
        permissions: ['view_public', 'view_landing', 'register', 'login'],
        accessLevel: 0
    },
    BORROWER: {
        id: 'borrower',
        name: 'Borrower',
        permissions: [
            'view_borrower_dashboard',
            'apply_loan',
            'view_borrow_history',
            'make_repayment',
            'join_group',
            'view_emergency_hub',
            'borrow_max_4_groups',
            'no_subscription_fee'
        ],
        accessLevel: 1
    },
    LENDER: {
        id: 'lender',
        name: 'Lender',
        permissions: [
            'view_lender_dashboard',
            'create_ledgers',
            'lend_within_group',
            'manage_subscription',
            'rate_borrowers',
            'apply_blacklist',
            'view_portfolio',
            'require_subscription'
        ],
        accessLevel: 2
    },
    GROUP_ADMIN: {
        id: 'group_admin',
        name: 'Group Admin/Founder',
        permissions: [
            'all_lender_permissions',
            'manage_group_members',
            'invite_members',
            'moderate_group',
            'view_group_analytics',
            'set_group_rules'
        ],
        accessLevel: 3
    },
    PLATFORM_ADMIN: {
        id: 'platform_admin',
        name: 'Platform Admin',
        permissions: [
            'all_permissions',
            'override_blacklist',
            'edit_any_ledger',
            'moderate_ratings',
            'validate_collectors',
            'system_configuration',
            'view_all_groups',
            'audit_logs'
        ],
        accessLevel: 10
    }
};

// Subscription Tiers with Limits
export const SUBSCRIPTION_TIERS = {
    BASIC: {
        id: 'basic',
        name: 'Basic',
        maxWeekly: 1500,
        prices: {
            monthly: 50,
            biAnnual: 250,
            annual: 500
        },
        features: ['no_crb_check', 'max_ledgers_1500', 'country_locked'],
        restrictions: ['lending_blocked_on_expiry']
    },
    PREMIUM: {
        id: 'premium',
        name: 'Premium',
        maxWeekly: 5000,
        prices: {
            monthly: 250,
            biAnnual: 1500,
            annual: 2500
        },
        features: ['no_crb_check', 'max_ledgers_10000', 'advanced_analytics'],
        restrictions: ['lending_blocked_on_expiry']
    },
    SUPER: {
        id: 'super',
        name: 'Super',
        maxWeekly: 20000,
        prices: {
            monthly: 1000,
            biAnnual: 5000,
            annual: 8500
        },
        features: ['crb_check_required', 'max_ledgers_20000', 'priority_support'],
        restrictions: ['crb_required', 'lending_blocked_on_expiry']
    },
    LENDER_OF_LENDERS: {
        id: 'lender_of_lenders',
        name: 'Lender of Lenders',
        maxWeekly: 50000,
        prices: {
            monthly: 500,
            biAnnual: 3500,
            annual: 6500
        },
        features: ['crb_check_required', 'custom_terms', 'min_repayment_1_month'],
        restrictions: ['crb_required', 'lending_blocked_on_expiry']
    }
};

// Emergency Categories - 20 Specific Categories
export const EMERGENCY_CATEGORIES = [
    { id: 'fare', icon: '🚌', name: 'M-pesewa Fare', description: 'Move on, don\'t stall—borrow for your journey.' },
    { id: 'data', icon: '📶', name: 'M-pesewa Data', description: 'Stay connected, stay informed—borrow when your bundle runs out.' },
    { id: 'gas', icon: '🔥', name: 'M-pesewa Cooking Gas', description: 'Cook with confidence—borrow when your gas is low.' },
    { id: 'food', icon: '🍲', name: 'M-pesewa Food', description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.' },
    { id: 'wifi', icon: '📡', name: 'M-pesewa Wifi', description: 'Stay connected at home.' },
    { id: 'water', icon: '🚰', name: 'M-pesewa Water Bill', description: 'Stay hydrated—borrow for water needs or bills.' },
    { id: 'electricity', icon: '⚡', name: 'M-pesewa Electricity Tokens', description: 'Stay lit, stay powered—borrow tokens when you need it.' },
    { id: 'tv', icon: '📺', name: 'M-pesewa TV Subscription', description: 'Never miss your favorite shows.' },
    { id: 'fuel', icon: '⛽', name: 'M-pesewa Fuel', description: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk).' },
    { id: 'repair', icon: '🔧', name: 'M-pesewa Repair', description: 'Fix it quick—borrow for minor repairs and keep going.' },
    { id: 'credo', icon: '🛠️', name: 'M-pesewa Credo', description: 'Fix it fast—borrow for urgent repairs or tools.' },
    { id: 'sales', icon: '🧾', name: 'M-Pesa Daily Sales Advance', description: 'Small Loan advance for everyday business.' },
    { id: 'capital', icon: '🏪', name: 'M-Pesa Working Capital Advance', description: 'Working capital when your business needs it.' },
    { id: 'soko', icon: '🛒', name: 'M-Pesewa Soko Loan', description: 'Market money when you need it.' },
    { id: 'kidandaski', icon: '🏗️', name: 'M-Pesewa Kidandaski Loan', description: 'Kibanda/stall money when you need it.' },
    { id: 'hawker', icon: '🚶‍♂️', name: 'M-Pesewa Hawker Loan', description: 'Be Street smart, cash flow all time.' },
    { id: 'fuliziwa', icon: '🔄', name: 'M-fuliziwa Loan', description: 'Your fuliza is not enough? Top up here.' },
    { id: 'medicine', icon: '💊', name: 'M-pesewa Medicine', description: 'Health first—borrow for urgent medicines.' },
    { id: 'school', icon: '🎓', name: 'M-pesewa School Fees', description: 'Secure your future without delay.' },
    { id: 'advance', icon: '💸', name: 'M-pesewa Advance', description: 'Quick cash when you need it most.' }
];

// Menu Structure Configuration
export const MENU_STRUCTURE = {
    GLOBAL: {
        id: 'global',
        name: 'Global',
        items: [
            { id: 'home', name: 'Home', path: '/', icon: '🏠', roles: ['all'] },
            { id: 'about', name: 'About Us', path: '/about.html', icon: 'ℹ️', roles: ['all'] },
            { id: 'how_it_works', name: 'How It Works', path: '/how-it-works.html', icon: '⚙️', roles: ['all'] },
            { id: 'contact', name: 'Contact', path: '/contact.html', icon: '📞', roles: ['all'] }
        ]
    },
    LENDERS: {
        id: 'lenders',
        name: 'Lenders',
        items: [
            { id: 'lender_dashboard', name: 'Dashboard', path: '/lender/dashboard.html', icon: '📊', roles: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'lender_portfolio', name: 'Portfolio', path: '/lender/portfolio.html', icon: '📈', roles: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'lender_history', name: 'History', path: '/lender/history.html', icon: '📜', roles: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'lender_rules', name: 'Rules', path: '/lender/rules.html', icon: '📋', roles: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'lender_risk', name: 'Risk', path: '/lender/risk.html', icon: '⚠️', roles: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] }
        ],
        permissions: ['require_subscription', 'lend_within_group']
    },
    BORROWERS: {
        id: 'borrowers',
        name: 'Borrowers',
        items: [
            { id: 'borrower_dashboard', name: 'Dashboard', path: '/borrower/dashboard.html', icon: '📊', roles: ['BORROWER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'borrower_apply', name: 'Apply for Loan', path: '/borrower/apply.html', icon: '📝', roles: ['BORROWER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'borrower_history', name: 'Borrow History', path: '/borrower/history.html', icon: '📜', roles: ['BORROWER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'borrower_repayments', name: 'Repayments', path: '/borrower/repayments.html', icon: '💰', roles: ['BORROWER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'borrower_disputes', name: 'Disputes', path: '/borrower/disputes.html', icon: '⚖️', roles: ['BORROWER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] }
        ],
        permissions: ['no_subscription_fee', 'borrow_max_4_groups']
    },
    EMERGENCY_HUB: {
        id: 'emergency_hub',
        name: 'Emergency Hub',
        items: EMERGENCY_CATEGORIES.map(cat => ({
            id: cat.id,
            name: cat.name,
            path: `/emergency/${cat.id}.html`,
            icon: cat.icon,
            roles: ['BORROWER', 'LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN']
        })),
        permissions: ['view_emergency_hub']
    },
    SUBSCRIPTION_PLANS: {
        id: 'subscription_plans',
        name: 'Subscription Plans',
        items: [
            { id: 'current_plan', name: 'Current Plan', path: '/subscription/current.html', icon: '📋', roles: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'upgrade', name: 'Upgrade', path: '/subscription/upgrade.html', icon: '⬆️', roles: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'history', name: 'History', path: '/subscription/history.html', icon: '📜', roles: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] },
            { id: 'invoices', name: 'Invoices', path: '/subscription/invoices.html', icon: '🧾', roles: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'] }
        ],
        permissions: ['require_subscription']
    },
    COUNTRIES: {
        id: 'countries',
        name: 'Country',
        items: COUNTRIES.map(country => ({
            id: country.code,
            name: country.name,
            path: `/countries/${country.code.toLowerCase()}.html`,
            icon: country.flag,
            roles: ['all'],
            metadata: country
        })),
        permissions: ['country_isolation']
    },
    ADMIN: {
        id: 'admin',
        name: 'Admin',
        items: [
            { id: 'admin_dashboard', name: 'Dashboard', path: '/admin/dashboard.html', icon: '⚙️', roles: ['PLATFORM_ADMIN'] },
            { id: 'admin_users', name: 'Users', path: '/admin/users.html', icon: '👥', roles: ['PLATFORM_ADMIN'] },
            { id: 'admin_groups', name: 'Groups', path: '/admin/groups.html', icon: '🏢', roles: ['PLATFORM_ADMIN'] },
            { id: 'admin_ledgers', name: 'Ledgers', path: '/admin/ledgers.html', icon: '📒', roles: ['PLATFORM_ADMIN'] },
            { id: 'admin_blacklist', name: 'Blacklist', path: '/admin/blacklist.html', icon: '🚫', roles: ['PLATFORM_ADMIN'] },
            { id: 'admin_subscriptions', name: 'Subscriptions', path: '/admin/subscriptions.html', icon: '💰', roles: ['PLATFORM_ADMIN'] },
            { id: 'admin_audit', name: 'Audit Logs', path: '/admin/audit.html', icon: '📋', roles: ['PLATFORM_ADMIN'] }
        ],
        permissions: ['all_permissions']
    }
};

// Navigation Rules Enforcement
export const NAVIGATION_RULES = {
    // Strict Hierarchy Enforcement
    hierarchy: {
        levels: ['GLOBAL', 'COUNTRY', 'GROUP', 'LENDER/BORROWER', 'LEDGER'],
        rules: {
            countryIsolation: 'NO_CROSS_COUNTRY_OPERATIONS',
            groupIsolation: 'LENDERS_CAN_ONLY_LEND_WITHIN_THEIR_GROUP',
            borrowerLimits: 'MAX_4_GROUPS_WITH_GOOD_RATING',
            subscriptionEnforcement: 'LENDERS_BLOCKED_WHEN_SUBSCRIPTION_EXPIRES',
            adminSupremacy: 'ADMIN_CAN_OVERRIDE_ANY_BLACKLIST_OR_LEDGER'
        }
    },
    
    // Business Rules
    businessRules: {
        loanTerms: {
            duration: '7_DAYS',
            interest: '10_PERCENT',
            penalty: '5_PERCENT_DAILY_AFTER_DAY_7',
            default: 'AFTER_2_MONTHS',
            partialRepayments: 'ALLOWED_DAILY'
        },
        
        subscription: {
            expiryDate: '28TH_OF_EACH_MONTH',
            borrowerFees: 'NO_SUBSCRIPTION_FEES',
            lenderRequirements: 'MUST_SUBSCRIBE_BEFORE_LENDING',
            revenueModel: 'ONLY_FROM_LENDER_SUBSCRIPTIONS'
        },
        
        reputation: {
            ratingSystem: '5_STAR_SYSTEM',
            blacklistRules: {
                trigger: '2_MONTHS_NON_PAYMENT',
                restrictions: ['CANNOT_BORROW', 'CANNOT_JOIN_NEW_GROUPS'],
                removal: 'ONLY_BY_ADMIN_AFTER_FULL_REPAYMENT'
            }
        }
    },
    
    // Access Control Matrix
    accessControl: {
        guest: ['view_public_pages', 'register', 'login'],
        borrower: ['view_emergency_hub', 'apply_loans', 'join_groups', 'view_repayments'],
        lender: ['lend_within_group', 'create_ledgers', 'rate_borrowers', 'manage_subscription'],
        group_admin: ['all_lender_permissions', 'manage_group_members', 'set_group_rules'],
        platform_admin: ['all_permissions', 'override_any_action', 'system_configuration']
    }
};

// Brand Blocks for Consistent UI
export const BRAND_BLOCKS = {
    header: {
        logo: {
            text: 'M-PESEWA',
            tagline: 'Trusted Circles Lending',
            colors: {
                text: '#ffffff',
                background: '#003366'
            }
        },
        navigation: {
            colors: {
                background: '#003366',
                text: '#ffffff',
                hover: '#0099ff',
                active: '#0099ff'
            },
            dropdown: {
                background: '#ffffff',
                text: '#003366',
                hover: '#f8f9fa'
            }
        }
    },
    
    footer: {
        colors: {
            background: '#1f2a37',
            text: '#ffffff',
            links: '#d1d5db',
            hover: '#0099ff'
        },
        structure: {
            columns: 6,
            sections: ['Borrowing', 'Lending', 'How It Works', 'About Us', 'Legal & Compliance', 'Partnerships']
        }
    },
    
    buttons: {
        borrower: {
            background: '#f37021',
            text: '#ffffff',
            hover: '#e05a0c'
        },
        lender: {
            background: '#28a745',
            text: '#ffffff',
            hover: '#218838'
        },
        secondary: {
            background: '#0099ff',
            text: '#ffffff',
            hover: '#007acc'
        },
        outline: {
            background: 'transparent',
            text: '#003366',
            border: '#003366',
            hover: '#003366',
            hoverText: '#ffffff'
        }
    },
    
    cards: {
        floating: {
            background: '#ffffff',
            text: '#003366',
            shadow: '0 4px 20px rgba(0, 153, 255, 0.15)',
            glow: '0 0 20px rgba(0, 153, 255, 0.1)'
        },
        emergency: {
            background: '#ffffff',
            text: '#003366',
            iconSize: '2rem',
            hover: 'transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0, 153, 255, 0.2);'
        }
    },
    
    sections: {
        hero: {
            background: '#ffffff',
            text: '#003366'
        },
        problem: {
            background: '#ffffff',
            text: '#003366',
            cardBackground: '#ffffff'
        },
        solution: {
            background: '#f8f9fa',
            text: '#003366'
        },
        trust: {
            background: '#003366',
            text: '#ffffff',
            success: '#28a745'
        }
    }
};

// Validation Rules for User Input
export const VALIDATION_RULES = {
    userRegistration: {
        fullName: { required: true, minLength: 3, maxLength: 100 },
        nationalId: { required: true, pattern: /^[A-Z0-9]{6,20}$/ },
        phoneNumber: { required: true, pattern: /^\+?[1-9]\d{9,14}$/ },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { 
            required: true, 
            minLength: 8, 
            maxLength: 12,
            rules: ['uppercase', 'lowercase', 'numbers', 'symbols']
        },
        username: { required: true, minLength: 3, maxLength: 30, unique: true }
    },
    
    loanApplication: {
        amount: { required: true, min: 5, maxByTier: true },
        category: { required: true, validCategories: EMERGENCY_CATEGORIES.map(c => c.id) },
        groupId: { required: true },
        lenderId: { required: true },
        repaymentPeriod: { default: 7, max: 7 }
    },
    
    ledgerCreation: {
        borrowerName: { required: true },
        borrowerContact: { required: true },
        guarantors: { required: true, count: 2 },
        amount: { required: true },
        interest: { default: 10 },
        penaltyRate: { default: 5 }
    }
};

// Export Configuration for All Modules
export default {
    BRAND_CONFIG,
    COUNTRIES,
    USER_ROLES,
    SUBSCRIPTION_TIERS,
    EMERGENCY_CATEGORIES,
    MENU_STRUCTURE,
    NAVIGATION_RULES,
    BRAND_BLOCKS,
    VALIDATION_RULES
};