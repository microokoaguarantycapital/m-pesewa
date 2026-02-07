/**
 * M-PESEWA GHANA COUNTRY CONFIGURATION
 * Strict Country Isolation Configuration for Ghana Operations
 * Last Updated: 2024
 * Version: 1.0.0
 * 
 * ✅ STRICT ENFORCEMENT: No cross-country lending or borrowing
 * ✅ GLOBAL HIERARCHY: Global → Ghana → Groups → Lenders → Borrowers (Ledgers)
 * ✅ CURRENCY ISOLATION: GHS (Ghanaian Cedi) only
 * ✅ COMPLIANCE: Bank of Ghana Regulations & Data Protection Act
 */

const GHANA_CONFIG = {
    // ============================================
    // 1️⃣ COUNTRY IDENTIFICATION & METADATA
    // ============================================
    country: {
        id: 'GH',
        name: 'Ghana',
        fullName: 'Republic of Ghana',
        officialName: 'Republic of Ghana',
        isoCode: 'GH',
        iso3Code: 'GHA',
        callingCode: '+233',
        region: 'West Africa',
        subRegion: 'Western Africa',
        timezone: 'Africa/Accra',
        capital: 'Accra',
        population: '32.8 million',
        gdp: '$72.8 billion',
        language: 'English (Official)',
        localLanguages: ['Twi', 'Fante', 'Ewe', 'Ga', 'Dagbani'],
        flagEmoji: '🇬🇭',
        flagDescription: 'Red, Gold, Green with Black Star',
        coordinates: {
            latitude: 7.9465,
            longitude: -1.0232
        },
        bankingHours: '08:30 AM - 5:00 PM GMT',
        holidays: [
            '2024-01-01', // New Year's Day
            '2024-01-07', // Constitution Day
            '2024-03-06', // Independence Day
            '2024-04-10', // Good Friday
            '2024-04-13', // Easter Monday
            '2024-05-01', // Labour Day
            '2024-06-03', // Eid al-Fitr
            '2024-08-01', // Founders' Day
            '2024-09-21', // Kwame Nkrumah Memorial Day
            '2024-12-25', // Christmas Day
            '2024-12-26'  // Boxing Day
        ]
    },

    // ============================================
    // 2️⃣ CURRENCY & FINANCIAL CONFIGURATION
    // ============================================
    currency: {
        code: 'GHS',
        symbol: 'GH₵',
        name: 'Ghanaian Cedi',
        subunit: 'Pesewa',
        subunitValue: 100,
        decimalPlaces: 2,
        format: '{symbol}{amount}',
        exchangeRates: {
            USD: 12.5,     // 1 USD = 12.5 GHS
            EUR: 13.8,     // 1 EUR = 13.8 GHS
            GBP: 15.9,     // 1 GBP = 15.9 GHS
            KES: 0.085,    // 1 KES = 0.085 GHS
            NGN: 0.015,    // 1 NGN = 0.015 GHS
            ZAR: 0.68,     // 1 ZAR = 0.68 GHS
        },
        centralBank: 'Bank of Ghana',
        regulatoryBody: 'Bank of Ghana',
        mobileMoneyProviders: [
            'MTN Mobile Money',
            'Vodafone Cash',
            'AirtelTigo Money',
            'G-Money',
            'Bank Transfer'
        ],
        supportedBanks: [
            'Ghana Commercial Bank',
            'Agricultural Development Bank',
            'Ecobank Ghana',
            'Standard Chartered Bank Ghana',
            'Barclays Bank Ghana',
            'Fidelity Bank Ghana',
            'CalBank',
            'Republic Bank Ghana',
            'Zenith Bank Ghana',
            'Access Bank Ghana'
        ]
    },

    // ============================================
    // 3️⃣ BUSINESS RULES & LIMITATIONS (STRICT)
    // ============================================
    rules: {
        // HIERARCHY ENFORCEMENT
        hierarchy: {
            levels: ['Global', 'Country', 'Groups', 'Lenders', 'Borrowers'],
            isolation: {
                country: true,   // No cross-country transactions
                group: true,     // Lenders can only lend within their group
                currency: true   // Transactions in GHS only
            }
        },

        // GROUP RULES
        groups: {
            minMembers: 5,
            maxMembers: 1000,
            maxGroupsPerUser: 4,
            invitationOnly: true,
            countryLocked: true,
            groupTypes: [
                'Family Group',
                'Church Group',
                'Professional Group',
                'Community Group',
                'Social Group',
                'Business Group',
                'Alumni Group',
                'Neighborhood Group'
            ],
            adminPrivileges: [
                'Invite members',
                'Moderate group',
                'Set group rules',
                'View group analytics',
                'Approve join requests'
            ]
        },

        // LENDER RULES
        lenders: {
            subscriptionRequired: true,
            minAge: 18,
            idRequirements: ['Ghana Card', 'Passport', "Driver's License"],
            addressVerification: true,
            phoneVerification: true,
            maxLedgers: 'unlimited',
            lendingLimits: {
                basic: 1500,     // GHS per week
                premium: 5000,   // GHS per week
                super: 20000,    // GHS per week
                lenderOfLenders: 50000  // GHS per week
            },
            categories: [
                'All',
                'Transportation',
                'Food & Essentials',
                'Utilities',
                'Education',
                'Healthcare',
                'Business',
                'Emergency'
            ]
        },

        // BORROWER RULES
        borrowers: {
            subscriptionFree: true,
            minAge: 18,
            maxGroups: 4,
            ratingRequired: true,
            blacklistEnforcement: true,
            loanTerms: {
                maxPeriod: 7,           // days
                interestRate: 0.10,     // 10%
                penaltyRate: 0.05,      // 5% daily after 7 days
                defaultPeriod: 60,      // days
                minLoan: 5,             // GHS
                dailyRepayment: true
            }
        }
    },

    // ============================================
    // 4️⃣ SUBSCRIPTION TIERS (GHS SPECIFIC)
    // ============================================
    subscriptions: {
        tiers: {
            basic: {
                name: 'Basic',
                weeklyLimit: 1500,
                monthlyFee: 50,
                biAnnualFee: 250,
                annualFee: 500,
                crbCheck: false,
                maxLedgers: 1500,
                features: [
                    'Basic lending tools',
                    'Up to 10 borrowers',
                    'Manual ledger updates',
                    'Basic reporting'
                ]
            },
            premium: {
                name: 'Premium',
                weeklyLimit: 5000,
                monthlyFee: 250,
                biAnnualFee: 1500,
                annualFee: 2500,
                crbCheck: false,
                maxLedgers: 10000,
                features: [
                    'Advanced lending tools',
                    'Up to 50 borrowers',
                    'Automated reminders',
                    'Advanced reporting',
                    'Risk assessment tools'
                ]
            },
            super: {
                name: 'Super',
                weeklyLimit: 20000,
                monthlyFee: 1000,
                biAnnualFee: 5000,
                annualFee: 8500,
                crbCheck: true,
                maxLedgers: 20000,
                features: [
                    'Premium lending tools',
                    'Unlimited borrowers',
                    'CRB integration',
                    'Priority support',
                    'Advanced analytics',
                    'Dedicated account manager'
                ]
            },
            lenderOfLenders: {
                name: 'Lender of Lenders',
                weeklyLimit: 50000,
                monthlyFee: 500,
                biAnnualFee: 3500,
                annualFee: 6500,
                crbCheck: true,
                maxLedgers: 50000,
                features: [
                    'Custom interest rates',
                    'Extended repayment terms',
                    'Bulk lending tools',
                    'Enterprise reporting',
                    'API access',
                    '24/7 dedicated support'
                ]
            }
        },
        expiryDate: 28, // 28th of every month
        paymentMethods: [
            'MTN Mobile Money',
            'Vodafone Cash',
            'AirtelTigo Money',
            'Bank Transfer',
            'Credit/Debit Card'
        ],
        gracePeriod: 3, // days
        autoRenewal: false
    },

    // ============================================
    // 5️⃣ REGULATORY & COMPLIANCE SETTINGS
    // ============================================
    compliance: {
        regulatoryBodies: [
            {
                name: 'Bank of Ghana',
                role: 'Central Bank & Financial Regulation',
                website: 'https://www.bog.gov.gh',
                contact: '+233 302 666 000'
            },
            {
                name: 'Data Protection Commission',
                role: 'Data Privacy Regulation',
                website: 'https://www.dataprotection.org.gh',
                contact: '+233 302 906 900'
            },
            {
                name: 'Ghana Revenue Authority',
                role: 'Tax Compliance',
                website: 'https://www.gra.gov.gh',
                contact: '+233 302 905 000'
            }
        ],
        taxRules: {
            vat: 0.15,          // 15% VAT
            withholdingTax: 0.05, // 5% withholding tax
            corporateTax: 0.25,  // 25% corporate tax
            exemptThreshold: 5000 // GHS
        },
        kycRequirements: {
            individuals: [
                'Ghana Card (mandatory)',
                'Proof of Address',
                'Proof of Income',
                'Passport Photos (2)',
                'Tax Identification Number (TIN)'
            ],
            businesses: [
                'Certificate of Incorporation',
                'Business Registration Certificate',
                'Tax Clearance Certificate',
                'Company TIN',
                'Directors Identification'
            ]
        },
        dataRetention: {
            userData: '7 years',
            transactionData: '10 years',
            auditLogs: '10 years',
            kycDocuments: '10 years'
        },
        reportingRequirements: [
            'Monthly transaction reports to Bank of Ghana',
            'Quarterly financial statements',
            'Annual audit reports',
            'Suspicious activity reports (SAR)',
            'Tax compliance reports'
        ]
    },

    // ============================================
    // 6️⃣ REGIONAL & CULTURAL ADAPTATIONS
    // ============================================
    regional: {
        majorCities: [
            { name: 'Accra', population: '4.6 million', region: 'Greater Accra' },
            { name: 'Kumasi', population: '3.9 million', region: 'Ashanti' },
            { name: 'Tamale', population: '1.1 million', region: 'Northern' },
            { name: 'Sekondi-Takoradi', population: '0.9 million', region: 'Western' },
            { name: 'Cape Coast', population: '0.7 million', region: 'Central' }
        ],
        economicActivities: [
            'Agriculture (cocoa, cassava, yam)',
            'Mining (gold, oil, bauxite)',
            'Services (banking, telecom)',
            'Manufacturing',
            'Tourism'
        ],
        culturalConsiderations: {
            greeting: 'Formal greetings are important',
            negotiation: 'Indirect communication preferred',
            trustBuilding: 'Personal relationships matter',
            timePerception: 'Flexible time (African time)',
            decisionMaking: 'Consensus often preferred'
        },
        localTerms: {
            money: 'Sika',
            friend: 'Adamfo',
            trust: 'Gyidie',
            community: 'Abusua',
            business: 'Dwumadie'
        }
    },

    // ============================================
    // 7️⃣ EMERGENCY CATEGORIES (GHANA SPECIFIC)
    // ============================================
    emergencyCategories: {
        transport: [
            'Trotro/Mini-bus fare',
            'Taxi fare within city',
            'Inter-city transport',
            'Motorcycle (okada) fare',
            'Fuel for private vehicle'
        ],
        utilities: [
            'Electricity (ECG) tokens',
            'Water (GWCL) bill',
            'Internet data bundle',
            'TV subscription (DSTV, GoTV)',
            'Cooking gas refill'
        ],
        education: [
            'School fees (basic education)',
            'University fees',
            'School supplies',
            'Transport to school',
            'Exam registration fees'
        ],
        health: [
            'Hospital bills (NHIS co-payment)',
            'Medication purchase',
            'Laboratory tests',
            'Emergency transport to hospital',
            'Maternal health expenses'
        ],
        business: [
            'Market money (soko loan)',
            'Working capital for petty trading',
            'Hawker stock replenishment',
            'Artisan tool repair',
            'Micro-business expansion'
        ]
    },

    // ============================================
    // 8️⃣ INFRASTRUCTURE & CONNECTIVITY
    // ============================================
    infrastructure: {
        internetPenetration: 45.7, // percentage
        mobilePenetration: 139.8,  // percentage
        electricityAccess: 85.9,   // percentage
        urbanPopulation: 56.7,     // percentage
        bankingPenetration: 58.3,  // percentage
        telcos: [
            { name: 'MTN Ghana', marketShare: 55.2, mobileMoney: 'MTN Mobile Money' },
            { name: 'Vodafone Ghana', marketShare: 22.1, mobileMoney: 'Vodafone Cash' },
            { name: 'AirtelTigo', marketShare: 18.4, mobileMoney: 'AirtelTigo Money' },
            { name: 'Glo Ghana', marketShare: 4.3, mobileMoney: 'Glo Money' }
        ],
        internetSpeeds: {
            mobile: '15.2 Mbps',
            fixed: '8.7 Mbps',
            ranking: '98th globally'
        }
    },

    // ============================================
    // 9️⃣ RISK ASSESSMENT & SCORING
    // ============================================
    riskAssessment: {
        economicRisk: 'Medium',
        politicalRisk: 'Low',
        regulatoryRisk: 'Medium',
        currencyRisk: 'High',
        inflationRate: 10.7, // percentage
        unemploymentRate: 4.5, // percentage
        creditBureaus: [
            'XDS Data Ghana',
            'Dun & Bradstreet Ghana',
            'Creditinfo Ghana'
        ],
        blacklistCriteria: [
            'Default beyond 60 days',
            'Multiple defaults across groups',
            'Fraudulent activity',
            'Identity theft',
            'Money laundering suspicion'
        ]
    },

    // ============================================
    // 🔟 OPERATIONAL CONFIGURATION
    // ============================================
    operations: {
        supportHours: {
            weekdays: '8:00 AM - 8:00 PM GMT',
            weekends: '9:00 AM - 6:00 PM GMT',
            holidays: '10:00 AM - 4:00 PM GMT'
        },
        languages: {
            primary: 'English',
            secondary: ['Twi', 'Ga', 'Ewe', 'Fante'],
            supportLanguages: ['English', 'Twi', 'Ga']
        },
        timezone: 'GMT',
        businessDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        settlementCycles: {
            instant: ['MTN Mobile Money', 'Vodafone Cash'],
            nextDay: ['Bank Transfers', 'AirtelTigo Money'],
            weekly: ['Cheque deposits']
        },
        escalationPaths: {
            level1: 'Customer Support (24/7)',
            level2: 'Country Manager',
            level3: 'Regional Director',
            level4: 'Head of Operations'
        }
    },

    // ============================================
    // 🔢 ANALYTICS & REPORTING CONFIG
    // ============================================
    analytics: {
        metrics: [
            'Average loan size (GHS)',
            'Default rate (%)',
            'Repayment rate (%)',
            'User growth rate (%)',
            'Group formation rate',
            'Transaction volume (GHS)',
            'Active lenders count',
            'Active borrowers count'
        ],
        kpis: {
            targetRepaymentRate: 99,
            targetDefaultRate: 1,
            targetUserGrowth: 20,
            targetTransactionVolume: 1000000,
            targetGroupFormation: 100
        },
        reports: {
            daily: 'Transaction summary',
            weekly: 'Risk assessment',
            monthly: 'Financial statements',
            quarterly: 'Regulatory compliance',
            annual: 'Audit and performance'
        }
    },

    // ============================================
    // 🚨 EMERGENCY & CONTINGENCY PLANS
    // ============================================
    contingency: {
        systemOutage: {
            backupSystem: 'Yes',
            recoveryTime: '4 hours',
            dataBackup: 'Real-time replication',
            contactPerson: 'Ghana Operations Manager'
        },
        regulatoryChanges: {
            monitoringTeam: 'Legal & Compliance Dept',
            updateFrequency: 'Weekly regulatory review',
            gracePeriod: '30 days for compliance'
        },
        economicCrisis: {
            riskBuffer: '30% reserve requirement',
            stressTestFrequency: 'Quarterly',
            contingencyFund: 'Yes, 10% of capital'
        }
    }
};

