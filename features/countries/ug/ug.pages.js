/**
 * M-Pesewa Uganda - Country-Specific Pages
 * Uganda-specific UI components and pages
 * Last Updated: 2026-01-24
 */

class UgandaPages {
    constructor() {
        this.countryCode = 'UG';
        this.countryName = 'Uganda';
        this.currency = 'UGX';
        
        // Uganda-specific page configurations
        this.pages = {
            dashboard: this.getDashboardConfig(),
            registration: this.getRegistrationConfig(),
            groups: this.getGroupsConfig(),
            emergencyHub: this.getEmergencyHubConfig(),
            subscription: this.getSubscriptionConfig(),
            blacklist: this.getBlacklistConfig(),
            debtCollectors: this.getDebtCollectorsConfig()
        };
        
        // Uganda-specific UI components
        this.components = {
            countryBadge: this.getCountryBadge(),
            currencyDisplay: this.getCurrencyDisplay(),
            regulatoryBanner: this.getRegulatoryBanner(),
            isolationWarning: this.getIsolationWarning()
        };
    }

    /**
     * Get Uganda Dashboard Configuration
     */
    getDashboardConfig() {
        return {
            // Borrower Dashboard for Uganda
            borrower: {
                title: 'Uganda Borrower Dashboard',
                sections: [
                    {
                        id: 'active-loans',
                        title: 'My Active Loans in Uganda',
                        columns: [
                            { header: 'Loan ID', key: 'id', width: '10%' },
                            { header: 'Amount (UGX)', key: 'amount', width: '15%', format: 'currency' },
                            { header: 'Lender', key: 'lender', width: '20%' },
                            { header: 'Group', key: 'group', width: '15%' },
                            { header: 'Due Date', key: 'dueDate', width: '15%', format: 'date' },
                            { header: 'Days Left', key: 'daysLeft', width: '10%', format: 'badge' },
                            { header: 'Status', key: 'status', width: '15%', format: 'status' }
                        ],
                        actions: ['View Details', 'Make Payment', 'Request Extension']
                    },
                    {
                        id: 'credit-score',
                        title: 'Uganda Credit Rating',
                        metrics: [
                            { label: 'Repayment Rate', key: 'repaymentRate', format: 'percentage' },
                            { label: 'Active Groups', key: 'activeGroups', format: 'number' },
                            { label: 'Total Borrowed', key: 'totalBorrowed', format: 'currency' },
                            { label: 'On-time Repayments', key: 'onTimeRepayments', format: 'number' }
                        ],
                        ratingScale: {
                            excellent: '★★★★★ - Access to 4 groups',
                            good: '★★★★☆ - Access to 3 groups',
                            average: '★★★☆☆ - Access to 2 groups',
                            poor: '★★☆☆☆ - Access to 1 group',
                            bad: '★☆☆☆☆ - No group access'
                        }
                    },
                    {
                        id: 'emergency-categories',
                        title: 'Available Emergency Loans in Uganda',
                        categories: [
                            { name: 'Boda Boda Fare', icon: '🏍️', maxAmount: 50000 },
                            { name: 'Mobile Data', icon: '📶', maxAmount: 20000 },
                            { name: 'Cooking Gas', icon: '🔥', maxAmount: 80000 },
                            { name: 'School Fees', icon: '🎓', maxAmount: 500000 },
                            { name: 'Medical Emergency', icon: '🏥', maxAmount: 1000000 }
                        ]
                    }
                ],
                warnings: [
                    'All loans restricted to Uganda-based groups',
                    'Maximum 7-day repayment period',
                    '10% interest rate applies',
                    'Blacklist for defaults over 60 days'
                ]
            },

            // Lender Dashboard for Uganda
            lender: {
                title: 'Uganda Lender Dashboard',
                sections: [
                    {
                        id: 'lending-activity',
                        title: 'My Lending Activity in Uganda',
                        metrics: [
                            { label: 'Active Ledgers', key: 'activeLedgers', format: 'number' },
                            { label: 'Total Lent (UGX)', key: 'totalLent', format: 'currency' },
                            { label: 'Expected Interest', key: 'expectedInterest', format: 'currency' },
                            { label: 'Default Rate', key: 'defaultRate', format: 'percentage' }
                        ],
                        charts: ['Portfolio Distribution', 'Repayment Timeline', 'Risk Analysis']
                    },
                    {
                        id: 'subscription-status',
                        title: 'Uganda Subscription Status',
                        tiers: [
                            {
                                name: 'Basic',
                                limit: '1.5M UGX/week',
                                features: ['Up to 10 ledgers', 'Basic reporting'],
                                status: 'active/inactive',
                                expiry: '28th of each month'
                            },
                            {
                                name: 'Premium',
                                limit: '5M UGX/week',
                                features: ['Up to 50 ledgers', 'Advanced analytics'],
                                status: 'active/inactive',
                                expiry: '28th of each month'
                            },
                            {
                                name: 'Super',
                                limit: '20M UGX/week',
                                features: ['Unlimited ledgers', 'CRB integration'],
                                status: 'active/inactive',
                                expiry: '28th of each month'
                            }
                        ]
                    },
                    {
                        id: 'borrower-requests',
                        title: 'Borrower Requests in Uganda Groups',
                        filters: [
                            'My Groups Only',
                            'Amount Range',
                            'Category',
                            'Borrower Rating'
                        ],
                        sortOptions: [
                            'Newest First',
                            'Amount: Low to High',
                            'Amount: High to Low',
                            'Borrower Rating'
                        ]
                    }
                ],
                restrictions: [
                    'Lending restricted to Uganda groups only',
                    'Subscription required for lending',
                    'Maximum lending limit per tier',
                    '28th monthly subscription expiry'
                ]
            },

            // Group Admin Dashboard for Uganda
            groupAdmin: {
                title: 'Uganda Group Administration',
                sections: [
                    {
                        id: 'group-members',
                        title: 'Uganda Group Members',
                        columns: [
                            { header: 'Name', key: 'name', width: '25%' },
                            { header: 'Role', key: 'role', width: '15%' },
                            { header: 'Rating', key: 'rating', width: '15%', format: 'stars' },
                            { header: 'Active Loans', key: 'activeLoans', width: '15%' },
                            { header: 'Total Borrowed', key: 'totalBorrowed', width: '15%', format: 'currency' },
                            { header: 'Actions', key: 'actions', width: '15%' }
                        ],
                        memberActions: ['View Profile', 'Send Message', 'Remove from Group']
                    },
                    {
                        id: 'group-statistics',
                        title: 'Uganda Group Statistics',
                        metrics: [
                            { label: 'Total Members', key: 'totalMembers' },
                            { label: 'Active Lenders', key: 'activeLenders' },
                            { label: 'Active Borrowers', key: 'activeBorrowers' },
                            { label: 'Total Amount Lent (UGX)', key: 'totalAmountLent', format: 'currency' },
                            { label: 'Group Repayment Rate', key: 'repaymentRate', format: 'percentage' }
                        ]
                    },
                    {
                        id: 'group-settings',
                        title: 'Uganda Group Settings',
                        configurable: [
                            'Group Name',
                            'Group Description',
                            'Maximum Loan Amount',
                            'Meeting Schedule',
                            'Invitation Settings'
                        ],
                        rules: [
                            'All members must be Uganda residents',
                            'No cross-group lending allowed',
                            'Compliance with Uganda regulations',
                            'Admin has final decision authority'
                        ]
                    }
                ]
            }
        };
    }

