/**
 * M-PESEWA HEADER CONTROLLER
 * Controls header navigation, country selection, and user authentication
 * Enforces strict hierarchy: Global → Country → Groups → Lenders → Borrowers
 * Version: 1.0.0
 * Last Updated: 2024-01-24
 */

class MpesewaHeaderController {
    constructor(contextResolver) {
        this.contextResolver = contextResolver || window.MpesewaContextResolver;
        this.headerConfig = this._initializeHeaderConfig();
        this.currentHeader = null;
        this.isSticky = true;
        this.isMobileMenuOpen = false;
        this.userState = null;
        this.init();
    }

    init() {
        this._loadUserState();
        this._setupEventListeners();
        this._renderHeader();
        this._updateAuthState();
        this._setupMobileMenu();
    }

    _initializeHeaderConfig() {
        return {
            // STRICT HEADER STRUCTURE - NON-NEGOTIABLE
            structure: {
                // Zone 1: Branding & Logo
                branding: {
                    logo: {
                        text: 'M-PESEWA',
                        tagline: 'Trusted Circles Lending',
                        path: '/',
                        color: '#ffffff'
                    },
                    hierarchyDisplay: true // Shows Global → Country → Group
                },
                
                // Zone 2: Main Navigation (Desktop)
                navigation: {
                    items: [
                        {
                            id: 'nav-home',
                            label: 'Home',
                            path: '/',
                            exact: true,
                            roles: ['all']
                        },
                        {
                            id: 'nav-lenders',
                            label: 'Lenders',
                            dropdown: true,
                            roles: ['lender', 'group_admin', 'platform_admin', 'guest'],
                            subItems: [
                                {
                                    id: 'nav-lenders-dashboard',
                                    label: 'Dashboard',
                                    path: '/lender/dashboard.html',
                                    roles: ['lender', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-lenders-portfolio',
                                    label: 'Portfolio',
                                    path: '/lender/portfolio.html',
                                    roles: ['lender', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-lenders-history',
                                    label: 'History',
                                    path: '/lender/history.html',
                                    roles: ['lender', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-lenders-rules',
                                    label: 'Rules',
                                    path: '/lender/rules.html',
                                    roles: ['lender', 'group_admin', 'platform_admin', 'guest']
                                },
                                {
                                    id: 'nav-lenders-risk',
                                    label: 'Risk',
                                    path: '/lender/risk.html',
                                    roles: ['lender', 'group_admin', 'platform_admin', 'guest']
                                }
                            ]
                        },
                        {
                            id: 'nav-borrowers',
                            label: 'Borrowers',
                            dropdown: true,
                            roles: ['borrower', 'group_admin', 'platform_admin', 'guest'],
                            subItems: [
                                {
                                    id: 'nav-borrowers-dashboard',
                                    label: 'Dashboard',
                                    path: '/borrower/dashboard.html',
                                    roles: ['borrower', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-borrowers-apply',
                                    label: 'Apply for Loan',
                                    path: '/borrower/apply.html',
                                    roles: ['borrower', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-borrowers-history',
                                    label: 'Borrow History',
                                    path: '/borrower/history.html',
                                    roles: ['borrower', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-borrowers-repayments',
                                    label: 'Repayments',
                                    path: '/borrower/repayments.html',
                                    roles: ['borrower', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-borrowers-disputes',
                                    label: 'Disputes',
                                    path: '/borrower/disputes.html',
                                    roles: ['borrower', 'group_admin', 'platform_admin']
                                }
                            ]
                        },
                        {
                            id: 'nav-emergency',
                            label: 'Emergency Hub',
                            dropdown: true,
                            roles: ['all'],
                            megaMenu: true,
                            subItems: this._getEmergencyHubItems()
                        },
                        {
                            id: 'nav-subscriptions',
                            label: 'Subscription Plans',
                            dropdown: true,
                            roles: ['lender', 'group_admin', 'platform_admin', 'guest'],
                            subItems: [
                                {
                                    id: 'nav-subscriptions-current',
                                    label: 'Current Plan',
                                    path: '/subscription/current.html',
                                    roles: ['lender', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-subscriptions-upgrade',
                                    label: 'Upgrade',
                                    path: '/subscription/upgrade.html',
                                    roles: ['lender', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-subscriptions-history',
                                    label: 'History',
                                    path: '/subscription/history.html',
                                    roles: ['lender', 'group_admin', 'platform_admin']
                                },
                                {
                                    id: 'nav-subscriptions-invoices',
                                    label: 'Invoices',
                                    path: '/subscription/invoices.html',
                                    roles: ['lender', 'group_admin', 'platform_admin']
                                }
                            ]
                        },
                        {
                            id: 'nav-country',
                            label: 'Country',
                            dropdown: true,
                            roles: ['all'],
                            subItems: this._getCountryItems(),
                            lockAfterRegistration: true
                        }
                    ]
                },
                
                // Zone 3: Authentication & User Controls
                auth: {
                    guest: [
                        {
                            id: 'auth-signin',
                            label: 'Sign In',
                            path: '/auth/login.html',
                            type: 'outline',
                            color: '#ffffff'
                        },
                        {
                            id: 'auth-signup',
                            label: 'Get Started',
                            path: '/auth/register.html',
                            type: 'primary',
                            color: '#0099ff'
                        }
                    ],
                    authenticated: {
                        userMenu: true,
                        items: [
                            {
                                id: 'user-profile',
                                label: 'Profile',
                                icon: '👤',
                                path: '/user/profile.html'
                            },
                            {
                                id: 'user-settings',
                                label: 'Settings',
                                icon: '⚙️',
                                path: '/user/settings.html'
                            },
                            {
                                id: 'user-notifications',
                                label: 'Notifications',
                                icon: '🔔',
                                path: '/user/notifications.html',
                                badge: true
                            },
                            {
                                id: 'user-switch-role',
                                label: 'Switch Role',
                                icon: '🔄',
                                action: 'switchRole',
                                condition: (user) => user.roles && user.roles.length > 1
                            },
                            {
                                id: 'user-logout',
                                label: 'Logout',
                                icon: '🚪',
                                action: 'logout',
                                type: 'danger'
                            }
                        ]
                    }
                },
                
                // Zone 4: Quick Actions & Status
                quickActions: {
                    show: true,
                    items: [
                        {
                            id: 'action-notifications',
                            icon: '🔔',
                            path: '/notifications.html',
                            badge: true,
                            roles: ['authenticated']
                        },
                        {
                            id: 'action-help',
                            icon: '❓',
                            path: '/help.html',
                            tooltip: 'Help & Support'
                        },
                        {
                            id: 'action-search',
                            icon: '🔍',
                            action: 'toggleSearch',
                            tooltip: 'Search'
                        }
                    ]
                }
            },
            
            // STRICT COLOR SCHEME - NON-NEGOTIABLE
            colors: {
                primary: '#003366', // Deep Blue - HEADER BACKGROUND
                secondary: '#0099ff', // Sky Blue - Hover/Active
                text: '#ffffff', // White text on dark background
                dropdown: '#ffffff', // White dropdown background
                dropdownText: '#003366', // Deep blue text in dropdowns
                hover: '#004080', // Darker blue for hover
                active: '#0099ff', // Sky blue for active state
                buttonBorrower: '#f37021', // Orange for borrower actions
                buttonLender: '#28a745', // Green for lender actions
                badge: '#ff4757' // Red for badges
            },
            
            // RESPONSIVE BREAKPOINTS
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1200
            },
            
            // ANIMATION CONFIG
            animations: {
                dropdown: {
                    duration: 300,
                    easing: 'ease-out'
                },
                mobileMenu: {
                    duration: 400,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }
            }
        };
    }

    _getEmergencyHubItems() {
        return [
            {
                category: 'Everyday Essentials',
                items: [
                    { id: 'emergency-fare', label: '🚌 M-pesewa Fare', path: '/emergency/fare.html' },
                    { id: 'emergency-data', label: '📶 M-pesewa Data', path: '/emergency/data.html' },
                    { id: 'emergency-gas', label: '🔥 Cooking Gas', path: '/emergency/gas.html' },
                    { id: 'emergency-food', label: '🍲 M-pesewa Food', path: '/emergency/food.html' },
                    { id: 'emergency-wifi', label: '📡 M-pesewa Wifi', path: '/emergency/wifi.html' },
                    { id: 'emergency-water', label: '🚰 Water Bill', path: '/emergency/water.html' },
                    { id: 'emergency-electricity', label: '⚡ Electricity', path: '/emergency/electricity.html' },
                    { id: 'emergency-tv', label: '📺 TV Subscription', path: '/emergency/tv.html' }
                ]
            },
            {
                category: 'Logistics & Repairs',
                items: [
                    { id: 'emergency-fuel', label: '⛽ M-pesewa Fuel', path: '/emergency/fuel.html' },
                    { id: 'emergency-repair', label: '🔧 M-pesewa Repair', path: '/emergency/repair.html' },
                    { id: 'emergency-credo', label: '🛠️ M-pesewa Credo', path: '/emergency/credo.html' }
                ]
            },
            {
                category: 'Business & Growth',
                items: [
                    { id: 'emergency-sales', label: '🧾 Daily Sales Advance', path: '/emergency/sales.html' },
                    { id: 'emergency-capital', label: '🏪 Working Capital', path: '/emergency/capital.html' },
                    { id: 'emergency-soko', label: '🛒 Soko Loan', path: '/emergency/soko.html' },
                    { id: 'emergency-kidandaski', label: '🏗️ Kidandaski Loan', path: '/emergency/kidandaski.html' },
                    { id: 'emergency-hawker', label: '🚶‍♂️ Hawker Loan', path: '/emergency/hawker.html' },
                    { id: 'emergency-fuliziwa', label: '🔄 M-fuliziwa Loan', path: '/emergency/fuliziwa.html' }
                ]
            },
            {
                category: 'Health & Education',
                items: [
                    { id: 'emergency-medicine', label: '💊 Medicine', path: '/emergency/medicine.html' },
                    { id: 'emergency-school', label: '🎓 School Fees', path: '/emergency/school.html' },
                    { id: 'emergency-advance', label: '💸 Quick Advance', path: '/emergency/advance.html' }
                ]
            }
        ];
    }

    _getCountryItems() {
        return [
            { id: 'country-ke', label: '🇰🇪 Kenya', path: '/countries/kenya.html', code: 'KE' },
            { id: 'country-ug', label: '🇺🇬 Uganda', path: '/countries/uganda.html', code: 'UG' },
            { id: 'country-tz', label: '🇹🇿 Tanzania', path: '/countries/tanzania.html', code: 'TZ' },
            { id: 'country-rw', label: '🇷🇼 Rwanda', path: '/countries/rwanda.html', code: 'RW' },
            { id: 'country-bi', label: '🇧🇮 Burundi', path: '/countries/burundi.html', code: 'BI' },
            { id: 'country-cd', label: '🇨🇩 DRC', path: '/countries/drc.html', code: 'CD' },
            { id: 'country-ng', label: '🇳🇬 Nigeria', path: '/countries/nigeria.html', code: 'NG' },
            { id: 'country-gh', label: '🇬🇭 Ghana', path: '/countries/ghana.html', code: 'GH' },
            { id: 'country-ss', label: '🇸🇸 South Sudan', path: '/countries/south-sudan.html', code: 'SS' },
            { id: 'country-so', label: '🇸🇴 Somalia', path: '/countries/somalia.html', code: 'SO' },
            { id: 'country-za', label: '🇿🇦 South Africa', path: '/countries/south-africa.html', code: 'ZA' },
            { id: 'country-et', label: '🇪🇹 Ethiopia', path: '/countries/ethiopia.html', code: 'ET' }
        ];
    }

    // STATE MANAGEMENT
    _loadUserState() {
        try {
            const userData = localStorage.getItem('mpesewa_user');
            this.userState = userData ? JSON.parse(userData) : {
                isAuthenticated: false,
                role: 'guest'
            };
        } catch (error) {
            console.error('Error loading user state:', error);
            this.userState = { isAuthenticated: false, role: 'guest' };
        }
    }

    _setupEventListeners() {
        // Window scroll for sticky header
        window.addEventListener('scroll', () => this._handleScroll());
        
        // Window resize for responsive behavior
        window.addEventListener('resize', () => this._handleResize());
        
        // Click outside to close dropdowns
        document.addEventListener('click', (e) => this._handleClickOutside(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this._handleKeyboardShortcuts(e));
        
        // Authentication state changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'mpesewa_user') {
                this._loadUserState();
                this._updateAuthState();
            }
        });
    }

    _handleScroll() {
        if (!this.isSticky) return;
        
        const header = document.getElementById('mp-header');
        if (!header) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.classList.remove('scrolled');
            header.style.boxShadow = 'none';
        }
    }

    _handleResize() {
        const width = window.innerWidth;
        const isMobile = width < this.headerConfig.breakpoints.mobile;
        
        // Close mobile menu on resize to desktop
        if (!isMobile && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update header layout
        this._renderHeader();
    }

    _handleClickOutside(e) {
        // Close dropdowns
        document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Close mobile menu if clicking outside
        if (this.isMobileMenuOpen) {
            const mobileMenu = document.getElementById('mobile-nav');
            const toggleBtn = document.getElementById('mobile-menu-toggle');
            
            if (mobileMenu && toggleBtn && 
                !mobileMenu.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        }
    }

    _handleKeyboardShortcuts(e) {
        // Escape to close dropdowns and mobile menu
        if (e.key === 'Escape') {
            this.closeAllDropdowns();
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        }
        
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.toggleSearch();
        }
        
        // Alt + H for home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = '/';
        }
    }

    // HEADER RENDERING
    _renderHeader() {
        const container = document.getElementById('header-container');
        if (!container) {
            console.error('Header container not found');
            return;
        }

        const width = window.innerWidth;
        const isMobile = width < this.headerConfig.breakpoints.mobile;
        
        if (isMobile) {
            this._renderMobileHeader(container);
        } else {
            this._renderDesktopHeader(container);
        }
        
        this._attachHeaderEventListeners();
        this._updateActiveNavItem();
    }

    _renderDesktopHeader(container) {
        const { colors, structure } = this.headerConfig;
        const user = this.userState;
        const isAuthenticated = user.isAuthenticated;
        
        const html = `
            <header id="mp-header" class="mp-header" style="background-color: ${colors.primary}; color: ${colors.text};">
                <div class="header-container">
                    <!-- Zone 1: Branding -->
                    <div class="header-branding">
                        <a href="${structure.branding.logo.path}" class="header-logo">
                            <span class="logo-text" style="color: ${colors.text};">${structure.branding.logo.text}</span>
                            <span class="logo-tagline">${structure.branding.logo.tagline}</span>
                        </a>
                        
                        ${structure.branding.hierarchyDisplay ? this._renderHierarchyDisplay() : ''}
                    </div>
                    
                    <!-- Zone 2: Main Navigation -->
                    <nav class="header-nav" aria-label="Main Navigation">
                        <ul class="nav-list">
                            ${structure.navigation.items
                                .filter(item => this._canAccessNavItem(item, user))
                                .map(item => this._renderNavItem(item, user))
                                .join('')
                            }
                        </ul>
                    </nav>
                    
                    <!-- Zone 3 & 4: Auth & Quick Actions -->
                    <div class="header-actions">
                        <!-- Quick Actions -->
                        ${structure.quickActions.show ? `
                            <div class="quick-actions">
                                ${structure.quickActions.items
                                    .filter(action => this._canAccessQuickAction(action, user))
                                    .map(action => this._renderQuickAction(action, user))
                                    .join('')
                                }
                            </div>
                        ` : ''}
                        
                        <!-- Authentication -->
                        <div class="auth-actions">
                            ${isAuthenticated ? this._renderUserMenu(user) : this._renderGuestAuth()}
                        </div>
                    </div>
                </div>
                
                <!-- Search Overlay -->
                <div class="search-overlay" id="search-overlay">
                    <div class="search-container">
                        <input type="text" 
                               class="search-input" 
                               placeholder="Search for loans, lenders, borrowers..."
                               aria-label="Search">
                        <button class="search-close" aria-label="Close search">×</button>
                        <div class="search-results"></div>
                    </div>
                </div>
            </header>
        `;
        
        container.innerHTML = html;
        this.currentHeader = 'desktop';
    }

    _renderMobileHeader(container) {
        const { colors, structure } = this.headerConfig;
        const user = this.userState;
        
        const html = `
            <header id="mp-header" class="mp-header mobile" style="background-color: ${colors.primary}; color: ${colors.text};">
                <div class="header-container">
                    <!-- Mobile: Left - Menu Toggle -->
                    <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle mobile menu">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </button>
                    
                    <!-- Mobile: Center - Branding -->
                    <div class="header-branding mobile">
                        <a href="${structure.branding.logo.path}" class="header-logo">
                            <span class="logo-text" style="color: ${colors.text};">${structure.branding.logo.text}</span>
                        </a>
                    </div>
                    
                    <!-- Mobile: Right - Quick Actions -->
                    <div class="mobile-actions">
                        ${user.isAuthenticated ? `
                            <button class="mobile-user-toggle" id="mobile-user-toggle" aria-label="User menu">
                                <span class="user-avatar">${user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                            </button>
                        ` : `
                            <a href="/auth/login.html" class="mobile-auth-btn" aria-label="Sign in">
                                <span class="auth-icon">🔐</span>
                            </a>
                        `}
                    </div>
                </div>
                
                <!-- Mobile Navigation Menu -->
                <div class="mobile-nav-overlay" id="mobile-nav">
                    <div class="mobile-nav-content">
                        <div class="mobile-nav-header">
                            <div class="mobile-user-info">
                                ${user.isAuthenticated ? `
                                    <div class="user-avatar-large">${user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                                    <div class="user-details">
                                        <p class="user-name">${user.name || 'User'}</p>
                                        <p class="user-role">${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</p>
                                    </div>
                                ` : `
                                    <p class="guest-message">Welcome to M-Pesewa</p>
                                `}
                            </div>
                            <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close mobile menu">×</button>
                        </div>
                        
                        <nav class="mobile-nav-menu" aria-label="Mobile Navigation">
                            ${this._renderMobileNavItems(user)}
                        </nav>
                        
                        <div class="mobile-nav-footer">
                            ${user.isAuthenticated ? `
                                <button class="mobile-logout-btn" data-action="logout">
                                    <span class="icon">🚪</span>
                                    <span>Logout</span>
                                </button>
                            ` : `
                                <a href="/auth/login.html" class="mobile-auth-btn primary">
                                    <span class="icon">🔐</span>
                                    <span>Sign In</span>
                                </a>
                                <a href="/auth/register.html" class="mobile-auth-btn secondary">
                                    <span class="icon">🚀</span>
                                    <span>Get Started</span>
                                </a>
                            `}
                        </div>
                    </div>
                </div>
                
                <!-- Mobile User Menu -->
                ${user.isAuthenticated ? `
                    <div class="mobile-user-menu" id="mobile-user-menu">
                        <div class="user-menu-content">
                            ${structure.auth.authenticated.items
                                .filter(item => !item.condition || item.condition(user))
                                .map(item => this._renderMobileUserMenuItem(item, user))
                                .join('')
                            }
                        </div>
                    </div>
                ` : ''}
            </header>
        `;
        
        container.innerHTML = html;
        this.currentHeader = 'mobile';
    }

    _renderHierarchyDisplay() {
        const context = this.contextResolver?.getCurrentContext() || {};
        const hierarchy = this.contextResolver?.getHierarchyStack() || [];
        
        if (hierarchy.length <= 1) return '';
        
        return `
            <div class="hierarchy-display">
                ${hierarchy.map((level, index) => `
                    <span class="hierarchy-level">
                        ${index > 0 ? '<span class="hierarchy-separator">›</span>' : ''}
                        <span class="hierarchy-label">${level.label}</span>
                    </span>
                `).join('')}
            </div>
        `;
    }

    _renderNavItem(item, user) {
        const { colors } = this.headerConfig;
        const isActive = this._isNavItemActive(item);
        const hasDropdown = item.dropdown && item.subItems && item.subItems.length > 0;
        const megaMenu = item.megaMenu && hasDropdown;
        
        let itemHTML = '';
        
        if (hasDropdown) {
            itemHTML = `
                <li class="nav-item dropdown ${isActive ? 'active' : ''}" data-item-id="${item.id}">
                    <a href="#" class="nav-link dropdown-toggle" 
                       aria-haspopup="true" 
                       aria-expanded="false"
                       style="color: ${colors.text};">
                        ${item.label} <span class="dropdown-arrow">▾</span>
                    </a>
                    ${megaMenu ? this._renderMegaMenu(item.subItems, user) : this._renderDropdownMenu(item.subItems, user)}
                </li>
            `;
        } else {
            itemHTML = `
                <li class="nav-item ${isActive ? 'active' : ''}">
                    <a href="${item.path}" class="nav-link" style="color: ${colors.text};">
                        ${item.label}
                    </a>
                </li>
            `;
        }
        
        return itemHTML;
    }

    _renderDropdownMenu(subItems, user) {
        const { colors } = this.headerConfig;
        const filteredItems = subItems.filter(subItem => this._canAccessNavItem(subItem, user));
        
        if (filteredItems.length === 0) return '';
        
        return `
            <div class="dropdown-menu" style="background-color: ${colors.dropdown}; color: ${colors.dropdownText};">
                ${filteredItems.map(subItem => `
                    <a href="${subItem.path}" class="dropdown-item">
                        ${subItem.label}
                    </a>
                `).join('')}
            </div>
        `;
    }

    _renderMegaMenu(subItems, user) {
        const { colors } = this.headerConfig;
        
        return `
            <div class="mega-menu" style="background-color: ${colors.dropdown}; color: ${colors.dropdownText};">
                <div class="mega-menu-content">
                    ${subItems.map(category => {
                        const filteredItems = category.items.filter(item => 
                            this._canAccessNavItem(item, user)
                        );
                        
                        if (filteredItems.length === 0) return '';
                        
                        return `
                            <div class="mega-menu-category">
                                <h4 class="category-title">${category.category}</h4>
                                <div class="category-items">
                                    ${filteredItems.map(item => `
                                        <a href="${item.path}" class="mega-menu-item">
                                            <span class="item-icon">${item.label.split(' ')[0]}</span>
                                            <span class="item-label">${item.label.split(' ').slice(1).join(' ')}</span>
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    _renderQuickAction(action, user) {
        if (action.badge && user.unreadNotifications > 0) {
            return `
                <button class="quick-action-btn" 
                        data-action="${action.action || ''}"
                        ${action.path ? `data-path="${action.path}"` : ''}
                        aria-label="${action.tooltip || ''}">
                    <span class="action-icon">${action.icon}</span>
                    ${user.unreadNotifications > 0 ? `
                        <span class="action-badge">${user.unreadNotifications}</span>
                    ` : ''}
                </button>
            `;
        }
        
        if (action.path) {
            return `
                <a href="${action.path}" class="quick-action-btn" aria-label="${action.tooltip || ''}">
                    <span class="action-icon">${action.icon}</span>
                </a>
            `;
        } else {
            return `
                <button class="quick-action-btn" 
                        data-action="${action.action}"
                        aria-label="${action.tooltip || ''}">
                    <span class="action-icon">${action.icon}</span>
                </button>
            `;
        }
    }

    _renderGuestAuth() {
        const { colors, structure } = this.headerConfig;
        
        return `
            <div class="auth-buttons">
                ${structure.auth.guest.map(button => `
                    <a href="${button.path}" 
                       class="auth-btn ${button.type}" 
                       style="${button.type === 'outline' ? `border-color: ${colors.text}; color: ${colors.text};` : `background-color: ${button.color}; color: ${colors.text};`}">
                        ${button.label}
                    </a>
                `).join('')}
            </div>
        `;
    }

    _renderUserMenu(user) {
        const { colors, structure } = this.headerConfig;
        const context = this.contextResolver?.getCurrentContext() || {};
        
        return `
            <div class="user-menu">
                <button class="user-menu-toggle" id="user-menu-toggle" aria-label="User menu">
                    <span class="user-avatar">${user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    <span class="user-name">${user.name?.split(' ')[0] || 'User'}</span>
                    <span class="dropdown-arrow">▾</span>
                </button>
                
                <div class="user-dropdown" style="background-color: ${colors.dropdown}; color: ${colors.dropdownText};">
                    <div class="user-dropdown-header">
                        <div class="user-info">
                            <span class="user-avatar-large">${user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                            <div class="user-details">
                                <p class="user-name">${user.name || 'User'}</p>
                                <p class="user-role">${context.role ? context.role.charAt(0).toUpperCase() + context.role.slice(1) : ''}</p>
                                ${context.country ? `
                                    <p class="user-country">
                                        <span class="country-flag">${this._getCountryFlag(context.country)}</span>
                                        <span>${this._getCountryName(context.country)}</span>
                                    </p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="user-dropdown-menu">
                        ${structure.auth.authenticated.items
                            .filter(item => !item.condition || item.condition(user))
                            .map(item => this._renderUserMenuItem(item, user))
                            .join('')
                        }
                    </div>
                </div>
            </div>
        `;
    }

    _renderUserMenuItem(item, user) {
        if (item.action === 'switchRole' && user.roles && user.roles.length > 1) {
            return `
                <div class="user-menu-item role-switcher">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-label">${item.label}</span>
                    <div class="role-options">
                        ${user.roles.map(role => `
                            <button class="role-option ${role === user.role ? 'active' : ''}" 
                                    data-role="${role}"
                                    aria-label="Switch to ${role}">
                                ${role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (item.action) {
            return `
                <button class="user-menu-item ${item.type || ''}" 
                        data-action="${item.action}">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-label">${item.label}</span>
                </button>
            `;
        } else {
            return `
                <a href="${item.path}" class="user-menu-item">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-label">${item.label}</span>
                    ${item.badge && user.unreadNotifications > 0 ? `
                        <span class="item-badge">${user.unreadNotifications}</span>
                    ` : ''}
                </a>
            `;
        }
    }

    _renderMobileNavItems(user) {
        const { structure } = this.headerConfig;
        
        return `
            <ul class="mobile-nav-list">
                ${structure.navigation.items
                    .filter(item => this._canAccessNavItem(item, user))
                    .map(item => this._renderMobileNavItem(item, user))
                    .join('')
                }
            </ul>
        `;
    }

    _renderMobileNavItem(item, user) {
        const isActive = this._isNavItemActive(item);
        const hasSubItems = item.dropdown && item.subItems && item.subItems.length > 0;
        
        if (hasSubItems) {
            return `
                <li class="mobile-nav-item accordion ${isActive ? 'active' : ''}" data-item-id="${item.id}">
                    <button class="mobile-nav-link accordion-toggle">
                        <span class="item-label">${item.label}</span>
                        <span class="accordion-arrow">▸</span>
                    </button>
                    <div class="accordion-content">
                        ${item.subItems
                            .filter(subItem => this._canAccessNavItem(subItem, user))
                            .map(subItem => `
                                <a href="${subItem.path}" class="mobile-nav-subitem">
                                    ${subItem.label}
                                </a>
                            `).join('')
                        }
                    </div>
                </li>
            `;
        } else {
            return `
                <li class="mobile-nav-item ${isActive ? 'active' : ''}">
                    <a href="${item.path}" class="mobile-nav-link">
                        <span class="item-label">${item.label}</span>
                    </a>
                </li>
            `;
        }
    }

    _renderMobileUserMenuItem(item, user) {
        if (item.action === 'switchRole' && user.roles && user.roles.length > 1) {
            return `
                <div class="mobile-user-menu-item">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-label">${item.label}</span>
                    <div class="mobile-role-options">
                        ${user.roles.map(role => `
                            <button class="mobile-role-option ${role === user.role ? 'active' : ''}" 
                                    data-role="${role}">
                                ${role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (item.action) {
            return `
                <button class="mobile-user-menu-item ${item.type || ''}" 
                        data-action="${item.action}">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-label">${item.label}</span>
                </button>
            `;
        } else {
            return `
                <a href="${item.path}" class="mobile-user-menu-item">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-label">${item.label}</span>
                </a>
            `;
        }
    }

    // ACCESS CONTROL
    _canAccessNavItem(item, user) {
        if (!item.roles) return true;
        
        if (item.roles.includes('all')) return true;
        
        if (!user.isAuthenticated && item.roles.includes('guest')) return true;
        
        if (user.isAuthenticated) {
            if (item.roles.includes('authenticated')) return true;
            if (item.roles.includes(user.role)) return true;
        }
        
        return false;
    }

    _canAccessQuickAction(action, user) {
        if (!action.roles) return true;
        
        if (action.roles.includes('all')) return true;
        
        if (action.roles.includes('authenticated') && user.isAuthenticated) return true;
        
        if (user.isAuthenticated && action.roles.includes(user.role)) return true;
        
        return false;
    }

    _isNavItemActive(item) {
        const currentPath = window.location.pathname;
        
        if (item.exact) {
            return currentPath === item.path;
        } else {
            return currentPath.startsWith(item.path);
        }
    }

    // EVENT HANDLERS
    _attachHeaderEventListeners() {
        // Dropdown toggles
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = toggle.closest('.dropdown');
                if (dropdown) {
                    this._toggleDropdown(dropdown);
                }
            });
        });
        
        // User menu toggle
        const userMenuToggle = document.getElementById('user-menu-toggle');
        if (userMenuToggle) {
            userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggleUserMenu();
            });
        }
        
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action');
                const path = btn.getAttribute('data-path');
                
                if (action) {
                    this._handleQuickAction(action);
                } else if (path) {
                    window.location.href = path;
                }
            });
        });
        
        // User menu item actions
        document.querySelectorAll('.user-menu-item[data-action]').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.getAttribute('data-action');
                this._handleUserMenuAction(action);
            });
        });
        
        // Role switching
        document.querySelectorAll('.role-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const role = option.getAttribute('data-role');
                if (role && this.contextResolver?.switchRole) {
                    this.contextResolver.switchRole(role);
                }
            });
        });
        
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const searchClose = document.querySelector('.search-close');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => this._handleSearch(e));
        }
        if (searchClose) {
            searchClose.addEventListener('click', () => this.closeSearch());
        }
    }

    _setupMobileMenu() {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const closeBtn = document.getElementById('mobile-nav-close');
        const userToggleBtn = document.getElementById('mobile-user-toggle');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeMobileMenu());
        }
        
        if (userToggleBtn) {
            userToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggleMobileUserMenu();
            });
        }
        
        // Mobile accordion items
        document.querySelectorAll('.accordion-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const item = toggle.closest('.accordion');
                this._toggleMobileAccordion(item);
            });
        });
        
        // Mobile user menu actions
        document.querySelectorAll('.mobile-user-menu-item[data-action]').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.getAttribute('data-action');
                this._handleUserMenuAction(action);
            });
        });
        
        // Mobile role switching
        document.querySelectorAll('.mobile-role-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const role = option.getAttribute('data-role');
                if (role && this.contextResolver?.switchRole) {
                    this.contextResolver.switchRole(role);
                }
            });
        });
    }

    _toggleDropdown(dropdown) {
        const isActive = dropdown.classList.contains('active');
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown.active').forEach(other => {
            if (other !== dropdown) {
                other.classList.remove('active');
            }
        });
        
        // Toggle this dropdown
        if (isActive) {
            dropdown.classList.remove('active');
        } else {
            dropdown.classList.add('active');
        }
    }

    _toggleUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.classList.toggle('active');
        }
    }

    _toggleMobileAccordion(item) {
        const isActive = item.classList.contains('active');
        
        // Close other accordions
        document.querySelectorAll('.accordion.active').forEach(other => {
            if (other !== item) {
                other.classList.remove('active');
            }
        });
        
        // Toggle this accordion
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    }

    _toggleMobileUserMenu() {
        const userMenu = document.getElementById('mobile-user-menu');
        if (userMenu) {
            userMenu.classList.toggle('active');
        }
    }

    _handleQuickAction(action) {
        switch(action) {
            case 'toggleSearch':
                this.toggleSearch();
                break;
            // Add other quick actions as needed
        }
    }

    _handleUserMenuAction(action) {
        switch(action) {
            case 'logout':
                this._logout();
                break;
            case 'switchRole':
                // Handled by role-option buttons
                break;
        }
    }

    _handleSearch(e) {
        const query = e.target.value.trim();
        if (query.length < 2) {
            this._clearSearchResults();
            return;
        }
        
        // In production, this would call an API
        const results = this._simulateSearch(query);
        this._displaySearchResults(results);
    }

    _simulateSearch(query) {
        // Simulated search results
        return [
            { type: 'loan', label: `Emergency loan for ${query}`, path: '/emergency/search.html' },
            { type: 'lender', label: `Lenders offering ${query}`, path: '/lender/search.html' },
            { type: 'borrower', label: `Borrowers needing ${query}`, path: '/borrower/search.html' },
            { type: 'group', label: `Groups in ${query}`, path: '/groups/search.html' }
        ];
    }

    _displaySearchResults(results) {
        const container = document.querySelector('.search-results');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = '<div class="search-no-results">No results found</div>';
            return;
        }
        
        const html = results.map(result => `
            <a href="${result.path}?q=${encodeURIComponent(result.label)}" class="search-result">
                <span class="result-type">${result.type}</span>
                <span class="result-label">${result.label}</span>
            </a>
        `).join('');
        
        container.innerHTML = html;
    }

    _clearSearchResults() {
        const container = document.querySelector('.search-results');
        if (container) {
            container.innerHTML = '';
        }
    }

    _logout() {
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_context');
        window.location.href = '/auth/login.html';
    }

    // PUBLIC METHODS
    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        const mobileNav = document.getElementById('mobile-nav');
        
        if (mobileNav) {
            if (this.isMobileMenuOpen) {
                mobileNav.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        const mobileNav = document.getElementById('mobile-nav');
        const userMenu = document.getElementById('mobile-user-menu');
        
        if (mobileNav) {
            mobileNav.classList.remove('active');
        }
        
        if (userMenu) {
            userMenu.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }

    toggleSearch() {
        const searchOverlay = document.getElementById('search-overlay');
        if (!searchOverlay) return;
        
        const isActive = searchOverlay.classList.contains('active');
        
        if (isActive) {
            this.closeSearch();
        } else {
            searchOverlay.classList.add('active');
            const searchInput = searchOverlay.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }

    closeSearch() {
        const searchOverlay = document.getElementById('search-overlay');
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            this._clearSearchResults();
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        document.querySelectorAll('.user-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }

    _updateAuthState() {
        // Update UI based on authentication state
        const user = this.userState;
        const header = document.getElementById('mp-header');
        
        if (!header) return;
        
        if (user.isAuthenticated) {
            header.classList.add('authenticated');
            header.classList.remove('guest');
        } else {
            header.classList.add('guest');
            header.classList.remove('authenticated');
        }
        
        // Update any auth-specific UI elements
        this._updateUserSpecificUI();
    }

    _updateUserSpecificUI() {
        const user = this.userState;
        
        // Update notification badges
        const notificationBadges = document.querySelectorAll('.action-badge, .item-badge');
        notificationBadges.forEach(badge => {
            if (user.unreadNotifications > 0) {
                badge.textContent = user.unreadNotifications;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });
        
        // Update user name displays
        const userNames = document.querySelectorAll('.user-name');
        userNames.forEach(element => {
            if (user.name) {
                element.textContent = user.name;
            }
        });
        
        // Update role displays
        const roleDisplays = document.querySelectorAll('.user-role');
        roleDisplays.forEach(element => {
            if (user.role) {
                element.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
            }
        });
    }

    _updateActiveNavItem() {
        const currentPath = window.location.pathname;
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Find and activate current nav item
        const navItems = document.querySelectorAll('.nav-link, .mobile-nav-link');
        navItems.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && currentPath.startsWith(href)) {
                link.closest('.nav-item, .mobile-nav-item')?.classList.add('active');
            }
        });
    }

    // UTILITY METHODS
    _getCountryFlag(countryCode) {
        const flags = {
            'KE': '🇰🇪', 'UG': '🇺🇬', 'TZ': '🇹🇿', 'RW': '🇷🇼',
            'BI': '🇧🇮', 'CD': '🇨🇩', 'NG': '🇳🇬', 'GH': '🇬🇭',
            'SS': '🇸🇸', 'SO': '🇸🇴', 'ZA': '🇿🇦', 'ET': '🇪🇹'
        };
        return flags[countryCode] || '🌍';
    }

    _getCountryName(countryCode) {
        const countries = {
            'KE': 'Kenya', 'UG': 'Uganda', 'TZ': 'Tanzania', 'RW': 'Rwanda',
            'BI': 'Burundi', 'CD': 'DRC', 'NG': 'Nigeria', 'GH': 'Ghana',
            'SS': 'South Sudan', 'SO': 'Somalia', 'ZA': 'South Africa', 'ET': 'Ethiopia'
        };
        return countries[countryCode] || countryCode;
    }

    refresh() {
        this._loadUserState();
        this._renderHeader();
        this._updateAuthState();
    }

    setSticky(enabled) {
        this.isSticky = enabled;
        const header = document.getElementById('mp-header');
        if (header) {
            if (enabled) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }
    }
}

// Initialize and export
const headerController = new MpesewaHeaderController();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MpesewaHeaderController, headerController };
} else {
    window.MpesewaHeaderController = MpesewaHeaderController;
    window.headerController = headerController;
}