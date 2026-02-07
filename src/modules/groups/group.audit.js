/**
 * M-PESEWA Group Audit System
 * STRICT AUDIT TRAIL: Append-only, immutable, comprehensive logging
 * Non-negotiable audit requirements for regulatory compliance
 */

class GroupAudit {
    constructor() {
        this.auditTypes = this.defineAuditTypes();
        this.severityLevels = this.defineSeverityLevels();
        this.retentionPolicy = this.defineRetentionPolicy();
    }

    /**
     * Define audit event types
     * @returns {object} Audit type definitions
     */
    defineAuditTypes() {
        return {
            // GROUP MANAGEMENT AUDITS
            GROUP_CREATED: {
                code: 'GRP-001',
                description: 'Group creation',
                severity: 'INFO',
                requiredFields: ['groupId', 'adminId', 'groupName', 'country'],
                retention: 'PERMANENT'
            },
            
            GROUP_UPDATED: {
                code: 'GRP-002',
                description: 'Group information update',
                severity: 'INFO',
                requiredFields: ['groupId', 'userId', 'changes'],
                retention: '7_YEARS'
            },
            
            GROUP_STATE_CHANGE: {
                code: 'GRP-003',
                description: 'Group state transition',
                severity: 'WARNING',
                requiredFields: ['groupId', 'userId', 'oldState', 'newState'],
                retention: 'PERMANENT'
            },
            
            // MEMBERSHIP AUDITS
            MEMBER_JOINED: {
                code: 'MEM-001',
                description: 'Member joined group',
                severity: 'INFO',
                requiredFields: ['groupId', 'userId', 'role', 'referrerId'],
                retention: '7_YEARS'
            },
            
            MEMBER_REMOVED: {
                code: 'MEM-002',
                description: 'Member removed from group',
                severity: 'WARNING',
                requiredFields: ['groupId', 'adminId', 'memberId', 'reason'],
                retention: 'PERMANENT'
            },
            
            MEMBER_INVITED: {
                code: 'MEM-003',
                description: 'Member invitation sent',
                severity: 'INFO',
                requiredFields: ['groupId', 'inviterId', 'inviteeEmail', 'inviteCode'],
                retention: '1_YEAR'
            },
            
            // FINANCIAL AUDITS
            LOAN_CREATED: {
                code: 'FIN-001',
                description: 'Loan request created',
                severity: 'INFO',
                requiredFields: ['loanId', 'borrowerId', 'lenderId', 'amount', 'groupId'],
                retention: '10_YEARS'
            },
            
            LOAN_APPROVED: {
                code: 'FIN-002',
                description: 'Loan approval',
                severity: 'INFO',
                requiredFields: ['loanId', 'lenderId', 'approvalDate', 'terms'],
                retention: '10_YEARS'
            },
            
            LOAN_DISBURSED: {
                code: 'FIN-003',
                description: 'Loan disbursement (off-platform)',
                severity: 'INFO',
                requiredFields: ['loanId', 'disbursementMethod', 'disbursementDate'],
                retention: '10_YEARS'
            },
            
            REPAYMENT_RECEIVED: {
                code: 'FIN-004',
                description: 'Loan repayment received',
                severity: 'INFO',
                requiredFields: ['loanId', 'amount', 'repaymentDate', 'remainingBalance'],
                retention: '10_YEARS'
            },
            
            PENALTY_APPLIED: {
                code: 'FIN-005',
                description: 'Late payment penalty applied',
                severity: 'WARNING',
                requiredFields: ['loanId', 'penaltyAmount', 'reason', 'appliedBy'],
                retention: '10_YEARS'
            },
            
            LOAN_DEFAULTED: {
                code: 'FIN-006',
                description: 'Loan marked as defaulted',
                severity: 'CRITICAL',
                requiredFields: ['loanId', 'defaultDate', 'defaultReason', 'amountOutstanding'],
                retention: 'PERMANENT'
            },
            
            // LEDGER AUDITS
            LEDGER_CREATED: {
                code: 'LED-001',
                description: 'Ledger entry created',
                severity: 'INFO',
                requiredFields: ['ledgerId', 'loanId', 'lenderId', 'borrowerId'],
                retention: '10_YEARS'
            },
            
            LEDGER_UPDATED: {
                code: 'LED-002',
                description: 'Ledger entry updated',
                severity: 'INFO',
                requiredFields: ['ledgerId', 'updatedBy', 'changes', 'previousValues'],
                retention: '10_YEARS'
            },
            
            LEDGER_OVERRIDE: {
                code: 'LED-003',
                description: 'Admin ledger override',
                severity: 'HIGH',
                requiredFields: ['ledgerId', 'adminId', 'overrideReason', 'approvalRequired'],
                retention: 'PERMANENT'
            },
            
            // SUBSCRIPTION AUDITS
            SUBSCRIPTION_PURCHASED: {
                code: 'SUB-001',
                description: 'Subscription purchase',
                severity: 'INFO',
                requiredFields: ['userId', 'subscriptionTier', 'amount', 'paymentMethod'],
                retention: '7_YEARS'
            },
            
            SUBSCRIPTION_EXPIRED: {
                code: 'SUB-002',
                description: 'Subscription expiry',
                severity: 'WARNING',
                requiredFields: ['userId', 'subscriptionTier', 'expiryDate', 'autoRenew'],
                retention: '7_YEARS'
            },
            
            SUBSCRIPTION_RENEWED: {
                code: 'SUB-003',
                description: 'Subscription renewal',
                severity: 'INFO',
                requiredFields: ['userId', 'subscriptionTier', 'renewalDate', 'amount'],
                retention: '7_YEARS'
            },
            
            // REPUTATION AUDITS
            USER_RATED: {
                code: 'REP-001',
                description: 'User rating given',
                severity: 'INFO',
                requiredFields: ['raterId', 'rateeId', 'rating', 'loanId', 'comments'],
                retention: '5_YEARS'
            },
            
            BLACKLIST_ADDED: {
                code: 'REP-002',
                description: 'User added to blacklist',
                severity: 'HIGH',
                requiredFields: ['userId', 'addedBy', 'reason', 'amountOwed', 'groupId'],
                retention: 'PERMANENT'
            },
            
            BLACKLIST_REMOVED: {
                code: 'REP-003',
                description: 'User removed from blacklist',
                severity: 'HIGH',
                requiredFields: ['userId', 'removedBy', 'removalReason', 'approvalRequired'],
                retention: 'PERMANENT'
            },
            
            // SECURITY AUDITS
            LOGIN_SUCCESS: {
                code: 'SEC-001',
                description: 'Successful login',
                severity: 'INFO',
                requiredFields: ['userId', 'ipAddress', 'userAgent', 'timestamp'],
                retention: '1_YEAR'
            },
            
            LOGIN_FAILED: {
                code: 'SEC-002',
                description: 'Failed login attempt',
                severity: 'WARNING',
                requiredFields: ['username', 'ipAddress', 'failureReason', 'attemptCount'],
                retention: '90_DAYS'
            },
            
            PASSWORD_CHANGED: {
                code: 'SEC-003',
                description: 'Password change',
                severity: 'INFO',
                requiredFields: ['userId', 'changedBy', 'changeMethod'],
                retention: '1_YEAR'
            },
            
            // ADMIN AUDITS
            ADMIN_ACTION: {
                code: 'ADM-001',
                description: 'Administrative action',
                severity: 'HIGH',
                requiredFields: ['adminId', 'action', 'targetId', 'reason', 'approval'],
                retention: 'PERMANENT'
            },
            
            SYSTEM_OVERRIDE: {
                code: 'ADM-002',
                description: 'System rule override',
                severity: 'CRITICAL',
                requiredFields: ['adminId', 'overrideRule', 'justification', 'approvalLevel'],
                retention: 'PERMANENT'
            },
            
            // COMPLIANCE AUDITS
            DATA_EXPORT: {
                code: 'COM-001',
                description: 'Data export request',
                severity: 'INFO',
                requiredFields: ['userId', 'exportType', 'requestedBy', 'purpose'],
                retention: '7_YEARS'
            },
            
            PRIVACY_REQUEST: {
                code: 'COM-002',
                description: 'Privacy-related request',
                severity: 'INFO',
                requiredFields: ['userId', 'requestType', 'status', 'handledBy'],
                retention: '7_YEARS'
            }
        };
    }

