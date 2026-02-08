/**
 * M-PESEWA ERROR OVERLAY COMPONENT
 * Strict Hierarchy: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 * Component Type: Error States with Hierarchy Context
 * Brand Colors: #003366 (Primary Blue), #0099ff (Secondary Blue), #f37021 (Action Orange), #28a745 (Trust Green)
 * Rules: Country-specific error messages, Role-based error handling, Group isolation enforcement
 */

class ErrorOverlay {
    constructor(config = {}) {
        // Core M-Pesewa Configuration
        this.config = {
            brandColors: {
                primary: '#003366',
                secondary: '#0099ff',
                actionOrange: '#f37021',
                trustGreen: '#28a745',
                neutralLight: '#f8f9fa',
                pureWhite: '#ffffff',
                errorRed: '#dc3545',
                warningYellow: '#ffc107'
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
                userCurrency: 'KSh'
            },
            errorCategories: {
                hierarchy: 'Hierarchy Violation',
                authentication: 'Authentication Error',
                subscription: 'Subscription Error',
                ledger: 'Ledger Error',
                group: 'Group Error',
                country: 'Country Error',
                network: 'Network Error',
                validation: 'Validation Error',
                system: 'System Error',
                payment: 'Payment Error'
            },
            errorCodes: {
                // Hierarchy Errors
                'H001': 'Country isolation violation',
                'H002': 'Group isolation violation',
                'H003': 'Maximum groups exceeded',
                'H004': 'Subscription expired',
                'H005': 'Role mismatch',
                
                // Authentication Errors
                'A001': 'Invalid credentials',
                'A002': 'Session expired',
                'A003': 'Account locked',
                'A004': 'Unauthorized access',
                'A005': 'Two-factor required',
                
                // Subscription Errors
                'S001': 'Subscription required',
                'S002': 'Subscription expired',
                'S003': 'Tier limit exceeded',
                'S004': 'Payment failed',
                'S005': 'Renewal required',
                
                // Network Errors
                'N001': 'Network offline',
                'N002': 'Request timeout',
                'N003': 'Server error',
                'N004': 'API limit exceeded',
                'N005': 'Service unavailable',
                
                // Validation Errors
                'V001': 'Invalid input',
                'V002': 'Missing required field',
                'V003': 'Duplicate entry',
                'V004': 'Invalid format',
                'V005': 'Data mismatch',
                
                // System Errors
                'SY001': 'Database error',
                'SY002': 'File system error',
                'SY003': 'Memory limit exceeded',
                'SY004': 'Process timeout',
                'SY005': 'Configuration error'
            },
            ...config
        };

        // State Management
        this.state = {
            isVisible: false,
            errorType: null, // 'hierarchy', 'auth', 'subscription', 'network', 'validation', 'system'
            errorCode: null,
            errorMessage: null,
            errorDetails: null,
            errorStack: null,
            timestamp: null,
            retryAvailable: false,
            showDetails: false,
            autoDismiss: false,
            dismissTimeout: null,
            hierarchyContext: null,
            suggestedActions: [],
            userActions: []
        };

        // DOM Elements
        this.elements = {
            overlay: null,
            container: null,
            icon: null,
            title: null,
            message: null,
            code: null,
            detailsButton: null,
            detailsPanel: null,
            actionsContainer: null,
            retryButton: null,
            dismissButton: null,
            reportButton: null,
            countryBadge: null,
            roleIndicator: null,
            hierarchyChain: null,
            errorLog: null
        };

        // Error Messages by Context
        this.messages = {
            hierarchy: {
                default: 'Platform hierarchy violation detected',
                'H001': 'Cross-country operation attempted',
                'H002': 'Cross-group lending attempted',
                'H003': 'Maximum group limit exceeded',
                'H004': 'Subscription expired - lending blocked',
                'H005': 'Role access violation'
            },
            authentication: {
                default: 'Authentication error',
                'A001': 'Invalid username or password',
                'A002': 'Your session has expired',
                'A003': 'Account temporarily locked',
                'A004': 'You do not have permission',
                'A005': 'Two-factor authentication required'
            },
            subscription: {
                default: 'Subscription error',
                'S001': 'Subscription required for lending',
                'S002': 'Subscription expired on 28th',
                'S003': 'Tier limit exceeded',
                'S004': 'Payment processing failed',
                'S005': 'Subscription renewal required'
            },
            network: {
                default: 'Network error',
                'N001': 'You are offline',
                'N002': 'Request timeout',
                'N003': 'Server error occurred',
                'N004': 'API rate limit exceeded',
                'N005': 'Service temporarily unavailable'
            },
            system: {
                default: 'System error',
                'SY001': 'Database connection failed',
                'SY002': 'File system error',
                'SY003': 'Memory limit exceeded',
                'SY004': 'Process timeout',
                'SY005': 'Configuration error'
            }
        };

        // Suggested Actions by Error Type
        this.suggestedActions = {
            hierarchy: [
                { label: 'Return to your country', action: 'go_country', icon: '🌍' },
                { label: 'Check group membership', action: 'check_groups', icon: '👥' },
                { label: 'Verify subscription', action: 'check_subscription', icon: '💰' }
            ],
            authentication: [
                { label: 'Sign in again', action: 'reauthenticate', icon: '🔐' },
                { label: 'Reset password', action: 'reset_password', icon: '🔄' },
                { label: 'Contact support', action: 'contact_support', icon: '📞' }
            ],
            subscription: [
                { label: 'Renew subscription', action: 'renew_subscription', icon: '💰' },
                { label: 'Upgrade tier', action: 'upgrade_tier', icon: '📈' },
                { label: 'View subscription', action: 'view_subscription', icon: '👁️' }
            ],
            network: [
                { label: 'Check connection', action: 'check_connection', icon: '📶' },
                { label: 'Retry now', action: 'retry', icon: '🔄' },
                { label: 'Continue offline', action: 'offline_mode', icon: '📴' }
            ],
            system: [
                { label: 'Refresh page', action: 'refresh', icon: '🔄' },
                { label: 'Clear cache', action: 'clear_cache', icon: '🧹' },
                { label: 'Report issue', action: 'report_issue', icon: '📝' }
            ]
        };

        // Initialize
        this.init();
    }

