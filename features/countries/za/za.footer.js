/**
 * South Africa (ZA) Footer Module
 * M-Pesewa Country-Specific Footer - South Africa
 * Last Updated: 2026-01-24
 * 
 * FOOTER HIERARCHY ENFORCEMENT:
 * 1. Country-Specific Footer Structure
 * 2. Regulatory Compliance Display
 * 3. Regional Contact Information
 * 4. Legal & Compliance Links
 */

const ZA_FOOTER = {
    // ============================================
    // 1. FOOTER STRUCTURE & LAYOUT
    // ============================================
    structure: {
        // 1.1. Main Footer Container
        container: {
            id: "za-footer-container",
            className: "mp-footer za-footer",
            style: {
                backgroundColor: "#1f2a37", // Neutral Dark Slate
                color: "#ffffff",
                paddingTop: "60px",
                paddingBottom: "30px",
                borderTop: "3px solid #003366",
                fontFamily: "'Inter', -apple-system, sans-serif"
            }
        },

        // 1.2. Footer Grid Configuration
        grid: {
            columns: 6,
            gap: "32px",
            responsiveBreakpoints: {
                desktop: "min-width: 1024px",
                tablet: "min-width: 768px",
                mobile: "max-width: 767px"
            },
            columnWidths: {
                desktop: "180px",
                tablet: "160px",
                mobile: "100%"
            }
        },

        // 1.3. Footer Sections Order
        sectionsOrder: [
            "borrowing",
            "lending", 
            "platform",
            "company",
            "legal",
            "partners"
        ]
    },

    // ============================================
    // 2. FOOTER COLUMNS CONTENT - SOUTH AFRICA SPECIFIC
    // ============================================
    columns: {
        // 2.1. Borrowing Column
        borrowing: {
            title: "Borrowing in South Africa",
            links: [
                {
                    text: "Get Emergency Loan",
                    href: "/za/borrower/apply",
                    description: "Quick emergency loans for South Africans",
                    icon: "🚨",
                    badge: "FAST"
                },
                {
                    text: "Personal Loan ZAR",
                    href: "/za/borrower/personal-loan",
                    description: "Personal loans in South African Rand",
                    icon: "💼",
                    badge: "ZAR"
                },
                {
                    text: "Business Loan South Africa",
                    href: "/za/borrower/business-loan",
                    description: "Business financing for SA entrepreneurs",
                    icon: "🏢",
                    badge: "SA BUSINESS"
                },
                {
                    text: "How to Apply",
                    href: "/za/how-to-apply",
                    description: "Step-by-step application guide for SA",
                    icon: "📋",
                    badge: "GUIDE"
                },
                {
                    text: "Active Borrowers SA",
                    href: "/za/community/borrowers",
                    description: "See active borrowers in South Africa",
                    icon: "👥",
                    badge: "5,000+"
                }
            ],
            style: {
                titleColor: "#ffffff",
                linkColor: "#d1d5db",
                hoverColor: "#0099ff",
                iconSize: "18px"
            }
        },

        // 2.2. Lending Column
        lending: {
            title: "Lending in South Africa",
            links: [
                {
                    text: "Smart Lending SA",
                    href: "/za/lender/smart-lending",
                    description: "Intelligent lending strategies for SA",
                    icon: "🧠",
                    badge: "SMART"
                },
                {
                    text: "Why Lend in South Africa",
                    href: "/za/lender/why-lend",
                    description: "Benefits of lending in the SA market",
                    icon: "🇿🇦",
                    badge: "SA MARKET"
                },
                {
                    text: "How to Lend",
                    href: "/za/lender/how-to-lend",
                    description: "Lending guide for South African lenders",
                    icon: "📚",
                    badge: "GUIDE"
                },
                {
                    text: "Active Lenders SA",
                    href: "/za/community/lenders",
                    description: "Active lenders in South Africa",
                    icon: "💰",
                    badge: "2,000+"
                },
                {
                    text: "Lender Success Stories",
                    href: "/za/lender/success-stories",
                    description: "Success stories from SA lenders",
                    icon: "📈",
                    badge: "SUCCESS"
                }
            ],
            style: {
                titleColor: "#ffffff",
                linkColor: "#d1d5db",
                hoverColor: "#28a745", // Trust Green
                iconSize: "18px"
            }
        },

        // 2.3. Platform Column
        platform: {
            title: "Platform in South Africa",
            links: [
                {
                    text: "P2P Lending Explained",
                    href: "/za/how-it-works",
                    description: "How peer-to-peer lending works in SA",
                    icon: "🤝",
                    badge: "P2P"
                },
                {
                    text: "Our Role in SA",
                    href: "/za/our-role",
                    description: "M-Pesewa's role in South African lending",
                    icon: "🎯",
                    badge: "ROLE"
                },
                {
                    text: "Subscriptions ZAR",
                    href: "/za/subscription/plans",
                    description: "Subscription plans in South African Rand",
                    icon: "💳",
                    badge: "ZAR PRICING"
                },
                {
                    text: "Blacklist South Africa",
                    href: "/za/blacklist/public",
                    description: "Blacklist for South African defaulters",
                    icon: "🚫",
                    badge: "SA DATA"
                },
                {
                    text: "Debt Collectors SA",
                    href: "/za/collectors",
                    description: "Vetted debt collectors in South Africa",
                    icon: "⚖️",
                    badge: "SA VETTED"
                }
            ],
            style: {
                titleColor: "#ffffff",
                linkColor: "#d1d5db",
                hoverColor: "#0099ff",
                iconSize: "18px"
            }
        },

        // 2.4. Company Column
        company: {
            title: "Company in South Africa",
            links: [
                {
                    text: "About M-Pesewa SA",
                    href: "/za/about",
                    description: "About our South African operations",
                    icon: "🏢",
                    badge: "SA OPERATIONS"
                },
                {
                    text: "SA Team & Board",
                    href: "/za/team",
                    description: "Our South African team and advisory board",
                    icon: "👨‍💼",
                    badge: "SA TEAM"
                },
                {
                    text: "News & Careers SA",
                    href: "/za/news",
                    description: "News and careers in South Africa",
                    icon: "📰",
                    badge: "SA JOBS"
                },
                {
                    text: "SA Blog & FAQs",
                    href: "/za/blog",
                    description: "Blog and FAQs for South Africa",
                    icon: "📝",
                    badge: "SA CONTENT"
                },
                {
                    text: "Contact SA Office",
                    href: "/za/contact",
                    description: "Contact our South African offices",
                    icon: "📞",
                    badge: "SA CONTACT"
                }
            ],
            style: {
                titleColor: "#ffffff",
                linkColor: "#d1d5db",
                hoverColor: "#0099ff",
                iconSize: "18px"
            }
        },

        // 2.5. Legal & Compliance Column
        legal: {
            title: "Legal & Compliance SA",
            links: [
                {
                    text: "Terms & Conditions SA",
                    href: "/za/terms",
                    description: "South Africa specific terms and conditions",
                    icon: "📄",
                    badge: "SA TERMS"
                },
                {
                    text: "Privacy Policy SA",
                    href: "/za/privacy",
                    description: "POPIA compliant privacy policy",
                    icon: "🔒",
                    badge: "POPIA"
                },
                {
                    text: "Grievance Redressal",
                    href: "/za/grievance",
                    description: "Complaint handling for South Africa",
                    icon: "⚖️",
                    badge: "SA COMPLAINTS"
                },
                {
                    text: "Fair Practices Code",
                    href: "/za/fair-practices",
                    description: "Fair lending practices in South Africa",
                    icon: "✅",
                    badge: "FAIR LENDING"
                },
                {
                    text: "FSCA Compliance",
                    href: "/za/fsca-compliance",
                    description: "FSCA regulatory compliance",
                    icon: "🏛️",
                    badge: "FSCA"
                }
            ],
            style: {
                titleColor: "#ffffff",
                linkColor: "#d1d5db",
                hoverColor: "#f37021", // Action Orange
                iconSize: "18px"
            }
        },

        // 2.6. Partners Column
        partners: {
            title: "Partners in South Africa",
            links: [
                {
                    text: "Be a Partner",
                    href: "/za/partners",
                    description: "Partner with us in South Africa",
                    icon: "🤝",
                    badge: "PARTNER"
                },
                {
                    text: "Bank Partners SA",
                    href: "/za/partners/banks",
                    description: "Our banking partners in South Africa",
                    icon: "🏦",
                    badge: "BANKS"
                },
                {
                    text: "Payment Processors",
                    href: "/za/partners/payments",
                    description: "Payment processor partners",
                    icon: "💳",
                    badge: "PAYMENTS"
                },
                {
                    text: "Credit Bureau Partners",
                    href: "/za/partners/credit-bureaus",
                    description: "Credit bureau partnerships",
                    icon: "📊",
                    badge: "CREDIT"
                }
            ],
            social: {
                title: "Follow Us in South Africa",
                links: [
                    {
                        platform: "Facebook",
                        href: "https://facebook.com/mpesewasa",
                        icon: "📘",
                        ariaLabel: "M-Pesewa South Africa Facebook"
                    },
                    {
                        platform: "Twitter",
                        href: "https://twitter.com/mpesewasa",
                        icon: "🐦",
                        ariaLabel: "M-Pesewa South Africa Twitter"
                    },
                    {
                        platform: "YouTube",
                        href: "https://youtube.com/mpesewasa",
                        icon: "📺",
                        ariaLabel: "M-Pesewa South Africa YouTube"
                    },
                    {
                        platform: "Instagram",
                        href: "https://instagram.com/mpesewasa",
                        icon: "📸",
                        ariaLabel: "M-Pesewa South Africa Instagram"
                    },
                    {
                        platform: "LinkedIn",
                        href: "https://linkedin.com/company/mpesewasa",
                        icon: "💼",
                        ariaLabel: "M-Pesewa South Africa LinkedIn"
                    }
                ]
            },
            style: {
                titleColor: "#ffffff",
                linkColor: "#d1d5db",
                hoverColor: "#0099ff",
                socialIconSize: "24px"
            }
        }
    },

    // ============================================
    // 3. REGULATORY COMPLIANCE BADGES - SOUTH AFRICA
    // ============================================
    compliance: {
        // 3.1. Main Compliance Badges
        badges: [
            {
                id: "fsca-badge",
                text: "FSCA Regulated",
                description: "Financial Sector Conduct Authority Registered",
                icon: "🏛️",
                license: "FSP12345",
                color: "#28a745", // Trust Green
                link: "/za/fsca-compliance"
            },
            {
                id: "ncr-badge",
                text: "NCR Registered",
                description: "National Credit Regulator Registered",
                icon: "⚖️",
                license: "NCRCP12345",
                color: "#f37021", // Action Orange
                link: "/za/ncr-compliance"
            },
            {
                id: "popia-badge",
                text: "POPIA Compliant",
                description: "Protection of Personal Information Act Compliant",
                icon: "🔒",
                registration: "POPIA/2023/001234",
                color: "#0099ff", // Secondary Blue
                link: "/za/popia-compliance"
            },
            {
                id: "sars-badge",
                text: "SARS Compliant",
                description: "South African Revenue Service Compliant",
                icon: "💰",
                vat: "4880266188",
                color: "#6f42c1", // Purple
                link: "/za/tax-compliance"
            }
        ],

        // 3.2. Compliance Notice
        notice: {
            text: "M-Pesewa Technology (Pty) Ltd is a registered Financial Services Provider (FSP12345) and Credit Provider (NCRCP12345) in South Africa. We operate in compliance with the Financial Sector Conduct Authority (FSCA), National Credit Act (NCA), and Protection of Personal Information Act (POPIA).",
            display: true,
            important: true,
            style: {
                backgroundColor: "#003366",
                color: "#ffffff",
                padding: "15px",
                borderRadius: "8px",
                fontSize: "14px",
                borderLeft: "4px solid #28a745"
            }
        }
    },

    // ============================================
    // 4. COUNTRY TICKER - SOUTH AFRICA PROVINCES
    // ============================================
    ticker: {
        enabled: true,
        type: "continuous-scroll",
        direction: "left-to-right",
        speed: "25s",
        content: "🇿🇦 South Africa • Gauteng • Western Cape • KwaZulu-Natal • Eastern Cape • Free State • Limpopo • Mpumalanga • North West • Northern Cape • Johannesburg • Cape Town • Durban • Pretoria • Port Elizabeth • Bloemfontein • 🇿🇦 South Africa • Gauteng • Western Cape • KwaZulu-Natal • Eastern Cape • Free State • Limpopo • Mpumalanga • North West • Northern Cape • Johannesburg • Cape Town • Durban • Pretoria • Port Elizabeth • Bloemfontein",
        style: {
            backgroundColor: "#111827",
            color: "#ffffff",
            padding: "12px 0",
            fontSize: "13px",
            fontWeight: "500",
            borderTop: "1px solid #374151",
            borderBottom: "1px solid #374151"
        }
    },

    // ============================================
    // 5. CONTACT INFORMATION - SOUTH AFRICA SPECIFIC
    // ============================================
    contacts: {
        // 5.1. Main Office Contacts
        offices: [
            {
                city: "Johannesburg",
                type: "Head Office",
                address: "123 Sandton Drive, Sandton, Johannesburg 2196",
                phone: "+27 11 000 0000",
                whatsapp: "+27 11 000 0001",
                email: "jhb@mpesewa.com",
                hours: "Mon-Fri: 8am-8pm, Sat: 9am-5pm",
                coordinates: {
                    lat: -26.107565,
                    lng: 28.056702
                }
            },
            {
                city: "Cape Town",
                type: "Regional Office",
                address: "456 Bree Street, Cape Town City Centre 8001",
                phone: "+27 21 000 0000",
                whatsapp: "+27 21 000 0001",
                email: "cpt@mpesewa.com",
                hours: "Mon-Fri: 8am-6pm, Sat: 9am-1pm",
                coordinates: {
                    lat: -33.9249,
                    lng: 18.4241
                }
            },
            {
                city: "Durban",
                type: "Regional Office",
                address: "789 Musgrave Road, Berea, Durban 4001",
                phone: "+27 31 000 0000",
                whatsapp: "+27 31 000 0001",
                email: "dbn@mpesewa.com",
                hours: "Mon-Fri: 8am-6pm, Sat: 9am-1pm",
                coordinates: {
                    lat: -29.8587,
                    lng: 31.0218
                }
            }
        ],

        // 5.2. Department Contacts
        departments: [
            {
                name: "General Support",
                phone: "+27 11 000 0000",
                email: "support-za@mpesewa.com",
                hours: "24/7 for emergencies"
            },
            {
                name: "Compliance & Legal",
                phone: "+27 11 000 0002",
                email: "compliance-za@mpesewa.com",
                hours: "Mon-Fri 9am-5pm"
            },
            {
                name: "Business Development",
                phone: "+27 11 000 0003",
                email: "partners-za@mpesewa.com",
                hours: "Mon-Fri 9am-5pm"
            },
            {
                name: "Media & Press",
                phone: "+27 11 000 0004",
                email: "press-za@mpesewa.com",
                hours: "Mon-Fri 9am-5pm"
            }
        ],

        // 5.3. Emergency Contacts
        emergency: {
            fraud: "+27 11 000 9999",
            legal: "+27 11 000 9998",
            technical: "+27 11 000 9997",
            note: "For account security issues, contact immediately"
        }
    },

    // ============================================
    // 6. LEGAL & COPYRIGHT INFORMATION
    // ============================================
    legal: {
        // 6.1. Copyright Information
        copyright: {
            text: "© 2016–2026, M-Pesewa Technology (Pty) Ltd - South Africa. All rights reserved.",
            registration: "Registration Number: 2023/123456/07",
            vat: "VAT Number: 4880266188",
            style: {
                fontSize: "12px",
                color: "#9ca3af",
                textAlign: "center",
                padding: "20px 0"
            }
        },

        // 6.2. Legal Disclaimers
        disclaimers: [
            {
                id: "financial-advice",
                text: "M-Pesewa does not provide financial advice. Lending and borrowing decisions are made by users at their own risk.",
                important: true
            },
            {
                id: "regulatory",
                text: "M-Pesewa is a registered Financial Services Provider (FSP12345) and Credit Provider (NCRCP12345). We do not accept deposits or provide banking services.",
                important: true
            },
            {
                id: "data-protection",
                text: "We protect your personal information in compliance with POPIA. Read our Privacy Policy for details.",
                important: false
            }
        ],

        // 6.3. Additional Legal Links
        additionalLinks: [
            {
                text: "Sitemap",
                href: "/za/sitemap",
                description: "Site map for South Africa"
            },
            {
                text: "Accessibility",
                href: "/za/accessibility",
                description: "Accessibility statement for South Africa"
            },
            {
                text: "Security",
                href: "/za/security",
                description: "Security measures for South Africa"
            },
            {
                text: "Report Issue",
                href: "/za/report",
                description: "Report security or compliance issues"
            }
        ]
    },

    // ============================================
    // 7. PERFORMANCE & ACCESSIBILITY CONFIGURATION
    // ============================================
    performance: {
        // 7.1. Lazy Loading Configuration
        lazyLoad: {
            enabled: true,
            threshold: "100px",
            images: true,
            iframes: true
        },

        // 7.2. Accessibility Features
        accessibility: {
            ariaLabels: true,
            keyboardNavigation: true,
            focusIndicators: true,
            skipLinks: true,
            contrastRatio: "4.5:1 minimum"
        },

        // 7.3. SEO Optimization
        seo: {
            schemaMarkup: true,
            breadcrumbs: true,
            canonicalUrls: true,
            hreflang: true
        }
    },

    // ============================================
    // 8. DYNAMIC CONTENT CONFIGURATION
    // ============================================
    dynamic: {
        // 8.1. User-Specific Content
        userContext: {
            showUserLocation: true,
            showLocalOffices: true,
            showRegionalNews: true,
            personalizeLinks: true
        },

        // 8.2. Time-Based Content
        timeBased: {
            showBusinessHours: true,
            holidayMessages: true,
            maintenanceNotices: true
        },

        // 8.3. Analytics Integration
        analytics: {
            trackClicks: true,
            trackScroll: true,
            trackTime: true,
            eventCategories: ["footer", "navigation", "contact"]
        }
    }
};

