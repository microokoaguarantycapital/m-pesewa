'use strict';

const ROLES = {
    BORROWER: 'borrower',
    LENDER: 'lender',
    ADMIN: 'admin',
    GROUP_ADMIN: 'group_admin'
};

const ROLE_PERMISSIONS = {
    [ROLES.BORROWER]: [
        'view_dashboard',
        'request_loan',
        'view_loan_categories',
        'join_groups',
        'view_ledger',
        'view_profile',
        'repay_loan'
    ],
    [ROLES.LENDER]: [
        'view_dashboard',
        'view_borrower_requests',
        'approve_loan',
        'manage_ledgers',
        'rate_borrower',
        'view_subscription',
        'update_repayment',
        'view_group_lenders'
    ],
    [ROLES.ADMIN]: [
        'view_admin_dashboard',
        'manage_blacklist',
        'override_ledgers',
        'validate_collectors',
        'enforce_subscriptions',
        'view_all_countries',
        'view_all_groups',
        'view_all_users',
        'moderate_ratings'
    ],
    [ROLES.GROUP_ADMIN]: [
        'manage_group_members',
        'invite_members',
        'moderate_group',
        'view_group_stats',
        'enforce_group_rules'
    ]
};

const ROLE_HIERARCHY = {
    [ROLES.ADMIN]: 100,
    [ROLES.GROUP_ADMIN]: 80,
    [ROLES.LENDER]: 60,
    [ROLES.BORROWER]: 40
};

class RoleManager {
    constructor() {
        this.currentRole = null;
        this.userRoles = [];
        this.currentCountry = null;
        this.currentGroup = null;
    }

    init() {
        this.loadUserState();
        this.enforceRoleNavigation();
    }

    loadUserState() {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        this.currentRole = userData.role || null;
        this.userRoles = userData.roles || [];
        this.currentCountry = userData.country || null;
        this.currentGroup = userData.group || null;
    }

    saveUserState() {
        const userData = {
            role: this.currentRole,
            roles: this.userRoles,
            country: this.currentCountry,
            group: this.currentGroup,
            timestamp: Date.now()
        };
        localStorage.setItem('mpesewa_user', JSON.stringify(userData));
    }

    setRole(role, data = {}) {
        if (!Object.values(ROLES).includes(role)) {
            console.error('Invalid role:', role);
            return false;
        }

        this.currentRole = role;
        
        if (data.country) {
            this.currentCountry = data.country;
        }
        
        if (data.group) {
            this.currentGroup = data.group;
        }

        if (!this.userRoles.includes(role)) {
            this.userRoles.push(role);
        }

        this.saveUserState();
        this.enforceRoleNavigation();
        this.updateUIForRole();
        
        return true;
    }

    hasPermission(permission) {
        if (!this.currentRole) return false;
        
        const permissions = ROLE_PERMISSIONS[this.currentRole] || [];
        return permissions.includes(permission);
    }

    canAccessPage(page) {
        const pagePermissions = {
            'index.html': ['*'],
            'borrower-dashboard.html': [ROLES.BORROWER],
            'lender-dashboard.html': [ROLES.LENDER],
            'admin-dashboard.html': [ROLES.ADMIN],
            'admin-login.html': ['*'],
            'lending.html': [ROLES.LENDER],
            'borrowing.html': [ROLES.BORROWER],
            'ledger.html': [ROLES.LENDER, ROLES.ADMIN],
            'groups.html': [ROLES.BORROWER, ROLES.LENDER, ROLES.GROUP_ADMIN],
            'subscriptions.html': [ROLES.LENDER],
            'blacklist.html': [ROLES.ADMIN, ROLES.LENDER],
            'debt-collectors.html': [ROLES.ADMIN, ROLES.LENDER, ROLES.BORROWER],
            'about.html': ['*'],
            'qa.html': ['*'],
            'contact.html': ['*']
        };

        const allowedRoles = pagePermissions[page] || [];
        
        if (allowedRoles.includes('*')) return true;
        
        return allowedRoles.includes(this.currentRole);
    }

    enforceRoleNavigation() {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'admin-login.html' && this.currentRole === ROLES.ADMIN) {
            window.location.href = 'admin-dashboard.html';
            return;
        }
        
