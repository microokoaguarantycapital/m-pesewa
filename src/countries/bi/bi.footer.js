/**
 * BURUNDI (BI) - Footer Configuration Module
 * Country-specific footer with legal, contact, and regulatory information
 * Enforces country isolation in all footer elements
 */

const BI_FOOTER_CONFIG = {
    // ============================================
    // 1️⃣ FOOTER STRUCTURE & HIERARCHY
    // ============================================
    structure: {
        layout: "6-column-grid",
        background: "#1f2a37", // Neutral dark slate (different from header)
        textColor: "#ffffff",
        accentColor: "#00A1DE", // Burundi blue
        maxWidth: "1200px",
        responsiveBreakpoints: {
            desktop: 1024,
            tablet: 768,
            mobile: 480
        }
    },
    
    // ============================================
    // 2️⃣ FOOTER COLUMNS (6-COLUMN FINTECH LAYOUT)
    // ============================================
    columns: [
        {
            id: "borrowing",
            title: "Gukira Inguzanyo",
            titleColor: "#ffffff",
            titleWeight: "bold",
            links: [
                {
                    text: "Saba Inguzanyo yo mu bihe byihuse",
                    url: "/bi/loan/apply",
                    icon: "🚨",
                    description: "Saba inguzanyo mu minsi 7 gusa"
                },
                {
                    text: "Inguzanyo ya Perezida",
                    url: "/bi/loan/apply?type=personal",
                    icon: "👤",
                    description: "Inguzanyo y'ikirenga"
                },
                {
                    text: "Inguzanyo y'ubucuruzi",
                    url: "/bi/loan/apply?type=business",
                    icon: "🏢",
                    description: "Amafaranga y'ubucuruzi"
                },
                {
                    text: "Uburyo bwo Gusaba",
                    url: "/bi/how-it-works",
                    icon: "📋",
                    description: "Menya uko bikora"
                },
                {
                    text: "Abakira Inguzanyo",
                    url: "/bi/community/borrowers",
                    icon: "👥",
                    description: "Reba abandi bakira inguzanyo"
                }
            ],
            columnWidth: "180px",
            sortOrder: 1
        },
        {
            id: "lending",
            title: "Gutanga",
            titleColor: "#ffffff",
            titleWeight: "bold",
            links: [
                {
                    text: "Uburyo bwo Gutanga",
                    url: "/bi/lender/how-to-lend",
                    icon: "💡",
                    description: "Menya uko utanga"
                },
                {
                    text: "Impamvu yo Gutanga kuri M-Pesewa",
                    url: "/bi/lender/why-lend",
                    icon: "✅",
                    description: "Ibyiza byo gutanga"
                },
                {
                    text: "Amahitamo yo Gutanga",
                    url: "/bi/lender/rules",
                    icon: "📊",
                    description: "Amabwiriza yo gutanga"
                },
                {
                    text: "Abatanga",
                    url: "/bi/community/lenders",
                    icon: "💰",
                    description: "Reba abandi batanga"
                },
                {
                    text: "Kwishyura Kwiyandikisha",
                    url: "/bi/subscription/plans",
                    icon: "📋",
                    description: "Amahitamo yo kwiyandikisha"
                }
            ],
            columnWidth: "180px",
            sortOrder: 2
        },
        {
            id: "platform",
            title: "Uko Bikora",
            titleColor: "#ffffff",
            titleWeight: "bold",
            links: [
                {
                    text: "Uko Gutanga Gukora",
                    url: "/bi/how-it-works",
                    icon: "🔄",
                    description: "Uburyo P2P bikora"
                },
                {
                    text: "Umurongo wacu",
                    url: "/bi/about#our-role",
                    icon: "🎯",
                    description: "Icyo dukora"
                },
                {
                    text: "Kwiyandikisha",
                    url: "/bi/subscription/plans",
                    icon: "📋",
                    description: "Amahitamo yo kwiyandikisha"
                },
                {
                    text: "Urutonde rw'Abatishyuye",
                    url: "/bi/blacklist",
                    icon: "⚖️",
                    description: "Abatishyuye inguzanyo"
                },
                {
                    text: "Abakusanya Inguzanyo",
                    url: "/bi/collectors",
                    icon: "👮",
                    description: "Abakusanya inguzanyo"
                }
            ],
            columnWidth: "180px",
            sortOrder: 3
        },
        {
            id: "company",
            title: "Twerekeye",
            titleColor: "#ffffff",
            titleWeight: "bold",
            links: [
                {
                    text: "Twerekeye M-Pesewa",
                    url: "/bi/about",
                    icon: "🏢",
                    description: "Amakuru yacu"
                },
                {
                    text: "Itsinda n'Inama",
                    url: "/bi/about#team",
                    icon: "👥",
                    description: "Abantu bacu"
                },
                {
                    text: "Amakuru n'Akazil",
                    url: "/bi/news",
                    icon: "📰",
                    description: "Amakuru mashya"
                },
                {
                    text: "Blog / FAQ",
                    url: "/bi/faq",
                    icon: "📚",
                    description: "Ibibazo n'ibisubizo"
                },
                {
                    text: "Twandikire",
                    url: "/bi/contact",
                    icon: "📧",
                    description: "Tubwire ikibazo cyawe"
                }
            ],
            columnWidth: "180px",
            sortOrder: 4
        },
        {
            id: "legal",
            title: "Amategeko",
            titleColor: "#ffffff",
            titleWeight: "bold",
            links: [
                {
                    text: "Amategeko n'Amabwiriza",
                    url: "/bi/legal/terms",
                    icon: "📜",
                    description: "Amategeko yose"
                },
                {
                    text: "Politiki y'Ibyanga",
                    url: "/bi/legal/privacy",
                    icon: "🔒",
                    description: "Uko dukoresha amakuru yawe"
                },
                {
                    text: "Ubwishingizi",
                    url: "/bi/legal/complaints",
                    icon: "⚖️",
                    description: "Uburyo bwo gutakamba"
                },
                {
                    text: "Amabwiriza yo gukora",
                    url: "/bi/legal/fair-practices",
                    icon: "✅",
                    description: "Amabwiriza yacu"
                },
                {
                    text: "Raporo y'Ubwishingizi",
                    url: "/bi/reports/security",
                    icon: "🛡️",
                    description: "Umutekano wacu"
                }
            ],
            columnWidth: "180px",
            sortOrder: 5
        },
        {
            id: "partners",
            title: "Abafatanyabikorwa",
            titleColor: "#ffffff",
            titleWeight: "bold",
            links: [
                {
                    text: "Uburyo bwo kuba Umufatanyabikorwa",
                    url: "/bi/partners",
                    icon: "🤝",
                    description: "Fatanya natwe"
                },
                {
                    text: "Abafatanyabikorwa",
                    url: "/bi/partners/list",
                    icon: "🏢",
                    description: "Ibigo byacu"
                },
                {
                    text: "Gutanga Serivisi",
                    url: "/bi/partners/services",
                    icon: "🛠️",
                    description: "Serivisi zacu"
                }
            ],
            columnWidth: "180px",
            sortOrder: 6,
            socialMedia: {
                enabled: true,
                platforms: [
                    {
                        name: "Facebook",
                        icon: "📘",
                        url: "https://facebook.com/mpesewa.burundi",
                        color: "#1877F2"
                    },
                    {
                        name: "Twitter",
                        icon: "🐦",
                        url: "https://twitter.com/mpesewa_bi",
                        color: "#1DA1F2"
                    },
                    {
                        name: "YouTube",
                        icon: "📺",
                        url: "https://youtube.com/@mpesewaburundi",
                        color: "#FF0000"
                    },
                    {
                        name: "Instagram",
                        icon: "📸",
                        url: "https://instagram.com/mpesewa.burundi",
                        color: "#E4405F"
                    },
                    {
                        name: "LinkedIn",
                        icon: "💼",
                        url: "https://linkedin.com/company/mpesewa-burundi",
                        color: "#0A66C2"
                    }
                ]
            }
        }
    ],
    
    // ============================================
    // 3️⃣ COUNTRY TICKER CONFIGURATION
    // ============================================
    countryTicker: {
        enabled: true,
        position: "above-footer-bottom",
        background: "#111827",
        textColor: "#ffffff",
        speed: "25s",
        direction: "left",
        countries: [
            {
                name: "Burundi",
                flag: "🇧🇮",
                currency: "BIF",
                code: "BI",
                emphasized: true
            },
            {
                name: "Kenya",
                flag: "🇰🇪",
                currency: "KSh",
                code: "KE"
            },
            {
                name: "Uganda",
                flag: "🇺🇬",
                currency: "UGX",
                code: "UG"
            },
            {
                name: "Tanzania",
                flag: "🇹🇿",
                currency: "TZS",
                code: "TZ"
            },
            {
                name: "Rwanda",
                flag: "🇷🇼",
                currency: "RWF",
                code: "RW"
            },
            {
                name: "DRC",
                flag: "🇨🇩",
                currency: "CDF",
                code: "CD"
            },
            {
                name: "South Sudan",
                flag: "🇸🇸",
                currency: "SSP",
                code: "SS"
            },
            {
                name: "South Africa",
                flag: "🇿🇦",
                currency: "ZAR",
                code: "ZA"
            },
            {
                name: "Nigeria",
                flag: "🇳🇬",
                currency: "NGN",
                code: "NG"
            },
            {
                name: "Ghana",
                flag: "🇬🇭",
                currency: "GHS",
                code: "GH"
            },
            {
                name: "Ethiopia",
                flag: "🇪🇹",
                currency: "ETB",
                code: "ET"
            },
            {
                name: "Somalia",
                flag: "🇸🇴",
                currency: "SOS",
                code: "SO"
            }
        ],
        separator: "•",
        message: "M-Pesewa ikorera mu bihugu 12 bya Afurika y'Iburasirazuba:",
        continuous: true
    },
    
    // ============================================
    // 4️⃣ FOOTER BOTTOM SECTION
    // ============================================
    bottomSection: {
        background: "#0f172a",
        borderTop: "1px solid #334155",
        padding: {
            top: "20px",
            bottom: "20px",
            sides: "40px"
        },
        
        copyright: {
            text: "© 2016–2026, M-Pesewa Burundi (Technology Pvt. Ltd.) — Amahugu Yose Yarengeranyijwe",
            color: "#d1d5db",
            fontSize: "14px",
            includeCountry: true,
            includeYearRange: true,
            includeRights: true
        },
        
        countryContacts: {
            enabled: true,
            title: "Twandikire mu gihugu:",
            titleColor: "#ffffff",
            contacts: [
                {
                    country: "Burundi",
                    phone: "+257 79 000 000",
                    email: "info.bi@mpesewa.com",
                    emphasize: true
                },
                {
                    country: "Kenya",
                    phone: "+254 709 219 000",
                    email: "info.ke@mpesewa.com"
                },
                {
                    country: "Uganda",
                    phone: "+256 392 175 546",
                    email: "info.ug@mpesewa.com"
                },
                {
                    country: "Tanzania",
                    phone: "+255 659 073 010",
                    email: "info.tz@mpesewa.com"
                },
                {
                    country: "Rwanda",
                    phone: "+250 791 590 801",
                    email: "info.rw@mpesewa.com"
                },
                {
                    country: "DRC",
                    phone: "+243 81 000 0000",
                    email: "info.cd@mpesewa.com"
                },
                {
                    country: "Nigeria",
                    phone: "+234 800 000 0000",
                    email: "info.ng@mpesewa.com"
                },
                {
                    country: "Ghana",
                    phone: "+233 24 000 0000",
                    email: "info.gh@mpesewa.com"
                },
                {
                    country: "South Africa",
                    phone: "+27 11 000 0000",
                    email: "info.za@mpesewa.com"
                },
                {
                    country: "South Sudan",
                    phone: "+211 955 000 000",
                    email: "info.ss@mpesewa.com"
                },
                {
                    country: "Somalia",
                    phone: "+252 63 0000000",
                    email: "info.so@mpesewa.com"
                },
                {
                    country: "Ethiopia",
                    phone: "+251 11 000 0000",
                    email: "info.et@mpesewa.com"
                }
            ],
            displayFormat: "inline",
            maxVisible: 3,
            showMoreText: "Reba Byose",
            collapseOnMobile: true
        },
        
        legalLinks: {
            enabled: true,
            links: [
                {
                    text: "Sitemap",
                    url: "/bi/sitemap",
                    description: "Amahuza yose"
                },
                {
                    text: "Kugera",
                    url: "/bi/accessibility",
                    description: "Kugera ku bantu bose"
                },
                {
                    text: "Umutekano",
                    url: "/bi/security",
                    description: "Amabwiriza y'umutekano"
                },
                {
                    text: "Rapora Ikibazo",
                    url: "/bi/report",
                    description: "Tubwire ikibazo"
                },
                {
                    text: "Cookies",
                    url: "/bi/cookies",
                    description: "Politiki y'amategeko"
                }
            ],
            separator: "|",
            color: "#94a3b8",
            hoverColor: "#00A1DE"
        },
        
        regulatoryBadges: {
            enabled: true,
            badges: [
                {
                    name: "Bank of the Republic of Burundi",
                    logo: "/assets/images/regulatory/brb-logo.png",
                    url: "https://www.brb.bi",
                    description: "Licensed Microfinance Institution"
                },
                {
                    name: "Data Protection Compliant",
                    logo: "/assets/images/regulatory/data-protection.png",
                    url: "/bi/legal/privacy",
                    description: "Law No. 1/07 of 2018"
                },
                {
                    name: "SSL Secured",
                    logo: "/assets/images/regulatory/ssl-secured.png",
                    url: "/bi/security",
                    description: "256-bit Encryption"
                }
            ],
            display: "horizontal",
            size: "small"
        }
    },
    
    // ============================================
    // 5️⃣ LANGUAGE & REGIONAL SETTINGS
    // ============================================
    language: {
        default: "kirundi",
        available: ["kirundi", "french", "english", "swahili"],
        switchEnabled: true,
        switchPosition: "bottom-right",
        
        translations: {
            kirundi: {
                borrowing: "Gukira Inguzanyo",
                lending: "Gutanga",
                platform: "Uko Bikora",
                company: "Twerekeye",
                legal: "Amategeko",
                partners: "Abafatanyabikorwa"
            },
            french: {
                borrowing: "Emprunter",
                lending: "Prêter",
                platform: "Comment ça marche",
                company: "À propos",
                legal: "Légal",
                partners: "Partenaires"
            },
            english: {
                borrowing: "Borrowing",
                lending: "Lending",
                platform: "How It Works",
                company: "About Us",
                legal: "Legal",
                partners: "Partners"
            },
            swahili: {
                borrowing: "Kukopa",
                lending: "Kukopesha",
                platform: "Jinsi Inavyofanya Kazi",
                company: "Kuhusu Sisi",
                legal: "Kisheria",
                partners: "Washirika"
            }
        }
    },
    
    // ============================================
    // 6️⃣ NEWSLETTER SUBSCRIPTION
    // ============================================
    newsletter: {
        enabled: true,
        position: "above-columns",
        title: "Kwakira Amakuru",
        subtitle: "Shyiramo imeyili yawe kwakira amakuru mashya ku M-Pesewa Burundi",
        placeholder: "Shyiramo imeyili yawe",
        buttonText: "Iyandikishe",
        successMessage: "Murakoze! Mwiyandikishije amakuru.",
        errorMessage: "Hari ikosa. Ongera ugerageze.",
        privacyText: "Turakunda politiki y'ibanga. Ntituzagera imeyili.",
        privacyUrl: "/bi/legal/privacy",
        
        topics: [
            "Amakuru mashya",
            "Amahitamo mashya",
            "Ibyiza by'inguzanyo",
            "Amabwiriza mashya",
            "Inama n'ubufasha"
        ],
        
        frequency: "weekly",
        doubleOptIn: true,
        confirmationEmail: true
    },
    
    // ============================================
    // 7️⃣ BUSINESS HOURS & SUPPORT INFORMATION
    // ============================================
    businessHours: {
        enabled: true,
        title: "Igihe cy'akazi",
        hours: [
            {
                day: "Kuwa mbere - Kuwa gatanu",
                time: "08:00 - 17:00",
                timezone: "CAT"
            },
            {
                day: "Kuwa mbere - Kuwa gatanu",
                service: "Inkunga",
                time: "08:00 - 20:00",
                timezone: "CAT"
            },
            {
                day: "Ku cyumweru",
                time: "Ferme",
                note: "Inkunga bwa message"
            }
        ],
        
        emergencySupport: {
            phone: "+257 79 111 111",
            available: "24/7",
            for: "Emergency loan issues only"
        },
        
        holidaySchedule: {
            enabled: true,
            holidays: [
                "2024-01-01: Umunsi mukuru",
                "2024-05-01: Umunsi w'akazi",
                "2024-07-01: Umunsi w'ubwigenge",
                "2024-12-25: Noheli"
            ],
            notice: "Tuzahagarara ku munsi mukuru. Subira iminsi ibiri mbere."
        }
    },
    
    // ============================================
    // 8️⃣ APP DOWNLOAD LINKS
    // ============================================
    appDownloads: {
        enabled: true,
        title: "Download App",
        subtitle: "Kura App ya M-Pesewa kuri telefoni yawe",
        
        android: {
            enabled: true,
            url: "https://play.google.com/store/apps/details?id=com.mpesewa.burundi",
            icon: "🤖",
            badge: "Google Play",
            minVersion: "8.0"
        },
        
        ios: {
            enabled: true,
            url: "https://apps.apple.com/app/mpesewa-burundi/id123456789",
            icon: "🍎",
            badge: "App Store",
            minVersion: "13.0"
        },
        
        huawei: {
            enabled: true,
            url: "https://appgallery.huawei.com/app/C123456789",
            icon: "🇨🇳",
            badge: "AppGallery",
            minVersion: "8.0"
        },
        
        pwa: {
            enabled: true,
            text: "Gukoresha kuri Web",
            icon: "🌐",
            instructions: "Kanda 'Share' hanyuma 'Add to Home Screen'"
        }
    },
    
    // ============================================
    // 9️⃣ PAYMENT METHODS & SECURITY BADGES
    // ============================================
    paymentMethods: {
        enabled: true,
        title: "Uburyo bwo Kwishyura",
        methods: [
            {
                name: "Mobile Money",
                providers: ["Lumitel", "Econet Leo"],
                icons: ["📱", "💳"],
                supported: ["subscriptions", "repayments"]
            },
            {
                name: "Bank Transfer",
                banks: ["BRB", "BCB", "Interbank"],
                icons: ["🏦"],
                supported: ["subscriptions", "large-transactions"]
            },
            {
                name: "Cash",
                locations: ["Bujumbura Office"],
                icons: ["💵"],
                supported: ["subscriptions", "repayments"],
                appointmentRequired: true
            }
        ],
        
        securitySeals: [
            {
                name: "SSL Secured",
                icon: "🔒",
                description: "256-bit encryption"
            },
            {
                name: "PCI Compliant",
                icon: "💳",
                description: "Payment security"
            },
            {
                name: "GDPR Ready",
                icon: "🇪🇺",
                description: "Data protection"
            }
        ]
    },
    
    // ============================================
    // 🔟 ACCESSIBILITY FEATURES
    // ============================================
    accessibility: {
        enabled: true,
        features: [
            {
                name: "Screen Reader",
                description: "Kuvugwa n'ijwi",
                icon: "👁️",
                shortcut: "Alt+1"
            },
            {
                name: "High Contrast",
                description: "Ibiranga byirabura",
                icon: "🎨",
                shortcut: "Alt+2"
            },
            {
                name: "Text Size",
                description: "Kwagura inyandiko",
                icon: "🔍",
                shortcut: "Alt+3"
            },
            {
                name: "Keyboard",
                description: "Gukoresha keyboard",
                icon: "⌨️",
                shortcut: "Alt+4"
            }
        ],
        
        compliance: {
            wcag: "2.1 AA",
            tested: "2024-03-15",
            report: "/bi/accessibility/report",
            feedback: "/bi/feedback/accessibility"
        },
        
        languageSupport: {
            screenReader: ["kirundi", "french", "english"],
            signLanguage: false,
            braille: false
        }
    },
    
    // ============================================
    // 1️⃣1️⃣ GEO-TARGETING & COUNTRY ENFORCEMENT
    // ============================================
    geoTargeting: {
        enabled: true,
        targetCountry: "BI",
        ipDetection: true,
        redirectIfWrongCountry: true,
        
        allowedCountries: ["BI"], // Only Burundi
        blockedCountries: [], // None specifically blocked
        
        vpnDetection: {
            enabled: true,
            action: "warn",
            message: "VPN ikoreshwa. Reba ko uri muri Burundi."
        },
        
        languageAutoSelect: {
            enabled: true,
            basedOn: ["ip", "browser", "user-preference"],
            fallback: "kirundi"
        }
    },
    
    // ============================================
    // 1️⃣2️⃣ ANALYTICS & TRACKING
    // ============================================
    analytics: {
        googleAnalytics: {
            id: "UA-BI-FOOTER-123",
            events: {
                footerClick: true,
                newsletterSignup: true,
                appDownload: true,
                languageSwitch: true
            }
        },
        
        heatmaps: {
            enabled: true,
            provider: "Hotjar",
            id: "BI-FOOTER-456"
        },
        
        privacyCompliant: true,
        cookieConsent: true,
        doNotTrack: true
    },
    
    // ============================================
    // 1️⃣3️⃣ FOOTER SCRIPTS & FUNCTIONALITY
    // ============================================
    scripts: {
        newsletterForm: {
            validation: true,
            ajaxSubmit: true,
            successRedirect: false,
            confirmationEmail: true
        },
        
        languageSwitcher: {
            persistChoice: true,
            cookieName: "mpesewa_bi_language",
            localStorageFallback: true
        },
        
        backToTop: {
            enabled: true,
            threshold: 300,
            speed: 500,
            position: "bottom-right"
        },
        
        printFooter: {
            enabled: true,
            excludeElements: ["newsletter", "country-ticker"],
            includeContactInfo: true
        }
    },
    
    // ============================================
    // 1️⃣4️⃣ VERSION & UPDATE INFORMATION
    // ============================================
    version: {
        footerVersion: "3.2.0-BI",
        lastUpdated: "2024-03-15",
        changeLog: [
            "Added Kirundi translations",
            "Updated regulatory badges",
            "Improved mobile responsiveness",
            "Added accessibility features"
        ],
        
        autoUpdate: {
            enabled: true,
            checkInterval: 24, // hours
            forceUpdate: false
        },
        
        compatibility: {
            minBrowser: "Chrome 80, Firefox 75, Safari 14",
            ieSupport: false,
            mobileOptimized: true
        }
    },
    
    // ============================================
    // 1️⃣5️⃣ CUSTOMIZATION & BRANDING
    // ============================================
    branding: {
        logo: {
            enabled: true,
            url: "/assets/images/logos/mpesewa-bi-footer.png",
            alt: "M-Pesewa Burundi",
            width: "120px",
            link: "/bi"
        },
        
        colors: {
            primary: "#003366",
            secondary: "#00A1DE",
            accent: "#CE1126",
            text: "#ffffff",
            background: "#1f2a37",
            links: "#d1d5db",
            hover: "#00A1DE"
        },
        
        typography: {
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            lineHeight: "1.6",
            headingFont: "'Poppins', sans-serif"
        },
        
        animations: {
            hoverEffects: true,
            transitionSpeed: "0.3s",
            scrollEffects: true
        }
    }
};

