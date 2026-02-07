/**
 * M-PESEWA SUBSCRIPTION RULES ENGINE
 * Strict enforcement of all subscription business rules
 * Non-negotiable: Country → Group → Lender → Subscription hierarchy
 */

// Import constants
import { SUBSCRIPTION_TIERS, SUPPORTED_COUNTRIES } from './index.js';

/**
 * Country-specific rules and restrictions
 */
export const COUNTRY_RULES = {
    // Kenya specific rules
    KE: {
        minAge: 18,
        maxAge: 65,
        allowedTiers: ['BASIC', 'PREMIUM', 'SUPER', 'LENDER_OF_LENDERS'],
        kycRequired: true,
        taxIdRequired: false,
        currency: 'KSh',
        crbIntegration: true,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 15000,
            SUPER: 50000,
            LENDER_OF_LENDERS: 200000
        }
    },
    // Uganda specific rules
    UG: {
        minAge: 18,
        maxAge: 65,
        allowedTiers: ['BASIC', 'PREMIUM', 'SUPER'],
        kycRequired: true,
        taxIdRequired: false,
        currency: 'UGX',
        crbIntegration: false,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 500000, // UGX
            SUPER: 2000000
        }
    },
    // Tanzania specific rules
    TZ: {
        minAge: 18,
        maxAge: 65,
        allowedTiers: ['BASIC', 'PREMIUM', 'SUPER'],
        kycRequired: true,
        taxIdRequired: true,
        currency: 'TZS',
        crbIntegration: true,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 30000,
            SUPER: 150000
        }
    },
    // Rwanda specific rules
    RW: {
        minAge: 21,
        maxAge: 65,
        allowedTiers: ['BASIC', 'PREMIUM', 'SUPER'],
        kycRequired: true,
        taxIdRequired: true,
        currency: 'RWF',
        crbIntegration: true,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 50000,
            SUPER: 200000
        }
    },
    // Burundi specific rules
    BI: {
        minAge: 18,
        maxAge: 60,
        allowedTiers: ['BASIC', 'PREMIUM'],
        kycRequired: true,
        taxIdRequired: false,
        currency: 'BIF',
        crbIntegration: false,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 50000
        }
    },
    // DRC specific rules
    CD: {
        minAge: 18,
        maxAge: 70,
        allowedTiers: ['BASIC', 'PREMIUM', 'SUPER'],
        kycRequired: true,
        taxIdRequired: false,
        currency: 'CDF',
        crbIntegration: false,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 50000,
            SUPER: 200000
        }
    },
    // South Sudan specific rules
    SS: {
        minAge: 18,
        maxAge: 65,
        allowedTiers: ['BASIC', 'PREMIUM'],
        kycRequired: true,
        taxIdRequired: false,
        currency: 'SSP',
        crbIntegration: false,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 10000
        }
    },
    // South Africa specific rules
    ZA: {
        minAge: 18,
        maxAge: 75,
        allowedTiers: ['BASIC', 'PREMIUM', 'SUPER', 'LENDER_OF_LENDERS'],
        kycRequired: true,
        taxIdRequired: true,
        currency: 'ZAR',
        crbIntegration: true,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 3000,
            SUPER: 10000,
            LENDER_OF_LENDERS: 50000
        }
    },
    // Nigeria specific rules
    NG: {
        minAge: 18,
        maxAge: 65,
        allowedTiers: ['BASIC', 'PREMIUM', 'SUPER'],
        kycRequired: true,
        taxIdRequired: true,
        currency: 'NGN',
        crbIntegration: true,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 50000,
            SUPER: 200000
        }
    },
    // Ghana specific rules
    GH: {
        minAge: 18,
        maxAge: 65,
        allowedTiers: ['BASIC', 'PREMIUM', 'SUPER'],
        kycRequired: true,
        taxIdRequired: true,
        currency: 'GHS',
        crbIntegration: true,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 1000,
            SUPER: 5000
        }
    },
    // Ethiopia specific rules
    ET: {
        minAge: 18,
        maxAge: 65,
        allowedTiers: ['BASIC', 'PREMIUM'],
        kycRequired: true,
        taxIdRequired: false,
        currency: 'ETB',
        crbIntegration: false,
        monthlyIncomeThresholds: {
            BASIC: 0,
            PREMIUM: 2000
        }
    },
    // Somalia specific rules
    SO: {
        minAge: 18,
        maxAge: 65,
        allowedTiers: ['BASIC'],
        kycRequired: false,
        taxIdRequired: false,
        currency: 'SOS',
        crbIntegration: false,
        monthlyIncomeThresholds: {
            BASIC: 0
        }
    }
};

