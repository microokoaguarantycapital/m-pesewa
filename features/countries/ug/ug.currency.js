/**
 * M-PESEWA UGANDA CURRENCY MODULE
 * STRICT COUNTRY ISOLATION: No cross-currency operations
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

class UgandaCurrency {
    constructor() {
        // Strict currency configuration for Uganda
        this.config = {
            countryCode: 'UG',
            countryName: 'Uganda',
            currencyCode: 'UGX',
            currencyName: 'Ugandan Shilling',
            currencySymbol: 'USh',
            
            // Decimal configuration
            decimalPlaces: 0, // UGX has no decimal places
            decimalSeparator: '',
            thousandSeparator: ',',
            
            // Minimum and maximum values
            minimumAmount: 100, // Minimum 100 UGX
            maximumAmount: 50000000, // Maximum 50 million UGX
            
            // Subscription tiers in UGX (Strict non-negotiable values)
            subscriptionTiers: {
                basic: {
                    name: 'Basic',
                    weeklyLimit: 1500000, // 1,500,000 UGX per week
                    monthlyFee: 50000, // 50,000 UGX per month
                    biAnnualFee: 250000, // 250,000 UGX bi-annual
                    annualFee: 500000, // 500,000 UGX annual
                    ledgerLimit: 1500000
                },
                premium: {
                    name: 'Premium',
                    weeklyLimit: 5000000, // 5,000,000 UGX per week
                    monthlyFee: 250000, // 250,000 UGX per month
                    biAnnualFee: 1500000, // 1,500,000 UGX bi-annual
                    annualFee: 2500000, // 2,500,000 UGX annual
                    ledgerLimit: 10000000
                },
                super: {
                    name: 'Super',
                    weeklyLimit: 20000000, // 20,000,000 UGX per week
                    monthlyFee: 1000000, // 1,000,000 UGX per month
                    biAnnualFee: 5000000, // 5,000,000 UGX bi-annual
                    annualFee: 8500000, // 8,500,000 UGX annual
                    ledgerLimit: 20000000
                },
                lenderOfLenders: {
                    name: 'Lender of Lenders',
                    weeklyLimit: 50000000, // 50,000,000 UGX
                    monthlyFee: 500000, // 500,000 UGX per month
                    biAnnualFee: 3500000, // 3,500,000 UGX bi-annual
                    annualFee: 6500000, // 6,500,000 UGX annual
                    ledgerLimit: 50000000,
                    crbRequired: true,
                    minRepaymentPeriod: 30 // 30 days minimum
                }
            },
            
            // Loan calculation parameters
            loanParameters: {
                interestRate: 0.10, // 10% per week
                repaymentPeriod: 7, // 7 days
                dailyPenaltyRate: 0.05, // 5% daily after 7 days
                defaultPeriod: 60, // 60 days (2 months) for default
                partialRepaymentsAllowed: true,
                minLoanAmount: 100, // Minimum 100 UGX
                maxActiveLoansPerGroup: 1
            },
            
            // Currency validation rules
            validationRules: {
                amountRegex: /^\d+$/,
                maxLength: 10,
                allowedCharacters: '0123456789',
                roundToNearest: 100 // Round to nearest 100 UGX
            },
            
            // Exchange rate reference (read-only, for display only)
            referenceRates: {
                USD: 0.00027,
                KES: 0.042,
                TZS: 0.63,
                RWF: 0.32
            }
        };
    }

    // ============================================
    // CURRENCY FORMATTING METHODS
    // ============================================

    format(amount) {
        if (!this.isValidAmount(amount)) {
            throw new Error(`Invalid UGX amount: ${amount}`);
        }
        
        const formatted = this._addThousandSeparators(amount.toString());
        return `${this.config.currencySymbol} ${formatted}`;
    }

    _addThousandSeparators(numberString) {
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, this.config.thousandSeparator);
    }

    formatForDisplay(amount) {
        return this.format(amount);
    }

    formatForInput(amount) {
        return amount.toString().replace(/\D/g, '');
    }

    // ============================================
    // VALIDATION METHODS
    // ============================================

    isValidAmount(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return false;
        }
        
        if (amount < this.config.minimumAmount) {
            return false;
        }
        
        if (amount > this.config.maximumAmount) {
            return false;
        }
        
        if (!Number.isInteger(amount)) {
            return false;
        }
        
        return true;
    }

    validateSubscriptionTier(tierName) {
        const tier = this.config.subscriptionTiers[tierName];
        if (!tier) {
            throw new Error(`Invalid subscription tier: ${tierName}`);
        }
        
        return {
            isValid: true,
            tier,
            currency: this.config.currencyCode,
            country: this.config.countryName
        };
    }

    // ============================================
    // CALCULATION METHODS
    // ============================================

    calculateInterest(principal, days = 7) {
        if (!this.isValidAmount(principal)) {
            throw new Error('Invalid principal amount');
        }
        
        const weeks = days / 7;
        const interest = Math.round(principal * this.config.loanParameters.interestRate * weeks);
        return interest;
    }

    calculateTotalRepayment(principal, days = 7) {
        const interest = this.calculateInterest(principal, days);
        return principal + interest;
    }

    calculateDailyPenalty(outstandingAmount, overdueDays) {
        if (overdueDays <= 7) return 0;
        
        const penaltyDays = overdueDays - 7;
        let penalty = 0;
        
        for (let i = 0; i < penaltyDays; i++) {
            penalty += Math.round(outstandingAmount * this.config.loanParameters.dailyPenaltyRate);
            outstandingAmount += penalty;
        }
        
        return penalty;
    }

    calculateDailyRepayment(totalAmount, days = 7) {
        if (days <= 0) return totalAmount;
        return Math.ceil(totalAmount / days);
    }

    // ============================================
    // SUBSCRIPTION METHODS
    // ============================================

    getSubscriptionAmount(tier, period) {
        const subscription = this.config.subscriptionTiers[tier];
        if (!subscription) {
            throw new Error(`Tier ${tier} not found for Uganda`);
        }
        
        switch(period) {
            case 'monthly':
                return subscription.monthlyFee;
            case 'bi-annual':
                return subscription.biAnnualFee;
            case 'annual':
                return subscription.annualFee;
            default:
                throw new Error(`Invalid period: ${period}`);
        }
    }

    getTierLimit(tier) {
        const subscription = this.config.subscriptionTiers[tier];
        if (!subscription) {
            throw new Error(`Tier ${tier} not found for Uganda`);
        }
        
        return {
            weekly: subscription.weeklyLimit,
            ledger: subscription.ledgerLimit,
            name: subscription.name
        };
    }

    // ============================================
    // LOAN VALIDATION METHODS
    // ============================================

    validateLoanRequest(amount, borrowerRating, currentActiveLoans) {
        const errors = [];
        
        // Amount validation
        if (!this.isValidAmount(amount)) {
            errors.push(`Amount must be between ${this.format(this.config.minimumAmount)} and ${this.format(this.config.maximumAmount)}`);
        }
        
        // Rating validation (borrowers with rating < 2 cannot borrow)
        if (borrowerRating < 2) {
            errors.push('Borrower rating too low (minimum 2 stars required)');
        }
        
        // Active loans validation
        if (currentActiveLoans >= this.config.loanParameters.maxActiveLoansPerGroup) {
            errors.push('Maximum active loans per group reached');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            suggestedAmount: this._suggestLoanAmount(amount, borrowerRating)
        };
    }

    _suggestLoanAmount(requestedAmount, rating) {
        // Suggest amount based on rating
        const ratingMultipliers = {
            5: 1.5, // Excellent rating: 150% of requested
            4: 1.2, // Good rating: 120% of requested
            3: 1.0, // Average rating: 100% of requested
            2: 0.8, // Fair rating: 80% of requested
            1: 0.5  // Poor rating: 50% of requested
        };
        
        const multiplier = ratingMultipliers[Math.floor(rating)] || 1.0;
        let suggested = Math.round(requestedAmount * multiplier);
        
        // Ensure suggestion is within bounds
        suggested = Math.max(suggested, this.config.minimumAmount);
        suggested = Math.min(suggested, this.config.maximumAmount);
        
        // Round to nearest 100
        suggested = Math.round(suggested / 100) * 100;
        
        return suggested;
    }

    // ============================================
    // LEDGER CALCULATION METHODS
    // ============================================

    generateLedgerCalculations(principal, disbursementDate, repaymentSchedule = 'weekly') {
        const interest = this.calculateInterest(principal);
        const total = principal + interest;
        const dailyAmount = this.calculateDailyRepayment(total);
        
        // Generate repayment schedule
        const schedule = [];
        const dueDate = new Date(disbursementDate);
        dueDate.setDate(dueDate.getDate() + 7);
        
        for (let i = 1; i <= 7; i++) {
            const date = new Date(disbursementDate);
            date.setDate(date.getDate() + i);
            
            schedule.push({
                day: i,
                date: date.toISOString().split('T')[0],
                amountDue: dailyAmount,
                cumulativeAmount: dailyAmount * i,
                status: 'pending'
            });
        }
        
        return {
            principal: principal,
            interest: interest,
            totalRepayment: total,
            dueDate: dueDate.toISOString().split('T')[0],
            dailyRepayment: dailyAmount,
            schedule: schedule,
            currency: this.config.currencyCode,
            breakdown: {
                principal: this.format(principal),
                interest: this.format(interest),
                total: this.format(total),
                daily: this.format(dailyAmount)
            }
        };
    }

    // ============================================
    // DEFAULT CALCULATION METHODS
    // ============================================

    calculateDefaultAmount(principal, overdueDays) {
        const totalRepayment = this.calculateTotalRepayment(principal, 7);
        const penalty = this.calculateDailyPenalty(totalRepayment, overdueDays);
        
        return {
            principal: principal,
            interest: this.calculateInterest(principal),
            penalty: penalty,
            total: totalRepayment + penalty,
            overdueDays: overdueDays,
            isDefault: overdueDays >= this.config.loanParameters.defaultPeriod
        };
    }

    // ============================================
    // TIER UPGRADE VALIDATION
    // ============================================

    validateTierUpgrade(currentTier, newTier, lenderPerformance) {
        const currentTierData = this.config.subscriptionTiers[currentTier];
        const newTierData = this.config.subscriptionTiers[newTier];
        
        if (!currentTierData || !newTierData) {
            return {
                canUpgrade: false,
                reason: 'Invalid tier selection'
            };
        }
        
        // Check if downgrading (not allowed in same subscription period)
        const tierHierarchy = ['basic', 'premium', 'super', 'lenderOfLenders'];
        const currentIndex = tierHierarchy.indexOf(currentTier);
        const newIndex = tierHierarchy.indexOf(newTier);
        
        if (newIndex < currentIndex) {
            return {
                canUpgrade: false,
                reason: 'Downgrading not allowed during subscription period'
            };
        }
        
        // Performance requirements for upgrade
        if (newTier === 'super' || newTier === 'lenderOfLenders') {
            if (!lenderPerformance || lenderPerformance.defaultRate > 0.05) {
                return {
                    canUpgrade: false,
                    reason: 'Default rate must be below 5% for Super tier'
                };
            }
        }
        
        return {
            canUpgrade: true,
            currentTier: currentTierData.name,
            newTier: newTierData.name,
            upgradeFee: this._calculateUpgradeFee(currentTier, newTier),
            newLimits: {
                weekly: newTierData.weeklyLimit,
                ledger: newTierData.ledgerLimit
            }
        };
    }

    _calculateUpgradeFee(currentTier, newTier) {
        // Calculate pro-rated upgrade fee
        const tierValues = {
            basic: 1,
            premium: 2,
            super: 3,
            lenderOfLenders: 4
        };
        
        const difference = tierValues[newTier] - tierValues[currentTier];
        const baseUpgradeFee = 50000; // 50,000 UGX base fee
        
        return baseUpgradeFee * difference;
    }

    // ============================================
    // CURRENCY CONVERSION (DISPLAY ONLY)
    // ============================================

    convertToDisplayCurrency(amount, targetCurrency) {
        // Note: This is for display only. Actual transactions happen in UGX only.
        const rate = this.config.referenceRates[targetCurrency];
        if (!rate) {
            throw new Error(`Conversion rate for ${targetCurrency} not available`);
        }
        
        const converted = amount * rate;
        return {
            amount: converted,
            currency: targetCurrency,
            rate: rate,
            original: {
                amount: amount,
                currency: this.config.currencyCode
            }
        };
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    parseAmount(input) {
        // Remove currency symbol and thousand separators
        const clean = input.toString()
            .replace(this.config.currencySymbol, '')
            .replace(new RegExp(`\\${this.config.thousandSeparator}`, 'g'), '')
            .trim();
        
        const amount = parseInt(clean, 10);
        
        if (isNaN(amount)) {
            throw new Error(`Cannot parse amount from: ${input}`);
        }
        
        return amount;
    }

    roundAmount(amount) {
        const roundTo = this.config.validationRules.roundToNearest;
        return Math.round(amount / roundTo) * roundTo;
    }

    // ============================================
    // EXPORT CONFIGURATION
    // ============================================

    getConfig() {
        return {
            ...this.config,
            // Remove reference rates from public config
            referenceRates: undefined
        };
    }

    getPublicConfig() {
        return {
            countryCode: this.config.countryCode,
            countryName: this.config.countryName,
            currencyCode: this.config.currencyCode,
            currencySymbol: this.config.currencySymbol,
            decimalPlaces: this.config.decimalPlaces,
            minimumAmount: this.config.minimumAmount,
            maximumAmount: this.config.maximumAmount,
            subscriptionTiers: Object.keys(this.config.subscriptionTiers).map(key => ({
                name: this.config.subscriptionTiers[key].name,
                weeklyLimit: this.config.subscriptionTiers[key].weeklyLimit,
                monthlyFee: this.config.subscriptionTiers[key].monthlyFee
            })),
            loanParameters: {
                interestRate: this.config.loanParameters.interestRate,
                repaymentPeriod: this.config.loanParameters.repaymentPeriod,
                partialRepaymentsAllowed: this.config.loanParameters.partialRepaymentsAllowed
            }
        };
    }

    // ============================================
    // VALIDATION FOR UI COMPONENTS
    // ============================================

    validateInputAmount(input) {
        const amount = this.parseAmount(input);
        
        if (amount < this.config.minimumAmount) {
            return {
                isValid: false,
                error: `Minimum amount is ${this.format(this.config.minimumAmount)}`,
                suggested: this.config.minimumAmount
            };
        }
        
        if (amount > this.config.maximumAmount) {
            return {
                isValid: false,
                error: `Maximum amount is ${this.format(this.config.maximumAmount)}`,
                suggested: this.config.maximumAmount
            };
        }
        
        return {
            isValid: true,
            amount: amount,
            formatted: this.format(amount)
        };
    }

    // ============================================
    // SUBSCRIPTION EXPIRY CALCULATION
    // ============================================

    calculateSubscriptionExpiry(startDate, period) {
        const start = new Date(startDate);
        let expiry = new Date(start);
        
        switch(period) {
            case 'monthly':
                expiry.setMonth(expiry.getMonth() + 1);
                break;
            case 'bi-annual':
                expiry.setMonth(expiry.getMonth() + 6);
                break;
            case 'annual':
                expiry.setFullYear(expiry.getFullYear() + 1);
                break;
            default:
                throw new Error(`Invalid period: ${period}`);
        }
        
        // Set expiry to 28th of the month (strict rule)
        expiry.setDate(28);
        
        // Calculate days remaining
        const today = new Date();
        const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        return {
            expiryDate: expiry.toISOString().split('T')[0],
            daysRemaining: Math.max(0, daysRemaining),
            isExpired: daysRemaining <= 0,
            period: period,
            formattedExpiry: expiry.toLocaleDateString('en-UG', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        };
    }
}

// ============================================
// EXPORT AND SINGLETON PATTERN
// ============================================

let ugandaCurrencyInstance = null;

export function getUgandaCurrency() {
    if (!ugandaCurrencyInstance) {
        ugandaCurrencyInstance = new UgandaCurrency();
    }
    return ugandaCurrencyInstance;
}

export default UgandaCurrency;

// ============================================
// HELPER FUNCTIONS FOR COMMON OPERATIONS
// ============================================

export function formatUGX(amount) {
    const currency = getUgandaCurrency();
    return currency.format(amount);
}

export function calculateUGXLoan(principal, days = 7) {
    const currency = getUgandaCurrency();
    return {
        principal: currency.format(principal),
        interest: currency.format(currency.calculateInterest(principal, days)),
        total: currency.format(currency.calculateTotalRepayment(principal, days)),
        daily: currency.format(currency.calculateDailyRepayment(
            currency.calculateTotalRepayment(principal, days), 
            days
        ))
    };
}

export function validateUGXSubscription(tier, amount) {
    const currency = getUgandaCurrency();
    const tierData = currency.config.subscriptionTiers[tier];
    
    if (!tierData) {
        return { isValid: false, error: 'Invalid tier' };
    }
    
    const validAmounts = [
        tierData.monthlyFee,
        tierData.biAnnualFee,
        tierData.annualFee
    ];
    
    const isValid = validAmounts.includes(amount);
    
    return {
        isValid,
        tier: tierData.name,
        expectedAmounts: {
            monthly: tierData.monthlyFee,
            biAnnual: tierData.biAnnualFee,
            annual: tierData.annualFee
        },
        currency: currency.config.currencyCode
    };
}

// ============================================
// ERROR CLASSES FOR UGANDA CURRENCY
// ============================================

export class UgandaCurrencyError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'UgandaCurrencyError';
        this.code = code;
        this.country = 'UG';
        this.timestamp = new Date().toISOString();
    }
}

export class InvalidAmountError extends UgandaCurrencyError {
    constructor(amount) {
        super(`Invalid UGX amount: ${amount}`, 'INVALID_AMOUNT');
        this.amount = amount;
    }
}

export class TierLimitExceededError extends UgandaCurrencyError {
    constructor(tier, amount, limit) {
        super(`Amount ${amount} exceeds ${tier} tier limit of ${limit}`, 'TIER_LIMIT_EXCEEDED');
        this.tier = tier;
        this.amount = amount;
        this.limit = limit;
    }
}

export class SubscriptionExpiredError extends UgandaCurrencyError {
    constructor(expiryDate) {
        super(`Subscription expired on ${expiryDate}. Renew to continue lending.`, 'SUBSCRIPTION_EXPIRED');
        this.expiryDate = expiryDate;
    }
}

// ============================================
// TEST UTILITIES
// ============================================

export function testUgandaCurrency() {
    const currency = getUgandaCurrency();
    
    console.log('=== Uganda Currency Module Test ===');
    console.log(`Country: ${currency.config.countryName}`);
    console.log(`Currency: ${currency.config.currencyCode}`);
    console.log(`Symbol: ${currency.config.currencySymbol}`);
    
    // Test formatting
    console.log('\nFormatting Tests:');
    console.log(`Format 1000: ${currency.format(1000)}`);
    console.log(`Format 1000000: ${currency.format(1000000)}`);
    console.log(`Format 5000000: ${currency.format(5000000)}`);
    
    // Test calculations
    console.log('\nCalculation Tests:');
    console.log(`Interest on 100,000 for 7 days: ${currency.format(currency.calculateInterest(100000))}`);
    console.log(`Total repayment: ${currency.format(currency.calculateTotalRepayment(100000))}`);
    console.log(`Daily repayment: ${currency.format(currency.calculateDailyRepayment(currency.calculateTotalRepayment(100000)))}`);
    
    // Test subscription tiers
    console.log('\nSubscription Tier Tests:');
    Object.keys(currency.config.subscriptionTiers).forEach(tier => {
        const tierData = currency.config.subscriptionTiers[tier];
        console.log(`${tierData.name}: ${currency.format(tierData.weeklyLimit)} weekly limit, ${currency.format(tierData.monthlyFee)} monthly`);
    });
    
    // Test validation
    console.log('\nValidation Tests:');
    console.log(`Is 500 valid? ${currency.isValidAmount(500)}`);
    console.log(`Is 50 valid? ${currency.isValidAmount(50)}`);
    console.log(`Is 100000000 valid? ${currency.isValidAmount(100000000)}`);
    
    return {
        config: currency.getPublicConfig(),
        testsPassed: true
    };
}

// ============================================
// INTEGRATION WITH GLOBAL SYSTEM
// ============================================

// Global registry for country currencies
if (typeof window !== 'undefined') {
    window.MPesewa = window.MPesewa || {};
    window.MPesewa.countries = window.MPesewa.countries || {};
    window.MPesewa.countries.UG = {
        currency: getUgandaCurrency(),
        format: formatUGX,
        calculateLoan: calculateUGXLoan,
        validateSubscription: validateUGXSubscription
    };
}

// Module metadata
export const METADATA = {
    version: '1.0.0',
    country: 'Uganda',
    currency: 'UGX',
    lastUpdated: '2024-01-24',
    strictRules: [
        'NO_CROSS_COUNTRY_OPERATIONS',
        'STRICT_SUBSCRIPTION_TIERS',
        '28TH_EXPIRY_ENFORCEMENT',
        'COUNTRY_ISOLATION'
    ],
    hierarchyEnforcement: {
        global: 'MPesewa',
        country: 'UG',
        groups: 'Unlimited within UG',
        lenders: 'Min 5, Max 1000 per group',
        ledgers: 'Unlimited per lender',
        borrowers: 'Max 4 groups with good rating'
    }
};