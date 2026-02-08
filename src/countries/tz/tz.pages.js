/**
 * Tanzania (TZ) Page Configurations for M-Pesewa
 * Country-specific page content, layouts, and routing
 */

const tzPages = {
    // ============================================
    // 1. COUNTRY LANDING PAGE
    // ============================================
    landingPage: {
        meta: {
            title: 'M-Pesewa Tanzania | Emergency Micro-Lending Platform',
            description: 'Get emergency loans from trusted groups in Tanzania. Community-based lending with fair terms.',
            keywords: 'Tanzania loans, emergency lending, TZS loans, Dar es Salaam, Mwanza, Arusha, micro-loans Tanzania',
            ogImage: '/assets/images/tz/og-tanzania.jpg',
            canonical: 'https://mpesewa.com/tz'
        },

        hero: {
            title: 'Emergency Loans in Tanzania, Simplified',
            subtitle: 'Connect with trusted groups in your community for fast, fair emergency lending',
            background: '/assets/images/tz/tanzania-hero-bg.jpg',
            ctaButtons: [
                {
                    text: 'Borrow Now (Free)',
                    url: '/tz/borrower/register',
                    style: 'primary',
                    color: '#f37021'
                },
                {
                    text: 'Start Lending',
                    url: '/tz/lender/register',
                    style: 'secondary',
                    color: '#28a745'
                }
            ]
        },

        features: [
            {
                icon: '🇹🇿',
                title: 'Tanzanian Shillings Only',
                description: 'All transactions in TZS using local mobile money (M-Pesa, Tigo Pesa, Airtel Money)'
            },
            {
                icon: '👥',
                title: 'Trusted Tanzanian Groups',
                description: 'Join family, church, or professional groups you already know and trust'
            },
            {
                icon: '⚖️',
                title: 'BoT Compliant',
                description: 'Fully licensed and regulated by Bank of Tanzania'
            },
            {
                icon: '📱',
                title: 'Mobile-First',
                description: 'Designed for Tanzania\'s mobile money ecosystem'
            }
        ]
    },

    // ============================================
    // 2. REGISTRATION PAGES
    // ============================================
    registration: {
        borrower: {
            title: 'Become a Borrower in Tanzania',
            steps: [
                {
                    number: 1,
                    title: 'Personal Information',
                    fields: [
                        {
                            name: 'fullName',
                            label: 'Full Name (as per NIDA)',
                            type: 'text',
                            required: true,
                            validation: 'minLength:3'
                        },
                        {
                            name: 'nationalId',
                            label: 'National ID Number (NIDA)',
                            type: 'text',
                            required: true,
                            placeholder: 'NIDA-123456789-0',
                            validation: 'nidaFormat'
                        },
                        {
                            name: 'dateOfBirth',
                            label: 'Date of Birth',
                            type: 'date',
                            required: true,
                            validation: 'age:18'
                        },
                        {
                            name: 'phoneNumber',
                            label: 'Mobile Number',
                            type: 'tel',
                            required: true,
                            placeholder: '+255700000000',
                            validation: 'tanzaniaPhone'
                        },
                        {
                            name: 'email',
                            label: 'Email Address',
                            type: 'email',
                            required: false,
                            validation: 'email'
                        }
                    ]
                },
                {
                    number: 2,
                    title: 'Location & Groups',
                    fields: [
                        {
                            name: 'region',
                            label: 'Region',
                            type: 'select',
                            required: true,
                            options: [
                                'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya',
                                'Morogoro', 'Tanga', 'Kagera', 'Mtwara', 'Kigoma',
                                'Shinyanga', 'Tabora', 'Rukwa', 'Ruvuma', 'Iringa',
                                'Singida', 'Manyara', 'Pwani', 'Lindi', 'Geita',
                                'Simiyu', 'Njombe', 'Katavi', 'Songwe'
                            ]
                        },
                        {
                            name: 'district',
                            label: 'District',
                            type: 'text',
                            required: true
                        },
                        {
                            name: 'ward',
                            label: 'Ward',
                            type: 'text',
                            required: false
                        },
                        {
                            name: 'groupCode',
                            label: 'Group Invitation Code',
                            type: 'text',
                            required: true,
                            help: 'Get this from your group administrator'
                        }
                    ]
                },
                {
                    number: 3,
                    title: 'Guarantors',
                    fields: [
                        {
                            name: 'guarantor1Name',
                            label: 'First Guarantor Name',
                            type: 'text',
                            required: true
                        },
                        {
                            name: 'guarantor1Phone',
                            label: 'First Guarantor Phone',
                            type: 'tel',
                            required: true,
                            validation: 'tanzaniaPhone'
                        },
                        {
                            name: 'guarantor1Relationship',
                            label: 'Relationship',
                            type: 'select',
                            required: true,
                            options: ['Family', 'Friend', 'Colleague', 'Neighbor', 'Other']
                        },
                        {
                            name: 'guarantor2Name',
                            label: 'Second Guarantor Name',
                            type: 'text',
                            required: true
                        },
                        {
                            name: 'guarantor2Phone',
                            label: 'Second Guarantor Phone',
                            type: 'tel',
                            required: true,
                            validation: 'tanzaniaPhone'
                        },
                        {
                            name: 'guarantor2Relationship',
                            label: 'Relationship',
                            type: 'select',
                            required: true,
                            options: ['Family', 'Friend', 'Colleague', 'Neighbor', 'Other']
                        }
                    ]
                }
            ],
            
            terms: {
                required: true,
                documents: [
                    'Terms and Conditions (Tanzania)',
                    'Privacy Policy (Tanzania)',
                    'Fair Lending Agreement',
                    'Data Protection Consent'
                ]
            }
        },

        lender: {
            title: 'Become a Lender in Tanzania',
            steps: [
                {
                    number: 1,
                    title: 'Lender Profile',
                    fields: [
                        {
                            name: 'fullName',
                            label: 'Full Legal Name',
                            type: 'text',
                            required: true
                        },
                        {
                            name: 'brandName',
                            label: 'Brand Name (Optional)',
                            type: 'text',
                            required: false,
                            help: 'If lending as a business or under a brand'
                        },
                        {
                            name: 'nationalId',
                            label: 'National ID (NIDA)',
                            type: 'text',
                            required: true
                        },
                        {
                            name: 'tin',
                            label: 'Tax Identification Number (TIN)',
                            type: 'text',
                            required: true,
                            placeholder: 'TIN-123-456-789'
                        },
                        {
                            name: 'phoneNumber',
                            label: 'Business Phone',
                            type: 'tel',
                            required: true
                        }
                    ]
                },
                {
                    number: 2,
                    title: 'Subscription Tier',
                    fields: [
                        {
                            name: 'subscriptionTier',
                            label: 'Choose Your Tier',
                            type: 'radio',
                            required: true,
                            options: [
                                {
                                    value: 'basic',
                                    label: 'Basic Tier (up to TZS 1,500/week)',
                                    price: 'TZS 50/month'
                                },
                                {
                                    value: 'premium',
                                    label: 'Premium Tier (up to TZS 5,000/week)',
                                    price: 'TZS 250/month'
                                },
                                {
                                    value: 'super',
                                    label: 'Super Tier (up to TZS 20,000/week)',
                                    price: 'TZS 1,000/month'
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
                                { value: 'biAnnual', label: 'Bi-Annual (6 months)' },
                                { value: 'annual', label: 'Annual (12 months)' }
                            ]
                        },
                        {
                            name: 'lendingCategories',
                            label: 'Lending Categories',
                            type: 'checkbox',
                            required: true,
                            options: [
                                'M-pesewa Fare',
                                'M-pesewa Data',
                                'M-pesewa Cooking Gas',
                                'M-pesewa Food',
                                'M-pesewa Electricity',
                                'M-pesewa Medicine',
                                'All Categories'
                            ]
                        }
                    ]
                },
                {
                    number: 3,
                    title: 'Payment Method',
                    fields: [
                        {
                            name: 'paymentMethod',
                            label: 'Select Payment Method',
                            type: 'select',
                            required: true,
                            options: [
                                'M-Pesa',
                                'Tigo Pesa',
                                'Airtel Money',
                                'Halopesa'
                            ]
                        },
                        {
                            name: 'mobileMoneyNumber',
                            label: 'Mobile Money Number',
                            type: 'tel',
                            required: true
                        },
                        {
                            name: 'agreeToAutoRenew',
                            label: 'Auto-Renew Subscription',
                            type: 'checkbox',
                            required: true,
                            text: 'I agree to automatic renewal on 28th of each month'
                        }
                    ]
                }
            ],
            
            compliance: {
                crbConsent: {
                    requiredFor: ['super'],
                    text: 'I consent to Credit Reference Bureau check for Super Tier'
                },
                regulatoryConsent: {
                    required: true,
                    text: 'I agree to comply with Bank of Tanzania regulations'
                }
            }
        }
    },

    // ============================================
    // 3. DASHBOARD PAGES
    // ============================================
    dashboards: {
        borrower: {
            layout: {
                sidebar: [
                    {
                        id: 'overview',
                        label: 'Dashboard',
                        icon: '📊',
                        url: '/tz/borrower/dashboard'
                    },
                    {
                        id: 'apply',
                        label: 'Apply for Loan',
                        icon: '📝',
                        url: '/tz/borrower/apply'
                    },
                    {
                        id: 'active',
                        label: 'Active Loans',
                        icon: '💰',
                        url: '/tz/borrower/active'
                    },
                    {
                        id: 'history',
                        label: 'Borrow History',
                        icon: '📅',
                        url: '/tz/borrower/history'
                    },
                    {
                        id: 'repayments',
                        label: 'Make Repayment',
                        icon: '💳',
                        url: '/tz/borrower/repay'
                    },
                    {
                        id: 'groups',
                        label: 'My Groups',
                        icon: '👥',
                        url: '/tz/borrower/groups'
                    },
                    {
                        id: 'profile',
                        label: 'My Profile',
                        icon: '👤',
                        url: '/tz/borrower/profile'
                    }
                ],

                mainWidgets: [
                    {
                        id: 'loanStatus',
                        title: 'Active Loan Status',
                        type: 'status',
                        data: {
                            currentLoan: 'TZS 0',
                            dueDate: 'No active loan',
                            daysRemaining: '--',
                            interestAccrued: 'TZS 0'
                        }
                    },
                    {
                        id: 'creditRating',
                        title: 'Trust Rating',
                        type: 'rating',
                        data: {
                            stars: 5,
                            groupCount: 0,
                            repaymentRate: '0%',
                            blacklistStatus: 'Clean'
                        }
                    },
                    {
                        id: 'quickActions',
                        title: 'Quick Actions',
                        type: 'actions',
                        actions: [
                            { label: 'Apply for Loan', url: '/tz/borrower/apply', icon: '🚀' },
                            { label: 'Make Repayment', url: '/tz/borrower/repay', icon: '💳' },
                            { label: 'Invite to Group', url: '/tz/borrower/invite', icon: '📨' }
                        ]
                    }
                ]
            },

            alerts: [
                {
                    type: 'info',
                    message: 'Welcome to M-Pesewa Tanzania! Complete your profile to access all features.',
                    dismissible: true
                },
                {
                    type: 'warning',
                    condition: 'hasOverdueLoan',
                    message: 'You have an overdue loan. Please make payment to avoid penalties.',
                    dismissible: false
                }
            ]
        },

        lender: {
            layout: {
                sidebar: [
                    {
                        id: 'overview',
                        label: 'Lender Dashboard',
                        icon: '📊',
                        url: '/tz/lender/dashboard'
                    },
                    {
                        id: 'portfolio',
                        label: 'My Portfolio',
                        icon: '💼',
                        url: '/tz/lender/portfolio'
                    },
                    {
                        id: 'ledgers',
                        label: 'Manage Ledgers',
                        icon: '📒',
                        url: '/tz/lender/ledgers'
                    },
                    {
                        id: 'requests',
                        label: 'Loan Requests',
                        icon: '📋',
                        url: '/tz/lender/requests'
                    },
                    {
                        id: 'subscription',
                        label: 'Subscription',
                        icon: '⭐',
                        url: '/tz/lender/subscription'
                    },
                    {
                        id: 'reports',
                        label: 'Reports',
                        icon: '📈',
                        url: '/tz/lender/reports'
                    },
                    {
                        id: 'settings',
                        label: 'Lender Settings',
                        icon: '⚙️',
                        url: '/tz/lender/settings'
                    }
                ],

                mainWidgets: [
                    {
                        id: 'subscriptionStatus',
                        title: 'Subscription Status',
                        type: 'status',
                        data: {
                            tier: 'None',
                            limit: 'TZS 0/week',
                            expires: 'Not subscribed',
                            daysRemaining: '--'
                        }
                    },
                    {
                        id: 'lendingSummary',
                        title: 'Lending Summary',
                        type: 'summary',
                        data: {
                            totalLent: 'TZS 0',
                            activeLoans: 0,
                            totalInterest: 'TZS 0',
                            defaultRate: '0%'
                        }
                    },
                    {
                        id: 'quickActions',
                        title: 'Quick Actions',
                        type: 'actions',
                        actions: [
                            { label: 'View Loan Requests', url: '/tz/lender/requests', icon: '👁️' },
                            { label: 'Create New Ledger', url: '/tz/lender/ledgers/new', icon: '➕' },
                            { label: 'Upgrade Subscription', url: '/tz/lender/subscription/upgrade', icon: '⬆️' }
                        ]
                    }
                ]
            },

            alerts: [
                {
                    type: 'warning',
                    condition: 'subscriptionExpiring',
                    message: 'Your subscription expires soon. Renew to continue lending.',
                    dismissible: true
                },
                {
                    type: 'danger',
                    condition: 'subscriptionExpired',
                    message: 'Your subscription has expired. Lending access is blocked.',
                    dismissible: false
                }
            ]
        }
    },

    // ============================================
    // 4. EMERGENCY CATEGORY PAGES
    // ============================================
    emergencyCategories: {
        fare: {
            title: 'M-pesewa Fare - Transport Emergency',
            icon: '🚌',
            description: 'Get immediate transport fare for commuting, emergencies, or unexpected travel needs',
            
            details: {
                typicalAmounts: [
                    'Within City: TZS 1,000 - TZS 5,000',
                    'Inter-City: TZS 5,000 - TZS 20,000',
                    'Regional: TZS 20,000 - TZS 50,000'
                ],
                
                acceptablePurposes: [
                    'Commute to work/school',
                    'Medical emergency travel',
                    'Family emergency travel',
                    'Job interview travel',
                    'Official business travel'
                ],
                
                prohibitedPurposes: [
                    'Leisure travel',
                    'Non-essential trips',
                    'Illegal activities',
                    'Political activities'
                ]
            },
            
            applicationProcess: {
                steps: [
                    'Select "Fare" as loan category',
                    'Enter destination and purpose',
                    'Specify amount needed',
                    'Choose repayment schedule',
                    'Submit to group lenders'
                ],
                
                documents: [
                    'Destination details',
                    'Travel purpose explanation',
                    'Estimated travel costs'
                ]
            },
            
            lenders: {
                criteria: [
                    'Verify travel necessity',
                    'Check borrower\'s location',
                    'Confirm reasonable amount',
                    'Assess repayment capacity'
                ],
                
                questions: [
                    'Is this for genuine emergency travel?',
                    'Is the amount reasonable for the destination?',
                    'Does borrower have means to repay?'
                ]
            }
        },

        data: {
            title: 'M-pesewa Data - Internet Emergency',
            icon: '📶',
            description: 'Emergency mobile data bundles for work, communication, or urgent online needs',
            
            details: {
                typicalAmounts: [
                    'Daily Bundle: TZS 500 - TZS 1,000',
                    'Weekly Bundle: TZS 2,000 - TZS 5,000',
                    'Monthly Bundle: TZS 10,000 - TZS 20,000'
                ],
                
                acceptablePurposes: [
                    'Work-from-home needs',
                    'Online job applications',
                    'Emergency communication',
                    'Online learning',
                    'Business transactions'
                ],
                
                networkProviders: [
                    'Vodacom (M-Pesa)',
                    'Tigo (Tigo Pesa)',
                    'Airtel (Airtel Money)',
                    'Halotel (Halopesa)'
                ]
            }
        },

        // Additional categories would follow same structure
        gas: {
            title: 'M-pesewa Cooking Gas - Kitchen Emergency',
            icon: '🔥',
            description: 'Emergency LPG gas refills when you run out during cooking'
        },

        food: {
            title: 'M-pesewa Food - Hunger Emergency',
            icon: '🍲',
            description: 'Emergency food supplies when paycheck is delayed'
        },

        electricity: {
            title: 'M-pesewa Electricity - Power Emergency',
            icon: '⚡',
            description: 'Emergency electricity token purchase to avoid blackout'
        },

        medicine: {
            title: 'M-pesewa Medicine - Health Emergency',
            icon: '💊',
            description: 'Emergency funds for essential medicines and medical supplies'
        }
    },

    // ============================================
    // 5. GROUP MANAGEMENT PAGES
    // ============================================
    groups: {
        create: {
            title: 'Create New Group in Tanzania',
            steps: [
                {
                    title: 'Group Basics',
                    fields: [
                        {
                            name: 'groupName',
                            label: 'Group Name',
                            type: 'text',
                            required: true,
                            placeholder: 'e.g., Family Group Dar, Church Youth Group'
                        },
                        {
                            name: 'groupType',
                            label: 'Group Type',
                            type: 'select',
                            required: true,
                            options: [
                                'Family Group',
                                'Church Group',
                                'Professional Group',
                                'Business Group',
                                'Social Group',
                                'Neighborhood Group',
                                'Association Group'
                            ]
                        },
                        {
                            name: 'description',
                            label: 'Group Description',
                            type: 'textarea',
                            required: true,
                            placeholder: 'Describe the purpose and rules of your group'
                        }
                    ]
                },
                {
                    title: 'Group Rules',
                    fields: [
                        {
                            name: 'meetingFrequency',
                            label: 'Meeting Frequency',
                            type: 'select',
                            required: true,
                            options: [
                                'Weekly',
                                'Bi-Weekly',
                                'Monthly',
                                'Quarterly',
                                'As Needed'
                            ]
                        },
                        {
                            name: 'maxLoanAmount',
                            label: 'Maximum Loan Amount',
                            type: 'number',
                            required: true,
                            min: 1000,
                            max: 50000,
                            step: 1000
                        },
                        {
                            name: 'interestRate',
                            label: 'Group Interest Rate',
                            type: 'select',
                            required: true,
                            options: [
                                { value: '0.10', label: '10% (Platform Default)' },
                                { value: '0.08', label: '8%' },
                                { value: '0.12', label: '12%' },
                                { value: '0.15', label: '15% (Maximum)' }
                            ],
                            help: 'Cannot exceed 15% per week by Tanzanian regulations'
                        }
                    ]
                },
                {
                    title: 'Invite Members',
                    fields: [
                        {
                            name: 'initialMembers',
                            label: 'Initial Members (Minimum 5)',
                            type: 'dynamic',
                            required: true,
                            min: 5,
                            fields: [
                                { name: 'name', label: 'Member Name', type: 'text' },
                                { name: 'phone', label: 'Phone Number', type: 'tel' },
                                { name: 'role', label: 'Role', type: 'select', options: ['Lender', 'Borrower'] }
                            ]
                        }
                    ]
                }
            ]
        },

        dashboard: {
            sections: [
                {
                    id: 'overview',
                    title: 'Group Overview',
                    widgets: [
                        {
                            type: 'stats',
                            title: 'Group Statistics',
                            metrics: [
                                { label: 'Total Members', key: 'totalMembers' },
                                { label: 'Active Lenders', key: 'activeLenders' },
                                { label: 'Active Borrowers', key: 'activeBorrowers' },
                                { label: 'Total Amount Lent', key: 'totalLent', format: 'currency' }
                            ]
                        },
                        {
                            type: 'performance',
                            title: 'Group Performance',
                            metrics: [
                                { label: 'Repayment Rate', key: 'repaymentRate', format: 'percentage' },
                                { label: 'Default Rate', key: 'defaultRate', format: 'percentage' },
                                { label: 'Average Loan Size', key: 'avgLoanSize', format: 'currency' },
                                { label: 'Active Loans', key: 'activeLoans' }
                            ]
                        }
                    ]
                },
                {
                    id: 'members',
                    title: 'Group Members',
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'role', label: 'Role' },
                        { key: 'joinDate', label: 'Join Date' },
                        { key: 'status', label: 'Status' },
                        { key: 'rating', label: 'Rating' },
                        { key: 'actions', label: 'Actions' }
                    ],
                    actions: [
                        { label: 'View Profile', action: 'view' },
                        { label: 'Send Message', action: 'message' },
                        { label: 'Remove Member', action: 'remove', condition: 'isAdmin' }
                    ]
                },
                {
                    id: 'loans',
                    title: 'Active Loans',
                    columns: [
                        { key: 'borrower', label: 'Borrower' },
                        { key: 'amount', label: 'Amount', format: 'currency' },
                        { key: 'category', label: 'Category' },
                        { key: 'lender', label: 'Lender' },
                        { key: 'dueDate', label: 'Due Date' },
                        { key: 'status', label: 'Status' }
                    ]
                }
            ]
        }
    },

    // ============================================
    // 6. STATIC CONTENT PAGES
    // ============================================
    staticPages: {
        about: {
            title: 'About M-Pesewa Tanzania',
            sections: [
                {
                    title: 'Our Mission in Tanzania',
                    content: `M-Pesewa Tanzania is dedicated to providing accessible, community-based emergency lending solutions to Tanzanians. We believe in empowering communities to support each other through trusted financial relationships.`
                },
                {
                    title: 'Bank of Tanzania Licensed',
                    content: `We are proud to be licensed and regulated by the Bank of Tanzania (License No: BOT/DLP/2024/001). We operate in full compliance with Tanzanian financial regulations and consumer protection laws.`
                },
                {
                    title: 'Local Team',
                    content: `Our Tanzania operations are managed by a local team with deep understanding of Tanzanian culture, financial needs, and regulatory environment.`
                }
            ]
        },

        contact: {
            title: 'Contact M-Pesewa Tanzania',
            addresses: [
                {
                    type: 'Head Office',
                    address: 'Mlimani City Tower, 3rd Floor, Ohio Street, Dar es Salaam',
                    phone: '+255 659 073 010',
                    email: 'info.tz@mpesewa.com',
                    hours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM'
                },
                {
                    type: 'Mwanza Office',
                    address: 'Nyerere Road, Mwanza',
                    phone: '+255 28 250 0001',
                    email: 'mwanza@mpesewa.com',
                    hours: 'Mon-Fri: 8:30 AM - 4:30 PM'
                }
            ],
            
            support: {
                general: 'support.tz@mpesewa.com',
                technical: 'tech.tz@mpesewa.com',
                complaints: 'complaints.tz@mpesewa.com',
                legal: 'legal.tz@mpesewa.com'
            }
        },

        faq: {
            title: 'Frequently Asked Questions - Tanzania',
            categories: [
                {
                    name: 'Registration',
                    questions: [
                        {
                            q: 'What documents do I need to register?',
                            a: 'You need a valid National ID (NIDA), Tanzanian mobile number, and two local guarantors from your group.'
                        },
                        {
                            q: 'Can foreigners register in Tanzania?',
                            a: 'Only Tanzanian residents with valid NIDA can register. Foreigners must use their home country platform.'
                        }
                    ]
                },
                {
                    name: 'Loans',
                    questions: [
                        {
                            q: 'What is the maximum loan amount?',
                            a: 'Maximum depends on lender subscription tier: Basic (TZS 1,500), Premium (TZS 5,000), Super (TZS 20,000) per week.'
                        },
                        {
                            q: 'How long do I have to repay?',
                            a: 'All loans must be repaid within 7 days with 10% interest. Late payments incur 5% daily penalty.'
                        }
                    ]
                }
            ]
        }
    },

    // ============================================
    // 7. ERROR PAGES
    // ============================================
    errorPages: {
        404: {
            title: 'Page Not Found - Tanzania',
            message: 'Hakuna ukurasa uliopatikana (Page not found in Tanzania)',
            suggestion: 'Return to Tanzania homepage or contact our Dar es Salaam office for assistance.',
            image: '/assets/images/tz/404-tanzania.jpg'
        },
        
        countryBlocked: {
            title: 'Access Restricted - Tanzania Only',
            message: 'This page is only accessible to users registered in Tanzania.',
            action: 'Switch to Tanzania region or register with Tanzanian credentials.'
        },
        
        subscriptionExpired: {
            title: 'Subscription Expired - Tanzania',
            message: 'Your lending subscription has expired. Please renew to continue using M-Pesewa Tanzania.',
            action: 'Renew subscription via M-Pesa, Tigo Pesa, or Airtel Money.'
        }
    },

    // ============================================
    // 8. LOCALIZATION AND TRANSLATION
    // ============================================
    localization: {
        languages: {
            primary: 'en',
            supported: ['en', 'sw'],
            default: 'en'
        },

        swahili: {
            commonTerms: {
                loan: 'mkopo',
                lender: 'mkopeshaji',
                borrower: 'mkopaji',
                group: 'kikundi',
                repayment: 'malipo',
                interest: 'riba',
                emergency: 'dharura'
            },
            
            pageTitles: {
                home: 'M-Pesewa Tanzania - Ukurasa Mkuu',
                register: 'Jisajili',
                dashboard: 'Dashibodi',
                loans: 'Mikopo',
                groups: 'Makundi'
            }
        },

        dateFormat: 'dd/mm/yyyy',
        timeFormat: 'HH:mm',
        currencyFormat: 'TSh {amount}',
        numberFormat: {
            decimalSeparator: '.',
            thousandSeparator: ','
        }
    },

    // ============================================
    // 9. ANALYTICS AND TRACKING
    // ============================================
    analytics: {
        trackingId: 'UA-TZ-001',
        events: {
            pageViews: true,
            buttonClicks: true,
            formSubmissions: true,
            transactions: true
        },
        
        dashboards: {
            admin: '/tz/admin/analytics',
            group: '/tz/group/{id}/analytics',
            personal: '/tz/user/analytics'
        }
    },

    // ============================================
    // 10. PAGE HELPER FUNCTIONS
    // ============================================
    helpers: {
        // Generate page title with country suffix
        generateTitle: (baseTitle) => {
            return `${baseTitle} | M-Pesewa Tanzania`;
        },
        
        // Format currency for display
        formatCurrency: (amount) => {
            return `TSh ${amount.toLocaleString('en-TZ')}`;
        },
        
        // Get page breadcrumbs
        getBreadcrumbs: (currentPage) => {
            const breadcrumbs = [
                { label: 'Home', url: '/tz' },
                { label: 'Tanzania', url: '/tz' }
            ];
            
            // Add dynamic breadcrumb based on current page
            const pageMap = {
                'borrower': { label: 'Borrower', url: '/tz/borrower' },
                'lender': { label: 'Lender', url: '/tz/lender' },
                'groups': { label: 'Groups', url: '/tz/groups' },
                'emergency': { label: 'Emergency Hub', url: '/tz/emergency' }
            };
            
            if (pageMap[currentPage]) {
                breadcrumbs.push(pageMap[currentPage]);
            }
            
            return breadcrumbs;
        },
        
        // Validate Tanzania-specific form data
        validateTanzaniaData: (data, formType) => {
            const errors = [];
            
            if (formType === 'registration') {
                // Validate NIDA format
                if (data.nationalId && !/^NIDA-\d{9}-[A-Z0-9]$/.test(data.nationalId)) {
                    errors.push('National ID must be in format: NIDA-123456789-0');
                }
                
                // Validate Tanzanian phone
                if (data.phoneNumber && !/^\+255[67]\d{8}$/.test(data.phoneNumber)) {
                    errors.push('Phone number must be a valid Tanzanian number starting with +2556 or +2557');
                }
            }
            
            return errors;
        },
        
        // Get region-specific content
        getRegionalContent: (region) => {
            const regionalData = {
                'Dar es Salaam': {
                    welcomeMessage: 'Karibu Dar es Salaam!',
                    localPartners: ['Vodacom Dar', 'CRDB Bank HQ', 'NMB Bank HQ'],
                    emergencyContacts: ['Police: 112', 'Ambulance: 114']
                },
                'Mwanza': {
                    welcomeMessage: 'Karibu Mwanza!',
                    localPartners: ['Mwanza Chamber of Commerce', 'Lake Zone Banks'],
                    emergencyContacts: ['Lake Police: 112', 'Hospital: 114']
                },
                'Arusha': {
                    welcomeMessage: 'Karibu Arusha!',
                    localPartners: ['Arusha Tourism Board', 'Northern Zone Banks'],
                    emergencyContacts: ['Tourist Police: 112', 'Medical: 114']
                }
            };
            
            return regionalData[region] || regionalData['Dar es Salaam'];
        }
    }
};

// Export Pages Configuration
module.exports = tzPages;

// Initialize page system
console.log('Tanzania Pages Configuration loaded');
console.log(`Landing Page: ${tzPages.landingPage.meta.title}`);
console.log(`Registration Pages: Borrower & Lender`);
console.log(`Dashboard Pages: ${Object.keys(tzPages.dashboards).join(', ')}`);
console.log(`Emergency Categories: ${Object.keys(tzPages.emergencyCategories).length} categories`);
console.log(`Localization: ${tzPages.localization.languages.supported.join(', ')}`);