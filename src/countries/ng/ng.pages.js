/**
 * M-PESEWA - NIGERIA PAGES MODULE
 * Country-specific page configurations and routing
 * Strict Hierarchy: Nigeria → Groups → Lenders/Borrowers
 * Last Updated: 2026-01-24
 */

const NigeriaPages = {
    // ====================================================================
    // 1️⃣ COUNTRY LANDING PAGE CONFIGURATION
    // ====================================================================
    landingPage: {
        path: "/countries/nigeria",
        title: "M-Pesewa Nigeria | Emergency Micro-lending Platform",
        metaDescription: "Nigeria's trusted peer-to-peer emergency lending platform. Connect with trusted groups in Lagos, Abuja, Kano, and across Nigeria.",
        
        hero: {
            title: "Emergency Loans in Nigeria, From People You Trust",
            subtitle: "Join thousands of Nigerians who use M-Pesewa for responsible emergency lending within their trusted circles.",
            ctaButtons: [
                {
                    text: "Borrow Now",
                    link: "/ng/borrower/apply",
                    color: "#f37021",
                    icon: "💼"
                },
                {
                    text: "Start Lending",
                    link: "/ng/lender/register",
                    color: "#28a745",
                    icon: "🌱"
                }
            ],
            features: [
                "🇳🇬 Nigerian Naira (NGN) Only",
                "🔒 BVN & NIN Verified Users",
                "🤝 Trusted Group Lending",
                "⚡ 7-Day Emergency Loans"
            ]
        },
        
        stats: [
            {
                value: "₦250M+",
                label: "Total Loans Disbursed",
                description: "Across Nigeria"
            },
            {
                value: "50,000+",
                label: "Active Users",
                description: "Verified Nigerians"
            },
            {
                value: "98%",
                label: "Repayment Rate",
                description: "Trust-based success"
            },
            {
                value: "36 States",
                label: "National Coverage",
                description: "Including FCT"
            }
        ]
    },

    // ====================================================================
    // 2️⃣ STATE-SPECIFIC PAGES (STRICT GEOGRAPHIC ISOLATION)
    // ====================================================================
    statePages: {
        lagos: {
            path: "/ng/states/lagos",
            title: "M-Pesewa Lagos | Emergency Loans in Lagos",
            cities: ["Ikeja", "Victoria Island", "Lekki", "Surulere", "Apapa", "Mushin", "Agege"],
            popularCategories: [
                { name: "Transportation", icon: "🚌", amount: "₦1,000 - ₦5,000" },
                { name: "Market Capital", icon: "🛒", amount: "₦5,000 - ₦20,000" },
                { name: "Rent Advance", icon: "🏠", amount: "₦10,000 - ₦50,000" },
                { name: "School Fees", icon: "🎓", amount: "₦5,000 - ₦30,000" }
            ],
            contact: {
                phone: "+234 800 000 0001",
                address: "Lagos Office: 123 Adeola Odeku Street, Victoria Island, Lagos",
                hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM"
            }
        },
        
        abuja: {
            path: "/ng/states/abuja",
            title: "M-Pesewa Abuja | Emergency Loans in Federal Capital Territory",
            areas: ["Garki", "Wuse", "Maitama", "Asokoro", "Gwagwalada", "Kubwa"],
            popularCategories: [
                { name: "Official Needs", icon: "💼", amount: "₦2,000 - ₦10,000" },
                { name: "Transportation", icon: "🚗", amount: "₦1,500 - ₦7,000" },
                { name: "Rent", icon: "🏢", amount: "₦15,000 - ₦100,000" },
                { name: "Utilities", icon: "⚡", amount: "₦3,000 - ₦15,000" }
            ],
            contact: {
                phone: "+234 800 000 0002",
                address: "Abuja Office: Plot 123, Central Business District, Abuja",
                hours: "Mon-Fri: 8AM-6PM"
            }
        },
        
        kano: {
            path: "/ng/states/kano",
            title: "M-Pesewa Kano | Emergency Loans in Kano State",
            areas: ["Kano Municipal", "Nasarawa", "Fagge", "Dala", "Gwale"],
            popularCategories: [
                { name: "Market Trading", icon: "📈", amount: "₦2,000 - ₦15,000" },
                { name: "Agricultural Inputs", icon: "🌾", amount: "₦3,000 - ₦20,000" },
                { name: "Transportation", icon: "🛵", amount: "₦500 - ₦3,000" },
                { name: "Family Needs", icon: "👨‍👩‍👧‍👦", amount: "₦1,000 - ₦10,000" }
            ],
            contact: {
                phone: "+234 800 000 0003",
                address: "Kano Office: 123 Murtala Mohammed Way, Kano",
                hours: "Mon-Sat: 8AM-6PM"
            }
        },
        
        rivers: {
            path: "/ng/states/rivers",
            title: "M-Pesewa Rivers | Emergency Loans in Port Harcourt",
            areas: ["Port Harcourt", "Obio-Akpor", "Eleme", "Okrika"],
            popularCategories: [
                { name: "Transportation", icon: "⛽", amount: "₦1,500 - ₦8,000" },
                { name: "Business Capital", icon: "💼", amount: "₦5,000 - ₦25,000" },
                { name: "Rent", icon: "🏠", amount: "₦10,000 - ₦60,000" },
                { name: "Utilities", icon: "💡", amount: "₦2,500 - ₦12,000" }
            ],
            contact: {
                phone: "+234 800 000 0004",
                address: "Port Harcourt Office: 123 Aba Road, Port Harcourt",
                hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM"
            }
        }
    },

    // ====================================================================
    // 3️⃣ GROUP MANAGEMENT PAGES
    // ====================================================================
    groupPages: {
        // Group Creation Page
        createGroup: {
            path: "/ng/groups/create",
            title: "Create Trusted Group - M-Pesewa Nigeria",
            requirements: [
                "Minimum 5 members to start",
                "All members must be Nigerian residents",
                "Group admin must have BVN verification",
                "Clear group purpose required",
                "Invitation-only membership"
            ],
            categories: [
                "Family Group",
                "Professional Association",
                "Church/Mosque Group",
                "Community Development",
                "Business Network",
                "Alumni Association",
                "Social Club",
                "Cooperative Society"
            ],
            rules: {
                maxMembers: 1000,
                maxGroupsPerUser: 4,
                countryLocked: true,
                internalRulesAllowed: true,
                adminPrivileges: "Single founder/admin"
            }
        },
        
        // Group Dashboard
        groupDashboard: {
            path: "/ng/groups/:id/dashboard",
            sections: [
                {
                    name: "Group Overview",
                    metrics: ["Total Members", "Active Lenders", "Active Borrowers", "Total Amount Lent"]
                },
                {
                    name: "Recent Activity",
                    metrics: ["New Loans", "Repayments", "New Members", "Disputes"]
                },
                {
                    name: "Financial Health",
                    metrics: ["Repayment Rate", "Default Rate", "Average Loan Size", "Total Interest Earned"]
                }
            ],
            adminTools: [
                "Member Management",
                "Invitation System",
                "Rule Setting",
                "Dispute Resolution",
                "Activity Reports"
            ]
        },
        
        // Group Directory (Nigerian Groups)
        groupDirectory: {
            path: "/ng/groups/directory",
            filters: {
                state: ["All", "Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Kaduna", "Edo", "Delta", "Ogun"],
                category: ["All", "Family", "Professional", "Religious", "Community", "Business", "Alumni", "Social"],
                size: ["Small (5-50)", "Medium (51-200)", "Large (201-1000)"],
                activity: ["High", "Medium", "Low"]
            },
            sortOptions: [
                "Newest First",
                "Most Active",
                "Largest Size",
                "Highest Repayment Rate"
            ]
        }
    },

    // ====================================================================
    // 4️⃣ LENDER PAGES (NIGERIA SPECIFIC)
    // ====================================================================
    lenderPages: {
        // Lender Registration
        registration: {
            path: "/ng/lender/register",
            title: "Become a Lender - M-Pesewa Nigeria",
            requirements: [
                "Nigerian resident with valid BVN",
                "Minimum age: 18 years",
                "Bank account in Nigerian bank",
                "Valid government ID",
                "Clean credit history (for Super tier)"
            ],
            subscriptionTiers: {
                basic: {
                    name: "Basic Lender",
                    weeklyLimit: "₦1,500",
                    monthlyFee: "₦50",
                    features: ["Up to 5 active loans", "Basic reporting", "Email support"]
                },
                premium: {
                    name: "Premium Lender",
                    weeklyLimit: "₦5,000",
                    monthlyFee: "₦250",
                    features: ["Up to 20 active loans", "Advanced analytics", "Priority support"]
                },
                super: {
                    name: "Super Lender",
                    weeklyLimit: "₦20,000",
                    monthlyFee: "₦1,000",
                    features: ["Unlimited loans", "CRB integration", "Dedicated account manager"]
                }
            },
            documentsRequired: [
                "Bank Verification Number (BVN)",
                "National Identity Number (NIN)",
                "Valid ID Card (International Passport/Driver's License/Voter's Card)",
                "Proof of Address (Utility bill)",
                "Passport Photograph"
            ]
        },
        
        // Lender Dashboard
        dashboard: {
            path: "/ng/lender/dashboard",
            widgets: [
                {
                    id: "portfolio",
                    title: "Lending Portfolio",
                    metrics: ["Total Lent", "Active Loans", "Cleared Loans", "Expected Interest"]
                },
                {
                    id: "performance",
                    title: "Performance Metrics",
                    metrics: ["Repayment Rate", "Default Rate", "Average Interest Earned", "Risk Score"]
                },
                {
                    id: "subscription",
                    title: "Subscription Status",
                    metrics: ["Current Tier", "Expiry Date", "Lending Limit", "Days Remaining"]
                },
                {
                    id: "ledgers",
                    title: "Ledger Management",
                    metrics: ["Total Ledgers", "Active Ledgers", "Requiring Updates", "Overdue"]
                }
            ],
            quickActions: [
                "Fund New Loan",
                "Update Ledger",
                "Review Requests",
                "Generate Report",
                "Contact Support"
            ]
        },
        
        // Loan Request Management
        loanRequests: {
            path: "/ng/lender/requests",
            filters: {
                amount: ["₦0-₦1,000", "₦1,001-₦5,000", "₦5,001-₦15,000", "₦15,001+"],
                category: ["All", "Transport", "Business", "Education", "Medical", "Rent", "Utilities"],
                repaymentPeriod: ["7 days", "14 days", "30 days"],
                borrowerRating: ["5 stars", "4+ stars", "3+ stars", "Any"]
            },
            approvalProcess: [
                "Review borrower profile and rating",
                "Check guarantor information",
                "Verify within group membership",
                "Set loan terms (amount, interest, duration)",
                "Generate ledger automatically",
                "Disburse funds (off-platform)",
                "Monitor repayment"
            ]
        },
        
        // Ledger Management System
        ledgers: {
            path: "/ng/lender/ledgers",
            ledgerFields: [
                "Borrower Name & Contact",
                "Guarantor 1 & Contact",
                "Guarantor 2 & Contact",
                "Loan Category",
                "Amount Borrowed (₦)",
                "Date Borrowed",
                "Due Date",
                "Interest (10%)",
                "Penalty (if any)",
                "Amount Overdue",
                "Status (Active/Cleared)",
                "Borrower Rating (1-5 stars)"
            ],
            actions: [
                "Add Repayment",
                "Update Status",
                "Calculate Interest",
                "Apply Penalty",
                "Mark as Cleared",
                "Generate Statement",
                "Export to Excel"
            ]
        }
    },

    // ====================================================================
    // 5️⃣ BORROWER PAGES (NIGERIA SPECIFIC)
    // ====================================================================
    borrowerPages: {
        // Borrower Registration
        registration: {
            path: "/ng/borrower/register",
            title: "Become a Borrower - M-Pesewa Nigeria",
            features: [
                "No subscription fees",
                "Access to emergency loans",
                "Build credit reputation",
                "Join up to 4 trusted groups"
            ],
            requirements: [
                "Nigerian resident with valid NIN",
                "Minimum age: 18 years",
                "Phone number verification",
                "Two guarantors from same group"
            ],
            documentsRequired: [
                "National Identity Number (NIN)",
                "Valid ID Card",
                "Proof of Address",
                "Passport Photograph",
                "Guarantor 1 Details",
                "Guarantor 2 Details"
            ]
        },
        
        // Borrower Dashboard
        dashboard: {
            path: "/ng/borrower/dashboard",
            widgets: [
                {
                    id: "activeLoans",
                    title: "Active Loans",
                    metrics: ["Total Borrowed", "Amount Due", "Next Due Date", "Days Remaining"]
                },
                {
                    id: "creditProfile",
                    title: "Credit Profile",
                    metrics: ["Credit Rating", "Groups Joined", "Repayment History", "Blacklist Status"]
                },
                {
                    id: "limits",
                    title: "Borrowing Limits",
                    metrics: ["Available Limit", "Maximum per Loan", "Groups Available", "Upgrade Options"]
                },
                {
                    id: "history",
                    title: "Loan History",
                    metrics: ["Total Loans", "Cleared Loans", "Defaulted Loans", "Average Loan Size"]
                }
            ],
            quickActions: [
                "Apply for Loan",
                "Make Repayment",
                "View Ledger",
                "Check Groups",
                "Update Profile"
            ]
        },
        
        // Loan Application
        loanApplication: {
            path: "/ng/borrower/apply",
            categories: [
                {
                    id: "transport",
                    name: "Transportation",
                    subcategories: ["Okada Fare", "Keke Fare", "Bus Fare", "Fuel Money", "Vehicle Repair"],
                    maxAmount: 5000,
                    typicalTerm: "7 days"
                },
                {
                    id: "business",
                    name: "Business Capital",
                    subcategories: ["Market Capital", "Stock Purchase", "Working Capital", "Equipment Purchase"],
                    maxAmount: 20000,
                    typicalTerm: "7-14 days"
                },
                {
                    id: "education",
                    name: "Education",
                    subcategories: ["School Fees", "Exam Fees", "Books & Materials", "Project Work"],
                    maxAmount: 10000,
                    typicalTerm: "7-30 days"
                },
                {
                    id: "medical",
                    name: "Medical Emergency",
                    subcategories: ["Hospital Bill", "Medication", "Lab Tests", "Doctor Consultation"],
                    maxAmount: 15000,
                    typicalTerm: "7-14 days"
                },
                {
                    id: "household",
                    name: "Household Needs",
                    subcategories: ["Rent", "Utilities", "Food", "Repairs", "Family Emergency"],
                    maxAmount: 25000,
                    typicalTerm: "7-30 days"
                }
            ],
            applicationProcess: [
                "Select trusted group",
                "Choose loan category",
                "Enter amount (₦50 - ₦20,000)",
                "Select repayment period (7 days default)",
                "Provide guarantor details",
                "Submit for group lenders' review",
                "Receive offers from multiple lenders",
                "Accept preferred offer",
                "Receive funds (off-platform)",
                "Begin repayment"
            ]
        },
        
        // Repayment Management
        repayments: {
            path: "/ng/borrower/repayments",
            methods: [
                {
                    name: "Bank Transfer",
                    instructions: "Transfer to lender's account directly",
                    processingTime: "Instant"
                },
                {
                    name: "USSD Code",
                    instructions: "*966*Amount*AccountNumber#",
                    processingTime: "Instant"
                },
                {
                    name: "Mobile Banking",
                    instructions: "Use your bank's mobile app",
                    processingTime: "Instant"
                },
                {
                    name: "Agent Network",
                    instructions: "Visit any M-Pesewa agent",
                    processingTime: "Same day"
                }
            ],
            partialRepayment: {
                allowed: true,
                minimumPartial: "₦100",
                frequency: "Daily",
                interestCalculation: "Pro-rated daily"
            }
        }
    },

    // ====================================================================
    // 6️⃣ EMERGENCY CATEGORY PAGES (NIGERIA FOCUSED)
    // ====================================================================
    emergencyPages: {
        // Transportation Category
        transportation: {
            path: "/ng/emergency/transport",
            title: "Transportation Loans - M-Pesewa Nigeria",
            scenarios: [
                {
                    title: "Okada/Keke Fare",
                    description: "Stranded without transport money? Get quick loans for bike or tricycle fares.",
                    amountRange: "₦200 - ₦2,000",
                    typicalUse: "Daily commuting to work or market",
                    repayment: "Within 7 days"
                },
                {
                    title: "Fuel Money",
                    description: "Ran out of fuel while on the road? Emergency fuel loans available.",
                    amountRange: "₦500 - ₦5,000",
                    typicalUse: "Vehicle fuel for business or personal use",
                    repayment: "Within 7 days"
                },
                {
                    title: "Vehicle Repair",
                    description: "Breakdown on the road? Get emergency repair funds.",
                    amountRange: "₦1,000 - ₦10,000",
                    typicalUse: "Minor vehicle repairs",
                    repayment: "7-14 days"
                }
            ]
        },
        
        // Business Category
        business: {
            path: "/ng/emergency/business",
            title: "Business Capital Loans - M-Pesewa Nigeria",
            scenarios: [
                {
                    title: "Market Capital",
                    description: "Need capital to restock your market business? Quick loans available.",
                    amountRange: "₦1,000 - ₦20,000",
                    typicalUse: "Restocking goods for resale",
                    repayment: "7-14 days"
                },
                {
                    title: "Working Capital",
                    description: "Temporary cash flow gap? Bridge your business needs.",
                    amountRange: "₦5,000 - ₦50,000",
                    typicalUse: "Business operations and expenses",
                    repayment: "14-30 days"
                }
            ]
        },
        
        // Education Category
        education: {
            path: "/ng/emergency/education",
            title: "Education Loans - M-Pesewa Nigeria",
            scenarios: [
                {
                    title: "School Fees",
                    description: "Emergency school fees payment for your children.",
                    amountRange: "₦1,000 - ₦30,000",
                    typicalUse: "Primary, secondary, or university fees",
                    repayment: "7-30 days"
                },
                {
                    title: "Exam Fees",
                    description: "Urgent exam registration fees needed?",
                    amountRange: "₦500 - ₦10,000",
                    typicalUse: "WAEC, NECO, JAMB, professional exams",
                    repayment: "7-14 days"
                }
            ]
        }
    },

    // ====================================================================
    // 7️⃣ SUPPORT & HELP PAGES
    // ====================================================================
    supportPages: {
        // FAQ Page (Nigeria Specific)
        faq: {
            path: "/ng/support/faq",
            categories: [
                {
                    name: "Registration & Verification",
                    questions: [
                        {
                            q: "What documents do I need to register?",
                            a: "You need your NIN, BVN (for lenders), valid ID card, proof of address, and passport photograph."
                        },
                        {
                            q: "How long does verification take?",
                            a: "Typically 24-48 hours for Nigerian residents with complete documents."
                        }
                    ]
                },
                {
                    name: "Loans & Repayments",
                    questions: [
                        {
                            q: "What is the maximum loan amount?",
                            a: "Depends on your tier: Basic: ₦1,500, Premium: ₦5,000, Super: ₦20,000 per week."
                        },
                        {
                            q: "Can I repay early?",
                            a: "Yes, early repayment is allowed without penalties. Interest is calculated only for days used."
                        }
                    ]
                },
                {
                    name: "Technical Issues",
                    questions: [
                        {
                            q: "What if I forget my password?",
                            a: "Use the 'Forgot Password' feature or contact support at +234 800 000 0000."
                        },
                        {
                            q: "Is the platform secure?",
                            a: "Yes, we use bank-level encryption and comply with Nigerian data protection regulations."
                        }
                    ]
                }
            ]
        },
        
        // Contact Page
        contact: {
            path: "/ng/support/contact",
            channels: [
                {
                    type: "Phone Support",
                    details: "+234 800 000 0000",
                    hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
                    languages: "English, Pidgin, Hausa, Yoruba, Igbo"
                },
                {
                    type: "WhatsApp",
                    details: "+234 800 000 0001",
                    hours: "24/7 for emergencies",
                    response: "Within 30 minutes"
                },
                {
                    type: "Email",
                    details: "ng.support@mpesewa.com",
                    hours: "24/7",
                    response: "Within 4 hours"
                },
                {
                    type: "Physical Offices",
                    details: "Lagos: 123 Adeola Odeku, VI | Abuja: Plot 123, CBD",
                    hours: "Mon-Fri: 8AM-6PM",
                    appointment: "Required for account issues"
                }
            ]
        },
        
        // Complaint Resolution
        complaints: {
            path: "/ng/support/complaints",
            levels: [
                {
                    level: 1,
                    name: "Customer Service",
                    timeframe: "48 hours",
                    contact: "ng.support@mpesewa.com"
                },
                {
                    level: 2,
                    name: "Complaints Manager",
                    timeframe: "7 days",
                    contact: "complaints.ng@mpesewa.com"
                },
                {
                    level: 3,
                    name: "Regulatory Escalation",
                    timeframe: "14 days",
                    contact: "CBN Consumer Protection Department"
                }
            ],
            escalationProcess: [
                "Submit complaint through platform",
                "Receive tracking number",
                "Level 1 resolution attempt",
                "If unresolved, escalate to Level 2",
                "Final escalation to regulatory if needed"
            ]
        }
    },

    // ====================================================================
    // 8️⃣ NAVIGATION STRUCTURE
    // ====================================================================
    navigation: {
        mainMenu: [
            {
                label: "Home",
                path: "/ng",
                icon: "🏠"
            },
            {
                label: "Borrow",
                path: "/ng/borrow",
                submenu: [
                    { label: "Apply for Loan", path: "/ng/borrower/apply" },
                    { label: "My Loans", path: "/ng/borrower/dashboard" },
                    { label: "Repayments", path: "/ng/borrower/repayments" },
                    { label: "Loan History", path: "/ng/borrower/history" }
                ]
            },
            {
                label: "Lend",
                path: "/ng/lend",
                submenu: [
                    { label: "Lender Dashboard", path: "/ng/lender/dashboard" },
                    { label: "Loan Requests", path: "/ng/lender/requests" },
                    { label: "My Ledgers", path: "/ng/lender/ledgers" },
                    { label: "Portfolio", path: "/ng/lender/portfolio" }
                ]
            },
            {
                label: "Groups",
                path: "/ng/groups",
                submenu: [
                    { label: "Find Groups", path: "/ng/groups/directory" },
                    { label: "Create Group", path: "/ng/groups/create" },
                    { label: "My Groups", path: "/ng/groups/my" }
                ]
            },
            {
                label: "Emergency Categories",
                path: "/ng/emergency",
                submenu: [
                    { label: "Transportation", path: "/ng/emergency/transport" },
                    { label: "Business", path: "/ng/emergency/business" },
                    { label: "Education", path: "/ng/emergency/education" },
                    { label: "Medical", path: "/ng/emergency/medical" },
                    { label: "Household", path: "/ng/emergency/household" }
                ]
            },
            {
                label: "Support",
                path: "/ng/support",
                submenu: [
                    { label: "FAQ", path: "/ng/support/faq" },
                    { label: "Contact Us", path: "/ng/support/contact" },
                    { label: "Complaints", path: "/ng/support/complaints" }
                ]
            }
        ],
        
        footerLinks: [
            {
                title: "Company",
                links: [
                    { label: "About Us", path: "/ng/about" },
                    { label: "Careers", path: "/ng/careers" },
                    { label: "Press", path: "/ng/press" },
                    { label: "Contact", path: "/ng/contact" }
                ]
            },
            {
                title: "Legal",
                links: [
                    { label: "Terms & Conditions", path: "/ng/terms" },
                    { label: "Privacy Policy", path: "/ng/privacy" },
                    { label: "Cookie Policy", path: "/ng/cookies" },
                    { label: "Compliance", path: "/ng/compliance" }
                ]
            },
            {
                title: "Resources",
                links: [
                    { label: "Blog", path: "/ng/blog" },
                    { label: "Guides", path: "/ng/guides" },
                    { label: "Calculator", path: "/ng/calculator" },
                    { label: "Download App", path: "/ng/download" }
                ]
            }
        ]
    },

    // ====================================================================
    // 9️⃣ PAGE VALIDATION RULES
    // ====================================================================
    validation: {
        // Access Control Rules
        accessControl: {
            publicPages: [
                "/ng",
                "/ng/about",
                "/ng/terms",
                "/ng/privacy",
                "/ng/support/faq",
                "/ng/support/contact"
            ],
            authenticatedPages: [
                "/ng/borrower/*",
                "/ng/lender/*",
                "/ng/groups/*",
                "/ng/profile/*"
            ],
            countryRestricted: true,
            ipWhitelist: ["Nigeria IP ranges only"],
            vpnBlocked: true
        },
        
        // Form Validation Rules
        forms: {
            registration: {
                phone: {
                    pattern: /^(\+234|0)[789][01]\d{8}$/,
                    message: "Enter valid Nigerian phone number"
                },
                nin: {
                    pattern: /^\d{11}$/,
                    message: "NIN must be 11 digits"
                },
                bvn: {
                    pattern: /^\d{11}$/,
                    message: "BVN must be 11 digits"
                }
            },
            loanApplication: {
                amount: {
                    min: 50,
                    max: 20000,
                    message: "Amount must be between ₦50 and ₦20,000"
                },
                duration: {
                    min: 1,
                    max: 30,
                    message: "Duration must be 1-30 days"
                }
            }
        }
    },

    // ====================================================================
    // 🔟 PAGE ANALYTICS & TRACKING
    // ====================================================================
    analytics: {
        trackingCodes: {
            googleAnalytics: "UA-NG-MPESEWA-001",
            facebookPixel: "NG123456789",
            hotjar: "NG-789456"
        },
        
        events: {
            pageViews: [
                "ng_homepage_view",
                "ng_registration_start",
                "ng_loan_application",
                "ng_repayment_made",
                "ng_support_contact"
            ],
            conversions: [
                "ng_user_registered",
                "ng_loan_approved",
                "ng_repayment_completed",
                "ng_group_created"
            ],
            errors: [
                "ng_validation_error",
                "ng_payment_failed",
                "ng_session_expired",
                "ng_access_denied"
            ]
        },
        
        metrics: {
            daily: ["page_views", "registrations", "loans_approved", "repayments"],
            weekly: ["active_users", "default_rate", "customer_satisfaction"],
            monthly: ["growth_rate", "churn_rate", "revenue_per_user"]
        }
    }
};

