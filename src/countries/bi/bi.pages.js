/**
 * BURUNDI (BI) - Country Pages Module
 * Country-specific pages and routing for Burundi operations
 * Enforces strict country isolation in UI/UX
 */

const BI_PAGES_CONFIG = {
    // ============================================
    // 1️⃣ COUNTRY LANDING PAGE CONFIGURATION
    // ============================================
    landingPage: {
        path: "/countries/burundi",
        title: "M-Pesewa Burundi - Emergency Micro-Lending Platform",
        metaDescription: "Peer-to-peer emergency lending in Burundi. Join trusted groups in your community for responsible borrowing and lending.",
        metaKeywords: ["Burundi", "BIF", "micro-lending", "emergency loans", "Kirundi", "peer-to-peer"],
        
        heroSection: {
            title: "Urusanzu mu bintu byihuse muri Burundi",
            subtitle: "Emergency financial support within trusted communities",
            backgroundImage: "/assets/images/countries/bi/hero-bg.jpg",
            ctaButtons: [
                {
                    text: "Tangira gukoresha",
                    url: "/auth/register?country=BI",
                    color: "#CE1126", // Burundi red
                    icon: "🚀"
                },
                {
                    text: "Menya uko bikora",
                    url: "/how-it-works?country=BI",
                    color: "#00A1DE", // Burundi blue
                    icon: "📚"
                }
            ]
        },
        
        statsSection: {
            title: "M-Pesewa mu Burundi",
            stats: [
                {
                    number: "5,000+",
                    label: "Abakoresha",
                    icon: "👥"
                },
                {
                    number: "250+",
                    label: "Amatsinda yizewe",
                    icon: "🤝"
                },
                {
                    number: "99%",
                    label: "Ingano yo kwishyura",
                    icon: "✅"
                },
                {
                    number: "50M BIF",
                    label: "Umubare w'inguzanyo",
                    icon: "💰"
                }
            ]
        }
    },
    
    // ============================================
    // 2️⃣ COUNTRY DASHBOARD PAGES
    // ============================================
    dashboardPages: {
        borrowerDashboard: {
            path: "/bi/borrower/dashboard",
            title: "Ikibarura cyawe - Umukiranza",
            sections: [
                {
                    id: "active-loans",
                    title: "Inguzanyo zikora",
                    icon: "📊",
                    components: ["loan-cards", "repayment-timeline", "upcoming-payments"]
                },
                {
                    id: "borrow-history",
                    title: "Amateka yo gukiranza",
                    icon: "📜",
                    components: ["history-table", "charts", "export-button"]
                },
                {
                    id: "reputation",
                    title: "Icyubahiro",
                    icon: "⭐",
                    components: ["rating-display", "group-access", "badges"]
                },
                {
                    id: "emergency-categories",
                    title: "Ubwoko bw'inguzanyo",
                    icon: "🚨",
                    components: ["category-grid", "quick-apply", "calculator"]
                }
            ],
            restrictions: {
                maxActiveLoans: 1,
                requiresGoodRating: true,
                countryLocked: true
            }
        },
        
        lenderDashboard: {
            path: "/bi/lender/dashboard",
            title: "Ikibarura cyawe - Ugutanga",
            sections: [
                {
                    id: "portfolio",
                    title: "Porifoliyo",
                    icon: "💼",
                    components: ["ledger-overview", "active-borrowers", "expected-returns"]
                },
                {
                    id: "subscription",
                    title: "Kwiyandikisha",
                    icon: "📋",
                    components: ["tier-display", "limits", "renewal-date", "upgrade-button"]
                },
                {
                    id: "requests",
                    title: "Amasaba",
                    icon: "🙏",
                    components: ["request-list", "filters", "approval-actions"]
                },
                {
                    id: "reports",
                    title: "Raporo",
                    icon: "📈",
                    components: ["performance-charts", "export-tools", "analytics"]
                }
            ],
            restrictions: {
                requiresSubscription: true,
                subscriptionExpiry: "28th monthly",
                countryLocked: true
            }
        },
        
        groupDashboard: {
            path: "/bi/group/dashboard",
            title: "Ikibarura cy'itsinda",
            sections: [
                {
                    id: "members",
                    title: "Abanyamuryango",
                    icon: "👥",
                    components: ["member-list", "invitations", "join-requests"]
                },
                {
                    id: "activity",
                    title: "Ibikorwa",
                    icon: "📊",
                    components: ["loan-activity", "repayment-rates", "disputes"]
                },
                {
                    id: "settings",
                    title: "Igenamiterere",
                    icon: "⚙️",
                    components: ["group-settings", "rules", "admin-tools"]
                },
                {
                    id: "analytics",
                    title: "Ibaruramiterere",
                    icon: "📈",
                    components: ["growth-charts", "performance", "insights"]
                }
            ],
            restrictions: {
                adminOnly: true,
                minMembers: 5,
                maxMembers: 1000,
                countryLocked: true
            }
        }
    },
    
    // ============================================
    // 3️⃣ REGISTRATION & ONBOARDING PAGES
    // ============================================
    registrationPages: {
        countrySelection: {
            path: "/bi/register/country",
            title: "Hitamo Igihugu - Burundi",
            enforceSelection: "BI",
            redirectIfNotSelected: true,
            languageOptions: ["Kirundi", "French", "English"]
        },
        
        borrowerRegistration: {
            path: "/bi/register/borrower",
            title: "Iyandikishe nk'ukiranza",
            steps: [
                {
                    step: 1,
                    title: "Amakuru y'umuntu",
                    fields: [
                        { name: "fullName", type: "text", required: true, label: "Izina ryuzuye" },
                        { name: "nationalId", type: "text", required: true, label: "Numero y'irangamuntu" },
                        { name: "phone", type: "tel", required: true, label: "Telephone", validation: "/^+257[0-9]{8}$/" },
                        { name: "email", type: "email", required: false, label: "Imeyili" },
                        { name: "location", type: "text", required: true, label: "Aho utuye" }
                    ]
                },
                {
                    step: 2,
                    title: "Ababishura",
                    fields: [
                        { name: "referrer1Name", type: "text", required: true, label: "Izina ry'umushura 1" },
                        { name: "referrer1Phone", type: "tel", required: true, label: "Telephone y'umushura 1" },
                        { name: "referrer2Name", type: "text", required: true, label: "Izina ry'umushura 2" },
                        { name: "referrer2Phone", type: "tel", required: true, label: "Telephone y'umushura 2" }
                    ]
                },
                {
                    step: 3,
                    title: "Gutondekanya itsinda",
                    fields: [
                        { name: "groupSelection", type: "select", required: true, label: "Hitamo itsinda", options: "dynamic" },
                        { name: "invitationCode", type: "text", required: false, label: "Kode y'ukwemerera" }
                    ]
                },
                {
                    step: 4,
                    title: "Kwemeza",
                    fields: [
                        { name: "termsAgreement", type: "checkbox", required: true, label: "Nemera amategeko n'amabwiriza" },
                        { name: "privacyAgreement", type: "checkbox", required: true, label: "Nemera politiki y'ibanga" }
                    ]
                }
            ],
            postRegistration: {
                verification: ["phone", "referrers"],
                welcomeMessage: "Murakaza neza kuri M-Pesewa Burundi!",
                nextStep: "/bi/borrower/dashboard"
            }
        },
        
        lenderRegistration: {
            path: "/bi/register/lender",
            title: "Iyandikishe nk'ugutanga",
            steps: [
                {
                    step: 1,
                    title: "Amakuru y'umuntu",
                    fields: [
                        { name: "fullName", type: "text", required: true, label: "Izina ryuzuye" },
                        { name: "brandName", type: "text", required: false, label: "Izina ry'ubucuruzi" },
                        { name: "nationalId", type: "text", required: true, label: "Numero y'irangamuntu" },
                        { name: "phone", type: "tel", required: true, label: "Telephone", validation: "/^+257[0-9]{8}$/" },
                        { name: "email", type: "email", required: true, label: "Imeyili" },
                        { name: "location", type: "text", required: true, label: "Aho utuye" }
                    ]
                },
                {
                    step: 2,
                    title: "Amahitamo yo gutanga",
                    fields: [
                        { 
                            name: "subscriptionTier", 
                            type: "select", 
                            required: true, 
                            label: "Hitamo urwego",
                            options: [
                                { value: "basic", label: "Basic - 50 BIF / ukwezi" },
                                { value: "premium", label: "Premium - 250 BIF / ukwezi" },
                                { value: "super", label: "Super - 1000 BIF / ukwezi" },
                                { value: "lenderOfLenders", label: "Lender of Lenders - 500 BIF / ukwezi" }
                            ]
                        },
                        {
                            name: "categories",
                            type: "multiselect",
                            required: true,
                            label: "Hitamo ubwoko bw'inguzanyo",
                            options: [
                                { value: "all", label: "Byose" },
                                { value: "fare", label: "🚌 M-pesewa Fare" },
                                { value: "data", label: "📶 M-pesewa Data" },
                                { value: "gas", label: "🔥 M-pesewa Cooking Gas" },
                                { value: "food", label: "🍲 M-pesewa Food" },
                                { value: "medicine", label: "💊 M-pesewa Medicine" },
                                { value: "school", label: "🎓 M-pesewa School Fees" }
                            ]
                        }
                    ]
                },
                {
                    step: 3,
                    title: "Ababishura n'itsinda",
                    fields: [
                        { name: "referrer1Name", type: "text", required: true, label: "Izina ry'umushura 1" },
                        { name: "referrer1Phone", type: "tel", required: true, label: "Telephone y'umushura 1" },
                        { name: "referrer2Name", type: "text", required: true, label: "Izina ry'umushura 2" },
                        { name: "referrer2Phone", type: "tel", required: true, label: "Telephone y'umushura 2" },
                        { name: "groupSelection", type: "select", required: true, label: "Hitamo itsinda", options: "dynamic" }
                    ]
                },
                {
                    step: 4,
                    title: "Kwemeza no kwishura",
                    fields: [
                        { name: "termsAgreement", type: "checkbox", required: true, label: "Nemera amategeko n'amabwiriza" },
                        { name: "privacyAgreement", type: "checkbox", required: true, label: "Nemera politiki y'ibanga" },
                        { name: "paymentMethod", type: "select", required: true, label: "Uburyo bwo kwishura", options: ["Mobile Money", "Bank Transfer"] }
                    ]
                }
            ],
            postRegistration: {
                verification: ["phone", "referrers", "payment"],
                paymentRedirect: "/bi/payment/subscription",
                welcomeMessage: "Murakaza neza kuri M-Pesewa Burundi! Subira inyuma kwishyuye.",
                nextStep: "/bi/lender/dashboard"
            }
        }
    },
    
    // ============================================
    // 4️⃣ LOAN MANAGEMENT PAGES
    // ============================================
    loanPages: {
        applyLoan: {
            path: "/bi/loan/apply",
            title: "Saba inguzanyo",
            steps: [
                {
                    step: 1,
                    title: "Hitamo ubwoko",
                    components: ["category-selector", "amount-calculator", "purpose-input"]
                },
                {
                    step: 2,
                    title: "Hitamo umutanga",
                    components: ["lender-list", "group-filter", "terms-display"]
                },
                {
                    step: 3,
                    title: "Emeza amakuru",
                    components: ["loan-summary", "repayment-schedule", "agreement-preview"]
                },
                {
                    step: 4,
                    title: "Tanga isaba",
                    components: ["submit-button", "confirmation", "status-tracker"]
                }
            ],
            restrictions: {
                maxActiveLoans: 1,
                requiresGoodRating: true,
                withinSubscriptionLimits: true
            }
        },
        
        loanCalculator: {
            path: "/bi/tools/calculator",
            title: "Kalkulateri y'inguzanyo",
            inputs: [
                { name: "amount", type: "number", min: 100, max: 50000, step: 100, label: "Ingano y'inguzanyo (BIF)" },
                { name: "category", type: "select", label: "Ubwoko", options: "dynamic" },
                { name: "lenderTier", type: "select", label: "Urwego", options: ["basic", "premium", "super"] }
            ],
            calculations: [
                { name: "interest", formula: "amount * 0.10", label: "Inyungu (10%)" },
                { name: "totalRepay", formula: "amount + interest", label: "Igiteranyo cyo kwishyura" },
                { name: "dailyRepay", formula: "totalRepay / 7", label: "Kwishyura buri munsi" },
                { name: "penaltyDay8", formula: "amount * 0.05", label: "Ibihano ku munsi wa 8" }
            ],
            disclaimer: "Ibi ni ibisubizo by'ibanze gusa. Inyungu n'ibihano bishobora guhinduka bitewe n'urwego rw'umutanga."
        },
        
        repaymentPage: {
            path: "/bi/loan/repay",
            title: "Kwishyura inguzanyo",
            methods: [
                {
                    id: "mobile-money",
                    name: "Mobile Money",
                    providers: ["Lumitel", "Econet Leo"],
                    instructions: "Koresha *555# kugirango wishyure",
                    processingTime: "Amasaha 24"
                },
                {
                    id: "bank-transfer",
                    name: "Kohereza mu banki",
                    banks: ["Bank of the Republic of Burundi", "Banque de Crédit de Bujumbura"],
                    account: "100200300400",
                    instructions: "Tanga numero y'inguzanyo mu bwiru"
                },
                {
                    id: "cash",
                    name: "Amafaranga",
                    instructions: "Subira kuri ofisi ya M-Pesewa mu mujyi wa Bujumbura",
                    hours: "Monday-Friday 8:00-17:00"
                }
            ],
            features: ["partial-payments", "schedule-payments", "receipt-generation"]
        }
    },
    
    // ============================================
    // 5️⃣ GROUP MANAGEMENT PAGES
    // ============================================
    groupPages: {
        createGroup: {
            path: "/bi/group/create",
            title: "Tangura itsinda rishya",
            requirements: {
                minFounders: 1,
                maxFounders: 3,
                founderQualifications: ["resident", "verified", "good-rating"]
            },
            formFields: [
                { name: "groupName", type: "text", required: true, label: "Izina ry'itsinda" },
                { name: "groupType", type: "select", required: true, label: "Ubwoko", options: ["Family", "Church", "Professional", "Local Community"] },
                { name: "description", type: "textarea", required: true, label: "Ibisobanuro" },
                { name: "rules", type: "textarea", required: true, label: "Amabwiriza y'itsinda" },
                { name: "inviteMembers", type: "multiselect", required: false, label: "Ohereza imenyekanisha", options: "contacts" }
            ],
            postCreation: {
                minMembersRequired: 5,
                verificationPeriod: "48 hours",
                adminToolsUnlocked: true
            }
        },
        
        joinGroup: {
            path: "/bi/group/join",
            title: "Injira mu tsinda",
            methods: [
                {
                    name: "Invitation",
                    description: "Kunda imenyekanisha kuva k'umuyobozi w'itsinda",
                    requirements: ["invitation-code", "referrer-approval"]
                },
                {
                    name: "Referral",
                    description: "Kunda ubushobozi kuva kubanyamuryango b'itsinda",
                    requirements: ["member-referral", "admin-approval"]
                },
                {
                    name: "Application",
                    description: "Tanga isaba n'ubwishingizi",
                    requirements: ["application-form", "referrers", "admin-review"]
                }
            ],
            restrictions: {
                maxGroupsPerUser: 4,
                requiresGoodRating: true,
                countryLocked: true
            }
        },
        
        groupDirectory: {
            path: "/bi/groups",
            title: "Urutonde rw'amatsinda",
            filters: [
                { name: "type", label: "Ubwoko", options: ["All", "Family", "Church", "Professional", "Local Community"] },
                { name: "size", label: "Ingano", options: ["Small (<50)", "Medium (50-200)", "Large (200-1000)"] },
                { name: "activity", label: "Ibikorwa", options: ["Active", "New", "Established"] },
                { name: "location", label: "Aho", options: "regions" }
            ],
            sortOptions: [
                { value: "newest", label: "Gishya" },
                { value: "largest", label: "Kinini" },
                { value: "most_active", label: "Kikora cyane" },
                { value: "highest_repayment", label: "Kwishyura hejuru" }
            ],
            viewModes: ["grid", "list", "map"]
        }
    },
    
    // ============================================
    // 6️⃣ SUBSCRIPTION MANAGEMENT PAGES
    // ============================================
    subscriptionPages: {
        plansOverview: {
            path: "/bi/subscription/plans",
            title: "Amahitamo yo kwiyandikisha",
            displayCurrency: "BIF",
            tiers: [
                {
                    id: "basic",
                    name: "Basic",
                    price: "50 / ukwezi",
                    features: [
                        "Kugera kuri 1,500 BIF buri cyumweru",
                        "Inguzanyo 5 gusa",
                        "Gutanga mu matsinda",
                        "Gukurikirana ibikorwa"
                    ],
                    cta: { text: "Hitamo", url: "/bi/subscription/select?tier=basic" }
                },
                {
                    id: "premium",
                    name: "Premium",
                    price: "250 / ukwezi",
                    popular: true,
                    features: [
                        "Kugera kuri 5,000 BIF buri cyumweru",
                        "Inguzanyo nyinshi",
                        "Ibikoresho by'ibanze",
                        "Inkunga ya mbere"
                    ],
                    cta: { text: "Hitamo", url: "/bi/subscription/select?tier=premium" }
                },
                {
                    id: "super",
                    name: "Super",
                    price: "1,000 / ukwezi",
                    features: [
                        "Kugera kuri 20,000 BIF buri cyumweru",
                        "CRB kugenzura",
                        "Ibikoresho byihuse",
                        "Inkunga ikora"
                    ],
                    cta: { text: "Hitamo", url: "/bi/subscription/select?tier=super" }
                }
            ],
            comparisonTable: {
                headers: ["Ibiranga", "Basic", "Premium", "Super"],
                rows: [
                    ["Ingano y'inguzanyo", "1,500 BIF", "5,000 BIF", "20,000 BIF"],
                    ["Inyungu", "10%", "10%", "10%"],
                    ["CRB", "Oya", "Oya", "Yego"],
                    ["Inkunga", "Oya", "Ibikoresho", "Ikora"]
                ]
            }
        },
        
        paymentPage: {
            path: "/bi/payment/subscription",
            title: "Kwishyura kwiyandikisha",
            methods: [
                {
                    id: "mobile-money",
                    name: "Mobile Money",
                    instructions: [
                        "Genda kuri *555#",
                        "Hitamo 'Kwishyura'",
                        "Shyiramo code: MPESEWA",
                        "Shyiramo umubare: [amount] BIF"
                    ],
                    processingTime: "Amasaha 2"
                },
                {
                    id: "bank",
                    name: "Banki",
                    accountDetails: {
                        bank: "Bank of the Republic of Burundi",
                        accountName: "M-Pesewa Burundi",
                        accountNumber: "100200300400",
                        branch: "Bujumbura Main"
                    },
                    processingTime: "Iminsi 1-2"
                }
            ],
            confirmation: {
                email: true,
                sms: true,
                receipt: true,
                activationTime: "immediately"
            }
        },
        
        subscriptionStatus: {
            path: "/bi/subscription/status",
            title: "Imiterere y'iyandikisha",
            display: [
                { label: "Urwego", key: "tier" },
                { label: "Igihe kirenze", key: "expiry_date" },
                { label: "Iminsi isigaye", key: "days_remaining" },
                { label: "Ingano isigaye", key: "remaining_limit" },
                { label: "Ingano yose", key: "total_limit" }
            ],
            warnings: [
                { days: 7, message: "Igihe cyawe cy'iyandikisha kirarenga mu minsi 7. Subira kwishyura." },
                { days: 3, message: "Igihe cyawe cy'iyandikisha kirarenga mu minsi 3. Urugendo rwo gutanga ruzahagarikwa." },
                { days: 0, message: "Igihe cyawe cy'iyandikisha cyarangije. Subira kwiyandikisha kugirango ukomeze gutanga." }
            ],
            renewalOptions: ["auto-renew", "manual-renew", "upgrade", "downgrade"]
        }
    },
    
    // ============================================
    // 7️⃣ SUPPORT & HELP PAGES
    // ============================================
    supportPages: {
        helpCenter: {
            path: "/bi/help",
            title: "Inkunga n'ubufasha",
            categories: [
                {
                    id: "getting-started",
                    name: "Gutangira",
                    articles: [
                        { title: "Uko mwandika", url: "/bi/help/registration" },
                        { title: "Gutanga itsinda", url: "/bi/help/create-group" },
                        { title: "Gusaba inguzanyo", url: "/bi/help/apply-loan" }
                    ]
                },
                {
                    id: "payments",
                    name: "Kwishyura",
                    articles: [
                        { title: "Uburyo bwo kwishyura", url: "/bi/help/payment-methods" },
                        { title: "Uburyo bwo kwishyura inguzanyo", url: "/bi/help/repay-loan" },
                        { title: "Kwishyura kwiyandikisha", url: "/bi/help/pay-subscription" }
                    ]
                },
                {
                    id: "troubleshooting",
                    name: "Gukemura ibibazo",
                    articles: [
                        { title: "Ntabwo nshobora kwinjira", url: "/bi/help/login-issues" },
                        { title: "Inguzanyo ntishyizwe mu konti", url: "/bi/help/disbursement-issues" },
                        { title: "Inkunga ntabwo yashyizweho", url: "/bi/help/support-issues" }
                    ]
                }
            ],
            contactOptions: [
                { method: "phone", value: "+257 79 000 000", hours: "8:00-17:00" },
                { method: "email", value: "support.bi@mpesewa.com", response: "Amasaha 24" },
                { method: "chat", value: "In-app chat", hours: "24/7" }
            ]
        },
        
        contactUs: {
            path: "/bi/contact",
            title: "Twandikire",
            departments: [
                {
                    name: "Inkunga n'ubufasha",
                    email: "support.bi@mpesewa.com",
                    phone: "+257 79 000 001",
                    hours: "Monday-Friday 8:00-17:00"
                },
                {
                    name: "Amakuru n'ibyemewe",
                    email: "legal.bi@mpesewa.com",
                    phone: "+257 79 000 002",
                    hours: "Monday-Friday 9:00-16:00"
                },
                {
                    name: "Ubucuruzi",
                    email: "business.bi@mpesewa.com",
                    phone: "+257 79 000 003",
                    hours: "Monday-Friday 8:00-17:00"
                }
            ],
            officeLocation: {
                address: "Bujumbura Business District, Burundi",
                coordinates: { lat: -3.361378, lng: 29.359878 },
                hours: "Monday-Friday 8:00-17:00",
                appointmentRequired: true
            },
            contactForm: {
                fields: [
                    { name: "name", type: "text", required: true },
                    { name: "email", type: "email", required: true },
                    { name: "phone", type: "tel", required: true },
                    { name: "department", type: "select", required: true, options: ["Support", "Legal", "Business"] },
                    { name: "subject", type: "text", required: true },
                    { name: "message", type: "textarea", required: true }
                ],
                responseTime: "Amasaha 48"
            }
        },
        
        faqPage: {
            path: "/bi/faq",
            title: "Ibibazo Byinshi Bibazwa",
            sections: [
                {
                    category: "Kwiyandikisha",
                    questions: [
                        {
                            q: "Ndi Umunyarwanda, nshobora kwiyandikisha muri Burundi?",
                            a: "Oya, ubushobozi bwo kwiyandikisha bwihariye ku banyaburayi. Ukeneye irangamuntu rya Burundi n'itamenyesha ryo muri Burundi."
                        },
                        {
                            q: "Ni ibihe byemewe nkeneye kugirango mwandike?",
                            a: "Ukeneye: izina ryuzuye, numero y'irangamuntu rya Burundi, telephone yo muri Burundi, aho utuye, n'abashura babiri baturutse muri Burundi."
                        }
                    ]
                },
                {
                    category: "Inguzanyo",
                    questions: [
                        {
                            q: "Ingano nshobora gusaba inguzanyo ni iyihe?",
                            a: "Ingano y'inguzanyo irashobora kuba hagati ya BIF 100 na BIF 20,000 bitewe n'urwego rw'umutanga."
                        },
                        {
                            q: "Ni ryari ngomba kwishyura inguzanyo?",
                            a: "Ukwishyura byose bigomba kuba byarangiye mu minsi 7. Nyuma y'icyo, hari ibihano bya 5% buri munsi."
                        }
                    ]
                },
                {
                    category: "Amatsinda",
                    questions: [
                        {
                            q: "Ni amatsinda angana iki nshobora kuba umunyamuryango?",
                            a: "Ushobora kuba umunyamuryango mu matsinda 4 gusa, kandi ikizere cyawe kigomba kuba cyiza (inyenyeri 4 hejuru)."
                        },
                        {
                            q: "Nshobora gufungura itsinda?",
                            a: "Yego, ushobora gufungura itsinda nk'umuyobozi. Ukeneye abanyamuryango 5 kugirango itsinda ribe ryemewe."
                        }
                    ]
                }
            ]
        }
    },
    
    // ============================================
    // 8️⃣ COMPLIANCE & LEGAL PAGES
    // ============================================
    legalPages: {
        terms: {
            path: "/bi/legal/terms",
            title: "Amategeko n'Amabwiriza",
            language: "Kirundi",
            lastUpdated: "2024-03-15",
            sections: [
                "Umushinga n'Umurongo",
                "Amabwiriza yo Kwiyandikisha",
                "Inguzanyo no Kwishyura",
                "Amatsinda n'Abanyamuryango",
                "Inyungu n'Ibihano",
                "Ibyanga n'Ibyemewe",
                "Gutandukanya no Gusesa",
                "Amategeko n'Ibitekerezo"
            ],
            downloadOptions: ["PDF", "DOC", "Print"]
        },
        
        privacy: {
            path: "/bi/legal/privacy",
            title: "Politiki y'Ibyanga",
            language: "Kirundi",
            lastUpdated: "2024-03-15",
            sections: [
                "Amakuru Duftata",
                "Uko Dukoresha Amakuru",
                "Uko Dusahiriza Amakuru",
                "Uburenganzira Bwawe",
                "Umutekano w'Amakuru",
                "Igihe Cyo Kubika Amakuru",
                "Ubuvugizi bw'Ibyanga",
                "Twandikire"
            ],
            consentManagement: true
        },
        
        complaints: {
            path: "/bi/legal/complaints",
            title: "Gutakamba n'Ubwishingizi",
            process: [
                {
                    step: 1,
                    title: "Tanga ikiganiro",
                    description: "Tangira ukoresheje umuyobozi w'itsinda cyangwa serivisi z'inkunga.",
                    timeframe: "Iminsi 3"
                },
                {
                    step: 2,
                    title: "Gutakamba",
                    description: "Tanga ikiganiro cyawe mu buryo bwemewe.",
                    timeframe: "Iminsi 7"
                },
                {
                    step: 3,
                    title: "Gusubiza",
                    description: "Tuzasubiza ikiganiro cyawe mu gihe cyemewe.",
                    timeframe: "Iminsi 30"
                },
                {
                    step: 4,
                    title: "Kugendana ku mategeko",
                    description: "Niba udahuje, ushobora kugendana ku mategeko.",
                    timeframe: "Iminsi 60"
                }
            ],
            escalationContacts: [
                { authority: "Bank of the Republic of Burundi", contact: "+257 22 200 000" },
                { authority: "Consumer Protection", contact: "+257 22 222 222" }
            ]
        }
    },
    
    // ============================================
    // 9️⃣ COUNTRY-SPECIFIC FEATURE PAGES
    // ============================================
    featurePages: {
        emergencyCategories: {
            path: "/bi/emergency",
            title: "Ubwoko bw'Inguzanyo",
            categories: [
                {
                    id: "fare",
                    name: "M-pesewa Fare",
                    description: "Amafaranga yo kugenda mu bihe byihuse",
                    icon: "🚌",
                    typicalAmounts: [500, 1000, 2000, 5000],
                    repaymentExample: "500 BIF → 550 BIF mu minsi 7"
                },
                {
                    id: "data",
                    name: "M-pesewa Data",
                    description: "Internet bundles yo gukomeza kuvugana",
                    icon: "📶",
                    typicalAmounts: [500, 1000, 2000, 3000],
                    repaymentExample: "1000 BIF → 1100 BIF mu minsi 7"
                },
                {
                    id: "medicine",
                    name: "M-pesewa Medicine",
                    description: "Amafaranga y'ubuvuzi n'ubuzima",
                    icon: "💊",
                    typicalAmounts: [1000, 3000, 5000, 10000],
                    repaymentExample: "3000 BIF → 3300 BIF mu minsi 7"
                }
            ],
            quickApplyEnabled: true
        },
        
        debtCollectors: {
            path: "/bi/collectors",
            title: "Abakusanya Inguzanyo",
            disclaimer: "M-Pesewa ntigenzura abakusanya inguzanyo. Abakoresha bakwiye kugenzura ubwishingizi bwabo mbere yo gukoresha serivisi.",
            collectors: [
                {
                    name: "Burundi Collection Agency",
                    contact: "+257 79 100 000",
                    location: "Bujumbura",
                    specialties: ["Small loans", "Urban areas"],
                    rating: "4.2/5"
                },
                {
                    name: "East Africa Debt Recovery",
                    contact: "+257 79 100 001",
                    location: "Gitega",
                    specialties: ["Business loans", "Rural areas"],
                    rating: "4.0/5"
                }
            ],
            filters: ["location", "specialty", "rating"],
            verificationBadge: "Verified by M-Pesewa"
        },
        
        blacklist: {
            path: "/bi/blacklist",
            title: "Urutonde rw'Abatishyuye",
            accessLevel: "restricted", // Only lenders and admins
            columns: [
                { key: "name", label: "Izina" },
                { key: "amount", label: "Ingano" },
                { key: "days_overdue", label: "Iminsi Irenga" },
                { key: "group", label: "Itsinda" },
                { key: "status", label: "Imiterere" }
            ],
            filters: [
                { key: "amount_range", label: "Ingano" },
                { key: "days_range", label: "Iminsi" },
                { key: "group_type", label: "Ubwoko bw'Itsinda" }
            ],
            exportOptions: ["CSV", "PDF", "Print"],
            note: "Abatishyuye ntibashobora gusaba inguzanyo nshya cyangwa kwinjira mu matsinda mashya."
        }
    },
    
    // ============================================
    // 🔟 PAGE ACCESS CONTROL & PERMISSIONS
    // ============================================
    accessControl: {
        publicPages: [
            "/bi",
            "/bi/help",
            "/bi/contact",
            "/bi/faq",
            "/bi/legal/terms",
            "/bi/legal/privacy",
            "/bi/emergency"
        ],
        authenticatedPages: [
            "/bi/borrower/dashboard",
            "/bi/lender/dashboard",
            "/bi/group/dashboard",
            "/bi/loan/apply",
            "/bi/loan/repay",
            "/bi/groups"
        ],
        roleBasedPages: {
            borrower: [
                "/bi/borrower/dashboard",
                "/bi/loan/apply",
                "/bi/loan/repay",
                "/bi/group/join"
            ],
            lender: [
                "/bi/lender/dashboard",
                "/bi/subscription/plans",
                "/bi/subscription/status",
                "/bi/blacklist"
            ],
            groupAdmin: [
                "/bi/group/create",
                "/bi/group/dashboard",
                "/bi/group/manage"
            ],
            platformAdmin: [
                "/bi/admin",
                "/bi/admin/users",
                "/bi/admin/groups",
                "/bi/admin/ledgers"
            ]
        },
        
        countryEnforcement: {
            middleware: "checkCountryMiddleware",
            redirectPath: "/countries/select",
            cookieName: "mpesewa_country",
            localStorageKey: "bi_country_locked"
        },
        
        subscriptionEnforcement: {
            lenderPages: [
                "/bi/lender/dashboard",
                "/bi/loan/approve",
                "/bi/ledgers"
            ],
            checkFunction: "checkSubscriptionActive",
            redirectPath: "/bi/subscription/expired",
            gracePeriod: 0
        }
    },
    
    // ============================================
    // 1️⃣1️⃣ PAGE METADATA & SEO CONFIGURATION
    // ============================================
    seo: {
        defaultMeta: {
            title: "M-Pesewa Burundi - Emergency Micro-Lending Platform",
            description: "Peer-to-peer emergency lending in Burundi. Join trusted groups in your community for responsible borrowing and lending.",
            keywords: ["Burundi", "BIF", "micro-lending", "emergency loans", "Kirundi", "peer-to-peer", "inguzanyo", "gukura"]
        },
        
        pageSpecificMeta: {
            "/bi/borrower/dashboard": {
                title: "Ikibarura cyawe - Umukiranza",
                description: "Kurikirana inguzanyo zawe no kwishyura kuri M-Pesewa Burundi"
            },
            "/bi/lender/dashboard": {
                title: "Ikibarura cyawe - Ugutanga",
                description: "Kurikirana porifoliyo yawe n'inyungu kuri M-Pesewa Burundi"
            },
            "/bi/loan/apply": {
                title: "Saba inguzanyo - M-Pesewa Burundi",
                description: "Saba inguzanyo yo mu bihe byihuse muri Burundi"
            }
        },
        
        openGraph: {
            siteName: "M-Pesewa Burundi",
            locale: "fr_BI",
            country: "Burundi",
            currency: "BIF"
        },
        
        structuredData: {
            organization: {
                "@type": "FinancialService",
                "name": "M-Pesewa Burundi",
                "url": "https://mpesewa.com/bi",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "BI",
                    "addressLocality": "Bujumbura"
                }
            }
        }
    },
    
    // ============================================
    // 1️⃣2️⃣ ERROR PAGES & REDIRECTS
    // ============================================
    errorPages: {
        "404": {
            path: "/bi/404",
            title: "Icipfuko ntibonetse",
            message: "Icipfuko ushaka ntibonetse. Gerageza ukoresheje amahuza ahari.",
            actions: [
                { text: "Subira Ahabanza", url: "/bi" },
                { text: "Ongera ugerageze", url: "javascript:history.back()" },
                { text: "Twandikire", url: "/bi/contact" }
            ]
        },
        
        "403": {
            path: "/bi/403",
            title: "Ntawugere",
            message: "Ntabwo ufite uburenganzira bwo kugera kuri iyi paje. Ukeneye kwiyandikisha cyangwa guhindura urwego.",
            actions: [
                { text: "Subira Ahabanza", url: "/bi" },
                { text: "Injira", url: "/auth/login?country=BI" },
                { text: "Iyandikishe", url: "/auth/register?country=BI" }
            ]
        },
        
        "500": {
            path: "/bi/500",
            title: "Ikosa ry'umushinga",
            message: "Hari ikosa ryabaye mu mushinga. Dukora ngo dukemure ikibazo. Subira nyuma.",
            actions: [
                { text: "Subira Ahabanza", url: "/bi" },
                { text: "Gerageza Ongera", url: "javascript:location.reload()" },
                { text: "Menyesha ikibazo", url: "/bi/contact" }
            ]
        },
        
        subscriptionExpired: {
            path: "/bi/subscription/expired",
            title: "Igihe cy'iyandikisha cyarangije",
            message: "Igihe cyawe cy'iyandikisha cyarangije. Subira kwishyura kugirango ukomeze gutanga.",
            actions: [
                { text: "Subira Kwiyandikisha", url: "/bi/subscription/plans" },
                { text: "Twandikire", url: "/bi/contact" }
            ]
        },
        
        countryMismatch: {
            path: "/bi/country/mismatch",
            title: "Igihugu Ntibihuje",
            message: "Icyerekezo cyawe ntibihuje n'igihugu wiyandikishije. Ushobora gusubira mu gihugu cyawe cyangwa guhindura.",
            actions: [
                { text: "Subira mu gihugu cyanjye", url: "/countries/select" },
                { text: "Sesura Burundi", url: "/bi" }
            ]
        }
    },
    
    // ============================================
    // 1️⃣3️⃣ NAVIGATION & BREADCRUMB CONFIG
    // ============================================
    navigation: {
        mainMenu: [
            {
                label: "Ahabanza",
                path: "/bi",
                icon: "🏠"
            },
            {
                label: "Inguzanyo",
                path: "/bi/emergency",
                icon: "💰",
                children: [
                    { label: "Saba", path: "/bi/loan/apply" },
                    { label: "Kwishyura", path: "/bi/loan/repay" },
                    { label: "Kalkulateri", path: "/bi/tools/calculator" }
                ]
            },
            {
                label: "Amatsinda",
                path: "/bi/groups",
                icon: "🤝",
                children: [
                    { label: "Tangura", path: "/bi/group/create" },
                    { label: "Shakisha", path: "/bi/groups" },
                    { label: "Ubuyobozi", path: "/bi/group/dashboard" }
                ]
            },
            {
                label: "Amabwiriza",
                path: "/bi/legal",
                icon: "📜",
                children: [
                    { label: "Amategeko", path: "/bi/legal/terms" },
                    { label: "Ibyanga", path: "/bi/legal/privacy" },
                    { label: "Ubwishingizi", path: "/bi/legal/complaints" }
                ]
            },
            {
                label: "Inkunga",
                path: "/bi/help",
                icon: "❓",
                children: [
                    { label: "FAQ", path: "/bi/faq" },
                    { label: "Twandikire", path: "/bi/contact" },
                    { label: "Amakuru", path: "/bi/help" }
                ]
            }
        ],
        
        userMenu: [
            {
                label: "Ikibarura cyanjye",
                path: "/bi/dashboard",
                icon: "📊",
                role: "all"
            },
            {
                label: "Guhindura Urwego",
                path: "/bi/switch-role",
                icon: "🔄",
                role: "dual"
            },
            {
                label: "Igenamiterere",
                path: "/bi/settings",
                icon: "⚙️",
                role: "all"
            },
            {
                label: "Injira",
                path: "/auth/login?country=BI",
                icon: "🔐",
                role: "guest"
            },
            {
                label: "Sohoka",
                path: "/auth/logout?country=BI",
                icon: "🚪",
                role: "authenticated"
            }
        ],
        
        breadcrumbs: {
            enabled: true,
            separator: "›",
            homeLabel: "Ahabanza",
            showFullPath: true
        }
    },
    
    // ============================================
    // 1️⃣4️⃣ LOCALIZATION & LANGUAGE SETTINGS
    // ============================================
    localization: {
        defaultLanguage: "kirundi",
        supportedLanguages: [
            { code: "kirundi", name: "Kirundi", nativeName: "Ikirundi", direction: "ltr" },
            { code: "fr", name: "French", nativeName: "Français", direction: "ltr" },
            { code: "en", name: "English", nativeName: "English", direction: "ltr" },
            { code: "sw", name: "Swahili", nativeName: "Kiswahili", direction: "ltr" }
        ],
        
        translationFiles: {
            kirundi: "/locales/bi/kirundi.json",
            french: "/locales/bi/french.json",
            english: "/locales/bi/english.json",
            swahili: "/locales/bi/swahili.json"
        },
        
        autoDetect: true,
        fallbackLanguage: "kirundi",
        languageSwitcher: {
            position: "header",
            display: "dropdown",
            showFlags: true,
            showNames: true
        }
    },
    
    // ============================================
    // 1️⃣5️⃣ ANALYTICS & TRACKING CONFIGURATION
    // ============================================
    analytics: {
        googleAnalytics: {
            id: "UA-BI-123456-1",
            enabled: true,
            anonymizeIp: true
        },
        
        hotjar: {
            id: "1234567",
            enabled: false
        },
        
        customAnalytics: {
            enabled: true,
            endpoints: {
                pageView: "/api/bi/analytics/pageview",
                event: "/api/bi/analytics/event",
                error: "/api/bi/analytics/error"
            }
        },
        
        privacyCompliant: true,
        cookieConsentRequired: true,
        doNotTrackRespected: true
    }
};

