/**
 * BURUNDI (BI) - Country Configuration Module
 * Strictly follows M-Pesewa Hierarchy: Global → Country → Groups → Lenders → Borrowers
 * Non-negotiable country isolation rules apply
 */

const BI_COUNTRY_CONFIG = {
    // ============================================
    // 1️⃣ COUNTRY IDENTIFICATION & METADATA
    // ============================================
    id: "BI",
    countryCode: "BI",
    countryName: "Burundi",
    officialName: "Republic of Burundi",
    capitalCity: "Gitega",
    timezone: "Africa/Bujumbura",
    region: "East Africa",
    population: "12.6 million",
    unMember: true,
    fintechRegulator: "Bank of the Republic of Burundi (BRB)",
    
    // ============================================
    // 2️⃣ CURRENCY & FINANCIAL SETTINGS (STRICT)
    // ============================================
    currency: {
        code: "BIF",
        symbol: "FBu",
        name: "Burundian Franc",
        decimalPlaces: 0, // BIF has no subunits
        format: "amount FBu",
        exchangeRateToUSD: 0.00051, // Approximate
        minTransactionAmount: 100, // Minimum 100 BIF
        maxTransactionAmount: 10000000, // 10 million BIF
        dailyLimit: 5000000, // 5 million BIF
        weeklyLimit: 20000000, // 20 million BIF
        currencyPrecision: "whole" // No decimals
    },
    
    // ============================================
    // 3️⃣ CONTACT & SUPPORT INFORMATION
    // ============================================
    contact: {
        nationalPhone: "+257 79 000 000",
        internationalPhone: "+257 79 000 000",
        supportEmail: "burundi.support@mpesewa.com",
        legalEmail: "legal.bi@mpesewa.com",
        emergencyContact: "+257 79 111 111",
        officeAddress: "Bujumbura Business District, Burundi",
        businessHours: "Monday-Friday 8:00 AM - 5:00 PM (CAT)",
        supportLanguages: ["Kirundi", "French", "English", "Swahili"]
    },
    
    // ============================================
    // 4️⃣ REGULATORY & COMPLIANCE SETTINGS
    // ============================================
    regulatory: {
        financialAuthority: "Bank of the Republic of Burundi",
        licenseNumber: "MFI-BI-2024-001",
        registrationDate: "2024-01-15",
        renewalDate: "2025-01-14",
        complianceLevel: "Tier 2",
        kycRequirements: {
            nationalId: true,
            passport: true,
            driverLicense: false,
            voterId: true,
            proofOfAddress: true,
            taxId: false,
            biometricVerification: false,
            minimumAge: 18,
            residencyProof: true
        },
        antiMoneyLaundering: {
            enabled: true,
            threshold: 2000000, // 2 million BIF
            reportingRequired: true,
            authority: "Financial Intelligence Unit of Burundi"
        },
        dataProtectionLaw: "Law No. 1/07 of 2018",
        consumerProtection: "Bank of the Republic of Burundi Regulations"
    },
    
    // ============================================
    // 5️⃣ PLATFORM HIERARCHY ENFORCEMENT (STRICT)
    // ============================================
    hierarchy: {
        // GLOBAL → COUNTRY isolation
        countryIsolation: {
            enabled: true,
            crossCountryLending: false,
            crossCountryBorrowing: false,
            crossCountryGroups: false,
            crossCountryTransfers: false,
            isolationLevel: "complete"
        },
        
        // COUNTRY → GROUPS rules
        groups: {
            minMembersPerGroup: 5,
            maxMembersPerGroup: 1000,
            maxGroupsPerUser: 4,
            groupTypes: [
                "Family",
                "Church",
                "Professional",
                "Local Community",
                "Social",
                "Business Association",
                "Neighborhood",
                "Village"
            ],
            invitationOnly: true,
            referralRequired: true,
            countryLocked: true,
            maxGroupsPerCountry: "unlimited",
            minLendersPerGroup: 2,
            minBorrowersPerGroup: 3
        },
        
        // GROUPS → LENDERS rules
        lenders: {
            subscriptionRequired: true,
            minSubscriptionTier: "Basic",
            maxLedgersPerLender: "unlimited",
            lendingLimitTiers: {
                basic: 1500,
                premium: 5000,
                super: 20000,
                lenderOfLenders: 50000
            },
            categoriesPerLender: "selective", // Can choose specific categories
            crossGroupLending: false,
            reputationSystem: true
        },
        
        // LENDERS → LEDGERS rules
        ledgers: {
            autoGenerate: true,
            maxActiveLedgers: "unlimited",
            ledgerFields: [
                "borrowerName",
                "borrowerContact",
                "borrowerLocation",
                "guarantor1",
                "guarantor2",
                "loanCategory",
                "amount",
                "dateBorrowed",
                "dueDate",
                "interest",
                "penalty",
                "status"
            ],
            manualUpdate: true,
            adminOverride: true
        },
        
        // GROUPS → BORROWERS rules
        borrowers: {
            subscriptionFee: false,
            maxGroupsPerBorrower: 4,
            minRatingForMultiGroup: 4, // 4-star minimum for multiple groups
            dualRoleAllowed: true, // Can also be lenders
            maxActiveLoans: 1,
            repaymentGracePeriod: 0, // No grace period
            defaultThreshold: 60 // Days until default
        }
    },
    
    // ============================================
    // 6️⃣ SUBSCRIPTION TIERS (BIF CURRENCY)
    // ============================================
    subscriptionTiers: {
        basic: {
            name: "Basic",
            code: "BI-BASIC",
            weeklyLimit: 1500, // BIF
            monthlyFee: 50, // BIF
            biAnnualFee: 250, // BIF
            annualFee: 500, // BIF
            crbCheck: false,
            maxLedgerAmount: 1500,
            features: [
                "Basic lending access",
                "Up to 1500 BIF per week",
                "5 borrower ledgers",
                "Community rating system"
            ],
            color: "#4CAF50" // Green
        },
        premium: {
            name: "Premium",
            code: "BI-PREMIUM",
            weeklyLimit: 5000, // BIF
            monthlyFee: 250, // BIF
            biAnnualFee: 1500, // BIF
            annualFee: 2500, // BIF
            crbCheck: false,
            maxLedgerAmount: 10000,
            features: [
                "Enhanced lending access",
                "Up to 5000 BIF per week",
                "Unlimited ledgers",
                "Advanced analytics",
                "Priority support"
            ],
            color: "#2196F3" // Blue
        },
        super: {
            name: "Super",
            code: "BI-SUPER",
            weeklyLimit: 20000, // BIF
            monthlyFee: 1000, // BIF
            biAnnualFee: 5000, // BIF
            annualFee: 8500, // BIF
            crbCheck: true,
            maxLedgerAmount: 20000,
            features: [
                "Premium lending access",
                "Up to 20000 BIF per week",
                "CRB credit checks",
                "Dedicated account manager",
                "Advanced risk tools"
            ],
            color: "#9C27B0" // Purple
        },
        lenderOfLenders: {
            name: "Lender of Lenders",
            code: "BI-LOL",
            weeklyLimit: 50000, // BIF
            monthlyFee: 500, // BIF
            biAnnualFee: 3500, // BIF
            annualFee: 6500, // BIF
            crbCheck: true,
            maxLedgerAmount: 50000,
            features: [
                "Institutional lending",
                "Up to 50000 BIF per week",
                "Custom repayment terms",
                "Bulk lending tools",
                "Enterprise support"
            ],
            color: "#FF9800" // Orange
        }
    },
    
    // ============================================
    // 7️⃣ LOAN SETTINGS & INTEREST RATES
    // ============================================
    loanSettings: {
        standardLoanPeriod: 7, // Days
        interestRate: 10, // Percentage per loan period
        dailyPartialRepayment: true,
        penaltyRate: 5, // Percentage daily after 7 days
        defaultPeriod: 60, // Days until default
        minLoanAmount: 100, // BIF
        maxLoanAmountMultiplier: 1.0, // Based on subscription tier
        repaymentMethods: ["Mobile Money", "Bank Transfer", "Cash"],
        disbursementMethods: ["Mobile Money", "Bank Transfer", "Cash"],
        gracePeriod: 0, // No grace period in Burundi
        earlyRepaymentDiscount: 0,
        lateRepaymentPenalty: "daily_5_percent"
    },
    
    // ============================================
    // 8️⃣ EMERGENCY CATEGORIES (BURUNDI SPECIFIC)
    // ============================================
    emergencyCategories: [
        {
            id: "bi-fare",
            code: "BI-FARE",
            name: "M-pesewa Fare",
            description: "Transport money for urgent travel needs in Burundi",
            icon: "🚌",
            maxAmount: 5000,
            minAmount: 100,
            typicalUse: ["Bus fare", "Taxi", "Motorcycle taxi", "Emergency travel"],
            popularity: "high"
        },
        {
            id: "bi-data",
            code: "BI-DATA",
            name: "M-pesewa Data",
            description: "Mobile internet bundles for connectivity",
            icon: "📶",
            maxAmount: 3000,
            minAmount: 500,
            typicalUse: ["Internet bundles", "Social media", "Work online", "Communication"],
            popularity: "high"
        },
        {
            id: "bi-gas",
            code: "BI-GAS",
            name: "M-pesewa Cooking Gas",
            description: "Cooking gas refills for households",
            icon: "🔥",
            maxAmount: 10000,
            minAmount: 2000,
            typicalUse: ["Gas refill", "Cooking fuel", "Household needs"],
            popularity: "medium"
        },
        {
            id: "bi-food",
            code: "BI-FOOD",
            name: "M-pesewa Food",
            description: "Emergency food and groceries",
            icon: "🍲",
            maxAmount: 8000,
            minAmount: 1000,
            typicalUse: ["Groceries", "Emergency food", "Daily meals"],
            popularity: "high"
        },
        {
            id: "bi-water",
            code: "BI-WATER",
            name: "M-pesewa Water Bill",
            description: "Water utility payments",
            icon: "🚰",
            maxAmount: 5000,
            minAmount: 1000,
            typicalUse: ["Water bills", "Utility payments"],
            popularity: "medium"
        },
        {
            id: "bi-medicine",
            code: "BI-MED",
            name: "M-pesewa Medicine",
            description: "Medical and pharmaceutical needs",
            icon: "💊",
            maxAmount: 15000,
            minAmount: 1000,
            typicalUse: ["Medicine", "Medical bills", "Healthcare"],
            popularity: "high"
        },
        {
            id: "bi-school",
            code: "BI-SCHOOL",
            name: "M-pesewa School Fees",
            description: "Education-related expenses",
            icon: "🎓",
            maxAmount: 20000,
            minAmount: 2000,
            typicalUse: ["School fees", "Books", "Uniforms", "Supplies"],
            popularity: "medium"
        }
    ],
    
    // ============================================
    // 9️⃣ USER REGISTRATION REQUIREMENTS
    // ============================================
    registrationRequirements: {
        lenders: {
            mandatory: [
                "Full Name",
                "National ID Number",
                "Phone Number",
                "Location/Address",
                "Email Address",
                "Subscription Tier Selection",
                "Username",
                "Password",
                "Two Referrers/Guarantors",
                "Group Selection"
            ],
            optional: [
                "Brand Name/Nickname",
                "Profile Picture",
                "Alternative Phone",
                "Employment Details"
            ],
            verification: [
                "Phone Verification",
                "ID Verification",
                "Referrer Verification",
                "Location Verification"
            ]
        },
        borrowers: {
            mandatory: [
                "Full Name",
                "National ID Number",
                "Phone Number",
                "Location/Address",
                "Email Address",
                "Two Referrers/Guarantors",
                "Group Selection"
            ],
            optional: [
                "Profile Picture",
                "Alternative Phone",
                "Employment Details",
                "Monthly Income"
            ],
            verification: [
                "Phone Verification",
                "ID Verification",
                "Referrer Verification"
            ]
        }
    },
    
    // ============================================
    // 🔟 SECURITY & FRAUD PREVENTION
    // ============================================
    security: {
        passwordPolicy: {
            minLength: 8,
            maxLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            passwordHistory: 5,
            maxAttempts: 5,
            lockoutDuration: 30 // Minutes
        },
        twoFactorAuth: {
            enabled: true,
            methods: ["SMS", "Email"],
            mandatoryForLenders: true,
            mandatoryForLargeTransactions: true
        },
        transactionSecurity: {
            maxTransactionsPerDay: 10,
            maxAmountPerTransaction: 50000,
            suspiciousActivityMonitoring: true,
            automaticFraudDetection: true
        },
        dataEncryption: {
            level: "AES-256",
            inTransit: "TLS 1.3",
            atRest: "Enterprise-grade"
        }
    },
    
    // ============================================
    // 1️⃣1️⃣ REPORTING & ANALYTICS
    // ============================================
    reporting: {
        taxReporting: {
            required: true,
            authority: "Burundi Revenue Authority",
            threshold: 1000000, // 1 million BIF annually
            forms: ["Tax Form BI-001"],
            frequency: "annual"
        },
        platformReports: {
            dailyActivity: true,
            weeklySummary: true,
            monthlyStatement: true,
            annualReport: true
        },
        disputeResolution: {
            timeframe: "7 days",
            escalationLevels: 3,
            arbitrationAvailable: true,
            legalRecourse: true
        }
    },
    
    // ============================================
    // 1️⃣2️⃣ INTEGRATION & API SETTINGS
    // ============================================
    integrations: {
        mobileMoney: {
            providers: ["Lumitel", "Econet Leo", "SmartPesa"],
            enabled: true,
            transactionFees: "provider-specific",
            limits: {
                daily: 1000000,
                weekly: 5000000,
                monthly: 20000000
            }
        },
        banks: {
            supported: ["Bank of the Republic of Burundi", "Banque de Crédit de Bujumbura", "Interbank Burundi"],
            enabled: true,
            integrationLevel: "basic"
        },
        creditBureaus: {
            provider: "Burundi Credit Bureau",
            enabledForTiers: ["Super", "Lender of Lenders"],
            checkCost: 500, // BIF
            responseTime: "24 hours"
        }
    },
    
    // ============================================
    // 1️⃣3️⃣ UI/UX SPECIFIC SETTINGS
    // ============================================
    uiSettings: {
        language: "Kirundi", // Primary language
        secondaryLanguages: ["French", "English", "Swahili"],
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24-hour",
        numberFormat: "1,234.56",
        currencyPosition: "after",
        themeColor: "#CE1126", // Burundi flag red
        secondaryColor: "#00A1DE", // Burundi flag blue
        tertiaryColor: "#FFFFFF", // White
        flagEmoji: "🇧🇮",
        nationalSymbols: ["Karyenda drum", "Burundi coat of arms"]
    },
    
    // ============================================
    // 1️⃣4️⃣ ADMINISTRATIVE OVERRIDES
    // ============================================
    adminOverrides: {
        platformAdmin: {
            canOverrideBlacklist: true,
            canEditLedgers: true,
            canModerateRatings: true,
            canValidateCollectors: true,
            canFreezeAccounts: true,
            canImpersonateUsers: true,
            canOverrideLimits: true
        },
        groupAdmin: {
            canInviteMembers: true,
            canRemoveMembers: true,
            canModerateGroup: true,
            canViewAllLedgers: true,
            canResolveDisputes: true,
            cannotOverridePlatform: true
        }
    },
    
    // ============================================
    // 1️⃣5️⃣ AUDIT & COMPLIANCE LOGGING
    // ============================================
    audit: {
        logAllTransactions: true,
        storeLogsFor: "7 years",
        complianceReports: "monthly",
        regulatoryAudits: "annual",
        dataRetentionPolicy: "strict"
    },
    
    // ============================================
    // 1️⃣6️⃣ COUNTRY-SPECIFIC BUSINESS RULES
    // ============================================
    businessRules: {
        // Group formation rules
        groupFormation: {
            minFounders: 1,
            maxFounders: 3,
            founderResponsibilities: ["Member invitation", "Group moderation", "Rule enforcement"],
            founderQualifications: ["Must be resident", "Good credit history", "Verified identity"]
        },
        
        // Referral system
        referrals: {
            required: true,
            minReferrers: 2,
            maxReferrers: 2,
            referrerVerification: "mandatory",
            referrerLiability: "limited",
            referralRewards: "none"
        },
        
        // Reputation system
        reputation: {
            ratingScale: 5,
            ratingFactors: ["Timely repayment", "Communication", "Honesty", "Cooperation"],
            ratingDecay: "6 months",
            ratingRecovery: "good behavior",
            blacklistThreshold: 1.0, // Below 1 star
            blacklistDuration: "indefinite until cleared"
        },
        
        // Dispute resolution
        disputes: {
            maxDisputesPerUser: 3,
            disputeResolutionTime: "7 days",
            escalationPath: ["Group Admin", "Platform Mediator", "Legal"],
            mediationCost: 0,
            arbitrationAvailable: true
        }
    },
    
    // ============================================
    // 1️⃣7️⃣ PERFORMANCE METRICS & TARGETS
    // ============================================
    performanceMetrics: {
        targetRepaymentRate: 99, // Percentage
        targetDefaultRate: 1, // Percentage
        targetGrowthRate: 20, // Percentage monthly
        targetUserSatisfaction: 4.5, // Out of 5
        targetTransactionVolume: 100000000, // 100 million BIF monthly
        targetActiveUsers: 10000,
        targetGroupFormation: 500
    },
    
    // ============================================
    // 1️⃣8️⃣ SYSTEM HEALTH & MONITORING
    // ============================================
    systemHealth: {
        uptimeTarget: 99.9, // Percentage
        responseTimeTarget: 2, // Seconds
        backupFrequency: "daily",
        disasterRecovery: "24 hours",
        maintenanceWindow: "Sunday 2:00 AM - 4:00 AM",
        monitoringTools: ["New Relic", "Sentry", "Custom dashboards"]
    },
    
    // ============================================
    // 1️⃣9️⃣ VERSION CONTROL & DEPLOYMENT
    // ============================================
    version: {
        current: "2.4.0",
        releaseDate: "2024-03-15",
        nextUpdate: "2024-04-15",
        changeLog: "https://mpesewa.com/bi/changelog",
        compatibility: {
            minAppVersion: "2.0.0",
            minBrowserVersion: "Chrome 80+, Firefox 75+, Safari 14+",
            mobileOS: "Android 8+, iOS 13+"
        }
    },
    
    // ============================================
    // 2️⃣0️⃣ EMERGENCY & CONTINGENCY PLANS
    // ============================================
    emergencyPlans: {
        systemFailure: {
            fallbackMode: "read-only",
            recoveryTime: "4 hours",
            manualProcesses: ["Ledger updates", "Dispute resolution", "Support tickets"]
        },
        regulatoryChanges: {
            notificationPeriod: "30 days",
            complianceWindow: "90 days",
            gracePeriod: "30 days"
        },
        economicCrisis: {
            riskMitigation: ["Lower limits", "Enhanced verification", "Increased monitoring"],
            contingencyFund: "enabled"
        }
    }
};