    /**
     * Define severity levels
     * @returns {object} Severity level definitions
     */
    defineSeverityLevels() {
        return {
            INFO: {
                level: 1,
                color: '#007bff',
                icon: 'ℹ️',
                description: 'Informational events'
            },
            WARNING: {
                level: 2,
                color: '#ffc107',
                icon: '⚠️',
                description: 'Potential issues'
            },
            HIGH: {
                level: 3,
                color: '#fd7e14',
                icon: '🔶',
                description: 'Important events requiring attention'
            },
            CRITICAL: {
                level: 4,
                color: '#dc3545',
                icon: '🚨',
                description: 'Critical events requiring immediate action'
            }
        };
    }

    /**
     * Define retention policy
     * @returns {object} Retention policy definitions
     */
    defineRetentionPolicy() {
        return {
            '90_DAYS': {
                days: 90,
                description: 'Temporary logs',
                autoDelete: true
            },
            '1_YEAR': {
                days: 365,
                description: 'Short-term retention',
                autoDelete: true
            },
            '5_YEARS': {
                days: 1825,
                description: 'Medium-term retention',
                autoDelete: false
            },
            '7_YEARS': {
                days: 2555,
                description: 'Regulatory requirement',
                autoDelete: false
            },
            '10_YEARS': {
                days: 3650,
                description: 'Financial records',
                autoDelete: false
            },
            'PERMANENT': {
                days: null,
                description: 'Permanent retention',
                autoDelete: false,
                archive: true
            }
        };
    }

