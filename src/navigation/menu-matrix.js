/**
 * M-Pesewa Menu Permissions Matrix
 * Enforces strict role-based access control with hierarchical permissions
 * Hierarchy: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 */

import { USER_ROLES, MENU_STRUCTURE, NAVIGATION_RULES } from './menu-config.js';

// Permission Matrix Configuration
export const PERMISSION_MATRIX = {
    // Guest Permissions (Unauthenticated Users)
    GUEST: {
        canView: ['home', 'about', 'how_it_works', 'contact', 'countries'],
        canAccess: ['auth/login', 'auth/register', 'public/emergency-hub'],
        restrictions: [
            'NO_DASHBOARD_ACCESS',
            'NO_LOAN_APPLICATIONS',
            'NO_LENDING_ACTIONS',
            'NO_GROUP_ACCESS'
        ],
        metadata: {
            maxGroups: 0,
            canBorrow: false,
            canLend: false,
            subscriptionRequired: false
        }
    },
    
    // Borrower Permissions
    BORROWER: {
        canView: [
            'home', 'about', 'how_it_works', 'contact', 'countries',
            'borrower_dashboard', 'borrower_apply', 'borrower_history',
            'borrower_repayments', 'borrower_disputes', 'emergency_hub'
        ],
        canAccess: [
            'borrower/*',
            'emergency/*',
            'countries/current',
            'groups/joined',
            'profile',
            'settings'
        ],
        canPerform: [
            'apply_for_loan',
            'view_loan_history',
            'make_repayments',
            'join_group',
            'rate_lender',
            'view_emergency_categories',
            'switch_to_lender_role'
        ],
        restrictions: [
            'MAX_4_GROUPS',
            'NO_LENDING_ACTIONS',
            'NO_SUBSCRIPTION_REQUIRED',
            'MUST_HAVE_GOOD_RATING_FOR_MORE_GROUPS',
            'NO_CROSS_COUNTRY_ACCESS'
        ],
        limits: {
            maxActiveLoans: 1,
            maxGroups: 4,
            loanDuration: 7,
            interestRate: 10
        },
        metadata: {
            subscriptionTier: null,
            lendingEnabled: false,
            borrowingEnabled: true,
            groupMembership: 'borrower_only'
        }
    },
    
    // Lender Permissions
    LENDER: {
        canView: [
            'home', 'about', 'how_it_works', 'contact', 'countries',
            'lender_dashboard', 'lender_portfolio', 'lender_history',
            'lender_rules', 'lender_risk', 'subscription_plans',
            'emergency_hub'
        ],
        canAccess: [
            'lender/*',
            'subscription/*',
            'ledger/*',
            'countries/current',
            'groups/managed',
            'profile',
            'settings'
        ],
        canPerform: [
            'create_ledgers',
            'approve_loans',
            'rate_borrowers',
            'apply_blacklist',
            'manage_subscription',
            'view_portfolio',
            'switch_to_borrower_role',
            'lend_within_group'
        ],
        restrictions: [
            'MUST_HAVE_ACTIVE_SUBSCRIPTION',
            'NO_CROSS_GROUP_LENDING',
            'SUBSCRIPTION_EXPIRES_28TH',
            'LEDGER_LIMITS_BY_TIER',
            'NO_CROSS_COUNTRY_ACCESS'
        ],
        limits: {
            maxWeeklyByTier: true,
            maxLedgersByTier: true,
            subscriptionRequired: true,
            expiryDay: 28
        },
        metadata: {
            subscriptionTier: 'required',
            lendingEnabled: true,
            borrowingEnabled: true,
            groupMembership: 'lender_only'
        }
    },
    
    // Group Admin/Founder Permissions
    GROUP_ADMIN: {
        canView: [
            ...USER_ROLES.LENDER.permissions.map(p => p.replace('can_', '')),
            'group_dashboard',
            'group_members',
            'group_settings',
            'group_analytics',
            'group_invites'
        ],
        canAccess: [
            'lender/*',
            'group/*',
            'subscription/*',
            'ledger/*',
            'countries/current',
            'profile',
            'settings',
            'admin/group'
        ],
        canPerform: [
            ...LENDER.canPerform,
            'invite_members',
            'remove_members',
            'moderate_group',
            'set_group_rules',
            'view_group_analytics',
            'manage_group_settings'
        ],
        restrictions: [
            'GROUP_COUNTRY_LOCKED',
            'MAX_1000_MEMBERS',
            'MIN_5_MEMBERS',
            'NO_CROSS_COUNTRY_INVITES'
        ],
        limits: {
            maxMembers: 1000,
            minMembers: 5,
            countryLocked: true
        },
        metadata: {
            isFounder: true,
            canTransferOwnership: true,
            groupManagement: true,
            memberModeration: true
        }
    },
    
    // Platform Admin Permissions
    PLATFORM_ADMIN: {
        canView: ['*'],
        canAccess: ['*'],
        canPerform: ['*'],
        restrictions: [],
        limits: {},
        metadata: {
            superUser: true,
            canOverrideAnything: true,
            systemConfiguration: true,
            auditAccess: true
        }
    }
};

