/**
 * M-PESEWA LOADING OVERLAY COMPONENT
 * Strict Hierarchy: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 * Component Type: Loading States with Hierarchy Context
 * Brand Colors: #003366 (Primary Blue), #0099ff (Secondary Blue), #f37021 (Action Orange), #28a745 (Trust Green)
 * Rules: Country-specific loading messages, Role-based progress indicators
 */

class LoadingOverlay {
    constructor(config = {}) {
        // Core M-Pesewa Configuration
        this.config = {
            brandColors: {
                primary: '#003366',
                secondary: '#0099ff',
                actionOrange: '#f37021',
                trustGreen: '#28a745',
                neutralLight: '#f8f9fa',
                pureWhite: '#ffffff'
            },
            hierarchy: {
                global: 'M-Pesewa Platform',
                countries: [
                    'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'DRC', 'Burundi',
                    'Nigeria', 'Ghana', 'South Sudan', 'Somalia', 'South Africa', 'Ethiopia'
                ],
                currentCountry: null,
                currentGroup: null,
                userRole: null, // 'lender', 'borrower', 'admin', 'guest'
                userCurrency: 'KSh' // Default, will be updated by country
            },
            loadingTypes: {
                page: 'Page Loading',
                data: 'Data Fetching',
                transaction: 'Transaction Processing',
                group: 'Group Operations',
                ledger: 'Ledger Operations',
                subscription: 'Subscription Processing',
                country: 'Country Context Loading'
            },
            ...config
        };

        // State Management
        this.state = {
            isVisible: false,
            loadingType: null,
            progress: 0,
            currentStep: 0,
            totalSteps: 0,
            messages: [],
            startTime: null,
            estimatedTime: null,
            hierarchyContext: null,
            showProgressBar: false,
            showCountryBadge: true,
            showRoleIndicator: true,
            allowCancel: false
        };

        // DOM Elements
        this.elements = {
            overlay: null,
            container: null,
            spinner: null,
            message: null,
            progressBar: null,
            progressText: null,
            stepsContainer: null,
            countryBadge: null,
            roleIndicator: null,
            cancelButton: null,
            detailsPanel: null
        };

        // Loading Messages by Context
        this.messages = {
            global: {
                default: 'Loading M-Pesewa Platform...',
                page: 'Loading page content...',
                data: 'Fetching your data...',
                transaction: 'Processing transaction...'
            },
            country: {
                Kenya: {
                    default: 'Loading Kenya platform...',
                    lenders: 'Fetching Kenyan lenders...',
                    borrowers: 'Fetching Kenyan borrowers...',
                    groups: 'Loading Kenyan groups...'
                },
                Uganda: {
                    default: 'Loading Uganda platform...',
                    lenders: 'Fetching Ugandan lenders...',
                    borrowers: 'Fetching Ugandan borrowers...',
                    groups: 'Loading Ugandan groups...'
                },
                Tanzania: {
                    default: 'Loading Tanzania platform...',
                    lenders: 'Fetching Tanzanian lenders...',
                    borrowers: 'Fetching Tanzanian borrowers...',
                    groups: 'Loading Tanzanian groups...'
                },
                Rwanda: {
                    default: 'Loading Rwanda platform...',
                    lenders: 'Fetching Rwandan lenders...',
                    borrowers: 'Fetching Rwandan borrowers...',
                    groups: 'Loading Rwandan groups...'
                },
                DRC: {
                    default: 'Loading DRC platform...',
                    lenders: 'Fetching DRC lenders...',
                    borrowers: 'Fetching DRC borrowers...',
                    groups: 'Loading DRC groups...'
                },
                Burundi: {
                    default: 'Loading Burundi platform...',
                    lenders: 'Fetching Burundian lenders...',
                    borrowers: 'Fetching Burundian borrowers...',
                    groups: 'Loading Burundian groups...'
                },
                Nigeria: {
                    default: 'Loading Nigeria platform...',
                    lenders: 'Fetching Nigerian lenders...',
                    borrowers: 'Fetching Nigerian borrowers...',
                    groups: 'Loading Nigerian groups...'
                },
                Ghana: {
                    default: 'Loading Ghana platform...',
                    lenders: 'Fetching Ghanaian lenders...',
                    borrowers: 'Fetching Ghanaian borrowers...',
                    groups: 'Loading Ghanaian groups...'
                },
                'South Sudan': {
                    default: 'Loading South Sudan platform...',
                    lenders: 'Fetching South Sudanese lenders...',
                    borrowers: 'Fetching South Sudanese borrowers...',
                    groups: 'Loading South Sudanese groups...'
                },
                Somalia: {
                    default: 'Loading Somalia platform...',
                    lenders: 'Fetching Somali lenders...',
                    borrowers: 'Fetching Somali borrowers...',
                    groups: 'Loading Somali groups...'
                },
                'South Africa': {
                    default: 'Loading South Africa platform...',
                    lenders: 'Fetching South African lenders...',
                    borrowers: 'Fetching South African borrowers...',
                    groups: 'Loading South African groups...'
                },
                Ethiopia: {
                    default: 'Loading Ethiopia platform...',
                    lenders: 'Fetching Ethiopian lenders...',
                    borrowers: 'Fetching Ethiopian borrowers...',
                    groups: 'Loading Ethiopian groups...'
                }
            },
            role: {
                lender: {
                    default: 'Loading lender dashboard...',
                    portfolio: 'Fetching your lending portfolio...',
                    ledgers: 'Loading your loan ledgers...',
                    borrowers: 'Fetching borrower information...',
                    subscription: 'Checking subscription status...'
                },
                borrower: {
                    default: 'Loading borrower dashboard...',
                    loans: 'Fetching your loan information...',
                    repayments: 'Loading repayment details...',
                    groups: 'Loading your groups...',
                    rating: 'Checking your trust rating...'
                },
                admin: {
                    default: 'Loading admin panel...',
                    users: 'Fetching user data...',
                    groups: 'Loading group information...',
                    ledgers: 'Processing ledger audits...',
                    system: 'Checking system health...'
                },
                guest: {
                    default: 'Loading M-Pesewa...',
                    explore: 'Fetching platform information...',
                    countries: 'Loading country details...',
                    groups: 'Exploring available groups...'
                }
            }
        };

        // Initialize
        this.init();
    }

