/**
 * M-PESEWA BORROWER SLICE
 * Strictly follows Section A rules for borrower management and operations
 * Borrower Level - Money Recipients in the hierarchy
 */

import { createSlice, createAsyncThunk } from 'reduxjs/toolkit';

// Initial state with strict borrower rules enforcement
const initialState = {
    // Borrower profile and status
    profile: null,
    
    // Active loans (max 1 active loan per group - Section A)
    activeLoans: [],
    
    // Borrow history
    borrowHistory: [],
    
    // Repayment tracking
    repayments: [],
    pendingRepayments: [],
    
    // Loan requests and applications
    loanRequests: [],
    pendingApplications: [],
    
    // Borrower groups (max 4 groups - Section A)
    groups: [],
    
    // Borrower rating and reputation (5-star system - Section A)
    rating: {
        current: 5.0, // Start with perfect rating
        history: [],
        reviews: [],
        lenderRatings: []
    },
    
    // Blacklist status
    blacklistStatus: {
        isBlacklisted: false,
        reason: null,
        dateBlacklisted: null,
        amountOwed: 0,
        daysOverdue: 0,
        canAppeal: false
    },
    
    // Borrower limits and constraints
    limits: {
        maxGroups: 4,
        currentGroups: 0,
        canJoinNewGroups: true,
        maxActiveLoans: 1, // Per group (Section A)
        totalBorrowed: 0,
        currentBorrowed: 0,
        borrowingPower: 0 // Based on rating and history
    },
    
    // Emergency categories access
    emergencyCategories: [],
    
    // Guarantors/Referrers (Section A: 2 referrers required)
    guarantors: [],
    
    // Loading states
    isLoading: false,
    isUpdating: false,
    isApplying: false,
    isRepaying: false,
    
    // Error states
    error: null,
    applicationError: null,
    repaymentError: null
};

