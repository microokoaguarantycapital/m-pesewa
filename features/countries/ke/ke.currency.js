/**
 * M-PESEWA - KENYA CURRENCY MODULE
 * Version: 1.0.0
 * Last Updated: 2026-01-24
 * 
 * STRICT CURRENCY ENFORCEMENT FOR KENYA (KES)
 * This file contains Kenya-specific currency configuration.
 * DO NOT MODIFY CURRENCY RULES CROSS-COUNTRY.
 * 
 * Currency: Kenyan Shilling (KES)
 * Symbol: KSh
 * ISO Code: 404
 */

const KenyaCurrencyConfig = {
    // ============================================
    // 1. KENYA CURRENCY IDENTIFICATION
    // ============================================
    currency: {
        code: 'KES',
        isoNumeric: '404',
        name: 'Kenyan Shilling',
        localName: 'Shilingi ya Kenya',
        symbol: 'KSh',
        fractionalUnit: 'Cent',
        fractionalSymbol: 'c',
        decimalPlaces: 2,
        subunit: 100
    },
    
    // ============================================
    // 2. STRICT CURRENCY FORMATTING RULES
    // ============================================
    formatting: {
        // Display format
        format: 'symbol value', // Options: symbol value, value symbol, symbol(value)
        symbolPosition: 'before', // before or after
        decimalSeparator: '.',
        thousandSeparator: ',',
        spaceBetweenSymbol: true,
        
        // Kenya-specific formats
        formats: {
            standard: '{symbol}{space}{value}',
            compact: '{symbol}{value}',
            spoken: '{value} shillings'
        },
        
        // Examples of valid formats
        examples: {
            '1000': 'KSh 1,000.00',
            '1500': 'KSh 1,500.00',
            '5000': 'KSh 5,000.00',
            '20000': 'KSh 20,000.00',
            '50000': 'KSh 50,000.00'
        }
    },
    
    // ============================================
    // 3. KENYA-SPECIFIC FINANCIAL RULES
    // ============================================
    financialRules: {
        // Loan tier limits (in KSh)
        tierLimits: {
            basic: {
                min: 10,
                max: 1500,
                weeklyLimit: 1500,
                description: 'Basic Tier - Small emergency loans'
            },
            premium: {
                min: 100,
                max: 5000,
                weeklyLimit: 5000,
                description: 'Premium Tier - Medium loans'
            },
            super: {
                min: 500,
                max: 20000,
                weeklyLimit: 20000,
                description: 'Super Tier - Large loans (CRB required)'
            },
            lenderOfLenders: {
                min: 1000,
                max: 50000,
                weeklyLimit: 50000,
                description: 'Lender of Lenders - Enterprise level'
            }
        },
        
        // Interest calculation rules
        interest: {
            rate: 0.10, // 10% per week
            calculation: 'simple', // simple or compound
            period: 'weekly',
            accrual: 'end_of_period',
            
            // Strict validation rules
            validation: {
                minRate: 0.05,
                maxRate: 0.20,
                allowedPeriods: ['daily', 'weekly', 'monthly'],
                mustBePercentage: true
            }
        },
        
        // Penalty rules
        penalties: {
            latePayment: {
                rate: 0.05, // 5% daily after day 7
                gracePeriod: 7, // days
                calculation: 'daily_compound',
                maxCap: 1.00 // Maximum 100% penalty
            },
            default: {
                threshold: 60, // days
                actions: ['blacklist', 'crb_reporting', 'debt_collection'],
                recoveryFee: 0.15 // 15% recovery fee
            }
        },
        
        // Subscription fees (in KSh)
        subscriptionFees: {
            basic: {
                monthly: 50,
                biAnnual: 250,
                annual: 500,
                description: 'Basic lending access'
            },
            premium: {
                monthly: 250,
                biAnnual: 1500,
                annual: 2500,
                description: 'Premium lending features'
            },
            super: {
                monthly: 1000,
                biAnnual: 5000,
                annual: 8500,
                description: 'Super tier with CRB checks'
            },
            lenderOfLenders: {
                monthly: 500,
                biAnnual: 3500,
                annual: 6500,
                description: 'Enterprise lending platform'
            }
        }
    },
    
    // ============================================
    // 4. CURRENCY CONVERSION RATES (FIXED)
    // ============================================
    exchangeRates: {
        // Base currency: KES
        base: 'KES',
        updated: '2026-01-24T00:00:00Z',
        source: 'Central Bank of Kenya',
        
        rates: {
            USD: 0.0077,    // 1 KES = 0.0077 USD
            EUR: 0.0071,    // 1 KES = 0.0071 EUR
            GBP: 0.0061,    // 1 KES = 0.0061 GBP
            UGX: 28.5,      // 1 KES = 28.5 UGX
            TZS: 19.8,      // 1 KES = 19.8 TZS
            RWF: 9.2,       // 1 KES = 9.2 RWF
            NGN: 3.5,       // 1 KES = 3.5 NGN
            GHS: 0.055,     // 1 KES = 0.055 GHS
            ZAR: 0.14,      // 1 KES = 0.14 ZAR
            ETB: 0.44       // 1 KES = 0.44 ETB
        },
        
        // Strict conversion rules
        conversionRules: {
            allowCrossCurrency: false, // NEVER allow cross-currency in Kenya
            autoUpdate: false, // Rates are fixed for consistency
            rounding: 'bankers', // Banking standard rounding
            precision: 4
        }
    },
    
    // ============================================
    // 5. KENYA TAX CALCULATION RULES
    // ============================================
    taxRules: {
        vat: {
            rate: 0.16, // 16% VAT
            applicableTo: ['subscription_fees', 'platform_fees'],
            excludedFrom: ['loan_amounts', 'interest_income'],
            registrationThreshold: 5000000 // 5 million KSh annual turnover
        },
        
        withholdingTax: {
            rate: 0.05, // 5% withholding tax on interest
            applicableTo: 'lender_interest_income',
            threshold: 12000, // Monthly threshold
            filing: 'monthly'
        },
        
        incomeTax: {
            individual: {
                bands: [
                    { min: 0, max: 24000, rate: 0.10 },
                    { min: 24001, max: 32333, rate: 0.25 },
                    { min: 32334, max: 500000, rate: 0.30 },
                    { min: 500001, max: Infinity, rate: 0.35 }
                ],
                personalRelief: 2400
            },
            corporate: {
                rate: 0.30, // 30% corporate tax
                turnoverTax: 0.01 // 1% for small businesses
            }
        },
        
        // Kenya Revenue Authority compliance
        kraCompliance: {
            pinRequired: true,
            certificateRequired: true,
            filingFrequency: 'monthly',
            penalties: {
                lateFiling: 5000, // KSh
                latePayment: '5% of tax due + 1% monthly interest'
            }
        }
    },
    
    // ============================================
    // 6. PAYMENT PROCESSING RULES
    // ============================================
    paymentProcessing: {
        // Mobile Money (M-Pesa)
        mpesa: {
            enabled: true,
            paybill: '123456',
            till: '123456',
            businessShortCode: 'MPESEWA',
            transactionLimits: {
                daily: 150000,
                perTransaction: 70000,
                monthly: 1000000
            },
            charges: {
                sending: [
                    { amount: 1, fee: 0 },
                    { amount: 50, fee: 0 },
                    { amount: 100, fee: 0 },
                    { amount: 500, fee: 10 },
                    { amount: 1000, fee: 15 },
                    { amount: 1500, fee: 25 },
                    { amount: 2500, fee: 35 },
                    { amount: 3500, fee: 45 },
                    { amount: 5000, fee: 60 },
                    { amount: 7500, fee: 75 },
                    { amount: 10000, fee: 85 },
                    { amount: 15000, fee: 95 },
                    { amount: 20000, fee: 100 }
                ],
                withdrawal: [
                    { amount: 100, fee: 27 },
                    { amount: 500, fee: 32 }
                ]
            }
        },
        
        // Bank Transfers
        bankTransfer: {
            enabled: true,
            banks: [
                {
                    name: 'Equity Bank',
                    code: '68',
                    swift: 'EQBLKENA',
                    transferTime: 'instant',
                    charges: 'free'
                },
                {
                    name: 'KCB Bank',
                    code: '01',
                    swift: 'KCBLKENX',
                    transferTime: '1-2 hours',
                    charges: 'KSh 50-200'
                }
            ],
            limits: {
                min: 100,
                max: 1000000,
                daily: 500000
            }
        },
        
        // Processing rules
        processingRules: {
            settlementTime: 'T+1', // Next day settlement
            reconciliation: 'daily',
            disputePeriod: '7 days',
            refundPolicy: '48 hours for erroneous transactions'
        }
    },
    
    // ============================================
    // 7. CURRENCY VALIDATION RULES
    // ============================================
    validationRules: {
        amountValidation: {
            minAmount: 10, // Minimum 10 KSh
            maxAmount: 50000, // Maximum 50,000 KSh
            allowedIncrements: [10, 50, 100, 500, 1000],
            
            // Kenya-specific amount patterns
            commonAmounts: [50, 100, 200, 500, 1000, 1500, 2000, 5000, 10000, 20000, 50000],
            
            // Amount validation logic
            validate: function(amount) {
                const errors = [];
                
                if (amount < this.minAmount) {
                    errors.push(`Amount must be at least ${this.formatCurrency(this.minAmount)}`);
                }
                
                if (amount > this.maxAmount) {
                    errors.push(`Amount cannot exceed ${this.formatCurrency(this.maxAmount)}`);
                }
                
                // Check if amount is in reasonable increments
                const lastDigit = amount % 10;
                if (lastDigit !== 0 && amount > 100) {
                    errors.push('Amount should end with 0 for amounts over 100 KSh');
                }
                
                return {
                    valid: errors.length === 0,
                    errors,
                    suggested: this.suggestAmount(amount)
                };
            },
            
            suggestAmount: function(amount) {
                const increments = this.allowedIncrements;
                const lastIncrement = increments[increments.length - 1];
                const remainder = amount % lastIncrement;
                
                if (remainder === 0) return amount;
                
                // Round to nearest allowed increment
                const lower = amount - remainder;
                const upper = lower + lastIncrement;
                
                return Math.abs(amount - lower) < Math.abs(amount - upper) ? lower : upper;
            },
            
            formatCurrency: function(amount) {
                return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
            }
        },
        
        // Interest validation
        interestValidation: {
            validateCalculation: function(principal, interestRate, period) {
                const weeklyInterest = principal * interestRate;
                const total = principal + weeklyInterest;
                const dailyRepayment = total / 7;
                
                return {
                    principal,
                    interest: weeklyInterest,
                    total,
                    dailyRepayment,
                    weeklyBreakdown: {
                        day1: dailyRepayment,
                        day2: dailyRepayment * 2,
                        day3: dailyRepayment * 3,
                        day4: dailyRepayment * 4,
                        day5: dailyRepayment * 5,
                        day6: dailyRepayment * 6,
                        day7: total
                    }
                };
            },
            
            validatePenalty: function(amount, daysLate) {
                if (daysLate <= 7) return 0;
                
                const penaltyDays = daysLate - 7;
                const dailyPenaltyRate = 0.05;
                let penalty = 0;
                
                for (let i = 0; i < penaltyDays; i++) {
                    penalty += amount * dailyPenaltyRate;
                    amount += amount * dailyPenaltyRate;
                }
                
                return {
                    penaltyAmount: penalty,
                    newTotal: amount,
                    daysPenalized: penaltyDays,
                    dailyBreakdown: Array.from({ length: penaltyDays }, (_, i) => ({
                        day: i + 1,
                        penalty: amount * dailyPenaltyRate * Math.pow(1 + dailyPenaltyRate, i)
                    }))
                };
            }
        }
    },
    
    // ============================================
    // 8. KENYA-SPECIFIC FINANCIAL CALCULATORS
    // ============================================
    calculators: {
        // Loan Calculator
        loanCalculator: function(principal, tier = 'basic') {
            const tierInfo = this.financialRules.tierLimits[tier];
            
            if (!tierInfo) {
                throw new Error(`Invalid tier: ${tier}`);
            }
            
            if (principal < tierInfo.min || principal > tierInfo.max) {
                throw new Error(`Principal must be between ${tierInfo.min} and ${tierInfo.max} KSh for ${tier} tier`);
            }
            
            const interest = principal * this.financialRules.interest.rate;
            const total = principal + interest;
            const dailyRepayment = total / 7;
            
            return {
                principal: this.format(principal),
                interest: this.format(interest),
                total: this.format(total),
                dailyRepayment: this.format(dailyRepayment),
                breakdown: {
                    week1: this.format(total),
                    week2: this.format(total * 1.05), // 5% penalty if late
                    week3: this.format(total * 1.1025),
                    week4: this.format(total * 1.157625)
                },
                tierLimits: tierInfo
            };
        },
        
        // Subscription Calculator
        subscriptionCalculator: function(plan, duration = 'monthly') {
            const plans = this.financialRules.subscriptionFees;
            
            if (!plans[plan]) {
                throw new Error(`Invalid subscription plan: ${plan}`);
            }
            
            const amount = plans[plan][duration];
            const vat = amount * this.taxRules.vat.rate;
            const total = amount + vat;
            
            return {
                plan,
                duration,
                subscriptionFee: this.format(amount),
                vat: this.format(vat),
                total: this.format(total),
                savings: this.calculateSavings(plan, duration),
                nextBilling: this.calculateNextBilling(duration)
            };
        },
        
        // Interest Earnings Calculator
        interestEarningsCalculator: function(lendingAmount, numberOfLoans, defaultRate = 0.01) {
            const weeklyInterest = lendingAmount * this.financialRules.interest.rate;
            const weeklyEarnings = weeklyInterest * numberOfLoans;
            const weeklyDefaults = weeklyEarnings * defaultRate;
            const netWeeklyEarnings = weeklyEarnings - weeklyDefaults;
            
            return {
                weekly: {
                    gross: this.format(weeklyEarnings),
                    defaults: this.format(weeklyDefaults),
                    net: this.format(netWeeklyEarnings)
                },
                monthly: {
                    gross: this.format(weeklyEarnings * 4),
                    defaults: this.format(weeklyDefaults * 4),
                    net: this.format(netWeeklyEarnings * 4)
                },
                annual: {
                    gross: this.format(weeklyEarnings * 52),
                    defaults: this.format(weeklyDefaults * 52),
                    net: this.format(netWeeklyEarnings * 52)
                }
            };
        },
        
        // Helper function to format currency
        format: function(amount) {
            return `KSh ${amount.toLocaleString('en-KE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        },
        
        // Calculate savings for longer durations
        calculateSavings: function(plan, duration) {
            const plans = this.financialRules.subscriptionFees[plan];
            const monthly = plans.monthly;
            
            switch (duration) {
                case 'biAnnual':
                    const biAnnualMonthlyEquivalent = plans.biAnnual / 6;
                    return this.format((monthly - biAnnualMonthlyEquivalent) * 6);
                case 'annual':
                    const annualMonthlyEquivalent = plans.annual / 12;
                    return this.format((monthly - annualMonthlyEquivalent) * 12);
                default:
                    return this.format(0);
            }
        },
        
        // Calculate next billing date
        calculateNextBilling: function(duration) {
            const today = new Date();
            let nextDate = new Date();
            
            switch (duration) {
                case 'monthly':
                    nextDate.setMonth(today.getMonth() + 1);
                    // Ensure it's the 28th
                    nextDate.setDate(28);
                    break;
                case 'biAnnual':
                    nextDate.setMonth(today.getMonth() + 6);
                    nextDate.setDate(28);
                    break;
                case 'annual':
                    nextDate.setFullYear(today.getFullYear() + 1);
                    nextDate.setDate(28);
                    break;
            }
            
            return nextDate.toLocaleDateString('en-KE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    },
    
    // ============================================
    // 9. COMPLIANCE & REPORTING
    // ============================================
    compliance: {
        // Central Bank of Kenya reporting requirements
        cbkReporting: {
            required: true,
            frequency: 'monthly',
            thresholds: {
                transactionReporting: 1000000, // 1 million KSh
                suspiciousActivity: 100000, // 100,000 KSh
                currencyTransaction: 1000000 // 1 million KSh
            },
            reports: [
                'Monthly Returns Form',
                'Suspicious Transaction Reports',
                'Currency Transaction Reports'
            ]
        },
        
        // Anti-Money Laundering (AML) rules
        amlRules: {
            customerDueDiligence: {
                level1: ['id_verification', 'phone_verification'], // Up to 50,000 KSh
                level2: ['address_verification', 'source_of_funds'], // 50,001 - 1,000,000 KSh
                level3: ['enhanced_due_diligence', 'bank_verification'] // Above 1,000,000 KSh
            },
            monitoring: {
                unusualPatterns: ['round_amounts', 'rapid_transfers', 'multiple_accounts'],
                alertThresholds: {
                    daily: 100000,
                    weekly: 500000,
                    monthly: 1000000
                }
            }
        },
        
        // Tax reporting
        taxReporting: {
            withholdingTax: {
                frequency: 'monthly',
                dueDate: '20th of following month',
                form: 'Withholding Tax Return'
            },
            vat: {
                frequency: 'monthly',
                dueDate: '20th of following month',
                form: 'VAT Return'
            },
            incomeTax: {
                frequency: 'annual',
                dueDate: '30th June',
                form: 'Income Tax Return'
            }
        }
    },
    
    // ============================================
    // 10. CURRENCY MODULE UTILITIES
    // ============================================
    utilities: {
        // Format amount in Kenya currency
        formatAmount: function(amount, options = {}) {
            const defaults = {
                symbol: true,
                decimals: 2,
                compact: false,
                spoken: false
            };
            
            const config = { ...defaults, ...options };
            
            if (config.spoken) {
                return `${amount.toLocaleString('en-KE')} shillings`;
            }
            
            let formatted = amount.toLocaleString('en-KE', {
                minimumFractionDigits: config.decimals,
                maximumFractionDigits: config.decimals
            });
            
            if (config.compact && amount >= 1000) {
                const suffixes = ['', 'K', 'M', 'B'];
                const suffixNum = Math.floor(('' + amount).length / 3);
                let shortValue = parseFloat((suffixNum !== 0 ? (amount / Math.pow(1000, suffixNum)) : amount).toPrecision(2));
                if (shortValue % 1 !== 0) {
                    shortValue = shortValue.toFixed(1);
                }
                formatted = shortValue + suffixes[suffixNum];
            }
            
            if (config.symbol) {
                return this.formatting.spaceBetweenSymbol 
                    ? `${this.currency.symbol} ${formatted}`
                    : `${this.currency.symbol}${formatted}`;
            }
            
            return formatted;
        },
        
        // Parse currency string to number
        parseAmount: function(amountString) {
            // Remove currency symbol, commas, and spaces
            const cleaned = amountString
                .replace(new RegExp(`\\${this.currency.symbol}`, 'gi'), '')
                .replace(/,/g, '')
                .trim();
            
            const amount = parseFloat(cleaned);
            
            if (isNaN(amount)) {
                throw new Error(`Invalid amount format: ${amountString}`);
            }
            
            return amount;
        },
        
        // Validate amount against tier limits
        validateAmountForTier: function(amount, tier) {
            const tierLimits = this.financialRules.tierLimits[tier];
            
            if (!tierLimits) {
                return {
                    valid: false,
                    error: `Invalid tier: ${tier}`,
                    allowedTiers: Object.keys(this.financialRules.tierLimits)
                };
            }
            
            if (amount < tierLimits.min) {
                return {
                    valid: false,
                    error: `Amount must be at least ${this.formatAmount(tierLimits.min)} for ${tier} tier`,
                    min: tierLimits.min,
                    max: tierLimits.max
                };
            }
            
            if (amount > tierLimits.max) {
                return {
                    valid: false,
                    error: `Amount cannot exceed ${this.formatAmount(tierLimits.max)} for ${tier} tier`,
                    min: tierLimits.min,
                    max: tierLimits.max
                };
            }
            
            return {
                valid: true,
                tier,
                amount,
                formatted: this.formatAmount(amount),
                weeklyLimit: tierLimits.weeklyLimit
            };
        },
        
        // Calculate interest
        calculateInterest: function(principal, days = 7) {
            const weeklyRate = this.financialRules.interest.rate;
            const interest = principal * weeklyRate;
            const total = principal + interest;
            const daily = total / days;
            
            return {
                principal: this.formatAmount(principal),
                interest: this.formatAmount(interest),
                total: this.formatAmount(total),
                dailyRepayment: this.formatAmount(daily),
                breakdown: Array.from({ length: days }, (_, i) => ({
                    day: i + 1,
                    amount: this.formatAmount(daily * (i + 1)),
                    remaining: this.formatAmount(total - (daily * (i + 1)))
                }))
            };
        },
        
        // Convert to other currencies (for display only)
        convertToCurrency: function(amount, targetCurrency) {
            if (targetCurrency === 'KES') {
                return this.formatAmount(amount);
            }
            
            const rate = this.exchangeRates.rates[targetCurrency];
            if (!rate) {
                throw new Error(`Exchange rate not available for ${targetCurrency}`);
            }
            
            const converted = amount * rate;
            
            // Format based on target currency
            const formatters = {
                USD: (val) => `$${val.toFixed(2)}`,
                EUR: (val) => `€${val.toFixed(2)}`,
                GBP: (val) => `£${val.toFixed(2)}`,
                UGX: (val) => `UGX ${val.toLocaleString()}`,
                TZS: (val) => `TZS ${val.toLocaleString()}`
            };
            
            return formatters[targetCurrency] 
                ? formatters[targetCurrency](converted)
                : `${targetCurrency} ${converted.toFixed(2)}`;
        }
    }
};

// ============================================
// CURRENCY MODULE EXPORT
// ============================================

/**
 * Kenya Currency Module Class
 * Enforces Kenya-specific currency rules and calculations
 */
export class KenyaCurrencyModule {
    constructor() {
        this.config = KenyaCurrencyConfig;
        this.initialized = false;
        this.validationErrors = [];
    }
    
    /**
     * Initialize currency module with validation
     */
    initialize() {
        try {
            this.validateConfiguration();
            this.initialized = true;
            console.log('💰 Kenya Currency Module initialized successfully');
        } catch (error) {
            this.validationErrors.push(error.message);
            console.error('❌ Kenya Currency Module initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Validate configuration
     */
    validateConfiguration() {
        const errors = [];
        
        // Validate currency code
        if (this.config.currency.code !== 'KES') {
            errors.push('Currency code must be KES for Kenya');
        }
        
        // Validate interest rate
        if (this.config.financialRules.interest.rate !== 0.10) {
            errors.push('Interest rate must be 10% for Kenya');
        }
        
        // Validate subscription expiry
        if (!this.config.calculators.calculateNextBilling) {
            errors.push('Next billing calculator missing');
        }
        
        // Validate exchange rates
        const requiredRates = ['USD', 'UGX', 'TZS', 'RWF'];
        requiredRates.forEach(currency => {
            if (!this.config.exchangeRates.rates[currency]) {
                errors.push(`Missing exchange rate for ${currency}`);
            }
        });
        
        if (errors.length > 0) {
            throw new Error(`Currency validation failed:\n${errors.join('\n')}`);
        }
        
        return true;
    }
    
    /**
     * Format amount in Kenya Shillings
     */
    format(amount, options = {}) {
        if (!this.initialized) {
            throw new Error('Currency module not initialized');
        }
        
        return this.config.utilities.formatAmount.call(this.config, amount, options);
    }
    
    /**
     * Parse currency string
     */
    parse(amountString) {
        if (!this.initialized) {
            throw new Error('Currency module not initialized');
        }
        
        return this.config.utilities.parseAmount.call(this.config, amountString);
    }
    
    /**
     * Calculate loan details
     */
    calculateLoan(principal, tier = 'basic', duration = 7) {
        if (!this.initialized) {
            throw new Error('Currency module not initialized');
        }
        
        // Validate amount against tier
        const validation = this.config.utilities.validateAmountForTier.call(this.config, principal, tier);
        if (!validation.valid) {
            throw new Error(validation.error);
        }
        
        // Calculate interest
        const interest = principal * this.config.financialRules.interest.rate;
        const total = principal + interest;
        const dailyRepayment = total / duration;
        
        // Calculate penalties if duration exceeds 7 days
        let penalties = [];
        if (duration > 7) {
            const penaltyDays = duration - 7;
            penalties = this.calculatePenalties(total, penaltyDays);
        }
        
        return {
            principal: this.format(principal),
            interest: this.format(interest),
            total: this.format(total),
            dailyRepayment: this.format(dailyRepayment),
            duration,
            tier,
            penalties,
            breakdown: {
                byDay: Array.from({ length: duration }, (_, i) => ({
                    day: i + 1,
                    cumulative: this.format(dailyRepayment * (i + 1)),
                    remaining: this.format(total - (dailyRepayment * (i + 1)))
                }))
            }
        };
    }
    
    /**
     * Calculate penalties for late payment
     */
    calculatePenalties(amount, daysLate) {
        if (daysLate <= 0) return [];
        
        const dailyRate = this.config.financialRules.penalties.latePayment.rate;
        let currentAmount = amount;
        const penalties = [];
        
        for (let i = 0; i < daysLate; i++) {
            const penalty = currentAmount * dailyRate;
            currentAmount += penalty;
            
            penalties.push({
                day: i + 1,
                penalty: this.format(penalty),
                newTotal: this.format(currentAmount),
                cumulativePenalty: this.format(currentAmount - amount)
            });
            
            // Cap at 100% penalty
            if ((currentAmount - amount) >= amount) {
                penalties.push({
                    day: i + 2,
                    penalty: 'Capped at 100%',
                    newTotal: this.format(amount * 2),
                    cumulativePenalty: this.format(amount)
                });
                break;
            }
        }
        
        return penalties;
    }
    
    /**
     * Calculate subscription costs
     */
    calculateSubscription(plan, duration = 'monthly') {
        if (!this.initialized) {
            throw new Error('Currency module not initialized');
        }
        
        const planInfo = this.config.financialRules.subscriptionFees[plan];
        if (!planInfo) {
            throw new Error(`Invalid subscription plan: ${plan}`);
        }
        
        const fee = planInfo[duration];
        if (!fee) {
            throw new Error(`Invalid duration: ${duration} for plan ${plan}`);
        }
        
        const vat = fee * this.config.taxRules.vat.rate;
        const total = fee + vat;
        
        return {
            plan,
            duration,
            subscriptionFee: this.format(fee),
            vat: this.format(vat),
            total: this.format(total),
            nextBilling: this.config.calculators.calculateNextBilling(duration),
            features: this.getPlanFeatures(plan)
        };
    }
    
    /**
     * Get plan features
     */
    getPlanFeatures(plan) {
        const features = {
            basic: [
                'Up to KSh 1,500 per week',
                'Unlimited ledgers',
                'Basic reporting',
                'Email support',
                'No CRB checks required'
            ],
            premium: [
                'Up to KSh 5,000 per week',
                'Advanced analytics',
                'Priority support',
                'Bulk operations',
                'No CRB checks required'
            ],
            super: [
                'Up to KSh 20,000 per week',
                'CRB integration',
                'Dedicated support',
                'Custom reporting',
                'Advanced risk tools'
            ],
            lenderOfLenders: [
                'Up to KSh 50,000 per week',
                'Extended repayment terms',
                'Custom interest rates',
                'Enterprise support',
                'API access'
            ]
        };
        
        return features[plan] || [];
    }
    
    /**
     * Validate transaction against financial rules
     */
    validateTransaction(transaction) {
        const errors = [];
        const warnings = [];
        
        // Check amount validity
        const amountValidation = this.config.validationRules.amountValidation.validate(
            transaction.amount
        );
        
        if (!amountValidation.valid) {
            errors.push(...amountValidation.errors);
        }
        
        // Check tier limits
        if (transaction.tier) {
            const tierValidation = this.config.utilities.validateAmountForTier.call(
                this.config,
                transaction.amount,
                transaction.tier
            );
            
            if (!tierValidation.valid) {
                errors.push(tierValidation.error);
            }
        }
        
        // Check if amount is suspicious
        if (transaction.amount > 100000) {
            warnings.push('Large transaction - may require additional verification');
        }
        
        // Check for round amounts (potential money laundering)
        if (transaction.amount % 10000 === 0 && transaction.amount > 50000) {
            warnings.push('Round amount detected - monitor for suspicious activity');
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            suggestedAmount: amountValidation.suggested
        };
    }
    
    /**
     * Convert to other currency (for display purposes only)
     */
    convert(amount, targetCurrency) {
        if (!this.initialized) {
            throw new Error('Currency module not initialized');
        }
        
        if (targetCurrency === 'KES') {
            return this.format(amount);
        }
        
        const rate = this.config.exchangeRates.rates[targetCurrency];
        if (!rate) {
            throw new Error(`Cannot convert to ${targetCurrency}. Supported currencies: ${Object.keys(this.config.exchangeRates.rates).join(', ')}`);
        }
        
        const converted = amount * rate;
        
        // Return both formatted and raw
        return {
            amount: converted,
            formatted: this.config.utilities.convertToCurrency.call(this.config, amount, targetCurrency),
            rate,
            original: this.format(amount),
            currency: targetCurrency
        };
    }
    
    /**
     * Get all tier information
     */
    getTierInfo() {
        return Object.entries(this.config.financialRules.tierLimits).map(([key, value]) => ({
            tier: key,
            ...value,
            formatted: {
                min: this.format(value.min),
                max: this.format(value.max),
                weeklyLimit: this.format(value.weeklyLimit)
            }
        }));
    }
    
    /**
     * Get subscription plans
     */
    getSubscriptionPlans() {
        return Object.entries(this.config.financialRules.subscriptionFees).map(([key, value]) => ({
            plan: key,
            monthly: this.format(value.monthly),
            biAnnual: this.format(value.biAnnual),
            annual: this.format(value.annual),
            description: value.description
        }));
    }
    
    /**
     * Generate financial report
     */
    generateReport(transactions, period = 'monthly') {
        const report = {
            period,
            generated: new Date().toISOString(),
            summary: {
                totalTransactions: transactions.length,
                totalAmount: this.format(transactions.reduce((sum, t) => sum + t.amount, 0)),
                averageTransaction: this.format(
                    transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length || 0
                ),
                byTier: {}
            },
            compliance: {
                amlFlags: transactions.filter(t => t.amount > 100000).length,
                suspiciousPatterns: this.detectSuspiciousPatterns(transactions),
                reportingRequired: transactions.some(t => t.amount > 1000000)
            }
        };
        
        // Group by tier
        transactions.forEach(transaction => {
            const tier = transaction.tier || 'unknown';
            if (!report.summary.byTier[tier]) {
                report.summary.byTier[tier] = {
                    count: 0,
                    total: 0
                };
            }
            report.summary.byTier[tier].count++;
            report.summary.byTier[tier].total += transaction.amount;
        });
        
        // Format tier totals
        Object.keys(report.summary.byTier).forEach(tier => {
            report.summary.byTier[tier].formattedTotal = this.format(
                report.summary.byTier[tier].total
            );
        });
        
        return report;
    }
    
    /**
     * Detect suspicious patterns
     */
    detectSuspiciousPatterns(transactions) {
        const patterns = [];
        
        // Check for rapid successive transactions
        const sorted = transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        for (let i = 1; i < sorted.length; i++) {
            const timeDiff = new Date(sorted[i].timestamp) - new Date(sorted[i-1].timestamp);
            if (timeDiff < 60000 && sorted[i].amount > 50000) { // Less than 1 minute
                patterns.push('Rapid successive large transactions');
                break;
            }
        }
        
        // Check for structuring (multiple transactions just under reporting threshold)
        const structuring = transactions.filter(t => t.amount > 90000 && t.amount < 100000);
        if (structuring.length >= 3) {
            patterns.push('Potential structuring detected');
        }
        
        return patterns;
    }
}

// Singleton instance
let kenyaCurrencyInstance = null;

/**
 * Get Kenya Currency Module instance
 * @returns {KenyaCurrencyModule}
 */
export function getKenyaCurrencyModule() {
    if (!kenyaCurrencyInstance) {
        kenyaCurrencyInstance = new KenyaCurrencyModule();
        kenyaCurrencyInstance.initialize();
    }
    return kenyaCurrencyInstance;
}

// Default export
export default KenyaCurrencyConfig;

// Utility exports
export const KenyaCurrencyUtils = {
    format: KenyaCurrencyConfig.utilities.formatAmount.bind(KenyaCurrencyConfig),
    parse: KenyaCurrencyConfig.utilities.parseAmount.bind(KenyaCurrencyConfig),
    calculateInterest: KenyaCurrencyConfig.utilities.calculateInterest.bind(KenyaCurrencyConfig),
    convert: KenyaCurrencyConfig.utilities.convertToCurrency.bind(KenyaCurrencyConfig)
};

// Auto-initialize in browser context
if (typeof window !== 'undefined') {
    window.MPESEWA_KENYA_CURRENCY = {
        initialized: false,
        instance: null,
        
        init: function() {
            try {
                this.instance = getKenyaCurrencyModule();
                this.initialized = true;
                console.log('💰 Kenya Currency system ready');
            } catch (error) {
                console.error('Failed to initialize Kenya currency:', error);
            }
        },
        
        format: function(amount) {
            if (!this.initialized) this.init();
            return this.instance?.format(amount) || `KSh ${amount}`;
        }
    };
    
    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
        window.MPESEWA_KENYA_CURRENCY.init();
    });
}