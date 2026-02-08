/**
 * M-PESEWA GHANA FOOTER CONFIGURATION
 * Country-specific footer content, links, and contact information
 * Last Updated: 2024
 * Version: 1.0.0
 * 
 * ✅ STRICT ISOLATION: Ghana-only footer content
 * ✅ COMPLIANCE: Bank of Ghana, Data Protection Commission requirements
 * ✅ LOCALIZATION: Ghanaian languages, currency, and contact details
 * ✅ HIERARCHY: Follows Global → Country → Groups structure
 */

const GHANA_FOOTER = {
    // ============================================
    // 1️⃣ FOOTER STRUCTURE & LAYOUT
    // ============================================
    structure: {
        columns: 6,
        layout: 'grid',
        backgroundColor: '#1f2a37', // Neutral Dark Slate
        textColor: '#ffffff',
        linkColor: '#d1d5db',
        hoverColor: '#0099ff', // Secondary Brand Blue
        accentColor: '#003366', // Primary Brand Blue
        borderTop: '2px solid #0099ff',
        padding: {
            top: '60px',
            bottom: '30px',
            sides: '40px'
        }
    },

    // ============================================
    // 2️⃣ COLUMN 1: BORROWING (GHANA SPECIFIC)
    // ============================================
    borrowing: {
        title: 'Borrowing in Ghana',
        links: [
            {
                text: 'Get Emergency Loan',
                url: '/gh/borrower/apply',
                description: 'Quick loans for urgent needs in Ghana',
                icon: '🚨'
            },
            {
                text: 'Personal Loans',
                url: '/gh/borrower/apply?type=personal',
                description: 'Personal loans for Ghanaians',
                icon: '💼'
            },
            {
                text: 'Business Loans',
                url: '/gh/borrower/apply?type=business',
                description: 'Business funding for Ghanaian entrepreneurs',
                icon: '🏢'
            },
            {
                text: 'How to Apply in Ghana',
                url: '/gh/how-it-works',
                description: 'Step-by-step guide for Ghanaian borrowers',
                icon: '📋'
            },
            {
                text: 'Ghanaian Borrowers',
                url: '/gh/community/borrowers',
                description: 'Active borrowers in Ghana',
                icon: '👥'
            },
            {
                text: 'Loan Calculator Ghana',
                url: '/gh/calculator',
                description: 'Calculate loan repayments in GHS',
                icon: '🧮'
            }
        ],
        localInfo: {
            currency: 'GHS (Ghanaian Cedi)',
            maxLoan: 'Up to GH₵20,000',
            interest: '10% per week',
            repayment: '7 days',
            eligibility: 'Ghana residents 18+'
        }
    },

    // ============================================
    // 3️⃣ COLUMN 2: LENDING (GHANA SPECIFIC)
    // ============================================
    lending: {
        title: 'Lending in Ghana',
        links: [
            {
                text: 'Smart Lending Ghana',
                url: '/gh/lender/rules',
                description: 'Responsible lending practices for Ghana',
                icon: '🎯'
            },
            {
                text: 'Why Lend in Ghana',
                url: '/gh/lender/why-lend',
                description: 'Benefits of lending in the Ghanaian market',
                icon: '🇬🇭'
            },
            {
                text: 'How to Lend in Ghana',
                url: '/gh/lender/how-to-lend',
                description: 'Step-by-step guide for Ghanaian lenders',
                icon: '📚'
            },
            {
                text: 'Ghanaian Lenders',
                url: '/gh/community/lenders',
                description: 'Active lenders in Ghana',
                icon: '🤝'
            },
            {
                text: 'Ghana Lender FAQs',
                url: '/gh/help/faq?category=lending',
                description: 'Frequently asked questions for lenders',
                icon: '❓'
            },
            {
                text: 'Risk Management Ghana',
                url: '/gh/lender/risk',
                description: 'Managing lending risks in Ghana',
                icon: '🛡️'
            }
        ],
        localInfo: {
            subscription: 'Required for lenders',
            tiers: 'Basic, Premium, Super',
            returns: '10% weekly interest',
            limits: 'Up to GH₵50,000/week',
            compliance: 'Bank of Ghana regulations'
        }
    },

    // ============================================
    // 4️⃣ COLUMN 3: PLATFORM (GHANA OPERATIONS)
    // ============================================
    platform: {
        title: 'How It Works in Ghana',
        links: [
            {
                text: 'P2P Lending in Ghana',
                url: '/gh/how-it-works',
                description: 'Peer-to-peer lending explained for Ghana',
                icon: '🔄'
            },
            {
                text: 'Our Role in Ghana',
                url: '/gh/about#our-role',
                description: 'Platform role in Ghanaian financial ecosystem',
                icon: '🏛️'
            },
            {
                text: 'Subscriptions Ghana',
                url: '/gh/subscription/plans',
                description: 'Subscription plans for Ghanaian lenders',
                icon: '💰'
            },
            {
                text: 'Blacklist Ghana',
                url: '/gh/blacklist/public',
                description: 'Defaulters registry for Ghana',
                icon: '🚫'
            },
            {
                text: 'Debt Collectors Ghana',
                url: '/gh/collectors',
                description: 'Registered debt collectors in Ghana',
                icon: '⚖️'
            },
            {
                text: 'Trust Circles Ghana',
                url: '/gh/groups',
                description: 'How trust circles work in Ghana',
                icon: '👨‍👩‍👧‍👦'
            }
        ],
        localInfo: {
            groups: 'Trust-based circles',
            isolation: 'No cross-country lending',
            security: 'Ghana data protection',
            support: 'Local Ghanaian support'
        }
    },

    // ============================================
    // 5️⃣ COLUMN 4: COMPANY (GHANA PRESENCE)
    // ============================================
    company: {
        title: 'About M-Pesewa Ghana',
        links: [
            {
                text: 'About M-Pesewa Ghana',
                url: '/gh/about',
                description: 'Our mission and vision for Ghana',
                icon: '🏢'
            },
            {
                text: 'Ghana Team & Advisors',
                url: '/gh/about#team',
                description: 'Our Ghanaian team and advisory board',
                icon: '👨‍💼'
            },
            {
                text: 'News & Careers Ghana',
                url: '/gh/news',
                description: 'Latest news and job opportunities in Ghana',
                icon: '📰'
            },
            {
                text: 'Blog & FAQs Ghana',
                url: '/gh/faq',
                description: 'Blog and frequently asked questions for Ghana',
                icon: '📝'
            },
            {
                text: 'Contact Us Ghana',
                url: '/gh/contact',
                description: 'Contact information for Ghana operations',
                icon: '📞'
            },
            {
                text: 'Visit Our Ghana Office',
                url: '/gh/contact#office',
                description: 'Visit our offices in Accra and Kumasi',
                icon: '📍'
            }
        ],
        localInfo: {
            established: '2024 in Ghana',
            headquarters: 'Accra, Ghana',
            registration: 'Registered in Ghana',
            compliance: 'Bank of Ghana compliant'
        }
    },

    // ============================================
    // 6️⃣ COLUMN 5: LEGAL & COMPLIANCE (GHANA SPECIFIC)
    // ============================================
    legal: {
        title: 'Legal & Compliance Ghana',
        links: [
            {
                text: 'Terms & Conditions Ghana',
                url: '/gh/legal/terms',
                description: 'Ghana-specific terms and conditions',
                icon: '📜'
            },
            {
                text: 'Privacy Policy Ghana',
                url: '/gh/legal/privacy',
                description: 'Data protection policy for Ghana',
                icon: '🔒'
            },
            {
                text: 'Grievance Redressal Ghana',
                url: '/gh/grievance',
                description: 'Complaint resolution process for Ghana',
                icon: '⚖️'
            },
            {
                text: 'Fair Practices Code Ghana',
                url: '/gh/fair-practices',
                description: 'Fair lending practices in Ghana',
                icon: '⚖️'
            },
            {
                text: 'AML/CFT Policy Ghana',
                url: '/gh/aml-policy',
                description: 'Anti-money laundering policy for Ghana',
                icon: '💰'
            },
            {
                text: 'Consumer Protection Ghana',
                url: '/gh/consumer-protection',
                description: 'Consumer rights in Ghana',
                icon: '🛡️'
            }
        ],
        localInfo: {
            regulator: 'Bank of Ghana',
            dataProtection: 'Data Protection Commission',
            jurisdiction: 'Ghanaian courts',
            arbitration: 'Accra, Ghana'
        }
    },

    // ============================================
    // 7️⃣ COLUMN 6: PARTNERSHIPS (GHANA NETWORK)
    // ============================================
    partnerships: {
        title: 'Partnerships in Ghana',
        links: [
            {
                text: 'Become a Partner in Ghana',
                url: '/gh/partners',
                description: 'Partner with M-Pesewa in Ghana',
                icon: '🤝'
            },
            {
                text: 'Agent Network Ghana',
                url: '/gh/agents',
                description: 'Join our agent network in Ghana',
                icon: '👨‍💼'
            },
            {
                text: 'Corporate Partnerships',
                url: '/gh/corporate-partners',
                description: 'Corporate partnership opportunities',
                icon: '🏢'
            },
            {
                text: 'NGO Collaborations',
                url: '/gh/ngo-partners',
                description: 'Collaborate with NGOs in Ghana',
                icon: '🌍'
            },
            {
                text: 'Financial Institutions',
                url: '/gh/bank-partners',
                description: 'Partner banks in Ghana',
                icon: '🏦'
            },
            {
                text: 'Technology Partners',
                url: '/gh/tech-partners',
                description: 'Technology partners in Ghana',
                icon: '💻'
            }
        ],
        socialMedia: [
            {
                platform: 'Facebook',
                url: 'https://facebook.com/mpesewaghana',
                icon: '📘',
                handle: '@mpesewaghana',
                followers: '5K+'
            },
            {
                platform: 'Twitter',
                url: 'https://twitter.com/mpesewa_gh',
                icon: '🐦',
                handle: '@mpesewa_gh',
                followers: '3K+'
            },
            {
                platform: 'Instagram',
                url: 'https://instagram.com/mpesewa_ghana',
                icon: '📸',
                handle: '@mpesewa_ghana',
                followers: '2K+'
            },
            {
                platform: 'LinkedIn',
                url: 'https://linkedin.com/company/mpesewa-ghana',
                icon: '💼',
                handle: 'M-Pesewa Ghana',
                followers: '1K+'
            },
            {
                platform: 'YouTube',
                url: 'https://youtube.com/@mpesewaghana',
                icon: '📺',
                handle: 'M-Pesewa Ghana',
                subscribers: '500+'
            }
        ]
    },

    // ============================================
    // 8️⃣ COUNTRY TICKER (GHANA FOCUS)
    // ============================================
    countryTicker: {
        enabled: true,
        direction: 'left',
        speed: '25s',
        backgroundColor: '#111827',
        textColor: '#ffffff',
        fontSize: '13px',
        content: [
            '🇬🇭 Ghana • 🇬🇭 Accra • 🇬🇭 Kumasi • 🇬🇭 Tamale • 🇬🇭 Takoradi • 🇬🇭 Cape Coast • 🇬🇭 Sunyani • 🇬🇭 Ho • 🇬🇭 Koforidua • 🇬🇭 Wa • 🇬🇭 Bolgatanga • 🇬🇭 Ghana • 🇬🇭 Accra • 🇬🇭 Kumasi • 🇬🇭 Tamale • 🇬🇭 Takoradi • 🇬🇭 Cape Coast • 🇬🇭 Sunyani • 🇬🇭 Ho • 🇬🇭 Koforidua • 🇬🇭 Wa • 🇬🇭 Bolgatanga'
        ]
    },

    // ============================================
    // 9️⃣ FOOTER BOTTOM SECTION
    // ============================================
    bottomSection: {
        backgroundColor: '#0f172a',
        textColor: '#94a3b8',
        borderTop: '1px solid #334155',
        padding: '20px 0',
        
        copyright: {
            text: '© 2016–2026, M-Pesewa Ghana (Technology Pvt. Ltd.) — All Rights Reserved',
            registration: 'Registered in Ghana under Companies Act, 2019 (Act 992)',
            vat: 'VAT Registered: GH123456789',
            dataProtection: 'Data Protection Registration: DPC/REG/XXXX/2024'
        },

        countryContacts: {
            title: 'Contact M-Pesewa Ghana',
            contacts: [
                {
                    region: 'Greater Accra',
                    phone: '+233 24 000 0000',
                    address: '123 Independence Avenue, Airport City, Accra'
                },
                {
                    region: 'Ashanti Region',
                    phone: '+233 32 000 0000',
                    address: 'Prempeh II Street, Adum, Kumasi'
                },
                {
                    region: 'Northern Region',
                    phone: '+233 37 000 0000',
                    address: 'Central Business District, Tamale'
                },
                {
                    region: 'Western Region',
                    phone: '+233 31 000 0000',
                    address: 'Market Circle, Takoradi'
                }
            ],
            email: 'ghana@mpesewa.com',
            emergency: '+233 24 000 0001 (24/7 Support)'
        },

        legalLinks: {
            links: [
                { text: 'Sitemap', url: '/gh/sitemap' },
                { text: 'Accessibility', url: '/gh/accessibility' },
                { text: 'Security', url: '/gh/security' },
                { text: 'Report Issue', url: '/gh/report' },
                { text: 'Cookies Policy', url: '/gh/cookies' },
                { text: 'Do Not Sell My Info', url: '/gh/do-not-sell' }
            ],
            separator: '|'
        },

        badges: [
            {
                name: 'Bank of Ghana Compliant',
                image: '/assets/images/gh/badges/bog-compliant.png',
                alt: 'Bank of Ghana Compliance Badge'
            },
            {
                name: 'Data Protection Commission',
                image: '/assets/images/gh/badges/dpc-registered.png',
                alt: 'Data Protection Commission Registered'
            },
            {
                name: 'SSL Secure',
                image: '/assets/images/gh/badges/ssl-secure.png',
                alt: 'SSL Secure Badge'
            },
            {
                name: 'PCI DSS Compliant',
                image: '/assets/images/gh/badges/pci-dss.png',
                alt: 'PCI DSS Compliant'
            }
        ]
    },

    // ============================================
    // 🔟 LANGUAGE & LOCALIZATION
    // ============================================
    localization: {
        languages: [
            {
                code: 'en',
                name: 'English',
                native: 'English',
                default: true,
                direction: 'ltr'
            },
            {
                code: 'ak',
                name: 'Twi',
                native: 'Twi',
                default: false,
                direction: 'ltr',
                coverage: 'Ashanti Region'
            },
            {
                code: 'ee',
                name: 'Ewe',
                native: 'Eʋegbe',
                default: false,
                direction: 'ltr',
                coverage: 'Volta Region'
            },
            {
                code: 'dag',
                name: 'Dagbani',
                native: 'Dagbanli',
                default: false,
                direction: 'ltr',
                coverage: 'Northern Region'
            }
        ],
        currency: {
            primary: 'GHS',
            symbol: 'GH₵',
            name: 'Ghanaian Cedi',
            format: '{symbol}{amount}',
            decimal: 2
        },
        timezone: 'Africa/Accra (GMT)',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: '1,234.56'
    },

    // ============================================
    // 1️⃣1️⃣ QUICK LINKS & UTILITIES
    // ============================================
    quickLinks: {
        popular: [
            { text: 'Loan Calculator', url: '/gh/calculator', icon: '🧮' },
            { text: 'Interest Rates', url: '/gh/interest-rates', icon: '📈' },
            { text: 'Repayment Schedule', url: '/gh/repayment', icon: '📅' },
            { text: 'Blacklist Check', url: '/gh/blacklist/check', icon: '🔍' },
            { text: 'Group Finder', url: '/gh/groups/find', icon: '🔎' },
            { text: 'Mobile App', url: '/gh/app', icon: '📱' }
        ],
        tools: [
            { text: 'Currency Converter', url: '/gh/converter', icon: '💱' },
            { text: 'Repayment Calculator', url: '/gh/repayment-calculator', icon: '📊' },
            { text: 'Loan Comparison', url: '/gh/compare', icon: '⚖️' },
            { text: 'Budget Planner', url: '/gh/budget', icon: '💰' },
            { text: 'Financial Education', url: '/gh/education', icon: '🎓' },
            { text: 'Credit Score Check', url: '/gh/credit-score', icon: '📝' }
        ]
    },

    // ============================================
    // 1️⃣2️⃣ NEWSLETTER & UPDATES
    // ============================================
    newsletter: {
        enabled: true,
        title: 'Stay Updated in Ghana',
        description: 'Get the latest on loans, interest rates, and financial tips in Ghana',
        placeholder: 'Enter your email for Ghana updates',
        buttonText: 'Subscribe',
        frequency: 'Weekly updates',
        privacyText: 'We respect your privacy. No spam, Ghana-focused content only.',
        topics: [
            'Ghana loan market updates',
            'Interest rate changes',
            'New features for Ghana',
            'Financial literacy tips',
            'Success stories from Ghana'
        ]
    },

    // ============================================
    // 1️⃣3️⃣ DOWNLOAD LINKS
    // ============================================
    downloads: {
        appStore: {
            enabled: true,
            url: 'https://apps.apple.com/gh/app/m-pesewa-ghana/id1234567890',
            badge: '/assets/images/gh/download/app-store.svg',
            alt: 'Download on the App Store'
        },
        googlePlay: {
            enabled: true,
            url: 'https://play.google.com/store/apps/details?id=com.mpesewa.ghana',
            badge: '/assets/images/gh/download/google-play.svg',
            alt: 'Get it on Google Play'
        },
        huaweiAppGallery: {
            enabled: true,
            url: 'https://appgallery.huawei.com/app/C123456789',
            badge: '/assets/images/gh/download/app-gallery.svg',
            alt: 'Explore it on AppGallery'
        },
        webApp: {
            enabled: true,
            url: '/gh/pwa',
            badge: '/assets/images/gh/download/pwa.svg',
            alt: 'Install Web App'
        }
    },

    // ============================================
    // 1️⃣4️⃣ BUSINESS HOURS & SUPPORT
    // ============================================
    businessHours: {
        support: {
            weekdays: 'Monday - Friday: 8:00 AM - 8:00 PM GMT',
            weekends: 'Saturday: 9:00 AM - 6:00 PM GMT',
            sunday: 'Sunday: 10:00 AM - 4:00 PM GMT',
            holidays: 'Public Holidays: 10:00 AM - 4:00 PM GMT'
        },
        emergency: {
            available: '24/7 Emergency Support',
            phone: '+233 24 000 0001',
            email: 'emergency@mpesewa.com.gh',
            response: 'Within 2 hours'
        },
        offices: {
            accra: {
                address: '123 Independence Avenue, Airport City, Accra',
                hours: 'Mon-Fri: 8:30 AM - 5:30 PM',
                phone: '+233 24 000 0002'
            },
            kumasi: {
                address: 'Prempeh II Street, Adum, Kumasi',
                hours: 'Mon-Fri: 8:30 AM - 5:00 PM',
                phone: '+233 32 000 0001'
            },
            tamale: {
                address: 'Central Business District, Tamale',
                hours: 'Mon-Fri: 8:30 AM - 5:00 PM',
                phone: '+233 37 000 0001'
            }
        }
    },

    // ============================================
    // 1️⃣5️⃣ REGULATORY DISCLOSURES
    // ============================================
    disclosures: {
        financial: [
            'M-Pesewa Ghana is not a bank and does not accept deposits.',
            'We are a technology platform facilitating peer-to-peer lending.',
            'All loans are between users; we do not guarantee repayments.',
            'Lender subscriptions are our only revenue source.',
            'Interest rates are set by lenders and borrowers, maximum 10% weekly.'
        ],
        regulatory: [
            'Registered with Data Protection Commission Ghana.',
            'Compliant with Bank of Ghana regulations for peer-to-peer platforms.',
            'AML/CFT compliance in accordance with Ghanaian law.',
            'Consumer protection in line with Ghana Consumer Protection Act.',
            'Tax compliant with Ghana Revenue Authority.'
        ],
        risk: [
            'Lending involves risk of borrower default.',
            'Past performance does not guarantee future results.',
            'Borrowers should only borrow what they can repay.',
            'Platform does not provide investment advice.',
            'Users are responsible for their own tax obligations.'
        ]
    }
};

