/**
 * M-Pesewa Uganda - Country-Specific Footer Configuration
 * Strict Hierarchy: Global → Country → Groups → Lenders → Borrowers
 * Last Updated: 2026-01-24
 */

class UgandaFooterConfig {
    constructor() {
        this.countryCode = 'UG';
        this.countryName = 'Uganda';
        this.currency = 'UGX';
        this.localization = {
            language: 'English',
            secondaryLanguage: 'Swahili'
        };
    }

    /**
     * Get Uganda-specific footer structure
     * Returns: Object containing footer configuration
     */
    getFooterStructure() {
        return {
            // Primary contact information for Uganda
            contacts: {
                primaryPhone: '+256 392 175 546',
                secondaryPhone: '+256 414 123 456',
                emergencyContact: '+256 800 123 456',
                email: 'uganda@m-pesewa.com',
                supportEmail: 'support.ug@m-pesewa.com',
                address: 'Plot 23, Kampala Road, Kampala, Uganda',
                workingHours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM'
            },

            // Regulatory bodies in Uganda
            regulators: [
                {
                    name: 'Bank of Uganda',
                    url: 'https://www.bou.or.ug',
                    license: 'Microfinance License No. MFI/001/2024'
                },
                {
                    name: 'Uganda Microfinance Regulatory Authority',
                    url: 'https://www.umra.go.ug',
                    license: 'P2P Lending Permit UG-P2P-2024-001'
                }
            ],

            // Country-specific legal links
            legalLinks: {
                terms: '/legal/uganda/terms',
                privacy: '/legal/uganda/privacy',
                lendingRules: '/legal/uganda/lending-rules',
                borrowingRules: '/legal/uganda/borrowing-rules',
                disputeResolution: '/legal/uganda/dispute-resolution',
                consumerProtection: '/legal/uganda/consumer-protection'
            },

            // Uganda-specific partnership information
            partnerships: [
                {
                    name: 'Uganda Bankers Association',
                    type: 'Industry Association'
                },
                {
                    name: 'Kampala City Traders Association',
                    type: 'Business Network'
                },
                {
                    name: 'Uganda Cooperative Alliance',
                    type: 'Cooperative Network'
                }
            ],

            // Footer columns with Uganda-specific content
            columns: [
                {
                    title: 'Borrowing in Uganda',
                    links: [
                        { text: 'Get Emergency Loan', url: '/ug/borrower/apply' },
                        { text: 'Uganda Business Loan', url: '/ug/borrower/business-loan' },
                        { text: 'Personal Loans', url: '/ug/borrower/personal-loan' },
                        { text: 'How to Apply in Uganda', url: '/ug/how-to-apply' },
                        { text: 'Uganda Borrower Rates', url: '/ug/rates/borrower' }
                    ]
                },
                {
                    title: 'Lending in Uganda',
                    links: [
                        { text: 'Become a Lender', url: '/ug/lender/register' },
                        { text: 'Uganda Lending Rules', url: '/ug/lender/rules' },
                        { text: 'Lender Subscription', url: '/ug/subscription/lender' },
                        { text: 'Risk Management', url: '/ug/lender/risk' },
                        { text: 'Uganda Lender Rates', url: '/ug/rates/lender' }
                    ]
                },
                {
                    title: 'Uganda Regulations',
                    links: [
                        { text: 'Bank of Uganda Rules', url: '/ug/regulations/bou' },
                        { text: 'Consumer Protection', url: '/ug/regulations/consumer' },
                        { text: 'Tax Guidelines', url: '/ug/regulations/tax' },
                        { text: 'AML/CFT Compliance', url: '/ug/regulations/aml' },
                        { text: 'Data Protection', url: '/ug/regulations/data' }
                    ]
                },
                {
                    title: 'Uganda Support',
                    links: [
                        { text: 'Uganda Help Center', url: '/ug/support/help' },
                        { text: 'Contact Uganda Team', url: '/ug/support/contact' },
                        { text: 'Uganda FAQ', url: '/ug/support/faq' },
                        { text: 'Dispute Resolution', url: '/ug/support/disputes' },
                        { text: 'Report Fraud', url: '/ug/support/report-fraud' }
                    ]
                }
            ],

            // Uganda-specific social media links
            socialMedia: {
                facebook: 'https://facebook.com/mpesewauganda',
                twitter: 'https://twitter.com/mpesewa_ug',
                instagram: 'https://instagram.com/mpesewa_ug',
                linkedin: 'https://linkedin.com/company/mpesewa-uganda',
                whatsapp: 'https://wa.me/256392175546'
            },

            // Payment methods accepted in Uganda
            paymentMethods: [
                { name: 'MTN Mobile Money', code: 'MTN', supported: true },
                { name: 'Airtel Money', code: 'AIRTEL', supported: true },
                { name: 'Bank Transfer', code: 'BANK', supported: true },
                { name: 'Visa/Mastercard', code: 'CARD', supported: true },
                { name: 'Cash Deposit', code: 'CASH', supported: true }
            ],

            // Uganda-specific warnings and disclosures
            disclosures: [
                'M-Pesewa Uganda operates under Bank of Uganda regulations',
                'All lending activities are restricted within Uganda borders',
                'Cross-border lending is strictly prohibited',
                'Interest rates comply with Uganda Microfinance Deposit-taking Institutions Act',
                'Consumer protection under Uganda Consumer Protection Act 2019'
            ],

            // Copyright and legal text
            copyright: {
                text: `© 2016-2026 M-Pesewa Uganda Limited. All rights reserved.`,
                registration: `Registered in Uganda: Company No. 80020001234567`,
                vat: `VAT Registration No: UG-101-123456`
            }
        };
    }

