/**
 * M-PESEWA APPLICATION INITIALIZATION
 * Bootstraps the application with strict hierarchy and rule enforcement
 */

class MPesewaAppInitializer {
    constructor() {
        this.initializationSteps = [
            'ENVIRONMENT_CHECK',
            'DEPENDENCY_LOAD',
            'CONFIGURATION_LOAD',
            'HIERARCHY_INIT',
            'USER_SESSION_LOAD',
            'COUNTRY_SELECTION',
            'GROUP_SELECTION',
            'ROLE_SELECTION',
            'SUBSCRIPTION_CHECK',
            'UI_INITIALIZATION',
            'EVENT_SYSTEM_SETUP',
            'SERVICE_WORKER_REGISTRATION',
            'SYNC_INITIALIZATION',
            'READY'
        ];

        this.currentStep = 0;
        this.initializationStatus = {
            isComplete: false,
            hasErrors: false,
            errors: [],
            warnings: [],
            startTime: null,
            endTime: null,
            duration: null
        };

        this.config = {
            appName: 'M-Pesewa',
            version: '1.0.0',
            environment: this.detectEnvironment(),
            debugMode: this.isDebugMode(),
            supportedBrowsers: ['chrome', 'firefox', 'safari', 'edge'],
            minSupportedVersion: {
                chrome: 80,
                firefox: 75,
                safari: 13,
                edge: 80
            },
            features: {
                pwa: true,
                offlineSupport: true,
                pushNotifications: true,
                backgroundSync: true,
                indexedDB: true,
                serviceWorker: true
            }
        };

        // Core module references
        this.modules = {
            lifecycle: null,
            appShell: null,
            stateManager: null,
            router: null,
            auth: null,
            sync: null,
            cache: null,
            notifications: null
        };
    }

    /**
     * MAIN INITIALIZATION ENTRY POINT
     */
    async initialize() {
        console.log(`[APP-INIT] Starting M-Pesewa initialization v${this.config.version}`);
        
        this.initializationStatus.startTime = Date.now();
        
        try {
            for (const step of this.initializationSteps) {
                await this.executeStep(step);
                this.currentStep++;
            }
            
            await this.finalizeInitialization();
        } catch (error) {
            await this.handleInitializationError(error);
            throw error;
        }
    }

