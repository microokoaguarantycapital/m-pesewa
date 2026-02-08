/**
 * M-PESEWA APPLICATION INITIALIZATION
 * Early startup logic - Browser compatibility and feature detection
 * Strict error handling and PWA setup
 */

// Application compatibility requirements
const REQUIRED_FEATURES = {
    SERVICE_WORKER: 'serviceWorker',
    LOCAL_STORAGE: 'localStorage',
    FETCH_API: 'fetch',
    PROMISES: 'promises',
    WEB_MANIFEST: 'web manifest',
    INDEXED_DB: 'indexedDB' // For offline data storage
};

// Application configuration
const APP_CONFIG = {
    name: 'M-Pesewa',
    version: '1.0.0',
    build: '2026.01.24',
    environment: window.location.hostname === 'localhost' ? 'development' : 'production',
    pwa: {
        cacheName: 'mpesewa-v1',
        offlinePage: 'offline.html',
        assetsToCache: [
            './',
            './index.html',
            './offline.html',
            './404.html',
            './manifest.json',
            './assets/css/main.css',
            './assets/js/app.js'
        ]
    }
};

// State tracking
let appInitialized = false;
let missingFeatures = [];
let compatibilityCheckPassed = false;

/**
 * Initialize the M-Pesewa application with compatibility checks
 * @returns {Object} Initialization result
 */
