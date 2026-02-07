/**
 * M-PESEWA COOKIE BANNER COMPONENT
 * Strict Hierarchy: Global → Countries → Groups → Lenders → Borrowers (Ledgers)
 * Component Type: GDPR/Privacy Compliance with Country-Specific Rules
 * Brand Colors: #003366 (Primary Blue), #0099ff (Secondary Blue), #f37021 (Action Orange), #28a745 (Trust Green)
 * Rules: Country-specific privacy laws, Role-based data collection
 */

class CookieBanner {
    constructor(config = {}) {
        // Core M-Pesewa Configuration with Hierarchy
        this.config = {
            brandColors: {
                primary: '#003366',
                secondary: '#0099ff',
                actionOrange: '#f37021',
                trustGreen: '#28a745',
                neutralLight: '#f8f9fa',
                pureWhite: '#ffffff'
            },
            hierarchy: {
                global: 'M-Pesewa Platform',
                countries: [
                    'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'DRC', 'Burundi',
                    'Nigeria', 'Ghana', 'South Sudan', 'Somalia', 'South Africa', 'Ethiopia'
                ],
                currentCountry: null,
                currentGroup: null,
                userRole: null // 'lender' or 'borrower' or 'admin' or 'guest'
            },
            privacyRules: {
                // Country-specific privacy law compliance
                countryLaws: {
                    'Kenya': { law: 'Data Protection Act 2019', consentRequired: true, age: 18 },
                    'Uganda': { law: 'Data Protection and Privacy Act 2019', consentRequired: true, age: 18 },
                    'Tanzania': { law: 'Personal Data Protection Bill', consentRequired: false, age: 18 },
                    'Rwanda': { law: 'Law Relating to Protection of Personal Data and Privacy', consentRequired: true, age: 16 },
                    'DRC': { law: 'No specific data protection law', consentRequired: false, age: 18 },
                    'Burundi': { law: 'No specific data protection law', consentRequired: false, age: 18 },
                    'Nigeria': { law: 'Nigeria Data Protection Regulation 2019', consentRequired: true, age: 18 },
                    'Ghana': { law: 'Data Protection Act 2012', consentRequired: true, age: 18 },
                    'South Sudan': { law: 'No specific data protection law', consentRequired: false, age: 18 },
                    'Somalia': { law: 'No specific data protection law', consentRequired: false, age: 18 },
                    'South Africa': { law: 'Protection of Personal Information Act 2013', consentRequired: true, age: 18 },
                    'Ethiopia': { law: 'No specific data protection law', consentRequired: false, age: 18 }
                },
                // Cookie categories with role-based permissions
                cookieCategories: {
                    essential: {
                        name: 'Essential Cookies',
                        description: 'Required for platform functionality, security, and country-group hierarchy enforcement',
                        required: true,
                        roles: ['all'],
                        cannotDisable: true
                    },
                    functional: {
                        name: 'Functional Cookies',
                        description: 'Remember your country, group, role preferences and lending/borrowing settings',
                        required: false,
                        roles: ['lender', 'borrower', 'admin'],
                        default: true
                    },
                    analytics: {
                        name: 'Analytics Cookies',
                        description: 'Help us understand how users interact with M-Pesewa to improve the platform',
                        required: false,
                        roles: ['all'],
                        default: true
                    },
                    marketing: {
                        name: 'Marketing Cookies',
                        description: 'Used to show relevant lending opportunities and platform updates',
                        required: false,
                        roles: ['lender'],
                        default: false
                    }
                }
            },
            ...config
        };

        // State Management
        this.state = {
            isVisible: false,
            consentGiven: false,
            userPreferences: {
                essential: true,
                functional: false,
                analytics: false,
                marketing: false
            },
            bannerType: 'default', // 'default', 'minimal', 'detailed'
            lastShown: null,
            timesShown: 0
        };

        // DOM Elements
        this.elements = {
            banner: null,
            overlay: null,
            content: null,
            acceptAllButton: null,
            acceptEssentialButton: null,
            customizeButton: null,
            savePreferencesButton: null,
            closeButton: null,
            settingsPanel: null,
            cookieToggles: {}
        };

        // Initialize
        this.init();
    }

    /**
     * STRICT M-PESEWA HIERARCHY INITIALIZATION
     * Enforces: Global → Country → Group → Lender/Borrower
     */
    init() {
        this.loadUserContext();
        this.checkPrivacyRequirements();
        this.createDOMStructure();
        this.applyBrandColors();
        this.bindEvents();
        this.checkConsentStatus();
        
        // Log initialization for audit trail
        this.logAudit('CookieBanner initialized', {
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            privacyLaw: this.getCurrentPrivacyLaw(),
            timestamp: new Date().toISOString()
        });
    }

