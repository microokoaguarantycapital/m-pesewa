/**
 * M-PESEWA BOOTSTRAP
 * Application Bootstrap and Initialization
 * Ensures proper loading sequence and dependency management
 */

class MPesewaBootstrap {
    constructor() {
        this.dependencies = {
            loaded: {},
            required: [
                'config.js',
                'constants.js',
                'env.js',
                'feature-flags.js',
                'logger.js',
                'error-boundary.js',
                'event-bus.js',
                'registry.js',
                'di-container.js',
                'lifecycle.js',
                'app-shell.js',
                'app-init.js',
                'app-teardown.js'
            ]
        };
        
        this.initPhase = 'pre-bootstrap';
        this.bootSequence = [];
        this.errors = [];
        this.warnings = [];
        
        console.log('M-Pesewa Bootstrap Initialized');
    }
    
    /**
     * STRICT LOADING SEQUENCE FOR HIERARCHY
     * 1. Config & Constants
     * 2. Environment & Features
     * 3. Core Services
     * 4. Application Components
     * 5. UI Components
     */
    async boot() {
        try {
            console.log('🚀 Starting M-Pesewa Bootstrap Sequence');
            
            // Phase 1: Pre-boot validation
            await this.validateEnvironment();
            
            // Phase 2: Load core configuration
            await this.loadConfiguration();
            
            // Phase 3: Initialize core services
            await this.initializeServices();
            
            // Phase 4: Set up application structure
            await this.setupApplication();
            
            // Phase 5: Start application
            await this.startApplication();
            
            // Phase 6: Verify hierarchy
            await this.verifyHierarchy();
            
            console.log('✅ M-Pesewa Bootstrap Complete');
            this.dispatchEvent('boot:complete', { success: true, timestamp: new Date() });
            
        } catch (error) {
            console.error('❌ Bootstrap Failed:', error);
            this.handleBootstrapError(error);
            throw error;
        }
    }
    
    async validateEnvironment() {
        this.initPhase = 'environment-validation';
        console.log('🔍 Validating environment...');
        
        // Check browser compatibility
        const compatibility = this.checkBrowserCompatibility();
        if (!compatibility.supported) {
            throw new Error(`Browser not supported: ${compatibility.reason}`);
        }
        
        // Check storage availability
        if (!this.checkStorageSupport()) {
            throw new Error('LocalStorage not supported');
        }
        
        // Check network status
        this.checkNetworkStatus();
        
        // Check if running on GitHub Pages
        this.checkHostingEnvironment();
        
        console.log('✅ Environment validated successfully');
    }
    
    checkBrowserCompatibility() {
        const requiredFeatures = [
            'Promise',
            'fetch',
            'localStorage',
            'sessionStorage',
            'serviceWorker',
            'indexedDB'
        ];
        
        const missingFeatures = [];
        
        requiredFeatures.forEach(feature => {
            if (!window[feature]) {
                missingFeatures.push(feature);
            }
        });
        
        if (missingFeatures.length > 0) {
            return {
                supported: false,
                reason: `Missing features: ${missingFeatures.join(', ')}`
            };
        }
        
        return { supported: true };
    }
    
    checkStorageSupport() {
        try {
            localStorage.setItem('mpesewa_test', 'test');
            localStorage.removeItem('mpesewa_test');
            return true;
        } catch (error) {
            return false;
        }
    }
    
    checkNetworkStatus() {
        const isOnline = navigator.onLine;
        console.log(`🌐 Network status: ${isOnline ? 'Online' : 'Offline'}`);
        
        if (!isOnline) {
            this.warnings.push('Application started offline. Some features may be limited.');
        }
        
        return isOnline;
    }
    
    checkHostingEnvironment() {
        const hostname = window.location.hostname;
        const isGitHubPages = hostname.includes('github.io');
        
        if (isGitHubPages) {
            console.log('🏗️ Running on GitHub Pages');
            // GitHub Pages specific configurations
            this.configureForGitHubPages();
        }
    }
    
