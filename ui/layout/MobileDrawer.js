// layout/MobileDrawer.js
// M-Pesewa Mobile Drawer Component - Enhanced Mobile Navigation

class MPMobileDrawer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
        this.currentCountry = localStorage.getItem('mpesewa_country') || null;
        this.userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.updateUserData();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* MOBILE DRAWER STYLES */
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                
                /* Drawer Container */
                .mobile-drawer {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 100%;
                    height: 100vh;
                    z-index: 9999;
                    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .mobile-drawer.open {
                    right: 0;
                }
                
                /* Overlay */
                .drawer-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }
                
                .drawer-overlay.visible {
                    opacity: 1;
                    visibility: visible;
                }
                
                /* Drawer Content */
                .drawer-content {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 85%;
                    max-width: 320px;
                    height: 100%;
                    background: #ffffff;
                    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                /* Header */
                .drawer-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #003366;
                }
                
                .drawer-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                }
                
                .drawer-logo-icon {
                    font-size: 24px;
                    font-weight: bold;
                    color: white;
                }
                
                .drawer-logo-text {
                    color: white;
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }
                
                .drawer-close-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                
                .drawer-close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .close-icon {
                    color: white;
                    font-size: 20px;
                }
                
                /* User Info */
                .user-section {
                    padding: 20px;
                    background: linear-gradient(135deg, #003366, #0099ff);
                    color: white;
                }
                
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .user-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: 600;
                    backdrop-filter: blur(10px);
                }
                
                .user-details {
                    flex: 1;
                }
                
                .user-name {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                
                .user-role {
                    font-size: 12px;
                    opacity: 0.9;
                    text-transform: capitalize;
                }
                
                /* Navigation */
                .drawer-nav {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px 0;
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                }
                
                .drawer-nav::-webkit-scrollbar {
                    width: 4px;
                }
                
                .drawer-nav::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                .drawer-nav::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 2px;
                }
                
                .nav-section {
                    margin-bottom: 25px;
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
                }
                
                .nav-items {
                    display: flex;
                    flex-direction: column;
                }
                
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px 20px;
                    text-decoration: none;
                    color: #374151;
                    font-size: 15px;
                    font-weight: 500;
                    transition: background 0.2s ease;
                    border-left: 4px solid transparent;
                }
                
                .nav-item:hover {
                    background: #f8f9fa;
                }
                
                .nav-item.active {
                    background: #eff6ff;
                    color: #003366;
                    border-left-color: #003366;
                }
                
                .nav-icon {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    color: #6b7280;
                }
                
                .nav-item.active .nav-icon {
                    color: #003366;
                }
                
                .nav-badge {
                    margin-left: auto;
                    background: #0099ff;
                    color: white;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 8px;
                    border-radius: 12px;
                    min-width: 24px;
                    text-align: center;
                }
                
                /* Country Selector */
                .country-selector {
                    padding: 15px 20px;
                    border-top: 1px solid #e5e7eb;
                    background: #f8f9fa;
                }
                
                .country-current {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    border: 1px solid #e5e7eb;
                }
                
                .country-current:hover {
                    background: #f0f9ff;
                    border-color: #0099ff;
                }
                
                .country-flag {
                    font-size: 24px;
                }
                
                .country-info {
                    flex: 1;
                }
                
                .country-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 2px;
                }
                
                .country-status {
                    font-size: 11px;
                    color: #6b7280;
                }
                
                .country-locked {
                    color: #f37021;
                    font-weight: 500;
                }
                
                /* Footer */
                .drawer-footer {
                    padding: 20px;
                    border-top: 1px solid #e5e7eb;
                    background: #f8f9fa;
                }
                
                .drawer-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .drawer-btn {
                    padding: 14px;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s ease;
                }
                
                .drawer-btn.primary {
                    background: #003366;
                    color: white;
                }
                
                .drawer-btn.primary:hover {
                    background: #002244;
                }
                
                .drawer-btn.secondary {
                    background: white;
                    color: #003366;
                    border: 1px solid #003366;
                }
                
                .drawer-btn.secondary:hover {
                    background: #f0f9ff;
                }
                
                /* Emergency Button */
                .emergency-btn {
                    position: fixed;
                    bottom: 100px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    border-radius: 30px;
                    background: linear-gradient(135deg, #f37021, #ff8c42);
                    color: white;
                    border: none;
                    box-shadow: 0 4px 15px rgba(243, 112, 33, 0.3);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    z-index: 9998;
                    transition: all 0.3s ease;
                    animation: pulse 2s infinite;
                }
                
                .emergency-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(243, 112, 33, 0.4);
                }
                
                @keyframes pulse {
                    0% { box-shadow: 0 4px 15px rgba(243, 112, 33, 0.3); }
                    50% { box-shadow: 0 4px 20px rgba(243, 112, 33, 0.6); }
                    100% { box-shadow: 0 4px 15px rgba(243, 112, 33, 0.3); }
                }
                
                /* Hierachy Badge */
                .hierarchy-badge {
                    margin: 20px;
                    padding: 12px;
                    background: #f0f9ff;
                    border-radius: 8px;
                    border-left: 4px solid #0099ff;
                    font-size: 12px;
                    color: #003366;
                    font-weight: 500;
                    text-align: center;
                }
                
                /* Dark Mode */
                @media (prefers-color-scheme: dark) {
                    .drawer-content {
                        background: #1f2937;
                    }
                    
                    .drawer-header {
                        background: #003366;
                        border-bottom-color: #374151;
                    }
                    
                    .user-section {
                        background: linear-gradient(135deg, #003366, #0099ff);
                    }
                    
                    .nav-item {
                        color: #d1d5db;
                    }
                    
                    .nav-item:hover {
                        background: #374151;
                    }
                    
                    .nav-item.active {
                        background: #1e40af;
                        color: white;
                    }
                    
                    .nav-icon {
                        color: #9ca3af;
                    }
                    
                    .section-title {
                        color: #9ca3af;
                        border-bottom-color: #374151;
                    }
                    
                    .country-selector {
                        background: #111827;
                        border-top-color: #374151;
                    }
                    
                    .country-current {
                        background: #374151;
                        border-color: #4b5563;
                    }
                    
                    .country-current:hover {
                        background: #4b5563;
                        border-color: #0099ff;
                    }
                    
                    .country-name {
                        color: #e5e7eb;
                    }
                    
                    .drawer-footer {
                        background: #111827;
                        border-top-color: #374151;
                    }
                    
                    .drawer-btn.secondary {
                        background: #374151;
                        color: #e5e7eb;
                        border-color: #4b5563;
                    }
                    
                    .drawer-btn.secondary:hover {
                        background: #4b5563;
                    }
                    
                    .hierarchy-badge {
                        background: #374151;
                        color: #e5e7eb;
                    }
                }
                
                /* Animations */
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                
                /* Responsive */
                @media (max-width: 480px) {
                    .drawer-content {
                        width: 100%;
                        max-width: none;
                    }
                    
                    .emergency-btn {
                        bottom: 80px;
                        right: 15px;
                        width: 50px;
                        height: 50px;
                        font-size: 20px;
                    }
                }
            </style>
            
            <!-- Emergency Button (Outside drawer) -->
            <button class="emergency-btn" id="emergencyBtn" aria-label="Emergency Help">
                🚨
            </button>
            
            <!-- Drawer Container -->
            <div class="mobile-drawer" id="mobileDrawer">
                <!-- Overlay -->
                <div class="drawer-overlay" id="drawerOverlay"></div>
                
                <!-- Drawer Content -->
                <div class="drawer-content">
                    <!-- Header -->
                    <div class="drawer-header">
                        <a href="index.html" class="drawer-logo">
                            <div class="drawer-logo-icon">M</div>
                            <div class="drawer-logo-text">M-PESEWA</div>
                        </a>
                        <button class="drawer-close-btn" id="drawerClose" aria-label="Close menu">
                            <span class="close-icon">×</span>
                        </button>
                    </div>
                    
                    <!-- User Section -->
                    <div class="user-section" id="userSection">
                        <!-- Filled dynamically -->
                    </div>
                    
                    <!-- Navigation -->
                    <div class="drawer-nav" id="drawerNav">
                        <!-- Main Navigation -->
                        <div class="nav-section">
                            <div class="section-title">Main</div>
                            <div class="nav-items" id="mainNav">
                                <!-- Filled dynamically -->
                            </div>
                        </div>
                        
                        <!-- Role-specific Navigation -->
                        <div class="nav-section" id="roleNav">
                            <!-- Filled dynamically -->
                        </div>
                        
                        <!-- Platform Navigation -->
                        <div class="nav-section">
                            <div class="section-title">Platform</div>
                            <div class="nav-items">
                                <a href="how-it-works.html" class="nav-item">
                                    <div class="nav-icon">📚</div>
                                    <div>How It Works</div>
                                </a>
                                <a href="emergency/index.html" class="nav-item">
                                    <div class="nav-icon">🚨</div>
                                    <div>Emergency Hub</div>
                                    <div class="nav-badge">20</div>
                                </a>
                                <a href="subscription/plans.html" class="nav-item">
                                    <div class="nav-icon">⭐</div>
                                    <div>Subscription Plans</div>
                                </a>
                                <a href="faq.html" class="nav-item">
                                    <div class="nav-icon">❓</div>
                                    <div>FAQ</div>
                                </a>
                            </div>
                        </div>
                        
                        <!-- Hierarchy Badge -->
                        <div class="hierarchy-badge" id="hierarchyBadge">
                            Global → Country → Groups → Lenders → Borrowers
                        </div>
                    </div>
                    
                    <!-- Country Selector -->
                    <div class="country-selector">
                        <div class="country-current" id="mobileCountry">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="drawer-footer">
                        <div class="drawer-actions" id="drawerActions">
                            <!-- Filled dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.renderDynamicContent();
    }
    
    renderDynamicContent() {
        this.renderUserSection();
        this.renderNavigation();
        this.renderCountrySelector();
        this.renderDrawerActions();
        this.updateHierarchyBadge();
    }
    
    renderUserSection() {
        const userSection = this.shadowRoot.getElementById('userSection');
        if (!userSection) return;
        
        const userName = localStorage.getItem('mpesewa_user_name') || 'Guest';
        const userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
        const userInitial = userName.charAt(0).toUpperCase();
        
        userSection.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">${userInitial}</div>
                <div class="user-details">
                    <div class="user-name">${userName}</div>
                    <div class="user-role">${userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
                </div>
            </div>
        `;
    }
    
    renderNavigation() {
        const mainNav = this.shadowRoot.getElementById('mainNav');
        const roleNav = this.shadowRoot.getElementById('roleNav');
        
        if (!mainNav || !roleNav) return;
        
        // Main navigation
        mainNav.innerHTML = `
            <a href="dashboard.html" class="nav-item active">
                <div class="nav-icon">📊</div>
                <div>Dashboard</div>
            </a>
            <a href="notifications.html" class="nav-item">
                <div class="nav-icon">🔔</div>
                <div>Notifications</div>
                <div class="nav-badge">3</div>
            </a>
            <a href="messages.html" class="nav-item">
                <div class="nav-icon">💬</div>
                <div>Messages</div>
                <div class="nav-badge">5</div>
            </a>
            <a href="settings.html" class="nav-item">
                <div class="nav-icon">⚙️</div>
                <div>Settings</div>
            </a>
        `;
        
        // Role-specific navigation
        if (this.userRole === 'lender') {
            roleNav.innerHTML = `
                <div class="section-title">Lending</div>
                <div class="nav-items">
                    <a href="lender/portfolio.html" class="nav-item">
                        <div class="nav-icon">💰</div>
                        <div>Portfolio</div>
                    </a>
                    <a href="lender/ledgers.html" class="nav-item">
                        <div class="nav-icon">📒</div>
                        <div>My Ledgers</div>
                        <div class="nav-badge">5</div>
                    </a>
                    <a href="lender/requests.html" class="nav-item">
                        <div class="nav-icon">🤲</div>
                        <div>Loan Requests</div>
                        <div class="nav-badge">2</div>
                    </a>
                    <a href="lender/subscription.html" class="nav-item">
                        <div class="nav-icon">⭐</div>
                        <div>Subscription</div>
                    </a>
                </div>
            `;
        } else if (this.userRole === 'borrower') {
            roleNav.innerHTML = `
                <div class="section-title">Borrowing</div>
                <div class="nav-items">
                    <a href="borrower/apply.html" class="nav-item">
                        <div class="nav-icon">📝</div>
                        <div>Apply for Loan</div>
                    </a>
                    <a href="borrower/loans.html" class="nav-item">
                        <div class="nav-icon">📋</div>
                        <div>My Loans</div>
                        <div class="nav-badge">1</div>
                    </a>
                    <a href="borrower/repayments.html" class="nav-item">
                        <div class="nav-icon">💳</div>
                        <div>Repayments</div>
                    </a>
                    <a href="borrower/history.html" class="nav-item">
                        <div class="nav-icon">📜</div>
                        <div>History</div>
                    </a>
                </div>
            `;
        } else {
            roleNav.innerHTML = `
                <div class="section-title">Get Started</div>
                <div class="nav-items">
                    <a href="auth/register.html?role=borrower" class="nav-item">
                        <div class="nav-icon">👤</div>
                        <div>Become Borrower</div>
                    </a>
                    <a href="auth/register.html?role=lender" class="nav-item">
                        <div class="nav-icon">💰</div>
                        <div>Become Lender</div>
                    </a>
                    <a href="how-it-works.html" class="nav-item">
                        <div class="nav-icon">📚</div>
                        <div>Learn How It Works</div>
                    </a>
                </div>
            `;
        }
    }
    
    renderCountrySelector() {
        const mobileCountry = this.shadowRoot.getElementById('mobileCountry');
        if (!mobileCountry) return;
        
        const currentCountry = localStorage.getItem('mpesewa_country');
        const countryName = currentCountry ? this.getCountryName(currentCountry) : 'Select Country';
        const countryFlag = currentCountry ? this.getCountryFlag(currentCountry) : '🏳️';
        
        mobileCountry.innerHTML = `
            <div class="country-flag">${countryFlag}</div>
            <div class="country-info">
                <div class="country-name">${countryName}</div>
                <div class="country-status">
                    ${currentCountry ? 
                        '<span class="country-locked">🔒 Country Locked</span>' : 
                        'Tap to select your country'
                    }
                </div>
            </div>
            <div style="color: #6b7280;">›</div>
        `;
    }
    
    renderDrawerActions() {
        const drawerActions = this.shadowRoot.getElementById('drawerActions');
        if (!drawerActions) return;
        
        const isAuthenticated = !!localStorage.getItem('mpesewa_auth_token');
        
        if (isAuthenticated) {
            drawerActions.innerHTML = `
                <button class="drawer-btn secondary" id="logoutBtn">
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
                <button class="drawer-btn primary" id="helpBtn">
                    <span>🆘</span>
                    <span>Emergency Help</span>
                </button>
            `;
        } else {
            drawerActions.innerHTML = `
                <button class="drawer-btn secondary" id="loginBtn">
                    <span>🔑</span>
                    <span>Sign In</span>
                </button>
                <button class="drawer-btn primary" id="registerBtn">
                    <span>🚀</span>
                    <span>Get Started</span>
                </button>
            `;
        }
    }
    
    updateHierarchyBadge() {
        const badge = this.shadowRoot.getElementById('hierarchyBadge');
        if (!badge) return;
        
        const currentCountry = localStorage.getItem('mpesewa_country');
        const userRole = localStorage.getItem('mpesewa_user_role');
        
        let hierarchyText = '';
        
        switch (userRole) {
            case 'lender':
                hierarchyText = `Global → ${currentCountry || 'Country'} → Groups → Lenders → Ledgers`;
                break;
            case 'borrower':
                hierarchyText = `Global → ${currentCountry || 'Country'} → Groups → Lenders → You (Borrower)`;
                break;
            default:
                hierarchyText = 'Global → Country → Groups → Lenders → Borrowers';
        }
        
        badge.textContent = hierarchyText;
    }
    
    setupEventListeners() {
        // Emergency button
        const emergencyBtn = this.shadowRoot.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.handleEmergency());
        }
        
        // Drawer close
        const drawerClose = this.shadowRoot.getElementById('drawerClose');
        const drawerOverlay = this.shadowRoot.getElementById('drawerOverlay');
        
        if (drawerClose) {
            drawerClose.addEventListener('click', () => this.close());
        }
        
        if (drawerOverlay) {
            drawerOverlay.addEventListener('click', () => this.close());
        }
        
        // Country selector
        const mobileCountry = this.shadowRoot.getElementById('mobileCountry');
        if (mobileCountry) {
            mobileCountry.addEventListener('click', () => this.showCountrySelector());
        }
        
        // Navigation items
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.close();
            });
        });
        
        // Action buttons
        const drawerActions = this.shadowRoot.getElementById('drawerActions');
        if (drawerActions) {
            drawerActions.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;
                
                switch (button.id) {
                    case 'loginBtn':
                        window.location.href = 'auth/login.html';
                        break;
                    case 'registerBtn':
                        window.location.href = 'auth/register.html';
                        break;
                    case 'logoutBtn':
                        this.handleLogout();
                        break;
                    case 'helpBtn':
                        window.location.href = 'emergency/index.html';
                        break;
                }
                
                this.close();
            });
        }
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    handleEmergency() {
        // Check if user is authenticated
        const isAuthenticated = !!localStorage.getItem('mpesewa_auth_token');
        
        if (isAuthenticated) {
            window.location.href = 'emergency/quick-apply.html';
        } else {
            window.location.href = 'auth/login.html?redirect=emergency/quick-apply.html';
        }
    }
    
    showCountrySelector() {
        const currentCountry = localStorage.getItem('mpesewa_country');
        const isLoggedIn = localStorage.getItem('mpesewa_auth_token');
        
        if (isLoggedIn && currentCountry) {
            this.showToast('Country is locked after registration. Contact admin to change.');
            return;
        }
        
        this.close(); // Close drawer first
        
        // Show country selection modal (similar to Sidebar.js)
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
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 400px;
                    max-height: 80vh;
                    overflow: hidden;
                }
                
                .modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    background: #003366;
                    color: white;
                }
                
                .modal-title {
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .modal-body {
                    padding: 20px;
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .countries-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .country-option {
                    padding: 15px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
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
                    font-size: 28px;
                }
                
                .country-option-name {
                    font-size: 16px;
                    font-weight: 500;
                    color: #374151;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            </style>
            
            <div class="country-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title">Select Your Country</div>
                    </div>
                    <div class="modal-body">
                        <div class="countries-list" id="countriesList">
                            ${this.getCountries().map(country => `
                                <div class="country-option ${country.code === currentCountry ? 'selected' : ''}" 
                                     data-country="${country.code}">
                                    <div class="country-option-flag">${country.flag}</div>
                                    <div class="country-option-name">${country.name}</div>
                                </div>
                            `).join('')}
                        </div>
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
                
                // Auto-confirm after selection
                setTimeout(() => {
                    if (selectedCountry) {
                        localStorage.setItem('mpesewa_country', selectedCountry);
                        this.currentCountry = selectedCountry;
                        this.renderDynamicContent();
                        this.showToast(`Country set to ${this.getCountryName(selectedCountry)}`);
                        modal.remove();
                    }
                }, 500);
            });
        });
        
        // Close modal on overlay click
        modal.querySelector('.country-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('country-modal')) {
                modal.remove();
            }
        });
    }
    
    handleLogout() {
        // Clear auth data
        localStorage.removeItem('mpesewa_auth_token');
        localStorage.removeItem('mpesewa_user_role');
        localStorage.removeItem('mpesewa_user_name');
        localStorage.removeItem('mpesewa_user_groups');
        
        // Update UI
        this.userRole = 'guest';
        this.renderDynamicContent();
        
        // Redirect to home
        window.location.href = 'index.html';
    }
    
    updateUserData() {
        const token = localStorage.getItem('mpesewa_auth_token');
        if (token) {
            this.userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
            this.renderDynamicContent();
        }
    }
    
    // Public methods
    open() {
        this.isOpen = true;
        const drawer = this.shadowRoot.getElementById('mobileDrawer');
        const overlay = this.shadowRoot.getElementById('drawerOverlay');
        
        if (drawer) drawer.classList.add('open');
        if (overlay) overlay.classList.add('visible');
        
        // Update data
        this.updateUserData();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.isOpen = false;
        const drawer = this.shadowRoot.getElementById('mobileDrawer');
        const overlay = this.shadowRoot.getElementById('drawerOverlay');
        
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
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
            left: 50%;
            transform: translateX(-50%);
            background: #003366;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10001;
            animation: slideUp 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Register custom element
customElements.define('mp-mobile-drawer', MPMobileDrawer);

// Export for module usage
export default MPMobileDrawer;