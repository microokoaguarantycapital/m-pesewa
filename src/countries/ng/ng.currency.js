/**
 * M-PESEWA - NIGERIA CURRENCY MODULE
 * Nigerian Naira (NGN) handling, conversion, formatting, and validation
 * Strict currency isolation and exchange rate management
 * Last Updated: 2026-01-24
 */

const NigeriaCurrency = {
    // ====================================================================
    // 1️⃣ CURRENCY SPECIFICATION (NIGERIAN NAIRA - NGN)
    // ====================================================================
    specification: {
        code: "NGN",
        symbol: "₦",
        name: "Nigerian Naira",
        iso4217: "566",
        issuingCountry: "Federal Republic of Nigeria",
        centralBank: "Central Bank of Nigeria (CBN)",
        
        // Denominations
        denominations: {
            coins: [
                { value: 50, name: "Fifty Kobo", status: "Rare" },
                { value: 100, name: "One Naira", status: "Rare" },
                { value: 200, name: "Two Naira", status: "Rare" }
            ],
            banknotes: [
                { value: 500, name: "Five Hundred Naira", status: "Common" },
                { value: 1000, name: "One Thousand Naira", status: "Common" },
                { value: 2000, name: "Two Thousand Naira", status: "Common" },
                { value: 5000, name: "Five Thousand Naira", status: "Common" },
                { value: 10000, name: "Ten Thousand Naira", status: "Limited" },
                { value: 20000, name: "Twenty Thousand Naira", status: "Limited" },
                { value: 50000, name: "Fifty Thousand Naira", status: "Limited" }
            ]
        },
        
        // Digital currency status
        digital: {
            eNaira: true,
            status: "Active",
            launchDate: "2021-10-25",
            integration: "CBN Digital Currency"
        },
        
        // Historical context
        history: {
            introduced: "1973",
            replaced: "Nigerian Pound",
            decimalization: "100 Kobo = 1 Naira",
            redenomination: "2008 (Planned but not executed)"
        }
    },

    // ====================================================================
    // 2️⃣ EXCHANGE RATES & CONVERSION (REAL-TIME)
    // ====================================================================
    exchange: {
        // Base rate (NGN per 1 unit)
        baseRates: {
            USD: 1450.00,    // 1 USD = ₦1,450
            EUR: 1580.00,    // 1 EUR = ₦1,580
            GBP: 1840.00,    // 1 GBP = ₦1,840
            KES: 9.50,       // 1 KES = ₦9.50
            GHS: 120.00,     // 1 GHS = ₦120
            ZAR: 78.00,      // 1 ZAR = ₦78
            XOF: 2.20,       // 1 XOF = ₦2.20
            XAF: 2.20        // 1 XAF = ₦2.20
        },
        
        // Official CBN rates (for compliance)
        cbnRates: {
            buyingRate: 1445.00,
            sellingRate: 1455.00,
            middleRate: 1450.00,
            lastUpdated: "2026-01-24",
            source: "Central Bank of Nigeria",
            validity: "24 hours"
        },
        
        // Parallel market rates (informal)
        parallelRates: {
            buyingRate: 1480.00,
            sellingRate: 1490.00,
            disclaimer: "Informal market rates - for reference only",
            legality: "Not recognized for official transactions"
        },
        
        // Historical trends (last 12 months)
        trends: {
            min: 1250.00,
            max: 1550.00,
            average: 1400.00,
            volatility: "High",
            trend: "Depreciating",
            factors: [
                "Oil prices",
                "Foreign reserves",
                "Inflation rate",
                "CBN monetary policy",
                "Political stability"
            ]
        }
    },

    // ====================================================================
    // 3️⃣ TRANSACTION LIMITS & REGULATIONS (STRICT)
    // ====================================================================
    limits: {
        // CBN Regulations
        cbnRegulations: {
            individualDailyLimit: 500000,      // ₦500,000
            corporateDailyLimit: 5000000,      // ₦5,000,000
            maximumCashWithdrawal: 500000,     // ₦500,000 daily
            maximumCashDeposit: 5000000,       // ₦5,000,000 daily
            reportingThreshold: 10000000,      // ₦10,000,000 (STR)
            maximumTransfer: 5000000,          // ₦5,000,000 per transaction
            weeklyCumulative: 20000000         // ₦20,000,000 weekly
        },
        
        // M-Pesewa Platform Limits
        platformLimits: {
            // Borrower Limits
            borrower: {
                minimumLoan: 50,               // ₦50 minimum
                maximumLoanBasic: 1500,        // ₦1,500 per week
                maximumLoanPremium: 5000,      // ₦5,000 per week
                maximumLoanSuper: 20000,       // ₦20,000 per week
                maximumLoanLenderOfLenders: 50000, // ₦50,000 per week
                dailyBorrowingLimit: 100000,   // ₦100,000 daily
                monthlyBorrowingLimit: 500000  // ₦500,000 monthly
            },
            
            // Lender Limits
            lender: {
                minimumLend: 50,               // ₦50 minimum
                maximumDailyLend: 1000000,     // ₦1,000,000 daily
                maximumWeeklyLend: 5000000,    // ₦5,000,000 weekly
                maximumOutstanding: 10000000,  // ₦10,000,000 total
                perBorrowerLimit: 50000,       // ₦50,000 per borrower
                groupLendingLimit: 500000      // ₦500,000 per group
            },
            
            // Platform Operational Limits
            operational: {
                maximumTransactionValue: 5000000,  // ₦5,000,000
                minimumTransactionValue: 50,       // ₦50
                dailyPlatformVolume: 100000000,    // ₦100,000,000
                monthlyPlatformVolume: 3000000000  // ₦3,000,000,000
            }
        },
        
        // Age-based restrictions
        ageRestrictions: {
            "18-24": {
                maximumLoan: 50000,
                maximumDaily: 10000,
                requiresGuarantor: true
            },
            "25-35": {
                maximumLoan: 200000,
                maximumDaily: 50000,
                requiresGuarantor: false
            },
            "36-50": {
                maximumLoan: 500000,
                maximumDaily: 100000,
                requiresGuarantor: false
            },
            "51+": {
                maximumLoan: 1000000,
                maximumDaily: 200000,
                requiresGuarantor: false
            }
        }
    },

    // ====================================================================
    // 4️⃣ FINANCIAL CALCULATIONS (INTEREST, PENALTIES, FEES)
    // ====================================================================
    calculations: {
        // Interest calculation (STRICT: 10% weekly)
        interest: {
            rate: 0.10, // 10% per week
            calculationMethod: "Simple Interest",
            compounding: "None",
            formula: "I = P × r × t",
            where: "P = Principal, r = 0.10, t = weeks",
            example: "₦1,000 × 0.10 × 1 = ₦100 interest"
        },
        
        // Penalty calculation (STRICT: 5% daily after 7 days)
        penalty: {
            rate: 0.05, // 5% daily after due date
            gracePeriod: 0, // No grace period
            startsAfter: 7, // Days
            calculationMethod: "Daily on outstanding principal",
            maximumPenalty: "100% of principal",
            formula: "Penalty = Outstanding × 0.05 × days overdue"
        },
        
        // Platform fees (Lender subscriptions only)
        fees: {
            subscription: {
                basic: {
                    monthly: 50,
                    quarterly: 140,
                    semiAnnual: 250,
                    annual: 500
                },
                premium: {
                    monthly: 250,
                    quarterly: 700,
                    semiAnnual: 1500,
                    annual: 2500
                },
                super: {
                    monthly: 1000,
                    quarterly: 2800,
                    semiAnnual: 5000,
                    annual: 8500
                },
                lenderOfLenders: {
                    monthly: 500,
                    quarterly: 1400,
                    semiAnnual: 3500,
                    annual: 6500
                }
            },
            
            // No borrower fees (STRICT)
            borrowerFees: "None",
            transactionFees: "None",
            withdrawalFees: "None",
            repaymentFees: "None",
            
            // Third-party fees
            thirdParty: {
                bankTransfer: "₦50 - ₦500 (bank dependent)",
                ussdCharge: "₦10 - ₦50 per transaction",
                smsAlert: "₦4 per alert",
                bankMaintenance: "₦50 monthly (some banks)"
            }
        },
        
        // Tax calculations (Nigeria specific)
        taxes: {
            withholdingTax: 0.10, // 10% on interest earned
            vat: 0.075, // 7.5% on subscription fees
            stampDuty: 50, // ₦50 on transfers above ₦10,000
            calculation: {
                withholding: "Interest × 0.10",
                vat: "Subscription × 0.075",
                stampDuty: "₦50 if transfer ≥ ₦10,000"
            },
            remittance: {
                withholdingTax: "To FIRS monthly",
                vat: "To FIRS monthly",
                stampDuty: "To FIRS automatically"
            }
        }
    },

    // ====================================================================
    // 5️⃣ FORMATTING & DISPLAY RULES (NIGERIAN CONTEXT)
    // ====================================================================
    formatting: {
        // Number formatting
        numberFormat: {
            decimalSeparator: ".",
            thousandSeparator: ",",
            decimalPlaces: 2,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            notation: "standard",
            compactDisplay: "short"
        },
        
        // Currency display options
        display: {
            symbolPosition: "before",
            symbolSpacing: true,
            positiveFormat: "{symbol}{amount}",
            negativeFormat: "-{symbol}{amount}",
            zeroFormat: "{symbol}0.00",
            compactFormat: {
                thousand: "{symbol}{amount}K",
                million: "{symbol}{amount}M",
                billion: "{symbol}{amount}B"
            }
        },
        
        // Nigerian locale formatting
        locale: {
            primary: "en-NG",
            alternatives: ["ha-NG", "yo-NG", "ig-NG"],
            dateFormat: "DD/MM/YYYY",
            timeFormat: "HH:mm",
            datetimeFormat: "DD/MM/YYYY HH:mm",
            firstDayOfWeek: 1 // Monday
        },
        
        // Accessibility formatting
        accessibility: {
            screenReader: {
                symbol: "Naira",
                decimal: "point",
                thousand: "thousand",
                million: "million",
                billion: "billion"
            },
            braille: "₦ with Nigerian Naira indicator",
            largePrint: "Minimum 16pt for amounts"
        }
    },

    // ====================================================================
    // 6️⃣ VALIDATION RULES (STRICT COMPLIANCE)
    // ====================================================================
    validation: {
        // Amount validation
        amount: {
            regex: /^₦?\d{1,3}(?:,\d{3})*(?:\.\d{2})?$|^\d{1,3}(?:,\d{3})*(?:\.\d{2})?$/,
            testCases: {
                valid: ["₦1,000.00", "1000", "₦500", "1,000.50", "1000000"],
                invalid: ["1000,000", "₦1.000", "1000.0", "abc", "₦"]
            }
        },
        
        // Bank account validation (Nigeria)
        bankAccount: {
            nubanLength: 10,
            regex: /^\d{10}$/,
            validationAlgorithm: "NUBAN checksum",
            sample: "0123456789"
        },
        
        // BVN validation
        bvn: {
            length: 11,
            regex: /^\d{11}$/,
            validation: "Central Bank verification",
            sample: "12345678901"
        },
        
        // Transaction validation rules
        transaction: {
            amountRange: { min: 50, max: 5000000 },
            frequency: { daily: 10, weekly: 50, monthly: 200 },
            velocity: { hourly: 50000, daily: 500000, weekly: 2000000 },
            patternDetection: [
                "Round number transactions",
                "Sequential transactions",
                "Rapid successive transactions",
                "Just below threshold amounts"
            ]
        }
    },

    // ====================================================================
    // 7️⃣ CONVERSION FUNCTIONS (STRICT ISOLATION)
    // ====================================================================
    conversion: {
        // Convert to other currencies (read-only, no cross-currency transactions)
        toOtherCurrencies: function(amountNGN) {
            return {
                USD: (amountNGN / this.exchange.baseRates.USD).toFixed(2),
                EUR: (amountNGN / this.exchange.baseRates.EUR).toFixed(2),
                GBP: (amountNGN / this.exchange.baseRates.GBP).toFixed(2),
                KES: (amountNGN / this.exchange.baseRates.KES).toFixed(2),
                GHS: (amountNGN / this.exchange.baseRates.GHS).toFixed(2),
                ZAR: (amountNGN / this.exchange.baseRates.ZAR).toFixed(2),
                XOF: (amountNGN / this.exchange.baseRates.XOF).toFixed(2),
                XAF: (amountNGN / this.exchange.baseRates.XAF).toFixed(2)
            };
        },
        
        // Convert from other currencies (for display only)
        fromOtherCurrencies: function(amount, currency) {
            const rate = this.exchange.baseRates[currency];
            if (!rate) throw new Error(`Unsupported currency: ${currency}`);
            return (amount * rate).toFixed(2);
        },
        
        // Format for display in Nigerian context
        formatForDisplay: function(amount, options = {}) {
            const config = {
                symbol: options.symbol !== undefined ? options.symbol : true,
                decimals: options.decimals !== undefined ? options.decimals : 2,
                compact: options.compact || false,
                locale: options.locale || 'en-NG'
            };
            
            let formatted;
            
            if (config.compact && amount >= 1000000) {
                // Millions
                const inMillions = amount / 1000000;
                formatted = `₦${inMillions.toFixed(1)}M`;
            } else if (config.compact && amount >= 1000) {
                // Thousands
                const inThousands = amount / 1000;
                formatted = `₦${inThousands.toFixed(1)}K`;
            } else {
                // Regular formatting
                formatted = new Intl.NumberFormat(config.locale, {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: config.decimals,
                    maximumFractionDigits: config.decimals
                }).format(amount);
                
                if (!config.symbol) {
                    formatted = formatted.replace('₦', '');
                }
            }
            
            return formatted;
        }
    }
};

