/**
 * M-PESEWA APPLICATION SHELL
 * Provides the consistent UI structure and enforces hierarchical navigation
 */

class MPesewaAppShell {
    constructor() {
        this.config = {
            header: {
                backgroundColor: '#003366', // Primary Brand Blue
                textColor: '#ffffff',
                height: '72px',
                sticky: true,
                showCountryBadge: true,
                showSubscriptionStatus: true
            },
            footer: {
                backgroundColor: '#1f2a37', // Neutral Dark Slate
                textColor: '#ffffff',
                columns: 6,
                showCountryTicker: true,
                showContactInfo: true
            },
            sidebar: {
                width: '280px',
                backgroundColor: '#ffffff',
                showHierarchyTree: true,
                showGroupInfo: true,
                showRoleSwitcher: true
            },
            main: {
                maxWidth: '1200px',
                padding: '0 20px',
                backgroundColor: '#f8f9fa' // Neutral Light
            }
        };

        this.elements = {
            header: null,
            footer: null,
            sidebar: null,
            main: null,
            modals: null,
            notifications: null
        };

        this.state = {
            currentView: 'dashboard',
            userRole: null,
            country: null,
            group: null,
            subscription: null,
            isSidebarOpen: false,
            isMobile: false,
            isLoading: false,
            error: null
        };

        this.hierarchyRenderer = null;
        this.navigationGuard = null;
    }

    /**
     * INITIALIZE APPLICATION SHELL
     * Sets up the complete UI structure
     */
    async initialize() {
        console.log('[APP-SHELL] Initializing M-Pesewa application shell');
        
        // Check device type
        this.checkDeviceType();
        
        // Create DOM elements
        await this.createShellStructure();
        
        // Initialize hierarchy renderer
        await this.initializeHierarchyRenderer();
        
        // Initialize navigation guard
        await this.initializeNavigationGuard();
        
        // Load user state
        await this.loadUserState();
        
        // Render initial view
        await this.render();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start auto-save
        this.startAutoSave();
        
        console.log('[APP-SHELL] Application shell initialized successfully');
        
        return this;
    }

    /**
     * CREATE SHELL STRUCTURE
     * Builds the complete UI hierarchy
     */
    async createShellStructure() {
        // Create main container
        const appContainer = document.getElementById('app') || document.body;
        
        // Clear existing content
        appContainer.innerHTML = '';
        
        // Create shell structure
        appContainer.innerHTML = `
            <div class="mpesewa-app" id="mpesewaApp">
                <!-- Header -->
                <header class="app-header" id="appHeader" role="banner">
                    <div class="header-container">
                        <div class="header-left">
                            <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                            <div class="logo" id="appLogo">
                                <span class="logo-text">M-PESEWA</span>
                                <span class="logo-tagline">Trusted Circles Lending</span>
                            </div>
                        </div>
                        
                        <div class="header-center" id="headerNavigation">
                            <!-- Dynamic navigation will be inserted here -->
                        </div>
                        
                        <div class="header-right">
                            <div class="user-info" id="userInfo">
                                <!-- Dynamic user info will be inserted here -->
                            </div>
                            <div class="country-badge" id="countryBadge">
                                <!-- Dynamic country badge will be inserted here -->
                            </div>
                            <div class="subscription-status" id="subscriptionStatus">
                                <!-- Dynamic subscription status will be inserted here -->
                            </div>
                            <button class="notifications-toggle" id="notificationsToggle" aria-label="Toggle notifications">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                                <span class="notification-count" id="notificationCount">0</span>
                            </button>
                        </div>
                    </div>
                </header>

                <!-- Main Layout -->
                <div class="app-main-layout">
                    <!-- Sidebar -->
                    <aside class="app-sidebar" id="appSidebar" role="complementary">
                        <div class="sidebar-header">
                            <h3 class="sidebar-title">Navigation</h3>
                            <button class="sidebar-close" id="sidebarClose" aria-label="Close sidebar">×</button>
                        </div>
                        <div class="sidebar-content">
                            <div class="hierarchy-tree" id="hierarchyTree">
                                <!-- Dynamic hierarchy tree will be inserted here -->
                            </div>
                            <nav class="sidebar-nav" id="sidebarNav" role="navigation">
                                <!-- Dynamic sidebar navigation will be inserted here -->
                            </nav>
                            <div class="sidebar-footer">
                                <div class="role-switcher" id="roleSwitcher">
                                    <!-- Dynamic role switcher will be inserted here -->
                                </div>
                                <div class="group-info" id="groupInfo">
                                    <!-- Dynamic group info will be inserted here -->
                                </div>
                            </div>
                        </div>
                    </aside>

                    <!-- Main Content -->
                    <main class="app-main" id="appMain" role="main">
                        <div class="content-wrapper">
                            <div class="breadcrumbs" id="breadcrumbs" role="navigation" aria-label="Breadcrumb">
                                <!-- Dynamic breadcrumbs will be inserted here -->
                            </div>
                            <div class="page-header" id="pageHeader">
                                <!-- Dynamic page header will be inserted here -->
                            </div>
                            <div class="content-area" id="contentArea">
                                <!-- Dynamic content will be inserted here -->
                            </div>
                        </div>
                    </main>
                </div>

                <!-- Footer -->
                <footer class="app-footer" id="appFooter" role="contentinfo">
                    <div class="footer-container">
                        <div class="footer-columns" id="footerColumns">
                            <!-- Dynamic footer columns will be inserted here -->
                        </div>
                        <div class="country-ticker" id="countryTicker">
                            <!-- Dynamic country ticker will be inserted here -->
                        </div>
                        <div class="footer-bottom" id="footerBottom">
                            <!-- Dynamic footer bottom will be inserted here -->
                        </div>
                    </div>
                </footer>

                <!-- Modals -->
                <div class="modals-container" id="modalsContainer"></div>

                <!-- Notifications -->
                <div class="notifications-container" id="notificationsContainer"></div>

                <!-- Loading Overlay -->
                <div class="loading-overlay" id="loadingOverlay" style="display: none;">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading M-Pesewa...</div>
                </div>

                <!-- Error Overlay -->
                <div class="error-overlay" id="errorOverlay" style="display: none;">
                    <div class="error-content">
                        <div class="error-icon">⚠️</div>
                        <h3 class="error-title">Something went wrong</h3>
                        <p class="error-message" id="errorMessage"></p>
                        <button class="error-retry" id="errorRetry">Retry</button>
                    </div>
                </div>
            </div>
        `;

        // Store element references
        this.elements = {
            app: document.getElementById('mpesewaApp'),
            header: document.getElementById('appHeader'),
            sidebar: document.getElementById('appSidebar'),
            main: document.getElementById('appMain'),
            footer: document.getElementById('appFooter'),
            modals: document.getElementById('modalsContainer'),
            notifications: document.getElementById('notificationsContainer'),
            loading: document.getElementById('loadingOverlay'),
            error: document.getElementById('errorOverlay')
        };

        // Apply configuration
        this.applyConfiguration();
    }

