/**
 * M-Pesewa Authentication Audit
 * Audit logging and security monitoring
 */

class AuthAudit {
    constructor() {
        this.auditLog = [];
        this.securityEvents = [];
        this.maxLogSize = 1000; // Maximum number of audit logs to keep
        
        this.init();
    }
    
    init() {
        // Load existing audit logs
        this.loadAuditLogs();
        
        // Setup periodic cleanup
        setInterval(() => this.cleanupOldLogs(), 24 * 60 * 60 * 1000); // Daily cleanup
        
        // Monitor authentication events
        this.setupEventMonitoring();
    }
    
    /**
     * Log authentication event
     * @param {string} event - Event type
     * @param {Object} data - Event data
     * @param {string} userId - User ID (if available)
     * @param {string} ip - IP address (simulated)
     */
    logEvent(event, data = {}, userId = null, ip = null) {
        const timestamp = new Date().toISOString();
        const eventId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const auditEntry = {
            id: eventId,
            timestamp: timestamp,
            event: event,
            userId: userId || this.getCurrentUserId(),
            userRole: this.getCurrentUserRole(),
            country: this.getCurrentCountry(),
            ip: ip || this.simulateIP(),
            userAgent: navigator.userAgent,
            data: data,
            severity: this.getEventSeverity(event)
        };
        
        // Add to in-memory log
        this.auditLog.unshift(auditEntry); // Add to beginning for chronological order
        
        // Save to localStorage
        this.saveAuditLogs();
        
        // Check for security threats
        this.analyzeSecurityEvent(auditEntry);
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[AUDIT] ${event}:`, auditEntry);
        }
        
        return auditEntry;
    }
    
    /**
     * Log login attempt
     * @param {string} username - Username attempted
     * @param {boolean} success - Whether login was successful
     * @param {string} reason - Reason for failure (if any)
     */
    logLoginAttempt(username, success, reason = null) {
        return this.logEvent(
            success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
            {
                username: username,
                success: success,
                reason: reason,
                sessionId: this.generateSessionId()
            },
            this.getUserIdByUsername(username)
        );
    }
    
    /**
     * Log registration
     * @param {Object} userData - User registration data
     * @param {string} role - User role
     * @param {boolean} success - Whether registration was successful
     */
    logRegistration(userData, role, success) {
        return this.logEvent(
            success ? 'REGISTRATION_SUCCESS' : 'REGISTRATION_FAILED',
            {
                username: userData.username,
                email: userData.email,
                role: role,
                country: userData.country,
                referrersCount: userData.referrers ? userData.referrers.length : 0,
                success: success
            }
        );
    }
    
    /**
     * Log password change
     * @param {string} userId - User ID
     * @param {boolean} success - Whether change was successful
     */
    logPasswordChange(userId, success) {
        return this.logEvent(
            success ? 'PASSWORD_CHANGED' : 'PASSWORD_CHANGE_FAILED',
            {
                userId: userId,
                success: success,
                changedBy: this.getCurrentUserId()
            },
            userId
        );
    }
    
    /**
     * Log subscription event
     * @param {string} event - Subscription event type
     * @param {Object} data - Subscription data
     * @param {string} userId - User ID
     */
    logSubscriptionEvent(event, data, userId) {
        return this.logEvent(
            `SUBSCRIPTION_${event.toUpperCase()}`,
            {
                ...data,
                userId: userId
            },
            userId
        );
    }
    
    /**
     * Log blacklist event
     * @param {string} action - 'ADDED' or 'REMOVED'
     * @param {Object} borrower - Borrower data
     * @param {Object} lender - Lender data (who initiated)
     * @param {string} reason - Reason for blacklisting
     */
    logBlacklistEvent(action, borrower, lender, reason) {
        return this.logEvent(
            `BLACKLIST_${action}`,
            {
                borrowerId: borrower.id,
                borrowerName: borrower.fullName || borrower.username,
                lenderId: lender.id,
                lenderName: lender.fullName || lender.username,
                reason: reason,
                amountOwed: borrower.blacklistStatus?.amountOwed || 0,
                daysOverdue: borrower.blacklistStatus?.daysOverdue || 0
            },
            lender.id
        );
    }
    
    /**
     * Log access violation
     * @param {string} route - Route attempted
     * @param {string} requiredRole - Required role
     * @param {string} userRole - User's actual role
     */
    logAccessViolation(route, requiredRole, userRole) {
        return this.logEvent(
            'ACCESS_VIOLATION',
            {
                route: route,
                requiredRole: requiredRole,
                userRole: userRole,
                attemptedAt: new Date().toISOString(),
                ip: this.simulateIP()
            },
            this.getCurrentUserId(),
            'HIGH'
        );
    }
    
    /**
     * Log country violation
     * @param {string} attemptedCountry - Country attempted to access
     * @param {string} userCountry - User's actual country
     */
    logCountryViolation(attemptedCountry, userCountry) {
        return this.logEvent(
            'COUNTRY_VIOLATION',
            {
                attemptedCountry: attemptedCountry,
                userCountry: userCountry,
                severity: 'HIGH',
                description: 'Cross-country access attempt blocked'
            },
            this.getCurrentUserId(),
            'HIGH'
        );
    }
    
    /**
     * Get audit logs for user
     * @param {string} userId - User ID
     * @param {number} limit - Maximum number of logs to return
     * @returns {Array} - Audit logs
     */
    getUserAuditLogs(userId, limit = 100) {
        return this.auditLog
            .filter(log => log.userId === userId)
            .slice(0, limit);
    }
    
    /**
     * Get audit logs by event type
     * @param {string} eventType - Event type to filter by
     * @param {number} limit - Maximum number of logs to return
     * @returns {Array} - Filtered audit logs
     */
    getLogsByEvent(eventType, limit = 100) {
        return this.auditLog
            .filter(log => log.event === eventType)
            .slice(0, limit);
    }
    
    /**
     * Get security events (failed logins, violations, etc.)
     * @param {number} limit - Maximum number of events to return
     * @returns {Array} - Security events
     */
    getSecurityEvents(limit = 50) {
        return this.securityEvents.slice(0, limit);
    }
    
    /**
     * Analyze security event for threats
     * @param {Object} auditEntry - Audit log entry
     */
    analyzeSecurityEvent(auditEntry) {
        // Check for brute force attempts
        if (auditEntry.event === 'LOGIN_FAILED') {
            this.detectBruteForce(auditEntry);
        }
        
        // Check for suspicious activity
        if (this.isSuspiciousActivity(auditEntry)) {
            this.logSecurityThreat('SUSPICIOUS_ACTIVITY', auditEntry);
        }
        
        // Check for multiple failed registrations
        if (auditEntry.event === 'REGISTRATION_FAILED') {
            this.detectRegistrationAbuse(auditEntry);
        }
        
        // Add to security events if high severity
        if (auditEntry.severity === 'HIGH') {
            this.securityEvents.unshift({
                ...auditEntry,
                analyzedAt: new Date().toISOString()
            });
            
            // Keep security events manageable
            if (this.securityEvents.length > 200) {
                this.securityEvents = this.securityEvents.slice(0, 200);
            }
        }
    }
    
    /**
     * Detect brute force login attempts
     * @param {Object} auditEntry - Login failed audit entry
     */
    detectBruteForce(auditEntry) {
        const recentFailedLogins = this.auditLog.filter(log => 
            log.event === 'LOGIN_FAILED' && 
            log.data.username === auditEntry.data.username &&
            new Date(log.timestamp) > new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
        );
        
        if (recentFailedLogins.length >= 5) {
            this.logSecurityThreat('BRUTE_FORCE_ATTEMPT', {
                username: auditEntry.data.username,
                attempts: recentFailedLogins.length,
                timeWindow: '15 minutes',
                ip: auditEntry.ip
            });
            
            // Trigger account lock (simulated)
            this.lockAccount(auditEntry.data.username);
        }
    }
    
    /**
     * Detect registration abuse
     * @param {Object} auditEntry - Registration failed audit entry
     */
    detectRegistrationAbuse(auditEntry) {
        const recentFailedRegistrations = this.auditLog.filter(log => 
            log.event === 'REGISTRATION_FAILED' &&
            log.ip === auditEntry.ip &&
            new Date(log.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
        );
        
        if (recentFailedRegistrations.length >= 3) {
            this.logSecurityThreat('REGISTRATION_ABUSE', {
                ip: auditEntry.ip,
                attempts: recentFailedRegistrations.length,
                timeWindow: '1 hour'
            });
            
            // Block IP from further registrations (simulated)
            this.blockIP(auditEntry.ip, 'registration');
        }
    }
    
    /**
     * Check if activity is suspicious
     * @param {Object} auditEntry - Audit log entry
     * @returns {boolean}
     */
    isSuspiciousActivity(auditEntry) {
        // Multiple role changes in short period
        if (auditEntry.event.includes('ROLE_CHANGE')) {
            const recentRoleChanges = this.auditLog.filter(log => 
                log.event.includes('ROLE_CHANGE') &&
                log.userId === auditEntry.userId &&
                new Date(log.timestamp) > new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
            );
            
            if (recentRoleChanges.length >= 3) {
                return true;
            }
        }
        
        // Rapid country changes
        if (auditEntry.event === 'COUNTRY_CHANGED') {
            const recentCountryChanges = this.auditLog.filter(log => 
                log.event === 'COUNTRY_CHANGED' &&
                log.userId === auditEntry.userId &&
                new Date(log.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
            );
            
            if (recentCountryChanges.length >= 2) {
                return true;
            }
        }
        
        // Multiple subscription upgrades/downgrades
        if (auditEntry.event.includes('SUBSCRIPTION')) {
            const recentSubChanges = this.auditLog.filter(log => 
                log.event.includes('SUBSCRIPTION') &&
                log.userId === auditEntry.userId &&
                new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            );
            
            if (recentSubChanges.length >= 3) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Log security threat
     * @param {string} threatType - Type of threat
     * @param {Object} data - Threat data
     */
    logSecurityThreat(threatType, data) {
        const threatEntry = {
            id: `threat_${Date.now()}`,
            timestamp: new Date().toISOString(),
            threatType: threatType,
            data: data,
            severity: 'HIGH',
            actionTaken: this.determineThreatAction(threatType),
            resolved: false
        };
        
        console.warn(`[SECURITY THREAT] ${threatType}:`, threatEntry);
        
        // In production, this would send to security monitoring system
        // For now, we'll just log it
        
        return threatEntry;
    }
    
    /**
     * Determine action for threat type
     * @param {string} threatType - Type of threat
     * @returns {string} - Recommended action
     */
    determineThreatAction(threatType) {
        const actions = {
            'BRUTE_FORCE_ATTEMPT': 'ACCOUNT_LOCKED_TEMPORARILY',
            'REGISTRATION_ABUSE': 'IP_BLOCKED_FOR_REGISTRATION',
            'SUSPICIOUS_ACTIVITY': 'ACCOUNT_REVIEW_REQUIRED',
            'ACCESS_VIOLATION': 'ACCESS_BLOCKED_AND_LOGGED',
            'COUNTRY_VIOLATION': 'ACCESS_BLOCKED_AND_ALERTED'
        };
        
        return actions[threatType] || 'MONITOR_AND_LOG';
    }
    
    /**
     * Lock account (simulated)
     * @param {string} username - Username to lock
     */
    lockAccount(username) {
        console.log(`[SECURITY] Account locked temporarily: ${username}`);
        
        // In production, this would update user status in database
        // For demo, we'll store in localStorage
        const lockedAccounts = JSON.parse(localStorage.getItem('mpesewa_locked_accounts') || '{}');
        lockedAccounts[username] = {
            lockedAt: new Date().toISOString(),
            unlockAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
            reason: 'Too many failed login attempts'
        };
        
        localStorage.setItem('mpesewa_locked_accounts', JSON.stringify(lockedAccounts));
        
        // Log the lock
        this.logEvent('ACCOUNT_LOCKED', {
            username: username,
            reason: 'Brute force protection',
            duration: '30 minutes'
        });
    }
    
    /**
     * Block IP (simulated)
     * @param {string} ip - IP address to block
     * @param {string} reason - Reason for blocking
     */
    blockIP(ip, reason) {
        console.log(`[SECURITY] IP blocked: ${ip} - ${reason}`);
        
        const blockedIPs = JSON.parse(localStorage.getItem('mpesewa_blocked_ips') || '{}');
        blockedIPs[ip] = {
            blockedAt: new Date().toISOString(),
            reason: reason,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };
        
        localStorage.setItem('mpesewa_blocked_ips', JSON.stringify(blockedIPs));
    }
    
    /**
     * Check if account is locked
     * @param {string} username - Username to check
     * @returns {boolean}
     */
    isAccountLocked(username) {
        const lockedAccounts = JSON.parse(localStorage.getItem('mpesewa_locked_accounts') || '{}');
        const lockInfo = lockedAccounts[username];
        
        if (!lockInfo) return false;
        
        const unlockTime = new Date(lockInfo.unlockAt);
        const now = new Date();
        
        if (now > unlockTime) {
            // Lock has expired, remove it
            delete lockedAccounts[username];
            localStorage.setItem('mpesewa_locked_accounts', JSON.stringify(lockedAccounts));
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if IP is blocked
     * @param {string} ip - IP address to check
     * @returns {boolean}
     */
    isIPBlocked(ip) {
        const blockedIPs = JSON.parse(localStorage.getItem('mpesewa_blocked_ips') || '{}');
        const blockInfo = blockedIPs[ip];
        
        if (!blockInfo) return false;
        
        const expireTime = new Date(blockInfo.expiresAt);
        const now = new Date();
        
        if (now > expireTime) {
            // Block has expired, remove it
            delete blockedIPs[ip];
            localStorage.setItem('mpesewa_blocked_ips', JSON.stringify(blockedIPs));
            return false;
        }
        
        return true;
    }
    
    /**
     * Get current user ID
     * @returns {string|null}
     */
    getCurrentUserId() {
        try {
            const userData = JSON.parse(localStorage.getItem('mpesewa_user_data') || '{}');
            return userData.id || null;
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Get current user role
     * @returns {string|null}
     */
    getCurrentUserRole() {
        return localStorage.getItem('mpesewa_user_role') || null;
    }
    
    /**
     * Get current country
     * @returns {string|null}
     */
    getCurrentCountry() {
        return localStorage.getItem('mpesewa_country') || null;
    }
    
    /**
     * Get user ID by username
     * @param {string} username - Username to lookup
     * @returns {string|null}
     */
    getUserIdByUsername(username) {
        try {
            const users = JSON.parse(localStorage.getItem('mpesewa_users_registry') || '[]');
            const user = users.find(u => u.username === username);
            return user ? user.id : null;
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Generate session ID
     * @returns {string}
     */
    generateSessionId() {
        return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Simulate IP address (for demo purposes)
     * @returns {string}
     */
    simulateIP() {
        // Generate a realistic-looking IP for demo
        return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    /**
     * Get event severity
     * @param {string} event - Event type
     * @returns {string} - Severity level
     */
    getEventSeverity(event) {
        const highSeverityEvents = [
            'LOGIN_FAILED',
            'ACCESS_VIOLATION',
            'COUNTRY_VIOLATION',
            'ACCOUNT_LOCKED',
            'BLACKLIST_ADDED',
            'SUBSCRIPTION_FRAUD'
        ];
        
        const mediumSeverityEvents = [
            'PASSWORD_CHANGED',
            'ROLE_CHANGED',
            'SUBSCRIPTION_CHANGED',
            'REGISTRATION_FAILED'
        ];
        
        if (highSeverityEvents.includes(event)) return 'HIGH';
        if (mediumSeverityEvents.includes(event)) return 'MEDIUM';
        return 'LOW';
    }
    
    /**
     * Load audit logs from localStorage
     */
    loadAuditLogs() {
        try {
            const savedLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
            this.auditLog = savedLogs.slice(0, this.maxLogSize);
        } catch (error) {
            console.error('Error loading audit logs:', error);
            this.auditLog = [];
        }
    }
    
    /**
     * Save audit logs to localStorage
     */
    saveAuditLogs() {
        try {
            localStorage.setItem('mpesewa_audit_logs', JSON.stringify(this.auditLog.slice(0, this.maxLogSize)));
        } catch (error) {
            console.error('Error saving audit logs:', error);
        }
    }
    
    /**
     * Cleanup old audit logs
     */
    cleanupOldLogs() {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        this.auditLog = this.auditLog.filter(log => 
            new Date(log.timestamp) > thirtyDaysAgo
        );
        
        this.saveAuditLogs();
    }
    
    /**
     * Setup event monitoring
     */
    setupEventMonitoring() {
        // Monitor localStorage changes for user data
        const originalSetItem = localStorage.setItem;
        const originalRemoveItem = localStorage.removeItem;
        
        localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            
            // Trigger custom event
            const event = new CustomEvent('localStorageChanged', {
                detail: { key, value }
            });
            window.dispatchEvent(event);
        };
        
        localStorage.removeItem = function(key) {
            originalRemoveItem.apply(this, arguments);
            
            const event = new CustomEvent('localStorageChanged', {
                detail: { key, value: null, removed: true }
            });
            window.dispatchEvent(event);
        };
        
        // Listen for authentication changes
        window.addEventListener('localStorageChanged', (event) => {
            const { key, value, removed } = event.detail;
            
            if (key === 'mpesewa_is_authenticated') {
                this.logEvent(
                    removed ? 'USER_LOGOUT' : 'USER_LOGIN',
                    { timestamp: new Date().toISOString() },
                    this.getCurrentUserId()
                );
            }
            
            if (key === 'mpesewa_user_role' && value) {
                this.logEvent(
                    'ROLE_CHANGED',
                    { newRole: value },
                    this.getCurrentUserId()
                );
            }
            
            if (key === 'mpesewa_country' && value) {
                this.logEvent(
                    'COUNTRY_CHANGED',
                    { newCountry: value },
                    this.getCurrentUserId()
                );
            }
        });
        
        // Monitor page visibility for session tracking
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logEvent(
                    'SESSION_INACTIVE',
                    { inactiveAt: new Date().toISOString() },
                    this.getCurrentUserId()
                );
            } else {
                this.logEvent(
                    'SESSION_ACTIVE',
                    { activeAt: new Date().toISOString() },
                    this.getCurrentUserId()
                );
            }
        });
    }
    
    /**
     * Export audit logs
     * @param {string} format - Export format ('json' or 'csv')
     * @returns {string} - Exported data
     */
    exportAuditLogs(format = 'json') {
        const data = this.auditLog;
        
        if (format === 'csv') {
            return this.convertToCSV(data);
        }
        
        return JSON.stringify(data, null, 2);
    }
    
    /**
     * Convert data to CSV
     * @param {Array} data - Data to convert
     * @returns {string} - CSV string
     */
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [];
        
        // Add headers
        csvRows.push(headers.join(','));
        
        // Add rows
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                
                if (typeof value === 'object') {
                    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                }
                
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }
    
    /**
     * Get audit statistics
     * @returns {Object} - Audit statistics
     */
    getStatistics() {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const logs24h = this.auditLog.filter(log => new Date(log.timestamp) > last24Hours);
        const logs7d = this.auditLog.filter(log => new Date(log.timestamp) > last7Days);
        
        return {
            totalLogs: this.auditLog.length,
            last24Hours: logs24h.length,
            last7Days: logs7d.length,
            securityEvents: this.securityEvents.length,
            failedLogins: this.auditLog.filter(log => log.event === 'LOGIN_FAILED').length,
            accessViolations: this.auditLog.filter(log => log.event === 'ACCESS_VIOLATION').length,
            countryViolations: this.auditLog.filter(log => log.event === 'COUNTRY_VIOLATION').length,
            mostActiveUser: this.getMostActiveUser(),
            mostCommonEvent: this.getMostCommonEvent()
        };
    }
    
    /**
     * Get most active user
     * @returns {string} - Most active user ID
     */
    getMostActiveUser() {
        const userActivity = {};
        
        this.auditLog.forEach(log => {
            if (log.userId) {
                userActivity[log.userId] = (userActivity[log.userId] || 0) + 1;
            }
        });
        
        const entries = Object.entries(userActivity);
        if (entries.length === 0) return 'N/A';
        
        return entries.sort((a, b) => b[1] - a[1])[0][0];
    }
    
    /**
     * Get most common event
     * @returns {string} - Most common event type
     */
    getMostCommonEvent() {
        const eventCount = {};
        
        this.auditLog.forEach(log => {
            eventCount[log.event] = (eventCount[log.event] || 0) + 1;
        });
        
        const entries = Object.entries(eventCount);
        if (entries.length === 0) return 'N/A';
        
        return entries.sort((a, b) => b[1] - a[1])[0][0];
    }
}

// Export singleton instance
const authAudit = new AuthAudit();
window.AuthAudit = authAudit;

export default authAudit;