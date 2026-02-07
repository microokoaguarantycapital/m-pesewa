/**
 * M-PESEWA ETHIOPIA PAGES CONFIGURATION
 * Country-specific page configurations and routing
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const EthiopiaPages = {
    // ============================================
    // 1️⃣ PAGE ROUTING CONFIGURATION
    // ============================================
    routes: {
        basePath: '/et',
        defaultRedirect: '/et/dashboard',
        countryLocked: true, // All routes locked to Ethiopia
        
        // Main application routes
        main: {
            home: {
                path: '/',
                component: 'HomePage',
                title: 'M-Pesewa Ethiopia | Emergency Micro-Lending',
                meta: {
                    description: 'Ethiopian peer-to-peer emergency lending platform',
                    keywords: 'emergency loan Ethiopia, Addis Ababa, ETB loans, Ethiopian lending'
                },
                authRequired: false,
                countryRequired: true
            },
            
            dashboard: {
                path: '/dashboard',
                component: 'DashboardPage',
                title: 'Dashboard | M-Pesewa Ethiopia',
                meta: {
                    description: 'Your M-Pesewa Ethiopia dashboard'
                },
                authRequired: true,
                countryRequired: true,
                roleBased: true
            },
            
            emergencyHub: {
                path: '/emergency',
                component: 'EmergencyHubPage',
                title: 'Emergency Hub | M-Pesewa Ethiopia',
                meta: {
                    description: '20 emergency loan categories for Ethiopia'
                },
                authRequired: false,
                countryRequired: true,
                categories: 20
            },
            
            groups: {
                path: '/groups',
                component: 'GroupsPage',
                title: 'Groups | M-Pesewa Ethiopia',
                meta: {
                    description: 'Join or create trusted lending groups in Ethiopia'
                },
                authRequired: true,
                countryRequired: true,
                maxGroupsPerUser: 4
            }
        },
        
        // Borrower specific routes
        borrower: {
            dashboard: {
                path: '/borrower/dashboard',
                component: 'BorrowerDashboard',
                title: 'Borrower Dashboard | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'borrower',
                features: ['loan-requests', 'repayment-tracking', 'history']
            },
            
            apply: {
                path: '/borrower/apply',
                component: 'ApplyForLoanPage',
                title: 'Apply for Loan | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'borrower',
                validation: ['group-membership', 'good-standing', 'no-active-loan']
            },
            
            history: {
                path: '/borrower/history',
                component: 'BorrowHistoryPage',
                title: 'Borrow History | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'borrower',
                retention: '7 years'
            },
            
            repayments: {
                path: '/borrower/repayments',
                component: 'RepaymentsPage',
                title: 'Repayments | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'borrower',
                features: ['partial-payments', 'schedule', 'receipts']
            },
            
            disputes: {
                path: '/borrower/disputes',
                component: 'DisputesPage',
                title: 'Dispute Resolution | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'borrower',
                escalationPath: '5-level'
            }
        },
        
        // Lender specific routes
        lender: {
            dashboard: {
                path: '/lender/dashboard',
                component: 'LenderDashboard',
                title: 'Lender Dashboard | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'lender',
                subscriptionRequired: true,
                features: ['portfolio', 'analytics', 'risk-tools']
            },
            
            portfolio: {
                path: '/lender/portfolio',
                component: 'PortfolioPage',
                title: 'Portfolio | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'lender',
                subscriptionRequired: true,
                data: ['active-loans', 'returns', 'risk-metrics']
            },
            
            history: {
                path: '/lender/history',
                component: 'LendingHistoryPage',
                title: 'Lending History | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'lender',
                subscriptionRequired: true,
                retention: '7 years'
            },
            
            rules: {
                path: '/lender/rules',
                component: 'LendingRulesPage',
                title: 'Lending Rules | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'lender',
                content: ['regulations', 'best-practices', 'risk-management']
            },
            
            risk: {
                path: '/lender/risk',
                component: 'RiskManagementPage',
                title: 'Risk Management | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'lender',
                subscriptionRequired: true,
                tools: ['scoring', 'monitoring', 'mitigation']
            }
        },
        
        // Emergency category routes
        emergencyCategories: {
            fare: {
                path: '/emergency/fare',
                component: 'EmergencyCategoryPage',
                title: 'Transport Fare | Emergency Loan | M-Pesewa Ethiopia',
                category: 'fare',
                icon: '🚌',
                maxAmount: 500,
                description: 'Borrow for transport when stranded'
            },
            
            data: {
                path: '/emergency/data',
                component: 'EmergencyCategoryPage',
                title: 'Mobile Data | Emergency Loan | M-Pesewa Ethiopia',
                category: 'data',
                icon: '📶',
                maxAmount: 300,
                description: 'Stay connected when your data bundle runs out'
            },
            
            gas: {
                path: '/emergency/gas',
                component: 'EmergencyCategoryPage',
                title: 'Cooking Gas | Emergency Loan | M-Pesewa Ethiopia',
                category: 'gas',
                icon: '🔥',
                maxAmount: 800,
                description: 'Cook with confidence when your gas runs low'
            },
            
            food: {
                path: '/emergency/food',
                component: 'EmergencyCategoryPage',
                title: 'Food | Emergency Loan | M-Pesewa Ethiopia',
                category: 'food',
                icon: '🍲',
                maxAmount: 1000,
                description: 'Don\'t sleep hungry when paycheck is delayed'
            },
            
            fuel: {
                path: '/emergency/fuel',
                component: 'EmergencyCategoryPage',
                title: 'Fuel | Emergency Loan | M-Pesewa Ethiopia',
                category: 'fuel',
                icon: '⛽',
                maxAmount: 1500,
                description: 'Keep moving when your vehicle runs out of fuel'
            },
            
            medicine: {
                path: '/emergency/medicine',
                component: 'EmergencyCategoryPage',
                title: 'Medicine | Emergency Loan | M-Pesewa Ethiopia',
                category: 'medicine',
                icon: '💊',
                maxAmount: 3000,
                description: 'Health first - borrow for urgent medicines'
            },
            
            school: {
                path: '/emergency/school',
                component: 'EmergencyCategoryPage',
                title: 'School Fees | Emergency Loan | M-Pesewa Ethiopia',
                category: 'school',
                icon: '🎓',
                maxAmount: 10000,
                description: 'Secure education without delay'
            }
        },
        
        // Subscription routes
        subscription: {
            plans: {
                path: '/subscription/plans',
                component: 'SubscriptionPlansPage',
                title: 'Subscription Plans | M-Pesewa Ethiopia',
                authRequired: false,
                countryRequired: true,
                tiers: ['basic', 'premium', 'super']
            },
            
            current: {
                path: '/subscription/current',
                component: 'CurrentPlanPage',
                title: 'Current Plan | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'lender',
                features: ['status', 'limits', 'expiry']
            },
            
            upgrade: {
                path: '/subscription/upgrade',
                component: 'UpgradePlanPage',
                title: 'Upgrade Plan | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'lender',
                validation: ['current-tier', 'payment-method']
            },
            
            history: {
                path: '/subscription/history',
                component: 'SubscriptionHistoryPage',
                title: 'Subscription History | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'lender',
                retention: '3 years'
            },
            
            invoices: {
                path: '/subscription/invoices',
                component: 'InvoicesPage',
                title: 'Invoices & Receipts | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'lender',
                downloadFormats: ['PDF', 'CSV']
            }
        },
        
        // Legal routes
        legal: {
            terms: {
                path: '/terms',
                component: 'TermsPage',
                title: 'Terms & Conditions | M-Pesewa Ethiopia',
                authRequired: false,
                countryRequired: true,
                version: '1.0'
            },
            
            privacy: {
                path: '/privacy',
                component: 'PrivacyPolicyPage',
                title: 'Privacy Policy | M-Pesewa Ethiopia',
                authRequired: false,
                countryRequired: true,
                gdprCompliant: true
            },
            
            compliance: {
                path: '/compliance',
                component: 'CompliancePage',
                title: 'Compliance | M-Pesewa Ethiopia',
                authRequired: false,
                countryRequired: true,
                regulations: ['NBE', 'Data Protection', 'Consumer Rights']
            }
        },
        
        // Support routes
        support: {
            help: {
                path: '/help',
                component: 'HelpCenterPage',
                title: 'Help Center | M-Pesewa Ethiopia',
                authRequired: false,
                countryRequired: true,
                languages: ['English', 'Amharic']
            },
            
            contact: {
                path: '/contact',
                component: 'ContactPage',
                title: 'Contact Us | M-Pesewa Ethiopia',
                authRequired: false,
                countryRequired: true,
                channels: ['phone', 'email', 'whatsapp']
            },
            
            faq: {
                path: '/faq',
                component: 'FAQPage',
                title: 'FAQ | M-Pesewa Ethiopia',
                authRequired: false,
                countryRequired: true,
                categories: ['borrowing', 'lending', 'technical', 'legal']
            }
        },
        
        // Admin routes
        admin: {
            dashboard: {
                path: '/admin/dashboard',
                component: 'AdminDashboard',
                title: 'Admin Dashboard | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'admin',
                permissions: ['override', 'audit', 'manage']
            },
            
            users: {
                path: '/admin/users',
                component: 'AdminUsersPage',
                title: 'User Management | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'admin',
                actions: ['view', 'edit', 'suspend', 'delete']
            },
            
            groups: {
                path: '/admin/groups',
                component: 'AdminGroupsPage',
                title: 'Group Management | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'admin',
                actions: ['view', 'audit', 'moderate']
            },
            
            blacklist: {
                path: '/admin/blacklist',
                component: 'AdminBlacklistPage',
                title: 'Blacklist Management | M-Pesewa Ethiopia',
                authRequired: true,
                countryRequired: true,
                roleRequired: 'admin',
                actions: ['add', 'remove', 'appeal-review']
            }
        }
    },

    // ============================================
    // 2️⃣ PAGE CONTENT CONFIGURATION
    // ============================================
    content: {
        // Home page content
        home: {
            hero: {
                title: 'Emergency finance, Ethiopian style',
                subtitle: 'Get access to small, purpose-based loans from trusted community members in Ethiopia',
                cta: {
                    primary: 'Get Emergency Help',
                    secondary: 'How It Works'
                }
            },
            
            trustIndicators: [
                'Community-based lending',
                'NBE compliant',
                'Built for urgent Ethiopian needs',
                'No predatory lending'
            ],
            
            howItWorks: {
                title: 'How M-Pesewa Works in Ethiopia',
                steps: [
                    {
                        number: 1,
                        title: 'Join an Ethiopian trusted group',
                        description: 'Connect with friends, family, or professional circles in Ethiopia'
                    },
                    {
                        number: 2,
                        title: 'Borrow or lend in ETB',
                        description: 'All transactions in Ethiopian Birr with local payment methods'
                    },
                    {
                        number: 3,
                        title: 'Repay with clear Ethiopian terms',
                        description: '7-day repayment with 10% interest, compliant with local regulations'
                    }
                ]
            }
        },
        
        // Borrower page content
        borrower: {
            benefits: [
                'No subscription fees for Basic tier',
                'Access to 20 Ethiopian emergency categories',
                '7-day repayment terms in ETB',
                'Build trust rating in Ethiopian community'
            ],
            
            requirements: [
                'Ethiopian national ID',
                'Active phone number',
                '2 Ethiopian referrers',
                'Good standing in groups'
            ],
            
            warnings: [
                'Default affects Ethiopian credit rating',
                'Blacklisting consequences in Ethiopian network',
                'High cost for emergencies only'
            ]
        },
        
        // Lender page content
        lender: {
            benefits: [
                'Earn returns in ETB',
                'Lend within trusted Ethiopian groups',
                'Unlimited personal ledgers',
                '10% weekly returns'
            ],
            
            requirements: [
                'Ethiopian tax PIN',
                'Bank account in Ethiopia',
                'Active subscription',
                'KYC verification'
            ],
            
            risks: [
                'Risk of total loss of principal',
                'No platform guarantee',
                'Default risk exists',
                'Market risks in Ethiopia'
            ]
        },
        
        // Emergency hub content
        emergencyHub: {
            introduction: 'Emergency support for real life in Ethiopia',
            categoriesNote: 'All loans in Ethiopian Birr (ETB)',
            popularCategories: ['Transport Fare', 'Mobile Data', 'Cooking Gas', 'Food']
        },
        
        // Legal pages content
        legalPages: {
            termsLastUpdated: '2024-01-01',
            privacyLastUpdated: '2024-01-01',
            complianceLastUpdated: '2024-01-01',
            jurisdiction: 'Addis Ababa, Ethiopia',
            governingLaw: 'Laws of Ethiopia'
        }
    },

    // ============================================
    // 3️⃣ PAGE LAYOUT CONFIGURATION
    // ============================================
    layout: {
        // Header configuration
        header: {
            logo: {
                text: 'M-PESEWA ETHIOPIA',
                subtext: 'Trusted Circles Lending',
                color: '#003366'
            },
            
            navigation: [
                {
                    label: 'Home',
                    path: '/et',
                    icon: '🏠'
                },
                {
                    label: 'Borrower',
                    path: '/et/borrower',
                    icon: '💼',
                    dropdown: true
                },
                {
                    label: 'Lender',
                    path: '/et/lender',
                    icon: '🌱',
                    dropdown: true
                },
                {
                    label: 'Emergency Hub',
                    path: '/et/emergency',
                    icon: '🚨',
                    badge: '20'
                },
                {
                    label: 'Subscription',
                    path: '/et/subscription',
                    icon: '💰',
                    dropdown: true
                }
            ],
            
            authButtons: {
                signIn: {
                    label: 'Sign In',
                    path: '/et/auth/login',
                    variant: 'outline'
                },
                signUp: {
                    label: 'Get Started',
                    path: '/et/auth/register',
                    variant: 'primary'
                }
            }
        },
        
        // Footer configuration
        footer: {
            backgroundColor: '#1f2a37',
            columns: 6,
            contactInfo: {
                phone: '+251 11 000 0000',
                email: 'support.et@mpesewa.com',
                address: 'Bole Road, Addis Ababa, Ethiopia',
                hours: 'Mon-Fri 8:00-18:00, Sat 9:00-14:00'
            }
        },
        
        // Sidebar configuration (for dashboards)
        sidebar: {
            borrower: [
                {
                    label: 'Dashboard',
                    path: '/et/borrower/dashboard',
                    icon: '📊',
                    badge: null
                },
                {
                    label: 'Apply for Loan',
                    path: '/et/borrower/apply',
                    icon: '📝',
                    badge: 'New'
                },
                {
                    label: 'My Loans',
                    path: '/et/borrower/history',
                    icon: '📋',
                    badge: null
                },
                {
                    label: 'Repayments',
                    path: '/et/borrower/repayments',
                    icon: '💳',
                    badge: null
                },
                {
                    label: 'My Groups',
                    path: '/et/groups',
                    icon: '👥',
                    badge: null
                },
                {
                    label: 'Profile',
                    path: '/et/profile',
                    icon: '👤',
                    badge: null
                }
            ],
            
            lender: [
                {
                    label: 'Dashboard',
                    path: '/et/lender/dashboard',
                    icon: '📊',
                    badge: null
                },
                {
                    label: 'Portfolio',
                    path: '/et/lender/portfolio',
                    icon: '📈',
                    badge: null
                },
                {
                    label: 'Lending History',
                    path: '/et/lender/history',
                    icon: '📋',
                    badge: null
                },
                {
                    label: 'Risk Management',
                    path: '/et/lender/risk',
                    icon: '🛡️',
                    badge: null
                },
                {
                    label: 'Ledgers',
                    path: '/et/lender/ledgers',
                    icon: '📒',
                    badge: null
                },
                {
                    label: 'Subscription',
                    path: '/et/subscription/current',
                    icon: '💰',
                    badge: 'Active'
                }
            ],
            
            admin: [
                {
                    label: 'Dashboard',
                    path: '/et/admin/dashboard',
                    icon: '🛠️',
                    badge: null
                },
                {
                    label: 'User Management',
                    path: '/et/admin/users',
                    icon: '👥',
                    badge: null
                },
                {
                    label: 'Group Management',
                    path: '/et/admin/groups',
                    icon: '🏢',
                    badge: null
                },
                {
                    label: 'Blacklist',
                    path: '/et/admin/blacklist',
                    icon: '🚫',
                    badge: null
                },
                {
                    label: 'Audit Logs',
                    path: '/et/admin/audit',
                    icon: '📜',
                    badge: null
                },
                {
                    label: 'System Health',
                    path: '/et/admin/health',
                    icon: '❤️',
                    badge: null
                }
            ]
        },
        
        // Breadcrumb configuration
        breadcrumbs: {
            enabled: true,
            separator: '›',
            homeLabel: 'Home',
            showCurrentPage: true
        },
        
        // Page transitions
        transitions: {
            enabled: true,
            type: 'fade',
            duration: 300,
            mobileOptimized: true
        }
    },

    // ============================================
    // 4️⃣ PAGE VALIDATION RULES
    // ============================================
    validation: {
        // Access validation rules
        access: {
            countryLock: {
                enabled: true,
                redirectPath: '/countries/select',
                localStorageKey: 'mpesewa_country',
                cookieName: 'country_preference'
            },
            
            auth: {
                requiredPaths: [
                    '/et/dashboard',
                    '/et/borrower',
                    '/et/lender',
                    '/et/profile',
                    '/et/groups'
                ],
                publicPaths: [
                    '/et',
                    '/et/emergency',
                    '/et/subscription/plans',
                    '/et/terms',
                    '/et/privacy',
                    '/et/help'
                ],
                redirectPath: '/et/auth/login'
            },
            
            role: {
                borrowerOnly: [
                    '/et/borrower/dashboard',
                    '/et/borrower/apply',
                    '/et/borrower/history',
                    '/et/borrower/repayments'
                ],
                lenderOnly: [
                    '/et/lender/dashboard',
                    '/et/lender/portfolio',
                    '/et/lender/history',
                    '/et/lender/risk',
                    '/et/subscription/current'
                ],
                adminOnly: [
                    '/et/admin/dashboard',
                    '/et/admin/users',
                    '/et/admin/groups',
                    '/et/admin/blacklist'
                ]
            },
            
            subscription: {
                requiredFor: [
                    '/et/lender/dashboard',
                    '/et/lender/portfolio',
                    '/et/lender/history',
                    '/et/lender/risk'
                ],
                checkFrequency: 'page-load',
                gracePeriod: 3
            }
        },
        
        // Form validation rules
        forms: {
            borrowerRegistration: {
                requiredFields: [
                    'fullName',
                    'nationalId',
                    'phoneNumber',
                    'location',
                    'referrer1',
                    'referrer2',
                    'password',
                    'termsAccepted'
                ],
                validation: {
                    nationalId: {
                        pattern: '/^[0-9]{9,15}$/',
                        message: 'Valid Ethiopian national ID required'
                    },
                    phoneNumber: {
                        pattern: '/^\\+251[0-9]{9}$/',
                        message: 'Valid Ethiopian phone number required (+251)'
                    },
                    password: {
                        minLength: 8,
                        maxLength: 12,
                        requirements: ['uppercase', 'lowercase', 'number', 'special']
                    }
                }
            },
            
            lenderRegistration: {
                requiredFields: [
                    'fullName',
                    'nationalId',
                    'taxPin',
                    'bankAccount',
                    'phoneNumber',
                    'location',
                    'subscriptionTier',
                    'password',
                    'termsAccepted'
                ],
                validation: {
                    taxPin: {
                        pattern: '/^[A-Z0-9]{10,15}$/',
                        message: 'Valid Ethiopian tax PIN required'
                    },
                    bankAccount: {
                        pattern: '/^[0-9]{10,20}$/',
                        message: 'Valid Ethiopian bank account required'
                    }
                }
            },
            
            loanApplication: {
                requiredFields: [
                    'amount',
                    'category',
                    'purpose',
                    'group',
                    'repaymentPlan'
                ],
                validation: {
                    amount: {
                        min: 10,
                        maxByTier: {
                            basic: 1500,
                            premium: 5000,
                            super: 20000
                        },
                        message: 'Amount must be within tier limits'
                    },
                    category: {
                        allowed: 20,
                        message: 'Valid emergency category required'
                    }
                }
            }
        },
        
        // Business logic validation
        businessRules: {
            maxGroupsPerBorrower: 4,
            minGroupMembers: 5,
            maxGroupMembers: 1000,
            oneActiveLoanPerGroup: true,
            maxLoanDuration: 7,
            interestRate: 0.10,
            penaltyRate: 0.05,
            defaultThreshold: 60
        }
    },

    // ============================================
    // 5️⃣ PAGE SEO CONFIGURATION
    // ============================================
    seo: {
        // Meta tags configuration
        meta: {
            defaultTitle: 'M-Pesewa Ethiopia | Emergency Micro-Lending Platform',
            defaultDescription: 'Peer-to-peer emergency lending platform for Ethiopia. Connect with trusted groups for quick loans in ETB.',
            defaultKeywords: 'emergency loan Ethiopia, Addis Ababa, ETB loans, Ethiopian lending, microfinance Ethiopia',
            ogImage: '/assets/images/og-ethiopia.jpg',
            twitterCard: 'summary_large_image',
            canonicalBase: 'https://mpesewa.com/et'
        },
        
        // Structured data
        structuredData: {
            organization: {
                '@type': 'FinancialService',
                name: 'M-Pesewa Ethiopia',
                url: 'https://mpesewa.com/et',
                logo: 'https://mpesewa.com/assets/logo-ethiopia.png',
                contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+251-11-000-0000',
                    contactType: 'customer service',
                    areaServed: 'ET',
                    availableLanguage: ['English', 'Amharic']
                }
            },
            
            breadcrumbList: {
                '@type': 'BreadcrumbList',
                itemListElement: []
            },
            
            faqPage: {
                '@type': 'FAQPage',
                mainEntity: []
            }
        },
        
        // Sitemap configuration
        sitemap: {
            include: true,
            priority: {
                home: 1.0,
                mainPages: 0.8,
                categoryPages: 0.7,
                legalPages: 0.5
            },
            changefreq: {
                home: 'daily',
                mainPages: 'weekly',
                categoryPages: 'monthly',
                legalPages: 'yearly'
            }
        },
        
        // Local SEO
        localSeo: {
            geo: {
                latitude: 9.0320,
                longitude: 38.7469,
                radius: 500000
            },
            places: ['Addis Ababa', 'Dire Dawa', 'Mekele', 'Gondar', 'Bahir Dar'],
            languages: ['am', 'en']
        }
    },

    // ============================================
    // 6️⃣ PAGE ANALYTICS CONFIGURATION
    // ============================================
    analytics: {
        // Tracking configuration
        tracking: {
            enabled: true,
            providers: ['google-analytics', 'facebook-pixel', 'hotjar'],
            
            events: {
                pageView: true,
                formSubmit: true,
                buttonClick: true,
                loanApplication: true,
                repayment: true,
                subscriptionPurchase: true
            },
            
            userProperties: {
                track: ['country', 'role', 'subscriptionTier', 'groupCount'],
                anonymize: ['ipAddress', 'deviceId']
            }
        },
        
        // Performance monitoring
        performance: {
            enabled: true,
            metrics: ['fcp', 'lcp', 'fid', 'cls'],
            thresholds: {
                good: 2000,
                needsImprovement: 4000,
                poor: 6000
            },
            samplingRate: 10
        },
        
        // Error tracking
        errorTracking: {
            enabled: true,
            captureExceptions: true,
            captureRejections: true,
            samplingRate: 100,
            ignoreErrors: ['ResizeObserver', 'Loading chunk']
        }
    },

    // ============================================
    // 7️⃣ PAGE CACHING CONFIGURATION
    // ============================================
    caching: {
        // Static assets
        static: {
            enabled: true,
            maxAge: 31536000, // 1 year
            immutable: true
        },
        
        // API responses
        api: {
            enabled: true,
            maxAge: 300, // 5 minutes
            staleWhileRevalidate: 600, // 10 minutes
            varyBy: ['user', 'role', 'subscription']
        },
        
        // Page content
        page: {
            enabled: true,
            strategies: {
                home: 'network-first',
                dashboard: 'network-first',
                staticPages: 'cache-first',
                emergencyCategories: 'stale-while-revalidate'
            },
            maxAge: 3600 // 1 hour
        },
        
        // Service worker
        serviceWorker: {
            enabled: true,
            precache: [
                '/',
                '/et/emergency',
                '/et/subscription/plans',
                '/et/terms',
                '/et/privacy'
            ],
            runtimeCache: [
                {
                    urlPattern: '/api/et/.*',
                    handler: 'networkFirst',
                    options: {
                        cacheName: 'api-cache',
                        expiration: {
                            maxEntries: 100,
                            maxAgeSeconds: 300
                        }
                    }
                }
            ]
        }
    },

    // ============================================
    // 8️⃣ PAGE SECURITY CONFIGURATION
    // ============================================
    security: {
        // Headers
        headers: {
            contentSecurityPolicy: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://*.google-analytics.com"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", "https://api.mpesewa.et"],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"]
            },
            
            strictTransportSecurity: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            },
            
            xFrameOptions: 'DENY',
            xContentTypeOptions: 'nosniff',
            referrerPolicy: 'strict-origin-when-cross-origin'
        },
        
        // Input sanitization
        sanitization: {
            enabled: true,
            rules: {
                stripTags: true,
                escapeHtml: true,
                normalize: true,
                trim: true
            },
            
            patterns: {
                block: [
                    '<script',
                    'javascript:',
                    'onclick=',
                    'onload=',
                    'onerror=',
                    'eval(',
                    'document.cookie'
                ]
            }
        },
        
        // Rate limiting
        rateLimiting: {
            enabled: true,
            limits: {
                api: {
                    window: 900000, // 15 minutes
                    max: 100
                },
                auth: {
                    window: 3600000, // 1 hour
                    max: 5
                },
                loanApplication: {
                    window: 86400000, // 24 hours
                    max: 3
                }
            }
        }
    },

    // ============================================
    // 9️⃣ PAGE ERROR HANDLING
    // ============================================
    errorHandling: {
        // Error pages
        errorPages: {
            404: {
                component: 'NotFoundPage',
                title: 'Page Not Found | M-Pesewa Ethiopia',
                message: 'The page you are looking for does not exist in the Ethiopia platform.',
                action: {
                    label: 'Go to Home',
                    path: '/et'
                }
            },
            
            403: {
                component: 'ForbiddenPage',
                title: 'Access Denied | M-Pesewa Ethiopia',
                message: 'You do not have permission to access this page in the Ethiopia platform.',
                action: {
                    label: 'Go to Dashboard',
                    path: '/et/dashboard'
                }
            },
            
            500: {
                component: 'ServerErrorPage',
                title: 'Server Error | M-Pesewa Ethiopia',
                message: 'Something went wrong on our Ethiopia server. Please try again later.',
                action: {
                    label: 'Try Again',
                    path: null
                }
            },
            
            maintenance: {
                component: 'MaintenancePage',
                title: 'Maintenance Mode | M-Pesewa Ethiopia',
                message: 'The Ethiopia platform is currently undergoing maintenance. Please check back soon.',
                estimatedTime: '2 hours',
                contactInfo: '+251 11 000 0000'
            }
        },
        
        // Error logging
        logging: {
            enabled: true,
            level: 'error',
            captureContext: true,
            sanitizeData: true,
            reportTo: ['sentry', 'console', 'backend']
        },
        
        // Recovery strategies
        recovery: {
            retry: {
                maxAttempts: 3,
                backoff: 'exponential',
                initialDelay: 1000
            },
            
            fallback: {
                offline: 'show-cached-content',
                apiFailure: 'show-error-message',
                paymentFailure: 'retry-later'
            }
        }
    },

    // ============================================
    // 🔟 PAGE INTERNATIONALIZATION
    // ============================================
    i18n: {
        // Language configuration
        languages: {
            default: 'en',
            supported: [
                {
                    code: 'en',
                    name: 'English',
                    nativeName: 'English',
                    direction: 'ltr',
                    enabled: true
                },
                {
                    code: 'am',
                    name: 'Amharic',
                    nativeName: 'አማርኛ',
                    direction: 'ltr',
                    enabled: true
                },
                {
                    code: 'om',
                    name: 'Oromo',
                    nativeName: 'Afaan Oromoo',
                    direction: 'ltr',
                    enabled: true
                }
            ],
            
            detection: {
                order: ['localStorage', 'navigator', 'htmlTag'],
                caches: ['localStorage']
            }
        },
        
        // Translation files
        translations: {
            paths: {
                en: '/locales/et/en.json',
                am: '/locales/et/am.json',
                om: '/locales/et/om.json'
            },
            
            namespaces: ['common', 'borrower', 'lender', 'emergency', 'subscription'],
            
            fallbackLng: 'en',
            
            interpolation: {
                escapeValue: false
            }
        },
        
        // RTL support
        rtl: {
            enabled: false,
            languages: [] // No RTL languages for Ethiopia currently
        }
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get page configuration by route
 * @param {string} route - The route to get configuration for
 * @returns {Object} Page configuration
 */
