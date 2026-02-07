/**
 * M-Pesewa Borrower State Machine
 * STRICT HIERARCHY ENFORCEMENT: Global → Country → Groups → Borrowers
 * 
 * Borrower State Machine:
 * NEW → VERIFIED → ELIGIBLE → BORROWING → OVERDUE → DEFAULTED → BLACKLISTED → REINSTATED
 */

class BorrowerStateMachine {
    constructor() {
        this.states = {
            NEW: 'NEW',
            VERIFIED: 'VERIFIED',
            ELIGIBLE: 'ELIGIBLE',
            BORROWING: 'BORROWING',
            OVERDUE: 'OVERDUE',
            DEFAULTED: 'DEFAULTED',
            BLACKLISTED: 'BLACKLISTED',
            REINSTATED: 'REINSTATED'
        };

        this.transitions = {
            [this.states.NEW]: {
                verify: this.states.VERIFIED
            },
            [this.states.VERIFIED]: {
                makeEligible: this.states.ELIGIBLE,
                reject: this.states.NEW
            },
            [this.states.ELIGIBLE]: {
                startBorrowing: this.states.BORROWING,
                suspend: this.states.VERIFIED
            },
            [this.states.BORROWING]: {
                markOverdue: this.states.OVERDUE,
                clearLoan: this.states.ELIGIBLE
            },
            [this.states.OVERDUE]: {
                escalateToDefault: this.states.DEFAULTED,
                repay: this.states.ELIGIBLE
            },
            [this.states.DEFAULTED]: {
                blacklist: this.states.BLACKLISTED,
                repay: this.states.ELIGIBLE
            },
            [this.states.BLACKLISTED]: {
                reinstate: this.states.REINSTATED
            },
            [this.states.REINSTATED]: {
                verify: this.states.VERIFIED
            }
        };

        this.currentState = this.states.NEW;
        this.history = [];
        this.borrowerData = null;
        this.countryCode = null;
        this.groupIds = [];
    }

    /**
     * Initialize borrower with strict hierarchy enforcement
     */
    initialize(borrowerData) {
        if (!borrowerData || !borrowerData.countryCode) {
            throw new Error('Borrower must have country code (Country isolation rule)');
        }

        this.borrowerData = borrowerData;
        this.countryCode = borrowerData.countryCode;
        this.groupIds = borrowerData.groupIds || [];
        
        // ENFORCE: Borrower can join max 4 groups with good rating
        if (this.groupIds.length > 4) {
            throw new Error('Borrower cannot join more than 4 groups (Strict hierarchy rule)');
        }

        this.history.push({
            timestamp: new Date().toISOString(),
            from: null,
            to: this.currentState,
            action: 'INITIALIZE',
            data: borrowerData
        });

        return this;
    }

    /**
     * Attempt state transition with validation
     */
    transition(action, context = {}) {
        const validTransitions = this.transitions[this.currentState];
        
        if (!validTransitions || !validTransitions[action]) {
            throw new Error(`Invalid transition from ${this.currentState} via ${action}`);
        }

        const previousState = this.currentState;
        const newState = validTransitions[action];

        // Validate transition based on business rules
        if (!this.validateTransition(previousState, newState, action, context)) {
            throw new Error(`Transition validation failed: ${previousState} -> ${newState}`);
        }

        this.currentState = newState;
        
        this.history.push({
            timestamp: new Date().toISOString(),
            from: previousState,
            to: newState,
            action: action,
            context: context,
            borrowerId: this.borrowerData?.id,
            countryCode: this.countryCode
        });

        return this.currentState;
    }

    /**
     * Validate transition against M-Pesewa business rules
     */
    validateTransition(fromState, toState, action, context) {
        // STRICT RULE: Borrower can request loan only in ELIGIBLE state
        if (action === 'startBorrowing' && fromState !== this.states.ELIGIBLE) {
            console.error('Borrower can only request loan in ELIGIBLE state');
            return false;
        }

        // STRICT RULE: DEFAULTED blocks all groups
        if (fromState === this.states.DEFAULTED) {
            if (context.attemptGroupJoin) {
                console.error('DEFAULTED borrowers cannot join new groups');
                return false;
            }
        }

        // STRICT RULE: BLACKLISTED is global
        if (toState === this.states.BLACKLISTED) {
            // Check if borrower has been in DEFAULTED for 2 months (60 days)
            const defaultDate = this.getStateEntryDate(this.states.DEFAULTED);
            if (defaultDate) {
                const daysInDefault = Math.floor((Date.now() - new Date(defaultDate)) / (1000 * 60 * 60 * 24));
                if (daysInDefault < 60) {
                    console.error('Blacklist only allowed after 2 months in DEFAULTED state');
                    return false;
                }
            }
        }

        // STRICT RULE: REINSTATED only by Admin
        if (action === 'reinstate') {
            if (!context.adminOverride) {
                console.error('Only Platform Admin can reinstate BLACKLISTED borrowers');
                return false;
            }
            if (!context.fullRepaymentConfirmed) {
                console.error('Full repayment (principal + interest + penalties) required for reinstatement');
                return false;
            }
        }

        // ENFORCE: Borrower cannot be in BORROWING state in multiple groups simultaneously
        if (toState === this.states.BORROWING) {
            if (this.hasActiveLoanInOtherGroup(context.groupId)) {
                console.error('One active loan per group at a time rule');
                return false;
            }
        }

        // ENFORCE: Good rating required for group joins beyond first group
        if (action === 'joinGroup' && this.groupIds.length >= 1) {
            if (!this.hasGoodRating()) {
                console.error('Good rating required to join additional groups (max 4 groups)');
                return false;
            }
        }

        return true;
    }

