/**
 * M-PESEWA LEDGER MODULE - MAIN ENTRY POINT
 * 
 * Exports all ledger functionality with proper dependency injection.
 */

// Import all ledger modules
import ledgerEngine from './ledger.engine.js';
import ledgerRules from './ledger.rules.js';
import ledgerStateMachine from './ledger.state-machine.js';
import ledgerPermissions from './ledger.permissions.js';
import ledgerAudit from './ledger.audit.js';
import LedgerReconciliation from './ledger.reconciliation.js';

// Create reconciliation instance with dependencies
const ledgerReconciliation = new LedgerReconciliation(
    ledgerEngine,
    ledgerRules,
    ledgerStateMachine,
    ledgerPermissions,
    ledgerAudit
);

// LEDGER API
const LedgerAPI = {
    // Core Engine
    engine: ledgerEngine,
    
    // Rules Engine
    rules: ledgerRules,
    
    // State Management
    stateMachine: ledgerStateMachine,
    
    // Permissions
    permissions: ledgerPermissions,
    
    // Audit Trail
    audit: ledgerAudit,
    
    // Reconciliation
    reconciliation: ledgerReconciliation,
    
    /**
     * CREATE LEDGER WITH VALIDATION
     */
    async createLedger(params) {
        // Validate hierarchy first
        const hierarchyValidation = ledgerEngine.validateHierarchyConstraints(params);
        if (!hierarchyValidation.valid) {
            throw new Error(`Hierarchy validation failed: ${hierarchyValidation.reason}`);
        }
        
        // Validate against rules
        const rulesValidation = ledgerRules.validateLoanRequest({
            borrowerId: params.borrowerId,
            lenderId: params.lenderId,
            amount: params.principalAmount,
            category: params.loanCategory,
            countryCode: params.countryCode,
            lenderSubscriptionTier: params.lenderSubscriptionTier,
            borrowerRating: params.borrowerRating || 5.0,
            borrowerBlacklisted: false,
            borrowerActiveLoans: 0,
            borrowerGroupCount: 1
        });
        
        if (!rulesValidation.valid) {
            throw new Error(`Rules validation failed: ${rulesValidation.violations.map(v => v.message).join(', ')}`);
        }
        
        // Check permissions
        const permissionCheck = ledgerPermissions.validateUserForAction(
            {
                role: 'LENDER',
                id: params.lenderId,
                groupId: params.groupId,
                countryCode: params.countryCode,
                subscriptionStatus: 'ACTIVE',
                subscriptionTier: params.lenderSubscriptionTier
            },
            'CREATE_LEDGER',
            {
                lenderId: params.lenderId,
                borrowerId: params.borrowerId,
                groupId: params.groupId,
                countryCode: params.countryCode,
                amount: params.principalAmount
            }
        );
        
        if (!permissionCheck.allowed) {
            throw new Error(`Permission denied: ${permissionCheck.reason}`);
        }
        
        // Create ledger
        const result = ledgerEngine.createLedger(params);
        
        // Log audit event
        ledgerAudit.logEvent('LEDGER_CREATED', {
            ledgerId: result.ledger.id,
            lenderId: params.lenderId,
            borrowerId: params.borrowerId,
            amount: params.principalAmount,
            category: params.loanCategory,
            countryCode: params.countryCode,
            groupId: params.groupId,
            performedBy: params.performedBy || 'SYSTEM'
        });
        
        return result;
    },
    
    /**
     * RECORD REPAYMENT
     */
    async recordRepayment(params) {
        const { ledgerId, amount, paymentMethod, confirmedBy, notes } = params;
        
        // Get ledger
        const ledger = ledgerEngine.state.ledgers.get(ledgerId);
        if (!ledger) {
            throw new Error(`Ledger ${ledgerId} not found`);
        }
        
        // Check permissions
        const permissionCheck = ledgerPermissions.validateUserForAction(
            {
                role: 'LENDER',
                id: confirmedBy,
                groupId: ledger.groupId,
                countryCode: ledger.countryCode,
                subscriptionStatus: 'ACTIVE'
            },
            'UPDATE_LEDGER',
            {
                ledgerId,
                lenderId: ledger.lenderId,
                borrowerId: ledger.borrowerId,
                state: ledger.state,
                outstandingBalance: ledgerEngine.calculateBalance(ledgerId)
            }
        );
        
        if (!permissionCheck.allowed) {
            throw new Error(`Permission denied: ${permissionCheck.reason}`);
        }
        
        // Validate repayment amount
        const outstandingBalance = ledgerEngine.calculateBalance(ledgerId);
        const validation = ledgerRules.validatePartialRepayment({
            amount,
            outstandingBalance
        });
        
        if (!validation.valid) {
            throw new Error(`Repayment validation failed: ${validation.reason}`);
        }
        
        // Create repayment entry
        const entryType = Math.abs(amount - outstandingBalance) < 0.01 ? 
            'FULL_REPAYMENT' : 'PARTIAL_REPAYMENT';
        
        const entry = ledgerEngine.createEntry({
            ledgerId,
            type: entryType,
            amount: -Math.abs(amount), // Negative for repayments
            description: `Repayment recorded: ${amount} via ${paymentMethod}. ${notes || ''}`,
            metadata: {
                paymentMethod,
                notes,
                isFullRepayment: entryType === 'FULL_REPAYMENT',
                previousBalance: outstandingBalance,
                newBalance: outstandingBalance - Math.abs(amount)
            },
            performedBy: confirmedBy,
            role: 'LENDER'
        });
        
        // Log audit event
        ledgerAudit.logEvent('REPAYMENT_RECEIVED', {
            ledgerId,
            amount,
            paymentMethod,
            confirmedBy,
            entryType,
            previousBalance: outstandingBalance,
            newBalance: outstandingBalance - Math.abs(amount)
        });
        
        // Update state if fully repaid
        if (entryType === 'FULL_REPAYMENT') {
            ledger.state = 'CLEARED';
            ledgerEngine.updateLedgerStatus(ledgerId, entry);
        }
        
        return {
            entry,
            ledger,
            balance: ledgerEngine.calculateBalance(ledgerId),
            isFullyRepaid: entryType === 'FULL_REPAYMENT'
        };
    },
    
    /**
     * APPLY PENALTY
     */
    async applyPenalty(params) {
        const { ledgerId, reason, performedBy } = params;
        
        const ledger = ledgerEngine.state.ledgers.get(ledgerId);
        const calculations = ledgerEngine.calculateInterestAndPenalties(ledgerId);
        
        // Check if overdue
        if (calculations.overdueDays <= 0) {
            throw new Error('Cannot apply penalty: Loan not overdue');
        }
        
        // Calculate penalty
        const outstandingBalance = ledgerEngine.calculateBalance(ledgerId);
        const penaltyAmount = outstandingBalance * 0.05; // 5%
        
        // Create penalty entry
        const entry = ledgerEngine.createEntry({
            ledgerId,
            type: 'PENALTY_APPLIED',
            amount: penaltyAmount,
            description: `Penalty applied: ${penaltyAmount}. Reason: ${reason}`,
            metadata: {
                reason,
                overdueDays: calculations.overdueDays,
                outstandingBalance,
                penaltyRate: '5%',
                daily: true
            },
            performedBy,
            role: 'LENDER'
        });
        
        // Log audit
        ledgerAudit.logEvent('PENALTY_APPLIED', {
            ledgerId,
            amount: penaltyAmount,
            reason,
            overdueDays: calculations.overdueDays,
            performedBy
        });
        
        return {
            entry,
            penalty: penaltyAmount,
            newBalance: ledgerEngine.calculateBalance(ledgerId),
            overdueDays: calculations.overdueDays
        };
    },
    
    /**
     * GET LEDGER REPORT
     */
    async getLedgerReport(ledgerId, reportType = 'FULL') {
        const ledger = ledgerEngine.state.ledgers.get(ledgerId);
        if (!ledger) {
            throw new Error(`Ledger ${ledgerId} not found`);
        }
        
        // Check permissions (simplified)
        const canView = true; // In production, check permissions
        
        if (!canView) {
            throw new Error('Permission denied to view ledger');
        }
        
        // Generate report
        const report = ledgerEngine.generateReport(ledgerId, reportType);
        
        // Log access
        ledgerAudit.logEvent('DATA_EXPORT', {
            userId: 'REPORT_GENERATOR',
            exportType: 'LEDGER_REPORT',
            scope: `ledger:${ledgerId}`,
            reportType
        });
        
        return report;
    },
    
    /**
     * RECONCILE LEDGER
     */
    async reconcileLedger(ledgerId, options = {}) {
        return await ledgerReconciliation.runReconciliation(ledgerId, options);
    },
    
    /**
     * CHECK LEDGER HEALTH
     */
    async checkLedgerHealth(ledgerId) {
        return ledgerReconciliation.checkLedgerHealth(ledgerId);
    },
    
    /**
     * GET LEDGER HISTORY
     */
    async getLedgerHistory(ledgerId, options = {}) {
        return ledgerEngine.getLedgerHistory(ledgerId, options);
    },
    
    /**
     * VALIDATE LEDGER INTEGRITY
     */
    async validateLedgerIntegrity(ledgerId) {
        const checks = [];
        
        // Hash chain check
        const hashCheck = ledgerEngine.validateHashChain(ledgerId);
        checks.push({
            check: 'Hash Chain',
            valid: hashCheck.valid,
            details: hashCheck
        });
        
        // Balance consistency
        const balanceCheck = await ledgerReconciliation.detectBalanceMismatch(ledgerId);
        checks.push({
            check: 'Balance Consistency',
            valid: !balanceCheck.found,
            details: balanceCheck
        });
        
        // State consistency
        const stateCheck = await ledgerReconciliation.detectStateInconsistency(ledgerId);
        checks.push({
            check: 'State Consistency',
            valid: !stateCheck.found,
            details: stateCheck
        });
        
        // Overall integrity
        const allValid = checks.every(c => c.valid);
        
        return {
            ledgerId,
            timestamp: new Date(),
            valid: allValid,
            checks,
            score: checks.filter(c => c.valid).length / checks.length * 100,
            recommendation: allValid ? 
                'Ledger integrity verified' : 
                'Run full reconciliation'
        };
    },
    
    /**
     * EXPORT LEDGER DATA
     */
    async exportLedgerData(ledgerId, format = 'json', options = {}) {
        // Check permissions
        const permissionCheck = ledgerPermissions.validateUserForAction(
            {
                role: options.role || 'LENDER',
                id: options.userId
            },
            'EXPORT_LEDGER',
            { ledgerId }
        );
        
        if (!permissionCheck.allowed) {
            throw new Error(`Permission denied: ${permissionCheck.reason}`);
        }
        
        const data = {
            ledger: ledgerEngine.state.ledgers.get(ledgerId),
            entries: ledgerEngine.state.entries.get(ledgerId) || [],
            auditTrail: ledgerAudit.getLedgerAuditTrail(ledgerId),
            reconciliationHistory: [] // Would come from reconciliation logs
        };
        
        switch (format) {
            case 'json':
                return {
                    format: 'json',
                    data,
                    exportedAt: new Date()
                };
                
            case 'csv':
                // Convert to CSV
                const csvData = this.convertToCSV(data);
                return {
                    format: 'csv',
                    data: csvData,
                    exportedAt: new Date()
                };
                
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    },
    
    /**
     * CONVERT TO CSV
     */
    convertToCSV(data) {
        // Simple CSV conversion for ledger entries
        const entries = data.entries;
        if (!entries || entries.length === 0) return '';
        
        const headers = ['Date', 'Type', 'Amount', 'Description', 'Performed By'];
        const rows = entries.map(entry => [
            entry.timestamp.toISOString(),
            entry.type,
            entry.amount,
            entry.description.substring(0, 100), // Limit description length
            entry.performedBy
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        return csvContent;
    },
    
    /**
     * GET LEDGER STATISTICS
     */
    async getLedgerStatistics(ledgerId) {
        const ledger = ledgerEngine.state.ledgers.get(ledgerId);
        const entries = ledgerEngine.state.entries.get(ledgerId) || [];
        const calculations = ledgerEngine.calculateInterestAndPenalties(ledgerId);
        
        return {
            basic: {
                totalEntries: entries.length,
                repaymentEntries: entries.filter(e => e.type.includes('REPAYMENT')).length,
                penaltyEntries: entries.filter(e => e.type === 'PENALTY_APPLIED').length,
                interestEntries: entries.filter(e => e.type === 'INTEREST_APPLIED').length
            },
            
            financial: {
                principal: ledger.principalAmount,
                interest: calculations.interest,
                penalties: calculations.penalties,
                totalOwed: calculations.totalOwed,
                repaid: entries
                    .filter(e => e.type.includes('REPAYMENT'))
                    .reduce((sum, e) => sum + Math.abs(e.amount), 0),
                outstanding: ledgerEngine.calculateBalance(ledgerId)
            },
            
            temporal: {
                ageDays: calculations.daysSinceDisbursement,
                overdueDays: calculations.overdueDays,
                daysToDefault: Math.max(0, 60 - calculations.daysSinceDisbursement),
                averageDaysBetweenEntries: this.calculateAverageDays(entries)
            },
            
            state: {
                current: ledger.state,
                stateAge: this.getStateAge(ledger.state, entries),
                stateTransitions: entries.filter(e => e.type === 'STATUS_CHANGE').length
            }
        };
    },
    
    /**
     * CALCULATE AVERAGE DAYS BETWEEN ENTRIES
     */
    calculateAverageDays(entries) {
        if (entries.length < 2) return 0;
        
        const sorted = entries.sort((a, b) => a.timestamp - b.timestamp);
        let totalDays = 0;
        
        for (let i = 1; i < sorted.length; i++) {
            const diff = Math.abs(
                (sorted[i].timestamp - sorted[i - 1].timestamp) / (1000 * 60 * 60 * 24)
            );
            totalDays += diff;
        }
        
        return totalDays / (sorted.length - 1);
    },
    
    /**
     * GET STATE AGE
     */
    getStateAge(currentState, entries) {
        const stateChanges = entries
            .filter(e => e.type === 'STATUS_CHANGE')
            .sort((a, b) => b.timestamp - a.timestamp);
        
        if (stateChanges.length === 0) return 0;
        
        const lastStateChange = stateChanges.find(s => 
            s.metadata.to === currentState
        );
        
        if (!lastStateChange) return 0;
        
        return Math.floor(
            (new Date() - new Date(lastStateChange.timestamp)) / (1000 * 60 * 60 * 24)
        );
    },
    
    /**
     * BATCH OPERATIONS
     */
    batch: {
        async reconcileMultiple(ledgerIds, options = {}) {
            return await ledgerReconciliation.runBatchReconciliation(ledgerIds, options);
        },
        
        async healthCheckMultiple(ledgerIds) {
            const results = [];
            for (const ledgerId of ledgerIds) {
                try {
                    const health = await LedgerAPI.checkLedgerHealth(ledgerId);
                    results.push({ ledgerId, ...health });
                } catch (error) {
                    results.push({ ledgerId, error: error.message });
                }
            }
            return results;
        },
        
        async exportMultiple(ledgerIds, format = 'json') {
            const exports = [];
            for (const ledgerId of ledgerIds) {
                try {
                    const exportData = await LedgerAPI.exportLedgerData(ledgerId, format);
                    exports.push({ ledgerId, ...exportData });
                } catch (error) {
                    exports.push({ ledgerId, error: error.message });
                }
            }
            return exports;
        }
    },
    
    /**
     * ADMIN OPERATIONS
     */
    admin: {
        async overrideLedger(ledgerId, changes, adminId, justification) {
            // Check admin permissions
            const permissionCheck = ledgerPermissions.validateUserForAction(
                { role: 'ADMIN', id: adminId },
                'MODIFY_ANY_LEDGER',
                { ledgerId }
            );
            
            if (!permissionCheck.allowed) {
                throw new Error(`Admin permission denied: ${permissionCheck.reason}`);
            }
            
            const ledger = ledgerEngine.state.ledgers.get(ledgerId);
            const originalState = { ...ledger };
            
            // Apply changes
            Object.assign(ledger, changes);
            ledger.updatedAt = new Date();
            
            // Create override entry
            const entry = ledgerEngine.createEntry({
                ledgerId,
                type: 'ADMIN_OVERRIDE',
                amount: 0,
                description: `Admin override: ${justification}`,
                metadata: {
                    adminId,
                    justification,
                    changes,
                    original: originalState
                },
                performedBy: adminId,
                role: 'ADMIN'
            });
            
            // Log audit
            ledgerAudit.logEvent('ADMIN_OVERRIDE', {
                adminId,
                action: 'LEDGER_MODIFICATION',
                targetId: ledgerId,
                justification,
                changes,
                original: originalState
            });
            
            return {
                entry,
                ledger,
                changes,
                original: originalState
            };
        },
        
        async forceStateChange(ledgerId, newState, adminId, reason) {
            const ledger = ledgerEngine.state.ledgers.get(ledgerId);
            const oldState = ledger.state;
            
            // Validate state transition
            const validation = ledgerStateMachine.validateTransition(
                oldState,
                newState,
                {
                    actor: adminId,
                    role: 'ADMIN',
                    ledgerId,
                    reason,
                    metadata: { adminForced: true }
                }
            );
            
            if (!validation.valid) {
                throw new Error(`Invalid state transition: ${validation.reason}`);
            }
            
            // Execute transition
            const transition = ledgerStateMachine.executeTransition(
                oldState,
                newState,
                {
                    actor: adminId,
                    role: 'ADMIN',
                    ledgerId,
                    reason,
                    metadata: { adminForced: true }
                }
            );
            
            // Update ledger
            ledger.state = newState;
            
            // Log audit
            ledgerAudit.logEvent('LEDGER_STATE_CHANGED', {
                ledgerId,
                fromState: oldState,
                toState: newState,
                reason: `Admin forced: ${reason}`,
                performedBy: adminId,
                adminAction: true
            });
            
            return transition;
        },
        
        async getPlatformHealth() {
            return ledgerReconciliation.checkPlatformHealth();
        },
        
        async runComplianceReport(regulation = 'ALL') {
            return ledgerAudit.generateComplianceReport(regulation);
        }
    }
};

// Export the API
export default LedgerAPI;

// Also export individual modules for advanced use
export {
    ledgerEngine,
    ledgerRules,
    ledgerStateMachine,
    ledgerPermissions,
    ledgerAudit,
    ledgerReconciliation
};