/**
 * M-PESEWA - NIGERIA (NG) COUNTRY CONFIGURATION
 * Country Code: NG
 * Currency: NGN (₦)
 * Legal Jurisdiction: Federal Republic of Nigeria
 * Strict Hierarchy Enforcement: Country → Groups → Lenders → Borrowers (Ledgers)
 * Last Updated: 2026-01-24
 */

const NigeriaConfig = {
    // ====================================================================
    // 1️⃣ COUNTRY IDENTIFICATION & LEGAL
    // ====================================================================
    country: {
        code: "NG",
        name: "Federal Republic of Nigeria",
        isoCode: "NGA",
        region: "West Africa",
        capital: "Abuja",
        timezone: "WAT (UTC+1)",
        population: "218+ million",
        gdpPerCapita: "$2,300",
        financialInclusionRate: "45%",
        mobilePenetration: "84%",
        internetPenetration: "51%"
    },

    // ====================================================================
    // 2️⃣ FINANCIAL & CURRENCY SETTINGS (STRICT ISOLATION)
    // ====================================================================
    currency: {
        code: "NGN",
        symbol: "₦",
        name: "Nigerian Naira",
        decimalPlaces: 2,
        format: "₦{amount}",
        exchangeRateToUSD: "₦1,450.00",
        exchangeRateToKES: "₦1 = KSh 0.095",
        minTransactionAmount: 50, // Minimum 50 NGN
        maxTransactionAmount: 5000000, // 5 million NGN platform limit
        dailyTransferLimit: 500000, // 500,000 NGN per day
        weeklyTransferLimit: 2000000, // 2 million NGN per week
        monthlyTransferLimit: 5000000 // 5 million NGN per month
    },

    // ====================================================================
    // 3️⃣ REGULATORY & COMPLIANCE SETTINGS (NON-NEGOTIABLE)
    // ====================================================================
    regulatory: {
        centralBank: "Central Bank of Nigeria (CBN)",
        financialIntelligenceUnit: "Nigeria Financial Intelligence Unit (NFIU)",
        companyRegistry: "Corporate Affairs Commission (CAC)",
        taxAuthority: "Federal Inland Revenue Service (FIRS)",
        dataProtection: "Nigeria Data Protection Regulation (NDPR)",
        
        // Licensing Requirements
        requiredLicenses: [
            "CBN Microfinance Bank License (for lending operations)",
            "NDPR Compliance Certification",
            "NFIU Registration",
            "CAC Incorporation Certificate"
        ],
        
        // KYC Requirements (Strict)
        kycRequirements: {
            individuals: [
                "Bank Verification Number (BVN)",
                "National Identity Number (NIN)",
                "Valid Government ID (International Passport, Driver's License, Voter's Card)",
                "Proof of Address (Utility bill less than 3 months old)",
                "Passport Photograph",
                "Biometric Verification"
            ],
            businesses: [
                "CAC Registration Certificate",
                "Tax Identification Number (TIN)",
                "Business Bank Account",
                "Proof of Business Address",
                "Directors' BVN and NIN"
            ]
        },
        
        // Anti-Money Laundering
        amlRequirements: {
            transactionMonitoring: true,
            suspiciousActivityReporting: true,
            pepScreening: true,
            sanctionsScreening: true,
            threshold: 5000000, // 5 million NGN
            reportingPeriod: "24 hours"
        },
        
        // Tax Regulations
        tax: {
            vatRate: 7.5,
            withholdingTax: 10,
            corporateTax: 30,
            personalIncomeTaxBrackets: [
                { min: 0, max: 300000, rate: 7 },
                { min: 300001, max: 600000, rate: 11 },
                { min: 600001, max: 1100000, rate: 15 },
                { min: 1100001, max: 1600000, rate: 19 },
                { min: 1600001, max: 3200000, rate: 21 },
                { min: 3200001, rate: 24 }
            ]
        }
    },

    // ====================================================================
    // 4️⃣ M-PESEWA PLATFORM RULES (STRICT HIERARCHY ENFORCEMENT)
    // ====================================================================
    platform: {
        // COUNTRY ISOLATION (NON-NEGOTIABLE)
        isolation: {
            crossCountryLending: "STRICTLY PROHIBITED",
            crossCountryBorrowing: "STRICTLY PROHIBITED",
            crossCountryTransfers: "STRICTLY PROHIBITED",
            crossCountryGroupMembership: "STRICTLY PROHIBITED",
            enforcementMethod: "IP Geolocation + Phone Verification + Bank Account Verification"
        },

        // GROUP LEVEL RULES
        groups: {
            minimumMembers: 5,
            maximumMembers: 1000,
            minimumLenders: 2,
            maximumGroupsPerUser: 4,
            groupTypes: [
                "Family Group",
                "Professional Group",
                "Church/Mosque Group",
                "Community Group",
                "Business Association",
                "Alumni Group",
                "Social Club",
                "Cooperative Society"
            ],
            invitationOnly: true,
            referralRequired: true,
            countryLocked: true,
            adminPrivileges: "Single Founder/Admin per group",
            internalRulesAllowed: true,
            budgetVisibility: "Group members only"
        },

        // LENDER LEVEL RULES
        lenders: {
            subscriptionRequired: true,
            subscriptionExpiry: "28th of each month",
            subscriptionLevels: ["Basic", "Premium", "Super", "Lender of Lenders"],
            lendingLimits: {
                basic: { weekly: 1500, monthly: 6000, annual: 72000 },
                premium: { weekly: 5000, monthly: 20000, annual: 240000 },
                super: { weekly: 20000, monthly: 80000, annual: 960000 },
                lenderOfLenders: { weekly: 50000, monthly: 200000, annual: 2400000 }
            },
            crbRequirements: {
                basic: "Not Required",
                premium: "Not Required",
                super: "Required",
                lenderOfLenders: "Required"
            },
            ledgerManagement: {
                unlimitedLedgers: true,
                manualUpdates: true,
                adminOverride: true,
                borrowerRatings: "5-star system",
                defaultTracking: true
            }
        },

        // BORROWER LEVEL RULES
        borrowers: {
            subscriptionFee: "None",
            maximumGroups: 4,
            ratingRequired: "Good rating for multiple groups",
            dualRoleAllowed: true,
            loanTerms: {
                duration: "7 days",
                interest: "10% weekly",
                penalty: "5% daily after 7 days",
                defaultPeriod: "2 months",
                partialRepayments: true,
                minimumLoan: 50, // 50 NGN
                maximumLoanByTier: {
                    basic: 1500,
                    premium: 5000,
                    super: 20000,
                    lenderOfLenders: 50000
                }
            },
            blacklistRules: {
                trigger: "2 months non-payment",
                consequences: [
                    "Cannot borrow",
                    "Cannot join new groups",
                    "Blacklist badge visible platform-wide"
                ],
                removal: "Only by Platform Admin after full repayment"
            }
        }
    },

    // ====================================================================
    // 5️⃣ OPERATIONAL SETTINGS
    // ====================================================================
    operations: {
        // Banking & Payments
        banking: {
            supportedBanks: [
                "Access Bank",
                "Zenith Bank",
                "GTBank",
                "First Bank",
                "United Bank for Africa (UBA)",
                "Fidelity Bank",
                "Stanbic IBTC",
                "Ecobank Nigeria",
                "Union Bank",
                "Sterling Bank"
            ],
            paymentMethods: [
                "Bank Transfer",
                "USSD Code",
                "Mobile Banking",
                "ATM Transfer",
                "POS Payment"
            ],
            settlementTime: "Instant to 24 hours",
            transactionFees: {
                intraBank: "Free",
                interBank: "₦50 - ₦500",
                ussd: "₦10 - ₦50",
                pos: "₦100 - ₦500"
            }
        },

        // Mobile Money
        mobileMoney: {
            providers: [
                "Paga",
                "OPay",
                "Palmpay",
                "Cellulant",
                "Flutterwave",
                "Paystack"
            ],
            integration: "API Integration Required",
            limits: {
                daily: 500000,
                weekly: 2000000,
                monthly: 5000000
            }
        },

        // Customer Support
        support: {
            phone: "+234 800 000 0000",
            whatsapp: "+234 800 000 0001",
            email: "ng.support@mpesewa.com",
            officeHours: "Monday - Friday, 8:00 AM - 6:00 PM WAT",
            emergencySupport: "24/7 via WhatsApp",
            languages: ["English", "Pidgin English", "Hausa", "Yoruba", "Igbo"],
            responseTime: "Within 2 hours",
            escalationMatrix: [
                "Level 1: Customer Support",
                "Level 2: Senior Support",
                "Level 3: Country Manager",
                "Level 4: Legal Department"
            ]
        },

        // Physical Presence
        physical: {
            headquarters: "Lagos, Nigeria",
            regionalOffices: [
                "Abuja",
                "Port Harcourt",
                "Kano",
                "Ibadan",
                "Enugu"
            ],
            agentNetwork: "5000+ certified agents nationwide",
            partnerBranches: "1000+ partner locations"
        }
    },

    // ====================================================================
    // 6️⃣ DEMOGRAPHIC & MARKET DATA
    // ====================================================================
    demographics: {
        populationBreakdown: {
            urban: "52%",
            rural: "48%",
            youthPopulation: "70% under 30",
            workingAge: "55% (15-64 years)"
        },
        
        financialBehavior: {
            bankedPopulation: "45%",
            mobileMoneyUsers: "40%",
            informalSavings: "65% (Esusu, Ajo)",
            microfinanceUsers: "25%",
            loanDefaultRate: "15% national average"
        },
        
        economicSectors: {
            agriculture: "25% of GDP",
            oilAndGas: "10% of GDP",
            services: "55% of GDP",
            manufacturing: "10% of GDP"
        },
        
        emergencyLoanCategories: {
            topCategories: [
                "Transportation (Okada, Keke, Bus)",
                "Market/Business Capital",
                "School Fees",
                "Medical Emergencies",
                "Household Needs",
                "Farm Inputs",
                "Rent Advance"
            ],
            averageLoanSize: "₦5,000 - ₦20,000",
            repaymentRate: "85% in 7 days"
        }
    },

    // ====================================================================
    // 7️⃣ SECURITY & FRAUD PREVENTION
    // ====================================================================
    security: {
        authentication: {
            twoFactor: true,
            biometric: true,
            deviceBinding: true,
            sessionTimeout: "15 minutes",
            maxFailedAttempts: 5,
            lockoutPeriod: "24 hours"
        },
        
        dataProtection: {
            encryption: "AES-256",
            dataResidency: "Nigeria",
            backupLocation: "Lagos Data Center",
            retentionPeriod: "7 years",
            gdprCompliance: true,
            ndprCompliance: true
        },
        
        fraudPrevention: {
            transactionMonitoring: true,
            behavioralAnalysis: true,
            velocityChecking: true,
            ipWhitelisting: true,
            deviceFingerprinting: true,
            aiFraudDetection: true
        },
        
        incidentResponse: {
            reportingTime: "Within 1 hour",
            regulatoryReporting: "Within 24 hours",
            customerNotification: "Within 48 hours",
            investigationTimeframe: "14 days"
        }
    },

    // ====================================================================
    // 8️⃣ INTEGRATION & API SETTINGS
    // ====================================================================
    integrations: {
        governmentApis: {
            ninVerification: true,
            bvnVerification: true,
            cacVerification: true,
            firsTaxVerification: true
        },
        
        creditBureaus: {
            crccredit: true,
            firstCentral: true,
            xdsCredit: true,
            integrationMethod: "Real-time API"
        },
        
        paymentGateways: {
            paystack: true,
            flutterwave: true,
            remita: true,
            interswitch: true,
            monnify: true
        },
        
        mobileNetworks: {
            mtn: true,
            airtel: true,
            glo: true,
            "9mobile": true,
            ussdIntegration: true
        }
    },

    // ====================================================================
    // 9️⃣ REPORTING & ANALYTICS
    // ====================================================================
    reporting: {
        regulatoryReports: [
            "Monthly Transaction Report to CBN",
            "Quarterly AML/CFT Report to NFIU",
            "Annual Financial Statement to FIRS",
            "Monthly NDPR Compliance Report"
        ],
        
        internalReports: [
            "Daily Transaction Dashboard",
            "Weekly Risk Assessment",
            "Monthly Performance Report",
            "Quarterly Audit Report"
        ],
        
        analytics: {
            realTimeMonitoring: true,
            predictiveAnalytics: true,
            customerSegmentation: true,
            defaultPrediction: true,
            growthMetrics: true
        }
    },

    // ====================================================================
    // 🔟 EMERGENCY PROTOCOLS
    // ====================================================================
    emergencyProtocols: {
        systemOutage: {
            backupSystem: "Active-Active in Lagos and Abuja",
            recoveryTime: "Within 4 hours",
            communication: "SMS, Email, Social Media"
        },
        
        regulatoryAction: {
            contingencyPlan: "Immediate compliance review",
            legalResponse: "Within 24 hours",
            customerCommunication: "Transparent updates"
        },
        
        securityBreach: {
            immediateActions: [
                "Freeze affected accounts",
                "Notify CBN and NFIU",
                "Engage cybersecurity team",
                "Preserve evidence"
            ],
            recoverySteps: [
                "System security audit",
                "Enhanced monitoring",
                "Customer verification",
                "Compensation if required"
            ]
        }
    },

    // ====================================================================
    // 1️⃣1️⃣ FEATURE FLAGS & CONTROLS
    // ====================================================================
    features: {
        enabled: [
            "Group Creation",
            "Lender Subscriptions",
            "Borrower Applications",
            "Ledger Management",
            "Blacklist System",
            "Debt Collector Directory",
            "Mobile App",
            "USSD Banking"
        ],
        
        disabled: [
            "Cross-Country Transactions",
            "Crypto Integration",
            "Forex Trading",
            "Stock Investments"
        ],
        
        betaTesting: [
            "AI Credit Scoring",
            "Blockchain Ledger",
            "Voice Banking",
            "Smart Contracts"
        ]
    },

    // ====================================================================
    // 1️⃣2️⃣ VERSION & DEPLOYMENT
    // ====================================================================
    version: {
        configVersion: "3.2.1",
        lastUpdated: "2026-01-24",
        deployedBy: "M-Pesewa Nigeria DevOps",
        deploymentRegion: "AWS Africa (Lagos)",
        backupRegion: "Google Cloud (Johannesburg)",
        complianceCheck: "Passed - January 2026",
        nextReview: "2026-04-24"
    }
};