        if (currentPage === 'admin-dashboard.html' && this.currentRole !== ROLES.ADMIN) {
            window.location.href = 'admin-login.html';
            return;
        }
        
        if (!this.canAccessPage(currentPage)) {
            this.redirectToRoleAppropriatePage();
        }
    }

    redirectToRoleAppropriatePage() {
        if (this.currentRole === ROLES.ADMIN) {
            window.location.href = 'admin-dashboard.html';
        } else if (this.currentRole === ROLES.LENDER) {
            window.location.href = 'lender-dashboard.html';
        } else if (this.currentRole === ROLES.BORROWER) {
            window.location.href = 'borrower-dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    }

    updateUIForRole() {
        const roleElements = document.querySelectorAll('[data-role]');
        roleElements.forEach(element => {
            const requiredRole = element.getAttribute('data-role');
            const shouldShow = requiredRole === this.currentRole || requiredRole === 'all';
            element.style.display = shouldShow ? '' : 'none';
        });

        const permissionElements = document.querySelectorAll('[data-permission]');
        permissionElements.forEach(element => {
            const requiredPermission = element.getAttribute('data-permission');
            const shouldShow = this.hasPermission(requiredPermission);
            element.style.display = shouldShow ? '' : 'none';
        });

        document.body.setAttribute('data-role', this.currentRole || 'guest');
    }

    getCurrentRole() {
        return this.currentRole;
    }

    getUserRoles() {
        return [...this.userRoles];
    }

    getCurrentCountry() {
        return this.currentCountry;
    }

    getCurrentGroup() {
        return this.currentGroup;
    }

    isDualRole() {
        return this.userRoles.includes(ROLES.BORROWER) && this.userRoles.includes(ROLES.LENDER);
    }

    switchRole(targetRole) {
        if (!this.userRoles.includes(targetRole)) {
            console.error('User does not have role:', targetRole);
            return false;
        }

        if (targetRole === this.currentRole) {
            return true;
        }

        this.currentRole = targetRole;
        this.saveUserState();
        this.enforceRoleNavigation();
        
        return true;
    }

    logout() {
        this.currentRole = null;
        this.userRoles = [];
        this.currentCountry = null;
        this.currentGroup = null;
        
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_auth_token');
        
        window.location.href = 'index.html';
    }

    isBlacklisted() {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        return userData.blacklisted || false;
    }

    isSubscriptionActive() {
        if (this.currentRole !== ROLES.LENDER) return true;
        
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const subscription = userData.subscription || {};
        
        if (!subscription.expiry) return false;
        
        const now = new Date();
        const expiry = new Date(subscription.expiry);
        
        return now <= expiry;
    }

    getSubscriptionTier() {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        return userData.subscription?.tier || 'none';
    }

    canLendAmount(amount) {
        if (this.currentRole !== ROLES.LENDER) return false;
        
        const tier = this.getSubscriptionTier();
        const limits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender_of_lenders': 50000
        };
        
        return amount <= (limits[tier] || 0);
    }

    canJoinMoreGroups() {
        if (this.currentRole !== ROLES.BORROWER) return true;
        
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const groups = userData.groups || [];
        
        return groups.length < 4;
    }

    isInGroup(groupId) {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const groups = userData.groups || [];
        
        return groups.includes(groupId);
    }

    addToGroup(groupId) {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const groups = userData.groups || [];
        
        if (groups.length >= 4 && this.currentRole === ROLES.BORROWER) {
            return false;
        }
        
        if (!groups.includes(groupId)) {
            groups.push(groupId);
            userData.groups = groups;
            localStorage.setItem('mpesewa_user', JSON.stringify(userData));
            this.currentGroup = groupId;
        }
        
        return true;
    }

    removeFromGroup(groupId) {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const groups = userData.groups || [];
        
        const index = groups.indexOf(groupId);
        if (index > -1) {
            groups.splice(index, 1);
            userData.groups = groups;
            localStorage.setItem('mpesewa_user', JSON.stringify(userData));
            
            if (this.currentGroup === groupId) {
                this.currentGroup = groups.length > 0 ? groups[0] : null;
            }
        }
        
        return true;
    }
}

const roleManager = new RoleManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ROLES, roleManager };
}