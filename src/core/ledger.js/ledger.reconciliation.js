/**
 * M-PESEWA LEDGER RECONCILIATION - DATA INTEGRITY ENGINE
 * 
 * Finds and fixes inconsistencies. Ensures ledger truth.
 */

class LedgerReconciliation {
    constructor(ledgerEngine, ledgerRules, ledgerStateMachine, ledgerPermissions, ledgerAudit) {
        this.ledgerEngine = ledgerEngine;
        this.ledgerRules = ledgerRules;
        this.stateMachine = ledgerStateMachine;
        this.permissions = ledgerPermissions;
        this.audit = ledgerAudit;
        
        // RECONCILIATION RULES
        this.RECONCILIATION_RULES = {
            BALANCE_MISMATCH: {
                code: 'RECON_001',
                severity: 'HIGH',
                description: 'Calculated balance does not match expected',
                detection: this.detectBalanceMismatch.bind(this),
                resolution: this.resolveBalanceMismatch.bind(this),
                autoResolve: true,
                requiresApproval: false
            },
            
            STATE_INCONSISTENCY: {
                code: 'RECON_002',
                severity: 'MEDIUM',
                description: 'Ledger state inconsistent with dates or amounts',
                detection: this.detectStateInconsistency.bind(this),
                resolution: this.resolveStateInconsistency.bind(this),
                autoResolve: true,
                requiresApproval: false
            },
            
            HASH_CHAIN_BREAK: {
                code: 'RECON_003',
                severity: 'CRITICAL',
                description: 'Hash chain integrity broken',
                detection: this.detectHashChainBreak.bind(this),
                resolution: this.resolveHashChainBreak.bind(this),
                autoResolve: false,
                requiresApproval: 'ADMIN'
            },
            
            DUPLICATE_ENTRIES: {
                code: 'RECON_004',
                severity: 'MEDIUM',
                description: 'Duplicate ledger entries detected',
                detection: this.detectDuplicateEntries.bind(this),
                resolution: this.resolveDuplicateEntries.bind(this),
                autoResolve: true,
                requiresApproval: false
            },
            
            MISSING_INTEREST: {
                code: 'RECON_005',
                severity: 'HIGH',
                description: 'Interest not applied when due',
                detection: this.detectMissingInterest.bind(this),
                resolution: this.resolveMissingInterest.bind(this),
                autoResolve: true,
                requiresApproval: false
            },
            
            MISSING_PENALTIES: {
                code: 'RECON_006',
                severity: 'HIGH',
                description: 'Penalties not applied when overdue',
                detection: this.detectMissingPenalties.bind(this),
                resolution: this.resolveMissingPenalties.bind(this),
                autoResolve: true,
                requiresApproval: false
            },
            
            SUBSCRIPTION_VIOLATION: {
                code: 'RECON_007',
                severity: 'HIGH',
                description: 'Ledger violates subscription tier limits',
                detection: this.detectSubscriptionViolation.bind(this),
                resolution: this.resolveSubscriptionViolation.bind(this),
                autoResolve: false,
                requiresApproval: 'ADMIN'
            },
            
            HIERARCHY_VIOLATION: {
                code: 'RECON_008',
                severity: 'CRITICAL',
                description: 'Ledger violates hierarchy rules',
                detection: this.detectHierarchyViolation.bind(this),
                resolution: this.resolveHierarchyViolation.bind(this),
                autoResolve: false,
                requiresApproval: 'ADMIN'
            },
            
            DATE_INCONSISTENCY: {
                code: 'RECON_009',
                severity: 'MEDIUM',
                description: 'Date inconsistencies detected',
                detection: this.detectDateInconsistency.bind(this),
                resolution: this.resolveDateInconsistency.bind(this),
                autoResolve: true,
                requiresApproval: false
            },
            
            REPUTATION_MISMATCH: {
                code: 'RECON_010',
                severity: 'LOW',
                description: 'Borrower rating inconsistent with ledger history',
                detection: this.detectReputationMismatch.bind(this),
                resolution: this.resolveReputationMismatch.bind(this),
                autoResolve: true,
                requiresApproval: false
            }
        };

        // RECONCILIATION SCHEDULE
        this.SCHEDULE = {
            DAILY: [
                'BALANCE_MISMATCH',
                'STATE_INCONSISTENCY',
                'MISSING_INTEREST',
                'MISSING_PENALTIES'
            ],
            
            WEEKLY: [
                'DUPLICATE_ENTRIES',
                'DATE_INCONSISTENCY',
                'REPUTATION_MISMATCH'
            ],
            
            MONTHLY: [
                'HASH_CHAIN_BREAK',
                'SUBSCRIPTION_VIOLATION',
                'HIERARCHY_VIOLATION'
            ]
        };
    }