    /**
     * STRICT M-PESEWA HIERARCHY INITIALIZATION
     * Enforces: Global → Country → Group → Lender/Borrower
     */
    init() {
        this.loadUserContext();
        this.createDOMStructure();
        this.applyBrandColors();
        this.bindEvents();
        this.setupPerformanceMonitoring();
        
        // Log initialization for audit trail
        this.logAudit('LoadingOverlay initialized', {
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * LOAD USER CONTEXT WITH HIERARCHY ENFORCEMENT
     */
    loadUserContext() {
        try {
            // Get user data from localStorage
            const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
            const country = localStorage.getItem('mpesewa_country');
            const group = localStorage.getItem('mpesewa_group');
            
            // Update hierarchy state
            this.config.hierarchy.currentCountry = country;
            this.config.hierarchy.currentGroup = group;
            this.config.hierarchy.userRole = userData.role || 'guest';
            
            // Set currency based on country
            this.config.hierarchy.userCurrency = this.getCountryCurrency(country);
            
            console.log(`M-Pesewa LoadingOverlay: Loaded context for ${this.config.hierarchy.userRole} in ${country || 'global'} ${group ? `(Group: ${group})` : ''}`);
        } catch (error) {
            console.error('M-Pesewa LoadingOverlay: Error loading user context', error);
            this.logError(error);
        }
    }

    /**
     * GET COUNTRY CURRENCY
     */
    getCountryCurrency(country) {
        const currencyMap = {
            'Kenya': 'KSh',
            'Uganda': 'UGX',
            'Tanzania': 'TZS',
            'Rwanda': 'RWF',
            'DRC': 'CDF',
            'Burundi': 'BIF',
            'Nigeria': 'NGN',
            'Ghana': 'GHS',
            'South Sudan': 'SSP',
            'Somalia': 'SOS',
            'South Africa': 'ZAR',
            'Ethiopia': 'ETB'
        };
        
        return currencyMap[country] || 'USD';
    }

    /**
     * CREATE DOM STRUCTURE
     */
    createDOMStructure() {
        // Create overlay
        this.elements.overlay = document.createElement('div');
        this.elements.overlay.className = 'mp-loading-overlay';
        this.elements.overlay.setAttribute('aria-live', 'polite');
        this.elements.overlay.setAttribute('aria-busy', 'true');
        this.elements.overlay.setAttribute('data-mpesewa-component', 'loading-overlay');
        this.elements.overlay.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
        this.elements.overlay.setAttribute('data-role', this.config.hierarchy.userRole);

        // Create container
        this.elements.container = document.createElement('div');
        this.elements.container.className = 'mp-loading-container';

        // Create spinner
        this.elements.spinner = document.createElement('div');
        this.elements.spinner.className = 'mp-loading-spinner';
        this.elements.spinner.innerHTML = this.createSpinnerSVG();

        // Create country badge
        this.elements.countryBadge = document.createElement('div');
        this.elements.countryBadge.className = 'mp-loading-country-badge';
        if (this.config.hierarchy.currentCountry) {
            this.elements.countryBadge.innerHTML = `${this.getCountryFlag(this.config.hierarchy.currentCountry)} ${this.config.hierarchy.currentCountry}`;
        }

        // Create role indicator
        this.elements.roleIndicator = document.createElement('div');
        this.elements.roleIndicator.className = 'mp-loading-role-indicator';
        this.elements.roleIndicator.textContent = this.config.hierarchy.userRole.toUpperCase();

        // Create message container
        this.elements.message = document.createElement('div');
        this.elements.message.className = 'mp-loading-message';
        this.elements.message.textContent = this.getDefaultMessage();

        // Create progress bar container
        this.elements.progressContainer = document.createElement('div');
        this.elements.progressContainer.className = 'mp-loading-progress';

        // Create progress bar
        this.elements.progressBar = document.createElement('div');
        this.elements.progressBar.className = 'mp-loading-progress-bar';
        this.elements.progressBar.setAttribute('role', 'progressbar');
        this.elements.progressBar.setAttribute('aria-valuemin', '0');
        this.elements.progressBar.setAttribute('aria-valuemax', '100');
        this.elements.progressBar.setAttribute('aria-valuenow', '0');

        // Create progress text
        this.elements.progressText = document.createElement('div');
        this.elements.progressText.className = 'mp-loading-progress-text';
        this.elements.progressText.textContent = '0%';

        // Create steps container
        this.elements.stepsContainer = document.createElement('div');
        this.elements.stepsContainer.className = 'mp-loading-steps';

        // Create cancel button
        this.elements.cancelButton = document.createElement('button');
        this.elements.cancelButton.className = 'mp-loading-cancel-button';
        this.elements.cancelButton.textContent = 'Cancel';
        this.elements.cancelButton.setAttribute('aria-label', 'Cancel loading');

        // Create details panel (initially hidden)
        this.elements.detailsPanel = document.createElement('div');
        this.elements.detailsPanel.className = 'mp-loading-details';
        this.elements.detailsPanel.innerHTML = this.createDetailsPanelHTML();

        // Assemble progress container
        this.elements.progressContainer.appendChild(this.elements.progressBar);
        this.elements.progressContainer.appendChild(this.elements.progressText);

        // Assemble container
        this.elements.container.appendChild(this.elements.spinner);
        this.elements.container.appendChild(this.elements.countryBadge);
        this.elements.container.appendChild(this.elements.roleIndicator);
        this.elements.container.appendChild(this.elements.message);
        this.elements.container.appendChild(this.elements.progressContainer);
        this.elements.container.appendChild(this.elements.stepsContainer);
        this.elements.container.appendChild(this.elements.cancelButton);
        this.elements.container.appendChild(this.elements.detailsPanel);

        // Add container to overlay
        this.elements.overlay.appendChild(this.elements.container);

        // Inject CSS
        this.injectStyles();

        // Add to document body
        document.body.appendChild(this.elements.overlay);
    }

    /**
     * CREATE SPINNER SVG
     */
    createSpinnerSVG() {
        return `
            <svg class="mp-spinner-svg" viewBox="0 0 50 50">
                <circle class="mp-spinner-circle" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
            </svg>
        `;
    }

    /**
     * CREATE DETAILS PANEL HTML
     */
    createDetailsPanelHTML() {
        return `
            <div class="mp-loading-details-content">
                <h4>Loading Details</h4>
                <div class="mp-loading-detail-item">
                    <span class="mp-loading-detail-label">Start Time:</span>
                    <span class="mp-loading-detail-value" id="mp-loading-start-time">--:--:--</span>
                </div>
                <div class="mp-loading-detail-item">
                    <span class="mp-loading-detail-label">Elapsed:</span>
                    <span class="mp-loading-detail-value" id="mp-loading-elapsed">00:00</span>
                </div>
                <div class="mp-loading-detail-item">
                    <span class="mp-loading-detail-label">Estimated:</span>
                    <span class="mp-loading-detail-value" id="mp-loading-estimated">--:--</span>
                </div>
                <div class="mp-loading-detail-item">
                    <span class="mp-loading-detail-label">Memory:</span>
                    <span class="mp-loading-detail-value" id="mp-loading-memory">-- MB</span>
                </div>
                <div class="mp-loading-detail-item">
                    <span class="mp-loading-detail-label">Hierarchy:</span>
                    <span class="mp-loading-detail-value" id="mp-loading-hierarchy">${this.config.hierarchy.currentCountry || 'Global'} → ${this.config.hierarchy.userRole}</span>
                </div>
            </div>
        `;
    }

    /**
     * GET DEFAULT MESSAGE BASED ON CONTEXT
     */
    getDefaultMessage() {
        const country = this.config.hierarchy.currentCountry;
        const role = this.config.hierarchy.userRole;
        
        // Try country-specific message
        if (country && this.messages.country[country]) {
            return this.messages.country[country].default;
        }
        
        // Try role-specific message
        if (role && this.messages.role[role]) {
            return this.messages.role[role].default;
        }
        
        // Default global message
        return this.messages.global.default;
    }

    /**
     * GET COUNTRY FLAG EMOJI
     */
    getCountryFlag(country) {
        const flagMap = {
            'Kenya': '🇰🇪',
            'Uganda': '🇺🇬',
            'Tanzania': '🇹🇿',
            'Rwanda': '🇷🇼',
            'DRC': '🇨🇩',
            'Burundi': '🇧🇮',
            'Nigeria': '🇳🇬',
            'Ghana': '🇬🇭',
            'South Sudan': '🇸🇸',
            'Somalia': '🇸🇴',
            'South Africa': '🇿🇦',
            'Ethiopia': '🇪🇹'
        };
        
        return flagMap[country] || '🌍';
    }

    /**
     * APPLY BRAND COLORS
     */
    applyBrandColors() {
        const style = document.createElement('style');
        style.textContent = `
            .mp-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 51, 102, 0.95);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                color: ${this.config.brandColors.pureWhite};
                transition: opacity 0.3s ease;
            }
            
            .mp-loading-overlay--visible {
                display: flex;
                animation: mp-fade-in 0.3s ease;
            }
            
            .mp-loading-container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 40px;
                width: 90%;
                max-width: 500px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                position: relative;
            }
            
            .mp-loading-spinner {
                width: 80px;
                height: 80px;
                margin: 0 auto 30px;
                position: relative;
            }
            
            .mp-spinner-svg {
                width: 100%;
                height: 100%;
                animation: mp-spin 1s linear infinite;
            }
            
            .mp-spinner-circle {
                stroke: ${this.config.brandColors.secondary};
                stroke-linecap: round;
                stroke-dasharray: 90, 150;
                stroke-dashoffset: 0;
                animation: mp-spinner-dash 1.5s ease-in-out infinite;
            }
            
            .mp-loading-country-badge {
                display: inline-block;
                background: ${this.config.brandColors.primary};
                color: ${this.config.brandColors.pureWhite};
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .mp-loading-role-indicator {
                display: inline-block;
                background: ${this.config.brandColors.actionOrange};
                color: ${this.config.brandColors.pureWhite};
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-left: 10px;
                vertical-align: middle;
            }
            
            .mp-loading-message {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 30px;
                line-height: 1.5;
                min-height: 54px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .mp-loading-progress {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                height: 8px;
                border-radius: 4px;
                margin-bottom: 20px;
                overflow: hidden;
                position: relative;
                display: none;
            }
            
            .mp-loading-progress--visible {
                display: block;
            }
            
            .mp-loading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, ${this.config.brandColors.secondary}, ${this.config.brandColors.trustGreen});
                border-radius: 4px;
                width: 0%;
                transition: width 0.3s ease;
                position: relative;
            }
            
            .mp-loading-progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                animation: mp-progress-shine 2s infinite;
            }
            
            .mp-loading-progress-text {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
                font-weight: 600;
                color: ${this.config.brandColors.pureWhite};
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            }
            
            .mp-loading-steps {
                margin-bottom: 20px;
                display: none;
            }
            
            .mp-loading-steps--visible {
                display: block;
            }
            
            .mp-loading-step {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                transition: all 0.3s ease;
            }
            
            .mp-loading-step--active {
                background: rgba(0, 153, 255, 0.1);
                border-color: ${this.config.brandColors.secondary};
                box-shadow: 0 0 0 1px ${this.config.brandColors.secondary};
            }
            
            .mp-loading-step--completed {
                background: rgba(40, 167, 69, 0.1);
                border-color: ${this.config.brandColors.trustGreen};
            }
            
            .mp-loading-step-icon {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;
                flex-shrink: 0;
                font-size: 12px;
            }
            
            .mp-loading-step--active .mp-loading-step-icon {
                background: ${this.config.brandColors.secondary};
                color: ${this.config.brandColors.primary};
            }
            
            .mp-loading-step--completed .mp-loading-step-icon {
                background: ${this.config.brandColors.trustGreen};
                color: ${this.config.brandColors.pureWhite};
            }
            
            .mp-loading-step-text {
                flex: 1;
                text-align: left;
                font-size: 14px;
            }
            
            .mp-loading-cancel-button {
                background: rgba(255, 255, 255, 0.1);
                color: ${this.config.brandColors.pureWhite};
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: none;
            }
            
            .mp-loading-cancel-button--visible {
                display: inline-block;
            }
            
            .mp-loading-cancel-button:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-1px);
            }
            
            .mp-loading-cancel-button:active {
                transform: translateY(0);
            }
            
            .mp-loading-details {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: none;
            }
            
            .mp-loading-details--visible {
                display: block;
            }
            
            .mp-loading-details-content h4 {
                margin: 0 0 15px 0;
                font-size: 14px;
                font-weight: 600;
                color: ${this.config.brandColors.secondary};
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .mp-loading-detail-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 13px;
            }
            
            .mp-loading-detail-label {
                color: rgba(255, 255, 255, 0.7);
            }
            
            .mp-loading-detail-value {
                color: ${this.config.brandColors.pureWhite};
                font-weight: 500;
            }
            
            /* Message animation */
            .mp-loading-message-text {
                animation: mp-fade-in-up 0.5s ease;
            }
            
            @keyframes mp-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes mp-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes mp-spinner-dash {
                0% {
                    stroke-dasharray: 1, 150;
                    stroke-dashoffset: 0;
                }
                50% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -35;
                }
                100% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -124;
                }
            }
            
            @keyframes mp-progress-shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            @keyframes mp-fade-in-up {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Performance indicator */
            .mp-loading-performance {
                position: absolute;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
                font-size: 11px;
            }
            
            .mp-performance-indicator {
                background: rgba(0, 0, 0, 0.3);
                padding: 4px 8px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .mp-performance-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
            }
            
            .mp-performance-dot--good {
                background: ${this.config.brandColors.trustGreen};
            }
            
            .mp-performance-dot--warning {
                background: ${this.config.brandColors.actionOrange};
            }
            
            .mp-performance-dot--poor {
                background: #dc3545;
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .mp-loading-container {
                    padding: 30px 20px;
                    width: 95%;
                }
                
                .mp-loading-spinner {
                    width: 60px;
                    height: 60px;
                    margin-bottom: 20px;
                }
                
                .mp-loading-message {
                    font-size: 16px;
                    min-height: 48px;
                }
                
                .mp-loading-performance {
                    top: 10px;
                    right: 10px;
                    flex-direction: column;
                    gap: 5px;
                }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .mp-spinner-svg {
                    animation: none;
                }
                
                .mp-spinner-circle {
                    animation: none;
                    stroke-dasharray: none;
                }
                
                .mp-loading-progress-bar::after {
                    animation: none;
                }
                
                .mp-loading-message-text {
                    animation: none;
                }
            }
            
            /* Accessibility */
            .mp-loading-cancel-button:focus {
                outline: 2px solid ${this.config.brandColors.secondary};
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * BIND EVENTS
     */
    bindEvents() {
        // Cancel button
        this.elements.cancelButton.addEventListener('click', () => {
            this.cancelLoading();
        });

        // Listen for escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isVisible && this.state.allowCancel) {
                this.cancelLoading();
            }
        });

        // Listen for hierarchy changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'mpesewa_country' || e.key === 'mpesewa_user') {
                this.loadUserContext();
                this.updateContextUI();
            }
        });

        // Performance monitoring
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                this.updatePerformanceMetrics();
            }, 1000);
        }
    }

    /**
     * SETUP PERFORMANCE MONITORING
     */
    setupPerformanceMonitoring() {
        // Create performance indicator
        const performanceIndicator = document.createElement('div');
        performanceIndicator.className = 'mp-loading-performance';
        performanceIndicator.innerHTML = `
            <div class="mp-performance-indicator" id="mp-performance-memory">
                <span class="mp-performance-dot mp-performance-dot--good"></span>
                <span>Memory</span>
            </div>
            <div class="mp-performance-indicator" id="mp-performance-speed">
                <span class="mp-performance-dot mp-performance-dot--good"></span>
                <span>Speed</span>
            </div>
        `;
        
        this.elements.container.appendChild(performanceIndicator);
    }

    /**
     * UPDATE PERFORMANCE METRICS
     */
    updatePerformanceMetrics() {
        if (!this.state.isVisible) return;
        
        // Memory usage
        if (window.performance && window.performance.memory) {
            const memory = window.performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
            const memoryPercent = Math.round((usedMB / totalMB) * 100);
            
            const memoryElement = document.getElementById('mp-performance-memory');
            const memoryDot = memoryElement.querySelector('.mp-performance-dot');
            
            // Update memory details
            const memoryDetail = document.getElementById('mp-loading-memory');
            if (memoryDetail) {
                memoryDetail.textContent = `${usedMB}MB / ${totalMB}MB (${memoryPercent}%)`;
            }
            
            // Update indicator color
            memoryDot.className = 'mp-performance-dot';
            if (memoryPercent > 80) {
                memoryDot.classList.add('mp-performance-dot--poor');
            } else if (memoryPercent > 60) {
                memoryDot.classList.add('mp-performance-dot--warning');
            } else {
                memoryDot.classList.add('mp-performance-dot--good');
            }
        }
        
        // Speed indicator (simulated)
        const speedElement = document.getElementById('mp-performance-speed');
        const speedDot = speedElement.querySelector('.mp-performance-dot');
        
        // Simple speed calculation based on progress rate
        const elapsed = Date.now() - this.state.startTime;
        const progressPerSecond = this.state.progress / (elapsed / 1000);
        
        speedDot.className = 'mp-performance-dot';
        if (progressPerSecond > 10) {
            speedDot.classList.add('mp-performance-dot--good');
            speedElement.querySelector('span:last-child').textContent = 'Fast';
        } else if (progressPerSecond > 5) {
            speedDot.classList.add('mp-performance-dot--warning');
            speedElement.querySelector('span:last-child').textContent = 'Medium';
        } else {
            speedDot.classList.add('mp-performance-dot--poor');
            speedElement.querySelector('span:last-child').textContent = 'Slow';
        }
    }

    /**
     * SHOW LOADING OVERLAY
     */
    show(options = {}) {
        if (this.state.isVisible) return;
        
        // Set state
        this.state.isVisible = true;
        this.state.loadingType = options.type || 'default';
        this.state.progress = options.progress || 0;
        this.state.currentStep = options.currentStep || 0;
        this.state.totalSteps = options.totalSteps || 0;
        this.state.messages = options.messages || [];
        this.state.startTime = Date.now();
        this.state.estimatedTime = options.estimatedTime || null;
        this.state.showProgressBar = options.showProgressBar || false;
        this.state.showCountryBadge = options.showCountryBadge !== false;
        this.state.showRoleIndicator = options.showRoleIndicator !== false;
        this.state.allowCancel = options.allowCancel || false;
        this.state.hierarchyContext = options.hierarchyContext || this.getHierarchyContext();
        
        // Update UI
        this.updateUI();
        
        // Show overlay
        this.elements.overlay.classList.add('mp-loading-overlay--visible');
        
        // Update context
        this.updateContextUI();
        
        // Start progress updates if auto-progress
        if (options.autoProgress) {
            this.startAutoProgress(options.autoProgressDuration || 5000);
        }
        
        // Log for audit
        this.logAudit('Loading overlay shown', {
            type: this.state.loadingType,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            options: options,
            timestamp: new Date().toISOString()
        });
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('mpesewa:loadingStarted', {
            detail: this.state
        }));
        
        return this;
    }

    /**
     * HIDE LOADING OVERLAY
     */
    hide() {
        if (!this.state.isVisible) return;
        
        this.state.isVisible = false;
        this.elements.overlay.classList.remove('mp-loading-overlay--visible');
        
        // Reset auto-progress
        if (this.autoProgressInterval) {
            clearInterval(this.autoProgressInterval);
            this.autoProgressInterval = null;
        }
        
        // Log for audit
        const elapsed = Date.now() - this.state.startTime;
        this.logAudit('Loading overlay hidden', {
            type: this.state.loadingType,
            duration: elapsed,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('mpesewa:loadingFinished', {
            detail: { ...this.state, duration: elapsed }
        }));
        
        return this;
    }

    /**
     * UPDATE UI BASED ON STATE
     */
    updateUI() {
        // Update message
        const message = this.getMessageForContext();
        this.updateMessage(message);
        
        // Update progress bar
        this.updateProgress(this.state.progress);
        
        // Update steps
        if (this.state.totalSteps > 0) {
            this.updateSteps();
        }
        
        // Update visibility of elements
        this.elements.progressContainer.classList.toggle('mp-loading-progress--visible', this.state.showProgressBar);
        this.elements.countryBadge.style.display = this.state.showCountryBadge ? 'inline-block' : 'none';
        this.elements.roleIndicator.style.display = this.state.showRoleIndicator ? 'inline-block' : 'none';
        this.elements.cancelButton.classList.toggle('mp-loading-cancel-button--visible', this.state.allowCancel);
        this.elements.stepsContainer.classList.toggle('mp-loading-steps--visible', this.state.totalSteps > 0);
        
        // Update details panel
        this.updateDetailsPanel();
    }

    /**
     * GET MESSAGE FOR CURRENT CONTEXT
     */
    getMessageForContext() {
        const { loadingType, hierarchyContext } = this.state;
        const country = this.config.hierarchy.currentCountry;
        const role = this.config.hierarchy.userRole;
        
        // Check for custom message from hierarchy context
        if (hierarchyContext && hierarchyContext.message) {
            return hierarchyContext.message;
        }
        
        // Check for specific loading type
        if (loadingType && this.messages.global[loadingType]) {
            return this.messages.global[loadingType];
        }
        
        // Check country-specific messages
        if (country && this.messages.country[country]) {
            if (loadingType && this.messages.country[country][loadingType]) {
                return this.messages.country[country][loadingType];
            }
            return this.messages.country[country].default;
        }
        
        // Check role-specific messages
        if (role && this.messages.role[role]) {
            if (loadingType && this.messages.role[role][loadingType]) {
                return this.messages.role[role][loadingType];
            }
            return this.messages.role[role].default;
        }
        
        return this.messages.global.default;
    }

    /**
     * UPDATE MESSAGE WITH ANIMATION
     */
    updateMessage(message) {
        // Create new message element with animation
        const newMessage = document.createElement('div');
        newMessage.className = 'mp-loading-message-text';
        newMessage.textContent = message;
        
        // Replace old message with animation
        this.elements.message.innerHTML = '';
        this.elements.message.appendChild(newMessage);
    }

    /**
     * UPDATE PROGRESS
     */
    updateProgress(progress) {
        this.state.progress = Math.min(100, Math.max(0, progress));
        
        // Update progress bar
        this.elements.progressBar.style.width = `${this.state.progress}%`;
        this.elements.progressBar.setAttribute('aria-valuenow', this.state.progress);
        
        // Update progress text
        this.elements.progressText.textContent = `${Math.round(this.state.progress)}%`;
        
        // Update estimated time
        this.updateEstimatedTime();
    }

    /**
     * UPDATE ESTIMATED TIME
     */
    updateEstimatedTime() {
        if (!this.state.startTime || this.state.progress <= 0) return;
        
        const elapsed = Date.now() - this.state.startTime;
        const estimatedTotal = (elapsed / this.state.progress) * 100;
        const remaining = estimatedTotal - elapsed;
        
        // Update details panel
        const elapsedElement = document.getElementById('mp-loading-elapsed');
        const estimatedElement = document.getElementById('mp-loading-estimated');
        
        if (elapsedElement) {
            elapsedElement.textContent = this.formatTime(elapsed);
        }
        
        if (estimatedElement) {
            estimatedElement.textContent = this.formatTime(remaining);
        }
    }

    /**
     * FORMAT TIME (MILLISECONDS TO MM:SS)
     */
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * UPDATE STEPS
     */
    updateSteps() {
        this.elements.stepsContainer.innerHTML = '';
        
        for (let i = 0; i < this.state.totalSteps; i++) {
            const step = document.createElement('div');
            step.className = 'mp-loading-step';
            
            if (i < this.state.currentStep) {
                step.classList.add('mp-loading-step--completed');
            } else if (i === this.state.currentStep) {
                step.classList.add('mp-loading-step--active');
            }
            
            const icon = document.createElement('div');
            icon.className = 'mp-loading-step-icon';
            
            if (i < this.state.currentStep) {
                icon.textContent = '✓';
            } else if (i === this.state.currentStep) {
                icon.textContent = '→';
            } else {
                icon.textContent = (i + 1).toString();
            }
            
            const text = document.createElement('div');
            text.className = 'mp-loading-step-text';
            text.textContent = this.state.messages[i] || `Step ${i + 1}`;
            
            step.appendChild(icon);
            step.appendChild(text);
            this.elements.stepsContainer.appendChild(step);
        }
    }

    /**
     * UPDATE DETAILS PANEL
     */
    updateDetailsPanel() {
        // Toggle visibility
        this.elements.detailsPanel.classList.toggle('mp-loading-details--visible', this.state.showProgressBar);
        
        // Update start time
        const startTimeElement = document.getElementById('mp-loading-start-time');
        if (startTimeElement && this.state.startTime) {
            const date = new Date(this.state.startTime);
            startTimeElement.textContent = date.toLocaleTimeString();
        }
        
        // Update hierarchy
        const hierarchyElement = document.getElementById('mp-loading-hierarchy');
        if (hierarchyElement) {
            hierarchyElement.textContent = `${this.config.hierarchy.currentCountry || 'Global'} → ${this.config.hierarchy.userRole}`;
        }
    }

    /**
     * UPDATE CONTEXT UI WHEN COUNTRY/ROLE CHANGES
     */
    updateContextUI() {
        // Update country badge
        if (this.config.hierarchy.currentCountry) {
            this.elements.countryBadge.innerHTML = `${this.getCountryFlag(this.config.hierarchy.currentCountry)} ${this.config.hierarchy.currentCountry}`;
        } else {
            this.elements.countryBadge.innerHTML = '🌍 Global';
        }
        
        // Update role indicator
        this.elements.roleIndicator.textContent = this.config.hierarchy.userRole.toUpperCase();
        
        // Update overlay attributes
        this.elements.overlay.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
        this.elements.overlay.setAttribute('data-role', this.config.hierarchy.userRole);
        
        // Update message if overlay is visible
        if (this.state.isVisible) {
            const message = this.getMessageForContext();
            this.updateMessage(message);
        }
    }

    /**
     * GET HIERARCHY CONTEXT FOR LOADING
     */
    getHierarchyContext() {
        return {
            country: this.config.hierarchy.currentCountry,
            group: this.config.hierarchy.currentGroup,
            role: this.config.hierarchy.userRole,
            currency: this.config.hierarchy.userCurrency,
            message: this.getDefaultMessage()
        };
    }

    /**
     * START AUTO PROGRESS (FOR DEMOS/LOOPS)
     */
    startAutoProgress(duration = 5000) {
        if (this.autoProgressInterval) {
            clearInterval(this.autoProgressInterval);
        }
        
        const startTime = Date.now();
        const endTime = startTime + duration;
        
        this.autoProgressInterval = setInterval(() => {
            const now = Date.now();
            const progress = Math.min(100, ((now - startTime) / duration) * 100);
            
            this.updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(this.autoProgressInterval);
                this.autoProgressInterval = null;
                this.hide();
            }
        }, 100);
    }

    /**
     * CANCEL LOADING
     */
    cancelLoading() {
        if (!this.state.allowCancel) return;
        
        // Dispatch cancel event
        document.dispatchEvent(new CustomEvent('mpesewa:loadingCancelled', {
            detail: {
                ...this.state,
                cancelledAt: Date.now()
            }
        }));
        
        // Hide overlay
        this.hide();
        
        // Log for audit
        this.logAudit('Loading cancelled by user', {
            type: this.state.loadingType,
            progress: this.state.progress,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * PUBLIC API METHODS
     */
    
    // Show with custom message
    showWithMessage(message, options = {}) {
        return this.show({
            ...options,
            hierarchyContext: { message }
        });
    }
    
    // Update progress manually
    setProgress(progress) {
        this.updateProgress(progress);
        return this;
    }
    
    // Update current step
    setStep(step, totalSteps = null) {
        this.state.currentStep = step;
        if (totalSteps !== null) {
            this.state.totalSteps = totalSteps;
        }
        this.updateSteps();
        return this;
    }
    
    // Add custom step
    addStep(message) {
        this.state.messages.push(message);
        this.state.totalSteps = this.state.messages.length;
        this.updateSteps();
        return this;
    }
    
    // Set loading type
    setType(type) {
        this.state.loadingType = type;
        if (this.state.isVisible) {
            this.updateUI();
        }
        return this;
    }
    
    // Enable/disable cancel button
    setCancelable(cancelable) {
        this.state.allowCancel = cancelable;
        if (this.state.isVisible) {
            this.elements.cancelButton.classList.toggle('mp-loading-cancel-button--visible', cancelable);
        }
        return this;
    }
    
    // Show/hide details panel
    setShowDetails(show) {
        this.state.showProgressBar = show;
        if (this.state.isVisible) {
            this.updateUI();
        }
        return this;
    }
    
    // Get current state
    getState() {
        return { ...this.state };
    }
    
    // Check if visible
    isVisible() {
        return this.state.isVisible;
    }
    
    // Destroy component
    destroy() {
        this.hide();
        
        if (this.elements.overlay && this.elements.overlay.parentNode) {
            this.elements.overlay.parentNode.removeChild(this.elements.overlay);
        }
        
        // Remove event listeners
        this.elements.cancelButton?.removeEventListener('click', this.cancelLoading);
        document.removeEventListener('keydown', this.handleEscape);
        
        // Clear state
        this.state = null;
        this.elements = null;
        
        console.log('M-Pesewa LoadingOverlay: Component destroyed');
    }

    /**
     * LOG AUDIT TRAIL
     */
    logAudit(action, data) {
        const auditLog = JSON.parse(localStorage.getItem('mpesewa_audit_log') || '[]');
        auditLog.push({
            component: 'LoadingOverlay',
            action: action,
            ...data,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        if (auditLog.length > 1000) {
            auditLog.splice(0, auditLog.length - 1000);
        }
        
        localStorage.setItem('mpesewa_audit_log', JSON.stringify(auditLog));
    }

    /**
     * LOG ERROR
     */
    logError(error) {
        const errorLog = JSON.parse(localStorage.getItem('mpesewa_error_log') || '[]');
        errorLog.push({
            component: 'LoadingOverlay',
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole
        });
        
        localStorage.setItem('mpesewa_error_log', JSON.stringify(errorLog));
    }

    /**
     * INJECT STYLES
     */
    injectStyles() {
        // Already done in applyBrandColors
    }
}

/**
 * GLOBAL EXPORT FOR MODULE USAGE
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadingOverlay;
} else if (typeof window !== 'undefined') {
    window.MPesewaLoadingOverlay = LoadingOverlay;
}

/**
 * AUTO-INITIALIZE IF IN BROWSER CONTEXT
 */
if (typeof window !== 'undefined' && !window.mpLoadingOverlay) {
    window.mpLoadingOverlay = new LoadingOverlay();
    
    // Expose public API
    window.mpLoadingOverlayAPI = {
        show: (options) => window.mpLoadingOverlay.show(options),
        hide: () => window.mpLoadingOverlay.hide(),
        showWithMessage: (message, options) => window.mpLoadingOverlay.showWithMessage(message, options),
        setProgress: (progress) => window.mpLoadingOverlay.setProgress(progress),
        setStep: (step, totalSteps) => window.mpLoadingOverlay.setStep(step, totalSteps),
        addStep: (message) => window.mpLoadingOverlay.addStep(message),
        setType: (type) => window.mpLoadingOverlay.setType(type),
        setCancelable: (cancelable) => window.mpLoadingOverlay.setCancelable(cancelable),
        setShowDetails: (show) => window.mpLoadingOverlay.setShowDetails(show),
        getState: () => window.mpLoadingOverlay.getState(),
        isVisible: () => window.mpLoadingOverlay.isVisible(),
        destroy: () => window.mpLoadingOverlay.destroy()
    };
}

export default LoadingOverlay;