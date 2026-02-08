// features/audit-flow.js
// Audit trail orchestration: logging, review, exports

class AuditFlow {
    constructor() {
        this.auditLogs = [];
        this.MAX_LOG_SIZE = 1000; // Keep last 1000 logs
        this.auditEnabled = true;
        this.init();
    }

    init() {
        // Load existing audit logs
        this.loadAuditLogs();
        
        // Set up audit log cleanup
        this.setupCleanup();
        
        // Start periodic backup
        this.startPeriodicBackup();
        
        console.log('Audit Flow initialized');
    }

    // Log an audit event
    logEvent(event) {
        if (!this.auditEnabled) return;
        
        const auditEvent = {
            id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ipAddress: this.getClientIP(), // Note: Client-side IP detection is limited
            ...event
        };
        
        // Add to logs
        this.auditLogs.push(auditEvent);
        
        // Trim if too large
        if (this.auditLogs.length > this.MAX_LOG_SIZE) {
            this.auditLogs = this.auditLogs.slice(-this.MAX_LOG_SIZE);
        }
        
        // Save to storage
        this.saveAuditLogs();
        
        // Emit event for real-time monitoring
        this.emitAuditEvent(auditEvent);
        
        return auditEvent;
    }

    // Log user authentication events
    logAuthEvent(action, userId, details = {}) {
        return this.logEvent({
            category: 'authentication',
            action,
            userId,
            details,
            severity: action.includes('failed') ? 'medium' : 'low'
        });
    }

    // Log financial events (loans, repayments, etc.)
    logFinancialEvent(category, action, amount, currency, userId, details = {}) {
        return this.logEvent({
            category: 'financial',
            subcategory: category,
            action,
            amount,
            currency,
            userId,
            details,
            severity: amount > 10000 ? 'high' : 'medium'
        });
    }

    // Log admin actions
    logAdminEvent(action, adminId, targetId, details = {}) {
        return this.logEvent({
            category: 'admin',
            action,
            adminId,
            targetId,
            details,
            severity: 'high'
        });
    }

    // Log blacklist events
    logBlacklistEvent(action, borrowerId, amount, currency, adminId, details = {}) {
        return this.logEvent({
            category: 'blacklist',
            action,
            borrowerId,
            amount,
            currency,
            adminId,
            details,
            severity: 'high'
        });
    }

    // Log subscription events
    logSubscriptionEvent(action, userId, plan, amount, currency, details = {}) {
        return this.logEvent({
            category: 'subscription',
            action,
            userId,
            plan,
            amount,
            currency,
            details,
            severity: 'medium'
        });
    }

    // Log group events
    logGroupEvent(action, groupId, userId, details = {}) {
        return this.logEvent({
            category: 'group',
            action,
            groupId,
            userId,
            details,
            severity: 'low'
        });
    }

    // Log system events
    logSystemEvent(action, component, details = {}) {
        return this.logEvent({
            category: 'system',
            action,
            component,
            details,
            severity: details.error ? 'high' : 'low'
        });
    }