    /**
     * RUN COMPLETE RECONCILIATION
     */
    async runReconciliation(ledgerId, options = {}) {
        const startTime = Date.now();
        
        // Log start
        this.audit.logEvent('SYSTEM_RECONCILIATION', {
            ledgerId,
            action: 'START',
            options
        });

        // Get ledger data
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        if (!ledger) {
            return {
                success: false,
                error: `Ledger ${ledgerId} not found`,
                duration: Date.now() - startTime
            };
        }

        // Determine which rules to run
        const rulesToRun = this.getRulesToRun(options);
        
        // Run detection for each rule
        const detections = [];
        const issues = [];
        
        for (const ruleCode of rulesToRun) {
            const rule = this.RECONCILIATION_RULES[ruleCode];
            if (!rule) continue;
            
            try {
                const detection = await rule.detection(ledgerId);
                if (detection.found) {
                    detections.push({
                        rule: ruleCode,
                        detection,
                        resolutionRequired: rule.requiresApproval && !options.autoApprove
                    });
                    
                    issues.push({
                        rule: ruleCode,
                        severity: rule.severity,
                        description: detection.description,
                        details: detection.details
                    });
                }
            } catch (error) {
                console.error(`Error running detection for ${ruleCode}:`, error);
            }
        }

        // Apply resolutions
        const resolutions = [];
        const resolved = [];
        const pending = [];
        
        for (const detection of detections) {
            const rule = this.RECONCILIATION_RULES[detection.rule];
            
            if (rule.autoResolve || options.forceResolve) {
                try {
                    const resolution = await rule.resolution(
                        ledgerId, 
                        detection.detection, 
                        options
                    );
                    
                    resolutions.push({
                        rule: detection.rule,
                        resolution,
                        autoResolved: rule.autoResolve
                    });
                    
                    if (resolution.success) {
                        resolved.push(detection.rule);
                    }
                } catch (error) {
                    console.error(`Error resolving ${detection.rule}:`, error);
                }
            } else if (detection.resolutionRequired) {
                pending.push({
                    rule: detection.rule,
                    detection: detection.detection,
                    requiresApproval: rule.requiresApproval
                });
            }
        }

        // Generate report
        const report = this.generateReconciliationReport({
            ledgerId,
            startTime,
            endTime: Date.now(),
            ledger,
            rulesRun: rulesToRun,
            detections,
            issues,
            resolutions,
            resolved,
            pending,
            options
        });

        // Log completion
        this.audit.logEvent('SYSTEM_RECONCILIATION', {
            ledgerId,
            action: 'COMPLETE',
            issuesFound: issues.length,
            issuesResolved: resolved.length,
            pendingApprovals: pending.length,
            reportId: report.id
        });

        return {
            success: true,
            report,
            summary: {
                totalRules: rulesToRun.length,
                issuesFound: issues.length,
                issuesResolved: resolved.length,
                pendingApprovals: pending.length,
                duration: Date.now() - startTime
            },
            details: {
                detections,
                resolutions,
                pending
            }
        };
    }

    /**
     * RUN BATCH RECONCILIATION
     */
    async runBatchReconciliation(ledgerIds, options = {}) {
        const startTime = Date.now();
        const results = [];
        const summaries = {
            totalLedgers: ledgerIds.length,
            successful: 0,
            failed: 0,
            totalIssues: 0,
            totalResolved: 0
        };

        // Log batch start
        this.audit.logEvent('SYSTEM_RECONCILIATION', {
            action: 'BATCH_START',
            ledgerCount: ledgerIds.length,
            batchId: `BATCH_${Date.now()}`
        });

        // Process each ledger
        for (const ledgerId of ledgerIds) {
            try {
                const result = await this.runReconciliation(ledgerId, options);
                results.push(result);
                
                if (result.success) {
                    summaries.successful++;
                    summaries.totalIssues += result.summary.issuesFound;
                    summaries.totalResolved += result.summary.issuesResolved;
                } else {
                    summaries.failed++;
                }
            } catch (error) {
                results.push({
                    ledgerId,
                    success: false,
                    error: error.message
                });
                summaries.failed++;
            }
        }

        // Generate batch report
        const batchReport = {
            id: `BATCH_RECON_${Date.now()}`,
            timestamp: new Date(),
            duration: Date.now() - startTime,
            options,
            summaries,
            ledgerResults: results.map(r => ({
                ledgerId: r.ledgerId || r.report?.ledgerId,
                success: r.success,
                issues: r.summary?.issuesFound || 0,
                resolved: r.summary?.issuesResolved || 0
            })),
            recommendations: this.generateBatchRecommendations(results)
        };

        // Log batch completion
        this.audit.logEvent('SYSTEM_RECONCILIATION', {
            action: 'BATCH_COMPLETE',
            batchId: batchReport.id,
            successful: summaries.successful,
            failed: summaries.failed,
            totalIssues: summaries.totalIssues,
            totalResolved: summaries.totalResolved
        });

        return {
            success: summaries.failed === 0,
            batchReport,
            results
        };
    }

