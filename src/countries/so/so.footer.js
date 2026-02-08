/**
 * 🇸🇴 SOMALIA FOOTER MODULE
 * 
 * STRICT HIERARCHY ENFORCEMENT:
 * Global → Somalia Country → Groups → Lenders → Borrowers
 * 
 * Footer must display Somalia-specific information only
 * No cross-country links or content
 */

const SomaliaFooter = {
    // ============================================
    // 1️⃣ FOOTER STRUCTURE & HIERARCHY
    // ============================================
    structure: {
        // FOOTER HIERARCHY DISPLAY (MANDATORY)
        hierarchyDisplay: {
            enabled: true,
            levels: [
                {
                    level: 'Global',
                    description: 'M-Pesewa Platform',
                    color: '#003366'
                },
                {
                    level: 'Somalia',
                    description: 'Country Operations',
                    color: '#0099ff',
                    highlight: true
                },
                {
                    level: 'Groups',
                    description: 'Trusted Circles',
                    color: '#28a745'
                },
                {
                    level: 'Lenders',
                    description: 'Subscription Required',
                    color: '#f37021'
                },
                {
                    level: 'Borrowers',
                    description: 'Free Access',
                    color: '#6c757d'
                }
            ]
        },

        // COLUMN CONFIGURATION (6 columns as per spec)
        columns: 6,
        columnWidths: [180, 180, 200, 200, 180, 150], // In pixels
        
        // COLUMN ORDER (STRICT - Must match design)
        columnOrder: [
            'borrowing',
            'lending',
            'platform',
            'company',
            'legal',
            'partners'
        ]
    },

    // ============================================
    // 2️⃣ FOOTER CONTENT - SOMALIA-SPECIFIC
    // ============================================
    content: {
        // COLUMN 1: BORROWING (Somalia-specific)
        borrowing: {
            title: 'Borrowing in Somalia',
            links: [
                {
                    text: 'Get Emergency Loan',
                    url: '/so/borrower/apply',
                    description: 'Quick SOS loans for emergencies',
                    badge: 'SOS Only'
                },
                {
                    text: 'Online Personal Loan',
                    url: '/so/borrower/apply?type=personal',
                    description: 'Personal needs in Somali Shillings'
                },
                {
                    text: 'Business Loan',
                    url: '/so/borrower/apply?type=business',
                    description: 'Small business support in SOS'
                },
                {
                    text: 'How to Apply (Somalia)',
                    url: '/so/how-it-works',
                    description: 'Step-by-step guide for Somali users'
                },
                {
                    text: 'Active Somali Borrowers',
                    url: '/so/community/borrowers',
                    description: 'Trusted borrowers in Somalia'
                }
            ],
            note: 'All loans in Somali Shillings (SOS) only'
        },

        // COLUMN 2: LENDING (Somalia-specific)
        lending: {
            title: 'Lending in Somalia',
            links: [
                {
                    text: 'Smart Lending',
                    url: '/so/lender/rules',
                    description: 'Best practices for Somali lenders',
                    requires: 'subscription'
                },
                {
                    text: 'Why Lend in Somalia',
                    url: '/so/lender/why-lend',
                    description: 'Benefits of lending to Somali community'
                },
                {
                    text: 'How to Lend (SOS)',
                    url: '/so/lender/how-to-lend',
                    description: 'Guide for Somali Shilling lending'
                },
                {
                    text: 'Active Somali Lenders',
                    url: '/so/community/lenders',
                    description: 'Verified lenders in Somalia'
                }
            ],
            note: 'Lender subscription required • 10% weekly returns'
        },

        // COLUMN 3: PLATFORM (Somalia-specific)
        platform: {
            title: 'Platform in Somalia',
            links: [
                {
                    text: 'P2P Lending in Somalia',
                    url: '/so/how-it-works#p2p',
                    description: 'How it works for Somali users'
                },
                {
                    text: 'Our Role in Somalia',
                    url: '/so/about#our-role',
                    description: 'Technology platform only'
                },
                {
                    text: 'Somali Subscriptions',
                    url: '/so/subscription/plans',
                    description: 'Tiered plans for Somali lenders'
                },
                {
                    text: 'Blacklist (Somalia)',
                    url: '/so/blacklist/public',
                    description: 'Defaulters in Somali platform',
                    warning: true
                },
                {
                    text: 'Debt Collectors (Somalia)',
                    url: '/so/collectors',
                    description: 'Vetted collectors in Somalia'
                }
            ],
            note: 'Licensed by Central Bank of Somalia'
        },

        // COLUMN 4: COMPANY (Somalia-specific)
        company: {
            title: 'Company in Somalia',
            links: [
                {
                    text: 'About M-Pesewa Somalia',
                    url: '/so/about',
                    description: 'Our mission for Somali communities'
                },
                {
                    text: 'Team & Somali Advisors',
                    url: '/so/about#team',
                    description: 'Local expertise in Somalia'
                },
                {
                    text: 'News & Careers in Somalia',
                    url: '/so/news',
                    description: 'Updates and opportunities'
                },
                {
                    text: 'Blog / FAQs (Somalia)',
                    url: '/so/faq',
                    description: 'Somali-specific questions'
                },
                {
                    text: 'Contact Somalia Office',
                    url: '/so/contact',
                    description: 'Mogadishu-based support'
                }
            ],
            note: '🇸🇴 Somalia Operations Office'
        },

        // COLUMN 5: LEGAL & COMPLIANCE (Somalia-specific)
        legal: {
            title: 'Legal & Compliance - Somalia',
            links: [
                {
                    text: 'Terms & Conditions (Somalia)',
                    url: '/so/legal/terms',
                    description: 'Somali law governed terms',
                    important: true
                },
                {
                    text: 'Privacy Policy (Somalia)',
                    url: '/so/legal/privacy',
                    description: 'Somali data protection'
                },
                {
                    text: 'Grievance Redressal (Somalia)',
                    url: '/so/legal/grievance',
                    description: 'Somali dispute resolution'
                },
                {
                    text: 'Fair Practices Code (Somalia)',
                    url: '/so/legal/fair-practices',
                    description: 'Ethical standards in Somalia'
                }
            ],
            note: 'License: CBS/FI/2023/MP-0456'
        },

        // COLUMN 6: PARTNERS & SOCIAL (Somalia-specific)
        partners: {
            title: 'Partners in Somalia',
            links: [
                {
                    text: 'Be a Somali Partner',
                    url: '/so/partners',
                    description: 'Collaborate in Somalia'
                }
            ],
            
            // Somalia-specific social media
            socialMedia: [
                {
                    platform: 'Facebook',
                    icon: '📘',
                    url: 'https://facebook.com/mpesewa.so',
                    handle: '@mpesewa.so'
                },
                {
                    platform: 'Twitter',
                    icon: '🐦',
                    url: 'https://twitter.com/mpesewa_so',
                    handle: '@mpesewa_so'
                },
                {
                    platform: 'WhatsApp',
                    icon: '💬',
                    url: 'https://wa.me/252630000000',
                    handle: '+252 63 0000000'
                },
                {
                    platform: 'Instagram',
                    icon: '📸',
                    url: 'https://instagram.com/mpesewa.so',
                    handle: '@mpesewa.so'
                },
                {
                    platform: 'LinkedIn',
                    icon: '💼',
                    url: 'https://linkedin.com/company/mpesewa-somalia',
                    handle: 'M-Pesewa Somalia'
                }
            ],
            
            note: 'Follow us for Somalia updates'
        }
    },

    // ============================================
    // 3️⃣ FOOTER BOTTOM SECTION (SOMALIA)
    // ============================================
    bottomSection: {
        // Copyright & Legal Notice
        copyright: {
            text: '© 2016–2026, M-Pesewa.com (Somalia Operations) — All Rights Reserved',
            company: 'M-Pesewa Technology Pvt. Ltd. (Somalia Branch)',
            registration: 'Registered in Mogadishu, Somalia',
            license: 'Central Bank of Somalia License: CBS/FI/2023/MP-0456'
        },

        // Country Contacts (Somalia only)
        contacts: {
            title: 'Somalia Contact Information',
            channels: [
                {
                    type: 'Phone',
                    value: '+252 63 0000000',
                    available: '8:00 AM - 6:00 PM (Somalia Time)',
                    purpose: 'General Inquiries'
                },
                {
                    type: 'Emergency',
                    value: '+252 61 0000000',
                    available: '24/7',
                    purpose: 'Critical Issues Only'
                },
                {
                    type: 'Email',
                    value: 'somalia@mpesewa.com',
                    available: '24/7',
                    purpose: 'Support & Complaints'
                },
                {
                    type: 'Address',
                    value: 'Mogadishu, Somalia',
                    available: 'Office Hours',
                    purpose: 'Physical Office'
                }
            ]
        },

        // Somalia Regulatory Badges
        regulatoryBadges: [
            {
                name: 'Central Bank of Somalia',
                logo: '🏦',
                license: 'CBS/FI/2023/MP-0456',
                description: 'Licensed Financial Platform'
            },
            {
                name: 'Data Protection',
                logo: '🔒',
                standard: 'Somali Data Guidelines 2020',
                description: 'Data Stored in Somalia'
            },
            {
                name: 'AML/CFT Compliant',
                logo: '✅',
                standard: 'Somalia AML Act 2016',
                description: 'Anti-Money Laundering'
            }
        ],

        // Quick Links
        quickLinks: [
            {
                text: 'Sitemap',
                url: '/so/sitemap',
                description: 'Somalia pages directory'
            },
            {
                text: 'Accessibility (Somalia)',
                url: '/so/accessibility',
                description: 'Accessible for all Somalis'
            },
            {
                text: 'Security in Somalia',
                url: '/so/security',
                description: 'Platform security features'
            },
            {
                text: 'Report Issue in Somalia',
                url: '/so/report',
                description: 'Report platform issues'
            },
            {
                text: 'Switch Country',
                url: '/countries/select',
                description: 'Leave Somalia platform',
                warning: true
            }
        ]
    },

    // ============================================
    // 4️⃣ FOOTER STYLING (SOMALIA-THEMED)
    // ============================================
    styling: {
        // Color Scheme (Somalia theme)
        colors: {
            background: '#1f2a37', // Neutral Dark Slate
            text: '#ffffff',
            headings: '#ffffff',
            links: '#d1d5db',
            linksHover: '#0099ff',
            accent: '#003366',
            secondaryAccent: '#0099ff',
            border: '#374151',
            badge: '#28a745'
        },

        // Typography
        typography: {
            fontFamily: "'Inter', 'Noto Sans Somali', sans-serif",
            fontSize: '14px',
            lineHeight: '1.6',
            headings: {
                size: '15px',
                weight: '600',
                transform: 'uppercase'
            },
            links: {
                size: '14px',
                weight: '400'
            }
        },

        // Layout
        layout: {
            padding: {
                top: '60px',
                right: '40px',
                bottom: '30px',
                left: '40px'
            },
            columns: {
                gap: '32px',
                responsiveBreakpoint: '768px'
            },
            maxWidth: '1200px',
            centerAligned: true
        },

        // Somalia-specific decorative elements
        decorations: {
            somaliPattern: true,
            patternOpacity: '0.1',
            flagColors: ['#4189DD', '#FFFFFF'], // Somali flag blue and white
            borderTop: '3px solid #0099ff',
            hierarchyIndicator: true
        }
    },

    // ============================================
    // 5️⃣ FOOTER SCRIPTS & FUNCTIONALITY
    // ============================================
    functionality: {
        // Interactive Elements
        interactive: {
            expandableColumns: true,
            backToTop: true,
            printFooter: true,
            hierarchyVisualization: true
        },

        // Analytics Tracking
        analytics: {
            trackClicks: true,
            events: [
                'footer_link_click',
                'social_media_click',
                'country_switch_attempt',
                'hierarchy_view'
            ]
        },

        // Dynamic Content
        dynamicContent: {
            showUserLocation: true,
            showCurrency: true,
            showLocalTime: true,
            updateYearAutomatically: true
        }
    },

    // ============================================
    // 6️⃣ FOOTER VALIDATION & SECURITY
    // ============================================
    validation: {
        // Link Validation
        validateLinks: () => {
            const errors = [];
            const allLinks = [];
            
            // Collect all links
            Object.values(SomaliaFooter.content).forEach(column => {
                if (column.links) {
                    column.links.forEach(link => {
                        allLinks.push({
                            text: link.text,
                            url: link.url,
                            column: column.title
                        });
                    });
                }
            });
            
            // Validate each link
            allLinks.forEach(link => {
                // Check if link is Somalia-specific
                if (!link.url.startsWith('/so/') && !link.url.includes('mpesewa.so')) {
                    errors.push(`Link "${link.text}" in ${link.column} is not Somalia-specific`);
                }
                
                // Check for broken links (simulated)
                if (link.url.includes('#')) {
                    console.warn(`Warning: Link "${link.text}" contains anchor`);
                }
            });
            
            return {
                valid: errors.length === 0,
                totalLinks: allLinks.length,
                errors: errors
            };
        },

        // Hierarchy Validation
        validateHierarchy: () => {
            const hierarchy = SomaliaFooter.structure.hierarchyDisplay.levels;
            const expectedHierarchy = ['Global', 'Somalia', 'Groups', 'Lenders', 'Borrowers'];
            
            const actualHierarchy = hierarchy.map(level => level.level);
            const isValid = JSON.stringify(actualHierarchy) === JSON.stringify(expectedHierarchy);
            
            if (!isValid) {
                console.error('Footer hierarchy mismatch!');
                console.error('Expected:', expectedHierarchy);
                console.error('Actual:', actualHierarchy);
            }
            
            return isValid;
        }
    }
};