EthiopiaPages.getPageConfig = function(route) {
    // Remove query parameters and hash
    const cleanRoute = route.split('?')[0].split('#')[0];
    
    // Search through all routes
    const searchRoutes = (routes, prefix = '') => {
        for (const [key, config] of Object.entries(routes)) {
            if (config.path && (prefix + config.path) === cleanRoute) {
                return config;
            }
            
            if (typeof config === 'object' && !config.path) {
                const found = searchRoutes(config, prefix);
                if (found) return found;
            }
        }
        return null;
    };
    
    return searchRoutes(this.routes);
};

/**
 * Check if user can access a route
 * @param {string} route - The route to check
 * @param {Object} user - User information
 * @returns {Object} Access check result
 */
EthiopiaPages.canAccess = function(route, user = null) {
    const pageConfig = this.getPageConfig(route);
    
    if (!pageConfig) {
        return {
            allowed: false,
            reason: 'Page not found',
            redirect: '/et/404'
        };
    }
    
    // Check country requirement
    if (pageConfig.countryRequired) {
        const userCountry = user?.country || localStorage.getItem('mpesewa_country');
        if (userCountry !== 'ET') {
            return {
                allowed: false,
                reason: 'Country mismatch',
                redirect: '/countries/select'
            };
        }
    }
    
    // Check authentication
    if (pageConfig.authRequired && !user) {
        return {
            allowed: false,
            reason: 'Authentication required',
            redirect: this.routes.basePath + '/auth/login'
        };
    }
    
    // Check role requirement
    if (pageConfig.roleRequired && user) {
        if (!user.roles?.includes(pageConfig.roleRequired)) {
            return {
                allowed: false,
                reason: 'Insufficient role',
                redirect: this.routes.basePath + '/dashboard'
            };
        }
    }
    
    // Check subscription requirement
    if (pageConfig.subscriptionRequired && user) {
        if (user.subscription?.status !== 'active') {
            return {
                allowed: false,
                reason: 'Subscription required',
                redirect: this.routes.basePath + '/subscription/plans'
            };
        }
    }
    
    return {
        allowed: true,
        reason: 'Access granted'
    };
};