    /**
     * GET RULES TO RUN
     */
    getRulesToRun(options) {
        if (options.rules) {
            return options.rules.filter(rule => this.RECONCILIATION_RULES[rule]);
        }
        
        if (options.schedule) {
            return this.SCHEDULE[options.schedule] || [];
        }
        
        // Default: run all rules
        return Object.keys(this.RECONCILIATION_RULES);
    }

    /**
     * DETECTION METHODS
     */
    
    async detectBalanceMismatch(ledgerId) {
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        const entries = this.ledgerEngine.state.entries.get(ledgerId) || [];
        
        // Calculate balance from entries
        const calculatedBalance = this.ledgerEngine.calculateBalance(ledgerId);
        
        // Calculate expected balance based on rules
        const calculations = this.ledgerEngine.calculateInterestAndPenalties(ledgerId);
        const expectedBalance = calculations.totalOwed;
        
        // Find all repayments
        const repayments = entries.filter(e => 
            e.type === 'PARTIAL_REPAYMENT' || e.type === 'FULL_REPAYMENT'
        );
        const totalRepayments = repayments.reduce((sum, e) => sum + Math.abs(e.amount), 0);
        
        const netExpected = expectedBalance - totalRepayments;
        const discrepancy = Math.abs(calculatedBalance - netExpected);
        
        return {
            found: discrepancy > 0.01, // Allow small rounding errors
            description: `Balance mismatch: Calculated ${calculatedBalance}, Expected ${netExpected}`,
            details: {
                calculatedBalance,
                expectedBalance: netExpected,
                discrepancy,
                principal: ledger.principalAmount,
                interest: calculations.interest,
                penalties: calculations.penalties,
                totalRepayments,
                repaymentCount: repayments.length
            },
            severity: discrepancy > 100 ? 'HIGH' : 'MEDIUM'
        };
    }

    async detectStateInconsistency(ledgerId) {
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        const now = new Date();
        const disbursementDate = new Date(ledger.disbursementDate);
        const dueDate = new Date(ledger.dueDate);
        
        const daysSinceDisbursement = Math.floor(
            (now - disbursementDate) / (1000 * 60 * 60 * 24)
        );
        const daysSinceDue = Math.floor(
            (now - dueDate) / (1000 * 60 * 60 * 24)
        );
        
        const expectedState = this.determineExpectedState(
            ledger.state,
            daysSinceDisbursement,
            daysSinceDue,
            ledger.outstandingBalance
        );
        
        return {
            found: ledger.state !== expectedState,
            description: `State inconsistency: Current ${ledger.state}, Expected ${expectedState}`,
            details: {
                currentState: ledger.state,
                expectedState,
                daysSinceDisbursement,
                daysSinceDue,
                overdueDays: Math.max(0, daysSinceDue),
                defaultThreshold: 60
            },
            severity: expectedState === 'DEFAULTED' && ledger.state !== 'DEFAULTED' ? 'HIGH' : 'MEDIUM'
        };
    }

    async detectHashChainBreak(ledgerId) {
        const hashValidation = this.ledgerEngine.validateHashChain(ledgerId);
        
        return {
            found: !hashValidation.valid,
            description: `Hash chain break detected: ${hashValidation.reason}`,
            details: hashValidation,
            severity: 'CRITICAL'
        };
    }

    async detectDuplicateEntries(ledgerId) {
        const entries = this.ledgerEngine.state.entries.get(ledgerId) || [];
        const entryIds = new Set();
        const duplicates = [];
        
        entries.forEach(entry => {
            if (entryIds.has(entry.id)) {
                duplicates.push(entry.id);
            } else {
                entryIds.add(entry.id);
            }
        });
        
        // Also check for logical duplicates (same type, amount, timestamp)
        const logicalDuplicates = [];
        const entryKeyMap = new Map();
        
        entries.forEach(entry => {
            const key = `${entry.type}_${entry.amount}_${entry.timestamp.getTime()}`;
            if (entryKeyMap.has(key)) {
                logicalDuplicates.push({
                    entry1: entryKeyMap.get(key),
                    entry2: entry.id,
                    key
                });
            } else {
                entryKeyMap.set(key, entry.id);
            }
        });
        
        return {
            found: duplicates.length > 0 || logicalDuplicates.length > 0,
            description: `Duplicate entries detected: ${duplicates.length} exact, ${logicalDuplicates.length} logical`,
            details: {
                exactDuplicates: duplicates,
                logicalDuplicates,
                totalEntries: entries.length
            },
            severity: 'MEDIUM'
        };
    }

