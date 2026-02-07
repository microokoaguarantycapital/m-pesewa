/**
 * M-Pesewa Flag Ribbon Display Modes
 * Defines different display modes for the flag ribbon based on context and hierarchy
 */

class RibbonModes {
    constructor() {
        this.modes = new Map();
        this.currentMode = 'default';
        this.context = 'global';
        this.hierarchyLevel = 0;
        
        // Initialize all modes
        this.initModes();
    }

    /**
     * Initialize all display modes
     */
    initModes() {
        // ============================================
        // MODE 1: Global Overview (Default)
        // ============================================
        this.modes.set('global-overview', {
            name: 'Global Overview',
            description: 'Show all countries with equal prominence',
            hierarchy: 'global',
            layout: 'horizontal-scroll',
            flags: {
                display: 'all',
                size: 'medium',
                labels: true,
                interactive: true,
                grouping: 'none',
                order: 'alphabetical'
            },
            hierarchyDisplay: {
                enabled: true,
                level: 'global',
                showStats: true,
                interactive: true
            },
            animations: {
                onLoad: 'slide-in',
                onSelect: 'bounce',
                onHover: 'glow'
            },
            rules: {
                allowCountrySelect: true,
                allowGroupView: false,
                allowLenderView: false,
                maxFlags: 12,
                enforceIsolation: false
            },
            context: ['home', 'global-dashboard', 'landing'],
            cssClass: 'mode-global-overview'
        });

        // ============================================
        // MODE 2: Country Focus
        // ============================================
        this.modes.set('country-focus', {
            name: 'Country Focus',
            description: 'Highlight selected country with its groups',
            hierarchy: 'country',
            layout: 'centered',
            flags: {
                display: 'selected',
                size: 'large',
                labels: true,
                interactive: false,
                grouping: 'none',
                order: 'selected-first'
            },
            hierarchyDisplay: {
                enabled: true,
                level: 'country',
                showStats: true,
                interactive: true
            },
            animations: {
                onLoad: 'fade-in',
                onSelect: 'pulse',
                onHover: 'none'
            },
            rules: {
                allowCountrySelect: false,
                allowGroupView: true,
                allowLenderView: false,
                maxFlags: 1,
                enforceIsolation: true
            },
            context: ['country-dashboard', 'country-admin', 'country-stats'],
            cssClass: 'mode-country-focus'
        });

        // ============================================
        // MODE 3: Group Management
        // ============================================
        this.modes.set('group-management', {
            name: 'Group Management',
            description: 'Show groups within a country',
            hierarchy: 'group',
            layout: 'vertical-stack',
            flags: {
                display: 'country-groups',
                size: 'small',
                labels: true,
                interactive: true,
                grouping: 'by-type',
                order: 'member-count'
            },
            hierarchyDisplay: {
                enabled: true,
                level: 'group',
                showStats: true,
                interactive: true
            },
            animations: {
                onLoad: 'stagger-fade',
                onSelect: 'highlight',
                onHover: 'scale'
            },
            rules: {
                allowCountrySelect: false,
                allowGroupView: true,
                allowLenderView: true,
                maxFlags: 50,
                enforceIsolation: true
            },
            context: ['group-admin', 'group-browser', 'group-stats'],
            cssClass: 'mode-group-management'
        });

        // ============================================
        // MODE 4: Lender Dashboard
        // ============================================
        this.modes.set('lender-dashboard', {
            name: 'Lender Dashboard',
            description: 'Lender-specific view with ledgers',
            hierarchy: 'lender',
            layout: 'compact',
            flags: {
                display: 'lender-groups',
                size: 'small',
                labels: false,
                interactive: true,
                grouping: 'by-status',
                order: 'recent-activity'
            },
            hierarchyDisplay: {
                enabled: true,
                level: 'lender',
                showStats: true,
                interactive: true
            },
            animations: {
                onLoad: 'quick-fade',
                onSelect: 'quick-bounce',
                onHover: 'quick-glow'
            },
            rules: {
                allowCountrySelect: false,
                allowGroupView: true,
                allowLenderView: true,
                maxFlags: 4,
                enforceIsolation: true
            },
            context: ['lender-dashboard', 'lender-portfolio', 'lending-activity'],
            cssClass: 'mode-lender-dashboard'
        });

        // ============================================
        // MODE 5: Borrower Dashboard
        // ============================================
        this.modes.set('borrower-dashboard', {
            name: 'Borrower Dashboard',
            description: 'Borrower-specific view with active loans',
            hierarchy: 'borrower',
            layout: 'minimal',
            flags: {
                display: 'borrower-groups',
                size: 'small',
                labels: false,
                interactive: true,
                grouping: 'by-repayment',
                order: 'due-date'
            },
            hierarchyDisplay: {
                enabled: false,
                level: 'borrower',
                showStats: true,
                interactive: false
            },
            animations: {
                onLoad: 'subtle-fade',
                onSelect: 'gentle-pulse',
                onHover: 'none'
            },
            rules: {
                allowCountrySelect: false,
                allowGroupView: true,
                allowLenderView: false,
                maxFlags: 4,
                enforceIsolation: true
            },
            context: ['borrower-dashboard', 'loan-requests', 'repayment-tracker'],
            cssClass: 'mode-borrower-dashboard'
        });

        // ============================================
        // MODE 6: Admin Control
        // ============================================
        this.modes.set('admin-control', {
            name: 'Admin Control',
            description: 'Full control view for platform administrators',
            hierarchy: 'global',
            layout: 'expanded',
            flags: {
                display: 'all',
                size: 'medium',
                labels: true,
                interactive: true,
                grouping: 'by-activity',
                order: 'custom'
            },
            hierarchyDisplay: {
                enabled: true,
                level: 'all',
                showStats: true,
                interactive: true
            },
            animations: {
                onLoad: 'none',
                onSelect: 'highlight',
                onHover: 'glow'
            },
            rules: {
                allowCountrySelect: true,
                allowGroupView: true,
                allowLenderView: true,
                maxFlags: 12,
                enforceIsolation: false
            },
            context: ['admin-dashboard', 'system-control', 'audit-view'],
            cssClass: 'mode-admin-control'
        });

        // ============================================
        // MODE 7: Mobile Compact
        // ============================================
        this.modes.set('mobile-compact', {
            name: 'Mobile Compact',
            description: 'Optimized for small screens',
            hierarchy: 'context-aware',
            layout: 'dropdown',
            flags: {
                display: 'contextual',
                size: 'small',
                labels: false,
                interactive: true,
                grouping: 'none',
                order: 'alphabetical'
            },
            hierarchyDisplay: {
                enabled: false,
                level: 'none',
                showStats: false,
                interactive: false
            },
            animations: {
                onLoad: 'slide-up',
                onSelect: 'tap-feedback',
                onHover: 'none'
            },
            rules: {
                allowCountrySelect: true,
                allowGroupView: false,
                allowLenderView: false,
                maxFlags: 6,
                enforceIsolation: true
            },
            context: ['mobile-view', 'small-screen'],
            cssClass: 'mode-mobile-compact'
        });

        // ============================================
        // MODE 8: Presentation Mode
        // ============================================
        this.modes.set('presentation-mode', {
            name: 'Presentation Mode',
            description: 'Enhanced visuals for demonstrations',
            hierarchy: 'global',
            layout: 'centered-grid',
            flags: {
                display: 'all',
                size: 'large',
                labels: true,
                interactive: false,
                grouping: 'by-region',
                order: 'custom'
            },
            hierarchyDisplay: {
                enabled: true,
                level: 'global',
                showStats: true,
                interactive: false
            },
            animations: {
                onLoad: 'sequence-entrance',
                onSelect: 'wave-effect',
                onHover: 'gentle-glow'
            },
            rules: {
                allowCountrySelect: false,
                allowGroupView: false,
                allowLenderView: false,
                maxFlags: 12,
                enforceIsolation: false
            },
            context: ['demo', 'presentation', 'tour'],
            cssClass: 'mode-presentation'
        });

        // ============================================
        // MODE 9: Analytics View
        // ============================================
        this.modes.set('analytics-view', {
            name: 'Analytics View',
            description: 'Data-focused display with statistics',
            hierarchy: 'global',
            layout: 'data-grid',
            flags: {
                display: 'all',
                size: 'small',
                labels: true,
                interactive: true,
                grouping: 'by-metrics',
                order: 'performance'
            },
            hierarchyDisplay: {
                enabled: true,
                level: 'statistical',
                showStats: true,
                interactive: true
            },
            animations: {
                onLoad: 'data-load',
                onSelect: 'metric-highlight',
                onHover: 'data-tooltip'
            },
            rules: {
                allowCountrySelect: true,
                allowGroupView: true,
                allowLenderView: true,
                maxFlags: 12,
                enforceIsolation: false
            },
            context: ['analytics', 'reports', 'metrics'],
            cssClass: 'mode-analytics'
        });

        // ============================================
        // MODE 10: Emergency Mode
        // ============================================
        this.modes.set('emergency-mode', {
            name: 'Emergency Mode',
            description: 'Simplified view for urgent situations',
            hierarchy: 'contextual',
            layout: 'minimal-alert',
            flags: {
                display: 'essential',
                size: 'medium',
                labels: true,
                interactive: false,
                grouping: 'none',
                order: 'priority'
            },
            hierarchyDisplay: {
                enabled: false,
                level: 'none',
                showStats: false,
                interactive: false
            },
            animations: {
                onLoad: 'alert-pulse',
                onSelect: 'quick-response',
                onHover: 'none'
            },
            rules: {
                allowCountrySelect: true,
                allowGroupView: false,
                allowLenderView: false,
                maxFlags: 1,
                enforceIsolation: true
            },
            context: ['emergency', 'urgent', 'alert'],
            cssClass: 'mode-emergency'
        });
    }

