/**
 * M-Pesewa Flag Ribbon Main Controller
 * Orchestrates all ribbon components and enforces hierarchy rules
 */

class RibbonController {
    constructor(options = {}) {
        // Configuration
        this.config = {
            container: options.container || document.body,
            autoInit: options.autoInit !== false,
            enforceHierarchy: options.enforceHierarchy !== false,
            enableAnimations: options.enableAnimations !== false,
            enableModes: options.enableModes !== false,
            defaultMode: options.defaultMode || 'global-overview',
            userRole: options.userRole || 'guest',
            ...options
        };

        // Component instances
        this.flagRibbon = null;
        this.motionController = null;
        this.modeController = null;
        
        // State
        this.state = {
            initialized: false,
            currentCountry: null,
            currentGroup: null,
            currentUser: null,
            hierarchy: {
                global: { enabled: true, visible: true },
                countries: { enabled: true, visible: true },
                groups: { enabled: false, visible: false },
                lenders: { enabled: false, visible: false },
                borrowers: { enabled: false, visible: false },
                ledgers: { enabled: false, visible: false }
            },
            violations: [],
            rules: this.loadRules()
        };

        // Event listeners
        this.listeners = new Map();
        
        // Initialize if auto-init is enabled
        if (this.config.autoInit) {
            this.init();
        }
    }

