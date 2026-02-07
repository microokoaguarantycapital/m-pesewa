/**
 * M-PESEWA HEADER COMPONENT
 * Strict compliance with Sections A, B, C, D requirements
 * Header must have #003366 background, white text, dropdowns for all menus
 */

class Header {
    constructor(options = {}) {
        this.options = {
            container: options.container || 'body',
            showAuth: options.showAuth !== false,
            showCountry: options.showCountry !== false,
            showMobileMenu: options.showMobileMenu !== false,
            showHierarchy: options.showHierarchy !== false,
            ...options
        };
        
        this.state = {
            isAuthenticated: false,
            userRole: null,
            currentCountry: null,
            userName: null,
            subscription: null,
            activeDropdown: null
        };
        
        this.countries = [
            { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KSh', phone: '+254 709 219 000' },
            { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', phone: '+256 392 175 546' },
            { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', phone: '+255 659 073 010' },
            { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', phone: '+250 791 590 801' },
            { code: 'BI', name: 'Burundi', flag: '🇧🇮', currency: 'BIF', phone: '+257 79 000 000' },
            { code: 'CD', name: 'DRC', flag: '🇨🇩', currency: 'CDF', phone: '+243 81 000 0000' },
            { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', phone: '+234 800 000 0000' },
            { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', phone: '+233 24 000 0000' },
            { code: 'SS', name: 'South Sudan', flag: '🇸🇸', currency: 'SSP', phone: '+211 955 000 000' },
            { code: 'SO', name: 'Somalia', flag: '🇸🇴', currency: 'SOS', phone: '+252 63 0000000' },
            { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', phone: '+27 11 000 0000' },
            { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', currency: 'ETB', phone: '+251 11 000 0000' }
        ];
        
        this.emergencyCategories = [
            { id: 'fare', icon: '🚌', name: 'M-pesewa Fare', description: 'Move on, don\'t stall—borrow for your journey.' },
            { id: 'data', icon: '📶', name: 'M-pesewa Data', description: 'Stay connected, stay informed—borrow when your bundle runs out.' },
            { id: 'gas', icon: '🔥', name: 'M-pesewa Cooking Gas', description: 'Cook with confidence—borrow when your gas is low.' },
            { id: 'food', icon: '🍲', name: 'M-pesewa Food', description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today.' },
            { id: 'wifi', icon: '📡', name: 'M-pesewa Wifi', description: 'Stay connected at home.' },
            { id: 'water', icon: '🚰', name: 'M-pesewa Water Bill', description: 'Stay hydrated—borrow for water needs or bills.' },
            { id: 'electricity', icon: '⚡', name: 'M-pesewa Electricity Tokens', description: 'Stay lit, stay powered—borrow tokens when you need it.' },
            { id: 'tv', icon: '📺', name: 'M-pesewa TV Subscription', description: 'Never miss your favorite shows.' },
            { id: 'fuel', icon: '⛽', name: 'M-pesewa Fuel', description: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk).' },
            { id: 'repair', icon: '🔧', name: 'M-pesewa Repair', description: 'Fix it quick—borrow for minor repairs and keep going.' },
            { id: 'credo', icon: '🛠️', name: 'M-pesewa Credo', description: 'Fix it fast—borrow for urgent repairs or tools.' },
            { id: 'sales', icon: '🧾', name: 'M-Pesa Daily Sales Advance', description: 'Small Loan advance for everyday business.' },
            { id: 'capital', icon: '🏪', name: 'M-Pesa Working Capital Advance', description: 'Working capital when your business needs it.' },
            { id: 'soko', icon: '🛒', name: 'M-Pesewa Soko Loan', description: 'Market money when you need it.' },
            { id: 'kidandaski', icon: '🏗️', name: 'M-Pesewa Kidandaski Loan', description: 'Kibanda/stall money when you need it.' },
            { id: 'hawker', icon: '🚶‍♂️', name: 'M-Pesewa Hawker Loan', description: 'Be Street smart, cash flow all time.' },
            { id: 'fuliziwa', icon: '🔄', name: 'M-fuliziwa Loan', description: 'Your fuliza is not enough? Top up here.' },
            { id: 'medicine', icon: '💊', name: 'M-pesewa Medicine', description: 'Health first—borrow for urgent medicines.' },
            { id: 'school', icon: '🎓', name: 'M-pesewa School Fees', description: 'Secure your future without delay.' },
            { id: 'advance', icon: '💸', name: 'M-pesewa Advance', description: 'Quick cash when you need it most.' }
        ];
        
        this.subscriptionPlans = [
            { id: 'basic', name: 'Basic', limit: 1500, monthly: 50, biannual: 250, annual: 500 },
            { id: 'premium', name: 'Premium', limit: 5000, monthly: 250, biannual: 1500, annual: 2500 },
            { id: 'super', name: 'Super', limit: 20000, monthly: 1000, biannual: 5000, annual: 8500 },
            { id: 'lender-of-lenders', name: 'Lender of Lenders', limit: 50000, monthly: 500, biannual: 3500, annual: 6500 }
        ];
        
        this.headerElement = null;
        this.mobileMenuOpen = false;
        this.currentPath = window.location.pathname;
        
        this.initialize();
    }
    
    initialize() {
        this.loadUserState();
        this.render();
        this.setupEventListeners();
        this.setupResizeHandler();
        this.updateActiveNav();
        
        // Listen for auth state changes
        window.addEventListener('mpesewa:authenticationChange', (e) => {
            this.state.isAuthenticated = e.detail.isAuthenticated;
            this.state.userRole = e.detail.role;
            this.updateAuthDisplay();
        });
        
        // Listen for country changes
        window.addEventListener('mpesewa:countryChange', (e) => {
            this.state.currentCountry = e.detail.country;
            this.updateCountryDisplay();
        });
        
        // Listen for subscription changes
        window.addEventListener('mpesewa:subscriptionChange', (e) => {
            this.state.subscription = e.detail.subscription;
            this.updateSubscriptionBadge();
        });
    }
    
    loadUserState() {
        // Load from localStorage
        const savedState = localStorage.getItem('mpesewa_user_state');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            this.state = { ...this.state, ...parsed };
        }
        
        // Load from session
        const session = sessionStorage.getItem('mpesewa_session');
        if (session) {
            const sessionData = JSON.parse(session);
            this.state.isAuthenticated = sessionData.isAuthenticated || false;
            this.state.userRole = sessionData.role || null;
            this.state.userName = sessionData.userName || null;
        }
        
        // Get current country from URL or localStorage
        const countryFromPath = this.extractCountryFromPath(this.currentPath);
        if (countryFromPath) {
            this.state.currentCountry = countryFromPath;
        } else {
            const savedCountry = localStorage.getItem('mpesewa_country');
            if (savedCountry && this.countries.find(c => c.code === savedCountry)) {
                this.state.currentCountry = savedCountry;
            }
        }
    }
    
    extractCountryFromPath(path) {
        const countryMap = {
            'kenya': 'KE', 'uganda': 'UG', 'tanzania': 'TZ', 'rwanda': 'RW',
            'burundi': 'BI', 'drc': 'CD', 'nigeria': 'NG', 'ghana': 'GH',
            'south-sudan': 'SS', 'somalia': 'SO', 'south-africa': 'ZA', 'ethiopia': 'ET'
        };
        
        const match = path.match(/\/(kenya|uganda|tanzania|rwanda|burundi|drc|nigeria|ghana|south-sudan|somalia|south-africa|ethiopia)/i);
        if (match) {
            return countryMap[match[1].toLowerCase()];
        }
        
        return null;
    }
    
    render() {
        const container = typeof this.options.container === 'string' 
            ? document.querySelector(this.options.container) 
            : this.options.container;
        
        if (!container) {
            console.error('Header container not found:', this.options.container);
            return;
        }
        
        // Create header element
        this.headerElement = document.createElement('header');
        this.headerElement.className = 'mp-header';
        this.headerElement.setAttribute('role', 'banner');
        
        // Build header structure
        this.headerElement.innerHTML = this.buildHeaderHTML();
        
        // Add to container
        container.insertBefore(this.headerElement, container.firstChild);
        
        // Add CSS if not already present
        this.injectStyles();
        
        // Initialize mobile menu
        this.initMobileMenu();
    }
    
    buildHeaderHTML() {
        return `
            <div class="header-container">
                <!-- Logo Section -->
                <div class="header-logo">
                    <a href="/index.html" class="logo-link" aria-label="M-Pesewa Home">
                        <div class="logo-mark">
                            <span class="logo-symbol">M₱</span>
                        </div>
                        <div class="logo-text">
                            <h1 class="logo-title">M-PESEWA</h1>
                            <p class="logo-subtitle">Trusted Circles Lending</p>
                        </div>
                    </a>
                </div>
                
                <!-- Desktop Navigation -->
                <nav class="header-nav desktop-nav" aria-label="Main Navigation">
                    <ul class="nav-list">
                        ${this.buildNavItems()}
                    </ul>
                </nav>
                
                <!-- Auth Section -->
                <div class="header-auth">
                    ${this.buildAuthSection()}
                </div>
                
                <!-- Mobile Menu Toggle -->
                <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                    <span class="menu-icon">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </span>
                </button>
                
                <!-- Hierarchy Indicator (Desktop only) -->
                ${this.options.showHierarchy ? this.buildHierarchyIndicator() : ''}
            </div>
            
            <!-- Mobile Navigation -->
            <div class="mobile-nav-overlay" aria-hidden="true"></div>
            <div class="mobile-nav-container">
                <div class="mobile-nav-header">
                    <div class="mobile-nav-logo">
                        <span class="mobile-logo-symbol">M₱</span>
                        <span class="mobile-logo-text">M-PESEWA</span>
                    </div>
                    <button class="mobile-nav-close" aria-label="Close mobile menu">×</button>
                </div>
                <nav class="mobile-nav-content" aria-label="Mobile Navigation">
                    ${this.buildMobileNavItems()}
                </nav>
                <div class="mobile-nav-footer">
                    ${this.buildMobileAuthSection()}
                </div>
            </div>
            
            <!-- Country Selection Modal -->
            <div class="country-modal" aria-hidden="true">
                <div class="country-modal-content">
                    <div class="country-modal-header">
                        <h3>Select Your Country</h3>
                        <button class="country-modal-close" aria-label="Close country selection">×</button>
                    </div>
                    <div class="country-modal-body">
                        <div class="country-grid">
                            ${this.countries.map(country => `
                                <button class="country-option" data-country="${country.code}" data-flag="${country.flag}" data-name="${country.name}">
                                    <span class="country-option-flag">${country.flag}</span>
                                    <span class="country-option-name">${country.name}</span>
                                    <span class="country-option-currency">${country.currency}</span>
                                </button>
                            `).join('')}
                        </div>
                        <div class="country-modal-note">
                            <strong>Note:</strong> Country selection is locked after registration. No cross-country lending or borrowing allowed.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    buildNavItems() {
        const isActive = (path) => this.currentPath.includes(path) ? 'active' : '';
        
        return `
            <li class="nav-item">
                <a href="/index.html" class="nav-link ${isActive('index.html') || this.currentPath === '/' ? 'active' : ''}">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-text">Home</span>
                </a>
            </li>
            
            <!-- Lenders Dropdown -->
            <li class="nav-item dropdown">
                <button class="nav-link dropdown-toggle" aria-expanded="false" aria-haspopup="true">
                    <span class="nav-icon">💰</span>
                    <span class="nav-text">Lenders</span>
                    <span class="dropdown-arrow">▾</span>
                </button>
                <div class="dropdown-menu" role="menu">
                    <a href="/lender/dashboard.html" class="dropdown-item ${isActive('lender/dashboard') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">📊</span>
                        Dashboard
                    </a>
                    <a href="/lender/portfolio.html" class="dropdown-item ${isActive('lender/portfolio') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">📈</span>
                        Portfolio
                    </a>
                    <a href="/lender/history.html" class="dropdown-item ${isActive('lender/history') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">📋</span>
                        History
                    </a>
                    <a href="/lender/rules.html" class="dropdown-item ${isActive('lender/rules') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">📜</span>
                        Rules
                    </a>
                    <a href="/lender/risk.html" class="dropdown-item ${isActive('lender/risk') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">⚠️</span>
                        Risk
                    </a>
                    ${this.state.userRole === 'lender' && this.state.subscription ? `
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-subscription">
                            <div class="subscription-tier">${this.state.subscription.plan} Tier</div>
                            <div class="subscription-limit">Limit: ${this.state.subscription.limit} ${this.getCurrentCurrency()}</div>
                        </div>
                    ` : ''}
                </div>
            </li>
            
            <!-- Borrowers Dropdown -->
            <li class="nav-item dropdown">
                <button class="nav-link dropdown-toggle" aria-expanded="false" aria-haspopup="true">
                    <span class="nav-icon">💼</span>
                    <span class="nav-text">Borrowers</span>
                    <span class="dropdown-arrow">▾</span>
                </button>
                <div class="dropdown-menu" role="menu">
                    <a href="/borrower/dashboard.html" class="dropdown-item ${isActive('borrower/dashboard') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">📊</span>
                        Dashboard
                    </a>
                    <a href="/borrower/apply.html" class="dropdown-item ${isActive('borrower/apply') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">📝</span>
                        Apply for Loan
                    </a>
                    <a href="/borrower/history.html" class="dropdown-item ${isActive('borrower/history') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">📋</span>
                        Borrow History
                    </a>
                    <a href="/borrower/repayments.html" class="dropdown-item ${isActive('borrower/repayments') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">💳</span>
                        Repayments
                    </a>
                    <a href="/borrower/disputes.html" class="dropdown-item ${isActive('borrower/disputes') ? 'active' : ''}" role="menuitem">
                        <span class="dropdown-icon">⚖️</span>
                        Disputes
                    </a>
                    ${this.state.userRole === 'borrower' ? `
                        <div class="dropdown-divider"></div>
                        <a href="/blacklist/status.html" class="dropdown-item" role="menuitem">
                            <span class="dropdown-icon">🚫</span>
                            Blacklist Status
                        </a>
                    ` : ''}
                </div>
            </li>
            
            <!-- Emergency Hub Dropdown -->
            <li class="nav-item dropdown emergency-dropdown">
                <button class="nav-link dropdown-toggle" aria-expanded="false" aria-haspopup="true">
                    <span class="nav-icon">🚨</span>
                    <span class="nav-text">Emergency Hub</span>
                    <span class="dropdown-arrow">▾</span>
                </button>
                <div class="dropdown-menu emergency-menu" role="menu">
                    <div class="emergency-menu-header">
                        <h4>20 Emergency Categories</h4>
                        <a href="/emergency/index.html" class="view-all-link">View All →</a>
                    </div>
                    <div class="emergency-categories-grid">
                        ${this.emergencyCategories.slice(0, 8).map(category => `
                            <a href="/emergency/${category.id}.html" class="emergency-category" role="menuitem">
                                <span class="category-icon">${category.icon}</span>
                                <span class="category-name">${category.name}</span>
                            </a>
                        `).join('')}
                    </div>
                    <div class="emergency-menu-footer">
                        <a href="/emergency/index.html" class="btn btn-outline btn-sm">All 20 Categories</a>
                    </div>
                </div>
            </li>
            
            <!-- Subscription Plans Dropdown -->
            <li class="nav-item dropdown">
                <button class="nav-link dropdown-toggle" aria-expanded="false" aria-haspopup="true">
                    <span class="nav-icon">📋</span>
                    <span class="nav-text">Subscription Plans</span>
                    <span class="dropdown-arrow">▾</span>
                </button>
                <div class="dropdown-menu subscription-menu" role="menu">
                    <div class="subscription-menu-header">
                        <h4>Lender Subscriptions</h4>
                        <div class="subscription-note">Borrowers pay no fees</div>
                    </div>
                    ${this.subscriptionPlans.map(plan => `
                        <a href="/subscription/${plan.id}.html" class="subscription-plan" role="menuitem">
                            <div class="plan-header">
                                <span class="plan-name">${plan.name}</span>
                                <span class="plan-limit">Up to ${plan.limit.toLocaleString()} ${this.getCurrentCurrency()}/week</span>
                            </div>
                            <div class="plan-pricing">
                                <span class="price">${plan.monthly} ${this.getCurrentCurrency()}/month</span>
                                <span class="price-annual">${plan.annual} ${this.getCurrentCurrency()}/year</span>
                            </div>
                        </a>
                    `).join('')}
                    <div class="dropdown-divider"></div>
                    <div class="subscription-menu-footer">
                        <a href="/subscription/current.html" class="dropdown-item" role="menuitem">
                            <span class="dropdown-icon">📊</span>
                            Current Plan
                        </a>
                        <a href="/subscription/upgrade.html" class="dropdown-item" role="menuitem">
                            <span class="dropdown-icon">⬆️</span>
                            Upgrade
                        </a>
                        <a href="/subscription/history.html" class="dropdown-item" role="menuitem">
                            <span class="dropdown-icon">📋</span>
                            History
                        </a>
                        <a href="/subscription/invoices.html" class="dropdown-item" role="menuitem">
                            <span class="dropdown-icon">🧾</span>
                            Invoices
                        </a>
                    </div>
                </div>
            </li>
            
            <!-- Country Dropdown -->
            <li class="nav-item dropdown country-dropdown">
                <button class="nav-link dropdown-toggle" aria-expanded="false" aria-haspopup="true">
                    <span class="nav-icon">🌍</span>
                    <span class="nav-text">Country</span>
                    <span class="country-flag">${this.state.currentCountry ? this.getCountryFlag(this.state.currentCountry) : '🌐'}</span>
                    <span class="dropdown-arrow">▾</span>
                </button>
                <div class="dropdown-menu country-menu" role="menu">
                    <div class="country-menu-header">
                        <h4>Select Country</h4>
                        ${this.state.currentCountry ? `
                            <div class="current-country">
                                Current: ${this.getCountryFlag(this.state.currentCountry)} ${this.getCountryName(this.state.currentCountry)}
                            </div>
                        ` : ''}
                    </div>
                    <div class="country-list">
                        ${this.countries.map(country => `
                            <button class="country-item ${this.state.currentCountry === country.code ? 'active' : ''}" 
                                    data-country="${country.code}" 
                                    role="menuitem">
                                <span class="country-flag">${country.flag}</span>
                                <span class="country-name">${country.name}</span>
                                <span class="country-currency">${country.currency}</span>
                                ${this.state.currentCountry === country.code ? `
                                    <span class="country-check">✓</span>
                                ` : ''}
                            </button>
                        `).join('')}
                    </div>
                    <div class="country-menu-footer">
                        <div class="country-rules">
                            <strong>Rules:</strong> Country locked after registration. No cross-border transactions.
                        </div>
                    </div>
                </div>
            </li>
        `;
    }
    
    buildAuthSection() {
        if (this.state.isAuthenticated) {
            return `
                <div class="auth-user">
                    <div class="user-avatar">
                        ${this.state.userRole === 'lender' ? '💰' : '💼'}
                    </div>
                    <div class="user-info">
                        <span class="user-name">${this.state.userName || 'User'}</span>
                        <span class="user-role">${this.state.userRole}</span>
                    </div>
                    <div class="user-actions">
                        <a href="/auth/profile.html" class="btn btn-outline btn-sm">Profile</a>
                        <button class="btn btn-secondary btn-sm logout-btn">Logout</button>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="auth-buttons">
                <a href="/auth/login.html" class="btn btn-outline">Sign In</a>
                <a href="/auth/register.html" class="btn btn-primary">Sign Up</a>
            </div>
        `;
    }
    
    buildHierarchyIndicator() {
        return `
            <div class="hierarchy-indicator">
                <span class="hierarchy-text">Global → Country → Groups → Lenders → Borrowers</span>
            </div>
        `;
    }
    
    buildMobileNavItems() {
        const isActive = (path) => this.currentPath.includes(path) ? 'active' : '';
        
        return `
            <a href="/index.html" class="mobile-nav-link ${isActive('index.html') || this.currentPath === '/' ? 'active' : ''}">
                <span class="mobile-nav-icon">🏠</span>
                <span class="mobile-nav-text">Home</span>
            </a>
            
            <div class="mobile-nav-section">
                <div class="mobile-nav-section-header">
                    <span class="mobile-nav-section-title">Lenders</span>
                    <span class="mobile-nav-section-icon">💰</span>
                </div>
                <div class="mobile-nav-section-content">
                    <a href="/lender/dashboard.html" class="mobile-nav-sublink ${isActive('lender/dashboard') ? 'active' : ''}">Dashboard</a>
                    <a href="/lender/portfolio.html" class="mobile-nav-sublink ${isActive('lender/portfolio') ? 'active' : ''}">Portfolio</a>
                    <a href="/lender/history.html" class="mobile-nav-sublink ${isActive('lender/history') ? 'active' : ''}">History</a>
                    <a href="/lender/rules.html" class="mobile-nav-sublink ${isActive('lender/rules') ? 'active' : ''}">Rules</a>
                    <a href="/lender/risk.html" class="mobile-nav-sublink ${isActive('lender/risk') ? 'active' : ''}">Risk</a>
                </div>
            </div>
            
            <div class="mobile-nav-section">
                <div class="mobile-nav-section-header">
                    <span class="mobile-nav-section-title">Borrowers</span>
                    <span class="mobile-nav-section-icon">💼</span>
                </div>
                <div class="mobile-nav-section-content">
                    <a href="/borrower/dashboard.html" class="mobile-nav-sublink ${isActive('borrower/dashboard') ? 'active' : ''}">Dashboard</a>
                    <a href="/borrower/apply.html" class="mobile-nav-sublink ${isActive('borrower/apply') ? 'active' : ''}">Apply for Loan</a>
                    <a href="/borrower/history.html" class="mobile-nav-sublink ${isActive('borrower/history') ? 'active' : ''}">Borrow History</a>
                    <a href="/borrower/repayments.html" class="mobile-nav-sublink ${isActive('borrower/repayments') ? 'active' : ''}">Repayments</a>
                    <a href="/borrower/disputes.html" class="mobile-nav-sublink ${isActive('borrower/disputes') ? 'active' : ''}">Disputes</a>
                </div>
            </div>
            
            <a href="/emergency/index.html" class="mobile-nav-link ${isActive('emergency') ? 'active' : ''}">
                <span class="mobile-nav-icon">🚨</span>
                <span class="mobile-nav-text">Emergency Hub</span>
                <span class="mobile-nav-badge">20</span>
            </a>
            
            <div class="mobile-nav-section">
                <div class="mobile-nav-section-header">
                    <span class="mobile-nav-section-title">Subscription Plans</span>
                    <span class="mobile-nav-section-icon">📋</span>
                </div>
                <div class="mobile-nav-section-content">
                    <a href="/subscription/current.html" class="mobile-nav-sublink">Current Plan</a>
                    <a href="/subscription/upgrade.html" class="mobile-nav-sublink">Upgrade</a>
                    <a href="/subscription/history.html" class="mobile-nav-sublink">History</a>
                    <a href="/subscription/invoices.html" class="mobile-nav-sublink">Invoices</a>
                </div>
            </div>
            
            <div class="mobile-nav-section">
                <div class="mobile-nav-section-header">
                    <span class="mobile-nav-section-title">Country</span>
                    <span class="mobile-nav-section-icon">🌍</span>
                </div>
                <div class="mobile-nav-section-content country-mobile-list">
                    ${this.countries.map(country => `
                        <button class="mobile-country-item ${this.state.currentCountry === country.code ? 'active' : ''}" 
                                data-country="${country.code}">
                            <span class="mobile-country-flag">${country.flag}</span>
                            <span class="mobile-country-name">${country.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    buildMobileAuthSection() {
        if (this.state.isAuthenticated) {
            return `
                <div class="mobile-auth-user">
                    <div class="mobile-user-info">
                        <div class="mobile-user-avatar">${this.state.userRole === 'lender' ? '💰' : '💼'}</div>
                        <div>
                            <div class="mobile-user-name">${this.state.userName || 'User'}</div>
                            <div class="mobile-user-role">${this.state.userRole}</div>
                        </div>
                    </div>
                    <div class="mobile-user-actions">
                        <a href="/auth/profile.html" class="btn btn-outline btn-block">Profile</a>
                        <button class="btn btn-secondary btn-block logout-btn">Logout</button>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="mobile-auth-buttons">
                <a href="/auth/login.html" class="btn btn-outline btn-block">Sign In</a>
                <a href="/auth/register.html" class="btn btn-primary btn-block">Sign Up</a>
            </div>
        `;
    }
    
    injectStyles() {
        if (document.getElementById('mp-header-styles')) return;
        
        const styles = `
            /* M-PESEWA HEADER STYLES - Strict compliance with brand guidelines */
            
            .mp-header {
                background-color: #003366 !important;
                color: #ffffff !important;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                box-shadow: 0 2px 20px rgba(0, 51, 102, 0.1);
                height: 70px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            .header-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 24px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            /* Logo Styles */
            .header-logo {
                flex-shrink: 0;
            }
            
            .logo-link {
                display: flex;
                align-items: center;
                text-decoration: none;
                color: inherit;
                gap: 12px;
            }
            
            .logo-mark {
                width: 40px;
                height: 40px;
                background: #ffffff;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                color: #003366;
                font-size: 18px;
            }
            
            .logo-text {
                display: flex;
                flex-direction: column;
            }
            
            .logo-title {
                font-size: 20px;
                font-weight: 700;
                margin: 0;
                line-height: 1;
                color: #ffffff;
            }
            
            .logo-subtitle {
                font-size: 11px;
                opacity: 0.9;
                margin: 2px 0 0;
                font-weight: 400;
                color: #ffffff;
            }
            
            /* Desktop Navigation */
            .desktop-nav {
                flex: 1;
                margin: 0 32px;
            }
            
            .nav-list {
                display: flex;
                list-style: none;
                margin: 0;
                padding: 0;
                gap: 2px;
            }
            
            .nav-item {
                position: relative;
            }
            
            .nav-link {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                color: #ffffff;
                text-decoration: none;
                font-weight: 500;
                font-size: 14px;
                border-radius: 6px;
                transition: all 0.2s ease;
                background: transparent;
                border: none;
                cursor: pointer;
                font-family: inherit;
            }
            
            .nav-link:hover,
            .nav-link.active {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }
            
            .nav-link.active {
                background: rgba(0, 153, 255, 0.2);
                border-bottom: 2px solid #0099ff;
            }
            
            .nav-icon {
                font-size: 16px;
            }
            
            .dropdown-arrow {
                font-size: 12px;
                opacity: 0.8;
                margin-left: 4px;
            }
            
            /* Dropdown Menus */
            .dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                min-width: 240px;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                padding: 12px 0;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.2s ease;
                z-index: 1001;
                border: 1px solid #e9ecef;
            }
            
            .dropdown:hover .dropdown-menu,
            .dropdown.active .dropdown-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 16px;
                color: #003366;
                text-decoration: none;
                font-size: 14px;
                transition: all 0.2s;
                border-left: 3px solid transparent;
            }
            
            .dropdown-item:hover,
            .dropdown-item.active {
                background: #f8f9fa;
                color: #003366;
                border-left-color: #0099ff;
            }
            
            .dropdown-icon {
                font-size: 16px;
                width: 20px;
                text-align: center;
            }
            
            /* Emergency Hub Special Dropdown */
            .emergency-menu {
                min-width: 500px;
                max-width: 600px;
            }
            
            .emergency-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px 12px;
                border-bottom: 1px solid #e9ecef;
                margin-bottom: 12px;
            }
            
            .emergency-menu-header h4 {
                margin: 0;
                color: #003366;
                font-size: 15px;
                font-weight: 600;
            }
            
            .view-all-link {
                color: #0099ff;
                text-decoration: none;
                font-size: 13px;
                font-weight: 500;
            }
            
            .emergency-categories-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                padding: 0 12px;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .emergency-category {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                background: #f8f9fa;
                border-radius: 6px;
                color: #003366;
                text-decoration: none;
                transition: all 0.2s;
                border: 1px solid transparent;
            }
            
            .emergency-category:hover {
                background: #ffffff;
                border-color: #0099ff;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 153, 255, 0.1);
            }
            
            .category-icon {
                font-size: 20px;
            }
            
            .category-name {
                font-size: 13px;
                font-weight: 500;
                flex: 1;
            }
            
            /* Subscription Dropdown */
            .subscription-menu {
                min-width: 300px;
            }
            
            .subscription-menu-header {
                padding: 0 16px 12px;
                border-bottom: 1px solid #e9ecef;
                margin-bottom: 12px;
            }
            
            .subscription-menu-header h4 {
                margin: 0 0 4px;
                color: #003366;
                font-size: 15px;
                font-weight: 600;
            }
            
            .subscription-note {
                font-size: 12px;
                color: #28a745;
                font-weight: 500;
            }
            
            .subscription-plan {
                display: block;
                padding: 12px 16px;
                border-bottom: 1px solid #f8f9fa;
                text-decoration: none;
                transition: all 0.2s;
            }
            
            .subscription-plan:hover {
                background: #f8f9fa;
            }
            
            .plan-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
            }
            
            .plan-name {
                font-weight: 600;
                color: #003366;
                font-size: 14px;
            }
            
            .plan-limit {
                font-size: 12px;
                color: #666;
                background: #f8f9fa;
                padding: 2px 6px;
                border-radius: 4px;
            }
            
            .plan-pricing {
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                color: #555;
            }
            
            .price {
                font-weight: 600;
                color: #003366;
            }
            
            .price-annual {
                color: #28a745;
                font-weight: 500;
            }
            
            /* Country Dropdown */
            .country-menu {
                min-width: 280px;
            }
            
            .country-menu-header {
                padding: 0 16px 12px;
                border-bottom: 1px solid #e9ecef;
                margin-bottom: 12px;
            }
            
            .country-menu-header h4 {
                margin: 0 0 8px;
                color: #003366;
                font-size: 15px;
                font-weight: 600;
            }
            
            .current-country {
                font-size: 13px;
                color: #0099ff;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .country-list {
                max-height: 300px;
                overflow-y: auto;
                padding: 0 8px;
            }
            
            .country-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                width: 100%;
                background: none;
                border: none;
                text-align: left;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                color: #003366;
                font-family: inherit;
            }
            
            .country-item:hover {
                background: #f8f9fa;
            }
            
            .country-item.active {
                background: #0099ff10;
                border-left: 3px solid #0099ff;
            }
            
            .country-flag {
                font-size: 20px;
                width: 30px;
                text-align: center;
            }
            
            .country-name {
                flex: 1;
                font-size: 14px;
                font-weight: 500;
            }
            
            .country-currency {
                font-size: 12px;
                color: #666;
                background: #f8f9fa;
                padding: 2px 6px;
                border-radius: 4px;
            }
            
            .country-check {
                color: #28a745;
                font-weight: bold;
            }
            
            .country-menu-footer {
                padding: 12px 16px 0;
                border-top: 1px solid #e9ecef;
                margin-top: 12px;
            }
            
            .country-rules {
                font-size: 11px;
                color: #666;
                line-height: 1.4;
            }
            
            /* Auth Section */
            .header-auth {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .auth-buttons {
                display: flex;
                gap: 8px;
            }
            
            .btn {
                padding: 10px 20px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 14px;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.2s;
                border: 2px solid transparent;
                font-family: inherit;
            }
            
            .btn-outline {
                background: transparent;
                border-color: #ffffff;
                color: #ffffff;
            }
            
            .btn-outline:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .btn-primary {
                background: #0099ff;
                border-color: #0099ff;
                color: #ffffff;
            }
            
            .btn-primary:hover {
                background: #0088ee;
                border-color: #0088ee;
            }
            
            .btn-secondary {
                background: #28a745;
                border-color: #28a745;
                color: #ffffff;
            }
            
            .btn-secondary:hover {
                background: #238c3d;
                border-color: #238c3d;
            }
            
            .btn-sm {
                padding: 6px 12px;
                font-size: 13px;
            }
            
            /* User Auth Display */
            .auth-user {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }
            
            .user-avatar {
                width: 36px;
                height: 36px;
                background: #0099ff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color: #ffffff;
            }
            
            .user-info {
                display: flex;
                flex-direction: column;
            }
            
            .user-name {
                font-weight: 600;
                font-size: 14px;
                color: #ffffff;
            }
            
            .user-role {
                font-size: 11px;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.8);
                letter-spacing: 0.5px;
            }
            
            .user-actions {
                display: flex;
                gap: 8px;
            }
            
            /* Mobile Menu Toggle */
            .mobile-menu-toggle {
                display: none;
                background: none;
                border: none;
                width: 40px;
                height: 40px;
                cursor: pointer;
                padding: 0;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 4px;
            }
            
            .menu-icon {
                display: flex;
                flex-direction: column;
                gap: 4px;
                width: 24px;
            }
            
            .bar {
                width: 100%;
                height: 2px;
                background: #ffffff;
                transition: all 0.3s ease;
            }
            
            /* Hierarchy Indicator */
            .hierarchy-indicator {
                position: absolute;
                bottom: -25px;
                left: 0;
                right: 0;
                background: #1f2a37;
                color: #ffffff;
                padding: 6px 24px;
                font-size: 11px;
                text-align: center;
                font-weight: 500;
                letter-spacing: 0.5px;
                display: none;
            }
            
            .hierarchy-text {
                opacity: 0.9;
            }
            
            /* Mobile Navigation */
            .mobile-nav-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                backdrop-filter: blur(3px);
            }
            
            .mobile-nav-container {
                position: fixed;
                top: 0;
                right: -320px;
                bottom: 0;
                width: 300px;
                background: #ffffff;
                z-index: 1000;
                transition: right 0.3s ease;
                display: flex;
                flex-direction: column;
                box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
            }
            
            .mobile-nav-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #e9ecef;
                background: #003366;
                color: #ffffff;
            }
            
            .mobile-nav-logo {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 700;
                font-size: 18px;
            }
            
            .mobile-logo-symbol {
                background: #ffffff;
                color: #003366;
                width: 30px;
                height: 30px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            
            .mobile-nav-close {
                background: none;
                border: none;
                color: #ffffff;
                font-size: 28px;
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            
            .mobile-nav-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .mobile-nav-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }
            
            .mobile-nav-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 16px;
                color: #003366;
                text-decoration: none;
                font-weight: 500;
                border-radius: 8px;
                margin-bottom: 4px;
                transition: all 0.2s;
            }
            
            .mobile-nav-link:hover,
            .mobile-nav-link.active {
                background: #f8f9fa;
                color: #003366;
            }
            
            .mobile-nav-icon {
                font-size: 18px;
                width: 24px;
                text-align: center;
            }
            
            .mobile-nav-badge {
                background: #0099ff;
                color: #ffffff;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 10px;
                margin-left: auto;
            }
            
            .mobile-nav-section {
                margin-bottom: 16px;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .mobile-nav-section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: #f8f9fa;
                cursor: pointer;
            }
            
            .mobile-nav-section-title {
                font-weight: 600;
                color: #003366;
                font-size: 14px;
            }
            
            .mobile-nav-section-icon {
                font-size: 16px;
            }
            
            .mobile-nav-section-content {
                padding: 12px 16px;
                border-top: 1px solid #e9ecef;
                display: none;
            }
            
            .mobile-nav-sublink {
                display: block;
                padding: 10px 12px;
                color: #555;
                text-decoration: none;
                font-size: 13px;
                border-radius: 6px;
                margin-bottom: 4px;
                transition: all 0.2s;
                border-left: 3px solid transparent;
            }
            
            .mobile-nav-sublink:hover,
            .mobile-nav-sublink.active {
                background: #f8f9fa;
                color: #003366;
                border-left-color: #0099ff;
            }
            
            .country-mobile-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .mobile-country-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 20px;
                color: #003366;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .mobile-country-item:hover,
            .mobile-country-item.active {
                background: #003366;
                color: #ffffff;
                border-color: #003366;
            }
            
            .mobile-country-flag {
                font-size: 16px;
            }
            
            .mobile-nav-footer {
                padding: 20px;
                border-top: 1px solid #e9ecef;
                background: #f8f9fa;
            }
            
            .mobile-auth-user {
                text-align: center;
            }
            
            .mobile-user-info {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
                justify-content: center;
            }
            
            .mobile-user-avatar {
                width: 48px;
                height: 48px;
                background: #003366;
                color: #ffffff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }
            
            .mobile-user-name {
                font-weight: 600;
                color: #003366;
                font-size: 16px;
            }
            
            .mobile-user-role {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
            }
            
            .mobile-user-actions {
                display: grid;
                gap: 10px;
            }
            
            .mobile-auth-buttons {
                display: grid;
                gap: 10px;
            }
            
            .btn-block {
                display: block;
                width: 100%;
                text-align: center;
            }
            
            /* Country Modal */
            .country-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1100;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                backdrop-filter: blur(3px);
            }
            
            .country-modal-content {
                background: #ffffff;
                border-radius: 16px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            
            .country-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px;
                background: #003366;
                color: #ffffff;
            }
            
            .country-modal-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
            }
            
            .country-modal-close {
                background: none;
                border: none;
                color: #ffffff;
                font-size: 28px;
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            
            .country-modal-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .country-modal-body {
                padding: 24px;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .country-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 12px;
                margin-bottom: 24px;
            }
            
            .country-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 16px 12px;
                background: #f8f9fa;
                border: 2px solid transparent;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                color: #003366;
                font-family: inherit;
            }
            
            .country-option:hover {
                background: #ffffff;
                border-color: #0099ff;
                transform: translateY(-4px);
                box-shadow: 0 8px 24px rgba(0, 153, 255, 0.15);
            }
            
            .country-option-flag {
                font-size: 32px;
                margin-bottom: 8px;
            }
            
            .country-option-name {
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
                text-align: center;
            }
            
            .country-option-currency {
                font-size: 12px;
                color: #666;
                background: #ffffff;
                padding: 2px 8px;
                border-radius: 12px;
            }
            
            .country-modal-note {
                padding: 16px;
                background: #f8f9fa;
                border-radius: 8px;
                font-size: 13px;
                color: #666;
                line-height: 1.5;
            }
            
            /* Responsive Design */
            @media (max-width: 1200px) {
                .desktop-nav {
                    margin: 0 16px;
                }
                
                .nav-link {
                    padding: 12px 12px;
                    font-size: 13px;
                }
            }
            
            @media (max-width: 1024px) {
                .emergency-menu {
                    min-width: 400px;
                }
                
                .emergency-categories-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: flex;
                }
                
                .desktop-nav,
                .header-auth,
                .hierarchy-indicator {
                    display: none;
                }
                
                .header-container {
                    padding: 0 16px;
                }
                
                .logo-title {
                    font-size: 18px;
                }
                
                .logo-subtitle {
                    font-size: 10px;
                }
                
                /* Mobile menu active states */
                .mobile-nav-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }
                
                .mobile-nav-container.active {
                    right: 0;
                }
                
                .mobile-nav-section.active .mobile-nav-section-content {
                    display: block;
                }
                
                .country-modal.active {
                    opacity: 1;
                    visibility: visible;
                }
                
                .country-modal.active .country-modal-content {
                    transform: translateY(0);
                }
            }
            
            /* Active states */
            .dropdown-divider {
                height: 1px;
                background: #e9ecef;
                margin: 8px 0;
            }
            
            .dropdown-subscription {
                padding: 12px 16px;
                background: #f8f9fa;
                border-radius: 6px;
                margin: 8px;
            }
            
            .subscription-tier {
                font-weight: 600;
                color: #003366;
                font-size: 14px;
                margin-bottom: 4px;
            }
            
            .subscription-limit {
                font-size: 12px;
                color: #28a745;
                font-weight: 500;
            }
            
            .emergency-menu-footer {
                padding: 12px 16px 0;
                border-top: 1px solid #e9ecef;
                margin-top: 12px;
            }
            
            .subscription-menu-footer {
                padding: 8px 0 0;
            }
            
            /* Accessibility */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            /* Focus styles */
            button:focus,
            a:focus {
                outline: 2px solid #0099ff;
                outline-offset: 2px;
            }
        `;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'mp-header-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }
    
    initMobileMenu() {
        // Mobile menu toggle
        const toggleBtn = this.headerElement.querySelector('.mobile-menu-toggle');
        const closeBtn = this.headerElement.querySelector('.mobile-nav-close');
        const overlay = this.headerElement.querySelector('.mobile-nav-overlay');
        const mobileNav = this.headerElement.querySelector('.mobile-nav-container');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.openMobileMenu());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeMobileMenu());
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => this.closeMobileMenu());
        }
        
        // Mobile section toggles
        const sectionHeaders = this.headerElement.querySelectorAll('.mobile-nav-section-header');
        sectionHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const section = e.currentTarget.parentElement;
                section.classList.toggle('active');
            });
        });
        
        // Mobile country selection
        const countryItems = this.headerElement.querySelectorAll('.mobile-country-item, .country-item');
        countryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const countryCode = e.currentTarget.dataset.country;
                this.selectCountry(countryCode);
                this.closeMobileMenu();
            });
        });
        
        // Logout button
        const logoutBtns = this.headerElement.querySelectorAll('.logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => this.logout());
        });
        
        // Country modal
        const countryModal = this.headerElement.querySelector('.country-modal');
        const countryModalClose = this.headerElement.querySelector('.country-modal-close');
        const countryOptions = this.headerElement.querySelectorAll('.country-option');
        
        // Open country modal from country dropdown
        const countryDropdown = this.headerElement.querySelector('.country-dropdown .dropdown-toggle');
        if (countryDropdown) {
            countryDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openCountryModal();
            });
        }
        
        if (countryModalClose) {
            countryModalClose.addEventListener('click', () => this.closeCountryModal());
        }
        
        if (countryOptions) {
            countryOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    const countryCode = e.currentTarget.dataset.country;
                    this.selectCountry(countryCode);
                    this.closeCountryModal();
                });
            });
        }
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });
        
        // Close dropdowns on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.closeMobileMenu();
                this.closeCountryModal();
            }
        });
    }
    
    setupEventListeners() {
        // Dropdown toggles
        const dropdownToggles = this.headerElement.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = e.currentTarget.closest('.dropdown');
                
                // Close other dropdowns
                this.closeAllDropdowns();
                
                // Toggle this dropdown
                dropdown.classList.toggle('active');
            });
        });
        
        // Close dropdown when clicking on item
        const dropdownItems = this.headerElement.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeAllDropdowns();
            });
        });
    }
    
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            }, 250);
        });
    }
    
    openMobileMenu() {
        const overlay = this.headerElement.querySelector('.mobile-nav-overlay');
        const mobileNav = this.headerElement.querySelector('.mobile-nav-container');
        const toggleBtn = this.headerElement.querySelector('.mobile-menu-toggle');
        
        if (overlay && mobileNav && toggleBtn) {
            overlay.classList.add('active');
            mobileNav.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            this.mobileMenuOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeMobileMenu() {
        const overlay = this.headerElement.querySelector('.mobile-nav-overlay');
        const mobileNav = this.headerElement.querySelector('.mobile-nav-container');
        const toggleBtn = this.headerElement.querySelector('.mobile-menu-toggle');
        
        if (overlay && mobileNav && toggleBtn) {
            overlay.classList.remove('active');
            mobileNav.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            this.mobileMenuOpen = false;
            document.body.style.overflow = '';
        }
    }
    
    openCountryModal() {
        const modal = this.headerElement.querySelector('.country-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeCountryModal() {
        const modal = this.headerElement.querySelector('.country-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    closeAllDropdowns() {
        const dropdowns = this.headerElement.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    
    selectCountry(countryCode) {
        if (!this.countries.find(c => c.code === countryCode)) {
            console.error('Invalid country code:', countryCode);
            return;
        }
        
        // Check if user is logged in (country locked after registration)
        if (this.state.isAuthenticated) {
            this.showNotification('Country cannot be changed after registration. Please contact support if needed.', 'warning');
            return;
        }
        
        this.state.currentCountry = countryCode;
        localStorage.setItem('mpesewa_country', countryCode);
        
        // Update UI
        this.updateCountryDisplay();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('mpesewa:countryChange', {
            detail: { country: countryCode }
        }));
        
        // Show confirmation
        const countryName = this.getCountryName(countryCode);
        this.showNotification(`Country set to ${countryName}. This will be locked after registration.`, 'success');
    }
    
    updateCountryDisplay() {
        // Update flag in header
        const countryFlag = this.headerElement.querySelector('.country-flag');
        if (countryFlag && this.state.currentCountry) {
            countryFlag.textContent = this.getCountryFlag(this.state.currentCountry);
        }
        
        // Update active country items
        const countryItems = this.headerElement.querySelectorAll('.country-item, .mobile-country-item');
        countryItems.forEach(item => {
            if (item.dataset.country === this.state.currentCountry) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update current country display
        const currentCountryDisplay = this.headerElement.querySelector('.current-country');
        if (currentCountryDisplay && this.state.currentCountry) {
            currentCountryDisplay.innerHTML = `
                Current: ${this.getCountryFlag(this.state.currentCountry)} ${this.getCountryName(this.state.currentCountry)}
            `;
        }
    }
    
    updateAuthDisplay() {
        const authSection = this.headerElement.querySelector('.header-auth');
        if (authSection) {
            authSection.innerHTML = this.buildAuthSection();
            this.setupEventListeners(); // Re-bind event listeners
            this.initMobileMenu(); // Re-bind mobile menu events
        }
        
        // Update mobile auth section
        const mobileAuth = this.headerElement.querySelector('.mobile-nav-footer');
        if (mobileAuth) {
            mobileAuth.innerHTML = this.buildMobileAuthSection();
            this.initMobileMenu(); // Re-bind event listeners
        }
    }
    
    updateSubscriptionBadge() {
        const subscriptionBadge = this.headerElement.querySelector('.subscription-tier');
        if (subscriptionBadge && this.state.subscription) {
            subscriptionBadge.textContent = `${this.state.subscription.plan} Tier`;
            
            const limitBadge = this.headerElement.querySelector('.subscription-limit');
            if (limitBadge) {
                limitBadge.textContent = `Limit: ${this.state.subscription.limit} ${this.getCurrentCurrency()}`;
            }
        }
    }
    
    updateActiveNav() {
        const navLinks = this.headerElement.querySelectorAll('.nav-link, .mobile-nav-link, .dropdown-item');
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href && this.currentPath.includes(href.replace('.html', '').replace('/', ''))) {
                link.classList.add('active');
            }
            
            // Home page special case
            if ((this.currentPath === '/' || this.currentPath.includes('index.html')) && 
                (href === '/index.html' || href === '/')) {
                link.classList.add('active');
            }
        });
    }
    
    getCountryFlag(code) {
        const country = this.countries.find(c => c.code === code);
        return country ? country.flag : '🌐';
    }
    
    getCountryName(code) {
        const country = this.countries.find(c => c.code === code);
        return country ? country.name : 'Select Country';
    }
    
    getCurrentCurrency() {
        if (!this.state.currentCountry) return '';
        const country = this.countries.find(c => c.code === this.state.currentCountry);
        return country ? country.currency : '';
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `header-notification header-notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#f37021' : '#0099ff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
        `;
        
        notification.textContent = message;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    logout() {
        // Clear state
        this.state.isAuthenticated = false;
        this.state.userRole = null;
        this.state.userName = null;
        this.state.subscription = null;
        
        // Clear storage
        sessionStorage.removeItem('mpesewa_session');
        
        // Update UI
        this.updateAuthDisplay();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('mpesewa:authenticationChange', {
            detail: { isAuthenticated: false, role: null }
        }));
        
        // Show notification
        this.showNotification('Logged out successfully', 'success');
        
        // Redirect to home after a moment
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1500);
    }
    
    /**
     * Public API Methods
     */
    setUser(userData) {
        this.state.isAuthenticated = true;
        this.state.userRole = userData.role;
        this.state.userName = userData.name;
        this.state.subscription = userData.subscription || null;
        
        // Save to session
        sessionStorage.setItem('mpesewa_session', JSON.stringify({
            isAuthenticated: true,
            role: userData.role,
            userName: userData.name,
            timestamp: Date.now()
        }));
        
        // Update UI
        this.updateAuthDisplay();
        
        return this;
    }
    
    setSubscription(subscriptionData) {
        this.state.subscription = subscriptionData;
        this.updateSubscriptionBadge();
        return this;
    }
    
    setCountry(countryCode) {
        this.selectCountry(countryCode);
        return this;
    }
    
    update() {
        this.loadUserState();
        this.updateAuthDisplay();
        this.updateCountryDisplay();
        this.updateActiveNav();
        return this;
    }
    
    destroy() {
        if (this.headerElement && this.headerElement.parentNode) {
            this.headerElement.parentNode.removeChild(this.headerElement);
        }
        
        // Remove styles
        const styles = document.getElementById('mp-header-styles');
        if (styles) {
            styles.parentNode.removeChild(styles);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.resizeHandler);
        document.removeEventListener('click', this.documentClickHandler);
        
        return this;
    }
}

// Export for global use
window.MPesewaHeader = Header;

// Auto-initialize if data-header attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const headerContainers = document.querySelectorAll('[data-header]');
    headerContainers.forEach(container => {
        const options = {
            container: container,
            showAuth: container.dataset.showAuth !== 'false',
            showCountry: container.dataset.showCountry !== 'false',
            showMobileMenu: container.dataset.showMobileMenu !== 'false',
            showHierarchy: container.dataset.showHierarchy === 'true'
        };
        
        new Header(options);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Header;
}