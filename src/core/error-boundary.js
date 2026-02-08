/**
 * M-PESEWA ERROR BOUNDARY SYSTEM
 * Prevents white screen of death and logs all errors for fintech compliance
 */

class MpesewaErrorBoundary {
    constructor() {
        this.errorState = {
            hasError: false,
            error: null,
            errorInfo: null,
            timestamp: null
        };
        
        this.errorQueue = [];
        this.maxQueueSize = 100;
        
        // Initialize error handlers
        this.initGlobalErrorHandlers();
        this.initUnhandledRejectionHandler();
        this.initNetworkErrorHandler();
    }
    
    initGlobalErrorHandlers() {
        // Window error handler
        window.addEventListener('error', (event) => {
            this.handleError(event.error || new Error(event.message), {
                type: 'window_error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
        
        // Console error interceptor
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.logErrorToQueue(new Error(args[0]), { type: 'console_error', args });
            originalConsoleError.apply(console, args);
        };
        
        // Console warn interceptor for important warnings
        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
            // Only intercept warnings that might indicate serious issues
            if (args[0] && typeof args[0] === 'string') {
                const warningText = args[0].toLowerCase();
                if (warningText.includes('deprecated') || 
                    warningText.includes('security') || 
                    warningText.includes('violation') ||
                    warningText.includes('access denied')) {
                    this.logErrorToQueue(new Error(`Warning: ${args[0]}`), { type: 'console_warning', args });
                }
            }
            originalConsoleWarn.apply(console, args);
        };
    }
    
    initUnhandledRejectionHandler() {
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(
                event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
                { type: 'unhandled_rejection', promise: event.promise }
            );
        });
    }
    