    /**
     * Initialize the ribbon controller
     */
    async init() {
        if (this.state.initialized) {
            console.warn('RibbonController already initialized');
            return;
        }

        try {
            // Load user data
            await this.loadUserData();
            
            // Initialize components
            this.initComponents();
            
            // Apply hierarchy rules
            this.applyHierarchyRules();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Set initial mode
            this.setInitialMode();
            
            this.state.initialized = true;
            
            // Dispatch initialization event
            this.dispatchEvent('ribbonInitialized', {
                controller: this,
                state: this.state,
                config: this.config
            });
            
            console.log('RibbonController initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize RibbonController:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize all components
     */
    initComponents() {
        // Initialize Flag Ribbon
        this.flagRibbon = new window.FlagRibbon({
            container: this.config.container,
            interactive: true,
            showHierarchy: this.config.enforceHierarchy,
            currentCountry: this.state.currentCountry,
            mode: this.config.defaultMode === 'mobile-compact' ? 'dropdown' : 'horizontal'
        });

        // Initialize Motion Controller
        if (this.config.enableAnimations) {
            this.motionController = new window.MotionController(this.flagRibbon);
        }

        // Initialize Mode Controller
        if (this.config.enableModes) {
            this.modeController = new window.RibbonModes();
            this.modeController.autoDetectMode();
            
            // Apply mode to ribbon
            const modeConfig = this.modeController.getCurrentMode();
            this.modeController.applyModeToRibbon(this.flagRibbon.ribbonElement, modeConfig);
        }
    }

    /**
     * Load user data from localStorage
     */
    async loadUserData() {
        try {
            // Load user
            const userData = localStorage.getItem('mpesewa_user');
            if (userData) {
                this.state.currentUser = JSON.parse(userData);
                this.config.userRole = this.state.currentUser.role || 'guest';
            }

            // Load current country
            const countryCode = localStorage.getItem('mpesewa_selected_country');
            if (countryCode && window.mpesewaFlagData.validateCountryCode(countryCode)) {
                this.state.currentCountry = countryCode;
            }

            // Load current group
            const groupId = localStorage.getItem('mpesewa_current_group');
            if (groupId) {
                const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '[]');
                this.state.currentGroup = groups.find(g => g.id === groupId);
            }

            return true;
            
        } catch (error) {
            console.warn('Failed to load user data:', error);
            return false;
        }
    }

    /**
     * Load hierarchy rules
     */
    loadRules() {
        return {
            // STRICT HIERARCHY RULES (NON-NEGOTIABLE)
            hierarchy: {
                order: ['global', 'countries', 'groups', 'lenders/borrowers', 'ledgers'],
                isolation: {
                    countries: 'No cross-country operations',
                    groups: 'Lenders can only lend within their group'
                },
                limits: {
                    groupsPerUser: 4,
                    membersPerGroup: { min: 5, max: 1000 },
                    lendersPerGroup: 'unlimited',
                    borrowersPerGroup: 'unlimited'
                }
            },
            
            // COUNTRY RULES
            countries: {
                supported: 12,
                isolation: 'STRICT - No cross-country lending or borrowing',
                currency: 'Country-specific only',
                compliance: 'Local regulations enforced'
            },
            
            // GROUP RULES
            groups: {
                types: ['Family', 'Church', 'Professional', 'Local', 'Social', 'Business'],
                membership: 'Invitation or referral only',
                administration: 'One Admin/Founder per group',
                countryLock: 'Cannot invite non-citizens'
            },
            
            // LENDER RULES
            lenders: {
                subscription: 'REQUIRED for lending',
                tiers: ['Basic', 'Premium', 'Super', 'Lender of Lenders'],
                expiry: '28th of each month',
                access: 'Blocked when subscription expires',
                lending: 'Within group only',
                ledgers: 'Unlimited per lender'
            },
            
            // BORROWER RULES
            borrowers: {
                subscription: 'NO fees for Basic tier',
                limits: 'Maximum 4 groups (good rating required)',
                repayment: '7 days with 10% interest',
                penalty: '5% daily after 7 days',
                default: 'After 2 months, triggers blacklist'
            },
            
            // LEDGER RULES
            ledgers: {
                generation: 'Auto-generated on loan approval',
                fields: ['Borrower details', 'Amount', 'Interest', 'Dates', 'Status'],
                management: 'Updated manually by lender',
                override: 'Admin can override'
            },
            
            // VALIDATION RULES
            validation: {
                country: 'Must be one of 12 supported countries',
                group: 'Must have min 5, max 1000 members',
                user: 'Must have valid role (lender/borrower)',
                subscription: 'Lenders must have active subscription'
            }
        };
    }

    /**
     * Apply hierarchy rules to the interface
     */
    applyHierarchyRules() {
        if (!this.config.enforceHierarchy) return;

        // Update hierarchy state based on user role
        this.updateHierarchyState();
        
        // Apply visual hierarchy
        this.applyVisualHierarchy();
        
        // Enforce isolation rules
        this.enforceIsolationRules();
        
        // Validate current state against rules
        this.validateCurrentState();
    }

    /**
     * Update hierarchy state based on user role
     */
    updateHierarchyState() {
        const userRole = this.config.userRole;
        
        // Reset all to false
        Object.keys(this.state.hierarchy).forEach(key => {
            this.state.hierarchy[key].enabled = false;
            this.state.hierarchy[key].visible = false;
        });
        
        // Global is always enabled
        this.state.hierarchy.global = { enabled: true, visible: true };
        
        // Countries are always enabled
        this.state.hierarchy.countries = { enabled: true, visible: true };
        
        // Enable based on role and state
        switch(userRole) {
            case 'admin':
                // Admins see everything
                Object.keys(this.state.hierarchy).forEach(key => {
                    this.state.hierarchy[key].enabled = true;
                    this.state.hierarchy[key].visible = true;
                });
                break;
                
            case 'lender':
                this.state.hierarchy.groups = { enabled: true, visible: true };
                this.state.hierarchy.lenders = { enabled: true, visible: true };
                this.state.hierarchy.ledgers = { enabled: true, visible: true };
                break;
                
            case 'borrower':
                this.state.hierarchy.groups = { enabled: true, visible: true };
                this.state.hierarchy.borrowers = { enabled: true, visible: true };
                break;
                
            case 'group-admin':
                this.state.hierarchy.groups = { enabled: true, visible: true };
                this.state.hierarchy.lenders = { enabled: true, visible: true };
                this.state.hierarchy.borrowers = { enabled: true, visible: true };
                break;
                
            default: // guest
                // Only global and countries
                break;
        }
        
        // Additional checks
        if (this.state.currentGroup) {
            this.state.hierarchy.groups.enabled = true;
            this.state.hierarchy.groups.visible = true;
        }
    }

    /**
     * Apply visual hierarchy to the ribbon
     */
    applyVisualHierarchy() {
        if (!this.flagRibbon || !this.flagRibbon.ribbonElement) return;
        
        const ribbon = this.flagRibbon.ribbonElement;
        const hierarchy = this.state.hierarchy;
        
        // Add hierarchy level classes
        Object.keys(hierarchy).forEach(level => {
            if (hierarchy[level].enabled) {
                ribbon.classList.add(`hierarchy-${level}-enabled`);
            }
            if (hierarchy[level].visible) {
                ribbon.classList.add(`hierarchy-${level}-visible`);
            }
        });
        
        // Update hierarchy display
        if (this.flagRibbon.hierarchyElement) {
            this.updateHierarchyDisplay();
        }
    }

    /**
     * Update hierarchy display element
     */
    updateHierarchyDisplay() {
        if (!this.flagRibbon.hierarchyElement) return;
        
        const hierarchy = this.state.hierarchy;
        let html = '<div class="hierarchy-visualization">';
        
        // Global level (always shown)
        html += this.createHierarchyLevel('global', '🌐 Global Platform', hierarchy.global.visible);
        
        // Arrow
        html += '<div class="hierarchy-arrow">↓</div>';
        
        // Countries level
        const countryCount = window.mpesewaFlagData.COUNTRIES.length;
        html += this.createHierarchyLevel('countries', `🇺🇳 ${countryCount} Countries`, hierarchy.countries.visible);
        
        // Arrow if groups are enabled
        if (hierarchy.groups.enabled) {
            html += '<div class="hierarchy-arrow">↓</div>';
            
            // Groups level
            const groupCount = window.mpesewaFlagData.SAMPLE_GROUPS.length;
            const groupText = this.state.currentGroup 
                ? `🏢 ${this.state.currentGroup.name}`
                : `👥 ${groupCount} Groups`;
            html += this.createHierarchyLevel('groups', groupText, hierarchy.groups.visible);
            
            // Branches for lenders and borrowers
            if (hierarchy.lenders.enabled || hierarchy.borrowers.enabled) {
                html += '<div class="hierarchy-branches">';
                
                // Lenders branch
                if (hierarchy.lenders.enabled) {
                    html += '<div class="hierarchy-branch lender-branch">';
                    html += '<div class="branch-arrow">↳</div>';
                    html += `<div class="branch-label">💰 Lenders</div>`;
                    
                    // Ledgers sub-branch
                    if (hierarchy.ledgers.enabled) {
                        html += '<div class="branch-arrow">↳</div>';
                        html += `<div class="branch-label">📒 Ledgers</div>`;
                    }
                    
                    html += '</div>';
                }
                
                // Borrowers branch
                if (hierarchy.borrowers.enabled) {
                    html += '<div class="hierarchy-branch borrower-branch">';
                    html += '<div class="branch-arrow">↳</div>';
                    html += `<div class="branch-label">👤 Borrowers</div>`;
                    html += '</div>';
                }
                
                html += '</div>';
            }
        }
        
        html += '</div>';
        
        this.flagRibbon.hierarchyElement.innerHTML = html;
        
        // Add click handlers
        this.addHierarchyClickHandlers();
    }

    /**
     * Create hierarchy level HTML
     */
    createHierarchyLevel(level, text, isVisible) {
        const visibleClass = isVisible ? 'visible' : 'hidden';
        const clickable = isVisible ? 'clickable' : '';
        
        return `
            <div class="hierarchy-level ${level} ${visibleClass} ${clickable}" 
                 data-level="${level}"
                 data-visible="${isVisible}">
                ${text}
            </div>
        `;
    }

    /**
     * Add click handlers to hierarchy levels
     */
    addHierarchyClickHandlers() {
        const levels = this.flagRibbon.hierarchyElement.querySelectorAll('.hierarchy-level.clickable');
        
        levels.forEach(level => {
            level.addEventListener('click', () => {
                const levelName = level.getAttribute('data-level');
                this.handleHierarchyClick(levelName);
            });
        });
    }

    /**
     * Handle hierarchy level click
     */
    handleHierarchyClick(level) {
        // Dispatch event
        this.dispatchEvent('hierarchyLevelClicked', {
            level: level,
            state: this.state.hierarchy[level],
            userRole: this.config.userRole
        });
        
        // Show level details
        this.showLevelDetails(level);
        
        // Animate if motion controller is available
        if (this.motionController) {
            const element = this.flagRibbon.hierarchyElement.querySelector(`.hierarchy-level.${level}`);
            if (element) {
                this.motionController.animateHierarchyLevel(element, level);
            }
        }
    }

    /**
     * Show details for a hierarchy level
     */
    showLevelDetails(level) {
        const details = {
            global: {
                title: 'Global Platform',
                content: 'M-Pesewa operates in 12 African countries with strict country isolation.',
                stats: `Countries: ${window.mpesewaFlagData.COUNTRIES.length}`
            },
            countries: {
                title: 'Countries',
                content: 'Each country operates independently with local currency and regulations.',
                stats: 'No cross-country lending or borrowing allowed.'
            },
            groups: {
                title: 'Groups',
                content: 'Trusted circles where lending and borrowing happens.',
                stats: `Sample Groups: ${window.mpesewaFlagData.SAMPLE_GROUPS.length}`
            },
            lenders: {
                title: 'Lenders',
                content: 'Provide loans within their groups. Require active subscription.',
                stats: 'Subscription expires 28th of each month.'
            },
            borrowers: {
                title: 'Borrowers',
                content: 'Receive emergency loans. Pay no subscription fees.',
                stats: 'Maximum 4 groups with good rating.'
            },
            ledgers: {
                title: 'Ledgers',
                content: 'Record of active loans. Auto-generated on approval.',
                stats: 'Updated manually by lenders.'
            }
        };
        
        const detail = details[level];
        if (detail) {
            this.showModal(detail.title, detail.content, detail.stats);
        }
    }

    /**
     * Show modal with details
     */
    showModal(title, content, stats = null) {
        // Remove existing modal
        const existingModal = document.querySelector('.ribbon-controller-modal');
        if (existingModal) existingModal.remove();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'ribbon-controller-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                    ${stats ? `<div class="modal-stats">${stats}</div>` : ''}
                    <div class="modal-hierarchy">
                        <strong>Hierarchy Position:</strong> ${this.getHierarchyPosition()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Animate if motion controller is available
        if (this.motionController) {
            this.motionController.playAnimation(modal, 'fadeIn');
        }
    }

    /**
     * Get current hierarchy position
     */
    getHierarchyPosition() {
        const position = [];
        
        if (this.state.hierarchy.global.visible) position.push('Global');
        if (this.state.hierarchy.countries.visible) position.push('Countries');
        if (this.state.hierarchy.groups.visible) position.push('Groups');
        if (this.state.hierarchy.lenders.visible) position.push('Lenders');
        if (this.state.hierarchy.borrowers.visible) position.push('Borrowers');
        if (this.state.hierarchy.ledgers.visible) position.push('Ledgers');
        
        return position.join(' → ');
    }

    /**
     * Enforce isolation rules
     */
    enforceIsolationRules() {
        const violations = [];
        
        // Rule 1: No cross-country operations
        if (this.state.currentUser && this.state.currentUser.country !== this.state.currentCountry) {
            violations.push({
                rule: 'country_isolation',
                message: 'User country does not match selected country',
                severity: 'high',
                userCountry: this.state.currentUser.country,
                selectedCountry: this.state.currentCountry
            });
        }
        
        // Rule 2: Lenders can only lend within their group
        if (this.config.userRole === 'lender' && this.state.currentGroup) {
            const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
            const isInGroup = userGroups.some(g => g.id === this.state.currentGroup.id);
            
            if (!isInGroup) {
                violations.push({
                    rule: 'group_isolation',
                    message: 'Lender not member of current group',
                    severity: 'high',
                    userGroups: userGroups.length,
                    currentGroup: this.state.currentGroup.name
                });
            }
        }
        
        // Rule 3: Maximum 4 groups per borrower
        if (this.config.userRole === 'borrower') {
            const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
            if (userGroups.length > 4) {
                violations.push({
                    rule: 'group_limit',
                    message: 'Borrower in more than 4 groups',
                    severity: 'medium',
                    currentGroups: userGroups.length,
                    maxAllowed: 4
                });
            }
        }
        
        // Store violations
        this.state.violations = violations;
        
        // Handle violations
        if (violations.length > 0) {
            this.handleViolations(violations);
        }
    }

    /**
     * Handle rule violations
     */
    handleViolations(violations) {
        // Log violations
        violations.forEach(violation => {
            console.warn(`Hierarchy violation: ${violation.message}`, violation);
        });
        
        // Dispatch violation event
        this.dispatchEvent('hierarchyViolation', {
            violations: violations,
            state: this.state,
            userRole: this.config.userRole
        });
        
        // Show warning for high severity violations
        const highSeverity = violations.filter(v => v.severity === 'high');
        if (highSeverity.length > 0 && this.motionController) {
            const ribbon = this.flagRibbon.ribbonElement;
            this.motionController.animateError(ribbon, 'Hierarchy violation detected');
        }
    }

    /**
     * Validate current state against rules
     */
    validateCurrentState() {
        const validations = [];
        
        // Validate country
        if (this.state.currentCountry) {
            const isValidCountry = window.mpesewaFlagData.validateCountryCode(this.state.currentCountry);
            validations.push({
                check: 'country',
                valid: isValidCountry,
                message: isValidCountry ? 'Valid country selected' : 'Invalid country code'
            });
        }
        
        // Validate user role
        const validRoles = ['guest', 'borrower', 'lender', 'group-admin', 'admin'];
        const isValidRole = validRoles.includes(this.config.userRole);
        validations.push({
            check: 'user_role',
            valid: isValidRole,
            message: isValidRole ? 'Valid user role' : 'Invalid user role'
        });
        
        // Validate hierarchy state
        const hierarchyValid = Object.values(this.state.hierarchy)
            .every(level => typeof level.enabled === 'boolean' && typeof level.visible === 'boolean');
        validations.push({
            check: 'hierarchy_state',
            valid: hierarchyValid,
            message: hierarchyValid ? 'Valid hierarchy state' : 'Invalid hierarchy state'
        });
        
        return validations;
    }

    /**
     * Set initial mode based on context
     */
    setInitialMode() {
        if (!this.modeController) return;
        
        // Auto-detect mode
        this.modeController.autoDetectMode();
        const modeConfig = this.modeController.getCurrentMode();
        
        // Apply mode to ribbon
        this.modeController.applyModeToRibbon(this.flagRibbon.ribbonElement, modeConfig);
        
        // Update flag ribbon configuration based on mode
        this.updateRibbonForMode(modeConfig);
    }

    /**
     * Update ribbon configuration for current mode
     */
    updateRibbonForMode(modeConfig) {
        if (!this.flagRibbon) return;
        
        // Update flag display based on mode
        const flagConfig = modeConfig.flags;
        
        this.flagRibbon.setShowLabels(flagConfig.labels);
        
        // Set mode-specific properties
        if (flagConfig.display === 'selected' && this.state.currentCountry) {
            this.flagRibbon.selectCountry(this.state.currentCountry);
        }
        
        // Update hierarchy display
        this.flagRibbon.config.showHierarchy = modeConfig.hierarchyDisplay.enabled;
        
        // Re-render if needed
        this.flagRibbon.render();
    }

    /**
     * Handle country selection
     */
    handleCountrySelection(country) {
        this.state.currentCountry = country.code;
        
        // Update localStorage
        localStorage.setItem('mpesewa_selected_country', country.code);
        
        // Update ribbon
        if (this.flagRibbon) {
            this.flagRibbon.selectCountry(country.code);
        }
        
        // Apply hierarchy rules for new country
        this.applyHierarchyRules();
        
        // Dispatch event
        this.dispatchEvent('countrySelected', {
            country: country,
            previousCountry: this.state.previousCountry,
            userRole: this.config.userRole
        });
        
        // Store previous country
        this.state.previousCountry = country.code;
        
        // Animate if motion controller is available
        if (this.motionController) {
            const flagElement = this.flagRibbon.ribbonElement.querySelector(`[data-country="${country.code}"]`);
            if (flagElement) {
                this.motionController.animateFlagSelection(flagElement, country);
            }
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for country selection from flag ribbon
        if (this.flagRibbon && this.flagRibbon.ribbonElement) {
            this.flagRibbon.ribbonElement.addEventListener('countrySelected', (e) => {
                this.handleCountrySelection(e.detail);
            });
        }
        
        // Listen for mode changes
        if (this.modeController) {
            document.addEventListener('ribbonModeChange', (e) => {
                this.handleModeChange(e.detail);
            });
        }
        
        // Listen for window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Listen for storage changes (user data updates)
        window.addEventListener('storage', (e) => {
            if (e.key === 'mpesewa_user' || e.key === 'mpesewa_user_role') {
                this.handleUserDataChange();
            }
        });
    }

    /**
     * Handle mode change
     */
    handleModeChange(modeDetail) {
        // Update ribbon for new mode
        this.updateRibbonForMode(modeDetail.config);
        
        // Dispatch controller event
        this.dispatchEvent('modeChanged', modeDetail);
        
        // Log mode change
        console.log(`Ribbon mode changed to: ${modeDetail.modeName}`);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Auto-switch to mobile mode if needed
        if (window.innerWidth <= 768 && this.modeController) {
            const currentMode = this.modeController.getCurrentMode();
            if (!currentMode.context.includes('mobile-view')) {
                this.modeController.setMode('mobile-compact', 'mobile-view');
            }
        }
        
        // Update ribbon if needed
        if (this.flagRibbon) {
            this.flagRibbon.render();
        }
    }

    /**
     * Handle user data change
     */
    handleUserDataChange() {
        // Reload user data
        this.loadUserData().then(() => {
            // Re-apply hierarchy rules
            this.applyHierarchyRules();
            
            // Update mode based on new role
            if (this.modeController) {
                this.modeController.autoDetectMode();
            }
        });
    }

    /**
     * Handle initialization error
     */
    handleInitializationError(error) {
        // Create fallback ribbon
        this.createFallbackRibbon();
        
        // Dispatch error event
        this.dispatchEvent('initializationError', {
            error: error,
            timestamp: new Date().toISOString()
        });
        
        console.error('RibbonController initialization failed, using fallback:', error);
    }

    /**
     * Create fallback ribbon
     */
    createFallbackRibbon() {
        const fallback = document.createElement('div');
        fallback.className = 'ribbon-fallback';
        fallback.innerHTML = `
            <div class="fallback-content">
                <span class="fallback-title">M-Pesewa Countries</span>
                <div class="fallback-flags">
                    🇰🇪 🇺🇬 🇹🇿 🇷🇼 🇨🇩 🇧🇮 🇳🇬 🇬🇭 🇸🇸 🇸🇴 🇿🇦 🇪🇹
                </div>
            </div>
        `;
        
        this.config.container.appendChild(fallback);
    }

    /**
     * Dispatch custom event
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`ribbon:${eventName}`, {
            detail: detail,
            bubbles: true
        });
        
        this.config.container.dispatchEvent(event);
        
        // Call registered listeners
        const listeners = this.listeners.get(eventName) || [];
        listeners.forEach(listener => listener(detail));
    }

    /**
     * Add event listener
     */
    addEventListener(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(callback);
    }

    /**
     * Remove event listener
     */
    removeEventListener(eventName, callback) {
        if (!this.listeners.has(eventName)) return;
        
        const listeners = this.listeners.get(eventName);
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    /**
     * Get controller status
     */
    getStatus() {
        return {
            initialized: this.state.initialized,
            components: {
                flagRibbon: !!this.flagRibbon,
                motionController: !!this.motionController,
                modeController: !!this.modeController
            },
            state: {
                currentCountry: this.state.currentCountry,
                currentGroup: this.state.currentGroup ? this.state.currentGroup.name : null,
                userRole: this.config.userRole,
                hierarchy: this.state.hierarchy,
                violations: this.state.violations.length
            },
            config: {
                enforceHierarchy: this.config.enforceHierarchy,
                enableAnimations: this.config.enableAnimations,
                enableModes: this.config.enableModes
            }
        };
    }

    /**
     * Public method to select country
     */
    selectCountry(countryCode) {
        const country = window.mpesewaFlagData.getCountryByCode(countryCode);
        if (country) {
            this.handleCountrySelection(country);
            return true;
        }
        return false;
    }

    /**
     * Public method to set user role
     */
    setUserRole(role) {
        const validRoles = ['guest', 'borrower', 'lender', 'group-admin', 'admin'];
        if (!validRoles.includes(role)) {
            console.warn(`Invalid role: ${role}`);
            return false;
        }
        
        this.config.userRole = role;
        localStorage.setItem('mpesewa_user_role', role);
        
        // Update hierarchy rules
        this.applyHierarchyRules();
        
        // Dispatch event
        this.dispatchEvent('userRoleChanged', {
            role: role,
            previousRole: this.state.previousRole
        });
        
        this.state.previousRole = role;
        return true;
    }

    /**
     * Public method to set mode
     */
    setMode(modeName) {
        if (!this.modeController) {
            console.warn('Mode controller not initialized');
            return false;
        }
        
        return this.modeController.setMode(modeName);
    }

    /**
     * Public method to get current mode
     */
    getCurrentMode() {
        return this.modeController ? this.modeController.getCurrentMode() : null;
    }

    /**
     * Public method to validate hierarchy
     */
    validateHierarchy() {
        const validations = this.validateCurrentState();
        const violations = this.state.violations;
        
        return {
            valid: violations.length === 0 && validations.every(v => v.valid),
            validations: validations,
            violations: violations,
            hierarchy: this.state.hierarchy
        };
    }

    /**
     * Public method to export configuration
     */
    exportConfig() {
        return {
            state: this.state,
            config: this.config,
            rules: this.state.rules,
            status: this.getStatus()
        };
    }

    /**
     * Public method to import configuration
     */
    importConfig(config) {
        if (config.state) {
            this.state = { ...this.state, ...config.state };
        }
        if (config.config) {
            this.config = { ...this.config, ...config.config };
        }
        
        // Re-apply hierarchy rules
        this.applyHierarchyRules();
        
        return true;
    }

    /**
     * Clean up resources
     */
    destroy() {
        // Destroy components
        if (this.flagRibbon) this.flagRibbon.destroy();
        if (this.motionController) this.motionController.destroy();
        if (this.modeController) this.modeController.destroy();
        
        // Remove event listeners
        this.listeners.clear();
        
        // Remove fallback if exists
        const fallback = document.querySelector('.ribbon-fallback');
        if (fallback) fallback.remove();
        
        this.state.initialized = false;
        
        console.log('RibbonController destroyed');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RibbonController;
}

// Auto-initialize if data-ribbon-controller attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const controllerElements = document.querySelectorAll('[data-ribbon-controller]');
    controllerElements.forEach(element => {
        const config = {
            container: element,
            autoInit: element.getAttribute('data-auto-init') !== 'false',
            enforceHierarchy: element.getAttribute('data-enforce-hierarchy') !== 'false',
            enableAnimations: element.getAttribute('data-enable-animations') !== 'false',
            enableModes: element.getAttribute('data-enable-modes') !== 'false',
            defaultMode: element.getAttribute('data-default-mode') || 'global-overview',
            userRole: element.getAttribute('data-user-role') || 'guest'
        };
        
        window.mpesewaRibbonController = new RibbonController(config);
    });
});