/**
 * 🇸🇴 SOMALIA CURRENCY MODULE
 * 
 * STRICT CURRENCY RULES FOR SOMALIA:
 * - All transactions in Somali Shillings (SOS)
 * - No cross-currency operations
 * - Fixed conversion rates for subscription tiers
 * - Strict validation and formatting
 */

const SomaliaCurrency = {
    // ============================================
    // 1️⃣ CURRENCY DEFINITION & CONFIGURATION
    // ============================================
    definition: {
        code: 'SOS',
        symbol: 'S',
        name: 'Somali Shilling',
        nativeName: 'Shilin Soomaali',
        plural: 'Shillings',
        decimalDigits: 2,
        rounding: 0,
        isoNumeric: '706',
        symbolPlacement: 'before',
        decimalSeparator: '.',
        thousandsSeparator: ',',
        spaceBetweenAmountAndSymbol: true,
        symbolSpacing: true
    },

    // ============================================
    // 2️⃣ EXCHANGE RATES (FIXED FOR STABILITY)
    // ============================================
    exchangeRates: {
        // Fixed rates for platform stability (updated quarterly)
        base: 'SOS',
        rates: {
            USD: 0.001754,  // 1 SOS = 0.001754 USD
            EUR: 0.001612,  // 1 SOS = 0.001612 EUR
            GBP: 0.001378,  // 1 SOS = 0.001378 GBP
            KES: 0.2365,    // 1 SOS = 0.2365 KES
            UGX: 6.542,     // 1 SOS = 6.542 UGX
            TZS: 4.123,     // 1 SOS = 4.123 TZS
            RWF: 2.156,     // 1 SOS = 2.156 RWF
            // No cross-country rates within platform - for display only
        },
        lastUpdated: '2024-01-01',
        updateFrequency: 'quarterly',
        source: 'Central Bank of Somalia'
    },

    // ============================================
    // 3️⃣ SUBSCRIPTION TIER PRICING (SOS)
    // ============================================
    subscriptionPricing: {
        // LENDER TIERS (Mandatory subscription in SOS)
        lenderTiers: {
            basic: {
                monthly: 50,
                biAnnual: 250,
                annual: 500,
                currency: 'SOS',
                display: 'S 50 / month'
            },
            premium: {
                monthly: 250,
                biAnnual: 1500,
                annual: 2500,
                currency: 'SOS',
                display: 'S 250 / month'
            },
            super: {
                monthly: 1000,
                biAnnual: 5000,
                annual: 8500,
                currency: 'SOS',
                display: 'S 1,000 / month'
            },
            lenderOfLenders: {
                monthly: 500,
                biAnnual: 3500,
                annual: 6500,
                currency: 'SOS',
                display: 'S 500 / month'
            }
        },

        // BORROWER TIERS (Free in SOS)
        borrowerTiers: {
            basic: {
                monthly: 0,
                currency: 'SOS',
                display: 'Free'
            }
        },

        // Payment Methods (Somalia-specific)
        paymentMethods: {
            evcPlus: {
                name: 'EVC Plus',
                currency: 'SOS',
                fees: 0,  // No fees for platform payments
                limits: {
                    min: 100,
                    max: 1000000
                }
            },
            sahal: {
                name: 'Sahal',
                currency: 'SOS',
                fees: 0,
                limits: {
                    min: 100,
                    max: 5000000
                }
            },
            bankTransfer: {
                name: 'Bank Transfer',
                currency: 'SOS',
                fees: 0,
                limits: {
                    min: 1000,
                    max: 10000000
                }
            },
            cash: {
                name: 'Cash',
                currency: 'SOS',
                fees: 0,
                limits: {
                    min: 100,
                    max: 100000
                }
            }
        }
    },

    // ============================================
    // 4️⃣ LOAN AMOUNT RANGES (SOS)
    // ============================================
    loanRanges: {
        // Per subscription tier (weekly limits in SOS)
        perTier: {
            basic: {
                min: 100,
                max: 1500,
                weeklyLimit: 1500
            },
            premium: {
                min: 100,
                max: 5000,
                weeklyLimit: 5000
            },
            super: {
                min: 100,
                max: 20000,
                weeklyLimit: 20000
            },
            lenderOfLenders: {
                min: 1000,
                max: 50000,
                weeklyLimit: 50000
            }
        },

        // Emergency category limits (SOS)
        perCategory: {
            fare: { min: 100, max: 5000 },
            data: { min: 100, max: 2000 },
            gas: { min: 1000, max: 8000 },
            food: { min: 500, max: 10000 },
            water: { min: 500, max: 5000 },
            electricity: { min: 1000, max: 10000 },
            medicine: { min: 1000, max: 15000 },
            school: { min: 2000, max: 20000 },
            fuel: { min: 500, max: 5000 },
            repair: { min: 1000, max: 10000 },
            // ... other categories
        },

        // Global limits for Somalia
        global: {
            minLoan: 100,        // 100 SOS minimum
            maxLoan: 50000,      // 50,000 SOS maximum
            dailyLimit: 500000,  // 500,000 SOS per day
            weeklyLimit: 2000000 // 2,000,000 SOS per week
        }
    },

    // ============================================
    // 5️⃣ INTEREST & PENALTY CALCULATIONS (SOS)
    // ============================================
    calculations: {
        // Interest calculation (10% fixed)
        interest: {
            rate: 0.10, // 10%
            calculation: 'simple',
            period: 'weekly',
            formula: (principal) => principal * 0.10
        },

        // Penalty calculation (5% daily after 7 days)
        penalty: {
            rate: 0.05, // 5% daily
            gracePeriod: 7, // days
            calculation: 'daily_compounding',
            formula: (principal, overdueDays) => {
                if (overdueDays <= 7) return 0;
                const penaltyDays = overdueDays - 7;
                return principal * 0.05 * penaltyDays;
            }
        },

        // Total repayment calculation
        repayment: {
            formula: (principal, days) => {
                const interest = principal * 0.10;
                let penalty = 0;
                
                if (days > 7) {
                    const penaltyDays = days - 7;
                    penalty = principal * 0.05 * penaltyDays;
                }
                
                return {
                    principal: principal,
                    interest: interest,
                    penalty: penalty,
                    total: principal + interest + penalty,
                    breakdown: {
                        daily: (principal + interest + penalty) / 7,
                        weekly: principal + interest + penalty
                    }
                };
            }
        }
    },

    // ============================================
    // 6️⃣ FORMATTING & DISPLAY RULES
    // ============================================
    formatting: {
        // Display formats
        formats: {
            default: '{symbol}{amount}',
            withCode: '{amount} {code}',
            detailed: '{symbol}{amount} ({name})'
        },

        // Precision rules
        precision: {
            display: 2,
            calculation: 4,
            storage: 2
        },

        // Rounding rules
        rounding: {
            method: 'halfUp',
            loanAmounts: 'nearest100',
            interest: 'nearest1',
            penalties: 'nearest1'
        },

        // Validation rules
        validation: {
            regex: /^[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?$/,
            maxDigits: 15,
            maxDecimals: 2
        }
    },

    // ============================================
    // 7️⃣ CURRENCY VALIDATION FUNCTIONS
    // ============================================
    validation: {
        /**
         * Validate amount is valid SOS amount
         * @param {number|string} amount - Amount to validate
         * @returns {Object} Validation result
         */
        validateAmount: (amount) => {
            const errors = [];
            const warnings = [];
            
            // Convert to number
            const numericAmount = Number(amount);
            
            // Check if it's a valid number
            if (isNaN(numericAmount)) {
                errors.push('Amount must be a valid number');
                return { valid: false, errors, warnings };
            }
            
            // Check minimum amount
            if (numericAmount < 100) {
                errors.push('Minimum amount is 100 SOS');
            }
            
            // Check maximum amount
            if (numericAmount > 50000) {
                errors.push('Maximum amount is 50,000 SOS');
            }
            
            // Check decimal places
            const decimalPart = amount.toString().split('.')[1];
            if (decimalPart && decimalPart.length > 2) {
                errors.push('Amount cannot have more than 2 decimal places');
            }
            
            // Check if it's a whole number (SOS typically whole numbers)
            if (numericAmount % 1 !== 0) {
                warnings.push('Amount is typically in whole SOS (no decimals)');
            }
            
            return {
                valid: errors.length === 0,
                amount: numericAmount,
                errors,
                warnings
            };
        },

        /**
         * Validate currency code
         * @param {string} currencyCode - Currency code to validate
         * @returns {boolean} True if valid SOS
         */
        validateCurrencyCode: (currencyCode) => {
            return currencyCode.toUpperCase() === 'SOS';
        },

        /**
         * Check if amount is within tier limits
         * @param {number} amount - Amount in SOS
         * @param {string} tier - Subscription tier
         * @returns {Object} Validation result
         */
        validateTierLimit: (amount, tier) => {
            const tierLimits = SomaliaCurrency.loanRanges.perTier[tier];
            if (!tierLimits) {
                return { valid: false, error: 'Invalid subscription tier' };
            }
            
            if (amount < tierLimits.min) {
                return { 
                    valid: false, 
                    error: `Minimum amount for ${tier} tier is ${tierLimits.min} SOS` 
                };
            }
            
            if (amount > tierLimits.max) {
                return { 
                    valid: false, 
                    error: `Maximum amount for ${tier} tier is ${tierLimits.max} SOS` 
                };
            }
            
            return { valid: true };
        }
    },

    // ============================================
    // 8️⃣ CONVERSION FUNCTIONS (DISPLAY ONLY)
    // ============================================
    conversion: {
        /**
         * Convert SOS to other currency (display only)
         * @param {number} amountSOS - Amount in SOS
         * @param {string} targetCurrency - Target currency code
         * @returns {number} Converted amount
         */
        convertFromSOS: (amountSOS, targetCurrency) => {
            const rate = SomaliaCurrency.exchangeRates.rates[targetCurrency.toUpperCase()];
            if (!rate) {
                throw new Error(`Unsupported currency: ${targetCurrency}`);
            }
            
            return amountSOS * rate;
        },

        /**
         * Convert to SOS from other currency (display only)
         * @param {number} amount - Amount in source currency
         * @param {string} sourceCurrency - Source currency code
         * @returns {number} Amount in SOS
         */
        convertToSOS: (amount, sourceCurrency) => {
            const rate = SomaliaCurrency.exchangeRates.rates[sourceCurrency.toUpperCase()];
            if (!rate) {
                throw new Error(`Unsupported currency: ${sourceCurrency}`);
            }
            
            return amount / rate;
        },

        /**
         * Format amount for display
         * @param {number} amount - Amount in SOS
         * @param {string} format - Format type
         * @returns {string} Formatted amount
         */
        format: (amount, format = 'default') => {
            const formats = {
                default: `${SomaliaCurrency.definition.symbol} ${amount.toLocaleString('en-SO', {
                    minimumFractionDigits: SomaliaCurrency.definition.decimalDigits,
                    maximumFractionDigits: SomaliaCurrency.definition.decimalDigits
                })}`,
                withCode: `${amount.toLocaleString('en-SO', {
                    minimumFractionDigits: SomaliaCurrency.definition.decimalDigits,
                    maximumFractionDigits: SomaliaCurrency.definition.decimalDigits
                })} ${SomaliaCurrency.definition.code}`,
                detailed: `${SomaliaCurrency.definition.symbol} ${amount.toLocaleString('en-SO', {
                    minimumFractionDigits: SomaliaCurrency.definition.decimalDigits,
                    maximumFractionDigits: SomaliaCurrency.definition.decimalDigits
                })} (${SomaliaCurrency.definition.name})`
            };
            
            return formats[format] || formats.default;
        }
    },

    // ============================================
    // 9️⃣ FINANCIAL CALCULATION FUNCTIONS
    // ============================================
    calculationsAPI: {
        /**
         * Calculate loan repayment details
         * @param {number} principal - Loan amount in SOS
         * @param {number} days - Number of days (default 7)
         * @returns {Object} Repayment details
         */
        calculateRepayment: (principal, days = 7) => {
            return SomaliaCurrency.calculations.repayment.formula(principal, days);
        },

        /**
         * Calculate interest only
         * @param {number} principal - Loan amount in SOS
         * @returns {number} Interest amount in SOS
         */
        calculateInterest: (principal) => {
            return SomaliaCurrency.calculations.interest.formula(principal);
        },

        /**
         * Calculate penalty only
         * @param {number} principal - Loan amount in SOS
         * @param {number} overdueDays - Days overdue
         * @returns {number} Penalty amount in SOS
         */
        calculatePenalty: (principal, overdueDays) => {
            return SomaliaCurrency.calculations.penalty.formula(principal, overdueDays);
        },

        /**
         * Calculate daily repayment amount
         * @param {number} principal - Loan amount in SOS
         * @param {number} days - Loan duration in days
         * @returns {number} Daily repayment amount in SOS
         */
        calculateDailyRepayment: (principal, days = 7) => {
            const repayment = SomaliaCurrency.calculations.repayment.formula(principal, days);
            return repayment.breakdown.daily;
        }
    },

    // ============================================
    // 🔟 CURRENCY ENFORCEMENT & SECURITY
    // ============================================
    enforcement: {
        // Strict rules for Somalia operations
        rules: {
            onlySOS: true,  // Only Somali Shillings allowed
            noCurrencyMixing: true,
            strictValidation: true,
            roundingEnforced: true
        },

        // Security measures
        security: {
            amountSanitization: true,
            injectionPrevention: true,
            auditLogging: true,
            tamperDetection: true
        },

        // Compliance requirements
        compliance: {
            cbsReporting: true,
            transactionMonitoring: true,
            suspiciousActivityReporting: true
        }
    }
};

// ============================================
// CURRENCY MODULE VALIDATION
// ============================================
const validateCurrencyModule = () => {
    console.log('💰 Validating Somalia Currency Module...');
    
    const errors = [];
    
    // Validate currency definition
    if (SomaliaCurrency.definition.code !== 'SOS') {
        errors.push('Currency code must be SOS for Somalia');
    }
    
    // Validate subscription pricing
    const lenderTiers = SomaliaCurrency.subscriptionPricing.lenderTiers;
    const requiredTiers = ['basic', 'premium', 'super', 'lenderOfLenders'];
    
    requiredTiers.forEach(tier => {
        if (!lenderTiers[tier]) {
            errors.push(`Missing ${tier} subscription tier`);
        }
        
        if (lenderTiers[tier] && lenderTiers[tier].currency !== 'SOS') {
            errors.push(`${tier} tier must be in SOS`);
        }
    });
    
    // Validate borrower tier is free
    const borrowerTier = SomaliaCurrency.subscriptionPricing.borrowerTiers.basic;
    if (borrowerTier.monthly !== 0) {
        errors.push('Borrower tier must be free (0 SOS)');
    }
    
    // Validate loan ranges
    const globalMin = SomaliaCurrency.loanRanges.global.minLoan;
    if (globalMin !== 100) {
        errors.push('Global minimum loan must be 100 SOS');
    }
    
    // Validate interest rate
    if (SomaliaCurrency.calculations.interest.rate !== 0.10) {
        errors.push('Interest rate must be 10%');
    }
    
    // Validate penalty rate
    if (SomaliaCurrency.calculations.penalty.rate !== 0.05) {
        errors.push('Penalty rate must be 5% daily');
    }
    
    if (errors.length > 0) {
        console.error('❌ Currency Module Validation Failed:');
        errors.forEach(error => console.error(`  - ${error}`));
        return false;
    }
    
    console.log('✅ Currency Module Validation Passed');
    return true;
};

// ============================================
// CURRENCY UTILITY FUNCTIONS
// ============================================
const CurrencyUtils = {
    /**
     * Format amount as SOS with symbol
     * @param {number} amount - Amount to format
     * @param {Object} options - Formatting options
     * @returns {string} Formatted currency string
     */
    formatSOS: (amount, options = {}) => {
        const {
            decimals = SomaliaCurrency.definition.decimalDigits,
            showSymbol = true,
            showCode = false
        } = options;
        
        const formattedAmount = amount.toLocaleString('en-SO', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        
        if (showCode) {
            return `${formattedAmount} ${SomaliaCurrency.definition.code}`;
        }
        
        if (showSymbol) {
            return `${SomaliaCurrency.definition.symbol} ${formattedAmount}`;
        }
        
        return formattedAmount;
    },

    /**
     * Parse SOS amount from string
     * @param {string} amountString - String to parse
     * @returns {number} Parsed amount
     */
    parseSOS: (amountString) => {
        // Remove currency symbols and thousands separators
        const cleaned = amountString
            .replace(SomaliaCurrency.definition.symbol, '')
            .replace(/[^\d.-]/g, '');
        
        return parseFloat(cleaned);
    },

    /**
     * Round amount according to SOS rules
     * @param {number} amount - Amount to round
     * @param {string} type - Rounding type
     * @returns {number} Rounded amount
     */
    roundSOS: (amount, type = 'default') => {
        const roundingRules = {
            default: Math.round(amount),
            up: Math.ceil(amount),
            down: Math.floor(amount),
            nearest100: Math.round(amount / 100) * 100,
            nearest1000: Math.round(amount / 1000) * 1000
        };
        
        return roundingRules[type] || Math.round(amount);
    },

    /**
     * Validate and sanitize SOS amount
     * @param {any} input - Input to validate
     * @returns {Object} Validation result
     */
    sanitizeAmount: (input) => {
        // Convert to number
        const amount = Number(input);
        
        if (isNaN(amount)) {
            return {
                valid: false,
                error: 'Invalid amount',
                sanitized: null
            };
        }
        
        // Check bounds
        if (amount < 100) {
            return {
                valid: false,
                error: 'Amount below minimum (100 SOS)',
                sanitized: amount
            };
        }
        
        if (amount > 50000) {
            return {
                valid: false,
                error: 'Amount above maximum (50,000 SOS)',
                sanitized: amount
            };
        }
        
        // Round to nearest whole SOS
        const sanitized = Math.round(amount);
        
        return {
            valid: true,
            sanitized,
            formatted: CurrencyUtils.formatSOS(sanitized)
        };
    }
};

// ============================================
// EXPORT MODULE
// ============================================
module.exports = {
    // Main currency configuration
    currency: SomaliaCurrency,
    
    // Utility functions
    utils: CurrencyUtils,
    
    // Validation function
    validate: validateCurrencyModule,
    
    // Calculation API
    calculate: SomaliaCurrency.calculationsAPI,
    
    // Formatting functions
    format: SomaliaCurrency.conversion.format,
    
    // Constants
    CONSTANTS: {
        CURRENCY_CODE: 'SOS',
        MIN_AMOUNT: 100,
        MAX_AMOUNT: 50000,
        INTEREST_RATE: 0.10,
        PENALTY_RATE: 0.05,
        GRACE_PERIOD: 7,
        SUBSCRIPTION_EXPIRY_DAY: 28
    }
};

// ============================================
// INITIALIZATION
// ============================================
(() => {
    console.log('💰 Somalia Currency Module Loaded');
    
    // Run validation
    const isValid = validateCurrencyModule();
    
    if (isValid) {
        console.log(`   Currency: ${SomaliaCurrency.definition.code} (${SomaliaCurrency.definition.name})`);
        console.log(`   Symbol: ${SomaliaCurrency.definition.symbol}`);
        console.log(`   Min Loan: ${SomaliaCurrency.loanRanges.global.minLoan} SOS`);
        console.log(`   Max Loan: ${SomaliaCurrency.loanRanges.global.maxLoan} SOS`);
        console.log(`   Interest Rate: ${SomaliaCurrency.calculations.interest.rate * 100}%`);
        console.log(`   Penalty Rate: ${SomaliaCurrency.calculations.penalty.rate * 100}% daily`);
    } else {
        console.error('   Module failed validation - check errors above');
    }
})();