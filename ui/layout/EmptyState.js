/**
 * M-Pesewa Empty State Component
 * Displays empty state UI for various scenarios across the platform
 * Strictly enforces M-Pesewa hierarchy: Global → Countries → Groups → Lenders → Ledgers → Borrowers
 */

class EmptyState {
    constructor(config = {}) {
        this.config = {
            // Default empty state types mapped to M-Pesewa hierarchy
            types: {
                // Country-level empty states
                'no-country': {
                    title: 'No Country Selected',
                    message: 'Please select your country to continue. Country selection enforces strict isolation rules.',
                    icon: '🇺🇳',
                    color: '#003366',
                    action: {
                        label: 'Select Country',
                        url: 'countries/index.html'
                    }
                },
                
                // Group-level empty states
                'no-groups': {
                    title: 'No Groups Found',
                    message: 'You are not a member of any lending group. Groups are invitation-only trusted circles.',
                    icon: '👥',
                    color: '#0099ff',
                    action: {
                        label: 'Browse Groups',
                        url: 'groups/index.html'
                    }
                },
                'group-invite': {
                    title: 'Group Invitation Required',
                    message: 'M-Pesewa operates in trusted circles. You need an invitation from a group member to join.',
                    icon: '📨',
                    color: '#0099ff',
                    action: {
                        label: 'Request Invite',
                        url: 'groups/invite.html'
                    }
                },
                
                // Lender-level empty states
                'no-lenders': {
                    title: 'No Lenders Available',
                    message: 'There are no active lenders in your group. Lenders require active subscriptions to participate.',
                    icon: '💰',
                    color: '#28a745',
                    action: {
                        label: 'Become a Lender',
                        url: 'auth/register.html?role=lender'
                    }
                },
                'no-subscription': {
                    title: 'Subscription Required',
                    message: 'Lenders must have an active subscription. Choose Basic, Premium, or Super tier to start lending.',
                    icon: '📋',
                    color: '#28a745',
                    hierarchy: 'lender',
                    action: {
                        label: 'View Plans',
                        url: 'subscription/plans.html'
                    }
                },
                'subscription-expired': {
                    title: 'Subscription Expired',
                    message: 'Your lending subscription expired on the 28th. Renew to regain access to lending tools.',
                    icon: '⏰',
                    color: '#f37021',
                    hierarchy: 'lender',
                    action: {
                        label: 'Renew Now',
                        url: 'subscription/renew.html'
                    }
                },
                
                // Borrower-level empty states
                'no-borrowers': {
                    title: 'No Borrowers Available',
                    message: 'No borrowers in your group are currently eligible for loans.',
                    icon: '🙋',
                    color: '#f37021',
                    action: {
                        label: 'Invite Borrowers',
                        url: 'groups/invite.html?role=borrower'
                    }
                },
                'max-groups': {
                    title: 'Maximum Groups Reached',
                    message: 'Borrowers can join up to 4 groups maximum. Leave a group to join a new one.',
                    icon: '🚫',
                    color: '#f37021',
                    hierarchy: 'borrower',
                    action: {
                        label: 'Manage Groups',
                        url: 'borrower/groups.html'
                    }
                },
                'blacklisted': {
                    title: 'Borrowing Restricted',
                    message: 'You have a blacklist badge. Clear your outstanding balances to borrow again.',
                    icon: '⚫',
                    color: '#dc3545',
                    hierarchy: 'borrower',
                    action: {
                        label: 'View Status',
                        url: 'blacklist/status.html'
                    }
                },
                
                // Ledger-level empty states
                'no-ledgers': {
                    title: 'No Active Ledgers',
                    message: 'You don\'t have any active loan ledgers. Ledgers are created when you approve loans.',
                    icon: '📒',
                    color: '#6f42c1',
                    hierarchy: 'lender',
                    action: {
                        label: 'View Loan Requests',
                        url: 'lender/requests.html'
                    }
                },
                'no-repayments': {
                    title: 'No Repayments Due',
                    message: 'All your borrowers are up-to-date with repayments. Great work!',
                    icon: '✅',
                    color: '#28a745',
                    hierarchy: 'lender'
                },
                
                // Emergency categories
                'no-emergency': {
                    title: 'No Emergency Categories',
                    message: 'No emergency loan categories are available in your group.',
                    icon: '🚨',
                    color: '#0099ff',
                    action: {
                        label: 'Browse All Categories',
                        url: 'emergency/index.html'
                    }
                },
                
                // General empty states
                'no-data': {
                    title: 'No Data Available',
                    message: 'There\'s nothing to display here yet.',
                    icon: '📊',
                    color: '#6c757d'
                },
                'search-empty': {
                    title: 'No Results Found',
                    message: 'Try adjusting your search criteria or filters.',
                    icon: '🔍',
                    color: '#6c757d',
                    action: {
                        label: 'Clear Filters',
                        url: '#'
                    }
                },
                'offline': {
                    title: 'Offline Mode',
                    message: 'You\'re currently offline. Some features may be limited.',
                    icon: '📶',
                    color: '#6c757d',
                    action: {
                        label: 'Retry Connection',
                        url: '#'
                    }
                }
            },
            // Hierarchy validation rules
            hierarchyRules: {
                'global': {
                    parent: null,
                    children: ['countries'],
                    color: '#003366',
                    icon: '🌍'
                },
                'countries': {
                    parent: 'global',
                    children: ['groups'],
                    color: '#0099ff',
                    icon: '🇺🇳',
                    validation: (country) => {
                        const validCountries = [
                            'kenya', 'uganda', 'tanzania', 'rwanda', 'drc', 
                            'burundi', 'nigeria', 'ghana', 'south-sudan', 
                            'somalia', 'south-africa', 'ethiopia'
                        ];
                        return validCountries.includes(country.toLowerCase());
                    }
                },
                'groups': {
                    parent: 'countries',
                    children: ['lenders', 'borrowers'],
                    color: '#0099ff',
                    icon: '👥',
                    validation: (group) => {
                        // Group must have 5-1000 members
                        return group.members >= 5 && group.members <= 1000;
                    }
                },
                'lenders': {
                    parent: 'groups',
                    children: ['ledgers'],
                    color: '#28a745',
                    icon: '💰',
                    validation: (lender) => {
                        // Lender must have active subscription
                        return lender.subscription && lender.subscription.active;
                    }
                },
                'ledgers': {
                    parent: 'lenders',
                    children: [],
                    color: '#6f42c1',
                    icon: '📒',
                    validation: (ledger) => {
                        // Ledger must have borrower and amount
                        return ledger.borrower && ledger.amount > 0;
                    }
                },
                'borrowers': {
                    parent: 'groups',
                    children: [],
                    color: '#f37021',
                    icon: '🙋',
                    validation: (borrower) => {
                        // Borrower must be in max 4 groups and not blacklisted
                        return borrower.groups <= 4 && !borrower.blacklisted;
                    }
                }
            },
            ...config
        };
        
        // Current user context
        this.userContext = {
            country: null,
            group: null,
            role: null,
            subscription: null,
            blacklist: null
        };
        
        // Initialize
        this.loadUserContext();
    }
    
