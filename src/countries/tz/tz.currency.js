/**
 * Tanzania (TZ) Currency Configuration for M-Pesewa
 * Currency handling, formatting, and exchange operations
 */

const tzCurrency = {
    // ============================================
    // 1. CURRENCY BASIC INFORMATION
    // ============================================
    basic: {
        code: 'TZS',
        symbol: 'TSh',
        name: 'Tanzanian Shilling',
        numericCode: '834',
        country: 'Tanzania',
        
        subunits: {
            major: 'Shilling',
            minor: 'Senti',
            minorPerMajor: 100
        },
        
        display: {
            symbolPosition: 'before',
            decimalSeparator: '.',
            thousandSeparator: ',',
            decimalDigits: 0, // TZS doesn't use decimals in practice
            format: '{symbol} {amount}',
            
            examples: {
                '1000': 'TSh 1,000',
                '5000': 'TSh 5,000',
                '10000': 'TSh 10,000',
                '100000': 'TSh 100,000'
            }
        }
    },

    // ============================================
    // 2. EXCHANGE RATES & CONVERSIONS
    // ============================================
    exchange: {
        baseCurrency: 'TZS',
        lastUpdated: new Date().toISOString(),
        source: 'Bank of Tanzania',
        
        rates: {
            USD: 0.00043,    // 1 TZS = 0.00043 USD
            EUR: 0.00039,    // 1 TZS = 0.00039 EUR
            GBP: 0.00034,    // 1 TZS = 0.00034 GBP
            KES: 0.065,      // 1 TZS = 0.065 KES
            UGX: 1.52,       // 1 TZS = 1.52 UGX
            RWF: 0.53,       // 1 TZS = 0.53 RWF
            XAF: 0.26,       // 1 TZS = 0.26 XAF
            ZAR: 0.0081,     // 1 TZS = 0.0081 ZAR
            NGN: 0.67,       // 1 TZS = 0.67 NGN
            GHS: 0.0058,     // 1 TZS = 0.0058 GHS
            ETB: 0.024       // 1 TZS = 0.024 ETB
        },
        
        historical: {
            '2024-01-01': { USD: 0.00042, EUR: 0.00038 },
            '2024-02-01': { USD: 0.00043, EUR: 0.00039 },
            '2024-03-01': { USD: 0.00043, EUR: 0.00039 }
        },
        
        updateFrequency: 'daily',
        autoUpdate: true
    },

    // ============================================
    // 3. CURRENCY FORMATTING FUNCTIONS
    // ============================================
    formatting: {
        // Format amount with currency symbol
        format: (amount, options = {}) => {
            const opts = {
                symbol: options.symbol !== undefined ? options.symbol : true,
                decimalDigits: options.decimalDigits !== undefined ? options.decimalDigits : tzCurrency.basic.display.decimalDigits,
                locale: options.locale || 'en-TZ',
                ...options
            };
            
            // Convert to number if string
            const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
            
            if (isNaN(numAmount)) {
                return 'TSh 0';
            }
            
            // Format number with thousand separators
            const formattedNumber = numAmount.toLocaleString(opts.locale, {
                minimumFractionDigits: opts.decimalDigits,
                maximumFractionDigits: opts.decimalDigits
            });
            
            // Add currency symbol
            if (opts.symbol) {
                return tzCurrency.basic.display.format
                    .replace('{symbol}', tzCurrency.basic.symbol)
                    .replace('{amount}', formattedNumber);
            }
            
            return formattedNumber;
        },
        
        // Parse formatted currency string back to number
        parse: (formattedString) => {
            if (!formattedString) return 0;
            
            // Remove currency symbol and thousand separators
            const cleanString = formattedString
                .replace(new RegExp(`\\${tzCurrency.basic.symbol}`, 'g'), '')
                .replace(new RegExp(`[${tzCurrency.basic.display.thousandSeparator}]`, 'g'), '')
                .trim();
            
            const parsed = parseFloat(cleanString);
            return isNaN(parsed) ? 0 : parsed;
        },
        
        // Convert to words (for checks, receipts)
        toWords: (amount) => {
            const num = Math.floor(amount);
            if (num === 0) return 'zero Tanzanian Shillings';
            
            const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
            const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
            const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
            const thousands = ['', 'thousand', 'million', 'billion'];
            
            const convertChunk = (n) => {
                if (n === 0) return '';
                
                let words = '';
                const hundreds = Math.floor(n / 100);
                const remainder = n % 100;
                
                if (hundreds > 0) {
                    words += ones[hundreds] + ' hundred';
                    if (remainder > 0) words += ' ';
                }
                
                if (remainder > 0) {
                    if (remainder < 10) {
                        words += ones[remainder];
                    } else if (remainder < 20) {
                        words += teens[remainder - 10];
                    } else {
                        const ten = Math.floor(remainder / 10);
                        const one = remainder % 10;
                        words += tens[ten];
                        if (one > 0) words += '-' + ones[one];
                    }
                }
                
                return words;
            };
            
            let words = '';
            let chunkIndex = 0;
            let tempAmount = num;
            
            while (tempAmount > 0) {
                const chunk = tempAmount % 1000;
                if (chunk > 0) {
                    const chunkWords = convertChunk(chunk);
                    words = chunkWords + (thousands[chunkIndex] ? ' ' + thousands[chunkIndex] + ' ' : '') + words;
                }
                tempAmount = Math.floor(tempAmount / 1000);
                chunkIndex++;
            }
            
            words = words.trim() + ' Tanzanian Shillings';
            
            // Handle senti if needed
            if (amount % 1 !== 0) {
                const senti = Math.round((amount % 1) * 100);
                if (senti > 0) {
                    words += ' and ' + convertChunk(senti) + ' Senti';
                }
            }
            
            return words.charAt(0).toUpperCase() + words.slice(1);
        },
        
        // Compact format (1K, 1M, 1B)
        compactFormat: (amount) => {
            const thresholds = [
                { value: 1e9, suffix: 'B' },
                { value: 1e6, suffix: 'M' },
                { value: 1e3, suffix: 'K' },
                { value: 1, suffix: '' }
            ];
            
            const threshold = thresholds.find(t => Math.abs(amount) >= t.value);
            if (!threshold) return tzCurrency.formatting.format(amount);
            
            const formatted = (amount / threshold.value).toFixed(1).replace(/\.0$/, '');
            return `${tzCurrency.basic.symbol} ${formatted}${threshold.suffix}`;
        }
    },

    // ============================================
    // 4. CURRENCY CONVERSION FUNCTIONS
    // ============================================
    conversion: {
        // Convert from TZS to another currency
        convertFromTZS: (amount, targetCurrency) => {
            const rate = tzCurrency.exchange.rates[targetCurrency];
            if (!rate) {
                throw new Error(`Exchange rate for ${targetCurrency} not available`);
            }
            
            return amount * rate;
        },
        
        // Convert to TZS from another currency
        convertToTZS: (amount, sourceCurrency) => {
            const rate = tzCurrency.exchange.rates[sourceCurrency];
            if (!rate) {
                throw new Error(`Exchange rate for ${sourceCurrency} not available`);
            }
            
            return amount / rate;
        },
        
        // Convert between any two currencies via TZS
        convert: (amount, fromCurrency, toCurrency) => {
            if (fromCurrency === 'TZS') {
                return tzCurrency.conversion.convertFromTZS(amount, toCurrency);
            }
            
            if (toCurrency === 'TZS') {
                return tzCurrency.conversion.convertToTZS(amount, fromCurrency);
            }
            
            // Convert fromCurrency -> TZS -> toCurrency
            const inTZS = tzCurrency.conversion.convertToTZS(amount, fromCurrency);
            return tzCurrency.conversion.convertFromTZS(inTZS, toCurrency);
        },
        
        // Bulk conversion
        bulkConvert: (amounts, fromCurrency, toCurrency) => {
            return amounts.map(amount => 
                tzCurrency.conversion.convert(amount, fromCurrency, toCurrency)
            );
        }
    },

    // ============================================
    // 5. FINANCIAL CALCULATIONS
    // ============================================
    calculations: {
        // Calculate loan interest (10% weekly)
        calculateInterest: (principal, days = 7) => {
            const weeklyInterestRate = 0.10; // 10%
            const interest = principal * weeklyInterestRate;
            
            // For periods other than 7 days, calculate proportional interest
            if (days !== 7) {
                const dailyRate = weeklyInterestRate / 7;
                return principal * dailyRate * days;
            }
            
            return interest;
        },
        
        // Calculate loan repayment with interest
        calculateRepayment: (principal, days = 7) => {
            const interest = tzCurrency.calculations.calculateInterest(principal, days);
            const total = principal + interest;
            
            // Calculate daily repayment amount
            const dailyRepayment = total / days;
            
            return {
                principal: principal,
                interest: interest,
                total: total,
                dailyRepayment: dailyRepayment,
                breakdown: {
                    perDay: dailyRepayment,
                    perWeek: days === 7 ? total : null,
                    interestRate: '10% weekly',
                    interestAmount: interest
                }
            };
        },
        
        // Calculate penalties (5% daily after due date)
        calculatePenalty: (principal, overdueDays) => {
            const dailyPenaltyRate = 0.05; // 5% daily
            return principal * dailyPenaltyRate * overdueDays;
        },
        
        // Calculate total with penalty
        calculateTotalWithPenalty: (principal, overdueDays) => {
            const repayment = tzCurrency.calculations.calculateRepayment(principal, 7);
            const penalty = tzCurrency.calculations.calculatePenalty(principal, overdueDays);
            
            return {
                ...repayment,
                penalty: penalty,
                totalWithPenalty: repayment.total + penalty,
                overdueDays: overdueDays
            };
        },
        
        // Calculate subscription costs
        calculateSubscription: (tier, period) => {
            const subscriptionTiers = {
                basic: {
                    monthly: 50,
                    biAnnual: 250,
                    annual: 500
                },
                premium: {
                    monthly: 250,
                    biAnnual: 1500,
                    annual: 2500
                },
                super: {
                    monthly: 1000,
                    biAnnual: 5000,
                    annual: 8500
                }
            };
            
            const tierData = subscriptionTiers[tier];
            if (!tierData) {
                throw new Error(`Invalid subscription tier: ${tier}`);
            }
            
            const amount = tierData[period];
            if (amount === undefined) {
                throw new Error(`Invalid subscription period: ${period}`);
            }
            
            return {
                tier: tier,
                period: period,
                amount: amount,
                formatted: tzCurrency.formatting.format(amount),
                dailyCost: period === 'monthly' ? amount / 30 : 
                          period === 'biAnnual' ? amount / 180 : 
                          amount / 365
            };
        }
    },

    // ============================================
    // 6. VALIDATION & SANITIZATION
    // ============================================
    validation: {
        // Validate amount is within acceptable range
        validateAmount: (amount, options = {}) => {
            const {
                min = 1000,      // Minimum TZS 1,000
                max = 20000,     // Maximum TZS 20,000 (Super tier)
                tier = 'basic'
            } = options;
            
            const tierLimits = {
                basic: 1500,
                premium: 5000,
                super: 20000,
                'lender-of-lenders': 50000
            };
            
            const actualMax = tierLimits[tier] || max;
            
            if (typeof amount !== 'number' || isNaN(amount)) {
                return { valid: false, error: 'Amount must be a valid number' };
            }
            
            if (amount < min) {
                return { 
                    valid: false, 
                    error: `Amount must be at least ${tzCurrency.formatting.format(min)}` 
                };
            }
            
            if (amount > actualMax) {
                return { 
                    valid: false, 
                    error: `Amount exceeds maximum of ${tzCurrency.formatting.format(actualMax)} for ${tier} tier` 
                };
            }
            
            if (!Number.isInteger(amount)) {
                return { 
                    valid: false, 
                    error: 'Amount must be a whole number (TZS does not use decimals)' 
                };
            }
            
            return { valid: true, amount: amount };
        },
        
        // Sanitize currency input
        sanitizeInput: (input) => {
            if (typeof input === 'string') {
                // Remove currency symbols, thousand separators, and non-numeric characters
                const sanitized = input
                    .replace(/[^\d.-]/g, '')
                    .replace(/(\..*)\./g, '$1'); // Remove multiple decimals
                
                const num = parseFloat(sanitized);
                return isNaN(num) ? 0 : Math.round(num);
            }
            
            if (typeof input === 'number') {
                return Math.round(input);
            }
            
            return 0;
        },
        
        // Check if amount is reasonable for category
        isReasonableForCategory: (amount, category) => {
            const categoryLimits = {
                'fare': { min: 1000, max: 50000, typical: 5000 },
                'data': { min: 500, max: 20000, typical: 5000 },
                'gas': { min: 10000, max: 80000, typical: 30000 },
                'food': { min: 2000, max: 50000, typical: 15000 },
                'electricity': { min: 5000, max: 100000, typical: 20000 },
                'medicine': { min: 5000, max: 200000, typical: 50000 }
            };
            
            const limits = categoryLimits[category];
            if (!limits) return true; // No specific limits for category
            
            return amount >= limits.min && amount <= limits.max;
        }
    },

    // ============================================
    // 7. CURRENCY-RELATED UTILITIES
    // ============================================
    utilities: {
        // Generate unique transaction ID
        generateTransactionId: (prefix = 'TZ') => {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substr(2, 9);
            return `${prefix}-${timestamp}-${random}`.toUpperCase();
        },
        
        // Calculate M-Pesa charges
        calculateMpesaCharges: (amount) => {
            // Vodacom M-Pesa charges in Tanzania
            const charges = [
                { max: 1000, charge: 10 },
                { max: 2500, charge: 30 },
                { max: 5000, charge: 55 },
                { max: 10000, charge: 110 },
                { max: 20000, charge: 220 },
                { max: 40000, charge: 330 },
                { max: 70000, charge: 550 },
                { max: 150000, charge: 1100 },
                { max: 250000, charge: 1650 },
                { max: 500000, charge: 2200 },
                { max: 1000000, charge: 3300 },
                { max: 3000000, charge: 5500 }
            ];
            
            const tier = charges.find(t => amount <= t.max) || charges[charges.length - 1];
            return tier.charge;
        },
        
        // Calculate total with charges
        calculateTotalWithCharges: (amount, provider = 'mpesa') => {
            const charges = {
                mpesa: tzCurrency.utilities.calculateMpesaCharges(amount),
                tigo: Math.ceil(tzCurrency.utilities.calculateMpesaCharges(amount) * 1.1),
                airtel: Math.ceil(tzCurrency.utilities.calculateMpesaCharges(amount) * 1.05),
                halo: Math.ceil(tzCurrency.utilities.calculateMpesaCharges(amount) * 1.15)
            };
            
            const charge = charges[provider] || charges.mpesa;
            return {
                amount: amount,
                charge: charge,
                total: amount + charge,
                provider: provider
            };
        },
        
        // Format for display in table
        formatForTable: (amount, options = {}) => {
            const defaultOptions = {
                align: 'right',
                compact: false,
                showSymbol: true,
                className: 'currency-cell'
            };
            
            const opts = { ...defaultOptions, ...options };
            const formatted = opts.compact ? 
                tzCurrency.formatting.compactFormat(amount) : 
                tzCurrency.formatting.format(amount, { symbol: opts.showSymbol });
            
            return {
                value: amount,
                formatted: formatted,
                display: `<span class="${opts.className}" style="text-align: ${opts.align}">${formatted}</span>`,
                dataSort: amount
            };
        },
        
        // Create currency range slider values
        createRangeValues: (min, max, step = 1000) => {
            const values = [];
            for (let i = min; i <= max; i += step) {
                values.push({
                    value: i,
                    label: tzCurrency.formatting.format(i),
                    compact: tzCurrency.formatting.compactFormat(i)
                });
            }
            return values;
        }
    },

    // ============================================
    // 8. CURRENCY LOCALIZATION
    // ============================================
    localization: {
        locales: {
            'en-TZ': {
                currency: 'TZS',
                symbol: 'TSh',
                decimalSeparator: '.',
                thousandSeparator: ',',
                format: '{symbol} {amount}'
            },
            'sw-TZ': {
                currency: 'TZS',
                symbol: 'TSh',
                decimalSeparator: '.',
                thousandSeparator: ',',
                format: '{amount} {symbol}'
            }
        },
        
        getLocaleConfig: (locale = 'en-TZ') => {
            return tzCurrency.localization.locales[locale] || tzCurrency.localization.locales['en-TZ'];
        },
        
        formatForLocale: (amount, locale = 'en-TZ') => {
            const config = tzCurrency.localization.getLocaleConfig(locale);
            const formattedNumber = amount.toLocaleString(locale, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            
            return config.format
                .replace('{symbol}', config.symbol)
                .replace('{amount}', formattedNumber);
        }
    },

    // ============================================
    // 9. CURRENCY API INTEGRATION
    // ============================================
    api: {
        endpoints: {
            exchangeRates: 'https://api.bot.go.tz/v1/exchange-rates',
            currencyConversion: 'https://api.bot.go.tz/v1/convert',
            historicalRates: 'https://api.bot.go.tz/v1/historical-rates'
        },
        
        headers: {
            'Authorization': 'Bearer {api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        
        methods: {
            getExchangeRates: async (baseCurrency = 'TZS') => {
                // Implementation would fetch from Bank of Tanzania API
                return {
                    base: baseCurrency,
                    rates: tzCurrency.exchange.rates,
                    timestamp: new Date().toISOString()
                };
            },
            
            convertCurrency: async (amount, from, to) => {
                return tzCurrency.conversion.convert(amount, from, to);
            }
        }
    },

    // ============================================
    // 10. CURRENCY TESTING & DEBUGGING
    // ============================================
    testing: {
        testAmounts: [1000, 5000, 10000, 50000, 100000, 500000, 1000000],
        
        runTests: () => {
            const tests = [];
            
            // Test formatting
            tzCurrency.testing.testAmounts.forEach(amount => {
                const formatted = tzCurrency.formatting.format(amount);
                const parsed = tzCurrency.formatting.parse(formatted);
                tests.push({
                    test: `Format and parse ${amount}`,
                    amount: amount,
                    formatted: formatted,
                    parsed: parsed,
                    passed: parsed === amount
                });
            });
            
            // Test conversions
            Object.entries(tzCurrency.exchange.rates).forEach(([currency, rate]) => {
                const testAmount = 10000;
                const converted = tzCurrency.conversion.convertFromTZS(testAmount, currency);
                const convertedBack = tzCurrency.conversion.convertToTZS(converted, currency);
                
                tests.push({
                    test: `Convert TZS to ${currency} and back`,
                    original: testAmount,
                    converted: converted,
                    convertedBack: convertedBack,
                    rate: rate,
                    passed: Math.abs(convertedBack - testAmount) < 1
                });
            });
            
            return tests;
        },
        
        validateAll: () => {
            const tests = tzCurrency.testing.runTests();
            const passed = tests.filter(t => t.passed).length;
            const total = tests.length;
            
            return {
                tests: tests,
                summary: {
                    passed: passed,
                    total: total,
                    percentage: (passed / total * 100).toFixed(2) + '%'
                },
                allPassed: passed === total
            };
        }
    }
};

// Export Currency Configuration
module.exports = tzCurrency;

// Initialize currency system
console.log('Tanzania Currency Configuration loaded successfully');
console.log(`Currency: ${tzCurrency.basic.name} (${tzCurrency.basic.code})`);
console.log(`Symbol: ${tzCurrency.basic.symbol}`);
console.log(`Exchange Rates: ${Object.keys(tzCurrency.exchange.rates).length} currencies supported`);
console.log(`Format: ${tzCurrency.formatting.format(10000)}`);
console.log(`Validation Tests: ${tzCurrency.testing.validateAll().summary.passed}/${tzCurrency.testing.validateAll().summary.total} passed`);