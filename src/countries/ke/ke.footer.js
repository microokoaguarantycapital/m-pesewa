/**
 * M-PESEWA - KENYA COUNTRY FOOTER MODULE
 * Version: 1.0.0
 * Last Updated: 2026-01-24
 * 
 * STRICT COUNTRY ISOLATION ENFORCEMENT
 * This file contains Kenya-specific footer configuration and rules.
 * DO NOT MODIFY CROSS-COUNTRY FOOTER BEHAVIOR.
 * 
 * Hierarchy: Global → Countries → Groups → Lenders → Borrowers
 * Country: Kenya (KE)
 */

// ============================================
// PRIMARY CONFIGURATION OBJECT
// ============================================
const KenyaFooterConfig = {
    // ============================================
    // 1. COUNTRY IDENTIFICATION (NON-NEGOTIABLE)
    // ============================================
    countryCode: 'KE',
    countryName: 'Kenya',
    countryFlag: '🇰🇪',
    localCurrency: 'KES',
    currencySymbol: 'KSh',
    
    // ============================================
    // 2. STRICT FOOTER STRUCTURE (FINTECH COMPLIANT)
    // ============================================
    footerColumns: {
        column1: {
            title: 'Borrowing in Kenya',
            links: [
                { text: 'Emergency Loans Kenya', url: '/ke/emergency-loans', role: 'borrower' },
                { text: 'Personal Loans Kenya', url: '/ke/personal-loans', role: 'borrower' },
                { text: 'Business Loans Kenya', url: '/ke/business-loans', role: 'borrower' },
                { text: 'How to Apply Kenya', url: '/ke/how-to-apply', role: 'borrower' },
                { text: 'Active Kenyan Borrowers', url: '/ke/active-borrowers', role: 'borrower' }
            ]
        },
        column2: {
            title: 'Lending in Kenya',
            links: [
                { text: 'Lend in Kenya', url: '/ke/lending', role: 'lender' },
                { text: 'Kenya Lending Rules', url: '/ke/lending-rules', role: 'lender' },
                { text: 'Kenya Lender Dashboard', url: '/lender/dashboard?country=KE', role: 'lender' },
                { text: 'Active Kenyan Lenders', url: '/ke/active-lenders', role: 'lender' }
            ]
        },
        column3: {
            title: 'Kenya Platform',
            links: [
                { text: 'M-Pesewa Kenya FAQ', url: '/ke/faq' },
                { text: 'Kenya Community Rules', url: '/ke/community-rules' },
                { text: 'Kenya Subscription Plans', url: '/subscription/plans?country=KE' },
                { text: 'Kenya Blacklist Registry', url: '/blacklist?country=KE' },
                { text: 'Kenya Debt Collectors', url: '/collectors?country=KE' }
            ]
        },
        column4: {
            title: 'Kenya Legal',
            links: [
                { text: 'Kenya Terms & Conditions', url: '/ke/terms' },
                { text: 'Kenya Privacy Policy', url: '/ke/privacy' },
                { text: 'Central Bank of Kenya Compliance', url: '/ke/cbk-compliance' },
                { text: 'Kenya Fair Practices Code', url: '/ke/fair-practices' }
            ]
        },
        column5: {
            title: 'Kenya Support',
            links: [
                { text: 'Kenya Customer Support', url: '/ke/support' },
                { text: 'Kenya Grievance Redressal', url: '/ke/grievance' },
                { text: 'Kenya Contact Information', url: '/ke/contact' },
                { text: 'Kenya Security Guidelines', url: '/ke/security' }
            ]
        }
    },
    
    // ============================================
    // 3. KENYA-SPECIFIC CONTACT INFORMATION (MANDATORY)
    // ============================================
    contactInfo: {
        phone: '+254 709 219 000',
        alternativePhone: '+254 700 000 000',
        email: 'kenya@mpesewa.com',
        supportEmail: 'support.ke@mpesewa.com',
        legalEmail: 'legal.ke@mpesewa.com',
        physicalAddress: {
            line1: 'M-Pesewa Kenya Headquarters',
            line2: 'Westlands, Nairobi',
            line3: 'Kenya'
        },
        operatingHours: {
            weekdays: '8:00 AM - 6:00 PM EAT',
            saturday: '9:00 AM - 1:00 PM EAT',
            sunday: 'Closed'
        },
        emergencyContact: '+254 711 000 000'
    },
    
    // ============================================
    // 4. KENYA REGULATORY COMPLIANCE
    // ============================================
    regulatoryBodies: [
        {
            name: 'Central Bank of Kenya',
            acronym: 'CBK',
            website: 'https://www.centralbank.go.ke',
            complianceRef: 'CBK/P2P/2024/001'
        },
        {
            name: 'Capital Markets Authority',
            acronym: 'CMA',
            website: 'https://www.cma.or.ke',
            complianceRef: 'CMA/DIGITAL/2024'
        },
        {
            name: 'Office of the Data Protection Commissioner',
            acronym: 'ODPC',
            website: 'https://www.odpc.go.ke',
            complianceRef: 'ODPC/DPA/2023'
        }
    ],
    
    // ============================================
    // 5. KENYA-SPECIFIC DISCLAIMERS (LEGALLY REQUIRED)
    // ============================================
    legalDisclaimers: [
        "M-Pesewa Kenya operates as a peer-to-peer lending platform under Kenyan law.",
        "All lending and borrowing activities are conducted directly between users.",
        "M-Pesewa does not handle funds and is not a deposit-taking institution.",
        "Platform operates under CBK Guidelines on Digital Credit Providers (2022).",
        "Users must be 18+ years and residents of Kenya to participate.",
        "All transactions are in Kenyan Shillings (KES) only.",
        "Cross-border transactions are strictly prohibited.",
        "Defaulters may be reported to Kenyan Credit Reference Bureaus."
    ],
    
    // ============================================
    // 6. KENYA FINANCIAL RULES ENFORCEMENT
    // ============================================
    financialRules: {
        maxLoanAmount: {
            basic: 1500, // KSh
            premium: 5000, // KSh
            super: 20000, // KSh
            lenderOfLenders: 50000 // KSh
        },
        interestRate: 10, // Percentage per week
        repaymentPeriod: 7, // Days
        latePenalty: 5, // Percentage daily after day 7
        defaultThreshold: 60, // Days after which loan is in default
        subscriptionExpiry: 28, // Day of month when subscriptions expire
        crbThreshold: 20000 // Amount above which CRB check is required
    },
    
    // ============================================
    // 7. KENYA TAX COMPLIANCE
    // ============================================
    taxCompliance: {
        vatNumber: 'P051XXXXXX',
        pinNumber: 'A000XXXXXX',
        taxRate: 16, // VAT percentage
        withholdingTax: 5, // Percentage for lenders
        taxAuthority: 'Kenya Revenue Authority',
        filingRequirements: 'Monthly VAT returns, Annual income tax'
    },
    
    // ============================================
    // 8. KENYA PAYMENT SYSTEMS
    // ============================================
    paymentSystems: {
        mobileMoney: {
            mpesa: {
                paybill: '123456',
                till: '123456',
                businessNumber: '123456',
                name: 'M-PESEWA KENYA'
            },
            airtelMoney: {
                merchantCode: 'MPESEWA',
                paymentCode: '123456'
            }
        },
        bankTransfers: [
            {
                bank: 'Equity Bank Kenya',
                accountName: 'M-Pesewa Technology Kenya Ltd',
                accountNumber: '0123456789',
                branch: 'Westlands',
                swiftCode: 'EQBLKENA'
            },
            {
                bank: 'KCB Bank Kenya',
                accountName: 'M-Pesewa Technology Kenya Ltd',
                accountNumber: '9876543210',
                branch: 'Upper Hill',
                swiftCode: 'KCBLKENX'
            }
        ]
    },
    
    // ============================================
    // 9. KENYA USER DEMOGRAPHICS & LOCALIZATION
    // ============================================
    localization: {
        language: 'en-KE', // English (Kenya)
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12-hour',
        timezone: 'Africa/Nairobi',
        numberFormat: {
            decimalSeparator: '.',
            thousandSeparator: ',',
            currencyPosition: 'before',
            decimalPlaces: 2
        },
        localTerminology: {
            loan: 'mkopo',
            lender: 'mkopeshaji',
            borrower: 'mkopaji',
            group: 'kikundi',
            interest: 'riba',
            repayment: 'kulipa'
        }
    },
    
    // ============================================
    // 10. KENYA SECURITY & FRAUD PREVENTION
    // ============================================
    securityMeasures: {
        idVerification: {
            required: true,
            acceptedIds: ['National ID', 'Passport', 'Alien Card'],
            verificationMethod: 'Manual + Automated',
            idPattern: '^[0-9]{8}$' // Kenya ID pattern
        },
        phoneVerification: {
            required: true,
            pattern: '^\\+254[0-9]{9}$',
            verificationMethod: 'SMS OTP'
        },
        transactionMonitoring: {
            enabled: true,
            dailyLimit: 500000, // KSh
            monthlyLimit: 5000000, // KSh
            suspiciousThreshold: 100000 // KSh
        }
    },
    
    // ============================================
    // 11. KENYA EMERGENCY CATEGORIES (LOCALIZED)
    // ============================================
    emergencyCategories: {
        transport: {
            name: 'M-pesewa Fare',
            description: 'Move on, don\'t stall—borrow for your journey.',
            maxAmount: 5000,
            icon: '🚌'
        },
        data: {
            name: 'M-pesewa Data',
            description: 'Stay connected, stay informed—borrow when your bundle runs out.',
            maxAmount: 2000,
            icon: '📶'
        },
        cookingGas: {
            name: 'M-pesewa Cooking Gas',
            description: 'Cook with confidence—borrow when your gas is low.',
            maxAmount: 3000,
            icon: '🔥'
        }
    },
    
    // ============================================
    // 12. KENYA GROUP RULES ENFORCEMENT
    // ============================================
    groupRules: {
        minMembers: 5,
        maxMembers: 1000,
        countryLock: true,
        groupTypes: ['Family', 'Church', 'Professional', 'Chama', 'Sacco'],
        invitationOnly: true,
        adminRights: {
            canInvite: true,
            canRemove: true,
            canModerate: true,
            canViewStats: true
        }
    },
    
    // ============================================
    // 13. KENYA SUBSCRIPTION PLANS (KSH)
    // ============================================
    subscriptionPlans: {
        basic: {
            name: 'Basic',
            monthly: 50,
            biAnnual: 250,
            annual: 500,
            maxWeeklyLending: 1500,
            features: ['Unlimited ledgers', 'Basic reporting', 'Email support'],
            crbCheck: false
        },
        premium: {
            name: 'Premium',
            monthly: 250,
            biAnnual: 1500,
            annual: 2500,
            maxWeeklyLending: 5000,
            features: ['Advanced analytics', 'Priority support', 'Bulk operations'],
            crbCheck: false
        },
        super: {
            name: 'Super',
            monthly: 1000,
            biAnnual: 5000,
            annual: 8500,
            maxWeeklyLending: 20000,
            features: ['CRB integration', 'Dedicated support', 'Custom reporting'],
            crbCheck: true
        },
        lenderOfLenders: {
            name: 'Lender of Lenders',
            monthly: 500,
            biAnnual: 3500,
            annual: 6500,
            maxWeeklyLending: 50000,
            features: ['Extended repayment terms', 'Custom interest rates', 'Enterprise support'],
            crbCheck: true
        }
    },
    
    // ============================================
    // 14. KENYA BLACKLIST & DEFAULT MANAGEMENT
    // ============================================
    blacklistRules: {
        defaultPeriod: 60, // Days
        blacklistActions: {
            cannotBorrow: true,
            cannotJoinGroups: true,
            visiblePlatformWide: true,
            crbReporting: true
        },
        removalConditions: {
            fullRepayment: true,
            adminApproval: true,
            waitingPeriod: 30 // Days after repayment
        }
    },
    
    // ============================================
    // 15. KENYA DISPUTE RESOLUTION
    // ============================================
    disputeResolution: {
        escalationPath: ['Group Admin', 'Platform Moderator', 'Kenya Arbitration'],
        timeframe: {
            initialResponse: '24 hours',
            resolution: '7 days',
            escalation: '14 days'
        },
        mediationServices: [
            'Kenya Financial Ombudsman',
            'Central Bank of Kenya Consumer Protection',
            'CMA Investor Compensation Fund'
        ]
    },
    
    // ============================================
    // 16. KENYA ANALYTICS & REPORTING
    // ============================================
    analytics: {
        metrics: [
            'Total loans disbursed',
            'Average loan size',
            'Repayment rate',
            'Default rate',
            'Active lenders',
            'Active borrowers',
            'Geographic distribution',
            'Category performance'
        ],
        reportingFrequency: 'Monthly',
        regulatoryReports: ['CBK Monthly Returns', 'CMA Quarterly Reports', 'KRA Tax Returns']
    },
    
    // ============================================
    // 17. KENYA PARTNERSHIPS & INTEGRATIONS
    // ============================================
    partners: {
        paymentProviders: ['Safaricom M-Pesa', 'Airtel Money', 'Equity Bank', 'KCB Bank'],
        creditBureaus: ['Creditinfo CRB', 'Metropol CRB', 'TransUnion'],
        debtCollectors: [
            'Metropol Credit Reference Bureau',
            'Creditinfo Kenya',
            'TransUnion Kenya'
        ],
        technologyPartners: [
            'Safaricom Business',
            'Google Cloud Kenya',
            'Microsoft Kenya'
        ]
    },
    
    // ============================================
    // 18. KENYA RISK MANAGEMENT
    // ============================================
    riskManagement: {
        creditScoring: {
            enabled: true,
            factors: ['Repayment history', 'Group reputation', 'Loan frequency', 'Amount consistency']
        },
        fraudDetection: {
            enabled: true,
            checks: ['ID verification', 'Phone verification', 'Device fingerprinting', 'IP analysis']
        },
        complianceMonitoring: {
            aml: true, // Anti-Money Laundering
            kyc: true, // Know Your Customer
            cft: true  // Counter Financing of Terrorism
        }
    },
    
    // ============================================
    // 19. KENYA USER SUPPORT & EDUCATION
    // ============================================
    userSupport: {
        channels: {
            phone: true,
            email: true,
            chat: true,
            whatsapp: true,
            inPerson: false
        },
        responseTimes: {
            priority: '2 hours',
            standard: '24 hours',
            general: '48 hours'
        },
        educationalResources: [
            'Kenya Financial Literacy Guide',
            'Loan Repayment Calculator',
            'Credit Score Education',
            'Fraud Prevention Tips'
        ]
    },
    
    // ============================================
    // 20. KENYA DATA PRIVACY & PROTECTION
    // ============================================
    dataPrivacy: {
        gdprCompliance: false,
        localDataProtection: true,
        dataRetention: {
            userData: '7 years',
            transactionData: '10 years',
            auditLogs: 'Permanent'
        },
        dataSharing: {
            withRegulators: true,
            withCreditBureaus: true,
            withPartners: false,
            crossBorder: false
        }
    }
};

