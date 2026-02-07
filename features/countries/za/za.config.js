/**
 * South Africa (ZA) Configuration Module
 * M-Pesewa Country Configuration - South Africa
 * Last Updated: 2026-01-24
 * 
 * STRICT HIERARCHY ENFORCEMENT:
 * Global → Country (ZA) → Groups → Lenders → Borrowers (Ledgers)
 */

const ZA_CONFIG = {
    // ============================================
    // 1. COUNTRY IDENTIFICATION
    // ============================================
    country: {
        code: "ZA",
        name: "South Africa",
        formalName: "Republic of South Africa",
        continent: "Africa",
        region: "Southern Africa",
        timezone: "Africa/Johannesburg",
        language: "English",
        officialLanguages: ["English", "Zulu", "Xhosa", "Afrikaans", "Sotho", "Tswana"],
        population: "60.14M",
        gdpPerCapita: "$6,040",
        currency: {
            code: "ZAR",
            symbol: "R",
            name: "South African Rand",
            decimalPlaces: 2,
            exchangeRate: {
                USD: 0.053,
                EUR: 0.049,
                GBP: 0.043,
                KES: 7.85
            }
        },
        flag: {
            emoji: "🇿🇦",
            colors: ["#007A4D", "#000000", "#FFB81C", "#FFFFFF", "#E03C31"],
            description: "Green, black, yellow, white, red - Rainbow Nation"
        }
    },

    // ============================================
    // 2. REGULATORY & LEGAL FRAMEWORK
    // ============================================
    regulation: {
        financialAuthority: "Financial Sector Conduct Authority (FSCA)",
        registrationNumber: "2023/123456/07",
        vatNumber: "4880266188",
        ncrNumber: "NCRCP12345",
        dataProtectionLaw: "Protection of Personal Information Act (POPIA)",
        consumerProtection: "National Credit Act (NCA)",
        maxLoanAmount: 50000,
        minLoanAmount: 50,
        interestRateCap: {
            annual: 20.5,
            monthly: 1.71,
            weekly: 0.395
        },
        coolingOffPeriod: 5,
        disputeResolution: "Ombudsman for Banking Services (OBS)",
        blacklistRegistry: "Credit Bureau"
    },

    // ============================================
    // 3. PLATFORM SPECIFIC CONFIGURATION
    // ============================================
    platform: {
        // 3.1. Country Isolation Rules
        isolation: {
            enabled: true,
            strict: true,
            crossCountryOperations: false,
            currencyExchange: false,
            groupCrossMembership: false,
            enforcementLevel: "HIGH"
        },

        // 3.2. Subscription Tiers (Lender Only)
        subscriptionTiers: {
            basic: {
                name: "Basic",
                maxWeeklyLimit: 1500,
                monthlyFee: 50,
                biAnnualFee: 250,
                annualFee: 500,
                crbCheck: false,
                maxLedgers: 10,
                features: ["Basic Lending", "5 Groups Max", "Basic Analytics"]
            },
            premium: {
                name: "Premium",
                maxWeeklyLimit: 5000,
                monthlyFee: 250,
                biAnnualFee: 1500,
                annualFee: 2500,
                crbCheck: false,
                maxLedgers: 50,
                features: ["Advanced Lending", "10 Groups Max", "Advanced Analytics", "Priority Support"]
            },
            super: {
                name: "Super",
                maxWeeklyLimit: 20000,
                monthlyFee: 1000,
                biAnnualFee: 5000,
                annualFee: 8500,
                crbCheck: true,
                maxLedgers: 100,
                features: ["Premium Lending", "Unlimited Groups", "Premium Analytics", "24/7 Support", "CRB Integration"]
            },
            lenderOfLenders: {
                name: "Lender of Lenders",
                maxWeeklyLimit: 50000,
                monthlyFee: 500,
                biAnnualFee: 3500,
                annualFee: 6500,
                crbCheck: true,
                maxLedgers: 500,
                features: ["Institutional Lending", "Custom Terms", "Bulk Operations", "API Access"]
            }
        },

        // 3.3. Loan Configuration
        loans: {
            defaultTerm: 7,
            defaultInterest: 10,
            penaltyRate: 5,
            defaultThreshold: 60,
            maxActiveLoansPerBorrower: 1,
            minLoanAmount: 5,
            maxGroupsPerBorrower: 4,
            repaymentOptions: ["Daily", "Weekly", "Bi-weekly", "Monthly"],
            gracePeriod: 0
        },

        // 3.4. Group Configuration
        groups: {
            minMembers: 5,
            maxMembers: 1000,
            minLenders: 1,
            maxGroupsPerUser: 4,
            creationFee: 0,
            types: ["Family", "Friends", "Professional", "Church", "Community", "Business", "Social", "Sports"],
            invitationRequired: true,
            referralRequired: true
        }
    },

    // ============================================
    // 4. FINANCIAL INSTITUTIONS & PARTNERSHIPS
    // ============================================
    financialInstitutions: {
        banks: [
            {
                name: "Standard Bank",
                code: "051001",
                swift: "SBZA0X",
                supportEmail: "digitalsupport@standardbank.co.za",
                integration: true
            },
            {
                name: "First National Bank",
                code: "250655",
                swift: "FIRNZAJJ",
                supportEmail: "onlinebanking@fnb.co.za",
                integration: true
            },
            {
                name: "Absa Bank",
                code: "632005",
                swift: "ABSAZAJJ",
                supportEmail: "absaonline@absa.co.za",
                integration: true
            },
            {
                name: "Nedbank",
                code: "198765",
                swift: "NEDSZAJJ",
                supportEmail: "nedbankonline@nedbank.co.za",
                integration: true
            },
            {
                name: "Capitec Bank",
                code: "470010",
                swift: "CABLZAJJ",
                supportEmail: "clientcare@capitecbank.co.za",
                integration: true
            }
        ],
        mobileMoney: [
            {
                name: "M-Pesa South Africa",
                provider: "Vodacom",
                shortcode: "*120*123#",
                support: "082111",
                integration: true
            },
            {
                name: "eWallet",
                provider: "FNB",
                shortcode: "*120*321#",
                support: "0875751111",
                integration: true
            },
            {
                name: "Instant Money",
                provider: "Standard Bank",
                shortcode: "*120*2345#",
                support: "0860077863",
                integration: true
            }
        ],
        paymentProcessors: [
            {
                name: "PayFast",
                website: "https://www.payfast.co.za",
                apiKeyRequired: true,
                transactionFee: "2.9% + R2.00"
            },
            {
                name: "PayGate",
                website: "https://www.paygate.co.za",
                apiKeyRequired: true,
                transactionFee: "3.0% + R2.50"
            },
            {
                name: "Yoco",
                website: "https://www.yoco.co.za",
                apiKeyRequired: true,
                transactionFee: "2.95% + R1.50"
            }
        ]
    },

    // ============================================
    // 5. REGIONAL & DEMOGRAPHIC DATA
    // ============================================
    demographics: {
        provinces: [
            "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
            "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"
        ],
        majorCities: [
            { name: "Johannesburg", population: "5.6M", province: "Gauteng" },
            { name: "Cape Town", population: "4.6M", province: "Western Cape" },
            { name: "Durban", population: "3.1M", province: "KwaZulu-Natal" },
            { name: "Pretoria", population: "2.5M", province: "Gauteng" },
            { name: "Port Elizabeth", population: "1.2M", province: "Eastern Cape" },
            { name: "Bloemfontein", population: "0.6M", province: "Free State" }
        ],
        averageIncome: {
            monthly: "R15,000",
            hourly: "R85",
            povertyLine: "R1,268"
        },
        unemploymentRate: "32.7%",
        digitalAdoption: {
            internetUsers: "41.5M",
            smartphonePenetration: "91%",
            socialMediaUsers: "25.8M"
        }
    },

    // ============================================
    // 6. EMERGENCY CATEGORIES CONFIGURATION
    // ============================================
    emergencyCategories: {
        enabled: true,
        defaultCategories: [
            {
                id: "za_fare",
                name: "M-pesewa Fare",
                description: "Transport money for emergencies",
                icon: "🚌",
                maxAmount: 500,
                minAmount: 20,
                popularity: 85
            },
            {
                id: "za_data",
                name: "M-pesewa Data",
                description: "Mobile data bundles",
                icon: "📶",
                maxAmount: 200,
                minAmount: 10,
                popularity: 90
            },
            {
                id: "za_food",
                name: "M-pesewa Food",
                description: "Emergency food supplies",
                icon: "🍲",
                maxAmount: 1000,
                minAmount: 50,
                popularity: 75
            },
            {
                id: "za_electricity",
                name: "M-pesewa Electricity",
                description: "Eskom prepaid electricity",
                icon: "⚡",
                maxAmount: 1500,
                minAmount: 50,
                popularity: 80
            },
            {
                id: "za_medicine",
                name: "M-pesewa Medicine",
                description: "Emergency medical supplies",
                icon: "💊",
                maxAmount: 3000,
                minAmount: 100,
                popularity: 70
            },
            {
                id: "za_school",
                name: "M-pesewa School Fees",
                description: "School fees and supplies",
                icon: "🎓",
                maxAmount: 5000,
                minAmount: 500,
                popularity: 65
            },
            {
                id: "za_fuel",
                name: "M-pesewa Fuel",
                description: "Petrol and diesel",
                icon: "⛽",
                maxAmount: 2000,
                minAmount: 100,
                popularity: 60
            },
            {
                id: "za_rent",
                name: "M-pesewa Rent",
                description: "Rent assistance",
                icon: "🏠",
                maxAmount: 8000,
                minAmount: 1000,
                popularity: 55
            }
        ],
        customCategoriesAllowed: true,
        maxCustomCategories: 5
    },

    // ============================================
    // 7. COMPLIANCE & REPORTING
    // ============================================
    compliance: {
        tax: {
            vatRate: 15,
            incomeTaxThreshold: 95750,
            sarsReporting: true,
            taxClearanceRequired: false
        },
        reporting: {
            daily: true,
            weekly: true,
            monthly: true,
            quarterly: true,
            annual: true
        },
        audits: {
            internal: "Monthly",
            external: "Annual",
            regulator: "As required by FSCA"
        },
        dataRetention: {
            userData: "7 years",
            transactionData: "7 years",
            auditLogs: "10 years"
        }
    },

    // ============================================
    // 8. SECURITY & FRAUD PREVENTION
    // ============================================
    security: {
        kycRequirements: {
            level1: ["Name", "Phone", "Email"],
            level2: ["ID Number", "Address", "Selfie"],
            level3: ["Proof of Address", "Proof of Income", "Bank Statement"]
        },
        verificationMethods: [
            "OTP via SMS",
            "OTP via Email",
            "Biometric",
            "Two-Factor Authentication"
        ],
        fraudDetection: {
            enabled: true,
            rules: [
                "Multiple Accounts Detection",
                "Unusual Transaction Patterns",
                "Geolocation Verification",
                "Device Fingerprinting"
            ]
        },
        encryption: {
            dataAtRest: "AES-256",
            dataInTransit: "TLS 1.3",
            keyManagement: "AWS KMS"
        }
    },

    // ============================================
    // 9. PERFORMANCE METRICS & MONITORING
    // ============================================
    metrics: {
        targets: {
            repaymentRate: 99,
            defaultRate: 1,
            userSatisfaction: 95,
            platformUptime: 99.9,
            transactionSuccess: 99.5
        },
        monitoring: {
            realTime: true,
            alerts: ["High Risk", "Default Alert", "System Down", "Fraud Alert"],
            dashboards: ["Admin", "Lender", "Borrower", "Regulator"]
        }
    },

    // ============================================
    // 10. INTEGRATION & API CONFIGURATION
    // ============================================
    integrations: {
        creditBureaus: [
            {
                name: "TransUnion",
                endpoint: "https://api.transunion.co.za",
                requiredFields: ["ID Number", "Full Name", "Date of Birth"]
            },
            {
                name: "Experian",
                endpoint: "https://api.experian.co.za",
                requiredFields: ["ID Number", "Full Name"]
            },
            {
                name: "Compuscan",
                endpoint: "https://api.compuscan.co.za",
                requiredFields: ["ID Number", "Address"]
            }
        ],
        smsProviders: [
            {
                name: "Clickatell",
                endpoint: "https://api.clickatell.com",
                priority: "High"
            },
            {
                name: "BulkSMS",
                endpoint: "https://api.bulksms.com",
                priority: "Medium"
            }
        ],
        emailProviders: [
            {
                name: "SendGrid",
                endpoint: "https://api.sendgrid.com",
                priority: "High"
            },
            {
                name: "Mailchimp",
                endpoint: "https://api.mailchimp.com",
                priority: "Medium"
            }
        ]
    },

    // ============================================
    // 11. SUPPORT & HELPDESK CONFIGURATION
    // ============================================
    support: {
        channels: {
            phone: "+27 11 000 0000",
            whatsapp: "+27 11 000 0001",
            email: "support-za@mpesewa.com",
            liveChat: true,
            inAppSupport: true
        },
        hours: {
            weekdays: "08:00 - 20:00",
            saturdays: "09:00 - 17:00",
            sundays: "10:00 - 16:00",
            publicHolidays: "Closed"
        },
        languages: ["English", "Zulu", "Xhosa", "Afrikaans"],
        escalation: {
            level1: "Support Agent",
            level2: "Senior Support",
            level3: "Country Manager",
            level4: "Regional Director"
        }
    },

    // ============================================
    // 12. SYSTEM CONFIGURATION & FEATURE FLAGS
    // ============================================
    system: {
        version: "2.1.0",
        releaseDate: "2026-01-24",
        maintenanceWindow: "Sundays 02:00 - 04:00",
        backupSchedule: "Daily at 03:00",
        disasterRecovery: {
            rto: "4 hours",
            rpo: "15 minutes",
            location: "Johannesburg & Cape Town"
        },
        featureFlags: {
            enableNewUI: true,
            enableBiometricLogin: true,
            enableOfflineMode: true,
            enableVoiceCommands: false,
            enableBlockchain: false
        }
    }
};

