/**
 * M-PESEWA APPLICATION SHELL
 * Header, footer, navigation, and main layout components
 * Responsive design with strict brand color adherence
 */

// Brand colors (STRICT ADHERENCE REQUIRED)
const BRAND_COLORS = {
    PRIMARY_BLUE: '#003366',
    SECONDARY_BLUE: '#0099ff',
    ACTION_ORANGE: '#f37021',
    TRUST_GREEN: '#28a745',
    NEUTRAL_LIGHT: '#f8f9fa',
    PURE_WHITE: '#ffffff',
    FOOTER_BG: '#1f2a37'
};

// Responsive breakpoints
const BREAKPOINTS = {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1200
};

// Application shell state
let shellInitialized = false;
let currentView = 'home';
let mobileMenuOpen = false;

// Country data for dropdown
const COUNTRIES = [
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KSh', phone: '+254 709 219 000' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', phone: '+256 392 175 546' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', phone: '+255 659 073 010' },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', phone: '+250 791 590 801' },
    { code: 'BI', name: 'Burundi', flag: '🇧🇮', currency: 'BIF', phone: '+257 79 000 000' },
    { code: 'CD', name: 'DRC', flag: '🇨🇩', currency: 'CDF', phone: '+243 81 000 0000' },
    { code: 'SS', name: 'South Sudan', flag: '🇸🇸', currency: 'SSP', phone: '+27 11 200 0000' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', phone: '+27 11 000 0000' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', phone: '+234 800 000 0000' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', phone: '+233 24 000 0000' },
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', currency: 'ETB', phone: '+251 911 000 000' },
    { code: 'SO', name: 'Somalia', flag: '🇸🇴', currency: 'SOS', phone: '+252 63 0000000' }
];

// Emergency categories for dropdown
const EMERGENCY_CATEGORIES = [
    'Everyday Essentials',
    'M-pesewa Fare',
    'M-pesewa Data',
    'M-pesewa Cooking Gas',
    'M-pesewa Food',
    'M-pesewa Wifi',
    'M-pesewa Water Bill',
    'M-pesewa Electricity Tokens',
    'M-pesewa TV Subscription',
    'Logistics & Repairs',
    'M-pesewa Fuel',
    'M-pesewa Repair',
    'M-pesewa Credo',
    'Business & Growth',
    'M-Pesa Daily Sales Advance',
    'M-Pesa Working Capital Advance',
    'M-Pesewa Soko Loan',
    'M-Pesewa Kidandaski Loan',
    'M-Pesewa Hawker Loan',
    'M-fuliziwa Loan',
    'Health & Education',
    'M-pesewa Medicine',
    'M-pesewa School Fees',
    'M-pesewa Advance'
];

/**
 * Load the application shell (header, footer, navigation)
 */
export async function loadAppShell() {
    try {
        console.log('🏗️ LOADING APPLICATION SHELL');
        
        if (shellInitialized) {
            console.log('App shell already initialized');
            return;
        }
        
        // 1. Load CSS
        await loadStyles();
        
        // 2. Create header
        createHeader();
        
        // 3. Create footer
        createFooter();
        
        // 4. Set up navigation
        setupNavigation();
        
        // 5. Set up responsive behavior
        setupResponsiveBehavior();
        
        // 6. Mark as initialized
        shellInitialized = true;
        
        // 7. Add CSS for app shell
        addAppShellStyles();
        
        console.log('✅ APPLICATION SHELL LOADED');
        
    } catch (error) {
        console.error('❌ FAILED TO LOAD APP SHELL:', error);
        throw error;
    }
}

/**
 * Load application styles
 */
async function loadStyles() {
    // Create link element for main CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/main.css';
    link.onerror = () => {
        console.warn('Main CSS failed to load, using inline styles');
        addInlineStyles();
    };
    
    document.head.appendChild(link);
    
    // Load responsive CSS
    const responsiveLink = document.createElement('link');
    responsiveLink.rel = 'stylesheet';
    responsiveLink.href = 'assets/css/responsive.css';
    responsiveLink.onerror = () => {
        console.warn('Responsive CSS failed to load');
    };
    
    document.head.appendChild(responsiveLink);
}

