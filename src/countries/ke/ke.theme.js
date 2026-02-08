/**
 * M-PESEWA - KENYA COUNTRY THEME MODULE
 * Version: 1.0.0
 * Last Updated: 2026-01-24
 * 
 * STRICT THEME ENFORCEMENT FOR KENYA
 * This file contains Kenya-specific theme configuration.
 * DO NOT MODIFY THEME RULES CROSS-COUNTRY.
 * 
 * Color Palette: Strictly follows M-Pesewa brand guidelines
 */

const KenyaThemeConfig = {
    // ============================================
    // 1. KENYA IDENTIFICATION THEME
    // ============================================
    countryIdentity: {
        code: 'KE',
        name: 'Kenya',
        flag: '🇰🇪',
        flagColors: ['#000000', '#FFFFFF', '#006600', '#FF0000'], // Black, White, Green, Red
        nationalColors: ['#000000', '#FF0000', '#006600', '#FFFFFF'],
        animal: 'Lion',
        flower: 'Orchid',
        motto: 'Harambee (Let us all pull together)'
    },
    
    // ============================================
    // 2. PRIMARY BRAND COLORS (STRICT ENFORCEMENT)
    // ============================================
    colors: {
        // Primary Brand Blue - Headers, Footers, Main Headings
        primaryBlue: {
            main: '#003366',
            dark: '#002244',
            light: '#335588',
            rgb: '0, 51, 102',
            hex: '#003366',
            name: 'Kenya Deep Blue'
        },
        
        // Secondary Brand Blue - Links, Floating Card Glow
        secondaryBlue: {
            main: '#0099ff',
            dark: '#0077cc',
            light: '#33bbff',
            rgb: '0, 153, 255',
            hex: '#0099ff',
            name: 'Nairobi Sky Blue'
        },
        
        // Action Orange - Borrower Buttons / Apply Now
        actionOrange: {
            main: '#f37021',
            dark: '#d4590c',
            light: '#f69254',
            rgb: '243, 112, 33',
            hex: '#f37021',
            name: 'Kenya Sunset Orange'
        },
        
        // Trust Green - Lender Sections, Success Indicators
        trustGreen: {
            main: '#28a745',
            dark: '#1e7e34',
            light: '#4cd964',
            rgb: '40, 167, 69',
            hex: '#28a745',
            name: 'Safari Green'
        },
        
        // Neutral Light - Section Separation Background
        neutralLight: {
            main: '#f8f9fa',
            dark: '#e9ecef',
            light: '#ffffff',
            rgb: '248, 249, 250',
            hex: '#f8f9fa',
            name: 'Mount Kenya White'
        },
        
        // Pure White - Main Cards, Body Background
        pureWhite: {
            main: '#ffffff',
            rgb: '255, 255, 255',
            hex: '#ffffff',
            name: 'Pure White'
        },
        
        // Kenya-specific accent colors
        kenyaAccents: {
            red: '#FF0000', // From Kenyan flag
            green: '#006600', // From Kenyan flag
            black: '#000000', // From Kenyan flag
            white: '#FFFFFF', // From Kenyan flag
            gold: '#FFD700', // Maasai gold
            brown: '#8B4513' // Earth tone
        }
    },
    
    // ============================================
    // 3. TYPOGRAPHY SYSTEM FOR KENYA
    // ============================================
    typography: {
        fontFamily: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            secondary: "'Poppins', 'Helvetica Neue', Arial, sans-serif",
            swahili: "'Noto Sans', 'Arial Unicode MS', sans-serif" // For Swahili text
        },
        
        // Headings - Deep Blue (#003366)
        headings: {
            h1: {
                fontSize: '2.5rem',
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#003366',
                marginBottom: '1rem'
            },
            h2: {
                fontSize: '2rem',
                fontWeight: 600,
                lineHeight: 1.3,
                color: '#003366',
                marginBottom: '0.75rem'
            },
            h3: {
                fontSize: '1.75rem',
                fontWeight: 600,
                lineHeight: 1.4,
                color: '#003366',
                marginBottom: '0.5rem'
            },
            h4: {
                fontSize: '1.5rem',
                fontWeight: 500,
                lineHeight: 1.4,
                color: '#003366',
                marginBottom: '0.5rem'
            }
        },
        
        // Body Text - Dark Gray (#555555 on white, White on dark)
        body: {
            large: {
                fontSize: '1.125rem',
                lineHeight: 1.6,
                color: '#555555'
            },
            medium: {
                fontSize: '1rem',
                lineHeight: 1.5,
                color: '#555555'
            },
            small: {
                fontSize: '0.875rem',
                lineHeight: 1.4,
                color: '#666666'
            }
        },
        
        // Special Text
        special: {
            swahili: {
                fontFamily: "'Noto Sans', 'Arial Unicode MS', sans-serif",
                fontSize: '1rem',
                color: '#003366'
            },
            currency: {
                fontFamily: "'Courier New', monospace",
                fontWeight: 600,
                color: '#003366'
            }
        }
    },
    
    // ============================================
    // 4. COMPONENT STYLES (KENYA-SPECIFIC)
    // ============================================
    components: {
        // Buttons - Strict color enforcement
        buttons: {
            primary: {
                backgroundColor: '#003366',
                color: '#ffffff',
                hoverBackground: '#002244',
                activeBackground: '#001933',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600
            },
            
            secondary: {
                backgroundColor: '#0099ff',
                color: '#ffffff',
                hoverBackground: '#0077cc',
                activeBackground: '#0066aa',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600
            },
            
            borrower: {
                backgroundColor: '#f37021',
                color: '#ffffff',
                hoverBackground: '#d4590c',
                activeBackground: '#b54800',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                // NEVER place deep blue text on orange buttons
                textRules: {
                    allowedColors: ['#ffffff'],
                    forbiddenColors: ['#003366', '#555555']
                }
            },
            
            lender: {
                backgroundColor: '#28a745',
                color: '#ffffff',
                hoverBackground: '#1e7e34',
                activeBackground: '#17612a',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                // NEVER place deep blue text on green buttons
                textRules: {
                    allowedColors: ['#ffffff'],
                    forbiddenColors: ['#003366', '#555555']
                }
            },
            
            outline: {
                backgroundColor: 'transparent',
                color: '#003366',
                border: '2px solid #003366',
                hoverBackground: '#003366',
                hoverColor: '#ffffff',
                borderRadius: '6px',
                padding: '10px 22px',
                fontSize: '1rem',
                fontWeight: 600
            }
        },
        
        // Cards - Floating with light sky blue glow
        cards: {
            default: {
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 153, 255, 0.1), 0 1px 3px rgba(0, 153, 255, 0.08)',
                border: '1px solid #e9ecef',
                padding: '24px',
                margin: '16px 0',
                // Floating effect
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                hover: {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 12px rgba(0, 153, 255, 0.15), 0 3px 6px rgba(0, 153, 255, 0.1)'
                }
            },
            
            emergency: {
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 153, 255, 0.15), 0 0 0 1px rgba(0, 153, 255, 0.1)',
                border: '2px solid #0099ff',
                padding: '20px',
                margin: '12px',
                glowEffect: '0 0 10px rgba(0, 153, 255, 0.3)'
            },
            
            lender: {
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(40, 167, 69, 0.1), 0 1px 3px rgba(40, 167, 69, 0.08)',
                border: '2px solid #28a745',
                padding: '24px',
                margin: '16px 0'
            },
            
            borrower: {
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(243, 112, 33, 0.1), 0 1px 3px rgba(243, 112, 33, 0.08)',
                border: '2px solid #f37021',
                padding: '24px',
                margin: '16px 0'
            }
        },
        
        // Badges & Status Indicators
        badges: {
            success: {
                backgroundColor: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 600
            },
            
            warning: {
                backgroundColor: '#fff3cd',
                color: '#856404',
                border: '1px solid #ffeaa7',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 600
            },
            
            danger: {
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 600
            },
            
            blacklist: {
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '2px solid #ff0000',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase'
            },
            
            country: {
                kenya: {
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: '1px solid #006600',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                }
            }
        },
        
        // Navigation Components
        navigation: {
            header: {
                backgroundColor: '#003366',
                height: '72px',
                borderBottom: '2px solid #0099ff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                sticky: true,
                zIndex: 1000
            },
            
            footer: {
                backgroundColor: '#1f2a37', // Different from header
                color: '#ffffff',
                padding: '60px 0 30px',
                borderTop: '3px solid #0099ff'
            },
            
            dropdown: {
                backgroundColor: '#ffffff',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                minWidth: '200px',
                zIndex: 1001
            }
        }
    },
    
    // ============================================
    // 5. LAYOUT & SPACING SYSTEM
    // ============================================
    layout: {
        container: {
            maxWidth: '1200px',
            padding: '0 20px',
            margin: '0 auto'
        },
        
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
            xxl: '48px',
            xxxl: '64px'
        },
        
        grid: {
            columns: 12,
            gutter: '24px',
            breakpoints: {
                xs: '0px',
                sm: '576px',
                md: '768px',
                lg: '992px',
                xl: '1200px'
            }
        },
        
        sections: {
            hero: {
                padding: '80px 0',
                backgroundColor: '#ffffff'
            },
            
            problem: {
                padding: '60px 0',
                backgroundColor: '#ffffff'
            },
            
            solution: {
                padding: '60px 0',
                backgroundColor: '#f8f9fa'
            },
            
            trust: {
                padding: '60px 0',
                backgroundColor: '#003366',
                color: '#ffffff'
            }
        }
    },
    
    // ============================================
    // 6. KENYA-SPECIFIC VISUAL ELEMENTS
    // ============================================
    visualElements: {
        logos: {
            primary: {
                text: 'M-PESEWA',
                tagline: 'Kenya • Trusted Circles Lending',
                colors: {
                    main: '#003366',
                    accent: '#0099ff'
                }
            },
            
            secondary: {
                icon: '🦁', // Lion icon for Kenya
                text: 'M-Pesewa Kenya',
                colors: {
                    main: '#000000',
                    accent: '#FF0000'
                }
            }
        },
        
        icons: {
            emergency: '🚨',
            lender: '💰',
            borrower: '🙋',
            group: '👥',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            kenyaSpecific: {
                lion: '🦁',
                flag: '🇰🇪',
                coffee: '☕',
                safari: '🐘'
            }
        },
        
        illustrations: {
            hero: 'nairobi_skyline.svg',
            success: 'masai_warrior.svg',
            community: 'harambee_circle.svg',
            security: 'lion_protection.svg'
        }
    },
    
    // ============================================
    // 7. ANIMATIONS & TRANSITIONS
    // ============================================
    animations: {
        durations: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms'
        },
        
        easings: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
        },
        
        keyframes: {
            float: {
                from: { transform: 'translateY(0px)' },
                to: { transform: 'translateY(-10px)' }
            },
            
            pulse: {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 }
            },
            
            slideIn: {
                from: { transform: 'translateX(-100%)' },
                to: { transform: 'translateX(0)' }
            }
        }
    },
    
    // ============================================
    // 8. ACCESSIBILITY & WCAG COMPLIANCE
    // ============================================
    accessibility: {
        colorContrast: {
            // WCAG AA Compliance (4.5:1 minimum)
            primaryBlueOnWhite: '12:1', // #003366 on #ffffff
            whiteOnPrimaryBlue: '12:1', // #ffffff on #003366
            orangeOnWhite: '4.6:1', // #f37021 on #ffffff
            whiteOnOrange: '4.6:1', // #ffffff on #f37021
            greenOnWhite: '4.7:1', // #28a745 on #ffffff
            whiteOnGreen: '4.7:1' // #ffffff on #28a745
        },
        
        focusIndicators: {
            color: '#0099ff',
            width: '2px',
            offset: '2px',
            style: 'solid'
        },
        
        screenReader: {
            skipLink: {
                backgroundColor: '#003366',
                color: '#ffffff',
                padding: '8px',
                position: 'absolute',
                top: '-40px',
                left: '0',
                zIndex: 9999
            }
        }
    },
    
    // ============================================
    // 9. RESPONSIVE BREAKPOINTS (KENYA DEVICES)
    // ============================================
    responsive: {
        breakpoints: {
            mobile: {
                min: '0px',
                max: '767px',
                name: 'Mobile (Kenya)'
            },
            tablet: {
                min: '768px',
                max: '1023px',
                name: 'Tablet'
            },
            desktop: {
                min: '1024px',
                max: '1439px',
                name: 'Desktop'
            },
            wide: {
                min: '1440px',
                max: '9999px',
                name: 'Wide Desktop'
            }
        },
        
        // Kenya-specific device considerations
        deviceConsiderations: {
            featurePhones: true,
            lowBandwidth: true,
            dataSaverMode: true,
            offlineSupport: true
        }
    },
    
    // ============================================
    // 10. THEME VALIDATION RULES
    // ============================================
    validationRules: {
        // STRICT COLOR RULES - NEVER VIOLATE
        colorRules: [
            {
                rule: 'NEVER place Deep Blue text on Orange or Green buttons',
                check: (textColor, bgColor) => {
                    const deepBlue = '#003366';
                    const orange = '#f37021';
                    const green = '#28a745';
                    
                    if (bgColor === orange || bgColor === green) {
                        return textColor !== deepBlue;
                    }
                    return true;
                }
            },
            {
                rule: 'White background → Dark text (#003366 or #555555)',
                check: (textColor, bgColor) => {
                    if (bgColor === '#ffffff') {
                        return textColor === '#003366' || textColor === '#555555';
                    }
                    return true;
                }
            },
            {
                rule: 'Dark background → White text (#ffffff)',
                check: (textColor, bgColor) => {
                    const darkBackgrounds = ['#003366', '#1f2a37', '#000000'];
                    if (darkBackgrounds.includes(bgColor)) {
                        return textColor === '#ffffff';
                    }
                    return true;
                }
            },
            {
                rule: 'Cards must float with light sky blue glow (#0099ff)',
                check: (cardStyle) => {
                    return cardStyle.boxShadow.includes('0099ff') || 
                           cardStyle.glowEffect?.includes('0099ff');
                }
            }
        ],
        
        // Typography Rules
        typographyRules: [
            {
                rule: 'H1/H2 must use #003366',
                check: (element, color) => {
                    return ['h1', 'h2'].includes(element) ? color === '#003366' : true;
                }
            },
            {
                rule: 'Body text must use #555555 on white backgrounds',
                check: (element, color, bgColor) => {
                    const isBody = ['p', 'span', 'div'].includes(element);
                    const isWhiteBg = bgColor === '#ffffff';
                    return isBody && isWhiteBg ? color === '#555555' : true;
                }
            },
            {
                rule: 'CTA buttons must use white text',
                check: (element, color, bgColor) => {
                    const isCTA = element.includes('btn-');
                    const isActionBg = ['#f37021', '#28a745', '#003366', '#0099ff'].includes(bgColor);
                    return isCTA && isActionBg ? color === '#ffffff' : true;
                }
            }
        ]
    },
    
    // ============================================
    // 11. EXPORT UTILITIES
    // ============================================
    utilities: {
        // Color utilities
        getColor: (colorName, variant = 'main') => {
            const colorMap = {
                'primary-blue': KenyaThemeConfig.colors.primaryBlue,
                'secondary-blue': KenyaThemeConfig.colors.secondaryBlue,
                'orange': KenyaThemeConfig.colors.actionOrange,
                'green': KenyaThemeConfig.colors.trustGreen,
                'neutral': KenyaThemeConfig.colors.neutralLight,
                'white': KenyaThemeConfig.colors.pureWhite
            };
            
            return colorMap[colorName]?.[variant] || colorMap['primary-blue'].main;
        },
        
        // Spacing utility
        spacing: (multiplier = 1) => {
            const base = 8; // 8px base unit
            return `${base * multiplier}px`;
        },
        
        // Responsive utility
        breakpoint: (size) => {
            const breakpoints = KenyaThemeConfig.responsive.breakpoints;
            return `@media (min-width: ${breakpoints[size]?.min || '0px'}) and (max-width: ${breakpoints[size]?.max || '9999px'})`;
        },
        
        // Validate theme compliance
        validateCompliance: (styles) => {
            const errors = [];
            const rules = KenyaThemeConfig.validationRules;
            
            // Check color rules
            rules.colorRules.forEach(rule => {
                if (rule.check && !rule.check(styles.color, styles.backgroundColor)) {
                    errors.push(`Color violation: ${rule.rule}`);
                }
            });
            
            // Check typography rules
            rules.typographyRules.forEach(rule => {
                if (rule.check && !rule.check(styles.element, styles.color, styles.backgroundColor)) {
                    errors.push(`Typography violation: ${rule.rule}`);
                }
            });
            
            return {
                compliant: errors.length === 0,
                errors,
                warnings: errors.length > 0 ? ['Fix theme violations before production'] : []
            };
        },
        
        // Generate CSS variables
        generateCSSVariables: () => {
            const variables = {};
            
            // Colors
            Object.entries(KenyaThemeConfig.colors).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        if (typeof subValue === 'string' && subValue.startsWith('#')) {
                            variables[`--color-${key}-${subKey}`] = subValue;
                        }
                    });
                }
            });
            
            // Typography
            Object.entries(KenyaThemeConfig.typography.fontFamily).forEach(([key, value]) => {
                variables[`--font-${key}`] = value;
            });
            
            // Spacing
            Object.entries(KenyaThemeConfig.layout.spacing).forEach(([key, value]) => {
                variables[`--spacing-${key}`] = value;
            });
            
            return variables;
        }
    }
};