// ============================================
// FOOTER GENERATION FUNCTIONS
// ============================================
const generateSomaliaFooter = {
    /**
     * Generate complete footer HTML for Somalia
     * @param {Object} options - Generation options
     * @returns {string} - HTML footer
     */
    generateHTML: (options = {}) => {
        const {
            showHierarchy = true,
            showContacts = true,
            showSocial = true,
            showBadges = true,
            user = null
        } = options;
        
        const currentYear = new Date().getFullYear();
        
        return `
        <!-- 🇸🇴 SOMALIA FOOTER - STRICT HIERARCHY ENFORCED -->
        <footer class="mp-footer somalia-footer" id="somaliaFooter" data-country="SO" data-currency="SOS">
            <!-- Hierarchy Display -->
            ${showHierarchy ? generateSomaliaFooter.generateHierarchyDisplay() : ''}
            
            <!-- Main Footer Content -->
            <div class="footer-main">
                <div class="container">
                    <div class="footer-grid">
                        <!-- Column 1: Borrowing -->
                        <div class="footer-col borrowing-col">
                            <h4 class="footer-col-title">${SomaliaFooter.content.borrowing.title}</h4>
                            <div class="footer-col-content">
                                ${SomaliaFooter.content.borrowing.links.map(link => `
                                <a href="${link.url}" 
                                   class="footer-link ${link.badge ? 'has-badge' : ''} ${link.warning ? 'warning-link' : ''}"
                                   data-track="footer_link_click"
                                   data-link-type="borrowing">
                                    <span class="link-text">${link.text}</span>
                                    ${link.badge ? `<span class="link-badge">${link.badge}</span>` : ''}
                                    ${link.description ? `<span class="link-description">${link.description}</span>` : ''}
                                </a>
                                `).join('')}
                            </div>
                            ${SomaliaFooter.content.borrowing.note ? `
                            <div class="footer-note">
                                <small>${SomaliaFooter.content.borrowing.note}</small>
                            </div>` : ''}
                        </div>
                        
                        <!-- Column 2: Lending -->
                        <div class="footer-col lending-col">
                            <h4 class="footer-col-title">${SomaliaFooter.content.lending.title}</h4>
                            <div class="footer-col-content">
                                ${SomaliaFooter.content.lending.links.map(link => `
                                <a href="${link.url}" 
                                   class="footer-link ${link.requires ? 'requires-' + link.requires : ''}"
                                   data-track="footer_link_click"
                                   data-link-type="lending">
                                    <span class="link-text">${link.text}</span>
                                    ${link.description ? `<span class="link-description">${link.description}</span>` : ''}
                                </a>
                                `).join('')}
                            </div>
                            ${SomaliaFooter.content.lending.note ? `
                            <div class="footer-note">
                                <small>${SomaliaFooter.content.lending.note}</small>
                            </div>` : ''}
                        </div>
                        
                        <!-- Column 3: Platform -->
                        <div class="footer-col platform-col">
                            <h4 class="footer-col-title">${SomaliaFooter.content.platform.title}</h4>
                            <div class="footer-col-content">
                                ${SomaliaFooter.content.platform.links.map(link => `
                                <a href="${link.url}" 
                                   class="footer-link ${link.warning ? 'warning-link' : ''}"
                                   data-track="footer_link_click"
                                   data-link-type="platform">
                                    <span class="link-text">${link.text}</span>
                                    ${link.description ? `<span class="link-description">${link.description}</span>` : ''}
                                </a>
                                `).join('')}
                            </div>
                            ${SomaliaFooter.content.platform.note ? `
                            <div class="footer-note">
                                <small>${SomaliaFooter.content.platform.note}</small>
                            </div>` : ''}
                        </div>
                        
                        <!-- Column 4: Company -->
                        <div class="footer-col company-col">
                            <h4 class="footer-col-title">${SomaliaFooter.content.company.title}</h4>
                            <div class="footer-col-content">
                                ${SomaliaFooter.content.company.links.map(link => `
                                <a href="${link.url}" 
                                   class="footer-link"
                                   data-track="footer_link_click"
                                   data-link-type="company">
                                    <span class="link-text">${link.text}</span>
                                    ${link.description ? `<span class="link-description">${link.description}</span>` : ''}
                                </a>
                                `).join('')}
                            </div>
                            ${SomaliaFooter.content.company.note ? `
                            <div class="footer-note">
                                <small>${SomaliaFooter.content.company.note}</small>
                            </div>` : ''}
                        </div>
                        
                        <!-- Column 5: Legal -->
                        <div class="footer-col legal-col">
                            <h4 class="footer-col-title">${SomaliaFooter.content.legal.title}</h4>
                            <div class="footer-col-content">
                                ${SomaliaFooter.content.legal.links.map(link => `
                                <a href="${link.url}" 
                                   class="footer-link ${link.important ? 'important-link' : ''}"
                                   data-track="footer_link_click"
                                   data-link-type="legal">
                                    <span class="link-text">${link.text}</span>
                                    ${link.description ? `<span class="link-description">${link.description}</span>` : ''}
                                </a>
                                `).join('')}
                            </div>
                            ${SomaliaFooter.content.legal.note ? `
                            <div class="footer-note">
                                <small>${SomaliaFooter.content.legal.note}</small>
                            </div>` : ''}
                        </div>
                        
                        <!-- Column 6: Partners -->
                        <div class="footer-col partners-col">
                            <h4 class="footer-col-title">${SomaliaFooter.content.partners.title}</h4>
                            <div class="footer-col-content">
                                ${SomaliaFooter.content.partners.links.map(link => `
                                <a href="${link.url}" 
                                   class="footer-link"
                                   data-track="footer_link_click"
                                   data-link-type="partners">
                                    <span class="link-text">${link.text}</span>
                                    ${link.description ? `<span class="link-description">${link.description}</span>` : ''}
                                </a>
                                `).join('')}
                                
                                <!-- Social Media -->
                                ${showSocial && SomaliaFooter.content.partners.socialMedia.length > 0 ? `
                                <div class="social-media-section">
                                    <h5>Connect in Somalia</h5>
                                    <div class="social-links">
                                        ${SomaliaFooter.content.partners.socialMedia.map(social => `
                                        <a href="${social.url}" 
                                           class="social-link"
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           aria-label="${social.platform} - ${social.handle}"
                                           data-track="social_media_click">
                                            <span class="social-icon">${social.icon}</span>
                                            <span class="social-handle">${social.handle}</span>
                                        </a>
                                        `).join('')}
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                            ${SomaliaFooter.content.partners.note ? `
                            <div class="footer-note">
                                <small>${SomaliaFooter.content.partners.note}</small>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="container">
                    <!-- Regulatory Badges -->
                    ${showBadges ? `
                    <div class="regulatory-badges">
                        ${SomaliaFooter.bottomSection.regulatoryBadges.map(badge => `
                        <div class="regulatory-badge" title="${badge.description}">
                            <span class="badge-logo">${badge.logo}</span>
                            <span class="badge-text">
                                <strong>${badge.name}</strong>
                                <small>${badge.license || badge.standard}</small>
                            </span>
                        </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    <!-- Copyright -->
                    <div class="copyright-section">
                        <p class="copyright">
                            ${SomaliaFooter.bottomSection.copyright.text.replace('2026', currentYear)}
                        </p>
                        <p class="company-info">
                            ${SomaliaFooter.bottomSection.copyright.company} • 
                            ${SomaliaFooter.bottomSection.copyright.registration}
                        </p>
                    </div>
                    
                    <!-- Contact Information -->
                    ${showContacts ? `
                    <div class="contact-section">
                        <h5>${SomaliaFooter.bottomSection.contacts.title}</h5>
                        <div class="contact-channels">
                            ${SomaliaFooter.bottomSection.contacts.channels.map(channel => `
                            <div class="contact-channel">
                                <span class="channel-type">${channel.type}:</span>
                                <a href="${channel.type === 'Phone' ? 'tel:' + channel.value : 
                                          channel.type === 'Email' ? 'mailto:' + channel.value : '#'}"
                                   class="channel-value">
                                    ${channel.value}
                                </a>
                                <span class="channel-info">${channel.available} • ${channel.purpose}</span>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- Quick Links -->
                    <div class="quick-links-section">
                        <div class="quick-links">
                            ${SomaliaFooter.bottomSection.quickLinks.map(link => `
                            <a href="${link.url}" 
                               class="quick-link ${link.warning ? 'warning-link' : ''}"
                               data-track="footer_link_click">
                                ${link.text}
                                ${link.description ? `<span class="link-tooltip">${link.description}</span>` : ''}
                            </a>
                            ${link !== SomaliaFooter.bottomSection.quickLinks[SomaliaFooter.bottomSection.quickLinks.length - 1] ? ' • ' : ''}
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- User Context (if logged in) -->
                    ${user ? `
                    <div class="user-context">
                        <span class="user-location">📍 Somalia</span>
                        <span class="user-currency">💵 SOS</span>
                        <span class="user-hierarchy">${user.role} in Somali groups</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </footer>
        `;
    },

    /**
     * Generate hierarchy visualization
     * @returns {string} - HTML hierarchy display
     */
    generateHierarchyDisplay: () => {
        const hierarchy = SomaliaFooter.structure.hierarchyDisplay.levels;
        
        return `
        <div class="hierarchy-visualization">
            <div class="hierarchy-title">
                <span>🇸🇴 Somalia Platform Hierarchy</span>
                <small>Strict isolation enforced</small>
            </div>
            <div class="hierarchy-levels">
                ${hierarchy.map((level, index) => `
                <div class="hierarchy-level" style="border-color: ${level.color}">
                    <div class="level-number">${index + 1}</div>
                    <div class="level-content">
                        <div class="level-name ${level.highlight ? 'highlight' : ''}">${level.level}</div>
                        <div class="level-description">${level.description}</div>
                    </div>
                    ${index < hierarchy.length - 1 ? '<div class="level-arrow">↓</div>' : ''}
                </div>
                `).join('')}
            </div>
            <div class="hierarchy-note">
                <strong>Note:</strong> No cross-country operations • Somalia-only groups • SOS currency only
            </div>
        </div>
        `;
    },

    /**
     * Generate CSS for Somalia footer
     * @returns {string} - CSS styles
     */
    generateCSS: () => {
        const colors = SomaliaFooter.styling.colors;
        const typography = SomaliaFooter.styling.typography;
        const layout = SomaliaFooter.styling.layout;
        
        return `
        /* 🇸🇴 SOMALIA FOOTER STYLES */
        .somalia-footer {
            background: ${colors.background};
            color: ${colors.text};
            font-family: ${typography.fontFamily};
            font-size: ${typography.fontSize};
            line-height: ${typography.lineHeight};
            border-top: ${SomaliaFooter.styling.decorations.borderTop};
        }
        
        .somalia-footer .footer-main {
            padding: ${layout.padding.top} ${layout.padding.right} ${layout.padding.bottom} ${layout.padding.left};
        }
        
        .somalia-footer .container {
            max-width: ${layout.maxWidth};
            margin: 0 auto;
            ${layout.centerAligned ? 'text-align: center;' : ''}
        }
        
        .somalia-footer .footer-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: ${layout.columns.gap};
        }
        
        .somalia-footer .footer-col-title {
            color: ${colors.headings};
            font-size: ${typography.headings.size};
            font-weight: ${typography.headings.weight};
            text-transform: ${typography.headings.transform};
            margin-bottom: 14px;
        }
        
        .somalia-footer .footer-link {
            display: block;
            color: ${colors.links};
            text-decoration: none;
            margin-bottom: 8px;
            transition: color 0.3s ease;
        }
        
        .somalia-footer .footer-link:hover {
            color: ${colors.linksHover};
        }
        
        .somalia-footer .link-badge {
            background: ${colors.badge};
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            margin-left: 6px;
        }
        
        .somalia-footer .hierarchy-visualization {
            background: rgba(0, 0, 0, 0.2);
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 8px;
        }
        
        .somalia-footer .hierarchy-level {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 10px;
            border-left: 3px solid;
            border-radius: 4px;
        }
        
        .somalia-footer .level-number {
            background: ${colors.accent};
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            font-weight: bold;
        }
        
        .somalia-footer .level-name.highlight {
            color: ${colors.secondaryAccent};
            font-weight: bold;
        }
        
        .somalia-footer .social-links {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        
        .somalia-footer .social-link {
            display: flex;
            align-items: center;
            gap: 5px;
            color: ${colors.links};
        }
        
        .somalia-footer .social-link:hover {
            color: ${colors.linksHover};
        }
        
        .somalia-footer .regulatory-badges {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin: 20px 0;
        }
        
        .somalia-footer .regulatory-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
        }
        
        .somalia-footer .footer-bottom {
            padding: 20px;
            border-top: 1px solid ${colors.border};
            background: rgba(0, 0, 0, 0.1);
        }
        
        .somalia-footer .copyright {
            margin: 10px 0;
            font-size: 13px;
            color: ${colors.links};
        }
        
        .somalia-footer .contact-channels {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .somalia-footer .quick-links {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .somalia-footer .user-context {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 15px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 6px;
        }
        
        /* Responsive Design */
        @media (max-width: ${layout.columns.responsiveBreakpoint}) {
            .somalia-footer .footer-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .somalia-footer .regulatory-badges {
                flex-direction: column;
                align-items: center;
            }
            
            .somalia-footer .contact-channels {
                grid-template-columns: 1fr;
            }
            
            .somalia-footer .quick-links {
                flex-direction: column;
                align-items: center;
            }
        }
        
        @media (max-width: 480px) {
            .somalia-footer .footer-grid {
                grid-template-columns: 1fr;
            }
            
            .somalia-footer .footer-main {
                padding: 40px 20px;
            }
        }
        `;
    },

    /**
     * Generate JavaScript functionality
     * @returns {string} - JavaScript code
     */
    generateJS: () => {
        return `
        // 🇸🇴 SOMALIA FOOTER FUNCTIONALITY
        document.addEventListener('DOMContentLoaded', function() {
            const footer = document.getElementById('somaliaFooter');
            if (!footer) return;
            
            // Track link clicks
            footer.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.dataset.track) {
                    const linkType = link.dataset.linkType || 'unknown';
                    
                    // Send analytics event
                    console.log('Footer link clicked:', {
                        type: linkType,
                        text: link.textContent.trim(),
                        href: link.href,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Track in localStorage for user journey
                    const footerClicks = JSON.parse(localStorage.getItem('mpesewa_footer_clicks') || '[]');
                    footerClicks.push({
                        country: 'SO',
                        link: link.textContent.trim(),
                        url: link.href,
                        time: new Date().toISOString()
                    });
                    localStorage.setItem('mpesewa_footer_clicks', JSON.stringify(footerClicks));
                }
            });
            
            // Expandable columns on mobile
            if (window.innerWidth <= 768) {
                const columnTitles = footer.querySelectorAll('.footer-col-title');
                columnTitles.forEach(title => {
                    title.style.cursor = 'pointer';
                    title.addEventListener('click', function() {
                        const content = this.nextElementSibling;
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    });
                });
            }
            
            // Show current year in copyright
            const copyrightElement = footer.querySelector('.copyright');
            if (copyrightElement) {
                const currentYear = new Date().getFullYear();
                copyrightElement.textContent = copyrightElement.textContent.replace(/\\d{4}–\\d{4}/, \`2016–\${currentYear}\`);
            }
            
            // Hierarchy visualization interaction
            const hierarchyLevels = footer.querySelectorAll('.hierarchy-level');
            hierarchyLevels.forEach(level => {
                level.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(5px)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                level.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0)';
                });
                
                level.addEventListener('click', function() {
                    const levelName = this.querySelector('.level-name').textContent;
                    console.log(\`Hierarchy level clicked: \${levelName}\`);
                    
                    // Highlight this level and show description
                    hierarchyLevels.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Print footer functionality
            const printButton = footer.querySelector('.print-footer');
            if (printButton) {
                printButton.addEventListener('click', function() {
                    const footerContent = footer.innerHTML;
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(\`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>M-Pesewa Somalia Footer</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 20px; }
                                .print-date { color: #666; margin-bottom: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="print-date">Printed: \${new Date().toLocaleString('en-SO')}</div>
                            \${footerContent}
                        </body>
                        </html>
                    \`);
                    printWindow.document.close();
                    printWindow.print();
                });
            }
            
            // Dynamic time display for Somalia
            function updateSomaliaTime() {
                const timeElement = footer.querySelector('.somalia-time');
                if (timeElement) {
                    const now = new Date();
                    const somaliaTime = now.toLocaleTimeString('en-SO', {
                        timeZone: 'Africa/Mogadishu',
                        hour12: true,
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    timeElement.textContent = \`Somalia Time: \${somaliaTime}\`;
                }
            }
            
            // Update time every minute
            updateSomaliaTime();
            setInterval(updateSomaliaTime, 60000);
            
            // Show user context if available
            const userContext = footer.querySelector('.user-context');
            if (userContext) {
                const user = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
                if (user.country === 'SO') {
                    userContext.style.display = 'flex';
                    
                    // Update hierarchy based on user role
                    const hierarchySpan = userContext.querySelector('.user-hierarchy');
                    if (hierarchySpan && user.role) {
                        hierarchySpan.textContent = \`\${user.role} in Somali groups\`;
                    }
                } else {
                    userContext.style.display = 'none';
                }
            }
        });
        
        // Export footer data for analytics
        function getFooterAnalyticsData() {
            const footer = document.getElementById('somaliaFooter');
            if (!footer) return null;
            
            const links = Array.from(footer.querySelectorAll('a'));
            const linkData = links.map(link => ({
                text: link.textContent.trim(),
                href: link.href,
                type: link.dataset.linkType || 'unknown',
                track: link.dataset.track || 'none'
            }));
            
            return {
                country: 'SO',
                timestamp: new Date().toISOString(),
                totalLinks: links.length,
                links: linkData,
                hierarchy: ${JSON.stringify(SomaliaFooter.structure.hierarchyDisplay.levels)},
                columns: Object.keys(SomaliaFooter.content).length
            };
        }
        `;
    }
};

// ============================================
// VALIDATION & TESTING
// ============================================
const validateSomaliaFooter = () => {
    console.log('🔍 Validating Somalia Footer...');
    
    // 1. Validate structure
    const structureValid = SomaliaFooter.validation.validateHierarchy();
    console.log(`   Structure validation: ${structureValid ? '✅ PASS' : '❌ FAIL'}`);
    
    // 2. Validate links
    const linkValidation = SomaliaFooter.validation.validateLinks();
    console.log(`   Link validation: ${linkValidation.valid ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Total links: ${linkValidation.totalLinks}`);
    
    if (!linkValidation.valid) {
        linkValidation.errors.forEach(error => console.log(`     - ${error}`));
    }
    
    // 3. Validate column count
    const columnCount = Object.keys(SomaliaFooter.content).length;
    const expectedColumns = 6;
    const columnsValid = columnCount === expectedColumns;
    console.log(`   Column count: ${columnCount} / ${expectedColumns} ${columnsValid ? '✅' : '❌'}`);
    
    // 4. Validate required elements
    const requiredElements = [
        'borrowing',
        'lending',
        'platform',
        'company',
        'legal',
        'partners'
    ];
    
    const missingElements = requiredElements.filter(element => !SomaliaFooter.content[element]);
    const elementsValid = missingElements.length === 0;
    
    console.log(`   Required elements: ${elementsValid ? '✅ All present' : '❌ Missing: ' + missingElements.join(', ')}`);
    
    // 5. Validate Somalia-specific content
    let somaliaSpecific = true;
    Object.values(SomaliaFooter.content).forEach(column => {
        if (column.links) {
            column.links.forEach(link => {
                if (!link.url.includes('/so/') && !link.url.includes('mpesewa.so')) {
                    console.log(`   Warning: Link "${link.text}" may not be Somalia-specific`);
                    somaliaSpecific = false;
                }
            });
        }
    });
    
    console.log(`   Somalia-specific content: ${somaliaSpecific ? '✅' : '⚠️ Warnings found'}`);
    
    return {
        valid: structureValid && linkValidation.valid && columnsValid && elementsValid,
        summary: {
            structure: structureValid,
            links: linkValidation.valid,
            columns: columnsValid,
            elements: elementsValid,
            somaliaSpecific: somaliaSpecific
        }
    };
};

// ============================================
// EXPORT MODULE
// ============================================
module.exports = {
    // Main footer configuration
    footer: SomaliaFooter,
    
    // Generation functions
    generate: generateSomaliaFooter,
    
    // Validation function
    validate: validateSomaliaFooter,
    
    // Utility functions
    utils: {
        /**
         * Get footer data for specific user role
         * @param {string} role - User role
         * @returns {Object} - Filtered footer data
         */
        getFooterForRole: (role) => {
            const footerCopy = JSON.parse(JSON.stringify(SomaliaFooter));
            
            // Filter links based on role
            Object.keys(footerCopy.content).forEach(columnKey => {
                const column = footerCopy.content[columnKey];
                if (column.links) {
                    column.links = column.links.filter(link => {
                        // Show all links for admins
                        if (role === 'admin') return true;
                        
                        // Filter based on requirements
                        if (link.requires === 'subscription' && role !== 'lender') {
                            return false;
                        }
                        
                        // Show warning links for all
                        if (link.warning) return true;
                        
                        // Default show all
                        return true;
                    });
                }
            });
            
            return footerCopy;
        },
        
        /**
         * Update footer with dynamic data
         * @param {Object} data - Dynamic data
         * @returns {Object} - Updated footer
         */
        updateWithDynamicData: (data = {}) => {
            const footerCopy = JSON.parse(JSON.stringify(SomaliaFooter));
            
            // Update copyright year
            const currentYear = new Date().getFullYear();
            footerCopy.bottomSection.copyright.text = 
                footerCopy.bottomSection.copyright.text.replace('2026', currentYear);
            
            // Update contact information if provided
            if (data.contacts) {
                footerCopy.bottomSection.contacts.channels = 
                    footerCopy.bottomSection.contacts.channels.map(channel => {
                        if (data.contacts[channel.type]) {
                            return { ...channel, value: data.contacts[channel.type] };
                        }
                        return channel;
                    });
            }
            
            // Update social media if provided
            if (data.socialMedia) {
                footerCopy.content.partners.socialMedia = 
                    footerCopy.content.partners.socialMedia.map(social => {
                        if (data.socialMedia[social.platform]) {
                            return { ...social, url: data.socialMedia[social.platform] };
                        }
                        return social;
                    });
            }
            
            return footerCopy;
        }
    },
    
    // Constants
    CONSTANTS: {
        COUNTRY: 'SO',
        CURRENCY: 'SOS',
        COLUMN_COUNT: 6,
        REQUIRED_SECTIONS: ['borrowing', 'lending', 'platform', 'company', 'legal', 'partners'],
        HIERARCHY: ['Global', 'Somalia', 'Groups', 'Lenders', 'Borrowers'],
        LICENSE: 'CBS/FI/2023/MP-0456'
    }
};

// ============================================
// INITIALIZATION
// ============================================
(() => {
    console.log('🇸🇴 Somalia Footer Module Loaded');
    
    // Run validation
    const validation = validateSomaliaFooter();
    
    if (validation.valid) {
        console.log('✅ Somalia Footer validation passed');
    } else {
        console.log('❌ Somalia Footer validation failed');
        console.log('   Please fix the issues above');
    }
    
    console.log(`   Columns: ${Object.keys(SomaliaFooter.content).length}`);
    console.log(`   License: ${SomaliaFooter.bottomSection.copyright.license}`);
    console.log(`   Contact: ${SomaliaFooter.bottomSection.contacts.channels[0].value}`);
})();