    /**
     * STRICT M-PESEWA HIERARCHY INITIALIZATION
     */
    init() {
        this.loadUserContext();
        this.createDOMStructure();
        this.applyBrandColors();
        this.bindEvents();
        this.setupErrorTracking();
        
        // Log initialization
        this.logAudit('ErrorOverlay initialized', {
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * LOAD USER CONTEXT
     */
    loadUserContext() {
        try {
            const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
            const country = localStorage.getItem('mpesewa_country');
            const group = localStorage.getItem('mpesewa_group');
            
            this.config.hierarchy.currentCountry = country;
            this.config.hierarchy.currentGroup = group;
            this.config.hierarchy.userRole = userData.role || 'guest';
            this.config.hierarchy.userCurrency = this.getCountryCurrency(country);
            
            console.log(`M-Pesewa ErrorOverlay: Loaded context for ${this.config.hierarchy.userRole} in ${country || 'global'} ${group ? `(Group: ${group})` : ''}`);
        } catch (error) {
            console.error('M-Pesewa ErrorOverlay: Error loading context', error);
            this.logError(error);
        }
    }

    /**
     * GET COUNTRY CURRENCY
     */
    getCountryCurrency(country) {
        const currencyMap = {
            'Kenya': 'KSh', 'Uganda': 'UGX', 'Tanzania': 'TZS', 'Rwanda': 'RWF',
            'DRC': 'CDF', 'Burundi': 'BIF', 'Nigeria': 'NGN', 'Ghana': 'GHS',
            'South Sudan': 'SSP', 'Somalia': 'SOS', 'South Africa': 'ZAR', 'Ethiopia': 'ETB'
        };
        return currencyMap[country] || 'USD';
    }

    /**
     * CREATE DOM STRUCTURE
     */
    createDOMStructure() {
        // Create overlay
        this.elements.overlay = document.createElement('div');
        this.elements.overlay.className = 'mp-error-overlay';
        this.elements.overlay.setAttribute('role', 'alert');
        this.elements.overlay.setAttribute('aria-live', 'assertive');
        this.elements.overlay.setAttribute('data-mpesewa-component', 'error-overlay');
        this.elements.overlay.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
        this.elements.overlay.setAttribute('data-role', this.config.hierarchy.userRole);

        // Create container
        this.elements.container = document.createElement('div');
        this.elements.container.className = 'mp-error-container';

        // Create header
        const header = document.createElement('div');
        header.className = 'mp-error-header';

        // Create icon
        this.elements.icon = document.createElement('div');
        this.elements.icon.className = 'mp-error-icon';
        this.elements.icon.innerHTML = '⚠️';

        // Create title
        this.elements.title = document.createElement('h2');
        this.elements.title.className = 'mp-error-title';
        this.elements.title.textContent = 'Error';

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'mp-error-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close error');
        closeButton.setAttribute('title', 'Close');

        // Assemble header
        header.appendChild(this.elements.icon);
        header.appendChild(this.elements.title);
        header.appendChild(closeButton);

        // Create country badge
        this.elements.countryBadge = document.createElement('div');
        this.elements.countryBadge.className = 'mp-error-country-badge';
        if (this.config.hierarchy.currentCountry) {
            this.elements.countryBadge.innerHTML = `${this.getCountryFlag(this.config.hierarchy.currentCountry)} ${this.config.hierarchy.currentCountry}`;
        }

        // Create role indicator
        this.elements.roleIndicator = document.createElement('div');
        this.elements.roleIndicator.className = 'mp-error-role-indicator';
        this.elements.roleIndicator.textContent = this.config.hierarchy.userRole.toUpperCase();

        // Create hierarchy chain
        this.elements.hierarchyChain = document.createElement('div');
        this.elements.hierarchyChain.className = 'mp-error-hierarchy';
        this.elements.hierarchyChain.innerHTML = this.createHierarchyChainHTML();

        // Create error code
        this.elements.code = document.createElement('div');
        this.elements.code.className = 'mp-error-code';
        this.elements.code.textContent = 'Error Code: --';

        // Create message
        this.elements.message = document.createElement('div');
        this.elements.message.className = 'mp-error-message';
        this.elements.message.textContent = 'An error occurred';

        // Create details button
        this.elements.detailsButton = document.createElement('button');
        this.elements.detailsButton.className = 'mp-error-details-button';
        this.elements.detailsButton.innerHTML = 'Show Details <span class="mp-error-details-arrow">▼</span>';
        this.elements.detailsButton.setAttribute('aria-expanded', 'false');

        // Create details panel
        this.elements.detailsPanel = document.createElement('div');
        this.elements.detailsPanel.className = 'mp-error-details';
        this.elements.detailsPanel.innerHTML = this.createDetailsPanelHTML();

        // Create error log
        this.elements.errorLog = document.createElement('div');
        this.elements.errorLog.className = 'mp-error-log';
        this.elements.errorLog.innerHTML = this.createErrorLogHTML();

        // Create actions container
        this.elements.actionsContainer = document.createElement('div');
        this.elements.actionsContainer.className = 'mp-error-actions';

        // Create retry button
        this.elements.retryButton = document.createElement('button');
        this.elements.retryButton.className = 'mp-error-retry-button';
        this.elements.retryButton.textContent = 'Retry';
        this.elements.retryButton.setAttribute('data-action', 'retry');

        // Create dismiss button
        this.elements.dismissButton = document.createElement('button');
        this.elements.dismissButton.className = 'mp-error-dismiss-button';
        this.elements.dismissButton.textContent = 'Dismiss';
        this.elements.dismissButton.setAttribute('data-action', 'dismiss');

        // Create report button
        this.elements.reportButton = document.createElement('button');
        this.elements.reportButton.className = 'mp-error-report-button';
        this.elements.reportButton.textContent = 'Report Issue';
        this.elements.reportButton.setAttribute('data-action', 'report');

        // Assemble actions
        this.elements.actionsContainer.appendChild(this.elements.retryButton);
        this.elements.actionsContainer.appendChild(this.elements.dismissButton);
        this.elements.actionsContainer.appendChild(this.elements.reportButton);

        // Create suggested actions container
        this.elements.suggestedActions = document.createElement('div');
        this.elements.suggestedActions.className = 'mp-error-suggested-actions';
        this.elements.suggestedActions.innerHTML = '<h4>Suggested Actions</h4>';

        // Assemble container
        this.elements.container.appendChild(header);
        this.elements.container.appendChild(this.elements.countryBadge);
        this.elements.container.appendChild(this.elements.roleIndicator);
        this.elements.container.appendChild(this.elements.hierarchyChain);
        this.elements.container.appendChild(this.elements.code);
        this.elements.container.appendChild(this.elements.message);
        this.elements.container.appendChild(this.elements.detailsButton);
        this.elements.container.appendChild(this.elements.detailsPanel);
        this.elements.container.appendChild(this.elements.errorLog);
        this.elements.container.appendChild(this.elements.suggestedActions);
        this.elements.container.appendChild(this.elements.actionsContainer);

        // Add container to overlay
        this.elements.overlay.appendChild(this.elements.container);

        // Inject CSS
        this.injectStyles();

        // Add to document
        document.body.appendChild(this.elements.overlay);
    }

    /**
     * CREATE HIERARCHY CHAIN HTML
     */
    createHierarchyChainHTML() {
        const country = this.config.hierarchy.currentCountry || 'Global';
        const group = this.config.hierarchy.currentGroup || 'No Group';
        const role = this.config.hierarchy.userRole || 'Guest';
        
        return `
            <div class="mp-hierarchy-chain">
                <span class="mp-hierarchy-level">Global</span>
                <span class="mp-hierarchy-arrow">→</span>
                <span class="mp-hierarchy-level">${country}</span>
                <span class="mp-hierarchy-arrow">→</span>
                <span class="mp-hierarchy-level">${group}</span>
                <span class="mp-hierarchy-arrow">→</span>
                <span class="mp-hierarchy-level">${role}</span>
            </div>
        `;
    }

    /**
     * CREATE DETAILS PANEL HTML
     */
    createDetailsPanelHTML() {
        return `
            <div class="mp-error-details-content">
                <div class="mp-error-detail-item">
                    <span class="mp-error-detail-label">Timestamp:</span>
                    <span class="mp-error-detail-value" id="mp-error-timestamp">--:--:--</span>
                </div>
                <div class="mp-error-detail-item">
                    <span class="mp-error-detail-label">Error Type:</span>
                    <span class="mp-error-detail-value" id="mp-error-type">--</span>
                </div>
                <div class="mp-error-detail-item">
                    <span class="mp-error-detail-label">Country:</span>
                    <span class="mp-error-detail-value" id="mp-error-country">${this.config.hierarchy.currentCountry || 'Global'}</span>
                </div>
                <div class="mp-error-detail-item">
                    <span class="mp-error-detail-label">Role:</span>
                    <span class="mp-error-detail-value" id="mp-error-role">${this.config.hierarchy.userRole}</span>
                </div>
                <div class="mp-error-detail-item">
                    <span class="mp-error-detail-label">Group:</span>
                    <span class="mp-error-detail-value" id="mp-error-group">${this.config.hierarchy.currentGroup || 'None'}</span>
                </div>
                <div class="mp-error-detail-item">
                    <span class="mp-error-detail-label">URL:</span>
                    <span class="mp-error-detail-value" id="mp-error-url">${window.location.href}</span>
                </div>
                <div class="mp-error-detail-item">
                    <span class="mp-error-detail-label">User Agent:</span>
                    <span class="mp-error-detail-value" id="mp-error-user-agent">${navigator.userAgent.substring(0, 50)}...</span>
                </div>
            </div>
        `;
    }

    /**
     * CREATE ERROR LOG HTML
     */
    createErrorLogHTML() {
        return `
            <div class="mp-error-log-content">
                <h4>Recent Errors</h4>
                <div class="mp-error-log-entries" id="mp-error-log-entries">
                    <div class="mp-error-log-empty">No recent errors</div>
                </div>
            </div>
        `;
    }

    /**
     * GET COUNTRY FLAG
     */
    getCountryFlag(country) {
        const flagMap = {
            'Kenya': '🇰🇪', 'Uganda': '🇺🇬', 'Tanzania': '🇹🇿', 'Rwanda': '🇷🇼',
            'DRC': '🇨🇩', 'Burundi': '🇧🇮', 'Nigeria': '🇳🇬', 'Ghana': '🇬🇭',
            'South Sudan': '🇸🇸', 'Somalia': '🇸🇴', 'South Africa': '🇿🇦', 'Ethiopia': '🇪🇹'
        };
        return flagMap[country] || '🌍';
    }

    /**
     * APPLY BRAND COLORS
     */
    applyBrandColors() {
        const style = document.createElement('style');
        style.textContent = `
            .mp-error-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                z-index: 10001;
                display: none;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                color: ${this.config.brandColors.pureWhite};
                padding: 20px;
                animation: mp-error-fade-in 0.3s ease;
            }
            
            .mp-error-overlay--visible {
                display: flex;
            }
            
            .mp-error-container {
                background: ${this.config.brandColors.primary};
                border-radius: 16px;
                padding: 30px;
                width: 100%;
                max-width: 700px;
                max-height: 90vh;
                overflow-y: auto;
                border: 2px solid ${this.config.brandColors.errorRed};
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                position: relative;
            }
            
            .mp-error-header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .mp-error-icon {
                font-size: 32px;
                margin-right: 15px;
                animation: mp-error-pulse 2s infinite;
            }
            
            .mp-error-title {
                flex: 1;
                margin: 0;
                font-size: 24px;
                font-weight: 700;
                color: ${this.config.brandColors.pureWhite};
            }
            
            .mp-error-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: ${this.config.brandColors.pureWhite};
                font-size: 28px;
                line-height: 1;
                cursor: pointer;
                padding: 4px 12px;
                border-radius: 6px;
                transition: all 0.2s ease;
            }
            
            .mp-error-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .mp-error-close:active {
                transform: scale(0.95);
            }
            
            .mp-error-country-badge {
                display: inline-block;
                background: ${this.config.brandColors.secondary};
                color: ${this.config.brandColors.pureWhite};
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
            
            .mp-error-role-indicator {
                display: inline-block;
                background: ${this.config.brandColors.actionOrange};
                color: ${this.config.brandColors.pureWhite};
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                margin-left: 8px;
                vertical-align: middle;
            }
            
            .mp-error-hierarchy {
                margin-bottom: 20px;
                padding: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                font-size: 13px;
            }
            
            .mp-hierarchy-chain {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .mp-hierarchy-level {
                background: rgba(255, 255, 255, 0.1);
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
            }
            
            .mp-hierarchy-arrow {
                color: ${this.config.brandColors.secondary};
                font-weight: 700;
            }
            
            .mp-error-code {
                background: ${this.config.brandColors.errorRed};
                color: ${this.config.brandColors.pureWhite};
                padding: 8px 16px;
                border-radius: 8px;
                font-family: monospace;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 15px;
                display: inline-block;
                box-shadow: 0 2px 8px rgba(220, 53, 69, 0.4);
            }
            
            .mp-error-message {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border-left: 4px solid ${this.config.brandColors.errorRed};
            }
            
            .mp-error-details-button {
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: ${this.config.brandColors.pureWhite};
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 20px;
                width: 100%;
                text-align: left;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .mp-error-details-button:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.5);
            }
            
            .mp-error-details-button[aria-expanded="true"] .mp-error-details-arrow {
                transform: rotate(180deg);
            }
            
            .mp-error-details-arrow {
                transition: transform 0.3s ease;
            }
            
            .mp-error-details {
                display: none;
                margin-bottom: 20px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                font-size: 13px;
            }
            
            .mp-error-details--visible {
                display: block;
                animation: mp-error-slide-down 0.3s ease;
            }
            
            .mp-error-details-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }
            
            .mp-error-detail-item {
                display: flex;
                flex-direction: column;
            }
            
            .mp-error-detail-label {
                color: rgba(255, 255, 255, 0.7);
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 4px;
            }
            
            .mp-error-detail-value {
                color: ${this.config.brandColors.pureWhite};
                font-weight: 500;
                font-family: monospace;
                word-break: break-all;
            }
            
            .mp-error-log {
                display: none;
                margin-bottom: 20px;
            }
            
            .mp-error-log--visible {
                display: block;
            }
            
            .mp-error-log-content {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                padding: 20px;
            }
            
            .mp-error-log-content h4 {
                margin: 0 0 15px 0;
                color: ${this.config.brandColors.secondary};
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .mp-error-log-entries {
                max-height: 200px;
                overflow-y: auto;
            }
            
            .mp-error-log-empty {
                text-align: center;
                color: rgba(255, 255, 255, 0.5);
                font-style: italic;
                padding: 20px;
            }
            
            .mp-error-log-entry {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 8px;
                border-left: 3px solid ${this.config.brandColors.errorRed};
                font-size: 12px;
            }
            
            .mp-error-log-entry--warning {
                border-left-color: ${this.config.brandColors.warningYellow};
            }
            
            .mp-error-log-entry--info {
                border-left-color: ${this.config.brandColors.secondary};
            }
            
            .mp-error-log-time {
                color: rgba(255, 255, 255, 0.7);
                font-size: 10px;
                margin-bottom: 4px;
            }
            
            .mp-error-log-message {
                color: ${this.config.brandColors.pureWhite};
                font-weight: 500;
            }
            
            .mp-error-suggested-actions {
                margin-bottom: 25px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .mp-error-suggested-actions h4 {
                margin: 0 0 15px 0;
                color: ${this.config.brandColors.secondary};
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .mp-error-suggested-actions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 12px;
            }
            
            .mp-error-suggested-action {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .mp-error-suggested-action:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-2px);
                border-color: ${this.config.brandColors.secondary};
            }
            
            .mp-error-suggested-action-icon {
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .mp-error-suggested-action-label {
                flex: 1;
                font-weight: 500;
                font-size: 14px;
            }
            
            .mp-error-actions {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }
            
            .mp-error-retry-button {
                background: ${this.config.brandColors.trustGreen};
                color: ${this.config.brandColors.pureWhite};
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                flex: 1;
                min-width: 120px;
            }
            
            .mp-error-retry-button:hover {
                background: #218838;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
            }
            
            .mp-error-retry-button:active {
                transform: translateY(0);
            }
            
            .mp-error-dismiss-button {
                background: transparent;
                color: ${this.config.brandColors.pureWhite};
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                flex: 1;
                min-width: 120px;
            }
            
            .mp-error-dismiss-button:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-1px);
            }
            
            .mp-error-report-button {
                background: ${this.config.brandColors.actionOrange};
                color: ${this.config.brandColors.pureWhite};
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                flex: 1;
                min-width: 120px;
            }
            
            .mp-error-report-button:hover {
                background: #e65c00;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(243, 112, 33, 0.4);
            }
            
            .mp-error-retry-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            @keyframes mp-error-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes mp-error-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            @keyframes mp-error-slide-down {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Error type specific styles */
            .mp-error-overlay--hierarchy {
                border-color: ${this.config.brandColors.secondary};
            }
            
            .mp-error-overlay--hierarchy .mp-error-icon {
                color: ${this.config.brandColors.secondary};
            }
            
            .mp-error-overlay--authentication {
                border-color: ${this.config.brandColors.actionOrange};
            }
            
            .mp-error-overlay--authentication .mp-error-icon {
                color: ${this.config.brandColors.actionOrange};
            }
            
            .mp-error-overlay--subscription {
                border-color: ${this.config.brandColors.trustGreen};
            }
            
            .mp-error-overlay--subscription .mp-error-icon {
                color: ${this.config.brandColors.trustGreen};
            }
            
            .mp-error-overlay--network {
                border-color: ${this.config.brandColors.warningYellow};
            }
            
            .mp-error-overlay--network .mp-error-icon {
                color: ${this.config.brandColors.warningYellow};
            }
            
            .mp-error-overlay--system {
                border-color: ${this.config.brandColors.errorRed};
            }
            
            .mp-error-overlay--system .mp-error-icon {
                color: ${this.config.brandColors.errorRed};
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .mp-error-container {
                    padding: 20px;
                    max-height: 95vh;
                }
                
                .mp-error-details-content {
                    grid-template-columns: 1fr;
                }
                
                .mp-error-actions {
                    flex-direction: column;
                }
                
                .mp-error-retry-button,
                .mp-error-dismiss-button,
                .mp-error-report-button {
                    width: 100%;
                }
                
                .mp-error-suggested-actions-grid {
                    grid-template-columns: 1fr;
                }
                
                .mp-hierarchy-chain {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 4px;
                }
                
                .mp-hierarchy-arrow {
                    display: none;
                }
            }
            
            /* Accessibility */
            .mp-error-close:focus,
            .mp-error-details-button:focus,
            .mp-error-retry-button:focus,
            .mp-error-dismiss-button:focus,
            .mp-error-report-button:focus,
            .mp-error-suggested-action:focus {
                outline: 2px solid ${this.config.brandColors.secondary};
                outline-offset: 2px;
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .mp-error-overlay {
                    animation: none;
                }
                
                .mp-error-icon {
                    animation: none;
                }
                
                .mp-error-details--visible {
                    animation: none;
                }
                
                .mp-error-retry-button:hover,
                .mp-error-dismiss-button:hover,
                .mp-error-report-button:hover,
                .mp-error-suggested-action:hover {
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * BIND EVENTS
     */
    bindEvents() {
        // Close button
        this.elements.container.querySelector('.mp-error-close').addEventListener('click', () => {
            this.hide();
        });

        // Details button
        this.elements.detailsButton.addEventListener('click', () => {
            this.toggleDetails();
        });

        // Retry button
        this.elements.retryButton.addEventListener('click', () => {
            this.retry();
        });

        // Dismiss button
        this.elements.dismissButton.addEventListener('click', () => {
            this.dismiss();
        });

        // Report button
        this.elements.reportButton.addEventListener('click', () => {
            this.reportIssue();
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isVisible) {
                this.hide();
            }
        });

        // Listen for hierarchy changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'mpesewa_country' || e.key === 'mpesewa_user') {
                this.loadUserContext();
                this.updateContextUI();
            }
        });

        // Global error handler
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.handlePromiseRejection(e);
        });
    }

    /**
     * SETUP ERROR TRACKING
     */
    setupErrorTracking() {
        // Load error log from localStorage
        this.loadErrorLog();
        
        // Set up periodic save
        setInterval(() => {
            this.saveErrorLog();
        }, 30000);
    }

    /**
     * LOAD ERROR LOG
     */
    loadErrorLog() {
        try {
            const log = JSON.parse(localStorage.getItem('mpesewa_error_log') || '[]');
            this.errorLog = log.slice(-10); // Keep last 10 entries
        } catch (error) {
            this.errorLog = [];
        }
    }

    /**
     * SAVE ERROR LOG
     */
    saveErrorLog() {
        try {
            localStorage.setItem('mpesewa_error_log', JSON.stringify(this.errorLog));
        } catch (error) {
            console.error('M-Pesewa ErrorOverlay: Failed to save error log', error);
        }
    }

    /**
     * SHOW ERROR OVERLAY
     */
    show(errorData = {}) {
        if (this.state.isVisible) return;
        
        // Set state
        this.state.isVisible = true;
        this.state.errorType = errorData.type || 'system';
        this.state.errorCode = errorData.code || 'SY001';
        this.state.errorMessage = errorData.message || this.getMessageForError(errorData.type, errorData.code);
        this.state.errorDetails = errorData.details || null;
        this.state.errorStack = errorData.stack || null;
        this.state.timestamp = new Date().toISOString();
        this.state.retryAvailable = errorData.retry !== false;
        this.state.showDetails = false;
        this.state.autoDismiss = errorData.autoDismiss || false;
        this.state.dismissTimeout = errorData.dismissTimeout || 5000;
        this.state.hierarchyContext = this.getHierarchyContext();
        this.state.suggestedActions = this.getSuggestedActions(errorData.type);
        this.state.userActions = errorData.actions || [];

        // Update UI
        this.updateUI();

        // Show overlay
        this.elements.overlay.classList.add('mp-error-overlay--visible');
        this.elements.overlay.classList.add(`mp-error-overlay--${this.state.errorType}`);

        // Add to error log
        this.addToErrorLog(errorData);

        // Auto dismiss if configured
        if (this.state.autoDismiss) {
            setTimeout(() => {
                this.hide();
            }, this.state.dismissTimeout);
        }

        // Log for audit
        this.logAudit('Error overlay shown', {
            type: this.state.errorType,
            code: this.state.errorCode,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: this.state.timestamp
        });

        // Dispatch event
        document.dispatchEvent(new CustomEvent('mpesewa:errorShown', {
            detail: this.state
        }));

        return this;
    }

    /**
     * HIDE ERROR OVERLAY
     */
    hide() {
        if (!this.state.isVisible) return;
        
        this.state.isVisible = false;
        this.elements.overlay.classList.remove('mp-error-overlay--visible');
        this.elements.overlay.classList.remove(`mp-error-overlay--${this.state.errorType}`);
        
        // Log for audit
        this.logAudit('Error overlay hidden', {
            type: this.state.errorType,
            code: this.state.errorCode,
            duration: Date.now() - new Date(this.state.timestamp).getTime(),
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole
        });

        // Dispatch event
        document.dispatchEvent(new CustomEvent('mpesewa:errorHidden', {
            detail: this.state
        }));

        return this;
    }

    /**
     * UPDATE UI
     */
    updateUI() {
        // Update title based on error type
        const errorTypeTitle = this.config.errorCategories[this.state.errorType] || 'Error';
        this.elements.title.textContent = errorTypeTitle;

        // Update icon based on error type
        this.elements.icon.innerHTML = this.getIconForErrorType(this.state.errorType);

        // Update error code
        this.elements.code.textContent = `Error Code: ${this.state.errorCode}`;

        // Update message
        this.elements.message.textContent = this.state.errorMessage;

        // Update details panel
        this.updateDetailsPanel();

        // Update suggested actions
        this.updateSuggestedActions();

        // Update error log display
        this.updateErrorLogDisplay();

        // Update button states
        this.elements.retryButton.style.display = this.state.retryAvailable ? 'block' : 'none';
        this.elements.retryButton.disabled = !this.state.retryAvailable;

        // Hide details panel
        this.elements.detailsPanel.classList.remove('mp-error-details--visible');
        this.elements.detailsButton.setAttribute('aria-expanded', 'false');
    }

    /**
     * GET MESSAGE FOR ERROR
     */
    getMessageForError(type, code) {
        if (this.messages[type] && this.messages[type][code]) {
            return this.messages[type][code];
        }
        
        if (this.messages[type]) {
            return this.messages[type].default;
        }
        
        return 'An unexpected error occurred';
    }

    /**
     * GET ICON FOR ERROR TYPE
     */
    getIconForErrorType(type) {
        const icons = {
            hierarchy: '🌍',
            authentication: '🔐',
            subscription: '💰',
            network: '📶',
            system: '⚙️',
            validation: '📝',
            ledger: '📒',
            group: '👥',
            country: '🇰🇪',
            payment: '💳'
        };
        
        return icons[type] || '⚠️';
    }

    /**
     * UPDATE DETAILS PANEL
     */
    updateDetailsPanel() {
        // Update timestamp
        const timestampElement = document.getElementById('mp-error-timestamp');
        if (timestampElement) {
            const date = new Date(this.state.timestamp);
            timestampElement.textContent = date.toLocaleString();
        }

        // Update error type
        const typeElement = document.getElementById('mp-error-type');
        if (typeElement) {
            typeElement.textContent = this.state.errorType;
        }

        // Update country
        const countryElement = document.getElementById('mp-error-country');
        if (countryElement) {
            countryElement.textContent = this.config.hierarchy.currentCountry || 'Global';
        }

        // Update role
        const roleElement = document.getElementById('mp-error-role');
        if (roleElement) {
            roleElement.textContent = this.config.hierarchy.userRole;
        }

        // Update group
        const groupElement = document.getElementById('mp-error-group');
        if (groupElement) {
            groupElement.textContent = this.config.hierarchy.currentGroup || 'None';
        }

        // Update URL
        const urlElement = document.getElementById('mp-error-url');
        if (urlElement) {
            urlElement.textContent = window.location.href;
        }

        // Update user agent
        const userAgentElement = document.getElementById('mp-error-user-agent');
        if (userAgentElement) {
            userAgentElement.textContent = navigator.userAgent;
        }
    }

    /**
     * UPDATE SUGGESTED ACTIONS
     */
    updateSuggestedActions() {
        this.elements.suggestedActions.innerHTML = '<h4>Suggested Actions</h4>';
        
        const actionsGrid = document.createElement('div');
        actionsGrid.className = 'mp-error-suggested-actions-grid';
        
        // Add suggested actions
        this.state.suggestedActions.forEach(action => {
            const actionElement = document.createElement('div');
            actionElement.className = 'mp-error-suggested-action';
            actionElement.setAttribute('data-action', action.action);
            actionElement.innerHTML = `
                <span class="mp-error-suggested-action-icon">${action.icon}</span>
                <span class="mp-error-suggested-action-label">${action.label}</span>
            `;
            
            actionElement.addEventListener('click', () => {
                this.handleSuggestedAction(action.action);
            });
            
            actionsGrid.appendChild(actionElement);
        });
        
        // Add user-specific actions
        this.state.userActions.forEach(action => {
            const actionElement = document.createElement('div');
            actionElement.className = 'mp-error-suggested-action';
            actionElement.setAttribute('data-action', action.action);
            actionElement.innerHTML = `
                <span class="mp-error-suggested-action-icon">${action.icon || '⚡'}</span>
                <span class="mp-error-suggested-action-label">${action.label}</span>
            `;
            
            actionElement.addEventListener('click', () => {
                if (action.handler) {
                    action.handler();
                } else {
                    this.handleSuggestedAction(action.action);
                }
            });
            
            actionsGrid.appendChild(actionElement);
        });
        
        this.elements.suggestedActions.appendChild(actionsGrid);
    }

    /**
     * UPDATE ERROR LOG DISPLAY
     */
    updateErrorLogDisplay() {
        const entriesContainer = document.getElementById('mp-error-log-entries');
        if (!entriesContainer) return;
        
        entriesContainer.innerHTML = '';
        
        if (this.errorLog.length === 0) {
            entriesContainer.innerHTML = '<div class="mp-error-log-empty">No recent errors</div>';
            return;
        }
        
        this.errorLog.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = `mp-error-log-entry mp-error-log-entry--${entry.type || 'error'}`;
            
            const time = new Date(entry.timestamp).toLocaleTimeString();
            entryElement.innerHTML = `
                <div class="mp-error-log-time">${time}</div>
                <div class="mp-error-log-message">${entry.message}</div>
            `;
            
            entriesContainer.appendChild(entryElement);
        });
    }

    /**
     * UPDATE CONTEXT UI
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
        
        // Update hierarchy chain
        this.elements.hierarchyChain.innerHTML = this.createHierarchyChainHTML();
        
        // Update overlay attributes
        this.elements.overlay.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
        this.elements.overlay.setAttribute('data-role', this.config.hierarchy.userRole);
    }

    /**
     * GET HIERARCHY CONTEXT
     */
    getHierarchyContext() {
        return {
            country: this.config.hierarchy.currentCountry,
            group: this.config.hierarchy.currentGroup,
            role: this.config.hierarchy.userRole,
            currency: this.config.hierarchy.userCurrency,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * GET SUGGESTED ACTIONS
     */
    getSuggestedActions(errorType) {
        return this.suggestedActions[errorType] || this.suggestedActions.system;
    }

    /**
     * TOGGLE DETAILS PANEL
     */
    toggleDetails() {
        this.state.showDetails = !this.state.showDetails;
        
        if (this.state.showDetails) {
            this.elements.detailsPanel.classList.add('mp-error-details--visible');
            this.elements.detailsButton.setAttribute('aria-expanded', 'true');
            this.elements.errorLog.classList.add('mp-error-log--visible');
        } else {
            this.elements.detailsPanel.classList.remove('mp-error-details--visible');
            this.elements.detailsButton.setAttribute('aria-expanded', 'false');
            this.elements.errorLog.classList.remove('mp-error-log--visible');
        }
    }

    /**
     * RETRY ACTION
     */
    retry() {
        if (!this.state.retryAvailable) return;
        
        // Dispatch retry event
        document.dispatchEvent(new CustomEvent('mpesewa:errorRetry', {
            detail: this.state
        }));
        
        // Hide overlay
        this.hide();
        
        // Log for audit
        this.logAudit('Error retry initiated', {
            type: this.state.errorType,
            code: this.state.errorCode,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole
        });
    }

    /**
     * DISMISS ERROR
     */
    dismiss() {
        this.hide();
        
        // Log for audit
        this.logAudit('Error dismissed by user', {
            type: this.state.errorType,
            code: this.state.errorCode,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole
        });
    }

    /**
     * REPORT ISSUE
     */
    reportIssue() {
        const reportData = {
            errorType: this.state.errorType,
            errorCode: this.state.errorCode,
            errorMessage: this.state.errorMessage,
            errorDetails: this.state.errorDetails,
            hierarchyContext: this.state.hierarchyContext,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: this.state.timestamp
        };
        
        // Save to localStorage for admin review
        try {
            const reports = JSON.parse(localStorage.getItem('mpesewa_error_reports') || '[]');
            reports.push(reportData);
            localStorage.setItem('mpesewa_error_reports', JSON.stringify(reports.slice(-50)));
        } catch (error) {
            console.error('M-Pesewa ErrorOverlay: Failed to save error report', error);
        }
        
        // Show confirmation
        this.show({
            type: 'system',
            code: 'SY005',
            message: 'Error report submitted successfully',
            autoDismiss: true,
            dismissTimeout: 3000
        });
        
        // Log for audit
        this.logAudit('Error reported by user', {
            type: this.state.errorType,
            code: this.state.errorCode,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole
        });
    }

    /**
     * HANDLE SUGGESTED ACTION
     */
    handleSuggestedAction(action) {
        switch (action) {
            case 'go_country':
                window.location.href = '/countries/index.html';
                break;
            case 'check_groups':
                window.location.href = '/groups/index.html';
                break;
            case 'check_subscription':
                window.location.href = '/subscription/current.html';
                break;
            case 'reauthenticate':
                window.location.href = '/auth/login.html';
                break;
            case 'reset_password':
                window.location.href = '/auth/forgot.html';
                break;
            case 'contact_support':
                window.location.href = '/contact.html';
                break;
            case 'renew_subscription':
                window.location.href = '/subscription/renew.html';
                break;
            case 'upgrade_tier':
                window.location.href = '/subscription/upgrade.html';
                break;
            case 'view_subscription':
                window.location.href = '/subscription/current.html';
                break;
            case 'check_connection':
                this.checkConnection();
                break;
            case 'retry':
                this.retry();
                break;
            case 'offline_mode':
                this.enableOfflineMode();
                break;
            case 'refresh':
                window.location.reload();
                break;
            case 'clear_cache':
                this.clearCache();
                break;
            case 'report_issue':
                this.reportIssue();
                break;
        }
    }

    /**
     * CHECK CONNECTION
     */
    checkConnection() {
        const online = navigator.onLine;
        
        if (online) {
            this.show({
                type: 'network',
                code: 'N001',
                message: 'You are online. Retrying operation...',
                autoDismiss: true,
                dismissTimeout: 2000
            });
            
            setTimeout(() => {
                this.retry();
            }, 2000);
        } else {
            this.show({
                type: 'network',
                code: 'N001',
                message: 'You are offline. Please check your internet connection.',
                retry: false
            });
        }
    }

    /**
     * ENABLE OFFLINE MODE
     */
    enableOfflineMode() {
        // This would enable offline features in a real app
        localStorage.setItem('mpesewa_offline_mode', 'true');
        
        this.show({
            type: 'system',
            code: 'SY005',
            message: 'Offline mode enabled. Some features may be limited.',
            autoDismiss: true,
            dismissTimeout: 3000
        });
    }

    /**
     * CLEAR CACHE
     */
    clearCache() {
        if (confirm('Clear cache and reload? This will remove temporary data.')) {
            localStorage.removeItem('mpesewa_cache');
            sessionStorage.clear();
            window.location.reload();
        }
    }

    /**
     * ADD TO ERROR LOG
     */
    addToErrorLog(errorData) {
        const logEntry = {
            type: errorData.type || 'error',
            code: errorData.code || 'UNKNOWN',
            message: errorData.message || 'Unknown error',
            timestamp: new Date().toISOString(),
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            url: window.location.href
        };
        
        this.errorLog.push(logEntry);
        
        // Keep only last 10 entries
        if (this.errorLog.length > 10) {
            this.errorLog = this.errorLog.slice(-10);
        }
        
        // Update display if visible
        if (this.state.isVisible && this.state.showDetails) {
            this.updateErrorLogDisplay();
        }
    }

    /**
     * HANDLE GLOBAL ERROR
     */
    handleGlobalError(event) {
        this.show({
            type: 'system',
            code: 'SY001',
            message: `JavaScript Error: ${event.message}`,
            details: {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            },
            stack: event.error?.stack
        });
    }

    /**
     * HANDLE PROMISE REJECTION
     */
    handlePromiseRejection(event) {
        this.show({
            type: 'system',
            code: 'SY004',
            message: `Promise Rejection: ${event.reason?.message || 'Unknown reason'}`,
            details: {
                reason: event.reason
            }
        });
    }

    /**
     * PUBLIC API METHODS
     */
    
    // Show hierarchy error
    showHierarchyError(code, message = null, details = null) {
        return this.show({
            type: 'hierarchy',
            code: code,
            message: message || this.messages.hierarchy[code] || 'Hierarchy violation',
            details: details,
            suggestedActions: this.suggestedActions.hierarchy
        });
    }
    
    // Show authentication error
    showAuthError(code, message = null, details = null) {
        return this.show({
            type: 'authentication',
            code: code,
            message: message || this.messages.authentication[code] || 'Authentication error',
            details: details,
            suggestedActions: this.suggestedActions.authentication
        });
    }
    
    // Show subscription error
    showSubscriptionError(code, message = null, details = null) {
        return this.show({
            type: 'subscription',
            code: code,
            message: message || this.messages.subscription[code] || 'Subscription error',
            details: details,
            suggestedActions: this.suggestedActions.subscription
        });
    }
    
    // Show network error
    showNetworkError(code, message = null, details = null) {
        return this.show({
            type: 'network',
            code: code,
            message: message || this.messages.network[code] || 'Network error',
            details: details,
            retry: true,
            suggestedActions: this.suggestedActions.network
        });
    }
    
    // Show system error
    showSystemError(code, message = null, details = null) {
        return this.show({
            type: 'system',
            code: code,
            message: message || this.messages.system[code] || 'System error',
            details: details,
            suggestedActions: this.suggestedActions.system
        });
    }
    
    // Show custom error
    showCustomError(type, code, message, details = null, options = {}) {
        return this.show({
            type: type,
            code: code,
            message: message,
            details: details,
            ...options
        });
    }
    
    // Get current state
    getState() {
        return { ...this.state };
    }
    
    // Get error log
    getErrorLog() {
        return [...this.errorLog];
    }
    
    // Clear error log
    clearErrorLog() {
        this.errorLog = [];
        this.saveErrorLog();
        if (this.state.isVisible && this.state.showDetails) {
            this.updateErrorLogDisplay();
        }
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
        document.removeEventListener('keydown', this.handleEscape);
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
        
        // Clear state
        this.state = null;
        this.elements = null;
        
        console.log('M-Pesewa ErrorOverlay: Component destroyed');
    }

    /**
     * LOG AUDIT TRAIL
     */
    logAudit(action, data) {
        const auditLog = JSON.parse(localStorage.getItem('mpesewa_audit_log') || '[]');
        auditLog.push({
            component: 'ErrorOverlay',
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
            component: 'ErrorOverlay',
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
    module.exports = ErrorOverlay;
} else if (typeof window !== 'undefined') {
    window.MPesewaErrorOverlay = ErrorOverlay;
}

/**
 * AUTO-INITIALIZE IF IN BROWSER CONTEXT
 */
if (typeof window !== 'undefined' && !window.mpErrorOverlay) {
    window.mpErrorOverlay = new ErrorOverlay();
    
    // Expose public API
    window.mpErrorOverlayAPI = {
        show: (errorData) => window.mpErrorOverlay.show(errorData),
        hide: () => window.mpErrorOverlay.hide(),
        showHierarchyError: (code, message, details) => window.mpErrorOverlay.showHierarchyError(code, message, details),
        showAuthError: (code, message, details) => window.mpErrorOverlay.showAuthError(code, message, details),
        showSubscriptionError: (code, message, details) => window.mpErrorOverlay.showSubscriptionError(code, message, details),
        showNetworkError: (code, message, details) => window.mpErrorOverlay.showNetworkError(code, message, details),
        showSystemError: (code, message, details) => window.mpErrorOverlay.showSystemError(code, message, details),
        showCustomError: (type, code, message, details, options) => window.mpErrorOverlay.showCustomError(type, code, message, details, options),
        getState: () => window.mpErrorOverlay.getState(),
        getErrorLog: () => window.mpErrorOverlay.getErrorLog(),
        clearErrorLog: () => window.mpErrorOverlay.clearErrorLog(),
        isVisible: () => window.mpErrorOverlay.isVisible(),
        destroy: () => window.mpErrorOverlay.destroy()
    };
}

export default ErrorOverlay;