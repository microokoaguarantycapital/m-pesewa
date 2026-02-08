/**
 * Tanzania (TZ) Configuration for M-Pesewa
 * Country Code: TZ
 * Currency: TZS (Tanzanian Shilling)
 * Legal Jurisdiction: United Republic of Tanzania
 */

const tzConfig = {
    // ============================================
    // 1. COUNTRY IDENTIFICATION
    // ============================================
    country: {
        code: 'TZ',
        name: 'Tanzania',
        fullName: 'United Republic of Tanzania',
        region: 'East Africa',
        capital: 'Dodoma',
        timezone: 'Africa/Dar_es_Salaam',
        phoneCode: '+255',
        isoCode: 'TZA',
        population: '61.7 million',
        officialLanguage: 'Swahili, English',
        flagEmoji: '🇹🇿'
    },

    // ============================================
    // 2. FINANCIAL & LEGAL CONFIGURATION
    // ============================================
    financial: {
        currency: {
            code: 'TZS',
            symbol: 'TSh',
            name: 'Tanzanian Shilling',
            decimalPlaces: 0,
            format: 'TSh {amount}',
            exchangeRate: {
                USD: 0.00043,
                KES: 0.065,
                UGX: 1.52,
                RWF: 0.53
            }
        },
        
        regulatory: {
            financialAuthority: 'Bank of Tanzania (BoT)',
            licenseRequired: true,
            regulatoryCompliance: {
                antiMoneyLaundering: true,
                knowYourCustomer: true,
                dataProtection: 'Personal Data Protection Act, 2022',
                lendingRegulations: 'Banking and Financial Institutions Act, 2006'
            },
            tax: {
                vatRate: 0.18,
                withholdingTax: 0.10,
                corporateTax: 0.30
            }
        }
    },

    // ============================================
    // 3. PLATFORM OPERATIONAL RULES
    // ============================================
    platform: {
        // Strict Country Isolation
        isolation: {
            enabled: true,
            rules: [
                'NO_CROSS_COUNTRY_LENDING',
                'NO_CROSS_COUNTRY_BORROWING',
                'NO_FOREIGN_CURRENCY_TRANSACTIONS',
                'LOCAL_GROUPS_ONLY'
            ]
        },

        // Group Configuration
        groups: {
            minMembers: 5,
            maxMembers: 1000,
            maxGroupsPerUser: 4,
            invitationOnly: true,
            referralRequired: true,
            countryLocked: true,
            
            types: {
                allowed: [
                    'Family Group',
                    'Church Group',
                    'Professional Group',
                    'Business Group',
                    'Social Group',
                    'Neighborhood Group',
                    'Association Group'
                ],
                prohibited: [
                    'Political Groups',
                    'Illegal Associations',
                    'Unregistered Cooperatives'
                ]
            }
        },

        // Lender Rules
        lenders: {
            subscriptionRequired: true,
            subscriptionTiers: {
                basic: {
                    maxWeekly: 1500,
                    subscriptionFee: {
                        monthly: 50,
                        biAnnual: 250,
                        annual: 500
                    }
                },
                premium: {
                    maxWeekly: 5000,
                    subscriptionFee: {
                        monthly: 250,
                        biAnnual: 1500,
                        annual: 2500
                    }
                },
                super: {
                    maxWeekly: 20000,
                    subscriptionFee: {
                        monthly: 1000,
                        biAnnual: 5000,
                        annual: 8500
                    },
                    crbCheckRequired: true
                }
            },
            
            requirements: {
                minimumAge: 18,
                nationalIdRequired: true,
                taxPinRequired: true,
                bankAccountRequired: false,
                mobileMoneyRequired: true
            }
        },

        // Borrower Rules
        borrowers: {
            subscriptionRequired: false,
            requirements: {
                minimumAge: 18,
                nationalIdRequired: true,
                mobileNumberVerified: true,
                maxActiveLoans: 1,
                maxGroups: 4
            },
            
            loanTerms: {
                maxDuration: 7, // days
                interestRate: 0.10, // 10%
                penaltyRate: 0.05, // 5% daily after due date
                minLoanAmount: 1000, // TZS
                repaymentOptions: ['Daily', 'Weekly', 'Lump Sum']
            }
        },

        // Emergency Categories (Tanzania Specific)
        emergencyCategories: [
            {
                id: 'fare',
                name: 'M-pesewa Fare',
                icon: '🚌',
                description: 'Transport fare for daily commute or emergency travel',
                maxAmount: 50000,
                typicalAmount: 5000
            },
            {
                id: 'data',
                name: 'M-pesewa Data',
                icon: '📶',
                description: 'Mobile data bundles for work or communication',
                maxAmount: 20000,
                typicalAmount: 5000
            },
            {
                id: 'gas',
                name: 'M-pesewa Cooking Gas',
                icon: '🔥',
                description: 'LPG gas for cooking emergencies',
                maxAmount: 80000,
                typicalAmount: 30000
            },
            {
                id: 'food',
                name: 'M-pesewa Food',
                icon: '🍲',
                description: 'Emergency food supplies',
                maxAmount: 50000,
                typicalAmount: 15000
            },
            {
                id: 'electricity',
                name: 'M-pesewa Electricity',
                icon: '⚡',
                description: 'Emergency electricity token purchase',
                maxAmount: 100000,
                typicalAmount: 20000
            },
            {
                id: 'medicine',
                name: 'M-pesewa Medicine',
                icon: '💊',
                description: 'Emergency medical expenses',
                maxAmount: 200000,
                typicalAmount: 50000
            }
        ]
    },

    // ============================================
    // 4. PAYMENT & TRANSACTION CONFIGURATION
    // ============================================
    payments: {
        // Mobile Money Providers
        mobileMoney: {
            providers: [
                {
                    name: 'M-Pesa',
                    code: 'MPESA',
                    supported: true,
                    charges: {
                        sending: 0.01,
                        receiving: 0,
                        maxPerTransaction: 3000000,
                        minPerTransaction: 100
                    }
                },
                {
                    name: 'Tigo Pesa',
                    code: 'TIGO',
                    supported: true,
                    charges: {
                        sending: 0.015,
                        receiving: 0,
                        maxPerTransaction: 3000000,
                        minPerTransaction: 100
                    }
                },
                {
                    name: 'Airtel Money',
                    code: 'AIRTEL',
                    supported: true,
                    charges: {
                        sending: 0.012,
                        receiving: 0,
                        maxPerTransaction: 3000000,
                        minPerTransaction: 100
                    }
                },
                {
                    name: 'Halopesa',
                    code: 'HALO',
                    supported: true,
                    charges: {
                        sending: 0.01,
                        receiving: 0,
                        maxPerTransaction: 3000000,
                        minPerTransaction: 100
                    }
                }
            ],
            
            limits: {
                dailyLimit: 3000000,
                monthlyLimit: 10000000,
                transactionLimit: 1000000
            }
        },

        // Bank Transfer Options
        banks: {
            supported: false, // Currently mobile money only
            futureSupport: true,
            plannedBanks: [
                'CRDB Bank',
                'NMB Bank',
                'Stanbic Bank',
                'Standard Chartered',
                'Exim Bank'
            ]
        }
    },

    // ============================================
    // 5. LEGAL & COMPLIANCE SETTINGS
    // ============================================
    legal: {
        governingLaw: 'Laws of the United Republic of Tanzania',
        disputeResolution: 'Tanzania Arbitration Centre',
        
        requiredDisclosures: [
            'Platform is not a financial institution',
            'All loans are peer-to-peer agreements',
            'Platform does not hold user funds',
            'Users transact at their own risk',
            'Compliance with BoT regulations'
        ],
        
        userAgreement: {
            version: '2.1',
            effectiveDate: '2024-01-01',
            requiredConsents: [
                'DATA_SHARING_WITHIN_GROUP',
                'CREDIT_REFERENCE_BUREAU_CHECK',
                'EMERGENCY_CONTACT_VERIFICATION',
                'IDENTITY_VERIFICATION'
            ]
        }
    },

    // ============================================
    // 6. REGIONAL SPECIFIC SETTINGS
    // ============================================
    regional: {
        regions: [
            'Dar es Salaam',
            'Mwanza',
            'Arusha',
            'Dodoma',
            'Mbeya',
            'Morogoro',
            'Tanga',
            'Kagera',
            'Mtwara',
            'Kigoma'
        ],
        
        localLanguages: [
            'Swahili',
            'English',
            'Sukuma',
            'Chaga',
            'Haya',
            'Nyamwezi',
            'Makonde',
            'Ha',
            'Nyakyusa'
        ],
        
        culturalConsiderations: {
            communityFirst: true,
            familyStructure: 'Extended family important',
            savingGroups: 'Vikoba and Upatu common',
            trustMechanisms: 'Face-to-face verification preferred'
        }
    },

    // ============================================
    // 7. PLATFORM INTEGRATION POINTS
    // ============================================
    integration: {
        apis: {
            mobileMoneyApis: {
                mpesa: 'https://sandbox.safaricom.co.ke',
                tigopesa: 'https://api.tigo.com/v1',
                airtel: 'https://openapi.airtel.africa'
            },
            
            verificationApis: {
                nationalId: 'https://api.nida.go.tz/v1',
                crb: 'https://api.crbtz.go.tz/v1'
            }
        },
        
        webhooks: {
            paymentConfirmation: '/webhooks/tz/payment',
            subscriptionRenewal: '/webhooks/tz/subscription',
            defaultAlert: '/webhooks/tz/default'
        }
    },

    // ============================================
    // 8. SUPPORT & CONTACT INFORMATION
    // ============================================
    support: {
        contact: {
            phone: '+255 659 073 010',
            email: 'support.tz@mpesewa.com',
            whatsapp: '+255 659 073 010',
            telegram: '@mpesewa_tz',
            
            operatingHours: {
                weekdays: '8:00 AM - 6:00 PM',
                saturday: '9:00 AM - 1:00 PM',
                sunday: 'Closed',
                holidays: 'Limited Support'
            }
        },
        
        locations: {
            headOffice: {
                address: 'M-Pesewa Tanzania, Ohio Street, Dar es Salaam',
                coordinates: '-6.7924, 39.2083'
            },
            regionalOffices: [
                {
                    city: 'Mwanza',
                    address: 'Nyerere Road, Mwanza',
                    phone: '+255 28 250 0001'
                },
                {
                    city: 'Arusha',
                    address: 'Sokoine Road, Arusha',
                    phone: '+255 27 254 0002'
                }
            ]
        },
        
        escalation: {
            level1: 'support.tz@mpesewa.com (24-48 hours)',
            level2: 'escalation.tz@mpesewa.com (12-24 hours)',
            level3: 'legal.tz@mpesewa.com (Immediate for legal issues)'
        }
    },

    // ============================================
    // 9. SECURITY & FRAUD PREVENTION
    // ============================================
    security: {
        verification: {
            nationalIdFormat: 'NIDA-XXXXXXXXX-X',
            phoneVerification: 'SMS OTP required',
            biometricSupport: false,
            faceRecognition: false
        },
        
        fraudPrevention: {
            maxFailedAttempts: 5,
            accountLockDuration: '24 hours',
            suspiciousActivityMonitoring: true,
            transactionPatternAnalysis: true
        },
        
        dataProtection: {
            encryption: 'AES-256',
            dataRetention: '7 years',
            backupFrequency: 'Daily',
            disasterRecovery: 'Multi-region backup'
        }
    },

    // ============================================
    // 10. ANALYTICS & REPORTING
    // ============================================
    analytics: {
        metrics: {
            activeUsers: 0,
            activeGroups: 0,
            totalLoans: 0,
            totalAmountLent: 0,
            repaymentRate: 0,
            defaultRate: 0
        },
        
        reports: {
            daily: [
                'New Registrations',
                'Loan Applications',
                'Disbursements',
                'Repayments'
            ],
            monthly: [
                'User Growth',
                'Default Analysis',
                'Revenue Report',
                'Compliance Report'
            ]
        },
        
        kpis: {
            targetRepaymentRate: 0.99,
            maxDefaultRate: 0.05,
            userGrowthTarget: 0.10,
            groupGrowthTarget: 0.15
        }
    },

    // ============================================
    // 11. FEATURE FLAGS & EXPERIMENTS
    // ============================================
    features: {
        enabled: [
            'GROUP_CREATION',
            'LOAN_APPLICATION',
            'LEDGER_MANAGEMENT',
            'SUBSCRIPTION_MANAGEMENT',
            'BLACKLIST_SYSTEM',
            'DEBT_COLLECTORS_DIRECTORY'
        ],
        
        disabled: [
            'CROSS_COUNTRY_TRANSFERS',
            'AUTOMATIC_PAYMENTS',
            'CREDIT_SCORING_ALGORITHM',
            'INVESTMENT_POOLS'
        ],
        
        beta: [
            'MOBILE_APP_IOS',
            'MOBILE_APP_ANDROID',
            'VOICE_VERIFICATION',
            'AI_RISK_ASSESSMENT'
        ]
    },

    // ============================================
    // 12. ERROR HANDLING & RECOVERY
    // ============================================
    errorHandling: {
        commonErrors: {
            'INSUFFICIENT_BALANCE': {
                code: 'TZ_001',
                message: 'Your mobile money balance is insufficient',
                action: 'Top up your mobile money account'
            },
            'NETWORK_FAILURE': {
                code: 'TZ_002',
                message: 'Mobile money network is temporarily unavailable',
                action: 'Try again in 5 minutes'
            },
            'DAILY_LIMIT_EXCEEDED': {
                code: 'TZ_003',
                message: 'You have exceeded your daily transaction limit',
                action: 'Wait until tomorrow or contact support'
            },
            'USER_NOT_VERIFIED': {
                code: 'TZ_004',
                message: 'Your account requires additional verification',
                action: 'Complete KYC verification'
            }
        },
        
        recoveryProcedures: {
            failedPayment: 'Automatic retry after 1 hour',
            networkTimeout: 'Queue and process when back online',
            systemError: 'Log incident and notify engineering team'
        }
    }
};