// ============================================
// FOOTER VALIDATION & COMPLIANCE CHECK
// ============================================

const validateFooterConfig = () => {
    const errors = [];
    
    // Check structure
    if (!BI_FOOTER_CONFIG.structure.layout) {
        errors.push("Footer layout missing");
    }
    
    if (!BI_FOOTER_CONFIG.structure.background) {
        errors.push("Footer background color missing");
    }
    
    // Check required columns
    const requiredColumns = ["borrowing", "lending", "platform", "company", "legal"];
    const columnIds = BI_FOOTER_CONFIG.columns.map(col => col.id);
    
    requiredColumns.forEach(col => {
        if (!columnIds.includes(col)) {
            errors.push(`Required column '${col}' missing`);
        }
    });
    
    // Check country ticker
    if (!BI_FOOTER_CONFIG.countryTicker.enabled) {
        errors.push("Country ticker must be enabled");
    }
    
    if (!BI_FOOTER_CONFIG.countryTicker.countries || BI_FOOTER_CONFIG.countryTicker.countries.length === 0) {
        errors.push("Country ticker countries missing");
    }
    
    // Check legal requirements
    if (!BI_FOOTER_CONFIG.bottomSection.copyright.text) {
        errors.push("Copyright text missing");
    }
    
    if (!BI_FOOTER_CONFIG.bottomSection.countryContacts.enabled) {
        errors.push("Country contacts must be enabled");
    }
    
    // Check language support
    if (!BI_FOOTER_CONFIG.language.default) {
        errors.push("Default language missing");
    }
    
    if (!BI_FOOTER_CONFIG.language.available || BI_FOOTER_CONFIG.language.available.length === 0) {
        errors.push("Available languages missing");
    }
    
    // Check regulatory compliance
    if (!BI_FOOTER_CONFIG.bottomSection.regulatoryBadges.enabled) {
        errors.push("Regulatory badges must be enabled");
    }
    
    return errors;
};

