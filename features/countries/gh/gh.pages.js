/**
 * M-PESEWA GHANA COUNTRY PAGES
 * Country-specific page configurations and content
 * Last Updated: 2024
 * Version: 1.0.0
 * 
 * ✅ STRICT ISOLATION: Ghana-only content and navigation
 * ✅ HIERARCHY ENFORCEMENT: Global → Ghana → Groups → Lenders → Borrowers
 * ✅ LOCALIZATION: Ghana-specific content, examples, and context
 */

const GHANA_PAGES = {
    // ============================================
    // 1️⃣ COUNTRY LANDING PAGE
    // ============================================
    landing: {
        meta: {
            title: 'M-Pesewa Ghana | Emergency Loans in Trusted Circles',
            description: 'Peer-to-peer emergency lending platform for Ghana. Borrow from trusted friends and family within your community circles.',
            keywords: 'Ghana loans, emergency loans Ghana, peer-to-peer lending Ghana, trusted circles Ghana, Accra loans, Kumasi lending',
            canonical: 'https://mpesewa.com.gh',
            ogImage: '/assets/images/gh/og-image.jpg',
            twitterCard: 'summary_large_image'
        },

        hero: {
            title: 'Emergency Lending, Ghanaian Style',
            subtitle: 'Connect with trusted community members for fast, fair loans when you need them most.',
            background: '/assets/images/gh/accra-skyline.jpg',
            ctaPrimary: {
                text: 'Start Borrowing',
                link: '/gh/borrower/register',
                color: '#f37021'
            },
            ctaSecondary: {
                text: 'Become a Lender',
                link: '/gh/lender/register',
                color: '#28a745'
            },
            stats: [
                { value: '15,000+', label: 'Ghanaian Users' },
                { value: 'GH₵5M+', label: 'Total Loans Facilitated' },
                { value: '99%', label: 'Repayment Rate' },
                { value: '200+', label: 'Active Groups' }
            ]
        },

        features: [
            {
                icon: '🇬🇭',
                title: 'Ghana-First Design',
                description: 'Built specifically for Ghanaian communities, culture, and financial needs.',
                details: [
                    'Local currency (Ghanaian Cedi)',
                    'Ghana Card integration',
                    'Mobile money optimized',
                    'Local language support'
                ]
            },
            {
                icon: '🤝',
                title: 'Trust-Based Circles',
                description: 'Lend and borrow within trusted groups of friends, family, or colleagues.',
                details: [
                    'Invitation-only groups',
                    'Community accountability',
                    'Reputation building',
                    'Group-specific rules'
                ]
            },
            {
                icon: '⚡',
                title: 'Emergency Focus',
                description: 'Quick access to funds for urgent, real-life situations.',
                details: [
                    '20+ emergency categories',
                    '7-day repayment terms',
                    '10% fair interest',
                    'Same-day disbursement'
                ]
            },
            {
                icon: '🛡️',
                title: 'Bank of Ghana Compliant',
                description: 'Operates within Ghanaian financial regulations.',
                details: [
                    'Data Protection Act compliance',
                    'AML/CFT regulations',
                    'Tax compliant',
                    'Consumer protection'
                ]
            }
        ],

        testimonials: [
            {
                quote: "When my taxi broke down in Accra, I borrowed GH₵500 from my church group. Repaid in 7 days with interest. Simple and fair.",
                author: "Kwame Osei, Taxi Driver",
                location: "Accra",
                image: "/assets/images/gh/testimonials/kwame.jpg"
            },
            {
                quote: "As a small trader in Kumasi Central Market, I use M-Pesewa for working capital. My group members know me, so approval is fast.",
                author: "Ama Serwaa, Market Trader",
                location: "Kumasi",
                image: "/assets/images/gh/testimonials/ama.jpg"
            },
            {
                quote: "I lend to my extended family members. The platform helps me track everything properly and earn some interest while helping.",
                author: "Yaw Mensah, Teacher & Lender",
                location: "Takoradi",
                image: "/assets/images/gh/testimonials/yaw.jpg"
            }
        ],

        emergencyExamples: [
            {
                category: 'Transport',
                examples: [
                    'Trotro fare to work',
                    'Fuel for private car',
                    'Taxi to hospital',
                    'Inter-city bus fare'
                ],
                icon: '🚌',
                color: '#0099ff'
            },
            {
                category: 'Utilities',
                examples: [
                    'ECG prepaid tokens',
                    'Water bill payment',
                    'Internet data bundle',
                    'Cooking gas refill'
                ],
                icon: '⚡',
                color: '#28a745'
            },
            {
                category: 'Health',
                examples: [
                    'NHIS co-payment',
                    'Emergency medication',
                    'Lab test fees',
                    'Ambulance transport'
                ],
                icon: '🏥',
                color: '#dc3545'
            },
            {
                category: 'Education',
                examples: [
                    'School fees balance',
                    'Books and supplies',
                    'Exam registration',
                    'Transport to school'
                ],
                icon: '🎓',
                color: '#6f42c1'
            }
        ]
    },

    // ============================================
    // 2️⃣ BORROWER PAGES
    // ============================================
    borrower: {
        dashboard: {
            title: 'Borrower Dashboard | Ghana',
            sections: {
                activeLoans: {
                    title: 'Your Active Loans',
                    emptyState: 'You have no active loans. Apply for your first emergency loan.',
                    columns: [
                        'Loan Purpose',
                        'Amount (GH₵)',
                        'Lender',
                        'Due Date',
                        'Status',
                        'Actions'
                    ]
                },
                loanLimits: {
                    title: 'Your Borrowing Limits',
                    limits: {
                        maxPerLoan: 'GH₵20,000',
                        maxActiveLoans: 1,
                        maxWeeklyBorrowing: 'GH₵5,000',
                        availableToday: 'Calculated based on rating'
                    }
                },
                reputation: {
                    title: 'Your Trust Rating',
                    factors: [
                        'On-time repayments',
                        'Group participation',
                        'Loan history',
                        'Lender feedback'
                    ],
                    badgeLevels: {
                        excellent: '⭐️⭐️⭐️⭐️⭐️ (Access to 4 groups)',
                        good: '⭐️⭐️⭐️⭐️ (Access to 3 groups)',
                        fair: '⭐️⭐️⭐️ (Access to 2 groups)',
                        new: '⭐️⭐️ (Access to 1 group)'
                    }
                },
                groups: {
                    title: 'Your Trusted Groups',
                    maxGroups: 4,
                    joinInstructions: 'Groups are invitation-only. Ask a group admin to invite you.'
                }
            }
        },

        apply: {
            title: 'Apply for Emergency Loan | Ghana',
            steps: [
                {
                    number: 1,
                    title: 'Select Emergency Category',
                    description: 'Choose from 20+ approved emergency categories',
                    icon: '📋'
                },
                {
                    number: 2,
                    title: 'Choose Trusted Group',
                    description: 'Select which group to borrow from',
                    icon: '👥'
                },
                {
                    number: 3,
                    title: 'Enter Loan Details',
                    description: 'Amount, purpose, and repayment plan',
                    icon: '💰'
                },
                {
                    number: 4,
                    title: 'Submit for Approval',
                    description: 'Lenders in your group review and approve',
                    icon: '✅'
                }
            ],
            categories: {
                transport: [
                    { id: 'trotro', name: 'Trotro/Mini-bus Fare', maxAmount: 500 },
                    { id: 'taxi', name: 'Taxi Fare', maxAmount: 300 },
                    { id: 'fuel', name: 'Fuel for Vehicle', maxAmount: 1000 },
                    { id: 'intercity', name: 'Inter-City Transport', maxAmount: 2000 }
                ],
                utilities: [
                    { id: 'ecg', name: 'ECG Electricity Tokens', maxAmount: 500 },
                    { id: 'water', name: 'Water Bill', maxAmount: 300 },
                    { id: 'internet', name: 'Internet Data', maxAmount: 200 },
                    { id: 'gas', name: 'Cooking Gas', maxAmount: 400 }
                ],
                health: [
                    { id: 'nhis', name: 'NHIS Co-payment', maxAmount: 1000 },
                    { id: 'medicine', name: 'Medication', maxAmount: 500 },
                    { id: 'lab', name: 'Laboratory Tests', maxAmount: 800 },
                    { id: 'emergency', name: 'Emergency Transport', maxAmount: 1500 }
                ],
                education: [
                    { id: 'fees', name: 'School Fees', maxAmount: 5000 },
                    { id: 'books', name: 'Books & Supplies', maxAmount: 1000 },
                    { id: 'exam', name: 'Exam Registration', maxAmount: 500 },
                    { id: 'uniform', name: 'School Uniform', maxAmount: 800 }
                ],
                business: [
                    { id: 'stock', name: 'Business Stock', maxAmount: 3000 },
                    { id: 'capital', name: 'Working Capital', maxAmount: 5000 },
                    { id: 'repair', name: 'Tool/Equipment Repair', maxAmount: 2000 },
                    { id: 'rent', name: 'Business Rent', maxAmount: 4000 }
                ]
            },
            calculator: {
                title: 'Loan Calculator',
                defaultAmount: 1000,
                interestRate: 0.10,
                period: 7,
                formula: 'Amount + (Amount × 10%) = Total Repayment',
                examples: [
                    { amount: 500, total: 550, daily: 78.57 },
                    { amount: 1000, total: 1100, daily: 157.14 },
                    { amount: 5000, total: 5500, daily: 785.71 }
                ]
            }
        },

        history: {
            title: 'Borrowing History | Ghana',
            filters: {
                status: ['All', 'Active', 'Paid', 'Defaulted', 'Cancelled'],
                period: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year', 'All time'],
                amount: ['Under GH₵500', 'GH₵500-2000', 'GH₵2000-5000', 'Over GH₵5000']
            },
            exportOptions: ['PDF', 'Excel', 'CSV'],
            statistics: {
                totalBorrowed: 'Total borrowed (GH₵)',
                totalRepaid: 'Total repaid (GH₵)',
                avgInterest: 'Average interest rate',
                onTimeRate: 'On-time repayment rate'
            }
        }
    },

    // ============================================
    // 3️⃣ LENDER PAGES
    // ============================================
    lender: {
        dashboard: {
            title: 'Lender Dashboard | Ghana',
            overview: {
                totalLent: 'Total Amount Lent (GH₵)',
                activeBorrowers: 'Active Borrowers',
                outstandingBalance: 'Outstanding Balance (GH₵)',
                expectedInterest: 'Expected Interest (GH₵)',
                reputationScore: 'Lender Rating'
            },
            quickActions: [
                { icon: '➕', label: 'New Ledger', action: 'createLedger' },
                { icon: '📊', label: 'View Portfolio', action: 'viewPortfolio' },
                { icon: '⏰', label: 'Due Today', action: 'dueToday' },
                { icon: '⚠️', label: 'Overdue', action: 'overdue' }
            ],
            subscription: {
                status: 'Active / Expiring / Expired',
                level: 'Basic / Premium / Super',
                expiry: '28th of month',
                limit: 'Weekly lending limit (GH₵)',
                renewButton: 'Renew Subscription'
            }
        },

        portfolio: {
            title: 'Lending Portfolio | Ghana',
            tabs: ['Active Loans', 'Paid Loans', 'Defaulted', 'All'],
            columns: [
                'Borrower',
                'Amount (GH₵)',
                'Category',
                'Date Lent',
                'Due Date',
                'Interest',
                'Status',
                'Actions'
            ],
            analytics: {
                distribution: 'Loan distribution by category',
                performance: 'Repayment performance',
                risk: 'Risk assessment by borrower',
                trends: 'Lending trends over time'
            },
            bulkActions: ['Send Reminders', 'Export Data', 'Mark Multiple Paid']
        },

        ledger: {
            title: 'Ledger Management | Ghana',
            create: {
                fields: [
                    { name: 'borrowerName', label: 'Borrower Full Name', required: true },
                    { name: 'borrowerPhone', label: 'Phone Number (+233...)', required: true },
                    { name: 'borrowerLocation', label: 'Location in Ghana', required: true },
                    { name: 'guarantor1', label: 'First Guarantor', required: true },
                    { name: 'guarantor2', label: 'Second Guarantor', required: true },
                    { name: 'loanCategory', label: 'Loan Category', type: 'select', required: true },
                    { name: 'amount', label: 'Amount (GH₵)', type: 'number', min: 5, max: 50000, required: true },
                    { name: 'purpose', label: 'Specific Purpose', type: 'textarea', required: true }
                ],
                autoCalculate: true,
                terms: '7 days, 10% interest, 5% daily penalty after 7 days'
            },
            view: {
                sections: [
                    'Loan Details',
                    'Repayment Schedule',
                    'Payment History',
                    'Communication Log',
                    'Guarantor Details',
                    'Documents'
                ],
                actions: [
                    'Record Payment',
                    'Send Reminder',
                    'Update Status',
                    'Add Note',
                    'Export Ledger',
                    'Mark as Paid'
                ]
            }
        }
    },

    // ============================================
    // 4️⃣ GROUP PAGES
    // ============================================
    group: {
        dashboard: {
            title: 'Group Dashboard | Ghana',
            stats: {
                totalMembers: 'Total Members',
                activeLenders: 'Active Lenders',
                activeBorrowers: 'Active Borrowers',
                totalLent: 'Total Lent (GH₵)',
                repaymentRate: 'Group Repayment Rate',
                defaultRate: 'Group Default Rate'
            },
            members: {
                columns: ['Name', 'Role', 'Status', 'Rating', 'Join Date', 'Actions'],
                filters: ['All', 'Lenders', 'Borrowers', 'Active', 'Inactive'],
                actions: ['View Profile', 'Send Message', 'Remove Member']
            },
            activity: {
                recentLoans: 'Recent Loans',
                recentRepayments: 'Recent Repayments',
                upcomingDue: 'Upcoming Due Dates',
                disputes: 'Active Disputes'
            }
        },

        create: {
            title: 'Create New Group | Ghana',
            steps: [
                {
                    step: 1,
                    title: 'Group Details',
                    fields: [
                        { name: 'groupName', label: 'Group Name', placeholder: 'e.g., Adenta Family Group' },
                        { name: 'groupType', label: 'Group Type', type: 'select', options: [
                            'Family', 'Church', 'Professional', 'Community', 'Social', 'Business', 'Alumni', 'Neighborhood'
                        ]},
                        { name: 'description', label: 'Group Description', type: 'textarea' }
                    ]
                },
                {
                    step: 2,
                    title: 'Group Rules',
                    fields: [
                        { name: 'maxLoanAmount', label: 'Maximum Loan (GH₵)', type: 'number' },
                        { name: 'minRating', label: 'Minimum Rating Required', type: 'select', options: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'] },
                        { name: 'approvalProcess', label: 'Loan Approval Process', type: 'select', options: ['Admin Only', 'All Lenders', 'Majority Vote'] }
                    ]
                },
                {
                    step: 3,
                    title: 'Invite Members',
                    description: 'Invite at least 4 other members to start your group',
                    fields: [
                        { name: 'invitees', label: 'Invite by Phone/Email', type: 'tags' }
                    ]
                }
            ],
            requirements: [
                'Minimum 5 members to activate',
                'Admin must be Ghana resident',
                'All members must be in Ghana',
                'Group name must be appropriate'
            ]
        },

        settings: {
            title: 'Group Settings | Ghana',
            sections: {
                general: [
                    'Group Name',
                    'Group Type',
                    'Description',
                    'Visibility'
                ],
                rules: [
                    'Loan Approval Process',
                    'Maximum Loan Amount',
                    'Minimum Borrower Rating',
                    'Default Penalties'
                ],
                membership: [
                    'Invitation Settings',
                    'Approval Required',
                    'Maximum Members',
                    'Member Removal Rules'
                ],
                notifications: [
                    'Loan Request Alerts',
                    'Due Date Reminders',
                    'New Member Alerts',
                    'Dispute Notifications'
                ]
            }
        }
    },

    // ============================================
    // 5️⃣ EMERGENCY HUB PAGES
    // ============================================
    emergency: {
        categories: {
            transport: {
                title: 'Transport Emergencies | Ghana',
                description: 'When you need to move but lack the fare',
                commonScenarios: [
                    'Stranded without trotro fare',
                    'Car ran out of fuel',
                    'Need taxi to emergency',
                    'Inter-city travel for family emergency'
                ],
                averageAmounts: {
                    trotro: 'GH₵5-20',
                    taxi: 'GH₵20-50',
                    fuel: 'GH₵100-500',
                    intercity: 'GH₵50-200'
                },
                lenders: 'Transport-focused lenders available'
            },

            utilities: {
                title: 'Utility Emergencies | Ghana',
                description: 'When essential services are about to be cut off',
                commonScenarios: [
                    'ECG tokens expired',
                    'Water bill overdue',
                    'Internet data exhausted',
                    'Cooking gas empty'
                ],
                providers: [
                    'ECG (Electricity Company of Ghana)',
                    'GWCL (Ghana Water Company)',
                    'MTN, Vodafone, AirtelTigo',
                    'Gas companies and vendors'
                ],
                averageAmounts: {
                    electricity: 'GH₵50-200',
                    water: 'GH₵30-100',
                    internet: 'GH₵20-100',
                    gas: 'GH₵80-300'
                }
            },

            health: {
                title: 'Health Emergencies | Ghana',
                description: 'When health comes first and funds are short',
                commonScenarios: [
                    'NHIS doesn\'t cover full bill',
                    'Emergency medication needed',
                    'Lab tests required',
                    'Transport to hospital'
                ],
                nhisInfo: 'National Health Insurance Scheme covers basic care',
                averageAmounts: {
                    coPayment: 'GH₵50-500',
                    medication: 'GH₵20-300',
                    labTests: 'GH₵100-1000',
                    transport: 'GH₵50-500'
                }
            },

            education: {
                title: 'Education Emergencies | Ghana',
                description: 'When education expenses can\'t wait for payday',
                commonScenarios: [
                    'School fees balance due',
                    'Books and supplies needed',
                    'Exam registration deadline',
                    'School trip contribution'
                ],
                institutions: [
                    'Basic schools (public and private)',
                    'Senior High Schools',
                    'Universities',
                    'Vocational institutes'
                ],
                averageAmounts: {
                    feesBalance: 'GH₵100-5000',
                    books: 'GH₵50-500',
                    exam: 'GH₵50-300',
                    uniform: 'GH₵100-500'
                }
            }
        }
    },

    // ============================================
    // 6️⃣ SUBSCRIPTION PAGES
    // ============================================
    subscription: {
        plans: {
            title: 'Subscription Plans | Ghana',
            tiers: {
                basic: {
                    name: 'Basic',
                    priceMonthly: 'GH₵50/month',
                    priceAnnual: 'GH₵500/year',
                    limit: 'Up to GH₵1,500 per week',
                    features: [
                        'Basic lending tools',
                        'Up to 10 borrowers',
                        'Manual ledger management',
                        'Email support',
                        'Basic reporting'
                    ],
                    bestFor: 'New lenders starting out'
                },
                premium: {
                    name: 'Premium',
                    priceMonthly: 'GH₵250/month',
                    priceAnnual: 'GH₵2,500/year',
                    limit: 'Up to GH₵5,000 per week',
                    features: [
                        'Advanced lending tools',
                        'Up to 50 borrowers',
                        'Automated reminders',
                        'Priority support',
                        'Advanced analytics',
                        'Mobile app access'
                    ],
                    bestFor: 'Active community lenders'
                },
                super: {
                    name: 'Super',
                    priceMonthly: 'GH₵1,000/month',
                    priceAnnual: 'GH₵8,500/year',
                    limit: 'Up to GH₵20,000 per week',
                    features: [
                        'Premium lending tools',
                        'Unlimited borrowers',
                        'CRB integration',
                        '24/7 phone support',
                        'Custom reporting',
                        'Dedicated account manager',
                        'API access'
                    ],
                    bestFor: 'Professional lenders & institutions'
                }
            },
            comparison: {
                features: [
                    'Weekly Lending Limit',
                    'Number of Borrowers',
                    'CRB Integration',
                    'Support Level',
                    'Reporting Tools',
                    'Mobile App'
                ],
                basic: ['GH₵1,500', 'Up to 10', 'No', 'Email', 'Basic', 'Limited'],
                premium: ['GH₵5,000', 'Up to 50', 'No', 'Priority', 'Advanced', 'Full'],
                super: ['GH₵20,000', 'Unlimited', 'Yes', '24/7 Phone', 'Custom', 'Full + API']
            }
        },

        payment: {
            title: 'Payment Methods | Ghana',
            methods: [
                {
                    name: 'MTN Mobile Money',
                    icon: '/assets/images/gh/payment/mtn.png',
                    steps: [
                        'Dial *170#',
                        'Select "Send Money"',
                        'Enter merchant number: 059 123 4567',
                        'Enter amount',
                        'Enter reference: MPESEWA-{yourID}'
                    ],
                    processingTime: 'Instant'
                },
                {
                    name: 'Vodafone Cash',
                    icon: '/assets/images/gh/payment/vodafone.png',
                    steps: [
                        'Dial *110#',
                        'Select "Pay Bill"',
                        'Enter merchant code: 123456',
                        'Enter amount',
                        'Enter reference: MPESEWA-{yourID}'
                    ],
                    processingTime: 'Instant'
                },
                {
                    name: 'Bank Transfer',
                    icon: '/assets/images/gh/payment/bank.png',
                    details: [
                        'Bank: Ghana Commercial Bank',
                        'Account: 1234567890',
                        'Account Name: M-Pesewa Ghana',
                        'Branch: Accra Main',
                        'Reference: MPESEWA-{yourID}'
                    ],
                    processingTime: '1-2 business days'
                }
            ],
            receipt: {
                autoGenerated: true,
                emailDelivery: true,
                download: true,
                validity: '30 days',
                vatIncluded: true
            }
        }
    },

    // ============================================
    // 7️⃣ HELP & SUPPORT PAGES
    // ============================================
    help: {
        faq: {
            title: 'FAQs | Ghana',
            categories: {
                general: [
                    {
                        q: 'Is M-Pesewa licensed by Bank of Ghana?',
                        a: 'M-Pesewa operates as a technology platform facilitating peer-to-peer lending and does not require a banking license as we do not hold or transmit funds. We are registered with the Data Protection Commission and comply with all relevant Ghanaian regulations.'
                    },
                    {
                        q: 'What documents do I need to register?',
                        a: 'For Ghanaian residents: Ghana Card or Passport, proof of address (utility bill), and phone number verification. Non-residents: Passport, Ghanaian address proof, and additional identification may be required.'
                    },
                    {
                        q: 'How are disputes resolved?',
                        a: 'Disputes are first handled within the group by the admin. If unresolved, our Ghana-based mediation team assists. As last resort, arbitration in Accra under Ghana Arbitration Centre rules.'
                    }
                ],
                borrowing: [
                    {
                        q: 'What is the maximum I can borrow?',
                        a: 'Depends on your rating and group rules. Maximum platform limit is GH₵20,000 for Super tier borrowers, but individual groups may set lower limits.'
                    },
                    {
                        q: 'How quickly can I get a loan?',
                        a: 'Once approved by a lender in your group, funds are typically disbursed same day via mobile money or within 24 hours for bank transfers.'
                    },
                    {
                        q: 'What happens if I cannot repay on time?',
                        a: 'Contact your lender immediately. After 7 days, a 5% daily penalty applies. After 60 days, the loan goes into default and you may be blacklisted.'
                    }
                ],
                lending: [
                    {
                        q: 'How do I choose who to lend to?',
                        a: 'Review borrower ratings, repayment history, and group reputation. You can also check their guarantors and communicate directly before lending.'
                    },
                    {
                        q: 'What if a borrower defaults?',
                        a: 'You can initiate blacklisting after 60 days. We provide access to registered debt collectors and legal support options in Ghana.'
                    },
                    {
                        q: 'How is interest calculated?',
                        a: '10% flat interest for 7 days. For example: GH₵1,000 loan repays GH₵1,100 after 7 days. No compounding unless overdue.'
                    }
                ]
            }
        },

        contact: {
            title: 'Contact Us | Ghana',
            channels: {
                phone: {
                    primary: '+233 24 000 0000',
                    hours: 'Monday-Friday: 8AM-8PM GMT, Saturday: 9AM-6PM GMT',
                    departments: [
                        'Customer Support: Ext 1',
                        'Technical Support: Ext 2',
                        'Compliance: Ext 3',
                        'Business Development: Ext 4'
                    ]
                },
                email: {
                    support: 'support@mpesewa.com.gh',
                    compliance: 'compliance@mpesewa.com.gh',
                    legal: 'legal@mpesewa.com.gh',
                    partnerships: 'partners@mpesewa.com.gh'
                },
                address: {
                    office: 'M-Pesewa Ghana, 123 Independence Avenue, Airport City, Accra, Ghana',
                    postal: 'P.O. Box GP 123, Accra, Ghana',
                    hours: 'Monday-Friday: 8:30AM-5:30PM'
                },
                social: {
                    facebook: 'M-Pesewa Ghana',
                    twitter: '@mpesewa_gh',
                    instagram: 'mpesewa_ghana',
                    linkedin: 'M-Pesewa Ghana'
                }
            },
            regionalOffices: [
                {
                    city: 'Kumasi',
                    address: 'Prempeh II Street, Adum, Kumasi',
                    phone: '+233 32 000 0000',
                    manager: 'Mr. Kwame Asante'
                },
                {
                    city: 'Tamale',
                    address: 'Central Business District, Tamale',
                    phone: '+233 37 000 0000',
                    manager: 'Ms. Fatima Abdulai'
                },
                {
                    city: 'Takoradi',
                    address: 'Market Circle, Takoradi',
                    phone: '+233 31 000 0000',
                    manager: 'Mr. Kofi Mensah'
                }
            ]
        }
    },

    // ============================================
    // 8️⃣ LEGAL & COMPLIANCE PAGES
    // ============================================
    legal: {
        terms: {
            title: 'Terms & Conditions | Ghana',
            sections: [
                {
                    title: 'Governing Law',
                    content: 'These terms are governed by the laws of Ghana. Any disputes shall be subject to the exclusive jurisdiction of the courts of Ghana.'
                },
                {
                    title: 'User Eligibility',
                    content: 'You must be at least 18 years old, resident in Ghana, and possess a valid Ghana Card or passport to use our services.'
                },
                {
                    title: 'Platform Role',
                    content: 'M-Pesewa is a technology platform only. We do not lend money, guarantee repayments, or hold funds. All transactions are between users.'
                },
                {
                    title: 'Interest & Fees',
                    content: 'Maximum interest rate is 10% per week. No hidden fees. Penalty rate is 5% daily after 7 days overdue.'
                },
                {
                    title: 'Data Protection',
                    content: 'We comply with Data Protection Act, 2012 (Act 843). Your data is protected and only shared as necessary for service provision.'
                }
            ],
            download: {
                pdf: '/legal/gh/terms.pdf',
                lastUpdated: 'January 1, 2024'
            }
        },

        privacy: {
            title: 'Privacy Policy | Ghana',
            highlights: [
                'Registered with Data Protection Commission Ghana',
                'Data stored on secure servers in Ghana',
                'Right to access, correct, and delete your data',
                'Data retention: 7 years minimum',
                'No sale of personal data to third parties'
            ],
            dpo: {
                name: 'Data Protection Officer',
                email: 'dpo@mpesewa.com.gh',
                phone: '+233 24 000 0001'
            }
        }
    }
};

// ============================================
// PAGE UTILITIES & FUNCTIONS
// ============================================

/**
 * Generate Ghana-specific page breadcrumbs
 * @param {string} pagePath - Current page path
 * @returns {Array} Breadcrumb trail
 */
function generateGhanaBreadcrumbs(pagePath) {
    const base = [
        { name: 'Home', path: '/gh' },
        { name: 'Ghana', path: '/gh' }
    ];

    const pathMap = {
        '/gh/borrower': { name: 'Borrower', parent: null },
        '/gh/borrower/dashboard': { name: 'Dashboard', parent: '/gh/borrower' },
        '/gh/borrower/apply': { name: 'Apply for Loan', parent: '/gh/borrower' },
        '/gh/borrower/history': { name: 'Borrowing History', parent: '/gh/borrower' },
        
        '/gh/lender': { name: 'Lender', parent: null },
        '/gh/lender/dashboard': { name: 'Dashboard', parent: '/gh/lender' },
        '/gh/lender/portfolio': { name: 'Portfolio', parent: '/gh/lender' },
        '/gh/lender/ledger': { name: 'Ledger Management', parent: '/gh/lender' },
        
        '/gh/group': { name: 'Groups', parent: null },
        '/gh/group/dashboard': { name: 'Group Dashboard', parent: '/gh/group' },
        '/gh/group/create': { name: 'Create Group', parent: '/gh/group' },
        '/gh/group/settings': { name: 'Group Settings', parent: '/gh/group' },
        
        '/gh/emergency': { name: 'Emergency Hub', parent: null },
        '/gh/emergency/transport': { name: 'Transport', parent: '/gh/emergency' },
        '/gh/emergency/utilities': { name: 'Utilities', parent: '/gh/emergency' },
        '/gh/emergency/health': { name: 'Health', parent: '/gh/emergency' },
        '/gh/emergency/education': { name: 'Education', parent: '/gh/emergency' },
        
        '/gh/subscription': { name: 'Subscriptions', parent: null },
        '/gh/subscription/plans': { name: 'Plans', parent: '/gh/subscription' },
        '/gh/subscription/payment': { name: 'Payment', parent: '/gh/subscription' },
        
        '/gh/help': { name: 'Help & Support', parent: null },
        '/gh/help/faq': { name: 'FAQs', parent: '/gh/help' },
        '/gh/help/contact': { name: 'Contact Us', parent: '/gh/help' },
        
        '/gh/legal': { name: 'Legal', parent: null },
        '/gh/legal/terms': { name: 'Terms & Conditions', parent: '/gh/legal' },
        '/gh/legal/privacy': { name: 'Privacy Policy', parent: '/gh/legal' }
    };

    const current = pathMap[pagePath];
    if (!current) return base;

    const breadcrumbs = [...base];
    
    if (current.parent) {
        const parent = pathMap[current.parent];
        if (parent) {
            breadcrumbs.push({ name: parent.name, path: current.parent });
        }
    }
    
    breadcrumbs.push({ name: current.name, path: pagePath, current: true });
    
    return breadcrumbs;
}

/**
 * Generate page title with Ghana context
 * @param {string} pageKey - Page identifier
 * @param {Object} context - Additional context
 * @returns {string} Complete page title
 */
function generateGhanaPageTitle(pageKey, context = {}) {
    const baseTitles = {
        'landing': 'M-Pesewa Ghana | Emergency Loans in Trusted Circles',
        'borrower.dashboard': 'Borrower Dashboard | M-Pesewa Ghana',
        'borrower.apply': 'Apply for Emergency Loan | Ghana',
        'lender.dashboard': 'Lender Dashboard | M-Pesewa Ghana',
        'group.dashboard': 'Group Dashboard | Ghana',
        'emergency.transport': 'Transport Emergencies | Ghana',
        'subscription.plans': 'Subscription Plans | Ghana'
    };

    let title = baseTitles[pageKey] || 'M-Pesewa Ghana';
    
    if (context.groupName) {
        title = `${context.groupName} | ${title}`;
    }
    
    if (context.amount) {
        title = `Loan of GH₵${context.amount} | ${title}`;
    }
    
    return title;
}

/**
 * Generate Ghana-specific meta tags
 * @param {string} pageKey - Page identifier
 * @returns {Object} Meta tags object
 */
function generateGhanaMetaTags(pageKey) {
    const metaTemplates = {
        'landing': {
            title: 'M-Pesewa Ghana | Emergency Loans in Trusted Circles',
            description: 'Get emergency loans from trusted friends and family in Ghana. Fast, fair, and community-based lending platform.',
            keywords: 'Ghana loans, emergency loans Ghana, peer-to-peer lending Ghana, trusted circles Ghana, Accra loans',
            ogTitle: 'M-Pesewa Ghana: Emergency Lending Platform',
            ogDescription: 'Community-based emergency lending for Ghanaians by Ghanaians',
            ogImage: 'https://mpesewa.com.gh/assets/images/gh/og-default.jpg',
            twitterCard: 'summary_large_image',
            canonical: 'https://mpesewa.com.gh'
        },
        'borrower.apply': {
            title: 'Apply for Emergency Loan | M-Pesewa Ghana',
            description: 'Apply for emergency loans in Ghana for transport, utilities, health, education, and business needs.',
            keywords: 'apply loan Ghana, emergency loan application, Ghana loan form, borrow money Ghana',
            ogTitle: 'Apply for Emergency Loan in Ghana',
            ogDescription: 'Quick application for emergency loans in Ghana',
            canonical: 'https://mpesewa.com.gh/gh/borrower/apply'
        },
        'lender.dashboard': {
            title: 'Lender Dashboard | M-Pesewa Ghana',
            description: 'Manage your lending portfolio, track borrowers, and earn returns in Ghana.',
            keywords: 'lend money Ghana, Ghana lending platform, invest Ghana, peer-to-peer lending Ghana',
            ogTitle: 'Lender Dashboard for Ghana',
            canonical: 'https://mpesewa.com.gh/gh/lender/dashboard'
        }
    };

    return metaTemplates[pageKey] || metaTemplates.landing;
}

/**
 * Generate Ghana emergency category cards
 * @param {string} category - Category identifier
 * @returns {Array} Category cards data
 */
function generateGhanaCategoryCards(category) {
    const categories = {
        'transport': [
            {
                icon: '🚌',
                title: 'Trotro Fare',
                description: 'When you need transport to work, school, or appointments',
                amountRange: 'GH₵5-50',
                commonUse: 'Daily commute, urgent travel',
                repaymentExample: 'GH₵20 loan = GH₵22 repayment in 7 days'
            },
            {
                icon: '⛽',
                title: 'Vehicle Fuel',
                description: 'When your car, motorcycle, or generator runs out of fuel',
                amountRange: 'GH₵50-500',
                commonUse: 'Private transport, business vehicles',
                repaymentExample: 'GH₵200 fuel = GH₵220 repayment in 7 days'
            },
            {
                icon: '🚕',
                title: 'Taxi Emergency',
                description: 'When you need immediate taxi for urgent matters',
                amountRange: 'GH₵20-100',
                commonUse: 'Hospital visits, emergencies',
                repaymentExample: 'GH₵50 taxi = GH₵55 repayment in 7 days'
            }
        ],
        'utilities': [
            {
                icon: '⚡',
                title: 'ECG Tokens',
                description: 'When your electricity is about to be disconnected',
                amountRange: 'GH₵20-200',
                commonUse: 'Home electricity, business power',
                repaymentExample: 'GH₵100 tokens = GH₵110 repayment in 7 days'
            },
            {
                icon: '💧',
                title: 'Water Bill',
                description: 'When your water bill is overdue',
                amountRange: 'GH₵30-150',
                commonUse: 'Household water, business water',
                repaymentExample: 'GH₵80 water bill = GH₵88 repayment in 7 days'
            },
            {
                icon: '📶',
                title: 'Internet Data',
                description: 'When you need internet for work, school, or business',
                amountRange: 'GH₵10-100',
                commonUse: 'Online work, remote learning, business',
                repaymentExample: 'GH₵50 data = GH₵55 repayment in 7 days'
            }
        ]
    };

    return categories[category] || [];
}

/**
 * Generate Ghana location options for forms
 * @returns {Array} Location options
 */
function generateGhanaLocations() {
    return [
        {
            region: 'Greater Accra',
            cities: ['Accra', 'Tema', 'Madina', 'Dansoman', 'Ashaiman', 'Kasoa']
        },
        {
            region: 'Ashanti',
            cities: ['Kumasi', 'Obuasi', 'Ejisu', 'Mampong', 'Bekwai']
        },
        {
            region: 'Western',
            cities: ['Takoradi', 'Sekondi', 'Tarkwa', 'Axim', 'Elubo']
        },
        {
            region: 'Central',
            cities: ['Cape Coast', 'Winneba', 'Saltpond', 'Swedru', 'Kasoa']
        },
        {
            region: 'Eastern',
            cities: ['Koforidua', 'Nsawam', 'Aburi', 'Suhum', 'Akim Oda']
        },
        {
            region: 'Volta',
            cities: ['Ho', 'Hohoe', 'Keta', 'Aflao', 'Sogakope']
        },
        {
            region: 'Northern',
            cities: ['Tamale', 'Yendi', 'Walewale', 'Bimbilla', 'Salaga']
        },
        {
            region: 'Upper East',
            cities: ['Bolgatanga', 'Bawku', 'Navrongo', 'Zebilla', 'Sandema']
        },
        {
            region: 'Upper West',
            cities: ['Wa', 'Lawra', 'Tumu', 'Jirapa', 'Funsi']
        },
        {
            region: 'Bono',
            cities: ['Sunyani', 'Techiman', 'Wenchi', 'Berekum', 'Dormaa']
        },
        {
            region: 'Ahafo',
            cities: ['Goaso', 'Kenyasi', 'Hwidiem', 'Bechem']
        },
        {
            region: 'Bono East',
            cities: ['Techiman', 'Kintampo', 'Atebubu', 'Prang']
        },
        {
            region: 'Oti',
            cities: ['Dambai', 'Jasikan', 'Kpassa', 'Worawora']
        },
        {
            region: 'Savannah',
            cities: ['Damongo', 'Bole', 'Salaga', 'Sawla']
        },
        {
            region: 'North East',
            cities: ['Nalerigu', 'Walewale', 'Gambaga', 'Langbensi']
        }
    ];
}

/**
 * Generate Ghana mobile money providers
 * @returns {Array} Mobile money providers
 */
function generateGhanaMobileMoneyProviders() {
    return [
        {
            name: 'MTN Mobile Money',
            code: 'MTN',
            icon: '/assets/images/gh/providers/mtn.png',
            ussd: '*170#',
            customerCare: '100',
            features: ['Instant transfer', 'Bill payment', 'Airtime purchase', 'International transfer']
        },
        {
            name: 'Vodafone Cash',
            code: 'VOD',
            icon: '/assets/images/gh/providers/vodafone.png',
            ussd: '*110#',
            customerCare: '100',
            features: ['Cash transfer', 'Pay bills', 'Buy airtime', 'Save money']
        },
        {
            name: 'AirtelTigo Money',
            code: 'AT',
            icon: '/assets/images/gh/providers/airteltigo.png',
            ussd: '*110#',
            customerCare: '100',
            features: ['Send money', 'Pay bills', 'Buy airtime', 'Withdraw cash']
        }
    ];
}

/**
 * Generate Ghana bank list for transfers
 * @returns {Array} Bank information
 */
function generateGhanaBanks() {
    return [
        {
            name: 'Ghana Commercial Bank',
            code: 'GCB',
            swift: 'GCBG GH AC',
            branches: ['All regions'],
            transferTime: '1-2 business days'
        },
        {
            name: 'Agricultural Development Bank',
            code: 'ADB',
            swift: 'ADBR GH AC',
            branches: ['Major cities'],
            transferTime: '1-2 business days'
        },
        {
            name: 'Ecobank Ghana',
            code: 'ECO',
            swift: 'ECOC GH AC',
            branches: ['Nationwide'],
            transferTime: 'Same day (if before 2PM)'
        },
        {
            name: 'Standard Chartered Bank Ghana',
            code: 'SCB',
            swift: 'SCBL GH AC',
            branches: ['Major cities'],
            transferTime: 'Same day'
        },
        {
            name: 'Barclays Bank Ghana',
            code: 'BAR',
            swift: 'BARC GH AC',
            branches: ['Nationwide'],
            transferTime: '1 business day'
        }
    ];
}

/**
 * Generate Ghana holiday schedule
 * @param {number} year - Year for holiday schedule
 * @returns {Array} Holiday schedule
 */
function generateGhanaHolidays(year = new Date().getFullYear()) {
    return [
        { date: `${year}-01-01`, name: 'New Year\'s Day', type: 'Public Holiday' },
        { date: `${year}-01-07`, name: 'Constitution Day', type: 'Public Holiday' },
        { date: `${year}-03-06`, name: 'Independence Day', type: 'Public Holiday' },
        // Easter dates vary each year
        { date: `${year}-05-01`, name: 'Labour Day', type: 'Public Holiday' },
        // Eid al-Fitr dates vary
        { date: `${year}-08-01`, name: 'Founders\' Day', type: 'Public Holiday' },
        { date: `${year}-09-21`, name: 'Kwame Nkrumah Memorial Day', type: 'Public Holiday' },
        // Eid al-Adha dates vary
        { date: `${year}-12-25`, name: 'Christmas Day', type: 'Public Holiday' },
        { date: `${year}-12-26`, name: 'Boxing Day', type: 'Public Holiday' }
    ];
}

// ============================================
// EXPORT PAGE CONFIGURATIONS
// ============================================

export {
    GHANA_PAGES,
    generateGhanaBreadcrumbs,
    generateGhanaPageTitle,
    generateGhanaMetaTags,
    generateGhanaCategoryCards,
    generateGhanaLocations,
    generateGhanaMobileMoneyProviders,
    generateGhanaBanks,
    generateGhanaHolidays
};

export default GHANA_PAGES;