// ============================================
// EXPORT & VALIDATION
// ============================================

/**
 * Validate configuration structure
 * @throws {Error} If configuration is invalid
 */
function validateConfig() {
    const requiredSections = [
        'country', 'regulation', 'platform', 'financialInstitutions',
        'demographics', 'emergencyCategories', 'compliance', 'security',
        'metrics', 'integrations', 'support', 'system'
    ];

    for (const section of requiredSections) {
        if (!ZA_CONFIG[section]) {
            throw new Error(`Missing required section: ${section}`);
        }
    }

    // Validate country isolation
    if (!ZA_CONFIG.platform.isolation.enabled) {
        throw new Error('Country isolation must be enabled');
    }

    // Validate subscription tiers
    const tiers = ZA_CONFIG.platform.subscriptionTiers;
    const requiredTiers = ['basic', 'premium', 'super', 'lenderOfLenders'];
    for (const tier of requiredTiers) {
        if (!tiers[tier]) {
            throw new Error(`Missing required subscription tier: ${tier}`);
        }
    }

    return true;
}

/**
 * Get configuration for specific module
 * @param {string} module - Module name
 * @returns {Object} Module configuration
 */
function getModuleConfig(module) {
    switch(module) {
        case 'registration':
            return {
                country: ZA_CONFIG.country,
                kycRequirements: ZA_CONFIG.security.kycRequirements,
                subscriptionTiers: ZA_CONFIG.platform.subscriptionTiers
            };
        case 'lending':
            return {
                loanConfig: ZA_CONFIG.platform.loans,
                subscriptionTiers: ZA_CONFIG.platform.subscriptionTiers,
                groups: ZA_CONFIG.platform.groups
            };
        case 'compliance':
            return {
                regulation: ZA_CONFIG.regulation,
                compliance: ZA_CONFIG.compliance,
                security: ZA_CONFIG.security
            };
        case 'support':
            return ZA_CONFIG.support;
        default:
            return ZA_CONFIG;
    }
}