// ====================================================================
// CURRENCY OPERATION FUNCTIONS
// ====================================================================

/**
 * Format Nigerian Naira amount with proper formatting
 * @param {number} amount - Amount in Naira
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
function formatNigerianNaira(amount, options = {}) {
    const defaults = {
        symbol: true,
        decimals: 2,
        compact: false,
        locale: 'en-NG',
        notation: 'standard'
    };
    
    const config = { ...defaults, ...options };
    
    if (isNaN(amount) || amount === null || amount === undefined) {
        return config.symbol ? '₦0.00' : '0.00';
    }
    
    // Ensure number
    amount = Number(amount);
    
    // Compact notation for large numbers
    if (config.compact) {
        if (amount >= 1000000000) {
            return config.symbol ? `₦${(amount / 1000000000).toFixed(1)}B` : `${(amount / 1000000000).toFixed(1)}B`;
        }
        if (amount >= 1000000) {
            return config.symbol ? `₦${(amount / 1000000).toFixed(1)}M` : `${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return config.symbol ? `₦${(amount / 1000).toFixed(1)}K` : `${(amount / 1000).toFixed(1)}K`;
        }
    }
    
    // Standard notation
    try {
        const formatter = new Intl.NumberFormat(config.locale, {
            style: config.symbol ? 'currency' : 'decimal',
            currency: 'NGN',
            minimumFractionDigits: config.decimals,
            maximumFractionDigits: config.decimals,
            notation: config.notation
        });
        
        let result = formatter.format(amount);
        
        // If symbol is false but we used currency style, remove the symbol
        if (!config.symbol && config.symbol !== undefined) {
            result = result.replace('₦', '').trim();
        }
        
        return result;
    } catch (error) {
        // Fallback formatting
        const formatted = amount.toFixed(config.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return config.symbol ? `₦${formatted}` : formatted;
    }
}

/**
 * Calculate loan repayment with Nigerian terms
 * @param {number} principal - Loan amount in NGN
 * @param {number} days - Loan duration in days
 * @param {Object} options - Calculation options
 * @returns {Object} Complete repayment breakdown
 */
