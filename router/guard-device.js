/**
 * M-PESEWA DEVICE GUARD
 * Ensures device compatibility and proper PWA installation state
 * STRICT ENFORCEMENT: Device checks are non-negotiable for fintech security
 */

class DeviceGuard {
    constructor() {
        this.requiredFeatures = {
            storage: ['localStorage', 'sessionStorage', 'indexedDB'],
            apis: ['serviceWorker', 'fetch', 'Promise'],
            security: ['crypto', 'crypto.subtle', 'navigator.credentials']
        };
        
        this.deviceCategories = {
            MOBILE: 'mobile',
            TABLET: 'tablet',
            DESKTOP: 'desktop',
            UNSUPPORTED: 'unsupported'
        };
        
        this.minimumRequirements = {
            screenWidth: 320,
            screenHeight: 480,
            touchPoints: 1,
            memory: 256, // MB
            storage: 50, // MB
            connection: '2g'
        };
    }

    /**
     * Initialize device guard
     */
    async initialize() {
        console.log('[DeviceGuard] Initializing device compatibility checks');
        
        try {
            await this.validateDevice();
            await this.validateFeatures();
            await this.setupDeviceContext();
            await this.setupPWAInstallation();
            
            console.log('[DeviceGuard] Device validation completed successfully');
            return true;
        } catch (error) {
            console.error('[DeviceGuard] Device validation failed:', error);
            this.handleDeviceFailure(error);
            return false;
        }
    }

    /**
     * Validate device meets minimum requirements
     */
    async validateDevice() {
        const checks = [];
        
        // Screen size check
        if (window.innerWidth < this.minimumRequirements.screenWidth) {
            throw new Error(`Screen width too small: ${window.innerWidth}px < ${this.minimumRequirements.screenWidth}px`);
        }
        
        if (window.innerHeight < this.minimumRequirements.screenHeight) {
            throw new Error(`Screen height too small: ${window.innerHeight}px < ${this.minimumRequirements.screenHeight}px`);
        }
        
        // Touch capability check (mobile-first)
        if (!('ontouchstart' in window) && !navigator.maxTouchPoints) {
            console.warn('[DeviceGuard] Touch capability not detected');
        }
        
        // Memory check (if available)
        if (navigator.deviceMemory && navigator.deviceMemory < 1) {
            console.warn(`[DeviceGuard] Low memory: ${navigator.deviceMemory}GB`);
        }
        
        // Connection check
        if (navigator.connection) {
            const conn = navigator.connection;
            if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
                console.warn('[DeviceGuard] Slow connection detected:', conn.effectiveType);
            }
        }
        