/**
 * Check if feature is enabled for country
 * @param {string} feature - Feature name
 * @returns {boolean} True if enabled
 */
function isFeatureEnabled(feature) {
    return ZA_CONFIG.system.featureFlags[feature] || false;
}

/**
 * Get currency configuration
 * @returns {Object} Currency configuration
 */
function getCurrencyConfig() {
    return {
        ...ZA_CONFIG.country.currency,
        formatted: `${ZA_CONFIG.country.currency.symbol} ${ZA_CONFIG.country.currency.name} (${ZA_CONFIG.country.currency.code})`
    };
}

/**
 * Get subscription tier by name
 * @param {string} tierName - Tier name
 * @returns {Object|null} Tier configuration or null
 */
function getSubscriptionTier(tierName) {
    const tier = ZA_CONFIG.platform.subscriptionTiers[tierName.toLowerCase()];
    if (!tier) {
        console.warn(`Subscription tier "${tierName}" not found in ZA configuration`);
    }
    return tier || null;
}

/**
 * Validate loan amount against country limits
 * @param {number} amount - Loan amount
 * @param {string} tier - Subscription tier
 * @returns {Object} Validation result
 */
function validateLoanAmount(amount, tier = 'basic') {
    const tierConfig = getSubscriptionTier(tier);
    if (!tierConfig) {
        return { valid: false, error: 'Invalid subscription tier' };
    }

    if (amount < ZA_CONFIG.platform.loans.minLoanAmount) {
        return {
            valid: false,
            error: `Amount too low. Minimum is ${ZA_CONFIG.country.currency.symbol}${ZA_CONFIG.platform.loans.minLoanAmount}`
        };
    }

    if (amount > tierConfig.maxWeeklyLimit) {
        return {
            valid: false,
            error: `Amount exceeds tier limit. Maximum for ${tierConfig.name} is ${ZA_CONFIG.country.currency.symbol}${tierConfig.maxWeeklyLimit}`
        };
    }

    if (amount > ZA_CONFIG.regulation.maxLoanAmount) {
        return {
            valid: false,
            error: `Amount exceeds regulatory limit. Maximum is ${ZA_CONFIG.country.currency.symbol}${ZA_CONFIG.regulation.maxLoanAmount}`
        };
    }

    return { valid: true, message: 'Amount validated successfully' };
}

