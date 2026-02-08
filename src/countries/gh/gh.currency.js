/**
 * M-PESEWA GHANA CURRENCY MODULE
 * Country-specific currency handling, formatting, and calculations
 * Last Updated: 2024
 * Version: 1.0.0
 * 
 * ✅ CURRENCY: Ghanaian Cedi (GHS) with Pesewa subunits
 * ✅ EXCHANGE: Fixed rates for African currencies
 * ✅ CALCULATIONS: Interest, penalties, loan amounts
 * ✅ VALIDATION: GHS amount validation and formatting
 * ✅ COMPLIANCE: Bank of Ghana foreign exchange regulations
 */

const GHANA_CURRENCY = {
    // ============================================
    // 1️⃣ CURRENCY DEFINITION & METADATA
    // ============================================
    definition: {
        // ISO Standards
        isoCode: 'GHS',
        isoNumber: 936,
        currencyName: 'Ghanaian Cedi',
        currencySymbol: 'GH₵',
        subunit: 'Pesewa',
        subunitSymbol: 'Gp',
        
        // Bank of Ghana Information
        centralBank: 'Bank of Ghana',
        regulator: 'Bank of Ghana',
        regulatoryAct: 'Bank of Ghana Act, 2002 (Act 612)',
        foreignExchangeAct: 'Foreign Exchange Act, 2006 (Act 723)',
        
        // Denominations (Current Series - 2019)
        banknotes: {
            denominations: [1, 2, 5, 10, 20, 50, 100, 200],
            unit: 'Cedis',
            material: 'Polymer',
            securityFeatures: [
                'Watermark',
                'Security Thread',
                'See-through Register',
                'Intaglio Printing',
                'Fluorescent Ink'
            ]
        },
        
        coins: {
            denominations: [0.01, 0.05, 0.10, 0.20, 0.50, 1],
            unit: 'Pesewas/Cedis',
            material: [
                'Copper-plated Steel (1Gp)',
                'Nickel-plated Steel (5Gp, 10Gp, 20Gp)',
                'Bi-metallic (50Gp, GH₵1)'
            ]
        },
        
        // Historical Context
        history: {
            introduced: 'July 2007',
            redenomination: '1 old Cedi = 10,000 new Cedis',
            previousCurrency: 'Old Ghanaian Cedi (GHC)',
            redenominationDate: 'July 1, 2007'
        }
    },

    // ============================================
    // 2️⃣ EXCHANGE RATES & CONVERSIONS
    // ============================================
    exchange: {
        // Base Rate (as of 2024, fixed for platform)
        baseRate: {
            USD: 12.50,    // 1 USD = 12.50 GHS
            EUR: 13.80,    // 1 EUR = 13.80 GHS
            GBP: 15.90,    // 1 GBP = 15.90 GHS
            CNY: 1.75,     // 1 CNY = 1.75 GHS
            INR: 0.15      // 1 INR = 0.15 GHS
        },

        // African Regional Currencies (Fixed rates for M-Pesewa)
        africanCurrencies: {
            KES: 0.085,    // 1 KES = 0.085 GHS (Kenyan Shilling)
            UGX: 0.0033,   // 1 UGX = 0.0033 GHS (Ugandan Shilling)
            TZS: 0.0054,   // 1 TZS = 0.0054 GHS (Tanzanian Shilling)
            RWF: 0.010,    // 1 RWF = 0.010 GHS (Rwandan Franc)
            BIF: 0.0044,   // 1 BIF = 0.0044 GHS (Burundian Franc)
            NGN: 0.015,    // 1 NGN = 0.015 GHS (Nigerian Naira)
            ZAR: 0.68,     // 1 ZAR = 0.68 GHS (South African Rand)
            ETB: 0.22,     // 1 ETB = 0.22 GHS (Ethiopian Birr)
            SOS: 0.0022,   // 1 SOS = 0.0022 GHS (Somali Shilling)
            SSD: 0.042,    // 1 SSD = 0.042 GHS (South Sudanese Pound)
            CDF: 0.0046,   // 1 CDF = 0.0046 GHS (Congolese Franc)
            XOF: 0.021,    // 1 XOF = 0.021 GHS (West African CFA)
            XAF: 0.021     // 1 XAF = 0.021 GHS (Central African CFA)
        },

        // Historical Averages (for reference)
        historicalAverages: {
            '2020': 5.80,
            '2021': 6.10,
            '2022': 8.50,
            '2023': 11.20,
            '2024': 12.50
        },

        // Bank of Ghana Buying/Selling Rates
        bogRates: {
            buyingRateUSD: 12.30,
            sellingRateUSD: 12.70,
            buyingRateEUR: 13.60,
            sellingRateEUR: 14.00,
            buyingRateGBP: 15.70,
            sellingRateGBP: 16.10,
            spread: 'Average 3.2%'
        }
    },

    // ============================================
    // 3️⃣ INTEREST & PENALTY CALCULATIONS
    // ============================================
    calculations: {
        // M-Pesewa Standard Rates
        standardRates: {
            weeklyInterest: 0.10,      // 10% per week
            dailyPenalty: 0.05,        // 5% daily after 7 days
            annualPercentageRate: 520, // 520% APR (10% weekly compounded)
            maximumInterest: 0.10      // Maximum 10% weekly by platform rules
        },

        // Calculation Methods
        methods: {
            simpleInterest: true,
            compounding: false,
            gracePeriod: 0,
            minimumCharge: 0.01 // Minimum 1 pesewa
        },

        // Loan Term Limits
        terms: {
            minimumLoanPeriod: 1,   // 1 day minimum
            maximumLoanPeriod: 7,   // 7 days standard
            defaultPeriod: 60,      // 60 days = default
            extensionAllowed: false,
            earlyRepaymentAllowed: true
        }
    },

    // ============================================
    // 4️⃣ FORMATTING & DISPLAY RULES
    // ============================================
    formatting: {
        // Display Formats
        formats: {
            standard: '{symbol}{amount}',      // GH₵1,234.56
            compact: '{symbol}{amount}',       // GH₵1.2K
            verbal: '{amount} Ghana Cedis',    // One thousand two hundred thirty-four Ghana Cedis
            iso: '{amount} {code}',            // 1234.56 GHS
            decimal: '{amount}{symbol}'        // 1234.56₵
        },

        // Decimal Rules
        decimals: {
            precision: 2,
            rounding: 'half-up',
            minimum: 0.01,
            maximum: 1000000,
            trailingZeros: false
        },

        // Separators
        separators: {
            thousand: ',',
            decimal: '.',
            grouping: 3
        },

        // Number Formatting Rules
        rules: {
            currencyFirst: true,
            spaceBetween: false,
            negativeFormat: '-{symbol}{amount}',
            zeroDisplay: 'GH₵0.00'
        }
    },

    // ============================================
    // 5️⃣ VALIDATION RULES
    // ============================================
    validation: {
        // Amount Validation
        amounts: {
            minimumLoan: 0.01,     // 1 pesewa minimum
            maximumLoan: 50000,    // GH₵50,000 maximum
            increments: 0.01,      // 1 pesewa increments
            blacklistAmounts: [666, 6666, 66666], // Culturally sensitive amounts
            suspiciousThreshold: 10000 // GH₵10,000 requires enhanced due diligence
        },

        // Pattern Validation
        patterns: {
            validAmount: /^\d{1,6}(\.\d{1,2})?$/, // Up to 999,999.99
            validGhsFormat: /^GH₵?\s?\d{1,3}(,\d{3})*(\.\d{2})?$/,
            pesewaOnly: /^\d{1,2}$/ // For pesewa-only amounts
        },

        // Business Rules
        businessRules: {
            roundUpToNearestPesewa: true,
            allowPartialPesewa: false,
            maximumDecimalPlaces: 2,
            validateAmountExists: true
        }
    },

    // ============================================
    // 6️⃣ SUBSCRIPTION TIER LIMITS (GHS)
    // ============================================
    subscriptionLimits: {
        // Basic Tier
        basic: {
            weeklyLimit: 1500,
            monthlyLimit: 6000,
            perTransactionMax: 1500,
            perTransactionMin: 5,
            totalExposure: 1500
        },

        // Premium Tier
        premium: {
            weeklyLimit: 5000,
            monthlyLimit: 20000,
            perTransactionMax: 5000,
            perTransactionMin: 10,
            totalExposure: 10000
        },

        // Super Tier
        super: {
            weeklyLimit: 20000,
            monthlyLimit: 80000,
            perTransactionMax: 20000,
            perTransactionMin: 50,
            totalExposure: 20000
        },

        // Lender of Lenders Tier
        lenderOfLenders: {
            weeklyLimit: 50000,
            monthlyLimit: 200000,
            perTransactionMax: 50000,
            perTransactionMin: 100,
            totalExposure: 50000
        }
    },

    // ============================================
    // 7️⃣ TAX & WITHHOLDING CALCULATIONS
    // ============================================
    taxation: {
        // Ghana Revenue Authority Rates
        ghanaRevenueAuthority: {
            withholdingTaxRate: 0.05,      // 5% withholding tax on interest
            vatRate: 0.15,                 // 15% VAT (applied to subscriptions)
            corporateTaxRate: 0.25,        // 25% corporate tax
            minimumThreshold: 100,         // GH₵100 monthly threshold for withholding
            exemptThreshold: 5000          // GH₵5,000 annual exempt threshold
        },

        // Calculation Methods
        calculations: {
            withholdingOnInterest: true,
            vatOnSubscriptions: true,
            taxInclusive: true,
            roundTaxToPesewa: true
        },

        // Reporting Thresholds
        reporting: {
            annualIncomeThreshold: 3264,   // GH₵3,264 annual exempt
            monthlyWithholdingThreshold: 100,
            vatRegistrationThreshold: 200000 // GH₵200,000 annual turnover
        }
    },

    // ============================================
    // 8️⃣ MOBILE MONEY & TRANSFER LIMITS
    // ============================================
    transferLimits: {
        // MTN Mobile Money Ghana
        mtn: {
            dailyLimit: 5000,
            weeklyLimit: 10000,
            monthlyLimit: 20000,
            perTransactionMax: 2000,
            perTransactionMin: 1,
            fees: {
                '0-50': 0,
                '51-500': 0.5,
                '501-1000': 1,
                '1001-5000': 5,
                '5001-10000': 10
            }
        },

        // Vodafone Cash Ghana
        vodafone: {
            dailyLimit: 3000,
            weeklyLimit: 10000,
            monthlyLimit: 20000,
            perTransactionMax: 1500,
            perTransactionMin: 1,
            fees: {
                '0-100': 0,
                '101-500': 0.5,
                '501-1000': 1,
                '1001-3000': 2
            }
        },

        // AirtelTigo Money
        airteltigo: {
            dailyLimit: 2000,
            weeklyLimit: 8000,
            monthlyLimit: 15000,
            perTransactionMax: 1000,
            perTransactionMin: 1,
            fees: {
                '0-50': 0,
                '51-500': 0.5,
                '501-1000': 1,
                '1001-2000': 2
            }
        },

        // Bank Transfer Limits
        bankTransfer: {
            dailyLimit: 50000,
            weeklyLimit: 200000,
            monthlyLimit: 1000000,
            perTransactionMax: 50000,
            perTransactionMin: 10,
            processingTime: '1-2 business days'
        }
    },

    // ============================================
    // 9️⃣ CURRENCY CONVERSION UTILITIES
    // ============================================
    conversion: {
        // Supported Currencies for Conversion
        supportedCurrencies: [
            'USD', 'EUR', 'GBP', 'KES', 'UGX', 'TZS', 'RWF', 'BIF',
            'NGN', 'ZAR', 'ETB', 'SOS', 'SSD', 'CDF', 'XOF', 'XAF'
        ],

        // Conversion Methods
        methods: {
            buyRate: 'Bank of Ghana buying rate',
            sellRate: 'Bank of Ghana selling rate',
            platformRate: 'Fixed internal rate',
            lastUpdated: new Date().toISOString().split('T')[0]
        },

        // Precision Rules
        precision: {
            ghsToForeign: 4,
            foreignToGhs: 2,
            intermediate: 6,
            rounding: 'half-even'
        }
    },

    // ============================================
    // 🔟 COMPLIANCE & REGULATORY LIMITS
    // ============================================
    compliance: {
        // Anti-Money Laundering Limits
        amlLimits: {
            cddThreshold: 1000,     // GH₵1,000 requires standard CDD
            eddThreshold: 10000,    // GH₵10,000 requires enhanced CDD
            reportingThreshold: 15000, // GH₵15,000 requires reporting
            maximumAnonymous: 500   // GH₵500 maximum anonymous transaction
        },

        // Transaction Monitoring
        monitoring: {
            dailyAggregate: 5000,
            weeklyAggregate: 20000,
            monthlyAggregate: 50000,
            suspiciousPatterns: [
                'Round number transactions',
                'Just below threshold amounts',
                'Rapid successive transactions',
                'Structured deposits/withdrawals'
            ]
        },

        // Record Keeping Requirements
        recordKeeping: {
            transactionRecords: '10 years',
            kycDocuments: '10 years',
            currencyExchange: '10 years',
            auditTrail: 'Permanent'
        }
    }
};

