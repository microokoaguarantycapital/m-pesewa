/**
 * M-PESEWA DRC (Democratic Republic of Congo) Configuration
 * STRICT COUNTRY ISOLATION - NO CROSS-COUNTRY OPERATIONS
 * Last Updated: 2026-01-24
 */

const DRC_CONFIG = {
    // ============================================
    // 1️⃣ COUNTRY IDENTIFICATION & META
    // ============================================
    COUNTRY_ID: 'DRC',
    COUNTRY_NAME: 'Democratic Republic of the Congo',
    COUNTRY_CODE: 'CD',
    ISO_CODE: 'COD',
    OFFICIAL_NAME: 'République Démocratique du Congo',
    TIMEZONE: 'Africa/Kinshasa',
    GMT_OFFSET: '+1',
    ACTIVE: true,
    
    // ============================================
    // 2️⃣ LEGAL & COMPLIANCE
    // ============================================
    LEGAL: {
        GOVERNING_LAW: 'Laws of the Democratic Republic of Congo',
        MIN_AGE: 18,
        FINANCIAL_AUTHORITY: 'Banque Centrale du Congo',
        DATA_PROTECTION_LAW: 'Loi n° 009/2002 du 16 juillet 2002',
        AML_LAW: 'Loi n° 004/2003 du 20 février 2003',
        TAX_REGIME: 'Code Général des Impôts',
        
        // Specific DRC financial regulations
        REGULATIONS: {
            MICROFINANCE: 'Décret n° 04/002 du 02 janvier 2004',
            P2P_LENDING: 'Arrêté Ministériel n° 001/2020',
            DIGITAL_PAYMENTS: 'Circulaire BCC n° 01/2019',
            CONSUMER_PROTECTION: 'Loi n° 015/2002 du 16 octobre 2002'
        },
        
        REQUIRED_DOCUMENTS: {
            INDIVIDUALS: ['National ID Card', 'Proof of Residence', 'Tax Identification Number'],
            BUSINESSES: ['Business Registration', 'Tax Certificate', 'Articles of Association'],
            LENDERS: ['Bank Statement (6 months)', 'Source of Funds Declaration', 'AML Compliance Form']
        }
    },
    
    // ============================================
    // 3️⃣ GEOGRAPHICAL & DEMOGRAPHIC
    // ============================================
    GEOGRAPHY: {
        REGIONS: [
            'Kinshasa', 'Kongo Central', 'Kwango', 'Kwilu', 'Mai-Ndombe', 
            'Kasai', 'Kasai Central', 'Kasai Oriental', 'Lomami', 'Sankuru',
            'Maniema', 'South Kivu', 'North Kivu', 'Ituri', 'Haut-Uele', 
            'Tshopo', 'Bas-Uele', 'Nord-Ubangi', 'Sud-Ubangi', 'Mongala',
            'Equateur', 'Tshuapa', 'Tanganyika', 'Haut-Lomami', 'Lualaba',
            'Haut-Katanga'
        ],
        
        PROVINCES: 26,
        MAJOR_CITIES: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Bukavu', 'Kisangani', 'Kananga'],
        POPULATION: '112 million',
        URBANIZATION_RATE: '45%',
        INTERNET_PENETRATION: '22%',
        MOBILE_PENETRATION: '52%'
    },
    
    // ============================================
    // 4️⃣ FINANCIAL ECOSYSTEM
    // ============================================
    FINANCIAL: {
        BANKING_SYSTEM: {
            CENTRAL_BANK: 'Banque Centrale du Congo (BCC)',
            COMMERCIAL_BANKS: 18,
            MICROFINANCE_INSTITUTIONS: 650,
            INSURANCE_COMPANIES: 45,
            STOCK_EXCHANGE: 'Lubumbashi Stock Exchange'
        },
        
        PAYMENT_SYSTEMS: {
            MOBILE_MONEY: ['Orange Money', 'Airtel Money', 'Vodacom M-Pesa', 'Africell Money'],
            BANK_TRANSFERS: ['Virement Bancaire', 'Swift Transfers'],
            CASH_DOMINANCE: '85%',
            DIGITAL_ADOPTION: '15%'
        },
        
        CREDIT_BUREAUS: {
            PRIMARY: 'Credit Bureau Congo (CBC)',
            COVERAGE: '40% of adult population',
            INTEGRATION_REQUIRED: true,
            API_ENDPOINT: 'https://api.creditbureau.cd/v2'
        }
    },
    
    // ============================================
    // 5️⃣ M-PESEWA SPECIFIC CONFIGURATION
    // ============================================
    MPESEWA: {
        // Registration Requirements
        REGISTRATION: {
            MIN_GROUP_SIZE: 5,
            MAX_GROUP_SIZE: 1000,
            MIN_LENDERS_PER_GROUP: 2,
            MAX_GROUPS_PER_USER: 4,
            REFERRAL_REQUIRED: true,
            REFERRERS_REQUIRED: 2,
            ID_VERIFICATION: 'National ID mandatory',
            ADDRESS_VERIFICATION: 'Utility bill or bank statement'
        },
        
        // Loan Parameters (Strict Enforcement)
        LOAN_PARAMETERS: {
            MAX_REPAYMENT_DAYS: 7,
            INTEREST_RATE: 10, // percentage
            DAILY_PENALTY_RATE: 5, // percentage after 7 days
            DEFAULT_PERIOD: 60, // days (2 months)
            MIN_LOAN_AMOUNT: 500, // CDF
            MAX_ACTIVE_LOANS_PER_USER: 1
        },
        
        // Subscription Tiers (CDF)
        SUBSCRIPTION_TIERS: {
            BASIC: {
                NAME: 'Basic',
                WEEKLY_LIMIT: 3000, // CDF
                MONTHLY_FEE: 1200, // CDF
                BI_ANNUAL_FEE: 6000, // CDF
                ANNUAL_FEE: 10000, // CDF
                CRB_CHECK: false,
                MAX_LEDGERS: 1500
            },
            PREMIUM: {
                NAME: 'Premium',
                WEEKLY_LIMIT: 12000, // CDF
                MONTHLY_FEE: 6000, // CDF
                BI_ANNUAL_FEE: 36000, // CDF
                ANNUAL_FEE: 60000, // CDF
                CRB_CHECK: false,
                MAX_LEDGERS: 10000
            },
            SUPER: {
                NAME: 'Super',
                WEEKLY_LIMIT: 48000, // CDF
                MONTHLY_FEE: 24000, // CDF
                BI_ANNUAL_FEE: 120000, // CDF
                ANNUAL_FEE: 204000, // CDF
                CRB_CHECK: true,
                MAX_LEDGERS: 20000
            },
            LENDER_OF_LENDERS: {
                NAME: 'Lender of Lenders',
                WEEKLY_LIMIT: 120000, // CDF
                MONTHLY_FEE: 12000, // CDF
                BI_ANNUAL_FEE: 84000, // CDF
                ANNUAL_FEE: 156000, // CDF
                CRB_CHECK: true,
                MIN_REPAYMENT_PERIOD: 30 // days
            }
        },
        
        // Emergency Categories (Localized for DRC)
        EMERGENCY_CATEGORIES: {
            TRANSPORT: {
                FR: 'Transport Urgent',
                SW: 'Usafiri wa Dharura',
                LN: 'Mosalisi ya Ntango'
            },
            FOOD_SECURITY: {
                FR: 'Sécurité Alimentaire',
                SW: 'Usalama wa Chakula',
                LN: 'Kimia ya Bilanga'
            },
            HEALTH_EMERGENCY: {
                FR: 'Urgence Médicale',
                SW: 'Dharura ya Afya',
                LN: 'Bongisami ya Monganga'
            },
            EDUCATION: {
                FR: 'Frais Scolaires',
                SW: 'Ada ya Shule',
                LN: 'Mikolo ya Kelasi'
            },
            BUSINESS_CAPITAL: {
                FR: 'Capital d\'Affaires',
                SW: 'Mtaji wa Biashara',
                LN: 'Mbongo ya Business'
            }
        },
        
        // Risk Parameters
        RISK_PARAMETERS: {
            DEFAULT_RATE_THRESHOLD: 5, // percentage
            BLACKLIST_AUTOMATIC_DAYS: 60,
            REPUTATION_DECAY_DAYS: 90,
            MAX_OVERDUE_LOANS: 2,
            AUTO_FLAG_AMOUNT: 100000 // CDF
        },
        
        // Compliance Monitoring
        COMPLIANCE: {
            DAILY_TRANSACTION_LIMIT: 500000, // CDF
            MONTHLY_TRANSACTION_LIMIT: 5000000, // CDF
            ANNUAL_TRANSACTION_LIMIT: 20000000, // CDF
            KYC_REQUIRED_AMOUNT: 100000, // CDF
            ENHANCED_KYC_AMOUNT: 500000 // CDF
        }
    },
    
    // ============================================
    // 6️⃣ LOCALIZATION & CULTURAL
    // ============================================
    LOCALIZATION: {
        LANGUAGES: {
            PRIMARY: ['French', 'Lingala', 'Swahili', 'Kikongo', 'Tshiluba'],
            PLATFORM_SUPPORT: ['French', 'Swahili', 'Lingala'],
            DEFAULT: 'French'
        },
        
        CULTURAL_CONTEXT: {
            TRADITIONAL_SAVINGS: ['Likelemba', 'Tontines', 'Association Villageoise'],
            COMMUNITY_STRUCTURE: 'Strong extended family and clan systems',
            TRUST_MECHANISMS: 'Community elders, church leaders, local chiefs',
            FINANCIAL_LITERACY: 'Low - estimated 35% of adults',
            GENDER_DYNAMICS: 'Male-dominated financial decisions, but women control household budgets'
        },
        
        HOLIDAYS: [
            '2026-01-01', // New Year's Day
            '2026-01-04', // Independence Heroes Day
            '2026-05-01', // Labor Day
            '2026-06-30', // Independence Day
            '2026-08-01', // Parents' Day
            '2026-10-27', // Anniversary of the Second Republic
            '2026-11-17', // Army Day
            '2026-12-25'  // Christmas Day
        ],
        
        NON_WORKING_DAYS: ['Sunday']
    },
    
    // ============================================
    // 7️⃣ SUPPORT & OPERATIONS
    // ============================================
    OPERATIONS: {
        SUPPORT_HOURS: {
            MONDAY_FRIDAY: '07:00-19:00',
            SATURDAY: '08:00-16:00',
            SUNDAY: '09:00-14:00'
        },
        
        CONTACT_CHANNELS: {
            PHONE: '+243 81 000 0000',
            WHATSAPP: '+243 89 000 0000',
            EMAIL: 'drc@m-pesewa.com',
            OFFICE: 'Avenue des Aviateurs, Gombe, Kinshasa',
            BRANCHES: ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani']
        },
        
        PARTNER_NETWORKS: {
            BANKS: ['Rawbank', 'Equity BCDC', 'Trust Merchant Bank', 'Bank of Africa'],
            TELCOS: ['Vodacom Congo', 'Orange RDC', 'Airtel Congo', 'Africell RDC'],
            AGENTS: 2500,
            AGENT_TRAINING_CENTERS: ['Kinshasa', 'Lubumbashi', 'Goma']
        },
        
        DISPUTE_RESOLUTION: {
            LEVEL_1: 'Group Admin Mediation',
            LEVEL_2: 'Local Community Leader',
            LEVEL_3: 'MPesewa DRC Arbitration Committee',
            LEVEL_4: 'Tribunal de Commerce de Kinshasa',
            MAX_RESOLUTION_DAYS: 30
        }
    },
    
    // ============================================
    // 8️⃣ SECURITY & FRAUD PREVENTION
    // ============================================
    SECURITY: {
        AUTHENTICATION: {
            TWO_FACTOR_REQUIRED: true,
            BIOMETRIC_OPTIONAL: true,
            SESSION_TIMEOUT: 15, // minutes
            MAX_LOGIN_ATTEMPTS: 5,
            DEVICE_REGISTRATION: true
        },
        
        FRAUD_PREVENTION: {
            TRANSACTION_MONITORING: true,
            UNUSUAL_ACTIVITY_ALERTS: true,
            GEOLOCATION_VERIFICATION: true,
            DEVICE_FINGERPRINTING: true,
            REAL_TIME_SCORING: true
        },
        
        DATA_PROTECTION: {
            ENCRYPTION_STANDARD: 'AES-256',
            DATA_RESIDENCY: 'DRC',
            BACKUP_LOCATION: 'Kinshasa Data Center',
            RETENTION_PERIOD: 7 // years
        }
    },
    
    // ============================================
    // 9️⃣ REPORTING & ANALYTICS
    // ============================================
    REPORTING: {
        DAILY_REPORTS: [
            'New Registrations',
            'Loan Disbursements',
            'Repayments',
            'Default Alerts',
            'Suspicious Activities'
        ],
        
        MONTHLY_REPORTS: [
            'Group Performance',
            'Lender Portfolio',
            'Borrower Reputation',
            'Risk Assessment',
            'Compliance Status'
        ],
        
        REGULATORY_REPORTS: {
            TO_BCC: ['Monthly', 'Quarterly', 'Annual'],
            TO_MINISTRY_OF_FINANCE: ['Quarterly'],
            TO_TAX_AUTHORITY: ['Annual']
        },
        
        DASHBOARD_METRICS: [
            'Active Groups',
            'Total Lenders',
            'Total Borrowers',
            'Outstanding Loans',
            'Repayment Rate',
            'Default Rate',
            'Average Loan Size',
            'Geographic Distribution'
        ]
    },
    
    // ============================================
    // 🔟 SYSTEM INTEGRATIONS
    // ============================================
    INTEGRATIONS: {
        MOBILE_MONEY: {
            PROVIDERS: ['Vodacom M-Pesa', 'Orange Money', 'Airtel Money'],
            API_VERSION: 'v2.1',
            SETTLEMENT_TIME: 'Real-time',
            FEES: 'Transaction-based'
        },
        
        BANKS: {
            PROVIDERS: ['Rawbank', 'Equity BCDC', 'TMB'],
            API_TYPE: 'REST',
            SETTLEMENT_TIME: 'T+1',
            FEES: 'Negotiated'
        },
        
        GOVERNMENT: {
            ID_VERIFICATION: 'Direction Générale de Migration (DGM)',
            TAX_VERIFICATION: 'Direction Générale des Impôts (DGI)',
            BUSINESS_REGISTRATION: 'Guichet Unique'
        },
        
        THIRD_PARTY: {
            CREDIT_BUREAU: 'Credit Bureau Congo',
            SMS_GATEWAY: 'Infobip DRC',
            EMAIL_SERVICE: 'SendGrid',
            ANALYTICS: 'Google Analytics 4'
        }
    },
    
    // ============================================
    // 1️⃣1️⃣ HIERARCHY ENFORCEMENT (STRICT)
    // ============================================
    HIERARCHY: {
        LEVELS: {
            GLOBAL: {
                NAME: 'M-Pesewa Global',
                RULES: ['Brand Standards', 'Core Technology', 'Security Protocols']
            },
            COUNTRY: {
                NAME: 'DRC Operations',
                RULES: [
                    'Country Isolation: NO cross-border transactions',
                    'Local Currency Only: CDF',
                    'DRC Regulations Compliance',
                    'Local Language Support'
                ]
            },
            GROUPS: {
                NAME: 'Trust Circles',
                RULES: [
                    'Min 5 members, Max 1000 members',
                    'Single Country Only',
                    'Invitation/Referral Only',
                    'One Admin per Group',
                    'Internal Rule Setting Allowed'
                ]
            },
            LENDERS: {
                NAME: 'Money Providers',
                RULES: [
                    'Subscription Required',
                    'Lend within Group Only',
                    'Unlimited Ledgers Allowed',
                    'Active Subscription Required',
                    'Cannot Lend above Tier Limit'
                ]
            },
            BORROWERS: {
                NAME: 'Money Recipients',
                RULES: [
                    'No Subscription Fees',
                    'Max 4 Groups with Good Rating',
                    'One Active Loan per Group',
                    '7-day Repayment Period',
                    '10% Interest Mandatory'
                ]
            },
            LEDGERS: {
                NAME: 'Loan Records',
                RULES: [
                    'Auto-created on Loan Approval',
                    'One Ledger per Borrower-Lender Pair',
                    'Manual Updates by Lender',
                    'Admin Override Allowed',
                    'Permanent Record (Archived)'
                ]
            }
        },
        
        ENFORCEMENT_RULES: {
            STRICT_ISOLATION: {
                CROSS_COUNTRY: 'ABSOLUTELY PROHIBITED',
                CROSS_GROUP_LENDING: 'PROHIBITED',
                CROSS_GROUP_BORROWING: 'ALLOWED (max 4 groups)',
                ROLE_MIXING: 'ALLOWED (dual roles)',
                GROUP_MIGRATION: 'ALLOWED with Good Rating'
            },
            
            ESCALATION_PATH: [
                'Borrower → Lender',
                'Lender → Group Admin',
                'Group Admin → Country Admin',
                'Country Admin → Global Admin'
            ],
            
            OVERRIDE_AUTHORITY: {
                GROUP_ADMIN: ['Remove Members', 'Moderate Disputes', 'View Group Analytics'],
                COUNTRY_ADMIN: ['Override Blacklists', 'Edit Ledgers', 'Moderate Ratings'],
                GLOBAL_ADMIN: ['System-wide Override', 'Country Management', 'Audit Logs']
            }
        }
    },
    
    // ============================================
    // 1️⃣2️⃣ VALIDATION RULES
    // ============================================
    VALIDATION: {
        ID_VALIDATION: {
            NATIONAL_ID: /^[0-9]{2}[A-Z]{2}[0-9]{6}$/,
            PASSPORT: /^[A-Z]{2}[0-9]{7}$/,
            DRIVERS_LICENSE: /^[0-9]{10}$/
        },
        
        PHONE_VALIDATION: {
            PATTERN: /^(?:\+243|0)(8[1-9]|9[0-9])[0-9]{7}$/,
            REQUIRED_PREFIXES: ['+24381', '+24382', '+24383', '+24384', '+24385', 
                               '+24389', '+24390', '+24391', '+24397', '+24399']
        },
        
        LOCATION_VALIDATION: {
            PROVINCES: ['Kinshasa', 'Kongo Central', 'Kwango', 'Kwilu', 'Mai-Ndombe', 
                       'Kasai', 'Kasai Central', 'Kasai Oriental', 'Lomami', 'Sankuru',
                       'Maniema', 'South Kivu', 'North Kivu', 'Ituri', 'Haut-Uele', 
                       'Tshopo', 'Bas-Uele', 'Nord-Ubangi', 'Sud-Ubangi', 'Mongala',
                       'Equateur', 'Tshuapa', 'Tanganyika', 'Haut-Lomami', 'Lualaba',
                       'Haut-Katanga'],
            REQUIRED_FORMAT: 'Province, City/Town, Quarter'
        },
        
        FINANCIAL_VALIDATION: {
            MIN_LOAN: 500,
            MAX_LOAN_BY_TIER: {
                BASIC: 3000,
                PREMIUM: 12000,
                SUPER: 48000,
                LENDER_OF_LENDERS: 120000
            },
            INTEREST_CALCULATION: 'Daily pro-rata, weekly compounding',
            PENALTY_CALCULATION: '5% daily on outstanding after day 7'
        }
    },
    
    // ============================================
    // 1️⃣3️⃣ AUDIT & MONITORING
    // ============================================
    AUDIT: {
        AUTOMATED_CHECKS: [
            'Daily Subscription Expiry Check',
            'Weekly Repayment Monitoring',
            'Monthly Group Activity Review',
            'Quarterly Risk Assessment',
            'Annual Compliance Audit'
        ],
        
        MANUAL_REVIEWS: [
            'Large Transactions (>500,000 CDF)',
            'Suspicious Activity Patterns',
            'Multiple Group Memberships',
            'Frequent Role Changes',
            'High Default Rates'
        ],
        
        AUDIT_TRAIL: {
            USER_ACTIONS: ['Login', 'Registration', 'Loan Application', 'Repayment', 'Rating'],
            ADMIN_ACTIONS: ['User Modification', 'Ledger Edit', 'Blacklist Management', 'Group Management'],
            SYSTEM_ACTIONS: ['Auto-Blacklist', 'Subscription Expiry', 'Penalty Application', 'Notification Send']
        },
        
        RETENTION_POLICY: {
            TRANSACTION_RECORDS: '7 years',
            USER_DATA: '5 years after deactivation',
            AUDIT_LOGS: '10 years',
            COMPLIANCE_RECORDS: '10 years'
        }
    },
    
    // ============================================
    // 1️⃣4️⃣ NOTIFICATION SYSTEM
    // ============================================
    NOTIFICATIONS: {
        TYPES: {
            TRANSACTION: ['Loan Approved', 'Repayment Due', 'Payment Received', 'Loan Default'],
            SECURITY: ['Login Alert', 'Password Change', 'Device Added', 'Suspicious Activity'],
            SYSTEM: ['Subscription Expiry', 'Group Invitation', 'Rating Received', 'Blacklist Update'],
            COMPLIANCE: ['KYC Required', 'Document Expiry', 'Regulatory Update', 'Tax Reporting']
        },
        
        CHANNELS: {
            SMS: true,
            EMAIL: true,
            PUSH_NOTIFICATION: true,
            IN_APP_NOTIFICATION: true,
            WHATSAPP: true
        },
        
        TRIGGERS: {
            REPAYMENT_REMINDER: [1, 3, 5, 7], // days before due
            SUBSCRIPTION_EXPIRY: [7, 3, 1], // days before expiry
            DEFAULT_WARNING: [45, 50, 55], // days after loan
            BLACKLIST_ALERT: 'Immediate'
        },
        
        TEMPLATES: {
            LANGUAGE: ['French', 'Swahili', 'Lingala'],
            CULTURAL_ADAPTATION: true,
            LEGAL_DISCLAIMER: 'Required in all notifications',
            BRANDING: 'M-Pesewa DRC branding mandatory'
        }
    },
    
    // ============================================
    // 1️⃣5️⃣ DISASTER RECOVERY & BUSINESS CONTINUITY
    // ============================================
    DISASTER_RECOVERY: {
        DATA_BACKUP: {
            FREQUENCY: 'Real-time replication',
            LOCATIONS: ['Kinshasa Primary', 'Lubumbashi Secondary', 'Cloud Backup'],
            RETENTION: '30 days rolling'
        },
        
        SYSTEM_RECOVERY: {
            RTO: '4 hours', // Recovery Time Objective
            RPO: '15 minutes', // Recovery Point Objective
            FAILOVER_SITE: 'Lubumbashi Data Center',
            COMMUNICATION_PLAN: 'SMS and Email alerts'
        },
        
        CONTINGENCY_PLANS: {
            INTERNET_OUTAGE: 'SMS-based operations',
            POWER_FAILURE: 'Generator backup (72 hours)',
            CIVIL_UNREST: 'Remote operations activation',
            REGULATORY_CHANGE: 'Compliance team escalation'
        }
    },
    
    // ============================================
    // 1️⃣6️⃣ VERSION CONTROL & DEPLOYMENT
    // ============================================
    VERSION_CONTROL: {
        CURRENT_VERSION: '2.3.1',
        API_VERSION: 'v2',
        MIN_SUPPORTED_VERSION: '1.5.0',
        UPDATE_FREQUENCY: 'Monthly security patches, Quarterly feature updates',
        
        DEPLOYMENT: {
            ENVIRONMENTS: ['Development', 'Staging', 'Production'],
            APPROVAL_REQUIRED: ['Production deployment'],
            ROLLBACK_PLAN: 'Automated with 5-minute window',
            MAINTENANCE_WINDOW: 'Sunday 02:00-04:00 CAT'
        },
        
        CHANGE_MANAGEMENT: {
            NOTICE_PERIOD: '7 days for major changes',
            USER_NOTIFICATION: 'In-app banner + SMS',
            TRAINING_REQUIRED: 'For significant feature changes',
            DOCUMENTATION_UPDATE: 'Mandatory for all changes'
        }
    }
};

