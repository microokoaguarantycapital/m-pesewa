/**
 * M-PESEWA - South Sudan Footer Configuration
 * STRICT HIERARCHY: Global → Country → Footer
 * 
 * South Sudan Footer Configuration File
 * This file contains all footer configurations for South Sudan
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const SOUTH_SUDAN_FOOTER = {
    // ============================================
    // 1️⃣ FOOTER STRUCTURE & HIERARCHY
    // ============================================
    structure: {
        // Main Footer Sections
        sections: [
            {
                id: "borrowing_ss",
                title: "Borrowing in South Sudan",
                columns: 1,
                position: 1,
                countrySpecific: true
            },
            {
                id: "lending_ss",
                title: "Lending in South Sudan",
                columns: 1,
                position: 2,
                countrySpecific: true
            },
            {
                id: "platform_ss",
                title: "How It Works",
                columns: 1,
                position: 3
            },
            {
                id: "company_ss",
                title: "M-Pesewa South Sudan",
                columns: 1,
                position: 4,
                countrySpecific: true
            },
            {
                id: "legal_ss",
                title: "Legal & Compliance",
                columns: 1,
                position: 5,
                countrySpecific: true
            },
            {
                id: "partners_ss",
                title: "Partners",
                columns: 1,
                position: 6
            }
        ],

        // Footer Layout
        layout: {
            type: "6-column-responsive",
            breakpoints: {
                desktop: 6,
                tablet: 3,
                mobile: 2
            },
            spacing: {
                columnGap: "40px",
                rowGap: "30px"
            }
        },

        // Footer Levels
        levels: {
            level1: "Main Navigation",
            level2: "Country Specific",
            level3: "Legal & Contact",
            level4: "Bottom Bar"
        }
    },

    // ============================================
    // 2️⃣ FOOTER CONTENT - SOUTH SUDAN SPECIFIC
    // ============================================
    content: {
        // Section 1: Borrowing in South Sudan
        borrowing: {
            title: "Borrowing in South Sudan",
            links: [
                {
                    text: "Get Emergency Loan",
                    url: "/countries/south-sudan/borrower/apply.html",
                    description: "Quick loans for urgent needs",
                    icon: "🚨"
                },
                {
                    text: "Personal Loans",
                    url: "/countries/south-sudan/borrower/personal-loans.html",
                    description: "For individuals in South Sudan",
                    icon: "👤"
                },
                {
                    text: "Business Loans",
                    url: "/countries/south-sudan/borrower/business-loans.html",
                    description: "For South Sudanese businesses",
                    icon: "🏪"
                },
                {
                    text: "How to Apply",
                    url: "/countries/south-sudan/how-to-apply.html",
                    description: "Step-by-step guide",
                    icon: "📝"
                },
                {
                    text: "Active Borrowers",
                    url: "/countries/south-sudan/community/borrowers.html",
                    description: "See who's borrowing",
                    icon: "👥"
                },
                {
                    text: "Loan Calculator",
                    url: "/countries/south-sudan/calculators/loan.html",
                    description: "Calculate repayments in SSP",
                    icon: "🧮"
                }
            ],
            countryNote: "All loans in South Sudanese Pounds (SSP)"
        },

        // Section 2: Lending in South Sudan
        lending: {
            title: "Lending in South Sudan",
            links: [
                {
                    text: "Smart Lending",
                    url: "/countries/south-sudan/lender/smart-lending.html",
                    description: "Best practices for lenders",
                    icon: "💡"
                },
                {
                    text: "Why Lend in South Sudan",
                    url: "/countries/south-sudan/lender/why-lend.html",
                    description: "Opportunities in South Sudan",
                    icon: "🇸🇸"
                },
                {
                    text: "How to Lend",
                    url: "/countries/south-sudan/lender/how-to-lend.html",
                    description: "Getting started guide",
                    icon: "📚"
                },
                {
                    text: "Active Lenders",
                    url: "/countries/south-sudan/community/lenders.html",
                    description: "See who's lending",
                    icon: "💰"
                },
                {
                    text: "Subscription Plans",
                    url: "/countries/south-sudan/subscription.html",
                    description: "Pricing for South Sudan",
                    icon: "📋"
                },
                {
                    text: "Lender Dashboard",
                    url: "/countries/south-sudan/lender/dashboard.html",
                    description: "Manage your lending",
                    icon: "📊",
                    requiresAuth: true
                }
            ],
            countryNote: "Lender subscriptions required"
        },

        // Section 3: How It Works
        platform: {
            title: "How It Works",
            links: [
                {
                    text: "P2P Lending Explained",
                    url: "/countries/south-sudan/how-it-works/p2p.html",
                    description: "Peer-to-peer lending basics",
                    icon: "🔄"
                },
                {
                    text: "Our Role",
                    url: "/countries/south-sudan/how-it-works/our-role.html",
                    description: "What we do and don't do",
                    icon: "🏢"
                },
                {
                    text: "Subscriptions",
                    url: "/countries/south-sudan/subscription.html",
                    description: "How we make money",
                    icon: "💳"
                },
                {
                    text: "Blacklist System",
                    url: "/countries/south-sudan/blacklist.html",
                    description: "Defaulters registry",
                    icon: "🚫"
                },
                {
                    text: "Debt Collectors",
                    url: "/countries/south-sudan/debt-collectors.html",
                    description: "Vetted agencies in South Sudan",
                    icon: "📞"
                },
                {
                    text: "Trust & Safety",
                    url: "/countries/south-sudan/trust-safety.html",
                    description: "How we keep you safe",
                    icon: "🛡️"
                }
            ]
        },

        // Section 4: M-Pesewa South Sudan
        company: {
            title: "M-Pesewa South Sudan",
            links: [
                {
                    text: "About M-Pesewa",
                    url: "/countries/south-sudan/about.html",
                    description: "Our mission and vision",
                    icon: "🎯"
                },
                {
                    text: "South Sudan Team",
                    url: "/countries/south-sudan/team.html",
                    description: "Meet our local team",
                    icon: "👨‍💼"
                },
                {
                    text: "Careers in South Sudan",
                    url: "/countries/south-sudan/careers.html",
                    description: "Join our team",
                    icon: "💼"
                },
                {
                    text: "News & Updates",
                    url: "/countries/south-sudan/news.html",
                    description: "Latest from South Sudan",
                    icon: "📰"
                },
                {
                    text: "Blog & FAQs",
                    url: "/countries/south-sudan/blog.html",
                    description: "Helpful articles",
                    icon: "📖"
                },
                {
                    text: "Contact Us",
                    url: "/countries/south-sudan/contact.html",
                    description: "Get in touch",
                    icon: "📞"
                }
            ],
            countrySpecific: [
                {
                    text: "South Sudan Regulations",
                    url: "/countries/south-sudan/regulations.html",
                    description: "Local compliance"
                },
                {
                    text: "Economic Impact",
                    url: "/countries/south-sudan/impact.html",
                    description: "Our contribution to South Sudan"
                }
            ]
        },

        // Section 5: Legal & Compliance
        legal: {
            title: "Legal & Compliance",
            links: [
                {
                    text: "Terms & Conditions",
                    url: "/countries/south-sudan/terms.html",
                    description: "South Sudan specific terms",
                    icon: "📜"
                },
                {
                    text: "Privacy Policy",
                    url: "/countries/south-sudan/privacy.html",
                    description: "How we protect your data",
                    icon: "🔒"
                },
                {
                    text: "Grievance Redressal",
                    url: "/countries/south-sudan/grievance.html",
                    description: "Complaint resolution",
                    icon: "⚖️"
                },
                {
                    text: "Fair Practices Code",
                    url: "/countries/south-sudan/fair-practices.html",
                    description: "Our commitment to fairness",
                    icon: "✅"
                },
                {
                    text: "AML Policy",
                    url: "/countries/south-sudan/aml.html",
                    description: "Anti-money laundering",
                    icon: "💰"
                },
                {
                    text: "Regulatory Disclosures",
                    url: "/countries/south-sudan/disclosures.html",
                    description: "Bank of South Sudan compliance",
                    icon: "🏛️"
                }
            ],
            regulatory: {
                body: "Bank of South Sudan",
                license: "P2P-LEND-SS-2024-001",
                contact: "compliance@mpesewa.com"
            }
        },

        // Section 6: Partners
        partners: {
            title: "Partners",
            links: [
                {
                    text: "Become a Partner",
                    url: "/countries/south-sudan/partners/become-partner.html",
                    description: "Partner with us",
                    icon: "🤝"
                },
                {
                    text: "Existing Partners",
                    url: "/countries/south-sudan/partners/list.html",
                    description: "Our partners in South Sudan",
                    icon: "🏢"
                },
                {
                    text: "API Documentation",
                    url: "/countries/south-sudan/developers/api.html",
                    description: "For developers",
                    icon: "🔧"
                },
                {
                    text: "Affiliate Program",
                    url: "/countries/south-sudan/affiliate.html",
                    description: "Earn with us",
                    icon: "💸"
                }
            ],
            social: {
                title: "Follow Us",
                links: [
                    { platform: "Facebook", url: "#", icon: "📘" },
                    { platform: "Twitter", url: "#", icon: "🐦" },
                    { platform: "LinkedIn", url: "#", icon: "💼" },
                    { platform: "YouTube", url: "#", icon: "📺" },
                    { platform: "Instagram", url: "#", icon: "📸" }
                ]
            }
        }
    },

    // ============================================
    // 3️⃣ COUNTRY-SPECIFIC ELEMENTS
    // ============================================
    countrySpecific: {
        // Flag & National Identity
        nationalIdentity: {
            flag: "🇸🇸",
            countryName: "South Sudan",
            localName: "جنوب السودان",
            motto: "Justice, Liberty, Prosperity"
        },

        // Currency Information
        currency: {
            code: "SSP",
            symbol: "£",
            name: "South Sudanese Pound",
            format: "£{amount} SSP",
            decimalPlaces: 2
        },

        // Language Support
        languages: [
            {
                code: "en",
                name: "English",
                isDefault: true,
                footerTranslation: "Available"
            },
            {
                code: "ar",
                name: "Arabic",
                isDefault: false,
                footerTranslation: "Partial"
            },
            {
                code: "din",
                name: "Dinka",
                isDefault: false,
                footerTranslation: "Planned"
            }
        ],

        // Local Holidays
        holidays: [
            {
                name: "Independence Day",
                date: "July 9",
                effect: "Offices closed"
            },
            {
                name: "Peace Agreement Day",
                date: "August 30",
                effect: "Reduced support"
            }
        ],

        // Regional Information
        regions: [
            {
                name: "Central Equatoria",
                capital: "Juba",
                supportCenter: true
            },
            {
                name: "Western Bahr el Ghazal",
                capital: "Wau",
                supportCenter: true
            },
            {
                name: "Upper Nile",
                capital: "Malakal",
                supportCenter: true
            },
            {
                name: "Eastern Equatoria",
                capital: "Torit",
                supportCenter: false
            }
        ]
    },

    // ============================================
    // 4️⃣ CONTACT INFORMATION - SOUTH SUDAN
    // ============================================
    contact: {
        // Physical Addresses
        addresses: [
            {
                type: "Headquarters",
                address: "Plot 123, Juba City Center, Juba, South Sudan",
                coordinates: "4.859363, 31.571251",
                hours: "08:00-18:00, Monday-Saturday",
                services: ["All services", "Training", "Dispute resolution"]
            },
            {
                type: "Regional Office",
                address: "Market Street, Wau Town, Western Bahr el Ghazal",
                coordinates: "7.700000, 27.983330",
                hours: "09:00-17:00, Monday-Friday",
                services: ["Registrations", "Support", "Collections"]
            },
            {
                type: "Service Center",
                address: "Nile Road, Malakal, Upper Nile State",
                coordinates: "9.533420, 31.660480",
                hours: "09:00-16:00, Monday-Friday",
                services: ["Basic services", "Support"]
            }
        ],

        // Contact Numbers
        phones: [
            {
                type: "Customer Support",
                number: "+211 955 000 000",
                hours: "08:00-20:00 daily",
                languages: ["English", "Arabic"]
            },
            {
                type: "WhatsApp Support",
                number: "+211 955 000 003",
                hours: "08:00-20:00 daily",
                features: ["Quick support", "Document sharing"]
            },
            {
                type: "Emergency",
                number: "+211 955 000 999",
                hours: "24/7",
                for: ["Technical emergencies", "Security issues"]
            }
        ],

        // Email Addresses
        emails: [
            {
                department: "General Support",
                address: "support@mpesewa.com",
                responseTime: "Within 24 hours"
            },
            {
                department: "Compliance",
                address: "compliance@mpesewa.com",
                responseTime: "Within 48 hours"
            },
            {
                department: "Business Development",
                address: "business@mpesewa.com",
                responseTime: "Within 72 hours"
            },
            {
                department: "Legal",
                address: "legal@mpesewa.com",
                responseTime: "Within 48 hours"
            }
        ],

        // Social Media
        socialMedia: {
            platforms: [
                {
                    name: "Facebook",
                    handle: "@mpesewasouthsudan",
                    url: "https://facebook.com/mpesewasouthsudan",
                    icon: "📘"
                },
                {
                    name: "Twitter",
                    handle: "@mpesewa_ss",
                    url: "https://twitter.com/mpesewa_ss",
                    icon: "🐦"
                },
                {
                    name: "LinkedIn",
                    handle: "M-Pesewa South Sudan",
                    url: "https://linkedin.com/company/mpesewa-south-sudan",
                    icon: "💼"
                },
                {
                    name: "YouTube",
                    handle: "M-Pesewa South Sudan",
                    url: "https://youtube.com/c/mpesewasouthsudan",
                    icon: "📺"
                }
            ],
            postingSchedule: "Daily updates, business hours"
        }
    },

    // ============================================
    // 5️⃣ FOOTER STYLING & DESIGN
    // ============================================
    styling: {
        // Color Scheme
        colors: {
            background: "#1f2a37", // Dark slate
            text: "#ffffff",
            links: "#d1d5db",
            hover: "#0099ff",
            accent: "#003366",
            borders: "#374151"
        },

        // Typography
        typography: {
            fontFamily: "'Inter', sans-serif",
            fontSize: {
                titles: "15px",
                links: "14px",
                small: "12px"
            },
            fontWeight: {
                titles: "600",
                links: "400"
            },
            lineHeight: "1.6"
        },

        // Layout & Spacing
        layout: {
            padding: {
                top: "60px",
                bottom: "30px",
                sides: "40px"
            },
            margin: {
                betweenSections: "32px",
                betweenLinks: "8px"
            },
            maxWidth: "1200px"
        },

        // Responsive Design
        responsive: {
            breakpoints: {
                mobile: "768px",
                tablet: "1024px",
                desktop: "1200px"
            },
            columns: {
                mobile: 2,
                tablet: 3,
                desktop: 6
            },
            stacking: "vertical-on-mobile"
        },

        // Animations & Effects
        animations: {
            linkHover: "color 0.3s ease",
            sectionToggle: "max-height 0.3s ease",
            countryTicker: "scroll-left 25s linear infinite"
        }
    },

    // ============================================
    // 6️⃣ COUNTRY TICKER CONFIGURATION
    // ============================================
    countryTicker: {
        enabled: true,
        position: "above-footer-bottom",
        content: [
            "🇸🇸 South Sudan • ",
            "🇰🇪 Kenya • ",
            "🇺🇬 Uganda • ",
            "🇹🇿 Tanzania • ",
            "🇷🇼 Rwanda • ",
            "🇧🇮 Burundi • ",
            "🇨🇩 DRC • ",
            "🇳🇬 Nigeria • ",
            "🇬🇭 Ghana • ",
            "🇿🇦 South Africa • ",
            "🇸🇸 Ethiopia • ",
            "🇸🇴 Somalia"
        ],
        animation: {
            direction: "left-to-right",
            speed: "25s",
            continuous: true,
            pauseOnHover: true
        },
        styling: {
            background: "#111827",
            textColor: "#ffffff",
            fontSize: "13px",
            padding: "12px 0"
        }
    },

    // ============================================
    // 7️⃣ BOTTOM BAR CONFIGURATION
    // ============================================
    bottomBar: {
        // Left Section: Copyright
        copyright: {
            text: "© 2016–2026, M-Pesewa.com (Technology Pvt. Ltd.) — All Rights Reserved",
            includeCountry: true,
            countryName: "South Sudan"
        },

        // Middle Section: Country Contacts
        countryContacts: {
            enabled: true,
            title: "Contact by Country:",
            contacts: [
                {
                    country: "South Sudan",
                    phone: "+211 955 000 000",
                    email: "support@mpesewa.com"
                },
                {
                    country: "Kenya",
                    phone: "+254 709 219 000",
                    email: "support.ke@mpesewa.com"
                },
                {
                    country: "Uganda",
                    phone: "+256 392 175 546",
                    email: "support.ug@mpesewa.com"
                }
            ],
            displayFormat: "compact", // compact | expanded
            showAll: false // Show all or just current country
        },

        // Right Section: Legal Links
        legalLinks: {
            links: [
                { text: "Sitemap", url: "/sitemap.html" },
                { text: "Accessibility", url: "/accessibility.html" },
                { text: "Security", url: "/security.html" },
                { text: "Report Issue", url: "/report.html" }
            ],
            separator: " | "
        },

        // Styling
        styling: {
            background: "#111827",
            textColor: "#9ca3af",
            fontSize: "12px",
            padding: "20px 0",
            borderTop: "1px solid #374151"
        }
    },

    // ============================================
    // 8️⃣ FOOTER FUNCTIONALITY
    // ============================================
    functionality: {
        // Navigation Features
        navigation: {
            smoothScroll: true,
            backToTop: true,
            printFooter: true,
            keyboardNavigation: true
        },

        // Dynamic Content
        dynamicContent: {
            userSpecific: true,
            roleBased: true,
            locationBased: true,
            languageBased: true
        },

        // Performance
        performance: {
            lazyLoad: true,
            cacheFooter: true,
            minify: true,
            asyncLoad: true
        },

        // Analytics
        analytics: {
            trackClicks: true,
          trackConversions: true,
          eventCategories: ["footer_navigation", "footer_contact", "footer_social"]
        }
    },

    // ============================================
    // 9️⃣ ACCESSIBILITY FEATURES
    // ============================================
    accessibility: {
        // ARIA Labels
        ariaLabels: {
            footer: "Main Footer Navigation",
            sections: {
                borrowing: "Borrowing in South Sudan section",
                lending: "Lending in South Sudan section",
                platform: "How It Works section",
                company: "M-Pesewa South Sudan section",
                legal: "Legal and Compliance section",
                partners: "Partners section"
            },
            countryTicker: "African countries where M-Pesewa operates",
            bottomBar: "Footer bottom bar with copyright and legal links"
        },

        // Keyboard Navigation
        keyboardNav: {
            tabIndex: 0,
            focusOutline: true,
            skipToContent: true,
            focusTraps: false
        },

        // Screen Reader Support
        screenReader: {
            hiddenText: {
                externalLink: "(opens in new tab)",
                phoneNumber: "(call)",
                email: "(email)"
            },
            announceChanges: true,
            liveRegions: false
        },

        // Color Contrast
        contrast: {
            textBackground: "4.5:1",
            linkBackground: "3:1",
            activeStates: "3:1",
            compliant: true
        }
    },

    // ============================================
    // 🔟 FOOTER METADATA & VERSIONING
    // ============================================
    metadata: {
        version: "1.0.0",
        lastUpdated: "2024-01-24",
        author: "M-Pesewa Frontend Team",
        country: "South Sudan",
        language: "English",

        // Dependencies
        dependencies: {
            css: ["main.css", "footer.css", "responsive.css"],
            js: ["footer.js", "analytics.js"],
            icons: ["font-awesome", "country-flags"]
        },

        // Browser Support
        browserSupport: {
            chrome: "60+",
            firefox: "55+",
            safari: "11+",
            edge: "79+",
            mobile: "iOS 11+, Android 7+"
        },

        // Performance Metrics
        performance: {
            loadTime: "< 100ms",
            size: "< 50KB",
            requests: "< 5"
        }
    }
};

// ============================================
// EXPORT FOOTER CONFIGURATION
// ============================================

// Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SOUTH_SUDAN_FOOTER;
}

// Export for ES6 Modules
if (typeof exports !== 'undefined') {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SOUTH_SUDAN_FOOTER;
}

// Export for browser global
if (typeof window !== 'undefined') {
    window.MPesewaFooter = window.MPesewaFooter || {};
    window.MPesewaFooter.SouthSudan = SOUTH_SUDAN_FOOTER;
}

// ============================================
// FOOTER RENDERING FUNCTIONS
// ============================================

/**
 * Render complete footer for South Sudan
 * @param {Object} options - Rendering options
 * @returns {Object} Rendered footer configuration
 */