    async executeStep(step) {
        console.log(`[APP-INIT] Executing step: ${step}`);
        
        const stepStartTime = Date.now();
        
        try {
            switch (step) {
                case 'ENVIRONMENT_CHECK':
                    await this.checkEnvironment();
                    break;
                    
                case 'DEPENDENCY_LOAD':
                    await this.loadDependencies();
                    break;
                    
                case 'CONFIGURATION_LOAD':
                    await this.loadConfiguration();
                    break;
                    
                case 'HIERARCHY_INIT':
                    await this.initializeHierarchy();
                    break;
                    
                case 'USER_SESSION_LOAD':
                    await this.loadUserSession();
                    break;
                    
                case 'COUNTRY_SELECTION':
                    await this.handleCountrySelection();
                    break;
                    
                case 'GROUP_SELECTION':
                    await this.handleGroupSelection();
                    break;
                    
                case 'ROLE_SELECTION':
                    await this.handleRoleSelection();
                    break;
                    
                case 'SUBSCRIPTION_CHECK':
                    await this.checkSubscription();
                    break;
                    
                case 'UI_INITIALIZATION':
                    await this.initializeUI();
                    break;
                    
                case 'EVENT_SYSTEM_SETUP':
                    await this.setupEventSystem();
                    break;
                    
                case 'SERVICE_WORKER_REGISTRATION':
                    await this.registerServiceWorker();
                    break;
                    
                case 'SYNC_INITIALIZATION':
                    await this.initializeSync();
                    break;
                    
                case 'READY':
                    await this.setReadyState();
                    break;
            }
            
            const stepDuration = Date.now() - stepStartTime;
            console.log(`[APP-INIT] Step ${step} completed in ${stepDuration}ms`);
            
        } catch (error) {
            console.error(`[APP-INIT] Error in step ${step}:`, error);
            this.initializationStatus.errors.push({
                step,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }

    /**
     * ENVIRONMENT VALIDATION
     */
    async checkEnvironment() {
        console.log('[APP-INIT] Checking environment...');
        
        // Check browser compatibility
        await this.checkBrowserCompatibility();
        
        // Check JavaScript features
        await this.checkJavaScriptFeatures();
        
        // Check storage availability
        await this.checkStorageAvailability();
        
        // Check network status
        await this.checkNetworkStatus();
        
        // Check screen size
        await this.checkScreenSize();
        
        console.log('[APP-INIT] Environment check passed');
    }

    async checkBrowserCompatibility() {
        const browser = this.detectBrowser();
        const version = this.getBrowserVersion();
        
        if (!this.config.supportedBrowsers.includes(browser)) {
            throw new Error(`Browser ${browser} is not supported. Please use Chrome, Firefox, Safari, or Edge.`);
        }
        
        const minVersion = this.config.minSupportedVersion[browser];
        if (version < minVersion) {
            throw new Error(`${browser} version ${version} is not supported. Minimum version is ${minVersion}.`);
        }
        
        console.log(`[APP-INIT] Browser: ${browser} ${version} - OK`);
    }

    async checkJavaScriptFeatures() {
        const requiredFeatures = [
            'Promise',
            'fetch',
            'localStorage',
            'sessionStorage',
            'indexedDB',
            'serviceWorker',
            'Notification',
            'PushManager',
            'SyncManager'
        ];
        
        const missingFeatures = [];
        
        requiredFeatures.forEach(feature => {
            if (!window[feature]) {
                missingFeatures.push(feature);
            }
        });
        
        if (missingFeatures.length > 0) {
            throw new Error(`Missing required JavaScript features: ${missingFeatures.join(', ')}`);
        }
        
        console.log('[APP-INIT] JavaScript features check passed');
    }

    async checkStorageAvailability() {
        try {
            // Test localStorage
            localStorage.setItem('mpesewa_test', 'test');
            localStorage.removeItem('mpesewa_test');
            
            // Test sessionStorage
            sessionStorage.setItem('mpesewa_test', 'test');
            sessionStorage.removeItem('mpesewa_test');
            
            console.log('[APP-INIT] Storage availability check passed');
        } catch (error) {
            throw new Error('Storage is not available or is disabled. Please enable storage in your browser settings.');
        }
    }

    async checkNetworkStatus() {
        if (!navigator.onLine) {
            this.initializationStatus.warnings.push({
                type: 'NETWORK_OFFLINE',
                message: 'Application is starting offline. Some features may be limited.'
            });
            console.warn('[APP-INIT] Starting in offline mode');
        } else {
            console.log('[APP-INIT] Network status: Online');
        }
    }

    async checkScreenSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (width < 320 || height < 480) {
            this.initializationStatus.warnings.push({
                type: 'SCREEN_SIZE',
                message: 'Screen size may be too small for optimal experience'
            });
        }
        
        console.log(`[APP-INIT] Screen size: ${width}x${height}`);
    }

    /**
     * DEPENDENCY LOADING
     */
    async loadDependencies() {
        console.log('[APP-INIT] Loading dependencies...');
        
        // Load core modules
        await this.loadCoreModules();
        
        // Load third-party dependencies
        await this.loadThirdPartyDependencies();
        
        // Verify all dependencies are loaded
        await this.verifyDependencies();
        
        console.log('[APP-INIT] Dependencies loaded successfully');
    }

    async loadCoreModules() {
        // These would be dynamic imports in a real application
        try {
            // Load lifecycle manager
            const { getLifecycleManager } = await import('./lifecycle.js');
            this.modules.lifecycle = getLifecycleManager();
            
            // Load app shell
            const { getAppShell } = await import('./app-shell.js');
            this.modules.appShell = getAppShell();
            
            // Load state manager (would be imported)
            this.modules.stateManager = await this.loadStateManager();
            
            // Load router (would be imported)
            this.modules.router = await this.loadRouter();
            
            // Load auth module (would be imported)
            this.modules.auth = await this.loadAuthModule();
            
            // Load sync module (would be imported)
            this.modules.sync = await this.loadSyncModule();
            
            // Load cache module (would be imported)
            this.modules.cache = await this.loadCacheModule();
            
            // Load notifications module (would be imported)
            this.modules.notifications = await this.loadNotificationsModule();
            
        } catch (error) {
            throw new Error(`Failed to load core modules: ${error.message}`);
        }
    }

    async loadThirdPartyDependencies() {
        // Check if Alpine.js is loaded (from CDN in index.html)
        if (typeof Alpine === 'undefined') {
            console.warn('[APP-INIT] Alpine.js not loaded, mobile menu may not work');
        }
        
        // Check if service worker is supported
        if (!('serviceWorker' in navigator)) {
            this.config.features.serviceWorker = false;
            this.initializationStatus.warnings.push({
                type: 'SERVICE_WORKER',
                message: 'Service workers not supported. PWA features will be limited.'
            });
        }
        
        // Check if IndexedDB is available
        if (!window.indexedDB) {
            this.config.features.indexedDB = false;
            this.initializationStatus.warnings.push({
                type: 'INDEXED_DB',
                message: 'IndexedDB not available. Offline functionality will be limited.'
            });
        }
    }

    async verifyDependencies() {
        const requiredModules = ['lifecycle', 'appShell', 'stateManager', 'router'];
        const missingModules = [];
        
        requiredModules.forEach(module => {
            if (!this.modules[module]) {
                missingModules.push(module);
            }
        });
        
        if (missingModules.length > 0) {
            throw new Error(`Missing required modules: ${missingModules.join(', ')}`);
        }
    }

    /**
     * CONFIGURATION LOADING
     */
    async loadConfiguration() {
        console.log('[APP-INIT] Loading configuration...');
        
        try {
            // Load app config
            const appConfig = await this.loadAppConfig();
            this.config = { ...this.config, ...appConfig };
            
            // Load country configurations
            const countryConfigs = await this.loadCountryConfigurations();
            this.config.countries = countryConfigs;
            
            // Load feature flags
            const featureFlags = await this.loadFeatureFlags();
            this.config.featureFlags = featureFlags;
            
            // Load business rules
            const businessRules = await this.loadBusinessRules();
            this.config.rules = businessRules;
            
            console.log('[APP-INIT] Configuration loaded successfully');
        } catch (error) {
            throw new Error(`Failed to load configuration: ${error.message}`);
        }
    }

    async loadAppConfig() {
        // Try to load from localStorage first
        let config = localStorage.getItem('mpesewa_config');
        
        if (config) {
            try {
                return JSON.parse(config);
            } catch (error) {
                console.warn('[APP-INIT] Failed to parse saved config, using defaults');
            }
        }
        
        // Load default config
        return {
            appName: 'M-Pesewa',
            version: '1.0.0',
            apiBaseUrl: this.getApiBaseUrl(),
            wsUrl: this.getWebSocketUrl(),
            defaultCountry: 'KE',
            defaultCurrency: 'KSh',
            theme: 'light',
            language: 'en',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: 'HH:mm',
            decimalSeparator: '.',
            thousandSeparator: ',',
            itemsPerPage: 20,
            autoSaveInterval: 30000,
            syncInterval: 60000,
            cacheDuration: 3600000,
            maxUploadSize: 5242880, // 5MB
            supportedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
            rateLimiting: {
                requestsPerMinute: 60,
                requestsPerHour: 1000
            }
        };
    }

    async loadCountryConfigurations() {
        const countries = [
            {
                code: 'KE',
                name: 'Kenya',
                currency: 'KSh',
                flag: '🇰🇪',
                language: 'en',
                timezone: 'Africa/Nairobi',
                contact: {
                    phone: '+254 709 219 000',
                    email: 'kenya@mpesewa.com',
                    address: 'Nairobi, Kenya'
                },
                legal: {
                    minAge: 18,
                    idTypes: ['National ID', 'Passport', 'Driver License'],
                    taxIdRequired: false,
                    regulatoryBody: 'Central Bank of Kenya'
                },
                limits: {
                    minLoan: 50,
                    maxLoanBasic: 1500,
                    maxLoanPremium: 5000,
                    maxLoanSuper: 20000,
                    maxLoanLenderOfLenders: 50000
                }
            },
            {
                code: 'UG',
                name: 'Uganda',
                currency: 'UGX',
                flag: '🇺🇬',
                language: 'en',
                timezone: 'Africa/Kampala',
                contact: {
                    phone: '+256 392 175 546',
                    email: 'uganda@mpesewa.com',
                    address: 'Kampala, Uganda'
                },
                legal: {
                    minAge: 18,
                    idTypes: ['National ID', 'Passport'],
                    taxIdRequired: false,
                    regulatoryBody: 'Bank of Uganda'
                },
                limits: {
                    minLoan: 2000,
                    maxLoanBasic: 50000,
                    maxLoanPremium: 200000,
                    maxLoanSuper: 800000,
                    maxLoanLenderOfLenders: 2000000
                }
            },
            // Add other countries with similar structure
            // Tanzania (TZ), Rwanda (RW), DRC (CD), Burundi (BI),
            // Nigeria (NG), Ghana (GH), South Sudan (SS), Somalia (SO),
            // South Africa (ZA), Ethiopia (ET)
        ];
        
        return countries;
    }

    async loadFeatureFlags() {
        // These would be loaded from a server in production
        return {
            enableNewDashboard: true,
            enableDarkMode: true,
            enableVoiceCommands: false,
            enableBiometricAuth: false,
            enableAdvancedAnalytics: true,
            enableSocialSharing: true,
            enableExportData: true,
            enableBulkOperations: false,
            enableChatSupport: true,
            enableVideoTutorials: false
        };
    }

    async loadBusinessRules() {
        return {
            hierarchy: {
                globalToCountry: true,
                countryToGroup: true,
                groupToLender: true,
                lenderToLedger: true,
                groupToBorrower: true
            },
            limits: {
                maxGroupsPerUser: 4,
                minGroupMembers: 5,
                maxGroupMembers: 1000,
                maxActiveLoansPerBorrower: 1,
                maxLedgersPerLender: Infinity
            },
            subscriptions: {
                basic: { amount: 50, period: 'monthly', limit: 1500 },
                premium: { amount: 250, period: 'monthly', limit: 5000 },
                super: { amount: 1000, period: 'monthly', limit: 20000 },
                lenderOfLenders: { amount: 500, period: 'monthly', limit: 50000 }
            },
            loans: {
                duration: 7, // days
                interestRate: 0.10, // 10%
                dailyPenaltyRate: 0.05, // 5% after day 7
                defaultThreshold: 60, // days
                minAmount: 0.1, // $0.1 or equivalent
                maxAmountByTier: {
                    basic: 1500,
                    premium: 5000,
                    super: 20000,
                    lenderOfLenders: 50000
                }
            },
            reputation: {
                ratingSystem: '5-star',
                minRatingForNewGroups: 3,
                blacklistThreshold: 60, // days overdue
                blacklistRemoval: 'admin-only'
            }
        };
    }

    /**
     * HIERARCHY INITIALIZATION
     * Enforces strict Global → Country → Groups → Lenders → Borrowers structure
     */
    async initializeHierarchy() {
        console.log('[APP-INIT] Initializing hierarchy...');
        
        try {
            // Initialize lifecycle manager with hierarchy
            await this.modules.lifecycle.transitionTo('INITIALIZING');
            
            // Set up hierarchy enforcement
            await this.setupHierarchyEnforcement();
            
            // Load initial hierarchy data
            await this.loadInitialHierarchyData();
            
            // Set up hierarchy event listeners
            await this.setupHierarchyEventListeners();
            
            console.log('[APP-INIT] Hierarchy initialized successfully');
        } catch (error) {
            throw new Error(`Failed to initialize hierarchy: ${error.message}`);
        }
    }

    async setupHierarchyEnforcement() {
        // Set up rules for each level of hierarchy
        
        // Global level rules
        this.modules.lifecycle.on('global:access', (data) => {
            console.log('[HIERARCHY] Global access:', data);
        });
        
        // Country level rules
        this.modules.lifecycle.on('country:select', async (country) => {
            // Enforce country isolation
            await this.enforceCountryIsolation(country);
            
            // Load country-specific data
            await this.loadCountryData(country);
            
            // Update UI for country
            await this.updateUIForCountry(country);
        });
        
        // Group level rules
        this.modules.lifecycle.on('group:join', async (group) => {
            // Validate group membership rules
            await this.validateGroupMembership(group);
            
            // Check group capacity
            await this.checkGroupCapacity(group);
            
            // Update user's group membership
            await this.updateUserGroupMembership(group);
        });
        
        // Lender level rules
        this.modules.lifecycle.on('lender:activate', async (lender) => {
            // Check subscription status
            await this.checkLenderSubscription(lender);
            
            // Set up lender permissions
            await this.setupLenderPermissions(lender);
            
            // Initialize lender dashboard
            await this.initializeLenderDashboard(lender);
        });
        
        // Borrower level rules
        this.modules.lifecycle.on('borrower:activate', async (borrower) => {
            // Check borrower rating
            await this.checkBorrowerRating(borrower);
            
            // Check blacklist status
            await this.checkBlacklistStatus(borrower);
            
            // Initialize borrower dashboard
            await this.initializeBorrowerDashboard(borrower);
        });
        
        // Ledger level rules
        this.modules.lifecycle.on('ledger:create', async (ledger) => {
            // Validate ledger creation rules
            await this.validateLedgerCreation(ledger);
            
            // Create ledger in system
            await this.createSystemLedger(ledger);
            
            // Update related records
            await this.updateRelatedRecordsForLedger(ledger);
        });
    }

    async loadInitialHierarchyData() {
        // Load countries
        const countries = await this.loadCountries();
        this.modules.stateManager.setState({ countries });
        
        // Load user's current state
        const userState = await this.loadUserState();
        this.modules.stateManager.setState({ user: userState });
        
        // If user has active session, load their hierarchy
        if (userState.isAuthenticated) {
            await this.loadUserHierarchy(userState);
        }
    }

    async setupHierarchyEventListeners() {
        // Listen for hierarchy changes
        window.addEventListener('hierarchy:change', async (event) => {
            await this.handleHierarchyChange(event.detail);
        });
        
        // Listen for country changes
        window.addEventListener('country:change', async (event) => {
            await this.handleCountryChange(event.detail);
        });
        
        // Listen for group changes
        window.addEventListener('group:change', async (event) => {
            await this.handleGroupChange(event.detail);
        });
        
        // Listen for role changes
        window.addEventListener('role:change', async (event) => {
            await this.handleRoleChange(event.detail);
        });
    }

    /**
     * USER SESSION MANAGEMENT
     */
    async loadUserSession() {
        console.log('[APP-INIT] Loading user session...');
        
        try {
            // Check for existing session
            const session = await this.checkExistingSession();
            
            if (session) {
                // Restore session
                await this.restoreSession(session);
                
                // Validate session
                await this.validateSession(session);
                
                // Load user data
                await this.loadUserData(session.userId);
                
                console.log('[APP-INIT] User session restored');
            } else {
                // No session, user is not logged in
                this.modules.stateManager.setState({
                    user: { isAuthenticated: false }
                });
                
                console.log('[APP-INIT] No user session found');
            }
        } catch (error) {
            console.warn('[APP-INIT] Failed to load user session:', error);
            // Continue without session
            this.modules.stateManager.setState({
                user: { isAuthenticated: false }
            });
        }
    }

    async checkExistingSession() {
        // Check localStorage for session token
        const token = localStorage.getItem('mpesewa_token');
        const sessionData = localStorage.getItem('mpesewa_session');
        
        if (!token || !sessionData) {
            return null;
        }
        
        try {
            const session = JSON.parse(sessionData);
            
            // Check token expiry
            if (session.expires && new Date(session.expires) < new Date()) {
                localStorage.removeItem('mpesewa_token');
                localStorage.removeItem('mpesewa_session');
                return null;
            }
            
            return {
                token,
                ...session
            };
        } catch (error) {
            console.warn('[APP-INIT] Invalid session data:', error);
            localStorage.removeItem('mpesewa_token');
            localStorage.removeItem('mpesewa_session');
            return null;
        }
    }

    async restoreSession(session) {
        // Store session in state manager
        this.modules.stateManager.setState({
            session: {
                token: session.token,
                userId: session.userId,
                expires: session.expires,
                roles: session.roles || [],
                permissions: session.permissions || []
            }
        });
        
        // Set authentication headers for API calls
        this.setAuthHeader(session.token);
        
        // Initialize user-specific modules
        await this.initializeUserModules(session);
    }

    async validateSession(session) {
        // In a real app, this would validate with the server
        // For now, we'll just check locally
        
        if (!session.userId) {
            throw new Error('Invalid session: missing userId');
        }
        
        if (session.expires && new Date(session.expires) < new Date()) {
            throw new Error('Session has expired');
        }
        
        return true;
    }

    async loadUserData(userId) {
        // Load user profile
        const profile = await this.loadUserProfile(userId);
        this.modules.stateManager.setState({ profile });
        
        // Load user preferences
        const preferences = await this.loadUserPreferences(userId);
        this.modules.stateManager.setState({ preferences });
        
        // Load user activity
        const activity = await this.loadUserActivity(userId);
        this.modules.stateManager.setState({ activity });
    }

    /**
     * COUNTRY SELECTION FLOW
     */
    async handleCountrySelection() {
        console.log('[APP-INIT] Handling country selection...');
        
        const userState = this.modules.stateManager.getState().user;
        
        if (!userState.isAuthenticated) {
            // For non-authenticated users, use default country or geo-location
            await this.selectDefaultCountry();
            return;
        }
        
        // Check if user already has a selected country
        const selectedCountry = userState.country;
        
        if (selectedCountry) {
            // Validate selected country
            const isValid = await this.validateCountry(selectedCountry);
            
            if (isValid) {
                await this.setCurrentCountry(selectedCountry);
                return;
            }
        }
        
        // No valid country selected, prompt user
        await this.promptCountrySelection();
    }

    async selectDefaultCountry() {
        // Try to detect country from browser
        const detectedCountry = await this.detectCountry();
        
        if (detectedCountry && this.isCountrySupported(detectedCountry)) {
            await this.setCurrentCountry(detectedCountry);
        } else {
            // Use config default
            await this.setCurrentCountry(this.config.defaultCountry);
        }
    }

    async promptCountrySelection() {
        // In a real app, this would show a country selection modal
        // For now, we'll use the default
        
        console.log('[APP-INIT] Prompting country selection...');
        
        // Store that country selection is needed
        this.modules.stateManager.setState({
            needsCountrySelection: true
        });
        
        // Use default country for now
        await this.setCurrentCountry(this.config.defaultCountry);
    }

    async setCurrentCountry(countryCode) {
        console.log(`[APP-INIT] Setting current country: ${countryCode}`);
        
        // Validate country
        if (!this.isCountrySupported(countryCode)) {
            throw new Error(`Country ${countryCode} is not supported`);
        }
        
        // Get country config
        const countryConfig = this.config.countries.find(c => c.code === countryCode);
        
        if (!countryConfig) {
            throw new Error(`Configuration for country ${countryCode} not found`);
        }
        
        // Update state
        this.modules.stateManager.setState({
            currentCountry: countryCode,
            countryConfig
        });
        
        // Update lifecycle
        await this.modules.lifecycle.transitionTo('COUNTRY_SELECTED', {
            country: countryConfig
        });
        
        // Update currency formatting
        await this.setCurrencyFormatting(countryConfig.currency);
        
        // Load country-specific data
        await this.loadCountrySpecificData(countryCode);
        
        console.log(`[APP-INIT] Country set to: ${countryConfig.name}`);
    }

    /**
     * GROUP SELECTION FLOW
     */
    async handleGroupSelection() {
        console.log('[APP-INIT] Handling group selection...');
        
        const userState = this.modules.stateManager.getState().user;
        
        if (!userState.isAuthenticated) {
            // Non-authenticated users don't have groups
            return;
        }
        
        const currentCountry = this.modules.stateManager.getState().currentCountry;
        
        if (!currentCountry) {
            console.warn('[APP-INIT] No country selected, skipping group selection');
            return;
        }
        
        // Check if user already has groups in this country
        const userGroups = await this.getUserGroupsInCountry(
            userState.id,
            currentCountry
        );
        
        if (userGroups.length > 0) {
            // User has groups, use the most recent or primary
            const primaryGroup = await this.getPrimaryGroup(userGroups);
            
            if (primaryGroup) {
                await this.setCurrentGroup(primaryGroup);
                return;
            }
        }
        
        // No groups found, check if user needs to join/create one
        if (userState.isAuthenticated) {
            await this.promptGroupSelection();
        }
    }

    async promptGroupSelection() {
        console.log('[APP-INIT] Prompting group selection...');
        
        // Store that group selection is needed
        this.modules.stateManager.setState({
            needsGroupSelection: true
        });
        
        // In a real app, this would redirect to group selection page
        // For now, we'll continue without a group
    }

    async setCurrentGroup(group) {
        console.log(`[APP-INIT] Setting current group: ${group.id}`);
        
        // Validate group
        const isValid = await this.validateGroup(group);
        
        if (!isValid) {
            throw new Error(`Group ${group.id} is not valid`);
        }
        
        // Check group membership
        const isMember = await this.checkGroupMembership(
            this.modules.stateManager.getState().user.id,
            group.id
        );
        
        if (!isMember) {
            throw new Error(`User is not a member of group ${group.id}`);
        }
        
        // Update state
        this.modules.stateManager.setState({
            currentGroup: group
        });
        
        // Update lifecycle
        await this.modules.lifecycle.transitionTo('GROUP_SELECTED', {
            group
        });
        
        // Load group-specific data
        await this.loadGroupSpecificData(group.id);
        
        console.log(`[APP-INIT] Group set to: ${group.name}`);
    }

    /**
     * ROLE SELECTION FLOW
     */
    async handleRoleSelection() {
        console.log('[APP-INIT] Handling role selection...');
        
        const userState = this.modules.stateManager.getState().user;
        
        if (!userState.isAuthenticated || !userState.id) {
            // Non-authenticated users don't have roles
            return;
        }
        
        const currentGroup = this.modules.stateManager.getState().currentGroup;
        
        if (!currentGroup) {
            console.warn('[APP-INIT] No group selected, skipping role selection');
            return;
        }
        
        // Check user's role in current group
        const groupRole = await this.getUserRoleInGroup(
            userState.id,
            currentGroup.id
        );
        
        if (groupRole) {
            await this.setCurrentRole(groupRole);
            return;
        }
        
        // No role in this group, prompt for role selection
        await this.promptRoleSelection();
    }

    async promptRoleSelection() {
        console.log('[APP-INIT] Prompting role selection...');
        
        // Store that role selection is needed
        this.modules.stateManager.setState({
            needsRoleSelection: true
        });
        
        // In a real app, this would show a role selection modal
    }

    async setCurrentRole(role) {
        console.log(`[APP-INIT] Setting current role: ${role}`);
        
        // Validate role
        if (!['LENDER', 'BORROWER'].includes(role)) {
            throw new Error(`Invalid role: ${role}`);
        }
        
        // Update state
        this.modules.stateManager.setState({
            currentRole: role
        });
        
        // Update lifecycle
        await this.modules.lifecycle.transitionTo('ROLE_SELECTED', {
            role
        });
        
        // Role-specific initialization
        if (role === 'LENDER') {
            await this.initializeLenderRole();
        } else if (role === 'BORROWER') {
            await this.initializeBorrowerRole();
        }
        
        console.log(`[APP-INIT] Role set to: ${role}`);
    }

    /**
     * SUBSCRIPTION MANAGEMENT
     */
    async checkSubscription() {
        console.log('[APP-INIT] Checking subscription...');
        
        const userState = this.modules.stateManager.getState().user;
        const currentRole = this.modules.stateManager.getState().currentRole;
        
        if (!userState.isAuthenticated || currentRole !== 'LENDER') {
            // Only lenders need subscriptions
            return;
        }
        
        // Check subscription status
        const subscription = await this.getUserSubscription(userState.id);
        
        if (subscription) {
            await this.setCurrentSubscription(subscription);
        } else {
            // No subscription, lender needs to subscribe
            await this.promptSubscription();
        }
    }

    async setCurrentSubscription(subscription) {
        console.log(`[APP-INIT] Setting current subscription: ${subscription.tier}`);
        
        // Validate subscription
        const isValid = await this.validateSubscription(subscription);
        
        if (!isValid) {
            throw new Error(`Invalid subscription: ${subscription.id}`);
        }
        
        // Check if subscription is active
        if (subscription.status !== 'ACTIVE') {
            console.warn(`[APP-INIT] Subscription is ${subscription.status}`);
            this.modules.stateManager.setState({
                needsSubscriptionRenewal: true
            });
        }
        
        // Update state
        this.modules.stateManager.setState({
            currentSubscription: subscription
        });
        
        // Update lifecycle if subscription is active
        if (subscription.status === 'ACTIVE') {
            await this.modules.lifecycle.transitionTo('SUBSCRIPTION_ACTIVE', {
                subscription
            });
        }
        
        console.log(`[APP-INIT] Subscription set: ${subscription.tier} (${subscription.status})`);
    }

    async promptSubscription() {
        console.log('[APP-INIT] Prompting subscription...');
        
        // Store that subscription is needed
        this.modules.stateManager.setState({
            needsSubscription: true
        });
        
        // In a real app, this would redirect to subscription page
    }

    /**
     * UI INITIALIZATION
     */
    async initializeUI() {
        console.log('[APP-INIT] Initializing UI...');
        
        try {
            // Initialize app shell
            await this.modules.appShell.initialize();
            
            // Apply theme
            await this.applyTheme();
            
            // Set up responsive design
            await this.setupResponsiveDesign();
            
            // Initialize components
            await this.initializeComponents();
            
            // Set up keyboard shortcuts
            await this.setupKeyboardShortcuts();
            
            // Set up accessibility features
            await this.setupAccessibility();
            
            console.log('[APP-INIT] UI initialized successfully');
        } catch (error) {
            throw new Error(`Failed to initialize UI: ${error.message}`);
        }
    }

    async applyTheme() {
        const preferences = this.modules.stateManager.getState().preferences;
        const theme = preferences?.theme || this.config.theme;
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        
        // Set theme color meta tag
        const themeColor = theme === 'dark' ? '#1a202c' : '#003366';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    }

    async setupResponsiveDesign() {
        // Add viewport meta tag if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        }
        
        // Add responsive classes
        const width = window.innerWidth;
        
        if (width < 768) {
            document.body.classList.add('mobile');
        } else if (width < 1024) {
            document.body.classList.add('tablet');
        } else {
            document.body.classList.add('desktop');
        }
        
        // Listen for resize events
        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            document.body.classList.remove('mobile', 'tablet', 'desktop');
            
            if (newWidth < 768) {
                document.body.classList.add('mobile');
            } else if (newWidth < 1024) {
                document.body.classList.add('tablet');
            } else {
                document.body.classList.add('desktop');
            }
        });
    }

