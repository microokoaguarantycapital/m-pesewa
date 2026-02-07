/**
 * M-PESEWA DRC CURRENCY CONFIGURATION
 * FRANC CONGOLAIS (CDF) OPERATIONS FOR DEMOCRATIC REPUBLIC OF CONGO
 * Last Updated: 2026-01-24
 */

const DRC_CURRENCY = {
    // ============================================
    // 1️⃣ CURRENCY IDENTIFICATION & META
    // ============================================
    IDENTIFICATION: {
        COUNTRY: 'Democratic Republic of the Congo',
        CURRENCY_CODE: 'CDF',
        CURRENCY_NAME: {
            FR: 'Franc Congolais',
            SW: 'Faranga ya Kongo',
            LN: 'Falanga ya Kongo'
        },
        SYMBOL: 'FC',
        ISO_4217: {
            CODE: 'CDF',
            NUMBER: 976,
            MINOR_UNIT: 2
        },
        
        // Historical context
        HISTORY: {
            INTRODUCED: 1997,
            REPLACED: 'Nouveau Zaïre (ZRN)',
            EXCHANGE_RATE: '1 CDF = 100,000 ZRN',
            CENTRAL_BANK: 'Banque Centrale du Congo (BCC)'
        }
    },
    
    // ============================================
    // 2️⃣ DENOMINATIONS & PHYSICAL MONEY
    // ============================================
    DENOMINATIONS: {
        BANKNOTES: {
            CURRENT: [
                {
                    VALUE: 50,
                    SERIES: '2021 Series',
                    DIMENSIONS: '130 × 65 mm',
                    COLOR: 'Blue',
                    FRONT_IMAGE: 'Bonobo',
                    BACK_IMAGE: 'Okapi'
                },
                {
                    VALUE: 100,
                    SERIES: '2021 Series',
                    DIMENSIONS: '135 × 67 mm',
                    COLOR: 'Green',
                    FRONT_IMAGE: 'Buffalo',
                    BACK_IMAGE: 'Palm trees'
                },
                {
                    VALUE: 200,
                    SERIES: '2021 Series',
                    DIMENSIONS: '140 × 69 mm',
                    COLOR: 'Brown',
                    FRONT_IMAGE: 'Lion',
                    BACK_IMAGE: 'Mountain gorilla'
                },
                {
                    VALUE: 500,
                    SERIES: '2021 Series',
                    DIMENSIONS: '145 × 71 mm',
                    COLOR: 'Purple',
                    FRONT_IMAGE: 'Elephant',
                    BACK_IMAGE: 'Victoria Falls'
                },
                {
                    VALUE: 1000,
                    SERIES: '2021 Series',
                    DIMENSIONS: '150 × 73 mm',
                    COLOR: 'Red',
                    FRONT_IMAGE: 'Leopard',
                    BACK_IMAGE: 'Lualaba River'
                },
                {
                    VALUE: 5000,
                    SERIES: '2021 Series',
                    DIMENSIONS: '155 × 75 mm',
                    COLOR: 'Orange',
                    FRONT_IMAGE: 'Giraffe',
                    BACK_IMAGE: 'Congo River'
                },
                {
                    VALUE: 10000,
                    SERIES: '2021 Series',
                    DIMENSIONS: '160 × 77 mm',
                    COLOR: 'Blue-Green',
                    FRONT_IMAGE: 'Hippopotamus',
                    BACK_IMAGE: 'Lubumbashi mining'
                },
                {
                    VALUE: 20000,
                    SERIES: '2021 Series',
                    DIMENSIONS: '165 × 79 mm',
                    COLOR: 'Gray',
                    FRONT_IMAGE: 'Rhinoceros',
                    BACK_IMAGE: 'Kinshasa skyline'
                }
            ],
            
            OBSOLETE: [
                { VALUE: 1, STATUS: 'Demonetized 2012' },
                { VALUE: 5, STATUS: 'Demonetized 2012' },
                { VALUE: 10, STATUS: 'Demonetized 2012' },
                { VALUE: 20, STATUS: 'Demonetized 2012' }
            ],
            
            SECURITY_FEATURES: [
                'Watermark: Animal portrait',
                'Security thread: Microprinting "BCC"',
                'Holographic stripe',
                'UV fluorescent ink',
                'Raised printing (intaglio)',
                'See-through register',
                'Color-shifting ink (5000+ notes)'
            ]
        },
        
        COINS: {
            CURRENT: [
                { VALUE: 1, METAL: 'Stainless Steel', DIAMETER: '17 mm', WEIGHT: '2.0 g' },
                { VALUE: 5, METAL: 'Stainless Steel', DIAMETER: '19 mm', WEIGHT: '3.0 g' },
                { VALUE: 10, METAL: 'Stainless Steel', DIAMETER: '21 mm', WEIGHT: '4.0 g' },
                { VALUE: 20, METAL: 'Stainless Steel', DIAMETER: '23 mm', WEIGHT: '5.0 g' },
                { VALUE: 50, METAL: 'Brass-plated Steel', DIAMETER: '25 mm', WEIGHT: '6.0 g' }
            ],
            
            CIRCULATION_STATUS: 'Limited (mostly used in rural areas)',
            MINT: 'Royal Dutch Mint',
            LAST_MINTED: 2018
        }
    },
    
    // ============================================
    // 3️⃣ EXCHANGE RATES & CONVERSIONS
    // ============================================
    EXCHANGE_RATES: {
        // As of 2026-01-24 (example rates - would be updated via API)
        CURRENT: {
            USD: {
                BUY: 2500,
                SELL: 2550,
                MIDDLE: 2525,
                LAST_UPDATED: '2026-01-24T12:00:00Z',
                SOURCE: 'Banque Centrale du Congo'
            },
            EUR: {
                BUY: 2700,
                SELL: 2750,
                MIDDLE: 2725,
                LAST_UPDATED: '2026-01-24T12:00:00Z',
                SOURCE: 'Banque Centrale du Congo'
            },
            GBP: {
                BUY: 3150,
                SELL: 3200,
                MIDDLE: 3175,
                LAST_UPDATED: '2026-01-24T12:00:00Z',
                SOURCE: 'Banque Centrale du Congo'
            },
            XAF: {
                BUY: 4.1,
                SELL: 4.2,
                MIDDLE: 4.15,
                LAST_UPDATED: '2026-01-24T12:00:00Z',
                SOURCE: 'Banque Centrale du Congo'
            }
        },
        
        HISTORICAL_TRENDS: {
            '2025': {
                HIGH: 2800,
                LOW: 2300,
                AVERAGE: 2550,
                VOLATILITY: '15%'
            },
            '2024': {
                HIGH: 2600,
                LOW: 2100,
                AVERAGE: 2350,
                VOLATILITY: '12%'
            },
            '2023': {
                HIGH: 2400,
                LOW: 1900,
                AVERAGE: 2150,
                VOLATILITY: '13%'
            }
        },
        
        INFLATION_RATES: {
            '2025': 8.5,
            '2024': 9.2,
            '2023': 10.8,
            '2022': 12.5,
            '2021': 15.0,
            TARGET: 7.0,
            CENTRAL_BANK_TARGET: 'Single digit by 2027'
        }
    },
    
    // ============================================
    // 4️⃣ M-PESEWA FINANCIAL PARAMETERS (CDF)
    // ============================================
    MPESEWA_PARAMETERS: {
        // Minimum and Maximum amounts in CDF
        LIMITS: {
            MIN_LOAN_AMOUNT: 500,
            MAX_LOAN_AMOUNT: 48000,
            
            // Subscription tier limits (weekly)
            TIER_LIMITS: {
                BASIC: 3000,
                PREMIUM: 12000,
                SUPER: 48000,
                LENDER_OF_LENDERS: 120000
            },
            
            // Daily transaction limits
            DAILY: {
                BORROWER: 48000,
                LENDER: 200000,
                GROUP: 500000
            },
            
            // Monthly transaction limits
            MONTHLY: {
                BORROWER: 200000,
                LENDER: 1000000,
                GROUP: 2000000
            }
        },
        
        // Interest and penalty calculations
        CALCULATIONS: {
            INTEREST_RATE: 10, // Percentage per 7 days
            PENALTY_RATE: 5,   // Percentage daily after 7 days
            COMPOUNDING: 'Simple interest only (no compounding)',
            
            // Calculation examples
            EXAMPLES: [
                {
                    AMOUNT: 1000,
                    TERM: 7,
                    INTEREST: 100,
                    TOTAL: 1100,
                    DAILY_PAYMENT: 157.14
                },
                {
                    AMOUNT: 5000,
                    TERM: 7,
                    INTEREST: 500,
                    TOTAL: 5500,
                    DAILY_PAYMENT: 785.71
                },
                {
                    AMOUNT: 10000,
                    TERM: 7,
                    INTEREST: 1000,
                    TOTAL: 11000,
                    DAILY_PAYMENT: 1571.43
                }
            ]
        },
        
        // Subscription fees in CDF
        SUBSCRIPTION_FEES: {
            BASIC: {
                MONTHLY: 1200,
                BI_ANNUAL: 6000,
                ANNUAL: 10000,
                DISCOUNT: '16.7% for annual'
            },
            PREMIUM: {
                MONTHLY: 6000,
                BI_ANNUAL: 36000,
                ANNUAL: 60000,
                DISCOUNT: '16.7% for annual'
            },
            SUPER: {
                MONTHLY: 24000,
                BI_ANNUAL: 120000,
                ANNUAL: 204000,
                DISCOUNT: '15% for annual'
            },
            LENDER_OF_LENDERS: {
                MONTHLY: 12000,
                BI_ANNUAL: 84000,
                ANNUAL: 156000,
                DISCOUNT: '8.3% for annual'
            }
        }
    },
    
    // ============================================
    // 5️⃣ REGIONAL ECONOMIC CONTEXT
    // ============================================
    REGIONAL_CONTEXT: {
        GDP: {
            NOMINAL: '60 billion USD',
            PER_CAPITA: '540 USD',
            GROWTH_RATE: '6.2%',
            SECTORS: {
                MINING: '25%',
                AGRICULTURE: '40%',
                SERVICES: '30%',
                INDUSTRY: '5%'
            }
        },
        
        FINANCIAL_INCLUSION: {
            BANKED_POPULATION: '30%',
            MOBILE_MONEY_USERS: '45%',
            FORMAL_CREDIT_ACCESS: '15%',
            INSURANCE_PENETRATION: '3%'
        },
        
        POVERTY_INDICATORS: {
            POVERTY_RATE: '72%',
            EXTREME_POVERTY: '42%',
            UNEMPLOYMENT: '46%',
            YOUTH_UNEMPLOYMENT: '65%'
        },
        
        REMITTANCES: {
            INFLOW: '1.2 billion USD',
            OUTFLOW: '0.3 billion USD',
            SOURCES: ['South Africa', 'Angola', 'Uganda', 'Rwanda'],
            COST: '8-12% (average)'
        }
    },
    
    // ============================================
    // 6️⃣ DIGITAL PAYMENT ECOSYSTEM
    // ============================================
    DIGITAL_PAYMENTS: {
        MOBILE_MONEY: {
            PROVIDERS: [
                {
                    NAME: 'Vodacom M-Pesa',
                    MARKET_SHARE: '45%',
                    USERS: '15 million',
                    TRANSACTION_VOLUME: '2 billion USD/year',
                    FEES: {
                        DEPOSIT: '0.5%',
                        WITHDRAWAL: '1.5%',
                        TRANSFER: '1.0%'
                    }
                },
                {
                    NAME: 'Orange Money',
                    MARKET_SHARE: '35%',
                    USERS: '12 million',
                    TRANSACTION_VOLUME: '1.5 billion USD/year',
                    FEES: {
                        DEPOSIT: '0.4%',
                        WITHDRAWAL: '1.4%',
                        TRANSFER: '0.9%'
                    }
                },
                {
                    NAME: 'Airtel Money',
                    MARKET_SHARE: '15%',
                    USERS: '5 million',
                    TRANSACTION_VOLUME: '0.8 billion USD/year',
                    FEES: {
                        DEPOSIT: '0.3%',
                        WITHDRAWAL: '1.2%',
                        TRANSFER: '0.8%'
                    }
                },
                {
                    NAME: 'Africell Money',
                    MARKET_SHARE: '5%',
                    USERS: '2 million',
                    TRANSACTION_VOLUME: '0.3 billion USD/year',
                    FEES: {
                        DEPOSIT: '0.2%',
                        WITHDRAWAL: '1.0%',
                        TRANSFER: '0.7%'
                    }
                }
            ],
            
            REGULATIONS: {
                DAILY_LIMIT: '500,000 CDF',
                MONTHLY_LIMIT: '5,000,000 CDF',
                KYC_REQUIREMENTS: 'Phone registration + ID for limits > 100,000 CDF',
                INTEROPERABILITY: 'Mandated by BCC since 2022'
            }
        },
        
        BANK_TRANSFERS: {
            MAJOR_BANKS: [
                'Rawbank',
                'Equity BCDC',
                'Trust Merchant Bank',
                'Bank of Africa',
                'Ecobank',
                'Stanbic Bank',
                'United Bank for Africa'
            ],
            
            TRANSFER_TIMES: {
                INTRA_BANK: 'Instant',
                INTER_BANK: '2-24 hours',
                SWIFT: '2-5 business days'
            },
            
            FEES: {
                INTRA_BANK: '0.1-0.5%',
                INTER_BANK: '0.5-2%',
                SWIFT: '25-50 USD'
            }
        },
        
        CASH_ECONOMY: {
            DOMINANCE: '85% of transactions',
            REASONS: [
                'Low banking penetration',
                'High banking fees',
                'Limited POS infrastructure',
                'Cultural preference for cash',
                'Informal economy dominance'
            ],
            
            CHALLENGES: [
                'Security risks',
                'Inflation hedging',
                'Illicit flows',
                'Tax collection'
            ]
        }
    },
    
    // ============================================
    // 7️⃣ CURRENCY FORMATTING & LOCALIZATION
    // ============================================
    FORMATTING: {
        // Number formatting rules
        NUMBER_FORMATS: {
            FRENCH: {
                DECIMAL_SEPARATOR: ',',
                THOUSANDS_SEPARATOR: ' ',
                CURRENCY_POSITION: 'after',
                EXAMPLE: '1 234,56 FC'
            },
            ENGLISH: {
                DECIMAL_SEPARATOR: '.',
                THOUSANDS_SEPARATOR: ',',
                CURRENCY_POSITION: 'before',
                EXAMPLE: 'FC 1,234.56'
            },
            SWAHILI: {
                DECIMAL_SEPARATOR: '.',
                THOUSANDS_SEPARATOR: ',',
                CURRENCY_POSITION: 'before',
                EXAMPLE: 'FC 1,234.56'
            },
            LINGALA: {
                DECIMAL_SEPARATOR: ',',
                THOUSANDS_SEPARATOR: '.',
                CURRENCY_POSITION: 'after',
                EXAMPLE: '1.234,56 FC'
            }
        },
        
        // Standard display formats
        DISPLAY_FORMATS: {
            SHORT: {
                MIN_DECIMALS: 0,
                MAX_DECIMALS: 0,
                ROUNDING: 'ceil',
                SUFFIX: ' FC'
            },
            MEDIUM: {
                MIN_DECIMALS: 0,
                MAX_DECIMALS: 2,
                ROUNDING: 'half-up',
                SUFFIX: ' FC'
            },
            LONG: {
                MIN_DECIMALS: 2,
                MAX_DECIMALS: 2,
                ROUNDING: 'half-up',
                SUFFIX: ' Francs Congolais'
            },
            COMPACT: {
                MIN_DECIMALS: 1,
                MAX_DECIMALS: 1,
                ROUNDING: 'half-up',
                NOTATIONS: [
                    { THRESHOLD: 1000000, SUFFIX: 'M' },
                    { THRESHOLD: 1000, SUFFIX: 'K' }
                ]
            }
        },
        
        // Verbal representations
        VERBAL: {
            FRENCH: {
                INTEGER_MAP: {
                    0: 'zéro', 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq',
                    6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf', 10: 'dix'
                },
                TENS: {
                    10: 'dix', 20: 'vingt', 30: 'trente', 40: 'quarante', 50: 'cinquante',
                    60: 'soixante', 70: 'soixante-dix', 80: 'quatre-vingt', 90: 'quatre-vingt-dix'
                },
                PLURAL: 'francs',
                SINGULAR: 'franc',
                CENTS: 'centimes'
            }
        }
    },
    
    // ============================================
    // 8️⃣ COMPLIANCE & REGULATORY FRAMEWORK
    // ============================================
    COMPLIANCE: {
        CENTRAL_BANK_REGULATIONS: {
            MONETARY_POLICY: {
                POLICY_RATE: '7.5%',
                RESERVE_REQUIREMENT: '10%',
                LIQUIDITY_RATIO: '20%'
            },
            
            CURRENCY_CONTROLS: {
                EXPORT_LIMIT: '10,000 USD equivalent',
                IMPORT_LIMIT: 'No limit (declaration > 10,000 USD)',
                BLACK_MARKET: 'Illegal but prevalent (premium 15-25%)'
            },
            
            REPORTING_THRESHOLDS: {
                CASH_TRANSACTION: '5,000,000 CDF',
                SUSPICIOUS_ACTIVITY: 'Any unusual pattern',
                CROSS_BORDER: '10,000 USD equivalent'
            }
        },
        
        TAXATION: {
            VAT: '16% (on goods and services)',
            CORPORATE_TAX: '30%',
            PERSONAL_INCOME_TAX: {
                BRACKETS: [
                    { UP_TO: 1560000, RATE: 0 },
                    { UP_TO: 4680000, RATE: 15 },
                    { UP_TO: 15600000, RATE: 20 },
                    { ABOVE: 15600000, RATE: 30 }
                ]
            },
            WITHHOLDING_TAX: {
                DIVIDENDS: '10%',
                INTEREST: '20%',
                ROYALTIES: '20%'
            }
        },
        
        AML_CFT_REQUIREMENTS: {
            KYC: {
                TIER_1: 'Phone number only',
                TIER_2: 'National ID + proof of address',
                TIER_3: 'Enhanced due diligence for high-risk'
            },
            
            TRANSACTION_MONITORING: {
                THRESHOLDS: {
                    DAILY: 500000,
                    WEEKLY: 2000000,
                    MONTHLY: 5000000
                },
                
                FLAGGING_RULES: [
                    'Multiple transactions just below threshold',
                    'Rapid movement of funds',
                    'Transactions with high-risk jurisdictions'
                ]
            }
        }
    },
    
    // ============================================
    // 9️⃣ CURRENCY UTILITIES & CONVERSIONS
    // ============================================
    UTILITIES: {
        // Common amounts in daily life (CDF)
        DAILY_AMOUNTS: {
            MINIBUS_FARE: {
                URBAN: 500,
                SUBURBAN: 1000,
                INTERCITY: 5000
            },
            MEAL: {
                STREET_FOOD: 1000,
                LOCAL_RESTAURANT: 3000,
                INTERNATIONAL_RESTAURANT: 15000
            },
            MOBILE_DATA: {
                DAILY: 500,
                WEEKLY: 2000,
                MONTHLY: 8000
            },
            RENT: {
                ROOM: 50000,
                APARTMENT: 200000,
                HOUSE: 500000
            }
        },
        
        // Salary ranges (monthly in CDF)
        SALARY_RANGES: {
            INFORMAL_SECTOR: {
                MIN: 30000,
                MAX: 100000,
                AVERAGE: 60000
            },
            FORMAL_SECTOR: {
                JUNIOR: 100000,
                MID: 300000,
                SENIOR: 800000,
                EXECUTIVE: 2000000
            },
            PUBLIC_SECTOR: {
                TEACHER: 150000,
                NURSE: 200000,
                DOCTOR: 500000,
                MINISTER: 3000000
            }
        }
    },
    
    // ============================================
    // 🔟 FUTURE OUTLOOK & DIGITALIZATION
    // ============================================
    FUTURE_OUTLOOK: {
        DIGITAL_CURRENCY: {
            CBDC_PILOT: 'Planned 2027',
            TECHNOLOGY: 'Blockchain-based',
            PARTNERS: ['IMF', 'World Bank', 'African Development Bank']
        },
        
        FINANCIAL_INCLUSION_TARGETS: {
            '2026': '40% banked population',
            '2027': '50% mobile money penetration',
            '2028': '25% formal credit access',
            '2030': '60% digital payments'
        },
        
        MONETARY_POLICY_GOALS: {
            INFLATION_TARGET: '7% by 2027',
            EXCHANGE_RATE_STABILITY: '+/- 5% band',
            FOREX_RESERVES: '3 months import cover'
        }
    }
};

