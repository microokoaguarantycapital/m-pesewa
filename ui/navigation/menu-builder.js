/**
 * M-Pesewa Menu Builder
 * Dynamically builds navigation menus based on user role, country, and group context
 * Enforces strict hierarchical structure: Global → Countries → Groups → Lenders → Borrowers
 */

import { 
    MENU_STRUCTURE, 
    BRAND_CONFIG, 
    COUNTRIES,
    USER_ROLES,
    SUBSCRIPTION_TIERS 
} from './menu-config.js';

import { ContextPermissionResolver } from './menu-matrix.js';

// Menu Builder Class
export class MenuBuilder {
    constructor(user, context = {}) {
        this.user = user || { role: 'GUEST', country: null, groups: [] };
        this.context = context;
        this.permissionResolver = new ContextPermissionResolver(user, context);
        this.currentCountry = this.getCurrentCountry();
        this.currentGroup = this.getCurrentGroup();
    }
    
    // Get current country from context or user
    getCurrentCountry() {
        if (this.context.country) {
            return COUNTRIES.find(c => c.code === this.context.country);
        }
        if (this.user.country) {
            return COUNTRIES.find(c => c.code === this.user.country);
        }
        return null;
    }
    
    // Get current group from context or user
    getCurrentGroup() {
        if (this.context.group) {
            return this.user.groups?.find(g => g.id === this.context.group) || null;
        }
        return this.user.groups?.[0] || null;
    }
    
    // Build main navigation menu
    buildMainMenu() {
        const userRole = this.user.role || 'GUEST';
        const accessibleSections = this.permissionResolver.getAccessibleMenu();
        
        const mainMenu = {
            brand: this.buildBrandBlock(),
            sections: [],
            authStatus: this.buildAuthStatus()
        };
        
        // Always include Global section
        if (accessibleSections.find(s => s.id === 'global')) {
            mainMenu.sections.push(this.buildGlobalMenu());
        }
        
        // Add role-specific sections
        switch (userRole) {
            case 'BORROWER':
                mainMenu.sections.push(...this.buildBorrowerMenu());
                break;
                
            case 'LENDER':
            case 'GROUP_ADMIN':
                mainMenu.sections.push(...this.buildLenderMenu());
                break;
                
            case 'PLATFORM_ADMIN':
                mainMenu.sections.push(...this.buildAdminMenu());
                break;
        }
        
        // Add context-specific sections
        if (this.currentCountry) {
            mainMenu.sections.push(...this.buildCountryMenu());
        }
        
        if (this.currentGroup) {
            mainMenu.sections.push(...this.buildGroupMenu());
        }
        
        // Add emergency hub (if accessible)
        if (this.permissionResolver.canAccess('emergency_hub', 'view')) {
            mainMenu.sections.push(this.buildEmergencyHubMenu());
        }
        
        return mainMenu;
    }
    
    // Build brand block with logo and tagline
    buildBrandBlock() {
        return {
            type: 'brand',
            data: {
                name: BRAND_CONFIG.logo.text,
                tagline: BRAND_CONFIG.logo.tagline,
                logo: BRAND_CONFIG.logo.icon,
                colors: BRAND_CONFIG.colors,
                url: '/'
            },
            display: {
                desktop: 'full',
                mobile: 'compact',
                tablet: 'full'
            }
        };
    }
    
    // Build global menu (always visible)
    buildGlobalMenu() {
        return {
            id: 'global',
            type: 'primary',
            name: 'Global',
            items: MENU_STRUCTURE.GLOBAL.items.map(item => ({
                ...item,
                active: this.isActiveItem(item.path),
                accessible: true
            })),
            display: 'always'
        };
    }
    