// ============================================
// CURRENCY UTILITIES & FUNCTIONS
// ============================================

/**
 * Format Ghana Cedi amount
 * @param {number} amount - Amount in GHS
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
function formatGhanaCedi(amount, options = {}) {
    const {
        format = 'standard',
        includeSymbol = true,
        decimalPlaces = 2,
        compact = false,
        verbal = false
    } = options;

    // Validate amount
    if (typeof amount !== 'number' || isNaN(amount)) {
        throw new Error('Invalid amount provided');
    }

    // Ensure amount is within limits
    if (amount < GHANA_CURRENCY.validation.amounts.minimumLoan) {
        throw new Error(`Amount below minimum of GH₵${GHANA_CURRENCY.validation.amounts.minimumLoan}`);
    }

    if (amount > GHANA_CURRENCY.validation.amounts.maximumLoan) {
        throw new Error(`Amount above maximum of GH₵${GHANA_CURRENCY.validation.amounts.maximumLoan}`);
    }

    // Round to specified decimal places
    const roundedAmount = roundToDecimal(amount, decimalPlaces);
    
    // Format based on requested format
    switch (format) {
        case 'compact':
            return formatCompact(roundedAmount, includeSymbol);
        
        case 'verbal':
            return amountToWords(roundedAmount);
        
        case 'iso':
            return `${roundedAmount.toFixed(decimalPlaces)} ${GHANA_CURRENCY.definition.isoCode}`;
        
        case 'decimal':
            return `${roundedAmount.toFixed(decimalPlaces)}${GHANA_CURRENCY.definition.currencySymbol}`;
        
        case 'standard':
        default:
            const formattedAmount = roundedAmount.toLocaleString('en-GH', {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
                useGrouping: true
            });
            
            return includeSymbol 
                ? `${GHANA_CURRENCY.definition.currencySymbol}${formattedAmount}`
                : formattedAmount;
    }
}

/**
 * Round amount to specified decimal places
 * @param {number} amount - Amount to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded amount
 */
