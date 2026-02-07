/**
 * M-PESEWA SUBSCRIPTION AUDIT TRAIL
 * Comprehensive audit logging for all subscription activities
 * Append-only, immutable audit trail for regulatory compliance
 */

// Audit event types
export const AUDIT_EVENT_TYPES = {
    // Subscription lifecycle events
    SUBSCRIPTION_CREATED: 'SUBSCRIPTION_CREATED',
    SUBSCRIPTION_ACTIVATED: 'SUBSCRIPTION_ACTIVATED',
    SUBSCRIPTION_RENEWED: 'SUBSCRIPTION_RENEWED',
    SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
    SUBSCRIPTION_CANCELLED: 'SUBSCRIPTION_CANCELLED',
    SUBSCRIPTION_SUSPENDED: 'SUBSCRIPTION_SUSPENDED',
    SUBSCRIPTION_REACTIVATED: 'SUBSCRIPTION_REACTIVATED',
    SUBSCRIPTION_UPGRADED: 'SUBSCRIPTION_UPGRADED',
    SUBSCRIPTION_DOWNGRADED: 'SUBSCRIPTION_DOWNGRADED',
    
    // Payment events
    PAYMENT_INITIATED: 'PAYMENT_INITIATED',
    PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    PAYMENT_REFUNDED: 'PAYMENT_REFUNDED',
    
    // Lending events
    LENDING_RECORDED: 'LENDING_RECORDED',
    LENDING_LIMIT_EXCEEDED: 'LENDING_LIMIT_EXCEEDED',
    LENDING_BLOCKED: 'LENDING_BLOCKED',
    WEEKLY_RESET: 'WEEKLY_RESET',
    
    // Gate and access events
    GATE_CHECK: 'GATE_CHECK',
    ACCESS_GRANTED: 'ACCESS_GRANTED',
    ACCESS_DENIED: 'ACCESS_DENIED',
    ADMIN_OVERRIDE_GRANTED: 'ADMIN_OVERRIDE_GRANTED',
    ADMIN_OVERRIDE_DENIED: 'ADMIN_OVERRIDE_DENIED',
    
    // Ledger events
    LEDGER_CREATED: 'LEDGER_CREATED',
    LEDGER_UPDATED: 'LEDGER_UPDATED',
    LEDGER_CLEARED: 'LEDGER_CLEARED',
    LEDGER_DELETED: 'LEDGER_DELETED',
    
    // System events
    DAILY_MAINTENANCE: 'DAILY_MAINTENANCE',
    SYSTEM_BACKUP: 'SYSTEM_BACKUP',
    AUDIT_EXPORT: 'AUDIT_EXPORT',
    SECURITY_ALERT: 'SECURITY_ALERT',
    
    // User events
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT',
    PASSWORD_CHANGE: 'PASSWORD_CHANGE',
    PROFILE_UPDATE: 'PROFILE_UPDATE',
    
    // Compliance events
    REGULATORY_REPORT_GENERATED: 'REGULATORY_REPORT_GENERATED',
    COMPLIANCE_CHECK: 'COMPLIANCE_CHECK',
    DATA_PRIVACY_REQUEST: 'DATA_PRIVACY_REQUEST'
};

// Audit severity levels
export const AUDIT_SEVERITY = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
    CRITICAL: 'CRITICAL',
    SECURITY: 'SECURITY'
};

// Audit storage
class AuditStore {
    constructor() {
        this.auditLogs = new Map(); // userId -> array of audit logs
        this.systemLogs = [];
        this.maxLogsPerUser = 1000; // Keep last 1000 logs per user
        this.maxSystemLogs = 10000; // Keep last 10000 system logs
    }
    