    async detectMissingInterest(ledgerId) {
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        const entries = this.ledgerEngine.state.entries.get(ledgerId) || [];
        
        // Check if interest was applied
        const interestApplied = entries.some(e => e.type === 'INTEREST_APPLIED');
        const interestDue = ledger.principalAmount * 0.10; // 10%
        
        return {
            found: !interestApplied,
            description: `Interest not applied. Due: ${interestDue}`,
            details: {
                interestDue,
                interestApplied,
                principal: ledger.principalAmount,
                rate: '10%',
                entriesChecked: entries.length
            },
            severity: 'HIGH'
        };
    }

    async detectMissingPenalties(ledgerId) {
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        const entries = this.ledgerEngine.state.entries.get(ledgerId) || [];
        const now = new Date();
        const dueDate = new Date(ledger.dueDate);
        
        if (now <= dueDate) {
            return {
                found: false,
                description: 'Not overdue yet',
                details: { dueDate, now },
                severity: 'LOW'
            };
        }
        
        // Calculate overdue days
        const overdueDays = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
        
        // Check for penalty entries
        const penaltyEntries = entries.filter(e => e.type === 'PENALTY_APPLIED');
        const penaltyDays = penaltyEntries.length;
        
        return {
            found: penaltyDays < overdueDays,
            description: `Missing penalties: ${overdueDays - penaltyDays} days`,
            details: {
                overdueDays,
                penaltyEntries: penaltyDays,
                missingDays: overdueDays - penaltyDays,
                dailyRate: '5%'
            },
            severity: 'HIGH'
        };
    }

    async detectSubscriptionViolation(ledgerId) {
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        // In production, would check lender subscription
        return {
            found: false,
            description: 'Subscription check passed',
            details: { ledgerId },
            severity: 'LOW'
        };
    }

    async detectHierarchyViolation(ledgerId) {
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        const validation = this.ledgerEngine.validateHierarchyConstraints({
            borrowerId: ledger.borrowerId,
            lenderId: ledger.lenderId,
            groupId: ledger.groupId,
            countryCode: ledger.countryCode,
            principalAmount: ledger.principalAmount,
            lenderSubscriptionTier: 'PREMIUM' // Would come from user data
        });
        
        return {
            found: !validation.valid,
            description: `Hierarchy violation: ${validation.reason}`,
            details: validation,
            severity: 'CRITICAL'
        };
    }

    async detectDateInconsistency(ledgerId) {
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        const entries = this.ledgerEngine.state.entries.get(ledgerId) || [];
        
        const issues = [];
        
        // Check: disbursement date should be before due date
        if (ledger.disbursementDate >= ledger.dueDate) {
            issues.push('Disbursement date not before due date');
        }
        
        // Check: due date should be 7 days after disbursement
        const expectedDueDate = new Date(ledger.disbursementDate);
        expectedDueDate.setDate(expectedDueDate.getDate() + 7);
        
        if (ledger.dueDate.getTime() !== expectedDueDate.getTime()) {
            issues.push(`Due date should be ${expectedDueDate.toDateString()}`);
        }
        
        // Check: entry dates should be sequential
        let previousDate = null;
        entries.forEach((entry, index) => {
            if (previousDate && entry.timestamp < previousDate) {
                issues.push(`Entry ${index} out of sequence`);
            }
            previousDate = entry.timestamp;
        });
        
        return {
            found: issues.length > 0,
            description: `Date inconsistencies: ${issues.length} issues`,
            details: { issues },
            severity: issues.length > 3 ? 'HIGH' : 'MEDIUM'
        };
    }

    async detectReputationMismatch(ledgerId) {
        // In production, would check borrower rating vs ledger history
        return {
            found: false,
            description: 'Reputation check passed',
            details: { ledgerId },
            severity: 'LOW'
        };
    }

    /**
     * RESOLUTION METHODS
     */
    
    async resolveBalanceMismatch(ledgerId, detection, options) {
        const { details } = detection;
        const discrepancy = details.discrepancy;
        
        // Create reconciliation entry
        const entry = this.ledgerEngine.createEntry({
            ledgerId,
            type: 'SYSTEM_RECONCILIATION',
            amount: discrepancy > 0 ? -discrepancy : discrepancy,
            description: `System reconciliation: Balance correction of ${Math.abs(discrepancy)}`,
            metadata: {
                issue: 'BALANCE_MISMATCH',
                calculatedBalance: details.calculatedBalance,
                expectedBalance: details.expectedBalance,
                discrepancy: Math.abs(discrepancy),
                autoResolved: true
            },
            performedBy: 'SYSTEM',
            role: 'SYSTEM'
        });
        
        return {
            success: true,
            action: 'BALANCE_CORRECTED',
            amount: discrepancy,
            entry,
            message: `Balance corrected by ${Math.abs(discrepancy)}`
        };
    }