    /**
     * Load user context from localStorage
     */
    loadUserContext() {
        try {
            this.userContext = {
                country: localStorage.getItem('mpesewa_country'),
                group: JSON.parse(localStorage.getItem('mpesewa_group') || 'null'),
                role: localStorage.getItem('mpesewa_role'),
                subscription: JSON.parse(localStorage.getItem('mpesewa_subscription') || 'null'),
                blacklist: JSON.parse(localStorage.getItem('mpesewa_blacklist') || 'null')
            };
        } catch (error) {
            console.error('Failed to load user context:', error);
        }
    }
    
    /**
     * Validate hierarchy for current context
     * @param {string} hierarchyLevel - The level to validate
     * @returns {Object} Validation result
     */
    validateHierarchy(hierarchyLevel) {
        const rules = this.config.hierarchyRules[hierarchyLevel];
        if (!rules) {
            return { valid: false, error: `Invalid hierarchy level: ${hierarchyLevel}` };
        }
        
        // Check parent requirement
        if (rules.parent && !this.userContext[rules.parent]) {
            return {
                valid: false,
                error: `${hierarchyLevel} requires a parent ${rules.parent}`,
                required: rules.parent
            };
        }
        
        // Run custom validation if exists
        if (rules.validation) {
            const context = this.userContext[hierarchyLevel] || {};
            const validationResult = rules.validation(context);
            if (validationResult !== true) {
                return {
                    valid: false,
                    error: validationResult || `Validation failed for ${hierarchyLevel}`
                };
            }
        }
        
        return { valid: true };
    }
    