    // Build borrower-specific menu
    buildBorrowerMenu() {
        const sections = [];
        
        // Borrower Main Section
        sections.push({
            id: 'borrowers',
            type: 'dropdown',
            name: 'Borrowers',
            icon: '💼',
            items: MENU_STRUCTURE.BORROWERS.items.map(item => ({
                ...item,
                active: this.isActiveItem(item.path),
                accessible: this.permissionResolver.canAccess(item.id, 'access'),
                badge: this.getBorrowerBadge(item.id)
            })),
            display: 'role_based'
        });
        
        // Borrower Groups Section
        if (this.user.groups && this.user.groups.length > 0) {
            sections.push({
                id: 'borrower_groups',
                type: 'group_switcher',
                name: 'My Groups',
                icon: '🏢',
                items: this.user.groups.map(group => ({
                    id: group.id,
                    name: group.name,
                    path: `/groups/${group.id}/borrower`,
                    icon: '👥',
                    badge: group.type === 'family' ? '👪' : '💼',
                    metadata: {
                        memberCount: group.memberCount,
                        country: group.country,
                        activeLoans: group.activeLoans || 0
                    }
                })),
                current: this.currentGroup?.id,
                display: 'contextual'
            });
        }
        
        return sections;
    }
    
    // Build lender-specific menu
    buildLenderMenu() {
        const sections = [];
        const userRole = this.user.role;
        
        // Lender Main Section
        sections.push({
            id: 'lenders',
            type: 'dropdown',
            name: 'Lenders',
            icon: '🌱',
            items: MENU_STRUCTURE.LENDERS.items.map(item => ({
                ...item,
                active: this.isActiveItem(item.path),
                accessible: this.permissionResolver.canAccess(item.id, 'access'),
                badge: this.getLenderBadge(item.id)
            })),
            display: 'role_based'
        });
        
        // Subscription Section (Critical for lenders)
        if (this.user.subscription) {
            sections.push({
                id: 'subscription',
                type: 'dropdown',
                name: 'Subscription',
                icon: '💰',
                items: MENU_STRUCTURE.SUBSCRIPTION_PLANS.items.map(item => ({
                    ...item,
                    active: this.isActiveItem(item.path),
                    accessible: true,
                    warning: this.getSubscriptionWarning(item.id)
                })),
                status: this.getSubscriptionStatus(),
                display: 'critical'
            });
        }
        
        // Lender Groups Section
        if (this.user.groups && this.user.groups.length > 0) {
            sections.push({
                id: 'lender_groups',
                type: 'group_switcher',
                name: 'Lending Groups',
                icon: '🏢',
                items: this.user.groups.map(group => ({
                    id: group.id,
                    name: group.name,
                    path: `/groups/${group.id}/lender`,
                    icon: '👥',
                    badge: this.getGroupBadge(group),
                    metadata: {
                        memberCount: group.memberCount,
                        lenders: group.lenderCount || 0,
                        borrowers: group.borrowerCount || 0,
                        totalLent: group.totalLent || 0
                    }
                })),
                current: this.currentGroup?.id,
                display: 'contextual'
            });
        }
        
        // Ledgers Section (if user has ledgers)
        if (this.user.ledgers && this.user.ledgers.length > 0) {
            sections.push({
                id: 'ledgers',
                type: 'dropdown',
                name: 'Ledgers',
                icon: '📒',
                items: this.buildLedgerMenu(),
                count: this.user.ledgers.length,
                display: 'dynamic'
            });
        }
        
        return sections;
    }
    
    // Build admin menu
    buildAdminMenu() {
        return [
            {
                id: 'admin',
                type: 'dropdown',
                name: 'Admin',
                icon: '⚙️',
                items: MENU_STRUCTURE.ADMIN.items.map(item => ({
                    ...item,
                    active: this.isActiveItem(item.path),
                    accessible: true,
                    badge: this.getAdminBadge(item.id)
                })),
                display: 'admin_only'
            }
        ];
    }
    
