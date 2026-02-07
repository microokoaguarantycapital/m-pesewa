/**
 * M-PESEWA ERROR BOUNDARY SYSTEM
 * Comprehensive error handling with country and role awareness
 * Strict hierarchy: Global → Countries → Groups → Lenders → Borrowers
 * Last Updated: 2024
 */

class MpesewaErrorBoundary {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
        this.recoveryStrategies = new Map();
        this.errorHandlers = new Map();
        this.countryContext = null;
        this.userRole = null;
        this.groupContext = null;
        
        // Error categories specific to M-Pesewa hierarchy
        this.errorCategories = {
            // Global Errors
            GLOBAL: {
                NETWORK_ERROR: 'GLOBAL_NETWORK_ERROR',
                AUTH_ERROR: 'GLOBAL_AUTH_ERROR',
                SESSION_ERROR: 'GLOBAL_SESSION_ERROR',
                CONFIG_ERROR: 'GLOBAL_CONFIG_ERROR'
            },
            
            // Country-Level Errors
            COUNTRY: {
                ISOLATION_VIOLATION: 'COUNTRY_ISOLATION_VIOLATION',
                CURRENCY_MISMATCH: 'COUNTRY_CURRENCY_MISMATCH',
                LEGAL_COMPLIANCE: 'COUNTRY_LEGAL_COMPLIANCE',
                COUNTRY_NOT_SUPPORTED: 'COUNTRY_NOT_SUPPORTED'
            },
            
            // Group-Level Errors
            GROUP: {
                MAX_MEMBERS_EXCEEDED: 'GROUP_MAX_MEMBERS_EXCEEDED',
                MIN_MEMBERS_NOT_MET: 'GROUP_MIN_MEMBERS_NOT_MET',
                INVITATION_REQUIRED: 'GROUP_INVITATION_REQUIRED',
                COUNTRY_MISMATCH: 'GROUP_COUNTRY_MISMATCH',
                MAX_GROUPS_PER_USER: 'GROUP_MAX_GROUPS_PER_USER'
            },
            
            // Lender-Level Errors
            LENDER: {
                SUBSCRIPTION_EXPIRED: 'LENDER_SUBSCRIPTION_EXPIRED',
                SUBSCRIPTION_REQUIRED: 'LENDER_SUBSCRIPTION_REQUIRED',
                MAX_LIMIT_EXCEEDED: 'LENDER_MAX_LIMIT_EXCEEDED',
                CROSS_GROUP_LENDING: 'LENDER_CROSS_GROUP_LENDING',
                LEDGER_LIMIT_EXCEEDED: 'LENDER_LEDGER_LIMIT_EXCEEDED'
            },
            
            // Borrower-Level Errors
            BORROWER: {
                BLACKLISTED: 'BORROWER_BLACKLISTED',
                MAX_GROUPS_REACHED: 'BORROWER_MAX_GROUPS_REACHED',
                LOW_RATING: 'BORROWER_LOW_RATING',
                ACTIVE_LOAN_EXISTS: 'BORROWER_ACTIVE_LOAN_EXISTS',
                DEFAULTED_LOAN: 'BORROWER_DEFAULTED_LOAN'
            },
            
            // Ledger-Level Errors
            LEDGER: {
                LOAN_DURATION_EXCEEDED: 'LEDGER_LOAN_DURATION_EXCEEDED',
                INTEREST_CALCULATION: 'LEDGER_INTEREST_CALCULATION',
                PENALTY_CALCULATION: 'LEDGER_PENALTY_CALCULATION',
                REPAYMENT_MISMATCH: 'LEDGER_REPAYMENT_MISMATCH'
            },
            
            // Subscription Errors
            SUBSCRIPTION: {
                PAYMENT_FAILED: 'SUBSCRIPTION_PAYMENT_FAILED',
                TIER_MISMATCH: 'SUBSCRIPTION_TIER_MISMATCH',
                EXPIRY_DATE_INVALID: 'SUBSCRIPTION_EXPIRY_DATE_INVALID'
            },
            
            // Loan Errors
            LOAN: {
                AMOUNT_EXCEEDS_LIMIT: 'LOAN_AMOUNT_EXCEEDS_LIMIT',
                DURATION_EXCEEDS_LIMIT: 'LOAN_DURATION_EXCEEDS_LIMIT',
                CATEGORY_NOT_SUPPORTED: 'LOAN_CATEGORY_NOT_SUPPORTED',
                GUARANTOR_MISSING: 'LOAN_GUARANTOR_MISSING'
            },
            
            // Payment Errors
            PAYMENT: {
                PROCESSING_FAILED: 'PAYMENT_PROCESSING_FAILED',
                GATEWAY_ERROR: 'PAYMENT_GATEWAY_ERROR',
                INSUFFICIENT_FUNDS: 'PAYMENT_INSUFFICIENT_FUNDS'
            },
            
            // Validation Errors
            VALIDATION: {
                REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
                INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
                DUPLICATE_ENTRY: 'VALIDATION_DUPLICATE_ENTRY',
                REFERRAL_INVALID: 'VALIDATION_REFERRAL_INVALID'
            }
        };
        