function roundToDecimal(amount, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round((amount + Number.EPSILON) * factor) / factor;
}

/**
 * Format amount in compact form (K, M)
 * @param {number} amount - Amount to format
 * @param {boolean} includeSymbol - Include currency symbol
 * @returns {string} Compact formatted amount
 */
function formatCompact(amount, includeSymbol = true) {
    const thresholds = [
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'K' },
        { value: 1, suffix: '' }
    ];

    const threshold = thresholds.find(t => Math.abs(amount) >= t.value);
    const formatted = threshold 
        ? (amount / threshold.value).toFixed(1).replace(/\.0$/, '') + threshold.suffix
        : amount.toString();

    return includeSymbol ? `${GHANA_CURRENCY.definition.currencySymbol}${formatted}` : formatted;
}

/**
 * Convert amount to words (Ghanaian style)
 * @param {number} amount - Amount to convert
 * @returns {string} Amount in words
 */
function amountToWords(amount) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Million'];

    // Separate cedis and pesewas
    const cedis = Math.floor(amount);
    const pesewas = Math.round((amount - cedis) * 100);

    // Convert cedis to words
    let words = '';
    
    if (cedis === 0) {
        words = 'Zero';
    } else {
        let remainder = cedis;
        let scaleIndex = 0;
        
        while (remainder > 0) {
            const chunk = remainder % 1000;
            if (chunk !== 0) {
                const chunkWords = convertChunk(chunk);
                words = chunkWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (words ? ' ' + words : '');
            }
            remainder = Math.floor(remainder / 1000);
            scaleIndex++;
        }
    }

    // Add currency
    words += ` Ghana Cedi${cedis !== 1 ? 's' : ''}`;

    // Add pesewas if any
    if (pesewas > 0) {
        const pesewaWords = convertChunk(pesewas);
        words += ` and ${pesewaWords} Pesewa${pesewas !== 1 ? 's' : ''}`;
    }

    return words;

    // Helper function to convert chunks
    function convertChunk(number) {
        if (number === 0) return '';
        
        let chunkWords = '';
        const hundreds = Math.floor(number / 100);
        const tensAndOnes = number % 100;
        
        if (hundreds > 0) {
            chunkWords += units[hundreds] + ' Hundred';
            if (tensAndOnes > 0) chunkWords += ' and ';
        }
        
        if (tensAndOnes >= 10 && tensAndOnes <= 19) {
            chunkWords += teens[tensAndOnes - 10];
        } else {
            const tensDigit = Math.floor(tensAndOnes / 10);
            const onesDigit = tensAndOnes % 10;
            
            if (tensDigit > 0) {
                chunkWords += tens[tensDigit];
                if (onesDigit > 0) chunkWords += '-';
            }
            
            if (onesDigit > 0) {
                chunkWords += units[onesDigit];
            }
        }
        
        return chunkWords;
    }
}

