/**
 * M-PESEWA LEDGER ENGINE - APPEND-ONLY FINANCIAL CORE
 * 
 * This is the heart of M-Pesewa. Never deletes, never overwrites.
 * Only appends truth. Bank-grade ledger thinking.
 */

class LedgerEngine {
    constructor() {
        this.version = '1.0.0';
        this.state = {
            ledgers: new Map(),      // ledgerId -> Ledger
            entries: new Map(),      // ledgerId -> Array<Entry>
            hashChain: new Map()     // entryId -> {hash, prevHash}
        };
    }

    /**
     * LEDGER ENTITY - IMMUTABLE STRUCTURE
     */
    static LedgerSchema = {
        id: String,
        borrowerId: String,          // WHO owes
        lenderId: String,            // WHO is owed
        groupId: String,             // Group context
        countryCode: String,         // Country isolation
        currency: String,           // Local currency (KSh, UGX, etc)
        
        // Core loan terms
        principalAmount: Number,     // Original amount
        interestRate: Number,        // 10% for M-Pesewa
        penaltyRate: Number,         // 5% daily after 7 days
        
        // Dates
        disbursementDate: Date,
        dueDate: Date,              // 7 days from disbursement
        createdAt: Date,
        updatedAt: Date,
        
        // Status from state machine
        status: String,             // CREATED, ACTIVE, OVERDUE, DEFAULTED, CLEARED, ARCHIVED
        
        // References
        loanCategory: String,       // Emergency category
        referrers: Array,           // [ {name, contact}, {name, contact} ]
        
        // Security
        signature: String,          // Digital signature (simulated)
        lastHash: String           // For hash chain
    };

    /**
     * LEDGER ENTRY - APPEND-ONLY TRUTH
     */
    static EntrySchema = {
        id: String,
        ledgerId: String,
        type: String,               // CREATED, INTEREST_APPLIED, PENALTY_APPLIED, 
                                   // PARTIAL_REPAYMENT, FULL_REPAYMENT, STATUS_CHANGE
        amount: Number,            // Positive for obligations, negative for repayments
        currency: String,
        
        // Context
        description: String,
        metadata: Object,          // {daysOverdue, penaltyRate, etc}
        
        // Who performed this
        performedBy: String,       // userId (lender or admin)
        role: String,              // LENDER, ADMIN, SYSTEM
        
        // Timestamps
        timestamp: Date,
        
        // Hash chain
        previousHash: String,
        currentHash: String,
        
        // For audit
        ipAddress: String,
        deviceFingerprint: String
    };

    /**
     * CREATE NEW LEDGER - Only lenders can create, within their group
     */
    createLedger(params) {
        const {
            borrowerId,
            lenderId,
            groupId,
            countryCode,
            currency,
            principalAmount,
            loanCategory,
            referrers = [],
            performedBy,
            lenderSubscriptionTier
        } = params;

        // Validate hierarchy: lender and borrower must be in same group and country
        const validation = this.validateHierarchyConstraints({
            borrowerId,
            lenderId,
            groupId,
            countryCode,
            lenderSubscriptionTier,
            principalAmount
        });

        if (!validation.valid) {
            throw new Error(`Hierarchy validation failed: ${validation.reason}`);
        }

        // Generate ledger ID
        const ledgerId = this.generateLedgerId({
            countryCode,
            groupId,
            lenderId,
            timestamp: Date.now()
        });

        // Calculate dates
        const disbursementDate = new Date();
        const dueDate = new Date(disbursementDate);
        dueDate.setDate(dueDate.getDate() + 7); // 7 days repayment period

        // Create ledger
        const ledger = {
            id: ledgerId,
            borrowerId,
            lenderId,
            groupId,
            countryCode,
            currency,
            principalAmount,
            interestRate: 0.10, // 10%
            penaltyRate: 0.05,  // 5% daily
            disbursementDate,
            dueDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'CREATED',
            loanCategory,
            referrers,
            signature: this.generateSignature(ledgerId),
            lastHash: null
        };

        // Store ledger
        this.state.ledgers.set(ledgerId, ledger);
        this.state.entries.set(ledgerId, []);

        // Create initial entry
        const entry = this.createEntry({
            ledgerId,
            type: 'LEDGER_CREATED',
            amount: principalAmount,
            description: `Loan created for ${loanCategory}. Principal: ${currency} ${principalAmount}`,
            metadata: {
                interestRate: 0.10,
                penaltyRate: 0.05,
                repaymentPeriodDays: 7,
                referrers,
                lenderSubscriptionTier
            },
            performedBy,
            role: 'LENDER'
        });

        // Update ledger with first hash
        ledger.lastHash = entry.currentHash;
        ledger.status = 'ACTIVE';

        // Add status change entry
        this.createEntry({
            ledgerId,
            type: 'STATUS_CHANGE',
            amount: 0,
            description: 'Ledger activated and ready for transactions',
            metadata: { from: 'CREATED', to: 'ACTIVE' },
            performedBy: 'SYSTEM',
            role: 'SYSTEM'
        });

        return {
            ledger,
            entry,
            validation
        };
    }