// ============================================
// EXPORT & VALIDATION
// ============================================

// Ensure strict country isolation
Object.freeze(DRC_CONFIG);
Object.freeze(DRC_CONFIG.HIERARCHY);
Object.freeze(DRC_CONFIG.MPESEWA);
Object.freeze(DRC_CONFIG.VALIDATION);

// Export the configuration
export default DRC_CONFIG;

// Helper function to validate country operations
export const validateCountryOperation = (operation) => {
    const violations = [];
    
    // Check for cross-country violations
    if (operation.targetCountry && operation.targetCountry !== 'CD') {
        violations.push(`CROSS_COUNTRY_VIOLATION: Operation targets ${operation.targetCountry} from DRC`);
    }
    
    // Check currency violations
    if (operation.currency && operation.currency !== 'CDF') {
        violations.push(`CURRENCY_VIOLATION: Operation uses ${operation.currency} instead of CDF`);
    }
    
    // Check group boundary violations
    if (operation.lenderGroup && operation.borrowerGroup && operation.lenderGroup !== operation.borrowerGroup) {
        violations.push(`CROSS_GROUP_VIOLATION: Lender and Borrower in different groups`);
    }
    
    // Check subscription violations
    if (operation.lenderTier && operation.amount) {
        const tierConfig = DRC_CONFIG.MPESEWA.SUBSCRIPTION_TIERS[operation.lenderTier];
        if (tierConfig && operation.amount > tierConfig.WEEKLY_LIMIT) {
            violations.push(`TIER_LIMIT_VIOLATION: Amount ${operation.amount} exceeds tier limit ${tierConfig.WEEKLY_LIMIT}`);
        }
    }
    
    return {
        valid: violations.length === 0,
        violations,
        timestamp: new Date().toISOString(),
        country: 'DRC'
    };
};

