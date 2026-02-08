/**
 * M-Pesewa Uganda - Main Configuration File
 * Strict Country Isolation Configuration
 * Last Updated: 2026-01-24
 */

class UgandaConfig {
    constructor() {
        // Core country identification
        this.country = {
            code: 'UG',
            name: 'Uganda',
            fullName: 'Republic of Uganda',
            region: 'East Africa',
            capital: 'Kampala',
            timezone: 'EAT (UTC+3)',
            callingCode: '+256',
            isoCode: 'UG',
            flag: '🇺🇬'
        };

        // Currency configuration
        this.currency = {
            code: 'UGX',
            name: 'Uganda Shilling',
            symbol: 'USh',
            decimalPlaces: 0,
            format: 'USh {amount}',
            exchangeRates: {
                USD: 0.00027,
                KES: 0.045,
                TZS: 0.63,
                RWF: 0.32
            }
        };

        // Regulatory framework
        this.regulatory = {
            primaryRegulator: 'Bank of Uganda',
            licenseNumber: 'MFI/001/2024',
            regulatoryActs: [
                'Financial Institutions Act, 2004',
                'Microfinance Deposit-taking Institutions Act, 2003',
                'Consumer Protection Act, 2019',
                'Data Protection and Privacy Act, 2019'
            ],
            complianceRequirements: [
                'Monthly reporting to Bank of Uganda',
                'Annual audit by certified auditor',
                'AML/CFT compliance',
                'Consumer protection standards'
            ]
        };

        // Platform operational settings
        this.platform = {
            // Country isolation settings
            isolation: {
                enabled: true,
                strict: true,
                crossCountryAllowed: false,
                crossBorderTransactions: false,
                foreignAccounts: false
            },

            // Operational limits
            limits: {
                minLoanAmount: 1000, // UGX
                maxLoanAmount: {
                    basic: 1500000, // 1.5M UGX
                    premium: 5000000, // 5M UGX
                    super: 20000000 // 20M UGX
                },
                maxBorrowersPerLender: 50,
                maxGroupsPerUser: 4,
                maxMembersPerGroup: 1000,
                minMembersPerGroup: 5
            },

            // Interest and penalty rates
            rates: {
                interestRate: 0.10, // 10% per week
                penaltyRate: 0.05, // 5% daily after 7 days
                defaultPeriod: 60, // days until default
                gracePeriod: 7 // days before penalty
            },

            // Subscription tiers for Uganda
            subscriptions: {
                basic: {
                    name: 'Basic',
                    weeklyLimit: 1500000, // 1.5M UGX
                    monthlyFee: 20000, // 20K UGX
                    annualFee: 200000, // 200K UGX
                    features: ['Up to 10 ledgers', 'Basic reporting', 'Email support']
                },
                premium: {
                    name: 'Premium',
                    weeklyLimit: 5000000, // 5M UGX
                    monthlyFee: 100000, // 100K UGX
                    annualFee: 1000000, // 1M UGX
                    features: ['Up to 50 ledgers', 'Advanced analytics', 'Phone support', 'Priority access']
                },
                super: {
                    name: 'Super',
                    weeklyLimit: 20000000, // 20M UGX
                    monthlyFee: 400000, // 400K UGX
                    annualFee: 4000000, // 4M UGX
                    features: ['Unlimited ledgers', 'Dedicated account manager', '24/7 support', 'CRB integration']
                }
            }
        };

        // User registration requirements
        this.registration = {
            borrower: {
                required: [
                    'Full Name',
                    'National ID Number',
                    'Phone Number (Uganda)',
                    'Email Address',
                    'Physical Address in Uganda',
                    'Two Ugandan guarantors',
                    'Group invitation code'
                ],
                optional: ['Profile Picture', 'Employment Details', 'Monthly Income'],
                verification: ['ID Verification', 'Phone Verification', 'Address Verification']
            },
            lender: {
                required: [
                    'Full Name',
                    'National ID Number',
                    'Phone Number (Uganda)',
                    'Email Address',
                    'Physical Address in Uganda',
                    'Bank Account (Uganda)',
                    'Subscription Tier Selection',
                    'Lending Categories Selection'
                ],
                optional: ['Business Registration', 'Tax PIN', 'References'],
                verification: ['ID Verification', 'Bank Verification', 'Address Verification', 'AML Check']
            }
        };

        // Emergency categories specific to Uganda
        this.emergencyCategories = [
            {
                id: 'ug-fare',
                name: 'Boda Boda Fare',
                icon: '🏍️',
                description: 'Emergency transport money for boda boda rides',
                maxAmount: 50000,
                typicalUse: 'Transport to work, hospital, or market'
            },
            {
                id: 'ug-data',
                name: 'Mobile Data',
                icon: '📶',
                description: 'Emergency internet data bundles',
                maxAmount: 20000,
                typicalUse: 'Online work, communication, emergencies'
            },
            {
                id: 'ug-gas',
                name: 'Cooking Gas',
                icon: '🔥',
                description: 'Emergency gas refill for cooking',
                maxAmount: 80000,
                typicalUse: 'Family cooking needs'
            },
            {
                id: 'ug-school',
                name: 'School Fees',
                icon: '🎓',
                description: 'Emergency school fees payment',
                maxAmount: 500000,
                typicalUse: 'School fees, requirements, exams'
            },
            {
                id: 'ug-medical',
                name: 'Medical Emergency',
                icon: '🏥',
                description: 'Emergency medical expenses',
                maxAmount: 1000000,
                typicalUse: 'Hospital bills, medication, treatment'
            }
        ];

        // Uganda-specific groups configuration
        this.groups = {
            types: [
                {
                    name: 'Family Group',
                    code: 'FAMILY_UG',
                    description: 'Family members lending to each other',
                    requirements: ['Family verification', 'Minimum 5 family members']
                },
                {
                    name: 'Market Group',
                    code: 'MARKET_UG',
                    description: 'Market vendors and traders',
                    requirements: ['Business verification', 'Market location proof']
                },
                {
                    name: 'Church Group',
                    code: 'CHURCH_UG',
                    description: 'Church members support network',
                    requirements: ['Church membership', 'Pastor verification']
                },
                {
                    name: 'Boda Boda Group',
                    code: 'BODA_UG',
                    description: 'Motorcycle taxi riders network',
                    requirements: ['Rider permit', 'Stage verification']
                }
            ],
            rules: {
                creation: 'Invitation-only system',
                verification: 'All members must be verified Ugandan residents',
                isolation: 'No cross-group lending outside Uganda',
                limits: 'Maximum 1000 members per group'
            }
        };

        // Security and compliance
        this.security = {
            dataProtection: {
                law: 'Data Protection and Privacy Act, 2019',
                requirements: [
                    'User consent for data processing',
                    'Data localization in Uganda',
                    'Regular security audits',
                    'Breach notification within 72 hours'
                ]
            },
            kycRequirements: {
                individuals: ['National ID', 'Proof of Address', 'Photo'],
                businesses: ['Business Registration', 'Tax Certificate', 'Directors IDs']
            },
            amlCft: {
                required: true,
                threshold: 10000000, // 10M UGX
                reporting: 'Financial Intelligence Authority (FIA)',
                requirements: ['Customer due diligence', 'Transaction monitoring', 'Suspicious activity reporting']
            }
        };

        // Support and contact
        this.support = {
            channels: {
                phone: '+256 392 175 546',
                whatsapp: '+256 752 123 456',
                email: 'support.ug@m-pesewa.com',
                physical: 'Plot 23, Kampala Road, Kampala'
            },
            hours: {
                weekdays: '8:00 AM - 6:00 PM',
                saturday: '9:00 AM - 1:00 PM',
                sunday: 'Emergency Support Only'
            },
            languages: ['English', 'Swahili', 'Luganda']
        };
    }