        // Initialize recovery strategies
        this.initializeRecoveryStrategies();
        
        // Set up global error handlers
        this.setupGlobalHandlers();
        
        // Initialize error boundary
        this.initialize();
    }

    initialize() {
        // Store initial context
        this.countryContext = localStorage.getItem('mpesewa_country');
        this.userRole = localStorage.getItem('mpesewa_role');
        this.groupContext = localStorage.getItem('mpesewa_group');
        
        // Log initialization
        console.info('M-Pesewa Error Boundary initialized with context:', {
            country: this.countryContext,
            role: this.userRole,
            group: this.groupContext
        });
    }

    setupGlobalHandlers() {
        // Window error handler
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError(event.reason, {
                type: 'UNHANDLED_PROMISE_REJECTION'
            });
        });

        // Network errors
        window.addEventListener('online', () => {
            this.handleRecovery('NETWORK_RECOVERY', 'Network connection restored');
        });

        window.addEventListener('offline', () => {
            this.handleError(
                this.errorCategories.GLOBAL.NETWORK_ERROR,
                'Network connection lost',
                { severity: 'HIGH' }
            );
        });

        // Service Worker errors
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'ERROR') {
                    this.handleServiceWorkerError(event.data.error);
                }
            });
        }
    }

    // Set context for error handling
    setContext(context) {
        if (context.country) {
            this.countryContext = context.country;
            localStorage.setItem('mpesewa_country', context.country);
        }
        
        if (context.role) {
            this.userRole = context.role;
            localStorage.setItem('mpesewa_role', context.role);
        }
        
        if (context.group) {
            this.groupContext = context.group;
            localStorage.setItem('mpesewa_group', context.group);
        }
        
        if (context.userId) {
            this.userId = context.userId;
        }
    }

    // Main error handling method
    handleError(category, message, details = {}, severity = 'MEDIUM') {
        const error = this.createErrorObject(category, message, details, severity);
        
        // Add to errors array
        this.errors.push(error);
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        
        // Persist critical errors
        if (severity === 'HIGH' || severity === 'CRITICAL') {
            this.persistError(error);
        }
        
        // Execute recovery strategy if available
        const recoveryStrategy = this.recoveryStrategies.get(category);
        if (recoveryStrategy) {
            recoveryStrategy(error);
        }
        
        // Execute custom handler if registered
        const customHandler = this.errorHandlers.get(category);
        if (customHandler) {
            customHandler(error);
        }
        
        // Log to console based on severity
        this.logError(error);
        
        // Show user notification for important errors
        if (severity !== 'LOW') {
            this.showUserNotification(error);
        }
        
        // For critical errors, trigger emergency protocols
        if (severity === 'CRITICAL') {
            this.triggerEmergencyProtocol(error);
        }
        
        return error;
    }

    createErrorObject(category, message, details, severity) {
        const timestamp = new Date().toISOString();
        const errorId = `err_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            id: errorId,
            timestamp: timestamp,
            category: category,
            message: message,
            details: details,
            severity: severity,
            context: {
                country: this.countryContext,
                role: this.userRole,
                group: this.groupContext,
                userId: this.userId,
                url: window.location.href,
                userAgent: navigator.userAgent,
                sessionId: localStorage.getItem('mpesewa_session_id')
            },
            stackTrace: new Error().stack
        };
    }

    // Country-specific error handling
    handleCountryError(errorType, message, countryCode, details = {}) {
        // Verify country is supported
        const supportedCountries = ['KE', 'UG', 'TZ', 'RW', 'CD', 'BI', 'NG', 'GH', 'SS', 'SO', 'ZA', 'ET'];
        
        if (!supportedCountries.includes(countryCode)) {
            return this.handleError(
                this.errorCategories.COUNTRY.COUNTRY_NOT_SUPPORTED,
                `Country ${countryCode} is not supported`,
                { countryCode, supportedCountries }
            );
        }
        
        // Check if current context matches
        if (this.countryContext && this.countryContext !== countryCode) {
            return this.handleError(
                this.errorCategories.COUNTRY.ISOLATION_VIOLATION,
                `Cross-country operation attempted: ${this.countryContext} → ${countryCode}`,
                { fromCountry: this.countryContext, toCountry: countryCode }
            );
        }
        
        return this.handleError(errorType, message, {
            countryCode,
            ...details
        });
    }

    // Group-specific error handling
    handleGroupError(errorType, message, groupId, details = {}) {
        // Validate group context
        if (this.groupContext && this.groupContext !== groupId) {
            return this.handleError(
                this.errorCategories.GROUP.COUNTRY_MISMATCH,
                `User not in group ${groupId}`,
                { currentGroup: this.groupContext, targetGroup: groupId }
            );
        }
        
        return this.handleError(errorType, message, {
            groupId,
            ...details
        });
    }

    // Lender-specific error handling
    handleLenderError(errorType, message, lenderId, details = {}) {
        // Check subscription status
        if (errorType === this.errorCategories.LENDER.SUBSCRIPTION_EXPIRED) {
            const expiryDate = details.expiryDate;
            const today = new Date();
            const expiry = new Date(expiryDate);
            
            // Subscription expires on 28th of each month
            if (expiry.getDate() !== 28) {
                expiry.setDate(28);
            }
            
            if (today > expiry) {
                return this.handleError(errorType, message, {
                    lenderId,
                    expiryDate,
                    today: today.toISOString(),
                    ...details
                }, 'HIGH');
            }
        }
        
        return this.handleError(errorType, message, {
            lenderId,
            ...details
        });
    }

    // Borrower-specific error handling
    handleBorrowerError(errorType, message, borrowerId, details = {}) {
        // Check blacklist status
        if (errorType === this.errorCategories.BORROWER.BLACKLISTED) {
            const blacklistInfo = details.blacklistInfo || {};
            
            return this.handleError(errorType, message, {
                borrowerId,
                blacklistedSince: blacklistInfo.since,
                amountOwed: blacklistInfo.amountOwed,
                daysOverdue: blacklistInfo.daysOverdue,
                ...details
            }, 'HIGH');
        }
        
        // Check rating for group access
        if (errorType === this.errorCategories.BORROWER.LOW_RATING) {
            const currentRating = details.currentRating || 0;
            const requiredRating = details.requiredRating || 4;
            
            if (currentRating < requiredRating) {
                return this.handleError(errorType, message, {
                    borrowerId,
                    currentRating,
                    requiredRating,
                    ...details
                });
            }
        }
        
        return this.handleError(errorType, message, {
            borrowerId,
            ...details
        });
    }

    // Loan-specific error handling
    handleLoanError(errorType, message, loanId, details = {}) {
        // Validate loan amount against tier limits
        if (errorType === this.errorCategories.LOAN.AMOUNT_EXCEEDS_LIMIT) {
            const amount = details.amount || 0;
            const tierLimit = details.tierLimit || 0;
            const currency = details.currency || 'KSh';
            
            if (amount > tierLimit) {
                return this.handleError(errorType, message, {
                    loanId,
                    amount,
                    tierLimit,
                    currency,
                    ...details
                });
            }
        }
        
        // Check loan duration
        if (errorType === this.errorCategories.LOAN.DURATION_EXCEEDS_LIMIT) {
            const duration = details.duration || 0;
            const maxDuration = details.maxDuration || 7;
            
            if (duration > maxDuration) {
                return this.handleError(errorType, message, {
                    loanId,
                    duration,
                    maxDuration,
                    ...details
                });
            }
        }
        
        return this.handleError(errorType, message, {
            loanId,
            ...details
        });
    }

    // Global error handler
    handleGlobalError(error, details = {}) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stackTrace = error instanceof Error ? error.stack : new Error().stack;
        
        return this.handleError(
            this.errorCategories.GLOBAL.NETWORK_ERROR,
            errorMessage,
            {
                originalError: error,
                stackTrace,
                ...details
            },
            'HIGH'
        );
    }

    // Service Worker error handling
    handleServiceWorkerError(error) {
        return this.handleError(
            'SERVICE_WORKER_ERROR',
            'Service Worker error occurred',
            {
                error: error,
                scope: navigator.serviceWorker.controller?.scriptURL
            },
            'MEDIUM'
        );
    }

    // Initialize recovery strategies
    initializeRecoveryStrategies() {
        // Network error recovery
        this.recoveryStrategies.set(this.errorCategories.GLOBAL.NETWORK_ERROR, (error) => {
            console.warn('Attempting network recovery...');
            
            // Check if online
            if (navigator.onLine) {
                // Retry failed operations
                this.retryFailedOperations();
            } else {
                // Switch to offline mode
                this.enableOfflineMode();
            }
        });

        // Subscription expired recovery
        this.recoveryStrategies.set(this.errorCategories.LENDER.SUBSCRIPTION_EXPIRED, (error) => {
            console.warn('Subscription expired, redirecting to renewal...');
            
            // Redirect to subscription renewal page
            setTimeout(() => {
                window.location.href = '/subscription/renew.html';
            }, 3000);
        });

        // Blacklisted borrower recovery
        this.recoveryStrategies.set(this.errorCategories.BORROWER.BLACKLISTED, (error) => {
            console.warn('Borrower is blacklisted');
            
            // Show repayment options
            this.showBlacklistRecoveryOptions(error.details);
        });

        // Country isolation violation recovery
        this.recoveryStrategies.set(this.errorCategories.COUNTRY.ISOLATION_VIOLATION, (error) => {
            console.warn('Country isolation violation detected');
            
            // Force logout and clear context
            this.clearUserContext();
            
            // Redirect to country selection
            setTimeout(() => {
                window.location.href = '/countries/index.html';
            }, 2000);
        });

        // Group max members recovery
        this.recoveryStrategies.set(this.errorCategories.GROUP.MAX_MEMBERS_EXCEEDED, (error) => {
            console.warn('Group is at maximum capacity');
            
            // Suggest creating new group
            this.showGroupCapacityWarning(error.details);
        });
    }

    // Register custom error handler
    registerHandler(category, handler) {
        this.errorHandlers.set(category, handler);
    }

    // Error logging
    logError(error) {
        const logLevels = {
            LOW: 'log',
            MEDIUM: 'warn',
            HIGH: 'error',
            CRITICAL: 'error'
        };
        
        const logMethod = logLevels[error.severity] || 'log';
        const prefix = `[${error.severity}] [${error.category}]`;
        
        console[logMethod](`${prefix} ${error.message}`, error);
    }

    // Show user notification
    showUserNotification(error) {
        // Don't show notifications for low severity errors
        if (error.severity === 'LOW') return;
        
        const notifications = {
            HIGH: {
                title: 'Important Notice',
                message: error.message,
                type: 'error',
                duration: 10000
            },
            MEDIUM: {
                title: 'Notice',
                message: error.message,
                type: 'warning',
                duration: 5000
            },
            CRITICAL: {
                title: 'Critical Error',
                message: 'A critical error occurred. Please contact support.',
                type: 'error',
                duration: 0 // Persistent until dismissed
            }
        };
        
        const notification = notifications[error.severity];
        if (notification) {
            this.createNotificationElement(notification);
        }
    }

    createNotificationElement(notification) {
        // Check if notification system exists
        if (window.showMpesewaNotification) {
            window.showMpesewaNotification(notification);
            return;
        }
        
        // Fallback notification
        const notificationId = 'mpesewa-error-notification-' + Date.now();
        const notificationEl = document.createElement('div');
        notificationEl.id = notificationId;
        notificationEl.className = `mpesewa-notification mpesewa-notification-${notification.type}`;
        notificationEl.innerHTML = `
            <div class="notification-header">
                <strong>${notification.title}</strong>
                <button onclick="document.getElementById('${notificationId}').remove()">&times;</button>
            </div>
            <div class="notification-body">${notification.message}</div>
        `;
        
        notificationEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            padding: 15px;
            background: ${notification.type === 'error' ? '#f8d7da' : '#fff3cd'};
            border: 1px solid ${notification.type === 'error' ? '#f5c6cb' : '#ffeaa7'};
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
        `;
        
        document.body.appendChild(notificationEl);
        
        // Auto-remove if not persistent
        if (notification.duration > 0) {
            setTimeout(() => {
                if (document.getElementById(notificationId)) {
                    document.getElementById(notificationId).remove();
                }
            }, notification.duration);
        }
    }

    // Emergency protocols for critical errors
    triggerEmergencyProtocol(error) {
        console.error('EMERGENCY PROTOCOL TRIGGERED:', error);
        
        // 1. Save current state
        this.saveEmergencyState();
        
        // 2. Notify platform admin
        this.notifyAdmin(error);
        
        // 3. Switch to safe mode
        this.enableSafeMode();
        
        // 4. Log emergency
        this.logEmergency(error);
    }

    saveEmergencyState() {
        const state = {
            url: window.location.href,
            user: this.userId,
            role: this.userRole,
            country: this.countryContext,
            group: this.groupContext,
            timestamp: new Date().toISOString(),
            errors: this.errors.slice(-10) // Last 10 errors
        };
        
        localStorage.setItem('mpesewa_emergency_state', JSON.stringify(state));
    }

    notifyAdmin(error) {
        // In production, this would send an alert to admin
        console.error('ADMIN ALERT:', error);
        
        // Store for admin dashboard
        const adminAlerts = JSON.parse(localStorage.getItem('mpesewa_admin_alerts') || '[]');
        adminAlerts.push({
            type: 'CRITICAL_ERROR',
            error: error,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_admin_alerts', JSON.stringify(adminAlerts));
    }

    enableSafeMode() {
        // Disable non-essential features
        document.body.classList.add('mpesewa-safe-mode');
        
        // Show safe mode banner
        const banner = document.createElement('div');
        banner.className = 'mpesewa-safe-mode-banner';
        banner.innerHTML = `
            <div style="padding: 10px; background: #dc3545; color: white; text-align: center;">
                <strong>SAFE MODE ACTIVE</strong>: Some features disabled due to system error.
                <a href="/support.html" style="color: white; text-decoration: underline; margin-left: 10px;">
                    Contact Support
                </a>
            </div>
        `;
        
        document.body.prepend(banner);
    }

    logEmergency(error) {
        const emergencies = JSON.parse(localStorage.getItem('mpesewa_emergencies') || '[]');
        emergencies.push({
            timestamp: new Date().toISOString(),
            error: error,
            context: {
                country: this.countryContext,
                role: this.userRole,
                group: this.groupContext
            }
        });
        
        localStorage.setItem('mpesewa_emergencies', JSON.stringify(emergencies));
    }

    // Recovery methods
    handleRecovery(type, message) {
        console.info(`[RECOVERY] ${type}: ${message}`);
        
        // Remove safe mode if active
        if (document.querySelector('.mpesewa-safe-mode-banner')) {
            document.querySelector('.mpesewa-safe-mode-banner').remove();
        }
        
        document.body.classList.remove('mpesewa-safe-mode');
        
        // Show recovery notification
        this.createNotificationElement({
            title: 'System Recovered',
            message: message,
            type: 'success',
            duration: 3000
        });
    }

    retryFailedOperations() {
        // Retry any failed operations stored in localStorage
        const failedOps = JSON.parse(localStorage.getItem('mpesewa_failed_operations') || '[]');
        
        if (failedOps.length > 0) {
            console.info(`Retrying ${failedOps.length} failed operations...`);
            
            // In a real app, you'd retry each operation
            // For now, just clear them
            localStorage.removeItem('mpesewa_failed_operations');
        }
    }

    enableOfflineMode() {
        document.body.classList.add('mpesewa-offline-mode');
        
        // Show offline banner
        const banner = document.createElement('div');
        banner.className = 'mpesewa-offline-banner';
        banner.innerHTML = `
            <div style="padding: 10px; background: #ffc107; color: #000; text-align: center;">
                <strong>OFFLINE MODE</strong>: Working offline. Changes will sync when connection is restored.
            </div>
        `;
        
        document.body.prepend(banner);
    }

    showBlacklistRecoveryOptions(details) {
        // Create recovery modal
        const modal = document.createElement('div');
        modal.className = 'mpesewa-blacklist-recovery-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;">
                    <h3 style="color: #dc3545; margin-bottom: 20px;">Account Restricted</h3>
                    <p>Your account has been blacklisted due to overdue payments.</p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <strong>Amount Owed:</strong> ${details.amountOwed || 0}<br>
                        <strong>Days Overdue:</strong> ${details.daysOverdue || 0}
                    </div>
                    <p>To remove the blacklist, please:</p>
                    <ol>
                        <li>Repay the full amount (principal + interest + penalties)</li>
                        <li>Contact platform admin for verification</li>
                        <li>Wait for admin approval</li>
                    </ol>
                    <div style="margin-top: 20px; text-align: right;">
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 8px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; margin-right: 10px;">
                            Close
                        </button>
                        <a href="/support.html" style="padding: 8px 20px; background: #003366; color: white; text-decoration: none; border-radius: 5px;">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showGroupCapacityWarning(details) {
        // Show group capacity warning
        this.createNotificationElement({
            title: 'Group Full',
            message: `Group ${details.groupId} has reached maximum capacity (${details.maxMembers} members). Please create a new group or join another.`,
            type: 'warning',
            duration: 8000
        });
    }

    clearUserContext() {
        // Clear all user context
        localStorage.removeItem('mpesewa_country');
        localStorage.removeItem('mpesewa_role');
        localStorage.removeItem('mpesewa_group');
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_session_id');
        
        this.countryContext = null;
        this.userRole = null;
        this.groupContext = null;
        this.userId = null;
    }

    // Persist error to localStorage
    persistError(error) {
        try {
            const persistedErrors = JSON.parse(localStorage.getItem('mpesewa_persisted_errors') || '[]');
            persistedErrors.push(error);
            
            // Keep only last 50 errors
            if (persistedErrors.length > 50) {
                persistedErrors.shift();
            }
            
            localStorage.setItem('mpesewa_persisted_errors', JSON.stringify(persistedErrors));
        } catch (e) {
            console.error('Failed to persist error:', e);
        }
    }

    // Get error history
    getErrorHistory(limit = 20) {
        return this.errors.slice(-limit);
    }

    // Get persisted errors
    getPersistedErrors() {
        try {
            return JSON.parse(localStorage.getItem('mpesewa_persisted_errors') || '[]');
        } catch (e) {
            return [];
        }
    }

    // Clear errors
    clearErrors() {
        this.errors = [];
        localStorage.removeItem('mpesewa_persisted_errors');
    }

    // Export errors for debugging
    exportErrors(format = 'json') {
        const data = {
            errors: this.errors,
            persistedErrors: this.getPersistedErrors(),
            context: {
                country: this.countryContext,
                role: this.userRole,
                group: this.groupContext,
                userId: this.userId
            },
            timestamp: new Date().toISOString()
        };
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        }
        
        return data;
    }

    // Check if user can perform action based on error history
    canPerformAction(action, userId) {
        // Check for recent critical errors
        const recentCriticalErrors = this.errors.filter(error => 
            error.severity === 'CRITICAL' && 
            Date.now() - new Date(error.timestamp).getTime() < 3600000 // Last hour
        );
        
        if (recentCriticalErrors.length > 3) {
            return {
                allowed: false,
                reason: 'Too many critical errors in the last hour',
                errors: recentCriticalErrors.length
            };
        }
        
        // Check for user-specific blacklist
        const userErrors = this.errors.filter(error => 
            error.context.userId === userId &&
            Date.now() - new Date(error.timestamp).getTime() < 86400000 // Last 24 hours
        );
        
        if (userErrors.length > 10) {
            return {
                allowed: false,
                reason: 'Excessive errors for this user',
                errors: userErrors.length
            };
        }
        
        return { allowed: true };
    }

    // Cleanup
    cleanup() {
        // Remove event listeners
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handleGlobalError);
        
        // Clear data
        this.errors = [];
        this.errorHandlers.clear();
        
        console.info('Error Boundary cleaned up');
    }
}

// Singleton instance
let errorBoundaryInstance = null;

export function getErrorBoundary() {
    if (!errorBoundaryInstance) {
        errorBoundaryInstance = new MpesewaErrorBoundary();
    }
    return errorBoundaryInstance;
}

// Convenience functions for hierarchy-specific errors
export function handleCountryError(errorType, message, countryCode, details) {
    return getErrorBoundary().handleCountryError(errorType, message, countryCode, details);
}

export function handleGroupError(errorType, message, groupId, details) {
    return getErrorBoundary().handleGroupError(errorType, message, groupId, details);
}

export function handleLenderError(errorType, message, lenderId, details) {
    return getErrorBoundary().handleLenderError(errorType, message, lenderId, details);
}

export function handleBorrowerError(errorType, message, borrowerId, details) {
    return getErrorBoundary().handleBorrowerError(errorType, message, borrowerId, details);
}

export function handleLoanError(errorType, message, loanId, details) {
    return getErrorBoundary().handleLoanError(errorType, message, loanId, details);
}

// Export error categories for use in other modules
export const ErrorCategories = new MpesewaErrorBoundary().errorCategories;

export default getErrorBoundary();