    // Build country-specific menu
    buildCountryMenu() {
        const sections = [];
        
        if (!this.currentCountry) return sections;
        
        // Country Switcher
        sections.push({
            id: 'country_switcher',
            type: 'dropdown',
            name: 'Country',
            icon: this.currentCountry.flag,
            items: COUNTRIES.map(country => ({
                id: country.code,
                name: country.name,
                path: `/countries/${country.code.toLowerCase()}`,
                icon: country.flag,
                active: country.code === this.currentCountry.code,
                accessible: this.permissionResolver.canAccess(country.code, 'access'),
                disabled: this.user.country && country.code !== this.user.country
            })),
            current: this.currentCountry.code,
            display: 'contextual',
            note: this.user.country ? 'Country locked after registration' : 'Select your country'
        });
        
        // Country Dashboard
        sections.push({
            id: 'country_dashboard',
            type: 'link',
            name: `${this.currentCountry.name} Dashboard`,
            path: `/countries/${this.currentCountry.code.toLowerCase()}/dashboard.html`,
            icon: '📊',
            active: this.isActiveItem(`/countries/${this.currentCountry.code.toLowerCase()}`),
            accessible: true,
            metadata: {
                currency: this.currentCountry.currency,
                contact: this.currentCountry.contact
            }
        });
        
        return sections;
    }
    
    // Build group-specific menu
    buildGroupMenu() {
        if (!this.currentGroup) return [];
        
        const sections = [];
        const isAdmin = this.user.role === 'GROUP_ADMIN' || this.user.role === 'PLATFORM_ADMIN';
        
        // Group Dashboard
        sections.push({
            id: 'group_dashboard',
            type: 'link',
            name: `${this.currentGroup.name} Dashboard`,
            path: `/groups/${this.currentGroup.id}/dashboard.html`,
            icon: '🏢',
            active: this.isActiveItem(`/groups/${this.currentGroup.id}`),
            accessible: true,
            badge: isAdmin ? '👑' : null
        });
        
        // Group Members
        sections.push({
            id: 'group_members',
            type: 'link',
            name: 'Group Members',
            path: `/groups/${this.currentGroup.id}/members.html`,
            icon: '👥',
            active: this.isActiveItem(`/groups/${this.currentGroup.id}/members`),
            accessible: true
        });
        
        // Group Settings (Admin only)
        if (isAdmin) {
            sections.push({
                id: 'group_settings',
                type: 'link',
                name: 'Group Settings',
                path: `/groups/${this.currentGroup.id}/settings.html`,
                icon: '⚙️',
                active: this.isActiveItem(`/groups/${this.currentGroup.id}/settings`),
                accessible: true
            });
        }
        
        return sections;
    }
    
    // Build emergency hub menu
    buildEmergencyHubMenu() {
        const categories = MENU_STRUCTURE.EMERGENCY_HUB.items;
        
        // Group categories by type for better organization
        const groupedCategories = {
            essentials: categories.filter(cat => 
                ['fare', 'data', 'gas', 'food', 'wifi', 'water', 'electricity', 'tv'].includes(cat.id)
            ),
            logistics: categories.filter(cat => 
                ['fuel', 'repair', 'credo'].includes(cat.id)
            ),
            business: categories.filter(cat => 
                ['sales', 'capital', 'soko', 'kidandaski', 'hawker', 'fuliziwa'].includes(cat.id)
            ),
            health_education: categories.filter(cat => 
                ['medicine', 'school', 'advance'].includes(cat.id)
            )
        };
        
        return {
            id: 'emergency_hub',
            type: 'mega_menu',
            name: 'Emergency Hub',
            icon: '🚨',
            groups: [
                {
                    name: 'Everyday Essentials',
                    items: groupedCategories.essentials.map(item => ({
                        ...item,
                        active: this.isActiveItem(item.path),
                        accessible: true
                    }))
                },
                {
                    name: 'Logistics & Repairs',
                    items: groupedCategories.logistics.map(item => ({
                        ...item,
                        active: this.isActiveItem(item.path),
                        accessible: true
                    }))
                },
                {
                    name: 'Business & Growth',
                    items: groupedCategories.business.map(item => ({
                        ...item,
                        active: this.isActiveItem(item.path),
                        accessible: true
                    }))
                },
                {
                    name: 'Health & Education',
                    items: groupedCategories.health_education.map(item => ({
                        ...item,
                        active: this.isActiveItem(item.path),
                        accessible: true
                    }))
                }
            ],
            display: 'featured'
        };
    }
    