// ============================================
// CONFIGURATION VALIDATION FUNCTIONS
// ============================================

/**
 * Validates Kenya configuration before export
 * @throws {Error} If configuration violates strict rules
 */
function validateKenyaConfig(config) {
    const errors = [];
    
    // 1. Validate country isolation
    if (config.countryCode !== 'KE') {
        errors.push('Country code must be KE for Kenya configuration');
    }
    
    // 2. Validate currency
    if (config.localCurrency !== 'KES') {
        errors.push('Kenya must use KES currency');
    }
    
    // 3. Validate financial rules
    if (config.financialRules.interestRate !== 10) {
        errors.push('Interest rate must be 10% for Kenya');
    }
    
    if (config.financialRules.repaymentPeriod !== 7) {
        errors.push('Repayment period must be 7 days for Kenya');
    }
    
    // 4. Validate hierarchy rules
    if (!config.groupRules.countryLock) {
        errors.push('Country lock must be enabled for Kenya');
    }
    
    // 5. Validate subscription expiry
    if (config.financialRules.subscriptionExpiry !== 28) {
        errors.push('Subscription must expire on 28th of each month');
    }
    
    if (errors.length > 0) {
        throw new Error(`Kenya Configuration Validation Failed:\n${errors.join('\n')}`);
    }
    
    return true;
}

