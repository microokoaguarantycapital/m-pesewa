/**
 * BURUNDI (BI) - Currency Configuration Module
 * Burundi Franc (BIF) handling, formatting, and calculations
 * Enforces country-specific currency rules and isolation
 */

const BI_CURRENCY_CONFIG = {
    // ============================================
    // 1️⃣ CURRENCY IDENTIFICATION & METADATA
    // ============================================
    metadata: {
        country: "Burundi",
        countryCode: "BI",
        currencyCode: "BIF",
        currencyName: "Burundian Franc",
        currencySymbol: "FBu",
        currencySymbolNative: "FBu",
        decimalDigits: 0,
        rounding: 0,
        isoCode: "108",
        
        // Historical context
        introduced: "1964",
        replaces: "Rwanda-Burundi Franc",
        centralBank: "Bank of the Republic of Burundi",
        bankCode: "BRB",
        
        // Physical currency
        coins: ["1", "5", "10", "50 FBu"],
        banknotes: ["100", "500", "1000", "2000", "5000", "10000 FBu"],
        securityFeatures: [
            "Watermark",
            "Security thread",
            "See-through register",
            "UV features"
        ]
    },
    
    // ============================================
    // 2️⃣ CURRENCY FORMATTING RULES
    // ============================================
    formatting: {
        // Display formats
        displayFormats: {
            standard: "amount FBu", // "1000 FBu"
            compact: "FBu amount", // "FBu 1000"
            accounting: "amount FBu", // "1000 FBu"
            withCode: "amount BIF", // "1000 BIF"
            verbose: "amount Burundian Francs" // "1000 Burundian Francs"
        },
        
        // Number formatting
        numberFormat: {
            decimalSeparator: ",", // Not used for BIF (no decimals)
            thousandSeparator: ".",
            groupingSize: 3,
            groupingSeparator: ".",
            decimalDigits: 0,
            roundingIncrement: 1
        },
        
        // Position rules
        symbolPosition: "after",
        spaceBetweenAmountAndSymbol: true,
        spaceBetweenSymbolAndCode: false,
        
        // Negative numbers
        negativeFormat: "-amount FBu",
        negativeColor: "#dc2626", // Red for negative amounts
        
        // Zero display
        zeroFormat: "0 FBu",
        showZeroDecimals: false,
        
        // Large number formatting
        compactFormat: {
            thousand: "K",
            million: "M",
            billion: "B",
            trillion: "T"
        },
        
        // Range formatting
        rangeFormat: "amount1 - amount2 FBu",
        
        // Percentage formatting
        percentageFormat: "amount%",
        percentageDecimalDigits: 1
    },
    
    // ============================================
    // 3️⃣ CONVERSION RATES & EXCHANGE
    // ============================================
    exchange: {
        // Base rate (as of March 2024)
        baseRate: {
            USD: 0.00051, // 1 BIF = 0.00051 USD
            EUR: 0.00047,
            GBP: 0.00040,
            KES: 0.078, // Kenyan Shilling
            UGX: 1.89, // Ugandan Shilling
            TZS: 1.19, // Tanzanian Shilling
            RWF: 0.61, // Rwandan Franc
            updated: "2024-03-15T12:00:00Z",
            source: "Bank of the Republic of Burundi"
        },
        
        // Conversion rules
        conversion: {
            enabled: true,
            autoUpdate: true,
            updateFrequency: "daily",
            fallbackRates: true,
            
            // API endpoints
            api: {
                primary: "https://api.brb.bi/rates",
                fallback: "https://api.exchangerate-api.com/v4/latest/BIF",
                backup: "https://openexchangerates.org/api/latest.json?base=BIF"
            },
            
            // Caching
            cacheDuration: 3600, // 1 hour in seconds
            cacheKey: "bif_exchange_rates"
        },
        
        // Manual override
        manualOverride: {
            enabled: false,
            requiresAdmin: true,
            maxDeviation: 0.1, // 10% maximum deviation
            auditLog: true
        },
        
        // Historical rates (for reporting)
        historical: {
            enabled: true,
            retentionPeriod: "5 years",
            storage: "encrypted database",
            access: "admin-only"
        }
    },
    
    // ============================================
    // 4️⃣ TRANSACTION LIMITS & VALIDATION
    // ============================================
    limits: {
        // Platform-wide limits (in BIF)
        platform: {
            minTransaction: 100, // Minimum 100 BIF
            maxTransaction: 10000000, // Maximum 10,000,000 BIF
            defaultMax: 5000000, // Default 5,000,000 BIF
            dailyLimit: 20000000, // 20,000,000 BIF per day
            weeklyLimit: 100000000, // 100,000,000 BIF per week
            monthlyLimit: 400000000 // 400,000,000 BIF per month
        },
        
        // User-specific limits
        user: {
            newUserDailyLimit: 50000, // 50,000 BIF for new users
            verifiedUserDailyLimit: 500000, // 500,000 BIF for verified users
            trustedUserDailyLimit: 2000000, // 2,000,000 BIF for trusted users
            maxBalance: 10000000 // Maximum 10,000,000 BIF balance
        },
        
        // Subscription tier limits (per week)
        subscriptionTiers: {
            basic: {
                weeklyLimit: 1500,
                maxPerTransaction: 1500,
                dailyLimit: 3000
            },
            premium: {
                weeklyLimit: 5000,
                maxPerTransaction: 5000,
                dailyLimit: 10000
            },
            super: {
                weeklyLimit: 20000,
                maxPerTransaction: 20000,
                dailyLimit: 40000
            },
            lenderOfLenders: {
                weeklyLimit: 50000,
                maxPerTransaction: 50000,
                dailyLimit: 100000
            }
        },
        
        // Loan-specific limits
        loans: {
            minLoanAmount: 100,
            maxLoanAmount: 50000,
            defaultLoanAmount: 5000,
            
            // Emergency category limits
            categoryLimits: {
                fare: { min: 100, max: 5000, typical: 1000 },
                data: { min: 500, max: 3000, typical: 1000 },
                gas: { min: 2000, max: 10000, typical: 5000 },
                food: { min: 1000, max: 8000, typical: 3000 },
                medicine: { min: 1000, max: 15000, typical: 5000 },
                school: { min: 2000, max: 20000, typical: 10000 }
            }
        },
        
        // Validation rules
        validation: {
            amountMustBeInteger: true, // No decimals for BIF
            amountMustBePositive: true,
            amountMustBeWithinLimits: true,
            amountMustBeDivisibleBy: 1, // Any integer amount
            customValidation: "checkSubscriptionLimits"
        }
    },
    
    // ============================================
    // 5️⃣ FINANCIAL CALCULATIONS
    // ============================================
    calculations: {
        // Interest calculation (M-Pesewa standard: 10% per 7 days)
        interest: {
            rate: 0.10, // 10%
            period: 7, // days
            calculationMethod: "simple",
            compounding: "none",
            
            // Formula: interest = principal * rate
            formula: "principal * 0.10",
            minimumInterest: 1, // Minimum 1 BIF interest
            rounding: "ceil", // Round up to nearest BIF
            
            // Examples
            examples: [
                { principal: 1000, interest: 100, total: 1100 },
                { principal: 5000, interest: 500, total: 5500 },
                { principal: 10000, interest: 1000, total: 11000 }
            ]
        },
        
        // Penalty calculation (5% daily after 7 days)
        penalty: {
            rate: 0.05, // 5% daily
            gracePeriod: 7, // days
            calculationMethod: "daily_compound",
            maximumPenalty: 2.0, // Maximum 200% of principal
            
            // Formula: penalty = principal * 0.05 * overdueDays
            formula: "principal * 0.05 * Math.max(0, overdueDays - 7)",
            minimumPenalty: 1, // Minimum 1 BIF penalty
            rounding: "ceil",
            
            // Examples
            examples: [
                { principal: 1000, overdueDays: 8, penalty: 50 },
                { principal: 1000, overdueDays: 10, penalty: 150 },
                { principal: 1000, overdueDays: 20, penalty: 650 }
            ]
        },
        
        // Total repayment calculation
        repayment: {
            // Formula: total = principal + interest + penalty
            formula: "principal + interest + penalty",
            
            // Partial repayment
            partialRepayment: {
                allowed: true,
                minimumPartial: 100, // Minimum 100 BIF partial payment
                applyTo: "penalty_first", // Apply to penalty first, then interest, then principal
                recalculateInterest: false
            },
            
            // Early repayment
            earlyRepayment: {
                discount: 0, // No discount for early repayment
                allowed: true,
                recalculateInterest: false
            }
        },
        
        // Subscription fee calculations
        subscriptionFees: {
            // Monthly fees
            monthly: {
                basic: 50,
                premium: 250,
                super: 1000,
                lenderOfLenders: 500
            },
            
            // Bi-annual discount (approximately 17% discount)
            biAnnual: {
                basic: 250, // 6 * 50 * 0.83 = 250
                premium: 1500, // 6 * 250 * 0.83 = 1500
                super: 5000, // 6 * 1000 * 0.83 = 5000
                lenderOfLenders: 3500 // 6 * 500 * 0.83 = 3500
            },
            
            // Annual discount (approximately 17% discount)
            annual: {
                basic: 500, // 12 * 50 * 0.83 = 500
                premium: 2500, // 12 * 250 * 0.83 = 2500
                super: 8500, // 12 * 1000 * 0.83 = 8500
                lenderOfLenders: 6500 // 12 * 500 * 0.83 = 6500
            },
            
            // Proration for mid-cycle upgrades/downgrades
            proration: {
                enabled: true,
                method: "daily",
                rounding: "ceil"
            }
        },
        
        // Tax calculations
        taxes: {
            vat: {
                rate: 0.18, // 18% VAT on subscription fees
                included: true,
                appliesTo: ["subscription_fees"]
            },
            
            withholdingTax: {
                rate: 0.15, // 15% on interest income
                threshold: 1000000, // 1,000,000 BIF annual threshold
                appliesTo: ["interest_income"]
            }
        }
    },
    
    // ============================================
    // 6️⃣ CURRENCY VALIDATION & SANITIZATION
    // ============================================
    validation: {
        // Amount validation
        amount: {
            regex: /^\d+$/, // Only integers, no decimals
            maxLength: 9, // Up to 9 digits (999,999,999 BIF)
            minValue: 100,
            maxValue: 10000000,
            
            // Custom validation messages
            messages: {
                invalidFormat: "Ingano igomba kuba imibare gusa. Oya amanota.",
                tooSmall: "Ingano nto cyane. Igomba kuba BIF 100 cyangwa hejuru.",
                tooLarge: "Ingano ni nini cyane. Igomba kuba BIF 10,000,000 cyangwa hasi.",
                notInteger: "Ingano igomba kuba umubare wuzuye. Oya amanota."
            }
        },
        
        // Currency code validation
        currencyCode: {
            allowed: ["BIF"],
            default: "BIF",
            autoCorrect: false,
            
            messages: {
                invalidCurrency: "Ifaranga ntibishoboka. Gukoresha BIF gusa."
            }
        },
        
        // Exchange rate validation
        exchangeRate: {
            minRate: 0.000001,
            maxRate: 1000000,
            precision: 6,
            
            validation: {
                checkAgainstCentralBank: true,
                maxDeviation: 0.05, // 5% maximum deviation
                updateFrequency: "daily"
            }
        },
        
        // Cross-currency validation (should always fail for BIF)
        crossCurrency: {
            allowed: false,
            message: "Ntushobora guhindura ifaranga. Ukoresha BIF gusa muri Burundi."
        }
    },
    
    // ============================================
    // 7️⃣ DISPLAY & LOCALIZATION
    // ============================================
    display: {
        // Locale-specific formatting
        locales: {
            kirundi: {
                currencySymbol: "FBu",
                decimalSeparator: ",",
                thousandSeparator: ".",
                symbolPosition: "after",
                space: true
            },
            french: {
                currencySymbol: "FBu",
                decimalSeparator: ",",
                thousandSeparator: " ",
                symbolPosition: "after",
                space: true
            },
            english: {
                currencySymbol: "FBu",
                decimalSeparator: ".",
                thousandSeparator: ",",
                symbolPosition: "before",
                space: false
            },
            swahili: {
                currencySymbol: "FBu",
                decimalSeparator: ".",
                thousandSeparator: ",",
                symbolPosition: "before",
                space: true
            }
        },
        
        // Formatting functions
        formatters: {
            formatAmount: (amount, locale = "kirundi") => {
                const localeConfig = BI_CURRENCY_CONFIG.display.locales[locale];
                if (!localeConfig) throw new Error(`Locale '${locale}' not supported`);
                
                // Format number with thousand separators
                const formattedAmount = parseInt(amount).toLocaleString(locale === "kirundi" ? "fr-BI" : locale, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                
                // Apply symbol position
                if (localeConfig.symbolPosition === "before") {
                    return `${localeConfig.currencySymbol}${localeConfig.space ? " " : ""}${formattedAmount}`;
                } else {
                    return `${formattedAmount}${localeConfig.space ? " " : ""}${localeConfig.currencySymbol}`;
                }
            },
            
            formatRange: (min, max, locale = "kirundi") => {
                const formattedMin = BI_CURRENCY_CONFIG.display.formatters.formatAmount(min, locale);
                const formattedMax = BI_CURRENCY_CONFIG.display.formatters.formatAmount(max, locale);
                return `${formattedMin} - ${formattedMax}`;
            },
            
            parseAmount: (formattedAmount, locale = "kirundi") => {
                const localeConfig = BI_CURRENCY_CONFIG.display.locales[locale];
                
                // Remove currency symbol and spaces
                let cleanAmount = formattedAmount
                    .replace(new RegExp(localeConfig.currencySymbol, "g"), "")
                    .replace(/\s/g, "")
                    .replace(new RegExp(`\\${localeConfig.thousandSeparator}`, "g"), "")
                    .replace(new RegExp(`\\${localeConfig.decimalSeparator}`, "g"), ".");
                
                // Parse as integer
                const amount = parseInt(cleanAmount);
                
                if (isNaN(amount)) {
                    throw new Error(`Could not parse amount: ${formattedAmount}`);
                }
                
                return amount;
            }
        },
        
        // Human-readable formats
        humanReadable: {
            small: {
                threshold: 1000,
                format: (amount) => `${amount} FBu`
            },
            medium: {
                threshold: 10000,
                format: (amount) => `${(amount / 1000).toFixed(1)}K FBu`
            },
            large: {
                threshold: 1000000,
                format: (amount) => `${(amount / 1000000).toFixed(2)}M FBu`
            },
            veryLarge: {
                threshold: 10000000,
                format: (amount) => `${(amount / 1000000).toFixed(1)}M FBu`
            }
        },
        
        // Accessibility
        accessibility: {
            screenReaderFormat: "amount Burundian Francs",
            ariaLabels: {
                amount: "Ingano",
                currency: "Ifaranga",
                total: "Igiteranyo"
            }
        }
    },
    
    // ============================================
    // 8️⃣ SECURITY & FRAUD PREVENTION
    // ============================================
    security: {
        // Amount validation security
        amountSecurity: {
            maxAmountPerRequest: 10000000,
            maxTransactionsPerMinute: 10,
            amountPatternValidation: true,
            suspiciousAmountDetection: true
        },
        
        // Rate limiting
        rateLimiting: {
            requestsPerMinute: 60,
            requestsPerHour: 1000,
            requestsPerDay: 10000,
            blockDuration: 3600 // 1 hour
        },
        
        // Fraud detection patterns
        fraudPatterns: [
            {
                pattern: "round_amounts",
                description: "Multiple round amount transactions",
                threshold: 5,
                action: "flag"
            },
            {
                pattern: "rapid_succession",
                description: "Transactions in rapid succession",
                threshold: "3 in 60 seconds",
                action: "block"
            },
            {
                pattern: "just_below_limit",
                description: "Amounts just below limits",
                threshold: "within 1% of limit",
                action: "review"
            }
        ],
        
        // Audit logging
        audit: {
            logAllTransactions: true,
            logAmountChanges: true,
            logRateChanges: true,
            retentionPeriod: "7 years"
        }
    },
    
    // ============================================
    // 9️⃣ API & INTEGRATION
    // ============================================
    api: {
        // Currency conversion API
        conversionApi: {
            endpoint: "/api/bi/currency/convert",
            methods: ["GET"],
            parameters: {
                amount: "required",
                from: "fixed:BIF",
                to: "required",
                date: "optional"
            },
            
            response: {
                success: {
                    amount: 1000,
                    from: "BIF",
                    to: "USD",
                    rate: 0.00051,
                    converted: 0.51,
                    timestamp: "2024-03-15T12:00:00Z"
                },
                error: {
                    code: "INVALID_CURRENCY",
                    message: "Invalid currency code"
                }
            },
            
            rateLimiting: {
                requestsPerMinute: 60,
                requestsPerHour: 1000
            }
        },
        
        // Formatting API
        formattingApi: {
            endpoint: "/api/bi/currency/format",
            methods: ["GET", "POST"],
            parameters: {
                amount: "required",
                locale: "optional",
                format: "optional"
            },
            
            response: {
                success: {
                    amount: 1000,
                    formatted: "1.000 FBu",
                    locale: "kirundi",
                    format: "standard"
                }
            }
        },
        
        // Validation API
        validationApi: {
            endpoint: "/api/bi/currency/validate",
            methods: ["POST"],
            parameters: {
                amount: "required",
                currency: "optional"
            },
            
            response: {
                valid: {
                    isValid: true,
                    amount: 1000,
                    currency: "BIF",
                    message: "Amount is valid"
                },
                invalid: {
                    isValid: false,
                    amount: 1000.5,
                    currency: "BIF",
                    message: "Amount must be an integer",
                    errors: ["Amount must be an integer"]
                }
            }
        }
    },
    
    // ============================================
    // 🔟 ERROR HANDLING & RECOVERY
    // ============================================
    errors: {
        // Common currency errors
        commonErrors: {
            INVALID_AMOUNT: {
                code: "CUR001",
                message: "Ingano ntibishoboka",
                recovery: "Shyiramo umubare wuzuye"
            },
            EXCEEDS_LIMIT: {
                code: "CUR002",
                message: "Ingano irenga umupaka",
                recovery: "Shyiramo ingano nto"
            },
            INVALID_CURRENCY: {
                code: "CUR003",
                message: "Ifaranga ntibishoboka",
                recovery: "Gukoresha BIF gusa"
            },
            RATE_UNAVAILABLE: {
                code: "CUR004",
                message: "Ingano yo guhindura ntibonetse",
                recovery: "Subira nyuma"
            },
            CALCULATION_ERROR: {
                code: "CUR005",
                message: "Ikosa mu kubara",
                recovery: "Gerageza ingano nshya"
            }
        },
        
        // Error recovery strategies
        recovery: {
            autoRetry: true,
            maxRetries: 3,
            fallbackRates: true,
            userNotification: true,
            adminAlert: true
        },
        
        // Error logging
        logging: {
            level: "error",
            includeStack: true,
            includeContext: true,
            sanitizeData: true
        }
    },
    
    // ============================================
    // 1️⃣1️⃣ PERFORMANCE OPTIMIZATION
    // ============================================
    performance: {
        // Caching strategies
        caching: {
            exchangeRates: {
                enabled: true,
                duration: 3600, // 1 hour
                strategy: "memory_first"
            },
            formattedAmounts: {
                enabled: true,
                duration: 86400, // 24 hours
                strategy: "local_storage"
            },
            validationResults: {
                enabled: true,
                duration: 300, // 5 minutes
                strategy: "memory"
            }
        },
        
        // Batch processing
        batching: {
            currencyConversion: {
                enabled: true,
                batchSize: 100,
                timeout: 5000 // 5 seconds
            },
            amountFormatting: {
                enabled: true,
                batchSize: 1000,
                timeout: 10000 // 10 seconds
            }
        },
        
        // Lazy loading
        lazyLoading: {
            exchangeRates: true,
            localeData: true,
            validationRules: true
        }
    },
    
    // ============================================
    // 1️⃣2️⃣ COMPLIANCE & REGULATORY
    // ============================================
    compliance: {
        // Regulatory requirements
        regulatory: {
            centralBankReporting: true,
            reportingThreshold: 2000000, // 2,000,000 BIF
            reportingFrequency: "daily",
            authority: "Bank of the Republic of Burundi"
        },
        
        // Tax compliance
        tax: {
            vatInclusive: true,
            vatRate: 0.18,
            withholdingTax: true,
            withholdingRate: 0.15,
            reporting: "monthly"
        },
        
        // Anti-money laundering
        aml: {
            transactionMonitoring: true,
            threshold: 2000000, // 2,000,000 BIF
            reporting: "suspicious_activity",
            authority: "Financial Intelligence Unit of Burundi"
        },
        
        // Data protection
        dataProtection: {
            encryption: "AES-256",
            masking: true,
            retention: "7 years",
            accessLogs: true
        }
    },
    
    // ============================================
    // 1️⃣3️⃣ VERSION & MAINTENANCE
    // ============================================
    version: {
        currencyVersion: "3.0.0-BI",
        releaseDate: "2024-03-15",
        
        changelog: [
            "Added Kirundi locale support",
            "Enhanced security features",
            "Improved performance caching",
            "Added regulatory compliance",
            "Fixed rounding calculations"
        ],
        
        // Update mechanism
        updates: {
            autoUpdateRates: true,
            notifyOnRateChange: true,
            breakingChanges: false,
            migrationPath: "automatic"
        },
        
        // Deprecation warnings
        deprecated: {
            oldFormatting: {
                deprecatedSince: "2024-01-01",
                removeIn: "2024-07-01",
                alternative: "new formatAmount function"
            }
        },
        
        // Backward compatibility
        backwardCompatibility: {
            maintainOldApis: true,
            conversionLayer: true,
            fallbackFormats: true
        }
    }
};

// ============================================
// CURRENCY VALIDATION & COMPLIANCE CHECK
// ============================================

const validateCurrencyConfig = () => {
    const errors = [];
    
    // Check metadata
    if (BI_CURRENCY_CONFIG.metadata.currencyCode !== "BIF") {
        errors.push("Currency code must be BIF for Burundi");
    }
    
    if (BI_CURRENCY_CONFIG.metadata.decimalDigits !== 0) {
        errors.push("BIF must have 0 decimal digits");
    }
    
    // Check formatting rules
    if (!BI_CURRENCY_CONFIG.formatting.displayFormats.standard.includes("FBu")) {
        errors.push("Standard format must include FBu symbol");
    }
    
    // Check limits are reasonable
    if (BI_CURRENCY_CONFIG.limits.platform.minTransaction < 100) {
        errors.push("Minimum transaction must be at least 100 BIF");
    }
    
    if (BI_CURRENCY_CONFIG.limits.platform.maxTransaction > 10000000) {
        errors.push("Maximum transaction cannot exceed 10,000,000 BIF");
    }
    
    // Check interest calculations
    if (BI_CURRENCY_CONFIG.calculations.interest.rate !== 0.10) {
        errors.push("Interest rate must be 10% (0.10)");
    }
    
    if (BI_CURRENCY_CONFIG.calculations.interest.period !== 7) {
        errors.push("Interest period must be 7 days");
    }
    
    if (BI_CURRENCY_CONFIG.calculations.penalty.rate !== 0.05) {
        errors.push("Penalty rate must be 5% (0.05) daily");
    }
    
    // Check subscription fees match config
    const subscriptionFees = BI_CURRENCY_CONFIG.calculations.subscriptionFees;
    const expectedMonthly = { basic: 50, premium: 250, super: 1000, lenderOfLenders: 500 };
    
    Object.keys(expectedMonthly).forEach(tier => {
        if (subscriptionFees.monthly[tier] !== expectedMonthly[tier]) {
            errors.push(`Monthly fee for ${tier} tier must be ${expectedMonthly[tier]} BIF`);
        }
    });
    
    // Check validation rules
    if (!BI_CURRENCY_CONFIG.validation.amount.regex.test("1000")) {
        errors.push("Amount validation regex should accept integers");
    }
    
    if (BI_CURRENCY_CONFIG.validation.amount.regex.test("1000.5")) {
        errors.push("Amount validation regex should reject decimals");
    }
    
    // Check cross-currency is disabled
    if (BI_CURRENCY_CONFIG.validation.crossCurrency.allowed) {
        errors.push("Cross-currency must be disabled for country isolation");
    }
    
    return errors;
};

// Export currency configuration
module.exports = BI_CURRENCY_CONFIG;

// Export validation function
module.exports.validateCurrency = validateCurrencyConfig;

// Export currency helper functions
module.exports.helpers = {
    // Formatting helpers
    format: {
        amount: (amount, options = {}) => {
            const {
                locale = "kirundi",
                format = "standard",
                includeSymbol = true,
                compact = false
            } = options;
            
            // Validate amount
            if (!BI_CURRENCY_CONFIG.validation.amount.regex.test(amount.toString())) {
                throw new Error(BI_CURRENCY_CONFIG.validation.amount.messages.invalidFormat);
            }
            
            const numAmount = parseInt(amount);
            
            // Check limits
            if (numAmount < BI_CURRENCY_CONFIG.limits.platform.minTransaction) {
                throw new Error(BI_CURRENCY_CONFIG.validation.amount.messages.tooSmall);
            }
            
            if (numAmount > BI_CURRENCY_CONFIG.limits.platform.maxTransaction) {
                throw new Error(BI_CURRENCY_CONFIG.validation.amount.messages.tooLarge);
            }
            
            // Apply compact formatting for large numbers
            if (compact && numAmount >= 10000) {
                const humanReadable = BI_CURRENCY_CONFIG.display.humanReadable;
                
                if (numAmount >= humanReadable.veryLarge.threshold) {
                    return humanReadable.veryLarge.format(numAmount);
                } else if (numAmount >= humanReadable.large.threshold) {
                    return humanReadable.large.format(numAmount);
                } else if (numAmount >= humanReadable.medium.threshold) {
                    return humanReadable.medium.format(numAmount);
                }
            }
            
            // Standard formatting
            const localeConfig = BI_CURRENCY_CONFIG.display.locales[locale];
            if (!localeConfig) {
                throw new Error(`Locale '${locale}' not supported`);
            }
            
            const formattedAmount = numAmount.toLocaleString(
                locale === "kirundi" ? "fr-BI" : locale,
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }
            );
            
            if (!includeSymbol) {
                return formattedAmount;
            }
            
            const symbol = localeConfig.currencySymbol;
            const space = localeConfig.space ? " " : "";
            
            if (localeConfig.symbolPosition === "before") {
                return `${symbol}${space}${formattedAmount}`;
            } else {
                return `${formattedAmount}${space}${symbol}`;
            }
        },
        
        range: (min, max, options = {}) => {
            const formattedMin = module.exports.helpers.format.amount(min, options);
            const formattedMax = module.exports.helpers.format.amount(max, options);
            return `${formattedMin} - ${formattedMax}`;
        },
        
        interest: (principal, days = 7) => {
            const interestRate = BI_CURRENCY_CONFIG.calculations.interest.rate;
            const interest = principal * interestRate;
            return Math.ceil(interest); // Round up to nearest BIF
        },
        
        penalty: (principal, overdueDays) => {
            if (overdueDays <= 7) return 0;
            
            const penaltyRate = BI_CURRENCY_CONFIG.calculations.penalty.rate;
            const penaltyDays = overdueDays - 7;
            const penalty = principal * penaltyRate * penaltyDays;
            return Math.ceil(penalty); // Round up to nearest BIF
        },
        
        totalRepayment: (principal, overdueDays = 0) => {
            const interest = module.exports.helpers.format.interest(principal);
            const penalty = module.exports.helpers.format.penalty(principal, overdueDays);
            return principal + interest + penalty;
        }
    },
    
    // Calculation helpers
    calculate: {
        loanDetails: (principal, overdueDays = 0) => {
            const interest = module.exports.helpers.format.interest(principal);
            const penalty = module.exports.helpers.format.penalty(principal, overdueDays);
            const total = principal + interest + penalty;
            
            return {
                principal,
                interest,
                penalty,
                total,
                breakdown: {
                    principal: { amount: principal, percentage: (principal / total) * 100 },
                    interest: { amount: interest, percentage: (interest / total) * 100 },
                    penalty: { amount: penalty, percentage: (penalty / total) * 100 }
                },
                dailyRepayment: total / 7,
                formatted: {
                    principal: module.exports.helpers.format.amount(principal),
                    interest: module.exports.helpers.format.amount(interest),
                    penalty: module.exports.helpers.format.amount(penalty),
                    total: module.exports.helpers.format.amount(total),
                    daily: module.exports.helpers.format.amount(total / 7)
                }
            };
        },
        
        subscriptionCost: (tier, period = "monthly") => {
            const fees = BI_CURRENCY_CONFIG.calculations.subscriptionFees[period];
            if (!fees || !fees[tier]) {
                throw new Error(`Invalid tier or period: ${tier}, ${period}`);
            }
            
            const amount = fees[tier];
            const vatRate = BI_CURRENCY_CONFIG.calculations.taxes.vat.rate;
            const vatIncluded = BI_CURRENCY_CONFIG.calculations.taxes.vat.included;
            
            let subtotal, vat, total;
            
            if (vatIncluded) {
                total = amount;
                subtotal = total / (1 + vatRate);
                vat = total - subtotal;
            } else {
                subtotal = amount;
                vat = subtotal * vatRate;
                total = subtotal + vat;
            }
            
            return {
                subtotal: Math.ceil(subtotal),
                vat: Math.ceil(vat),
                total: Math.ceil(total),
                formatted: {
                    subtotal: module.exports.helpers.format.amount(Math.ceil(subtotal)),
                    vat: module.exports.helpers.format.amount(Math.ceil(vat)),
                    total: module.exports.helpers.format.amount(Math.ceil(total))
                }
            };
        }
    },
    
    // Validation helpers
    validate: {
        amount: (amount, context = {}) => {
            const errors = [];
            
            // Check if it's a number
            if (isNaN(amount)) {
                errors.push(BI_CURRENCY_CONFIG.validation.amount.messages.invalidFormat);
                return { valid: false, errors };
            }
            
            const numAmount = parseInt(amount);
            
            // Check integer
            if (!Number.isInteger(numAmount)) {
                errors.push(BI_CURRENCY_CONFIG.validation.amount.messages.notInteger);
            }
            
            // Check minimum
            if (numAmount < BI_CURRENCY_CONFIG.limits.platform.minTransaction) {
                errors.push(BI_CURRENCY_CONFIG.validation.amount.messages.tooSmall);
            }
            
            // Check maximum
            if (numAmount > BI_CURRENCY_CONFIG.limits.platform.maxTransaction) {
                errors.push(BI_CURRENCY_CONFIG.validation.amount.messages.tooLarge);
            }
            
            // Check subscription limits if context provided
            if (context.subscriptionTier) {
                const tierLimit = BI_CURRENCY_CONFIG.limits.subscriptionTiers[context.subscriptionTier];
                if (tierLimit && numAmount > tierLimit.weeklyLimit) {
                    errors.push(`Amount exceeds ${context.subscriptionTier} tier limit of ${tierLimit.weeklyLimit} BIF`);
                }
            }
            
            return {
                valid: errors.length === 0,
                errors,
                sanitized: numAmount
            };
        },
        
        currency: (currencyCode) => {
            const allowed = BI_CURRENCY_CONFIG.validation.currencyCode.allowed;
            const isValid = allowed.includes(currencyCode.toUpperCase());
            
            return {
                valid: isValid,
                error: isValid ? null : BI_CURRENCY_CONFIG.validation.currencyCode.messages.invalidCurrency,
                suggested: BI_CURRENCY_CONFIG.validation.currencyCode.default
            };
        }
    },
    
    // Conversion helpers
    convert: {
        toUSD: (bifAmount) => {
            const rate = BI_CURRENCY_CONFIG.exchange.baseRate.USD;
            return bifAmount * rate;
        },
        
        fromUSD: (usdAmount) => {
            const rate = BI_CURRENCY_CONFIG.exchange.baseRate.USD;
            return Math.floor(usdAmount / rate);
        },
        
        formatConverted: (bifAmount, targetCurrency = "USD") => {
            const rate = BI_CURRENCY_CONFIG.exchange.baseRate[targetCurrency];
            if (!rate) {
                throw new Error(`Conversion rate for ${targetCurrency} not available`);
            }
            
            const converted = bifAmount * rate;
            
            return {
                original: {
                    amount: bifAmount,
                    formatted: module.exports.helpers.format.amount(bifAmount),
                    currency: "BIF"
                },
                converted: {
                    amount: converted,
                    currency: targetCurrency,
                    rate: rate
                },
                timestamp: new Date().toISOString()
            };
        }
    }
};

