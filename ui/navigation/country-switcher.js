/**
 * M-PESEWA COUNTRY SWITCHER
 * Enforces strict country isolation, currency rules, and geographic compliance
 * Non-negotiable: No cross-country transactions, country selection locked after registration
 */

// ============================================================================
// 1️⃣ COUNTRY CONSTANTS & DEFINITIONS (STRICT HIERARCHY)
// ============================================================================

const COUNTRY_CONFIGS = Object.freeze({
    KE: {
        code: 'KE',
        name: 'Kenya',
        flag: '🇰🇪',
        currency: 'KSh',
        currency_name: 'Kenyan Shilling',
        timezone: 'Africa/Nairobi',
        language: 'en',
        region: 'East Africa',
        calling_code: '+254',
        contact_phone: '+254 709 219 000',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Republic of Kenya',
        
        // Business rules specific to Kenya
        rules: {
            max_weekly_loan_basic: 1500,
            max_weekly_loan_premium: 5000,
            max_weekly_loan_super: 20000,
            interest_rate: 0.10, // 10%
            penalty_rate: 0.05, // 5% daily after 7 days
            tax_rate: 0.00, // No VAT on lending
            min_loan_amount: 5,
            max_loan_amount: 50000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        // Regulatory compliance
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'super', // Only for Super tier
            licensed_by: 'Central Bank of Kenya',
            license_number: 'CBK/MPW/2024/001',
            data_protection_law: 'Data Protection Act, 2019'
        },
        
        // Emergency categories availability
        emergency_categories: 'ALL',
        
        // Groups configuration
        groups: {
            min_members: 5,
            max_members: 1000,
            max_groups_per_user: 4,
            requires_country_id: true
        }
    },
    
    UG: {
        code: 'UG',
        name: 'Uganda',
        flag: '🇺🇬',
        currency: 'UGX',
        currency_name: 'Ugandan Shilling',
        timezone: 'Africa/Kampala',
        language: 'en',
        region: 'East Africa',
        calling_code: '+256',
        contact_phone: '+256 392 175 546',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Republic of Uganda',
        
        rules: {
            max_weekly_loan_basic: 60000, // ~1500 KSh equivalent
            max_weekly_loan_premium: 200000,
            max_weekly_loan_super: 800000,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.18, // VAT on services
            min_loan_amount: 200,
            max_loan_amount: 2000000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'super',
            licensed_by: 'Bank of Uganda',
            license_number: 'BOU/MPW/2024/001',
            data_protection_law: 'Data Protection and Privacy Act, 2019'
        },
        
        emergency_categories: 'ALL',
        
        groups: {
            min_members: 5,
            max_members: 1000,
            max_groups_per_user: 4,
            requires_national_id: true
        }
    },
    
    TZ: {
        code: 'TZ',
        name: 'Tanzania',
        flag: '🇹🇿',
        currency: 'TZS',
        currency_name: 'Tanzanian Shilling',
        timezone: 'Africa/Dar_es_Salaam',
        language: 'sw',
        region: 'East Africa',
        calling_code: '+255',
        contact_phone: '+255 659 073 010',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'United Republic of Tanzania',
        
        rules: {
            max_weekly_loan_basic: 35000,
            max_weekly_loan_premium: 120000,
            max_weekly_loan_super: 480000,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.18,
            min_loan_amount: 100,
            max_loan_amount: 1200000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'super',
            licensed_by: 'Bank of Tanzania',
            license_number: 'BOT/MPW/2024/001',
            data_protection_law: 'Personal Data Protection Act, 2022'
        },
        
        emergency_categories: 'ALL',
        
        groups: {
            min_members: 5,
            max_members: 1000,
            max_groups_per_user: 4,
            requires_tin: true
        }
    },
    
    RW: {
        code: 'RW',
        name: 'Rwanda',
        flag: '🇷🇼',
        currency: 'RWF',
        currency_name: 'Rwandan Franc',
        timezone: 'Africa/Kigali',
        language: 'rw',
        region: 'East Africa',
        calling_code: '+250',
        contact_phone: '+250 791 590 801',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Republic of Rwanda',
        
        rules: {
            max_weekly_loan_basic: 1500,
            max_weekly_loan_premium: 5000,
            max_weekly_loan_super: 20000,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.18,
            min_loan_amount: 100,
            max_loan_amount: 50000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'super',
            licensed_by: 'National Bank of Rwanda',
            license_number: 'BNR/MPW/2024/001',
            data_protection_law: 'Law Relating to Protection of Personal Data and Privacy'
        },
        
        emergency_categories: 'ALL',
        
        groups: {
            min_members: 5,
            max_members: 1000,
            max_groups_per_user: 4,
            requires_national_id: true
        }
    },
    
    CD: {
        code: 'CD',
        name: 'DRC',
        flag: '🇨🇩',
        currency: 'CDF',
        currency_name: 'Congolese Franc',
        timezone: 'Africa/Kinshasa',
        language: 'fr',
        region: 'Central Africa',
        calling_code: '+243',
        contact_phone: '+243 81 000 0000',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Democratic Republic of Congo',
        
        rules: {
            max_weekly_loan_basic: 3000,
            max_weekly_loan_premium: 10000,
            max_weekly_loan_super: 40000,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.16,
            min_loan_amount: 100,
            max_loan_amount: 100000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'none', // No CRB in DRC
            licensed_by: 'Central Bank of Congo',
            license_number: 'BCC/MPW/2024/001'
        },
        
        emergency_categories: ['fare', 'food', 'medicine', 'fuel', 'data'],
        
        groups: {
            min_members: 5,
            max_members: 500, // Lower due to infrastructure
            max_groups_per_user: 3,
            requires_residence_proof: true
        }
    },
    
    BI: {
        code: 'BI',
        name: 'Burundi',
        flag: '🇧🇮',
        currency: 'BIF',
        currency_name: 'Burundian Franc',
        timezone: 'Africa/Bujumbura',
        language: 'fr',
        region: 'East Africa',
        calling_code: '+257',
        contact_phone: '+257 79 000 000',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Republic of Burundi',
        
        rules: {
            max_weekly_loan_basic: 3000,
            max_weekly_loan_premium: 10000,
            max_weekly_loan_super: 40000,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.18,
            min_loan_amount: 100,
            max_loan_amount: 100000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'none',
            licensed_by: 'Bank of the Republic of Burundi',
            license_number: 'BRB/MPW/2024/001'
        },
        
        emergency_categories: ['fare', 'food', 'medicine', 'school'],
        
        groups: {
            min_members: 5,
            max_members: 500,
            max_groups_per_user: 3,
            requires_community_endorsement: true
        }
    },
    
    NG: {
        code: 'NG',
        name: 'Nigeria',
        flag: '🇳🇬',
        currency: 'NGN',
        currency_name: 'Nigerian Naira',
        timezone: 'Africa/Lagos',
        language: 'en',
        region: 'West Africa',
        calling_code: '+234',
        contact_phone: '+234 800 000 0000',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Federal Republic of Nigeria',
        
        rules: {
            max_weekly_loan_basic: 6000,
            max_weekly_loan_premium: 20000,
            max_weekly_loan_super: 80000,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.075, // VAT
            min_loan_amount: 50,
            max_loan_amount: 200000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'premium',
            licensed_by: 'Central Bank of Nigeria',
            license_number: 'CBN/MPW/2024/001',
            data_protection_law: 'Nigeria Data Protection Regulation'
        },
        
        emergency_categories: 'ALL',
        
        groups: {
            min_members: 10,
            max_members: 1000,
            max_groups_per_user: 4,
            requires_bvn: true // Bank Verification Number
        }
    },
    
    GH: {
        code: 'GH',
        name: 'Ghana',
        flag: '🇬🇭',
        currency: 'GHS',
        currency_name: 'Ghanaian Cedi',
        timezone: 'Africa/Accra',
        language: 'en',
        region: 'West Africa',
        calling_code: '+233',
        contact_phone: '+233 24 000 0000',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Republic of Ghana',
        
        rules: {
            max_weekly_loan_basic: 100,
            max_weekly_loan_premium: 350,
            max_weekly_loan_super: 1400,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.15, // VAT
            min_loan_amount: 1,
            max_loan_amount: 3500,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'super',
            licensed_by: 'Bank of Ghana',
            license_number: 'BOG/MPW/2024/001',
            data_protection_law: 'Data Protection Act, 2012'
        },
        
        emergency_categories: 'ALL',
        
        groups: {
            min_members: 5,
            max_members: 1000,
            max_groups_per_user: 4,
            requires_ghanacard: true
        }
    },
    
    SS: {
        code: 'SS',
        name: 'South Sudan',
        flag: '🇸🇸',
        currency: 'SSP',
        currency_name: 'South Sudanese Pound',
        timezone: 'Africa/Juba',
        language: 'en',
        region: 'East Africa',
        calling_code: '+211',
        contact_phone: '+211 955 000 000',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Republic of South Sudan',
        
        rules: {
            max_weekly_loan_basic: 5000,
            max_weekly_loan_premium: 17000,
            max_weekly_loan_super: 68000,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.00,
            min_loan_amount: 100,
            max_loan_amount: 170000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'none',
            licensed_by: 'Bank of South Sudan',
            license_number: 'BOSS/MPW/2024/001'
        },
        
        emergency_categories: ['fare', 'food', 'medicine', 'fuel'],
        
        groups: {
            min_members: 5,
            max_members: 500,
            max_groups_per_user: 3,
            requires_community_verification: true
        }
    },
    
    SO: {
        code: 'SO',
        name: 'Somalia',
        flag: '🇸🇴',
        currency: 'SOS',
        currency_name: 'Somali Shilling',
        timezone: 'Africa/Mogadishu',
        language: 'so',
        region: 'East Africa',
        calling_code: '+252',
        contact_phone: '+252 63 0000000',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Federal Republic of Somalia',
        
        rules: {
            max_weekly_loan_basic: 10000,
            max_weekly_loan_premium: 35000,
            max_weekly_loan_super: 140000,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.00,
            min_loan_amount: 100,
            max_loan_amount: 350000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: false,
            requires_phone_verification: true,
            requires_crb_check_tier: 'none',
            licensed_by: 'Central Bank of Somalia',
            license_number: 'CBS/MPW/2024/001'
        },
        
        emergency_categories: ['fare', 'food', 'medicine', 'business'],
        
        groups: {
            min_members: 5,
            max_members: 500,
            max_groups_per_user: 3,
            requires_clan_verification: true
        }
    },
    
    ZA: {
        code: 'ZA',
        name: 'South Africa',
        flag: '🇿🇦',
        currency: 'ZAR',
        currency_name: 'South African Rand',
        timezone: 'Africa/Johannesburg',
        language: 'en',
        region: 'Southern Africa',
        calling_code: '+27',
        contact_phone: '+27 11 000 0000',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Republic of South Africa',
        
        rules: {
            max_weekly_loan_basic: 150,
            max_weekly_loan_premium: 500,
            max_weekly_loan_super: 2000,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.15, // VAT
            min_loan_amount: 1,
            max_loan_amount: 5000,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'basic', // All tiers require CRB
            licensed_by: 'National Credit Regulator',
            license_number: 'NCR/MPW/2024/001',
            data_protection_law: 'Protection of Personal Information Act'
        },
        
        emergency_categories: 'ALL',
        
        groups: {
            min_members: 5,
            max_members: 1000,
            max_groups_per_user: 4,
            requires_sa_id: true
        }
    },
    
    ET: {
        code: 'ET',
        name: 'Ethiopia',
        flag: '🇪🇹',
        currency: 'ETB',
        currency_name: 'Ethiopian Birr',
        timezone: 'Africa/Addis_Ababa',
        language: 'am',
        region: 'East Africa',
        calling_code: '+251',
        contact_phone: '+251 11 000 0000',
        contact_email: 'info@m-pesewa.com',
        legal_jurisdiction: 'Federal Democratic Republic of Ethiopia',
        
        rules: {
            max_weekly_loan_basic: 50,
            max_weekly_loan_premium: 170,
            max_weekly_loan_super: 680,
            interest_rate: 0.10,
            penalty_rate: 0.05,
            tax_rate: 0.15,
            min_loan_amount: 1,
            max_loan_amount: 1700,
            repayment_period_days: 7,
            default_period_days: 60
        },
        
        compliance: {
            requires_id_verification: true,
            requires_phone_verification: true,
            requires_crb_check_tier: 'super',
            licensed_by: 'National Bank of Ethiopia',
            license_number: 'NBE/MPW/2024/001'
        },
        
        emergency_categories: ['fare', 'food', 'medicine', 'school', 'business'],
        
        groups: {
            min_members: 5,
            max_members: 1000,
            max_groups_per_user: 4,
            requires_kebele_id: true
        }
    }
});