// Hierarchical Access Matrix (Strict Enforcement)
export const HIERARCHICAL_ACCESS = {
    // Global Level Access
    GLOBAL: {
        accessibleBy: ['GUEST', 'BORROWER', 'LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'],
        restrictions: [],
        requires: []
    },
    
    // Country Level Access
    COUNTRY: {
        accessibleBy: ['BORROWER', 'LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'],
        restrictions: [
            'COUNTRY_ISOLATION_ENFORCED',
            'NO_CROSS_COUNTRY_NAVIGATION',
            'REGISTRATION_COUNTRY_LOCKED'
        ],
        requires: ['country_selection', 'country_registration']
    },
    
    // Group Level Access
    GROUP: {
        accessibleBy: ['BORROWER', 'LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'],
        restrictions: [
            'GROUP_ISOLATION_ENFORCED',
            'INVITATION_OR_REFERRAL_ONLY',
            'MAX_1000_MEMBERS_PER_GROUP',
            'MIN_5_MEMBERS_REQUIRED'
        ],
        requires: ['group_membership', 'country_membership']
    },
    
    // Lender Level Access
    LENDER_LEVEL: {
        accessibleBy: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'],
        restrictions: [
            'ACTIVE_SUBSCRIPTION_REQUIRED',
            'LENDING_WITHIN_GROUP_ONLY',
            'SUBSCRIPTION_EXPIRY_28TH',
            'TIER_LIMITS_ENFORCED'
        ],
        requires: ['lender_registration', 'subscription_payment', 'group_membership']
    },
    
    // Borrower Level Access
    BORROWER_LEVEL: {
        accessibleBy: ['BORROWER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'],
        restrictions: [
            'MAX_4_GROUPS',
            'GOOD_RATING_REQUIRED_FOR_MORE_GROUPS',
            'NO_SUBSCRIPTION_FEES',
            'ONE_ACTIVE_LOAN_PER_GROUP'
        ],
        requires: ['borrower_registration', 'group_membership']
    },
    
    // Ledger Level Access
    LEDGER_LEVEL: {
        accessibleBy: ['LENDER', 'GROUP_ADMIN', 'PLATFORM_ADMIN'],
        restrictions: [
            'LEDGER_OWNERSHIP_REQUIRED',
            'ADMIN_OVERRIDE_CAPABILITY',
            'MANUAL_UPDATES_ONLY',
            'UNLIMITED_LEDGERS_PER_LENDER'
        ],
        requires: ['lender_access', 'loan_approval']
    }
};

// Role Transition Matrix (Switching between roles)
export const ROLE_TRANSITION_MATRIX = {
    GUEST_to_BORROWER: {
        allowed: true,
        requires: ['registration', 'country_selection', 'group_invitation'],
        restrictions: ['must_logout_first'],
        process: 'NEW_REGISTRATION_AS_BORROWER'
    },
    
    GUEST_to_LENDER: {
        allowed: true,
        requires: ['registration', 'country_selection', 'subscription_selection', 'payment'],
        restrictions: ['must_logout_first'],
        process: 'NEW_REGISTRATION_AS_LENDER'
    },
    
    BORROWER_to_LENDER: {
        allowed: true,
        requires: ['logout', 'new_registration', 'subscription_payment'],
        restrictions: ['cannot_switch_within_same_session', 'separate_profiles_required'],
        process: 'SEPARATE_REGISTRATION_PROCESS'
    },
    
    LENDER_to_BORROWER: {
        allowed: true,
        requires: ['logout', 'new_registration'],
        restrictions: ['cannot_switch_within_same_session', 'separate_profiles_required'],
        process: 'SEPARATE_REGISTRATION_PROCESS'
    },
    
    LENDER_to_GROUP_ADMIN: {
        allowed: true,
        requires: ['group_creation', 'founder_status'],
        restrictions: ['one_admin_per_group', 'cannot_transfer_easily'],
        process: 'GROUP_CREATION_OR_PROMOTION'
    },
    
    GROUP_ADMIN_to_PLATFORM_ADMIN: {
        allowed: false,
        requires: ['system_administration', 'super_user_grant'],
        restrictions: ['by_invitation_only', 'system_owner_decision'],
        process: 'PLATFORM_OWNERSHIP_DECISION'
    }
};