// ============================================
// EXPORT MODULE WITH VALIDATION
// ============================================

// Validate critical configuration
const validateConfig = (config) => {
    const errors = [];
    
    // Check required fields
    if (!config.id) errors.push("Missing country ID");
    if (!config.currency.code) errors.push("Missing currency code");
    if (!config.hierarchy.countryIsolation.enabled) errors.push("Country isolation must be enabled");
    if (config.hierarchy.countryIsolation.crossCountryLending) errors.push("Cross-country lending must be false");
    if (config.hierarchy.countryIsolation.crossCountryBorrowing) errors.push("Cross-country borrowing must be false");
    
    // Check subscription tiers
    const tiers = Object.keys(config.subscriptionTiers);
    if (!tiers.includes('basic') || !tiers.includes('premium') || !tiers.includes('super')) {
        errors.push("Missing required subscription tiers");
    }
    
    // Check loan settings
    if (config.loanSettings.standardLoanPeriod !== 7) errors.push("Loan period must be 7 days");
    if (config.loanSettings.interestRate !== 10) errors.push("Interest rate must be 10%");
    if (config.loanSettings.penaltyRate !== 5) errors.push("Penalty rate must be 5% daily");
    
    // Check hierarchy limits
    if (config.hierarchy.groups.minMembersPerGroup < 5) errors.push("Minimum group members must be at least 5");
    if (config.hierarchy.groups.maxMembersPerGroup > 1000) errors.push("Maximum group members cannot exceed 1000");
    if (config.hierarchy.borrowers.maxGroupsPerBorrower > 4) errors.push("Maximum groups per borrower cannot exceed 4");
    
    return errors;
};