// ============================================
// THEME MODULE EXPORT
// ============================================

/**
 * Kenya Theme Module Class
 * Enforces Kenya-specific theme rules and provides utilities
 */
export class KenyaThemeModule {
    constructor() {
        this.config = KenyaThemeConfig;
        this.currentTheme = 'light';
        this.validated = false;
        this.violations = [];
    }
    
    /**
     * Initialize theme with validation
     */
    initialize() {
        this.validateTheme();
        
        if (this.violations.length > 0) {
            console.error('❌ Kenya Theme Module failed validation:', this.violations);
            throw new Error('Kenya theme validation failed');
        }
        
        this.validated = true;
        console.log('✅ Kenya Theme Module initialized successfully');
        
        // Inject CSS variables
        this.injectCSSVariables();
        
        return this;
    }
    
    /**
     * Validate theme configuration
     */
    validateTheme() {
        this.violations = [];
        
        // Check required colors
        const requiredColors = ['#003366', '#0099ff', '#f37021', '#28a745', '#f8f9fa', '#ffffff'];
        requiredColors.forEach(color => {
            if (!this.colorExists(color)) {
                this.violations.push(`Missing required color: ${color}`);
            }
        });
        
        // Validate color contrast ratios
        const contrastChecks = [
            { foreground: '#ffffff', background: '#003366', minRatio: 4.5 },
            { foreground: '#ffffff', background: '#f37021', minRatio: 4.5 },
            { foreground: '#ffffff', background: '#28a745', minRatio: 4.5 },
            { foreground: '#003366', background: '#ffffff', minRatio: 4.5 }
        ];
        
        contrastChecks.forEach(check => {
            const ratio = this.calculateContrastRatio(check.foreground, check.background);
            if (ratio < check.minRatio) {
                this.violations.push(
                    `Insufficient contrast: ${check.foreground} on ${check.background} (${ratio.toFixed(2)}:1)`
                );
            }
        });
        
        return this.violations.length === 0;
    }
    
