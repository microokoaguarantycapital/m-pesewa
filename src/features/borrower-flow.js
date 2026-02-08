/**
 * M-Pesewa Borrower Flow Orchestrator
 * Full borrower workflow: borrow request → repayment → disputes
 * Enforces borrower limits, group restrictions, and rating system
 */

class BorrowerFlow {
    constructor() {
        this.currentState = 'IDLE';
        this.states = {
            IDLE: 'IDLE',
            PROFILE_SETUP: 'PROFILE_SETUP',
            ACTIVE: 'ACTIVE',
            REQUESTING_LOAN: 'REQUESTING_LOAN',
            LOAN_PENDING: 'LOAN_PENDING',
            LOAN_APPROVED: 'LOAN_APPROVED',
            LOAN_DISBURSED: 'LOAN_DISBURSED',
            REPAYING: 'REPAYING',
            OVERDUE: 'OVERDUE',
            DEFAULTED: 'DEFAULTED',
            BLACKLISTED: 'BLACKLISTED',
            DISPUTING: 'DISPUTING',
            RESTRICTED: 'RESTRICTED',
            INACTIVE: 'INACTIVE'
        };
        
        this.borrowerData = null;
        this.currentLoan = null;
        this.repaymentPlan = null;
        this.groupMemberships = [];
        this.rating = 5.0;
    }

    // MAIN BORROWER FLOW METHODS

