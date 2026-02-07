/**
 * M-PESEWA LEDGER SLICE
 * Strictly follows Section A rules for ledger management - Core feature
 * Ledger System: Auto-generated on loan approval, unlimited ledgers per lender
 */

import { createSlice, createAsyncThunk } from 'reduxjs/toolkit';

// Initial state with strict ledger rules enforcement
const initialState = {
    // Current ledger being viewed/edited
    currentLedger: null,
    
    // Ledgers organized by status
    ledgers: [],
    activeLedgers: [],
    clearedLedgers: [],
    defaultedLedgers: [],
    pendingLedgers: [],
    
    // Ledger statistics
    statistics: {
        totalLedgers: 0,
        totalAmount: 0,
        totalInterestEarned: 0,
        totalPenalties: 0,
        activeAmount: 0,
        clearedAmount: 0,
        defaultedAmount: 0,
        avgLoanAmount: 0,
        avgRepaymentDays: 0,
        repaymentRate: 0
    },
    
    // Ledger filters and search
    filters: {
        status: 'all',
        category: 'all',
        dateRange: 'all',
        minAmount: null,
        maxAmount: null,
        borrowerName: '',
        groupId: null
    },
    
    // Ledger calculations and projections
    calculations: {
        dailyInterest: 0,
        weeklyProjection: 0,
        monthlyProjection: 0,
        expectedRepayments: [],
        upcomingDueDates: []
    },
    
    // Ledger operations state
    isCreating: false,
    isUpdating: false,
    isCalculating: false,
    isExporting: false,
    isReconciling: false,
    
    // Error states
    error: null,
    calculationError: null,
    updateError: null,
    
    // Ledger audit trail
    auditTrail: [],
    
    // Ledger templates and settings
    templates: [],
    settings: {
        autoCalculateInterest: true,
        autoApplyPenalties: true,
        notifyOnDueDate: true,
        notifyOnOverdue: true,
        defaultInterestRate: 0.10,
        defaultPenaltyRate: 0.05,
        defaultRepaymentPeriod: 7
    }
};