function renderFooter(options = {}) {
    const {
        user = null,
        currentPage = null,
        language = 'en',
        includeTicker = true,
        includeBottomBar = true
    } = options;

    const footer = {
        structure: SOUTH_SUDAN_FOOTER.structure,
        content: {},
        styling: SOUTH_SUDAN_FOOTER.styling,
        countrySpecific: SOUTH_SUDAN_FOOTER.countrySpecific,
        accessibility: SOUTH_SUDAN_FOOTER.accessibility
    };

    // Generate content for each section
    footer.content.borrowing = generateSectionContent('borrowing', user);
    footer.content.lending = generateSectionContent('lending', user);
    footer.content.platform = generateSectionContent('platform', user);
    footer.content.company = generateSectionContent('company', user);
    footer.content.legal = generateSectionContent('legal', user);
    footer.content.partners = generateSectionContent('partners', user);

    // Add contact information
    footer.contact = SOUTH_SUDAN_FOOTER.contact;

    // Add country ticker if enabled
    if (includeTicker && SOUTH_SUDAN_FOOTER.countryTicker.enabled) {
        footer.countryTicker = generateCountryTicker();
    }

    // Add bottom bar if enabled
    if (includeBottomBar) {
        footer.bottomBar = generateBottomBar();
    }

    // Add user-specific adjustments
    if (user) {
        footer.userSpecific = applyUserSpecificAdjustments(footer, user);
    }

    // Add current page context
    if (currentPage) {
        footer.currentPage = currentPage;
        footer.breadcrumb = generateFooterBreadcrumb(currentPage);
    }

    return footer;
}