    /**
     * Get Uganda Registration Configuration
     */
    getRegistrationConfig() {
        return {
            // Borrower Registration for Uganda
            borrower: {
                title: 'Register as Borrower in Uganda',
                steps: [
                    {
                        step: 1,
                        title: 'Personal Information',
                        fields: [
                            {
                                name: 'fullName',
                                label: 'Full Name (as per Uganda National ID)',
                                type: 'text',
                                required: true,
                                validation: 'minLength:3,maxLength:100'
                            },
                            {
                                name: 'nationalId',
                                label: 'Uganda National ID Number',
                                type: 'text',
                                required: true,
                                validation: 'pattern:/^[A-Z0-9]{13,14}$/',
                                help: '13 or 14 character Uganda National ID'
                            },
                            {
                                name: 'phoneNumber',
                                label: 'Uganda Phone Number',
                                type: 'tel',
                                required: true,
                                validation: 'pattern:/^\+256[0-9]{9}$/',
                                placeholder: '+256712345678'
                            }
                        ]
                    },
                    {
                        step: 2,
                        title: 'Location & Verification',
                        fields: [
                            {
                                name: 'district',
                                label: 'District in Uganda',
                                type: 'select',
                                required: true,
                                options: [
                                    'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Mbale', 'Gulu',
                                    'Mbarara', 'Fort Portal', 'Masaka', 'Lira', 'Arua', 'Other'
                                ]
                            },
                            {
                                name: 'address',
                                label: 'Physical Address in Uganda',
                                type: 'text',
                                required: true,
                                validation: 'minLength:10'
                            },
                            {
                                name: 'idPhoto',
                                label: 'Uganda National ID Photo',
                                type: 'file',
                                required: true,
                                accept: 'image/*',
                                help: 'Clear photo of your Uganda National ID'
                            }
                        ]
                    },
                    {
                        step: 3,
                        title: 'Guarantors & Groups',
                        fields: [
                            {
                                name: 'guarantor1Name',
                                label: 'First Guarantor Name',
                                type: 'text',
                                required: true,
                                help: 'Must be a Uganda resident'
                            },
                            {
                                name: 'guarantor1Phone',
                                label: 'First Guarantor Phone',
                                type: 'tel',
                                required: true,
                                validation: 'pattern:/^\+256[0-9]{9}$/'
                            },
                            {
                                name: 'groupInvitationCode',
                                label: 'Group Invitation Code',
                                type: 'text',
                                required: true,
                                help: 'Get invitation code from group admin'
                            }
                        ]
                    }
                ],
                terms: [
                    'I confirm I am a resident of Uganda',
                    'I agree to Uganda lending terms',
                    'I accept 10% weekly interest rate',
                    'I understand blacklisting consequences',
                    'I consent to credit information sharing'
                ],
                postRegistration: [
                    'ID verification within 24 hours',
                    'Group approval required',
                    'Access to Uganda emergency categories',
                    'Start borrowing from Uganda groups'
                ]
            },

            // Lender Registration for Uganda
            lender: {
                title: 'Register as Lender in Uganda',
                steps: [
                    {
                        step: 1,
                        title: 'Lender Profile',
                        fields: [
                            {
                                name: 'lenderName',
                                label: 'Lender Name/Brand',
                                type: 'text',
                                required: true,
                                help: 'Your lending name as it appears to borrowers'
                            },
                            {
                                name: 'nationalId',
                                label: 'Uganda National ID/TIN',
                                type: 'text',
                                required: true,
                                validation: 'pattern:/^[A-Z0-9]{9,14}$/'
                            },
                            {
                                name: 'bankAccount',
                                label: 'Uganda Bank Account',
                                type: 'text',
                                required: true,
                                help: 'For receiving repayments in UGX'
                            }
                        ]
                    },
                    {
                        step: 2,
                        title: 'Subscription Selection',
                        fields: [
                            {
                                name: 'subscriptionTier',
                                label: 'Choose Subscription Tier',
                                type: 'radio',
                                required: true,
                                options: [
                                    {
                                        value: 'basic',
                                        label: 'Basic - 20,000 UGX/month (1.5M UGX/week limit)'
                                    },
                                    {
                                        value: 'premium',
                                        label: 'Premium - 100,000 UGX/month (5M UGX/week limit)'
                                    },
                                    {
                                        value: 'super',
                                        label: 'Super - 400,000 UGX/month (20M UGX/week limit)'
                                    }
                                ]
                            },
                            {
                                name: 'billingCycle',
                                label: 'Billing Cycle',
                                type: 'select',
                                required: true,
                                options: [
                                    { value: 'monthly', label: 'Monthly' },
                                    { value: 'annual', label: 'Annual (Save 20%)' }
                                ]
                            }
                        ]
                    },
                    {
                        step: 3,
                        title: 'Lending Preferences',
                        fields: [
                            {
                                name: 'lendingCategories',
                                label: 'Emergency Categories to Lend In',
                                type: 'checkbox-group',
                                required: true,
                                options: [
                                    { value: 'transport', label: 'Transport (Boda Boda Fare)' },
                                    { value: 'data', label: 'Mobile Data' },
                                    { value: 'gas', label: 'Cooking Gas' },
                                    { value: 'school', label: 'School Fees' },
                                    { value: 'medical', label: 'Medical Emergencies' },
                                    { value: 'all', label: 'All Categories' }
                                ]
                            },
                            {
                                name: 'maxLoanAmount',
                                label: 'Maximum Single Loan (UGX)',
                                type: 'number',
                                required: true,
                                min: 1000,
                                max: 20000000,
                                step: 1000
                            },
                            {
                                name: 'groupSelection',
                                label: 'Select Uganda Groups to Join',
                                type: 'select-multiple',
                                required: false,
                                help: 'You can join up to 4 groups'
                            }
                        ]
                    }
                ],
                verification: [
                    'Bank account verification',
                    'National ID verification',
                    'AML check',
                    'Subscription payment confirmation'
                ],
                activation: [
                    'Lending activated after subscription payment',
                    'Access to selected Uganda groups',
                    'Ledger creation enabled',
                    'Start receiving borrower requests'
                ]
            }
        };
    }