// Export with validation
const validationErrors = validateConfig(BI_COUNTRY_CONFIG);
if (validationErrors.length > 0) {
    console.error(`BI Configuration Validation Errors: ${validationErrors.join(', ')}`);
    throw new Error(`Invalid BI Configuration: ${validationErrors.join(', ')}`);
}

// Export the configuration
module.exports = BI_COUNTRY_CONFIG;

// Also export validation function for testing
module.exports.validateConfig = validateConfig;

// Export constants for use in other modules
module.exports.CONSTANTS = {
    COUNTRY_CODE: "BI",
    CURRENCY: "BIF",
    TIMEZONE: "Africa/Bujumbura",
    HIERARCHY_ENFORCED: true,
    VERSION: "2.4.0",
    IS_ACTIVE: true,
    SUPPORTED_LANGUAGES: ["Kirundi", "French", "English", "Swahili"],
    REGULATORY_COMPLIANT: true,
    LAST_UPDATED: "2024-03-15T12:00:00Z"
};

// Export helper functions
module.exports.helpers = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('fr-BI', {
            style: 'currency',
            currency: 'BIF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },
    
    calculateInterest: (principal, days = 7) => {
        const interestRate = BI_COUNTRY_CONFIG.loanSettings.interestRate;
        const interest = (principal * interestRate) / 100;
        return Math.ceil(interest);
    },
    
    calculatePenalty: (principal, overdueDays) => {
        const penaltyRate = BI_COUNTRY_CONFIG.loanSettings.penaltyRate;
        const dailyPenalty = (principal * penaltyRate) / 100;
        return Math.ceil(dailyPenalty * overdueDays);
    },
    
    getSubscriptionLimit: (tier) => {
        const tierConfig = BI_COUNTRY_CONFIG.subscriptionTiers[tier.toLowerCase()];
        return tierConfig ? tierConfig.weeklyLimit : 0;
    },
    
    validatePhoneNumber: (phone) => {
        // Burundi phone number validation: +257 followed by 8 digits
        const regex = /^\+257[0-9]{8}$/;
        return regex.test(phone);
    },
    
    isEligibleForGroup: (userRating, currentGroups) => {
        const maxGroups = BI_COUNTRY_CONFIG.hierarchy.borrowers.maxGroupsPerBorrower;
        const minRating = BI_COUNTRY_CONFIG.hierarchy.borrowers.minRatingForMultiGroup;
        
        if (currentGroups.length >= maxGroups) return false;
        if (currentGroups.length > 0 && userRating < minRating) return false;
        
        return true;
    },
    
    checkCrossCountryViolation: (userCountry, targetCountry) => {
        return userCountry !== targetCountry;
    }
};

// Export initialization function
module.exports.initialize = () => {
    console.log(`🇧🇮 Initializing Burundi (BI) Configuration v${BI_COUNTRY_CONFIG.version.current}`);
    console.log(`   Currency: ${BI_COUNTRY_CONFIG.currency.code} (${BI_COUNTRY_CONFIG.currency.name})`);
    console.log(`   Hierarchy: ${BI_COUNTRY_CONFIG.hierarchy.countryIsolation.isolationLevel} isolation`);
    console.log(`   Groups: ${BI_COUNTRY_CONFIG.hierarchy.groups.minMembersPerGroup}-${BI_COUNTRY_CONFIG.hierarchy.groups.maxMembersPerGroup} members`);
    console.log(`   Subscription Tiers: ${Object.keys(BI_COUNTRY_CONFIG.subscriptionTiers).length} available`);
    
    return {
        status: "initialized",
        country: BI_COUNTRY_CONFIG.countryName,
        timestamp: new Date().toISOString(),
        checksum: Buffer.from(JSON.stringify(BI_COUNTRY_CONFIG)).toString('base64').slice(0, 32)
    };
};

// Auto-initialize when imported
if (require.main === module) {
    module.exports.initialize();
}