/**
 * Calculate loan interest and penalties
 * @param {number} principal - Loan amount in GHS
 * @param {number} days - Number of days loan has been active
 * @param {Object} options - Calculation options
 * @returns {Object} Interest and penalty breakdown
 */
function calculateLoanInterest(principal, days, options = {}) {
    const {
        interestRate = GHANA_CURRENCY.calculations.standardRates.weeklyInterest,
        penaltyRate = GHANA_CURRENCY.calculations.standardRates.dailyPenalty,
        standardTerm = GHANA_CURRENCY.calculations.terms.maximumLoanPeriod,
        defaultPeriod = GHANA_CURRENCY.calculations.terms.defaultPeriod
    } = options;

    // Validate principal
    if (principal <= 0) {
        throw new Error('Principal amount must be greater than 0');
    }

    // Calculate interest for standard term
    const standardInterest = principal * interestRate;
    
    if (days <= standardTerm) {
        return {
            principal: principal,
            interest: standardInterest,
            totalDue: principal + standardInterest,
            penalty: 0,
            daysOverdue: 0,
            isDefault: false,
            breakdown: {
                principal: principal,
                interest: standardInterest,
                penalty: 0,
                total: principal + standardInterest
            }
        };
    }

    // Calculate penalty for overdue days
    const overdueDays = days - standardTerm;
    const dailyPenaltyAmount = principal * penaltyRate;
    const totalPenalty = dailyPenaltyAmount * overdueDays;
    const isDefault = overdueDays > (defaultPeriod - standardTerm);

    return {
        principal: principal,
        interest: standardInterest,
        penalty: totalPenalty,
        totalDue: principal + standardInterest + totalPenalty,
        daysOverdue: overdueDays,
        isDefault: isDefault,
        defaultDate: isDefault ? new Date(Date.now() + (overdueDays - (defaultPeriod - standardTerm)) * 24 * 60 * 60 * 1000) : null,
        breakdown: {
            principal: principal,
            interest: standardInterest,
            penalty: totalPenalty,
            total: principal + standardInterest + totalPenalty
        }
    };
}