    // Get audit logs with filtering
    getAuditLogs(filters = {}) {
        let filteredLogs = [...this.auditLogs];
        
        // Apply filters
        if (filters.category) {
            filteredLogs = filteredLogs.filter(log => log.category === filters.category);
        }
        
        if (filters.userId) {
            filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
        }
        
        if (filters.startDate) {
            const start = new Date(filters.startDate);
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
        }
        
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= end);
        }
        
        if (filters.severity) {
            filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
        }
        
        if (filters.action) {
            filteredLogs = filteredLogs.filter(log => log.action.includes(filters.action));
        }
        
        // Sort by timestamp (newest first)
        filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return filteredLogs;
    }

    // Search audit logs
    searchAuditLogs(query) {
        if (!query) return this.auditLogs;
        
        const searchTerm = query.toLowerCase();
        return this.auditLogs.filter(log => {
            return (
                (log.userId && log.userId.toLowerCase().includes(searchTerm)) ||
                (log.action && log.action.toLowerCase().includes(searchTerm)) ||
                (log.category && log.category.toLowerCase().includes(searchTerm)) ||
                (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm))
            );
        });
    }

    // Export audit logs
    exportAuditLogs(format = 'json', filters = {}) {
        const logs = this.getAuditLogs(filters);
        
        switch (format.toLowerCase()) {
            case 'json':
                return this.exportAsJSON(logs);
            case 'csv':
                return this.exportAsCSV(logs);
            case 'pdf':
                return this.exportAsPDF(logs);
            default:
                return this.exportAsJSON(logs);
        }
    }

    // Export as JSON
    exportAsJSON(logs) {
        const data = {
            exportDate: new Date().toISOString(),
            totalLogs: logs.length,
            logs
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        return {
            url,
            filename: `audit-logs_${new Date().toISOString().split('T')[0]}.json`,
            type: 'application/json'
        };
    }

    // Export as CSV
    exportAsCSV(logs) {
        const headers = ['Timestamp', 'Category', 'Action', 'User ID', 'Severity', 'Details'];
        const rows = logs.map(log => [
            log.timestamp,
            log.category,
            log.action,
            log.userId || 'N/A',
            log.severity,
            JSON.stringify(log.details || {})
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        return {
            url,
            filename: `audit-logs_${new Date().toISOString().split('T')[0]}.csv`,
            type: 'text/csv'
        };
    }

    // Export as PDF (simplified - in reality would use a PDF library)
    exportAsPDF(logs) {
        console.log('PDF export would require a PDF library like jsPDF');
        // For now, return JSON as fallback
        return this.exportAsJSON(logs);
    }

    // Generate audit report
    generateAuditReport(filters = {}) {
        const logs = this.getAuditLogs(filters);
        
        // Calculate statistics
        const stats = {
            totalLogs: logs.length,
            byCategory: this.groupBy(logs, 'category'),
            bySeverity: this.groupBy(logs, 'severity'),
            byDay: this.groupByDate(logs, 'day'),
            byHour: this.groupByDate(logs, 'hour'),
            topUsers: this.getTopUsers(logs),
            frequentActions: this.getFrequentActions(logs)
        };
        
        // Calculate time range
        if (logs.length > 0) {
            const timestamps = logs.map(log => new Date(log.timestamp));
            stats.timeRange = {
                start: new Date(Math.min(...timestamps)).toISOString(),
                end: new Date(Math.max(...timestamps)).toISOString(),
                duration: this.formatDuration(
                    new Date(Math.max(...timestamps)) - new Date(Math.min(...timestamps))
                )
            };
        }
        
        return {
            generatedAt: new Date().toISOString(),
            filters,
            stats,
            sampleLogs: logs.slice(0, 10) // First 10 logs as sample
        };
    }

    // Group logs by property
    groupBy(logs, property) {
        return logs.reduce((groups, log) => {
            const key = log[property] || 'unknown';
            groups[key] = (groups[key] || 0) + 1;
            return groups;
        }, {});
    }

    // Group logs by date
    groupByDate(logs, granularity = 'day') {
        const groups = {};
        
        logs.forEach(log => {
            const date = new Date(log.timestamp);
            let key;
            
            switch (granularity) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'hour':
                    key = `${date.toISOString().split('T')[0]} ${date.getHours()}:00`;
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                default:
                    key = date.toISOString().split('T')[0];
            }
            
            groups[key] = (groups[key] || 0) + 1;
        });
        
        return groups;
    }

    // Get top users by activity
    getTopUsers(logs, limit = 10) {
        const userCounts = {};
        
        logs.forEach(log => {
            if (log.userId) {
                userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
            }
        });
        
        return Object.entries(userCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([userId, count]) => ({ userId, count }));
    }

    // Get frequent actions
    getFrequentActions(logs, limit = 10) {
        const actionCounts = {};
        
        logs.forEach(log => {
            const key = `${log.category}.${log.action}`;
            actionCounts[key] = (actionCounts[key] || 0) + 1;
        });
        
        return Object.entries(actionCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([action, count]) => ({ action, count }));
    }

    // Format duration
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} days`;
        if (hours > 0) return `${hours} hours`;
        if (minutes > 0) return `${minutes} minutes`;
        return `${seconds} seconds`;
    }

    // Save audit logs to storage
    saveAuditLogs() {
        try {
            localStorage.setItem('mpesewa_audit_logs', JSON.stringify(this.auditLogs));
        } catch (error) {
            console.error('Failed to save audit logs:', error);
            
            // If storage is full, try to clear old logs
            if (error.name === 'QuotaExceededError') {
                this.clearOldLogs();
                this.saveAuditLogs();
            }
        }
    }

    // Load audit logs from storage
    loadAuditLogs() {
        try {
            const stored = localStorage.getItem('mpesewa_audit_logs');
            if (stored) {
                this.auditLogs = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load audit logs:', error);
            this.auditLogs = [];
        }
    }

    // Clear old logs
    clearOldLogs() {
        // Keep only the last 500 logs
        if (this.auditLogs.length > 500) {
            this.auditLogs = this.auditLogs.slice(-500);
            console.log('Cleared old audit logs, kept 500 most recent');
        }
    }

    // Set up automatic cleanup
    setupCleanup() {
        // Clean up old logs daily
        setInterval(() => {
            this.cleanupOldLogs();
        }, 24 * 60 * 60 * 1000); // 24 hours
    }

    // Clean up logs older than 30 days
    cleanupOldLogs() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const initialCount = this.auditLogs.length;
        this.auditLogs = this.auditLogs.filter(log => {
            return new Date(log.timestamp) > thirtyDaysAgo;
        });
        
        if (this.auditLogs.length < initialCount) {
            console.log(`Cleaned up ${initialCount - this.auditLogs.length} old audit logs`);
            this.saveAuditLogs();
        }
    }

    // Start periodic backup
    startPeriodicBackup() {
        // Backup every 6 hours
        setInterval(() => {
            this.backupAuditLogs();
        }, 6 * 60 * 60 * 1000);
    }

    // Backup audit logs
    backupAuditLogs() {
        const backup = {
            timestamp: new Date().toISOString(),
            logs: this.auditLogs
        };
        
        try {
            // Store in separate backup key
            localStorage.setItem('mpesewa_audit_backup', JSON.stringify(backup));
            console.log('Audit logs backed up');
        } catch (error) {
            console.error('Failed to backup audit logs:', error);
        }
    }

    // Restore from backup
    restoreFromBackup() {
        try {
            const backup = localStorage.getItem('mpesewa_audit_backup');
            if (backup) {
                const parsed = JSON.parse(backup);
                this.auditLogs = parsed.logs || [];
                this.saveAuditLogs();
                console.log('Audit logs restored from backup');
                return true;
            }
        } catch (error) {
            console.error('Failed to restore from backup:', error);
        }
        return false;
    }

    // Get client IP (limited client-side implementation)
    getClientIP() {
        // Note: This is a simplified version. Real IP detection requires server-side.
        return 'client-ip-not-available';
    }

    // Emit audit event for real-time monitoring
    emitAuditEvent(event) {
        const customEvent = new CustomEvent('audit-event', {
            detail: event
        });
        window.dispatchEvent(customEvent);
    }

    // Enable/disable audit logging
    setAuditEnabled(enabled) {
        this.auditEnabled = enabled;
        
        this.logSystemEvent(
            enabled ? 'audit_enabled' : 'audit_disabled',
            'audit-flow',
            { enabled }
        );
        
        return enabled;
    }

    // Get audit statistics
    getStatistics() {
        return {
            totalLogs: this.auditLogs.length,
            logsToday: this.getTodaysLogCount(),
            logsThisWeek: this.getThisWeeksLogCount(),
            logsThisMonth: this.getThisMonthsLogCount(),
            byCategory: this.groupBy(this.auditLogs, 'category'),
            bySeverity: this.groupBy(this.auditLogs, 'severity'),
            enabled: this.auditEnabled
        };
    }

    // Get today's log count
    getTodaysLogCount() {
        const today = new Date().toISOString().split('T')[0];
        return this.auditLogs.filter(log => 
            log.timestamp.startsWith(today)
        ).length;
    }

    // Get this week's log count
    getThisWeeksLogCount() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return this.auditLogs.filter(log => 
            new Date(log.timestamp) > oneWeekAgo
        ).length;
    }

    // Get this month's log count
    getThisMonthsLogCount() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return this.auditLogs.filter(log => 
            new Date(log.timestamp) > oneMonthAgo
        ).length;
    }

    // Clear all audit logs (admin only)
    clearAllLogs() {
        const count = this.auditLogs.length;
        this.auditLogs = [];
        localStorage.removeItem('mpesewa_audit_logs');
        
        // Log the clearance
        this.logSystemEvent('audit_logs_cleared', 'audit-flow', { clearedCount: count });
        
        return count;
    }

    // Export for regulatory compliance
    exportComplianceReport() {
        const logs = this.auditLogs;
        
        // Filter for compliance-relevant logs
        const complianceLogs = logs.filter(log => 
            ['financial', 'admin', 'blacklist', 'authentication'].includes(log.category)
        );
        
        return this.exportAsJSON(complianceLogs);
    }
}

// Export singleton instance
const auditFlow = new AuditFlow();
window.AuditFlow = auditFlow;
export default auditFlow;