// Async thunks for ledger operations
export const createLedger = createAsyncThunk(
    'ledger/create',
    async (ledgerData, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const lenderId = state.role.currentProfile?.id;
            
            // Section A: Validate ledger data
            validateLedgerData(ledgerData);
            
            // Check if lender can create ledger (active subscription required)
            if (state.lender.subscription.status !== 'active') {
                throw new Error('Active subscription required to create ledgers');
            }
            
            // Check if borrower is in same group (Section A: Group isolation)
            const isInSameGroup = await checkSameGroup(lenderId, ledgerData.borrowerId);
            if (!isInSameGroup) {
                throw new Error('Can only create ledger for borrowers in the same group');
            }
            
            // Calculate loan terms (Section A: 10% interest, 7 days)
            const loanTerms = calculateLoanTerms(ledgerData);
            
            // Create ledger with auto-generated fields
            const ledger = await createLedgerRecord({
                ...ledgerData,
                lenderId,
                ...loanTerms,
                status: 'active',
                createdDate: new Date().toISOString(),
                ledgerId: `LEDGER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            });
            
            // Add guarantor/referrer records (Section A: 2 guarantors required)
            if (ledgerData.guarantors && ledgerData.guarantors.length >= 2) {
                await addGuarantors(ledger.id, ledgerData.guarantors);
            }
            
            // Notify borrower
            await notifyBorrowerOfLedger(ledgerData.borrowerId, ledger);
            
            // Audit trail entry
            await addAuditTrailEntry({
                ledgerId: ledger.id,
                action: 'CREATED',
                performedBy: lenderId,
                details: `Created ledger for amount ${ledger.amount}`,
                timestamp: new Date().toISOString()
            });
            
            return ledger;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateLedger = createAsyncThunk(
    'ledger/update',
    async ({ ledgerId, updates }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            const userRole = state.role.currentRole;
            
            // Get ledger
            const ledger = await getLedgerById(ledgerId);
            if (!ledger) {
                throw new Error('Ledger not found');
            }
            
            // Check permissions (Section A: Lender or Admin can update)
            const canUpdate = await checkLedgerUpdatePermission(ledgerId, userId, userRole);
            if (!canUpdate) {
                throw new Error('Not authorized to update this ledger');
            }
            
            // Validate updates
            validateLedgerUpdates(ledger, updates);
            
            // Calculate any changes (repayments, penalties, etc.)
            const calculatedUpdates = await calculateLedgerUpdates(ledger, updates);
            
            // Update ledger
            const updatedLedger = await updateLedgerRecord(ledgerId, {
                ...updates,
                ...calculatedUpdates,
                updatedBy: userId,
                updatedAt: new Date().toISOString()
            });
            
            // If repayment is being recorded
            if (updates.repaymentAmount) {
                await recordRepayment({
                    ledgerId,
                    amount: updates.repaymentAmount,
                    ...calculatedUpdates.repaymentDetails,
                    recordedBy: userId,
                    recordedAt: new Date().toISOString()
                });
                
                // Update borrower rating if fully repaid
                if (calculatedUpdates.repaymentDetails.isFullRepayment) {
                    await triggerBorrowerRating(ledger.borrowerId, ledger.lenderId, ledgerId);
                }
            }
            
            // If marking as defaulted (Section A: After 2 months)
            if (updates.status === 'defaulted') {
                await handleLedgerDefault(ledgerId, ledger.borrowerId);
            }
            
            // Audit trail entry
            await addAuditTrailEntry({
                ledgerId,
                action: 'UPDATED',
                performedBy: userId,
                details: `Updated ledger: ${Object.keys(updates).join(', ')}`,
                timestamp: new Date().toISOString(),
                changes: updates
            });
            
            return updatedLedger;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadLedgers = createAsyncThunk(
    'ledger/loadAll',
    async (filters = {}, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            const userRole = state.role.currentRole;
            
            // Load ledgers based on user role
            let ledgers = [];
            
            if (userRole === 'lender') {
                ledgers = await getLenderLedgers(userId, filters);
            } else if (userRole === 'borrower') {
                ledgers = await getBorrowerLedgers(userId, filters);
            } else if (userRole === 'group_admin' || userRole === 'platform_admin') {
                // Admins can see all ledgers in their group(s)
                ledgers = await getAdminLedgers(userId, userRole, filters);
            }
            
            // Calculate statistics
            const statistics = calculateLedgerStatistics(ledgers);
            
            // Calculate projections
            const calculations = calculateLedgerProjections(ledgers);
            
            // Apply additional filters
            const filteredLedgers = applyLedgerFilters(ledgers, filters);
            
            // Categorize by status
            const activeLedgers = filteredLedgers.filter(l => l.status === 'active');
            const clearedLedgers = filteredLedgers.filter(l => l.status === 'cleared');
            const defaultedLedgers = filteredLedgers.filter(l => l.status === 'defaulted');
            const pendingLedgers = filteredLedgers.filter(l => l.status === 'pending');
            
            return {
                ledgers: filteredLedgers,
                activeLedgers,
                clearedLedgers,
                defaultedLedgers,
                pendingLedgers,
                statistics,
                calculations,
                filters
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const calculateRepaymentSchedule = createAsyncThunk(
    'ledger/calculateSchedule',
    async ({ ledgerId, repaymentStrategy }, { rejectWithValue }) => {
        try {
            const ledger = await getLedgerById(ledgerId);
            if (!ledger) {
                throw new Error('Ledger not found');
            }
            
            // Calculate repayment schedule based on strategy
            const schedule = calculateRepaymentStrategy(ledger, repaymentStrategy);
            
            return {
                ledgerId,
                schedule,
                totalInterest: schedule.totalInterest,
                totalPenalties: schedule.totalPenalties,
                totalRepayment: schedule.totalRepayment,
                dailyAmount: schedule.dailyAmount
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const exportLedgers = createAsyncThunk(
    'ledger/export',
    async (exportOptions, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const ledgers = state.ledger.ledgers;
            const filters = state.ledger.filters;
            
            // Format ledgers for export
            const exportData = formatLedgersForExport(ledgers, exportOptions);
            
            // Generate export file
            const exportResult = await generateExportFile(exportData, exportOptions.format);
            
            // Log export activity
            await logExportActivity({
                userId: state.role.currentProfile?.id,
                format: exportOptions.format,
                recordCount: ledgers.length,
                filters,
                timestamp: new Date().toISOString()
            });
            
            return exportResult;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const reconcileLedger = createAsyncThunk(
    'ledger/reconcile',
    async ({ ledgerId, reconciliationData }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            
            // Get ledger
            const ledger = await getLedgerById(ledgerId);
            if (!ledger) {
                throw new Error('Ledger not found');
            }
            
            // Check if user can reconcile (lender or admin)
            const canReconcile = await checkReconciliationPermission(ledgerId, userId);
            if (!canReconcile) {
                throw new Error('Not authorized to reconcile this ledger');
            }
            
            // Perform reconciliation
            const reconciliation = await performReconciliation(ledgerId, reconciliationData);
            
            // Update ledger status if needed
            if (reconciliation.isBalanced) {
                await updateLedgerStatus(ledgerId, 'reconciled');
            }
            
            // Audit trail entry
            await addAuditTrailEntry({
                ledgerId,
                action: 'RECONCILED',
                performedBy: userId,
                details: `Ledger reconciled: ${reconciliation.notes}`,
                timestamp: new Date().toISOString(),
                reconciliation
            });
            
            return reconciliation;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create slice
const ledgerSlice = createSlice({
    name: 'ledger',
    initialState,
    reducers: {
        // Set current ledger
        setCurrentLedger: (state, action) => {
            state.currentLedger = action.payload;
        },
        
        // Update ledger filters
        updateFilters: (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload
            };
        },
        
        // Reset filters
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        
        // Add ledger
        addLedger: (state, action) => {
            const ledger = action.payload;
            state.ledgers.push(ledger);
            
            // Add to appropriate status array
            if (ledger.status === 'active') {
                state.activeLedgers.push(ledger);
            } else if (ledger.status === 'cleared') {
                state.clearedLedgers.push(ledger);
            } else if (ledger.status === 'defaulted') {
                state.defaultedLedgers.push(ledger);
            } else if (ledger.status === 'pending') {
                state.pendingLedgers.push(ledger);
            }
            
            // Update statistics
            updateLedgerStatistics(state);
        },
        
        // Update ledger in state
        updateLedgerInState: (state, action) => {
            const { ledgerId, updates } = action.payload;
            const ledgerIndex = state.ledgers.findIndex(l => l.id === ledgerId);
            
            if (ledgerIndex !== -1) {
                const oldLedger = state.ledgers[ledgerIndex];
                const updatedLedger = {
                    ...oldLedger,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                
                state.ledgers[ledgerIndex] = updatedLedger;
                
                // Update status arrays
                if (oldLedger.status !== updatedLedger.status) {
                    // Remove from old status array
                    if (oldLedger.status === 'active') {
                        state.activeLedgers = state.activeLedgers.filter(l => l.id !== ledgerId);
                    } else if (oldLedger.status === 'cleared') {
                        state.clearedLedgers = state.clearedLedgers.filter(l => l.id !== ledgerId);
                    } else if (oldLedger.status === 'defaulted') {
                        state.defaultedLedgers = state.defaultedLedgers.filter(l => l.id !== ledgerId);
                    } else if (oldLedger.status === 'pending') {
                        state.pendingLedgers = state.pendingLedgers.filter(l => l.id !== ledgerId);
                    }
                    
                    // Add to new status array
                    if (updatedLedger.status === 'active') {
                        state.activeLedgers.push(updatedLedger);
                    } else if (updatedLedger.status === 'cleared') {
                        state.clearedLedgers.push(updatedLedger);
                    } else if (updatedLedger.status === 'defaulted') {
                        state.defaultedLedgers.push(updatedLedger);
                    } else if (updatedLedger.status === 'pending') {
                        state.pendingLedgers.push(updatedLedger);
                    }
                } else {
                    // Update in same status array
                    const statusArray = getStatusArray(state, updatedLedger.status);
                    const statusIndex = statusArray.findIndex(l => l.id === ledgerId);
                    if (statusIndex !== -1) {
                        statusArray[statusIndex] = updatedLedger;
                    }
                }
                
                // Update current ledger if it's the one being updated
                if (state.currentLedger?.id === ledgerId) {
                    state.currentLedger = updatedLedger;
                }
                
                // Update statistics
                updateLedgerStatistics(state);
            }
        },
        
        // Remove ledger
        removeLedger: (state, action) => {
            const ledgerId = action.payload;
            
            // Remove from all arrays
            state.ledgers = state.ledgers.filter(l => l.id !== ledgerId);
            state.activeLedgers = state.activeLedgers.filter(l => l.id !== ledgerId);
            state.clearedLedgers = state.clearedLedgers.filter(l => l.id !== ledgerId);
            state.defaultedLedgers = state.defaultedLedgers.filter(l => l.id !== ledgerId);
            state.pendingLedgers = state.pendingLedgers.filter(l => l.id !== ledgerId);
            
            // Clear current ledger if it's the one being removed
            if (state.currentLedger?.id === ledgerId) {
                state.currentLedger = null;
            }
            
            // Update statistics
            updateLedgerStatistics(state);
        },
        
        // Add audit trail entry
        addAuditEntry: (state, action) => {
            state.auditTrail.push(action.payload);
            
            // Keep only last 100 entries
            if (state.auditTrail.length > 100) {
                state.auditTrail = state.auditTrail.slice(-100);
            }
        },
        
        // Update ledger settings
        updateSettings: (state, action) => {
            state.settings = {
                ...state.settings,
                ...action.payload
            };
        },
        
        // Clear ledger state
        clearLedgerState: (state) => {
            Object.assign(state, initialState);
        },
        
        // Calculate ledger details
        calculateLedgerDetails: (state, action) => {
            const { ledgerId, asOfDate } = action.payload;
            const ledger = state.ledgers.find(l => l.id === ledgerId);
            
            if (!ledger) {
                throw new Error('Ledger not found');
            }
            
            const calculationDate = asOfDate ? new Date(asOfDate) : new Date();
            const dueDate = new Date(ledger.dueDate);
            const daysLate = Math.max(0, Math.floor((calculationDate - dueDate) / (1000 * 60 * 60 * 24)));
            
            // Section A: 10% interest, 5% daily penalty after 7 days
            const principal = ledger.remainingBalance || ledger.amount;
            const interest = principal * 0.10;
            
            let penalty = 0;
            if (daysLate > 0) {
                penalty = principal * 0.05 * daysLate;
            }
            
            const totalDue = principal + interest + penalty;
            const isDefaulted = daysLate > 60; // Section A: Default after 2 months
            
            return {
                ledgerId,
                principal,
                interest,
                penalty,
                totalDue,
                daysLate,
                isDefaulted,
                dueDate: ledger.dueDate,
                calculationDate: calculationDate.toISOString(),
                status: isDefaulted ? 'defaulted' : ledger.status
            };
        },
        
        // Get ledger summary
        getLedgerSummary: (state) => {
            return {
                totalLedgers: state.statistics.totalLedgers,
                activeLedgers: state.activeLedgers.length,
                totalAmount: state.statistics.totalAmount,
                activeAmount: state.statistics.activeAmount,
                clearedAmount: state.statistics.clearedAmount,
                defaultedAmount: state.statistics.defaultedAmount,
                repaymentRate: state.statistics.repaymentRate,
                avgLoanAmount: state.statistics.avgLoanAmount
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Create ledger cases
            .addCase(createLedger.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createLedger.fulfilled, (state, action) => {
                const ledger = action.payload;
                
                state.isCreating = false;
                state.ledgers.push(ledger);
                state.activeLedgers.push(ledger);
                
                // Update statistics
                updateLedgerStatistics(state);
                
                // Add to audit trail
                state.auditTrail.push({
                    ledgerId: ledger.id,
                    action: 'CREATED',
                    timestamp: new Date().toISOString(),
                    details: `Created ledger for amount ${ledger.amount}`
                });
            })
            .addCase(createLedger.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload || action.error.message;
            })
            
            // Update ledger cases
            .addCase(updateLedger.pending, (state) => {
                state.isUpdating = true;
                state.updateError = null;
            })
            .addCase(updateLedger.fulfilled, (state, action) => {
                const updatedLedger = action.payload;
                const ledgerIndex = state.ledgers.findIndex(l => l.id === updatedLedger.id);
                
                state.isUpdating = false;
                
                if (ledgerIndex !== -1) {
                    const oldLedger = state.ledgers[ledgerIndex];
                    state.ledgers[ledgerIndex] = updatedLedger;
                    
                    // Update status arrays
                    if (oldLedger.status !== updatedLedger.status) {
                        // Remove from old status array
                        const oldStatusArray = getStatusArray(state, oldLedger.status);
                        const oldStatusIndex = oldStatusArray.findIndex(l => l.id === updatedLedger.id);
                        if (oldStatusIndex !== -1) {
                            oldStatusArray.splice(oldStatusIndex, 1);
                        }
                        
                        // Add to new status array
                        const newStatusArray = getStatusArray(state, updatedLedger.status);
                        newStatusArray.push(updatedLedger);
                    }
                    
                    // Update current ledger if it's the one being updated
                    if (state.currentLedger?.id === updatedLedger.id) {
                        state.currentLedger = updatedLedger;
                    }
                    
                    // Update statistics
                    updateLedgerStatistics(state);
                }
            })
            .addCase(updateLedger.rejected, (state, action) => {
                state.isUpdating = false;
                state.updateError = action.payload || action.error.message;
            })
            
            // Load ledgers cases
            .addCase(loadLedgers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadLedgers.fulfilled, (state, action) => {
                const {
                    ledgers,
                    activeLedgers,
                    clearedLedgers,
                    defaultedLedgers,
                    pendingLedgers,
                    statistics,
                    calculations,
                    filters
                } = action.payload;
                
                state.isLoading = false;
                state.ledgers = ledgers;
                state.activeLedgers = activeLedgers;
                state.clearedLedgers = clearedLedgers;
                state.defaultedLedgers = defaultedLedgers;
                state.pendingLedgers = pendingLedgers;
                state.statistics = statistics;
                state.calculations = calculations;
                state.filters = filters;
            })
            .addCase(loadLedgers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            
            // Calculate repayment schedule cases
            .addCase(calculateRepaymentSchedule.pending, (state) => {
                state.isCalculating = true;
                state.calculationError = null;
            })
            .addCase(calculateRepaymentSchedule.fulfilled, (state, action) => {
                state.isCalculating = false;
                // Store calculation results if needed
                if (state.currentLedger?.id === action.payload.ledgerId) {
                    state.calculations = {
                        ...state.calculations,
                        repaymentSchedule: action.payload
                    };
                }
            })
            .addCase(calculateRepaymentSchedule.rejected, (state, action) => {
                state.isCalculating = false;
                state.calculationError = action.payload || action.error.message;
            })
            
            // Export ledgers cases
            .addCase(exportLedgers.pending, (state) => {
                state.isExporting = true;
            })
            .addCase(exportLedgers.fulfilled, (state) => {
                state.isExporting = false;
            })
            .addCase(exportLedgers.rejected, (state) => {
                state.isExporting = false;
            })
            
            // Reconcile ledger cases
            .addCase(reconcileLedger.pending, (state) => {
                state.isReconciling = true;
            })
            .addCase(reconcileLedger.fulfilled, (state, action) => {
                state.isReconciling = false;
                
                // Add to audit trail
                state.auditTrail.push({
                    ledgerId: action.payload.ledgerId,
                    action: 'RECONCILED',
                    timestamp: new Date().toISOString(),
                    details: 'Ledger reconciliation completed'
                });
            })
            .addCase(reconcileLedger.rejected, (state) => {
                state.isReconciling = false;
            });
    }
});

// Helper functions
const updateLedgerStatistics = (state) => {
    const ledgers = state.ledgers;
    
    const totalLedgers = ledgers.length;
    const totalAmount = ledgers.reduce((sum, l) => sum + l.amount, 0);
    const activeAmount = state.activeLedgers.reduce((sum, l) => sum + (l.remainingBalance || l.amount), 0);
    const clearedAmount = state.clearedLedgers.reduce((sum, l) => sum + l.amount, 0);
    const defaultedAmount = state.defaultedLedgers.reduce((sum, l) => sum + l.amount, 0);
    
    const totalInterestEarned = state.clearedLedgers.reduce((sum, l) => sum + (l.interestEarned || 0), 0);
    const totalPenalties = state.clearedLedgers.reduce((sum, l) => sum + (l.penaltiesEarned || 0), 0);
    
    const avgLoanAmount = totalLedgers > 0 ? totalAmount / totalLedgers : 0;
    
    const clearedCount = state.clearedLedgers.length;
    const defaultedCount = state.defaultedLedgers.length;
    const repaymentRate = (clearedCount + defaultedCount) > 0 
        ? (clearedCount / (clearedCount + defaultedCount)) * 100 
        : 0;
    
    // Calculate average repayment days from cleared ledgers
    let totalRepaymentDays = 0;
    let countWithRepaymentData = 0;
    
    state.clearedLedgers.forEach(ledger => {
        if (ledger.createdDate && ledger.clearedDate) {
            const created = new Date(ledger.createdDate);
            const cleared = new Date(ledger.clearedDate);
            const days = Math.ceil((cleared - created) / (1000 * 60 * 60 * 24));
            totalRepaymentDays += days;
            countWithRepaymentData++;
        }
    });
    
    const avgRepaymentDays = countWithRepaymentData > 0 ? totalRepaymentDays / countWithRepaymentData : 7;
    
    state.statistics = {
        totalLedgers,
        totalAmount,
        totalInterestEarned,
        totalPenalties,
        activeAmount,
        clearedAmount,
        defaultedAmount,
        avgLoanAmount,
        avgRepaymentDays,
        repaymentRate
    };
};

const getStatusArray = (state, status) => {
    switch (status) {
        case 'active': return state.activeLedgers;
        case 'cleared': return state.clearedLedgers;
        case 'defaulted': return state.defaultedLedgers;
        case 'pending': return state.pendingLedgers;
        default: return [];
    }
};

// Selectors
export const selectCurrentLedger = (state) => state.ledger.currentLedger;
export const selectLedgers = (state) => state.ledger.ledgers;
export const selectActiveLedgers = (state) => state.ledger.activeLedgers;
export const selectClearedLedgers = (state) => state.ledger.clearedLedgers;
export const selectDefaultedLedgers = (state) => state.ledger.defaultedLedgers;
export const selectPendingLedgers = (state) => state.ledger.pendingLedgers;
export const selectLedgerStatistics = (state) => state.ledger.statistics;
export const selectLedgerFilters = (state) => state.ledger.filters;
export const selectLedgerCalculations = (state) => state.ledger.calculations;
export const selectIsLoading = (state) => state.ledger.isLoading;
export const selectAuditTrail = (state) => state.ledger.auditTrail;

export const selectFilteredLedgers = (state) => {
    const { ledgers, filters } = state.ledger;
    
    return ledgers.filter(ledger => {
        // Status filter
        if (filters.status !== 'all' && ledger.status !== filters.status) {
            return false;
        }
        
        // Category filter
        if (filters.category !== 'all' && ledger.category !== filters.category) {
            return false;
        }
        
        // Amount range filter
        if (filters.minAmount !== null && ledger.amount < filters.minAmount) {
            return false;
        }
        
        if (filters.maxAmount !== null && ledger.amount > filters.maxAmount) {
            return false;
        }
        
        // Borrower name filter
        if (filters.borrowerName && !ledger.borrowerName?.toLowerCase().includes(filters.borrowerName.toLowerCase())) {
            return false;
        }
        
        // Group filter
        if (filters.groupId && ledger.groupId !== filters.groupId) {
            return false;
        }
        
        // Date range filter (simplified)
        if (filters.dateRange !== 'all') {
            const ledgerDate = new Date(ledger.createdDate);
            const now = new Date();
            let daysAgo = 0;
            
            switch (filters.dateRange) {
                case 'today':
                    daysAgo = 1;
                    break;
                case 'week':
                    daysAgo = 7;
                    break;
                case 'month':
                    daysAgo = 30;
                    break;
                case 'quarter':
                    daysAgo = 90;
                    break;
                case 'year':
                    daysAgo = 365;
                    break;
            }
            
            if (daysAgo > 0) {
                const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
                if (ledgerDate < cutoffDate) {
                    return false;
                }
            }
        }
        
        return true;
    });
};

export const selectLedgerSummary = (state) => ({
    total: state.ledger.statistics.totalLedgers,
    active: state.ledger.activeLedgers.length,
    cleared: state.ledger.clearedLedgers.length,
    defaulted: state.ledger.defaultedLedgers.length,
    totalAmount: state.ledger.statistics.totalAmount,
    activeAmount: state.ledger.statistics.activeAmount,
    interestEarned: state.ledger.statistics.totalInterestEarned,
    repaymentRate: state.ledger.statistics.repaymentRate
});

// Helper functions (simulated implementations)
const validateLedgerData = (ledgerData) => {
    const requiredFields = [
        'borrowerId', 'borrowerName', 'amount', 'category', 
        'groupId', 'guarantors'
    ];
    
    const missingFields = requiredFields.filter(field => !ledgerData[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (ledgerData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }
    
    // Section A: Check minimum loan amount
    if (ledgerData.amount < 5) {
        throw new Error('Minimum loan amount is 5');
    }
    
    // Check guarantors (Section A: 2 guarantors required)
    if (!Array.isArray(ledgerData.guarantors) || ledgerData.guarantors.length < 2) {
        throw new Error('At least 2 guarantors are required');
    }
};

const checkSameGroup = async (lenderId, borrowerId) => {
    // Check if lender and borrower are in at least one common group
    const lenderGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${lenderId}_groups`) || '[]');
    const borrowerGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${borrowerId}_groups`) || '[]');
    
    const lenderGroupIds = lenderGroups.map(g => g.groupId);
    const borrowerGroupIds = borrowerGroups.map(g => g.groupId);
    
    return lenderGroupIds.some(groupId => borrowerGroupIds.includes(groupId));
};

const calculateLoanTerms = (ledgerData) => {
    const amount = ledgerData.amount;
    const interestRate = 0.10; // 10%
    const repaymentPeriod = 7; // days
    const penaltyRate = 0.05; // 5% daily after 7 days
    
    const interest = amount * interestRate;
    const totalAmount = amount + interest;
    const dailyRepayment = totalAmount / repaymentPeriod;
    const dueDate = new Date(Date.now() + repaymentPeriod * 24 * 60 * 60 * 1000).toISOString();
    
    return {
        amount,
        interestRate,
        interest,
        totalAmount,
        repaymentPeriod,
        penaltyRate,
        dailyRepayment,
        dueDate,
        remainingBalance: totalAmount
    };
};

const createLedgerRecord = async (ledgerData) => {
    const ledger = {
        id: ledgerData.ledgerId,
        lenderId: ledgerData.lenderId,
        borrowerId: ledgerData.borrowerId,
        borrowerName: ledgerData.borrowerName,
        borrowerContact: ledgerData.borrowerContact,
        borrowerLocation: ledgerData.borrowerLocation,
        amount: ledgerData.amount,
        category: ledgerData.category,
        groupId: ledgerData.groupId,
        interestRate: ledgerData.interestRate,
        interest: ledgerData.interest,
        totalAmount: ledgerData.totalAmount,
        repaymentPeriod: ledgerData.repaymentPeriod,
        penaltyRate: ledgerData.penaltyRate,
        dailyRepayment: ledgerData.dailyRepayment,
        dueDate: ledgerData.dueDate,
        remainingBalance: ledgerData.remainingBalance,
        status: ledgerData.status,
        createdDate: ledgerData.createdDate,
        updatedAt: ledgerData.createdDate
    };
    
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    ledgers.push(ledger);
    localStorage.setItem('mpesewa_ledgers', JSON.stringify(ledgers));
    
    return ledger;
};

const addGuarantors = async (ledgerId, guarantors) => {
    const guarantorRecords = guarantors.map((guarantor, index) => ({
        id: `GUAR_${ledgerId}_${index}`,
        ledgerId,
        name: guarantor.name,
        contact: guarantor.contact,
        relationship: guarantor.relationship,
        addedDate: new Date().toISOString()
    }));
    
    const allGuarantors = JSON.parse(localStorage.getItem('mpesewa_guarantors') || '[]');
    allGuarantors.push(...guarantorRecords);
    localStorage.setItem('mpesewa_guarantors', JSON.stringify(allGuarantors));
};

const notifyBorrowerOfLedger = async (borrowerId, ledger) => {
    const notifications = JSON.parse(localStorage.getItem('mpesewa_notifications') || '[]');
    notifications.push({
        userId: borrowerId,
        type: 'LEDGER_CREATED',
        ledgerId: ledger.id,
        amount: ledger.amount,
        dueDate: ledger.dueDate,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('mpesewa_notifications', JSON.stringify(notifications));
};

const addAuditTrailEntry = async (auditEntry) => {
    const auditTrail = JSON.parse(localStorage.getItem('mpesewa_ledger_audit') || '[]');
    auditTrail.push(auditEntry);
    localStorage.setItem('mpesewa_ledger_audit', JSON.stringify(auditTrail));
};

const getLedgerById = async (ledgerId) => {
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    return ledgers.find(l => l.id === ledgerId);
};

const checkLedgerUpdatePermission = async (ledgerId, userId, userRole) => {
    if (userRole === 'platform_admin') {
        return true; // Admin can update any ledger
    }
    
    const ledger = await getLedgerById(ledgerId);
    if (!ledger) return false;
    
    if (userRole === 'lender' && ledger.lenderId === userId) {
        return true; // Lender can update their own ledgers
    }
    
    // Check if user is group admin for this ledger's group
    const groupMemberships = JSON.parse(localStorage.getItem(`mpesewa_group_${ledger.groupId}_members`) || '[]');
    const membership = groupMemberships.find(m => m.id === userId);
    
    return membership?.role === 'admin';
};

const validateLedgerUpdates = (ledger, updates) => {
    // Cannot update cleared or defaulted ledgers (except by admin)
    if (['cleared', 'defaulted'].includes(ledger.status) && !updates.status) {
        throw new Error(`Cannot update ${ledger.status} ledger`);
    }
    
    // Validate repayment amount
    if (updates.repaymentAmount && updates.repaymentAmount <= 0) {
        throw new Error('Repayment amount must be greater than 0');
    }
    
    // Validate status transitions
    if (updates.status) {
        const validTransitions = {
            'active': ['cleared', 'defaulted'],
            'pending': ['active', 'cancelled'],
            'cleared': [], // Cannot change from cleared
            'defaulted': [] // Cannot change from defaulted (except by admin)
        };
        
        const currentStatus = ledger.status;
        const newStatus = updates.status;
        
        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }
    }
};

const calculateLedgerUpdates = async (ledger, updates) => {
    const result = {};
    
    if (updates.repaymentAmount) {
        const repaymentDetails = calculateRepaymentDetails(ledger, updates.repaymentAmount);
        result.repaymentDetails = repaymentDetails;
        
        // Update remaining balance
        result.remainingBalance = repaymentDetails.newBalance;
        
        // Add interest and penalties earned
        if (repaymentDetails.interestEarned > 0) {
            result.interestEarned = (ledger.interestEarned || 0) + repaymentDetails.interestEarned;
        }
        
        if (repaymentDetails.penaltiesEarned > 0) {
            result.penaltiesEarned = (ledger.penaltiesEarned || 0) + repaymentDetails.penaltiesEarned;
        }
        
        // Update status if fully repaid
        if (repaymentDetails.isFullRepayment) {
            result.status = 'cleared';
            result.clearedDate = new Date().toISOString();
        }
    }
    
    return result;
};

const calculateRepaymentDetails = (ledger, repaymentAmount) => {
    const remainingBalance = ledger.remainingBalance || ledger.totalAmount;
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
    
    // Calculate proportion of repayment allocated to interest and penalty
    let interestEarned = 0;
    let penaltiesEarned = 0;
    
    if (isFullRepayment) {
        interestEarned = interest;
        penaltiesEarned = penalty;
    } else {
        // Proportional allocation
        const repaymentRatio = repaymentAmount / totalDue;
        interestEarned = interest * repaymentRatio;
        penaltiesEarned = penalty * repaymentRatio;
    }
    
    return {
        interestEarned,
        penaltiesEarned,
        newBalance,
        isFullRepayment,
        daysLate,
        penaltyApplied: penalty
    };
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

const recordRepayment = async (repaymentData) => {
    const repayments = JSON.parse(localStorage.getItem('mpesewa_repayments') || '[]');
    repayments.push(repaymentData);
    localStorage.setItem('mpesewa_repayments', JSON.stringify(repayments));
};

const triggerBorrowerRating = async (borrowerId, lenderId, ledgerId) => {
    // Create rating request for lender
    const ratingRequests = JSON.parse(localStorage.getItem('mpesewa_rating_requests') || '[]');
    ratingRequests.push({
        borrowerId,
        lenderId,
        ledgerId,
        requestedAt: new Date().toISOString(),
        status: 'pending'
    });
    localStorage.setItem('mpesewa_rating_requests', JSON.stringify(ratingRequests));
};

const handleLedgerDefault = async (ledgerId, borrowerId) => {
    // Mark borrower as defaulted
    const defaults = JSON.parse(localStorage.getItem('mpesewa_defaults') || '[]');
    defaults.push({
        ledgerId,
        borrowerId,
        defaultedAt: new Date().toISOString(),
        status: 'defaulted'
    });
    localStorage.setItem('mpesewa_defaults', JSON.stringify(defaults));
    
    // Notify admin
    const adminNotifications = JSON.parse(localStorage.getItem('mpesewa_admin_notifications') || '[]');
    adminNotifications.push({
        type: 'LEDGER_DEFAULTED',
        ledgerId,
        borrowerId,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('mpesewa_admin_notifications', JSON.stringify(adminNotifications));
};

const getLenderLedgers = async (lenderId, filters) => {
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    let lenderLedgers = ledgers.filter(l => l.lenderId === lenderId);
    
    // Apply additional filters
    lenderLedgers = applyLedgerFilters(lenderLedgers, filters);
    
    return lenderLedgers;
};

const getBorrowerLedgers = async (borrowerId, filters) => {
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    let borrowerLedgers = ledgers.filter(l => l.borrowerId === borrowerId);
    
    // Apply additional filters
    borrowerLedgers = applyLedgerFilters(borrowerLedgers, filters);
    
    return borrowerLedgers;
};

const getAdminLedgers = async (userId, userRole, filters) => {
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    
    if (userRole === 'platform_admin') {
        // Platform admin can see all ledgers
        return applyLedgerFilters(ledgers, filters);
    }
    
    // Group admin can see ledgers in their groups
    const userGroups = JSON.parse(localStorage.getItem(`mpesewa_user_${userId}_groups`) || '[]');
    const groupIds = userGroups.map(g => g.groupId);
    
    const groupLedgers = ledgers.filter(l => groupIds.includes(l.groupId));
    return applyLedgerFilters(groupLedgers, filters);
};

const calculateLedgerStatistics = (ledgers) => {
    const totalLedgers = ledgers.length;
    const totalAmount = ledgers.reduce((sum, l) => sum + l.amount, 0);
    
    const activeLedgers = ledgers.filter(l => l.status === 'active');
    const clearedLedgers = ledgers.filter(l => l.status === 'cleared');
    const defaultedLedgers = ledgers.filter(l => l.status === 'defaulted');
    
    const activeAmount = activeLedgers.reduce((sum, l) => sum + (l.remainingBalance || l.amount), 0);
    const clearedAmount = clearedLedgers.reduce((sum, l) => sum + l.amount, 0);
    const defaultedAmount = defaultedLedgers.reduce((sum, l) => sum + l.amount, 0);
    
    const totalInterestEarned = clearedLedgers.reduce((sum, l) => sum + (l.interestEarned || 0), 0);
    const totalPenalties = clearedLedgers.reduce((sum, l) => sum + (l.penaltiesEarned || 0), 0);
    
    const avgLoanAmount = totalLedgers > 0 ? totalAmount / totalLedgers : 0;
    
    const clearedCount = clearedLedgers.length;
    const defaultedCount = defaultedLedgers.length;
    const repaymentRate = (clearedCount + defaultedCount) > 0 
        ? (clearedCount / (clearedCount + defaultedCount)) * 100 
        : 0;
    
    return {
        totalLedgers,
        totalAmount,
        totalInterestEarned,
        totalPenalties,
        activeAmount,
        clearedAmount,
        defaultedAmount,
        avgLoanAmount,
        repaymentRate,
        avgRepaymentDays: 7 // Default value
    };
};

const calculateLedgerProjections = (ledgers) => {
    const activeLedgers = ledgers.filter(l => l.status === 'active');
    
    // Calculate daily interest from active ledgers
    const dailyInterest = activeLedgers.reduce((sum, l) => {
        const remaining = l.remainingBalance || l.amount;
        return sum + (remaining * 0.10 / 7); // Daily interest (10% over 7 days)
    }, 0);
    
    // Weekly projection
    const weeklyProjection = dailyInterest * 7;
    
    // Monthly projection (approx 4 weeks)
    const monthlyProjection = weeklyProjection * 4;
    
    // Get upcoming due dates
    const upcomingDueDates = activeLedgers
        .map(l => ({
            ledgerId: l.id,
            borrowerName: l.borrowerName,
            amount: l.remainingBalance || l.amount,
            dueDate: l.dueDate,
            daysUntilDue: Math.ceil((new Date(l.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
        }))
        .filter(l => l.daysUntilDue <= 7) // Next 7 days
        .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
    
    // Expected repayments
    const expectedRepayments = upcomingDueDates.map(l => ({
        ...l,
        expectedAmount: l.amount * 1.10 // Principal + 10% interest
    }));
    
    return {
        dailyInterest,
        weeklyProjection,
        monthlyProjection,
        upcomingDueDates,
        expectedRepayments
    };
};

const applyLedgerFilters = (ledgers, filters) => {
    let filtered = [...ledgers];
    
    // Status filter
    if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(l => l.status === filters.status);
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(l => l.category === filters.category);
    }
    
    // Amount range filter
    if (filters.minAmount !== undefined && filters.minAmount !== null) {
        filtered = filtered.filter(l => l.amount >= filters.minAmount);
    }
    
    if (filters.maxAmount !== undefined && filters.maxAmount !== null) {
        filtered = filtered.filter(l => l.amount <= filters.maxAmount);
    }
    
    // Borrower name filter
    if (filters.borrowerName) {
        filtered = filtered.filter(l => 
            l.borrowerName?.toLowerCase().includes(filters.borrowerName.toLowerCase())
        );
    }
    
    // Group filter
    if (filters.groupId) {
        filtered = filtered.filter(l => l.groupId === filters.groupId);
    }
    
    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        let daysAgo = 0;
        
        switch (filters.dateRange) {
            case 'today': daysAgo = 1; break;
            case 'week': daysAgo = 7; break;
            case 'month': daysAgo = 30; break;
            case 'quarter': daysAgo = 90; break;
            case 'year': daysAgo = 365; break;
        }
        
        if (daysAgo > 0) {
            const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(l => new Date(l.createdDate) >= cutoffDate);
        }
    }
    
    return filtered;
};

const calculateRepaymentStrategy = (ledger, strategy) => {
    const amount = ledger.remainingBalance || ledger.amount;
    const interest = amount * 0.10;
    const totalRepayment = amount + interest;
    
    let schedule = [];
    
    switch (strategy) {
        case 'daily':
            // Daily equal payments for 7 days
            const dailyAmount = totalRepayment / 7;
            for (let i = 1; i <= 7; i++) {
                const dueDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
                schedule.push({
                    day: i,
                    amount: dailyAmount,
                    dueDate: dueDate.toISOString(),
                    type: 'principal_interest'
                });
            }
            break;
            
        case 'bullet':
            // Single payment at the end
            const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            schedule.push({
                day: 7,
                amount: totalRepayment,
                dueDate: dueDate.toISOString(),
                type: 'bullet'
            });
            break;
            
        case 'custom':
            // Custom schedule based on borrower's cash flow
            const weeklyIncome = amount * 0.5; // Assume 50% of loan amount as weekly income
            const weeklyPayment = Math.min(totalRepayment, weeklyIncome);
            const weeksNeeded = Math.ceil(totalRepayment / weeklyPayment);
            
            for (let i = 1; i <= weeksNeeded; i++) {
                const paymentAmount = i === weeksNeeded 
                    ? totalRepayment - (weeklyPayment * (weeksNeeded - 1))
                    : weeklyPayment;
                
                const dueDate = new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000);
                schedule.push({
                    week: i,
                    amount: paymentAmount,
                    dueDate: dueDate.toISOString(),
                    type: 'weekly'
                });
            }
            break;
    }
    
    return {
        schedule,
        totalInterest: interest,
        totalPenalties: 0,
        totalRepayment,
        dailyAmount: totalRepayment / 7
    };
};

const formatLedgersForExport = (ledgers, options) => {
    const { format, includeDetails, dateRange } = options;
    
    let exportLedgers = [...ledgers];
    
    // Filter by date range if specified
    if (dateRange && dateRange !== 'all') {
        const now = new Date();
        let daysAgo = 0;
        
        switch (dateRange) {
            case 'today': daysAgo = 1; break;
            case 'week': daysAgo = 7; break;
            case 'month': daysAgo = 30; break;
            case 'quarter': daysAgo = 90; break;
            case 'year': daysAgo = 365; break;
        }
        
        if (daysAgo > 0) {
            const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            exportLedgers = exportLedgers.filter(l => new Date(l.createdDate) >= cutoffDate);
        }
    }
    
    // Format data based on includeDetails
    if (includeDetails) {
        return exportLedgers.map(ledger => ({
            ID: ledger.id,
            Borrower: ledger.borrowerName,
            Amount: ledger.amount,
            Interest_Rate: `${(ledger.interestRate * 100)}%`,
            Total_Amount: ledger.totalAmount,
            Remaining_Balance: ledger.remainingBalance || 0,
            Status: ledger.status,
            Category: ledger.category,
            Created_Date: ledger.createdDate,
            Due_Date: ledger.dueDate,
            Cleared_Date: ledger.clearedDate || 'N/A',
            Interest_Earned: ledger.interestEarned || 0,
            Penalties_Earned: ledger.penaltiesEarned || 0
        }));
    } else {
        return exportLedgers.map(ledger => ({
            ID: ledger.id,
            Borrower: ledger.borrowerName,
            Amount: ledger.amount,
            Status: ledger.status,
            Created_Date: ledger.createdDate,
            Due_Date: ledger.dueDate
        }));
    }
};

const generateExportFile = async (data, format) => {
    // Simulate file generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (format === 'csv') {
        const headers = Object.keys(data[0] || {}).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;
        
        return {
            success: true,
            format: 'csv',
            data: csvContent,
            filename: `ledgers_export_${new Date().toISOString().split('T')[0]}.csv`
        };
    } else if (format === 'json') {
        return {
            success: true,
            format: 'json',
            data: JSON.stringify(data, null, 2),
            filename: `ledgers_export_${new Date().toISOString().split('T')[0]}.json`
        };
    }
    
    return {
        success: false,
        error: 'Unsupported format'
    };
};

const logExportActivity = async (activityData) => {
    const exportLogs = JSON.parse(localStorage.getItem('mpesewa_export_logs') || '[]');
    exportLogs.push(activityData);
    localStorage.setItem('mpesewa_export_logs', JSON.stringify(exportLogs));
};

const checkReconciliationPermission = async (ledgerId, userId) => {
    // Lender or admin can reconcile
    const ledger = await getLedgerById(ledgerId);
    if (!ledger) return false;
    
    if (ledger.lenderId === userId) {
        return true;
    }
    
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('mpesewa_users') || '{}')[userId];
    return user?.role === 'platform_admin' || user?.role === 'group_admin';
};

const performReconciliation = async (ledgerId, reconciliationData) => {
    const ledger = await getLedgerById(ledgerId);
    
    // Calculate expected vs actual
    const expectedTotal = ledger.totalAmount;
    const actualTotal = reconciliationData.actualRepayments || 0;
    const difference = expectedTotal - actualTotal;
    
    const isBalanced = Math.abs(difference) < 0.01; // Within 0.01 tolerance
    
    return {
        ledgerId,
        expectedTotal,
        actualTotal,
        difference,
        isBalanced,
        notes: reconciliationData.notes || '',
        reconciledAt: new Date().toISOString()
    };
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

// Export actions and reducer
export const {
    setCurrentLedger,
    updateFilters,
    resetFilters,
    addLedger,
    updateLedgerInState,
    removeLedger,
    addAuditEntry,
    updateSettings,
    clearLedgerState,
    calculateLedgerDetails,
    getLedgerSummary
} = ledgerSlice.actions;

export default ledgerSlice.reducer;

/**
 * LEDGER SYSTEM ENFORCEMENT (Section A Strict Rules):
 * 
 * 1. Auto-generated when lender approves loan
 * 2. Stored under lender profile inside group
 * 3. Unlimited ledgers per lender
 * 4. Each ledger represents one borrower
 * 5. Ledger fields: Borrower details, guarantors, loan category, amount, dates
 * 6. 10% interest per week, 5% daily penalty after 7 days
 * 7. Updated manually by lender
 * 8. Admin can override or assist updates
 * 9. Status: Active or Cleared
 * 10. Ledgers cannot exceed subscription limits
 * 11. Borrower rating system (5-star) tied to ledger performance
 * 12. Default after 2 months leads to blacklisting
 */