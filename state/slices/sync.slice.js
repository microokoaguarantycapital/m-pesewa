/**
 * M-PESEWA SYNC STATE SLICE
 * Data synchronization state management for offline operations and multi-device consistency
 * STRICT HIERARCHY: Global → Country → Groups → Lenders → Borrowers (Ledgers)
 * 
 * RULES:
 * 1. Country isolation for data synchronization
 * 2. Role-based sync permissions and visibility
 * 3. Subscription tier sync limits
 * 4. Conflict resolution with strict hierarchy rules
 * 5. Background sync for offline operations
 */

const SYNC_CONFIG = {
    // Initial state structure
    initialState: {
        // Sync Status
        status: {
            // Overall sync state
            overall: 'idle', // 'idle', 'syncing', 'error', 'offline', 'paused'
            
            // Individual component sync states
            components: {
                auth: 'idle',
                user: 'idle',
                country: 'idle',
                groups: 'idle',
                lenders: 'idle',
                borrowers: 'idle',
                ledgers: 'idle',
                subscriptions: 'idle',
                blacklist: 'idle',
                notifications: 'idle'
            },
            
            // Network status
            network: {
                online: typeof navigator !== 'undefined' ? navigator.onLine : true,
                connectionType: 'unknown',
                effectiveType: 'unknown',
                downlink: 0,
                rtt: 0,
                saveData: false
            },
            
            // Last sync timestamps
            lastSync: {
                full: null,
                partial: null,
                byComponent: {}
            },
            
            // Next scheduled sync
            nextSync: null,
            
            // Sync statistics
            statistics: {
                totalSyncs: 0,
                successful: 0,
                failed: 0,
                conflicts: 0,
                resolved: 0,
                pendingChanges: 0,
                syncedBytes: 0,
                averageSyncTime: 0
            }
        },
        
        // Sync Queue (STRICT HIERARCHY ORDER)
        queue: {
            // Queue by priority
            priorities: {
                critical: [],    // Auth, payments, critical updates
                high: [],        // Ledgers, repayments, blacklist
                normal: [],      // Groups, lenders, borrowers
                low: []          // Profile updates, settings
            },
            
            // Queue by component
            components: {
                auth: [],
                user: [],
                country: [],
                groups: [],
                lenders: [],
                borrowers: [],
                ledgers: [],
                subscriptions: [],
                blacklist: [],
                notifications: []
            },
            
            // Queue by country (STRICT ISOLATION)
            countries: {},
            
            // Queue metadata
            metadata: {
                totalItems: 0,
                oldestItem: null,
                newestItem: null,
                estimatedTime: 0,
                processing: false
            }
        },
        
        // Offline Changes (Pending Sync)
        offlineChanges: {
            // Changes by entity type
            changes: {
                // Example structure for each entity:
                // 'ledgers': {
                //     'country:KE:group:g1:lender:l1:borrower:b1': {
                //         id: '...',
                //         type: 'create' | 'update' | 'delete',
                //         data: { ... },
                //         timestamp: '...',
                //         synced: false,
                //         attempts: 0,
                //         lastAttempt: null,
                //         error: null
                //     }
                // }
            },
            
            // Change statistics
            statistics: {
                totalChanges: 0,
                pending: 0,
                synced: 0,
                failed: 0,
                byCountry: {},
                byEntity: {},
                byOperation: {}
            },
            
            // Change tracking
            tracking: {
                enabled: true,
                autoQueue: true,
                maxChanges: 1000,
                retentionDays: 30
            }
        },
        
        // Conflict Resolution
        conflicts: {
            // Active conflicts
            active: [],
            
            // Conflict history
            history: [],
            
            // Resolution strategies
            strategies: {
                // Default strategy per entity type
                defaults: {
                    ledgers: 'server_wins',
                    repayments: 'client_wins',
                    users: 'merge',
                    groups: 'server_wins',
                    blacklist: 'admin_wins'
                },
                
                // Available strategies
                available: [
                    'server_wins',
                    'client_wins',
                    'merge',
                    'admin_wins',
                    'manual_resolution',
                    'latest_timestamp',
                    'custom'
                ]
            },
            
            // Conflict resolution rules (STRICT HIERARCHY)
            rules: {
                // Hierarchy-based resolution
                hierarchy: {
                    global: 100,
                    country: 90,
                    group: 80,
                    lender: 70,
                    borrower: 60,
                    ledger: 50
                },
                
                // Role-based resolution priority
                roles: {
                    admin: 100,
                    lender: 80,
                    borrower: 60,
                    guest: 0
                }
            }
        },
        
        // Sync Configuration
        config: {
            // Sync intervals (in milliseconds)
            intervals: {
                fullSync: 3600000,         // 1 hour
                partialSync: 300000,       // 5 minutes
                quickSync: 60000,          // 1 minute
                retryInterval: 5000,       // 5 seconds
                heartbeat: 30000           // 30 seconds
            },
            
            // Sync thresholds
            thresholds: {
                maxQueueSize: 1000,
                maxRetries: 3,
                timeout: 30000,            // 30 seconds
                batchSize: 50,
                maxPayloadSize: 5242880    // 5 MB
            },
            
            // Sync policies
            policies: {
                // When to sync
                triggers: {
                    onNetworkChange: true,
                    onVisibilityChange: true,
                    onAppForeground: true,
                    onDataChange: true,
                    onUserActivity: true,
                    periodic: true
                },
                
                // What to sync
                components: {
                    auth: true,
                    user: true,
                    country: true,
                    groups: true,
                    lenders: true,
                    borrowers: true,
                    ledgers: true,
                    subscriptions: true,
                    blacklist: true,
                    notifications: true
                },
                
                // How to sync
                methods: {
                    backgroundSync: true,
                    foregroundSync: true,
                    manualSync: true,
                    incrementalSync: true,
                    deltaSync: true
                }
            },
            
            // Performance settings
            performance: {
                concurrency: 3,           // Max concurrent sync operations
                prefetch: true,           // Prefetch data for offline
                compression: true,        // Compress sync data
                deduplication: true,      // Deduplicate sync requests
                caching: true             // Cache sync results
            }
        },
        
        // Country-Specific Sync Settings (STRICT ISOLATION)
        countrySettings: {
            // Example structure:
            // 'KE': {
            //     enabled: true,
            //     intervals: { ... },
            //     policies: { ... },
            //     restrictions: { ... }
            // }
        },
        
        // Subscription-Based Sync Limits
        subscriptionLimits: {
            // Limits by subscription tier
            tiers: {
                basic: {
                    maxSyncOperations: 100,
                    maxSyncSize: 10485760,      // 10 MB
                    syncInterval: 3600000,      // 1 hour
                    backgroundSync: false,
                    conflictResolution: 'client_wins'
                },
                premium: {
                    maxSyncOperations: 1000,
                    maxSyncSize: 52428800,      // 50 MB
                    syncInterval: 300000,       // 5 minutes
                    backgroundSync: true,
                    conflictResolution: 'server_wins'
                },
                super: {
                    maxSyncOperations: 10000,
                    maxSyncSize: 104857600,     // 100 MB
                    syncInterval: 60000,        // 1 minute
                    backgroundSync: true,
                    conflictResolution: 'merge'
                },
                lenderOfLenders: {
                    maxSyncOperations: 100000,
                    maxSyncSize: 524288000,     // 500 MB
                    syncInterval: 30000,        // 30 seconds
                    backgroundSync: true,
                    conflictResolution: 'custom'
                }
            },
            
            // Current subscription limits (set based on user)
            current: null
        },
        
        // Role-Based Sync Permissions
        rolePermissions: {
            // Permissions by role
            roles: {
                admin: {
                    canSyncAll: true,
                    canForceSync: true,
                    canResolveConflicts: true,
                    canManageQueue: true,
                    canConfigureSync: true,
                    syncScope: 'global'
                },
                lender: {
                    canSyncAll: false,
                    canForceSync: true,
                    canResolveConflicts: true,
                    canManageQueue: false,
                    canConfigureSync: false,
                    syncScope: 'group'  // Can only sync within their groups
                },
                borrower: {
                    canSyncAll: false,
                    canForceSync: false,
                    canResolveConflicts: false,
                    canManageQueue: false,
                    canConfigureSync: false,
                    syncScope: 'personal'  // Can only sync their own data
                },
                guest: {
                    canSyncAll: false,
                    canForceSync: false,
                    canResolveConflicts: false,
                    canManageQueue: false,
                    canConfigureSync: false,
                    syncScope: 'none'
                }
            },
            
            // Current role permissions (set based on user)
            current: null
        },
        
        // Sync History and Audit
        history: {
            // Sync sessions
            sessions: [],
            
            // Sync operations
            operations: [],
            
            // Performance metrics
            metrics: {
                syncTimes: [],
                dataSizes: [],
                errorRates: [],
                conflictRates: []
            },
            
            // Retention settings
            retention: {
                sessions: 30,      // Keep 30 days of sessions
                operations: 1000,  // Keep 1000 operations
                metrics: 90        // Keep 90 days of metrics
            }
        },
        
        // Delta Compression State
        delta: {
            // Last known server state
            serverState: {},
            
            // Last synced client state
            clientState: {},
            
            // Delta tracking
            changes: {},
            
            // Compression settings
            compression: {
                enabled: true,
                algorithm: 'json-diff',
                minSize: 1024      // Only compress if > 1KB
            }
        },
        
        // Background Sync Registration
        backgroundSync: {
            registered: false,
            tags: [],
            lastSync: null,
            
            // Background sync capabilities
            capabilities: {
                periodicSync: false,
                oneShotSync: false,
                syncEvent: false
            }
        },
        
        // Error State
        errors: {
            // Current errors
            current: [],
            
            // Error history
            history: [],
            
            // Error handling
            handling: {
                autoRetry: true,
                maxRetries: 3,
                retryDelay: 5000,
                notifyUser: true,
                logToServer: true
            }
        },
        
        // UI State for Sync
        ui: {
            // Sync progress indicators
            progress: {
                visible: false,
                indeterminate: false,
                value: 0,
                message: '',
                component: null,
                estimatedTime: null
            },
            
            // Sync notifications
            notifications: {
                enabled: true,
                showSuccess: true,
                showError: true,
                showConflict: true,
                showCompletion: true
            },
            
            // Sync controls
            controls: {
                syncNowVisible: true,
                pauseResumeVisible: true,
                viewQueueVisible: true,
                resolveConflictsVisible: true
            }
        },
        
        // Feature Flags
        features: {
            // Sync features
            enabled: {
                offlineSync: true,
                backgroundSync: true,
                conflictResolution: true,
                deltaSync: true,
                compression: true,
                encryption: true,
                batchProcessing: true
            },
            
            // Browser support
            supported: {
                serviceWorker: false,
                backgroundSync: false,
                indexedDB: false,
                compressionStreams: false
            }
        },
        
        // Security and Privacy
        security: {
            // Encryption
            encryption: {
                enabled: true,
                algorithm: 'AES-GCM',
                keyStorage: 'localStorage'
            },
            
            // Data privacy
            privacy: {
                syncPersonalData: true,
                syncFinancialData: true,
                syncLocationData: false,
                anonymizeData: false,
                dataRetention: 90  // Days
            },
            
            // Access control
            access: {
                requireAuth: true,
                sessionBased: true,
                ipRestrictions: false,
                deviceLimits: 5
            }
        },
        
        // Device and Session Info
        device: {
            // Device identification
            id: null,
            type: 'unknown',
            platform: 'unknown',
            
            // Session info
            sessionId: null,
            lastActivity: null,
            
            // Multiple device sync
            multiDevice: {
                enabled: true,
                maxDevices: 5,
                deviceList: [],
                conflictStrategy: 'latest_device'
            }
        }
    },
    
    // Country Configuration (12 African Countries)
    COUNTRIES: [
        { code: 'KE', name: 'Kenya', currency: 'KSh' },
        { code: 'UG', name: 'Uganda', currency: 'UGX' },
        { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
        { code: 'RW', name: 'Rwanda', currency: 'RWF' },
        { code: 'CD', name: 'DRC', currency: 'CDF' },
        { code: 'BI', name: 'Burundi', currency: 'BIF' },
        { code: 'NG', name: 'Nigeria', currency: 'NGN' },
        { code: 'GH', name: 'Ghana', currency: 'GHS' },
        { code: 'SS', name: 'South Sudan', currency: 'SSP' },
        { code: 'SO', name: 'Somalia', currency: 'SOS' },
        { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
        { code: 'ET', name: 'Ethiopia', currency: 'ETB' }
    ],
    
    // Sync Operation Types
    OPERATION_TYPES: {
        // Auth operations
        LOGIN: 'login',
        LOGOUT: 'logout',
        REGISTER: 'register',
        VERIFY: 'verify',
        
        // User operations
        UPDATE_PROFILE: 'update_profile',
        UPDATE_SETTINGS: 'update_settings',
        UPDATE_PREFERENCES: 'update_preferences',
        
        // Country operations
        SELECT_COUNTRY: 'select_country',
        UPDATE_COUNTRY_SETTINGS: 'update_country_settings',
        
        // Group operations
        CREATE_GROUP: 'create_group',
        JOIN_GROUP: 'join_group',
        LEAVE_GROUP: 'leave_group',
        UPDATE_GROUP: 'update_group',
        INVITE_MEMBER: 'invite_member',
        REMOVE_MEMBER: 'remove_member',
        
        // Lender operations
        LENDER_REGISTER: 'lender_register',
        LENDER_UPDATE: 'lender_update',
        SUBSCRIBE: 'subscribe',
        RENEW_SUBSCRIPTION: 'renew_subscription',
        UPGRADE_SUBSCRIPTION: 'upgrade_subscription',
        
        // Borrower operations
        BORROWER_REGISTER: 'borrower_register',
        BORROWER_UPDATE: 'borrower_update',
        APPLY_LOAN: 'apply_loan',
        WITHDRAW_APPLICATION: 'withdraw_application',
        
        // Ledger operations
        CREATE_LEDGER: 'create_ledger',
        UPDATE_LEDGER: 'update_ledger',
        DELETE_LEDGER: 'delete_ledger',
        UPDATE_REPAYMENT: 'update_repayment',
        ADD_PENALTY: 'add_penalty',
        MARK_CLEARED: 'mark_cleared',
        
        // Blacklist operations
        ADD_BLACKLIST: 'add_blacklist',
        REMOVE_BLACKLIST: 'remove_blacklist',
        APPEAL_BLACKLIST: 'appeal_blacklist',
        
        // Notification operations
        CREATE_NOTIFICATION: 'create_notification',
        MARK_READ: 'mark_read',
        DELETE_NOTIFICATION: 'delete_notification'
    },
    
    // Sync Priorities
    PRIORITIES: {
        CRITICAL: 'critical',  // Auth, payments, critical data
        HIGH: 'high',          // Ledgers, repayments, blacklist
        NORMAL: 'normal',      // Groups, users, notifications
        LOW: 'low'             // Settings, preferences, logs
    },
    
    // Conflict Resolution Strategies
    RESOLUTION_STRATEGIES: {
        SERVER_WINS: 'server_wins',
        CLIENT_WINS: 'client_wins',
        MERGE: 'merge',
        ADMIN_WINS: 'admin_wins',
        MANUAL: 'manual_resolution',
        LATEST_TIMESTAMP: 'latest_timestamp',
        CUSTOM: 'custom'
    },
    
    // Entity Types for Hierarchy
    ENTITY_TYPES: {
        GLOBAL: 'global',
        COUNTRY: 'country',
        GROUP: 'group',
        LENDER: 'lender',
        BORROWER: 'borrower',
        LEDGER: 'ledger',
        USER: 'user',
        SUBSCRIPTION: 'subscription',
        BLACKLIST: 'blacklist'
    },
    
    // Error Types
    ERROR_TYPES: {
        NETWORK_ERROR: 'network_error',
        AUTH_ERROR: 'auth_error',
        VALIDATION_ERROR: 'validation_error',
        CONFLICT_ERROR: 'conflict_error',
        QUOTA_ERROR: 'quota_error',
        TIMEOUT_ERROR: 'timeout_error',
        UNKNOWN_ERROR: 'unknown_error'
    }
};

/**
 * Create a new sync slice with all required functionality
 */
const createSyncSlice = () => {
    let state = JSON.parse(JSON.stringify(SYNC_CONFIG.initialState));
    
    // Initialize from localStorage
    const initialize = () => {
        try {
            const saved = localStorage.getItem('mpesewa_sync_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
            }
            
            // Initialize country settings if not present
            SYNC_CONFIG.COUNTRIES.forEach(country => {
                if (!state.countrySettings[country.code]) {
                    state.countrySettings[country.code] = {
                        enabled: true,
                        intervals: { ...state.config.intervals },
                        policies: { ...state.config.policies },
                        restrictions: {
                            maxSyncSize: 10485760, // 10 MB per country
                            allowedOperations: Object.values(SYNC_CONFIG.OPERATION_TYPES)
                        }
                    };
                }
                
                // Initialize country queues
                if (!state.queue.countries[country.code]) {
                    state.queue.countries[country.code] = {
                        priorities: {
                            critical: [],
                            high: [],
                            normal: [],
                            low: []
                        },
                        metadata: {
                            totalItems: 0,
                            oldestItem: null,
                            newestItem: null
                        }
                    };
                }
            });
            
            // Initialize offline changes structure
            if (!state.offlineChanges.changes) {
                state.offlineChanges.changes = {};
            }
            
            // Initialize statistics by country
            SYNC_CONFIG.COUNTRIES.forEach(country => {
                if (!state.offlineChanges.statistics.byCountry[country.code]) {
                    state.offlineChanges.statistics.byCountry[country.code] = {
                        total: 0,
                        pending: 0,
                        synced: 0,
                        failed: 0
                    };
                }
            });
            
            // Detect browser capabilities
            detectCapabilities();
            
            // Set up network monitoring
            setupNetworkMonitoring();
            
            // Initialize device ID
            initializeDevice();
            
            // Initialize background sync if supported
            if (state.features.supported.backgroundSync) {
                initializeBackgroundSync();
            }
            
            // Start heartbeat for periodic sync
            startHeartbeat();
            
            // Clean up old history
            cleanupHistory();
            
            saveState();
            return true;
        } catch (error) {
            console.error('Failed to initialize sync state:', error);
            addError(SYNC_CONFIG.ERROR_TYPES.UNKNOWN_ERROR, error);
            return false;
        }
    };
    
    // Save state to localStorage
    const saveState = () => {
        try {
            localStorage.setItem('mpesewa_sync_state', JSON.stringify(state));
            
            // Dispatch state change event
            dispatchEvent('stateChanged', { state: getState() });
        } catch (error) {
            console.error('Failed to save sync state:', error);
        }
    };
    
    // Detect browser capabilities
    const detectCapabilities = () => {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
        
        // Service Worker support
        state.features.supported.serviceWorker = 'serviceWorker' in navigator;
        
        // Background Sync support
        state.features.supported.backgroundSync = 'serviceWorker' in navigator && 
                                                 'sync' in (navigator.serviceWorker || {});
        
        // IndexedDB support
        state.features.supported.indexedDB = 'indexedDB' in window;
        
        // Compression Streams support
        state.features.supported.compressionStreams = 'CompressionStream' in window;
        
        // Connection API
        if (navigator.connection) {
            updateNetworkInfo();
        }
        
        logEvent('capabilities_detected', {
            capabilities: state.features.supported,
            timestamp: new Date().toISOString()
        });
        
        saveState();
    };
    
    // Set up network monitoring
    const setupNetworkMonitoring = () => {
        if (typeof window === 'undefined') return;
        
        // Network status events
        window.addEventListener('online', handleNetworkOnline);
        window.addEventListener('offline', handleNetworkOffline);
        
        // Connection API if available
        if (navigator.connection) {
            navigator.connection.addEventListener('change', handleConnectionChange);
        }
        
        // Page visibility
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Before unload (sync before leaving)
        window.addEventListener('beforeunload', handleBeforeUnload);
    };
    
    // Handle network online
    const handleNetworkOnline = () => {
        state.status.network.online = true;
        state.status.overall = state.status.overall === 'offline' ? 'idle' : state.status.overall;
        
        logEvent('network_online', {
            timestamp: new Date().toISOString(),
            previousState: 'offline'
        });
        
        // Trigger sync if configured
        if (state.config.policies.triggers.onNetworkChange) {
            triggerSync('network_restored');
        }
        
        saveState();
    };
    
    // Handle network offline
    const handleNetworkOffline = () => {
        state.status.network.online = false;
        state.status.overall = 'offline';
        
        logEvent('network_offline', {
            timestamp: new Date().toISOString(),
            pendingChanges: state.offlineChanges.statistics.pending
        });
        
        saveState();
    };
    
    // Handle connection change
    const handleConnectionChange = () => {
        if (!navigator.connection) return;
        
        updateNetworkInfo();
        
        // Adjust sync strategy based on connection
        adjustSyncStrategy();
        
        logEvent('connection_changed', {
            connectionType: state.status.network.connectionType,
            effectiveType: state.status.network.effectiveType,
            downlink: state.status.network.downlink,
            rtt: state.status.network.rtt,
            saveData: state.status.network.saveData
        });
        
        saveState();
    };
    
    // Update network information
    const updateNetworkInfo = () => {
        if (!navigator.connection) return;
        
        const connection = navigator.connection;
        state.status.network = {
            online: navigator.onLine,
            connectionType: connection.type || 'unknown',
            effectiveType: connection.effectiveType || 'unknown',
            downlink: connection.downlink || 0,
            rtt: connection.rtt || 0,
            saveData: connection.saveData || false
        };
    };
    
    // Adjust sync strategy based on network
    const adjustSyncStrategy = () => {
        const network = state.status.network;
        
        // Adjust batch size based on connection
        if (network.effectiveType === 'slow-2g' || network.effectiveType === '2g') {
            state.config.thresholds.batchSize = 10;
            state.config.performance.concurrency = 1;
            state.config.intervals.partialSync = 600000; // 10 minutes on slow connections
        } else if (network.effectiveType === '3g') {
            state.config.thresholds.batchSize = 25;
            state.config.performance.concurrency = 2;
            state.config.intervals.partialSync = 300000; // 5 minutes
        } else {
            state.config.thresholds.batchSize = 50;
            state.config.performance.concurrency = 3;
            state.config.intervals.partialSync = 60000; // 1 minute on fast connections
        }
        
        // Enable/disable compression based on save data
        if (network.saveData) {
            state.config.performance.compression = true;
            state.config.performance.prefetch = false;
        }
        
        logEvent('sync_strategy_adjusted', {
            batchSize: state.config.thresholds.batchSize,
            concurrency: state.config.performance.concurrency,
            partialSyncInterval: state.config.intervals.partialSync,
            reason: 'network_change'
        });
    };
    
    // Handle visibility change
    const handleVisibilityChange = () => {
        const isVisible = document.visibilityState === 'visible';
        
        if (isVisible && state.config.policies.triggers.onVisibilityChange) {
            // App came to foreground
            logEvent('app_foreground', { timestamp: new Date().toISOString() });
            
            // Update last activity
            state.device.lastActivity = new Date().toISOString();
            
            // Trigger sync if configured
            if (state.config.policies.triggers.onAppForeground) {
                triggerSync('app_foreground');
            }
        } else if (!isVisible) {
            // App went to background
            logEvent('app_background', { 
                timestamp: new Date().toISOString(),
                pendingChanges: state.offlineChanges.statistics.pending
            });
            
            // Try to sync before going to background
            if (state.config.policies.methods.backgroundSync) {
                triggerBackgroundSync('app_background');
            }
        }
        
        saveState();
    };
    
    // Handle before unload
    const handleBeforeUnload = () => {
        // Try to sync any pending changes before page unloads
        if (state.offlineChanges.statistics.pending > 0) {
            logEvent('before_unload_sync_attempt', {
                pendingChanges: state.offlineChanges.statistics.pending,
                timestamp: new Date().toISOString()
            });
            
            // In a real implementation, this would trigger an immediate sync
            // For now, we just log the event
        }
    };
    
    // Initialize device
    const initializeDevice = () => {
        // Generate or retrieve device ID
        let deviceId = localStorage.getItem('mpesewa_device_id');
        if (!deviceId) {
            deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('mpesewa_device_id', deviceId);
        }
        
        state.device.id = deviceId;
        
        // Detect device type
        const userAgent = navigator.userAgent || '';
        let deviceType = 'desktop';
        let platform = 'unknown';
        
        if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
            deviceType = 'mobile';
        } else if (/Tablet|iPad/i.test(userAgent)) {
            deviceType = 'tablet';
        }
        
        if (/Windows/i.test(userAgent)) {
            platform = 'windows';
        } else if (/Mac/i.test(userAgent)) {
            platform = 'mac';
        } else if (/Linux/i.test(userAgent)) {
            platform = 'linux';
        } else if (/Android/i.test(userAgent)) {
            platform = 'android';
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            platform = 'ios';
        }
        
        state.device.type = deviceType;
        state.device.platform = platform;
        
        // Generate session ID
        state.device.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        state.device.lastActivity = new Date().toISOString();
        
        logEvent('device_initialized', {
            deviceId: state.device.id,
            deviceType: state.device.type,
            platform: state.device.platform,
            sessionId: state.device.sessionId
        });
        
        saveState();
    };
    
    // Initialize background sync
    const initializeBackgroundSync = () => {
        if (!state.features.supported.serviceWorker || !navigator.serviceWorker.ready) {
            logEvent('background_sync_initialization_skipped', {
                reason: 'service_worker_not_ready'
            });
            return;
        }
        
        navigator.serviceWorker.ready
            .then(registration => {
                if ('sync' in registration) {
                    state.backgroundSync.capabilities.oneShotSync = true;
                    
                    // Register sync tags
                    const tags = ['sync-critical', 'sync-high', 'sync-normal', 'sync-low'];
                    tags.forEach(tag => {
                        registration.sync.register(tag)
                            .then(() => {
                                state.backgroundSync.tags.push(tag);
                                logEvent('sync_tag_registered', { tag });
                            })
                            .catch(error => {
                                logEvent('sync_tag_registration_failed', { 
                                    tag, 
                                    error: error.message 
                                });
                            });
                    });
                    
                    state.backgroundSync.registered = true;
                    logEvent('background_sync_initialized', { tags: state.backgroundSync.tags });
                }
                
                if ('periodicSync' in registration) {
                    state.backgroundSync.capabilities.periodicSync = true;
                    logEvent('periodic_sync_supported');
                }
            })
            .catch(error => {
                logEvent('background_sync_initialization_failed', { error: error.message });
            });
        
        saveState();
    };
    
    // Start heartbeat for periodic sync
    const startHeartbeat = () => {
        // Set up interval for heartbeat
        setInterval(() => {
            heartbeat();
        }, state.config.intervals.heartbeat);
        
        // Set up interval for periodic sync
        if (state.config.policies.triggers.periodic) {
            setInterval(() => {
                if (state.status.network.online) {
                    triggerSync('periodic');
                }
            }, state.config.intervals.partialSync);
        }
        
        logEvent('heartbeat_started', {
            heartbeatInterval: state.config.intervals.heartbeat,
            syncInterval: state.config.intervals.partialSync
        });
    };
    
    // Heartbeat function
    const heartbeat = () => {
        // Update last activity
        state.device.lastActivity = new Date().toISOString();
        
        // Check for scheduled sync
        if (state.status.nextSync && new Date(state.status.nextSync) <= new Date()) {
            triggerSync('scheduled');
            state.status.nextSync = null;
        }
        
        // Update UI progress if syncing
        if (state.status.overall === 'syncing' && state.ui.progress.visible) {
            updateProgress();
        }
        
        // Save state periodically
        if (Math.random() < 0.1) { // 10% chance to save on each heartbeat
            saveState();
        }
    };
    
    // Clean up old history
    const cleanupHistory = () => {
        const now = new Date();
        const retentionDays = state.history.retention.sessions * 24 * 60 * 60 * 1000;
        
        // Clean old sessions
        state.history.sessions = state.history.sessions.filter(session => {
            const sessionTime = new Date(session.timestamp);
            return (now - sessionTime) < retentionDays;
        });
        
        // Clean old operations (keep only last N)
        if (state.history.operations.length > state.history.retention.operations) {
            state.history.operations = state.history.operations.slice(
                -state.history.retention.operations
            );
        }
        
        // Clean old metrics
        const metricsRetention = state.history.retention.metrics * 24 * 60 * 60 * 1000;
        Object.keys(state.history.metrics).forEach(metricType => {
            state.history.metrics[metricType] = state.history.metrics[metricType].filter(metric => {
                const metricTime = new Date(metric.timestamp);
                return (now - metricTime) < metricsRetention;
            });
        });
        
        logEvent('history_cleaned', {
            sessions: state.history.sessions.length,
            operations: state.history.operations.length,
            timestamp: new Date().toISOString()
        });
    };
    
    // QUEUE MANAGEMENT
    
    // Add operation to queue (STRICT HIERARCHY ENFORCEMENT)
    const addToQueue = (operation, options = {}) => {
        const {
            priority = SYNC_CONFIG.PRIORITIES.NORMAL,
            component = 'unknown',
            countryCode = null,
            immediate = false,
            metadata = {}
        } = options;
        
        // Validate operation
        if (!operation.type || !operation.data) {
            throw new Error('Operation must have type and data');
        }
        
        // Enforce country isolation
        if (countryCode && !SYNC_CONFIG.COUNTRIES.find(c => c.code === countryCode)) {
            throw new Error(`Country ${countryCode} not supported`);
        }
        
        // Check subscription limits
        if (state.subscriptionLimits.current) {
            const limits = state.subscriptionLimits.current;
            if (state.queue.metadata.totalItems >= limits.maxSyncOperations) {
                throw new Error('Sync operation limit reached for subscription tier');
            }
        }
        
        // Create queue item
        const queueItem = {
            id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            operation,
            priority,
            component,
            countryCode,
            metadata: {
                ...metadata,
                timestamp: new Date().toISOString(),
                deviceId: state.device.id,
                sessionId: state.device.sessionId,
                attempts: 0,
                lastAttempt: null,
                status: 'pending'
            }
        };
        
        // Add to appropriate queues
        state.queue.priorities[priority].push(queueItem);
        state.queue.components[component] = state.queue.components[component] || [];
        state.queue.components[component].push(queueItem);
        
        if (countryCode) {
            state.queue.countries[countryCode].priorities[priority].push(queueItem);
            state.queue.countries[countryCode].metadata.totalItems++;
            
            // Update country statistics
            if (!state.offlineChanges.statistics.byCountry[countryCode]) {
                state.offlineChanges.statistics.byCountry[countryCode] = {
                    total: 0,
                    pending: 0,
                    synced: 0,
                    failed: 0
                };
            }
            state.offlineChanges.statistics.byCountry[countryCode].total++;
            state.offlineChanges.statistics.byCountry[countryCode].pending++;
        }
        
        // Update queue metadata
        state.queue.metadata.totalItems++;
        if (!state.queue.metadata.oldestItem) {
            state.queue.metadata.oldestItem = queueItem.metadata.timestamp;
        }
        state.queue.metadata.newestItem = queueItem.metadata.timestamp;
        state.queue.metadata.estimatedTime = calculateEstimatedTime();
        
        // Update offline changes statistics
        state.offlineChanges.statistics.totalChanges++;
        state.offlineChanges.statistics.pending++;
        
        // Update by entity type
        const entityType = operation.entityType || 'unknown';
        state.offlineChanges.statistics.byEntity[entityType] = 
            (state.offlineChanges.statistics.byEntity[entityType] || 0) + 1;
        
        // Update by operation type
        state.offlineChanges.statistics.byOperation[operation.type] = 
            (state.offlineChanges.statistics.byOperation[operation.type] || 0) + 1;
        
        // Add to offline changes tracking if enabled
        if (state.offlineChanges.tracking.enabled && state.offlineChanges.tracking.autoQueue) {
            const changeKey = generateChangeKey(operation, countryCode);
            state.offlineChanges.changes[changeKey] = {
                id: queueItem.id,
                type: operation.type,
                data: operation.data,
                timestamp: queueItem.metadata.timestamp,
                synced: false,
                attempts: 0,
                lastAttempt: null,
                error: null
            };
        }
        
        logEvent('queue_item_added', {
            id: queueItem.id,
            type: operation.type,
            priority,
            component,
            countryCode,
            queueSize: state.queue.metadata.totalItems
        });
        
        // Trigger immediate sync if requested and online
        if (immediate && state.status.network.online) {
            triggerSync('immediate');
        }
        
        // Start processing if not already processing
        if (!state.queue.metadata.processing && state.status.network.online) {
            processQueue();
        }
        
        saveState();
        return queueItem.id;
    };
    
    // Generate change key for offline tracking
    const generateChangeKey = (operation, countryCode) => {
        // Generate a unique key based on operation and hierarchy
        const parts = [];
        
        if (countryCode) parts.push(`country:${countryCode}`);
        if (operation.data.groupId) parts.push(`group:${operation.data.groupId}`);
        if (operation.data.lenderId) parts.push(`lender:${operation.data.lenderId}`);
        if (operation.data.borrowerId) parts.push(`borrower:${operation.data.borrowerId}`);
        if (operation.data.ledgerId) parts.push(`ledger:${operation.data.ledgerId}`);
        
        parts.push(`type:${operation.type}`);
        parts.push(`timestamp:${Date.now()}`);
        
        return parts.join(':');
    };
    
    // Calculate estimated processing time
    const calculateEstimatedTime = () => {
        const itemsPerSecond = 10; // Estimate 10 items per second
        return Math.ceil(state.queue.metadata.totalItems / itemsPerSecond);
    };
    
    // Process queue
    const processQueue = async () => {
        if (state.queue.metadata.processing || state.queue.metadata.totalItems === 0) {
            return;
        }
        
        state.queue.metadata.processing = true;
        state.status.overall = 'syncing';
        
        logEvent('queue_processing_started', {
            totalItems: state.queue.metadata.totalItems,
            timestamp: new Date().toISOString()
        });
        
        // Update UI
        updateProgressUI(true, 0, 'Starting sync...');
        
        try {
            // Process by priority
            const priorities = [
                SYNC_CONFIG.PRIORITIES.CRITICAL,
                SYNC_CONFIG.PRIORITIES.HIGH,
                SYNC_CONFIG.PRIORITIES.NORMAL,
                SYNC_CONFIG.PRIORITIES.LOW
            ];
            
            for (const priority of priorities) {
                await processPriorityQueue(priority);
            }
            
            // Mark sync as successful
            state.status.overall = 'idle';
            state.status.lastSync.full = new Date().toISOString();
            state.status.statistics.totalSyncs++;
            state.status.statistics.successful++;
            
            // Record sync session
            recordSyncSession('full', true);
            
            logEvent('queue_processing_completed', {
                duration: new Date() - new Date(state.queue.metadata.processingStart),
                itemsProcessed: state.queue.metadata.totalItems
            });
            
        } catch (error) {
            state.status.overall = 'error';
            state.status.statistics.failed++;
            
            addError(SYNC_CONFIG.ERROR_TYPES.UNKNOWN_ERROR, error);
            
            logEvent('queue_processing_failed', {
                error: error.message,
                itemsRemaining: state.queue.metadata.totalItems
            });
        } finally {
            state.queue.metadata.processing = false;
            updateProgressUI(false, 100, 'Sync completed');
            saveState();
        }
    };
    
    // Process priority queue
    const processPriorityQueue = async (priority) => {
        const items = state.queue.priorities[priority];
        if (items.length === 0) return;
        
        logEvent('priority_queue_processing_started', {
            priority,
            itemCount: items.length
        });
        
        // Process items in batches
        const batchSize = state.config.thresholds.batchSize;
        const concurrency = state.config.performance.concurrency;
        
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            
            // Update progress
            const progress = ((i / items.length) * 100).toFixed(2);
            updateProgressUI(true, progress, `Syncing ${priority} priority items...`);
            
            // Process batch with concurrency
            await processBatch(batch, concurrency, priority);
            
            // Remove processed items from queue
            removeProcessedItems(batch.map(item => item.id));
        }
        
        logEvent('priority_queue_processing_completed', {
            priority,
            itemsProcessed: items.length
        });
    };
    
    // Process batch with concurrency
    const processBatch = async (batch, concurrency, priority) => {
        const results = [];
        const errors = [];
        
        // Create chunks for concurrent processing
        for (let i = 0; i < batch.length; i += concurrency) {
            const chunk = batch.slice(i, i + concurrency);
            const chunkPromises = chunk.map(item => processQueueItem(item));
            
            try {
                const chunkResults = await Promise.allSettled(chunkPromises);
                results.push(...chunkResults);
            } catch (error) {
                errors.push(error);
            }
            
            // Small delay between chunks to prevent overwhelming
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Handle results
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        logEvent('batch_processed', {
            priority,
            batchSize: batch.length,
            successful,
            failed,
            errors: errors.length
        });
        
        // If all failed, throw error
        if (failed === batch.length && batch.length > 0) {
            throw new Error(`All items in ${priority} batch failed to process`);
        }
    };
    
    // Process individual queue item
    const processQueueItem = async (queueItem) => {
        const startTime = Date.now();
        
        try {
            // Update item metadata
            queueItem.metadata.attempts++;
            queueItem.metadata.lastAttempt = new Date().toISOString();
            queueItem.metadata.status = 'processing';
            
            // Check network
            if (!state.status.network.online) {
                throw new Error('Network offline');
            }
            
            // Check timeout
            if (Date.now() - new Date(queueItem.metadata.timestamp) > 
                state.config.thresholds.timeout) {
                throw new Error('Operation timeout');
            }
            
            // Process based on operation type
            const result = await executeSyncOperation(queueItem.operation);
            
            // Update item metadata
            queueItem.metadata.status = 'completed';
            queueItem.metadata.completedAt = new Date().toISOString();
            queueItem.metadata.duration = Date.now() - startTime;
            
            // Update statistics
            state.status.statistics.syncedBytes += result.size || 0;
            
            // Update offline changes
            const changeKey = generateChangeKey(queueItem.operation, queueItem.countryCode);
            if (state.offlineChanges.changes[changeKey]) {
                state.offlineChanges.changes[changeKey].synced = true;
                state.offlineChanges.changes[changeKey].syncedAt = new Date().toISOString();
                
                // Update statistics
                state.offlineChanges.statistics.pending--;
                state.offlineChanges.statistics.synced++;
                
                if (queueItem.countryCode) {
                    state.offlineChanges.statistics.byCountry[queueItem.countryCode].pending--;
                    state.offlineChanges.statistics.byCountry[queueItem.countryCode].synced++;
                }
            }
            
            logEvent('queue_item_processed', {
                id: queueItem.id,
                type: queueItem.operation.type,
                duration: queueItem.metadata.duration,
                success: true
            });
            
            return result;
            
        } catch (error) {
            // Update item metadata
            queueItem.metadata.status = 'failed';
            queueItem.metadata.error = error.message;
            queueItem.metadata.lastErrorAt = new Date().toISOString();
            
            // Check if should retry
            if (queueItem.metadata.attempts < state.config.thresholds.maxRetries) {
                queueItem.metadata.status = 'pending';
                
                // Schedule retry with exponential backoff
                const retryDelay = state.config.intervals.retryInterval * 
                                 Math.pow(2, queueItem.metadata.attempts - 1);
                queueItem.metadata.retryAt = new Date(Date.now() + retryDelay).toISOString();
                
                logEvent('queue_item_retry_scheduled', {
                    id: queueItem.id,
                    attempts: queueItem.metadata.attempts,
                    retryDelay,
                    retryAt: queueItem.metadata.retryAt
                });
            } else {
                // Max retries reached, mark as permanently failed
                queueItem.metadata.status = 'permanently_failed';
                
                // Update offline changes
                const changeKey = generateChangeKey(queueItem.operation, queueItem.countryCode);
                if (state.offlineChanges.changes[changeKey]) {
                    state.offlineChanges.changes[changeKey].error = error.message;
                    
                    // Update statistics
                    state.offlineChanges.statistics.pending--;
                    state.offlineChanges.statistics.failed++;
                    
                    if (queueItem.countryCode) {
                        state.offlineChanges.statistics.byCountry[queueItem.countryCode].pending--;
                        state.offlineChanges.statistics.byCountry[queueItem.countryCode].failed++;
                    }
                }
                
                addError(SYNC_CONFIG.ERROR_TYPES.SYNC_ERROR, error);
            }
            
            logEvent('queue_item_failed', {
                id: queueItem.id,
                type: queueItem.operation.type,
                error: error.message,
                attempts: queueItem.metadata.attempts
            });
            
            throw error;
        }
    };
    
    // Execute sync operation (simulated - in real app would call API)
    const executeSyncOperation = async (operation) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));
        
        // Simulate occasional failures for testing
        if (Math.random() < 0.1) { // 10% failure rate for simulation
            throw new Error('Simulated sync failure');
        }
        
        // Simulate conflict detection
        if (Math.random() < 0.05) { // 5% conflict rate
            const conflict = createConflict(operation);
            state.conflicts.active.push(conflict);
            state.status.statistics.conflicts++;
            
            throw new Error(`Conflict detected: ${conflict.id}`);
        }
        
        // Return simulated result
        return {
            success: true,
            timestamp: new Date().toISOString(),
            size: JSON.stringify(operation).length,
            operationId: operation.id || 'unknown'
        };
    };
    
    // Create conflict
    const createConflict = (operation) => {
        const conflictId = `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Determine resolution strategy based on hierarchy
        let resolutionStrategy = state.conflicts.strategies.defaults[operation.entityType] || 
                               SYNC_CONFIG.RESOLUTION_STRATEGIES.SERVER_WINS;
        
        // Apply hierarchy rules
        const hierarchyLevel = getHierarchyLevel(operation);
        const hierarchyPriority = state.conflicts.rules.hierarchy[hierarchyLevel] || 50;
        
        return {
            id: conflictId,
            operation,
            entityType: operation.entityType || 'unknown',
            hierarchyLevel,
            hierarchyPriority,
            clientData: operation.data,
            serverData: generateServerData(operation), // Simulated server data
            timestamp: new Date().toISOString(),
            detectedAt: new Date().toISOString(),
            resolutionStrategy,
            status: 'pending',
            resolvedBy: null,
            resolvedAt: null,
            resolution: null
        };
    };
    
    // Get hierarchy level from operation
    const getHierarchyLevel = (operation) => {
        if (operation.data.ledgerId) return SYNC_CONFIG.ENTITY_TYPES.LEDGER;
        if (operation.data.borrowerId) return SYNC_CONFIG.ENTITY_TYPES.BORROWER;
        if (operation.data.lenderId) return SYNC_CONFIG.ENTITY_TYPES.LENDER;
        if (operation.data.groupId) return SYNC_CONFIG.ENTITY_TYPES.GROUP;
        if (operation.data.countryCode) return SYNC_CONFIG.ENTITY_TYPES.COUNTRY;
        return SYNC_CONFIG.ENTITY_TYPES.GLOBAL;
    };
    
    // Generate simulated server data
    const generateServerData = (operation) => {
        // Create slightly different data to simulate conflict
        const serverData = { ...operation.data };
        
        // Modify some fields
        if (serverData.amount) {
            serverData.amount = serverData.amount * (0.9 + Math.random() * 0.2);
        }
        
        if (serverData.timestamp) {
            // Make server timestamp slightly different
            const clientTime = new Date(serverData.timestamp);
            const offset = (Math.random() - 0.5) * 60000; // +/- 30 seconds
            serverData.timestamp = new Date(clientTime.getTime() + offset).toISOString();
        }
        
        return serverData;
    };
    
    // Remove processed items from queue
    const removeProcessedItems = (itemIds) => {
        // Remove from all queue structures
        itemIds.forEach(itemId => {
            // Find item in all priorities
            Object.keys(state.queue.priorities).forEach(priority => {
                const index = state.queue.priorities[priority].findIndex(item => item.id === itemId);
                if (index !== -1) {
                    state.queue.priorities[priority].splice(index, 1);
                }
            });
            
            // Remove from components
            Object.keys(state.queue.components).forEach(component => {
                const items = state.queue.components[component];
                if (Array.isArray(items)) {
                    const index = items.findIndex(item => item.id === itemId);
                    if (index !== -1) {
                        items.splice(index, 1);
                    }
                }
            });
            
            // Remove from countries
            Object.keys(state.queue.countries).forEach(countryCode => {
                Object.keys(state.queue.countries[countryCode].priorities).forEach(priority => {
                    const items = state.queue.countries[countryCode].priorities[priority];
                    const index = items.findIndex(item => item.id === itemId);
                    if (index !== -1) {
                        items.splice(index, 1);
                        state.queue.countries[countryCode].metadata.totalItems--;
                    }
                });
            });
            
            // Update total items count
            state.queue.metadata.totalItems--;
        });
        
        // Update queue metadata
        if (state.queue.metadata.totalItems === 0) {
            state.queue.metadata.oldestItem = null;
            state.queue.metadata.newestItem = null;
            state.queue.metadata.estimatedTime = 0;
        } else {
            state.queue.metadata.estimatedTime = calculateEstimatedTime();
        }
    };
    
    // CONFLICT RESOLUTION
    
    // Resolve conflict
    const resolveConflict = (conflictId, resolution, resolvedBy) => {
        const conflictIndex = state.conflicts.active.findIndex(c => c.id === conflictId);
        if (conflictIndex === -1) {
            throw new Error(`Conflict ${conflictId} not found`);
        }
        
        const conflict = state.conflicts.active[conflictIndex];
        
        // Apply resolution
        conflict.status = 'resolved';
        conflict.resolvedBy = resolvedBy;
        conflict.resolvedAt = new Date().toISOString();
        conflict.resolution = resolution;
        
        // Move to history
        state.conflicts.active.splice(conflictIndex, 1);
        state.conflicts.history.push(conflict);
        
        // Update statistics
        state.status.statistics.resolved++;
        
        // Retry the original operation if needed
        if (resolution.retryOperation) {
            addToQueue(conflict.operation, {
                priority: SYNC_CONFIG.PRIORITIES.HIGH,
                immediate: true
            });
        }
        
        logEvent('conflict_resolved', {
            conflictId,
            resolution: resolution.strategy,
            resolvedBy,
            retryOperation: resolution.retryOperation
        });
        
        saveState();
        return conflict;
    };
    
    // Get conflicts by hierarchy level
    const getConflictsByHierarchy = (hierarchyLevel) => {
        return state.conflicts.active.filter(conflict => 
            conflict.hierarchyLevel === hierarchyLevel
        );
    };
    
    // Get conflicts by country
    const getConflictsByCountry = (countryCode) => {
        return state.conflicts.active.filter(conflict => 
            conflict.operation.data.countryCode === countryCode
        );
    };
    
    // SYNC TRIGGERS AND CONTROLS
    
    // Trigger sync
    const triggerSync = (reason = 'manual') => {
        if (!state.status.network.online) {
            logEvent('sync_trigger_skipped', { reason, status: 'offline' });
            return false;
        }
        
        if (state.status.overall === 'syncing') {
            logEvent('sync_trigger_skipped', { reason, status: 'already_syncing' });
            return false;
        }
        
        // Check role permissions
        if (state.rolePermissions.current && !state.rolePermissions.current.canForceSync) {
            logEvent('sync_trigger_denied', { reason, status: 'insufficient_permissions' });
            return false;
        }
        
        logEvent('sync_triggered', {
            reason,
            timestamp: new Date().toISOString(),
            pendingChanges: state.offlineChanges.statistics.pending
        });
        
        // Start processing queue
        processQueue();
        return true;
    };
    
    // Trigger background sync
    const triggerBackgroundSync = (tag) => {
        if (!state.features.supported.backgroundSync) {
            return Promise.reject(new Error('Background sync not supported'));
        }
        
        return navigator.serviceWorker.ready
            .then(registration => {
                if ('sync' in registration) {
                    return registration.sync.register(tag);
                }
                throw new Error('Sync API not available');
            })
            .then(() => {
                state.backgroundSync.lastSync = new Date().toISOString();
                logEvent('background_sync_triggered', { tag });
                saveState();
                return true;
            })
            .catch(error => {
                logEvent('background_sync_failed', { tag, error: error.message });
                throw error;
            });
    };
    
    // Pause sync
    const pauseSync = () => {
        if (state.status.overall === 'syncing') {
            state.status.overall = 'paused';
            state.queue.metadata.processing = false;
            
            logEvent('sync_paused', {
                timestamp: new Date().toISOString(),
                itemsRemaining: state.queue.metadata.totalItems
            });
            
            saveState();
            return true;
        }
        return false;
    };
    
    // Resume sync
    const resumeSync = () => {
        if (state.status.overall === 'paused') {
            state.status.overall = 'idle';
            processQueue();
            
            logEvent('sync_resumed', {
                timestamp: new Date().toISOString(),
                itemsRemaining: state.queue.metadata.totalItems
            });
            
            return true;
        }
        return false;
    };
    
    // Cancel sync
    const cancelSync = () => {
        if (state.status.overall === 'syncing' || state.status.overall === 'paused') {
            const itemsRemaining = state.queue.metadata.totalItems;
            
            state.status.overall = 'idle';
            state.queue.metadata.processing = false;
            state.ui.progress.visible = false;
            
            logEvent('sync_cancelled', {
                timestamp: new Date().toISOString(),
                itemsRemaining
            });
            
            saveState();
            return itemsRemaining;
        }
        return 0;
    };
    
    // Clear queue
    const clearQueue = (priority = null, component = null, countryCode = null) => {
        let itemsCleared = 0;
        
        if (priority) {
            itemsCleared = state.queue.priorities[priority].length;
            state.queue.priorities[priority] = [];
        } else if (component) {
            itemsCleared = (state.queue.components[component] || []).length;
            state.queue.components[component] = [];
        } else if (countryCode) {
            Object.keys(state.queue.countries[countryCode].priorities).forEach(p => {
                itemsCleared += state.queue.countries[countryCode].priorities[p].length;
                state.queue.countries[countryCode].priorities[p] = [];
            });
            state.queue.countries[countryCode].metadata.totalItems = 0;
        } else {
            // Clear everything
            Object.keys(state.queue.priorities).forEach(p => {
                itemsCleared += state.queue.priorities[p].length;
                state.queue.priorities[p] = [];
            });
            
            Object.keys(state.queue.components).forEach(c => {
                state.queue.components[c] = [];
            });
            
            Object.keys(state.queue.countries).forEach(cc => {
                Object.keys(state.queue.countries[cc].priorities).forEach(p => {
                    state.queue.countries[cc].priorities[p] = [];
                });
                state.queue.countries[cc].metadata.totalItems = 0;
            });
            
            state.queue.metadata.totalItems = 0;
            state.queue.metadata.oldestItem = null;
            state.queue.metadata.newestItem = null;
            state.queue.metadata.estimatedTime = 0;
        }
        
        // Update offline changes statistics
        state.offlineChanges.statistics.pending = Math.max(
            0,
            state.offlineChanges.statistics.pending - itemsCleared
        );
        
        logEvent('queue_cleared', {
            priority,
            component,
            countryCode,
            itemsCleared,
            remainingItems: state.queue.metadata.totalItems
        });
        
        saveState();
        return itemsCleared;
    };
    
    // UI PROGRESS UPDATES
    
    // Update progress UI
    const updateProgressUI = (visible, value, message) => {
        state.ui.progress.visible = visible;
        state.ui.progress.value = value;
        state.ui.progress.message = message;
        
        if (visible) {
            state.ui.progress.indeterminate = value === 0;
            state.ui.progress.estimatedTime = state.queue.metadata.estimatedTime;
        }
        
        // Dispatch UI update event
        dispatchEvent('progressUpdate', {
            visible,
            value,
            message,
            estimatedTime: state.ui.progress.estimatedTime
        });
        
        saveState();
    };
    
    // Update progress during sync
    const updateProgress = () => {
        if (state.queue.metadata.totalItems === 0) {
            updateProgressUI(false, 100, 'Sync completed');
            return;
        }
        
        // Calculate progress based on processed items
        const totalProcessed = state.offlineChanges.statistics.synced + 
                             state.offlineChanges.statistics.failed;
        const totalChanges = state.offlineChanges.statistics.totalChanges;
        
        const progress = totalChanges > 0 ? (totalProcessed / totalChanges) * 100 : 0;
        const message = `Syncing ${state.queue.metadata.totalItems} items...`;
        
        updateProgressUI(true, progress, message);
    };
    
    // ERROR HANDLING
    
    // Add error
    const addError = (type, error) => {
        const errorObj = {
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            message: error.message || String(error),
            stack: error.stack,
            timestamp: new Date().toISOString(),
            context: {
                deviceId: state.device.id,
                sessionId: state.device.sessionId,
                networkStatus: state.status.network,
                queueSize: state.queue.metadata.totalItems
            }
        };
        
        state.errors.current.push(errorObj);
        state.errors.history.push(errorObj);
        
        // Keep only last 100 errors
        if (state.errors.current.length > 100) {
            state.errors.current.shift();
        }
        
        // Auto-retry if configured
        if (state.errors.handling.autoRetry) {
            scheduleErrorRetry(errorObj);
        }
        
        // Notify user if configured
        if (state.errors.handling.notifyUser && state.ui.notifications.showError) {
            dispatchEvent('errorNotification', errorObj);
        }
        
        // Log to server if configured
        if (state.errors.handling.logToServer) {
            logErrorToServer(errorObj);
        }
        
        logEvent('error_recorded', errorObj);
        saveState();
        
        return errorObj.id;
    };
    
    // Schedule error retry
    const scheduleErrorRetry = (error) => {
        // Check if error is retryable
        const retryableErrors = [
            SYNC_CONFIG.ERROR_TYPES.NETWORK_ERROR,
            SYNC_CONFIG.ERROR_TYPES.TIMEOUT_ERROR
        ];
        
        if (!retryableErrors.includes(error.type)) {
            return;
        }
        
        // Schedule retry
        const retryDelay = state.errors.handling.retryDelay * 
                          Math.pow(2, state.errors.current.filter(e => e.type === error.type).length - 1);
        
        setTimeout(() => {
            triggerSync('error_retry');
        }, retryDelay);
        
        logEvent('error_retry_scheduled', {
            errorId: error.id,
            type: error.type,
            retryDelay,
            timestamp: new Date().toISOString()
        });
    };
    
    // Log error to server (simulated)
    const logErrorToServer = (error) => {
        // In real app, this would send to error tracking service
        console.error('Sync Error Report:', error);
        logEvent('error_reported_to_server', { errorId: error.id });
    };
    
    // Clear error
    const clearError = (errorId) => {
        const index = state.errors.current.findIndex(e => e.id === errorId);
        if (index !== -1) {
            const error = state.errors.current[index];
            state.errors.current.splice(index, 1);
            
            logEvent('error_cleared', { errorId });
            saveState();
            
            return error;
        }
        return null;
    };
    
    // Clear all errors
    const clearAllErrors = () => {
        const cleared = [...state.errors.current];
        state.errors.current = [];
        
        logEvent('all_errors_cleared', { count: cleared.length });
        saveState();
        
        return cleared;
    };
    
    // UTILITY FUNCTIONS
    
    // Record sync session
    const recordSyncSession = (type, success, error = null) => {
        const session = {
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            success,
            error: error ? {
                message: error.message,
                type: error.type || 'unknown'
            } : null,
            timestamp: new Date().toISOString(),
            duration: state.queue.metadata.processingStart ? 
                     Date.now() - new Date(state.queue.metadata.processingStart) : 0,
            statistics: {
                totalItems: state.queue.metadata.totalItems,
                processed: state.offlineChanges.statistics.synced,
                failed: state.offlineChanges.statistics.failed,
                conflicts: state.status.statistics.conflicts,
                resolved: state.status.statistics.resolved
            },
            device: {
                id: state.device.id,
                type: state.device.type,
                platform: state.device.platform
            },
            network: { ...state.status.network }
        };
        
        state.history.sessions.push(session);
        
        // Record operation
        state.history.operations.push({
            sessionId: session.id,
            type: 'sync_session',
            data: session,
            timestamp: session.timestamp
        });
        
        // Record metrics
        state.history.metrics.syncTimes.push({
            timestamp: session.timestamp,
            value: session.duration,
            type: 'sync_duration'
        });
        
        logEvent('sync_session_recorded', { sessionId: session.id, type, success });
        
        return session;
    };
    
    // Log event
    const logEvent = (type, data = {}) => {
        const event = {
            type,
            data,
            timestamp: new Date().toISOString(),
            deviceId: state.device.id,
            sessionId: state.device.sessionId
        };
        
        // Dispatch event
        dispatchEvent(type, event);
        
        return event;
    };
    
    // Dispatch custom event
    const dispatchEvent = (eventName, detail) => {
        if (typeof window === 'undefined') return;
        
        const event = new CustomEvent(`mpesewa:sync:${eventName}`, { detail });
        window.dispatchEvent(event);
    };
    
    // Get current state
    const getState = () => {
        return JSON.parse(JSON.stringify(state));
    };
    
    // Get sync status
    const getSyncStatus = () => {
        return {
            overall: state.status.overall,
            network: state.status.network,
            lastSync: state.status.lastSync,
            nextSync: state.status.nextSync,
            statistics: state.status.statistics,
            queue: {
                totalItems: state.queue.metadata.totalItems,
                processing: state.queue.metadata.processing,
                estimatedTime: state.queue.metadata.estimatedTime
            },
            offlineChanges: state.offlineChanges.statistics,
            conflicts: {
                active: state.conflicts.active.length,
                history: state.conflicts.history.length
            }
        };
    };
    
    // Get queue statistics
    const getQueueStatistics = () => {
        const stats = {
            total: state.queue.metadata.totalItems,
            byPriority: {},
            byComponent: {},
            byCountry: {},
            oldestItem: state.queue.metadata.oldestItem,
            newestItem: state.queue.metadata.newestItem,
            estimatedTime: state.queue.metadata.estimatedTime
        };
        
        // Count by priority
        Object.keys(state.queue.priorities).forEach(priority => {
            stats.byPriority[priority] = state.queue.priorities[priority].length;
        });
        
        // Count by component
        Object.keys(state.queue.components).forEach(component => {
            const items = state.queue.components[component];
            stats.byComponent[component] = Array.isArray(items) ? items.length : 0;
        });
        
        // Count by country
        Object.keys(state.queue.countries).forEach(countryCode => {
            stats.byCountry[countryCode] = state.queue.countries[countryCode].metadata.totalItems;
        });
        
        return stats;
    };
    
    // Check sync health
    const checkSyncHealth = () => {
        const checks = {
            network: state.status.network.online,
            queue: state.queue.metadata.totalItems < state.config.thresholds.maxQueueSize,
            errors: state.errors.current.length < 10,
            conflicts: state.conflicts.active.length < 5,
            subscription: state.subscriptionLimits.current !== null,
            role: state.rolePermissions.current !== null
        };
        
        const allPassed = Object.values(checks).every(check => check === true);
        const failedChecks = Object.entries(checks)
            .filter(([_, passed]) => !passed)
            .map(([check]) => check);
        
        return {
            healthy: allPassed,
            checks,
            failedChecks,
            timestamp: new Date().toISOString(),
            recommendations: failedChecks.map(check => getHealthRecommendation(check))
        };
    };
    
    // Get health recommendation
    const getHealthRecommendation = (failedCheck) => {
        const recommendations = {
            network: 'Check your internet connection and try again.',
            queue: 'Too many pending sync operations. Consider clearing the queue.',
            errors: 'Multiple sync errors detected. Check error logs for details.',
            conflicts: 'Unresolved conflicts detected. Resolve conflicts to continue.',
            subscription: 'Subscription not configured. Sync features may be limited.',
            role: 'User role not set. Some sync operations may be restricted.'
        };
        
        return recommendations[failedCheck] || 'Unknown issue. Please check sync configuration.';
    };
    
    // Set subscription limits
    const setSubscriptionLimits = (tier) => {
        if (!state.subscriptionLimits.tiers[tier]) {
            throw new Error(`Invalid subscription tier: ${tier}`);
        }
        
        state.subscriptionLimits.current = state.subscriptionLimits.tiers[tier];
        
        logEvent('subscription_limits_set', { tier, limits: state.subscriptionLimits.current });
        saveState();
        
        return state.subscriptionLimits.current;
    };
    
    // Set role permissions
    const setRolePermissions = (role) => {
        if (!state.rolePermissions.roles[role]) {
            throw new Error(`Invalid role: ${role}`);
        }
        
        state.rolePermissions.current = state.rolePermissions.roles[role];
        
        logEvent('role_permissions_set', { role, permissions: state.rolePermissions.current });
        saveState();
        
        return state.rolePermissions.current;
    };
    
    // Update country sync settings
    const updateCountrySyncSettings = (countryCode, settings) => {
        if (!SYNC_CONFIG.COUNTRIES.find(c => c.code === countryCode)) {
            throw new Error(`Country ${countryCode} not supported`);
        }
        
        if (!state.countrySettings[countryCode]) {
            state.countrySettings[countryCode] = {
                enabled: true,
                intervals: { ...state.config.intervals },
                policies: { ...state.config.policies },
                restrictions: {
                    maxSyncSize: 10485760,
                    allowedOperations: Object.values(SYNC_CONFIG.OPERATION_TYPES)
                }
            };
        }
        
        state.countrySettings[countryCode] = {
            ...state.countrySettings[countryCode],
            ...settings
        };
        
        logEvent('country_sync_settings_updated', { countryCode, settings });
        saveState();
        
        return state.countrySettings[countryCode];
    };
    
    // Reset state (for testing)
    const resetState = () => {
        state = JSON.parse(JSON.stringify(SYNC_CONFIG.initialState));
        initialize();
        return true;
    };
    
    // Initialize
    initialize();
    
    // Return public API
    return {
        // State getters
        getState,
        getSyncStatus,
        getQueueStatistics,
        checkSyncHealth,
        
        // Queue management
        addToQueue,
        processQueue,
        clearQueue,
        getConflictsByHierarchy,
        getConflictsByCountry,
        
        // Sync controls
        triggerSync,
        triggerBackgroundSync,
        pauseSync,
        resumeSync,
        cancelSync,
        
        // Conflict resolution
        resolveConflict,
        
        // Error handling
        addError,
        clearError,
        clearAllErrors,
        
        // Configuration
        setSubscriptionLimits,
        setRolePermissions,
        updateCountrySyncSettings,
        
        // Utility
        logEvent,
        resetState,
        
        // Configuration
        getConfig: () => SYNC_CONFIG,
        
        // Current state reference
        state: () => JSON.parse(JSON.stringify(state))
    };
};

// Create and export singleton instance
const syncSlice = createSyncSlice();

// Export for use in other modules
export default syncSlice;
export { SYNC_CONFIG };