    /**
     * Generate HTML footer for Uganda
     * Returns: HTML string
     */
    generateFooterHTML() {
        const config = this.getFooterStructure();
        
        return `
<!-- Uganda Country Footer - DO NOT MODIFY WITHOUT AUTHORIZATION -->
<div class="country-footer ug-footer" data-country="UG">
    
    <!-- Main Footer Content -->
    <div class="footer-main">
        <div class="footer-columns">
            ${config.columns.map(column => `
            <div class="footer-column">
                <h4 class="footer-column-title">${column.title}</h4>
                <ul class="footer-links">
                    ${column.links.map(link => `
                    <li><a href="${link.url}" class="footer-link">${link.text}</a></li>
                    `).join('')}
                </ul>
            </div>
            `).join('')}
        </div>
        
        <!-- Uganda Contact Information -->
        <div class="footer-contact-info">
            <div class="contact-section">
                <h5>Uganda Contacts</h5>
                <p><strong>Phone:</strong> ${config.contacts.primaryPhone}</p>
                <p><strong>Emergency:</strong> ${config.contacts.emergencyContact}</p>
                <p><strong>Email:</strong> ${config.contacts.email}</p>
                <p><strong>Address:</strong> ${config.contacts.address}</p>
                <p><strong>Hours:</strong> ${config.contacts.workingHours}</p>
            </div>
            
            <!-- Uganda Regulators -->
            <div class="regulator-section">
                <h5>Regulated By</h5>
                ${config.regulators.map(regulator => `
                <p><strong>${regulator.name}:</strong> ${regulator.license}</p>
                `).join('')}
            </div>
            
            <!-- Uganda Social Media -->
            <div class="social-section">
                <h5>Connect With Us</h5>
                <div class="social-icons">
                    ${Object.entries(config.socialMedia).map(([platform, url]) => `
                    <a href="${url}" class="social-icon" target="_blank" rel="noopener">
                        <span class="icon-${platform}">${platform.charAt(0).toUpperCase()}</span>
                    </a>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Uganda Payment Methods -->
        <div class="payment-methods">
            <h5>Accepted Payment Methods in Uganda</h5>
            <div class="payment-icons">
                ${config.paymentMethods.map(method => `
                <span class="payment-method ${method.code.toLowerCase()}" 
                      title="${method.name} ${method.supported ? '✓ Available' : '✗ Not Available'}">
                    ${method.code}
                </span>
                `).join('')}
            </div>
        </div>
    </div>
    
    <!-- Uganda Legal Disclosures -->
    <div class="footer-legal">
        <div class="legal-disclosures">
            ${config.disclosures.map(disclosure => `
            <p class="disclosure">⚠️ ${disclosure}</p>
            `).join('')}
        </div>
        
        <!-- Uganda Legal Links -->
        <div class="legal-links">
            ${Object.entries(config.legalLinks).map(([key, url]) => `
            <a href="${url}" class="legal-link">${this.formatLegalLinkText(key)}</a>
            `).join(' | ')}
        </div>
        
        <!-- Uganda Copyright -->
        <div class="footer-copyright">
            <p>${config.copyright.text}</p>
            <p>${config.copyright.registration}</p>
            <p>${config.copyright.vat}</p>
        </div>
        
        <!-- Uganda Country Badge -->
        <div class="country-badge">
            <span class="flag">🇺🇬</span>
            <span class="country-name">M-Pesewa Uganda</span>
            <span class="currency">(${this.currency})</span>
        </div>
    </div>
</div>`;
    }

    /**
     * Format legal link text
     */
    formatLegalLinkText(key) {
        const formatMap = {
            'terms': 'Terms & Conditions',
            'privacy': 'Privacy Policy',
            'lendingRules': 'Lending Rules',
            'borrowingRules': 'Borrowing Rules',
            'disputeResolution': 'Dispute Resolution',
            'consumerProtection': 'Consumer Protection'
        };
        return formatMap[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();
    }

    /**
     * Validate Uganda-specific footer rules
     */
    validateFooterRules() {
        const rules = {
            // Strict country isolation
            countryIsolation: {
                rule: 'No cross-country references in footer',
                validation: () => {
                    const config = this.getFooterStructure();
                    const text = JSON.stringify(config);
                    const otherCountries = ['KE', 'TZ', 'RW', 'BI', 'SS', 'SO', 'CD', 'NG', 'GH', 'ZA', 'ET'];
                    return !otherCountries.some(country => text.includes(country));
                }
            },
            
            // Required regulatory information
            regulatoryInfo: {
                rule: 'Must display Bank of Uganda license',
                validation: () => {
                    const config = this.getFooterStructure();
                    return config.regulators.some(r => r.name.includes('Bank of Uganda'));
                }
            },
            
            // Contact information requirements
            contactInfo: {
                rule: 'Must have Uganda phone number',
                validation: () => {
                    const config = this.getFooterStructure();
                    return config.contacts.primaryPhone.includes('+256');
                }
            },
            
            // Currency display
            currencyDisplay: {
                rule: 'Must display UGX currency',
                validation: () => this.currency === 'UGX'
            }
        };

        const violations = [];
        Object.entries(rules).forEach(([key, rule]) => {
            if (!rule.validation()) {
                violations.push(`Uganda Footer Rule Violation: ${rule.rule}`);
            }
        });

        return {
            isValid: violations.length === 0,
            violations,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get Uganda-specific footer styles
     */
    getFooterStyles() {
        return `
/* Uganda Footer Styles */
.ug-footer {
    border-top: 3px solid #FFD700; /* Uganda gold */
    background: linear-gradient(135deg, #000000 0%, #FFD700 100%);
    color: #FFFFFF;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.ug-footer .footer-column-title {
    color: #FFD700;
    border-bottom: 2px solid #FFD700;
    padding-bottom: 8px;
    margin-bottom: 15px;
}

.ug-footer .footer-link {
    color: #FFFFFF;
    transition: all 0.3s ease;
}

.ug-footer .footer-link:hover {
    color: #FFD700;
    transform: translateX(5px);
}

.ug-footer .country-badge {
    background: #000000;
    color: #FFD700;
    padding: 10px 20px;
    border-radius: 25px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 2px solid #FFD700;
    margin-top: 20px;
}

.ug-footer .payment-method {
    background: #FFFFFF;
    color: #000000;
    padding: 5px 10px;
    border-radius: 5px;
    margin: 0 5px;
    font-weight: bold;
    border: 1px solid #FFD700;
}

.ug-footer .payment-method.mtn {
    background: #FFCC00;
    color: #000000;
}

.ug-footer .payment-method.airtel {
    background: #FF0000;
    color: #FFFFFF;
}

.ug-footer .disclosure {
    background: rgba(255, 215, 0, 0.1);
    border-left: 3px solid #FFD700;
    padding: 10px 15px;
    margin: 5px 0;
    font-size: 0.9em;
}

.ug-footer .social-icon {
    background: #FFD700;
    color: #000000;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 5px;
    transition: all 0.3s ease;
}

.ug-footer .social-icon:hover {
    background: #000000;
    color: #FFD700;
    transform: translateY(-3px);
}

/* Uganda-specific responsive styles */
@media (max-width: 768px) {
    .ug-footer {
        text-align: center;
    }
    
    .ug-footer .footer-columns {
        grid-template-columns: 1fr;
    }
    
    .ug-footer .country-badge {
        flex-direction: column;
        gap: 5px;
    }
}`;
    }

    /**
     * Initialize Uganda footer
     */
    initialize() {
        return {
            country: this.countryName,
            code: this.countryCode,
            currency: this.currency,
            footerHTML: this.generateFooterHTML(),
            styles: this.getFooterStyles(),
            validation: this.validateFooterRules(),
            timestamp: new Date().toISOString(),
            hierarchy: this.getHierarchyEnforcement()
        };
    }

    /**
     * Get hierarchy enforcement rules for Uganda
     */
    getHierarchyEnforcement() {
        return {
            strictHierarchy: {
                level1: 'Global',
                level2: 'Country (Uganda)',
                level3: 'Groups (Uganda-based only)',
                level4: 'Lenders (within Uganda groups only)',
                level5: 'Borrowers (within Uganda groups only)',
                enforcement: [
                    'No cross-country lending/borrowing',
                    'Groups isolated to Uganda territory',
                    'Lenders restricted to Uganda groups',
                    'Borrowers limited to Uganda groups',
                    'Currency locked to UGX',
                    'Regulatory compliance: Bank of Uganda'
                ]
            },
            groupRules: {
                minMembers: 5,
                maxMembers: 1000,
                creation: 'Invitation-only within Uganda',
                types: [
                    'Family Groups',
                    'Professional Groups',
                    'Church Groups',
                    'Community Groups',
                    'Business Groups'
                ],
                isolation: 'No cross-group visibility outside Uganda'
            },
            lenderRules: {
                subscriptionRequired: true,
                subscriptionExpiry: '28th of each month',
                lendingLimit: 'Within subscribed Uganda groups only',
                ledgerCreation: 'Unlimited for Uganda borrowers',
                ratingSystem: '5-star for Uganda borrowers'
            },
            borrowerRules: {
                maxGroups: 4,
                ratingBased: true,
                blacklist: 'Uganda-wide visibility',
                defaultPeriod: '2 months for Uganda accounts',
                repayment: '7 days with 10% interest'
            }
        };
    }
}

// Export Uganda Footer Configuration
const ugandaFooter = new UgandaFooterConfig();
export default ugandaFooter;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ugandaFooter;
}