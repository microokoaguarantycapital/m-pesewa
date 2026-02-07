/**
 * South Africa (ZA) Currency Module
 * M-Pesewa Country-Specific Currency - South Africa
 * Last Updated: 2026-01-24
 * 
 * CURRENCY HIERARCHY ENFORCEMENT:
 * 1. South African Rand (ZAR) - Primary Currency
 * 2. Exchange Rate Management
 * 3. Currency Conversion Rules
 * 4. Financial Calculations
 */

const ZA_CURRENCY = {
    // ============================================
    // 1. CURRENCY IDENTIFICATION & CONFIGURATION
    // ============================================
    currency: {
        // 1.1. Basic Information
        code: "ZAR",
        symbol: "R",
        name: "South African Rand",
        nativeName: "Suid-Afrikaanse Rand",
        plural: "Rands",
        fractionalUnit: {
            name: "Cent",
            plural: "Cents",
            symbol: "c",
            perUnit: 100
        },

        // 1.2. Formatting Configuration
        formatting: {
            // 1.2.1. Display Format
            display: {
                symbolPosition: "before",
                decimalSeparator: ".",
                thousandsSeparator: ",",
                decimalPlaces: 2,
                spaceBetweenAmountAndSymbol: false,
                examples: {
                    positive: "R 1,234.56",
                    negative: "-R 1,234.56",
                    zero: "R 0.00"
                }
            },

            // 1.2.2. Input Formatting
            input: {
                allowDecimals: true,
                maxDecimals: 2,
                allowNegative: true,
                allowCommas: true,
                autoFormat: true,
                prefix: "R ",
                suffix: ""
            },

            // 1.2.3. Print Formatting
            print: {
                checkWriting: {
                    format: "R ###,###.##",
                    wordsFormat: "Rands ### Cents ###"
                },
                receipt: {
                    currencyLine: "Currency: ZAR (South African Rand)",
                    symbolLine: "Symbol: R"
                }
            }
        },

        // 1.3. Historical & Background
        history: {
            introduced: "1961",
            replaced: "South African Pound",
            decimalization: "1961",
            issuer: "South African Reserve Bank",
            mint: "South African Mint",
            securityFeatures: [
                "Watermark: Nelson Mandela",
                "Security thread",
                "See-through registration device",
                "Microprinting",
                "UV features",
                "Raised printing"
            ],
            denominations: {
                coins: ["10c", "20c", "50c", "R1", "R2", "R5"],
                notes: ["R10", "R20", "R50", "R100", "R200"]
            }
        }
    },

    // ============================================
    // 2. EXCHANGE RATE MANAGEMENT
    // ============================================
    exchange: {
        // 2.1. Primary Exchange Rates
        rates: {
            USD: {
                buy: 0.053,
                sell: 0.052,
                middle: 0.0525,
                lastUpdated: "2026-01-24T10:00:00Z",
                source: "South African Reserve Bank",
                volatility: "Low"
            },
            EUR: {
                buy: 0.049,
                sell: 0.048,
                middle: 0.0485,
                lastUpdated: "2026-01-24T10:00:00Z",
                source: "SARB",
                volatility: "Low"
            },
            GBP: {
                buy: 0.043,
                sell: 0.042,
                middle: 0.0425,
                lastUpdated: "2026-01-24T10:00:00Z",
                source: "SARB",
                volatility: "Medium"
            },
            KES: {
                buy: 7.85,
                sell: 7.75,
                middle: 7.80,
                lastUpdated: "2026-01-24T10:00:00Z",
                source: "Commercial Banks",
                volatility: "High"
            },
            // Other African Currencies
            NGN: { middle: 85.50, volatility: "High" },
            GHS: { middle: 0.82, volatility: "Medium" },
            ETB: { middle: 3.05, volatility: "High" },
            TZS: { middle: 135.00, volatility: "Medium" },
            UGX: { middle: 205.00, volatility: "High" },
            RWF: { middle: 68.50, volatility: "Medium" }
        },

        // 2.2. Exchange Rate Configuration
        configuration: {
            updateFrequency: "Daily",
            primarySource: "South African Reserve Bank",
            secondarySource: "Commercial Banks Average",
            fallbackSource: "XE.com API",
            rateType: "Middle Rate",
            spread: {
                buySell: 0.001, // 0.1% spread
                minSpread: 0.0005,
                maxSpread: 0.002
            },
            rounding: {
                amount: 2,
                rate: 4
            }
        },

        // 2.3. Historical Exchange Rates (Sample)
        historical: {
            "2025-12-01": { USD: 0.052, EUR: 0.048, GBP: 0.042 },
            "2025-11-01": { USD: 0.051, EUR: 0.047, GBP: 0.041 },
            "2025-10-01": { USD: 0.053, EUR: 0.049, GBP: 0.043 },
            "2025-09-01": { USD: 0.054, EUR: 0.050, GBP: 0.044 }
        }
    },

    // ============================================
    // 3. CURRENCY CONVERSION RULES
    // ============================================
    conversion: {
        // 3.1. Conversion Rules
        rules: {
            // 3.1.1. Platform Rules
            platform: {
                crossCurrencyConversion: false,
                automaticConversion: false,
                manualConversionRequired: true,
                conversionFee: 0, // No conversion on platform
                minimumConversionAmount: 0,
                maximumConversionAmount: 0
            },

            // 3.1.2. User Rules
            user: {
                canSetPreferredCurrency: false,
                canViewOtherCurrencies: true,
                canConvertForReporting: true,
                mustAcceptExchangeRisk: true
            },

            // 3.1.3. Business Rules
            business: {
                useSARBRates: true,
                includeBankFees: false,
                includePlatformMargin: false,
                roundToNearestCent: true
            }
        },

        // 3.2. Conversion Methods
        methods: {
            bankTransfer: {
                enabled: true,
                fee: "1.5% + R20",
                timeframe: "1-3 business days",
                limits: {
                    min: "R100",
                    max: "R1,000,000"
                }
            },
            forexBureau: {
                enabled: true,
                fee: "2-3%",
                timeframe: "Same day",
                documentation: ["ID", "Proof of residence", "Source of funds"]
            },
            digitalPlatform: {
                enabled: false, // Not allowed on M-Pesewa
                reason: "Cross-currency lending prohibited"
            }
        },

        // 3.3. Conversion Formulas
        formulas: {
            // Convert from ZAR to another currency
            fromZAR: (amount, rate) => {
                return amount * rate;
            },
            
            // Convert to ZAR from another currency
            toZAR: (amount, rate) => {
                return amount / rate;
            },
            
            // Calculate spread
            withSpread: (amount, buyRate, sellRate, isBuying) => {
                return isBuying ? amount * buyRate : amount * sellRate;
            },
            
            // Calculate conversion fee
            calculateFee: (amount, feePercentage, fixedFee) => {
                return (amount * feePercentage / 100) + fixedFee;
            }
        }
    },

    // ============================================
    // 4. FINANCIAL CALCULATIONS
    // ============================================
    calculations: {
        // 4.1. Loan Calculations
        loan: {
            // 4.1.1. Interest Calculation
            interest: {
                weeklyRate: 0.10, // 10%
                dailyRate: 0.10 / 7,
                monthlyRate: 0.10 * (30/7), // Approximate
                annualRate: 0.10 * 52,
                compounding: "Simple",
                calculationMethod: "Flat Rate"
            },

            // 4.1.2. Penalty Calculation
            penalty: {
                dailyRate: 0.05, // 5% daily after 7 days
                maximumPenalty: 1.00, // 100% of principal
                gracePeriod: 7, // Days
                calculationMethod: "On Outstanding Balance"
            },

            // 4.1.3. Repayment Calculation
            repayment: {
                minimumDaily: 0.01, // 1% of total
                maximumInstallments: 7, // Daily for 7 days
                partialPaymentsAllowed: true,
                earlyRepaymentDiscount: 0, // No discount
                latePaymentFee: "5% daily on outstanding"
            }
        },

        // 4.2. Subscription Calculations
        subscription: {
            // 4.2.1. Tier Calculations
            tiers: {
                basic: {
                    monthly: 50,
                    biAnnual: 250,
                    annual: 500,
                    vatIncluded: true,
                    vatRate: 0.15
                },
                premium: {
                    monthly: 250,
                    biAnnual: 1500,
                    annual: 2500,
                    vatIncluded: true
                },
                super: {
                    monthly: 1000,
                    biAnnual: 5000,
                    annual: 8500,
                    vatIncluded: true
                },
                lenderOfLenders: {
                    monthly: 500,
                    biAnnual: 3500,
                    annual: 6500,
                    vatIncluded: true
                }
            },

            // 4.2.2. Proration Rules
            proration: {
                enabled: true,
                method: "Daily Proration",
                roundToNearestDay: true,
                minimumCharge: "R10"
            },

            // 4.2.3. Discounts & Promotions
            discounts: {
                annualDiscount: 0.10, // 10% discount for annual
                referralCredit: "R100",
                loyaltyMultiplier: 0.05 // 5% for each year
            }
        },

        // 4.3. Tax Calculations
        tax: {
            // 4.3.1. VAT Calculations
            vat: {
                rate: 0.15, // 15%
                inclusive: true,
                calculation: {
                    // Calculate VAT amount from inclusive price
                    fromInclusive: (amount) => {
                        return amount - (amount / 1.15);
                    },
                    // Calculate exclusive price from inclusive
                    toExclusive: (amount) => {
                        return amount / 1.15;
                    },
                    // Calculate inclusive price from exclusive
                    toInclusive: (amount) => {
                        return amount * 1.15;
                    }
                }
            },

            // 4.3.2. Income Tax
            incomeTax: {
                brackets: [
                    { threshold: 0, rate: 0.18 },
                    { threshold: 205900, rate: 0.26 },
                    { threshold: 321600, rate: 0.31 },
                    { threshold: 445100, rate: 0.36 },
                    { threshold: 584200, rate: 0.39 },
                    { threshold: 744800, rate: 0.41 },
                    { threshold: 1577300, rate: 0.45 }
                ],
                rebates: {
                    primary: 15714,
                    secondary: 8613,
                    tertiary: 2871
                }
            },

            // 4.3.3. Withholding Tax
            withholding: {
                interest: {
                    rate: 0.15, // 15% for non-residents
                    threshold: "R23,800",
                    exemption: "South African residents"
                },
                dividends: {
                    rate: 0.20, // 20%
                    dtas: "Double Taxation Agreements apply"
                }
            }
        },

        // 4.4. Fee Calculations
        fees: {
            // 4.4.1. Platform Fees
            platform: {
                registration: 0,
                verification: 0,
                accountMaintenance: 0,
                statementRequest: "R50 per statement",
                latePaymentProcessing: "R100"
            },

            // 4.4.2. Transaction Fees
            transaction: {
                deposit: {
                    bankTransfer: 0,
                    creditCard: "2.9% + R2",
                    debitCard: "1.5% + R1",
                    eWallet: "R5"
                },
                withdrawal: {
                    bankTransfer: "R20",
                    instantTransfer: "R30",
                    eWallet: "R10"
                },
                loanProcessing: 0,
                repaymentProcessing: 0
            },

            // 4.4.3. Penalty Fees
            penalties: {
                dishonoredPayment: "R250",
                failedDirectDebit: "R50",
                accountInactivity: "R100/month after 12 months"
            }
        }
    },

    // ============================================
    // 5. CURRENCY VALIDATION & SANITIZATION
    // ============================================
    validation: {
        // 5.1. Amount Validation
        amount: {
            // 5.1.1. Loan Amount Validation
            loan: {
                min: 5, // R5 minimum
                max: 50000, // R50,000 maximum
                increments: 5, // R5 increments
                tierLimits: {
                    basic: 1500,
                    premium: 5000,
                    super: 20000,
                    lenderOfLenders: 50000
                }
            },

            // 5.1.2. Subscription Amount Validation
            subscription: {
                min: 10, // R10 minimum
                max: 10000, // R10,000 maximum
                validAmounts: [50, 250, 500, 1000, 1500, 2500, 3500, 5000, 6500, 8500]
            },

            // 5.1.3. Transfer Amount Validation
            transfer: {
                min: 1, // R1 minimum
                max: 1000000, // R1,000,000 maximum
                dailyLimit: 100000, // R100,000 daily
                monthlyLimit: 500000 // R500,000 monthly
            }
        },

        // 5.2. Format Validation
        format: {
            // 5.2.1. Input Format Validation
            input: {
                regex: /^R?\s?\d{1,3}(,\d{3})*(\.\d{2})?$/,
                testCases: {
                    valid: ["R100", "R 1,000.50", "1000", "1,000.00"],
                    invalid: ["1000.0", "1.000,00", "$100", "100.123"]
                }
            },

            // 5.2.2. Display Format Validation
            display: {
                requiredFormat: "R #,##0.00",
                decimalPlaces: 2,
                thousandSeparator: ",",
                decimalSeparator: ".",
                negativeFormat: "-R #,##0.00"
            },

            // 5.2.3. Database Storage Format
            storage: {
                type: "DECIMAL(15,2)",
                precision: 15,
                scale: 2,
                allowNull: false,
                defaultValue: 0.00
            }
        },

        // 5.3. Business Rule Validation
        business: {
            // 5.3.1. Loan Business Rules
            loan: {
                mustBeMultipleOf: 5,
                mustBeWithinTierLimit: true,
                mustLeaveMinimumBalance: 100, // R100 minimum balance
                mustNotExceedDebtToIncome: 0.5 // 50% maximum
            },

            // 5.3.2. Subscription Business Rules
            subscription: {
                mustBePaidInAdvance: true,
                mustCoverFullPeriod: true,
                noPartialRefunds: true,
                autoRenewalDefault: true
            },

            // 5.3.3. Transfer Business Rules
            transfer: {
                sourceMustHaveSufficientFunds: true,
                destinationMustBeVerified: true,
                mustNotExceedDailyLimit: true,
                mustNotBeSuspicious: true
            }
        }
    },

    // ============================================
    // 6. CURRENCY FORMATTING FUNCTIONS
    // ============================================
    formatting: {
        // 6.1. Basic Formatting Functions
        basic: {
            // Format amount with currency symbol
            format: (amount, options = {}) => {
                const {
                    decimalPlaces = 2,
                    showSymbol = true,
                    showCents = true,
                    locale = 'en-ZA'
                } = options;

                let formatted = new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: 'ZAR',
                    minimumFractionDigits: showCents ? decimalPlaces : 0,
                    maximumFractionDigits: decimalPlaces
                }).format(amount);

                if (!showSymbol) {
                    formatted = formatted.replace('R', '').trim();
                }

                return formatted;
            },

            // Parse formatted string to number
            parse: (formattedString) => {
                if (!formattedString) return 0;
                
                // Remove currency symbol, spaces, and thousands separators
                const cleaned = formattedString
                    .replace(/R/g, '')
                    .replace(/\s/g, '')
                    .replace(/,/g, '')
                    .trim();
                
                return parseFloat(cleaned) || 0;
            },

            // Round to nearest cent
            round: (amount, decimalPlaces = 2) => {
                const multiplier = Math.pow(10, decimalPlaces);
                return Math.round(amount * multiplier) / multiplier;
            }
        },

        // 6.2. Advanced Formatting Functions
        advanced: {
            // Format for display in tables
            tableFormat: (amount) => {
                return ZA_CURRENCY.formatting.basic.format(amount, {
                    showSymbol: false,
                    decimalPlaces: 2
                });
            },

            // Format for input fields
            inputFormat: (amount) => {
                if (amount === 0) return '';
                return ZA_CURRENCY.formatting.basic.format(amount, {
                    showSymbol: true,
                    decimalPlaces: 2
                });
            },

            // Format for printing/receipts
            printFormat: (amount) => {
                const formatted = ZA_CURRENCY.formatting.basic.format(amount, {
                    showSymbol: true,
                    decimalPlaces: 2
                });
                return `*** ${formatted} ***`;
            },

            // Format in words (for checks/legal documents)
            wordsFormat: (amount) => {
                const rands = Math.floor(amount);
                const cents = Math.round((amount - rands) * 100);
                
                const randsWords = numberToWords(rands);
                const centsWords = numberToWords(cents);
                
                let result = `${randsWords} Rands`;
                if (cents > 0) {
                    result += ` and ${centsWords} Cents`;
                }
                
                return result + ' only';
            }
        },

        // 6.3. Specialized Formatting
        specialized: {
            // Format for loan display
            loanFormat: (principal, interest, total) => {
                return {
                    principal: ZA_CURRENCY.formatting.basic.format(principal),
                    interest: ZA_CURRENCY.formatting.basic.format(interest),
                    total: ZA_CURRENCY.formatting.basic.format(total),
                    breakdown: `R${principal.toFixed(2)} + R${interest.toFixed(2)} interest`
                };
            },

            // Format for subscription display
            subscriptionFormat: (amount, period) => {
                const formatted = ZA_CURRENCY.formatting.basic.format(amount);
                return {
                    amount: formatted,
                    period: period,
                    vatIncluded: true,
                    vatAmount: ZA_CURRENCY.formatting.basic.format(amount - (amount / 1.15))
                };
            },

            // Format for penalty display
            penaltyFormat: (amount, daysOverdue) => {
                const penalty = amount * 0.05 * daysOverdue;
                return {
                    original: ZA_CURRENCY.formatting.basic.format(amount),
                    penalty: ZA_CURRENCY.formatting.basic.format(penalty),
                    total: ZA_CURRENCY.formatting.basic.format(amount + penalty),
                    dailyRate: "5%"
                };
            }
        }
    },

    // ============================================
    // 7. CURRENCY CONVERSION FUNCTIONS
    // ============================================
    conversionFunctions: {
        // 7.1. Basic Conversion Functions
        basic: {
            // Convert ZAR to another currency
            convertFromZAR: (amount, targetCurrency, rateType = 'middle') => {
                const rate = ZA_CURRENCY.exchange.rates[targetCurrency]?.[rateType];
                if (!rate) {
                    throw new Error(`Exchange rate for ${targetCurrency} not available`);
                }
                
                const converted = amount * rate;
                return ZA_CURRENCY.formatting.basic.round(converted, 2);
            },

            // Convert to ZAR from another currency
            convertToZAR: (amount, sourceCurrency, rateType = 'middle') => {
                const rate = ZA_CURRENCY.exchange.rates[sourceCurrency]?.[rateType];
                if (!rate) {
                    throw new Error(`Exchange rate for ${sourceCurrency} not available`);
                }
                
                const converted = amount / rate;
                return ZA_CURRENCY.formatting.basic.round(converted, 2);
            },

            // Get exchange rate
            getRate: (currency, rateType = 'middle') => {
                return ZA_CURRENCY.exchange.rates[currency]?.[rateType] || null;
            }
        },

        // 7.2. Advanced Conversion Functions
        advanced: {
            // Convert with spread (buy/sell rates)
            convertWithSpread: (amount, currency, isBuying) => {
                const rates = ZA_CURRENCY.exchange.rates[currency];
                if (!rates) {
                    throw new Error(`Exchange rates for ${currency} not available`);
                }
                
                const rate = isBuying ? rates.buy : rates.sell;
                return amount * rate;
            },

            // Convert with fees
            convertWithFees: (amount, currency, feePercentage = 0, fixedFee = 0) => {
                const converted = ZA_CURRENCY.conversionFunctions.basic.convertFromZAR(amount, currency);
                const fee = (converted * feePercentage / 100) + fixedFee;
                return {
                    gross: converted,
                    fee: fee,
                    net: converted - fee
                };
            },

            // Calculate conversion cost comparison
            compareConversionMethods: (amount, currency) => {
                const methods = [];
                
                // Bank transfer
                const bankRate = ZA_CURRENCY.exchange.rates[currency]?.middle || 0;
                const bankFee = amount * 0.015 + 20; // 1.5% + R20
                methods.push({
                    method: 'Bank Transfer',
                    rate: bankRate,
                    fee: bankFee,
                    total: (amount * bankRate) - bankFee,
                    timeframe: '1-3 business days'
                });
                
                // Forex bureau
                const forexRate = bankRate * 0.98; // 2% worse rate
                const forexFee = amount * 0.02; // 2% fee
                methods.push({
                    method: 'Forex Bureau',
                    rate: forexRate,
                    fee: forexFee,
                    total: (amount * forexRate) - forexFee,
                    timeframe: 'Same day'
                });
                
                return methods;
            }
        },

        // 7.3. Historical Conversion Functions
        historical: {
            // Convert using historical rate
            convertHistorical: (amount, currency, date) => {
                const historicalRate = ZA_CURRENCY.exchange.historical[date]?.[currency];
                if (!historicalRate) {
                    throw new Error(`Historical rate for ${currency} on ${date} not available`);
                }
                
                return amount * historicalRate;
            },

            // Calculate historical value
            calculateHistoricalValue: (amount, fromDate, toDate, currency) => {
                const fromRate = ZA_CURRENCY.exchange.historical[fromDate]?.[currency];
                const toRate = ZA_CURRENCY.exchange.historical[toDate]?.[currency];
                
                if (!fromRate || !toRate) {
                    throw new Error(`Historical rates not available for the specified dates`);
                }
                
                const valueAtFromDate = amount / fromRate;
                const valueAtToDate = valueAtFromDate * toRate;
                
                return {
                    original: amount,
                    valueAtFromDate: valueAtFromDate,
                    valueAtToDate: valueAtToDate,
                    change: valueAtToDate - amount,
                    percentageChange: ((valueAtToDate - amount) / amount) * 100
                };
            }
        }
    },

    // ============================================
    // 8. FINANCIAL CALCULATION FUNCTIONS
    // ============================================
    financialFunctions: {
        // 8.1. Loan Calculation Functions
        loan: {
            // Calculate loan repayment
            calculateRepayment: (principal, interestRate = 0.10, termDays = 7) => {
                const interest = principal * interestRate;
                const total = principal + interest;
                const dailyRepayment = total / termDays;
                
                return {
                    principal: ZA_CURRENCY.formatting.basic.round(principal, 2),
                    interest: ZA_CURRENCY.formatting.basic.round(interest, 2),
                    total: ZA_CURRENCY.formatting.basic.round(total, 2),
                    dailyRepayment: ZA_CURRENCY.formatting.basic.round(dailyRepayment, 2),
                    termDays: termDays,
                    interestRate: interestRate * 100
                };
            },

            // Calculate penalty
            calculatePenalty: (outstandingBalance, daysOverdue) => {
                const dailyPenaltyRate = 0.05; // 5% daily
                const maxPenalty = outstandingBalance; // 100% maximum
                
                let penalty = 0;
                for (let i = 0; i < daysOverdue; i++) {
                    const dailyPenalty = outstandingBalance * dailyPenaltyRate;
                    penalty += dailyPenalty;
                    outstandingBalance += dailyPenalty;
                    
                    // Cap at 100% of original
                    if (penalty > maxPenalty) {
                        penalty = maxPenalty;
                        break;
                    }
                }
                
                return {
                    penalty: ZA_CURRENCY.formatting.basic.round(penalty, 2),
                    newTotal: ZA_CURRENCY.formatting.basic.round(outstandingBalance + penalty, 2),
                    dailyRate: "5%",
                    daysOverdue: daysOverdue
                };
            },

            // Calculate affordability
            calculateAffordability: (monthlyIncome, monthlyExpenses, existingDebt) => {
                const disposableIncome = monthlyIncome - monthlyExpenses;
                const maxDebtService = disposableIncome * 0.4; // 40% rule
                const availableForNewDebt = maxDebtService - existingDebt;
                
                return {
                    disposableIncome: ZA_CURRENCY.formatting.basic.round(disposableIncome, 2),
                    maxDebtService: ZA_CURRENCY.formatting.basic.round(maxDebtService, 2),
                    availableForNewDebt: ZA_CURRENCY.formatting.basic.round(Math.max(0, availableForNewDebt), 2),
                    debtToIncomeRatio: ((existingDebt / monthlyIncome) * 100).toFixed(2) + '%'
                };
            }
        },

        // 8.2. Subscription Calculation Functions
        subscription: {
            // Calculate subscription cost
            calculateSubscription: (tier, period) => {
                const tierConfig = ZA_CURRENCY.calculations.subscription.tiers[tier];
                if (!tierConfig) {
                    throw new Error(`Tier ${tier} not found`);
                }
                
                const amount = tierConfig[period];
                if (!amount) {
                    throw new Error(`Period ${period} not available for tier ${tier}`);
                }
                
                const vatAmount = amount - (amount / 1.15);
                const netAmount = amount - vatAmount;
                
                return {
                    tier: tier,
                    period: period,
                    grossAmount: ZA_CURRENCY.formatting.basic.round(amount, 2),
                    netAmount: ZA_CURRENCY.formatting.basic.round(netAmount, 2),
                    vatAmount: ZA_CURRENCY.formatting.basic.round(vatAmount, 2),
                    vatRate: "15%",
                    vatIncluded: true
                };
            },

            // Calculate prorated subscription
            calculateProrated: (tier, daysRemaining, daysInMonth = 30) => {
                const monthlyRate = ZA_CURRENCY.calculations.subscription.tiers[tier]?.monthly;
                if (!monthlyRate) {
                    throw new Error(`Monthly rate for tier ${tier} not found`);
                }
                
                const dailyRate = monthlyRate / daysInMonth;
                const proratedAmount = dailyRate * daysRemaining;
                const minimumCharge = 10; // R10 minimum
                
                const finalAmount = Math.max(proratedAmount, minimumCharge);
                
                return {
                    tier: tier,
                    daysRemaining: daysRemaining,
                    dailyRate: ZA_CURRENCY.formatting.basic.round(dailyRate, 2),
                    proratedAmount: ZA_CURRENCY.formatting.basic.round(proratedAmount, 2),
                    finalAmount: ZA_CURRENCY.formatting.basic.round(finalAmount, 2),
                    minimumCharge: ZA_CURRENCY.formatting.basic.round(minimumCharge, 2)
                };
            }
        },

        // 8.3. Tax Calculation Functions
        tax: {
            // Calculate VAT
            calculateVAT: (amount, isInclusive = true) => {
                if (isInclusive) {
                    const vatAmount = amount - (amount / 1.15);
                    const netAmount = amount - vatAmount;
                    
                    return {
                        gross: ZA_CURRENCY.formatting.basic.round(amount, 2),
                        net: ZA_CURRENCY.formatting.basic.round(netAmount, 2),
                        vat: ZA_CURRENCY.formatting.basic.round(vatAmount, 2),
                        vatRate: "15%",
                        inclusive: true
                    };
                } else {
                    const vatAmount = amount * 0.15;
                    const grossAmount = amount + vatAmount;
                    
                    return {
                        net: ZA_CURRENCY.formatting.basic.round(amount, 2),
                        vat: ZA_CURRENCY.formatting.basic.round(vatAmount, 2),
                        gross: ZA_CURRENCY.formatting.basic.round(grossAmount, 2),
                        vatRate: "15%",
                        inclusive: false
                    };
                }
            },

            // Calculate income tax
            calculateIncomeTax: (annualIncome) => {
                const brackets = ZA_CURRENCY.calculations.tax.incomeTax.brackets;
                let tax = 0;
                let remainingIncome = annualIncome;
                
                for (let i = brackets.length - 1; i >= 0; i--) {
                    const bracket = brackets[i];
                    if (annualIncome > bracket.threshold) {
                        const taxableInBracket = remainingIncome - bracket.threshold;
                        tax += taxableInBracket * bracket.rate;
                        remainingIncome = bracket.threshold;
                    }
                }
                
                // Apply rebates
                const rebates = ZA_CURRENCY.calculations.tax.incomeTax.rebates;
                const totalRebates = rebates.primary + rebates.secondary + rebates.tertiary;
                tax = Math.max(0, tax - totalRebates);
                
                return {
                    annualIncome: ZA_CURRENCY.formatting.basic.round(annualIncome, 2),
                    taxLiability: ZA_CURRENCY.formatting.basic.round(tax, 2),
                    effectiveRate: ((tax / annualIncome) * 100).toFixed(2) + '%',
                    monthlyTax: ZA_CURRENCY.formatting.basic.round(tax / 12, 2)
                };
            }
        }
    },

    // ============================================
    // 9. ERROR HANDLING & VALIDATION FUNCTIONS
    // ============================================
    errorHandling: {
        // 9.1. Validation Functions
        validate: {
            // Validate amount
            amount: (amount, type = 'loan') => {
                const config = ZA_CURRENCY.validation.amount[type];
                if (!config) {
                    return { valid: false, error: `Validation config for ${type} not found` };
                }
                
                if (amount < config.min) {
                    return {
                        valid: false,
                        error: `Amount too low. Minimum ${ZA_CURRENCY.formatting.basic.format(config.min)}`
                    };
                }
                
                if (amount > config.max) {
                    return {
                        valid: false,
                        error: `Amount too high. Maximum ${ZA_CURRENCY.formatting.basic.format(config.max)}`
                    };
                }
                
                if (config.increments && amount % config.increments !== 0) {
                    return {
                        valid: false,
                        error: `Amount must be in increments of ${ZA_CURRENCY.formatting.basic.format(config.increments)}`
                    };
                }
                
                return { valid: true, message: 'Amount validated successfully' };
            },

            // Validate format
            format: (input) => {
                const regex = ZA_CURRENCY.validation.format.input.regex;
                if (!regex.test(input)) {
                    return {
                        valid: false,
                        error: 'Invalid format. Use format: R 1,000.00',
                        examples: ZA_CURRENCY.validation.format.input.testCases.valid
                    };
                }
                
                return { valid: true, message: 'Format validated successfully' };
            },

            // Validate currency code
            currencyCode: (code) => {
                const validCodes = Object.keys(ZA_CURRENCY.exchange.rates);
                if (!validCodes.includes(code)) {
                    return {
                        valid: false,
                        error: `Invalid currency code. Valid codes: ${validCodes.join(', ')}`,
                        supported: validCodes
                    };
                }
                
                return { valid: true, message: 'Currency code validated' };
            }
        },

        // 9.2. Error Messages
        errors: {
            insufficientFunds: (available, required) => ({
                code: 'INSUFFICIENT_FUNDS',
                message: `Insufficient funds. Available: ${ZA_CURRENCY.formatting.basic.format(available)}, Required: ${ZA_CURRENCY.formatting.basic.format(required)}`,
                available: available,
                required: required,
                shortfall: required - available
            }),
            
            invalidAmount: (amount, reason) => ({
                code: 'INVALID_AMOUNT',
                message: `Invalid amount: ${ZA_CURRENCY.formatting.basic.format(amount)}. ${reason}`,
                amount: amount,
                reason: reason
            }),
            
            rateUnavailable: (currency, date = null) => ({
                code: 'RATE_UNAVAILABLE',
                message: date 
                    ? `Exchange rate for ${currency} on ${date} not available`
                    : `Exchange rate for ${currency} not available`,
                currency: currency,
                date: date
            }),
            
            conversionNotAllowed: () => ({
                code: 'CONVERSION_NOT_ALLOWED',
                message: 'Currency conversion is not allowed on this platform',
                reason: 'Cross-currency lending prohibited'
            })
        },

        // 9.3. Recovery Functions
        recovery: {
            // Try to recover from format error
            recoverFormat: (input) => {
                try {
                    // Remove all non-numeric characters except decimal point
                    const cleaned = input.replace(/[^0-9.]/g, '');
                    const parsed = parseFloat(cleaned);
                    
                    if (isNaN(parsed)) {
                        throw new Error('Could not parse number');
                    }
                    
                    return {
                        success: true,
                        original: input,
                        recovered: parsed,
                        formatted: ZA_CURRENCY.formatting.basic.format(parsed)
                    };
                } catch (error) {
                    return {
                        success: false,
                        original: input,
                        error: error.message
                    };
                }
            },

            // Suggest correct amount based on validation rules
            suggestAmount: (amount, type = 'loan') => {
                const config = ZA_CURRENCY.validation.amount[type];
                if (!config) return null;
                
                let suggested = amount;
                
                // Ensure minimum
                if (suggested < config.min) {
                    suggested = config.min;
                }
                
                // Ensure maximum
                if (suggested > config.max) {
                    suggested = config.max;
                }
                
                // Round to increments
                if (config.increments) {
                    suggested = Math.round(suggested / config.increments) * config.increments;
                }
                
                return {
                    original: amount,
                    suggested: suggested,
                    formatted: ZA_CURRENCY.formatting.basic.format(suggested),
                    difference: suggested - amount
                };
            }
        }
    },

    // ============================================
    // 10. UTILITY FUNCTIONS
    // ============================================
    utilities: {
        // 10.1. Number to words (for amount in words)
        numberToWords: (num) => {
            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            
            if (num === 0) return 'Zero';
            
            const convert = (n) => {
                if (n < 10) return ones[n];
                if (n < 20) return teens[n - 10];
                if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
                if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
                
                const scales = ['', 'Thousand', 'Million', 'Billion'];
                let result = '';
                
                for (let i = 0; n > 0; i++) {
                    if (n % 1000 !== 0) {
                        result = convert(n % 1000) + (scales[i] ? ' ' + scales[i] + ' ' : '') + result;
                    }
                    n = Math.floor(n / 1000);
                }
                
                return result.trim();
            };
            
            return convert(num);
        },

        // 10.2. Generate currency selector options
        generateCurrencyOptions: (selected = 'ZAR') => {
            const currencies = {
                'ZAR': { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
                'USD': { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
                'EUR': { name: 'Euro', symbol: '€', flag: '🇪🇺' },
                'GBP': { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
                'KES': { name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' }
            };
            
            return Object.entries(currencies).map(([code, info]) => ({
                value: code,
                label: `${info.flag} ${code} - ${info.name} (${info.symbol})`,
                selected: code === selected,
                disabled: code !== 'ZAR' // Only ZAR enabled for lending/borrowing
            }));
        },

        // 10.3. Generate test data
        generateTestData: () => {
            return {
                amounts: [50, 100, 500, 1000, 5000, 10000, 50000],
                formatted: ZA_CURRENCY.formatting.basic.format(1234.56),
                exchangeRates: ZA_CURRENCY.exchange.rates,
                loanExample: ZA_CURRENCY.financialFunctions.loan.calculateRepayment(1000),
                subscriptionExample: ZA_CURRENCY.financialFunctions.subscription.calculateSubscription('basic', 'monthly'),
                taxExample: ZA_CURRENCY.financialFunctions.tax.calculateVAT(1000)
            };
        },

        // 10.4. Currency comparison
        compareWithOtherCurrencies: (amount) => {
            const comparisons = [];
            const currencies = ['USD', 'EUR', 'GBP', 'KES'];
            
            currencies.forEach(currency => {
                const rate = ZA_CURRENCY.exchange.rates[currency]?.middle;
                if (rate) {
                    const converted = amount * rate;
                    comparisons.push({
                        currency: currency,
                        amount: converted,
                        formatted: new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: currency
                        }).format(converted),
                        rate: rate,
                        perOneZAR: 1 / rate
                    });
                }
            });
            
            return comparisons;
        }
    }
};

// ============================================
// HELPER FUNCTIONS (Internal Use)
// ============================================

/**
 * Internal: Convert number to words (used by formatting functions)
 * @param {number} num - Number to convert
 * @returns {string} Number in words
 */
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    const convert = (n) => {
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
        
        const scales = ['', 'Thousand', 'Million', 'Billion'];
        let result = '';
        
        for (let i = 0; n > 0; i++) {
            if (n % 1000 !== 0) {
                result = convert(n % 1000) + (scales[i] ? ' ' + scales[i] + ' ' : '') + result;
            }
            n = Math.floor(n / 1000);
        }
        
        return result.trim();
    };
    
    return convert(num);
}