// ====================================================================
// EXPORT CONFIGURATION
// ====================================================================
module.exports = NigeriaConfig;

// ====================================================================
// VALIDATION FUNCTIONS
// ====================================================================

/**
 * Validate Nigeria-specific user registration
 * @param {Object} userData - User registration data
 * @returns {Object} Validation result
 */
function validateNigerianUser(userData) {
    const errors = [];
    const warnings = [];
    
    // National ID Validation
    if (!userData.nin) {
        errors.push("National Identity Number (NIN) is required");
    } else if (!/^\d{11}$/.test(userData.nin)) {
        errors.push("NIN must be 11 digits");
    }
    
    // BVN Validation (for lenders)
    if (userData.role === 'lender' && !userData.bvn) {
        errors.push("Bank Verification Number (BVN) is required for lenders");
    } else if (userData.bvn && !/^\d{11}$/.test(userData.bvn)) {
        errors.push("BVN must be 11 digits");
    }
    
    // Phone Number Validation
    if (!userData.phone) {
        errors.push("Phone number is required");
    } else if (!/^(\+234|0)[789][01]\d{8}$/.test(userData.phone)) {
        errors.push("Invalid Nigerian phone number format");
    }
    
    // Age Validation
    if (userData.age < 18) {
        errors.push("Minimum age is 18 years");
    }
    
    // Location Validation
    if (!userData.state || !userData.lga) {
        warnings.push("State and LGA information recommended for better service");
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validate transaction amount for Nigeria
 * @param {number} amount - Transaction amount in NGN
 * @param {string} tier - User subscription tier
 * @returns {Object} Validation result
 */
function validateTransactionAmount(amount, tier) {
    const limits = NigeriaConfig.platform.lenders.lendingLimits[tier];
    const minAmount = NigeriaConfig.platform.borrowers.loanTerms.minimumLoan;
    
    if (amount < minAmount) {
        return {
            valid: false,
            message: `Minimum transaction amount is ₦${minAmount}`,
            limit: minAmount
        };
    }
    
    if (!limits) {
        return {
            valid: false,
            message: "Invalid subscription tier",
            limit: null
        };
    }
    
    if (amount > limits.weekly) {
        return {
            valid: false,
            message: `Exceeds weekly limit of ₦${limits.weekly} for ${tier} tier`,
            limit: limits.weekly
        };
    }
    
    return {
        valid: true,
        message: "Amount within limits",
        limit: limits.weekly
    };
}

/**
 * Calculate loan repayment for Nigeria
 * @param {number} principal - Loan amount in NGN
 * @param {number} days - Loan duration in days
 * @returns {Object} Repayment breakdown
 */
function calculateNigerianLoan(principal, days = 7) {
    const weeklyInterestRate = 0.10; // 10%
    const dailyPenaltyRate = 0.05; // 5% daily after 7 days
    
    let interest = 0;
    let penalty = 0;
    let total = principal;
    
    if (days <= 7) {
        // Normal interest for up to 7 days
        interest = principal * weeklyInterestRate;
        total = principal + interest;
    } else {
        // Interest for first 7 days
        interest = principal * weeklyInterestRate;
        
        // Penalty for additional days
        const extraDays = days - 7;
        penalty = principal * dailyPenaltyRate * extraDays;
        
        total = principal + interest + penalty;
    }
    
    return {
        principal: principal,
        currency: "NGN",
        interestRate: "10% weekly",
        interestAmount: Math.round(interest),
        penaltyRate: days > 7 ? "5% daily after 7 days" : "0%",
        penaltyAmount: Math.round(penalty),
        totalAmount: Math.round(total),
        breakdown: {
            dailyRepayment: Math.round(total / 7),
            weeklyRepayment: Math.round(total),
            dueDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        }
    };
}

/**
 * Get Nigerian states and LGAs
 * @returns {Array} Nigerian states with LGAs
 */
function getNigerianStates() {
    return [
        {
            state: "Lagos",
            capital: "Ikeja",
            lgAs: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"]
        },
        {
            state: "Kano",
            capital: "Kano",
            lgAs: ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"]
        },
        {
            state: "Abuja",
            capital: "Abuja",
            lgAs: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"]
        },
        // Additional states would continue here...
    ];
}

/**
 * Format Nigerian currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatNigerianCurrency(amount) {
    if (isNaN(amount)) return "₦0.00";
    
    // Format with thousand separators
    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    
    return formatted;
}

/**
 * Get Nigerian emergency categories
 * @returns {Array} Nigerian-specific emergency categories
 */
function getNigerianEmergencyCategories() {
    return [
        {
            id: "ng_transport",
            name: "Okada/Keke/Bus Fare",
            icon: "🏍️",
            description: "Transportation money for bike, tricycle, or bus",
            maxAmount: 5000,
            typicalUse: "Daily commuting to work or business",
            commonAreas: ["Lagos", "Kano", "Port Harcourt", "Abuja"]
        },
        {
            id: "ng_market",
            name: "Market/Business Capital",
            icon: "🛒",
            description: "Small capital for market business or trading",
            maxAmount: 20000,
            typicalUse: "Stocking goods for resale",
            commonAreas: ["Onitsha", "Kano", "Lagos", "Aba"]
        },
        {
            id: "ng_school",
            name: "School Fees",
            icon: "🎓",
            description: "Emergency school fees payment",
            maxAmount: 10000,
            typicalUse: "Children's school fees",
            commonAreas: "Nationwide"
        },
        {
            id: "ng_medical",
            name: "Medical Emergency",
            icon: "🏥",
            description: "Hospital bills or medication",
            maxAmount: 15000,
            typicalUse: "Hospital deposits or prescriptions",
            commonAreas: "Nationwide"
        },
        {
            id: "ng_rent",
            name: "Rent Advance",
            icon: "🏠",
            description: "Rent payment or advance",
            maxAmount: 25000,
            typicalUse: "Monthly rent or advance payment",
            commonAreas: ["Lagos", "Abuja", "Port Harcourt"]
        }
    ];
}

// ====================================================================
// EXPORT ALL FUNCTIONS
// ====================================================================
module.exports = {
    config: NigeriaConfig,
    validateNigerianUser,
    validateTransactionAmount,
    calculateNigerianLoan,
    getNigerianStates,
    formatNigerianCurrency,
    getNigerianEmergencyCategories
};

// ====================================================================
// INITIALIZATION LOGIC
// ====================================================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║                    M-PESEWA NIGERIA MODULE                ║
║                    Version ${NigeriaConfig.version.configVersion}                    ║
║                    Initialized: ${new Date().toISOString().split('T')[0]}           ║
╚════════════════════════════════════════════════════════════╝

Country: ${NigeriaConfig.country.name}
Currency: ${NigeriaConfig.currency.symbol} ${NigeriaConfig.currency.code}
Timezone: ${NigeriaConfig.country.timezone}
Population: ${NigeriaConfig.country.population}
GDP per Capita: ${NigeriaConfig.country.gdpPerCapita}

Platform Features:
• Groups: ${NigeriaConfig.platform.groups.minimumMembers}-${NigeriaConfig.platform.groups.maximumMembers} members
• Lenders: ${Object.keys(NigeriaConfig.platform.lenders.subscriptionLevels).length} subscription tiers
• Borrowers: ${NigeriaConfig.platform.borrowers.maximumGroups} groups maximum
• Loan Terms: ${NigeriaConfig.platform.borrowers.loanTerms.duration}, ${NigeriaConfig.platform.borrowers.loanTerms.interest} interest

Regulatory Compliance:
• Central Bank: ${NigeriaConfig.regulatory.centralBank}
• Data Protection: ${NigeriaConfig.regulatory.dataProtection}
• AML Compliance: ${NigeriaConfig.security.fraudPrevention.transactionMonitoring ? 'ACTIVE' : 'INACTIVE'}

Support: ${NigeriaConfig.operations.support.phone}
Email: ${NigeriaConfig.operations.support.email}
`);