    /**
     * Get complete configuration
     */
    getConfig() {
        return {
            country: this.country,
            currency: this.currency,
            regulatory: this.regulatory,
            platform: this.platform,
            registration: this.registration,
            emergencyCategories: this.emergencyCategories,
            groups: this.groups,
            security: this.security,
            support: this.support,
            validation: this.validateConfig(),
            hierarchy: this.getHierarchyEnforcement(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Validate Uganda configuration
     */
    validateConfig() {
        const validations = [];

        // Country isolation validation
        if (!this.platform.isolation.strict) {
            validations.push('Country isolation must be strict for Uganda');
        }
        if (this.platform.isolation.crossCountryAllowed) {
            validations.push('Cross-country transactions must be disabled for Uganda');
        }

        // Currency validation
        if (this.currency.code !== 'UGX') {
            validations.push('Currency must be UGX for Uganda');
        }

        // Regulatory validation
        if (!this.regulatory.primaryRegulator.includes('Bank of Uganda')) {
            validations.push('Primary regulator must be Bank of Uganda');
        }

        // Limits validation
        if (this.platform.limits.maxLoanAmount.basic > 1500000) {
            validations.push('Basic tier limit exceeds Uganda regulatory limits');
        }

        return {
            isValid: validations.length === 0,
            validations,
            passed: validations.length === 0,
            failedCount: validations.length
        };
    }

    /**
     * Get hierarchy enforcement for Uganda
     */
    getHierarchyEnforcement() {
        return {
            level1: 'Global Platform',
            level2: 'Uganda Country Instance',
            level3: 'Uganda-based Groups (Invitation-only)',
            level4: 'Uganda Lenders (Subscription-based)',
            level5: 'Uganda Borrowers (Group-based)',
            strictRules: [
                'NO CROSS-COUNTRY TRANSACTIONS',
                'Groups isolated within Uganda borders',
                'Lenders can only lend to Uganda group members',
                'Borrowers can only borrow from Uganda group lenders',
                'Currency locked to UGX',
                'All disputes resolved under Uganda law'
            ],
            penalties: [
                'Account suspension for cross-country attempts',
                'Blacklisting for regulatory violations',
                'Legal action for fraud attempts',
                'Permanent ban for repeated violations'
            ]
        };
    }

    /**
     * Get Uganda-specific validation rules
     */
    getValidationRules() {
        return {
            phoneNumber: {
                pattern: /^\+256[0-9]{9}$/,
                message: 'Must be a valid Uganda phone number (+256XXXXXXXXX)'
            },
            nationalID: {
                pattern: /^[A-Z0-9]{13,14}$/,
                message: 'Must be a valid Uganda National ID'
            },
            amount: {
                min: 1000,
                max: 20000000,
                message: 'Amount must be between UGX 1,000 and UGX 20,000,000'
            },
            location: {
                requiredRegions: [
                    'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Mbale', 'Gulu', 'Mbarara', 'Fort Portal'
                ],
                message: 'Must be located in Uganda'
            }
        };
    }

    /**
     * Initialize Uganda configuration
     */
    initialize() {
        console.log(`🇺🇬 Initializing M-Pesewa Uganda Configuration...`);
        
        const config = this.getConfig();
        const validation = this.validateConfig();
        
        if (!validation.isValid) {
            console.error('❌ Uganda configuration validation failed:', validation.validations);
            throw new Error('Uganda configuration validation failed');
        }
        
        console.log('✅ Uganda configuration validated successfully');
        console.log(`🌍 Country: ${config.country.name} (${config.country.code})`);
        console.log(`💰 Currency: ${config.currency.code} (${config.currency.name})`);
        console.log(`⚖️  Regulator: ${config.regulatory.primaryRegulator}`);
        console.log(`🔒 Isolation: ${config.platform.isolation.strict ? 'STRICT' : 'LOOSE'}`);
        
        return config;
    }
}

// Create and export Uganda configuration
const ugandaConfig = new UgandaConfig();
export default ugandaConfig;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ugandaConfig;
}