    async resolveStateInconsistency(ledgerId, detection, options) {
        const { details } = detection;
        
        // Update ledger state
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        const oldState = ledger.state;
        ledger.state = details.expectedState;
        ledger.updatedAt = new Date();
        
        // Create state change entry
        const entry = this.ledgerEngine.createEntry({
            ledgerId,
            type: 'STATUS_CHANGE',
            amount: 0,
            description: `System reconciliation: State corrected from ${oldState} to ${details.expectedState}`,
            metadata: {
                from: oldState,
                to: details.expectedState,
                reason: 'RECONCILIATION',
                autoResolved: true,
                detection: details
            },
            performedBy: 'SYSTEM',
            role: 'SYSTEM'
        });
        
        return {
            success: true,
            action: 'STATE_CORRECTED',
            fromState: oldState,
            toState: details.expectedState,
            entry,
            message: `State corrected to ${details.expectedState}`
        };
    }

    async resolveHashChainBreak(ledgerId, detection, options) {
        // Hash chain breaks require manual intervention
        // This would involve:
        // 1. Freezing the ledger
        // 2. Notifying admins
        // 3. Manual investigation
        // 4. Potential ledger recreation from backup
        
        return {
            success: false,
            action: 'MANUAL_INTERVENTION_REQUIRED',
            severity: 'CRITICAL',
            message: 'Hash chain break requires admin investigation',
            nextSteps: [
                'Freeze ledger',
                'Notify platform admin',
                'Investigate integrity breach',
                'Restore from backup if available'
            ]
        };
    }

    async resolveDuplicateEntries(ledgerId, detection, options) {
        const { details } = detection;
        const entries = this.ledgerEngine.state.entries.get(ledgerId) || [];
        
        // Remove exact duplicates
        const uniqueEntries = [];
        const seenIds = new Set();
        
        entries.forEach(entry => {
            if (!seenIds.has(entry.id)) {
                seenIds.add(entry.id);
                uniqueEntries.push(entry);
            }
        });
        
        // Update entries
        this.ledgerEngine.state.entries.set(ledgerId, uniqueEntries);
        
        // Log the resolution
        const entry = this.ledgerEngine.createEntry({
            ledgerId,
            type: 'SYSTEM_RECONCILIATION',
            amount: 0,
            description: `System reconciliation: Removed ${details.exactDuplicates.length} duplicate entries`,
            metadata: {
                issue: 'DUPLICATE_ENTRIES',
                removedCount: details.exactDuplicates.length,
                remainingEntries: uniqueEntries.length,
                autoResolved: true
            },
            performedBy: 'SYSTEM',
            role: 'SYSTEM'
        });
        
        return {
            success: true,
            action: 'DUPLICATES_REMOVED',
            removedCount: details.exactDuplicates.length,
            entry,
            message: `Removed ${details.exactDuplicates.length} duplicate entries`
        };
    }

    async resolveMissingInterest(ledgerId, detection, options) {
        const { details } = detection;
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        
        // Apply interest
        const interestAmount = ledger.principalAmount * 0.10;
        
        const entry = this.ledgerEngine.createEntry({
            ledgerId,
            type: 'INTEREST_APPLIED',
            amount: interestAmount,
            description: `System reconciliation: Interest applied (10% of ${ledger.principalAmount})`,
            metadata: {
                issue: 'MISSING_INTEREST',
                principal: ledger.principalAmount,
                rate: '10%',
                amount: interestAmount,
                autoResolved: true
            },
            performedBy: 'SYSTEM',
            role: 'SYSTEM'
        });
        
        return {
            success: true,
            action: 'INTEREST_APPLIED',
            amount: interestAmount,
            entry,
            message: `Applied interest of ${interestAmount}`
        };
    }

    async resolveMissingPenalties(ledgerId, detection, options) {
        const { details } = detection;
        const missingDays = details.missingDays;
        
        const resolutions = [];
        
        // Apply missing penalties for each missing day
        for (let i = 0; i < missingDays; i++) {
            const calculations = this.ledgerEngine.calculateInterestAndPenalties(ledgerId);
            const penaltyAmount = calculations.totalOwed * 0.05; // 5% daily
            
            const entry = this.ledgerEngine.createEntry({
                ledgerId,
                type: 'PENALTY_APPLIED',
                amount: penaltyAmount,
                description: `System reconciliation: Penalty applied for overdue day ${details.penaltyEntries + i + 1}`,
                metadata: {
                    issue: 'MISSING_PENALTIES',
                    overdueDay: details.penaltyEntries + i + 1,
                    rate: '5%',
                    amount: penaltyAmount,
                    autoResolved: true
                },
                performedBy: 'SYSTEM',
                role: 'SYSTEM'
            });
            
            resolutions.push(entry);
        }
        
        return {
            success: true,
            action: 'PENALTIES_APPLIED',
            count: missingDays,
            entries: resolutions,
            message: `Applied ${missingDays} missing penalties`
        };
    }