/**
 * Generate content for a specific section
 * @param {string} sectionId - Section identifier
 * @param {Object} user - User object
 * @returns {Object} Section content
 */
function generateSectionContent(sectionId, user = null) {
    const section = SOUTH_SUDAN_FOOTER.content[sectionId];
    if (!section) return null;

    const content = {
        title: section.title,
        links: [...section.links],
        countryNote: section.countryNote || null
    };

    // Apply user-specific adjustments
    if (user) {
        content.links = content.links.filter(link => {
            // Filter based on authentication requirements
            if (link.requiresAuth && !user.authenticated) {
                return false;
            }
            
            // Filter based on user role
            if (link.requiresRole && user.role !== link.requiresRole) {
                return false;
            }
            
            return true;
        });

        // Add user-specific links
        if (sectionId === 'lending' && user.role === 'LENDER') {
            content.links.push({
                text: "My Portfolio",
                url: `/countries/south-sudan/lender/portfolio.html?user=${user.id}`,
                description: "View your lending portfolio",
                icon: "📊",
                requiresAuth: true
            });
        }
    }

    return content;
}

/**
 * Generate country ticker content
 * @returns {Object} Country ticker configuration
 */
function generateCountryTicker() {
    const tickerConfig = SOUTH_SUDAN_FOOTER.countryTicker;
    
    return {
        content: tickerConfig.content.join(''),
        animation: tickerConfig.animation,
        styling: tickerConfig.styling,
        ariaLabel: "African countries where M-Pesewa operates"
    };
}