    /**
     * Get Uganda Groups Configuration
     */
    getGroupsConfig() {
        return {
            // Group types specific to Uganda
            groupTypes: [
                {
                    id: 'family_ug',
                    name: 'Family Group',
                    icon: '👨‍👩‍👧‍👦',
                    description: 'Family members lending within Uganda family circle',
                    requirements: [
                        'Minimum 5 family members',
                        'Family relationship verification',
                        'All members Uganda residents'
                    ],
                    rules: [
                        'Lending only to family members',
                        'Flexible repayment terms within family',
                        'Family dispute resolution'
                    ]
                },
                {
                    id: 'market_ug',
                    name: 'Market Group',
                    icon: '🏪',
                    description: 'Market vendors and traders in Uganda markets',
                    requirements: [
                        'Market stall verification',
                        'Business registration (if applicable)',
                        'Market location proof'
                    ],
                    rules: [
                        'Business-focused lending',
                        'Market-specific loan categories',
                        'Group meetings at market'
                    ]
                },
                {
                    id: 'church_ug',
                    name: 'Church Group',
                    icon: '⛪',
                    description: 'Church members support network in Uganda',
                    requirements: [
                        'Church membership verification',
                        'Pastor/leader approval',
                        'Active church attendance'
                    ],
                    rules: [
                        'Faith-based lending principles',
                        'Church leadership mediation',
                        'Social support component'
                    ]
                },
                {
                    id: 'boda_ug',
                    name: 'Boda Boda Group',
                    icon: '🏍️',
                    description: 'Motorcycle taxi riders network in Uganda',
                    requirements: [
                        'Rider permit verification',
                        'Stage location proof',
                        'Rider association membership'
                    ],
                    rules: [
                        'Transport-focused loans',
                        'Stage-based meetings',
                        'Emergency repair loans'
                    ]
                }
            ],

            // Group creation process for Uganda
            creationProcess: {
                steps: [
                    {
                        step: 1,
                        title: 'Group Type Selection',
                        description: 'Choose appropriate group type for Uganda context'
                    },
                    {
                        step: 2,
                        title: 'Group Details',
                        description: 'Set group name, description, and Uganda location'
                    },
                    {
                        step: 3,
                        title: 'Initial Members',
                        description: 'Invite first 5 members (all must be Uganda residents)'
                    },
                    {
                        step: 4,
                        title: 'Group Rules',
                        description: 'Set Uganda-compliant lending rules'
                    },
                    {
                        step: 5,
                        title: 'Admin Verification',
                        description: 'Verify Uganda residency and identity'
                    }
                ],
                requirements: [
                    'Admin must be Uganda resident',
                    'All members must be Uganda residents',
                    'Minimum 5 members to start',
                    'Compliance with Uganda regulations'
                ]
            },

            // Group management features for Uganda
            management: {
                memberManagement: [
                    'Add/remove Uganda residents only',
                    'Member rating system',
                    'Activity monitoring',
                    'Communication tools'
                ],
                financialManagement: [
                    'Group lending statistics',
                    'Repayment tracking',
                    'Default monitoring',
                    'Performance analytics'
                ],
                disputeResolution: [
                    'Admin mediation',
                    'Platform escalation',
                    'Uganda law compliance',
                    'Fair hearing process'
                ]
            }
        };
    }