/**
 * Group-level rules
 */
export const GROUP_RULES = {
    minMembersForLending: 5,
    maxMembers: 1000,
    minLendersInGroup: 2,
    maxGroupsPerBorrower: 4,
    referralRequired: true,
    guarantorsRequired: 2,
    groupTypes: ['FAMILY', 'CHURCH', 'PROFESSIONAL', 'LOCAL', 'SOCIAL', 'BUSINESS']
};

/**
 * Subscription tier eligibility rules
 */
export const TIER_ELIGIBILITY_RULES = {
    BASIC: {
        minLendingExperience: 0, // months
        minRepaymentRate: 0,
        maxDefaultRate: 100,
        requiredDocuments: ['ID'],
        trainingRequired: false,
        canUpgradeTo: ['PREMIUM']
    },
    PREMIUM: {
        minLendingExperience: 3, // months
        minRepaymentRate: 85, // percentage
        maxDefaultRate: 15,
        requiredDocuments: ['ID', 'PROOF_OF_INCOME'],
        trainingRequired: true,
        canUpgradeTo: ['SUPER']
    },
    SUPER: {
        minLendingExperience: 6, // months
        minRepaymentRate: 90,
        maxDefaultRate: 10,
        requiredDocuments: ['ID', 'PROOF_OF_INCOME', 'TAX_CERTIFICATE', 'CRB_REPORT'],
        trainingRequired: true,
        canUpgradeTo: ['LENDER_OF_LENDERS']
    },
    LENDER_OF_LENDERS: {
        minLendingExperience: 12, // months
        minRepaymentRate: 95,
        maxDefaultRate: 5,
        requiredDocuments: ['ID', 'PROOF_OF_INCOME', 'TAX_CERTIFICATE', 'CRB_REPORT', 'BUSINESS_LICENSE'],
        trainingRequired: true,
        canUpgradeTo: [] // Top tier
    }
};

/**
 * Validate if user can subscribe to a specific tier
 * @param {Object} params - Validation parameters
 * @returns {Object} Validation result
 */