// Export initialization function
module.exports.initializeCurrency = () => {
    const validationErrors = validateCurrencyConfig();
    
    if (validationErrors.length > 0) {
        console.error(`❌ Burundi Currency Configuration Errors:`);
        validationErrors.forEach(error => console.error(`   - ${error}`));
        throw new Error(`Burundi currency configuration invalid: ${validationErrors.join(', ')}`);
    }
    
    console.log(`✅ Burundi Currency Initialized`);
    console.log(`   Currency: ${BI_CURRENCY_CONFIG.metadata.currencyName} (${BI_CURRENCY_CONFIG.metadata.currencyCode})`);
    console.log(`   Decimal Digits: ${BI_CURRENCY_CONFIG.metadata.decimalDigits}`);
    console.log(`   Interest Rate: ${BI_CURRENCY_CONFIG.calculations.interest.rate * 100}% per ${BI_CURRENCY_CONFIG.calculations.interest.period} days`);
    console.log(`   Penalty Rate: ${BI_CURRENCY_CONFIG.calculations.penalty.rate * 100}% daily after ${BI_CURRENCY_CONFIG.calculations.penalty.gracePeriod} days`);
    console.log(`   Version: ${BI_CURRENCY_CONFIG.version.currencyVersion}`);
    
    return {
        status: 'initialized',
        country: 'Burundi',
        currency: BI_CURRENCY_CONFIG.metadata.currencyCode,
        symbol: BI_CURRENCY_CONFIG.metadata.currencySymbol,
        limits: {
            min: BI_CURRENCY_CONFIG.limits.platform.minTransaction,
            max: BI_CURRENCY_CONFIG.limits.platform.maxTransaction
        },
        timestamp: new Date().toISOString(),
        validationChecksum: Buffer.from(JSON.stringify(BI_CURRENCY_CONFIG)).toString('base64').slice(0, 32)
    };
};

// Auto-initialize when imported
if (require.main === module) {
    module.exports.initializeCurrency();
}