/**
 * Calculate loan repayment details
 * @param {number} principal - Loan amount
 * @param {number} interestRate - Interest rate (default 10%)
 * @param {number} termDays - Loan term in days (default 7)
 * @returns {Object} Repayment details
 */
function calculateRepayment(principal, interestRate = 10, termDays = 7) {
    // Validate against regulatory caps
    const weeklyInterest = Math.min(interestRate, ZA_CONFIG.regulation.interestRateCap.weekly);
    
    const interest = (principal * weeklyInterest) / 100;
    const total = principal + interest;
    const dailyRepayment = total / termDays;
    
    // Calculate penalty after due date
    const penaltyRate = ZA_CONFIG.platform.loans.penaltyRate;
    const dailyPenalty = (principal * penaltyRate) / 100;
    
    return {
        principal: principal,
        interestRate: weeklyInterest,
        interest: parseFloat(interest.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        dailyRepayment: parseFloat(dailyRepayment.toFixed(2)),
        dailyPenalty: parseFloat(dailyPenalty.toFixed(2)),
        dueDate: new Date(Date.now() + termDays * 24 * 60 * 60 * 1000),
        currency: ZA_CONFIG.country.currency.code
    };
}

/**
 * Format amount in local currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
function formatAmount(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: ZA_CONFIG.country.currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Get country-specific emergency categories
 * @returns {Array} Emergency categories
 */
function getEmergencyCategories() {
    return ZA_CONFIG.emergencyCategories.defaultCategories.map(category => ({
        ...category,
        formattedMax: formatAmount(category.maxAmount),
        formattedMin: formatAmount(category.minAmount)
    }));
}

/**
 * Check if user can join another group
 * @param {number} currentGroups - Number of current groups
 * @param {number} rating - User rating (1-5)
 * @returns {Object} Validation result
 */
function canJoinGroup(currentGroups, rating) {
    const maxGroups = ZA_CONFIG.platform.groups.maxGroupsPerUser;
    
    if (currentGroups >= maxGroups) {
        return {
            allowed: false,
            reason: `Maximum ${maxGroups} groups allowed per user`,
            remaining: 0
        };
    }
    
    if (rating < 3 && currentGroups >= 2) {
        return {
            allowed: false,
            reason: 'Low rating users limited to 2 groups maximum',
            remaining: 0
        };
    }
    
    return {
        allowed: true,
        reason: 'Eligible to join group',
        remaining: maxGroups - currentGroups
    };
}

/**
 * Get compliance requirements for lender
 * @param {string} tier - Subscription tier
 * @returns {Object} Compliance requirements
 */
function getLenderCompliance(tier) {
    const tierConfig = getSubscriptionTier(tier);
    const requirements = {
        kyc: ZA_CONFIG.security.kycRequirements.level2,
        documentation: []
    };
    
    if (tierConfig.crbCheck) {
        requirements.crbCheck = true;
        requirements.documentation.push('Credit Report', 'Proof of Income', 'Bank Statements');
    }
    
    if (tier === 'super' || tier === 'lenderOfLenders') {
        requirements.taxClearance = true;
        requirements.documentation.push('Tax Clearance Certificate');
    }
    
    return requirements;
}

// ============================================
// EXPORT MODULE
// ============================================

export default {
    // Main Configuration
    config: ZA_CONFIG,
    
    // Validation Functions
    validateConfig,
    
    // Utility Functions
    getModuleConfig,
    isFeatureEnabled,
    getCurrencyConfig,
    getSubscriptionTier,
    validateLoanAmount,
    calculateRepayment,
    formatAmount,
    getEmergencyCategories,
    canJoinGroup,
    getLenderCompliance,
    
    // Constants
    COUNTRY_CODE: ZA_CONFIG.country.code,
    COUNTRY_NAME: ZA_CONFIG.country.name,
    CURRENCY_CODE: ZA_CONFIG.country.currency.code,
    CURRENCY_SYMBOL: ZA_CONFIG.country.currency.symbol,
    
    // Hierarchy Constants
    HIERARCHY: {
        GLOBAL: 'Global',
        COUNTRY: ZA_CONFIG.country.name,
        GROUPS: {
            MIN: ZA_CONFIG.platform.groups.minMembers,
            MAX: ZA_CONFIG.platform.groups.maxMembers,
            TYPES: ZA_CONFIG.platform.groups.types
        },
        LENDERS: {
            REQUIRE_SUBSCRIPTION: true,
            MAX_GROUPS: ZA_CONFIG.platform.groups.maxGroupsPerUser
        },
        BORROWERS: {
            NO_SUBSCRIPTION: true,
            MAX_GROUPS: ZA_CONFIG.platform.groups.maxGroupsPerUser,
            MAX_ACTIVE_LOANS: ZA_CONFIG.platform.loans.maxActiveLoansPerBorrower
        },
        LEDGERS: {
            AUTO_GENERATE: true,
            UNLIMITED_PER_LENDER: true,
            FIELDS: [
                'Borrower Name',
                'Borrower Contact',
                'Guarantors (2)',
                'Loan Category',
                'Amount',
                'Date Borrowed',
                'Due Date',
                'Interest (10%)',
                'Penalty (5% daily)',
                'Status'
            ]
        }
    },
    
    // Compliance Messages
    COMPLIANCE_NOTICES: [
        `M-Pesewa South Africa operates under FSCA regulations (NCRCP${ZA_CONFIG.regulation.ncrNumber})`,
        `All loans are subject to National Credit Act (NCA) provisions`,
        `Interest rates capped at ${ZA_CONFIG.regulation.interestRateCap.annual}% annually`,
        `Data protection compliant with POPIA requirements`,
        `No cross-country lending or borrowing allowed`
    ],
    
    // Success Metrics
    METRICS_TARGETS: ZA_CONFIG.metrics.targets,
    
    // Support Information
    SUPPORT_CONTACTS: {
        GENERAL: ZA_CONFIG.support.channels,
        LEGAL: 'legal-za@mpesewa.com',
        COMPLIANCE: 'compliance-za@mpesewa.com',
        PARTNERSHIPS: 'partners-za@mpesewa.com'
    }
};

// Initialize and validate configuration
try {
    validateConfig();
    console.log(`✅ M-Pesewa ${ZA_CONFIG.country.name} (${ZA_CONFIG.country.code}) configuration validated successfully`);
} catch (error) {
    console.error(`❌ Configuration validation failed:`, error);
    throw error;
}