// ============================================
// FOOTER GENERATION FUNCTIONS
// ============================================

/**
 * Generate complete footer HTML for South Africa
 * @param {Object} options - Generation options
 * @returns {string} Complete footer HTML
 */
function generateFooter(options = {}) {
    const {
        showTicker = true,
        showCompliance = true,
        showContacts = true,
        showLegal = true,
        userContext = {},
        currentYear = new Date().getFullYear()
    } = options;

    let footerHTML = '';

    // Footer opening tag with styles
    footerHTML += `
        <footer id="${ZA_FOOTER.structure.container.id}" class="${ZA_FOOTER.structure.container.className}" style="${objectToStyles(ZA_FOOTER.structure.container.style)}">
            <div class="footer-container">
    `;

    // Compliance Notice
    if (showCompliance && ZA_FOOTER.compliance.notice.display) {
        footerHTML += generateComplianceNotice();
    }

    // Main Footer Grid
    footerHTML += generateFooterGrid(userContext);

    // Country Ticker
    if (showTicker && ZA_FOOTER.ticker.enabled) {
        footerHTML += generateCountryTicker();
    }

    // Contact Information
    if (showContacts) {
        footerHTML += generateContactSection(userContext);
    }

    // Legal & Copyright
    if (showLegal) {
        footerHTML += generateLegalSection(currentYear);
    }

    // Closing tags
    footerHTML += `
            </div>
        </footer>
    `;

    return footerHTML;
}