    /**
     * Get empty state configuration
     * @param {string} type - Empty state type
     * @returns {Object} Configuration object
     */
    getConfig(type) {
        const defaultConfig = this.config.types['no-data'];
        const typeConfig = this.config.types[type] || defaultConfig;
        
        // Inject hierarchy information
        if (typeConfig.hierarchy) {
            const hierarchyRules = this.config.hierarchyRules[typeConfig.hierarchy];
            if (hierarchyRules) {
                typeConfig.hierarchyInfo = {
                    level: typeConfig.hierarchy,
                    parent: hierarchyRules.parent,
                    children: hierarchyRules.children,
                    icon: hierarchyRules.icon
                };
            }
        }
        
        return typeConfig;
    }
    
    /**
     * Render empty state component
     * @param {string} type - Empty state type
     * @param {Object} customConfig - Custom configuration overrides
     * @returns {string} HTML string
     */
    render(type = 'no-data', customConfig = {}) {
        const config = { ...this.getConfig(type), ...customConfig };
        
        // Check hierarchy validation for this type
        if (config.hierarchy) {
            const validation = this.validateHierarchy(config.hierarchy);
            if (!validation.valid) {
                config.message += ` ${validation.error}`;
            }
        }
        
        // Determine if action should be shown based on user context
        let showAction = config.action;
        if (config.hierarchy === 'lender' && this.userContext.role !== 'lender') {
            showAction = false;
        }
        if (config.hierarchy === 'borrower' && this.userContext.role !== 'borrower') {
            showAction = false;
        }
        
        return `
            <div class="empty-state" data-type="${type}" data-hierarchy="${config.hierarchy || 'none'}">
                <div class="empty-state-icon" style="color: ${config.color};">
                    <span class="icon">${config.icon}</span>
                </div>
                
                <div class="empty-state-content">
                    <h3 class="empty-state-title">${config.title}</h3>
                    <p class="empty-state-message">${config.message}</p>
                    
                    ${config.hierarchyInfo ? `
                        <div class="empty-state-hierarchy">
                            <span class="hierarchy-badge" style="background-color: ${config.color}20; color: ${config.color};">
                                ${config.hierarchyInfo.icon} ${config.hierarchy}
                            </span>
                        </div>
                    ` : ''}
                    
                    ${showAction ? `
                        <div class="empty-state-actions">
                            <a href="${showAction.url}" class="btn btn-action" style="background-color: ${config.color}; color: white;">
                                ${showAction.label}
                            </a>
                        </div>
                    ` : ''}
                </div>
                
                ${this.renderHierarchyPath(config.hierarchy)}
            </div>
        `;
    }
    