/**
 * Internal: Validate configuration
 * @throws {Error} If configuration is invalid
 */
function validateCurrencyConfig() {
    // Validate currency code
    if (!ZA_CURRENCY.currency.code || ZA_CURRENCY.currency.code !== 'ZAR') {
        throw new Error('Invalid currency code. Must be ZAR for South Africa');
    }
    
    // Validate exchange rates
    const requiredRates = ['USD', 'EUR', 'GBP'];
    requiredRates.forEach(currency => {
        if (!ZA_CURRENCY.exchange.rates[currency]) {
            throw new Error(`Missing exchange rate for ${currency}`);
        }
    });
    
    // Validate formatting configuration
    if (!ZA_CURRENCY.formatting.basic.format) {
        throw new Error('Missing basic formatting function');
    }
    
    // Validate calculation functions
    if (!ZA_CURRENCY.financialFunctions.loan.calculateRepayment) {
        throw new Error('Missing loan calculation function');
    }
    
    return true;
}

// ============================================
// EXPORT MODULE
// ============================================

export default {
    // Main Configuration
    config: ZA_CURRENCY,
    
    // Validation
    validateConfig: validateCurrencyConfig,
    
    // Formatting Functions
    format: ZA_CURRENCY.formatting.basic.format,
    parse: ZA_CURRENCY.formatting.basic.parse,
    round: ZA_CURRENCY.formatting.basic.round,
    
    // Conversion Functions
    convertFromZAR: ZA_CURRENCY.conversionFunctions.basic.convertFromZAR,
    convertToZAR: ZA_CURRENCY.conversionFunctions.basic.convertToZAR,
    getExchangeRate: ZA_CURRENCY.conversionFunctions.basic.getRate,
    
    // Financial Functions
    calculateLoanRepayment: ZA_CURRENCY.financialFunctions.loan.calculateRepayment,
    calculateLoanPenalty: ZA_CURRENCY.financialFunctions.loan.calculatePenalty,
    calculateSubscription: ZA_CURRENCY.financialFunctions.subscription.calculateSubscription,
    calculateVAT: ZA_CURRENCY.financialFunctions.tax.calculateVAT,
    
    // Validation Functions
    validateAmount: ZA_CURRENCY.errorHandling.validate.amount,
    validateFormat: ZA_CURRENCY.errorHandling.validate.format,
    
    // Utility Functions
    generateCurrencyOptions: ZA_CURRENCY.utilities.generateCurrencyOptions,
    generateTestData: ZA_CURRENCY.utilities.generateTestData,
    compareWithOtherCurrencies: ZA_CURRENCY.utilities.compareWithOtherCurrencies,
    
    // Constants
    CURRENCY_CODE: ZA_CURRENCY.currency.code,
    CURRENCY_SYMBOL: ZA_CURRENCY.currency.symbol,
    CURRENCY_NAME: ZA_CURRENCY.currency.name,
    
    // Exchange Rates
    EXCHANGE_RATES: ZA_CURRENCY.exchange.rates,
    
    // Calculations Configuration
    CALCULATIONS: ZA_CURRENCY.calculations,
    
    // Validation Rules
    VALIDATION_RULES: ZA_CURRENCY.validation,
    
    // Important Notes
    IMPORTANT_NOTES: [
        'All amounts on M-Pesewa South Africa are in South African Rand (ZAR)',
        'Cross-currency lending and borrowing is strictly prohibited',
        'Exchange rates are for informational purposes only',
        'VAT of 15% is included in all subscription prices',
        'Loan interest rate: 10% per week (simple interest)',
        'Penalty rate: 5% daily on outstanding balance after 7 days'
    ],
    
    // Compliance Information
    COMPLIANCE: {
        SARB: 'South African Reserve Bank regulations apply',
        VAT: '15% Value Added Tax included',
        TAX: 'Tax compliant with SARS requirements',
        EXCHANGE_CONTROL: 'Exchange control regulations apply for large transactions'
    },
    
    // Version Information
    VERSION: '2.1.0',
    LAST_UPDATED: '2026-01-24'
};

// Initialize and validate currency module
try {
    validateCurrencyConfig();
    console.log(`✅ M-Pesewa South Africa currency module loaded successfully`);
    console.log(`💰 Currency: ${ZA_CURRENCY.currency.name} (${ZA_CURRENCY.currency.code})`);
    console.log(`💰 Symbol: ${ZA_CURRENCY.currency.symbol}`);
    console.log(`💰 Exchange Rates: USD ${ZA_CURRENCY.exchange.rates.USD.middle}, EUR ${ZA_CURRENCY.exchange.rates.EUR.middle}, GBP ${ZA_CURRENCY.exchange.rates.GBP.middle}`);
    console.log(`💰 VAT Rate: ${ZA_CURRENCY.calculations.tax.vat.rate * 100}%`);
    console.log(`💰 Loan Interest: ${ZA_CURRENCY.calculations.loan.interest.weeklyRate * 100}% per week`);
} catch (error) {
    console.error(`❌ Currency module validation failed:`, error);
    throw error;
}