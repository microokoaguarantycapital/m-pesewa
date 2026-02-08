/**
 * M-PESEWA RWANDA CURRENCY MODULE
 * Rwandan Franc (RWF) handling and financial calculations
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const RwandaCurrency = {
    // ============================================
    // 1️⃣ CURRENCY DEFINITION & METADATA
    // ============================================
    currency: {
        code: "RWF",
        isoCode: "646",
        name: "Rwandan Franc",
        nativeName: "Ifaranga ry'u Rwanda",
        symbol: "FRw",
        subunit: "Centime",
        subunitValue: 100,
        precision: 0, // No decimal places in RWF
        
        denominations: {
            coins: [
                { value: 1, name: "Ifaranga rimwe", status: "rare" },
                { value: 5, name: "Amafaranga atanu", status: "rare" },
                { value: 10, name: "Amafaranga icumi", status: "rare" },
                { value: 20, name: "Amafaranga makumyabiri", status: "rare" },
                { value: 50, name: "Amafaranga mirongo itanu", status: "common" },
                { value: 100, name: "Ijana", status: "common" }
            ],
            banknotes: [
                { value: 500, name: "Amajana atanu", color: "green", size: "138 x 69 mm" },
                { value: 1000, name: "Igihumbi", color: "blue", size: "143 x 71 mm" },
                { value: 2000, name: "Ibihumbi bibiri", color: "brown", size: "148 x 73 mm" },
                { value: 5000, name: "Ibihumbi bitanu", color: "purple", size: "153 x 75 mm" }
            ]
        },
        
        centralBank: {
            name: "National Bank of Rwanda",
            acronym: "BNR",
            established: "1964",
            website: "https://www.bnr.rw",
            governor: "John Rwangombwa"
        },
        
        exchangeRates: {
            base: "RWF",
            rates: {
                USD: 0.00081,    // 1 RWF = 0.00081 USD
                EUR: 0.00074,    // 1 RWF = 0.00074 EUR
                GBP: 0.00064,    // 1 RWF = 0.00064 GBP
                KES: 0.13,       // 1 RWF = 0.13 KES
                UGX: 2.85,       // 1 RWF = 2.85 UGX
                TZS: 2.10,       // 1 RWF = 2.10 TZS
                BIF: 1.20        // 1 RWF = 1.20 BIF
            },
            updated: "2024-01-24",
            source: "BNR Official Rates"
        }
    },

    // ============================================
    // 2️⃣ FORMATTING & DISPLAY RULES
    // ============================================
    formatting: {
        // Display formats
        formats: {
            standard: "{{symbol}}{{value}}",
            accounting: "{{value}} {{symbol}}",
            compact: "{{symbol}}{{value}}",
            verbose: "{{value}} {{code}}"
        },
        
        // Number formatting
        numberFormat: {
            decimalSeparator: ".",
            thousandSeparator: ",",
            grouping: [3], // Groups of 3 digits
            pattern: "#,##0",
            compactNotation: true
        },
        
        // Compact notation (for large numbers)
        compact: {
            thresholds: [
                { value: 1000, suffix: "K", divisor: 1000 },
                { value: 1000000, suffix: "M", divisor: 1000000 },
                { value: 1000000000, suffix: "B", divisor: 1000000000 }
            ],
            
            format: function(amount) {
                if (amount >= 1000000000) {
                    return (amount / 1000000000).toFixed(1) + "B";
                } else if (amount >= 1000000) {
                    return (amount / 1000000).toFixed(1) + "M";
                } else if (amount >= 1000) {
                    return (amount / 1000).toFixed(1) + "K";
                }
                return amount.toString();
            }
        },
        
        // Spoken/written formats
        spoken: {
            formats: {
                formal: "Amafaranga {{amount}}",
                informal: "FRw {{amount}}",
                numeric: "{{amount}}"
            },
            
            numberWords: {
                units: ["", "rimwe", "kabiri", "gatatu", "kane", "gatanu", "gatandatu", "karindwi", "umunani", "icyenda"],
                teens: ["ikumi", "cumi na rimwe", "cumi na kabiri", "cumi na gatatu", "cumi na kane", "cumi na gatanu", "cumi na gatandatu", "cumi na karindwi", "cumi n'umunani", "cumi n'icyenda"],
                tens: ["", "makumyabiri", "mirongo itatu", "mirongo ine", "mirongo itanu", "mirongo itandatu", "mirongo irindwi", "mirongo inani", "mirongo cyenda"],
                hundreds: ["", "ijana", "amajana abiri", "amajana atatu", "amajana ane", "amajana atanu", "amajana atandatu", "amajana arindwi", "amajana umunani", "amajana cyenda"],
                thousands: ["", "igihumbi", "ibihumbi bibiri", "ibihumbi bitatu", "ibihumbi bine", "ibihumbi bitanu", "ibihumbi bitandatu", "ibihumbi birindwi", "ibihumbi umunani", "ibihumbi cyenda"]
            }
        }
    },

    // ============================================
    // 3️⃣ FINANCIAL CALCULATIONS
    // ============================================
    calculations: {
        // Loan calculations
        loan: {
            calculateInterest: function(principal, days = 7) {
                const weeklyInterest = 0.10; // 10%
                const interest = principal * weeklyInterest;
                return Math.ceil(interest); // RWF has no decimals
            },
            
            calculateTotalRepayment: function(principal, days = 7) {
                const interest = this.calculateInterest(principal, days);
                return principal + interest;
            },
            
            calculateDailyRepayment: function(principal, days = 7) {
                const total = this.calculateTotalRepayment(principal, days);
                const daily = total / days;
                return Math.ceil(daily);
            },
            
            calculatePenalty: function(principal, overdueDays) {
                const dailyPenaltyRate = 0.05; // 5% daily
                const penalty = principal * dailyPenaltyRate * overdueDays;
                return Math.ceil(penalty);
            },
            
            calculateDefaultAmount: function(principal, overdueDays) {
                if (overdueDays <= 7) {
                    return this.calculateTotalRepayment(principal, 7);
                }
                
                const baseRepayment = this.calculateTotalRepayment(principal, 7);
                const penaltyDays = overdueDays - 7;
                const penalty = this.calculatePenalty(principal, penaltyDays);
                
                return baseRepayment + penalty;
            }
        },
        
        // Subscription calculations
        subscription: {
            calculateMonthly: function(tier) {
                const tiers = {
                    basic: 50,
                    premium: 250,
                    super: 1000,
                    lenderOfLenders: 500
                };
                return tiers[tier] || 0;
            },
            
            calculateBiAnnual: function(tier) {
                const monthly = this.calculateMonthly(tier);
                const discount = 0.15; // 15% discount
                return Math.ceil(monthly * 6 * (1 - discount));
            },
            
            calculateAnnual: function(tier) {
                const monthly = this.calculateMonthly(tier);
                const discount = 0.25; // 25% discount
                return Math.ceil(monthly * 12 * (1 - discount));
            },
            
            calculateSavings: function(tier, period) {
                const monthly = this.calculateMonthly(tier);
                
                switch(period) {
                    case 'monthly':
                        return 0;
                    case 'biAnnual':
                        return Math.ceil(monthly * 6 * 0.15); // 15% of 6 months
                    case 'annual':
                        return Math.ceil(monthly * 12 * 0.25); // 25% of 12 months
                    default:
                        return 0;
                }
            }
        },
        
        // Investment calculations
        investment: {
            calculateROI: function(principal, returns) {
                if (principal === 0) return 0;
                return ((returns - principal) / principal) * 100;
            },
            
            calculateWeeklyReturns: function(principal) {
                const weeklyRate = 0.10; // 10% weekly
                return Math.ceil(principal * weeklyRate);
            },
            
            calculateMonthlyReturns: function(principal, weeks = 4) {
                let total = principal;
                for (let i = 0; i < weeks; i++) {
                    total += this.calculateWeeklyReturns(total);
                }
                return total - principal;
            },
            
            calculateCompounding: function(principal, weeks, reinvest = true) {
                let current = principal;
                
                for (let i = 0; i < weeks; i++) {
                    const returns = this.calculateWeeklyReturns(current);
                    if (reinvest) {
                        current += returns;
                    }
                }
                
                return {
                  principal: principal,
                  total: current,
                  returns: current - principal,
                  weeklyAverage: (current - principal) / weeks
                };
            }
        }
    },

    // ============================================
    // 4️⃣ VALIDATION & SANITIZATION
    // ============================================
    validation: {
        // Validate amount
        isValidAmount: function(amount) {
            if (typeof amount !== 'number' && typeof amount !== 'string') {
                return false;
            }
            
            const numAmount = parseFloat(amount);
            
            // Check if it's a number
            if (isNaN(numAmount)) {
                return false;
            }
            
            // Check if it's positive
            if (numAmount < 0) {
                return false;
            }
            
            // Check if it's integer (RWF has no decimals)
            if (!Number.isInteger(numAmount)) {
                return false;
            }
            
            // Check reasonable maximum (10 billion RWF)
            if (numAmount > 10000000000) {
                return false;
            }
            
            return true;
        },
        
        // Sanitize amount
        sanitizeAmount: function(amount) {
            // Remove any non-numeric characters except minus and decimal
            let sanitized = String(amount).replace(/[^0-9.-]/g, '');
            
            // Parse as integer (no decimals for RWF)
            const parsed = parseInt(sanitized);
            
            // Handle NaN
            if (isNaN(parsed)) {
                return 0;
            }
            
            // Ensure non-negative
            return Math.max(0, parsed);
        },
        
        // Validate currency code
        isValidCurrencyCode: function(code) {
            return code === 'RWF' || code === 'FRw' || code === 'Rwandan Franc';
        },
        
        // Check if amount is within tier limits
        isWithinTierLimit: function(amount, tier) {
            const limits = {
                basic: 1500,
                premium: 5000,
                super: 20000,
                lenderOfLenders: 50000
            };
            
            const tierLimit = limits[tier] || 0;
            return amount <= tierLimit;
        },
        
        // Validate payment amount (must be round numbers)
        isValidPaymentAmount: function(amount) {
            return this.isValidAmount(amount) && amount % 100 === 0;
        }
    },

    // ============================================
    // 5️⃣ CONVERSION & EXCHANGE
    // ============================================
    conversion: {
        // Convert to other currencies
        convert: function(amount, targetCurrency) {
            const rate = this.currency.exchangeRates.rates[targetCurrency];
            if (!rate) {
                throw new Error(`Exchange rate for ${targetCurrency} not available`);
            }
            
            const converted = amount * rate;
            
            // Round to appropriate decimal places
            const decimalPlaces = this.getDecimalPlaces(targetCurrency);
            return parseFloat(converted.toFixed(decimalPlaces));
        },
        
        // Get decimal places for a currency
        getDecimalPlaces: function(currencyCode) {
            const places = {
                'RWF': 0,
                'USD': 2,
                'EUR': 2,
                'GBP': 2,
                'KES': 2,
                'UGX': 0,
                'TZS': 0,
                'BIF': 0
            };
            
            return places[currencyCode] || 2;
        },
        
        // Format converted amount
        formatConverted: function(amount, targetCurrency) {
            const converted = this.convert(amount, targetCurrency);
            const symbols = {
                'USD': '$',
                'EUR': '€',
                'GBP': '£',
                'KES': 'KSh',
                'UGX': 'USh',
                'TZS': 'TSh',
                'BIF': 'FBu'
            };
            
            const symbol = symbols[targetCurrency] || targetCurrency;
            const decimalPlaces = this.getDecimalPlaces(targetCurrency);
            
            return `${symbol}${converted.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        },
        
        // Bulk conversion
        convertBulk: function(amounts, targetCurrency) {
            return amounts.map(amount => this.convert(amount, targetCurrency));
        },
        
        // Get cross-rate between two non-RWF currencies
        getCrossRate: function(fromCurrency, toCurrency) {
            const fromRate = this.currency.exchangeRates.rates[fromCurrency];
            const toRate = this.currency.exchangeRates.rates[toCurrency];
            
            if (!fromRate || !toRate) {
                throw new Error('Exchange rates not available for one or both currencies');
            }
            
            return toRate / fromRate;
        }
    },

    // ============================================
    // 6️⃣ FORMATTING METHODS
    // ============================================
    formatters: {
        // Format amount with symbol
        format: function(amount, formatType = 'standard') {
            if (!this.validation.isValidAmount(amount)) {
                return 'Invalid amount';
            }
            
            const numAmount = parseInt(amount);
            const formattedNumber = this.formatNumber(numAmount);
            
            switch(formatType) {
                case 'standard':
                    return `${this.currency.symbol}${formattedNumber}`;
                case 'accounting':
                    return `${formattedNumber} ${this.currency.symbol}`;
                case 'compact':
                    return `${this.currency.symbol}${this.formatting.compact.format(numAmount)}`;
                case 'verbose':
                    return `${formattedNumber} ${this.currency.code}`;
                case 'spoken':
                    return this.formatSpoken(numAmount);
                default:
                    return `${this.currency.symbol}${formattedNumber}`;
            }
        },
        
        // Format number with thousand separators
        formatNumber: function(amount) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        
        // Format spoken amount in Kinyarwanda
        formatSpoken: function(amount) {
            if (amount === 0) return "zeru";
            if (amount < 0) return "negative " + this.formatSpoken(-amount);
            
            const words = this.formatting.spoken.numberWords;
            let result = "";
            
            // Handle billions (not common in Rwanda but included for completeness)
            if (amount >= 1000000000) {
                const billions = Math.floor(amount / 1000000000);
                result += this.formatSpoken(billions) + " billion ";
                amount %= 1000000000;
            }
            
            // Handle millions
            if (amount >= 1000000) {
                const millions = Math.floor(amount / 1000000);
                result += words.thousands[millions] + " million ";
                amount %= 1000000;
            }
            
            // Handle thousands
            if (amount >= 1000) {
                const thousands = Math.floor(amount / 1000);
                result += words.thousands[thousands] + " ";
                amount %= 1000;
            }
            
            // Handle hundreds
            if (amount >= 100) {
                const hundreds = Math.floor(amount / 100);
                result += words.hundreds[hundreds] + " ";
                amount %= 100;
            }
            
            // Handle tens and units
            if (amount > 0) {
                if (amount < 10) {
                    result += words.units[amount];
                } else if (amount < 20) {
                    result += words.teens[amount - 10];
                } else {
                    const tens = Math.floor(amount / 10);
                    const units = amount % 10;
                    result += words.tens[tens];
                    if (units > 0) {
                        result += " n'" + words.units[units];
                    }
                }
            }
            
            return result.trim() + " amafaranga";
        },
        
        // Format for display in UI components
        formatForDisplay: function(amount, options = {}) {
            const defaults = {
                showSymbol: true,
                compact: false,
                locale: 'en-RW',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            };
            
            const config = { ...defaults, ...options };
            const numAmount = parseInt(amount);
            
            if (config.compact && numAmount >= 1000) {
                const compact = this.formatting.compact.format(numAmount);
                return config.showSymbol ? `${this.currency.symbol}${compact}` : compact;
            }
            
            const formatter = new Intl.NumberFormat(config.locale, {
                minimumFractionDigits: config.minimumFractionDigits,
                maximumFractionDigits: config.maximumFractionDigits
            });
            
            const formatted = formatter.format(numAmount);
            return config.showSymbol ? `${this.currency.symbol}${formatted}` : formatted;
        },
        
        // Format range (e.g., "FRw 1,000 - 5,000")
        formatRange: function(min, max) {
            return `${this.format(min)} - ${this.format(max)}`;
        },
        
        // Format percentage of amount
        formatPercentage: function(amount, percentage) {
            const percentageAmount = Math.ceil((amount * percentage) / 100);
            return `${this.format(percentageAmount)} (${percentage}%)`;
        }
    },

    // ============================================
    // 7️⃣ PAYMENT PROCESSING
    // ============================================
    payments: {
        // Calculate mobile money fees (Rwanda specific)
        calculateMobileMoneyFees: function(amount, provider = 'mtn') {
            const fees = {
                mtn: [
                    { min: 0, max: 1000, fee: 0 },
                    { min: 1001, max: 2500, fee: 55 },
                    { min: 2501, max: 5000, fee: 110 },
                    { min: 5001, max: 10000, fee: 165 },
                    { min: 10001, max: 15000, fee: 275 },
                    { min: 15001, max: 20000, fee: 330 },
                    { min: 20001, max: 35000, fee: 550 },
                    { min: 35001, max: 50000, fee: 715 },
                    { min: 50001, max: 100000, fee: 825 },
                    { min: 100001, max: 150000, fee: 990 },
                    { min: 150001, max: 250000, fee: 1430 },
                    { min: 250001, max: 500000, fee: 1650 },
                    { min: 500001, max: 1000000, fee: 2200 },
                    { min: 1000001, max: 5000000, fee: 3300 }
                ],
                airtel: [
                    { min: 0, max: 1000, fee: 0 },
                    { min: 1001, max: 2500, fee: 50 },
                    { min: 2501, max: 5000, fee: 100 },
                    { min: 5001, max: 10000, fee: 150 },
                    { min: 10001, max: 15000, fee: 250 },
                    { min: 15001, max: 20000, fee: 300 },
                    { min: 20001, max: 35000, fee: 500 },
                    { min: 35001, max: 50000, fee: 650 },
                    { min: 50001, max: 100000, fee: 750 },
                    { min: 100001, max: 150000, fee: 900 },
                    { min: 150001, max: 250000, fee: 1300 },
                    { min: 250001, max: 500000, fee: 1500 },
                    { min: 500001, max: 1000000, fee: 2000 },
                    { min: 1000001, max: 3000000, fee: 3000 }
                ]
            };
            
            const providerFees = fees[provider] || fees.mtn;
            
            for (const bracket of providerFees) {
                if (amount >= bracket.min && amount <= bracket.max) {
                    return bracket.fee;
                }
            }
            
            // If amount exceeds maximum bracket, use last bracket fee
            return providerFees[providerFees.length - 1].fee;
        },
        
        // Calculate total payment amount (amount + fees)
        calculateTotalPayment: function(amount, provider = 'mtn') {
            const fee = this.calculateMobileMoneyFees(amount, provider);
            return amount + fee;
        },
        
        // Validate payment amount for mobile money
        isValidMobileMoneyAmount: function(amount) {
            // MTN and Airtel have minimum and maximum limits
            const minAmount = 100;
            const maxAmount = 5000000; // 5 million RWF
            
            return amount >= minAmount && amount <= maxAmount;
        },
        
        // Generate payment reference
        generatePaymentReference: function(prefix = 'MPR') {
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `${prefix}${timestamp}${random}`;
        },
        
        // Format payment instructions
        getPaymentInstructions: function(amount, provider = 'mtn') {
            const total = this.calculateTotalPayment(amount, provider);
            const fee = total - amount;
            
            const instructions = {
                mtn: `Dial *182# → Send Money → Enter ${this.formatters.format(total)} → Enter PIN`,
                airtel: `Dial *182# → Airtel Money → Send Money → Enter ${this.formatters.format(total)} → Enter PIN`,
                bank: `Transfer ${this.formatters.format(amount)} to Account: 0012345678 (BK)`
            };
            
            return {
                provider: provider,
                amount: amount,
                fee: fee,
                total: total,
                instructions: instructions[provider] || instructions.mtn,
                reference: this.generatePaymentReference()
            };
        }
    },

    // ============================================
    // 8️⃣ STATISTICS & ANALYTICS
    // ============================================
    statistics: {
        // Calculate average
        calculateAverage: function(amounts) {
            if (!Array.isArray(amounts) || amounts.length === 0) {
                return 0;
            }
            
            const sum = amounts.reduce((acc, curr) => acc + curr, 0);
            return Math.round(sum / amounts.length);
        },
        
        // Calculate median
        calculateMedian: function(amounts) {
            if (!Array.isArray(amounts) || amounts.length === 0) {
                return 0;
            }
            
            const sorted = [...amounts].sort((a, b) => a - b);
            const middle = Math.floor(sorted.length / 2);
            
            if (sorted.length % 2 === 0) {
                return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
            } else {
                return sorted[middle];
            }
        },
        
        // Calculate mode
        calculateMode: function(amounts) {
            if (!Array.isArray(amounts) || amounts.length === 0) {
                return 0;
            }
            
            const frequency = {};
            let maxFreq = 0;
            let mode = amounts[0];
            
            amounts.forEach(amount => {
                frequency[amount] = (frequency[amount] || 0) + 1;
                if (frequency[amount] > maxFreq) {
                    maxFreq = frequency[amount];
                    mode = amount;
                }
            });
            
            return mode;
        },
        
        // Calculate standard deviation
        calculateStandardDeviation: function(amounts) {
            if (!Array.isArray(amounts) || amounts.length < 2) {
                return 0;
            }
            
            const avg = this.calculateAverage(amounts);
            const squareDiffs = amounts.map(amount => Math.pow(amount - avg, 2));
            const avgSquareDiff = squareDiffs.reduce((acc, curr) => acc + curr, 0) / amounts.length;
            
            return Math.round(Math.sqrt(avgSquareDiff));
        },
        
        // Generate loan statistics
        generateLoanStats: function(loans) {
            const amounts = loans.map(loan => loan.amount);
            const repaid = loans.filter(loan => loan.status === 'repaid').map(loan => loan.amount);
            const overdue = loans.filter(loan => loan.status === 'overdue').map(loan => loan.amount);
            
            return {
                totalLoans: loans.length,
                totalAmount: amounts.reduce((acc, curr) => acc + curr, 0),
                averageLoan: this.calculateAverage(amounts),
                medianLoan: this.calculateMedian(amounts),
                repaymentRate: loans.length > 0 ? (repaid.length / loans.length) * 100 : 0,
                defaultRate: loans.length > 0 ? (overdue.length / loans.length) * 100 : 0,
                totalRepaid: repaid.reduce((acc, curr) => acc + curr, 0),
                totalOverdue: overdue.reduce((acc, curr) => acc + curr, 0)
            };
        }
    },

    // ============================================
    // 9️⃣ CURRENCY UTILITIES
    // ============================================
    utils: {
        // Parse currency string to number
        parse: function(currencyString) {
            if (typeof currencyString !== 'string') {
                return parseInt(currencyString) || 0;
            }
            
            // Remove currency symbols and thousand separators
            const cleaned = currencyString
                .replace(this.currency.symbol, '')
                .replace(/[^\d.-]/g, '');
            
            return parseInt(cleaned) || 0;
        },
        
        // Compare two amounts
        compare: function(amount1, amount2) {
            const num1 = this.parse(amount1);
            const num2 = this.parse(amount2);
            
            if (num1 < num2) return -1;
            if (num1 > num2) return 1;
            return 0;
        },
        
        // Get denomination breakdown
        getDenominationBreakdown: function(amount) {
            const denominations = [
                5000, 2000, 1000, 500, 100, 50
            ];
            
            const breakdown = {};
            let remaining = amount;
            
            denominations.forEach(denom => {
                const count = Math.floor(remaining / denom);
                if (count > 0) {
                    breakdown[denom] = count;
                    remaining -= count * denom;
                }
            });
            
            return {
                breakdown: breakdown,
                remaining: remaining,
                total: amount,
                canBeFullyDenominated: remaining === 0
            };
        },
        
        // Round to nearest denomination
        roundToDenomination: function(amount, denomination = 100) {
            return Math.round(amount / denomination) * denomination;
        },
        
        // Generate test data
        generateTestAmounts: function(count = 10, min = 500, max = 50000) {
            const amounts = [];
            for (let i = 0; i < count; i++) {
                // Generate amounts rounded to nearest 100
                const raw = Math.floor(Math.random() * (max - min + 1)) + min;
                amounts.push(this.roundToDenomination(raw, 100));
            }
            return amounts;
        }
    },

    // ============================================
    // 🔟 INITIALIZATION & EXPORTS
    // ============================================
    init: function() {
        console.log('Rwanda Currency Module Initialized');
        
        // Set currency in localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('mpesewa_currency', this.currency.code);
            localStorage.setItem('mpesewa_currency_symbol', this.currency.symbol);
        }
        
        // Add currency formatter to Number prototype (optional)
        if (typeof Number !== 'undefined') {
            Number.prototype.toRWF = function(formatType = 'standard') {
                return RwandaCurrency.formatters.format(this, formatType);
            };
        }
        
        return this;
    },

    // ============================================
    // 1️⃣1️⃣ VERSION & METADATA
    // ============================================
    version: {
        major: 1,
        minor: 0,
        patch: 0,
        build: '20240124',
        
        getVersion: function() {
            return `v${this.major}.${this.minor}.${this.patch}`;
        }
    }
};

// Auto-initialize
RwandaCurrency.init();

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RwandaCurrency;
} else if (typeof window !== 'undefined') {
    window.RwandaCurrency = RwandaCurrency;
}

// Add to global M-Pesewa object
if (typeof window !== 'undefined' && window.MPesewa) {
    window.MPesewa.RwandaCurrency = RwandaCurrency;
}

// Add currency formatting helper to window
if (typeof window !== 'undefined') {
    window.formatRWF = function(amount, options = {}) {
        return RwandaCurrency.formatters.formatForDisplay(amount, options);
    };
    
    window.parseRWF = function(currencyString) {
        return RwandaCurrency.utils.parse(currencyString);
    };
    
    window.calculateLoanRWF = function(principal, days = 7) {
        return RwandaCurrency.calculations.loan.calculateTotalRepayment(principal, days);
    };
}