    /**
     * Get Uganda Emergency Hub Configuration
     */
    getEmergencyHubConfig() {
        return {
            categories: [
                {
                    id: 'ug-transport',
                    name: 'Transport Emergency',
                    icon: '🚌',
                    subcategories: [
                        {
                            name: 'Boda Boda Fare',
                            icon: '🏍️',
                            description: 'Emergency transport money for boda boda rides in Uganda',
                            typicalAmounts: [5000, 10000, 20000, 50000],
                            repayment: '7 days, 10% interest',
                            requirements: ['Boda boda stage verification', 'Trip destination']
                        },
                        {
                            name: 'Taxi/Bus Fare',
                            icon: '🚕',
                            description: 'Public transport emergency funds in Uganda',
                            typicalAmounts: [3000, 5000, 10000, 20000],
                            repayment: '7 days, 10% interest',
                            requirements: ['Route details', 'Time sensitivity']
                        }
                    ]
                },
                {
                    id: 'ug-utilities',
                    name: 'Utilities Emergency',
                    icon: '⚡',
                    subcategories: [
                        {
                            name: 'Electricity Tokens',
                            icon: '💡',
                            description: 'Emergency electricity token purchase in Uganda',
                            typicalAmounts: [5000, 10000, 20000, 50000],
                            repayment: '7 days, 10% interest',
                            requirements: ['UMEME account number', 'Meter number']
                        },
                        {
                            name: 'Water Bill',
                            icon: '🚰',
                            description: 'Emergency water bill payment in Uganda',
                            typicalAmounts: [10000, 15000, 25000, 50000],
                            repayment: '7 days, 10% interest',
                            requirements: ['NWSC account number', 'Bill copy']
                        }
                    ]
                },
                {
                    id: 'ug-education',
                    name: 'Education Emergency',
                    icon: '🎓',
                    subcategories: [
                        {
                            name: 'School Fees',
                            icon: '📚',
                            description: 'Emergency school fees payment in Uganda',
                            typicalAmounts: [50000, 100000, 250000, 500000],
                            repayment: '14-30 days, 10% interest',
                            requirements: ['School details', 'Student information', 'Fee structure']
                        },
                        {
                            name: 'School Requirements',
                            icon: '✏️',
                            description: 'Emergency school supplies in Uganda',
                            typicalAmounts: [10000, 20000, 30000, 50000],
                            repayment: '7 days, 10% interest',
                            requirements: ['School list', 'Item details']
                        }
                    ]
                },
                {
                    id: 'ug-medical',
                    name: 'Medical Emergency',
                    icon: '🏥',
                    subcategories: [
                        {
                            name: 'Hospital Bills',
                            icon: '💊',
                            description: 'Emergency medical treatment costs in Uganda',
                            typicalAmounts: [50000, 100000, 250000, 1000000],
                            repayment: '14-30 days, 10% interest',
                            requirements: ['Hospital details', 'Treatment estimate', 'Medical report']
                        },
                        {
                            name: 'Medication',
                            icon: '💉',
                            description: 'Emergency medication purchase in Uganda',
                            typicalAmounts: [10000, 20000, 50000, 100000],
                            repayment: '7 days, 10% interest',
                            requirements: ['Prescription', 'Pharmacy details']
                        }
                    ]
                }
            ],

            // Uganda-specific emergency loan process
            loanProcess: {
                steps: [
                    'Select Uganda emergency category',
                    'Choose Uganda-based lender from your groups',
                    'Specify amount in UGX',
                    'Provide emergency details',
                    'Await Uganda lender approval',
                    'Receive funds via Mobile Money/Bank',
                    'Repay within 7 days + 10% interest'
                ],
                requirements: [
                    'Must be Uganda resident',
                    'Must belong to Uganda-based group',
                    'Emergency must be genuine',
                    'Within category limits'
                ]
            },

            // Uganda emergency statistics
            statistics: {
                averageLoan: '75,000 UGX',
                averageRepayment: '6.2 days',
                defaultRate: '1.2%',
                popularCategory: 'Transport (42%)',
                busiestDay: 'Monday mornings',
                peakSeason: 'School opening weeks'
            }
        };
    }