export function validateSubscriptionTier(params) {
    const { tierId, countryCode, userId, groupId } = params;
    
    // Basic validation
    if (!tierId || !SUBSCRIPTION_TIERS[tierId]) {
        return {
            valid: false,
            reason: `Invalid subscription tier: ${tierId}`,
            code: 'INVALID_TIER'
        };
    }
    
    if (!countryCode || !SUPPORTED_COUNTRIES[countryCode]) {
        return {
            valid: false,
            reason: `Unsupported country: ${countryCode}`,
            code: 'UNSUPPORTED_COUNTRY'
        };
    }
    
    // Country-specific tier validation
    const countryRule = COUNTRY_RULES[countryCode];
    if (!countryRule) {
        return {
            valid: false,
            reason: `No rules defined for country: ${countryCode}`,
            code: 'NO_COUNTRY_RULES'
        };
    }
    
    if (!countryRule.allowedTiers.includes(tierId)) {
        return {
            valid: false,
            reason: `Tier ${tierId} not allowed in ${SUPPORTED_COUNTRIES[countryCode].name}`,
            code: 'TIER_NOT_ALLOWED_IN_COUNTRY'
        };
    }
    
    // Check CRB requirement
    const tier = SUBSCRIPTION_TIERS[tierId];
    if (tier.requiresCRB && !countryRule.crbIntegration) {
        return {
            valid: false,
            reason: `CRB checks required for ${tier.name} tier, but CRB not available in ${SUPPORTED_COUNTRIES[countryCode].name}`,
            code: 'CRB_NOT_AVAILABLE'
        };
    }
    
    // Check age requirements (simulated - would come from user profile)
    const userAge = params.age || 25; // Default for demo
    if (userAge < countryRule.minAge || userAge > countryRule.maxAge) {
        return {
            valid: false,
            reason: `Age ${userAge} not allowed. Must be between ${countryRule.minAge}-${countryRule.maxAge} years in ${SUPPORTED_COUNTRIES[countryCode].name}`,
            code: 'AGE_RESTRICTION'
        };
    }
    
    // Check income requirements for higher tiers (simulated)
    if (tierId !== 'BASIC') {
        const userIncome = params.monthlyIncome || 0;
        const requiredIncome = countryRule.monthlyIncomeThresholds[tierId] || 0;
        
        if (userIncome < requiredIncome) {
            return {
                valid: false,
                reason: `Monthly income ${userIncome} ${countryRule.currency} below required ${requiredIncome} ${countryRule.currency} for ${tier.name} tier`,
                code: 'INSUFFICIENT_INCOME'
            };
        }
    }
    
    // Check group requirements
    if (!groupId) {
        return {
            valid: false,
            reason: 'Group membership required for subscription',
            code: 'GROUP_REQUIRED'
        };
    }
    
    // Check if user is in maximum groups (for borrowers)
    const userGroups = params.userGroups || [];
    if (userGroups.length >= GROUP_RULES.maxGroupsPerBorrower && params.role === 'BORROWER') {
        return {
            valid: false,
            reason: `Maximum ${GROUP_RULES.maxGroupsPerBorrower} groups reached`,
            code: 'MAX_GROUPS_REACHED'
        };
    }
    
    // Check repayment history for upgrades (simulated)
    if (params.currentTier && params.currentTier !== tierId) {
        const eligibility = TIER_ELIGIBILITY_RULES[tierId];
        const canUpgradeFrom = TIER_ELIGIBILITY_RULES[params.currentTier]?.canUpgradeTo || [];
        
        if (!canUpgradeFrom.includes(tierId)) {
            return {
                valid: false,
                reason: `Cannot upgrade from ${params.currentTier} to ${tierId}`,
                code: 'UPGRADE_NOT_ALLOWED'
            };
        }
        
        // Check lending experience
        const lendingExperience = params.lendingExperience || 0; // months
        if (lendingExperience < eligibility.minLendingExperience) {
            return {
                valid: false,
                reason: `Minimum ${eligibility.minLendingExperience} months lending experience required for ${tier.name}`,
                code: 'INSUFFICIENT_EXPERIENCE'
            };
        }
        
        // Check repayment rate
        const repaymentRate = params.repaymentRate || 0; // percentage
        if (repaymentRate < eligibility.minRepaymentRate) {
            return {
                valid: false,
                reason: `Minimum ${eligibility.minRepaymentRate}% repayment rate required for ${tier.name}`,
                code: 'LOW_REPAYMENT_RATE'
            };
        }
        
        // Check default rate
        const defaultRate = params.defaultRate || 0; // percentage
        if (defaultRate > eligibility.maxDefaultRate) {
            return {
                valid: false,
                reason: `Default rate ${defaultRate}% exceeds maximum ${eligibility.maxDefaultRate}% for ${tier.name}`,
                code: 'HIGH_DEFAULT_RATE'
            };
        }
    }
    
    // Check required documents (simulated)
    const userDocuments = params.documents || [];
    const requiredDocs = TIER_ELIGIBILITY_RULES[tierId].requiredDocuments || [];
    
    const missingDocs = requiredDocs.filter(doc => !userDocuments.includes(doc));
    if (missingDocs.length > 0) {
        return {
            valid: false,
            reason: `Missing required documents: ${missingDocs.join(', ')}`,
            code: 'MISSING_DOCUMENTS',
            missingDocuments: missingDocs
        };
    }
    
    // Check blacklist status
    if (params.isBlacklisted) {
        return {
            valid: false,
            reason: 'User is blacklisted and cannot subscribe',
            code: 'USER_BLACKLISTED'
        };
    }
    
    // All checks passed
    return {
        valid: true,
        tier: tier,
        country: SUPPORTED_COUNTRIES[countryCode],
        requirements: TIER_ELIGIBILITY_RULES[tierId],
        message: `Eligible for ${tier.name} subscription in ${SUPPORTED_COUNTRIES[countryCode].name}`
    };
}