    /**
     * Log audit event
     * @param {string} eventType - Event type
     * @param {object} data - Event data
     * @param {object} metadata - Additional metadata
     * @returns {object} Audit log result
     */
    log(eventType, data, metadata = {}) {
        const eventDef = this.auditTypes[eventType];
        
        if (!eventDef) {
            console.error(`Unknown audit event type: ${eventType}`);
            return {
                success: false,
                error: `Unknown audit event type: ${eventType}`,
                code: 'UNKNOWN_EVENT_TYPE'
            };
        }

        // Validate required fields
        const validation = this.validateEventData(eventDef, data);
        if (!validation.valid) {
            return {
                success: false,
                error: `Invalid event data: ${validation.error}`,
                code: 'INVALID_EVENT_DATA',
                missingFields: validation.missingFields
            };
        }

        // Create audit entry
        const auditEntry = this.createAuditEntry(eventType, eventDef, data, metadata);
        
        // Store audit entry
        const stored = this.storeAuditEntry(auditEntry);
        
        if (!stored.success) {
            return {
                success: false,
                error: `Failed to store audit entry: ${stored.error}`,
                code: 'STORAGE_FAILED'
            };
        }

        // Trigger any event-specific actions
        this.triggerEventActions(eventType, auditEntry);

        return {
            success: true,
            auditId: auditEntry.auditId,
            timestamp: auditEntry.timestamp,
            message: `Audit event logged: ${eventDef.description}`
        };
    }

    /**
     * Validate event data against required fields
     * @param {object} eventDef - Event definition
     * @param {object} data - Event data
     * @returns {object} Validation result
     */
    validateEventData(eventDef, data) {
        const missingFields = [];
        
        eventDef.requiredFields.forEach(field => {
            if (data[field] === undefined || data[field] === null || data[field] === '') {
                missingFields.push(field);
            }
        });
        
        return {
            valid: missingFields.length === 0,
            error: missingFields.length > 0 ? `Missing required fields: ${missingFields.join(', ')}` : null,
            missingFields: missingFields
        };
    }