// Export footer configuration
module.exports = BI_FOOTER_CONFIG;

// Export validation function
module.exports.validateFooter = validateFooterConfig;

// Export helper functions for rendering
module.exports.helpers = {
    renderColumns: () => {
        const columns = BI_FOOTER_CONFIG.columns.sort((a, b) => a.sortOrder - b.sortOrder);
        return columns.map(col => ({
            id: col.id,
            title: col.title,
            links: col.links.map(link => ({
                text: link.text,
                url: link.url,
                icon: link.icon,
                description: link.description
            })),
            socialMedia: col.socialMedia,
            width: col.columnWidth
        }));
    },
    
    renderCountryTicker: () => {
        if (!BI_FOOTER_CONFIG.countryTicker.enabled) return null;
        
        const countries = BI_FOOTER_CONFIG.countryTicker.countries;
        const separator = BI_FOOTER_CONFIG.countryTicker.separator;
        
        const tickerItems = countries.map(country => {
            const display = country.emphasized ? 
                `**${country.flag} ${country.name}**` : 
                `${country.flag} ${country.name}`;
            return display;
        });
        
        const tickerText = [
            BI_FOOTER_CONFIG.countryTicker.message,
            ...tickerItems
        ].join(` ${separator} `);
        
        return {
            text: tickerText,
            countries: countries.length,
            direction: BI_FOOTER_CONFIG.countryTicker.direction,
            speed: BI_FOOTER_CONFIG.countryTicker.speed
        };
    },
    
    renderBottomSection: (userCountry = 'BI') => {
        const contacts = BI_FOOTER_CONFIG.bottomSection.countryContacts.contacts;
        const userCountryContact = contacts.find(c => c.country.toLowerCase() === userCountry.toLowerCase());
        
        return {
            copyright: BI_FOOTER_CONFIG.bottomSection.copyright.text,
            contacts: {
                userCountry: userCountryContact,
                allContacts: contacts,
                displayFormat: BI_FOOTER_CONFIG.bottomSection.countryContacts.displayFormat
            },
            legalLinks: BI_FOOTER_CONFIG.bottomSection.legalLinks.links.map(link => ({
                text: link.text,
                url: link.url
            })),
            regulatoryBadges: BI_FOOTER_CONFIG.bottomSection.regulatoryBadges.badges
        };
    },
    
    getLanguageText: (language, key) => {
        const translations = BI_FOOTER_CONFIG.language.translations[language];
        return translations ? translations[key] : BI_FOOTER_CONFIG.language.translations.kirundi[key];
    },
    
    checkGeoTargeting: (ipInfo) => {
        const targetCountry = BI_FOOTER_CONFIG.geoTargeting.targetCountry;
        
        if (!ipInfo || !ipInfo.country) {
            return {
                allowed: true,
                reason: "IP detection failed",
                country: null
            };
        }
        
        const isAllowed = ipInfo.country === targetCountry;
        
        return {
            allowed: isAllowed,
            reason: isAllowed ? "Country allowed" : "Country not allowed",
            country: ipInfo.country,
            targetCountry: targetCountry,
            redirect: !isAllowed && BI_FOOTER_CONFIG.geoTargeting.redirectIfWrongCountry
        };
    },
    
    generateNewsletterPayload: (email, preferences = {}) => {
        return {
            email: email,
            country: 'BI',
            language: preferences.language || BI_FOOTER_CONFIG.language.default,
            topics: preferences.topics || BI_FOOTER_CONFIG.newsletter.topics,
            timestamp: new Date().toISOString(),
            doubleOptIn: BI_FOOTER_CONFIG.newsletter.doubleOptIn,
            source: 'footer'
        };
    },
    
    getAppDownloadLinks: () => {
        const downloads = {};
        
        if (BI_FOOTER_CONFIG.appDownloads.android.enabled) {
            downloads.android = {
                url: BI_FOOTER_CONFIG.appDownloads.android.url,
                badge: BI_FOOTER_CONFIG.appDownloads.android.badge,
                minVersion: BI_FOOTER_CONFIG.appDownloads.android.minVersion
            };
        }
        
        if (BI_FOOTER_CONFIG.appDownloads.ios.enabled) {
            downloads.ios = {
                url: BI_FOOTER_CONFIG.appDownloads.ios.url,
                badge: BI_FOOTER_CONFIG.appDownloads.ios.badge,
                minVersion: BI_FOOTER_CONFIG.appDownloads.ios.minVersion
            };
        }
        
        if (BI_FOOTER_CONFIG.appDownloads.huawei.enabled) {
            downloads.huawei = {
                url: BI_FOOTER_CONFIG.appDownloads.huawei.url,
                badge: BI_FOOTER_CONFIG.appDownloads.huawei.badge,
                minVersion: BI_FOOTER_CONFIG.appDownloads.huawei.minVersion
            };
        }
        
        if (BI_FOOTER_CONFIG.appDownloads.pwa.enabled) {
            downloads.pwa = {
                instructions: BI_FOOTER_CONFIG.appDownloads.pwa.instructions
            };
        }
        
        return downloads;
    }
};