    /**
     * Get mode configuration
     */
    getMode(modeName) {
        return this.modes.get(modeName) || this.modes.get('global-overview');
    }

    /**
     * Set current mode
     */
    setMode(modeName, context = null) {
        const mode = this.getMode(modeName);
        if (!mode) {
            console.warn(`Mode "${modeName}" not found`);
            return false;
        }

        this.currentMode = modeName;
        if (context) {
            this.context = context;
        }

        // Update hierarchy level
        this.hierarchyLevel = this.getHierarchyLevelNumber(mode.hierarchy);

        // Dispatch mode change event
        this.dispatchModeChange(mode);
        
        return true;
    }

    /**
     * Get current mode configuration
     */
    getCurrentMode() {
        return this.getMode(this.currentMode);
    }

    /**
     * Get mode based on context
     */
    getModeForContext(context) {
        // Find all modes that support this context
        const suitableModes = Array.from(this.modes.values())
            .filter(mode => mode.context.includes(context));
        
        // Return the first suitable mode, or default
        return suitableModes.length > 0 ? suitableModes[0] : this.getMode('global-overview');
    }

    /**
     * Auto-detect and set mode based on URL and user role
     */
    autoDetectMode() {
        const path = window.location.pathname;
        const userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
        
        // Map paths to contexts
        const pathContexts = {
            '/': 'home',
            '/index.html': 'home',
            '/dashboard': 'global-dashboard',
            '/countries': 'global-dashboard',
            '/countries/': 'country-dashboard',
            '/lender/': 'lender-dashboard',
            '/borrower/': 'borrower-dashboard',
            '/admin/': 'admin-dashboard',
            '/groups/': 'group-admin',
            '/analytics': 'analytics',
            '/emergency': 'emergency'
        };

        // Determine context from path
        let context = 'home';
        for (const [pathPattern, pathContext] of Object.entries(pathContexts)) {
            if (path.includes(pathPattern)) {
                context = pathContext;
                break;
            }
        }

        // Adjust based on user role
        if (userRole === 'admin' && context === 'global-dashboard') {
            context = 'admin-dashboard';
        }

        // Check for mobile
        const isMobile = window.innerWidth <= 768;
        if (isMobile && !context.includes('mobile')) {
            context = 'mobile-view';
        }

        // Get and set appropriate mode
        const modeForContext = this.getModeForContext(context);
        const modeName = Array.from(this.modes.entries())
            .find(([name, mode]) => mode.name === modeForContext.name)[0];
        
        this.setMode(modeName, context);
        return this.getCurrentMode();
    }

