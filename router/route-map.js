/**
 * M-PESEWA ROUTES CONFIGURATION
 * Defines all routes in the application with their configurations
 * Strict hierarchy: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 */

const routes = {
    // ============================================
    // PUBLIC ROUTES (No authentication required)
    // ============================================
    
    '/': {
        title: 'Emergency Micro-Lending Platform',
        component: 'pages/home.html',
        meta: {
            description: 'M-Pesewa: Africa\'s trusted peer-to-peer emergency micro-lending platform. Friends lend to friends in trusted groups.',
            keywords: 'emergency loans, micro-lending, peer-to-peer, Africa, trusted circles'
        },
        guard: ['offline'],
        priority: 1
    },
    
    '/auth/login': {
        title: 'Sign In',
        component: 'auth/login.html',
        meta: {
            description: 'Sign in to your M-Pesewa account to access emergency loans or start lending',
            keywords: 'login, sign in, authentication'
        },
        guard: ['device'],
        priority: 1
    },
    
    '/auth/register': {
        title: 'Sign Up',
        component: 'auth/register.html',
        meta: {
            description: 'Create your M-Pesewa account as a borrower or lender',
            keywords: 'sign up, register, create account'
        },
        guard: ['device'],
        priority: 1
    },
    
    '/auth/forgot': {
        title: 'Forgot Password',
        component: 'auth/forgot.html',
        meta: {
            description: 'Reset your M-Pesewa account password',
            keywords: 'password reset, forgot password'
        },
        guard: ['device'],
        priority: 2
    },
    
    '/auth/reset': {
        title: 'Reset Password',
        component: 'auth/reset.html',
        meta: {
            description: 'Set your new password',
            keywords: 'password reset, new password'
        },
        guard: ['device'],
        priority: 2
    },
    
    '/about': {
        title: 'About M-Pesewa',
        component: 'global-pages/about.html',
        meta: {
            description: 'Learn about M-Pesewa\'s mission to provide emergency micro-lending in trusted circles across Africa',
            keywords: 'about us, mission, vision, values'
        },
        guard: ['offline'],
        priority: 2
    },
    
    '/how-it-works': {
        title: 'How It Works',
        component: 'global-pages/how-it-works.html',
        meta: {
            description: 'Learn how M-Pesewa connects borrowers and lenders in trusted groups',
            keywords: 'how it works, process, steps'
        },
        guard: ['offline'],
        priority: 2
    },
    
    '/faq': {
        title: 'Frequently Asked Questions',
        component: 'global-pages/faq.html',
        meta: {
            description: 'Find answers to common questions about M-Pesewa',
            keywords: 'FAQ, questions, answers, help'
        },
        guard: ['offline'],
        priority: 2
    },
    
    '/terms': {
        title: 'Terms & Conditions',
        component: 'global-pages/terms.html',
        meta: {
            description: 'M-Pesewa Terms and Conditions',
            keywords: 'terms, conditions, legal'
        },
        guard: ['offline'],
        priority: 3
    },
    
    '/privacy': {
        title: 'Privacy Policy',
        component: 'global-pages/privacy.html',
        meta: {
            description: 'M-Pesewa Privacy Policy',
            keywords: 'privacy, policy, data protection'
        },
        guard: ['offline'],
        priority: 3
    },
    
    '/contact': {
        title: 'Contact Us',
        component: 'global-pages/contact.html',
        meta: {
            description: 'Contact M-Pesewa support team',
            keywords: 'contact, support, help'
        },
        guard: ['offline'],
        priority: 2
    },
    
    '/collectors': {
        title: 'Debt Collectors',
        component: 'global-pages/collectors.html',
        meta: {
            description: 'List of vetted debt collectors across Africa',
            keywords: 'debt collectors, recovery, collection'
        },
        guard: ['auth', 'blacklist'],
        priority: 3
    },
    
    // ============================================
    // COUNTRY ROUTES (Country-specific access)
    // ============================================
    
    '/countries': {
        title: 'Select Country',
        component: 'countries/index.html',
        meta: {
            description: 'Select your country to access M-Pesewa services',
            keywords: 'country selection, regions, Africa'
        },
        guard: ['auth', 'country'],
        priority: 1
    },
    
    '/countries/kenya': {
        title: 'Kenya',
        component: 'countries/ke/index.html',
        meta: {
            description: 'M-Pesewa Kenya - Emergency micro-lending in Kenyan Shillings (KES)',
            keywords: 'Kenya, KES, Nairobi, M-Pesa'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/uganda': {
        title: 'Uganda',
        component: 'countries/ug/index.html',
        meta: {
            description: 'M-Pesewa Uganda - Emergency micro-lending in Ugandan Shillings (UGX)',
            keywords: 'Uganda, UGX, Kampala'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/tanzania': {
        title: 'Tanzania',
        component: 'countries/tz/index.html',
        meta: {
            description: 'M-Pesewa Tanzania - Emergency micro-lending in Tanzanian Shillings (TZS)',
            keywords: 'Tanzania, TZS, Dar es Salaam'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/rwanda': {
        title: 'Rwanda',
        component: 'countries/rw/index.html',
        meta: {
            description: 'M-Pesewa Rwanda - Emergency micro-lending in Rwandan Francs (RWF)',
            keywords: 'Rwanda, RWF, Kigali'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/drc': {
        title: 'DR Congo',
        component: 'countries/drc/index.html',
        meta: {
            description: 'M-Pesewa DRC - Emergency micro-lending in Congolese Francs (CDF)',
            keywords: 'DRC, Congo, CDF, Kinshasa'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/burundi': {
        title: 'Burundi',
        component: 'countries/bi/index.html',
        meta: {
            description: 'M-Pesewa Burundi - Emergency micro-lending in Burundian Francs (BIF)',
            keywords: 'Burundi, BIF, Bujumbura'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/nigeria': {
        title: 'Nigeria',
        component: 'countries/ng/index.html',
        meta: {
            description: 'M-Pesewa Nigeria - Emergency micro-lending in Nigerian Naira (NGN)',
            keywords: 'Nigeria, NGN, Lagos, Abuja'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/ghana': {
        title: 'Ghana',
        component: 'countries/gh/index.html',
        meta: {
            description: 'M-Pesewa Ghana - Emergency micro-lending in Ghanaian Cedis (GHS)',
            keywords: 'Ghana, GHS, Accra'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/south-sudan': {
        title: 'South Sudan',
        component: 'countries/ss/index.html',
        meta: {
            description: 'M-Pesewa South Sudan - Emergency micro-lending in South Sudanese Pound (SSP)',
            keywords: 'South Sudan, SSP, Juba'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/somalia': {
        title: 'Somalia',
        component: 'countries/so/index.html',
        meta: {
            description: 'M-Pesewa Somalia - Emergency micro-lending in Somali Shilling (SOS)',
            keywords: 'Somalia, SOS, Mogadishu'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/south-africa': {
        title: 'South Africa',
        component: 'countries/za/index.html',
        meta: {
            description: 'M-Pesewa South Africa - Emergency micro-lending in South African Rand (ZAR)',
            keywords: 'South Africa, ZAR, Johannesburg, Cape Town'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    '/countries/ethiopia': {
        title: 'Ethiopia',
        component: 'countries/et/index.html',
        meta: {
            description: 'M-Pesewa Ethiopia - Emergency micro-lending in Ethiopian Birr (ETB)',
            keywords: 'Ethiopia, ETB, Addis Ababa'
        },
        guard: ['auth', 'country'],
        resolver: 'country',
        priority: 1
    },
    
    // ============================================
    // GROUP ROUTES (Group-specific access)
    // ============================================
    
    '/groups': {
        title: 'My Groups',
        component: 'groups/pages/group-list.html',
        meta: {
            description: 'Manage your trusted lending groups',
            keywords: 'groups, circles, communities'
        },
        guard: ['auth', 'country', 'group'],
        priority: 1
    },
    
    '/groups/create': {
        title: 'Create Group',
        component: 'groups/pages/group-create.html',
        meta: {
            description: 'Create a new trusted lending group',
            keywords: 'create group, new group'
        },
        guard: ['auth', 'country'],
        priority: 2
    },
    
    '/groups/:groupId': {
        title: (data) => `Group: ${data.groupName || 'Dashboard'}`,
        component: 'groups/pages/group-dashboard.html',
        meta: {
            description: 'Group dashboard for managing members and loans',
            keywords: 'group dashboard, members, management'
        },
        guard: ['auth', 'country', 'group'],
        resolver: 'group',
        priority: 1
    },
    
    '/groups/:groupId/members': {
        title: 'Group Members',
        component: 'groups/pages/group-members.html',
        meta: {
            description: 'View and manage group members',
            keywords: 'members, participants, group members'
        },
        guard: ['auth', 'country', 'group'],
        resolver: 'group',
        priority: 2
    },
    
    '/groups/:groupId/settings': {
        title: 'Group Settings',
        component: 'groups/pages/group-settings.html',
        meta: {
            description: 'Configure group settings and rules',
            keywords: 'settings, configuration, rules'
        },
        guard: ['auth', 'country', 'group'],
        resolver: 'group',
        priority: 3
    },
    
    // ============================================
    // BORROWER ROUTES (Borrower-specific access)
    // ============================================
    
    '/borrower': {
        title: 'Borrower Dashboard',
        component: 'borrower/pages/borrower-dashboard.html',
        meta: {
            description: 'Borrower dashboard for managing emergency loans',
            keywords: 'borrower, dashboard, loans'
        },
        guard: ['auth', 'role', 'country', 'group', 'blacklist'],
        resolver: 'borrower',
        priority: 1
    },
    
    '/borrower/apply': {
        title: 'Apply for Loan',
        component: 'borrower/pages/borrow-request.html',
        meta: {
            description: 'Apply for an emergency loan in your trusted group',
            keywords: 'apply loan, request loan, emergency loan'
        },
        guard: ['auth', 'role', 'country', 'group', 'blacklist'],
        resolver: 'borrower',
        priority: 1
    },
    
    '/borrower/history': {
        title: 'Borrow History',
        component: 'borrower/pages/borrow-history.html',
        meta: {
            description: 'View your loan borrowing history',
            keywords: 'history, past loans, records'
        },
        guard: ['auth', 'role', 'country', 'group'],
        resolver: 'borrower',
        priority: 2
    },
    
    '/borrower/repayments': {
        title: 'Repayments',
        component: 'borrower/pages/borrow-repayments.html',
        meta: {
            description: 'Manage your loan repayments',
            keywords: 'repayments, payments, settle'
        },
        guard: ['auth', 'role', 'country', 'group'],
        resolver: 'borrower',
        priority: 2
    },
    
    '/borrower/disputes': {
        title: 'Disputes',
        component: 'borrower/pages/borrow-disputes.html',
        meta: {
            description: 'Manage loan disputes and issues',
            keywords: 'disputes, issues, problems'
        },
        guard: ['auth', 'role', 'country', 'group'],
        resolver: 'borrower',
        priority: 3
    },
    
    // ============================================
    // LENDER ROUTES (Lender-specific access)
    // ============================================
    
    '/lender': {
        title: 'Lender Dashboard',
        component: 'lender/pages/lender-dashboard.html',
        meta: {
            description: 'Lender dashboard for managing loans and portfolios',
            keywords: 'lender, dashboard, portfolio'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'lender',
        priority: 1
    },
    
    '/lender/portfolio': {
        title: 'Lending Portfolio',
        component: 'lender/pages/lending-portfolio.html',
        meta: {
            description: 'View and manage your lending portfolio',
            keywords: 'portfolio, investments, loans'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'lender',
        priority: 1
    },
    
    '/lender/history': {
        title: 'Lending History',
        component: 'lender/pages/lending-history.html',
        meta: {
            description: 'View your lending history and performance',
            keywords: 'history, performance, records'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'lender',
        priority: 2
    },
    
    '/lender/requests': {
        title: 'Loan Requests',
        component: 'lender/pages/lending-requests.html',
        meta: {
            description: 'Review and approve loan requests from borrowers',
            keywords: 'requests, approvals, new loans'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'lender',
        priority: 1
    },
    
    '/lender/rules': {
        title: 'Lending Rules',
        component: 'lender/pages/lending-rules.html',
        meta: {
            description: 'View platform lending rules and guidelines',
            keywords: 'rules, guidelines, policies'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'lender',
        priority: 3
    },
    
    '/lender/risk': {
        title: 'Risk Management',
        component: 'lender/pages/lending-risk.html',
        meta: {
            description: 'Manage lending risks and view risk assessments',
            keywords: 'risk, management, assessment'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'lender',
        priority: 3
    },
    
    // ============================================
    // LEDGER ROUTES (Loan-specific management)
    // ============================================
    
    '/ledger': {
        title: 'My Ledgers',
        component: 'ledger/pages/ledger-list.html',
        meta: {
            description: 'Manage your loan ledgers',
            keywords: 'ledgers, records, accounts'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'ledger',
        priority: 1
    },
    
    '/ledger/:ledgerId': {
        title: (data) => `Ledger: ${data.borrowerName || 'View'}`,
        component: 'ledger/pages/ledger-view.html',
        meta: {
            description: 'View and manage loan ledger details',
            keywords: 'ledger details, loan details'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'ledger',
        priority: 1
    },
    
    '/ledger/:ledgerId/update': {
        title: 'Update Ledger',
        component: 'ledger/pages/ledger-update.html',
        meta: {
            description: 'Update loan ledger with repayments and status',
            keywords: 'update ledger, record payment'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'ledger',
        priority: 2
    },
    
    '/ledger/:ledgerId/history': {
        title: 'Ledger History',
        component: 'ledger/pages/ledger-history.html',
        meta: {
            description: 'View transaction history for this ledger',
            keywords: 'transaction history, audit trail'
        },
        guard: ['auth', 'role', 'country', 'group', 'subscription'],
        resolver: 'ledger',
        priority: 2
    },
    
    // ============================================
    // SUBSCRIPTION ROUTES (Lender subscription management)
    // ============================================
    
    '/subscription': {
        title: 'Subscription Plans',
        component: 'subscription/plans.html',
        meta: {
            description: 'Choose your lending subscription plan',
            keywords: 'subscription, plans, pricing'
        },
        guard: ['auth', 'role'],
        priority: 1
    },
    
    '/subscription/current': {
        title: 'Current Plan',
        component: 'subscription/status.html',
        meta: {
            description: 'View your current subscription plan details',
            keywords: 'current plan, status, details'
        },
        guard: ['auth', 'role'],
        priority: 1
    },
    
    '/subscription/upgrade': {
        title: 'Upgrade Plan',
        component: 'subscription/subscribe.html',
        meta: {
            description: 'Upgrade your lending subscription plan',
            keywords: 'upgrade, change plan, higher tier'
        },
        guard: ['auth', 'role'],
        priority: 1
    },
    
    '/subscription/history': {
        title: 'Subscription History',
        component: 'subscription/history.html',
        meta: {
            description: 'View your subscription payment history',
            keywords: 'history, payments, invoices'
        },
        guard: ['auth', 'role'],
        priority: 2
    },
    
    '/subscription/expired': {
        title: 'Subscription Expired',
        component: 'subscription/expired.html',
        meta: {
            description: 'Your subscription has expired. Please renew to continue lending.',
            keywords: 'expired, renewal, payment due'
        },
        guard: ['auth', 'role'],
        priority: 1
    },
    
    // ============================================
    // BLACKLIST ROUTES (Defaulters management)
    // ============================================
    
    '/blacklist': {
        title: 'Blacklist Registry',
        component: 'blacklist/pages/blacklist-public.html',
        meta: {
            description: 'Public registry of blacklisted borrowers',
            keywords: 'blacklist, defaulters, registry'
        },
        guard: ['auth'],
        priority: 2
    },
    
    '/blacklist/status': {
        title: 'Blacklist Status',
        component: 'blacklist/pages/blacklist-status.html',
        meta: {
            description: 'Check your blacklist status and appeals',
            keywords: 'status, appeal, clearance'
        },
        guard: ['auth'],
        priority: 1
    },
    
    '/blacklist/appeal': {
        title: 'Appeal Blacklist',
        component: 'blacklist/pages/blacklist-appeal.html',
        meta: {
            description: 'Submit an appeal for blacklist removal',
            keywords: 'appeal, removal, clearance'
        },
        guard: ['auth'],
        priority: 2
    },
    
    // ============================================
    // EMERGENCY HUB ROUTES (20 emergency categories)
    // ============================================
    
    '/emergency': {
        title: 'Emergency Hub',
        component: 'emergency/index.html',
        meta: {
            description: 'Browse 20 emergency loan categories',
            keywords: 'emergency, categories, loan types'
        },
        guard: ['auth'],
        priority: 1
    },
    
    '/emergency/fare': {
        title: 'Transport Fare',
        component: 'emergency/fare.html',
        meta: {
            description: 'Emergency loan for transport fare',
            keywords: 'fare, transport, travel'
        },
        guard: ['auth', 'role', 'country', 'group'],
        priority: 1
    },
    
    '/emergency/data': {
        title: 'Mobile Data',
        component: 'emergency/data.html',
        meta: {
            description: 'Emergency loan for mobile data bundles',
            keywords: 'data, internet, bundles'
        },
        guard: ['auth', 'role', 'country', 'group'],
        priority: 1
    },
    
    '/emergency/gas': {
        title: 'Cooking Gas',
        component: 'emergency/gas.html',
        meta: {
            description: 'Emergency loan for cooking gas',
            keywords: 'gas, cooking, fuel'
        },
        guard: ['auth', 'role', 'country', 'group'],
        priority: 1
    },
    
    '/emergency/food': {
        title: 'Food',
        component: 'emergency/food.html',
        meta: {
            description: 'Emergency loan for food',
            keywords: 'food, groceries, meals'
        },
        guard: ['auth', 'role', 'country', 'group'],
        priority: 1
    },
    
    '/emergency/water': {
        title: 'Water Bill',
        component: 'emergency/water.html',
        meta: {
            description: 'Emergency loan for water bills',
            keywords: 'water, bill, utility'
        },
        guard: ['auth', 'role', 'country', 'group'],
        priority: 1
    },
    
    '/emergency/electricity': {
        title: 'Electricity',
        component: 'emergency/electricity.html',
        meta: {
            description: 'Emergency loan for electricity tokens',
            keywords: 'electricity, power, tokens'
        },
        guard: ['auth', 'role', 'country', 'group'],
        priority: 1
    },
    
    '/emergency/fuel': {
        title: 'Fuel',
        component: 'emergency/fuel.html',
        meta: {
            description: 'Emergency loan for vehicle fuel',
            keywords: 'fuel, petrol, diesel'
        },
        guard: ['auth', 'role', 'country', 'group'],
        priority: 1
    },
    
    '/emergency/medicine': {
        title: 'Medicine',
        component: 'emergency/medicine.html',
        meta: {
            description: 'Emergency loan for medicine',
            keywords: 'medicine, healthcare, drugs'
        },
        guard: ['auth', 'role', 'country', 'group'],
        priority: 1
    },
    
    // ============================================
    // ADMIN ROUTES (Platform administration)
    // ============================================
    
    '/admin': {
        title: 'Admin Dashboard',
        component: 'admin/admin-dashboard.html',
        meta: {
            description: 'Platform administration dashboard',
            keywords: 'admin, dashboard, management'
        },
        guard: ['auth', 'admin'],
        priority: 1
    },
    
    '/admin/users': {
        title: 'User Management',
        component: 'admin/admin-users.html',
        meta: {
            description: 'Manage platform users and accounts',
            keywords: 'users, management, accounts'
        },
        guard: ['auth', 'admin'],
        priority: 2
    },
    
    '/admin/groups': {
        title: 'Group Management',
        component: 'admin/admin-groups.html',
        meta: {
            description: 'Manage lending groups across countries',
            keywords: 'groups, management, oversight'
        },
        guard: ['auth', 'admin'],
        priority: 2
    },
    
    '/admin/ledgers': {
        title: 'Ledger Management',
        component: 'admin/admin-ledgers.html',
        meta: {
            description: 'Manage and audit loan ledgers',
            keywords: 'ledgers, audit, management'
        },
        guard: ['auth', 'admin'],
        priority: 2
    },
    
    '/admin/blacklist': {
        title: 'Blacklist Management',
        component: 'admin/admin-blacklist.html',
        meta: {
            description: 'Manage blacklist and appeals',
            keywords: 'blacklist, appeals, management'
        },
        guard: ['auth', 'admin'],
        priority: 2
    },
    
    '/admin/subscriptions': {
        title: 'Subscription Management',
        component: 'admin/admin-subscriptions.html',
        meta: {
            description: 'Manage lender subscriptions and payments',
            keywords: 'subscriptions, payments, management'
        },
        guard: ['auth', 'admin'],
        priority: 2
    },
    
    '/admin/audit': {
        title: 'Audit Logs',
        component: 'admin/admin-audit.html',
        meta: {
            description: 'View platform audit logs and activities',
            keywords: 'audit, logs, activities'
        },
        guard: ['auth', 'admin'],
        priority: 3
    },
    
    // ============================================
    // ERROR & UTILITY ROUTES
    // ============================================
    
    '/404': {
        title: 'Page Not Found',
        component: '404.html',
        meta: {
            description: 'The page you requested was not found',
            keywords: '404, not found, error'
        },
        guard: [],
        priority: 0
    },
    
    '/403': {
        title: 'Access Denied',
        component: 'pages/access-denied.html',
        meta: {
            description: 'You do not have permission to access this page',
            keywords: '403, access denied, permission'
        },
        guard: [],
        priority: 0
    },
    
    '/500': {
        title: 'Server Error',
        component: 'pages/server-error.html',
        meta: {
            description: 'An internal server error occurred',
            keywords: '500, server error, internal error'
        },
        guard: [],
        priority: 0
    },
    
    '/offline': {
        title: 'Offline',
        component: 'offline.html',
        meta: {
            description: 'You are currently offline',
            keywords: 'offline, no connection'
        },
        guard: [],
        priority: 0
    },
    
    '/maintenance': {
        title: 'Maintenance',
        component: 'pages/maintenance.html',
        meta: {
            description: 'Platform is under maintenance',
            keywords: 'maintenance, downtime, upgrade'
        },
        guard: [],
        priority: 0
    }
};

// Export routes configuration
export default routes;

// Helper function to get route by name
export function getRouteByName(name) {
    const routeMap = {
        'home': '/',
        'login': '/auth/login',
        'register': '/auth/register',
        'borrower.dashboard': '/borrower',
        'lender.dashboard': '/lender',
        'subscription.plans': '/subscription',
        'emergency.hub': '/emergency',
        'countries.list': '/countries',
        'admin.dashboard': '/admin',
        'groups.list': '/groups',
        'blacklist.public': '/blacklist',
        'collectors': '/collectors'
    };
    
    return routeMap[name] || '/';
}

// Helper function to check if route requires authentication
export function requiresAuth(path) {
    const route = routes[path];
    if (!route) return false;
    
    return route.guard?.includes('auth') || false;
}

// Helper function to check if route is for specific role
export function getRequiredRole(path) {
    const route = routes[path];
    if (!route) return null;
    
    if (path.startsWith('/borrower')) return 'borrower';
    if (path.startsWith('/lender')) return 'lender';
    if (path.startsWith('/admin')) return 'admin';
    
    return null;
}

// Helper to get all public routes
export function getPublicRoutes() {
    return Object.entries(routes)
        .filter(([path, config]) => !requiresAuth(path))
        .map(([path]) => path);
}

// Helper to get all authenticated routes
export function getAuthenticatedRoutes() {
    return Object.entries(routes)
        .filter(([path, config]) => requiresAuth(path))
        .map(([path]) => path);
}

// Helper to get routes by priority
export function getRoutesByPriority(priority) {
    return Object.entries(routes)
        .filter(([path, config]) => config.priority === priority)
        .map(([path, config]) => ({ path, ...config }));
}