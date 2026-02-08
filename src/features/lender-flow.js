/**
 * M-Pesewa Lender Flow Orchestrator
 * Full lender workflow: lending cart → history → portfolio updates
 * Enforces subscription limits, group restrictions, and lending rules
 */

class LenderFlow {
    constructor() {
        this.currentState = 'IDLE';
        this.states = {
            IDLE: 'IDLE',
            PROFILE_SETUP: 'PROFILE_SETUP',
            SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
            ACTIVE: 'ACTIVE',
            BROWSING_REQUESTS: 'BROWSING_REQUESTS',
            REVIEWING_REQUEST: 'REVIEWING_REQUEST',
            MAKING_OFFER: 'MAKING_OFFER',
            OFFER_PENDING: 'OFFER_PENDING',
            LOAN_APPROVED: 'LOAN_APPROVED',
            DISBURSING: 'DISBURSING',
            MONITORING: 'MONITORING',
            COLLECTING: 'COLLECTING',
            DEFAULT_HANDLING: 'DEFAULT_HANDLING',
            SUSPENDED: 'SUSPENDED',
            EXPIRED: 'EXPIRED',
            RESTRICTED: 'RESTRICTED'
        };
        
        this.lenderData = null;
        this.subscription = null;
        this.currentRequest = null;
        this.currentOffer = null;
        this.activeLoans = [];
        this.portfolio = {
            totalLent: 0,
            activeLoans: 0,
            repaidLoans: 0,
            defaultedLoans: 0,
            outstandingBalance: 0,
            totalInterest: 0
        };
    }

    // MAIN LENDER FLOW METHODS