    initNetworkErrorHandler() {
        // Intercept fetch errors
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                
                // Log failed requests
                if (!response.ok) {
                    this.logErrorToQueue(new Error(`HTTP ${response.status}: ${response.statusText}`), {
                        type: 'network_error',
                        url: args[0],
                        status: response.status,
                        statusText: response.statusText
                    });
                }
                
                return response;
            } catch (error) {
                this.handleError(error, {
                    type: 'network_fetch_error',
                    url: args[0],
                    method: args[1]?.method || 'GET'
                });
                throw error;
            }
        };
    }
    
    handleError(error, errorInfo = {}) {
        // Don't handle errors in production if they're already being reported
        if (this.shouldIgnoreError(error)) {
            return;
        }
        
        // Set error state
        this.errorState = {
            hasError: true,
            error: error,
            errorInfo: {
                ...errorInfo,
                stack: error.stack,
                message: error.message,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString()
            },
            timestamp: new Date()
        };
        
        // Log to queue
        this.logErrorToQueue(error, errorInfo);
        
        // Report to telemetry
        this.reportError(error, errorInfo);
        
        // Show user-friendly error UI
        this.showErrorUI();
        
        // Dispatch error event
        window.dispatchEvent(new CustomEvent('mpesewa:error', {
            detail: { error, errorInfo }
        }));
    }
    
    shouldIgnoreError(error) {
        // Ignore certain errors that are not critical
        const ignoredErrors = [
            'ResizeObserver loop limit exceeded',
            'Script error.',
            'NetworkError when attempting to fetch resource',
            'Failed to fetch'
        ];
        
        return ignoredErrors.some(ignored => 
            error.message && error.message.includes(ignored)
        );
    }
    
    logErrorToQueue(error, errorInfo) {
        const errorEntry = {
            id: this.generateErrorId(),
            timestamp: new Date().toISOString(),
            error: {
                message: error.message,
                name: error.name,
                stack: error.stack
            },
            context: {
                url: window.location.href,
                userAgent: navigator.userAgent,
                ...errorInfo
            },
            user: this.getCurrentUserInfo(),
            country: localStorage.getItem('mpesewa_country'),
            group: localStorage.getItem('mpesewa_current_group')
        };
        
        // Add to queue
        this.errorQueue.unshift(errorEntry);
        
        // Maintain queue size
        if (this.errorQueue.length > this.maxQueueSize) {
            this.errorQueue.pop();
        }
        
        // Save to localStorage for persistence
        this.persistErrorQueue();
    }
    
    persistErrorQueue() {
        try {
            localStorage.setItem('mpesewa_error_logs', JSON.stringify(this.errorQueue.slice(0, 50)));
        } catch (e) {
            // localStorage might be full
            console.warn('Could not persist error logs:', e);
        }
    }
    
    generateErrorId() {
        return 'err_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getCurrentUserInfo() {
        try {
            const user = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
            return {
                id: user.id || 'anonymous',
                roles: user.roles || [],
                email: user.email || 'unknown'
            };
        } catch (e) {
            return { id: 'anonymous', roles: [], email: 'unknown' };
        }
    }
    
    reportError(error, errorInfo) {
        // In a real app, this would send to error reporting service
        // For now, we'll log to console and localStorage
        
        const report = {
            platform: 'm-pesewa',
            version: '1.0.0',
            environment: this.getEnvironment(),
            error: {
                message: error.message,
                stack: error.stack
            },
            context: errorInfo,
            timestamp: new Date().toISOString()
        };
        
        // Send to console in development
        if (this.isDevelopment()) {
            console.group('M-Pesewa Error Report');
            console.error('Error:', error);
            console.log('Context:', errorInfo);
            console.log('Report:', report);
            console.groupEnd();
        }
        
        // Store for admin review
        this.storeErrorReport(report);
    }
    
    getEnvironment() {
        const hostname = window.location.hostname;
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            return 'development';
        } else if (hostname.includes('staging') || hostname.includes('test')) {
            return 'staging';
        } else {
            return 'production';
        }
    }
    
    isDevelopment() {
        return this.getEnvironment() === 'development';
    }
    
    storeErrorReport(report) {
        try {
            const existingReports = JSON.parse(localStorage.getItem('mpesewa_error_reports') || '[]');
            existingReports.unshift(report);
            
            // Keep only last 100 reports
            if (existingReports.length > 100) {
                existingReports.pop();
            }
            
            localStorage.setItem('mpesewa_error_reports', JSON.stringify(existingReports));
        } catch (e) {
            // Ignore storage errors
        }
    }
    
    showErrorUI() {
        // Don't show error UI for minor errors
        if (!this.isCriticalError(this.errorState.error)) {
            return;
        }
        
        // Create error overlay if not exists
        let errorOverlay = document.getElementById('mpesewa-error-overlay');
        if (!errorOverlay) {
            errorOverlay = document.createElement('div');
            errorOverlay.id = 'mpesewa-error-overlay';
            errorOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 51, 102, 0.95);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
            `;
            
            const errorContent = document.createElement('div');
            errorContent.style.cssText = `
                max-width: 500px;
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            `;
            
            errorContent.innerHTML = `
                <h2 style="color: #fff; margin-bottom: 20px;">⚠️ System Error</h2>
                <p style="margin-bottom: 20px; line-height: 1.5;">
                    We're sorry, but M-Pesewa encountered an unexpected error. 
                    Our team has been notified and is working to fix it.
                </p>
                <p style="margin-bottom: 30px; font-size: 14px; opacity: 0.8;">
                    Error ID: <span id="error-id">${this.errorState.errorInfo?.timestamp || Date.now()}</span>
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="reload-btn" style="
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Reload Application</button>
                    <button id="report-btn" style="
                        background: transparent;
                        color: white;
                        border: 1px solid white;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Report Error</button>
                </div>
                <div style="margin-top: 20px; font-size: 12px; opacity: 0.6;">
                    If the problem persists, please contact support at support@mpesewa.com
                </div>
            `;
            
            errorOverlay.appendChild(errorContent);
            document.body.appendChild(errorOverlay);
            
            // Add event listeners
            document.getElementById('reload-btn').addEventListener('click', () => {
                window.location.reload();
            });
            
            document.getElementById('report-btn').addEventListener('click', () => {
                this.showErrorDetails();
            });
        }
    }
    
    isCriticalError(error) {
        // Determine if error is critical enough to show UI
        const nonCriticalErrors = [
            'NetworkError',
            'TypeError',
            'ReferenceError'
        ];
        
        return !nonCriticalErrors.some(type => error.name === type);
    }
    
    showErrorDetails() {
        // Toggle error details for debugging
        const details = document.createElement('div');
        details.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            text-align: left;
            font-family: monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        `;
        
        details.textContent = JSON.stringify({
            message: this.errorState.error?.message,
            stack: this.errorState.error?.stack,
            url: window.location.href,
            timestamp: new Date().toISOString()
        }, null, 2);
        
        const overlay = document.getElementById('mpesewa-error-overlay');
        const existingDetails = overlay.querySelector('.error-details');
        
        if (existingDetails) {
            existingDetails.remove();
        } else {
            overlay.querySelector('div').appendChild(details);
            details.classList.add('error-details');
        }
    }
    
    clearError() {
        this.errorState = {
            hasError: false,
            error: null,
            errorInfo: null,
            timestamp: null
        };
        
        // Remove error overlay if exists
        const errorOverlay = document.getElementById('mpesewa-error-overlay');
        if (errorOverlay) {
            errorOverlay.remove();
        }
    }
    
    getErrorLogs(limit = 50) {
        return this.errorQueue.slice(0, limit);
    }
    
    getErrorStats() {
        const errorsByType = {};
        const errorsByHour = {};
        
        this.errorQueue.forEach(error => {
            // Count by type
            const type = error.context.type || 'unknown';
            errorsByType[type] = (errorsByType[type] || 0) + 1;
            
            // Count by hour
            const hour = new Date(error.timestamp).getHours();
            errorsByHour[hour] = (errorsByHour[hour] || 0) + 1;
        });
        
        return {
            totalErrors: this.errorQueue.length,
            errorsByType,
            errorsByHour,
            lastError: this.errorQueue[0],
            errorRate: this.calculateErrorRate()
        };
    }
    
    calculateErrorRate() {
        if (this.errorQueue.length < 2) return 0;
        
        const firstError = new Date(this.errorQueue[this.errorQueue.length - 1].timestamp);
        const lastError = new Date(this.errorQueue[0].timestamp);
        const hours = (lastError - firstError) / (1000 * 60 * 60);
        
        return hours > 0 ? this.errorQueue.length / hours : 0;
    }
    
    // Component error boundary for React-like components
    static withErrorBoundary(WrappedComponent) {
        return class ErrorBoundary extends HTMLElement {
            constructor() {
                super();
                this.state = { hasError: false };
                this.errorBoundary = new MpesewaErrorBoundary();
            }
            
            connectedCallback() {
                try {
                    this.render();
                } catch (error) {
                    this.errorBoundary.handleError(error, {
                        type: 'component_error',
                        component: WrappedComponent.name,
                        element: this.tagName
                    });
                    this.state.hasError = true;
                    this.renderError();
                }
            }
            
            render() {
                // Implementation depends on component system
                // This is a placeholder for actual component rendering
            }
            
            renderError() {
                this.innerHTML = `
                    <div style="
                        padding: 20px;
                        background: #f8f9fa;
                        border: 1px solid #dc3545;
                        border-radius: 5px;
                        color: #721c24;
                    ">
                        <strong>Component Error</strong>
                        <p>This component failed to load. Please try refreshing the page.</p>
                    </div>
                `;
            }
        };
    }
}

// Create global instance
window.mpesewaErrorBoundary = new MpesewaErrorBoundary();

// Export for module systems
export default MpesewaErrorBoundary;