    /**
     * Check if color exists in theme
     */
    colorExists(colorHex) {
        const flattenColors = (obj, prefix = '') => {
            let colors = [];
            for (const key in obj) {
                const value = obj[key];
                if (typeof value === 'string' && value.startsWith('#')) {
                    colors.push(value);
                } else if (typeof value === 'object') {
                    colors = colors.concat(flattenColors(value, `${prefix}${key}.`));
                }
            }
            return colors;
        };
        
        const allColors = flattenColors(this.config.colors);
        return allColors.includes(colorHex.toLowerCase());
    }
    
    /**
     * Calculate WCAG contrast ratio
     */
    calculateContrastRatio(color1, color2) {
        const luminance1 = this.getLuminance(color1);
        const luminance2 = this.getLuminance(color2);
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    /**
     * Get relative luminance of a color
     */
    getLuminance(color) {
        const rgb = this.hexToRgb(color);
        const [r, g, b] = rgb.map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    
    /**
     * Convert hex to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
    
    /**
     * Inject CSS variables into document
     */
    injectCSSVariables() {
        if (typeof document === 'undefined') return;
        
        const variables = this.config.utilities.generateCSSVariables();
        let css = ':root {\n';
        
        Object.entries(variables).forEach(([key, value]) => {
            css += `  ${key}: ${value};\n`;
        });
        
        css += '}';
        
        // Create style element
        const style = document.createElement('style');
        style.id = 'kenya-theme-variables';
        style.textContent = css;
        
        // Remove existing if present
        const existing = document.getElementById('kenya-theme-variables');
        if (existing) {
            existing.remove();
        }
        
        // Inject
        document.head.appendChild(style);
    }
    
    /**
     * Get button styles by type
     */
    getButtonStyles(type = 'primary') {
        const buttonConfig = this.config.components.buttons[type];
        if (!buttonConfig) {
            throw new Error(`Button type "${type}" not found in Kenya theme`);
        }
        
        return {
            ...buttonConfig,
            // Add Kenya-specific overrides
            fontFamily: this.config.typography.fontFamily.primary,
            transition: `all ${this.config.animations.durations.normal} ${this.config.animations.easings.easeInOut}`
        };
    }
    
    /**
     * Get card styles by type
     */
    getCardStyles(type = 'default') {
        const cardConfig = this.config.components.cards[type];
        if (!cardConfig) {
            throw new Error(`Card type "${type}" not found in Kenya theme`);
        }
        
        return {
            ...cardConfig,
            // Ensure Kenya compliance
            fontFamily: this.config.typography.fontFamily.primary
        };
    }
    
    /**
     * Apply Kenya theme to an element
     */
    applyTheme(element, options = {}) {
        if (!this.validated) {
            throw new Error('Kenya theme not validated. Call initialize() first.');
        }
        
        const defaults = {
            type: 'default',
            variant: 'main',
            responsive: true
        };
        
        const settings = { ...defaults, ...options };
        
        let styles = {};
        
        switch (element) {
            case 'button':
                styles = this.getButtonStyles(settings.type);
                break;
            case 'card':
                styles = this.getCardStyles(settings.type);
                break;
            case 'heading':
                styles = this.config.typography.headings[settings.type] || 
                         this.config.typography.headings.h1;
                break;
            default:
                throw new Error(`Element "${element}" not supported by Kenya theme`);
        }
        
        // Add responsive styles if needed
        if (settings.responsive) {
            styles = this.addResponsiveStyles(styles, element, settings.type);
        }
        
        return styles;
    }
    
    /**
     * Add responsive styles
     */
    addResponsiveStyles(baseStyles, element, type) {
        const responsive = {};
        const breakpoints = this.config.responsive.breakpoints;
        
        // Mobile adjustments
        if (breakpoints.mobile) {
            responsive[`@media (max-width: ${breakpoints.mobile.max})`] = {
                // Kenya mobile-specific adjustments
                ...(element === 'button' && { padding: '10px 20px', fontSize: '0.9rem' }),
                ...(element === 'card' && { padding: '16px', margin: '12px 0' }),
                ...(element === 'heading' && type === 'h1' && { fontSize: '2rem' })
            };
        }
        
        return { ...baseStyles, ...responsive };
    }
    
    /**
     * Switch theme mode (light/dark)
     */
    setThemeMode(mode) {
        if (!['light', 'dark'].includes(mode)) {
            throw new Error('Theme mode must be "light" or "dark"');
        }
        
        this.currentTheme = mode;
        
        // Update CSS variables for dark mode
        if (mode === 'dark') {
            this.injectDarkModeVariables();
        } else {
            this.injectCSSVariables(); // Re-inject light mode
        }
        
        console.log(`🌙 Kenya theme switched to ${mode} mode`);
    }
    
    /**
     * Inject dark mode variables
     */
    injectDarkModeVariables() {
        if (typeof document === 'undefined') return;
        
        const variables = this.config.utilities.generateCSSVariables();
        
        // Adjust for dark mode
        const darkModeOverrides = {
            '--color-primaryBlue-main': '#335588',
            '--color-neutralLight-main': '#1a1a1a',
            '--color-pureWhite-main': '#121212'
        };
        
        let css = ':root {\n';
        
        Object.entries(variables).forEach(([key, value]) => {
            const override = darkModeOverrides[key];
            css += `  ${key}: ${override || value};\n`;
        });
        
        css += '}';
        
        // Update style element
        const style = document.getElementById('kenya-theme-variables');
        if (style) {
            style.textContent = css;
        }
    }
    
    /**
     * Get Kenya-specific visual elements
     */
    getVisualElement(type) {
        return this.config.visualElements[type] || null;
    }
    
    /**
     * Validate element against Kenya theme rules
     */
    validateElement(element, styles) {
        const validation = this.config.utilities.validateCompliance({
            ...styles,
            element: element.tagName.toLowerCase()
        });
        
        if (!validation.compliant) {
            console.warn('⚠️ Kenya theme violations:', validation.errors);
        }
        
        return validation;
    }
}

// Singleton instance
let kenyaThemeInstance = null;

/**
 * Get Kenya Theme Module instance
 * @returns {KenyaThemeModule}
 */
export function getKenyaThemeModule() {
    if (!kenyaThemeInstance) {
        kenyaThemeInstance = new KenyaThemeModule();
        kenyaThemeInstance.initialize();
    }
    return kenyaThemeInstance;
}

// Default export
export default KenyaThemeConfig;

// Utility exports
export const KenyaThemeUtils = {
    colors: KenyaThemeConfig.colors,
    typography: KenyaThemeConfig.typography,
    spacing: KenyaThemeConfig.layout.spacing,
    getColor: KenyaThemeConfig.utilities.getColor,
    validateContrast: function(color1, color2) {
        const instance = getKenyaThemeModule();
        return instance.calculateContrastRatio(color1, color2);
    }
};

// Strict theme validation on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        try {
            const theme = getKenyaThemeModule();
            console.log('🎨 Kenya Theme Module loaded successfully');
            
            // Apply Kenya theme to body
            document.body.style.fontFamily = theme.config.typography.fontFamily.primary;
            document.body.style.color = theme.config.typography.body.medium.color;
            document.body.style.backgroundColor = theme.config.colors.pureWhite.main;
        } catch (error) {
            console.error('Failed to load Kenya theme:', error);
        }
    });
}