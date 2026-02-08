// layout/Sidebar.js
// M-Pesewa Sidebar Component - Country & Group Navigation

class MPSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentCountry = localStorage.getItem('mpesewa_country') || null;
        this.userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
        this.userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        this.isCollapsed = localStorage.getItem('mpesewa_sidebar_collapsed') === 'true';
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadUserData();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* SIDEBAR STYLES - STRICT HIERARCHY VISUALIZATION */
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                
                .mp-sidebar {
                    width: ${this.isCollapsed ? '70px' : '280px'};
                    height: 100vh;
                    background: #ffffff;
                    border-right: 1px solid #e5e7eb;
                    position: fixed;
                    left: 0;
                    top: 0;
                    z-index: 40;
                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
                }
                
                .sidebar-header {
                    padding: 24px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: ${this.isCollapsed ? 'center' : 'space-between'};
                    min-height: 80px;
                }
                
                .sidebar-logo {
                    display: ${this.isCollapsed ? 'none' : 'flex'};
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                }
                
                .sidebar-logo-icon {
                    display: ${this.isCollapsed ? 'block' : 'none'};
                    font-size: 24px;
                    font-weight: bold;
                    color: #003366;
                }
                
                .logo-text {
                    font-size: 20px;
                    font-weight: 700;
                    color: #003366;
                    letter-spacing: -0.5px;
                }
                
                .logo-tagline {
                    font-size: 11px;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-top: 2px;
                }
                
                .toggle-btn {
                    background: #f8f9fa;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .toggle-btn:hover {
                    background: #e5e7eb;
                    border-color: #d1d5db;
                }
                
                .toggle-icon {
                    transition: transform 0.3s ease;
                    color: #4b5563;
                }
                
                .sidebar-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px 0;
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                }
                
                .sidebar-content::-webkit-scrollbar {
                    width: 4px;
                }
                
                .sidebar-content::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                .sidebar-content::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 2px;
                }
                
                /* HIERARCHY SECTION */
                .hierarchy-section {
                    padding: 0 20px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    margin-bottom: 20px;
                    display: ${this.isCollapsed ? 'none' : 'block'};
                }
                
                .hierarchy-title {
                    font-size: 11px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .hierarchy-tree {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .hierarchy-level {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-radius: 6px;
                    transition: background 0.2s ease;
                }
                
                .hierarchy-level:hover {
                    background: #f8f9fa;
                }
                
                .level-icon {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    flex-shrink: 0;
                }
                
                .level-1 .level-icon { background: #003366; color: white; }
                .level-2 .level-icon { background: #0099ff; color: white; }
                .level-3 .level-icon { background: #f37021; color: white; }
                .level-4 .level-icon { background: #28a745; color: white; }
                .level-5 .level-icon { background: #6c757d; color: white; }
                
                .level-label {
                    font-size: 13px;
                    font-weight: 500;
                    color: #374151;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .level-value {
                    font-size: 12px;
                    color: #6b7280;
                    margin-left: auto;
                    font-weight: 500;
                }
                
                /* NAVIGATION SECTIONS */
                .nav-section {
                    margin-bottom: 24px;
                }
                
                .section-title {
                    font-size: 11px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 0 20px 8px;
                    margin-bottom: 8px;
                    border-bottom: 1px solid #e5e7eb;
                    display: ${this.isCollapsed ? 'none' : 'block'};
                }
                
                .nav-items {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 20px;
                    text-decoration: none;
                    color: #4b5563;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    border-left: 3px solid transparent;
                }
                
                .nav-item:hover {
                    background: #f8f9fa;
                    color: #003366;
                    border-left-color: #0099ff;
                }
                
                .nav-item.active {
                    background: #eff6ff;
                    color: #003366;
                    border-left-color: #003366;
                }
                
                .nav-icon {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    color: #6b7280;
                }
                
                .nav-item:hover .nav-icon,
                .nav-item.active .nav-icon {
                    color: #003366;
                }
                
                .nav-label {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: ${this.isCollapsed ? 'none' : 'block'};
                }
                
                .nav-badge {
                    margin-left: auto;
                    background: #0099ff;
                    color: white;
                    font-size: 10px;
                    font-weight: 600;
                    padding: 2px 6px;
                    border-radius: 10px;
                    min-width: 20px;
                    text-align: center;
                    display: ${this.isCollapsed ? 'none' : 'block'};
                }
                
                /* COUNTRY SELECTOR */
                .country-selector {
                    padding: 0 20px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    margin-bottom: 20px;
                    display: ${this.isCollapsed ? 'none' : 'block'};
                }
                
                .country-current {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                
                .country-current:hover {
                    background: #e5e7eb;
                }
                
                .country-flag {
                    font-size: 20px;
                }
                
                .country-info {
                    flex: 1;
                    min-width: 0;
                }
                
                .country-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                }
                
                .country-status {
                    font-size: 11px;
                    color: #6b7280;
                }
                
                .country-locked {
                    color: #f37021;
                    font-weight: 500;
                }
                
                /* GROUPS SECTION */
                .groups-list {
                    max-height: 200px;
                    overflow-y: auto;
                }
                
                .group-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 20px;
                    transition: background 0.2s ease;
                    cursor: pointer;
                }
                
                .group-item:hover {
                    background: #f8f9fa;
                }
                
                .group-item.active {
                    background: #eff6ff;
                }
                
                .group-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: #003366;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 12px;
                    flex-shrink: 0;
                }
                
                .group-info {
                    flex: 1;
                    min-width: 0;
                    display: ${this.isCollapsed ? 'none' : 'block'};
                }
                
                .group-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: #374151;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .group-stats {
                    font-size: 11px;
                    color: #6b7280;
                    display: flex;
                    gap: 8px;
                }
                
                /* SIDEBAR FOOTER */
                .sidebar-footer {
                    padding: 20px;
                    border-top: 1px solid #e5e7eb;
                    background: #f8f9fa;
                }
                
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .user-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #003366, #0099ff);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    flex-shrink: 0;
                }
                
                .user-info {
                    flex: 1;
                    min-width: 0;
                    display: ${this.isCollapsed ? 'none' : 'block'};
                }
                
                .user-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .user-role {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                /* COLLAPSED STATE */
                .sidebar.collapsed .nav-item {
                    padding: 12px;
                    justify-content: center;
                }
                
                .sidebar.collapsed .nav-item.active {
                    border-left-color: #003366;
                }
                
                /* RESPONSIVE */
                @media (max-width: 768px) {
                    .mp-sidebar {
                        transform: translateX(-100%);
                        width: 280px;
                        transition: transform 0.3s ease;
                    }
                    
                    .mp-sidebar.mobile-open {
                        transform: translateX(0);
                    }
                    
                    .sidebar-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 30;
                        display: none;
                    }
                    
                    .sidebar-overlay.visible {
                        display: block;
                    }
                }
                
                /* DARK MODE */
                @media (prefers-color-scheme: dark) {
                    .mp-sidebar {
                        background: #1f2937;
                        border-right-color: #374151;
                    }
                    
                    .sidebar-header {
                        border-bottom-color: #374151;
                    }
                    
                    .logo-text {
                        color: #ffffff;
                    }
                    
                    .logo-tagline {
                        color: #9ca3af;
                    }
                    
                    .toggle-btn {
                        background: #374151;
                        border-color: #4b5563;
                        color: #9ca3af;
                    }
                    
                    .toggle-btn:hover {
                        background: #4b5563;
                    }
                    
                    .hierarchy-section,
                    .country-selector {
                        border-bottom-color: #374151;
                    }
                    
                    .hierarchy-title {
                        color: #9ca3af;
                    }
                    
                    .level-label {
                        color: #e5e7eb;
                    }
                    
                    .level-value {
                        color: #9ca3af;
                    }
                    
                    .hierarchy-level:hover {
                        background: #374151;
                    }
                    
                    .section-title {
                        color: #9ca3af;
                        border-bottom-color: #374151;
                    }
                    
                    .nav-item {
                        color: #d1d5db;
                    }
                    
                    .nav-item:hover {
                        background: #374151;
                        color: #ffffff;
                    }
                    
                    .nav-item.active {
                        background: #1e40af;
                        color: #ffffff;
                    }
                    
                    .nav-icon {
                        color: #9ca3af;
                    }
                    
                    .country-current {
                        background: #374151;
                    }
                    
                    .country-current:hover {
                        background: #4b5563;
                    }
                    
                    .country-name {
                        color: #e5e7eb;
                    }
                    
                    .group-item:hover {
                        background: #374151;
                    }
                    
                    .group-item.active {
                        background: #1e40af;
                    }
                    
                    .group-name {
                        color: #e5e7eb;
                    }
                    
                    .sidebar-footer {
                        background: #111827;
                        border-top-color: #374151;
                    }
                    
                    .user-name {
                        color: #e5e7eb;
                    }
                }
                
                /* ANIMATIONS */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .hierarchy-level {
                    animation: fadeIn 0.3s ease backwards;
                }
                
                .hierarchy-level:nth-child(1) { animation-delay: 0.1s; }
                .hierarchy-level:nth-child(2) { animation-delay: 0.2s; }
                .hierarchy-level:nth-child(3) { animation-delay: 0.3s; }
                .hierarchy-level:nth-child(4) { animation-delay: 0.4s; }
                .hierarchy-level:nth-child(5) { animation-delay: 0.5s; }
            </style>
            
            <!-- Mobile Overlay -->
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
            
            <!-- Sidebar Container -->
            <div class="mp-sidebar ${this.isCollapsed ? 'collapsed' : ''}" id="sidebarContainer">
                <!-- Header -->
                <div class="sidebar-header">
                    ${!this.isCollapsed ? `
                        <a href="index.html" class="sidebar-logo">
                            <div style="font-size: 24px; font-weight: bold; color: #003366;">M</div>
                            <div>
                                <div class="logo-text">M-PESEWA</div>
                                <div class="logo-tagline">Trusted Circles</div>
                            </div>
                        </a>
                    ` : ''}
                    
                    <div class="sidebar-logo-icon">M</div>
                    
                    <button class="toggle-btn" id="toggleSidebar" aria-label="${this.isCollapsed ? 'Expand' : 'Collapse'} sidebar">
                        <span class="toggle-icon">${this.isCollapsed ? '→' : '←'}</span>
                    </button>
                </div>
                
                <!-- Content -->
                <div class="sidebar-content">
                    <!-- Hierarchy Section -->
                    <div class="hierarchy-section" id="hierarchySection">
                        <div class="hierarchy-title">
                            <span>⚡</span>
                            <span>Platform Hierarchy</span>
                        </div>
                        <div class="hierarchy-tree" id="hierarchyTree">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                    
                    <!-- Country Selector -->
                    <div class="country-selector" id="countrySelector">
                        <div class="country-current" id="currentCountry">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                    
                    <!-- Navigation based on user role -->
                    <div id="navigationSections">
                        <!-- Filled dynamically -->
                    </div>
                    
                    <!-- Groups Section -->
                    <div class="nav-section" id="groupsSection">
                        <div class="section-title">My Groups</div>
                        <div class="groups-list" id="groupsList">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="sidebar-footer">
                    <div class="user-profile" id="userProfile">
                        <!-- Filled dynamically -->
                    </div>
                </div>
            </div>
        `;
        
        this.renderDynamicContent();
    }
    
    renderDynamicContent() {
        // Render hierarchy tree
        this.renderHierarchyTree();
        
        // Render country selector
        this.renderCountrySelector();
        
        // Render navigation based on user role
        this.renderNavigation();
        
        // Render groups
        this.renderGroups();
        
        // Render user profile
        this.renderUserProfile();
    }
    
    renderHierarchyTree() {
        const hierarchyTree = this.shadowRoot.getElementById('hierarchyTree');
        if (!hierarchyTree) return;
        
        const currentCountry = localStorage.getItem('mpesewa_country');
        const userRole = localStorage.getItem('mpesewa_user_role');
        const userName = localStorage.getItem('mpesewa_user_name') || 'User';
        
        const hierarchyLevels = [
            {
                level: 1,
                icon: '🌍',
                label: 'Global',
                value: 'Platform'
            },
            {
                level: 2,
                icon: currentCountry ? this.getCountryFlag(currentCountry) : '🏳️',
                label: 'Country',
                value: currentCountry ? this.getCountryName(currentCountry) : 'Not Selected'
            },
            {
                level: 3,
                icon: '👥',
                label: 'Groups',
                value: this.userGroups.length > 0 ? `${this.userGroups.length} groups` : '0 groups'
            }
        ];
        
        // Add role-specific level
        if (userRole === 'lender') {
            hierarchyLevels.push({
                level: 4,
                icon: '💰',
                label: 'Lenders',
                value: 'You are a lender'
            });
            hierarchyLevels.push({
                level: 5,
                icon: '📒',
                label: 'Ledgers',
                value: 'Manage loans'
            });
        } else if (userRole === 'borrower') {
            hierarchyLevels.push({
                level: 4,
                icon: '🤝',
                label: 'Borrowers',
                value: 'You are a borrower'
            });
        } else if (userRole === 'group_admin') {
            hierarchyLevels.push({
                level: 4,
                icon: '👑',
                label: 'Group Admin',
                value: 'Manage group'
            });
        } else {
            hierarchyLevels.push({
                level: 4,
                icon: '👤',
                label: 'You',
                value: 'Not logged in'
            });
        }
        
        hierarchyTree.innerHTML = hierarchyLevels.map(level => `
            <div class="hierarchy-level level-${level.level}">
                <div class="level-icon">${level.icon}</div>
                <div class="level-label">${level.label}</div>
                <div class="level-value">${level.value}</div>
            </div>
        `).join('');
    }
    
    renderCountrySelector() {
        const currentCountry = localStorage.getItem('mpesewa_country');
        const countryName = currentCountry ? this.getCountryName(currentCountry) : 'Select Country';
        const countryFlag = currentCountry ? this.getCountryFlag(currentCountry) : '🏳️';
        
        const countrySelector = this.shadowRoot.getElementById('currentCountry');
        if (countrySelector) {
            countrySelector.innerHTML = `
                <div class="country-flag">${countryFlag}</div>
                ${!this.isCollapsed ? `
                    <div class="country-info">
                        <div class="country-name">${countryName}</div>
                        <div class="country-status">
                            ${currentCountry ? 
                                '<span class="country-locked">🔒 Locked</span>' : 
                                'Click to select'
                            }
                        </div>
                    </div>
                    <div style="color: #6b7280;">▼</div>
                ` : ''}
            `;
        }
    }
    
    renderNavigation() {
        const sections = this.shadowRoot.getElementById('navigationSections');
        if (!sections) return;
        
        let navigationHTML = '';
        
        // Common navigation items
        const commonNav = [
            { icon: '🏠', label: 'Dashboard', href: 'dashboard.html', roles: ['lender', 'borrower', 'group_admin'] },
            { icon: '🔔', label: 'Notifications', href: 'notifications.html', roles: ['lender', 'borrower', 'group_admin'], badge: 3 },
            { icon: '📊', label: 'Analytics', href: 'analytics.html', roles: ['lender', 'group_admin'] },
            { icon: '⚙️', label: 'Settings', href: 'settings.html', roles: ['lender', 'borrower', 'group_admin'] }
        ];
        
        // Role-specific navigation
        if (this.userRole === 'lender') {
            navigationHTML += `
                <div class="nav-section">
                    <div class="section-title">Lending</div>
                    <div class="nav-items">
                        <a href="lender/portfolio.html" class="nav-item">
                            <div class="nav-icon">💰</div>
                            <div class="nav-label">Portfolio</div>
                        </a>
                        <a href="lender/ledgers.html" class="nav-item">
                            <div class="nav-icon">📒</div>
                            <div class="nav-label">My Ledgers</div>
                            <div class="nav-badge">5</div>
                        </a>
                        <a href="lender/requests.html" class="nav-item">
                            <div class="nav-icon">🤲</div>
                            <div class="nav-label">Loan Requests</div>
                            <div class="nav-badge">2</div>
                        </a>
                        <a href="lender/subscription.html" class="nav-item">
                            <div class="nav-icon">⭐</div>
                            <div class="nav-label">Subscription</div>
                        </a>
                    </div>
                </div>
            `;
        } else if (this.userRole === 'borrower') {
            navigationHTML += `
                <div class="nav-section">
                    <div class="section-title">Borrowing</div>
                    <div class="nav-items">
                        <a href="borrower/apply.html" class="nav-item">
                            <div class="nav-icon">📝</div>
                            <div class="nav-label">Apply for Loan</div>
                        </a>
                        <a href="borrower/loans.html" class="nav-item">
                            <div class="nav-icon">📋</div>
                            <div class="nav-label">My Loans</div>
                            <div class="nav-badge">1</div>
                        </a>
                        <a href="borrower/repayments.html" class="nav-item">
                            <div class="nav-icon">💳</div>
                            <div class="nav-label">Repayments</div>
                        </a>
                        <a href="borrower/history.html" class="nav-item">
                            <div class="nav-icon">📜</div>
                            <div class="nav-label">History</div>
                        </a>
                    </div>
                </div>
            `;
        }
        
        // Common navigation section
        navigationHTML += `
            <div class="nav-section">
                <div class="section-title">Platform</div>
                <div class="nav-items">
                    ${commonNav.filter(item => 
                        item.roles.includes(this.userRole) || this.userRole === 'guest'
                    ).map(item => `
                        <a href="${item.href}" class="nav-item">
                            <div class="nav-icon">${item.icon}</div>
                            <div class="nav-label">${item.label}</div>
                            ${item.badge ? `<div class="nav-badge">${item.badge}</div>` : ''}
                        </a>
                    `).join('')}
                    <a href="emergency/index.html" class="nav-item">
                        <div class="nav-icon">🚨</div>
                        <div class="nav-label">Emergency Hub</div>
                    </a>
                </div>
            </div>
        `;
        
        sections.innerHTML = navigationHTML;
    }
    
    renderGroups() {
        const groupsList = this.shadowRoot.getElementById('groupsList');
        if (!groupsList) return;
        
        if (this.userGroups.length === 0) {
            groupsList.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 13px;">
                    No groups joined yet
                </div>
            `;
            return;
        }
        
        groupsList.innerHTML = this.userGroups.map((group, index) => `
            <div class="group-item ${index === 0 ? 'active' : ''}" data-group-id="${group.id}">
                <div class="group-avatar">${group.name.charAt(0)}</div>
                ${!this.isCollapsed ? `
                    <div class="group-info">
                        <div class="group-name">${group.name}</div>
                        <div class="group-stats">
                            <span>👥 ${group.members || 0}</span>
                            <span>💰 ${group.loans || 0}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
    
    renderUserProfile() {
        const userProfile = this.shadowRoot.getElementById('userProfile');
        if (!userProfile) return;
        
        const userName = localStorage.getItem('mpesewa_user_name') || 'Guest';
        const userInitial = userName.charAt(0).toUpperCase();
        
        userProfile.innerHTML = `
            <div class="user-avatar">${userInitial}</div>
            ${!this.isCollapsed ? `
                <div class="user-info">
                    <div class="user-name">${userName}</div>
                    <div class="user-role">${this.userRole.charAt(0).toUpperCase() + this.userRole.slice(1)}</div>
                </div>
            ` : ''}
        `;
    }
    
    setupEventListeners() {
        // Toggle sidebar
        const toggleBtn = this.shadowRoot.getElementById('toggleSidebar');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Country selector
        const countrySelector = this.shadowRoot.getElementById('currentCountry');
        if (countrySelector) {
            countrySelector.addEventListener('click', () => this.showCountrySelector());
        }
        
        // Group selection
        const groupsList = this.shadowRoot.getElementById('groupsList');
        if (groupsList) {
            groupsList.addEventListener('click', (e) => {
                const groupItem = e.target.closest('.group-item');
                if (groupItem) {
                    this.selectGroup(groupItem.dataset.groupId);
                }
            });
        }
        
        // Mobile overlay
        const overlay = this.shadowRoot.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeMobileSidebar());
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
        localStorage.setItem('mpesewa_sidebar_collapsed', this.isCollapsed);
        
        const sidebar = this.shadowRoot.getElementById('sidebarContainer');
        const toggleIcon = this.shadowRoot.querySelector('.toggle-icon');
        
        if (sidebar) {
            sidebar.classList.toggle('collapsed', this.isCollapsed);
            sidebar.style.width = this.isCollapsed ? '70px' : '280px';
        }
        
        if (toggleIcon) {
            toggleIcon.textContent = this.isCollapsed ? '→' : '←';
        }
        
        // Re-render dynamic content
        this.renderDynamicContent();
        
        // Dispatch event for other components
        this.dispatchEvent(new CustomEvent('sidebar-toggle', {
            detail: { collapsed: this.isCollapsed }
        }));
    }
    
    showCountrySelector() {
        const currentCountry = localStorage.getItem('mpesewa_country');
        const isLoggedIn = localStorage.getItem('mpesewa_auth_token');
        
        if (isLoggedIn && currentCountry) {
            this.showToast('Country selection is locked after registration. Contact admin to change.');
            return;
        }
        
        // Show country selection modal
        const modal = document.createElement('div');
        modal.innerHTML = `
            <style>
                .country-modal {
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
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .modal-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #374151;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                }
                
                .close-btn:hover {
                    background: #f3f4f6;
                }
                
                .modal-body {
                    padding: 20px;
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .countries-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                
                @media (min-width: 640px) {
                    .countries-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                
                .country-option {
                    padding: 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .country-option:hover {
                    border-color: #0099ff;
                    background: #f0f9ff;
                }
                
                .country-option.selected {
                    border-color: #003366;
                    background: #eff6ff;
                }
                
                .country-option-flag {
                    font-size: 24px;
                }
                
                .country-option-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                }
                
                .modal-footer {
                    padding: 20px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }
                
                .modal-btn {
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    border: none;
                }
                
                .modal-btn.primary {
                    background: #003366;
                    color: white;
                }
                
                .modal-btn.secondary {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
            
            <div class="country-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title">Select Your Country</div>
                        <button class="close-btn" id="closeModal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="countries-grid" id="countriesGrid">
                            ${this.getCountries().map(country => `
                                <div class="country-option ${country.code === currentCountry ? 'selected' : ''}" 
                                     data-country="${country.code}">
                                    <div class="country-option-flag">${country.flag}</div>
                                    <div class="country-option-name">${country.name}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn secondary" id="cancelBtn">Cancel</button>
                        <button class="modal-btn primary" id="confirmBtn">Confirm Selection</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        let selectedCountry = currentCountry;
        
        // Handle country selection
        modal.querySelectorAll('.country-option').forEach(option => {
            option.addEventListener('click', () => {
                modal.querySelectorAll('.country-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                selectedCountry = option.dataset.country;
            });
        });
        
        // Handle close
        const closeModal = () => modal.remove();
        modal.querySelector('#closeModal').addEventListener('click', closeModal);
        modal.querySelector('#cancelBtn').addEventListener('click', closeModal);
        modal.querySelector('.country-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('country-modal')) closeModal();
        });
        
        // Handle confirm
        modal.querySelector('#confirmBtn').addEventListener('click', () => {
            if (selectedCountry) {
                localStorage.setItem('mpesewa_country', selectedCountry);
                this.currentCountry = selectedCountry;
                this.renderDynamicContent();
                this.dispatchEvent(new CustomEvent('country-changed', {
                    detail: { country: selectedCountry }
                }));
                this.showToast(`Country set to ${this.getCountryName(selectedCountry)}`);
            }
            closeModal();
        });
    }
    
    selectGroup(groupId) {
        // Update active group
        this.shadowRoot.querySelectorAll('.group-item').forEach(item => {
            item.classList.toggle('active', item.dataset.groupId === groupId);
        });
        
        // Dispatch event
        this.dispatchEvent(new CustomEvent('group-selected', {
            detail: { groupId }
        }));
    }
    
    loadUserData() {
        // Simulate loading user data
        setTimeout(() => {
            // Check authentication
            const token = localStorage.getItem('mpesewa_auth_token');
            if (token) {
                this.userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
                this.userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
                this.renderDynamicContent();
            }
        }, 100);
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
        return country ? country.name : 'Unknown';
    }
    
    getCountryFlag(code) {
        const country = this.getCountries().find(c => c.code === code);
        return country ? country.flag : '🏳️';
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #003366;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    handleResize() {
        if (window.innerWidth <= 768) {
            // On mobile, always show sidebar full width when open
            const sidebar = this.shadowRoot.getElementById('sidebarContainer');
            if (sidebar) {
                sidebar.style.width = '280px';
            }
        }
    }
    
    openMobileSidebar() {
        const sidebar = this.shadowRoot.getElementById('sidebarContainer');
        const overlay = this.shadowRoot.getElementById('sidebarOverlay');
        
        if (sidebar) sidebar.classList.add('mobile-open');
        if (overlay) overlay.classList.add('visible');
    }
    
    closeMobileSidebar() {
        const sidebar = this.shadowRoot.getElementById('sidebarContainer');
        const overlay = this.shadowRoot.getElementById('sidebarOverlay');
        
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('visible');
    }
    
    // Public methods
    updateUserData(userData) {
        if (userData.role) {
            this.userRole = userData.role;
            localStorage.setItem('mpesewa_user_role', userData.role);
        }
        
        if (userData.groups) {
            this.userGroups = userData.groups;
            localStorage.setItem('mpesewa_user_groups', JSON.stringify(userData.groups));
        }
        
        if (userData.name) {
            localStorage.setItem('mpesewa_user_name', userData.name);
        }
        
        this.renderDynamicContent();
    }
    
    setActiveNavItem(path) {
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === path) {
                item.classList.add('active');
            }
        });
    }
}

// Register custom element
customElements.define('mp-sidebar', MPSidebar);

// Export for module usage
export default MPSidebar;