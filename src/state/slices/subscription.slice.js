/**
 * M-PESEWA SUBSCRIPTION SLICE
 * Strictly follows Section A rules for subscription management
 * Subscription Levels: Basic, Premium, Super, Lender of Lenders
 */

import { createSlice, createAsyncThunk } from 'reduxjs/toolkit';

// Subscription levels with strict limits (Section A)
const SUBSCRIPTION_LEVELS = {
    basic: {
        name: 'Basic',
        maxAmount: 1500, // per week
        monthly: 50,
        biAnnual: 250,
        annual: 500,
        crbCheck: false,
        maxLedgers: 1500,
        features: [
            'Up to 1,500 per week',
            'No CRB check',
            'Basic ledger access',
            'Community support'
        ]
    },
    premium: {
        name: 'Premium',
        maxAmount: 5000, // per week
        monthly: 250,
        biAnnual: 1500,
        annual: 2500,
        crbCheck: false,
        maxLedgers: 10000,
        features: [
            'Up to 5,000 per week',
            'No CRB check',
            'Advanced analytics',
            'Priority support',
            'Bulk lending tools'
        ]
    },
    super: {
        name: 'Super',
        maxAmount: 20000, // per week
        monthly: 1000,
        biAnnual: 5000,
        annual: 8500,
        crbCheck: true,
        maxLedgers: 20000,
        features: [
            'Up to 20,000 per week',
            'CRB check included',
            'Premium analytics',
            '24/7 support',
            'Risk assessment tools',
            'Portfolio management'
        ]
    },
    lender_of_lenders: {
        name: 'Lender of Lenders',
        maxAmount: 50000, // per week
        monthly: 500,
        biAnnual: 3500,
        annual: 6500,
        crbCheck: true,
        maxLedgers: 50000,
        features: [
            'Up to 50,000 per week',
            'CRB check included',
            'Custom interest rates',
            'Minimum 1 month repayment',
            'Enterprise tools',
            'Dedicated account manager'
        ]
    }
};

// Initial state
const initialState = {
    // Current subscription
    current: null,
    
    // Available subscription levels
    levels: SUBSCRIPTION_LEVELS,
    
    // Subscription history
    history: [],
    
    // Invoices and payments
    invoices: [],
    pendingPayments: [],
    
    // Subscription status
    status: {
        isActive: false,
        isExpired: false,
        isPending: false,
        expiryDate: null,
        daysRemaining: 0,
        canLend: false
    },
    
    // Payment methods
    paymentMethods: [],
    
    // Auto-renewal settings
    autoRenewal: {
        enabled: false,
        paymentMethod: null,
        nextRenewalDate: null
    },
    
    // Subscription limits and usage
    limits: {
        weeklyLimit: 0,
        weeklyUsed: 0,
        weeklyRemaining: 0,
        ledgerLimit: 0,
        ledgersUsed: 0,
        ledgersRemaining: 0,
        crbChecksRemaining: 0
    },
    
    // Loading states
    isLoading: false,
    isProcessing: false,
    isUpgrading: false,
    isCancelling: false,
    
    // Error states
    error: null,
    paymentError: null,
    upgradeError: null
};

