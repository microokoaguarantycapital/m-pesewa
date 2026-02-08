/**
 * M-PESEWA LENDER SLICE
 * Strictly follows Section A rules for lender management and operations
 * Lender Level - Money Providers in the hierarchy
 */

import { createSlice, createAsyncThunk } from 'reduxjs/toolkit';

// Initial state with strict lender rules enforcement
const initialState = {
    // Lender profile and status
    profile: null,
    
    // Subscription information (Section A: Required for lending)
    subscription: {
        level: null, // 'basic', 'premium', 'super', 'lender_of_lenders'
        status: 'inactive', // 'active', 'expired', 'pending'
        expiryDate: null, // 28th of month
        amountPaid: 0,
        paymentMethod: null,
        autoRenew: false
    },
    
    // Lending portfolio
    portfolio: {
        totalLent: 0,
        totalInterestEarned: 0,
        totalPenaltiesEarned: 0,
        activeLedgers: 0,
        clearedLedgers: 0,
        defaultedLedgers: 0,
        repaymentRate: 0,
        avgLoanAmount: 0,
        avgLoanDuration: 0
    },
    
    // Ledgers (Section A: Unlimited ledgers per lender)
    ledgers: [],
    activeLedgers: [],
    clearedLedgers: [],
    defaultedLedgers: [],
    
    // Loan requests from borrowers
    loanRequests: [],
    pendingApprovals: [],
    
    // Lending categories (Section A: Lenders choose categories)
    categories: [],
    availableCategories: [],
    
    // Groups where lender can lend (Section A: Group isolation)
    lendingGroups: [],
    
    // Risk assessment and limits
    riskProfile: {
        riskScore: 0,
        maxExposure: 0,
        currentExposure: 0,
        concentrationRisk: 0,
        defaultRisk: 0
    },
    
    // Lender rules and preferences
    preferences: {
        maxLoanAmount: 0,
        minRating: 3.0,
        autoApprove: false,
        requireGuarantors: true,
        notifyOnRequest: true,
        notifyOnRepayment: true
    },
    
    // Earnings and settlements
    earnings: {
        available: 0,
        pending: 0,
        totalEarned: 0,
        withdrawalHistory: []
    },
    
    // Loading states
    isLoading: false,
    isUpdating: false,
    isProcessing: false,
    isSubscribing: false,
    
    // Error states
    error: null,
    subscriptionError: null,
    lendingError: null
};