// ============================================
// CURRENCY UTILITIES & FUNCTIONS
// ============================================

// Format currency based on language and format type
export const formatCurrency = (amount, language = 'FR', formatType = 'MEDIUM') => {
    const formats = DRC_CURRENCY.FORMATTING.FORMATS || DRC_CURRENCY.FORMATTING.DISPLAY_FORMATS;
    const numberFormats = DRC_CURRENCY.FORMATTING.NUMBER_FORMATS;
    
    // Get format configuration
    const format = formats[formatType] || formats.MEDIUM;
    const numberFormat = numberFormats[language] || numberFormats.FRENCH;
    
    // Round the amount
    let roundedAmount;
    switch (format.ROUNDING) {
        case 'ceil':
            roundedAmount = Math.ceil(amount);
            break;
        case 'floor':
            roundedAmount = Math.floor(amount);
            break;
        case 'half-up':
            roundedAmount = Math.round(amount);
            break;
        default:
            roundedAmount = amount;
    }
    
    // Format number with separators
    const parts = roundedAmount.toFixed(format.MAX_DECIMALS).split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1] || '';
    
    // Add thousands separator
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, numberFormat.THOUSANDS_SEPARATOR);
    
    // Combine with decimal part
    let formattedNumber = integerPart;
    if (decimalPart && format.MIN_DECIMALS > 0) {
        formattedNumber += numberFormat.DECIMAL_SEPARATOR + decimalPart.padEnd(format.MIN_DECIMALS, '0');
    }
    
    // Add currency symbol/suffix
    let result;
    if (numberFormat.CURRENCY_POSITION === 'before') {
        result = `${DRC_CURRENCY.IDENTIFICATION.SYMBOL} ${formattedNumber}`;
    } else {
        result = `${formattedNumber} ${DRC_CURRENCY.IDENTIFICATION.SYMBOL}`;
    }
    
    return result;
};

