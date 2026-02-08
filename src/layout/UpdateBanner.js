/**
 * M-PESEWA UPDATE BANNER COMPONENT
 * Strict Hierarchy: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 * Component Type: PWA Update Notification
 * Brand Colors: #003366 (Primary Blue), #0099ff (Secondary Blue), #f37021 (Action Orange), #28a745 (Trust Green)
 * Rules: No cross-country visibility, Country-locked updates
 */

class UpdateBanner {
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
                userRole: null // 'lender' or 'borrower' or 'admin'
            },
            updateRules: {
                countrySpecific: true,
                roleBased: true,
                subscriptionEnforced: true,
                expires28th: true
            },
            ...config
        };

        // State Management
        this.state = {
            isVisible: false,
            updateType: null, // 'pwa', 'maintenance', 'emergency', 'country'
            updateData: null,
            lastDismissed: null,
            userPreferences: {
                autoUpdate: false,
                notifyMaintenance: true,
                notifyEmergency: true
            }
        };

        // DOM Elements
        this.elements = {
            banner: null,
            content: null,
            closeButton: null,
            actionButton: null,
            dismissButton: null,
            countryBadge: null
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
        this.checkForUpdates();
        
        // Log initialization for audit trail
        this.logAudit('UpdateBanner initialized', {
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * LOAD USER CONTEXT WITH HIERARCHY ENFORCEMENT
     * Strict: Country isolation, Role-based visibility, Group context
     */
    loadUserContext() {
        try {
            // Get user data from localStorage (simulating auth state)
            const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
            const country = localStorage.getItem('mpesewa_country');
            const group = localStorage.getItem('mpesewa_group');
            const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || '{}');
            
            // Enforce country selection
            if (!country) {
                console.warn('M-Pesewa UpdateBanner: No country selected. Country isolation rule violated.');
                return;
            }

            // Validate country against supported list
            if (!this.config.hierarchy.countries.includes(country)) {
                console.error(`M-Pesewa UpdateBanner: Invalid country "${country}". Country isolation rule violated.`);
                return;
            }

            // Update hierarchy state
            this.config.hierarchy.currentCountry = country;
            this.config.hierarchy.currentGroup = group;
            this.config.hierarchy.userRole = userData.role;
            
            // Load user preferences
            const prefs = JSON.parse(localStorage.getItem('mpesewa_preferences') || '{}');
            this.state.userPreferences = { ...this.state.userPreferences, ...prefs.updateBanner };
            
            console.log(`M-Pesewa UpdateBanner: Loaded context for ${userData.role || 'guest'} in ${country} ${group ? `(Group: ${group})` : ''}`);
        } catch (error) {
            console.error('M-Pesewa UpdateBanner: Error loading user context', error);
            this.logError(error);
        }
    }

    /**
     * CREATE DOM STRUCTURE WITH FINTECH-GRADE DESIGN
     * Follows M-Pesewa brand guidelines strictly
     */
    createDOMStructure() {
        // Create main banner container
        this.elements.banner = document.createElement('div');
        this.elements.banner.className = 'mp-update-banner';
        this.elements.banner.setAttribute('role', 'alert');
        this.elements.banner.setAttribute('aria-live', 'polite');
        this.elements.banner.setAttribute('data-mpesewa-component', 'update-banner');
        this.elements.banner.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
        this.elements.banner.setAttribute('data-role', this.config.hierarchy.userRole || 'guest');

        // Create content wrapper
        this.elements.content = document.createElement('div');
        this.elements.content.className = 'mp-update-banner__content';

        // Create country badge (if applicable)
        if (this.config.hierarchy.currentCountry) {
            this.elements.countryBadge = document.createElement('span');
            this.elements.countryBadge.className = 'mp-update-banner__country-badge';
            this.elements.countryBadge.textContent = this.getCountryFlag(this.config.hierarchy.currentCountry);
            this.elements.countryBadge.setAttribute('title', `Update for ${this.config.hierarchy.currentCountry} only`);
        }

        // Create close button
        this.elements.closeButton = document.createElement('button');
        this.elements.closeButton.className = 'mp-update-banner__close';
        this.elements.closeButton.innerHTML = '&times;';
        this.elements.closeButton.setAttribute('aria-label', 'Dismiss update notification');
        this.elements.closeButton.setAttribute('title', 'Dismiss');

        // Create action button (primary CTA)
        this.elements.actionButton = document.createElement('button');
        this.elements.actionButton.className = 'mp-update-banner__action';
        this.elements.actionButton.setAttribute('data-action', 'update');

        // Create dismiss button (secondary)
        this.elements.dismissButton = document.createElement('button');
        this.elements.dismissButton.className = 'mp-update-banner__dismiss';
        this.elements.dismissButton.textContent = 'Remind me later';

        // Assemble structure
        this.elements.content.appendChild(this.elements.countryBadge);
        this.elements.banner.appendChild(this.elements.content);
        this.elements.banner.appendChild(this.elements.closeButton);
        this.elements.banner.appendChild(this.elements.actionButton);
        this.elements.banner.appendChild(this.elements.dismissButton);

        // Inject CSS
        this.injectStyles();

        // Append to body
        document.body.appendChild(this.elements.banner);
    }

    /**
     * APPLY M-PESEWA BRAND COLORS STRICTLY
     * Non-negotiable color scheme enforcement
     */
    applyBrandColors() {
        const style = document.createElement('style');
        style.textContent = `
            .mp-update-banner {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 10000;
                background: ${this.config.brandColors.primary};
                color: ${this.config.brandColors.pureWhite};
                padding: 16px 20px;
                display: none;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 4px 12px rgba(0, 51, 102, 0.15);
                border-bottom: 3px solid ${this.config.brandColors.secondary};
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .mp-update-banner--visible {
                display: flex !important;
                animation: mp-slide-down 0.3s ease-out;
            }
            
            .mp-update-banner--pwa-update {
                background: linear-gradient(135deg, ${this.config.brandColors.primary}, #004488);
            }
            
            .mp-update-banner--maintenance {
                background: linear-gradient(135deg, #f37021, #e65c00);
            }
            
            .mp-update-banner--emergency {
                background: linear-gradient(135deg, #dc3545, #c82333);
            }
            
            .mp-update-banner--country-specific {
                border-left: 6px solid ${this.config.brandColors.trustGreen};
            }
            
            .mp-update-banner__content {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 12px;
                padding-right: 20px;
            }
            
            .mp-update-banner__country-badge {
                background: ${this.config.brandColors.pureWhite};
                color: ${this.config.brandColors.primary};
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .mp-update-banner__close {
                background: none;
                border: none;
                color: ${this.config.brandColors.pureWhite};
                font-size: 24px;
                line-height: 1;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s ease;
                margin-left: 12px;
            }
            
            .mp-update-banner__close:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: scale(1.1);
            }
            
            .mp-update-banner__close:active {
                transform: scale(0.95);
            }
            
            .mp-update-banner__action {
                background: ${this.config.brandColors.actionOrange};
                color: ${this.config.brandColors.pureWhite};
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-left: 12px;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(243, 112, 33, 0.3);
            }
            
            .mp-update-banner__action:hover {
                background: #e65c00;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(243, 112, 33, 0.4);
            }
            
            .mp-update-banner__action:active {
                transform: translateY(0);
            }
            
            .mp-update-banner__action--update {
                background: ${this.config.brandColors.trustGreen};
            }
            
            .mp-update-banner__action--update:hover {
                background: #218838;
            }
            
            .mp-update-banner__dismiss {
                background: transparent;
                color: ${this.config.brandColors.pureWhite};
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 9px 18px;
                border-radius: 6px;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-left: 12px;
                white-space: nowrap;
            }
            
            .mp-update-banner__dismiss:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.5);
            }
            
            .mp-update-banner__message {
                flex: 1;
                font-weight: 500;
            }
            
            .mp-update-banner__message strong {
                font-weight: 700;
                color: ${this.config.brandColors.secondary};
            }
            
            .mp-update-banner__icon {
                font-size: 20px;
                margin-right: 8px;
            }
            
            .mp-update-banner__role-badge {
                background: ${this.config.brandColors.secondary};
                color: ${this.config.brandColors.pureWhite};
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                margin-left: 8px;
            }
            
            @keyframes mp-slide-down {
                from {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes mp-pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.7;
                }
            }
            
            .mp-update-banner--pulsing {
                animation: mp-pulse 2s infinite;
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .mp-update-banner {
                    flex-direction: column;
                    align-items: stretch;
                    padding: 12px 16px;
                }
                
                .mp-update-banner__content {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                    padding-right: 0;
                    margin-bottom: 12px;
                }
                
                .mp-update-banner__close {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    margin-left: 0;
                }
                
                .mp-update-banner__action,
                .mp-update-banner__dismiss {
                    width: 100%;
                    margin: 4px 0;
                    text-align: center;
                }
                
                .mp-update-banner__buttons {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    gap: 8px;
                }
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .mp-update-banner {
                    background: #002244;
                }
                
                .mp-update-banner__country-badge {
                    background: ${this.config.brandColors.secondary};
                    color: ${this.config.brandColors.pureWhite};
                }
            }
            
            /* Accessibility */
            .mp-update-banner__close:focus,
            .mp-update-banner__action:focus,
            .mp-update-banner__dismiss:focus {
                outline: 2px solid ${this.config.brandColors.secondary};
                outline-offset: 2px;
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .mp-update-banner--visible {
                    animation: none;
                }
                
                .mp-update-banner--pulsing {
                    animation: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * BIND EVENTS WITH HIERARCHY-AWARE LOGIC
     */
    bindEvents() {
        // Close button
        this.elements.closeButton.addEventListener('click', () => {
            this.dismiss('manual_close');
        });

        // Action button
        this.elements.actionButton.addEventListener('click', () => {
            this.handleAction();
        });

        // Dismiss button
        this.elements.dismissButton.addEventListener('click', () => {
            this.dismiss('remind_later');
        });

        // Listen for service worker updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                this.checkForUpdates();
            });
        }

        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.checkForUpdates();
        });

        // Listen for storage changes (user context updates)
        window.addEventListener('storage', (e) => {
            if (e.key === 'mpesewa_user' || e.key === 'mpesewa_country') {
                this.loadUserContext();
                this.updateBannerContext();
            }
        });
    }

    /**
     * CHECK FOR UPDATES WITH HIERARCHY VALIDATION
     * Strict: Country-specific, Role-based, Group-aware updates
     */
    async checkForUpdates() {
        try {
            // Check PWA update
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration && registration.waiting) {
                    this.showUpdate('pwa', {
                        title: 'App Update Available',
                        message: 'A new version of M-Pesewa is available. Update now for the latest features and security improvements.',
                        actionText: 'Update Now',
                        actionType: 'update'
                    });
                    return;
                }
            }

            // Check for maintenance updates (country-specific)
            await this.checkMaintenanceUpdates();

            // Check for emergency updates (group-specific)
            await this.checkEmergencyUpdates();

            // Check for subscription updates (role-specific)
            await this.checkSubscriptionUpdates();

        } catch (error) {
            console.error('M-Pesewa UpdateBanner: Error checking updates', error);
            this.logError(error);
        }
    }

    /**
     * CHECK MAINTENANCE UPDATES - COUNTRY SPECIFIC
     * Strict: No cross-country maintenance notifications
     */
    async checkMaintenanceUpdates() {
        if (!this.config.hierarchy.currentCountry) return;

        // In production, this would fetch from API
        // Simulating country-specific maintenance data
        const maintenanceData = {
            Kenya: {
                active: false,
                message: 'Scheduled maintenance for Kenya platform tonight from 2-4 AM EAT'
            },
            Uganda: {
                active: true,
                message: 'Emergency maintenance for Uganda platform. Some features may be temporarily unavailable.'
            },
            Tanzania: {
                active: false,
                message: ''
            }
            // ... other countries
        };

        const countryMaintenance = maintenanceData[this.config.hierarchy.currentCountry];
        if (countryMaintenance && countryMaintenance.active) {
            this.showUpdate('maintenance', {
                title: `Maintenance Alert - ${this.config.hierarchy.currentCountry}`,
                message: countryMaintenance.message,
                actionText: 'View Details',
                actionType: 'info',
                countrySpecific: true
            });
        }
    }

    /**
     * CHECK EMERGENCY UPDATES - GROUP AWARE
     * Strict: Only show emergency updates for user's current group
     */
    async checkEmergencyUpdates() {
        if (!this.config.hierarchy.currentGroup) return;

        // Simulating group-specific emergency updates
        const emergencyUpdates = JSON.parse(localStorage.getItem('mpesewa_emergency_updates') || '{}');
        
        if (emergencyUpdates[this.config.hierarchy.currentGroup]) {
            const update = emergencyUpdates[this.config.hierarchy.currentGroup];
            if (update.active && !update.dismissed) {
                this.showUpdate('emergency', {
                    title: `Group Emergency Alert`,
                    message: update.message,
                    actionText: 'View Emergency',
                    actionType: 'emergency',
                    groupSpecific: true
                });
            }
        }
    }

    /**
     * CHECK SUBSCRIPTION UPDATES - ROLE SPECIFIC
     * Strict: Only for lenders, enforces 28th expiry rule
     */
    async checkSubscriptionUpdates() {
        if (this.config.hierarchy.userRole !== 'lender') return;

        const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || '{}');
        if (!subscription.level) return;

        const now = new Date();
        const expiryDate = new Date(subscription.expiresAt);
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        // Check if subscription expires within 7 days
        if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
            this.showUpdate('subscription', {
                title: 'Subscription Expiring Soon',
                message: `Your ${subscription.level} subscription expires in ${daysUntilExpiry} day(s). Renew to continue lending.`,
                actionText: 'Renew Now',
                actionType: 'renew',
                daysUntilExpiry: daysUntilExpiry
            });
        }

        // Check if expired (28th rule enforcement)
        if (now > expiryDate) {
            this.showUpdate('subscription', {
                title: 'Subscription Expired',
                message: 'Your lending subscription has expired. You cannot lend until you renew. Borrowers in your groups will not see your offers.',
                actionText: 'Renew Subscription',
                actionType: 'renew',
                critical: true
            });
        }
    }

    /**
     * SHOW UPDATE BANNER WITH CONTEXT
     * @param {string} type - pwa|maintenance|emergency|subscription
     * @param {object} data - Update data
     */
    showUpdate(type, data) {
        // Check if user has dismissed this type recently
        if (this.shouldSuppressUpdate(type, data)) {
            return;
        }

        // Validate hierarchy rules
        if (!this.validateUpdateForContext(type, data)) {
            console.log(`M-Pesewa UpdateBanner: Update suppressed for ${this.config.hierarchy.userRole} in ${this.config.hierarchy.currentCountry}`);
            return;
        }

        // Update state
        this.state.isVisible = true;
        this.state.updateType = type;
        this.state.updateData = data;

        // Update UI
        this.updateBannerUI();

        // Show banner
        this.elements.banner.classList.add('mp-update-banner--visible');
        this.elements.banner.classList.add(`mp-update-banner--${type}`);

        // Add pulsing animation for critical updates
        if (data.critical) {
            this.elements.banner.classList.add('mp-update-banner--pulsing');
        }

        // Add country-specific styling
        if (data.countrySpecific) {
            this.elements.banner.classList.add('mp-update-banner--country-specific');
        }

        // Log for audit
        this.logAudit('Update banner shown', {
            type: type,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            data: data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * VALIDATE UPDATE FOR CURRENT CONTEXT
     * Strict: Enforces all M-Pesewa hierarchy rules
     */
    validateUpdateForContext(type, data) {
        // Global updates always show
        if (data.global) return true;

        // Country-specific updates
        if (data.countrySpecific) {
            if (!this.config.hierarchy.currentCountry) return false;
            if (data.country && data.country !== this.config.hierarchy.currentCountry) return false;
        }

        // Role-specific updates
        if (data.roleSpecific) {
            if (!this.config.hierarchy.userRole) return false;
            if (data.roles && !data.roles.includes(this.config.hierarchy.userRole)) return false;
        }

        // Group-specific updates
        if (data.groupSpecific) {
            if (!this.config.hierarchy.currentGroup) return false;
            if (data.group && data.group !== this.config.hierarchy.currentGroup) return false;
        }

        // Subscription updates only for lenders
        if (type === 'subscription' && this.config.hierarchy.userRole !== 'lender') {
            return false;
        }

        return true;
    }

    /**
     * CHECK IF UPDATE SHOULD BE SUPPRESSED
     */
    shouldSuppressUpdate(type, data) {
        const lastDismissed = JSON.parse(localStorage.getItem('mpesewa_update_dismissals') || '{}');
        const key = `${type}_${data.title || 'default'}`;
        
        if (lastDismissed[key]) {
            const dismissTime = new Date(lastDismissed[key]);
            const now = new Date();
            const hoursSinceDismiss = (now - dismissTime) / (1000 * 60 * 60);
            
            // Don't show for 24 hours after dismissal
            if (hoursSinceDismiss < 24) {
                return true;
            }
        }

        // Check user preferences
        if (type === 'maintenance' && !this.state.userPreferences.notifyMaintenance) {
            return true;
        }

        if (type === 'emergency' && !this.state.userPreferences.notifyEmergency) {
            return true;
        }

        return false;
    }

    /**
     * UPDATE BANNER UI WITH CURRENT CONTEXT
     */
    updateBannerUI() {
        const { updateType, updateData } = this.state;
        
        // Clear existing content
        this.elements.content.innerHTML = '';
        
        // Add country badge if applicable
        if (this.config.hierarchy.currentCountry && updateData.countrySpecific) {
            const countryBadge = document.createElement('span');
            countryBadge.className = 'mp-update-banner__country-badge';
            countryBadge.innerHTML = `${this.getCountryFlag(this.config.hierarchy.currentCountry)} ${this.config.hierarchy.currentCountry}`;
            this.elements.content.appendChild(countryBadge);
        }
        
        // Add role badge if applicable
        if (this.config.hierarchy.userRole && updateData.roleSpecific) {
            const roleBadge = document.createElement('span');
            roleBadge.className = 'mp-update-banner__role-badge';
            roleBadge.textContent = this.config.hierarchy.userRole;
            this.elements.content.appendChild(roleBadge);
        }
        
        // Add icon
        const icon = document.createElement('span');
        icon.className = 'mp-update-banner__icon';
        icon.textContent = this.getUpdateIcon(updateType);
        this.elements.content.appendChild(icon);
        
        // Add message
        const message = document.createElement('span');
        message.className = 'mp-update-banner__message';
        
        if (updateData.title) {
            const title = document.createElement('strong');
            title.textContent = updateData.title + ': ';
            message.appendChild(title);
        }
        
        message.appendChild(document.createTextNode(updateData.message || ''));
        this.elements.content.appendChild(message);
        
        // Update action button
        this.elements.actionButton.textContent = updateData.actionText || 'Take Action';
        this.elements.actionButton.className = `mp-update-banner__action mp-update-banner__action--${updateData.actionType || 'default'}`;
        
        // Update dismiss button visibility
        this.elements.dismissButton.style.display = updateData.critical ? 'none' : 'block';
    }

    /**
     * UPDATE BANNER CONTEXT (when user changes country/role)
     */
    updateBannerContext() {
        if (this.state.isVisible) {
            // Hide current banner
            this.hide();
            
            // Re-check updates with new context
            setTimeout(() => {
                this.checkForUpdates();
            }, 500);
        }
        
        // Update DOM attributes
        if (this.elements.banner) {
            this.elements.banner.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
            this.elements.banner.setAttribute('data-role', this.config.hierarchy.userRole || 'guest');
        }
    }

    /**
     * HANDLE ACTION BUTTON CLICK
     */
    handleAction() {
        const { updateType, updateData } = this.state;
        
        switch (updateData.actionType) {
            case 'update':
                this.handlePWAUpdate();
                break;
                
            case 'renew':
                this.handleSubscriptionRenewal();
                break;
                
            case 'emergency':
                this.handleEmergencyAction();
                break;
                
            case 'info':
                this.handleInfoAction();
                break;
                
            default:
                console.log('M-Pesewa UpdateBanner: Default action');
        }
        
        // Dismiss after action
        this.dismiss('action_taken');
    }

    /**
     * HANDLE PWA UPDATE ACTION
     */
    handlePWAUpdate() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration && registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                }
            });
        }
    }

    /**
     * HANDLE SUBSCRIPTION RENEWAL
     * Strict: Enforces subscription hierarchy
     */
    handleSubscriptionRenewal() {
        // Navigate to subscription page with proper context
        const url = new URL('/subscription/renew.html', window.location.origin);
        url.searchParams.set('country', this.config.hierarchy.currentCountry);
        url.searchParams.set('role', this.config.hierarchy.userRole);
        url.searchParams.set('group', this.config.hierarchy.currentGroup);
        
        window.location.href = url.toString();
    }

    /**
     * HANDLE EMERGENCY ACTION
     */
    handleEmergencyAction() {
        // Navigate to emergency hub
        window.location.href = '/emergency/index.html';
    }

    /**
     * HANDLE INFO ACTION
     */
    handleInfoAction() {
        // Show more details in a modal or new page
        console.log('M-Pesewa UpdateBanner: Showing details for', this.state.updateData.title);
    }

    /**
     * DISMISS BANNER
     * @param {string} reason - Reason for dismissal
     */
    dismiss(reason) {
        this.hide();
        
        // Store dismissal for suppression
        const key = `${this.state.updateType}_${this.state.updateData.title || 'default'}`;
        const dismissals = JSON.parse(localStorage.getItem('mpesewa_update_dismissals') || '{}');
        dismissals[key] = new Date().toISOString();
        localStorage.setItem('mpesewa_update_dismissals', JSON.stringify(dismissals));
        
        // Log for audit
        this.logAudit('Update banner dismissed', {
            type: this.state.updateType,
            reason: reason,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
        
        // Reset state
        this.state.isVisible = false;
    }

    /**
     * HIDE BANNER
     */
    hide() {
        this.elements.banner.classList.remove('mp-update-banner--visible');
        this.elements.banner.classList.remove(`mp-update-banner--${this.state.updateType}`);
        this.elements.banner.classList.remove('mp-update-banner--pulsing');
        this.elements.banner.classList.remove('mp-update-banner--country-specific');
    }

    /**
     * GET COUNTRY FLAG EMOJI
     * @param {string} country - Country name
     * @returns {string} Flag emoji
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
     * GET UPDATE TYPE ICON
     * @param {string} type - Update type
     * @returns {string} Icon
     */
    getUpdateIcon(type) {
        const icons = {
            'pwa': '🔄',
            'maintenance': '🔧',
            'emergency': '🚨',
            'subscription': '💰',
            'info': 'ℹ️'
        };
        
        return icons[type] || '📢';
    }

    /**
     * LOG AUDIT TRAIL
     * @param {string} action - Action performed
     * @param {object} data - Additional data
     */
    logAudit(action, data) {
        const auditLog = JSON.parse(localStorage.getItem('mpesewa_audit_log') || '[]');
        auditLog.push({
            component: 'UpdateBanner',
            action: action,
            ...data,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        // Keep only last 1000 entries
        if (auditLog.length > 1000) {
            auditLog.splice(0, auditLog.length - 1000);
        }
        
        localStorage.setItem('mpesewa_audit_log', JSON.stringify(auditLog));
    }

    /**
     * LOG ERROR
     * @param {Error} error - Error object
     */
    logError(error) {
        const errorLog = JSON.parse(localStorage.getItem('mpesewa_error_log') || '[]');
        errorLog.push({
            component: 'UpdateBanner',
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

    /**
     * PUBLIC API METHODS
     */
    
    // Show manual update
    showManualUpdate(data) {
        this.showUpdate('manual', data);
    }
    
    // Check for updates manually
    forceUpdateCheck() {
        return this.checkForUpdates();
    }
    
    // Get current state
    getState() {
        return { ...this.state };
    }
    
    // Update preferences
    updatePreferences(prefs) {
        this.state.userPreferences = { ...this.state.userPreferences, ...prefs };
        localStorage.setItem('mpesewa_preferences', JSON.stringify({
            ...JSON.parse(localStorage.getItem('mpesewa_preferences') || '{}'),
            updateBanner: this.state.userPreferences
        }));
    }
    
    // Clear all dismissals
    clearDismissals() {
        localStorage.removeItem('mpesewa_update_dismissals');
    }
    
    // Destroy component
    destroy() {
        if (this.elements.banner && this.elements.banner.parentNode) {
            this.elements.banner.parentNode.removeChild(this.elements.banner);
        }
        
        // Remove event listeners
        this.elements.closeButton?.removeEventListener('click', this.dismiss);
        this.elements.actionButton?.removeEventListener('click', this.handleAction);
        this.elements.dismissButton?.removeEventListener('click', this.dismiss);
        
        // Clear state
        this.state = null;
        this.elements = null;
        
        console.log('M-Pesewa UpdateBanner: Component destroyed');
    }
}

/**
 * GLOBAL EXPORT FOR MODULE USAGE
 * Usage: 
 *   const updateBanner = new UpdateBanner();
 *   updateBanner.showManualUpdate({...});
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UpdateBanner;
} else if (typeof window !== 'undefined') {
    window.MPesewaUpdateBanner = UpdateBanner;
}

/**
 * AUTO-INITIALIZE IF IN BROWSER CONTEXT
 * This creates a global instance that can be accessed via window.mpUpdateBanner
 */
if (typeof window !== 'undefined' && !window.mpUpdateBanner) {
    window.mpUpdateBanner = new UpdateBanner();
    
    // Expose public API
    window.mpUpdateBannerAPI = {
        showUpdate: (type, data) => window.mpUpdateBanner.showManualUpdate(data),
        checkUpdates: () => window.mpUpdateBanner.forceUpdateCheck(),
        dismiss: () => window.mpUpdateBanner.dismiss('api_call'),
        getState: () => window.mpUpdateBanner.getState(),
        updatePrefs: (prefs) => window.mpUpdateBanner.updatePreferences(prefs),
        clearDismissals: () => window.mpUpdateBanner.clearDismissals(),
        destroy: () => window.mpUpdateBanner.destroy()
    };
}

export default UpdateBanner;