    /**
     * Convert hierarchy string to level number
     */
    getHierarchyLevelNumber(hierarchy) {
        const levels = {
            'global': 0,
            'country': 1,
            'group': 2,
            'lender': 3,
            'borrower': 3,
            'ledger': 4,
            'context-aware': -1,
            'statistical': -2,
            'all': -3,
            'none': -4
        };
        
        return levels[hierarchy] || 0;
    }

    /**
     * Get hierarchy level name from number
     */
    getHierarchyLevelName(level) {
        const names = {
            0: 'global',
            1: 'country',
            2: 'group',
            3: 'lender/borrower',
            4: 'ledger'
        };
        
        return names[level] || 'unknown';
    }

    /**
     * Validate if transition between modes is allowed
     */
    validateModeTransition(fromMode, toMode) {
        const fromConfig = this.getMode(fromMode);
        const toConfig = this.getMode(toMode);
        
        // Check hierarchy constraints
        const fromLevel = this.getHierarchyLevelNumber(fromConfig.hierarchy);
        const toLevel = this.getHierarchyLevelNumber(toConfig.hierarchy);
        
        // Basic validation rules
        const rules = {
            // Can't jump from global to ledger without intermediate steps
            allowDirectJump: Math.abs(fromLevel - toLevel) <= 2,
            
            // Can't switch to admin mode without admin role
            allowAdminMode: toMode !== 'admin-control' || 
                           localStorage.getItem('mpesewa_user_role') === 'admin',
            
            // Can't switch to emergency mode without emergency context
            allowEmergencyMode: toMode !== 'emergency-mode' || 
                               this.context === 'emergency'
        };
        
        return Object.values(rules).every(rule => rule === true);
    }

