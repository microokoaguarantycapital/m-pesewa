/**
 * M-Pesewa Brand Block Component
 * Consolidated brand display component for headers, footers, and marketing materials
 * Strictly follows M-Pesewa brand guidelines and hierarchy rules
 */

class BrandBlock {
    constructor(config = {}) {
        this.config = {
            // Brand identity
            identity: {
                name: 'M-PESEWA',
                fullName: 'M-Pesewa Trusted Circles Lending',
                tagline: 'Emergency Micro-Lending in Trusted Circles',
                description: 'Africa\'s trusted peer-to-peer emergency micro-lending platform',
                established: '2016',
                legalName: 'M-Pesewa Technology Pvt. Ltd.',
                domains: ['m-pesewa.com', 'mpesewa.com']
            },
            
            // Visual identity
            visual: {
                logo: {
                    primary: '🤝', // Primary logo emoji
                    alternatives: ['💰', '👥', '🌍'], // Alternative logos
                    animated: '🔄' // Animated version
                },
                colors: {
                    primary: '#003366', // Deep Blue
                    secondary: '#0099ff', // Sky Blue
                    accent: '#f37021', // Orange
                    success: '#28a745', // Green
                    neutralLight: '#f8f9fa',
                    pureWhite: '#ffffff',
                    darkText: '#003366',
                    lightText: '#ffffff'
                },
                typography: {
                    primary: "'Poppins', sans-serif",
                    secondary: "'Inter', sans-serif",
                    weights: {
                        light: 300,
                        regular: 400,
                        medium: 500,
                        semiBold: 600,
                        bold: 700
                    }
                },
                spacing: {
                    unit: '8px',
                    scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
                }
            },
            
            // Hierarchy display
            hierarchy: {
                levels: [
                    { id: 'global', name: 'Global', icon: '🌍', color: '#003366' },
                    { id: 'countries', name: 'Countries', icon: '🇺🇳', color: '#0099ff' },
                    { id: 'groups', name: 'Groups', icon: '👥', color: '#0099ff' },
                    { id: 'lenders', name: 'Lenders', icon: '💰', color: '#28a745' },
                    { id: 'borrowers', name: 'Borrowers', icon: '🙋', color: '#f37021' }
                ],
                rules: [
                    'Strict country isolation',
                    'Group-based trust circles',
                    'Lender subscriptions required',
                    'Borrower reputation system'
                ]
            },
            
            // Country-specific branding
            countries: {
                'kenya': {
                    name: 'Kenya',
                    flag: '🇰🇪',
                    currency: 'KSh',
                    contact: '+254 709 219 000',
                    colorVariation: '#003366' // Same as primary
                },
                'uganda': {
                    name: 'Uganda',
                    flag: '🇺🇬',
                    currency: 'UGX',
                    contact: '+256 392 175 546',
                    colorVariation: '#003366'
                },
                'tanzania': {
                    name: 'Tanzania',
                    flag: '🇹🇿',
                    currency: 'TZS',
                    contact: '+255 659 073 010',
                    colorVariation: '#003366'
                },
                'rwanda': {
                    name: 'Rwanda',
                    flag: '🇷🇼',
                    currency: 'RWF',
                    contact: '+250 791 590 801',
                    colorVariation: '#003366'
                },
                'drc': {
                    name: 'DR Congo',
                    flag: '🇨🇩',
                    currency: 'CDF',
                    contact: '+243 81 000 0000',
                    colorVariation: '#003366'
                },
                'burundi': {
                    name: 'Burundi',
                    flag: '🇧🇮',
                    currency: 'BIF',
                    contact: '+257 79 000 000',
                    colorVariation: '#003366'
                },
                'nigeria': {
                    name: 'Nigeria',
                    flag: '🇳🇬',
                    currency: 'NGN',
                    contact: '+234 800 000 0000',
                    colorVariation: '#003366'
                },
                'ghana': {
                    name: 'Ghana',
                    flag: '🇬🇭',
                    currency: 'GHS',
                    contact: '+233 24 000 0000',
                    colorVariation: '#003366'
                },
                'south-sudan': {
                    name: 'South Sudan',
                    flag: '🇸🇸',
                    currency: 'SSP',
                    contact: '+211 955 000 000',
                    colorVariation: '#003366'
                },
                'somalia': {
                    name: 'Somalia',
                    flag: '🇸🇴',
                    currency: 'SOS',
                    contact: '+252 63 0000000',
                    colorVariation: '#003366'
                },
                'south-africa': {
                    name: 'South Africa',
                    flag: '🇿🇦',
                    currency: 'ZAR',
                    contact: '+27 11 000 0000',
                    colorVariation: '#003366'
                },
                'ethiopia': {
                    name: 'Ethiopia',
                    flag: '🇪🇹',
                    currency: 'ETB',
                    contact: '+251 11 000 0000',
                    colorVariation: '#003366'
                }
            },
            
            // Usage guidelines
            guidelines: {
                logo: {
                    minSize: '32px',
                    clearSpace: '2x logo width',
                    backgrounds: ['#003366', '#ffffff', '#f8f9fa'],
                    forbiddenBackgrounds: ['#f37021', '#28a745'] // Don't place on action colors
                },
                typography: {
                    h1: { size: '2.5rem', weight: 700, color: '#003366' },
                    h2: { size: '2rem', weight: 600, color: '#003366' },
                    h3: { size: '1.5rem', weight: 600, color: '#003366' },
                    body: { size: '1rem', weight: 400, color: '#555555' },
                    caption: { size: '0.875rem', weight: 400, color: '#6c757d' }
                },
                buttons: {
                    borrower: { background: '#f37021', text: '#ffffff', hover: '#e0651b' },
                    lender: { background: '#28a745', text: '#ffffff', hover: '#218838' },
                    secondary: { background: '#0099ff', text: '#ffffff', hover: '#007bff' },
                    outline: { background: 'transparent', text: '#003366', border: '#003366' }
                }
            },
            ...config
        };
        
        // Current context
        this.context = {
            country: null,
            role: null,
            location: null, // 'header', 'footer', 'marketing', 'auth'
            size: 'medium' // 'small', 'medium', 'large', 'full'
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Load context
        this.loadContext();
        
        // Add styles
        this.addStyles();
    }
    
    loadContext() {
        try {
            this.context = {
                country: localStorage.getItem('mpesewa_country'),
                role: localStorage.getItem('mpesewa_role'),
                location: 'global',
                size: 'medium'
            };
        } catch (error) {
            console.error('Failed to load brand context:', error);
        }
    }
    
    addStyles() {
        if (!document.querySelector('#mp-brand-block-styles')) {
            const style = document.createElement('style');
            style.id = 'mp-brand-block-styles';
            style.textContent = `
                .brand-block {
                    font-family: 'Inter', sans-serif;
                }
                
                /* Small variant (for headers) */
                .brand-block.small {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .brand-logo-small {
                    font-size: 2rem;
                    animation: pulse 2s ease-in-out infinite;
                }
                
                .brand-text-small {
                    display: flex;
                    flex-direction: column;
                }
                
                .brand-name-small {
                    font-family: 'Poppins', sans-serif;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #003366;
                    line-height: 1.2;
                }
                
                .brand-tagline-small {
                    font-size: 0.75rem;
                    color: #0099ff;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }
                
                /* Medium variant (for cards) */
                .brand-block.medium {
                    text-align: center;
                    padding: 2rem;
                }
                
                .brand-logo-medium {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    animation: bounce 2s ease-in-out infinite;
                }
                
                .brand-name-medium {
                    font-family: 'Poppins', sans-serif;
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #003366;
                    margin-bottom: 0.5rem;
                    letter-spacing: 1px;
                }
                
                .brand-tagline-medium {
                    font-size: 1.1rem;
                    color: #0099ff;
                    font-weight: 500;
                    margin-bottom: 1.5rem;
                }
                
                .brand-description-medium {
                    font-size: 1rem;
                    color: #555555;
                    line-height: 1.6;
                    max-width: 600px;
                    margin: 0 auto 2rem;
                }
                
                /* Large variant (for hero sections) */
                .brand-block.large {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: linear-gradient(135deg, #003366 0%, #001a33 100%);
                    color: white;
                    border-radius: 20px;
                    margin: 2rem 0;
                }
                
                .brand-logo-large {
                    font-size: 6rem;
                    margin-bottom: 1.5rem;
                    animation: float 3s ease-in-out infinite;
                }
                
                .brand-name-large {
                    font-family: 'Poppins', sans-serif;
                    font-size: 4rem;
                    font-weight: 900;
                    margin-bottom: 0.75rem;
                    letter-spacing: 2px;
                    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                
                .brand-tagline-large {
                    font-size: 1.5rem;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 300;
                    margin-bottom: 2rem;
                    letter-spacing: 1px;
                }
                
                .brand-hierarchy-large {
                    display: inline-flex;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    margin-top: 2rem;
                    gap: 1rem;
                }
                
                .hierarchy-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
                
                .hierarchy-item.active {
                    opacity: 1;
                    font-weight: 600;
                }
                
                /* Full variant (for marketing pages) */
                .brand-block.full {
                    padding: 6rem 2rem;
                    text-align: center;
                }
                
                .brand-header-full {
                    margin-bottom: 4rem;
                }
                
                .brand-logo-full {
                    font-size: 8rem;
                    margin-bottom: 2rem;
                    animation: spin 20s linear infinite;
                }
                
                .brand-name-full {
                    font-family: 'Poppins', sans-serif;
                    font-size: 5rem;
                    font-weight: 900;
                    color: #003366;
                    margin-bottom: 1rem;
                    letter-spacing: 3px;
                }
                
                .brand-tagline-full {
                    font-size: 2rem;
                    color: #0099ff;
                    font-weight: 300;
                    margin-bottom: 3rem;
                }
                
                .brand-mission-full {
                    font-size: 1.2rem;
                    color: #555555;
                    max-width: 800px;
                    margin: 0 auto 4rem;
                    line-height: 1.8;
                }
                
                .brand-hierarchy-full {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                
                .hierarchy-card {
                    padding: 2rem;
                    border-radius: 16px;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                
                .hierarchy-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                
                .hierarchy-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                
                .hierarchy-title {
                    font-family: 'Poppins', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                
                .hierarchy-description {
                    font-size: 0.9rem;
                    color: #6c757d;
                    line-height: 1.5;
                }
                
                /* Country badge */
                .country-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(0, 51, 102, 0.1);
                    border-radius: 20px;
                    font-size: 0.9rem;
                    color: #003366;
                    margin-top: 1rem;
                }
                
                /* Animations */
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .brand-name-large {
                        font-size: 3rem;
                    }
                    
                    .brand-logo-large {
                        font-size: 4rem;
                    }
                    
                    .brand-name-full {
                        font-size: 3rem;
                    }
                    
                    .brand-logo-full {
                        font-size: 6rem;
                    }
                    
                    .brand-tagline-full {
                        font-size: 1.5rem;
                    }
                    
                    .brand-hierarchy-full {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    getCountryInfo(countryCode) {
        return this.config.countries[countryCode] || {
            name: 'Unknown Country',
            flag: '🇺🇳',
            currency: 'USD',
            contact: 'N/A'
        };
    }
    
    renderHierarchy(currentLevel = null) {
        const hierarchy = this.config.hierarchy.levels.map(level => {
            const isActive = currentLevel === level.id || 
                           (currentLevel === 'lenders' && level.id === 'lenders') ||
                           (currentLevel === 'borrowers' && level.id === 'borrowers');
            
            return {
                ...level,
                active: isActive
            };
        });
        
        return hierarchy;
    }
    
    render(size = 'medium', options = {}) {
        this.context.size = size;
        this.context.location = options.location || 'global';
        
        const country = options.country || this.context.country;
        const countryInfo = country ? this.getCountryInfo(country) : null;
        
        switch (size) {
            case 'small':
                return this.renderSmall(countryInfo, options);
            case 'medium':
                return this.renderMedium(countryInfo, options);
            case 'large':
                return this.renderLarge(countryInfo, options);
            case 'full':
                return this.renderFull(countryInfo, options);
            default:
                return this.renderMedium(countryInfo, options);
        }
    }
    
    renderSmall(countryInfo, options) {
        const hierarchy = this.renderHierarchy(options.currentLevel);
        const currentHierarchy = hierarchy.find(h => h.active) || hierarchy[0];
        
        return `
            <div class="brand-block small">
                <div class="brand-logo-small" style="color: ${currentHierarchy.color};">
                    ${currentHierarchy.icon}
                </div>
                <div class="brand-text-small">
                    <div class="brand-name-small">${this.config.identity.name}</div>
                    <div class="brand-tagline-small">${this.config.identity.tagline}</div>
                    ${countryInfo ? `
                        <div class="country-badge">
                            ${countryInfo.flag} ${countryInfo.name}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    renderMedium(countryInfo, options) {
        const hierarchy = this.renderHierarchy(options.currentLevel);
        
        return `
            <div class="brand-block medium">
                <div class="brand-logo-medium" style="color: ${this.config.visual.colors.primary};">
                    ${this.config.visual.logo.primary}
                </div>
                <div class="brand-name-medium">${this.config.identity.name}</div>
                <div class="brand-tagline-medium">${this.config.identity.tagline}</div>
                <div class="brand-description-medium">${this.config.identity.description}</div>
                
                ${countryInfo ? `
                    <div class="country-badge" style="margin: 0 auto 1.5rem;">
                        ${countryInfo.flag} Operating in ${countryInfo.name} • ${countryInfo.currency}
                    </div>
                ` : ''}
                
                <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                    ${hierarchy.map(level => `
                        <div class="hierarchy-item ${level.active ? 'active' : ''}" 
                             style="color: ${level.color};">
                            ${level.icon} ${level.name}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderLarge(countryInfo, options) {
        const hierarchy = this.renderHierarchy(options.currentLevel);
        
        return `
            <div class="brand-block large">
                <div class="brand-logo-large">
                    ${this.config.visual.logo.primary}
                </div>
                <div class="brand-name-large">${this.config.identity.name}</div>
                <div class="brand-tagline-large">${this.config.identity.tagline}</div>
                
                <div class="brand-hierarchy-large">
                    ${hierarchy.map((level, index) => `
                        <div class="hierarchy-item ${level.active ? 'active' : ''}">
                            ${level.icon} ${level.name}
                            ${index < hierarchy.length - 1 ? '<span style="opacity: 0.5;">→</span>' : ''}
                        </div>
                    `).join('')}
                </div>
                
                ${countryInfo ? `
                    <div style="margin-top: 2rem; opacity: 0.8; font-size: 0.9rem;">
                        ${countryInfo.flag} Serving ${countryInfo.name} since ${this.config.identity.established}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderFull(countryInfo, options) {
        const hierarchy = this.renderHierarchy();
        
        return `
            <div class="brand-block full">
                <div class="brand-header-full">
                    <div class="brand-logo-full" style="color: ${this.config.visual.colors.primary};">
                        ${this.config.visual.logo.primary}
                    </div>
                    <h1 class="brand-name-full">${this.config.identity.name}</h1>
                    <div class="brand-tagline-full">${this.config.identity.tagline}</div>
                    <p class="brand-mission-full">
                        ${this.config.identity.description}. We enable friends to lend to friends in trusted circles across Africa, 
                        with strict country isolation and group-based accountability.
                    </p>
                </div>
                
                <div class="brand-hierarchy-full">
                    ${hierarchy.map(level => `
                        <div class="hierarchy-card" style="border: 2px solid ${level.color}20; background: ${level.color}05;">
                            <div class="hierarchy-icon" style="color: ${level.color};">
                                ${level.icon}
                            </div>
                            <h3 class="hierarchy-title" style="color: ${level.color};">
                                ${level.name}
                            </h3>
                            <p class="hierarchy-description">
                                ${this.getHierarchyDescription(level.id)}
                            </p>
                        </div>
                    `).join('')}
                </div>
                
                ${countryInfo ? `
                    <div style="margin-top: 4rem; padding: 2rem; background: #f8f9fa; border-radius: 12px; max-width: 600px; margin-left: auto; margin-right: auto;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                            <span style="font-size: 2.5rem;">${countryInfo.flag}</span>
                            <div>
                                <div style="font-size: 1.5rem; font-weight: 600; color: #003366;">
                                    ${countryInfo.name}
                                </div>
                                <div style="color: #6c757d;">
                                    Currency: ${countryInfo.currency} • Contact: ${countryInfo.contact}
                                </div>
                            </div>
                        </div>
                        <div style="font-size: 0.9rem; color: #6c757d; text-align: center;">
                            Country selection is locked after registration to maintain compliance.
                            No cross-country lending or borrowing allowed.
                        </div>
                    </div>
                ` : ''}
                
                <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #e9ecef;">
                    <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; color: #28a745; font-weight: 700;">12</div>
                            <div style="color: #6c757d; font-size: 0.9rem;">African Countries</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; color: #f37021; font-weight: 700;">20</div>
                            <div style="color: #6c757d; font-size: 0.9rem;">Emergency Categories</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; color: #0099ff; font-weight: 700;">1000+</div>
                            <div style="color: #6c757d; font-size: 0.9rem;">Trusted Groups</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; color: #003366; font-weight: 700;">99%</div>
                            <div style="color: #6c757d; font-size: 0.9rem;">Repayment Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getHierarchyDescription(levelId) {
        const descriptions = {
            'global': 'Platform-wide rules and administration. Strict isolation between countries.',
            'countries': '12 African countries with independent operations. No cross-border transactions.',
            'groups': 'Trusted circles of 5-1000 members. Invitation-only with group-specific rules.',
            'lenders': 'Subscription-based access. Lend only within your trusted groups.',
            'borrowers': 'No subscription fees. Join up to 4 groups based on reputation.'
        };
        
        return descriptions[levelId] || 'Part of the M-Pesewa trusted hierarchy.';
    }
    
    renderColorPalette() {
        const colors = this.config.visual.colors;
        
        return `
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 2rem 0;">
                ${Object.entries(colors).map(([name, color]) => `
                    <div style="text-align: center;">
                        <div style="width: 60px; height: 60px; background: ${color}; border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid #e9ecef;"></div>
                        <div style="font-size: 0.75rem; color: #6c757d;">${name}</div>
                        <div style="font-size: 0.7rem; color: #adb5bd;">${color}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderTypographyScale() {
        const typography = this.config.guidelines.typography;
        
        return `
            <div style="margin: 2rem 0;">
                ${Object.entries(typography).map(([name, styles]) => `
                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e9ecef;">
                        <div style="font-family: ${this.config.visual.typography.primary}; 
                                    font-size: ${styles.size}; 
                                    font-weight: ${styles.weight}; 
                                    color: ${styles.color};">
                            ${name.charAt(0).toUpperCase() + name.slice(1)}: The quick brown fox jumps over the lazy dog
                        </div>
                        <div style="font-size: 0.8rem; color: #6c757d; margin-top: 0.5rem;">
                            ${styles.size} • Weight: ${styles.weight} • Color: ${styles.color}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderButtonExamples() {
        const buttons = this.config.guidelines.buttons;
        
        return `
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 2rem 0;">
                ${Object.entries(buttons).map(([name, styles]) => `
                    <button style="padding: 0.75rem 1.5rem; 
                                  border-radius: 8px; 
                                  border: ${name === 'outline' ? '2px solid ' + styles.border : 'none'};
                                  background: ${styles.background}; 
                                  color: ${styles.text}; 
                                  font-weight: 600;
                                  cursor: pointer;
                                  transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.background='${styles.hover || styles.background}';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.background='${styles.background}';">
                        ${name.charAt(0).toUpperCase() + name.slice(1)} Button
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    renderBrandGuidelines() {
        return `
            <div style="max-width: 1000px; margin: 0 auto; padding: 3rem 2rem;">
                <h2 style="color: #003366; font-family: 'Poppins', sans-serif; margin-bottom: 2rem;">
                    M-Pesewa Brand Guidelines
                </h2>
                
                <h3 style="color: #003366; margin-top: 2rem;">Color Palette</h3>
                ${this.renderColorPalette()}
                
                <h3 style="color: #003366; margin-top: 2rem;">Typography Scale</h3>
                ${this.renderTypographyScale()}
                
                <h3 style="color: #003366; margin-top: 2rem;">Button Styles</h3>
                ${this.renderButtonExamples()}
                
                <h3 style="color: #003366; margin-top: 2rem;">Logo Usage</h3>
                <div style="background: #f8f9fa; padding: 2rem; border-radius: 12px; margin: 2rem 0;">
                    <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <div style="font-size: 4rem; background: #003366; color: white; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin: 0 auto 1rem;">
                                ${this.config.visual.logo.primary}
                            </div>
                            <div style="font-size: 0.9rem; color: #6c757d;">On Dark Background</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 4rem; background: white; color: #003366; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 2px solid #e9ecef; margin: 0 auto 1rem;">
                                ${this.config.visual.logo.primary}
                            </div>
                            <div style="font-size: 0.9rem; color: #6c757d;">On Light Background</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 4rem; background: #f8f9fa; color: #003366; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin: 0 auto 1rem;">
                                ${this.config.visual.logo.primary}
                            </div>
                            <div style="font-size: 0.9rem; color: #6c757d;">On Neutral Background</div>
                        </div>
                    </div>
                    <div style="margin-top: 2rem; color: #6c757d; font-size: 0.9rem;">
                        <strong>Do:</strong> Use on #003366, #ffffff, or #f8f9fa backgrounds<br>
                        <strong>Don't:</strong> Place on #f37021 or #28a745 backgrounds (action colors)
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render brand block for specific location
     * @param {string} location - 'header', 'footer', 'auth', 'marketing'
     * @returns {string} HTML string
     */
    renderForLocation(location) {
        switch (location) {
            case 'header':
                return this.render('small', { location: 'header' });
            case 'footer':
                return `
                    <div style="text-align: center; padding: 2rem 0; border-top: 1px solid #e9ecef; margin-top: 3rem;">
                        ${this.render('small', { location: 'footer' })}
                        <div style="margin-top: 1rem; font-size: 0.9rem; color: #6c757d;">
                            © ${this.config.identity.established}–${new Date().getFullYear()}, ${this.config.identity.legalName}
                        </div>
                    </div>
                `;
            case 'auth':
                return this.render('medium', { 
                    location: 'auth',
                    currentLevel: 'global' 
                });
            case 'marketing':
                return this.render('full', { location: 'marketing' });
            case 'guidelines':
                return this.renderBrandGuidelines();
            default:
                return this.render('medium', { location });
        }
    }
    
    /**
     * Inject brand block into element
     * @param {HTMLElement} element - Target element
     * @param {string} size - Size variant
     * @param {Object} options - Additional options
     */
    inject(element, size = 'medium', options = {}) {
        if (!element) return;
        
        const html = this.render(size, options);
        element.innerHTML = html;
    }
    
    /**
     * Register web component
     */
    static registerWebComponent() {
        if (!customElements.get('mp-brand-block')) {
            class MPBrandBlock extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.brandBlock = new BrandBlock();
                }
                
                connectedCallback() {
                    const size = this.getAttribute('size') || 'medium';
                    const location = this.getAttribute('location');
                    const country = this.getAttribute('country');
                    const currentLevel = this.getAttribute('current-level');
                    
                    const options = { location, country, currentLevel };
                    this.shadowRoot.innerHTML = this.brandBlock.render(size, options);
                }
                
                static get observedAttributes() {
                    return ['size', 'location', 'country', 'current-level'];
                }
                
                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue !== newValue && this.isConnected) {
                        this.connectedCallback();
                    }
                }
            }
            
            customElements.define('mp-brand-block', MPBrandBlock);
        }
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrandBlock;
} else if (typeof window !== 'undefined') {
    window.BrandBlock = BrandBlock;
    window.brandBlock = new BrandBlock();
    
    // Auto-initialize
    document.addEventListener('DOMContentLoaded', () => {
        BrandBlock.registerWebComponent();
        
        // Auto-inject brand blocks
        document.querySelectorAll('[data-brand-block]').forEach(element => {
            const size = element.dataset.brandSize || 'medium';
            const location = element.dataset.brandLocation;
            const country = element.dataset.brandCountry;
            
            const brandBlock = new BrandBlock();
            brandBlock.inject(element, size, { location, country });
        });
    });
}

// Global brand functions
if (typeof window !== 'undefined') {
    window.renderBrandBlock = function(size, options) {
        const brandBlock = new BrandBlock();
        return brandBlock.render(size, options);
    };
    
    window.showBrandGuidelines = function() {
        const brandBlock = new BrandBlock();
        return brandBlock.renderBrandGuidelines();
    };
}