// ============================================================================
// 2️⃣ COUNTRY SWITCHING BUSINESS RULES (NON-NEGOTIABLE)
// ============================================================================

const COUNTRY_SWITCHING_RULES = Object.freeze({
    // Rule 1: Country selection locked after registration
    COUNTRY_LOCKED_AFTER_REGISTRATION: {
        code: 'CS001',
        description: 'Country selection cannot be changed after registration',
        check: (userIsRegistered, currentCountry, targetCountry) => {
            if (userIsRegistered) {
                return currentCountry === targetCountry;
            }
            return true; // Can switch during registration
        },
        errorMessage: (currentCountry, targetCountry) =>
            `Country locked to ${currentCountry}. Cannot switch to ${targetCountry} after registration.`
    },
    
    // Rule 2: No cross-country lending or borrowing
    NO_CROSS_COUNTRY_TRANSACTIONS: {
        code: 'CS002',
        description: 'Users cannot lend or borrow across country boundaries',
        check: (userCountry, transactionCountry, actionType) => {
            if (actionType === 'lend' || actionType === 'borrow') {
                return userCountry === transactionCountry;
            }
            return true;
        },
        errorMessage: (userCountry, transactionCountry) =>
            `Cannot ${actionType} across countries. Your country: ${userCountry}, Transaction country: ${transactionCountry}`
    },
    
    // Rule 3: Country-specific currency must be used
    COUNTRY_CURRENCY_ENFORCEMENT: {
        code: 'CS003',
        description: 'All transactions must use the country-specific currency',
        check: (countryCode, transactionCurrency) => {
            const countryConfig = COUNTRY_CONFIGS[countryCode];
            return countryConfig && countryConfig.currency === transactionCurrency;
        },
        errorMessage: (countryCode, transactionCurrency) => {
            const countryConfig = COUNTRY_CONFIGS[countryCode];
            return `Transactions in ${countryConfig.name} must use ${countryConfig.currency}, not ${transactionCurrency}`;
        }
    },
    
    // Rule 4: Country-specific compliance requirements
    COMPLIANCE_REQUIREMENTS: {
        code: 'CS004',
        description: 'Users must meet country-specific compliance requirements',
        check: (countryCode, userVerificationStatus) => {
            const countryConfig = COUNTRY_CONFIGS[countryCode];
            if (!countryConfig) return false;
            
            const { compliance } = countryConfig;
            
            if (compliance.requires_id_verification && !userVerificationStatus.id_verified) {
                return false;
            }
            
            if (compliance.requires_phone_verification && !userVerificationStatus.phone_verified) {
                return false;
            }
            
            return true;
        },
        errorMessage: (countryCode, missingRequirements) =>
            `Cannot operate in ${countryCode}: Missing ${missingRequirements.join(', ')}`
    },
    
    // Rule 5: Country-specific group restrictions
    GROUP_RESTRICTIONS: {
        code: 'CS005',
        description: 'Groups are country-locked and cannot have cross-country members',
        check: (groupCountry, userCountry) => {
            return groupCountry === userCountry;
        },
        errorMessage: (groupCountry, userCountry) =>
            `Cannot join group in ${groupCountry}. You are registered in ${userCountry}`
    },
    
    // Rule 6: Emergency categories availability
    EMERGENCY_CATEGORIES_AVAILABILITY: {
        code: 'CS006',
        description: 'Some emergency categories may not be available in certain countries',
        check: (countryCode, requestedCategory) => {
            const countryConfig = COUNTRY_CONFIGS[countryCode];
            if (!countryConfig) return false;
            
            const { emergency_categories } = countryConfig;
            
            if (emergency_categories === 'ALL') return true;
            
            return emergency_categories.includes(requestedCategory);
        },
        errorMessage: (countryCode, category) =>
            `Emergency category "${category}" not available in ${countryCode}`
    },
    
    // Rule 7: Subscription tier limits by country
    SUBSCRIPTION_TIER_LIMITS: {
        code: 'CS007',
        description: 'Subscription tier limits vary by country currency',
        check: (countryCode, tier, amount) => {
            const countryConfig = COUNTRY_CONFIGS[countryCode];
            if (!countryConfig) return false;
            
            const tierKey = `max_weekly_loan_${tier}`;
            const maxAmount = countryConfig.rules[tierKey];
            
            return amount <= maxAmount;
        },
        errorMessage: (countryCode, tier, amount, maxAmount) =>
            `${tier} tier limit in ${countryCode} is ${maxAmount}, requested ${amount}`
    },
    
    // Rule 8: Legal jurisdiction compliance
    LEGAL_JURISDICTION: {
        code: 'CS008',
        description: 'Users must accept country-specific terms and conditions',
        check: (countryCode, userAcceptedTerms) => {
            return userAcceptedTerms[countryCode] === true;
        },
        errorMessage: (countryCode) =>
            `Must accept ${COUNTRY_CONFIGS[countryCode]?.name} terms and conditions`
    },
    
    // Rule 9: Timezone-based operations
    TIMEZONE_RESTRICTIONS: {
        code: 'CS009',
        description: 'Some operations may be restricted based on local time',
        check: (countryCode, currentTime, operationType) => {
            const countryConfig = COUNTRY_CONFIGS[countryCode];
            if (!countryConfig) return false;
            
            // Example: No lending operations between 10 PM and 6 AM local time
            if (operationType === 'lend') {
                const localHour = currentTime.getHours();
                if (localHour >= 22 || localHour < 6) {
                    return false;
                }
            }
            
            return true;
        },
        errorMessage: (countryCode) =>
            `Operation not allowed during nighttime hours in ${countryCode}`
    },
    
    // Rule 10: Country maintenance mode
    COUNTRY_MAINTENANCE: {
        code: 'CS010',
        description: 'Country may be in maintenance mode',
        check: (countryCode, maintenanceStatus) => {
            return !maintenanceStatus[countryCode];
        },
        errorMessage: (countryCode) =>
            `${countryCode} is currently under maintenance. Please try again later.`
    }
});