    async initializeLender(userId) {
        try {
            this.currentState = this.states.IDLE;
            
            // Load lender data
            this.lenderData = await this.getLenderData(userId);
            
            if (!this.lenderData) {
                throw new Error('Lender not found');
            }
            
            // Load subscription
            this.subscription = await this.getLenderSubscription(userId);
            
            if (!this.subscription || this.subscription.status !== 'ACTIVE') {
                this.currentState = this.states.SUBSCRIPTION_REQUIRED;
                return {
                    success: false,
                    state: this.currentState,
                    message: 'Active subscription required',
                    subscriptionRequired: true,
                    subscriptionOptions: this.getSubscriptionOptions()
                };
            }
            
            // Check subscription expiry
            const expiryCheck = this.checkSubscriptionExpiry();
            if (expiryCheck.expired || expiryCheck.expiringSoon) {
                this.currentState = expiryCheck.expired ? this.states.EXPIRED : this.states.ACTIVE;
                return {
                    success: true,
                    state: this.currentState,
                    warning: expiryCheck.message,
                    subscription: this.subscription
                };
            }
            
            // Load portfolio
            await this.loadPortfolio(userId);
            
            // Load active loans
            this.activeLoans = await this.getActiveLoans(userId);
            
            this.currentState = this.states.ACTIVE;
            
            return {
                success: true,
                state: this.currentState,
                lender: this.getPublicLenderData(),
                subscription: this.subscription,
                portfolio: this.portfolio,
                activeLoans: this.activeLoans.length,
                canLend: await this.canLendNow(),
                message: 'Lender initialized successfully'
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

    async browseLoanRequests(filters = {}) {
        try {
            if (!['ACTIVE', 'BROWSING_REQUESTS'].includes(this.currentState)) {
                throw new Error('Cannot browse requests in current state');
            }
            
            this.currentState = this.states.BROWSING_REQUESTS;
            
            // Get loan requests from lender's groups
            const loanRequests = await this.getGroupLoanRequests(filters);
            
            // Filter by lender preferences
            const filteredRequests = this.filterByPreferences(loanRequests);
            
            // Sort by priority (rating, urgency, etc.)
            const sortedRequests = this.sortRequestsByPriority(filteredRequests);
            
            return {
                success: true,
                state: this.currentState,
                requests: sortedRequests,
                total: sortedRequests.length,
                filtersApplied: filters,
                message: `Found ${sortedRequests.length} loan requests`
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

    async reviewLoanRequest(requestId) {
        try {
            if (!['ACTIVE', 'BROWSING_REQUESTS'].includes(this.currentState)) {
                throw new Error('Cannot review request in current state');
            }
            
            // Get loan request
            this.currentRequest = await this.getLoanRequest(requestId);
            
            if (!this.currentRequest) {
                throw new Error('Loan request not found');
            }
            
            // Check if lender can lend to this request
            const canLendCheck = await this.canLendToRequest(this.currentRequest);
            if (!canLendCheck.allowed) {
                throw new Error(canLendCheck.message);
            }
            
            this.currentState = this.states.REVIEWING_REQUEST;
            
            // Get borrower details
            const borrowerDetails = await this.getBorrowerDetails(this.currentRequest.borrowerId);
            
            // Calculate risk assessment
            const riskAssessment = await this.assessRisk(this.currentRequest, borrowerDetails);
            
            return {
                success: true,
                state: this.currentState,
                request: this.currentRequest,
                borrower: borrowerDetails,
                riskAssessment: riskAssessment,
                lendingLimit: await this.getAvailableLendingLimit(),
                message: 'Loan request loaded for review'
            };
            
        } catch (error) {
            this.currentState = this.states.BROWSING_REQUESTS;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async makeLoanOffer(offerData) {
        try {
            if (this.currentState !== this.states.REVIEWING_REQUEST) {
                throw new Error('No request being reviewed');
            }
            
            if (!this.currentRequest) {
                throw new Error('No loan request selected');
            }
            
            // Validate offer data
            const validation = this.validateLoanOffer(offerData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Check lending limit
            const limitCheck = await this.checkLendingLimit(offerData.amount);
            if (!limitCheck.withinLimit) {
                throw new Error(limitCheck.message);
            }
            
            // Create loan offer
            this.currentOffer = await this.createLoanOffer(offerData);
            
            this.currentState = this.states.OFFER_PENDING;
            
            // Notify borrower
            await this.notifyBorrowerOfOffer(this.currentRequest.borrowerId, this.currentOffer);
            
            // Reserve lending amount
            await this.reserveLendingAmount(offerData.amount);
            
            return {
                success: true,
                state: this.currentState,
                offer: this.currentOffer,
                requestId: this.currentRequest.id,
                borrowerId: this.currentRequest.borrowerId,
                expiry: this.currentOffer.expiry,
                message: 'Loan offer submitted successfully'
            };
            
        } catch (error) {
            this.currentState = this.states.REVIEWING_REQUEST;
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async acceptLoanAcceptance(acceptanceData) {
        try {
            if (this.currentState !== this.states.OFFER_PENDING) {
                throw new Error('No pending offer to accept');
            }
            
            if (!this.currentOffer) {
                throw new Error('No active offer found');
            }
            
            // Check if offer was accepted by borrower
            const offerStatus = await this.getOfferStatus(this.currentOffer.id);
            if (offerStatus !== 'ACCEPTED') {
                throw new Error('Offer not accepted by borrower');
            }
            
            // Create loan agreement
            const loanAgreement = await this.createLoanAgreement(this.currentOffer, acceptanceData);
            
            // Generate ledger entry
            const ledgerEntry = await this.createLedgerEntry(loanAgreement);
            
            this.currentState = this.states.LOAN_APPROVED;
            
            // Update portfolio
            await this.updatePortfolioOnApproval(loanAgreement);
            
            // Prepare disbursement
            const disbursementInstructions = this.generateDisbursementInstructions(loanAgreement);
            
            return {
                success: true,
                state: this.currentState,
                loan: loanAgreement,
                ledger: ledgerEntry,
                disbursement: disbursementInstructions,
                nextSteps: 'Disburse funds and update ledger',
                message: 'Loan approved. Ready for disbursement.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async disburseLoan(disbursementData) {
        try {
            if (this.currentState !== this.states.LOAN_APPROVED) {
                throw new Error('No approved loan to disburse');
            }
            
            // Record disbursement
            await this.recordLoanDisbursement(disbursementData);
            
            // Update loan status
            await this.updateLoanStatus('DISBURSED', disbursementData);
            
            // Start monitoring
            await this.startLoanMonitoring();
            
            this.currentState = this.states.MONITORING;
            
            // Update portfolio
            await this.updatePortfolioOnDisbursement();
            
            return {
                success: true,
                state: this.currentState,
                disbursement: disbursementData,
                monitoringStarted: true,
                repaymentSchedule: this.generateRepaymentSchedule(),
                message: 'Loan disbursed. Monitoring active.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async recordRepayment(repaymentData) {
        try {
            if (!['MONITORING', 'COLLECTING'].includes(this.currentState)) {
                throw new Error('Cannot record repayment in current state');
            }
            
            // Validate repayment
            const validation = this.validateRepayment(repaymentData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Record repayment
            const repaymentRecord = await this.createRepaymentRecord(repaymentData);
            
            // Update loan balance
            const updatedLoan = await this.updateLoanBalance(repaymentData);
            
            // Update portfolio
            await this.updatePortfolioOnRepayment(repaymentData.amount);
            
            // Check if loan is fully repaid
            if (updatedLoan.outstandingBalance <= 0) {
                await this.completeLoan(updatedLoan);
                this.currentState = this.states.ACTIVE;
                
                // Rate borrower
                await this.rateBorrower(repaymentData.rating);
                
                return {
                    success: true,
                    state: this.currentState,
                    loanCleared: true,
                    ratingSubmitted: true,
                    message: 'Loan fully repaid. Borrower rated.'
                };
            }
            
            this.currentState = this.states.MONITORING;
            
            return {
                success: true,
                state: this.currentState,
                repayment: repaymentRecord,
                remainingBalance: updatedLoan.outstandingBalance,
                nextDueDate: this.getNextDueDate(),
                message: 'Repayment recorded successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async handleOverdueLoan(loanId) {
        try {
            const loan = await this.getLoan(loanId);
            
            if (!loan) {
                throw new Error('Loan not found');
            }
            
            // Check if loan is overdue
            const overdueCheck = await this.checkLoanOverdue(loan);
            if (!overdueCheck.overdue) {
                return {
                    overdue: false,
                    message: 'Loan is not overdue'
                };
            }
            
            this.currentState = this.states.COLLECTING;
            
            // Apply penalties if overdue > 7 days
            if (overdueCheck.daysOverdue > 7) {
                await this.applyPenalties(loan, overdueCheck.daysOverdue);
            }
            
            // Send reminders
            await this.sendOverdueReminders(loan, overdueCheck.daysOverdue);
            
            // If > 60 days, initiate default process
            if (overdueCheck.daysOverdue >= 60) {
                await this.initiateDefaultProcess(loan);
                this.currentState = this.states.DEFAULT_HANDLING;
            }
            
            return {
                success: true,
                state: this.currentState,
                loan: loan,
                overdue: true,
                daysOverdue: overdueCheck.daysOverdue,
                actionsTaken: this.getOverdueActions(overdueCheck.daysOverdue),
                message: `Loan overdue by ${overdueCheck.daysOverdue} days`
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async blacklistBorrower(blacklistData) {
        try {
            // Validate blacklist data
            const validation = this.validateBlacklistData(blacklistData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Check if borrower is already blacklisted
            const existing = await this.checkExistingBlacklist(blacklistData.borrowerId);
            if (existing) {
                return {
                    success: false,
                    message: 'Borrower already blacklisted'
                };
            }
            
            // Add to blacklist
            const blacklistResult = await this.addBorrowerToBlacklist(blacklistData);
            
            // Update loan status
            await this.updateLoanBlacklistStatus(blacklistData.loanId);
            
            // Notify borrower
            await this.notifyBorrowerOfBlacklisting(blacklistData.borrowerId, blacklistData);
            
            return {
                success: true,
                state: this.currentState,
                blacklistEntry: blacklistResult,
                restrictionsApplied: true,
                message: 'Borrower added to blacklist'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updatePortfolio() {
        try {
            await this.loadPortfolio(this.lenderData.userId);
            
            return {
                success: true,
                portfolio: this.portfolio,
                performance: this.calculatePerformance(),
                riskMetrics: this.calculateRiskMetrics(),
                message: 'Portfolio updated successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async generateReport(reportType, period) {
        try {
            let report;
            
            switch (reportType) {
                case 'LENDING_ACTIVITY':
                    report = await this.generateLendingActivityReport(period);
                    break;
                    
                case 'REPAYMENT_PERFORMANCE':
                    report = await this.generateRepaymentPerformanceReport(period);
                    break;
                    
                case 'RISK_ANALYSIS':
                    report = await this.generateRiskAnalysisReport();
                    break;
                    
                case 'TAX_SUMMARY':
                    report = await this.generateTaxSummary(period);
                    break;
                    
                default:
                    throw new Error('Invalid report type');
            }
            
            return {
                success: true,
                reportType: reportType,
                period: period,
                data: report,
                generatedAt: new Date().toISOString(),
                message: 'Report generated successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // HELPER METHODS

    async getLenderData(userId) {
        const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
        let lender = lenders.find(l => l.userId === userId);
        
        if (!lender) {
            // Try general users
            const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
            const user = users.find(u => u.userId === userId);
            
            if (user) {
                // Create lender entry
                lender = {
                    userId: user.userId,
                    fullName: user.fullName,
                    brandName: user.brandName,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    nationalId: user.nationalId,
                    country: user.country,
                    groupId: user.groupId,
                    lendingCategories: user.lendingCategories || ['ALL'],
                    subscription: user.subscription,
                    totalLent: 0,
                    activeLedgers: 0,
                    totalInterest: 0,
                    rating: 5.0,
                    createdAt: new Date().toISOString()
                };
                
                lenders.push(lender);
                localStorage.setItem('mpesewa_lenders', JSON.stringify(lenders));
            }
        }
        
        return lender;
    }

    async getLenderSubscription(userId) {
        const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '[]');
        return subscriptions.find(sub => 
            sub.userId === userId && 
            sub.status === 'ACTIVE'
        );
    }

    checkSubscriptionExpiry() {
        if (!this.subscription) {
            return {
                expired: true,
                expiringSoon: false,
                message: 'No active subscription'
            };
        }
        
        const now = new Date();
        const expiryDate = new Date(this.subscription.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        if (now > expiryDate) {
            return {
                expired: true,
                expiringSoon: false,
                message: 'Subscription expired'
            };
        }
        
        if (daysUntilExpiry <= 7) {
            return {
                expired: false,
                expiringSoon: true,
                message: `Subscription expires in ${daysUntilExpiry} days`
            };
        }
        
        return {
            expired: false,
            expiringSoon: false,
            message: 'Subscription active'
        };
    }

    getSubscriptionOptions() {
        return {
            tiers: [
                {
                    id: 'BASIC',
                    name: 'Basic',
                    weeklyLimit: 1500,
                    monthlyPrice: 50
                },
                {
                    id: 'PREMIUM',
                    name: 'Premium',
                    weeklyLimit: 5000,
                    monthlyPrice: 250
                },
                {
                    id: 'SUPER',
                    name: 'Super',
                    weeklyLimit: 20000,
                    monthlyPrice: 1000
                },
                {
                    id: 'LENDER_OF_LENDERS',
                    name: 'Lender of Lenders',
                    weeklyLimit: 50000,
                    monthlyPrice: 500
                }
            ],
            note: 'All subscriptions expire on the 28th of each month'
        };
    }

    async loadPortfolio(userId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const lenderLoans = loans.filter(loan => loan.lenderId === userId);
        
        this.portfolio = {
            totalLent: lenderLoans.reduce((sum, loan) => sum + loan.amount, 0),
            activeLoans: lenderLoans.filter(loan => 
                ['APPROVED', 'DISBURSED', 'ACTIVE', 'OVERDUE'].includes(loan.status)
            ).length,
            repaidLoans: lenderLoans.filter(loan => loan.status === 'CLEARED').length,
            defaultedLoans: lenderLoans.filter(loan => loan.status === 'DEFAULTED').length,
            outstandingBalance: lenderLoans
                .filter(loan => ['ACTIVE', 'OVERDUE', 'DEFAULTED'].includes(loan.status))
                .reduce((sum, loan) => sum + (loan.outstandingBalance || 0), 0),
            totalInterest: lenderLoans
                .filter(loan => loan.status === 'CLEARED')
                .reduce((sum, loan) => sum + (loan.interest || 0), 0)
        };
    }

    async getActiveLoans(userId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        return loans.filter(loan => 
            loan.lenderId === userId && 
            ['APPROVED', 'DISBURSED', 'ACTIVE', 'OVERDUE'].includes(loan.status)
        );
    }

    getPublicLenderData() {
        if (!this.lenderData) return null;
        
        return {
            userId: this.lenderData.userId,
            name: this.lenderData.brandName || this.lenderData.fullName,
            rating: this.lenderData.rating || 5.0,
            country: this.lenderData.country,
            totalLent: this.lenderData.totalLent || 0,
            activeLedgers: this.lenderData.activeLedgers || 0,
            memberSince: this.lenderData.createdAt?.split('T')[0] || 'N/A',
            categories: this.lenderData.lendingCategories || ['ALL']
        };
    }

    async canLendNow() {
        // Check subscription
        if (!this.subscription || this.subscription.status !== 'ACTIVE') {
            return {
                canLend: false,
                reason: 'NO_ACTIVE_SUBSCRIPTION',
                message: 'Active subscription required'
            };
        }
        
        // Check expiry
        const expiryCheck = this.checkSubscriptionExpiry();
        if (expiryCheck.expired) {
            return {
                canLend: false,
                reason: 'SUBSCRIPTION_EXPIRED',
                message: 'Subscription expired'
            };
        }
        
        // Check weekly limit
        const weeklyUsed = await this.getWeeklyLentAmount();
        const weeklyLimit = this.subscription.weeklyLimit || 0;
        
        if (weeklyUsed >= weeklyLimit) {
            return {
                canLend: false,
                reason: 'WEEKLY_LIMIT_REACHED',
                message: `Weekly lending limit reached (${weeklyLimit})`
            };
        }
        
        return {
            canLend: true,
            weeklyUsed: weeklyUsed,
            weeklyLimit: weeklyLimit,
            remaining: weeklyLimit - weeklyUsed,
            message: 'Can lend now'
        };
    }

    async getWeeklyLentAmount() {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        
        return loans
            .filter(loan => 
                loan.lenderId === this.lenderData.userId && 
                new Date(loan.disbursementDate || loan.approvedAt) > oneWeekAgo
            )
            .reduce((sum, loan) => sum + loan.amount, 0);
    }

    async getGroupLoanRequests(filters = {}) {
        // Get lender's groups
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        const lenderGroups = userGroups.filter(ug => 
            ug.userId === this.lenderData.userId && 
            ug.status === 'ACTIVE'
        );
        
        const groupIds = lenderGroups.map(g => g.groupId);
        
        // Get loan requests from these groups
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        
        return loanRequests.filter(request => 
            groupIds.includes(request.groupId) && 
            request.status === 'PENDING' &&
            (!filters.category || request.category === filters.category) &&
            (!filters.minAmount || request.amount >= filters.minAmount) &&
            (!filters.maxAmount || request.amount <= filters.maxAmount)
        );
    }

    filterByPreferences(requests) {
        const preferences = this.lenderData.lendingCategories || ['ALL'];
        
        if (preferences.includes('ALL')) {
            return requests;
        }
        
        return requests.filter(request => 
            preferences.includes(request.category)
        );
    }

    sortRequestsByPriority(requests) {
        return requests.sort((a, b) => {
            // Higher rating first
            if (a.borrowerRating !== b.borrowerRating) {
                return b.borrowerRating - a.borrowerRating;
            }
            
            // Smaller amounts first (lower risk)
            if (a.amount !== b.amount) {
                return a.amount - b.amount;
            }
            
            // Older requests first
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
    }

    async getLoanRequest(requestId) {
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        return loanRequests.find(request => request.id === requestId);
    }

    async canLendToRequest(loanRequest) {
        // Check if lender is in same group
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        const isInGroup = userGroups.some(ug => 
            ug.userId === this.lenderData.userId && 
            ug.groupId === loanRequest.groupId &&
            ug.status === 'ACTIVE'
        );
        
        if (!isInGroup) {
            return {
                allowed: false,
                reason: 'NOT_IN_GROUP',
                message: 'Lender is not in the same group as borrower'
            };
        }
        
        // Check lending categories
        const categories = this.lenderData.lendingCategories || ['ALL'];
        if (!categories.includes('ALL') && !categories.includes(loanRequest.category)) {
            return {
                allowed: false,
                reason: 'CATEGORY_NOT_SUPPORTED',
                message: 'Lender does not support this loan category'
            };
        }
        
        // Check weekly limit
        const weeklyUsed = await this.getWeeklyLentAmount();
        const weeklyLimit = this.subscription.weeklyLimit || 0;
        
        if (weeklyUsed + loanRequest.amount > weeklyLimit) {
            return {
                allowed: false,
                reason: 'WEEKLY_LIMIT_EXCEEDED',
                message: `Would exceed weekly limit (${weeklyUsed + loanRequest.amount} > ${weeklyLimit})`
            };
        }
        
        return {
            allowed: true,
            message: 'Can lend to this request'
        };
    }

    async getBorrowerDetails(borrowerId) {
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        const borrower = borrowers.find(b => b.userId === borrowerId);
        
        if (!borrower) {
            return {
                userId: borrowerId,
                rating: 5.0,
                repaymentRate: '100%',
                activeLoans: 0
            };
        }
        
        return {
            userId: borrower.userId,
            fullName: borrower.fullName,
            rating: borrower.rating || 5.0,
            repaymentRate: borrower.repaymentRate || '100%',
            activeLoans: borrower.activeLoans || 0,
            totalBorrowed: borrower.totalBorrowed || 0,
            blacklisted: borrower.blacklisted || false
        };
    }

    async assessRisk(loanRequest, borrowerDetails) {
        const riskFactors = [];
        let riskScore = 0;
        let maxScore = 0;
        
        // Rating factor (20%)
        maxScore += 20;
        if (borrowerDetails.rating >= 4.5) {
            riskScore += 20;
        } else if (borrowerDetails.rating >= 4.0) {
            riskScore += 15;
            riskFactors.push('Good rating (4.0+)');
        } else if (borrowerDetails.rating >= 3.0) {
            riskScore += 10;
            riskFactors.push('Average rating (3.0-4.0)');
        } else {
            riskScore += 5;
            riskFactors.push('Low rating (< 3.0) - HIGH RISK');
        }
        
        // Repayment rate factor (30%)
        maxScore += 30;
        const repaymentRate = parseFloat(borrowerDetails.repaymentRate) || 100;
        if (repaymentRate >= 95) {
            riskScore += 30;
        } else if (repaymentRate >= 90) {
            riskScore += 20;
            riskFactors.push(`Good repayment rate (${repaymentRate}%)`);
        } else if (repaymentRate >= 80) {
            riskScore += 15;
            riskFactors.push(`Average repayment rate (${repaymentRate}%)`);
        } else {
            riskScore += 5;
            riskFactors.push(`Low repayment rate (${repaymentRate}%) - HIGH RISK`);
        }
        
        // Loan amount factor (20%)
        maxScore += 20;
        const amount = loanRequest.amount;
        const tierLimit = this.subscription.weeklyLimit || 0;
        const amountPercentage = (amount / tierLimit) * 100;
        
        if (amountPercentage <= 10) {
            riskScore += 20;
        } else if (amountPercentage <= 25) {
            riskScore += 15;
            riskFactors.push('Small loan amount (10-25% of limit)');
        } else if (amountPercentage <= 50) {
            riskScore += 10;
            riskFactors.push('Medium loan amount (25-50% of limit)');
        } else {
            riskScore += 5;
            riskFactors.push('Large loan amount (>50% of limit) - HIGHER RISK');
        }
        
        // Active loans factor (15%)
        maxScore += 15;
        if (borrowerDetails.activeLoans === 0) {
            riskScore += 15;
        } else if (borrowerDetails.activeLoans === 1) {
            riskScore += 10;
            riskFactors.push('Has one active loan');
        } else {
            riskScore += 5;
            riskFactors.push('Has multiple active loans - HIGHER RISK');
        }
        
        // Category factor (15%)
        maxScore += 15;
        const emergencyCategories = ['MEDICINE', 'SCHOOL_FEES', 'FOOD', 'TRANSPORT_FARE'];
        const discretionaryCategories = ['TV_SUBSCRIPTION', 'CREDO', 'HAWKER_LOAN'];
        
        if (emergencyCategories.includes(loanRequest.category)) {
            riskScore += 15; // Emergency needs are lower risk
        } else if (discretionaryCategories.includes(loanRequest.category)) {
            riskScore += 10;
            riskFactors.push('Discretionary spending category');
        } else {
            riskScore += 12;
            riskFactors.push('Standard loan category');
        }
        
        // Calculate final score
        const finalScore = (riskScore / maxScore) * 100;
        
        return {
            score: Math.round(finalScore),
            level: this.getRiskLevel(finalScore),
            factors: riskFactors,
            recommendation: this.getRiskRecommendation(finalScore, amount),
            details: {
                borrowerRating: borrowerDetails.rating,
                repaymentRate: borrowerDetails.repaymentRate,
                activeLoans: borrowerDetails.activeLoans,
                loanAmount: amount,
                category: loanRequest.category
            }
        };
    }

    getRiskLevel(score) {
        if (score >= 80) return 'LOW';
        if (score >= 60) return 'MODERATE';
        if (score >= 40) return 'MEDIUM';
        return 'HIGH';
    }

    getRiskRecommendation(score, amount) {
        if (score >= 80) {
            return `STRONGLY RECOMMEND - Low risk borrower for ${amount}`;
        } else if (score >= 60) {
            return `RECOMMEND - Moderate risk, consider ${amount * 0.8} instead`;
        } else if (score >= 40) {
            return `CAUTION - Medium risk, consider ${amount * 0.5} with stricter terms`;
        } else {
            return `AVOID - High risk, not recommended`;
        }
    }

    async getAvailableLendingLimit() {
        const weeklyUsed = await this.getWeeklyLentAmount();
        const weeklyLimit = this.subscription.weeklyLimit || 0;
        
        return {
            used: weeklyUsed,
            limit: weeklyLimit,
            available: Math.max(0, weeklyLimit - weeklyUsed),
            percentageUsed: weeklyLimit > 0 ? (weeklyUsed / weeklyLimit) * 100 : 0
        };
    }

    validateLoanOffer(offerData) {
        const requiredFields = ['amount', 'interestRate', 'terms'];
        
        for (const field of requiredFields) {
            if (!offerData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        // Validate interest rate (10% default, up to 20% for special cases)
        if (offerData.interestRate < 0.10 || offerData.interestRate > 0.20) {
            return {
                valid: false,
                message: 'Interest rate must be between 10% and 20%'
            };
        }
        
        // Validate amount is positive
        if (offerData.amount <= 0) {
            return {
                valid: false,
                message: 'Amount must be greater than 0'
            };
        }
        
        return {
            valid: true,
            message: 'Loan offer validated'
        };
    }

    async checkLendingLimit(amount) {
        const limitCheck = await this.getAvailableLendingLimit();
        
        if (amount > limitCheck.available) {
            return {
                withinLimit: false,
                message: `Amount ${amount} exceeds available limit ${limitCheck.available}`
            };
        }
        
        return {
            withinLimit: true,
            available: limitCheck.available,
            message: 'Within lending limit'
        };
    }

    async createLoanOffer(offerData) {
        const offerId = 'OFFER-' + Date.now();
        
        const offer = {
            id: offerId,
            requestId: this.currentRequest.id,
            lenderId: this.lenderData.userId,
            lenderName: this.lenderData.brandName || this.lenderData.fullName,
            ...offerData,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            conditions: offerData.conditions || [
                '7-day repayment period',
                '10% interest rate',
                'Partial repayments allowed',
                '5% daily penalty after 7 days'
            ]
        };
        
        // Store offer
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        const requestIndex = loanRequests.findIndex(r => r.id === this.currentRequest.id);
        
        if (requestIndex !== -1) {
            loanRequests[requestIndex].offers = loanRequests[requestIndex].offers || [];
            loanRequests[requestIndex].offers.push(offer);
            localStorage.setItem('mpesewa_loan_requests', JSON.stringify(loanRequests));
        }
        
        return offer;
    }

    async notifyBorrowerOfOffer(borrowerId, offer) {
        const notification = {
            userId: borrowerId,
            type: 'LOAN_OFFER_RECEIVED',
            title: 'New Loan Offer!',
            message: `${offer.lenderName} has offered you ${offer.amount} at ${offer.interestRate * 100}% interest`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                offerId: offer.id,
                lenderId: offer.lenderId,
                amount: offer.amount,
                interestRate: offer.interestRate
            },
            actionUrl: `/borrower/offers/view.html?id=${offer.id}`
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async reserveLendingAmount(amount) {
        // In production, this would reserve the amount
        console.log(`Reserved ${amount} for pending offer`);
    }

    async getOfferStatus(offerId) {
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        
        for (const request of loanRequests) {
            const offer = request.offers?.find(o => o.id === offerId);
            if (offer) {
                return offer.status;
            }
        }
        
        return 'UNKNOWN';
    }

    async createLoanAgreement(offer, acceptanceData) {
        const loanId = 'LOAN-' + Date.now();
        
        const loan = {
            id: loanId,
            borrowerId: this.currentRequest.borrowerId,
            lenderId: this.lenderData.userId,
            requestId: this.currentRequest.id,
            offerId: offer.id,
            amount: offer.amount,
            interestRate: offer.interestRate,
            interest: offer.amount * offer.interestRate,
            totalDue: offer.amount * (1 + offer.interestRate),
            category: this.currentRequest.category,
            groupId: this.currentRequest.groupId,
            country: this.lenderData.country,
            status: 'APPROVED',
            disbursementMethod: acceptanceData.disbursementMethod,
            createdAt: new Date().toISOString(),
            approvedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            outstandingBalance: offer.amount * (1 + offer.interestRate),
            repayments: [],
            guarantors: acceptanceData.guarantors || [],
            terms: offer.terms
        };
        
        // Store loan
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        loans.push(loan);
        localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
        
        // Update offer status
        await this.updateOfferStatus(offer.id, 'ACCEPTED');
        
        // Update request status
        await this.updateRequestStatus(this.currentRequest.id, 'ACCEPTED');
        
        return loan;
    }

    async updateOfferStatus(offerId, status) {
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        
        for (const request of loanRequests) {
            const offerIndex = request.offers?.findIndex(o => o.id === offerId);
            if (offerIndex !== -1 && offerIndex !== undefined) {
                request.offers[offerIndex].status = status;
                request.offers[offerIndex].updatedAt = new Date().toISOString();
                break;
            }
        }
        
        localStorage.setItem('mpesewa_loan_requests', JSON.stringify(loanRequests));
    }

    async updateRequestStatus(requestId, status) {
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        const requestIndex = loanRequests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            loanRequests[requestIndex].status = status;
            loanRequests[requestIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mpesewa_loan_requests', JSON.stringify(loanRequests));
        }
    }

    async createLedgerEntry(loan) {
        const ledgerId = 'LEDGER-' + Date.now();
        
        const ledger = {
            id: ledgerId,
            loanId: loan.id,
            borrowerId: loan.borrowerId,
            lenderId: loan.lenderId,
            groupId: loan.groupId,
            country: loan.country,
            category: loan.category,
            amount: loan.amount,
            interest: loan.interest,
            disbursementDate: null, // Will be set on disbursement
            dueDate: loan.dueDate,
            status: 'APPROVED',
            outstandingBalance: loan.outstandingBalance,
            repayments: [],
            guarantors: loan.guarantors,
            createdAt: new Date().toISOString()
        };
        
        // Store ledger
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        ledgers.push(ledger);
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        
        // Update lender's ledger count
        await this.updateLenderLedgerCount();
        
        return ledger;
    }

    async updateLenderLedgerCount() {
        const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
        const lenderIndex = lenders.findIndex(l => l.userId === this.lenderData.userId);
        
        if (lenderIndex !== -1) {
            lenders[lenderIndex].activeLedgers = (lenders[lenderIndex].activeLedgers || 0) + 1;
            lenders[lenderIndex].totalLent = (lenders[lenderIndex].totalLent || 0) + this.currentOffer.amount;
            lenders[lenderIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_lenders', JSON.stringify(lenders));
        }
    }

    async updatePortfolioOnApproval(loan) {
        this.portfolio.totalLent += loan.amount;
        this.portfolio.activeLoans += 1;
        this.portfolio.outstandingBalance += loan.totalDue;
    }

    generateDisbursementInstructions(loan) {
        return {
            title: 'Disbursement Instructions',
            steps: [
                'Contact borrower to confirm disbursement method',
                'Transfer funds via agreed method (M-Pesa, bank transfer, cash)',
                'Obtain confirmation of receipt from borrower',
                'Record disbursement in the system',
                'Repayment period starts from disbursement date'
            ],
            important: [
                'Keep all transaction records',
                'Confirm borrower identity',
                'Document any agreements outside platform',
                'Update ledger after disbursement'
            ],
            contact: {
                borrowerId: loan.borrowerId,
                lenderId: loan.lenderId,
                loanId: loan.id
            }
        };
    }

    async recordLoanDisbursement(disbursementData) {
        const disbursements = JSON.parse(localStorage.getItem('mpesewa_disbursements') || '[]');
        
        disbursements.push({
            loanId: this.currentOffer?.requestId ? `LOAN-FOR-${this.currentOffer.requestId}` : 'UNKNOWN',
            lenderId: this.lenderData.userId,
            borrowerId: this.currentRequest?.borrowerId,
            ...disbursementData,
            disbursedAt: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_disbursements', JSON.stringify(disbursements));
    }

    async updateLoanStatus(status, disbursementData) {
        // Find the loan created from this offer
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loanIndex = loans.findIndex(l => 
            l.offerId === this.currentOffer?.id || 
            l.lenderId === this.lenderData.userId
        );
        
        if (loanIndex !== -1) {
            loans[loanIndex].status = status;
            loans[loanIndex].lastUpdated = new Date().toISOString();
            
            if (status === 'DISBURSED' && disbursementData) {
                loans[loanIndex].disbursedAt = new Date().toISOString();
                loans[loanIndex].disbursementMethod = disbursementData.method;
                loans[loanIndex].disbursementReference = disbursementData.reference;
            }
            
            localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
        }
        
        // Update ledger
        await this.updateLedgerStatus(status, disbursementData);
    }

    async updateLedgerStatus(status, disbursementData) {
        const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
        const ledgerIndex = ledgers.findIndex(l => 
            l.lenderId === this.lenderData.userId && 
            l.status === 'APPROVED'
        );
        
        if (ledgerIndex !== -1) {
            ledgers[ledgerIndex].status = status;
            ledgers[ledgerIndex].lastUpdated = new Date().toISOString();
            
            if (status === 'DISBURSED' && disbursementData) {
                ledgers[ledgerIndex].disbursementDate = new Date().toISOString();
                ledgers[ledgerIndex].disbursementMethod = disbursementData.method;
                ledgers[ledgerIndex].disbursementReference = disbursementData.reference;
            }
            
            localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        }
    }

    async startLoanMonitoring() {
        console.log(`Started monitoring for loan from offer ${this.currentOffer?.id}`);
        // In production: Set up monitoring intervals
    }

    generateRepaymentSchedule() {
        if (!this.currentOffer) return null;
        
        const amount = this.currentOffer.amount;
        const interest = amount * this.currentOffer.interestRate;
        const totalDue = amount + interest;
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

    async updatePortfolioOnDisbursement() {
        // Portfolio already updated on approval
        console.log('Portfolio updated for disbursement');
    }

    validateRepayment(repaymentData) {
        const requiredFields = ['loanId', 'amount', 'method', 'reference'];
        
        for (const field of requiredFields) {
            if (!repaymentData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        if (repaymentData.amount <= 0) {
            return {
                valid: false,
                message: 'Amount must be greater than 0'
            };
        }
        
        return {
            valid: true,
            message: 'Repayment validated'
        };
    }

    async createRepaymentRecord(repaymentData) {
        const repaymentId = 'REPAY-' + Date.now();
        const repayment = {
            id: repaymentId,
            ...repaymentData,
            recordedAt: new Date().toISOString(),
            recordedBy: this.lenderData.userId,
            status: 'RECORDED'
        };
        
        // Store repayment
        const repayments = JSON.parse(localStorage.getItem('mpesewa_repayments') || '[]');
        repayments.push(repayment);
        localStorage.setItem('mpesewa_repayments', JSON.stringify(repayments));
        
        return repayment;
    }

    async updateLoanBalance(repaymentData) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loanIndex = loans.findIndex(l => l.id === repaymentData.loanId);
        
        if (loanIndex !== -1) {
            loans[loanIndex].outstandingBalance -= repaymentData.amount;
            loans[loanIndex].repayments = loans[loanIndex].repayments || [];
            loans[loanIndex].repayments.push({
                amount: repaymentData.amount,
                date: new Date().toISOString(),
                method: repaymentData.method,
                reference: repaymentData.reference
            });
            loans[loanIndex].lastRepaymentDate = new Date().toISOString();
            loans[loanIndex].lastUpdated = new Date().toISOString();
            
            localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
            
            return loans[loanIndex];
        }
        
        return null;
    }

    async updatePortfolioOnRepayment(amount) {
        this.portfolio.outstandingBalance -= amount;
    }

    async completeLoan(loan) {
        // Update loan status
        await this.updateLoanStatus('CLEARED', {});
        
        // Update portfolio
        this.portfolio.activeLoans -= 1;
        this.portfolio.repaidLoans += 1;
        this.portfolio.totalInterest += loan.interest || 0;
        
        // Update lender stats
        await this.updateLenderAfterRepayment(loan);
    }

    async updateLenderAfterRepayment(loan) {
        const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
        const lenderIndex = lenders.findIndex(l => l.userId === this.lenderData.userId);
        
        if (lenderIndex !== -1) {
            lenders[lenderIndex].activeLedgers = Math.max(0, (lenders[lenderIndex].activeLedgers || 1) - 1);
            lenders[lenderIndex].totalInterest = (lenders[lenderIndex].totalInterest || 0) + (loan.interest || 0);
            lenders[lenderIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_lenders', JSON.stringify(lenders));
        }
    }

    async rateBorrower(rating) {
        if (!this.currentRequest?.borrowerId) return;
        
        const ratingId = 'RATING-' + Date.now();
        const ratingRecord = {
            id: ratingId,
            raterId: this.lenderData.userId,
            rateeId: this.currentRequest.borrowerId,
            loanId: this.currentOffer?.requestId ? `LOAN-FOR-${this.currentOffer.requestId}` : 'UNKNOWN',
            rating: rating,
            comment: 'Timely repayment',
            createdAt: new Date().toISOString()
        };
        
        // Store rating
        const ratings = JSON.parse(localStorage.getItem('mpesewa_ratings') || '[]');
        ratings.push(ratingRecord);
        localStorage.setItem('mpesewa_ratings', JSON.stringify(ratings));
    }

    getNextDueDate() {
        // In production, calculate from loan data
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        return dueDate.toISOString();
    }

    async getLoan(loanId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        return loans.find(l => l.id === loanId);
    }

    async checkLoanOverdue(loan) {
        const now = new Date();
        const dueDate = new Date(loan.dueDate);
        const daysOverdue = Math.max(0, Math.floor((now - dueDate) / (1000 * 60 * 60 * 24)));
        
        return {
            overdue: daysOverdue > 0,
            daysOverdue: daysOverdue,
            dueDate: dueDate.toISOString()
        };
    }

    async applyPenalties(loan, daysOverdue) {
        const penaltyDays = daysOverdue - 7; // Penalty starts after 7 days
        const dailyPenaltyRate = 0.05; // 5%
        const penalty = loan.outstandingBalance * dailyPenaltyRate * penaltyDays;
        
        // Update loan with penalty
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loanIndex = loans.findIndex(l => l.id === loan.id);
        
        if (loanIndex !== -1) {
            loans[loanIndex].outstandingBalance += penalty;
            loans[loanIndex].penalties = loans[loanIndex].penalties || [];
            loans[loanIndex].penalties.push({
                amount: penalty,
                daysOverdue: daysOverdue,
                appliedAt: new Date().toISOString()
            });
            localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
        }
    }

    async sendOverdueReminders(loan, daysOverdue) {
        const reminderLevels = [
            { days: 1, type: 'FIRST_REMINDER' },
            { days: 3, type: 'SECOND_REMINDER' },
            { days: 7, type: 'FINAL_WARNING' },
            { days: 14, type: 'URGENT_REMINDER' },
            { days: 30, type: 'SERIOUS_WARNING' }
        ];
        
        const level = reminderLevels.find(l => l.days === daysOverdue) || 
                     reminderLevels.find(l => l.days < daysOverdue && daysOverdue < (reminderLevels[reminderLevels.indexOf(l) + 1]?.days || Infinity));
        
        if (level) {
            const notification = {
                userId: loan.borrowerId,
                type: `OVERDUE_${level.type}`,
                title: `Loan Overdue ${daysOverdue} Days`,
                message: `Your loan is ${daysOverdue} days overdue. Please make payment immediately.`,
                priority: 'HIGH',
                createdAt: new Date().toISOString(),
                data: {
                    loanId: loan.id,
                    daysOverdue: daysOverdue,
                    outstandingBalance: loan.outstandingBalance
                }
            };
            
            const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
            notifications.push(notification);
            localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
        }
    }

    getOverdueActions(daysOverdue) {
        const actions = [];
        
        if (daysOverdue >= 1) actions.push('First reminder sent');
        if (daysOverdue >= 3) actions.push('Second reminder sent');
        if (daysOverdue >= 7) actions.push('Penalties applied');
        if (daysOverdue >= 14) actions.push('Debt collector notified');
        if (daysOverdue >= 30) actions.push('Legal action initiated');
        if (daysOverdue >= 60) actions.push('Default processed');
        
        return actions;
    }

    async initiateDefaultProcess(loan) {
        // Mark loan as defaulted
        await this.updateLoanStatus('DEFAULTED', {});
        
        // Update portfolio
        this.portfolio.activeLoans -= 1;
        this.portfolio.defaultedLoans += 1;
        
        // Notify blacklist flow
        await this.notifyBlacklistFlow(loan);
    }

    async notifyBlacklistFlow(loan) {
        const blacklistData = {
            borrowerId: loan.borrowerId,
            lenderId: loan.lenderId,
            loanId: loan.id,
            groupId: loan.groupId,
            country: loan.country,
            reason: 'DEFAULTED_LOAN',
            amountOwed: loan.outstandingBalance,
            daysOverdue: 60
        };
        
        // In production, call blacklist flow
        console.log('Notifying blacklist flow:', blacklistData);
    }

    validateBlacklistData(blacklistData) {
        const requiredFields = ['borrowerId', 'loanId', 'reason', 'amountOwed'];
        
        for (const field of requiredFields) {
            if (!blacklistData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        return {
            valid: true,
            message: 'Blacklist data validated'
        };
    }

    async checkExistingBlacklist(borrowerId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        return blacklist.find(entry => 
            entry.userId === borrowerId && 
            entry.status === 'ACTIVE'
        );
    }

    async addBorrowerToBlacklist(blacklistData) {
        const entryId = 'BL-' + Date.now();
        const entry = {
            id: entryId,
            ...blacklistData,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            createdBy: this.lenderData.userId
        };
        
        // Store blacklist entry
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        blacklist.push(entry);
        localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
        
        return entry;
    }

    async updateLoanBlacklistStatus(loanId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loanIndex = loans.findIndex(l => l.id === loanId);
        
        if (loanIndex !== -1) {
            loans[loanIndex].blacklisted = true;
            loans[loanIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
        }
    }

    async notifyBorrowerOfBlacklisting(borrowerId, blacklistData) {
        const notification = {
            userId: borrowerId,
            type: 'BLACKLISTED',
            title: 'Added to Blacklist',
            message: `You have been blacklisted due to: ${blacklistData.reason}. Amount owed: ${blacklistData.amountOwed}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                reason: blacklistData.reason,
                amountOwed: blacklistData.amountOwed,
                loanId: blacklistData.loanId
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    calculatePerformance() {
        const totalLoans = this.portfolio.repaidLoans + this.portfolio.defaultedLoans;
        const repaymentRate = totalLoans > 0 ? 
            (this.portfolio.repaidLoans / totalLoans) * 100 : 100;
        
        const avgLoanSize = this.portfolio.totalLent > 0 ? 
            this.portfolio.totalLent / (this.portfolio.repaidLoans + this.portfolio.defaultedLoans + this.portfolio.activeLoans) : 0;
        
        return {
            repaymentRate: Math.round(repaymentRate),
            defaultRate: totalLoans > 0 ? 
                (this.portfolio.defaultedLoans / totalLoans) * 100 : 0,
            avgLoanSize: Math.round(avgLoanSize),
            totalInterest: this.portfolio.totalInterest,
            roi: this.portfolio.totalLent > 0 ? 
                (this.portfolio.totalInterest / this.portfolio.totalLent) * 100 : 0
        };
    }

    calculateRiskMetrics() {
        const concentrationRisk = this.portfolio.activeLoans > 0 ? 
            (this.portfolio.outstandingBalance / (this.subscription?.weeklyLimit || 1)) * 100 : 0;
        
        const defaultExposure = this.portfolio.defaultedLoans > 0 ? 
            (this.portfolio.defaultedLoans / (this.portfolio.repaidLoans + this.portfolio.defaultedLoans)) * 100 : 0;
        
        return {
            concentrationRisk: Math.round(concentrationRisk),
            defaultExposure: Math.round(defaultExposure),
            activeLoans: this.portfolio.activeLoans,
            outstandingBalance: this.portfolio.outstandingBalance,
            riskLevel: this.getPortfolioRiskLevel(concentrationRisk, defaultExposure)
        };
    }

    getPortfolioRiskLevel(concentrationRisk, defaultExposure) {
        if (concentrationRisk > 70 || defaultExposure > 20) return 'HIGH';
        if (concentrationRisk > 40 || defaultExposure > 10) return 'MEDIUM';
        return 'LOW';
    }

    async generateLendingActivityReport(period) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const lenderLoans = loans.filter(loan => loan.lenderId === this.lenderData.userId);
        
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'WEEKLY':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'MONTHLY':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'QUARTERLY':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(0); // All time
        }
        
        const periodLoans = lenderLoans.filter(loan => 
            new Date(loan.createdAt) >= startDate
        );
        
        const byCategory = {};
        const byStatus = {};
        const byWeek = {};
        
        periodLoans.forEach(loan => {
            // Category breakdown
            byCategory[loan.category] = (byCategory[loan.category] || 0) + loan.amount;
            
            // Status breakdown
            byStatus[loan.status] = (byStatus[loan.status] || 0) + 1;
            
            // Weekly breakdown
            const weekStart = this.getWeekStart(new Date(loan.createdAt));
            byWeek[weekStart] = (byWeek[weekStart] || 0) + loan.amount;
        });
        
        return {
            period: period,
            startDate: startDate.toISOString(),
            endDate: now.toISOString(),
            summary: {
                totalLoans: periodLoans.length,
                totalAmount: periodLoans.reduce((sum, loan) => sum + loan.amount, 0),
                totalInterest: periodLoans
                    .filter(loan => loan.status === 'CLEARED')
                    .reduce((sum, loan) => sum + (loan.interest || 0), 0),
                activeLoans: periodLoans.filter(loan => 
                    ['ACTIVE', 'OVERDUE'].includes(loan.status)
                ).length
            },
            breakdown: {
                byCategory: byCategory,
                byStatus: byStatus,
                byWeek: byWeek
            },
            topBorrowers: this.getTopBorrowers(periodLoans)
        };
    }

    getWeekStart(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        const weekStart = new Date(date.setDate(diff));
        return weekStart.toISOString().split('T')[0];
    }

    getTopBorrowers(loans) {
        const borrowerMap = {};
        
        loans.forEach(loan => {
            if (!borrowerMap[loan.borrowerId]) {
                borrowerMap[loan.borrowerId] = {
                    borrowerId: loan.borrowerId,
                    totalBorrowed: 0,
                    loans: 0,
                    repaid: 0,
                    defaulted: 0
                };
            }
            
            borrowerMap[loan.borrowerId].totalBorrowed += loan.amount;
            borrowerMap[loan.borrowerId].loans += 1;
            
            if (loan.status === 'CLEARED') borrowerMap[loan.borrowerId].repaid += 1;
            if (loan.status === 'DEFAULTED') borrowerMap[loan.borrowerId].defaulted += 1;
        });
        
        return Object.values(borrowerMap)
            .sort((a, b) => b.totalBorrowed - a.totalBorrowed)
            .slice(0, 5);
    }

    async generateRepaymentPerformanceReport(period) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const lenderLoans = loans.filter(loan => loan.lenderId === this.lenderData.userId);
        
        const repaidLoans = lenderLoans.filter(loan => loan.status === 'CLEARED');
        const defaultedLoans = lenderLoans.filter(loan => loan.status === 'DEFAULTED');
        const activeLoans = lenderLoans.filter(loan => 
            ['ACTIVE', 'OVERDUE'].includes(loan.status)
        );
        
        const repaymentTimeliness = [];
        repaidLoans.forEach(loan => {
            const dueDate = new Date(loan.dueDate);
            const repaidDate = new Date(loan.lastRepaymentDate || loan.updatedAt);
            const daysLate = Math.max(0, Math.floor((repaidDate - dueDate) / (1000 * 60 * 60 * 24)));
            repaymentTimeliness.push(daysLate);
        });
        
        const avgDaysLate = repaymentTimeliness.length > 0 ? 
            repaymentTimeliness.reduce((a, b) => a + b, 0) / repaymentTimeliness.length : 0;
        
        const onTimeRepayments = repaymentTimeliness.filter(days => days === 0).length;
        const lateRepayments = repaymentTimeliness.filter(days => days > 0 && days <= 7).length;
        const veryLateRepayments = repaymentTimeliness.filter(days => days > 7).length;
        
        return {
            summary: {
                totalLoans: lenderLoans.length,
                repaidLoans: repaidLoans.length,
                defaultedLoans: defaultedLoans.length,
                activeLoans: activeLoans.length,
                repaymentRate: lenderLoans.length > 0 ? 
                    (repaidLoans.length / lenderLoans.length) * 100 : 100,
                defaultRate: lenderLoans.length > 0 ? 
                    (defaultedLoans.length / lenderLoans.length) * 100 : 0
            },
            timeliness: {
                avgDaysLate: Math.round(avgDaysLate * 10) / 10,
                onTime: onTimeRepayments,
                late: lateRepayments,
                veryLate: veryLateRepayments,
                onTimePercentage: repaidLoans.length > 0 ? 
                    (onTimeRepayments / repaidLoans.length) * 100 : 100
            },
            financial: {
                totalLent: lenderLoans.reduce((sum, loan) => sum + loan.amount, 0),
                totalRepaid: repaidLoans.reduce((sum, loan) => sum + loan.totalDue, 0),
                totalDefaulted: defaultedLoans.reduce((sum, loan) => sum + loan.outstandingBalance, 0),
                totalInterest: repaidLoans.reduce((sum, loan) => sum + (loan.interest || 0), 0),
                outstanding: activeLoans.reduce((sum, loan) => sum + loan.outstandingBalance, 0)
            }
        };
    }

    async generateRiskAnalysisReport() {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const lenderLoans = loans.filter(loan => loan.lenderId === this.lenderData.userId);
        
        const riskByCategory = {};
        const riskByBorrowerRating = {};
        const riskByLoanSize = {
            small: { count: 0, defaulted: 0 },
            medium: { count: 0, defaulted: 0 },
            large: { count: 0, defaulted: 0 }
        };
        
        lenderLoans.forEach(loan => {
            // Category risk
            if (!riskByCategory[loan.category]) {
                riskByCategory[loan.category] = { total: 0, defaulted: 0 };
            }
            riskByCategory[loan.category].total += 1;
            if (loan.status === 'DEFAULTED') riskByCategory[loan.category].defaulted += 1;
            
            // Loan size risk
            const amount = loan.amount;
            const limit = this.subscription?.weeklyLimit || 1;
            const percentage = (amount / limit) * 100;
            
            let size;
            if (percentage <= 10) size = 'small';
            else if (percentage <= 25) size = 'medium';
            else size = 'large';
            
            riskByLoanSize[size].count += 1;
            if (loan.status === 'DEFAULTED') riskByLoanSize[size].defaulted += 1;
        });
        
        // Calculate default rates
        const categoryRisks = {};
        Object.keys(riskByCategory).forEach(category => {
            const data = riskByCategory[category];
            categoryRisks[category] = data.total > 0 ? 
                (data.defaulted / data.total) * 100 : 0;
        });
        
        const sizeRisks = {};
        Object.keys(riskByLoanSize).forEach(size => {
            const data = riskByLoanSize[size];
            sizeRisks[size] = data.count > 0 ? 
                (data.defaulted / data.count) * 100 : 0;
        });
        
        return {
            concentration: {
                totalExposure: this.portfolio.outstandingBalance,
                limitUtilization: this.subscription?.weeklyLimit ? 
                    (this.portfolio.outstandingBalance / this.subscription.weeklyLimit) * 100 : 0,
                activeLoans: this.portfolio.activeLoans,
                avgExposurePerLoan: this.portfolio.activeLoans > 0 ? 
                    this.portfolio.outstandingBalance / this.portfolio.activeLoans : 0
            },
            defaultAnalysis: {
                byCategory: categoryRisks,
                byLoanSize: sizeRisks,
                overallDefaultRate: this.calculatePerformance().defaultRate
            },
            recommendations: this.generateRiskRecommendations(categoryRisks, sizeRisks)
        };
    }

    generateRiskRecommendations(categoryRisks, sizeRisks) {
        const recommendations = [];
        
        // Category recommendations
        Object.keys(categoryRisks).forEach(category => {
            if (categoryRisks[category] > 20) {
                recommendations.push(`Consider reducing exposure to ${category} (${categoryRisks[category].toFixed(1)}% default rate)`);
            } else if (categoryRisks[category] < 5) {
                recommendations.push(`Increase exposure to ${category} (${categoryRisks[category].toFixed(1)}% default rate)`);
            }
        });
        
        // Size recommendations
        if (sizeRisks.large > 15) {
            recommendations.push('Reduce large loan exposure (high default rate)');
        }
        if (sizeRisks.small < 5) {
            recommendations.push('Increase small loan portfolio (low default rate)');
        }
        
        // Concentration recommendations
        const concentration = this.portfolio.outstandingBalance / (this.subscription?.weeklyLimit || 1);
        if (concentration > 0.7) {
            recommendations.push('Reduce portfolio concentration (exceeds 70% of limit)');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Portfolio well balanced. Continue current strategy.');
        }
        
        return recommendations;
    }

    async generateTaxSummary(period) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const lenderLoans = loans.filter(loan => 
            loan.lenderId === this.lenderData.userId && 
            loan.status === 'CLEARED'
        );
        
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'MONTHLY':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'QUARTERLY':
                const quarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), quarter * 3, 1);
                break;
            case 'ANNUAL':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), 0, 1);
        }
        
        const periodLoans = lenderLoans.filter(loan => 
            new Date(loan.lastRepaymentDate || loan.updatedAt) >= startDate
        );
        
        const totalInterest = periodLoans.reduce((sum, loan) => sum + (loan.interest || 0), 0);
        const taxRate = 0.15; // 15% tax on interest income (example)
        const taxAmount = totalInterest * taxRate;
        
        return {
            period: period,
            fiscalYear: now.getFullYear(),
            summary: {
                totalLoans: periodLoans.length,
                totalPrincipal: periodLoans.reduce((sum, loan) => sum + loan.amount, 0),
                totalInterest: totalInterest,
                taxableIncome: totalInterest,
                taxRate: taxRate * 100,
                taxAmount: taxAmount,
                netIncome: totalInterest - taxAmount
            },
            monthlyBreakdown: this.getMonthlyBreakdown(periodLoans, startDate),
            supportingDocs: [
                'Loan agreements',
                'Repayment records',
                'Interest calculations'
            ],
            note: 'Consult a tax professional for accurate tax filing'
        };
    }

    getMonthlyBreakdown(loans, startDate) {
        const breakdown = {};
        const now = new Date();
        
        let current = new Date(startDate);
        while (current <= now) {
            const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
            breakdown[monthKey] = {
                loans: 0,
                interest: 0,
                principal: 0
            };
            
            // Move to next month
            current.setMonth(current.getMonth() + 1);
        }
        
        loans.forEach(loan => {
            const date = new Date(loan.lastRepaymentDate || loan.updatedAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (breakdown[monthKey]) {
                breakdown[monthKey].loans += 1;
                breakdown[monthKey].interest += loan.interest || 0;
                breakdown[monthKey].principal += loan.amount;
            }
        });
        
        return breakdown;
    }

    // Public API methods
    getCurrentState() {
        return {
            state: this.currentState,
            lender: this.getPublicLenderData(),
            subscription: this.subscription,
            portfolio: this.portfolio,
            currentRequest: this.currentRequest ? {
                id: this.currentRequest.id,
                amount: this.currentRequest.amount,
                category: this.currentRequest.category
            } : null,
            currentOffer: this.currentOffer ? {
                id: this.currentOffer.id,
                amount: this.currentOffer.amount,
                status: this.currentOffer.status
            } : null
        };
    }

    reset() {
        this.currentState = 'IDLE';
        this.lenderData = null;
        this.subscription = null;
        this.currentRequest = null;
        this.currentOffer = null;
        this.activeLoans = [];
        this.portfolio = {
            totalLent: 0,
            activeLoans: 0,
            repaidLoans: 0,
            defaultedLoans: 0,
            outstandingBalance: 0,
            totalInterest: 0
        };
    }

    async getLenderStats(userId) {
        const lender = await this.getLenderData(userId);
        const loans = await this.getLenderLoans(userId);
        const subscription = await this.getLenderSubscription(userId);
        
        const totalLent = loans.reduce((sum, loan) => sum + loan.amount, 0);
        const repaidLoans = loans.filter(loan => loan.status === 'CLEARED').length;
        const defaultedLoans = loans.filter(loan => loan.status === 'DEFAULTED').length;
        const totalLoans = loans.length;
        
        return {
            personal: {
                name: lender.brandName || lender.fullName,
                rating: lender.rating || 5.0,
                memberSince: lender.createdAt?.split('T')[0] || 'N/A',
                country: lender.country,
                categories: lender.lendingCategories || ['ALL']
            },
            financial: {
                totalLent: totalLent,
                totalInterest: loans
                    .filter(loan => loan.status === 'CLEARED')
                    .reduce((sum, loan) => sum + (loan.interest || 0), 0),
                currentExposure: loans
                    .filter(loan => ['ACTIVE', 'OVERDUE', 'DEFAULTED'].includes(loan.status))
                    .reduce((sum, loan) => sum + loan.outstandingBalance, 0),
                weeklyLimit: subscription?.weeklyLimit || 0,
                weeklyUsed: await this.getWeeklyLentAmount()
            },
            performance: {
                totalLoans: totalLoans,
                repaidLoans: repaidLoans,
                defaultedLoans: defaultedLoans,
                repaymentRate: totalLoans > 0 ? (repaidLoans / totalLoans) * 100 : 100,
                averageLoanSize: totalLoans > 0 ? totalLent / totalLoans : 0
            },
            subscription: {
                tier: subscription?.tier || 'NONE',
                status: subscription?.status || 'INACTIVE',
                expiry: subscription?.expiryDate || 'N/A'
            }
        };
    }

    async getLenderLoans(userId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        return loans.filter(loan => loan.lenderId === userId);
    }

    async getLendingHistory(filters = {}) {
        const loans = await this.getLenderLoans(this.lenderData.userId);
        
        // Apply filters
        let filtered = loans;
        
        if (filters.status) {
            filtered = filtered.filter(loan => loan.status === filters.status);
        }
        
        if (filters.category) {
            filtered = filtered.filter(loan => loan.category === filters.category);
        }
        
        if (filters.startDate) {
            const start = new Date(filters.startDate);
            filtered = filtered.filter(loan => new Date(loan.createdAt) >= start);
        }
        
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            filtered = filtered.filter(loan => new Date(loan.createdAt) <= end);
        }
        
        // Sort
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return {
            total: filtered.length,
            loans: filtered.map(loan => ({
                id: loan.id,
                borrowerId: loan.borrowerId,
                amount: loan.amount,
                interest: loan.interest,
                category: loan.category,
                status: loan.status,
                disbursedAt: loan.disbursedAt,
                dueDate: loan.dueDate,
                outstandingBalance: loan.outstandingBalance,
                createdAt: loan.createdAt
            }))
        };
    }

    async getBorrowerPerformance(borrowerId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const borrowerLoans = loans.filter(loan => 
            loan.borrowerId === borrowerId && 
            loan.lenderId === this.lenderData.userId
        );
        
        const totalLoans = borrowerLoans.length;
        const repaidLoans = borrowerLoans.filter(loan => loan.status === 'CLEARED').length;
        const defaultedLoans = borrowerLoans.filter(loan => loan.status === 'DEFAULTED').length;
        const activeLoans = borrowerLoans.filter(loan => 
            ['ACTIVE', 'OVERDUE'].includes(loan.status)
        ).length;
        
        const totalBorrowed = borrowerLoans.reduce((sum, loan) => sum + loan.amount, 0);
        const totalRepaid = borrowerLoans
            .filter(loan => loan.status === 'CLEARED')
            .reduce((sum, loan) => sum + loan.totalDue, 0);
        
        const repaymentRate = totalLoans > 0 ? (repaidLoans / totalLoans) * 100 : 100;
        const avgDaysLate = this.calculateAvgDaysLate(borrowerLoans);
        
        return {
            summary: {
                totalLoans: totalLoans,
                repaidLoans: repaidLoans,
                defaultedLoans: defaultedLoans,
                activeLoans: activeLoans,
                repaymentRate: Math.round(repaymentRate),
                totalBorrowed: totalBorrowed,
                totalRepaid: totalRepaid
            },
            timeliness: {
                avgDaysLate: avgDaysLate,
                onTimeRate: this.calculateOnTimeRate(borrowerLoans)
            },
            recentLoans: borrowerLoans
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(loan => ({
                    id: loan.id,
                    amount: loan.amount,
                    status: loan.status,
                    disbursedAt: loan.disbursedAt,
                    dueDate: loan.dueDate
                }))
        };
    }

    calculateAvgDaysLate(loans) {
        const repaidLoans = loans.filter(loan => loan.status === 'CLEARED');
        if (repaidLoans.length === 0) return 0;
        
        const totalDaysLate = repaidLoans.reduce((sum, loan) => {
            const dueDate = new Date(loan.dueDate);
            const repaidDate = new Date(loan.lastRepaymentDate || loan.updatedAt);
            const daysLate = Math.max(0, Math.floor((repaidDate - dueDate) / (1000 * 60 * 60 * 24)));
            return sum + daysLate;
        }, 0);
        
        return Math.round((totalDaysLate / repaidLoans.length) * 10) / 10;
    }

    calculateOnTimeRate(loans) {
        const repaidLoans = loans.filter(loan => loan.status === 'CLEARED');
        if (repaidLoans.length === 0) return 100;
        
        const onTimeLoans = repaidLoans.filter(loan => {
            const dueDate = new Date(loan.dueDate);
            const repaidDate = new Date(loan.lastRepaymentDate || loan.updatedAt);
            return repaidDate <= dueDate;
        }).length;
        
        return Math.round((onTimeLoans / repaidLoans.length) * 100);
    }
}

// Export singleton instance
const lenderFlow = new LenderFlow();
export default lenderFlow;