// ============================================
// EXPORT & VALIDATION
// ============================================

/**
 * Validate Ghana configuration on load
 * @throws {Error} If configuration violates hierarchy rules
 */
function validateGhanaConfig() {
    const errors = [];
    
    // Validate hierarchy isolation
    if (!GHANA_CONFIG.rules.hierarchy.isolation.country) {
        errors.push('Country isolation must be enabled for Ghana');
    }
    
    if (!GHANA_CONFIG.rules.hierarchy.isolation.group) {
        errors.push('Group isolation must be enabled for Ghana');
    }
    
    if (!GHANA_CONFIG.rules.hierarchy.isolation.currency) {
        errors.push('Currency isolation must be enabled for Ghana');
    }
    
    // Validate currency
    if (GHANA_CONFIG.currency.code !== 'GHS') {
        errors.push('Currency must be GHS for Ghana');
    }
    
    // Validate subscription expiry
    if (GHANA_CONFIG.subscriptions.expiryDate !== 28) {
        errors.push('Subscription must expire on 28th of month');
    }
    
    // Validate group rules
    if (GHANA_CONFIG.rules.groups.minMembers < 5) {
        errors.push('Minimum group members must be at least 5');
    }
    
    if (GHANA_CONFIG.rules.groups.maxMembers > 1000) {
        errors.push('Maximum group members cannot exceed 1000');
    }
    
    if (GHANA_CONFIG.rules.groups.maxGroupsPerUser > 4) {
        errors.push('Maximum groups per user cannot exceed 4');
    }
    
    if (errors.length > 0) {
        throw new Error(`Ghana Configuration Validation Failed:\n${errors.join('\n')}`);
    }
    
    return true;
}