// ====================================================================
// PAGE RENDERING FUNCTIONS
// ====================================================================

/**
 * Render Nigeria-specific page with correct branding
 * @param {string} pageType - Type of page to render
 * @param {Object} data - Page data
 * @returns {string} HTML content
 */
function renderNigeriaPage(pageType, data = {}) {
    const templates = {
        landing: `
<!DOCTYPE html>
<html lang="en-NG">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${NigeriaPages.landingPage.title}</title>
    <meta name="description" content="${NigeriaPages.landingPage.metaDescription}">
    <meta name="country" content="Nigeria">
    <meta name="currency" content="NGN">
    <link rel="stylesheet" href="/css/ng-theme.css">
</head>
<body class="ng-theme">
    <header>
        <div class="ng-flag">🇳🇬</div>
        <h1>${NigeriaPages.landingPage.hero.title}</h1>
        <p>${NigeriaPages.landingPage.hero.subtitle}</p>
        <div class="cta-buttons">
            ${NigeriaPages.landingPage.hero.ctaButtons.map(btn => `
                <a href="${btn.link}" class="btn" style="background-color: ${btn.color}">
                    ${btn.icon} ${btn.text}
                </a>
            `).join('')}
        </div>
    </header>
    
    <section class="stats">
        ${NigeriaPages.landingPage.stats.map(stat => `
            <div class="stat">
                <h3>${stat.value}</h3>
                <p>${stat.label}</p>
                <small>${stat.description}</small>
            </div>
        `).join('')}
    </section>
    
    <footer>
        <p>M-Pesewa Nigeria | Licensed by CBN | NDPR Compliant</p>
        <p>Contact: ${NigeriaPages.supportPages.contact.channels[0].details}</p>
    </footer>
</body>
</html>
        `,
        
        lenderDashboard: `
<!DOCTYPE html>
<html lang="en-NG">
<head>
    <title>Lender Dashboard - M-Pesewa Nigeria</title>
    <style>
        .ng-theme { background: #f8f9fa; }
        .currency { color: #006400; font-weight: bold; }
        .currency::before { content: '₦'; }
    </style>
</head>
<body class="ng-theme">
    <h1>🇳🇬 Nigerian Lender Dashboard</h1>
    <div class="dashboard-widgets">
        ${NigeriaPages.lenderPages.dashboard.widgets.map(widget => `
            <div class="widget">
                <h3>${widget.title}</h3>
                ${widget.metrics.map(metric => `
                    <div class="metric">${metric}: <span class="currency">0</span></div>
                `).join('')}
            </div>
        `).join('')}
    </div>
</body>
</html>
        `
    };
    
    return templates[pageType] || `<h1>Page not found for Nigeria</h1>`;
}

