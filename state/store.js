/**
 * M-PESEWA GLOBAL STATE STORE
 * Implements strict hierarchy: Global → Countries → Groups → Lenders → Borrowers/Ledgers
 * Country isolation enforced. No cross-country lending/borrowing.
 */

class MpesewaStore {
    constructor() {
        this.state = this.getInitialState();
        this.listeners = new Map();
        this.pendingActions = [];
        this.isProcessing = false;
        
        // Initialize store
        this.initializeStore();
    }
    
    /**
     * STRICT INITIAL STATE - NON-NEGOTIABLE HIERARCHY
     */
    getInitialState() {
        return {
            // AUTHENTICATION
            auth: {
                isAuthenticated: false,
                user: null,
                token: null,
                sessionExpiry: null,
                loginMethod: null, // 'password', 'google', etc.
                lastActivity: null
            },
            
            // USER PROFILE
            user: {
                id: null,
                username: null,
                email: null,
                phone: null,
                fullName: null,
                nationalId: null,
                location: null,
                profileImage: null,
                createdAt: null,
                updatedAt: null,
                isVerified: false,
                verificationLevel: 0 // 0-3
            },
            
            // USER ROLES (Dual role system)
            role: {
                currentRole: null, // 'borrower', 'lender', 'admin'
                availableRoles: [],
                roleSwitchesRemaining: 2, // Can switch roles twice per month
                lastRoleSwitch: null
            },
            
            // COUNTRY ISOLATION (MANDATORY)
            country: {
                currentCountry: null,
                availableCountries: [
                    { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
                    { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
                    { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
                    { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
                    { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
                    { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩' },
                    { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
                    { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
                    { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
                    { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴' },
                    { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
                    { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' }
                ],
                countryLock: true, // Once set, cannot change without admin approval
                countryRules: {},
                countrySpecificData: {}
            },
            
            // GROUPS HIERARCHY (Core of M-Pesewa)
            group: {
                currentGroup: null,
                availableGroups: [], // Max 4 per user with good rating
                groupInvitations: [],
                groupRequests: [],
                groups: {}, // Detailed group data by ID
                
                // Group structure
                groupStructure: {
                    Global: {
                        Countries: {
                            // Country-specific groups
                        }
                    }
                }
            },
            
            // LENDER SPECIFIC STATE
            lender: {
                isLender: false,
                subscriptionLevel: null, // 'basic', 'premium', 'super', 'lender_of_lenders'
                subscriptionExpiry: null, // 28th of each month
                subscriptionStatus: 'inactive', // 'active', 'expired', 'pending'
                lendingLimits: {
                    basic: 1500,
                    premium: 5000,
                    super: 20000,
                    lender_of_lenders: 50000
                },
                currentLimit: 0,
                amountLent: 0,
                activeLedgers: 0,
                clearedLedgers: 0,
                outstandingAmount: 0,
                expectedInterest: 0,
                lendingCategories: [], // Categories lender supports
                blockedUntil: null // If subscription expired
            },
            
            // BORROWER SPECIFIC STATE
            borrower: {
                isBorrower: false,
                currentLoans: [],
                loanHistory: [],
                borrowingLimits: {},
                activeLoanCount: 0,
                totalBorrowed: 0,
                totalRepaid: 0,
                totalInterestPaid: 0,
                rating: 5.0, // 1-5 star system
                blacklistStatus: null, // null, 'pending', 'active'
                defaultedLoans: [],
                repaymentHistory: [],
                groupMemberships: [] // Max 4 groups
            },
            
            // LEDGER SYSTEM (Core feature)
            ledger: {
                ledgers: {}, // Keyed by ledger ID
                activeLedgers: [],
                clearedLedgers: [],
                overdueLedgers: [],
                defaultedLedgers: [],
                
                // Ledger structure template
                ledgerTemplate: {
                    id: null,
                    lenderId: null,
                    borrowerId: null,
                    groupId: null,
                    countryCode: null,
                    
                    // Borrower details
                    borrowerName: null,
                    borrowerContact: null,
                    borrowerLocation: null,
                    
                    // Guarantors (2 required)
                    guarantor1: { name: null, contact: null },
                    guarantor2: { name: null, contact: null },
                    
                    // Loan details
                    loanCategory: null,
                    amountBorrowed: 0,
                    dateBorrowed: null,
                    expectedRepaymentDate: null,
                    
                    // Financials
                    interestRate: 10, // 10% per week
                    interestAmount: 0,
                    penaltyRate: 5, // 5% daily after 7 days
                    penaltyAmount: 0,
                    totalDue: 0,
                    amountRepaid: 0,
                    amountOverdue: 0,
                    
                    // Status
                    status: 'active', // 'active', 'cleared', 'defaulted'
                    daysOverdue: 0,
                    
                    // Repayment tracking
                    partialRepayments: [],
                    lastRepaymentDate: null,
                    
                    // Ratings
                    borrowerRating: null, // 1-5 stars
                    lenderRating: null, // 1-5 stars
                    
                    createdAt: null,
                    updatedAt: null,
                    clearedAt: null
                }
            },
            
            // SUBSCRIPTION MANAGEMENT
            subscription: {
                plans: {
                    basic: {
                        name: 'Basic',
                        weeklyLimit: 1500,
                        monthlyFee: 50,
                        biAnnualFee: 250,
                        annualFee: 500,
                        crbCheck: false,
                        features: ['Basic lending access', 'Unlimited ledgers']
                    },
                    premium: {
                        name: 'Premium',
                        weeklyLimit: 5000,
                        monthlyFee: 250,
                        biAnnualFee: 1500,
                        annualFee: 2500,
                        crbCheck: false,
                        features: ['Higher limits', 'Priority support']
                    },
                    super: {
                        name: 'Super',
                        weeklyLimit: 20000,
                        monthlyFee: 1000,
                        biAnnualFee: 5000,
                        annualFee: 8500,
                        crbCheck: true,
                        features: ['Maximum limits', 'CRB check', 'Premium support']
                    },
                    lender_of_lenders: {
                        name: 'Lender of Lenders',
                        weeklyLimit: 50000,
                        monthlyFee: 500,
                        biAnnualFee: 3500,
                        annualFee: 6500,
                        crbCheck: true,
                        features: ['Highest limits', 'Custom terms', 'VIP support']
                    }
                },
                currentPlan: null,
                paymentHistory: [],
                invoices: [],
                nextBillingDate: null, // Always 28th of month
                autoRenew: false
            },
            
            // BLACKLIST SYSTEM
            blacklist: {
                isBlacklisted: false,
                blacklistReason: null,
                blacklistDate: null,
                amountOwed: 0,
                daysBlacklisted: 0,
                canAppeal: false,
                appealStatus: null,
                adminOverride: false,
                
                // Public blacklist (visible platform-wide)
                publicBlacklist: [],
                defaultersRegistry: []
            },
            
            // UI STATE
            ui: {
                theme: 'light',
                language: 'en',
                sidebarOpen: true,
                notificationsPanelOpen: false,
                mobileMenuOpen: false,
                currentPage: 'home',
                loading: false,
                error: null,
                success: null,
                lastAction: null,
                
                // Modal states
                modals: {
                    login: false,
                    register: false,
                    loanApplication: false,
                    ledgerUpdate: false,
                    ratingModal: false,
                    blacklistModal: false
                }
            },
            
            // PWA STATE
            pwa: {
                isInstalled: false,
                isOnline: true,
                hasUpdate: false,
                deferredPrompt: null,
                registration: null,
                offlineQueue: [],
                syncStatus: 'idle'
            },
            
            // SYNC STATE
            sync: {
                lastSync: null,
                syncInProgress: false,
                pendingChanges: [],
                conflictResolution: 'server_wins', // or 'client_wins', 'manual'
                offlineChanges: [],
                retryCount: 0
            },
            
            // NAVIGATION STATE
            navigation: {
                currentPath: '/',
                previousPath: null,
                history: [],
                breadcrumbs: [],
                canGoBack: false,
                canGoForward: false,
                
                // Guard states
                guards: {
                    requiresAuth: false,
                    requiresRole: null,
                    requiresCountry: false,
                    requiresSubscription: false,
                    requiresGroup: false
                }
            },
            
            // NOTIFICATION SYSTEM
            notification: {
                notifications: [],
                unreadCount: 0,
                lastNotificationId: 0,
                settings: {
                    email: true,
                    push: true,
                    sms: false,
                    inApp: true
                }
            },
            
            // AUDIT LOGGING
            audit: {
                logs: [],
                lastLogId: 0,
                enabled: true,
                retentionDays: 365,
                
                // Audit categories
                categories: {
                    auth: 'Authentication',
                    loan: 'Loan Operations',
                    ledger: 'Ledger Operations',
                    payment: 'Payment Operations',
                    admin: 'Administrative Actions',
                    security: 'Security Events'
                }
            },
            
            // VERSION & META
            meta: {
                version: '1.0.0',
                lastUpdated: null,
                initializationTime: null,
                deviceId: null,
                sessionId: null,
                buildNumber: '1'
            }
        };
    }
    
    /**
     * INITIALIZE STORE WITH PERSISTED DATA
     */
    initializeStore() {
        try {
            // Check for persisted state
            const persisted = localStorage.getItem('mpesewa_state');
            if (persisted) {
                const parsed = JSON.parse(persisted);
                
                // Apply migrations if needed
                this.state = this.applyMigrations(parsed);
                
                // Rehydrate functions and special objects
                this.rehydrateState();
                
                console.log('Store initialized from localStorage');
            } else {
                // Initialize with defaults
                this.state.meta.initializationTime = new Date().toISOString();
                this.state.meta.sessionId = this.generateSessionId();
                this.state.meta.deviceId = this.getDeviceId();
                
                console.log('Store initialized with defaults');
            }
            
            // Start persistence interval
            this.startPersistence();
            
            // Start sync interval if online
            if (navigator.onLine) {
                this.startSyncInterval();
            }
            
        } catch (error) {
            console.error('Failed to initialize store:', error);
            // Fallback to initial state
            this.state = this.getInitialState();
            this.state.meta.initializationTime = new Date().toISOString();
        }
    }
    
    /**
     * GENERATE UNIQUE SESSION ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * GET DEVICE ID
     */
    getDeviceId() {
        let deviceId = localStorage.getItem('mpesewa_device_id');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('mpesewa_device_id', deviceId);
        }
        return deviceId;
    }
    
    /**
     * APPLY STATE MIGRATIONS
     */
    applyMigrations(state) {
        const currentVersion = '1.0.0';
        const stateVersion = state.meta?.version || '0.0.0';
        
        if (stateVersion === currentVersion) {
            return state;
        }
        
        console.log(`Migrating state from ${stateVersion} to ${currentVersion}`);
        
        // Migration logic here
        // For now, just update version
        state.meta.version = currentVersion;
        state.meta.lastUpdated = new Date().toISOString();
        
        return state;
    }
    
    /**
     * REHYDRATE STATE (Restore functions/special objects)
     */
    rehydrateState() {
        // Convert string dates back to Date objects
        const dateFields = [
            'auth.sessionExpiry',
            'user.createdAt',
            'user.updatedAt',
            'role.lastRoleSwitch',
            'lender.subscriptionExpiry',
            'lender.blockedUntil',
            'ledger.ledgers.*.dateBorrowed',
            'ledger.ledgers.*.expectedRepaymentDate',
            'ledger.ledgers.*.createdAt',
            'ledger.ledgers.*.updatedAt',
            'ledger.ledgers.*.clearedAt',
            'subscription.nextBillingDate',
            'blacklist.blacklistDate',
            'sync.lastSync',
            'meta.lastUpdated',
            'meta.initializationTime'
        ];
        
        // Helper function to parse date strings
        const parseDates = (obj, path) => {
            if (typeof obj !== 'object' || obj === null) return;
            
            for (const key in obj) {
                const currentPath = path ? `${path}.${key}` : key;
                const value = obj[key];
                
                if (typeof value === 'string' && this.isDateString(value)) {
                    obj[key] = new Date(value);
                } else if (typeof value === 'object' && value !== null) {
                    parseDates(value, currentPath);
                }
            }
        };
        
        parseDates(this.state, '');
    }
    
    /**
     * CHECK IF STRING IS A DATE STRING
     */
    isDateString(str) {
        return !isNaN(Date.parse(str)) && str.length > 10;
    }
    
    /**
     * START AUTOMATIC PERSISTENCE
     */
    startPersistence() {
        // Persist on state changes with debounce
        let saveTimeout;
        const saveState = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                this.persistState();
            }, 1000); // Debounce for 1 second
        };
        
        // Listen to store changes
        this.subscribe(() => {
            saveState();
        });
        
        // Also save on page unload
        window.addEventListener('beforeunload', () => {
            this.persistState();
        });
        
        // Save every 5 minutes as backup
        setInterval(() => {
            this.persistState();
        }, 5 * 60 * 1000);
    }
    
    /**
     * PERSIST STATE TO LOCALSTORAGE
     */
    persistState() {
        try {
            // Update meta
            this.state.meta.lastUpdated = new Date().toISOString();
            
            // Convert to JSON (handles circular references)
            const stateToSave = this.prepareStateForPersistence(this.state);
            localStorage.setItem('mpesewa_state', JSON.stringify(stateToSave));
            
            // Dispatch event for other parts of app
            window.dispatchEvent(new CustomEvent('mpesewa:state-persisted'));
            
        } catch (error) {
            console.error('Failed to persist state:', error);
            
            // Try to save minimal critical data
            this.persistCriticalData();
        }
    }
    
    /**
     * PREPARE STATE FOR PERSISTENCE (Remove functions, convert Dates)
     */
    prepareStateForPersistence(state) {
        const replacer = (key, value) => {
            // Remove functions
            if (typeof value === 'function') {
                return undefined;
            }
            
            // Convert Dates to ISO strings
            if (value instanceof Date) {
                return value.toISOString();
            }
            
            // Remove any circular references
            if (value === state) {
                return undefined;
            }
            
            return value;
        };
        
        return JSON.parse(JSON.stringify(state, replacer));
    }
    
    /**
     * PERSIST CRITICAL DATA ONLY (Fallback)
     */
    persistCriticalData() {
        const critical = {
            auth: this.state.auth,
            user: this.state.user,
            country: {
                currentCountry: this.state.country.currentCountry
            },
            meta: {
                lastUpdated: new Date().toISOString()
            }
        };
        
        try {
            localStorage.setItem('mpesewa_state_critical', JSON.stringify(critical));
        } catch (error) {
            console.error('Failed to persist critical data:', error);
        }
    }
    
    /**
     * START SYNC INTERVAL
     */
    startSyncInterval() {
        // Sync every 2 minutes when online
        setInterval(() => {
            if (navigator.onLine && this.state.auth.isAuthenticated) {
                this.syncWithServer();
            }
        }, 2 * 60 * 1000);
    }
    
    /**
     * SYNC WITH SERVER
     */
    async syncWithServer() {
        if (this.state.sync.syncInProgress) return;
        
        try {
            this.setState(state => ({
                ...state,
                sync: {
                    ...state.sync,
                    syncInProgress: true
                }
            }));
            
            // Here you would implement actual server sync
            // For now, just update timestamp
            this.setState(state => ({
                ...state,
                sync: {
                    ...state.sync,
                    lastSync: new Date().toISOString(),
                    syncInProgress: false
                }
            }));
            
            console.log('Sync completed');
            
        } catch (error) {
            console.error('Sync failed:', error);
            
            this.setState(state => ({
                ...state,
                sync: {
                    ...state.sync,
                    syncInProgress: false
                },
                ui: {
                    ...state.ui,
                    error: 'Sync failed. Please check your connection.'
                }
            }));
        }
    }
    
    /**
     * GET CURRENT STATE
     */
    getState() {
        return this.state;
    }
    
    /**
     * SET STATE (Main update method)
     */
    setState(updater) {
        const prevState = this.state;
        const nextState = typeof updater === 'function' ? updater(prevState) : updater;
        
        // Deep freeze in development
        if (process.env.NODE_ENV === 'development') {
            Object.freeze(prevState);
        }
        
        // Validate state transitions (optional)
        this.validateStateTransition(prevState, nextState);
        
        // Update state
        this.state = nextState;
        
        // Notify listeners
        this.notifyListeners(prevState, nextState);
        
        return nextState;
    }
    
    /**
     * VALIDATE STATE TRANSITIONS
     */
    validateStateTransition(prevState, nextState) {
        // Ensure country isolation is maintained
        if (prevState.country.currentCountry !== nextState.country.currentCountry) {
            console.warn('Country changed, resetting group/lender/borrower data');
            
            // Reset group-specific data when country changes
            nextState.group.currentGroup = null;
            nextState.group.availableGroups = [];
            nextState.lender = {
                ...nextState.lender,
                isLender: false,
                activeLedgers: 0
            };
            nextState.borrower = {
                ...nextState.borrower,
                isBorrower: false,
                currentLoans: []
            };
        }
        
        // Ensure hierarchy: Cannot be lender without subscription
        if (nextState.lender.isLender && !nextState.lender.subscriptionLevel) {
            throw new Error('Lender must have subscription level');
        }
        
        // Ensure borrower cannot exceed 4 groups
        if (nextState.borrower.groupMemberships.length > 4) {
            throw new Error('Borrower cannot join more than 4 groups');
        }
        
        // Ensure subscription expiry is handled
        if (nextState.lender.subscriptionExpiry) {
            const expiryDate = new Date(nextState.lender.subscriptionExpiry);
            const today = new Date();
            
            if (expiryDate < today) {
                nextState.lender.subscriptionStatus = 'expired';
                nextState.lender.blockedUntil = this.calculateNextBillingDate();
            }
        }
    }
    
    /**
     * CALCULATE NEXT BILLING DATE (Always 28th)
     */
    calculateNextBillingDate() {
        const today = new Date();
        let nextMonth = today.getMonth() + 1;
        let year = today.getFullYear();
        
        if (nextMonth > 11) {
            nextMonth = 0;
            year++;
        }
        
        return new Date(year, nextMonth, 28);
    }
    
    /**
     * SUBSCRIBE TO STATE CHANGES
     */
    subscribe(listener, selectors = null) {
        const id = Math.random().toString(36).substr(2, 9);
        this.listeners.set(id, { listener, selectors });
        
        // Return unsubscribe function
        return () => {
            this.listeners.delete(id);
        };
    }
    
    /**
     * NOTIFY ALL LISTENERS
     */
    notifyListeners(prevState, nextState) {
        this.listeners.forEach(({ listener, selectors }) => {
            try {
                if (selectors) {
                    // Only notify if selected parts changed
                    const prevSelected = selectors.map(selector => selector(prevState));
                    const nextSelected = selectors.map(selector => selector(nextState));
                    
                    const hasChanged = prevSelected.some((val, i) => 
                        JSON.stringify(val) !== JSON.stringify(nextSelected[i])
                    );
                    
                    if (hasChanged) {
                        listener(nextState, prevState);
                    }
                } else {
                    // Notify for any change
                    listener(nextState, prevState);
                }
            } catch (error) {
                console.error('Listener error:', error);
            }
        });
    }
    
    /**
     * BATCH MULTIPLE UPDATES
     */
    batch(updates) {
        const batchId = Date.now();
        
        this.setState(state => {
            let newState = state;
            
            updates.forEach((update, index) => {
                try {
                    newState = typeof update === 'function' 
                        ? update(newState) 
                        : { ...newState, ...update };
                } catch (error) {
                    console.error(`Batch update ${index} failed:`, error);
                }
            });
            
            // Add audit log for batch
            if (newState.audit.enabled) {
                const logId = newState.audit.lastLogId + 1;
                newState.audit.logs.unshift({
                    id: logId,
                    type: 'batch_update',
                    batchId,
                    count: updates.length,
                    timestamp: new Date().toISOString(),
                    userId: newState.user.id
                });
                newState.audit.lastLogId = logId;
            }
            
            return newState;
        });
    }
    
    /**
     * DISPATCH ACTION (Redux-style)
     */
    dispatch(action) {
        const { type, payload } = action;
        
        switch (type) {
            case 'SET_COUNTRY':
                return this.setCountry(payload);
            case 'SET_GROUP':
                return this.setGroup(payload);
            case 'SET_ROLE':
                return this.setRole(payload);
            case 'LOGIN':
                return this.login(payload);
            case 'LOGOUT':
                return this.logout();
            case 'CREATE_LEDGER':
                return this.createLedger(payload);
            case 'UPDATE_LEDGER':
                return this.updateLedger(payload);
            case 'BLACKLIST_BORROWER':
                return this.blacklistBorrower(payload);
            case 'SUBSCRIBE':
                return this.subscribeToPlan(payload);
            default:
                console.warn(`Unknown action type: ${type}`);
        }
    }
    
    /**
     * SET COUNTRY (Strict isolation)
     */
    setCountry(countryCode) {
        const country = this.state.country.availableCountries.find(c => c.code === countryCode);
        
        if (!country) {
            throw new Error(`Country ${countryCode} not supported`);
        }
        
        // Check if user is allowed to change country
        if (this.state.country.countryLock && this.state.country.currentCountry) {
            throw new Error('Country is locked. Contact admin to change.');
        }
        
        this.setState(state => ({
            ...state,
            country: {
                ...state.country,
                currentCountry: countryCode,
                countryLock: true // Lock after first selection
            }
        }));
        
        // Load country-specific rules
        this.loadCountryRules(countryCode);
    }
    
    /**
     * LOAD COUNTRY RULES
     */
    async loadCountryRules(countryCode) {
        // This would typically fetch from API
        const rules = {
            KE: { interestCap: 10, maxLoanTerm: 7, regulations: 'Kenya Regulations' },
            UG: { interestCap: 12, maxLoanTerm: 7, regulations: 'Uganda Regulations' },
            TZ: { interestCap: 10, maxLoanTerm: 7, regulations: 'Tanzania Regulations' },
            RW: { interestCap: 10, maxLoanTerm: 7, regulations: 'Rwanda Regulations' },
            BI: { interestCap: 15, maxLoanTerm: 7, regulations: 'Burundi Regulations' },
            CD: { interestCap: 20, maxLoanTerm: 7, regulations: 'DRC Regulations' },
            NG: { interestCap: 10, maxLoanTerm: 7, regulations: 'Nigeria Regulations' },
            GH: { interestCap: 10, maxLoanTerm: 7, regulations: 'Ghana Regulations' },
            SS: { interestCap: 15, maxLoanTerm: 7, regulations: 'South Sudan Regulations' },
            SO: { interestCap: 15, maxLoanTerm: 7, regulations: 'Somalia Regulations' },
            ZA: { interestCap: 5, maxLoanTerm: 7, regulations: 'South Africa Regulations' },
            ET: { interestCap: 10, maxLoanTerm: 7, regulations: 'Ethiopia Regulations' }
        };
        
        this.setState(state => ({
            ...state,
            country: {
                ...state.country,
                countryRules: rules[countryCode] || {},
                countrySpecificData: {}
            }
        }));
    }
    
    /**
     * SET GROUP
     */
    setGroup(groupId) {
        if (!this.state.country.currentCountry) {
            throw new Error('Select country first');
        }
        
        const group = this.state.group.groups[groupId];
        if (!group) {
            throw new Error('Group not found');
        }
        
        // Verify group is in current country
        if (group.country !== this.state.country.currentCountry) {
            throw new Error('Group not in selected country');
        }
        
        this.setState(state => ({
            ...state,
            group: {
                ...state.group,
                currentGroup: groupId
            }
        }));
    }
    
    /**
     * SET ROLE (Dual role system)
     */
    setRole(role) {
        if (!['borrower', 'lender', 'admin'].includes(role)) {
            throw new Error('Invalid role');
        }
        
        // Check role switch limits
        const today = new Date();
        const lastSwitch = this.state.role.lastRoleSwitch 
            ? new Date(this.state.role.lastRoleSwitch)
            : null;
        
        if (lastSwitch) {
            const monthDiff = (today.getFullYear() - lastSwitch.getFullYear()) * 12 + 
                            (today.getMonth() - lastSwitch.getMonth());
            
            if (monthDiff < 1 && this.state.role.roleSwitchesRemaining <= 0) {
                throw new Error('Monthly role switch limit reached');
            }
        }
        
        // Reset switches at month boundary
        if (lastSwitch && lastSwitch.getMonth() !== today.getMonth()) {
            this.setState(state => ({
                ...state,
                role: {
                    ...state.role,
                    roleSwitchesRemaining: 2
                }
            }));
        }
        
        this.setState(state => ({
            ...state,
            role: {
                ...state.role,
                currentRole: role,
                lastRoleSwitch: today.toISOString(),
                roleSwitchesRemaining: state.role.roleSwitchesRemaining - 1
            },
            lender: role === 'lender' ? state.lender : { ...state.lender, isLender: false },
            borrower: role === 'borrower' ? state.borrower : { ...state.borrower, isBorrower: false }
        }));
    }
    
    /**
     * LOGIN
     */
    login(credentials) {
        // This would typically call an API
        const mockUser = {
            id: 'user_' + Date.now(),
            username: credentials.username || 'user123',
            email: credentials.email || 'user@example.com',
            phone: '+254700000000',
            fullName: 'John Doe',
            nationalId: '12345678',
            location: 'Nairobi, Kenya',
            profileImage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isVerified: true,
            verificationLevel: 2
        };
        
        this.setState(state => ({
            ...state,
            auth: {
                isAuthenticated: true,
                user: mockUser.id,
                token: 'mock_token_' + Date.now(),
                sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                loginMethod: credentials.method || 'password',
                lastActivity: new Date().toISOString()
            },
            user: mockUser,
            role: {
                ...state.role,
                currentRole: 'borrower', // Default role
                availableRoles: ['borrower', 'lender']
            }
        }));
        
        // Load user-specific data
        this.loadUserData(mockUser.id);
    }
    
    /**
     * LOAD USER DATA
     */
    async loadUserData(userId) {
        // This would fetch from API
        // For now, set mock data
        setTimeout(() => {
            this.setState(state => ({
                ...state,
                borrower: {
                    ...state.borrower,
                    isBorrower: true,
                    rating: 4.5,
                    groupMemberships: ['group1', 'group2']
                },
                group: {
                    ...state.group,
                    availableGroups: [
                        { id: 'group1', name: 'Family Group', country: 'KE', memberCount: 15 },
                        { id: 'group2', name: 'Work Group', country: 'KE', memberCount: 8 }
                    ]
                }
            }));
        }, 100);
    }
    
    /**
     * LOGOUT
     */
    logout() {
        // Clear sensitive data but keep some preferences
        const { ui, pwa, meta } = this.state;
        
        this.setState({
            ...this.getInitialState(),
            ui: {
                ...this.getInitialState().ui,
                theme: ui.theme,
                language: ui.language
            },
            pwa,
            meta: {
                ...meta,
                sessionId: this.generateSessionId(),
                lastUpdated: new Date().toISOString()
            }
        });
        
        // Clear authentication tokens
        localStorage.removeItem('mpesewa_auth_token');
        sessionStorage.clear();
    }
    
    /**
     * CREATE LEDGER (Core feature)
     */
    createLedger(loanData) {
        if (!this.state.lender.isLender) {
            throw new Error('Only lenders can create ledgers');
        }
        
        if (!this.state.lender.subscriptionStatus === 'active') {
            throw new Error('Subscription required to lend');
        }
        
        // Check lending limit
        const limit = this.state.lender.lendingLimits[this.state.lender.subscriptionLevel] || 0;
        if (loanData.amountBorrowed > limit) {
            throw new Error(`Amount exceeds ${this.state.lender.subscriptionLevel} limit of ${limit}`);
        }
        
        const ledgerId = 'ledger_' + Date.now();
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + 7); // 7-day repayment
        
        const interestAmount = loanData.amountBorrowed * 0.10; // 10% interest
        
        const newLedger = {
            ...this.state.ledger.ledgerTemplate,
            id: ledgerId,
            lenderId: this.state.user.id,
            borrowerId: loanData.borrowerId,
            groupId: this.state.group.currentGroup,
            countryCode: this.state.country.currentCountry,
            
            borrowerName: loanData.borrowerName,
            borrowerContact: loanData.borrowerContact,
            borrowerLocation: loanData.borrowerLocation,
            
            guarantor1: loanData.guarantor1,
            guarantor2: loanData.guarantor2,
            
            loanCategory: loanData.category,
            amountBorrowed: loanData.amountBorrowed,
            dateBorrowed: today.toISOString(),
            expectedRepaymentDate: dueDate.toISOString(),
            
            interestRate: 10,
            interestAmount,
            penaltyRate: 5,
            penaltyAmount: 0,
            totalDue: loanData.amountBorrowed + interestAmount,
            amountRepaid: 0,
            amountOverdue: 0,
            
            status: 'active',
            daysOverdue: 0,
            
            partialRepayments: [],
            
            createdAt: today.toISOString(),
            updatedAt: today.toISOString()
        };
        
        this.setState(state => ({
            ...state,
            ledger: {
                ...state.ledger,
                ledgers: {
                    ...state.ledger.ledgers,
                    [ledgerId]: newLedger
                },
                activeLedgers: [...state.ledger.activeLedgers, ledgerId]
            },
            lender: {
                ...state.lender,
                activeLedgers: state.lender.activeLedgers + 1,
                amountLent: state.lender.amountLent + loanData.amountBorrowed,
                outstandingAmount: state.lender.outstandingAmount + loanData.amountBorrowed + interestAmount,
                expectedInterest: state.lender.expectedInterest + interestAmount
            }
        }));
        
        // Add audit log
        this.addAuditLog('ledger', 'create', {
            ledgerId,
            amount: loanData.amountBorrowed,
            borrowerId: loanData.borrowerId
        });
        
        return ledgerId;
    }
    
    /**
     * UPDATE LEDGER
     */
    updateLedger({ ledgerId, updates }) {
        const ledger = this.state.ledger.ledgers[ledgerId];
        if (!ledger) {
            throw new Error('Ledger not found');
        }
        
        // Verify ownership (lender or admin)
        if (ledger.lenderId !== this.state.user.id && this.state.role.currentRole !== 'admin') {
            throw new Error('Not authorized to update this ledger');
        }
        
        const updatedLedger = {
            ...ledger,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        // Calculate overdue days if status changed
        if (updates.status === 'defaulted' || updates.status === 'overdue') {
            const dueDate = new Date(ledger.expectedRepaymentDate);
            const today = new Date();
            const daysOverdue = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
            
            updatedLedger.daysOverdue = daysOverdue;
            
            // Calculate penalty if overdue
            if (daysOverdue > 7) {
                const daysAfterGrace = daysOverdue - 7;
                const penalty = ledger.amountBorrowed * 0.05 * daysAfterGrace;
                updatedLedger.penaltyAmount = penalty;
                updatedLedger.totalDue = ledger.amountBorrowed + ledger.interestAmount + penalty;
            }
        }
        
        this.setState(state => ({
            ...state,
            ledger: {
                ...state.ledger,
                ledgers: {
                    ...state.ledger.ledgers,
                    [ledgerId]: updatedLedger
                }
            }
        }));
        
        // Add audit log
        this.addAuditLog('ledger', 'update', {
            ledgerId,
            updates: Object.keys(updates),
            newStatus: updates.status
        });
    }
    
    /**
     * BLACKLIST BORROWER
     */
    blacklistBorrower({ borrowerId, reason, amountOwed }) {
        if (!this.state.lender.isLender && this.state.role.currentRole !== 'admin') {
            throw new Error('Only lenders or admin can blacklist');
        }
        
        const blacklistEntry = {
            borrowerId,
            blacklistedBy: this.state.user.id,
            reason,
            amountOwed,
            date: new Date().toISOString(),
            status: 'active',
            canAppeal: true
        };
        
        this.setState(state => ({
            ...state,
            blacklist: {
                ...state.blacklist,
                publicBlacklist: [...state.blacklist.publicBlacklist, blacklistEntry]
            }
        }));
        
        // If admin, also update borrower state
        if (this.state.role.currentRole === 'admin') {
            this.setState(state => ({
                ...state,
                borrower: state.borrower.id === borrowerId ? {
                    ...state.borrower,
                    blacklistStatus: 'active'
                } : state.borrower
            }));
        }
        
        // Add audit log
        this.addAuditLog('security', 'blacklist', {
            borrowerId,
            reason,
            amountOwed
        });
    }
    
    /**
     * SUBSCRIBE TO PLAN
     */
    subscribeToPlan({ plan, duration, paymentMethod }) {
        if (!['basic', 'premium', 'super', 'lender_of_lenders'].includes(plan)) {
            throw new Error('Invalid plan');
        }
        
        const today = new Date();
        let expiryDate = new Date(today);
        
        // Set expiry to 28th of next month
        const nextMonth = today.getMonth() + 1;
        const year = nextMonth > 11 ? today.getFullYear() + 1 : today.getFullYear();
        const month = nextMonth > 11 ? 0 : nextMonth;
        expiryDate = new Date(year, month, 28);
        
        // Calculate fee based on duration
        const planData = this.state.subscription.plans[plan];
        let fee = 0;
        
        switch (duration) {
            case 'monthly':
                fee = planData.monthlyFee;
                break;
            case 'bi-annual':
                fee = planData.biAnnualFee;
                break;
            case 'annual':
                fee = planData.annualFee;
                break;
            default:
                throw new Error('Invalid duration');
        }
        
        this.setState(state => ({
            ...state,
            lender: {
                ...state.lender,
                subscriptionLevel: plan,
                subscriptionExpiry: expiryDate.toISOString(),
                subscriptionStatus: 'active',
                currentLimit: planData.weeklyLimit,
                blockedUntil: null
            },
            subscription: {
                ...state.subscription,
                currentPlan: {
                    plan,
                    duration,
                    fee,
                    started: today.toISOString(),
                    expires: expiryDate.toISOString()
                },
                paymentHistory: [
                    ...state.subscription.paymentHistory,
                    {
                        date: today.toISOString(),
                        amount: fee,
                        plan,
                        duration,
                        method: paymentMethod,
                        status: 'completed'
                    }
                ]
            }
        }));
        
        // Enable lender role
        this.setRole('lender');
        
        // Add audit log
        this.addAuditLog('payment', 'subscription', {
            plan,
            duration,
            fee,
            expiryDate: expiryDate.toISOString()
        });
    }
    
    /**
     * ADD AUDIT LOG
     */
    addAuditLog(category, action, details = {}) {
        if (!this.state.audit.enabled) return;
        
        const logId = this.state.audit.lastLogId + 1;
        const log = {
            id: logId,
            category,
            action,
            details,
            userId: this.state.user.id,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: 'local' // Would be populated by server
        };
        
        this.setState(state => ({
            ...state,
            audit: {
                ...state.audit,
                logs: [log, ...state.audit.logs.slice(0, 999)], // Keep last 1000 logs
                lastLogId: logId
            }
        }));
    }
    
    /**
     * RESET STORE (Development only)
     */
    resetStore() {
        if (process.env.NODE_ENV !== 'development') {
            throw new Error('Reset only allowed in development');
        }
        
        this.state = this.getInitialState();
        this.state.meta.initializationTime = new Date().toISOString();
        this.state.meta.sessionId = this.generateSessionId();
        
        localStorage.removeItem('mpesewa_state');
        localStorage.removeItem('mpesewa_state_critical');
        
        this.notifyListeners({}, this.state);
        
        console.log('Store reset to initial state');
    }
    
    /**
     * EXPORT STATE (For debugging)
     */
    exportState() {
        return this.prepareStateForPersistence(this.state);
    }
    
    /**
     * IMPORT STATE (For debugging/restore)
     */
    importState(importedState) {
        if (process.env.NODE_ENV !== 'development') {
            throw new Error('Import only allowed in development');
        }
        
        this.state = this.applyMigrations(importedState);
        this.rehydrateState();
        
        this.persistState();
        this.notifyListeners({}, this.state);
        
        console.log('State imported successfully');
    }
}

// Create singleton instance
const store = new MpesewaStore();

// Export singleton and class
export { MpesewaStore };
export default store;