// ============================================
// KENYA FOOTER MODULE CLASS
// ============================================

/**
 * Kenya Country Footer Module Class
 * Contains all Kenya-specific footer configuration and rules
 */
class KenyaFooterModule {
    constructor() {
        this.config = KenyaFooterConfig;
        this.validationErrors = [];
        this.isValid = false;
        this.initialize();
    }
    
    initialize() {
        try {
            validateKenyaConfig(this.config);
            this.isValid = true;
            console.log('✅ Kenya Footer Module initialized successfully');
        } catch (error) {
            this.validationErrors.push(error.message);
            this.isValid = false;
            console.error('❌ Kenya Footer Module initialization failed:', error.message);
            throw error;
        }
    }
    
    getFooterData(userRole = null) {
        if (!this.isValid) {
            throw new Error('Kenya configuration is not valid');
        }
        
        const filteredColumns = {};
        
        // Filter links based on user role if provided
        Object.keys(this.config.footerColumns).forEach(columnKey => {
            const column = this.config.footerColumns[columnKey];
            filteredColumns[columnKey] = {
                title: column.title,
                links: column.links.filter(link => {
                    // If no role specified, show all links
                    if (!link.role) return true;
                    // If user role matches link role, show it
                    return link.role === userRole;
                })
            };
        });
        
        return {
            ...this.config,
            footerColumns: filteredColumns,
            renderedAt: new Date().toISOString(),
            timezone: 'Africa/Nairobi'
        };
    }
    
