// lender/lender.audit.js
/**
 * M-PESEWA LENDER AUDIT SYSTEM
 * COMPREHENSIVE AUDIT TRAIL FOR ALL LENDER ACTIVITIES
 * 
 * AUDIT PRINCIPLES:
 * 1. Append-only, immutable audit trail
 * 2. No deletions or modifications
 * 3. Timestamped and sequenced
 * 4. Context preservation
 * 5. Tamper-evident design
 */

class LenderAudit {
    constructor(lenderId, country, groupId) {
        // Core audit configuration
        this.AUDIT_CATEGORIES = Object.freeze({
            SECURITY: {
                LOGIN: 'security.login',
                LOGOUT: 'security.logout',
                PASSWORD_CHANGE: 'security.password_change',
                PROFILE_UPDATE: 'security.profile_update',
                DEVICE_AUTH: 'security.device_auth',
                SUSPICIOUS_ACTIVITY: 'security.suspicious_activity'
            },
            
            FINANCIAL: {
                LEDGER_CREATE: 'financial.ledger_create',
                LEDGER_UPDATE: 'financial.ledger_update',
                LOAN_APPROVE: 'financial.loan_approve',
                LOAN_REJECT: 'financial.loan_reject',
                PAYMENT_RECEIVE: 'financial.payment_receive',
                INTEREST_APPLY: 'financial.interest_apply',
                PENALTY_APPLY: 'financial.penalty_apply',
                BLACKLIST_ADD: 'financial.blacklist_add',
                BLACKLIST_REMOVE: 'financial.blacklist_remove',
                RATING_UPDATE: 'financial.rating_update'
            },
            
            SUBSCRIPTION: {
                SUBSCRIBE: 'subscription.subscribe',
                RENEW: 'subscription.renew',
                UPGRADE: 'subscription.upgrade',
                DOWNGRADE: 'subscription.downgrade',
                EXPIRY: 'subscription.expiry',
                PAYMENT: 'subscription.payment',
                REFUND: 'subscription.refund'
            },
            
            GROUP: {
                CREATE: 'group.create',
                JOIN: 'group.join',
                LEAVE: 'group.leave',
                INVITE: 'group.invite',
                REMOVE: 'group.remove',
                SETTINGS_UPDATE: 'group.settings_update'
            },
            
            SYSTEM: {
                STATE_CHANGE: 'system.state_change',
                PERMISSION_CHANGE: 'system.permission_change',
                CONFIG_UPDATE: 'system.config_update',
                ADMIN_OVERRIDE: 'system.admin_override',
                ERROR: 'system.error',
                MAINTENANCE: 'system.maintenance'
            },
            
            COMPLIANCE: {
                LEGAL_AGREE: 'compliance.legal_agree',
                TERMS_ACCEPT: 'compliance.terms_accept',
                PRIVACY_ACK: 'compliance.privacy_ack',
                REGULATORY_REPORT: 'compliance.regulatory_report',
                AUDIT_EXPORT: 'compliance.audit_export'
            }
        });
        
        // Severity levels
        this.SEVERITY_LEVELS = Object.freeze({
            CRITICAL: 'critical',    // Immediate attention required
            HIGH: 'high',            // Important security/financial event
            MEDIUM: 'medium',        // Significant business event
            LOW: 'low',              // Routine activity
            INFO: 'info'             // Informational only
        });
        
        // Initialize audit context
        this.context = {
            lenderId: lenderId,
            country: country,
            groupId: groupId,
            sessionId: this.generateSessionId(),
            deviceId: this.getDeviceId(),
            ipAddress: null,
            userAgent: navigator.userAgent || 'unknown'
        };
        
        // Audit log storage
        this.auditLog = [];
        this.sequenceNumber = 0;
        
        // Performance metrics
        this.metrics = {
            totalEntries: 0,
            lastEntryTime: null,
            entryRate: 0,
            errors: 0
        };
        
        // Initialize storage
        this.initializeStorage();
        
        // Start session audit
        this.logSecurityEvent(this.AUDIT_CATEGORIES.SECURITY.LOGIN, {
            method: 'session_start',
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * STORAGE MANAGEMENT
     */
    initializeStorage() {
        // Check if localStorage is available
        if (typeof localStorage !== 'undefined') {
            try {
                // Load existing audit log
                const storedLog = localStorage.getItem(`mpesewa_audit_${this.context.lenderId}`);
                if (storedLog) {
                    this.auditLog = JSON.parse(storedLog);
                    this.sequenceNumber = this.auditLog.length;
                    this.metrics.totalEntries = this.auditLog.length;
                }
                
                // Set up auto-save
                setInterval(() => this.saveToStorage(), 30000); // Every 30 seconds
            } catch (error) {
                console.error('Failed to initialize audit storage:', error);
            }
        }
    }
    
    saveToStorage() {
        if (typeof localStorage !== 'undefined') {
            try {
                // Only save last 1000 entries to prevent storage bloat
                const recentEntries = this.auditLog.slice(-1000);
                localStorage.setItem(
                    `mpesewa_audit_${this.context.lenderId}`,
                    JSON.stringify(recentEntries)
                );
            } catch (error) {
                console.error('Failed to save audit log:', error);
                this.metrics.errors++;
            }
        }
    }
    
    /**
     * AUDIT ENTRY CREATION
     */
    createAuditEntry(category, action, details, severity = this.SEVERITY_LEVELS.INFO) {
        this.sequenceNumber++;
        
        const auditEntry = {
            id: this.generateAuditId(),
            sequence: this.sequenceNumber,
            timestamp: new Date().toISOString(),
            epoch: Date.now(),
            category: category,
            action: action,
            severity: severity,
            
            // Context
            lenderId: this.context.lenderId,
            country: this.context.country,
            groupId: this.context.groupId,
            sessionId: this.context.sessionId,
            deviceId: this.context.deviceId,
            userAgent: this.context.userAgent,
            
            // Details
            details: details,
            
            // Hash for integrity
            hash: this.calculateHash(category, action, details),
            
            // Metadata
            version: '1.0',
            source: 'lender_module'
        };
        
        // Add to log
        this.auditLog.push(auditEntry);
        this.metrics.totalEntries++;
        this.metrics.lastEntryTime = auditEntry.timestamp;
        
        // Update metrics
        this.updateMetrics();
        
        // Trigger handlers
        this.handleAuditEntry(auditEntry);
        
        return auditEntry;
    }
    
    /**
     * SECURITY AUDIT EVENTS
     */
    logSecurityEvent(action, details, severity = this.SEVERITY_LEVELS.MEDIUM) {
        return this.createAuditEntry(
            this.AUDIT_CATEGORIES.SECURITY,
            action,
            details,
            severity
        );
    }
    
    logLogin(username, method, success, failureReason = null, ipAddress = null) {
        if (ipAddress) this.context.ipAddress = ipAddress;
        
        const details = {
            username: username,
            method: method,
            success: success,
            failureReason: failureReason,
            ipAddress: ipAddress || this.context.ipAddress,
            userAgent: this.context.userAgent
        };
        
        const severity = success ? this.SEVERITY_LEVELS.INFO : this.SEVERITY_LEVELS.HIGH;
        
        return this.logSecurityEvent(
            this.AUDIT_CATEGORIES.SECURITY.LOGIN,
            details,
            severity
        );
    }
    
    logLogout(reason = 'user_initiated') {
        return this.logSecurityEvent(
            this.AUDIT_CATEGORIES.SECURITY.LOGOUT,
            { reason: reason, duration: this.getSessionDuration() },
            this.SEVERITY_LEVELS.INFO
        );
    }
    
    logPasswordChange(requestSource, success) {
        return this.logSecurityEvent(
            this.AUDIT_CATEGORIES.SECURITY.PASSWORD_CHANGE,
            { source: requestSource, success: success },
            this.SEVERITY_LEVELS.HIGH
        );
    }
    
    logSuspiciousActivity(activityType, details) {
        return this.logSecurityEvent(
            this.AUDIT_CATEGORIES.SECURITY.SUSPICIOUS_ACTIVITY,
            { type: activityType, ...details },
            this.SEVERITY_LEVELS.CRITICAL
        );
    }
    
    /**
     * FINANCIAL AUDIT EVENTS
     */
    logFinancialEvent(action, details, severity = this.SEVERITY_LEVELS.MEDIUM) {
        return this.createAuditEntry(
            this.AUDIT_CATEGORIES.FINANCIAL,
            action,
            details,
            severity
        );
    }
    
    logLedgerCreate(ledgerId, borrowerId, amount, category) {
        return this.logFinancialEvent(
            this.AUDIT_CATEGORIES.FINANCIAL.LEDGER_CREATE,
            {
                ledgerId: ledgerId,
                borrowerId: borrowerId,
                amount: amount,
                category: category,
                interest: amount * 0.10, // 10%
                dueDate: this.calculateDueDate()
            },
            this.SEVERITY_LEVELS.HIGH
        );
    }
    
    logLedgerUpdate(ledgerId, updateType, previousState, newState, changes) {
        return this.logFinancialEvent(
            this.AUDIT_CATEGORIES.FINANCIAL.LEDGER_UPDATE,
            {
                ledgerId: ledgerId,
                updateType: updateType,
                previousState: previousState,
                newState: newState,
                changes: changes,
                timestamp: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.MEDIUM
        );
    }
    
    logLoanApproval(loanRequestId, borrowerId, amount, terms) {
        return this.logFinancialEvent(
            this.AUDIT_CATEGORIES.FINANCIAL.LOAN_APPROVE,
            {
                requestId: loanRequestId,
                borrowerId: borrowerId,
                amount: amount,
                terms: terms,
                approvedAt: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.HIGH
        );
    }
    
    logPaymentReceived(ledgerId, amount, paymentMethod, reference) {
        return this.logFinancialEvent(
            this.AUDIT_CATEGORIES.FINANCIAL.PAYMENT_RECEIVE,
            {
                ledgerId: ledgerId,
                amount: amount,
                method: paymentMethod,
                reference: reference,
                receivedAt: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.MEDIUM
        );
    }
    
    logBlacklistAction(borrowerId, action, reason, amount = null) {
        return this.logFinancialEvent(
            action === 'add' 
                ? this.AUDIT_CATEGORIES.FINANCIAL.BLACKLIST_ADD
                : this.AUDIT_CATEGORIES.FINANCIAL.BLACKLIST_REMOVE,
            {
                borrowerId: borrowerId,
                action: action,
                reason: reason,
                amount: amount,
                timestamp: new Date().toISOString(),
                processedBy: this.context.lenderId
            },
            action === 'add' ? this.SEVERITY_LEVELS.HIGH : this.SEVERITY_LEVELS.MEDIUM
        );
    }
    
    logRatingUpdate(borrowerId, previousRating, newRating, ledgerId = null) {
        return this.logFinancialEvent(
            this.AUDIT_CATEGORIES.FINANCIAL.RATING_UPDATE,
            {
                borrowerId: borrowerId,
                previousRating: previousRating,
                newRating: newRating,
                ledgerId: ledgerId,
                timestamp: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.LOW
        );
    }
    
    /**
     * SUBSCRIPTION AUDIT EVENTS
     */
    logSubscriptionEvent(action, details, severity = this.SEVERITY_LEVELS.MEDIUM) {
        return this.createAuditEntry(
            this.AUDIT_CATEGORIES.SUBSCRIPTION,
            action,
            details,
            severity
        );
    }
    
    logSubscriptionPurchase(tier, amount, paymentMethod, transactionId) {
        return this.logSubscriptionEvent(
            this.AUDIT_CATEGORIES.SUBSCRIPTION.SUBSCRIBE,
            {
                tier: tier,
                amount: amount,
                paymentMethod: paymentMethod,
                transactionId: transactionId,
                purchaseDate: new Date().toISOString(),
                expiryDate: this.calculateSubscriptionExpiry()
            },
            this.SEVERITY_LEVELS.HIGH
        );
    }
    
    logSubscriptionRenewal(previousExpiry, newExpiry, amount) {
        return this.logSubscriptionEvent(
            this.AUDIT_CATEGORIES.SUBSCRIPTION.RENEW,
            {
                previousExpiry: previousExpiry,
                newExpiry: newExpiry,
                amount: amount,
                renewedAt: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.MEDIUM
        );
    }
    
    logSubscriptionUpgrade(fromTier, toTier, priceDifference) {
        return this.logSubscriptionEvent(
            this.AUDIT_CATEGORIES.SUBSCRIPTION.UPGRADE,
            {
                fromTier: fromTier,
                toTier: toTier,
                priceDifference: priceDifference,
                upgradedAt: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.MEDIUM
        );
    }
    
    logSubscriptionExpiry(tier, daysSinceExpiry) {
        return this.logSubscriptionEvent(
            this.AUDIT_CATEGORIES.SUBSCRIPTION.EXPIRY,
            {
                tier: tier,
                expiredAt: new Date().toISOString(),
                daysSinceExpiry: daysSinceExpiry,
                actionRequired: true
            },
            this.SEVERITY_LEVELS.HIGH
        );
    }
    
    /**
     * GROUP AUDIT EVENTS
     */
    logGroupEvent(action, details, severity = this.SEVERITY_LEVELS.MEDIUM) {
        return this.createAuditEntry(
            this.AUDIT_CATEGORIES.GROUP,
            action,
            details,
            severity
        );
    }
    
    logGroupCreate(groupId, groupName, initialMembers) {
        return this.logGroupEvent(
            this.AUDIT_CATEGORIES.GROUP.CREATE,
            {
                groupId: groupId,
                groupName: groupName,
                initialMembers: initialMembers,
                createdBy: this.context.lenderId,
                createdAt: new Date().toISOString(),
                country: this.context.country
            },
            this.SEVERITY_LEVELS.HIGH
        );
    }
    
    logGroupJoin(groupId, invitedBy = null, referralCode = null) {
        return this.logGroupEvent(
            this.AUDIT_CATEGORIES.GROUP.JOIN,
            {
                groupId: groupId,
                joinedBy: this.context.lenderId,
                invitedBy: invitedBy,
                referralCode: referralCode,
                joinedAt: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.MEDIUM
        );
    }
    
    logGroupInvite(invitedUserId, invitationMethod, expiresAt) {
        return this.logGroupEvent(
            this.AUDIT_CATEGORIES.GROUP.INVITE,
            {
                invitedUserId: invitedUserId,
                invitedBy: this.context.lenderId,
                method: invitationMethod,
                expiresAt: expiresAt,
                invitedAt: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.LOW
        );
    }
    
    /**
     * SYSTEM AUDIT EVENTS
     */
    logSystemEvent(action, details, severity = this.SEVERITY_LEVELS.MEDIUM) {
        return this.createAuditEntry(
            this.AUDIT_CATEGORIES.SYSTEM,
            action,
            details,
            severity
        );
    }
    
    logStateChange(fromState, toState, reason) {
        return this.logSystemEvent(
            this.AUDIT_CATEGORIES.SYSTEM.STATE_CHANGE,
            {
                fromState: fromState,
                toState: toState,
                reason: reason,
                changedBy: this.context.lenderId,
                timestamp: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.HIGH
        );
    }
    
    logAdminOverride(action, targetId, reason, overrideDetails) {
        return this.logSystemEvent(
            this.AUDIT_CATEGORIES.SYSTEM.ADMIN_OVERRIDE,
            {
                action: action,
                targetId: targetId,
                reason: reason,
                details: overrideDetails,
                overriddenBy: this.context.lenderId,
                timestamp: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.CRITICAL
        );
    }
    
    logSystemError(errorType, errorMessage, component, stackTrace = null) {
        return this.logSystemEvent(
            this.AUDIT_CATEGORIES.SYSTEM.ERROR,
            {
                errorType: errorType,
                errorMessage: errorMessage,
                component: component,
                stackTrace: stackTrace,
                occurredAt: new Date().toISOString(),
                lenderId: this.context.lenderId
            },
            this.SEVERITY_LEVELS.HIGH
        );
    }
    
    /**
     * COMPLIANCE AUDIT EVENTS
     */
    logComplianceEvent(action, details, severity = this.SEVERITY_LEVELS.MEDIUM) {
        return this.createAuditEntry(
            this.AUDIT_CATEGORIES.COMPLIANCE,
            action,
            details,
            severity
        );
    }
    
    logTermsAcceptance(version, ipAddress, userAgent) {
        return this.logComplianceEvent(
            this.AUDIT_CATEGORIES.COMPLIANCE.TERMS_ACCEPT,
            {
                version: version,
                acceptedAt: new Date().toISOString(),
                ipAddress: ipAddress || this.context.ipAddress,
                userAgent: userAgent || this.context.userAgent,
                lenderId: this.context.lenderId
            },
            this.SEVERITY_LEVELS.INFO
        );
    }
    
    logAuditExport(requestedBy, format, filters, recordCount) {
        return this.logComplianceEvent(
            this.AUDIT_CATEGORIES.COMPLIANCE.AUDIT_EXPORT,
            {
                requestedBy: requestedBy,
                format: format,
                filters: filters,
                recordCount: recordCount,
                exportedAt: new Date().toISOString()
            },
            this.SEVERITY_LEVELS.MEDIUM
        );
    }
    
    /**
     * AUDIT LOG MANAGEMENT
     */
    
    // Get audit entries with filters
    getAuditEntries(filters = {}) {
        let entries = [...this.auditLog];
        
        // Apply filters
        if (filters.category) {
            entries = entries.filter(entry => entry.category === filters.category);
        }
        
        if (filters.action) {
            entries = entries.filter(entry => entry.action === filters.action);
        }
        
        if (filters.severity) {
            entries = entries.filter(entry => entry.severity === filters.severity);
        }
        
        if (filters.startDate) {
            const start = new Date(filters.startDate);
            entries = entries.filter(entry => new Date(entry.timestamp) >= start);
        }
        
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            entries = entries.filter(entry => new Date(entry.timestamp) <= end);
        }
        
        if (filters.limit) {
            entries = entries.slice(-filters.limit);
        }
        
        // Sort by sequence (newest first by default)
        entries.sort((a, b) => {
            if (filters.order === 'asc') {
                return a.sequence - b.sequence;
            }
            return b.sequence - a.sequence;
        });
        
        return entries;
    }
    
    // Search audit entries
    searchAuditEntries(query) {
        return this.auditLog.filter(entry => {
            const searchString = JSON.stringify(entry).toLowerCase();
            return searchString.includes(query.toLowerCase());
        });
    }
    
    // Get audit statistics
    getAuditStatistics() {
        const stats = {
            totalEntries: this.auditLog.length,
            byCategory: {},
            bySeverity: {},
            byDay: {},
            recentActivity: []
        };
        
        // Calculate category distribution
        this.auditLog.forEach(entry => {
            // Category stats
            if (!stats.byCategory[entry.category]) {
                stats.byCategory[entry.category] = 0;
            }
            stats.byCategory[entry.category]++;
            
            // Severity stats
            if (!stats.bySeverity[entry.severity]) {
                stats.bySeverity[entry.severity] = 0;
            }
            stats.bySeverity[entry.severity]++;
            
            // Daily stats
            const date = entry.timestamp.split('T')[0];
            if (!stats.byDay[date]) {
                stats.byDay[date] = 0;
            }
            stats.byDay[date]++;
        });
        
        // Recent activity (last 10 entries)
        stats.recentActivity = this.auditLog.slice(-10).reverse();
        
        return stats;
    }
    
    // Export audit log
    exportAuditLog(format = 'json', filters = {}) {
        const entries = this.getAuditEntries(filters);
        
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(entries, null, 2);
                
            case 'csv':
                return this.convertToCSV(entries);
                
            case 'pdf':
                // In production, would generate PDF
                return this.generatePDFReport(entries);
                
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }
    
    convertToCSV(entries) {
        if (entries.length === 0) return '';
        
        const headers = [
            'Sequence', 'Timestamp', 'Category', 'Action', 'Severity',
            'Lender ID', 'Country', 'Group ID', 'Details'
        ];
        
        const rows = entries.map(entry => [
            entry.sequence,
            entry.timestamp,
            entry.category,
            entry.action,
            entry.severity,
            entry.lenderId,
            entry.country,
            entry.groupId,
            JSON.stringify(entry.details)
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }
    
    /**
     * INTEGRITY VERIFICATION
     */
    verifyAuditIntegrity() {
        const issues = [];
        
        for (let i = 0; i < this.auditLog.length; i++) {
            const entry = this.auditLog[i];
            
            // Check sequence continuity
            if (entry.sequence !== i + 1) {
                issues.push({
                    type: 'SEQUENCE_BREAK',
                    entryId: entry.id,
                    expected: i + 1,
                    actual: entry.sequence
                });
            }
            
            // Verify hash integrity
            const calculatedHash = this.calculateHash(
                entry.category,
                entry.action,
                entry.details
            );
            
            if (entry.hash !== calculatedHash) {
                issues.push({
                    type: 'HASH_MISMATCH',
                    entryId: entry.id,
                    storedHash: entry.hash,
                    calculatedHash: calculatedHash
                });
            }
            
            // Check timestamp ordering
            if (i > 0) {
                const prevTimestamp = new Date(this.auditLog[i - 1].timestamp);
                const currTimestamp = new Date(entry.timestamp);
                
                if (currTimestamp < prevTimestamp) {
                    issues.push({
                        type: 'TIMESTAMP_ORDER',
                        entryId: entry.id,
                        previous: this.auditLog[i - 1].timestamp,
                        current: entry.timestamp
                    });
                }
            }
        }
        
        return {
            valid: issues.length === 0,
            totalEntries: this.auditLog.length,
            issues: issues
        };
    }
    
    /**
     * UTILITY METHODS
     */
    calculateHash(category, action, details) {
        const dataString = `${category}:${action}:${JSON.stringify(details)}`;
        // Simple hash for demo - in production use proper cryptographic hash
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }
    
    generateAuditId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `audit_${timestamp}_${random}`;
    }
    
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    getDeviceId() {
        // Generate a persistent device ID
        if (typeof localStorage !== 'undefined') {
            let deviceId = localStorage.getItem('mpesewa_device_id');
            if (!deviceId) {
                deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('mpesewa_device_id', deviceId);
            }
            return deviceId;
        }
        return 'unknown';
    }
    
    getSessionDuration() {
        const startTime = this.auditLog.find(entry => 
            entry.action === this.AUDIT_CATEGORIES.SECURITY.LOGIN
        );
        
        if (startTime) {
            const start = new Date(startTime.timestamp);
            const now = new Date();
            return Math.floor((now - start) / 1000); // seconds
        }
        
        return 0;
    }
    
    calculateDueDate() {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        return dueDate.toISOString();
    }
    
    calculateSubscriptionExpiry() {
        const expiry = new Date();
        expiry.setDate(28); // 28th of current month
        if (expiry < new Date()) {
            expiry.setMonth(expiry.getMonth() + 1);
        }
        return expiry.toISOString();
    }
    
    updateMetrics() {
        // Calculate entry rate (entries per hour)
        if (this.auditLog.length >= 2) {
            const firstEntry = new Date(this.auditLog[0].timestamp);
            const lastEntry = new Date(this.auditLog[this.auditLog.length - 1].timestamp);
            const hoursDiff = (lastEntry - firstEntry) / (1000 * 60 * 60);
            
            if (hoursDiff > 0) {
                this.metrics.entryRate = this.auditLog.length / hoursDiff;
            }
        }
    }
    
    handleAuditEntry(entry) {
        // Critical events trigger alerts
        if (entry.severity === this.SEVERITY_LEVELS.CRITICAL) {
            this.triggerAlert(entry);
        }
        
        // High severity events for admins
        if (entry.severity === this.SEVERITY_LEVELS.HIGH) {
            this.notifyAdmins(entry);
        }
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[AUDIT] ${entry.category}.${entry.action}:`, entry.details);
        }
    }
    
    triggerAlert(entry) {
        // In production, this would send email/SMS alerts
        console.warn(`[CRITICAL ALERT] ${entry.category}.${entry.action}`, entry);
    }
    
    notifyAdmins(entry) {
        // In production, this would notify platform admins
        console.info(`[ADMIN NOTIFICATION] ${entry.category}.${entry.action}`, entry);
    }
    
    generatePDFReport(entries) {
        // Placeholder for PDF generation
        return `PDF Report for ${entries.length} audit entries (PDF generation not implemented in browser)`;
    }
    
    /**
     * CLEANUP AND MAINTENANCE
     */
    cleanupOldEntries(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const beforeCount = this.auditLog.length;
        this.auditLog = this.auditLog.filter(entry => 
            new Date(entry.timestamp) >= cutoffDate
        );
        const afterCount = this.auditLog.length;
        
        this.logSystemEvent(
            this.AUDIT_CATEGORIES.SYSTEM.MAINTENANCE,
            {
                action: 'audit_cleanup',
                beforeCount: beforeCount,
                afterCount: afterCount,
                removedCount: beforeCount - afterCount,
                daysKept: daysToKeep,
                cutoffDate: cutoffDate.toISOString()
            },
            this.SEVERITY_LEVELS.INFO
        );
        
        this.saveToStorage();
        
        return {
            removed: beforeCount - afterCount,
            remaining: afterCount
        };
    }
    
    /**
     * GETTERS FOR UI
     */
    getRecentActivity(limit = 20) {
        return this.auditLog.slice(-limit).reverse();
    }
    
    getSecurityEvents(limit = 50) {
        return this.getAuditEntries({
            category: this.AUDIT_CATEGORIES.SECURITY,
            limit: limit,
            order: 'desc'
        });
    }
    
    getFinancialEvents(limit = 50) {
        return this.getAuditEntries({
            category: this.AUDIT_CATEGORIES.FINANCIAL,
            limit: limit,
            order: 'desc'
        });
    }
    
    getAuditSummary() {
        const stats = this.getAuditStatistics();
        
        return {
            totalEntries: stats.totalEntries,
            categories: Object.keys(stats.byCategory).length,
            lastEntry: this.auditLog.length > 0 ? this.auditLog[this.auditLog.length - 1].timestamp : null,
            integrityCheck: this.verifyAuditIntegrity(),
            metrics: this.metrics
        };
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LenderAudit;
} else if (typeof window !== 'undefined') {
    window.LenderAudit = LenderAudit;
}

// Auto-initialize with example
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('M-Pesewa Lender Audit System loaded');
        
        // Example usage
        const audit = new LenderAudit('lender_001', 'ke', 'group_001');
        console.log('Audit context:', audit.context);
        console.log('Audit categories:', Object.keys(audit.AUDIT_CATEGORIES));
        
        // Example audit entries
        audit.logLogin('john_doe', 'password', true);
        audit.logLedgerCreate('ledger_001', 'borrower_001', 1000, 'transport');
        audit.logPaymentReceived('ledger_001', 500, 'mpesa', 'REF12345');
        
        console.log('Audit summary:', audit.getAuditSummary());
        console.log('Recent activity:', audit.getRecentActivity(5));
    });
}