    /**
     * Check if borrower has active loan in other group
     */
    hasActiveLoanInOtherGroup(currentGroupId) {
        // This would typically check against ledger system
        // For now, simulate with stored data
        if (this.borrowerData?.activeLoans) {
            return this.borrowerData.activeLoans.some(loan => 
                loan.groupId !== currentGroupId && 
                loan.status === 'ACTIVE'
            );
        }
        return false;
    }

    /**
     * Check borrower rating (5-star system)
     */
    hasGoodRating() {
        const minGoodRating = 3.5; // 3.5+ stars considered good
        return this.borrowerData?.rating >= minGoodRating;
    }

    /**
     * Get date when entered a specific state
     */
    getStateEntryDate(state) {
        const entry = this.history.find(entry => entry.to === state);
        return entry?.timestamp;
    }

    /**
     * Add borrower to group with validation
     */
    joinGroup(groupId, countryCode) {
        // STRICT RULE: No cross-country group joining
        if (countryCode !== this.countryCode) {
            throw new Error('Country isolation: Cannot join group in different country');
        }

        // STRICT RULE: Max 4 groups
        if (this.groupIds.length >= 4) {
            throw new Error('Maximum of 4 groups per borrower reached');
        }

        // STRICT RULE: Good rating required for additional groups
        if (this.groupIds.length > 0 && !this.hasGoodRating()) {
            throw new Error('Good rating required to join additional groups');
        }

        this.groupIds.push(groupId);
        
        this.history.push({
            timestamp: new Date().toISOString(),
            action: 'JOIN_GROUP',
            groupId: groupId,
            countryCode: countryCode,
            currentGroups: [...this.groupIds]
        });

        return true;
    }

    /**
     * Remove borrower from group
     */
    leaveGroup(groupId) {
        const index = this.groupIds.indexOf(groupId);
        if (index > -1) {
            this.groupIds.splice(index, 1);
            
            this.history.push({
                timestamp: new Date().toISOString(),
                action: 'LEAVE_GROUP',
                groupId: groupId
            });
            
            return true;
        }
        return false;
    }

    /**
     * Check if borrower can request loan
     */
    canRequestLoan() {
        // STRICT RULE: Only ELIGIBLE borrowers can request loans
        if (this.currentState !== this.states.ELIGIBLE) {
            return {
                canBorrow: false,
                reason: `Borrower must be in ELIGIBLE state (current: ${this.currentState})`
            };
        }

        // STRICT RULE: Check blacklist status
        if (this.currentState === this.states.BLACKLISTED) {
            return {
                canBorrow: false,
                reason: 'Blacklisted borrowers cannot borrow'
            };
        }

        // STRICT RULE: Check if in any group
        if (this.groupIds.length === 0) {
            return {
                canBorrow: false,
                reason: 'Borrower must be in at least one group'
            };
        }

        // ENFORCE: Check if borrower has reached tier limits
        if (this.hasReachedBorrowingLimit()) {
            return {
                canBorrow: false,
                reason: 'Borrowing limit reached for current tier'
            };
        }

        return {
            canBorrow: true,
            reason: 'Eligible for borrowing'
        };
    }

    /**
     * Check if borrower has reached tier borrowing limits
     */
    hasReachedBorrowingLimit() {
        if (!this.borrowerData?.tier) return false;
        
        const tierLimits = {
            BASIC: 1500,    // KSh 1,500 per week
            PREMIUM: 5000,  // KSh 5,000 per week
            SUPER: 20000    // KSh 20,000 per week
        };

        const limit = tierLimits[this.borrowerData.tier];
        if (!limit) return false;

        // Calculate weekly borrowing (this would query ledger system)
        const weeklyBorrowed = this.calculateWeeklyBorrowing();
        
        return weeklyBorrowed >= limit;
    }