    /**
     * Get Uganda Subscription Configuration
     */
    getSubscriptionConfig() {
        return {
            tiers: {
                basic: {
                    name: 'Basic Lender',
                    price: {
                        monthly: 20000, // UGX
                        annual: 200000, // UGX
                        description: '200,000 UGX annually (save 20,000 UGX)'
                    },
                    limits: {
                        weeklyLending: 1500000, // 1.5M UGX
                        maxLedgers: 10,
                        maxBorrowers: 10
                    },
                    features: [
                        'Lend up to 1.5M UGX per week',
                        'Create up to 10 ledgers',
                        'Basic borrower analytics',
                        'Email support',
                        'Uganda group access'
                    ],
                    restrictions: [
                        'No CRB access',
                        'Basic reporting only',
                        'Standard verification'
                    ]
                },
                premium: {
                    name: 'Premium Lender',
                    price: {
                        monthly: 100000, // UGX
                        annual: 1000000, // UGX
                        description: '1,000,000 UGX annually (save 200,000 UGX)'
                    },
                    limits: {
                        weeklyLending: 5000000, // 5M UGX
                        maxLedgers: 50,
                        maxBorrowers: 50
                    },
                    features: [
                        'Lend up to 5M UGX per week',
                        'Create up to 50 ledgers',
                        'Advanced analytics dashboard',
                        'Phone & email support',
                        'Priority borrower matching',
                        'Group performance insights'
                    ],
                    restrictions: [
                        'No CRB integration',
                        'Limited to Uganda operations'
                    ]
                },
                super: {
                    name: 'Super Lender',
                    price: {
                        monthly: 400000, // UGX
                        annual: 4000000, // UGX
                        description: '4,000,000 UGX annually (save 800,000 UGX)'
                    },
                    limits: {
                        weeklyLending: 20000000, // 20M UGX
                        maxLedgers: 'Unlimited',
                        maxBorrowers: 'Unlimited'
                    },
                    features: [
                        'Lend up to 20M UGX per week',
                        'Unlimited ledgers',
                        'CRB integration',
                        'Dedicated account manager',
                        '24/7 priority support',
                        'Advanced risk analytics',
                        'Bulk lending tools',
                        'Custom reporting'
                    ],
                    restrictions: [
                        'CRB check required',
                        'Enhanced due diligence'
                    ]
                }
            },

            // Uganda subscription management
            management: {
                billing: {
                    currency: 'UGX only',
                    methods: ['Mobile Money', 'Bank Transfer', 'Credit Card'],
                    cycle: '28th of each month',
                    autoRenew: 'Optional'
                },
                upgrade: {
                    allowed: 'Anytime',
                    prorated: 'Yes',
                    downgrade: 'End of billing cycle',
                    cancellation: '30 days notice'
                },
                expiry: {
                    gracePeriod: '7 days',
                    suspension: 'After grace period',
                    reactivation: 'Payment + admin review'
                }
            },

            // Uganda tax information
            tax: {
                vat: '18% VAT included',
                withholding: '6% withholding tax on interest',
                reporting: 'Annual tax certificate provided',
                compliance: 'Compliant with Uganda Revenue Authority'
            }
        };
    }