// Export Configuration
module.exports = tzConfig;

// Country-specific helper functions
const tzHelpers = {
    // Format currency for display
    formatCurrency: (amount) => {
        return `TSh ${amount.toLocaleString('en-TZ')}`;
    },
    
    // Calculate loan repayment
    calculateRepayment: (principal, days = 7) => {
        const interestRate = 0.10; // 10%
        const penaltyRate = 0.05; // 5% daily
        const interest = principal * interestRate;
        const total = principal + interest;
        
        // Calculate penalties if days exceed 7
        let penalty = 0;
        if (days > 7) {
            const overdueDays = days - 7;
            penalty = principal * penaltyRate * overdueDays;
        }
        
        return {
            principal: principal,
            interest: interest,
            penalty: penalty,
            total: total + penalty,
            breakdown: {
                dailyRepayment: total / 7,
                weeklyRepayment: total,
                totalWithPenalty: total + penalty
            }
        };
    },
    
    // Validate National ID
    validateNationalId: (idNumber) => {
        // NIDA format: NIDA-XXXXXXXXX-X
        const nidaRegex = /^NIDA-\d{9}-[A-Z0-9]$/;
        return nidaRegex.test(idNumber.toUpperCase());
    },
    
    // Validate Phone Number
    validatePhoneNumber: (phone) => {
        // Tanzanian phone numbers: +255XXXXXXXXX
        const phoneRegex = /^\+255[67]\d{8}$/;
        return phoneRegex.test(phone);
    },
    
    // Get region from location
    getRegion: (location) => {
        const regions = tzConfig.regional.regions;
        const foundRegion = regions.find(region => 
            location.toLowerCase().includes(region.toLowerCase())
        );
        return foundRegion || 'Unknown Region';
    },
    
    // Check if amount is within tier limits
    checkTierLimit: (amount, tier = 'basic') => {
        const tierLimits = {
            basic: 1500,
            premium: 5000,
            super: 20000,
            'lender-of-lenders': 50000
        };
        
        return amount <= (tierLimits[tier] || tierLimits.basic);
    }
};

// Attach helpers to config
tzConfig.helpers = tzHelpers;

// Make config immutable
Object.freeze(tzConfig);

console.log('Tanzania (TZ) Configuration loaded successfully');
console.log(`Country: ${tzConfig.country.name} (${tzConfig.country.code})`);
console.log(`Currency: ${tzConfig.financial.currency.name} (${tzConfig.financial.currency.code})`);
console.log(`Regulator: ${tzConfig.financial.regulatory.financialAuthority}`);