// Context-Based Permission Resolver
export class ContextPermissionResolver {
    constructor(user, context) {
        this.user = user;
        this.context = context;
        this.hierarchy = NAVIGATION_RULES.hierarchy;
    }
    
    // Check if user can access a specific resource
    canAccess(resource, action = 'view') {
        const userRole = this.user.role;
        const userPermissions = PERMISSION_MATRIX[userRole];
        
        if (!userPermissions) {
            console.error(`Invalid user role: ${userRole}`);
            return false;
        }
        
        // Platform admin has all access
        if (userRole === 'PLATFORM_ADMIN') {
            return true;
        }
        
        // Check hierarchical access
        if (!this.checkHierarchicalAccess(resource)) {
            return false;
        }
        
        // Check role-specific permissions
        switch (action) {
            case 'view':
                return userPermissions.canView.includes(resource) || 
                       userPermissions.canView.includes('*');
                
            case 'access':
                return userPermissions.canAccess.some(path => 
                    resource.startsWith(path.replace('*', '')));
                
            case 'perform':
                return userPermissions.canPerform.includes(resource);
                
            default:
                return false;
        }
    }
    
    // Check hierarchical access based on M-Pesewa strict hierarchy
    checkHierarchicalAccess(resource) {
        const { country, group, role } = this.context;
        const userCountry = this.user.country;
        const userGroups = this.user.groups || [];
        
        // Country Isolation Enforcement
        if (country && userCountry !== country) {
            console.warn(`Country isolation violated: User from ${userCountry} trying to access ${country}`);
            return false;
        }
        
        // Group Isolation Enforcement (for lenders)
        if (this.user.role === 'LENDER' && group && !userGroups.includes(group)) {
            console.warn(`Group isolation violated: Lender not in group ${group}`);
            return false;
        }
        
        // Borrower Group Limit Enforcement
        if (this.user.role === 'BORROWER' && userGroups.length >= 4) {
            console.warn(`Borrower group limit reached: ${userGroups.length}/4 groups`);
            
            // Allow if user has good rating
            if (this.user.rating < 4) {
                return false;
            }
        }
        
        // Subscription Enforcement for Lenders
        if (this.user.role === 'LENDER' || this.user.role === 'GROUP_ADMIN') {
            if (!this.user.subscription || this.user.subscription.expired) {
                console.warn(`Subscription required: Lender subscription expired or missing`);
                return false;
            }
            
            // Check subscription expiry (28th of each month)
            const today = new Date();
            const expiryDay = 28;
            
            if (this.user.subscription.expiryDate) {
                const expiryDate = new Date(this.user.subscription.expiryDate);
                if (today > expiryDate) {
                    console.warn(`Subscription expired on: ${expiryDate}`);
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Get accessible menu items for current context
    getAccessibleMenu() {
        const accessibleItems = [];
        const userRole = this.user.role;
        
        // Filter menu structure based on permissions
        Object.values(MENU_STRUCTURE).forEach(menuSection => {
            const sectionItems = menuSection.items.filter(item => {
                // Check if user role can access this item
                if (item.roles.includes('all') || item.roles.includes(userRole)) {
                    // Check hierarchical access
                    return this.checkHierarchicalAccess(item.id);
                }
                return false;
            });
            
            if (sectionItems.length > 0) {
                accessibleItems.push({
                    ...menuSection,
                    items: sectionItems
                });
            }
        });
        
        return accessibleItems;
    }
    
    // Validate role transition
    canTransitionTo(newRole) {
        const currentRole = this.user.role;
        const transitionKey = `${currentRole}_to_${newRole}`;
        const transition = ROLE_TRANSITION_MATRIX[transitionKey];
        
        if (!transition) {
            return { allowed: false, reason: 'Invalid role transition' };
        }
        
        return {
            allowed: transition.allowed,
            requires: transition.requires,
            restrictions: transition.restrictions,
            process: transition.process
        };
    }
}

// Export Menu Matrix Functions
export default {
    PERMISSION_MATRIX,
    HIERARCHICAL_ACCESS,
    ROLE_TRANSITION_MATRIX,
    ContextPermissionResolver
};