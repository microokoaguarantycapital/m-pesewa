/**
 * M-PESEWA RWANDA FOOTER CONFIGURATION
 * Country-specific footer with localized content and compliance
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const RwandaFooter = {
    // ============================================
    // 1️⃣ FOOTER STRUCTURE & LAYOUT
    // ============================================
    structure: {
        containerClass: "mp-footer-rw",
        backgroundColor: "#1f2a37",
        textColor: "#ffffff",
        linkColor: "#d1d5db",
        accentColor: "#0099ff",
        
        columns: 6,
        responsiveBreakpoints: {
            mobile: 1,
            tablet: 3,
            desktop: 6
        }
    },

    // ============================================
    // 2️⃣ COLUMN 1: BORROWING (Kusaba)
    // ============================================
    columnBorrowing: {
        title: "Kusaba amafaranga",
        title_en: "Borrowing",
        links: [
            {
                text: "Saba amafaranga yo gufashanya",
                text_en: "Get Emergency Loan",
                url: "/rw/borrower/apply",
                icon: "🚨"
            },
            {
                text: "Amafaranga y'umuntu ku giti cye",
                text_en: "Online Personal Loan",
                url: "/rw/borrower/apply?type=personal",
                icon: "💼"
            },
            {
                text: "Amafaranga y'ubucuruzi",
                text_en: "Business Loan",
                url: "/rw/borrower/apply?type=business",
                icon: "🏪"
            },
            {
                text: "Uburyo bwo gusaba",
                text_en: "How to Apply",
                url: "/rw/how-it-works#apply",
                icon: "📝"
            },
            {
                text: "Abasaba b'akazi",
                text_en: "Active Borrowers",
                url: "/rw/community/borrowers",
                icon: "👥"
            }
        ]
    },

    // ============================================
    // 3️⃣ COLUMN 2: LENDING (Kuguriza)
    // ============================================
    columnLending: {
        title: "Kuguriza",
        title_en: "Lending",
        links: [
            {
                text: "Kuguriza mu buryo bw'umwimerere",
                text_en: "Smart Lending",
                url: "/rw/lender/rules",
                icon: "🧠"
            },
            {
                text: "Kuki kuguriza kuri M-Pesewa?",
                text_en: "Why Lend at M-Pesewa?",
                url: "/rw/lender/why-lend",
                icon: "❓"
            },
            {
                text: "Uburyo bwo kuguriza",
                text_en: "How to Lend",
                url: "/rw/lender/how-to-lend",
                icon: "📚"
            },
            {
                text: "Abagurizi b'akazi",
                text_en: "Active Lenders",
                url: "/rw/community/lenders",
                icon: "💰"
            }
        ]
    },

    // ============================================
    // 4️⃣ COLUMN 3: PLATFORM (Uruwego)
    // ============================================
    columnPlatform: {
        title: "Uburyo bwo gukorera",
        title_en: "How It Works",
        links: [
            {
                text: "Uburyo Person-to-Person",
                text_en: "P2P Lending Works",
                url: "/rw/how-it-works",
                icon: "🔄"
            },
            {
                text: "Uruhare rwacu",
                text_en: "Our Role",
                url: "/rw/about#our-role",
                icon: "🎯"
            },
            {
                text: "Amabwiriza",
                text_en: "Subscriptions",
                url: "/rw/subscription/plans",
                icon: "📋"
            },
            {
                text: "Urutonde rw'abahanzwe",
                text_en: "Blacklist",
                url: "/rw/blacklist/public",
                icon: "🚫"
            },
            {
                text: "Abashoramari",
                text_en: "Debt Collectors",
                url: "/rw/collectors",
                icon: "👮"
            }
        ]
    },

    // ============================================
    // 5️⃣ COLUMN 4: COMPANY (Isosiyete)
    // ============================================
    columnCompany: {
        title: "Ibyerekeye twe",
        title_en: "About Us",
        links: [
            {
                text: "Ibyerekeye M-Pesewa",
                text_en: "About M-Pesewa",
                url: "/rw/about",
                icon: "🏢"
            },
            {
                text: "Itsinda & Inama",
                text_en: "Team & Advisory Board",
                url: "/rw/about#team",
                icon: "👥"
            },
            {
                text: "Amakuru & Akazi",
                text_en: "News & Careers",
                url: "/rw/news",
                icon: "📰"
            },
            {
                text: "Blog / Ibibazo",
                text_en: "Blog / FAQs",
                url: "/rw/faq",
                icon: "📝"
            },
            {
                text: "Twandikire",
                text_en: "Contact Us",
                url: "/rw/contact",
                icon: "📞"
            }
        ]
    },

    // ============================================
    // 6️⃣ COLUMN 5: LEGAL & COMPLIANCE
    // ============================================
    columnLegal: {
        title: "Amategeko & Kugena",
        title_en: "Legal & Compliance",
        links: [
            {
                text: "Amategeko n'Amabwiriza",
                text_en: "Terms & Conditions",
                url: "/rw/terms",
                icon: "📜"
            },
            {
                text: "Politiki y'Ibanga",
                text_en: "Privacy Policy",
                url: "/rw/privacy",
                icon: "🔒"
            },
            {
                text: "Gukanira ibibazo",
                text_en: "Grievance Redressal",
                url: "/rw/grievance",
                icon: "⚖️"
            },
            {
                text: "Kode y'Uburyo Bwiza",
                text_en: "Fair Practices Code",
                url: "/rw/fair-practices",
                icon: "✅"
            },
            {
                text: "Raporo y'Ubwisanzure",
                text_en: "Transparency Report",
                url: "/rw/transparency",
                icon: "📊"
            }
        ],

        regulatoryBadges: [
            {
                name: "BNR Licensed",
                image: "assets/images/rwanda/bnr-logo.png",
                alt: "Licensed by National Bank of Rwanda",
                url: "https://www.bnr.rw"
            },
            {
                name: "NCSA Certified",
                image: "assets/images/rwanda/ncsa-logo.png",
                alt: "Certified by National Cyber Security Authority",
                url: "https://www.ncsa.gov.rw"
            },
            {
                name: "Data Protected",
                image: "assets/images/rwanda/data-protection.png",
                alt: "Data Protection Compliant",
                url: "/rw/privacy"
            }
        ]
    },

    // ============================================
    // 7️⃣ COLUMN 6: PARTNERSHIPS & SOCIAL
    // ============================================
    columnPartnerships: {
        title: "Ubufatanye",
        title_en: "Partnerships",
        links: [
            {
                text: "Uburyo bwo kuba Umufatanyabikorwa",
                text_en: "Be a Partner",
                url: "/rw/partners",
                icon: "🤝"
            },
            {
                text: "Abafatanyabikorwa",
                text_en: "Our Partners",
                url: "/rw/partners#list",
                icon: "🏢"
            },
            {
                text: "Ubufasha bw'Inzego",
                text_en: "Institutional Support",
                url: "/rw/partners#institutions",
                icon: "🏛️"
            }
        ],

        socialMedia: {
            title: "Dukurikire",
            title_en: "Follow Us",
            platforms: [
                {
                    name: "Facebook",
                    icon: "📘",
                    url: "https://facebook.com/mpesewa.rwanda",
                    handle: "@mpesewa.rwanda"
                },
                {
                    name: "Twitter",
                    icon: "🐦",
                    url: "https://twitter.com/mpesewa_rw",
                    handle: "@mpesewa_rw"
                },
                {
                    name: "Instagram",
                    icon: "📸",
                    url: "https://instagram.com/mpesewa.rwanda",
                    handle: "@mpesewa.rwanda"
                },
                {
                    name: "LinkedIn",
                    icon: "💼",
                    url: "https://linkedin.com/company/mpesewa-rwanda",
                    handle: "M-Pesewa Rwanda"
                },
                {
                    name: "YouTube",
                    icon: "📺",
                    url: "https://youtube.com/@mpesewarwanda",
                    handle: "@mpesewarwanda"
                }
            ],

            newsletter: {
                enabled: true,
                placeholder: "Shyiramo imeyili yawe",
                placeholder_en: "Enter your email",
                buttonText: "Andika",
                buttonText_en: "Subscribe",
                consentText: "Nemera politiki y'ibanga",
                consentText_en: "I agree to privacy policy"
            }
        }
    },

    // ============================================
    // 8️⃣ COUNTRY-SPECIFIC CONTENT
    // ============================================
    countrySpecific: {
        // Contact information specific to Rwanda
        contactInfo: {
            phone: "+250 791 590 801",
            whatsapp: "+250 791 590 801",
            email: "info.rw@mpesewa.com",
            address: {
                line1: "Kigali Heights, KG 7 Ave",
                line2: "Kigali, Rwanda",
                mapUrl: "https://maps.google.com/?q=Kigali+Heights,Rwanda"
            },
            workingHours: {
                weekdays: "8:00 - 18:00",
                saturday: "9:00 - 13:00",
                sunday: "Gufungwa"
            }
        },

        // Local languages support
        languages: [
            {
                code: "en",
                name: "English",
                nativeName: "English"
            },
            {
                code: "rw",
                name: "Kinyarwanda",
                nativeName: "Ikinyarwanda"
            },
            {
                code: "fr",
                name: "French",
                nativeName: "Français"
            }
        ],

        // Local holidays that affect operations
        holidays: [
            { date: "2024-01-01", name: "Umwaka mushya", name_en: "New Year's Day" },
            { date: "2024-02-01", name: "Umuganura", name_en: "Heroes Day" },
            { date: "2024-04-07", name: "Icyunamo", name_en: "Genocide Memorial" },
            { date: "2024-07-01", name: "Independance", name_en: "Independence Day" },
            { date: "2024-07-04", name: "Isabukuru", name_en: "Liberation Day" },
            { date: "2024-12-25", name: "Noheli", name_en: "Christmas Day" }
        ]
    },

    // ============================================
    // 9️⃣ BOTTOM BAR CONTENT
    // ============================================
    bottomBar: {
        // Copyright information
        copyright: {
            text: "© 2016–2026, M-Pesewa Rwanda Ltd. – Amahoro yose Yashingiwe",
            text_en: "© 2016–2026, M-Pesewa Rwanda Ltd. – All Rights Reserved"
        },

        // Legal disclaimers
        disclaimers: [
            {
                text: "M-Pesewa Rwanda Ltd. ni isosiyete yemewe na Banki Nkuru y'u Rwanda (BNR) mu gukora serivisi za FinTech.",
                text_en: "M-Pesewa Rwanda Ltd. is licensed by the National Bank of Rwanda (BNR) to operate FinTech services."
            },
            {
                text: "Twebwe nta mafaranga dufata. Amafaranga yose agurizanya hagati y'abakoresha.",
                text_en: "We do not hold funds. All lending happens directly between users."
            },
            {
                text: "Amafaranga yo gusaba n'ayo gurizanya bitewe n'imyitwarire. Reba amategeko wumva neza mbere.",
                text_en: "Borrowing and lending involve risks. Please read terms carefully before proceeding."
            }
        ],

        // Quick links at the very bottom
        quickLinks: [
            { text: "Sitemap", url: "/rw/sitemap" },
            { text: "Ubwisanzure", url: "/rw/accessibility", text_en: "Accessibility" },
            { text: "Umutekano", url: "/rw/security", text_en: "Security" },
            { text: "Tangaza ikibazo", url: "/rw/report", text_en: "Report Issue" },
            { text: "Guhindura ururimi", url: "#", text_en: "Change Language" }
        ],

        // Trust badges and certifications
        trustBadges: [
            {
                type: "ssl",
                text: "SSL Encodeye",
                text_en: "SSL Encrypted",
                icon: "🔐"
            },
            {
                type: "secure",
                text: "Byarakatswe",
                text_en: "Secured",
                icon: "🛡️"
            },
            {
                type: "gdpr",
                text: "Kugena GDPR",
                text_en: "GDPR Compliant",
                icon: "📜"
            }
        ]
    },

    // ============================================
    // 🔟 FOOTER GENERATION METHODS
    // ============================================
    generate: {
        // Generate full footer HTML
        getHTML: function(language = 'en') {
            const isKinyarwanda = language === 'rw';
            
            return `
            <footer class="${this.structure.containerClass}" style="background-color: ${this.structure.backgroundColor}; color: ${this.structure.textColor};">
                <div class="footer-top">
                    <div class="container">
                        <div class="footer-grid">
                            <!-- Column 1: Borrowing -->
                            <div class="footer-column">
                                <h4 class="footer-column-title">${isKinyarwanda ? this.columnBorrowing.title : this.columnBorrowing.title_en}</h4>
                                ${this.columnBorrowing.links.map(link => `
                                    <a href="${link.url}" class="footer-link" style="color: ${this.structure.linkColor};">
                                        ${link.icon} ${isKinyarwanda ? link.text : link.text_en}
                                    </a>
                                `).join('')}
                            </div>

                            <!-- Column 2: Lending -->
                            <div class="footer-column">
                                <h4 class="footer-column-title">${isKinyarwanda ? this.columnLending.title : this.columnLending.title_en}</h4>
                                ${this.columnLending.links.map(link => `
                                    <a href="${link.url}" class="footer-link" style="color: ${this.structure.linkColor};">
                                        ${link.icon} ${isKinyarwanda ? link.text : link.text_en}
                                    </a>
                                `).join('')}
                            </div>

                            <!-- Column 3: Platform -->
                            <div class="footer-column">
                                <h4 class="footer-column-title">${isKinyarwanda ? this.columnPlatform.title : this.columnPlatform.title_en}</h4>
                                ${this.columnPlatform.links.map(link => `
                                    <a href="${link.url}" class="footer-link" style="color: ${this.structure.linkColor};">
                                        ${link.icon} ${isKinyarwanda ? link.text : link.text_en}
                                    </a>
                                `).join('')}
                            </div>

                            <!-- Column 4: Company -->
                            <div class="footer-column">
                                <h4 class="footer-column-title">${isKinyarwanda ? this.columnCompany.title : this.columnCompany.title_en}</h4>
                                ${this.columnCompany.links.map(link => `
                                    <a href="${link.url}" class="footer-link" style="color: ${this.structure.linkColor};">
                                        ${link.icon} ${isKinyarwanda ? link.text : link.text_en}
                                    </a>
                                `).join('')}
                            </div>

                            <!-- Column 5: Legal -->
                            <div class="footer-column">
                                <h4 class="footer-column-title">${isKinyarwanda ? this.columnLegal.title : this.columnLegal.title_en}</h4>
                                ${this.columnLegal.links.map(link => `
                                    <a href="${link.url}" class="footer-link" style="color: ${this.structure.linkColor};">
                                        ${link.icon} ${isKinyarwanda ? link.text : link.text_en}
                                    </a>
                                `).join('')}
                            </div>

                            <!-- Column 6: Partnerships -->
                            <div class="footer-column">
                                <h4 class="footer-column-title">${isKinyarwanda ? this.columnPartnerships.title : this.columnPartnerships.title_en}</h4>
                                ${this.columnPartnerships.links.map(link => `
                                    <a href="${link.url}" class="footer-link" style="color: ${this.structure.linkColor};">
                                        ${link.icon} ${isKinyarwanda ? link.text : link.text_en}
                                    </a>
                                `).join('')}
                                
                                <!-- Social Media -->
                                <div class="social-section">
                                    <h5>${isKinyarwanda ? this.columnPartnerships.socialMedia.title : this.columnPartnerships.socialMedia.title_en}</h5>
                                    <div class="social-icons">
                                        ${this.columnPartnerships.socialMedia.platforms.map(platform => `
                                            <a href="${platform.url}" class="social-icon" aria-label="${platform.name}">
                                                ${platform.icon}
                                            </a>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Country Contact Bar -->
                <div class="country-contact-bar">
                    <div class="container">
                        <div class="contact-info">
                            <strong>${isKinyarwanda ? 'Twandikire:' : 'Contact in Rwanda:'}</strong>
                            <span>📞 ${this.countrySpecific.contactInfo.phone}</span>
                            <span>📱 ${this.countrySpecific.contactInfo.whatsapp} (WhatsApp)</span>
                            <span>📧 ${this.countrySpecific.contactInfo.email}</span>
                            <span>📍 ${this.countrySpecific.contactInfo.address.line1}, ${this.countrySpecific.contactInfo.address.line2}</span>
                        </div>
                    </div>
                </div>

                <!-- Regulatory Badges -->
                <div class="regulatory-badges">
                    <div class="container">
                        ${this.columnLegal.regulatoryBadges.map(badge => `
                            <a href="${badge.url}" class="regulatory-badge" title="${badge.alt}">
                                <img src="${badge.image}" alt="${badge.alt}" width="80">
                                <span>${badge.name}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>

                <!-- Bottom Bar -->
                <div class="footer-bottom">
                    <div class="container">
                        <!-- Copyright -->
                        <div class="copyright">
                            ${isKinyarwanda ? this.bottomBar.copyright.text : this.bottomBar.copyright.text_en}
                        </div>

                        <!-- Disclaimers -->
                        <div class="disclaimers">
                            ${this.bottomBar.disclaimers.map(disclaimer => `
                                <p class="disclaimer">${isKinyarwanda ? disclaimer.text : disclaimer.text_en}</p>
                            `).join('')}
                        </div>

                        <!-- Quick Links -->
                        <div class="quick-links">
                            ${this.bottomBar.quickLinks.map(link => `
                                <a href="${link.url}" class="quick-link">${isKinyarwanda ? link.text : link.text_en}</a>
                                ${link !== this.bottomBar.quickLinks[this.bottomBar.quickLinks.length - 1] ? '•' : ''}
                            `).join('')}
                        </div>

                        <!-- Trust Badges -->
                        <div class="trust-badges">
                            ${this.bottomBar.trustBadges.map(badge => `
                                <span class="trust-badge">
                                    ${badge.icon} ${isKinyarwanda ? badge.text : badge.text_en}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </footer>
            `;
        },

        // Generate CSS for footer
        getCSS: function() {
            return `
            .${this.structure.containerClass} {
                font-family: 'Inter', 'Segoe UI', sans-serif;
                font-size: 14px;
                line-height: 1.6;
            }
            
            .${this.structure.containerClass} .footer-top {
                padding: 60px 0 40px;
            }
            
            .${this.structure.containerClass} .footer-grid {
                display: grid;
                grid-template-columns: repeat(${this.structure.columns}, 1fr);
                gap: 40px;
            }
            
            .${this.structure.containerClass} .footer-column {
                display: flex;
                flex-direction: column;
            }
            
            .${this.structure.containerClass} .footer-column-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 20px;
                color: ${this.structure.textColor};
            }
            
            .${this.structure.containerClass} .footer-link {
                margin-bottom: 12px;
                transition: color 0.2s;
                text-decoration: none;
            }
            
            .${this.structure.containerClass} .footer-link:hover {
                color: ${this.structure.accentColor} !important;
            }
            
            .${this.structure.containerClass} .country-contact-bar {
                background: rgba(0, 0, 0, 0.2);
                padding: 20px 0;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .${this.structure.containerClass} .contact-info {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                align-items: center;
                justify-content: center;
            }
            
            .${this.structure.containerClass} .contact-info span {
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            .${this.structure.containerClass} .regulatory-badges {
                padding: 30px 0;
                display: flex;
                justify-content: center;
                gap: 40px;
            }
            
            .${this.structure.containerClass} .regulatory-badge {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-decoration: none;
                transition: opacity 0.2s;
            }
            
            .${this.structure.containerClass} .regulatory-badge:hover {
                opacity: 0.8;
            }
            
            .${this.structure.containerClass} .regulatory-badge img {
                height: 40px;
                width: auto;
                margin-bottom: 8px;
            }
            
            .${this.structure.containerClass} .regulatory-badge span {
                font-size: 12px;
                color: ${this.structure.linkColor};
            }
            
            .${this.structure.containerClass} .footer-bottom {
                padding: 30px 0;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .${this.structure.containerClass} .copyright {
                text-align: center;
                margin-bottom: 20px;
                font-size: 13px;
                opacity: 0.8;
            }
            
            .${this.structure.containerClass} .disclaimers {
                max-width: 800px;
                margin: 0 auto 20px;
            }
            
            .${this.structure.containerClass} .disclaimer {
                font-size: 12px;
                opacity: 0.7;
                line-height: 1.5;
                margin-bottom: 10px;
                text-align: center;
            }
            
            .${this.structure.containerClass} .quick-links {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .${this.structure.containerClass} .quick-link {
                font-size: 13px;
                text-decoration: none;
                color: ${this.structure.linkColor};
                transition: color 0.2s;
            }
            
            .${this.structure.containerClass} .quick-link:hover {
                color: ${this.structure.accentColor};
            }
            
            .${this.structure.containerClass} .trust-badges {
                display: flex;
                justify-content: center;
                gap: 30px;
                flex-wrap: wrap;
            }
            
            .${this.structure.containerClass} .trust-badge {
                font-size: 12px;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                opacity: 0.8;
            }
            
            /* Responsive Design */
            @media (max-width: 1024px) {
                .${this.structure.containerClass} .footer-grid {
                    grid-template-columns: repeat(${this.structure.responsiveBreakpoints.tablet}, 1fr);
                }
            }
            
            @media (max-width: 768px) {
                .${this.structure.containerClass} .footer-grid {
                    grid-template-columns: repeat(${this.structure.responsiveBreakpoints.mobile}, 1fr);
                }
                
                .${this.structure.containerClass} .contact-info {
                    flex-direction: column;
                    gap: 10px;
                    align-items: flex-start;
                }
                
                .${this.structure.containerClass} .regulatory-badges {
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
            }
            
            /* Social Media Styles */
            .${this.structure.containerClass} .social-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .${this.structure.containerClass} .social-section h5 {
                font-size: 14px;
                margin-bottom: 15px;
                color: ${this.structure.textColor};
            }
            
            .${this.structure.containerClass} .social-icons {
                display: flex;
                gap: 15px;
            }
            
            .${this.structure.containerClass} .social-icon {
                font-size: 20px;
                text-decoration: none;
                transition: transform 0.2s;
                display: inline-block;
            }
            
            .${this.structure.containerClass} .social-icon:hover {
                transform: translateY(-2px);
            }
            `;
        },

        // Generate JavaScript for footer interactions
        getJavaScript: function() {
            return `
            (function() {
                // Language switcher
                function setupLanguageSwitcher() {
                    const langToggle = document.querySelector('[href="#"]');
                    if (langToggle && langToggle.textContent.includes('Language')) {
                        langToggle.addEventListener('click', function(e) {
                            e.preventDefault();
                            const currentLang = document.documentElement.lang || 'en';
                            const newLang = currentLang === 'en' ? 'rw' : 'en';
                            
                            // Update page language
                            document.documentElement.lang = newLang;
                            
                            // Update footer language
                            updateFooterLanguage(newLang);
                            
                            // Save preference
                            localStorage.setItem('mpesewa_language', newLang);
                            
                            // Show notification
                            showLanguageNotification(newLang);
                        });
                    }
                }
                
                function updateFooterLanguage(lang) {
                    // This would typically be handled by a full page reload
                    // or AJAX call in production
                    console.log('Switching to language:', lang);
                }
                
                function showLanguageNotification(lang) {
                    const message = lang === 'rw' 
                        ? 'Ururimi rwahinduwe mu Kinyarwanda' 
                        : 'Language changed to English';
                    
                    const notification = document.createElement('div');
                    notification.style.cssText = \`
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: #003366;
                        color: white;
                        padding: 15px 20px;
                        border-radius: 8px;
                        z-index: 1000;
                        animation: slideIn 0.3s ease;
                    \`;
                    notification.textContent = message;
                    
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.style.animation = 'slideOut 0.3s ease';
                        setTimeout(() => notification.remove(), 300);
                    }, 3000);
                }
                
                // Newsletter subscription
                function setupNewsletter() {
                    const form = document.querySelector('.newsletter-form');
                    if (form) {
                        form.addEventListener('submit', function(e) {
                            e.preventDefault();
                            const email = this.querySelector('input[type="email"]').value;
                            const consent = this.querySelector('input[type="checkbox"]').checked;
                            
                            if (!consent) {
                                alert('Please agree to the privacy policy');
                                return;
                            }
                            
                            subscribeNewsletter(email);
                        });
                    }
                }
                
                function subscribeNewsletter(email) {
                    // In production, this would be an API call
                    console.log('Subscribing email:', email);
                    
                    // Show success message
                    const message = document.querySelector('.newsletter-form')?.parentElement;
                    if (message) {
                        const success = document.createElement('div');
                        success.className = 'newsletter-success';
                        success.textContent = 'Thank you for subscribing!';
                        success.style.cssText = \`
                            color: #28a745;
                            margin-top: 10px;
                            font-size: 14px;
                        \`;
                        message.appendChild(success);
                        
                        setTimeout(() => success.remove(), 5000);
                    }
                }
                
                // Trust badge animations
                function setupTrustBadges() {
                    const badges = document.querySelectorAll('.trust-badge');
                    badges.forEach(badge => {
                        badge.addEventListener('mouseenter', function() {
                            this.style.opacity = '1';
                        });
                        
                        badge.addEventListener('mouseleave', function() {
                            this.style.opacity = '0.8';
                        });
                    });
                }
                
                // Initialize everything when DOM is ready
                document.addEventListener('DOMContentLoaded', function() {
                    setupLanguageSwitcher();
                    setupNewsletter();
                    setupTrustBadges();
                    
                    // Add CSS animations
                    const style = document.createElement('style');
                    style.textContent = \`
                        @keyframes slideIn {
                            from {
                                transform: translateX(100%);
                                opacity: 0;
                            }
                            to {
                                transform: translateX(0);
                                opacity: 1;
                            }
                        }
                        
                        @keyframes slideOut {
                            from {
                                transform: translateX(0);
                                opacity: 1;
                            }
                            to {
                                transform: translateX(100%);
                                opacity: 0;
                            }
                        }
                    \`;
                    document.head.appendChild(style);
                });
            })();
            `;
        }
    },

    // ============================================
    // 1️⃣1️⃣ INITIALIZATION
    // ============================================
    init: function() {
        console.log('Rwanda Footer Module Initialized');
        
        // Check if we should inject the footer
        if (typeof document !== 'undefined') {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/rw')) {
                this.injectFooter();
            }
        }
        
        return this;
    },

    injectFooter: function() {
        // Get user language preference
        const userLang = localStorage.getItem('mpesewa_language') || 'en';
        
        // Create style element
        const style = document.createElement('style');
        style.textContent = this.generate.getCSS();
        document.head.appendChild(style);
        
        // Create footer element
        const footer = document.createElement('div');
        footer.innerHTML = this.generate.getHTML(userLang);
        
        // Replace existing footer or append
        const existingFooter = document.querySelector('footer');
        if (existingFooter) {
            existingFooter.replaceWith(footer.firstElementChild);
        } else {
            document.body.appendChild(footer.firstElementChild);
        }
        
        // Add JavaScript
        const script = document.createElement('script');
        script.textContent = this.generate.getJavaScript();
        document.body.appendChild(script);
    },

    // ============================================
    // 1️⃣2️⃣ VERSION CONTROL
    // ============================================
    version: {
        major: 1,
        minor: 0,
        patch: 0,
        build: '20240124',
        
        getFullVersion: function() {
            return `v${this.major}.${this.minor}.${this.patch}`;
        }
    }
};

// Auto-initialize in browser context
if (typeof document !== 'undefined') {
    RwandaFooter.init();
}

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RwandaFooter;
} else if (typeof window !== 'undefined') {
    window.RwandaFooter = RwandaFooter;
}

// Add to global M-Pesewa object
if (typeof window !== 'undefined' && window.MPesewa) {
    window.MPesewa.RwandaFooter = RwandaFooter;
}