/**
 * Add inline styles as fallback
 */
function addInlineStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Basic reset */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* Brand colors */
        :root {
            --primary-blue: ${BRAND_COLORS.PRIMARY_BLUE};
            --secondary-blue: ${BRAND_COLORS.SECONDARY_BLUE};
            --action-orange: ${BRAND_COLORS.ACTION_ORANGE};
            --trust-green: ${BRAND_COLORS.TRUST_GREEN};
            --neutral-light: ${BRAND_COLORS.NEUTRAL_LIGHT};
            --pure-white: ${BRAND_COLORS.PURE_WHITE};
            --footer-bg: ${BRAND_COLORS.FOOTER_BG};
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Create the application header
 */
function createHeader() {
    console.log('🔼 CREATING HEADER');
    
    // Remove existing header if any
    const existingHeader = document.querySelector('header.mp-header');
    if (existingHeader) existingHeader.remove();
    
    // Create header element
    const header = document.createElement('header');
    header.className = 'mp-header';
    header.setAttribute('role', 'banner');
    
    // Header structure
    header.innerHTML = `
        <div class="header-container">
            <!-- Logo and Brand -->
            <div class="header-brand">
                <a href="index.html" class="logo-link">
                    <div class="logo">
                        <span class="logo-icon">💰</span>
                        <span class="logo-text">
                            <span class="logo-primary">M-PESEWA</span>
                            <span class="logo-subtitle">Emergency Micro-Lending</span>
                        </span>
                    </div>
                </a>
                
                <!-- Country flag badge (if country selected) -->
                <div id="country-badge" class="country-badge" style="display: none;">
                    <span id="country-flag">🇰🇪</span>
                    <span id="country-name">Kenya</span>
                </div>
            </div>
            
            <!-- Desktop Navigation -->
            <nav class="desktop-nav" role="navigation" aria-label="Main Navigation">
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="index.html" class="nav-link active" data-page="home">
                            <span class="nav-icon">🏠</span>
                            <span class="nav-text">Home</span>
                        </a>
                    </li>
                    
                    <!-- Lenders Dropdown -->
                    <li class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle" data-page="lenders">
                            <span class="nav-icon">👨‍💼</span>
                            <span class="nav-text">Lenders</span>
                            <span class="dropdown-arrow">▼</span>
                        </a>
                        <div class="dropdown-menu lenders-dropdown">
                            <a href="pages/lenders/dashboard.html" class="dropdown-item">Dashboard</a>
                            <a href="pages/lenders/portfolio.html" class="dropdown-item">Portfolio</a>
                            <a href="pages/lenders/history.html" class="dropdown-item">History</a>
                            <a href="pages/lenders/rules.html" class="dropdown-item">Rules</a>
                            <a href="pages/lenders/risk.html" class="dropdown-item">Risk</a>
                        </div>
                    </li>
                    
                    <!-- Borrowers Dropdown -->
                    <li class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle" data-page="borrowers">
                            <span class="nav-icon">👤</span>
                            <span class="nav-text">Borrowers</span>
                            <span class="dropdown-arrow">▼</span>
                        </a>
                        <div class="dropdown-menu borrowers-dropdown">
                            <a href="pages/borrowers/dashboard.html" class="dropdown-item">Dashboard</a>
                            <a href="pages/borrowers/apply.html" class="dropdown-item">Apply for Loan</a>
                            <a href="pages/borrowers/history.html" class="dropdown-item">Borrow History</a>
                            <a href="pages/borrowers/repayments.html" class="dropdown-item">Repayments</a>
                            <a href="pages/borrowers/disputes.html" class="dropdown-item">Disputes</a>
                        </div>
                    </li>
                    
                    <!-- Emergency Hub Dropdown -->
                    <li class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle" data-page="emergency">
                            <span class="nav-icon">🚨</span>
                            <span class="nav-text">Emergency Hub</span>
                            <span class="dropdown-arrow">▼</span>
                        </a>
                        <div class="dropdown-menu emergency-dropdown">
                            <div class="dropdown-grid">
                                <div class="dropdown-column">
                                    <h4>Everyday Essentials</h4>
                                    <a href="pages/emergency/fare.html" class="dropdown-item">🚌 M-pesewa Fare</a>
                                    <a href="pages/emergency/data.html" class="dropdown-item">📶 M-pesewa Data</a>
                                    <a href="pages/emergency/gas.html" class="dropdown-item">🔥 M-pesewa Cooking Gas</a>
                                    <a href="pages/emergency/food.html" class="dropdown-item">🍲 M-pesewa Food</a>
                                    <a href="pages/emergency/wifi.html" class="dropdown-item">📡 M-pesewa Wifi</a>
                                </div>
                                <div class="dropdown-column">
                                    <h4>Utilities</h4>
                                    <a href="pages/emergency/water.html" class="dropdown-item">🚰 M-pesewa Water Bill</a>
                                    <a href="pages/emergency/electricity.html" class="dropdown-item">⚡ M-pesewa Electricity</a>
                                    <a href="pages/emergency/tv.html" class="dropdown-item">📺 M-pesewa TV Subscription</a>
                                </div>
                                <div class="dropdown-column">
                                    <h4>Business & Growth</h4>
                                    <a href="pages/emergency/fuel.html" class="dropdown-item">⛽ M-pesewa Fuel</a>
                                    <a href="pages/emergency/repair.html" class="dropdown-item">🔧 M-pesewa Repair</a>
                                    <a href="pages/emergency/credo.html" class="dropdown-item">🛠️ M-pesewa Credo</a>
                                    <a href="pages/emergency/sales.html" class="dropdown-item">🧾 M-Pesa Sales Advance</a>
                                </div>
                            </div>
                        </div>
                    </li>
                    
                    <!-- Subscription Plans Dropdown -->
                    <li class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle" data-page="subscription">
                            <span class="nav-icon">💰</span>
                            <span class="nav-text">Subscription Plans</span>
                            <span class="dropdown-arrow">▼</span>
                        </a>
                        <div class="dropdown-menu subscription-dropdown">
                            <a href="pages/subscription/current.html" class="dropdown-item">Current Plan</a>
                            <a href="pages/subscription/upgrade.html" class="dropdown-item">Upgrade</a>
                            <a href="pages/subscription/history.html" class="dropdown-item">History</a>
                            <a href="pages/subscription/invoices.html" class="dropdown-item">Invoices</a>
                        </div>
                    </li>
                    
                    <!-- Country Dropdown -->
                    <li class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle" data-page="country">
                            <span class="nav-icon">🌍</span>
                            <span class="nav-text">Country</span>
                            <span class="dropdown-arrow">▼</span>
                        </a>
                        <div class="dropdown-menu country-dropdown">
                            <div class="country-list">
                                ${COUNTRIES.map(country => `
                                    <a href="pages/countries/${country.code.toLowerCase()}.html" 
                                       class="dropdown-item country-item" 
                                       data-country="${country.code}">
                                        <span class="country-flag">${country.flag}</span>
                                        <span class="country-name">${country.name}</span>
                                        <span class="country-currency">(${country.currency})</span>
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
            
            <!-- Auth Buttons (Desktop) -->
            <div class="header-auth desktop-auth">
                <a href="auth/login.html" class="auth-btn auth-login">
                    <span class="auth-icon">🔑</span>
                    <span class="auth-text">Sign In</span>
                </a>
                <a href="auth/register.html" class="auth-btn auth-signup">
                    <span class="auth-icon">📝</span>
                    <span class="auth-text">Sign Up</span>
                </a>
            </div>
            
            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                <span class="toggle-bar"></span>
                <span class="toggle-bar"></span>
                <span class="toggle-bar"></span>
            </button>
        </div>
        
        <!-- Mobile Navigation -->
        <div class="mobile-nav-overlay"></div>
        <nav class="mobile-nav" role="navigation" aria-label="Mobile Navigation">
            <div class="mobile-nav-header">
                <div class="mobile-logo">
                    <span class="logo-icon">💰</span>
                    <span class="logo-text">M-PESEWA</span>
                </div>
                <button class="mobile-close" aria-label="Close mobile menu">×</button>
            </div>
            
            <div class="mobile-nav-content">
                <!-- User info if logged in -->
                <div id="mobile-user-info" class="mobile-user-info" style="display: none;"></div>
                
                <!-- Mobile menu items -->
                <a href="index.html" class="mobile-nav-item" data-page="home">
                    <span class="mobile-nav-icon">🏠</span>
                    <span class="mobile-nav-text">Home</span>
                </a>
                
                <div class="mobile-nav-section">
                    <div class="mobile-nav-header">Lenders</div>
                    <a href="pages/lenders/dashboard.html" class="mobile-nav-subitem">Dashboard</a>
                    <a href="pages/lenders/portfolio.html" class="mobile-nav-subitem">Portfolio</a>
                    <a href="pages/lenders/history.html" class="mobile-nav-subitem">History</a>
                    <a href="pages/lenders/rules.html" class="mobile-nav-subitem">Rules</a>
                    <a href="pages/lenders/risk.html" class="mobile-nav-subitem">Risk</a>
                </div>
                
                <div class="mobile-nav-section">
                    <div class="mobile-nav-header">Borrowers</div>
                    <a href="pages/borrowers/dashboard.html" class="mobile-nav-subitem">Dashboard</a>
                    <a href="pages/borrowers/apply.html" class="mobile-nav-subitem">Apply for Loan</a>
                    <a href="pages/borrowers/history.html" class="mobile-nav-subitem">Borrow History</a>
                    <a href="pages/borrowers/repayments.html" class="mobile-nav-subitem">Repayments</a>
                    <a href="pages/borrowers/disputes.html" class="mobile-nav-subitem">Disputes</a>
                </div>
                
                <div class="mobile-nav-section">
                    <div class="mobile-nav-header">Emergency Hub</div>
                    <div class="mobile-categories">
                        ${EMERGENCY_CATEGORIES.slice(0, 8).map(cat => `
                            <a href="pages/emergency/${cat.toLowerCase().replace(/ /g, '-')}.html" 
                               class="mobile-nav-subitem">
                                ${cat}
                            </a>
                        `).join('')}
                    </div>
                    <a href="pages/emergency/all.html" class="mobile-nav-subitem view-all">View All Categories →</a>
                </div>
                
                <div class="mobile-nav-section">
                    <div class="mobile-nav-header">Subscription Plans</div>
                    <a href="pages/subscription/current.html" class="mobile-nav-subitem">Current Plan</a>
                    <a href="pages/subscription/upgrade.html" class="mobile-nav-subitem">Upgrade</a>
                    <a href="pages/subscription/history.html" class="mobile-nav-subitem">History</a>
                    <a href="pages/subscription/invoices.html" class="mobile-nav-subitem">Invoices</a>
                </div>
                
                <div class="mobile-nav-section">
                    <div class="mobile-nav-header">Countries</div>
                    <div class="mobile-countries">
                        ${COUNTRIES.slice(0, 6).map(country => `
                            <a href="pages/countries/${country.code.toLowerCase()}.html" 
                               class="mobile-nav-subitem country-item">
                                <span class="country-flag">${country.flag}</span>
                                ${country.name}
                            </a>
                        `).join('')}
                    </div>
                    <a href="pages/countries.html" class="mobile-nav-subitem view-all">View All Countries →</a>
                </div>
                
                <!-- Mobile Auth -->
                <div class="mobile-auth-section">
                    <a href="auth/login.html" class="mobile-auth-btn auth-login">
                        <span class="auth-icon">🔑</span>
                        Sign In
                    </a>
                    <a href="auth/register.html" class="mobile-auth-btn auth-signup">
                        <span class="auth-icon">📝</span>
                        Sign Up
                    </a>
                </div>
            </div>
        </nav>
    `;
    
    // Insert header at the beginning of body
    document.body.insertBefore(header, document.body.firstChild);
    
    // Initialize header functionality
    initializeHeaderFunctionality();
    
    console.log('✅ HEADER CREATED');
}

/**
 * Create the application footer
 */
function createFooter() {
    console.log('🔽 CREATING FOOTER');
    
    // Remove existing footer if any
    const existingFooter = document.querySelector('footer.mp-footer');
    if (existingFooter) existingFooter.remove();
    
    // Create footer element
    const footer = document.createElement('footer');
    footer.className = 'mp-footer';
    footer.setAttribute('role', 'contentinfo');
    
    // Footer structure with 6 columns as specified
    footer.innerHTML = `
        <div class="footer-container">
            <!-- Footer grid with 6 columns -->
            <div class="footer-grid">
                <!-- Column 1: Borrowing -->
                <div class="footer-col">
                    <h4 class="footer-title">Borrowing</h4>
                    <ul class="footer-links">
                        <li><a href="pages/borrowers/apply.html">Get Emergency Loan</a></li>
                        <li><a href="pages/borrowers/personal-loan.html">Online Personal Loan</a></li>
                        <li><a href="pages/borrowers/business-loan.html">Business Loan</a></li>
                        <li><a href="pages/how-it-works.html#apply">How to Apply</a></li>
                        <li><a href="pages/borrowers/active.html">Active Borrowers</a></li>
                    </ul>
                </div>
                
                <!-- Column 2: Lending -->
                <div class="footer-col">
                    <h4 class="footer-title">Lending</h4>
                    <ul class="footer-links">
                        <li><a href="pages/lenders/smart-lending.html">Smart Lending</a></li>
                        <li><a href="pages/lenders/why-lend.html">Why Lend at M-Pesewa?</a></li>
                        <li><a href="pages/lenders/how-to-lend.html">How to Lend</a></li>
                        <li><a href="pages/lenders/active.html">Active Lenders</a></li>
                    </ul>
                </div>
                
                <!-- Column 3: Platform -->
                <div class="footer-col">
                    <h4 class="footer-title">How It Works</h4>
                    <ul class="footer-links">
                        <li><a href="pages/how-it-works.html">P2P Lending Explained</a></li>
                        <li><a href="pages/how-it-works.html#our-role">Our Role</a></li>
                        <li><a href="pages/subscription/plans.html">Subscriptions</a></li>
                        <li><a href="pages/blacklist/public.html">Blacklist</a></li>
                        <li><a href="pages/collectors.html">Debt Collectors</a></li>
                    </ul>
                </div>
                
                <!-- Column 4: Company -->
                <div class="footer-col">
                    <h4 class="footer-title">About Us</h4>
                    <ul class="footer-links">
                        <li><a href="pages/about.html">About M-Pesewa</a></li>
                        <li><a href="pages/team.html">Team & Advisory Board</a></li>
                        <li><a href="pages/news.html">News & Careers</a></li>
                        <li><a href="pages/blog.html">Blog / FAQs</a></li>
                        <li><a href="pages/contact.html">Contact Us</a></li>
                    </ul>
                </div>
                
                <!-- Column 5: Legal -->
                <div class="footer-col">
                    <h4 class="footer-title">Legal & Compliance</h4>
                    <ul class="footer-links">
                        <li><a href="pages/terms.html">Terms & Conditions</a></li>
                        <li><a href="pages/privacy.html">Privacy Policy</a></li>
                        <li><a href="pages/grievance.html">Grievance Redressal</a></li>
                        <li><a href="pages/fair-practices.html">Fair Practices Code</a></li>
                    </ul>
                </div>
                
                <!-- Column 6: Partners -->
                <div class="footer-col">
                    <h4 class="footer-title">Partnerships</h4>
                    <ul class="footer-links">
                        <li><a href="pages/partners.html">Be a Partner</a></li>
                    </ul>
                    <div class="social-links">
                        <a href="#" class="social-link" aria-label="Facebook">
                            <span class="social-icon">📘</span>
                        </a>
                        <a href="#" class="social-link" aria-label="Twitter">
                            <span class="social-icon">🐦</span>
                        </a>
                        <a href="#" class="social-link" aria-label="YouTube">
                            <span class="social-icon">📺</span>
                        </a>
                        <a href="#" class="social-link" aria-label="Instagram">
                            <span class="social-icon">📸</span>
                        </a>
                        <a href="#" class="social-link" aria-label="LinkedIn">
                            <span class="social-icon">💼</span>
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Countries Ticker -->
            <div class="countries-ticker">
                <div class="ticker-track">
                    ${COUNTRIES.map(c => `${c.flag} ${c.name}`).join(' • ')} •
                    ${COUNTRIES.map(c => `${c.flag} ${c.name}`).join(' • ')}
                </div>
            </div>
            
            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="footer-info">
                    <div class="footer-copyright">
                        © 2016–2026, M-Pesewa.com (Technology Pvt. Ltd.) — All Rights Reserved
                    </div>
                    <div class="footer-extra">
                        <a href="pages/sitemap.html">Sitemap</a>
                        <span class="divider">|</span>
                        <a href="pages/accessibility.html">Accessibility</a>
                        <span class="divider">|</span>
                        <a href="pages/security.html">Security</a>
                    </div>
                </div>
                
                <!-- Country-specific contact info (will be populated dynamically) -->
                <div id="country-contact" class="country-contact" style="display: none;">
                    <span id="contact-phone"></span>
                    <span class="divider">|</span>
                    <span id="contact-email">info@mpesewa.com</span>
                </div>
            </div>
        </div>
    `;
    
    // Insert footer at the end of body
    document.body.appendChild(footer);
    
    // Initialize footer functionality
    initializeFooterFunctionality();
    
    console.log('✅ FOOTER CREATED');
}

/**
 * Initialize header functionality
 */
function initializeHeaderFunctionality() {
    console.log('⚙️ INITIALIZING HEADER FUNCTIONALITY');
    
    // Dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        toggle?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu.show').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            menu.classList.toggle('show');
            
            // Update aria-expanded
            const expanded = menu.classList.contains('show');
            toggle.setAttribute('aria-expanded', expanded);
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
            const toggle = menu.previousElementSibling;
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Mobile menu functionality
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    
    mobileToggle?.addEventListener('click', () => {
        mobileMenuOpen = !mobileMenuOpen;
        toggleMobileMenu(mobileMenuOpen);
    });
    
    mobileClose?.addEventListener('click', () => {
        mobileMenuOpen = false;
        toggleMobileMenu(false);
    });
    
    mobileOverlay?.addEventListener('click', () => {
        mobileMenuOpen = false;
        toggleMobileMenu(false);
    });
    
    // Close mobile menu on link click
    mobileNav?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOpen = false;
            toggleMobileMenu(false);
        });
    });
    
    // Update active nav link based on current page
    updateActiveNavLink();
    
    // Update country badge if country is selected
    updateCountryBadge();
    
    // Update auth buttons based on login state
    updateAuthButtons();
    
    console.log('✅ HEADER FUNCTIONALITY INITIALIZED');
}

/**
 * Initialize footer functionality
 */
function initializeFooterFunctionality() {
    console.log('⚙️ INITIALIZING FOOTER FUNCTIONALITY');
    
    // Update country contact info
    updateCountryContact();
    
    // Initialize countries ticker animation
    initializeCountriesTicker();
    
    console.log('✅ FOOTER FUNCTIONALITY INITIALIZED');
}

/**
 * Set up navigation
 */
function setupNavigation() {
    console.log('🧭 SETTING UP NAVIGATION');
    
    // Handle internal navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Skip external links, anchors, and special links
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }
        
        // Check if this is an internal navigation
        if (href && !href.startsWith('http')) {
            e.preventDefault();
            
            // Add loading state
            setLoadingState(true);
            
            // Navigate to page
            navigateToPage(href);
        }
    });
    
    // Handle browser navigation
    window.addEventListener('popstate', handlePopState);
    
    console.log('✅ NAVIGATION SET UP');
}

/**
 * Navigate to a page
 * @param {string} url - Page URL
 */
function navigateToPage(url) {
    console.log(`🧭 NAVIGATING TO: ${url}`);
    
    // Update current view
    const pageName = getPageNameFromUrl(url);
    currentView = pageName;
    
    // Update browser history
    window.history.pushState({ page: pageName }, '', url);
    
    // Update active nav link
    updateActiveNavLink();
    
    // Load page content
    loadPageContent(url);
}

/**
 * Load page content
 * @param {string} url - Page URL
 */
async function loadPageContent(url) {
    try {
        // Show loading indicator
        showLoadingIndicator();
        
        // Fetch page content
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to load page: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract main content
        const newContent = doc.querySelector('main') || doc.body;
        
        // Update page content
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = newContent.innerHTML;
        } else {
            // Create main element if it doesn't exist
            const mainEl = document.createElement('main');
            mainEl.innerHTML = newContent.innerHTML;
            document.body.appendChild(mainEl);
        }
        
        // Update page title
        const newTitle = doc.querySelector('title');
        if (newTitle) {
            document.title = newTitle.textContent;
        }
        
        // Hide loading indicator
        hideLoadingIndicator();
        
        // Dispatch navigation complete event
        window.dispatchEvent(new CustomEvent('mpesewa:navigation:complete', {
            detail: { url, pageName: currentView }
        }));
        
        console.log(`✅ PAGE LOADED: ${url}`);
        
    } catch (error) {
        console.error('❌ PAGE LOAD ERROR:', error);
        showPageLoadError(url, error);
    } finally {
        setLoadingState(false);
    }
}

/**
 * Set up responsive behavior
 */
function setupResponsiveBehavior() {
    console.log('📱 SETTING UP RESPONSIVE BEHAVIOR');
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Initial responsive check
    handleResize();
    
    console.log('✅ RESPONSIVE BEHAVIOR SET UP');
}

/**
 * Handle window resize
 */
function handleResize() {
    const width = window.innerWidth;
    
    // Update mobile menu state
    if (width >= BREAKPOINTS.TABLET && mobileMenuOpen) {
        mobileMenuOpen = false;
        toggleMobileMenu(false);
    }
    
    // Update responsive classes
    document.body.classList.toggle('is-mobile', width < BREAKPOINTS.TABLET);
    document.body.classList.toggle('is-tablet', width >= BREAKPOINTS.TABLET && width < BREAKPOINTS.DESKTOP);
    document.body.classList.toggle('is-desktop', width >= BREAKPOINTS.DESKTOP);
    
    // Update dropdown behavior for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (width < BREAKPOINTS.TABLET) {
            // Convert to accordion on mobile
            dropdown.classList.add('mobile-accordion');
        } else {
            dropdown.classList.remove('mobile-accordion');
        }
    });
}

/**
 * Toggle mobile menu
 * @param {boolean} show - Whether to show the menu
 */
function toggleMobileMenu(show) {
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const body = document.body;
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (show) {
        mobileNav.classList.add('show');
        mobileOverlay.classList.add('show');
        body.style.overflow = 'hidden';
        toggle?.setAttribute('aria-expanded', 'true');
        
        // Update user info in mobile menu
        updateMobileUserInfo();
    } else {
        mobileNav.classList.remove('show');
        mobileOverlay.classList.remove('show');
        body.style.overflow = '';
        toggle?.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Update active navigation link
 */
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        const isActive = currentPath.includes(linkPage) || 
                        (linkPage === 'home' && currentPath.endsWith('/') || currentPath.endsWith('index.html'));
        
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-current', isActive ? 'page' : null);
    });
    
    // Also update mobile nav
    const mobileLinks = document.querySelectorAll('.mobile-nav-item');
    mobileLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        const isActive = currentPath.includes(linkPage) || 
                        (linkPage === 'home' && currentPath.endsWith('/') || currentPath.endsWith('index.html'));
        
        link.classList.toggle('active', isActive);
    });
}

/**
 * Update country badge in header
 */
function updateCountryBadge() {
    const countryBadge = document.getElementById('country-badge');
    const countryFlag = document.getElementById('country-flag');
    const countryName = document.getElementById('country-name');
    
    const selectedCountry = localStorage.getItem('mpesewa_country');
    const country = COUNTRIES.find(c => c.code === selectedCountry);
    
    if (country && countryBadge && countryFlag && countryName) {
        countryFlag.textContent = country.flag;
        countryName.textContent = country.name;
        countryBadge.style.display = 'flex';
        
        // Add tooltip
        countryBadge.title = `${country.name} (${country.currency})`;
    } else {
        if (countryBadge) countryBadge.style.display = 'none';
    }
}

/**
 * Update auth buttons based on login state
 */
function updateAuthButtons() {
    const user = window.MPESEWA_STATE?.user;
    const authSection = document.querySelector('.header-auth');
    
    if (authSection && user) {
        // User is logged in
        authSection.innerHTML = `
            <div class="user-dropdown">
                <button class="user-menu-toggle" aria-expanded="false">
                    <span class="user-avatar">👤</span>
                    <span class="user-name">${user.username || user.email}</span>
                    <span class="dropdown-arrow">▼</span>
                </button>
                <div class="user-dropdown-menu">
                    <a href="pages/user/profile.html" class="dropdown-item">Profile</a>
                    <a href="pages/user/dashboard.html" class="dropdown-item">Dashboard</a>
                    <a href="pages/user/settings.html" class="dropdown-item">Settings</a>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item logout-btn">Logout</button>
                </div>
            </div>
        `;
        
        // Initialize user dropdown
        const userToggle = document.querySelector('.user-menu-toggle');
        const userMenu = document.querySelector('.user-dropdown-menu');
        
        userToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = userToggle.getAttribute('aria-expanded') === 'true';
            userToggle.setAttribute('aria-expanded', !expanded);
            userMenu.classList.toggle('show');
        });
        
        // Logout functionality
        const logoutBtn = document.querySelector('.logout-btn');
        logoutBtn?.addEventListener('click', () => {
            // Clear session
            localStorage.removeItem('mpesewa_session');
            window.MPESEWA_STATE.user = null;
            
            // Reload page
            window.location.reload();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (userMenu) {
                userMenu.classList.remove('show');
                userToggle?.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Update mobile user info
 */
function updateMobileUserInfo() {
    const mobileUserInfo = document.getElementById('mobile-user-info');
    const user = window.MPESEWA_STATE?.user;
    
    if (mobileUserInfo && user) {
        mobileUserInfo.style.display = 'block';
        mobileUserInfo.innerHTML = `
            <div class="mobile-user-details">
                <div class="mobile-user-avatar">👤</div>
                <div class="mobile-user-text">
                    <div class="mobile-user-name">${user.username || user.email}</div>
                    <div class="mobile-user-role">${user.role}</div>
                </div>
            </div>
            <a href="pages/user/profile.html" class="mobile-user-profile">View Profile</a>
        `;
    }
}

/**
 * Update country contact info in footer
 */
function updateCountryContact() {
    const countryContact = document.getElementById('country-contact');
    const contactPhone = document.getElementById('contact-phone');
    
    const selectedCountry = localStorage.getItem('mpesewa_country');
    const country = COUNTRIES.find(c => c.code === selectedCountry);
    
    if (countryContact && contactPhone && country) {
        contactPhone.textContent = country.phone;
        countryContact.style.display = 'block';
    }
}

/**
 * Initialize countries ticker animation
 */
function initializeCountriesTicker() {
    const tickerTrack = document.querySelector('.ticker-track');
    if (!tickerTrack) return;
    
    // Clone content for seamless loop
    const content = tickerTrack.innerHTML;
    tickerTrack.innerHTML = content + content;
    
    // Start animation
    tickerTrack.style.animation = 'scroll-left 30s linear infinite';
}

/**
 * Add app shell styles
 */
function addAppShellStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* App Shell Styles */
        .mp-header {
            background-color: ${BRAND_COLORS.PRIMARY_BLUE};
            color: ${BRAND_COLORS.PURE_WHITE};
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .mp-footer {
            background-color: ${BRAND_COLORS.FOOTER_BG};
            color: ${BRAND_COLORS.PURE_WHITE};
            padding: 40px 0 20px;
        }
        
        /* Loading indicator */
        .loading-indicator {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, ${BRAND_COLORS.ACTION_ORANGE}, ${BRAND_COLORS.TRUST_GREEN});
            transform: translateX(-100%);
            z-index: 9999;
        }
        
        .loading-indicator.active {
            animation: loading 2s ease-in-out infinite;
        }
        
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes scroll-left {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
    `;
    
    document.head.appendChild(style);
}

// ... (Additional helper functions for navigation, loading states, etc.)

// Export public API
export {
    loadAppShell,
    navigateToPage,
    updateActiveNavLink,
    updateCountryBadge,
    updateAuthButtons,
    toggleMobileMenu,
    BRAND_COLORS,
    BREAKPOINTS
};

console.log('🔄 APP-SHELL LOADED');