// Hierarchy validation function
export const validateHierarchy = (entity) => {
    const hierarchyRules = DRC_CONFIG.HIERARCHY.LEVELS;
    const errors = [];
    
    switch (entity.type) {
        case 'GROUP':
            if (entity.members < 5) errors.push('GROUP_SIZE_VIOLATION: Minimum 5 members required');
            if (entity.members > 1000) errors.push('GROUP_SIZE_VIOLATION: Maximum 1000 members exceeded');
            if (!entity.country || entity.country !== 'CD') errors.push('COUNTRY_VIOLATION: Group must be in DRC');
            break;
            
        case 'LENDER':
            if (!entity.subscription) errors.push('SUBSCRIPTION_VIOLATION: Active subscription required');
            if (entity.groups && entity.groups.length > 4) errors.push('GROUP_LIMIT_VIOLATION: Maximum 4 groups exceeded');
            break;
            
        case 'BORROWER':
            if (entity.groups && entity.groups.length > 4) errors.push('GROUP_LIMIT_VIOLATION: Maximum 4 groups exceeded');
            if (entity.activeLoans > 1) errors.push('LOAN_LIMIT_VIOLATION: Maximum 1 active loan per group');
            break;
            
        case 'LEDGER':
            if (!entity.lenderId || !entity.borrowerId) errors.push('LEDGER_VIOLATION: Both lender and borrower required');
            if (entity.amount < 500) errors.push('AMOUNT_VIOLATION: Minimum loan amount is 500 CDF');
            if (entity.repaymentDays > 7) errors.push('TERM_VIOLATION: Maximum repayment period is 7 days');
            break;
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        entityType: entity.type,
        validatedAt: new Date().toISOString()
    };
};

