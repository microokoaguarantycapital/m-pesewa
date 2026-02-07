/**
 * M-PESEWA ENVIRONMENT CONFIGURATION
 * Environment detection and configuration management
 * Strict adherence to deployment rules from Section D
 */

class MpesewaEnvironment {
    constructor() {
        this._environments = {
            DEVELOPMENT: 'development',
            STAGING: 'staging',
            PRODUCTION: 'production',
            TEST: 'test'
        };
        
        this._currentEnv = this.detectEnvironment();
        this._config = this.loadEnvironmentConfig();
        
        // Freeze environment to prevent modifications
        Object.freeze(this._environments);
        Object.freeze(this._config);
    }
    
    // ============================================
    // 1️⃣ ENVIRONMENT DETECTION
    // ============================================
    detectEnvironment() {
        // Check URL for environment indicators
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return this._environments.DEVELOPMENT;
        }
        
        // GitHub Pages (PRODUCTION)
        if (hostname.includes('github.io') || hostname.includes('mpesewa.com')) {
            return this._environments.PRODUCTION;
        }
        
        // Staging environment
        if (hostname.includes('staging.') || hostname.includes('test.')) {
            return this._environments.STAGING;
        }
        
        // Test environment
        if (hostname.includes('test-') || hostname.includes('-test')) {
            return this._environments.TEST;
        }
        