    /**
     * APPLY CONFIGURATION
     * Applies colors and styles from configuration
     */
    applyConfiguration() {
        // Apply header styles
        if (this.elements.header) {
            this.elements.header.style.backgroundColor = this.config.header.backgroundColor;
            this.elements.header.style.color = this.config.header.textColor;
            this.elements.header.style.height = this.config.header.height;
            
            if (this.config.header.sticky) {
                this.elements.header.style.position = 'sticky';
                this.elements.header.style.top = '0';
                this.elements.header.style.zIndex = '1000';
            }
        }

        // Apply footer styles
        if (this.elements.footer) {
            this.elements.footer.style.backgroundColor = this.config.footer.backgroundColor;
            this.elements.footer.style.color = this.config.footer.textColor;
        }

        // Apply sidebar styles
        if (this.elements.sidebar) {
            this.elements.sidebar.style.width = this.config.sidebar.width;
            this.elements.sidebar.style.backgroundColor = this.config.sidebar.backgroundColor;
        }

        // Apply main styles
        if (this.elements.main) {
            this.elements.main.style.maxWidth = this.config.main.maxWidth;
            this.elements.main.style.padding = this.config.main.padding;
            this.elements.main.style.backgroundColor = this.config.main.backgroundColor;
        }
    }

    /**
     * INITIALIZE HIERARCHY RENDERER
     * Creates visual representation of the strict hierarchy
     */
    async initializeHierarchyRenderer() {
        this.hierarchyRenderer = {
            renderTree: async () => {
                const treeContainer = document.getElementById('hierarchyTree');
                if (!treeContainer) return;

                const hierarchy = await this.getHierarchyData();
                
                treeContainer.innerHTML = `
                    <div class="hierarchy">
                        <div class="hierarchy-level global">
                            <div class="level-label">🌍 Global Platform</div>
                            <div class="level-children">
                                ${hierarchy.countries.map(country => `
                                    <div class="hierarchy-level country" data-country="${country.code}">
                                        <div class="level-label">
                                            <span class="country-flag">${country.flag}</span>
                                            ${country.name}
                                        </div>
                                        <div class="level-stats">
                                            <span class="stat">${country.groupsCount || 0} Groups</span>
                                            <span class="stat">${country.lendersCount || 0} Lenders</span>
                                            <span class="stat">${country.borrowersCount || 0} Borrowers</span>
                                        </div>
                                        <div class="level-children groups">
                                            ${(country.groups || []).map(group => `
                                                <div class="hierarchy-level group" data-group="${group.id}">
                                                    <div class="level-label">${group.name}</div>
                                                    <div class="level-stats">
                                                        <span class="stat">${group.members || 0}/1000 Members</span>
                                                        <span class="stat">${group.lenders || 0} Lenders</span>
                                                        <span class="stat">${group.borrowers || 0} Borrowers</span>
                                                    </div>
                                                    <div class="level-children">
                                                        <div class="hierarchy-level lenders">
                                                            <div class="level-label">Lenders (${group.lenders || 0})</div>
                                                            ${(group.lenderList || []).map(lender => `
                                                                <div class="hierarchy-level lender" data-lender="${lender.id}">
                                                                    <div class="level-label">${lender.name}</div>
                                                                    <div class="level-stats">
                                                                        <span class="stat">${lender.ledgers || 0} Ledgers</span>
                                                                        <span class="stat">${lender.currency} ${lender.totalLent || 0}</span>
                                                                    </div>
                                                                    <div class="level-children ledgers">
                                                                        ${(lender.ledgerList || []).map(ledger => `
                                                                            <div class="hierarchy-level ledger" data-ledger="${ledger.id}">
                                                                                <div class="level-label">${ledger.borrowerName}</div>
                                                                                <div class="level-stats">
                                                                                    <span class="stat">${ledger.currency} ${ledger.amount}</span>
                                                                                    <span class="stat ${ledger.status === 'ACTIVE' ? 'status-active' : 'status-cleared'}">${ledger.status}</span>
                                                                                </div>
                                                                            </div>
                                                                        `).join('')}
                                                                    </div>
                                                                </div>
                                                            `).join('')}
                                                        </div>
                                                        <div class="hierarchy-level borrowers">
                                                            <div class="level-label">Borrowers (${group.borrowers || 0})</div>
                                                            ${(group.borrowerList || []).map(borrower => `
                                                                <div class="hierarchy-level borrower" data-borrower="${borrower.id}">
                                                                    <div class="level-label">
                                                                        ${borrower.name}
                                                                        ${borrower.blacklisted ? '<span class="badge blacklisted">Blacklisted</span>' : ''}
                                                                    </div>
                                                                    <div class="level-stats">
                                                                        <span class="rating">${'★'.repeat(borrower.rating || 0)}${'☆'.repeat(5 - (borrower.rating || 0))}</span>
                                                                        <span class="stat">${borrower.groups || 0}/4 Groups</span>
                                                                    </div>
                                                                </div>
                                                            `).join('')}
                                                        </div>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;

                // Add click handlers for hierarchy navigation
                this.addHierarchyEventListeners();
            },

            updateNode: async (nodeType, nodeId, data) => {
                // Implementation to update specific node in hierarchy
                console.log(`[HIERARCHY] Updating ${nodeType} ${nodeId}:`, data);
            },

            highlightPath: async (path) => {
                // Highlight the current user's path in hierarchy
                const selectors = path.map(p => `[data-${p.type}="${p.id}"]`);
                const elements = document.querySelectorAll(selectors.join(' '));
                
                elements.forEach(el => {
                    el.classList.add('active-path');
                });
            }
        };
    }

    /**
     * INITIALIZE NAVIGATION GUARD
     * Enforces hierarchical access rules
     */
    async initializeNavigationGuard() {
        this.navigationGuard = {
            canAccess: async (route, userState) => {
                const rules = {
                    // Global routes (accessible to all)
                    'home': () => true,
                    'about': () => true,
                    'contact': () => true,
                    'countries': () => true,
                    
                    // Country-specific routes
                    'country.dashboard': (state) => !!state.country,
                    'country.groups': (state) => !!state.country,
                    
                    // Group-specific routes
                    'group.dashboard': (state) => !!state.country && !!state.group,
                    'group.members': (state) => !!state.country && !!state.group,
                    
                    // Lender-specific routes
                    'lender.dashboard': (state) => 
                        !!state.country && !!state.group && 
                        state.userRole === 'LENDER' && state.subscription === 'ACTIVE',
                    
                    'lender.portfolio': (state) => 
                        !!state.country && !!state.group && 
                        state.userRole === 'LENDER' && state.subscription === 'ACTIVE',
                    
                    'lender.ledgers': (state) => 
                        !!state.country && !!state.group && 
                        state.userRole === 'LENDER' && state.subscription === 'ACTIVE',
                    
                    // Borrower-specific routes
                    'borrower.dashboard': (state) => 
                        !!state.country && !!state.group && 
                        state.userRole === 'BORROWER',
                    
                    'borrower.apply': (state) => 
                        !!state.country && !!state.group && 
                        state.userRole === 'BORROWER' && !state.blacklisted,
                    
                    'borrower.history': (state) => 
                        !!state.country && !!state.group && 
                        state.userRole === 'BORROWER',
                    
                    // Admin routes
                    'admin.dashboard': (state) => 
                        state.userRole === 'ADMIN',
                    
                    'admin.blacklist': (state) => 
                        state.userRole === 'ADMIN',
                    
                    // Subscription routes
                    'subscription.plans': (state) => 
                        state.userRole === 'LENDER',
                    
                    'subscription.upgrade': (state) => 
                        state.userRole === 'LENDER',
                    
                    // Emergency hub routes
                    'emergency.hub': () => true,
                    'emergency.category': () => true
                };

                const rule = rules[route];
                if (!rule) {
                    console.warn(`[NAV-GUARD] No rule defined for route: ${route}`);
                    return false;
                }

                return rule(userState);
            },

            redirectIfUnauthorized: async (route, userState) => {
                const canAccess = await this.navigationGuard.canAccess(route, userState);
                
                if (!canAccess) {
                    // Determine appropriate redirect
                    let redirectTo = '/';
                    
                    if (!userState.country) {
                        redirectTo = '/countries';
                    } else if (!userState.group) {
                        redirectTo = `/countries/${userState.country}/groups`;
                    } else if (!userState.userRole) {
                        redirectTo = `/groups/${userState.group}/select-role`;
                    } else if (userState.userRole === 'LENDER' && userState.subscription !== 'ACTIVE') {
                        redirectTo = `/subscription/plans`;
                    } else if (userState.blacklisted) {
                        redirectTo = '/blacklist/info';
                    }
                    
                    // Store attempted route for after authentication
                    sessionStorage.setItem('redirectAfterAuth', route);
                    
                    // Redirect
                    window.location.href = redirectTo;
                    return false;
                }
                
                return true;
            },

            validateHierarchyTransition: async (fromState, toState) => {
                // Ensure transitions follow hierarchy
                const validTransitions = {
                    'NO_COUNTRY': ['COUNTRY_SELECTED'],
                    'COUNTRY_SELECTED': ['GROUP_SELECTED', 'NO_COUNTRY'],
                    'GROUP_SELECTED': ['ROLE_SELECTED', 'COUNTRY_SELECTED'],
                    'ROLE_SELECTED': ['LENDER_ACTIVE', 'BORROWER_ACTIVE', 'GROUP_SELECTED'],
                    'LENDER_ACTIVE': ['ROLE_SELECTED'],
                    'BORROWER_ACTIVE': ['ROLE_SELECTED']
                };

                const from = this.getStateCategory(fromState);
                const to = this.getStateCategory(toState);
                
                return validTransitions[from]?.includes(to) || false;
            }
        };
    }

    /**
     * RENDER COMPLETE APPLICATION
     * Updates all dynamic parts of the UI
     */
    async render() {
        this.showLoading();
        
        try {
            // Render header navigation
            await this.renderHeaderNavigation();
            
            // Render user info
            await this.renderUserInfo();
            
            // Render country badge
            await this.renderCountryBadge();
            
            // Render subscription status
            await this.renderSubscriptionStatus();
            
            // Render sidebar navigation
            await this.renderSidebarNavigation();
            
            // Render hierarchy tree
            if (this.config.sidebar.showHierarchyTree) {
                await this.hierarchyRenderer.renderTree();
            }
            
            // Render role switcher
            if (this.config.sidebar.showRoleSwitcher) {
                await this.renderRoleSwitcher();
            }
            
            // Render group info
            if (this.config.sidebar.showGroupInfo) {
                await this.renderGroupInfo();
            }
            
            // Render breadcrumbs
            await this.renderBreadcrumbs();
            
            // Render page header
            await this.renderPageHeader();
            
            // Render main content
            await this.renderMainContent();
            
            // Render footer
            await this.renderFooter();
            
            // Render notifications
            await this.renderNotifications();
            
            this.hideLoading();
        } catch (error) {
            console.error('[APP-SHELL] Render error:', error);
            this.showError('Failed to render application. Please refresh the page.');
        }
    }

    /**
     * RENDER DYNAMIC COMPONENTS
     */
    async renderHeaderNavigation() {
        const container = document.getElementById('headerNavigation');
        if (!container) return;

        const navItems = await this.getNavigationItems();
        
        container.innerHTML = `
            <nav class="header-nav">
                <ul>
                    ${navItems.map(item => `
                        <li class="nav-item ${item.active ? 'active' : ''} ${item.dropdown ? 'dropdown' : ''}">
                            <a href="${item.href}" 
                               class="nav-link"
                               ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                                ${item.icon ? `<span class="nav-icon">${item.icon}</span>` : ''}
                                <span class="nav-text">${item.text}</span>
                                ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                                ${item.dropdown ? '<span class="dropdown-arrow">▾</span>' : ''}
                            </a>
                            ${item.dropdown ? `
                                <div class="dropdown-menu">
                                    ${item.children.map(child => `
                                        <a href="${child.href}" class="dropdown-item">
                                            ${child.icon ? `<span class="item-icon">${child.icon}</span>` : ''}
                                            <span class="item-text">${child.text}</span>
                                            ${child.badge ? `<span class="item-badge">${child.badge}</span>` : ''}
                                        </a>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </li>
                    `).join('')}
                </ul>
            </nav>
        `;
    }

    async renderUserInfo() {
        const container = document.getElementById('userInfo');
        if (!container) return;

        const user = await this.getCurrentUser();
        
        if (!user) {
            container.innerHTML = `
                <div class="user-auth">
                    <a href="/auth/login" class="btn btn-outline btn-sm">Sign In</a>
                    <a href="/auth/register" class="btn btn-primary btn-sm">Get Started</a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">
                    ${user.avatar || user.name.charAt(0).toUpperCase()}
                </div>
                <div class="user-details">
                    <div class="user-name">${user.name}</div>
                    <div class="user-role">${user.role} • ${user.country}</div>
                </div>
                <div class="user-menu">
                    <button class="user-menu-toggle" id="userMenuToggle">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="/profile" class="dropdown-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Profile
                        </a>
                        <a href="/settings" class="dropdown-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                            Settings
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="/auth/logout" class="dropdown-item logout">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    async renderCountryBadge() {
        const container = document.getElementById('countryBadge');
        if (!container || !this.config.header.showCountryBadge) return;

        const country = this.state.country;
        
        if (!country) {
            container.innerHTML = `
                <button class="country-selector" id="countrySelector">
                    <span class="flag">🌍</span>
                    <span class="text">Select Country</span>
                    <span class="arrow">▾</span>
                </button>
            `;
            return;
        }

        container.innerHTML = `
            <div class="country-badge-content">
                <span class="flag">${country.flag}</span>
                <span class="code">${country.code}</span>
                <span class="currency">${country.currency}</span>
            </div>
        `;
    }

    async renderSubscriptionStatus() {
        const container = document.getElementById('subscriptionStatus');
        if (!container || !this.config.header.showSubscriptionStatus) return;

        const subscription = this.state.subscription;
        
        if (!subscription || this.state.userRole !== 'LENDER') {
            container.style.display = 'none';
            return;
        }

        const daysRemaining = this.calculateDaysRemaining(subscription.expires);
        const statusClass = subscription.status === 'ACTIVE' 
            ? daysRemaining > 7 ? 'status-active' : 'status-warning'
            : 'status-expired';

        container.innerHTML = `
            <div class="subscription-status-badge ${statusClass}">
                <span class="tier">${subscription.tier}</span>
                <span class="days">${daysRemaining}d</span>
            </div>
        `;
    }

    async renderSidebarNavigation() {
        const container = document.getElementById('sidebarNav');
        if (!container) return;

        const navItems = await this.getSidebarNavigation();
        
        container.innerHTML = `
            <ul class="sidebar-nav-list">
                ${navItems.map(item => `
                    <li class="sidebar-nav-item ${item.active ? 'active' : ''} ${item.children ? 'has-children' : ''}">
                        <a href="${item.href}" class="sidebar-nav-link">
                            ${item.icon ? `<span class="nav-icon">${item.icon}</span>` : ''}
                            <span class="nav-text">${item.text}</span>
                            ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                            ${item.children ? '<span class="nav-arrow">›</span>' : ''}
                        </a>
                        ${item.children ? `
                            <ul class="sidebar-nav-submenu">
                                ${item.children.map(child => `
                                    <li class="sidebar-nav-subitem ${child.active ? 'active' : ''}">
                                        <a href="${child.href}" class="sidebar-nav-sublink">
                                            ${child.icon ? `<span class="sub-icon">${child.icon}</span>` : ''}
                                            <span class="sub-text">${child.text}</span>
                                            ${child.badge ? `<span class="sub-badge">${child.badge}</span>` : ''}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                        ` : ''}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    async renderRoleSwitcher() {
        const container = document.getElementById('roleSwitcher');
        if (!container) return;

        const currentRole = this.state.userRole;
        const canSwitch = await this.canSwitchRole();
        
        container.innerHTML = `
            <div class="role-switcher-widget">
                <div class="role-switcher-header">
                    <h4>Current Role</h4>
                    ${canSwitch ? '<button class="switch-btn" id="switchRoleBtn">Switch</button>' : ''}
                </div>
                <div class="current-role ${currentRole?.toLowerCase()}">
                    <div class="role-icon">${currentRole === 'LENDER' ? '💼' : '👤'}</div>
                    <div class="role-info">
                        <div class="role-name">${currentRole || 'Not Selected'}</div>
                        <div class="role-status">
                            ${currentRole === 'LENDER' 
                                ? this.state.subscription 
                                    ? `Subscription: ${this.state.subscription.status}`
                                    : 'No Subscription'
                                : 'Borrower Access'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async renderGroupInfo() {
        const container = document.getElementById('groupInfo');
        if (!container) return;

        const group = this.state.group;
        
        if (!group) {
            container.innerHTML = `
                <div class="group-info-empty">
                    <p>No group selected</p>
                    <a href="/groups" class="btn btn-outline btn-sm">Browse Groups</a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="group-info-widget">
                <div class="group-header">
                    <h4>${group.name}</h4>
                    <span class="group-type">${group.type}</span>
                </div>
                <div class="group-stats">
                    <div class="stat">
                        <div class="stat-value">${group.members || 0}</div>
                        <div class="stat-label">Members</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${group.lenders || 0}</div>
                        <div class="stat-label">Lenders</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${group.borrowers || 0}</div>
                        <div class="stat-label">Borrowers</div>
                    </div>
                </div>
                <div class="group-actions">
                    <button class="btn btn-outline btn-sm" id="leaveGroupBtn">Leave</button>
                    <button class="btn btn-primary btn-sm" id="inviteToGroupBtn">Invite</button>
                </div>
            </div>
        `;
    }

    async renderBreadcrumbs() {
        const container = document.getElementById('breadcrumbs');
        if (!container) return;

        const path = this.getCurrentPath();
        
        container.innerHTML = `
            <nav class="breadcrumb-nav">
                <ol>
                    ${path.map((item, index) => `
                        <li class="breadcrumb-item ${index === path.length - 1 ? 'active' : ''}">
                            ${index < path.length - 1 
                                ? `<a href="${item.href}">${item.label}</a>` 
                                : `<span>${item.label}</span>`
                            }
                            ${index < path.length - 1 ? '<span class="separator">/</span>' : ''}
                        </li>
                    `).join('')}
                </ol>
            </nav>
        `;
    }

    async renderPageHeader() {
        const container = document.getElementById('pageHeader');
        if (!container) return;

        const page = this.getCurrentPage();
        
        container.innerHTML = `
            <div class="page-header-content">
                <h1 class="page-title">${page.title}</h1>
                ${page.subtitle ? `<p class="page-subtitle">${page.subtitle}</p>` : ''}
                ${page.actions ? `
                    <div class="page-actions">
                        ${page.actions.map(action => `
                            <button class="btn ${action.primary ? 'btn-primary' : 'btn-outline'}" 
                                    id="${action.id}">
                                ${action.icon ? `<span class="btn-icon">${action.icon}</span>` : ''}
                                ${action.label}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    async renderMainContent() {
        const container = document.getElementById('contentArea');
        if (!container) return;

        // This would be handled by the router
        // For now, show appropriate content based on state
        container.innerHTML = await this.getContentForState();
    }

    async renderFooter() {
        const columnsContainer = document.getElementById('footerColumns');
        const tickerContainer = document.getElementById('countryTicker');
        const bottomContainer = document.getElementById('footerBottom');
        
        if (!columnsContainer || !tickerContainer || !bottomContainer) return;

        // Render columns
        const columns = this.getFooterColumns();
        columnsContainer.innerHTML = `
            ${columns.map(col => `
                <div class="footer-column">
                    <h4 class="column-title">${col.title}</h4>
                    ${col.links.map(link => `
                        <a href="${link.href}" class="footer-link">${link.text}</a>
                    `).join('')}
                </div>
            `).join('')}
        `;

        // Render country ticker
        if (this.config.footer.showCountryTicker) {
            const countries = this.supportedCountries.map(c => `${c.flag} ${c.name}`).join(' • ');
            tickerContainer.innerHTML = `
                <div class="ticker-track">
                    ${countries} • ${countries}
                </div>
            `;
        }

        // Render bottom section
        if (this.config.footer.showContactInfo) {
            bottomContainer.innerHTML = `
                <div class="footer-bottom-content">
                    <div class="copyright">
                        © 2016–2026, M-Pesewa.com (Technology Pvt. Ltd.) — All Rights Reserved
                    </div>
                    <div class="contacts">
                        <strong>Contact by Country:</strong>
                        Kenya: +254 709 219 000 | Uganda: +256 392 175 546 | 
                        Tanzania: +255 659 073 010 | Rwanda: +250 791 590 801
                    </div>
                </div>
            `;
        }
    }

    async renderNotifications() {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;

        const notifications = await this.getNotifications();
        
        container.innerHTML = `
            <div class="notifications-dropdown" id="notificationsDropdown">
                <div class="notifications-header">
                    <h4>Notifications</h4>
                    <button class="mark-all-read" id="markAllReadBtn">Mark all as read</button>
                </div>
                <div class="notifications-list">
                    ${notifications.length > 0 
                        ? notifications.map(notif => `
                            <div class="notification-item ${notif.read ? 'read' : 'unread'}">
                                <div class="notification-icon">${notif.icon || '📢'}</div>
                                <div class="notification-content">
                                    <div class="notification-title">${notif.title}</div>
                                    <div class="notification-message">${notif.message}</div>
                                    <div class="notification-time">${notif.time}</div>
                                </div>
                            </div>
                        `).join('')
                        : '<div class="no-notifications">No new notifications</div>'
                    }
                </div>
                <div class="notifications-footer">
                    <a href="/notifications" class="view-all">View all notifications</a>
                </div>
            </div>
        `;
    }

    /**
     * EVENT HANDLERS
     */
    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => this.closeSidebar());
        }

        // User menu
        const userMenuToggle = document.getElementById('userMenuToggle');
        if (userMenuToggle) {
            userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Notifications
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotifications();
            });
        }

        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                this.closeUserMenu();
            }
            if (!e.target.closest('.notifications-toggle')) {
                this.closeNotifications();
            }
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Before unload
        window.addEventListener('beforeunload', () => this.handleBeforeUnload());
        
        // Online/offline
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    addHierarchyEventListeners() {
        // Add click handlers to hierarchy tree
        document.querySelectorAll('.hierarchy-level').forEach(level => {
            level.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleHierarchyClick(level);
            });
        });
    }

    /**
     * STATE MANAGEMENT
     */
    async loadUserState() {
        try {
            // Load from localStorage
            const savedState = localStorage.getItem('mpesewa_state');
            if (savedState) {
                this.state = { ...this.state, ...JSON.parse(savedState) };
            }

            // Load from session
            const session = await this.getSessionData();
            if (session) {
                this.state = { ...this.state, ...session };
            }

            // Validate state
            await this.validateState();
        } catch (error) {
            console.error('[APP-SHELL] Failed to load user state:', error);
            this.state = {
                ...this.state,
                currentView: 'home',
                userRole: null,
                country: null,
                group: null,
                subscription: null
            };
        }
    }

    async validateState() {
        // Check if country is still valid
        if (this.state.country) {
            const validCountry = this.supportedCountries.find(c => c.code === this.state.country);
            if (!validCountry) {
                this.state.country = null;
                this.state.group = null;
                this.state.userRole = null;
            }
        }

        // Check subscription expiry
        if (this.state.subscription && this.state.subscription.expires) {
            const expiry = new Date(this.state.subscription.expires);
            if (new Date() > expiry) {
                this.state.subscription.status = 'EXPIRED';
            }
        }

        // Save validated state
        this.saveState();
    }

    saveState() {
        try {
            localStorage.setItem('mpesewa_state', JSON.stringify(this.state));
        } catch (error) {
            console.error('[APP-SHELL] Failed to save state:', error);
        }
    }

    startAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveState();
        }, 30000);
    }

    /**
     * HELPER METHODS
     */
    checkDeviceType() {
        this.state.isMobile = window.innerWidth < 768;
        
        if (this.state.isMobile) {
            this.config.sidebar.width = '100%';
            this.closeSidebar();
        }
    }

    handleResize() {
        const wasMobile = this.state.isMobile;
        this.checkDeviceType();
        
        if (wasMobile !== this.state.isMobile) {
            this.render();
        }
    }

    toggleSidebar() {
        this.state.isSidebarOpen = !this.state.isSidebarOpen;
        if (this.elements.sidebar) {
            if (this.state.isSidebarOpen) {
                this.elements.sidebar.classList.add('open');
            } else {
                this.elements.sidebar.classList.remove('open');
            }
        }
    }

    closeSidebar() {
        this.state.isSidebarOpen = false;
        if (this.elements.sidebar) {
            this.elements.sidebar.classList.remove('open');
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    closeUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    toggleNotifications() {
        const dropdown = document.getElementById('notificationsDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    closeNotifications() {
        const dropdown = document.getElementById('notificationsDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    showLoading(message = 'Loading...') {
        if (this.elements.loading) {
            const text = this.elements.loading.querySelector('.loading-text');
            if (text) text.textContent = message;
            this.elements.loading.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'none';
        }
    }

    showError(message) {
        if (this.elements.error) {
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) errorMessage.textContent = message;
            this.elements.error.style.display = 'flex';
        }
    }

    hideError() {
        if (this.elements.error) {
            this.elements.error.style.display = 'none';
        }
    }

    handleHierarchyClick(element) {
        const dataset = element.dataset;
        
        if (dataset.country) {
            this.navigateToCountry(dataset.country);
        } else if (dataset.group) {
            this.navigateToGroup(dataset.group);
        } else if (dataset.lender) {
            this.navigateToLender(dataset.lender);
        } else if (dataset.borrower) {
            this.navigateToBorrower(dataset.borrower);
        } else if (dataset.ledger) {
            this.navigateToLedger(dataset.ledger);
        }
    }

    handleBeforeUnload() {
        this.saveState();
    }

    handleOnline() {
        this.showNotification('You are back online', 'success');
        // Sync data
        this.syncData();
    }

    handleOffline() {
        this.showNotification('You are offline. Some features may be limited.', 'warning');
    }

    /**
     * DATA METHODS (would be implemented with actual APIs)
     */
    async getHierarchyData() {
        // Implementation would fetch from API
        return {
            countries: []
        };
    }

    async getCurrentUser() {
        // Implementation would fetch from API
        return null;
    }

    async getNavigationItems() {
        // Implementation would generate based on user role
        return [];
    }

    async getSidebarNavigation() {
        // Implementation would generate based on user role
        return [];
    }

    async canSwitchRole() {
        // Implementation would check business rules
        return false;
    }

    getCurrentPath() {
        // Implementation would parse current route
        return [];
    }

    getCurrentPage() {
        // Implementation would get page metadata
        return { title: 'Dashboard', subtitle: '' };
    }

    async getContentForState() {
        // Implementation would get appropriate content
        return '<div class="welcome-message"><h2>Welcome to M-Pesewa</h2></div>';
    }

    getFooterColumns() {
        return [
            {
                title: 'Borrowing',
                links: [
                    { text: 'Get Emergency Loan', href: '/borrower/apply' },
                    { text: 'Online Personal Loan', href: '/borrower/apply?type=personal' },
                    { text: 'Business Loan', href: '/borrower/apply?type=business' },
                    { text: 'How to Apply', href: '/how-it-works' },
                    { text: 'Active Borrowers', href: '/community/borrowers' }
                ]
            },
            {
                title: 'Lending',
                links: [
                    { text: 'Smart Lending', href: '/lender/rules' },
                    { text: 'Why Lend at M-Pesewa?', href: '/lender/why-lend' },
                    { text: 'How to Lend', href: '/lender/how-to-lend' },
                    { text: 'Active Lenders', href: '/community/lenders' }
                ]
            },
            {
                title: 'How It Works',
                links: [
                    { text: 'P2P Lending Works', href: '/how-it-works' },
                    { text: 'Our Role', href: '/about#our-role' },
                    { text: 'Subscriptions', href: '/subscription/plans' },
                    { text: 'Blacklist', href: '/blacklist/public' },
                    { text: 'Debt Collectors', href: '/collectors' }
                ]
            },
            {
                title: 'About Us',
                links: [
                    { text: 'About M-Pesewa', href: '/about' },
                    { text: 'Team & Advisory Board', href: '/about#team' },
                    { text: 'News & Careers', href: '/news' },
                    { text: 'Blog / FAQs', href: '/faq' },
                    { text: 'Contact Us', href: '/contact' }
                ]
            },
            {
                title: 'Legal & Compliance',
                links: [
                    { text: 'Terms & Conditions', href: '/terms' },
                    { text: 'Privacy Policy', href: '/privacy' },
                    { text: 'Grievance Redressal', href: '/grievance' },
                    { text: 'Fair Practices Code', href: '/fair-practices' }
                ]
            },
            {
                title: 'Partnerships',
                links: [
                    { text: 'Be a Partner', href: '/partners' }
                ]
            }
        ];
    }

    async getNotifications() {
        // Implementation would fetch from API
        return [];
    }

    async getSessionData() {
        // Implementation would get from session storage or API
        return null;
    }

    calculateDaysRemaining(expiryDate) {
        const expiry = new Date(expiryDate);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    navigateToCountry(countryCode) {
        // Implementation would navigate to country page
        console.log(`Navigating to country: ${countryCode}`);
    }

    navigateToGroup(groupId) {
        // Implementation would navigate to group page
        console.log(`Navigating to group: ${groupId}`);
    }

    navigateToLender(lenderId) {
        // Implementation would navigate to lender page
        console.log(`Navigating to lender: ${lenderId}`);
    }

    navigateToBorrower(borrowerId) {
        // Implementation would navigate to borrower page
        console.log(`Navigating to borrower: ${borrowerId}`);
    }

    navigateToLedger(ledgerId) {
        // Implementation would navigate to ledger page
        console.log(`Navigating to ledger: ${ledgerId}`);
    }

    showNotification(message, type = 'info') {
        // Implementation would show notification
        console.log(`[NOTIFICATION ${type.toUpperCase()}]: ${message}`);
    }

    async syncData() {
        // Implementation would sync data with server
        console.log('[APP-SHELL] Syncing data...');
    }

    getStateCategory(state) {
        if (!state.country) return 'NO_COUNTRY';
        if (!state.group) return 'COUNTRY_SELECTED';
        if (!state.userRole) return 'GROUP_SELECTED';
        if (state.userRole === 'LENDER' && state.subscription?.status === 'ACTIVE') return 'LENDER_ACTIVE';
        if (state.userRole === 'BORROWER') return 'BORROWER_ACTIVE';
        return 'ROLE_SELECTED';
    }

    get supportedCountries() {
        return [
            { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
            { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
            { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
            { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
            { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩' },
            { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
            { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
            { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
            { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
            { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴' },
            { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
            { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' }
        ];
    }
}

// Export singleton instance
let appShellInstance = null;

export function getAppShell() {
    if (!appShellInstance) {
        appShellInstance = new MPesewaAppShell();
    }
    return appShellInstance;
}

export async function initializeAppShell() {
    const appShell = getAppShell();
    await appShell.initialize();
    return appShell;
}

export default MPesewaAppShell;