/**
 * Get country-specific validation rules
 * @returns {Object} Validation rules for Ghana
 */
function getGhanaValidationRules() {
    return {
        phoneNumber: /^\+233[0-9]{9}$/,
        ghanaCard: /^GHA-[0-9]{9}-[0-9]{1}$/,
        tin: /^C[0-9]{9}$/,
        amount: {
            min: 5,
            max: 50000,
            currency: 'GHS'
        },
        age: {
            min: 18,
            max: 100
        }
    };
}

/**
 * Format currency for Ghana
 * @param {number} amount - Amount in GHS
 * @returns {string} Formatted currency string
 */
function formatGhanaCurrency(amount) {
    const formatted = new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    
    return formatted.replace('GHS', 'GH₵');
}

/**
 * Calculate interest for Ghana loans
 * @param {number} principal - Loan amount in GHS
 * @param {number} days - Days overdue (0-7 = 10%, >7 = 5% daily)
 * @returns {Object} Interest and penalty breakdown
 */
function calculateGhanaInterest(principal, days = 7) {
    const baseInterest = principal * 0.10; // 10% for 7 days
    
    if (days <= 7) {
        return {
            principal: principal,
            interest: baseInterest,
            total: principal + baseInterest,
            penalty: 0,
            daysOverdue: 0,
            isDefault: false
        };
    }
    
    const overdueDays = days - 7;
    const dailyPenaltyRate = 0.05; // 5% daily
    const penalty = principal * dailyPenaltyRate * overdueDays;
    const isDefault = overdueDays > 53; // 60 days total = default
    
    return {
        principal: principal,
        interest: baseInterest,
        penalty: penalty,
        total: principal + baseInterest + penalty,
        daysOverdue: overdueDays,
        isDefault: isDefault,
        defaultDate: isDefault ? new Date(Date.now() + (overdueDays - 53) * 24 * 60 * 60 * 1000) : null
    };
}