    /**
     * Get Uganda Blacklist Configuration
     */
    getBlacklistConfig() {
        return {
            criteria: {
                automatic: [
                    '60+ days overdue in Uganda',
                    'Multiple defaults across Uganda groups',
                    'Fraudulent activity in Uganda',
                    'Identity theft in Uganda'
                ],
                manual: [
                    'Lender request with evidence',
                    'Group admin recommendation',
                    'Platform investigation finding'
                ]
            },

            consequences: {
                immediate: [
                    'Cannot borrow from any Uganda group',
                    'Cannot join new Uganda groups',
                    'Public blacklist badge on profile',
                    'Notification to all Uganda lenders'
                ],
                longTerm: [
                    'Credit report marking in Uganda',
                    'Legal action for recovery',
                    'Debt collector referral',
                    'Permanent platform ban for severe cases'
                ]
            },

            removal: {
                conditions: [
                    'Full repayment (principal + interest + penalties)',
                    'Lender approval (if lender-initiated)',
                    'Platform admin review',
                    'Waiting period: 30 days after repayment'
                ],
                process: [
                    'Submit removal request',
                    'Provide repayment proof',
                    'Lender confirmation',
                    'Admin review and decision',
                    'Blacklist badge removal'
                ]
            },

            // Uganda blacklist statistics
            statistics: {
                totalBlacklisted: 'Updated monthly',
                recoveryRate: 'Percentage recovered',
                averageDebt: 'Average blacklisted amount in UGX',
                commonReasons: 'Top reasons for blacklisting in Uganda'
            }
        };
    }

