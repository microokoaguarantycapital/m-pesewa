/**
 * M-PESEWA RWANDA PAGES CONFIGURATION
 * Country-specific pages and routing for Rwanda
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const RwandaPages = {
    // ============================================
    // 1️⃣ COUNTRY LANDING PAGE CONFIGURATION
    // ============================================
    landingPage: {
        hero: {
            title: "Urwego rwo kugurizanya mu Rwanda",
            subtitle: "M-Pesewa Rwanda - Gufungura amafaranga yo gufashanya mu gihe cy'ibiza",
            backgroundImage: "assets/images/rwanda/hero-bg.jpg",
            ctaButtons: [
                {
                    text: "Tangira Gusaba Amafaranga",
                    url: "/rw/borrower/apply",
                    role: "borrower",
                    color: "#f37021"
                },
                {
                    text: "Tangira Kuguriza",
                    url: "/rw/lender/dashboard",
                    role: "lender",
                    color: "#28a745"
                }
            ]
        },

        stats: [
            {
                value: "2,500+",
                label: "Abagurizi b'akazi",
                description: "Baturiye mu Rwanda"
            },
            {
                value: "98.7%",
                label: "Ingano yo kwishyura",
                description: "Ntawagabanije"
            },
            {
                value: "RWF 250M+",
                label: "Amafaranga yagurijwe",
                description: "Kuva mu 2024"
            },
            {
                value: "45,000+",
                label: "Abakoresha",
                description: "Baturiye mu Rwanda"
            }
        ],

        features: [
            {
                icon: "🇷🇼",
                title: "Yubatswe mu Rwanda",
                description: "Twubatse kugirango dushyigikire amategeko n'imyumvire y'u Rwanda"
            },
            {
                icon: "🤝",
                title: "Kwigizwa n'abagize itsinda",
                description: "Gurizanya gusa mu matsinda yizewe"
            },
            {
                icon: "⚡",
                title: "Amafaranga mu minsi 7",
                description: "Kwikubita ku ngingo ku gihe amafaranga akenewe"
            },
            {
                icon: "🔒",
                title: "Amakuru y'umwirondoro yakubahwe",
                description: "Amakuru yanyu arinda kandi ntashobora gusohoka mu Rwanda"
            }
        ]
    },

    // ============================================
    // 2️⃣ BORROWER PAGES CONFIGURATION
    // ============================================
    borrowerPages: {
        dashboard: {
            path: "/rw/borrower/dashboard",
            title: "Ikibaho cyawe - Umusaba amafaranga",
            sections: [
                {
                    id: "activeLoans",
                    title: "Amafaranga ushobora gusaba",
                    components: ["loanCalculator", "quickApply", "creditScore"]
                },
                {
                    id: "currentLoans",
                    title: "Amafaranga wamaze gusaba",
                    components: ["loanList", "repaymentSchedule", "penaltyCalculator"]
                },
                {
                    id: "history",
                    title: "Amakuru y'ibyakozwe",
                    components: ["transactionHistory", "ratingHistory", "groupHistory"]
                }
            ]
        },

        applyPage: {
            path: "/rw/borrower/apply",
            title: "Saba amafaranga yo gufashanya",
            steps: [
                {
                    step: 1,
                    title: "Hitamo itsinda",
                    description: "Hitamo itsinda rizwi ryiza"
                },
                {
                    step: 2,
                    title: "Hitamo umugurizi",
                    description: "Hitamo umugurizi muri iryo tsinda"
                },
                {
                    step: 3,
                    title: "Hitamo icyiciro",
                    description: "Hitamo icyiciro cy'ingorane ushaka kugeraho"
                },
                {
                    step: 4,
                    title: "Shyiramo umubare",
                    description: "Shyiramo umubare w'amafaranga usaba"
                },
                {
                    step: 5,
                    title: "Emeza gusaba",
                    description: "Reba amakuru ubanze ukomeze"
                }
            ],

            categories: [
                {
                    id: "transport",
                    name: "M-pesewa Fare",
                    icon: "🚌",
                    description: "Amafaranga yo kugenda - ntugume",
                    maxAmount: 5000,
                    examples: ["Kugenda ku kazi", "Kujya mu ishuri", "Urugendo rw'ibizamini"]
                },
                {
                    id: "data",
                    name: "M-pesewa Data",
                    icon: "📶",
                    description: "Komeza guhura n'abandi - ntuhagarike",
                    maxAmount: 3000,
                    examples: ["Gutanga ishyaka", "Kora akazi kuri interineti", "Komeza kwigishwa"]
                },
                {
                    id: "gas",
                    name: "M-pesewa Cooking Gas",
                    icon: "🔥",
                    description: "Kora ifunguro by'umwihariko - nturyame",
                    maxAmount: 8000,
                    examples: ["Kunyuza gasi", "Gura amakara", "Kwishyura amashanyarazi"]
                }
                // ... 17 more categories
            ]
        },

        calculator: {
            path: "/rw/borrower/calculator",
            title: "Kubara amafaranga",
            defaultAmount: 5000,
            currency: "RWF",
            formula: "principal + (principal * 0.10)",
            examples: [
                { amount: 1000, duration: 7, total: 1100 },
                { amount: 5000, duration: 7, total: 5500 },
                { amount: 10000, duration: 7, total: 11000 }
            ]
        }
    },

    // ============================================
    // 3️⃣ LENDER PAGES CONFIGURATION
    // ============================================
    lenderPages: {
        dashboard: {
            path: "/rw/lender/dashboard",
            title: "Ikibaho cyawe - Umugurizi",
            sections: [
                {
                    id: "portfolio",
                    title: "Ibikorwa byawe",
                    components: ["totalLent", "activeLoans", "expectedReturns"]
                },
                {
                    id: "subscription",
                    title: "Abanyamuryango",
                    components: ["currentPlan", "upgradeOptions", "expiryDate"]
                },
                {
                    id: "risk",
                    title: "Kugenzura ingaruka",
                    components: ["defaultRate", "borrowerRatings", "groupHealth"]
                }
            ]
        },

        portfolioPage: {
            path: "/rw/lender/portfolio",
            title: "Urutonde rw'abasaba",
            filters: [
                { id: "active", label: "Bakiri gukorera" },
                { id: "completed", label: "Byarangiye" },
                { id: "overdue", label: "Byarenze igihe" },
                { id: "blacklisted", label: "Bahanzwe" }
            ],

            columns: [
                { field: "borrower", label: "Umusaba", sortable: true },
                { field: "amount", label: "Umubare", sortable: true },
                { field: "issued", label: "Itariki yatanzwe", sortable: true },
                { field: "due", label: "Itariki yo kwishyura", sortable: true },
                { field: "status", label: "Imiterere", sortable: true },
                { field: "actions", label: "Ibikorwa" }
            ]
        },

        ledgerPage: {
            path: "/rw/lender/ledger/:borrowerId",
            title: "Inyandiko y'umusaba",
            fields: [
                { id: "borrowerInfo", label: "Amakuru y'umusaba", required: true },
                { id: "loanDetails", label: "Amakuru y'amafaranga", required: true },
                { id: "repaymentSchedule", label: "Igenamiterere ry'ishyura", required: true },
                { id: "guarantors", label: "Abashinjabyaha", required: true },
                { id: "notes", label: "Ibyanditswe", required: false }
            ],

            actions: [
                { id: "update", label: "Vugurura", icon: "✏️" },
                { id: "markPaid", label: "Shyira nko wishyuwe", icon: "✅" },
                { id: "addPenalty", label: "Ongeraho inyungu", icon: "⚠️" },
                { id: "rate", label: "Gereranya", icon: "⭐" }
            ]
        }
    },

    // ============================================
    // 4️⃣ GROUP PAGES CONFIGURATION
    // ============================================
    groupPages: {
        directory: {
            path: "/rw/groups",
            title: "Amatsinda muri Rwanda",
            filters: [
                { type: "family", label: "Umuryango" },
                { type: "professional", label: "Akazi" },
                { type: "business", label: "Ubucuruzi" },
                { type: "religious", label: "Idini" },
                { type: "social", label: "Imibereho" }
            ],

            sortOptions: [
                { value: "members", label: "Abagize (kuva ku menshi)" },
                { value: "repayment", label: "Ingano yo kwishyura" },
                { value: "activity", label: "Ubukoryi (kuva ku bwinshi)" },
                { value: "trust", label: "Kwigizwa (kuva ku ruhuje)" }
            ]
        },

        detailPage: {
            path: "/rw/group/:groupId",
            sections: [
                {
                    id: "overview",
                    title: "Ahabona",
                    components: ["groupStats", "memberList", "recentActivity"]
                },
                {
                    id: "lending",
                    title: "Gurizanya",
                    components: ["activeLoans", "lenderBoard", "borrowerRequests"]
                },
                {
                    id: "rules",
                    title: "Amategeko",
                    components: ["groupRules", "adminInfo", "invitationPolicy"]
                }
            ],

            stats: [
                { key: "totalMembers", label: "Abagize" },
                { key: "activeLenders", label: "Abagurizi b'akazi" },
                { key: "totalLent", label: "Amafaranga yagurijwe" },
                { key: "repaymentRate", label: "Ingano yo kwishyura" },
                { key: "defaultRate", label: "Ingano yo kutishyura" }
            ]
        },

        createPage: {
            path: "/rw/group/create",
            title: "Fungura itsinda rishya",
            steps: [
                {
                    step: 1,
                    title: "Shyiramo amakuru y'itsinda",
                    fields: ["name", "type", "description", "location"]
                },
                {
                    step: 2,
                    title: "Shyiramo amategeko",
                    fields: ["minLoan", "maxLoan", "interestRate", "repaymentPeriod"]
                },
                {
                    step: 3,
                    title: "Shyiramo uburyo bwo kwemerera",
                    fields: ["invitationOnly", "referralRequired", "approvalProcess"]
                },
                {
                    step: 4,
                    title: "Tangiza abagize 5",
                    fields: ["members", "sendInvitations"]
                }
            ],

            validation: {
                minMembers: 5,
                maxMembers: 1000,
                nameMinLength: 3,
                nameMaxLength: 50
            }
        }
    },

    // ============================================
    // 5️⃣ EMERGENCY HUB PAGES
    // ============================================
    emergencyHub: {
        mainPage: {
            path: "/rw/emergency",
            title: "Ikigo cy'ingorane - M-Pesewa Rwanda",
            categories: [
                {
                    group: "Ibikenewe buri munsi",
                    items: [
                        { name: "M-pesewa Fare", path: "/rw/emergency/fare" },
                        { name: "M-pesewa Data", path: "/rw/emergency/data" },
                        { name: "M-pesewa Cooking Gas", path: "/rw/emergency/gas" },
                        { name: "M-pesewa Food", path: "/rw/emergency/food" }
                    ]
                },
                {
                    group: "Gutunganya no gukora",
                    items: [
                        { name: "M-pesewa Fuel", path: "/rw/emergency/fuel" },
                        { name: "M-pesewa Repair", path: "/rw/emergency/repair" },
                        { name: "M-pesewa Credo", path: "/rw/emergency/credo" }
                    ]
                },
                {
                    group: "Ubucuruzi no Kongera",
                    items: [
                        { name: "M-Pesa Daily Sales", path: "/rw/emergency/sales" },
                        { name: "Working Capital", path: "/rw/emergency/capital" },
                        { name: "M-Pesewa Soko Loan", path: "/rw/emergency/soko" }
                    ]
                },
                {
                    group: "Ubuzima n'Amashuri",
                    items: [
                        { name: "M-pesewa Medicine", path: "/rw/emergency/medicine" },
                        { name: "School Fees", path: "/rw/emergency/school" },
                        { name: "M-pesewa Advance", path: "/rw/emergency/advance" }
                    ]
                }
            ]
        },

        categoryPage: {
            template: "/rw/emergency/:category",
            components: [
                "categoryHeader",
                "loanCalculator",
                "lenderDirectory",
                "successStories",
                "applyButton"
            ],

            successStories: [
                {
                    name: "Mama Jimmy",
                    story: "Yasabye amafaranga 1,200 yo kunyuza gasi isoze mu gihe yari ariteka. Yishyuye nyuma y'iminsi 7 afite inyungu ya 10%.",
                    location: "Kigali",
                    category: "gas"
                },
                {
                    name: "John Kimani",
                    story: "Yasabye amafaranga 250 yo kugenda mu kazi yari agiye gusaba. Yishyuye nyuma y'igihe yaranatangiye akazi.",
                    location: "Kigali",
                    category: "fare"
                }
            ]
        }
    },

    // ============================================
    // 6️⃣ SUBSCRIPTION PAGES
    // ============================================
    subscriptionPages: {
        plansPage: {
            path: "/rw/subscription/plans",
            title: "Amabwiriza y'ubanyamuryango - M-Pesewa Rwanda",
            tiers: [
                {
                    name: "Basic",
                    price: "RWF 50 / ukwezi",
                    features: [
                        "Kuguriza kugeza kuri RWF 1,500 mu cyumweru",
                        "Ntugenzuzwe CRB",
                        "Inyandiko nto",
                        "Gushaka mu matsinda"
                    ],
                    cta: "Hitamo Basic"
                },
                {
                    name: "Premium",
                    price: "RWF 250 / ukwezi",
                    features: [
                        "Kuguriza kugeza kuri RWF 5,000 mu cyumweru",
                        "Ntugenzuzwe CRB",
                        "Inyandiko nziza",
                        "Kubona ibyerekeye umusaba"
                    ],
                    cta: "Hitamo Premium",
                    popular: true
                },
                {
                    name: "Super",
                    price: "RWF 1,000 / ukwezi",
                    features: [
                        "Kuguriza kugeza kuri RWF 20,000 mu cyumweru",
                        "Genzura CRB bisabwa",
                        "Inyandiko nziza cyane",
                        "Gufasha ku ngaruka"
                    ],
                    cta: "Hitamo Super"
                }
            ],

            billingPeriods: [
                { id: "monthly", label: "Ukwezi ku kwezi", discount: 0 },
                { id: "biAnnual", label: "Iminsi 6", discount: 0.15 },
                { id: "annual", label: "Umwaka", discount: 0.25 }
            ]
        },

        paymentPage: {
            path: "/rw/subscription/pay",
            title: "Kwishyura ubanyamuryango",
            methods: [
                {
                    id: "mtn",
                    name: "MTN Mobile Money",
                    icon: "📱",
                    instructions: "Koresha *182# cyangwa porogaramu ya MTN"
                },
                {
                    id: "airtel",
                    name: "Airtel Money",
                    icon: "📲",
                    instructions: "Koresha *182# cyangwa porogaramu ya Airtel"
                },
                {
                    id: "bank",
                    name: "Konti ya Banki",
                    icon: "🏦",
                    instructions: "Koresha konti ya Banki BK: 0012345678"
                }
            ],

            confirmation: {
                email: true,
                sms: true,
                inApp: true,
                receipt: true
            }
        },

        statusPage: {
            path: "/rw/subscription/status",
            title: "Imiterere y'ubanyamuryango",
            components: [
                "currentPlan",
                "expiryDate",
                "paymentHistory",
                "upgradeOptions",
                "cancelOption"
            ],

            expiryWarningDays: [7, 3, 1],
            autoRenewal: true
        }
    },

    // ============================================
    // 7️⃣ ADMIN & MODERATION PAGES
    // ============================================
    adminPages: {
        dashboard: {
            path: "/rw/admin/dashboard",
            title: "Ikibaho cy'Umuyobozi - M-Pesewa Rwanda",
            restricted: true,
            role: "admin",

            metrics: [
                { id: "totalUsers", label: "Abakoresha", type: "number" },
                { id: "activeLoans", label: "Amafaranga akora", type: "number" },
                { id: "repaymentRate", label: "Ingano yo kwishyura", type: "percentage" },
                { id: "revenue", label: "Amafaranga yinjijwe", type: "currency" },
                { id: "defaultRate", label: "Ingano yo kutishyura", type: "percentage" },
                { id: "avgLoanSize", label: "Umurambararo w'ama faranga", type: "currency" }
            ],

            actions: [
                { id: "overrideLedger", label: "Hindura inyandiko", icon: "✏️" },
                { id: "removeBlacklist", label: "Kuraho ubuhanzi", icon: "✅" },
                { id: "validateCollector", label: "Emeza umushoramari", icon: "👮" },
                { id: "generateReport", label: "Kora raporo", icon: "📊" }
            ]
        },

        userManagement: {
            path: "/rw/admin/users",
            title: "Gucunga abakoresha",
            filters: [
                { field: "role", options: ["borrower", "lender", "both"] },
                { field: "status", options: ["active", "suspended", "blacklisted"] },
                { field: "group", options: "dynamic" },
                { field: "location", options: "dynamic" }
            ],

            bulkActions: [
                { id: "suspend", label: "Hagarika", confirm: true },
                { id: "activate", label: "Koresha", confirm: false },
                { id: "export", label: "Soza", confirm: false },
                { id: "message", label: "Ohereza ubutumwa", confirm: false }
            ]
        },

        ledgerManagement: {
            path: "/rw/admin/ledgers",
            title: "Gucunga inyandiko",
            overrideRules: {
                allowed: true,
                auditRequired: true,
                reasonRequired: true,
                maxOverrideAmount: 50000
            },

            disputeResolution: {
                mediation: true,
                arbitration: true,
                appealPeriod: 7 // days
            }
        }
    },

    // ============================================
    // 8️⃣ STATIC PAGES (About, Contact, etc.)
    // ============================================
    staticPages: {
        about: {
            path: "/rw/about",
            title: "Ibyerekeye M-Pesewa Rwanda",
            sections: [
                {
                    title: "Intangiriro",
                    content: "M-Pesewa Rwanda yashizweho mu 2023 nk'urwego rwo gufasha abanyarwanda guhangana n'ingorane z'amafaranga mu gihe gito."
                },
                {
                    title: "Viziyo",
                    content: "Gushyigikira amategeko y'u Rwanda, kuzana serivisi z'amafaranga mu buryo bwizewe, no guteza imbere umuryango."
                },
                {
                    title: "Icyerekezo",
                    content: "Kuba urwego rubanziriza mu gufungura amafaranga mu Rwanda, gufasha abantu 100,000 mu myaka 3."
                }
            ],

            team: [
                { name: "John M. Rwema", role: "Umuyobozi Mukuru", bio: "Afite imyaka 15 mu by'amafaranga" },
                { name: "Marie A. Uwera", role: "Umuyobozi w'Ibyemezo", bio: "Umwarimu w'amategeko y'amafaranga" },
                { name: "Eric N. Uwimana", role: "Umuyobozi w'Ubucuruzi", bio: "Umuhanga mu by'ubukungu" }
            ]
        },

        contact: {
            path: "/rw/contact",
            title: "Twandikire - M-Pesewa Rwanda",
            channels: [
                {
                    type: "phone",
                    value: "+250 791 590 801",
                    hours: "8:00 - 18:00 (Mon-Fri)"
                },
                {
                    type: "email",
                    value: "support.rw@mpesewa.com",
                    response: "Mu masaha 24"
                },
                {
                    type: "whatsapp",
                    value: "+250 791 590 801",
                    hours: "24/7"
                },
                {
                    type: "address",
                    value: "Kigali Heights, KG 7 Ave, Kigali",
                    hours: "9:00 - 17:00 (Mon-Fri)"
                }
            ],

            departments: [
                { name: "Customer Support", email: "support.rw@mpesewa.com" },
                { name: "Compliance", email: "compliance.rw@mpesewa.com" },
                { name: "Partnerships", email: "partners.rw@mpesewa.com" },
                { name: "Media", email: "media.rw@mpesewa.com" }
            ]
        },

        faq: {
            path: "/rw/faq",
            title: "Ibibazo Byinshi - M-Pesewa Rwanda",
            categories: [
                {
                    name: "Gusaba amafaranga",
                    questions: [
                        {
                            q: "Ni iki cyatumye mbasaba amafaranga?",
                            a: "Ushobora gusaba amafaranga mu matsinda 4 gusa, kandi uba ufite imyitwarire myiza."
                        },
                        {
                            q: "Nshobora gusaba amafaranga angahe?",
                            a: "Ushobora gusaba kugeza kuri RWF 50,000, bitewe n'icyiciro cyawe n'imyitwarire."
                        }
                    ]
                },
                {
                    name: "Kuguriza",
                    questions: [
                        {
                            q: "Nshobora kuguriza angahe?",
                            a: "Bitewe n'icyiciro cyawe: Basic (RWF 1,500), Premium (RWF 5,000), Super (RWF 20,000)."
                        },
                        {
                            q: "Ni iki kibanziriza kuguriza?",
                            a: "Kwishyura ubanyamuryango bifatika, kandi byishyuwe kuri 28 z'ukwezi."
                        }
                    ]
                }
            ]
        }
    },

    // ============================================
    // 9️⃣ ROUTING CONFIGURATION
    // ============================================
    routing: {
        basePath: "/rw",
        defaultRoute: "/rw",
        authRequiredRoutes: [
            "/rw/borrower/*",
            "/rw/lender/*",
            "/rw/group/*",
            "/rw/subscription/*",
            "/rw/admin/*"
        ],

        publicRoutes: [
            "/rw",
            "/rw/about",
            "/rw/contact",
            "/rw/faq",
            "/rw/emergency"
        ],

        redirects: {
            "/rw/home": "/rw",
            "/rw/dashboard": "/rw/borrower/dashboard",
            "/rw/apply": "/rw/borrower/apply"
        }
    },

    // ============================================
    // 🔟 PAGE TEMPLATES & COMPONENTS
    // ============================================
    templates: {
        layout: {
            header: "components/rw/header.html",
            footer: "components/rw/footer.html",
            sidebar: "components/rw/sidebar.html",
            styles: "css/rw/styles.css"
        },

        components: {
            loanCard: "templates/rw/loan-card.html",
            userProfile: "templates/rw/user-profile.html",
            groupCard: "templates/rw/group-card.html",
            emergencyCategory: "templates/rw/emergency-category.html"
        }
    },

    // ============================================
    // 1️⃣1️⃣ VALIDATION & ERROR HANDLING
    // ============================================
    validation: {
        pageAccess: function(user, path) {
            // Check if user has access to page
            if (this.routing.publicRoutes.includes(path)) return true;
            
            // Check auth required routes
            if (!user) return false;
            
            // Check role-based access
            const userRole = user.role;
            const pathPrefix = path.split('/')[2]; // /rw/[prefix]/...
            
            switch(pathPrefix) {
                case 'borrower':
                    return userRole === 'borrower' || userRole === 'both';
                case 'lender':
                    return userRole === 'lender' || userRole === 'both';
                case 'admin':
                    return userRole === 'admin';
                default:
                    return true;
            }
        },

        validatePageParams: function(page, params) {
            const validations = {
                'group/:groupId': {
                    groupId: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
                },
                'emergency/:category': {
                    category: /^[a-z_]+$/
                }
            };
            
            return validations[page] ? 
                Object.keys(validations[page]).every(key => validations[page][key].test(params[key])) :
                true;
        }
    },

    // ============================================
    // 1️⃣2️⃣ INITIALIZATION & LOADING
    // ============================================
    init: function() {
        console.log('Rwanda Pages Module Initialized');
        
        // Set page language
        if (typeof document !== 'undefined') {
            document.documentElement.lang = 'rw';
        }
        
        // Store current country in localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('mpesewa_current_country', 'RW');
        }
        
        return this;
    },

    // ============================================
    // 1️⃣3️⃣ VERSION & METADATA
    // ============================================
    version: {
        major: 1,
        minor: 0,
        patch: 0,
        build: '20240124',
        
        getVersion: function() {
            return `${this.major}.${this.minor}.${this.patch}`;
        }
    }
};

// Initialize module
RwandaPages.init();

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RwandaPages;
} else if (typeof window !== 'undefined') {
    window.RwandaPages = RwandaPages;
}

// Auto-load for browser
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we're on Rwanda pages
        const path = window.location.pathname;
        if (path.startsWith('/rw')) {
            console.log('Loading Rwanda-specific pages configuration');
            
            // Set page title if on Rwanda landing
            if (path === '/rw' || path === '/rw/') {
                document.title = RwandaPages.landingPage.hero.title;
            }
        }
    });
}