/**
 * Generate breadcrumb navigation for Nigerian pages
 * @param {string} currentPath - Current page path
 * @returns {Array} Breadcrumb trail
 */
function generateBreadcrumbs(currentPath) {
    const base = "M-Pesewa Nigeria";
    const paths = currentPath.split('/').filter(p => p);
    
    const breadcrumbs = [
        { name: base, path: "/ng" }
    ];
    
    paths.forEach((path, index) => {
        const name = path.charAt(0).toUpperCase() + path.slice(1);
        const pathUrl = '/' + paths.slice(0, index + 1).join('/');
        breadcrumbs.push({ name, path: pathUrl });
    });
    
    return breadcrumbs;
}

/**
 * Validate page access based on user location
 * @param {string} userIP - User's IP address
 * @param {string} requestedPath - Path being accessed
 * @returns {Object} Access validation result
 */
function validatePageAccess(userIP, requestedPath) {
    // Simulated IP validation (in production, use proper geolocation)
    const isNigerianIP = userIP.startsWith('197.') || userIP.startsWith('41.');
    
    if (!isNigerianIP && requestedPath.startsWith('/ng/')) {
        return {
            allowed: false,
            redirect: "/countries",
            reason: "Nigeria-restricted content",
            message: "This content is only available to users in Nigeria"
        };
    }
    
    return {
        allowed: true,
        reason: "Access granted",
        country: "Nigeria"
    };
}

