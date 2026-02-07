/**
 * M-Pesewa Access Denied Component
 * Handles all access denial scenarios with strict hierarchy enforcement
 * Shows detailed reasons and required permissions
 */

class AccessDenied {
    constructor(config = {}) {
        this.config = {
            // Access denial reasons mapped to M-Pesewa hierarchy
            reasons: {
                // Country-level access denials
                'country-required': {
                    title: 'Country Selection Required',
                    message: 'You must select a country to access this feature. Country isolation is strictly enforced.',
                    icon: '🇺🇳',
                    color: '#003366',
                    required: ['country'],
                    hierarchy: 'countries',
                    action: {
                        label: 'Select Country',
                        url: 'countries/index.html',
                        method: 'redirect'
                    }
                },
                'wrong-country': {
                    title: 'Country Access Denied',
                    message: 'This content is not available in your selected country. No cross-country access allowed.',
                    icon: '🚫',
                    color: '#003366',
                    hierarchy: 'countries',
                    action: {
                        label: 'Switch Country',
                        url: 'countries/switch.html',
                        method: 'logout'
                    }
                },
                
                // Group-level access denials
                'group-required': {
                    title: 'Group Membership Required',
                    message: 'You must be a member of a group to access this feature. Groups are invitation-only.',
                    icon: '👥',
                    color: '#0099ff',
                    required: ['group'],
                    hierarchy: 'groups',
                    action: {
                        label: 'Join a Group',
                        url: 'groups/join.html',
                        method: 'navigate'
                    }
                },
                'wrong-group': {
                    title: 'Group Access Denied',
                    message: 'You do not have permission to access this group content.',
                    icon: '🔒',
                    color: '#0099ff',
                    hierarchy: 'groups',
                    action: {
                        label: 'Return to Your Group',
                        url: 'groups/dashboard.html',
                        method: 'redirect'
                    }
                },
                'group-full': {
                    title: 'Group Full',
                    message: 'This group has reached its maximum capacity of 1000 members.',
                    icon: '📊',
                    color: '#0099ff',
                    hierarchy: 'groups',
                    action: {
                        label: 'Find Another Group',
                        url: 'groups/browse.html',
                        method: 'navigate'
                    }
                },
                
                // Role-based access denials
                'lender-required': {
                    title: 'Lender Access Only',
                    message: 'This feature is available only to lenders with active subscriptions.',
                    icon: '💰',
                    color: '#28a745',
                    required: ['role:lender', 'subscription:active'],
                    hierarchy: 'lenders',
                    action: {
                        label: 'Become a Lender',
                        url: 'auth/register.html?role=lender',
                        method: 'register'
                    }
                },
                'borrower-required': {
                    title: 'Borrower Access Only',
                    message: 'This feature is available only to borrowers.',
                    icon: '🙋',
                    color: '#f37021',
                    required: ['role:borrower'],
                    hierarchy: 'borrowers',
                    action: {
                        label: 'Become a Borrower',
                        url: 'auth/register.html?role=borrower',
                        method: 'register'
                    }
                },
                'admin-required': {
                    title: 'Admin Access Required',
                    message: 'This feature requires platform administrator privileges.',
                    icon: '👑',
                    color: '#6f42c1',
                    required: ['role:admin'],
                    hierarchy: 'global',
                    action: {
                        label: 'Admin Login',
                        url: 'admin/login.html',
                        method: 'login'
                    }
                },
                
                // Subscription-based access denials
                'subscription-required': {
                    title: 'Subscription Required',
                    message: 'Active subscription required. Choose Basic, Premium, or Super tier.',
                    icon: '📋',
                    color: '#28a745',
                    required: ['subscription:active'],
                    hierarchy: 'lenders',
                    action: {
                        label: 'View Subscription Plans',
                        url: 'subscription/plans.html',
                        method: 'navigate'
                    }
                },
                'subscription-expired': {
                    title: 'Subscription Expired',
                    message: 'Your subscription expired on the 28th. Lending access is blocked until renewal.',
                    icon: '⏰',
                    color: '#f37021',
                    required: ['subscription:active'],
                    hierarchy: 'lenders',
                    action: {
                        label: 'Renew Subscription',
                        url: 'subscription/renew.html',
                        method: 'payment'
                    }
                },
                'tier-upgrade-required': {
                    title: 'Higher Tier Required',
                    message: 'This feature requires a higher subscription tier.',
                    icon: '📈',
                    color: '#28a745',
                    required: ['subscription:tier'],
                    hierarchy: 'lenders',
                    action: {
                        label: 'Upgrade Subscription',
                        url: 'subscription/upgrade.html',
                        method: 'upgrade'
                    }
                },
                
                // Borrower restriction access denials
                'blacklisted': {
                    title: 'Borrowing Restricted',
                    message: 'You have a blacklist badge. Cannot borrow until cleared by admin.',
                    icon: '⚫',
                    color: '#dc3545',
                    required: ['blacklist:false'],
                    hierarchy: 'borrowers',
                    action: {
                        label: 'View Blacklist Status',
                        url: 'blacklist/status.html',
                        method: 'navigate'
                    }
                },
                'max-groups': {
                    title: 'Group Limit Reached',
                    message: 'Borrowers can join maximum 4 groups. Leave a group to join another.',
                    icon: '🚫',
                    color: '#f37021',
                    required: ['groups:<=4'],
                    hierarchy: 'borrowers',
                    action: {
                        label: 'Manage Groups',
                        url: 'borrower/groups.html',
                        method: 'navigate'
                    }
                },
                'low-rating': {
                    title: 'Rating Too Low',
                    message: 'Your borrower rating is too low for this feature. Improve your repayment history.',
                    icon: '⭐',
                    color: '#f37021',
                    required: ['rating:>=3'],
                    hierarchy: 'borrowers',
                    action: {
                        label: 'View Rating',
                        url: 'borrower/rating.html',
                        method: 'navigate'
                    }
                },
                
                // Ledger access denials
                'ledger-owner': {
                    title: 'Ledger Owner Access Only',
                    message: 'Only the lender who created this ledger can access it.',
                    icon: '📒',
                    color: '#6f42c1',
                    required: ['ledger:owner'],
                    hierarchy: 'ledgers',
                    action: {
                        label: 'View Your Ledgers',
                        url: 'lender/ledgers.html',
                        method: 'redirect'
                    }
                },
                'admin-override': {
                    title: 'Admin Override Required',
                    message: 'This ledger has been locked. Only platform admin can override.',
                    icon: '👑',
                    color: '#6f42c1',
                    required: ['role:admin'],
                    hierarchy: 'ledgers',
                    action: {
                        label: 'Contact Admin',
                        url: 'admin/contact.html',
                        method: 'contact'
                    }
                },
                
                // Emergency categories access denials
                'category-not-supported': {
                    title: 'Category Not Supported',
                    message: 'This emergency category is not supported by lenders in your group.',
                    icon: '🚫',
                    color: '#0099ff',
                    hierarchy: 'groups',
                    action: {
                        label: 'Browse Available Categories',
                        url: 'emergency/index.html',
                        method: 'navigate'
                    }
                },
                
                // General access denials
                'authentication-required': {
                    title: 'Authentication Required',
                    message: 'You must be logged in to access this feature.',
                    icon: '🔐',
                    color: '#6c757d',
                    required: ['authenticated'],
                    action: {
                        label: 'Sign In',
                        url: 'auth/login.html',
                        method: 'login'
                    }
                },
                'permission-denied': {
                    title: 'Permission Denied',
                    message: 'You do not have permission to access this resource.',
                    icon: '🚫',
                    color: '#dc3545'
                },
                'maintenance': {
                    title: 'Under Maintenance',
                    message: 'This feature is currently under maintenance. Please try again later.',
                    icon: '🔧',
                    color: '#6c757d',
                    action: {
                        label: 'Check Status',
                        url: 'status.html',
                        method: 'navigate'
                    }
                },
                'offline': {
                    title: 'Offline Mode',
                    message: 'This feature requires an internet connection.',
                    icon: '📶',
                    color: '#6c757d',
                    action: {
                        label: 'Retry Connection',
                        url: '#',
                        method: 'retry'
                    }
                }
            },
            // User role permissions matrix
            permissions: {
                'guest': {
                    can: ['view-home', 'view-countries', 'view-about', 'register', 'login'],
                    cannot: ['lend', 'borrow', 'view-groups', 'view-ledgers']
                },
                'borrower': {
                    can: ['borrow', 'view-groups', 'view-borrower-dashboard', 'view-emergency-categories'],
                    cannot: ['lend', 'view-lender-dashboard', 'create-ledgers'],
                    requires: ['country', 'group']
                },
                'lender': {
                    can: ['lend', 'view-lender-dashboard', 'create-ledgers', 'view-portfolio'],
                    cannot: ['borrow-from-own-ledger'],
                    requires: ['country', 'group', 'subscription:active']
                },
                'group-admin': {
                    can: ['manage-group', 'invite-members', 'view-group-stats'],
                    requires: ['country', 'group', 'role:group-admin']
                },
                'platform-admin': {
                    can: ['override-blacklist', 'edit-ledgers', 'manage-all-groups', 'view-audit-logs'],
                    requires: ['role:admin', 'admin-token']
                }
            },
            ...config
        };
        
        // Current user context
        this.userContext = this.loadUserContext();
        
        // Initialize
        this.init();
    }
    