    /**
     * VALIDATE HIERARCHY CONSTRAINTS (NON-NEGOTIABLE)
     */
    validateHierarchyConstraints(params) {
        const {
            borrowerId,
            lenderId,
            groupId,
            countryCode,
            lenderSubscriptionTier,
            principalAmount
        } = params;

        // 1. Country isolation - simulated check
        const lenderCountry = this.getUserCountry(lenderId);
        const borrowerCountry = this.getUserCountry(borrowerId);
        
        if (lenderCountry !== borrowerCountry || lenderCountry !== countryCode) {
            return {
                valid: false,
                reason: 'Cross-country lending prohibited',
                code: 'HIERARCHY_001'
            };
        }

        // 2. Group isolation - simulated check
        const lenderGroup = this.getUserGroup(lenderId);
        const borrowerGroup = this.getUserGroup(borrowerId);
        
        if (lenderGroup !== borrowerGroup || lenderGroup !== groupId) {
            return {
                valid: false,
                reason: 'Cross-group lending prohibited',
                code: 'HIERARCHY_002'
            };
        }

        // 3. Subscription validation
        const subscriptionValid = this.validateSubscription({
            lenderId,
            tier: lenderSubscriptionTier,
            amount: principalAmount
        });
        
        if (!subscriptionValid.valid) {
            return subscriptionValid;
        }

        // 4. Borrower in good standing (not blacklisted, max 4 groups)
        const borrowerStatus = this.getBorrowerStatus(borrowerId);
        if (borrowerStatus.blacklisted) {
            return {
                valid: false,
                reason: 'Borrower is blacklisted',
                code: 'HIERARCHY_003'
            };
        }

        // 5. Borrower group count check (max 4 groups)
        const borrowerGroups = this.getBorrowerGroups(borrowerId);
        if (borrowerGroups.length >= 4) {
            return {
                valid: false,
                reason: 'Borrower already in maximum 4 groups',
                code: 'HIERARCHY_004'
            };
        }

        return {
            valid: true,
            reason: 'All hierarchy constraints satisfied',
            code: 'HIERARCHY_OK'
        };
    }

    /**
     * APPEND ENTRY TO LEDGER (NEVER DELETE, NEVER OVERWRITE)
     */
    createEntry(params) {
        const {
            ledgerId,
            type,
            amount,
            description,
            metadata = {},
            performedBy,
            role
        } = params;

        // Get ledger
        const ledger = this.state.ledgers.get(ledgerId);
        if (!ledger) {
            throw new Error(`Ledger ${ledgerId} not found`);
        }

        // Get previous hash
        const entries = this.state.entries.get(ledgerId);
        const previousHash = entries.length > 0 
            ? entries[entries.length - 1].currentHash 
            : ledger.lastHash;

        // Generate entry ID
        const entryId = this.generateEntryId({
            ledgerId,
            type,
            timestamp: Date.now(),
            sequence: entries.length
        });

        // Create hash
        const currentHash = this.generateHash({
            entryId,
            ledgerId,
            type,
            amount,
            timestamp: Date.now(),
            previousHash,
            performedBy
        });

        // Create entry
        const entry = {
            id: entryId,
            ledgerId,
            type,
            amount,
            currency: ledger.currency,
            description,
            metadata,
            performedBy,
            role,
            timestamp: new Date(),
            previousHash,
            currentHash,
            ipAddress: this.getClientIP(),
            deviceFingerprint: this.getDeviceFingerprint()
        };

        // Store entry
        entries.push(entry);
        
        // Update ledger's last hash
        ledger.lastHash = currentHash;
        ledger.updatedAt = new Date();

        // Store in hash chain
        this.state.hashChain.set(entryId, {
            hash: currentHash,
            prevHash: previousHash,
            timestamp: new Date()
        });

        // Update ledger status based on entry type
        this.updateLedgerStatus(ledgerId, entry);

        return entry;
    }

