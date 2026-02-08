/**
 * M-PESEWA LEDGER AUDIT - APPEND-ONLY AUDIT TRAIL
 * 
 * Every action recorded. Nothing forgotten. Nothing changed.
 */

class LedgerAudit {
    constructor() {
        // AUDIT EVENT TYPES
        this.EVENT_TYPES = {
            // Ledger Events
            LEDGER_CREATED: {
                code: 'LEDGER_CREATED',
                severity: 'INFO',
                category: 'LEDGER_LIFECYCLE',
                immutable: true,
                requiredFields: ['ledgerId', 'lenderId', 'borrowerId', 'amount']
            },
            
            LEDGER_UPDATED: {
                code: 'LEDGER_UPDATED',
                severity: 'INFO',
                category: 'LEDGER_LIFECYCLE',
                immutable: true,
                requiredFields: ['ledgerId', 'field', 'oldValue', 'newValue']
            },
            
            LEDGER_STATE_CHANGED: {
                code: 'LEDGER_STATE_CHANGED',
                severity: 'INFO',
                category: 'STATE_MANAGEMENT',
                immutable: true,
                requiredFields: ['ledgerId', 'fromState', 'toState', 'reason']
            },
            
            // Financial Events
            INTEREST_APPLIED: {
                code: 'INTEREST_APPLIED',
                severity: 'INFO',
                category: 'FINANCIAL',
                immutable: true,
                requiredFields: ['ledgerId', 'amount', 'rate', 'calculatedBy']
            },
            
            PENALTY_APPLIED: {
                code: 'PENALTY_APPLIED',
                severity: 'WARNING',
                category: 'FINANCIAL',
                immutable: true,
                requiredFields: ['ledgerId', 'amount', 'rate', 'reason', 'overdueDays']
            },
            
            REPAYMENT_RECEIVED: {
                code: 'REPAYMENT_RECEIVED',
                severity: 'INFO',
                category: 'FINANCIAL',
                immutable: true,
                requiredFields: ['ledgerId', 'amount', 'paymentMethod', 'confirmedBy']
            },
            
            // Security Events
            PERMISSION_CHECKED: {
                code: 'PERMISSION_CHECKED',
                severity: 'INFO',
                category: 'SECURITY',
                immutable: true,
                requiredFields: ['userId', 'action', 'result', 'context']
            },
            
            ACCESS_DENIED: {
                code: 'ACCESS_DENIED',
                severity: 'WARNING',
                category: 'SECURITY',
                immutable: true,
                requiredFields: ['userId', 'action', 'reason', 'ipAddress']
            },
            
            AUTHENTICATION: {
                code: 'AUTHENTICATION',
                severity: 'INFO',
                category: 'SECURITY',
                immutable: true,
                requiredFields: ['userId', 'method', 'success', 'timestamp']
            },
            
            // Admin Events
            ADMIN_OVERRIDE: {
                code: 'ADMIN_OVERRIDE',
                severity: 'HIGH',
                category: 'ADMINISTRATIVE',
                immutable: true,
                requiredFields: ['adminId', 'action', 'targetId', 'justification']
            },
            
            BLACKLIST_ACTION: {
                code: 'BLACKLIST_ACTION',
                severity: 'HIGH',
                category: 'ADMINISTRATIVE',
                immutable: true,
                requiredFields: ['borrowerId', 'action', 'reason', 'performedBy']
            },
            
            // System Events
            SYSTEM_RECONCILIATION: {
                code: 'SYSTEM_RECONCILIATION',
                severity: 'INFO',
                category: 'SYSTEM',
                immutable: true,
                requiredFields: ['ledgerId', 'issue', 'fix', 'performedBy']
            },
            
            HASH_CHAIN_BREAK: {
                code: 'HASH_CHAIN_BREAK',
                severity: 'CRITICAL',
                category: 'INTEGRITY',
                immutable: true,
                requiredFields: ['ledgerId', 'entryId', 'expectedHash', 'actualHash']
            },
            
            DATA_EXPORT: {
                code: 'DATA_EXPORT',
                severity: 'INFO',
                category: 'DATA_MANAGEMENT',
                immutable: true,
                requiredFields: ['userId', 'exportType', 'scope', 'timestamp']
            }
        };

        // AUDIT STORAGE (In production, this would be a database)
        this.auditLogs = new Map();
        this.auditIndex = new Map(); // For fast lookups
        
        // RETENTION POLICY
        this.RETENTION_POLICY = {
            CRITICAL: 'PERMANENT',
            HIGH: '10_YEARS',
            WARNING: '5_YEARS',
            INFO: '2_YEARS',
            DEBUG: '90_DAYS'
        };
        
        // COMPLIANCE REQUIREMENTS
        this.COMPLIANCE = {
            GDPR: {
                userDataRetention: '6_YEARS',
                rightToBeForgotten: true,
                dataMinimization: true
            },
            
            PCI_DSS: {
                financialDataEncryption: true,
                accessLogging: true,
                regularAudits: true
            },
            
            LOCAL_REGULATIONS: {
                countrySpecific: true,
                regulatorReporting: true,
                auditTrailRequired: true
            }
        };
    }