// Async thunks for lender operations
export const activateSubscription = createAsyncThunk(
    'lender/activateSubscription',
    async (subscriptionData, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const lenderId = state.role.currentProfile?.id;
            
            // Section A: Validate subscription data
            validateSubscriptionData(subscriptionData);
            
            // Check if already has active subscription
            if (state.lender.subscription.status === 'active') {
                throw new Error('Lender already has active subscription');
            }
            
            // Process subscription payment
            const paymentResult = await processSubscriptionPayment({
                ...subscriptionData,
                lenderId,
                paymentDate: new Date().toISOString()
            });
            
            if (!paymentResult.success) {
                throw new Error(`Payment failed: ${paymentResult.message}`);
            }
            
            // Activate subscription
            const subscription = await activateLenderSubscription(
                lenderId,
                subscriptionData,
                paymentResult
            );
            
            // Update lender's lending limits based on subscription level
            await updateLendingLimits(lenderId, subscriptionData.level);
            
            return subscription;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const approveLoanRequest = createAsyncThunk(
    'lender/approveLoan',
    async ({ requestId, terms }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const lenderId = state.role.currentProfile?.id;
            
            // Section A: Check if lender can lend (active subscription required)
            if (state.lender.subscription.status !== 'active') {
                throw new Error('Active subscription required to approve loans (Section A Rule)');
            }
            
            // Get loan request details
            const loanRequest = await getLoanRequest(requestId);
            if (!loanRequest) {
                throw new Error('Loan request not found');
            }
            
            // Check if lender is in the same group as borrower (Section A: Group isolation)
            const isInSameGroup = await checkSameGroup(lenderId, loanRequest.borrowerId);
            if (!isInSameGroup) {
                throw new Error('Can only lend to borrowers in the same group (Section A Rule)');
            }
            
            // Check if lender supports this loan category
            const supportsCategory = state.lender.categories.includes(loanRequest.category) ||
                                    state.lender.categories.includes('all');
            if (!supportsCategory) {
                throw new Error(`Lender does not support ${loanRequest.category} loans`);
            }
            
            // Check lending limits based on subscription level
            const canLendAmount = await checkLendingLimit(
                lenderId,
                loanRequest.amount,
                state.lender.subscription.level
            );
            
            if (!canLendAmount.allowed) {
                throw new Error(`Cannot lend amount: ${canLendAmount.reason}`);
            }
            
            // Check risk exposure
            const riskCheck = await checkRiskExposure(lenderId, loanRequest.amount);
            if (!riskCheck.allowed) {
                throw new Error(`Risk limit exceeded: ${riskCheck.reason}`);
            }
            
            // Create ledger (Section A: Auto-generated on approval)
            const ledger = await createLedger({
                lenderId,
                borrowerId: loanRequest.borrowerId,
                loanRequestId: requestId,
                amount: loanRequest.amount,
                category: loanRequest.category,
                interestRate: 0.10, // 10%
                repaymentPeriod: 7, // days
                penaltyRate: 0.05, // 5% daily after 7 days
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                createdDate: new Date().toISOString(),
                ...terms
            });
            
            // Update loan request status
            await updateLoanRequestStatus(requestId, 'approved', ledger.id);
            
            // Notify borrower
            await notifyBorrowerOfApproval(loanRequest.borrowerId, {
                requestId,
                amount: loanRequest.amount,
                ledgerId: ledger.id,
                dueDate: ledger.dueDate,
                lenderName: state.role.currentProfile?.full_name || 'Lender'
            });
            
            return {
                ledger,
                loanRequest,
                approvalDate: new Date().toISOString()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateLedger = createAsyncThunk(
    'lender/updateLedger',
    async ({ ledgerId, updates }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const lenderId = state.role.currentProfile?.id;
            
            // Get ledger
            const ledger = await getLedgerById(ledgerId);
            if (!ledger) {
                throw new Error('Ledger not found');
            }
            
            // Check if ledger belongs to lender
            if (ledger.lenderId !== lenderId) {
                throw new Error('Cannot update ledger that does not belong to you');
            }
            
            // Section A: Ledger updates are manual by lender
            const updatedLedger = await updateLedgerRecord(ledgerId, {
                ...updates,
                updatedBy: lenderId,
                updatedAt: new Date().toISOString()
            });
            
            // If updating repayment, calculate interest and penalties
            if (updates.repaymentAmount) {
                const repaymentDetails = calculateRepaymentUpdate(ledger, updates.repaymentAmount);
                
                // Add repayment record
                await addRepaymentRecord({
                    ledgerId,
                    amount: updates.repaymentAmount,
                    ...repaymentDetails,
                    recordedBy: lenderId,
                    recordedAt: new Date().toISOString()
                });
                
                // Update ledger status if fully repaid
                if (repaymentDetails.newBalance <= 0) {
                    await updateLedgerStatus(ledgerId, 'cleared');
                }
            }
            
            // If marking as defaulted
            if (updates.status === 'defaulted') {
                // Section A: Default after 2 months
                await handleDefault(ledgerId, lenderId, ledger.borrowerId);
            }
            
            return updatedLedger;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadLenderProfile = createAsyncThunk(
    'lender/loadProfile',
    async (lenderId, { rejectWithValue }) => {
        try {
            const profile = await getLenderProfile(lenderId);
            
            if (!profile) {
                throw new Error('Lender profile not found');
            }
            
            // Load subscription details
            const subscription = await getLenderSubscription(lenderId);
            
            // Load ledgers
            const ledgers = await getLenderLedgers(lenderId);
            
            // Load portfolio statistics
            const portfolio = await calculatePortfolioStats(lenderId, ledgers);
            
            // Load loan requests
            const loanRequests = await getLoanRequestsForLender(lenderId);
            
            // Load categories
            const categories = await getLenderCategories(lenderId);
            
            // Load risk profile
            const riskProfile = await calculateRiskProfile(lenderId, ledgers, portfolio);
            
            // Load earnings
            const earnings = await getLenderEarnings(lenderId);
            
            // Load lending groups
            const lendingGroups = await getLenderGroups(lenderId);
            
            return {
                profile,
                subscription,
                ledgers,
                activeLedgers: ledgers.filter(l => l.status === 'active'),
                clearedLedgers: ledgers.filter(l => l.status === 'cleared'),
                defaultedLedgers: ledgers.filter(l => l.status === 'defaulted'),
                portfolio,
                loanRequests,
                categories,
                riskProfile,
                earnings,
                lendingGroups,
                preferences: profile.preferences || initialState.preferences
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const rateBorrower = createAsyncThunk(
    'lender/rateBorrower',
    async ({ borrowerId, rating, review, ledgerId }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const lenderId = state.role.currentProfile?.id;
            
            // Section A: Validate rating (1-5 stars)
            if (rating < 1 || rating > 5) {
                throw new Error('Rating must be between 1 and 5 stars');
            }
            
            // Check if lender has cleared ledger with this borrower
            const hasClearedLedger = await checkClearedLedger(lenderId, borrowerId, ledgerId);
            if (!hasClearedLedger) {
                throw new Error('Can only rate borrowers after loan is fully repaid');
            }
            
            // Check if already rated for this ledger
            const alreadyRated = await checkExistingRating(lenderId, borrowerId, ledgerId);
            if (alreadyRated) {
                throw new Error('Already rated this borrower for this loan');
            }
            
            // Submit rating
            const ratingResult = await submitBorrowerRating({
                lenderId,
                borrowerId,
                rating,
                review,
                ledgerId,
                ratedAt: new Date().toISOString()
            });
            
            return ratingResult;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const blacklistBorrower = createAsyncThunk(
    'lender/blacklistBorrower',
    async ({ borrowerId, reason, ledgerId }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const lenderId = state.role.currentProfile?.id;
            
            // Section A: Check if borrower has defaulted for 2 months
            const hasDefaulted = await checkDefaultStatus(borrowerId, ledgerId);
            if (!hasDefaulted) {
                throw new Error('Can only blacklist borrowers who have defaulted for 2 months');
            }
            
            // Check if ledger belongs to lender
            const ledger = await getLedgerById(ledgerId);
            if (!ledger || ledger.lenderId !== lenderId) {
                throw new Error('Cannot blacklist for ledger that does not belong to you');
            }
            
            // Apply blacklist
            const blacklistResult = await applyBlacklist({
                borrowerId,
                lenderId,
                ledgerId,
                reason,
                amountOwed: ledger.remainingBalance || ledger.amount,
                daysOverdue: calculateDaysOverdue(ledger.dueDate),
                blacklistedAt: new Date().toISOString()
            });
            
            return blacklistResult;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create slice
const lenderSlice = createSlice({
    name: 'lender',
    initialState,
    reducers: {
        // Update lender profile
        updateProfile: (state, action) => {
            if (state.profile) {
                state.profile = {
                    ...state.profile,
                    ...action.payload,
                    updatedAt: new Date().toISOString()
                };
            }
        },
        
        // Update subscription
        updateSubscription: (state, action) => {
            state.subscription = {
                ...state.subscription,
                ...action.payload
            };
            
            // Update lending limits based on subscription level
            if (action.payload.level) {
                updateLenderLimitsReducer(state, action.payload.level);
            }
        },
        
        // Add new ledger
        addNewLedger: (state, action) => {
            const ledger = action.payload;
            state.ledgers.push(ledger);
            state.activeLedgers.push(ledger);
            
            // Update portfolio
            state.portfolio.totalLent += ledger.amount;
            state.portfolio.activeLedgers = state.activeLedgers.length;
            state.riskProfile.currentExposure += ledger.amount;
        },
        
        // Update ledger
        updateLedgerRecord: (state, action) => {
            const { ledgerId, updates } = action.payload;
            const ledgerIndex = state.ledgers.findIndex(l => l.id === ledgerId);
            
            if (ledgerIndex !== -1) {
                const ledger = state.ledgers[ledgerIndex];
                const updatedLedger = {
                    ...ledger,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                
                state.ledgers[ledgerIndex] = updatedLedger;
                
                // Update active/cleared/defaulted lists
                if (updates.status) {
                    // Remove from old status list
                    if (ledger.status === 'active') {
                        state.activeLedgers = state.activeLedgers.filter(l => l.id !== ledgerId);
                    } else if (ledger.status === 'cleared') {
                        state.clearedLedgers = state.clearedLedgers.filter(l => l.id !== ledgerId);
                    } else if (ledger.status === 'defaulted') {
                        state.defaultedLedgers = state.defaultedLedgers.filter(l => l.id !== ledgerId);
                    }
                    
                    // Add to new status list
                    if (updates.status === 'active') {
                        state.activeLedgers.push(updatedLedger);
                    } else if (updates.status === 'cleared') {
                        state.clearedLedgers.push(updatedLedger);
                        state.portfolio.clearedLedgers = state.clearedLedgers.length;
                        state.portfolio.activeLedgers = state.activeLedgers.length;
                        
                        // Update risk exposure
                        state.riskProfile.currentExposure -= ledger.remainingBalance || ledger.amount;
                    } else if (updates.status === 'defaulted') {
                        state.defaultedLedgers.push(updatedLedger);
                        state.portfolio.defaultedLedgers = state.defaultedLedgers.length;
                        state.portfolio.activeLedgers = state.activeLedgers.length;
                    }
                }
                
                // Update portfolio if repayment
                if (updates.repaymentAmount) {
                    state.portfolio.totalInterestEarned += updates.interestEarned || 0;
                    state.portfolio.totalPenaltiesEarned += updates.penaltiesEarned || 0;
                    state.earnings.available += updates.interestEarned || 0;
                    state.earnings.totalEarned += updates.interestEarned || 0;
                }
            }
        },
        
        // Add loan request
        addLoanRequest: (state, action) => {
            const request = action.payload;
            
            // Check if lender supports this category
            const supportsCategory = state.categories.includes(request.category) || 
                                    state.categories.includes('all');
            
            if (supportsCategory) {
                state.loanRequests.push(request);
                
                if (state.preferences.autoApprove) {
                    state.pendingApprovals.push({
                        ...request,
                        autoApprove: true
                    });
                }
            }
        },
        
        // Update categories
        updateCategories: (state, action) => {
            const { categories, replace } = action.payload;
            
            if (replace) {
                state.categories = categories;
            } else {
                // Add new categories, remove duplicates
                state.categories = [...new Set([...state.categories, ...categories])];
            }
            
            // Update available categories
            state.availableCategories = categories.includes('all') 
                ? getAllEmergencyCategories()
                : categories;
        },
        
        // Update preferences
        updatePreferences: (state, action) => {
            state.preferences = {
                ...state.preferences,
                ...action.payload
            };
        },
        
        // Update risk profile
        updateRiskProfile: (state, action) => {
            state.riskProfile = {
                ...state.riskProfile,
                ...action.payload
            };
        },
        
        // Withdraw earnings
        withdrawEarnings: (state, action) => {
            const { amount, method } = action.payload;
            
            if (amount > state.earnings.available) {
                throw new Error('Insufficient available earnings');
            }
            
            state.earnings.available -= amount;
            state.earnings.withdrawalHistory.push({
                amount,
                method,
                date: new Date().toISOString(),
                transactionId: `WDL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            });
        },
        
        // Clear lender state
        clearLenderState: (state) => {
            Object.assign(state, initialState);
        },
        
        // Calculate lending capacity
        calculateLendingCapacity: (state) => {
            const subscriptionLevel = state.subscription.level;
            const maxExposure = state.riskProfile.maxExposure;
            const currentExposure = state.riskProfile.currentExposure;
            
            // Section A: Weekly limits based on subscription
            const weeklyLimits = {
                basic: 1500,
                premium: 5000,
                super: 20000,
                lender_of_lenders: 50000
            };
            
            const weeklyLimit = weeklyLimits[subscriptionLevel] || 0;
            const availableThisWeek = weeklyLimit - currentExposure;
            const overallAvailable = maxExposure - currentExposure;
            
            return {
                weeklyLimit,
                availableThisWeek: Math.max(0, availableThisWeek),
                overallAvailable: Math.max(0, overallAvailable),
                currentExposure,
                maxExposure,
                subscriptionLevel
            };
        },
        
        // Get lender summary
        getLenderSummary: (state) => {
            return {
                profile: state.profile,
                subscription: state.subscription,
                portfolio: state.portfolio,
                activeLedgers: state.activeLedgers.length,
                riskScore: state.riskProfile.riskScore,
                availableEarnings: state.earnings.available,
                canLend: state.subscription.status === 'active' && 
                         state.riskProfile.currentExposure < state.riskProfile.maxExposure
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Activate subscription cases
            .addCase(activateSubscription.pending, (state) => {
                state.isSubscribing = true;
                state.subscriptionError = null;
            })
            .addCase(activateSubscription.fulfilled, (state, action) => {
                state.isSubscribing = false;
                state.subscription = action.payload;
                
                // Update lending limits
                updateLenderLimitsReducer(state, action.payload.level);
            })
            .addCase(activateSubscription.rejected, (state, action) => {
                state.isSubscribing = false;
                state.subscriptionError = action.payload || action.error.message;
            })
            
            // Approve loan cases
            .addCase(approveLoanRequest.pending, (state) => {
                state.isProcessing = true;
                state.lendingError = null;
            })
            .addCase(approveLoanRequest.fulfilled, (state, action) => {
                const { ledger, loanRequest } = action.payload;
                
                state.isProcessing = false;
                
                // Add to ledgers
                state.ledgers.push(ledger);
                state.activeLedgers.push(ledger);
                
                // Update portfolio
                state.portfolio.totalLent += ledger.amount;
                state.portfolio.activeLedgers = state.activeLedgers.length;
                state.riskProfile.currentExposure += ledger.amount;
                
                // Remove from loan requests
                state.loanRequests = state.loanRequests.filter(req => req.id !== loanRequest.id);
                state.pendingApprovals = state.pendingApprovals.filter(req => req.id !== loanRequest.id);
            })
            .addCase(approveLoanRequest.rejected, (state, action) => {
                state.isProcessing = false;
                state.lendingError = action.payload || action.error.message;
            })
            
            // Update ledger cases
            .addCase(updateLedger.fulfilled, (state, action) => {
                const updatedLedger = action.payload;
                const ledgerIndex = state.ledgers.findIndex(l => l.id === updatedLedger.id);
                
                if (ledgerIndex !== -1) {
                    state.ledgers[ledgerIndex] = updatedLedger;
                    
                    // Update status lists
                    if (updatedLedger.status !== state.ledgers[ledgerIndex].status) {
                        const oldStatus = state.ledgers[ledgerIndex].status;
                        const newStatus = updatedLedger.status;
                        
                        // Remove from old list
                        if (oldStatus === 'active') {
                            state.activeLedgers = state.activeLedgers.filter(l => l.id !== updatedLedger.id);
                        } else if (oldStatus === 'cleared') {
                            state.clearedLedgers = state.clearedLedgers.filter(l => l.id !== updatedLedger.id);
                        } else if (oldStatus === 'defaulted') {
                            state.defaultedLedgers = state.defaultedLedgers.filter(l => l.id !== updatedLedger.id);
                        }
                        
                        // Add to new list
                        if (newStatus === 'active') {
                            state.activeLedgers.push(updatedLedger);
                        } else if (newStatus === 'cleared') {
                            state.clearedLedgers.push(updatedLedger);
                            state.portfolio.clearedLedgers = state.clearedLedgers.length;
                            state.portfolio.activeLedgers = state.activeLedgers.length;
                        } else if (newStatus === 'defaulted') {
                            state.defaultedLedgers.push(updatedLedger);
                            state.portfolio.defaultedLedgers = state.defaultedLedgers.length;
                            state.portfolio.activeLedgers = state.activeLedgers.length;
                        }
                    }
                }
            })
            
            // Load lender profile cases
            .addCase(loadLenderProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadLenderProfile.fulfilled, (state, action) => {
                const {
                    profile,
                    subscription,
                    ledgers,
                    activeLedgers,
                    clearedLedgers,
                    defaultedLedgers,
                    portfolio,
                    loanRequests,
                    categories,
                    riskProfile,
                    earnings,
                    lendingGroups,
                    preferences
                } = action.payload;
                
                state.isLoading = false;
                state.profile = profile;
                state.subscription = subscription;
                state.ledgers = ledgers;
                state.activeLedgers = activeLedgers;
                state.clearedLedgers = clearedLedgers;
                state.defaultedLedgers = defaultedLedgers;
                state.portfolio = portfolio;
                state.loanRequests = loanRequests;
                state.categories = categories;
                state.riskProfile = riskProfile;
                state.earnings = earnings;
                state.lendingGroups = lendingGroups;
                state.preferences = preferences;
                state.availableCategories = categories.includes('all') 
                    ? getAllEmergencyCategories()
                    : categories;
            })
            .addCase(loadLenderProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            
            // Rate borrower cases
            .addCase(rateBorrower.fulfilled, (state, action) => {
                // Rating submitted successfully
                // Could update local state if needed
            })
            
            // Blacklist borrower cases
            .addCase(blacklistBorrower.fulfilled, (state, action) => {
                // Blacklist applied successfully
                // Could update local state if needed
            });
    }
});

// Helper reducer function
const updateLenderLimitsReducer = (state, subscriptionLevel) => {
    // Section A: Update limits based on subscription level
    const limits = {
        basic: { maxExposure: 1500, maxWeekly: 1500 },
        premium: { maxExposure: 5000, maxWeekly: 5000 },
        super: { maxExposure: 20000, maxWeekly: 20000 },
        lender_of_lenders: { maxExposure: 50000, maxWeekly: 50000 }
    };
    
    const limit = limits[subscriptionLevel] || limits.basic;
    state.riskProfile.maxExposure = limit.maxExposure;
    
    // Update preferences
    state.preferences.maxLoanAmount = limit.maxWeekly;
};

// Selectors
export const selectLenderProfile = (state) => state.lender.profile;
export const selectLenderSubscription = (state) => state.lender.subscription;
export const selectLenderPortfolio = (state) => state.lender.portfolio;
export const selectActiveLedgers = (state) => state.lender.activeLedgers;
export const selectLedgers = (state) => state.lender.ledgers;
export const selectLoanRequests = (state) => state.lender.loanRequests;
export const selectLenderCategories = (state) => state.lender.categories;
export const selectRiskProfile = (state) => state.lender.riskProfile;
export const selectLenderEarnings = (state) => state.lender.earnings;
export const selectIsLoading = (state) => state.lender.isLoading;
export const selectCanLend = (state) => {
    return state.lender.subscription.status === 'active' && 
           state.lender.riskProfile.currentExposure < state.lender.riskProfile.maxExposure;
};

export const selectLendingCapacity = (state) => {
    const subscription = state.lender.subscription;
    const riskProfile = state.lender.riskProfile;
    
    const weeklyLimits = {
        basic: 1500,
        premium: 5000,
        super: 20000,
        lender_of_lenders: 50000
    };
    
    const weeklyLimit = weeklyLimits[subscription.level] || 0;
    const availableThisWeek = Math.max(0, weeklyLimit - riskProfile.currentExposure);
    const overallAvailable = Math.max(0, riskProfile.maxExposure - riskProfile.currentExposure);
    
    return {
        weeklyLimit,
        availableThisWeek,
        overallAvailable,
        currentExposure: riskProfile.currentExposure,
        maxExposure: riskProfile.maxExposure,
        subscriptionActive: subscription.status === 'active',
        subscriptionLevel: subscription.level
    };
};

export const selectLenderSummary = (state) => ({
    name: state.lender.profile?.full_name || 'Unknown',
    subscription: state.lender.subscription,
    totalLent: state.lender.portfolio.totalLent,
    activeLedgers: state.lender.activeLedgers.length,
    earnings: state.lender.earnings.available,
    repaymentRate: state.lender.portfolio.repaymentRate,
    canLend: selectCanLend(state)
});

// Helper functions
const validateSubscriptionData = (subscriptionData) => {
    const requiredFields = ['level', 'paymentMethod', 'duration'];
    const missingFields = requiredFields.filter(field => !subscriptionData[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const validLevels = ['basic', 'premium', 'super', 'lender_of_lenders'];
    if (!validLevels.includes(subscriptionData.level)) {
        throw new Error(`Invalid subscription level. Must be one of: ${validLevels.join(', ')}`);
    }
    
    const validDurations = ['monthly', 'bi_annual', 'annual'];
    if (!validDurations.includes(subscriptionData.duration)) {
        throw new Error(`Invalid duration. Must be one of: ${validDurations.join(', ')}`);
    }
};

const processSubscriptionPayment = async (paymentData) => {
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Section A: Subscription amounts
    const subscriptionAmounts = {
        basic: { monthly: 50, bi_annual: 250, annual: 500 },
        premium: { monthly: 250, bi_annual: 1500, annual: 2500 },
        super: { monthly: 1000, bi_annual: 5000, annual: 8500 },
        lender_of_lenders: { monthly: 500, bi_annual: 3500, annual: 6500 }
    };
    
    const amount = subscriptionAmounts[paymentData.level]?.[paymentData.duration];
    if (!amount) {
        return { success: false, message: 'Invalid subscription combination' };
    }
    
    // Simulate payment success
    return {
        success: true,
        amount,
        transactionId: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentDate: new Date().toISOString()
    };
};

const activateLenderSubscription = async (lenderId, subscriptionData, paymentResult) => {
    // Calculate expiry date (28th of month)
    const expiryDate = calculateSubscriptionExpiry(subscriptionData.duration);
    
    const subscription = {
        level: subscriptionData.level,
        status: 'active',
        expiryDate,
        amountPaid: paymentResult.amount,
        paymentMethod: subscriptionData.paymentMethod,
        transactionId: paymentResult.transactionId,
        paymentDate: paymentResult.paymentDate,
        duration: subscriptionData.duration,
        autoRenew: subscriptionData.autoRenew || false,
        activatedAt: new Date().toISOString()
    };
    
    // Store subscription
    const subscriptions = JSON.parse(localStorage.getItem('mpesewa_lender_subscriptions') || '{}');
    subscriptions[lenderId] = subscription;
    localStorage.setItem('mpesewa_lender_subscriptions', JSON.stringify(subscriptions));
    
    return subscription;
};

const calculateSubscriptionExpiry = (duration) => {
    const now = new Date();
    let expiryDate = new Date(now);
    
    switch (duration) {
        case 'monthly':
            // Next month, 28th
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            expiryDate.setDate(28);
            break;
        case 'bi_annual':
            // 6 months from now, 28th
            expiryDate.setMonth(expiryDate.getMonth() + 6);
            expiryDate.setDate(28);
            break;
        case 'annual':
            // 1 year from now, 28th
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            expiryDate.setDate(28);
            break;
        default:
            // Default to monthly
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            expiryDate.setDate(28);
    }
    
    return expiryDate.toISOString();
};

const updateLendingLimits = async (lenderId, subscriptionLevel) => {
    // Update lender's lending limits in profile
    const profiles = JSON.parse(localStorage.getItem('mpesewa_lender_profiles') || '{}');
    if (profiles[lenderId]) {
        profiles[lenderId].subscriptionLevel = subscriptionLevel;
        profiles[lenderId].updatedAt = new Date().toISOString();
        localStorage.setItem('mpesewa_lender_profiles', JSON.stringify(profiles));
    }
};

const getLoanRequest = async (requestId) => {
    const requests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
    return requests.find(req => req.id === requestId);
};

const checkSameGroup = async (lenderId, borrowerId) => {
    // Check if lender and borrower are in at least one common group
    const lenderGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${lenderId}_groups`) || '[]');
    const borrowerGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${borrowerId}_groups`) || '[]');
    
    const lenderGroupIds = lenderGroups.map(g => g.groupId);
    const borrowerGroupIds = borrowerGroups.map(g => g.groupId);
    
    return lenderGroupIds.some(groupId => borrowerGroupIds.includes(groupId));
};

const checkLendingLimit = async (lenderId, amount, subscriptionLevel) => {
    // Section A: Check weekly limit based on subscription
    const weeklyLimits = {
        basic: 1500,
        premium: 5000,
        super: 20000,
        lender_of_lenders: 50000
    };
    
    const weeklyLimit = weeklyLimits[subscriptionLevel] || 0;
    
    // Calculate amount lent this week
    const ledgers = await getLenderLedgers(lenderId);
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const amountThisWeek = ledgers
        .filter(l => new Date(l.createdDate) > thisWeek && l.status === 'active')
        .reduce((sum, l) => sum + l.amount, 0);
    
    if (amountThisWeek + amount > weeklyLimit) {
        return {
            allowed: false,
            reason: `Weekly limit of ${weeklyLimit} exceeded. Already lent ${amountThisWeek} this week.`,
            weeklyLimit,
            amountThisWeek,
            remaining: weeklyLimit - amountThisWeek
        };
    }
    
    return { allowed: true };
};

const checkRiskExposure = async (lenderId, newAmount) => {
    const ledgers = await getLenderLedgers(lenderId);
    const activeExposure = ledgers
        .filter(l => l.status === 'active')
        .reduce((sum, l) => sum + (l.remainingBalance || l.amount), 0);
    
    // Max exposure based on subscription
    const profiles = JSON.parse(localStorage.getItem('mpesewa_lender_profiles') || '{}');
    const lenderProfile = profiles[lenderId];
    const maxExposure = lenderProfile?.maxExposure || 1500; // Default to basic
    
    if (activeExposure + newAmount > maxExposure) {
        return {
            allowed: false,
            reason: `Risk exposure limit of ${maxExposure} exceeded. Current exposure: ${activeExposure}`,
            currentExposure: activeExposure,
            maxExposure,
            remaining: maxExposure - activeExposure
        };
    }
    
    return { allowed: true };
};

const createLedger = async (ledgerData) => {
    const ledger = {
        id: `LEDGER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...ledgerData
    };
    
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    ledgers.push(ledger);
    localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
    
    return ledger;
};

const getLedgerById = async (ledgerId) => {
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    return ledgers.find(l => l.id === ledgerId);
};

const updateLedgerRecord = async (ledgerId, updates) => {
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    const ledgerIndex = ledgers.findIndex(l => l.id === ledgerId);
    
    if (ledgerIndex !== -1) {
        ledgers[ledgerIndex] = {
            ...ledgers[ledgerIndex],
            ...updates
        };
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
        
        return ledgers[ledgerIndex];
    }
    
    return null;
};

const calculateRepaymentUpdate = (ledger, repaymentAmount) => {
    const remainingBalance = ledger.remainingBalance || ledger.amount;
    const dueDate = new Date(ledger.dueDate);
    const now = new Date();
    const daysLate = Math.max(0, Math.floor((now - dueDate) / (1000 * 60 * 60 * 24)));
    
    let penalty = 0;
    if (daysLate > 0) {
        // 5% daily penalty after 7 days
        penalty = remainingBalance * 0.05 * daysLate;
    }
    
    const interest = remainingBalance * 0.10; // 10% interest
    const totalDue = remainingBalance + interest + penalty;
    
    const newBalance = Math.max(0, totalDue - repaymentAmount);
    const isFullRepayment = newBalance <= 0;
    
    return {
        interestEarned: isFullRepayment ? interest : repaymentAmount * (interest / totalDue),
        penaltiesEarned: isFullRepayment ? penalty : repaymentAmount * (penalty / totalDue),
        newBalance,
        isFullRepayment,
        daysLate,
        penaltyApplied: penalty
    };
};

const addRepaymentRecord = async (repaymentData) => {
    const repayments = JSON.parse(localStorage.getItem('mpesewa_repayments') || '[]');
    repayments.push(repaymentData);
    localStorage.setItem('mpesewa_repayments', JSON.stringify(repayments));
};

const updateLedgerStatus = async (ledgerId, status) => {
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    const ledgerIndex = ledgers.findIndex(l => l.id === ledgerId);
    
    if (ledgerIndex !== -1) {
        ledgers[ledgerIndex].status = status;
        ledgers[ledgerIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
    }
};

const handleDefault = async (ledgerId, lenderId, borrowerId) => {
    // Section A: Default after 2 months
    const defaultRecord = {
        ledgerId,
        lenderId,
        borrowerId,
        defaultedAt: new Date().toISOString(),
        status: 'defaulted'
    };
    
    const defaults = JSON.parse(localStorage.getItem('mpesewa_defaults') || '[]');
    defaults.push(defaultRecord);
    localStorage.setItem('mpesewa_defaults', JSON.stringify(defaults));
    
    // Notify platform admin
    await notifyPlatformAdmin({
        type: 'DEFAULT_RECORDED',
        ledgerId,
        lenderId,
        borrowerId,
        timestamp: new Date().toISOString()
    });
};

const updateLoanRequestStatus = async (requestId, status, ledgerId = null) => {
    const requests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
        requests[requestIndex].status = status;
        requests[requestIndex].updatedAt = new Date().toISOString();
        
        if (ledgerId) {
            requests[requestIndex].ledgerId = ledgerId;
        }
        
        localStorage.setItem('mpesewa_loan_requests', JSON.stringify(requests));
    }
};

const notifyBorrowerOfApproval = async (borrowerId, approvalDetails) => {
    const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
    notifications.push({
        userId: borrowerId,
        type: 'LOAN_APPROVED',
        ...approvalDetails,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
};

const getLenderProfile = async (lenderId) => {
    const profiles = JSON.parse(localStorage.getItem('mpesewa_lender_profiles') || '{}');
    return profiles[lenderId] || null;
};

const getLenderSubscription = async (lenderId) => {
    const subscriptions = JSON.parse(localStorage.getItem('mpesewa_lender_subscriptions') || '{}');
    return subscriptions[lenderId] || initialState.subscription;
};

const getLenderLedgers = async (lenderId) => {
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    return ledgers.filter(l => l.lenderId === lenderId);
};

const calculatePortfolioStats = async (lenderId, ledgers) => {
    const activeLedgers = ledgers.filter(l => l.status === 'active');
    const clearedLedgers = ledgers.filter(l => l.status === 'cleared');
    const defaultedLedgers = ledgers.filter(l => l.status === 'defaulted');
    
    const totalLent = ledgers.reduce((sum, l) => sum + l.amount, 0);
    const totalInterestEarned = clearedLedgers.reduce((sum, l) => sum + (l.interestEarned || l.amount * 0.10), 0);
    const totalPenaltiesEarned = clearedLedgers.reduce((sum, l) => sum + (l.penaltiesEarned || 0), 0);
    
    const repaymentRate = clearedLedgers.length > 0 
        ? (clearedLedgers.length / (clearedLedgers.length + defaultedLedgers.length)) * 100
        : 0;
    
    const avgLoanAmount = ledgers.length > 0 ? totalLent / ledgers.length : 0;
    
    return {
        totalLent,
        totalInterestEarned,
        totalPenaltiesEarned,
        activeLedgers: activeLedgers.length,
        clearedLedgers: clearedLedgers.length,
        defaultedLedgers: defaultedLedgers.length,
        repaymentRate,
        avgLoanAmount,
        avgLoanDuration: 7 // Fixed 7 days
    };
};

const getLoanRequestsForLender = async (lenderId) => {
    // Get requests from groups where lender is a member
    const lenderGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${lenderId}_groups`) || '[]');
    const groupIds = lenderGroups.map(g => g.groupId);
    
    const requests = JSON.parse(localStorage.getItem('mpesewa_loan_requests') || '[]');
    return requests.filter(req => 
        groupIds.includes(req.groupId) && 
        req.status === 'pending'
    );
};

const getLenderCategories = async (lenderId) => {
    const profiles = JSON.parse(localStorage.getItem('mpesewa_lender_profiles') || '{}');
    const profile = profiles[lenderId];
    
    return profile?.categories || [];
};

const calculateRiskProfile = async (lenderId, ledgers, portfolio) => {
    const activeExposure = ledgers
        .filter(l => l.status === 'active')
        .reduce((sum, l) => sum + (l.remainingBalance || l.amount), 0);
    
    // Simple risk score calculation
    let riskScore = 50; // Base score
    
    // Adjust based on repayment rate
    if (portfolio.repaymentRate >= 90) riskScore -= 20;
    else if (portfolio.repaymentRate >= 80) riskScore -= 10;
    else if (portfolio.repaymentRate < 70) riskScore += 20;
    
    // Adjust based on concentration (if too much to one borrower)
    const borrowerExposures = {};
    ledgers.forEach(l => {
        if (l.status === 'active') {
            borrowerExposures[l.borrowerId] = (borrowerExposures[l.borrowerId] || 0) + (l.remainingBalance || l.amount);
        }
    });
    
    const maxExposureToSingleBorrower = Math.max(...Object.values(borrowerExposures), 0);
    const concentrationRatio = activeExposure > 0 ? maxExposureToSingleBorrower / activeExposure : 0;
    
    if (concentrationRatio > 0.5) riskScore += 15;
    else if (concentrationRatio > 0.3) riskScore += 5;
    
    // Cap risk score between 0 and 100
    riskScore = Math.max(0, Math.min(100, riskScore));
    
    // Get max exposure from subscription
    const profiles = JSON.parse(localStorage.getItem('mpesewa_lender_profiles') || '{}');
    const profile = profiles[lenderId];
    const maxExposure = profile?.maxExposure || 1500;
    
    const defaultRisk = portfolio.defaultedLedgers > 0 
        ? (portfolio.defaultedLedgers / (portfolio.clearedLedgers + portfolio.defaultedLedgers)) * 100
        : 0;
    
    return {
        riskScore,
        maxExposure,
        currentExposure: activeExposure,
        concentrationRisk: concentrationRatio * 100,
        defaultRisk
    };
};

const getLenderEarnings = async (lenderId) => {
    const ledgers = await getLenderLedgers(lenderId);
    const clearedLedgers = ledgers.filter(l => l.status === 'cleared');
    
    const totalEarned = clearedLedgers.reduce((sum, l) => 
        sum + (l.interestEarned || 0) + (l.penaltiesEarned || 0), 0);
    
    // Mock withdrawal history
    const withdrawalHistory = [];
    
    return {
        available: totalEarned,
        pending: 0,
        totalEarned,
        withdrawalHistory
    };
};

const getLenderGroups = async (lenderId) => {
    const groupMemberships = JSON.parse(localStorage.getItem('mpesewa_group_memberships') || '[]');
    return groupMemberships
        .filter(m => m.userId === lenderId && m.roleType === 'lender')
        .map(m => ({ id: m.groupId, role: m.role, joinedDate: m.joinedDate }));
};

const checkClearedLedger = async (lenderId, borrowerId, ledgerId) => {
    const ledgers = await getLenderLedgers(lenderId);
    return ledgers.some(l => 
        l.id === ledgerId && 
        l.borrowerId === borrowerId && 
        l.status === 'cleared'
    );
};

const checkExistingRating = async (lenderId, borrowerId, ledgerId) => {
    const ratings = JSON.parse(localStorage.getItem('mpesewa_borrower_ratings') || '[]');
    return ratings.some(r => 
        r.lenderId === lenderId && 
        r.borrowerId === borrowerId && 
        r.ledgerId === ledgerId
    );
};

const submitBorrowerRating = async (ratingData) => {
    const ratings = JSON.parse(localStorage.getItem('mpesewa_borrower_ratings') || '[]');
    ratings.push(ratingData);
    localStorage.setItem('mpesewa_borrower_ratings', JSON.stringify(ratings));
    
    return ratingData;
};

const checkDefaultStatus = async (borrowerId, ledgerId) => {
    const ledger = await getLedgerById(ledgerId);
    if (!ledger) return false;
    
    const dueDate = new Date(ledger.dueDate);
    const now = new Date();
    const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
    
    // Section A: Default after 2 months (60 days)
    return daysOverdue > 60;
};

const calculateDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    return Math.max(0, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
};

const applyBlacklist = async (blacklistData) => {
    const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
    blacklist.push(blacklistData);
    localStorage.setItem('mpesewa_blacklist', JSON.stringify(blacklist));
    
    return blacklistData;
};

const notifyPlatformAdmin = async (notification) => {
    const adminNotifications = JSON.parse(localStorage.getItem('mpesewa_admin_notifications') || '[]');
    adminNotifications.push(notification);
    localStorage.setItem('mpesewa_admin_notifications', JSON.stringify(adminNotifications));
};

const getAllEmergencyCategories = () => {
    return [
        'fare', 'data', 'gas', 'food', 'wifi', 'water', 'electricity', 'tv',
        'fuel', 'repair', 'credo', 'sales', 'capital', 'soko', 'kidandaski',
        'hawker', 'fuliziwa', 'medicine', 'school', 'advance'
    ];
};

// Export actions and reducer
export const {
    updateProfile,
    updateSubscription,
    addNewLedger,
    updateLedgerRecord,
    addLoanRequest,
    updateCategories,
    updatePreferences,
    updateRiskProfile,
    withdrawEarnings,
    clearLenderState,
    calculateLendingCapacity,
    getLenderSummary
} = lenderSlice.actions;

export default lenderSlice.reducer;

/**
 * LENDER HIERARCHY ENFORCEMENT (Section A Strict Rules):
 * 
 * 1. Lenders must have active subscription (Basic, Premium, Super, Lender of Lenders)
 * 2. Subscription expires on 28th of each month
 * 3. Lenders can only lend within their group (Group isolation)
 * 4. Unlimited ledgers per lender
 * 5. Each ledger represents one borrower
 * 6. 10% interest per week (7 days)
 * 5% daily penalty after 7 days
 * 7. Loan approval generates ledger automatically
 * 8. Disbursement occurs manually outside platform
 * 9. Lenders choose which categories to support
 * 10. Can also be borrowers (dual role)
 * 11. Weekly lending limits based on subscription tier
 * 12. Can blacklist defaulters after 2 months
 * 13. Rate borrowers using 5-star system
 */