/**
 * Generate page metadata for SEO
 * @param {string} pagePath - Page path
 * @returns {Object} SEO metadata
 */
function generatePageMetadata(pagePath) {
    const metadata = {
        title: "M-Pesewa Nigeria",
        description: "Emergency micro-lending platform for Nigeria",
        keywords: ["Nigeria", "emergency loans", "micro-lending", "Naira", "BVN", "NIN"],
        ogType: "website",
        locale: "en_NG",
        currency: "NGN"
    };
    
    // Page-specific metadata
    if (pagePath.includes('/lender/')) {
        metadata.title = "Lender Platform - M-Pesewa Nigeria";
        metadata.description = "Become a lender and earn returns in Nigeria";
    } else if (pagePath.includes('/borrower/')) {
        metadata.title = "Emergency Loans - M-Pesewa Nigeria";
        metadata.description = "Get emergency loans from trusted Nigerians";
    }
    
    return metadata;
}

// ====================================================================
// EXPORT MODULE
// ====================================================================
module.exports = {
    pages: NigeriaPages,
    renderNigeriaPage,
    generateBreadcrumbs,
    validatePageAccess,
    generatePageMetadata
};

// ====================================================================
// INITIALIZATION
// ====================================================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║              M-PESEWA NIGERIA PAGES MODULE                ║
║              Complete Page Configuration                  ║
╚════════════════════════════════════════════════════════════╝