// ============================================
// PAGE VALIDATION & ROUTING FUNCTIONS
// ============================================

const validatePageConfig = () => {
    const errors = [];
    
    // Check required pages exist
    const requiredPages = [
        BI_PAGES_CONFIG.landingPage,
        BI_PAGES_CONFIG.dashboardPages.borrowerDashboard,
        BI_PAGES_CONFIG.dashboardPages.lenderDashboard,
        BI_PAGES_CONFIG.registrationPages.borrowerRegistration,
        BI_PAGES_CONFIG.registrationPages.lenderRegistration,
        BI_PAGES_CONFIG.loanPages.applyLoan,
        BI_PAGES_CONFIG.subscriptionPages.plansOverview
    ];
    
    requiredPages.forEach((page, index) => {
        if (!page || !page.path) {
            errors.push(`Required page at index ${index} is missing or invalid`);
        }
    });
    
    // Check access control configuration
    if (!BI_PAGES_CONFIG.accessControl.publicPages.includes('/bi')) {
        errors.push("Landing page must be in public pages");
    }
    
    if (!BI_PAGES_CONFIG.accessControl.authenticatedPages.includes('/bi/borrower/dashboard')) {
        errors.push("Borrower dashboard must require authentication");
    }
    
    if (!BI_PAGES_CONFIG.accessControl.roleBasedPages.lender.includes('/bi/lender/dashboard')) {
        errors.push("Lender dashboard must be in lender pages");
    }
    
    // Check error pages
    const errorPages = Object.values(BI_PAGES_CONFIG.errorPages);
    errorPages.forEach(errorPage => {
        if (!errorPage.path || !errorPage.title || !errorPage.message) {
            errors.push("Error page configuration incomplete");
        }
    });
    
    return errors;
};