/**
 * Convert foreign currency to Ghana Cedis
 * @param {number} amount - Amount in foreign currency
 * @param {string} fromCurrency - ISO currency code to convert from
 * @param {Object} options - Conversion options
 * @returns {Object} Conversion result
 */
function convertToGhanaCedi(amount, fromCurrency, options = {}) {
    const {
        rateType = 'platform', // 'platform', 'buy', 'sell'
        roundResult = true,
        includeFees = true
    } = options;

    // Validate currency
    const upperCurrency = fromCurrency.toUpperCase();
    let rate;

    // Get appropriate rate
    if (GHANA_CURRENCY.exchange.baseRate[upperCurrency]) {
        rate = GHANA_CURRENCY.exchange.baseRate[upperCurrency];
    } else if (GHANA_CURRENCY.exchange.africanCurrencies[upperCurrency]) {
        rate = GHANA_CURRENCY.exchange.africanCurrencies[upperCurrency];
    } else {
        throw new Error(`Unsupported currency: ${fromCurrency}`);
    }

    // Adjust rate based on rate type
    if (rateType === 'buy') {
        rate = rate * 0.99; // Approximate buying rate
    } else if (rateType === 'sell') {
        rate = rate * 1.01; // Approximate selling rate
    }

    // Calculate conversion
    let convertedAmount = amount * rate;
    
    // Apply rounding if requested
    if (roundResult) {
        convertedAmount = roundToDecimal(convertedAmount, 2);
    }

    // Calculate fees (approximate)
    let fees = 0;
    if (includeFees && convertedAmount > 100) {
        fees = convertedAmount * 0.015; // 1.5% approximate fee
        fees = Math.max(fees, 5); // Minimum GH₵5 fee
    }

    return {
        originalAmount: amount,
        originalCurrency: upperCurrency,
        convertedAmount: convertedAmount,
        currency: 'GHS',
        conversionRate: rate,
        fees: roundResult ? roundToDecimal(fees, 2) : fees,
        totalAmount: convertedAmount - (includeFees ? fees : 0),
        timestamp: new Date().toISOString(),
        rateType: rateType
    };
}

