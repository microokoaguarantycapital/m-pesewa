/**
 * M-PESEWA KENYA CONFIGURATION 🇰🇪
 * Kenya-specific configuration and rules
 * STRICT COUNTRY ISOLATION: No cross-border operations
 */

const KenyaConfig = {
    // ============================================================================
    // 1️⃣ COUNTRY IDENTIFICATION (MANDATORY)
    // ============================================================================
    code: 'KE',
    name: 'Kenya',
    officialName: 'Republic of Kenya',
    flag: '🇰🇪',
    region: 'East Africa',
    capital: 'Nairobi',
    timezone: 'Africa/Nairobi',
    language: 'Swahili',
    secondaryLanguage: 'English',
    callingCode: '+254',
    
    // ============================================================================
    // 2️⃣ LEGAL & COMPLIANCE (NON-NEGOTIABLE)
    // ============================================================================
    legal: {
        // Regulatory bodies
        regulators: [
            'Central Bank of Kenya (CBK)',
            'Capital Markets Authority (CMA)',
            'Insurance Regulatory Authority (IRA)'
        ],
        
        // Licensing requirements
        license: {
            required: true,
            type: 'Digital Credit Provider (DCP)',
            authority: 'Central Bank of Kenya',
            licenseNumber: 'DCP/xxxx/xxxx',
            validity: '2024-12-31'
        },
        
        // KYC requirements
        kyc: {
            mandatory: true,
            documents: ['National ID', 'Passport', 'Driver\'s License'],
            verification: {
                id: 'required',
                address: 'required',
                photo: 'required',
                signature: 'optional'
            },
            minimumAge: 18
        },
        
        // Data protection
        dataProtection: {
            act: 'Data Protection Act, 2019',
            authority: 'Office of the Data Protection Commissioner',
            registrationRequired: true,
            dataLocalization: false
        },
        
        // Consumer protection
        consumerProtection: {
            act: 'Consumer Protection Act',
            coolingOffPeriod: 7, // days
            disputeResolution: 'Financial Services Complaints Commission'
        },
        
        // Anti-money laundering
        aml: {
            required: true,
            act: 'Proceeds of Crime and Anti-Money Laundering Act (POCAMLA)',
            reportingThreshold: 1000000, // KES
            reportingEntity: 'Financial Reporting Centre (FRC)'
        },
        
        // Tax compliance
        tax: {
            vatRate: 0.16,
            withholdingTax: 0.05,
            incomeTax: {
                individual: [0.10, 0.25, 0.30],
                corporate: 0.30
            },
            authority: 'Kenya Revenue Authority (KRA)',
            pinRequired: true
        }
    },
    
    // ============================================================================
    // 3️⃣ FINANCIAL CONFIGURATION (STRICT)
    // ============================================================================
    financial: {
        // Currency
        currency: {
            code: 'KES',
            symbol: 'KSh',
            name: 'Kenyan Shilling',
            decimals: 2,
            format: '{{symbol}} {{amount}}',
            exchangeRates: {
                USD: 0.0091,
                EUR: 0.0084,
                GBP: 0.0072,
                UGX: 37.5,
                TZS: 21.3,
                RWF: 10.5
            }
        },
        
        // Banking system
        banking: {
            nationalPaymentSystem: 'Kenya Electronic Payment and Settlement System (KEPSS)',
            mobileMoney: {
                providers: ['M-Pesa', 'Airtel Money', 'T-Kash'],
                dominant: 'M-Pesa',
                marketShare: 0.98,
                integrationRequired: true
            },
            banks: [
                'Equity Bank',
                'KCB Bank',
                'Co-operative Bank',
                'NCBA Bank',
                'Absa Bank Kenya'
            ],
            interbankRate: 0.10, // CBK Rate
            maximumTransactionLimit: 1000000 // KES
        },
        
        // Credit reference
        creditReference: {
            bureaus: ['CRB Africa', 'Metropol Corporation'],
            integration: 'required',
            checkFee: 50, // KES
            clearanceFee: 200, // KES
            blacklistThreshold: 1000, // KES
            blacklistPeriod: 5 // years
        },
        
        // Transaction costs
        transactionCosts: {
            mpesa: {
                send: {
                    '0-100': 0,
                    '101-500': 11,
                    '501-1000': 33,
                    '1001-1500': 55,
                    '1501-2500': 60,
                    '2501-3500': 77,
                    '3501-5000': 82,
                    '5001-7500': 110,
                    '7501-10000': 132,
                    '10001-15000': 165,
                    '15001-20000': 187,
                    '20001-35000': 297,
                    '35001-50000': 330,
                    '50001-100000': 605,
                    '100001-150000': 1210,
                    '150001-250000': 1650
                },
                withdraw: {
                    '0-100': 0,
                    '101-500': 27,
                    '501-1000': 28,
                    '1001-1500': 29,
                    '1501-2500': 30,
                    '2501-3500': 31,
                    '3501-5000': 32,
                    '5001-7500': 33,
                    '7501-10000': 34,
                    '10001-15000': 35,
                    '15001-20000': 36,
                    '20001-35000': 37,
                    '35001-50000': 38,
                    '50001-100000': 39,
                    '100001-150000': 40,
                    '150001-250000': 41
                }
            },
            bankTransfer: {
                pesaLink: 0,
                rtgs: 200,
                swift: 2500
            }
        }
    },
    
    // ============================================================================
    // 4️⃣ M-PESEWA PLATFORM RULES (KENYA-SPECIFIC)
    // ============================================================================
    platform: {
        // Hierarchy rules
        hierarchy: {
            maxGroupsPerUser: 4,
            minGroupMembers: 5,
            maxGroupMembers: 1000,
            subscriptionExpiryDay: 28,
            countryLock: true,
            groupIsolation: true
        },
        
        // Loan rules
        loans: {
            // Emergency categories (KES amounts)
            categories: {
                fare: { min: 50, max: 5000, avg: 250 },
                data: { min: 50, max: 2000, avg: 1000 },
                cookingGas: { min: 500, max: 5000, avg: 1200 },
                food: { min: 200, max: 3000, avg: 800 },
                wifi: { min: 1000, max: 5000, avg: 3000 },
                waterBill: { min: 500, max: 10000, avg: 1500 },
                electricity: { min: 100, max: 5000, avg: 1000 },
                tvSubscription: { min: 500, max: 5000, avg: 1500 },
                fuel: { min: 500, max: 10000, avg: 2000 },
                repair: { min: 1000, max: 20000, avg: 5000 },
                credo: { min: 500, max: 10000, avg: 3000 },
                dailySales: { min: 1000, max: 1500, avg: 1200 },
                workingCapital: { min: 5000, max: 50000, avg: 20000 },
                sokoLoan: { min: 2000, max: 30000, avg: 10000 },
                kidandaski: { min: 5000, max: 50000, avg: 20000 },
                hawkerLoan: { min: 1000, max: 15000, avg: 5000 },
                fuliziwa: { min: 1000, max: 50000, avg: 15000 },
                medicine: { min: 500, max: 10000, avg: 3000 },
                schoolFees: { min: 5000, max: 50000, avg: 20000 },
                advance: { min: 500, max: 50000, avg: 10000 }
            },
            
            // Loan terms
            terms: {
                interestRate: 0.10, // 10% per week
                penaltyRate: 0.05, // 5% daily after 7 days
                defaultPeriod: 60, // days (2 months)
                maxDuration: 7, // days
                minAmount: 50, // KES
                maxAmount: 50000, // KES
                partialRepayments: true,
                gracePeriod: 0, // days
                rolloverAllowed: false,
                earlyRepaymentPenalty: 0
            },
            
            // Risk management
            risk: {
                maxActiveLoansPerBorrower: 1,
                maxTotalExposurePerLender: 50000,
                debtToIncomeRatio: 0.50,
                creditScoreThreshold: 350,
                collateralRequired: false,
                guarantorsRequired: 2,
                insuranceAvailable: true
            }
        },
        
        // Subscription tiers (KES)
        subscriptions: {
            basic: {
                name: 'Basic Lender',
                weeklyLimit: 1500,
                monthlyFee: 50,
                biAnnualFee: 250,
                annualFee: 500,
                crbRequired: false,
                maxLedgers: 1500,
                features: [
                    'Basic lending dashboard',
                    'Up to KSh 1,500 per week',
                    'Unlimited ledgers',
                    'Borrower rating system',
                    'Group lending only'
                ],
                target: 'Individual lenders, small groups'
            },
            
            premium: {
                name: 'Premium Lender',
                weeklyLimit: 5000,
                monthlyFee: 250,
                biAnnualFee: 1500,
                annualFee: 2500,
                crbRequired: false,
                maxLedgers: 10000,
                features: [
                    'Advanced dashboard',
                    'Up to KSh 5,000 per week',
                    'Portfolio analytics',
                    'Risk assessment tools',
                    'Priority support'
                ],
                target: 'Professional lenders, SACCOs'
            },
            
            super: {
                name: 'Super Lender',
                weeklyLimit: 20000,
                monthlyFee: 1000,
                biAnnualFee: 5000,
                annualFee: 8500,
                crbRequired: true,
                maxLedgers: 20000,
                features: [
                    'Premium dashboard',
                    'Up to KSh 20,000 per week',
                    'CRB integration',
                    'Advanced risk models',
                    'Dedicated account manager'
                ],
                target: 'Financial institutions, large lenders'
            },
            
            lenderOfLenders: {
                name: 'Lender of Lenders',
                weeklyLimit: 50000,
                monthlyFee: 500,
                biAnnualFee: 3500,
                annualFee: 6500,
                crbRequired: true,
                maxLedgers: 50000,
                features: [
                    'Enterprise dashboard',
                    'Up to KSh 50,000 per week',
                    'Custom interest rates',
                    'Minimum 1-month repayment',
                    'White-label options'
                ],
                target: 'Banks, microfinance institutions'
            }
        },
        
        // Borrower rules
        borrowers: {
            noSubscriptionFee: true,
            maxGroups: 4,
            minRatingForAdditionalGroups: 4.0,
            referralRequired: true,
            guarantorsRequired: 2,
            coolingOffPeriod: 1, // day
            disputeWindow: 7, // days
            blacklistThreshold: {
                amount: 1000,
                days: 60
            }
        },
        
        // Platform fees
        fees: {
            platform: {
                revenueModel: 'subscription_only',
                borrowerFees: 0,
                transactionFees: 0,
                lateFees: 0,
                serviceFees: 0
            },
            thirdParty: {
                mpesa: 'variable_by_amount',
                bankTransfer: 'fixed',
                crbCheck: 50,
                crbClearance: 200
            }
        }
    },
    
    // ============================================================================
    // 5️⃣ DEMOGRAPHIC & MARKET DATA
    // ============================================================================
    demographics: {
        population: 55000000,
        urbanPopulation: 0.30,
        medianAge: 20,
        gdpPerCapita: 2200, // USD
        povertyRate: 0.36,
        unemploymentRate: 0.10,
        mobilePenetration: 0.91,
        internetPenetration: 0.43,
        bankedPopulation: 0.83,
        mobileMoneyUsers: 72000000,
        averageIncome: 15000 // KES per month
    },
    
    // ============================================================================
    // 6️⃣ OPERATIONAL CONFIGURATION
    // ============================================================================
    operations: {
        // Support
        support: {
            phone: '+254 709 219 000',
            tollFree: '0800 720 720',
            email: 'kenya@mpesewa.com',
            whatsapp: '+254 709 219 000',
            telegram: '@mpesewa_kenya',
            hours: '24/7',
            languages: ['Swahili', 'English', 'Kikuyu', 'Luo', 'Kalenjin'],
            responseTime: '2 hours',
            escalationLevels: 3
        },
        
        // Payment methods
        paymentMethods: [
            {
                name: 'M-Pesa',
                code: 'MPESA',
                tillNumber: '123456',
                paybill: '123456',
                accountNumber: 'MPESEWA',
                supported: true,
                instant: true
            },
            {
                name: 'Airtel Money',
                code: 'AIRTEL',
                tillNumber: '987654',
                paybill: '987654',
                accountNumber: 'MPESEWA',
                supported: true,
                instant: true
            },
            {
                name: 'Bank Transfer',
                code: 'BANK',
                banks: ['Equity', 'KCB', 'Co-op', 'NCBA', 'Absa'],
                accountNumber: '1234567890',
                branch: 'Nairobi',
                swiftCode: 'EQBLKENA',
                supported: true,
                instant: false
            },
            {
                name: 'Card',
                code: 'CARD',
                processors: ['Visa', 'MasterCard', 'UnionPay'],
                supported: false,
                instant: true
            }
        ],
        
        // Integration partners
        integrations: {
            paymentGateways: ['Lipa Na M-Pesa', 'Dusupay', 'Flutterwave'],
            identityVerification: ['Smile Identity', 'Jumio', 'Onfido'],
            creditBureaus: ['CRB Africa', 'Metropol'],
            analytics: ['Google Analytics', 'Mixpanel', 'Amplitude'],
            communication: ['Twilio', 'Africa\'s Talking', 'SendChamp']
        },
        
        // Security
        security: {
            encryption: 'AES-256-GCM',
            twoFactor: true,
            biometric: true,
            sessionTimeout: 30, // minutes
            maxLoginAttempts: 5,
            passwordPolicy: {
                minLength: 8,
                maxLength: 12,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSymbols: true,
                expiryDays: 90
            },
            auditLogRetention: 365 // days
        },
        
        // Performance
        performance: {
            apiTimeout: 30, // seconds
            pageLoadTime: 3, // seconds
            uptimeTarget: 0.999,
            backupFrequency: 'daily',
            disasterRecovery: 'active-active',
            dataCenters: ['Nairobi', 'Mombasa']
        }
    },
    
    // ============================================================================
    // 7️⃣ MARKETING & BRANDING
    // ============================================================================
    branding: {
        // Colors (M-Pesewa brand with Kenyan theme)
        colors: {
            primary: '#003366', // Deep Blue
            secondary: '#0099ff', // Sky Blue
            accent: '#f37021', // Orange
            success: '#28a745', // Green
            warning: '#ffc107', // Yellow
            danger: '#dc3545', // Red
            dark: '#1f2a37', // Dark Slate
            light: '#f8f9fa', // Light Gray
            white: '#ffffff',
            black: '#000000',
            
            // Kenyan flag colors
            kenyan: {
                black: '#000000',
                red: '#BB0000',
                green: '#006600',
                white: '#FFFFFF'
            }
        },
        
        // Typography
        typography: {
            primaryFont: 'Inter, sans-serif',
            secondaryFont: 'Poppins, sans-serif',
            swahiliFont: 'Noto Sans, sans-serif',
            baseSize: '16px',
            headingScale: 1.333
        },
        
        // Logo & assets
        assets: {
            logo: {
                light: '/assets/images/kenya/logo-light.svg',
                dark: '/assets/images/kenya/logo-dark.svg',
                favicon: '/assets/images/kenya/favicon.ico',
                appIcon: '/assets/images/kenya/app-icon.png'
            },
            images: {
                hero: '/assets/images/kenya/hero-nairobi.jpg',
                map: '/assets/images/kenya/kenya-map.svg',
                patterns: '/assets/images/kenya/maasai-pattern.png'
            },
            icons: {
                country: '🇰🇪',
                currency: 'KSh',
                success: '✅',
                warning: '⚠️',
                error: '❌'
            }
        },
        
        // Messaging
        messaging: {
            tagline: 'Pesa yako, wakati wako',
            valueProposition: 'Emergency loans within trusted circles',
            benefits: [
                'No bank queues',
                'No hidden charges',
                'Friends lending to friends',
                'Build community trust'
            ],
            ctas: {
                primary: 'Start Lending',
                secondary: 'Get Emergency Loan',
                tertiary: 'Join Group'
            }
        }
    },
    
    // ============================================================================
    // 8️⃣ TESTING & DEVELOPMENT
    // ============================================================================
    development: {
        // Test data
        testData: {
            users: {
                lenders: [
                    { id: 'ke_lender_001', name: 'John Kamau', phone: '+254712345678', rating: 4.8 },
                    { id: 'ke_lender_002', name: 'Mary Wanjiku', phone: '+254723456789', rating: 4.9 },
                    { id: 'ke_lender_003', name: 'Peter Ochieng', phone: '+254734567890', rating: 4.7 }
                ],
                borrowers: [
                    { id: 'ke_borrower_001', name: 'Jane Atieno', phone: '+254745678901', rating: 4.5 },
                    { id: 'ke_borrower_002', name: 'David Mwangi', phone: '+254756789012', rating: 4.2 },
                    { id: 'ke_borrower_003', name: 'Susan Akinyi', phone: '+254767890123', rating: 4.6 }
                ]
            },
            groups: [
                { id: 'ke_group_001', name: 'Nairobi Family Circle', members: 45, rating: 4.8 },
                { id: 'ke_group_002', name: 'Kisumu Business Network', members: 120, rating: 4.7 },
                { id: 'ke_group_003', name: 'Mombasa Fishermen Group', members: 85, rating: 4.9 }
            ],
            loans: [
                { id: 'ke_loan_001', amount: 1200, category: 'cookingGas', status: 'repaid' },
                { id: 'ke_loan_002', amount: 250, category: 'fare', status: 'active' },
                { id: 'ke_loan_003', amount: 1000, category: 'data', status: 'repaid' }
            ]
        },
        
        // API endpoints
        api: {
            baseUrl: 'https://api.mpesewa.co.ke/v1',
            endpoints: {
                auth: '/auth',
                users: '/users',
                groups: '/groups',
                loans: '/loans',
                payments: '/payments',
                subscriptions: '/subscriptions',
                reports: '/reports'
            },
            rateLimit: {
                perSecond: 10,
                perMinute: 100,
                perHour: 1000
            }
        },
        
        // Feature flags
        features: {
            newDashboard: true,
            mobileApp: true,
            biometricLogin: true,
            darkMode: true,
            offlineMode: true,
            pushNotifications: true,
            voiceAssistant: false,
            aiRecommendations: false
        }
    },
    
    // ============================================================================
    // 9️⃣ VERSIONING & METADATA
    // ============================================================================
    metadata: {
        version: '2.0.0',
        lastUpdated: '2024-01-24',
        changelog: [
            'Added Kenyan-specific legal requirements',
            'Updated M-Pesa transaction costs',
            'Added demographic data',
            'Enhanced security configurations'
        ],
        compatibility: {
            minAppVersion: '2.0.0',
            minBrowser: 'Chrome 80, Safari 14, Firefox 78',
            minOS: 'Android 8, iOS 13'
        },
        createdBy: 'M-Pesewa Engineering Team',
        reviewedBy: 'M-Pesewa Legal Team (Kenya)',
        approvedBy: 'M-Pesewa Country Manager (Kenya)'
    }
};