/**
 * Generate bottom bar content
 * @returns {Object} Bottom bar configuration
 */
function generateBottomBar() {
    const bottomBarConfig = SOUTH_SUDAN_FOOTER.bottomBar;
    
    return {
        copyright: {
            text: bottomBarConfig.copyright.text,
            country: bottomBarConfig.copyright.includeCountry ? 
                ` | ${bottomBarConfig.copyright.countryName} Edition` : ''
        },
        contacts: generateCountryContacts(),
        legalLinks: bottomBarConfig.legalLinks,
        styling: bottomBarConfig.styling
    };
}

/**
 * Generate country contacts for bottom bar
 * @returns {Array} Country contacts
 */
function generateCountryContacts() {
    const contactsConfig = SOUTH_SUDAN_FOOTER.bottomBar.countryContacts;
    
    if (contactsConfig.showAll) {
        return contactsConfig.contacts;
    }
    
    // Show only current country (South Sudan)
    return contactsConfig.contacts.filter(contact => 
        contact.country === 'South Sudan'
    );
}

/**
 * Apply user-specific adjustments to footer
 * @param {Object} footer - Footer configuration
 * @param {Object} user - User object
 * @returns {Object} Adjusted footer
 */
function applyUserSpecificAdjustments(footer, user) {
    const adjustments = {
        showDashboardLinks: user.authenticated,
        showSubscriptionInfo: user.role === 'LENDER',
        showGroupLinks: user.groups && user.groups.length > 0,
        personalizedGreeting: user.name ? `Hello, ${user.name}` : null
    };

    // Add quick access based on user role
    if (user.role === 'LENDER') {
        footer.quickAccess = [
            { text: "New Loan", url: "/lender/new-loan" },
            { text: "My Ledgers", url: "/lender/ledgers" },
            { text: "Subscription", url: "/subscription" }
        ];
    } else if (user.role === 'BORROWER') {
        footer.quickAccess = [
            { text: "Apply for Loan", url: "/borrower/apply" },
            { text: "Repayment", url: "/borrower/repay" },
            { text: "My Groups", url: "/borrower/groups" }
        ];
    }

    return adjustments;
}