    async initializeComponents() {
        // Initialize all UI components
        const components = [
            'dropdowns',
            'modals',
            'tooltips',
            'notifications',
            'loaders',
            'forms',
            'tables',
            'charts'
        ];
        
        for (const component of components) {
            await this.initializeComponent(component);
        }
    }

    async setupKeyboardShortcuts() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + S: Save
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                this.handleSave();
            }
            
            // Ctrl/Cmd + /: Search
            if ((event.ctrlKey || event.metaKey) && event.key === '/') {
                event.preventDefault();
                this.handleSearch();
            }
            
            // Escape: Close modals
            if (event.key === 'Escape') {
                this.handleEscape();
            }
        });
    }

    async setupAccessibility() {
        // Ensure focus outlines are visible
        const style = document.createElement('style');
        style.textContent = `
            :focus-visible {
                outline: 2px solid #0099ff !important;
                outline-offset: 2px !important;
            }
            
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
        
        // Set language attribute
        document.documentElement.lang = this.config.language;
        
        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to main content';
        document.body.prepend(skipLink);
    }

    /**
     * EVENT SYSTEM SETUP
     */
    async setupEventSystem() {
        console.log('[APP-INIT] Setting up event system...');
        
        // Create global event bus
        window.eventBus = this.createEventBus();
        
        // Set up core event listeners
        await this.setupCoreEventListeners();
        
        // Set up error handling
        await this.setupErrorHandling();
        
        // Set up performance monitoring
        await this.setupPerformanceMonitoring();
        
        console.log('[APP-INIT] Event system setup complete');
    }

    createEventBus() {
        const listeners = new Map();
        
        return {
            on: (event, callback) => {
                if (!listeners.has(event)) {
                    listeners.set(event, []);
                }
                listeners.get(event).push(callback);
            },
            
            off: (event, callback) => {
                if (listeners.has(event)) {
                    const callbacks = listeners.get(event);
                    const index = callbacks.indexOf(callback);
                    if (index > -1) {
                        callbacks.splice(index, 1);
                    }
                }
            },
            
            emit: (event, data) => {
                if (listeners.has(event)) {
                    listeners.get(event).forEach(callback => {
                        try {
                            callback(data);
                        } catch (error) {
                            console.error(`Error in event listener for ${event}:`, error);
                        }
                    });
                }
            }
        };
    }

    async setupCoreEventListeners() {
        // Authentication events
        window.eventBus.on('auth:login', (data) => this.handleAuthLogin(data));
        window.eventBus.on('auth:logout', (data) => this.handleAuthLogout(data));
        window.eventBus.on('auth:session-expired', (data) => this.handleSessionExpired(data));
        
        // Navigation events
        window.eventBus.on('navigation:change', (data) => this.handleNavigationChange(data));
        window.eventBus.on('navigation:blocked', (data) => this.handleNavigationBlocked(data));
        
        // Data events
        window.eventBus.on('data:changed', (data) => this.handleDataChanged(data));
        window.eventBus.on('data:synced', (data) => this.handleDataSynced(data));
        window.eventBus.on('data:conflict', (data) => this.handleDataConflict(data));
        
        // UI events
        window.eventBus.on('ui:theme-change', (data) => this.handleThemeChange(data));
        window.eventBus.on('ui:language-change', (data) => this.handleLanguageChange(data));
        window.eventBus.on('ui:notification', (data) => this.handleUINotification(data));
        
        // Business events
        window.eventBus.on('loan:created', (data) => this.handleLoanCreated(data));
        window.eventBus.on('loan:repaid', (data) => this.handleLoanRepaid(data));
        window.eventBus.on('loan:defaulted', (data) => this.handleLoanDefaulted(data));
        window.eventBus.on('subscription:activated', (data) => this.handleSubscriptionActivated(data));
        window.eventBus.on('subscription:expired', (data) => this.handleSubscriptionExpired(data));
        window.eventBus.on('blacklist:added', (data) => this.handleBlacklistAdded(data));
        window.eventBus.on('blacklist:removed', (data) => this.handleBlacklistRemoved(data));
    }

    async setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error);
        });
        
        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event.reason);
        });
        
        // Network error handling
        window.addEventListener('online', () => {
            this.handleNetworkOnline();
        });
        
        window.addEventListener('offline', () => {
            this.handleNetworkOffline();
        });
    }

    async setupPerformanceMonitoring() {
        // Measure page load performance
        window.addEventListener('load', () => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            console.log(`[PERF] Page load time: ${loadTime}ms`);
            
            // Report to analytics
            this.reportPerformanceMetric('page_load', loadTime);
        });
        
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = memory.usedJSHeapSize / 1048576;
                const totalMB = memory.totalJSHeapSize / 1048576;
                
                if (usedMB > totalMB * 0.8) {
                    console.warn(`[PERF] High memory usage: ${usedMB.toFixed(2)}MB / ${totalMB.toFixed(2)}MB`);
                }
            }, 30000);
        }
    }

    /**
     * SERVICE WORKER REGISTRATION
     */
    async registerServiceWorker() {
        if (!this.config.features.serviceWorker) {
            console.log('[APP-INIT] Service worker feature disabled, skipping registration');
            return;
        }
        
        console.log('[APP-INIT] Registering service worker...');
        
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/',
                updateViaCache: 'none'
            });
            
            console.log('[APP-INIT] Service worker registered:', registration);
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('[APP-INIT] New service worker found:', newWorker);
                
                newWorker.addEventListener('statechange', () => {
                    console.log('[APP-INIT] Service worker state:', newWorker.state);
                });
            });
            
            // Check for updates
            if (registration.waiting) {
                console.log('[APP-INIT] Update available, prompting user...');
                this.promptServiceWorkerUpdate(registration);
            }
            
            // Store registration
            this.modules.stateManager.setState({
                serviceWorker: registration
            });
            
        } catch (error) {
            console.error('[APP-INIT] Service worker registration failed:', error);
            this.initializationStatus.warnings.push({
                type: 'SERVICE_WORKER',
                message: 'Service worker registration failed. Offline features may not work.'
            });
        }
    }

    promptServiceWorkerUpdate(registration) {
        // In a real app, this would show an update notification
        console.log('[APP-INIT] New version available, reload to update');
        
        // For now, just skip waiting and reload
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        
        window.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }

    /**
     * SYNC INITIALIZATION
     */
    async initializeSync() {
        console.log('[APP-INIT] Initializing sync...');
        
        if (!this.config.features.backgroundSync) {
            console.log('[APP-INIT] Background sync feature disabled');
            return;
        }
        
        try {
            // Initialize sync manager
            await this.modules.sync.initialize();
            
            // Set up sync intervals
            await this.setupSyncIntervals();
            
            // Initial sync if online
            if (navigator.onLine) {
                await this.performInitialSync();
            }
            
            console.log('[APP-INIT] Sync initialized successfully');
        } catch (error) {
            console.error('[APP-INIT] Sync initialization failed:', error);
            this.initializationStatus.warnings.push({
                type: 'SYNC',
                message: 'Sync initialization failed. Data may not sync properly.'
            });
        }
    }

    async setupSyncIntervals() {
        // Regular sync interval
        this.syncInterval = setInterval(async () => {
            if (navigator.onLine) {
                await this.performSync();
            }
        }, this.config.syncInterval);
        
        // Fast sync for important data
        this.fastSyncInterval = setInterval(async () => {
            if (navigator.onLine) {
                await this.performFastSync();
            }
        }, 10000); // Every 10 seconds
    }

    async performInitialSync() {
        console.log('[APP-INIT] Performing initial sync...');
        
        try {
            // Sync user data
            await this.syncUserData();
            
            // Sync hierarchy data
            await this.syncHierarchyData();
            
            // Sync subscriptions
            await this.syncSubscriptions();
            
            // Sync loans
            await this.syncLoans();
            
            console.log('[APP-INIT] Initial sync complete');
        } catch (error) {
            console.error('[APP-INIT] Initial sync failed:', error);
        }
    }

    /**
     * FINALIZATION
     */
    async setReadyState() {
        console.log('[APP-INIT] Setting ready state...');
        
        // Mark initialization as complete
        this.initializationStatus.isComplete = true;
        this.initializationStatus.endTime = Date.now();
        this.initializationStatus.duration = 
            this.initializationStatus.endTime - this.initializationStatus.startTime;
        
        // Update lifecycle
        await this.modules.lifecycle.transitionTo('READY');
        
        // Emit ready event
        window.eventBus.emit('app:ready', {
            status: this.initializationStatus,
            config: this.config,
            timestamp: new Date().toISOString()
        });
        
        // Show welcome message
        await this.showWelcomeMessage();
        
        console.log(`[APP-INIT] Initialization complete in ${this.initializationStatus.duration}ms`);
        console.log('[APP-INIT] M-Pesewa is ready! 🚀');
    }

    async showWelcomeMessage() {
        const userState = this.modules.stateManager.getState().user;
        
        if (userState.isAuthenticated) {
            const name = userState.profile?.name || 'User';
            console.log(`[APP-INIT] Welcome back, ${name}!`);
            
            // Show notification
            window.eventBus.emit('ui:notification', {
                type: 'success',
                title: 'Welcome Back',
                message: `Good to see you, ${name}!`,
                duration: 3000
            });
        } else {
            console.log('[APP-INIT] Welcome to M-Pesewa!');
        }
    }

    async finalizeInitialization() {
        // Save configuration
        localStorage.setItem('mpesewa_config', JSON.stringify(this.config));
        
        // Start background tasks
        this.startBackgroundTasks();
        
        // Initialize analytics
        await this.initializeAnalytics();
        
        // Log initialization summary
        this.logInitializationSummary();
    }

    startBackgroundTasks() {
        // Subscription expiry check
        setInterval(() => {
            this.checkSubscriptionExpiry();
        }, 60000); // Every minute
        
        // Loan due date check
        setInterval(() => {
            this.checkLoanDueDates();
        }, 300000); // Every 5 minutes
        
        // Cleanup expired sessions
        setInterval(() => {
            this.cleanupExpiredSessions();
        }, 3600000); // Every hour
    }

    async initializeAnalytics() {
        // Initialize analytics tracking
        console.log('[APP-INIT] Initializing analytics...');
        
        // Track initialization
        this.trackEvent('app_initialization', {
            duration: this.initializationStatus.duration,
            hasErrors: this.initializationStatus.hasErrors,
            errorCount: this.initializationStatus.errors.length,
            warningCount: this.initializationStatus.warnings.length
        });
        
        // Track user session
        const userState = this.modules.stateManager.getState().user;
        if (userState.isAuthenticated) {
            this.trackEvent('user_session_start', {
                userId: userState.id,
                country: this.modules.stateManager.getState().currentCountry,
                role: this.modules.stateManager.getState().currentRole
            });
        }
    }

    logInitializationSummary() {
        console.group('[APP-INIT] Initialization Summary');
        console.log(`Duration: ${this.initializationStatus.duration}ms`);
        console.log(`Errors: ${this.initializationStatus.errors.length}`);
        console.log(`Warnings: ${this.initializationStatus.warnings.length}`);
        console.log(`Environment: ${this.config.environment}`);
        console.log(`Browser: ${this.detectBrowser()} ${this.getBrowserVersion()}`);
        console.log(`Screen: ${window.innerWidth}x${window.innerHeight}`);
        console.log(`Online: ${navigator.onLine}`);
        console.log(`Service Worker: ${this.modules.stateManager.getState().serviceWorker ? 'Registered' : 'Not Registered'}`);
        console.groupEnd();
        
        // Log warnings
        if (this.initializationStatus.warnings.length > 0) {
            console.group('[APP-INIT] Warnings');
            this.initializationStatus.warnings.forEach(warning => {
                console.warn(`${warning.type}: ${warning.message}`);
            });
            console.groupEnd();
        }
        
        // Log errors
        if (this.initializationStatus.errors.length > 0) {
            console.group('[APP-INIT] Errors');
            this.initializationStatus.errors.forEach(error => {
                console.error(`${error.step}: ${error.error}`);
            });
            console.groupEnd();
        }
    }

    async handleInitializationError(error) {
        console.error('[APP-INIT] Initialization failed:', error);
        
        this.initializationStatus.hasErrors = true;
        this.initializationStatus.endTime = Date.now();
        this.initializationStatus.duration = 
            this.initializationStatus.endTime - this.initializationStatus.startTime;
        
        // Show error to user
        this.showInitializationError(error);
        
        // Track error
        this.trackError('initialization_failed', error);
        
        // Try to recover
        await this.attemptRecovery();
    }

    showInitializationError(error) {
        // Create error overlay
        const overlay = document.createElement('div');
        overlay.className = 'initialization-error';
        overlay.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <h2>Failed to Initialize M-Pesewa</h2>
                <p>${error.message || 'An unknown error occurred'}</p>
                <div class="error-actions">
                    <button id="retryInitBtn" class="btn btn-primary">Retry</button>
                    <button id="reportErrorBtn" class="btn btn-outline">Report Error</button>
                </div>
                <p class="error-help">
                    If the problem persists, please clear your browser cache and try again.
                </p>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .initialization-error {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #f8f9fa;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            }
            
            .initialization-error .error-content {
                max-width: 500px;
                text-align: center;
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }
            
            .initialization-error .error-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
            
            .initialization-error h2 {
                color: #003366;
                margin-bottom: 10px;
            }
            
            .initialization-error p {
                color: #555;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            
            .initialization-error .error-actions {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-bottom: 20px;
            }
            
            .initialization-error .error-help {
                font-size: 14px;
                color: #777;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('retryInitBtn')?.addEventListener('click', () => {
            location.reload();
        });
        
        document.getElementById('reportErrorBtn')?.addEventListener('click', () => {
            this.reportError(error);
        });
    }

    async attemptRecovery() {
        console.log('[APP-INIT] Attempting recovery...');
        
        try {
            // Clear potentially corrupted data
            localStorage.removeItem('mpesewa_state');
            sessionStorage.clear();
            
            // Try to initialize with minimal configuration
            this.config.debugMode = true;
            this.config.features = {
                pwa: false,
                offlineSupport: false,
                pushNotifications: false,
                backgroundSync: false,
                indexedDB: false,
                serviceWorker: false
            };
            
            // Retry initialization
            await this.initialize();
            
        } catch (recoveryError) {
            console.error('[APP-INIT] Recovery failed:', recoveryError);
            // Can't recover, user needs to refresh
        }
    }

    /**
     * HELPER METHODS
     */
    detectEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('test') || hostname.includes('staging')) {
            return 'staging';
        } else if (hostname.includes('github.io')) {
            return 'production-github';
        } else {
            return 'production';
        }
    }

    isDebugMode() {
        return this.detectEnvironment() === 'development' || 
               localStorage.getItem('mpesewa_debug') === 'true' ||
               new URLSearchParams(window.location.search).has('debug');
    }

    detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('chrome')) return 'chrome';
        if (userAgent.includes('firefox')) return 'firefox';
        if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
        if (userAgent.includes('edge')) return 'edge';
        
        return 'unknown';
    }

    getBrowserVersion() {
        const userAgent = navigator.userAgent;
        let version = 0;
        
        // Simple version extraction
        const match = userAgent.match(/(chrome|firefox|safari|edge)\/(\d+)/i);
        if (match) {
            version = parseInt(match[2], 10);
        }
        
        return version;
    }

    getApiBaseUrl() {
        const env = this.detectEnvironment();
        
        switch (env) {
            case 'development':
                return 'http://localhost:3000/api';
            case 'staging':
                return 'https://staging.api.m-pesewa.com';
            case 'production-github':
                return 'https://api.m-pesewa.com/github';
            default:
                return 'https://api.m-pesewa.com';
        }
    }

    getWebSocketUrl() {
        const apiUrl = this.getApiBaseUrl();
        return apiUrl.replace('http', 'ws').replace('/api', '/ws');
    }

    isCountrySupported(countryCode) {
        return this.config.countries?.some(c => c.code === countryCode) || false;
    }

    async detectCountry() {
        // Try to get from browser language
        const language = navigator.language || navigator.userLanguage;
        const countryCode = language.split('-')[1]?.toUpperCase();
        
        if (countryCode && this.isCountrySupported(countryCode)) {
            return countryCode;
        }
        
        // Try geolocation API (requires permission)
        try {
            const position = await new Promise((resolve, reject) => {
                if (!navigator.geolocation) reject(new Error('Geolocation not supported'));
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 5000,
                    maximumAge: 600000
                });
            });
            
            // In a real app, you would reverse geocode to get country
            // For now, return null
            return null;
        } catch (error) {
            console.warn('[APP-INIT] Geolocation failed:', error);
            return null;
        }
    }

    setCurrencyFormatting(currencyCode) {
        // Set up Intl.NumberFormat for currency
        this.currencyFormatter = new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    setAuthHeader(token) {
        // This would set up axios or fetch interceptors
        // For now, store in a global variable
        window.mpesewaAuthToken = token;
    }

    trackEvent(eventName, properties = {}) {
        // In a real app, this would send to analytics service
        console.log(`[ANALYTICS] ${eventName}:`, properties);
    }

    trackError(errorType, error) {
        this.trackEvent('error_occurred', {
            error_type: errorType,
            error_message: error.message,
            error_stack: error.stack,
            url: window.location.href,
            timestamp: new Date().toISOString()
        });
    }

    reportError(error) {
        // In a real app, this would send to error reporting service
        console.error('[ERROR-REPORT]', error);
        
        // Show confirmation
        alert('Error reported. Thank you for helping us improve M-Pesewa!');
    }

    // Placeholder methods for async operations
    async loadStateManager() { return { getState: () => ({}), setState: () => {} }; }
    async loadRouter() { return {}; }
    async loadAuthModule() { return {}; }
    async loadSyncModule() { return { initialize: () => Promise.resolve() }; }
    async loadCacheModule() { return {}; }
    async loadNotificationsModule() { return {}; }
    async loadCountries() { return []; }
    async loadUserState() { return { isAuthenticated: false }; }
    async loadUserHierarchy(userState) { return {}; }
    async enforceCountryIsolation(country) { }
    async loadCountryData(country) { }
    async updateUIForCountry(country) { }
    async validateGroupMembership(group) { return true; }
    async checkGroupCapacity(group) { }
    async updateUserGroupMembership(group) { }
    async checkLenderSubscription(lender) { }
    async setupLenderPermissions(lender) { }
    async initializeLenderDashboard(lender) { }
    async checkBorrowerRating(borrower) { }
    async checkBlacklistStatus(borrower) { }
    async initializeBorrowerDashboard(borrower) { }
    async validateLedgerCreation(ledger) { return true; }
    async createSystemLedger(ledger) { }
    async updateRelatedRecordsForLedger(ledger) { }
    async loadUserProfile(userId) { return {}; }
    async loadUserPreferences(userId) { return {}; }
    async loadUserActivity(userId) { return []; }
    async getUserGroupsInCountry(userId, countryCode) { return []; }
    async getPrimaryGroup(groups) { return groups[0]; }
    async validateGroup(group) { return true; }
    async checkGroupMembership(userId, groupId) { return true; }
    async loadGroupSpecificData(groupId) { }
    async getUserRoleInGroup(userId, groupId) { return null; }
    async initializeLenderRole() { }
    async initializeBorrowerRole() { }
    async getUserSubscription(userId) { return null; }
    async validateSubscription(subscription) { return true; }
    async initializeComponent(component) { }
    async handleSave() { }
    async handleSearch() { }
    async handleEscape() { }
    async handleAuthLogin(data) { }
    async handleAuthLogout(data) { }
    async handleSessionExpired(data) { }
    async handleNavigationChange(data) { }
    async handleNavigationBlocked(data) { }
    async handleDataChanged(data) { }
    async handleDataSynced(data) { }
    async handleDataConflict(data) { }
    async handleThemeChange(data) { }
    async handleLanguageChange(data) { }
    async handleUINotification(data) { }
    async handleLoanCreated(data) { }
    async handleLoanRepaid(data) { }
    async handleLoanDefaulted(data) { }
    async handleSubscriptionActivated(data) { }
    async handleSubscriptionExpired(data) { }
    async handleBlacklistAdded(data) { }
    async handleBlacklistRemoved(data) { }
    async handleGlobalError(error) { }
    async handleUnhandledRejection(reason) { }
    async handleNetworkOnline() { }
    async handleNetworkOffline() { }
    async handleHierarchyChange(detail) { }
    async handleCountryChange(detail) { }
    async handleGroupChange(detail) { }
    async handleRoleChange(detail) { }
    async syncUserData() { }
    async syncHierarchyData() { }
    async syncSubscriptions() { }
    async syncLoans() { }
    async performSync() { }
    async performFastSync() { }
    async checkSubscriptionExpiry() { }
    async checkLoanDueDates() { }
    async cleanupExpiredSessions() { }
    async reportPerformanceMetric(metric, value) { }
}

// Singleton instance
let appInitializerInstance = null;

export function getAppInitializer() {
    if (!appInitializerInstance) {
        appInitializerInstance = new MPesewaAppInitializer();
    }
    return appInitializerInstance;
}

export async function initializeApp() {
    const initializer = getAppInitializer();
    return await initializer.initialize();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp().catch(error => {
            console.error('Failed to initialize app:', error);
        });
    });
} else {
    initializeApp().catch(error => {
        console.error('Failed to initialize app:', error);
    });
}

export default MPesewaAppInitializer;