/**
 * Check if user is eligible for Ghana operations
 * @param {Object} user - User object
 * @returns {Object} Eligibility result
 */
function checkGhanaEligibility(user) {
    const requirements = {
        age: user.age >= 18,
        residency: user.country === 'GH',
        idVerified: user.ghanaCardVerified || user.passportVerified,
        phoneVerified: user.phoneVerified,
        notBlacklisted: !user.blacklisted,
        maxGroups: user.groupsCount < 4,
        goodRating: user.rating >= 3.0
    };
    
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    const totalRequirements = Object.keys(requirements).length;
    const eligibilityScore = (metRequirements / totalRequirements) * 100;
    
    return {
        eligible: Object.values(requirements).every(Boolean),
        requirements: requirements,
        score: eligibilityScore,
        missing: Object.keys(requirements).filter(key => !requirements[key]),
        message: eligibilityScore === 100 
            ? 'Eligible for all Ghana operations'
            : `Eligibility score: ${eligibilityScore.toFixed(2)}%`
    };
}

/**
 * Get Ghana region by city
 * @param {string} city - City name
 * @returns {string} Region name
 */
function getGhanaRegion(city) {
    const regionMap = {
        'Accra': 'Greater Accra',
        'Tema': 'Greater Accra',
        'Kumasi': 'Ashanti',
        'Obuasi': 'Ashanti',
        'Tamale': 'Northern',
        'Sekondi': 'Western',
        'Takoradi': 'Western',
        'Cape Coast': 'Central',
        'Sunyani': 'Bono',
        'Ho': 'Volta',
        'Koforidua': 'Eastern',
        'Wa': 'Upper West',
        'Bolgatanga': 'Upper East'
    };
    
    return regionMap[city] || 'Unknown Region';
}

/**
 * Get mobile money provider by phone prefix
 * @param {string} phoneNumber - Ghana phone number
 * @returns {string} Mobile money provider
 */
function getMobileMoneyProvider(phoneNumber) {
    const prefix = phoneNumber.substring(4, 6); // +233 XX XXX XXXX
    
    const providerMap = {
        '24': 'MTN Ghana',
        '20': 'MTN Ghana',
        '50': 'Vodafone Ghana',
        '26': 'Vodafone Ghana',
        '27': 'AirtelTigo',
        '57': 'AirtelTigo',
        '23': 'Glo Ghana'
    };
    
    return providerMap[prefix] || 'Unknown Provider';
}

// Export all Ghana configuration and utilities
export {
    GHANA_CONFIG,
    validateGhanaConfig,
    getGhanaValidationRules,
    formatGhanaCurrency,
    calculateGhanaInterest,
    checkGhanaEligibility,
    getGhanaRegion,
    getMobileMoneyProvider
};

// Auto-validation on module load
try {
    validateGhanaConfig();
    console.log('✅ Ghana configuration validated successfully');
} catch (error) {
    console.error('❌ Ghana configuration validation failed:', error.message);
    throw error;
}

// Export default configuration
export default GHANA_CONFIG;