/**
 * M-Pesewa Loan Flow Orchestrator
 * Orchestrates loan lifecycle: request → approval → disbursement → repayment
 * Strictly follows Global → Country → Groups → Lenders → Borrowers hierarchy
 */

class LoanFlow {
    constructor() {
        this.currentState = 'IDLE';
        this.states = {
            IDLE: 'IDLE',
            REQUESTING: 'REQUESTING',
            PENDING_APPROVAL: 'PENDING_APPROVAL',
            APPROVED: 'APPROVED',
            DISBURSED: 'DISBURSED',
            ACTIVE: 'ACTIVE',
            PARTIAL_REPAYMENT: 'PARTIAL_REPAYMENT',
            OVERDUE: 'OVERDUE',
            DEFAULTED: 'DEFAULTED',
            CLEARED: 'CLEARED',
            DISPUTED: 'DISPUTED',
            CANCELLED: 'CANCELLED'
        };
        
        this.loanData = null;
        this.ledgerEntry = null;
        this.country = null;
        this.group = null;
        this.lender = null;
        this.borrower = null;
    }

    // 1. LOAN REQUEST PHASE
    async requestLoan(loanData) {
        try {
            this.currentState = this.states.REQUESTING;
            this.loanData = loanData;
            
            // Strict hierarchy validation
            if (!await this.validateHierarchy()) {
                throw new Error('Hierarchy validation failed. Check country, group, lender, borrower relationships.');
            }
            
            // Validate borrower eligibility
            if (!await this.validateBorrowerEligibility()) {
                throw new Error('Borrower is not eligible for this loan');
            }
            
            // Validate lender subscription
            if (!await this.validateLenderSubscription()) {
                throw new Error('Lender subscription is not active or has insufficient limits');
            }
            
            // Validate loan amount against tier limits
            if (!await this.validateLoanAmount()) {
                throw new Error('Loan amount exceeds subscription tier limits');
            }
            
            // Check blacklist status
            if (await this.checkBlacklist()) {
                throw new Error('Borrower is blacklisted');
            }
            
            // Calculate loan terms
            const terms = this.calculateLoanTerms();
            
            // Create loan request record
            const requestId = await this.createLoanRequest(terms);
            
            this.currentState = this.states.PENDING_APPROVAL;
            
            // Notify lender
            await this.notifyLender(requestId);
            
            return {
                success: true,
                requestId: requestId,
                state: this.currentState,
                terms: terms,
                message: 'Loan request submitted successfully. Awaiting lender approval.'
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

    // 2. LOAN APPROVAL PHASE
    async approveLoan(requestId, lenderApproval) {
        try {
            if (this.currentState !== this.states.PENDING_APPROVAL) {
                throw new Error('Loan is not in pending approval state');
            }
            
            if (!lenderApproval.approved) {
                this.currentState = this.states.CANCELLED;
                await this.notifyBorrowerRejection(lenderApproval.reason);
                return {
                    success: false,
                    state: this.currentState,
                    message: 'Loan request rejected by lender'
                };
            }
            
            // Final validation before approval
            if (!await this.finalPreApprovalChecks()) {
                throw new Error('Pre-approval checks failed');
            }
            
            // Generate ledger entry
            this.ledgerEntry = await this.createLedgerEntry();
            
            // Update loan status
            await this.updateLoanStatus(requestId, 'APPROVED');
            
            this.currentState = this.states.APPROVED;
            
            // Notify borrower
            await this.notifyBorrowerApproval();
            
            return {
                success: true,
                state: this.currentState,
                ledgerId: this.ledgerEntry.id,
                message: 'Loan approved successfully. Ready for disbursement.',
                disbursementInstructions: this.generateDisbursementInstructions()
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    // 3. DISBURSEMENT PHASE
    async disburseLoan(disbursementData) {
        try {
            if (this.currentState !== this.states.APPROVED) {
                throw new Error('Loan is not in approved state');
            }
            
            // Record disbursement method (off-platform)
            await this.recordDisbursement(disbursementData);
            
            // Update ledger status
            await this.updateLedgerStatus('DISBURSED', disbursementData);
            
            // Calculate due date (7 days from disbursement)
            const dueDate = this.calculateDueDate();
            
            // Schedule repayment reminders
            await this.scheduleRepaymentReminders(dueDate);
            
            // Activate loan monitoring
            await this.activateLoanMonitoring();
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                dueDate: dueDate,
                repaymentSchedule: this.generateRepaymentSchedule(),
                message: 'Loan disbursed successfully. Repayment due in 7 days.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    // 4. REPAYMENT PHASE
    async recordRepayment(repaymentData) {
        try {
            if (this.currentState !== this.states.ACTIVE && 
                this.currentState !== this.states.PARTIAL_REPAYMENT &&
                this.currentState !== this.states.OVERDUE) {
                throw new Error('Loan is not in a repayable state');
            }
            
            // Record repayment (off-platform)
            await this.recordRepaymentEntry(repaymentData);
            
            // Update ledger
            const updatedLedger = await this.updateLedgerRepayment(repaymentData);
            
            // Check if loan is fully repaid
            if (updatedLedger.balance <= 0) {
                await this.completeRepayment();
                this.currentState = this.states.CLEARED;
                
                // Update borrower rating
                await this.updateBorrowerRating('GOOD');
                
                return {
                    success: true,
                    state: this.currentState,
                    message: 'Loan fully repaid. Borrower rating updated.',
                    clearanceCertificate: this.generateClearanceCertificate()
                };
            } else {
                this.currentState = this.states.PARTIAL_REPAYMENT;
                
                return {
                    success: true,
                    state: this.currentState,
                    remainingBalance: updatedLedger.balance,
                    nextDueDate: updatedLedger.nextDueDate,
                    message: 'Partial repayment recorded successfully.'
                };
            }
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    // 5. OVERDUE & DEFAULT HANDLING
    async checkOverdueStatus() {
        try {
            if (!this.ledgerEntry) {
                throw new Error('No active loan ledger found');
            }
            
            const now = new Date();
            const dueDate = new Date(this.ledgerEntry.dueDate);
            const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
            
            if (daysOverdue > 0 && daysOverdue <= 7) {
                // Apply 5% daily penalty
                const penalty = this.calculatePenalty(daysOverdue);
                await this.applyPenalty(penalty);
                
                this.currentState = this.states.OVERDUE;
                
                return {
                    overdue: true,
                    daysOverdue: daysOverdue,
                    penaltyApplied: penalty,
                    state: this.currentState,
                    message: `Loan is ${daysOverdue} day(s) overdue. Penalty applied.`
                };
                
            } else if (daysOverdue > 60) { // 2 months
                // Mark as defaulted
                await this.markAsDefaulted();
                this.currentState = this.states.DEFAULTED;
                
                // Add to blacklist
                await this.addToBlacklist();
                
                return {
                    defaulted: true,
                    daysOverdue: daysOverdue,
                    state: this.currentState,
                    message: 'Loan has been defaulted. Borrower added to blacklist.'
                };
            }
            
            return {
                overdue: false,
                daysOverdue: 0,
                state: this.currentState
            };
            
        } catch (error) {
            return {
                error: error.message,
                state: this.currentState
            };
        }
    }

    // HELPER METHODS
    async validateHierarchy() {
        // Strict hierarchy validation
        const userCountry = localStorage.getItem('mpesewa_country');
        const userGroup = localStorage.getItem('mpesewa_group');
        
        if (!userCountry || !userGroup) {
            return false;
        }
        
        // Ensure borrower and lender are in same country and group
        const borrowerData = await this.getBorrowerData();
        const lenderData = await this.getLenderData();
        
        return (borrowerData.country === lenderData.country && 
                borrowerData.country === userCountry &&
                borrowerData.group === lenderData.group &&
                borrowerData.group === userGroup);
    }

    async validateBorrowerEligibility() {
        const borrower = await this.getBorrowerData();
        
        // Check if borrower is already in active loan in this group
        const activeLoans = await this.getActiveLoans(borrower.id, this.loanData.group);
        if (activeLoans.length > 0) {
            return false;
        }
        
        // Check borrower rating (minimum 3 stars)
        if (borrower.rating < 3) {
            return false;
        }
        
        // Check number of groups (max 4)
        const borrowerGroups = await this.getBorrowerGroups(borrower.id);
        if (borrowerGroups.length >= 4) {
            return false;
        }
        
        return true;
    }

    async validateLenderSubscription() {
        const lender = await this.getLenderData();
        const today = new Date();
        const expiryDate = new Date(lender.subscriptionExpiry);
        
        // Check if subscription is active (expires on 28th of each month)
        if (today > expiryDate) {
            return false;
        }
        
        // Check weekly lending limit
        const weeklyLent = await this.getWeeklyLentAmount(lender.id);
        const limit = this.getTierLimit(lender.subscriptionTier);
        
        return (weeklyLent + this.loanData.amount) <= limit;
    }

    validateLoanAmount() {
        const tierLimits = {
            'BASIC': 1500,
            'PREMIUM': 5000,
            'SUPER': 20000,
            'LENDER_OF_LENDERS': 50000
        };
        
        const lenderTier = this.loanData.lenderSubscriptionTier;
        return this.loanData.amount <= tierLimits[lenderTier];
    }

    async checkBlacklist() {
        const borrower = await this.getBorrowerData();
        return borrower.blacklisted === true;
    }

    calculateLoanTerms() {
        const principal = this.loanData.amount;
        const interestRate = 0.10; // 10%
        const interest = principal * interestRate;
        const totalDue = principal + interest;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        
        return {
            principal: principal,
            interest: interest,
            interestRate: '10%',
            totalDue: totalDue,
            dueDate: dueDate.toISOString(),
            repaymentPeriod: '7 days',
            dailyRepayment: totalDue / 7,
            penaltyRate: '5% daily after 7 days',
            currency: this.loanData.currency
        };
    }

    calculatePenalty(daysOverdue) {
        const dailyPenaltyRate = 0.05; // 5%
        const outstandingBalance = this.ledgerEntry?.outstandingBalance || this.loanData.amount;
        return outstandingBalance * dailyPenaltyRate * daysOverdue;
    }

    async createLedgerEntry() {
        const ledgerId = 'LEDG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        return {
            id: ledgerId,
            borrowerId: this.loanData.borrowerId,
            lenderId: this.loanData.lenderId,
            groupId: this.loanData.group,
            country: this.loanData.country,
            loanCategory: this.loanData.category,
            amount: this.loanData.amount,
            interest: this.loanData.amount * 0.10,
            disbursementDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'ACTIVE',
            outstandingBalance: this.loanData.amount * 1.10, // principal + interest
            repayments: [],
            guarantors: this.loanData.guarantors || [],
            createdAt: new Date().toISOString()
        };
    }

    // Event notification methods
    async notifyLender(requestId) {
        // Implementation for notifying lender about loan request
        console.log(`Notifying lender about loan request: ${requestId}`);
        // In production: Send push notification, email, or SMS
    }

    async notifyBorrowerApproval() {
        console.log('Notifying borrower about loan approval');
    }

    async notifyBorrowerRejection(reason) {
        console.log(`Notifying borrower about loan rejection: ${reason}`);
    }

    // Data retrieval methods (simulated)
    async getBorrowerData() {
        return JSON.parse(localStorage.getItem('mpesewa_borrower') || '{}');
    }

    async getLenderData() {
        return JSON.parse(localStorage.getItem('mpesewa_lender') || '{}');
    }

    async getActiveLoans(borrowerId, groupId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        return loans.filter(loan => 
            loan.borrowerId === borrowerId && 
            loan.groupId === groupId && 
            ['ACTIVE', 'OVERDUE', 'PARTIAL_REPAYMENT'].includes(loan.status)
        );
    }

    async getBorrowerGroups(borrowerId) {
        const groups = JSON.parse(localStorage.getItem('mpesewa_borrower_groups') || '[]');
        return groups.filter(group => group.borrowerId === borrowerId);
    }

    async getWeeklyLentAmount(lenderId) {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const loans = JSON.parse(localStorage.getItem('mpesewa_lender_loans') || '[]');
        
        return loans
            .filter(loan => 
                loan.lenderId === lenderId && 
                new Date(loan.disbursementDate) > oneWeekAgo
            )
            .reduce((sum, loan) => sum + loan.amount, 0);
    }

    getTierLimit(tier) {
        const limits = {
            'BASIC': 1500,
            'PREMIUM': 5000,
            'SUPER': 20000,
            'LENDER_OF_LENDERS': 50000
        };
        return limits[tier] || 0;
    }

    // Simulated methods for production implementation
    async createLoanRequest(terms) {
        const requestId = 'REQ-' + Date.now();
        const requests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        
        const request = {
            id: requestId,
            ...this.loanData,
            terms: terms,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };
        
        requests.push(request);
        localStorage.setItem('mpesewa_loan_requests', JSON.stringify(requests));
        
        return requestId;
    }

    async updateLoanStatus(requestId, status) {
        const requests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        const requestIndex = requests.findIndex(req => req.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = status;
            requests[requestIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mpesewa_loan_requests', JSON.stringify(requests));
        }
    }

    async recordDisbursement(disbursementData) {
        const disbursements = JSON.parse(localStorage.getItem('mpesewa_disbursements') || '[]');
        
        disbursements.push({
            ledgerId: this.ledgerEntry.id,
            ...disbursementData,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_disbursements', JSON.stringify(disbursements));
    }

    async updateLedgerStatus(status, data = {}) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        const ledgerIndex = ledgers.findIndex(ledger => ledger.id === this.ledgerEntry.id);
        
        if (ledgerIndex !== -1) {
            ledgers[ledgerIndex].status = status;
            ledgers[ledgerIndex].lastUpdated = new Date().toISOString();
            
            if (data.disbursementMethod) {
                ledgers[ledgerIndex].disbursementMethod = data.disbursementMethod;
                ledgers[ledgerIndex].disbursementDate = new Date().toISOString();
            }
            
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        }
    }

    calculateDueDate() {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        return dueDate;
    }

    generateRepaymentSchedule() {
        const totalDue = this.loanData.amount * 1.10;
        const dailyAmount = totalDue / 7;
        
        const schedule = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            schedule.push({
                day: i,
                date: date.toISOString().split('T')[0],
                amountDue: dailyAmount,
                cumulativeAmount: dailyAmount * i
            });
        }
        
        return schedule;
    }

    async recordRepaymentEntry(repaymentData) {
        const repayments = JSON.parse(localStorage.getItem('mpesewa_repayments') || '[]');
        
        repayments.push({
            ledgerId: this.ledgerEntry.id,
            ...repaymentData,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_repayments', JSON.stringify(repayments));
    }

    async updateLedgerRepayment(repaymentData) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        const ledgerIndex = ledgers.findIndex(ledger => ledger.id === this.ledgerEntry.id);
        
        if (ledgerIndex !== -1) {
            const ledger = ledgers[ledgerIndex];
            
            // Record repayment
            ledger.repayments.push({
                amount: repaymentData.amount,
                date: new Date().toISOString(),
                method: repaymentData.method,
                reference: repaymentData.reference
            });
            
            // Update outstanding balance
            ledger.outstandingBalance -= repaymentData.amount;
            
            // Update last repayment date
            ledger.lastRepaymentDate = new Date().toISOString();
            ledger.lastUpdated = new Date().toISOString();
            
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
            
            return ledger;
        }
        
        return null;
    }

    async completeRepayment() {
        await this.updateLedgerStatus('CLEARED');
        
        // Record successful repayment for borrower rating
        const successfulRepayments = JSON.parse(localStorage.getItem('mpesewa_successful_repayments') || '[]');
        successfulRepayments.push({
            ledgerId: this.ledgerEntry.id,
            borrowerId: this.loanData.borrowerId,
            completionDate: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_successful_repayments', JSON.stringify(successfulRepayments));
    }

    async updateBorrowerRating(ratingChange) {
        const borrower = await this.getBorrowerData();
        
        // Update borrower rating logic
        // In production: Implement 5-star rating system
        console.log(`Updating borrower ${borrower.id} rating: ${ratingChange}`);
    }

    generateClearanceCertificate() {
        return {
            certificateId: 'CERT-' + Date.now(),
            borrowerId: this.loanData.borrowerId,
            loanId: this.ledgerEntry.id,
            amount: this.loanData.amount,
            clearedDate: new Date().toISOString(),
            issuer: 'M-Pesewa Platform',
            message: 'Loan successfully repaid. Borrower in good standing.'
        };
    }

    async applyPenalty(penaltyAmount) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        const ledgerIndex = ledgers.findIndex(ledger => ledger.id === this.ledgerEntry.id);
        
        if (ledgerIndex !== -1) {
            const ledger = ledgers[ledgerIndex];
            
            // Add penalty entry
            ledger.penalties = ledger.penalties || [];
            ledger.penalties.push({
                amount: penaltyAmount,
                date: new Date().toISOString(),
                reason: 'Daily overdue penalty (5%)'
            });
            
            // Update outstanding balance with penalty
            ledger.outstandingBalance += penaltyAmount;
            ledger.lastUpdated = new Date().toISOString();
            
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
            
            // Notify borrower about penalty
            console.log(`Applied penalty of ${penaltyAmount} to ledger ${this.ledgerEntry.id}`);
        }
    }

    async markAsDefaulted() {
        await this.updateLedgerStatus('DEFAULTED');
    }

    async addToBlacklist() {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        
        blacklist.push({
            borrowerId: this.loanData.borrowerId,
            ledgerId: this.ledgerEntry.id,
            amountDefaulted: this.ledgerEntry.outstandingBalance,
            defaultDate: new Date().toISOString(),
            reason: 'Loan defaulted after 60 days',
            groupId: this.loanData.group,
            country: this.loanData.country
        });
        
        localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
        
        // Update borrower status
        const borrower = await this.getBorrowerData();
        borrower.blacklisted = true;
        localStorage.setItem('mpesewa_borrower', JSON.stringify(borrower));
    }

    generateDisbursementInstructions() {
        return {
            instructions: [
                'Lender to disburse funds directly via M-Pesa, bank transfer, or cash',
                'Borrower to confirm receipt of funds',
                'Both parties to keep transaction records',
                'Repayment expected within 7 days',
                'Platform tracks repayment status only'
            ],
            reminder: 'All money transfers happen off-platform between users directly'
        };
    }

    async scheduleRepaymentReminders(dueDate) {
        // Schedule reminders for days 3, 5, and 7 before due date
        const reminderDays = [3, 5, 7];
        
        reminderDays.forEach(daysBefore => {
            const reminderDate = new Date(dueDate);
            reminderDate.setDate(reminderDate.getDate() - daysBefore);
            
            console.log(`Scheduled reminder for ${daysBefore} days before due date: ${reminderDate}`);
            // In production: Implement actual scheduling system
        });
    }

    async activateLoanMonitoring() {
        console.log('Activated loan monitoring for ledger:', this.ledgerEntry.id);
        // In production: Set up interval checks for overdue status
    }

    async finalPreApprovalChecks() {
        // Final checks before approval
        const checks = [
            await this.validateHierarchy(),
            await this.validateLenderSubscription(),
            await this.checkBlacklist(),
            this.validateLoanAmount()
        ];
        
        return checks.every(check => check === true);
    }

    // Public API methods
    getCurrentState() {
        return {
            state: this.currentState,
            loanData: this.loanData,
            ledgerEntry: this.ledgerEntry
        };
    }

    reset() {
        this.currentState = this.states.IDLE;
        this.loanData = null;
        this.ledgerEntry = null;
        this.country = null;
        this.group = null;
        this.lender = null;
        this.borrower = null;
    }
}

// Export singleton instance
const loanFlow = new LoanFlow();
export default loanFlow;