        return true;
    }

    /**
     * Validate required browser features
     */
    async validateFeatures() {
        // Storage features
        this.requiredFeatures.storage.forEach(feature => {
            if (!window[feature]) {
                throw new Error(`Required storage feature missing: ${feature}`);
            }
        });
        
        // API features
        this.requiredFeatures.apis.forEach(feature => {
            if (!window[feature]) {
                throw new Error(`Required API missing: ${feature}`);
            }
        });
        
        // Security features (warn only, don't block)
        this.requiredFeatures.security.forEach(feature => {
            if (!window[feature]) {
                console.warn(`Security feature missing: ${feature}`);
            }
        });
        
        // Check for required Web Crypto API for financial operations
        if (!window.crypto || !window.crypto.subtle) {
            console.warn('[DeviceGuard] Web Crypto API not available - some security features disabled');
        }
        
        return true;
    }

    /**
     * Set up device context and categorization
     */
    async setupDeviceContext() {
        const deviceType = this.detectDeviceType();
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Store device information
        const deviceInfo = {
            type: deviceType,
            userAgent: userAgent,
            screen: {
                width: window.innerWidth,
                height: window.innerHeight,
                pixelRatio: window.devicePixelRatio || 1
            },
            capabilities: {
                touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
                orientation: 'onorientationchange' in window,
                geolocation: 'geolocation' in navigator,
                vibration: 'vibrate' in navigator
            },
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            } : null,
            memory: navigator.deviceMemory || 'unknown',
            cores: navigator.hardwareConcurrency || 'unknown'
        };
        
        // Store in session storage for persistence
        sessionStorage.setItem('mpesewa_device_info', JSON.stringify(deviceInfo));
        
        // Apply device-specific classes
        document.documentElement.classList.add(`device-${deviceType}`);
        
        // Add connection class for slow connections
        if (deviceInfo.connection && deviceInfo.connection.effectiveType) {
            document.documentElement.classList.add(`connection-${deviceInfo.connection.effectiveType}`);
        }
        
        // Initialize touch detection
        if (deviceInfo.capabilities.touch) {
            document.documentElement.classList.add('touch-device');
            this.setupTouchOptimizations();
        } else {
            document.documentElement.classList.add('pointer-device');
        }
        
        console.log('[DeviceGuard] Device context set up:', deviceInfo);
        return deviceInfo;
    }

    /**
     * Detect device type
     */
    detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const width = window.innerWidth;
        
        // Mobile detection
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
        
        if (isMobile && width <= 768) {
            return this.deviceCategories.MOBILE;
        } else if (isTablet || (width > 768 && width <= 1024)) {
            return this.deviceCategories.TABLET;
        } else if (width > 1024) {
            return this.deviceCategories.DESKTOP;
        }
        
        return this.deviceCategories.UNSUPPORTED;
    }

    /**
     * Set up touch optimizations for mobile devices
     */
    setupTouchOptimizations() {
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Improve touch scrolling
        document.addEventListener('touchmove', (event) => {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        }, { passive: false });
        
        // Add touch-specific CSS
        const style = document.createElement('style');
        style.textContent = `
            .touch-device button,
            .touch-device a,
            .touch-device .clickable {
                min-height: 44px;
                min-width: 44px;
            }
            .touch-device input,
            .touch-device select,
            .touch-device textarea {
                font-size: 16px; /* Prevent iOS zoom */
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Set up PWA installation detection and prompts
     */
    async setupPWAInstallation() {
        // Check if app is already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                            window.navigator.standalone ||
                            document.referrer.includes('android-app://');
        
        // Store installation state
        localStorage.setItem('mpesewa_pwa_installed', isStandalone);
        
        // Listen for app installation
        window.addEventListener('appinstalled', (event) => {
            console.log('[DeviceGuard] PWA installed successfully');
            localStorage.setItem('mpesewa_pwa_installed', 'true');
            
            // Track installation event
            this.trackPWAEvent('installed');
        });
        
        // Listen for beforeinstallprompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (event) => {
            console.log('[DeviceGuard] PWA installation available');
            event.preventDefault();
            deferredPrompt = event;
            
            // Store for later use
            localStorage.setItem('mpesewa_pwa_deferred_prompt', 'available');
            
            // Show install button if not in standalone mode
            if (!isStandalone) {
                this.showInstallPrompt();
            }
            
            this.trackPWAEvent('install_available');
        });
        
        return isStandalone;
    }

    /**
     * Show PWA installation prompt
     */
    showInstallPrompt() {
        // Check if we should show prompt (max 2 times)
        const promptCount = parseInt(localStorage.getItem('mpesewa_pwa_prompt_count') || '0');
        if (promptCount >= 2) {
            return;
        }
        
        // Create install button
        const installButton = document.createElement('button');
        installButton.id = 'pwa-install-button';
        installButton.className = 'pwa-install-btn';
        installButton.innerHTML = '📱 Install M-Pesewa App';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #003366;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
            z-index: 10000;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        `;
        
        installButton.onmouseenter = () => {
            installButton.style.transform = 'translateY(-2px)';
            installButton.style.boxShadow = '0 6px 16px rgba(0, 51, 102, 0.4)';
        };
        
        installButton.onmouseleave = () => {
            installButton.style.transform = 'translateY(0)';
            installButton.style.boxShadow = '0 4px 12px rgba(0, 51, 102, 0.3)';
        };
        
        installButton.onclick = async () => {
            try {
                // Trigger installation
                if (window.deferredPrompt) {
                    window.deferredPrompt.prompt();
                    const choiceResult = await window.deferredPrompt.userChoice;
                    
                    if (choiceResult.outcome === 'accepted') {
                        console.log('[DeviceGuard] User accepted PWA installation');
                        this.trackPWAEvent('install_accepted');
                    } else {
                        console.log('[DeviceGuard] User dismissed PWA installation');
                        this.trackPWAEvent('install_dismissed');
                    }
                    
                    window.deferredPrompt = null;
                    installButton.remove();
                }
            } catch (error) {
                console.error('[DeviceGuard] Installation failed:', error);
            }
        };
        
        // Add to document
        document.body.appendChild(installButton);
        
        // Increment prompt count
        localStorage.setItem('mpesewa_pwa_prompt_count', (promptCount + 1).toString());
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (installButton.parentNode) {
                installButton.remove();
            }
        }, 30000);
    }

    /**
     * Track PWA installation events
     */
    trackPWAEvent(eventType) {
        const events = JSON.parse(localStorage.getItem('mpesewa_pwa_events') || '[]');
        events.push({
            type: eventType,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform
        });
        localStorage.setItem('mpesewa_pwa_events', JSON.stringify(events));
    }

    /**
     * Handle device validation failure
     */
    handleDeviceFailure(error) {
        // Create error overlay
        const overlay = document.createElement('div');
        overlay.id = 'device-error-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #003366 0%, #001a33 100%);
            color: white;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        const icon = document.createElement('div');
        icon.innerHTML = '⚠️';
        icon.style.cssText = 'font-size: 64px; margin-bottom: 20px;';
        
        const title = document.createElement('h1');
        title.textContent = 'Device Compatibility Issue';
        title.style.cssText = 'font-size: 24px; margin-bottom: 10px; font-weight: bold;';
        
        const message = document.createElement('p');
        message.textContent = error.message || 'Your device does not meet the minimum requirements for M-Pesewa.';
        message.style.cssText = 'font-size: 16px; margin-bottom: 20px; max-width: 500px; line-height: 1.5;';
        
        const requirements = document.createElement('div');
        requirements.style.cssText = 'background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: left;';
        requirements.innerHTML = `
            <strong>Minimum Requirements:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Screen: ${this.minimumRequirements.screenWidth}×${this.minimumRequirements.screenHeight}px minimum</li>
                <li>Browser: Chrome 80+, Safari 14+, Firefox 75+</li>
                <li>JavaScript: ES2018+ required</li>
                <li>Storage: 50MB free space</li>
            </ul>
        `;
        
        const actions = document.createElement('div');
        actions.style.cssText = 'display: flex; gap: 10px; margin-top: 20px;';
        
        const reloadButton = document.createElement('button');
        reloadButton.textContent = 'Try Again';
        reloadButton.style.cssText = `
            background: #0099ff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        reloadButton.onclick = () => location.reload();
        
        const supportButton = document.createElement('a');
        supportButton.href = 'contact.html';
        supportButton.textContent = 'Contact Support';
        supportButton.style.cssText = `
            background: transparent;
            color: #0099ff;
            border: 2px solid #0099ff;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            font-weight: bold;
        `;
        
        actions.appendChild(reloadButton);
        actions.appendChild(supportButton);
        
        overlay.appendChild(icon);
        overlay.appendChild(title);
        overlay.appendChild(message);
        overlay.appendChild(requirements);
        overlay.appendChild(actions);
        
        document.body.innerHTML = '';
        document.body.appendChild(overlay);
    }

    /**
     * Check if device is mobile
     */
    isMobile() {
        const deviceInfo = JSON.parse(sessionStorage.getItem('mpesewa_device_info') || '{}');
        return deviceInfo.type === this.deviceCategories.MOBILE;
    }

    /**
     * Check if device is tablet
     */
    isTablet() {
        const deviceInfo = JSON.parse(sessionStorage.getItem('mpesewa_device_info') || '{}');
        return deviceInfo.type === this.deviceCategories.TABLET;
    }

    /**
     * Check if device is desktop
     */
    isDesktop() {
        const deviceInfo = JSON.parse(sessionStorage.getItem('mpesewa_device_info') || '{}');
        return deviceInfo.type === this.deviceCategories.DESKTOP;
    }

    /**
     * Check if PWA is installed
     */
    isPWAInstalled() {
        return localStorage.getItem('mpesewa_pwa_installed') === 'true' ||
               window.matchMedia('(display-mode: standalone)').matches;
    }

    /**
     * Get device information
     */
    getDeviceInfo() {
        return JSON.parse(sessionStorage.getItem('mpesewa_device_info') || '{}');
    }

    /**
     * Check if device has slow connection
     */
    hasSlowConnection() {
        if (!navigator.connection) return false;
        const conn = navigator.connection;
        return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
    }

    /**
     * Optimize for slow connections
     */
    optimizeForSlowConnection() {
        if (this.hasSlowConnection()) {
            // Disable animations
            document.documentElement.style.setProperty('--animation-duration', '0s');
            document.documentElement.style.setProperty('--transition-duration', '0s');
            
            // Lazy load images
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                if (img.getAttribute('data-src')) {
                    img.src = img.getAttribute('data-src');
                }
            });
            
            // Reduce polling intervals
            clearInterval(window.mpesewaPollingInterval);
            
            console.log('[DeviceGuard] Optimized for slow connection');
        }
    }

    /**
     * Request necessary device permissions
     */
    async requestPermissions() {
        const permissions = [];
        
        // Request notification permission for PWA
        if ('Notification' in window && Notification.permission === 'default') {
            const notificationPermission = await Notification.requestPermission();
            permissions.push({
                type: 'notifications',
                granted: notificationPermission === 'granted'
            });
        }
        
        // Request storage permission for PWA
        if ('storage' in navigator && 'persist' in navigator.storage) {
            const persisted = await navigator.storage.persist();
            permissions.push({
                type: 'storage_persistence',
                granted: persisted
            });
        }
        
        return permissions;
    }

    /**
     * Monitor device state changes
     */
    startMonitoring() {
        // Monitor connection changes
        if (navigator.connection) {
            navigator.connection.addEventListener('change', () => {
                this.optimizeForSlowConnection();
                this.trackConnectionChange();
            });
        }
        
        // Monitor storage changes
        window.addEventListener('storage', (event) => {
            if (event.key === 'mpesewa_pwa_installed') {
                console.log('[DeviceGuard] PWA installation state changed:', event.newValue);
            }
        });
        
        // Monitor online/offline status
        window.addEventListener('online', () => {
            console.log('[DeviceGuard] Device is online');
            document.documentElement.classList.remove('offline');
            document.documentElement.classList.add('online');
        });
        
        window.addEventListener('offline', () => {
            console.log('[DeviceGuard] Device is offline');
            document.documentElement.classList.remove('online');
            document.documentElement.classList.add('offline');
        });
        
        console.log('[DeviceGuard] Device monitoring started');
    }

    /**
     * Track connection changes
     */
    trackConnectionChange() {
        if (!navigator.connection) return;
        
        const conn = navigator.connection;
        const connectionEvents = JSON.parse(localStorage.getItem('mpesewa_connection_events') || '[]');
        
        connectionEvents.push({
            effectiveType: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 events
        if (connectionEvents.length > 100) {
            connectionEvents.shift();
        }
        
        localStorage.setItem('mpesewa_connection_events', JSON.stringify(connectionEvents));
    }

    /**
     * Get connection statistics
     */
    getConnectionStats() {
        const events = JSON.parse(localStorage.getItem('mpesewa_connection_events') || '[]');
        if (events.length === 0) return null;
        
        const stats = {
            totalEvents: events.length,
            averageDownlink: events.reduce((sum, e) => sum + (e.downlink || 0), 0) / events.length,
            averageRTT: events.reduce((sum, e) => sum + (e.rtt || 0), 0) / events.length,
            connectionTypes: {}
        };
        
        events.forEach(event => {
            const type = event.effectiveType || 'unknown';
            stats.connectionTypes[type] = (stats.connectionTypes[type] || 0) + 1;
        });
        
        return stats;
    }

    /**
     * Clean up device guard
     */
    cleanup() {
        // Remove event listeners
        if (navigator.connection) {
            navigator.connection.removeEventListener('change', this.optimizeForSlowConnection);
        }
        
        // Remove PWA install button if exists
        const installButton = document.getElementById('pwa-install-button');
        if (installButton) {
            installButton.remove();
        }
        
        console.log('[DeviceGuard] Cleaned up');
    }
}

// Create global instance
window.MPesewaDeviceGuard = new DeviceGuard();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.MPesewaDeviceGuard.initialize();
        window.MPesewaDeviceGuard.startMonitoring();
    } catch (error) {
        console.error('Failed to initialize device guard:', error);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceGuard;
}

/**
 * STRICT M-PESEWA DEVICE RULES ENFORCEMENT
 * 
 * 1. DEVICE CATEGORIZATION:
 *    - Mobile (≤768px): Touch-optimized, PWA-focused
 *    - Tablet (769-1024px): Hybrid interface
 *    - Desktop (>1024px): Full-featured dashboard
 * 
 * 2. PWA REQUIREMENTS:
 *    - Service Worker must be supported
 *    - Web App Manifest must be valid
 *    - Install prompt must be handled
 * 
 * 3. SECURITY REQUIREMENTS:
 *    - HTTPS required for production
 *    - Web Crypto API for financial data
 *    - Secure storage (IndexedDB/WebSQL)
 * 
 * 4. PERFORMANCE REQUIREMENTS:
 *    - Minimum 320x480 screen
 *    - Touch capability for mobile
 *    - 50MB free storage
 * 
 * 5. COUNTRY-SPECIFIC ADAPTATIONS:
 *    - Kenya: M-Pesa integration optimized
 *    - Ghana: Mobile money optimization
 *    - Nigeria: Bank transfer optimization
 *    - Tanzania: Tigo Pesa/Halopesa support
 *    - Uganda: MTN Mobile Money support
 * 
 * 6. HIERARCHY ENFORCEMENT:
 *    - Device type determines UI layout
 *    - Connection speed determines data loading
 *    - Storage availability determines caching
 * 
 * 7. FALLBACK STRATEGIES:
 *    - Slow connection: Reduced animations, lazy loading
 *    - Low storage: Aggressive cache cleaning
 *    - Old browser: Basic functionality mode
 */