    /**
     * Render hierarchy path for context
     * @param {string} hierarchyLevel - Current hierarchy level
     * @returns {string} HTML string
     */
    renderHierarchyPath(hierarchyLevel) {
        if (!hierarchyLevel) return '';
        
        const path = this.getHierarchyPath(hierarchyLevel);
        if (path.length === 0) return '';
        
        return `
            <div class="empty-state-hierarchy-path">
                <div class="hierarchy-path-title">M-Pesewa Hierarchy:</div>
                <div class="hierarchy-path">
                    ${path.map((level, index) => `
                        <span class="path-level ${level.active ? 'active' : ''}" 
                              style="color: ${level.color}; ${index === path.length - 1 ? 'font-weight: bold;' : ''}">
                            ${level.icon} ${level.name}
                            ${index < path.length - 1 ? '<span class="path-separator">→</span>' : ''}
                        </span>
                    `).join('')}
                </div>
                
                ${this.userContext.country ? `
                    <div class="current-context">
                        <span class="context-label">Current:</span>
                        ${this.userContext.country ? `<span class="context-badge">🇺🇳 ${this.userContext.country}</span>` : ''}
                        ${this.userContext.group ? `<span class="context-badge">👥 ${this.userContext.group.name}</span>` : ''}
                        ${this.userContext.role ? `<span class="context-badge ${this.userContext.role === 'lender' ? 'lender-badge' : 'borrower-badge'}">
                            ${this.userContext.role === 'lender' ? '💰' : '🙋'} ${this.userContext.role}
                        </span>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Get hierarchy path from global to specified level
     * @param {string} targetLevel - Target hierarchy level
     * @returns {Array} Path array
     */
    getHierarchyPath(targetLevel) {
        const path = [];
        let current = targetLevel;
        
        // Build path upwards
        while (current) {
            const rules = this.config.hierarchyRules[current];
            if (rules) {
                path.unshift({
                    name: current,
                    icon: rules.icon,
                    color: rules.color,
                    active: this.userContext[current] !== null
                });
                current = rules.parent;
            } else {
                break;
            }
        }
        
        // Always include global at the beginning
        if (path[0]?.name !== 'global') {
            path.unshift({
                name: 'global',
                icon: '🌍',
                color: '#003366',
                active: true
            });
        }
        
        return path;
    }
    
    /**
     * Render country-specific empty state
     * @param {string} country - Country code
     * @param {string} reason - Reason for empty state
     * @returns {string} HTML string
     */
    renderForCountry(country, reason = 'no-data') {
        const countryNames = {
            'kenya': 'Kenya',
            'uganda': 'Uganda',
            'tanzania': 'Tanzania',
            'rwanda': 'Rwanda',
            'drc': 'DR Congo',
            'burundi': 'Burundi',
            'nigeria': 'Nigeria',
            'ghana': 'Ghana',
            'south-sudan': 'South Sudan',
            'somalia': 'Somalia',
            'south-africa': 'South Africa',
            'ethiopia': 'Ethiopia'
        };
        
        const countryConfig = {
            title: `No Data for ${countryNames[country] || country}`,
            message: `There is no data available for ${countryNames[country] || country}. This country operates independently with strict isolation rules.`,
            icon: this.getCountryFlag(country),
            color: '#003366',
            action: {
                label: `Explore ${countryNames[country] || country}`,
                url: `countries/${country}.html`
            },
            hierarchy: 'countries'
        };
        
        return this.render(reason, countryConfig);
    }
    
    /**
     * Get country flag emoji
     * @param {string} country - Country code
     * @returns {string} Flag emoji
     */
    getCountryFlag(country) {
        const flags = {
            'kenya': '🇰🇪',
            'uganda': '🇺🇬',
            'tanzania': '🇹🇿',
            'rwanda': '🇷🇼',
            'drc': '🇨🇩',
            'burundi': '🇧🇮',
            'nigeria': '🇳🇬',
            'ghana': '🇬🇭',
            'south-sudan': '🇸🇸',
            'somalia': '🇸🇴',
            'south-africa': '🇿🇦',
            'ethiopia': '🇪🇹'
        };
        
        return flags[country] || '🇺🇳';
    }
    
    /**
     * Render group-specific empty state
     * @param {Object} group - Group data
     * @param {string} reason - Reason for empty state
     * @returns {string} HTML string
     */
    renderForGroup(group, reason = 'no-data') {
        const memberCount = group?.members || 0;
        const isFull = memberCount >= 1000;
        
        let config = {
            title: group ? `${group.name} Group` : 'Group',
            message: group ? `This group has ${memberCount} members. ${isFull ? 'Group is at maximum capacity (1000 members).' : ''}` : 'Group not found.',
            icon: '👥',
            color: '#0099ff',
            hierarchy: 'groups'
        };
        
        if (reason === 'no-members' && memberCount < 5) {
            config.message = `Group needs minimum 5 members to activate. Currently has ${memberCount} members.`;
            config.action = {
                label: 'Invite Members',
                url: 'groups/invite.html'
            };
        }
        
        return this.render(reason, config);
    }
    
    /**
     * Render lender-specific empty state
     * @param {Object} lender - Lender data
     * @param {string} reason - Reason for empty state
     * @returns {string} HTML string
     */
    renderForLender(lender, reason = 'no-data') {
        const hasSubscription = lender?.subscription?.active;
        const subscriptionLevel = lender?.subscription?.level || 'none';
        const isExpired = lender?.subscription?.expired;
        
        let config = {
            title: 'Lender Dashboard',
            message: hasSubscription 
                ? `Active ${subscriptionLevel} subscription. ${isExpired ? 'EXPIRED - Renew required.' : ''}`
                : 'Subscription required to lend.',
            icon: '💰',
            color: '#28a745',
            hierarchy: 'lenders'
        };
        
        if (reason === 'no-subscription') {
            config.title = 'Lending Access Locked';
            config.message = 'Lenders must have an active subscription. Subscription expires on the 28th of each month.';
            config.action = {
                label: 'Subscribe Now',
                url: 'subscription/plans.html'
            };
        }
        
        if (reason === 'subscription-expired') {
            config.title = 'Subscription Expired';
            config.message = `Your ${subscriptionLevel} subscription expired on ${lender?.subscription?.expiryDate || 'the 28th'}. Lending access is blocked until renewal.`;
            config.action = {
                label: 'Renew Subscription',
                url: 'subscription/renew.html'
            };
        }
        
        return this.render(reason, config);
    }
    
    /**
     * Render borrower-specific empty state
     * @param {Object} borrower - Borrower data
     * @param {string} reason - Reason for empty state
     * @returns {string} HTML string
     */
    renderForBorrower(borrower, reason = 'no-data') {
        const isBlacklisted = borrower?.blacklisted;
        const groupCount = borrower?.groups || 0;
        const maxGroups = 4;
        
        let config = {
            title: 'Borrower Dashboard',
            message: isBlacklisted 
                ? 'Blacklisted - Borrowing access restricted.'
                : `Member of ${groupCount} out of ${maxGroups} maximum groups.`,
            icon: '🙋',
            color: '#f37021',
            hierarchy: 'borrowers'
        };
        
        if (reason === 'blacklisted') {
            config.title = 'Borrowing Restricted';
            config.message = 'You have a blacklist badge. Clear outstanding balances and get admin approval to borrow again.';
            config.action = {
                label: 'View Blacklist Status',
                url: 'blacklist/status.html'
            };
        }
        
        if (reason === 'max-groups') {
            config.title = 'Group Limit Reached';
            config.message = `You are in ${groupCount} groups (max ${maxGroups}). Leave a group to join another.`;
            config.action = {
                label: 'Manage Groups',
                url: 'borrower/groups.html'
            };
        }
        
        return this.render(reason, config);
    }
    
    /**
     * Initialize empty state styling
     * @returns {string} CSS string
     */
    static getStyles() {
        return `
            <style>
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1.5rem;
                    text-align: center;
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 51, 102, 0.1);
                    border: 1px solid #e9ecef;
                    margin: 2rem auto;
                    max-width: 600px;
                    transition: all 0.3s ease;
                }
                