/**
 * Validate Ghana Cedi amount
 * @param {number|string} amount - Amount to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
function validateGhanaCediAmount(amount, options = {}) {
    const {
        checkMinimum = true,
        checkMaximum = true,
        checkIncrements = true,
        checkBlacklist = true
    } = options;

    const result = {
        valid: true,
        errors: [],
        warnings: [],
        parsedAmount: 0,
        formattedAmount: ''
    };

    try {
        // Parse amount
        let parsed;
        if (typeof amount === 'string') {
            // Remove currency symbol and commas
            const cleaned = amount.replace(/[^\d.-]/g, '');
            parsed = parseFloat(cleaned);
        } else {
            parsed = parseFloat(amount);
        }

        if (isNaN(parsed)) {
            throw new Error('Invalid amount format');
        }

        result.parsedAmount = parsed;

        // Check minimum amount
        if (checkMinimum && parsed < GHANA_CURRENCY.validation.amounts.minimumLoan) {
            result.valid = false;
            result.errors.push(`Amount below minimum of GH₵${GHANA_CURRENCY.validation.amounts.minimumLoan}`);
        }

        // Check maximum amount
        if (checkMaximum && parsed > GHANA_CURRENCY.validation.amounts.maximumLoan) {
            result.valid = false;
            result.errors.push(`Amount above maximum of GH₵${GHANA_CURRENCY.validation.amounts.maximumLoan}`);
        }

        // Check increments
        if (checkIncrements) {
            const remainder = (parsed * 100) % (GHANA_CURRENCY.validation.amounts.increments * 100);
            if (remainder !== 0) {
                result.valid = false;
                result.errors.push(`Amount must be in increments of GH₵${GHANA_CURRENCY.validation.amounts.increments}`);
            }
        }

        // Check blacklisted amounts
        if (checkBlacklist) {
            const blacklisted = GHANA_CURRENCY.validation.amounts.blacklistAmounts.includes(parsed);
            if (blacklisted) {
                result.warnings.push('Amount matches culturally sensitive pattern');
            }
        }

        // Check suspicious amounts
        if (parsed >= GHANA_CURRENCY.validation.amounts.suspiciousThreshold) {
            result.warnings.push('Amount exceeds normal transaction threshold - enhanced verification recommended');
        }

        // Format amount if valid
        if (result.valid) {
            result.formattedAmount = formatGhanaCedi(parsed);
        }

    } catch (error) {
        result.valid = false;
        result.errors.push(error.message);
    }

    return result;
}

/**
 * Calculate subscription tier limits
 * @param {string} tier - Subscription tier
 * @param {Object} currentUsage - Current usage statistics
 * @returns {Object} Tier limits and remaining capacity
 */
