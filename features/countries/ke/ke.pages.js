/**
 * M-PESEWA KENYA PAGES 🇰🇪
 * Kenya-specific page configurations and content
 * Country-isolated UI components and routing
 */

const KenyaPages = {
    // ============================================================================
    // 1️⃣ PAGE CONFIGURATIONS
    // ============================================================================
    pages: {
        // Homepage (Kenya-specific)
        home: {
            path: '/ke',
            title: 'M-Pesewa Kenya | Emergency Micro-Lending in Trusted Circles',
            meta: {
                description: 'Emergency loans within Kenyan trusted circles. Friends lend to friends in Kenya. No banks, no lengthy processes.',
                keywords: 'kenya, emergency loans, mpesa, lending, borrowing, nairobi, mombasa, kisumu',
                ogImage: '/assets/images/kenya/og-image.jpg',
                twitterCard: 'summary_large_image'
            },
            
            // Hero section
            hero: {
                title: 'Pesa yako, wakati wako',
                subtitle: 'Get emergency loans from trusted community members across Kenya',
                background: '/assets/images/kenya/hero-background.jpg',
                cta: {
                    primary: {
                        text: 'Get Started in Kenya',
                        link: '/ke/register',
                        color: '#f37021'
                    },
                    secondary: {
                        text: 'How It Works',
                        link: '/ke/how-it-works',
                        color: '#003366'
                    }
                }
            },
            
            // Stats section
            stats: {
                enabled: true,
                stats: [
                    {
                        value: '50K+',
                        label: 'Kenyans Trust Us',
                        icon: '👥'
                    },
                    {
                        value: '99%',
                        label: 'Repayment Rate',
                        icon: '✅'
                    },
                    {
                        value: 'KES 100M+',
                        label: 'Amount Lent',
                        icon: '💰'
                    },
                    {
                        value: '12',
                        label: 'Counties Covered',
                        icon: '🗺️'
                    }
                ]
            },
            
            // Features section
            features: {
                title: 'Why Choose M-Pesewa in Kenya',
                items: [
                    {
                        icon: '🇰🇪',
                        title: 'Made for Kenya',
                        description: 'Designed specifically for Kenyan communities and regulations'
                    },
                    {
                        icon: '🔒',
                        title: 'Central Bank Licensed',
                        description: 'Fully licensed and regulated by Central Bank of Kenya'
                    },
                    {
                        icon: '📱',
                        title: 'M-Pesa Integrated',
                        description: 'Seamless integration with M-Pesa for instant transfers'
                    },
                    {
                        icon: '🤝',
                        title: 'Community First',
                        description: 'Built on trusted relationships within Kenyan communities'
                    }
                ]
            }
        },
        
        // Registration page
        register: {
            path: '/ke/register',
            title: 'Register | M-Pesewa Kenya',
            steps: [
                {
                    title: 'Choose Your Role',
                    description: 'Select whether you want to lend or borrow',
                    fields: ['role']
                },
                {
                    title: 'Personal Information',
                    description: 'Provide your Kenyan identification details',
                    fields: ['fullName', 'nationalId', 'phone', 'email', 'county', 'ward']
                },
                {
                    title: 'Security Setup',
                    description: 'Create your login credentials',
                    fields: ['username', 'password', 'confirmPassword']
                },
                {
                    title: 'Verification',
                    description: 'Verify your identity',
                    fields: ['idUpload', 'selfie', 'termsAccept']
                }
            ],
            
            // Form configurations
            forms: {
                borrower: {
                    title: 'Borrower Registration',
                    note: 'Borrowers pay no subscription fees',
                    requiredFields: ['fullName', 'nationalId', 'phone', 'county']
                },
                lender: {
                    title: 'Lender Registration',
                    note: 'Lenders require subscription to start lending',
                    requiredFields: ['fullName', 'nationalId', 'phone', 'county', 'subscriptionLevel'],
                    subscriptionOptions: [
                        {
                            value: 'basic',
                            label: 'Basic Lender',
                            price: 'KSh 50/month',
                            limit: 'Up to KSh 1,500/week'
                        },
                        {
                            value: 'premium',
                            label: 'Premium Lender',
                            price: 'KSh 250/month',
                            limit: 'Up to KSh 5,000/week'
                        },
                        {
                            value: 'super',
                            label: 'Super Lender',
                            price: 'KSh 1,000/month',
                            limit: 'Up to KSh 20,000/week'
                        }
                    ]
                }
            },
            
            // County dropdown options
            counties: [
                'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
                'Malindi', 'Kitale', 'Garissa', 'Kakamega', 'Kisii', 'Nyeri'
            ]
        },
        
        // Dashboard pages
        dashboard: {
            borrower: {
                path: '/ke/borrower/dashboard',
                title: 'Borrower Dashboard | M-Pesewa Kenya',
                widgets: [
                    {
                        id: 'activeLoans',
                        title: 'Active Loans',
                        component: 'LoanList',
                        position: 'main'
                    },
                    {
                        id: 'borrowerStats',
                        title: 'Your Stats',
                        component: 'StatsCard',
                        position: 'sidebar',
                        stats: [
                            { label: 'Credit Score', value: '750' },
                            { label: 'Groups', value: '2/4' },
                            { label: 'Total Borrowed', value: 'KSh 15,000' },
                            { label: 'Repayment Rate', value: '100%' }
                        ]
                    },
                    {
                        id: 'quickActions',
                        title: 'Quick Actions',
                        component: 'ActionButtons',
                        position: 'sidebar',
                        actions: [
                            { label: 'Apply for Loan', icon: '📝', link: '/ke/borrower/apply' },
                            { label: 'Make Repayment', icon: '💰', link: '/ke/borrower/repay' },
                            { label: 'View History', icon: '📊', link: '/ke/borrower/history' }
                        ]
                    }
                ]
            },
            
            lender: {
                path: '/ke/lender/dashboard',
                title: 'Lender Dashboard | M-Pesewa Kenya',
                widgets: [
                    {
                        id: 'portfolio',
                        title: 'Your Portfolio',
                        component: 'PortfolioOverview',
                        position: 'main'
                    },
                    {
                        id: 'lenderStats',
                        title: 'Lending Stats',
                        component: 'StatsCard',
                        position: 'sidebar',
                        stats: [
                            { label: 'Active Ledgers', value: '15' },
                            { label: 'Total Lent', value: 'KSh 120,000' },
                            { label: 'Expected Interest', value: 'KSh 12,000' },
                            { label: 'Repayment Rate', value: '98%' }
                        ]
                    },
                    {
                        id: 'subscriptionStatus',
                        title: 'Subscription Status',
                        component: 'SubscriptionCard',
                        position: 'sidebar',
                        status: {
                            level: 'Premium',
                            expires: '2024-02-28',
                            weeklyLimit: 'KSh 5,000',
                            remaining: 'KSh 3,200'
                        }
                    }
                ]
            }
        },
        
        // Emergency categories page
        emergencyCategories: {
            path: '/ke/emergency',
            title: 'Emergency Categories | M-Pesewa Kenya',
            categories: [
                {
                    id: 'fare',
                    title: 'M-pesewa Fare',
                    icon: '🚌',
                    description: 'Move on, don\'t stall—borrow for your journey',
                    typicalAmount: 'KSh 50 - 5,000',
                    example: 'Nairobi CBD to Thika: KSh 200'
                },
                {
                    id: 'data',
                    title: 'M-pesewa Data',
                    icon: '📶',
                    description: 'Stay connected, stay informed—borrow when your bundle runs out',
                    typicalAmount: 'KSh 50 - 2,000',
                    example: 'Safaricom 5GB: KSh 1,000'
                },
                {
                    id: 'cookingGas',
                    title: 'M-pesewa Cooking Gas',
                    icon: '🔥',
                    description: 'Cook with confidence—borrow when your gas is low',
                    typicalAmount: 'KSh 500 - 5,000',
                    example: '6kg Gas Refill: KSh 1,200'
                },
                {
                    id: 'food',
                    title: 'M-pesewa Food',
                    icon: '🍲',
                    description: 'Don\'t sleep hungry when paycheck is delayed—borrow and eat today',
                    typicalAmount: 'KSh 200 - 3,000',
                    example: 'Weekly groceries for family of 4: KSh 2,500'
                }
            ],
            
            // Grouped categories
            groups: [
                {
                    title: 'Everyday Essentials',
                    categories: ['fare', 'data', 'cookingGas', 'food']
                },
                {
                    title: 'Logistics & Repairs',
                    categories: ['fuel', 'repair', 'credo']
                },
                {
                    title: 'Business & Growth',
                    categories: ['dailySales', 'workingCapital', 'sokoLoan', 'kidandaski', 'hawkerLoan', 'fuliziwa']
                },
                {
                    title: 'Health & Education',
                    categories: ['medicine', 'schoolFees', 'advance']
                }
            ]
        },
        
        // Country-specific pages
        countrySpecific: {
            // M-Pesa integration page
            mpesaIntegration: {
                path: '/ke/mpesa',
                title: 'M-Pesa Integration | M-Pesewa Kenya',
                content: {
                    title: 'Seamless M-Pesa Integration',
                    description: 'Send and receive money instantly through M-Pesa',
                    instructions: [
                        {
                            step: 1,
                            title: 'Select M-Pesa',
                            description: 'Choose M-Pesa as your payment method'
                        },
                        {
                            step: 2,
                            title: 'Enter Amount',
                            description: 'Specify the amount in Kenyan Shillings'
                        },
                        {
                            step: 3,
                            title: 'Confirm via USSD',
                            description: 'Enter your M-Pesa PIN to complete the transaction'
                        },
                        {
                            step: 4,
                            title: 'Instant Transfer',
                            description: 'Funds transferred instantly between users'
                        }
                    ],
                    paybillInfo: {
                        businessNumber: '123456',
                        accountNumber: 'Your M-Pesewa ID'
                    }
                }
            },
            
            // CRB check page
            crbCheck: {
                path: '/ke/crb',
                title: 'Credit Reference Bureau Check | M-Pesewa Kenya',
                content: {
                    title: 'Check Your Credit Status',
                    description: 'Verify your credit status with Kenyan credit bureaus',
                    bureaus: [
                        {
                            name: 'CRB Africa',
                            logo: '/assets/images/kenya/crb-africa.png',
                            checkFee: 'KSh 50',
                            clearanceFee: 'KSh 200'
                        },
                        {
                            name: 'Metropol Corporation',
                            logo: '/assets/images/kenya/metropol.png',
                            checkFee: 'KSh 55',
                            clearanceFee: 'KSh 220'
                        }
                    ],
                    process: [
                        'Provide consent for credit check',
                        'Pay the check fee (KSh 50)',
                        'Receive instant credit report',
                        'Clear any blacklist marks if present'
                    ]
                }
            },
            
            // County groups page
            countyGroups: {
                path: '/ke/county-groups',
                title: 'County Groups | M-Pesewa Kenya',
                counties: [
                    {
                        name: 'Nairobi',
                        groups: [
                            { name: 'Nairobi CBD Business Network', members: 450, rating: 4.8 },
                            { name: 'Eastlands Community Circle', members: 320, rating: 4.6 },
                            { name: 'Westlands Professionals', members: 210, rating: 4.9 }
                        ]
                    },
                    {
                        name: 'Mombasa',
                        groups: [
                            { name: 'Mombasa Traders Association', members: 180, rating: 4.7 },
                            { name: 'Coastal Fishermen Group', members: 95, rating: 4.8 }
                        ]
                    },
                    {
                        name: 'Kisumu',
                        groups: [
                            { name: 'Kisumu Market Traders', members: 120, rating: 4.5 },
                            { name: 'Lake Region SACCO', members: 300, rating: 4.7 }
                        ]
                    }
                ]
            }
        }
    },
    
    // ============================================================================
    // 2️⃣ COMPONENT CONFIGURATIONS
    // ============================================================================
    components: {
        // Header component
        header: {
            logo: {
                src: '/assets/images/kenya/logo.svg',
                alt: 'M-Pesewa Kenya',
                width: 120,
                height: 40
            },
            navigation: [
                {
                    label: 'Home',
                    path: '/ke',
                    icon: '🏠'
                },
                {
                    label: 'Borrow',
                    path: '/ke/borrow',
                    dropdown: [
                        { label: 'Apply for Loan', path: '/ke/borrower/apply' },
                        { label: 'Loan Calculator', path: '/ke/calculator' },
                        { label: 'Emergency Categories', path: '/ke/emergency' }
                    ]
                },
                {
                    label: 'Lend',
                    path: '/ke/lend',
                    dropdown: [
                        { label: 'Lender Dashboard', path: '/ke/lender/dashboard' },
                        { label: 'Subscription Plans', path: '/ke/subscriptions' },
                        { label: 'Lending Rules', path: '/ke/lender/rules' }
                    ]
                },
                {
                    label: 'Groups',
                    path: '/ke/groups',
                    dropdown: [
                        { label: 'Find Groups', path: '/ke/groups/find' },
                        { label: 'Create Group', path: '/ke/groups/create' },
                        { label: 'My Groups', path: '/ke/groups/my' }
                    ]
                },
                {
                    label: 'About',
                    path: '/ke/about',
                    dropdown: [
                        { label: 'How It Works', path: '/ke/how-it-works' },
                        { label: 'Contact Us', path: '/ke/contact' },
                        { label: 'Legal', path: '/ke/legal' }
                    ]
                }
            ],
            countrySelector: {
                enabled: false, // Disabled because country is locked
                currentCountry: {
                    code: 'KE',
                    name: 'Kenya',
                    flag: '🇰🇪'
                },
                note: 'Country selection is locked after registration'
            }
        },
        
        // Footer component
        footer: {
            columns: [
                {
                    title: 'Borrowing in Kenya',
                    links: [
                        { label: 'Emergency Loans', path: '/ke/emergency' },
                        { label: 'Business Loans', path: '/ke/business-loans' },
                        { label: 'How to Apply', path: '/ke/how-to-apply' },
                        { label: 'Loan Calculator', path: '/ke/calculator' }
                    ]
                },
                {
                    title: 'Lending in Kenya',
                    links: [
                        { label: 'Become a Lender', path: '/ke/become-lender' },
                        { label: 'Subscription Plans', path: '/ke/subscriptions' },
                        { label: 'Lending Rules', path: '/ke/lender/rules' },
                        { label: 'Risk Management', path: '/ke/lender/risk' }
                    ]
                },
                {
                    title: 'Kenya Support',
                    links: [
                        { label: 'Contact Us', path: '/ke/contact' },
                        { label: 'FAQ', path: '/ke/faq' },
                        { label: 'M-Pesa Help', path: '/ke/mpesa-help' },
                        { label: 'CRB Assistance', path: '/ke/crb-help' }
                    ]
                },
                {
                    title: 'Legal Kenya',
                    links: [
                        { label: 'Terms (Kenya)', path: '/ke/terms' },
                        { label: 'Privacy (Kenya)', path: '/ke/privacy' },
                        { label: 'CBK License', path: '/ke/license' },
                        { label: 'Compliance', path: '/ke/compliance' }
                    ]
                }
            ],
            contactInfo: {
                phone: '+254 709 219 000',
                email: 'kenya@mpesewa.com',
                whatsapp: '+254 709 219 000',
                address: 'M-Pesewa House, Upper Hill, Nairobi'
            },
            socialMedia: {
                facebook: 'https://facebook.com/mpesewakenya',
                twitter: 'https://twitter.com/mpesewa_ke',
                instagram: 'https://instagram.com/mpesewa.kenya',
                linkedin: 'https://linkedin.com/company/mpesewa-kenya'
            }
        },
        
        // Calculator component
        calculator: {
            currency: 'KES',
            minAmount: 50,
            maxAmount: 50000,
            defaultAmount: 1000,
            interestRate: 0.10,
            penaltyRate: 0.05,
            defaultPeriod: 7,
            
            // Preset amounts for Kenya
            presets: [500, 1000, 1500, 2500, 5000, 10000, 20000, 50000],
            
            // Category-based defaults
            categoryDefaults: {
                fare: 250,
                data: 1000,
                cookingGas: 1200,
                food: 800,
                fuel: 2000,
                medicine: 3000,
                schoolFees: 20000
            }
        },
        
        // Payment component
        payment: {
            methods: [
                {
                    id: 'mpesa',
                    name: 'M-Pesa',
                    icon: '/assets/images/kenya/mpesa-icon.svg',
                    enabled: true,
                    fields: [
                        { name: 'phone', label: 'M-Pesa Number', type: 'tel', required: true }
                    ]
                },
                {
                    id: 'airtel',
                    name: 'Airtel Money',
                    icon: '/assets/images/kenya/airtel-icon.svg',
                    enabled: true,
                    fields: [
                        { name: 'phone', label: 'Airtel Number', type: 'tel', required: true }
                    ]
                },
                {
                    id: 'bank',
                    name: 'Bank Transfer',
                    icon: '/assets/images/kenya/bank-icon.svg',
                    enabled: true,
                    fields: [
                        { name: 'bank', label: 'Bank Name', type: 'select', required: true },
                        { name: 'account', label: 'Account Number', type: 'text', required: true }
                    ]
                }
            ],
            
            // Kenyan banks
            banks: [
                'Equity Bank',
                'KCB Bank',
                'Co-operative Bank',
                'NCBA Bank',
                'Absa Bank Kenya',
                'Standard Chartered',
                'Stanbic Bank',
                'I&M Bank'
            ]
        }
    },
    
    // ============================================================================
    // 3️⃣ CONTENT STRINGS (SWAHILI/ENGLISH)
    // ============================================================================
    content: {
        // Swahili translations
        swahili: {
            // Common phrases
            common: {
                welcome: 'Karibu M-Pesewa Kenya',
                getStarted: 'Anza Sasa',
                learnMore: 'Jifunze Zaidi',
                contactUs: 'Wasiliana Nasi',
                login: 'Ingia',
                register: 'Jisajili'
            },
            
            // Hero section
            hero: {
                title: 'Pesa ya dharura, katika mazingira ya uaminifu',
                subtitle: 'Pata mikopo ya dharura kutoka kwa jamii ya kuaminika nchini Kenya'
            },
            
            // Features
            features: {
                title: 'Kwa nini kuchagua M-Pesewa Kenya',
                trust: 'Kuaminika Katika Jamii',
                speed: 'Uhamisho wa Pesa Haraka',
                security: 'Usalama wa Juu',
                support: 'Usaidizi wa Karibu'
            },
            
            // Categories
            categories: {
                fare: 'M-pesewa Nauli',
                data: 'M-pesewa Data',
                cookingGas: 'M-pesewa Gesi',
                food: 'M-pesewa Chakula'
            }
        },
        
        // English content
        english: {
            // Trust indicators
            trustIndicators: [
                'Licensed by Central Bank of Kenya',
                'Data Protection Act Compliant',
                'M-Pesa Integrated',
                'Community-Based Lending'
            ],
            
            // Testimonials
            testimonials: [
                {
                    quote: 'Got a 1200 loan for gas when it ended while cooking. Repaid after 7 days with 10% interest. Simple and fair.',
                    author: 'Mama Jimmy, Nairobi',
                    location: 'Kawangware, Nairobi'
                },
                {
                    quote: 'Borrowed 250 for transport to a job interview. Got the job and repaid on time. This platform understands real emergencies.',
                    author: 'John Kimani, Nairobi',
                    location: 'Eastleigh, Nairobi'
                },
                {
                    quote: 'My boda boda ran out of fuel while carrying a customer. Borrowed 500, completed the trip, repaid after 7 days.',
                    author: 'Ibrahim, Mombasa',
                    location: 'Mombasa Island'
                }
            ],
            
            // FAQ
            faq: [
                {
                    question: 'Is M-Pesewa licensed in Kenya?',
                    answer: 'Yes, we are fully licensed and regulated by the Central Bank of Kenya as a Digital Credit Provider.'
                },
                {
                    question: 'How does M-Pesa integration work?',
                    answer: 'We integrate directly with M-Pesa for instant money transfers between users. You can send and receive money within seconds.'
                },
                {
                    question: 'What happens if I default on a loan?',
                    answer: 'After 60 days of non-payment, you are blacklisted on the platform and reported to credit bureaus if the amount exceeds KSh 1,000.'
                },
                {
                    question: 'Can I lend and borrow at the same time?',
                    answer: 'Yes, you can have both lender and borrower profiles, but they are separate roles with different requirements.'
                }
            ]
        }
    },
    
    // ============================================================================
    // 4️⃣ ROUTING CONFIGURATION
    // ============================================================================
    routing: {
        // Base path for Kenya
        basePath: '/ke',
        
        // Route guards (country isolation)
        guards: {
            countryLock: {
                enabled: true,
                redirect: '/countries',
                message: 'You must be registered in Kenya to access this page'
            },
            
            // Role-based access
            roleAccess: {
                borrower: ['/ke/borrower/*', '/ke/emergency', '/ke/calculator'],
                lender: ['/ke/lender/*', '/ke/subscriptions', '/ke/lending/*'],
                admin: ['/ke/admin/*']
            }
        },
        
        // Dynamic routes
        dynamicRoutes: [
            {
                pattern: '/ke/groups/:groupId',
                component: 'GroupDetail',
                access: 'group_member'
            },
            {
                pattern: '/ke/loans/:loanId',
                component: 'LoanDetail',
                access: 'loan_party'
            },
            {
                pattern: '/ke/users/:userId',
                component: 'UserProfile',
                access: 'public'
            }
        ],
        
        // Redirects
        redirects: [
            { from: '/ke/home', to: '/ke' },
            { from: '/ke/index.html', to: '/ke' },
            { from: '/ke/register/lender', to: '/ke/register?role=lender' },
            { from: '/ke/register/borrower', to: '/ke/register?role=borrower' }
        ]
    },
    
    // ============================================================================
    // 5️⃣ SEO CONFIGURATION
    // ============================================================================
    seo: {
        // Default meta tags
        defaultMeta: {
            title: 'M-Pesewa Kenya | Emergency Loans in Trusted Circles',
            description: 'Get emergency loans from trusted community members in Kenya. M-Pesa integrated, Central Bank licensed, community-based lending.',
            keywords: 'kenya loans, emergency loans kenya, mpesa loans, digital lending kenya, peer to peer lending kenya',
            author: 'M-Pesewa Kenya',
            robots: 'index, follow'
        },
        
        // Open Graph
        openGraph: {
            type: 'website',
            siteName: 'M-Pesewa Kenya',
            locale: 'en_KE',
            image: {
                url: '/assets/images/kenya/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'M-Pesewa Kenya - Emergency Loans in Trusted Circles'
            }
        },
        
        // Twitter Card
        twitterCard: {
            card: 'summary_large_image',
            site: '@mpesewa_ke',
            creator: '@mpesewa_ke',
            image: '/assets/images/kenya/twitter-card.jpg'
        },
        
        // Structured data
        structuredData: {
            organization: {
                '@type': 'Organization',
                name: 'M-Pesewa Kenya',
                url: 'https://mpesewa.co.ke',
                logo: 'https://mpesewa.co.ke/assets/images/kenya/logo.png',
                sameAs: [
                    'https://facebook.com/mpesewakenya',
                    'https://twitter.com/mpesewa_ke',
                    'https://instagram.com/mpesewa.kenya'
                ]
            },
            financialService: {
                '@type': 'FinancialService',
                name: 'M-Pesewa Kenya',
                description: 'Emergency micro-lending platform for Kenya',
                url: 'https://mpesewa.co.ke',
                feesAndCommissionsSpecification: 'Lender subscriptions only, borrowers pay no fees',
                areaServed: {
                    '@type': 'Country',
                    name: 'Kenya'
                }
            }
        },
        
        // Sitemap
        sitemap: {
            enabled: true,
            baseUrl: 'https://mpesewa.co.ke',
            pages: [
                '/ke',
                '/ke/about',
                '/ke/how-it-works',
                '/ke/emergency',
                '/ke/register',
                '/ke/login',
                '/ke/contact',
                '/ke/legal',
                '/ke/privacy',
                '/ke/terms'
            ],
            frequency: 'weekly',
            priority: 0.8
        }
    },
    
    // ============================================================================
    // 6️⃣ ANALYTICS & TRACKING
    // ============================================================================
    analytics: {
        // Google Analytics (Kenya-specific)
        googleAnalytics: {
            trackingId: 'UA-XXXXX-Y-KE',
            config: {
                cookieDomain: 'mpesewa.co.ke',
                cookieFlags: 'SameSite=None; Secure'
            },
            events: {
                registration: 'ke_registration_complete',
                loanApplication: 'ke_loan_application',
                loanRepayment: 'ke_loan_repayment',
                subscriptionPurchase: 'ke_subscription_purchase'
            }
        },
        
        // Facebook Pixel (Kenya)
        facebookPixel: {
            pixelId: 'XXXXXXXXXXXXXXX',
            events: [
                'PageView',
                'ViewContent',
                'AddToCart',
                'Purchase'
            ]
        },
        
        // Custom analytics
        customAnalytics: {
            endpoints: {
                pageView: '/ke/api/analytics/pageview',
                event: '/ke/api/analytics/event',
                error: '/ke/api/analytics/error'
            },
            userProperties: [
                'county',
                'role',
                'subscriptionLevel',
                'groupCount'
            ]
        }
    },
    
    // ============================================================================
    // 7️⃣ ERROR PAGES
    // ============================================================================
    errorPages: {
        404: {
            title: 'Page Not Found | M-Pesewa Kenya',
            message: 'Hakika, ukurasa huu haupo',
            subMessage: 'The page you\'re looking for doesn\'t exist in M-Pesewa Kenya',
            action: {
                text: 'Return to Kenya Homepage',
                link: '/ke'
            }
        },
        
        403: {
            title: 'Access Denied | M-Pesewa Kenya',
            message: 'Huruwezi kufikia ukurasa huu',
            subMessage: 'You don\'t have permission to access this page in Kenya',
            action: {
                text: 'Go to Kenya Dashboard',
                link: '/ke/dashboard'
            }
        },
        
        500: {
            title: 'Server Error | M-Pesewa Kenya',
            message: 'Kuna tatizo kwenye mfumo',
            subMessage: 'We\'re experiencing technical difficulties in Kenya. Please try again later.',
            action: {
                text: 'Contact Kenya Support',
                link: '/ke/contact'
            }
        },
        
        // Country restriction error
        countryRestriction: {
            title: 'Country Restriction | M-Pesewa',
            message: 'Huduma hii inapatikana Kenya pekee',
            subMessage: 'This service is only available in Kenya. Please switch to Kenya or register for Kenya services.',
            action: {
                text: 'Switch to Kenya',
                link: '/countries/kenya'
            }
        }
    },
    
    // ============================================================================
    // 8️⃣ METADATA
    // ============================================================================
    metadata: {
        version: '2.0.0',
        lastUpdated: '2024-01-24',
        environment: 'production',
        country: 'Kenya',
        language: 'en',
        timezone: 'Africa/Nairobi',
        
        // Team information
        team: {
            productManager: 'Kenya Product Team',
            developer: 'Kenya Development Team',
            designer: 'Kenya Design Team',
            qa: 'Kenya QA Team'
        },
        
        // Dependencies
        dependencies: {
            framework: 'React 18',
            styling: 'Tailwind CSS',
            stateManagement: 'Redux Toolkit',
            routing: 'React Router 6'
        },
        
        // Performance targets
        performance: {
            pageLoad: '3 seconds',
            timeToInteractive: '5 seconds',
            firstContentfulPaint: '2 seconds',
            largestContentfulPaint: '4 seconds'
        }
    }
};

