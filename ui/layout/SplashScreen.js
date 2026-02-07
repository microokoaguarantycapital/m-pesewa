/**
 * M-Pesewa Splash Screen Component
 * Handles initial loading, brand display, and hierarchy initialization
 * Shows loading progress, country detection, and feature verification
 */

class SplashScreen {
    constructor(config = {}) {
        this.config = {
            // Splash screen variants
            variants: {
                'initial': {
                    title: 'M-PESEWA',
                    subtitle: 'Trusted Circles Lending',
                    icon: '🤝',
                    color: '#003366',
                    duration: 3000,
                    showProgress: true,
                    autoProceed: true,
                    nextAction: 'load-app'
                },
                'country-detection': {
                    title: 'Detecting Country',
                    subtitle: 'Setting up country-specific rules',
                    icon: '🇺🇳',
                    color: '#0099ff',
                    duration: 2000,
                    showProgress: true,
                    autoProceed: true,
                    nextAction: 'load-country'
                },
                'loading-data': {
                    title: 'Loading Data',
                    subtitle: 'Fetching your groups and ledgers',
                    icon: '📊',
                    color: '#28a745',
                    duration: 2500,
                    showProgress: true,
                    autoProceed: false,
                    nextAction: 'complete'
                },
                'verifying-subscription': {
                    title: 'Verifying Subscription',
                    subtitle: 'Checking lender subscription status',
                    icon: '📋',
                    color: '#f37021',
                    duration: 2000,
                    showProgress: true,
                    autoProceed: true,
                    nextAction: 'check-subscription'
                },
                'offline-mode': {
                    title: 'Offline Mode',
                    subtitle: 'Loading cached data for offline use',
                    icon: '📶',
                    color: '#6c757d',
                    duration: 1500,
                    showProgress: true,
                    autoProceed: true,
                    nextAction: 'load-offline'
                },
                'error-recovery': {
                    title: 'Recovering Session',
                    subtitle: 'Restoring your previous session',
                    icon: '🔄',
                    color: '#dc3545',
                    duration: 3000,
                    showProgress: true,
                    autoProceed: true,
                    nextAction: 'recover-session'
                }
            },
            
            // Loading steps for initial splash
            loadingSteps: [
                {
                    id: 'hierarchy',
                    label: 'Initializing Hierarchy',
                    description: 'Loading Global → Countries → Groups → Lenders → Borrowers structure',
                    icon: '🌍',
                    duration: 800
                },
                {
                    id: 'countries',
                    label: 'Loading Countries',
                    description: 'Setting up 12 African countries with isolation rules',
                    icon: '🇺🇳',
                    duration: 1000
                },
                {
                    id: 'auth',
                    label: 'Checking Authentication',
                    description: 'Verifying user credentials and session',
                    icon: '🔐',
                    duration: 600
                },
                {
                    id: 'groups',
                    label: 'Loading Groups',
                    description: 'Fetching your trusted circles (5-1000 members)',
                    icon: '👥',
                    duration: 1200
                },
                {
                    id: 'role',
                    label: 'Detecting Role',
                    description: 'Identifying lender/borrower role and permissions',
                    icon: '👤',
                    duration: 700
                },
                {
                    id: 'subscription',
                    label: 'Checking Subscription',
                    description: 'Verifying lender subscription status',
                    icon: '💰',
                    duration: 900
                },
                {
                    id: 'ledgers',
                    label: 'Loading Ledgers',
                    description: 'Fetching active loan records and repayments',
                    icon: '📒',
                    duration: 1100
                },
                {
                    id: 'emergency',
                    label: 'Loading Emergency Categories',
                    description: 'Preparing 20 emergency lending categories',
                    icon: '🚨',
                    duration: 800
                }
            ],
            
            // Country detection configuration
            countryDetection: {
                methods: ['ip', 'browser', 'manual', 'saved'],
                priority: ['saved', 'manual', 'browser', 'ip'],
                fallbackCountry: 'kenya',
                requireConfirmation: true
            },
            
            // Feature flags to verify
            featureVerification: {
                required: ['hierarchy', 'countryIsolation', 'groupRules', 'roleManagement'],
                optional: ['offlineMode', 'pushNotifications', 'pwaInstall'],
                timeout: 10000 // 10 seconds
            },
            
            // Brand configuration
            brand: {
                name: 'M-PESEWA',
                tagline: 'Trusted Circles Lending',
                logo: '🤝',
                colors: {
                    primary: '#003366',
                    secondary: '#0099ff',
                    accent: '#f37021',
                    success: '#28a745',
                    background: '#ffffff'
                },
                animation: 'pulse',
                sound: false
            },
            
            // Performance thresholds
            performance: {
                maxLoadTime: 10000, // 10 seconds
                warningTime: 5000, // 5 seconds
                retryAttempts: 3,
                retryDelay: 1000
            },
            
            // Error handling
            errors: {
                timeout: {
                    title: 'Loading Timeout',
                    message: 'Taking longer than expected. Check your connection.',
                    action: 'Retry'
                },
                countryError: {
                    title: 'Country Detection Failed',
                    message: 'Could not determine your country. Please select manually.',
                    action: 'Select Country'
                },
                authError: {
                    title: 'Authentication Failed',
                    message: 'Unable to verify your session. Please sign in again.',
                    action: 'Sign In'
                },
                offlineError: {
                    title: 'Offline Mode Failed',
                    message: 'Could not load cached data. Check your storage.',
                    action: 'Retry Online'
                }
            },
            ...config
        };
        
        // Current state
        this.state = {
            active: false,
            variant: 'initial',
            progress: 0,
            currentStep: 0,
            totalSteps: this.config.loadingSteps.length,
            country: null,
            hierarchyInitialized: false,
            featuresVerified: {},
            errors: [],
            startTime: null,
            performanceMetrics: {}
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Add styles
        this.addStyles();
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Load saved state
        this.loadState();
    }
    
    addStyles() {
        if (!document.querySelector('#mp-splash-screen-styles')) {
            const style = document.createElement('style');
            style.id = 'mp-splash-screen-styles';
            style.textContent = `
                .splash-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #003366 0%, #001a33 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                    padding: 2rem;
                    animation: fadeIn 0.5s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .splash-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    max-width: 800px;
                    width: 100%;
                    text-align: center;
                }
                
                .splash-logo {
                    font-size: 8rem;
                    margin-bottom: 2rem;
                    animation: ${this.config.brand.animation} 2s ease-in-out infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .splash-title {
                    font-size: 4rem;
                    font-weight: 800;
                    color: #ffffff;
                    margin-bottom: 0.5rem;
                    font-family: 'Poppins', sans-serif;
                    letter-spacing: 2px;
                    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                
                .splash-subtitle {
                    font-size: 1.5rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 3rem;
                    font-weight: 300;
                    letter-spacing: 1px;
                }
                
                .splash-progress-container {
                    width: 100%;
                    max-width: 400px;
                    margin: 2rem 0;
                }
                
                .splash-progress-label {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 0.75rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .splash-progress-bar {
                    height: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .splash-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #0099ff, #28a745);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .splash-progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, 
                        transparent, 
                        rgba(255, 255, 255, 0.2), 
                        transparent);
                    animation: shimmer 2s infinite;
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .splash-steps {
                    width: 100%;
                    max-width: 600px;
                    margin: 2rem 0;
                }
                
                .splash-step {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    border-left: 4px solid transparent;
                    transition: all 0.3s ease;
                }
                
                .splash-step.active {
                    background: rgba(255, 255, 255, 0.1);
                    border-left-color: #0099ff;
                }
                
                .splash-step.completed {
                    background: rgba(40, 167, 69, 0.1);
                    border-left-color: #28a745;
                }
                
                .splash-step.error {
                    background: rgba(220, 53, 69, 0.1);
                    border-left-color: #dc3545;
                }
                
                .step-icon {
                    font-size: 1.5rem;
                    margin-right: 1rem;
                    width: 40px;
                    text-align: center;
                }
                
                .step-content {
                    flex: 1;
                    text-align: left;
                }
                
                .step-label {
                    font-size: 1rem;
                    color: #ffffff;
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                }
                
                .step-description {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                }
                
                .step-status {
                    margin-left: 1rem;
                    font-size: 1.2rem;
                }
                
                .hierarchy-display {
                    width: 100%;
                    max-width: 700px;
                    margin: 2rem 0;
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .hierarchy-title {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                
                .hierarchy-levels {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                }
                
                .hierarchy-level {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    min-width: 120px;
                    opacity: 0.5;
                    transition: all 0.3s ease;
                }
                
                .hierarchy-level.active {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    transform: scale(1.05);
                }
                
                .level-icon {
                    font-size: 2.5rem;
                }
                
                .level-name {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                    text-align: center;
                }
                
                .level-arrow {
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 1.5rem;
                }
                
                .country-selection {
                    width: 100%;
                    max-width: 600px;
                    margin: 2rem 0;
                    padding: 2rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    border: 2px dashed rgba(255, 255, 255, 0.2);
                }
                
                .country-title {
                    font-size: 1.2rem;
                    color: #ffffff;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                
                .country-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                
                .country-option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .country-option:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
                
                .country-option.selected {
                    background: rgba(0, 153, 255, 0.2);
                    border-color: #0099ff;
                }
                
                .country-flag {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                
                .country-name {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.9);
                    text-align: center;
                }
                
                .splash-actions {
                    margin-top: 2rem;
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .btn-splash {
                    padding: 0.875rem 1.75rem;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    min-width: 140px;
                    text-align: center;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }
                
                .btn-splash:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                }
                
                .btn-splash-primary {
                    background: #0099ff;
                    border-color: #0099ff;
                }
                
                .btn-splash-primary:hover {
                    background: #007bff;
                    border-color: #007bff;
                }
                
                .splash-metrics {
                    position: absolute;
                    bottom: 2rem;
                    left: 2rem;
                    right: 2rem;
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.5);
                }
                
                .metric-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .metric-value {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 600;
                }
                
                .splash-error {
                    width: 100%;
                    max-width: 600px;
                    margin: 2rem 0;
                    padding: 1.5rem;
                    background: rgba(220, 53, 69, 0.1);
                    border-radius: 12px;
                    border-left: 4px solid #dc3545;
                }
                
                .error-title {
                    font-size: 1.2rem;
                    color: #ffffff;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .error-message {
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 1rem;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .splash-screen {
                        padding: 1rem;
                    }
                    
                    .splash-logo {
                        font-size: 6rem;
                    }
                    
                    .splash-title {
                        font-size: 3rem;
                    }
                    
                    .splash-subtitle {
                        font-size: 1.2rem;
                    }
                    
                    .hierarchy-levels {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    
                    .level-arrow {
                        transform: rotate(90deg);
                    }
                    
                    .country-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    
                    .splash-metrics {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }
                }
                
                /* Animation for completion */
                .splash-complete {
                    animation: fadeOut 0.5s ease 0.5s forwards;
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; visibility: hidden; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupPerformanceMonitoring() {
        // Record start time
        this.state.startTime = performance.now();
        
        // Set up timeout warning
        this.performanceTimeout = setTimeout(() => {
            if (this.state.active && this.state.progress < 100) {
                this.addError('timeout', 'Loading is taking longer than expected');
            }
        }, this.config.performance.warningTime);
        
        // Set up maximum timeout
        this.maxTimeout = setTimeout(() => {
            if (this.state.active) {
                this.showError('timeout');
            }
        }, this.config.performance.maxLoadTime);
    }
    
    loadState() {
        try {
            // Load saved country
            const savedCountry = localStorage.getItem('mpesewa_country');
            if (savedCountry) {
                this.state.country = savedCountry;
            }
            
            // Load other saved state
            const savedState = localStorage.getItem('mpesewa_splash_state');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.state = { ...this.state, ...parsed };
            }
        } catch (error) {
            console.error('Failed to load splash state:', error);
        }
    }
    
    saveState() {
        try {
            localStorage.setItem('mpesewa_splash_state', JSON.stringify(this.state));
        } catch (error) {
            console.error('Failed to save splash state:', error);
        }
    }
    
    detectCountry() {
        const methods = this.config.countryDetection.methods;
        const priority = this.config.countryDetection.priority;
        
        for (const method of priority) {
            try {
                let country = null;
                
                switch (method) {
                    case 'saved':
                        country = localStorage.getItem('mpesewa_country');
                        if (country) return country;
                        break;
                        
                    case 'manual':
                        // Check if country was manually selected before
                        country = sessionStorage.getItem('mpesewa_manual_country');
                        if (country) return country;
                        break;
                        
                    case 'browser':
                        // Get from browser language/locale
                        const language = navigator.language || navigator.userLanguage;
                        if (language.includes('KE')) return 'kenya';
                        if (language.includes('UG')) return 'uganda';
                        if (language.includes('TZ')) return 'tanzania';
                        if (language.includes('RW')) return 'rwanda';
                        break;
                        
                    case 'ip':
                        // In real implementation, this would make an IP geolocation API call
                        // For demo, we'll simulate with a timeout
                        return new Promise(resolve => {
                            setTimeout(() => {
                                // Simulated response
                                const simulatedCountries = [
                                    'kenya', 'uganda', 'tanzania', 'rwanda', 'nigeria', 
                                    'ghana', 'south-africa', 'ethiopia'
                                ];
                                const randomCountry = simulatedCountries[
                                    Math.floor(Math.random() * simulatedCountries.length)
                                ];
                                resolve(randomCountry);
                            }, 1000);
                        });
                }
            } catch (error) {
                console.error(`Country detection method ${method} failed:`, error);
            }
        }
        
        return this.config.countryDetection.fallbackCountry;
    }
    
    async initializeHierarchy() {
        const steps = this.config.loadingSteps;
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            // Update current step
            this.state.currentStep = i;
            this.updateProgress();
            
            // Simulate step execution
            await this.executeStep(step);
            
            // Update step status
            this.updateStepStatus(step.id, 'completed');
            
            // Update hierarchy display
            this.updateHierarchyDisplay(step.id);
        }
        
        this.state.hierarchyInitialized = true;
        this.state.progress = 100;
        this.saveState();
    }
    
    async executeStep(step) {
        return new Promise((resolve) => {
            // Simulate step execution time
            setTimeout(() => {
                switch (step.id) {
                    case 'hierarchy':
                        this.initializeHierarchyStructure();
                        break;
                    case 'countries':
                        this.initializeCountries();
                        break;
                    case 'auth':
                        this.checkAuthentication();
                        break;
                    case 'groups':
                        this.loadGroups();
                        break;
                    case 'role':
                        this.detectRole();
                        break;
                    case 'subscription':
                        this.checkSubscription();
                        break;
                    case 'ledgers':
                        this.loadLedgers();
                        break;
                    case 'emergency':
                        this.loadEmergencyCategories();
                        break;
                }
                resolve();
            }, step.duration);
        });
    }
    
    initializeHierarchyStructure() {
        // Initialize the strict hierarchy
        const hierarchy = {
            global: {
                name: 'Global',
                countries: 12,
                rules: ['strict-isolation', 'no-cross-border']
            },
            countries: {
                list: [
                    'kenya', 'uganda', 'tanzania', 'rwanda', 'drc',
                    'burundi', 'nigeria', 'ghana', 'south-sudan',
                    'somalia', 'south-africa', 'ethiopia'
                ],
                rules: ['country-locked', 'currency-specific']
            },
            groups: {
                minMembers: 5,
                maxMembers: 1000,
                rules: ['invitation-only', 'trust-based']
            },
            lenders: {
                requires: ['subscription'],
                rules: ['group-only-lending', 'ledger-management']
            },
            borrowers: {
                maxGroups: 4,
                rules: ['no-subscription', 'rating-based']
            }
        };
        
        localStorage.setItem('mpesewa_hierarchy', JSON.stringify(hierarchy));
    }
    
    initializeCountries() {
        const countries = {
            'kenya': { currency: 'KSh', flag: '🇰🇪', contact: '+254 709 219 000' },
            'uganda': { currency: 'UGX', flag: '🇺🇬', contact: '+256 392 175 546' },
            'tanzania': { currency: 'TZS', flag: '🇹🇿', contact: '+255 659 073 010' },
            'rwanda': { currency: 'RWF', flag: '🇷🇼', contact: '+250 791 590 801' },
            'drc': { currency: 'CDF', flag: '🇨🇩', contact: '+243 81 000 0000' },
            'burundi': { currency: 'BIF', flag: '🇧🇮', contact: '+257 79 000 000' },
            'nigeria': { currency: 'NGN', flag: '🇳🇬', contact: '+234 800 000 0000' },
            'ghana': { currency: 'GHS', flag: '🇬🇭', contact: '+233 24 000 0000' },
            'south-sudan': { currency: 'SSP', flag: '🇸🇸', contact: '+211 955 000 000' },
            'somalia': { currency: 'SOS', flag: '🇸🇴', contact: '+252 63 0000000' },
            'south-africa': { currency: 'ZAR', flag: '🇿🇦', contact: '+27 11 000 0000' },
            'ethiopia': { currency: 'ETB', flag: '🇪🇹', contact: '+251 11 000 0000' }
        };
        
        localStorage.setItem('mpesewa_countries', JSON.stringify(countries));
    }
    
    checkAuthentication() {
        const authToken = localStorage.getItem('mpesewa_auth_token');
        if (authToken) {
            // Verify token (simulated)
            this.state.featuresVerified.auth = true;
        } else {
            this.state.featuresVerified.auth = false;
        }
    }
    
    loadGroups() {
        // Load groups from storage or initialize
        const groups = JSON.parse(localStorage.getItem('mpesewa_groups') || '[]');
        if (groups.length === 0) {
            // Initialize with demo groups
            const demoGroups = [
                { id: 'group1', name: 'Family Circle', members: 12, country: this.state.country || 'kenya' },
                { id: 'group2', name: 'Professional Network', members: 45, country: this.state.country || 'kenya' }
            ];
            localStorage.setItem('mpesewa_groups', JSON.stringify(demoGroups));
        }
    }
    
    detectRole() {
        const role = localStorage.getItem('mpesewa_role');
        if (role) {
            this.state.featuresVerified.role = true;
        } else {
            // Default to borrower for new users
            this.state.featuresVerified.role = false;
        }
    }
    
    checkSubscription() {
        const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || 'null');
        if (subscription) {
            this.state.featuresVerified.subscription = subscription.active;
        } else {
            this.state.featuresVerified.subscription = false;
        }
    }
    
    loadLedgers() {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        if (ledgers.length === 0) {
            // Initialize empty ledgers array
            localStorage.setItem('mpesewa_ledgers', JSON.stringify([]));
        }
    }
    
    loadEmergencyCategories() {
        const categories = [
            { id: 'fare', name: 'M-pesewa Fare', icon: '🚌', description: 'Transport money' },
            { id: 'data', name: 'M-pesewa Data', icon: '📶', description: 'Internet bundles' },
            { id: 'gas', name: 'Cooking Gas', icon: '🔥', description: 'Gas refill' },
            { id: 'food', name: 'M-pesewa Food', icon: '🍲', description: 'Emergency food' },
            { id: 'electricity', name: 'Electricity', icon: '⚡', description: 'Power tokens' },
            { id: 'medicine', name: 'Medicine', icon: '💊', description: 'Medical expenses' }
        ];
        
        localStorage.setItem('mpesewa_emergency_categories', JSON.stringify(categories));
    }
    
    updateProgress() {
        const progress = (this.state.currentStep / this.state.totalSteps) * 100;
        this.state.progress = Math.min(progress, 100);
        
        // Update performance metrics
        const currentTime = performance.now();
        this.state.performanceMetrics = {
            loadTime: currentTime - this.state.startTime,
            stepsCompleted: this.state.currentStep,
            stepsTotal: this.state.totalSteps
        };
        
        this.saveState();
        
        // Update UI if rendered
        if (this.currentContainer) {
            this.updateProgressUI();
        }
    }
    
    updateProgressUI() {
        const progressBar = this.currentContainer.querySelector('.splash-progress-fill');
        const progressLabel = this.currentContainer.querySelector('.progress-percentage');
        
        if (progressBar) {
            progressBar.style.width = `${this.state.progress}%`;
        }
        
        if (progressLabel) {
            progressLabel.textContent = `${Math.round(this.state.progress)}%`;
        }
    }
    
    updateStepStatus(stepId, status) {
        const stepElement = this.currentContainer?.querySelector(`[data-step="${stepId}"]`);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed', 'error');
            stepElement.classList.add(status);
            
            // Update status icon
            const statusIcon = stepElement.querySelector('.step-status');
            if (statusIcon) {
                statusIcon.textContent = status === 'completed' ? '✅' :
                                        status === 'error' ? '❌' :
                                        status === 'active' ? '⏳' : '';
            }
        }
    }
    
    updateHierarchyDisplay(completedStep) {
        const hierarchyMap = {
            'hierarchy': 'global',
            'countries': 'countries',
            'groups': 'groups',
            'role': this.state.featuresVerified.role === 'lender' ? 'lenders' : 'borrowers',
            'subscription': 'lenders',
            'ledgers': 'lenders'
        };
        
        const level = hierarchyMap[completedStep];
        if (level && this.currentContainer) {
            const levelElement = this.currentContainer.querySelector(`[data-hierarchy="${level}"]`);
            if (levelElement) {
                // Reset all levels
                this.currentContainer.querySelectorAll('.hierarchy-level').forEach(el => {
                    el.classList.remove('active');
                });
                
                // Activate current level
                levelElement.classList.add('active');
            }
        }
    }
    
    addError(type, message) {
        this.state.errors.push({ type, message, timestamp: Date.now() });
        
        // Update UI if rendered
        if (this.currentContainer) {
            this.showErrors();
        }
    }
    
    showErrors() {
        if (this.state.errors.length === 0) return;
        
        const errorsContainer = this.currentContainer.querySelector('.splash-errors');
        if (!errorsContainer) return;
        
        const errorsHtml = this.state.errors.map(error => `
            <div class="splash-error">
                <div class="error-title">
                    <span>⚠️</span>
                    <span>${this.config.errors[error.type]?.title || 'Error'}</span>
                </div>
                <div class="error-message">${error.message}</div>
            </div>
        `).join('');
        
        errorsContainer.innerHTML = errorsHtml;
    }
    
    showError(type) {
        const errorConfig = this.config.errors[type];
        if (!errorConfig) return;
        
        this.addError(type, errorConfig.message);
        
        // Show error screen
        this.showVariant('error-recovery');
    }
    
    showVariant(variant) {
        this.state.variant = variant;
        this.state.active = true;
        this.render();
        
        const variantConfig = this.config.variants[variant];
        if (!variantConfig) return;
        
        // Auto-proceed if configured
        if (variantConfig.autoProceed && variantConfig.duration) {
            setTimeout(() => {
                this.handleNextAction(variantConfig.nextAction);
            }, variantConfig.duration);
        }
    }
    
    handleNextAction(action) {
        switch (action) {
            case 'load-app':
                this.startAppLoading();
                break;
            case 'load-country':
                this.showCountrySelection();
                break;
            case 'check-subscription':
                this.checkSubscriptionStatus();
                break;
            case 'load-offline':
                this.loadOfflineData();
                break;
            case 'recover-session':
                this.recoverSession();
                break;
            case 'complete':
                this.complete();
                break;
        }
    }
    
    startAppLoading() {
        // Show initial loading steps
        this.showVariant('loading-data');
        
        // Start hierarchy initialization
        this.initializeHierarchy();
        
        // Check for country
        if (!this.state.country) {
            this.detectCountry().then(country => {
                this.state.country = country;
                localStorage.setItem('mpesewa_country', country);
                this.saveState();
                
                // Update UI
                if (this.currentContainer) {
                    this.updateCountryUI();
                }
            });
        }
    }
    
    showCountrySelection() {
        const countrySelection = document.createElement('div');
        countrySelection.className = 'country-selection';
        countrySelection.innerHTML = this.renderCountrySelection();
        
        const content = this.currentContainer.querySelector('.splash-content');
        if (content) {
            content.appendChild(countrySelection);
        }
    }
    
    renderCountrySelection() {
        const countries = {
            'kenya': { name: 'Kenya', flag: '🇰🇪' },
            'uganda': { name: 'Uganda', flag: '🇺🇬' },
            'tanzania': { name: 'Tanzania', flag: '🇹🇿' },
            'rwanda': { name: 'Rwanda', flag: '🇷🇼' },
            'drc': { name: 'DR Congo', flag: '🇨🇩' },
            'burundi': { name: 'Burundi', flag: '🇧🇮' },
            'nigeria': { name: 'Nigeria', flag: '🇳🇬' },
            'ghana': { name: 'Ghana', flag: '🇬🇭' },
            'south-sudan': { name: 'South Sudan', flag: '🇸🇸' },
            'somalia': { name: 'Somalia', flag: '🇸🇴' },
            'south-africa': { name: 'South Africa', flag: '🇿🇦' },
            'ethiopia': { name: 'Ethiopia', flag: '🇪🇹' }
        };
        
        return `
            <div class="country-title">Select Your Country</div>
            <div class="country-subtitle" style="color: rgba(255, 255, 255, 0.7); margin-bottom: 1rem; font-size: 0.95rem;">
                Country selection is permanent and enforces strict isolation rules
            </div>
            <div class="country-grid">
                ${Object.entries(countries).map(([code, country]) => `
                    <div class="country-option ${this.state.country === code ? 'selected' : ''}" 
                         data-country="${code}"
                         onclick="window.splashScreen.selectCountry('${code}')">
                        <div class="country-flag">${country.flag}</div>
                        <div class="country-name">${country.name}</div>
                    </div>
                `).join('')}
            </div>
            <div class="splash-actions" style="margin-top: 2rem;">
                <button class="btn-splash btn-splash-primary" onclick="window.splashScreen.confirmCountry()">
                    Confirm Selection
                </button>
            </div>
        `;
    }
    
    selectCountry(countryCode) {
        this.state.country = countryCode;
        
        // Update UI
        if (this.currentContainer) {
            this.currentContainer.querySelectorAll('.country-option').forEach(option => {
                option.classList.remove('selected');
                if (option.dataset.country === countryCode) {
                    option.classList.add('selected');
                }
            });
        }
    }
    
    confirmCountry() {
        if (!this.state.country) {
            alert('Please select a country');
            return;
        }
        
        localStorage.setItem('mpesewa_country', this.state.country);
        sessionStorage.setItem('mpesewa_manual_country', this.state.country);
        this.saveState();
        
        // Continue with app loading
        this.startAppLoading();
    }
    
    checkSubscriptionStatus() {
        // Check subscription and proceed accordingly
        const subscription = JSON.parse(localStorage.getItem('mpesewa_subscription') || 'null');
        const role = localStorage.getItem('mpesewa_role');
        
        if (role === 'lender' && (!subscription || !subscription.active)) {
            // Redirect to subscription page
            setTimeout(() => {
                window.location.href = 'subscription/plans.html';
            }, 1000);
        } else {
            this.complete();
        }
    }
    
    loadOfflineData() {
        // Load cached data for offline use
        console.log('Loading offline data...');
        this.complete();
    }
    
    recoverSession() {
        // Attempt to recover session
        console.log('Recovering session...');
        this.complete();
    }
    
    updateCountryUI() {
        if (!this.state.country || !this.currentContainer) return;
        
        const countryFlag = this.currentContainer.querySelector('.country-flag-display');
        const countryName = this.currentContainer.querySelector('.country-name-display');
        
        if (countryFlag) {
            const flags = {
                'kenya': '🇰🇪', 'uganda': '🇺🇬', 'tanzania': '🇹🇿', 'rwanda': '🇷🇼',
                'drc': '🇨🇩', 'burundi': '🇧🇮', 'nigeria': '🇳🇬', 'ghana': '🇬🇭',
                'south-sudan': '🇸🇸', 'somalia': '🇸🇴', 'south-africa': '🇿🇦', 'ethiopia': '🇪🇹'
            };
            countryFlag.textContent = flags[this.state.country] || '🇺🇳';
        }
        
        if (countryName) {
            const names = {
                'kenya': 'Kenya', 'uganda': 'Uganda', 'tanzania': 'Tanzania', 'rwanda': 'Rwanda',
                'drc': 'DR Congo', 'burundi': 'Burundi', 'nigeria': 'Nigeria', 'ghana': 'Ghana',
                'south-sudan': 'South Sudan', 'somalia': 'Somalia', 'south-africa': 'South Africa',
                'ethiopia': 'Ethiopia'
            };
            countryName.textContent = names[this.state.country] || 'Unknown';
        }
    }
    
    render(container = document.body) {
        const variantConfig = this.config.variants[this.state.variant];
        if (!variantConfig) return;
        
        const hierarchyLevels = [
            { id: 'global', icon: '🌍', name: 'Global' },
            { id: 'countries', icon: '🇺🇳', name: 'Country' },
            { id: 'groups', icon: '👥', name: 'Group' },
            { id: 'lenders', icon: '💰', name: 'Lender' },
            { id: 'borrowers', icon: '🙋', name: 'Borrower' }
        ];
        
        const html = `
            <div class="splash-screen">
                <div class="splash-content">
                    <div class="splash-logo" style="color: ${variantConfig.color};">
                        ${variantConfig.icon}
                    </div>
                    
                    <h1 class="splash-title">${variantConfig.title}</h1>
                    
                    <div class="splash-subtitle">${variantConfig.subtitle}</div>
                    
                    ${this.state.country ? `
                        <div style="margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem; color: rgba(255, 255, 255, 0.8);">
                            <span class="country-flag-display">${this.getCountryFlag(this.state.country)}</span>
                            <span class="country-name-display">${this.getCountryName(this.state.country)}</span>
                        </div>
                    ` : ''}
                    
                    ${variantConfig.showProgress ? `
                        <div class="splash-progress-container">
                            <div class="splash-progress-label">
                                <span>Loading M-Pesewa</span>
                                <span class="progress-percentage">${Math.round(this.state.progress)}%</span>
                            </div>
                            <div class="splash-progress-bar">
                                <div class="splash-progress-fill" style="width: ${this.state.progress}%"></div>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${this.state.variant === 'initial' ? `
                        <div class="hierarchy-display">
                            <div class="hierarchy-title">Initializing M-Pesewa Hierarchy</div>
                            <div class="hierarchy-levels">
                                ${hierarchyLevels.map((level, index) => `
                                    <div class="hierarchy-level" data-hierarchy="${level.id}">
                                        <div class="level-icon">${level.icon}</div>
                                        <div class="level-name">${level.name}</div>
                                    </div>
                                    ${index < hierarchyLevels.length - 1 ? '<div class="level-arrow">→</div>' : ''}
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="splash-steps">
                            ${this.config.loadingSteps.map((step, index) => `
                                <div class="splash-step ${index === this.state.currentStep ? 'active' : 
                                                         index < this.state.currentStep ? 'completed' : ''}"
                                     data-step="${step.id}">
                                    <div class="step-icon">${step.icon}</div>
                                    <div class="step-content">
                                        <div class="step-label">${step.label}</div>
                                        <div class="step-description">${step.description}</div>
                                    </div>
                                    <div class="step-status">
                                        ${index < this.state.currentStep ? '✅' : 
                                          index === this.state.currentStep ? '⏳' : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="splash-errors"></div>
                    
                    ${!variantConfig.autoProceed ? `
                        <div class="splash-actions">
                            <button class="btn-splash" onclick="window.splashScreen.retry()">
                                Retry
                            </button>
                            <button class="btn-splash btn-splash-primary" onclick="window.splashScreen.skip()">
                                Skip
                            </button>
                        </div>
                    ` : ''}
                </div>
                
                <div class="splash-metrics">
                    <div class="metric-item">
                        <div class="metric-label">Load Time</div>
                        <div class="metric-value">
                            ${((performance.now() - this.state.startTime) / 1000).toFixed(1)}s
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">Steps</div>
                        <div class="metric-value">
                            ${this.state.currentStep}/${this.state.totalSteps}
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">Hierarchy</div>
                        <div class="metric-value">
                            ${this.state.hierarchyInitialized ? '✅' : '⏳'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Clear container and add splash screen
        if (container === document.body) {
            // Remove any existing splash screen
            const existing = document.querySelector('.splash-screen');
            if (existing) existing.remove();
            
            // Add new splash screen
            document.body.insertAdjacentHTML('beforeend', html);
            this.currentContainer = document.querySelector('.splash-screen');
        } else {
            container.innerHTML = html;
            this.currentContainer = container.querySelector('.splash-screen') || container;
        }
        
        // Show errors if any
        this.showErrors();
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
    
    getCountryFlag(countryCode) {
        const flags = {
            'kenya': '🇰🇪', 'uganda': '🇺🇬', 'tanzania': '🇹🇿', 'rwanda': '🇷🇼',
            'drc': '🇨🇩', 'burundi': '🇧🇮', 'nigeria': '🇳🇬', 'ghana': '🇬🇭',
            'south-sudan': '🇸🇸', 'somalia': '🇸🇴', 'south-africa': '🇿🇦',
            'ethiopia': '🇪🇹'
        };
        return flags[countryCode] || '🇺🇳';
    }
    
    getCountryName(countryCode) {
        const names = {
            'kenya': 'Kenya', 'uganda': 'Uganda', 'tanzania': 'Tanzania',
            'rwanda': 'Rwanda', 'drc': 'DR Congo', 'burundi': 'Burundi',
            'nigeria': 'Nigeria', 'ghana': 'Ghana', 'south-sudan': 'South Sudan',
            'somalia': 'Somalia', 'south-africa': 'South Africa', 'ethiopia': 'Ethiopia'
        };
        return names[countryCode] || 'Unknown Country';
    }
    
    retry() {
        // Clear timeouts
        if (this.performanceTimeout) clearTimeout(this.performanceTimeout);
        if (this.maxTimeout) clearTimeout(this.maxTimeout);
        
        // Reset state
        this.state.progress = 0;
        this.state.currentStep = 0;
        this.state.errors = [];
        this.state.startTime = performance.now();
        
        // Restart
        this.setupPerformanceMonitoring();
        this.render();
        this.startAppLoading();
    }
    
    skip() {
        // Skip to completion
        this.complete();
    }
    
    complete() {
        // Clear timeouts
        if (this.performanceTimeout) clearTimeout(this.performanceTimeout);
        if (this.maxTimeout) clearTimeout(this.maxTimeout);
        
        // Update state
        this.state.active = false;
        this.state.progress = 100;
        this.saveState();
        
        // Add completion class for fade out
        if (this.currentContainer) {
            this.currentContainer.classList.add('splash-complete');
        }
        
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('mpesewa:splash-complete', {
            detail: {
                loadTime: performance.now() - this.state.startTime,
                hierarchyInitialized: this.state.hierarchyInitialized,
                country: this.state.country,
                errors: this.state.errors
            }
        }));
        
        // Remove splash screen after animation
        setTimeout(() => {
            if (this.currentContainer && this.currentContainer.parentNode) {
                this.currentContainer.remove();
            }
            
            // Restore body scrolling
            document.body.style.overflow = '';
        }, 500);
    }
    
    /**
     * Show splash screen with specified variant
     * @param {string} variant - Variant key
     * @param {HTMLElement} container - Container element
     */
    show(variant = 'initial', container = document.body) {
        this.state.variant = variant;
        this.state.active = true;
        this.render(container);
        
        const variantConfig = this.config.variants[variant];
        if (variantConfig.autoProceed && variantConfig.duration) {
            setTimeout(() => {
                this.handleNextAction(variantConfig.nextAction);
            }, variantConfig.duration);
        }
    }
    
    /**
     * Hide splash screen immediately
     */
    hide() {
        if (this.currentContainer && this.currentContainer.parentNode) {
            this.currentContainer.remove();
        }
        
        // Clear timeouts
        if (this.performanceTimeout) clearTimeout(this.performanceTimeout);
        if (this.maxTimeout) clearTimeout(this.maxTimeout);
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        this.state.active = false;
    }
    
    /**
     * Register web component
     */
    static registerWebComponent() {
        if (!customElements.get('mp-splash-screen')) {
            class MPSplashScreen extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.splashScreen = new SplashScreen();
                }
                
                connectedCallback() {
                    const variant = this.getAttribute('variant') || 'initial';
                    const autostart = this.getAttribute('autostart') !== 'false';
                    
                    if (autostart) {
                        this.splashScreen.show(variant, this.shadowRoot);
                    }
                }
                
                static get observedAttributes() {
                    return ['variant', 'autostart'];
                }
                
                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue !== newValue && this.isConnected) {
                        this.connectedCallback();
                    }
                }
            }
            
            customElements.define('mp-splash-screen', MPSplashScreen);
        }
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SplashScreen;
} else if (typeof window !== 'undefined') {
    window.SplashScreen = SplashScreen;
    window.splashScreen = new SplashScreen();
    
    // Auto-initialize
    document.addEventListener('DOMContentLoaded', () => {
        SplashScreen.registerWebComponent();
        
        // Auto-show splash screen on initial load
        const shouldShowSplash = !sessionStorage.getItem('mpesewa_splash_shown');
        if (shouldShowSplash && window.location.pathname.endsWith('index.html')) {
            window.splashScreen.show('initial');
            sessionStorage.setItem('mpesewa_splash_shown', 'true');
        }
        
        // Listen for splash complete event
        window.addEventListener('mpesewa:splash-complete', () => {
            console.log('Splash screen completed:', event.detail);
        });
    });
}

// Global splash functions
if (typeof window !== 'undefined') {
    window.showSplash = function(variant) {
        const splashScreen = new SplashScreen();
        splashScreen.show(variant);
    };
    
    window.hideSplash = function() {
        const splashScreen = new SplashScreen();
        splashScreen.hide();
    };
}