function calculateSubscriptionLimits(tier, currentUsage = {}) {
    const tierConfig = GHANA_CURRENCY.subscriptionLimits[tier.toLowerCase()];
    
    if (!tierConfig) {
        throw new Error(`Invalid subscription tier: ${tier}`);
    }

    const {
        weeklyUsed = 0,
        monthlyUsed = 0,
        activeLoans = 0,
        totalExposure = 0
    } = currentUsage;

    // Calculate remaining limits
    const weeklyRemaining = Math.max(0, tierConfig.weeklyLimit - weeklyUsed);
    const monthlyRemaining = Math.max(0, tierConfig.monthlyLimit - monthlyUsed);
    const exposureRemaining = Math.max(0, tierConfig.totalExposure - totalExposure);

    // Calculate utilization percentages
    const weeklyUtilization = tierConfig.weeklyLimit > 0 ? (weeklyUsed / tierConfig.weeklyLimit) * 100 : 0;
    const monthlyUtilization = tierConfig.monthlyLimit > 0 ? (monthlyUsed / tierConfig.monthlyLimit) * 100 : 0;
    const exposureUtilization = tierConfig.totalExposure > 0 ? (totalExposure / tierConfig.totalExposure) * 100 : 0;

    return {
        tier: tier,
        limits: {
            weekly: tierConfig.weeklyLimit,
            monthly: tierConfig.monthlyLimit,
            perTransactionMax: tierConfig.perTransactionMax,
            perTransactionMin: tierConfig.perTransactionMin,
            totalExposure: tierConfig.totalExposure
        },
        usage: {
            weeklyUsed: weeklyUsed,
            monthlyUsed: monthlyUsed,
            activeLoans: activeLoans,
            totalExposure: totalExposure
        },
        remaining: {
            weekly: weeklyRemaining,
            monthly: monthlyRemaining,
            exposure: exposureRemaining
        },
        utilization: {
            weekly: Math.round(weeklyUtilization),
            monthly: Math.round(monthlyUtilization),
            exposure: Math.round(exposureUtilization)
        },
        canLend: weeklyRemaining > tierConfig.perTransactionMin && exposureRemaining > tierConfig.perTransactionMin,
        status: weeklyUtilization > 90 ? 'critical' : weeklyUtilization > 75 ? 'warning' : 'normal'
    };
}

/**
 * Calculate tax withholding amount
 * @param {number} interestAmount - Interest amount in GHS
 * @param {Object} options - Tax calculation options
 * @returns {Object} Tax calculation result
 */
function calculateWithholdingTax(interestAmount, options = {}) {
    const {
        applyThreshold = true,
        roundTax = true,
        annualAccumulated = 0
    } = options;

    const taxConfig = GHANA_CURRENCY.taxation.ghanaRevenueAuthority;
    
    // Check if below monthly threshold
    if (applyThreshold && interestAmount < taxConfig.minimumThreshold) {
        return {
            interestAmount: interestAmount,
            taxRate: 0,
            taxAmount: 0,
            netAmount: interestAmount,
            thresholdApplied: true,
            exceedsThreshold: false,
            annualAccumulated: annualAccumulated + interestAmount,
            annualExemptRemaining: Math.max(0, taxConfig.exemptThreshold - (annualAccumulated + interestAmount))
        };
    }

    // Calculate tax
    let taxAmount = interestAmount * taxConfig.withholdingTaxRate;
    
    // Round tax if requested
    if (roundTax) {
        taxAmount = roundToDecimal(taxAmount, 2);
    }

    const netAmount = interestAmount - taxAmount;
    const annualTotal = annualAccumulated + interestAmount;
    const exemptRemaining = Math.max(0, taxConfig.exemptThreshold - annualTotal);

    return {
        interestAmount: interestAmount,
        taxRate: taxConfig.withholdingTaxRate,
        taxAmount: taxAmount,
        netAmount: netAmount,
        thresholdApplied: applyThreshold && interestAmount < taxConfig.minimumThreshold,
        exceedsThreshold: interestAmount >= taxConfig.minimumThreshold,
        annualAccumulated: annualTotal,
        annualExemptRemaining: exemptRemaining,
        requiresWithholding: interestAmount >= taxConfig.minimumThreshold || annualTotal >= taxConfig.exemptThreshold
    };
}

