/**
 * M-PESEWA LOGGER SYSTEM
 * Comprehensive logging with country and role context
 * Last Updated: 2024
 */

class MpesewaLogger {
    constructor() {
        this.logLevels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3,
            TRACE: 4
        };
        
        this.currentLogLevel = this.logLevels.INFO;
        this.logHistory = [];
        this.maxHistorySize = 1000;
        
        // Context for all logs
        this.context = {
            app: 'M-Pesewa',
            version: '1.0.0',
            environment: this.getEnvironment(),
            sessionId: this.generateSessionId()
        };
        
        // Enable console logging by default
        this.consoleEnabled = true;
        
        // Enable remote logging in production
        this.remoteLoggingEnabled = this.isProduction();
        this.remoteEndpoint = '/api/logs';
        
        // Audit trail for financial transactions
        this.auditTrail = [];
        
        // Initialize
        this.initialize();
    }

    initialize() {
        // Capture global errors
        window.addEventListener('error', (event) => {
            this.error('Global Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.error('Unhandled Promise Rejection', {
                reason: event.reason
            });
        });

        // Log app initialization
        this.info('Logger initialized', this.context);
    }

    // Set user context for all subsequent logs
    setUserContext(user) {
        this.context.user = {
            id: user.id,
            role: user.role,
            country: user.country,
            groups: user.groups,
            subscription: user.subscription
        };
        
        this.info('User context set', { userId: user.id, role: user.role });
    }

    // Set transaction context
    setTransactionContext(transaction) {
        this.context.transaction = {
            id: transaction.id,
            type: transaction.type,
            amount: transaction.amount,
            currency: transaction.currency,
            parties: transaction.parties
        };
    }

    // Clear user context
    clearUserContext() {
        delete this.context.user;
        this.info('User context cleared');
    }

    // Set log level
    setLogLevel(level) {
        if (typeof level === 'string') {
            level = this.logLevels[level.toUpperCase()];
        }
        
        if (level !== undefined) {
            this.currentLogLevel = level;
            this.info(`Log level changed to ${this.getLevelName(level)}`);
        }
    }

    getLevelName(level) {
        for (const [name, value] of Object.entries(this.logLevels)) {
            if (value === level) return name;
        }
        return 'UNKNOWN';
    }

    // Core logging methods with country and role context
    error(message, data = {}, metadata = {}) {
        this.log('ERROR', message, data, metadata);
    }

    warn(message, data = {}, metadata = {}) {
        this.log('WARN', message, data, metadata);
    }

    info(message, data = {}, metadata = {}) {
        this.log('INFO', message, data, metadata);
    }

    debug(message, data = {}, metadata = {}) {
        this.log('DEBUG', message, data, metadata);
    }

    trace(message, data = {}, metadata = {}) {
        this.log('TRACE', message, data, metadata);
    }

    // Audit log for financial transactions
    audit(action, details, userContext) {
        const auditLog = {
            timestamp: new Date().toISOString(),
            action: action,
            details: details,
            user: userContext || this.context.user,
            ip: this.getClientIP(),
            userAgent: navigator.userAgent
        };

        this.auditTrail.push(auditLog);
        
        // Keep audit trail manageable
        if (this.auditTrail.length > 5000) {
            this.auditTrail = this.auditTrail.slice(-5000);
        }

        // Log to console
        if (this.consoleEnabled) {
            console.log(`[AUDIT] ${action}`, auditLog);
        }

        // Send to remote if enabled
        if (this.remoteLoggingEnabled) {
            this.sendRemoteLog('AUDIT', action, auditLog);
        }

        return auditLog;
    }

    // Financial transaction log
    transaction(type, amount, currency, from, to, details = {}) {
        const transactionLog = {
            timestamp: new Date().toISOString(),
            type: type,
            amount: amount,
            currency: currency,
            from: from,
            to: to,
            details: details,
            country: this.context.user?.country,
            userAgent: navigator.userAgent,
            sessionId: this.context.sessionId
        };

        this.log('INFO', `Transaction: ${type}`, transactionLog);
        
        // Add to audit trail
        this.audit(`TRANSACTION_${type.toUpperCase()}`, transactionLog);
        
        return transactionLog;
    }

    // Loan-specific logging
    loan(action, loanId, amount, borrowerId, lenderId, details = {}) {
        const loanLog = {
            timestamp: new Date().toISOString(),
            action: action,
            loanId: loanId,
            amount: amount,
            borrowerId: borrowerId,
            lenderId: lenderId,
            country: this.context.user?.country,
            groupId: details.groupId,
            interestRate: details.interestRate || 0.10,
            repaymentPeriod: details.repaymentPeriod || 7,
            details: details
        };

        this.log('INFO', `Loan ${action}`, loanLog);
        this.audit(`LOAN_${action.toUpperCase()}`, loanLog);
        
        return loanLog;
    }

    // Subscription logging
    subscription(action, userId, tier, amount, details = {}) {
        const subscriptionLog = {
            timestamp: new Date().toISOString(),
            action: action,
            userId: userId,
            tier: tier,
            amount: amount,
            expiryDay: 28, // 28th of each month
            details: details,
            country: this.context.user?.country
        };

        this.log('INFO', `Subscription ${action}`, subscriptionLog);
        this.audit(`SUBSCRIPTION_${action.toUpperCase()}`, subscriptionLog);
        
        return subscriptionLog;
    }

    // Group activity logging
    group(action, groupId, details = {}) {
        const groupLog = {
            timestamp: new Date().toISOString(),
            action: action,
            groupId: groupId,
            country: this.context.user?.country,
            adminId: details.adminId,
            memberCount: details.memberCount,
            details: details
        };

        this.log('INFO', `Group ${action}`, groupLog);
        this.audit(`GROUP_${action.toUpperCase()}`, groupLog);
        
        return groupLog;
    }

    // Country isolation violation attempt
    countryViolationAttempt(attempt, userContext, targetContext) {
        const violationLog = {
            timestamp: new Date().toISOString(),
            type: 'COUNTRY_ISOLATION_VIOLATION_ATTEMPT',
            attempt: attempt,
            user: userContext,
            target: targetContext,
            ip: this.getClientIP(),
            userAgent: navigator.userAgent,
            sessionId: this.context.sessionId
        };

        this.error('Country isolation violation attempt', violationLog);
        this.audit('COUNTRY_VIOLATION_ATTEMPT', violationLog);
        
        // Send immediate alert for security
        this.sendSecurityAlert(violationLog);
        
        return violationLog;
    }

    // Blacklist activity
    blacklist(action, userId, reason, adminId = null) {
        const blacklistLog = {
            timestamp: new Date().toISOString(),
            action: action,
            userId: userId,
            reason: reason,
            adminId: adminId,
            country: this.context.user?.country
        };

        this.log('WARN', `Blacklist ${action}`, blacklistLog);
        this.audit(`BLACKLIST_${action.toUpperCase()}`, blacklistLog);
        
        return blacklistLog;
    }

    // Private logging implementation
    log(level, message, data = {}, metadata = {}) {
        const levelValue = this.logLevels[level];
        
        if (levelValue > this.currentLogLevel) {
            return;
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level,
            message: message,
            data: this.sanitizeData(data),
            metadata: metadata,
            context: { ...this.context },
            stackTrace: level === 'ERROR' ? new Error().stack : undefined
        };

        // Add to history
        this.logHistory.push(logEntry);
        if (this.logHistory.length > this.maxHistorySize) {
            this.logHistory.shift();
        }

        // Console output
        if (this.consoleEnabled) {
            this.consoleLog(level, logEntry);
        }

        // Remote logging
        if (this.remoteLoggingEnabled && levelValue <= this.logLevels.WARN) {
            this.sendRemoteLog(level, message, logEntry);
        }

        // Persist important logs
        if (levelValue <= this.logLevels.WARN) {
            this.persistLog(logEntry);
        }

        return logEntry;
    }

    // Console output with colors
    consoleLog(level, entry) {
        const colors = {
            ERROR: 'color: #dc3545; font-weight: bold;',
            WARN: 'color: #ffc107; font-weight: bold;',
            INFO: 'color: #28a745;',
            DEBUG: 'color: #6c757d;',
            TRACE: 'color: #adb5bd;',
            AUDIT: 'color: #6610f2; font-weight: bold;'
        };

        const style = colors[level] || 'color: #000;';
        const timestamp = entry.timestamp.split('T')[1].split('.')[0];
        
        console.log(
            `%c[${timestamp}] [${level}] ${entry.message}`,
            style,
            entry.data
        );

        if (entry.stackTrace && level === 'ERROR') {
            console.log('%cStack Trace:', 'color: #6c757d;', entry.stackTrace);
        }
    }

    // Sanitize sensitive data
    sanitizeData(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }

        const sensitiveFields = [
            'password', 'token', 'secret', 'key', 'pin', 
            'cvv', 'ssn', 'creditCard', 'bankAccount'
        ];

        const sanitized = { ...data };
        
        for (const field of sensitiveFields) {
            if (sanitized[field] !== undefined) {
                sanitized[field] = '[REDACTED]';
            }
            
            // Check nested objects
            for (const key in sanitized) {
                if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
                    sanitized[key] = this.sanitizeData(sanitized[key]);
                }
            }
        }

        return sanitized;
    }

    // Send log to remote server
    async sendRemoteLog(level, message, data) {
        try {
            const payload = {
                level: level,
                message: message,
                data: data,
                timestamp: new Date().toISOString()
            };

            if (navigator.sendBeacon) {
                navigator.sendBeacon(this.remoteEndpoint, JSON.stringify(payload));
            } else {
                await fetch(this.remoteEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload),
                    keepalive: true
                });
            }
        } catch (error) {
            // Don't log remote logging errors to avoid infinite loops
            console.error('Remote logging failed:', error);
        }
    }

    // Send security alert
    sendSecurityAlert(logEntry) {
        // In production, this would send an email/SMS/notification
        console.warn('SECURITY ALERT:', logEntry);
        
        // Store in security log
        const securityLogs = JSON.parse(localStorage.getItem('mpesewa_security_logs') || '[]');
        securityLogs.push(logEntry);
        
        if (securityLogs.length > 100) {
            securityLogs.shift();
        }
        
        localStorage.setItem('mpesewa_security_logs', JSON.stringify(securityLogs));
    }

    // Persist log to localStorage
    persistLog(logEntry) {
        try {
            const persistedLogs = JSON.parse(localStorage.getItem('mpesewa_persisted_logs') || '[]');
            persistedLogs.push(logEntry);
            
            // Keep only last 100 logs
            if (persistedLogs.length > 100) {
                persistedLogs.shift();
            }
            
            localStorage.setItem('mpesewa_persisted_logs', JSON.stringify(persistedLogs));
        } catch (error) {
            console.error('Failed to persist log:', error);
        }
    }

    // Get logs for debugging
    getLogs(level = null, limit = 50) {
        let logs = this.logHistory;
        
        if (level) {
            const levelValue = this.logLevels[level];
            logs = logs.filter(log => this.logLevels[log.level] <= levelValue);
        }
        
        return logs.slice(-limit);
    }

    // Get audit trail
    getAuditTrail(limit = 100) {
        return this.auditTrail.slice(-limit);
    }

    // Export logs for support/debugging
    exportLogs(format = 'json') {
        const data = {
            logs: this.getLogs(),
            auditTrail: this.getAuditTrail(),
            context: this.context,
            timestamp: new Date().toISOString()
        };

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'text') {
            return this.formatLogsAsText(data);
        }
        
        return data;
    }

    formatLogsAsText(data) {
        let text = 'M-PESEWA LOG EXPORT\n';
        text += `Generated: ${new Date().toISOString()}\n`;
        text += `Session: ${this.context.sessionId}\n`;
        text += '='.repeat(80) + '\n\n';
        
        text += 'LOGS:\n';
        text += '-'.repeat(80) + '\n';
        data.logs.forEach(log => {
            text += `[${log.timestamp}] [${log.level}] ${log.message}\n`;
            if (log.data && Object.keys(log.data).length > 0) {
                text += `  Data: ${JSON.stringify(log.data)}\n`;
            }
            text += '\n';
        });
        
        text += '\nAUDIT TRAIL:\n';
        text += '-'.repeat(80) + '\n';
        data.auditTrail.forEach(audit => {
            text += `[${audit.timestamp}] ${audit.action}\n`;
            if (audit.details) {
                text += `  Details: ${JSON.stringify(audit.details)}\n`;
            }
            text += '\n';
        });
        
        return text;
    }

    // Utility methods
    getEnvironment() {
        return window.location.hostname === 'localhost' ? 'development' :
               window.location.hostname.includes('test') ? 'staging' : 'production';
    }

    isProduction() {
        return this.getEnvironment() === 'production';
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + 
               '_' + Date.now().toString(36);
    }

    getClientIP() {
        // This is a simplified version
        // In a real app, you'd get this from your backend
        return 'client-ip-not-available-in-frontend';
    }

    // Performance monitoring
    startTimer(label) {
        const timerKey = `timer_${label}`;
        performance.mark(`${timerKey}_start`);
        return label;
    }

    endTimer(label) {
        const timerKey = `timer_${label}`;
        performance.mark(`${timerKey}_end`);
        
        const measure = performance.measure(
            `${timerKey}_measure`,
            `${timerKey}_start`,
            `${timerKey}_end`
        );
        
        this.debug(`Timer: ${label}`, {
            duration: measure.duration,
            label: label
        });
        
        performance.clearMarks(`${timerKey}_start`);
        performance.clearMarks(`${timerKey}_end`);
        performance.clearMeasures(`${timerKey}_measure`);
        
        return measure.duration;
    }

    // Cleanup
    cleanup() {
        this.logHistory = [];
        this.auditTrail = [];
        this.info('Logger cleaned up');
    }
}