    /**
     * Calculate total borrowed in last 7 days
     */
    calculateWeeklyBorrowing() {
        // This would query the ledger system
        // For simulation, return 0
        return 0;
    }

    /**
     * Apply penalty after 7 days overdue
     */
    applyPenalty(loanData) {
        if (this.currentState !== this.states.OVERDUE) {
            throw new Error('Penalty only applicable in OVERDUE state');
        }

        const overdueDays = this.calculateOverdueDays(loanData.disbursementDate);
        
        if (overdueDays > 7) {
            // 5% daily penalty after day 7
            const penaltyRate = 0.05; // 5%
            const dailyPenalty = loanData.principal * penaltyRate;
            
            this.history.push({
                timestamp: new Date().toISOString(),
                action: 'APPLY_PENALTY',
                overdueDays: overdueDays,
                penaltyRate: penaltyRate,
                dailyPenalty: dailyPenalty,
                loanId: loanData.id
            });

            return dailyPenalty;
        }
        
        return 0;
    }

    /**
     * Calculate days overdue
     */
    calculateOverdueDays(disbursementDate) {
        const disbursement = new Date(disbursementDate);
        const today = new Date();
        const diffTime = Math.abs(today - disbursement);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 7; // Minus 7-day loan period
    }

    /**
     * Escalate to DEFAULTED after 2 months
     */
    checkAndEscalateToDefault() {
        if (this.currentState === this.states.OVERDUE) {
            const overdueEntry = this.history.find(entry => 
                entry.to === this.states.OVERDUE
            );
            
            if (overdueEntry) {
                const overdueDate = new Date(overdueEntry.timestamp);
                const today = new Date();
                const monthsOverdue = (today.getFullYear() - overdueDate.getFullYear()) * 12 + 
                                     (today.getMonth() - overdueDate.getMonth());
                
                if (monthsOverdue >= 2) {
                    this.transition('escalateToDefault', {
                        overdueMonths: monthsOverdue,
                        autoEscalated: true
                    });
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Get borrower's current status summary
     */
    getStatusSummary() {
        return {
            currentState: this.currentState,
            countryCode: this.countryCode,
            groups: this.groupIds.length,
            maxGroups: 4,
            canBorrow: this.canRequestLoan().canBorrow,
            isBlacklisted: this.currentState === this.states.BLACKLISTED,
            isDefaulted: this.currentState === this.states.DEFAULTED,
            isOverdue: this.currentState === this.states.OVERDUE,
            historyLength: this.history.length,
            lastTransition: this.history[this.history.length - 1]
        };
    }

    /**
     * Export state machine data for persistence
     */
    exportData() {
        return {
            currentState: this.currentState,
            countryCode: this.countryCode,
            groupIds: [...this.groupIds],
            borrowerData: this.borrowerData,
            history: [...this.history],
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Import state machine data
     */
    importData(data) {
        if (!data || !data.countryCode) {
            throw new Error('Invalid import data: countryCode required');
        }

        this.currentState = data.currentState || this.states.NEW;
        this.countryCode = data.countryCode;
        this.groupIds = data.groupIds || [];
        this.borrowerData = data.borrowerData || null;
        this.history = data.history || [];

        return this;
    }

    /**
     * Reset to NEW state (for testing/admin override)
     */
    reset(adminOverride = false) {
        if (!adminOverride) {
            throw new Error('Only Platform Admin can reset borrower state');
        }

        this.currentState = this.states.NEW;
        this.history.push({
            timestamp: new Date().toISOString(),
            action: 'ADMIN_RESET',
            from: this.currentState,
            to: this.states.NEW,
            adminOverride: true
        });

        return this;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BorrowerStateMachine };
}

// Browser global export
if (typeof window !== 'undefined') {
    window.BorrowerStateMachine = BorrowerStateMachine;
}

/**
 * Utility function to create borrower instance with default data
 */
function createBorrower(borrowerData) {
    const stateMachine = new BorrowerStateMachine();
    
    // Default borrower data structure
    const defaultData = {
        id: `borrower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fullName: '',
        phoneNumber: '',
        nationalId: '',
        location: '',
        rating: 5, // Default 5-star rating
        tier: 'BASIC',
        activeLoans: [],
        totalBorrowed: 0,
        totalRepaid: 0,
        createdAt: new Date().toISOString(),
        ...borrowerData
    };

    stateMachine.initialize(defaultData);
    
    return stateMachine;
}

// Browser and Node.js compatible export
if (typeof window !== 'undefined') {
    window.createBorrower = createBorrower;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports.createBorrower = createBorrower;
}