// Async thunks
export const subscribe = createAsyncThunk(
    'subscription/subscribe',
    async (subscriptionData, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            const userRole = state.role.currentRole;
            
            // Section A: Only lenders need subscriptions
            if (userRole !== 'lender') {
                throw new Error('Only lenders can subscribe');
            }
            
            // Validate subscription data
            validateSubscriptionData(subscriptionData);
            
            // Check if already has active subscription
            if (state.subscription.status.isActive) {
                throw new Error('Already have active subscription');
            }
            
            // Process payment
            const paymentResult = await processSubscriptionPayment({
                ...subscriptionData,
                userId,
                paymentDate: new Date().toISOString()
            });
            
            if (!paymentResult.success) {
                throw new Error(`Payment failed: ${paymentResult.message}`);
            }
            
            // Calculate expiry date (28th of month)
            const expiryDate = calculateSubscriptionExpiry(subscriptionData.duration);
            
            // Create subscription
            const subscription = await createSubscriptionRecord({
                userId,
                level: subscriptionData.level,
                duration: subscriptionData.duration,
                amount: paymentResult.amount,
                paymentMethod: subscriptionData.paymentMethod,
                paymentId: paymentResult.transactionId,
                expiryDate,
                status: 'active',
                subscribedAt: new Date().toISOString()
            });
            
            // Update lender's subscription status
            await updateLenderSubscriptionStatus(userId, subscription);
            
            return subscription;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const upgradeSubscription = createAsyncThunk(
    'subscription/upgrade',
    async (upgradeData, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            const currentSubscription = state.subscription.current;
            
            if (!currentSubscription) {
                throw new Error('No active subscription to upgrade');
            }
            
            // Validate upgrade
            const canUpgrade = await checkUpgradeEligibility(
                currentSubscription.level,
                upgradeData.newLevel
            );
            
            if (!canUpgrade) {
                throw new Error(`Cannot upgrade from ${currentSubscription.level} to ${upgradeData.newLevel}`);
            }
            
            // Calculate prorated amount
            const proratedAmount = calculateProratedAmount(
                currentSubscription,
                upgradeData.newLevel,
                upgradeData.duration
            );
            
            // Process upgrade payment
            const paymentResult = await processUpgradePayment({
                userId,
                currentLevel: currentSubscription.level,
                newLevel: upgradeData.newLevel,
                duration: upgradeData.duration,
                amount: proratedAmount,
                paymentMethod: upgradeData.paymentMethod
            });
            
            if (!paymentResult.success) {
                throw new Error(`Upgrade payment failed: ${paymentResult.message}`);
            }
            
            // Update subscription
            const updatedSubscription = await upgradeSubscriptionRecord(
                userId,
                currentSubscription,
                upgradeData,
                paymentResult,
                proratedAmount
            );
            
            // Update lender's limits
            await updateLenderLimits(userId, upgradeData.newLevel);
            
            return updatedSubscription;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const renewSubscription = createAsyncThunk(
    'subscription/renew',
    async (renewalData, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            const currentSubscription = state.subscription.current;
            
            if (!currentSubscription) {
                throw new Error('No subscription to renew');
            }
            
            // Check if can renew (not too early)
            const canRenew = await checkRenewalEligibility(currentSubscription);
            if (!canRenew.allowed) {
                throw new Error(`Cannot renew yet: ${canRenew.reason}`);
            }
            
            // Process renewal payment
            const paymentResult = await processRenewalPayment({
                userId,
                level: currentSubscription.level,
                duration: renewalData.duration || currentSubscription.duration,
                amount: calculateRenewalAmount(currentSubscription.level, renewalData.duration),
                paymentMethod: renewalData.paymentMethod || currentSubscription.paymentMethod
            });
            
            if (!paymentResult.success) {
                throw new Error(`Renewal payment failed: ${paymentResult.message}`);
            }
            
            // Calculate new expiry date
            const newExpiryDate = calculateNewExpiryDate(
                currentSubscription.expiryDate,
                renewalData.duration || currentSubscription.duration
            );
            
            // Renew subscription
            const renewedSubscription = await renewSubscriptionRecord(
                userId,
                currentSubscription,
                renewalData,
                paymentResult,
                newExpiryDate
            );
            
            return renewedSubscription;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const cancelSubscription = createAsyncThunk(
    'subscription/cancel',
    async (cancellationData, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const userId = state.role.currentProfile?.id;
            const currentSubscription = state.subscription.current;
            
            if (!currentSubscription) {
                throw new Error('No subscription to cancel');
            }
            
            // Check if can cancel (no active loans)
            const canCancel = await checkCancellationEligibility(userId);
            if (!canCancel.allowed) {
                throw new Error(`Cannot cancel: ${canCancel.reason}`);
            }
            
            // Cancel subscription
            const cancelledSubscription = await cancelSubscriptionRecord(
                userId,
                currentSubscription,
                cancellationData
            );
            
            // Update lender status (block lending)
            await blockLenderLending(userId);
            
            return cancelledSubscription;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadSubscription = createAsyncThunk(
    'subscription/load',
    async (userId, { rejectWithValue }) => {
        try {
            // Load subscription
            const subscription = await getSubscription(userId);
            
            // Load history
            const history = await getSubscriptionHistory(userId);
            
            // Load invoices
            const invoices = await getInvoices(userId);
            
            // Calculate status
            const status = calculateSubscriptionStatus(subscription);
            
            // Calculate limits
            const limits = await calculateSubscriptionLimits(userId, subscription);
            
            // Load payment methods
            const paymentMethods = await getPaymentMethods(userId);
            
            // Load auto-renewal settings
            const autoRenewal = await getAutoRenewalSettings(userId);
            
            return {
                subscription,
                history,
                invoices,
                status,
                limits,
                paymentMethods,
                autoRenewal
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkExpiry = createAsyncThunk(
    'subscription/checkExpiry',
    async (_, { getState }) => {
        const state = getState();
        const subscription = state.subscription.current;
        
        if (!subscription) {
            return { isExpired: true, message: 'No subscription found' };
        }
        
        const expiryDate = new Date(subscription.expiryDate);
        const now = new Date();
        const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        const isExpired = expiryDate < now;
        const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
        
        return {
            isExpired,
            isExpiringSoon,
            daysRemaining: Math.max(0, daysRemaining),
            expiryDate: subscription.expiryDate,
            shouldRenew: isExpiringSoon || isExpired
        };
    }
);

// Create slice
const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        // Update subscription
        updateSubscription: (state, action) => {
            if (state.current) {
                state.current = {
                    ...state.current,
                    ...action.payload,
                    updatedAt: new Date().toISOString()
                };
                
                // Recalculate status
                state.status = calculateSubscriptionStatus(state.current);
            }
        },
        
        // Update status
        updateStatus: (state, action) => {
            state.status = {
                ...state.status,
                ...action.payload
            };
        },
        
        // Update limits
        updateLimits: (state, action) => {
            state.limits = {
                ...state.limits,
                ...action.payload
            };
        },
        
        // Add invoice
        addInvoice: (state, action) => {
            state.invoices.push(action.payload);
        },
        
        // Update auto-renewal
        updateAutoRenewal: (state, action) => {
            state.autoRenewal = {
                ...state.autoRenewal,
                ...action.payload
            };
        },
        
        // Clear subscription state
        clearSubscriptionState: (state) => {
            Object.assign(state, initialState);
        },
        
        // Calculate subscription value
        calculateValue: (state, action) => {
            const { level, duration } = action.payload;
            const subscriptionLevel = state.levels[level];
            
            if (!subscriptionLevel) {
                throw new Error('Invalid subscription level');
            }
            
            const amount = subscriptionLevel[duration];
            const weeklyLimit = subscriptionLevel.maxAmount;
            const monthlyValue = weeklyLimit * 4; // Approximate monthly lending capacity
            
            return {
                level,
                duration,
                amount,
                weeklyLimit,
                monthlyValue,
                roi: (weeklyLimit * 0.10 * 4) - amount, // Monthly interest minus cost
                valueScore: (weeklyLimit * 0.10 * 4) / amount // Return on investment ratio
            };
        },
        
        // Get subscription summary
        getSummary: (state) => {
            return {
                level: state.current?.level || 'none',
                status: state.status,
                limits: state.limits,
                expiryDate: state.current?.expiryDate,
                daysRemaining: state.status.daysRemaining,
                canLend: state.status.canLend,
                nextPayment: state.autoRenewal.nextRenewalDate
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Subscribe cases
            .addCase(subscribe.pending, (state) => {
                state.isProcessing = true;
                state.error = null;
            })
            .addCase(subscribe.fulfilled, (state, action) => {
                const subscription = action.payload;
                
                state.isProcessing = false;
                state.current = subscription;
                state.status = calculateSubscriptionStatus(subscription);
                state.history.push({
                    action: 'SUBSCRIBED',
                    level: subscription.level,
                    amount: subscription.amount,
                    date: subscription.subscribedAt
                });
                
                // Calculate initial limits
                const level = state.levels[subscription.level];
                state.limits = {
                    weeklyLimit: level.maxAmount,
                    weeklyUsed: 0,
                    weeklyRemaining: level.maxAmount,
                    ledgerLimit: level.maxLedgers,
                    ledgersUsed: 0,
                    ledgersRemaining: level.maxLedgers,
                    crbChecksRemaining: level.crbCheck ? 10 : 0
                };
            })
            .addCase(subscribe.rejected, (state, action) => {
                state.isProcessing = false;
                state.error = action.payload || action.error.message;
            })
            
            // Upgrade cases
            .addCase(upgradeSubscription.pending, (state) => {
                state.isUpgrading = true;
                state.upgradeError = null;
            })
            .addCase(upgradeSubscription.fulfilled, (state, action) => {
                const updatedSubscription = action.payload;
                
                state.isUpgrading = false;
                state.current = updatedSubscription;
                state.status = calculateSubscriptionStatus(updatedSubscription);
                state.history.push({
                    action: 'UPGRADED',
                    from: state.current?.level,
                    to: updatedSubscription.level,
                    amount: updatedSubscription.upgradeAmount,
                    date: updatedSubscription.upgradedAt
                });
                
                // Update limits
                const level = state.levels[updatedSubscription.level];
                state.limits.weeklyLimit = level.maxAmount;
                state.limits.weeklyRemaining = level.maxAmount - state.limits.weeklyUsed;
                state.limits.ledgerLimit = level.maxLedgers;
                state.limits.ledgersRemaining = level.maxLedgers - state.limits.ledgersUsed;
                state.limits.crbChecksRemaining = level.crbCheck ? 10 : 0;
            })
            .addCase(upgradeSubscription.rejected, (state, action) => {
                state.isUpgrading = false;
                state.upgradeError = action.payload || action.error.message;
            })
            
            // Renew cases
            .addCase(renewSubscription.pending, (state) => {
                state.isProcessing = true;
            })
            .addCase(renewSubscription.fulfilled, (state, action) => {
                const renewedSubscription = action.payload;
                
                state.isProcessing = false;
                state.current = renewedSubscription;
                state.status = calculateSubscriptionStatus(renewedSubscription);
                state.history.push({
                    action: 'RENEWED',
                    level: renewedSubscription.level,
                    amount: renewedSubscription.renewalAmount,
                    date: renewedSubscription.renewedAt
                });
            })
            .addCase(renewSubscription.rejected, (state) => {
                state.isProcessing = false;
            })
            
            // Cancel cases
            .addCase(cancelSubscription.pending, (state) => {
                state.isCancelling = true;
            })
            .addCase(cancelSubscription.fulfilled, (state, action) => {
                const cancelledSubscription = action.payload;
                
                state.isCancelling = false;
                state.current = cancelledSubscription;
                state.status = calculateSubscriptionStatus(cancelledSubscription);
                state.history.push({
                    action: 'CANCELLED',
                    level: cancelledSubscription.level,
                    date: cancelledSubscription.cancelledAt,
                    reason: cancelledSubscription.cancellationReason
                });
                
                // Update status
                state.status.canLend = false;
                state.status.isActive = false;
                state.status.isExpired = true;
            })
            .addCase(cancelSubscription.rejected, (state) => {
                state.isCancelling = false;
            })
            
            // Load subscription cases
            .addCase(loadSubscription.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadSubscription.fulfilled, (state, action) => {
                const {
                    subscription,
                    history,
                    invoices,
                    status,
                    limits,
                    paymentMethods,
                    autoRenewal
                } = action.payload;
                
                state.isLoading = false;
                state.current = subscription;
                state.history = history;
                state.invoices = invoices;
                state.status = status;
                state.limits = limits;
                state.paymentMethods = paymentMethods;
                state.autoRenewal = autoRenewal;
            })
            .addCase(loadSubscription.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            
            // Check expiry cases
            .addCase(checkExpiry.fulfilled, (state, action) => {
                const { isExpired, isExpiringSoon, daysRemaining, shouldRenew } = action.payload;
                
                state.status.isExpired = isExpired;
                state.status.daysRemaining = daysRemaining;
                state.status.canLend = !isExpired;
                
                // Add notification if expiring soon
                if (isExpiringSoon && !state.status.notified) {
                    state.status.notified = true;
                    state.status.notification = `Subscription expires in ${daysRemaining} days`;
                }
            });
    }
});

// Helper functions
const calculateSubscriptionStatus = (subscription) => {
    if (!subscription) {
        return {
            isActive: false,
            isExpired: true,
            isPending: false,
            expiryDate: null,
            daysRemaining: 0,
            canLend: false
        };
    }
    
    const expiryDate = new Date(subscription.expiryDate);
    const now = new Date();
    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    const isExpired = expiryDate < now;
    const isActive = subscription.status === 'active' && !isExpired;
    const canLend = isActive;
    
    return {
        isActive,
        isExpired,
        isPending: subscription.status === 'pending',
        expiryDate: subscription.expiryDate,
        daysRemaining: Math.max(0, daysRemaining),
        canLend,
        notified: false
    };
};

// Selectors
export const selectCurrentSubscription = (state) => state.subscription.current;
export const selectSubscriptionStatus = (state) => state.subscription.status;
export const selectSubscriptionLevels = (state) => state.subscription.levels;
export const selectSubscriptionLimits = (state) => state.subscription.limits;
export const selectSubscriptionHistory = (state) => state.subscription.history;
export const selectInvoices = (state) => state.subscription.invoices;
export const selectIsLoading = (state) => state.subscription.isLoading;
export const selectCanLend = (state) => state.subscription.status.canLend;

export const selectSubscriptionSummary = (state) => ({
    level: state.subscription.current?.level || 'none',
    status: state.subscription.status,
    weeklyLimit: state.subscription.limits.weeklyLimit,
    weeklyUsed: state.subscription.limits.weeklyUsed,
    weeklyRemaining: state.subscription.limits.weeklyRemaining,
    expiryDate: state.subscription.current?.expiryDate,
    daysRemaining: state.subscription.status.daysRemaining,
    autoRenewal: state.subscription.autoRenewal.enabled
});

export const selectUpgradeOptions = (state) => {
    const currentLevel = state.subscription.current?.level;
    if (!currentLevel) return [];
    
    const levels = state.subscription.levels;
    const currentIndex = Object.keys(levels).indexOf(currentLevel);
    
    return Object.entries(levels)
        .filter(([key], index) => index > currentIndex)
        .map(([key, level]) => ({
            level: key,
            name: level.name,
            maxAmount: level.maxAmount,
            features: level.features,
            monthly: level.monthly,
            biAnnual: level.biAnnual,
            annual: level.annual
        }));
};

// Helper functions (simulated implementations)
const validateSubscriptionData = (data) => {
    const requiredFields = ['level', 'duration', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const validLevels = Object.keys(SUBSCRIPTION_LEVELS);
    if (!validLevels.includes(data.level)) {
        throw new Error(`Invalid subscription level. Must be one of: ${validLevels.join(', ')}`);
    }
    
    const validDurations = ['monthly', 'biAnnual', 'annual'];
    if (!validDurations.includes(data.duration)) {
        throw new Error(`Invalid duration. Must be one of: ${validDurations.join(', ')}`);
    }
};

const processSubscriptionPayment = async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const level = SUBSCRIPTION_LEVELS[paymentData.level];
    const amount = level[paymentData.duration];
    
    if (!amount) {
        return { success: false, message: 'Invalid subscription combination' };
    }
    
    // Simulate payment success
    return {
        success: true,
        amount,
        transactionId: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentDate: paymentData.paymentDate
    };
};

const calculateSubscriptionExpiry = (duration) => {
    const now = new Date();
    let expiryDate = new Date(now);
    
    switch (duration) {
        case 'monthly':
            // Next month, 28th (Section A rule)
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            expiryDate.setDate(28);
            break;
        case 'biAnnual':
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

const createSubscriptionRecord = async (subscriptionData) => {
    const subscription = {
        id: `SUB_${subscriptionData.userId}_${Date.now()}`,
        userId: subscriptionData.userId,
        level: subscriptionData.level,
        duration: subscriptionData.duration,
        amount: subscriptionData.amount,
        paymentMethod: subscriptionData.paymentMethod,
        paymentId: subscriptionData.paymentId,
        expiryDate: subscriptionData.expiryDate,
        status: subscriptionData.status,
        subscribedAt: subscriptionData.subscribedAt,
        updatedAt: subscriptionData.subscribedAt
    };
    
    const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '{}');
    subscriptions[subscriptionData.userId] = subscription;
    localStorage.setItem('mpesewa_subscriptions', JSON.stringify(subscriptions));
    
    return subscription;
};

const updateLenderSubscriptionStatus = async (userId, subscription) => {
    const profiles = JSON.parse(localStorage.getItem('mpesewa_lender_profiles') || '{}');
    if (profiles[userId]) {
        profiles[userId].subscription = subscription;
        profiles[userId].updatedAt = new Date().toISOString();
        localStorage.setItem('mpesewa_lender_profiles', JSON.stringify(profiles));
    }
};

const checkUpgradeEligibility = async (currentLevel, newLevel) => {
    const levels = Object.keys(SUBSCRIPTION_LEVELS);
    const currentIndex = levels.indexOf(currentLevel);
    const newIndex = levels.indexOf(newLevel);
    
    // Can only upgrade to higher levels
    return newIndex > currentIndex;
};

const calculateProratedAmount = (currentSubscription, newLevel, newDuration) => {
    const currentLevel = SUBSCRIPTION_LEVELS[currentSubscription.level];
    const newLevelData = SUBSCRIPTION_LEVELS[newLevel];
    
    // Calculate remaining value of current subscription
    const expiryDate = new Date(currentSubscription.expiryDate);
    const now = new Date();
    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    const totalDays = getDurationDays(currentSubscription.duration);
    
    const remainingValue = (currentSubscription.amount * daysRemaining) / totalDays;
    
    // Calculate cost of new subscription
    const newAmount = newLevelData[newDuration];
    
    // Prorated amount = new amount - remaining value
    return Math.max(0, newAmount - remainingValue);
};

const getDurationDays = (duration) => {
    switch (duration) {
        case 'monthly': return 30;
        case 'biAnnual': return 180;
        case 'annual': return 365;
        default: return 30;
    }
};

const processUpgradePayment = async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate payment success
    return {
        success: true,
        amount: paymentData.amount,
        transactionId: `UPG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentDate: new Date().toISOString()
    };
};

const upgradeSubscriptionRecord = async (userId, currentSubscription, upgradeData, paymentResult, proratedAmount) => {
    const newExpiryDate = calculateSubscriptionExpiry(upgradeData.duration);
    
    const upgradedSubscription = {
        ...currentSubscription,
        level: upgradeData.newLevel,
        duration: upgradeData.duration,
        previousLevel: currentSubscription.level,
        upgradeAmount: proratedAmount,
        upgradePaymentId: paymentResult.transactionId,
        expiryDate: newExpiryDate,
        upgradedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '{}');
    subscriptions[userId] = upgradedSubscription;
    localStorage.setItem('mpesewa_subscriptions', JSON.stringify(subscriptions));
    
    // Add to history
    const history = JSON.parse(localStorage.getItem(`mpesewa_subscription_history_${userId}`) || '[]');
    history.push({
        action: 'UPGRADE',
        from: currentSubscription.level,
        to: upgradeData.newLevel,
        amount: proratedAmount,
        date: new Date().toISOString()
    });
    localStorage.setItem(`mpesewa_subscription_history_${userId}`, JSON.stringify(history));
    
    return upgradedSubscription;
};

const updateLenderLimits = async (userId, newLevel) => {
    const profiles = JSON.parse(localStorage.getItem('mpesewa_lender_profiles') || '{}');
    if (profiles[userId]) {
        profiles[userId].subscriptionLevel = newLevel;
        profiles[userId].updatedAt = new Date().toISOString();
        localStorage.setItem('mpesewa_lender_profiles', JSON.stringify(profiles));
    }
};

const checkRenewalEligibility = async (subscription) => {
    const expiryDate = new Date(subscription.expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    // Can renew within 7 days of expiry or after expiry
    if (daysUntilExpiry > 7) {
        return {
            allowed: false,
            reason: 'Can only renew within 7 days of expiry'
        };
    }
    
    return { allowed: true };
};

const calculateRenewalAmount = (level, duration) => {
    const levelData = SUBSCRIPTION_LEVELS[level];
    return levelData[duration];
};

const processRenewalPayment = async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate payment success
    return {
        success: true,
        amount: paymentData.amount,
        transactionId: `REN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentDate: new Date().toISOString()
    };
};

const calculateNewExpiryDate = (currentExpiryDate, duration) => {
    const expiry = new Date(currentExpiryDate);
    
    switch (duration) {
        case 'monthly':
            expiry.setMonth(expiry.getMonth() + 1);
            break;
        case 'biAnnual':
            expiry.setMonth(expiry.getMonth() + 6);
            break;
        case 'annual':
            expiry.setFullYear(expiry.getFullYear() + 1);
            break;
    }
    
    // Ensure it's the 28th (Section A rule)
    expiry.setDate(28);
    
    return expiry.toISOString();
};

const renewSubscriptionRecord = async (userId, currentSubscription, renewalData, paymentResult, newExpiryDate) => {
    const renewedSubscription = {
        ...currentSubscription,
        duration: renewalData.duration || currentSubscription.duration,
        renewalAmount: paymentResult.amount,
        renewalPaymentId: paymentResult.transactionId,
        expiryDate: newExpiryDate,
        renewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '{}');
    subscriptions[userId] = renewedSubscription;
    localStorage.setItem('mpesewa_subscriptions', JSON.stringify(subscriptions));
    
    // Add to history
    const history = JSON.parse(localStorage.getItem(`mpesewa_subscription_history_${userId}`) || '[]');
    history.push({
        action: 'RENEWAL',
        level: currentSubscription.level,
        amount: paymentResult.amount,
        date: new Date().toISOString()
    });
    localStorage.setItem(`mpesewa_subscription_history_${userId}`, JSON.stringify(history));
    
    return renewedSubscription;
};

const checkCancellationEligibility = async (userId) => {
    // Check if lender has active ledgers
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    const activeLedgers = ledgers.filter(l => l.lenderId === userId && l.status === 'active');
    
    if (activeLedgers.length > 0) {
        return {
            allowed: false,
            reason: 'Cannot cancel with active loans'
        };
    }
    
    return { allowed: true };
};

const cancelSubscriptionRecord = async (userId, currentSubscription, cancellationData) => {
    const cancelledSubscription = {
        ...currentSubscription,
        status: 'cancelled',
        cancellationReason: cancellationData.reason,
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '{}');
    subscriptions[userId] = cancelledSubscription;
    localStorage.setItem('mpesewa_subscriptions', JSON.stringify(subscriptions));
    
    // Add to history
    const history = JSON.parse(localStorage.getItem(`mpesewa_subscription_history_${userId}`) || '[]');
    history.push({
        action: 'CANCELLATION',
        level: currentSubscription.level,
        reason: cancellationData.reason,
        date: new Date().toISOString()
    });
    localStorage.setItem(`mpesewa_subscription_history_${userId}`, JSON.stringify(history));
    
    return cancelledSubscription;
};

const blockLenderLending = async (userId) => {
    const profiles = JSON.parse(localStorage.getItem('mpesewa_lender_profiles') || '{}');
    if (profiles[userId]) {
        profiles[userId].canLend = false;
        profiles[userId].updatedAt = new Date().toISOString();
        localStorage.setItem('mpesewa_lender_profiles', JSON.stringify(profiles));
    }
};

const getSubscription = async (userId) => {
    const subscriptions = JSON.parse(localStorage.getItem('mpesewa_subscriptions') || '{}');
    return subscriptions[userId] || null;
};

const getSubscriptionHistory = async (userId) => {
    const history = JSON.parse(localStorage.getItem(`mpesewa_subscription_history_${userId}`) || '[]');
    return history;
};

const getInvoices = async (userId) => {
    // Mock invoices
    return [
        {
            id: 'INV_001',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 50,
            status: 'paid',
            description: 'Basic Monthly Subscription'
        }
    ];
};

const calculateSubscriptionLimits = async (userId, subscription) => {
    if (!subscription) {
        return initialState.limits;
    }
    
    const level = SUBSCRIPTION_LEVELS[subscription.level];
    
    // Calculate weekly usage
    const ledgers = JSON.parse(localStorage.getItem('mpesewa_ledgers') || '[]');
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyUsed = ledgers
        .filter(l => l.lenderId === userId && new Date(l.createdDate) > oneWeekAgo)
        .reduce((sum, l) => sum + l.amount, 0);
    
    // Calculate ledger usage
    const ledgersUsed = ledgers.filter(l => l.lenderId === userId).length;
    
    return {
        weeklyLimit: level.maxAmount,
        weeklyUsed,
        weeklyRemaining: Math.max(0, level.maxAmount - weeklyUsed),
        ledgerLimit: level.maxLedgers,
        ledgersUsed,
        ledgersRemaining: Math.max(0, level.maxLedgers - ledgersUsed),
        crbChecksRemaining: level.crbCheck ? 10 : 0
    };
};

const getPaymentMethods = async (userId) => {
    // Mock payment methods
    return [
        {
            id: 'momo_1',
            type: 'mobile_money',
            provider: 'M-Pesa',
            phone: '+254700000000',
            isDefault: true
        }
    ];
};

const getAutoRenewalSettings = async (userId) => {
    // Mock auto-renewal settings
    return {
        enabled: false,
        paymentMethod: null,
        nextRenewalDate: null
    };
};

// Export actions and reducer
export const {
    updateSubscription,
    updateStatus,
    updateLimits,
    addInvoice,
    updateAutoRenewal,
    clearSubscriptionState,
    calculateValue,
    getSummary
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;

/**
 * SUBSCRIPTION HIERARCHY ENFORCEMENT (Section A Strict Rules):
 * 
 * 1. Four tiers: Basic, Premium, Super, Lender of Lenders
 * 2. Weekly lending limits per tier
 * 3. Subscription expiry on 28th of each month
 * 4. Lenders blocked when subscription expires
 * 5. CRB check required for Super and Lender of Lenders tiers
 * 6. Platform's only revenue source
 * 7. Borrowers pay NO subscription fees
 * 8. Subscription selection during registration
 * 9. Manual payment outside platform
 * 10. Tier limits cannot be exceeded
 */