Page Categories Configured:
• Landing Page: ${NigeriaPages.landingPage.title}
• State Pages: ${Object.keys(NigeriaPages.statePages).length} states
• Group Pages: ${Object.keys(NigeriaPages.groupPages).length} categories
• Lender Pages: ${Object.keys(NigeriaPages.lenderPages).length} sections
• Borrower Pages: ${Object.keys(NigeriaPages.borrowerPages).length} sections
• Emergency Pages: ${Object.keys(NigeriaPages.emergencyPages).length} categories
• Support Pages: ${Object.keys(NigeriaPages.supportPages).length} types

Navigation Structure:
• Main Menu Items: ${NigeriaPages.navigation.mainMenu.length}
• Footer Links: ${NigeriaPages.navigation.footerLinks.length} categories

Validation Rules:
• Public Pages: ${NigeriaPages.validation.accessControl.publicPages.length}
• Authenticated Pages: ${NigeriaPages.validation.accessControl.authenticatedPages.length}
• Country Restricted: ${NigeriaPages.validation.accessControl.countryRestricted}

Analytics Tracking:
• Events: ${NigeriaPages.analytics.events.pageViews.length} page views
• Conversions: ${NigeriaPages.analytics.events.conversions.length} conversion events

Available Templates:
• Landing Page Template ✓
• Lender Dashboard Template ✓
• Breadcrumb Generator ✓
• Access Validator ✓
• Metadata Generator ✓

Ready to serve Nigerian users with localized experience.
`);