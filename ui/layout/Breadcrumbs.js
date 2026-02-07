// layout/Breadcrumbs.js
// M-Pesewa Breadcrumbs Component - Navigation Hierarchy Tracker

class MPBreadcrumbs extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.path = [];
        this.currentCountry = localStorage.getItem('mpesewa_country');
        this.userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
    }

    connectedCallback() {
        this.calculatePath();
        this.render();
        this.setupEventListeners();
    }

    calculatePath() {
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment);
        
        this.path = [
            { name: 'Home', href: 'index.html', icon: '🏠' }
        ];

        // Get country from localStorage or URL
        let country = this.currentCountry;
        if (!country) {
            // Try to extract from URL
            const countryMatch = currentPath.match(/countries\/([a-z-]+)\.html/);
            if (countryMatch) country = countryMatch[1].toUpperCase();
        }

        // Add country if we have one
        if (country) {
            this.path.push({
                name: this.getCountryName(country),
                href: `countries/${country.toLowerCase()}.html`,
                icon: this.getCountryFlag(country)
            });
        }

        // Add role-specific paths
        if (this.userRole !== 'guest') {
            this.path.push({
                name: this.getRoleLabel(this.userRole),
                href: `${this.userRole}/dashboard.html`,
                icon: this.getRoleIcon(this.userRole)
            });
        }

        // Add current page
        const currentPage = this.getCurrentPageInfo(currentPath);
        if (currentPage) {
            this.path.push(currentPage);
        }

        // Remove duplicates
        this.path = this.path.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.name === item.name
            ))
        );
    }

    getCurrentPageInfo(path) {
        const pageMap = {
            // Lender pages
            'lender/dashboard.html': { name: 'Dashboard', icon: '📊' },
            'lender/portfolio.html': { name: 'Portfolio', icon: '💰' },
            'lender/ledgers.html': { name: 'My Ledgers', icon: '📒' },
            'lender/requests.html': { name: 'Loan Requests', icon: '🤲' },
            'lender/subscription.html': { name: 'Subscription', icon: '⭐' },
            'lender/rules.html': { name: 'Lending Rules', icon: '📋' },
            'lender/risk.html': { name: 'Risk Analysis', icon: '⚠️' },
            'lender/history.html': { name: 'Lending History', icon: '📜' },

            // Borrower pages
            'borrower/dashboard.html': { name: 'Dashboard', icon: '📊' },
            'borrower/apply.html': { name: 'Apply for Loan', icon: '📝' },
            'borrower/loans.html': { name: 'My Loans', icon: '📋' },
            'borrower/repayments.html': { name: 'Repayments', icon: '💳' },
            'borrower/history.html': { name: 'Borrow History', icon: '📜' },
            'borrower/disputes.html': { name: 'Disputes', icon: '⚖️' },

            // Emergency pages
            'emergency/index.html': { name: 'Emergency Hub', icon: '🚨' },
            'emergency/fare.html': { name: 'M-pesewa Fare', icon: '🚌' },
            'emergency/data.html': { name: 'M-pesewa Data', icon: '📶' },
            'emergency/gas.html': { name: 'Cooking Gas', icon: '🔥' },
            'emergency/food.html': { name: 'M-pesewa Food', icon: '🍲' },
            'emergency/fuel.html': { name: 'M-pesewa Fuel', icon: '⛽' },
            'emergency/medicine.html': { name: 'M-pesewa Medicine', icon: '💊' },

            // Subscription pages
            'subscription/plans.html': { name: 'Subscription Plans', icon: '📊' },
            'subscription/current.html': { name: 'Current Plan', icon: '✅' },
            'subscription/upgrade.html': { name: 'Upgrade Plan', icon: '⬆️' },
            'subscription/history.html': { name: 'Subscription History', icon: '📜' },

            // Country pages
            'countries/index.html': { name: 'Countries', icon: '🌍' },

            // Other pages
            'how-it-works.html': { name: 'How It Works', icon: '❓' },
            'about.html': { name: 'About Us', icon: '👥' },
            'contact.html': { name: 'Contact', icon: '📞' },
            'faq.html': { name: 'FAQ', icon: '❓' },
            'terms.html': { name: 'Terms & Conditions', icon: '📜' },
            'privacy.html': { name: 'Privacy Policy', icon: '🔒' }
        };

        // Find matching page
        for (const [key, value] of Object.entries(pageMap)) {
            if (path.includes(key)) {
                return {
                    name: value.name,
                    href: key,
                    icon: value.icon,
                    current: true
                };
            }
        }

        // If no match, use last segment
        const segments = path.split('/');
        const lastSegment = segments[segments.length - 1];
        if (lastSegment && lastSegment !== 'index.html') {
            const name = lastSegment.replace('.html', '').replace(/-/g, ' ');
            return {
                name: name.charAt(0).toUpperCase() + name.slice(1),
                href: lastSegment,
                icon: '📄',
                current: true
            };
        }

        return null;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* BREADCRUMBS STYLES */
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                
                .breadcrumbs {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                    padding: 16px 20px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 14px;
                }
                
                .breadcrumb-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .breadcrumb-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #4b5563;
                    text-decoration: none;
                    padding: 6px 10px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }
                
                .breadcrumb-link:hover {
                    background: #e5e7eb;
                    color: #003366;
                }
                
                .breadcrumb-link.current {
                    color: #003366;
                    font-weight: 600;
                    background: #eff6ff;
                    pointer-events: none;
                }
                
                .breadcrumb-icon {
                    font-size: 14px;
                }
                
                .breadcrumb-separator {
                    color: #9ca3af;
                    user-select: none;
                    display: flex;
                    align-items: center;
                }
                
                .country-badge {
                    background: #0099ff;
                    color: white;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 2px 8px;
                    border-radius: 12px;
                    margin-left: 4px;
                }
                
                .role-badge {
                    background: #f37021;
                    color: white;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 2px 8px;
                    border-radius: 12px;
                    margin-left: 4px;
                }
                
                /* Hierarchy Indicator */
                .hierarchy-indicator {
                    margin-left: auto;
                    font-size: 12px;
                    color: #6b7280;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .hierarchy-toggle {
                    background: none;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 11px;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .hierarchy-toggle:hover {
                    background: #e5e7eb;
                    color: #003366;
                }
                
                /* Mobile styles */
                @media (max-width: 768px) {
                    .breadcrumbs {
                        padding: 12px 15px;
                        overflow-x: auto;
                        white-space: nowrap;
                        flex-wrap: nowrap;
                        -webkit-overflow-scrolling: touch;
                    }
                    
                    .hierarchy-indicator {
                        display: none;
                    }
                    
                    .breadcrumb-item:not(:last-child) {
                        display: none;
                    }
                    
                    .breadcrumb-item:last-child {
                        display: flex;
                    }
                    
                    .mobile-breadcrumb {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 15px;
                        font-weight: 600;
                        color: #003366;
                    }
                }
                
                /* Desktop: Show ellipsis for middle items on small screens */
                @media (min-width: 769px) and (max-width: 1024px) {
                    .breadcrumb-item:nth-child(n+4):not(:last-child) {
                        display: none;
                    }
                    
                    .breadcrumb-ellipsis {
                        display: flex;
                        align-items: center;
                        color: #9ca3af;
                    }
                }
                
                /* Dark mode */
                @media (prefers-color-scheme: dark) {
                    .breadcrumbs {
                        background: #1f2937;
                        border-bottom-color: #374151;
                    }
                    
                    .breadcrumb-link {
                        color: #d1d5db;
                    }
                    
                    .breadcrumb-link:hover {
                        background: #374151;
                        color: #ffffff;
                    }
                    
                    .breadcrumb-link.current {
                        color: #ffffff;
                        background: #1e40af;
                    }
                    
                    .breadcrumb-separator {
                        color: #6b7280;
                    }
                    
                    .hierarchy-indicator {
                        color: #9ca3af;
                    }
                    
                    .hierarchy-toggle {
                        border-color: #4b5563;
                        color: #9ca3af;
                    }
                    
                    .hierarchy-toggle:hover {
                        background: #374151;
                        color: #ffffff;
                    }
                }
                
                /* Animations */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .breadcrumb-item {
                    animation: fadeIn 0.3s ease backwards;
                }
            </style>
            
            <nav class="breadcrumbs" aria-label="Breadcrumb">
                <div class="breadcrumb-items" id="breadcrumbItems">
                    <!-- Filled dynamically -->
                </div>
                
                <div class="hierarchy-indicator">
                    <span>Global → Country → Groups → </span>
                    <button class="hierarchy-toggle" id="hierarchyToggle" aria-label="Toggle hierarchy view">
                        ${this.getRoleLabel(this.userRole)} ▾
                    </button>
                </div>
            </nav>
        `;
        
        this.renderBreadcrumbs();
    }

    renderBreadcrumbs() {
        const breadcrumbItems = this.shadowRoot.getElementById('breadcrumbItems');
        if (!breadcrumbItems) return;

        if (window.innerWidth <= 768) {
            // Mobile view - show only current page
            const currentItem = this.path[this.path.length - 1] || this.path[0];
            if (currentItem) {
                breadcrumbItems.innerHTML = `
                    <div class="mobile-breadcrumb">
                        <span class="breadcrumb-icon">${currentItem.icon}</span>
                        <span>${currentItem.name}</span>
                    </div>
                `;
            }
            return;
        }

        // Desktop view - show full breadcrumb
        let itemsHTML = '';
        
        for (let i = 0; i < this.path.length; i++) {
            const item = this.path[i];
            const isLast = i === this.path.length - 1;
            
            itemsHTML += `
                <div class="breadcrumb-item">
                    <a href="${item.href}" 
                       class="breadcrumb-link ${isLast ? 'current' : ''}"
                       ${isLast ? 'aria-current="page"' : ''}>
                        <span class="breadcrumb-icon">${item.icon}</span>
                        <span>${item.name}</span>
                        ${item.name === this.getCountryName(this.currentCountry) ? 
                          '<span class="country-badge">Country</span>' : ''}
                        ${item.name === this.getRoleLabel(this.userRole) ? 
                          '<span class="role-badge">' + this.userRole + '</span>' : ''}
                    </a>
                    ${!isLast ? '<span class="breadcrumb-separator">›</span>' : ''}
                </div>
            `;
            
            // Add ellipsis for tablets
            if (window.innerWidth <= 1024 && i === 2 && this.path.length > 4) {
                itemsHTML += `
                    <div class="breadcrumb-item">
                        <span class="breadcrumb-ellipsis">...</span>
                        <span class="breadcrumb-separator">›</span>
                    </div>
                `;
                // Skip to last 2 items
                i = this.path.length - 3;
            }
        }
        
        breadcrumbItems.innerHTML = itemsHTML;
    }

    setupEventListeners() {
        // Hierarchy toggle
        const hierarchyToggle = this.shadowRoot.getElementById('hierarchyToggle');
        if (hierarchyToggle) {
            hierarchyToggle.addEventListener('click', () => this.showHierarchyModal());
        }

        // Update on window resize
        window.addEventListener('resize', () => {
            this.renderBreadcrumbs();
        });

        // Update on route changes (for SPA-like behavior)
        window.addEventListener('popstate', () => {
            this.calculatePath();
            this.renderBreadcrumbs();
        });
    }

    showHierarchyModal() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <style>
                .hierarchy-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    overflow: hidden;
                    animation: slideUp 0.3s ease;
                }
                
                .modal-header {
                    padding: 20px;
                    background: #003366;
                    color: white;
                }
                
                .modal-title {
                    font-size: 18px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .modal-body {
                    padding: 20px;
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .hierarchy-visualization {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                
                .hierarchy-level {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid;
                }
                
                .level-1 { border-left-color: #003366; }
                .level-2 { border-left-color: #0099ff; }
                .level-3 { border-left-color: #f37021; }
                .level-4 { border-left-color: #28a745; }
                .level-5 { border-left-color: #6c757d; }
                
                .level-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    color: white;
                    flex-shrink: 0;
                }
                
                .level-1 .level-icon { background: #003366; }
                .level-2 .level-icon { background: #0099ff; }
                .level-3 .level-icon { background: #f37021; }
                .level-4 .level-icon { background: #28a745; }
                .level-5 .level-icon { background: #6c757d; }
                
                .level-info {
                    flex: 1;
                }
                
                .level-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 4px;
                }
                
                .level-description {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .level-stats {
                    display: flex;
                    gap: 15px;
                    margin-top: 8px;
                }
                
                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #4b5563;
                }
                
                .stat-icon {
                    color: #0099ff;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                /* Dark mode */
                @media (prefers-color-scheme: dark) {
                    .modal-content {
                        background: #1f2937;
                    }
                    
                    .hierarchy-level {
                        background: #374151;
                    }
                    
                    .level-name {
                        color: #e5e7eb;
                    }
                    
                    .level-description {
                        color: #9ca3af;
                    }
                    
                    .stat-item {
                        color: #d1d5db;
                    }
                }
            </style>
            
            <div class="hierarchy-modal" id="hierarchyModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title">
                            <span>⚡</span>
                            <span>Platform Hierarchy</span>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="hierarchy-visualization" id="hierarchyVisualization">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Fill hierarchy visualization
        const visualization = modal.querySelector('#hierarchyVisualization');
        if (visualization) {
            visualization.innerHTML = this.getHierarchyVisualization();
        }

        // Close modal on click outside
        modal.querySelector('.hierarchy-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('hierarchy-modal')) {
                modal.remove();
            }
        });

        // Close on escape key
        const closeModal = () => modal.remove();
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    getHierarchyVisualization() {
        const country = this.currentCountry;
        const userRole = this.userRole;
        const userName = localStorage.getItem('mpesewa_user_name') || 'User';
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');

        const levels = [
            {
                level: 1,
                icon: '🌍',
                name: 'Global',
                description: 'M-Pesewa Platform',
                stats: [
                    { icon: '🏢', label: 'Platform' },
                    { icon: '🔒', label: 'Secure' },
                    { icon: '⚡', label: 'Fast' }
                ]
            },
            {
                level: 2,
                icon: country ? this.getCountryFlag(country) : '🏳️',
                name: country ? this.getCountryName(country) : 'Country',
                description: country ? 'Your selected country' : 'Select a country',
                stats: country ? [
                    { icon: '🔒', label: 'Locked' },
                    { icon: '📊', label: 'Compliant' },
                    { icon: '👥', label: 'Local Rules' }
                ] : [
                    { icon: '🔓', label: 'Selectable' },
                    { icon: '🌐', label: '12 Countries' }
                ]
            },
            {
                level: 3,
                icon: '👥',
                name: 'Groups',
                description: userGroups.length > 0 ? 
                    `${userGroups.length} trusted group${userGroups.length > 1 ? 's' : ''}` : 
                    'No groups joined',
                stats: userGroups.length > 0 ? [
                    { icon: '👥', label: `${userGroups.length} groups` },
                    { icon: '🤝', label: 'Trusted circles' },
                    { icon: '🔒', label: 'Invite-only' }
                ] : [
                    { icon: '👥', label: 'Min 5 members' },
                    { icon: '🔒', label: 'Max 1000' }
                ]
            }
        ];

        // Add role-specific level
        if (userRole === 'lender') {
            levels.push({
                level: 4,
                icon: '💰',
                name: 'Lenders',
                description: 'You are a lender with subscription access',
                stats: [
                    { icon: '💰', label: 'Provide loans' },
                    { icon: '📒', label: 'Manage ledgers' },
                    { icon: '⭐', label: 'Subscription' }
                ]
            });
            levels.push({
                level: 5,
                icon: '📒',
                name: 'Ledgers',
                description: 'Track loans and repayments',
                stats: [
                    { icon: '📊', label: 'Loan records' },
                    { icon: '💰', label: '10% interest' },
                    { icon: '⏰', label: '7-day terms' }
                ]
            });
        } else if (userRole === 'borrower') {
            levels.push({
                level: 4,
                icon: '🤝',
                name: 'Borrowers',
                description: 'You can request emergency loans',
                stats: [
                    { icon: '🤝', label: 'Request loans' },
                    { icon: '💰', label: 'No subscription' },
                    { icon: '⭐', label: 'Build rating' }
                ]
            });
        } else if (userRole === 'group_admin') {
            levels.push({
                level: 4,
                icon: '👑',
                name: 'Group Admin',
                description: 'You manage a group',
                stats: [
                    { icon: '👑', label: 'Group owner' },
                    { icon: '👥', label: 'Manage members' },
                    { icon: '⚙️', label: 'Set rules' }
                ]
            });
        } else {
            levels.push({
                level: 4,
                icon: '👤',
                name: 'You',
                description: 'Not logged in',
                stats: [
                    { icon: '🔓', label: 'Guest access' },
                    { icon: '📚', label: 'Learn more' }
                ]
            });
        }

        return levels.map(level => `
            <div class="hierarchy-level level-${level.level}">
                <div class="level-icon">${level.icon}</div>
                <div class="level-info">
                    <div class="level-name">${level.name}</div>
                    <div class="level-description">${level.description}</div>
                    <div class="level-stats">
                        ${level.stats.map(stat => `
                            <div class="stat-item">
                                <span class="stat-icon">${stat.icon}</span>
                                <span>${stat.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getCountries() {
        return [
            { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
            { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
            { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
            { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
            { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
            { code: 'CD', name: 'DRC', flag: '🇨🇩' },
            { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
            { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
            { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
            { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
            { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
            { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' }
        ];
    }

    getCountryName(code) {
        const country = this.getCountries().find(c => c.code === code);
        return country ? country.name : 'Select Country';
    }

    getCountryFlag(code) {
        const country = this.getCountries().find(c => c.code === code);
        return country ? country.flag : '🏳️';
    }

    getRoleLabel(role) {
        const roleLabels = {
            lender: 'Lender',
            borrower: 'Borrower',
            group_admin: 'Group Admin',
            guest: 'Guest'
        };
        return roleLabels[role] || role;
    }

    getRoleIcon(role) {
        const roleIcons = {
            lender: '💰',
            borrower: '🤝',
            group_admin: '👑',
            guest: '👤'
        };
        return roleIcons[role] || '👤';
    }

    // Public method to update breadcrumbs
    updatePath() {
        this.calculatePath();
        this.renderBreadcrumbs();
    }

    // Public method to set custom path
    setCustomPath(path) {
        this.path = path;
        this.renderBreadcrumbs();
    }
}

// Register custom element
customElements.define('mp-breadcrumbs', MPBreadcrumbs);

// Export for module usage
export default MPBreadcrumbs;