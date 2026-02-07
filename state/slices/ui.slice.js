/**
 * M-PESEWA UI STATE SLICE
 * Manages all UI state, theme, layout, and user interface interactions
 * STRICT HIERARCHY: Global → Country → Groups → Lenders → Borrowers (Ledgers)
 * 
 * RULES:
 * 1. Theme must follow brand colors exactly
 * 2. Country isolation for UI preferences
 * 3. Role-based UI visibility
 * 4. Subscription-based feature access
 * 5. Responsive design states
 */

const UI_CONFIG = {
    // Initial state structure
    initialState: {
        // Theme and Brand Colors (STRICT ENFORCEMENT)
        theme: {
            mode: 'light', // 'light' | 'dark' | 'system'
            colors: {
                // Primary Brand Colors (NON-NEGOTIABLE)
                primaryBlue: '#003366',      // Headers, footers, main headings
                secondaryBlue: '#0099ff',    // Links, floating card glow, secondary highlights
                actionOrange: '#f37021',     // Borrower buttons / Apply Now
                trustGreen: '#28a745',       // Lender sections, success indicators
                neutralLight: '#f8f9fa',     // Section separation background
                pureWhite: '#ffffff',        // Main cards, body background
                textDark: '#003366',         // Dark text on white
                textLight: '#ffffff',        // White text on dark
                textBody: '#555555',         // Body text
                danger: '#dc3545',           // Error states
                warning: '#ffc107',          // Warning states
                info: '#17a2b8',             // Info states
                success: '#28a745',          // Success states
            },
            // Color rules enforcement
            rules: {
                // NEVER place Deep Blue text on Orange or Green buttons — always White text
                // White background → Dark text (#003366)
                // Dark background → White text (#ffffff)
                // Cards must float with light sky blue glow (#0099ff)
            }
        },
        
        // Layout and Responsive States
        layout: {
            // Breakpoints (in pixels)
            breakpoints: {
                xs: 0,
                sm: 640,
                md: 768,
                lg: 1024,
                xl: 1280,
                xxl: 1536
            },
            // Current viewport
            viewport: {
                width: typeof window !== 'undefined' ? window.innerWidth : 1024,
                height: typeof window !== 'undefined' ? window.innerHeight : 768,
                breakpoint: 'lg',
                orientation: 'landscape',
                isTouchDevice: false
            },
            // Component visibility
            components: {
                header: {
                    sticky: true,
                    visible: true,
                    height: 72
                },
                sidebar: {
                    collapsed: false,
                    width: 280,
                    miniWidth: 80
                },
                footer: {
                    visible: true,
                    fixed: false
                },
                mobileDrawer: {
                    open: false,
                    position: 'left',
                    width: 320
                }
            },
            // Grid settings
            grid: {
                columns: 12,
                gutter: 24,
                containerMaxWidth: 1200
            }
        },
        
        // Navigation State (STRICT HIERARCHY ENFORCEMENT)
        navigation: {
            // Current location in hierarchy
            hierarchy: {
                global: true,
                country: null,           // Selected country code (KE, UG, TZ, etc.)
                group: null,             // Current group ID
                role: null,              // 'lender' | 'borrower' | 'admin' | 'guest'
                page: 'home',            // Current page
                subpage: null,           // Subpage if any
                // Breadcrumb trail
                breadcrumbs: []
            },
            
            // Navigation history
            history: [],
            maxHistoryLength: 50,
            
            // Menu states
            menus: {
                main: {
                    expanded: true,
                    activeItem: 'home'
                },
                lenders: {
                    expanded: false,
                    activeItem: null
                },
                borrowers: {
                    expanded: false,
                    activeItem: null
                },
                emergencyHub: {
                    expanded: false,
                    activeItem: null
                },
                subscriptions: {
                    expanded: false,
                    activeItem: null
                },
                country: {
                    expanded: false,
                    activeItem: null
                }
            },
            
            // Tab states
            tabs: {},
            
            // Scroll positions (for restoring on navigation)
            scrollPositions: {}
        },
        
        // User Interface Preferences
        preferences: {
            // Display preferences
            display: {
                density: 'comfortable',  // 'compact' | 'comfortable' | 'spacious'
                fontSize: 'medium',      // 'small' | 'medium' | 'large'
                reduceMotion: false,
                highContrast: false,
                colorBlindMode: 'none',  // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
                animations: true,
                transitions: true
            },
            
            // Language and localization
            language: {
                current: 'en',
                available: ['en', 'sw', 'fr'],
                region: null,  // Auto-detected from country
                dateFormat: 'dd/MM/yyyy',
                timeFormat: '24h',
                currencyFormat: {
                    symbol: 'KSh',
                    position: 'before',
                    decimals: 2,
                    separator: ',',
                    decimal: '.'
                }
            },
            
            // Notification preferences
            notifications: {
                enabled: true,
                sound: true,
                vibration: true,
                desktop: false,
                email: false,
                push: false,
                categories: {
                    loans: true,
                    repayments: true,
                    subscriptions: true,
                    groups: true,
                    system: true,
                    marketing: false
                }
            },
            
            // Data preferences
            data: {
                autoSave: true,
                syncInterval: 300,  // seconds
                offlineMode: true,
                cacheDuration: 7,   // days
                exportFormat: 'json'
            }
        },
        
        // Modal and Overlay States
        modals: {
            // Active modals stack
            active: [],
            // Modal configurations
            configurations: {
                login: {
                    size: 'sm',
                    backdrop: true,
                    closeOnEscape: true,
                    closeOnOutsideClick: false
                },
                register: {
                    size: 'md',
                    backdrop: true,
                    closeOnEscape: true,
                    closeOnOutsideClick: false
                },
                loanApplication: {
                    size: 'lg',
                    backdrop: true,
                    closeOnEscape: false,
                    closeOnOutsideClick: false
                },
                lenderApproval: {
                    size: 'md',
                    backdrop: true,
                    closeOnEscape: true,
                    closeOnOutsideClick: false
                },
                subscriptionUpgrade: {
                    size: 'lg',
                    backdrop: true,
                    closeOnEscape: true,
                    closeOnOutsideClick: false
                },
                emergencyCategory: {
                    size: 'xl',
                    backdrop: true,
                    closeOnEscape: true,
                    closeOnOutsideClick: true
                }
            }
        },
        
        // Toast and Notification Queue
        toasts: {
            queue: [],
            position: 'top-right',
            duration: 5000,
            limit: 5,
            // Toast types
            types: {
                success: {
                    icon: '✓',
                    color: '#28a745',
                    bgColor: '#d4edda'
                },
                error: {
                    icon: '✗',
                    color: '#dc3545',
                    bgColor: '#f8d7da'
                },
                warning: {
                    icon: '⚠',
                    color: '#ffc107',
                    bgColor: '#fff3cd'
                },
                info: {
                    icon: 'ℹ',
                    color: '#17a2b8',
                    bgColor: '#d1ecf1'
                }
            }
        },
        
        // Loading States
        loading: {
            global: false,
            components: {},
            requests: {},
            progress: {
                visible: false,
                value: 0,
                indeterminate: false,
                message: ''
            }
        },
        
        // Error States
        errors: {
            global: null,
            components: {},
            validation: {},
            network: null,
            lastError: null
        },
        
        // Form States
        forms: {
            active: null,
            dirty: {},
            validation: {},
            submissions: {},
            autoSave: {}
        },
        
        // Feature Flags (Subscription-based visibility)
        features: {
            // Based on subscription tier
            lender: {
                basic: ['dashboard', 'ledgers', 'history', 'rules'],
                premium: ['dashboard', 'ledgers', 'history', 'rules', 'portfolio', 'analytics', 'export'],
                super: ['dashboard', 'ledgers', 'history', 'rules', 'portfolio', 'analytics', 'export', 'advancedRisk', 'bulkOperations'],
                lenderOfLenders: ['dashboard', 'ledgers', 'history', 'rules', 'portfolio', 'analytics', 'export', 'advancedRisk', 'bulkOperations', 'customTerms']
            },
            borrower: {
                basic: ['dashboard', 'apply', 'history', 'repayments'],
                premium: ['dashboard', 'apply', 'history', 'repayments', 'multipleGroups', 'betterRates'],
                super: ['dashboard', 'apply', 'history', 'repayments', 'multipleGroups', 'betterRates', 'prioritySupport']
            },
            // UI feature toggles
            ui: {
                darkMode: true,
                advancedCharts: true,
                realTimeUpdates: true,
                offlineMode: true,
                pwaInstall: true,
                keyboardShortcuts: true,
                voiceCommands: false
            }
        },
        
        // Country-Specific UI Settings (STRICT ISOLATION)
        countrySettings: {
            // Example: Kenya
            'KE': {
                theme: {
                    // Can override theme per country
                },
                layout: {
                    // Country-specific layout adjustments
                },
                features: {
                    // Country-specific feature availability
                },
                legal: {
                    // Legal requirements for UI
                    showCountryFlag: true,
                    showRegulatoryBadge: true,
                    requiredDisclosures: ['cbr', 'interest_rate_disclosure']
                }
            },
            // Other countries will have similar structures
        },
        
        // Analytics and Tracking
        analytics: {
            enabled: true,
            consent: {
                necessary: true,
                performance: false,
                functional: false,
                marketing: false
            },
            pageViews: [],
            events: [],
            userJourney: [],
            performance: {
                pageLoadTimes: {},
                componentRenderTimes: {}
            }
        },
        
        // Accessibility State
        accessibility: {
            screenReader: false,
            keyboardNavigation: true,
            focusVisible: true,
            reducedMotion: false,
            highContrast: false,
            fontSize: 16,
            lineHeight: 1.5,
            colorScheme: 'light',
            // WCAG compliance tracking
            compliance: {
                level: 'AA',
                lastChecked: null,
                violations: [],
                passes: []
            }
        },
        
        // PWA State
        pwa: {
            installed: false,
            deferredPrompt: null,
            updateAvailable: false,
            offline: false,
            backgroundSync: false,
            pushNotification: false,
            // Installation metrics
            installation: {
                shown: 0,
                dismissed: 0,
                installed: 0
            }
        },
        
        // Session State
        session: {
            idle: false,
            idleTimeout: 900, // 15 minutes in seconds
            lastActivity: Date.now(),
            expiresAt: null,
            // Tab/window focus
            focus: true,
            visibility: 'visible',
            // Network status
            online: typeof navigator !== 'undefined' ? navigator.onLine : true,
            connection: {
                effectiveType: '4g',
                downlink: 10,
                rtt: 50,
                saveData: false
            }
        },
        
        // UI Flags and Toggles
        flags: {
            onboardingComplete: false,
            tourActive: false,
            helpVisible: false,
            searchVisible: false,
            filtersVisible: false,
            debugMode: false,
            devTools: false
        },
        
        // Cache State
        cache: {
            lastCleaned: null,
            size: 0,
            entries: {},
            // Country-specific cache isolation
            countryCache: {}
        }
    },
    
    // Country Configuration (12 African Countries)
    COUNTRIES: [
        {
            code: 'KE',
            name: 'Kenya',
            currency: 'KSh',
            flag: '🇰🇪',
            theme: {},
            contact: '+254 709 219 000',
            legal: {
                regulator: 'Central Bank of Kenya',
                maxInterest: 0.10, // 10%
                maxPenalty: 0.05,   // 5% daily
                requireCRB: false
            }
        },
        {
            code: 'UG',
            name: 'Uganda',
            currency: 'UGX',
            flag: '🇺🇬',
            theme: {},
            contact: '+256 392 175 546',
            legal: {
                regulator: 'Bank of Uganda',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: false
            }
        },
        {
            code: 'TZ',
            name: 'Tanzania',
            currency: 'TZS',
            flag: '🇹🇿',
            theme: {},
            contact: '+255 659 073 010',
            legal: {
                regulator: 'Bank of Tanzania',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: false
            }
        },
        {
            code: 'RW',
            name: 'Rwanda',
            currency: 'RWF',
            flag: '🇷🇼',
            theme: {},
            contact: '+250 791 590 801',
            legal: {
                regulator: 'National Bank of Rwanda',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: false
            }
        },
        {
            code: 'CD',
            name: 'DRC',
            currency: 'CDF',
            flag: '🇨🇩',
            theme: {},
            contact: '+243 81 000 0000',
            legal: {
                regulator: 'Central Bank of Congo',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: false
            }
        },
        {
            code: 'BI',
            name: 'Burundi',
            currency: 'BIF',
            flag: '🇧🇮',
            theme: {},
            contact: '+257 79 000 000',
            legal: {
                regulator: 'Bank of the Republic of Burundi',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: false
            }
        },
        {
            code: 'NG',
            name: 'Nigeria',
            currency: 'NGN',
            flag: '🇳🇬',
            theme: {},
            contact: '+234 800 000 0000',
            legal: {
                regulator: 'Central Bank of Nigeria',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: true
            }
        },
        {
            code: 'GH',
            name: 'Ghana',
            currency: 'GHS',
            flag: '🇬🇭',
            theme: {},
            contact: '+233 24 000 0000',
            legal: {
                regulator: 'Bank of Ghana',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: true
            }
        },
        {
            code: 'SS',
            name: 'South Sudan',
            currency: 'SSP',
            flag: '🇸🇸',
            theme: {},
            contact: '+211 955 000 000',
            legal: {
                regulator: 'Bank of South Sudan',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: false
            }
        },
        {
            code: 'SO',
            name: 'Somalia',
            currency: 'SOS',
            flag: '🇸🇴',
            theme: {},
            contact: '+252 63 0000000',
            legal: {
                regulator: 'Central Bank of Somalia',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: false
            }
        },
        {
            code: 'ZA',
            name: 'South Africa',
            currency: 'ZAR',
            flag: '🇿🇦',
            theme: {},
            contact: '+27 11 000 0000',
            legal: {
                regulator: 'South African Reserve Bank',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: true
            }
        },
        {
            code: 'ET',
            name: 'Ethiopia',
            currency: 'ETB',
            flag: '🇪🇹',
            theme: {},
            contact: '+251 11 000 0000',
            legal: {
                regulator: 'National Bank of Ethiopia',
                maxInterest: 0.10,
                maxPenalty: 0.05,
                requireCRB: true
            }
        }
    ],
    
    // Role-based UI configurations
    ROLES: {
        lender: {
            dashboard: 'lender/dashboard.html',
            menuItems: ['dashboard', 'portfolio', 'history', 'rules', 'risk', 'subscription'],
            theme: {
                primaryColor: '#28a745', // Trust Green for lenders
                accentColor: '#0099ff'
            }
        },
        borrower: {
            dashboard: 'borrower/dashboard.html',
            menuItems: ['dashboard', 'apply', 'history', 'repayments', 'disputes'],
            theme: {
                primaryColor: '#f37021', // Action Orange for borrowers
                accentColor: '#0099ff'
            }
        },
        admin: {
            dashboard: 'admin/dashboard.html',
            menuItems: ['dashboard', 'users', 'groups', 'ledgers', 'blacklist', 'subscriptions', 'audit', 'settings'],
            theme: {
                primaryColor: '#003366',
                accentColor: '#dc3545'
            }
        },
        guest: {
            dashboard: 'index.html',
            menuItems: ['home', 'about', 'how-it-works', 'contact', 'countries'],
            theme: {
                primaryColor: '#003366',
                accentColor: '#0099ff'
            }
        }
    },
    
    // Subscription tier UI features
    SUBSCRIPTION_TIERS: {
        basic: {
            name: 'Basic',
            color: '#6c757d',
            maxAmount: 1500,
            features: ['dashboard', 'basic_ledgers', 'history', 'rules'],
            uiRestrictions: ['no_advanced_charts', 'no_bulk_operations', 'no_export']
        },
        premium: {
            name: 'Premium',
            color: '#007bff',
            maxAmount: 5000,
            features: ['dashboard', 'advanced_ledgers', 'history', 'rules', 'portfolio', 'analytics', 'export'],
            uiRestrictions: ['no_advanced_risk', 'no_custom_terms']
        },
        super: {
            name: 'Super',
            color: '#28a745',
            maxAmount: 20000,
            features: ['dashboard', 'advanced_ledgers', 'history', 'rules', 'portfolio', 'analytics', 'export', 'advanced_risk', 'bulk_operations'],
            uiRestrictions: []
        },
        lenderOfLenders: {
            name: 'Lender of Lenders',
            color: '#003366',
            maxAmount: 50000,
            features: ['dashboard', 'advanced_ledgers', 'history', 'rules', 'portfolio', 'analytics', 'export', 'advanced_risk', 'bulk_operations', 'custom_terms'],
            uiRestrictions: []
        }
    }
};