                .empty-state:hover {
                    box-shadow: 0 8px 30px rgba(0, 51, 102, 0.15);
                    transform: translateY(-2px);
                }
                
                .empty-state-icon {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                    animation: float 3s ease-in-out infinite;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .empty-state-content {
                    width: 100%;
                }
                
                .empty-state-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #003366;
                    margin-bottom: 0.75rem;
                    font-family: 'Poppins', sans-serif;
                }
                
                .empty-state-message {
                    font-size: 1rem;
                    color: #555555;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    max-width: 80%;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .empty-state-hierarchy {
                    margin: 1rem 0;
                }
                
                .hierarchy-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    margin: 0.25rem;
                }
                
                .empty-state-actions {
                    margin-top: 1.5rem;
                }
                
                .btn-action {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                }
                
                .btn-action:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .empty-state-hierarchy-path {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e9ecef;
                    width: 100%;
                }
                
                .hierarchy-path-title {
                    font-size: 0.9rem;
                    color: #6c757d;
                    margin-bottom: 0.75rem;
                    font-weight: 500;
                }
                
                .hierarchy-path {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                
                .path-level {
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                
                .path-level.active {
                    font-weight: 600;
                }
                
                .path-separator {
                    color: #adb5bd;
                    margin-left: 0.5rem;
                }
                
                .current-context {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                .context-label {
                    font-size: 0.85rem;
                    color: #6c757d;
                    align-self: center;
                }
                
                .context-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    background: #f8f9fa;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    color: #003366;
                    border: 1px solid #dee2e6;
                }
                
                .lender-badge {
                    background: rgba(40, 167, 69, 0.1);
                    color: #28a745;
                    border-color: rgba(40, 167, 69, 0.2);
                }
                
                .borrower-badge {
                    background: rgba(243, 112, 33, 0.1);
                    color: #f37021;
                    border-color: rgba(243, 112, 33, 0.2);
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .empty-state {
                        padding: 2rem 1rem;
                        margin: 1rem;
                    }
                    
                    .empty-state-icon {
                        font-size: 3rem;
                    }
                    
                    .empty-state-title {
                        font-size: 1.25rem;
                    }
                    
                    .empty-state-message {
                        max-width: 100%;
                    }
                    
                    .hierarchy-path {
                        flex-direction: column;
                        gap: 0.25rem;
                    }
                    
                    .path-separator {
                        display: none;
                    }
                }
                
                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .empty-state {
                        background: #1a1d2e;
                        border-color: #2d3748;
                    }
                    
                    .empty-state-title {
                        color: #ffffff;
                    }
                    
                    .empty-state-message {
                        color: #a0aec0;
                    }
                    
                    .context-badge {
                        background: #2d3748;
                        color: #e2e8f0;
                        border-color: #4a5568;
                    }
                    
                    .empty-state-hierarchy-path {
                        border-color: #2d3748;
                    }
                }
            </style>
        `;
    }
    
    /**
     * Register web component if supported
     */
    static registerWebComponent() {
        if (!customElements.get('mp-empty-state')) {
            class MPEmptyState extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.emptyState = new EmptyState();
                }
                
                connectedCallback() {
                    const type = this.getAttribute('type') || 'no-data';
                    const hierarchy = this.getAttribute('hierarchy');
                    const country = this.getAttribute('country');
                    const group = this.getAttribute('group');
                    
                    let html = '';
                    
                    if (country) {
                        html = this.emptyState.renderForCountry(country, type);
                    } else if (group) {
                        html = this.emptyState.renderForGroup({ name: group }, type);
                    } else if (hierarchy) {
                        html = this.emptyState.render(type, { hierarchy });
                    } else {
                        html = this.emptyState.render(type);
                    }
                    
                    this.shadowRoot.innerHTML = `
                        ${EmptyState.getStyles()}
                        ${html}
                    `;
                }
                
                static get observedAttributes() {
                    return ['type', 'hierarchy', 'country', 'group'];
                }
                
                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue !== newValue && this.isConnected) {
                        this.connectedCallback();
                    }
                }
            }
            
            customElements.define('mp-empty-state', MPEmptyState);
        }
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmptyState;
} else if (typeof window !== 'undefined') {
    window.MPEmptyState = EmptyState;
    
    // Auto-initialize styles if in browser
    document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = EmptyState.getStyles().replace(/<style>|<\/style>/g, '');
        document.head.appendChild(style);
        
        // Register web component
        EmptyState.registerWebComponent();
    });
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined' && !window.MPEmptyStateInitialized) {
    window.MPEmptyStateInitialized = true;
    document.addEventListener('DOMContentLoaded', () => {
        const emptyStates = document.querySelectorAll('[data-empty-state]');
        emptyStates.forEach(element => {
            const type = element.dataset.emptyState;
            const config = JSON.parse(element.dataset.config || '{}');
            const emptyState = new EmptyState();
            element.innerHTML = emptyState.render(type, config);
        });
    });
}