/**
 * Generate breadcrumbs for a route
 * @param {string} route - Current route
 * @returns {Array} Breadcrumb items
 */
EthiopiaPages.generateBreadcrumbs = function(route) {
    const breadcrumbs = [
        {
            label: 'Home',
            path: this.routes.basePath + '/'
        }
    ];
    
    const parts = route.split('/').filter(part => part);
    
    let currentPath = this.routes.basePath;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath += '/' + part;
        
        // Skip base path
        if (part === 'et') continue;
        
        // Get page title for this part
        const pageConfig = this.getPageConfig(currentPath);
        const label = pageConfig?.title?.split('|')[0]?.trim() || 
                     part.charAt(0).toUpperCase() + part.slice(1);
        
        breadcrumbs.push({
            label,
            path: currentPath
        });
    }
    
    return breadcrumbs;
};

/**
 * Get navigation for user role
 * @param {string} role - User role
 * @returns {Array} Navigation items
 */
EthiopiaPages.getNavigation = function(role) {
    switch(role) {
        case 'borrower':
            return this.layout.sidebar.borrower;
        case 'lender':
            return this.layout.sidebar.lender;
        case 'admin':
            return this.layout.sidebar.admin;
        default:
            return [];
    }
};

/**
 * Get emergency category by path
 * @param {string} path - Category path
 * @returns {Object} Category configuration
 */
EthiopiaPages.getEmergencyCategory = function(path) {
    for (const [key, category] of Object.entries(this.routes.emergencyCategories)) {
        if (category.path === path) {
            return category;
        }
    }
    return null;
};

// ============================================
// EXPORT
// ============================================

// Freeze configuration
Object.freeze(EthiopiaPages);

// Export the pages configuration
export default EthiopiaPages;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthiopiaPages;
}