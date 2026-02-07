/**
 * M-PESEWA ETHIOPIA FOOTER CONFIGURATION
 * Country-specific footer with legal and contact information
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const EthiopiaFooter = {
    // ============================================
    // 1️⃣ FOOTER STRUCTURE & LAYOUT
    // ============================================
    structure: {
        type: 'multi-column',
        columns: 6,
        responsive: {
            mobile: 1,
            tablet: 3,
            desktop: 6
        },
        
        layout: {
            backgroundColor: '#1f2a37',
            textColor: '#ffffff',
            linkColor: '#d1d5db',
            hoverColor: '#0099ff',
            accentColor: '#28a745',
            borderColor: '#374151',
            
            padding: {
                top: '60px',
                bottom: '30px',
                sides: '40px'
            },
            
            spacing: {
                column: '32px',
                item: '12px'
            },
            
            typography: {
                headingSize: '15px',
                headingWeight: '600',
                linkSize: '14px',
                copyrightSize: '12px'
            }
        }
    },

    // ============================================
    // 2️⃣ FOOTER COLUMNS CONTENT
    // ============================================
    columns: {
        // Column 1: Borrowing
        column1: {
            title: 'Borrowing',
            titleIcon: '💼',
            links: [
                {
                    text: 'Get Emergency Loan',
                    url: '/et/borrower/apply',
                    description: 'Quick access to emergency funds',
                    icon: '🚨'
                },
                {
                    text: 'Online Personal Loan',
                    url: '/et/borrower/apply?type=personal',
                    description: 'Personal loans for emergencies',
                    icon: '💳'
                },
                {
                    text: 'Business Loan',
                    url: '/et/borrower/apply?type=business',
                    description: 'Small business emergency capital',
                    icon: '🏢'
                },
                {
                    text: 'How to Apply',
                    url: '/et/how-it-works',
                    description: 'Step-by-step application guide',
                    icon: '📝'
                },
                {
                    text: 'Active Borrowers',
                    url: '/et/community/borrowers',
                    description: 'View borrower community',
                    icon: '👥'
                }
            ],
            
            stats: {
                totalBorrowers: '15,000+',
                averageLoanSize: 'ETB 1,200',
                repaymentRate: '99%'
            }
        },

        // Column 2: Lending
        column2: {
            title: 'Lending',
            titleIcon: '💰',
            links: [
                {
                    text: 'Smart Lending',
                    url: '/et/lender/rules',
                    description: 'Lending best practices',
                    icon: '🎯'
                },
                {
                    text: 'Why Lend at M-Pesewa?',
                    url: '/et/lender/why-lend',
                    description: 'Benefits of lending on our platform',
                    icon: '⭐'
                },
                {
                    text: 'How to Lend',
                    url: '/et/lender/how-to-lend',
                    description: 'Getting started as a lender',
                    icon: '📚'
                },
                {
                    text: 'Active Lenders',
                    url: '/et/community/lenders',
                    description: 'View lender community',
                    icon: '👥'
                },
                {
                    text: 'Lender Success Stories',
                    url: '/et/success/lenders',
                    description: 'Real lender experiences',
                    icon: '🏆'
                }
            ],
            
            stats: {
                totalLenders: '3,000+',
                averageReturns: '10% weekly',
                totalLent: 'ETB 50M+'
            }
        },

        // Column 3: Platform
        column3: {
            title: 'How It Works',
            titleIcon: '⚙️',
            links: [
                {
                    text: 'P2P Lending Explained',
                    url: '/et/how-it-works',
                    description: 'Understanding peer-to-peer lending',
                    icon: '🤝'
                },
                {
                    text: 'Our Role',
                    url: '/et/about#our-role',
                    description: 'Platform responsibilities',
                    icon: '🏛️'
                },
                {
                    text: 'Subscriptions',
                    url: '/et/subscription/plans',
                    description: 'Lender subscription plans',
                    icon: '📋'
                },
                {
                    text: 'Blacklist',
                    url: '/et/blacklist/public',
                    description: 'Defaulters registry',
                    icon: '🚫'
                },
                {
                    text: 'Debt Collectors',
                    url: '/et/collectors',
                    description: 'Vetted debt collectors directory',
                    icon: '👮'
                }
            ],
            
            features: [
                'Country-locked',
                'Group-based',
                'Reputation system',
                'Secure platform'
            ]
        },

        // Column 4: Company
        column4: {
            title: 'About Us',
            titleIcon: '🏢',
            links: [
                {
                    text: 'About M-Pesewa',
                    url: '/et/about',
                    description: 'Our mission and vision',
                    icon: '🎯'
                },
                {
                    text: 'Team & Advisory Board',
                    url: '/et/about#team',
                    description: 'Our leadership team',
                    icon: '👥'
                },
                {
                    text: 'News & Careers',
                    url: '/et/news',
                    description: 'Latest updates and job openings',
                    icon: '📰'
                },
                {
                    text: 'Blog / FAQs',
                    url: '/et/faq',
                    description: 'Articles and frequently asked questions',
                    icon: '📚'
                },
                {
                    text: 'Contact Us',
                    url: '/et/contact',
                    description: 'Get in touch with our team',
                    icon: '📞'
                }
            ],
            
            companyInfo: {
                name: 'M-Pesewa Ethiopia',
                registration: 'Commercial Registration: ET-123456-2023',
                vat: 'VAT Number: ET000123456',
                location: 'Addis Ababa, Ethiopia'
            }
        },

        // Column 5: Legal & Compliance
        column5: {
            title: 'Legal & Compliance',
            titleIcon: '⚖️',
            links: [
                {
                    text: 'Terms & Conditions',
                    url: '/et/terms',
                    description: 'Platform terms of service',
                    icon: '📄'
                },
                {
                    text: 'Privacy Policy',
                    url: '/et/privacy',
                    description: 'Data protection and privacy',
                    icon: '🔒'
                },
                {
                    text: 'Grievance Redressal',
                    url: '/et/grievance',
                    description: 'Complaint resolution process',
                    icon: '🛡️'
                },
                {
                    text: 'Fair Practices Code',
                    url: '/et/fair-practices',
                    description: 'Our commitment to fair practices',
                    icon: '⚖️'
                },
                {
                    text: 'AML Policy',
                    url: '/et/aml-policy',
                    description: 'Anti-money laundering policy',
                    icon: '💰'
                }
            ],
            
            compliance: {
                regulatoryBody: 'National Bank of Ethiopia',
                license: 'Digital Financial Service Provider License (Pending)',
                dataProtection: 'DPP No. 123/2020 Compliant'
            }
        },

        // Column 6: Partners & Social
        column6: {
            title: 'Partners & Social',
            titleIcon: '🤝',
            links: [
                {
                    text: 'Be a Partner',
                    url: '/et/partners',
                    description: 'Partner with M-Pesewa Ethiopia',
                    icon: '🤝'
                },
                {
                    text: 'API Documentation',
                    url: '/et/api-docs',
                    description: 'Developer resources',
                    icon: '📚'
                },
                {
                    text: 'Security',
                    url: '/et/security',
                    description: 'Security measures and certifications',
                    icon: '🔒'
                },
                {
                    text: 'Sitemap',
                    url: '/et/sitemap',
                    description: 'Site structure and navigation',
                    icon: '🗺️'
                }
            ],
            
            socialMedia: {
                facebook: {
                    url: 'https://facebook.com/mpesewaethiopia',
                    icon: '📘',
                    label: 'Facebook'
                },
                twitter: {
                    url: 'https://twitter.com/mpesewa_et',
                    icon: '🐦',
                    label: 'Twitter'
                },
                telegram: {
                    url: 'https://t.me/mpesewa_ethiopia',
                    icon: '📱',
                    label: 'Telegram'
                },
                linkedin: {
                    url: 'https://linkedin.com/company/mpesewa-ethiopia',
                    icon: '💼',
                    label: 'LinkedIn'
                },
                youtube: {
                    url: 'https://youtube.com/c/mpesewaethiopia',
                    icon: '📺',
                    label: 'YouTube'
                }
            }
        }
    },

    // ============================================
    // 3️⃣ FOOTER BOTTOM SECTION
    // ============================================
    bottomSection: {
        // Countries ticker
        countryTicker: {
            enabled: true,
            backgroundColor: '#111827',
            textColor: '#ffffff',
            animation: {
                direction: 'left',
                speed: '25s',
                continuous: true
            },
            
            countries: [
                { flag: '🇪🇹', name: 'Ethiopia', code: 'ET' },
                { flag: '🇰🇪', name: 'Kenya', code: 'KE' },
                { flag: '🇺🇬', name: 'Uganda', code: 'UG' },
                { flag: '🇹🇿', name: 'Tanzania', code: 'TZ' },
                { flag: '🇷🇼', name: 'Rwanda', code: 'RW' },
                { flag: '🇧🇮', name: 'Burundi', code: 'BI' },
                { flag: '🇨🇩', name: 'DRC', code: 'CD' },
                { flag: '🇸🇸', name: 'South Sudan', code: 'SS' },
                { flag: '🇳🇬', name: 'Nigeria', code: 'NG' },
                { flag: '🇬🇭', name: 'Ghana', code: 'GH' },
                { flag: '🇿🇦', name: 'South Africa', code: 'ZA' },
                { flag: '🇸🇴', name: 'Somalia', code: 'SO' }
            ],
            
            message: 'Serving communities across Africa with country-specific platforms'
        },

        // Contact information by country
        countryContacts: {
            title: 'Contact by Country',
            countries: [
                {
                    name: 'Ethiopia',
                    flag: '🇪🇹',
                    phone: '+251 11 000 0000',
                    email: 'support.et@mpesewa.com',
                    whatsapp: '+251 91 000 0000',
                    hours: 'Mon-Fri 8:00-18:00, Sat 9:00-14:00'
                },
                {
                    name: 'Kenya',
                    flag: '🇰🇪',
                    phone: '+254 709 219 000',
                    email: 'support.ke@mpesewa.com'
                },
                {
                    name: 'Uganda',
                    flag: '🇺🇬',
                    phone: '+256 392 175 546',
                    email: 'support.ug@mpesewa.com'
                },
                {
                    name: 'Tanzania',
                    flag: '🇹🇿',
                    phone: '+255 659 073 010',
                    email: 'support.tz@mpesewa.com'
                },
                {
                    name: 'Rwanda',
                    flag: '🇷🇼',
                    phone: '+250 791 590 801',
                    email: 'support.rw@mpesewa.com'
                }
            ]
        },

        // Copyright and legal information
        copyright: {
            text: '© 2016–2026, M-Pesewa.com (Technology Pvt. Ltd.) — All Rights Reserved',
            version: 'Version 1.0.0',
            build: 'Build 20240124.1',
            
            legalLinks: [
                {
                    text: 'Accessibility',
                    url: '/et/accessibility',
                    description: 'Accessibility statement'
                },
                {
                    text: 'Cookie Policy',
                    url: '/et/cookies',
                    description: 'Cookie usage policy'
                },
                {
                    text: 'Report Issue',
                    url: '/et/report',
                    description: 'Report security or technical issues'
                },
                {
                    text: 'System Status',
                    url: '/et/status',
                    description: 'Platform status and uptime'
                }
            ]
        },

        // Payment methods accepted
        paymentMethods: {
            title: 'Accepted Payment Methods',
            methods: [
                {
                    name: 'TeleBirr',
                    icon: '💰',
                    description: 'Ethiopian mobile money'
                },
                {
                    name: 'M-Birr',
                    icon: '📱',
                    description: 'Mobile banking'
                },
                {
                    name: 'Dashen Bank',
                    icon: '🏦',
                    description: 'Bank transfer'
                },
                {
                    name: 'CBE Birr',
                    icon: '💳',
                    description: 'Commercial Bank of Ethiopia'
                },
                {
                    name: 'HelloCash',
                    icon: '💸',
                    description: 'Mobile payments'
                }
            ]
        }
    },

    // ============================================
    // 4️⃣ FOOTER FUNCTIONALITY
    // ============================================
    functionality: {
        // Newsletter subscription
        newsletter: {
            enabled: true,
            title: 'Stay Updated',
            description: 'Get the latest news and updates from M-Pesewa Ethiopia',
            placeholder: 'Enter your email',
            buttonText: 'Subscribe',
            
            validation: {
                required: true,
                emailFormat: true,
                consentRequired: true
            },
            
            confirmation: {
                message: 'Thank you for subscribing!',
                email: 'Welcome email sent'
            }
        },

        // Language selector
        languageSelector: {
            enabled: true,
            languages: [
                { code: 'en', name: 'English', flag: '🇬🇧' },
                { code: 'am', name: 'Amharic', flag: '🇪🇹' },
                { code: 'om', name: 'Oromo', flag: '🇪🇹' }
            ],
            
            storage: {
                key: 'mpesewa_language',
                expiry: '365 days'
            },
            
            onChange: 'reload-page'
        },

        // Back to top button
        backToTop: {
            enabled: true,
            threshold: 300,
            animation: 'smooth',
            position: 'bottom-right',
            
            icon: '⬆️',
            label: 'Back to top',
            
            accessibility: {
                ariaLabel: 'Back to top',
                keyboardShortcut: 'Home key'
            }
        },

        // Print functionality
        print: {
            enabled: true,
            exclude: ['social-media', 'newsletter', 'animation'],
            includeUrl: true,
            includeDate: true
        }
    },

    // ============================================
    // 5️⃣ FOOTER SEO & ACCESSIBILITY
    // ============================================
    seoAccessibility: {
        // SEO optimization
        seo: {
            schemaMarkup: {
                enabled: true,
                type: 'Organization',
                properties: {
                    name: 'M-Pesewa Ethiopia',
                    url: 'https://mpesewa.com/et',
                    logo: 'https://mpesewa.com/assets/logo-ethiopia.png',
                    contactPoint: {
                        telephone: '+251-11-000-0000',
                        contactType: 'customer service'
                    }
                }
            },
            
            links: {
                follow: true,
                nofollowExternal: true,
                sitemapIncluded: true
            }
        },

        // Accessibility features
        accessibility: {
            ariaLabels: {
                navigation: 'Footer navigation',
                column: 'Footer column',
                link: 'Footer link',
                social: 'Social media link'
            },
            
            keyboardNavigation: {
                enabled: true,
                focusVisible: true,
                skipLink: true
            },
            
            contrast: {
                minimum: '4.5:1',
                tested: true,
                compliant: true
            },
            
            screenReader: {
                announcements: true,
                liveRegions: false,
                landmarkRoles: true
            }
        },

        // Performance optimization
        performance: {
            lazyLoading: {
                images: true,
                socialIcons: true
            },
            
            caching: {
                static: true,
                maxAge: 31536000
            },
            
            size: {
                target: '< 50KB',
                compressed: true,
                minified: true
            }
        }
    },

    // ============================================
    // 6️⃣ FOOTER ANALYTICS
    // ============================================
    analytics: {
        // Click tracking
        clickTracking: {
            enabled: true,
            events: [
                'footer_link_click',
                'social_media_click',
                'newsletter_subscription',
                'language_change'
            ],
            
            dataLayer: {
                push: true,
                variables: ['linkText', 'linkUrl', 'linkCategory']
            }
        },

        // Engagement metrics
        engagement: {
            scrollDepth: {
                track: true,
                thresholds: [25, 50, 75, 100]
            },
            
            timeOnPage: {
                track: true,
                sampleRate: 10
            }
        },

        // Conversion tracking
        conversions: {
            newsletter: {
                goal: 'newsletter_subscription',
                value: 0.1
            },
            
            contact: {
                goal: 'contact_initiated',
                value: 1.0
            }
        }
    },

    // ============================================
    // 7️⃣ FOOTER SECURITY
    // ============================================
    security: {
        // Link security
        links: {
            rel: {
                external: 'noopener noreferrer',
                sponsored: 'sponsored',
                ugc: 'ugc'
            },
            
            target: {
                external: '_blank',
                internal: '_self'
            },
            
            validation: {
                checkExternal: true,
                sanitizeUrls: true,
                preventXSS: true
            }
        },

        // Form security
        forms: {
            newsletter: {
                csrfProtection: true,
                rateLimiting: true,
                honeypot: true,
                sanitization: true
            }
        },

        // Content security
        content: {
            csp: {
                inlineScripts: false,
                inlineStyles: false,
                eval: false
            },
            
            sanitization: {
                userContent: true,
                thirdParty: true
            }
        }
    },

    // ============================================
    // 8️⃣ FOOTER TEMPLATE GENERATION
    // ============================================
    templates: {
        // HTML template generation
        generateHTML: function() {
            return `
                <!-- M-Pesewa Ethiopia Footer -->
                <footer class="mp-footer mp-footer-et" role="contentinfo">
                    ${this.generateColumnsHTML()}
                    ${this.generateBottomHTML()}
                </footer>
            `;
        },

        // CSS template generation
        generateCSS: function() {
            return `
                /* M-Pesewa Ethiopia Footer Styles */
                .mp-footer-et {
                    background-color: ${this.structure.layout.backgroundColor};
                    color: ${this.structure.layout.textColor};
                    padding: ${this.structure.layout.padding.top} ${this.structure.layout.padding.sides};
                }
                
                .footer-columns-et {
                    display: grid;
                    grid-template-columns: repeat(${this.structure.columns}, 1fr);
                    gap: ${this.structure.layout.spacing.column};
                }
                
                .footer-link-et {
                    color: ${this.structure.layout.linkColor};
                    transition: color 0.3s ease;
                }
                
                .footer-link-et:hover {
                    color: ${this.structure.layout.hoverColor};
                }
                
                /* Responsive styles */
                @media (max-width: 768px) {
                    .footer-columns-et {
                        grid-template-columns: repeat(${this.structure.responsive.mobile}, 1fr);
                    }
                }
                
                @media (min-width: 769px) and (max-width: 1024px) {
                    .footer-columns-et {
                        grid-template-columns: repeat(${this.structure.responsive.tablet}, 1fr);
                    }
                }
            `;
        },

        // JavaScript template generation
        generateJS: function() {
            return `
                // M-Pesewa Ethiopia Footer JavaScript
                document.addEventListener('DOMContentLoaded', function() {
                    // Initialize footer functionality
                    initEthiopiaFooter();
                });
                
                function initEthiopiaFooter() {
                    // Newsletter subscription
                    const newsletterForm = document.querySelector('.newsletter-form-et');
                    if (newsletterForm) {
                        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
                    }
                    
                    // Language selector
                    const languageSelect = document.querySelector('.language-selector-et');
                    if (languageSelect) {
                        languageSelect.addEventListener('change', handleLanguageChange);
                    }
                    
                    // Back to top button
                    const backToTopBtn = document.querySelector('.back-to-top-et');
                    if (backToTopBtn) {
                        window.addEventListener('scroll', toggleBackToTop);
                        backToTopBtn.addEventListener('click', scrollToTop);
                    }
                    
                    // Analytics tracking
                    setupFooterAnalytics();
                }
                
                function handleNewsletterSubmit(event) {
                    event.preventDefault();
                    const email = event.target.querySelector('input[type="email"]').value;
                    
                    // Validate email
                    if (isValidEmail(email)) {
                        subscribeNewsletter(email);
                    }
                }
                
                function handleLanguageChange(event) {
                    const language = event.target.value;
                    setLanguagePreference(language);
                }
                
                function toggleBackToTop() {
                    const btn = document.querySelector('.back-to-top-et');
                    if (window.scrollY > ${this.functionality.backToTop.threshold}) {
                        btn.classList.add('visible');
                    } else {
                        btn.classList.remove('visible');
                    }
                }
                
                function scrollToTop() {
                    window.scrollTo({
                        top: 0,
                        behavior: '${this.functionality.backToTop.animation}'
                    });
                }
                
                function setupFooterAnalytics() {
                    // Track footer link clicks
                    document.querySelectorAll('.footer-link-et').forEach(link => {
                        link.addEventListener('click', trackFooterClick);
                    });
                }
                
                function trackFooterClick(event) {
                    const linkText = event.target.textContent;
                    const linkUrl = event.target.href;
                    
                    // Send to analytics
                    if (window.dataLayer) {
                        window.dataLayer.push({
                            event: 'footer_link_click',
                            linkText: linkText,
                            linkUrl: linkUrl
                        });
                    }
                }
            `;
        }
    }
};

// ============================================
// FOOTER GENERATION FUNCTIONS
// ============================================

/**
 * Generate complete footer HTML
 * @returns {string} Complete footer HTML
 */
EthiopiaFooter.generateCompleteFooter = function() {
    const template = `
        <!-- M-Pesewa Ethiopia Footer - Generated ${new Date().toISOString()} -->
        <footer class="mp-footer mp-footer-et" role="contentinfo" aria-label="M-Pesewa Ethiopia footer">
            
            <!-- Top Section: Footer Columns -->
            <div class="footer-top-section">
                <div class="container">
                    <div class="footer-columns-et">
                        
                        <!-- Column 1: Borrowing -->
                        <div class="footer-column" role="region" aria-labelledby="footer-borrowing">
                            <h4 id="footer-borrowing" class="footer-column-title">
                                <span class="footer-column-icon">${this.columns.column1.titleIcon}</span>
                                ${this.columns.column1.title}
                            </h4>
                            <ul class="footer-links-list">
                                ${this.columns.column1.links.map(link => `
                                    <li>
                                        <a href="${link.url}" 
                                           class="footer-link-et" 
                                           title="${link.description}"
                                           aria-label="${link.text} - ${link.description}">
                                            <span class="footer-link-icon">${link.icon}</span>
                                            ${link.text}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                            
                            <!-- Stats -->
                            <div class="footer-stats">
                                <div class="stat-item">
                                    <span class="stat-value">${this.columns.column1.stats.totalBorrowers}</span>
                                    <span class="stat-label">Active Borrowers</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value">${this.columns.column1.stats.averageLoanSize}</span>
                                    <span class="stat-label">Average Loan</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value">${this.columns.column1.stats.repaymentRate}</span>
                                    <span class="stat-label">Repayment Rate</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Column 2: Lending -->
                        <div class="footer-column" role="region" aria-labelledby="footer-lending">
                            <h4 id="footer-lending" class="footer-column-title">
                                <span class="footer-column-icon">${this.columns.column2.titleIcon}</span>
                                ${this.columns.column2.title}
                            </h4>
                            <ul class="footer-links-list">
                                ${this.columns.column2.links.map(link => `
                                    <li>
                                        <a href="${link.url}" 
                                           class="footer-link-et" 
                                           title="${link.description}"
                                           aria-label="${link.text} - ${link.description}">
                                            <span class="footer-link-icon">${link.icon}</span>
                                            ${link.text}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                            
                            <!-- Stats -->
                            <div class="footer-stats">
                                <div class="stat-item">
                                    <span class="stat-value">${this.columns.column2.stats.totalLenders}</span>
                                    <span class="stat-label">Active Lenders</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value">${this.columns.column2.stats.averageReturns}</span>
                                    <span class="stat-label">Average Returns</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value">${this.columns.column2.stats.totalLent}</span>
                                    <span class="stat-label">Total Lent</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Column 3: Platform -->
                        <div class="footer-column" role="region" aria-labelledby="footer-platform">
                            <h4 id="footer-platform" class="footer-column-title">
                                <span class="footer-column-icon">${this.columns.column3.titleIcon}</span>
                                ${this.columns.column3.title}
                            </h4>
                            <ul class="footer-links-list">
                                ${this.columns.column3.links.map(link => `
                                    <li>
                                        <a href="${link.url}" 
                                           class="footer-link-et" 
                                           title="${link.description}"
                                           aria-label="${link.text} - ${link.description}">
                                            <span class="footer-link-icon">${link.icon}</span>
                                            ${link.text}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                            
                            <!-- Features -->
                            <div class="footer-features">
                                ${this.columns.column3.features.map(feature => `
                                    <span class="feature-tag">${feature}</span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Column 4: Company -->
                        <div class="footer-column" role="region" aria-labelledby="footer-company">
                            <h4 id="footer-company" class="footer-column-title">
                                <span class="footer-column-icon">${this.columns.column4.titleIcon}</span>
                                ${this.columns.column4.title}
                            </h4>
                            <ul class="footer-links-list">
                                ${this.columns.column4.links.map(link => `
                                    <li>
                                        <a href="${link.url}" 
                                           class="footer-link-et" 
                                           title="${link.description}"
                                           aria-label="${link.text} - ${link.description}">
                                            <span class="footer-link-icon">${link.icon}</span>
                                            ${link.text}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                            
                            <!-- Company Info -->
                            <div class="company-info">
                                <p><strong>${this.columns.column4.companyInfo.name}</strong></p>
                                <p>${this.columns.column4.companyInfo.registration}</p>
                                <p>${this.columns.column4.companyInfo.vat}</p>
                                <p>${this.columns.column4.companyInfo.location}</p>
                            </div>
                        </div>
                        
                        <!-- Column 5: Legal -->
                        <div class="footer-column" role="region" aria-labelledby="footer-legal">
                            <h4 id="footer-legal" class="footer-column-title">
                                <span class="footer-column-icon">${this.columns.column5.titleIcon}</span>
                                ${this.columns.column5.title}
                            </h4>
                            <ul class="footer-links-list">
                                ${this.columns.column5.links.map(link => `
                                    <li>
                                        <a href="${link.url}" 
                                           class="footer-link-et" 
                                           title="${link.description}"
                                           aria-label="${link.text} - ${link.description}">
                                            <span class="footer-link-icon">${link.icon}</span>
                                            ${link.text}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                            
                            <!-- Compliance -->
                            <div class="compliance-badges">
                                <div class="compliance-badge">
                                    <span class="badge-icon">🏛️</span>
                                    <span class="badge-text">${this.columns.column5.compliance.regulatoryBody}</span>
                                </div>
                                <div class="compliance-badge">
                                    <span class="badge-icon">📜</span>
                                    <span class="badge-text">${this.columns.column5.compliance.license}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Column 6: Partners & Social -->
                        <div class="footer-column" role="region" aria-labelledby="footer-partners">
                            <h4 id="footer-partners" class="footer-column-title">
                                <span class="footer-column-icon">${this.columns.column6.titleIcon}</span>
                                ${this.columns.column6.title}
                            </h4>
                            <ul class="footer-links-list">
                                ${this.columns.column6.links.map(link => `
                                    <li>
                                        <a href="${link.url}" 
                                           class="footer-link-et" 
                                           title="${link.description}"
                                           aria-label="${link.text} - ${link.description}">
                                            <span class="footer-link-icon">${link.icon}</span>
                                            ${link.text}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                            
                            <!-- Social Media -->
                            <div class="social-media-section">
                                <p class="social-title">Follow Us</p>
                                <div class="social-icons">
                                    ${Object.entries(this.columns.column6.socialMedia).map(([platform, data]) => `
                                        <a href="${data.url}" 
                                           class="social-icon" 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           aria-label="${data.label}">
                                            <span class="social-icon-emoji">${data.icon}</span>
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Newsletter -->
                            ${this.functionality.newsletter.enabled ? `
                                <div class="newsletter-section">
                                    <p class="newsletter-title">${this.functionality.newsletter.title}</p>
                                    <p class="newsletter-description">${this.functionality.newsletter.description}</p>
                                    <form class="newsletter-form-et">
                                        <input type="email" 
                                               placeholder="${this.functionality.newsletter.placeholder}"
                                               aria-label="Email for newsletter subscription"
                                               required>
                                        <button type="submit" class="newsletter-button">
                                            ${this.functionality.newsletter.buttonText}
                                        </button>
                                    </form>
                                </div>
                            ` : ''}
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <!-- Middle Section: Countries Ticker -->
            ${this.bottomSection.countryTicker.enabled ? `
                <div class="country-ticker-section">
                    <div class="country-ticker-track">
                        ${this.bottomSection.countryTicker.countries.map(country => `
                            <span class="country-ticker-item">
                                <span class="country-flag">${country.flag}</span>
                                <span class="country-name">${country.name}</span>
                                <span class="country-separator">•</span>
                            </span>
                        `).join('')}
                        
                        ${this.bottomSection.countryTicker.countries.map(country => `
                            <span class="country-ticker-item">
                                <span class="country-flag">${country.flag}</span>
                                <span class="country-name">${country.name}</span>
                                <span class="country-separator">•</span>
                            </span>
                        `).join('')}
                    </div>
                    <div class="ticker-message">
                        ${this.bottomSection.countryTicker.message}
                    </div>
                </div>
            ` : ''}
            
            <!-- Bottom Section: Copyright and Contacts -->
            <div class="footer-bottom-section">
                <div class="container">
                    
                    <!-- Country Contacts -->
                    <div class="country-contacts-section">
                        <p class="contacts-title"><strong>${this.bottomSection.countryContacts.title}</strong></p>
                        <div class="country-contacts-grid">
                            ${this.bottomSection.countryContacts.countries.map(country => `
                                <div class="country-contact">
                                    <span class="contact-country">
                                        <span class="contact-flag">${country.flag}</span>
                                        <span class="contact-name">${country.name}:</span>
                                    </span>
                                    <span class="contact-details">
                                        ${country.phone} | ${country.email}
                                        ${country.whatsapp ? ` | WhatsApp: ${country.whatsapp}` : ''}
                                        ${country.hours ? ` | Hours: ${country.hours}` : ''}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Payment Methods -->
                    <div class="payment-methods-section">
                        <p class="payment-title">${this.bottomSection.paymentMethods.title}</p>
                        <div class="payment-methods">
                            ${this.bottomSection.paymentMethods.methods.map(method => `
                                <div class="payment-method">
                                    <span class="method-icon">${method.icon}</span>
                                    <span class="method-name">${method.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Copyright -->
                    <div class="copyright-section">
                        <div class="copyright-text">
                            ${this.bottomSection.copyright.text}
                        </div>
                        <div class="version-info">
                            <span class="version">${this.bottomSection.copyright.version}</span>
                            <span class="build">${this.bottomSection.copyright.build}</span>
                        </div>
                        <div class="legal-links">
                            ${this.bottomSection.copyright.legalLinks.map(link => `
                                <a href="${link.url}" class="legal-link" title="${link.description}">
                                    ${link.text}
                                </a>
                                ${link !== this.bottomSection.copyright.legalLinks[this.bottomSection.copyright.legalLinks.length - 1] ? ' | ' : ''}
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Language Selector -->
                    ${this.functionality.languageSelector.enabled ? `
                        <div class="language-selector-section">
                            <label for="footer-language-select" class="language-label">
                                Language:
                            </label>
                            <select id="footer-language-select" class="language-selector-et">
                                ${this.functionality.languageSelector.languages.map(lang => `
                                    <option value="${lang.code}">
                                        ${lang.flag} ${lang.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    ` : ''}
                    
                </div>
            </div>
            
            <!-- Back to Top Button -->
            ${this.functionality.backToTop.enabled ? `
                <button class="back-to-top-et" 
                        aria-label="${this.functionality.backToTop.accessibility.ariaLabel}"
                        title="${this.functionality.backToTop.label}">
                    <span class="back-to-top-icon">${this.functionality.backToTop.icon}</span>
                </button>
            ` : ''}
            
        </footer>
    `;
    
    return template;
};

/**
 * Generate footer CSS
 * @returns {string} Footer CSS
 */
EthiopiaFooter.generateFooterCSS = function() {
    return `
        /* M-Pesewa Ethiopia Footer Styles */
        .mp-footer-et {
            background-color: ${this.structure.layout.backgroundColor};
            color: ${this.structure.layout.textColor};
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            position: relative;
            z-index: 100;
        }
        
        .footer-top-section {
            padding: ${this.structure.layout.padding.top} ${this.structure.layout.padding.sides};
            border-bottom: 1px solid ${this.structure.layout.borderColor};
        }
        
        .footer-columns-et {
            display: grid;
            grid-template-columns: repeat(${this.structure.columns}, 1fr);
            gap: ${this.structure.layout.spacing.column};
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .footer-column {
            display: flex;
            flex-direction: column;
        }
        
        .footer-column-title {
            font-size: ${this.structure.layout.typography.headingSize};
            font-weight: ${this.structure.layout.typography.headingWeight};
            color: ${this.structure.layout.textColor};
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .footer-column-icon {
            font-size: 18px;
        }
        
        .footer-links-list {
            list-style: none;
            padding: 0;
            margin: 0 0 20px 0;
        }
        
        .footer-links-list li {
            margin-bottom: ${this.structure.layout.spacing.item};
        }
        
        .footer-link-et {
            color: ${this.structure.layout.linkColor};
            text-decoration: none;
            font-size: ${this.structure.layout.typography.linkSize};
            display: flex;
            align-items: center;
            gap: 8px;
            transition: color 0.3s ease;
        }
        
        .footer-link-et:hover,
        .footer-link-et:focus {
            color: ${this.structure.layout.hoverColor};
            outline: none;
        }
        
        .footer-link-icon {
            font-size: 16px;
        }
        
        .footer-stats {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 12px;
            margin-top: auto;
        }
        
        .stat-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 13px;
        }
        
        .stat-item:last-child {
            margin-bottom: 0;
        }
        
        .stat-value {
            color: ${this.structure.layout.accentColor};
            font-weight: 600;
        }
        
        .stat-label {
            color: ${this.structure.layout.linkColor};
        }
        
        .footer-features {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 12px;
        }
        
        .feature-tag {
            background: rgba(40, 167, 69, 0.1);
            color: ${this.structure.layout.accentColor};
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
        }
        
        .company-info {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 12px;
            margin-top: 12px;
            font-size: 12px;
            line-height: 1.4;
        }
        
        .company-info p {
            margin: 4px 0;
        }
        
        .compliance-badges {
            margin-top: 12px;
        }
        
        .compliance-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
            font-size: 12px;
        }
        
        .badge-icon {
            font-size: 14px;
        }
        
        .badge-text {
            color: ${this.structure.layout.linkColor};
        }
        
        .social-media-section {
            margin-top: 20px;
        }
        
        .social-title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            color: ${this.structure.layout.textColor};
        }
        
        .social-icons {
            display: flex;
            gap: 12px;
        }
        
        .social-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            background: ${this.structure.layout.hoverColor};
            transform: translateY(-2px);
        }
        
        .social-icon-emoji {
            font-size: 18px;
        }
        
        .newsletter-section {
            margin-top: 20px;
        }
        
        .newsletter-title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
            color: ${this.structure.layout.textColor};
        }
        
        .newsletter-description {
            font-size: 12px;
            color: ${this.structure.layout.linkColor};
            margin-bottom: 12px;
        }
        
        .newsletter-form-et {
            display: flex;
            gap: 8px;
        }
        
        .newsletter-form-et input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid ${this.structure.layout.borderColor};
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.1);
            color: ${this.structure.layout.textColor};
            font-size: 14px;
        }
        
        .newsletter-form-et input:focus {
            outline: none;
            border-color: ${this.structure.layout.hoverColor};
        }
        
        .newsletter-button {
            padding: 8px 16px;
            background: ${this.structure.layout.hoverColor};
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .newsletter-button:hover {
            background: #0077cc;
        }
        
        .country-ticker-section {
            background: ${this.bottomSection.countryTicker.backgroundColor};
            color: ${this.bottomSection.countryTicker.textColor};
            padding: 12px 0;
            overflow: hidden;
            position: relative;
        }
        
        .country-ticker-track {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            animation: ticker-scroll-${this.bottomSection.countryTicker.animation.direction} ${this.bottomSection.countryTicker.animation.speed} linear infinite;
        }
        
        .country-ticker-item {
            display: inline-flex;
            align-items: center;
            margin: 0 12px;
            font-size: 13px;
        }
        
        .country-flag {
            margin-right: 4px;
        }
        
        .country-separator {
            margin-left: 12px;
            opacity: 0.5;
        }
        
        .ticker-message {
            text-align: center;
            font-size: 12px;
            opacity: 0.8;
            margin-top: 4px;
        }
        
        @keyframes ticker-scroll-left {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-50%);
            }
        }
        
        .footer-bottom-section {
            padding: 30px ${this.structure.layout.padding.sides};
            border-top: 1px solid ${this.structure.layout.borderColor};
        }
        
        .country-contacts-section {
            margin-bottom: 20px;
        }
        
        .contacts-title {
            font-size: 14px;
            margin-bottom: 12px;
            color: ${this.structure.layout.textColor};
        }
        
        .country-contacts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 8px;
            font-size: 12px;
        }
        
        .country-contact {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 4px;
        }
        
        .contact-country {
            display: flex;
            align-items: center;
            gap: 4px;
            min-width: 120px;
        }
        
        .contact-flag {
            font-size: 14px;
        }
        
        .contact-name {
            font-weight: 500;
        }
        
        .contact-details {
            color: ${this.structure.layout.linkColor};
        }
        
        .payment-methods-section {
            margin-bottom: 20px;
        }
        
        .payment-title {
            font-size: 14px;
            margin-bottom: 8px;
            color: ${this.structure.layout.textColor};
        }
        
        .payment-methods {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .payment-method {
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.05);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
        }
        
        .method-icon {
            font-size: 16px;
        }
        
        .copyright-section {
            border-top: 1px solid ${this.structure.layout.borderColor};
            padding-top: 20px;
            margin-top: 20px;
        }
        
        .copyright-text {
            font-size: ${this.structure.layout.typography.copyrightSize};
            color: ${this.structure.layout.linkColor};
            margin-bottom: 8px;
        }
        
        .version-info {
            display: flex;
            gap: 12px;
            font-size: 11px;
            color: ${this.structure.layout.linkColor};
            margin-bottom: 12px;
            opacity: 0.8;
        }
        
        .legal-links {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 12px;
        }
        
        .legal-link {
            color: ${this.structure.layout.linkColor};
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .legal-link:hover {
            color: ${this.structure.layout.hoverColor};
        }
        
        .language-selector-section {
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .language-label {
            font-size: 12px;
            color: ${this.structure.layout.linkColor};
        }
        
        .language-selector-et {
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid ${this.structure.layout.borderColor};
            border-radius: 4px;
            color: ${this.structure.layout.textColor};
            font-size: 12px;
        }
        
        .language-selector-et:focus {
            outline: none;
            border-color: ${this.structure.layout.hoverColor};
        }
        
        .back-to-top-et {
            position: fixed;
            ${this.functionality.backToTop.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            ${this.functionality.backToTop.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
            width: 44px;
            height: 44px;
            background: ${this.structure.layout.hoverColor};
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .back-to-top-et.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top-et:hover {
            background: #0077cc;
            transform: translateY(-2px);
        }
        
        .back-to-top-icon {
            font-size: 20px;
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
            .footer-columns-et {
                grid-template-columns: repeat(${this.structure.responsive.mobile}, 1fr);
            }
            
            .footer-top-section {
                padding: 40px 20px;
            }
            
            .footer-bottom-section {
                padding: 20px;
            }
            
            .country-contacts-grid {
                grid-template-columns: 1fr;
            }
            
            .back-to-top-et {
                width: 36px;
                height: 36px;
                ${this.functionality.backToTop.position.includes('right') ? 'right: 10px;' : 'left: 10px;'}
                ${this.functionality.backToTop.position.includes('bottom') ? 'bottom: 10px;' : 'top: 10px;'}
            }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
            .footer-columns-et {
                grid-template-columns: repeat(${this.structure.responsive.tablet}, 1fr);
            }
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            .country-ticker-track {
                animation: none;
            }
            
            .back-to-top-et,
            .social-icon {
                transition: none;
            }
        }
        
        /* Print Styles */
        @media print {
            .mp-footer-et {
                background: white !important;
                color: black !important;
                border-top: 2px solid #ccc;
            }
            
            .footer-link-et,
            .legal-link {
                color: black !important;
            }
            
            .social-icons,
            .newsletter-section,
            .back-to-top-et,
            .country-ticker-section {
                display: none !important;
            }
        }
    `;
};

/**
 * Generate footer JavaScript
 * @returns {string} Footer JavaScript
 */
EthiopiaFooter.generateFooterJS = function() {
    return `
        // M-Pesewa Ethiopia Footer JavaScript
        (function() {
            'use strict';
            
            // Initialize when DOM is loaded
            document.addEventListener('DOMContentLoaded', function() {
                initEthiopiaFooter();
            });
            
            function initEthiopiaFooter() {
                // Newsletter subscription
                initNewsletter();
                
                // Language selector
                initLanguageSelector();
                
                // Back to top button
                initBackToTop();
                
                // Analytics tracking
                initFooterAnalytics();
                
                // Accessibility enhancements
                enhanceAccessibility();
            }
            
            function initNewsletter() {
                const newsletterForm = document.querySelector('.newsletter-form-et');
                if (!newsletterForm) return;
                
                newsletterForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    
                    const emailInput = this.querySelector('input[type="email"]');
                    const email = emailInput.value.trim();
                    
                    // Validate email
                    if (!isValidEmail(email)) {
                        showNewsletterError('Please enter a valid email address');
                        return;
                    }
                    
                    // Show loading state
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Subscribing...';
                    submitBtn.disabled = true;
                    
                    // Simulate API call
                    setTimeout(function() {
                        submitBtn.textContent = 'Subscribed!';
                        submitBtn.style.background = '#28a745';
                        
                        // Reset after 2 seconds
                        setTimeout(function() {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.background = '';
                            emailInput.value = '';
                            
                            showNewsletterSuccess('Thank you for subscribing to M-Pesewa Ethiopia updates!');
                        }, 2000);
                    }, 1000);
                });
            }
            
            function isValidEmail(email) {
                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                return emailRegex.test(email);
            }
            
            function showNewsletterError(message) {
                // Remove existing error
                const existingError = document.querySelector('.newsletter-error');
                if (existingError) existingError.remove();
                
                // Create error message
                const errorEl = document.createElement('div');
                errorEl.className = 'newsletter-error';
                errorEl.style.color = '#dc3545';
                errorEl.style.fontSize = '12px';
                errorEl.style.marginTop = '8px';
                errorEl.textContent = message;
                
                const form = document.querySelector('.newsletter-form-et');
                form.appendChild(errorEl);
                
                // Auto-remove after 5 seconds
                setTimeout(function() {
                    errorEl.remove();
                }, 5000);
            }
            
            function showNewsletterSuccess(message) {
                // Remove existing success message
                const existingSuccess = document.querySelector('.newsletter-success');
                if (existingSuccess) existingSuccess.remove();
                
                // Create success message
                const successEl = document.createElement('div');
                successEl.className = 'newsletter-success';
                successEl.style.color = '#28a745';
                successEl.style.fontSize = '12px';
                successEl.style.marginTop = '8px';
                successEl.textContent = message;
                
                const form = document.querySelector('.newsletter-form-et');
                form.appendChild(successEl);
                
                // Auto-remove after 5 seconds
                setTimeout(function() {
                    successEl.remove();
                }, 5000);
            }
            
            function initLanguageSelector() {
                const languageSelect = document.querySelector('.language-selector-et');
                if (!languageSelect) return;
                
                // Set saved language preference
                const savedLanguage = localStorage.getItem('${this.functionality.languageSelector.storage.key}');
                if (savedLanguage) {
                    languageSelect.value = savedLanguage;
                }
                
                languageSelect.addEventListener('change', function() {
                    const selectedLanguage = this.value;
                    
                    // Save preference
                    localStorage.setItem('${this.functionality.languageSelector.storage.key}', selectedLanguage);
                    
                    // Set cookie
                    document.cookie = \`mpesewa_language=\${selectedLanguage}; max-age=\${${this.functionality.languageSelector.storage.expiry === '365 days' ? '31536000' : '86400'}}; path=/\`;
                    
                    // Reload page if configured
                    if ('${this.functionality.languageSelector.onChange}' === 'reload-page') {
                        window.location.reload();
                    }
                    
                    // Track language change
                    trackAnalyticsEvent('language_change', {
                        language: selectedLanguage,
                        source: 'footer'
                    });
                });
            }
            
            function initBackToTop() {
                const backToTopBtn = document.querySelector('.back-to-top-et');
                if (!backToTopBtn) return;
                
                // Show/hide based on scroll position
                function toggleBackToTop() {
                    if (window.scrollY > ${this.functionality.backToTop.threshold}) {
                        backToTopBtn.classList.add('visible');
                    } else {
                        backToTopBtn.classList.remove('visible');
                    }
                }
                
                // Scroll to top
                function scrollToTop() {
                    window.scrollTo({
                        top: 0,
                        behavior: '${this.functionality.backToTop.animation}'
                    });
                    
                    // Track click
                    trackAnalyticsEvent('back_to_top_click', {
                        scroll_position: window.scrollY
                    });
                }
                
                // Event listeners
                window.addEventListener('scroll', toggleBackToTop);
                backToTopBtn.addEventListener('click', scrollToTop);
                
                // Initial check
                toggleBackToTop();
                
                // Keyboard support
                backToTopBtn.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        scrollToTop();
                    }
                });
            }
            
            function initFooterAnalytics() {
                // Track footer link clicks
                const footerLinks = document.querySelectorAll('.footer-link-et, .legal-link, .social-icon');
                footerLinks.forEach(link => {
                    link.addEventListener('click', function(event) {
                        const linkText = this.textContent.trim();
                        const linkUrl = this.href;
                        const linkCategory = this.closest('.footer-column')?.querySelector('.footer-column-title')?.textContent.trim() || 'unknown';
                        
                        trackAnalyticsEvent('footer_link_click', {
                            link_text: linkText,
                            link_url: linkUrl,
                            link_category: linkCategory,
                            timestamp: new Date().toISOString()
                        });
                    });
                });
                
                // Track newsletter interactions
                const newsletterInput = document.querySelector('.newsletter-form-et input[type="email"]');
                if (newsletterInput) {
                    newsletterInput.addEventListener('focus', function() {
                        trackAnalyticsEvent('newsletter_focus', {
                            field: 'email_input'
                        });
                    });
                }
            }
            
            function trackAnalyticsEvent(eventName, eventData) {
                // Google Analytics 4
                if (window.gtag) {
                    window.gtag('event', eventName, eventData);
                }
                
                // Facebook Pixel
                if (window.fbq) {
                    window.fbq('track', eventName, eventData);
                }
                
                // Custom data layer
                if (window.dataLayer) {
                    window.dataLayer.push({
                        event: eventName,
                        ...eventData
                    });
                }
                
                // Console log for debugging
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log(\`Analytics Event: \${eventName}\`, eventData);
                }
            }
            
            function enhanceAccessibility() {
                // Add focus indicators for keyboard navigation
                const focusableElements = document.querySelectorAll('.footer-link-et, .legal-link, .social-icon, .newsletter-button, .back-to-top-et, .language-selector-et');
                
                focusableElements.forEach(element => {
                    element.addEventListener('focus', function() {
                        this.style.outline = '2px solid #0099ff';
                        this.style.outlineOffset = '2px';
                    });
                    
                    element.addEventListener('blur', function() {
                        this.style.outline = '';
                        this.style.outlineOffset = '';
                    });
                });
                
                // Improve screen reader announcements
                const newsletterForm = document.querySelector('.newsletter-form-et');
                if (newsletterForm) {
                    const emailInput = newsletterForm.querySelector('input[type="email"]');
                    if (emailInput && !emailInput.getAttribute('aria-describedby')) {
                        const descriptionId = 'newsletter-email-description';
                        const descriptionEl = document.createElement('div');
                        descriptionEl.id = descriptionId;
                        descriptionEl.className = 'sr-only';
                        descriptionEl.textContent = 'Enter your email to subscribe to M-Pesewa Ethiopia updates';
                        newsletterForm.appendChild(descriptionEl);
                        emailInput.setAttribute('aria-describedby', descriptionId);
                    }
                }
            }
            
            // Screen reader only class
            const style = document.createElement('style');
            style.textContent = '.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }';
            document.head.appendChild(style);
            
        })();
    `;
};

// ============================================
// FOOTER UTILITY FUNCTIONS
// ============================================

/**
 * Get footer column by index
 * @param {number} index - Column index (1-6)
 * @returns {Object} Column configuration
 */
EthiopiaFooter.getColumn = function(index) {
    const columnKeys = Object.keys(this.columns);
    if (index >= 1 && index <= columnKeys.length) {
        return this.columns[columnKeys[index - 1]];
    }
    return null;
};

/**
 * Update footer link
 * @param {string} column - Column name
 * @param {string} linkText - Link text to update
 * @param {Object} newData - New link data
 */
EthiopiaFooter.updateLink = function(column, linkText, newData) {
    if (this.columns[column]) {
        const linkIndex = this.columns[column].links.findIndex(link => link.text === linkText);
        if (linkIndex !== -1) {
            this.columns[column].links[linkIndex] = {
                ...this.columns[column].links[linkIndex],
                ...newData
            };
        }
    }
};

/**
 * Add social media platform
 * @param {Object} platformData - Platform data
 */
EthiopiaFooter.addSocialMedia = function(platformData) {
    if (!this.columns.column6.socialMedia[platformData.name]) {
        this.columns.column6.socialMedia[platformData.name] = platformData;
    }
};

/**
 * Get country contact information
 * @param {string} countryCode - Country code
 * @returns {Object} Contact information
 */
EthiopiaFooter.getCountryContact = function(countryCode) {
    return this.bottomSection.countryContacts.countries.find(
        country => country.code === countryCode
    ) || null;
};

/**
 * Validate footer configuration
 * @returns {Array} Validation errors
 */
EthiopiaFooter.validate = function() {
    const errors = [];
    
    // Check required columns
    const requiredColumns = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6'];
    requiredColumns.forEach(col => {
        if (!this.columns[col]) {
            errors.push(`Missing required column: ${col}`);
        }
    });
    
    // Check copyright text
    if (!this.bottomSection.copyright.text) {
        errors.push('Missing copyright text');
    }
    
    // Validate email in newsletter
    if (this.functionality.newsletter.enabled) {
        if (!this.functionality.newsletter.title) {
            errors.push('Missing newsletter title');
        }
    }
    
    // Check contrast ratios
    const contrastIssues = this.checkContrastRatios();
    if (contrastIssues.length > 0) {
        errors.push(...contrastIssues);
    }
    
    return errors;
};

/**
 * Check color contrast ratios for accessibility
 * @returns {Array} Contrast issues
 */
EthiopiaFooter.checkContrastRatios = function() {
    const issues = [];
    
    // Check text color against background
    const textContrast = this.calculateContrast(
        this.hexToRgb(this.structure.layout.textColor),
        this.hexToRgb(this.structure.layout.backgroundColor)
    );
    
    if (textContrast < 4.5) {
        issues.push(`Text contrast ratio ${textContrast.toFixed(2)}:1 is below WCAG AA minimum of 4.5:1`);
    }
    
    // Check link color against background
    const linkContrast = this.calculateContrast(
        this.hexToRgb(this.structure.layout.linkColor),
        this.hexToRgb(this.structure.layout.backgroundColor)
    );
    
    if (linkContrast < 4.5) {
        issues.push(`Link contrast ratio ${linkContrast.toFixed(2)}:1 is below WCAG AA minimum of 4.5:1`);
    }
    
    return issues;
};

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color
 * @returns {Object} RGB values
 */
EthiopiaFooter.hexToRgb = function(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

/**
 * Calculate contrast ratio between two colors
 * @param {Object} rgb1 - First RGB color
 * @param {Object} rgb2 - Second RGB color
 * @returns {number} Contrast ratio
 */
EthiopiaFooter.calculateContrast = function(rgb1, rgb2) {
    const luminance1 = this.calculateLuminance(rgb1);
    const luminance2 = this.calculateLuminance(rgb2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Calculate relative luminance
 * @param {Object} rgb - RGB color
 * @returns {number} Relative luminance
 */
EthiopiaFooter.calculateLuminance = function(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

// ============================================
// EXPORT
// ============================================

// Validate configuration before freezing
const validationErrors = EthiopiaFooter.validate();
if (validationErrors.length > 0) {
    console.warn('Ethiopia Footer Configuration Warnings:', validationErrors);
} else {
    console.log('✓ Ethiopia footer configuration validated successfully');
}

// Freeze configuration
Object.freeze(EthiopiaFooter);

// Export the footer configuration
export default EthiopiaFooter;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthiopiaFooter;
}