/**
 * Generate footer grid with all columns
 * @param {Object} userContext - User context for personalization
 * @returns {string} Footer grid HTML
 */
function generateFooterGrid(userContext = {}) {
    const { userProvince, userCity, userType } = userContext;
    
    let gridHTML = `
        <div class="footer-grid" style="
            display: grid;
            grid-template-columns: repeat(${ZA_FOOTER.structure.grid.columns}, minmax(${ZA_FOOTER.structure.grid.columnWidths.desktop}, 1fr));
            gap: ${ZA_FOOTER.structure.grid.gap};
            padding: 40px 0;
        ">
    `;

    // Generate each column in order
    ZA_FOOTER.structure.sectionsOrder.forEach(sectionKey => {
        const column = ZA_FOOTER.columns[sectionKey];
        if (column) {
            gridHTML += generateFooterColumn(column, sectionKey, userContext);
        }
    });

    gridHTML += `</div>`;

    return gridHTML;
}

/**
 * Generate single footer column
 * @param {Object} column - Column configuration
 * @param {string} sectionKey - Section key
 * @param {Object} userContext - User context
 * @returns {string} Column HTML
 */
function generateFooterColumn(column, sectionKey, userContext) {
    const { userProvince, userCity } = userContext;
    
    let columnHTML = `
        <div class="footer-col footer-col-${sectionKey}">
            <h4 class="footer-col-title" style="
                color: ${column.style.titleColor};
                margin-bottom: 16px;
                font-size: 15px;
                font-weight: 600;
            ">
                ${column.title}
            </h4>
    `;

    // Generate links
    if (column.links && column.links.length > 0) {
        column.links.forEach(link => {
            let linkText = link.text;
            
            // Personalize based on user context
            if (userProvince && link.badge?.includes('PROVINCE')) {
                linkText = link.text.replace('Province', userProvince);
            }
            
            if (userCity && link.badge?.includes('CITY')) {
                linkText = link.text.replace('City', userCity);
            }

            columnHTML += `
                <a href="${link.href}" 
                   class="footer-link" 
                   title="${link.description}"
                   style="
                       display: flex;
                       align-items: center;
                       gap: 8px;
                       color: ${column.style.linkColor};
                       text-decoration: none;
                       margin-bottom: 10px;
                       font-size: 14px;
                       transition: color 0.2s ease;
                   "
                   onmouseover="this.style.color='${column.style.hoverColor}'"
                   onmouseout="this.style.color='${column.style.linkColor}'">
                    ${link.icon ? `<span class="link-icon" style="font-size: ${column.style.iconSize}">${link.icon}</span>` : ''}
                    <span class="link-text">${linkText}</span>
                    ${link.badge ? `<span class="link-badge" style="
                        background: ${getBadgeColor(link.badge)};
                        color: white;
                        font-size: 10px;
                        padding: 2px 6px;
                        border-radius: 10px;
                        margin-left: auto;
                    ">${link.badge}</span>` : ''}
                </a>
            `;
        });
    }

    // Social links for partners column
    if (sectionKey === 'partners' && column.social) {
        columnHTML += `
            <div class="social-links" style="margin-top: 20px;">
                <p style="
                    color: ${column.style.titleColor};
                    margin-bottom: 12px;
                    font-size: 14px;
                ">${column.social.title}</p>
                <div class="social-icons" style="
                    display: flex;
                    gap: 12px;
                ">
        `;

        column.social.links.forEach(social => {
            columnHTML += `
                <a href="${social.href}" 
                   class="social-link"
                   aria-label="${social.ariaLabel}"
                   style="
                       display: inline-flex;
                       align-items: center;
                       justify-content: center;
                       width: 36px;
                       height: 36px;
                       background: rgba(255,255,255,0.1);
                       border-radius: 50%;
                       color: ${column.style.linkColor};
                       text-decoration: none;
                       transition: all 0.2s ease;
                       font-size: ${column.style.socialIconSize};
                   "
                   onmouseover="this.style.background='${column.style.hoverColor}'; this.style.color='white'"
                   onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.color='${column.style.linkColor}'">
                    ${social.icon}
                </a>
            `;
        });

        columnHTML += `</div></div>`;
    }

    columnHTML += `</div>`;

    return columnHTML;
}

/**
 * Generate compliance notice
 * @returns {string} Compliance notice HTML
 */
function generateComplianceNotice() {
    const notice = ZA_FOOTER.compliance.notice;
    
    return `
        <div class="compliance-notice" style="${objectToStyles(notice.style)}">
            <div class="notice-content" style="
                display: flex;
                align-items: flex-start;
                gap: 12px;
            ">
                <span class="notice-icon" style="font-size: 20px">⚠️</span>
                <div>
                    <p style="margin: 0; font-weight: 600; margin-bottom: 4px;">Important Compliance Notice - South Africa</p>
                    <p style="margin: 0; opacity: 0.9;">${notice.text}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate compliance badges
 * @returns {string} Compliance badges HTML
 */
function generateComplianceBadges() {
    let badgesHTML = `
        <div class="compliance-badges" style="
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
            margin: 30px 0;
        ">
    `;

    ZA_FOOTER.compliance.badges.forEach(badge => {
        badgesHTML += `
            <a href="${badge.link}" 
               class="compliance-badge"
               title="${badge.description}"
               style="
                   display: inline-flex;
                   align-items: center;
                   gap: 6px;
                   background: ${badge.color};
                   color: white;
                   padding: 8px 16px;
                   border-radius: 6px;
                   text-decoration: none;
                   font-size: 12px;
                   font-weight: 600;
                   transition: transform 0.2s ease;
               "
               onmouseover="this.style.transform='translateY(-2px)'"
               onmouseout="this.style.transform='translateY(0)'">
                ${badge.icon} ${badge.text}
            </a>
        `;
    });

    badgesHTML += `</div>`;

    return badgesHTML;
}

/**
 * Generate country ticker
 * @returns {string} Country ticker HTML
 */
function generateCountryTicker() {
    const ticker = ZA_FOOTER.ticker;
    
    return `
        <div class="country-ticker" style="${objectToStyles(ticker.style)}">
            <div class="ticker-track" style="
                white-space: nowrap;
                display: inline-block;
                animation: scroll-left ${ticker.speed} linear infinite;
                padding: 0 20px;
            ">
                ${ticker.content}
            </div>
        </div>
        
        <style>
            @keyframes scroll-left {
                from {
                    transform: translateX(100%);
                }
                to {
                    transform: translateX(-100%);
                }
            }
        </style>
    `;
}

/**
 * Generate contact section
 * @param {Object} userContext - User context
 * @returns {string} Contact section HTML
 */
function generateContactSection(userContext = {}) {
    const { userProvince, userCity } = userContext;
    
    let contactHTML = `
        <div class="contact-section" style="
            background: rgba(0,0,0,0.2);
            border-radius: 12px;
            padding: 30px;
            margin: 40px 0;
        ">
            <h3 style="
                color: #ffffff;
                margin-bottom: 24px;
                font-size: 18px;
            ">Contact M-Pesewa South Africa</h3>
            
            <div class="contact-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
            ">
    `;

    // Show nearest office based on user context
    let officesToShow = ZA_FOOTER.contacts.offices;
    
    if (userProvince) {
        // Filter to show offices in user's province first
        officesToShow = [...ZA_FOOTER.contacts.offices].sort((a, b) => {
            const aInProvince = a.city.includes(userProvince) ? -1 : 1;
            const bInProvince = b.city.includes(userProvince) ? -1 : 1;
            return aInProvince - bInProvince;
        });
    }

    // Show maximum 3 offices
    officesToShow.slice(0, 3).forEach(office => {
        const isNearest = userCity && office.city.includes(userProvince);
        
        contactHTML += `
            <div class="office-card" style="
                background: ${isNearest ? 'rgba(0, 51, 102, 0.3)' : 'rgba(255,255,255,0.05)'};
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid ${isNearest ? '#0099ff' : 'transparent'};
            ">
                ${isNearest ? '<div class="nearest-badge" style="background: #0099ff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 10px; display: inline-block;">Nearest to you</div>' : ''}
                
                <h4 style="color: #ffffff; margin: 8px 0; font-size: 16px;">
                    ${office.city} ${office.type === 'Head Office' ? '🏢' : '🏛️'}
                </h4>
                
                <p style="color: #d1d5db; margin: 8px 0; font-size: 14px;">
                    📍 ${office.address}
                </p>
                
                <div style="margin-top: 12px;">
                    <p style="color: #d1d5db; margin: 4px 0; font-size: 14px;">
                        📞 ${office.phone}
                    </p>
                    <p style="color: #d1d5db; margin: 4px 0; font-size: 14px;">
                        💬 WhatsApp: ${office.whatsapp}
                    </p>
                    <p style="color: #d1d5db; margin: 4px 0; font-size: 14px;">
                        📧 ${office.email}
                    </p>
                    <p style="color: #9ca3af; margin: 4px 0; font-size: 12px;">
                        ⏰ ${office.hours}
                    </p>
                </div>
            </div>
        `;
    });

    contactHTML += `</div></div>`;

    return contactHTML;
}

/**
 * Generate legal section
 * @param {number} currentYear - Current year for copyright
 * @returns {string} Legal section HTML
 */
function generateLegalSection(currentYear) {
    const copyright = ZA_FOOTER.legal.copyright;
    const copyrightText = copyright.text.replace('2026', currentYear);
    
    let legalHTML = `
        <div class="legal-section" style="
            border-top: 1px solid #374151;
            padding-top: 30px;
            margin-top: 30px;
        ">
    `;

    // Disclaimers
    ZA_FOOTER.legal.disclaimers.forEach(disclaimer => {
        if (disclaimer.important) {
            legalHTML += `
                <p class="disclaimer" style="
                    color: #9ca3af;
                    font-size: 12px;
                    margin: 8px 0;
                    padding: 10px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 6px;
                    border-left: 3px solid #f37021;
                ">
                    <strong style="color: #ffffff;">⚠️ Important:</strong> ${disclaimer.text}
                </p>
            `;
        }
    });

    // Additional links
    legalHTML += `
        <div class="additional-links" style="
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
            margin: 20px 0;
        ">
    `;

    ZA_FOOTER.legal.additionalLinks.forEach(link => {
        legalHTML += `
            <a href="${link.href}" 
               class="additional-link"
               title="${link.description}"
               style="
                   color: #9ca3af;
                   text-decoration: none;
                   font-size: 12px;
                   transition: color 0.2s ease;
               "
               onmouseover="this.style.color='#0099ff'"
               onmouseout="this.style.color='#9ca3af'">
                ${link.text}
            </a>
        `;
    });

    // Copyright
    legalHTML += `
        </div>
        
        <div class="copyright" style="${objectToStyles(copyright.style)}">
            <p style="margin: 8px 0;">${copyrightText}</p>
            <p style="margin: 4px 0; font-size: 11px;">${copyright.registration}</p>
            <p style="margin: 4px 0; font-size: 11px;">${copyright.vat}</p>
        </div>
    `;

    legalHTML += `</div>`;

    return legalHTML;
}

/**
 * Convert style object to CSS string
 * @param {Object} styleObject - Style object
 * @returns {string} CSS style string
 */
function objectToStyles(styleObject) {
    return Object.entries(styleObject)
        .map(([key, value]) => `${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}: ${value}`)
        .join('; ');
}

/**
 * Get badge color based on badge type
 * @param {string} badge - Badge text
 * @returns {string} Color code
 */
function getBadgeColor(badge) {
    const badgeColors = {
        'FAST': '#f37021', // Action Orange
        'ZAR': '#0099ff',  // Secondary Blue
        'SA BUSINESS': '#003366', // Primary Blue
        'GUIDE': '#28a745', // Trust Green
        'SA MARKET': '#28a745',
        'P2P': '#0099ff',
        'ROLE': '#003366',
        'ZAR PRICING': '#0099ff',
        'SA DATA': '#f37021',
        'SA VETTED': '#28a745',
        'SA OPERATIONS': '#003366',
        'SA TERMS': '#f37021',
        'POPIA': '#0099ff',
        'PARTNER': '#28a745',
        'BANKS': '#003366',
        'PAYMENTS': '#0099ff',
        'CREDIT': '#28a745'
    };
    
    return badgeColors[badge] || '#6b7280';
}

/**
 * Get footer CSS for South Africa
 * @returns {string} CSS styles
 */
function getFooterCSS() {
    return `
        /* South Africa Footer Styles */
        .za-footer {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .za-footer .footer-grid {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .za-footer .footer-col-title {
            font-weight: 600;
            margin-bottom: 16px;
        }
        
        .za-footer .footer-link {
            display: flex;
            align-items: center;
            gap: 8px;
            transition: color 0.2s ease;
        }
        
        .za-footer .footer-link:hover {
            color: #0099ff !important;
        }
        
        .za-footer .link-badge {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: auto;
        }
        
        .za-footer .social-links {
            margin-top: 20px;
        }
        
        .za-footer .social-link {
            transition: all 0.2s ease;
        }
        
        .za-footer .social-link:hover {
            transform: translateY(-2px);
        }
        
        .za-footer .compliance-notice {
            margin-bottom: 30px;
        }
        
        .za-footer .country-ticker {
            overflow: hidden;
        }
        
        /* Responsive Styles */
        @media (max-width: 1024px) {
            .za-footer .footer-grid {
                grid-template-columns: repeat(3, 1fr) !important;
            }
        }
        
        @media (max-width: 768px) {
            .za-footer .footer-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .za-footer .contact-grid {
                grid-template-columns: 1fr !important;
            }
        }
        
        @media (max-width: 480px) {
            .za-footer .footer-grid {
                grid-template-columns: 1fr !important;
            }
            
            .za-footer .compliance-badges {
                flex-direction: column;
                align-items: center;
            }
        }
    `;
}

// ============================================
// EXPORT MODULE
// ============================================

export default {
    // Footer Configuration
    config: ZA_FOOTER,
    
    // Generation Functions
    generateFooter,
    generateFooterGrid,
    generateFooterColumn,
    generateComplianceNotice,
    generateComplianceBadges,
    generateCountryTicker,
    generateContactSection,
    generateLegalSection,
    
    // Utility Functions
    objectToStyles,
    getBadgeColor,
    getFooterCSS,
    
    // Constants
    COUNTRY_CODE: "ZA",
    COUNTRY_NAME: "South Africa",
    CURRENCY: "ZAR",
    
    // Contact Information
    CONTACTS: ZA_FOOTER.contacts,
    
    // Compliance Information
    COMPLIANCE: {
        BADGES: ZA_FOOTER.compliance.badges,
        NOTICE: ZA_FOOTER.compliance.notice
    },
    
    // Legal Information
    LEGAL: {
        COPYRIGHT: ZA_FOOTER.legal.copyright,
        DISCLAIMERS: ZA_FOOTER.legal.disclaimers
    },
    
    // Performance Configuration
    PERFORMANCE: ZA_FOOTER.performance,
    
    // Version Information
    VERSION: "2.1.0",
    LAST_UPDATED: "2026-01-24"
};

// Initialize footer module
console.log(`✅ M-Pesewa South Africa footer module loaded`);
console.log(`📋 Country: South Africa (ZA)`);
console.log(`💼 Registered Entity: M-Pesewa Technology (Pty) Ltd`);
console.log(`📞 Support: ${ZA_FOOTER.contacts.departments[0].phone}`);
console.log(`⚖️ Compliance: FSCA, NCR, POPIA compliant`);