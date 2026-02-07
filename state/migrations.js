/**
 * M-PESEWA STATE MIGRATIONS
 * Handles state structure changes between versions
 * Ensures backward compatibility and data integrity
 */

class StateMigrations {
    constructor() {
        this.migrations = new Map();
        this.currentVersion = '1.0.0';
        
        // Register all migrations
        this.registerMigrations();
    }
    
    /**
     * REGISTER ALL MIGRATIONS
     */
    registerMigrations() {
        // Migration from 0.1.0 to 0.2.0
        this.migrations.set('0.1.0_0.2.0', this.migrate_0_1_0_to_0_2_0.bind(this));
        
        // Migration from 0.2.0 to 0.3.0
        this.migrations.set('0.2.0_0.3.0', this.migrate_0_2_0_to_0_3_0.bind(this));
        
        // Migration from 0.3.0 to 0.4.0
        this.migrations.set('0.3.0_0.4.0', this.migrate_0_3_0_to_0_4_0.bind(this));
        
        // Migration from 0.4.0 to 0.5.0
        this.migrations.set('0.4.0_0.5.0', this.migrate_0_4_0_to_0_5_0.bind(this));
        
        // Migration from 0.5.0 to 1.0.0 (Major release)
        this.migrations.set('0.5.0_1.0.0', this.migrate_0_5_0_to_1_0_0.bind(this));
        
        // Migration from any version to current (catch-all)
        this.migrations.set('any_current', this.migrate_any_to_current.bind(this));
    }
    
    /**
     * APPLY MIGRATIONS TO STATE
     */
    applyMigrations(state, fromVersion, toVersion = this.currentVersion) {
        console.log(`Migrating state from ${fromVersion} to ${toVersion}`);
        
        let currentState = { ...state };
        let currentVersion = fromVersion;
        
        // Get migration path
        const migrationPath = this.getMigrationPath(fromVersion, toVersion);
        
        // Apply each migration in order
        for (const migrationKey of migrationPath) {
            const migration = this.migrations.get(migrationKey);
            if (migration) {
                try {
                    currentState = migration(currentState);
                    currentVersion = this.getTargetVersion(migrationKey);
                    console.log(`Applied migration: ${migrationKey}`);
                } catch (error) {
                    console.error(`Migration ${migrationKey} failed:`, error);
                    throw new Error(`Migration failed: ${migrationKey}`);
                }
            }
        }
        
        // Ensure final state has correct version
        currentState.meta = currentState.meta || {};
        currentState.meta.version = toVersion;
        currentState.meta.lastMigrated = new Date().toISOString();
        currentState.meta.migratedFrom = fromVersion;
        
        return currentState;
    }
    
    /**
     * GET MIGRATION PATH BETWEEN VERSIONS
     */
    getMigrationPath(fromVersion, toVersion) {
        const versionSequence = [
            '0.1.0',
            '0.2.0',
            '0.3.0',
            '0.4.0',
            '0.5.0',
            '1.0.0'
        ];
        
        const fromIndex = versionSequence.indexOf(fromVersion);
        const toIndex = versionSequence.indexOf(toVersion);
        
        if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
            // If version not in sequence or downgrade, use catch-all
            return ['any_current'];
        }
        
        // Build path of consecutive migrations
        const path = [];
        for (let i = fromIndex; i < toIndex; i++) {
            const migrationKey = `${versionSequence[i]}_${versionSequence[i + 1]}`;
            path.push(migrationKey);
        }
        
