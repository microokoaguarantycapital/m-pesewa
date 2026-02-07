/**
 * M-PESEWA SUBSCRIPTION MODULE - MAIN ENTRY
 * Strict hierarchy: Global → Country → Groups → Lenders → Subscription
 * Non-negotiable business rules enforcement
 */

// Import dependencies
import { validateSubscriptionTier } from './rules.js';
import { checkSubscriptionGate } from './gates.js';
import { logSubscriptionAction } from './subscription.audit.js';

// Subscription states (non-negotiable)
export const SUBSCRIPTION_STATES = {
    NEW: 'new',
    ACTIVE: 'active',
    EXPIRED: 'expired',
    SUSPENDED: 'suspended',
    CANCELLED: 'cancelled',
    GRACE_PERIOD: 'grace_period'
};

// Subscription tiers with exact limits from requirements
export const SUBSCRIPTION_TIERS = {
    BASIC: {
        id: 'basic',
        name: 'Basic',
        weeklyLimit: 1500, // Local currency
        maxLedgers: 1500,
        monthlyPrice: 50,
        biannualPrice: 250,
        annualPrice: 500,
        requiresCRB: false,
        description: 'Start small, grow steadily'
    },
    PREMIUM: {
        id: 'premium',
        name: 'Premium',
        weeklyLimit: 5000,
        maxLedgers: 10000,
        monthlyPrice: 250,
        biannualPrice: 1500,
        annualPrice: 2500,
        requiresCRB: false,
        description: 'Expand your lending portfolio'
    },
    SUPER: {
        id: 'super',
        name: 'Super',
        weeklyLimit: 20000,
        maxLedgers: 20000,
        monthlyPrice: 1000,
        biannualPrice: 5000,
        annualPrice: 8500,
        requiresCRB: true,
        description: 'High-volume lending with CRB checks'
    },
    LENDER_OF_LENDERS: {
        id: 'lender_of_lenders',
        name: 'Lender of Lenders',
        weeklyLimit: 50000,
        maxLedgers: 50000,
        monthlyPrice: 500,
        biannualPrice: 3500,
        annualPrice: 6500,
        requiresCRB: true,
        description: 'Professional institutional lending'
    }
};

