/**
 * M-PESEWA RWANDA COUNTRY CONFIGURATION
 * Strict Country Isolation - No Cross-Border Operations
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const RwandaConfig = {
    // ============================================
    // 1️⃣ COUNTRY IDENTIFICATION & METADATA
    // ============================================
    country: {
        id: 'RW',
        name: 'Rwanda',
        fullName: 'Republic of Rwanda',
        isoCode: 'RW',
        iso3Code: 'RWA',
        flagEmoji: '🇷🇼',
        continent: 'Africa',
        region: 'East Africa',
        capital: 'Kigali',
        timezone: 'Africa/Kigali',
        callingCode: '+250',
        emergencyNumber: '112',
        coordinates: {
            latitude: -1.9403,
            longitude: 29.8739
        }
    },

    // ============================================
    // 2️⃣ FINANCIAL & CURRENCY CONFIGURATION
    // ============================================
    financial: {
        currency: {
            code: 'RWF',
            symbol: 'FRw',
            name: 'Rwandan Franc',
            decimalPlaces: 0,
            format: {
                symbolPosition: 'before',
                thousandSeparator: ',',
                decimalSeparator: '.',
                format: '{{symbol}}{{value}}'
            }
        },
        centralBank: 'National Bank of Rwanda',
        bankingHours: '8:00 AM - 5:00 PM (Monday-Friday)',
        mobileMoney: {
            providers: ['MTN Mobile Money', 'Airtel Money', 'Tigo Cash'],
            transactionLimits: {
                daily: 5000000, // 5 million RWF
                monthly: 15000000 // 15 million RWF
            }
        }
    },

    // ============================================
    // 3️⃣ PLATFORM OPERATIONAL RULES (STRICT)
    // ============================================
    operational: {
        // STRICT HIERARCHY ENFORCEMENT
        hierarchy: {
            structure: 'Global → Country → Groups → Lenders → Borrowers',
            rules: {
                countryIsolation: {
                    enabled: true,
                    message: 'No cross-country lending or borrowing allowed',
                    enforcement: 'strict'
                },
                groupIsolation: {
                    enabled: true,
                    message: 'Lenders can only lend within their group',
                    enforcement: 'strict'
                },
                maxGroupsPerBorrower: 4,
                minGroupMembers: 5,
                maxGroupMembers: 1000
            }
        },

        // LENDING RULES
        lendingRules: {
            loanDuration: 7, // days
            interestRate: 0.10, // 10%
            dailyPenalty: 0.05, // 5% daily after 7 days
            defaultPeriod: 60, // days (2 months)
            partialRepayments: true,
            minLoanAmount: 500, // RWF
            maxLoanAmountTiers: {
                basic: 1500,
                premium: 5000,
                super: 20000,
                lenderOfLenders: 50000
            }
        },

        // SUBSCRIPTION EXPIRY
        subscription: {
            expiryDay: 28, // 28th of each month
            gracePeriod: 0, // No grace period
            blockOnExpiry: true
        }
    },

    // ============================================
    // 4️⃣ LEGAL & REGULATORY COMPLIANCE
    // ============================================
    legal: {
        regulatoryBody: 'National Bank of Rwanda (BNR)',
        licensing: {
            required: true,
            licenseNumber: 'P2P-LIC-2024-RW-001',
            issuingAuthority: 'BNR FinTech Division'
        },
        dataProtection: {
            law: 'Law No. 058/2021 on Protection of Personal Data and Privacy',
            authority: 'National Cyber Security Authority (NCSA)'
        },
        consumerProtection: {
            law: 'Law No. 18/2010 on Consumer Protection',
            disputeResolution: 'Rwanda Utilities Regulatory Authority (RURA)'
        },
        taxCompliance: {
            vatRate: 0.18, // 18%
            withholdingTax: 0.15, // 15%
            taxAuthority: 'Rwanda Revenue Authority (RRA)'
        }
    },

    // ============================================
    // 5️⃣ DEMOGRAPHIC & MARKET DATA
    // ============================================
    demographics: {
        population: 13460000,
        urbanPopulation: 0.173, // 17.3%
        medianAge: 19.7,
        internetPenetration: 0.32, // 32%
        mobilePenetration: 0.81, // 81%
        bankedPopulation: 0.33, // 33%
        fintechAdoption: 0.28 // 28%
    },

    // ============================================
    // 6️⃣ PLATFORM SPECIFIC CONFIGURATION
    // ============================================
    platform: {
        // SUBSCRIPTION TIERS (RWF)
        subscriptionTiers: {
            basic: {
                name: 'Basic',
                limits: {
                    weekly: 1500,
                    monthly: 6000,
                    ledgers: 1500
                },
                pricing: {
                    monthly: 50,
                    biAnnual: 250,
                    annual: 500
                },
                features: ['No CRB check', 'Basic ledger access']
            },
            premium: {
                name: 'Premium',
                limits: {
                    weekly: 5000,
                    monthly: 20000,
                    ledgers: 10000
                },
                pricing: {
                    monthly: 250,
                    biAnnual: 1500,
                    annual: 2500
                },
                features: ['No CRB check', 'Advanced analytics']
            },
            super: {
                name: 'Super',
                limits: {
                    weekly: 20000,
                    monthly: 80000,
                    ledgers: 20000
                },
                pricing: {
                    monthly: 1000,
                    biAnnual: 5000,
                    annual: 8500
                },
                features: ['CRB check required', 'Priority support', 'Advanced risk tools']
            },
            lenderOfLenders: {
                name: 'Lender of Lenders',
                limits: {
                    weekly: 50000,
                    monthly: 200000,
                    ledgers: 50000
                },
                pricing: {
                    monthly: 500,
                    biAnnual: 3500,
                    annual: 6500
                },
                features: ['CRB check required', 'Custom interest rates', 'Minimum 1-month terms']
            }
        },

        // EMERGENCY CATEGORIES (Localized)
        emergencyCategories: {
            transportation: {
                id: 'rw_transport',
                name: 'M-pesewa Fare',
                description: 'Move on, don\'t stall—borrow for your journey',
                maxAmount: 5000,
                icon: '🚌',
                localExamples: ['Kigali bus fare', 'Motorbike taxi', 'Inter-city transport']
            },
            data: {
                id: 'rw_data',
                name: 'M-pesewa Data',
                description: 'Stay connected, stay informed—borrow when your bundle runs out',
                maxAmount: 3000,
                icon: '📶',
                localExamples: ['MTN data bundle', 'Airtel internet', 'Social media bundle']
            },
            cooking: {
                id: 'rw_cooking',
                name: 'M-pesewa Cooking Gas',
                description: 'Cook with confidence—borrow when your gas is low',
                maxAmount: 8000,
                icon: '🔥',
                localExamples: ['6kg gas refill', 'Charcoal purchase', 'Electricity for cooking']
            }
            // ... other 17 categories would be defined similarly
        },

        // DEFAULT GROUPS (Pre-configured)
        defaultGroups: [
            {
                id: 'rw_family_trust',
                name: 'Family Trust Group',
                type: 'family',
                description: 'Family members supporting each other',
                location: 'Kigali',
                maxMembers: 50,
                entryType: 'invitation'
            },
            {
                id: 'rw_moto_cooperative',
                name: 'Motorcycle Cooperative',
                type: 'professional',
                description: 'Motorcycle taxi drivers supporting each other',
                location: 'Countrywide',
                maxMembers: 200,
                entryType: 'referral'
            },
            {
                id: 'rw_market_traders',
                name: 'Market Traders Union',
                type: 'business',
                description: 'Small business owners in local markets',
                location: 'Kimironko Market',
                maxMembers: 100,
                entryType: 'invitation'
            }
        ],

        // REPUTATION SYSTEM
        reputation: {
            ratingSystem: '5-star',
            defaultRating: 3,
            blacklistThreshold: 2, // stars
            goodRatingThreshold: 4, // stars
            ratingDecay: 0.1, // per month
            recoveryPeriod: 90 // days to improve rating
        }
    },

    // ============================================
    // 7️⃣ INTEGRATION & SERVICE CONFIGURATION
    // ============================================
    integrations: {
        paymentGateways: [
            {
                name: 'MTN Mobile Money',
                provider: 'MTN Rwanda',
                currency: 'RWF',
                minAmount: 100,
                maxAmount: 5000000,
                fees: {
                    percentage: 0.01, // 1%
                    fixed: 0
                }
            },
            {
                name: 'Airtel Money',
                provider: 'Airtel Rwanda',
                currency: 'RWF',
                minAmount: 100,
                maxAmount: 3000000,
                fees: {
                    percentage: 0.015, // 1.5%
                    fixed: 0
                }
            }
        ],

        identityVerification: {
            provider: 'Rwanda National ID System',
            required: true,
            fields: ['national_id', 'full_name', 'date_of_birth', 'photo'],
            apiEndpoint: 'https://api.rwanda.gov.rw/nid/verify'
        },

        creditBureau: {
            provider: 'Rwanda Credit Reference Bureau (CRB)',
            enabled: true,
            tiers: ['super', 'lender_of_lenders'],
            apiKeyRequired: true,
            endpoint: 'https://api.crb.rw/check'
        }
    },

    // ============================================
    // 8️⃣ SECURITY & COMPLIANCE SETTINGS
    // ============================================
    security: {
        dataRetention: {
            userData: 3650, // 10 years
            transactionData: 7300, // 20 years
            logs: 180 // 6 months
        },
        encryption: {
            algorithm: 'AES-256-GCM',
            keyRotation: 90, // days
            ssl: true
        },
        audit: {
            enabled: true,
            frequency: 'real-time',
            retention: 3650 // 10 years
        },
        kycRequirements: {
            level1: ['phone_verification', 'email_verification'],
            level2: ['national_id', 'proof_of_address'],
            level3: ['income_verification', 'tax_certificate']
        }
    },

    // ============================================
    // 9️⃣ LOCALIZATION & TRANSLATION
    // ============================================
    localization: {
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'rw', 'fr'],
        timeFormat: '24h',
        dateFormat: 'DD/MM/YYYY',
        firstDayOfWeek: 'Monday',
        numberFormat: {
            decimalSeparator: '.',
            thousandSeparator: ',',
            grouping: [3]
        }
    },

    // ============================================
    // 🔟 SUPPORT & CONTACT INFORMATION
    // ============================================
    support: {
        contact: {
            phone: '+250 791 590 801',
            email: 'support.rw@mpesewa.com',
            whatsapp: '+250 791 590 801',
            telegram: '@mpesewa_rw'
        },
        businessHours: {
            mondayToFriday: '8:00 AM - 6:00 PM',
            saturday: '9:00 AM - 1:00 PM',
            sunday: 'Closed'
        },
        physicalAddress: {
            line1: 'Kigali Heights, KG 7 Ave',
            line2: 'Kigali, Rwanda',
            postalCode: '0000',
            mapLink: 'https://maps.google.com/?q=Kigali+Heights,Rwanda'
        },
        escalation: {
            level1: 'Customer Support',
            level2: 'Country Manager',
            level3: 'Legal Department',
            ombudsman: 'Rwanda Utilities Regulatory Authority'
        }
    },

    // ============================================
    // 1️⃣1️⃣ MONITORING & ANALYTICS
    // ============================================
    monitoring: {
        healthCheck: {
            endpoint: '/api/rw/health',
            interval: 300, // seconds
            timeout: 30 // seconds
        },
        metrics: {
            track: ['active_users', 'loan_volume', 'default_rate', 'repayment_rate'],
            retention: 365 // days
        },
        alerts: {
            thresholds: {
                defaultRate: 0.05, // 5%
                systemUptime: 0.99, // 99%
                responseTime: 2000 // milliseconds
            },
            channels: ['email', 'sms', 'slack']
        }
    },

    // ============================================
    // 1️⃣2️⃣ VERSION & DEPLOYMENT
    // ============================================
    version: {
        major: 1,
        minor: 0,
        patch: 0,
        releaseDate: '2024-01-24',
        compatibility: {
            minAppVersion: '1.0.0',
            apiVersion: 'v1'
        }
    },

    // ============================================
    // 1️⃣3️⃣ VALIDATION METHODS
    // ============================================
    validate: function() {
        const errors = [];

        // Validate required fields
        if (!this.country.id) errors.push('Country ID is required');
        if (!this.financial.currency.code) errors.push('Currency code is required');
        
        // Validate hierarchy rules
        if (this.operational.hierarchy.rules.maxGroupsPerBorrower > 4) {
            errors.push('Maximum groups per borrower cannot exceed 4');
        }

        // Validate subscription expiry
        if (this.operational.subscription.expiryDay < 1 || this.operational.subscription.expiryDay > 31) {
            errors.push('Subscription expiry day must be between 1 and 31');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // ============================================
    // 1️⃣4️⃣ HELPER METHODS
    // ============================================
    helpers: {
        formatCurrency: function(amount) {
            return `${this.financial.currency.symbol}${amount.toLocaleString('en-RW')}`;
        },

        calculateLoan: function(principal, days = 7) {
            const interest = principal * this.operational.lendingRules.interestRate;
            const total = principal + interest;
            
            if (days > 7) {
                const penaltyDays = days - 7;
                const penalty = principal * this.operational.lendingRules.dailyPenalty * penaltyDays;
                return {
                    principal: principal,
                    interest: interest,
                    penalty: penalty,
                    total: total + penalty,
                    dailyRepayment: total / 7,
                    isOverdue: days > 7
                };
            }

            return {
                principal: principal,
                interest: interest,
                penalty: 0,
                total: total,
                dailyRepayment: total / 7,
                isOverdue: false
            };
        },

        validatePhoneNumber: function(phone) {
            // Rwanda phone number validation
            const rwandaRegex = /^(\+250|250|0)?(7[238])\d{7}$/;
            return rwandaRegex.test(phone);
        },

        getSubscriptionLimit: function(tier) {
            const limits = this.platform.subscriptionTiers[tier]?.limits;
            if (!limits) {
                throw new Error(`Invalid subscription tier: ${tier}`);
            }
            return limits;
        },

        isBusinessDay: function(date = new Date()) {
            const day = date.getDay();
            return day >= 1 && day <= 5; // Monday to Friday
        }
    }
};

// Freeze configuration to prevent modification
Object.freeze(RwandaConfig);

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RwandaConfig;
} else if (typeof window !== 'undefined') {
    window.RwandaConfig = RwandaConfig;
}

// Initialize on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Rwanda Country Configuration Loaded:', RwandaConfig.country.name);
        
        // Set country flag in localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('mpesewa_country', 'RW');
            localStorage.setItem('mpesewa_currency', 'RWF');
            localStorage.setItem('mpesewa_timezone', 'Africa/Kigali');
        }
    });
}