    configureForGitHubPages() {
        // Ensure relative paths work correctly
        window.basePath = window.location.pathname.includes('/m-pesewa/') 
            ? '/m-pesewa/' 
            : '/';
        
        // Configure service worker scope
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js', {
                scope: window.basePath
            }).then(registration => {
                console.log('ServiceWorker registration successful with scope:', registration.scope);
            }).catch(error => {
                console.error('ServiceWorker registration failed:', error);
            });
        }
    }
    
    async loadConfiguration() {
        this.initPhase = 'configuration-loading';
        console.log('⚙️ Loading configuration...');
        
        // Load config.js
        await this.loadScript('core/config.js');
        
        // Load constants.js
        await this.loadScript('core/constants.js');
        
        // Load env.js
        await this.loadScript('core/env.js');
        
        // Load feature-flags.js
        await this.loadScript('core/feature-flags.js');
        
        console.log('✅ Configuration loaded successfully');
    }
    
    async initializeServices() {
        this.initPhase = 'service-initialization';
        console.log('🛠️ Initializing services...');
        
        // Initialize logger
        await this.loadScript('core/logger.js');
        
        // Initialize error boundary
        await this.loadScript('core/error-boundary.js');
        
        // Initialize event bus
        await this.loadScript('core/event-bus.js');
        
        // Initialize registry
        await this.loadScript('core/registry.js');
        
        // Initialize DI container
        await this.loadScript('core/di-container.js');
        
        console.log('✅ Services initialized successfully');
    }
    
    async setupApplication() {
        this.initPhase = 'application-setup';
        console.log('🏗️ Setting up application...');
        
        // Initialize lifecycle
        await this.loadScript('core/lifecycle.js');
        
        // Initialize app shell
        await this.loadScript('core/app-shell.js');
        
        // Initialize app init
        await this.loadScript('core/app-init.js');
        
        // Initialize app teardown
        await this.loadScript('core/app-teardown.js');
        
        console.log('✅ Application setup complete');
    }
    
    async startApplication() {
        this.initPhase = 'application-start';
        console.log('🚀 Starting application...');
        
        // Start the main application
        if (window.MPesewa && typeof window.MPesewa.start === 'function') {
            await window.MPesewa.start();
        } else {
            // Load app.js if not already loaded
            await this.loadScript('core/app.js');
            if (window.MPesewa && typeof window.MPesewa.start === 'function') {
                await window.MPesewa.start();
            }
        }
        
        // Initialize country selector
        this.initializeCountrySelector();
        
        // Initialize auth system
        this.initializeAuthSystem();
        
        // Initialize navigation guards
        this.initializeNavigationGuards();
        
        console.log('✅ Application started successfully');
    }
    
    async verifyHierarchy() {
        this.initPhase = 'hierarchy-verification';
        console.log('🔗 Verifying hierarchy...');
        
        // Verify country structure exists
        if (!window.MPesewa || !window.MPesewa.countries) {
            throw new Error('Country hierarchy not initialized');
        }
        
        // Verify 12 countries
        const countries = Object.keys(window.MPesewa.countries);
        if (countries.length !== 12) {
            throw new Error(`Expected 12 countries, found ${countries.length}`);
        }
        
        // Verify all required countries
        const requiredCountries = [
            'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'DRC',
            'Burundi', 'Nigeria', 'Ghana', 'South Sudan',
            'Somalia', 'South Africa', 'Ethiopia'
        ];
        
        requiredCountries.forEach(country => {
            if (!window.MPesewa.countries[country]) {
                throw new Error(`Required country missing: ${country}`);
            }
        });
        
        // Verify hierarchy rules
        if (!window.MPesewa.hierarchy) {
            throw new Error('Hierarchy rules not initialized');
        }
        
        console.log('✅ Hierarchy verified successfully');
    }
    
    initializeCountrySelector() {
        console.log('🗺️ Initializing country selector...');
        
        // Restore country from localStorage
        const savedCountry = localStorage.getItem('mpesewa_country');
        if (savedCountry && window.MPesewa.countries[savedCountry]) {
            window.MPesewa.setCountry(savedCountry);
            console.log(`Restored country: ${savedCountry}`);
        }
        
        // Set up country change listener
        document.addEventListener('country:changed', (event) => {
            const { country } = event.detail;
            window.MPesewa.setCountry(country);
            this.dispatchEvent('country:selected', { country });
        });
    }
    
    initializeAuthSystem() {
        console.log('🔐 Initializing auth system...');
        
        // Check if user is already authenticated
        const isAuthenticated = localStorage.getItem('mpesewa_auth') === 'true';
        
        if (isAuthenticated) {
            // Set up auth state listeners
            document.addEventListener('auth:login', (event) => {
                const { user } = event.detail;
                console.log(`User logged in: ${user.username}`);
            });
            
            document.addEventListener('auth:logout', () => {
                console.log('User logged out');
            });
            
            document.addEventListener('auth:register', (event) => {
                const { user } = event.detail;
                console.log(`User registered: ${user.username}`);
            });
        }
    }
    
    initializeNavigationGuards() {
        console.log('🛡️ Initializing navigation guards...');
        
        // Protect lender routes
        this.setupRouteGuard('lender', () => {
            return window.MPesewa.state.isLender && 
                   window.MPesewa.state.subscription &&
                   window.MPesewa.checkSubscriptionStatus().active;
        });
        
        // Protect borrower routes
        this.setupRouteGuard('borrower', () => {
            return window.MPesewa.state.isBorrower;
        });
        
        // Protect country-specific routes
        this.setupRouteGuard('country', () => {
            return !!window.MPesewa.state.country;
        });
        
        // Protect authenticated routes
        this.setupRouteGuard('auth', () => {
            return window.MPesewa.state.isAuthenticated;
        });
    }
    
    setupRouteGuard(guardName, condition) {
        const eventName = `route:guard:${guardName}`;
        
        document.addEventListener(eventName, (event) => {
            const { route, next } = event.detail;
            
            if (condition()) {
                next(true); // Allow navigation
            } else {
                next(false); // Block navigation
                this.dispatchEvent('route:blocked', { route, guard: guardName });
                
                // Redirect to appropriate page
                if (guardName === 'auth') {
                    window.location.href = 'auth/login.html';
                } else if (guardName === 'country') {
                    window.location.href = 'countries/index.html';
                } else if (guardName === 'lender') {
                    window.location.href = 'subscription/expired.html';
                }
            }
        });
    }
    
    async loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (this.dependencies.loaded[src]) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            
            script.onload = () => {
                this.dependencies.loaded[src] = true;
                this.bootSequence.push({
                    phase: this.initPhase,
                    script: src,
                    timestamp: new Date()
                });
                resolve();
            };
            
            script.onerror = (error) => {
                const errorMsg = `Failed to load script: ${src}`;
                console.error(errorMsg, error);
                this.errors.push({
                    phase: this.initPhase,
                    script: src,
                    error: error.message
                });
                reject(new Error(errorMsg));
            };
            
            document.head.appendChild(script);
        });
    }
    
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                ...detail,
                timestamp: new Date(),
                phase: this.initPhase
            }
        });
        document.dispatchEvent(event);
    }
    
    handleBootstrapError(error) {
        console.error('Bootstrap Error:', error);
        
        // Log error to error tracking service
        if (window.MPesewaLogger) {
            window.MPesewaLogger.error('Bootstrap failed', {
                error: error.message,
                phase: this.initPhase,
                stack: error.stack
            });
        }
        
        // Show user-friendly error message
        this.showErrorMessage(error);
        
        // Dispatch error event
        this.dispatchEvent('boot:error', {
            error: error.message,
            phase: this.initPhase
        });
    }
    
    showErrorMessage(error) {
        // Create error overlay
        const errorOverlay = document.createElement('div');
        errorOverlay.className = 'bootstrap-error-overlay';
        errorOverlay.innerHTML = `
            <div class="error-content">
                <h2>⚠️ Application Startup Error</h2>
                <p>We encountered an issue while starting M-Pesewa.</p>
                <p class="error-details">${error.message}</p>
                <div class="error-actions">
                    <button onclick="location.reload()">Retry</button>
                    <button onclick="window.MPesewaBootstrap.showDebugInfo()">Debug Info</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .bootstrap-error-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 51, 102, 0.95);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            }
            .error-content {
                max-width: 500px;
                background: white;
                color: #003366;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            }
            .error-details {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                margin: 15px 0;
            }
            .error-actions button {
                margin: 5px;
                padding: 10px 20px;
                background: #f37021;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .error-actions button:hover {
                background: #e55a10;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(errorOverlay);
    }
    
    showDebugInfo() {
        const debugInfo = {
            bootstrap: {
                phase: this.initPhase,
                sequence: this.bootSequence,
                errors: this.errors,
                warnings: this.warnings
            },
            app: window.MPesewa ? window.MPesewa.debug() : null,
            environment: {
                userAgent: navigator.userAgent,
                online: navigator.onLine,
                localStorage: !!localStorage,
                serviceWorker: 'serviceWorker' in navigator,
                host: window.location.hostname,
                path: window.location.pathname
            }
        };
        
        console.log('Debug Info:', debugInfo);
        alert('Debug information logged to console. Press F12 to view.');
    }
    
    // Public API
    async restart() {
        console.log('🔄 Restarting bootstrap...');
        await this.boot();
    }
    
    getStatus() {
        return {
            phase: this.initPhase,
            loaded: Object.keys(this.dependencies.loaded),
            errors: this.errors,
            warnings: this.warnings,
            sequence: this.bootSequence
        };
    }
    
    // Clean shutdown
    async shutdown() {
        console.log('🔴 Shutting down bootstrap...');
        
        // Clean up event listeners
        document.removeEventListener('country:changed', () => {});
        document.removeEventListener('auth:login', () => {});
        document.removeEventListener('auth:logout', () => {});
        document.removeEventListener('auth:register', () => {});
        
        // Remove error overlay if exists
        const overlay = document.querySelector('.bootstrap-error-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        console.log('✅ Bootstrap shutdown complete');
    }
}

// Create global instance
window.MPesewaBootstrap = new MPesewaBootstrap();

// Auto-boot on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.MPesewaBootstrap.boot();
    } catch (error) {
        console.error('Auto-boot failed:', error);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MPesewaBootstrap;
}