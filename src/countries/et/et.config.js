/**
 * M-PESEWA ETHIOPIA COUNTRY CONFIGURATION
 * Strict country isolation with no cross-border transactions
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const EthiopiaConfig = {
    // ============================================
    // 1️⃣ COUNTRY IDENTITY & BASIC INFO
    // ============================================
    country: {
        code: 'ET',
        name: 'Ethiopia',
        officialName: 'Federal Democratic Republic of Ethiopia',
        region: 'East Africa',
        capital: 'Addis Ababa',
        flag: '🇪🇹',
        timezone: 'EAT (UTC+3)',
        callingCode: '+251',
        isoCode: 'ETH',
        continent: 'Africa',
        population: '120+ million',
        languages: ['Amharic', 'Oromo', 'Somali', 'Tigrinya', 'English'],
        currency: {
            code: 'ETB',
            name: 'Ethiopian Birr',
            symbol: 'Br',
            decimalPlaces: 2,
            exchangeRateToUSD: 0.018, // Approximate
            currencyFormat: 'Br {amount}',
            locale: 'am-ET'
        }
    },

    // ============================================
    // 2️⃣ FINTECH REGULATORY COMPLIANCE
    // ============================================
    regulations: {
        regulatoryBody: 'National Bank of Ethiopia (NBE)',
        licenseNumber: 'FIN-ET-2023-MPESEWA-001',
        complianceFramework: 'NBE Digital Financial Services Guidelines 2022',
        maxInterestRate: '15% per annum', // Local regulation
        dataProtectionLaw: 'Data Protection Proclamation No. 123/2020',
        antiMoneyLaundering: true,
        kycRequirements: 'Tier 2 KYC for amounts above ETB 5,000',
        taxRequirements: '15% withholding tax on lender earnings',
        reportingRequirements: [
            'Monthly transaction reports to NBE',
            'Quarterly compliance filings',
            'Annual audit by licensed auditor'
        ],
        consumerProtection: {
            coolingOffPeriod: '24 hours',
            disputeResolution: 'Within 7 working days',
            transparencyRequirements: 'Full disclosure of terms'
        }
    },

    // ============================================
    // 3️⃣ PLATFORM OPERATIONAL CONFIGURATION
    // ============================================
    platform: {
        // STRICT HIERARCHY ENFORCEMENT
        hierarchy: {
            levels: ['Global', 'Country', 'Groups', 'Lenders', 'Borrowers'],
            isolation: {
                country: true, // NO cross-country transactions
                groups: true,  // Lenders can only lend within their group
                maxGroupsPerBorrower: 4,
                minGroupMembers: 5,
                maxGroupMembers: 1000
            }
        },

        // USER REGISTRATION REQUIREMENTS
        registration: {
            minimumAge: 18,
            requiredDocuments: {
                borrowers: ['National ID', 'Phone Number', '2 References'],
                lenders: ['National ID', 'Tax PIN', 'Bank Account', 'Phone Number']
            },
            verification: {
                nationalId: true,
                phoneNumber: true,
                location: true,
                lenderCreditCheck: 'Required for Super Tier'
            },
            referralSystem: {
                required: true,
                minReferrers: 2,
                maxReferralsPerUser: 10
            }
        },

        // LOAN PARAMETERS (STRICTLY ENFORCED)
        loans: {
            maxRepaymentPeriod: 7, // days
            interestRate: 0.10, // 10% per loan
            penaltyRate: 0.05, // 5% daily after day 7
            defaultThreshold: 60, // days (2 months)
            minLoanAmount: 10, // ETB
            maxLoanAmounts: {
                basic: 1500,
                premium: 5000,
                super: 20000,
                lenderOfLenders: 50000
            },
            categories: 20, // Emergency categories
            partialRepayments: true,
            oneActiveLoanPerGroup: true
        },

        // SUBSCRIPTION MODEL (LENDERS ONLY)
        subscriptions: {
            tiers: {
                basic: {
                    name: 'Basic',
                    weeklyLimit: 1500,
                    monthlyFee: 50,
                    biAnnualFee: 250,
                    annualFee: 500,
                    crbCheck: false,
                    features: ['Basic ledger', '5 borrowers max', 'SMS notifications']
                },
                premium: {
                    name: 'Premium',
                    weeklyLimit: 5000,
                    monthlyFee: 250,
                    biAnnualFee: 1500,
                    annualFee: 2500,
                    crbCheck: false,
                    features: ['Advanced ledger', '25 borrowers max', 'Email reports', 'Priority support']
                },
                super: {
                    name: 'Super',
                    weeklyLimit: 20000,
                    monthlyFee: 1000,
                    biAnnualFee: 5000,
                    annualFee: 8500,
                    crbCheck: true,
                    features: ['Unlimited ledgers', 'CRB integration', 'Dedicated support', 'Analytics dashboard']
                }
            },
            expiryDay: 28, // 28th of each month
            gracePeriod: 3, // days
            autoRenew: false,
            paymentMethods: ['M-Pesa', 'Bank Transfer', 'TeleBirr', 'Dashen Bank']
        },

        // REPUTATION SYSTEM
        reputation: {
            ratingSystem: {
                scale: 5,
                calculation: 'Weighted average of last 10 loans',
                factors: ['Timeliness', 'Communication', 'Amount accuracy']
            },
            blacklist: {
                threshold: 2, // months overdue
                consequences: ['Cannot borrow', 'Cannot join new groups', 'Public badge'],
                removal: 'Admin only after full payment'
            },
            goodStanding: {
                minRating: 3.5,
                rewards: ['Access to 4 groups', 'Lower interest rates', 'Priority matching']
            }
        },

        // LEDGER SYSTEM
        ledger: {
            autoGenerate: true,
            fields: [
                'borrowerName',
                'borrowerContact',
                'guarantor1',
                'guarantor2',
                'loanCategory',
                'amountBorrowed',
                'dateBorrowed',
                'dueDate',
                'interestRate',
                'penaltyRate',
                'status',
                'amountOverdue'
            ],
            statuses: ['active', 'cleared', 'defaulted', 'disputed'],
            retentionPeriod: 7, // years
            exportFormats: ['PDF', 'CSV', 'Excel']
        },

        // GROUP MANAGEMENT
        groups: {
            types: ['Family', 'Church', 'Professional', 'Local', 'Social', 'Business'],
            creation: {
                minMembers: 5,
                maxMembers: 1000,
                adminPermissions: ['Invite members', 'Moderate content', 'View group stats'],
                approvalRequired: false
            },
            rules: {
                countryLocked: true,
                invitationOnly: true,
                memberRoles: ['Lender', 'Borrower', 'Admin'],
                conflictResolution: 'Group admin first, then platform admin'
            }
        },

        // DEBT COLLECTION
        debtCollection: {
            platformInvolvement: false,
            vettedCollectors: 25, // In Ethiopia
            collectorRequirements: ['Licensed', 'Verified contacts', 'Location specified'],
            feeStructure: 'Direct negotiation between parties'
        }
    },

    // ============================================
    // 4️⃣ TECHNICAL CONFIGURATION
    // ============================================
    technical: {
        api: {
            baseUrl: 'https://api.mpesewa.et',
            version: 'v1',
            endpoints: {
                auth: '/auth',
                users: '/users',
                groups: '/groups',
                loans: '/loans',
                ledgers: '/ledgers',
                subscriptions: '/subscriptions',
                payments: '/payments'
            },
            rateLimiting: {
                requestsPerMinute: 60,
                burstLimit: 100
            }
        },

        security: {
            encryption: 'AES-256-GCM',
            hashing: 'SHA-256',
            jwtExpiry: '24h',
            refreshTokenExpiry: '7d',
            passwordPolicy: {
                minLength: 8,
                maxLength: 12,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: true
            },
            mfa: {
                enabled: true,
                methods: ['SMS', 'Email', 'Authenticator App']
            }
        },

        database: {
            primary: 'PostgreSQL 14',
            cache: 'Redis',
            backups: {
                frequency: 'Daily',
                retention: '30 days',
                location: 'Local + AWS S3'
            },
            indexes: [
                'users_country_idx',
                'groups_country_idx',
                'loans_status_idx',
                'ledgers_lender_idx'
            ]
        },

        monitoring: {
            uptimeTarget: 99.9,
            responseTime: '< 2s',
            errorRate: '< 0.1%',
            alerts: ['SMS', 'Email', 'Slack']
        }
    },

    // ============================================
    // 5️⃣ LOCALIZED CONTENT & TRANSLATIONS
    // ============================================
    localization: {
        defaultLanguage: 'am',
        supportedLanguages: ['am', 'en', 'om', 'so', 'ti'],
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        numberFormat: {
            decimalSeparator: '.',
            thousandSeparator: ',',
            currencyPosition: 'before'
        },
        translations: {
            welcomeMessage: {
                am: 'እንኳን ወደ M-Pesewa በደህና መጡ',
                en: 'Welcome to M-Pesewa',
                om: 'Baga nagaan dhuftan M-Pesewa'
            },
            loanCategories: {
                fare: { am: 'M-pesewa Fare', en: 'Transport Fare' },
                data: { am: 'M-pesewa Data', en: 'Mobile Data' },
                food: { am: 'M-pesewa Food', en: 'Food' }
            }
        }
    },

    // ============================================
    // 6️⃣ EMERGENCY CATEGORIES SPECIFIC TO ETHIOPIA
    // ============================================
    emergencyCategories: {
        everydayEssentials: [
            { code: 'ET-FARE', name: 'M-pesewa Fare', icon: '🚌', maxAmount: 500 },
            { code: 'ET-DATA', name: 'M-pesewa Data', icon: '📶', maxAmount: 300 },
            { code: 'ET-GAS', name: 'Cooking Gas', icon: '🔥', maxAmount: 800 },
            { code: 'ET-FOOD', name: 'M-pesewa Food', icon: '🍲', maxAmount: 1000 }
        ],
        logisticsRepairs: [
            { code: 'ET-FUEL', name: 'M-pesewa Fuel', icon: '⛽', maxAmount: 1500 },
            { code: 'ET-REPAIR', name: 'M-pesewa Repair', icon: '🔧', maxAmount: 2000 },
            { code: 'ET-CREDO', name: 'M-pesewa Credo', icon: '🛠️', maxAmount: 3000 }
        ],
        businessGrowth: [
            { code: 'ET-SALES', name: 'Daily Sales Advance', icon: '🧾', maxAmount: 5000 },
            { code: 'ET-CAPITAL', name: 'Working Capital', icon: '🏪', maxAmount: 10000 },
            { code: 'ET-SOKO', name: 'Soko Loan', icon: '🛒', maxAmount: 15000 }
        ],
        healthEducation: [
            { code: 'ET-MEDICINE', name: 'M-pesewa Medicine', icon: '💊', maxAmount: 3000 },
            { code: 'ET-SCHOOL', name: 'School Fees', icon: '🎓', maxAmount: 10000 },
            { code: 'ET-ADVANCE', name: 'Quick Cash Advance', icon: '💸', maxAmount: 5000 }
        ]
    },

    // ============================================
    // 7️⃣ SUPPORT & CONTACT INFORMATION
    // ============================================
    support: {
        contact: {
            phone: '+251 11 000 0000',
            email: 'support.et@mpesewa.com',
            whatsapp: '+251 91 000 0000',
            telegram: '@mpesewa_et_support',
            address: 'Bole Road, Addis Ababa, Ethiopia'
        },
        hours: {
            weekdays: '8:00 AM - 6:00 PM',
            saturday: '9:00 AM - 2:00 PM',
            sunday: 'Closed'
        },
        escalation: {
            level1: 'Support Team (24h response)',
            level2: 'Country Manager (12h response)',
            level3: 'Regional Director (6h response)'
        }
    },

    // ============================================
    // 8️⃣ ANALYTICS & REPORTING
    // ============================================
    analytics: {
        metrics: {
            dailyActiveUsers: 0,
            monthlyActiveUsers: 0,
            totalLoansDisbursed: 0,
            totalAmountLent: 0,
            repaymentRate: 0,
            defaultRate: 0,
            averageLoanSize: 0,
            lenderSatisfaction: 0,
            borrowerSatisfaction: 0
        },
        kpis: {
            targetRepaymentRate: 99,
            targetGrowthRate: 20,
            targetSatisfaction: 4.5,
            targetDefaultRate: 1
        },
        reports: {
            daily: ['New users', 'New loans', 'Repayments'],
            weekly: ['User growth', 'Loan volume', 'Risk assessment'],
            monthly: ['Financial summary', 'Compliance report', 'User feedback']
        }
    },

    // ============================================
    // 9️⃣ INTEGRATIONS
    // ============================================
    integrations: {
        paymentProcessors: [
            { name: 'TeleBirr', enabled: true, apiKey: 'ENV_TELEBIRR_API' },
            { name: 'M-Birr', enabled: true, apiKey: 'ENV_MBIRR_API' },
            { name: 'HelloCash', enabled: true, apiKey: 'ENV_HELLOCASH_API' },
            { name: 'CBE Birr', enabled: true, apiKey: 'ENV_CBE_API' }
        ],
        banks: [
            { name: 'Commercial Bank of Ethiopia', code: 'CBE', enabled: true },
            { name: 'Dashen Bank', code: 'DASHEN', enabled: true },
            { name: 'Awash Bank', code: 'AWASH', enabled: true },
            { name: 'Bank of Abyssinia', code: 'BOA', enabled: true }
        ],
        verificationServices: [
            { name: 'National ID Verification', provider: 'NIRA', enabled: true },
            { name: 'Credit Bureau', provider: 'CRB Ethiopia', enabled: true },
            { name: 'Phone Verification', provider: 'Ethio Telecom', enabled: true }
        ],
        notificationChannels: [
            { type: 'SMS', provider: 'Ethio Telecom', enabled: true },
            { type: 'Email', provider: 'AWS SES', enabled: true },
            { type: 'Push', provider: 'Firebase', enabled: true }
        ]
    },

    // ============================================
    // 🔟 MAINTENANCE & UPDATES
    // ============================================
    maintenance: {
        schedule: {
            weekly: 'Sunday 2:00 AM - 4:00 AM',
            monthly: 'Last Sunday of month',
            emergency: 'As needed with 4h notice'
        },
        backupWindow: 'Daily 1:00 AM - 2:00 AM',
        updatePolicy: {
            minorUpdates: 'Auto-deploy during maintenance',
            majorUpdates: 'User notification 7 days in advance',
            breakingChanges: '30-day migration period'
        }
    },

    // ============================================
    // 🔢 FEATURE FLAGS
    // ============================================
    features: {
        enabled: [
            'groupCreation',
            'dualRoles',
            'partialRepayments',
            'debtCollectorsDirectory',
            'blacklistSystem',
            'subscriptionManagement',
            'ledgerExport',
            'mobileApp',
            'offlineMode',
            'biometricLogin'
        ],
        disabled: [
            'crossCountryLending',
            'cryptoPayments',
            'internationalTransfers',
            'automatedCollections',
            'loanInsurance'
        ],
        beta: [
            'aiRiskAssessment',
            'blockchainLedger',
            'voiceCommands',
            'predictiveAnalytics'
        ]
    },

    // ============================================
    // 1️⃣2️⃣ COMPLIANCE CHECKLIST
    // ============================================
    compliance: {
        regulatory: [
            { requirement: 'NBE License', status: 'pending', dueDate: '2024-03-31' },
            { requirement: 'Data Protection Compliance', status: 'in-progress', dueDate: '2024-02-28' },
            { requirement: 'Tax Registration', status: 'completed', dueDate: '2023-12-15' }
        ],
        operational: [
            { requirement: 'KYC Process Documentation', status: 'completed' },
            { requirement: 'Risk Management Framework', status: 'in-progress' },
            { requirement: 'Dispute Resolution Procedure', status: 'completed' }
        ],
        technical: [
            { requirement: 'PCI DSS Compliance', status: 'pending' },
            { requirement: 'ISO 27001 Certification', status: 'planned' },
            { requirement: 'Penetration Testing', status: 'scheduled' }
        ]
    },

    // ============================================
    // 1️⃣3️⃣ AUDIT TRAIL CONFIGURATION
    // ============================================
    audit: {
        enabled: true,
        retentionPeriod: '7 years',
        events: [
            'user_login',
            'user_registration',
            'loan_application',
            'loan_approval',
            'loan_disbursement',
            'repayment',
            'default',
            'blacklist_action',
            'subscription_payment',
            'admin_override'
        ],
        fields: [
            'timestamp',
            'userId',
            'userRole',
            'userCountry',
            'action',
            'ipAddress',
            'userAgent',
            'beforeState',
            'afterState',
            'metadata'
        ]
    },

    // ============================================
    // 1️⃣4️⃣ ERROR HANDLING & RECOVERY
    // ============================================
    errorHandling: {
        retryPolicy: {
            maxAttempts: 3,
            backoffMultiplier: 2,
            initialDelay: 1000 // ms
        },
        circuitBreaker: {
            failureThreshold: 5,
            resetTimeout: 30000, // ms
            halfOpenAttempts: 2
        },
        fallbacks: {
            paymentProcessing: 'queue_for_later',
            userVerification: 'manual_review',
            notifications: 'store_and_forward'
        }
    },

    // ============================================
    // 1️⃣5️⃣ CACHE CONFIGURATION
    // ============================================
    cache: {
        userData: {
            ttl: 300, // 5 minutes
            maxSize: 10000
        },
        groupData: {
            ttl: 600, // 10 minutes
            maxSize: 5000
        },
        loanData: {
            ttl: 900, // 15 minutes
            maxSize: 10000
        },
        rateLimiting: {
            ttl: 60, // 1 minute
            maxRequests: 100
        }
    },

    // ============================================
    // 1️⃣6️⃣ ENVIRONMENT SPECIFIC CONFIG
    // ============================================
    environments: {
        development: {
            apiUrl: 'https://dev.api.mpesewa.et',
            debug: true,
            logLevel: 'debug',
            paymentSandbox: true,
            mockData: true
        },
        staging: {
            apiUrl: 'https://staging.api.mpesewa.et',
            debug: false,
            logLevel: 'info',
            paymentSandbox: true,
            mockData: false
        },
        production: {
            apiUrl: 'https://api.mpesewa.et',
            debug: false,
            logLevel: 'warn',
            paymentSandbox: false,
            mockData: false
        }
    },

    // ============================================
    // 1️⃣7️⃣ VERSIONING
    // ============================================
    version: {
        current: '1.0.0',
        minimumSupported: '1.0.0',
        deprecated: [],
        upgradePolicy: {
            autoMinor: true,
            manualMajor: true,
            endOfLife: '2026-12-31'
        }
    }
};

// ============================================
// EXPORT WITH VALIDATION
// ============================================

// Validation function to ensure config integrity
function validateEthiopiaConfig(config) {
    const errors = [];
    
    // Check required fields
    if (!config.country.code) errors.push('Missing country code');
    if (!config.country.name) errors.push('Missing country name');
    if (!config.country.currency.code) errors.push('Missing currency code');
    
    // Validate hierarchy
    if (!config.platform.hierarchy.isolation.country) {
        errors.push('Country isolation must be true');
    }
    
    // Validate loan parameters
    if (config.platform.loans.maxRepaymentPeriod !== 7) {
        errors.push('Max repayment period must be 7 days');
    }
    
    if (config.platform.loans.interestRate !== 0.10) {
        errors.push('Interest rate must be 10%');
    }
    
    // Validate subscription tiers
    const tiers = config.platform.subscriptions.tiers;
    if (!tiers.basic || !tiers.premium || !tiers.super) {
        errors.push('Missing subscription tiers');
    }
    
    if (errors.length > 0) {
        console.error('Ethiopia Configuration Validation Errors:', errors);
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
    
    return true;
}

// Add helper methods
EthiopiaConfig.getCurrencyFormat = function(amount) {
    return this.country.currency.currencyFormat.replace('{amount}', amount.toLocaleString('en-ET', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }));
};

EthiopiaConfig.getMaxLoanAmount = function(tier) {
    const tiers = this.platform.loans.maxLoanAmounts;
    switch(tier.toLowerCase()) {
        case 'basic': return tiers.basic;
        case 'premium': return tiers.premium;
        case 'super': return tiers.super;
        case 'lenderOfLenders': return tiers.lenderOfLenders;
        default: return tiers.basic;
    }
};

EthiopiaConfig.calculateRepayment = function(principal, daysLate = 0) {
    const interest = principal * this.platform.loans.interestRate;
    const total = principal + interest;
    
    if (daysLate > 0) {
        const penalty = total * this.platform.loans.penaltyRate * daysLate;
        return {
            principal,
            interest,
            penalty,
            total: total + penalty,
            isOverdue: true,
            daysLate
        };
    }
    
    return {
        principal,
        interest,
        penalty: 0,
        total,
        isOverdue: false,
        daysLate: 0
    };
};

// Freeze configuration to prevent mutations
Object.freeze(EthiopiaConfig);

// Validate before export
try {
    validateEthiopiaConfig(EthiopiaConfig);
    console.log('✓ Ethiopia configuration validated successfully');
} catch (error) {
    console.error('✗ Ethiopia configuration validation failed:', error.message);
}

// Export the configuration
export default EthiopiaConfig;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthiopiaConfig;
}