    /**
     * Create audit entry
     * @param {string} eventType - Event type
     * @param {object} eventDef - Event definition
     * @param {object} data - Event data
     * @param {object} metadata - Additional metadata
     * @returns {object} Audit entry
     */
    createAuditEntry(eventType, eventDef, data, metadata) {
        const auditId = this.generateAuditId();
        const timestamp = new Date().toISOString();
        
        // Get user context
        const userContext = this.getUserContext();
        
        // Get system context
        const systemContext = this.getSystemContext();
        
        return {
            auditId: auditId,
            eventType: eventType,
            eventCode: eventDef.code,
            description: eventDef.description,
            severity: eventDef.severity,
            severityLevel: this.severityLevels[eventDef.severity].level,
            
            // Event data
            data: {
                ...data,
                // Ensure no sensitive data is logged
                password: undefined,
                token: undefined,
                creditCard: undefined
            },
            
            // Context
            context: {
                user: userContext,
                system: systemContext,
                session: this.getSessionInfo(),
                location: metadata.location || this.getLocationInfo(),
                device: metadata.device || this.getDeviceInfo()
            },
            
            // Metadata
            metadata: {
                ...metadata,
                retention: eventDef.retention,
                version: '1.0',
                hash: this.calculateHash(data)
            },
            
            // Timestamps
            timestamp: timestamp,
            receivedAt: timestamp,
            processedAt: timestamp,
            
            // System fields
            sequence: this.getNextSequence(),
            source: 'GROUP_SERVICE',
            environment: process.env.NODE_ENV || 'development',
            
            // Compliance
            compliance: {
                gdpr: this.isGDPRRelevant(eventType),
                pci: this.isPCIRelevant(eventType),
                sox: this.isSOXRelevant(eventType)
            }
        };
    }