    /**
     * LOAD USER CONTEXT WITH HIERARCHY ENFORCEMENT
     * Strict: Country isolation, Role-based visibility, Group context
     */
    loadUserContext() {
        try {
            // Get user data from localStorage (simulating auth state)
            const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
            const country = localStorage.getItem('mpesewa_country');
            const group = localStorage.getItem('mpesewa_group');
            
            // Country detection with fallback
            let detectedCountry = country;
            if (!detectedCountry) {
                // Try to detect from browser or IP
                detectedCountry = this.detectCountry();
            }

            // Validate country against supported list
            if (detectedCountry && !this.config.hierarchy.countries.includes(detectedCountry)) {
                console.warn(`M-Pesewa CookieBanner: Country "${detectedCountry}" not in supported list. Defaulting to global rules.`);
                detectedCountry = null;
            }

            // Update hierarchy state
            this.config.hierarchy.currentCountry = detectedCountry;
            this.config.hierarchy.currentGroup = group;
            this.config.hierarchy.userRole = userData.role || 'guest';
            
            console.log(`M-Pesewa CookieBanner: Loaded context for ${this.config.hierarchy.userRole} in ${detectedCountry || 'global'} ${group ? `(Group: ${group})` : ''}`);
        } catch (error) {
            console.error('M-Pesewa CookieBanner: Error loading user context', error);
            this.logError(error);
        }
    }

    /**
     * DETECT USER COUNTRY
     * @returns {string|null} Country name or null
     */
    detectCountry() {
        // Method 1: Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langToCountry = {
            'en-KE': 'Kenya',
            'sw-KE': 'Kenya',
            'en-UG': 'Uganda',
            'en-TZ': 'Tanzania',
            'sw-TZ': 'Tanzania',
            'en-RW': 'Rwanda',
            'rw-RW': 'Rwanda',
            'fr-CD': 'DRC',
            'en-NG': 'Nigeria',
            'en-GH': 'Ghana',
            'en-ZA': 'South Africa',
            'am-ET': 'Ethiopia'
        };
        
        if (langToCountry[browserLang]) {
            return langToCountry[browserLang];
        }
        
        // Method 2: Check timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone.includes('Nairobi')) return 'Kenya';
        if (timezone.includes('Kampala')) return 'Uganda';
        if (timezone.includes('Dar_es_Salaam')) return 'Tanzania';
        if (timezone.includes('Kigali')) return 'Rwanda';
        