// Calculate loan interest and repayment amounts
export const calculateLoan = (principal, days = 7, overdueDays = 0) => {
    const interestRate = DRC_CURRENCY.MPESEWA_PARAMETERS.CALCULATIONS.INTEREST_RATE / 100;
    const penaltyRate = DRC_CURRENCY.MPESEWA_PARAMETERS.CALCULATIONS.PENALTY_RATE / 100;
    
    // Calculate interest for the term
    const dailyInterestRate = interestRate / 7;
    const interest = principal * dailyInterestRate * days;
    
    // Calculate penalty if overdue
    let penalty = 0;
    if (overdueDays > 0) {
        penalty = principal * penaltyRate * overdueDays;
    }
    
    const totalRepayment = principal + interest + penalty;
    const dailyPayment = totalRepayment / (days + overdueDays);
    
    return {
        principal: Math.ceil(principal),
        interest: Math.ceil(interest),
        penalty: Math.ceil(penalty),
        totalRepayment: Math.ceil(totalRepayment),
        dailyPayment: Math.ceil(dailyPayment),
        days,
        overdueDays,
        breakdown: {
            daily: {
                principal: Math.ceil(principal / days),
                interest: Math.ceil(interest / days)
            }
        }
    };
};

// Convert between currencies
export const convertCurrency = (amount, fromCurrency, toCurrency = 'CDF', date = new Date()) => {
    const rates = DRC_CURRENCY.EXCHANGE_RATES.CURRENT;
    
    if (!rates[fromCurrency]) {
        throw new Error(`Exchange rate not available for ${fromCurrency}`);
    }
    
    let result;
    
    if (fromCurrency === 'CDF' && toCurrency !== 'CDF') {
        // Convert from CDF to foreign currency
        const rate = rates[toCurrency];
        result = amount / rate.MIDDLE;
    } else if (toCurrency === 'CDF' && fromCurrency !== 'CDF') {
        // Convert from foreign currency to CDF
        const rate = rates[fromCurrency];
        result = amount * rate.MIDDLE;
    } else {
        // Convert between two foreign currencies (via CDF)
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        result = (amount * fromRate.MIDDLE) / toRate.MIDDLE;
    }
    
    return {
        amount,
        fromCurrency,
        toCurrency,
        convertedAmount: parseFloat(result.toFixed(2)),
        exchangeRate: rates[fromCurrency]?.MIDDLE || 1,
        date: date.toISOString(),
        source: DRC_CURRENCY.EXCHANGE_RATES.CURRENT[fromCurrency]?.SOURCE || 'M-PESEWA DRC'
    };
};