export function initApp() {
    try {
        console.log('🔍 M-PESEWA INITIALIZATION STARTING...');
        console.log(`📱 App: ${APP_CONFIG.name} v${APP_CONFIG.version}`);
        console.log(`🌐 Environment: ${APP_CONFIG.environment}`);
        
        // 1. Check browser compatibility
        compatibilityCheckPassed = checkBrowserCompatibility();
        
        if (!compatibilityCheckPassed) {
            console.warn('⚠️ Browser compatibility issues detected:', missingFeatures);
            showCompatibilityWarning(missingFeatures);
            
            // Continue anyway, but mark as limited mode
            APP_CONFIG.limitedMode = true;
        } else {
            console.log('✅ All required features supported');
        }
        
        // 2. Initialize PWA capabilities
        initializePWA();
        
        // 3. Set up error handling
        setupErrorHandling();
        
        // 4. Initialize offline capabilities
        initializeOfflineSupport();
        
        // 5. Mark as initialized
        appInitialized = true;
        
        const result = {
            compatible: compatibilityCheckPassed,
            missingFeatures: [...missingFeatures],
            config: APP_CONFIG,
            initialized: true,
            timestamp: new Date().toISOString()
        };
        
        console.log('✅ M-PESEWA INITIALIZATION COMPLETE');
        console.log('📊 Result:', result);
        
        // Store initialization result
        localStorage.setItem('mpesewa_init_result', JSON.stringify(result));
        
        return result;
        
    } catch (error) {
        console.error('❌ INITIALIZATION FAILED:', error);
        
        const errorResult = {
            compatible: false,
            missingFeatures: [...missingFeatures],
            error: error.message,
            initialized: false,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('mpesewa_init_error', JSON.stringify(errorResult));
        
        showCriticalError(error);
        throw error;
    }
}

/**
 * Check browser compatibility against required features
 * @returns {boolean} True if all required features are supported
 */
function checkBrowserCompatibility() {
    missingFeatures = [];
    
    // Check service worker support
    if (!('serviceWorker' in navigator)) {
        missingFeatures.push(REQUIRED_FEATURES.SERVICE_WORKER);
    }
    
    // Check localStorage support
    if (!('localStorage' in window)) {
        missingFeatures.push(REQUIRED_FEATURES.LOCAL_STORAGE);
    }
    
    // Check fetch API support
    if (!('fetch' in window)) {
        missingFeatures.push(REQUIRED_FEATURES.FETCH_API);
    }
    
    // Check Promise support
    if (!('Promise' in window)) {
        missingFeatures.push(REQUIRED_FEATURES.PROMISES);
    }
    
    // Check Web App Manifest support
    if (!('onbeforeinstallprompt' in window)) {
        missingFeatures.push(REQUIRED_FEATURES.WEB_MANIFEST);
    }
    
    // Check IndexedDB support
    if (!('indexedDB' in window)) {
        missingFeatures.push(REQUIRED_FEATURES.INDEXED_DB);
    }
    
    return missingFeatures.length === 0;
}

/**
 * Show compatibility warning to user
 * @param {Array} features - Missing features
 */
function showCompatibilityWarning(features) {
    // Check if warning already shown
    if (localStorage.getItem('mpesewa_compatibility_warned')) {
        return;
    }
    
    const warningDiv = document.createElement('div');
    warningDiv.className = 'compatibility-warning';
    warningDiv.id = 'mpesewa-compatibility-warning';
    
    warningDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #f37021 0%, #e65c00 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(243, 112, 33, 0.3);
        max-width: 600px;
        width: 90%;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        border: 2px solid #ffffff40;
        backdrop-filter: blur(10px);
    `;
    
    warningDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 16px;">
            <div style="font-size: 24px; flex-shrink: 0;">⚠️</div>
            <div style="flex: 1;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                    Limited Browser Support
                </h3>
                <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.4; opacity: 0.9;">
                    Your browser is missing some features required for full M-Pesewa functionality:
                    <strong>${features.join(', ')}</strong>
                </p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button onclick="dismissCompatibilityWarning(true)" 
                            style="background: #003366; color: white; border: none; 
                                   padding: 8px 16px; border-radius: 6px; font-size: 14px; 
                                   cursor: pointer; display: flex; align-items: center; gap: 6px;">
                        <span>✅</span> Continue Anyway
                    </button>
                    <button onclick="dismissCompatibilityWarning(false)" 
                            style="background: transparent; color: white; border: 1px solid white; 
                                   padding: 8px 16px; border-radius: 6px; font-size: 14px; 
                                   cursor: pointer; display: flex; align-items: center; gap: 6px;">
                        <span>ℹ️</span> Learn More
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add dismiss function to window
    window.dismissCompatibilityWarning = (continueAnyway) => {
        if (continueAnyway) {
            localStorage.setItem('mpesewa_compatibility_warned', 'true');
        } else {
            window.open('https://mpesewa.com/support/browser-compatibility', '_blank');
        }
        warningDiv.style.opacity = '0';
        warningDiv.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => warningDiv.remove(), 300);
    };
    
    document.body.appendChild(warningDiv);
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
        if (document.getElementById('mpesewa-compatibility-warning')) {
            window.dismissCompatibilityWarning(true);
        }
    }, 30000);
}

/**
 * Initialize PWA capabilities
 */
function initializePWA() {
    if ('serviceWorker' in navigator) {
        // Register service worker
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('service-worker.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 Service Worker update found');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.warn('❌ Service Worker registration failed:', error);
                });
        });
        
        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker controller changed');
            // Force reload to get fresh content
            window.location.reload();
        });
    }
    
    // Handle beforeinstallprompt for PWA installation
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        deferredPrompt = e;
        
        console.log('📲 PWA installation available');
        
        // Show install button (you can customize this)
        setTimeout(() => showInstallButton(), 3000);
    });
    
    // Handle app installed event
    window.addEventListener('appinstalled', () => {
        console.log('📱 PWA installed successfully');
        localStorage.setItem('mpesewa_pwa_installed', 'true');
        
        // Send analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_installed');
        }
    });
}

/**
 * Show PWA install button
 */
function showInstallButton() {
    if (!localStorage.getItem('mpesewa_pwa_install_shown')) {
        const installDiv = document.createElement('div');
        installDiv.className = 'pwa-install-promotion';
        installDiv.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: linear-gradient(135deg, #28a745 0%, #218838 100%);
            color: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
            max-width: 300px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 2px solid #ffffff40;
            backdrop-filter: blur(10px);
            animation: slideInUp 0.3s ease;
        `;
        
        installDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="font-size: 24px;">📱</div>
                <div>
                    <h4 style="margin: 0; font-size: 14px; font-weight: 600;">Install M-Pesewa</h4>
                    <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Get quick access on your home screen</p>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="installPWA()" 
                        style="flex: 1; background: white; color: #28a745; border: none; 
                               padding: 8px 12px; border-radius: 6px; font-size: 14px; 
                               cursor: pointer; font-weight: 600;">
                    Install
                </button>
                <button onclick="dismissInstallPrompt()" 
                        style="background: transparent; color: white; border: 1px solid white; 
                               padding: 8px 12px; border-radius: 6px; font-size: 14px; cursor: pointer;">
                    Later
                </button>
            </div>
        `;
        
        document.body.appendChild(installDiv);
        localStorage.setItem('mpesewa_pwa_install_shown', 'true');
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Setup global error handling
 */
function setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('🛑 Global error caught:', event.error);
        logError(event.error);
        return true; // Allow default handling
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('🛑 Unhandled promise rejection:', event.reason);
        logError(event.reason);
    });
    
    // Network error detection
    window.addEventListener('online', () => {
        console.log('🌐 Online - Connection restored');
        showNotification('Connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
        console.warn('🌐 Offline - No internet connection');
        showNotification('You are offline. Some features may be limited.', 'warning');
    });
}

/**
 * Initialize offline support
 */
function initializeOfflineSupport() {
    // Check if offline page exists
    if ('caches' in window) {
        caches.open(APP_CONFIG.pwa.cacheName)
            .then(cache => cache.match('./offline.html'))
            .then(response => {
                if (!response) {
                    console.warn('⚠️ Offline page not cached');
                    // Cache offline page
                    fetch('./offline.html')
                        .then(res => {
                            caches.open(APP_CONFIG.pwa.cacheName)
                                .then(cache => cache.put('./offline.html', res));
                        });
                }
            });
    }
}

/**
 * Log error to console and storage
 * @param {Error} error - Error object
 */
function logError(error) {
    const errorLog = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
    };
    
    // Store error in localStorage (limited to last 50 errors)
    const errors = JSON.parse(localStorage.getItem('mpesewa_errors') || '[]');
    errors.unshift(errorLog);
    if (errors.length > 50) errors.pop();
    localStorage.setItem('mpesewa_errors', JSON.stringify(errors));
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: error.message,
            fatal: false
        });
    }
}

/**
 * Show critical error to user
 * @param {Error} error - Critical error
 */
function showCriticalError(error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'critical-error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #003366;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 2rem;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    errorDiv.innerHTML = `
        <div style="max-width: 500px;">
            <div style="font-size: 48px; margin-bottom: 1rem;">⚠️</div>
            <h1 style="color: #f37021; margin-bottom: 1rem;">Critical Error</h1>
            <p style="margin-bottom: 1.5rem;">
                M-Pesewa failed to initialize. Please refresh the page or contact support.
            </p>
            <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <code style="font-family: monospace; font-size: 12px; word-break: break-all;">
                    ${error.message || 'Unknown error'}
                </code>
            </div>
            <div style="margin-top: 2rem;">
                <button onclick="location.reload()" 
                        style="background: #f37021; color: white; border: none; 
                               padding: 12px 24px; border-radius: 6px; font-size: 16px; 
                               cursor: pointer; margin: 0.5rem;">
                    Refresh Application
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `mpesewa-notification notification-${type}`;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#f37021',
        info: '#0099ff'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || '#0099ff'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 20px;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
            <div style="flex: 1;">
                <div style="font-size: 14px; line-height: 1.4;">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: transparent; border: none; color: white; 
                           cursor: pointer; font-size: 20px; padding: 0; line-height: 1;">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Show update notification
 */
function showUpdateNotification() {
    if (localStorage.getItem('mpesewa_update_notified')) return;
    
    const updateDiv = document.createElement('div');
    updateDiv.className = 'update-notification';
    updateDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #0099ff 0%, #0077cc 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 153, 255, 0.3);
        max-width: 500px;
        width: 90%;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        border: 2px solid #ffffff40;
        backdrop-filter: blur(10px);
    `;
    
    updateDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px;">
            <div style="font-size: 24px;">🔄</div>
            <div style="flex: 1;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                    New Update Available
                </h3>
                <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.4; opacity: 0.9;">
                    A new version of M-Pesewa is available. Refresh to get the latest features.
                </p>
                <div style="display: flex; gap: 12px;">
                    <button onclick="refreshForUpdate()" 
                            style="background: white; color: #0099ff; border: none; 
                                   padding: 8px 16px; border-radius: 6px; font-size: 14px; 
                                   cursor: pointer; font-weight: 600;">
                        Refresh Now
                    </button>
                    <button onclick="dismissUpdateNotification()" 
                            style="background: transparent; color: white; border: 1px solid white; 
                                   padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer;">
                        Later
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(updateDiv);
    
    // Add functions to window
    window.refreshForUpdate = () => {
        localStorage.setItem('mpesewa_update_notified', 'true');
        window.location.reload();
    };
    
    window.dismissUpdateNotification = () => {
        localStorage.setItem('mpesewa_update_notified', 'true');
        updateDiv.remove();
    };
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
        if (document.querySelector('.update-notification')) {
            window.dismissUpdateNotification();
        }
    }, 30000);
}

/**
 * Check if app is initialized
 * @returns {boolean} True if initialized
 */
export function isAppInitialized() {
    return appInitialized;
}

/**
 * Get app configuration
 * @returns {Object} App configuration
 */
export function getAppConfig() {
    return { ...APP_CONFIG };
}

/**
 * Get compatibility status
 * @returns {Object} Compatibility status
 */
export function getCompatibilityStatus() {
    return {
        compatible: compatibilityCheckPassed,
        missingFeatures: [...missingFeatures],
        allFeatures: Object.values(REQUIRED_FEATURES)
    };
}

// Add global helper functions
window.MPESEWA = window.MPESEWA || {};
window.MPESEWA.showNotification = showNotification;
window.MPESEWA.getAppConfig = getAppConfig;
window.MPESEWA.getCompatibilityStatus = getCompatibilityStatus;

console.log('🔄 M-PESEWA APP-INIT LOADED');