/**
 * Generate breadcrumb for footer context
 * @param {string} currentPage - Current page identifier
 * @returns {Array} Breadcrumb trail
 */
function generateFooterBreadcrumb(currentPage) {
    const breadcrumb = [
        { text: "Home", url: "/countries/south-sudan" },
        { text: "South Sudan", url: "/countries/south-sudan" }
    ];

    // Add page-specific breadcrumb
    if (currentPage.includes('emergency')) {
        breadcrumb.push({ text: "Emergency Hub", url: "/countries/south-sudan/emergency" });
    } else if (currentPage.includes('lender')) {
        breadcrumb.push({ text: "Lenders", url: "/countries/south-sudan/lender" });
    } else if (currentPage.includes('borrower')) {
        breadcrumb.push({ text: "Borrowers", url: "/countries/south-sudan/borrower" });
    }

    return breadcrumb;
}

/**
 * Generate HTML for footer
 * @param {Object} footerConfig - Footer configuration
 * @returns {string} HTML string
 */
function generateFooterHtml(footerConfig) {
    if (!footerConfig) {
        footerConfig = renderFooter();
    }

    let html = `
        <footer class="mp-footer ss-footer" role="contentinfo" aria-label="Main Footer">
            <div class="footer-container">
                <div class="footer-grid">
    `;

    // Generate sections
    const sections = ['borrowing', 'lending', 'platform', 'company', 'legal', 'partners'];
    
    sections.forEach(sectionId => {
        const section = footerConfig.content[sectionId];
        if (section) {
            html += generateSectionHtml(sectionId, section);
        }
    });

    html += `
                </div>
            </div>
    `;

    // Add country ticker
    if (footerConfig.countryTicker) {
        html += generateCountryTickerHtml(footerConfig.countryTicker);
    }

    // Add bottom bar
    if (footerConfig.bottomBar) {
        html += generateBottomBarHtml(footerConfig.bottomBar);
    }

    html += `
        </footer>
    `;

    return html;
}

