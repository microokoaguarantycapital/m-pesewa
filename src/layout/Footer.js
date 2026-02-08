// layout/Footer.js
// M-Pesewa Footer Component - Strict Brand Compliance & Hierarchy Enforcement

class MPFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentCountry = localStorage.getItem('mpesewa_country') || 'global';
        this.countries = [
            { code: 'KE', name: 'Kenya', flag: '🇰🇪', phone: '+254 709 219 000' },
            { code: 'UG', name: 'Uganda', flag: '🇺🇬', phone: '+256 392 175 546' },
            { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', phone: '+255 659 073 010' },
            { code: 'RW', name: 'Rwanda', flag: '🇷🇼', phone: '+250 791 590 801' },
            { code: 'BI', name: 'Burundi', flag: '🇧🇮', phone: '+257 79 000 000' },
            { code: 'CD', name: 'DRC', flag: '🇨🇩', phone: '+243 81 000 0000' },
            { code: 'NG', name: 'Nigeria', flag: '🇳🇬', phone: '+234 800 000 0000' },
            { code: 'GH', name: 'Ghana', flag: '🇬🇭', phone: '+233 24 000 0000' },
            { code: 'SS', name: 'South Sudan', flag: '🇸🇸', phone: '+211 955 000 000' },
            { code: 'SO', name: 'Somalia', flag: '🇸🇴', phone: '+252 63 0000000' },
            { code: 'ZA', name: 'South Africa', flag: '🇿🇦', phone: '+27 11 000 0000' },
            { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', phone: '+251 11 000 0000' }
        ];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.startCountryTicker();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* FOOTER STYLES - STRICT BRAND COMPLIANCE */
                :host {
                    display: block;
                    width: 100%;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                
                .mp-footer {
                    background: #1f2a37; /* Neutral Dark Slate - DIFFERENT from header */
                    color: #ffffff;
                    position: relative;
                    z-index: 100;
                }
                
                .footer-top {
                    padding: 60px 40px 40px;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 32px;
                }
                
                @media (max-width: 1024px) {
                    .footer-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                
                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 480px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .footer-col {
                    display: flex;
                    flex-direction: column;
                }
                
                .footer-col-title {
                    color: #ffffff;
                    font-size: 15px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .footer-link {
                    color: #d1d5db;
                    text-decoration: none;
                    font-size: 14px;
                    line-height: 1.6;
                    margin-bottom: 10px;
                    transition: color 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                }
                
                .footer-link:hover {
                    color: #0099ff; /* Secondary Brand Blue */
                }
                
                .footer-link::before {
                    content: "›";
                    margin-right: 8px;
                    opacity: 0.7;
                }
                
                .social-links {
                    display: flex;
                    gap: 12px;
                    margin-top: 15px;
                }
                
                .social-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 16px;
                    transition: all 0.2s ease;
                }
                
                .social-link:hover {
                    background: #0099ff;
                    transform: translateY(-2px);
                }
                
                /* COUNTRIES TICKER */
                .country-ticker {
                    overflow: hidden;
                    background: #111827;
                    padding: 12px 0;
                    margin-top: 40px;
                    position: relative;
                }
                
                .ticker-track {
                    white-space: nowrap;
                    display: inline-block;
                    color: #ffffff;
                    animation: scroll-left 25s linear infinite;
                    font-size: 13px;
                    font-weight: 500;
                    padding: 5px 0;
                }
                
                @keyframes scroll-left {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                
                .country-ticker:hover .ticker-track {
                    animation-play-state: paused;
                }
                
                /* FOOTER BOTTOM */
                .footer-bottom {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 25px 40px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .footer-bottom-content {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .copyright {
                    color: #9ca3af;
                    font-size: 12px;
                    margin-bottom: 12px;
                }
                
                .country-contacts {
                    color: #d1d5db;
                    font-size: 11px;
                    line-height: 1.5;
                    margin-bottom: 12px;
                    display: none; /* Hidden on mobile, shown on desktop via JS */
                }
                
                .footer-legal {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    color: #9ca3af;
                    font-size: 12px;
                }
                
                .footer-legal a {
                    color: #9ca3af;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                
                .footer-legal a:hover {
                    color: #0099ff;
                }
                
                /* HIERARCHY BADGE */
                .hierarchy-badge {
                    background: #003366;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    margin-top: 20px;
                    border-left: 4px solid #0099ff;
                }
                
                .hierarchy-badge::before {
                    content: "⚡";
                    margin-right: 8px;
                }
                
                /* RESPONSIVE */
                @media (min-width: 769px) {
                    .country-contacts {
                        display: block;
                    }
                }
                
                @media (max-width: 768px) {
                    .footer-top {
                        padding: 40px 20px 30px;
                    }
                    
                    .footer-bottom {
                        padding: 20px;
                    }
                    
                    .footer-legal {
                        justify-content: center;
                        text-align: center;
                    }
                }
                
                /* DARK MODE SUPPORT */
                @media (prefers-color-scheme: dark) {
                    .mp-footer {
                        background: #111827;
                    }
                    
                    .country-ticker {
                        background: #000000;
                    }
                }
                
                /* PRINT STYLES */
                @media print {
                    .country-ticker,
                    .social-links {
                        display: none !important;
                    }
                    
                    .mp-footer {
                        background: #ffffff !important;
                        color: #000000 !important;
                        border-top: 2px solid #000000;
                    }
                    
                    .footer-link {
                        color: #000000 !important;
                    }
                }
                
                /* ACCESSIBILITY */
                .footer-link:focus-visible {
                    outline: 2px solid #0099ff;
                    outline-offset: 2px;
                    border-radius: 4px;
                }
                
                .social-link:focus-visible {
                    outline: 2px solid #0099ff;
                    outline-offset: 2px;
                }
            </style>
            
            <footer class="mp-footer" role="contentinfo" aria-label="Site Footer">
                <div class="footer-top">
                    <div class="container">
                        <div class="footer-grid">
                            <!-- Column 1: Borrowing -->
                            <div class="footer-col" role="list" aria-label="Borrowing Services">
                                <h4 class="footer-col-title">Borrowing</h4>
                                <a href="borrower/apply.html" class="footer-link" aria-label="Get Emergency Loan">Get Emergency Loan</a>
                                <a href="borrower/apply.html?type=personal" class="footer-link" aria-label="Online Personal Loan">Online Personal Loan</a>
                                <a href="borrower/apply.html?type=business" class="footer-link" aria-label="Business Loan">Business Loan</a>
                                <a href="how-it-works.html#borrowing" class="footer-link" aria-label="How to Apply for Loans">How to Apply</a>
                                <a href="community/borrowers.html" class="footer-link" aria-label="View Active Borrowers">Active Borrowers</a>
                            </div>
                            
                            <!-- Column 2: Lending -->
                            <div class="footer-col" role="list" aria-label="Lending Services">
                                <h4 class="footer-col-title">Lending</h4>
                                <a href="lender/rules.html" class="footer-link" aria-label="Smart Lending Guide">Smart Lending</a>
                                <a href="lender/why-lend.html" class="footer-link" aria-label="Why Lend at M-Pesewa">Why Lend at M-Pesewa?</a>
                                <a href="lender/how-to-lend.html" class="footer-link" aria-label="How to Lend Guide">How to Lend</a>
                                <a href="community/lenders.html" class="footer-link" aria-label="View Active Lenders">Active Lenders</a>
                                <a href="lender/subscription.html" class="footer-link" aria-label="Lender Subscription Plans">Subscription Plans</a>
                            </div>
                            
                            <!-- Column 3: Platform -->
                            <div class="footer-col" role="list" aria-label="Platform Information">
                                <h4 class="footer-col-title">How It Works</h4>
                                <a href="how-it-works.html" class="footer-link" aria-label="P2P Lending Explanation">P2P Lending Works</a>
                                <a href="about.html#our-role" class="footer-link" aria-label="Our Platform Role">Our Role</a>
                                <a href="subscription/plans.html" class="footer-link" aria-label="Subscription Plans">Subscriptions</a>
                                <a href="blacklist/public.html" class="footer-link" aria-label="Blacklist Information">Blacklist</a>
                                <a href="collectors.html" class="footer-link" aria-label="Debt Collectors Directory">Debt Collectors</a>
                            </div>
                            
                            <!-- Column 4: Company -->
                            <div class="footer-col" role="list" aria-label="Company Information">
                                <h4 class="footer-col-title">About Us</h4>
                                <a href="about.html" class="footer-link" aria-label="About M-Pesewa">About M-Pesewa</a>
                                <a href="about.html#team" class="footer-link" aria-label="Team & Advisory Board">Team & Advisory Board</a>
                                <a href="news.html" class="footer-link" aria-label="News & Careers">News & Careers</a>
                                <a href="faq.html" class="footer-link" aria-label="Blog & FAQs">Blog / FAQs</a>
                                <a href="contact.html" class="footer-link" aria-label="Contact Us">Contact Us</a>
                            </div>
                            
                            <!-- Column 5: Legal & Compliance -->
                            <div class="footer-col" role="list" aria-label="Legal Information">
                                <h4 class="footer-col-title">Legal & Compliance</h4>
                                <a href="terms.html" class="footer-link" aria-label="Terms & Conditions">Terms & Conditions</a>
                                <a href="privacy.html" class="footer-link" aria-label="Privacy Policy">Privacy Policy</a>
                                <a href="grievance.html" class="footer-link" aria-label="Grievance Redressal">Grievance Redressal</a>
                                <a href="fair-practices.html" class="footer-link" aria-label="Fair Practices Code">Fair Practices Code</a>
                                <a href="security.html" class="footer-link" aria-label="Security Information">Security</a>
                            </div>
                            
                            <!-- Column 6: Partnerships -->
                            <div class="footer-col" role="list" aria-label="Partnerships">
                                <h4 class="footer-col-title">Partnerships</h4>
                                <a href="partners.html" class="footer-link" aria-label="Become a Partner">Be a Partner</a>
                                <a href="affiliate.html" class="footer-link" aria-label="Affiliate Program">Affiliate Program</a>
                                <a href="api.html" class="footer-link" aria-label="API Access">API Access</a>
                                
                                <div class="social-links" aria-label="Social Media Links">
                                    <a href="https://facebook.com/mpesewa" class="social-link" target="_blank" rel="noopener" aria-label="Facebook">📘</a>
                                    <a href="https://twitter.com/mpesewa" class="social-link" target="_blank" rel="noopener" aria-label="Twitter">🐦</a>
                                    <a href="https://youtube.com/mpesewa" class="social-link" target="_blank" rel="noopener" aria-label="YouTube">📺</a>
                                    <a href="https://instagram.com/mpesewa" class="social-link" target="_blank" rel="noopener" aria-label="Instagram">📸</a>
                                    <a href="https://linkedin.com/company/mpesewa" class="social-link" target="_blank" rel="noopener" aria-label="LinkedIn">💼</a>
                                </div>
                                
                                <!-- Hierarchy Badge -->
                                <div class="hierarchy-badge" role="status" aria-label="Platform Hierarchy">
                                    Global → Country → Groups → Lenders → Borrowers
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Countries Ticker -->
                <div class="country-ticker" aria-label="Supported Countries">
                    <div class="ticker-track" id="tickerTrack"></div>
                </div>
                
                <!-- Footer Bottom -->
                <div class="footer-bottom">
                    <div class="footer-bottom-content">
                        <div class="copyright">
                            © 2016–2026, M-Pesewa.com (Technology Pvt. Ltd.) — All Rights Reserved
                        </div>
                        <div class="country-contacts" id="countryContacts"></div>
                        <div class="footer-legal">
                            <a href="sitemap.html">Sitemap</a>
                            <a href="accessibility.html">Accessibility</a>
                            <a href="security.html">Security</a>
                            <a href="report.html">Report Issue</a>
                            <a href="cookies.html">Cookies</a>
                            <a href="disclaimer.html">Disclaimer</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
        
        this.updateCountryTicker();
        this.updateCountryContacts();
    }
    
    setupEventListeners() {
        // Handle country selection in footer
        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.closest('.footer-link[href*="countries"]')) {
                e.preventDefault();
                const countryCode = e.target.getAttribute('href').split('/').pop().replace('.html', '');
                this.handleCountryChange(countryCode);
            }
        });
        
        // Update hierarchy display based on user role
        this.updateHierarchyDisplay();
    }
    
    updateCountryTicker() {
        const tickerTrack = this.shadowRoot.getElementById('tickerTrack');
        if (tickerTrack) {
            // Create scrolling text with all 12 countries
            let tickerText = '';
            const countries = [
                '🇰🇪 Kenya', '🇺🇬 Uganda', '🇹🇿 Tanzania', '🇷🇼 Rwanda', 
                '🇧🇮 Burundi', '🇨🇩 DRC', '🇳🇬 Nigeria', '🇬🇭 Ghana',
                '🇸🇸 South Sudan', '🇸🇴 Somalia', '🇿🇦 South Africa', '🇪🇹 Ethiopia'
            ];
            
            // Repeat for smooth scrolling
            tickerText = countries.join(' • ') + ' • ' + countries.join(' • ');
            tickerTrack.textContent = tickerText;
        }
    }
    
    updateCountryContacts() {
        const contactsDiv = this.shadowRoot.getElementById('countryContacts');
        if (contactsDiv) {
            let contactsText = '<strong>Contact by Country:</strong> ';
            this.countries.forEach((country, index) => {
                contactsText += `${country.name}: ${country.phone}`;
                if (index < this.countries.length - 1) contactsText += ' | ';
            });
            contactsDiv.innerHTML = contactsText;
        }
    }
    
    handleCountryChange(countryCode) {
        // Validate country code
        const validCountries = this.countries.map(c => c.code.toLowerCase());
        if (!validCountries.includes(countryCode.toLowerCase())) {
            console.warn('Invalid country code:', countryCode);
            return;
        }
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('mpesewa_auth_token');
        
        if (isLoggedIn) {
            // Show warning - country change requires logout
            this.showCountryChangeWarning(countryCode);
        } else {
            // Set country preference
            localStorage.setItem('mpesewa_country', countryCode.toUpperCase());
            this.currentCountry = countryCode.toUpperCase();
            
            // Navigate to country page
            window.location.href = `countries/${countryCode}.html`;
        }
    }
    
    showCountryChangeWarning(countryCode) {
        const warning = document.createElement('div');
        warning.innerHTML = `
            <style>
                .country-change-warning {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #f37021;
                    color: white;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9999;
                    max-width: 400px;
                    animation: slideIn 0.3s ease;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .warning-content {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .warning-title {
                    font-weight: bold;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .warning-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                
                .warning-btn {
                    padding: 6px 12px;
                    border-radius: 4px;
                    border: none;
                    font-size: 12px;
                    cursor: pointer;
                    font-weight: 500;
                }
                
                .warning-btn.primary {
                    background: #003366;
                    color: white;
                }
                
                .warning-btn.secondary {
                    background: transparent;
                    color: white;
                    border: 1px solid white;
                }
            </style>
            <div class="country-change-warning" role="alert" aria-label="Country Change Warning">
                <div class="warning-content">
                    <div class="warning-title">⚠️ Country Change Warning</div>
                    <p>You must logout to change countries. Country selection is locked after registration to maintain compliance.</p>
                    <div class="warning-actions">
                        <button class="warning-btn primary" onclick="window.location.href='auth/logout.html?redirect=countries/${countryCode}.html'">
                            Logout & Change Country
                        </button>
                        <button class="warning-btn secondary" onclick="this.closest('.country-change-warning').remove()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (warning.parentNode) {
                warning.remove();
            }
        }, 10000);
    }
    
    updateHierarchyDisplay() {
        // Get user role from localStorage or default
        const userRole = localStorage.getItem('mpesewa_user_role') || 'guest';
        const country = localStorage.getItem('mpesewa_country') || 'global';
        
        let hierarchyText = '';
        
        switch (userRole) {
            case 'lender':
                hierarchyText = `Global → ${country} → Your Groups → Lenders → Your Ledgers`;
                break;
            case 'borrower':
                hierarchyText = `Global → ${country} → Your Groups → Lenders → You (Borrower)`;
                break;
            case 'group_admin':
                hierarchyText = `Global → ${country} → Your Group (Admin) → Lenders & Borrowers`;
                break;
            default:
                hierarchyText = 'Global → Country → Groups → Lenders → Borrowers';
        }
        
        const badge = this.shadowRoot.querySelector('.hierarchy-badge');
        if (badge) {
            badge.textContent = hierarchyText;
        }
    }
    
    startCountryTicker() {
        // Ensure ticker animation runs smoothly
        requestAnimationFrame(() => {
            const ticker = this.shadowRoot.querySelector('.ticker-track');
            if (ticker) {
                // Reset animation to prevent glitches
                ticker.style.animation = 'none';
                setTimeout(() => {
                    ticker.style.animation = 'scroll-left 25s linear infinite';
                }, 10);
            }
        });
    }
    
    // Method to update footer based on user authentication
    updateForAuthStatus(isAuthenticated) {
        if (isAuthenticated) {
            // Update links for authenticated users
            const borrowerLinks = this.shadowRoot.querySelectorAll('.footer-col:nth-child(1) .footer-link');
            if (borrowerLinks.length > 0) {
                borrowerLinks[0].href = 'borrower/dashboard.html';
                borrowerLinks[0].textContent = 'My Loan Dashboard';
            }
            
            const lenderLinks = this.shadowRoot.querySelectorAll('.footer-col:nth-child(2) .footer-link');
            if (lenderLinks.length > 0) {
                lenderLinks[0].href = 'lender/dashboard.html';
                lenderLinks[0].textContent = 'My Lending Dashboard';
            }
        }
        
        this.updateHierarchyDisplay();
    }
    
    // Method to highlight current country in ticker
    highlightCurrentCountry() {
        const currentCountry = localStorage.getItem('mpesewa_country');
        if (!currentCountry) return;
        
        const tickerTrack = this.shadowRoot.getElementById('tickerTrack');
        if (tickerTrack) {
            const text = tickerTrack.textContent;
            const countryRegex = new RegExp(`(${currentCountry}:[^•]*)`, 'gi');
            tickerTrack.innerHTML = text.replace(countryRegex, '<strong style="color: #0099ff;">$1</strong>');
        }
    }
}

// Register custom element
customElements.define('mp-footer', MPFooter);

// Export for module usage
export default MPFooter;