    getContactInfo() {
        return {
            ...this.config.contactInfo,
            regulatoryBodies: this.config.regulatoryBodies
        };
    }
    
    getLegalDisclaimers() {
        return this.config.legalDisclaimers;
    }
    
    getSubscriptionPlans() {
        return this.config.subscriptionPlans;
    }
    
    getFinancialRules() {
        return this.config.financialRules;
    }
    
    validateTransaction(transaction) {
        const rules = this.config.financialRules;
        const errors = [];
        
        // Check amount limits
        if (transaction.amount > rules.maxLoanAmount[transaction.tier]) {
            errors.push(`Amount exceeds ${transaction.tier} tier limit`);
        }
        
        // Check if repayment period is valid
        if (transaction.repaymentDays > rules.repaymentPeriod) {
            errors.push(`Repayment period exceeds ${rules.repaymentPeriod} days`);
        }
        
        // Check if subscription is active
        if (transaction.subscriptionExpiry < new Date()) {
            errors.push('Lender subscription has expired');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            rulesApplied: rules
        };
    }
    
    // Strict hierarchy enforcement
    enforceHierarchy(userData) {
        const hierarchyViolations = [];
        
        // Check country isolation
        if (userData.country !== 'KE') {
            hierarchyViolations.push('User must be in Kenya to access Kenya-specific features');
        }
        
        // Check group membership
        if (userData.groups && userData.groups.length > 4) {
            hierarchyViolations.push('User cannot belong to more than 4 groups');
        }
        
        // Check lender subscription
        if (userData.role === 'lender' && !userData.subscriptionActive) {
            hierarchyViolations.push('Lender must have active subscription');
        }
        
        // Check borrower rating for multiple groups
        if (userData.role === 'borrower' && userData.groups && userData.groups.length > 1) {
            if (userData.rating < 3) {
                hierarchyViolations.push('Borrower needs good rating (≥3 stars) to join multiple groups');
            }
        }
        
        return {
            isCompliant: hierarchyViolations.length === 0,
            violations: hierarchyViolations,
            hierarchy: {
                global: true,
                country: 'KE',
                groups: userData.groups || [],
                role: userData.role,
                subscription: userData.subscriptionActive || false
            }
        };
    }
    
