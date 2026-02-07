/**
 * M-PESEWA PWA STATE SLICE
 * Progressive Web App state management for offline capability, installation, and updates
 * STRICT HIERARCHY: Global → Country → Groups → Lenders → Borrowers (Ledgers)
 * 
 * RULES:
 * 1. Offline-first approach for core functionality
 * 2. Country-specific data caching with isolation
 * 3. Automatic background sync for critical operations
 * 4. Update management with user control
 * 5. Installation prompts and metrics
 */

const PWA_CONFIG = {
    // Initial state structure
    initialState: {
        // Installation State
        installation: {
            // Installation status
            status: 'not_installed', // 'not_installed', 'installing', 'installed', 'failed'
            deferredPrompt: null,     // Store the beforeinstallprompt event
            installTime: null,        // When PWA was installed
            installSource: null,      // 'browser_prompt', 'manual', 'home_screen'
            
            // Installation metrics
            metrics: {
                promptsShown: 0,
                promptsDismissed: 0,
                installsInitiated: 0,
                installsCompleted: 0,
                installsFailed: 0,
                platforms: {},        // Platform-specific installs
                lastPromptTime: null
            },
            
            // Installation preferences
            preferences: {
                autoPrompt: true,      // Show install prompt automatically
                remindLater: true,     // Allow reminding later
                showOnboarding: true   // Show PWA onboarding
            }
        },
        
        // Update Management
        updates: {
            // Update availability
            available: false,
            waitingWorker: null,       // Waiting service worker
            lastUpdateCheck: null,
            updateInterval: 3600000,   // Check every hour (1 hour in ms)
            
            // Update details
            details: {
                version: '1.0.0',
                releaseNotes: '',
                mandatory: false,
                size: 0,
                estimatedTime: 0
            },
            
            // Update preferences
            preferences: {
                autoCheck: true,
                autoDownload: true,
                autoInstall: false,     // Manual install by default
                notifyAvailable: true,
                notifyDownloaded: true,
                notifyInstalled: true
            },
            
            // Update history
            history: [],
            maxHistoryEntries: 50
        },
        
        // Offline State
        offline: {
            // Current status
            status: 'online',          // 'online', 'offline', 'degraded'
            lastOnline: null,
            lastOffline: null,
            offlineDuration: 0,        // Total time offline in current session
            
            // Offline capabilities
            capabilities: {
                coreApp: true,         // Can run core app offline
                dataViewing: true,     // Can view cached data
                formSubmission: true,  // Can submit forms (queued for sync)
                ledgers: true,         // Can view ledgers
                groups: true,          // Can view groups
                calculators: true,     // Can use calculators
                emergencyHub: true     // Can view emergency categories
            },
            
            // Offline data
            data: {
                lastSync: null,
                syncQueue: [],         // Operations to sync when online
                queuedRequests: [],    // HTTP requests to retry
                cacheSize: 0,          // Total cache size in bytes
                cacheUsage: {}         // Cache usage by resource type
            },
            
            // Offline preferences
            preferences: {
                autoCache: true,
                cacheImages: true,
                cacheFonts: true,
                cacheData: true,
                cachePages: true,
                maxCacheSize: 52428800, // 50 MB
                syncOnConnection: true, // Auto-sync when connection restored
                syncInterval: 300000    // Sync every 5 minutes when online
            }
        },
        
        // Service Worker State
        serviceWorker: {
            // Registration
            registered: false,
            registration: null,
            scope: null,
            version: null,
            
            // State
            state: 'installing', // 'installing', 'waiting', 'activated', 'redundant'
            installingWorker: null,
            waitingWorker: null,
            activatingWorker: null,
            controller: null,
            
            // Events
            events: [],
            lastEvent: null
        },
        
        // Cache Management
        cache: {
            // Cache status
            enabled: true,
            initialized: false,
            
            // Caches by name and purpose
            caches: {
                core: {
                    name: 'mpesewa-core-v1',
                    version: '1',
                    size: 0,
                    lastUpdated: null,
                    strategy: 'cacheFirst',
                    resources: [
                        '/',
                        '/index.html',
                        '/offline.html',
                        '/404.html',
                        '/manifest.json',
                        '/service-worker.js'
                    ]
                },
                assets: {
                    name: 'mpesewa-assets-v1',
                    version: '1',
                    size: 0,
                    lastUpdated: null,
                    strategy: 'cacheFirst',
                    resources: [
                        '/assets/css/',
                        '/assets/images/',
                        '/assets/fonts/',
                        '/assets/icons/'
                    ]
                },
                data: {
                    name: 'mpesewa-data-v1',
                    version: '1',
                    size: 0,
                    lastUpdated: null,
                    strategy: 'staleWhileRevalidate',
                    resources: [
                        '/data/countries.json',
                        '/data/subscriptions.json',
                        '/data/categories.json',
                        '/data/collectors.json',
                        '/data/rules.json'
                    ]
                },
                // Country-specific caches (STRICT ISOLATION)
                country: {
                    strategy: 'networkFirst',
                    resources: []
                },
                // Dynamic cache for API responses
                dynamic: {
                    name: 'mpesewa-dynamic-v1',
                    version: '1',
                    size: 0,
                    lastUpdated: null,
                    strategy: 'networkFirst'
                }
            },
            
            // Cache statistics
            statistics: {
                totalRequests: 0,
                cacheHits: 0,
                cacheMisses: 0,
                cacheErrors: 0,
                averageResponseTime: 0,
                lastCleanup: null
            },
            
            // Cache preferences
            preferences: {
                enableCoreCache: true,
                enableAssetCache: true,
                enableDataCache: true,
                enableCountryCache: true,
                enableDynamicCache: true,
                cleanupInterval: 604800000, // 7 days in ms
                maxAge: 2592000000,         // 30 days in ms
                maxEntries: 100
            }
        },
        
        // Background Sync
        backgroundSync: {
            // Sync status
            enabled: true,
            supported: false,
            registered: false,
            
            // Sync operations
            operations: {
                pending: [],      // Pending sync operations
                inProgress: [],   // Currently syncing
                completed: [],    // Successfully synced
                failed: [],       // Failed sync operations
                retryQueue: []    // Operations to retry
            },
            
            // Sync tags (for different types of sync)
            tags: {
                ledgers: 'sync-ledgers',
                repayments: 'sync-repayments',
                registrations: 'sync-registrations',
                subscriptions: 'sync-subscriptions',
                blacklist: 'sync-blacklist',
                groups: 'sync-groups'
            },
            
            // Sync preferences
            preferences: {
                autoSync: true,
                syncOnVisibilityChange: true,
                syncOnOnline: true,
                retryFailed: true,
                maxRetries: 3,
                retryDelay: 5000, // 5 seconds
                batchSize: 10
            },
            
            // Sync statistics
            statistics: {
                totalOperations: 0,
                successful: 0,
                failed: 0,
                averageSyncTime: 0,
                lastSyncTime: null
            }
        },
        
        // Push Notifications
        pushNotifications: {
            // Permission state
            permission: 'default', // 'default', 'granted', 'denied'
            subscribed: false,
            subscription: null,
            
            // Subscription details
            details: {
                endpoint: null,
                keys: null,
                expirationTime: null
            },
            
            // Notification preferences
            preferences: {
                enabled: false,
                sound: true,
                vibration: true,
                categories: {
                    loans: true,           // Loan updates
                    repayments: true,      // Repayment reminders
                    subscriptions: true,   // Subscription updates
                    groups: true,          // Group notifications
                    system: true,          // System messages
                    marketing: false       // Marketing messages
                },
                quietHours: {
                    enabled: false,
                    start: '22:00',        // 10 PM
                    end: '08:00'           // 8 AM
                }
            },
            
            // Notification history
            history: [],
            maxHistoryEntries: 100
        },
        
        // Performance and Metrics
        performance: {
            // Core Web Vitals
            coreWebVitals: {
                lcp: null,      // Largest Contentful Paint
                fid: null,      // First Input Delay
                cls: null,      // Cumulative Layout Shift
                fcp: null,      // First Contentful Paint
                ttfb: null      // Time to First Byte
            },
            
            // Performance metrics
            metrics: {
                appLoadTime: null,
                serviceWorkerStartup: null,
                cacheHitRatio: 0,
                offlineAvailability: 0,
                syncSuccessRate: 0,
                notificationDelivery: 0
            },
            
            // Performance entries
            entries: {
                navigation: [],
                resource: [],
                paint: [],
                longTask: []
            },
            
            // Performance monitoring preferences
            preferences: {
                trackCoreWebVitals: true,
                trackResourceTiming: true,
                trackUserTiming: true,
                trackLongTasks: true,
                sampleRate: 0.1  // 10% of users
            }
        },
        
        // Country-Specific PWA Settings (STRICT ISOLATION)
        countrySettings: {
            // Example structure
            // 'KE': {
            //     cache: { /* country-specific cache settings */ },
            //     offline: { /* country-specific offline capabilities */ },
            //     sync: { /* country-specific sync settings */ }
            // }
        },
        
        // Storage Management
        storage: {
            // Storage usage
            usage: {
                total: 0,
                used: 0,
                available: 0,
                quota: 0,
                percentage: 0
            },
            
            // Storage by type
            breakdown: {
                cache: 0,
                indexedDB: 0,
                localStorage: 0,
                sessionStorage: 0,
                serviceWorker: 0
            },
            
            // Storage preferences
            preferences: {
                autoCleanup: true,
                cleanupThreshold: 0.8,  // Cleanup when 80% full
                preserveCriticalData: true,
                backupBeforeCleanup: true
            }
        },
        
        // UI State
        ui: {
            // Installation UI
            installBanner: {
                visible: false,
                dismissed: false,
                dismissedUntil: null,
                showCount: 0
            },
            
            // Update UI
            updateBanner: {
                visible: false,
                dismissed: false,
                updateAvailable: false
            },
            
            // Offline UI
            offlineIndicator: {
                visible: false,
                message: '',
                showReconnect: true
            },
            
            // Sync UI
            syncIndicator: {
                visible: false,
                progress: 0,
                message: '',
                status: 'idle' // 'idle', 'syncing', 'error', 'success'
            }
        },
        
        // Events and Logs
        events: {
            // Event log
            log: [],
            maxLogEntries: 1000,
            
            // Event listeners
            listeners: {},
            
            // Recent events
            recent: []
        },
        
        // Feature Detection
        features: {
            // Browser capabilities
            capabilities: {
                serviceWorker: false,
                pushManager: false,
                backgroundSync: false,
                cacheAPI: false,
                indexedDB: false,
                webAppManifest: false,
                installPrompt: false,
                beforeInstallPrompt: false,
                getInstalledRelatedApps: false
            },
            
            // Feature support status
            supported: {
                offlineMode: false,
                backgroundSync: false,
                pushNotifications: false,
                installToHomeScreen: false,
                periodicSync: false,
                contentIndex: false
            },
            
            // Feature usage
            usage: {
                offlineMode: 0,
                backgroundSync: 0,
                pushNotifications: 0,
                installedPWA: 0
            }
        },
        
        // Error States
        errors: {
            installation: null,
            serviceWorker: null,
            cache: null,
            sync: null,
            push: null,
            lastError: null,
            errorCount: 0
        },
        
        // Settings
        settings: {
            // General settings
            general: {
                enablePWA: true,
                enableOffline: true,
                enableBackgroundSync: true,
                enablePushNotifications: false,
                enablePerformanceTracking: true,
                enableErrorReporting: true
            },
            
            // Privacy settings
            privacy: {
                collectMetrics: true,
                shareDiagnostics: false,
                autoReportErrors: false
            },
            
            // Advanced settings
            advanced: {
                debugMode: false,
                forceUpdate: false,
                bypassCache: false,
                simulateOffline: false
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
    
    // Cache strategies
    CACHE_STRATEGIES: {
        CACHE_FIRST: 'cacheFirst',
        NETWORK_FIRST: 'networkFirst',
        STALE_WHILE_REVALIDATE: 'staleWhileRevalidate',
        NETWORK_ONLY: 'networkOnly',
        CACHE_ONLY: 'cacheOnly'
    },
    
    // Resource types for caching
    RESOURCE_TYPES: {
        HTML: 'html',
        CSS: 'css',
        JS: 'javascript',
        IMAGE: 'image',
        FONT: 'font',
        JSON: 'json',
        API: 'api',
        OTHER: 'other'
    },
    
    // Sync operation types
    SYNC_OPERATIONS: {
        CREATE_LEDGER: 'create_ledger',
        UPDATE_LEDGER: 'update_ledger',
        CREATE_REPAYMENT: 'create_repayment',
        UPDATE_REPAYMENT: 'update_repayment',
        CREATE_BORROWER: 'create_borrower',
        UPDATE_BORROWER: 'update_borrower',
        CREATE_LENDER: 'create_lender',
        UPDATE_LENDER: 'update_lender',
        CREATE_GROUP: 'create_group',
        UPDATE_GROUP: 'update_group',
        UPDATE_BLACKLIST: 'update_blacklist',
        UPDATE_SUBSCRIPTION: 'update_subscription'
    },
    
    // Error types
    ERROR_TYPES: {
        INSTALLATION_FAILED: 'installation_failed',
        SERVICE_WORKER_ERROR: 'service_worker_error',
        CACHE_ERROR: 'cache_error',
        SYNC_ERROR: 'sync_error',
        PUSH_ERROR: 'push_error',
        STORAGE_ERROR: 'storage_error',
        NETWORK_ERROR: 'network_error'
    }
};

/**
 * Create a new PWA slice with all required functionality
 */
const createPWASlice = () => {
    let state = JSON.parse(JSON.stringify(PWA_CONFIG.initialState));
    
    // Initialize from localStorage
    const initialize = () => {
        try {
            const saved = localStorage.getItem('mpesewa_pwa_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
            }
            
            // Initialize country settings if not present
            PWA_CONFIG.COUNTRIES.forEach(country => {
                if (!state.countrySettings[country.code]) {
                    state.countrySettings[country.code] = {
                        cache: {
                            enabled: true,
                            strategy: PWA_CONFIG.CACHE_STRATEGIES.NETWORK_FIRST,
                            maxSize: 10485760, // 10 MB per country
                            resources: []
                        },
                        offline: {
                            enabled: true,
                            capabilities: state.offline.capabilities
                        },
                        sync: {
                            enabled: true,
                            priority: 'normal'
                        }
                    };
                }
            });
            
            // Detect browser capabilities
            detectCapabilities();
            
            // Set up network monitoring
            setupNetworkMonitoring();
            
            // Initialize service worker
            initializeServiceWorker();
            
            // Initialize performance monitoring
            if (state.performance.preferences.trackCoreWebVitals) {
                initializePerformanceMonitoring();
            }
            
            saveState();
            return true;
        } catch (error) {
            console.error('Failed to initialize PWA state:', error);
            setError(PWA_CONFIG.ERROR_TYPES.SERVICE_WORKER_ERROR, error);
            return false;
        }
    };
    
    // Save state to localStorage
    const saveState = () => {
        try {
            localStorage.setItem('mpesewa_pwa_state', JSON.stringify(state));
            
            // Dispatch state change event
            dispatchEvent('stateChanged', { state: getState() });
        } catch (error) {
            console.error('Failed to save PWA state:', error);
        }
    };
    
    // Detect browser capabilities
    const detectCapabilities = () => {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
        
        // Service Worker support
        state.features.capabilities.serviceWorker = 'serviceWorker' in navigator;
        
        // Cache API support
        state.features.capabilities.cacheAPI = 'caches' in window;
        
        // Push Manager support
        state.features.capabilities.pushManager = 'PushManager' in window;
        
        // Background Sync support
        state.features.capabilities.backgroundSync = 'sync' in (navigator.serviceWorker || {});
        
        // IndexedDB support
        state.features.capabilities.indexedDB = 'indexedDB' in window;
        
        // Web App Manifest support
        state.features.capabilities.webAppManifest = 'manifest' in document;
        
        // Install prompt support
        state.features.capabilities.installPrompt = 'BeforeInstallPromptEvent' in window;
        
        // Get installed related apps support
        state.features.capabilities.getInstalledRelatedApps = 'getInstalledRelatedApps' in navigator;
        
        // Update supported features
        state.features.supported.offlineMode = state.features.capabilities.serviceWorker && 
                                               state.features.capabilities.cacheAPI;
        state.features.supported.backgroundSync = state.features.capabilities.backgroundSync;
        state.features.supported.pushNotifications = state.features.capabilities.pushManager;
        state.features.supported.installToHomeScreen = state.features.capabilities.installPrompt;
        
        // Log capabilities
        logEvent('capabilities_detected', {
            capabilities: state.features.capabilities,
            supported: state.features.supported
        });
        
        saveState();
    };
    
    // Set up network monitoring
    const setupNetworkMonitoring = () => {
        if (typeof window === 'undefined') return;
        
        // Network status events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // Connection API if available
        if (navigator.connection) {
            navigator.connection.addEventListener('change', handleConnectionChange);
        }
        
        // Page visibility
        document.addEventListener('visibilitychange', handleVisibilityChange);
    };
    
    // Handle online event
    const handleOnline = () => {
        state.offline.status = 'online';
        state.offline.lastOnline = new Date().toISOString();
        
        // Calculate offline duration
        if (state.offline.lastOffline) {
            const offlineTime = new Date(state.offline.lastOffline);
            const onlineTime = new Date();
            state.offline.offlineDuration = onlineTime - offlineTime;
        }
        
        // Trigger sync if enabled
        if (state.backgroundSync.preferences.syncOnOnline) {
            triggerBackgroundSync('online_restored');
        }
        
        // Update UI
        state.ui.offlineIndicator.visible = false;
        
        logEvent('online', {
            durationOffline: state.offline.offlineDuration,
            queuedOperations: state.offline.data.syncQueue.length
        });
        
        saveState();
        
        // Dispatch online event
        dispatchEvent('online', { 
            durationOffline: state.offline.offlineDuration,
            timestamp: new Date().toISOString() 
        });
    };
    
    // Handle offline event
    const handleOffline = () => {
        state.offline.status = 'offline';
        state.offline.lastOffline = new Date().toISOString();
        state.ui.offlineIndicator.visible = true;
        state.ui.offlineIndicator.message = 'You are currently offline. Some features may be limited.';
        
        logEvent('offline', { timestamp: state.offline.lastOffline });
        saveState();
        
        // Dispatch offline event
        dispatchEvent('offline', { timestamp: state.offline.lastOffline });
    };
    
    // Handle connection change
    const handleConnectionChange = () => {
        if (!navigator.connection) return;
        
        const connection = navigator.connection;
        const effectiveType = connection.effectiveType;
        
        // Update offline status based on connection quality
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            state.offline.status = 'degraded';
            state.ui.offlineIndicator.visible = true;
            state.ui.offlineIndicator.message = 'Your connection is slow. Some features may be limited.';
        } else if (state.offline.status === 'degraded') {
            state.offline.status = 'online';
            state.ui.offlineIndicator.visible = false;
        }
        
        logEvent('connection_change', {
            effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
        });
        
        saveState();
    };
    
    // Handle visibility change
    const handleVisibilityChange = () => {
        const isVisible = document.visibilityState === 'visible';
        
        if (isVisible && state.backgroundSync.preferences.syncOnVisibilityChange) {
            triggerBackgroundSync('visibility_change');
        }
        
        logEvent('visibility_change', { visible: isVisible });
        saveState();
    };
    
    // Initialize service worker
    const initializeServiceWorker = () => {
        if (!state.features.capabilities.serviceWorker) {
            logEvent('service_worker_unsupported', { message: 'Service workers not supported' });
            return;
        }
        
        if (!state.settings.general.enablePWA) {
            logEvent('service_worker_disabled', { message: 'PWA features disabled in settings' });
            return;
        }
        
        // Register service worker
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                state.serviceWorker.registered = true;
                state.serviceWorker.registration = registration;
                state.serviceWorker.scope = registration.scope;
                state.serviceWorker.state = 'installed';
                
                // Check for updates
                registration.update();
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    state.serviceWorker.installingWorker = newWorker;
                    state.serviceWorker.state = 'installing';
                    
                    newWorker.addEventListener('statechange', () => {
                        state.serviceWorker.state = newWorker.state;
                        
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New update available
                                state.serviceWorker.waitingWorker = newWorker;
                                state.updates.available = true;
                                state.updates.waitingWorker = newWorker;
                                
                                // Show update banner if preferences allow
                                if (state.updates.preferences.notifyAvailable) {
                                    state.ui.updateBanner.visible = true;
                                    state.ui.updateBanner.updateAvailable = true;
                                }
                                
                                logEvent('update_available', {
                                    version: state.updates.details.version
                                });
                            } else {
                                // First installation
                                state.serviceWorker.controller = newWorker;
                                logEvent('service_worker_installed', {
                                    scope: registration.scope
                                });
                            }
                        } else if (newWorker.state === 'activated') {
                            state.serviceWorker.activatingWorker = newWorker;
                            state.serviceWorker.controller = newWorker;
                            logEvent('service_worker_activated', {
                                scope: registration.scope
                            });
                        } else if (newWorker.state === 'redundant') {
                            state.serviceWorker.state = 'redundant';
                            logEvent('service_worker_redundant');
                        }
                        
                        saveState();
                    });
                });
                
                // Track controller changes
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    state.serviceWorker.controller = navigator.serviceWorker.controller;
                    logEvent('controller_change', {
                        hasController: !!navigator.serviceWorker.controller
                    });
                    saveState();
                });
                
                logEvent('service_worker_registered', {
                    scope: registration.scope,
                    state: registration.active?.state
                });
                
                saveState();
                
                // Initialize background sync if supported
                if (state.features.supported.backgroundSync) {
                    initializeBackgroundSync(registration);
                }
                
                // Initialize push notifications if supported and enabled
                if (state.features.supported.pushNotifications && 
                    state.settings.general.enablePushNotifications) {
                    initializePushNotifications(registration);
                }
            })
            .catch(error => {
                state.serviceWorker.registered = false;
                setError(PWA_CONFIG.ERROR_TYPES.SERVICE_WORKER_ERROR, error);
                logEvent('service_worker_registration_failed', { error: error.message });
                saveState();
            });
    };
    
    // Initialize performance monitoring
    const initializePerformanceMonitoring = () => {
        if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;
        
        // Track Core Web Vitals
        try {
            // LCP (Largest Contentful Paint)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                state.performance.coreWebVitals.lcp = lastEntry.startTime;
                
                logEvent('performance_lcp', {
                    value: lastEntry.startTime,
                    element: lastEntry.element?.tagName || 'unknown'
                });
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            
            // FID (First Input Delay)
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    state.performance.coreWebVitals.fid = entry.processingStart - entry.startTime;
                    
                    logEvent('performance_fid', {
                        value: state.performance.coreWebVitals.fid,
                        name: entry.name
                    });
                }
            }).observe({ type: 'first-input', buffered: true });
            
            // CLS (Cumulative Layout Shift)
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        state.performance.coreWebVitals.cls = (state.performance.coreWebVitals.cls || 0) + entry.value;
                        
                        logEvent('performance_cls', {
                            value: entry.value,
                            cumulative: state.performance.coreWebVitals.cls
                        });
                    }
                }
            }).observe({ type: 'layout-shift', buffered: true });
            
            logEvent('performance_monitoring_initialized');
        } catch (error) {
            console.error('Performance monitoring initialization failed:', error);
        }
    };
    
    // Initialize background sync
    const initializeBackgroundSync = (registration) => {
        if (!registration.sync) {
            logEvent('background_sync_unsupported');
            return;
        }
        
        state.backgroundSync.supported = true;
        state.backgroundSync.enabled = state.settings.general.enableBackgroundSync;
        
        // Register sync tags
        Object.values(PWA_CONFIG.SYNC_OPERATIONS).forEach(operation => {
            registration.sync.register(operation)
                .then(() => {
                    logEvent('sync_tag_registered', { tag: operation });
                })
                .catch(error => {
                    logEvent('sync_tag_registration_failed', { 
                        tag: operation, 
                        error: error.message 
                    });
                });
        });
        
        logEvent('background_sync_initialized');
        saveState();
    };
    
    // Initialize push notifications
    const initializePushNotifications = async (registration) => {
        try {
            // Check permission
            const permission = await Notification.requestPermission();
            state.pushNotifications.permission = permission;
            
            if (permission !== 'granted') {
                logEvent('push_permission_denied', { permission });
                return;
            }
            
            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BLl5V4qWqgFzZ6pL7XjK9mN1wT3yR8uC2vD0eG4hB6nM5xP7zQ9tA1sF3dH8jK2lL4')
            });
            
            state.pushNotifications.subscribed = true;
            state.pushNotifications.subscription = subscription;
            state.pushNotifications.details = {
                endpoint: subscription.endpoint,
                keys: subscription.toJSON().keys,
                expirationTime: subscription.expirationTime
            };
            
            logEvent('push_subscribed', {
                endpoint: subscription.endpoint.substring(0, 50) + '...'
            });
            
            saveState();
            
            // Send subscription to server (in a real app)
            // await sendSubscriptionToServer(subscription);
            
        } catch (error) {
            setError(PWA_CONFIG.ERROR_TYPES.PUSH_ERROR, error);
            logEvent('push_subscription_failed', { error: error.message });
        }
    };
    
    // Convert base64 to Uint8Array for push subscription
    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        
        return outputArray;
    };
    
    // INSTALLATION MANAGEMENT
    
    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (event) => {
        // Prevent the default browser install prompt
        event.preventDefault();
        
        // Store the event for later use
        state.installation.deferredPrompt = event;
        
        // Update installation metrics
        state.installation.metrics.promptsShown++;
        state.installation.metrics.lastPromptTime = new Date().toISOString();
        
        // Show install banner if preferences allow
        if (state.installation.preferences.autoPrompt && 
            !state.ui.installBanner.dismissed) {
            state.ui.installBanner.visible = true;
            state.ui.installBanner.showCount++;
        }
        
        logEvent('install_prompt_received', {
            platforms: event.platforms,
            userChoice: null
        });
        
        saveState();
        
        // Dispatch event
        dispatchEvent('installPromptAvailable', { event });
    };
    
    // Show install prompt
    const showInstallPrompt = () => {
        if (!state.installation.deferredPrompt) {
            logEvent('install_prompt_unavailable');
            return Promise.reject(new Error('No install prompt available'));
        }
        
        state.installation.metrics.installsInitiated++;
        state.installation.status = 'installing';
        state.ui.installBanner.visible = false;
        
        logEvent('install_initiated');
        saveState();
        
        // Show the install prompt
        return state.installation.deferredPrompt.prompt()
            .then(result => {
                state.installation.metrics.userChoice = result.outcome;
                
                if (result.outcome === 'accepted') {
                    state.installation.status = 'installed';
                    state.installation.installTime = new Date().toISOString();
                    state.installation.installSource = 'browser_prompt';
                    state.installation.metrics.installsCompleted++;
                    
                    // Track platform
                    const platform = navigator.platform || 'unknown';
                    state.installation.metrics.platforms[platform] = 
                        (state.installation.metrics.platforms[platform] || 0) + 1;
                    
                    logEvent('install_accepted', {
                        platform,
                        userChoice: result.outcome
                    });
                    
                    // Dispatch installed event
                    dispatchEvent('installed', {
                        installTime: state.installation.installTime,
                        source: state.installation.installSource
                    });
                } else {
                    state.installation.status = 'not_installed';
                    state.installation.metrics.promptsDismissed++;
                    
                    logEvent('install_dismissed', {
                        userChoice: result.outcome
                    });
                }
                
                // Clear the deferred prompt
                state.installation.deferredPrompt = null;
                
                saveState();
                return result;
            })
            .catch(error => {
                state.installation.status = 'failed';
                state.installation.metrics.installsFailed++;
                setError(PWA_CONFIG.ERROR_TYPES.INSTALLATION_FAILED, error);
                
                logEvent('install_failed', { error: error.message });
                saveState();
                
                throw error;
            });
    };
    
    // Dismiss install banner
    const dismissInstallBanner = (remindLater = false) => {
        state.ui.installBanner.visible = false;
        state.ui.installBanner.dismissed = true;
        
        if (remindLater) {
            // Set reminder for 7 days later
            const remindDate = new Date();
            remindDate.setDate(remindDate.getDate() + 7);
            state.ui.installBanner.dismissedUntil = remindDate.toISOString();
        }
        
        state.installation.metrics.promptsDismissed++;
        
        logEvent('install_banner_dismissed', { remindLater });
        saveState();
    };
    
    // Check if PWA is installed
    const checkIfInstalled = () => {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            return false;
        }
        
        // Check multiple indicators
        const indicators = [
            // Standalone mode (iOS, Android Chrome)
            window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.matchMedia('(display-mode: minimal-ui)').matches,
            
            // navigator.standalone (iOS Safari)
            navigator.standalone === true,
            
            // Check if launched from home screen (heuristic)
            window.location.search.includes('from_homescreen') ||
            document.referrer.includes('android-app://') ||
            window.performance.getEntriesByType('navigation')[0]?.type === 'back_forward'
        ];
        
        const isInstalled = indicators.some(indicator => indicator === true);
        
        if (isInstalled && state.installation.status !== 'installed') {
            state.installation.status = 'installed';
            state.installation.installTime = new Date().toISOString();
            state.installation.installSource = 'detected';
            state.installation.metrics.installsCompleted++;
            
            logEvent('install_detected', { source: 'auto_detection' });
            saveState();
        }
        
        return isInstalled;
    };
    
    // UPDATE MANAGEMENT
    
    // Check for updates
    const checkForUpdates = () => {
        if (!state.serviceWorker.registered || !state.serviceWorker.registration) {
            logEvent('update_check_failed', { reason: 'service_worker_not_registered' });
            return Promise.reject(new Error('Service worker not registered'));
        }
        
        state.updates.lastUpdateCheck = new Date().toISOString();
        
        return state.serviceWorker.registration.update()
            .then(() => {
                logEvent('update_check_completed', {
                    available: state.updates.available
                });
                return state.updates.available;
            })
            .catch(error => {
                logEvent('update_check_failed', { error: error.message });
                throw error;
            })
            .finally(() => {
                saveState();
            });
    };
    
    // Apply update
    const applyUpdate = () => {
        if (!state.updates.waitingWorker) {
            logEvent('update_apply_failed', { reason: 'no_waiting_worker' });
            return Promise.reject(new Error('No update waiting'));
        }
        
        logEvent('update_applying');
        
        // Send skipWaiting message to the waiting service worker
        state.updates.waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        
        // Reload the page to apply the update
        window.location.reload();
        
        return Promise.resolve();
    };
    
    // Dismiss update banner
    const dismissUpdateBanner = () => {
        state.ui.updateBanner.visible = false;
        state.ui.updateBanner.dismissed = true;
        
        logEvent('update_banner_dismissed');
        saveState();
    };
    
    // Record update history
    const recordUpdateHistory = (version, type) => {
        const updateRecord = {
            version,
            type, // 'manual', 'auto', 'critical'
            timestamp: new Date().toISOString(),
            previousVersion: state.updates.details.version
        };
        
        state.updates.history.unshift(updateRecord);
        
        // Limit history size
        if (state.updates.history.length > state.updates.maxHistoryEntries) {
            state.updates.history.pop();
        }
        
        // Update current version
        state.updates.details.version = version;
        state.updates.available = false;
        state.updates.waitingWorker = null;
        
        logEvent('update_recorded', updateRecord);
        saveState();
    };
    
    // CACHE MANAGEMENT
    
    // Initialize cache
    const initializeCache = async () => {
        if (!state.features.capabilities.cacheAPI) {
            logEvent('cache_initialization_failed', { reason: 'cache_api_unsupported' });
            return false;
        }
        
        try {
            // Initialize core cache
            if (state.cache.preferences.enableCoreCache) {
                await initializeCacheGroup('core');
            }
            
            // Initialize asset cache
            if (state.cache.preferences.enableAssetCache) {
                await initializeCacheGroup('assets');
            }
            
            // Initialize data cache
            if (state.cache.preferences.enableDataCache) {
                await initializeCacheGroup('data');
            }
            
            // Initialize dynamic cache
            if (state.cache.preferences.enableDynamicCache) {
                await initializeCacheGroup('dynamic');
            }
            
            state.cache.initialized = true;
            state.cache.statistics.lastCleanup = new Date().toISOString();
            
            logEvent('cache_initialized', {
                cacheGroups: Object.keys(state.cache.caches).filter(key => state.cache.caches[key].size > 0)
            });
            
            saveState();
            return true;
        } catch (error) {
            setError(PWA_CONFIG.ERROR_TYPES.CACHE_ERROR, error);
            logEvent('cache_initialization_failed', { error: error.message });
            return false;
        }
    };
    
    // Initialize cache group
    const initializeCacheGroup = async (cacheGroup) => {
        const cacheConfig = state.cache.caches[cacheGroup];
        
        try {
            const cache = await caches.open(cacheConfig.name);
            
            // Add resources to cache
            if (cacheConfig.resources && cacheConfig.resources.length > 0) {
                await cache.addAll(cacheConfig.resources);
            }
            
            // Update cache size
            const keys = await cache.keys();
            cacheConfig.size = keys.length;
            cacheConfig.lastUpdated = new Date().toISOString();
            
            // Update total cache size
            updateCacheSize();
            
            logEvent('cache_group_initialized', {
                group: cacheGroup,
                size: cacheConfig.size,
                resources: cacheConfig.resources.length
            });
        } catch (error) {
            throw new Error(`Failed to initialize cache group ${cacheGroup}: ${error.message}`);
        }
    };
    
    // Update cache size
    const updateCacheSize = async () => {
        let totalSize = 0;
        
        try {
            // Get all cache names
            const cacheNames = await caches.keys();
            
            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const requests = await cache.keys();
                
                for (const request of requests) {
                    const response = await cache.match(request);
                    if (response) {
                        const contentLength = response.headers.get('content-length');
                        if (contentLength) {
                            totalSize += parseInt(contentLength, 10);
                        }
                    }
                }
            }
            
            state.offline.data.cacheSize = totalSize;
            state.storage.breakdown.cache = totalSize;
            
            // Update storage usage
            updateStorageUsage();
            
        } catch (error) {
            console.error('Failed to update cache size:', error);
        }
    };
    
    // Update storage usage
    const updateStorageUsage = async () => {
        if (typeof navigator === 'undefined' || !navigator.storage) return;
        
        try {
            const estimate = await navigator.storage.estimate();
            
            state.storage.usage = {
                total: estimate.quota || 0,
                used: estimate.usage || 0,
                available: (estimate.quota || 0) - (estimate.usage || 0),
                quota: estimate.quota || 0,
                percentage: estimate.quota ? (estimate.usage / estimate.quota) * 100 : 0
            };
            
            // Check if cleanup is needed
            if (state.storage.preferences.autoCleanup && 
                state.storage.usage.percentage > state.storage.preferences.cleanupThreshold * 100) {
                cleanupStorage();
            }
            
            saveState();
        } catch (error) {
            console.error('Failed to update storage usage:', error);
        }
    };
    
    // Cleanup storage
    const cleanupStorage = async () => {
        logEvent('storage_cleanup_started', {
            usagePercentage: state.storage.usage.percentage.toFixed(2)
        });
        
        try {
            // Clean old caches
            await cleanupOldCaches();
            
            // Clean old IndexedDB data
            await cleanupOldIndexedDB();
            
            // Clean old localStorage (keep only essential data)
            cleanupLocalStorage();
            
            state.storage.usage.lastCleanup = new Date().toISOString();
            
            // Update storage usage after cleanup
            await updateStorageUsage();
            
            logEvent('storage_cleanup_completed', {
                newUsagePercentage: state.storage.usage.percentage.toFixed(2)
            });
            
            saveState();
        } catch (error) {
            logEvent('storage_cleanup_failed', { error: error.message });
        }
    };
    
    // Cleanup old caches
    const cleanupOldCaches = async () => {
        try {
            const cacheNames = await caches.keys();
            const currentCacheNames = Object.values(state.cache.caches)
                .map(cache => cache.name)
                .filter(Boolean);
            
            // Delete caches not in current configuration
            for (const cacheName of cacheNames) {
                if (!currentCacheNames.includes(cacheName)) {
                    await caches.delete(cacheName);
                    logEvent('cache_deleted', { cacheName });
                }
            }
        } catch (error) {
            console.error('Failed to cleanup old caches:', error);
        }
    };
    
    // Cleanup old IndexedDB (placeholder)
    const cleanupOldIndexedDB = async () => {
        // Implementation depends on your IndexedDB structure
        logEvent('indexeddb_cleanup_skipped', { reason: 'not_implemented' });
    };
    
    // Cleanup localStorage
    const cleanupLocalStorage = () => {
        const essentialKeys = [
            'mpesewa_auth_state',
            'mpesewa_user_state',
            'mpesewa_country_state',
            'mpesewa_pwa_state',
            'mpesewa_ui_state'
        ];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!essentialKeys.includes(key)) {
                localStorage.removeItem(key);
                logEvent('localstorage_item_removed', { key });
            }
        }
    };
    
    // Cache a resource
    const cacheResource = async (url, data, cacheGroup = 'dynamic', countryCode = null) => {
        if (!state.cache.enabled || !state.features.capabilities.cacheAPI) {
            return false;
        }
        
        try {
            let cacheName = state.cache.caches[cacheGroup]?.name || 'mpesewa-dynamic-v1';
            
            // Add country code to cache name for isolation
            if (countryCode && state.cache.preferences.enableCountryCache) {
                cacheName = `${cacheName}-${countryCode}`;
            }
            
            const cache = await caches.open(cacheName);
            const response = new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
            
            await cache.put(url, response);
            
            // Update cache statistics
            state.cache.statistics.totalRequests++;
            state.cache.statistics.cacheHits++;
            
            // Update cache size
            await updateCacheSize();
            
            logEvent('resource_cached', {
                url,
                cacheGroup,
                countryCode,
                size: JSON.stringify(data).length
            });
            
            saveState();
            return true;
        } catch (error) {
            state.cache.statistics.cacheErrors++;
            logEvent('cache_resource_failed', { 
                url, 
                cacheGroup, 
                error: error.message 
            });
            return false;
        }
    };
    
    // Get cached resource
    const getCachedResource = async (url, cacheGroup = 'dynamic', countryCode = null) => {
        if (!state.cache.enabled || !state.features.capabilities.cacheAPI) {
            return null;
        }
        
        try {
            let cacheName = state.cache.caches[cacheGroup]?.name || 'mpesewa-dynamic-v1';
            
            // Add country code to cache name for isolation
            if (countryCode && state.cache.preferences.enableCountryCache) {
                cacheName = `${cacheName}-${countryCode}`;
            }
            
            const cache = await caches.open(cacheName);
            const response = await cache.match(url);
            
            if (response) {
                const data = await response.json();
                
                // Update cache statistics
                state.cache.statistics.totalRequests++;
                state.cache.statistics.cacheHits++;
                
                logEvent('cache_hit', { url, cacheGroup, countryCode });
                saveState();
                
                return data;
            } else {
                state.cache.statistics.totalRequests++;
                state.cache.statistics.cacheMisses++;
                
                logEvent('cache_miss', { url, cacheGroup, countryCode });
                saveState();
                
                return null;
            }
        } catch (error) {
            state.cache.statistics.cacheErrors++;
            logEvent('cache_get_failed', { 
                url, 
                cacheGroup, 
                error: error.message 
            });
            return null;
        }
    };
    
    // Clear cache
    const clearCache = async (cacheGroup = null) => {
        try {
            if (cacheGroup) {
                const cacheName = state.cache.caches[cacheGroup]?.name;
                if (cacheName) {
                    await caches.delete(cacheName);
                    state.cache.caches[cacheGroup].size = 0;
                    logEvent('cache_cleared', { cacheGroup });
                }
            } else {
                // Clear all caches
                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                    await caches.delete(cacheName);
                }
                
                // Reset cache sizes
                Object.keys(state.cache.caches).forEach(key => {
                    state.cache.caches[key].size = 0;
                });
                
                logEvent('all_caches_cleared', { cacheCount: cacheNames.length });
            }
            
            // Update cache size
            await updateCacheSize();
            saveState();
            
            return true;
        } catch (error) {
            logEvent('cache_clear_failed', { cacheGroup, error: error.message });
            return false;
        }
    };
    
    // BACKGROUND SYNC MANAGEMENT
    
    // Trigger background sync
    const triggerBackgroundSync = (tag) => {
        if (!state.backgroundSync.enabled || !state.backgroundSync.supported) {
            logEvent('background_sync_skipped', { tag, reason: 'disabled_or_unsupported' });
            return Promise.reject(new Error('Background sync disabled or unsupported'));
        }
        
        if (!state.serviceWorker.registration?.sync) {
            logEvent('background_sync_skipped', { tag, reason: 'sync_api_unavailable' });
            return Promise.reject(new Error('Sync API unavailable'));
        }
        
        return state.serviceWorker.registration.sync.register(tag)
            .then(() => {
                logEvent('background_sync_triggered', { tag });
                return tag;
            })
            .catch(error => {
                setError(PWA_CONFIG.ERROR_TYPES.SYNC_ERROR, error);
                logEvent('background_sync_failed', { tag, error: error.message });
                throw error;
            });
    };
    
    // Queue sync operation
    const queueSyncOperation = (operation) => {
        if (!state.backgroundSync.enabled) {
            logEvent('sync_operation_skipped', { 
                type: operation.type, 
                reason: 'background_sync_disabled' 
            });
            return false;
        }
        
        const syncOperation = {
            id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...operation,
            timestamp: new Date().toISOString(),
            status: 'pending',
            attempts: 0,
            lastAttempt: null
        };
        
        state.backgroundSync.operations.pending.push(syncOperation);
        state.backgroundSync.statistics.totalOperations++;
        
        // Queue for background sync
        state.offline.data.syncQueue.push(syncOperation);
        
        // Trigger sync if online
        if (state.offline.status === 'online') {
            triggerBackgroundSync(operation.type);
        }
        
        logEvent('sync_operation_queued', {
            id: syncOperation.id,
            type: operation.type,
            pendingCount: state.backgroundSync.operations.pending.length
        });
        
        saveState();
        return syncOperation.id;
    };
    
    // Process sync operation
    const processSyncOperation = async (operationId) => {
        const operationIndex = state.backgroundSync.operations.pending.findIndex(op => op.id === operationId);
        if (operationIndex === -1) {
            logEvent('sync_operation_not_found', { operationId });
            return false;
        }
        
        const operation = state.backgroundSync.operations.pending[operationIndex];
        
        // Move to in-progress
        state.backgroundSync.operations.pending.splice(operationIndex, 1);
        operation.status = 'in_progress';
        operation.attempts++;
        operation.lastAttempt = new Date().toISOString();
        state.backgroundSync.operations.inProgress.push(operation);
        
        // Update UI
        state.ui.syncIndicator.visible = true;
        state.ui.syncIndicator.status = 'syncing';
        state.ui.syncIndicator.message = `Syncing ${operation.type.replace('_', ' ')}...`;
        
        logEvent('sync_operation_started', {
            id: operation.id,
            type: operation.type,
            attempts: operation.attempts
        });
        
        saveState();
        
        try {
            // Simulate sync operation (in real app, this would be an API call)
            await simulateSync(operation);
            
            // Move to completed
            const inProgressIndex = state.backgroundSync.operations.inProgress.findIndex(op => op.id === operationId);
            if (inProgressIndex !== -1) {
                state.backgroundSync.operations.inProgress.splice(inProgressIndex, 1);
                operation.status = 'completed';
                operation.completedAt = new Date().toISOString();
                state.backgroundSync.operations.completed.push(operation);
                state.backgroundSync.statistics.successful++;
            }
            
            // Remove from sync queue
            const queueIndex = state.offline.data.syncQueue.findIndex(op => op.id === operationId);
            if (queueIndex !== -1) {
                state.offline.data.syncQueue.splice(queueIndex, 1);
            }
            
            // Update UI
            state.ui.syncIndicator.status = 'success';
            state.ui.syncIndicator.message = 'Sync completed';
            setTimeout(() => {
                state.ui.syncIndicator.visible = false;
                saveState();
            }, 2000);
            
            logEvent('sync_operation_completed', {
                id: operation.id,
                type: operation.type,
                duration: new Date() - new Date(operation.timestamp)
            });
            
            saveState();
            return true;
            
        } catch (error) {
            // Move to failed or retry queue
            const inProgressIndex = state.backgroundSync.operations.inProgress.findIndex(op => op.id === operationId);
            if (inProgressIndex !== -1) {
                state.backgroundSync.operations.inProgress.splice(inProgressIndex, 1);
                operation.status = 'failed';
                operation.error = error.message;
                state.backgroundSync.operations.failed.push(operation);
                state.backgroundSync.statistics.failed++;
            }
            
            // Retry if allowed
            if (state.backgroundSync.preferences.retryFailed && 
                operation.attempts < state.backgroundSync.preferences.maxRetries) {
                operation.status = 'pending';
                operation.retryAt = new Date(Date.now() + state.backgroundSync.preferences.retryDelay);
                state.backgroundSync.operations.retryQueue.push(operation);
                
                logEvent('sync_operation_retry_queued', {
                    id: operation.id,
                    type: operation.type,
                    attempts: operation.attempts,
                    retryAt: operation.retryAt
                });
            }
            
            // Update UI
            state.ui.syncIndicator.status = 'error';
            state.ui.syncIndicator.message = 'Sync failed';
            
            logEvent('sync_operation_failed', {
                id: operation.id,
                type: operation.type,
                error: error.message,
                attempts: operation.attempts
            });
            
            saveState();
            return false;
        }
    };
    
    // Simulate sync operation
    const simulateSync = (operation) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // 90% success rate for simulation
                if (Math.random() > 0.1) {
                    resolve({ success: true, operationId: operation.id });
                } else {
                    reject(new Error('Simulated sync failure'));
                }
            }, 1000);
        });
    };
    
    // Retry failed sync operations
    const retryFailedSyncs = () => {
        const now = new Date();
        const toRetry = [];
        
        // Find operations ready for retry
        state.backgroundSync.operations.retryQueue.forEach((operation, index) => {
            if (operation.retryAt && new Date(operation.retryAt) <= now) {
                toRetry.push({ operation, index });
            }
        });
        
        // Process retries in reverse order to maintain indices
        toRetry.reverse().forEach(({ operation, index }) => {
            state.backgroundSync.operations.retryQueue.splice(index, 1);
            operation.status = 'pending';
            state.backgroundSync.operations.pending.push(operation);
            
            logEvent('sync_operation_retried', {
                id: operation.id,
                type: operation.type,
                attempt: operation.attempts + 1
            });
        });
        
        if (toRetry.length > 0) {
            triggerBackgroundSync('retry_operations');
        }
        
        saveState();
        return toRetry.length;
    };
    
    // Get sync statistics
    const getSyncStatistics = () => {
        const total = state.backgroundSync.statistics.totalOperations;
        const successful = state.backgroundSync.statistics.successful;
        const failed = state.backgroundSync.statistics.failed;
        const successRate = total > 0 ? (successful / total) * 100 : 0;
        
        return {
            total,
            successful,
            failed,
            successRate: successRate.toFixed(2),
            pending: state.backgroundSync.operations.pending.length,
            inProgress: state.backgroundSync.operations.inProgress.length,
            queued: state.offline.data.syncQueue.length
        };
    };
    
    // COUNTRY-SPECIFIC PWA MANAGEMENT
    
    // Get country PWA settings
    const getCountryPWASettings = (countryCode) => {
        return state.countrySettings[countryCode] || {};
    };
    
    // Update country PWA settings
    const updateCountryPWASettings = (countryCode, settings) => {
        if (!state.countrySettings[countryCode]) {
            state.countrySettings[countryCode] = {
                cache: { enabled: true, strategy: PWA_CONFIG.CACHE_STRATEGIES.NETWORK_FIRST },
                offline: { enabled: true, capabilities: state.offline.capabilities },
                sync: { enabled: true, priority: 'normal' }
            };
        }
        
        state.countrySettings[countryCode] = {
            ...state.countrySettings[countryCode],
            ...settings
        };
        
        logEvent('country_pwa_settings_updated', { countryCode, settings });
        saveState();
        
        return state.countrySettings[countryCode];
    };
    
    // Cache country-specific data
    const cacheCountryData = async (countryCode, dataType, data) => {
        const cacheKey = `/data/${countryCode}/${dataType}`;
        return await cacheResource(cacheKey, data, 'dynamic', countryCode);
    };
    
    // Get cached country data
    const getCachedCountryData = async (countryCode, dataType) => {
        const cacheKey = `/data/${countryCode}/${dataType}`;
        return await getCachedResource(cacheKey, 'dynamic', countryCode);
    };
    
    // EVENT LOGGING AND DISPATCH
    
    // Log event
    const logEvent = (type, data = {}) => {
        const event = {
            type,
            data,
            timestamp: new Date().toISOString(),
            offline: state.offline.status !== 'online',
            session: {
                installed: state.installation.status === 'installed',
                version: state.updates.details.version
            }
        };
        
        state.events.log.unshift(event);
        state.events.recent.unshift(event);
        
        // Limit log size
        if (state.events.log.length > state.events.maxLogEntries) {
            state.events.log.pop();
        }
        
        // Keep only last 10 recent events
        if (state.events.recent.length > 10) {
            state.events.recent.pop();
        }
        
        // Save to storage periodically
        if (state.events.log.length % 10 === 0) {
            saveState();
        }
        
        return event;
    };
    
    // Dispatch custom event
    const dispatchEvent = (eventName, detail) => {
        if (typeof window === 'undefined') return;
        
        const event = new CustomEvent(`mpesewa:pwa:${eventName}`, { detail });
        window.dispatchEvent(event);
        
        logEvent(`event_dispatched_${eventName}`, detail);
    };
    
    // Add event listener
    const addEventListener = (eventName, callback) => {
        if (typeof window === 'undefined') return () => {};
        
        const eventType = `mpesewa:pwa:${eventName}`;
        window.addEventListener(eventType, callback);
        
        // Store listener for cleanup
        if (!state.events.listeners[eventName]) {
            state.events.listeners[eventName] = [];
        }
        state.events.listeners[eventName].push(callback);
        
        return () => {
            window.removeEventListener(eventType, callback);
            const index = state.events.listeners[eventName].indexOf(callback);
            if (index !== -1) {
                state.events.listeners[eventName].splice(index, 1);
            }
        };
    };
    
    // Remove event listeners
    const removeEventListeners = (eventName) => {
        if (!state.events.listeners[eventName]) return;
        
        state.events.listeners[eventName].forEach(callback => {
            window.removeEventListener(`mpesewa:pwa:${eventName}`, callback);
        });
        
        delete state.events.listeners[eventName];
    };
    
    // ERROR HANDLING
    
    // Set error
    const setError = (type, error) => {
        const errorObj = {
            type,
            message: error.message || String(error),
            stack: error.stack,
            timestamp: new Date().toISOString()
        };
        
        state.errors[type] = errorObj;
        state.errors.lastError = errorObj;
        state.errors.errorCount++;
        
        // Log error event
        logEvent('error', errorObj);
        
        // Auto-report errors if enabled
        if (state.settings.privacy.autoReportErrors) {
            reportError(errorObj);
        }
        
        saveState();
        
        // Dispatch error event
        dispatchEvent('error', errorObj);
        
        return errorObj;
    };
    
    // Clear error
    const clearError = (type) => {
        if (type) {
            state.errors[type] = null;
        } else {
            // Clear all errors
            Object.keys(state.errors).forEach(key => {
                if (key !== 'errorCount') {
                    state.errors[key] = null;
                }
            });
        }
        
        saveState();
        return true;
    };
    
    // Report error (simulated)
    const reportError = (error) => {
        // In a real app, this would send to error tracking service
        console.error('PWA Error Report:', error);
        logEvent('error_reported', error);
    };
    
    // SETTINGS MANAGEMENT
    
    // Update settings
    const updateSettings = (category, settings) => {
        if (!state.settings[category]) {
            throw new Error(`Invalid settings category: ${category}`);
        }
        
        state.settings[category] = {
            ...state.settings[category],
            ...settings
        };
        
        // Apply setting changes
        applySettingsChanges(category, settings);
        
        logEvent('settings_updated', { category, settings });
        saveState();
        
        return state.settings[category];
    };
    
    // Apply setting changes
    const applySettingsChanges = (category, settings) => {
        if (category === 'general') {
            if ('enablePWA' in settings) {
                if (!settings.enablePWA && state.serviceWorker.registration) {
                    // Unregister service worker
                    state.serviceWorker.registration.unregister();
                    state.serviceWorker.registered = false;
                } else if (settings.enablePWA && !state.serviceWorker.registered) {
                    // Register service worker
                    initializeServiceWorker();
                }
            }
            
            if ('enableOffline' in settings) {
                state.offline.capabilities.coreApp = settings.enableOffline;
            }
            
            if ('enableBackgroundSync' in settings) {
                state.backgroundSync.enabled = settings.enableBackgroundSync;
            }
        }
    };
    
    // Get all settings
    const getSettings = () => {
        return JSON.parse(JSON.stringify(state.settings));
    };
    
    // UTILITY FUNCTIONS
    
    // Get current state
    const getState = () => {
        return JSON.parse(JSON.stringify(state));
    };
    
    // Get PWA status summary
    const getStatusSummary = () => {
        return {
            installation: {
                status: state.installation.status,
                installed: state.installation.status === 'installed',
                metrics: state.installation.metrics
            },
            offline: {
                status: state.offline.status,
                capabilities: state.offline.capabilities,
                queuedOperations: state.offline.data.syncQueue.length
            },
            updates: {
                available: state.updates.available,
                version: state.updates.details.version
            },
            cache: {
                enabled: state.cache.enabled,
                initialized: state.cache.initialized,
                size: state.offline.data.cacheSize
            },
            sync: getSyncStatistics(),
            storage: state.storage.usage
        };
    };
    
    // Check PWA health
    const checkHealth = () => {
        const checks = {
            serviceWorker: state.serviceWorker.registered,
            cacheAPI: state.features.capabilities.cacheAPI,
            offlineSupport: state.features.supported.offlineMode,
            backgroundSync: state.features.supported.backgroundSync,
            storage: state.storage.usage.percentage < 90, // Less than 90% full
            errors: state.errors.errorCount < 10          // Less than 10 errors
        };
        
        const allPassed = Object.values(checks).every(check => check === true);
        const failedChecks = Object.entries(checks)
            .filter(([_, passed]) => !passed)
            .map(([check]) => check);
        
        return {
            healthy: allPassed,
            checks,
            failedChecks,
            timestamp: new Date().toISOString()
        };
    };
    
    // Reset state (for testing)
    const resetState = () => {
        state = JSON.parse(JSON.stringify(PWA_CONFIG.initialState));
        initialize();
        return true;
    };
    
    // Initialize
    initialize();
    
    // Return public API
    return {
        // State getters
        getState,
        getStatusSummary,
        getSettings,
        checkHealth,
        getSyncStatistics,
        
        // Installation management
        handleBeforeInstallPrompt,
        showInstallPrompt,
        dismissInstallBanner,
        checkIfInstalled,
        
        // Update management
        checkForUpdates,
        applyUpdate,
        dismissUpdateBanner,
        recordUpdateHistory,
        
        // Cache management
        initializeCache,
        cacheResource,
        getCachedResource,
        clearCache,
        updateCacheSize,
        cleanupStorage,
        
        // Background sync
        triggerBackgroundSync,
        queueSyncOperation,
        processSyncOperation,
        retryFailedSyncs,
        
        // Country management
        getCountryPWASettings,
        updateCountryPWASettings,
        cacheCountryData,
        getCachedCountryData,
        
        // Event management
        logEvent,
        addEventListener,
        removeEventListeners,
        dispatchEvent,
        
        // Error handling
        setError,
        clearError,
        
        // Settings management
        updateSettings,
        getSettings: getSettings,
        
        // Utility
        resetState,
        
        // Configuration
        getConfig: () => PWA_CONFIG,
        
        // Current state reference
        state: () => JSON.parse(JSON.stringify(state))
    };
};

// Create and export singleton instance
const pwaSlice = createPWASlice();

// Export for use in other modules
export default pwaSlice;
export { PWA_CONFIG };