    /**
     * Get all available modes for current user
     */
    getAvailableModes() {
        const userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
        const isMobile = window.innerWidth <= 768;
        
        return Array.from(this.modes.entries())
            .filter(([name, mode]) => {
                // Filter based on user role
                if (name === 'admin-control' && userRole !== 'admin') {
                    return false;
                }
                
                // Filter based on device
                if (isMobile && !mode.context.includes('mobile-view') && 
                    !mode.context.includes('small-screen')) {
                    // Allow mobile-specific modes and universal modes
                    const universalModes = ['global-overview', 'presentation-mode', 'emergency-mode'];
                    return universalModes.includes(name);
                }
                
                return true;
            })
            .map(([name, mode]) => ({
                id: name,
                name: mode.name,
                description: mode.description,
                hierarchy: mode.hierarchy,
                context: mode.context,
                allowed: this.validateModeTransition(this.currentMode, name)
            }));
    }

    /**
     * Apply mode configuration to ribbon element
     */
    applyModeToRibbon(ribbonElement, modeConfig) {
        // Remove all mode classes
        ribbonElement.className = ribbonElement.className
            .split(' ')
            .filter(cls => !cls.startsWith('mode-'))
            .join(' ');
        
        // Add current mode class
        ribbonElement.classList.add(modeConfig.cssClass);
        
        // Set data attributes
        ribbonElement.setAttribute('data-mode', this.currentMode);
        ribbonElement.setAttribute('data-hierarchy', modeConfig.hierarchy);
        ribbonElement.setAttribute('data-context', this.context);
        
        // Apply layout-specific styles
        this.applyLayoutStyles(ribbonElement, modeConfig.layout);
    }