    /**
     * UPDATE LEDGER STATUS BASED ON RULES
     */
    updateLedgerStatus(ledgerId, entry) {
        const ledger = this.state.ledgers.get(ledgerId);
        if (!ledger) return;

        const entries = this.state.entries.get(ledgerId);
        
        switch (entry.type) {
            case 'FULL_REPAYMENT':
                ledger.status = 'CLEARED';
                break;
                
            case 'PARTIAL_REPAYMENT':
                // Calculate if still overdue
                const balance = this.calculateBalance(ledgerId);
                const now = new Date();
                
                if (now > ledger.dueDate && balance > 0) {
                    ledger.status = 'OVERDUE';
                } else if (balance === 0) {
                    ledger.status = 'CLEARED';
                }
                break;
                
            case 'PENALTY_APPLIED':
                // Check if in default (2 months)
                const daysSinceDisbursement = Math.floor(
                    (new Date() - ledger.disbursementDate) / (1000 * 60 * 60 * 24)
                );
                
                if (daysSinceDisbursement > 60) { // 2 months
                    ledger.status = 'DEFAULTED';
                } else {
                    ledger.status = 'OVERDUE';
                }
                break;
        }

        // Log status change if it changed
        if (entry.type !== 'STATUS_CHANGE' && ledger.status !== entry.metadata?.from) {
            this.createEntry({
                ledgerId,
                type: 'STATUS_CHANGE',
                amount: 0,
                description: `Status changed from ${entry.metadata?.from || ledger.status} to ${ledger.status}`,
                metadata: {
                    from: entry.metadata?.from || ledger.status,
                    to: ledger.status,
                    triggeredBy: entry.type
                },
                performedBy: 'SYSTEM',
                role: 'SYSTEM'
            });
        }
    }

    /**
     * CALCULATE BALANCE (NEVER STORE, ALWAYS CALCULATE)
     */
    calculateBalance(ledgerId) {
        const entries = this.state.entries.get(ledgerId);
        if (!entries) return 0;

        return entries.reduce((total, entry) => {
            switch (entry.type) {
                case 'LEDGER_CREATED':
                case 'INTEREST_APPLIED':
                case 'PENALTY_APPLIED':
                    return total + entry.amount;
                case 'PARTIAL_REPAYMENT':
                case 'FULL_REPAYMENT':
                    return total - Math.abs(entry.amount);
                default:
                    return total;
            }
        }, 0);
    }

    /**
     * CALCULATE INTEREST AND PENALTIES
     */
    calculateInterestAndPenalties(ledgerId) {
        const ledger = this.state.ledgers.get(ledgerId);
        const entries = this.state.entries.get(ledgerId);
        
        if (!ledger || !entries) {
            return { interest: 0, penalties: 0, totalOwed: 0 };
        }

        const now = new Date();
        const daysSinceDisbursement = Math.floor(
            (now - ledger.disbursementDate) / (1000 * 60 * 60 * 24)
        );
        
        // Base interest (10% of principal)
        const interest = ledger.principalAmount * ledger.interestRate;
        
        // Penalties after 7 days (5% daily on outstanding balance)
        let penalties = 0;
        if (daysSinceDisbursement > 7) {
            const overdueDays = daysSinceDisbursement - 7;
            const outstandingBalance = this.calculateBalance(ledgerId);
            penalties = outstandingBalance * ledger.penaltyRate * overdueDays;
        }

        const totalOwed = ledger.principalAmount + interest + penalties;

        return {
            principal: ledger.principalAmount,
            interest,
            penalties,
            totalOwed,
            daysSinceDisbursement,
            overdueDays: Math.max(0, daysSinceDisbursement - 7)
        };
    }