// ============================================================================
// 3️⃣ CURRENCY CONVERSION UTILITIES
// ============================================================================

class MpesewaCurrencyConverter {
    constructor() {
        this._exchangeRates = new Map();
        this._lastUpdate = null;
        this._conversionCache = new Map();
        
        // Default exchange rates (would be updated from API in production)
        this._initializeDefaultRates();
    }
    
    _initializeDefaultRates() {
        // Base currency: USD
        const baseRates = {
            USD: 1,
            KES: 157.50,   // Kenyan Shilling
            UGX: 3740.00,  // Ugandan Shilling
            TZS: 2560.00,  // Tanzanian Shilling
            RWF: 1300.00,  // Rwandan Franc
            CDF: 2700.00,  // Congolese Franc
            BIF: 2850.00,  // Burundian Franc
            NGN: 1480.00,  // Nigerian Naira
            GHS: 12.50,    // Ghanaian Cedi
            SSP: 1300.00,  // South Sudanese Pound
            SOS: 570.00,   // Somali Shilling
            ZAR: 18.50,    // South African Rand
            ETB: 56.50     // Ethiopian Birr
        };
        
        // Store all rates
        Object.keys(baseRates).forEach(currency => {
            this._exchangeRates.set(currency, baseRates[currency]);
        });
        
        this._lastUpdate = new Date().toISOString();
    }
    
    async updateExchangeRates() {
        try {
            // In production, fetch from API
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            
            // Update rates for our supported currencies
            const currencies = Object.keys(COUNTRY_CONFIGS).map(code => 
                COUNTRY_CONFIGS[code].currency
            );
            
            currencies.forEach(currency => {
                if (data.rates[currency]) {
                    this._exchangeRates.set(currency, data.rates[currency]);
                }
            });
            
            this._lastUpdate = new Date().toISOString();
            this._conversionCache.clear();
            
            return true;
        } catch (error) {
            console.error('Failed to update exchange rates:', error);
            return false;
        }
    }
    
    convert(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return amount;
        
        const cacheKey = `${amount}_${fromCurrency}_${toCurrency}`;
        if (this._conversionCache.has(cacheKey)) {
            return this._conversionCache.get(cacheKey);
        }
        
        const fromRate = this._exchangeRates.get(fromCurrency);
        const toRate = this._exchangeRates.get(toCurrency);
        
        if (!fromRate || !toRate) {
            throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
        }
        
        // Convert to USD first, then to target currency
        const amountInUSD = amount / fromRate;
        const convertedAmount = amountInUSD * toRate;
        
        // Round to 2 decimal places for display
        const roundedAmount = Math.round(convertedAmount * 100) / 100;
        
        this._conversionCache.set(cacheKey, roundedAmount);
        
        return roundedAmount;
    }
    