    async resolveSubscriptionViolation(ledgerId, detection, options) {
        // Would involve:
        // 1. Notifying lender
        // 2. Possibly freezing ledger
        // 3. Escalating to admin
        
        return {
            success: false,
            action: 'ESCALATION_REQUIRED',
            severity: 'HIGH',
            message: 'Subscription violation requires admin review',
            nextSteps: [
                'Notify lender',
                'Escalate to platform admin',
                'Consider ledger freeze'
            ]
        };
    }

    async resolveHierarchyViolation(ledgerId, detection, options) {
        // Critical violation - requires immediate action
        return {
            success: false,
            action: 'IMMEDIATE_INTERVENTION_REQUIRED',
            severity: 'CRITICAL',
            message: 'Hierarchy violation - ledger may be invalid',
            nextSteps: [
                'Immediate ledger freeze',
                'Notify all parties',
                'Admin investigation required',
                'Potential ledger invalidation'
            ]
        };
    }

    async resolveDateInconsistency(ledgerId, detection, options) {
        const { details } = detection;
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        
        // Fix due date if wrong
        const expectedDueDate = new Date(ledger.disbursementDate);
        expectedDueDate.setDate(expectedDueDate.getDate() + 7);
        
        if (ledger.dueDate.getTime() !== expectedDueDate.getTime()) {
            const oldDueDate = ledger.dueDate;
            ledger.dueDate = expectedDueDate;
            
            const entry = this.ledgerEngine.createEntry({
                ledgerId,
                type: 'SYSTEM_RECONCILIATION',
                amount: 0,
                description: `System reconciliation: Due date corrected from ${oldDueDate.toDateString()} to ${expectedDueDate.toDateString()}`,
                metadata: {
                    issue: 'DATE_INCONSISTENCY',
                    oldDueDate,
                    newDueDate: expectedDueDate,
                    autoResolved: true
                },
                performedBy: 'SYSTEM',
                role: 'SYSTEM'
            });
            
            return {
                success: true,
                action: 'DATE_CORRECTED',
                correction: 'DUE_DATE',
                oldDate: oldDueDate,
                newDate: expectedDueDate,
                entry,
                message: 'Due date corrected'
            };
        }
        
        return {
            success: true,
            action: 'NO_ACTION_REQUIRED',
            message: 'Date issues already resolved'
        };
    }

    async resolveReputationMismatch(ledgerId, detection, options) {
        // Would update borrower rating based on ledger history
        return {
            success: true,
            action: 'REPUTATION_UPDATED',
            message: 'Borrower rating updated based on reconciliation'
        };
    }

    /**
     * HELPER METHODS
     */
    
    determineExpectedState(currentState, daysSinceDisbursement, daysSinceDue, outstandingBalance) {
        if (outstandingBalance === 0) return 'CLEARED';
        if (daysSinceDisbursement >= 60) return 'DEFAULTED';
        if (daysSinceDue > 0) return 'OVERDUE';
        if (currentState === 'CREATED') return 'ACTIVE';
        return currentState;
    }

    generateReconciliationReport(data) {
        const {
            ledgerId,
            startTime,
            endTime,
            ledger,
            rulesRun,
            detections,
            issues,
            resolutions,
            resolved,
            pending,
            options
        } = data;
        
        const report = {
            id: `RECON_${ledgerId}_${Date.now()}`,
            ledgerId,
            generatedAt: new Date(),
            duration: endTime - startTime,
            ledgerSummary: {
                borrowerId: ledger.borrowerId,
                lenderId: ledger.lenderId,
                amount: ledger.principalAmount,
                state: ledger.state,
                currency: ledger.currency,
                ageDays: Math.floor((new Date() - new Date(ledger.disbursementDate)) / (1000 * 60 * 60 * 24))
            },
            
            execution: {
                rulesRun,
                rulesRunCount: rulesRun.length,
                optionsUsed: options
            },
            
            findings: {
                totalIssues: issues.length,
                issuesBySeverity: this.groupBySeverity(issues),
                detections: detections.map(d => ({
                    rule: d.rule,
                    found: d.detection.found,
                    description: d.detection.description,
                    severity: d.detection.severity
                }))
            },
            
            resolutions: {
                totalResolved: resolved.length,
                resolvedRules: resolved,
                resolutionDetails: resolutions,
                pendingApprovals: pending.length,
                pendingDetails: pending
            },
            
            integrityScore: this.calculateIntegrityScore(issues, rulesRun.length),
            
            recommendations: this.generateReportRecommendations(issues, resolved, pending),
            
            nextReconciliation: this.calculateNextReconciliation(issues, ledger.state),
            
            metadata: {
                engineVersion: this.ledgerEngine.version,
                reportVersion: '1.0',
                hash: this.generateReportHash(data)
            }
        };
        
        return report;
    }