// Export initialization function
module.exports.initializeFooter = () => {
    const validationErrors = validateFooterConfig();
    
    if (validationErrors.length > 0) {
        console.error(`❌ Burundi Footer Configuration Errors:`);
        validationErrors.forEach(error => console.error(`   - ${error}`));
        throw new Error(`Burundi footer configuration invalid: ${validationErrors.join(', ')}`);
    }
    
    console.log(`✅ Burundi Footer Initialized`);
    console.log(`   Columns: ${BI_FOOTER_CONFIG.columns.length}`);
    console.log(`   Countries in Ticker: ${BI_FOOTER_CONFIG.countryTicker.countries.length}`);
    console.log(`   Languages: ${BI_FOOTER_CONFIG.language.available.length}`);
    console.log(`   Version: ${BI_FOOTER_CONFIG.version.footerVersion}`);
    
    return {
        status: 'initialized',
        country: 'Burundi',
        columns: BI_FOOTER_CONFIG.columns.length,
        languages: BI_FOOTER_CONFIG.language.available,
        timestamp: new Date().toISOString(),
        validationChecksum: Buffer.from(JSON.stringify(BI_FOOTER_CONFIG)).toString('base64').slice(0, 32)
    };
};

// Auto-initialize when imported
if (require.main === module) {
    module.exports.initializeFooter();
}