// Export the pages configuration
export default KenyaPages;

// Export individual sections
export const pageConfigs = KenyaPages.pages;
export const componentConfigs = KenyaPages.components;
export const contentConfigs = KenyaPages.content;
export const routingConfigs = KenyaPages.routing;
export const seoConfigs = KenyaPages.seo;

// Export helper functions
export function getPageConfig(pageId) {
    return KenyaPages.pages[pageId] || null;
}

export function getComponentConfig(componentId) {
    return KenyaPages.components[componentId] || null;
}

export function generatePageTitle(pageId, customTitle = '') {
    const pageConfig = getPageConfig(pageId);
    if (customTitle) {
        return `${customTitle} | M-Pesewa Kenya`;
    }
    return pageConfig?.title || 'M-Pesewa Kenya';
}

export function generateMetaDescription(pageId, customDescription = '') {
    if (customDescription) return customDescription;
    
    const pageConfig = getPageConfig(pageId);
    return pageConfig?.meta?.description || KenyaPages.seo.defaultMeta.description;
}

export function validateCountryAccess(userCountry, requestedCountry = 'KE') {
    if (userCountry !== requestedCountry) {
        return {
            allowed: false,
            redirect: `/countries/${requestedCountry.toLowerCase()}`,
            message: `This page is only accessible to users registered in ${requestedCountry}`
        };
    }
    return { allowed: true };
}

export function getLocalizedContent(key, language = 'english') {
    const keys = key.split('.');
    let content = KenyaPages.content[language];
    
    for (const k of keys) {
        if (content && content[k]) {
            content = content[k];
        } else {
            return null;
        }
    }
    
    return content;
}

// Export for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KenyaPages;
    module.exports.pageConfigs = pageConfigs;
    module.exports.componentConfigs = componentConfigs;
    module.exports.contentConfigs = contentConfigs;
    module.exports.routingConfigs = routingConfigs;
    module.exports.seoConfigs = seoConfigs;
    module.exports.getPageConfig = getPageConfig;
    module.exports.getComponentConfig = getComponentConfig;
    module.exports.generatePageTitle = generatePageTitle;
    module.exports.generateMetaDescription = generateMetaDescription;
    module.exports.validateCountryAccess = validateCountryAccess;
    module.exports.getLocalizedContent = getLocalizedContent;
}