/**
 * Generate HTML for a footer section
 * @param {string} sectionId - Section identifier
 * @param {Object} section - Section content
 * @returns {string} HTML string
 */
function generateSectionHtml(sectionId, section) {
    const ariaLabel = SOUTH_SUDAN_FOOTER.accessibility.ariaLabels.sections[sectionId] || 
                     `${section.title} section`;

    let html = `
        <div class="footer-col" id="footer-${sectionId}">
            <h4 class="footer-col-title" aria-label="${ariaLabel}">
                ${section.title}
            </h4>
            <ul class="footer-links">
    `;

    section.links.forEach(link => {
        html += `
            <li class="footer-link-item">
                <a href="${link.url}" 
                   class="footer-link"
                   ${link.description ? `title="${link.description}"` : ''}
                   ${link.icon ? `aria-label="${link.text} ${link.icon}"` : ''}>
                    ${link.icon ? `<span class="link-icon">${link.icon}</span>` : ''}
                    <span class="link-text">${link.text}</span>
                </a>
            </li>
        `;
    });

    html += `
            </ul>
    `;

    if (section.countryNote) {
        html += `
            <div class="country-note">
                <small>${section.countryNote}</small>
            </div>
        `;
    }

    html += `
        </div>
    `;

    return html;
}

/**
 * Generate HTML for country ticker
 * @param {Object} ticker - Ticker configuration
 * @returns {string} HTML string
 */
function generateCountryTickerHtml(ticker) {
    return `
        <div class="country-ticker" aria-label="${ticker.ariaLabel}">
            <div class="ticker-track" 
                 style="animation: ${ticker.animation.direction === 'left-to-right' ? 'scroll-left' : 'scroll-right'} ${ticker.animation.speed} linear infinite;
                        ${ticker.animation.pauseOnHover ? 'animation-play-state: running;' : ''}"
                 onmouseenter="${ticker.animation.pauseOnHover ? 'this.style.animationPlayState = paused' : ''}"
                 onmouseleave="${ticker.animation.pauseOnHover ? 'this.style.animationPlayState = running' : ''}">
                ${ticker.content}
            </div>
        </div>
    `;
}

/**
 * Generate HTML for bottom bar
 * @param {Object} bottomBar - Bottom bar configuration
 * @returns {string} HTML string
 */