        return path;
    }
    
    /**
     * GET TARGET VERSION FROM MIGRATION KEY
     */
    getTargetVersion(migrationKey) {
        const parts = migrationKey.split('_');
        if (parts.length === 3) {
            return `${parts[1]}.${parts[2]}`;
        }
        return this.currentVersion;
    }
    
    /**
     * MIGRATION 0.1.0 → 0.2.0
     * Initial structure to basic app structure
     */
    migrate_0_1_0_to_0_2_0(state) {
        const migrated = { ...state };
        
        // Ensure basic structure exists
        if (!migrated.auth) {
            migrated.auth = {
                isAuthenticated: false,
                user: null,
                token: null
            };
        }
        
        if (!migrated.user) {
            migrated.user = {
                id: null,
                username: null,
                email: null
            };
        }
        
        if (!migrated.country) {
            migrated.country = {
                currentCountry: null,
                availableCountries: [
                    { code: 'KE', name: 'Kenya', currency: 'KSh' }
                ]
            };
        }
        
        // Add initial UI state
        if (!migrated.ui) {
            migrated.ui = {
                theme: 'light',
                language: 'en',
                sidebarOpen: true
            };
        }
        
        // Add meta if not exists
        if (!migrated.meta) {
            migrated.meta = {
                version: '0.2.0',
                createdAt: new Date().toISOString()
            };
        } else {
            migrated.meta.version = '0.2.0';
        }
        
        return migrated;
    }
    
    /**
     * MIGRATION 0.2.0 → 0.3.0
     * Add group and role structure
     */
    migrate_0_2_0_to_0_3_0(state) {
        const migrated = { ...state };
        
        // Add role management
        if (!migrated.role) {
            migrated.role = {
                currentRole: 'borrower', // Default role
                availableRoles: ['borrower'],
                roleSwitchesRemaining: 2
            };
        }
        
        // Add group structure
        if (!migrated.group) {
            migrated.group = {
                currentGroup: null,
                availableGroups: [],
                groups: {}
            };
        }
        
        // Add initial 12 countries
        if (migrated.country && !migrated.country.availableCountries) {
            migrated.country.availableCountries = [
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
            ];
        }
        
        // Update meta
        migrated.meta.version = '0.3.0';
        migrated.meta.updatedAt = new Date().toISOString();
        
        return migrated;
    }
    
    /**
     * MIGRATION 0.3.0 → 0.4.0
     * Add lender and borrower specific states
     */
    migrate_0_3_0_to_0_4_0(state) {
        const migrated = { ...state };
        
        // Add lender state
        if (!migrated.lender) {
            migrated.lender = {
                isLender: false,
                subscriptionLevel: null,
                subscriptionExpiry: null,
                subscriptionStatus: 'inactive',
                lendingLimits: {
                    basic: 1500,
                    premium: 5000,
                    super: 20000,
                    lender_of_lenders: 50000
                },
                currentLimit: 0,
                amountLent: 0,
                activeLedgers: 0
            };
        }
        
        // Add borrower state
        if (!migrated.borrower) {
            migrated.borrower = {
                isBorrower: false,
                currentLoans: [],
                loanHistory: [],
                rating: 5.0,
                blacklistStatus: null,
                groupMemberships: []
            };
        }
        
        // Add subscription plans
        if (!migrated.subscription) {
            migrated.subscription = {
                plans: {
                    basic: {
                        name: 'Basic',
                        weeklyLimit: 1500,
                        monthlyFee: 50
                    },
                    premium: {
                        name: 'Premium',
                        weeklyLimit: 5000,
                        monthlyFee: 250
                    },
                    super: {
                        name: 'Super',
                        weeklyLimit: 20000,
                        monthlyFee: 1000
                    }
                },
                currentPlan: null,
                paymentHistory: []
            };
        }
        
        // Update meta
        migrated.meta.version = '0.4.0';
        migrated.meta.updatedAt = new Date().toISOString();
        
        return migrated;
    }
    
    /**
     * MIGRATION 0.4.0 → 0.5.0
     * Add ledger system and blacklist
     */
    migrate_0_4_0_to_0_5_0(state) {
        const migrated = { ...state };
        
        // Add ledger system
        if (!migrated.ledger) {
            migrated.ledger = {
                ledgers: {},
                activeLedgers: [],
                clearedLedgers: [],
                overdueLedgers: [],
                
                ledgerTemplate: {
                    id: null,
                    lenderId: null,
                    borrowerId: null,
                    groupId: null,
                    countryCode: null,
                    borrowerName: null,
                    loanCategory: null,
                    amountBorrowed: 0,
                    dateBorrowed: null,
                    expectedRepaymentDate: null,
                    interestRate: 10,
                    interestAmount: 0,
                    penaltyRate: 5,
                    status: 'active',
                    daysOverdue: 0,
                    createdAt: null,
                    updatedAt: null
                }
            };
        }
        
        // Add blacklist system
        if (!migrated.blacklist) {
            migrated.blacklist = {
                isBlacklisted: false,
                blacklistReason: null,
                blacklistDate: null,
                amountOwed: 0,
                publicBlacklist: [],
                defaultersRegistry: []
            };
        }
        
        // Add PWA state
        if (!migrated.pwa) {
            migrated.pwa = {
                isInstalled: false,
                isOnline: true,
                hasUpdate: false
            };
        }
        
        // Add sync state
        if (!migrated.sync) {
            migrated.sync = {
                lastSync: null,
                syncInProgress: false,
                pendingChanges: []
            };
        }
        
        // Update meta
        migrated.meta.version = '0.5.0';
        migrated.meta.updatedAt = new Date().toISOString();
        
        return migrated;
    }
    
    /**
     * MIGRATION 0.5.0 → 1.0.0
     * Complete enterprise structure
     */
    migrate_0_5_0_to_1_0_0(state) {
        const migrated = { ...state };
        
        // Ensure all required slices exist with proper structure
        
        // NAVIGATION STATE
        if (!migrated.navigation) {
            migrated.navigation = {
                currentPath: '/',
                previousPath: null,
                history: [],
                breadcrumbs: [],
                guards: {
                    requiresAuth: false,
                    requiresRole: null,
                    requiresCountry: false,
                    requiresSubscription: false,
                    requiresGroup: false
                }
            };
        }
        
        // NOTIFICATION SYSTEM
        if (!migrated.notification) {
            migrated.notification = {
                notifications: [],
                unreadCount: 0,
                lastNotificationId: 0,
                settings: {
                    email: true,
                    push: true,
                    sms: false,
                    inApp: true
                }
            };
        }
        
        // AUDIT LOGGING
        if (!migrated.audit) {
            migrated.audit = {
                logs: [],
                lastLogId: 0,
                enabled: true,
                retentionDays: 365,
                categories: {
                    auth: 'Authentication',
                    loan: 'Loan Operations',
                    ledger: 'Ledger Operations',
                    payment: 'Payment Operations',
                    admin: 'Administrative Actions',
                    security: 'Security Events'
                }
            };
        }
        
        // ENHANCE LENDER STATE
        if (migrated.lender) {
            migrated.lender = {
                ...migrated.lender,
                clearedLedgers: migrated.lender.clearedLedgers || 0,
                outstandingAmount: migrated.lender.outstandingAmount || 0,
                expectedInterest: migrated.lender.expectedInterest || 0,
                lendingCategories: migrated.lender.lendingCategories || [],
                blockedUntil: migrated.lender.blockedUntil || null
            };
        }
        
        // ENHANCE BORROWER STATE
        if (migrated.borrower) {
            migrated.borrower = {
                ...migrated.borrower,
                borrowingLimits: migrated.borrower.borrowingLimits || {},
                activeLoanCount: migrated.borrower.activeLoanCount || 0,
                totalBorrowed: migrated.borrower.totalBorrowed || 0,
                totalRepaid: migrated.borrower.totalRepaid || 0,
                totalInterestPaid: migrated.borrower.totalInterestPaid || 0,
                defaultedLoans: migrated.borrower.defaultedLoans || [],
                repaymentHistory: migrated.borrower.repaymentHistory || []
            };
        }
        
        // ENHANCE SUBSCRIPTION STATE
        if (migrated.subscription) {
            migrated.subscription = {
                ...migrated.subscription,
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
                currentPlan: migrated.subscription.currentPlan,
                paymentHistory: migrated.subscription.paymentHistory || [],
                invoices: migrated.subscription.invoices || [],
                nextBillingDate: migrated.subscription.nextBillingDate || null,
                autoRenew: migrated.subscription.autoRenew || false
            };
        }
        
        // ENHANCE UI STATE
        if (migrated.ui) {
            migrated.ui = {
                ...migrated.ui,
                notificationsPanelOpen: migrated.ui.notificationsPanelOpen || false,
                mobileMenuOpen: migrated.ui.mobileMenuOpen || false,
                currentPage: migrated.ui.currentPage || 'home',
                loading: migrated.ui.loading || false,
                error: migrated.ui.error || null,
                success: migrated.ui.success || null,
                lastAction: migrated.ui.lastAction || null,
                modals: {
                    login: false,
                    register: false,
                    loanApplication: false,
                    ledgerUpdate: false,
                    ratingModal: false,
                    blacklistModal: false,
                    ...migrated.ui.modals
                }
            };
        }
        
        // ENHANCE SYNC STATE
        if (migrated.sync) {
            migrated.sync = {
                ...migrated.sync,
                conflictResolution: migrated.sync.conflictResolution || 'server_wins',
                offlineChanges: migrated.sync.offlineChanges || [],
                retryCount: migrated.sync.retryCount || 0
            };
        }
        
        // ENSURE META COMPLETE
        migrated.meta = {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            initializationTime: migrated.meta.initializationTime || new Date().toISOString(),
            deviceId: migrated.meta.deviceId || this.generateDeviceId(),
            sessionId: migrated.meta.sessionId || this.generateSessionId(),
            buildNumber: migrated.meta.buildNumber || '1',
            ...migrated.meta
        };
        
        return migrated;
    }
    
    /**
     * CATCH-ALL MIGRATION (Any version to current)
     */
    migrate_any_to_current(state) {
        console.log('Applying catch-all migration to current version');
        
        // Start with completely fresh state structure
        const freshState = {
            auth: state.auth || {
                isAuthenticated: false,
                user: null,
                token: null,
                sessionExpiry: null,
                loginMethod: null,
                lastActivity: null
            },
            
            user: state.user || {
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
                verificationLevel: 0
            },
            
            role: state.role || {
                currentRole: null,
                availableRoles: [],
                roleSwitchesRemaining: 2,
                lastRoleSwitch: null
            },
            
            country: state.country || {
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
                countryLock: true,
                countryRules: {},
                countrySpecificData: {}
            },
            
            group: state.group || {
                currentGroup: null,
                availableGroups: [],
                groupInvitations: [],
                groupRequests: [],
                groups: {},
                groupStructure: {
                    Global: {
                        Countries: {}
                    }
                }
            },
            
            lender: state.lender || {
                isLender: false,
                subscriptionLevel: null,
                subscriptionExpiry: null,
                subscriptionStatus: 'inactive',
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
                lendingCategories: [],
                blockedUntil: null
            },
            
            borrower: state.borrower || {
                isBorrower: false,
                currentLoans: [],
                loanHistory: [],
                borrowingLimits: {},
                activeLoanCount: 0,
                totalBorrowed: 0,
                totalRepaid: 0,
                totalInterestPaid: 0,
                rating: 5.0,
                blacklistStatus: null,
                defaultedLoans: [],
                repaymentHistory: [],
                groupMemberships: []
            },
            
            ledger: state.ledger || {
                ledgers: {},
                activeLedgers: [],
                clearedLedgers: [],
                overdueLedgers: [],
                defaultedLedgers: [],
                ledgerTemplate: {
                    id: null,
                    lenderId: null,
                    borrowerId: null,
                    groupId: null,
                    countryCode: null,
                    borrowerName: null,
                    borrowerContact: null,
                    borrowerLocation: null,
                    guarantor1: { name: null, contact: null },
                    guarantor2: { name: null, contact: null },
                    loanCategory: null,
                    amountBorrowed: 0,
                    dateBorrowed: null,
                    expectedRepaymentDate: null,
                    interestRate: 10,
                    interestAmount: 0,
                    penaltyRate: 5,
                    penaltyAmount: 0,
                    totalDue: 0,
                    amountRepaid: 0,
                    amountOverdue: 0,
                    status: 'active',
                    daysOverdue: 0,
                    partialRepayments: [],
                    lastRepaymentDate: null,
                    borrowerRating: null,
                    lenderRating: null,
                    createdAt: null,
                    updatedAt: null,
                    clearedAt: null
                }
            },
            
            subscription: state.subscription || {
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
                nextBillingDate: null,
                autoRenew: false
            },
            
            blacklist: state.blacklist || {
                isBlacklisted: false,
                blacklistReason: null,
                blacklistDate: null,
                amountOwed: 0,
                daysBlacklisted: 0,
                canAppeal: false,
                appealStatus: null,
                adminOverride: false,
                publicBlacklist: [],
                defaultersRegistry: []
            },
            
            ui: state.ui || {
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
                modals: {
                    login: false,
                    register: false,
                    loanApplication: false,
                    ledgerUpdate: false,
                    ratingModal: false,
                    blacklistModal: false
                }
            },
            
            pwa: state.pwa || {
                isInstalled: false,
                isOnline: true,
                hasUpdate: false,
                deferredPrompt: null,
                registration: null,
                offlineQueue: [],
                syncStatus: 'idle'
            },
            
            sync: state.sync || {
                lastSync: null,
                syncInProgress: false,
                pendingChanges: [],
                conflictResolution: 'server_wins',
                offlineChanges: [],
                retryCount: 0
            },
            
            navigation: state.navigation || {
                currentPath: '/',
                previousPath: null,
                history: [],
                breadcrumbs: [],
                canGoBack: false,
                canGoForward: false,
                guards: {
                    requiresAuth: false,
                    requiresRole: null,
                    requiresCountry: false,
                    requiresSubscription: false,
                    requiresGroup: false
                }
            },
            
            notification: state.notification || {
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
            
            audit: state.audit || {
                logs: [],
                lastLogId: 0,
                enabled: true,
                retentionDays: 365,
                categories: {
                    auth: 'Authentication',
                    loan: 'Loan Operations',
                    ledger: 'Ledger Operations',
                    payment: 'Payment Operations',
                    admin: 'Administrative Actions',
                    security: 'Security Events'
                }
            },
            
            meta: {
                version: '1.0.0',
                lastUpdated: new Date().toISOString(),
                initializationTime: state.meta?.initializationTime || new Date().toISOString(),
                deviceId: state.meta?.deviceId || this.generateDeviceId(),
                sessionId: state.meta?.sessionId || this.generateSessionId(),
                buildNumber: state.meta?.buildNumber || '1'
            }
        };
        
        // Preserve any valid data from old state
        this.preserveValidData(freshState, state);
        
        return freshState;
    }
    
    /**
     * PRESERVE VALID DATA FROM OLD STATE
     */
    preserveValidData(newState, oldState) {
        // Helper function to safely merge objects
        const safeMerge = (target, source, path = '') => {
            if (!source || typeof source !== 'object') return;
            
            for (const key in source) {
                const sourceValue = source[key];
                const targetValue = target[key];
                const currentPath = path ? `${path}.${key}` : key;
                
                // Skip if source value is null/undefined
                if (sourceValue === null || sourceValue === undefined) {
                    continue;
                }
                
                // If target doesn't have this key, copy if primitive
                if (targetValue === undefined) {
                    if (typeof sourceValue !== 'object' || sourceValue === null) {
                        target[key] = sourceValue;
                    }
                    continue;
                }
                
                // Handle arrays
                if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
                    // For arrays, we want to preserve the data but ensure structure
                    target[key] = sourceValue.map(item => {
                        if (typeof item === 'object' && item !== null) {
                            const template = targetValue[0] || {};
                            return { ...template, ...item };
                        }
                        return item;
                    });
                    continue;
                }
                
                // Handle objects recursively
                if (typeof sourceValue === 'object' && sourceValue !== null &&
                    typeof targetValue === 'object' && targetValue !== null) {
                    safeMerge(targetValue, sourceValue, currentPath);
                }
            }
        };
        
        // Merge old state into new state carefully
        safeMerge(newState, oldState);
        
        // Special handling for critical data
        if (oldState.auth?.isAuthenticated) {
            newState.auth.isAuthenticated = true;
            if (oldState.auth.user) newState.auth.user = oldState.auth.user;
            if (oldState.auth.token) newState.auth.token = oldState.auth.token;
        }
        
        if (oldState.country?.currentCountry) {
            newState.country.currentCountry = oldState.country.currentCountry;
        }
        
        if (oldState.user?.id) {
            newState.user.id = oldState.user.id;
            if (oldState.user.username) newState.user.username = oldState.user.username;
            if (oldState.user.email) newState.user.email = oldState.user.email;
        }
        
        // Preserve ledgers if they exist
        if (oldState.ledger?.ledgers && Object.keys(oldState.ledger.ledgers).length > 0) {
            newState.ledger.ledgers = oldState.ledger.ledgers;
        }
    }
    
    /**
     * GENERATE DEVICE ID
     */
    generateDeviceId() {
        return 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * GENERATE SESSION ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * VALIDATE STATE STRUCTURE
     */
    validateStateStructure(state) {
        const errors = [];
        
        // Check required top-level slices
        const requiredSlices = [
            'auth', 'user', 'role', 'country', 'group', 
            'lender', 'borrower', 'ledger', 'subscription',
            'blacklist', 'ui', 'pwa', 'sync', 'navigation',
            'notification', 'audit', 'meta'
        ];
        
        for (const slice of requiredSlices) {
            if (!state[slice]) {
                errors.push(`Missing required slice: ${slice}`);
            }
        }
        
        // Check critical auth structure
        if (state.auth) {
            if (typeof state.auth.isAuthenticated !== 'boolean') {
                errors.push('auth.isAuthenticated must be boolean');
            }
        }
        
        // Check country structure
        if (state.country) {
            if (!Array.isArray(state.country.availableCountries)) {
                errors.push('country.availableCountries must be an array');
            } else {
                // Check for required 12 countries
                const requiredCountries = ['KE', 'UG', 'TZ', 'RW', 'BI', 'CD', 'NG', 'GH', 'SS', 'SO', 'ZA', 'ET'];
                const countryCodes = state.country.availableCountries.map(c => c.code);
                
                for (const reqCode of requiredCountries) {
                    if (!countryCodes.includes(reqCode)) {
                        errors.push(`Missing required country: ${reqCode}`);
                    }
                }
            }
        }
        
        // Check meta version
        if (state.meta && state.meta.version !== this.currentVersion) {
            errors.push(`State version mismatch: ${state.meta.version} != ${this.currentVersion}`);
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            version: state.meta?.version || 'unknown'
        };
    }
    
    /**
     * CREATE STATE BACKUP
     */
    createBackup(state) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backup = {
            data: JSON.parse(JSON.stringify(state)),
            timestamp,
            version: state.meta?.version || 'unknown',
            checksum: this.generateStateChecksum(state)
        };
        
        return backup;
    }
    
    /**
     * GENERATE STATE CHECKSUM
     */
    generateStateChecksum(state) {
        // Simple checksum for validation
        const str = JSON.stringify(state);
        let hash = 0;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return hash.toString(16);
    }
    
    /**
     * GET MIGRATION HISTORY
     */
    getMigrationHistory(state) {
        if (!state.meta) {
            return { migrations: [], currentVersion: 'unknown' };
        }
        
        const migrations = [];
        
        // Check for migration flags
        if (state.meta.migratedFrom) {
            migrations.push({
                from: state.meta.migratedFrom,
                to: state.meta.version,
                timestamp: state.meta.lastMigrated || state.meta.updatedAt || state.meta.lastUpdated
            });
        }
        
        // Check for legacy migration data
        if (state._persist?.migratedFrom) {
            migrations.push({
                from: state._persist.migratedFrom,
                to: state._persist.version,
                timestamp: state._persist.migrationTimestamp
            });
        }
        
        return {
            migrations,
            currentVersion: state.meta.version,
            initializationTime: state.meta.initializationTime,
            lastUpdated: state.meta.lastUpdated
        };
    }
    
    /**
     * GET SUPPORTED VERSIONS
     */
    getSupportedVersions() {
        return {
            current: this.currentVersion,
            supported: [
                '0.1.0',
                '0.2.0',
                '0.3.0',
                '0.4.0',
                '0.5.0',
                '1.0.0'
            ],
            deprecated: [
                '0.1.0',
                '0.2.0',
                '0.3.0'
            ]
        };
    }
}

// Create and export singleton
let migrationsInstance = null;

export function createMigrations() {
    if (!migrationsInstance) {
        migrationsInstance = new StateMigrations();
    }
    return migrationsInstance;
}

export default migrationsInstance;