// Async thunks for borrower operations
export const applyForLoan = createAsyncThunk(
    'borrower/applyForLoan',
    async (loanApplication, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const borrowerId = state.role.currentProfile?.id;
            const countryCode = state.country.currentCountry;
            
            // Section A: Validate borrower can apply
            if (state.role.metadata.isBlacklisted) {
                throw new Error('Blacklisted borrowers cannot apply for loans (Section A Rule)');
            }
            
            // Validate loan application data
            validateLoanApplication(loanApplication);
            
            // Check if borrower already has active loan in same group (Section A)
            const hasActiveLoanInGroup = await checkActiveLoanInGroup(
                borrowerId, 
                loanApplication.groupId
            );
            
            if (hasActiveLoanInGroup) {
                throw new Error('Cannot have more than one active loan per group (Section A Rule)');
            }
            
            // Check tier limits based on borrower rating and history
            const tierLimit = await calculateBorrowerLimit(
                borrowerId,
                loanApplication.subscriptionTier
            );
            
            if (loanApplication.amount > tierLimit) {
                throw new Error(`Loan amount exceeds your ${loanApplication.subscriptionTier} tier limit of ${tierLimit}`);
            }
            
            // Validate loan category (must be from emergency categories)
            const isValidCategory = await validateLoanCategory(loanApplication.category);
            if (!isValidCategory) {
                throw new Error('Invalid loan category');
            }
            
            // Create loan application
            const application = await createLoanApplication({
                ...loanApplication,
                borrowerId,
                countryCode,
                applicationDate: new Date().toISOString(),
                status: 'pending',
                applicationId: `LOAN_APP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            });
            
            // Notify lenders in the group
            await notifyLendersInGroup(loanApplication.groupId, {
                type: 'NEW_LOAN_REQUEST',
                borrowerId,
                amount: loanApplication.amount,
                category: loanApplication.category,
                applicationId: application.id
            });
            
            return application;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const submitRepayment = createAsyncThunk(
    'borrower/submitRepayment',
    async (repaymentData, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const borrowerId = state.role.currentProfile?.id;
            
            // Validate repayment data
            validateRepaymentData(repaymentData);
            
            // Check if loan exists and belongs to borrower
            const loan = await getLoanById(repaymentData.loanId);
            if (!loan || loan.borrowerId !== borrowerId) {
                throw new Error('Loan not found or does not belong to you');
            }
            
            // Check if loan is already cleared
            if (loan.status === 'cleared' || loan.status === 'defaulted') {
                throw new Error('Cannot make repayment on cleared or defaulted loan');
            }
            
            // Calculate expected repayment
            const repaymentInfo = calculateRepaymentDetails(loan, repaymentData.amount);
            
            // Section A: Allow partial daily repayments
            if (repaymentInfo.isPartial) {
                // Log partial repayment
                await logPartialRepayment({
                    loanId: repaymentData.loanId,
                    amount: repaymentData.amount,
                    remainingBalance: repaymentInfo.remainingBalance,
                    repaymentDate: new Date().toISOString()
                });
            }
            
            // Process repayment
            const repayment = await processRepayment({
                ...repaymentData,
                borrowerId,
                repaymentDate: new Date().toISOString(),
                transactionId: `REPAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                ...repaymentInfo
            });
            
            // Update loan status if fully repaid
            if (repaymentInfo.isFullRepayment) {
                await updateLoanStatus(repaymentData.loanId, 'cleared');
                
                // Request lender rating (Section A: 5-star rating system)
                await requestLenderRating(loan.lenderId, borrowerId, loan.id);
            }
            
            return repayment;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadBorrowerProfile = createAsyncThunk(
    'borrower/loadProfile',
    async (borrowerId, { rejectWithValue }) => {
        try {
            const profile = await getBorrowerProfile(borrowerId);
            
            if (!profile) {
                throw new Error('Borrower profile not found');
            }
            
            // Load active loans
            const activeLoans = await getActiveLoans(borrowerId);
            
            // Load borrow history
            const borrowHistory = await getBorrowHistory(borrowerId);
            
            // Load rating and reviews
            const ratingData = await getBorrowerRating(borrowerId);
            
            // Load blacklist status
            const blacklistStatus = await getBlacklistStatus(borrowerId);
            
            // Load groups
            const groups = await getBorrowerGroups(borrowerId);
            
            // Calculate borrowing power
            const borrowingPower = calculateBorrowingPower(profile, ratingData, borrowHistory);
            
            return {
                profile,
                activeLoans,
                borrowHistory,
                rating: ratingData,
                blacklistStatus,
                groups,
                borrowingPower,
                limits: {
                    maxGroups: 4,
                    currentGroups: groups.length,
                    canJoinNewGroups: !blacklistStatus.isBlacklisted && groups.length < 4 && ratingData.current >= 3.0,
                    maxActiveLoans: groups.length, // One per group
                    totalBorrowed: borrowHistory.reduce((sum, loan) => sum + loan.amount, 0),
                    currentBorrowed: activeLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0),
                    borrowingPower
                }
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBorrowerRating = createAsyncThunk(
    'borrower/updateRating',
    async ({ borrowerId, rating, review, lenderId, loanId }, { rejectWithValue }) => {
        try {
            // Section A: Validate rating (1-5 stars)
            if (rating < 1 || rating > 5) {
                throw new Error('Rating must be between 1 and 5 stars');
            }
            
            // Check if lender can rate this borrower for this loan
            const canRate = await validateRatingEligibility(lenderId, borrowerId, loanId);
            if (!canRate) {
                throw new Error('Not eligible to rate this borrower for the specified loan');
            }
            
            // Update borrower rating
            const updatedRating = await addBorrowerRating({
                borrowerId,
                rating,
                review,
                lenderId,
                loanId,
                ratedAt: new Date().toISOString()
            });
            
            // Recalculate overall rating
            const newOverallRating = await recalculateBorrowerRating(borrowerId);
            
            // Update borrower's group access based on new rating
            await updateGroupAccessBasedOnRating(borrowerId, newOverallRating);
            
            return {
                newRating: newOverallRating,
                recentRating: updatedRating
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkLoanEligibility = createAsyncThunk(
    'borrower/checkEligibility',
    async ({ amount, groupId, category, tier }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const borrowerId = state.role.currentProfile?.id;
            
            // Check blacklist status
            if (state.borrower.blacklistStatus.isBlacklisted) {
                return {
                    eligible: false,
                    reason: 'Blacklisted borrowers cannot apply for loans',
                    blacklistDetails: state.borrower.blacklistStatus
                };
            }
            
            // Check active loans in group
            const activeLoanInGroup = state.borrower.activeLoans.find(
                loan => loan.groupId === groupId && loan.status === 'active'
            );
            
            if (activeLoanInGroup) {
                return {
                    eligible: false,
                    reason: 'Cannot have more than one active loan per group',
                    existingLoan: activeLoanInGroup
                };
            }
            
            // Check tier limits
            const tierLimit = await calculateBorrowerLimit(borrowerId, tier);
            if (amount > tierLimit) {
                return {
                    eligible: false,
                    reason: `Amount exceeds ${tier} tier limit of ${tierLimit}`,
                    requested: amount,
                    limit: tierLimit
                };
            }
            
            // Check borrowing power
            const borrowingPower = state.borrower.limits.borrowingPower;
            if (amount > borrowingPower) {
                return {
                    eligible: false,
                    reason: `Amount exceeds your current borrowing power of ${borrowingPower}`,
                    requested: amount,
                    borrowingPower
                };
            }
            
            // Check category access
            const hasCategoryAccess = await checkCategoryAccess(borrowerId, category);
            if (!hasCategoryAccess) {
                return {
                    eligible: false,
                    reason: 'No access to this loan category',
                    category
                };
            }
            
            // All checks passed
            return {
                eligible: true,
                amount,
                category,
                tier,
                groupId,
                estimatedInterest: amount * 0.10, // 10% interest
                estimatedTotal: amount * 1.10,
                repaymentPeriod: 7, // days
                dailyRepayment: (amount * 1.10) / 7
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const migrateToNewGroup = createAsyncThunk(
    'borrower/migrateToNewGroup',
    async ({ newGroupId, referrerId }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const borrowerId = state.role.currentProfile?.id;
            
            // Section A: Check if borrower can migrate (good repayment record required)
            const canMigrate = await checkMigrationEligibility(borrowerId);
            if (!canMigrate) {
                throw new Error('Cannot migrate to new group. Good repayment record required.');
            }
            
            // Check if already in 4 groups
            if (state.borrower.limits.currentGroups >= 4) {
                throw new Error('Cannot join more than 4 groups. Leave a group first.');
            }
            
            // Check if already in the group
            const isAlreadyMember = state.borrower.groups.some(g => g.id === newGroupId);
            if (isAlreadyMember) {
                throw new Error('Already a member of this group');
            }
            
            // Validate referrer (Section A: Must be referred by someone who knows them well)
            const isValidReferrer = await validateReferrer(referrerId, newGroupId);
            if (!isValidReferrer) {
                throw new Error('Invalid referrer or referrer not in target group');
            }
            
            // Migrate to new group
            const migrationResult = await addBorrowerToGroup(borrowerId, newGroupId, referrerId);
            
            return {
                success: true,
                newGroupId,
                referrerId,
                migrationDate: new Date().toISOString(),
                remainingGroups: state.borrower.limits.currentGroups + 1
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create slice
const borrowerSlice = createSlice({
    name: 'borrower',
    initialState,
    reducers: {
        // Update borrower profile
        updateProfile: (state, action) => {
            if (state.profile) {
                state.profile = {
                    ...state.profile,
                    ...action.payload,
                    updatedAt: new Date().toISOString()
                };
            }
        },
        
        // Add new loan
        addNewLoan: (state, action) => {
            state.activeLoans.push(action.payload);
            state.limits.currentBorrowed += action.payload.amount;
        },
        
        // Update loan status
        updateLoanStatus: (state, action) => {
            const { loanId, status, updatedFields } = action.payload;
            const loanIndex = state.activeLoans.findIndex(loan => loan.id === loanId);
            
            if (loanIndex !== -1) {
                state.activeLoans[loanIndex] = {
                    ...state.activeLoans[loanIndex],
                    status,
                    ...updatedFields,
                    updatedAt: new Date().toISOString()
                };
                
                // If loan is cleared, move to history
                if (status === 'cleared' || status === 'defaulted') {
                    const clearedLoan = state.activeLoans[loanIndex];
                    state.borrowHistory.push(clearedLoan);
                    state.activeLoans.splice(loanIndex, 1);
                    state.limits.currentBorrowed -= clearedLoan.remainingBalance || clearedLoan.amount;
                }
            }
        },
        
        // Add repayment
        addRepayment: (state, action) => {
            const repayment = action.payload;
            state.repayments.push(repayment);
            
            // Update corresponding loan
            const loanIndex = state.activeLoans.findIndex(loan => loan.id === repayment.loanId);
            if (loanIndex !== -1) {
                const loan = state.activeLoans[loanIndex];
                loan.totalRepaid = (loan.totalRepaid || 0) + repayment.amount;
                loan.remainingBalance = Math.max(0, loan.totalAmount - loan.totalRepaid);
                
                // Update limits
                state.limits.currentBorrowed = Math.max(0, state.limits.currentBorrowed - repayment.amount);
                
                // If fully repaid, update status
                if (loan.remainingBalance <= 0) {
                    loan.status = 'cleared';
                    loan.clearedAt = new Date().toISOString();
                    
                    // Move to history
                    state.borrowHistory.push({ ...loan });
                    state.activeLoans.splice(loanIndex, 1);
                }
            }
        },
        
        // Update blacklist status
        updateBlacklistStatus: (state, action) => {
            state.blacklistStatus = {
                ...state.blacklistStatus,
                ...action.payload
            };
            
            // Update limits based on blacklist status
            if (action.payload.isBlacklisted) {
                state.limits.canJoinNewGroups = false;
            }
        },
        
        // Update rating
        updateRating: (state, action) => {
            const { rating, review } = action.payload;
            
            state.rating.history.push({
                rating,
                review,
                date: new Date().toISOString()
            });
            
            // Recalculate average rating
            const totalRatings = state.rating.history.length;
            const sumRatings = state.rating.history.reduce((sum, r) => sum + r.rating, 0);
            state.rating.current = totalRatings > 0 ? sumRatings / totalRatings : 5.0;
            
            // Update group access based on rating
            if (state.rating.current >= 3.0 && !state.blacklistStatus.isBlacklisted) {
                state.limits.canJoinNewGroups = state.limits.currentGroups < 4;
            } else {
                state.limits.canJoinNewGroups = false;
            }
        },
        
        // Add group
        addGroup: (state, action) => {
            const newGroup = action.payload;
            
            // Check if not already in group
            if (!state.groups.some(g => g.id === newGroup.id)) {
                state.groups.push(newGroup);
                state.limits.currentGroups = state.groups.length;
                state.limits.canJoinNewGroups = state.limits.currentGroups < 4 && 
                                                state.rating.current >= 3.0 &&
                                                !state.blacklistStatus.isBlacklisted;
            }
        },
        
        // Remove group
        removeGroup: (state, action) => {
            const groupId = action.payload;
            state.groups = state.groups.filter(g => g.id !== groupId);
            state.limits.currentGroups = state.groups.length;
            state.limits.canJoinNewGroups = state.limits.currentGroups < 4 && 
                                            state.rating.current >= 3.0 &&
                                            !state.blacklistStatus.isBlacklisted;
        },
        
        // Clear borrower state
        clearBorrowerState: (state) => {
            Object.assign(state, initialState);
        },
        
        // Calculate loan repayment details
        calculateLoanRepayment: (state, action) => {
            const { loanId, repaymentDate } = action.payload;
            const loan = state.activeLoans.find(l => l.id === loanId);
            
            if (!loan) {
                throw new Error('Loan not found');
            }
            
            const dueDate = new Date(loan.dueDate);
            const currentDate = repaymentDate ? new Date(repaymentDate) : new Date();
            const daysLate = Math.max(0, Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24)));
            
            let penalty = 0;
            if (daysLate > 0) {
                // Section A: 5% daily penalty after 7 days
                penalty = loan.remainingBalance * 0.05 * daysLate;
            }
            
            const totalDue = loan.remainingBalance + penalty;
            
            return {
                loanId,
                principal: loan.remainingBalance,
                interest: 0, // Already included in total amount
                penalty,
                totalDue,
                daysLate,
                isDefault: daysLate > 60, // Section A: Default after 2 months
                dueDate: loan.dueDate,
                currentDate: currentDate.toISOString()
            };
        },
        
        // Get borrower summary
        getBorrowerSummary: (state) => {
            return {
                profile: state.profile,
                activeLoans: state.activeLoans.length,
                totalBorrowed: state.limits.totalBorrowed,
                currentBorrowed: state.limits.currentBorrowed,
                rating: state.rating.current,
                groups: state.groups.length,
                blacklisted: state.blacklistStatus.isBlacklisted,
                canBorrow: !state.blacklistStatus.isBlacklisted && 
                          state.activeLoans.length < state.groups.length &&
                          state.limits.borrowingPower > 0
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Apply for loan cases
            .addCase(applyForLoan.pending, (state) => {
                state.isApplying = true;
                state.applicationError = null;
            })
            .addCase(applyForLoan.fulfilled, (state, action) => {
                state.isApplying = false;
                state.pendingApplications.push(action.payload);
            })
            .addCase(applyForLoan.rejected, (state, action) => {
                state.isApplying = false;
                state.applicationError = action.payload || action.error.message;
            })
            
            // Submit repayment cases
            .addCase(submitRepayment.pending, (state) => {
                state.isRepaying = true;
                state.repaymentError = null;
            })
            .addCase(submitRepayment.fulfilled, (state, action) => {
                state.isRepaying = false;
                state.repayments.push(action.payload);
                
                // Update corresponding loan
                const loanIndex = state.activeLoans.findIndex(loan => loan.id === action.payload.loanId);
                if (loanIndex !== -1) {
                    const loan = state.activeLoans[loanIndex];
                    loan.totalRepaid = (loan.totalRepaid || 0) + action.payload.amount;
                    loan.remainingBalance = Math.max(0, loan.totalAmount - loan.totalRepaid);
                    
                    if (loan.remainingBalance <= 0) {
                        loan.status = 'cleared';
                        loan.clearedAt = new Date().toISOString();
                        
                        // Move to history
                        state.borrowHistory.push({ ...loan });
                        state.activeLoans.splice(loanIndex, 1);
                    }
                }
            })
            .addCase(submitRepayment.rejected, (state, action) => {
                state.isRepaying = false;
                state.repaymentError = action.payload || action.error.message;
            })
            
            // Load borrower profile cases
            .addCase(loadBorrowerProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadBorrowerProfile.fulfilled, (state, action) => {
                const {
                    profile,
                    activeLoans,
                    borrowHistory,
                    rating,
                    blacklistStatus,
                    groups,
                    limits
                } = action.payload;
                
                state.isLoading = false;
                state.profile = profile;
                state.activeLoans = activeLoans;
                state.borrowHistory = borrowHistory;
                state.rating = rating;
                state.blacklistStatus = blacklistStatus;
                state.groups = groups;
                state.limits = limits;
            })
            .addCase(loadBorrowerProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            
            // Update borrower rating cases
            .addCase(updateBorrowerRating.fulfilled, (state, action) => {
                const { newRating, recentRating } = action.payload;
                
                state.rating.current = newRating;
                state.rating.history.push(recentRating);
                state.rating.lenderRatings.push(recentRating);
                
                // Update group access based on new rating
                if (newRating >= 3.0 && !state.blacklistStatus.isBlacklisted) {
                    state.limits.canJoinNewGroups = state.limits.currentGroups < 4;
                } else {
                    state.limits.canJoinNewGroups = false;
                }
            })
            
            // Check loan eligibility cases
            .addCase(checkLoanEligibility.fulfilled, (state, action) => {
                // Eligibility check completed, result stored in action payload
                // We can store this temporarily if needed
            })
            
            // Migrate to new group cases
            .addCase(migrateToNewGroup.fulfilled, (state, action) => {
                const { newGroupId, referrerId, remainingGroups } = action.payload;
                
                // Add to groups (group details would be loaded separately)
                state.limits.currentGroups = remainingGroups;
                state.limits.canJoinNewGroups = remainingGroups < 4 && 
                                                state.rating.current >= 3.0 &&
                                                !state.blacklistStatus.isBlacklisted;
            });
    }
});

// Selectors
export const selectBorrowerProfile = (state) => state.borrower.profile;
export const selectActiveLoans = (state) => state.borrower.activeLoans;
export const selectBorrowHistory = (state) => state.borrower.borrowHistory;
export const selectBorrowerRating = (state) => state.borrower.rating;
export const selectBlacklistStatus = (state) => state.borrower.blacklistStatus;
export const selectBorrowerLimits = (state) => state.borrower.limits;
export const selectBorrowerGroups = (state) => state.borrower.groups;
export const selectIsLoading = (state) => state.borrower.isLoading;
export const selectCanBorrow = (state) => {
    const borrower = state.borrower;
    return !borrower.blacklistStatus.isBlacklisted && 
           borrower.activeLoans.length < borrower.groups.length &&
           borrower.limits.borrowingPower > 0;
};

export const selectTotalBorrowed = (state) => state.borrower.limits.totalBorrowed;
export const selectCurrentBorrowed = (state) => state.borrower.limits.currentBorrowed;
export const selectBorrowingPower = (state) => state.borrower.limits.borrowingPower;
export const selectCanJoinNewGroups = (state) => state.borrower.limits.canJoinNewGroups;

export const selectBorrowerSummary = (state) => ({
    name: state.borrower.profile?.full_name || 'Unknown',
    rating: state.borrower.rating.current,
    activeLoans: state.borrower.activeLoans.length,
    totalGroups: state.borrower.groups.length,
    totalBorrowed: state.borrower.limits.totalBorrowed,
    repaymentRate: calculateRepaymentRate(state.borrower.borrowHistory),
    isBlacklisted: state.borrower.blacklistStatus.isBlacklisted,
    canBorrow: selectCanBorrow(state)
});

// Helper functions
const validateLoanApplication = (application) => {
    const requiredFields = ['amount', 'groupId', 'category', 'purpose', 'subscriptionTier'];
    const missingFields = requiredFields.filter(field => !application[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (application.amount <= 0) {
        throw new Error('Loan amount must be greater than 0');
    }
    
    // Section A: Minimum loan as low as 5 KSh (or equivalent)
    if (application.amount < 5) {
        throw new Error('Minimum loan amount is 5');
    }
    
    const validTiers = ['basic', 'premium', 'super', 'lender_of_lenders'];
    if (!validTiers.includes(application.subscriptionTier)) {
        throw new Error(`Invalid subscription tier. Must be one of: ${validTiers.join(', ')}`);
    }
};

const validateRepaymentData = (repaymentData) => {
    if (!repaymentData.loanId || !repaymentData.amount) {
        throw new Error('Loan ID and amount are required');
    }
    
    if (repaymentData.amount <= 0) {
        throw new Error('Repayment amount must be greater than 0');
    }
};

const calculateRepaymentDetails = (loan, repaymentAmount) => {
    const remainingBalance = loan.remainingBalance || loan.totalAmount;
    const isFullRepayment = repaymentAmount >= remainingBalance;
    const isPartial = repaymentAmount < remainingBalance;
    const newBalance = Math.max(0, remainingBalance - repaymentAmount);
    
    return {
        isFullRepayment,
        isPartial,
        remainingBalance: newBalance,
        previousBalance: remainingBalance,
        amountPaid: repaymentAmount
    };
};

const getBorrowerProfile = async (borrowerId) => {
    // Mock implementation
    const profiles = JSON.parse(localStorage.getItem('mpesewa_borrower_profiles') || '{}');
    return profiles[borrowerId] || null;
};

const getActiveLoans = async (borrowerId) => {
    // Mock implementation
    const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
    return loans.filter(loan => loan.borrowerId === borrowerId && loan.status === 'active');
};

const getBorrowHistory = async (borrowerId) => {
    // Mock implementation
    const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
    return loans.filter(loan => loan.borrowerId === borrowerId && loan.status !== 'active');
};

const getBorrowerRating = async (borrowerId) => {
    // Mock implementation
    const ratings = JSON.parse(localStorage.getItem('mpesewa_borrower_ratings') || '[]');
    const borrowerRatings = ratings.filter(r => r.borrowerId === borrowerId);
    
    const current = borrowerRatings.length > 0
        ? borrowerRatings.reduce((sum, r) => sum + r.rating, 0) / borrowerRatings.length
        : 5.0;
    
    return {
        current,
        history: borrowerRatings,
        reviews: borrowerRatings.filter(r => r.review),
        lenderRatings: borrowerRatings
    };
};

const getBlacklistStatus = async (borrowerId) => {
    // Mock implementation
    const blacklist = JSON.parse(localStorage.getItem('mpesewa_blacklist') || '[]');
    const status = blacklist.find(item => item.borrowerId === borrowerId);
    
    return status || {
        isBlacklisted: false,
        reason: null,
        dateBlacklisted: null,
        amountOwed: 0,
        daysOverdue: 0,
        canAppeal: false
    };
};

const getBorrowerGroups = async (borrowerId) => {
    // Mock implementation
    const groupMemberships = JSON.parse(localStorage.getItem('mpesewa_group_memberships') || '[]');
    return groupMemberships
        .filter(m => m.userId === borrowerId && m.roleType === 'borrower')
        .map(m => ({ id: m.groupId, role: m.role, joinedDate: m.joinedDate }));
};

const calculateBorrowingPower = (profile, ratingData, borrowHistory) => {
    // Section A: Calculate based on rating, history, and tier
    const basePower = 1000; // Base borrowing power
    const ratingMultiplier = ratingData.current / 5.0; // 0.2 to 1.0
    const historyMultiplier = borrowHistory.length > 0 
        ? Math.min(borrowHistory.filter(l => l.status === 'cleared').length / borrowHistory.length, 1.0)
        : 1.0;
    
    return Math.floor(basePower * ratingMultiplier * historyMultiplier);
};

const checkActiveLoanInGroup = async (borrowerId, groupId) => {
    const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
    return loans.some(loan => 
        loan.borrowerId === borrowerId && 
        loan.groupId === groupId && 
        loan.status === 'active'
    );
};

const calculateBorrowerLimit = async (borrowerId, tier) => {
    // Section A: Tier limits
    const tierLimits = {
        basic: 1500,
        premium: 5000,
        super: 20000,
        lender_of_lenders: 50000
    };
    
    return tierLimits[tier] || tierLimits.basic;
};

const validateLoanCategory = async (category) => {
    // Section A: 20 emergency categories
    const validCategories = [
        'fare', 'data', 'gas', 'food', 'wifi', 'water', 'electricity', 'tv',
        'fuel', 'repair', 'credo', 'sales', 'capital', 'soko', 'kidandaski',
        'hawker', 'fuliziwa', 'medicine', 'school', 'advance'
    ];
    
    return validCategories.includes(category);
};

const checkCategoryAccess = async (borrowerId, category) => {
    // For now, all borrowers have access to all categories
    return true;
};

const createLoanApplication = async (applicationData) => {
    // Mock implementation
    const applications = JSON.parse(localStorage.getItem('mpesewa_loan_applications') || '[]');
    applications.push(applicationData);
    localStorage.setItem('mpesewa_loan_applications', JSON.stringify(applications));
    
    return applicationData;
};

const getLoanById = async (loanId) => {
    const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
    return loans.find(loan => loan.id === loanId);
};

const processRepayment = async (repaymentData) => {
    // Mock implementation
    const repayments = JSON.parse(localStorage.getItem('mpesewa_repayments') || '[]');
    repayments.push(repaymentData);
    localStorage.setItem('mpesewa_repayments', JSON.stringify(repayments));
    
    return repaymentData;
};

const updateLoanStatus = async (loanId, status) => {
    const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
    const loanIndex = loans.findIndex(loan => loan.id === loanId);
    
    if (loanIndex !== -1) {
        loans[loanIndex].status = status;
        loans[loanIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('mpesewa_loans', JSON.stringify(loans));
    }
};

const requestLenderRating = async (lenderId, borrowerId, loanId) => {
    // Notify lender to rate borrower
    const ratingRequests = JSON.parse(localStorage.getItem('mpesewa_rating_requests') || '[]');
    ratingRequests.push({
        lenderId,
        borrowerId,
        loanId,
        requestedAt: new Date().toISOString(),
        status: 'pending'
    });
    localStorage.setItem('mpesewa_rating_requests', JSON.stringify(ratingRequests));
};

const validateRatingEligibility = async (lenderId, borrowerId, loanId) => {
    // Check if lender lent to this borrower for this loan
    const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
    const loan = loans.find(l => 
        l.id === loanId && 
        l.lenderId === lenderId && 
        l.borrowerId === borrowerId &&
        l.status === 'cleared'
    );
    
    return !!loan;
};

const addBorrowerRating = async (ratingData) => {
    const ratings = JSON.parse(localStorage.getItem('mpesewa_borrower_ratings') || '[]');
    ratings.push(ratingData);
    localStorage.setItem('mpesewa_borrower_ratings', JSON.stringify(ratings));
    
    return ratingData;
};

const recalculateBorrowerRating = async (borrowerId) => {
    const ratings = JSON.parse(localStorage.getItem('mpesewa_borrower_ratings') || '[]');
    const borrowerRatings = ratings.filter(r => r.borrowerId === borrowerId);
    
    if (borrowerRatings.length === 0) return 5.0;
    
    return borrowerRatings.reduce((sum, r) => sum + r.rating, 0) / borrowerRatings.length;
};

const updateGroupAccessBasedOnRating = async (borrowerId, rating) => {
    // Update borrower's ability to join new groups based on rating
    const userGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${borrowerId}_groups`) || '[]');
    const canJoinNewGroups = userGroups.length < 4 && rating >= 3.0;
    
    // This would update the borrower's profile
    const profiles = JSON.parse(localStorage.getItem('mpesewa_borrower_profiles') || '{}');
    if (profiles[borrowerId]) {
        profiles[borrowerId].canJoinNewGroups = canJoinNewGroups;
        localStorage.setItem('mpesewa_borrower_profiles', JSON.stringify(profiles));
    }
};

const checkMigrationEligibility = async (borrowerId) => {
    // Check repayment history
    const loans = JSON.parse(localStorage.getItem('mpesewa_loans') || '[]');
    const borrowerLoans = loans.filter(loan => loan.borrowerId === borrowerId);
    
    if (borrowerLoans.length === 0) return true; // No loans, can migrate
    
    const clearedLoans = borrowerLoans.filter(loan => loan.status === 'cleared');
    const defaultedLoans = borrowerLoans.filter(loan => loan.status === 'defaulted');
    
    // Good repayment record = no defaults and at least 80% repayment rate
    const repaymentRate = clearedLoans.length / borrowerLoans.length;
    return defaultedLoans.length === 0 && repaymentRate >= 0.8;
};

const validateReferrer = async (referrerId, groupId) => {
    // Check if referrer is a member of the group
    const memberships = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_members`) || '[]');
    return memberships.some(m => m.id === referrerId);
};

const addBorrowerToGroup = async (borrowerId, groupId, referrerId) => {
    // Add borrower to group
    const memberships = JSON.parse(localStorage.getItem(`mpesewa_group_${groupId}_members`) || '[]');
    memberships.push({
        id: borrowerId,
        role: 'member',
        roleType: 'borrower',
        joinedDate: new Date().toISOString(),
        referredBy: referrerId
    });
    localStorage.setItem(`mpesewa_group_${groupId}_members`, JSON.stringify(memberships));
    
    return { success: true };
};

const notifyLendersInGroup = async (groupId, notification) => {
    // Mock implementation
    const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
};

const logPartialRepayment = async (repaymentData) => {
    const partialRepayments = JSON.parse(localStorage.getItem('mpesewa_partial_repayments') || '[]');
    partialRepayments.push(repaymentData);
    localStorage.setItem('mpesewa_partial_repayments', JSON.stringify(partialRepayments));
};

const calculateRepaymentRate = (borrowHistory) => {
    if (borrowHistory.length === 0) return 100;
    
    const clearedLoans = borrowHistory.filter(loan => loan.status === 'cleared');
    return Math.round((clearedLoans.length / borrowHistory.length) * 100);
};

// Export actions and reducer
export const {
    updateProfile,
    addNewLoan,
    updateLoanStatus,
    addRepayment,
    updateBlacklistStatus,
    updateRating,
    addGroup,
    removeGroup,
    clearBorrowerState,
    calculateLoanRepayment,
    getBorrowerSummary
} = borrowerSlice.actions;

export default borrowerSlice.reducer;

/**
 * BORROWER HIERARCHY ENFORCEMENT (Section A Strict Rules):
 * 
 * 1. Unlimited borrowers per lender
 * 2. Borrower may join up to 4 groups (good rating required)
 * 3. Borrowers may also be lenders (dual roles allowed)
 * 4. Borrowers pay NO subscription fees
 * 5. Maximum of 1 active loan per group
 * 6. 7-day repayment period with 10% interest
 * 7. Partial daily repayments allowed
 * 8. 5% daily penalty after day 7
 * 9. Default after 2 months leads to blacklisting
 * 10. 5-star borrower rating system
 * 11. Migration to new groups requires good repayment record and referral
 * 12. Blacklisted borrowers cannot borrow or join new groups
 */