// Singleton instance
let loggerInstance = null;

export function getLogger() {
    if (!loggerInstance) {
        loggerInstance = new MpesewaLogger();
    }
    return loggerInstance;
}

// Convenience functions
export function logError(message, data) {
    return getLogger().error(message, data);
}

export function logWarn(message, data) {
    return getLogger().warn(message, data);
}

export function logInfo(message, data) {
    return getLogger().info(message, data);
}

export function logDebug(message, data) {
    return getLogger().debug(message, data);
}

export function logAudit(action, details, userContext) {
    return getLogger().audit(action, details, userContext);
}

export function logTransaction(type, amount, currency, from, to, details) {
    return getLogger().transaction(type, amount, currency, from, to, details);
}

export function logLoan(action, loanId, amount, borrowerId, lenderId, details) {
    return getLogger().loan(action, loanId, amount, borrowerId, lenderId, details);
}

export function logSubscription(action, userId, tier, amount, details) {
    return getLogger().subscription(action, userId, tier, amount, details);
}

export function logGroup(action, groupId, details) {
    return getLogger().group(action, groupId, details);
}

export function logCountryViolation(attempt, userContext, targetContext) {
    return getLogger().countryViolationAttempt(attempt, userContext, targetContext);
}

export function logBlacklist(action, userId, reason, adminId) {
    return getLogger().blacklist(action, userId, reason, adminId);
}

export default getLogger();