/**
 * Validate lending amount against subscription limits
 * @param {Object} params - Validation parameters
 * @returns {Object} Validation result
 */
export function validateLendingAmount(params) {
    const { tierId, amount, totalLentThisWeek, countryCode, loanCount } = params;
    
    if (!tierId || !SUBSCRIPTION_TIERS[tierId]) {
        return {
            valid: false,
            reason: 'Invalid subscription tier',
            code: 'INVALID_TIER'
        };
    }
    
    const tier = SUBSCRIPTION_TIERS[tierId];
    
    // Check amount is positive
    if (amount <= 0) {
        return {
            valid: false,
            reason: 'Lending amount must be positive',
            code: 'INVALID_AMOUNT'
        };
    }
    
    // Check minimum amount (5 units in local currency)
    const minAmount = 5;
    if (amount < minAmount) {
        return {
            valid: false,
            reason: `Minimum lending amount is ${minAmount}`,
            code: 'BELOW_MINIMUM'
        };
    }
    
    // Check against weekly limit
    const remainingWeekly = tier.weeklyLimit - (totalLentThisWeek || 0);
    if (amount > remainingWeekly) {
        return {
            valid: false,
            reason: `Amount exceeds weekly limit. Remaining: ${remainingWeekly}`,
            code: 'WEEKLY_LIMIT_EXCEEDED',
            remaining: remainingWeekly,
            limit: tier.weeklyLimit
        };
    }
    
    // Check against max ledgers
    const maxLedgers = tier.maxLedgers;
    if (loanCount >= maxLedgers) {
        return {
            valid: false,
            reason: `Maximum ledgers (${maxLedgers}) reached`,
            code: 'MAX_LEDGERS_REACHED',
            limit: maxLedgers
        };
    }
    
    // Country-specific amount validation
    const country = SUPPORTED_COUNTRIES[countryCode];
    if (country) {
        // Convert to USD for cross-country comparison (simplified)
        const exchangeRates = {
            KSh: 0.0078,   // 1 KSh = 0.0078 USD
            UGX: 0.00027,  // 1 UGX = 0.00027 USD
            TZS: 0.00043,  // 1 TZS = 0.00043 USD
            RWF: 0.00081,  // 1 RWF = 0.00081 USD
            BIF: 0.00035,  // 1 BIF = 0.00035 USD
            CDF: 0.00037,  // 1 CDF = 0.00037 USD
            SSP: 0.0026,   // 1 SSP = 0.0026 USD
            ZAR: 0.055,    // 1 ZAR = 0.055 USD
            NGN: 0.00066,  // 1 NGN = 0.00066 USD
            GHS: 0.065,    // 1 GHS = 0.065 USD
            ETB: 0.017,    // 1 ETB = 0.017 USD
            SOS: 0.0017    // 1 SOS = 0.0017 USD
        };
        
        const rate = exchangeRates[country.currency] || 0.01;
        const amountUSD = amount * rate;
        
        // Global maximum check (approx $500 USD equivalent)
        if (amountUSD > 500) {
            return {
                valid: false,
                reason: `Amount too high for emergency micro-lending`,
                code: 'AMOUNT_TOO_HIGH',
                maxUSD: 500,
                amountUSD: amountUSD.toFixed(2)
            };
        }
    }
    
    // All checks passed
    return {
        valid: true,
        tier: tier.name,
        weeklyLimit: tier.weeklyLimit,
        remainingWeekly: remainingWeekly - amount,
        maxLedgers: tier.maxLedgers,
        message: `Valid to lend ${amount} ${country?.currency || ''}`
    };
}

/**
 * Check if subscription can be renewed
 * @param {Object} subscription - Subscription object
 * @returns {Object} Renewal validation result
 */