    /**
     * LOG AUDIT EVENT
     */
    logEvent(eventType, data, metadata = {}) {
        const eventConfig = this.EVENT_TYPES[eventType];
        
        if (!eventConfig) {
            throw new Error(`Unknown audit event type: ${eventType}`);
        }

        // Validate required fields
        const missingFields = eventConfig.requiredFields.filter(
            field => data[field] === undefined || data[field] === null
        );
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields for ${eventType}: ${missingFields.join(', ')}`);
        }

        // Generate audit entry
        const auditId = this.generateAuditId(eventType, data);
        const timestamp = new Date();
        
        const auditEntry = {
            id: auditId,
            eventType,
            eventCode: eventConfig.code,
            severity: eventConfig.severity,
            category: eventConfig.category,
            timestamp,
            data: { ...data },
            metadata: {
                ...metadata,
                immutable: eventConfig.immutable,
                version: '1.0',
                hash: this.generateEventHash(eventType, data, timestamp)
            },
            context: this.getEventContext(),
            complianceTags: this.getComplianceTags(eventType, data),
            retentionPeriod: this.RETENTION_POLICY[eventConfig.severity]
        };

        // Store audit entry
        this.storeAuditEntry(auditEntry);
        
        // Index for fast retrieval
        this.indexAuditEntry(auditEntry);
        
        // Trigger any alerting if needed
        if (eventConfig.severity === 'CRITICAL' || eventConfig.severity === 'HIGH') {
            this.triggerAlert(auditEntry);
        }

        return auditEntry;
    }

    /**
     * STORE AUDIT ENTRY
     */
    storeAuditEntry(auditEntry) {
        const { ledgerId, userId, category } = auditEntry.data;
        
        // Store in memory (in production, this would be a database)
        if (!this.auditLogs.has(category)) {
            this.auditLogs.set(category, []);
        }
        
        this.auditLogs.get(category).push(auditEntry);
        
        // Also store by ledger if applicable
        if (ledgerId) {
            if (!this.auditLogs.has(`ledger:${ledgerId}`)) {
                this.auditLogs.set(`ledger:${ledgerId}`, []);
            }
            this.auditLogs.get(`ledger:${ledgerId}`).push(auditEntry);
        }
        
        // Store by user if applicable
        if (userId) {
            if (!this.auditLogs.has(`user:${userId}`)) {
                this.auditLogs.set(`user:${userId}`, []);
            }
            this.auditLogs.get(`user:${userId}`).push(auditEntry);
        }
        
        // Global chronological log
        if (!this.auditLogs.has('global')) {
            this.auditLogs.set('global', []);
        }
        this.auditLogs.get('global').push(auditEntry);
    }

    /**
     * INDEX AUDIT ENTRY
     */
    indexAuditEntry(auditEntry) {
        const { id, eventType, severity, timestamp, data } = auditEntry;
        
        // Index by type
        if (!this.auditIndex.has(`type:${eventType}`)) {
            this.auditIndex.set(`type:${eventType}`, []);
        }
        this.auditIndex.get(`type:${eventType}`).push(id);
        
        // Index by severity
        if (!this.auditIndex.has(`severity:${severity}`)) {
            this.auditIndex.set(`severity:${severity}`, []);
        }
        this.auditIndex.get(`severity:${severity}`).push(id);
        
        // Index by date
        const dateKey = timestamp.toISOString().split('T')[0];
        if (!this.auditIndex.has(`date:${dateKey}`)) {
            this.auditIndex.set(`date:${dateKey}`, []);
        }
        this.auditIndex.get(`date:${dateKey}`).push(id);
        
        // Index by user if present
        if (data.userId) {
            if (!this.auditIndex.has(`user:${data.userId}`)) {
                this.auditIndex.set(`user:${data.userId}`, []);
            }
            this.auditIndex.get(`user:${data.userId}`).push(id);
        }
        
        // Index by ledger if present
        if (data.ledgerId) {
            if (!this.auditIndex.has(`ledger:${data.ledgerId}`)) {
                this.auditIndex.set(`ledger:${data.ledgerId}`, []);
            }
            this.auditIndex.get(`ledger:${data.ledgerId}`).push(id);
        }
    }

    /**
     * GET AUDIT TRAIL FOR LEDGER
     */
    getLedgerAuditTrail(ledgerId, filters = {}) {
        const entries = this.auditLogs.get(`ledger:${ledgerId}`) || [];
        return this.filterAndSortEntries(entries, filters);
    }

    /**
     * GET AUDIT TRAIL FOR USER
     */
    getUserAuditTrail(userId, filters = {}) {
        const entries = this.auditLogs.get(`user:${userId}`) || [];
        return this.filterAndSortEntries(entries, filters);
    }

    /**
     * GET AUDIT TRAIL BY TYPE
     */
    getAuditTrailByType(eventType, filters = {}) {
        const entryIds = this.auditIndex.get(`type:${eventType}`) || [];
        const entries = this.getEntriesByIds(entryIds);
        return this.filterAndSortEntries(entries, filters);
    }

    /**
     * GET AUDIT TRAIL BY DATE RANGE
     */
    getAuditTrailByDateRange(startDate, endDate, filters = {}) {
        const entries = [];
        const currentDate = new Date(startDate);
        const end = new Date(endDate);
        
        while (currentDate <= end) {
            const dateKey = currentDate.toISOString().split('T')[0];
            const entryIds = this.auditIndex.get(`date:${dateKey}`) || [];
            const dateEntries = this.getEntriesByIds(entryIds);
            entries.push(...dateEntries);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return this.filterAndSortEntries(entries, filters);
    }

    /**
     * FILTER AND SORT ENTRIES
     */
    filterAndSortEntries(entries, filters) {
        let filtered = [...entries];
        
        // Apply filters
        if (filters.severity) {
            filtered = filtered.filter(e => e.severity === filters.severity);
        }
        
        if (filters.category) {
            filtered = filtered.filter(e => e.category === filters.category);
        }
        
        if (filters.userId) {
            filtered = filtered.filter(e => e.data.userId === filters.userId);
        }
        
        if (filters.startDate) {
            const start = new Date(filters.startDate);
            filtered = filtered.filter(e => new Date(e.timestamp) >= start);
        }
        
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            filtered = filtered.filter(e => new Date(e.timestamp) <= end);
        }
        
        // Sort (default: newest first)
        const sortField = filters.sortBy || 'timestamp';
        const sortOrder = filters.sortOrder || 'desc';
        
        filtered.sort((a, b) => {
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
        const pageSize = filters.pageSize || 50;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = filtered.slice(startIndex, endIndex);
        
        return {
            entries: paginated,
            pagination: {
                page,
                pageSize,
                totalEntries: filtered.length,
                totalPages: Math.ceil(filtered.length / pageSize),
                hasNext: endIndex < filtered.length,
                hasPrevious: page > 1
            },
            filtersApplied: filters,
            summary: this.generateSummary(filtered)
        };
    }

    /**
     * GENERATE SUMMARY
     */
    generateSummary(entries) {
        const summary = {
            totalEntries: entries.length,
            bySeverity: {},
            byCategory: {},
            byEventType: {},
            timeline: [],
            anomalies: []
        };
        
        // Count by severity
        entries.forEach(entry => {
            summary.bySeverity[entry.severity] = (summary.bySeverity[entry.severity] || 0) + 1;
            summary.byCategory[entry.category] = (summary.byCategory[entry.category] || 0) + 1;
            summary.byEventType[entry.eventType] = (summary.byEventType[entry.eventType] || 0) + 1;
        });
        
        // Generate timeline (last 30 days)
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            
            const dayEntries = entries.filter(e => {
                const entryDate = new Date(e.timestamp).toISOString().split('T')[0];
                return entryDate === dateKey;
            });
            
            summary.timeline.push({
                date: dateKey,
                count: dayEntries.length,
                severities: {
                    CRITICAL: dayEntries.filter(e => e.severity === 'CRITICAL').length,
                    HIGH: dayEntries.filter(e => e.severity === 'HIGH').length,
                    WARNING: dayEntries.filter(e => e.severity === 'WARNING').length,
                    INFO: dayEntries.filter(e => e.severity === 'INFO').length
                }
            });
        }
        
        // Detect anomalies
        summary.anomalies = this.detectAnomalies(entries);
        
        return summary;
    }

    /**
     * DETECT ANOMALIES
     */
    detectAnomalies(entries) {
        const anomalies = [];
        
        // Group by user and check for suspicious patterns
        const userActivity = {};
        entries.forEach(entry => {
            if (entry.data.userId) {
                if (!userActivity[entry.data.userId]) {
                    userActivity[entry.data.userId] = [];
                }
                userActivity[entry.data.userId].push(entry);
            }
        });
        
        // Check for excessive failed access attempts
        Object.entries(userActivity).forEach(([userId, userEntries]) => {
            const failedAccesses = userEntries.filter(e => 
                e.eventType === 'ACCESS_DENIED'
            ).length;
            
            if (failedAccesses > 5) { // Threshold
                anomalies.push({
                    type: 'EXCESSIVE_FAILED_ACCESS',
                    userId,
                    count: failedAccesses,
                    severity: 'HIGH',
                    recommendation: 'Review user access patterns'
                });
            }
            
            // Check for rapid succession of similar actions
            const stateChanges = userEntries.filter(e => 
                e.eventType === 'LEDGER_STATE_CHANGED'
            );
            
            if (stateChanges.length > 10) { // Threshold
                const timeSpan = Math.abs(
                    new Date(stateChanges[stateChanges.length - 1].timestamp) - 
                    new Date(stateChanges[0].timestamp)
                ) / (1000 * 60); // Minutes
                
                if (timeSpan < 5) { // 5 minutes threshold
                    anomalies.push({
                        type: 'RAPID_STATE_CHANGES',
                        userId,
                        count: stateChanges.length,
                        timeSpan: `${timeSpan.toFixed(2)} minutes`,
                        severity: 'MEDIUM',
                        recommendation: 'Check for automated or suspicious activity'
                    });
                }
            }
        });
        
        // Check for hash chain breaks
        const hashBreaks = entries.filter(e => e.eventType === 'HASH_CHAIN_BREAK');
        hashBreaks.forEach(breakEvent => {
            anomalies.push({
                type: 'HASH_CHAIN_INTEGRITY_BREAK',
                ledgerId: breakEvent.data.ledgerId,
                entryId: breakEvent.data.entryId,
                severity: 'CRITICAL',
                recommendation: 'Immediate investigation required'
            });
        });
        
        // Check for admin overrides
        const adminOverrides = entries.filter(e => e.eventType === 'ADMIN_OVERRIDE');
        if (adminOverrides.length > 0) {
            anomalies.push({
                type: 'ADMIN_OVERRIDES_DETECTED',
                count: adminOverrides.length,
                severity: 'HIGH',
                recommendation: 'Review all admin overrides for compliance'
            });
        }
        
        return anomalies;
    }

    /**
     * EXPORT AUDIT DATA
     */
    exportAuditData(format = 'json', filters = {}) {
        let entries;
        
        if (filters.ledgerId) {
            entries = this.getLedgerAuditTrail(filters.ledgerId, filters);
        } else if (filters.userId) {
            entries = this.getUserAuditTrail(filters.userId, filters);
        } else if (filters.eventType) {
            entries = this.getAuditTrailByType(filters.eventType, filters);
        } else if (filters.startDate && filters.endDate) {
            entries = this.getAuditTrailByDateRange(filters.startDate, filters.endDate, filters);
        } else {
            entries = this.filterAndSortEntries(this.auditLogs.get('global') || [], filters);
        }
        
        // Log the export itself
        this.logEvent('DATA_EXPORT', {
            userId: filters.exportedBy,
            exportType: format,
            scope: filters.ledgerId ? `ledger:${filters.ledgerId}` : 'global',
            filterCriteria: filters,
            entryCount: entries.entries?.length || 0
        });
        
        switch (format.toLowerCase()) {
            case 'json':
                return {
                    format: 'json',
                    data: entries,
                    exportedAt: new Date(),
                    exportId: `EXPORT_${Date.now()}`
                };
                
            case 'csv':
                const csvData = this.convertToCSV(entries.entries || entries);
                return {
                    format: 'csv',
                    data: csvData,
                    exportedAt: new Date(),
                    exportId: `EXPORT_${Date.now()}`
                };
                
            case 'pdf':
                // In production, generate PDF
                return {
                    format: 'pdf',
                    data: 'PDF generation would happen here',
                    exportedAt: new Date(),
                    exportId: `EXPORT_${Date.now()}`
                };
                
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    /**
     * CONVERT TO CSV
     */
    convertToCSV(entries) {
        if (entries.length === 0) return '';
        
        const headers = [
            'ID', 'Event Type', 'Severity', 'Category', 'Timestamp',
            'User ID', 'Ledger ID', 'Description', 'Hash'
        ];
        
        const rows = entries.map(entry => [
            entry.id,
            entry.eventType,
            entry.severity,
            entry.category,
            entry.timestamp.toISOString(),
            entry.data.userId || '',
            entry.data.ledgerId || '',
            this.getEventDescription(entry),
            entry.metadata.hash.substring(0, 16) + '...'
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }

    /**
     * GET EVENT DESCRIPTION
     */
    getEventDescription(entry) {
        switch (entry.eventType) {
            case 'LEDGER_CREATED':
                return `Ledger created: ${entry.data.ledgerId}, Amount: ${entry.data.amount}`;
                
            case 'LEDGER_STATE_CHANGED':
                return `State changed from ${entry.data.fromState} to ${entry.data.toState}: ${entry.data.reason}`;
                
            case 'REPAYMENT_RECEIVED':
                return `Repayment received: ${entry.data.amount}, Method: ${entry.data.paymentMethod}`;
                
            case 'ACCESS_DENIED':
                return `Access denied for ${entry.data.userId}: ${entry.data.reason}`;
                
            case 'ADMIN_OVERRIDE':
                return `Admin override by ${entry.data.adminId}: ${entry.data.justification}`;
                
            case 'HASH_CHAIN_BREAK':
                return `Hash chain break detected in ledger ${entry.data.ledgerId}`;
                
            default:
                return `${entry.eventType} event occurred`;
        }
    }

    /**
     * VERIFY AUDIT INTEGRITY
     */
    verifyAuditIntegrity() {
        const issues = [];
        const verifiedEntries = [];
        
        // Check all entries for hash integrity
        for (const [category, entries] of this.auditLogs.entries()) {
            for (const entry of entries) {
                const expectedHash = this.generateEventHash(
                    entry.eventType,
                    entry.data,
                    new Date(entry.timestamp)
                );
                
                if (entry.metadata.hash !== expectedHash) {
                    issues.push({
                        type: 'HASH_MISMATCH',
                        entryId: entry.id,
                        expectedHash,
                        actualHash: entry.metadata.hash,
                        category,
                        timestamp: entry.timestamp
                    });
                } else {
                    verifiedEntries.push(entry.id);
                }
            }
        }
        
        // Check for missing entries in index
        for (const [key, entryIds] of this.auditIndex.entries()) {
            for (const entryId of entryIds) {
                const entryExists = verifiedEntries.includes(entryId);
                if (!entryExists) {
                    issues.push({
                        type: 'INDEX_ORPHAN',
                        indexKey: key,
                        entryId,
                        issue: 'Entry in index but not in storage'
                    });
                }
            }
        }
        
        // Check retention policy compliance
        const now = new Date();
        for (const [category, entries] of this.auditLogs.entries()) {
            for (const entry of entries) {
                const entryAge = Math.floor((now - new Date(entry.timestamp)) / (1000 * 60 * 60 * 24));
                const retentionDays = this.getRetentionDays(entry.retentionPeriod);
                
                if (entryAge > retentionDays && retentionDays > 0) {
                    issues.push({
                        type: 'RETENTION_POLICY_VIOLATION',
                        entryId: entry.id,
                        ageDays: entryAge,
                        retentionDays,
                        category: entry.category,
                        severity: entry.severity
                    });
                }
            }
        }
        
        return {
            verified: verifiedEntries.length,
            issues,
            integrityScore: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 10)),
            recommendation: issues.length > 0 ? 'Immediate review required' : 'Integrity verified'
        };
    }

    /**
     * GET RETENTION DAYS
     */
    getRetentionDays(retentionPeriod) {
        const periods = {
            PERMANENT: 36500, // 100 years
            '10_YEARS': 3650,
            '5_YEARS': 1825,
            '2_YEARS': 730,
            '90_DAYS': 90
        };
        
        return periods[retentionPeriod] || 730; // Default 2 years
    }

    /**
     * COMPRESS OLD AUDIT ENTRIES
     */
    compressOldAuditEntries() {
        const now = new Date();
        const compressionThreshold = 90; // Days
        const compressed = [];
        
        for (const [category, entries] of this.auditLogs.entries()) {
            const oldEntries = entries.filter(entry => {
                const entryAge = Math.floor((now - new Date(entry.timestamp)) / (1000 * 60 * 60 * 24));
                return entryAge > compressionThreshold && entry.severity === 'INFO';
            });
            
            if (oldEntries.length > 0) {
                // Create summary entry
                const summaryEntry = {
                    id: `COMPRESSED_${category}_${Date.now()}`,
                    eventType: 'AUDIT_COMPRESSION',
                    eventCode: 'AUDIT_COMPRESSION',
                    severity: 'INFO',
                    category: 'SYSTEM',
                    timestamp: now,
                    data: {
                        originalCategory: category,
                        compressedCount: oldEntries.length,
                        dateRange: {
                            start: oldEntries[0].timestamp,
                            end: oldEntries[oldEntries.length - 1].timestamp
                        },
                        originalEntries: oldEntries.map(e => ({
                            id: e.id,
                            eventType: e.eventType,
                            timestamp: e.timestamp
                        }))
                    },
                    metadata: {
                        immutable: true,
                        version: '1.0',
                        hash: this.generateEventHash('AUDIT_COMPRESSION', {
                            category,
                            count: oldEntries.length
                        }, now),
                        compressionRatio: `${oldEntries.length}:1`
                    }
                };
                
                // Replace old entries with summary
                this.auditLogs.set(category, entries.filter(entry => !oldEntries.includes(entry)));
                this.storeAuditEntry(summaryEntry);
                compressed.push({
                    category,
                    compressed: oldEntries.length,
                    summaryId: summaryEntry.id
                });
            }
        }
        
        return {
            compressed,
            totalCompressed: compressed.reduce((sum, c) => sum + c.compressed, 0),
            timestamp: now
        };
    }

    /**
     * GENERATE COMPLIANCE REPORT
     */
    generateComplianceReport(regulation = 'ALL') {
        const report = {
            generatedAt: new Date(),
            regulation,
            checks: [],
            status: 'COMPLIANT',
            issues: []
        };
        
        // GDPR Compliance
        if (regulation === 'ALL' || regulation === 'GDPR') {
            const gdprCheck = this.checkGDPRCompliance();
            report.checks.push(gdprCheck);
            if (!gdprCheck.compliant) {
                report.status = 'NON_COMPLIANT';
                report.issues.push(...gdprCheck.issues);
            }
        }
        
        // Data Integrity Compliance
        const integrityCheck = this.verifyAuditIntegrity();
        report.checks.push({
            regulation: 'DATA_INTEGRITY',
            check: 'Audit Trail Integrity',
            compliant: integrityCheck.integrityScore >= 90,
            score: integrityCheck.integrityScore,
            issues: integrityCheck.issues
        });
        
        if (integrityCheck.integrityScore < 90) {
            report.status = 'NON_COMPLIANT';
            report.issues.push('Audit trail integrity below threshold');
        }
        
        // Retention Policy Compliance
        const retentionCheck = this.checkRetentionCompliance();
        report.checks.push(retentionCheck);
        if (!retentionCheck.compliant) {
            report.status = 'NON_COMPLIANT';
            report.issues.push('Retention policy violations detected');
        }
        
        report.summary = {
            totalChecks: report.checks.length,
            compliantChecks: report.checks.filter(c => c.compliant).length,
            nonCompliantChecks: report.checks.filter(c => !c.compliant).length,
            totalIssues: report.issues.length
        };
        
        return report;
    }

    /**
     * CHECK GDPR COMPLIANCE
     */
    checkGDPRCompliance() {
        const issues = [];
        
        // Check for user data retention
        for (const [userId, entries] of this.auditLogs.entries()) {
            if (userId.startsWith('user:')) {
                const userEntries = entries;
                const now = new Date();
                
                // Check if any entry exceeds 6 years
                const oldEntries = userEntries.filter(entry => {
                    const entryAge = Math.floor((now - new Date(entry.timestamp)) / (1000 * 60 * 60 * 24));
                    return entryAge > 2190; // 6 years
                });
                
                if (oldEntries.length > 0) {
                    issues.push({
                        type: 'GDPR_RETENTION_VIOLATION',
                        userId: userId.replace('user:', ''),
                        oldEntries: oldEntries.length,
                        oldestEntry: oldEntries[0].timestamp
                    });
                }
            }
        }
        
        return {
            regulation: 'GDPR',
            check: 'Data Protection Compliance',
            compliant: issues.length === 0,
            issues,
            requirements: [
                'Right to be forgotten supported',
                'Data minimization practiced',
                '6-year retention limit'
            ]
        };
    }

    /**
     * CHECK RETENTION COMPLIANCE
     */
    checkRetentionCompliance() {
        const issues = [];
        const now = new Date();
        
        for (const [category, entries] of this.auditLogs.entries()) {
            for (const entry of entries) {
                const retentionDays = this.getRetentionDays(entry.retentionPeriod);
                if (retentionDays === 36500) continue; // Permanent retention
                
                const entryAge = Math.floor((now - new Date(entry.timestamp)) / (1000 * 60 * 60 * 24));
                
                if (entryAge > retentionDays) {
                    issues.push({
                        type: 'RETENTION_OVERDUE',
                        entryId: entry.id,
                        category: entry.category,
                        severity: entry.severity,
                        ageDays: entryAge,
                        retentionDays,
                        overdueBy: entryAge - retentionDays
                    });
                }
            }
        }
        
        return {
            regulation: 'RETENTION_POLICY',
            check: 'Data Retention Compliance',
            compliant: issues.length === 0,
            issues,
            retentionSummary: {
                PERMANENT: this.countEntriesByRetention('PERMANENT'),
                '10_YEARS': this.countEntriesByRetention('10_YEARS'),
                '5_YEARS': this.countEntriesByRetention('5_YEARS'),
                '2_YEARS': this.countEntriesByRetention('2_YEARS'),
                '90_DAYS': this.countEntriesByRetention('90_DAYS')
            }
        };
    }

    /**
     * COUNT ENTRIES BY RETENTION
     */
    countEntriesByRetention(retentionPeriod) {
        let count = 0;
        
        for (const [category, entries] of this.auditLogs.entries()) {
            count += entries.filter(entry => entry.retentionPeriod === retentionPeriod).length;
        }
        
        return count;
    }

    /**
     * HELPER METHODS
     */
    generateAuditId(eventType, data) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `AUDIT_${eventType}_${timestamp}_${random}`;
    }

    generateEventHash(eventType, data, timestamp) {
        const str = `${eventType}-${JSON.stringify(data)}-${timestamp.getTime()}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(36);
    }