    /**
     * Load user context from localStorage and session
     */
    loadUserContext() {
        try {
            return {
                authenticated: localStorage.getItem('mpesewa_auth_token') !== null,
                country: localStorage.getItem('mpesewa_country'),
                group: JSON.parse(localStorage.getItem('mpesewa_group') || 'null'),
                role: localStorage.getItem('mpesewa_role'),
                subscription: JSON.parse(localStorage.getItem('mpesewa_subscription') || 'null'),
                blacklist: JSON.parse(localStorage.getItem('mpesewa_blacklist') || 'null'),
                rating: parseInt(localStorage.getItem('mpesewa_rating') || '0'),
                groups: JSON.parse(localStorage.getItem('mpesewa_groups') || '[]'),
                permissions: JSON.parse(localStorage.getItem('mpesewa_permissions') || '[]')
            };
        } catch (error) {
            console.error('Failed to load user context:', error);
            return {
                authenticated: false,
                country: null,
                group: null,
                role: null,
                subscription: null,
                blacklist: null,
                rating: 0,
                groups: [],
                permissions: []
            };
        }
    }
    
    init() {
        // Add global styles
        this.addStyles();
        
        // Listen for auth changes
        this.setupAuthListener();
    }
    
    addStyles() {
        if (!document.querySelector('#mp-access-denied-styles')) {
            const style = document.createElement('style');
            style.id = 'mp-access-denied-styles';
            style.textContent = `
                .access-denied-container {
                    min-height: 70vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }
                
                .access-denied-card {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 51, 102, 0.15);
                    padding: 3rem;
                    max-width: 600px;
                    width: 100%;
                    border: 1px solid #e9ecef;
                    position: relative;
                    overflow: hidden;
                }
                
                .access-denied-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 6px;
                    background: linear-gradient(90deg, #003366, #0099ff, #28a745, #f37021);
                }
                
                .access-denied-icon {
                    font-size: 5rem;
                    text-align: center;
                    margin-bottom: 1.5rem;
                    animation: bounce 2s ease-in-out infinite;
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .access-denied-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #003366;
                    text-align: center;
                    margin-bottom: 1rem;
                    font-family: 'Poppins', sans-serif;
                }
                
                .access-denied-message {
                    font-size: 1.1rem;
                    color: #555555;
                    text-align: center;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }
                
                .access-denied-reason {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    border-left: 4px solid #dc3545;
                }
                
                .reason-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #dc3545;
                    margin-bottom: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .reason-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .reason-item {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .reason-item:last-child {
                    border-bottom: none;
                }
                
                .requirement-status {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                .requirement-status.met {
                    background: #28a745;
                    color: white;
                }
                
                .requirement-status.unmet {
                    background: #dc3545;
                    color: white;
                }
                
                .requirement-text {
                    flex: 1;
                    color: #495057;
                }
                
                .hierarchy-display {
                    background: #003366;
                    color: white;
                    border-radius: 10px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .hierarchy-title {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.8;
                    margin-bottom: 1rem;
                }
                
                .hierarchy-path {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                    font-size: 1.1rem;
                }
                
                .hierarchy-level {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                }
                
                .hierarchy-level.active {
                    background: rgba(255, 255, 255, 0.2);
                    font-weight: 600;
                }
                
                .hierarchy-arrow {
                    color: rgba(255, 255, 255, 0.5);
                }
                
                .access-denied-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .btn-access {
                    padding: 0.875rem 1.75rem;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    min-width: 140px;
                    text-align: center;
                }
                
                .btn-primary-access {
                    background: #003366;
                    color: white;
                }
                
                .btn-primary-access:hover {
                    background: #002244;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 51, 102, 0.2);
                }
                
                .btn-secondary-access {
                    background: #f8f9fa;
                    color: #003366;
                    border: 2px solid #003366;
                }
                
                .btn-secondary-access:hover {
                    background: #003366;
                    color: white;
                    transform: translateY(-2px);
                }
                
                .btn-danger-access {
                    background: #dc3545;
                    color: white;
                }
                
                .btn-danger-access:hover {
                    background: #c82333;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
                }
                
                .user-context {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e9ecef;
                    text-align: center;
                }
                
                .context-title {
                    font-size: 0.9rem;
                    color: #6c757d;
                    margin-bottom: 0.75rem;
                }
                
                .context-badges {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                
                .context-badge {
                    padding: 0.25rem 0.75rem;
                    background: #e9ecef;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    color: #495057;
                }
                
                .context-badge.active {
                    background: #28a745;
                    color: white;
                }
                
                .context-badge.inactive {
                    background: #dc3545;
                    color: white;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .access-denied-container {
                        padding: 1rem;
                    }
                    
                    .access-denied-card {
                        padding: 2rem 1.5rem;
                    }
                    
                    .access-denied-icon {
                        font-size: 4rem;
                    }
                    
                    .access-denied-title {
                        font-size: 1.5rem;
                    }
                    
                    .access-denied-message {
                        font-size: 1rem;
                    }
                    
                    .access-denied-actions {
                        flex-direction: column;
                    }
                    
                    .btn-access {
                        width: 100%;
                    }
                    
                    .hierarchy-path {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    
                    .hierarchy-arrow {
                        display: none;
                    }
                }
                
                /* Dark mode */
                @media (prefers-color-scheme: dark) {
                    .access-denied-container {
                        background: linear-gradient(135deg, #1a1d2e 0%, #2d3748 100%);
                    }
                    
                    .access-denied-card {
                        background: #2d3748;
                        border-color: #4a5568;
                    }
                    
                    .access-denied-title {
                        color: #ffffff;
                    }
                    
                    .access-denied-message {
                        color: #a0aec0;
                    }
                    
                    .access-denied-reason {
                        background: #4a5568;
                        border-left-color: #fc8181;
                    }
                    
                    .reason-title {
                        color: #fc8181;
                    }
                    
                    .requirement-text {
                        color: #cbd5e0;
                    }
                    
                    .btn-secondary-access {
                        background: #4a5568;
                        color: #e2e8f0;
                        border-color: #718096;
                    }
                    
                    .user-context {
                        border-color: #4a5568;
                    }
                    
                    .context-badge {
                        background: #4a5568;
                        color: #cbd5e0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupAuthListener() {
        // Listen for storage events to update context
        window.addEventListener('storage', (e) => {
            if (e.key.startsWith('mpesewa_')) {
                this.userContext = this.loadUserContext();
            }
        });
    }
    
    /**
     * Check if user has required permissions
     * @param {Array} requirements - Array of requirement strings
     * @returns {Object} Check result
     */
    checkRequirements(requirements = []) {
        const results = [];
        let allMet = true;
        
        requirements.forEach(req => {
            let met = false;
            let value = null;
            
            if (req === 'authenticated') {
                met = this.userContext.authenticated;
                value = this.userContext.authenticated;
            } else if (req === 'country') {
                met = !!this.userContext.country;
                value = this.userContext.country;
            } else if (req === 'group') {
                met = !!this.userContext.group;
                value = this.userContext.group?.name;
            } else if (req === 'role:lender') {
                met = this.userContext.role === 'lender';
                value = this.userContext.role;
            } else if (req === 'role:borrower') {
                met = this.userContext.role === 'borrower';
                value = this.userContext.role;
            } else if (req === 'role:admin') {
                met = this.userContext.role === 'admin';
                value = this.userContext.role;
            } else if (req === 'subscription:active') {
                met = this.userContext.subscription?.active === true;
                value = this.userContext.subscription?.level;
            } else if (req === 'subscription:tier') {
                met = this.userContext.subscription?.level === 'premium' || this.userContext.subscription?.level === 'super';
                value = this.userContext.subscription?.level;
            } else if (req === 'blacklist:false') {
                met = !this.userContext.blacklist;
                value = !this.userContext.blacklist;
            } else if (req === 'groups:<=4') {
                met = this.userContext.groups.length <= 4;
                value = this.userContext.groups.length;
            } else if (req === 'rating:>=3') {
                met = this.userContext.rating >= 3;
                value = this.userContext.rating;
            } else if (req === 'ledger:owner') {
                // This would require additional context
                met = false; // Default to false, would need specific check
                value = 'unknown';
            }
            
            results.push({
                requirement: req,
                met,
                value,
                description: this.getRequirementDescription(req)
            });
            
            if (!met) allMet = false;
        });
        
        return { allMet, results };
    }
    
    getRequirementDescription(req) {
        const descriptions = {
            'authenticated': 'User must be logged in',
            'country': 'Country must be selected',
            'group': 'Must be a member of a group',
            'role:lender': 'Must have lender role',
            'role:borrower': 'Must have borrower role',
            'role:admin': 'Must have admin role',
            'subscription:active': 'Active subscription required',
            'subscription:tier': 'Higher subscription tier required',
            'blacklist:false': 'Cannot be blacklisted',
            'groups:<=4': 'Maximum 4 groups allowed',
            'rating:>=3': 'Minimum 3-star rating required',
            'ledger:owner': 'Must be ledger owner'
        };
        
        return descriptions[req] || req;
    }
    
    /**
     * Get hierarchy path for display
     * @param {string} targetLevel - Target hierarchy level
     * @returns {Array} Hierarchy levels with status
     */
    getHierarchyPath(targetLevel) {
        const hierarchy = {
            'global': { icon: '🌍', name: 'Global', active: true },
            'countries': { icon: '🇺🇳', name: 'Country', active: !!this.userContext.country },
            'groups': { icon: '👥', name: 'Group', active: !!this.userContext.group },
            'lenders': { icon: '💰', name: 'Lender', active: this.userContext.role === 'lender' },
            'ledgers': { icon: '📒', name: 'Ledger', active: false }, // Would need specific check
            'borrowers': { icon: '🙋', name: 'Borrower', active: this.userContext.role === 'borrower' }
        };
        
        const levels = ['global', 'countries', 'groups'];
        if (targetLevel === 'lenders' || targetLevel === 'ledgers') {
            levels.push('lenders');
            if (targetLevel === 'ledgers') levels.push('ledgers');
        } else if (targetLevel === 'borrowers') {
            levels.push('borrowers');
        }
        
        return levels.map(level => hierarchy[level]);
    }
    
    /**
     * Render access denied component
     * @param {string} reason - Reason key
     * @param {Object} options - Additional options
     * @returns {string} HTML string
     */
    render(reason = 'permission-denied', options = {}) {
        const config = this.config.reasons[reason] || this.config.reasons['permission-denied'];
        const requirementCheck = this.checkRequirements(config.required || []);
        const hierarchyPath = this.getHierarchyPath(config.hierarchy || 'global');
        
        return `
            <div class="access-denied-container">
                <div class="access-denied-card">
                    <div class="access-denied-icon" style="color: ${config.color};">
                        ${config.icon}
                    </div>
                    
                    <h1 class="access-denied-title">${config.title}</h1>
                    
                    <p class="access-denied-message">${config.message}</p>
                    
                    ${config.required && config.required.length > 0 ? `
                        <div class="access-denied-reason">
                            <div class="reason-title">
                                <span>🔍 Missing Requirements</span>
                            </div>
                            <ul class="reason-list">
                                ${requirementCheck.results.map(req => `
                                    <li class="reason-item">
                                        <span class="requirement-status ${req.met ? 'met' : 'unmet'}">
                                            ${req.met ? '✓' : '✗'}
                                        </span>
                                        <span class="requirement-text">
                                            ${req.description}
                                            ${req.value !== null ? `<small style="opacity: 0.7;"> (Current: ${req.value})</small>` : ''}
                                        </span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${config.hierarchy ? `
                        <div class="hierarchy-display">
                            <div class="hierarchy-title">Required Hierarchy Level</div>
                            <div class="hierarchy-path">
                                ${hierarchyPath.map((level, index) => `
                                    <div class="hierarchy-level ${level.active ? 'active' : ''}" 
                                         style="${!level.active ? 'opacity: 0.5;' : ''}">
                                        ${level.icon} ${level.name}
                                    </div>
                                    ${index < hierarchyPath.length - 1 ? '<span class="hierarchy-arrow">→</span>' : ''}
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${config.action ? `
                        <div class="access-denied-actions">
                            <a href="${config.action.url}" 
                               class="btn-access btn-primary-access"
                               data-action-method="${config.action.method}">
                                ${config.action.label}
                            </a>
                            <a href="index.html" class="btn-access btn-secondary-access">
                                Return Home
                            </a>
                        </div>
                    ` : `
                        <div class="access-denied-actions">
                            <a href="index.html" class="btn-access btn-primary-access">
                                Return Home
                            </a>
                        </div>
                    `}
                    
                    <div class="user-context">
                        <div class="context-title">Your Current Access Level</div>
                        <div class="context-badges">
                            ${this.userContext.country ? `
                                <span class="context-badge active">🇺🇳 ${this.userContext.country}</span>
                            ` : `
                                <span class="context-badge inactive">No Country</span>
                            `}
                            
                            ${this.userContext.group ? `
                                <span class="context-badge active">👥 ${this.userContext.group.name}</span>
                            ` : `
                                <span class="context-badge inactive">No Group</span>
                            `}
                            
                            ${this.userContext.role ? `
                                <span class="context-badge ${this.userContext.role === 'lender' ? 'active' : 'active'}">
                                    ${this.userContext.role === 'lender' ? '💰' : '🙋'} ${this.userContext.role}
                                </span>
                            ` : `
                                <span class="context-badge inactive">No Role</span>
                            `}
                            
                            ${this.userContext.subscription?.active ? `
                                <span class="context-badge active">📋 ${this.userContext.subscription.level}</span>
                            ` : this.userContext.role === 'lender' ? `
                                <span class="context-badge inactive">No Subscription</span>
                            ` : ''}
                            
                            ${this.userContext.blacklist ? `
                                <span class="context-badge inactive">⚫ Blacklisted</span>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Show access denied page
     * @param {string} reason - Reason key
     * @param {HTMLElement} container - Container element
     */
    show(reason = 'permission-denied', container = document.body) {
        const html = this.render(reason);
        
        if (container === document.body) {
            // Replace entire page content
            document.body.innerHTML = html;
            this.setupActionHandlers();
        } else {
            // Replace container content
            container.innerHTML = html;
            this.setupActionHandlers(container);
        }
    }
    
    setupActionHandlers(container = document) {
        // Handle action buttons
        container.querySelectorAll('[data-action-method]').forEach(button => {
            button.addEventListener('click', (e) => {
                const method = button.dataset.actionMethod;
                const url = button.href;
                
                switch (method) {
                    case 'logout':
                        e.preventDefault();
                        this.handleLogout(url);
                        break;
                    case 'register':
                        e.preventDefault();
                        this.handleRegistration(url);
                        break;
                    case 'payment':
                        e.preventDefault();
                        this.handlePayment(url);
                        break;
                    case 'contact':
                        e.preventDefault();
                        this.handleContact(url);
                        break;
                    case 'retry':
                        e.preventDefault();
                        this.handleRetry();
                        break;
                }
            });
        });
    }
    
    handleLogout(url) {
        // Clear auth data
        localStorage.removeItem('mpesewa_auth_token');
        localStorage.removeItem('mpesewa_role');
        localStorage.removeItem('mpesewa_country');
        localStorage.removeItem('mpesewa_group');
        localStorage.removeItem('mpesewa_subscription');
        
        // Redirect
        window.location.href = url;
    }
    
    handleRegistration(url) {
        // Store intended destination
        localStorage.setItem('mpesewa_redirect_after_auth', window.location.href);
        window.location.href = url;
    }
    
    handlePayment(url) {
        // Open payment modal or redirect
        window.location.href = url;
    }
    
    handleContact(url) {
        // Open contact form
        window.location.href = url;
    }
    
    handleRetry() {
        window.location.reload();
    }
    
    /**
     * Check if user can access a feature
     * @param {string} feature - Feature name
     * @returns {Object} Access check result
     */
    canAccess(feature) {
        const role = this.userContext.role || 'guest';
        const permissions = this.config.permissions[role];
        
        if (!permissions) {
            return {
                allowed: false,
                reason: 'unknown-role',
                message: `Unknown role: ${role}`
            };
        }
        
        // Check if feature is in can list
        if (permissions.can.includes(feature)) {
            // Check requirements
            if (permissions.requires) {
                const reqCheck = this.checkRequirements(permissions.requires);
                if (!reqCheck.allMet) {
                    return {
                        allowed: false,
                        reason: 'requirements-not-met',
                        message: 'Role requirements not met',
                        missing: reqCheck.results.filter(r => !r.met)
                    };
                }
            }
            
            return { allowed: true };
        }
        
        // Check if feature is explicitly denied
        if (permissions.cannot.includes(feature)) {
            return {
                allowed: false,
                reason: 'explicitly-denied',
                message: `Feature ${feature} is explicitly denied for ${role} role`
            };
        }
        
        // Default deny
        return {
            allowed: false,
            reason: 'permission-denied',
            message: `No permission for feature: ${feature}`
        };
    }
    
    /**
     * Guard a route/feature
     * @param {string} feature - Feature name
     * @param {Function} callback - Callback if allowed
     * @param {Function} denyCallback - Callback if denied
     */
    guard(feature, callback, denyCallback) {
        const access = this.canAccess(feature);
        
        if (access.allowed) {
            if (callback) callback();
        } else {
            if (denyCallback) {
                denyCallback(access);
            } else {
                this.show(access.reason);
            }
        }
        
        return access;
    }
    
    /**
     * Register web component
     */
    static registerWebComponent() {
        if (!customElements.get('mp-access-denied')) {
            class MPAccessDenied extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.accessDenied = new AccessDenied();
                }
                
                connectedCallback() {
                    const reason = this.getAttribute('reason') || 'permission-denied';
                    const feature = this.getAttribute('feature');
                    
                    if (feature) {
                        const access = this.accessDenied.canAccess(feature);
                        if (!access.allowed) {
                            this.shadowRoot.innerHTML = this.accessDenied.render(access.reason);
                        } else {
                            this.style.display = 'none';
                        }
                    } else {
                        this.shadowRoot.innerHTML = this.accessDenied.render(reason);
                    }
                }
                
                static get observedAttributes() {
                    return ['reason', 'feature'];
                }
                
                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue !== newValue && this.isConnected) {
                        this.connectedCallback();
                    }
                }
            }
            
            customElements.define('mp-access-denied', MPAccessDenied);
        }
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessDenied;
} else if (typeof window !== 'undefined') {
    window.MPAccessDenied = AccessDenied;
    
    // Auto-initialize
    document.addEventListener('DOMContentLoaded', () => {
        AccessDenied.registerWebComponent();
        
        // Auto-show access denied for guarded elements
        document.querySelectorAll('[data-guard-feature]').forEach(element => {
            const feature = element.dataset.guardFeature;
            const accessDenied = new AccessDenied();
            const access = accessDenied.canAccess(feature);
            
            if (!access.allowed) {
                element.innerHTML = accessDenied.render(access.reason);
                accessDenied.setupActionHandlers(element);
            }
        });
    });
}

// Global access guard function
if (typeof window !== 'undefined') {
    window.guardAccess = function(feature, callback, denyCallback) {
        const accessDenied = new AccessDenied();
        return accessDenied.guard(feature, callback, denyCallback);
    };
}