export function validateRenewal(subscription) {
    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    
    // Check if already expired
    if (now > expiry && subscription.state === 'EXPIRED') {
        const daysSinceExpiry = Math.floor((now - expiry) / (1000 * 60 * 60 * 24));
        
        // Grace period: 7 days after expiry
        if (daysSinceExpiry <= 7) {
            return {
                canRenew: true,
                status: 'GRACE_PERIOD',
                daysSinceExpiry,
                gracePeriodRemaining: 7 - daysSinceExpiry,
                requiresPenalty: true,
                penaltyPercentage: 10 // 10% penalty during grace period
            };
        } else {
            return {
                canRenew: false,
                status: 'EXPIRED_BEYOND_GRACE',
                daysSinceExpiry,
                reason: 'Subscription expired beyond 7-day grace period',
                requiredAction: 'NEW_SUBSCRIPTION'
            };
        }
    }
    
    // Check if can renew early (within 14 days of expiry)
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 14 && daysUntilExpiry > 0) {
        return {
            canRenew: true,
            status: 'RENEWAL_WINDOW',
            daysUntilExpiry,
            earlyRenewal: true,
            discountPercentage: 5 // 5% discount for early renewal
        };
    }
    
    // Normal renewal (not in renewal window yet)
    if (daysUntilExpiry > 14) {
        return {
            canRenew: false,
            status: 'NOT_IN_RENEWAL_WINDOW',
            daysUntilExpiry,
            reason: 'Can only renew within 14 days of expiry',
            earliestRenewalDate: new Date(expiry.getTime() - (14 * 24 * 60 * 60 * 1000))
        };
    }
    
    // Active subscription
    return {
        canRenew: true,
        status: 'ACTIVE',
        daysUntilExpiry,
        normalRenewal: true
    };
}

/**
 * Calculate renewal price with discounts/penalties
 * @param {Object} subscription - Subscription object
 * @param {string} period - Renewal period
 * @returns {Object} Price calculation
 */
export function calculateRenewalPrice(subscription, period) {
    const renewalValidation = validateRenewal(subscription);
    const basePrice = subscription.getPriceForPeriod(period);
    
    let finalPrice = basePrice;
    let adjustments = [];
    
    // Apply grace period penalty
    if (renewalValidation.requiresPenalty) {
        const penalty = basePrice * (renewalValidation.penaltyPercentage / 100);
        finalPrice += penalty;
        adjustments.push({
            type: 'PENALTY',
            percentage: renewalValidation.penaltyPercentage,
            amount: penalty,
            reason: 'Grace period renewal'
        });
    }
    
    // Apply early renewal discount
    if (renewalValidation.discountPercentage) {
        const discount = basePrice * (renewalValidation.discountPercentage / 100);
        finalPrice -= discount;
        adjustments.push({
            type: 'DISCOUNT',
            percentage: renewalValidation.discountPercentage,
            amount: -discount,
            reason: 'Early renewal discount'
        });
    }
    
    // Apply loyalty discount for consecutive renewals
    const paymentHistory = subscription.getPaymentHistory();
    const consecutiveRenewals = paymentHistory.filter(p => p.type === 'RENEWAL').length;
    
    if (consecutiveRenewals >= 3) {
        const loyaltyDiscount = basePrice * 0.05; // 5% loyalty discount
        finalPrice -= loyaltyDiscount;
        adjustments.push({
            type: 'LOYALTY_DISCOUNT',
            percentage: 5,
            amount: -loyaltyDiscount,
            reason: `Loyalty discount for ${consecutiveRenewals} consecutive renewals`
        });
    }
    
    // Ensure price is not negative
    finalPrice = Math.max(finalPrice, basePrice * 0.5); // Minimum 50% of base price
    
    return {
        basePrice,
        finalPrice,
        adjustments,
        currency: SUPPORTED_COUNTRIES[subscription.countryCode]?.currency || 'USD',
        renewalStatus: renewalValidation.status
    };
}