/**
 * Get mobile money transfer limits and fees
 * @param {string} provider - Mobile money provider
 * @param {number} amount - Transfer amount
 * @returns {Object} Transfer limits and fees
 */
function getMobileMoneyTransferInfo(provider, amount) {
    const providerConfig = GHANA_CURRENCY.transferLimits[provider.toLowerCase()];
    
    if (!providerConfig) {
        throw new Error(`Unsupported mobile money provider: ${provider}`);
    }

    // Validate amount against limits
    if (amount > providerConfig.perTransactionMax) {
        throw new Error(`Amount exceeds per transaction limit of GH₵${providerConfig.perTransactionMax}`);
    }

    if (amount < providerConfig.perTransactionMin) {
        throw new Error(`Amount below minimum transaction of GH₵${providerConfig.perTransactionMin}`);
    }

    // Calculate fees
    let fee = 0;
    const feeRanges = Object.entries(providerConfig.fees);
    
    for (const [range, rangeFee] of feeRanges) {
        const [min, max] = range.split('-').map(Number);
        if (amount >= min && (max === undefined || amount <= max)) {
            fee = rangeFee;
            break;
        }
    }

    return {
        provider: provider,
        amount: amount,
        limits: {
            daily: providerConfig.dailyLimit,
            weekly: providerConfig.weeklyLimit,
            monthly: providerConfig.monthlyLimit,
            perTransactionMax: providerConfig.perTransactionMax,
            perTransactionMin: providerConfig.perTransactionMin
        },
        fees: {
            amount: fee,
            percentage: amount > 0 ? (fee / amount) * 100 : 0,
            netAmount: amount - fee
        },
        validation: {
            withinDailyLimit: amount <= providerConfig.dailyLimit,
            withinWeeklyLimit: amount <= providerConfig.weeklyLimit,
            withinMonthlyLimit: amount <= providerConfig.monthlyLimit,
            validAmount: amount >= providerConfig.perTransactionMin && amount <= providerConfig.perTransactionMax
        }
    };
}

/**
 * Generate currency exchange receipt
 * @param {Object} exchangeData - Exchange transaction data
 * @returns {Object} Formatted receipt
 */
function generateCurrencyReceipt(exchangeData) {
    const {
        fromAmount,
        fromCurrency,
        toAmount,
        toCurrency = 'GHS',
        rate,
        fees = 0,
        transactionId = `EXC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    } = exchangeData;

    const receipt = {
        receiptNumber: transactionId,
        date: new Date().toISOString(),
        transactionType: 'Currency Exchange',
        from: {
            amount: fromAmount,
            currency: fromCurrency,
            formatted: `${fromCurrency} ${fromAmount.toFixed(2)}`
        },
        to: {
            amount: toAmount,
            currency: toCurrency,
            formatted: formatGhanaCedi(toAmount)
        },
        exchangeRate: rate,
        fees: {
            amount: fees,
            formatted: formatGhanaCedi(fees)
        },
        netAmount: toAmount - fees,
        formattedNetAmount: formatGhanaCedi(toAmount - fees),
        taxInformation: {
            withholdingApplied: false,
            vatApplied: false,
            taxAmount: 0
        },
        compliance: {
            transactionId: transactionId,
            timestamp: new Date().toISOString(),
            requiresReporting: toAmount >= GHANA_CURRENCY.compliance.amlLimits.reportingThreshold
        },
        terms: [
            'Exchange rates are fixed by M-Pesewa platform',
            'Fees are non-refundable',
            'Transactions are final',
            'Compliant with Bank of Ghana regulations'
        ]
    };

    return receipt;
}

// ============================================
// EXPORT CURRENCY MODULE
// ============================================

export {
    GHANA_CURRENCY,
    formatGhanaCedi,
    calculateLoanInterest,
    convertToGhanaCedi,
    validateGhanaCediAmount,
    calculateSubscriptionLimits,
    calculateWithholdingTax,
    getMobileMoneyTransferInfo,
    generateCurrencyReceipt,
    roundToDecimal,
    amountToWords
};

export default GHANA_CURRENCY;