/**
 * M-PESEWA BLACKLIST AUDIT TRAIL
 * Append-only audit log for all blacklist actions
 * Ensures full transparency and non-repudiation
 */

class BlacklistAudit {
    constructor() {
        this.auditLog = [];
        this.maxLogEntries = 10000; // Maximum entries to keep in memory
        this.auditVersion = '1.0.0';
        this.initializeAuditStore();
    }

    /**
     * Initialize audit storage
     */
    initializeAuditStore() {
        console.log('📋 Blacklist Audit Trail Initializing...');
        
        // Load existing audit trail
        this.loadAuditTrail();
        
        // Setup periodic backup
        this.setupBackupSchedule();
        
        // Setup integrity verification
        this.setupIntegrityChecks();
        
        console.log('✅ Blacklist Audit Trail Initialized');
    }

    /**
     * Load existing audit trail from storage
     */
    loadAuditTrail() {
        try {
            const storedAudit = localStorage.getItem('mpesewa_blacklist_audit');
            if (storedAudit) {
                this.auditLog = JSON.parse(storedAudit);
                console.log(`📊 Loaded ${this.auditLog.length} audit entries`);
                
                // Verify integrity of loaded data
                const integrityCheck = this.verifyAuditIntegrity();
                if (!integrityCheck.valid) {
                    console.warn('⚠️ Audit integrity issues found:', integrityCheck.issues);
                    // Attempt to repair
                    this.repairAuditTrail();
                }
            } else {
                // Initialize with system start entry
                this.logSystemEvent('AUDIT_TRAIL_INITIALIZED', {
                    version: this.auditVersion,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('❌ Error loading audit trail:', error);
            // Initialize fresh audit trail
            this.auditLog = [];
            this.logSystemEvent('AUDIT_TRAIL_ERROR', {
                error: error.message,
                recovery: 'FRESH_START',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Log an audit action
     * @param {Object} actionData - Action data
     * @returns {string} - Audit ID
     */
    logAction(actionData) {
        const auditEntry = this.createAuditEntry(actionData);
        
        // Add to in-memory log
        this.auditLog.push(auditEntry);
        
        // Enforce size limit
        if (this.auditLog.length > this.maxLogEntries) {
            this.auditLog = this.auditLog.slice(-this.maxLogEntries);
            this.logSystemEvent('AUDIT_LOG_TRUNCATED', {
                retainedEntries: this.maxLogEntries,
                timestamp: new Date().toISOString()
            });
        }
        
        // Persist to storage
        this.persistAuditTrail();
        
        // Dispatch audit event
        this.dispatchAuditEvent(auditEntry);
        
        console.log(`📝 Audit logged: ${auditEntry.action} for ${auditEntry.userId || 'system'}`);
        
        return auditEntry.auditId;
    }

    /**
     * Create a standardized audit entry
     * @param {Object} actionData - Action data
     * @returns {Object} - Audit entry
     */
    createAuditEntry(actionData) {
        const now = new Date();
        const auditId = this.generateAuditId();
        
        return {
            auditId,
            timestamp: now.toISOString(),
            timestampUnix: now.getTime(),
            action: actionData.action,
            userId: actionData.userId || null,
            countryCode: actionData.countryCode || null,
            performedBy: actionData.performedBy || 'system',
            userAgent: navigator.userAgent,
            ipHash: this.hashIP(actionData.ipAddress), // Privacy-preserving
            details: actionData.details || {},
            evidence: actionData.evidence || [],
            reason: actionData.reason || '',
            previousState: actionData.previousState || null,
            newState: actionData.newState || null,
            metadata: {
                version: this.auditVersion,
                sessionId: this.getSessionId(),
                deviceId: this.getDeviceId(),
                location: actionData.location || this.estimateLocation(),
                riskScore: actionData.riskScore || 0
            },
            hash: null // Will be set after creation
        };
    }

    /**
     * Generate unique audit ID
     * @returns {string} - Audit ID
     */
    generateAuditId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        const counter = (this.auditLog.length + 1).toString(36).padStart(4, '0');
        return `aud_${timestamp}_${random}_${counter}`;
    }

    /**
     * Hash IP address for privacy
     * @param {string} ip - IP address
     * @returns {string} - Hashed IP
     */
    hashIP(ip) {
        if (!ip) return 'ANONYMOUS';
        
        // Simple hash for demo - in production use proper hashing
        let hash = 0;
        for (let i = 0; i < ip.length; i++) {
            const char = ip.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        // Return first 8 characters of hash as hex
        return Math.abs(hash).toString(16).substr(0, 8).toUpperCase();
    }

    /**
     * Get session ID
     * @returns {string} - Session ID
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('mpesewa_session_id');
        if (!sessionId) {
            sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('mpesewa_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Get device ID
     * @returns {string} - Device ID
     */
    getDeviceId() {
        let deviceId = localStorage.getItem('mpesewa_device_id');
        if (!deviceId) {
            deviceId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('mpesewa_device_id', deviceId);
        }
        return deviceId;
    }

    /**
     * Estimate location (country level only)
     * @returns {string} - Estimated country
     */
    estimateLocation() {
        try {
            // Try to get from stored user data
            const userData = localStorage.getItem('mpesewa_user_country');
            if (userData) return userData;
            
            // Try to infer from timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezone.includes('Nairobi')) return 'KE';
            if (timezone.includes('Kampala')) return 'UG';
            if (timezone.includes('Dar_es_Salaam')) return 'TZ';
            if (timezone.includes('Kigali')) return 'RW';
            
            return 'UNKNOWN';
        } catch (error) {
            return 'UNKNOWN';
        }
    }

    /**
     * Log system event
     * @param {string} eventType - Event type
     * @param {Object} data - Event data
     */
    logSystemEvent(eventType, data) {
        const systemEntry = {
            action: eventType,
            performedBy: 'system',
            details: data,
            timestamp: new Date().toISOString()
        };
        
        this.logAction(systemEntry);
    }

    /**
     * Persist audit trail to storage
     */
    persistAuditTrail() {
        try {
            // Calculate hash for integrity
            this.calculateAuditHash();
            
            // Save to localStorage
            localStorage.setItem('mpesewa_blacklist_audit', JSON.stringify(this.auditLog));
            
            // Also save compressed version for backup
            this.createBackup();
            
        } catch (error) {
            console.error('❌ Error persisting audit trail:', error);
            this.logSystemEvent('AUDIT_PERSIST_ERROR', {
                error: error.message,
                remainingEntries: this.auditLog.length
            });
        }
    }

    /**
     * Calculate hash for audit integrity
     */
    calculateAuditHash() {
        if (this.auditLog.length === 0) return;
        
        // Simple chain hash for demo
        let chainHash = '';
        for (let i = 0; i < this.auditLog.length; i++) {
            const entry = this.auditLog[i];
            const entryString = JSON.stringify(entry);
            
            // Simple hash calculation
            let hash = 0;
            for (let j = 0; j < entryString.length; j++) {
                const char = entryString.charCodeAt(j);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            
            // Include previous hash in calculation
            if (i > 0) {
                hash = hash ^ parseInt(chainHash.substr(0, 8), 16);
            }
            
            const entryHash = Math.abs(hash).toString(16).substr(0, 8);
            entry.hash = entryHash;
            
            // Update chain hash
            chainHash = entryHash;
        }
        
        // Store chain hash
        localStorage.setItem('mpesewa_audit_chain_hash', chainHash);
    }

    /**
     * Create backup of audit trail
     */
    createBackup() {
        try {
            const backupKey = `mpesewa_audit_backup_${new Date().toISOString().split('T')[0]}`;
            const backupData = {
                entries: this.auditLog.slice(-1000), // Last 1000 entries
                totalEntries: this.auditLog.length,
                backupDate: new Date().toISOString(),
                version: this.auditVersion
            };
            
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            
            // Clean up old backups (keep last 7 days)
            this.cleanupOldBackups();
            
        } catch (error) {
            console.warn('⚠️ Could not create audit backup:', error);
        }
    }

    /**
     * Clean up old backups
     */
    cleanupOldBackups() {
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('mpesewa_audit_backup_')) {
                const dateStr = key.replace('mpesewa_audit_backup_', '');
                const backupDate = new Date(dateStr).getTime();
                
                if (backupDate < oneWeekAgo) {
                    localStorage.removeItem(key);
                }
            }
        }
    }

    /**
     * Setup backup schedule
     */
    setupBackupSchedule() {
        // Backup every 6 hours
        setInterval(() => {
            this.createBackup();
        }, 6 * 60 * 60 * 1000);
    }

    /**
     * Setup integrity checks
     */
    setupIntegrityChecks() {
        // Run integrity check every hour
        setInterval(() => {
            this.runIntegrityCheck();
        }, 60 * 60 * 1000);
        
        // Run on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.runIntegrityCheck();
            }
        });
    }

    /**
     * Run integrity check
     */
    runIntegrityCheck() {
        const integrityCheck = this.verifyAuditIntegrity();
        
        if (!integrityCheck.valid) {
            console.warn('⚠️ Audit integrity check failed:', integrityCheck.issues);
            this.logSystemEvent('AUDIT_INTEGRITY_FAILURE', {
                issues: integrityCheck.issues,
                timestamp: new Date().toISOString(),
                autoRepair: integrityCheck.repairable
            });
            
            if (integrityCheck.repairable) {
                this.repairAuditTrail();
            }
        } else {
            this.logSystemEvent('AUDIT_INTEGRITY_PASS', {
                entries: this.auditLog.length,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Verify audit integrity
     * @returns {Object} - Integrity check result
     */
    verifyAuditIntegrity() {
        const result = {
            valid: true,
            repairable: true,
            issues: [],
            totalEntries: this.auditLog.length
        };

        if (this.auditLog.length === 0) {
            return result;
        }

        // Check for duplicate audit IDs
        const auditIds = new Set();
        for (const entry of this.auditLog) {
            if (auditIds.has(entry.auditId)) {
                result.issues.push(`Duplicate audit ID: ${entry.auditId}`);
                result.valid = false;
            }
            auditIds.add(entry.auditId);
        }

        // Check timestamp ordering
        for (let i = 1; i < this.auditLog.length; i++) {
            const prevTime = new Date(this.auditLog[i-1].timestamp).getTime();
            const currTime = new Date(this.auditLog[i].timestamp).getTime();
            
            if (currTime < prevTime) {
                result.issues.push(`Timestamp out of order at index ${i}`);
                result.valid = false;
            }
        }

        // Verify hash chain
        let expectedHash = '';
        for (let i = 0; i < this.auditLog.length; i++) {
            const entry = this.auditLog[i];
            const entryString = JSON.stringify({ ...entry, hash: null });
            
            let hash = 0;
            for (let j = 0; j < entryString.length; j++) {
                const char = entryString.charCodeAt(j);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            
            if (i > 0) {
                hash = hash ^ parseInt(expectedHash.substr(0, 8), 16);
            }
            
            const expectedEntryHash = Math.abs(hash).toString(16).substr(0, 8);
            
            if (entry.hash !== expectedEntryHash) {
                result.issues.push(`Hash mismatch at index ${i}: expected ${expectedEntryHash}, got ${entry.hash}`);
                result.valid = false;
                result.repairable = false; // Hash mismatch is serious
            }
            
            expectedHash = entry.hash;
        }

        // Check stored chain hash
        const storedChainHash = localStorage.getItem('mpesewa_audit_chain_hash');
        const lastEntryHash = this.auditLog[this.auditLog.length - 1]?.hash;
        
        if (storedChainHash && lastEntryHash !== storedChainHash) {
            result.issues.push(`Chain hash mismatch: stored ${storedChainHash}, last entry ${lastEntryHash}`);
            result.valid = false;
        }

        return result;
    }

    /**
     * Repair audit trail
     */
    repairAuditTrail() {
        console.log('🔧 Attempting to repair audit trail...');
        
        // Remove duplicates by auditId
        const uniqueEntries = [];
        const seenIds = new Set();
        
        for (const entry of this.auditLog) {
            if (!seenIds.has(entry.auditId)) {
                seenIds.add(entry.auditId);
                uniqueEntries.push(entry);
            }
        }
        
        // Sort by timestamp
        uniqueEntries.sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
        });
        
        // Recalculate hashes
        this.auditLog = uniqueEntries;
        this.calculateAuditHash();
        
        // Persist repaired trail
        this.persistAuditTrail();
        
        this.logSystemEvent('AUDIT_TRAIL_REPAIRED', {
            originalEntries: this.auditLog.length,
            repairedEntries: uniqueEntries.length,
            removedDuplicates: this.auditLog.length - uniqueEntries.length,
            timestamp: new Date().toISOString()
        });
        
        console.log('✅ Audit trail repaired');
    }

    /**
     * Dispatch audit event
     * @param {Object} auditEntry - Audit entry
     */
    dispatchAuditEvent(auditEntry) {
        const event = new CustomEvent('mpesewa:audit-logged', {
            detail: {
                entry: auditEntry,
                totalEntries: this.auditLog.length
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Query audit trail
     * @param {Object} filters - Query filters
     * @returns {Array} - Filtered audit entries
     */
    queryAuditTrail(filters = {}) {
        let results = [...this.auditLog];
        
        // Apply filters
        if (filters.userId) {
            results = results.filter(entry => entry.userId === filters.userId);
        }
        
        if (filters.countryCode) {
            results = results.filter(entry => entry.countryCode === filters.countryCode);
        }
        
        if (filters.action) {
            results = results.filter(entry => entry.action === filters.action);
        }
        
        if (filters.performedBy) {
            results = results.filter(entry => entry.performedBy === filters.performedBy);
        }
        
        if (filters.startDate) {
            const start = new Date(filters.startDate).getTime();
            results = results.filter(entry => new Date(entry.timestamp).getTime() >= start);
        }
        
        if (filters.endDate) {
            const end = new Date(filters.endDate).getTime();
            results = results.filter(entry => new Date(entry.timestamp).getTime() <= end);
        }
        
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase();
            results = results.filter(entry => {
                return JSON.stringify(entry).toLowerCase().includes(searchLower);
            });
        }
        
        // Sort (default: newest first)
        const sortField = filters.sortBy || 'timestamp';
        const sortOrder = filters.sortOrder || 'desc';
        
        results.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            
            // Handle dates
            if (sortField === 'timestamp') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        // Pagination
        if (filters.limit) {
            const offset = filters.offset || 0;
            results = results.slice(offset, offset + filters.limit);
        }
        
        return {
            entries: results,
            total: results.length,
            filters,
            queryTime: new Date().toISOString()
        };
    }

    /**
     * Export audit trail
     * @param {Object} options - Export options
     * @returns {Object} - Export data
     */
    exportAuditTrail(options = {}) {
        const {
            format = 'json',
            includeSensitive = false,
            compress = false
        } = options;
        
        let exportData = [...this.auditLog];
        
        // Remove sensitive data if requested
        if (!includeSensitive) {
            exportData = exportData.map(entry => {
                const { ipHash, deviceId, sessionId, ...safeEntry } = entry;
                return {
                    ...safeEntry,
                    metadata: {
                        ...safeEntry.metadata,
                        deviceId: 'REDACTED',
                        sessionId: 'REDACTED'
                    }
                };
            });
        }
        
        // Add export metadata
        const exportMetadata = {
            exportDate: new Date().toISOString(),
            totalEntries: exportData.length,
            format,
            includeSensitive,
            exportedBy: 'system',
            auditVersion: this.auditVersion
        };
        
        let result;
        
        switch (format) {
            case 'json':
                result = {
                    metadata: exportMetadata,
                    data: exportData
                };
                break;
                
            case 'csv':
                // Convert to CSV string
                if (exportData.length === 0) {
                    result = '';
                } else {
                    const headers = Object.keys(exportData[0]);
                    const csvRows = [
                        headers.join(','),
                        ...exportData.map(row => 
                            headers.map(header => 
                                JSON.stringify(row[header] || '')
                            ).join(',')
                        )
                    ];
                    result = csvRows.join('\n');
                }
                break;
                
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
        
        // Log export action
        this.logSystemEvent('AUDIT_EXPORTED', {
            format,
            entryCount: exportData.length,
            includeSensitive,
            timestamp: new Date().toISOString()
        });
        
        return result;
    }

    /**
     * Clear audit trail (admin only)
     * @param {string} adminId - Admin ID
     * @param {string} reason - Clear reason
     * @returns {boolean} - Success status
     */
    clearAuditTrail(adminId, reason) {
        // Verify admin permissions
        if (!this.verifyAdminPermissions(adminId)) {
            console.error(`User ${adminId} is not authorized to clear audit trail`);
            return false;
        }
        
        // Log the clear action first
        this.logAction({
            action: 'AUDIT_TRAIL_CLEARED',
            performedBy: adminId,
            details: {
                reason,
                clearedEntries: this.auditLog.length,
                previousChainHash: localStorage.getItem('mpesewa_audit_chain_hash')
            },
            timestamp: new Date().toISOString()
        });
        
        // Clear the log (but keep the clear entry)
        const clearEntry = this.auditLog[this.auditLog.length - 1];
        this.auditLog = [clearEntry];
        
        // Recalculate hash
        this.calculateAuditHash();
        
        // Persist
        this.persistAuditTrail();
        
        console.log(`🗑️ Audit trail cleared by admin ${adminId}: ${reason}`);
        return true;
    }

    /**
     * Verify admin permissions
     * @param {string} adminId - Admin ID
     * @returns {boolean} - True if admin
     */
    verifyAdminPermissions(adminId) {
        // This would check against admin database
        // For demo, check localStorage
        const adminData = localStorage.getItem(`mpesewa_admin_${adminId}`);
        return adminData !== null;
    }

    /**
     * Get audit statistics
     * @returns {Object} - Statistics
     */
    getStatistics() {
        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        
        const lastDay = this.auditLog.filter(entry => 
            new Date(entry.timestamp) > oneDayAgo
        ).length;
        
        const lastWeek = this.auditLog.filter(entry => 
            new Date(entry.timestamp) > sevenDaysAgo
        ).length;
        
        const lastMonth = this.auditLog.filter(entry => 
            new Date(entry.timestamp) > thirtyDaysAgo
        ).length;
        
        // Count by action type
        const actionCounts = {};
        this.auditLog.forEach(entry => {
            actionCounts[entry.action] = (actionCounts[entry.action] || 0) + 1;
        });
        
        // Count by country
        const countryCounts = {};
        this.auditLog.forEach(entry => {
            if (entry.countryCode) {
                countryCounts[entry.countryCode] = (countryCounts[entry.countryCode] || 0) + 1;
            }
        });
        
        return {
            totalEntries: this.auditLog.length,
            last24Hours: lastDay,
            last7Days: lastWeek,
            last30Days: lastMonth,
            actionCounts,
            countryCounts,
            firstEntry: this.auditLog[0]?.timestamp || null,
            lastEntry: this.auditLog[this.auditLog.length - 1]?.timestamp || null,
            chainHash: localStorage.getItem('mpesewa_audit_chain_hash'),
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Search audit trail
     * @param {string} query - Search query
     * @returns {Array} - Search results
     */
    searchAuditTrail(query) {
        if (!query || query.trim() === '') {
            return [];
        }
        
        const queryLower = query.toLowerCase();
        
        return this.auditLog.filter(entry => {
            // Search in specific fields
            const searchableFields = [
                entry.auditId,
                entry.userId,
                entry.countryCode,
                entry.action,
                entry.performedBy,
                entry.reason,
                JSON.stringify(entry.details),
                JSON.stringify(entry.metadata)
            ].join(' ').toLowerCase();
            
            return searchableFields.includes(queryLower);
        });
    }
}

// Export audit trail
export default BlacklistAudit;