/**
 * Check if user can upgrade to a higher tier
 * @param {Object} currentSubscription - Current subscription
 * @param {string} newTierId - Target tier
 * @returns {Object} Upgrade validation
 */
export function validateUpgrade(currentSubscription, newTierId) {
    if (!currentSubscription.tier) {
        return {
            canUpgrade: false,
            reason: 'No active subscription',
            code: 'NO_ACTIVE_SUBSCRIPTION'
        };
    }
    
    const currentTierId = currentSubscription.tier.id;
    const currentTier = SUBSCRIPTION_TIERS[currentTierId];
    const newTier = SUBSCRIPTION_TIERS[newTierId];
    
    if (!newTier) {
        return {
            canUpgrade: false,
            reason: `Invalid target tier: ${newTierId}`,
            code: 'INVALID_TARGET_TIER'
        };
    }
    
    // Check if actually upgrading
    const tierHierarchy = ['BASIC', 'PREMIUM', 'SUPER', 'LENDER_OF_LENDERS'];
    const currentIndex = tierHierarchy.indexOf(currentTierId);
    const newIndex = tierHierarchy.indexOf(newTierId);
    
    if (newIndex <= currentIndex) {
        return {
            canUpgrade: false,
            reason: `Cannot upgrade from ${currentTier.name} to ${newTier.name}`,
            code: 'NOT_AN_UPGRADE'
        };
    }
    
    // Check eligibility rules
    const eligibility = TIER_ELIGIBILITY_RULES[newTierId];
    
    // Check if current tier can upgrade to target
    const canUpgradeFrom = TIER_ELIGIBILITY_RULES[currentTierId]?.canUpgradeTo || [];
    if (!canUpgradeFrom.includes(newTierId)) {
        return {
            canUpgrade: false,
            reason: `Cannot upgrade from ${currentTier.name} to ${newTier.name}`,
            code: 'UPGRADE_PATH_NOT_ALLOWED'
        };
    }
    
    // Get user metrics (simulated - would come from ledger system)
    const userMetrics = {
        lendingExperience: 6, // months
        repaymentRate: 92, // percentage
        defaultRate: 8, // percentage
        totalLent: 50000,
        activeLoans: 5
    };
    
    // Check lending experience
    if (userMetrics.lendingExperience < eligibility.minLendingExperience) {
        return {
            canUpgrade: false,
            reason: `Minimum ${eligibility.minLendingExperience} months experience required`,
            code: 'INSUFFICIENT_EXPERIENCE',
            required: eligibility.minLendingExperience,
            current: userMetrics.lendingExperience
        };
    }
    
    // Check repayment rate
    if (userMetrics.repaymentRate < eligibility.minRepaymentRate) {
        return {
            canUpgrade: false,
            reason: `Minimum ${eligibility.minRepaymentRate}% repayment rate required`,
            code: 'LOW_REPAYMENT_RATE',
            required: eligibility.minRepaymentRate,
            current: userMetrics.repaymentRate
        };
    }
    
    // Check default rate
    if (userMetrics.defaultRate > eligibility.maxDefaultRate) {
        return {
            canUpgrade: false,
            reason: `Maximum ${eligibility.maxDefaultRate}% default rate allowed`,
            code: 'HIGH_DEFAULT_RATE',
            allowed: eligibility.maxDefaultRate,
            current: userMetrics.defaultRate
        };
    }
    
    // Check country-specific rules
    const countryRule = COUNTRY_RULES[currentSubscription.countryCode];
    if (countryRule && !countryRule.allowedTiers.includes(newTierId)) {
        return {
            canUpgrade: false,
            reason: `Tier ${newTier.name} not allowed in ${SUPPORTED_COUNTRIES[currentSubscription.countryCode].name}`,
            code: 'TIER_NOT_ALLOWED_IN_COUNTRY'
        };
    }
    
    // All checks passed
    return {
        canUpgrade: true,
        currentTier: currentTier.name,
        newTier: newTier.name,
        weeklyLimitIncrease: newTier.weeklyLimit - currentTier.weeklyLimit,
        maxLedgersIncrease: newTier.maxLedgers - currentTier.maxLedgers,
        priceDifference: newTier.monthlyPrice - currentTier.monthlyPrice,
        requiresCRB: newTier.requiresCRB && !currentTier.requiresCRB,
        message: `Eligible to upgrade from ${currentTier.name} to ${newTier.name}`
    };
}