    /**
     * Apply layout-specific styles
     */
    applyLayoutStyles(ribbonElement, layout) {
        const styleMap = {
            'horizontal-scroll': {
                overflowX: 'auto',
                overflowY: 'hidden',
                flexWrap: 'nowrap'
            },
            'vertical-stack': {
                overflowX: 'hidden',
                overflowY: 'auto',
                flexDirection: 'column'
            },
            'centered': {
                justifyContent: 'center',
                alignItems: 'center'
            },
            'compact': {
                padding: '4px',
                gap: '2px'
            },
            'minimal': {
                padding: '2px',
                border: 'none',
                background: 'transparent'
            },
            'expanded': {
                padding: '16px',
                gap: '12px'
            },
            'centered-grid': {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '12px'
            },
            'data-grid': {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '8px'
            },
            'minimal-alert': {
                background: 'rgba(243, 112, 33, 0.1)',
                border: '2px solid #f37021',
                animation: 'pulse 2s infinite'
            },
            'dropdown': {
                display: 'block',
                position: 'relative'
            }
        };
        
        const styles = styleMap[layout] || {};
        Object.assign(ribbonElement.style, styles);
    }

    /**
     * Dispatch mode change event
     */
    dispatchModeChange(modeConfig) {
        const event = new CustomEvent('ribbonModeChange', {
            detail: {
                mode: this.currentMode,
                modeName: modeConfig.name,
                hierarchy: modeConfig.hierarchy,
                context: this.context,
                config: modeConfig
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Get mode statistics
     */
    getModeStatistics() {
        const stats = {
            totalModes: this.modes.size,
            currentMode: this.currentMode,
            currentHierarchy: this.getHierarchyLevelName(this.hierarchyLevel),
            context: this.context,
            availableModes: this.getAvailableModes().length,
            userRole: localStorage.getItem('mpesewa_user_role') || 'guest',
            isMobile: window.innerWidth <= 768,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
        
        return stats;
    }

    /**
     * Export mode configurations
     */
    exportConfigurations() {
        const configs = {};
        this.modes.forEach((config, name) => {
            configs[name] = {
                ...config,
                allowed: this.validateModeTransition(this.currentMode, name)
            };
        });
        
        return configs;
    }

    /**
     * Import mode configurations
     */
    importConfigurations(configs) {
        Object.entries(configs).forEach(([name, config]) => {
            this.modes.set(name, config);
        });
    }

    /**
     * Create custom mode
     */
    createCustomMode(name, config) {
        const defaultConfig = {
            name: name,
            description: 'Custom mode configuration',
            hierarchy: 'global',
            layout: 'horizontal-scroll',
            flags: {
                display: 'all',
                size: 'medium',
                labels: true,
                interactive: true,
                grouping: 'none',
                order: 'alphabetical'
            },
            hierarchyDisplay: {
                enabled: true,
                level: 'global',
                showStats: true,
                interactive: true
            },
            animations: {
                onLoad: 'slide-in',
                onSelect: 'bounce',
                onHover: 'glow'
            },
            rules: {
                allowCountrySelect: true,
                allowGroupView: false,
                allowLenderView: false,
                maxFlags: 12,
                enforceIsolation: false
            },
            context: ['custom'],
            cssClass: `mode-${name.toLowerCase().replace(/\s+/g, '-')}`
        };
        
        const customConfig = { ...defaultConfig, ...config };
        this.modes.set(name, customConfig);
        
        return customConfig;
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.modes.clear();
        this.currentMode = 'default';
        this.context = 'global';
        this.hierarchyLevel = 0;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RibbonModes;
}