    formatCurrency(amount, currencyCode, locale = 'en-US') {
        const country = Object.values(COUNTRY_CONFIGS).find(
            config => config.currency === currencyCode
        );
        
        if (!country) {
            return `${currencyCode} ${amount.toFixed(2)}`;
        }
        
        // Use Intl.NumberFormat for proper formatting
        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        } catch (error) {
            // Fallback for currencies not supported by Intl
            return `${country.currency} ${amount.toLocaleString(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
    }
    
    getCurrencySymbol(currencyCode) {
        const country = Object.values(COUNTRY_CONFIGS).find(
            config => config.currency === currencyCode
        );
        
        return country?.currency || currencyCode;
    }
    
    getCountryForCurrency(currencyCode) {
        return Object.values(COUNTRY_CONFIGS).find(
            config => config.currency === currencyCode
        )?.name || 'Unknown';
    }
    
    getExchangeRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return 1;
        
        const fromRate = this._exchangeRates.get(fromCurrency);
        const toRate = this._exchangeRates.get(toCurrency);
        
        if (!fromRate || !toRate) {
            throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
        }
        
        return toRate / fromRate;
    }
    
    getLastUpdate() {
        return this._lastUpdate;
    }
    
    getAllRates() {
        return Object.fromEntries(this._exchangeRates);
    }
}

// ============================================================================
// 4️⃣ COUNTRY SWITCHER CORE CLASS
// ============================================================================

class MpesewaCountrySwitcher {
    constructor(userData, navigationState, permissionChecker) {
        this.userData = userData;
        this.navigationState = navigationState;
        this.permissionChecker = permissionChecker;
        this.currencyConverter = new MpesewaCurrencyConverter();
        
        this._currentCountry = null;
        this._availableCountries = [];
        this._countrySwitchHistory = [];
        this._countryPreferences = new Map();
        this._maintenanceStatus = new Map();
        this._validationErrors = [];
        
        this._initialize();
    }
    
    // ============================================================================
    // 4.1 Initialization
    // ============================================================================
    
    async _initialize() {
        if (!this.userData) {
            throw new Error('User data required for country switcher initialization');
        }
        
        // Set current country from user data
        if (this.userData.country) {
            this._currentCountry = this.userData.country;
        } else {
            // Default to Kenya if no country set
            this._currentCountry = 'KE';
        }
        
        // Update navigation state
        if (this.navigationState) {
            this.navigationState.currentCountry = this._currentCountry;
        }
        
        // Load available countries based on user status
        await this._loadAvailableCountries();
        
        // Load maintenance status
        await this._loadMaintenanceStatus();
        
        // Load user's country preferences
        await this._loadCountryPreferences();
        
        // Load switch history
        this._loadSwitchHistory();
        
        // Update exchange rates periodically
        await this._updateExchangeRates();
        
        this._log('Country switcher initialized', {
            userId: this.userData.id,
            currentCountry: this._currentCountry,
            availableCountries: this._availableCountries.length
        });
    }
    
    async _loadAvailableCountries() {
        try {
            // Get all supported countries
            const allCountries = Object.keys(COUNTRY_CONFIGS);
            
            // Filter based on user status
            this._availableCountries = allCountries.filter(countryCode => {
                const countryConfig = COUNTRY_CONFIGS[countryCode];
                
                // Check maintenance status
                if (this._maintenanceStatus.get(countryCode)) {
                    return false;
                }
                
                // Check if user meets compliance requirements
                const meetsRequirements = this._checkCountryCompliance(countryCode);
                
                return meetsRequirements;
            }).map(countryCode => ({
                code: countryCode,
                ...COUNTRY_CONFIGS[countryCode],
                canSwitch: this._canSwitchToCountry(countryCode),
                isCurrent: countryCode === this._currentCountry
            }));
            
            // Sort by region and name
            this._availableCountries.sort((a, b) => {
                if (a.region !== b.region) {
                    return a.region.localeCompare(b.region);
                }
                return a.name.localeCompare(b.name);
            });
            
        } catch (error) {
            console.error('Failed to load available countries:', error);
            this._availableCountries = [];
        }
    }
    
    async _loadMaintenanceStatus() {
        try {
            // Fetch maintenance status from API
            const response = await fetch('/api/countries/maintenance-status');
            if (response.ok) {
                const data = await response.json();
                Object.keys(data).forEach(countryCode => {
                    this._maintenanceStatus.set(countryCode, data[countryCode]);
                });
            }
        } catch (error) {
            console.warn('Failed to load maintenance status:', error);
            // Initialize with all countries operational
            Object.keys(COUNTRY_CONFIGS).forEach(code => {
                this._maintenanceStatus.set(code, false);
            });
        }
    }
    
    async _loadCountryPreferences() {
        try {
            if (window.localStorage) {
                const preferences = localStorage.getItem('mpesewa_country_preferences');
                if (preferences) {
                    const parsed = JSON.parse(preferences);
                    Object.keys(parsed).forEach(countryCode => {
                        this._countryPreferences.set(countryCode, parsed[countryCode]);
                    });
                }
            }
        } catch (error) {
            console.warn('Failed to load country preferences:', error);
        }
    }
    
    async _updateExchangeRates() {
        try {
            await this.currencyConverter.updateExchangeRates();
            
            // Schedule next update in 1 hour
            setTimeout(() => this._updateExchangeRates(), 60 * 60 * 1000);
        } catch (error) {
            console.warn('Failed to update exchange rates:', error);
        }
    }
    
    // ============================================================================
    // 4.2 Country Switching Core Logic
    // ============================================================================
    
    async switchToCountry(countryCode, options = {}) {
        const startTime = Date.now();
        
        try {
            this._validationErrors = [];
            
            // Step 1: Validate country code
            if (!COUNTRY_CONFIGS[countryCode]) {
                throw new CountrySwitchError(`Invalid country code: ${countryCode}`);
            }
            
            // Step 2: Check if already in this country
            if (this._currentCountry === countryCode) {
                return {
                    success: true,
                    message: `Already in ${COUNTRY_CONFIGS[countryCode].name}`,
                    country: countryCode,
                    is_switch: false
                };
            }
            
            // Step 3: Validate switch is allowed
            const validationResult = await this.validateCountrySwitch(countryCode, options);
            
            if (!validationResult.allowed) {
                throw new CountrySwitchError(
                    `Country switch not allowed: ${validationResult.reason}`,
                    validationResult.rule,
                    validationResult.details
                );
            }
            
            // Step 4: Perform pre-switch actions
            await this._performPreSwitchActions(this._currentCountry, countryCode);
            
            // Step 5: Update current country
            const previousCountry = this._currentCountry;
            this._currentCountry = countryCode;
            
            // Step 6: Update user data
            if (this.userData) {
                this.userData.country = countryCode;
            }
            
            // Step 7: Update navigation state
            if (this.navigationState) {
                this.navigationState.currentCountry = countryCode;
            }
            
            // Step 8: Record switch in history
            const switchRecord = this._recordCountrySwitch(previousCountry, countryCode, options);
            
            // Step 9: Update available countries
            await this._updateAvailableCountries();
            
            // Step 10: Perform post-switch actions
            await this._performPostSwitchActions(previousCountry, countryCode);
            
            const switchTime = Date.now() - startTime;
            
            this._log('Country switch completed', {
                from: previousCountry,
                to: countryCode,
                duration: switchTime,
                userId: this.userData.id
            });
            
            return {
                success: true,
                previous_country: previousCountry,
                new_country: countryCode,
                country_config: COUNTRY_CONFIGS[countryCode],
                switch_record: switchRecord,
                available_countries: this._availableCountries,
                duration_ms: switchTime
            };
            
        } catch (error) {
            this._log('Country switch failed', {
                from: this._currentCountry,
                to: countryCode,
                error: error.message,
                userId: this.userData.id
            });
            
            return {
                success: false,
                error: error.message,
                validation_errors: this._validationErrors,
                attempted_country: countryCode
            };
        }
    }
    
    async selectCountryDuringRegistration(countryCode, options = {}) {
        // Special method for country selection during registration
        const validationResult = await this.validateCountrySelection(countryCode, options);
        
        if (!validationResult.allowed) {
            return {
                success: false,
                error: validationResult.reason,
                validation: validationResult
            };
        }
        
        // Set country
        this._currentCountry = countryCode;
        
        // Save to user data
        if (this.userData) {
            this.userData.country = countryCode;
        }
        
        // Update navigation state
        if (this.navigationState) {
            this.navigationState.currentCountry = countryCode;
        }
        
        // Record selection
        this._recordCountrySelection(countryCode, options);
        
        // Update available countries
        await this._updateAvailableCountries();
        
        return {
            success: true,
            country: countryCode,
            country_config: COUNTRY_CONFIGS[countryCode]
        };
    }
    
    // ============================================================================
    // 4.3 Country Switch Validation
    // ============================================================================
    
    async validateCountrySwitch(countryCode, options = {}) {
        const validationResults = {
            allowed: true,
            failed_rules: [],
            passed_rules: [],
            reason: null,
            rule: null
        };
        
        // Get country config
        const countryConfig = COUNTRY_CONFIGS[countryCode];
        if (!countryConfig) {
            validationResults.allowed = false;
            validationResults.reason = 'Country not found';
            return validationResults;
        }
        
        // Get user context
        const userContext = {
            userId: this.userData.id,
            userIsRegistered: this.userData.is_registered || false,
            currentCountry: this._currentCountry,
            targetCountry: countryCode,
            userVerificationStatus: this.userData.verification || {},
            userAcceptedTerms: this.userData.accepted_terms || {},
            userGroups: this.userData.groups || [],
            hasActiveLoans: options.hasActiveLoans || false,
            hasActiveLending: options.hasActiveLending || false,
            currentTime: new Date(),
            maintenanceStatus: this._maintenanceStatus.get(countryCode) || false
        };
        
        // Apply all business rules
        Object.keys(COUNTRY_SWITCHING_RULES).forEach(ruleKey => {
            const rule = COUNTRY_SWITCHING_RULES[ruleKey];
            
            try {
                let checkResult;
                
                switch (ruleKey) {
                    case 'COUNTRY_LOCKED_AFTER_REGISTRATION':
                        checkResult = rule.check(
                            userContext.userIsRegistered,
                            userContext.currentCountry,
                            userContext.targetCountry
                        );
                        break;
                        
                    case 'NO_CROSS_COUNTRY_TRANSACTIONS':
                        // This rule applies to transactions, not switching itself
                        checkResult = true;
                        break;
                        
                    case 'COUNTRY_CURRENCY_ENFORCEMENT':
                        checkResult = rule.check(
                            countryCode,
                            options.transactionCurrency || countryConfig.currency
                        );
                        break;
                        
                    case 'COMPLIANCE_REQUIREMENTS':
                        checkResult = rule.check(
                            countryCode,
                            userContext.userVerificationStatus
                        );
                        break;
                        
                    case 'GROUP_RESTRICTIONS':
                        // Check if user has groups in target country
                        const hasGroupsInTargetCountry = userContext.userGroups.some(
                            group => group.country === countryCode
                        );
                        checkResult = hasGroupsInTargetCountry ? 
                            rule.check(countryCode, userContext.currentCountry) : true;
                        break;
                        
                    case 'EMERGENCY_CATEGORIES_AVAILABILITY':
                        checkResult = rule.check(
                            countryCode,
                            options.requestedCategory || 'fare'
                        );
                        break;
                        
                    case 'SUBSCRIPTION_TIER_LIMITS':
                        checkResult = rule.check(
                            countryCode,
                            options.tier || 'basic',
                            options.amount || 0
                        );
                        break;
                        
                    case 'LEGAL_JURISDICTION':
                        checkResult = rule.check(
                            countryCode,
                            userContext.userAcceptedTerms
                        );
                        break;
                        
                    case 'TIMEZONE_RESTRICTIONS':
                        checkResult = rule.check(
                            countryCode,
                            userContext.currentTime,
                            options.operationType || 'switch'
                        );
                        break;
                        
                    case 'COUNTRY_MAINTENANCE':
                        checkResult = rule.check(
                            countryCode,
                            this._maintenanceStatus
                        );
                        break;
                        
                    default:
                        checkResult = true;
                }
                
                if (!checkResult) {
                    validationResults.allowed = false;
                    validationResults.failed_rules.push({
                        rule: rule.code,
                        description: rule.description,
                        error_message: this._formatCountryRuleErrorMessage(rule, userContext, countryConfig)
                    });
                    
                    if (!validationResults.reason) {
                        validationResults.reason = rule.errorMessage;
                        validationResults.rule = rule.code;
                    }
                } else {
                    validationResults.passed_rules.push({
                        rule: rule.code,
                        description: rule.description
                    });
                }
            } catch (error) {
                console.error(`Error checking rule ${rule.code}:`, error);
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: rule.code,
                    description: rule.description,
                    error: error.message
                });
            }
        });
        
        // Additional validation: Cannot switch with active loans/lending
        if (userContext.hasActiveLoans || userContext.hasActiveLending) {
            validationResults.allowed = false;
            validationResults.failed_rules.push({
                rule: 'ACTIVE_TRANSACTIONS',
                description: 'Cannot switch countries with active loans or lending',
                error_message: 'Clear all active transactions before switching countries'
            });
        }
        
        // Check permission system
        if (this.permissionChecker) {
            const canSwitch = this.permissionChecker.canPerform('switch', 'country', {
                from_country: userContext.currentCountry,
                to_country: countryCode,
                user_status: userContext.userIsRegistered ? 'registered' : 'unregistered'
            });
            
            if (!canSwitch.allowed) {
                validationResults.allowed = false;
                validationResults.failed_rules.push({
                    rule: 'PERMISSION_DENIED',
                    description: 'Permission system denied country switch',
                    error_message: canSwitch.reason || 'Permission denied'
                });
            }
        }
        
        return validationResults;
    }
    
    async validateCountrySelection(countryCode, options = {}) {
        // Validation for initial country selection (during registration)
        const validationResults = {
            allowed: true,
            failed_rules: [],
            reason: null
        };
        
        const countryConfig = COUNTRY_CONFIGS[countryCode];
        if (!countryConfig) {
            validationResults.allowed = false;
            validationResults.reason = 'Invalid country code';
            return validationResults;
        }
        
        // Check maintenance
        if (this._maintenanceStatus.get(countryCode)) {
            validationResults.allowed = false;
            validationResults.reason = 'Country under maintenance';
            validationResults.failed_rules.push({
                rule: 'MAINTENANCE',
                description: 'Country is currently under maintenance'
            });
        }
        
        // Check if country is available for registration
        if (options.registrationBlockedCountries?.includes(countryCode)) {
            validationResults.allowed = false;
            validationResults.reason = 'Country not accepting new registrations';
            validationResults.failed_rules.push({
                rule: 'REGISTRATION_BLOCKED',
                description: 'Country not accepting new registrations'
            });
        }
        
        return validationResults;
    }
    
    async validateTransaction(countryCode, transactionType, amount, currency) {
        // Validate a transaction against country rules
        const validationResults = {
            allowed: true,
            failed_rules: [],
            warnings: []
        };
        
        const countryConfig = COUNTRY_CONFIGS[countryCode];
        if (!countryConfig) {
            validationResults.allowed = false;
            validationResults.reason = 'Invalid country';
            return validationResults;
        }
        
        // Check currency
        if (currency !== countryConfig.currency) {
            validationResults.allowed = false;
            validationResults.failed_rules.push({
                rule: 'CURRENCY_MISMATCH',
                description: `Transaction must use ${countryConfig.currency}`,
                error_message: `Expected ${countryConfig.currency}, got ${currency}`
            });
        }
        
        // Check amount limits
        const { rules } = countryConfig;
        if (amount < rules.min_loan_amount) {
            validationResults.allowed = false;
            validationResults.failed_rules.push({
                rule: 'MIN_AMOUNT',
                description: `Minimum amount is ${rules.min_loan_amount} ${currency}`,
                error_message: `Amount ${amount} below minimum`
            });
        }
        
        if (amount > rules.max_loan_amount) {
            validationResults.allowed = false;
            validationResults.failed_rules.push({
                rule: 'MAX_AMOUNT',
                description: `Maximum amount is ${rules.max_loan_amount} ${currency}`,
                error_message: `Amount ${amount} exceeds maximum`
            });
        }
        
        // Check timezone restrictions for lending
        if (transactionType === 'lend') {
            const localTime = new Date();
            const localHour = localTime.getUTCHours() + 3; // Approximate East Africa time
            
            if (localHour >= 22 || localHour < 6) {
                validationResults.warnings.push({
                    rule: 'NIGHTTIME_LENDING',
                    description: 'Lending during nighttime hours',
                    message: 'Lending restricted between 10 PM and 6 AM'
                });
            }
        }
        
        return validationResults;
    }
    
    // ============================================================================
    // 4.4 Pre and Post Switch Actions
    // ============================================================================
    
    async _performPreSwitchActions(fromCountry, toCountry) {
        this._log('Performing pre-switch actions', { 
            from: fromCountry, 
            to: toCountry 
        });
        
        // Clear cached data from previous country
        await this._clearCountryCache(fromCountry);
        
        // Save current country state
        await this._saveCountryState(fromCountry);
        
        // Notify about country change
        await this._notifyCountryChange(fromCountry, toCountry);
        
        // Validate user can operate in new country
        await this._validateUserForCountry(toCountry);
    }
    
    async _performPostSwitchActions(fromCountry, toCountry) {
        this._log('Performing post-switch actions', { 
            from: fromCountry, 
            to: toCountry 
        });
        
        // Load country-specific configuration
        await this._loadCountryConfiguration(toCountry);
        
        // Update UI for new country
        await this._updateUIForCountry(toCountry);
        
        // Send notifications about country switch
        await this._sendCountrySwitchNotification(fromCountry, toCountry);
        
        // Log security event
        await this._logSecurityEvent('COUNTRY_SWITCH', {
            user_id: this.userData.id,
            from_country: fromCountry,
            to_country: toCountry,
            timestamp: new Date().toISOString()
        });
        
        // Persist country change
        await this._persistCountryChange(toCountry);
        
        // Update user preferences
        await this._updateCountryPreferences(toCountry);
        
        // Reload country-specific data
        await this._reloadCountryData(toCountry);
    }
    
    async _clearCountryCache(countryCode) {
        if (!countryCode) return;
        
        try {
            // Clear country-specific cached data
            if (window.localStorage) {
                const keysToRemove = [];
                
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.includes(`country_${countryCode}`)) {
                        keysToRemove.push(key);
                    }
                }
                
                keysToRemove.forEach(key => localStorage.removeItem(key));
            }
        } catch (error) {
            console.warn('Failed to clear country cache:', error);
        }
    }
    
    async _loadCountryConfiguration(countryCode) {
        const countryConfig = COUNTRY_CONFIGS[countryCode];
        if (!countryConfig) return;
        
        // Set document language
        document.documentElement.lang = countryConfig.language;
        
        // Set timezone in meta tag
        let timezoneMeta = document.querySelector('meta[name="timezone"]');
        if (!timezoneMeta) {
            timezoneMeta = document.createElement('meta');
            timezoneMeta.name = 'timezone';
            document.head.appendChild(timezoneMeta);
        }
        timezoneMeta.content = countryConfig.timezone;
        
        // Update currency formatting
        await this._updateCurrencyFormatting(countryConfig.currency);
        
        // Emit configuration loaded event
        const event = new CustomEvent('mpesewa:country-configuration-loaded', {
            detail: {
                country: countryConfig,
                user_id: this.userData.id
            }
        });
        window.dispatchEvent(event);
    }
    
    async _updateUIForCountry(countryCode) {
        const countryConfig = COUNTRY_CONFIGS[countryCode];
        if (!countryConfig) return;
        
        // Update country indicator in UI
        const countryIndicator = document.getElementById('country-indicator');
        if (countryIndicator) {
            countryIndicator.innerHTML = `
                <span class="country-flag">${countryConfig.flag}</span>
                <span class="country-name">${countryConfig.name}</span>
                <span class="country-currency">(${countryConfig.currency})</span>
            `;
        }
        
        // Update footer contact info
        const footerContacts = document.querySelectorAll('.country-contact-info');
        footerContacts.forEach(element => {
            element.innerHTML = `
                <strong>${countryConfig.name}:</strong>
                ${countryConfig.contact_phone} | ${countryConfig.contact_email}
            `;
        });
        
        // Emit UI update event
        const event = new CustomEvent('mpesewa:ui-country-update', {
            detail: {
                country: countryConfig,
                user: this.userData
            }
        });
        window.dispatchEvent(event);
    }
    
    async _updateCurrencyFormatting(currencyCode) {
        // Update all currency displays
        const currencyElements = document.querySelectorAll('[data-currency]');
        currencyElements.forEach(element => {
            const amount = parseFloat(element.getAttribute('data-amount') || 0);
            const formatted = this.currencyConverter.formatCurrency(amount, currencyCode);
            element.textContent = formatted;
        });
        
        // Update input placeholders
        const currencyInputs = document.querySelectorAll('input[type="number"][data-currency]');
        currencyInputs.forEach(input => {
            const min = input.min || 0;
            const placeholder = this.currencyConverter.formatCurrency(min, currencyCode);
            input.placeholder = `Minimum: ${placeholder}`;
        });
    }
    
    // ============================================================================
    // 4.5 Utility Methods
    // ============================================================================
    
    _checkCountryCompliance(countryCode) {
        const countryConfig = COUNTRY_CONFIGS[countryCode];
        if (!countryConfig) return false;
        
        const { compliance } = countryConfig;
        
        // Check if user meets compliance requirements
        if (compliance.requires_id_verification && !this.userData.id_verified) {
            return false;
        }
        
        if (compliance.requires_phone_verification && !this.userData.phone_verified) {
            return false;
        }
        
        // Check if user has accepted terms for this country
        if (!this.userData.accepted_terms?.[countryCode]) {
            return false;
        }
        
        return true;
    }
    
    _canSwitchToCountry(countryCode) {
        const validation = {
            allowed: true,
            reasons: [],
            requirements: []
        };
        
        const countryConfig = COUNTRY_CONFIGS[countryCode];
        if (!countryConfig) {
            validation.allowed = false;
            validation.reasons.push('Invalid country code');
            return validation;
        }
        
        // Check maintenance
        if (this._maintenanceStatus.get(countryCode)) {
            validation.allowed = false;
            validation.reasons.push('Country under maintenance');
            validation.requirements.push('Wait for maintenance to complete');
        }
        
        // Check if user is registered (country locked after registration)
        if (this.userData.is_registered && countryCode !== this._currentCountry) {
            validation.allowed = false;
            validation.reasons.push('Country locked after registration');
            validation.requirements.push('Contact support to change country');
        }
        
        // Check compliance requirements
        const { compliance } = countryConfig;
        
        if (compliance.requires_id_verification && !this.userData.id_verified) {
            validation.allowed = false;
            validation.reasons.push('ID verification required');
            validation.requirements.push('Verify your ID document');
        }
        
        if (compliance.requires_phone_verification && !this.userData.phone_verified) {
            validation.allowed = false;
            validation.reasons.push('Phone verification required');
            validation.requirements.push('Verify your phone number');
        }
        
        // Check if user has accepted terms
        if (!this.userData.accepted_terms?.[countryCode]) {
            validation.allowed = false;
            validation.reasons.push('Terms not accepted');
            validation.requirements.push(`Accept ${countryConfig.name} terms and conditions`);
        }
        
        return validation;
    }
    
    async _validateUserForCountry(countryCode) {
        const countryConfig = COUNTRY_CONFIGS[countryCode];
        if (!countryConfig) {
            throw new Error(`Invalid country: ${countryCode}`);
        }
        
        // Check if user has necessary verification
        const missingVerifications = [];
        
        if (countryConfig.compliance.requires_id_verification && !this.userData.id_verified) {
            missingVerifications.push('ID verification');
        }
        
        if (countryConfig.compliance.requires_phone_verification && !this.userData.phone_verified) {
            missingVerifications.push('Phone verification');
        }
        
        if (missingVerifications.length > 0) {
            throw new Error(`Missing verifications for ${countryConfig.name}: ${missingVerifications.join(', ')}`);
        }
        
        return true;
    }
    
    _formatCountryRuleErrorMessage(rule, userContext, countryConfig) {
        if (typeof rule.errorMessage === 'function') {
            return rule.errorMessage(
                userContext.currentCountry,
                userContext.targetCountry,
                countryConfig.name,
                userContext.userVerificationStatus
            );
        }
        return rule.errorMessage;
    }
    
    async _updateAvailableCountries() {
        await this._loadAvailableCountries();
        
        // Emit update event
        const event = new CustomEvent('mpesewa:available-countries-updated', {
            detail: {
                availableCountries: this._availableCountries,
                currentCountry: this._currentCountry
            }
        });
        window.dispatchEvent(event);
    }
    
    _recordCountrySwitch(fromCountry, toCountry, options) {
        const switchRecord = {
            id: `country_switch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            from_country: fromCountry,
            to_country: toCountry,
            timestamp: new Date().toISOString(),
            user_id: this.userData.id,
            user_registered: this.userData.is_registered || false,
            ip_address: options.ipAddress || 'unknown',
            user_agent: navigator.userAgent,
            metadata: options.metadata || {}
        };
        