        // Default to production for security
        return this._environments.PRODUCTION;
    }
    
    // ============================================
    // 2️⃣ ENVIRONMENT CONFIGURATION
    // ============================================
    loadEnvironmentConfig() {
        const baseConfig = {
            // Common configuration for all environments
            APP_NAME: 'M-Pesewa',
            APP_VERSION: '1.0.0',
            APP_BUILD: '2024.01.01',
            
            // GitHub Pages specific configuration
            IS_GITHUB_PAGES: window.location.hostname.includes('github.io'),
            BASE_PATH: this.getBasePath(),
            
            // PWA Configuration
            PWA_ENABLED: true,
            OFFLINE_SUPPORT: true,
            BACKGROUND_SYNC: true,
            PUSH_NOTIFICATIONS: true,
            
            // Analytics
            ANALYTICS_ENABLED: true,
            ERROR_REPORTING: true,
            PERFORMANCE_MONITORING: true,
            
            // Security
            HTTPS_REQUIRED: true,
            CONTENT_SECURITY_POLICY: true,
            XSS_PROTECTION: true,
            CSRF_PROTECTION: true,
            
            // Caching
            CACHE_ENABLED: true,
            CACHE_VERSION: 'v1',
            CACHE_STRATEGY: 'networkFirst',
            
            // Logging
            LOG_LEVEL: 'info',
            LOG_TO_CONSOLE: true,
            LOG_TO_SERVER: false,
            
            // Feature flags (common)
            FEATURES: {
                DUAL_ROLE: true,
                GOOGLE_LOGIN: true,
                OFFLINE_MODE: true,
                AUTO_LOGOUT: true,
                AUTO_SAVE: true,
                AUTO_SYNC: true,
                DARK_MODE: true,
                HIGH_CONTRAST: true
            }
        };
        
        // Environment-specific overrides
        const envOverrides = {
            [this._environments.DEVELOPMENT]: {
                DEBUG: true,
                LOG_LEVEL: 'debug',
                API_BASE_URL: 'http://localhost:3000/api/v1',
                MOCK_API: true,
                MOCK_DATA: true,
                REDUX_DEVTOOLS: true,
                HOT_RELOAD: true,
                FEATURES: {
                    ...baseConfig.FEATURES,
                    DEV_TOOLS: true,
                    MOCK_MODE: true,
                    PERFORMANCE_DEBUG: true
                }
            },
            
            [this._environments.TEST]: {
                DEBUG: true,
                LOG_LEVEL: 'debug',
                API_BASE_URL: 'https://api.test.mpesewa.com/v1',
                MOCK_API: false,
                MOCK_DATA: false,
                REDUX_DEVTOOLS: true,
                FEATURES: {
                    ...baseConfig.FEATURES,
                    DEV_TOOLS: true,
                    TEST_MODE: true
                }
            },
            
            [this._environments.STAGING]: {
                DEBUG: false,
                LOG_LEVEL: 'warn',
                API_BASE_URL: 'https://api.staging.mpesewa.com/v1',
                MOCK_API: false,
                MOCK_DATA: false,
                REDUX_DEVTOOLS: false,
                FEATURES: {
                    ...baseConfig.FEATURES,
                    BETA_FEATURES: true
                }
            },
            
            [this._environments.PRODUCTION]: {
                DEBUG: false,
                LOG_LEVEL: 'error',
                API_BASE_URL: 'https://api.mpesewa.com/v1',
                MOCK_API: false,
                MOCK_DATA: false,
                REDUX_DEVTOOLS: false,
                FEATURES: {
                    ...baseConfig.FEATURES,
                    BETA_FEATURES: false,
                    EXPERIMENTAL: false
                }
            }
        };
        
        // Merge base config with environment-specific overrides
        const envConfig = envOverrides[this._currentEnv] || {};
        return {
            ...baseConfig,
            ...envConfig,
            ENVIRONMENT: this._currentEnv
        };
    }
    
    // ============================================
    // 3️⃣ PATH CONFIGURATION (GitHub Pages Specific)
    // ============================================
    getBasePath() {
        // For GitHub Pages project sites
        if (this._config.IS_GITHUB_PAGES) {
            const path = window.location.pathname;
            
            // Extract repository name from path
            const match = path.match(/^\/([^\/]+)\//);
            if (match && match[1] !== 'm-pesewa') {
                // Project site with custom repository name
                return `/${match[1]}/`;
            }
            
            // User/organization site or project site with repository name 'm-pesewa'
            return '/';
        }
        
        // For custom domains
        return '/';
    }
    
    // ============================================
    // 4️⃣ PUBLIC METHODS
    // ============================================
    get(key) {
        return this._config[key];
    }
    
    getAll() {
        return { ...this._config };
    }
    
    getEnvironment() {
        return this._currentEnv;
    }
    
    isDevelopment() {
        return this._currentEnv === this._environments.DEVELOPMENT;
    }
    
    isStaging() {
        return this._currentEnv === this._environments.STAGING;
    }
    
    isProduction() {
        return this._currentEnv === this._environments.PRODUCTION;
    }
    
    isTest() {
        return this._currentEnv === this._environments.TEST;
    }
    
    isGitHubPages() {
        return this._config.IS_GITHUB_PAGES;
    }
    
    // ============================================
    // 5️⃣ URL HELPER METHODS
    // ============================================
    getAssetPath(path) {
        // GitHub Pages requires relative paths without leading slash
        if (this._config.IS_GITHUB_PAGES) {
            // Remove leading slash if present
            const cleanPath = path.startsWith('/') ? path.substring(1) : path;
            return cleanPath;
        }
        
        // For other deployments, use path as is
        return path;
    }
    
    getApiUrl(endpoint) {
        const baseUrl = this._config.API_BASE_URL;
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        
        // For mock API in development
        if (this._config.MOCK_API && this.isDevelopment()) {
            return `/api/mock${cleanEndpoint}`;
        }
        
        return `${baseUrl}${cleanEndpoint}`;
    }
    
    getPageUrl(page) {
        const basePath = this._config.BASE_PATH;
        const cleanPage = page.startsWith('/') ? page : `/${page}`;
        
        // For GitHub Pages, ensure proper path resolution
        if (this._config.IS_GITHUB_PAGES) {
            // Remove leading slash from page if basePath is root
            if (basePath === '/') {
                return cleanPage.substring(1);
            }
            return `${basePath}${cleanPage.substring(1)}`;
        }
        
        return `${basePath}${cleanPage}`;
    }
    
    // ============================================
    // 6️⃣ FEATURE FLAG METHODS
    // ============================================
    isFeatureEnabled(feature) {
        return this._config.FEATURES[feature] || false;
    }
    
    enableFeature(feature) {
        if (this.isDevelopment()) {
            this._config.FEATURES[feature] = true;
            console.log(`Feature ${feature} enabled`);
        }
    }
    
    disableFeature(feature) {
        if (this.isDevelopment()) {
            this._config.FEATURES[feature] = false;
            console.log(`Feature ${feature} disabled`);
        }
    }
    
    // ============================================
    // 7️⃣ SECURITY METHODS
    // ============================================
    validateSecurity() {
        const issues = [];
        
        // Check for HTTPS in production
        if (this.isProduction() && window.location.protocol !== 'https:') {
            issues.push('Production site should use HTTPS');
        }
        
        // Check for secure headers
        if (!this._config.HTTPS_REQUIRED && this.isProduction()) {
            issues.push('HTTPS should be required in production');
        }
        
        // Check Content Security Policy
        if (!this._config.CONTENT_SECURITY_POLICY) {
            issues.push('Content Security Policy should be enabled');
        }
        
        return {
            isValid: issues.length === 0,
            issues: issues
        };
    }
    
    // ============================================
    // 8️⃣ DEPLOYMENT VALIDATION
    // ============================================
    validateDeployment() {
        const errors = [];
        const warnings = [];
        
        // GitHub Pages specific validations
        if (this.isGitHubPages()) {
            // Check for absolute paths
            const links = document.querySelectorAll('link[href^="/"], script[src^="/"], img[src^="/"]');
            if (links.length > 0) {
                errors.push('Absolute paths found. Use relative paths for GitHub Pages.');
            }
            
            // Check for missing files
            const requiredFiles = ['index.html', 'manifest.json', 'service-worker.js'];
            requiredFiles.forEach(file => {
                // This would need server-side checking, but we can check what we can
                if (file === 'index.html' && !window.location.pathname.endsWith('/')) {
                    warnings.push('GitHub Pages prefers trailing slash for directory indexes');
                }
            });
        }
        
        // PWA validation
        if (this._config.PWA_ENABLED) {
            if (!('serviceWorker' in navigator)) {
                warnings.push('Service Workers not supported in this browser');
            }
            
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                // Not running in standalone mode
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    }
    
    // ============================================
    // 9️⃣ PERFORMANCE CONFIGURATION
    // ============================================
    getPerformanceConfig() {
        return {
            // Lazy loading thresholds
            LAZY_LOAD_THRESHOLD: 0.1, // Load when 10% visible
            LAZY_LOAD_ROOT_MARGIN: '50px',
            
            // Image optimization
            IMAGE_QUALITY: this.isProduction() ? 80 : 90,
            IMAGE_FORMAT: 'webp',
            FALLBACK_FORMAT: 'jpeg',
            
            // Code splitting
            CHUNK_SIZE: 244 * 1024, // 244KB
            PREFETCH_DELAY: 5000, // 5 seconds
            
            // Caching strategies
            CACHE_TTL: {
                STATIC: 31536000, // 1 year
                API: 300, // 5 minutes
                USER_DATA: 3600 // 1 hour
            },
            
            // Monitoring thresholds
            PERFORMANCE_THRESHOLDS: {
                FCP: 1000, // First Contentful Paint (ms)
                LCP: 2500, // Largest Contentful Paint (ms)
                FID: 100, // First Input Delay (ms)
                CLS: 0.1, // Cumulative Layout Shift
                TTI: 3800, // Time to Interactive (ms)
                TBT: 300 // Total Blocking Time (ms)
            }
        };
    }
    
    // ============================================
    // 🔟 DEBUGGING & LOGGING
    // ============================================
    getDebugConfig() {
        return {
            // Console logging
            CONSOLE: {
                LOG: this._config.LOG_LEVEL === 'debug' || this._config.LOG_LEVEL === 'info',
                INFO: this._config.LOG_LEVEL === 'info',
                WARN: this._config.LOG_LEVEL === 'warn' || this._config.LOG_LEVEL === 'info' || this._config.LOG_LEVEL === 'debug',
                ERROR: true, // Always log errors
                DEBUG: this._config.LOG_LEVEL === 'debug'
            },
            
            // Network debugging
            NETWORK: {
                LOG_REQUESTS: this.isDevelopment(),
                LOG_RESPONSES: this.isDevelopment(),
                LOG_ERRORS: true,
                MOCK_DELAY: this.isDevelopment() ? 500 : 0
            },
            
            // State debugging
            STATE: {
                LOG_ACTIONS: this.isDevelopment(),
                LOG_MUTATIONS: this.isDevelopment(),
                LOG_GETTERS: this.isDevelopment(),
                TIME_TRAVEL: this.isDevelopment()
            },
            
            // Component debugging
            COMPONENT: {
                LOG_LIFECYCLE: this.isDevelopment(),
                LOG_RENDER: this.isDevelopment(),
                LOG_PROPS: this.isDevelopment(),
                LOG_STATE: this.isDevelopment()
            },
            
            // Performance profiling
            PERFORMANCE: {
                PROFILE_RENDER: this.isDevelopment(),
                PROFILE_NETWORK: this.isDevelopment(),
                PROFILE_MEMORY: this.isDevelopment()
            }
        };
    }
    
    // ============================================
    // 1️⃣1️⃣ ERROR HANDLING CONFIGURATION
    // ============================================
    getErrorHandlingConfig() {
        return {
            // Error reporting
            REPORTING: {
                ENABLED: this._config.ERROR_REPORTING,
                ENDPOINT: this.getApiUrl('/errors/report'),
                SAMPLING_RATE: this.isProduction() ? 0.1 : 1.0, // 10% in production
                IGNORE_PATTERNS: [
                    /Script error\.?/,
                    /Javascript\s+error/,
                    /Loading chunk/,
                    /Network Error/
                ]
            },
            
            // Error boundaries
            BOUNDARIES: {
                COMPONENT: true,
                ROUTE: true,
                APP: true
            },
            
            // Recovery strategies
            RECOVERY: {
                RETRY_ATTEMPTS: 3,
                RETRY_DELAY: 1000,
                FALLBACK_PAGES: {
                    NOT_FOUND: this.getPageUrl('404.html'),
                    OFFLINE: this.getPageUrl('offline.html'),
                    ERROR: this.getPageUrl('error.html')
                }
            },
            
            // User feedback
            USER_FEEDBACK: {
                SHOW_MESSAGES: true,
                ALLOW_REPORTING: true,
                PROMPT_FOR_DETAILS: false
            }
        };
    }
    
    // ============================================
    // 1️⃣2️⃣ LOCALIZATION CONFIGURATION
    // ============================================
    getLocalizationConfig() {
        return {
            // Default language
            DEFAULT_LANGUAGE: 'en',
            
            // Supported languages
            SUPPORTED_LANGUAGES: ['en', 'sw', 'fr', 'ar'],
            
            // Language detection
            DETECTION: {
                COOKIE: 'mpesewa_language',
                LOCAL_STORAGE: 'mpesewa_language',
                BROWSER: true,
                QUERY_PARAM: 'lang',
                ORDER: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag']
            },
            
            // Fallback language
            FALLBACK_LANGUAGE: 'en',
            
            // Loading strategy
            LOADING_STRATEGY: 'chunk',
            
            // Namespaces
            NAMESPACES: ['common', 'auth', 'lender', 'borrower', 'group', 'loan', 'subscription', 'emergency', 'country'],
            
            // Cache
            CACHE: {
                ENABLED: true,
                EXPIRATION: 7 * 24 * 60 * 60 * 1000, // 7 days
                VERSION: '1.0.0'
            }
        };
    }
    
    // ============================================
    // 1️⃣3️⃣ STORAGE CONFIGURATION
    // ============================================
    getStorageConfig() {
        return {
            // Storage types
            TYPES: {
                LOCAL_STORAGE: true,
                SESSION_STORAGE: true,
                INDEXED_DB: true,
                COOKIES: true
            },
            
            // Encryption
            ENCRYPTION: {
                ENABLED: this.isProduction(),
                ALGORITHM: 'AES-GCM',
                KEY_DERIVATION: 'PBKDF2'
            },
            
            // Quotas
            QUOTAS: {
                LOCAL_STORAGE: 5 * 1024 * 1024, // 5MB
                SESSION_STORAGE: 5 * 1024 * 1024, // 5MB
                INDEXED_DB: 50 * 1024 * 1024, // 50MB
                PER_USER: 10 * 1024 * 1024 // 10MB per user
            },
            
            // Cleanup
            CLEANUP: {
                ENABLED: true,
                INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
                MAX_AGE: 30 * 24 * 60 * 60 * 1000 // 30 days
            },
            
            // Migration
            MIGRATION: {
                ENABLED: true,
                VERSION_KEY: 'mpesewa_storage_version',
                CURRENT_VERSION: '1.0.0'
            }
        };
    }
    
    // ============================================
    // 1️⃣4️⃣ NETWORK CONFIGURATION
    // ============================================
    getNetworkConfig() {
        return {
            // Timeouts
            TIMEOUTS: {
                REQUEST: 30000, // 30 seconds
                UPLOAD: 120000, // 2 minutes
                DOWNLOAD: 60000, // 1 minute
                CONNECTION: 10000 // 10 seconds
            },
            
            // Retry logic
            RETRY: {
                ENABLED: true,
                MAX_ATTEMPTS: 3,
                BASE_DELAY: 1000, // 1 second
                MAX_DELAY: 10000, // 10 seconds
                BACKOFF_FACTOR: 2
            },
            
            // Caching
            CACHING: {
                ENABLED: true,
                STRATEGY: 'stale-while-revalidate',
                MAX_AGE: 300, // 5 minutes
                STALE_WHILE_REVALIDATE: 86400 // 24 hours
            },
            
            // Compression
            COMPRESSION: {
                REQUEST: true,
                RESPONSE: true,
                MIN_SIZE: 1024 // 1KB
            },
            
            // Authentication
            AUTHENTICATION: {
                TOKEN_REFRESH: true,
                REFRESH_THRESHOLD: 300, // 5 minutes
                AUTO_LOGOUT: true,
                LOGOUT_TIMEOUT: 30 * 60 * 1000 // 30 minutes
            }
        };
    }
    
    // ============================================
    // 1️⃣5️⃣ INTEGRATION CONFIGURATION
    // ============================================
    getIntegrationConfig() {
        return {
            // Third-party services
            THIRD_PARTY: {
                GOOGLE: {
                    ANALYTICS_ID: this.isProduction() ? 'UA-XXXXXXXXX-X' : null,
                    MAPS_API_KEY: this.isProduction() ? 'PROD_KEY' : 'DEV_KEY',
                    RECAPTCHA_SITE_KEY: this.isProduction() ? 'PROD_KEY' : 'DEV_KEY'
                },
                
                FIREBASE: {
                    ENABLED: false,
                    API_KEY: '',
                    PROJECT_ID: '',
                    APP_ID: ''
                },
                
                PAYMENT_GATEWAYS: {
                    STRIPE: {
                        ENABLED: false,
                        PUBLIC_KEY: this.isProduction() ? 'pk_live_xxx' : 'pk_test_xxx'
                    },
                    PAYPAL: {
                        ENABLED: false,
                        CLIENT_ID: this.isProduction() ? 'PROD_ID' : 'SANDBOX_ID'
                    }
                }
            },
            
            // Webhooks
            WEBHOOKS: {
                ENABLED: true,
                ENDPOINTS: {
                    PAYMENT: this.getApiUrl('/webhooks/payment'),
                    SUBSCRIPTION: this.getApiUrl('/webhooks/subscription'),
                    NOTIFICATION: this.getApiUrl('/webhooks/notification')
                }
            },
            
            // External APIs
            EXTERNAL_APIs: {
                EXCHANGE_RATE: {
                    ENABLED: true,
                    ENDPOINT: 'https://api.exchangerate-api.com/v4/latest/USD',
                    UPDATE_INTERVAL: 3600000 // 1 hour
                },
                
                SMS_GATEWAY: {
                    ENABLED: false,
                    PROVIDER: 'twilio',
                    ENDPOINT: this.getApiUrl('/sms/send')
                },
                
                EMAIL_SERVICE: {
                    ENABLED: false,
                    PROVIDER: 'sendgrid',
                    ENDPOINT: this.getApiUrl('/email/send')
                }
            }
        };
    }
    
    // ============================================
    // 1️⃣6️⃣ UTILITY METHODS
    // ============================================
    reloadConfig() {
        this._currentEnv = this.detectEnvironment();
        this._config = this.loadEnvironmentConfig();
        console.log('Environment configuration reloaded:', this._currentEnv);
    }
    
    toString() {
        return `MpesewaEnvironment [${this._currentEnv}]`;
    }
    
    toJSON() {
        return {
            environment: this._currentEnv,
            config: this._config
        };
    }
}

// Create singleton instance
const mpesewaEnv = new MpesewaEnvironment();

// Export singleton instance
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mpesewaEnv;
} else {
    window.mpesewaEnv = mpesewaEnv;
}

// Export class for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports.MpesewaEnvironment = MpesewaEnvironment;
}