    // Build ledger menu items
    buildLedgerMenu() {
        if (!this.user.ledgers || this.user.ledgers.length === 0) {
            return [];
        }
        
        return this.user.ledgers.slice(0, 5).map(ledger => ({
            id: ledger.id,
            name: ledger.borrowerName,
            path: `/ledger/${ledger.id}`,
            icon: this.getLedgerStatusIcon(ledger.status),
            badge: this.getLedgerBadge(ledger),
            metadata: {
                amount: ledger.amount,
                dueDate: ledger.dueDate,
                status: ledger.status,
                overdue: ledger.overdue || false
            }
        }));
    }
    
    // Build authentication status
    buildAuthStatus() {
        if (this.user.role === 'GUEST') {
            return {
                isAuthenticated: false,
                actions: [
                    { label: 'Sign In', path: '/auth/login.html', type: 'outline' },
                    { label: 'Get Started', path: '/auth/register.html', type: 'primary' }
                ]
            };
        }
        
        return {
            isAuthenticated: true,
            user: {
                name: this.user.name,
                role: this.user.role,
                avatar: this.getUserAvatar(),
                country: this.currentCountry?.flag
            },
            actions: [
                { 
                    label: 'Profile', 
                    path: '/user/profile.html', 
                    type: 'link',
                    icon: '👤'
                },
                { 
                    label: 'Switch Role', 
                    path: '/auth/switch-role.html', 
                    type: 'secondary',
                    icon: '🔄',
                    enabled: this.user.dualRole
                },
                { 
                    label: 'Logout', 
                    path: '/auth/logout.html', 
                    type: 'danger',
                    icon: '🚪'
                }
            ]
        };
    }
    
    // Helper methods
    isActiveItem(path) {
        const currentPath = window.location.pathname;
        return currentPath === path || currentPath.startsWith(path.replace('.html', ''));
    }
    
    getBorrowerBadge(itemId) {
        const badges = {
            borrower_dashboard: '📊',
            borrower_apply: '🆕',
            borrower_history: '📜',
            borrower_repayments: '💰',
            borrower_disputes: '⚖️'
        };
        return badges[itemId] || null;
    }
    
    getLenderBadge(itemId) {
        const badges = {
            lender_dashboard: '📊',
            lender_portfolio: '📈',
            lender_history: '📜',
            lender_rules: '📋',
            lender_risk: '⚠️'
        };
        return badges[itemId] || null;
    }
    
    getAdminBadge(itemId) {
        const badges = {
            admin_dashboard: '📊',
            admin_users: '👥',
            admin_groups: '🏢',
            admin_ledgers: '📒',
            admin_blacklist: '🚫',
            admin_subscriptions: '💰',
            admin_audit: '📋'
        };
        return badges[itemId] || null;
    }
    
    getGroupBadge(group) {
        if (group.type === 'family') return '👪';
        if (group.type === 'church') return '⛪';
        if (group.type === 'professional') return '💼';
        if (group.type === 'local') return '🏘️';
        if (group.type === 'social') return '👥';
        return '🏢';
    }
    
    getLedgerStatusIcon(status) {
        const icons = {
            active: '📝',
            cleared: '✅',
            overdue: '⚠️',
            default: '🚫'
        };
        return icons[status] || '📒';
    }
    
    getLedgerBadge(ledger) {
        if (ledger.overdue) return '⏰';
        if (ledger.status === 'cleared') return '✅';
        return null;
    }
    