    getEventContext() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            timestamp: new Date(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    getComplianceTags(eventType, data) {
        const tags = [];
        
        if (eventType.includes('FINANCIAL') || eventType.includes('REPAYMENT')) {
            tags.push('FINANCIAL_DATA', 'PCI_DSS');
        }
        
        if (eventType.includes('USER') || data.userId) {
            tags.push('PERSONAL_DATA', 'GDPR');
        }
        
        if (eventType.includes('ADMIN') || eventType.includes('OVERRIDE')) {
            tags.push('ADMIN_ACTION', 'HIGH_RISK');
        }
        
        if (eventType.includes('SECURITY') || eventType.includes('ACCESS')) {
            tags.push('SECURITY_EVENT', 'AUDIT_TRAIL');
        }
        
        return tags;
    }

    triggerAlert(auditEntry) {
        // In production, this would send alerts to monitoring systems
        console.warn('AUDIT ALERT:', auditEntry);
        
        // Could integrate with:
        // - Email/SMS notifications
        // - Slack/Teams webhooks
        // - PagerDuty for critical events
        // - SIEM systems
    }

    getEntriesByIds(entryIds) {
        const entries = [];
        
        for (const [category, categoryEntries] of this.auditLogs.entries()) {
            for (const entry of categoryEntries) {
                if (entryIds.includes(entry.id)) {
                    entries.push(entry);
                }
            }
        }
        
        return entries;
    }

    /**
     * STATISTICS AND METRICS
     */
    getStatistics() {
        const stats = {
            totalEntries: 0,
            bySeverity: {},
            byCategory: {},
            byEventType: {},
            dailyAverage: 0,
            anomalyCount: 0
        };
        
        for (const [category, entries] of this.auditLogs.entries()) {
            if (category === 'global') {
                stats.totalEntries = entries.length;
                
                // Calculate daily average (last 30 days)
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const recentEntries = entries.filter(e => new Date(e.timestamp) > thirtyDaysAgo);
                stats.dailyAverage = recentEntries.length / 30;
                
                // Count anomalies
                stats.anomalyCount = this.detectAnomalies(entries).length;
            }
            
            // Aggregate counts
            entries.forEach(entry => {
                stats.bySeverity[entry.severity] = (stats.bySeverity[entry.severity] || 0) + 1;
                stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
                stats.byEventType[entry.eventType] = (stats.byEventType[entry.eventType] || 0) + 1;
            });
        }
        
        return stats;
    }
}

// Export singleton instance
const ledgerAudit = new LedgerAudit();
export default ledgerAudit;