    async initializeBorrower(userId) {
        try {
            this.currentState = this.states.IDLE;
            
            // Load borrower data
            this.borrowerData = await this.getBorrowerData(userId);
            
            if (!this.borrowerData) {
                throw new Error('Borrower not found');
            }
            
            // Load group memberships
            this.groupMemberships = await this.getBorrowerGroups(userId);
            
            // Load current rating
            this.rating = await this.getBorrowerRating(userId);
            
            // Check blacklist status
            const blacklistCheck = await this.checkBlacklistStatus(userId);
            if (blacklistCheck.blacklisted) {
                this.currentState = this.states.BLACKLISTED;
                return {
                    success: false,
                    state: this.currentState,
                    message: 'Borrower is blacklisted',
                    restrictions: blacklistCheck.restrictions
                };
            }
            
            // Check if borrower has active loans
            const activeLoans = await this.getActiveLoans(userId);
            if (activeLoans.length > 0) {
                this.currentLoan = activeLoans[0];
                
                // Determine loan state
                const loanState = await this.getLoanState(this.currentLoan);
                this.currentState = this.mapLoanStateToBorrowerState(loanState);
            } else {
                this.currentState = this.states.ACTIVE;
            }
            
            return {
                success: true,
                state: this.currentState,
                borrower: this.getPublicBorrowerData(),
                groups: this.groupMemberships,
                rating: this.rating,
                eligibleToBorrow: await this.isEligibleToBorrow(userId),
                message: 'Borrower initialized successfully'
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

    async requestLoan(loanRequestData) {
        try {
            if (this.currentState !== this.states.ACTIVE && 
                this.currentState !== this.states.IDLE) {
                throw new Error('Cannot request loan in current state');
            }
            
            // Validate borrower eligibility
            const eligibility = await this.validateBorrowerEligibility(loanRequestData);
            if (!eligibility.eligible) {
                throw new Error(eligibility.message);
            }
            
            // Validate loan request
            const validation = await this.validateLoanRequest(loanRequestData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            this.currentState = this.states.REQUESTING_LOAN;
            
            // Create loan request
            const loanRequest = await this.createLoanRequest(loanRequestData);
            
            // Calculate loan terms
            const loanTerms = this.calculateLoanTerms(loanRequestData);
            
            // Notify lenders in group
            await this.notifyLenders(loanRequest, loanRequestData.groupId);
            
            return {
                success: true,
                state: this.currentState,
                loanRequest: loanRequest,
                terms: loanTerms,
                estimatedRepayment: this.calculateRepaymentSchedule(loanTerms),
                message: 'Loan request submitted successfully. Awaiting lender offers.'
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

    async acceptLoanOffer(offerId, acceptanceData = {}) {
        try {
            if (this.currentState !== this.states.LOAN_PENDING) {
                throw new Error('No pending loan offers to accept');
            }
            
            // Get loan offer
            const loanOffer = await this.getLoanOffer(offerId);
            if (!loanOffer) {
                throw new Error('Loan offer not found');
            }
            
            // Validate offer acceptance
            const validation = await this.validateLoanOfferAcceptance(loanOffer, acceptanceData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Accept the offer
            const acceptedLoan = await this.acceptLoan(loanOffer, acceptanceData);
            
            this.currentLoan = acceptedLoan;
            this.currentState = this.states.LOAN_APPROVED;
            
            // Generate repayment plan
            this.repaymentPlan = this.generateRepaymentPlan(acceptedLoan);
            
            // Update borrower status
            await this.updateBorrowerLoanStatus(acceptedLoan);
            
            // Notify lender of acceptance
            await this.notifyLenderOfAcceptance(loanOffer.lenderId, acceptedLoan);
            
            return {
                success: true,
                state: this.currentState,
                loan: acceptedLoan,
                repaymentPlan: this.repaymentPlan,
                disbursementInstructions: this.getDisbursementInstructions(),
                message: 'Loan offer accepted successfully. Awaiting disbursement.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async confirmDisbursement(disbursementData) {
        try {
            if (this.currentState !== this.states.LOAN_APPROVED) {
                throw new Error('Loan is not in approved state');
            }
            
            if (!this.currentLoan) {
                throw new Error('No active loan found');
            }
            
            // Confirm disbursement receipt
            await this.recordDisbursementConfirmation(this.currentLoan.id, disbursementData);
            
            // Update loan status
            await this.updateLoanStatus(this.currentLoan.id, 'DISBURSED', disbursementData);
            
            // Start repayment monitoring
            await this.startRepaymentMonitoring(this.currentLoan);
            
            this.currentState = this.states.LOAN_DISBURSED;
            
            return {
                success: true,
                state: this.currentState,
                loan: this.currentLoan,
                repaymentSchedule: this.repaymentPlan,
                nextRepaymentDue: this.getNextRepaymentDue(),
                message: 'Disbursement confirmed. Repayment period started.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async makeRepayment(repaymentData) {
        try {
            if (!['LOAN_DISBURSED', 'REPAYING', 'OVERDUE'].includes(this.currentState)) {
                throw new Error('Cannot make repayment in current state');
            }
            
            if (!this.currentLoan) {
                throw new Error('No active loan found');
            }
            
            // Validate repayment
            const validation = this.validateRepayment(repaymentData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Record repayment
            const repaymentResult = await this.recordRepayment(this.currentLoan.id, repaymentData);
            
            // Update loan balance
            const updatedLoan = await this.updateLoanBalance(this.currentLoan.id, repaymentData.amount);
            
            // Check if loan is fully repaid
            if (updatedLoan.outstandingBalance <= 0) {
                await this.completeLoanRepayment(updatedLoan);
                this.currentState = this.states.ACTIVE;
                this.currentLoan = null;
                
                // Update borrower rating
                await this.updateBorrowerRating('TIMELY_REPAYMENT');
                
                return {
                    success: true,
                    state: this.currentState,
                    loanCleared: true,
                    clearanceCertificate: this.generateClearanceCertificate(updatedLoan),
                    message: 'Loan fully repaid! Borrower rating updated.'
                };
            }
            
            this.currentState = this.states.REPAYING;
            
            return {
                success: true,
                state: this.currentState,
                repayment: repaymentResult,
                remainingBalance: updatedLoan.outstandingBalance,
                nextDueDate: this.getNextRepaymentDue(),
                message: 'Repayment recorded successfully.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async requestExtension(extensionData) {
        try {
            if (!['LOAN_DISBURSED', 'REPAYING', 'OVERDUE'].includes(this.currentState)) {
                throw new Error('Cannot request extension in current state');
            }
            
            if (!this.currentLoan) {
                throw new Error('No active loan found');
            }
            
            // Check if extension is allowed
            const extensionAllowed = await this.isExtensionAllowed(this.currentLoan);
            if (!extensionAllowed) {
                throw new Error('Extension not allowed for this loan');
            }
            
            // Create extension request
            const extensionRequest = await this.createExtensionRequest(this.currentLoan.id, extensionData);
            
            // Notify lender
            await this.notifyLenderOfExtensionRequest(this.currentLoan.lenderId, extensionRequest);
            
            return {
                success: true,
                state: this.currentState,
                extensionRequest: extensionRequest,
                message: 'Extension request submitted. Awaiting lender approval.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async reportIssue(issueData) {
        try {
            if (!this.currentLoan) {
                throw new Error('No active loan to report issue on');
            }
            
            // Create issue report
            const issueReport = await this.createIssueReport(this.currentLoan.id, issueData);
            
            this.currentState = this.states.DISPUTING;
            
            // Notify lender and admin
            await this.notifyStakeholdersOfIssue(issueReport);
            
            return {
                success: true,
                state: this.currentState,
                issueReport: issueReport,
                caseId: issueReport.id,
                estimatedResolution: '3-5 business days',
                message: 'Issue reported successfully. Our team will review.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async joinGroup(groupData) {
        try {
            // Check if borrower can join more groups
            const canJoin = await this.canJoinGroup(groupData.groupId);
            if (!canJoin.allowed) {
                throw new Error(canJoin.message);
            }
            
            // Validate group invitation if required
            if (groupData.requiresInvitation) {
                const invitationValid = await this.validateGroupInvitation(groupData);
                if (!invitationValid) {
                    throw new Error('Invalid or expired invitation');
                }
            }
            
            // Join group
            const groupMembership = await this.addBorrowerToGroup(groupData);
            
            // Update group memberships
            this.groupMemberships = await this.getBorrowerGroups(this.borrowerData.userId);
            
            return {
                success: true,
                state: this.currentState,
                groupMembership: groupMembership,
                totalGroups: this.groupMemberships.length,
                message: `Successfully joined group: ${groupData.groupName}`
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async leaveGroup(groupId, leaveData = {}) {
        try {
            // Check if borrower can leave group
            const canLeave = await this.canLeaveGroup(groupId);
            if (!canLeave.allowed) {
                throw new Error(canLeave.message);
            }
            
            // Remove borrower from group
            await this.removeBorrowerFromGroup(groupId, leaveData);
            
            // Update group memberships
            this.groupMemberships = await this.getBorrowerGroups(this.borrowerData.userId);
            
            return {
                success: true,
                state: this.currentState,
                groupsRemaining: this.groupMemberships.length,
                message: 'Successfully left the group'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async updateProfile(profileData) {
        try {
            // Validate profile updates
            const validation = this.validateProfileUpdates(profileData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            // Update borrower profile
            const updatedProfile = await this.updateBorrowerProfile(profileData);
            this.borrowerData = updatedProfile;
            
            return {
                success: true,
                state: this.currentState,
                profile: this.getPublicBorrowerData(),
                message: 'Profile updated successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                state: this.currentState
            };
        }
    }

    async checkLoanStatus() {
        try {
            if (!this.currentLoan) {
                return {
                    hasActiveLoan: false,
                    state: this.currentState,
                    message: 'No active loan'
                };
            }
            
            // Get current loan status
            const loanStatus = await this.getLoanStatus(this.currentLoan.id);
            
            // Check for overdue status
            const overdueCheck = await this.checkOverdueStatus(this.currentLoan);
            if (overdueCheck.overdue) {
                this.currentState = this.states.OVERDUE;
                
                // Apply penalties if overdue
                if (overdueCheck.penaltyApplicable) {
                    await this.applyOverduePenalty(this.currentLoan, overdueCheck.daysOverdue);
                }
            }
            
            // Check for default status (60+ days overdue)
            if (overdueCheck.daysOverdue >= 60) {
                this.currentState = this.states.DEFAULTED;
                
                // Initiate default process
                await this.handleLoanDefault(this.currentLoan);
            }
            
            return {
                hasActiveLoan: true,
                state: this.currentState,
                loan: loanStatus,
                overdue: overdueCheck.overdue,
                daysOverdue: overdueCheck.daysOverdue || 0,
                outstandingBalance: loanStatus.outstandingBalance,
                nextPaymentDue: this.getNextRepaymentDue(),
                message: this.getStatusMessage(this.currentState)
            };
            
        } catch (error) {
            return {
                error: error.message,
                state: this.currentState
            };
        }
    }

    // HELPER METHODS

    async getBorrowerData(userId) {
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        let borrower = borrowers.find(b => b.userId === userId);
        
        if (!borrower) {
            // Try general users
            const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
            const user = users.find(u => u.userId === userId);
            
            if (user) {
                // Create borrower entry
                borrower = {
                    userId: user.userId,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    nationalId: user.nationalId,
                    country: user.country,
                    rating: 5.0,
                    totalBorrowed: 0,
                    activeLoans: 0,
                    repaymentRate: '100%',
                    blacklisted: false,
                    createdAt: new Date().toISOString()
                };
                
                borrowers.push(borrower);
                localStorage.setItem('mpesewa_borrowers', JSON.stringify(borborrowers));
            }
        }
        
        return borrower;
    }

    async getBorrowerGroups(userId) {
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        return userGroups.filter(ug => 
            ug.userId === userId && 
            ug.role === 'BORROWER' && 
            ug.status === 'ACTIVE'
        );
    }

    async getBorrowerRating(userId) {
        const ratings = JSON.parse(localStorage.getItem('mpesewa_ratings') || '[]');
        const borrowerRatings = ratings.filter(r => r.rateeId === userId);
        
        if (borrowerRatings.length === 0) return 5.0;
        
        const total = borrowerRatings.reduce((sum, r) => sum + r.rating, 0);
        return Math.round((total / borrowerRatings.length) * 10) / 10; // Round to 1 decimal
    }

    async checkBlacklistStatus(userId) {
        const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
        const blacklistEntry = blacklist.find(entry => 
            entry.userId === userId && 
            entry.status === 'ACTIVE'
        );
        
        if (blacklistEntry) {
            return {
                blacklisted: true,
                entry: blacklistEntry,
                restrictions: {
                    cannotBorrow: true,
                    cannotJoinNewGroups: true,
                    visibleBadge: true
                }
            };
        }
        
        return {
            blacklisted: false,
            entry: null
        };
    }

    async getActiveLoans(userId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        return loans.filter(loan => 
            loan.borrowerId === userId && 
            ['APPROVED', 'DISBURSED', 'ACTIVE', 'REPAYING', 'OVERDUE'].includes(loan.status)
        );
    }

    async getLoanState(loan) {
        // Determine loan state based on status and dates
        const now = new Date();
        const dueDate = new Date(loan.dueDate);
        
        if (loan.status === 'DISBURSED' || loan.status === 'ACTIVE') {
            if (now > dueDate) {
                return 'OVERDUE';
            }
            return 'ACTIVE';
        }
        
        return loan.status;
    }

    mapLoanStateToBorrowerState(loanState) {
        const mapping = {
            'PENDING': 'LOAN_PENDING',
            'APPROVED': 'LOAN_APPROVED',
            'DISBURSED': 'LOAN_DISBURSED',
            'ACTIVE': 'LOAN_DISBURSED',
            'REPAYING': 'REPAYING',
            'OVERDUE': 'OVERDUE',
            'DEFAULTED': 'DEFAULTED',
            'CLEARED': 'ACTIVE'
        };
        
        return mapping[loanState] || this.states.ACTIVE;
    }

    getPublicBorrowerData() {
        if (!this.borrowerData) return null;
        
        return {
            userId: this.borrowerData.userId,
            fullName: this.borrowerData.fullName,
            rating: this.rating,
            country: this.borrowerData.country,
            totalBorrowed: this.borrowerData.totalBorrowed || 0,
            repaymentRate: this.borrowerData.repaymentRate || '100%',
            activeLoans: this.borrowerData.activeLoans || 0,
            blacklisted: this.borrowerData.blacklisted || false,
            memberSince: this.borrowerData.createdAt?.split('T')[0] || 'N/A'
        };
    }

    async isEligibleToBorrow(userId) {
        // Check blacklist status
        const blacklistCheck = await this.checkBlacklistStatus(userId);
        if (blacklistCheck.blacklisted) {
            return {
                eligible: false,
                reason: 'BLACKLISTED',
                message: 'Borrower is blacklisted'
            };
        }
        
        // Check rating (minimum 3 stars)
        if (this.rating < 3) {
            return {
                eligible: false,
                reason: 'LOW_RATING',
                message: 'Borrower rating too low (minimum 3 stars required)'
            };
        }
        
        // Check active loans per group
        const groups = this.groupMemberships;
        for (const group of groups) {
            const activeLoansInGroup = await this.getActiveLoansInGroup(userId, group.groupId);
            if (activeLoansInGroup >= 1) { // Max 1 active loan per group
                return {
                    eligible: false,
                    reason: 'MAX_ACTIVE_LOANS',
                    message: 'Already has active loan in this group'
                };
            }
        }
        
        return {
            eligible: true,
            message: 'Borrower is eligible'
        };
    }

    async validateBorrowerEligibility(loanRequestData) {
        // Check basic eligibility
        const basicEligibility = await this.isEligibleToBorrow(this.borrowerData.userId);
        if (!basicEligibility.eligible) {
            return basicEligibility;
        }
        
        // Check if borrower is member of requested group
        const isGroupMember = this.groupMemberships.some(g => g.groupId === loanRequestData.groupId);
        if (!isGroupMember) {
            return {
                eligible: false,
                reason: 'NOT_GROUP_MEMBER',
                message: 'Borrower is not a member of the requested group'
            };
        }
        
        // Check if borrower has active loan in this group
        const activeLoansInGroup = await this.getActiveLoansInGroup(
            this.borrowerData.userId, 
            loanRequestData.groupId
        );
        
        if (activeLoansInGroup >= 1) {
            return {
                eligible: false,
                reason: 'ACTIVE_LOAN_IN_GROUP',
                message: 'Already has active loan in this group'
            };
        }
        
        return {
            eligible: true,
            message: 'Borrower eligible for loan request'
        };
    }

    async getActiveLoansInGroup(userId, groupId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        return loans.filter(loan => 
            loan.borrowerId === userId && 
            loan.groupId === groupId && 
            ['APPROVED', 'DISBURSED', 'ACTIVE', 'REPAYING', 'OVERDUE'].includes(loan.status)
        ).length;
    }

    async validateLoanRequest(loanRequestData) {
        const requiredFields = ['amount', 'groupId', 'category', 'purpose'];
        
        for (const field of requiredFields) {
            if (!loanRequestData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        // Validate amount (minimum 5 units of currency)
        if (loanRequestData.amount < 5) {
            return {
                valid: false,
                message: 'Minimum loan amount is 5'
            };
        }
        
        // Validate category
        const validCategories = this.getEmergencyCategories();
        if (!validCategories.includes(loanRequestData.category)) {
            return {
                valid: false,
                message: 'Invalid loan category'
            };
        }
        
        return {
            valid: true,
            message: 'Loan request validated'
        };
    }

    getEmergencyCategories() {
        return [
            'TRANSPORT_FARE',
            'MOBILE_DATA',
            'COOKING_GAS',
            'FOOD',
            'WIFI',
            'WATER_BILL',
            'ELECTRICITY',
            'TV_SUBSCRIPTION',
            'FUEL',
            'REPAIRS',
            'CREDO',
            'DAILY_SALES_ADVANCE',
            'WORKING_CAPITAL',
            'MARKET_LOAN',
            'KIBANDA_LOAN',
            'HAWKER_LOAN',
            'FULIZA_TOPUP',
            'MEDICINE',
            'SCHOOL_FEES',
            'QUICK_CASH'
        ];
    }

    async createLoanRequest(loanRequestData) {
        const requestId = 'BORROW-REQ-' + Date.now();
        
        const loanRequest = {
            id: requestId,
            borrowerId: this.borrowerData.userId,
            borrowerName: this.borrowerData.fullName,
            borrowerRating: this.rating,
            ...loanRequestData,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            offers: []
        };
        
        // Store loan request
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        loanRequests.push(loanRequest);
        localStorage.setItem('mpesewa_loan_requests', JSON.stringify(loanRequest));
        
        // Update borrower stats
        await this.updateBorrowerRequestStats(this.borrowerData.userId);
        
        return loanRequest;
    }

    calculateLoanTerms(loanRequestData) {
        const amount = loanRequestData.amount;
        const interestRate = 0.10; // 10%
        const interest = amount * interestRate;
        const totalDue = amount + interest;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // 7 days
        
        return {
            amount: amount,
            interest: interest,
            interestRate: '10%',
            totalDue: totalDue,
            dueDate: dueDate.toISOString(),
            repaymentPeriod: '7 days',
            dailyRepayment: totalDue / 7,
            penaltyRate: '5% daily after 7 days'
        };
    }

    calculateRepaymentSchedule(loanTerms) {
        const schedule = [];
        const dailyAmount = loanTerms.dailyRepayment;
        const totalDays = 7;
        
        for (let i = 1; i <= totalDays; i++) {
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

    async notifyLenders(loanRequest, groupId) {
        // Get lenders in the group
        const groupLenders = await this.getLendersInGroup(groupId);
        
        // Create notifications for each lender
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        
        groupLenders.forEach(lender => {
            const notification = {
                userId: lender.userId,
                type: 'NEW_LOAN_REQUEST',
                title: 'New Loan Request in Your Group',
                message: `${loanRequest.borrowerName} is requesting ${loanRequest.amount} for ${loanRequest.category}`,
                priority: 'MEDIUM',
                createdAt: new Date().toISOString(),
                data: {
                    requestId: loanRequest.id,
                    borrowerId: loanRequest.borrowerId,
                    amount: loanRequest.amount,
                    category: loanRequest.category,
                    borrowerRating: loanRequest.borrowerRating
                },
                actionUrl: `/lender/requests/view.html?id=${loanRequest.id}`
            };
            
            notifications.push(notification);
        });
        
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
        
        return groupLenders.length;
    }

    async getLendersInGroup(groupId) {
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        const lenderUserIds = userGroups
            .filter(ug => ug.groupId === groupId && ug.role === 'LENDER')
            .map(ug => ug.userId);
        
        const lenders = JSON.parse(localStorage.getItem('mpesewa_lenders') || '[]');
        return lenders.filter(l => lenderUserIds.includes(l.userId));
    }

    async getLoanOffer(offerId) {
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        
        for (const request of loanRequests) {
            const offer = request.offers?.find(o => o.id === offerId);
            if (offer) {
                return {
                    ...offer,
                    requestId: request.id,
                    borrowerId: request.borrowerId,
                    amount: request.amount,
                    category: request.category
                };
            }
        }
        
        return null;
    }

    async validateLoanOfferAcceptance(loanOffer, acceptanceData) {
        // Check if offer is still valid
        if (loanOffer.status !== 'PENDING') {
            return {
                valid: false,
                message: 'Loan offer is no longer available'
            };
        }
        
        // Check if offer has expired
        if (loanOffer.expiry && new Date(loanOffer.expiry) < new Date()) {
            return {
                valid: false,
                message: 'Loan offer has expired'
            };
        }
        
        // Validate acceptance terms
        if (acceptanceData.termsAgreed !== true) {
            return {
                valid: false,
                message: 'Loan terms must be agreed'
            };
        }
        
        return {
            valid: true,
            message: 'Loan offer acceptance validated'
        };
    }

    async acceptLoan(loanOffer, acceptanceData) {
        const loanId = 'LOAN-' + Date.now();
        
        const loan = {
            id: loanId,
            borrowerId: this.borrowerData.userId,
            lenderId: loanOffer.lenderId,
            requestId: loanOffer.requestId,
            offerId: loanOffer.id,
            amount: loanOffer.amount,
            interestRate: loanOffer.interestRate || 0.10,
            interest: loanOffer.amount * (loanOffer.interestRate || 0.10),
            totalDue: loanOffer.amount * (1 + (loanOffer.interestRate || 0.10)),
            category: loanOffer.category,
            groupId: loanOffer.groupId,
            country: this.borrowerData.country,
            status: 'APPROVED',
            disbursementMethod: acceptanceData.disbursementMethod,
            createdAt: new Date().toISOString(),
            approvedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            outstandingBalance: loanOffer.amount * (1 + (loanOffer.interestRate || 0.10)),
            repayments: [],
            guarantors: acceptanceData.guarantors || []
        };
        
        // Store loan
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        loans.push(loan);
        localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
        
        // Update loan offer status
        await this.updateLoanOfferStatus(loanOffer.requestId, loanOffer.id, 'ACCEPTED');
        
        // Update loan request status
        await this.updateLoanRequestStatus(loanOffer.requestId, 'ACCEPTED');
        
        return loan;
    }

    async updateLoanOfferStatus(requestId, offerId, status) {
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        const requestIndex = loanRequests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            const offerIndex = loanRequests[requestIndex].offers?.findIndex(o => o.id === offerId) || -1;
            
            if (offerIndex !== -1) {
                loanRequests[requestIndex].offers[offerIndex].status = status;
                loanRequests[requestIndex].offers[offerIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('mpesewa_loan_requests', JSON.stringify(loanRequests));
            }
        }
    }

    async updateLoanRequestStatus(requestId, status) {
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        const requestIndex = loanRequests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            loanRequests[requestIndex].status = status;
            loanRequests[requestIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mpesewa_loan_requests', JSON.stringify(loanRequests));
        }
    }

    generateRepaymentPlan(loan) {
        const dailyAmount = loan.totalDue / 7;
        const plan = [];
        
        for (let i = 1; i <= 7; i++) {
            const dueDate = new Date(loan.approvedAt);
            dueDate.setDate(dueDate.getDate() + i);
            
            plan.push({
                day: i,
                dueDate: dueDate.toISOString(),
                amountDue: dailyAmount,
                status: 'PENDING'
            });
        }
        
        return plan;
    }

    async updateBorrowerLoanStatus(loan) {
        // Update borrower's active loan count
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        const borrowerIndex = borrowers.findIndex(b => b.userId === this.borrowerData.userId);
        
        if (borrowerIndex !== -1) {
            borrowers[borrowerIndex].activeLoans = (borrowers[borrowerIndex].activeLoans || 0) + 1;
            borrowers[borrowerIndex].totalBorrowed = (borrowers[borrowerIndex].totalBorrowed || 0) + loan.amount;
            borrowers[borrowerIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_borrowers', JSON.stringify(borrowers));
        }
    }

    async notifyLenderOfAcceptance(lenderId, loan) {
        const notification = {
            userId: lenderId,
            type: 'LOAN_OFFER_ACCEPTED',
            title: 'Loan Offer Accepted!',
            message: `${this.borrowerData.fullName} has accepted your loan offer of ${loan.amount}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                loanId: loan.id,
                borrowerId: loan.borrowerId,
                amount: loan.amount,
                dueDate: loan.dueDate
            },
            actionUrl: `/lender/loans/view.html?id=${loan.id}`
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    getDisbursementInstructions() {
        return {
            title: 'Disbursement Instructions',
            steps: [
                'Contact your lender for disbursement details',
                'Funds will be sent via agreed method (M-Pesa, bank transfer, cash)',
                'Confirm receipt of funds once received',
                'Repayment period starts from disbursement date'
            ],
            important: 'Keep communication records and transaction confirmations'
        };
    }

    async recordDisbursementConfirmation(loanId, disbursementData) {
        const disbursements = JSON.parse(localStorage.getItem('mpesewa_disbursements') || '[]');
        
        disbursements.push({
            loanId: loanId,
            ...disbursementData,
            confirmedAt: new Date().toISOString(),
            confirmedBy: this.borrowerData.userId
        });
        
        localStorage.setItem('mpesewa_disbursements', JSON.stringify(disbursements));
    }

    async updateLoanStatus(loanId, status, data = {}) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loanIndex = loans.findIndex(l => l.id === loanId);
        
        if (loanIndex !== -1) {
            loans[loanIndex].status = status;
            loans[loanIndex].lastUpdated = new Date().toISOString();
            
            if (status === 'DISBURSED') {
                loans[loanIndex].disbursedAt = new Date().toISOString();
                loans[loanIndex].disbursementMethod = data.method;
                loans[loanIndex].disbursementReference = data.reference;
            }
            
            localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
        }
    }

    async startRepaymentMonitoring(loan) {
        // Schedule daily checks for repayment status
        console.log(`Started repayment monitoring for loan: ${loan.id}`);
        // In production: Set up interval checks
    }

    getNextRepaymentDue() {
        if (!this.repaymentPlan) return null;
        
        const pendingRepayments = this.repaymentPlan.filter(p => p.status === 'PENDING');
        return pendingRepayments.length > 0 ? pendingRepayments[0].dueDate : null;
    }

    validateRepayment(repaymentData) {
        const requiredFields = ['amount', 'method', 'reference'];
        
        for (const field of requiredFields) {
            if (!repaymentData[field]) {
                return {
                    valid: false,
                    message: `${field} is required`
                };
            }
        }
        
        // Validate amount is positive
        if (repaymentData.amount <= 0) {
            return {
                valid: false,
                message: 'Repayment amount must be greater than 0'
            };
        }
        
        return {
            valid: true,
            message: 'Repayment validated'
        };
    }

    async recordRepayment(loanId, repaymentData) {
        const repaymentId = 'REPAY-' + Date.now();
        const repayment = {
            id: repaymentId,
            loanId: loanId,
            ...repaymentData,
            recordedAt: new Date().toISOString(),
            recordedBy: this.borrowerData.userId,
            status: 'RECORDED'
        };
        
        // Store repayment
        const repayments = JSON.parse(localStorage.getItem('mpesewa_repayments') || '[]');
        repayments.push(repayment);
        localStorage.setItem('mpesewa_repayments', JSON.stringify(repayments));
        
        return repayment;
    }

    async updateLoanBalance(loanId, repaymentAmount) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loanIndex = loans.findIndex(l => l.id === loanId);
        
        if (loanIndex !== -1) {
            loans[loanIndex].outstandingBalance -= repaymentAmount;
            loans[loanIndex].lastRepaymentDate = new Date().toISOString();
            loans[loanIndex].lastUpdated = new Date().toISOString();
            
            // Update repayment plan
            if (this.repaymentPlan) {
                const dailyAmount = loans[loanIndex].totalDue / 7;
                const daysPaid = Math.floor(repaymentAmount / dailyAmount);
                
                for (let i = 0; i < Math.min(daysPaid, this.repaymentPlan.length); i++) {
                    if (this.repaymentPlan[i].status === 'PENDING') {
                        this.repaymentPlan[i].status = 'PAID';
                        this.repaymentPlan[i].paidDate = new Date().toISOString();
                        this.repaymentPlan[i].paidAmount = dailyAmount;
                    }
                }
            }
            
            localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
            
            return loans[loanIndex];
        }
        
        return null;
    }

    async completeLoanRepayment(loan) {
        // Update loan status to CLEARED
        await this.updateLoanStatus(loan.id, 'CLEARED');
        
        // Update borrower stats
        await this.updateBorrowerAfterRepayment(loan);
        
        // Generate clearance certificate
        this.generateClearanceCertificate(loan);
    }

    async updateBorrowerAfterRepayment(loan) {
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        const borrowerIndex = borrowers.findIndex(b => b.userId === this.borrowerData.userId);
        
        if (borrowerIndex !== -1) {
            borrowers[borrowerIndex].activeLoans = Math.max(0, (borrowers[borrowerIndex].activeLoans || 1) - 1);
            borrowers[borrowerIndex].successfulRepayments = (borrowers[borrowerIndex].successfulRepayments || 0) + 1;
            
            // Calculate repayment rate
            const totalLoans = borrowers[borrowerIndex].successfulRepayments + (borrowers[borrowerIndex].defaultedLoans || 0);
            const repaymentRate = totalLoans > 0 ? 
                (borrowers[borrowerIndex].successfulRepayments / totalLoans) * 100 : 100;
            
            borrowers[borrowerIndex].repaymentRate = `${Math.round(repaymentRate)}%`;
            borrowers[borrowerIndex].lastUpdated = new Date().toISOString();
            
            localStorage.setItem('mpesewa_borrowers', JSON.stringify(borrowers));
        }
    }

    async updateBorrowerRating(reason) {
        // Update rating based on repayment behavior
        const ratingChange = reason === 'TIMELY_REPAYMENT' ? 0.1 : -0.2;
        this.rating = Math.min(5.0, Math.max(1.0, this.rating + ratingChange));
        
        // Update in storage
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        const borrowerIndex = borrowers.findIndex(b => b.userId === this.borrowerData.userId);
        
        if (borrowerIndex !== -1) {
            borrowers[borrowerIndex].rating = this.rating;
            borrowers[borrowerIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_borrowers', JSON.stringify(borrowers));
        }
        
        // Record rating change
        await this.recordRatingChange(reason, ratingChange);
    }

    async recordRatingChange(reason, change) {
        const ratingChanges = JSON.parse(localStorage.getItem('mpesewa_rating_changes') || '[]');
        
        ratingChanges.push({
            userId: this.borrowerData.userId,
            reason: reason,
            change: change,
            newRating: this.rating,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('mpesewa_rating_changes', JSON.stringify(ratingChanges));
    }

    generateClearanceCertificate(loan) {
        const certificateId = 'CERT-' + Date.now();
        
        return {
            certificateId: certificateId,
            borrowerId: loan.borrowerId,
            loanId: loan.id,
            amount: loan.amount,
            interest: loan.interest,
            totalRepaid: loan.totalDue,
            clearedDate: new Date().toISOString(),
            issuer: 'M-Pesewa Platform',
            message: 'Loan successfully repaid. Borrower in good standing.',
            verificationUrl: `/verify/certificate/${certificateId}`
        };
    }

    async isExtensionAllowed(loan) {
        // Check if loan is already overdue
        const overdueCheck = await this.checkOverdueStatus(loan);
        if (overdueCheck.overdue) {
            return {
                allowed: false,
                reason: 'Loan is already overdue'
            };
        }
        
        // Check if extension was already requested
        const existingExtensions = await this.getLoanExtensions(loan.id);
        if (existingExtensions.length > 0) {
            return {
                allowed: false,
                reason: 'Extension already requested'
            };
        }
        
        // Check borrower rating (minimum 4 stars for extension)
        if (this.rating < 4) {
            return {
                allowed: false,
                reason: 'Borrower rating too low for extension'
            };
        }
        
        return {
            allowed: true,
            reason: 'Extension allowed'
        };
    }

    async checkOverdueStatus(loan) {
        const now = new Date();
        const dueDate = new Date(loan.dueDate);
        const daysOverdue = Math.max(0, Math.floor((now - dueDate) / (1000 * 60 * 60 * 24)));
        
        return {
            overdue: daysOverdue > 0,
            daysOverdue: daysOverdue,
            penaltyApplicable: daysOverdue > 7 // Penalty after 7 days
        };
    }

    async getLoanExtensions(loanId) {
        const extensions = JSON.parse(localStorage.getItem('mpesewa_loan_extensions') || '[]');
        return extensions.filter(ext => ext.loanId === loanId);
    }

    async createExtensionRequest(loanId, extensionData) {
        const extensionId = 'EXT-' + Date.now();
        const extensionRequest = {
            id: extensionId,
            loanId: loanId,
            borrowerId: this.borrowerData.userId,
            requestedDays: extensionData.days || 7,
            reason: extensionData.reason,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };
        
        // Store extension request
        const extensions = JSON.parse(localStorage.getItem('mpesewa_loan_extensions') || '[]');
        extensions.push(extensionRequest);
        localStorage.setItem('mpesewa_loan_extensions', JSON.stringify(extensions));
        
        return extensionRequest;
    }

    async notifyLenderOfExtensionRequest(lenderId, extensionRequest) {
        const notification = {
            userId: lenderId,
            type: 'LOAN_EXTENSION_REQUEST',
            title: 'Loan Extension Requested',
            message: `${this.borrowerData.fullName} is requesting ${extensionRequest.requestedDays} days extension`,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            data: {
                extensionId: extensionRequest.id,
                loanId: extensionRequest.loanId,
                requestedDays: extensionRequest.requestedDays,
                reason: extensionRequest.reason
            },
            actionUrl: `/lender/extensions/review.html?id=${extensionRequest.id}`
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async createIssueReport(loanId, issueData) {
        const issueId = 'ISSUE-' + Date.now();
        const issueReport = {
            id: issueId,
            loanId: loanId,
            borrowerId: this.borrowerData.userId,
            type: issueData.type,
            description: issueData.description,
            evidence: issueData.evidence || [],
            status: 'OPEN',
            priority: issueData.priority || 'MEDIUM',
            createdAt: new Date().toISOString(),
            assignedTo: null,
            resolution: null
        };
        
        // Store issue report
        const issues = JSON.parse(localStorage.getItem('mpesewa_issues') || '[]');
        issues.push(issueReport);
        localStorage.setItem('mpesewa_issues', JSON.stringify(issues));
        
        return issueReport;
    }

    async notifyStakeholdersOfIssue(issueReport) {
        // Notify lender
        if (this.currentLoan?.lenderId) {
            const lenderNotification = {
                userId: this.currentLoan.lenderId,
                type: 'LOAN_ISSUE_REPORTED',
                title: 'Issue Reported on Loan',
                message: `${this.borrowerData.fullName} has reported an issue on loan ${this.currentLoan.id}`,
                priority: 'HIGH',
                createdAt: new Date().toISOString(),
                data: {
                    issueId: issueReport.id,
                    loanId: issueReport.loanId,
                    issueType: issueReport.type
                },
                actionUrl: `/lender/issues/view.html?id=${issueReport.id}`
            };
            
            const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
            notifications.push(lenderNotification);
            localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
        }
        
        // Notify admins
        const admins = JSON.parse(localStorage.getItem('mpesewa_admins') || '[]');
        admins.forEach(admin => {
            if (admin.active) {
                const adminNotification = {
                    userId: admin.userId,
                    type: 'NEW_ISSUE_REPORT',
                    title: 'New Issue Report',
                    message: `New issue reported on loan ${issueReport.loanId}`,
                    priority: 'MEDIUM',
                    createdAt: new Date().toISOString(),
                    data: {
                        issueId: issueReport.id,
                        loanId: issueReport.loanId,
                        borrowerId: issueReport.borrowerId
                    },
                    actionUrl: `/admin/issues/view.html?id=${issueReport.id}`
                };
                
                const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
                notifications.push(adminNotification);
                localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
            }
        });
    }

    async canJoinGroup(groupId) {
        // Check if already in group
        const alreadyInGroup = this.groupMemberships.some(g => g.groupId === groupId);
        if (alreadyInGroup) {
            return {
                allowed: false,
                reason: 'ALREADY_IN_GROUP',
                message: 'Already a member of this group'
            };
        }
        
        // Check max groups (4 for borrowers)
        if (this.groupMemberships.length >= 4) {
            return {
                allowed: false,
                reason: 'MAX_GROUPS_REACHED',
                message: 'Maximum of 4 groups reached'
            };
        }
        
        // Check blacklist status
        if (this.borrowerData.blacklisted) {
            return {
                allowed: false,
                reason: 'BLACKLISTED',
                message: 'Blacklisted users cannot join new groups'
            };
        }
        
        // Check rating (minimum 3 stars to join new groups)
        if (this.rating < 3) {
            return {
                allowed: false,
                reason: 'LOW_RATING',
                message: 'Rating too low to join new groups'
            };
        }
        
        return {
            allowed: true,
            message: 'Can join group'
        };
    }

    async validateGroupInvitation(groupData) {
        if (!groupData.invitationCode) return false;
        
        const invitations = JSON.parse(localStorage.getItem('mpesewa_invitations') || '[]');
        const invitation = invitations.find(inv => 
            inv.groupId === groupData.groupId && 
            inv.code === groupData.invitationCode &&
            inv.expiry > new Date().toISOString() &&
            !inv.used
        );
        
        return !!invitation;
    }

    async addBorrowerToGroup(groupData) {
        const membershipId = 'MEM-' + Date.now();
        const membership = {
            id: membershipId,
            userId: this.borrowerData.userId,
            groupId: groupData.groupId,
            role: 'BORROWER',
            status: 'ACTIVE',
            joinedDate: new Date().toISOString(),
            invitedBy: groupData.invitedBy || null,
            invitationCode: groupData.invitationCode || null
        };
        
        // Store membership
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        userGroups.push(membership);
        localStorage.setItem('mpesewa_user_groups', JSON.stringify(userGroups));
        
        // Update group count
        await this.updateGroupMemberCount(groupData.groupId, 'ADD');
        
        return membership;
    }

    async updateGroupMemberCount(groupId, action) {
        // Find group in any country
        const countries = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'DRC', 
                         'South Sudan', 'South Africa', 'Nigeria', 'Ghana', 'Ethiopia'];
        
        for (const country of countries) {
            const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${country}`) || '[]');
            const groupIndex = groups.findIndex(g => g.id === groupId);
            
            if (groupIndex !== -1) {
                if (action === 'ADD') {
                    groups[groupIndex].memberCount = (groups[groupIndex].memberCount || 0) + 1;
                    groups[groupIndex].borrowerCount = (groups[groupIndex].borrowerCount || 0) + 1;
                } else if (action === 'REMOVE') {
                    groups[groupIndex].memberCount = Math.max(0, (groups[groupIndex].memberCount || 1) - 1);
                    groups[groupIndex].borrowerCount = Math.max(0, (groups[groupIndex].borrowerCount || 1) - 1);
                }
                
                groups[groupIndex].lastUpdated = new Date().toISOString();
                localStorage.setItem(`mpesewa_groups_${country}`, JSON.stringify(groups));
                break;
            }
        }
    }

    async canLeaveGroup(groupId) {
        // Check if has active loan in group
        const activeLoansInGroup = await this.getActiveLoansInGroup(this.borrowerData.userId, groupId);
        if (activeLoansInGroup > 0) {
            return {
                allowed: false,
                reason: 'ACTIVE_LOAN_IN_GROUP',
                message: 'Cannot leave group with active loan'
            };
        }
        
        // Check if is only borrower in group (minimum 5 members required)
        const groupMembers = await this.getGroupMembers(groupId);
        const borrowerMembers = groupMembers.filter(m => m.role === 'BORROWER');
        
        if (borrowerMembers.length <= 1) {
            return {
                allowed: false,
                reason: 'MINIMUM_BORROWERS_REQUIRED',
                message: 'Cannot leave - minimum borrowers required in group'
            };
        }
        
        return {
            allowed: true,
            message: 'Can leave group'
        };
    }

    async getGroupMembers(groupId) {
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        return userGroups.filter(ug => ug.groupId === groupId && ug.status === 'ACTIVE');
    }

    async removeBorrowerFromGroup(groupId, leaveData) {
        // Update membership status
        const userGroups = JSON.parse(localStorage.getItem('mpesewa_user_groups') || '[]');
        const membershipIndex = userGroups.findIndex(ug => 
            ug.userId === this.borrowerData.userId && 
            ug.groupId === groupId &&
            ug.status === 'ACTIVE'
        );
        
        if (membershipIndex !== -1) {
            userGroups[membershipIndex].status = 'LEFT';
            userGroups[membershipIndex].leftDate = new Date().toISOString();
            userGroups[membershipIndex].leaveReason = leaveData.reason;
            localStorage.setItem('mpesewa_user_groups', JSON.stringify(userGroups));
        }
        
        // Update group count
        await this.updateGroupMemberCount(groupId, 'REMOVE');
    }

    validateProfileUpdates(profileData) {
        // Validate phone number format if provided
        if (profileData.phoneNumber && !this.validatePhoneNumber(profileData.phoneNumber)) {
            return {
                valid: false,
                message: 'Invalid phone number format'
            };
        }
        
        // Validate email if provided
        if (profileData.email && !this.validateEmail(profileData.email)) {
            return {
                valid: false,
                message: 'Invalid email format'
            };
        }
        
        return {
            valid: true,
            message: 'Profile updates validated'
        };
    }

    validatePhoneNumber(phoneNumber) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phoneNumber);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async updateBorrowerProfile(profileData) {
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        const borrowerIndex = borrowers.findIndex(b => b.userId === this.borrowerData.userId);
        
        if (borrowerIndex !== -1) {
            // Update allowed fields
            const allowedFields = ['phoneNumber', 'email', 'address', 'preferences', 'notificationSettings'];
            
            allowedFields.forEach(field => {
                if (profileData[field] !== undefined) {
                    borrowers[borrowerIndex][field] = profileData[field];
                }
            });
            
            borrowers[borrowerIndex].lastUpdated = new Date().toISOString();
            localStorage.setItem('mpesewa_borrowers', JSON.stringify(borrowers));
            
            return borrowers[borrowerIndex];
        }
        
        return this.borrowerData;
    }

    async getLoanStatus(loanId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        const loan = loans.find(l => l.id === loanId);
        
        if (!loan) return null;
        
        // Calculate days remaining
        const now = new Date();
        const dueDate = new Date(loan.dueDate);
        const daysRemaining = Math.max(0, Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)));
        
        return {
            ...loan,
            daysRemaining: daysRemaining,
            isOverdue: daysRemaining === 0 && loan.outstandingBalance > 0
        };
    }

    async applyOverduePenalty(loan, daysOverdue) {
        if (daysOverdue <= 7) return; // Penalty only after 7 days
        
        const penaltyDays = daysOverdue - 7;
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
            
            // Notify borrower of penalty
            await this.notifyBorrowerOfPenalty(loan, penalty);
        }
    }

    async notifyBorrowerOfPenalty(loan, penalty) {
        const notification = {
            userId: this.borrowerData.userId,
            type: 'OVERDUE_PENALTY',
            title: 'Overdue Penalty Applied',
            message: `Daily penalty of ${penalty} applied to your overdue loan`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                loanId: loan.id,
                penalty: penalty,
                outstandingBalance: loan.outstandingBalance
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    async handleLoanDefault(loan) {
        // Mark loan as defaulted
        await this.updateLoanStatus(loan.id, 'DEFAULTED');
        
        // Add to blacklist
        await this.addToBlacklist(loan);
        
        // Notify borrower and lender
        await this.notifyDefault(loan);
    }

    async addToBlacklist(loan) {
        const blacklistData = {
            userId: loan.borrowerId,
            reason: 'DEFAULTED_LOAN',
            amountOwed: loan.outstandingBalance,
            lenderId: loan.lenderId,
            groupId: loan.groupId,
            country: loan.country,
            daysOverdue: 60
        };
        
        // Use blacklist check flow to add
        const blacklistCheckFlow = window.blacklistCheckFlow || (await import('./blacklist-check-flow.js')).default;
        await blacklistCheckFlow.addToBlacklist(blacklistData);
    }

    async notifyDefault(loan) {
        // Notify borrower
        const borrowerNotification = {
            userId: loan.borrowerId,
            type: 'LOAN_DEFAULTED',
            title: 'Loan Defaulted',
            message: `Your loan has been marked as defaulted after 60 days overdue. You have been added to the blacklist.`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                loanId: loan.id,
                amountOwed: loan.outstandingBalance
            }
        };
        
        // Notify lender
        const lenderNotification = {
            userId: loan.lenderId,
            type: 'BORROWER_DEFAULTED',
            title: 'Borrower Defaulted',
            message: `${this.borrowerData.fullName} has defaulted on loan ${loan.id}`,
            priority: 'HIGH',
            createdAt: new Date().toISOString(),
            data: {
                loanId: loan.id,
                borrowerId: loan.borrowerId,
                amountOwed: loan.outstandingBalance
            }
        };
        
        const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
        notifications.push(borrowerNotification, lenderNotification);
        localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
    }

    getStatusMessage(state) {
        const messages = {
            'IDLE': 'Ready to request a loan',
            'ACTIVE': 'Ready to request a loan',
            'REQUESTING_LOAN': 'Submitting loan request',
            'LOAN_PENDING': 'Waiting for lender offers',
            'LOAN_APPROVED': 'Loan approved, awaiting disbursement',
            'LOAN_DISBURSED': 'Loan active, repayment in progress',
            'REPAYING': 'Making repayments',
            'OVERDUE': 'Loan overdue, please make payment',
            'DEFAULTED': 'Loan defaulted, contact support',
            'BLACKLISTED': 'Account restricted due to blacklist',
            'DISPUTING': 'Issue reported, under review',
            'RESTRICTED': 'Account has restrictions',
            'INACTIVE': 'Account inactive'
        };
        
        return messages[state] || 'Status unknown';
    }

    async updateBorrowerRequestStats(userId) {
        const borrowers = JSON.parse(localStorage.getItem('mpesewa_borrowers') || '[]');
        const borrowerIndex = borrowers.findIndex(b => b.userId === userId);
        
        if (borrowerIndex !== -1) {
            borrowers[borrowerIndex].loanRequests = (borrowers[borrowerIndex].loanRequests || 0) + 1;
            borrowers[borrowerIndex].lastLoanRequest = new Date().toISOString();
            localStorage.setItem('mpesewa_borrowers', JSON.stringify(borrowers));
        }
    }

    // Public API methods
    getCurrentState() {
        return {
            state: this.currentState,
            borrower: this.getPublicBorrowerData(),
            currentLoan: this.currentLoan ? {
                id: this.currentLoan.id,
                amount: this.currentLoan.amount,
                outstandingBalance: this.currentLoan.outstandingBalance,
                status: this.currentLoan.status
            } : null,
            groups: this.groupMemberships.length,
            rating: this.rating
        };
    }

    reset() {
        this.currentState = 'IDLE';
        this.borrowerData = null;
        this.currentLoan = null;
        this.repaymentPlan = null;
        this.groupMemberships = [];
        this.rating = 5.0;
    }

    async getBorrowerStats(userId) {
        const borrower = await this.getBorrowerData(userId);
        const loans = await this.getBorrowerLoanHistory(userId);
        const groups = await this.getBorrowerGroups(userId);
        
        const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0);
        const repaidLoans = loans.filter(loan => loan.status === 'CLEARED').length;
        const defaultedLoans = loans.filter(loan => loan.status === 'DEFAULTED').length;
        const totalLoans = loans.length;
        
        return {
            personal: {
                name: borrower.fullName,
                rating: borrower.rating || 5.0,
                memberSince: borrower.createdAt?.split('T')[0] || 'N/A',
                country: borrower.country
            },
            financial: {
                totalBorrowed: totalBorrowed,
                totalRepaid: loans
                    .filter(loan => loan.status === 'CLEARED')
                    .reduce((sum, loan) => sum + loan.totalDue, 0),
                currentDebt: loans
                    .filter(loan => ['ACTIVE', 'OVERDUE', 'DEFAULTED'].includes(loan.status))
                    .reduce((sum, loan) => sum + loan.outstandingBalance, 0)
            },
            performance: {
                totalLoans: totalLoans,
                repaidLoans: repaidLoans,
                defaultedLoans: defaultedLoans,
                repaymentRate: totalLoans > 0 ? (repaidLoans / totalLoans) * 100 : 100,
                averageLoanSize: totalLoans > 0 ? totalBorrowed / totalLoans : 0
            },
            groups: {
                count: groups.length,
                groupNames: groups.map(g => g.groupName || `Group ${g.groupId}`)
            }
        };
    }

    async getBorrowerLoanHistory(userId) {
        const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
        return loans.filter(loan => loan.borrowerId === userId);
    }

    async getAvailableGroups(country) {
        const groups = JSON.parse(localStorage.getItem(`mpesewa_groups_${country}`) || '[]');
        return groups.filter(group => 
            group.country === country && 
            group.status === 'ACTIVE' &&
            group.memberCount < 1000
        ).map(group => ({
            id: group.id,
            name: group.name,
            type: group.type,
            memberCount: group.memberCount,
            successRate: group.successRate || 'N/A',
            requiresInvitation: group.requiresInvitation || false
        }));
    }

    async getLoanOffers(userId) {
        const loanRequests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
        const borrowerRequests = loanRequests.filter(r => r.borrowerId === userId && r.status === 'PENDING');
        
        const offers = [];
        borrowerRequests.forEach(request => {
            if (request.offers && request.offers.length > 0) {
                request.offers.forEach(offer => {
                    if (offer.status === 'PENDING') {
                        offers.push({
                            ...offer,
                            requestId: request.id,
                            requestAmount: request.amount,
                            category: request.category
                        });
                    }
                });
            }
        });
        
        return offers;
    }

    async getRepaymentHistory(loanId) {
        const repayments = JSON.parse(localStorage.getItem('mpesewa_repayments') || '[]');
        return repayments.filter(repayment => repayment.loanId === loanId);
    }
}

// Export singleton instance
const borrowerFlow = new BorrowerFlow();
export default borrowerFlow;