        this._countrySwitchHistory.unshift(switchRecord);
        
        // Keep only last 50 switches
        if (this._countrySwitchHistory.length > 50) {
            this._countrySwitchHistory.pop();
        }
        
        // Save to localStorage
        this._saveSwitchHistory();
        
        return switchRecord;
    }
    
    _recordCountrySelection(countryCode, options) {
        const selectionRecord = {
            id: `country_selection_${Date.now()}`,
            country: countryCode,
            timestamp: new Date().toISOString(),
            user_id: this.userData.id,
            context: 'registration',
            ip_address: options.ipAddress || 'unknown',
            metadata: options.metadata || {}
        };
        
        this._countrySwitchHistory.unshift(selectionRecord);
        this._saveSwitchHistory();
        
        return selectionRecord;
    }
    
    _loadSwitchHistory() {
        try {
            if (window.localStorage) {
                const savedHistory = localStorage.getItem('mpesewa_country_switch_history');
                if (savedHistory) {
                    this._countrySwitchHistory = JSON.parse(savedHistory);
                }
            }
        } catch (error) {
            console.warn('Failed to load switch history:', error);
        }
    }
    
    _saveSwitchHistory() {
        try {
            if (window.localStorage) {
                localStorage.setItem(
                    'mpesewa_country_switch_history',
                    JSON.stringify(this._countrySwitchHistory)
                );
            }
        } catch (error) {
            console.warn('Failed to save switch history:', error);
        }
    }
    
    async _saveCountryState(countryCode) {
        if (!countryCode) return;
        
        try {
            if (window.localStorage) {
                const stateKey = `mpesewa_country_state_${countryCode}`;
                const state = {
                    last_accessed: new Date().toISOString(),
                    user_id: this.userData.id,
                    currency: COUNTRY_CONFIGS[countryCode]?.currency
                };
                
                localStorage.setItem(stateKey, JSON.stringify(state));
            }
        } catch (error) {
            console.warn('Failed to save country state:', error);
        }
    }
    
    async _persistCountryChange(countryCode) {
        try {
            if (this.userData.is_registered) {
                // API call to update user's country
                const response = await fetch('/api/user/update-country', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.userData.token}`
                    },
                    body: JSON.stringify({
                        user_id: this.userData.id,
                        country: countryCode,
                        timestamp: new Date().toISOString()
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to persist country change');
                }
                
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to persist country change:', error);
        }
    }
    
    async _updateCountryPreferences(countryCode) {
        try {
            const preferences = this._countryPreferences.get(countryCode) || {};
            preferences.last_visited = new Date().toISOString();
            preferences.visit_count = (preferences.visit_count || 0) + 1;
            
            this._countryPreferences.set(countryCode, preferences);
            
            if (window.localStorage) {
                localStorage.setItem(
                    'mpesewa_country_preferences',
                    JSON.stringify(Object.fromEntries(this._countryPreferences))
                );
            }
        } catch (error) {
            console.warn('Failed to update country preferences:', error);
        }
    }
    
    async _reloadCountryData(countryCode) {
        // Reload country-specific data (groups, emergency categories, etc.)
        const event = new CustomEvent('mpesewa:country-data-reload', {
            detail: {
                country: countryCode,
                user_id: this.userData.id
            }
        });
        window.dispatchEvent(event);
    }
    
    async _notifyCountryChange(fromCountry, toCountry) {
        // Notify about impending country change
        try {
            const event = new CustomEvent('mpesewa:country-changing', {
                detail: {
                    from_country: fromCountry,
                    to_country: toCountry,
                    user_id: this.userData.id,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.warn('Failed to notify country change:', error);
        }
    }
    
    async _sendCountrySwitchNotification(fromCountry, toCountry) {
        try {
            const fromConfig = COUNTRY_CONFIGS[fromCountry];
            const toConfig = COUNTRY_CONFIGS[toCountry];
            
            const notificationEvent = new CustomEvent('mpesewa:notification', {
                detail: {
                    type: 'country_switch',
                    title: 'Country Changed',
                    message: `Switched from ${fromConfig?.name || fromCountry} to ${toConfig.name}`,
                    icon: toConfig.flag,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(notificationEvent);
        } catch (error) {
            console.warn('Failed to send notification:', error);
        }
    }
    
    async _logSecurityEvent(eventType, data) {
        try {
            const securityEvent = new CustomEvent('mpesewa:security-event', {
                detail: {
                    event_type: eventType,
                    ...data,
                    severity: 'high',
                    source: 'country_switcher'
                }
            });
            window.dispatchEvent(securityEvent);
        } catch (error) {
            console.warn('Failed to log security event:', error);
        }
    }
    
    _log(message, data = {}) {
        console.log(`[M-Pesewa Country Switcher] ${message}`, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }
    
    // ============================================================================
    // 4.6 Public API Methods
    // ============================================================================
    
    getCurrentCountry() {
        return this._currentCountry;
    }
    
    getCurrentCountryConfig() {
        return COUNTRY_CONFIGS[this._currentCountry];
    }
    
    getAvailableCountries() {
        return [...this._availableCountries];
    }
    
    getCountryConfig(countryCode) {
        return COUNTRY_CONFIGS[countryCode] || null;
    }
    
    getSwitchHistory(limit = 20) {
        return this._countrySwitchHistory.slice(0, limit);
    }
    
    getCountryPreferences(countryCode) {
        return this._countryPreferences.get(countryCode) || {};
    }
    
    getAllCountries() {
        return Object.keys(COUNTRY_CONFIGS).map(code => ({
            code,
            ...COUNTRY_CONFIGS[code]
        }));
    }
    
    getCountryRules(countryCode) {
        const config = COUNTRY_CONFIGS[countryCode];
        return config ? config.rules : null;
    }
    
    getCountryCompliance(countryCode) {
        const config = COUNTRY_CONFIGS[countryCode];
        return config ? config.compliance : null;
    }
    
    convertCurrency(amount, fromCurrency, toCurrency) {
        return this.currencyConverter.convert(amount, fromCurrency, toCurrency);
    }
    
    formatCurrencyAmount(amount, currencyCode) {
        return this.currencyConverter.formatCurrency(amount, currencyCode);
    }
    
    getCurrencySymbol(currencyCode) {
        return this.currencyConverter.getCurrencySymbol(currencyCode);
    }
    
    isCountryAvailable(countryCode) {
        const country = this._availableCountries.find(c => c.code === countryCode);
        return country?.canSwitch?.allowed || false;
    }
    
    getCountryAvailability(countryCode) {
        const country = this._availableCountries.find(c => c.code === countryCode);
        return country?.canSwitch || { allowed: false, reasons: [] };
    }
    
    refreshData() {
        return this._initialize();
    }
    
    clearCache() {
        this.currencyConverter._conversionCache.clear();
        
        if (window.localStorage) {
            // Clear country-related localStorage items
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.includes('mpesewa_country')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }
        return this;
    }
    
    // ============================================================================
    // 4.7 Static Methods
    // ============================================================================
    
    static get COUNTRY_CONFIGS() {
        return COUNTRY_CONFIGS;
    }
    
    static get COUNTRY_SWITCHING_RULES() {
        return COUNTRY_SWITCHING_RULES;
    }
    
    static createForUser(userData, navigationState = null, permissionChecker = null) {
        return new MpesewaCountrySwitcher(userData, navigationState, permissionChecker);
    }
}

// ============================================================================
// 5️⃣ ERROR CLASSES
// ============================================================================

class CountrySwitchError extends Error {
    constructor(message, rule = null, details = null) {
        super(message);
        this.name = 'CountrySwitchError';
        this.rule = rule;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
    
    toJSON() {
        return {
            error: this.name,
            message: this.message,
            rule: this.rule,
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

// ============================================================================
// 6️⃣ COUNTRY SWITCHER UI COMPONENT
// ============================================================================

class MpesewaCountrySwitcherUI {
    constructor(countrySwitcher, containerSelector = '#country-switcher') {
        this.countrySwitcher = countrySwitcher;
        this.containerSelector = containerSelector;
        this.container = null;
        this._isOpen = false;
        this._eventListeners = new Map();
        this._searchTerm = '';
        
        this._initializeUI();
    }
    
    async _initializeUI() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        this.container = document.querySelector(this.containerSelector);
        
        if (!this.container) {
            console.warn(`Country switcher container not found: ${this.containerSelector}`);
            return;
        }
        
        this._render();
        this._attachEventListeners();
        this._setupEventHandlers();
    }
    
    _render() {
        const currentCountry = this.countrySwitcher.getCurrentCountryConfig();
        const availableCountries = this.countrySwitcher.getAvailableCountries();
        const allCountries = this.countrySwitcher.getAllCountries();
        
        this.container.innerHTML = `
            <div class="country-switcher-wrapper">
                <button class="country-switcher-toggle" id="country-switcher-toggle" 
                        aria-label="Switch country" aria-haspopup="true" aria-expanded="${this._isOpen}">
                    <span class="current-country-indicator">
                        ${currentCountry ? `
                            <span class="country-flag">${currentCountry.flag}</span>
                            <span class="country-name">${currentCountry.name}</span>
                            <span class="country-currency">${currentCountry.currency}</span>
                            <span class="dropdown-arrow">▾</span>
                        ` : `
                            <span class="country-flag">🌍</span>
                            <span class="country-name">Select Country</span>
                            <span class="dropdown-arrow">▾</span>
                        `}
                    </span>
                </button>
                
                <div class="country-switcher-dropdown" id="country-switcher-dropdown" 
                     aria-hidden="${!this._isOpen}" style="display: ${this._isOpen ? 'block' : 'none'}">
                    <div class="dropdown-header">
                        <h3>Select Country</h3>
                        <p class="dropdown-subtitle">Choose your country to access local services</p>
                        
                        <div class="country-search">
                            <input type="text" id="country-search-input" 
                                   placeholder="Search countries..." 
                                   aria-label="Search countries">
                            <button class="search-clear" id="search-clear-btn" aria-label="Clear search">×</button>
                        </div>
                    </div>
                    
                    <div class="country-regions" id="country-regions">
                        ${this._renderCountryRegions(availableCountries)}
                    </div>
                    
                    <div class="dropdown-footer">
                        <div class="country-info">
                            <div class="current-country-display">
                                <strong>Current:</strong>
                                <span class="current-flag">${currentCountry?.flag}</span>
                                <span class="current-name">${currentCountry?.name}</span>
                                <span class="current-currency">(${currentCountry?.currency})</span>
                            </div>
                            <div class="country-lock-note">
                                ${this.countrySwitcher.userData?.is_registered ? 
                                    '<span class="lock-icon">🔒</span> Country locked after registration' :
                                    '<span class="info-icon">ℹ️</span> Country can be changed during registration'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    _renderCountryRegions(countries) {
        // Group countries by region
        const regions = {};
        
        countries.forEach(country => {
            if (!regions[country.region]) {
                regions[country.region] = [];
            }
            
            // Filter by search term
            if (this._searchTerm) {
                const searchLower = this._searchTerm.toLowerCase();
                const matches = country.name.toLowerCase().includes(searchLower) ||
                               country.currency.toLowerCase().includes(searchLower) ||
                               country.code.toLowerCase().includes(searchLower);
                
                if (!matches) return;
            }
            
            regions[country.region].push(country);
        });
        
        // Sort regions
        const sortedRegions = Object.keys(regions).sort();
        
        return sortedRegions.map(region => `
            <div class="country-region">
                <h4 class="region-title">${region}</h4>
                <div class="region-countries">
                    ${this._renderCountriesInRegion(regions[region])}
                </div>
            </div>
        `).join('');
    }
    
    _renderCountriesInRegion(countries) {
        if (countries.length === 0) {
            return `
                <div class="no-countries">
                    No countries found matching your search
                </div>
            `;
        }
        
        return countries.map(country => {
            const isCurrent = country.code === this.countrySwitcher.getCurrentCountry();
            const canSwitch = country.canSwitch?.allowed;
            
            return `
                <div class="country-item ${isCurrent ? 'current' : ''} ${!canSwitch ? 'disabled' : ''}" 
                     data-country-code="${country.code}"
                     aria-disabled="${!canSwitch}">
                    <div class="country-item-content">
                        <span class="country-flag">${country.flag}</span>
                        <div class="country-info">
                            <h4 class="country-name">${country.name}</h4>
                            <div class="country-meta">
                                <span class="country-currency">${country.currency}</span>
                                <span class="country-timezone">${country.timezone.replace('Africa/', '')}</span>
                                <span class="country-language">${country.language.toUpperCase()}</span>
                            </div>
                            
                            ${country.compliance?.licensed_by ? `
                                <div class="country-compliance">
                                    <span class="compliance-badge">Licensed</span>
                                    <span class="license-info">${country.compliance.licensed_by}</span>
                                </div>
                            ` : ''}
                            
                            ${!canSwitch && country.canSwitch?.reasons ? `
                                <div class="country-restrictions">
                                    <ul>
                                        ${country.canSwitch.reasons.map(reason => 
                                            `<li>${reason}</li>`
                                        ).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="country-actions">
                        ${isCurrent ? `
                            <span class="current-badge">Current</span>
                        ` : canSwitch ? `
                            <button class="switch-country-btn btn btn-small" 
                                    data-country-code="${country.code}"
                                    aria-label="Switch to ${country.name}">
                                Switch
                            </button>
                        ` : `
                            <span class="restricted-badge">Restricted</span>
                        `}
                        
                        <button class="view-country-btn btn btn-outline btn-small" 
                                data-country-code="${country.code}"
                                aria-label="View ${country.name} details">
                            Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    _attachEventListeners() {
        // Toggle dropdown
        const toggleBtn = this.container.querySelector('#country-switcher-toggle');
        if (toggleBtn) {
            this._addEventListener(toggleBtn, 'click', (e) => {
                e.stopPropagation();
                this._toggleDropdown();
            });
        }
        
        // Search input
        const searchInput = this.container.querySelector('#country-search-input');
        if (searchInput) {
            this._addEventListener(searchInput, 'input', (e) => {
                this._searchTerm = e.target.value;
                this._updateCountryList();
            });
            
            this._addEventListener(searchInput, 'keydown', (e) => {
                if (e.key === 'Escape') {
                    this._clearSearch();
                }
            });
        }
        
        // Clear search button
        const clearBtn = this.container.querySelector('#search-clear-btn');
        if (clearBtn) {
            this._addEventListener(clearBtn, 'click', () => {
                this._clearSearch();
            });
        }
        
        // Switch country buttons
        const switchBtns = this.container.querySelectorAll('.switch-country-btn');
        switchBtns.forEach(btn => {
            this._addEventListener(btn, 'click', async (e) => {
                e.stopPropagation();
                const countryCode = btn.getAttribute('data-country-code');
                await this._switchCountry(countryCode);
            });
        });
        
        // View country buttons
        const viewBtns = this.container.querySelectorAll('.view-country-btn');
        viewBtns.forEach(btn => {
            this._addEventListener(btn, 'click', (e) => {
                e.stopPropagation();
                const countryCode = btn.getAttribute('data-country-code');
                this._viewCountryDetails(countryCode);
            });
        });
        
        // Close dropdown when clicking outside
        this._addEventListener(document, 'click', (e) => {
            if (!this.container.contains(e.target) && this._isOpen) {
                this._closeDropdown();
            }
        });
        
        // Handle escape key
        this._addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this._isOpen) {
                this._closeDropdown();
            }
        });
    }
    
    _setupEventHandlers() {
        // Listen for country changes
        this._addEventListener(window, 'mpesewa:country-changed', (e) => {
            this._updateUI();
        });
        
        // Listen for user registration
        this._addEventListener(window, 'mpesewa:user-registered', (e) => {
            this._updateUI();
        });
        
        // Listen for maintenance updates
        this._addEventListener(window, 'mpesewa:maintenance-updated', (e) => {
            this._updateUI();
        });
    }
    
    async _switchCountry(countryCode) {
        if (!confirm('Are you sure you want to switch countries? This will affect your groups and transactions.')) {
            return;
        }
        
        try {
            // Show loading state
            this._showLoading(countryCode, 'switching');
            
            // Check if user is registered
            if (this.countrySwitcher.userData?.is_registered) {
                const confirmed = confirm(
                    'Warning: Country is locked after registration. ' +
                    'Switching countries will require support approval. Continue?'
                );
                
                if (!confirmed) {
                    this._hideLoading(countryCode);
                    return;
                }
            }
            
            // Perform country switch
            const result = await this.countrySwitcher.switchToCountry(countryCode);
            
            if (result.success) {
                // Show success message
                this._showSuccess(`Switched to ${result.country_config.name}`);
                
                // Update UI
                this._updateUI();
                
                // Close dropdown
                this._closeDropdown();
                
                // Reload page to apply country changes
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // Show error message
                this._showError('Switch failed', result.error);
                this._hideLoading(countryCode);
            }
        } catch (error) {
            console.error('Country switch failed:', error);
            this._showError('Switch failed', error.message);
            this._hideLoading(countryCode);
        }
    }
    
    _viewCountryDetails(countryCode) {
        const countryConfig = this.countrySwitcher.getCountryConfig(countryCode);
        if (!countryConfig) return;
        
        // Create modal with country details
        const modalHtml = `
            <div class="country-details-modal">
                <div class="modal-header">
                    <h2>${countryConfig.flag} ${countryConfig.name}</h2>
                    <button class="modal-close" aria-label="Close">×</button>
                </div>
                <div class="modal-body">
                    <div class="country-details-grid">
                        <div class="detail-item">
                            <strong>Currency:</strong>
                            <span>${countryConfig.currency} (${countryConfig.currency_name})</span>
                        </div>
                        <div class="detail-item">
                            <strong>Timezone:</strong>
                            <span>${countryConfig.timezone}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Language:</strong>
                            <span>${countryConfig.language.toUpperCase()}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Calling Code:</strong>
                            <span>${countryConfig.calling_code}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Contact:</strong>
                            <span>${countryConfig.contact_phone}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Legal Jurisdiction:</strong>
                            <span>${countryConfig.legal_jurisdiction}</span>
                        </div>
                    </div>
                    
                    <div class="country-rules">
                        <h3>Loan Rules</h3>
                        <ul>
                            <li>Basic Tier Limit: ${countryConfig.rules.max_weekly_loan_basic} ${countryConfig.currency}</li>
                            <li>Premium Tier Limit: ${countryConfig.rules.max_weekly_loan_premium} ${countryConfig.currency}</li>
                            <li>Super Tier Limit: ${countryConfig.rules.max_weekly_loan_super} ${countryConfig.currency}</li>
                            <li>Interest Rate: ${(countryConfig.rules.interest_rate * 100)}% weekly</li>
                            <li>Penalty Rate: ${(countryConfig.rules.penalty_rate * 100)}% daily after 7 days</li>
                            <li>Repayment Period: ${countryConfig.rules.repayment_period_days} days</li>
                        </ul>
                    </div>
                    
                    <div class="country-compliance">
                        <h3>Compliance Requirements</h3>
                        <ul>
                            <li>ID Verification: ${countryConfig.compliance.requires_id_verification ? 'Required' : 'Not Required'}</li>
                            <li>Phone Verification: ${countryConfig.compliance.requires_phone_verification ? 'Required' : 'Not Required'}</li>
                            <li>CRB Check: ${countryConfig.compliance.requires_crb_check_tier || 'Not Required'}</li>
                            ${countryConfig.compliance.licensed_by ? `
                                <li>Licensed By: ${countryConfig.compliance.licensed_by}</li>
                            ` : ''}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="select-country-btn" 
                            data-country-code="${countryCode}">
                        Select This Country
                    </button>
                </div>
            </div>
        `;
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = modalHtml;
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const selectBtn = modal.querySelector('#select-country-btn');
        const overlay = modal;
        
        this._addEventListener(closeBtn, 'click', () => {
            document.body.removeChild(modal);
        });
        
        this._addEventListener(selectBtn, 'click', async () => {
            document.body.removeChild(modal);
            await this._switchCountry(countryCode);
        });
        
        this._addEventListener(overlay, 'click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(modal);
            }
        });
    }
    
    _updateCountryList() {
        const regionsContainer = this.container.querySelector('#country-regions');
        if (regionsContainer) {
            const availableCountries = this.countrySwitcher.getAvailableCountries();
            regionsContainer.innerHTML = this._renderCountryRegions(availableCountries);
            this._attachEventListeners();
        }
    }
    
    _clearSearch() {
        const searchInput = this.container.querySelector('#country-search-input');
        if (searchInput) {
            searchInput.value = '';
            this._searchTerm = '';
            this._updateCountryList();
            searchInput.focus();
        }
    }
    
    _toggleDropdown() {
        this._isOpen = !this._isOpen;
        
        const dropdown = this.container.querySelector('#country-switcher-dropdown');
        const toggle = this.container.querySelector('#country-switcher-toggle');
        
        if (dropdown) {
            dropdown.style.display = this._isOpen ? 'block' : 'none';
            dropdown.setAttribute('aria-hidden', !this._isOpen);
        }
        
        if (toggle) {
            toggle.setAttribute('aria-expanded', this._isOpen);
        }
        
        // Focus search input when opening
        if (this._isOpen) {
            setTimeout(() => {
                const searchInput = this.container.querySelector('#country-search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
        }
        
        // Update dropdown position
        if (this._isOpen) {
            this._updateDropdownPosition();
        }
    }
    
    _closeDropdown() {
        this._isOpen = false;
        
        const dropdown = this.container.querySelector('#country-switcher-dropdown');
        const toggle = this.container.querySelector('#country-switcher-toggle');
        
        if (dropdown) {
            dropdown.style.display = 'none';
            dropdown.setAttribute('aria-hidden', true);
        }
        
        if (toggle) {
            toggle.setAttribute('aria-expanded', false);
        }
    }
    
    _updateDropdownPosition() {
        const dropdown = this.container.querySelector('#country-switcher-dropdown');
        if (!dropdown) return;
        
        const toggle = this.container.querySelector('#country-switcher-toggle');
        const toggleRect = toggle.getBoundingClientRect();
        
        // Position dropdown below toggle button
        dropdown.style.position = 'absolute';
        dropdown.style.top = `${toggleRect.bottom + window.scrollY + 5}px`;
        dropdown.style.left = `${toggleRect.left + window.scrollX}px`;
        dropdown.style.minWidth = '400px';
        dropdown.style.maxWidth = '500px';
        dropdown.style.maxHeight = '600px';
        dropdown.style.overflowY = 'auto';
    }
    
    _showLoading(countryCode, action) {
        const loadingEvent = new CustomEvent('mpesewa:loading', {
            detail: {
                action: `country_${action}`,
                country_code: countryCode,
                message: `${action} country...`
            }
        });
        window.dispatchEvent(loadingEvent);
    }
    
    _hideLoading(countryCode) {
        const loadingEvent = new CustomEvent('mpesewa:loading-complete', {
            detail: {
                action: `country_switch`,
                country_code: countryCode
            }
        });
        window.dispatchEvent(loadingEvent);
    }
    
    _showSuccess(message) {
        const notificationEvent = new CustomEvent('mpesewa:notification', {
            detail: {
                type: 'success',
                title: 'Success',
                message: message,
                duration: 3000
            }
        });
        window.dispatchEvent(notificationEvent);
    }
    
    _showError(title, message) {
        const notificationEvent = new CustomEvent('mpesewa:notification', {
            detail: {
                type: 'error',
                title: title,
                message: message,
                duration: 5000
            }
        });
        window.dispatchEvent(notificationEvent);
    }
    
    _updateUI() {
        this._render();
        this._attachEventListeners();
    }
    
    _addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        const key = `${element.id || element.className}_${event}`;
        if (!this._eventListeners.has(key)) {
            this._eventListeners.set(key, []);
        }
        this._eventListeners.get(key).push(handler);
    }
    
    cleanup() {
        // Remove all event listeners
        this._eventListeners.forEach((handlers, key) => {
            const [elementId, event] = key.split('_');
            const element = document.getElementById(elementId) || 
                           document.querySelector(`.${elementId}`);
            if (element) {
                handlers.forEach(handler => {
                    element.removeEventListener(event, handler);
                });
            }
        });
        this._eventListeners.clear();
    }
}

// ============================================================================
// 7️⃣ EXPORTS
// ============================================================================

export {
    MpesewaCountrySwitcher,
    MpesewaCountrySwitcherUI,
    MpesewaCurrencyConverter,
    CountrySwitchError,
    COUNTRY_CONFIGS,
    COUNTRY_SWITCHING_RULES
};

// Default export
export default MpesewaCountrySwitcher;