// Currency conversion functions (CDF only)
export const currencyUtils = {
    format: (amount) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },
    
    calculateInterest: (principal, days = 7) => {
        const dailyRate = DRC_CONFIG.MPESEWA.LOAN_PARAMETERS.INTEREST_RATE / 100 / 7;
        const interest = principal * dailyRate * days;
        return Math.ceil(interest); // Round up to nearest whole CDF
    },
    
    calculatePenalty: (outstandingAmount, overdueDays) => {
        if (overdueDays <= 0) return 0;
        const dailyPenaltyRate = DRC_CONFIG.MPESEWA.LOAN_PARAMETERS.DAILY_PENALTY_RATE / 100;
        let totalPenalty = 0;
        
        for (let i = 1; i <= overdueDays; i++) {
            totalPenalty += outstandingAmount * dailyPenaltyRate;
        }
        
        return Math.ceil(totalPenalty);
    },
    
    validateAmount: (amount, tier) => {
        const tierConfig = DRC_CONFIG.MPESEWA.SUBSCRIPTION_TIERS[tier];
        const minAmount = DRC_CONFIG.VALIDATION.FINANCIAL_VALIDATION.MIN_LOAN;
        
        if (amount < minAmount) {
            return {
                valid: false,
                error: `Amount below minimum (${minAmount} CDF)`,
                min: minAmount
            };
        }
        
        if (tierConfig && amount > tierConfig.WEEKLY_LIMIT) {
            return {
                valid: false,
                error: `Amount exceeds tier limit (${tierConfig.WEEKLY_LIMIT} CDF)`,
                max: tierConfig.WEEKLY_LIMIT
            };
        }
        
        return { valid: true, amount };
    }
};

// Export all utilities
export { currencyUtils, validateCountryOperation, validateHierarchy };