// Export pages configuration
module.exports = BI_PAGES_CONFIG;

// Export validation function
module.exports.validatePages = validatePageConfig;

// Export routing helper functions
module.exports.routing = {
    getPage: (path) => {
        // Search through all page configurations for matching path
        const allPages = [];
        
        // Add landing page
        allPages.push({ path: BI_PAGES_CONFIG.landingPage.path, config: BI_PAGES_CONFIG.landingPage });
        
        // Add dashboard pages
        Object.values(BI_PAGES_CONFIG.dashboardPages).forEach(page => {
            allPages.push({ path: page.path, config: page });
        });
        
        // Add registration pages
        Object.values(BI_PAGES_CONFIG.registrationPages).forEach(page => {
            allPages.push({ path: page.path, config: page });
        });
        
        // Find matching page
        return allPages.find(page => page.path === path);
    },
    
    checkAccess: (path, user) => {
        const page = module.exports.routing.getPage(path);
        if (!page) return { allowed: false, reason: "Page not found" };
        
        // Check if public page
        if (BI_PAGES_CONFIG.accessControl.publicPages.includes(path)) {
            return { allowed: true, reason: "Public page" };
        }
        
        // Check authentication
        if (!user || !user.authenticated) {
            return { allowed: false, reason: "Authentication required", redirect: "/auth/login?country=BI" };
        }
        
        // Check country match
        if (user.country !== 'BI') {
            return { allowed: false, reason: "Country mismatch", redirect: "/bi/country/mismatch" };
        }
        
        // Check role-based access
        const userRole = user.role;
        const rolePages = BI_PAGES_CONFIG.accessControl.roleBasedPages[userRole] || [];
        
        if (rolePages.includes(path)) {
            return { allowed: true, reason: "Role-based access granted" };
        }
        
        // Check authenticated pages
        if (BI_PAGES_CONFIG.accessControl.authenticatedPages.includes(path)) {
            return { allowed: true, reason: "Authenticated access granted" };
        }
        
        return { allowed: false, reason: "Insufficient permissions" };
    },
    
    generateBreadcrumbs: (path) => {
        const parts = path.split('/').filter(part => part);
        const breadcrumbs = [{ label: BI_PAGES_CONFIG.navigation.breadcrumbs.homeLabel, path: '/bi' }];
        
        let currentPath = '/bi';
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            currentPath += `/${part}`;
            
            // Try to find page title
            const page = module.exports.routing.getPage(currentPath);
            const label = page ? page.config.title : part.charAt(0).toUpperCase() + part.slice(1);
            
            breadcrumbs.push({ label, path: currentPath });
        }
        
        return breadcrumbs;
    },
    
    getLanguagePath: (path, language) => {
        if (language === 'kirundi') return path;
        return `/bi/${language}${path.replace('/bi', '')}`;
    }
};