// 13 African countries from requirements
export const SUPPORTED_COUNTRIES = {
    KE: { code: 'KE', name: 'Kenya', currency: 'KSh', symbol: 'KSh' },
    UG: { code: 'UG', name: 'Uganda', currency: 'UGX', symbol: 'UGX' },
    TZ: { code: 'TZ', name: 'Tanzania', currency: 'TZS', symbol: 'TZS' },
    RW: { code: 'RW', name: 'Rwanda', currency: 'RWF', symbol: 'FRw' },
    BI: { code: 'BI', name: 'Burundi', currency: 'BIF', symbol: 'FBu' },
    CD: { code: 'CD', name: 'DRC', currency: 'CDF', symbol: 'FC' },
    SS: { code: 'SS', name: 'South Sudan', currency: 'SSP', symbol: 'SSP' },
    ZA: { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R' },
    NG: { code: 'NG', name: 'Nigeria', currency: 'NGN', symbol: '₦' },
    GH: { code: 'GH', name: 'Ghana', currency: 'GHS', symbol: 'GH₵' },
    ET: { code: 'ET', name: 'Ethiopia', currency: 'ETB', symbol: 'Br' },
    SO: { code: 'SO', name: 'Somalia', currency: 'SOS', symbol: 'Sh.So.' }
};

/**
 * Subscription Class - Core Engine
 * Enforces all M-Pesewa subscription rules
 */
export class Subscription {
    constructor(userId, countryCode, groupId) {
        this.userId = userId;
        this.countryCode = countryCode;
        this.groupId = groupId;
        this.tier = null;
        this.state = SUBSCRIPTION_STATES.NEW;
        this.startDate = null;
        this.expiryDate = null;
        this.currentPeriodStart = null;
        this.currentPeriodEnd = null;
        this.paymentMethod = null;
        this.isAutoRenew = false;
        this.totalLentThisWeek = 0;
        this.ledgersCount = 0;
        this.weeklyResetDate = null;
        this.lastPaymentDate = null;
        this.paymentHistory = [];
        this.metadata = {};
        
        // Initialize weekly reset (every Monday)
        this.resetWeeklyCounter();
        
        // Log creation
        logSubscriptionAction({
            action: 'SUBSCRIPTION_CREATED',
            userId,
            countryCode,
            groupId,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Subscribe to a tier (Lender registration flow)
     * @param {string} tierId - One of SUBSCRIPTION_TIERS keys
     * @param {string} period - 'monthly', 'biannual', 'annual'
     * @param {Object} paymentDetails - Payment information
     */
    subscribe(tierId, period, paymentDetails) {
        // Validate tier exists
        if (!SUBSCRIPTION_TIERS[tierId]) {
            throw new Error(`Invalid subscription tier: ${tierId}`);
        }
        
        // Validate country is supported
        if (!SUPPORTED_COUNTRIES[this.countryCode]) {
            throw new Error(`Country not supported: ${this.countryCode}`);
        }
        
        // Check if already subscribed
        if (this.state === SUBSCRIPTION_STATES.ACTIVE) {
            throw new Error('User already has active subscription');
        }
        
        // Validate tier against country-specific rules
        const validation = validateSubscriptionTier({
            tierId,
            countryCode: this.countryCode,
            userId: this.userId,
            groupId: this.groupId
        });
        
        if (!validation.valid) {
            throw new Error(`Subscription validation failed: ${validation.reason}`);
        }
        
        // Set tier
        this.tier = SUBSCRIPTION_TIERS[tierId];
        
        // Calculate dates based on period
        const now = new Date();
        this.startDate = now;
        this.lastPaymentDate = now;
        this.paymentMethod = paymentDetails.method;
        this.isAutoRenew = paymentDetails.autoRenew || false;
        
        // Set expiry based on period (ALWAYS 28th of month rule)
        this.setExpiryDate(period);
        
        // Update state
        this.state = SUBSCRIPTION_STATES.ACTIVE;
        
        // Add to payment history
        this.paymentHistory.push({
            date: now.toISOString(),
            tier: tierId,
            period: period,
            amount: this.getPriceForPeriod(period),
            currency: SUPPORTED_COUNTRIES[this.countryCode].currency,
            method: paymentDetails.method,
            reference: paymentDetails.reference
        });
        
        // Log subscription
        logSubscriptionAction({
            action: 'SUBSCRIPTION_ACTIVATED',
            userId: this.userId,
            tierId,
            period,
            countryCode: this.countryCode,
            amount: this.getPriceForPeriod(period),
            expiryDate: this.expiryDate,
            timestamp: now.toISOString()
        });
        
        return {
            success: true,
            tier: this.tier.name,
            expiryDate: this.expiryDate,
            weeklyLimit: this.tier.weeklyLimit,
            message: `Subscription activated. You can now lend up to ${this.tier.weeklyLimit} ${SUPPORTED_COUNTRIES[this.countryCode].currency} per week.`
        };
    }
    
    /**
     * Set expiry date enforcing 28th of month rule
     * @param {string} period - 'monthly', 'biannual', 'annual'
     */
    setExpiryDate(period) {
        const now = new Date();
        let expiry = new Date(now);
        
        switch(period) {
            case 'monthly':
                // Move to 28th of next month
                expiry.setMonth(expiry.getMonth() + 1);
                expiry.setDate(28);
                break;
            case 'biannual':
                expiry.setMonth(expiry.getMonth() + 6);
                expiry.setDate(28);
                break;
            case 'annual':
                expiry.setFullYear(expiry.getFullYear() + 1);
                expiry.setDate(28);
                break;
            default:
                throw new Error('Invalid period. Must be: monthly, biannual, or annual');
        }
        
        this.expiryDate = expiry;
        this.currentPeriodStart = now;
        this.currentPeriodEnd = expiry;
    }
    
    /**
     * Check if subscription is active (not expired)
     * Enforces strict 28th expiry rule
     */
    isActive() {
        if (this.state !== SUBSCRIPTION_STATES.ACTIVE) {
            return false;
        }
        
        const now = new Date();
        const expiry = new Date(this.expiryDate);
        
        // If today is after expiry date (strict check)
        if (now > expiry) {
            this.state = SUBSCRIPTION_STATES.EXPIRED;
            
            logSubscriptionAction({
                action: 'SUBSCRIPTION_EXPIRED',
                userId: this.userId,
                tierId: this.tier?.id,
                expiryDate: this.expiryDate,
                timestamp: now.toISOString()
            });
            
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if user can lend a specific amount
     * Enforces weekly limits and subscription gates
     * @param {number} amount - Amount to lend
     */
    canLend(amount) {
        // Check subscription gate first
        const gateCheck = checkSubscriptionGate({
            userId: this.userId,
            tierId: this.tier?.id,
            state: this.state,
            countryCode: this.countryCode,
            action: 'LEND',
            amount: amount
        });
        
        if (!gateCheck.allowed) {
            return {
                canLend: false,
                reason: gateCheck.reason,
                requiredAction: gateCheck.requiredAction
            };
        }
        
        // Check if subscription is active
        if (!this.isActive()) {
            return {
                canLend: false,
                reason: 'Subscription is not active',
                requiredAction: 'RENEW_SUBSCRIPTION'
            };
        }
        
        // Check weekly limit
        this.checkWeeklyReset();
        
        const remainingThisWeek = this.tier.weeklyLimit - this.totalLentThisWeek;
        if (amount > remainingThisWeek) {
            return {
                canLend: false,
                reason: `Weekly limit exceeded. Remaining: ${remainingThisWeek} ${SUPPORTED_COUNTRIES[this.countryCode].currency}`,
                requiredAction: 'WAIT_FOR_RESET_OR_UPGRADE',
                remaining: remainingThisWeek,
                resetDate: this.weeklyResetDate
            };
        }
        
        // Check ledger count limit
        if (this.ledgersCount >= this.tier.maxLedgers) {
            return {
                canLend: false,
                reason: `Maximum ledgers (${this.tier.maxLedgers}) reached`,
                requiredAction: 'UPGRADE_SUBSCRIPTION'
            };
        }
        
        return {
            canLend: true,
            remaining: remainingThisWeek - amount,
            weeklyLimit: this.tier.weeklyLimit,
            tier: this.tier.name
        };
    }
    
    /**
     * Record a lending transaction
     * Updates weekly counter and ledger count
     * @param {number} amount - Amount lent
     */
    recordLending(amount) {
        if (!this.isActive()) {
            throw new Error('Cannot record lending: Subscription not active');
        }
        
        const canLend = this.canLend(amount);
        if (!canLend.canLend) {
            throw new Error(`Cannot record lending: ${canLend.reason}`);
        }
        
        // Update counters
        this.totalLentThisWeek += amount;
        this.ledgersCount += 1;
        
        // Log the lending action
        logSubscriptionAction({
            action: 'LENDING_RECORDED',
            userId: this.userId,
            amount,
            currency: SUPPORTED_COUNTRIES[this.countryCode].currency,
            remainingWeekly: this.tier.weeklyLimit - this.totalLentThisWeek,
            ledgersCount: this.ledgersCount,
            timestamp: new Date().toISOString()
        });
        
        return {
            success: true,
            totalLentThisWeek: this.totalLentThisWeek,
            remainingWeekly: this.tier.weeklyLimit - this.totalLentThisWeek,
            ledgersCount: this.ledgersCount
        };
    }
    
    /**
     * Check and reset weekly counter if needed
     */
    checkWeeklyReset() {
        const now = new Date();
        const resetDate = new Date(this.weeklyResetDate);
        
        if (now > resetDate) {
            this.resetWeeklyCounter();
        }
    }
    
    /**
     * Reset weekly lending counter (every Monday)
     */
    resetWeeklyCounter() {
        const now = new Date();
        const nextMonday = new Date(now);
        
        // Get next Monday
        const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
        nextMonday.setDate(now.getDate() + daysUntilMonday);
        nextMonday.setHours(0, 0, 0, 0);
        
        this.weeklyResetDate = nextMonday;
        this.totalLentThisWeek = 0;
        
        logSubscriptionAction({
            action: 'WEEKLY_RESET',
            userId: this.userId,
            resetDate: this.weeklyResetDate,
            timestamp: now.toISOString()
        });
    }
    
    /**
     * Renew subscription
     * @param {string} period - 'monthly', 'biannual', 'annual'
     * @param {Object} paymentDetails - Payment information
     */
    renew(period, paymentDetails) {
        if (!this.tier) {
            throw new Error('Cannot renew: No active tier');
        }
        
        // Check if subscription is in grace period (7 days after expiry)
        const now = new Date();
        const expiry = new Date(this.expiryDate);
        const gracePeriodEnd = new Date(expiry);
        gracePeriodEnd.setDate(expiry.getDate() + 7);
        
        if (now > gracePeriodEnd && this.state === SUBSCRIPTION_STATES.EXPIRED) {
            throw new Error('Subscription expired beyond grace period. Please subscribe again.');
        }
        
        // Renew subscription
        this.setExpiryDate(period);
        this.state = SUBSCRIPTION_STATES.ACTIVE;
        this.lastPaymentDate = now;
        this.isAutoRenew = paymentDetails.autoRenew || this.isAutoRenew;
        
        // Add to payment history
        this.paymentHistory.push({
            date: now.toISOString(),
            tier: this.tier.id,
            period: period,
            amount: this.getPriceForPeriod(period),
            currency: SUPPORTED_COUNTRIES[this.countryCode].currency,
            method: paymentDetails.method,
            reference: paymentDetails.reference,
            type: 'RENEWAL'
        });
        
        logSubscriptionAction({
            action: 'SUBSCRIPTION_RENEWED',
            userId: this.userId,
            tierId: this.tier.id,
            period,
            newExpiryDate: this.expiryDate,
            amount: this.getPriceForPeriod(period),
            timestamp: now.toISOString()
        });
        
        return {
            success: true,
            message: `Subscription renewed until ${this.expiryDate.toLocaleDateString()}`,
            expiryDate: this.expiryDate,
            nextBillingDate: this.getNextBillingDate()
        };
    }
    
    /**
     * Upgrade subscription tier
     * @param {string} newTierId - New tier to upgrade to
     * @param {Object} paymentDetails - Payment for difference
     */
    upgrade(newTierId, paymentDetails) {
        if (!this.tier) {
            throw new Error('Cannot upgrade: No active subscription');
        }
        
        if (!SUBSCRIPTION_TIERS[newTierId]) {
            throw new Error(`Invalid tier: ${newTierId}`);
        }
        
        // Check if actually upgrading
        const currentTierIndex = Object.keys(SUBSCRIPTION_TIERS).indexOf(this.tier.id);
        const newTierIndex = Object.keys(SUBSCRIPTION_TIERS).indexOf(newTierId);
        
        if (newTierIndex <= currentTierIndex) {
            throw new Error('Can only upgrade to a higher tier');
        }
        
        // Calculate prorated amount
        const daysUsed = this.getDaysUsedInCurrentPeriod();
        const totalDays = this.getDaysInCurrentPeriod();
        const remainingRatio = (totalDays - daysUsed) / totalDays;
        
        const currentPrice = this.getPriceForCurrentPeriod();
        const newPrice = SUBSCRIPTION_TIERS[newTierId][this.getCurrentPeriodType() + 'Price'];
        const upgradePrice = Math.max(0, (newPrice * remainingRatio) - (currentPrice * remainingRatio));
        
        // Update tier
        const oldTier = this.tier;
        this.tier = SUBSCRIPTION_TIERS[newTierId];
        
        // Record upgrade payment
        if (upgradePrice > 0) {
            this.paymentHistory.push({
                date: new Date().toISOString(),
                fromTier: oldTier.id,
                toTier: newTierId,
                amount: upgradePrice,
                currency: SUPPORTED_COUNTRIES[this.countryCode].currency,
                method: paymentDetails.method,
                reference: paymentDetails.reference,
                type: 'UPGRADE'
            });
        }
        
        logSubscriptionAction({
            action: 'SUBSCRIPTION_UPGRADED',
            userId: this.userId,
            fromTierId: oldTier.id,
            toTierId: newTierId,
            upgradePrice,
            oldWeeklyLimit: oldTier.weeklyLimit,
            newWeeklyLimit: this.tier.weeklyLimit,
            timestamp: new Date().toISOString()
        });
        
        return {
            success: true,
            oldTier: oldTier.name,
            newTier: this.tier.name,
            newWeeklyLimit: this.tier.weeklyLimit,
            upgradePrice,
            message: `Upgraded to ${this.tier.name} tier. Weekly limit: ${this.tier.weeklyLimit} ${SUPPORTED_COUNTRIES[this.countryCode].currency}`
        };
    }
    
    /**
     * Cancel subscription
     * @param {string} reason - Reason for cancellation
     */
    cancel(reason) {
        if (this.state === SUBSCRIPTION_STATES.CANCELLED) {
            throw new Error('Subscription already cancelled');
        }
        
        const previousState = this.state;
        this.state = SUBSCRIPTION_STATES.CANCELLED;
        
        logSubscriptionAction({
            action: 'SUBSCRIPTION_CANCELLED',
            userId: this.userId,
            tierId: this.tier?.id,
            previousState,
            reason,
            timestamp: new Date().toISOString()
        });
        
        return {
            success: true,
            message: 'Subscription cancelled',
            effectiveDate: new Date().toISOString(),
            willExpire: this.expiryDate
        };
    }
    
    /**
     * Get subscription status summary
     */
    getStatus() {
        const now = new Date();
        const expiry = new Date(this.expiryDate);
        const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        
        return {
            userId: this.userId,
            country: SUPPORTED_COUNTRIES[this.countryCode].name,
            tier: this.tier ? this.tier.name : 'None',
            state: this.state,
            isActive: this.isActive(),
            expiryDate: this.expiryDate,
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
            weeklyLimit: this.tier?.weeklyLimit || 0,
            totalLentThisWeek: this.totalLentThisWeek,
            remainingThisWeek: this.tier ? this.tier.weeklyLimit - this.totalLentThisWeek : 0,
            ledgersCount: this.ledgersCount,
            maxLedgers: this.tier?.maxLedgers || 0,
            weeklyResetDate: this.weeklyResetDate,
            requiresCRB: this.tier?.requiresCRB || false,
            lastPaymentDate: this.lastPaymentDate,
            nextBillingDate: this.getNextBillingDate(),
            canLend: this.canLend(1).canLend // Test with 1 unit
        };
    }
    
    /**
     * Get price for a specific period
     * @param {string} period - 'monthly', 'biannual', 'annual'
     */
    getPriceForPeriod(period) {
        if (!this.tier) {
            throw new Error('No active tier');
        }
        
        const priceKey = period + 'Price';
        if (!this.tier[priceKey]) {
            throw new Error(`Invalid period: ${period}`);
        }
        
        return this.tier[priceKey];
    }
    
    /**
     * Get current period type
     */
    getCurrentPeriodType() {
        if (!this.paymentHistory.length) return null;
        
        const lastPayment = this.paymentHistory[this.paymentHistory.length - 1];
        return lastPayment.period;
    }
    
    /**
     * Get price for current period
     */
    getPriceForCurrentPeriod() {
        const periodType = this.getCurrentPeriodType();
        return periodType ? this.getPriceForPeriod(periodType) : 0;
    }
    
    /**
     * Get days used in current period
     */
    getDaysUsedInCurrentPeriod() {
        if (!this.currentPeriodStart) return 0;
        
        const now = new Date();
        const start = new Date(this.currentPeriodStart);
        return Math.floor((now - start) / (1000 * 60 * 60 * 24));
    }
    
    /**
     * Get total days in current period
     */
    getDaysInCurrentPeriod() {
        if (!this.currentPeriodStart || !this.currentPeriodEnd) return 0;
        
        const start = new Date(this.currentPeriodStart);
        const end = new Date(this.currentPeriodEnd);
        return Math.floor((end - start) / (1000 * 60 * 60 * 24));
    }
    
    /**
     * Get next billing date
     */
    getNextBillingDate() {
        if (!this.expiryDate) return null;
        
        // Next billing is 28th of next month after expiry
        const expiry = new Date(this.expiryDate);
        const nextBilling = new Date(expiry);
        nextBilling.setMonth(expiry.getMonth() + 1);
        nextBilling.setDate(28);
        
        return nextBilling;
    }
    
    /**
     * Get payment history
     */
    getPaymentHistory() {
        return [...this.paymentHistory];
    }
    
    /**
     * Clear ledgers count (admin function)
     * @param {number} newCount - New ledgers count
     */
    adminSetLedgersCount(newCount) {
        if (newCount < 0 || newCount > this.tier.maxLedgers) {
            throw new Error(`Ledgers count must be between 0 and ${this.tier.maxLedgers}`);
        }
        
        const oldCount = this.ledgersCount;
        this.ledgersCount = newCount;
        
        logSubscriptionAction({
            action: 'ADMIN_LEDGERS_ADJUSTED',
            userId: this.userId,
            adminId: 'SYSTEM_ADMIN',
            oldCount,
            newCount,
            timestamp: new Date().toISOString()
        });
        
        return {
            success: true,
            oldCount,
            newCount
        };
    }
}

/**
 * Subscription Manager - Singleton for managing all subscriptions
 */
export class SubscriptionManager {
    constructor() {
        this.subscriptions = new Map(); // userId -> Subscription
        this.countrySubscriptions = new Map(); // countryCode -> Set of userIds
        this.groupSubscriptions = new Map(); // groupId -> Set of userIds
    }
    
    /**
     * Create new subscription for user
     * @param {string} userId - User ID
     * @param {string} countryCode - Country code
     * @param {string} groupId - Group ID
     */
    createSubscription(userId, countryCode, groupId) {
        // Check if user already has subscription
        if (this.subscriptions.has(userId)) {
            throw new Error(`User ${userId} already has a subscription`);
        }
        
        // Validate country
        if (!SUPPORTED_COUNTRIES[countryCode]) {
            throw new Error(`Unsupported country: ${countryCode}`);
        }
        
        // Create subscription
        const subscription = new Subscription(userId, countryCode, groupId);
        
        // Store in maps
        this.subscriptions.set(userId, subscription);
        
        if (!this.countrySubscriptions.has(countryCode)) {
            this.countrySubscriptions.set(countryCode, new Set());
        }
        this.countrySubscriptions.get(countryCode).add(userId);
        
        if (!this.groupSubscriptions.has(groupId)) {
            this.groupSubscriptions.set(groupId, new Set());
        }
        this.groupSubscriptions.get(groupId).add(userId);
        
        return subscription;
    }
    
    /**
     * Get subscription by user ID
     * @param {string} userId - User ID
     */
    getSubscription(userId) {
        return this.subscriptions.get(userId);
    }
    
    /**
     * Get all subscriptions in a country
     * @param {string} countryCode - Country code
     */
    getSubscriptionsByCountry(countryCode) {
        const userIds = this.countrySubscriptions.get(countryCode) || new Set();
        const subscriptions = [];
        
        for (const userId of userIds) {
            const subscription = this.subscriptions.get(userId);
            if (subscription) {
                subscriptions.push(subscription);
            }
        }
        
        return subscriptions;
    }
    
    /**
     * Get all subscriptions in a group
     * @param {string} groupId - Group ID
     */
    getSubscriptionsByGroup(groupId) {
        const userIds = this.groupSubscriptions.get(groupId) || new Set();
        const subscriptions = [];
        
        for (const userId of userIds) {
            const subscription = this.subscriptions.get(userId);
            if (subscription) {
                subscriptions.push(subscription);
            }
        }
        
        return subscriptions;
    }
    
    /**
     * Get active lenders in a group
     * @param {string} groupId - Group ID
     */
    getActiveLendersInGroup(groupId) {
        const subscriptions = this.getSubscriptionsByGroup(groupId);
        return subscriptions.filter(sub => sub.isActive());
    }
    
    /**
     * Remove subscription (admin function)
     * @param {string} userId - User ID
     */
    removeSubscription(userId) {
        const subscription = this.subscriptions.get(userId);
        if (!subscription) {
            throw new Error(`No subscription found for user: ${userId}`);
        }
        
        // Remove from maps
        this.subscriptions.delete(userId);
        
        const countrySet = this.countrySubscriptions.get(subscription.countryCode);
        if (countrySet) {
            countrySet.delete(userId);
            if (countrySet.size === 0) {
                this.countrySubscriptions.delete(subscription.countryCode);
            }
        }
        
        const groupSet = this.groupSubscriptions.get(subscription.groupId);
        if (groupSet) {
            groupSet.delete(userId);
            if (groupSet.size === 0) {
                this.groupSubscriptions.delete(subscription.groupId);
            }
        }
        
        logSubscriptionAction({
            action: 'SUBSCRIPTION_REMOVED',
            userId,
            adminId: 'SYSTEM_ADMIN',
            timestamp: new Date().toISOString()
        });
        
        return {
            success: true,
            message: `Subscription removed for user: ${userId}`
        };
    }
    
    /**
     * Get statistics
     */
    getStatistics() {
        const stats = {
            totalSubscriptions: this.subscriptions.size,
            activeSubscriptions: 0,
            expiredSubscriptions: 0,
            byCountry: {},
            byTier: {},
            totalWeeklyLendingCapacity: 0,
            totalMonthlyRevenue: 0
        };
        
        // Calculate statistics
        for (const [userId, subscription] of this.subscriptions) {
            // Count by state
            if (subscription.isActive()) {
                stats.activeSubscriptions++;
            } else if (subscription.state === SUBSCRIPTION_STATES.EXPIRED) {
                stats.expiredSubscriptions++;
            }
            
            // Count by country
            const countryCode = subscription.countryCode;
            if (!stats.byCountry[countryCode]) {
                stats.byCountry[countryCode] = {
                    total: 0,
                    active: 0,
                    weeklyCapacity: 0
                };
            }
            stats.byCountry[countryCode].total++;
            if (subscription.isActive()) {
                stats.byCountry[countryCode].active++;
                stats.byCountry[countryCode].weeklyCapacity += subscription.tier?.weeklyLimit || 0;
            }
            
            // Count by tier
            const tierId = subscription.tier?.id || 'none';
            if (!stats.byTier[tierId]) {
                stats.byTier[tierId] = 0;
            }
            stats.byTier[tierId]++;
            
            // Calculate capacity and revenue for active subscriptions
            if (subscription.isActive() && subscription.tier) {
                stats.totalWeeklyLendingCapacity += subscription.tier.weeklyLimit;
                
                // Estimate monthly revenue (simplified)
                const monthlyPrice = subscription.tier.monthlyPrice;
                stats.totalMonthlyRevenue += monthlyPrice;
            }
        }
        
        return stats;
    }
    
    /**
     * Run daily maintenance
     * - Check for expired subscriptions
     * - Reset weekly counters if needed
     * - Send notifications
     */
    runDailyMaintenance() {
        const now = new Date();
        const maintenanceLog = {
            date: now.toISOString(),
            checked: 0,
            expired: 0,
            reset: 0,
            notifications: []
        };
        
        for (const [userId, subscription] of this.subscriptions) {
            maintenanceLog.checked++;
            
            // Check for expiry
            if (subscription.state === SUBSCRIPTION_STATES.ACTIVE) {
                subscription.checkWeeklyReset();
                
                if (!subscription.isActive()) {
                    maintenanceLog.expired++;
                    maintenanceLog.notifications.push({
                        userId,
                        type: 'SUBSCRIPTION_EXPIRED',
                        message: `Your ${subscription.tier?.name} subscription has expired.`
                    });
                }
            }
            
            // Check for weekly reset
            if (subscription.weeklyResetDate && new Date(subscription.weeklyResetDate) < now) {
                subscription.resetWeeklyCounter();
                maintenanceLog.reset++;
            }
        }
        
        logSubscriptionAction({
            action: 'DAILY_MAINTENANCE',
            log: maintenanceLog,
            timestamp: now.toISOString()
        });
        
        return maintenanceLog;
    }
}

// Create singleton instance
export const subscriptionManager = new SubscriptionManager();

// Export utilities
export function formatCurrency(amount, countryCode) {
    const country = SUPPORTED_COUNTRIES[countryCode];
    if (!country) return `${amount} ${countryCode}`;
    
    return `${country.symbol} ${amount.toLocaleString()}`;
}

export function calculateDaysUntil28th() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Create date for 28th of current month
    const twentyEighth = new Date(currentYear, currentMonth, 28);
    
    // If today is after 28th, get 28th of next month
    if (now > twentyEighth) {
        twentyEighth.setMonth(twentyEighth.getMonth() + 1);
    }
    
    const diffTime = twentyEighth - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// Initialize module
export function initializeSubscriptionModule() {
    console.log('M-Pesewa Subscription Module Initialized');
    console.log('Supported Countries:', Object.keys(SUPPORTED_COUNTRIES).length);
    console.log('Subscription Tiers:', Object.keys(SUBSCRIPTION_TIERS).length);
    console.log('Next 28th in:', calculateDaysUntil28th(), 'days');
    
    // Schedule daily maintenance
    setInterval(() => {
        subscriptionManager.runDailyMaintenance();
    }, 24 * 60 * 60 * 1000); // Run every 24 hours
    
    return {
        manager: subscriptionManager,
        tiers: SUBSCRIPTION_TIERS,
        countries: SUPPORTED_COUNTRIES,
        states: SUBSCRIPTION_STATES
    };
}

// Default export
export default {
    Subscription,
    SubscriptionManager,
    subscriptionManager,
    SUBSCRIPTION_TIERS,
    SUPPORTED_COUNTRIES,
    SUBSCRIPTION_STATES,
    initializeSubscriptionModule,
    formatCurrency,
    calculateDaysUntil28th
};