/**
 * Calculate prorated upgrade price
 * @param {Object} currentSubscription - Current subscription
 * @param {string} newTierId - Target tier
 * @returns {Object} Price calculation
 */
export function calculateUpgradePrice(currentSubscription, newTierId) {
    const upgradeValidation = validateUpgrade(currentSubscription, newTierId);
    
    if (!upgradeValidation.canUpgrade) {
        return {
            valid: false,
            reason: upgradeValidation.reason,
            code: upgradeValidation.code
        };
    }
    
    const currentTier = currentSubscription.tier;
    const newTier = SUBSCRIPTION_TIERS[newTierId];
    
    // Calculate days used in current billing period
    const now = new Date();
    const periodStart = new Date(currentSubscription.currentPeriodStart);
    const periodEnd = new Date(currentSubscription.currentPeriodEnd);
    
    const totalDays = Math.ceil((periodEnd - periodStart) / (1000 * 60 * 60 * 24));
    const daysUsed = Math.ceil((now - periodStart) / (1000 * 60 * 60 * 24));
    const daysRemaining = totalDays - daysUsed;
    
    // Calculate prorated amounts
    const periodType = currentSubscription.getCurrentPeriodType();
    const currentPeriodPrice = currentTier[periodType + 'Price'];
    const newPeriodPrice = newTier[periodType + 'Price'];
    
    const dailyCurrentRate = currentPeriodPrice / totalDays;
    const dailyNewRate = newPeriodPrice / totalDays;
    
    const amountUsed = dailyCurrentRate * daysUsed;
    const amountRemainingCurrent = dailyCurrentRate * daysRemaining;
    const amountRemainingNew = dailyNewRate * daysRemaining;
    
    const upgradeCost = Math.max(0, amountRemainingNew - amountRemainingCurrent);
    
    return {
        valid: true,
        currentTier: currentTier.name,
        newTier: newTier.name,
        daysUsed,
        daysRemaining,
        totalDays,
        currentPeriodPrice,
        newPeriodPrice,
        upgradeCost,
        prorated: true,
        explanation: `Prorated upgrade: ${daysUsed} days used, ${daysRemaining} days remaining`,
        breakdown: {
            amountUsed: amountUsed,
            amountRemainingCurrent: amountRemainingCurrent,
            amountRemainingNew: amountRemainingNew,
            upgradeDifference: upgradeCost
        }
    };
}

/**
 * Get all rules for a specific country
 * @param {string} countryCode - Country code
 * @returns {Object} Country rules
 */
export function getCountryRules(countryCode) {
    const country = SUPPORTED_COUNTRIES[countryCode];
    const rules = COUNTRY_RULES[countryCode];
    
    if (!country || !rules) {
        return null;
    }
    
    return {
        country: country.name,
        currency: country.currency,
        ...rules,
        supportedTiers: rules.allowedTiers.map(tierId => ({
            ...SUBSCRIPTION_TIERS[tierId],
            eligibility: TIER_ELIGIBILITY_RULES[tierId]
        }))
    };
}

/**
 * Export all rules for documentation/display
 */
export function getAllRules() {
    return {
        countries: SUPPORTED_COUNTRIES,
        subscriptionTiers: SUBSCRIPTION_TIERS,
        countryRules: COUNTRY_RULES,
        groupRules: GROUP_RULES,
        tierEligibilityRules: TIER_ELIGIBILITY_RULES,
        lastUpdated: new Date().toISOString()
    };
}

// Export default
export default {
    validateSubscriptionTier,
    validateLendingAmount,
    validateRenewal,
    validateUpgrade,
    calculateRenewalPrice,
    calculateUpgradePrice,
    getCountryRules,
    getAllRules,
    COUNTRY_RULES,
    GROUP_RULES,
    TIER_ELIGIBILITY_RULES
};