    // Audit logging
    logAudit(action, userId, details = {}) {
        const auditLog = {
            timestamp: new Date().toISOString(),
            country: 'KE',
            userId,
            action,
            details,
            ip: details.ip || 'unknown',
            userAgent: details.userAgent || 'unknown',
            sessionId: details.sessionId || 'unknown'
        };
        
        // In production, this would send to audit service
        console.log('🔒 KENYA AUDIT LOG:', auditLog);
        
        return auditLog;
    }
    
    // Emergency override (Admin only)
    adminOverride(action, adminId, target, overrideData) {
        if (!adminId.startsWith('ADMIN_KE_')) {
            throw new Error('Only Kenya administrators can perform overrides');
        }
        
        const overrideLog = {
            timestamp: new Date().toISOString(),
            country: 'KE',
            adminId,
            action,
            target,
            overrideData,
            authorization: 'PLATFORM_ADMIN_OVERRIDE'
        };
        
        console.log('⚡ KENYA ADMIN OVERRIDE:', overrideLog);
        
        return {
            success: true,
            log: overrideLog,
            message: `Admin override performed for ${target}`
        };
    }
}

// ============================================
// SINGLETON INSTANCE MANAGEMENT
// ============================================

let kenyaInstance = null;

/**
 * Get Kenya Footer Module instance (Singleton pattern)
 * @returns {KenyaFooterModule}
 */
