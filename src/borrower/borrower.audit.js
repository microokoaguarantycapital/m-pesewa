/**
 * M-Pesewa Borrower Audit System
 * ENFORCES STRICT HIERARCHY: Global → Country → Groups → Borrowers
 * 
 * Audit Rules:
 * 1. Append-only audit trail
 * 2. Immutable records
 * 3. Hash-chain integrity
 * 4. State transition logging
 * 5. Permission change tracking
 */

class BorrowerAudit {
    constructor() {
        this.auditLog = [];
        this.hashChain = [];
        this.lastHash = null;
        
        // Audit categories
        this.categories = {
            STATE_CHANGE: 'STATE_CHANGE',
            PERMISSION_CHANGE: 'PERMISSION_CHANGE',
            LOAN_ACTION: 'LOAN_ACTION',
            GROUP_ACTION: 'GROUP_ACTION',
            PROFILE_UPDATE: 'PROFILE_UPDATE',
            SECURITY_EVENT: 'SECURITY_EVENT',
            ADMIN_ACTION: 'ADMIN_ACTION',
            SYSTEM_EVENT: 'SYSTEM_EVENT',
            COMPLIANCE_CHECK: 'COMPLIANCE_CHECK'
        };

        // Audit severity levels
        this.severity = {
            INFO: 'INFO',
            WARNING: 'WARNING',
            ERROR: 'ERROR',
            CRITICAL: 'CRITICAL',
            SECURITY: 'SECURITY'
        };
    }