    /**
     * Log subscription action
     * @param {Object} auditData - Audit data
     */
    log(auditData) {
        const {
            action,
            userId,
            timestamp = new Date().toISOString(),
            severity = AUDIT_SEVERITY.INFO,
            metadata = {},
            ipAddress,
            userAgent,
            sessionId,
            countryCode,
            tierId,
            amount,
            currency
        } = auditData;
        
        const auditEntry = {
            id: this.generateAuditId(),
            action,
            userId,
            timestamp,
            severity,
            metadata,
            ipAddress,
            userAgent,
            sessionId,
            countryCode,
            tierId,
            amount,
            currency,
            hash: this.calculateHash(auditData)
        };
        
        // Store user-specific logs
        if (userId) {
            if (!this.auditLogs.has(userId)) {
                this.auditLogs.set(userId, []);
            }
            
            const userLogs = this.auditLogs.get(userId);
            userLogs.push(auditEntry);
            
            // Trim old logs
            if (userLogs.length > this.maxLogsPerUser) {
                userLogs.splice(0, userLogs.length - this.maxLogsPerUser);
            }
        }
        
        // Store system logs
        this.systemLogs.push({
            ...auditEntry,
            isSystemLog: true
        });
        
        // Trim system logs
        if (this.systemLogs.length > this.maxSystemLogs) {
            this.systemLogs.splice(0, this.systemLogs.length - this.maxSystemLogs);
        }
        
        // Console log for development
        if (severity === AUDIT_SEVERITY.ERROR || severity === AUDIT_SEVERITY.CRITICAL) {
            console.error(`[AUDIT:${severity}] ${action} - ${userId}`, auditData);
        }
        
        return auditEntry;
    }
    
    /**
     * Get audit logs for user
     * @param {string} userId - User ID
     * @param {Object} filters - Filter options
     */
    getUserLogs(userId, filters = {}) {
        if (!this.auditLogs.has(userId)) {
            return [];
        }
        
        let logs = [...this.auditLogs.get(userId)];
        
        // Apply filters
        if (filters.startDate) {
            const start = new Date(filters.startDate);
            logs = logs.filter(log => new Date(log.timestamp) >= start);
        }
        
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            logs = logs.filter(log => new Date(log.timestamp) <= end);
        }
        
        if (filters.action) {
            logs = logs.filter(log => log.action === filters.action);
        }
        
        if (filters.severity) {
            logs = logs.filter(log => log.severity === filters.severity);
        }
        
