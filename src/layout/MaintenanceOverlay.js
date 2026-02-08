/**
 * M-PESEWA MAINTENANCE OVERLAY COMPONENT
 * Strict Hierarchy: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 * Component Type: Platform Maintenance Notifications with Country-Specific Scheduling
 * Brand Colors: #003366 (Primary Blue), #0099ff (Secondary Blue), #f37021 (Action Orange), #28a745 (Trust Green)
 * Rules: Country-specific maintenance windows, Role-based feature availability, Subscription 28th expiry consideration
 */

class MaintenanceOverlay {
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
            maintenanceTypes: {
                scheduled: 'Scheduled Maintenance',
                emergency: 'Emergency Maintenance',
                country: 'Country-Specific Maintenance',
                feature: 'Feature Update',
                subscription: 'Subscription System Maintenance'
            },
            maintenanceSeverity: {
                low: 'Low Impact',
                medium: 'Medium Impact',
                high: 'High Impact',
                critical: 'Critical Impact'
            },
            // Country-specific maintenance windows (in local timezones)
            countryTimezones: {
                'Kenya': 'Africa/Nairobi',
                'Uganda': 'Africa/Kampala',
                'Tanzania': 'Africa/Dar_es_Salaam',
                'Rwanda': 'Africa/Kigali',
                'DRC': 'Africa/Kinshasa',
                'Burundi': 'Africa/Bujumbura',
                'Nigeria': 'Africa/Lagos',
                'Ghana': 'Africa/Accra',
                'South Sudan': 'Africa/Juba',
                'Somalia': 'Africa/Mogadishu',
                'South Africa': 'Africa/Johannesburg',
                'Ethiopia': 'Africa/Addis_Ababa'
            },
            ...config
        };

        // State Management
        this.state = {
            isVisible: false,
            maintenanceType: null,
            severity: null,
            title: null,
            message: null,
            startTime: null,
            endTime: null,
            currentProgress: 0,
            affectedFeatures: [],
            countrySpecific: false,
            roleSpecific: false,
            estimatedDowntime: null,
            lastUpdated: null,
            showCountdown: false,
            allowRefresh: false,
            allowOffline: false,
            showSubscriptionNote: false,
            subscriptionNote: null
        };

        // DOM Elements
        this.elements = {
            overlay: null,
            container: null,
            icon: null,
            title: null,
            message: null,
            progressBar: null,
            progressText: null,
            countdown: null,
            affectedList: null,
            countryBadge: null,
            roleIndicator: null,
            refreshButton: null,
            offlineButton: null,
            detailsButton: null,
            detailsPanel: null,
            subscriptionNote: null,
            statusIndicator: null
        };

        // Maintenance Messages by Context
        this.messages = {
            global: {
                scheduled: 'Platform maintenance in progress',
                emergency: 'Emergency maintenance underway',
                feature: 'Feature update being deployed',
                subscription: 'Subscription system maintenance'
            },
            country: {
                Kenya: {
                    scheduled: 'Kenya platform maintenance',
                    emergency: 'Emergency maintenance for Kenya',
                    feature: 'Kenya feature update',
                    subscription: 'Kenya subscription system update'
                },
                Uganda: {
                    scheduled: 'Uganda platform maintenance',
                    emergency: 'Emergency maintenance for Uganda',
                    feature: 'Uganda feature update',
                    subscription: 'Uganda subscription system update'
                },
                Tanzania: {
                    scheduled: 'Tanzania platform maintenance',
                    emergency: 'Emergency maintenance for Tanzania',
                    feature: 'Tanzania feature update',
                    subscription: 'Tanzania subscription system update'
                },
                Rwanda: {
                    scheduled: 'Rwanda platform maintenance',
                    emergency: 'Emergency maintenance for Rwanda',
                    feature: 'Rwanda feature update',
                    subscription: 'Rwanda subscription system update'
                },
                DRC: {
                    scheduled: 'DRC platform maintenance',
                    emergency: 'Emergency maintenance for DRC',
                    feature: 'DRC feature update',
                    subscription: 'DRC subscription system update'
                },
                Burundi: {
                    scheduled: 'Burundi platform maintenance',
                    emergency: 'Emergency maintenance for Burundi',
                    feature: 'Burundi feature update',
                    subscription: 'Burundi subscription system update'
                },
                Nigeria: {
                    scheduled: 'Nigeria platform maintenance',
                    emergency: 'Emergency maintenance for Nigeria',
                    feature: 'Nigeria feature update',
                    subscription: 'Nigeria subscription system update'
                },
                Ghana: {
                    scheduled: 'Ghana platform maintenance',
                    emergency: 'Emergency maintenance for Ghana',
                    feature: 'Ghana feature update',
                    subscription: 'Ghana subscription system update'
                },
                'South Sudan': {
                    scheduled: 'South Sudan platform maintenance',
                    emergency: 'Emergency maintenance for South Sudan',
                    feature: 'South Sudan feature update',
                    subscription: 'South Sudan subscription system update'
                },
                Somalia: {
                    scheduled: 'Somalia platform maintenance',
                    emergency: 'Emergency maintenance for Somalia',
                    feature: 'Somalia feature update',
                    subscription: 'Somalia subscription system update'
                },
                'South Africa': {
                    scheduled: 'South Africa platform maintenance',
                    emergency: 'Emergency maintenance for South Africa',
                    feature: 'South Africa feature update',
                    subscription: 'South Africa subscription system update'
                },
                Ethiopia: {
                    scheduled: 'Ethiopia platform maintenance',
                    emergency: 'Emergency maintenance for Ethiopia',
                    feature: 'Ethiopia feature update',
                    subscription: 'Ethiopia subscription system update'
                }
            },
            role: {
                lender: {
                    affected: 'Lending features may be unavailable',
                    note: 'Subscription renewals may be delayed during maintenance'
                },
                borrower: {
                    affected: 'Borrowing features may be unavailable',
                    note: 'Loan applications may be delayed during maintenance'
                },
                admin: {
                    affected: 'Admin features may be unavailable',
                    note: 'User management may be delayed during maintenance'
                },
                guest: {
                    affected: 'Some features may be unavailable',
                    note: 'Registration may be delayed during maintenance'
                }
            }
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
        this.setupMaintenanceMonitoring();
        this.checkMaintenanceStatus();
        
        // Log initialization
        this.logAudit('MaintenanceOverlay initialized', {
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
            const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || '{}');
            
            this.config.hierarchy.currentCountry = country;
            this.config.hierarchy.currentGroup = group;
            this.config.hierarchy.userRole = userData.role || 'guest';
            this.config.hierarchy.userCurrency = this.getCountryCurrency(country);
            
            // Check if subscription expires on 28th (current month)
            if (subscription.expiresAt) {
                const expiryDate = new Date(subscription.expiresAt);
                const today = new Date();
                const is28th = expiryDate.getDate() === 28 && 
                              expiryDate.getMonth() === today.getMonth() &&
                              expiryDate.getFullYear() === today.getFullYear();
                
                if (is28th) {
                    this.config.hierarchy.subscriptionExpiresToday = true;
                }
            }
            
            console.log(`M-Pesewa MaintenanceOverlay: Loaded context for ${this.config.hierarchy.userRole} in ${country || 'global'} ${group ? `(Group: ${group})` : ''}`);
        } catch (error) {
            console.error('M-Pesewa MaintenanceOverlay: Error loading context', error);
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
        this.elements.overlay.className = 'mp-maintenance-overlay';
        this.elements.overlay.setAttribute('role', 'alert');
        this.elements.overlay.setAttribute('aria-live', 'polite');
        this.elements.overlay.setAttribute('data-mpesewa-component', 'maintenance-overlay');
        this.elements.overlay.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
        this.elements.overlay.setAttribute('data-role', this.config.hierarchy.userRole);

        // Create container
        this.elements.container = document.createElement('div');
        this.elements.container.className = 'mp-maintenance-container';

        // Create header
        const header = document.createElement('div');
        header.className = 'mp-maintenance-header';

        // Create icon
        this.elements.icon = document.createElement('div');
        this.elements.icon.className = 'mp-maintenance-icon';
        this.elements.icon.innerHTML = '🔧';

        // Create title
        this.elements.title = document.createElement('h2');
        this.elements.title.className = 'mp-maintenance-title';
        this.elements.title.textContent = 'Maintenance';

        // Create status indicator
        this.elements.statusIndicator = document.createElement('div');
        this.elements.statusIndicator.className = 'mp-maintenance-status';
        this.elements.statusIndicator.textContent = 'IN PROGRESS';

        // Assemble header
        header.appendChild(this.elements.icon);
        header.appendChild(this.elements.title);
        header.appendChild(this.elements.statusIndicator);

        // Create country badge
        this.elements.countryBadge = document.createElement('div');
        this.elements.countryBadge.className = 'mp-maintenance-country-badge';
        if (this.config.hierarchy.currentCountry) {
            this.elements.countryBadge.innerHTML = `${this.getCountryFlag(this.config.hierarchy.currentCountry)} ${this.config.hierarchy.currentCountry}`;
        }

        // Create role indicator
        this.elements.roleIndicator = document.createElement('div');
        this.elements.roleIndicator.className = 'mp-maintenance-role-indicator';
        this.elements.roleIndicator.textContent = this.config.hierarchy.userRole.toUpperCase();

        // Create message
        this.elements.message = document.createElement('div');
        this.elements.message.className = 'mp-maintenance-message';
        this.elements.message.textContent = 'Platform maintenance is currently in progress';

        // Create countdown timer
        this.elements.countdown = document.createElement('div');
        this.elements.countdown.className = 'mp-maintenance-countdown';
        this.elements.countdown.innerHTML = `
            <div class="mp-countdown-title">Estimated Completion</div>
            <div class="mp-countdown-timer" id="mp-maintenance-countdown-timer">--:--:--</div>
        `;

        // Create progress container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'mp-maintenance-progress';

        // Create progress bar
        this.elements.progressBar = document.createElement('div');
        this.elements.progressBar.className = 'mp-maintenance-progress-bar';
        this.elements.progressBar.setAttribute('role', 'progressbar');
        this.elements.progressBar.setAttribute('aria-valuemin', '0');
        this.elements.progressBar.setAttribute('aria-valuemax', '100');
        this.elements.progressBar.setAttribute('aria-valuenow', '0');

        // Create progress text
        this.elements.progressText = document.createElement('div');
        this.elements.progressText.className = 'mp-maintenance-progress-text';
        this.elements.progressText.textContent = '0% Complete';

        // Assemble progress
        progressContainer.appendChild(this.elements.progressBar);
        progressContainer.appendChild(this.elements.progressText);

        // Create affected features list
        this.elements.affectedList = document.createElement('div');
        this.elements.affectedList.className = 'mp-maintenance-affected';
        this.elements.affectedList.innerHTML = this.createAffectedListHTML();

        // Create subscription note (for 28th expiry)
        this.elements.subscriptionNote = document.createElement('div');
        this.elements.subscriptionNote.className = 'mp-maintenance-subscription-note';
        this.elements.subscriptionNote.innerHTML = this.createSubscriptionNoteHTML();

        // Create details button
        this.elements.detailsButton = document.createElement('button');
        this.elements.detailsButton.className = 'mp-maintenance-details-button';
        this.elements.detailsButton.innerHTML = 'View Maintenance Details <span class="mp-maintenance-details-arrow">▼</span>';
        this.elements.detailsButton.setAttribute('aria-expanded', 'false');

        // Create details panel
        this.elements.detailsPanel = document.createElement('div');
        this.elements.detailsPanel.className = 'mp-maintenance-details';
        this.elements.detailsPanel.innerHTML = this.createDetailsPanelHTML();

        // Create action buttons container
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'mp-maintenance-actions';

        // Create refresh button
        this.elements.refreshButton = document.createElement('button');
        this.elements.refreshButton.className = 'mp-maintenance-refresh-button';
        this.elements.refreshButton.textContent = 'Refresh Status';
        this.elements.refreshButton.setAttribute('data-action', 'refresh');

        // Create offline button
        this.elements.offlineButton = document.createElement('button');
        this.elements.offlineButton.className = 'mp-maintenance-offline-button';
        this.elements.offlineButton.textContent = 'Use Offline Mode';
        this.elements.offlineButton.setAttribute('data-action', 'offline');

        // Assemble actions
        actionsContainer.appendChild(this.elements.refreshButton);
        actionsContainer.appendChild(this.elements.offlineButton);

        // Assemble container
        this.elements.container.appendChild(header);
        this.elements.container.appendChild(this.elements.countryBadge);
        this.elements.container.appendChild(this.elements.roleIndicator);
        this.elements.container.appendChild(this.elements.message);
        this.elements.container.appendChild(this.elements.countdown);
        this.elements.container.appendChild(progressContainer);
        this.elements.container.appendChild(this.elements.affectedList);
        this.elements.container.appendChild(this.elements.subscriptionNote);
        this.elements.container.appendChild(this.elements.detailsButton);
        this.elements.container.appendChild(this.elements.detailsPanel);
        this.elements.container.appendChild(actionsContainer);

        // Add container to overlay
        this.elements.overlay.appendChild(this.elements.container);

        // Inject CSS
        this.injectStyles();

        // Add to document
        document.body.appendChild(this.elements.overlay);
    }

    /**
     * CREATE AFFECTED LIST HTML
     */
    createAffectedListHTML() {
        return `
            <div class="mp-maintenance-affected-content">
                <h4>Affected Features</h4>
                <ul class="mp-maintenance-features-list">
                    <li class="mp-maintenance-feature-item">Loading...</li>
                </ul>
            </div>
        `;
    }

    /**
     * CREATE SUBSCRIPTION NOTE HTML
     */
    createSubscriptionNoteHTML() {
        return `
            <div class="mp-subscription-note-content">
                <div class="mp-subscription-note-icon">💰</div>
                <div class="mp-subscription-note-text">
                    <strong>Subscription Note:</strong> If your subscription expires on the 28th, renewal may be delayed during maintenance.
                </div>
            </div>
        `;
    }

    /**
     * CREATE DETAILS PANEL HTML
     */
    createDetailsPanelHTML() {
        return `
            <div class="mp-maintenance-details-content">
                <div class="mp-maintenance-detail-item">
                    <span class="mp-maintenance-detail-label">Maintenance Type:</span>
                    <span class="mp-maintenance-detail-value" id="mp-maintenance-type">--</span>
                </div>
                <div class="mp-maintenance-detail-item">
                    <span class="mp-maintenance-detail-label">Severity:</span>
                    <span class="mp-maintenance-detail-value" id="mp-maintenance-severity">--</span>
                </div>
                <div class="mp-maintenance-detail-item">
                    <span class="mp-maintenance-detail-label">Start Time:</span>
                    <span class="mp-maintenance-detail-value" id="mp-maintenance-start">--:--:--</span>
                </div>
                <div class="mp-maintenance-detail-item">
                    <span class="mp-maintenance-detail-label">End Time:</span>
                    <span class="mp-maintenance-detail-value" id="mp-maintenance-end">--:--:--</span>
                </div>
                <div class="mp-maintenance-detail-item">
                    <span class="mp-maintenance-detail-label">Estimated Downtime:</span>
                    <span class="mp-maintenance-detail-value" id="mp-maintenance-downtime">-- hours</span>
                </div>
                <div class="mp-maintenance-detail-item">
                    <span class="mp-maintenance-detail-label">Last Updated:</span>
                    <span class="mp-maintenance-detail-value" id="mp-maintenance-updated">--:--:--</span>
                </div>
                <div class="mp-maintenance-detail-item">
                    <span class="mp-maintenance-detail-label">Country Impact:</span>
                    <span class="mp-maintenance-detail-value" id="mp-maintenance-country-impact">${this.config.hierarchy.currentCountry || 'Global'}</span>
                </div>
                <div class="mp-maintenance-detail-item">
                    <span class="mp-maintenance-detail-label">Role Impact:</span>
                    <span class="mp-maintenance-detail-value" id="mp-maintenance-role-impact">${this.config.hierarchy.userRole}</span>
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
            .mp-maintenance-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 51, 102, 0.97);
                backdrop-filter: blur(10px);
                z-index: 10002;
                display: none;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                color: ${this.config.brandColors.pureWhite};
                padding: 20px;
                animation: mp-maintenance-fade-in 0.5s ease;
            }
            
            .mp-maintenance-overlay--visible {
                display: flex;
            }
            
            .mp-maintenance-container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 40px;
                width: 100%;
                max-width: 700px;
                max-height: 90vh;
                overflow-y: auto;
                border: 2px solid ${this.config.brandColors.warningYellow};
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                position: relative;
            }
            
            .mp-maintenance-header {
                display: flex;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .mp-maintenance-icon {
                font-size: 40px;
                margin-right: 20px;
                animation: mp-maintenance-spin 3s linear infinite;
            }
            
            .mp-maintenance-title {
                flex: 1;
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                color: ${this.config.brandColors.pureWhite};
            }
            
            .mp-maintenance-status {
                background: ${this.config.brandColors.warningYellow};
                color: ${this.config.brandColors.primary};
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 2px;
                animation: mp-maintenance-pulse 2s infinite;
            }
            
            .mp-maintenance-country-badge {
                display: inline-block;
                background: ${this.config.brandColors.secondary};
                color: ${this.config.brandColors.pureWhite};
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 15px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .mp-maintenance-role-indicator {
                display: inline-block;
                background: ${this.config.brandColors.actionOrange};
                color: ${this.config.brandColors.pureWhite};
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                margin-left: 10px;
                vertical-align: middle;
            }
            
            .mp-maintenance-message {
                font-size: 18px;
                line-height: 1.6;
                margin-bottom: 25px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                border-left: 6px solid ${this.config.brandColors.warningYellow};
            }
            
            .mp-maintenance-countdown {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                margin-bottom: 25px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .mp-countdown-title {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }
            
            .mp-countdown-timer {
                font-family: monospace;
                font-size: 36px;
                font-weight: 700;
                color: ${this.config.brandColors.pureWhite};
                text-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
            }
            
            .mp-maintenance-progress {
                margin-bottom: 25px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                padding: 20px;
                position: relative;
            }
            
            .mp-maintenance-progress-bar {
                height: 12px;
                background: linear-gradient(90deg, ${this.config.brandColors.secondary}, ${this.config.brandColors.trustGreen});
                border-radius: 6px;
                width: 0%;
                transition: width 0.5s ease;
                position: relative;
                overflow: hidden;
            }
            
            .mp-maintenance-progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                animation: mp-maintenance-shine 2s infinite;
            }
            
            .mp-maintenance-progress-text {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                font-weight: 600;
                color: ${this.config.brandColors.pureWhite};
            }
            
            .mp-maintenance-affected {
                margin-bottom: 25px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .mp-maintenance-affected-content h4 {
                margin: 0 0 15px 0;
                color: ${this.config.brandColors.secondary};
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .mp-maintenance-features-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .mp-maintenance-feature-item {
                padding: 12px 16px;
                margin-bottom: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border-left: 4px solid ${this.config.brandColors.warningYellow};
                display: flex;
                align-items: center;
            }
            
            .mp-maintenance-feature-item::before {
                content: '⚠️';
                margin-right: 12px;
                font-size: 18px;
            }
            
            .mp-maintenance-subscription-note {
                margin-bottom: 25px;
                padding: 16px;
                background: rgba(243, 112, 33, 0.1);
                border-radius: 12px;
                border: 1px solid rgba(243, 112, 33, 0.3);
                display: none;
            }
            
            .mp-maintenance-subscription-note--visible {
                display: block;
            }
            
            .mp-subscription-note-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .mp-subscription-note-icon {
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .mp-subscription-note-text {
                flex: 1;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .mp-maintenance-details-button {
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: ${this.config.brandColors.pureWhite};
                padding: 12px 24px;
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
            
            .mp-maintenance-details-button:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.5);
            }
            
            .mp-maintenance-details-button[aria-expanded="true"] .mp-maintenance-details-arrow {
                transform: rotate(180deg);
            }
            
            .mp-maintenance-details-arrow {
                transition: transform 0.3s ease;
            }
            
            .mp-maintenance-details {
                display: none;
                margin-bottom: 25px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                font-size: 13px;
            }
            
            .mp-maintenance-details--visible {
                display: block;
                animation: mp-maintenance-slide-down 0.3s ease;
            }
            
            .mp-maintenance-details-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            
            .mp-maintenance-detail-item {
                display: flex;
                flex-direction: column;
            }
            
            .mp-maintenance-detail-label {
                color: rgba(255, 255, 255, 0.7);
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 4px;
            }
            
            .mp-maintenance-detail-value {
                color: ${this.config.brandColors.pureWhite};
                font-weight: 500;
                font-family: monospace;
            }
            
            .mp-maintenance-actions {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .mp-maintenance-refresh-button {
                background: ${this.config.brandColors.secondary};
                color: ${this.config.brandColors.pureWhite};
                border: none;
                padding: 14px 28px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                flex: 1;
                min-width: 160px;
            }
            
            .mp-maintenance-refresh-button:hover {
                background: #0077cc;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 153, 255, 0.4);
            }
            
            .mp-maintenance-refresh-button:active {
                transform: translateY(0);
            }
            
            .mp-maintenance-offline-button {
                background: transparent;
                color: ${this.config.brandColors.pureWhite};
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 14px 28px;
                border-radius: 8px;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                flex: 1;
                min-width: 160px;
            }
            
            .mp-maintenance-offline-button:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-1px);
            }
            
            /* Severity-specific styles */
            .mp-maintenance-overlay--low {
                border-color: ${this.config.brandColors.secondary};
            }
            
            .mp-maintenance-overlay--low .mp-maintenance-status {
                background: ${this.config.brandColors.secondary};
                color: ${this.config.brandColors.pureWhite};
            }
            
            .mp-maintenance-overlay--medium {
                border-color: ${this.config.brandColors.warningYellow};
            }
            
            .mp-maintenance-overlay--medium .mp-maintenance-status {
                background: ${this.config.brandColors.warningYellow};
                color: ${this.config.brandColors.primary};
            }
            
            .mp-maintenance-overlay--high {
                border-color: ${this.config.brandColors.actionOrange};
            }
            
            .mp-maintenance-overlay--high .mp-maintenance-status {
                background: ${this.config.brandColors.actionOrange};
                color: ${this.config.brandColors.pureWhite};
            }
            
            .mp-maintenance-overlay--critical {
                border-color: #dc3545;
                animation: mp-maintenance-critical-pulse 1s infinite;
            }
            
            .mp-maintenance-overlay--critical .mp-maintenance-status {
                background: #dc3545;
                color: ${this.config.brandColors.pureWhite};
                animation: mp-maintenance-critical-pulse 1s infinite;
            }
            
            /* Country-specific maintenance */
            .mp-maintenance-overlay--country-specific .mp-maintenance-country-badge {
                animation: mp-maintenance-pulse 2s infinite;
            }
            
            /* Type-specific icons */
            .mp-maintenance-overlay--scheduled .mp-maintenance-icon {
                color: ${this.config.brandColors.secondary};
            }
            
            .mp-maintenance-overlay--emergency .mp-maintenance-icon {
                color: #dc3545;
                animation: mp-maintenance-pulse 1s infinite;
            }
            
            .mp-maintenance-overlay--feature .mp-maintenance-icon {
                color: ${this.config.brandColors.trustGreen};
            }
            
            .mp-maintenance-overlay--subscription .mp-maintenance-icon {
                color: ${this.config.brandColors.actionOrange};
            }
            
            @keyframes mp-maintenance-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes mp-maintenance-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes mp-maintenance-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            @keyframes mp-maintenance-critical-pulse {
                0%, 100% { 
                    opacity: 1;
                    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
                }
                50% { 
                    opacity: 0.8;
                    box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
                }
            }
            
            @keyframes mp-maintenance-shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            @keyframes mp-maintenance-slide-down {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .mp-maintenance-container {
                    padding: 25px 20px;
                    max-height: 95vh;
                }
                
                .mp-maintenance-header {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }
                
                .mp-maintenance-icon {
                    margin-right: 0;
                    margin-bottom: 10px;
                }
                
                .mp-maintenance-title {
                    font-size: 24px;
                }
                
                .mp-maintenance-details-content {
                    grid-template-columns: 1fr;
                }
                
                .mp-maintenance-actions {
                    flex-direction: column;
                }
                
                .mp-maintenance-refresh-button,
                .mp-maintenance-offline-button {
                    width: 100%;
                }
                
                .mp-countdown-timer {
                    font-size: 28px;
                }
            }
            
            /* Accessibility */
            .mp-maintenance-details-button:focus,
            .mp-maintenance-refresh-button:focus,
            .mp-maintenance-offline-button:focus {
                outline: 2px solid ${this.config.brandColors.secondary};
                outline-offset: 2px;
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .mp-maintenance-overlay {
                    animation: none;
                }
                
                .mp-maintenance-icon {
                    animation: none;
                }
                
                .mp-maintenance-status {
                    animation: none;
                }
                
                .mp-maintenance-overlay--critical {
                    animation: none;
                }
                
                .mp-maintenance-overlay--critical .mp-maintenance-status {
                    animation: none;
                }
                
                .mp-maintenance-country-badge {
                    animation: none;
                }
                
                .mp-maintenance-progress-bar::after {
                    animation: none;
                }
                
                .mp-maintenance-details--visible {
                    animation: none;
                }
                
                .mp-maintenance-refresh-button:hover,
                .mp-maintenance-offline-button:hover {
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
        // Refresh button
        this.elements.refreshButton.addEventListener('click', () => {
            this.refreshStatus();
        });

        // Offline button
        this.elements.offlineButton.addEventListener('click', () => {
            this.enableOfflineMode();
        });

        // Details button
        this.elements.detailsButton.addEventListener('click', () => {
            this.toggleDetails();
        });

        // Escape key to hide
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isVisible && this.state.severity !== 'critical') {
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

        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.checkMaintenanceStatus();
        });

        window.addEventListener('offline', () => {
            this.showOfflineNotice();
        });
    }

    /**
     * SETUP MAINTENANCE MONITORING
     */
    setupMaintenanceMonitoring() {
        // Load maintenance schedule
        this.loadMaintenanceSchedule();
        
        // Set up periodic checks
        this.maintenanceCheckInterval = setInterval(() => {
            this.checkMaintenanceStatus();
        }, 60000); // Check every minute
        
        // Update countdown timer
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    /**
     * LOAD MAINTENANCE SCHEDULE
     */
    loadMaintenanceSchedule() {
        try {
            const schedule = JSON.parse(localStorage.getItem('mpesewa_maintenance_schedule') || 'null');
            
            if (!schedule) {
                // Create default schedule if none exists
                this.createDefaultSchedule();
            } else {
                this.maintenanceSchedule = schedule;
            }
        } catch (error) {
            console.error('M-Pesewa MaintenanceOverlay: Failed to load schedule', error);
            this.createDefaultSchedule();
        }
    }

    /**
     * CREATE DEFAULT MAINTENANCE SCHEDULE
     */
    createDefaultSchedule() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(2, 0, 0, 0); // 2 AM tomorrow
        
        const endTime = new Date(tomorrow);
        endTime.setHours(4, 0, 0, 0); // 4 AM tomorrow
        
        this.maintenanceSchedule = {
            active: false,
            type: 'scheduled',
            severity: 'medium',
            title: 'Monthly Platform Maintenance',
            message: 'Routine maintenance to improve platform performance and security',
            startTime: tomorrow.toISOString(),
            endTime: endTime.toISOString(),
            affectedFeatures: [
                'New loan applications',
                'Lender dashboard updates',
                'Subscription renewals',
                'Group creation'
            ],
            countrySpecific: false,
            roleSpecific: false,
            estimatedDowntime: '2 hours',
            lastUpdated: now.toISOString()
        };
        
        localStorage.setItem('mpesewa_maintenance_schedule', JSON.stringify(this.maintenanceSchedule));
    }

    /**
     * CHECK MAINTENANCE STATUS
     */
    checkMaintenanceStatus() {
        if (!this.maintenanceSchedule) {
            this.loadMaintenanceSchedule();
            return;
        }
        
        const now = new Date();
        const startTime = new Date(this.maintenanceSchedule.startTime);
        const endTime = new Date(this.maintenanceSchedule.endTime);
        
        // Check if maintenance is active
        if (this.maintenanceSchedule.active && now >= startTime && now <= endTime) {
            this.showMaintenance(this.maintenanceSchedule);
        } else if (this.maintenanceSchedule.active && now > endTime) {
            // Maintenance ended
            this.maintenanceSchedule.active = false;
            localStorage.setItem('mpesewa_maintenance_schedule', JSON.stringify(this.maintenanceSchedule));
            this.hide();
            
            // Show completion notice
            this.showCompletionNotice();
        } else if (now >= startTime && now <= endTime && !this.maintenanceSchedule.active) {
            // Maintenance window but not marked active
            this.maintenanceSchedule.active = true;
            localStorage.setItem('mpesewa_maintenance_schedule', JSON.stringify(this.maintenanceSchedule));
            this.showMaintenance(this.maintenanceSchedule);
        }
        
        // Check for upcoming maintenance (within 1 hour)
        const timeUntilStart = startTime - now;
        if (timeUntilStart > 0 && timeUntilStart <= 3600000 && !this.maintenanceSchedule.active) {
            this.showUpcomingNotice(this.maintenanceSchedule);
        }
    }

    /**
     * SHOW MAINTENANCE OVERLAY
     */
    showMaintenance(data = {}) {
        if (this.state.isVisible) return;
        
        // Set state
        this.state.isVisible = true;
        this.state.maintenanceType = data.type || 'scheduled';
        this.state.severity = data.severity || 'medium';
        this.state.title = data.title || 'Platform Maintenance';
        this.state.message = data.message || 'Maintenance is currently in progress';
        this.state.startTime = new Date(data.startTime || Date.now());
        this.state.endTime = new Date(data.endTime || Date.now() + 3600000); // 1 hour default
        this.state.affectedFeatures = data.affectedFeatures || [];
        this.state.countrySpecific = data.countrySpecific || false;
        this.state.roleSpecific = data.roleSpecific || false;
        this.state.estimatedDowntime = data.estimatedDowntime || '1 hour';
        this.state.lastUpdated = new Date(data.lastUpdated || Date.now());
        this.state.showCountdown = true;
        this.state.allowRefresh = true;
        this.state.allowOffline = data.allowOffline !== false;
        this.state.showSubscriptionNote = this.shouldShowSubscriptionNote();
        this.state.subscriptionNote = this.getSubscriptionNote();
        
        // Calculate initial progress
        this.updateProgress();
        
        // Update UI
        this.updateUI();
        
        // Show overlay
        this.elements.overlay.classList.add('mp-maintenance-overlay--visible');
        this.elements.overlay.classList.add(`mp-maintenance-overlay--${this.state.severity}`);
        this.elements.overlay.classList.add(`mp-maintenance-overlay--${this.state.maintenanceType}`);
        
        if (this.state.countrySpecific) {
            this.elements.overlay.classList.add('mp-maintenance-overlay--country-specific');
        }
        
        // Show subscription note if needed
        if (this.state.showSubscriptionNote) {
            this.elements.subscriptionNote.classList.add('mp-maintenance-subscription-note--visible');
        }
        
        // Log for audit
        this.logAudit('Maintenance overlay shown', {
            type: this.state.maintenanceType,
            severity: this.state.severity,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            startTime: this.state.startTime.toISOString(),
            endTime: this.state.endTime.toISOString(),
            timestamp: new Date().toISOString()
        });
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('mpesewa:maintenanceStarted', {
            detail: this.state
        }));
        
        return this;
    }

    /**
     * HIDE MAINTENANCE OVERLAY
     */
    hide() {
        if (!this.state.isVisible) return;
        
        this.state.isVisible = false;
        this.elements.overlay.classList.remove('mp-maintenance-overlay--visible');
        this.elements.overlay.classList.remove(`mp-maintenance-overlay--${this.state.severity}`);
        this.elements.overlay.classList.remove(`mp-maintenance-overlay--${this.state.maintenanceType}`);
        this.elements.overlay.classList.remove('mp-maintenance-overlay--country-specific');
        this.elements.subscriptionNote.classList.remove('mp-maintenance-subscription-note--visible');
        
        // Log for audit
        this.logAudit('Maintenance overlay hidden', {
            type: this.state.maintenanceType,
            severity: this.state.severity,
            duration: Date.now() - this.state.startTime,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole
        });
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('mpesewa:maintenanceEnded', {
            detail: this.state
        }));
        
        return this;
    }

    /**
     * UPDATE UI
     */
    updateUI() {
        // Update title
        this.elements.title.textContent = this.state.title;
        
        // Update message
        this.elements.message.textContent = this.getMessageForContext();
        
        // Update status indicator
        this.elements.statusIndicator.textContent = this.getStatusText();
        
        // Update progress
        this.updateProgressBar();
        
        // Update affected features
        this.updateAffectedFeatures();
        
        // Update details panel
        this.updateDetailsPanel();
        
        // Update countdown
        this.updateCountdown();
        
        // Update button states
        this.elements.offlineButton.style.display = this.state.allowOffline ? 'block' : 'none';
    }

    /**
     * GET MESSAGE FOR CONTEXT
     */
    getMessageForContext() {
        const country = this.config.hierarchy.currentCountry;
        const role = this.config.hierarchy.userRole;
        
        // Country-specific message
        if (this.state.countrySpecific && country && this.messages.country[country]) {
            const countryMsg = this.messages.country[country][this.state.maintenanceType];
            if (countryMsg) {
                return `${countryMsg}. ${this.state.message}`;
            }
        }
        
        // Role-specific note
        const roleMsg = this.messages.role[role]?.note;
        if (roleMsg) {
            return `${this.state.message}. ${roleMsg}`;
        }
        
        return this.state.message;
    }

    /**
     * GET STATUS TEXT
     */
    getStatusText() {
        switch (this.state.severity) {
            case 'critical':
                return 'CRITICAL MAINTENANCE';
            case 'high':
                return 'HIGH IMPACT';
            case 'medium':
                return 'IN PROGRESS';
            case 'low':
                return 'MINOR MAINTENANCE';
            default:
                return 'MAINTENANCE';
        }
    }

    /**
     * UPDATE PROGRESS
     */
    updateProgress() {
        const now = new Date();
        const start = this.state.startTime;
        const end = this.state.endTime;
        
        if (now >= end) {
            this.state.currentProgress = 100;
        } else if (now <= start) {
            this.state.currentProgress = 0;
        } else {
            const totalDuration = end - start;
            const elapsed = now - start;
            this.state.currentProgress = (elapsed / totalDuration) * 100;
        }
    }

    /**
     * UPDATE PROGRESS BAR
     */
    updateProgressBar() {
        this.elements.progressBar.style.width = `${this.state.currentProgress}%`;
        this.elements.progressBar.setAttribute('aria-valuenow', Math.round(this.state.currentProgress));
        this.elements.progressText.textContent = `${Math.round(this.state.currentProgress)}% Complete`;
    }

    /**
     * UPDATE AFFECTED FEATURES
     */
    updateAffectedFeatures() {
        const list = this.elements.affectedList.querySelector('.mp-maintenance-features-list');
        list.innerHTML = '';
        
        // Get role-specific affected features
        const roleAffected = this.messages.role[this.config.hierarchy.userRole]?.affected;
        if (roleAffected) {
            const item = document.createElement('li');
            item.className = 'mp-maintenance-feature-item';
            item.textContent = roleAffected;
            list.appendChild(item);
        }
        
        // Add maintenance-specific features
        this.state.affectedFeatures.forEach(feature => {
            const item = document.createElement('li');
            item.className = 'mp-maintenance-feature-item';
            item.textContent = feature;
            list.appendChild(item);
        });
        
        // If no features, show default
        if (list.children.length === 0) {
            const item = document.createElement('li');
            item.className = 'mp-maintenance-feature-item';
            item.textContent = 'Some platform features may be temporarily unavailable';
            list.appendChild(item);
        }
    }

    /**
     * UPDATE DETAILS PANEL
     */
    updateDetailsPanel() {
        // Update maintenance type
        const typeElement = document.getElementById('mp-maintenance-type');
        if (typeElement) {
            const typeLabel = this.config.maintenanceTypes[this.state.maintenanceType] || this.state.maintenanceType;
            typeElement.textContent = typeLabel;
        }
        
        // Update severity
        const severityElement = document.getElementById('mp-maintenance-severity');
        if (severityElement) {
            const severityLabel = this.config.maintenanceSeverity[this.state.severity] || this.state.severity;
            severityElement.textContent = severityLabel;
        }
        
        // Update start time
        const startElement = document.getElementById('mp-maintenance-start');
        if (startElement) {
            startElement.textContent = this.formatTime(this.state.startTime, true);
        }
        
        // Update end time
        const endElement = document.getElementById('mp-maintenance-end');
        if (endElement) {
            endElement.textContent = this.formatTime(this.state.endTime, true);
        }
        
        // Update downtime
        const downtimeElement = document.getElementById('mp-maintenance-downtime');
        if (downtimeElement) {
            downtimeElement.textContent = this.state.estimatedDowntime;
        }
        
        // Update last updated
        const updatedElement = document.getElementById('mp-maintenance-updated');
        if (updatedElement) {
            updatedElement.textContent = this.formatTime(this.state.lastUpdated, true);
        }
        
        // Update country impact
        const countryElement = document.getElementById('mp-maintenance-country-impact');
        if (countryElement) {
            countryElement.textContent = this.state.countrySpecific ? 
                this.config.hierarchy.currentCountry || 'Specific Country' : 
                'All Countries';
        }
        
        // Update role impact
        const roleElement = document.getElementById('mp-maintenance-role-impact');
        if (roleElement) {
            roleElement.textContent = this.state.roleSpecific ? 
                this.config.hierarchy.userRole : 
                'All Roles';
        }
    }

    /**
     * UPDATE COUNTDOWN
     */
    updateCountdown() {
        if (!this.state.isVisible || !this.state.showCountdown) return;
        
        const now = new Date();
        const end = this.state.endTime;
        
        if (now >= end) {
            this.elements.countdown.querySelector('.mp-countdown-timer').textContent = 'COMPLETED';
            this.state.showCountdown = false;
            return;
        }
        
        const diff = end - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        this.elements.countdown.querySelector('.mp-countdown-timer').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress
        this.updateProgress();
        this.updateProgressBar();
    }

    /**
     * FORMAT TIME
     */
    formatTime(date, includeSeconds = false) {
        if (!date) return '--:--:--';
        
        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        
        if (includeSeconds) {
            const seconds = d.getSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
        
        return `${hours}:${minutes}`;
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
        
        // Update overlay attributes
        this.elements.overlay.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
        this.elements.overlay.setAttribute('data-role', this.config.hierarchy.userRole);
        
        // Update affected features if visible
        if (this.state.isVisible) {
            this.updateAffectedFeatures();
            this.updateDetailsPanel();
        }
    }

    /**
     * SHOULD SHOW SUBSCRIPTION NOTE
     */
    shouldShowSubscriptionNote() {
        if (this.config.hierarchy.userRole !== 'lender') return false;
        
        // Check if today is 28th
        const today = new Date();
        if (today.getDate() === 28) return true;
        
        // Check if subscription expires today
        if (this.config.hierarchy.subscriptionExpiresToday) return true;
        
        // Check if maintenance overlaps with subscription expiry
        const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || '{}');
        if (subscription.expiresAt) {
            const expiryDate = new Date(subscription.expiresAt);
            return expiryDate >= this.state.startTime && expiryDate <= this.state.endTime;
        }
        
        return false;
    }

    /**
     * GET SUBSCRIPTION NOTE
     */
    getSubscriptionNote() {
        const today = new Date();
        
        if (today.getDate() === 28) {
            return 'Today is the 28th - subscription renewals may be delayed during maintenance.';
        }
        
        if (this.config.hierarchy.subscriptionExpiresToday) {
            return 'Your subscription expires today - renewal may be delayed during maintenance.';
        }
        
        return 'Subscription renewals may be delayed during maintenance.';
    }

    /**
     * TOGGLE DETAILS PANEL
     */
    toggleDetails() {
        const isExpanded = this.elements.detailsButton.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            this.elements.detailsPanel.classList.remove('mp-maintenance-details--visible');
            this.elements.detailsButton.setAttribute('aria-expanded', 'false');
        } else {
            this.elements.detailsPanel.classList.add('mp-maintenance-details--visible');
            this.elements.detailsButton.setAttribute('aria-expanded', 'true');
            
            // Log for audit
            this.logAudit('Maintenance details viewed', {
                type: this.state.maintenanceType,
                severity: this.state.severity,
                country: this.config.hierarchy.currentCountry,
                role: this.config.hierarchy.userRole,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * REFRESH STATUS
     */
    refreshStatus() {
        this.checkMaintenanceStatus();
        
        // Update last updated time
        this.state.lastUpdated = new Date();
        this.updateDetailsPanel();
        
        // Show refresh feedback
        this.elements.refreshButton.textContent = 'Checking...';
        this.elements.refreshButton.disabled = true;
        
        setTimeout(() => {
            this.elements.refreshButton.textContent = 'Refresh Status';
            this.elements.refreshButton.disabled = false;
        }, 1000);
        
        // Log for audit
        this.logAudit('Maintenance status refreshed', {
            type: this.state.maintenanceType,
            severity: this.state.severity,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * ENABLE OFFLINE MODE
     */
    enableOfflineMode() {
        localStorage.setItem('mpesewa_offline_mode', 'true');
        
        // Hide overlay for offline mode
        this.hide();
        
        // Show offline confirmation
        setTimeout(() => {
            this.show({
                type: 'feature',
                severity: 'low',
                title: 'Offline Mode Enabled',
                message: 'You can continue using limited features while maintenance is in progress.',
                autoDismiss: true,
                dismissTimeout: 3000
            });
        }, 500);
        
        // Log for audit
        this.logAudit('Offline mode enabled during maintenance', {
            type: this.state.maintenanceType,
            severity: this.state.severity,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * SHOW UPCOMING NOTICE
     */
    showUpcomingNotice(schedule) {
        const startTime = new Date(schedule.startTime);
        const now = new Date();
        const minutesUntil = Math.round((startTime - now) / (1000 * 60));
        
        this.show({
            type: schedule.type,
            severity: 'low',
            title: 'Upcoming Maintenance',
            message: `Maintenance scheduled in ${minutesUntil} minutes. Please save your work.`,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            affectedFeatures: schedule.affectedFeatures,
            autoDismiss: true,
            dismissTimeout: 10000,
            allowRefresh: false,
            allowOffline: false
        });
    }

    /**
     * SHOW COMPLETION NOTICE
     */
    showCompletionNotice() {
        this.show({
            type: 'feature',
            severity: 'low',
            title: 'Maintenance Completed',
            message: 'Platform maintenance has been completed successfully.',
            autoDismiss: true,
            dismissTimeout: 5000,
            allowRefresh: false,
            allowOffline: false
        });
    }

    /**
     * SHOW OFFLINE NOTICE
     */
    showOfflineNotice() {
        if (this.state.isVisible) return;
        
        this.show({
            type: 'emergency',
            severity: 'high',
            title: 'Network Connection Lost',
            message: 'You are offline. Maintenance may affect reconnection.',
            autoDismiss: false,
            allowRefresh: true,
            allowOffline: true
        });
    }

    /**
     * PUBLIC API METHODS
     */
    
    // Schedule maintenance
    scheduleMaintenance(data) {
        this.maintenanceSchedule = {
            active: false,
            type: data.type || 'scheduled',
            severity: data.severity || 'medium',
            title: data.title || 'Platform Maintenance',
            message: data.message || 'Maintenance notification',
            startTime: new Date(data.startTime || Date.now() + 3600000).toISOString(),
            endTime: new Date(data.endTime || Date.now() + 7200000).toISOString(),
            affectedFeatures: data.affectedFeatures || [],
            countrySpecific: data.countrySpecific || false,
            roleSpecific: data.roleSpecific || false,
            estimatedDowntime: data.estimatedDowntime || '1 hour',
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('mpesewa_maintenance_schedule', JSON.stringify(this.maintenanceSchedule));
        
        // Log for audit
        this.logAudit('Maintenance scheduled', {
            type: this.maintenanceSchedule.type,
            severity: this.maintenanceSchedule.severity,
            startTime: this.maintenanceSchedule.startTime,
            endTime: this.maintenanceSchedule.endTime,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
        
        return this;
    }
    
    // Start immediate maintenance
    startMaintenance(data) {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + (data.duration || 3600000));
        
        this.show({
            type: data.type || 'emergency',
            severity: data.severity || 'high',
            title: data.title || 'Emergency Maintenance',
            message: data.message || 'Emergency maintenance has started',
            startTime: startTime,
            endTime: endTime,
            affectedFeatures: data.affectedFeatures || [],
            countrySpecific: data.countrySpecific || false,
            roleSpecific: data.roleSpecific || false,
            estimatedDowntime: this.formatDuration(data.duration || 3600000),
            allowOffline: data.allowOffline !== false
        });
        
        return this;
    }
    
    // Format duration in milliseconds to readable string
    formatDuration(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minutes` : ''}`;
        }
        
        return `${minutes} minutes`;
    }
    
    // Cancel maintenance
    cancelMaintenance() {
        if (this.maintenanceSchedule) {
            this.maintenanceSchedule.active = false;
            localStorage.setItem('mpesewa_maintenance_schedule', JSON.stringify(this.maintenanceSchedule));
        }
        
        this.hide();
        
        // Show cancellation notice
        this.show({
            type: 'feature',
            severity: 'low',
            title: 'Maintenance Cancelled',
            message: 'Scheduled maintenance has been cancelled.',
            autoDismiss: true,
            dismissTimeout: 3000
        });
        
        return this;
    }
    
    // Get current maintenance status
    getStatus() {
        return {
            ...this.state,
            schedule: this.maintenanceSchedule,
            nextCheck: new Date(Date.now() + 60000)
        };
    }
    
    // Check if maintenance is active
    isActive() {
        return this.state.isVisible;
    }
    
    // Destroy component
    destroy() {
        this.hide();
        
        // Clear intervals
        if (this.maintenanceCheckInterval) {
            clearInterval(this.maintenanceCheckInterval);
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        // Remove element
        if (this.elements.overlay && this.elements.overlay.parentNode) {
            this.elements.overlay.parentNode.removeChild(this.elements.overlay);
        }
        
        // Remove event listeners
        this.elements.refreshButton?.removeEventListener('click', this.refreshStatus);
        this.elements.offlineButton?.removeEventListener('click', this.enableOfflineMode);
        this.elements.detailsButton?.removeEventListener('click', this.toggleDetails);
        
        // Clear state
        this.state = null;
        this.elements = null;
        
        console.log('M-Pesewa MaintenanceOverlay: Component destroyed');
    }

    /**
     * LOG AUDIT TRAIL
     */
    logAudit(action, data) {
        const auditLog = JSON.parse(localStorage.getItem('mpesewa_audit_log') || '[]');
        auditLog.push({
            component: 'MaintenanceOverlay',
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
            component: 'MaintenanceOverlay',
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
    module.exports = MaintenanceOverlay;
} else if (typeof window !== 'undefined') {
    window.MPesewaMaintenanceOverlay = MaintenanceOverlay;
}

/**
 * AUTO-INITIALIZE IF IN BROWSER CONTEXT
 */
if (typeof window !== 'undefined' && !window.mpMaintenanceOverlay) {
    window.mpMaintenanceOverlay = new MaintenanceOverlay();
    
    // Expose public API
    window.mpMaintenanceOverlayAPI = {
        show: (data) => window.mpMaintenanceOverlay.showMaintenance(data),
        hide: () => window.mpMaintenanceOverlay.hide(),
        schedule: (data) => window.mpMaintenanceOverlay.scheduleMaintenance(data),
        start: (data) => window.mpMaintenanceOverlay.startMaintenance(data),
        cancel: () => window.mpMaintenanceOverlay.cancelMaintenance(),
        getStatus: () => window.mpMaintenanceOverlay.getStatus(),
        isActive: () => window.mpMaintenanceOverlay.isActive(),
        destroy: () => window.mpMaintenanceOverlay.destroy()
    };
}

export default MaintenanceOverlay;