    getSubscriptionWarning(itemId) {
        if (!this.user.subscription) return null;
        
        const subscription = this.user.subscription;
        const today = new Date();
        const expiryDate = new Date(subscription.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 7 && itemId === 'current_plan') {
            return `Expires in ${daysUntilExpiry} days`;
        }
        
        return null;
    }
    
    getSubscriptionStatus() {
        if (!this.user.subscription) {
            return { status: 'missing', message: 'Subscription required for lending' };
        }
        
        const subscription = this.user.subscription;
        const today = new Date();
        const expiryDate = new Date(subscription.expiryDate);
        
        if (today > expiryDate) {
            return { 
                status: 'expired', 
                message: 'Subscription expired. Lending blocked.',
                color: 'danger'
            };
        }
        
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 7) {
            return { 
                status: 'warning', 
                message: `Renew in ${daysUntilExpiry} days`,
                color: 'warning'
            };
        }
        
        return { 
            status: 'active', 
            message: `Active until ${expiryDate.toLocaleDateString()}`,
            color: 'success'
        };
    }
    
    getUserAvatar() {
        // Generate avatar based on user initials
        if (this.user.name) {
            const initials = this.user.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            return initials;
        }
        return '👤';
    }
    
    // Generate mobile menu (simplified version)
    buildMobileMenu() {
        const mainMenu = this.buildMainMenu();
        
        return {
            brand: mainMenu.brand,
            sections: mainMenu.sections.map(section => ({
                ...section,
                // Simplify for mobile: convert dropdowns to accordions
                type: section.type === 'dropdown' ? 'accordion' : section.type
            })),
            authStatus: mainMenu.authStatus
        };
    }
    
    // Generate sidebar menu (for dashboard views)
    buildSidebarMenu() {
        const userRole = this.user.role;
        const mainMenu = this.buildMainMenu();
        
        // Filter for sidebar-relevant sections
        const sidebarSections = mainMenu.sections.filter(section => {
            return !['global', 'country_switcher'].includes(section.id);
        });
        
        return {
            brand: mainMenu.brand,
            user: mainMenu.authStatus.user,
            sections: sidebarSections,
            quickActions: this.buildQuickActions()
        };
    }
    
    // Build quick actions based on role
    buildQuickActions() {
        const userRole = this.user.role;
        
        switch (userRole) {
            case 'BORROWER':
                return [
                    { label: 'Apply for Loan', path: '/borrower/apply.html', icon: '📝', color: 'borrower' },
                    { label: 'Make Repayment', path: '/borrower/repayments.html', icon: '💰', color: 'success' },
                    { label: 'Join Group', path: '/groups/join.html', icon: '👥', color: 'secondary' }
                ];
                
            case 'LENDER':
            case 'GROUP_ADMIN':
                return [
                    { label: 'Create Ledger', path: '/ledger/create.html', icon: '📒', color: 'lender' },
                    { label: 'View Requests', path: '/lender/requests.html', icon: '📋', color: 'secondary' },
                    { label: 'Renew Subscription', path: '/subscription/renew.html', icon: '💰', color: 'warning' }
                ];
                
            case 'PLATFORM_ADMIN':
                return [
                    { label: 'System Health', path: '/admin/health.html', icon: '💻', color: 'info' },
                    { label: 'Audit Logs', path: '/admin/audit.html', icon: '📋', color: 'secondary' },
                    { label: 'User Management', path: '/admin/users.html', icon: '👥', color: 'primary' }
                ];
                
            default:
                return [];
        }
    }
    
    // Export menu as JSON for API consumption
    toJSON() {
        return {
            user: {
                id: this.user.id,
                role: this.user.role,
                country: this.user.country,
                groups: this.user.groups?.length || 0
            },
            context: this.context,
            menu: this.buildMainMenu(),
            generatedAt: new Date().toISOString(),
            version: '1.0.0'
        };
    }
}

