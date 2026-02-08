/**
 * M-PESEWA TELEMETRY & AUDIT SYSTEM
 * Logs all important actions for compliance and monitoring
 */

class MpesewaTelemetry {
    constructor() {
        this.config = {
            enabled: true,
            logLevel: 'info', // debug, info, warn, error, critical
            maxLogEntries: 10000,
            flushInterval: 60000, // 1 minute
            sessionId: this.generateSessionId(),
            appVersion: '1.0.0',
            environment: this.getEnvironment()
        };
        
        this.logBuffer = [];
        this.metrics = new Map();
        this.userJourney = [];
        
        // Initialize telemetry
        this.init();
    }
    
    init() {
        // Load existing logs
        this.loadPersistedLogs();
        
        // Set up periodic flush
        this.flushInterval = setInterval(() => this.flush(), this.config.flushInterval);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Set up error boundary integration
        if (window.mpesewaErrorBoundary) {
            this.setupErrorIntegration();
        }
        
        // Log session start
        this.logSessionStart();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
    
    setupEventListeners() {
        if (!window.mpesewaEventBus) return;
        
        // Core events to track
        const eventsToTrack = [
            'auth:login',
            'auth:logout',
            'auth:register',
            'country:selected',
            'group:joined',
            'group:created',
            'lender:subscription:active',
            'lender:subscription:expired',
            'lender:loan:approved',
            'lender:loan:rejected',
            'borrower:loan:requested',
            'borrower:loan:disbursed',
            'borrower:repayment:made',
            'borrower:blacklisted',
            'borrower:reinstated',
            'ledger:created',
            'ledger:updated',
            'ledger:cleared',
            'ledger:defaulted',
            'admin:override:blacklist',
            'admin:override:ledger',
            'sync:started',
            'sync:completed',
            'sync:failed',
            'permission:violation',
            'hierarchy:violation'
        ];
        
        eventsToTrack.forEach(eventName => {
            window.mpesewaEventBus.subscribe(eventName, (data) => {
                this.trackEvent(eventName, data);
            });
        });
    }
    
    setupPerformanceMonitoring() {
        // Page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                this.logPerformance('page_load', {
                    dns: perfData.domainLookupEnd - perfData.domainLookupStart,
                    tcp: perfData.connectEnd - perfData.connectStart,
                    request: perfData.responseStart - perfData.requestStart,
                    response: perfData.responseEnd - perfData.responseStart,
                    domLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    pageLoaded: perfData.loadEventEnd - perfData.loadEventStart,
                    total: perfData.duration
                });
            }
        });
        
        // Memory monitoring (if available)
        if (performance.memory) {
            setInterval(() => {
                this.logPerformance('memory_usage', {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                });
            }, 30000);
        }
        
        // Network monitoring
        this.setupNetworkMonitoring();
    }
    
    setupNetworkMonitoring() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                this.logPerformance('network_request', {
                    url: args[0],
                    method: args[1]?.method || 'GET',
                    duration: endTime - startTime,
                    status: response.status,
                    statusText: response.statusText,
                    size: response.headers.get('content-length')
                });
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                this.logPerformance('network_error', {
                    url: args[0],
                    method: args[1]?.method || 'GET',
                    duration: endTime - startTime,
                    error: error.message
                });
                throw error;
            }
        };
    }
    
    setupErrorIntegration() {
        window.mpesewaErrorBoundary.subscribe('error_occurred', (errorData) => {
            this.logError(errorData.error, {
                type: 'application_error',
                context: errorData.context,
                severity: 'error'
            });
        });
    }
    
    logSessionStart() {
        const sessionData = {
            sessionId: this.config.sessionId,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            platform: navigator.platform,
            referrer: document.referrer,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
        
        this.log('session_start', 'info', sessionData);
    }
    
    // MAIN LOGGING METHODS
    
    log(action, level = 'info', data = {}) {
        if (!this.config.enabled) return;
        
        // Check log level
        const levels = { debug: 0, info: 1, warn: 2, error: 3, critical: 4 };
        if (levels[level] < levels[this.config.logLevel]) return;
        
        const logEntry = {
            id: this.generateLogId(),
            timestamp: new Date().toISOString(),
            sessionId: this.config.sessionId,
            action,
            level,
            data,
            user: this.getCurrentUser(),
            country: localStorage.getItem('mpesewa_country'),
            group: localStorage.getItem('mpesewa_current_group'),
            url: window.location.href,
            appVersion: this.config.appVersion,
            environment: this.config.environment
        };
        
        // Add to buffer
        this.logBuffer.push(logEntry);
        
        // Add to user journey
        if (['info', 'warn', 'error', 'critical'].includes(level)) {
            this.userJourney.push({
                timestamp: logEntry.timestamp,
                action,
                level,
                url: logEntry.url
            });
            
            // Keep journey manageable
            if (this.userJourney.length > 1000) {
                this.userJourney.shift();
            }
        }
        
        // Persist if critical
        if (level === 'critical' || level === 'error') {
            this.persistLog(logEntry);
        }
        
        // Console output in development
        if (this.config.environment === 'development') {
            this.consoleLog(level, logEntry);
        }
        
        // Check buffer size
        if (this.logBuffer.length >= 100) {
            this.flush();
        }
        
        return logEntry.id;
    }
    
    trackEvent(eventName, eventData) {
        return this.log(`event:${eventName}`, 'info', {
            event: eventName,
            eventData,
            hierarchy: eventData.hierarchy,
            source: eventData.source
        });
    }
    
    logError(error, context = {}) {
        return this.log('error_occurred', 'error', {
            error: {
                message: error.message,
                name: error.name,
                stack: error.stack
            },
            context,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }
    
    logPerformance(metricName, data) {
        // Update metrics
        if (!this.metrics.has(metricName)) {
            this.metrics.set(metricName, {
                count: 0,
                sum: 0,
                min: Infinity,
                max: -Infinity,
                values: []
            });
        }
        
        const metric = this.metrics.get(metricName);
        const value = data.duration || data.value || 0;
        
        metric.count++;
        metric.sum += value;
        metric.min = Math.min(metric.min, value);
        metric.max = Math.max(metric.max, value);
        metric.values.push(value);
        
        // Keep only last 100 values
        if (metric.values.length > 100) {
            metric.values.shift();
        }
        
        // Log if it's an outlier
        if (value > 1000) { // More than 1 second
            this.log(`performance:${metricName}`, 'warn', {
                metric: metricName,
                value,
                threshold: 1000,
                data
            });
        }
    }
    
    logUserAction(action, data = {}) {
        // Track important user actions for analytics
        const importantActions = [
            'loan_requested',
            'loan_approved',
            'loan_rejected',
            'repayment_made',
            'subscription_purchased',
            'group_joined',
            'group_created',
            'blacklist_applied',
            'rating_given'
        ];
        
        if (importantActions.includes(action)) {
            return this.log(`user_action:${action}`, 'info', {
                action,
                ...data,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    logBusinessRule(action, rule, data = {}) {
        // Log business rule executions
        return this.log(`business_rule:${action}`, 'info', {
            rule,
            ...data,
            timestamp: new Date().toISOString()
        });
    }
    
    // HELPER METHODS
    
    generateLogId() {
        return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getCurrentUser() {
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
    
    consoleLog(level, logEntry) {
        const colors = {
            debug: 'color: gray',
            info: 'color: blue',
            warn: 'color: orange',
            error: 'color: red',
            critical: 'color: red; font-weight: bold'
        };
        
        console.groupCollapsed(
            `%cM-Pesewa ${level.toUpperCase()}: ${logEntry.action}`,
            colors[level] || 'color: black'
        );
        console.log('Timestamp:', logEntry.timestamp);
        console.log('Session:', logEntry.sessionId);
        console.log('User:', logEntry.user);
        console.log('Data:', logEntry.data);
        console.groupEnd();
    }
    
    persistLog(logEntry) {
        try {
            const persistedLogs = JSON.parse(localStorage.getItem('mpesewa_persisted_logs') || '[]');
            persistedLogs.unshift(logEntry);
            
            // Keep only last 1000 logs
            if (persistedLogs.length > 1000) {
                persistedLogs.pop();
            }
            
            localStorage.setItem('mpesewa_persisted_logs', JSON.stringify(persistedLogs));
        } catch (e) {
            console.warn('Failed to persist log:', e);
        }
    }
    
    loadPersistedLogs() {
        try {
            const persistedLogs = JSON.parse(localStorage.getItem('mpesewa_persisted_logs') || '[]');
            this.logBuffer = persistedLogs.concat(this.logBuffer);
        } catch (e) {
            console.warn('Failed to load persisted logs:', e);
        }
    }
    
    flush() {
        if (this.logBuffer.length === 0) return;
        
        // In a real app, this would send logs to a server
        // For now, we'll just clear the buffer after persisting
        
        // Save important logs to localStorage
        const importantLogs = this.logBuffer.filter(log => 
            ['error', 'critical', 'warn'].includes(log.level) ||
            log.action.includes('business_rule') ||
            log.action.includes('permission_violation') ||
            log.action.includes('hierarchy_violation')
        );
        
        if (importantLogs.length > 0) {
            this.saveToAuditLog(importantLogs);
        }
        
        // Clear buffer
        this.logBuffer = [];
    }
    
    saveToAuditLog(logs) {
        try {
            const auditLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
            auditLogs.unshift(...logs);
            
            // Keep only last 5000 audit logs
            if (auditLogs.length > 5000) {
                auditLogs.splice(5000);
            }
            
            localStorage.setItem('mpesewa_audit_logs', JSON.stringify(auditLogs));
        } catch (e) {
            console.warn('Failed to save audit logs:', e);
        }
    }
    
    // PUBLIC API METHODS
    
    getLogs(filter = {}) {
        let logs = [...this.logBuffer];
        
        // Load from persisted logs if needed
        if (filter.limit && logs.length < filter.limit) {
            try {
                const persisted = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
                logs = logs.concat(persisted);
            } catch (e) {
                // Ignore
            }
        }
        
        // Apply filters
        if (filter.level) {
            logs = logs.filter(log => log.level === filter.level);
        }
        
        if (filter.action) {
            logs = logs.filter(log => log.action === filter.action);
        }
        
        if (filter.userId) {
            logs = logs.filter(log => log.user.id === filter.userId);
        }
        
        if (filter.startDate) {
            const start = new Date(filter.startDate);
            logs = logs.filter(log => new Date(log.timestamp) >= start);
        }
        
        if (filter.endDate) {
            const end = new Date(filter.endDate);
            logs = logs.filter(log => new Date(log.timestamp) <= end);
        }
        
        // Sort by timestamp (newest first)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Apply limit
        if (filter.limit) {
            logs = logs.slice(0, filter.limit);
        }
        
        return logs;
    }
    
    getMetrics() {
        const metricsSummary = {};
        
        for (const [name, data] of this.metrics.entries()) {
            if (data.count > 0) {
                metricsSummary[name] = {
                    count: data.count,
                    average: data.sum / data.count,
                    min: data.min,
                    max: data.max,
                    latest: data.values[data.values.length - 1] || 0
                };
            }
        }
        
        return metricsSummary;
    }
    
    getUserJourney(userId = null) {
        if (userId) {
            // Get logs for specific user
            const userLogs = this.getLogs({ userId });
            return userLogs.map(log => ({
                timestamp: log.timestamp,
                action: log.action,
                level: log.level,
                url: log.url,
                data: log.data
            }));
        }
        
        return this.userJourney;
    }
    
    getBusinessRuleLogs() {
        return this.getLogs({ action: 'business_rule' });
    }
    
    getPermissionViolations() {
        return this.getLogs({ action: 'permission_violation' });
    }
    
    getHierarchyViolations() {
        return this.getLogs({ action: 'hierarchy_violation' });
    }
    
    getErrorStats() {
        const logs = this.getLogs({ level: 'error' });
        const stats = {
            total: logs.length,
            byAction: {},
            byUser: {},
            byHour: {}
        };
        
        logs.forEach(log => {
            // Count by action
            stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
            
            // Count by user
            stats.byUser[log.user.id] = (stats.byUser[log.user.id] || 0) + 1;
            
            // Count by hour
            const hour = new Date(log.timestamp).getHours();
            stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
        });
        
        return stats;
    }
    
    getPerformanceReport() {
        const metrics = this.getMetrics();
        const performanceLogs = this.getLogs({ action: 'performance' });
        
        return {
            metrics,
            slowRequests: performanceLogs.filter(log => 
                log.data.value > 1000 || log.data.duration > 1000
            ),
            pageLoadTimes: metrics['page_load'] || {},
            networkPerformance: metrics['network_request'] || {}
        };
    }
    
    exportLogs(format = 'json') {
        const logs = this.getLogs({ limit: 1000 });
        
        if (format === 'json') {
            return JSON.stringify(logs, null, 2);
        } else if (format === 'csv') {
            // Convert to CSV
            const headers = ['timestamp', 'level', 'action', 'user_id', 'country', 'group', 'url'];
            const rows = logs.map(log => [
                log.timestamp,
                log.level,
                log.action,
                log.user.id,
                log.country,
                log.group,
                log.url
            ]);
            
            return [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');
        }
        
        return logs;
    }
    
    clearLogs() {
        this.logBuffer = [];
        this.userJourney = [];
        this.metrics.clear();
        
        // Clear persisted logs
        localStorage.removeItem('mpesewa_audit_logs');
        localStorage.removeItem('mpesewa_persisted_logs');
        
        this.log('logs_cleared', 'info', { clearedBy: this.getCurrentUser() });
    }
    
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('config_updated', 'info', { config: this.config });
    }
    
    enable() {
        this.config.enabled = true;
        this.log('telemetry_enabled', 'info');
    }
    
    disable() {
        this.config.enabled = false;
        this.log('telemetry_disabled', 'info');
    }
    
    destroy() {
        // Clean up
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
        }
        
        // Flush remaining logs
        this.flush();
        
        this.log('telemetry_destroyed', 'info');
    }
}

// Create global instance
window.mpesewaTelemetry = new MpesewaTelemetry();

// Export for module systems
export default MpesewaTelemetry;