    /**
     * Create audit entry with hash-chain integrity
     */
    createAuditEntry(data) {
        const timestamp = new Date().toISOString();
        
        // Generate entry ID
        const entryId = `audit_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create audit entry
        const auditEntry = {
            id: entryId,
            timestamp: timestamp,
            borrowerId: data.borrowerId,
            countryCode: data.countryCode,
            groupId: data.groupId,
            category: data.category || this.categories.SYSTEM_EVENT,
            severity: data.severity || this.severity.INFO,
            action: data.action,
            description: data.description,
            previousState: data.previousState,
            newState: data.newState,
            metadata: data.metadata || {},
            performedBy: data.performedBy || 'system',
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            sessionId: data.sessionId
        };

        // Calculate hash for integrity
        const hash = this.calculateHash(auditEntry);
        auditEntry.hash = hash;
        auditEntry.previousHash = this.lastHash;

        // Update hash chain
        this.hashChain.push({
            entryId: entryId,
            hash: hash,
            previousHash: this.lastHash,
            timestamp: timestamp
        });

        // Store last hash
        this.lastHash = hash;

        // Add to audit log
        this.auditLog.push(auditEntry);

        // Trigger any audit listeners
        this.notifyAuditListeners(auditEntry);

        return auditEntry;
    }

    /**
     * Calculate SHA-256 hash of audit entry
     */
    calculateHash(entry) {
        // Create string representation for hashing
        const entryString = JSON.stringify({
            id: entry.id,
            timestamp: entry.timestamp,
            borrowerId: entry.borrowerId,
            action: entry.action,
            previousState: entry.previousState,
            newState: entry.newState,
            previousHash: entry.previousHash
        });

        // Simple hash function for demo (use crypto.subtle.digest in production)
        let hash = 0;
        for (let i = 0; i < entryString.length; i++) {
            const char = entryString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        return Math.abs(hash).toString(16);
    }

    /**
     * Log state transition
     */
    logStateTransition(borrowerId, fromState, toState, context = {}) {
        return this.createAuditEntry({
            borrowerId: borrowerId,
            countryCode: context.countryCode,
            groupId: context.groupId,
            category: this.categories.STATE_CHANGE,
            severity: this.getSeverityForStateChange(fromState, toState),
            action: 'STATE_TRANSITION',
            description: `Borrower state changed from ${fromState} to ${toState}`,
            previousState: fromState,
            newState: toState,
            metadata: {
                reason: context.reason,
                triggeredBy: context.triggeredBy,
                loanId: context.loanId,
                overdueDays: context.overdueDays
            },
            performedBy: context.performedBy || 'system',
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            sessionId: context.sessionId
        });
    }

    /**
     * Determine severity for state change
     */
    getSeverityForStateChange(fromState, toState) {
        const criticalTransitions = [
            'ELIGIBLE→BLACKLISTED',
            'BORROWING→DEFAULTED',
            'OVERDUE→BLACKLISTED'
        ];

        const warningTransitions = [
            'BORROWING→OVERDUE',
            'ELIGIBLE→DEFAULTED',
            'VERIFIED→BLACKLISTED'
        ];

        const transition = `${fromState}→${toState}`;

        if (criticalTransitions.includes(transition)) {
            return this.severity.CRITICAL;
        } else if (warningTransitions.includes(transition)) {
            return this.severity.WARNING;
        }

        return this.severity.INFO;
    }

    /**
     * Log loan-related action
     */
    logLoanAction(borrowerId, action, loanData, context = {}) {
        return this.createAuditEntry({
            borrowerId: borrowerId,
            countryCode: context.countryCode,
            groupId: context.groupId,
            category: this.categories.LOAN_ACTION,
            severity: this.getSeverityForLoanAction(action),
            action: action,
            description: this.getDescriptionForLoanAction(action, loanData),
            previousState: context.previousState,
            newState: context.newState,
            metadata: {
                loanId: loanData.id,
                amount: loanData.amount,
                currency: loanData.currency,
                interest: loanData.interest,
                lenderId: loanData.lenderId,
                disbursementDate: loanData.disbursementDate,
                dueDate: loanData.dueDate,
                repaymentStatus: loanData.status
            },
            performedBy: context.performedBy || 'borrower',
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            sessionId: context.sessionId
        });
    }

    /**
     * Get severity for loan action
     */
    getSeverityForLoanAction(action) {
        const criticalActions = ['LOAN_DEFAULT', 'LOAN_BLACKLIST'];
        const warningActions = ['LOAN_OVERDUE', 'LOAN_DISPUTE'];
        
        if (criticalActions.includes(action)) return this.severity.CRITICAL;
        if (warningActions.includes(action)) return this.severity.WARNING;
        
        return this.severity.INFO;
    }

    /**
     * Get description for loan action
     */
    getDescriptionForLoanAction(action, loanData) {
        const descriptions = {
            LOAN_REQUEST: `Loan requested: ${loanData.amount} ${loanData.currency}`,
            LOAN_APPROVED: `Loan approved: ${loanData.amount} ${loanData.currency}`,
            LOAN_DISBURSED: `Loan disbursed: ${loanData.amount} ${loanData.currency}`,
            REPAYMENT_MADE: `Repayment made: ${loanData.amount} ${loanData.currency}`,
            REPAYMENT_PARTIAL: `Partial repayment: ${loanData.amount} ${loanData.currency}`,
            LOAN_CLEARED: `Loan cleared: ${loanData.amount} ${loanData.currency}`,
            LOAN_OVERDUE: `Loan overdue: ${loanData.daysOverdue} days`,
            LOAN_DEFAULT: `Loan defaulted after ${loanData.monthsOverdue} months`,
            LOAN_BLACKLIST: `Loan led to blacklisting`,
            LOAN_DISPUTE: `Loan dispute filed`,
            LOAN_RATING: `Lender rated: ${loanData.rating} stars`
        };

        return descriptions[action] || `Loan action: ${action}`;
    }

    /**
     * Log group-related action
     */
    logGroupAction(borrowerId, action, groupData, context = {}) {
        return this.createAuditEntry({
            borrowerId: borrowerId,
            countryCode: context.countryCode,
            groupId: groupData.id,
            category: this.categories.GROUP_ACTION,
            severity: this.severity.INFO,
            action: action,
            description: this.getDescriptionForGroupAction(action, groupData),
            previousState: context.previousState,
            newState: context.newState,
            metadata: {
                groupId: groupData.id,
                groupName: groupData.name,
                groupType: groupData.type,
                memberCount: groupData.memberCount,
                invitationMethod: groupData.invitationMethod,
                referrerId: groupData.referrerId
            },
            performedBy: context.performedBy || 'borrower',
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            sessionId: context.sessionId
        });
    }

    /**
     * Get description for group action
     */
    getDescriptionForGroupAction(action, groupData) {
        const descriptions = {
            GROUP_JOIN: `Joined group: ${groupData.name}`,
            GROUP_LEAVE: `Left group: ${groupData.name}`,
            GROUP_INVITE: `Invited to group: ${groupData.name}`,
            GROUP_REMOVE: `Removed from group: ${groupData.name}`,
            GROUP_ROLE_CHANGE: `Role changed in group: ${groupData.name}`,
            GROUP_MIGRATE: `Migrated to new group: ${groupData.name}`
        };

        return descriptions[action] || `Group action: ${action}`;
    }

    /**
     * Log profile update
     */
    logProfileUpdate(borrowerId, updates, context = {}) {
        return this.createAuditEntry({
            borrowerId: borrowerId,
            countryCode: context.countryCode,
            category: this.categories.PROFILE_UPDATE,
            severity: this.severity.INFO,
            action: 'PROFILE_UPDATE',
            description: `Profile updated: ${Object.keys(updates).join(', ')}`,
            metadata: {
                updates: updates,
                fieldsChanged: Object.keys(updates),
                previousValues: context.previousValues
            },
            performedBy: context.performedBy || 'borrower',
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            sessionId: context.sessionId
        });
    }

    /**
     * Log security event
     */
    logSecurityEvent(borrowerId, event, context = {}) {
        return this.createAuditEntry({
            borrowerId: borrowerId,
            countryCode: context.countryCode,
            category: this.categories.SECURITY_EVENT,
            severity: this.severity.SECURITY,
            action: event,
            description: `Security event: ${event}`,
            metadata: {
                eventType: event,
                riskLevel: context.riskLevel,
                suspiciousActivity: context.suspiciousActivity,
                mitigation: context.mitigation
            },
            performedBy: context.performedBy || 'system',
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            sessionId: context.sessionId
        });
    }

    /**
     * Log admin action
     */
    logAdminAction(borrowerId, action, adminData, context = {}) {
        return this.createAuditEntry({
            borrowerId: borrowerId,
            countryCode: context.countryCode,
            category: this.categories.ADMIN_ACTION,
            severity: this.severity.CRITICAL,
            action: action,
            description: `Admin action: ${action} by ${adminData.adminId}`,
            metadata: {
                adminId: adminData.adminId,
                adminRole: adminData.role,
                justification: adminData.justification,
                overrideType: adminData.overrideType,
                affectedFields: adminData.affectedFields
            },
            performedBy: adminData.adminId,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            sessionId: context.sessionId
        });
    }

    /**
     * Log compliance check
     */
    logComplianceCheck(borrowerId, checkType, result, context = {}) {
        return this.createAuditEntry({
            borrowerId: borrowerId,
            countryCode: context.countryCode,
            category: this.categories.COMPLIANCE_CHECK,
            severity: result.passed ? this.severity.INFO : this.severity.WARNING,
            action: 'COMPLIANCE_CHECK',
            description: `Compliance check: ${checkType} - ${result.passed ? 'PASSED' : 'FAILED'}`,
            metadata: {
                checkType: checkType,
                passed: result.passed,
                violations: result.violations,
                rulesChecked: result.rulesChecked,
                timestamp: result.timestamp
            },
            performedBy: 'compliance_system',
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            sessionId: context.sessionId
        });
    }

    /**
     * Verify hash chain integrity
     */
    verifyHashChain() {
        const issues = [];

        for (let i = 1; i < this.hashChain.length; i++) {
            const current = this.hashChain[i];
            const previous = this.hashChain[i - 1];

            // Check if previous hash matches
            if (current.previousHash !== previous.hash) {
                issues.push({
                    index: i,
                    entryId: current.entryId,
                    issue: 'HASH_MISMATCH',
                    expectedPreviousHash: previous.hash,
                    actualPreviousHash: current.previousHash
                });
            }

            // Verify hash calculation
            const auditEntry = this.auditLog.find(entry => entry.id === current.entryId);
            if (auditEntry) {
                const calculatedHash = this.calculateHash(auditEntry);
                if (calculatedHash !== current.hash) {
                    issues.push({
                        index: i,
                        entryId: current.entryId,
                        issue: 'HASH_CALCULATION_FAILED',
                        expectedHash: current.hash,
                        calculatedHash: calculatedHash
                    });
                }
            }
        }

        return {
            valid: issues.length === 0,
            totalEntries: this.hashChain.length,
            issues: issues,
            chainHash: this.lastHash,
            verifiedAt: new Date().toISOString()
        };
    }

    /**
     * Get audit entries for borrower
     */
    getBorrowerAuditLog(borrowerId, filters = {}) {
        let entries = this.auditLog.filter(entry => entry.borrowerId === borrowerId);

        // Apply filters
        if (filters.category) {
            entries = entries.filter(entry => entry.category === filters.category);
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

        if (filters.action) {
            entries = entries.filter(entry => entry.action === filters.action);
        }

        // Sort by timestamp (newest first)
        entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return {
            borrowerId: borrowerId,
            totalEntries: entries.length,
            entries: entries,
            filtersApplied: filters
        };
    }

    /**
     * Get audit statistics
     */
    getAuditStatistics(borrowerId = null) {
        let entries = borrowerId 
            ? this.auditLog.filter(entry => entry.borrowerId === borrowerId)
            : this.auditLog;

        const stats = {
            totalEntries: entries.length,
            byCategory: {},
            bySeverity: {},
            byAction: {},
            timeline: {},
            uniqueBorrowers: new Set(entries.map(e => e.borrowerId)).size,
            uniqueCountries: new Set(entries.map(e => e.countryCode)).size,
            uniqueGroups: new Set(entries.map(e => e.groupId)).size
        };

        // Categorize entries
        entries.forEach(entry => {
            // By category
            stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;

            // By severity
            stats.bySeverity[entry.severity] = (stats.bySeverity[entry.severity] || 0) + 1;

            // By action
            stats.byAction[entry.action] = (stats.byAction[entry.action] || 0) + 1;

            // Timeline (by day)
            const date = entry.timestamp.split('T')[0];
            stats.timeline[date] = (stats.timeline[date] || 0) + 1;
        });

        return stats;
    }

    /**
     * Export audit data for backup/analysis
     */
    exportAuditData(options = {}) {
        const exportData = {
            auditLog: this.auditLog,
            hashChain: this.hashChain,
            statistics: this.getAuditStatistics(),
            verification: this.verifyHashChain(),
            metadata: {
                exportedAt: new Date().toISOString(),
                totalEntries: this.auditLog.length,
                startDate: this.auditLog[0]?.timestamp,
                endDate: this.auditLog[this.auditLog.length - 1]?.timestamp,
                hashChainLength: this.hashChain.length,
                lastHash: this.lastHash
            }
        };

        if (options.includeBorrowerId) {
            exportData.borrowerSpecific = this.getBorrowerAuditLog(options.includeBorrowerId);
        }

        return exportData;
    }

    /**
     * Import audit data
     */
    importAuditData(data) {
        if (!data.auditLog || !data.hashChain) {
            throw new Error('Invalid audit data format');
        }

        // Validate hash chain before import
        const tempAudit = new BorrowerAudit();
        tempAudit.auditLog = data.auditLog;
        tempAudit.hashChain = data.hashChain;
        tempAudit.lastHash = data.hashChain[data.hashChain.length - 1]?.hash || null;

        const verification = tempAudit.verifyHashChain();
        if (!verification.valid) {
            throw new Error(`Hash chain verification failed: ${JSON.stringify(verification.issues)}`);
        }

        // Import valid data
        this.auditLog = data.auditLog;
        this.hashChain = data.hashChain;
        this.lastHash = data.hashChain[data.hashChain.length - 1]?.hash || null;

        return {
            success: true,
            importedEntries: data.auditLog.length,
            lastHash: this.lastHash,
            importedAt: new Date().toISOString()
        };
    }

    /**
     * Clear audit data (admin only)
     */
    clearAuditData(adminId, justification) {
        const clearEntry = this.logAdminAction('SYSTEM', 'AUDIT_CLEAR', {
            adminId: adminId,
            justification: justification,
            affectedFields: 'ALL_AUDIT_DATA'
        }, {
            ipAddress: 'system',
            userAgent: 'admin_tool'
        });

        // Store backup of cleared data
        const backup = {
            clearedAt: new Date().toISOString(),
            clearedBy: adminId,
            justification: justification,
            previousAuditLog: [...this.auditLog],
            previousHashChain: [...this.hashChain],
            lastHash: this.lastHash,
            clearEntryId: clearEntry.id
        };

        // Clear current data
        this.auditLog = [clearEntry];
        this.hashChain = [{
            entryId: clearEntry.id,
            hash: clearEntry.hash,
            previousHash: null,
            timestamp: clearEntry.timestamp
        }];
        this.lastHash = clearEntry.hash;

        return {
            success: true,
            backupId: `backup_${Date.now()}`,
            backup: backup,
            remainingEntries: this.auditLog.length
        };
    }

    /**
     * Notify audit listeners (for real-time monitoring)
     */
    notifyAuditListeners(entry) {
        // This would integrate with real-time notification system
        // For now, just log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('[AUDIT]', entry);
        }

        // Check for critical events that need immediate attention
        if (entry.severity === this.severity.CRITICAL || entry.severity === this.severity.SECURITY) {
            this.triggerAlert(entry);
        }
    }

    /**
     * Trigger alert for critical events
     */
    triggerAlert(entry) {
        const alert = {
            id: `alert_${Date.now()}`,
            timestamp: new Date().toISOString(),
            auditEntryId: entry.id,
            borrowerId: entry.borrowerId,
            severity: entry.severity,
            category: entry.category,
            action: entry.action,
            description: entry.description,
            requiresAction: true,
            assignedTo: null,
            status: 'NEW',
            metadata: entry.metadata
        };

        // Store alert (would go to alert system)
        // For now, log to console
        console.warn('[CRITICAL ALERT]', alert);
        
        return alert;
    }

    /**
     * Search audit log
     */
    searchAuditLog(query, filters = {}) {
        let results = this.auditLog;

        // Text search
        if (query) {
            const searchTerms = query.toLowerCase();
            results = results.filter(entry => 
                entry.description.toLowerCase().includes(searchTerms) ||
                entry.action.toLowerCase().includes(searchTerms) ||
                entry.borrowerId.toLowerCase().includes(searchTerms) ||
                JSON.stringify(entry.metadata).toLowerCase().includes(searchTerms)
            );
        }

        // Apply filters
        if (filters.borrowerId) {
            results = results.filter(entry => entry.borrowerId === filters.borrowerId);
        }

        if (filters.countryCode) {
            results = results.filter(entry => entry.countryCode === filters.countryCode);
        }

        if (filters.groupId) {
            results = results.filter(entry => entry.groupId === filters.groupId);
        }

        if (filters.category) {
            results = results.filter(entry => entry.category === filters.category);
        }

        if (filters.severity) {
            results = results.filter(entry => entry.severity === filters.severity);
        }

        if (filters.startDate) {
            const start = new Date(filters.startDate);
            results = results.filter(entry => new Date(entry.timestamp) >= start);
        }

        if (filters.endDate) {
            const end = new Date(filters.endDate);
            results = results.filter(entry => new Date(entry.timestamp) <= end);
        }

        if (filters.performedBy) {
            results = results.filter(entry => entry.performedBy === filters.performedBy);
        }

        // Sort results
        const sortField = filters.sortBy || 'timestamp';
        const sortOrder = filters.sortOrder || 'desc';
        
        results.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            if (sortField === 'timestamp') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedResults = results.slice(startIndex, endIndex);

        return {
            total: results.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(results.length / limit),
            results: paginatedResults,
            query: query,
            filters: filters
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BorrowerAudit };
}

// Browser global export
if (typeof window !== 'undefined') {
    window.BorrowerAudit = BorrowerAudit;
}

/**
 * Create borrower audit instance
 */
function createBorrowerAudit() {
    return new BorrowerAudit();
}

// Browser and Node.js compatible export
if (typeof window !== 'undefined') {
    window.createBorrowerAudit = createBorrowerAudit;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports.createBorrowerAudit = createBorrowerAudit;
}

/**
 * Mock audit data generator for testing
 */
function generateMockAuditData(borrowerId, count = 100) {
    const audit = new BorrowerAudit();
    const actions = [
        'STATE_TRANSITION', 'LOAN_REQUEST', 'LOAN_APPROVED', 'REPAYMENT_MADE',
        'GROUP_JOIN', 'GROUP_LEAVE', 'PROFILE_UPDATE', 'SECURITY_EVENT'
    ];

    const countries = ['KE', 'UG', 'TZ', 'RW', 'BI', 'CD', 'SS', 'ZA', 'NG', 'GH', 'ET', 'SO'];
    const groups = [`group_${Math.random().toString(36).substr(2, 5)}`, `group_${Math.random().toString(36).substr(2, 5)}`];

    for (let i = 0; i < count; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - daysAgo);

        audit.createAuditEntry({
            borrowerId: borrowerId,
            countryCode: countries[Math.floor(Math.random() * countries.length)],
            groupId: groups[Math.floor(Math.random() * groups.length)],
            category: audit.categories.SYSTEM_EVENT,
            severity: audit.severity.INFO,
            action: actions[Math.floor(Math.random() * actions.length)],
            description: `Mock audit entry ${i + 1}`,
            timestamp: timestamp.toISOString(),
            performedBy: Math.random() > 0.5 ? 'borrower' : 'system',
            ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Mozilla/5.0 (Test Browser)'
        });
    }

    return audit;
}

// Browser and Node.js compatible export
if (typeof window !== 'undefined') {
    window.generateMockAuditData = generateMockAuditData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports.generateMockAuditData = generateMockAuditData;
}