/**
 * M-PESEWA NAVIGATION MENU RENDERER
 * Strictly enforces Global → Country → Groups → Lenders → Borrowers hierarchy
 * Non-negotiable business rules implementation
 */

// ============================================================================
// 1️⃣ CONSTANTS & CONFIGURATION (STRICT HIERARCHY DEFINITION)
// ============================================================================

const HIERARCHY_STRUCTURE = Object.freeze({
    GLOBAL: 'global',
    COUNTRIES: 'countries',
    GROUPS: 'groups',
    LENDERS: 'lenders',
    BORROWERS: 'borrowers',
    LEDGERS: 'ledgers'
});

const COUNTRY_CODES = Object.freeze({
    KE: { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
    UG: { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
    TZ: { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
    RW: { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
    CD: { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩' },
    BI: { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
    NG: { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
    GH: { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
    SS: { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
    SO: { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴' },
    ZA: { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
    ET: { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' }
});

const USER_ROLES = Object.freeze({
    BORROWER: 'borrower',
    LENDER: 'lender',
    GROUP_ADMIN: 'group_admin',
    PLATFORM_ADMIN: 'platform_admin'
});

const SUBSCRIPTION_TIERS = Object.freeze({
    BASIC: { id: 'basic', max_weekly: 1500, monthly_fee: 50, annual_fee: 500 },
    PREMIUM: { id: 'premium', max_weekly: 5000, monthly_fee: 250, annual_fee: 2500 },
    SUPER: { id: 'super', max_weekly: 20000, monthly_fee: 1000, annual_fee: 8500 },
    LENDER_OF_LENDERS: { id: 'lender_of_lenders', max_weekly: 50000, monthly_fee: 500, annual_fee: 6500 }
});

// ============================================================================
// 2️⃣ CORE DATA STRUCTURES (STRICT HIERARCHY ENFORCEMENT)
// ============================================================================

class MpesewaNavigationState {
    constructor() {
        this._currentCountry = null;
        this._currentGroup = null;
        this._currentRole = null;
        this._userData = null;
        this._subscriptionStatus = null;
        this._groupMemberships = [];
        this._validationErrors = [];
        
        // Bind methods
        this.validateHierarchy = this.validateHierarchy.bind(this);
        this.enforceCountryIsolation = this.enforceCountryIsolation.bind(this);
        this.enforceGroupIsolation = this.enforceGroupIsolation.bind(this);
    }
    
    // Getters with validation
    get currentCountry() {
        return this._currentCountry;
    }
    
    set currentCountry(countryCode) {
        const country = COUNTRY_CODES[countryCode];
        if (!country) {
            throw new Error(`Invalid country code: ${countryCode}. Must be one of: ${Object.keys(COUNTRY_CODES).join(', ')}`);
        }
        this._currentCountry = country;
        this._logStateChange('Country changed to', country.name);
    }
    
    get currentGroup() {
        return this._currentGroup;
    }
    
    set currentGroup(groupData) {
        if (!groupData || typeof groupData !== 'object') {
            throw new Error('Group data must be an object');
        }
        
        // Group must belong to current country
        if (this._currentCountry && groupData.country !== this._currentCountry.code) {
            throw new Error(`Group ${groupData.id} is in ${groupData.country}, but current country is ${this._currentCountry.code}`);
        }
        
        // Validate group structure
        if (!groupData.id || !groupData.name || !groupData.country) {
            throw new Error('Group must have id, name, and country properties');
        }
        
        // Check group size limits
        if (groupData.members && (groupData.members.length < 5 || groupData.members.length > 1000)) {
            this._validationErrors.push(`Group ${groupData.name} has ${groupData.members.length} members. Must have 5-1000 members.`);
        }
        
        this._currentGroup = groupData;
        this._logStateChange('Group changed to', groupData.name);
    }
    
    get currentRole() {
        return this._currentRole;
    }
    
    set currentRole(role) {
        if (!USER_ROLES[role.toUpperCase()]) {
            throw new Error(`Invalid role: ${role}. Must be one of: ${Object.values(USER_ROLES).join(', ')}`);
        }
        this._currentRole = role;
        this._logStateChange('Role changed to', role);
    }
    
    // User data management
    set userData(user) {
        if (!user || typeof user !== 'object') {
            throw new Error('User data must be an object');
        }
        
        // Validate required user fields
        const requiredFields = ['id', 'username', 'country', 'roles'];
        const missingFields = requiredFields.filter(field => !user[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`User data missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Enforce user can have max 4 groups
        if (user.groups && user.groups.length > 4) {
            throw new Error(`User ${user.username} is in ${user.groups.length} groups. Maximum is 4.`);
        }
        
        // Validate country exists
        if (!COUNTRY_CODES[user.country]) {
            throw new Error(`User country ${user.country} is not supported`);
        }
        
        this._userData = user;
        this._groupMemberships = user.groups || [];
        
        // Set initial state
        if (user.country && !this._currentCountry) {
            this.currentCountry = user.country;
        }
        
        if (user.roles && user.roles.length > 0 && !this._currentRole) {
            this.currentRole = user.roles[0];
        }
        
        this._logStateChange('User data set for', user.username);
    }
    
    get userData() {
        return this._userData;
    }
    
    // Subscription management
    set subscriptionStatus(subscription) {
        if (!subscription) {
            this._subscriptionStatus = null;
            return;
        }
        
        const requiredFields = ['tier', 'expiry_date', 'status'];
        const missingFields = requiredFields.filter(field => !subscription[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Subscription missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Validate tier
        const tier = SUBSCRIPTION_TIERS[subscription.tier.toUpperCase()];
        if (!tier) {
            throw new Error(`Invalid subscription tier: ${subscription.tier}`);
        }
        
        // Check expiry date (28th of each month rule)
        const expiryDate = new Date(subscription.expiry_date);
        if (expiryDate.getDate() !== 28) {
            this._validationErrors.push(`Subscription expiry should be 28th of month, but is ${expiryDate.getDate()}`);
        }
        
        this._subscriptionStatus = {
            ...subscription,
            tier_data: tier,
            is_active: subscription.status === 'active' && expiryDate > new Date()
        };
        
        this._logStateChange('Subscription status updated for tier', subscription.tier);
    }
    
    get subscriptionStatus() {
        return this._subscriptionStatus;
    }
    
    // ============================================================================
    // 3️⃣ HIERARCHY VALIDATION & ENFORCEMENT (NON-NEGOTIABLE RULES)
    // ============================================================================
    
    validateHierarchy() {
        this._validationErrors = [];
        
        // Rule 1: Country must be set
        if (!this._currentCountry) {
            this._validationErrors.push('Country must be selected');
        }
        
        // Rule 2: User must be authenticated
        if (!this._userData) {
            this._validationErrors.push('User must be authenticated');
            return this._validationErrors;
        }
        
        // Rule 3: User country must match current country
        if (this._userData.country !== this._currentCountry.code) {
            this._validationErrors.push(`User country (${this._userData.country}) does not match current country (${this._currentCountry.code})`);
        }
        
        // Rule 4: Group must belong to current country
        if (this._currentGroup && this._currentGroup.country !== this._currentCountry.code) {
            this._validationErrors.push(`Group ${this._currentGroup.name} is not in current country ${this._currentCountry.name}`);
        }
        
        // Rule 5: Lenders must have active subscription
        if (this._currentRole === USER_ROLES.LENDER) {
            if (!this._subscriptionStatus) {
                this._validationErrors.push('Lenders must have a subscription');
            } else if (!this._subscriptionStatus.is_active) {
                this._validationErrors.push('Lender subscription is not active');
            }
        }
        
        // Rule 6: Borrower cannot access lender-only features
        if (this._currentRole === USER_ROLES.BORROWER) {
            if (this._subscriptionStatus) {
                this._validationErrors.push('Borrowers should not have subscriptions');
            }
        }
        
        // Rule 7: Group validation if set
        if (this._currentGroup) {
            // Group must have minimum 5 members
            if (!this._currentGroup.members || this._currentGroup.members.length < 5) {
                this._validationErrors.push(`Group ${this._currentGroup.name} must have at least 5 members`);
            }
            
            // User must be a member of the group
            if (!this._currentGroup.members.some(member => member.id === this._userData.id)) {
                this._validationErrors.push(`User ${this._userData.username} is not a member of group ${this._currentGroup.name}`);
            }
        }
        
        // Rule 8: User can be in max 4 groups (if borrower with good rating)
        if (this._userData.roles.includes(USER_ROLES.BORROWER)) {
            if (this._groupMemberships.length > 4) {
                this._validationErrors.push(`Borrower ${this._userData.username} is in ${this._groupMemberships.length} groups. Maximum is 4.`);
            }
        }
        
        return this._validationErrors;
    }
    
    enforceCountryIsolation(action, targetCountry) {
        if (!this._currentCountry) {
            throw new Error('No country selected');
        }
        
        if (targetCountry !== this._currentCountry.code) {
            throw new Error(`Cannot ${action} across countries. Current: ${this._currentCountry.code}, Target: ${targetCountry}`);
        }
        
        return true;
    }
    
    enforceGroupIsolation(action, targetGroupId) {
        if (!this._currentGroup) {
            throw new Error('No group selected');
        }
        
        if (targetGroupId !== this._currentGroup.id) {
            throw new Error(`Cannot ${action} outside current group. Current: ${this._currentGroup.id}, Target: ${targetGroupId}`);
        }
        
        return true;
    }
    
    // ============================================================================
    // 4️⃣ MENU RENDERING BASED ON CONTEXT
    // ============================================================================
    
    renderMainMenu() {
        const validationErrors = this.validateHierarchy();
        
        if (validationErrors.length > 0) {
            console.warn('Navigation validation errors:', validationErrors);
            return this._renderErrorMenu(validationErrors);
        }
        
        const menuStructure = {
            type: 'main_menu',
            user: {
                name: this._userData.username,
                role: this._currentRole,
                country: this._currentCountry.name,
                subscription: this._subscriptionStatus?.tier
            },
            sections: []
        };
        
        // Always show Home
        menuStructure.sections.push({
            id: 'home',
            title: 'Home',
            items: [
                { type: 'link', label: 'Dashboard', url: this._getDashboardUrl(), icon: '🏠' }
            ]
        });
        
        // Role-specific sections
        if (this._currentRole === USER_ROLES.LENDER) {
            menuStructure.sections.push(...this._renderLenderMenu());
        } else if (this._currentRole === USER_ROLES.BORROWER) {
            menuStructure.sections.push(...this._renderBorrowerMenu());
        } else if (this._currentRole === USER_ROLES.GROUP_ADMIN) {
            menuStructure.sections.push(...this._renderGroupAdminMenu());
        } else if (this._currentRole === USER_ROLES.PLATFORM_ADMIN) {
            menuStructure.sections.push(...this._renderPlatformAdminMenu());
        }
        
        // Common sections for all roles
        menuStructure.sections.push(...this._renderCommonSections());
        
        return menuStructure;
    }
    
    _renderLenderMenu() {
        const sections = [];
        
        // Lending section
        sections.push({
            id: 'lending',
            title: 'Lending',
            items: [
                { type: 'link', label: 'Lend Now', url: '/lender/lend', icon: '💰', 
                  enabled: this._subscriptionStatus?.is_active },
                { type: 'link', label: 'My Portfolio', url: '/lender/portfolio', icon: '📊' },
                { type: 'link', label: 'Active Loans', url: '/lender/loans', icon: '📝' },
                { type: 'link', label: 'Ledgers', url: '/lender/ledgers', icon: '📒' },
                { type: 'link', label: 'Risk Analysis', url: '/lender/risk', icon: '⚠️' }
            ]
        });
        
        // Subscription section
        sections.push({
            id: 'subscription',
            title: 'Subscription',
            items: [
                { type: 'status', label: `Tier: ${this._subscriptionStatus?.tier_data?.id || 'None'}`, 
                  status: this._subscriptionStatus?.is_active ? 'active' : 'expired', icon: '🎫' },
                { type: 'link', label: 'Upgrade Plan', url: '/subscription/upgrade', icon: '⬆️' },
                { type: 'link', label: 'Payment History', url: '/subscription/history', icon: '📜' }
            ]
        });
        
        return sections;
    }
    
    _renderBorrowerMenu() {
        return [{
            id: 'borrowing',
            title: 'Borrowing',
            items: [
                { type: 'link', label: 'Apply for Loan', url: '/borrower/apply', icon: '📋' },
                { type: 'link', label: 'Active Loans', url: '/borrower/loans', icon: '📝' },
                { type: 'link', label: 'Repayment Schedule', url: '/borrower/repayments', icon: '📅' },
                { type: 'link', label: 'Loan History', url: '/borrower/history', icon: '📊' },
                { type: 'link', label: 'My Rating', url: '/borrower/rating', icon: '⭐' }
            ]
        }];
    }
    
    _renderGroupAdminMenu() {
        return [{
            id: 'group_admin',
            title: 'Group Administration',
            items: [
                { type: 'link', label: 'Group Dashboard', url: '/group/admin', icon: '🏢' },
                { type: 'link', label: 'Member Management', url: '/group/members', icon: '👥' },
                { type: 'link', label: 'Invitations', url: '/group/invites', icon: '📨' },
                { type: 'link', label: 'Group Settings', url: '/group/settings', icon: '⚙️' },
                { type: 'link', label: 'Reports', url: '/group/reports', icon: '📈' }
            ]
        }];
    }
    
    _renderPlatformAdminMenu() {
        return [{
            id: 'platform_admin',
            title: 'Platform Administration',
            items: [
                { type: 'link', label: 'System Dashboard', url: '/admin/dashboard', icon: '🖥️' },
                { type: 'link', label: 'User Management', url: '/admin/users', icon: '👤' },
                { type: 'link', label: 'Group Oversight', url: '/admin/groups', icon: '🏢' },
                { type: 'link', label: 'Blacklist Management', url: '/admin/blacklist', icon: '🚫' },
                { type: 'link', label: 'Audit Logs', url: '/admin/audit', icon: '📜' },
                { type: 'link', label: 'System Health', url: '/admin/health', icon: '❤️' }
            ]
        }];
    }
    
    _renderCommonSections() {
        const sections = [];
        
        // Emergency Hub (available to all)
        sections.push({
            id: 'emergency_hub',
            title: 'Emergency Hub',
            items: [
                { type: 'link', label: 'All Categories', url: '/emergency', icon: '🚨' },
                { type: 'link', label: 'Transport & Fare', url: '/emergency/fare', icon: '🚌' },
                { type: 'link', label: 'Food & Essentials', url: '/emergency/food', icon: '🍲' },
                { type: 'link', label: 'Health & Medicine', url: '/emergency/medicine', icon: '💊' },
                { type: 'link', label: 'Business Support', url: '/emergency/business', icon: '💼' }
            ]
        });
        
        // Groups section
        if (this._groupMemberships.length > 0) {
            sections.push({
                id: 'my_groups',
                title: 'My Groups',
                items: this._groupMemberships.map(group => ({
                    type: 'group_link',
                    label: group.name,
                    url: `/group/${group.id}`,
                    icon: '👥',
                    metadata: {
                        country: group.country,
                        members: group.memberCount,
                        role: group.userRole
                    }
                }))
            });
        }
        
        // Country section
        sections.push({
            id: 'country',
            title: 'Country Operations',
            items: [
                { type: 'status', label: `Current: ${this._currentCountry.name}`, 
                  icon: this._currentCountry.flag, status: 'active' },
                { type: 'link', label: 'Country Dashboard', url: `/country/${this._currentCountry.code}`, icon: '🗺️' },
                { type: 'link', label: 'Local Rules', url: `/country/${this._currentCountry.code}/rules`, icon: '📜' },
                { type: 'link', label: 'Currency Calculator', url: `/country/${this._currentCountry.code}/calculator`, icon: '🧮' }
            ]
        });
        
        // User account section
        sections.push({
            id: 'account',
            title: 'My Account',
            items: [
                { type: 'link', label: 'Profile', url: '/user/profile', icon: '👤' },
                { type: 'link', label: 'Security', url: '/user/security', icon: '🔒' },
                { type: 'link', label: 'Notifications', url: '/user/notifications', icon: '🔔' },
                { type: 'link', label: 'Logout', url: '/auth/logout', icon: '🚪', action: 'logout' }
            ]
        });
        
        return sections;
    }
    
    _renderErrorMenu(errors) {
        return {
            type: 'error_menu',
            message: 'Navigation configuration errors detected',
            errors: errors,
            sections: [{
                id: 'error',
                title: '⚠️ Configuration Required',
                items: [
                    { type: 'action', label: 'Fix Configuration', action: 'reconfigure', icon: '🔧' },
                    { type: 'link', label: 'Contact Support', url: '/support', icon: '📞' }
                ]
            }]
        };
    }
    
    // ============================================================================
    // 5️⃣ UTILITY METHODS
    // ============================================================================
    
    _getDashboardUrl() {
        switch (this._currentRole) {
            case USER_ROLES.LENDER:
                return '/lender/dashboard';
            case USER_ROLES.BORROWER:
                return '/borrower/dashboard';
            case USER_ROLES.GROUP_ADMIN:
                return '/group/admin/dashboard';
            case USER_ROLES.PLATFORM_ADMIN:
                return '/admin/dashboard';
            default:
                return '/dashboard';
        }
    }
    
    _logStateChange(action, value) {
        console.log(`[M-Pesewa Navigation] ${action}:`, value, {
            timestamp: new Date().toISOString(),
            userId: this._userData?.id,
            country: this._currentCountry?.code,
            group: this._currentGroup?.id,
            role: this._currentRole
        });
    }
    
    // ============================================================================
    // 6️⃣ PUBLIC API
    // ============================================================================
    
    initialize(userData, initialCountry, initialGroup) {
        try {
            this.userData = userData;
            
            if (initialCountry) {
                this.currentCountry = initialCountry;
            }
            
            if (initialGroup) {
                this.currentGroup = initialGroup;
            }
            
            const errors = this.validateHierarchy();
            if (errors.length > 0) {
                console.error('Initialization failed with errors:', errors);
                return { success: false, errors };
            }
            
            return { success: true, state: this.getState() };
        } catch (error) {
            console.error('Navigation initialization error:', error);
            return { success: false, error: error.message };
        }
    }
    
    getState() {
        return {
            country: this._currentCountry,
            group: this._currentGroup,
            role: this._currentRole,
            user: this._userData ? {
                id: this._userData.id,
                username: this._userData.username,
                roles: this._userData.roles
            } : null,
            subscription: this._subscriptionStatus,
            groupMemberships: this._groupMemberships,
            validationErrors: this._validationErrors
        };
    }
    
    switchCountry(countryCode) {
        try {
            this.enforceCountryIsolation('switch', countryCode);
            this.currentCountry = countryCode;
            return { success: true, newCountry: this._currentCountry };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    switchGroup(groupId, groupData) {
        try {
            if (!groupData) {
                throw new Error('Group data required for switching');
            }
            
            this.enforceGroupIsolation('switch', groupId);
            this.currentGroup = groupData;
            return { success: true, newGroup: this._currentGroup };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    switchRole(newRole) {
        try {
            // Cannot switch to lender without subscription
            if (newRole === USER_ROLES.LENDER && !this._subscriptionStatus?.is_active) {
                throw new Error('Cannot switch to lender role without active subscription');
            }
            
            this.currentRole = newRole;
            return { success: true, newRole: this._currentRole };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // ============================================================================
    // 7️⃣ STATIC METHODS & EXPORTS
    // ============================================================================
    
    static get HIERARCHY() {
        return HIERARCHY_STRUCTURE;
    }
    
    static get COUNTRIES() {
        return COUNTRY_CODES;
    }
    
    static get ROLES() {
        return USER_ROLES;
    }
    
    static get SUBSCRIPTIONS() {
        return SUBSCRIPTION_TIERS;
    }
}

// Export singleton instance
const mpesewaNavigation = new MpesewaNavigationState();

// Also export class for testing and extension
export { MpesewaNavigationState, mpesewaNavigation as default };

// Example usage:
/*
// Initialize navigation
const nav = new MpesewaNavigationState();

// Set up user data
const user = {
    id: 'user_123',
    username: 'john_doe',
    country: 'KE',
    roles: ['lender', 'borrower'],
    groups: [
        { id: 'group_1', name: 'Family Group', country: 'KE', memberCount: 15, userRole: 'lender' },
        { id: 'group_2', name: 'Business Group', country: 'KE', memberCount: 45, userRole: 'borrower' }
    ]
};

// Set subscription
const subscription = {
    tier: 'premium',
    expiry_date: '2024-01-28',
    status: 'active'
};

// Initialize
nav.initialize(user, 'KE', user.groups[0]);
nav.subscriptionStatus = subscription;

// Render menu
const menu = nav.renderMainMenu();
console.log('Generated Menu:', menu);
*/