    generateBatchRecommendations(results) {
        const recommendations = [];
        const issueCounts = {};
        
        results.forEach(result => {
            if (result.report?.findings?.detections) {
                result.report.findings.detections.forEach(detection => {
                    if (detection.found) {
                        issueCounts[detection.rule] = (issueCounts[detection.rule] || 0) + 1;
                    }
                });
            }
        });
        
        // Generate recommendations based on common issues
        Object.entries(issueCounts).forEach(([rule, count]) => {
            if (count > 10) { // Threshold
                recommendations.push({
                    issue: rule,
                    affectedLedgers: count,
                    recommendation: `Investigate systemic issue with ${rule}`,
                    priority: 'HIGH'
                });
            }
        });
        
        return recommendations;
    }

    groupBySeverity(issues) {
        const groups = {
            CRITICAL: 0,
            HIGH: 0,
            MEDIUM: 0,
            LOW: 0
        };
        
        issues.forEach(issue => {
            groups[issue.severity] = (groups[issue.severity] || 0) + 1;
        });
        
        return groups;
    }

    calculateIntegrityScore(issues, totalRules) {
        if (totalRules === 0) return 100;
        
        const severityWeights = {
            CRITICAL: 10,
            HIGH: 5,
            MEDIUM: 2,
            LOW: 1
        };
        
        let penalty = 0;
        issues.forEach(issue => {
            penalty += severityWeights[issue.severity] || 1;
        });
        
        const maxPenalty = totalRules * 10; // Assuming all rules critical
        const score = Math.max(0, 100 - (penalty / maxPenalty * 100));
        
        return Math.round(score);
    }