        // Sort by timestamp (newest first)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        return {
            logs: logs.slice(startIndex, endIndex),
            total: logs.length,
            page,
            limit,
            totalPages: Math.ceil(logs.length / limit)
        };
    }
    
    /**
     * Get system logs
     * @param {Object} filters - Filter options
     */
    getSystemLogs(filters = {}) {
        let logs = [...this.systemLogs];
        
        // Apply filters
        if (filters.startDate) {
            const start = new Date(filters.startDate);
            logs = logs.filter(log => new Date(log.timestamp) >= start);
        }
        
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            logs = logs.filter(log => new Date(log.timestamp) <= end);
        }
        
        if (filters.action) {
            logs = logs.filter(log => log.action === filters.action);
        }
        
        if (filters.severity) {
            logs = logs.filter(log => log.severity === filters.severity);
        }
        
        // Sort by timestamp (newest first)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || 100;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        return {
            logs: logs.slice(startIndex, endIndex),
            total: logs.length,
            page,
            limit,
            totalPages: Math.ceil(logs.length / limit)
        };
    }
    
    /**
     * Generate audit ID
     */
    generateAuditId() {
        return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Calculate hash for audit entry
     * @param {Object} data - Audit data
     */
    calculateHash(data) {
        // Simple hash for demo - in production use proper cryptographic hash
        const str = JSON.stringify(data);
        let hash = 0;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        return hash.toString(36);
    }
    
    /**
     * Verify audit trail integrity
     * @param {string} userId - User ID to verify
     */
    verifyIntegrity(userId) {
        if (!this.auditLogs.has(userId)) {
            return {
                valid: true,
                message: 'No audit logs for user',
                logsCount: 0
            };
        }
        
        const logs = this.auditLogs.get(userId);
        const inconsistencies = [];
        
        for (let i = 0; i < logs.length; i++) {
            const log = logs[i];
            const expectedHash = this.calculateHash({
                action: log.action,
                userId: log.userId,
                timestamp: log.timestamp,
                severity: log.severity,
                metadata: log.metadata
            });
            
            if (log.hash !== expectedHash) {
                inconsistencies.push({
                    index: i,
                    logId: log.id,
                    storedHash: log.hash,
                    calculatedHash: expectedHash
                });
            }
            
            // Check timestamp ordering (should be chronological)
            if (i > 0) {
                const prevTime = new Date(logs[i-1].timestamp);
                const currTime = new Date(log.timestamp);
                
                if (currTime < prevTime) {
                    inconsistencies.push({
                        index: i,
                        logId: log.id,
                        issue: 'Timestamp out of order',
                        previous: logs[i-1].timestamp,
                        current: log.timestamp
                    });
                }
            }
        }
        
        return {
            valid: inconsistencies.length === 0,
            logsCount: logs.length,
            inconsistencies,
            verificationDate: new Date().toISOString()
        };
    }
    
    /**
     * Export audit logs for regulatory compliance
     * @param {string} userId - User ID
     * @param {Object} options - Export options
     */
    exportLogs(userId, options = {}) {
        const logs = userId ? 
            this.getUserLogs(userId, { limit: 1000000 }).logs : 
            this.getSystemLogs({ limit: 1000000 }).logs;
        
        const exportData = {
            exportId: `export_${Date.now()}`,
            exportDate: new Date().toISOString(),
            exportedBy: options.exportedBy || 'SYSTEM',
            purpose: options.purpose || 'REGULATORY_COMPLIANCE',
            userId,
            totalLogs: logs.length,
            dateRange: {
                start: logs[logs.length - 1]?.timestamp,
                end: logs[0]?.timestamp
            },
            logs: logs.map(log => ({
                ...log,
                _exported: true
            })),
            summary: this.generateExportSummary(logs),
            hash: this.calculateHash({ logs: logs.length, exportDate: new Date().toISOString() })
        };
        
        // Log the export
        this.log({
            action: AUDIT_EVENT_TYPES.AUDIT_EXPORT,
            userId: options.exportedBy,
            severity: AUDIT_SEVERITY.INFO,
            metadata: {
                exportId: exportData.exportId,
                logsExported: logs.length,
                purpose: options.purpose
            }
        });
        
        return exportData;
    }
    
    /**
     * Generate export summary
     * @param {Array} logs - Audit logs
     */
    generateExportSummary(logs) {
        const summary = {
            totalLogs: logs.length,
            byAction: {},
            bySeverity: {},
            byDate: {},
            uniqueUsers: new Set(),
            dateRange: {
                earliest: null,
                latest: null
            }
        };
        
        for (const log of logs) {
            // Count by action
            summary.byAction[log.action] = (summary.byAction[log.action] || 0) + 1;
            
            // Count by severity
            summary.bySeverity[log.severity] = (summary.bySeverity[log.severity] || 0) + 1;
            
            // Count by date
            const date = log.timestamp.split('T')[0];
            summary.byDate[date] = (summary.byDate[date] || 0) + 1;
            
            // Track unique users
            if (log.userId) {
                summary.uniqueUsers.add(log.userId);
            }
            
            // Track date range
            const logDate = new Date(log.timestamp);
            if (!summary.dateRange.earliest || logDate < new Date(summary.dateRange.earliest)) {
                summary.dateRange.earliest = log.timestamp;
            }
            if (!summary.dateRange.latest || logDate > new Date(summary.dateRange.latest)) {
                summary.dateRange.latest = log.timestamp;
            }
        }
        
        summary.uniqueUserCount = summary.uniqueUsers.size;
        
        return summary;
    }
    
    /**
     * Clear audit logs (admin only)
     * @param {string} adminId - Admin user ID
     * @param {Object} options - Clear options
     */
    clearLogs(adminId, options = {}) {
        const { userId, olderThan, action } = options;
        
        let logsCleared = 0;
        
        if (userId) {
            // Clear specific user logs
            if (this.auditLogs.has(userId)) {
                const userLogs = this.auditLogs.get(userId);
                
                if (olderThan) {
                    const cutoffDate = new Date(olderThan);
                    const originalLength = userLogs.length;
                    
                    // Remove logs older than cutoff
                    for (let i = userLogs.length - 1; i >= 0; i--) {
                        if (new Date(userLogs[i].timestamp) < cutoffDate) {
                            userLogs.splice(i, 1);
                            logsCleared++;
                        }
                    }
                } else {
                    logsCleared = userLogs.length;
                    this.auditLogs.delete(userId);
                }
            }
        } else {
            // Clear system logs
            if (olderThan) {
                const cutoffDate = new Date(olderThan);
                const originalLength = this.systemLogs.length;
                
                // Remove logs older than cutoff
                for (let i = this.systemLogs.length - 1; i >= 0; i--) {
                    if (new Date(this.systemLogs[i].timestamp) < cutoffDate) {
                        this.systemLogs.splice(i, 1);
                        logsCleared++;
                    }
                }
            }
        }
        
        // Log the clear action
        this.log({
            action: 'AUDIT_LOGS_CLEARED',
            userId: adminId,
            severity: AUDIT_SEVERITY.WARNING,
            metadata: {
                logsCleared,
                userId,
                olderThan,
                action,
                options
            }
        });
        
        return {
            success: true,
            logsCleared,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Get statistics
     */
    getStatistics() {
        let totalUserLogs = 0;
        let uniqueUsers = 0;
        
        for (const [userId, logs] of this.auditLogs) {
            totalUserLogs += logs.length;
            uniqueUsers++;
        }
        
        return {
            totalUserLogs,
            totalSystemLogs: this.systemLogs.length,
            uniqueUsers,
            storageEstimate: (totalUserLogs + this.systemLogs.length) * 1024, // Approx 1KB per log
            lastUpdated: new Date().toISOString()
        };
    }
}

// Create singleton instance
const auditStore = new AuditStore();

/**
 * Main audit logging function
 * @param {Object} auditData - Audit data
 */
export function logSubscriptionAction(auditData) {
    return auditStore.log(auditData);
}

/**
 * Get user audit logs
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 */
export function getUserAuditLogs(userId, filters = {}) {
    return auditStore.getUserLogs(userId, filters);
}

/**
 * Get system audit logs
 * @param {Object} filters - Filter options
 */
export function getSystemAuditLogs(filters = {}) {
    return auditStore.getSystemLogs(filters);
}

/**
 * Export audit logs
 * @param {string} userId - User ID
 * @param {Object} options - Export options
 */
export function exportAuditLogs(userId, options = {}) {
    return auditStore.exportLogs(userId, options);
}

/**
 * Verify audit integrity
 * @param {string} userId - User ID
 */
export function verifyAuditIntegrity(userId) {
    return auditStore.verifyIntegrity(userId);
}

/**
 * Get audit statistics
 */
export function getAuditStatistics() {
    return auditStore.getStatistics();
}

/**
 * Clear audit logs (admin only)
 * @param {string} adminId - Admin user ID
 * @param {Object} options - Clear options
 */
export function clearAuditLogs(adminId, options = {}) {
    return auditStore.clearLogs(adminId, options);
}

/**
 * Subscription-specific audit helpers
 */

/**
 * Log subscription activation
 * @param {Object} params - Activation parameters
 */
export function logSubscriptionActivation(params) {
    return logSubscriptionAction({
        action: AUDIT_EVENT_TYPES.SUBSCRIPTION_ACTIVATED,
        userId: params.userId,
        severity: AUDIT_SEVERITY.INFO,
        metadata: {
            tierId: params.tierId,
            period: params.period,
            amount: params.amount,
            countryCode: params.countryCode,
            paymentMethod: params.paymentMethod,
            expiryDate: params.expiryDate
        },
        tierId: params.tierId,
        amount: params.amount,
        countryCode: params.countryCode,
        timestamp: params.timestamp || new Date().toISOString()
    });
}

/**
 * Log subscription renewal
 * @param {Object} params - Renewal parameters
 */
export function logSubscriptionRenewal(params) {
    return logSubscriptionAction({
        action: AUDIT_EVENT_TYPES.SUBSCRIPTION_RENEWED,
        userId: params.userId,
        severity: AUDIT_SEVERITY.INFO,
        metadata: {
            tierId: params.tierId,
            period: params.period,
            amount: params.amount,
            previousExpiry: params.previousExpiry,
            newExpiry: params.newExpiry,
            renewalType: params.renewalType
        },
        tierId: params.tierId,
        amount: params.amount,
        timestamp: params.timestamp || new Date().toISOString()
    });
}

/**
 * Log subscription expiry
 * @param {Object} params - Expiry parameters
 */
export function logSubscriptionExpiry(params) {
    return logSubscriptionAction({
        action: AUDIT_EVENT_TYPES.SUBSCRIPTION_EXPIRED,
        userId: params.userId,
        severity: AUDIT_SEVERITY.WARNING,
        metadata: {
            tierId: params.tierId,
            expiryDate: params.expiryDate,
            daysOverdue: params.daysOverdue,
            autoRenewAttempted: params.autoRenewAttempted
        },
        tierId: params.tierId,
        timestamp: params.timestamp || new Date().toISOString()
    });
}

/**
 * Log lending activity
 * @param {Object} params - Lending parameters
 */
export function logLendingActivity(params) {
    return logSubscriptionAction({
        action: AUDIT_EVENT_TYPES.LENDING_RECORDED,
        userId: params.userId,
        severity: AUDIT_SEVERITY.INFO,
        metadata: {
            amount: params.amount,
            borrowerId: params.borrowerId,
            ledgerId: params.ledgerId,
            category: params.category,
            weeklyUsed: params.weeklyUsed,
            weeklyLimit: params.weeklyLimit,
            groupId: params.groupId
        },
        amount: params.amount,
        currency: params.currency,
        timestamp: params.timestamp || new Date().toISOString()
    });
}

/**
 * Log payment activity
 * @param {Object} params - Payment parameters
 */
export function logPaymentActivity(params) {
    const severity = params.status === 'FAILED' ? AUDIT_SEVERITY.ERROR : AUDIT_SEVERITY.INFO;
    
    return logSubscriptionAction({
        action: params.status === 'COMPLETED' ? 
            AUDIT_EVENT_TYPES.PAYMENT_COMPLETED : 
            AUDIT_EVENT_TYPES.PAYMENT_FAILED,
        userId: params.userId,
        severity,
        metadata: {
            amount: params.amount,
            currency: params.currency,
            paymentMethod: params.paymentMethod,
            reference: params.reference,
            status: params.status,
            error: params.error,
            tierId: params.tierId,
            period: params.period
        },
        amount: params.amount,
        currency: params.currency,
        tierId: params.tierId,
        timestamp: params.timestamp || new Date().toISOString()
    });
}

/**
 * Log gate check
 * @param {Object} params - Gate check parameters
 */
export function logGateCheck(params) {
    const severity = params.allowed ? AUDIT_SEVERITY.INFO : AUDIT_SEVERITY.WARNING;
    
    return logSubscriptionAction({
        action: AUDIT_EVENT_TYPES.GATE_CHECK,
        userId: params.userId,
        severity,
        metadata: {
            gateType: params.gateType,
            allowed: params.allowed,
            reason: params.reason,
            requiredAction: params.requiredAction,
            tierId: params.tierId,
            state: params.state,
            amount: params.amount
        },
        tierId: params.tierId,
        amount: params.amount,
        timestamp: params.timestamp || new Date().toISOString()
    });
}

/**
 * Log admin override
 * @param {Object} params - Admin override parameters
 */
export function logAdminOverride(params) {
    return logSubscriptionAction({
        action: AUDIT_EVENT_TYPES.ADMIN_OVERRIDE_GRANTED,
        userId: params.userId,
        severity: AUDIT_SEVERITY.SECURITY,
        metadata: {
            adminId: params.adminId,
            overrideType: params.overrideType,
            reason: params.reason,
            affectedUserId: params.affectedUserId,
            previousState: params.previousState,
            newState: params.newState,
            ledgerId: params.ledgerId,
            amount: params.amount
        },
        amount: params.amount,
        timestamp: params.timestamp || new Date().toISOString()
    });
}

/**
 * Generate compliance report
 * @param {string} countryCode - Country code
 * @param {Object} dateRange - Date range
 */
export function generateComplianceReport(countryCode, dateRange = {}) {
    const { startDate, endDate } = dateRange;
    
    // Get all system logs for date range
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    
    const systemLogs = getSystemAuditLogs(filters);
    
    // Filter for country-specific logs if needed
    const countryLogs = countryCode ? 
        systemLogs.logs.filter(log => log.countryCode === countryCode) :
        systemLogs.logs;
    
    // Generate report
    const report = {
        reportId: `compliance_${Date.now()}`,
        generatedDate: new Date().toISOString(),
        countryCode,
        dateRange: {
            start: startDate || systemLogs.logs[systemLogs.logs.length - 1]?.timestamp,
            end: endDate || systemLogs.logs[0]?.timestamp
        },
        summary: {
            totalLogs: countryLogs.length,
            subscriptionActivations: countryLogs.filter(l => l.action === 'SUBSCRIPTION_ACTIVATED').length,
            subscriptionRenewals: countryLogs.filter(l => l.action === 'SUBSCRIPTION_RENEWED').length,
            subscriptionExpiries: countryLogs.filter(l => l.action === 'SUBSCRIPTION_EXPIRED').length,
            lendingActivities: countryLogs.filter(l => l.action === 'LENDING_RECORDED').length,
            paymentActivities: countryLogs.filter(l => l.action.includes('PAYMENT_')).length,
            gateChecks: countryLogs.filter(l => l.action === 'GATE_CHECK').length,
            adminOverrides: countryLogs.filter(l => l.action === 'ADMIN_OVERRIDE_GRANTED').length,
            securityAlerts: countryLogs.filter(l => l.severity === 'SECURITY').length,
            errors: countryLogs.filter(l => l.severity === 'ERROR').length
        },
        tierDistribution: {},
        revenueEstimate: 0,
        recommendations: []
    };
    
    // Calculate tier distribution
    for (const log of countryLogs) {
        if (log.tierId) {
            report.tierDistribution[log.tierId] = (report.tierDistribution[log.tierId] || 0) + 1;
        }
        
        // Estimate revenue from subscription activations and renewals
        if ((log.action === 'SUBSCRIPTION_ACTIVATED' || log.action === 'SUBSCRIPTION_RENEWED') && log.amount) {
            report.revenueEstimate += log.amount;
        }
    }
    
    // Generate recommendations
    if (report.summary.securityAlerts > 10) {
        report.recommendations.push({
            priority: 'HIGH',
            action: 'REVIEW_SECURITY_LOGS',
            description: `High number of security alerts (${report.summary.securityAlerts}) detected`
        });
    }
    
    if (report.summary.subscriptionExpiries > report.summary.subscriptionRenewals * 0.3) {
        report.recommendations.push({
            priority: 'MEDIUM',
            action: 'IMPROVE_RETENTION',
            description: 'High subscription expiry rate detected'
        });
    }
    
    if (report.summary.adminOverrides > 5) {
        report.recommendations.push({
            priority: 'MEDIUM',
            action: 'REVIEW_ADMIN_PRIVILEGES',
            description: 'Multiple admin overrides detected'
        });
    }
    
    // Log report generation
    logSubscriptionAction({
        action: AUDIT_EVENT_TYPES.REGULATORY_REPORT_GENERATED,
        userId: 'SYSTEM',
        severity: AUDIT_SEVERITY.INFO,
        metadata: {
            reportId: report.reportId,
            countryCode,
            logsAnalyzed: countryLogs.length,
            recommendationsCount: report.recommendations.length
        }
    });
    
    return report;
}

/**
 * Monitor subscription health
 * @returns {Object} Health status
 */
export function monitorSubscriptionHealth() {
    const stats = getAuditStatistics();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    // Get recent logs
    const recentLogs = getSystemAuditLogs({
        startDate: oneHourAgo.toISOString()
    });
    
    const health = {
        status: 'HEALTHY',
        timestamp: now.toISOString(),
        stats,
        recentActivity: {
            total: recentLogs.total,
            errors: recentLogs.logs.filter(l => l.severity === 'ERROR').length,
            warnings: recentLogs.logs.filter(l => l.severity === 'WARNING').length,
            securityAlerts: recentLogs.logs.filter(l => l.severity === 'SECURITY').length
        },
        issues: []
    };
    
    // Check for issues
    if (health.recentActivity.errors > 10) {
        health.status = 'DEGRADED';
        health.issues.push({
            type: 'ERROR_RATE_HIGH',
            severity: 'HIGH',
            description: `High error rate: ${health.recentActivity.errors} errors in last hour`
        });
    }
    
    if (health.recentActivity.securityAlerts > 5) {
        health.status = 'DEGRADED';
        health.issues.push({
            type: 'SECURITY_ALERTS',
            severity: 'HIGH',
            description: `Multiple security alerts: ${health.recentActivity.securityAlerts} in last hour`
        });
    }
    
    // Check storage
    if (stats.storageEstimate > 100 * 1024 * 1024) { // 100MB
        health.issues.push({
            type: 'STORAGE_LIMIT',
            severity: 'MEDIUM',
            description: `Audit logs storage approaching limit: ${Math.round(stats.storageEstimate / 1024 / 1024)}MB`
        });
    }
    
    return health;
}

// Export default
export default {
    AUDIT_EVENT_TYPES,
    AUDIT_SEVERITY,
    logSubscriptionAction,
    getUserAuditLogs,
    getSystemAuditLogs,
    exportAuditLogs,
    verifyAuditIntegrity,
    getAuditStatistics,
    clearAuditLogs,
    logSubscriptionActivation,
    logSubscriptionRenewal,
    logSubscriptionExpiry,
    logLendingActivity,
    logPaymentActivity,
    logGateCheck,
    logAdminOverride,
    generateComplianceReport,
    monitorSubscriptionHealth
};