    /**
     * Get Uganda Debt Collectors Configuration
     */
    getDebtCollectorsConfig() {
        return {
            vetting: {
                requirements: [
                    'Registered with Uganda Financial Intelligence Authority',
                    'Valid debt collection license in Uganda',
                    'Minimum 3 years experience in Uganda',
                    'Clean regulatory record in Uganda',
                    'Professional indemnity insurance'
                ],
                process: [
                    'Application submission',
                    'Document verification',
                    'Background check',
                    'Reference checks',
                    'Platform approval'
                ]
            },

            collectors: [
                {
                    id: 'ug-dc-001',
                    name: 'Uganda Debt Recovery Services',
                    contact: '+256 312 111 111',
                    email: 'info@ugandadrs.com',
                    areas: ['Kampala', 'Wakiso', 'Mukono'],
                    specialization: 'Commercial debt recovery',
                    rating: '★★★★☆ (4.2/5)'
                },
                {
                    id: 'ug-dc-002',
                    name: 'Kampala Collection Agency',
                    contact: '+256 414 222 222',
                    email: 'collections@kampalaca.com',
                    areas: ['Central Uganda'],
                    specialization: 'Consumer debt collection',
                    rating: '★★★☆☆ (3.8/5)'
                },
                {
                    id: 'ug-dc-003',
                    name: 'East African Recovery Bureau',
                    contact: '+256 752 333 333',
                    email: 'recovery@earb.co.ug',
                    areas: ['Nationwide Uganda'],
                    specialization: 'Legal recovery proceedings',
                    rating: '★★★★★ (4.7/5)'
                }
            ],

            engagement: {
                process: [
                    'Lender initiates collection request',
                  'Platform matches with appropriate collector',
                    'Collector contacts borrower',
                    'Recovery attempts (30-60 days)',
                    'Settlement or legal escalation'
                ],
                fees: [
                    'Success-based: 15-25% of recovered amount',
                    'No recovery, no fee (for most cases)',
                    'Legal costs additional if court action'
                ],
                rules: [
                    'Must comply with Uganda debt collection laws',
                    'No harassment or intimidation',
                    'Professional conduct required',
                    'Regular updates to lender'
                ]
            }
        };
    }

    /**
     * Get Uganda Country Badge Component
     */
    getCountryBadge() {
        return {
            html: `
<div class="uganda-country-badge" data-country="UG">
    <span class="uganda-flag">🇺🇬</span>
    <span class="uganda-name">Uganda</span>
    <span class="uganda-currency">(UGX)</span>
    <span class="uganda-isolation">🇺🇬 STRICT ISOLATION 🇺🇬</span>
</div>`,
            css: `
.uganda-country-badge {
    background: linear-gradient(135deg, #000000 0%, #FFD700 100%);
    color: #FFFFFF;
    padding: 8px 16px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    border: 2px solid #FFD700;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.uganda-country-badge .uganda-flag {
    font-size: 1.2em;
}

.uganda-country-badge .uganda-isolation {
    background: #FF0000;
    color: #FFFFFF;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8em;
    margin-left: 8px;
}`
        };
    }