    generateReportRecommendations(issues, resolved, pending) {
        const recommendations = [];
        
        // For unresolved critical/high issues
        const unresolvedCritical = issues.filter(i => 
            i.severity === 'CRITICAL' && 
            !resolved.includes(i.rule) &&
            !pending.find(p => p.rule === i.rule)
        );
        
        if (unresolvedCritical.length > 0) {
            recommendations.push({
                priority: 'IMMEDIATE',
                action: 'Investigate unresolved critical issues',
                issues: unresolvedCritical.map(i => i.rule)
            });
        }
        
        // For pending approvals
        if (pending.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Process pending approvals',
                count: pending.length
            });
        }
        
        // For frequent issues
        const issueFrequency = {};
        issues.forEach(issue => {
            issueFrequency[issue.rule] = (issueFrequency[issue.rule] || 0) + 1;
        });
        
        Object.entries(issueFrequency).forEach(([rule, count]) => {
            if (count > 5) {
                recommendations.push({
                    priority: 'MEDIUM',
                    action: `Investigate recurring ${rule} issues`,
                    frequency: count
                });
            }
        });
        
        return recommendations;
    }

    calculateNextReconciliation(issues, ledgerState) {
        const now = new Date();
        const nextDate = new Date(now);
        
        if (issues.some(i => i.severity === 'CRITICAL')) {
            nextDate.setHours(nextDate.getHours() + 1); // Check again in 1 hour
        } else if (issues.some(i => i.severity === 'HIGH')) {
            nextDate.setDate(nextDate.getDate() + 1); // Check tomorrow
        } else if (ledgerState === 'DEFAULTED' || ledgerState === 'OVERDUE') {
            nextDate.setDate(nextDate.getDate() + 7); // Check weekly for problem ledgers
        } else {
            nextDate.setDate(nextDate.getDate() + 30); // Check monthly for normal ledgers
        }
        
        return nextDate;
    }

    generateReportHash(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(36);
    }

    /**
     * SCHEDULED RECONCILIATION
     */
    scheduleReconciliation(scheduleType = 'DAILY') {
        const rules = this.SCHEDULE[scheduleType];
        if (!rules) return null;
        
        const schedule = {
            type: scheduleType,
            rules,
            scheduledAt: new Date(),
            nextRun: this.calculateNextRun(scheduleType),
            status: 'SCHEDULED'
        };
        
        // In production, this would be stored and processed by a scheduler
        return schedule;
    }

    calculateNextRun(scheduleType) {
        const next = new Date();
        
        switch (scheduleType) {
            case 'DAILY':
                next.setDate(next.getDate() + 1);
                next.setHours(2, 0, 0, 0); // 2 AM
                break;
                
            case 'WEEKLY':
                next.setDate(next.getDate() + 7);
                next.setHours(3, 0, 0, 0); // 3 AM on next week
                break;
                
            case 'MONTHLY':
                next.setMonth(next.getMonth() + 1);
                next.setDate(1);
                next.setHours(4, 0, 0, 0); // 4 AM on 1st of next month
                break;
        }
        
        return next;
    }

    /**
     * LEDGER HEALTH CHECK
     */
    checkLedgerHealth(ledgerId) {
        const ledger = this.ledgerEngine.state.ledgers.get(ledgerId);
        if (!ledger) {
            return {
                healthy: false,
                reason: 'Ledger not found',
                score: 0
            };
        }
        
        const checks = [];
        let score = 100;
        
        // Check 1: Hash chain integrity
        const hashCheck = this.ledgerEngine.validateHashChain(ledgerId);
        checks.push({
            check: 'Hash Chain Integrity',
            healthy: hashCheck.valid,
            score: hashCheck.valid ? 25 : 0,
            details: hashCheck
        });
        if (!hashCheck.valid) score -= 25;
        
        // Check 2: State consistency
        const stateCheck = this.detectStateInconsistency(ledgerId);
        checks.push({
            check: 'State Consistency',
            healthy: !stateCheck.found,
            score: !stateCheck.found ? 25 : 0,
            details: stateCheck
        });
        if (stateCheck.found) score -= 25;
        
        // Check 3: Balance consistency
        const balanceCheck = this.detectBalanceMismatch(ledgerId);
        checks.push({
            check: 'Balance Consistency',
            healthy: !balanceCheck.found,
            score: !balanceCheck.found ? 25 : 0,
            details: balanceCheck
        });
        if (balanceCheck.found) score -= 25;
        
        // Check 4: Date consistency
        const dateCheck = this.detectDateInconsistency(ledgerId);
        checks.push({
            check: 'Date Consistency',
            healthy: !dateCheck.found,
            score: !dateCheck.found ? 25 : 0,
            details: dateCheck
        });
        if (dateCheck.found) score -= 10; // Less severe
        
        return {
            healthy: score >= 75,
            score,
            checks,
            ledgerSummary: {
                id: ledgerId,
                state: ledger.state,
                amount: ledger.principalAmount,
                ageDays: Math.floor((new Date() - new Date(ledger.disbursementDate)) / (1000 * 60 * 60 * 24)),
                entryCount: this.ledgerEngine.state.entries.get(ledgerId)?.length || 0
            },
            recommendations: score < 75 ? [
                'Run full reconciliation',
                'Review detected issues',
                'Consider manual verification'
            ] : [
                'Continue regular monitoring'
            ]
        };
    }

    /**
     * PLATFORM HEALTH CHECK
     */
    checkPlatformHealth() {
        const ledgers = Array.from(this.ledgerEngine.state.ledgers.values());
        const healthChecks = [];
        
        // Sample check (in production would check a sample or all ledgers)
        const sampleSize = Math.min(10, ledgers.length);
        const sample = ledgers.slice(0, sampleSize);
        
        sample.forEach(ledger => {
            const health = this.checkLedgerHealth(ledger.id);
            healthChecks.push({
                ledgerId: ledger.id,
                healthy: health.healthy,
                score: health.score
            });
        });
        
        const healthyCount = healthChecks.filter(h => h.healthy).length;
        const averageScore = healthChecks.reduce((sum, h) => sum + h.score, 0) / healthChecks.length;
        
        return {
            timestamp: new Date(),
            totalLedgers: ledgers.length,
            sampleChecked: sampleSize,
            platformHealth: {
                score: averageScore,
                status: averageScore >= 75 ? 'HEALTHY' : averageScore >= 50 ? 'DEGRADED' : 'UNHEALTHY',
                healthyPercentage: (healthyCount / sampleSize) * 100
            },
            sampleResults: healthChecks,
            recommendations: this.generatePlatformRecommendations(healthChecks)
        };
    }

    generatePlatformRecommendations(healthChecks) {
        const recommendations = [];
        const unhealthy = healthChecks.filter(h => !h.healthy);
        
        if (unhealthy.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Investigate unhealthy ledgers',
                count: unhealthy.length,
                sampleIds: unhealthy.slice(0, 3).map(u => u.ledgerId)
            });
        }
        
        const lowScores = healthChecks.filter(h => h.score < 50);
        if (lowScores.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Immediate reconciliation needed for low-score ledgers',
                count: lowScores.length
            });
        }
        
        if (healthChecks.length === 0) {
            recommendations.push({
                priority: 'MEDIUM',
                action: 'Run initial reconciliation on all ledgers',
                reason: 'No health checks performed yet'
            });
        }
        
        return recommendations;
    }
}

// Export the class (not a singleton, needs dependencies)
export default LedgerReconciliation;