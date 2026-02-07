/**
 * M-PESEWA - NIGERIA FOOTER CONFIGURATION
 * Country-specific footer with legal, contact, and compliance information
 * Strict Nigerian regulatory requirements
 * Last Updated: 2026-01-24
 */

const NigeriaFooter = {
    // ====================================================================
    // 1️⃣ FOOTER STRUCTURE & HIERARCHY (STRICT)
    // ====================================================================
    structure: {
        // Nigerian-specific color scheme
        colors: {
            background: "#1f2a37", // Dark slate
            text: "#ffffff",
            links: "#d1d5db",
            hover: "#0099ff", // Brand secondary blue
            accent: "#003366", // Brand primary blue
            border: "#374151"
        },
        
        // Layout configuration
        layout: {
            columns: 6,
            responsiveBreakpoints: {
                desktop: 1024,
                tablet: 768,
                mobile: 480
            },
            spacing: {
                padding: "60px 40px 30px",
                columnGap: "32px",
                rowGap: "24px"
            }
        },
        
        // Nigerian regulatory badges
        badges: [
            {
                id: "cbn",
                name: "Central Bank of Nigeria",
                description: "Licensed Microfinance Bank",
                image: "/assets/images/badges/cbn-licensed.svg",
                alt: "CBN Licensed"
            },
            {
                id: "ndpr",
                name: "NDPR Compliant",
                description: "Nigeria Data Protection Regulation",
                image: "/assets/images/badges/ndpr-compliant.svg",
                alt: "NDPR Compliant"
            },
            {
                id: "ncc",
                name: "NCC Certified",
                description: "Nigeria Communications Commission",
                image: "/assets/images/badges/ncc-certified.svg",
                alt: "NCC Certified"
            }
        ]
    },

    // ====================================================================
    // 2️⃣ FOOTER CONTENT SECTIONS (NIGERIAN CONTEXT)
    // ====================================================================
    sections: [
        {
            id: "borrowing",
            title: "Borrowing in Nigeria",
            links: [
                {
                    text: "Get Emergency Loan",
                    url: "/ng/borrower/apply",
                    description: "Quick loans for Nigerians in emergencies"
                },
                {
                    text: "Personal Loan",
                    url: "/ng/borrower/personal-loan",
                    description: "₦50,000 - ₦500,000 personal financing"
                },
                {
                    text: "Business Loan",
                    url: "/ng/borrower/business-loan",
                    description: "Working capital for Nigerian businesses"
                },
                {
                    text: "How to Apply",
                    url: "/ng/how-to-apply",
                    description: "Step-by-step guide for Nigerians"
                },
                {
                    text: "Active Borrowers",
                    url: "/ng/community/borrowers",
                    description: "See verified Nigerian borrowers"
                }
            ]
        },
        {
            id: "lending",
            title: "Lending in Nigeria",
            links: [
                {
                    text: "Smart Lending",
                    url: "/ng/lender/smart-lending",
                    description: "Responsible lending practices in Nigeria"
                },
                {
                    text: "Why Lend at M-Pesewa?",
                    url: "/ng/lender/why-lend",
                    description: "Benefits for Nigerian lenders"
                },
                {
                    text: "How to Lend",
                    url: "/ng/lender/how-to-lend",
                    description: "Start lending to trusted Nigerians"
                },
                {
                    text: "Lender Success Stories",
                    url: "/ng/lender/success-stories",
                    description: "Nigerian lenders achieving success"
                },
                {
                    text: "Active Lenders",
                    url: "/ng/community/lenders",
                    description: "Verified Nigerian lenders"
                }
            ]
        },
        {
            id: "platform",
            title: "How It Works (Nigeria)",
            links: [
                {
                    text: "P2P Lending Explained",
                    url: "/ng/how-it-works/p2p",
                    description: "Peer-to-peer lending in Nigerian context"
                },
                {
                    text: "Our Role",
                    url: "/ng/how-it-works/our-role",
                    description: "Technology platform, not a bank"
                },
                {
                    text: "Subscription Plans",
                    url: "/ng/subscription/plans",
                    description: "Nigerian Naira pricing"
                },
                {
                    text: "Blacklist System",
                    url: "/ng/blacklist",
                    description: "Default management for Nigeria"
                },
                {
                    text: "Debt Collectors (Nigeria)",
                    url: "/ng/debt-collectors",
                    description: "Vetted Nigerian debt recovery agents"
                }
            ]
        },
        {
            id: "company",
            title: "About M-Pesewa Nigeria",
            links: [
                {
                    text: "About Us",
                    url: "/ng/about",
                    description: "Our mission for Nigeria"
                },
                {
                    text: "Team & Advisory Board",
                    url: "/ng/about/team",
                    description: "Nigerian leadership team"
                },
                {
                    text: "News & Careers",
                    url: "/ng/careers",
                    description: "Jobs at M-Pesewa Nigeria"
                },
                {
                    text: "Blog & Nigerian Stories",
                    url: "/ng/blog",
                    description: "Success stories from Nigeria"
                },
                {
                    text: "Contact Nigerian Office",
                    url: "/ng/contact",
                    description: "Visit our Nigerian offices"
                }
            ]
        },
        {
            id: "legal",
            title: "Legal & Compliance (Nigeria)",
            links: [
                {
                    text: "Terms & Conditions",
                    url: "/ng/terms",
                    description: "Nigerian law governed"
                },
                {
                    text: "Privacy Policy",
                    url: "/ng/privacy",
                    description: "NDPR compliant for Nigeria"
                },
                {
                    text: "Grievance Redressal",
                    url: "/ng/grievance",
                    description: "Complaint resolution in Nigeria"
                },
                {
                    text: "Fair Practices Code",
                    url: "/ng/fair-practices",
                    description: "CBN guidelines compliance"
                },
                {
                    text: "AML/CFT Policy",
                    url: "/ng/aml-policy",
                    description: "Anti-money laundering for Nigeria"
                }
            ]
        },
        {
            id: "partners",
            title: "Partners in Nigeria",
            links: [
                {
                    text: "Become a Partner",
                    url: "/ng/partners",
                    description: "Partner with M-Pesewa Nigeria"
                },
                {
                    text: "Agent Network",
                    url: "/ng/agents",
                    description: "Join our agent network in Nigeria"
                },
                {
                    text: "Business Affiliates",
                    url: "/ng/affiliates",
                    description: "Affiliate program for Nigerians"
                },
                {
                    text: "API Developers",
                    url: "/ng/developers",
                    description: "Integrate with our Nigerian API"
                }
            ]
        }
    ],

    // ====================================================================
    // 3️⃣ COUNTRY-SPECIFIC CONTACT INFORMATION
    // ====================================================================
    contacts: {
        // Primary contact for Nigeria
        nigeria: {
            phone: "+234 800 000 0000",
            whatsapp: "+234 800 000 0001",
            email: "ng.support@mpesewa.com",
            emergency: "+234 800 000 0009",
            workingHours: "Monday - Friday, 8:00 AM - 6:00 PM (WAT)",
            emergencyHours: "24/7 via WhatsApp"
        },
        
        // Regional offices in Nigeria
        offices: [
            {
                city: "Lagos",
                address: "123 Adeola Odeku Street, Victoria Island, Lagos",
                phone: "+234 800 000 0001",
                email: "lagos.office@mpesewa.com",
                hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM"
            },
            {
                city: "Abuja",
                address: "Plot 123, Central Business District, Abuja",
                phone: "+234 800 000 0002",
                email: "abuja.office@mpesewa.com",
                hours: "Mon-Fri: 8AM-6PM"
            },
            {
                city: "Port Harcourt",
                address: "123 Aba Road, Port Harcourt, Rivers State",
                phone: "+234 800 000 0003",
                email: "ph.office@mpesewa.com",
                hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM"
            },
            {
                city: "Kano",
                address: "123 Murtala Mohammed Way, Kano",
                phone: "+234 800 000 0004",
                email: "kano.office@mpesewa.com",
                hours: "Mon-Sat: 8AM-6PM"
            }
        ],
        
        // Support channels for Nigeria
        supportChannels: [
            {
                name: "Phone Support",
                value: "+234 800 000 0000",
                icon: "📞",
                availability: "Mon-Fri 8AM-6PM"
            },
            {
                name: "WhatsApp",
                value: "+234 800 000 0001",
                icon: "💬",
                availability: "24/7"
            },
            {
                name: "Email",
                value: "ng.support@mpesewa.com",
                icon: "📧",
                availability: "24/7 (response within 4 hours)"
            },
            {
                name: "Live Chat",
                value: "Platform Chat",
                icon: "💬",
                availability: "Mon-Sat 8AM-8PM"
            }
        ]
    },

    // ====================================================================
    // 4️⃣ NIGERIAN STATE & REGIONAL INFORMATION
    // ====================================================================
    regions: {
        // Major regions in Nigeria
        geoRegions: [
            {
                name: "South West",
                states: ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"],
                coverage: "Full coverage",
                contact: "+234 800 000 0100"
            },
            {
                name: "South East",
                states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
                coverage: "Full coverage",
                contact: "+234 800 000 0200"
            },
            {
                name: "South South",
                states: ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"],
                coverage: "Full coverage",
                contact: "+234 800 000 0300"
            },
            {
                name: "North Central",
                states: ["Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "FCT"],
                coverage: "Full coverage",
                contact: "+234 800 000 0400"
            },
            {
                name: "North East",
                states: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"],
                coverage: "Partial coverage",
                contact: "+234 800 000 0500"
            },
            {
                name: "North West",
                states: ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"],
                coverage: "Full coverage",
                contact: "+234 800 000 0600"
            }
        ],
        
        // State-specific emergency numbers
        stateContacts: [
            { state: "Lagos", emergency: "+234 800 000 1001", support: "+234 800 000 1002" },
            { state: "Abuja (FCT)", emergency: "+234 800 000 2001", support: "+234 800 000 2002" },
            { state: "Kano", emergency: "+234 800 000 3001", support: "+234 800 000 3002" },
            { state: "Rivers", emergency: "+234 800 000 4001", support: "+234 800 000 4002" },
            { state: "Oyo", emergency: "+234 800 000 5001", support: "+234 800 000 5002" }
        ]
    },

    // ====================================================================
    // 5️⃣ SOCIAL MEDIA & COMMUNITY LINKS (NIGERIAN FOCUS)
    // ====================================================================
    social: {
        // Platform social media
        platforms: [
            {
                name: "Facebook",
                url: "https://facebook.com/mpesewa.nigeria",
                icon: "📘",
                handle: "@mpesewa.nigeria",
                followers: "50K+"
            },
            {
                name: "Twitter",
                url: "https://twitter.com/mpesewa_ng",
                icon: "🐦",
                handle: "@mpesewa_ng",
                followers: "25K+"
            },
            {
                name: "Instagram",
                url: "https://instagram.com/mpesewa.nigeria",
                icon: "📸",
                handle: "@mpesewa.nigeria",
                followers: "40K+"
            },
            {
                name: "LinkedIn",
                url: "https://linkedin.com/company/mpesewa-nigeria",
                icon: "💼",
                handle: "M-Pesewa Nigeria",
                followers: "10K+"
            },
            {
                name: "YouTube",
                url: "https://youtube.com/c/mpesewanigeria",
                icon: "📺",
                handle: "M-Pesewa Nigeria",
                subscribers: "15K+"
            }
        ],
        
        // Nigerian community groups
        communities: [
            {
                name: "WhatsApp Community",
                description: "Join Nigerian borrowers and lenders",
                link: "https://chat.whatsapp.com/mpesewa-ng",
                members: "10,000+"
            },
            {
                name: "Telegram Group",
                description: "Official Nigerian discussion group",
                link: "https://t.me/mpesewa_nigeria",
                members: "5,000+"
            },
            {
                name: "Facebook Group",
                description: "Nigerian success stories and tips",
                link: "https://facebook.com/groups/mpesewa.nigeria",
                members: "20,000+"
            }
        ],
        
        // App downloads for Nigeria
        apps: [
            {
                platform: "Google Play",
                url: "https://play.google.com/store/apps/details?id=com.mpesewa.nigeria",
                badge: "/assets/images/badges/google-play-badge.svg"
            },
            {
                platform: "Apple App Store",
                url: "https://apps.apple.com/ng/app/m-pesewa-nigeria/id1234567890",
                badge: "/assets/images/badges/app-store-badge.svg"
            },
            {
                platform: "Huawei AppGallery",
                url: "https://appgallery.huawei.com/app/C123456789",
                badge: "/assets/images/badges/huawei-badge.svg"
            }
        ]
    },

    // ====================================================================
    // 6️⃣ LEGAL & COMPLIANCE FOOTNOTES (NIGERIA SPECIFIC)
    // ====================================================================
    legal: {
        // Copyright and registration
        copyright: {
            text: "© 2016–2026, M-Pesewa Technology Nigeria Limited",
            registration: "Registered with CAC: RC 1234567",
            address: "123 Adeola Odeku Street, Victoria Island, Lagos, Nigeria"
        },
        
        // Regulatory disclosures
        disclosures: [
            "M-Pesewa is a technology platform, not a bank. We do not hold customer funds.",
            "Licensed by Central Bank of Nigeria as a Microfinance Bank. License No: MFB/1234/2025",
            "NDPR Compliant. Data Protection Certificate No: NDPR/2025/789",
            "All lending activities are between users. Platform earns only from lender subscriptions.",
            "Interest rates comply with CBN guidelines. Maximum 10% weekly interest."
        ],
        
        // Risk warnings
        warnings: [
            "LENDING INVOLVES RISK. Lenders may lose part or all of their capital.",
            "Past performance does not guarantee future results.",
            "Borrowers are responsible for timely repayment. Default affects credit rating.",
            "Platform does not guarantee loans or assume credit risk."
        ],
        
        // Nigerian legal requirements
        requirements: [
            "BVN and NIN verification required for all Nigerian users.",
            "All transactions must comply with Nigerian AML/CFT regulations.",
            "Tax obligations are the responsibility of users.",
            "Disputes governed by Nigerian law and resolved in Nigerian courts."
        ]
    },

    // ====================================================================
    // 7️⃣ COUNTRY TICKER & LOCATION DISPLAY
    // ====================================================================
    location: {
        // Nigerian states ticker
        statesTicker: {
            enabled: true,
            speed: "25s",
            direction: "left",
            states: [
                "Lagos", "Abuja (FCT)", "Kano", "Rivers", "Oyo", "Delta", "Kaduna", 
                "Ogun", "Ondo", "Enugu", "Edo", "Akwa Ibom", "Cross River", "Abia",
                "Plateau", "Sokoto", "Bornu", "Bauchi", "Imo", "Benue", "Anambra",
                "Ebonyi", "Ekiti", "Bayelsa", "Niger", "Taraba", "Kogi", "Kwara",
                "Nasarawa", "Gombe", "Yobe", "Zamfara", "Katsina", "Jigawa", "Kebbi",
                "Osun"
            ]
        },
        
        // Footer location widget
        widget: {
            enabled: true,
            title: "Serving Nigeria Nationwide",
            description: "Available in all 36 states + FCT",
            mapUrl: "/ng/coverage-map",
            agentFinderUrl: "/ng/find-agent"
        }
    },

    // ====================================================================
    // 8️⃣ FOOTER RENDERING CONFIGURATION
    // ====================================================================
    rendering: {
        // Template configuration
        template: "compact", // Options: compact, expanded, minimal
        showBadges: true,
        showSocial: true,
        showApps: true,
        showLegal: true,
        showContacts: true,
        
        // Dynamic elements
        dynamic: {
            showLiveSupport: true,
            showOfficeHours: true,
            showEmergencyContact: true,
            showRegionalInfo: true
        },
        
        // Performance optimization
        lazyLoad: true,
        deferImages: true,
        minifyHTML: true
    }
};

// ====================================================================
// FOOTER RENDERING FUNCTIONS
// ====================================================================

/**
 * Generate complete footer HTML for Nigeria
 * @param {Object} options - Rendering options
 * @returns {string} Complete footer HTML
 */
function generateNigeriaFooter(options = {}) {
    const config = { ...NigeriaFooter, ...options };
    
    return `
<!-- M-PESEWA NIGERIA FOOTER - DO NOT MODIFY -->
<footer id="mp-footer-ng" class="mp-footer ng-footer" style="background-color: ${config.structure.colors.background}; color: ${config.structure.colors.text};">
    <div class="footer-container" style="padding: ${config.structure.layout.spacing.padding};">
        
        <!-- Footer Grid -->
        <div class="footer-grid" style="display: grid; grid-template-columns: repeat(${config.structure.layout.columns}, 1fr); gap: ${config.structure.layout.spacing.columnGap};">
            ${config.sections.map(section => `
                <div class="footer-column">
                    <h4 class="footer-title" style="color: ${config.structure.colors.text}; margin-bottom: 16px; font-size: 15px;">
                        ${section.title}
                    </h4>
                    <ul class="footer-links" style="list-style: none; padding: 0; margin: 0;">
                        ${section.links.map(link => `
                            <li style="margin-bottom: 8px;">
                                <a href="${link.url}" 
                                   style="color: ${config.structure.colors.links}; text-decoration: none; display: block; padding: 4px 0;"
                                   onmouseover="this.style.color='${config.structure.colors.hover}'"
                                   onmouseout="this.style.color='${config.structure.colors.links}'"
                                   title="${link.description}">
                                    ${link.text}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
        
        <!-- Contact Information -->
        <div class="footer-contacts" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid ${config.structure.colors.border};">
            <div class="contact-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                ${config.contacts.supportChannels.map(channel => `
                    <div class="contact-channel">
                        <div class="contact-icon" style="font-size: 24px; margin-bottom: 8px;">${channel.icon}</div>
                        <div class="contact-name" style="font-weight: bold; margin-bottom: 4px;">${channel.name}</div>
                        <div class="contact-value">${channel.value}</div>
                        <div class="contact-availability" style="font-size: 12px; color: ${config.structure.colors.links};">
                            ${channel.availability}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Nigerian States Ticker -->
        <div class="states-ticker" style="overflow: hidden; background: #111827; padding: 12px 0; margin-top: 30px; border-radius: 4px;">
            <div class="ticker-track" style="white-space: nowrap; display: inline-block; color: #ffffff; animation: scroll-left ${config.location.statesTicker.speed} linear infinite; padding-left: 100%;">
                ${config.location.statesTicker.states.map(state => `🇳🇬 ${state} • `).join('')}
                ${config.location.statesTicker.states.map(state => `🇳🇬 ${state} • `).join('')}
            </div>
            <style>
                @keyframes scroll-left {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            </style>
        </div>
        
        <!-- Social Media & Apps -->
        <div class="footer-social" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid ${config.structure.colors.border};">
            <div class="social-apps-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <!-- Social Media -->
                <div class="social-section">
                    <h5 style="margin-bottom: 16px; color: ${config.structure.colors.text};">Connect With Us</h5>
                    <div class="social-links" style="display: flex; gap: 16px;">
                        ${config.social.platforms.map(platform => `
                            <a href="${platform.url}" 
                               class="social-link" 
                               style="color: ${config.structure.colors.links}; text-decoration: none; padding: 8px 12px; border: 1px solid ${config.structure.colors.border}; border-radius: 4px;"
                               title="${platform.name}: ${platform.followers} followers">
                                ${platform.icon} ${platform.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <!-- App Downloads -->
                <div class="apps-section">
                    <h5 style="margin-bottom: 16px; color: ${config.structure.colors.text};">Download Our App</h5>
                    <div class="app-badges" style="display: flex; gap: 12px; flex-wrap: wrap;">
                        ${config.social.apps.map(app => `
                            <a href="${app.url}" style="display: inline-block;">
                                <img src="${app.badge}" alt="Download on ${app.platform}" style="height: 40px;">
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Legal & Compliance -->
        <div class="footer-legal" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid ${config.structure.colors.border};">
            <!-- Regulatory Badges -->
            <div class="compliance-badges" style="display: flex; gap: 20px; margin-bottom: 20px; justify-content: center;">
                ${config.structure.badges.map(badge => `
                    <img src="${badge.image}" 
                         alt="${badge.alt}" 
                         title="${badge.name}: ${badge.description}"
                         style="height: 40px;">
                `).join('')}
            </div>
            
            <!-- Copyright -->
            <div class="copyright" style="text-align: center; margin-bottom: 16px;">
                <strong>${config.legal.copyright.text}</strong><br>
                ${config.legal.copyright.registration} | ${config.legal.copyright.address}
            </div>
            
            <!-- Disclosures -->
            <div class="disclosures" style="font-size: 12px; color: ${config.structure.colors.links}; text-align: center; line-height: 1.6; max-width: 800px; margin: 0 auto;">
                ${config.legal.disclosures.map(disclosure => `
                    <div style="margin-bottom: 8px;">${disclosure}</div>
                `).join('')}
            </div>
            
            <!-- Warning -->
            <div class="warnings" style="font-size: 11px; color: #f87171; text-align: center; margin-top: 16px; padding: 12px; background: rgba(248, 113, 113, 0.1); border-radius: 4px;">
                ${config.legal.warnings.map(warning => `
                    <div style="margin-bottom: 4px;">⚠️ ${warning}</div>
                `).join('')}
            </div>
            
            <!-- Quick Links -->
            <div class="quick-links" style="text-align: center; margin-top: 20px; font-size: 13px;">
                <a href="/ng/terms" style="color: ${config.structure.colors.links}; margin: 0 12px;">Terms & Conditions</a> |
                <a href="/ng/privacy" style="color: ${config.structure.colors.links}; margin: 0 12px;">Privacy Policy</a> |
                <a href="/ng/aml-policy" style="color: ${config.structure.colors.links}; margin: 0 12px;">AML Policy</a> |
                <a href="/ng/sitemap" style="color: ${config.structure.colors.links}; margin: 0 12px;">Sitemap</a> |
                <a href="/ng/accessibility" style="color: ${config.structure.colors.links}; margin: 0 12px;">Accessibility</a>
            </div>
        </div>
    </div>
</footer>
<!-- END M-PESEWA NIGERIA FOOTER -->
    `;
}

/**
 * Generate mobile-optimized footer for Nigeria
 * @returns {string} Mobile footer HTML
 */
function generateMobileNigeriaFooter() {
    return `
<!-- M-PESEWA NIGERIA MOBILE FOOTER -->
<footer class="mp-footer-mobile ng-footer-mobile" style="background-color: ${NigeriaFooter.structure.colors.background}; color: ${NigeriaFooter.structure.colors.text};">
    <div class="footer-mobile-container" style="padding: 20px;">
        
        <!-- Mobile Accordion Sections -->
        ${NigeriaFooter.sections.map((section, index) => `
            <div class="mobile-footer-section">
                <button class="mobile-footer-toggle" 
                        onclick="toggleMobileFooter(${index})"
                        style="width: 100%; text-align: left; padding: 12px; background: none; border: none; color: ${NigeriaFooter.structure.colors.text}; border-bottom: 1px solid ${NigeriaFooter.structure.colors.border}; display: flex; justify-content: space-between; align-items: center;">
                    <span>${section.title}</span>
                    <span style="font-size: 18px;">+</span>
                </button>
                <div class="mobile-footer-content" id="mobile-section-${index}" style="display: none; padding: 12px; background: rgba(255,255,255,0.05);">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${section.links.map(link => `
                            <li style="margin-bottom: 8px;">
                                <a href="${link.url}" 
                                   style="color: ${NigeriaFooter.structure.colors.links}; text-decoration: none; display: block; padding: 6px 0;"
                                   title="${link.description}">
                                    ${link.text}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('')}
        
        <!-- Mobile Contact -->
        <div class="mobile-contact" style="margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <h4 style="margin-bottom: 12px;">Contact Nigeria Support</h4>
            <div style="margin-bottom: 12px;">
                <strong>Phone:</strong> ${NigeriaFooter.contacts.nigeria.phone}
            </div>
            <div style="margin-bottom: 12px;">
                <strong>WhatsApp:</strong> ${NigeriaFooter.contacts.nigeria.whatsapp}
            </div>
            <div>
                <strong>Hours:</strong> ${NigeriaFooter.contacts.nigeria.workingHours}
            </div>
        </div>
        
        <!-- Mobile Copyright -->
        <div class="mobile-copyright" style="margin-top: 20px; text-align: center; font-size: 12px; color: ${NigeriaFooter.structure.colors.links}; padding-top: 20px; border-top: 1px solid ${NigeriaFooter.structure.colors.border};">
            ${NigeriaFooter.legal.copyright.text}<br>
            ${NigeriaFooter.legal.copyright.registration}
        </div>
        
    </div>
    
    <script>
        function toggleMobileFooter(index) {
            const content = document.getElementById('mobile-section-' + index);
            const toggle = content.previousElementSibling;
            const icon = toggle.querySelector('span:last-child');
            
            if (content.style.display === 'none' || !content.style.display) {
                content.style.display = 'block';
                icon.textContent = '−';
            } else {
                content.style.display = 'none';
                icon.textContent = '+';
            }
        }
    </script>
</footer>
    `;
}

/**
 * Generate footer JSON-LD structured data for Nigeria
 * @returns {string} JSON-LD script tag
 */
function generateNigeriaStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "M-Pesewa Nigeria",
        "description": "Emergency micro-lending platform for Nigeria",
        "url": "https://mpesewa.com/ng",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Adeola Odeku Street",
            "addressLocality": "Victoria Island",
            "addressRegion": "Lagos",
            "addressCountry": "NG",
            "postalCode": "101241"
        },
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": "+234-800-000-0000",
                "contactType": "customer service",
                "areaServed": "NG",
                "availableLanguage": ["English", "Pidgin", "Hausa", "Yoruba", "Igbo"]
            }
        ],
        "openingHours": "Mo-Fr 08:00-18:00, Sa 09:00-16:00",
        "paymentAccepted": "Bank Transfer, USSD, Mobile Banking",
        "currenciesAccepted": "NGN",
        "priceRange": "₦",
        "legalName": "M-Pesewa Technology Nigeria Limited",
        "foundingDate": "2016",
        "founder": {
            "@type": "Person",
            "name": "M-Pesewa Nigeria Team"
        },
        "numberOfEmployees": {
            "@type": "QuantitativeValue",
            "value": "150"
        },
        "areaServed": {
            "@type": "Country",
            "name": "Nigeria"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Micro-lending Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Emergency Loans",
                        "description": "Short-term emergency loans for Nigerians"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Peer-to-Peer Lending",
                        "description": "Lending platform for Nigerian investors"
                    }
                }
            ]
        }
    };
    
    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}

/**
 * Validate footer content for Nigerian compliance
 * @param {string} footerHTML - Footer HTML to validate
 * @returns {Object} Validation result
 */
function validateNigeriaFooter(footerHTML) {
    const requirements = [
        { check: 'CBN License', regex: /CBN|Central Bank of Nigeria/i, required: true },
        { check: 'NDPR Compliance', regex: /NDPR|Data Protection/i, required: true },
        { check: 'Copyright', regex: /©|Copyright/i, required: true },
        { check: 'Risk Warning', regex: /LENDING INVOLVES RISK|Risk warning/i, required: true },
        { check: 'Contact Information', regex: /\+234|Nigeria.*support/i, required: true },
        { check: 'Terms Link', regex: /Terms.*Conditions|Terms.*link/i, required: true },
        { check: 'Privacy Policy', regex: /Privacy.*Policy|Privacy.*link/i, required: true }
    ];
    
    const results = requirements.map(req => ({
        requirement: req.check,
        passed: req.regex.test(footerHTML),
        required: req.required
    }));
    
    const allRequiredPassed = results.filter(r => r.required).every(r => r.passed);
    
    return {
        valid: allRequiredPassed,
        results: results,
        score: `${results.filter(r => r.passed).length}/${results.length}`,
        missing: results.filter(r => !r.passed).map(r => r.requirement)
    };
}

// ====================================================================
// EXPORT MODULE
// ====================================================================
module.exports = {
    footer: NigeriaFooter,
    generateNigeriaFooter,
    generateMobileNigeriaFooter,
    generateNigeriaStructuredData,
    validateNigeriaFooter
};

// ====================================================================
// INITIALIZATION
// ====================================================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║             M-PESEWA NIGERIA FOOTER MODULE                ║
║             Complete Footer Configuration                 ║
╚════════════════════════════════════════════════════════════╝

Footer Structure:
• Sections: ${NigeriaFooter.sections.length} columns
• Colors: Background ${NigeriaFooter.structure.colors.background}
• Layout: ${NigeriaFooter.structure.layout.columns} columns responsive

Content Sections:
${NigeriaFooter.sections.map(s => `  • ${s.title}: ${s.links.length} links`).join('\n')}

Contact Information:
• Primary Phone: ${NigeriaFooter.contacts.nigeria.phone}
• WhatsApp: ${NigeriaFooter.contacts.nigeria.whatsapp}
• Email: ${NigeriaFooter.contacts.nigeria.email}
• Offices: ${NigeriaFooter.contacts.offices.length} locations

Social Media:
• Platforms: ${NigeriaFooter.social.platforms.length}
• Communities: ${NigeriaFooter.social.communities.length}
• App Stores: ${NigeriaFooter.social.apps.length}

Legal Compliance:
• Badges: ${NigeriaFooter.structure.badges.length} regulatory badges
• Disclosures: ${NigeriaFooter.legal.disclosures.length} required disclosures
• Warnings: ${NigeriaFooter.legal.warnings.length} risk warnings

Available Functions:
• generateNigeriaFooter() - Complete footer HTML
• generateMobileNigeriaFooter() - Mobile-optimized footer
• generateNigeriaStructuredData() - SEO structured data
• validateNigeriaFooter() - Compliance validation

Ready to render Nigerian footer with full compliance.
`);