function calculateNigerianLoanRepayment(principal, days = 7, options = {}) {
    const config = {
        interestRate: options.interestRate || 0.10, // 10% weekly
        penaltyRate: options.penaltyRate || 0.05,   // 5% daily after due
        gracePeriod: options.gracePeriod || 0,
        dueDays: options.dueDays || 7
    };
    
    // Validate principal
    if (principal < NigeriaCurrency.limits.platformLimits.borrower.minimumLoan) {
        throw new Error(`Minimum loan amount is ₦${NigeriaCurrency.limits.platformLimits.borrower.minimumLoan}`);
    }
    
    if (principal > NigeriaCurrency.limits.platformLimits.borrower.maximumLoanSuper) {
        throw new Error(`Maximum loan amount is ₦${NigeriaCurrency.limits.platformLimits.borrower.maximumLoanSuper} for Super tier`);
    }
    
    // Calculate interest for the period
    const weeks = days / 7;
    let interest = principal * config.interestRate * weeks;
    
    // Calculate penalty if overdue
    let penalty = 0;
    let overdueDays = 0;
    
    if (days > config.dueDays) {
        overdueDays = days - config.dueDays - config.gracePeriod;
        if (overdueDays > 0) {
            penalty = principal * config.penaltyRate * overdueDays;
        }
    }
    
    // Calculate total
    const total = principal + interest + penalty;
    
    // Calculate daily repayment (for budgeting)
    const dailyRepayment = total / days;
    
    // Calculate weekly repayment (standard 7-day loans)
    const weeklyRepayment = days >= 7 ? total / (days / 7) : total;
    
    return {
        principal: principal,
        currency: "NGN",
        duration: {
            days: days,
            weeks: weeks.toFixed(2),
            overdueDays: overdueDays
        },
        interest: {
            rate: `${config.interestRate * 100}% weekly`,
            amount: Math.round(interest),
            calculatedFor: `${weeks.toFixed(2)} weeks`
        },
        penalty: {
            rate: overdueDays > 0 ? `${config.penaltyRate * 100}% daily` : "0%",
            amount: Math.round(penalty),
            overdueDays: overdueDays
        },
        totals: {
            subtotal: principal + interest,
            total: Math.round(total),
            breakdown: {
                principal: Math.round(principal),
                interest: Math.round(interest),
                penalty: Math.round(penalty)
            }
        },
        repaymentSchedule: {
            daily: Math.round(dailyRepayment),
            weekly: Math.round(weeklyRepayment),
            totalDays: days,
            suggestedRepayment: Math.round(dailyRepayment * 7) // Weekly amount
        },
        dueDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        formatted: {
            principal: formatNigerianNaira(principal),
            interest: formatNigerianNaira(interest),
            penalty: formatNigerianNaira(penalty),
            total: formatNigerianNaira(total),
            daily: formatNigerianNaira(dailyRepayment),
            weekly: formatNigerianNaira(weeklyRepayment)
        }
    };
}