    /**
     * GET LEDGER HISTORY (APPEND-ONLY LOG)
     */
    getLedgerHistory(ledgerId, options = {}) {
        const entries = this.state.entries.get(ledgerId) || [];
        const ledger = this.state.ledgers.get(ledgerId);
        
        if (!ledger) {
            return { error: 'Ledger not found' };
        }

        // Filter by type if specified
        let filteredEntries = entries;
        if (options.entryType) {
            filteredEntries = entries.filter(e => e.type === options.entryType);
        }

        // Sort by timestamp
        filteredEntries.sort((a, b) => b.timestamp - a.timestamp);

        // Calculate running balance
        let runningBalance = 0;
        const entriesWithBalance = filteredEntries.map(entry => {
            switch (entry.type) {
                case 'LEDGER_CREATED':
                case 'INTEREST_APPLIED':
                case 'PENALTY_APPLIED':
                    runningBalance += entry.amount;
                    break;
                case 'PARTIAL_REPAYMENT':
                case 'FULL_REPAYMENT':
                    runningBalance -= Math.abs(entry.amount);
                    break;
            }
            
            return {
                ...entry,
                runningBalance
            };
        });

        return {
            ledger,
            entries: entriesWithBalance,
            currentBalance: this.calculateBalance(ledgerId),
            calculations: this.calculateInterestAndPenalties(ledgerId),
            hashChainValid: this.validateHashChain(ledgerId),
            entryCount: entries.length
        };
    }

    /**
     * VALIDATE HASH CHAIN INTEGRITY
     */
    validateHashChain(ledgerId) {
        const entries = this.state.entries.get(ledgerId) || [];
        
        if (entries.length === 0) {
            return { valid: true, reason: 'No entries to validate' };
        }

        const validationResults = [];
        let previousHash = entries[0].previousHash;
        
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const expectedHash = this.generateHash({
                entryId: entry.id,
                ledgerId: entry.ledgerId,
                type: entry.type,
                amount: entry.amount,
                timestamp: entry.timestamp.getTime(),
                previousHash,
                performedBy: entry.performedBy
            });

            const isValid = entry.currentHash === expectedHash;
            validationResults.push({
                entryId: entry.id,
                entryType: entry.type,
                isValid,
                storedHash: entry.currentHash,
                calculatedHash: expectedHash,
                previousHashMatch: entry.previousHash === previousHash
            });

            if (!isValid) {
                return {
                    valid: false,
                    reason: `Hash mismatch at entry ${entry.id}`,
                    invalidAtIndex: i,
                    validationResults
                };
            }

            previousHash = entry.currentHash;
        }