function generateBottomBarHtml(bottomBar) {
    let contactsHtml = '';
    if (bottomBar.contacts && bottomBar.contacts.length > 0) {
        contactsHtml = `
            <div class="country-contacts">
                <strong>${SOUTH_SUDAN_FOOTER.bottomBar.countryContacts.title}</strong>
                ${bottomBar.contacts.map(contact => 
                    `${contact.country}: ${contact.phone}`
                ).join(' | ')}
            </div>
        `;
    }

    let legalLinksHtml = '';
    if (bottomBar.legalLinks && bottomBar.legalLinks.links.length > 0) {
        legalLinksHtml = `
            <div class="footer-legal">
                ${bottomBar.legalLinks.links.map(link => 
                    `<a href="${link.url}">${link.text}</a>`
                ).join(bottomBar.legalLinks.separator)}
            </div>
        `;
    }

    return `
        <div class="footer-bottom" style="
            background: ${bottomBar.styling.background};
            color: ${bottomBar.styling.textColor};
            font-size: ${bottomBar.styling.fontSize};
            padding: ${bottomBar.styling.padding};
            border-top: ${bottomBar.styling.borderTop};
        ">
            <div class="footer-bottom-container">
                <div class="copyright">
                    ${bottomBar.copyright.text}${bottomBar.copyright.country}
                </div>
                ${contactsHtml}
                ${legalLinksHtml}
            </div>
        </div>
    `;
}

/**
 * Validate footer configuration
 * @returns {Object} Validation result
 */
function validateFooterConfig() {
    const errors = [];
    const warnings = [];

    // Check required sections
    const requiredSections = ['borrowing', 'lending', 'platform', 'company', 'legal'];
    requiredSections.forEach(section => {
        if (!SOUTH_SUDAN_FOOTER.content[section]) {
            errors.push(`Missing required section: ${section}`);
        }
    });

    // Check contact information
    if (!SOUTH_SUDAN_FOOTER.contact.addresses || SOUTH_SUDAN_FOOTER.contact.addresses.length === 0) {
        warnings.push("No physical addresses configured");
    }

    if (!SOUTH_SUDAN_FOOTER.contact.phones || SOUTH_SUDAN_FOOTER.contact.phones.length === 0) {
        warnings.push("No phone numbers configured");
    }

    // Check accessibility
    if (!SOUTH_SUDAN_FOOTER.accessibility.ariaLabels.footer) {
        warnings.push("Missing ARIA label for main footer");
    }

    // Check color contrast
    const colors = SOUTH_SUDAN_FOOTER.styling.colors;
    if (colors) {
        // Simple contrast check (would need proper contrast ratio calculation)
        if (colors.background && colors.text) {
            if (colors.background === colors.text) {
                errors.push("Background and text colors are the same");
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        sectionsCount: Object.keys(SOUTH_SUDAN_FOOTER.content).length,
        linksCount: countFooterLinks(),
        timestamp: new Date().toISOString()
    };
}

/**
 * Count total links in footer
 * @returns {number} Total links
 */
function countFooterLinks() {
    let count = 0;
    const content = SOUTH_SUDAN_FOOTER.content;
    
    for (const section in content) {
        if (content[section].links) {
            count += content[section].links.length;
        }
    }
    
    return count;
}

// ============================================
// EXPORT FOOTER FUNCTIONS
// ============================================

// Export utility functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports.renderFooter = renderFooter;
    module.exports.generateFooterHtml = generateFooterHtml;
    module.exports.validateFooterConfig = validateFooterConfig;
    module.exports.generateSectionHtml = generateSectionHtml;
    module.exports.generateCountryTickerHtml = generateCountryTickerHtml;
    module.exports.generateBottomBarHtml = generateBottomBarHtml;
}

// Export for browser global
if (typeof window !== 'undefined') {
    window.MPesewaFooterSouthSudan = {
        config: SOUTH_SUDAN_FOOTER,
        renderFooter,
        generateFooterHtml,
        validateFooterConfig
    };
}

// ============================================
// FOOTER INITIALIZATION & SELF-TEST
// ============================================

/**
 * Initialize footer system
 * @returns {Object} Initialization result
 */
function initializeFooter() {
    console.log('=== M-PESEWA SOUTH SUDAN FOOTER SYSTEM ===');
    console.log(`Footer Sections: ${Object.keys(SOUTH_SUDAN_FOOTER.content).length}`);
    
    // Validate configuration
    const validation = validateFooterConfig();
    console.log(`Configuration Valid: ${validation.valid ? 'YES' : 'NO'}`);
    
    if (validation.errors.length > 0) {
        console.error('Errors:', validation.errors);
    }
    if (validation.warnings.length > 0) {
        console.warn('Warnings:', validation.warnings);
    }
    
    // Test footer rendering
    const testFooter = renderFooter({
        user: {
            authenticated: true,
            role: 'BORROWER',
            name: 'Test User',
            groups: ['group1']
        },
        currentPage: '/countries/south-sudan/emergency/fare.html'
    });
    
    console.log(`Footer Rendering Test: ${testFooter.content ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Total Links: ${validation.linksCount}`);
    
    // Test HTML generation
    const testHtml = generateFooterHtml(testFooter);
    console.log(`HTML Generation: ${testHtml.length > 100 ? 'SUCCESS' : 'FAILED'}`);
    console.log(`HTML Size: ${Math.round(testHtml.length / 1024)}KB`);
    
    return {
        initialized: true,
        validation,
        testResults: {
            rendering: !!testFooter.content,
            htmlGeneration: testHtml.length > 100,
            sections: Object.keys(testFooter.content).length
        },
        timestamp: new Date().toISOString()
    };
}

// Auto-initialize in browser
if (typeof window !== 'undefined' && window.document) {
    window.addEventListener('DOMContentLoaded', () => {
        if (window.MPesewaFooter && window.MPesewaFooter.SouthSudan) {
            initializeFooter();
        }
    });
}

// Export initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports.initializeFooter = initializeFooter;
}