/**
 * Validate Nigerian transaction amount against all limits
 * @param {number} amount - Transaction amount in NGN
 * @param {string} userType - 'borrower' or 'lender'
 * @param {string} tier - Subscription tier
 * @param {Object} userProfile - User profile information
 * @returns {Object} Validation result
 */
function validateNigerianTransaction(amount, userType, tier, userProfile = {}) {
    const errors = [];
    const warnings = [];
    
    // Basic amount validation
    if (isNaN(amount) || amount <= 0) {
        errors.push("Amount must be a positive number");
        return { valid: false, errors, warnings };
    }
    
    // Check minimum amount
    const minAmount = NigeriaCurrency.limits.platformLimits.borrower.minimumLoan;
    if (amount < minAmount) {
        errors.push(`Minimum transaction amount is ${formatNigerianNaira(minAmount)}`);
    }
    
    // User type specific validation
    if (userType === 'borrower') {
        const tierLimits = {
            basic: NigeriaCurrency.limits.platformLimits.borrower.maximumLoanBasic,
            premium: NigeriaCurrency.limits.platformLimits.borrower.maximumLoanPremium,
            super: NigeriaCurrency.limits.platformLimits.borrower.maximumLoanSuper,
            lenderOfLenders: NigeriaCurrency.limits.platformLimits.borrower.maximumLoanLenderOfLenders
        };
        
        const limit = tierLimits[tier];
        if (!limit) {
            errors.push(`Invalid subscription tier: ${tier}`);
        } else if (amount > limit) {
            errors.push(`Maximum loan amount for ${tier} tier is ${formatNigerianNaira(limit)}`);
        }
        
        // Age-based restrictions
        if (userProfile.age) {
            const ageGroup = getAgeGroup(userProfile.age);
            const ageLimit = NigeriaCurrency.limits.ageRestrictions[ageGroup]?.maximumLoan;
            if (ageLimit && amount > ageLimit) {
                warnings.push(`Amount exceeds recommended limit for age group ${ageGroup}`);
            }
        }
        
    } else if (userType === 'lender') {
        // Check against lender limits
        if (amount > NigeriaCurrency.limits.platformLimits.lender.maximumDailyLend) {
            warnings.push(`Amount exceeds recommended daily lending limit`);
        }
        
        // Check per-borrower limit
        if (userProfile.perBorrowerLimit && amount > userProfile.perBorrowerLimit) {
            warnings.push(`Amount exceeds per-borrower limit of ${formatNigerianNaira(userProfile.perBorrowerLimit)}`);
        }
    }
    
    // Check against CBN regulations
    if (amount > NigeriaCurrency.limits.cbnRegulations.maximumTransfer) {
        errors.push(`Amount exceeds CBN maximum transfer limit of ${formatNigerianNaira(NigeriaCurrency.limits.cbnRegulations.maximumTransfer)}`);
    }
    
    // Check for round numbers (potential structuring)
    if (amount % 10000 === 0 && amount >= 100000) {
        warnings.push("Round number transactions may be subject to additional verification");
    }
    
    // Check if amount is just below reporting threshold
    const reportingThreshold = NigeriaCurrency.limits.cbnRegulations.reportingThreshold;
    if (amount > reportingThreshold * 0.9 && amount < reportingThreshold) {
        warnings.push("Amount is close to STR reporting threshold");
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        limits: {
            minimum: minAmount,
            maximum: userType === 'borrower' 
                ? NigeriaCurrency.limits.platformLimits.borrower[`maximumLoan${tier.charAt(0).toUpperCase() + tier.slice(1)}`]
                : NigeriaCurrency.limits.platformLimits.lender.maximumDailyLend,
            cbnMaximum: NigeriaCurrency.limits.cbnRegulations.maximumTransfer
        }
    };
}