function getKenyaFooterModule() {
    if (!kenyaInstance) {
        kenyaInstance = new KenyaFooterModule();
    }
    return kenyaInstance;
}

// ============================================
// KENYA-SPECIFIC UTILITY FUNCTIONS
// ============================================

const KenyaUtils = {
    formatCurrency: (amount) => {
        return `KSh ${parseFloat(amount).toLocaleString('en-KE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    },
    
    calculateInterest: (principal, days = 7) => {
        const weeklyInterest = 0.10; // 10%
        const interest = principal * weeklyInterest;
        return {
            principal,
            interest,
            total: principal + interest,
            dailyBreakdown: interest / days,
            dueDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        };
    },
    
    validatePhone: (phone) => {
        const regex = /^\+254[0-9]{9}$/;
        return regex.test(phone);
    },
    
    validateNationalId: (id) => {
        const regex = /^[0-9]{8}$/;
        return regex.test(id);
    },
    
    getLocalTime: () => {
        return new Date().toLocaleString('en-KE', {
            timeZone: 'Africa/Nairobi'
        });
    },
    
    // Hierarchy validation
    validateHierarchy: (user) => {
        const errors = [];
        
        // Country must be Kenya
        if (user.country !== 'KE') {
            errors.push('User country must be Kenya');
        }
        
        // Groups must be in Kenya
        if (user.groups) {
            user.groups.forEach((group, index) => {
                if (group.country !== 'KE') {
                    errors.push(`Group ${index + 1} is not in Kenya`);
                }
            });
        }
        
        // Maximum 4 groups for borrowers
        if (user.role === 'borrower' && user.groups && user.groups.length > 4) {
            errors.push('Borrower cannot have more than 4 groups');
        }
        
        // Lenders must have subscription
        if (user.role === 'lender' && !user.subscription) {
            errors.push('Lender must have active subscription');
        }
        
        return {
            valid: errors.length === 0,
            errors,
            hierarchy: {
                global: true,
                country: user.country,
                groups: user.groups?.length || 0,
                role: user.role,
                subscription: user.subscription || false
            }
        };
    }
};

// ============================================
// EMERGENCY FALLBACK CONFIGURATION
// ============================================

const KenyaEmergencyFallback = {
    countryCode: 'KE',
    countryName: 'Kenya',
    contact: {
        emergencyPhone: '+254 709 219 000',
        email: 'emergency.ke@mpesewa.com'
    },
    maintenance: false,
    lastUpdated: new Date().toISOString()
};

// ============================================
// EXPORTS (SINGLE DEFAULT EXPORT + NAMED EXPORTS)
// ============================================

/**
 * Main export - KenyaFooterModule as default export
 */
export default KenyaFooterModule;

/**
 * Named exports for additional utilities and configurations
 */
export {
    KenyaFooterConfig,
    getKenyaFooterModule,
    KenyaUtils,
    KenyaEmergencyFallback
};

// ============================================
// BROWSER GLOBAL EXPORT (FOR NON-MODULE ENVIRONMENTS)
// ============================================

/**
 * Browser global export for non-module environments
 * This allows usage in traditional script tags
 */
if (typeof window !== 'undefined') {
    window.MPESEWA_KENYA_FOOTER = {
        version: '1.0.0',
        country: 'Kenya',
        currency: 'KES',
        initialized: false,
        
        // Configuration
        config: KenyaFooterConfig,
        
        // Module instance
        module: null,
        
        // Utility functions
        utils: KenyaUtils,
        
        // Emergency fallback
        emergency: KenyaEmergencyFallback,
        
        // Initialize function
        initialize: function() {
            try {
                this.module = getKenyaFooterModule();
                this.initialized = this.module.isValid;
                console.log('✅ Kenya Footer Module initialized in browser');
                return this.module;
            } catch (error) {
                console.error('Failed to initialize Kenya module:', error);
                return null;
            }
        },
        
        // Convenience methods
        getFooter: function(userRole) {
            if (!this.initialized) this.initialize();
            return this.module?.getFooterData(userRole);
        },
        
        getContact: function() {
            if (!this.initialized) this.initialize();
            return this.module?.getContactInfo();
        },
        
        validateHierarchy: function(user) {
            return KenyaUtils.validateHierarchy(user);
        },
        
        formatCurrency: function(amount) {
            return KenyaUtils.formatCurrency(amount);
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.MPESEWA_KENYA_FOOTER.initialize();
        });
    } else {
        window.MPESEWA_KENYA_FOOTER.initialize();
    }
}

// ============================================
// MODULE METADATA AND VERSION INFO
// ============================================

/**
 * Module metadata for debugging and version tracking
 */
export const moduleInfo = {
    name: 'M-Pesewa Kenya Footer Module',
    version: '1.0.0',
    buildDate: '2026-01-24',
    author: 'M-Pesewa Technology Team',
    country: 'Kenya',
    currency: 'KES',
    dependencies: [],
    exports: [
        'default (KenyaFooterModule)',
        'KenyaFooterConfig',
        'getKenyaFooterModule',
        'KenyaUtils',
        'KenyaEmergencyFallback',
        'moduleInfo'
    ]
};

// ============================================
// STRICT COMPLIANCE VALIDATION
// ============================================

/**
 * Validate module compliance with M-Pesewa standards
 * This runs automatically when the module loads
 */
(function validateModuleCompliance() {
    try {
        // Validate configuration
        validateKenyaConfig(KenyaFooterConfig);
        
        // Validate KenyaFooterModule can be instantiated
        const testModule = new KenyaFooterModule();
        
        // Validate utility functions
        if (typeof KenyaUtils.formatCurrency !== 'function') {
            throw new Error('KenyaUtils.formatCurrency is not a function');
        }
        
        if (typeof KenyaUtils.validatePhone !== 'function') {
            throw new Error('KenyaUtils.validatePhone is not a function');
        }
        
        // Validate hierarchy structure
        const hierarchyTest = KenyaUtils.validateHierarchy({
            country: 'KE',
            role: 'borrower',
            groups: [{ country: 'KE' }],
            subscription: false
        });
        
        if (!hierarchyTest.valid) {
            console.warn('Hierarchy validation test failed:', hierarchyTest.errors);
        }
        
        console.log('✅ Kenya Footer Module compliance validation passed');
        
    } catch (error) {
        console.error('❌ Kenya Footer Module compliance validation failed:', error.message);
        
        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Compliance validation error details:', error);
        }
        
        // In production, we might want to fall back to emergency mode
        if (typeof window !== 'undefined' && window.MPESEWA_KENYA_FOOTER) {
            window.MPESEWA_KENYA_FOOTER.emergencyMode = true;
            window.MPESEWA_KENYA_FOOTER.lastError = error.message;
        }
    }
})();

// ============================================
// END OF MODULE - SINGLE DEFAULT EXPORT
// ============================================