/**
 * Create a new UI slice with all required functionality
 */
const createUISlice = () => {
    let state = JSON.parse(JSON.stringify(UI_CONFIG.initialState));
    
    // Initialize from localStorage
    const initialize = () => {
        try {
            const saved = localStorage.getItem('mpesewa_ui_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
            }
            
            // Initialize country settings if not present
            UI_CONFIG.COUNTRIES.forEach(country => {
                if (!state.countrySettings[country.code]) {
                    state.countrySettings[country.code] = {
                        theme: {},
                        layout: {},
                        features: {},
                        legal: {
                            showCountryFlag: true,
                            showRegulatoryBadge: true,
                            requiredDisclosures: []
                        }
                    };
                }
            });
            
            // Detect initial viewport
            if (typeof window !== 'undefined') {
                updateViewport();
                detectTouchDevice();
                detectNetworkStatus();
                
                // Add event listeners
                window.addEventListener('resize', updateViewport);
                window.addEventListener('online', () => setOnlineStatus(true));
                window.addEventListener('offline', () => setOnlineStatus(false));
                document.addEventListener('visibilitychange', updateVisibility);
                
                // Idle detection
                setupIdleDetection();
            }
            
            // Apply theme
            applyTheme();
            
            saveState();
            return true;
        } catch (error) {
            console.error('Failed to initialize UI state:', error);
            return false;
        }
    };
    
    // Save state to localStorage
    const saveState = () => {
        try {
            localStorage.setItem('mpesewa_ui_state', JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save UI state:', error);
        }
    };
    
    // Apply theme to document
    const applyTheme = () => {
        if (typeof document === 'undefined') return;
        
        const root = document.documentElement;
        const colors = state.theme.colors;
        
        // Set CSS custom properties
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
        });
        
        // Set theme mode
        root.setAttribute('data-theme', state.theme.mode);
        
        // Set brand colors as CSS variables with proper names
        root.style.setProperty('--brand-primary', colors.primaryBlue);
        root.style.setProperty('--brand-secondary', colors.secondaryBlue);
        root.style.setProperty('--brand-action', colors.actionOrange);
        root.style.setProperty('--brand-trust', colors.trustGreen);
        root.style.setProperty('--brand-neutral', colors.neutralLight);
        root.style.setProperty('--brand-white', colors.pureWhite);
        
        // Apply accessibility settings
        if (state.accessibility.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
        
        if (state.accessibility.reducedMotion) {
            root.classList.add('reduced-motion');
        } else {
            root.classList.remove('reduced-motion');
        }
        
        // Set font size
        document.body.style.fontSize = `${state.accessibility.fontSize}px`;
        document.body.style.lineHeight = state.accessibility.lineHeight.toString();
    };
    
    // Update viewport dimensions
    const updateViewport = () => {
        if (typeof window === 'undefined') return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Determine breakpoint
        let breakpoint = 'xs';
        if (width >= state.layout.breakpoints.xxl) breakpoint = 'xxl';
        else if (width >= state.layout.breakpoints.xl) breakpoint = 'xl';
        else if (width >= state.layout.breakpoints.lg) breakpoint = 'lg';
        else if (width >= state.layout.breakpoints.md) breakpoint = 'md';
        else if (width >= state.layout.breakpoints.sm) breakpoint = 'sm';
        
        // Determine orientation
        const orientation = width > height ? 'landscape' : 'portrait';
        
        state.layout.viewport = {
            width,
            height,
            breakpoint,
            orientation,
            isTouchDevice: state.layout.viewport.isTouchDevice
        };
        
        saveState();
        
        // Dispatch event for components to react
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:viewportchange', {
                detail: state.layout.viewport
            }));
        }
    };
    
    // Detect touch device
    const detectTouchDevice = () => {
        if (typeof window === 'undefined') return;
        
        state.layout.viewport.isTouchDevice = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
        
        saveState();
    };
    
    // Detect network status
    const detectNetworkStatus = () => {
        if (typeof navigator === 'undefined') return;
        
        state.session.online = navigator.onLine;
        
        // Get connection info if available
        if (navigator.connection) {
            state.session.connection = {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        
        saveState();
    };
    
    // Set online status
    const setOnlineStatus = (online) => {
        state.session.online = online;
        saveState();
        
        // Dispatch event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:networkchange', {
                detail: { online }
            }));
        }
    };
    
    // Update visibility state
    const updateVisibility = () => {
        if (typeof document === 'undefined') return;
        
        state.session.visibility = document.visibilityState;
        state.session.focus = document.visibilityState === 'visible';
        saveState();
    };
    
    // Setup idle detection
    const setupIdleDetection = () => {
        if (typeof window === 'undefined') return;
        
        const resetIdleTimer = () => {
            state.session.lastActivity = Date.now();
            if (state.session.idle) {
                state.session.idle = false;
                saveState();
                
                window.dispatchEvent(new CustomEvent('mpesewa:useractive'));
            }
        };
        
        const checkIdle = () => {
            const idleTime = (Date.now() - state.session.lastActivity) / 1000;
            if (!state.session.idle && idleTime > state.session.idleTimeout) {
                state.session.idle = true;
                saveState();
                
                window.dispatchEvent(new CustomEvent('mpesewa:useridle'));
            }
        };
        
        // Add event listeners for user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            window.addEventListener(event, resetIdleTimer, { passive: true });
        });
        
        // Check idle every minute
        setInterval(checkIdle, 60000);
    };
    
    // STRICT HIERARCHY ENFORCEMENT - Update navigation hierarchy
    const updateHierarchy = (updates) => {
        state.navigation.hierarchy = {
            ...state.navigation.hierarchy,
            ...updates
        };
        
        // Update breadcrumbs based on hierarchy
        updateBreadcrumbs();
        
        // Save to history
        addToHistory({
            ...state.navigation.hierarchy,
            timestamp: Date.now()
        });
        
        saveState();
        
        // Dispatch hierarchy change event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:hierarchychange', {
                detail: state.navigation.hierarchy
            }));
        }
        
        return state.navigation.hierarchy;
    };
    
    // Update breadcrumbs based on current hierarchy
    const updateBreadcrumbs = () => {
        const { country, group, role, page, subpage } = state.navigation.hierarchy;
        const breadcrumbs = [];
        
        // Always start with Global
        breadcrumbs.push({
            label: 'Global',
            path: '/',
            level: 'global'
        });
        
        // Add country if selected
        if (country) {
            const countryInfo = UI_CONFIG.COUNTRIES.find(c => c.code === country);
            breadcrumbs.push({
                label: countryInfo ? countryInfo.name : country,
                path: `/countries/${country}`,
                level: 'country'
            });
            
            // Add group if selected
            if (group) {
                breadcrumbs.push({
                    label: `Group: ${group}`,
                    path: `/countries/${country}/groups/${group}`,
                    level: 'group'
                });
                
                // Add role if selected
                if (role) {
                    breadcrumbs.push({
                        label: `${role.charAt(0).toUpperCase() + role.slice(1)}`,
                        path: `/countries/${country}/groups/${group}/${role}`,
                        level: 'role'
                    });
                    
                    // Add page if selected
                    if (page) {
                        breadcrumbs.push({
                            label: page.charAt(0).toUpperCase() + page.slice(1),
                            path: `/countries/${country}/groups/${group}/${role}/${page}`,
                            level: 'page'
                        });
                        
                        // Add subpage if selected
                        if (subpage) {
                            breadcrumbs.push({
                                label: subpage.charAt(0).toUpperCase() + subpage.slice(1),
                                path: `/countries/${country}/groups/${group}/${role}/${page}/${subpage}`,
                                level: 'subpage'
                            });
                        }
                    }
                }
            }
        }
        
        state.navigation.hierarchy.breadcrumbs = breadcrumbs;
    };
    
    // Add to navigation history
    const addToHistory = (entry) => {
        state.navigation.history.unshift(entry);
        
        // Limit history length
        if (state.navigation.history.length > state.navigation.maxHistoryLength) {
            state.navigation.history = state.navigation.history.slice(0, state.navigation.maxHistoryLength);
        }
        
        saveState();
    };
    
    // Navigate back
    const navigateBack = () => {
        if (state.navigation.history.length > 1) {
            // Remove current entry
            state.navigation.history.shift();
            // Get previous entry
            const previous = state.navigation.history[0];
            state.navigation.hierarchy = {
                ...state.navigation.hierarchy,
                ...previous
            };
            
            updateBreadcrumbs();
            saveState();
            
            return previous;
        }
        return null;
    };
    
    // Get current hierarchy path
    const getCurrentPath = () => {
        const { country, group, role, page, subpage } = state.navigation.hierarchy;
        let path = '/';
        
        if (country) {
            path += `countries/${country}/`;
            if (group) {
                path += `groups/${group}/`;
                if (role) {
                    path += `${role}/`;
                    if (page) {
                        path += `${page}/`;
                        if (subpage) {
                            path += `${subpage}/`;
                        }
                    }
                }
            }
        }
        
        return path.replace(/\/+/g, '/');
    };
    
    // THEME MANAGEMENT
    
    // Set theme mode
    const setThemeMode = (mode) => {
        if (!['light', 'dark', 'system'].includes(mode)) {
            throw new Error('Invalid theme mode. Must be "light", "dark", or "system"');
        }
        
        state.theme.mode = mode;
        applyTheme();
        saveState();
        
        // Dispatch theme change event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:themechange', {
                detail: { mode, colors: state.theme.colors }
            }));
        }
        
        return state.theme;
    };
    
    // Update color scheme
    const updateColors = (colorUpdates) => {
        // Validate brand colors (NON-NEGOTIABLE)
        const protectedColors = ['primaryBlue', 'secondaryBlue', 'actionOrange', 'trustGreen', 'neutralLight', 'pureWhite'];
        
        Object.keys(colorUpdates).forEach(key => {
            if (protectedColors.includes(key)) {
                console.warn(`Color ${key} is protected and cannot be modified`);
                delete colorUpdates[key];
            }
        });
        
        state.theme.colors = {
            ...state.theme.colors,
            ...colorUpdates
        };
        
        applyTheme();
        saveState();
        
        return state.theme.colors;
    };
    
    // Get color for specific use case
    const getColor = (useCase) => {
        const colorMap = {
            'header-bg': state.theme.colors.primaryBlue,
            'header-text': state.theme.colors.textLight,
            'footer-bg': state.theme.colors.primaryBlue,
            'footer-text': state.theme.colors.textLight,
            'borrower-button': state.theme.colors.actionOrange,
            'lender-button': state.theme.colors.trustGreen,
            'secondary-button': state.theme.colors.secondaryBlue,
            'card-bg': state.theme.colors.pureWhite,
            'card-text': state.theme.colors.textDark,
            'card-glow': state.theme.colors.secondaryBlue,
            'section-bg': state.theme.colors.neutralLight,
            'link': state.theme.colors.secondaryBlue,
            'success': state.theme.colors.success,
            'error': state.theme.colors.danger,
            'warning': state.theme.colors.warning,
            'info': state.theme.colors.info
        };
        
        return colorMap[useCase] || state.theme.colors.primaryBlue;
    };
    
    // Validate color combination for accessibility
    const validateColorCombination = (backgroundColor, textColor) => {
        // Simple WCAG contrast ratio calculation (simplified)
        // In a real implementation, use a proper contrast ratio algorithm
        const colorPairs = [
            [state.theme.colors.primaryBlue, state.theme.colors.textLight],    // Dark blue + White ✓
            [state.theme.colors.pureWhite, state.theme.colors.textDark],       // White + Dark blue ✓
            [state.theme.colors.actionOrange, state.theme.colors.textLight],   // Orange + White ✓
            [state.theme.colors.trustGreen, state.theme.colors.textLight],     // Green + White ✓
        ];
        
        const pair = [backgroundColor, textColor];
        return colorPairs.some(validPair => 
            validPair[0] === pair[0] && validPair[1] === pair[1]
        );
    };
    
    // MODAL MANAGEMENT
    
    // Open modal
    const openModal = (modalId, data = {}) => {
        const config = state.modals.configurations[modalId] || {
            size: 'md',
            backdrop: true,
            closeOnEscape: true,
            closeOnOutsideClick: true
        };
        
        const modal = {
            id: modalId,
            data,
            config,
            openedAt: Date.now(),
            zIndex: 1000 + state.modals.active.length
        };
        
        state.modals.active.push(modal);
        saveState();
        
        // Dispatch modal open event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:modalopen', {
                detail: modal
            }));
        }
        
        return modal;
    };
    
    // Close modal
    const closeModal = (modalId) => {
        const index = state.modals.active.findIndex(m => m.id === modalId);
        if (index !== -1) {
            const modal = state.modals.active[index];
            state.modals.active.splice(index, 1);
            saveState();
            
            // Dispatch modal close event
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('mpesewa:modalclose', {
                    detail: modal
                }));
            }
            
            return modal;
        }
        return null;
    };
    
    // Close all modals
    const closeAllModals = () => {
        const closed = [...state.modals.active];
        state.modals.active = [];
        saveState();
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:modalcloseall'));
        }
        
        return closed;
    };
    
    // Get active modal
    const getActiveModal = () => {
        return state.modals.active.length > 0 
            ? state.modals.active[state.modals.active.length - 1]
            : null;
    };
    
    // TOAST MANAGEMENT
    
    // Show toast
    const showToast = (message, type = 'info', options = {}) => {
        const toastConfig = state.toasts.types[type] || state.toasts.types.info;
        
        const toast = {
            id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message,
            type,
            ...toastConfig,
            ...options,
            createdAt: Date.now(),
            duration: options.duration || state.toasts.duration,
            position: options.position || state.toasts.position
        };
        
        state.toasts.queue.push(toast);
        
        // Limit queue size
        if (state.toasts.queue.length > state.toasts.limit) {
            state.toasts.queue.shift();
        }
        
        saveState();
        
        // Auto-remove toast after duration
        setTimeout(() => {
            removeToast(toast.id);
        }, toast.duration);
        
        // Dispatch toast event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:toastshow', {
                detail: toast
            }));
        }
        
        return toast;
    };
    
    // Remove toast
    const removeToast = (toastId) => {
        const index = state.toasts.queue.findIndex(t => t.id === toastId);
        if (index !== -1) {
            const toast = state.toasts.queue[index];
            state.toasts.queue.splice(index, 1);
            saveState();
            
            // Dispatch toast remove event
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('mpesewa:toastremove', {
                    detail: toast
                }));
            }
            
            return toast;
        }
        return null;
    };
    
    // Clear all toasts
    const clearToasts = () => {
        const cleared = [...state.toasts.queue];
        state.toasts.queue = [];
        saveState();
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:toastclearall'));
        }
        
        return cleared;
    };
    
    // LOADING STATE MANAGEMENT
    
    // Set global loading state
    const setGlobalLoading = (loading, message = '') => {
        state.loading.global = loading;
        if (message) {
            state.loading.progress.message = message;
        }
        saveState();
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:loadingchange', {
                detail: { global: loading, message }
            }));
        }
        
        return state.loading.global;
    };
    
    // Set component loading state
    const setComponentLoading = (componentId, loading, message = '') => {
        state.loading.components[componentId] = { loading, message };
        saveState();
        
        return state.loading.components[componentId];
    };
    
    // Set progress
    const setProgress = (progress) => {
        state.loading.progress = {
            ...state.loading.progress,
            ...progress
        };
        saveState();
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:progresschange', {
                detail: state.loading.progress
            }));
        }
        
        return state.loading.progress;
    };
    
    // ERROR STATE MANAGEMENT
    
    // Set global error
    const setGlobalError = (error) => {
        state.errors.global = error;
        state.errors.lastError = {
            error,
            timestamp: Date.now(),
            stack: error instanceof Error ? error.stack : null
        };
        saveState();
        
        // Show error toast
        showToast(error.message || 'An error occurred', 'error');
        
        // Dispatch error event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:error', {
                detail: error
            }));
        }
        
        return state.errors.global;
    };
    
    // Clear global error
    const clearGlobalError = () => {
        state.errors.global = null;
        saveState();
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:errorcleared'));
        }
        
        return true;
    };
    
    // Set component error
    const setComponentError = (componentId, error) => {
        state.errors.components[componentId] = error;
        saveState();
        
        return state.errors.components[componentId];
    };
    
    // Clear component error
    const clearComponentError = (componentId) => {
        delete state.errors.components[componentId];
        saveState();
        
        return true;
    };
    
    // FORM STATE MANAGEMENT
    
    // Set active form
    const setActiveForm = (formId) => {
        state.forms.active = formId;
        saveState();
        
        return state.forms.active;
    };
    
    // Set form dirty state
    const setFormDirty = (formId, dirty) => {
        state.forms.dirty[formId] = dirty;
        saveState();
        
        return state.forms.dirty[formId];
    };
    
    // Set form validation
    const setFormValidation = (formId, validation) => {
        state.forms.validation[formId] = validation;
        saveState();
        
        return state.forms.validation[formId];
    };
    
    // Set form submission state
    const setFormSubmission = (formId, submitting, result = null) => {
        state.forms.submissions[formId] = {
            submitting,
            result,
            submittedAt: submitting ? Date.now() : null,
            completedAt: !submitting ? Date.now() : null
        };
        saveState();
        
        return state.forms.submissions[formId];
    };
    
    // PWA STATE MANAGEMENT
    
    // Set PWA installed state
    const setPWAInstalled = (installed) => {
        state.pwa.installed = installed;
        if (installed) {
            state.pwa.installation.installed++;
        }
        saveState();
        
        return state.pwa.installed;
    };
    
    // Set deferred prompt
    const setDeferredPrompt = (prompt) => {
        state.pwa.deferredPrompt = prompt;
        saveState();
        
        return state.pwa.deferredPrompt;
    };
    
    // Set update available
    const setUpdateAvailable = (available) => {
        state.pwa.updateAvailable = available;
        saveState();
        
        if (available && typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:updateavailable'));
        }
        
        return state.pwa.updateAvailable;
    };
    
    // Set offline state
    const setOffline = (offline) => {
        state.pwa.offline = offline;
        saveState();
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:offlinestatechange', {
                detail: { offline }
            }));
        }
        
        return state.pwa.offline;
    };
    
    // PWA installation metrics
    const trackInstallationEvent = (event) => {
        if (event === 'shown') state.pwa.installation.shown++;
        else if (event === 'dismissed') state.pwa.installation.dismissed++;
        else if (event === 'installed') state.pwa.installation.installed++;
        
        saveState();
        
        return state.pwa.installation;
    };
    
    // ACCESSIBILITY MANAGEMENT
    
    // Toggle accessibility feature
    const toggleAccessibility = (feature, value = null) => {
        if (value !== null) {
            state.accessibility[feature] = value;
        } else {
            state.accessibility[feature] = !state.accessibility[feature];
        }
        
        // Apply changes
        applyTheme();
        saveState();
        
        // Dispatch accessibility change event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:accessibilitychange', {
                detail: { feature, value: state.accessibility[feature] }
            }));
        }
        
        return state.accessibility[feature];
    };
    
    // Set font size
    const setFontSize = (size) => {
        if (size < 12 || size > 24) {
            throw new Error('Font size must be between 12 and 24');
        }
        
        state.accessibility.fontSize = size;
        applyTheme();
        saveState();
        
        return state.accessibility.fontSize;
    };
    
    // Set line height
    const setLineHeight = (height) => {
        if (height < 1.0 || height > 2.0) {
            throw new Error('Line height must be between 1.0 and 2.0');
        }
        
        state.accessibility.lineHeight = height;
        applyTheme();
        saveState();
        
        return state.accessibility.lineHeight;
    };
    
    // PREFERENCES MANAGEMENT
    
    // Update display preferences
    const updateDisplayPreferences = (preferences) => {
        state.preferences.display = {
            ...state.preferences.display,
            ...preferences
        };
        saveState();
        
        // Apply density if changed
        if (preferences.density && typeof document !== 'undefined') {
            document.body.setAttribute('data-density', preferences.density);
        }
        
        return state.preferences.display;
    };
    
    // Update language preferences
    const updateLanguagePreferences = (preferences) => {
        state.preferences.language = {
            ...state.preferences.language,
            ...preferences
        };
        saveState();
        
        // Dispatch language change event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mpesewa:languagechange', {
                detail: state.preferences.language
            }));
        }
        
        return state.preferences.language;
    };
    
    // Update notification preferences
    const updateNotificationPreferences = (preferences) => {
        state.preferences.notifications = {
            ...state.preferences.notifications,
            ...preferences
        };
        saveState();
        
        return state.preferences.notifications;
    };
    
    // FEATURE FLAG MANAGEMENT
    
    // Check if feature is available for role and subscription
    const isFeatureAvailable = (feature, role, subscriptionTier) => {
        if (!UI_CONFIG.ROLES[role]) return false;
        
        const roleFeatures = state.features[role];
        if (!roleFeatures) return false;
        
        // Check subscription tier features
        const tierFeatures = roleFeatures[subscriptionTier] || [];
        return tierFeatures.includes(feature);
    };
    
    // Get available features for role and subscription
    const getAvailableFeatures = (role, subscriptionTier) => {
        if (!UI_CONFIG.ROLES[role]) return [];
        
        const roleFeatures = state.features[role];
        if (!roleFeatures) return [];
        
        return roleFeatures[subscriptionTier] || [];
    };
    
    // Toggle UI feature
    const toggleUIFeature = (feature, enabled = null) => {
        if (enabled !== null) {
            state.features.ui[feature] = enabled;
        } else {
            state.features.ui[feature] = !state.features.ui[feature];
        }
        saveState();
        
        return state.features.ui[feature];
    };
    
    // COUNTRY-SPECIFIC UI MANAGEMENT
    
    // Get country UI settings
    const getCountrySettings = (countryCode) => {
        return state.countrySettings[countryCode] || {};
    };
    
    // Update country UI settings
    const updateCountrySettings = (countryCode, settings) => {
        if (!state.countrySettings[countryCode]) {
            state.countrySettings[countryCode] = {};
        }
        
        state.countrySettings[countryCode] = {
            ...state.countrySettings[countryCode],
            ...settings
        };
        saveState();
        
        return state.countrySettings[countryCode];
    };
    
    // Get current country info
    const getCurrentCountryInfo = () => {
        const countryCode = state.navigation.hierarchy.country;
        if (!countryCode) return null;
        
        return UI_CONFIG.COUNTRIES.find(c => c.code === countryCode) || null;
    };
    
    // ANALYTICS AND TRACKING
    
    // Track page view
    const trackPageView = (page, duration = 0) => {
        const pageView = {
            page,
            timestamp: Date.now(),
            duration,
            hierarchy: { ...state.navigation.hierarchy },
            viewport: { ...state.layout.viewport },
            session: {
                online: state.session.online,
                idle: state.session.idle
            }
        };
        
        state.analytics.pageViews.push(pageView);
        
        // Limit page views history
        if (state.analytics.pageViews.length > 100) {
            state.analytics.pageViews.shift();
        }
        
        saveState();
        
        return pageView;
    };
    
    // Track event
    const trackEvent = (category, action, label = null, value = null) => {
        const event = {
            category,
            action,
            label,
            value,
            timestamp: Date.now(),
            hierarchy: { ...state.navigation.hierarchy }
        };
        
        state.analytics.events.push(event);
        
        // Limit events history
        if (state.analytics.events.length > 500) {
            state.analytics.events.shift();
        }
        
        saveState();
        
        return event;
    };
    
    // Track user journey
    const trackUserJourney = (step, data = {}) => {
        const journeyStep = {
            step,
            data,
            timestamp: Date.now(),
            hierarchy: { ...state.navigation.hierarchy }
        };
        
        state.analytics.userJourney.push(journeyStep);
        saveState();
        
        return journeyStep;
    };
    
    // Track performance
    const trackPerformance = (metric, value, component = null) => {
        if (!state.analytics.performance[metric]) {
            state.analytics.performance[metric] = [];
        }
        
        const performanceEntry = {
            metric,
            value,
            component,
            timestamp: Date.now()
        };
        
        state.analytics.performance[metric].push(performanceEntry);
        
        // Limit performance entries
        if (state.analytics.performance[metric].length > 50) {
            state.analytics.performance[metric].shift();
        }
        
        saveState();
        
        return performanceEntry;
    };
    
    // Update analytics consent
    const updateAnalyticsConsent = (consent) => {
        state.analytics.consent = {
            ...state.analytics.consent,
            ...consent
        };
        
        // If analytics disabled, clear existing data
        if (!state.analytics.consent.performance) {
            state.analytics.events = [];
            state.analytics.userJourney = [];
        }
        
        saveState();
        
        return state.analytics.consent;
    };
    
    // FLAG MANAGEMENT
    
    // Set flag
    const setFlag = (flag, value) => {
        state.flags[flag] = value;
        saveState();
        
        return state.flags[flag];
    };
    
    // Toggle flag
    const toggleFlag = (flag) => {
        state.flags[flag] = !state.flags[flag];
        saveState();
        
        return state.flags[flag];
    };
    
    // CACHE MANAGEMENT
    
    // Cache data
    const cacheData = (key, data, countryCode = null) => {
        const cacheKey = countryCode ? `${countryCode}_${key}` : key;
        state.cache.entries[cacheKey] = {
            data,
            cachedAt: Date.now(),
            expiresAt: Date.now() + (state.preferences.data.cacheDuration * 24 * 60 * 60 * 1000)
        };
        
        state.cache.size = Object.keys(state.cache.entries).length;
        saveState();
        
        return cacheKey;
    };
    
    // Get cached data
    const getCachedData = (key, countryCode = null) => {
        const cacheKey = countryCode ? `${countryCode}_${key}` : key;
        const entry = state.cache.entries[cacheKey];
        
        if (!entry) return null;
        
        // Check if expired
        if (Date.now() > entry.expiresAt) {
            delete state.cache.entries[cacheKey];
            state.cache.size = Object.keys(state.cache.entries).length;
            saveState();
            return null;
        }
        
        return entry.data;
    };
    
    // Clear cache
    const clearCache = (key = null, countryCode = null) => {
        if (key) {
            const cacheKey = countryCode ? `${countryCode}_${key}` : key;
            delete state.cache.entries[cacheKey];
        } else {
            state.cache.entries = {};
        }
        
        state.cache.size = Object.keys(state.cache.entries).length;
        state.cache.lastCleaned = Date.now();
        saveState();
        
        return true;
    };
    
    // Clean expired cache
    const cleanExpiredCache = () => {
        const now = Date.now();
        let cleaned = 0;
        
        Object.keys(state.cache.entries).forEach(key => {
            if (state.cache.entries[key].expiresAt < now) {
                delete state.cache.entries[key];
                cleaned++;
            }
        });
        
        state.cache.size = Object.keys(state.cache.entries).length;
        state.cache.lastCleaned = Date.now();
        saveState();
        
        return cleaned;
    };
    
    // UTILITY FUNCTIONS
    
    // Get current state
    const getState = () => {
        return JSON.parse(JSON.stringify(state));
    };
    
    // Reset state (for testing)
    const resetState = () => {
        state = JSON.parse(JSON.stringify(UI_CONFIG.initialState));
        initialize();
        return true;
    };
    
    // Subscribe to state changes
    const subscribe = (callback) => {
        let lastState = JSON.stringify(state);
        
        const checkForChanges = () => {
            const currentState = JSON.stringify(state);
            if (currentState !== lastState) {
                lastState = currentState;
                callback(JSON.parse(currentState));
            }
        };
        
        const interval = setInterval(checkForChanges, 100);
        
        return () => clearInterval(interval);
    };
    
    // Initialize
    initialize();
    
    // Return public API
    return {
        // State getters
        getState,
        getCurrentPath,
        getCurrentCountryInfo,
        getColor,
        getAvailableFeatures,
        getCountrySettings,
        
        // Hierarchy management
        updateHierarchy,
        navigateBack,
        
        // Theme management
        setThemeMode,
        updateColors,
        validateColorCombination,
        
        // Modal management
        openModal,
        closeModal,
        closeAllModals,
        getActiveModal,
        
        // Toast management
        showToast,
        removeToast,
        clearToasts,
        
        // Loading management
        setGlobalLoading,
        setComponentLoading,
        setProgress,
        
        // Error management
        setGlobalError,
        clearGlobalError,
        setComponentError,
        clearComponentError,
        
        // Form management
        setActiveForm,
        setFormDirty,
        setFormValidation,
        setFormSubmission,
        
        // PWA management
        setPWAInstalled,
        setDeferredPrompt,
        setUpdateAvailable,
        setOffline,
        trackInstallationEvent,
        
        // Accessibility management
        toggleAccessibility,
        setFontSize,
        setLineHeight,
        
        // Preferences management
        updateDisplayPreferences,
        updateLanguagePreferences,
        updateNotificationPreferences,
        
        // Feature management
        isFeatureAvailable,
        toggleUIFeature,
        
        // Country management
        updateCountrySettings,
        
        // Analytics
        trackPageView,
        trackEvent,
        trackUserJourney,
        trackPerformance,
        updateAnalyticsConsent,
        
        // Flags
        setFlag,
        toggleFlag,
        
        // Cache management
        cacheData,
        getCachedData,
        clearCache,
        cleanExpiredCache,
        
        // Utility
        subscribe,
        resetState,
        
        // Configuration
        getConfig: () => UI_CONFIG,
        
        // Current state reference
        state: () => JSON.parse(JSON.stringify(state))
    };
};

// Create and export singleton instance
const uiSlice = createUISlice();

// Export for use in other modules
export default uiSlice;
export { UI_CONFIG };