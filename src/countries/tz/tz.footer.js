/**
 * Tanzania (TZ) Footer Configuration for M-Pesewa
 * Country-specific footer content, links, and contact information
 */

const tzFooter = {
    // ============================================
    // 1. FOOTER STRUCTURE & LAYOUT
    // ============================================
    structure: {
        columns: 6,
        layout: 'grid',
        backgroundColor: '#1f2a37',
        textColor: '#ffffff',
        linkColor: '#d1d5db',
        hoverColor: '#0099ff',
        
        breakpoints: {
            desktop: '1024px',
            tablet: '768px',
            mobile: '480px'
        }
    },

    // ============================================
    // 2. FOOTER COLUMNS CONTENT
    // ============================================
    columns: [
        {
            // Column 1: Borrowing
            title: 'Borrowing',
            titleColor: '#ffffff',
            links: [
                {
                    text: 'Get Emergency Loan',
                    url: '/tz/borrower/apply',
                    icon: '🚨',
                    description: 'Apply for emergency loans in Tanzania'
                },
                {
                    text: 'Online Personal Loan',
                    url: '/tz/borrower/apply/personal',
                    icon: '💻',
                    description: 'Personal loans for Tanzanians'
                },
                {
                    text: 'Business Loan',
                    url: '/tz/borrower/apply/business',
                    icon: '🏢',
                    description: 'Small business loans in TZS'
                },
                {
                    text: 'How to Apply',
                    url: '/tz/how-it-works',
                    icon: '📋',
                    description: 'Step-by-step application guide'
                },
                {
                    text: 'Active Borrowers',
                    url: '/tz/community/borrowers',
                    icon: '👥',
                    description: 'See successful borrowers in Tanzania'
                }
            ]
        },
        {
            // Column 2: Lending
            title: 'Lending',
            titleColor: '#ffffff',
            links: [
                {
                    text: 'Smart Lending',
                    url: '/tz/lender/guide',
                    icon: '🧠',
                    description: 'Best practices for lenders in Tanzania'
                },
                {
                    text: 'Why Lend at M-Pesewa?',
                    url: '/tz/lender/benefits',
                    icon: '❓',
                    description: 'Benefits of lending in Tanzania'
                },
                {
                    text: 'How to Lend',
                    url: '/tz/lender/tutorial',
                    icon: '📚',
                    description: 'Complete lending tutorial'
                },
                {
                    text: 'Active Lenders',
                    url: '/tz/community/lenders',
                    icon: '💰',
                    description: 'Successful lenders in Tanzania'
                },
                {
                    text: 'Lender Subscription',
                    url: '/tz/lender/subscription',
                    icon: '⭐',
                    description: 'Subscription plans for lenders'
                }
            ]
        },
        {
            // Column 3: Platform
            title: 'How It Works',
            titleColor: '#ffffff',
            links: [
                {
                    text: 'P2P Lending Works',
                    url: '/tz/how-it-works/p2p',
                    icon: '🔄',
                    description: 'How peer-to-peer lending works in Tanzania'
                },
                {
                    text: 'Our Role',
                    url: '/tz/about#our-role',
                    icon: '🎭',
                    description: 'Platform role and responsibilities'
                },
                {
                    text: 'Subscriptions',
                    url: '/tz/subscription',
                    icon: '📊',
                    description: 'Subscription model explained'
                },
                {
                    text: 'Blacklist',
                    url: '/tz/blacklist',
                    icon: '🚫',
                    description: 'Tanzania blacklist system'
                },
                {
                    text: 'Debt Collectors',
                    url: '/tz/collectors',
                    icon: '👮',
                    description: 'Registered debt collectors in Tanzania'
                }
            ]
        },
        {
            // Column 4: Company
            title: 'About Us',
            titleColor: '#ffffff',
            links: [
                {
                    text: 'About M-Pesewa',
                    url: '/tz/about',
                    icon: '🏢',
                    description: 'About our Tanzania operations'
                },
                {
                    text: 'Team & Advisory Board',
                    url: '/tz/about#team',
                    icon: '👥',
                    description: 'Our Tanzania team'
                },
                {
                    text: 'News & Careers',
                    url: '/tz/news',
                    icon: '📰',
                    description: 'Latest news and job opportunities'
                },
                {
                    text: 'Blog / FAQs',
                    url: '/tz/blog',
                    icon: '📝',
                    description: 'Tanzania-specific blog and FAQs'
                },
                {
                    text: 'Contact Us',
                    url: '/tz/contact',
                    icon: '📞',
                    description: 'Contact our Tanzania offices'
                }
            ]
        },
        {
            // Column 5: Legal & Compliance
            title: 'Legal & Compliance',
            titleColor: '#ffffff',
            links: [
                {
                    text: 'Terms & Conditions',
                    url: '/tz/terms',
                    icon: '📜',
                    description: 'Tanzania terms and conditions'
                },
                {
                    text: 'Privacy Policy',
                    url: '/tz/privacy',
                    icon: '🔒',
                    description: 'Tanzania privacy policy'
                },
                {
                    text: 'Grievance Redressal',
                    url: '/tz/grievance',
                    icon: '⚖️',
                    description: 'Complaint resolution process'
                },
                {
                    text: 'Fair Practices Code',
                    url: '/tz/fair-practices',
                    icon: '✅',
                    description: 'Fair lending practices in Tanzania'
                },
                {
                    text: 'Bank of Tanzania License',
                    url: '/tz/license',
                    icon: '🏛️',
                    description: 'View our BoT license'
                }
            ]
        },
        {
            // Column 6: Partners & Social
            title: 'Partnerships',
            titleColor: '#ffffff',
            links: [
                {
                    text: 'Be a Partner',
                    url: '/tz/partners',
                    icon: '🤝',
                    description: 'Partner with us in Tanzania'
                },
                {
                    text: 'Mobile Money Partners',
                    url: '/tz/partners/mobile-money',
                    icon: '📱',
                    description: 'M-Pesa, Tigo Pesa, Airtel Money'
                },
                {
                    text: 'Banking Partners',
                    url: '/tz/partners/banks',
                    icon: '🏦',
                    description: 'Partner banks in Tanzania'
                },
                {
                    text: 'Corporate Partnerships',
                    url: '/tz/partners/corporate',
                    icon: '💼',
                    description: 'Corporate partnership programs'
                }
            ],
            social: {
                title: 'Follow Us',
                links: [
                    {
                        platform: 'Facebook',
                        url: 'https://facebook.com/mpesewatanzania',
                        icon: '📘',
                        handle: '@mpesewatanzania'
                    },
                    {
                        platform: 'Twitter',
                        url: 'https://twitter.com/mpesewa_tz',
                        icon: '🐦',
                        handle: '@mpesewa_tz'
                    },
                    {
                        platform: 'Instagram',
                        url: 'https://instagram.com/mpesewa_tz',
                        icon: '📸',
                        handle: '@mpesewa_tz'
                    },
                    {
                        platform: 'LinkedIn',
                        url: 'https://linkedin.com/company/mpesewa-tanzania',
                        icon: '💼',
                        handle: 'M-Pesewa Tanzania'
                    },
                    {
                        platform: 'YouTube',
                        url: 'https://youtube.com/c/mpesewatanzania',
                        icon: '📺',
                        handle: 'M-Pesewa Tanzania'
                    }
                ]
            }
        }
    ],

    // ============================================
    // 3. COUNTRY-SPECIFIC INFORMATION
    // ============================================
    countryInfo: {
        flag: '🇹🇿',
        name: 'Tanzania',
        currency: 'TZS (Tanzanian Shilling)',
        regulator: 'Bank of Tanzania (BoT)',
        
        contactPoints: [
            {
                type: 'General Inquiries',
                phone: '+255 659 073 010',
                email: 'info.tz@mpesewa.com',
                hours: 'Mon-Fri: 8:00 AM - 5:00 PM EAT'
            },
            {
                type: 'Customer Support',
                phone: '+255 659 073 011',
                email: 'support.tz@mpesewa.com',
                hours: '24/7 Support Available'
            },
            {
                type: 'Emergency Support',
                phone: '+255 759 073 010',
                email: 'emergency.tz@mpesewa.com',
                hours: '24/7 Emergency Line'
            },
            {
                type: 'Complaints Department',
                phone: '+255 659 073 012',
                email: 'complaints.tz@mpesewa.com',
                hours: 'Mon-Fri: 9:00 AM - 4:00 PM EAT'
            }
        ],
        
        regionalOffices: [
            {
                city: 'Dar es Salaam',
                address: 'Mlimani City Tower, 3rd Floor, Ohio Street',
                phone: '+255 22 277 0001',
                manager: 'Juma Mohamed'
            },
            {
                city: 'Mwanza',
                address: 'Nyerere Road, Mwanza City',
                phone: '+255 28 250 0001',
                manager: 'Sarah John'
            },
            {
                city: 'Arusha',
                address: 'Sokoine Road, Arusha',
                phone: '+255 27 254 0002',
                manager: 'David Omondi'
            },
            {
                city: 'Dodoma',
                address: 'Jamhuri Street, Dodoma',
                phone: '+255 26 231 0003',
                manager: 'Fatuma Ali'
            }
        ]
    },

    // ============================================
    // 4. LEGAL DISCLAIMERS & COMPLIANCE
    // ============================================
    legalDisclaimers: {
        regulatory: [
            'M-Pesewa Tanzania Limited is licensed by Bank of Tanzania (License No: BOT/DLP/2024/001)',
            'We operate under the Banking and Financial Institutions Act, 2006',
            'Compliant with Personal Data Protection Act, 2022',
            'Registered with Tanzania Revenue Authority (TIN-001-234-567)'
        ],
        
        riskWarnings: [
            'Lending involves risk of loss. Past performance is not indicative of future results.',
            'Borrowers: High cost of borrowing (10% weekly interest). Consider affordability.',
            'Platform does not guarantee repayments or investment returns.',
            'All transactions are peer-to-peer. Platform is not a party to loan agreements.'
        ],
        
        consumerProtection: [
            'We adhere to Bank of Tanzania consumer protection guidelines',
            'Complaints resolved within 14 working days',
            'Cooling-off period: 24 hours for new registrations',
            'Transparent fee structure with no hidden charges'
        ]
    },

    // ============================================
    // 5. PAYMENT METHODS & SUPPORT
    // ============================================
    paymentMethods: {
        title: 'Accepted Payment Methods in Tanzania',
        methods: [
            {
                name: 'M-Pesa',
                icon: 'mpesa.png',
                instructions: 'Send to Paybill: 123456 | Account: Your Phone Number',
                support: 'Vodacom customers only'
            },
            {
                name: 'Tigo Pesa',
                icon: 'tigopesa.png',
                instructions: 'Send to Merchant: MPESEWA | Reference: Your User ID',
                support: 'Tigo customers only'
            },
            {
                name: 'Airtel Money',
                icon: 'airtelmoney.png',
                instructions: 'Send to Merchant Code: 1234 | Reference: Your Phone',
                support: 'Airtel customers only'
            },
            {
                name: 'Halopesa',
                icon: 'halopesa.png',
                instructions: 'Send to Business: MPESEWA | Account: Your ID',
                support: 'Halotel customers only'
            }
        ],
        
        limits: {
            daily: 'TZS 3,000,000',
            perTransaction: 'TZS 1,000,000',
            monthly: 'TZS 10,000,000'
        }
    },

    // ============================================
    // 6. QUICK LINKS & SHORTCUTS
    // ============================================
    quickLinks: {
        borrower: [
            { text: 'Apply for Loan', url: '/tz/borrower/apply', icon: '🚀' },
            { text: 'Check Loan Status', url: '/tz/borrower/status', icon: '📊' },
            { text: 'Make Repayment', url: '/tz/borrower/repay', icon: '💳' },
            { text: 'Download Statement', url: '/tz/borrower/statement', icon: '📄' }
        ],
        
        lender: [
            { text: 'Lender Dashboard', url: '/tz/lender/dashboard', icon: '📊' },
            { text: 'View Loan Requests', url: '/tz/lender/requests', icon: '👁️' },
            { text: 'Manage Ledgers', url: '/tz/lender/ledgers', icon: '📒' },
            { text: 'Subscription Renewal', url: '/tz/lender/subscription/renew', icon: '🔄' }
        ],
        
        groupAdmin: [
            { text: 'Group Dashboard', url: '/tz/group/dashboard', icon: '👥' },
            { text: 'Member Management', url: '/tz/group/members', icon: '👤' },
            { text: 'Loan Approvals', url: '/tz/group/loans', icon: '✅' },
            { text: 'Group Settings', url: '/tz/group/settings', icon: '⚙️' }
        ]
    },

    // ============================================
    // 7. NEWSLETTER & UPDATES
    // ============================================
    newsletter: {
        enabled: true,
        title: 'Stay Updated - Tanzania',
        description: 'Get latest updates on M-Pesewa Tanzania, regulatory changes, and financial tips',
        
        fields: [
            {
                name: 'email',
                type: 'email',
                placeholder: 'Enter your email address',
                required: true
            },
            {
                name: 'region',
                type: 'select',
                placeholder: 'Select your region',
                options: [
                    'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya',
                    'Morogoro', 'Tanga', 'Other'
                ]
            }
        ],
        
        frequency: 'Monthly',
        sampleTopics: [
            'Bank of Tanzania regulatory updates',
            'New features for Tanzanian users',
            'Success stories from Tanzania',
            'Financial literacy tips in Swahili'
        ]
    },

    // ============================================
    // 8. BADGES & CERTIFICATIONS
    // ============================================
    badges: [
        {
            name: 'Bank of Tanzania Licensed',
            image: 'bot-licensed-badge.png',
            alt: 'Licensed by Bank of Tanzania',
            url: '/tz/license'
        },
        {
            name: 'Data Protection Certified',
            image: 'pdp-certified.png',
            alt: 'Personal Data Protection Certified',
            url: '/tz/privacy#certification'
        },
        {
            name: 'SSL Secured',
            image: 'ssl-secured.png',
            alt: '256-bit SSL Encryption',
            url: '/tz/security'
        },
        {
            name: 'Tanzania Business Excellence',
            image: 'tanzania-excellence.png',
            alt: 'Tanzania Business Excellence Award',
            url: '/tz/awards'
        }
    ],

    // ============================================
    // 9. COUNTRY TICKER & MARQUEE
    // ============================================
    ticker: {
        enabled: true,
        type: 'marquee',
        direction: 'left',
        speed: '25s',
        
        content: {
            text: '🇹🇿 Tanzania • Dar es Salaam • Mwanza • Arusha • Dodoma • Mbeya • Morogoro • Tanga • Mtwara • 🇹🇿',
            repeat: 3
        },
        
        style: {
            backgroundColor: '#003366',
            textColor: '#ffffff',
            fontSize: '14px',
            padding: '12px 0'
        }
    },

    // ============================================
    // 10. COPYRIGHT & BOTTOM BAR
    // ============================================
    copyright: {
        text: `© 2016–2026, M-Pesewa Tanzania Limited. All Rights Reserved.`,
        registration: `Registered in Tanzania under Company Reg. No. TZ2024001MP`,
        
        links: [
            { text: 'Sitemap', url: '/tz/sitemap' },
            { text: 'Accessibility', url: '/tz/accessibility' },
            { text: 'Security', url: '/tz/security' },
            { text: 'Report Issue', url: '/tz/report' },
            { text: 'Developer API', url: '/tz/developer' }
        ],
        
        version: {
            platform: 'v3.2.1',
            country: 'TZ-2024.1',
            lastUpdated: '2024-03-15'
        }
    },

    // ============================================
    // 11. MOBILE FOOTER OPTIMIZATION
    // ============================================
    mobile: {
        collapsedByDefault: true,
        accordionStyle: true,
        showBackToTop: true,
        floatingActionButton: {
            enabled: true,
            position: 'bottom-right',
            actions: [
                { icon: '💬', label: 'Chat Support', action: 'openChat' },
                { icon: '📞', label: 'Call Support', action: 'callSupport' },
                { icon: '⬆️', label: 'Back to Top', action: 'scrollToTop' }
            ]
        }
    },

    // ============================================
    // 12. SEASONAL & PROMOTIONAL CONTENT
    // ============================================
    seasonal: {
        ramadan: {
            enabled: true,
            dates: 'March 10 - April 9, 2024',
            message: 'Special Ramadan repayment flexibility available',
            link: { text: 'Learn More', url: '/tz/ramadan-offer' }
        },
        
        independenceDay: {
            enabled: true,
            date: 'December 9, 2024',
            message: 'Celebrating Tanzania Independence Day',
            link: { text: 'Special Offers', url: '/tz/independence-day' }
        },
        
        newYear: {
            enabled: true,
            date: 'January 1, 2025',
            message: 'Happy New Year from M-Pesewa Tanzania!',
            link: { text: 'New Year Offers', url: '/tz/new-year' }
        }
    },

    // ============================================
    // 13. FOOTER HELPER FUNCTIONS
    // ============================================
    helpers: {
        // Generate complete footer HTML
        generateFooterHTML: (userType = 'guest') => {
            let html = `<footer class="mp-footer tz-footer" role="contentinfo">`;
            
            // Add ticker if enabled
            if (tzFooter.ticker.enabled) {
                html += `
                <div class="country-ticker">
                    <div class="ticker-track">
                        ${tzFooter.ticker.content.text.repeat(tzFooter.ticker.content.repeat)}
                    </div>
                </div>`;
            }
            
            // Add main footer content
            html += `
            <div class="footer-main">
                <div class="container">
                    <div class="footer-grid">
                        ${tzFooter.columns.map(column => `
                        <div class="footer-column">
                            <h4 class="footer-title">${column.title}</h4>
                            <ul class="footer-links">
                                ${column.links.map(link => `
                                <li>
                                    <a href="${link.url}" title="${link.description}">
                                        <span class="link-icon">${link.icon}</span>
                                        <span class="link-text">${link.text}</span>
                                    </a>
                                </li>
                                `).join('')}
                            </ul>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
            
            // Add contact information
            html += `
            <div class="footer-contact">
                <div class="container">
                    <div class="contact-grid">
                        ${tzFooter.countryInfo.contactPoints.map(contact => `
                        <div class="contact-point">
                            <strong>${contact.type}:</strong><br>
                            📞 ${contact.phone}<br>
                            ✉️ ${contact.email}<br>
                            ⏰ ${contact.hours}
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
            
            // Add legal disclaimers
            html += `
            <div class="footer-legal">
                <div class="container">
                    <div class="disclaimer">
                        ${tzFooter.legalDisclaimers.regulatory.map(disclaimer => 
                            `<p>${disclaimer}</p>`
                        ).join('')}
                    </div>
                </div>
            </div>`;
            
            // Add copyright
            html += `
            <div class="footer-bottom">
                <div class="container">
                    <div class="copyright">
                        ${tzFooter.copyright.text}<br>
                        ${tzFooter.copyright.registration}
                    </div>
                    <div class="bottom-links">
                        ${tzFooter.copyright.links.map(link => 
                            `<a href="${link.url}">${link.text}</a>`
                        ).join(' | ')}
                    </div>
                </div>
            </div>`;
            
            html += `</footer>`;
            return html;
        },
        
        // Get regional contact info
        getRegionalContact: (region) => {
            const office = tzFooter.countryInfo.regionalOffices.find(
                office => office.city.toLowerCase() === region.toLowerCase()
            );
            return office || tzFooter.countryInfo.regionalOffices[0];
        },
        
        // Format phone number for display
        formatPhoneNumber: (phone) => {
            // Convert +255123456789 to +255 123 456 789
            return phone.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        },
        
        // Get current seasonal message
        getSeasonalMessage: () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            
            // Check Ramadan
            const ramadanStart = new Date(`${currentYear}-03-10`);
            const ramadanEnd = new Date(`${currentYear}-04-09`);
            
            if (now >= ramadanStart && now <= ramadanEnd) {
                return tzFooter.seasonal.ramadan;
            }
            
            // Check Independence Day
            const independenceDay = new Date(`${currentYear}-12-09`);
            if (now.toDateString() === independenceDay.toDateString()) {
                return tzFooter.seasonal.independenceDay;
            }
            
            // Check New Year
            const newYear = new Date(`${currentYear}-01-01`);
            if (now.toDateString() === newYear.toDateString()) {
                return tzFooter.seasonal.newYear;
            }
            
            return null;
        },
        
        // Validate footer data
        validateFooterData: () => {
            const errors = [];
            
            // Check required fields
            if (!tzFooter.copyright.text) {
                errors.push('Copyright text is required');
            }
            
            if (!tzFooter.countryInfo.contactPoints.length) {
                errors.push('At least one contact point is required');
            }
            
            // Validate URLs
            tzFooter.columns.forEach((column, index) => {
                column.links.forEach((link, linkIndex) => {
                    if (!link.url.startsWith('/tz/') && !link.url.startsWith('http')) {
                        errors.push(`Invalid URL in column ${index + 1}, link ${linkIndex + 1}: ${link.url}`);
                    }
                });
            });
            
            return errors;
        }
    }
};

// Export Footer Configuration
module.exports = tzFooter;

// Initialize footer
console.log('Tanzania Footer Configuration loaded');
console.log(`Footer Structure: ${tzFooter.structure.columns} columns`);
console.log(`Contact Points: ${tzFooter.countryInfo.contactPoints.length} contact methods`);
console.log(`Regional Offices: ${tzFooter.countryInfo.regionalOffices.length} offices`);
console.log(`Legal Disclaimers: ${tzFooter.legalDisclaimers.regulatory.length} regulatory statements`);
console.log(`Payment Methods: ${tzFooter.paymentMethods.methods.length} supported methods`);