    /**
     * Get Uganda Currency Display Component
     */
    getCurrencyDisplay() {
        return {
            format: (amount) => {
                return new Intl.NumberFormat('en-UG', {
                    style: 'currency',
                    currency: 'UGX',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            },
            html: (amount) => {
                return `<span class="ugx-amount" data-amount="${amount}">UGX ${amount.toLocaleString('en-UG')}</span>`;
            },
            css: `
.ugx-amount {
    font-weight: bold;
    color: #000000;
    background: #FFD700;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #000000;
}

.ugx-amount::before {
    content: 'USh ';
    font-weight: normal;
}`
        };
    }

    /**
     * Get Uganda Regulatory Banner Component
     */
    getRegulatoryBanner() {
        return {
            html: `
<div class="uganda-regulatory-banner">
    <div class="regulatory-content">
        <strong>🇺🇬 REGULATED IN UGANDA 🇺🇬</strong>
        <span>Licensed by Bank of Uganda | License No. MFI/001/2024</span>
        <span>Compliant with Uganda Financial Institutions Act</span>
    </div>
    <div class="regulatory-warning">
        ⚠️ STRICT UGANDA ISOLATION: No cross-country transactions allowed
    </div>
</div>`,
            css: `
.uganda-regulatory-banner {
    background: linear-gradient(to right, #000000, #FFD700);
    color: #FFFFFF;
    padding: 12px;
    border-radius: 8px;
    margin: 10px 0;
    border-left: 5px solid #FF0000;
}

.uganda-regulatory-banner .regulatory-content {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
    margin-bottom: 8px;
}

.uganda-regulatory-banner .regulatory-warning {
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid #FF0000;
    padding: 8px;
    border-radius: 4px;
    font-size: 0.9em;
}`
        };
    }

    /**
     * Get Uganda Isolation Warning Component
     */
    getIsolationWarning() {
        return {
            html: `
<div class="uganda-isolation-warning">
    <div class="warning-header">
        <span class="warning-icon">⚠️</span>
        <span class="warning-title">UGANDA ISOLATION ENFORCED</span>
    </div>
    <div class="warning-rules">
        <p><strong>STRICT RULES:</strong></p>
        <ul>
            <li>❌ NO cross-country lending/borrowing</li>
            <li>🔒 Groups restricted to Uganda residents only</li>
            <li>💰 All transactions in UGX only</li>
            <li>⚖️ Uganda law applies exclusively</li>
            <li>🚫 Violations result in permanent ban</li>
        </ul>
    </div>
</div>`,
            css: `
.uganda-isolation-warning {
    background: linear-gradient(135deg, #FF0000 0%, #8B0000 100%);
    color: #FFFFFF;
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
    border: 2px solid #FFD700;
}

.uganda-isolation-warning .warning-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    font-size: 1.1em;
    font-weight: bold;
}

.uganda-isolation-warning .warning-rules ul {
    margin: 10px 0;
    padding-left: 20px;
}

.uganda-isolation-warning .warning-rules li {
    margin: 5px 0;
    padding-left: 5px;
}`
        };
    }

    /**
     * Get all Uganda pages configuration
     */
    getAllPages() {
        return {
            country: {
                code: this.countryCode,
                name: this.countryName,
                currency: this.currency
            },
            pages: this.pages,
            components: this.components,
            hierarchy: this.getHierarchyEnforcement(),
            validation: this.validatePages(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Validate Uganda pages configuration
     */
    validatePages() {
        const validations = [];

        // Check for Uganda-specific content
        if (!this.pages.dashboard.borrower.title.includes('Uganda')) {
            validations.push('Borrower dashboard must specify Uganda');
        }
        
        if (!this.pages.dashboard.lender.title.includes('Uganda')) {
            validations.push('Lender dashboard must specify Uganda');
        }

        // Check currency consistency
        if (this.currency !== 'UGX') {
            validations.push('Currency must be UGX for Uganda');
        }

        // Check for isolation warnings
        const hasIsolationWarning = JSON.stringify(this.components.isolationWarning)
            .includes('NO cross-country');
        if (!hasIsolationWarning) {
            validations.push('Must include cross-country isolation warning');
        }

        return {
            isValid: validations.length === 0,
            validations,
            passed: validations.length === 0,
            failedCount: validations.length
        };
    }

    /**
     * Get hierarchy enforcement for Uganda pages
     */
    getHierarchyEnforcement() {
        return {
            strictHierarchy: [
                'LEVEL 1: Global M-Pesewa Platform',
                'LEVEL 2: Uganda Country Instance',
                'LEVEL 3: Uganda-based Groups (Invitation-only)',
                'LEVEL 4: Uganda Lenders (Subscription-required)',
                'LEVEL 5: Uganda Borrowers (Group-restricted)'
            ],
            enforcementRules: [
                'ALL transactions within Uganda borders only',
                'ALL groups composed of Uganda residents only',
                'ALL lenders verified Uganda entities only',
                'ALL borrowers Uganda residents with Uganda ID only',
                'ALL currency in UGX only',
                'ALL disputes under Uganda jurisdiction only'
            ],
            violationPenalties: [
                'First offense: Warning and transaction reversal',
                'Second offense: 30-day suspension',
                'Third offense: Permanent ban and blacklisting',
                'Fraud attempt: Legal prosecution under Uganda law'
            ]
        };
    }

    /**
     * Initialize Uganda pages
     */
    initialize() {
        console.log(`📄 Initializing M-Pesewa Uganda Pages...`);
        
        const validation = this.validatePages();
        
        if (!validation.isValid) {
            console.error('❌ Uganda pages validation failed:');
            validation.validations.forEach(v => console.error(`   - ${v}`));
            throw new Error('Uganda pages configuration validation failed');
        }
        
        console.log('✅ Uganda pages validated successfully');
        console.log(`📊 Dashboard pages: ${Object.keys(this.pages).length}`);
        console.log(`🎨 UI components: ${Object.keys(this.components).length}`);
        console.log(`💰 Currency: ${this.currency}`);
        console.log(`🔒 Isolation: STRICT ENFORCED`);
        
        return this.getAllPages();
    }
}

// Create and export Uganda pages
const ugandaPages = new UgandaPages();
export default ugandaPages;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ugandaPages;
}