// ============================================
// FOOTER METADATA
// ============================================

/**
 * Footer metadata
 */
const FOOTER_METADATA = {
    name: 'South Sudan Footer Configuration',
    description: 'M-PESEWA footer configuration for South Sudan',
    author: 'M-PESEWA Frontend Team',
    maintainers: ['frontend@mpesewa.com'],
    lastModified: '2024-01-24',
    license: 'MPESEWA PROPRIETARY',
    
    // Technical specifications
    technical: {
        responsive: true,
        accessibility: 'WCAG 2.1 AA compliant',
        performance: 'Optimized for fast loading',
        browserSupport: 'Modern browsers + IE11'
    },
    
    // Content statistics
    content: {
        sections: 6,
        totalLinks: countFooterLinks(),
        contactPoints: 3,
        socialPlatforms: 4,
        languages: 2
    },
    
    // Version history
    versions: [
        {
            version: '1.0.0',
            date: '2024-01-24',
            changes: 'Initial footer configuration for South Sudan',
            features: [
                '6-column responsive layout',
                'Country-specific content',
                'Accessibility features',
                'Country ticker',
                'Dynamic user adjustments'
            ]
        }
    ]
};

// Export metadata
if (typeof module !== 'undefined' && module.exports) {
    module.exports.FOOTER_METADATA = FOOTER_METADATA;
}

if (typeof window !== 'undefined') {
    window.MPesewaFooterSouthSudanMetadata = FOOTER_METADATA;
}

// ============================================
// FOOTER STYLESHEET GENERATOR
// ============================================

/**
 * Generate CSS for South Sudan footer
 * @returns {string} CSS string
 */
function generateFooterCss() {
    const colors = SOUTH_SUDAN_FOOTER.styling.colors;
    const typography = SOUTH_SUDAN_FOOTER.styling.typography;
    const layout = SOUTH_SUDAN_FOOTER.styling.layout;
    const responsive = SOUTH_SUDAN_FOOTER.styling.responsive;
    
    return `
        /* South Sudan Footer Styles */
        .mp-footer.ss-footer {
            background: ${colors.background};
            color: ${colors.text};
            font-family: ${typography.fontFamily};
            padding: ${layout.padding.top} ${layout.padding.sides} ${layout.padding.bottom};
        }
        
        .footer-container {
            max-width: ${layout.maxWidth};
            margin: 0 auto;
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: repeat(${responsive.columns.desktop}, 1fr);
            gap: ${layout.spacing.columnGap};
        }
        
        .footer-col-title {
            font-size: ${typography.fontSize.titles};
            font-weight: ${typography.fontWeight.titles};
            margin-bottom: 20px;
            color: ${colors.text};
        }
        
        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-link-item {
            margin-bottom: ${layout.spacing.betweenLinks};
        }
        
        .footer-link {
            color: ${colors.links};
            text-decoration: none;
            font-size: ${typography.fontSize.links};
            line-height: ${typography.lineHeight};
            display: flex;
            align-items: center;
            transition: ${SOUTH_SUDAN_FOOTER.styling.animations.linkHover};
        }
        
        .footer-link:hover {
            color: ${colors.hover};
        }
        
        .link-icon {
            margin-right: 8px;
            font-size: 16px;
        }
        
        .country-ticker {
            overflow: hidden;
            background: ${SOUTH_SUDAN_FOOTER.countryTicker.styling.background};
            padding: ${SOUTH_SUDAN_FOOTER.countryTicker.styling.padding};
            margin-top: 40px;
        }
        
        .ticker-track {
            white-space: nowrap;
            display: inline-block;
            color: ${SOUTH_SUDAN_FOOTER.countryTicker.styling.textColor};
            font-size: ${SOUTH_SUDAN_FOOTER.countryTicker.styling.fontSize};
        }
        
        @keyframes scroll-left {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(-100%);
            }
        }
        
        @keyframes scroll-right {
            from {
                transform: translateX(-100%);
            }
            to {
                transform: translateX(100%);
            }
        }
        
        /* Responsive Design */
        @media (max-width: ${responsive.breakpoints.tablet}) {
            .footer-grid {
                grid-template-columns: repeat(${responsive.columns.tablet}, 1fr);
            }
        }
        
        @media (max-width: ${responsive.breakpoints.mobile}) {
            .footer-grid {
                grid-template-columns: repeat(${responsive.columns.mobile}, 1fr);
            }
            
            .footer-col {
                margin-bottom: 30px;
            }
        }
        
        /* Accessibility */
        .footer-link:focus {
            outline: 2px solid ${colors.hover};
            outline-offset: 2px;
        }
        
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
}

// Export CSS generator
if (typeof module !== 'undefined' && module.exports) {
    module.exports.generateFooterCss = generateFooterCss;
}

// ============================================
// END OF SOUTH SUDAN FOOTER CONFIGURATION
// ============================================