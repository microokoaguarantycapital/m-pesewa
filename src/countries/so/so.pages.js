/**
 * 🇸🇴 SOMALIA COUNTRY PAGES MODULE
 * 
 * STRICT HIERARCHY: Global → Somalia → Groups → Lenders → Borrowers
 * 
 * All pages must enforce Somalia-only access
 * No cross-country content or navigation
 */

const SomaliaPages = {
    // ============================================
    // 1️⃣ PAGE CONFIGURATION & ROUTING
    // ============================================
    routing: {
        basePath: '/countries/so',
        routes: {
            // Main country page
            dashboard: {
                path: '/dashboard',
                title: 'Somalia Dashboard | M-Pesewa',
                requiresAuth: true,
                requiresCountry: 'SO',
                roles: ['borrower', 'lender', 'admin']
            },
            
            // Borrower pages
            borrowerDashboard: {
                path: '/borrower/dashboard',
                title: 'Borrower Dashboard - Somalia | M-Pesewa',
                requiresAuth: true,
                requiresCountry: 'SO',
                roles: ['borrower'],
                hierarchy: 'country → groups → borrower'
            },
            
            // Lender pages
            lenderDashboard: {
                path: '/lender/dashboard',
                title: 'Lender Dashboard - Somalia | M-Pesewa',
                requiresAuth: true,
                requiresCountry: 'SO',
                roles: ['lender'],
                requiresSubscription: true,
                hierarchy: 'country → groups → lender → ledgers'
            },
            
            // Emergency hub (Somalia-specific categories)
            emergencyHub: {
                path: '/emergency',
                title: 'Emergency Hub - Somalia | M-Pesewa',
                requiresAuth: true,
                requiresCountry: 'SO',
                roles: ['borrower', 'lender'],
                categories: 'somalia-specific'
            },
            
            // Groups directory (Somalia-only)
            groupsDirectory: {
                path: '/groups',
                title: 'Groups in Somalia | M-Pesewa',
                requiresAuth: true,
                requiresCountry: 'SO',
                roles: ['borrower', 'lender'],
                filter: 'somalia-only'
            },
            
            // Legal pages
            legal: {
                path: '/legal',
                title: 'Legal - Somalia | M-Pesewa',
                requiresAuth: false,
                requiresCountry: 'SO',
                pages: ['terms', 'privacy', 'fair-practices']
            }
        }
    },

    // ============================================
    // 2️⃣ SOMALIA DASHBOARD PAGE
    // ============================================
    dashboard: {
        // Header Section
        header: {
            title: 'M-PESEWA SOMALIA',
            subtitle: 'Emergency Micro-Lending for Somali Communities',
            badge: '🇸🇴 Somalia Only',
            notice: 'All transactions in Somali Shillings (SOS)'
        },

        // Stats Overview
        stats: {
            totalUsers: {
                label: 'Somali Users',
                value: '0',
                change: '+0%',
                icon: '👥'
            },
            activeGroups: {
                label: 'Active Groups',
                value: '0',
                change: '+0%',
                icon: '🤝'
            },
            totalLoans: {
                label: 'SOS Lent',
                value: '0',
                change: '+0%',
                icon: '💰'
            },
            repaymentRate: {
                label: 'Repayment Rate',
                value: '0%',
                change: '+0%',
                icon: '📈'
            }
        },

        // Quick Actions (Role-based)
        quickActions: {
            borrower: [
                {
                    title: 'Apply for Emergency Loan',
                    description: 'Get help for urgent needs',
                    icon: '🚨',
                    path: '/so/borrower/apply',
                    color: '#f37021'
                },
                {
                    title: 'Join Somali Group',
                    description: 'Connect with trusted community',
                    icon: '🤝',
                    path: '/so/groups/join',
                    color: '#0099ff'
                },
                {
                    title: 'View Repayment Schedule',
                    description: 'Check your loan status',
                    icon: '📅',
                    path: '/so/borrower/repayments',
                    color: '#28a745'
                }
            ],
            lender: [
                {
                    title: 'Lend to Somali Borrowers',
                    description: 'Support your community',
                    icon: '💰',
                    path: '/so/lender/lend',
                    color: '#28a745',
                    requires: 'active-subscription'
                },
                {
                    title: 'Manage Ledgers',
                    description: 'Track borrower repayments',
                    icon: '📊',
                    path: '/so/lender/ledgers',
                    color: '#003366'
                },
                {
                    title: 'Upgrade Subscription',
                    description: 'Increase lending limits',
                    icon: '⚡',
                    path: '/so/subscription/upgrade',
                    color: '#0099ff'
                }
            ]
        },

        // Emergency Categories Preview (Somalia-specific)
        emergencyCategories: {
            title: 'Emergency Needs in Somalia',
            subtitle: 'Purpose-based loans for Somali communities',
            categories: [
                {
                    id: 'transport',
                    name: 'Transport Fare',
                    icon: '🚌',
                    description: 'Boda-boda, bus, or taxi fare',
                    typicalAmount: '500-5,000 SOS',
                    popularity: 'High'
                },
                {
                    id: 'food',
                    name: 'Emergency Food',
                    icon: '🍲',
                    description: 'Basic groceries and meals',
                    typicalAmount: '1,000-10,000 SOS',
                    popularity: 'High'
                },
                {
                    id: 'medical',
                    name: 'Medical Expenses',
                    icon: '💊',
                    description: 'Medicine and clinic fees',
                    typicalAmount: '2,000-15,000 SOS',
                    popularity: 'Medium'
                },
                {
                    id: 'education',
                    name: 'School Needs',
                    icon: '🎓',
                    description: 'Books, uniforms, fees',
                    typicalAmount: '5,000-20,000 SOS',
                    popularity: 'Medium'
                }
            ]
        },

        // Country-specific announcements
        announcements: [
            {
                id: 'regulatory',
                title: 'Central Bank of Somalia Compliance',
                content: 'Platform fully licensed under CBS/FI/2023/MP-0456',
                type: 'info',
                priority: 'high'
            },
            {
                id: 'currency',
                title: 'Somali Shillings Only',
                content: 'All transactions must be in SOS. No foreign currency.',
                type: 'warning',
                priority: 'high'
            },
            {
                id: 'subscription',
                title: 'Lender Subscriptions',
                content: 'Subscription renews on 28th of each month',
                type: 'info',
                priority: 'medium'
            }
        ]
    },

    // ============================================
    // 3️⃣ BORROWER PAGES (SOMALIA-SPECIFIC)
    // ============================================
    borrowerPages: {
        // Dashboard
        dashboard: {
            template: 'borrower-dashboard-so',
            sections: [
                {
                    id: 'active-loans',
                    title: 'Your Active Loans',
                    description: 'Loans within Somali groups',
                    emptyState: 'No active loans in Somalia'
                },
                {
                    id: 'group-membership',
                    title: 'Your Somali Groups',
                    description: 'Groups you belong to in Somalia',
                    maxGroups: 4,
                    hierarchyNote: 'Country → Groups → You (Borrower)'
                },
                {
                    id: 'reputation',
                    title: 'Your Somali Reputation',
                    description: 'Rating from Somali lenders',
                    scale: '1-5 stars',
                    minimum: '3.0 required for new groups'
                },
                {
                    id: 'emergency-categories',
                    title: 'Emergency Needs in Somalia',
                    description: 'What you can borrow for',
                    categories: 'somalia-specific'
                }
            ]
        },

        // Loan Application Page
        applyLoan: {
            title: 'Apply for Emergency Loan - Somalia',
            steps: [
                {
                    step: 1,
                    title: 'Select Somali Group',
                    description: 'Choose from your Somali groups only',
                    validation: 'Must be Somalia-based group'
                },
                {
                    step: 2,
                    title: 'Choose Emergency Category',
                    description: 'Select purpose for Somali Shillings loan',
                    validation: 'Must be Somalia-approved category'
                },
                {
                    step: 3,
                    title: 'Enter Amount in SOS',
                    description: 'Amount in Somali Shillings',
                    validation: '100 - 50,000 SOS based on category'
                },
                {
                    step: 4,
                    title: 'Confirm Somali Terms',
                    description: '7-day repayment, 10% interest, SOS only',
                    validation: 'Must accept Somalia-specific terms'
                }
            ],
            
            // Somalia-specific form fields
            formFields: [
                {
                    name: 'group_id',
                    label: 'Somali Group',
                    type: 'select',
                    required: true,
                    options: 'user_somali_groups',
                    validation: 'must_be_somali_group'
                },
                {
                    name: 'category',
                    label: 'Emergency Need',
                    type: 'select',
                    required: true,
                    options: 'somalia_categories',
                    validation: 'must_be_somalia_category'
                },
                {
                    name: 'amount_sos',
                    label: 'Amount (SOS)',
                    type: 'number',
                    required: true,
                    min: 100,
                    max: 50000,
                    step: 100,
                    currency: 'SOS'
                },
                {
                    name: 'purpose_description',
                    label: 'Detailed Need (Somali/English)',
                    type: 'textarea',
                    required: true,
                    maxLength: 500
                },
                {
                    name: 'repayment_confirmation',
                    label: 'I will repay in 7 days in SOS',
                    type: 'checkbox',
                    required: true,
                    validation: 'must_accept_somali_terms'
                }
            ],
            
            // Somalia-specific validation rules
            validationRules: {
                country: 'SO',
                currency: 'SOS',
                maxActiveLoans: 1,
                maxGroups: 4,
                minRating: 2.0
            }
        },

        // Repayment Page
        repayments: {
            title: 'Your Repayments - Somalia',
            currency: 'SOS',
            columns: [
                'Loan ID',
                'Amount (SOS)',
                'Interest (10%)',
                'Due Date',
                'Status',
                'Actions'
            ],
            
            // Somalia-specific repayment options
            paymentMethods: [
                {
                    id: 'evc-plus',
                    name: 'EVC Plus',
                    icon: '📱',
                    description: 'Somali mobile money',
                    available: true
                },
                {
                    id: 'sahal',
                    name: 'Sahal',
                    icon: '🏦',
                    description: 'Somali banking',
                    available: true
                },
                {
                    id: 'cash',
                    name: 'Cash',
                    icon: '💵',
                    description: 'In-person repayment',
                    available: true
                }
            ],
            
            // Partial repayment rules for Somalia
            partialRepayments: {
                allowed: true,
                minPartialAmount: 100,
                currency: 'SOS',
                frequency: 'daily'
            }
        },

        // History Page
        history: {
            title: 'Borrowing History - Somalia',
            filters: [
                'Last 30 days',
                'Last 90 days',
                'Year to date',
                'All time'
            ],
            exportFormats: ['CSV', 'PDF'],
            currency: 'SOS'
        }
    },

    // ============================================
    // 4️⃣ LENDER PAGES (SOMALIA-SPECIFIC)
    // ============================================
    lenderPages: {
        // Dashboard
        dashboard: {
            template: 'lender-dashboard-so',
            requiresSubscription: true,
            
            // Subscription status display
            subscriptionStatus: {
                display: 'prominent',
                warningDays: 7,
                expiryDay: 28,
                actions: [
                    'renew',
                    'upgrade',
                    'view_invoices'
                ]
            },
            
            // Portfolio summary (SOS)
            portfolio: {
                currency: 'SOS',
                sections: [
                    {
                        title: 'Active Ledgers',
                        description: 'Borrowers in Somali groups',
                        hierarchy: 'Country → Groups → Your Ledgers'
                    },
                    {
                        title: 'Total Lent (SOS)',
                        description: 'Amount in Somali Shillings',
                        tierLimit: 'based_on_subscription'
                    },
                    {
                        title: 'Expected Returns',
                        description: '10% interest in SOS',
                        calculation: 'principal * 0.10'
                    },
                    {
                        title: 'Repayment Rate',
                        description: 'Somali borrowers',
                        target: '99%'
                    }
                ]
            },
            
            // Quick lending actions
            quickLend: {
                title: 'Lend to Somali Borrowers',
                steps: [
                    'Select Somali group',
                    'Choose borrower from group',
                    'Set amount in SOS',
                    'Confirm Somali terms'
                ],
                restrictions: [
                    'Within your Somali groups only',
                    'SOS currency only',
                    'Subscription tier limits apply'
                ]
            }
        },

        // Ledger Management
        ledgers: {
            title: 'Your Ledgers - Somalia',
            description: 'Track borrowers in Somali groups',
            
            // Ledger columns
            columns: [
                'Borrower Name',
                'Group (Somalia)',
                'Amount (SOS)',
                'Interest (10%)',
                'Disbursed',
                'Due Date',
                'Status',
                'Actions'
            ],
            
            // Ledger actions
            actions: [
                {
                    name: 'update_repayment',
                    label: 'Update Repayment',
                    icon: '💰',
                    requires: 'active_loan'
                },
                {
                    name: 'rate_borrower',
                    label: 'Rate (1-5)',
                    icon: '⭐',
                    requires: 'repayment_made'
                },
                {
                    name: 'blacklist',
                    label: 'Blacklist',
                    icon: '🚫',
                    requires: '60_days_overdue'
                }
            ],
            
            // Somalia-specific ledger fields
            fields: [
                {
                    name: 'borrower_name',
                    label: 'Borrower',
                    editable: false,
                    validation: 'somali_name_format'
                },
                {
                    name: 'borrower_phone',
                    label: 'Phone',
                    format: '+252XXXXXXXXX',
                    validation: 'somali_phone'
                },
                {
                    name: 'guarantor1',
                    label: 'Guarantor 1',
                    required: true,
                    validation: 'somali_contact'
                },
                {
                    name: 'guarantor2',
                    label: 'Guarantor 2',
                    required: true,
                    validation: 'somali_contact'
                },
                {
                    name: 'amount_sos',
                    label: 'Amount (SOS)',
                    currency: 'SOS',
                    validation: 'within_tier_limit'
                },
                {
                    name: 'category',
                    label: 'Emergency Category',
                    options: 'somalia_categories'
                },
                {
                    name: 'disbursement_date',
                    label: 'Disbursed',
                    type: 'date',
                    validation: 'not_future'
                },
                {
                    name: 'due_date',
                    label: 'Due (7 days)',
                    type: 'date',
                    calculation: 'disbursement_date + 7 days'
                }
            ]
        },

        // Portfolio Analytics
        analytics: {
            title: 'Portfolio Analytics - Somalia',
            currency: 'SOS',
            charts: [
                {
                    type: 'group_distribution',
                    title: 'Lending by Somali Group',
                    description: 'SOS distributed per group'
                },
                {
                    type: 'category_distribution',
                    title: 'Lending by Emergency Need',
                    description: 'SOS by category in Somalia'
                },
                {
                    type: 'repayment_timeline',
                    title: 'Repayment Performance',
                    description: 'SOS repaid on time vs delayed'
                }
            ],
            
            // Somalia-specific metrics
            metrics: [
                'Average loan size (SOS)',
                'Average repayment days',
                'Default rate in Somalia',
                'Return on investment (10% target)'
            ]
        }
    },

    // ============================================
    // 5️⃣ EMERGENCY HUB PAGES (SOMALIA)
    // ============================================
    emergencyHub: {
        title: 'Emergency Hub - Somalia',
        description: '20 specific needs for Somali communities',
        currency: 'SOS',
        
        // Grouped categories for Somalia
        categoryGroups: [
            {
                group: 'Everyday Essentials',
                description: 'Basic needs for Somali households',
                categories: [
                    {
                        id: 'fare',
                        name: 'M-pesewa Fare',
                        icon: '🚌',
                        slogan: 'Move on, don\'t stall—borrow for your journey in Somalia',
                        typicalRange: '500-5,000 SOS',
                        maxAmount: 5000,
                        popular: true
                    },
                    {
                        id: 'data',
                        name: 'M-pesewa Data',
                        icon: '📶',
                        slogan: 'Stay connected, stay informed—borrow when your bundle runs out',
                        typicalRange: '200-2,000 SOS',
                        maxAmount: 2000,
                        popular: true
                    },
                    {
                        id: 'gas',
                        name: 'M-pesewa Cooking Gas',
                        icon: '🔥',
                        slogan: 'Cook with confidence—borrow when your gas is low',
                        typicalRange: '3,000-8,000 SOS',
                        maxAmount: 8000,
                        popular: true
                    },
                    {
                        id: 'food',
                        name: 'M-pesewa Food',
                        icon: '🍲',
                        slogan: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today',
                        typicalRange: '1,000-10,000 SOS',
                        maxAmount: 10000,
                        popular: true
                    }
                ]
            },
            
            {
                group: 'Logistics & Repairs',
                description: 'Transport and maintenance needs in Somalia',
                categories: [
                    {
                        id: 'fuel',
                        name: 'M-pesewa Fuel',
                        icon: '⛽',
                        slogan: 'Keep moving—borrow for fuel, no matter your ride (Bike/Car/Tuktuk)',
                        typicalRange: '1,000-5,000 SOS',
                        maxAmount: 5000
                    },
                    {
                        id: 'repair',
                        name: 'M-pesewa Repair',
                        icon: '🔧',
                        slogan: 'Fix it quick—borrow for minor repairs and keep going',
                        typicalRange: '2,000-10,000 SOS',
                        maxAmount: 10000
                    }
                ]
            },
            
            {
                group: 'Health & Education',
                description: 'Critical needs for Somali families',
                categories: [
                    {
                        id: 'medicine',
                        name: 'M-pesewa Medicine',
                        icon: '💊',
                        slogan: 'Health first—borrow for urgent medicines',
                        typicalRange: '1,000-15,000 SOS',
                        maxAmount: 15000
                    },
                    {
                        id: 'school',
                        name: 'M-pesewa School Fees',
                        icon: '🎓',
                        slogan: 'Secure your future without delay',
                        typicalRange: '5,000-20,000 SOS',
                        maxAmount: 20000
                    }
                ]
            }
        ],
        
        // Category detail page template
        categoryDetail: {
            template: 'emergency-category-so',
            sections: [
                {
                    name: 'description',
                    title: 'About this need in Somalia'
                },
                {
                    name: 'typical_uses',
                    title: 'Common uses in Somali context'
                },
                {
                    name: 'amount_guidance',
                    title: 'Suggested amounts (SOS)'
                },
                {
                    name: 'repayment_terms',
                    title: 'Repayment terms (Somalia)'
                },
                {
                    name: 'success_stories',
                    title: 'Success stories from Somalia'
                }
            ]
        }
    },

    // ============================================
    // 6️⃣ GROUPS PAGES (SOMALIA-ONLY)
    // ============================================
    groupsPages: {
        // Groups Directory
        directory: {
            title: 'Groups in Somalia',
            description: 'Connect with Somali communities',
            filters: [
                'Location in Somalia',
                'Group type',
                'Member count',
                'Reputation rating'
            ],
            
            // Group card template
            groupCard: {
                fields: [
                    'Group name',
                    'Location (Somalia)',
                    'Type (Family/Professional/etc)',
                    'Member count (5-1000)',
                    'Active lenders',
                    'Repayment rate',
                    'Join button'
                ],
                requirements: [
                    'Somalia residence required',
                    'Referral needed for private groups',
                    'Good rating for 4+ groups'
                ]
            },
            
            // Create group form (Somalia)
            createGroup: {
                title: 'Create Somali Group',
                fields: [
                    {
                        name: 'group_name',
                        label: 'Group Name',
                        placeholder: 'e.g., Mogadishu Family Group',
                        required: true
                    },
                    {
                        name: 'group_type',
                        label: 'Group Type',
                        type: 'select',
                        options: [
                            'Family',
                            'Professional',
                            'Community',
                            'Religious',
                            'Social',
                            'Business'
                        ],
                        required: true
                    },
                    {
                        name: 'location',
                        label: 'Location in Somalia',
                        type: 'select',
                        options: [
                            'Mogadishu',
                            'Hargeisa',
                            'Bosaso',
                            'Kismayo',
                            'Baidoa',
                            'Other'
                        ],
                        required: true
                    },
                    {
                        name: 'description',
                        label: 'Group Description (Somali/English)',
                        type: 'textarea',
                        maxLength: 500
                    },
                    {
                        name: 'invite_members',
                        label: 'Invite first 5 members (Somali contacts)',
                        type: 'contacts',
                        min: 5,
                        max: 5,
                        required: true
                    }
                ],
                validation: {
                    country: 'SO',
                    minMembers: 5,
                    maxMembers: 1000,
                    adminMustBeSomalia: true
                }
            }
        },
        
        // Group detail page
        groupDetail: {
            template: 'group-detail-so',
            sections: [
                {
                    name: 'overview',
                    title: 'Group Overview'
                },
                {
                    name: 'members',
                    title: 'Somali Members',
                    hierarchy: 'Country → This Group → Members'
                },
                {
                    name: 'lenders',
                    title: 'Lenders in Group',
                    filter: 'subscription_active'
                },
                {
                    name: 'borrowers',
                    title: 'Borrowers in Group',
                    filter: 'good_rating_required'
                },
                {
                    name: 'activity',
                    title: 'Recent Activity in SOS'
                },
                {
                    name: 'rules',
                    title: 'Group Rules (Somalia)'
                }
            ]
        }
    },

    // ============================================
    // 7️⃣ LEGAL PAGES (SOMALIA-SPECIFIC)
    // ============================================
    legalPages: {
        // Terms page
        terms: {
            template: 'terms-so',
            title: 'Terms & Conditions - Somalia',
            lastUpdated: '2024-01-01',
            requiredAcceptance: true,
            sections: [
                'Platform Role in Somalia',
                'Somali User Eligibility',
                'SOS Currency Terms',
                'Somali Regulatory Compliance',
                'Dispute Resolution in Somalia'
            ]
        },
        
        // Privacy page
        privacy: {
            template: 'privacy-so',
            title: 'Privacy Policy - Somalia',
            dataController: 'M-Pesewa Somalia Operations',
            dataLocation: 'Servers in Somalia',
            retentionPeriod: '7 years',
            somaliLaw: 'Data Protection Guidelines 2020'
        },
        
        // Fair practices
        fairPractices: {
            template: 'fair-practices-so',
            title: 'Fair Practices Code - Somalia',
            sections: [
                'Lender Responsibilities in Somalia',
                'Borrower Responsibilities in Somalia',
                'Platform Commitments in Somalia',
                'Grievance Redressal Process'
            ]
        }
    },

    // ============================================
    // 8️⃣ PAGE TEMPLATES & COMPONENTS
    // ============================================
    templates: {
        // Base template for Somalia pages
        baseTemplate: {
            name: 'base-so',
            components: [
                'somali-header',
                'country-banner-so',
                'currency-display-sos',
                'somali-footer',
                'compliance-badge-so'
            ],
            styles: {
                primaryColor: '#003366',
                secondaryColor: '#0099ff',
                currencyColor: '#28a745',
                warningColor: '#f37021'
            }
        },
        
        // Dashboard template
        dashboardTemplate: {
            name: 'dashboard-so',
            extends: 'base-so',
            additionalComponents: [
                'stats-widget-so',
                'quick-actions-so',
                'announcements-so',
                'hierarchy-breadcrumb'
            ]
        },
        
        // Form template
        formTemplate: {
            name: 'form-so',
            extends: 'base-so',
            additionalComponents: [
                'currency-input-sos',
                'somali-phone-input',
                'somali-id-verification',
                'terms-acceptance-so'
            ]
        }
    },

    // ============================================
    // 9️⃣ PAGE VALIDATION & MIDDLEWARE
    // ============================================
    validation: {
        /**
         * Validate user can access Somalia page
         * @param {Object} user - User object
         * @param {string} page - Page identifier
         * @returns {Object} - Validation result
         */
        validatePageAccess: (user, page) => {
            const errors = [];
            
            // Country validation
            if (user.country !== 'SO') {
                errors.push('User must be in Somalia to access this page');
            }
            
            // Page-specific validations
            const pageConfig = SomaliaPages.routing.routes[page];
            if (pageConfig) {
                // Role validation
                if (pageConfig.roles && !pageConfig.roles.includes(user.role)) {
                    errors.push(`Page requires roles: ${pageConfig.roles.join(', ')}`);
                }
                
                // Subscription validation for lenders
                if (pageConfig.requiresSubscription && user.role === 'lender') {
                    if (!user.subscription || user.subscription.status !== 'active') {
                        errors.push('Active subscription required');
                    }
                }
                
                // Country requirement
                if (pageConfig.requiresCountry && pageConfig.requiresCountry !== user.country) {
                    errors.push(`Page requires country: ${pageConfig.requiresCountry}`);
                }
            }
            
            return {
                canAccess: errors.length === 0,
                errors: errors,
                redirect: errors.length > 0 ? '/countries/select' : null
            };
        },
        
        /**
         * Validate form data for Somalia
         * @param {string} formType - Form identifier
         * @param {Object} data - Form data
         * @returns {Object} - Validation result
         */
        validateFormData: (formType, data) => {
            const errors = [];
            const warnings = [];
            
            switch (formType) {
                case 'loan-application':
                    // Amount in SOS validation
                    if (data.currency && data.currency !== 'SOS') {
                        errors.push('Currency must be SOS for Somalia');
                    }
                    
                    // Amount range validation
                    if (data.amount) {
                        if (data.amount < 100) {
                            errors.push('Minimum amount is 100 SOS');
                        }
                        if (data.amount > 50000) {
                            errors.push('Maximum amount is 50,000 SOS for Basic tier');
                        }
                    }
                    
                    // Somali phone validation
                    if (data.phone && !/^\+252[0-9]{9}$/.test(data.phone)) {
                        errors.push('Phone must be in Somali format: +252XXXXXXXXX');
                    }
                    break;
                    
                case 'group-creation':
                    // Min members validation
                    if (data.members && data.members.length < 5) {
                        errors.push('Minimum 5 members required for Somali group');
                    }
                    
                    // Location validation
                    if (data.location && !['Mogadishu', 'Hargeisa', 'Bosaso', 'Kismayo', 'Baidoa', 'Other'].includes(data.location)) {
                        warnings.push('Location should be in Somalia');
                    }
                    break;
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors,
                warnings: warnings
            };
        }
    },

    // ============================================
    // 🔟 PAGE GENERATION FUNCTIONS
    // ============================================
    pageGenerators: {
        /**
         * Generate Somalia dashboard HTML
         * @param {Object} user - User object
         * @returns {string} - HTML content
         */
        generateDashboard: (user) => {
            const isBorrower = user.role === 'borrower';
            const isLender = user.role === 'lender';
            
            return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>${SomaliaPages.dashboard.header.title} | ${user.role.toUpperCase()}</title>
                <meta name="country" content="SO">
                <meta name="currency" content="SOS">
                <style>
                    .somali-flag { background: #4189DD; color: white; padding: 2px 8px; border-radius: 4px; }
                    .currency-sos { color: #28a745; font-weight: bold; }
                    .hierarchy-path { font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <header>
                    <h1>${SomaliaPages.dashboard.header.title}</h1>
                    <p>${SomaliaPages.dashboard.header.subtitle}</p>
                    <span class="somali-flag">🇸🇴 Somalia Only</span>
                </header>
                
                <div class="hierarchy-path">
                    Global → <strong>Somalia</strong> → Groups → ${user.role === 'lender' ? 'Lenders → Ledgers' : 'Borrowers'}
                </div>
                
                <div class="stats">
                    ${SomaliaPages.dashboard.stats.totalUsers.label}: 
                    <span class="currency-sos">${SomaliaPages.dashboard.stats.totalUsers.value}</span>
                </div>
                
                <div class="quick-actions">
                    <h3>Quick Actions for Somali ${user.role}</h3>
                    ${isBorrower ? SomaliaPages.dashboard.quickActions.borrower.map(action => `
                        <div class="action-card" style="border-left-color: ${action.color}">
                            <span>${action.icon}</span>
                            <h4>${action.title}</h4>
                            <p>${action.description}</p>
                            <a href="${action.path}">Go →</a>
                        </div>
                    `).join('') : ''}
                    
                    ${isLender ? SomaliaPages.dashboard.quickActions.lender.map(action => `
                        <div class="action-card" style="border-left-color: ${action.color}">
                            <span>${action.icon}</span>
                            <h4>${action.title}</h4>
                            <p>${action.description}</p>
                            <a href="${action.path}">Go →</a>
                        </div>
                    `).join('') : ''}
                </div>
                
                <div class="emergency-categories">
                    <h3>Emergency Needs in Somalia</h3>
                    ${SomaliaPages.dashboard.emergencyCategories.categories.map(cat => `
                        <div class="category">
                            <span>${cat.icon}</span>
                            <h4>${cat.name}</h4>
                            <p>${cat.description}</p>
                            <small>${cat.typicalAmount} SOS</small>
                        </div>
                    `).join('')}
                </div>
                
                <div class="announcements">
                    ${SomaliaPages.dashboard.announcements.map(ann => `
                        <div class="announcement ${ann.type}">
                            <h4>${ann.title}</h4>
                            <p>${ann.content}</p>
                        </div>
                    `).join('')}
                </div>
                
                <footer>
                    <p>🇸🇴 M-Pesewa Somalia | License: CBS/FI/2023/MP-0456</p>
                    <p>All transactions in Somali Shillings (SOS) | No cross-border operations</p>
                </footer>
            </body>
            </html>
            `;
        },
        
        /**
         * Generate emergency category page
         * @param {string} categoryId - Category identifier
         * @returns {string} - HTML content
         */
        generateEmergencyCategory: (categoryId) => {
            // Find category in all groups
            let category = null;
            for (const group of SomaliaPages.emergencyHub.categoryGroups) {
                const found = group.categories.find(c => c.id === categoryId);
                if (found) {
                    category = found;
                    break;
                }
            }
            
            if (!category) {
                return '<h1>Category not found in Somalia</h1>';
            }
            
            return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${category.name} - Somalia | M-Pesewa</title>
                <meta name="country" content="SO">
                <meta name="currency" content="SOS">
            </head>
            <body>
                <header>
                    <span class="somali-flag">🇸🇴 Somalia</span>
                    <h1>${category.icon} ${category.name}</h1>
                    <p class="slogan">${category.slogan}</p>
                </header>
                
                <div class="category-details">
                    <div class="section">
                        <h3>About this need in Somalia</h3>
                        <p>Emergency support for Somali communities. All amounts in Somali Shillings (SOS).</p>
                    </div>
                    
                    <div class="section">
                        <h3>Typical Amounts</h3>
                        <p><strong>Range:</strong> ${category.typicalRange} SOS</p>
                        <p><strong>Maximum:</strong> ${category.maxAmount.toLocaleString()} SOS</p>
                        <p><strong>Currency:</strong> Somali Shillings only</p>
                    </div>
                    
                    <div class="section">
                        <h3>Repayment Terms (Somalia)</h3>
                        <ul>
                            <li>7-day repayment period</li>
                            <li>10% interest (fixed)</li>
                            <li>5% daily penalty after 7 days</li>
                            <li>Default after 60 days</li>
                            <li>Somali law governs all disputes</li>
                        </ul>
                    </div>
                    
                    <div class="section">
                        <h3>How to Apply in Somalia</h3>
                        <ol>
                            <li>Be member of Somali group</li>
                            <li>Select this emergency category</li>
                            <li>Enter amount in SOS</li>
                            <li>Accept Somali terms</li>
                            <li>Receive funds in SOS</li>
                        </ol>
                    </div>
                    
                    <div class="actions">
                        <a href="/so/borrower/apply?category=${categoryId}" class="btn btn-primary">
                            Apply for ${category.name} Loan
                        </a>
                        <p><small>Amounts in Somali Shillings (SOS) only</small></p>
                    </div>
                </div>
                
                <footer>
                    <p>🇸🇴 M-Pesewa Somalia | Central Bank of Somalia Licensed</p>
                    <p>All operations within Somalia | SOS currency only</p>
                </footer>
            </body>
            </html>
            `;
        }
    }
};

// ============================================
// PAGE MIDDLEWARE FUNCTIONS
// ============================================
const SomaliaPageMiddleware = {
    /**
     * Middleware to enforce Somalia access
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Function} next - Next function
     */
    enforceSomaliaAccess: (req, res, next) => {
        const user = req.user;
        
        if (!user) {
            return res.redirect('/auth/login?country=SO');
        }
        
        // Check if user is in Somalia
        if (user.country !== 'SO') {
            return res.redirect('/countries/select?error=not_somalia');
        }
        
        // Check page-specific requirements
        const path = req.path.replace('/countries/so', '');
        const pageKey = Object.keys(SomaliaPages.routing.routes).find(key => 
            SomaliaPages.routing.routes[key].path === path
        );
        
        if (pageKey) {
            const validation = SomaliaPages.validation.validatePageAccess(user, pageKey);
            if (!validation.canAccess) {
                return res.redirect(validation.redirect || '/so/dashboard');
            }
        }
        
        // Add Somalia context to request
        req.somaliaContext = {
            currency: 'SOS',
            country: 'SO',
            hierarchy: 'Global → Somalia → Groups → ' + (user.role === 'lender' ? 'Lenders → Ledgers' : 'Borrowers')
        };
        
        next();
    },
    
    /**
     * Inject Somalia-specific template variables
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Function} next - Next function
     */
    injectSomaliaTemplateVars: (req, res, next) => {
        res.locals.somalia = {
            currency: 'SOS',
            flag: '🇸🇴',
            countryName: 'Somalia',
            license: 'CBS/FI/2023/MP-0456',
            supportPhone: '+252 63 0000000',
            hierarchy: req.somaliaContext?.hierarchy || 'Global → Somalia'
        };
        
        next();
    },
    
    /**
     * Validate form submission for Somalia
     * @param {string} formType - Form type
     */
    validateSomaliaForm: (formType) => {
        return (req, res, next) => {
            const validation = SomaliaPages.validation.validateFormData(formType, req.body);
            
            if (!validation.isValid) {
                req.flash('error', validation.errors);
                req.flash('warning', validation.warnings);
                return res.redirect('back');
            }
            
            // Add Somalia-specific fields
            req.body.country = 'SO';
            req.body.currency = 'SOS';
            req.body.somaliaValidated = true;
            
            next();
        };
    }
};

// ============================================
// EXPORT MODULE
// ============================================
module.exports = {
    // Page configurations
    pages: SomaliaPages,
    
    // Middleware
    middleware: SomaliaPageMiddleware,
    
    // Page generators
    generators: SomaliaPages.pageGenerators,
    
    // Validation utilities
    validation: SomaliaPages.validation,
    
    // Route configuration
    routes: SomaliaPages.routing.routes,
    
    // Constants
    CONSTANTS: {
        COUNTRY_CODE: 'SO',
        CURRENCY: 'SOS',
        BASE_PATH: '/countries/so',
        REQUIRED_ROLES: {
            borrower: ['borrower'],
            lender: ['lender'],
            admin: ['admin'],
            all: ['borrower', 'lender', 'admin']
        },
        HIERARCHY: 'Global → Somalia → Groups → Lenders/Borrowers → Ledgers'
    },
    
    /**
     * Get page configuration by path
     * @param {string} path - Page path
     * @returns {Object} - Page configuration
     */
    getPageConfig: (path) => {
        return Object.values(SomaliaPages.routing.routes).find(route => route.path === path);
    },
    
    /**
     * Check if user can access path
     * @param {Object} user - User object
     * @param {string} path - Request path
     * @returns {boolean} - True if accessible
     */
    canAccessPath: (user, path) => {
        const pageKey = Object.keys(SomaliaPages.routing.routes).find(key => 
            SomaliaPages.routing.routes[key].path === path
        );
        
        if (!pageKey) return true; // Public page
        
        const validation = SomaliaPages.validation.validatePageAccess(user, pageKey);
        return validation.canAccess;
    }
};

// ============================================
// INITIALIZATION
// ============================================
(() => {
    console.log('🇸🇴 Somalia Pages Module Loaded');
    console.log(`   Base Path: ${SomaliaPages.routing.basePath}`);
    console.log(`   Available Pages: ${Object.keys(SomaliaPages.routing.routes).length}`);
    console.log(`   Hierarchy: ${SomaliaPages.CONSTANTS.HIERARCHY}`);
    console.log(`   Currency: ${SomaliaPages.CONSTANTS.CURRENCY}`);
})();