// Export page initialization function
module.exports.initializePages = () => {
    const validationErrors = validatePageConfig();
    
    if (validationErrors.length > 0) {
        console.error(`❌ Burundi Pages Configuration Errors:`);
        validationErrors.forEach(error => console.error(`   - ${error}`));
        throw new Error(`Burundi pages configuration invalid: ${validationErrors.join(', ')}`);
    }
    
    console.log(`✅ Burundi Pages Initialized`);
    console.log(`   Public Pages: ${BI_PAGES_CONFIG.accessControl.publicPages.length}`);
    console.log(`   Role-based Pages: ${Object.keys(BI_PAGES_CONFIG.accessControl.roleBasedPages).length} roles`);
    console.log(`   Languages: ${BI_PAGES_CONFIG.localization.supportedLanguages.length}`);
    console.log(`   Error Pages: ${Object.keys(BI_PAGES_CONFIG.errorPages).length}`);
    
    return {
        status: 'initialized',
        country: 'Burundi',
        totalPages: Object.keys(BI_PAGES_CONFIG).reduce((count, section) => {
            if (typeof BI_PAGES_CONFIG[section] === 'object' && BI_PAGES_CONFIG[section].path) {
                return count + 1;
            }
            if (Array.isArray(BI_PAGES_CONFIG[section])) {
                return count + BI_PAGES_CONFIG[section].length;
            }
            return count;
        }, 0),
        timestamp: new Date().toISOString()
    };
};

// Auto-initialize when imported
if (require.main === module) {
    module.exports.initializePages();
}