// Export the configuration
export default KenyaConfig;

// Export individual sections for modular imports
export const legalConfig = KenyaConfig.legal;
export const financialConfig = KenyaConfig.financial;
export const platformConfig = KenyaConfig.platform;
export const operationsConfig = KenyaConfig.operations;
export const brandingConfig = KenyaConfig.branding;

// Export helper functions
export function formatCurrencyKES(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

export function calculateMPesaCharge(amount, type = 'send') {
    const charges = KenyaConfig.financial.transactionCosts.mpesa[type];
    let charge = 0;
    
    for (const [range, cost] of Object.entries(charges)) {
        const [min, max] = range.split('-').map(Number);
        if (amount >= min && amount <= (max || Infinity)) {
            charge = cost;
            break;
        }
    }
    
    return charge;
}

export function validatePhoneNumber(phone) {
    // Kenyan phone number validation
    const regex = /^(\+254|0)[17]\d{8}$/;
    if (!regex.test(phone)) {
        return false;
    }
    
    // Normalize to international format
    if (phone.startsWith('0')) {
        return '+254' + phone.substring(1);
    }
    
    return phone;
}

export function calculateLoanRepayment(principal, days = 7) {
    const interestRate = KenyaConfig.platform.loans.terms.interestRate;
    const penaltyRate = KenyaConfig.platform.loans.terms.penaltyRate;
    
    const weeklyInterest = principal * interestRate;
    const totalDue = principal + weeklyInterest;
    
    let penalty = 0;
    if (days > 7) {
        const overdueDays = days - 7;
        penalty = totalDue * penaltyRate * overdueDays;
    }
    
    return {
        principal,
        interest: weeklyInterest,
        penalty,
        total: totalDue + penalty,
        dailyRepayment: totalDue / 7,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
}

// Export for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KenyaConfig;
    module.exports.legalConfig = legalConfig;
    module.exports.financialConfig = financialConfig;
    module.exports.platformConfig = platformConfig;
    module.exports.operationsConfig = operationsConfig;
    module.exports.brandingConfig = brandingConfig;
    module.exports.formatCurrencyKES = formatCurrencyKES;
    module.exports.calculateMPesaCharge = calculateMPesaCharge;
    module.exports.validatePhoneNumber = validatePhoneNumber;
    module.exports.calculateLoanRepayment = calculateLoanRepayment;
}