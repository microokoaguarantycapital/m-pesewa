/**
 * M-Pesewa Ledger Flow Orchestrator
 * Ledger operations orchestration: reconciliation, disputes, freezes
 * Enforces ledger integrity and append-only principles
 */

class LedgerFlow {
    constructor() {
        this.currentState = 'IDLE';
        this.states = {
            IDLE: 'IDLE',
            CREATING: 'CREATING',
            ACTIVE: 'ACTIVE',
            UPDATING: 'UPDATING',
            RECONCILING: 'RECONCILING',
            DISPUTED: 'DISPUTED',
            FROZEN: 'FROZEN',
            CLOSING: 'CLOSING',
            CLOSED: 'CLOSED',
            ARCHIVED: 'ARCHIVED'
        };
        
        this.ledgerData = null;
        this.transactions = [];
        this.currentTransaction = null;
    }

    // MAIN LEDGER FLOW METHODS

    async createLedger(ledgerData) {
        try {
            this.currentState = this.states.CREATING;
            
            // Validate ledger data
            const validation = this.validateLedgerData(ledgerData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Create ledger
            this.ledgerData = this.createLedgerRecord(ledgerData);
            
            // Create initial transaction
            const initialTransaction = this.createInitialTransaction(ledgerData);
            this.transactions.push(initialTransaction);
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                ledger: this.ledgerData,
                initialTransaction: initialTransaction,
                message: 'Ledger created successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.IDLE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async addTransaction(transactionData) {
        try {
            if (this.currentState !== this.states.ACTIVE) {
                throw new Error('Ledger is not active');
            }
            
            // Validate transaction
            const validation = this.validateTransaction(transactionData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            this.currentState = this.states.UPDATING;
            
            // Create transaction
            const transaction = this.createTransactionRecord(transactionData);
            this.transactions.push(transaction);
            this.currentTransaction = transaction;
            
            // Update ledger balance
            await this.updateLedgerBalance(transaction);
            
            // Update ledger state if needed
            await this.updateLedgerState();
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                transaction: transaction,
                ledger: this.ledgerData,
                message: 'Transaction added successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async reconcileLedger(reconciliationData) {
        try {
            if (this.currentState !== this.states.ACTIVE) {
                throw new Error('Ledger is not active');
            }
            
            this.currentState = this.states.RECONCILING;
            
            // Get current balance
            const calculatedBalance = this.calculateBalance();
            const expectedBalance = reconciliationData.expectedBalance;
            
            // Check for discrepancies
            const discrepancies = this.findDiscrepancies(calculatedBalance, expectedBalance);
            
            if (discrepancies.length > 0) {
                // Create reconciliation transaction
                const reconciliationTransaction = this.createReconciliationTransaction(
                    discrepancies, 
                    reconciliationData
                );
                
                this.transactions.push(reconciliationTransaction);
                
                // Update ledger
                await this.updateLedgerAfterReconciliation(reconciliationTransaction);
                
                return {
                    success: true,
                    state: this.currentState,
                    discrepancies: discrepancies,
                    transaction: reconciliationTransaction,
                    correctedBalance: this.ledgerData.balance,
                    message: 'Ledger reconciled with adjustments'
                };
            }
            
            // No discrepancies
            await this.recordReconciliation(reconciliationData);
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                discrepancies: [],
                balance: calculatedBalance,
                message: 'Ledger balanced. No discrepancies found.'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async disputeTransaction(disputeData) {
        try {
            if (!['ACTIVE', 'DISPUTED'].includes(this.currentState)) {
                throw new Error('Ledger is not in a disputable state');
            }
            
            // Get transaction
            const transaction = this.getTransaction(disputeData.transactionId);
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            
            // Create dispute
            const dispute = this.createDispute(transaction, disputeData);
            
            // Mark transaction as disputed
            await this.markTransactionAsDisputed(transaction.id, dispute.id);
            
            this.currentState = this.states.DISPUTED;
            
            // Notify relevant parties
            await this.notifyDisputeParties(dispute);
            
            return {
                success: true,
                state: this.currentState,
                dispute: dispute,
                transaction: transaction,
                message: 'Transaction dispute created'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async resolveDispute(disputeResolutionData) {
        try {
            if (this.currentState !== this.states.DISPUTED) {
                throw new Error('Ledger is not in disputed state');
            }
            
            // Get dispute
            const dispute = await this.getDispute(disputeResolutionData.disputeId);
            if (!dispute) {
                throw new Error('Dispute not found');
            }
            
            // Get disputed transaction
            const transaction = this.getTransaction(dispute.transactionId);
            
            // Apply resolution
            const resolution = this.applyDisputeResolution(dispute, disputeResolutionData, transaction);
            
            // Update transaction
            await this.updateTransactionAfterDispute(transaction.id, resolution);
            
            // Close dispute
            await this.closeDispute(dispute.id, disputeResolutionData);
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                resolution: resolution,
                dispute: dispute,
                message: 'Dispute resolved successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async freezeLedger(freezeData) {
        try {
            if (!['ACTIVE', 'DISPUTED'].includes(this.currentState)) {
                throw new Error('Ledger cannot be frozen in current state');
            }
            
            // Validate freeze request
            const validation = this.validateFreezeRequest(freezeData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            this.currentState = this.states.FROZEN;
            
            // Create freeze record
            const freezeRecord = this.createFreezeRecord(freezeData);
            
            // Update ledger
            await this.updateLedgerFreezeStatus(true, freezeRecord);
            
            // Notify parties
            await this.notifyLedgerFreeze(freezeData);
            
            return {
                success: true,
                state: this.currentState,
                freeze: freezeRecord,
                ledger: this.ledgerData,
                restrictions: this.getFreezeRestrictions(),
                message: 'Ledger frozen successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async unfreezeLedger(unfreezeData) {
        try {
            if (this.currentState !== this.states.FROZEN) {
                throw new Error('Ledger is not frozen');
            }
            
            // Validate unfreeze request
            const validation = this.validateUnfreezeRequest(unfreezeData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Create unfreeze record
            const unfreezeRecord = this.createUnfreezeRecord(unfreezeData);
            
            // Update ledger
            await this.updateLedgerFreezeStatus(false, unfreezeRecord);
            
            this.currentState = this.states.ACTIVE;
            
            // Notify parties
            await this.notifyLedgerUnfreeze(unfreezeData);
            
            return {
                success: true,
                state: this.currentState,
                unfreeze: unfreezeRecord,
                ledger: this.ledgerData,
                message: 'Ledger unfrozen successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async closeLedger(closureData) {
        try {
            if (!['ACTIVE', 'FROZEN'].includes(this.currentState)) {
                throw new Error('Ledger cannot be closed in current state');
            }
            
            // Validate closure
            const validation = this.validateClosure(closureData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            this.currentState = this.states.CLOSING;
            
            // Create closure transaction
            const closureTransaction = this.createClosureTransaction(closureData);
            this.transactions.push(closureTransaction);
            
            // Update ledger status
            await this.updateLedgerStatus('CLOSED', closureData);
            
            this.currentState = this.states.CLOSED;
            
            // Notify parties
            await this.notifyLedgerClosure(closureData);
            
            return {
                success: true,
                state: this.currentState,
                closure: closureTransaction,
                finalBalance: this.ledgerData.balance,
                message: 'Ledger closed successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.ACTIVE;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async archiveLedger(archiveData) {
        try {
            if (this.currentState !== this.states.CLOSED) {
                throw new Error('Only closed ledgers can be archived');
            }
            
            // Create archive record
            const archiveRecord = this.createArchiveRecord(archiveData);
            
            // Update ledger status
            await this.updateLedgerStatus('ARCHIVED', archiveData);
            
            this.currentState = this.states.ARCHIVED;
            
            return {
                success: true,
                state: this.currentState,
                archive: archiveRecord,
                ledger: this.ledgerData,
                message: 'Ledger archived successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async getLedgerSummary() {
        try {
            const summary = {
                ledger: this.ledgerData,
                transactions: this.transactions.length,
                balance: this.ledgerData.balance,
                status: this.ledgerData.status,
                created: this.ledgerData.createdAt,
                lastUpdated: this.ledgerData.updatedAt,
                transactionSummary: this.getTransactionSummary()
            };
            
            return {
                success: true,
                summary: summary,
                state: this.currentState
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async auditLedger(auditCriteria) {
        try {
            // Get transactions matching criteria
            const auditTransactions = this.filterTransactions(auditCriteria);
            
            // Calculate audit totals
            const auditTotals = this.calculateAuditTotals(auditTransactions);
            
            // Check for anomalies
            const anomalies = this.detectAnomalies(auditTransactions);
            
            // Generate audit trail
            const auditTrail = this.generateAuditTrail(auditTransactions, auditCriteria);
            
            return {
                success: true,
                audit: {
                    criteria: auditCriteria,
                    transactions: auditTransactions.length,
                    totals: auditTotals,
                    anomalies: anomalies,
                    trail: auditTrail,
                    generatedAt: new Date().toISOString()
                },
                message: 'Audit completed successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // HELPER METHODS

    validateLedgerData(ledgerData) {
        const requiredFields = ['loanId', 'borrowerId', 'lenderId', 'groupId', 'country', 'amount'];
        
        for (const field of requiredFields) {
            if (!ledgerData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        if (ledgerData.amount <= 0) {
            return {
                valid: false,
                message: 'Amount must be greater than 0'
            };
        }
        
        return {
            valid: true,
            message: 'Ledger data validated'
        };
    }

    createLedgerRecord(ledgerData) {
        const ledgerId = 'LEDGER-' + Date.now();
        
        const ledger = {
            id: ledgerId,
            loanId: ledgerData.loanId,
            borrowerId: ledgerData.borrowerId,
            lenderId: ledgerData.lenderId,
            groupId: ledgerData.groupId,
            country: ledgerData.country,
            category: ledgerData.category,
            principal: ledgerData.amount,
            interestRate: ledgerData.interestRate || 0.10,
            balance: ledgerData.amount * (1 + (ledgerData.interestRate || 0.10)),
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
                guarantors: ledgerData.guarantors || [],
                terms: ledgerData.terms || '7 days, 10% interest',
                disbursementMethod: ledgerData.disbursementMethod
            }
        };
        
        // Store ledger
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        ledgers.push(ledger);
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        
        return ledger;
    }

    createInitialTransaction(ledgerData) {
        const transactionId = 'TX-INIT-' + Date.now();
        
        const transaction = {
            id: transactionId,
            ledgerId: this.ledgerData.id,
            type: 'LOAN_CREATED',
            amount: ledgerData.amount,
            balance: ledgerData.amount * (1 + (ledgerData.interestRate || 0.10)),
            description: 'Loan ledger created',
            metadata: {
                interest: ledgerData.amount * (ledgerData.interestRate || 0.10),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            timestamp: new Date().toISOString(),
            createdBy: 'SYSTEM'
        };
        
        // Store transaction
        this.storeTransaction(transaction);
        
        return transaction;
    }

    validateTransaction(transactionData) {
        const requiredFields = ['type', 'amount', 'description'];
        
        for (const field of requiredFields) {
            if (!transactionData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        // Validate transaction types
        const validTypes = [
            'REPAYMENT', 
            'INTEREST_APPLIED', 
            'PENALTY_APPLIED',
            'ADJUSTMENT',
            'DISPUTE_RESOLUTION',
            'WRITE_OFF'
        ];
        
        if (!validTypes.includes(transactionData.type)) {
            return {
                valid: false,
                message: 'Invalid transaction type'
            };
        }
        
        return {
            valid: true,
            message: 'Transaction validated'
        };
    }

    createTransactionRecord(transactionData) {
        const transactionId = 'TX-' + Date.now();
        
        const transaction = {
            id: transactionId,
            ledgerId: this.ledgerData.id,
            ...transactionData,
            timestamp: new Date().toISOString(),
            previousBalance: this.ledgerData.balance,
            newBalance: this.calculateNewBalance(transactionData.amount, transactionData.type)
        };
        
        // Store transaction
        this.storeTransaction(transaction);
        
        return transaction;
    }

    calculateNewBalance(amount, type) {
        let newBalance = this.ledgerData.balance;
        
        switch (type) {
            case 'REPAYMENT':
                newBalance -= amount;
                break;
            case 'INTEREST_APPLIED':
            case 'PENALTY_APPLIED':
            case 'ADJUSTMENT':
                newBalance += amount;
                break;
            case 'WRITE_OFF':
                newBalance -= amount;
                break;
        }
        
        return Math.max(0, newBalance);
    }

    storeTransaction(transaction) {
        const transactions = JSON.parse(localStorage.getItem('mpesewa_ledger_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('mpesewa_ledger_transactions', JSON.stringify(transactions));
        
        // Add to local array
        this.transactions.push(transaction);
    }

    async updateLedgerBalance(transaction) {
        // Update ledger balance
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        const ledgerIndex = ledgers.findIndex(l => l.id === this.ledgerData.id);
        
        if (ledgerIndex !== -1) {
            ledgers[ledgerIndex].balance = transaction.newBalance;
            ledgers[ledgerIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
            
            // Update local data
            this.ledgerData = ledgers[ledgerIndex];
        }
    }

    async updateLedgerState() {
        // Update ledger state based on balance
        if (this.ledgerData.balance <= 0) {
            await this.updateLedgerStatus('CLEARED', {});
        }
    }

    async updateLedgerStatus(status, data) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        const ledgerIndex = ledgers.findIndex(l => l.id === this.ledgerData.id);
        
        if (ledgerIndex !== -1) {
            ledgers[ledgerIndex].status = status;
            ledgers[ledgerIndex].updatedAt = new Date().toISOString();
            
            // Add status change record
            ledgers[ledgerIndex].statusHistory = ledgers[ledgerIndex].statusHistory || [];
            ledgers[ledgerIndex].statusHistory.push({
                status: status,
                timestamp: new Date().toISOString(),
                ...data
            });
            
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
            
            // Update local data
            this.ledgerData = ledgers[ledgerIndex];
        }
    }

    calculateBalance() {
        return this.ledgerData.balance;
    }

    findDiscrepancies(calculatedBalance, expectedBalance) {
        const discrepancies = [];
        const tolerance = 0.01; // 1 cent tolerance
        
        if (Math.abs(calculatedBalance - expectedBalance) > tolerance) {
            discrepancies.push({
                type: 'BALANCE_MISMATCH',
                calculated: calculatedBalance,
                expected: expectedBalance,
                difference: calculatedBalance - expectedBalance
            });
        }
        
        // Check for missing transactions
        const expectedTransactionCount = this.transactions.length;
        const actualTransactionCount = this.getTransactionCount();
        
        if (expectedTransactionCount !== actualTransactionCount) {
            discrepancies.push({
                type: 'TRANSACTION_COUNT_MISMATCH',
                expected: expectedTransactionCount,
                actual: actualTransactionCount,
                difference: expectedTransactionCount - actualTransactionCount
            });
        }
        
        return discrepancies;
    }

    getTransactionCount() {
        const transactions = JSON.parse(localStorage.getItem('mpesewa_ledger_transactions') || '[]');
        return transactions.filter(t => t.ledgerId === this.ledgerData.id).length;
    }

    createReconciliationTransaction(discrepancies, reconciliationData) {
        const transactionId = 'TX-RECON-' + Date.now();
        
        // Calculate total adjustment
        const totalAdjustment = discrepancies.reduce((sum, disc) => {
            if (disc.type === 'BALANCE_MISMATCH') {
                return sum + disc.difference;
            }
            return sum;
        }, 0);
        
        const transaction = {
            id: transactionId,
            ledgerId: this.ledgerData.id,
            type: 'RECONCILIATION_ADJUSTMENT',
            amount: Math.abs(totalAdjustment),
            description: `Reconciliation adjustment for ${discrepancies.length} discrepancies`,
            metadata: {
                discrepancies: discrepancies,
                reconciledBy: reconciliationData.reconciledBy,
                reconciliationDate: new Date().toISOString()
            },
            timestamp: new Date().toISOString(),
            previousBalance: this.ledgerData.balance,
            newBalance: this.ledgerData.balance - totalAdjustment // Subtract to match expected
        };
        
        // Store transaction
        this.storeTransaction(transaction);
        
        return transaction;
    }

    async updateLedgerAfterReconciliation(transaction) {
        // Update ledger balance
        await this.updateLedgerBalance(transaction);
        
        // Record reconciliation
        const reconciliations = JSON.parse(localStorage.getItem('mpesewa_reconciliations') || '[]');
        reconciliations.push({
            ledgerId: this.ledgerData.id,
            transactionId: transaction.id,
            timestamp: new Date().toISOString(),
            balanceBefore: transaction.previousBalance,
            balanceAfter: transaction.newBalance
        });
        localStorage.setItem('mpesewa_reconciliations', JSON.stringify(reconciliations));
    }

    recordReconciliation(reconciliationData) {
        const reconciliations = JSON.parse(localStorage.getItem('mpesewa_reconciliations') || '[]');
        reconciliations.push({
            ledgerId: this.ledgerData.id,
            timestamp: new Date().toISOString(),
            balance: this.ledgerData.balance,
            reconciledBy: reconciliationData.reconciledBy,
            notes: reconciliationData.notes
        });
        localStorage.setItem('mpesewa_reconciliations', JSON.stringify(reconciliations));
    }

    getTransaction(transactionId) {
        return this.transactions.find(t => t.id === transactionId);
    }

    createDispute(transaction, disputeData) {
        const disputeId = 'DISPUTE-' + Date.now();
        
        const dispute = {
            id: disputeId,
            ledgerId: this.ledgerData.id,
            transactionId: transaction.id,
            reason: disputeData.reason,
            description: disputeData.description,
            evidence: disputeData.evidence || [],
            status: 'OPEN',
            raisedBy: disputeData.raisedBy,
            raisedAt: new Date().toISOString(),
            assignedTo: null,
            resolution: null
        };
        
        // Store dispute
        const disputes = JSON.parse(localStorage.getItem('mpesewa_ledger_disputes') || '[]');
        disputes.push(dispute);
        localStorage.setItem('mpesewa_ledger_disputes', JSON.stringify(disputes));
        
        return dispute;
    }

    async markTransactionAsDisputed(transactionId, disputeId) {
        // Update transaction
        const transactions = JSON.parse(localStorage.getItem('mpesewa_ledger_transactions') || '[]');
        const transactionIndex = transactions.findIndex(t => t.id === transactionId);
        
        if (transactionIndex !== -1) {
            transactions[transactionIndex].disputed = true;
            transactions[transactionIndex].disputeId = disputeId;
            transactions[transactionIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mpesewa_ledger_transactions', JSON.stringify(transactions));
            
            // Update local transaction
            const localIndex = this.transactions.findIndex(t => t.id === transactionId);
            if (localIndex !== -1) {
                this.transactions[localIndex] = transactions[transactionIndex];
            }
        }
    }

    async notifyDisputeParties(dispute) {
        // Notify lender and borrower
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        
        // Notify lender
        const lenderNotification = {
            userId: this.ledgerData.lenderId,
            type: 'LEDGER_DISPUTE_RAISED',
            title: 'Ledger Dispute Raised',
            message: `A dispute has been raised on transaction in ledger ${this.ledgerData.id}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                disputeId: dispute.id,
                ledgerId: this.ledgerData.id,
                transactionId: dispute.transactionId,
                reason: dispute.reason
            }
        };
        
        // Notify borrower
        const borrowerNotification = {
            userId: this.ledgerData.borrowerId,
            type: 'LEDGER_DISPUTE_RAISED',
            title: 'Ledger Dispute Raised',
            message: `A dispute has been raised on transaction in ledger ${this.ledgerData.id}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                disputeId: dispute.id,
                ledgerId: this.ledgerData.id,
                transactionId: dispute.transactionId,
                reason: dispute.reason
            }
        };
        
        notifications.push(lenderNotification, borrowerNotification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async getDispute(disputeId) {
        const disputes = JSON.parse(localStorage.getItem('mpesewa_ledger_disputes') || '[]');
        return disputes.find(d => d.id === disputeId);
    }

    applyDisputeResolution(dispute, resolutionData, transaction) {
        let resolution;
        
        switch (resolutionData.resolution) {
            case 'ADJUST_TRANSACTION':
                resolution = {
                    type: 'TRANSACTION_ADJUSTMENT',
                    adjustment: resolutionData.adjustment,
                    newTransaction: this.createAdjustmentTransaction(transaction, resolutionData)
                };
                break;
                
            case 'REVERSE_TRANSACTION':
                resolution = {
                    type: 'TRANSACTION_REVERSAL',
                    reversal: this.createReversalTransaction(transaction, resolutionData)
                };
                break;
                
            case 'KEEP_AS_IS':
                resolution = {
                    type: 'NO_CHANGE',
                    reason: resolutionData.reason
                };
                break;
                
            default:
                throw new Error('Invalid resolution type');
        }
        
        return resolution;
    }

    createAdjustmentTransaction(originalTransaction, resolutionData) {
        const transactionId = 'TX-ADJ-' + Date.now();
        
        const transaction = {
            id: transactionId,
            ledgerId: this.ledgerData.id,
            type: 'DISPUTE_ADJUSTMENT',
            amount: resolutionData.adjustment,
            description: `Adjustment for dispute resolution: ${resolutionData.reason}`,
            metadata: {
                originalTransactionId: originalTransaction.id,
                disputeId: resolutionData.disputeId,
                resolution: resolutionData.resolution
            },
            timestamp: new Date().toISOString(),
            previousBalance: this.ledgerData.balance,
            newBalance: this.ledgerData.balance + resolutionData.adjustment
        };
        
        // Store transaction
        this.storeTransaction(transaction);
        
        return transaction;
    }

    createReversalTransaction(originalTransaction, resolutionData) {
        const transactionId = 'TX-REV-' + Date.now();
        
        const transaction = {
            id: transactionId,
            ledgerId: this.ledgerData.id,
            type: 'TRANSACTION_REVERSAL',
            amount: originalTransaction.amount,
            description: `Reversal for dispute resolution: ${resolutionData.reason}`,
            metadata: {
                originalTransactionId: originalTransaction.id,
                disputeId: resolutionData.disputeId,
                resolution: resolutionData.resolution
            },
            timestamp: new Date().toISOString(),
            previousBalance: this.ledgerData.balance,
            newBalance: this.ledgerData.balance - originalTransaction.amount
        };
        
        // Store transaction
        this.storeTransaction(transaction);
        
        return transaction;
    }

    async updateTransactionAfterDispute(transactionId, resolution) {
        // Mark transaction as resolved
        const transactions = JSON.parse(localStorage.getItem('mpesewa_ledger_transactions') || '[]');
        const transactionIndex = transactions.findIndex(t => t.id === transactionId);
        
        if (transactionIndex !== -1) {
            transactions[transactionIndex].disputeResolved = true;
            transactions[transactionIndex].resolution = resolution.type;
            transactions[transactionIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mpesewa_ledger_transactions', JSON.stringify(transactions));
        }
        
        // Update ledger balance if needed
        if (resolution.type === 'TRANSACTION_ADJUSTMENT') {
            await this.updateLedgerBalance(resolution.newTransaction);
        } else if (resolution.type === 'TRANSACTION_REVERSAL') {
            await this.updateLedgerBalance(resolution.reversal);
        }
    }

    async closeDispute(disputeId, resolutionData) {
        const disputes = JSON.parse(localStorage.getItem('mpesewa_ledger_disputes') || '[]');
        const disputeIndex = disputes.findIndex(d => d.id === disputeId);
        
        if (disputeIndex !== -1) {
            disputes[disputeIndex].status = 'CLOSED';
            disputes[disputeIndex].resolvedAt = new Date().toISOString();
            disputes[disputeIndex].resolvedBy = resolutionData.resolvedBy;
            disputes[disputeIndex].resolution = resolutionData.resolution;
            disputes[disputeIndex].resolutionNotes = resolutionData.notes;
            localStorage.setItem('mpesewa_ledger_disputes', JSON.stringify(disputes));
        }
    }

    validateFreezeRequest(freezeData) {
        if (!freezeData.reason) {
            return {
                valid: false,
                message: 'Freeze reason is required'
            };
        }
        
        if (!freezeData.requestedBy) {
            return {
                valid: false,
                message: 'Requestor is required'
            };
        }
        
        return {
            valid: true,
            message: 'Freeze request validated'
        };
    }

    createFreezeRecord(freezeData) {
        const freezeId = 'FREEZE-' + Date.now();
        
        const freeze = {
            id: freezeId,
            ledgerId: this.ledgerData.id,
            reason: freezeData.reason,
            requestedBy: freezeData.requestedBy,
            approvedBy: freezeData.approvedBy,
            frozenAt: new Date().toISOString(),
            expectedDuration: freezeData.expectedDuration,
            notes: freezeData.notes
        };
        
        // Store freeze record
        const freezes = JSON.parse(localStorage.getItem('mpesewa_ledger_freezes') || '[]');
        freezes.push(freeze);
        localStorage.setItem('mpesewa_ledger_freezes', JSON.stringify(freezes));
        
        return freeze;
    }

    async updateLedgerFreezeStatus(frozen, freezeRecord) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        const ledgerIndex = ledgers.findIndex(l => l.id === this.ledgerData.id);
        
        if (ledgerIndex !== -1) {
            ledgers[ledgerIndex].frozen = frozen;
            ledgers[ledgerIndex].freezeId = frozen ? freezeRecord.id : null;
            ledgers[ledgerIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
            
            // Update local data
            this.ledgerData = ledgers[ledgerIndex];
        }
    }

    getFreezeRestrictions() {
        return {
            noNewTransactions: true,
            noBalanceChanges: true,
            viewOnly: true,
            canUnfreeze: ['ADMIN', 'LENDER'].includes(this.ledgerData.lenderId) // Simplified check
        };
    }

    async notifyLedgerFreeze(freezeData) {
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        
        // Notify lender
        const lenderNotification = {
            userId: this.ledgerData.lenderId,
            type: 'LEDGER_FROZEN',
            title: 'Ledger Frozen',
            message: `Ledger ${this.ledgerData.id} has been frozen. Reason: ${freezeData.reason}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                ledgerId: this.ledgerData.id,
                reason: freezeData.reason,
                frozenAt: new Date().toISOString()
            }
        };
        
        // Notify borrower
        const borrowerNotification = {
            userId: this.ledgerData.borrowerId,
            type: 'LEDGER_FROZEN',
            title: 'Ledger Frozen',
            message: `Ledger ${this.ledgerData.id} has been frozen. Reason: ${freezeData.reason}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                ledgerId: this.ledgerData.id,
                reason: freezeData.reason,
                frozenAt: new Date().toISOString()
            }
        };
        
        notifications.push(lenderNotification, borrowerNotification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    validateUnfreezeRequest(unfreezeData) {
        if (!unfreezeData.reason) {
            return {
                valid: false,
                message: 'Unfreeze reason is required'
            };
        }
        
        if (!unfreezeData.requestedBy) {
            return {
                valid: false,
                message: 'Requestor is required'
            };
        }
        
        return {
            valid: true,
            message: 'Unfreeze request validated'
        };
    }

    createUnfreezeRecord(unfreezeData) {
        const unfreezeId = 'UNFREEZE-' + Date.now();
        
        const unfreeze = {
            id: unfreezeId,
            ledgerId: this.ledgerData.id,
            reason: unfreezeData.reason,
            requestedBy: unfreezeData.requestedBy,
            approvedBy: unfreezeData.approvedBy,
            unfrozenAt: new Date().toISOString(),
            notes: unfreezeData.notes
        };
        
        // Store unfreeze record
        const unfreezes = JSON.parse(localStorage.getItem('mpesewa_ledger_unfreezes') || '[]');
        unfreezes.push(unfreeze);
        localStorage.setItem('mpesewa_ledger_unfreezes', JSON.stringify(unfreezes));
        
        return unfreeze;
    }

    async notifyLedgerUnfreeze(unfreezeData) {
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        
        // Notify lender
        const lenderNotification = {
            userId: this.ledgerData.lenderId,
            type: 'LEDGER_UNFROZEN',
            title: 'Ledger Unfrozen',
            message: `Ledger ${this.ledgerData.id} has been unfrozen.`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                ledgerId: this.ledgerData.id,
                unfrozenAt: new Date().toISOString()
            }
        };
        
        // Notify borrower
        const borrowerNotification = {
            userId: this.ledgerData.borrowerId,
            type: 'LEDGER_UNFROZEN',
            title: 'Ledger Unfrozen',
            message: `Ledger ${this.ledgerData.id} has been unfrozen.`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                ledgerId: this.ledgerData.id,
                unfrozenAt: new Date().toISOString()
            }
        };
        
        notifications.push(lenderNotification, borrowerNotification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    validateClosure(closureData) {
        // Check if balance is zero
        if (this.ledgerData.balance > 0) {
            return {
                valid: false,
                message: 'Cannot close ledger with outstanding balance'
            };
        }
        
        if (!closureData.reason) {
            return {
                valid: false,
                message: 'Closure reason is required'
            };
        }
        
        return {
            valid: true,
            message: 'Closure validated'
        };
    }

    createClosureTransaction(closureData) {
        const transactionId = 'TX-CLOSE-' + Date.now();
        
        const transaction = {
            id: transactionId,
            ledgerId: this.ledgerData.id,
            type: 'LEDGER_CLOSURE',
            amount: 0,
            description: `Ledger closed: ${closureData.reason}`,
            metadata: {
                closedBy: closureData.closedBy,
                reason: closureData.reason,
                closureDate: new Date().toISOString()
            },
            timestamp: new Date().toISOString(),
            previousBalance: this.ledgerData.balance,
            newBalance: 0
        };
        
        // Store transaction
        this.storeTransaction(transaction);
        
        return transaction;
    }

    async notifyLedgerClosure(closureData) {
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        
        // Notify lender
        const lenderNotification = {
            userId: this.ledgerData.lenderId,
            type: 'LEDGER_CLOSED',
            title: 'Ledger Closed',
            message: `Ledger ${this.ledgerData.id} has been closed.`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                ledgerId: this.ledgerData.id,
                closedAt: new Date().toISOString(),
                reason: closureData.reason
            }
        };
        
        // Notify borrower
        const borrowerNotification = {
            userId: this.ledgerData.borrowerId,
            type: 'LEDGER_CLOSED',
            title: 'Ledger Closed',
            message: `Ledger ${this.ledgerData.id} has been closed.`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                ledgerId: this.ledgerData.id,
                closedAt: new Date().toISOString(),
                reason: closureData.reason
            }
        };
        
        notifications.push(lenderNotification, borrowerNotification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    createArchiveRecord(archiveData) {
        const archiveId = 'ARCHIVE-' + Date.now();
        
        const archive = {
            id: archiveId,
            ledgerId: this.ledgerData.id,
            archivedBy: archiveData.archivedBy,
            archivedAt: new Date().toISOString(),
            reason: archiveData.reason,
            storageLocation: archiveData.storageLocation || 'DIGITAL_VAULT'
        };
        
        // Store archive record
        const archives = JSON.parse(localStorage.getItem('mpesewa_ledger_archives') || '[]');
        archives.push(archive);
        localStorage.setItem('mpesewa_ledger_archives', JSON.stringify(archives));
        
        return archive;
    }

    getTransactionSummary() {
        const summary = {
            totalTransactions: this.transactions.length,
            byType: {},
            totalAmount: 0,
            firstTransaction: null,
            lastTransaction: null
        };
        
        if (this.transactions.length > 0) {
            summary.firstTransaction = this.transactions[0].timestamp;
            summary.lastTransaction = this.transactions[this.transactions.length - 1].timestamp;
            
            this.transactions.forEach(transaction => {
                // Count by type
                summary.byType[transaction.type] = (summary.byType[transaction.type] || 0) + 1;
                
                // Sum amounts
                if (transaction.amount) {
                    summary.totalAmount += transaction.amount;
                }
            });
        }
        
        return summary;
    }

    filterTransactions(criteria) {
        return this.transactions.filter(transaction => {
            // Filter by type
            if (criteria.type && transaction.type !== criteria.type) {
                return false;
            }
            
            // Filter by date range
            if (criteria.startDate) {
                const start = new Date(criteria.startDate);
                const transactionDate = new Date(transaction.timestamp);
                if (transactionDate < start) {
                    return false;
                }
            }
            
            if (criteria.endDate) {
                const end = new Date(criteria.endDate);
                const transactionDate = new Date(transaction.timestamp);
                if (transactionDate > end) {
                    return false;
                }
            }
            
            // Filter by amount range
            if (criteria.minAmount && transaction.amount < criteria.minAmount) {
                return false;
            }
            
            if (criteria.maxAmount && transaction.amount > criteria.maxAmount) {
                return false;
            }
            
            return true;
        });
    }

    calculateAuditTotals(transactions) {
        const totals = {
            count: transactions.length,
            totalAmount: 0,
            averageAmount: 0,
            byType: {}
        };
        
        transactions.forEach(transaction => {
            totals.totalAmount += transaction.amount || 0;
            
            // Group by type
            if (!totals.byType[transaction.type]) {
                totals.byType[transaction.type] = {
                    count: 0,
                    total: 0
                };
            }
            
            totals.byType[transaction.type].count++;
            totals.byType[transaction.type].total += transaction.amount || 0;
        });
        
        totals.averageAmount = totals.count > 0 ? totals.totalAmount / totals.count : 0;
        
        return totals;
    }

    detectAnomalies(transactions) {
        const anomalies = [];
        
        // Check for unusually large transactions
        const averageAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0) / transactions.length;
        const largeTransactions = transactions.filter(t => 
            t.amount > (averageAmount * 5) // 5x average
        );
        
        if (largeTransactions.length > 0) {
            anomalies.push({
                type: 'LARGE_TRANSACTIONS',
                count: largeTransactions.length,
                transactions: largeTransactions.map(t => ({
                    id: t.id,
                    amount: t.amount,
                    type: t.type,
                    timestamp: t.timestamp
                }))
            });
        }
        
        // Check for rapid succession transactions
        const rapidTransactions = [];
        transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        for (let i = 1; i < transactions.length; i++) {
            const prevTime = new Date(transactions[i-1].timestamp);
            const currTime = new Date(transactions[i].timestamp);
            const timeDiff = (currTime - prevTime) / (1000 * 60); // minutes
            
            if (timeDiff < 1) { // Less than 1 minute apart
                rapidTransactions.push({
                    transaction1: transactions[i-1],
                    transaction2: transactions[i],
                    timeDiff: timeDiff
                });
            }
        }
        
        if (rapidTransactions.length > 0) {
            anomalies.push({
                type: 'RAPID_SUCCESSION',
                count: rapidTransactions.length,
                pairs: rapidTransactions
            });
        }
        
        // Check for balance going negative
        const negativeBalance = transactions.filter(t => t.newBalance < 0);
        if (negativeBalance.length > 0) {
            anomalies.push({
                type: 'NEGATIVE_BALANCE',
                count: negativeBalance.length,
                transactions: negativeBalance.map(t => ({
                    id: t.id,
                    newBalance: t.newBalance,
                    timestamp: t.timestamp
                }))
            });
        }
        
        return anomalies;
    }

    generateAuditTrail(transactions, criteria) {
        const auditTrail = {
            ledgerId: this.ledgerData.id,
            auditDate: new Date().toISOString(),
            criteria: criteria,
            transactions: transactions.map(t => ({
                id: t.id,
                type: t.type,
                amount: t.amount,
                description: t.description,
                timestamp: t.timestamp,
                previousBalance: t.previousBalance,
                newBalance: t.newBalance,
                createdBy: t.createdBy
            })),
            summary: this.calculateAuditTotals(transactions),
            auditor: criteria.auditor || 'SYSTEM',
            notes: criteria.notes
        };
        
        // Store audit trail
        const auditTrails = JSON.parse(localStorage.getItem('mpesewa_audit_trails') || '[]');
        auditTrails.push(auditTrail);
        localStorage.setItem('mpesewa_audit_trails', JSON.stringify(auditTrails));
        
        return auditTrail;
    }

    // Public API methods
    getCurrentState() {
        return {
            state: this.currentState,
            ledger: this.ledgerData ? {
                id: this.ledgerData.id,
                balance: this.ledgerData.balance,
                status: this.ledgerData.status
            } : null,
            transactions: this.transactions.length,
            currentTransaction: this.currentTransaction
        };
    }

    reset() {
        this.currentState = 'IDLE';
        this.ledgerData = null;
        this.transactions = [];
        this.currentTransaction = null;
    }

    async loadLedger(ledgerId) {
        try {
            const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
            this.ledgerData = ledgers.find(l => l.id === ledgerId);
            
            if (!this.ledgerData) {
                throw new Error('Ledger not found');
            }
            
            // Load transactions
            const transactions = JSON.parse(localStorage.getItem('mpesewa_ledger_transactions') || '[]');
            this.transactions = transactions.filter(t => t.ledgerId === ledgerId);
            
            this.currentState = this.ledgerData.status;
            
            return {
                success: true,
                state: this.currentState,
                ledger: this.ledgerData,
                transactions: this.transactions.length,
                message: 'Ledger loaded successfully'
            };
            
        } catch (error) {
            this.currentState = 'IDLE';
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async getLedgerAuditLog() {
        const auditTrails = JSON.parse(localStorage.getItem('mpesewa_audit_trails') || '[]');
        const ledgerAudits = auditTrails.filter(audit => audit.ledgerId === this.ledgerData.id);
        
        return {
            ledgerId: this.ledgerData.id,
            auditCount: ledgerAudits.length,
            audits: ledgerAudits.sort((a, b) => 
                new Date(b.auditDate) - new Date(a.auditDate)
            )
        };
    }

    async getLedgerDisputes() {
        const disputes = JSON.parse(localStorage.getItem('mpesewa_ledger_disputes') || '[]');
        const ledgerDisputes = disputes.filter(dispute => dispute.ledgerId === this.ledgerData.id);
        
        return {
            ledgerId: this.ledgerData.id,
            disputeCount: ledgerDisputes.length,
            openDisputes: ledgerDisputes.filter(d => d.status === 'OPEN'),
            closedDisputes: ledgerDisputes.filter(d => d.status === 'CLOSED')
        };
    }

    async generateLedgerStatement(statementData) {
        const { startDate, endDate, format } = statementData;
        
        // Filter transactions by date
        const filteredTransactions = this.transactions.filter(t => {
            const transactionDate = new Date(t.timestamp);
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date();
            
            return transactionDate >= start && transactionDate <= end;
        });
        
        // Calculate opening and closing balances
        const openingBalance = this.getOpeningBalance(startDate);
        const closingBalance = this.ledgerData.balance;
        
        // Group by date
        const transactionsByDate = {};
        filteredTransactions.forEach(t => {
            const date = t.timestamp.split('T')[0];
            if (!transactionsByDate[date]) {
                transactionsByDate[date] = [];
            }
            transactionsByDate[date].push(t);
        });
        
        const statement = {
            ledgerId: this.ledgerData.id,
            period: {
                start: startDate || this.ledgerData.createdAt.split('T')[0],
                end: endDate || new Date().toISOString().split('T')[0]
            },
            openingBalance: openingBalance,
            closingBalance: closingBalance,
            transactions: filteredTransactions.length,
            summary: {
                totalDebits: filteredTransactions
                    .filter(t => ['REPAYMENT', 'WRITE_OFF'].includes(t.type))
                    .reduce((sum, t) => sum + (t.amount || 0), 0),
                totalCredits: filteredTransactions
                    .filter(t => ['INTEREST_APPLIED', 'PENALTY_APPLIED', 'ADJUSTMENT'].includes(t.type))
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
            },
            dailyBreakdown: transactionsByDate,
            generatedAt: new Date().toISOString(),
            format: format || 'DETAILED'
        };
        
        return statement;
    }

    getOpeningBalance(startDate) {
        if (!startDate) {
            return this.ledgerData.principal * (1 + this.ledgerData.interestRate);
        }
        
        // Find balance just before start date
        const start = new Date(startDate);
        const transactionsBefore = this.transactions.filter(t => 
            new Date(t.timestamp) < start
        );
        
        if (transactionsBefore.length === 0) {
            return this.ledgerData.principal * (1 + this.ledgerData.interestRate);
        }
        
        // Get the last transaction before start date
        const lastTransaction = transactionsBefore.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        )[0];
        
        return lastTransaction.newBalance;
    }

    async exportLedgerData(format) {
        const exportData = {
            ledger: this.ledgerData,
            transactions: this.transactions,
            metadata: {
                exportedAt: new Date().toISOString(),
                format: format,
                version: '1.0'
            }
        };
        
        let content;
        
        switch (format) {
            case 'JSON':
                content = JSON.stringify(exportData, null, 2);
                break;
                
            case 'CSV':
                content = this.convertToCSV(exportData);
                break;
                
            case 'PDF':
                // In production, generate PDF
                content = 'PDF generation not implemented in demo';
                break;
                
            default:
                throw new Error('Unsupported export format');
        }
        
        return {
            success: true,
            format: format,
            content: content,
            filename: `ledger-${this.ledgerData.id}-${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`
        };
    }

    convertToCSV(exportData) {
        // Convert transactions to CSV
        const headers = ['ID', 'Type', 'Amount', 'Description', 'Timestamp', 'Previous Balance', 'New Balance'];
        const rows = exportData.transactions.map(t => [
            t.id,
            t.type,
            t.amount || '0',
            t.description,
            t.timestamp,
            t.previousBalance,
            t.newBalance
        ]);
        
        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }
}

// Export singleton instance
const ledgerFlow = new LedgerFlow();
export default ledgerFlow;