/**
 * Convert amount to words (Nigerian English)
 * @param {number} amount - Amount in NGN
 * @returns {string} Amount in words
 */
function amountToNigerianWords(amount) {
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion'];
    
    // Handle decimal part (Kobo)
    const naira = Math.floor(amount);
    const kobo = Math.round((amount - naira) * 100);
    
    if (amount === 0) return 'Zero Naira';
    
    function convertThreeDigits(num) {
        let result = '';
        const hundreds = Math.floor(num / 100);
        const remainder = num % 100;
        
        if (hundreds > 0) {
            result += units[hundreds] + ' hundred';
            if (remainder > 0) result += ' and ';
        }
        
        if (remainder > 0) {
            if (remainder < 10) {
                result += units[remainder];
            } else if (remainder < 20) {
                result += teens[remainder - 10];
            } else {
                const ten = Math.floor(remainder / 10);
                const unit = remainder % 10;
                result += tens[ten];
                if (unit > 0) result += '-' + units[unit];
            }
        }
        
        return result;
    }
    
    function convertNumber(num) {
        if (num === 0) return '';
        
        let result = '';
        let scaleIndex = 0;
        
        while (num > 0) {
            const chunk = num % 1000;
            if (chunk > 0) {
                let chunkWords = convertThreeDigits(chunk);
                if (scaleIndex > 0) {
                    chunkWords += ' ' + scales[scaleIndex];
                }
                result = chunkWords + (result ? ' ' + result : '');
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
        }
        
        return result.trim();
    }
    
    const nairaWords = convertNumber(naira);
    let result = nairaWords + (nairaWords ? ' Naira' : '');
    
    if (kobo > 0) {
        const koboWords = convertNumber(kobo);
        result += (nairaWords ? ' and ' : '') + koboWords + ' Kobo';
    }
    
    // Capitalize first letter
    return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Parse Nigerian currency string to number
 * @param {string} currencyString - Currency string like "₦1,000.50"
 * @returns {number} Parsed number
 */
function parseNigerianCurrency(currencyString) {
    if (!currencyString || typeof currencyString !== 'string') {
        return 0;
    }
    
    // Remove currency symbol, commas, and trim
    let cleaned = currencyString
        .replace(/₦/g, '')
        .replace(/,/g, '')
        .trim();
    
    // Parse as float
    const parsed = parseFloat(cleaned);
    
    // Return 0 if parsing fails
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculate withholding tax for Nigerian lenders
 * @param {number} interestEarned - Interest amount in NGN
 * @returns {Object} Tax calculation breakdown
 */
function calculateNigerianWithholdingTax(interestEarned) {
    const taxRate = NigeriaCurrency.calculations.taxes.withholdingTax; // 10%
    const taxAmount = interestEarned * taxRate;
    const netAmount = interestEarned - taxAmount;
    
    return {
        grossInterest: interestEarned,
        taxRate: `${taxRate * 100}%`,
        taxAmount: Math.round(taxAmount),
        netAmount: Math.round(netAmount),
        dueDate: "21st of following month",
        authority: "Federal Inland Revenue Service (FIRS)",
        form: "Form WHT 002",
        remittanceAccount: "CBN WHT Collection Account",
        penalties: {
            lateFiling: "₦25,000 per month",
            latePayment: "10% of tax due plus interest"
        }
    };
}

/**
 * Get age group for Nigerian restrictions
 * @param {number} age - User age
 * @returns {string} Age group
 */
function getAgeGroup(age) {
    if (age >= 18 && age <= 24) return "18-24";
    if (age >= 25 && age <= 35) return "25-35";
    if (age >= 36 && age <= 50) return "36-50";
    if (age >= 51) return "51+";
    return "underage";
}

// ====================================================================
// EXPORT MODULE
// ====================================================================
module.exports = {
    currency: NigeriaCurrency,
    formatNigerianNaira,
    calculateNigerianLoanRepayment,
    validateNigerianTransaction,
    amountToNigerianWords,
    parseNigerianCurrency,
    calculateNigerianWithholdingTax,
    getAgeGroup
};

// ====================================================================
// INITIALIZATION
// ====================================================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║            M-PESEWA NIGERIA CURRENCY MODULE               ║
║            Nigerian Naira (NGN) Operations                ║
╚════════════════════════════════════════════════════════════╝

Currency Specification:
• Code: ${NigeriaCurrency.specification.code}
• Symbol: ${NigeriaCurrency.specification.symbol}
• Name: ${NigeriaCurrency.specification.name}
• ISO 4217: ${NigeriaCurrency.specification.iso4217}
• Central Bank: ${NigeriaCurrency.specification.centralBank}

Exchange Rates (₦ per 1 unit):
• USD: ${NigeriaCurrency.exchange.baseRates.USD}
• EUR: ${NigeriaCurrency.exchange.baseRates.EUR}
• GBP: ${NigeriaCurrency.exchange.baseRates.GBP}
• KES: ${NigeriaCurrency.exchange.baseRates.KES}
• GHS: ${NigeriaCurrency.exchange.baseRates.GHS}

Transaction Limits:
• Minimum Loan: ${formatNigerianNaira(NigeriaCurrency.limits.platformLimits.borrower.minimumLoan)}
• Maximum Basic Tier: ${formatNigerianNaira(NigeriaCurrency.limits.platformLimits.borrower.maximumLoanBasic)}
• Maximum Premium Tier: ${formatNigerianNaira(NigeriaCurrency.limits.platformLimits.borrower.maximumLoanPremium)}
• Maximum Super Tier: ${formatNigerianNaira(NigeriaCurrency.limits.platformLimits.borrower.maximumLoanSuper)}
• CBN Daily Limit: ${formatNigerianNaira(NigeriaCurrency.limits.cbnRegulations.individualDailyLimit)}

Financial Calculations:
• Interest Rate: ${NigeriaCurrency.calculations.interest.rate * 100}% weekly
• Penalty Rate: ${NigeriaCurrency.calculations.penalty.rate * 100}% daily after 7 days
• Withholding Tax: ${NigeriaCurrency.calculations.taxes.withholdingTax * 100}% on interest
• VAT: ${NigeriaCurrency.calculations.taxes.vat * 100}% on subscriptions

Available Functions:
• formatNigerianNaira() - Format NGN amounts
• calculateNigerianLoanRepayment() - Loan calculations
• validateNigerianTransaction() - Limit validation
• amountToNigerianWords() - Amount in words
• parseNigerianCurrency() - Parse currency strings
• calculateNigerianWithholdingTax() - Tax calculations
• getAgeGroup() - Age-based restrictions

Ready for Nigerian currency operations with strict compliance.
`);