// Validate amount against limits
export const validateAmount = (amount, tier = null, transactionType = 'LOAN') => {
    const limits = DRC_CURRENCY.MPESEWA_PARAMETERS.LIMITS;
    const errors = [];
    const warnings = [];
    
    // Check against absolute limits
    if (amount < limits.MIN_LOAN_AMOUNT) {
        errors.push(`BELOW_MINIMUM: ${amount} CDF is below minimum ${limits.MIN_LOAN_AMOUNT} CDF`);
    }
    
    if (amount > limits.MAX_LOAN_AMOUNT && transactionType === 'LOAN') {
        errors.push(`ABOVE_MAXIMUM: ${amount} CDF exceeds maximum loan amount ${limits.MAX_LOAN_AMOUNT} CDF`);
    }
    
    // Check tier limits
    if (tier && limits.TIER_LIMITS[tier]) {
        const tierLimit = limits.TIER_LIMITS[tier];
        if (amount > tierLimit) {
            errors.push(`TIER_LIMIT_EXCEEDED: ${amount} CDF exceeds tier limit of ${tierLimit} CDF for ${tier}`);
        }
    }
    
    // Check for suspicious amounts
    const suspiciousPatterns = [
        { pattern: /999$/, message: 'Amount ending in 999 may be structuring' },
        { pattern: /111$/, message: 'Repeating digits may need review' },
        { pattern: /5000$/, message: 'Round amount may need verification' }
    ];
    
    suspiciousPatterns.forEach(pattern => {
        if (pattern.pattern.test(amount.toString())) {
            warnings.push(`SUSPICIOUS_PATTERN: ${pattern.message}`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        amount: Math.ceil(amount),
        validatedAt: new Date().toISOString(),
        limits: {
            min: limits.MIN_LOAN_AMOUNT,
            max: limits.MAX_LOAN_AMOUNT,
            tierLimit: tier ? limits.TIER_LIMITS[tier] : null
        }
    };
};

// Generate currency education content
export const getCurrencyEducation = (language = 'FR') => {
    const education = {
        FR: {
            title: 'Comprendre le Franc Congolais (CDF)',
            sections: [
                {
                    title: 'Valeur',
                    content: '1 USD ≈ 2,500 CDF (2026). Le CDF est la monnaie officielle de la RDC depuis 1997.'
                },
                {
                    title: 'Billets',
                    content: 'Les billets vont de 50 à 20,000 CDF. Chaque billet représente un animal national.'
                },
                {
                    title: 'Utilisation',
                    content: 'Le cash domine (85% des transactions). Les transferts mobiles gagnent en popularité.'
                }
            ]
        },
        SW: {
            title: 'Kuelewa Faranga ya Kongo (CDF)',
            sections: [
                {
                    title: 'Thamani',
                    content: '1 USD ≈ 2,500 CDF (2026). CDF ni sarafu rasmi ya DRC tangu 1997.'
                },
                {
                    title: 'Noti',
                    content: 'Noti huanzia 50 hadi 20,000 CDF. Kila noti inawakilisha mnyama wa kitaifa.'
                },
                {
                    title: 'Matumizi',
                    content: 'Pesa taslimu inatawala (85% ya manunuzi). Uhamisho wa pesa kwa simu unazidi kuongezeka.'
                }
            ]
        },
        LN: {
            title: 'Koyeba Falanga ya Kongo (CDF)',
            sections: [
                {
                    title: 'Moto',
                    content: '1 USD ≈ 2,500 CDF (2026). CDF ezali mbongo ya Republique ya Kongo kowuta 1997.'
                },
                {
                    title: 'Billet',
                    content: 'Ba billette ezali kowuta 50 kino 20,000 CDF. Billet na billette ezali kolimbola nyama ya mboka.'
                },
                {
                    title: 'Kosala',
                    content: 'Mbongo ezali na bokonzi (85% ya ba transaction). Kotiya mbongo na simu ezali kokoma mingi.'
                }
            ]
        }
    };
    
    return education[language] || education.FR;
};

// Export the currency configuration
export default DRC_CURRENCY;

// Freeze the configuration to prevent modifications
Object.freeze(DRC_CURRENCY);
Object.freeze(DRC_CURRENCY.MPESEWA_PARAMETERS);
Object.freeze(DRC_CURRENCY.FORMATTING);
Object.freeze(DRC_CURRENCY.COMPLIANCE);