        return {
            valid: true,
            reason: 'All hashes valid',
            validationResults
        };
    }

    /**
     * RECONCILE LEDGER (DETECT AND FIX INCONSISTENCIES)
     */
    reconcileLedger(ledgerId) {
        const ledger = this.state.ledgers.get(ledgerId);
        const entries = this.state.entries.get(ledgerId);
        
        if (!ledger || !entries) {
            return { error: 'Ledger not found' };
        }

        const issues = [];
        const fixes = [];

        // 1. Validate hash chain
        const hashValidation = this.validateHashChain(ledgerId);
        if (!hashValidation.valid) {
            issues.push({
                type: 'HASH_CHAIN_BREAK',
                severity: 'CRITICAL',
                description: 'Hash chain integrity broken',
                details: hashValidation
            });
        }

        // 2. Validate balance consistency
        const calculatedBalance = this.calculateBalance(ledgerId);
        const expectedBalance = ledger.principalAmount + 
            this.calculateInterestAndPenalties(ledgerId).interest +
            this.calculateInterestAndPenalties(ledgerId).penalties;

        // Find all repayments
        const repayments = entries.filter(e => 
            e.type === 'PARTIAL_REPAYMENT' || e.type === 'FULL_REPAYMENT'
        );
        const totalRepayments = repayments.reduce((sum, e) => sum + Math.abs(e.amount), 0);

        const netBalance = expectedBalance - totalRepayments;
        
        if (Math.abs(calculatedBalance - netBalance) > 0.01) {
            issues.push({
                type: 'BALANCE_MISMATCH',
                severity: 'HIGH',
                description: 'Calculated balance does not match expected',
                details: {
                    calculatedBalance,
                    expectedBalance,
                    netBalance,
                    principal: ledger.principalAmount,
                    totalRepayments,
                    difference: calculatedBalance - netBalance
                }
            });

            // Auto-fix by creating reconciliation entry
            if (calculatedBalance < netBalance) {
                const missingAmount = netBalance - calculatedBalance;
                const fixEntry = this.createEntry({
                    ledgerId,
                    type: 'SYSTEM_RECONCILIATION',
                    amount: missingAmount,
                    description: `System reconciliation: Missing amount ${ledger.currency} ${missingAmount}`,
                    metadata: {
                        issue: 'BALANCE_MISMATCH',
                        calculatedBalance,
                        expectedBalance: netBalance
                    },
                    performedBy: 'SYSTEM',
                    role: 'SYSTEM'
                });
                fixes.push(fixEntry);
            }
        }

        // 3. Check for duplicate entries
        const entryIds = new Set();
        const duplicates = entries.filter(entry => {
            if (entryIds.has(entry.id)) {
                return true;
            }
            entryIds.add(entry.id);
            return false;
        });

        if (duplicates.length > 0) {
            issues.push({
                type: 'DUPLICATE_ENTRIES',
                severity: 'MEDIUM',
                description: 'Duplicate ledger entries found',
                details: { duplicates: duplicates.map(d => d.id) }
            });
        }

        // 4. Validate status against dates
        const now = new Date();
        const daysSinceDisbursement = Math.floor(
            (now - ledger.disbursementDate) / (1000 * 60 * 60 * 24)
        );

        let expectedStatus = ledger.status;
        
        if (daysSinceDisbursement > 60 && ledger.status !== 'DEFAULTED') {
            expectedStatus = 'DEFAULTED';
            issues.push({
                type: 'STATUS_STALE',
                severity: 'HIGH',
                description: 'Ledger should be in DEFAULTED status',
                details: {
                    currentStatus: ledger.status,
                    expectedStatus,
                    daysSinceDisbursement,
                    overdueBy: daysSinceDisbursement - 7
                }
            });
        } else if (daysSinceDisbursement > 7 && ledger.status === 'ACTIVE') {
            expectedStatus = 'OVERDUE';
            issues.push({
                type: 'STATUS_STALE',
                severity: 'MEDIUM',
                description: 'Ledger should be in OVERDUE status',
                details: {
                    currentStatus: ledger.status,
                    expectedStatus,
                    daysSinceDisbursement,
                    overdueBy: daysSinceDisbursement - 7
                }
            });
        }

        // Update status if needed
        if (expectedStatus !== ledger.status) {
            ledger.status = expectedStatus;
            const statusEntry = this.createEntry({
                ledgerId,
                type: 'STATUS_CHANGE',
                amount: 0,
                description: `System reconciliation: Status corrected to ${expectedStatus}`,
                metadata: {
                    from: ledger.status,
                    to: expectedStatus,
                    reason: 'RECONCILIATION'
                },
                performedBy: 'SYSTEM',
                role: 'SYSTEM'
            });
            fixes.push(statusEntry);
        }

        return {
            ledgerId,
            timestamp: new Date(),
            issues,
            fixesApplied: fixes,
            summary: {
                totalIssues: issues.length,
                criticalIssues: issues.filter(i => i.severity === 'CRITICAL').length,
                fixesApplied: fixes.length,
                finalBalance: this.calculateBalance(ledgerId),
                finalStatus: ledger.status
            },
            recommendations: issues.length > 0 ? 
                'Manual review recommended' : 
                'Ledger is healthy'
        };
    }

    /**
     * GENERATE LEDGER REPORT
     */
    generateReport(ledgerId, reportType = 'FULL') {
        const ledger = this.state.ledgers.get(ledgerId);
        const entries = this.state.entries.get(ledgerId);
        
        if (!ledger || !entries) {
            return { error: 'Ledger not found' };
        }

        const calculations = this.calculateInterestAndPenalties(ledgerId);
        const currentBalance = this.calculateBalance(ledgerId);
        const hashValidation = this.validateHashChain(ledgerId);

        const report = {
            metadata: {
                reportId: `REPORT_${ledgerId}_${Date.now()}`,
                generatedAt: new Date(),
                reportType,
                engineVersion: this.version
            },
            
            ledgerSummary: {
                id: ledger.id,
                borrowerId: ledger.borrowerId,
                lenderId: ledger.lenderId,
                groupId: ledger.groupId,
                countryCode: ledger.countryCode,
                currency: ledger.currency,
                status: ledger.status,
                
                dates: {
                    created: ledger.createdAt,
                    disbursed: ledger.disbursementDate,
                    due: ledger.dueDate,
                    updated: ledger.updatedAt,
                    ageInDays: calculations.daysSinceDisbursement
                },
                
                amounts: {
                    principal: ledger.principalAmount,
                    interest: calculations.interest,
                    penalties: calculations.penalties,
                    totalOwed: calculations.totalOwed,
                    currentBalance: currentBalance,
                    amountRepaid: ledger.principalAmount + calculations.interest + calculations.penalties - currentBalance
                }
            },
            
            security: {
                hashChainValid: hashValidation.valid,
                entryCount: entries.length,
                lastHash: ledger.lastHash,
                signature: ledger.signature
            },
            
            timeline: entries.map(entry => ({
                timestamp: entry.timestamp,
                type: entry.type,
                amount: entry.amount,
                description: entry.description,
                performedBy: entry.performedBy,
                hash: entry.currentHash.substring(0, 16) + '...'
            })),
            
            calculations: {
                dailyBreakdown: this.generateDailyBreakdown(ledgerId),
                repaymentSchedule: this.generateRepaymentSchedule(ledgerId),
                penaltyCalculation: this.calculatePenaltyBreakdown(ledgerId)
            },
            
            hierarchyValidation: {
                countryIsolation: this.validateCountryIsolation(ledger),
                groupIsolation: this.validateGroupIsolation(ledger),
                subscriptionCheck: this.checkLenderSubscription(ledger.lenderId)
            }
        };

        return report;
    }

    /**
     * HELPER METHODS
     */
    generateLedgerId(params) {
        const { countryCode, groupId, lenderId, timestamp } = params;
        return `LEDGER_${countryCode}_${groupId}_${lenderId}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateEntryId(params) {
        const { ledgerId, type, timestamp, sequence } = params;
        return `ENTRY_${ledgerId}_${type}_${timestamp}_${sequence}_${Math.random().toString(36).substr(2, 6)}`;
    }

    generateHash(data) {
        // In production, use SHA-256
        // For simulation, use simple hash
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(36);
    }

    generateSignature(ledgerId) {
        return `SIG_${ledgerId}_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
    }

    getClientIP() {
        // Simulated - in production get from request
        return `IP_${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    }

    getDeviceFingerprint() {
        // Simulated - in production use fingerprintjs or similar
        return `DEVICE_${Math.random().toString(36).substr(2, 16)}`;
    }

    getUserCountry(userId) {
        // Simulated - in production get from user profile
        return 'KE'; // Default Kenya
    }

    getUserGroup(userId) {
        // Simulated - in production get from user profile
        return 'GROUP_001';
    }

    validateSubscription(params) {
        // Simulated - in production check subscription status
        const { lenderId, tier, amount } = params;
        
        // Check if subscription expired (28th of month)
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const expiryDate = new Date(currentYear, currentMonth, 28);
        
        if (today > expiryDate) {
            return {
                valid: false,
                reason: 'Subscription expired on 28th',
                code: 'SUBSCRIPTION_001'
            };
        }

        // Check tier limits
        const tierLimits = {
            BASIC: 1500,
            PREMIUM: 5000,
            SUPER: 20000,
            LENDER_OF_LENDERS: 50000
        };

        if (tierLimits[tier] && amount > tierLimits[tier]) {
            return {
                valid: false,
                reason: `Amount exceeds ${tier} limit of ${tierLimits[tier]}`,
                code: 'SUBSCRIPTION_002'
            };
        }

        return { valid: true, reason: 'Subscription valid' };
    }

    getBorrowerStatus(borrowerId) {
        // Simulated - in production check blacklist and groups
        return {
            blacklisted: false,
            rating: 4.5,
            activeLoans: 1,
            totalGroups: 2
        };
    }

    getBorrowerGroups(borrowerId) {
        // Simulated
        return ['GROUP_001', 'GROUP_002'];
    }

    generateDailyBreakdown(ledgerId) {
        const ledger = this.state.ledgers.get(ledgerId);
        const entries = this.state.entries.get(ledgerId);
        
        if (!ledger || !entries) return [];
        
        const breakdown = [];
        const now = new Date();
        const disbursementDate = new Date(ledger.disbursementDate);
        
        for (let i = 0; i <= Math.min(90, Math.floor((now - disbursementDate) / (1000 * 60 * 60 * 24))); i++) {
            const date = new Date(disbursementDate);
            date.setDate(date.getDate() + i);
            
            const entriesOnDate = entries.filter(e => 
                e.timestamp.toDateString() === date.toDateString()
            );
            
            breakdown.push({
                date: date.toDateString(),
                day: i + 1,
                isOverdue: i >= 7,
                isDefault: i >= 60,
                entries: entriesOnDate.map(e => ({
                    type: e.type,
                    amount: e.amount,
                    description: e.description
                })),
                dailyBalance: this.calculateBalanceUpTo(ledgerId, date)
            });
        }
        
        return breakdown;
    }

    calculateBalanceUpTo(ledgerId, date) {
        const entries = this.state.entries.get(ledgerId) || [];
        const filteredEntries = entries.filter(e => e.timestamp <= date);
        
        return filteredEntries.reduce((total, entry) => {
            switch (entry.type) {
                case 'LEDGER_CREATED':
                case 'INTEREST_APPLIED':
                case 'PENALTY_APPLIED':
                    return total + entry.amount;
                case 'PARTIAL_REPAYMENT':
                case 'FULL_REPAYMENT':
                    return total - Math.abs(entry.amount);
                default:
                    return total;
            }
        }, 0);
    }

    generateRepaymentSchedule(ledgerId) {
        const ledger = this.state.ledgers.get(ledgerId);
        if (!ledger) return [];
        
        const schedule = [];
        const principal = ledger.principalAmount;
        const interest = principal * ledger.interestRate;
        const total = principal + interest;
        
        // Daily repayment amount if paying over 7 days
        const dailyAmount = total / 7;
        
        for (let i = 1; i <= 7; i++) {
            const date = new Date(ledger.disbursementDate);
            date.setDate(date.getDate() + i);
            
            schedule.push({
                day: i,
                dueDate: date.toDateString(),
                amountDue: dailyAmount,
                cumulativeDue: dailyAmount * i,
                status: date < new Date() ? 'PAST_DUE' : 'UPCOMING',
                penaltyApplies: i > 7
            });
        }
        
        return schedule;
    }

    calculatePenaltyBreakdown(ledgerId) {
        const calculations = this.calculateInterestAndPenalties(ledgerId);
        const ledger = this.state.ledgers.get(ledgerId);
        
        if (!ledger || calculations.overdueDays <= 0) {
            return { dailyPenalties: [], total: 0 };
        }
        
        const dailyPenalties = [];
        let cumulativePenalty = 0;
        const dailyRate = ledger.penaltyRate;
        
        for (let i = 1; i <= calculations.overdueDays; i++) {
            const penaltyForDay = calculations.totalOwed * dailyRate;
            cumulativePenalty += penaltyForDay;
            
            dailyPenalties.push({
                overdueDay: i + 7, // Day 8 onwards
                penaltyRate: `${(dailyRate * 100)}%`,
                penaltyAmount: penaltyForDay,
                cumulativePenalty: cumulativePenalty,
                date: new Date(
                    new Date(ledger.disbursementDate).setDate(
                        new Date(ledger.disbursementDate).getDate() + 7 + i
                    )
                ).toDateString()
            });
        }
        
        return {
            dailyPenalties,
            total: cumulativePenalty,
            overdueDays: calculations.overdueDays,
            dailyRate: `${(dailyRate * 100)}%`
        };
    }

    validateCountryIsolation(ledger) {
        // Simulated validation
        return {
            valid: true,
            country: ledger.countryCode,
            lenderCountry: this.getUserCountry(ledger.lenderId),
            borrowerCountry: this.getUserCountry(ledger.borrowerId),
            message: 'All parties in same country'
        };
    }

    validateGroupIsolation(ledger) {
        // Simulated validation
        return {
            valid: true,
            group: ledger.groupId,
            lenderGroup: this.getUserGroup(ledger.lenderId),
            borrowerGroup: this.getUserGroup(ledger.borrowerId),
            message: 'All parties in same group'
        };
    }

    checkLenderSubscription(lenderId) {
        // Simulated
        return {
            valid: true,
            tier: 'PREMIUM',
            expiryDate: new Date(new Date().getFullYear(), new Date().getMonth(), 28),
            daysRemaining: 15,
            maxAmount: 5000
        };
    }
}

// Export singleton instance
const ledgerEngine = new LedgerEngine();
export default ledgerEngine;