// ============================================
// FOOTER UTILITIES & FUNCTIONS
// ============================================

/**
 * Generate Ghana footer HTML structure
 * @param {Object} options - Footer options
 * @returns {string} HTML structure
 */
function generateGhanaFooterHTML(options = {}) {
    const config = { ...GHANA_FOOTER, ...options };
    
    const html = `
        <footer class="mp-footer gh-footer" id="ghana-footer">
            <div class="footer-top">
                <div class="container">
                    <div class="footer-grid">
                        <!-- Column 1: Borrowing -->
                        <div class="footer-col">
                            <h4 class="footer-col-title">${config.borrowing.title}</h4>
                            ${config.borrowing.links.map(link => `
                                <a href="${link.url}" class="footer-link" title="${link.description}">
                                    ${link.icon ? `<span class="footer-link-icon">${link.icon}</span>` : ''}
                                    ${link.text}
                                </a>
                            `).join('')}
                        </div>

                        <!-- Column 2: Lending -->
                        <div class="footer-col">
                            <h4 class="footer-col-title">${config.lending.title}</h4>
                            ${config.lending.links.map(link => `
                                <a href="${link.url}" class="footer-link" title="${link.description}">
                                    ${link.icon ? `<span class="footer-link-icon">${link.icon}</span>` : ''}
                                    ${link.text}
                                </a>
                            `).join('')}
                        </div>

                        <!-- Column 3: Platform -->
                        <div class="footer-col">
                            <h4 class="footer-col-title">${config.platform.title}</h4>
                            ${config.platform.links.map(link => `
                                <a href="${link.url}" class="footer-link" title="${link.description}">
                                    ${link.icon ? `<span class="footer-link-icon">${link.icon}</span>` : ''}
                                    ${link.text}
                                </a>
                            `).join('')}
                        </div>

                        <!-- Column 4: Company -->
                        <div class="footer-col">
                            <h4 class="footer-col-title">${config.company.title}</h4>
                            ${config.company.links.map(link => `
                                <a href="${link.url}" class="footer-link" title="${link.description}">
                                    ${link.icon ? `<span class="footer-link-icon">${link.icon}</span>` : ''}
                                    ${link.text}
                                </a>
                            `).join('')}
                        </div>

                        <!-- Column 5: Legal -->
                        <div class="footer-col">
                            <h4 class="footer-col-title">${config.legal.title}</h4>
                            ${config.legal.links.map(link => `
                                <a href="${link.url}" class="footer-link" title="${link.description}">
                                    ${link.icon ? `<span class="footer-link-icon">${link.icon}</span>` : ''}
                                    ${link.text}
                                </a>
                            `).join('')}
                        </div>

                        <!-- Column 6: Partnerships -->
                        <div class="footer-col">
                            <h4 class="footer-col-title">${config.partnerships.title}</h4>
                            ${config.partnerships.links.map(link => `
                                <a href="${link.url}" class="footer-link" title="${link.description}">
                                    ${link.icon ? `<span class="footer-link-icon">${link.icon}</span>` : ''}
                                    ${link.text}
                                </a>
                            `).join('')}
                            
                            <!-- Social Media -->
                            <div class="social-links">
                                ${config.partnerships.socialMedia.map(social => `
                                    <a href="${social.url}" class="social-link" aria-label="${social.platform}" title="${social.handle}">
                                        ${social.icon}
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Newsletter -->
                    ${config.newsletter.enabled ? `
                        <div class="newsletter-section">
                            <h4>${config.newsletter.title}</h4>
                            <p>${config.newsletter.description}</p>
                            <form class="newsletter-form">
                                <input type="email" placeholder="${config.newsletter.placeholder}" required>
                                <button type="submit">${config.newsletter.buttonText}</button>
                            </form>
                            <p class="newsletter-privacy">${config.newsletter.privacyText}</p>
                        </div>
                    ` : ''}

                    <!-- Downloads -->
                    <div class="download-section">
                        <h4>Download Our Ghana App</h4>
                        <div class="download-badges">
                            ${config.downloads.appStore.enabled ? `
                                <a href="${config.downloads.appStore.url}" class="download-badge">
                                    <img src="${config.downloads.appStore.badge}" alt="${config.downloads.appStore.alt}">
                                </a>
                            ` : ''}
                            ${config.downloads.googlePlay.enabled ? `
                                <a href="${config.downloads.googlePlay.url}" class="download-badge">
                                    <img src="${config.downloads.googlePlay.badge}" alt="${config.downloads.googlePlay.alt}">
                                </a>
                            ` : ''}
                            ${config.downloads.huaweiAppGallery.enabled ? `
                                <a href="${config.downloads.huaweiAppGallery.url}" class="download-badge">
                                    <img src="${config.downloads.huaweiAppGallery.badge}" alt="${config.downloads.huaweiAppGallery.alt}">
                                </a>
                            ` : ''}
                            ${config.downloads.webApp.enabled ? `
                                <a href="${config.downloads.webApp.url}" class="download-badge">
                                    <img src="${config.downloads.webApp.badge}" alt="${config.downloads.webApp.alt}">
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Country Ticker -->
            ${config.countryTicker.enabled ? `
                <div class="country-ticker">
                    <div class="ticker-track">
                        ${config.countryTicker.content.join(' • ')}
                    </div>
                </div>
            ` : ''}

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="container">
                    <div class="footer-bottom-content">
                        <!-- Copyright -->
                        <div class="copyright">
                            <p>${config.bottomSection.copyright.text}</p>
                            <p class="copyright-details">
                                ${config.bottomSection.copyright.registration} | 
                                ${config.bottomSection.copyright.vat} | 
                                ${config.bottomSection.copyright.dataProtection}
                            </p>
                        </div>

                        <!-- Contacts -->
                        <div class="country-contacts">
                            <h5>${config.bottomSection.countryContacts.title}</h5>
                            <div class="contact-grid">
                                ${config.bottomSection.countryContacts.contacts.map(contact => `
                                    <div class="contact-item">
                                        <strong>${contact.region}:</strong>
                                        <span>${contact.phone}</span>
                                        <span class="contact-address">${contact.address}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="contact-email">
                                Email: ${config.bottomSection.countryContacts.email} | 
                                Emergency: ${config.bottomSection.countryContacts.emergency}
                            </div>
                        </div>

                        <!-- Legal Links -->
                        <div class="footer-legal">
                            ${config.bottomSection.legalLinks.links.map((link, index) => `
                                <a href="${link.url}">${link.text}</a>
                                ${index < config.bottomSection.legalLinks.links.length - 1 ? config.bottomSection.legalLinks.separator : ''}
                            `).join('')}
                        </div>

                        <!-- Badges -->
                        <div class="compliance-badges">
                            ${config.bottomSection.badges.map(badge => `
                                <img src="${badge.image}" alt="${badge.alt}" class="compliance-badge" title="${badge.name}">
                            `).join('')}
                        </div>

                        <!-- Disclosures -->
                        <div class="disclosures">
                            <details>
                                <summary>Important Disclosures</summary>
                                <div class="disclosure-content">
                                    ${config.disclosures.financial.map(disclosure => `<p>${disclosure}</p>`).join('')}
                                    ${config.disclosures.regulatory.map(disclosure => `<p>${disclosure}</p>`).join('')}
                                    ${config.disclosures.risk.map(disclosure => `<p>${disclosure}</p>`).join('')}
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    `;
    
    return html.trim();
}

/**
 * Generate Ghana footer CSS
 * @returns {string} CSS styles
 */
function generateGhanaFooterCSS() {
    return `
        /* Ghana Footer Styles */
        .gh-footer {
            background-color: ${GHANA_FOOTER.structure.backgroundColor};
            color: ${GHANA_FOOTER.structure.textColor};
            border-top: ${GHANA_FOOTER.structure.borderTop};
        }

        .gh-footer .footer-top {
            padding: ${GHANA_FOOTER.structure.padding.top} ${GHANA_FOOTER.structure.padding.sides} 40px;
        }

        .gh-footer .footer-bottom {
            background-color: ${GHANA_FOOTER.bottomSection.backgroundColor};
            color: ${GHANA_FOOTER.bottomSection.textColor};
            border-top: ${GHANA_FOOTER.bottomSection.borderTop};
            padding: ${GHANA_FOOTER.bottomSection.padding};
        }

        .gh-footer .footer-grid {
            display: grid;
            grid-template-columns: repeat(${GHANA_FOOTER.structure.columns}, 1fr);
            gap: 32px;
            margin-bottom: 40px;
        }

        .gh-footer .footer-col-title {
            color: ${GHANA_FOOTER.structure.textColor};
            font-size: 15px;
            margin-bottom: 14px;
            font-weight: 600;
        }

        .gh-footer .footer-link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: ${GHANA_FOOTER.structure.linkColor};
            text-decoration: none;
            margin-bottom: 8px;
            padding: 4px 0;
            transition: color 0.2s ease;
        }

        .gh-footer .footer-link:hover {
            color: ${GHANA_FOOTER.structure.hoverColor};
        }

        .gh-footer .footer-link-icon {
            font-size: 14px;
            width: 20px;
            text-align: center;
        }

        .gh-footer .social-links {
            display: flex;
            gap: 12px;
            margin-top: 15px;
        }

        .gh-footer .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            color: ${GHANA_FOOTER.structure.textColor};
            text-decoration: none;
            transition: background-color 0.2s ease;
        }

        .gh-footer .social-link:hover {
            background-color: ${GHANA_FOOTER.structure.hoverColor};
        }

        /* Country Ticker */
        .gh-footer .country-ticker {
            overflow: hidden;
            background-color: ${GHANA_FOOTER.countryTicker.backgroundColor};
            padding: 12px 0;
        }

        .gh-footer .ticker-track {
            white-space: nowrap;
            display: inline-block;
            color: ${GHANA_FOOTER.countryTicker.textColor};
            font-size: ${GHANA_FOOTER.countryTicker.fontSize};
            animation: scroll-left ${GHANA_FOOTER.countryTicker.speed} linear infinite;
        }

        @keyframes scroll-left {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(-100%);
            }
        }

        /* Newsletter */
        .gh-footer .newsletter-section {
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 24px;
            margin: 40px 0;
            text-align: center;
        }

        .gh-footer .newsletter-form {
            display: flex;
            gap: 10px;
            max-width: 500px;
            margin: 20px auto;
        }

        .gh-footer .newsletter-form input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
        }

        .gh-footer .newsletter-form button {
            padding: 12px 24px;
            background-color: ${GHANA_FOOTER.structure.hoverColor};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .gh-footer .newsletter-form button:hover {
            background-color: #0077cc;
        }

        /* Downloads */
        .gh-footer .download-section {
            text-align: center;
            margin: 30px 0;
        }

        .gh-footer .download-badges {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .gh-footer .download-badge img {
            height: 40px;
            transition: transform 0.2s ease;
        }

        .gh-footer .download-badge:hover img {
            transform: scale(1.05);
        }

        /* Footer Bottom */
        .gh-footer .footer-bottom-content {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .gh-footer .copyright-details {
            font-size: 12px;
            opacity: 0.8;
            margin-top: 5px;
        }

        .gh-footer .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 15px 0;
        }

        .gh-footer .contact-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .gh-footer .contact-address {
            font-size: 12px;
            opacity: 0.8;
        }

        .gh-footer .contact-email {
            margin-top: 10px;
            font-size: 14px;
        }

        .gh-footer .footer-legal {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin: 15px 0;
        }

        .gh-footer .footer-legal a {
            color: ${GHANA_FOOTER.bottomSection.textColor};
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s ease;
        }

        .gh-footer .footer-legal a:hover {
            color: ${GHANA_FOOTER.structure.hoverColor};
        }

        .gh-footer .compliance-badges {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
        }

        .gh-footer .compliance-badge {
            height: 40px;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }

        .gh-footer .compliance-badge:hover {
            opacity: 1;
        }

        .gh-footer .disclosures {
            margin-top: 20px;
        }

        .gh-footer .disclosures details {
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            padding: 15px;
        }

        .gh-footer .disclosures summary {
            cursor: pointer;
            font-weight: 600;
            color: ${GHANA_FOOTER.structure.hoverColor};
        }

        .gh-footer .disclosure-content {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .gh-footer .disclosure-content p {
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 1.5;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .gh-footer .footer-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .gh-footer .footer-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .gh-footer .footer-top {
                padding: 40px 20px;
            }
            
            .gh-footer .newsletter-form {
                flex-direction: column;
            }
            
            .gh-footer .download-badges {
                flex-direction: column;
                align-items: center;
            }
            
            .gh-footer .contact-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            .gh-footer .footer-grid {
                grid-template-columns: 1fr;
            }
            
            .gh-footer .social-links {
                justify-content: center;
            }
            
            .gh-footer .footer-legal {
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .gh-footer {
                background-color: #0f172a;
            }
            
            .gh-footer .footer-bottom {
                background-color: #020617;
            }
        }
    `;
}

/**
 * Get Ghana footer data for API response
 * @returns {Object} Footer data object
 */
function getGhanaFooterData() {
    return {
        structure: GHANA_FOOTER.structure,
        columns: {
            borrowing: GHANA_FOOTER.borrowing,
            lending: GHANA_FOOTER.lending,
            platform: GHANA_FOOTER.platform,
            company: GHANA_FOOTER.company,
            legal: GHANA_FOOTER.legal,
            partnerships: GHANA_FOOTER.partnerships
        },
        bottomSection: GHANA_FOOTER.bottomSection,
        localization: GHANA_FOOTER.localization,
        businessHours: GHANA_FOOTER.businessHours,
        disclosures: GHANA_FOOTER.disclosures,
        generatedAt: new Date().toISOString(),
        country: 'GH',
        currency: 'GHS'
    };
}

/**
 * Validate Ghana footer structure
 * @returns {Object} Validation result
 */
function validateGhanaFooter() {
    const errors = [];
    const warnings = [];
    
    // Validate required sections
    const requiredSections = ['borrowing', 'lending', 'platform', 'company', 'legal'];
    requiredSections.forEach(section => {
        if (!GHANA_FOOTER[section]) {
            errors.push(`Missing required section: ${section}`);
        }
    });
    
    // Validate contact information
    if (!GHANA_FOOTER.bottomSection.countryContacts.contacts.length) {
        warnings.push('No contact information provided');
    }
    
    // Validate compliance badges
    if (!GHANA_FOOTER.bottomSection.badges.length) {
        warnings.push('No compliance badges provided');
    }
    
    // Validate currency
    if (GHANA_FOOTER.localization.currency.primary !== 'GHS') {
        errors.push('Currency must be GHS for Ghana footer');
    }
    
    // Validate language support
    if (!GHANA_FOOTER.localization.languages.some(lang => lang.code === 'en')) {
        warnings.push('English language not included in localization');
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        sections: requiredSections.length,
        links: Object.values(GHANA_FOOTER)
            .filter(section => section && section.links)
            .reduce((total, section) => total + section.links.length, 0)
    };
}

/**
 * Get Ghana footer for specific user type
 * @param {string} userType - 'borrower', 'lender', or 'guest'
 * @returns {Object} Filtered footer data
 */
function getGhanaFooterForUserType(userType) {
    const baseFooter = { ...GHANA_FOOTER };
    
    if (userType === 'borrower') {
        // Emphasize borrower links
        baseFooter.borrowing.links.forEach(link => link.priority = 'high');
        baseFooter.lending.links.forEach(link => link.priority = 'low');
    } else if (userType === 'lender') {
        // Emphasize lender links
        baseFooter.borrowing.links.forEach(link => link.priority = 'low');
        baseFooter.lending.links.forEach(link => link.priority = 'high');
    } else {
        // Guest - balanced approach
        baseFooter.borrowing.links.forEach(link => link.priority = 'medium');
        baseFooter.lending.links.forEach(link => link.priority = 'medium');
    }
    
    return baseFooter;
}

/**
 * Generate Ghana footer sitemap
 * @returns {Array} Sitemap entries
 */
function generateGhanaFooterSitemap() {
    const sitemap = [];
    
    // Collect all links from all sections
    const sections = ['borrowing', 'lending', 'platform', 'company', 'legal', 'partnerships'];
    
    sections.forEach(section => {
        GHANA_FOOTER[section].links.forEach(link => {
            sitemap.push({
                url: link.url,
                text: link.text,
                description: link.description,
                section: section,
                lastModified: new Date().toISOString().split('T')[0],
                priority: 0.8
            });
        });
    });
    
    // Add quick links
    GHANA_FOOTER.quickLinks.popular.forEach(link => {
        sitemap.push({
            url: link.url,
            text: link.text,
            section: 'quick-links',
            lastModified: new Date().toISOString().split('T')[0],
            priority: 0.6
        });
    });
    
    // Add tools
    GHANA_FOOTER.quickLinks.tools.forEach(link => {
        sitemap.push({
            url: link.url,
            text: link.text,
            section: 'tools',
            lastModified: new Date().toISOString().split('T')[0],
            priority: 0.6
        });
    });
    
    return sitemap;
}

// ============================================
// EXPORT FOOTER CONFIGURATION
// ============================================

export {
    GHANA_FOOTER,
    generateGhanaFooterHTML,
    generateGhanaFooterCSS,
    getGhanaFooterData,
    validateGhanaFooter,
    getGhanaFooterForUserType,
    generateGhanaFooterSitemap
};

export default GHANA_FOOTER;