        // Method 3: IP-based detection would go here in production
        return null;
    }

    /**
     * CHECK PRIVACY REQUIREMENTS BY COUNTRY
     * Strict: Different rules per country as per local laws
     */
    checkPrivacyRequirements() {
        const country = this.config.hierarchy.currentCountry;
        
        if (!country) {
            // Global/unknown country - apply strictest rules
            this.config.privacyRules.requireConsent = true;
            this.config.privacyRules.showDetailed = true;
            this.config.privacyRules.allowCustomization = true;
            return;
        }
        
        const countryLaw = this.config.privacyRules.countryLaws[country];
        
        if (countryLaw) {
            this.config.privacyRules.requireConsent = countryLaw.consentRequired;
            this.config.privacyRules.minimumAge = countryLaw.age;
            this.config.privacyRules.showDetailed = countryLaw.consentRequired;
            this.config.privacyRules.allowCustomization = countryLaw.consentRequired;
        } else {
            // Default to strict rules
            this.config.privacyRules.requireConsent = true;
            this.config.privacyRules.showDetailed = true;
            this.config.privacyRules.allowCustomization = true;
        }
        
        console.log(`M-Pesewa CookieBanner: Privacy requirements for ${country}: Consent required: ${this.config.privacyRules.requireConsent}, Min age: ${this.config.privacyRules.minimumAge}`);
    }

    /**
     * CHECK CONSENT STATUS
     */
    checkConsentStatus() {
        const storedConsent = JSON.parse(localStorage.getItem('mpesewa_cookie_consent') || 'null');
        
        if (storedConsent) {
            this.state.consentGiven = true;
            this.state.userPreferences = { ...this.state.userPreferences, ...storedConsent.preferences };
            this.state.lastShown = storedConsent.timestamp;
            
            // Check if we need to show banner again (e.g., after 6 months)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            
            if (new Date(storedConsent.timestamp) < sixMonthsAgo) {
                this.showBanner();
            }
        } else {
            // No consent stored, check if required
            if (this.config.privacyRules.requireConsent) {
                this.showBanner();
            } else {
                // Consent not required by law, apply default preferences
                this.applyDefaultPreferences();
                this.saveConsent('not_required');
            }
        }
    }

    /**
     * APPLY DEFAULT PREFERENCES BASED ON ROLE
     */
    applyDefaultPreferences() {
        const role = this.config.hierarchy.userRole;
        
        // Reset to defaults
        this.state.userPreferences = {
            essential: true, // Always true, cannot disable
            functional: false,
            analytics: false,
            marketing: false
        };
        
        // Role-based defaults
        if (role === 'lender') {
            this.state.userPreferences.functional = true;
            this.state.userPreferences.analytics = true;
            // Marketing optional, default false
        } else if (role === 'borrower') {
            this.state.userPreferences.functional = true;
            this.state.userPreferences.analytics = true;
        } else if (role === 'admin') {
            this.state.userPreferences.functional = true;
            this.state.userPreferences.analytics = true;
        }
        
        // Apply preferences
        this.applyCookiePreferences();
    }

    /**
     * CREATE DOM STRUCTURE WITH FINTECH-GRADE DESIGN
     * Follows M-Pesewa brand guidelines strictly
     */
    createDOMStructure() {
        // Create overlay
        this.elements.overlay = document.createElement('div');
        this.elements.overlay.className = 'mp-cookie-overlay';
        
        // Create main banner container
        this.elements.banner = document.createElement('div');
        this.elements.banner.className = 'mp-cookie-banner';
        this.elements.banner.setAttribute('role', 'dialog');
        this.elements.banner.setAttribute('aria-labelledby', 'mp-cookie-title');
        this.elements.banner.setAttribute('aria-describedby', 'mp-cookie-description');
        this.elements.banner.setAttribute('data-mpesewa-component', 'cookie-banner');
        this.elements.banner.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
        this.elements.banner.setAttribute('data-role', this.config.hierarchy.userRole);
        this.elements.banner.setAttribute('data-law', this.getCurrentPrivacyLawName());

        // Create content wrapper
        this.elements.content = document.createElement('div');
        this.elements.content.className = 'mp-cookie-banner__content';

        // Create title
        const title = document.createElement('h3');
        title.id = 'mp-cookie-title';
        title.className = 'mp-cookie-banner__title';
        title.textContent = this.getLocalizedTitle();

        // Create description
        const description = document.createElement('div');
        description.id = 'mp-cookie-description';
        description.className = 'mp-cookie-banner__description';
        description.innerHTML = this.getLocalizedDescription();

        // Create country law notice
        if (this.config.hierarchy.currentCountry) {
            const lawNotice = document.createElement('div');
            lawNotice.className = 'mp-cookie-banner__law-notice';
            lawNotice.innerHTML = `<strong>${this.config.hierarchy.currentCountry} Privacy Law:</strong> ${this.getCurrentPrivacyLaw()}`;
            description.appendChild(lawNotice);
        }

        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'mp-cookie-banner__buttons';

        // Create Accept All button
        this.elements.acceptAllButton = document.createElement('button');
        this.elements.acceptAllButton.className = 'mp-cookie-banner__button mp-cookie-banner__button--accept-all';
        this.elements.acceptAllButton.textContent = 'Accept All';
        this.elements.acceptAllButton.setAttribute('data-action', 'accept-all');

        // Create Accept Essential button
        this.elements.acceptEssentialButton = document.createElement('button');
        this.elements.acceptEssentialButton.className = 'mp-cookie-banner__button mp-cookie-banner__button--essential';
        this.elements.acceptEssentialButton.textContent = 'Essential Only';
        this.elements.acceptEssentialButton.setAttribute('data-action', 'essential-only');

        // Create Customize button
        this.elements.customizeButton = document.createElement('button');
        this.elements.customizeButton.className = 'mp-cookie-banner__button mp-cookie-banner__button--customize';
        this.elements.customizeButton.textContent = 'Customize';
        this.elements.customizeButton.setAttribute('data-action', 'customize');

        // Assemble buttons
        buttonsContainer.appendChild(this.elements.acceptAllButton);
        buttonsContainer.appendChild(this.elements.acceptEssentialButton);
        
        if (this.config.privacyRules.allowCustomization) {
            buttonsContainer.appendChild(this.elements.customizeButton);
        }

        // Create settings panel (initially hidden)
        this.elements.settingsPanel = document.createElement('div');
        this.elements.settingsPanel.className = 'mp-cookie-settings';
        this.elements.settingsPanel.innerHTML = this.createSettingsPanelHTML();

        // Create close button (for settings panel)
        this.elements.closeButton = document.createElement('button');
        this.elements.closeButton.className = 'mp-cookie-settings__close';
        this.elements.closeButton.innerHTML = '&times;';
        this.elements.closeButton.setAttribute('aria-label', 'Close cookie settings');

        // Create save preferences button
        this.elements.savePreferencesButton = document.createElement('button');
        this.elements.savePreferencesButton.className = 'mp-cookie-settings__save';
        this.elements.savePreferencesButton.textContent = 'Save Preferences';
        this.elements.savePreferencesButton.setAttribute('data-action', 'save-preferences');

        // Assemble settings panel
        const settingsHeader = document.createElement('div');
        settingsHeader.className = 'mp-cookie-settings__header';
        settingsHeader.innerHTML = '<h4>Cookie Preferences</h4>';
        settingsHeader.appendChild(this.elements.closeButton);

        const settingsContent = document.createElement('div');
        settingsContent.className = 'mp-cookie-settings__content';
        settingsContent.innerHTML = this.elements.settingsPanel.innerHTML;

        const settingsFooter = document.createElement('div');
        settingsFooter.className = 'mp-cookie-settings__footer';
        settingsFooter.appendChild(this.elements.savePreferencesButton);

        this.elements.settingsPanel.innerHTML = '';
        this.elements.settingsPanel.appendChild(settingsHeader);
        this.elements.settingsPanel.appendChild(settingsContent);
        this.elements.settingsPanel.appendChild(settingsFooter);

        // Assemble main banner
        this.elements.content.appendChild(title);
        this.elements.content.appendChild(description);
        this.elements.content.appendChild(buttonsContainer);
        this.elements.banner.appendChild(this.elements.content);

        // Add to document
        document.body.appendChild(this.elements.overlay);
        document.body.appendChild(this.elements.banner);
        document.body.appendChild(this.elements.settingsPanel);

        // Inject CSS
        this.injectStyles();
    }

    /**
     * CREATE SETTINGS PANEL HTML
     */
    createSettingsPanelHTML() {
        const categories = this.config.privacyRules.cookieCategories;
        let html = '<div class="mp-cookie-categories">';
        
        Object.entries(categories).forEach(([key, category]) => {
            // Check if category is applicable to user role
            if (!this.isCategoryApplicable(category)) {
                return;
            }
            
            const isRequired = category.required || category.cannotDisable;
            const isChecked = isRequired || this.state.userPreferences[key] || category.default;
            const isDisabled = isRequired;
            
            html += `
                <div class="mp-cookie-category" data-category="${key}">
                    <div class="mp-cookie-category__header">
                        <label class="mp-cookie-toggle">
                            <input type="checkbox" 
                                   id="cookie-${key}" 
                                   name="cookie-${key}" 
                                   ${isChecked ? 'checked' : ''}
                                   ${isDisabled ? 'disabled' : ''}
                                   data-category="${key}">
                            <span class="mp-cookie-toggle__slider"></span>
                        </label>
                        <div class="mp-cookie-category__info">
                            <h5 class="mp-cookie-category__title">
                                ${category.name}
                                ${isRequired ? '<span class="mp-cookie-required">Required</span>' : ''}
                                ${category.roles && category.roles.length === 1 ? `<span class="mp-cookie-role-badge">${category.roles[0]}</span>` : ''}
                            </h5>
                            <p class="mp-cookie-category__description">${category.description}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * CHECK IF CATEGORY IS APPLICABLE TO USER ROLE
     */
    isCategoryApplicable(category) {
        if (!category.roles || category.roles.includes('all')) {
            return true;
        }
        
        return category.roles.includes(this.config.hierarchy.userRole);
    }

    /**
     * GET LOCALIZED TITLE BASED ON COUNTRY
     */
    getLocalizedTitle() {
        const country = this.config.hierarchy.currentCountry;
        
        const titles = {
            'Kenya': 'M-Pesewa Cookie Consent - Kenya Data Protection Act 2019',
            'Uganda': 'M-Pesewa Cookie Consent - Uganda Data Protection Act',
            'Rwanda': 'M-Pesewa Cookie Consent - Rwanda Personal Data Protection',
            'South Africa': 'M-Pesewa Cookie Consent - South Africa POPIA Compliance',
            'Nigeria': 'M-Pesewa Cookie Consent - Nigeria Data Protection Regulation',
            'Ghana': 'M-Pesewa Cookie Consent - Ghana Data Protection Act',
            'default': 'M-Pesewa Cookie Preferences'
        };
        
        return titles[country] || titles.default;
    }

    /**
     * GET LOCALIZED DESCRIPTION
     */
    getLocalizedDescription() {
        const country = this.config.hierarchy.currentCountry;
        const role = this.config.hierarchy.userRole;
        
        let description = `
            <p>M-Pesewa uses cookies to ensure the platform works properly and securely, especially for our country-group hierarchy and ${role === 'lender' ? 'lending operations' : role === 'borrower' ? 'borrowing requests' : 'user experience'}.</p>
            <p>We respect your privacy and comply with local data protection laws.</p>
        `;
        
        if (country) {
            description += `<p><strong>Your detected country:</strong> ${country}. If this is incorrect, please <a href="/countries/index.html" class="mp-cookie-link">select your country</a>.</p>`;
        }
        
        description += `<p>By continuing to use M-Pesewa, you agree to our <a href="/terms.html" class="mp-cookie-link">Terms</a> and <a href="/privacy.html" class="mp-cookie-link">Privacy Policy</a>.</p>`;
        
        return description;
    }

    /**
     * GET CURRENT PRIVACY LAW NAME
     */
    getCurrentPrivacyLawName() {
        const country = this.config.hierarchy.currentCountry;
        if (!country) return 'Global Privacy Standards';
        
        const law = this.config.privacyRules.countryLaws[country];
        return law ? law.law : 'Local Privacy Regulations';
    }

    /**
     * GET CURRENT PRIVACY LAW
     */
    getCurrentPrivacyLaw() {
        const country = this.config.hierarchy.currentCountry;
        if (!country) return 'Applies global privacy best practices';
        
        const law = this.config.privacyRules.countryLaws[country];
        if (!law) return 'Follows general privacy principles';
        
        return `${law.law} (Minimum age: ${law.age}, Consent required: ${law.consentRequired ? 'Yes' : 'No'})`;
    }

    /**
     * APPLY M-PESEWA BRAND COLORS STRICTLY
     * Non-negotiable color scheme enforcement
     */
    applyBrandColors() {
        const style = document.createElement('style');
        style.textContent = `
            .mp-cookie-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9998;
                display: none;
                backdrop-filter: blur(4px);
            }
            
            .mp-cookie-overlay--visible {
                display: block;
                animation: mp-fade-in 0.3s ease;
            }
            
            .mp-cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: ${this.config.brandColors.pureWhite};
                color: ${this.config.brandColors.primary};
                padding: 24px;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                display: none;
                border-top: 4px solid ${this.config.brandColors.primary};
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            .mp-cookie-banner--visible {
                display: block;
                animation: mp-slide-up 0.4s ease-out;
            }
            
            .mp-cookie-banner__content {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .mp-cookie-banner__title {
                color: ${this.config.brandColors.primary};
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 12px;
                line-height: 1.3;
            }
            
            .mp-cookie-banner__description {
                color: #555555;
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            .mp-cookie-banner__description p {
                margin-bottom: 12px;
            }
            
            .mp-cookie-banner__law-notice {
                background: ${this.config.brandColors.neutralLight};
                border-left: 4px solid ${this.config.brandColors.secondary};
                padding: 12px 16px;
                margin: 16px 0;
                border-radius: 4px;
                font-size: 13px;
            }
            
            .mp-cookie-banner__buttons {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }
            
            .mp-cookie-banner__button {
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
                min-width: 140px;
                text-align: center;
            }
            
            .mp-cookie-banner__button--accept-all {
                background: ${this.config.brandColors.trustGreen};
                color: ${this.config.brandColors.pureWhite};
                box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
            }
            
            .mp-cookie-banner__button--accept-all:hover {
                background: #218838;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
            }
            
            .mp-cookie-banner__button--essential {
                background: transparent;
                color: ${this.config.brandColors.primary};
                border: 2px solid ${this.config.brandColors.primary};
            }
            
            .mp-cookie-banner__button--essential:hover {
                background: ${this.config.brandColors.primary};
                color: ${this.config.brandColors.pureWhite};
                transform: translateY(-1px);
            }
            
            .mp-cookie-banner__button--customize {
                background: ${this.config.brandColors.actionOrange};
                color: ${this.config.brandColors.pureWhite};
                box-shadow: 0 2px 8px rgba(243, 112, 33, 0.3);
            }
            
            .mp-cookie-banner__button--customize:hover {
                background: #e65c00;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(243, 112, 33, 0.4);
            }
            
            .mp-cookie-settings {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${this.config.brandColors.pureWhite};
                color: ${this.config.brandColors.primary};
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 10000;
                display: none;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            .mp-cookie-settings--visible {
                display: block;
                animation: mp-scale-in 0.3s ease;
            }
            
            .mp-cookie-settings__header {
                background: ${this.config.brandColors.primary};
                color: ${this.config.brandColors.pureWhite};
                padding: 20px 24px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .mp-cookie-settings__header h4 {
                margin: 0;
                font-size: 18px;
                font-weight: 700;
            }
            
            .mp-cookie-settings__close {
                background: none;
                border: none;
                color: ${this.config.brandColors.pureWhite};
                font-size: 28px;
                line-height: 1;
                cursor: pointer;
                padding: 4px 12px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .mp-cookie-settings__close:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: scale(1.1);
            }
            
            .mp-cookie-settings__content {
                padding: 24px;
                max-height: 50vh;
                overflow-y: auto;
            }
            
            .mp-cookie-settings__footer {
                padding: 20px 24px;
                background: ${this.config.brandColors.neutralLight};
                border-radius: 0 0 12px 12px;
                text-align: right;
            }
            
            .mp-cookie-settings__save {
                background: ${this.config.brandColors.primary};
                color: ${this.config.brandColors.pureWhite};
                border: none;
                padding: 12px 32px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 180px;
            }
            
            .mp-cookie-settings__save:hover {
                background: #002244;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
            }
            
            .mp-cookie-categories {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            
            .mp-cookie-category {
                background: ${this.config.brandColors.neutralLight};
                border-radius: 8px;
                padding: 16px;
                border: 1px solid #e0e0e0;
            }
            
            .mp-cookie-category__header {
                display: flex;
                gap: 16px;
                align-items: flex-start;
            }
            
            .mp-cookie-toggle {
                position: relative;
                display: inline-block;
                width: 52px;
                height: 26px;
                flex-shrink: 0;
                margin-top: 4px;
            }
            
            .mp-cookie-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .mp-cookie-toggle__slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
            }
            
            .mp-cookie-toggle__slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            
            .mp-cookie-toggle input:checked + .mp-cookie-toggle__slider {
                background-color: ${this.config.brandColors.trustGreen};
            }
            
            .mp-cookie-toggle input:checked + .mp-cookie-toggle__slider:before {
                transform: translateX(26px);
            }
            
            .mp-cookie-toggle input:disabled + .mp-cookie-toggle__slider {
                background-color: #666;
                cursor: not-allowed;
            }
            
            .mp-cookie-category__info {
                flex: 1;
            }
            
            .mp-cookie-category__title {
                margin: 0 0 6px 0;
                font-size: 16px;
                font-weight: 600;
                color: ${this.config.brandColors.primary};
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            }
            
            .mp-cookie-category__description {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
                color: #666;
            }
            
            .mp-cookie-required {
                background: ${this.config.brandColors.secondary};
                color: ${this.config.brandColors.pureWhite};
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .mp-cookie-role-badge {
                background: ${this.config.brandColors.actionOrange};
                color: ${this.config.brandColors.pureWhite};
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .mp-cookie-link {
                color: ${this.config.brandColors.secondary};
                text-decoration: none;
                font-weight: 600;
            }
            
            .mp-cookie-link:hover {
                text-decoration: underline;
            }
            
            @keyframes mp-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes mp-slide-up {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes mp-scale-in {
                from {
                    transform: translate(-50%, -50%) scale(0.9);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .mp-cookie-banner {
                    padding: 20px 16px;
                }
                
                .mp-cookie-banner__buttons {
                    flex-direction: column;
                }
                
                .mp-cookie-banner__button {
                    width: 100%;
                    margin: 4px 0;
                }
                
                .mp-cookie-settings {
                    width: 95%;
                    max-height: 90vh;
                }
                
                .mp-cookie-settings__content {
                    max-height: 60vh;
                }
                
                .mp-cookie-category__header {
                    flex-direction: column;
                    gap: 12px;
                }
                
                .mp-cookie-toggle {
                    align-self: flex-start;
                }
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .mp-cookie-banner,
                .mp-cookie-settings {
                    background: #1a1a1a;
                    color: #ffffff;
                    border-color: ${this.config.brandColors.secondary};
                }
                
                .mp-cookie-category {
                    background: #2a2a2a;
                    border-color: #444;
                }
                
                .mp-cookie-banner__description,
                .mp-cookie-category__description {
                    color: #ccc;
                }
                
                .mp-cookie-banner__button--essential {
                    border-color: ${this.config.brandColors.secondary};
                    color: ${this.config.brandColors.secondary};
                }
                
                .mp-cookie-banner__button--essential:hover {
                    background: ${this.config.brandColors.secondary};
                    color: #1a1a1a;
                }
            }
            
            /* Accessibility */
            .mp-cookie-banner__button:focus,
            .mp-cookie-settings__close:focus,
            .mp-cookie-settings__save:focus,
            .mp-cookie-toggle input:focus + .mp-cookie-toggle__slider {
                outline: 2px solid ${this.config.brandColors.secondary};
                outline-offset: 2px;
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .mp-cookie-overlay--visible,
                .mp-cookie-banner--visible,
                .mp-cookie-settings--visible {
                    animation: none;
                }
                
                .mp-cookie-banner__button:hover,
                .mp-cookie-settings__save:hover {
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * BIND EVENTS WITH HIERARCHY-AWARE LOGIC
     */
    bindEvents() {
        // Accept All button
        this.elements.acceptAllButton.addEventListener('click', () => {
            this.acceptAllCookies();
        });

        // Accept Essential button
        this.elements.acceptEssentialButton.addEventListener('click', () => {
            this.acceptEssentialOnly();
        });

        // Customize button
        this.elements.customizeButton.addEventListener('click', () => {
            this.showSettings();
        });

        // Close settings button
        this.elements.closeButton.addEventListener('click', () => {
            this.hideSettings();
        });

        // Save preferences button
        this.elements.savePreferencesButton.addEventListener('click', () => {
            this.saveCustomPreferences();
        });

        // Cookie toggle switches in settings
        document.addEventListener('change', (e) => {
            if (e.target.matches('.mp-cookie-settings input[type="checkbox"]')) {
                const category = e.target.getAttribute('data-category');
                const isChecked = e.target.checked;
                this.updateCategoryPreference(category, isChecked);
            }
        });

        // Close settings when clicking overlay
        this.elements.overlay.addEventListener('click', () => {
            this.hideSettings();
        });

        // Close settings with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.settingsPanel.classList.contains('mp-cookie-settings--visible')) {
                this.hideSettings();
            }
        });

        // Listen for country changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'mpesewa_country') {
                this.handleCountryChange();
            }
        });
    }

    /**
     * SHOW COOKIE BANNER
     */
    showBanner() {
        // Don't show if consent already given
        if (this.state.consentGiven) return;
        
        // Don't show more than 3 times in a session
        if (this.state.timesShown >= 3) return;
        
        this.state.isVisible = true;
        this.state.timesShown++;
        
        this.elements.banner.classList.add('mp-cookie-banner--visible');
        
        // Log for audit
        this.logAudit('Cookie banner shown', {
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timesShown: this.state.timesShown,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * HIDE COOKIE BANNER
     */
    hideBanner() {
        this.state.isVisible = false;
        this.elements.banner.classList.remove('mp-cookie-banner--visible');
    }

    /**
     * SHOW SETTINGS PANEL
     */
    showSettings() {
        this.elements.overlay.classList.add('mp-cookie-overlay--visible');
        this.elements.settingsPanel.classList.add('mp-cookie-settings--visible');
        
        // Update toggle states in settings panel
        this.updateSettingsToggles();
        
        // Log for audit
        this.logAudit('Cookie settings opened', {
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * HIDE SETTINGS PANEL
     */
    hideSettings() {
        this.elements.overlay.classList.remove('mp-cookie-overlay--visible');
        this.elements.settingsPanel.classList.remove('mp-cookie-settings--visible');
    }

    /**
     * UPDATE SETTINGS TOGGLES WITH CURRENT PREFERENCES
     */
    updateSettingsToggles() {
        Object.entries(this.state.userPreferences).forEach(([category, enabled]) => {
            const checkbox = document.querySelector(`#cookie-${category}`);
            if (checkbox) {
                // Check if category is required
                const categoryConfig = this.config.privacyRules.cookieCategories[category];
                if (categoryConfig && (categoryConfig.required || categoryConfig.cannotDisable)) {
                    checkbox.disabled = true;
                } else {
                    checkbox.checked = enabled;
                }
            }
        });
    }

    /**
     * UPDATE CATEGORY PREFERENCE
     */
    updateCategoryPreference(category, enabled) {
        if (this.state.userPreferences.hasOwnProperty(category)) {
            // Check if category can be disabled
            const categoryConfig = this.config.privacyRules.cookieCategories[category];
            if (categoryConfig && (categoryConfig.required || categoryConfig.cannotDisable)) {
                return; // Cannot change required categories
            }
            
            this.state.userPreferences[category] = enabled;
            
            // Log for audit
            this.logAudit('Cookie preference changed', {
                category: category,
                enabled: enabled,
                country: this.config.hierarchy.currentCountry,
                role: this.config.hierarchy.userRole,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * ACCEPT ALL COOKIES
     */
    acceptAllCookies() {
        // Enable all non-essential categories that are applicable
        Object.keys(this.config.privacyRules.cookieCategories).forEach(category => {
            const categoryConfig = this.config.privacyRules.cookieCategories[category];
            if (!categoryConfig.required && !categoryConfig.cannotDisable) {
                if (this.isCategoryApplicable(categoryConfig)) {
                    this.state.userPreferences[category] = true;
                }
            }
        });
        
        this.applyCookiePreferences();
        this.saveConsent('accept_all');
        this.hideBanner();
        
        // Log for audit
        this.logAudit('All cookies accepted', {
            preferences: this.state.userPreferences,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * ACCEPT ESSENTIAL COOKIES ONLY
     */
    acceptEssentialOnly() {
        // Disable all non-essential categories
        Object.keys(this.config.privacyRules.cookieCategories).forEach(category => {
            const categoryConfig = this.config.privacyRules.cookieCategories[category];
            if (!categoryConfig.required && !categoryConfig.cannotDisable) {
                this.state.userPreferences[category] = false;
            }
        });
        
        this.applyCookiePreferences();
        this.saveConsent('essential_only');
        this.hideBanner();
        
        // Log for audit
        this.logAudit('Essential cookies only accepted', {
            preferences: this.state.userPreferences,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * SAVE CUSTOM PREFERENCES
     */
    saveCustomPreferences() {
        this.applyCookiePreferences();
        this.saveConsent('custom_preferences');
        this.hideSettings();
        this.hideBanner();
        
        // Log for audit
        this.logAudit('Custom cookie preferences saved', {
            preferences: this.state.userPreferences,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * APPLY COOKIE PREFERENCES
     * Actually set/remove cookies based on preferences
     */
    applyCookiePreferences() {
        // Essential cookies are always set
        this.setEssentialCookies();
        
        // Apply functional cookies
        if (this.state.userPreferences.functional) {
            this.setFunctionalCookies();
        } else {
            this.removeFunctionalCookies();
        }
        
        // Apply analytics cookies
        if (this.state.userPreferences.analytics) {
            this.setAnalyticsCookies();
        } else {
            this.removeAnalyticsCookies();
        }
        
        // Apply marketing cookies
        if (this.state.userPreferences.marketing) {
            this.setMarketingCookies();
        } else {
            this.removeMarketingCookies();
        }
        
        // Update state
        this.state.consentGiven = true;
    }

    /**
     * SET ESSENTIAL COOKIES
     * Required for platform functionality
     */
    setEssentialCookies() {
        // Session cookie
        this.setCookie('mpesewa_session', this.generateSessionId(), 0); // Session cookie
        
        // Security token
        this.setCookie('mpesewa_token', this.generateToken(), 7); // 7 days
        
        // Country preference (if known)
        if (this.config.hierarchy.currentCountry) {
            this.setCookie('mpesewa_country', this.config.hierarchy.currentCountry, 30);
        }
        
        // Consent status
        this.setCookie('mpesewa_consent', 'given', 180); // 6 months
    }

    /**
     * SET FUNCTIONAL COOKIES
     * Remember user preferences
     */
    setFunctionalCookies() {
        // User preferences
        this.setCookie('mpesewa_prefs', JSON.stringify({
            role: this.config.hierarchy.userRole,
            group: this.config.hierarchy.currentGroup,
            theme: 'light', // Default theme
            language: 'en'
        }), 30);
        
        // Last visited page
        this.setCookie('mpesewa_last_visit', window.location.pathname, 7);
    }

    /**
     * REMOVE FUNCTIONAL COOKIES
     */
    removeFunctionalCookies() {
        this.deleteCookie('mpesewa_prefs');
        this.deleteCookie('mpesewa_last_visit');
    }

    /**
     * SET ANALYTICS COOKIES
     */
    setAnalyticsCookies() {
        // Analytics user ID
        const analyticsId = localStorage.getItem('mpesewa_analytics_id') || this.generateAnalyticsId();
        localStorage.setItem('mpesewa_analytics_id', analyticsId);
        this.setCookie('mpesewa_analytics', analyticsId, 365);
        
        // First visit timestamp
        if (!localStorage.getItem('mpesewa_first_visit')) {
            localStorage.setItem('mpesewa_first_visit', new Date().toISOString());
        }
    }

    /**
     * REMOVE ANALYTICS COOKIES
     */
    removeAnalyticsCookies() {
        this.deleteCookie('mpesewa_analytics');
        // Note: We keep localStorage analytics ID for if they re-enable
    }

    /**
     * SET MARKETING COOKIES
     */
    setMarketingCookies() {
        // Marketing campaign tracking
        const campaign = this.getUrlParam('campaign') || 'organic';
        this.setCookie('mpesewa_campaign', campaign, 30);
        
        // Referral tracking
        const referral = this.getUrlParam('ref') || 'direct';
        this.setCookie('mpesewa_referral', referral, 30);
    }

    /**
     * REMOVE MARKETING COOKIES
     */
    removeMarketingCookies() {
        this.deleteCookie('mpesewa_campaign');
        this.deleteCookie('mpesewa_referral');
    }

    /**
     * SAVE CONSENT TO STORAGE
     * @param {string} method - How consent was given
     */
    saveConsent(method) {
        const consentData = {
            given: true,
            method: method,
            preferences: this.state.userPreferences,
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        localStorage.setItem('mpesewa_cookie_consent', JSON.stringify(consentData));
        
        // Also store in cookie for server-side access
        this.setCookie('mpesewa_consent_details', JSON.stringify(consentData), 180);
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('mpesewa:cookieConsent', {
            detail: consentData
        }));
    }

    /**
     * HANDLE COUNTRY CHANGE
     */
    handleCountryChange() {
        // Reload context
        this.loadUserContext();
        this.checkPrivacyRequirements();
        
        // Update banner attributes
        this.elements.banner.setAttribute('data-country', this.config.hierarchy.currentCountry || 'global');
        this.elements.banner.setAttribute('data-law', this.getCurrentPrivacyLawName());
        
        // Update title and description
        const title = this.elements.banner.querySelector('.mp-cookie-banner__title');
        const description = this.elements.banner.querySelector('.mp-cookie-banner__description');
        
        if (title) title.textContent = this.getLocalizedTitle();
        if (description) description.innerHTML = this.getLocalizedDescription();
        
        // Log for audit
        this.logAudit('Country changed in cookie banner', {
            newCountry: this.config.hierarchy.currentCountry,
            oldCountry: this.config.hierarchy.currentCountry, // Would track old in production
            role: this.config.hierarchy.userRole,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * UTILITY FUNCTIONS
     */
    
    setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    }
    
    deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateToken() {
        return 'tok_' + Math.random().toString(36).substr(2, 16);
    }
    
    generateAnalyticsId() {
        return 'ua_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * LOG AUDIT TRAIL
     */
    logAudit(action, data) {
        const auditLog = JSON.parse(localStorage.getItem('mpesewa_audit_log') || '[]');
        auditLog.push({
            component: 'CookieBanner',
            action: action,
            ...data,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        // Keep only last 1000 entries
        if (auditLog.length > 1000) {
            auditLog.splice(0, auditLog.length - 1000);
        }
        
        localStorage.setItem('mpesewa_audit_log', JSON.stringify(auditLog));
    }

    /**
     * LOG ERROR
     */
    logError(error) {
        const errorLog = JSON.parse(localStorage.getItem('mpesewa_error_log') || '[]');
        errorLog.push({
            component: 'CookieBanner',
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            country: this.config.hierarchy.currentCountry,
            role: this.config.hierarchy.userRole
        });
        
        localStorage.setItem('mpesewa_error_log', JSON.stringify(errorLog));
    }

    /**
     * INJECT STYLES
     */
    injectStyles() {
        // Already done in applyBrandColors
    }

    /**
     * PUBLIC API METHODS
     */
    
    // Show banner manually
    show() {
        this.showBanner();
    }
    
    // Hide banner
    hide() {
        this.hideBanner();
    }
    
    // Get current preferences
    getPreferences() {
        return { ...this.state.userPreferences };
    }
    
    // Update preferences manually
    setPreferences(prefs) {
        this.state.userPreferences = { ...this.state.userPreferences, ...prefs };
        this.applyCookiePreferences();
    }
    
    // Reset to defaults
    reset() {
        localStorage.removeItem('mpesewa_cookie_consent');
        this.state.consentGiven = false;
        this.state.userPreferences = {
            essential: true,
            functional: false,
            analytics: false,
            marketing: false
        };
        this.showBanner();
    }
    
    // Check if consent given
    hasConsent() {
        return this.state.consentGiven;
    }
    
    // Get current country
    getCurrentCountry() {
        return this.config.hierarchy.currentCountry;
    }
    
    // Destroy component
    destroy() {
        if (this.elements.banner && this.elements.banner.parentNode) {
            this.elements.banner.parentNode.removeChild(this.elements.banner);
        }
        if (this.elements.overlay && this.elements.overlay.parentNode) {
            this.elements.overlay.parentNode.removeChild(this.elements.overlay);
        }
        if (this.elements.settingsPanel && this.elements.settingsPanel.parentNode) {
            this.elements.settingsPanel.parentNode.removeChild(this.elements.settingsPanel);
        }
        
        // Remove event listeners
        this.elements.acceptAllButton?.removeEventListener('click', this.acceptAllCookies);
        this.elements.acceptEssentialButton?.removeEventListener('click', this.acceptEssentialOnly);
        this.elements.customizeButton?.removeEventListener('click', this.showSettings);
        this.elements.closeButton?.removeEventListener('click', this.hideSettings);
        this.elements.savePreferencesButton?.removeEventListener('click', this.saveCustomPreferences);
        this.elements.overlay?.removeEventListener('click', this.hideSettings);
        
        // Clear state
        this.state = null;
        this.elements = null;
        
        console.log('M-Pesewa CookieBanner: Component destroyed');
    }
}

/**
 * GLOBAL EXPORT FOR MODULE USAGE
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieBanner;
} else if (typeof window !== 'undefined') {
    window.MPesewaCookieBanner = CookieBanner;
}

/**
 * AUTO-INITIALIZE IF IN BROWSER CONTEXT
 */
if (typeof window !== 'undefined' && !window.mpCookieBanner) {
    window.mpCookieBanner = new CookieBanner();
    
    // Expose public API
    window.mpCookieBannerAPI = {
        show: () => window.mpCookieBanner.show(),
        hide: () => window.mpCookieBanner.hide(),
        getPreferences: () => window.mpCookieBanner.getPreferences(),
        setPreferences: (prefs) => window.mpCookieBanner.setPreferences(prefs),
        reset: () => window.mpCookieBanner.reset(),
        hasConsent: () => window.mpCookieBanner.hasConsent(),
        getCountry: () => window.mpCookieBanner.getCurrentCountry(),
        destroy: () => window.mpCookieBanner.destroy()
    };
}

export default CookieBanner;