    /**
     * Generate unique audit ID
     * @returns {string} Audit ID
     */
    generateAuditId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `AUDIT_${timestamp}_${random}`.toUpperCase();
    }

    /**
     * Get user context
     * @returns {object} User context
     */
    getUserContext() {
        try {
            const userStr = localStorage.getItem('mpesewa_user');
            if (!userStr) return { authenticated: false };
            
            const user = JSON.parse(userStr);
            return {
                userId: user.id,
                username: user.username,
                roles: user.roles,
                country: user.country,
                authenticated: true,
                sessionId: localStorage.getItem('mpesewa_session_id')
            };
        } catch (error) {
            return { authenticated: false, error: error.message };
        }
    }

    /**
     * Get system context
     * @returns {object} System context
     */
    getSystemContext() {
        return {
            platform: 'M-PESEWA',
            version: '1.0.0',
            build: process.env.BUILD_ID || 'local',
            nodeVersion: process.version,
            timestamp: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    /**
     * Get session information
     * @returns {object} Session info
     */
    getSessionInfo() {
        return {
            sessionId: localStorage.getItem('mpesewa_session_id'),
            loginTime: localStorage.getItem('mpesewa_login_time'),
            lastActivity: new Date().toISOString(),
            ipAddress: this.getClientIP()
        };
    }

    /**
     * Get location information
     * @returns {object} Location info
     */
    getLocationInfo() {
        // Note: In real implementation, this would come from IP geolocation
        return {
            country: localStorage.getItem('mpesewa_country'),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: navigator.language,
            coordinates: null // Would require GPS permission
        };
    }

    /**
     * Get device information
     * @returns {object} Device info
     */
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            timezoneOffset: new Date().getTimezoneOffset(),
            cookiesEnabled: navigator.cookieEnabled,
            online: navigator.onLine,
            language: navigator.language,
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
        };
    }

    /**
     * Get client IP address
     * @returns {string} IP address
     */
    getClientIP() {
        // Note: In real implementation, this would come from request headers
        return localStorage.getItem('mpesewa_client_ip') || 'unknown';
    }

    /**
     * Calculate data hash for integrity
     * @param {object} data - Data to hash
     * @returns {string} Hash value
     */
    calculateHash(data) {
        const dataString = JSON.stringify(data);
        // Simple hash for demo - in production use SHA-256
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    /**
     * Get next sequence number
     * @returns {number} Sequence number
     */
    getNextSequence() {
        const sequence = localStorage.getItem('mpesewa_audit_sequence') || '0';
        const nextSequence = parseInt(sequence) + 1;
        localStorage.setItem('mpesewa_audit_sequence', nextSequence.toString());
        return nextSequence;
    }

    /**
     * Check if event is GDPR relevant
     * @param {string} eventType - Event type
     * @returns {boolean} True if GDPR relevant
     */
    isGDPRRelevant(eventType) {
        const gdprEvents = [
            'USER_RATED',
            'BLACKLIST_ADDED',
            'BLACKLIST_REMOVED',
            'DATA_EXPORT',
            'PRIVACY_REQUEST'
        ];
        return gdprEvents.includes(eventType);
    }

    /**
     * Check if event is PCI relevant
     * @param {string} eventType - Event type
     * @returns {boolean} True if PCI relevant
     */
    isPCIRelevant(eventType) {
        const pciEvents = [
            'SUBSCRIPTION_PURCHASED',
            'SUBSCRIPTION_RENEWED'
        ];
        return pciEvents.includes(eventType);
    }

    /**
     * Check if event is SOX relevant
     * @param {string} eventType - Event type
     * @returns {boolean} True if SOX relevant
     */
    isSOXRelevant(eventType) {
        const soxEvents = [
            'LOAN_CREATED',
            'LOAN_APPROVED',
            'REPAYMENT_RECEIVED',
            'LOAN_DEFAULTED',
            'LEDGER_OVERRIDE',
            'ADMIN_ACTION',
            'SYSTEM_OVERRIDE'
        ];
        return soxEvents.includes(eventType);
    }

    /**
     * Store audit entry
     * @param {object} auditEntry - Audit entry
     * @returns {object} Storage result
     */
    storeAuditEntry(auditEntry) {
        try {
            // Get existing audit logs
            const auditLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
            
            // Append new entry (append-only)
            auditLogs.push(auditEntry);
            
            // Apply retention policy
            const filteredLogs = this.applyRetentionPolicy(auditLogs);
            
            // Store back (limit to 10,000 entries for demo)
            const limitedLogs = filteredLogs.slice(-10000);
            localStorage.setItem('mpesewa_audit_logs', JSON.stringify(limitedLogs));
            
            return {
                success: true,
                count: limitedLogs.length,
                auditId: auditEntry.auditId
            };
        } catch (error) {
            console.error('Failed to store audit entry:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Apply retention policy to audit logs
     * @param {Array} auditLogs - Audit logs
     * @returns {Array} Filtered audit logs
     */
    applyRetentionPolicy(auditLogs) {
        const now = new Date();
        
        return auditLogs.filter(log => {
            const retention = this.retentionPolicy[log.metadata.retention];
            if (!retention || !retention.days) {
                return true; // Permanent retention
            }
            
            const logDate = new Date(log.timestamp);
            const ageInDays = (now - logDate) / (1000 * 60 * 60 * 24);
            
            return ageInDays <= retention.days;
        });
    }

    /**
     * Trigger event-specific actions
     * @param {string} eventType - Event type
     * @param {object} auditEntry - Audit entry
     */
    triggerEventActions(eventType, auditEntry) {
        // Critical events trigger alerts
        if (auditEntry.severity === 'CRITICAL') {
            this.triggerAlert(auditEntry);
        }
        
        // High severity events trigger notifications
        if (auditEntry.severity === 'HIGH') {
            this.triggerNotification(auditEntry);
        }
        
        // Specific event type actions
        switch (eventType) {
            case 'LOAN_DEFAULTED':
                this.handleLoanDefaultAudit(auditEntry);
                break;
                
            case 'BLACKLIST_ADDED':
                this.handleBlacklistAudit(auditEntry);
                break;
                
            case 'ADMIN_ACTION':
                this.handleAdminActionAudit(auditEntry);
                break;
                
            case 'SYSTEM_OVERRIDE':
                this.handleSystemOverrideAudit(auditEntry);
                break;
        }
    }

    /**
     * Trigger alert for critical events
     * @param {object} auditEntry - Audit entry
     */
    triggerAlert(auditEntry) {
        console.warn('CRITICAL AUDIT ALERT:', {
            code: auditEntry.eventCode,
            description: auditEntry.description,
            timestamp: auditEntry.timestamp,
            data: auditEntry.data
        });
        
        // In production, this would send to monitoring system
        // sendToMonitoringSystem('AUDIT_ALERT', auditEntry);
    }

    /**
     * Trigger notification for high events
     * @param {object} auditEntry - Audit entry
     */
    triggerNotification(auditEntry) {
        // Store notification for relevant users
        const notification = {
            type: 'AUDIT_NOTIFICATION',
            severity: auditEntry.severity,
            code: auditEntry.eventCode,
            description: auditEntry.description,
            timestamp: auditEntry.timestamp,
            requiresAction: auditEntry.severity === 'CRITICAL'
        };
        
        // Determine who should receive notification
        const recipients = this.determineNotificationRecipients(auditEntry);
        recipients.forEach(userId => {
            this.storeUserNotification(userId, notification);
        });
    }

    /**
     * Determine who should receive notification
     * @param {object} auditEntry - Audit entry
     * @returns {Array} User IDs to notify
     */
    determineNotificationRecipients(auditEntry) {
        const recipients = [];
        
        // Always notify platform admins for critical/high events
        recipients.push('PLATFORM_ADMIN');
        
        // Event-specific recipients
        switch (auditEntry.eventType) {
            case 'LOAN_DEFAULTED':
                // Notify lender and group admin
                if (auditEntry.data.lenderId) recipients.push(auditEntry.data.lenderId);
                if (auditEntry.data.groupId) {
                    const groupAdmin = this.getGroupAdmin(auditEntry.data.groupId);
                    if (groupAdmin) recipients.push(groupAdmin);
                }
                break;
                
            case 'BLACKLIST_ADDED':
                // Notify group admin
                if (auditEntry.data.groupId) {
                    const groupAdmin = this.getGroupAdmin(auditEntry.data.groupId);
                    if (groupAdmin) recipients.push(groupAdmin);
                }
                break;
                
            case 'GROUP_STATE_CHANGE':
                // Notify all group members
                if (auditEntry.data.groupId) {
                    const members = this.getGroupMembers(auditEntry.data.groupId);
                    recipients.push(...members);
                }
                break;
        }
        
        return [...new Set(recipients)]; // Remove duplicates
    }

    /**
     * Handle loan default audit
     * @param {object} auditEntry - Audit entry
     */
    handleLoanDefaultAudit(auditEntry) {
        // Update borrower's default count
        if (auditEntry.data.borrowerId) {
            this.incrementDefaultCount(auditEntry.data.borrowerId);
        }
        
        // Trigger debt collection process
        if (auditEntry.data.loanId) {
            this.initiateDebtCollection(auditEntry.data.loanId);
        }
    }

    /**
     * Handle blacklist audit
     * @param {object} auditEntry - Audit entry
     */
    handleBlacklistAudit(auditEntry) {
        // Update user's blacklist status
        if (auditEntry.data.userId) {
            this.updateBlacklistStatus(auditEntry.data.userId, true);
        }
        
        // Notify all groups user is in
        const userGroups = this.getUserGroups(auditEntry.data.userId);
        userGroups.forEach(groupId => {
            this.notifyGroupOfBlacklist(groupId, auditEntry.data.userId);
        });
    }

    /**
     * Handle admin action audit
     * @param {object} auditEntry - Audit entry
     */
    handleAdminActionAudit(auditEntry) {
        // Log admin action for review
        this.logAdminActionForReview(auditEntry);
        
        // Check if action requires approval
        if (auditEntry.data.requiresApproval) {
            this.requestAdminActionApproval(auditEntry);
        }
    }

    /**
     * Handle system override audit
     * @param {object} auditEntry - Audit entry
     */
    handleSystemOverrideAudit(auditEntry) {
        // Critical - requires immediate review
        this.escalateForImmediateReview(auditEntry);
        
        // Notify security team
        this.notifySecurityTeam(auditEntry);
    }

    /**
     * Query audit logs
     * @param {object} filters - Query filters
     * @returns {object} Query results
     */
    query(filters = {}) {
        try {
            const auditLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
            
            // Apply filters
            let filteredLogs = auditLogs;
            
            if (filters.eventType) {
                filteredLogs = filteredLogs.filter(log => log.eventType === filters.eventType);
            }
            
            if (filters.severity) {
                filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
            }
            
            if (filters.userId) {
                filteredLogs = filteredLogs.filter(log => 
                    log.data.userId === filters.userId || 
                    log.context.user.userId === filters.userId
                );
            }
            
            if (filters.groupId) {
                filteredLogs = filteredLogs.filter(log => log.data.groupId === filters.groupId);
            }
            
            if (filters.startDate) {
                const start = new Date(filters.startDate);
                filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
            }
            
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= end);
            }
            
            // Apply sorting
            if (filters.sortBy) {
                filteredLogs.sort((a, b) => {
                    if (filters.sortBy === 'timestamp') {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    }
                    if (filters.sortBy === 'severity') {
                        return b.severityLevel - a.severityLevel;
                    }
                    return 0;
                });
            }
            
            // Apply pagination
            const page = filters.page || 1;
            const limit = filters.limit || 50;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
            
            return {
                success: true,
                logs: paginatedLogs,
                total: filteredLogs.length,
                page: page,
                limit: limit,
                pages: Math.ceil(filteredLogs.length / limit)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                logs: []
            };
        }
    }

    /**
     * Export audit logs
     * @param {object} filters - Export filters
     * @returns {object} Export result
     */
    export(filters = {}) {
        const queryResult = this.query(filters);
        
        if (!queryResult.success) {
            return queryResult;
        }
        
        // Create export data
        const exportData = {
            metadata: {
                exportedAt: new Date().toISOString(),
                filters: filters,
                totalRecords: queryResult.total,
                format: 'JSON'
            },
            logs: queryResult.logs
        };
        
        // Log the export itself
        this.log('DATA_EXPORT', {
            userId: this.getUserContext().userId,
            exportType: 'AUDIT_LOGS',
            recordCount: queryResult.total,
            filters: filters
        });
        
        return {
            success: true,
            data: exportData,
            filename: `audit_export_${new Date().toISOString().split('T')[0]}.json`,
            downloadUrl: this.createDownloadUrl(exportData)
        };
    }

    /**
     * Create download URL for export
     * @param {object} data - Export data
     * @returns {string} Download URL
     */
    createDownloadUrl(data) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        return URL.createObjectURL(blob);
    }

    /**
     * Get audit statistics
     * @param {string} period - Time period (day, week, month, year)
     * @returns {object} Statistics
     */
    getStatistics(period = 'month') {
        const auditLogs = JSON.parse(localStorage.getItem('mpesewa_audit_logs') || '[]');
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'day':
                startDate = new Date(now.setDate(now.getDate() - 1));
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(0); // All time
        }
        
        const filteredLogs = auditLogs.filter(log => new Date(log.timestamp) >= startDate);
        
        const stats = {
            total: filteredLogs.length,
            bySeverity: {},
            byEventType: {},
            byHour: {},
            trends: this.calculateTrends(filteredLogs)
        };
        
        // Count by severity
        filteredLogs.forEach(log => {
            stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
            stats.byEventType[log.eventType] = (stats.byEventType[log.eventType] || 0) + 1;
            
            const hour = new Date(log.timestamp).getHours();
            stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
        });
        
        return stats;
    }

    /**
     * Calculate trends
     * @param {Array} logs - Audit logs
     * @returns {object} Trend data
     */
    calculateTrends(logs) {
        // Group by day
        const byDay = {};
        logs.forEach(log => {
            const date = log.timestamp.split('T')[0];
            byDay[date] = (byDay[date] || 0) + 1;
        });
        
        return {
            daily: byDay,
            averagePerDay: logs.length / Object.keys(byDay).length || 0,
            peakDay: Object.keys(byDay).reduce((a, b) => byDay[a] > byDay[b] ? a : b, ''),
            peakCount: Math.max(...Object.values(byDay))
        };
    }

    // Helper methods (stubs for demo)
    
    getGroupAdmin(groupId) {
        // Implementation would fetch from database
        return null;
    }
    
    getGroupMembers(groupId) {
        // Implementation would fetch from database
        return [];
    }
    
    getUserGroups(userId) {
        // Implementation would fetch from database
        return [];
    }
    
    incrementDefaultCount(userId) {
        // Implementation would update database
    }
    
    initiateDebtCollection(loanId) {
        // Implementation would trigger debt collection
    }
    
    updateBlacklistStatus(userId, status) {
        // Implementation would update database
    }
    
    notifyGroupOfBlacklist(groupId, userId) {
        // Implementation would send notifications
    }
    
    logAdminActionForReview(auditEntry) {
        // Implementation would log for review
    }
    
    requestAdminActionApproval(auditEntry) {
        // Implementation would request approval
    }
    
    escalateForImmediateReview(auditEntry) {
        // Implementation would escalate
    }
    
    notifySecurityTeam(auditEntry) {
        // Implementation would notify security
    }
    
    storeUserNotification(userId, notification) {
        // Implementation would store notification
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroupAudit;
}