// Export utility functions
export const MenuUtils = {
    // Generate CSS classes based on brand colors
    generateBrandCSS() {
        const css = `
            /* M-Pesewa Brand Colors */
            :root {
                --mp-primary: ${BRAND_CONFIG.colors.primary};
                --mp-secondary: ${BRAND_CONFIG.colors.secondary};
                --mp-borrower: ${BRAND_CONFIG.colors.borrower};
                --mp-lender: ${BRAND_CONFIG.colors.lender};
                --mp-neutral: ${BRAND_CONFIG.colors.neutral};
                --mp-white: ${BRAND_CONFIG.colors.white};
                --mp-dark-text: ${BRAND_CONFIG.colors.darkText};
                --mp-light-text: ${BRAND_CONFIG.colors.lightText};
                --mp-gray-text: ${BRAND_CONFIG.colors.grayText};
            }
            
            /* Header Styling */
            .mp-header {
                background-color: var(--mp-primary) !important;
                color: var(--mp-light-text) !important;
            }
            
            .mp-header a {
                color: var(--mp-light-text) !important;
            }
            
            .mp-header a:hover {
                color: var(--mp-secondary) !important;
            }
            
            /* Button Styling */
            .btn-borrower {
                background-color: var(--mp-borrower) !important;
                color: var(--mp-light-text) !important;
            }
            
            .btn-lender {
                background-color: var(--mp-lender) !important;
                color: var(--mp-light-text) !important;
            }
            
            .btn-secondary {
                background-color: var(--mp-secondary) !important;
                color: var(--mp-light-text) !important;
            }
            
            /* Card Styling */
            .mp-card {
                background-color: var(--mp-white) !important;
                color: var(--mp-dark-text) !important;
                box-shadow: 0 4px 20px rgba(0, 153, 255, 0.15);
            }
            
            .mp-card:hover {
                box-shadow: 0 8px 25px rgba(0, 153, 255, 0.2);
            }
            
            /* Footer Styling */
            .mp-footer {
                background-color: #1f2a37 !important;
                color: var(--mp-light-text) !important;
            }
        `;
        
        return css;
    },
    
    // Validate menu structure
    validateMenuStructure(menu) {
        const errors = [];
        
        if (!menu.brand) {
            errors.push('Brand configuration missing');
        }
        
        if (!menu.sections || !Array.isArray(menu.sections)) {
            errors.push('Menu sections must be an array');
        }
        
        menu.sections?.forEach((section, index) => {
            if (!section.id) {
                errors.push(`Section ${index} missing id`);
            }
            
            if (!section.name) {
                errors.push(`Section ${section.id} missing name`);
            }
            
            if (section.items && !Array.isArray(section.items)) {
                errors.push(`Section ${section.id} items must be an array`);
            }
        });
        
        return {
            valid: errors.length === 0,
            errors,
            warnings: errors.length > 0 ? ['Menu validation failed'] : []
        };
    },
    
    // Generate accessibility attributes
    generateAccessibilityAttributes(menuItem) {
        return {
            'aria-label': menuItem.name,
            'aria-current': menuItem.active ? 'page' : undefined,
            'role': 'menuitem',
            'tabindex': menuItem.accessible ? '0' : '-1'
        };
    },
    
    // Sanitize menu data for security
    sanitizeMenuData(data) {
        // Remove any sensitive information
        const sanitized = { ...data };
        
        if (sanitized.user) {
            delete sanitized.user.password;
            delete sanitized.user.token;
            delete sanitized.user.sensitiveData;
        }
        
        // Sanitize paths
        if (sanitized.menu?.sections) {
            sanitized.menu.sections = sanitized.menu.sections.map(section => {
                if (section.items) {
                    section.items = section.items.map(item => {
                        // Ensure path is safe
                        if (item.path && !item.path.startsWith('/')) {
                            item.path = '/' + item.path;
                        }
                        return item;
                    });
                }
                return section;
            });
        }
        
        return sanitized;
    }
};

// Export default instance
export default MenuBuilder;