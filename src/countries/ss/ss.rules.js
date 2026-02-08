/**
 * SOUTH SUDAN (SS) - Country Rules Module
 * Strict country isolation with local regulations
 * Last Updated: 2024-01-24
 */

const SouthSudanRules = {
    // ============================================
    // 1️⃣ COUNTRY IDENTIFICATION & METADATA
    // ============================================
    country: {
        code: "SS",
        name: "South Sudan",
        formalName: "Republic of South Sudan",
        flag: "🇸🇸",
        region: "East Africa",
        capital: "Juba",
        timezone: "Africa/Juba",
        independenceDate: "2011-07-09",
        phoneCode: "+211",
        emergencyNumber: "112",
        governmentWebsite: "https://www.goss-online.org"
    },

    // ============================================
    // 2️⃣ CURRENCY & FINANCIAL CONFIGURATION
    // ============================================
    currency: {
        code: "SSP",
        name: "South Sudanese Pound",
        symbol: "£",
        decimalPlaces: 2,
        format: "£{amount}",
        
        // Exchange rates (as of 2024-01-24)
        exchangeRates: {
            USD: 1300.50,
            EUR: 1420.75,
            KES: 8.25,
            UGX: 0.35,
            TZS: 0.55,
            XAF: 2.10,
            XOF: 2.15
        },
        
        // Historical context
        history: [
            "2011: South Sudanese Pound introduced after independence",
            "2015: Currency devaluation due to economic crisis",
            "2018: New banknotes introduced (SSP 500, 1000)",
            "2020: Efforts to stabilize against USD"
        ]
    },

    // ============================================
    // 3️⃣ STRICT HIERARCHY ENFORCEMENT (NON-NEGOTIABLE)
    // ============================================
    hierarchy: {
        // LEVEL 1: GLOBAL CONTAINER
        global: {
            type: "platform",
            name: "M-Pesewa Global",
            description: "Parent container for all country instances",
            rules: [
                "No cross-country data access",
                "Global admin access only",
                "Country isolation is absolute"
            ]
        },

        // LEVEL 2: COUNTRY CONTAINER
        country: {
            type: "country",
            name: "South Sudan Container",
            description: "Primary container for all South Sudan operations",
            isolationRules: [
                "✅ All groups must be within South Sudan borders",
                "✅ All users must have South Sudanese identity verification",
                "✅ All transactions in SSP only",
                "❌ No cross-border lending/borrowing",
                "❌ No foreign currency transactions",
                "❌ No international group memberships"
            ]
        },

        // LEVEL 3: GROUPS WITHIN COUNTRY
        groups: {
            type: "trusted_circles",
            minMembers: 5,
            maxMembers: 1000,
            creationRules: [
                "Founder must be verified South Sudanese",
                "Group must have unique name within country",
                "Minimum 5 members to activate",
                "All members must be in same geographical region",
                "Group nickname must not violate cultural norms"
            ],
            
            types: {
                "family": "Family-based trust circles",
                "community": "Local community groups",
                "professional": "Professional associations",
                "religious": "Church/Mosque-based groups",
                "social": "Social welfare groups",
                "educational": "School/University groups",
                "business": "Business associations"
            }
        },

        // LEVEL 4: LENDERS WITHIN GROUPS
        lenders: {
            type: "money_providers",
            requirements: [
                "Active subscription required",
                "South Sudanese national ID verification",
                "Local bank account or mobile money",
                "Minimum age: 18 years",
                "Clean financial history"
            ],
            
            subscriptionExpiry: "28th of each month",
            
            limits: {
                basic: { maxPerWeek: 5000, currency: "SSP" },
                premium: { maxPerWeek: 20000, currency: "SSP" },
                super: { maxPerWeek: 50000, currency: "SSP" },
                lender_of_lenders: { maxPerWeek: 100000, currency: "SSP" }
            }
        },

        // LEVEL 5: LEDGERS WITHIN LENDERS
        ledgers: {
            type: "loan_records",
            generation: "automatic_on_approval",
            
            fields: [
                "borrower_name",
                "borrower_contact",
                "guarantor1_contact",
                "guarantor2_contact",
                "loan_category",
                "amount_borrowed_ssp",
                "date_borrowed",
                "due_date",
                "interest_10_percent",
                "daily_penalty_5_percent",
                "status_active_cleared",
                "amount_overdue"
            ],
            
            management: [
                "Updated manually by lender",
                "Admin override capability",
                "Unlimited ledgers per lender",
                "Each ledger tied to one borrower"
            ]
        },

        // LEVEL 6: BORROWERS (BASE STATE)
        borrowers: {
            type: "money_recipients",
            defaultState: "available",
            
            limits: [
                "Maximum 4 groups per borrower",
                "Good rating required for multiple groups",
                "No subscription fees",
                "Dual role allowed (borrower + lender)"
            ],
            
            blacklistConditions: [
                "Default after 2 months",
                "Cannot borrow when blacklisted",
                "Cannot join new groups",
                "Platform-wide visibility"
            ]
        }
    },

    // ============================================
    // 4️⃣ LEGAL & REGULATORY COMPLIANCE
    // ============================================
    legal: {
        // Financial Regulations
        regulatoryBodies: [
            "Bank of South Sudan (BoSS)",
            "Ministry of Finance & Economic Planning",
            "South Sudan Financial Intelligence Unit (SSFIU)"
        ],
        
        complianceRequirements: [
            "Anti-Money Laundering (AML) compliance",
            "Know Your Customer (KYC) verification",
            "Data Protection & Privacy laws",
            "Consumer Protection regulations",
            "Microfinance Institution guidelines"
        ],
        
        // Taxation
        taxation: {
            lenderIncome: "Subject to personal income tax",
            platformFees: "VAT exempt for financial services",
            transactionTax: "None for peer-to-peer lending"
        },
        
        // Legal Framework
        laws: [
            "Bank of South Sudan Act, 2011",
            "Anti-Money Laundering and Counter-Terrorism Financing Act, 2012",
            "National Payment System Act, 2014",
            "Consumer Protection Act, 2015"
        ]
    },

    // ============================================
    // 5️⃣ USER VERIFICATION REQUIREMENTS
    // ============================================
    verification: {
        // National ID Requirements
        nationalId: {
            type: "National Identification Number (NIN)",
            format: "SSP-XXXXXX-XXXX",
            issuingAuthority: "National Bureau of Statistics",
            verificationMethod: "Government API where available"
        },
        
        // Address Verification
        addressProof: [
            "Utility bill (Juba Electricity, water bill)",
            "Rental agreement",
            "Letter from local authority",
            "Bank statement"
        ],
        
        // Phone Verification
        phone: {
            carriers: ["Zain South Sudan", "MTN South Sudan", "Vivacell"],
            verification: "SMS OTP required",
            format: "+211 XXX XXX XXX"
        },
        
        // Referral System (Trust-First Model)
        referralRequirements: {
            numberOfReferrers: 2,
            relationship: "Must know applicant personally",
            verification: "Phone call confirmation",
            groupMembership: "Must be in same group"
        }
    },

    // ============================================
    // 6️⃣ LENDING & BORROWING RULES (STRICT)
    // ============================================
    lendingRules: {
        // Loan Terms
        terms: {
            maxDuration: 7, // days
            interestRate: 10, // percentage
            minLoanAmount: 100, // SSP
            maxLoanAmount: {
                basic: 5000,
                premium: 20000,
                super: 50000,
                lender_of_lenders: 100000
            },
            
            // Partial Repayment
            partialRepayments: true,
            minPartialAmount: 100, // SSP
            partialPaymentDeadline: "Daily"
        },
        
        // Penalties & Defaults
        penalties: {
            after7Days: {
                dailyPenalty: 5, // percentage
                calculation: "On outstanding balance",
                maxPenaltyCap: "100% of principal"
            },
            
            default: {
                timeframe: "60 days",
                action: "Blacklist automatically",
                recovery: "Debt collectors list provided"
            }
        },
        
        // Group-Specific Rules
        groupLending: {
            rule: "Lenders can only lend within their group",
            exceptions: "None",
            enforcement: "System enforced at transaction level"
        }
    },

    // ============================================
    // 7️⃣ SUBSCRIPTION TIERS (LENDERS ONLY)
    // ============================================
    subscriptions: {
        tiers: {
            basic: {
                name: "Basic Tier",
                weeklyLimit: 5000,
                monthlyFee: 50, // SSP
                biAnnualFee: 250,
                annualFee: 500,
                features: [
                    "Up to 5,000 SSP per week",
                    "Unlimited ledgers",
                    "No CRB check required",
                    "Basic reporting"
                ],
                target: "Individual lenders starting out"
            },
            
            premium: {
                name: "Premium Tier",
                weeklyLimit: 20000,
                monthlyFee: 250,
                biAnnualFee: 1500,
                annualFee: 2500,
                features: [
                    "Up to 20,000 SSP per week",
                    "Advanced portfolio management",
                    "Risk assessment tools",
                    "Priority support"
                ],
                target: "Professional lenders"
            },
            
            super: {
                name: "Super Tier",
                weeklyLimit: 50000,
                monthlyFee: 1000,
                biAnnualFee: 5000,
                annualFee: 8500,
                features: [
                    "Up to 50,000 SSP per week",
                    "CRB check included",
                    "Bulk lending tools",
                    "Dedicated account manager"
                ],
                target: "Institutional lenders"
            },
            
            lender_of_lenders: {
                name: "Lender of Lenders",
                weeklyLimit: 100000,
                monthlyFee: 500,
                biAnnualFee: 3500,
                annualFee: 6500,
                features: [
                    "Up to 100,000 SSP per week",
                    "Custom interest rates",
                    "Minimum 1-month repayment period",
                    "Wholesale lending capabilities"
                ],
                target: "Large-scale investors"
            }
        },
        
        // Payment Methods
        paymentMethods: [
            "Mobile Money (Zain Cash, MTN Money)",
            "Bank Transfer",
            "Agent Banking",
            "Direct Deposit"
        ],
        
        // Expiry & Renewal
        expiry: {
            dayOfMonth: 28,
            gracePeriod: 3, // days
            autoRenewal: false,
            renewalNotice: "7 days before expiry"
        }
    },

    // ============================================
    // 8️⃣ REPUTATION & BLACKLIST SYSTEM
    // ============================================
    reputation: {
        // Rating System
        rating: {
            scale: "5-star system",
            criteria: [
                "Timely repayment",
                "Communication",
                "Loan purpose honesty",
                "Group contribution"
            ],
            
            thresholds: {
                excellent: "4.5+ stars",
                good: "3.5-4.5 stars",
                fair: "2.5-3.5 stars",
                poor: "Below 2.5 stars"
            }
        },
        
        // Blacklist Management
        blacklist: {
            trigger: "60 days overdue",
            visibility: "Platform-wide badge",
            restrictions: [
                "Cannot borrow",
                "Cannot join new groups",
                "Visible to all lenders"
            ],
            
            removal: {
                onlyBy: "Platform Admin",
                conditions: [
                    "Full repayment (principal + interest + penalties)",
                    "Admin review and approval",
                    "Waiting period: 30 days"
                ]
            }
        }
    },

    // ============================================
    // 9️⃣ GEOGRAPHICAL RESTRICTIONS
    // ============================================
    geography: {
        // States of South Sudan
        states: [
            "Central Equatoria",
            "Eastern Equatoria",
            "Jonglei",
            "Lakes",
            "Northern Bahr el Ghazal",
            "Unity",
            "Upper Nile",
            "Warrap",
            "Western Bahr el Ghazal",
            "Western Equatoria"
        ],
        
        // Major Cities
        majorCities: [
            "Juba",
            "Wau",
            "Malakal",
            "Yambio",
            "Bor",
            "Rumbek",
            "Aweil",
            "Yei",
            "Torit"
        ],
        
        // Regional Restrictions
        regionalRules: {
            "Equatoria Region": "Stable, full operations",
            "Greater Upper Nile": "Restricted areas apply",
            "Bahr el Ghazal": "Full operations with verification"
        }
    },

    // ============================================
    // 🔟 CULTURAL & SOCIAL CONSIDERATIONS
    // ============================================
    cultural: {
        // Languages
        languages: {
            primary: "English",
            secondary: ["Arabic", "Dinka", "Nuer", "Bari", "Zande"],
            platformLanguage: "English"
        },
        
        // Social Norms
        socialNorms: [
            "Respect for elders in groups",
            "Community-based decision making",
            "Oral agreements hold weight",
            "Family networks important"
        ],
        
        // Religious Considerations
        religions: {
            christianity: "Majority",
            islam: "Significant minority",
            traditional: "Various ethnic religions"
        },
        
        // Holidays (No operations)
        nationalHolidays: [
            "01-01: New Year's Day",
            "01-09: Peace Agreement Day",
            "05-16: SPLA Day",
            "07-09: Independence Day",
            "12-25: Christmas Day"
        ]
    },

    // ============================================
    // 1️⃣1️⃣ CONTACT & SUPPORT INFORMATION
    // ============================================
    contact: {
        // Platform Contacts
        platform: {
            phone: "+211 955 000 000",
            email: "southsudan@m-pesewa.com",
            address: "Plot No. 12, Ministries Road, Juba, South Sudan",
            workingHours: "Mon-Fri 8:00 AM - 5:00 PM (CAT)",
            emergencySupport: "24/7 for active loans"
        },
        
        // Regulatory Contacts
        regulatory: {
            bankOfSouthSudan: "+211 912 345 678",
            ministryOfFinance: "+211 913 456 789",
            financialIntelligenceUnit: "+211 914 567 890"
        },
        
        // Debt Collectors (Vetted List - First 5)
        debtCollectors: [
            {
                name: "South Sudan Recovery Services",
                phone: "+211 977 123 456",
                email: "recovery@ssrs.com",
                location: "Juba",
                license: "FIU-2023-001"
            },
            {
                name: "Nile Basin Collections",
                phone: "+211 978 234 567",
                email: "collections@nilebasin.com",
                location: "Wau",
                license: "FIU-2023-002"
            }
        ]
    },

    // ============================================
    // 1️⃣2️⃣ DATA & PRIVACY RULES
    // ============================================
    dataPrivacy: {
        // Data Storage
        storage: {
            location: "Within South Sudan borders",
            backup: "Daily to Juba data center",
            retentionPeriod: "7 years as per BoSS regulations"
        },
        
        // User Data Rights
        userRights: [
            "Right to access personal data",
            "Right to correction",
            "Right to data portability",
            "Right to deletion (with limitations)"
        ],
        
        // Data Sharing
        sharingRules: {
            withinGroup: "Limited profile visible",
            withinPlatform: "Reputation scores only",
            withThirdParties: "Only with user consent",
            withAuthorities: "As required by law"
        }
    },

    // ============================================
    // 1️⃣3️⃣ VALIDATION FUNCTIONS
    // ============================================
    validators: {
        // National ID Validator
        validateNationalId: function(id) {
            const pattern = /^SSP-\d{6}-\d{4}$/;
            if (!pattern.test(id)) {
                return {
                    valid: false,
                    error: "Invalid format. Use: SSP-123456-7890"
                };
            }
            
            // Extract and validate parts
            const parts = id.split('-');
            const sequence = parts[1];
            const checksum = parts[2];
            
            // Simple checksum validation
            const sum = sequence.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
            const calculatedChecksum = (sum % 10000).toString().padStart(4, '0');
            
            return {
                valid: calculatedChecksum === checksum,
                error: calculatedChecksum === checksum ? null : "Invalid checksum"
            };
        },
        
        // Phone Number Validator
        validatePhone: function(phone) {
            const pattern = /^\+211\s?\d{3}\s?\d{3}\s?\d{3}$/;
            const cleaned = phone.replace(/\s/g, '');
            
            if (!pattern.test(phone)) {
                return {
                    valid: false,
                    error: "Invalid format. Use: +211 XXX XXX XXX"
                };
            }
            
            // Check carrier prefix
            const prefix = cleaned.substring(4, 7);
            const validPrefixes = ['955', '956', '957', '958', '959', '977', '978', '979'];
            
            return {
                valid: validPrefixes.includes(prefix),
                error: validPrefixes.includes(prefix) ? null : "Invalid carrier prefix"
            };
        },
        
        // Loan Amount Validator
        validateLoanAmount: function(amount, subscriptionTier) {
            const limits = this.lendingRules.terms.maxLoanAmount;
            
            if (amount < this.lendingRules.terms.minLoanAmount) {
                return {
                    valid: false,
                    error: `Minimum loan amount is ${this.lendingRules.terms.minLoanAmount} SSP`
                };
            }
            
            if (!limits[subscriptionTier]) {
                return {
                    valid: false,
                    error: `Invalid subscription tier: ${subscriptionTier}`
                };
            }
            
            if (amount > limits[subscriptionTier]) {
                return {
                    valid: false,
                    error: `Maximum loan amount for ${subscriptionTier} tier is ${limits[subscriptionTier]} SSP`
                };
            }
            
            return {
                valid: true,
                error: null
            };
        },
        
        // Group Size Validator
        validateGroupSize: function(currentSize, action) {
            if (action === 'add' && currentSize >= this.hierarchy.groups.maxMembers) {
                return {
                    valid: false,
                    error: `Group has reached maximum size of ${this.hierarchy.groups.maxMembers} members`
                };
            }
            
            if (action === 'create' && currentSize < this.hierarchy.groups.minMembers) {
                return {
                    valid: false,
                    error: `Group must have at least ${this.hierarchy.groups.minMembers} members`
                };
            }
            
            return {
                valid: true,
                error: null
            };
        }
    },

    // ============================================
    // 1️⃣4️⃣ ERROR CODES & MESSAGES
    // ============================================
    errorCodes: {
        // Country Isolation Errors
        SS001: "Cross-country transaction attempt detected",
        SS002: "Foreign currency not allowed",
        SS003: "Non-South Sudanese user registration attempt",
        
        // Hierarchy Validation Errors
        SS101: "Group size exceeds maximum limit",
        SS102: "Group size below minimum requirement",
        SS103: "User already in maximum number of groups",
        SS104: "Lender attempting to lend outside group",
        
        // Subscription Errors
        SS201: "Subscription expired",
        SS202: "Loan amount exceeds subscription limit",
        SS203: "Payment method not available in South Sudan",
        
        // Legal & Compliance Errors
        SS301: "KYC verification incomplete",
        SS302: "AML check failed",
        SS303: "User under legal age",
        
        // Geographical Errors
        SS401: "Operation not allowed in restricted region",
        SS402: "User location verification failed",
        
        // System Errors
        SS901: "Currency conversion error",
        SS902: "Data storage compliance violation",
        SS903: "Regulatory reporting failure"
    },

    // ============================================
    // 1️⃣5️⃣ AUDIT LOGGING CONFIGURATION
    // ============================================
    audit: {
        // What to log
        logEvents: [
            "user_registration",
            "loan_application",
            "loan_approval",
            "repayment",
            "default",
            "blacklist_action",
            "subscription_payment",
            "group_creation",
            "admin_override"
        ],
        
        // Retention
        retentionPeriod: "7 years",
        
        // Regulatory Reporting
        reports: [
            {
                name: "Monthly Transaction Report",
                frequency: "monthly",
                recipient: "Bank of South Sudan",
                deadline: "5th of following month"
            },
            {
                name: "AML Suspicious Activity Report",
                frequency: "as_required",
                recipient: "South Sudan FIU",
                deadline: "24 hours"
            }
        ]
    },

    // ============================================
    // 1️⃣6️⃣ MIGRATION & UPGRADE RULES
    // ============================================
    migration: {
        // User Migration Rules
        userMigration: {
            allowed: false, // No migration between countries
            exception: "Only with regulatory approval"
        },
        
        // Data Migration
        dataMigration: {
            backupBefore: true,
            validateAfter: true,
            regulatoryNotification: true
        },
        
        // Version Upgrades
        versionUpgrade: {
            notificationPeriod: "30 days",
            rollbackWindow: "7 days",
            complianceCheck: "Required before deployment"
        }
    },

    // ============================================
    // 1️⃣7️⃣ HELPER FUNCTIONS
    // ============================================
    helpers: {
        // Calculate Interest
        calculateInterest: function(principal, days = 7) {
            const dailyRate = this.lendingRules.terms.interestRate / 100 / 7;
            const interest = principal * dailyRate * days;
            return Math.round(interest * 100) / 100; // Round to 2 decimal places
        },
        
        // Calculate Penalty
        calculatePenalty: function(principal, overdueDays) {
            if (overdueDays <= 7) return 0;
            
            const penaltyDays = overdueDays - 7;
            const dailyPenaltyRate = this.lendingRules.penalties.after7Days.dailyPenalty / 100;
            
            // Simple penalty calculation
            const penalty = principal * dailyPenaltyRate * penaltyDays;
            
            // Cap at 100% of principal
            return Math.min(penalty, principal);
        },
        
        // Format Currency
        formatCurrency: function(amount) {
            return this.currency.format.replace('{amount}', amount.toLocaleString('en-US', {
                minimumFractionDigits: this.currency.decimalPlaces,
                maximumFractionDigits: this.currency.decimalPlaces
            }));
        },
        
        // Get Subscription Tier Info
        getSubscriptionTier: function(tierName) {
            return this.subscriptions.tiers[tierName] || null;
        },
        
        // Validate User for Lending
        validateLender: function(userData) {
            const errors = [];
            
            // Check subscription
            if (!userData.subscription || userData.subscription.status !== 'active') {
                errors.push("Active subscription required");
            }
            
            // Check verification
            if (!userData.verified || userData.verificationStatus !== 'complete') {
                errors.push("KYC verification incomplete");
            }
            
            // Check group membership
            if (!userData.groups || userData.groups.length === 0) {
                errors.push("Must be member of at least one group");
            }
            
            return {
                valid: errors.length === 0,
                errors: errors
            };
        }
    },

    // ============================================
    // 1️⃣8️⃣ EXPORT CONFIGURATION
    // ============================================
    exportConfig: {
        // Data Export Rules
        dataExport: {
            allowed: true,
            format: "JSON",
            encryption: "Required",
            includes: ["user_data", "transaction_history", "reputation_scores"],
            excludes: ["password_hashes", "security_questions"]
        },
        
        // Regulatory Export
        regulatoryExport: {
            format: "PDF",
            frequency: "monthly",
            recipients: ["bank_of_south_sudan", "ministry_of_finance"]
        }
    },

    // ============================================
    // 1️⃣9️⃣ INITIALIZATION FUNCTION
    // ============================================
    init: function() {
        console.log(`🇸🇸 Initializing South Sudan rules module...`);
        
        // Validate configuration
        const validationErrors = this.validateConfiguration();
        
        if (validationErrors.length > 0) {
            console.error("Configuration validation failed:", validationErrors);
            throw new Error("South Sudan configuration validation failed");
        }
        
        // Set up currency formatting
        this.setupCurrencyFormatting();
        
        // Initialize validators
        this.setupValidators();
        
        console.log(`✅ South Sudan rules module initialized successfully`);
        console.log(`   Currency: ${this.currency.code} (${this.currency.name})`);
        console.log(`   Phone Code: ${this.phoneCode}`);
        console.log(`   Timezone: ${this.timezone}`);
        
        return this;
    },

    // ============================================
    // 2️⃣0️⃣ CONFIGURATION VALIDATION
    // ============================================
    validateConfiguration: function() {
        const errors = [];
        
        // Validate currency configuration
        if (!this.currency.code || !this.currency.symbol) {
            errors.push("Currency configuration incomplete");
        }
        
        // Validate hierarchy rules
        if (this.hierarchy.groups.minMembers <= 0) {
            errors.push("Minimum group members must be positive");
        }
        
        if (this.hierarchy.groups.maxMembers <= this.hierarchy.groups.minMembers) {
            errors.push("Maximum group members must be greater than minimum");
        }
        
        // Validate subscription tiers
        const tiers = Object.keys(this.subscriptions.tiers);
        if (tiers.length === 0) {
            errors.push("No subscription tiers defined");
        }
        
        // Validate error codes
        const errorCodes = Object.keys(this.errorCodes);
        if (errorCodes.length === 0) {
            errors.push("No error codes defined");
        }
        
        return errors;
    },

    setupCurrencyFormatting: function() {
        // Add currency formatting utilities
        Intl.NumberFormat.prototype.formatSSP = function(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'SSP',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        };
    },

    setupValidators: function() {
        // Bind validator functions to maintain context
        this.validators.validateLoanAmount = this.validators.validateLoanAmount.bind(this);
        this.validators.validateGroupSize = this.validators.validateGroupSize.bind(this);
        this.helpers.calculateInterest = this.helpers.calculateInterest.bind(this);
        this.helpers.calculatePenalty = this.helpers.calculatePenalty.bind(this);
    },

    // ============================================
    // 2️⃣1️⃣ VERSION CONTROL
    // ============================================
    version: {
        major: 1,
        minor: 0,
        patch: 0,
        releaseDate: "2024-01-24",
        changelog: [
            "1.0.0 (2024-01-24): Initial South Sudan rules module",
            "Features: Full hierarchy enforcement, currency rules, legal compliance"
        ]
    },

    // ============================================
    // 2️⃣2️⃣ COMPATIBILITY MATRIX
    // ============================================
    compatibility: {
        platformVersion: ">=2.0.0",
        apiVersion: "v2",
        databaseSchema: "schema_v3",
        supportedBrowsers: ["Chrome 80+", "Firefox 75+", "Safari 13+"]
    },

    // ============================================
    // 2️⃣3️⃣ DEPRECATION WARNINGS
    // ============================================
    deprecated: {
        features: [],
        warnings: []
    },

    // ============================================
    // 2️⃣4️⃣ SECURITY CONFIGURATION
    // ============================================
    security: {
        // Encryption Standards
        encryption: {
            algorithm: "AES-256-GCM",
            keyRotation: "90 days",
            dataAtRest: "Encrypted",
            dataInTransit: "TLS 1.3"
        },
        
        // Authentication
        authentication: {
            passwordRequirements: {
                minLength: 8,
                maxLength: 12,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSymbols: true
            },
            mfa: "Optional",
            sessionTimeout: "30 minutes"
        },
        
        // API Security
        apiSecurity: {
            rateLimiting: "100 requests/minute per IP",
            ipWhitelisting: "Required for admin access",
            corsOrigins: ["https://m-pesewa.com", "https://*.m-pesewa.com"]
        }
    },

    // ============================================
    // 2️⃣5️⃣ PERFORMANCE CONFIGURATION
    // ============================================
    performance: {
        // Timeouts
        timeouts: {
            apiResponse: "30 seconds",
            databaseQuery: "10 seconds",
            paymentProcessing: "60 seconds"
        },
        
        // Caching
        caching: {
            enabled: true,
            duration: "5 minutes",
            invalidateOn: ["user_update", "transaction_complete"]
        },
        
        // Batch Operations
        batchLimits: {
            maxUsersPerRequest: 100,
            maxTransactionsPerRequest: 50,
            maxGroupsPerRequest: 20
        }
    },

    // ============================================
    // 2️⃣6️⃣ EMERGENCY PROCEDURES
    // ============================================
    emergency: {
        // Service Disruption
        serviceDisruption: {
            notification: "Within 15 minutes",
            backupSystem: "Available within 1 hour",
            dataRecovery: "Maximum 4 hours"
        },
        
        // Security Breach
        securityBreach: {
            notification: "Immediate to authorities",
            userNotification: "Within 24 hours",
            forensicAnalysis: "Required"
        },
        
        // Regulatory Emergency
        regulatoryEmergency: {
            contact: "Bank of South Sudan Emergency Desk",
            phone: "+211 915 000 000",
            email: "emergency@boss.gov.ss"
        }
    },

    // ============================================
    // 2️⃣7️⃣ MONITORING & ALERTING
    // ============================================
    monitoring: {
        // System Health
        healthChecks: [
            {
                name: "Database Connectivity",
                frequency: "1 minute",
                threshold: "95% uptime"
            },
            {
                name: "Payment Gateway",
                frequency: "5 minutes",
                threshold: "99% success rate"
            }
        ],
        
        // Business Metrics
        businessMetrics: [
            "daily_active_users",
            "loan_approval_rate",
            "default_rate",
            "revenue_generated"
        ],
        
        // Alert Channels
        alertChannels: [
            "email: alerts@m-pesewa.com",
            "sms: +211 955 000 001",
            "slack: #south-sudan-alerts"
        ]
    },

    // ============================================
    // 2️⃣8️⃣ BACKUP & RECOVERY
    // ============================================
    backup: {
        // Backup Schedule
        schedule: {
            incremental: "Every 6 hours",
            full: "Daily at 2:00 AM",
            retention: "30 days"
        },
        
        // Recovery Procedures
        recovery: {
            rto: "4 hours", // Recovery Time Objective
            rpo: "1 hour",  // Recovery Point Objective
            priority: ["user_data", "transaction_logs", "reputation_scores"]
        },
        
        // Backup Locations
        locations: [
            {
                name: "Primary Data Center",
                location: "Juba, South Sudan",
                type: "On-premise"
            },
            {
                name: "Secondary Data Center",
                location: "Nairobi, Kenya",
                type: "Cloud"
            }
        ]
    },

    // ============================================
    // 2️⃣9️⃣ TESTING CONFIGURATION
    // ============================================
    testing: {
        // Test Data
        testData: {
            allowed: true,
            environments: ["development", "staging"],
            cleanup: "Automatic after 7 days"
        },
        
        // Integration Tests
        integrationTests: [
            "currency_conversion",
            "loan_calculation",
            "subscription_validation",
            "hierarchy_enforcement"
        ],
        
        // Performance Tests
        performanceTests: {
            load: "1000 concurrent users",
            stress: "5000 concurrent transactions",
            endurance: "72 hours continuous operation"
        }
    },

    // ============================================
    // 3️⃣0️⃣ FINAL EXPORT
    // ============================================
    // Module Export
    getRules: function() {
        return {
            country: this.country,
            currency: this.currency,
            hierarchy: this.hierarchy,
            legal: this.legal,
            verification: this.verification,
            lendingRules: this.lendingRules,
            subscriptions: this.subscriptions,
            reputation: this.reputation,
            geography: this.geography,
            cultural: this.cultural,
            contact: this.contact,
            dataPrivacy: this.dataPrivacy,
            errorCodes: this.errorCodes
        };
    },

    getValidators: function() {
        return this.validators;
    },

    getHelpers: function() {
        return this.helpers;
    },

    getErrorDescription: function(errorCode) {
        return this.errorCodes[errorCode] || "Unknown error code";
    },

    // ============================================
    // 3️⃣1️⃣ COMPLIANCE CHECKER
    // ============================================
    checkCompliance: function(operation, userData) {
        const complianceErrors = [];
        
        switch(operation) {
            case 'user_registration':
                // Check age
                if (userData.age < 18) {
                    complianceErrors.push("User must be 18 years or older");
                }
                
                // Check nationality
                if (userData.nationality !== 'South Sudanese') {
                    complianceErrors.push("Only South Sudanese nationals can register");
                }
                break;
                
            case 'loan_application':
                // Check amount limits
                const amountCheck = this.validators.validateLoanAmount(
                    userData.amount, 
                    userData.subscriptionTier
                );
                if (!amountCheck.valid) {
                    complianceErrors.push(amountCheck.error);
                }
                break;
                
            case 'cross_country_check':
                if (userData.country !== 'SS') {
                    complianceErrors.push("Cross-country operations not allowed");
                }
                break;
        }
        
        return {
            compliant: complianceErrors.length === 0,
            errors: complianceErrors
        };
    }
};

// Auto-initialize on import
SouthSudanRules.init();

// Export as ES6 module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SouthSudanRules;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        return SouthSudanRules;
    });
} else {
    window.SouthSudanRules = SouthSudanRules;
}

// Log initialization completion
console.log(`🇸🇸 South Sudan Rules Module v${SouthSudanRules.version.major}.${SouthSudanRules.version.minor}.${SouthSudanRules.version.patch} loaded`);