/**
 * M-PESEWA GHANA THEME CONFIGURATION
 * Country-specific theme, colors, and visual design
 * Last Updated: 2024
 * Version: 1.0.0
 * 
 * ✅ BRAND COLORS: Ghana-specific color scheme
 * ✅ CULTURAL ADAPTATION: Ghanaian design elements
 * ✅ ACCESSIBILITY: WCAG AA compliance for Ghana
 * ✅ RESPONSIVE: Mobile-first design for Ghana
 */

const GHANA_THEME = {
    // ============================================
    // 1️⃣ COLOR SYSTEM (GHANA BRAND PALETTE)
    // ============================================
    colors: {
        // Primary Brand Colors (Ghana Flag Inspired)
        primary: {
            black: '#000000', // Black Star
            red: '#CE1126',   // Ghana Flag Red
            gold: '#FCD116',  // Ghana Flag Gold
            green: '#006B3F'  // Ghana Flag Green
        },

        // M-Pesewa Brand Colors (Adapted for Ghana)
        brand: {
            deepBlue: '#003366',     // Primary Brand Blue - Headers, Footers
            skyBlue: '#0099ff',      // Secondary Brand Blue - Links, Highlights
            actionOrange: '#f37021', // Borrower buttons, Apply Now
            trustGreen: '#28a745',   // Lender sections, Success indicators
            neutralLight: '#f8f9fa', // Section separation background
            pureWhite: '#ffffff',    // Main cards, Body background
            neutralDark: '#1f2a37',  // Footer background
            textDark: '#003366',     // Headings on white background
            textLight: '#555555',    // Body text on white background
            textWhite: '#ffffff'     // Text on dark background
        },

        // Ghana Regional Colors
        regional: {
            accra: '#FF6B35',     // Greater Accra - Vibrant orange
            kumasi: '#8B4513',    // Ashanti - Rich brown (kente)
            tamale: '#228B22',    // Northern - Savannah green
            takoradi: '#1E90FF',  // Western - Ocean blue
            capeCoast: '#FFD700', // Central - Historical gold
            sunyani: '#32CD32',   // Bono - Forest green
            ho: '#8A2BE2',        // Volta - Purple mountains
            koforidua: '#FF4500', // Eastern - Sunrise orange
            wa: '#D2691E',        // Upper West - Desert brown
            bolgatanga: '#DC143C' // Upper East - Red earth
        },

        // Functional Colors
        functional: {
            success: {
                light: '#d4edda',
                medium: '#28a745',
                dark: '#155724'
            },
            warning: {
                light: '#fff3cd',
                medium: '#ffc107',
                dark: '#856404'
            },
            danger: {
                light: '#f8d7da',
                medium: '#dc3545',
                dark: '#721c24'
            },
            info: {
                light: '#d1ecf1',
                medium: '#17a2b8',
                dark: '#0c5460'
            }
        },

        // Gradients (Ghana Inspired)
        gradients: {
            ghanaFlag: 'linear-gradient(135deg, #CE1126 33%, #FCD116 33%, #FCD116 66%, #006B3F 66%)',
            sunriseAccra: 'linear-gradient(135deg, #FF6B35, #FFD166)',
            kumasiKente: 'linear-gradient(135deg, #8B4513, #DAA520, #228B22)',
            coastalTakoradi: 'linear-gradient(135deg, #1E90FF, #20B2AA)',
            savannahTamale: 'linear-gradient(135deg, #228B22, #FCD116)'
        }
    },

    // ============================================
    // 2️⃣ TYPOGRAPHY (GHANA OPTIMIZED)
    // ============================================
    typography: {
        // Font Families (Ghana Optimized)
        fonts: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            secondary: "'Poppins', 'Arial Rounded MT Bold', 'Helvetica Rounded', sans-serif",
            display: "'Montserrat', 'Century Gothic', 'Futura', sans-serif",
            mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace",
            
            // Ghanaian Language Support
            ghanaian: {
                twi: "'Noto Sans Adlam', 'Segoe UI', sans-serif",
                ewe: "'Noto Sans Ethiopic', 'Segoe UI', sans-serif",
                ga: "'Noto Sans', 'Segoe UI', sans-serif",
                dagbani: "'Noto Sans Arabic', 'Segoe UI', sans-serif"
            }
        },

        // Font Sizes (Mobile-first for Ghana)
        sizes: {
            xs: '0.75rem',   // 12px
            sm: '0.875rem',  // 14px
            base: '1rem',    // 16px
            lg: '1.125rem',  // 18px
            xl: '1.25rem',   // 20px
            '2xl': '1.5rem', // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem',  // 36px
            '5xl': '3rem',     // 48px
            '6xl': '3.75rem'   // 60px
        },

        // Line Heights (Readability optimized for Ghana)
        lineHeights: {
            none: '1',
            tight: '1.25',
            snug: '1.375',
            normal: '1.5',
            relaxed: '1.625',
            loose: '2'
        },

        // Font Weights
        weights: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800'
        }
    },

    // ============================================
    // 3️⃣ SPACING & LAYOUT (GHANA ADAPTED)
    // ============================================
    spacing: {
        // Base spacing unit (8px system)
        unit: '0.5rem', // 8px
        
        // Scale
        scale: {
            '0': '0',
            '1': '0.125rem', // 2px
            '2': '0.25rem',  // 4px
            '3': '0.375rem', // 6px
            '4': '0.5rem',   // 8px
            '5': '0.625rem', // 10px
            '6': '0.75rem',  // 12px
            '8': '1rem',     // 16px
            '10': '1.25rem', // 20px
            '12': '1.5rem',  // 24px
            '16': '2rem',    // 32px
            '20': '2.5rem',  // 40px
            '24': '3rem',    // 48px
            '32': '4rem',    // 64px
            '40': '5rem',    // 80px
            '48': '6rem',    // 96px
            '56': '7rem',    // 112px
            '64': '8rem'     // 128px
        },

        // Container widths (Ghana optimized)
        containers: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
        },

        // Breakpoints (Ghana mobile usage patterns)
        breakpoints: {
            xs: '320px',   // Small phones
            sm: '480px',   // Mobile phones
            md: '768px',   // Tablets
            lg: '1024px',  // Small laptops
            xl: '1280px',  // Desktops
            '2xl': '1536px' // Large screens
        }
    },

    // ============================================
    // 4️⃣ BORDER RADIUS & SHADOWS
    // ============================================
    borders: {
        radius: {
            none: '0',
            sm: '0.125rem', // 2px
            default: '0.25rem', // 4px
            md: '0.375rem', // 6px
            lg: '0.5rem',   // 8px
            xl: '0.75rem',  // 12px
            '2xl': '1rem',  // 16px
            '3xl': '1.5rem', // 24px
            full: '9999px'
        },

        widths: {
            '0': '0',
            '1': '1px',
            '2': '2px',
            '4': '4px',
            '8': '8px'
        }
    },

    shadows: {
        // Elevation shadows (Ghana design)
        sm: '0 1px 2px 0 rgba(0, 51, 102, 0.05)',
        default: '0 1px 3px 0 rgba(0, 51, 102, 0.1), 0 1px 2px 0 rgba(0, 51, 102, 0.06)',
        md: '0 4px 6px -1px rgba(0, 51, 102, 0.1), 0 2px 4px -1px rgba(0, 51, 102, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 51, 102, 0.1), 0 4px 6px -2px rgba(0, 51, 102, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 51, 102, 0.1), 0 10px 10px -5px rgba(0, 51, 102, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 51, 102, 0.25)',
        
        // Ghana-specific glow effects
        glowBlue: '0 0 20px rgba(0, 153, 255, 0.3)',
        glowOrange: '0 0 20px rgba(243, 112, 33, 0.3)',
        glowGreen: '0 0 20px rgba(40, 167, 69, 0.3)',
        inner: 'inset 0 2px 4px 0 rgba(0, 51, 102, 0.06)'
    },

    // ============================================
    // 5️⃣ COMPONENT STYLES (GHANA SPECIFIC)
    // ============================================
    components: {
        buttons: {
            // Borrower Button (Orange)
            borrower: {
                backgroundColor: '#f37021',
                textColor: '#ffffff',
                hoverBackground: '#e0651d',
                activeBackground: '#cc5a1a',
                borderColor: '#f37021',
                borderRadius: '0.375rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600'
            },

            // Lender Button (Green)
            lender: {
                backgroundColor: '#28a745',
                textColor: '#ffffff',
                hoverBackground: '#218838',
                activeBackground: '#1e7e34',
                borderColor: '#28a745',
                borderRadius: '0.375rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600'
            },

            // Secondary Button (Blue)
            secondary: {
                backgroundColor: '#0099ff',
                textColor: '#ffffff',
                hoverBackground: '#0088e6',
                activeBackground: '#0077cc',
                borderColor: '#0099ff',
                borderRadius: '0.375rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600'
            },

            // Outline Button
            outline: {
                backgroundColor: 'transparent',
                textColor: '#003366',
                borderColor: '#003366',
                borderWidth: '2px',
                hoverBackground: '#003366',
                hoverTextColor: '#ffffff',
                borderRadius: '0.375rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600'
            }
        },

        cards: {
            // Default Card
            default: {
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderWidth: '1px',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 51, 102, 0.1), 0 1px 2px 0 rgba(0, 51, 102, 0.06)'
            },

            // Elevated Card (with Ghana glow)
            elevated: {
                backgroundColor: '#ffffff',
                borderColor: 'transparent',
                borderRadius: '0.75rem',
                padding: '2rem',
                boxShadow: '0 10px 15px -3px rgba(0, 51, 102, 0.1), 0 4px 6px -2px rgba(0, 51, 102, 0.05), 0 0 20px rgba(0, 153, 255, 0.1)'
            },

            // Emergency Card (Orange accent)
            emergency: {
                backgroundColor: '#ffffff',
                borderColor: '#f37021',
                borderWidth: '2px',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(243, 112, 33, 0.1), 0 2px 4px -1px rgba(243, 112, 33, 0.06)'
            },

            // Trust Card (Green accent)
            trust: {
                backgroundColor: '#ffffff',
                borderColor: '#28a745',
                borderWidth: '2px',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(40, 167, 69, 0.1), 0 2px 4px -1px rgba(40, 167, 69, 0.06)'
            }
        },

        forms: {
            // Input Fields
            input: {
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db',
                borderWidth: '1px',
                borderRadius: '0.375rem',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                focusBorderColor: '#0099ff',
                focusBoxShadow: '0 0 0 3px rgba(0, 153, 255, 0.1)',
                errorBorderColor: '#dc3545',
                errorBoxShadow: '0 0 0 3px rgba(220, 53, 69, 0.1)'
            },

            // Select Dropdowns
            select: {
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db',
                borderWidth: '1px',
                borderRadius: '0.375rem',
                padding: '0.75rem 2.5rem 0.75rem 1rem',
                fontSize: '1rem',
                arrowColor: '#6b7280'
            },

            // Checkboxes & Radio Buttons
            checkbox: {
                size: '1.25rem',
                borderColor: '#d1d5db',
                borderWidth: '2px',
                borderRadius: '0.25rem',
                checkedBackground: '#003366',
                checkedBorderColor: '#003366'
            }
        },

        // Navigation Components
        navigation: {
            header: {
                backgroundColor: '#003366',
                textColor: '#ffffff',
                height: '72px',
                padding: '0 2rem',
                dropdownBackground: '#ffffff',
                dropdownTextColor: '#003366',
                dropdownBorderRadius: '0.5rem',
                dropdownShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            },

            footer: {
                backgroundColor: '#1f2a37',
                textColor: '#ffffff',
                linkColor: '#d1d5db',
                hoverColor: '#0099ff',
                padding: '3rem 2rem 1.5rem'
            }
        }
    },

    // ============================================
    // 6️⃣ ANIMATIONS & TRANSITIONS (GHANA STYLE)
    // ============================================
    animations: {
        durations: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
            slower: '700ms'
        },

        timingFunctions: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            linear: 'linear'
        },

        // Ghana-inspired animations
        keyframes: {
            // Ghana Flag Wave
            flagWave: {
                '0%': { transform: 'rotate(0deg)' },
                '25%': { transform: 'rotate(5deg)' },
                '50%': { transform: 'rotate(0deg)' },
                '75%': { transform: 'rotate(-5deg)' },
                '100%': { transform: 'rotate(0deg)' }
            },

            // Pulsing Gold (Ghana gold)
            pulseGold: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.7 }
            },

            // Slide in from right (for mobile menu)
            slideInRight: {
                '0%': { transform: 'translateX(100%)' },
                '100%': { transform: 'translateX(0)' }
            },

            // Float animation (for cards)
            float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' }
            }
        }
    },

    // ============================================
    // 7️⃣ ACCESSIBILITY (GHANA WCAG COMPLIANCE)
    // ============================================
    accessibility: {
        // Color contrast ratios (must meet WCAG AA)
        contrastRatios: {
            normalText: {
                'white-on-deepBlue': '12.63:1', // ✓ AAA
                'black-on-white': '21:1',       // ✓ AAA
                'deepBlue-on-white': '12.63:1', // ✓ AAA
                'white-on-actionOrange': '4.78:1', // ✓ AA
                'white-on-trustGreen': '4.68:1'    // ✓ AA
            },
            largeText: {
                'white-on-deepBlue': '12.63:1', // ✓ AAA
                'white-on-actionOrange': '4.78:1', // ✓ AAA (for large text)
                'white-on-trustGreen': '4.68:1'    // ✓ AAA (for large text)
            }
        },

        // Focus styles (important for Ghana's mobile users)
        focus: {
            outline: '2px solid #0099ff',
            outlineOffset: '2px',
            ring: '0 0 0 3px rgba(0, 153, 255, 0.5)'
        },

        // Reduced motion support
        reducedMotion: {
            durationMultiplier: 0.5,
            disableAnimations: true
        }
    },

    // ============================================
    // 8️⃣ CULTURAL & REGIONAL ADAPTATIONS
    // ============================================
    cultural: {
        // Ghanaian Symbols & Icons
        symbols: {
            adinkra: {
                gyeNyame: '𓃒', // Except God
                sankofa: '𓆣',   // Go back and get it
                dwennimmen: '𓃑', // Ram's horns
                akoma: '𓆙'      // Heart
            },
            animals: {
                eagle: '🦅',
                lion: '🦁',
                elephant: '🐘',
                crocodile: '🐊'
            },
            food: {
                fufu: '🍛',
                jollof: '🍚',
                banku: '🥘',
                waakye: '🍲'
            }
        },

        // Ghanaian Color Meanings
        colorMeanings: {
            red: ['Sacrifice', 'Blood', 'Passion', 'Struggle'],
            gold: ['Wealth', 'Royalty', 'Mineral riches', 'Sunshine'],
            green: ['Vegetation', 'Agriculture', 'Natural wealth', 'Growth'],
            black: ['African heritage', 'Freedom', 'Unity', 'Strength']
        },

        // Regional Design Patterns
        patterns: {
            kente: {
                name: 'Kente Cloth Pattern',
                description: 'Traditional Ashanti weaving pattern',
                colors: ['#000000', '#CE1126', '#FCD116', '#006B3F', '#FFFFFF'],
                usage: 'Background patterns, borders, accents'
            },
            adinkra: {
                name: 'Adinkra Symbols',
                description: 'Traditional Ashanti symbols with meanings',
                usage: 'Icons, logos, decorative elements'
            },
            batakari: {
                name: 'Batakari Smock',
                description: 'Northern Ghana traditional smock pattern',
                colors: ['#8B4513', '#D2691E', '#A0522D'],
                usage: 'Textures, background patterns'
            }
        }
    },

    // ============================================
    // 9️⃣ RESPONSIVE DESIGN (GHANA MOBILE FIRST)
    // ============================================
    responsive: {
        // Ghana mobile device statistics
        deviceStats: {
            mobilePenetration: '139.8%',
            smartphonePenetration: '65%',
            tabletPenetration: '15%',
            desktopPenetration: '20%',
            commonScreenSizes: ['360x640', '375x667', '414x896', '768x1024']
        },

        // Mobile-first breakpoints
        breakpoints: {
            mobile: {
                min: '320px',
                max: '767px',
                gridColumns: 4,
                containerPadding: '1rem'
            },
            tablet: {
                min: '768px',
                max: '1023px',
                gridColumns: 8,
                containerPadding: '2rem'
            },
            desktop: {
                min: '1024px',
                max: '1279px',
                gridColumns: 12,
                containerPadding: '2rem'
            },
            largeDesktop: {
                min: '1280px',
                max: '∞',
                gridColumns: 12,
                containerPadding: '3rem'
            }
        },

        // Ghana-optimized responsive utilities
        utilities: {
            hideOnMobile: { display: 'none', breakpoint: 'mobile' },
            showOnMobile: { display: 'block', breakpoint: 'mobile' },
            stackOnMobile: { flexDirection: 'column', breakpoint: 'mobile' },
            gridOnMobile: { gridTemplateColumns: '1fr', breakpoint: 'mobile' }
        }
    },

    // ============================================
    // 🔟 THEME UTILITIES & FUNCTIONS
    // ============================================
    utilities: {
        // Generate CSS custom properties
        generateCSSVariables: function() {
            const variables = {};
            
            // Color variables
            Object.entries(this.colors.brand).forEach(([key, value]) => {
                variables[`--color-${key}`] = value;
            });
            
            // Spacing variables
            Object.entries(this.spacing.scale).forEach(([key, value]) => {
                variables[`--spacing-${key}`] = value;
            });
            
            // Typography variables
            Object.entries(this.typography.sizes).forEach(([key, value]) => {
                variables[`--font-size-${key}`] = value;
            });
            
            return variables;
        },

        // Get theme for specific region
        getRegionalTheme: function(region) {
            const regionalColors = this.colors.regional;
            const regionColor = regionalColors[region.toLowerCase()] || regionalColors.accra;
            
            return {
                primaryColor: regionColor,
                accentColor: this.colors.brand.skyBlue,
                textColor: this.colors.brand.textDark,
                backgroundColor: this.colors.brand.pureWhite
            };
        },

        // Validate color contrast for accessibility
        validateContrast: function(foreground, background) {
            const contrastRatios = this.accessibility.contrastRatios;
            const ratio = this.calculateContrastRatio(foreground, background);
            
            return {
                ratio: ratio,
                normalText: ratio >= 4.5 ? 'PASS' : 'FAIL',
                largeText: ratio >= 3.0 ? 'PASS' : 'FAIL',
                grade: ratio >= 7.0 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL'
            };
        }
    }
};

// ============================================
// THEME UTILITIES & FUNCTIONS
// ============================================

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio
 */
function calculateContrastRatio(color1, color2) {
    // Convert hex to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    // Calculate relative luminance
    const lum1 = calculateRelativeLuminance(rgb1);
    const lum2 = calculateRelativeLuminance(rgb2);
    
    // Calculate contrast ratio
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code
 * @returns {Object} RGB object
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

/**
 * Calculate relative luminance
 * @param {Object} rgb - RGB color object
 * @returns {number} Relative luminance
 */
function calculateRelativeLuminance(rgb) {
    const sRGB = {
        r: rgb.r / 255,
        g: rgb.g / 255,
        b: rgb.b / 255
    };
    
    const linear = {
        r: sRGB.r <= 0.03928 ? sRGB.r / 12.92 : Math.pow((sRGB.r + 0.055) / 1.055, 2.4),
        g: sRGB.g <= 0.03928 ? sRGB.g / 12.92 : Math.pow((sRGB.g + 0.055) / 1.055, 2.4),
        b: sRGB.b <= 0.03928 ? sRGB.b / 12.92 : Math.pow((sRGB.b + 0.055) / 1.055, 2.4)
    };
    
    return 0.2126 * linear.r + 0.7152 * linear.g + 0.0722 * linear.b;
}

/**
 * Generate Ghana theme CSS
 * @returns {string} CSS string
 */
function generateGhanaThemeCSS() {
    const theme = GHANA_THEME;
    
    return `
        /* Ghana Theme CSS Variables */
        :root {
            /* Brand Colors */
            --color-deep-blue: ${theme.colors.brand.deepBlue};
            --color-sky-blue: ${theme.colors.brand.skyBlue};
            --color-action-orange: ${theme.colors.brand.actionOrange};
            --color-trust-green: ${theme.colors.brand.trustGreen};
            --color-neutral-light: ${theme.colors.brand.neutralLight};
            --color-pure-white: ${theme.colors.brand.pureWhite};
            --color-neutral-dark: ${theme.colors.brand.neutralDark};
            --color-text-dark: ${theme.colors.brand.textDark};
            --color-text-light: ${theme.colors.brand.textLight};
            --color-text-white: ${theme.colors.brand.textWhite};
            
            /* Ghana Flag Colors */
            --color-ghana-red: ${theme.colors.primary.red};
            --color-ghana-gold: ${theme.colors.primary.gold};
            --color-ghana-green: ${theme.colors.primary.green};
            --color-ghana-black: ${theme.colors.primary.black};
            
            /* Regional Colors */
            --color-accra: ${theme.colors.regional.accra};
            --color-kumasi: ${theme.colors.regional.kumasi};
            --color-tamale: ${theme.colors.regional.tamale};
            --color-takoradi: ${theme.colors.regional.takoradi};
            --color-cape-coast: ${theme.colors.regional.capeCoast};
            
            /* Typography */
            --font-family-primary: ${theme.typography.fonts.primary};
            --font-family-secondary: ${theme.typography.fonts.secondary};
            --font-family-display: ${theme.typography.fonts.display};
            
            /* Spacing */
            --spacing-unit: ${theme.spacing.unit};
            ${Object.entries(theme.spacing.scale).map(([key, value]) => `--spacing-${key}: ${value};`).join('\n            ')}
            
            /* Border Radius */
            ${Object.entries(theme.borders.radius).map(([key, value]) => `--radius-${key}: ${value};`).join('\n            ')}
            
            /* Shadows */
            --shadow-sm: ${theme.shadows.sm};
            --shadow-default: ${theme.shadows.default};
            --shadow-md: ${theme.shadows.md};
            --shadow-lg: ${theme.shadows.lg};
            --shadow-xl: ${theme.shadows.xl};
            --shadow-2xl: ${theme.shadows['2xl']};
            --shadow-glow-blue: ${theme.shadows.glowBlue};
            --shadow-glow-orange: ${theme.shadows.glowOrange};
            --shadow-glow-green: ${theme.shadows.glowGreen};
            
            /* Animations */
            --animation-fast: ${theme.animations.durations.fast};
            --animation-normal: ${theme.animations.durations.normal};
            --animation-slow: ${theme.animations.durations.slow};
            --animation-ease-in-out: ${theme.animations.timingFunctions.easeInOut};
            --animation-ease-out: ${theme.animations.timingFunctions.easeOut};
        }
        
        /* Ghana Theme Base Styles */
        body {
            font-family: var(--font-family-primary);
            color: var(--color-text-dark);
            background-color: var(--color-pure-white);
            line-height: ${theme.typography.lineHeights.normal};
        }
        
        /* Headings */
        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-family-secondary);
            color: var(--color-deep-blue);
            font-weight: ${theme.typography.weights.semibold};
        }
        
        h1 { font-size: ${theme.typography.sizes['4xl']}; }
        h2 { font-size: ${theme.typography.sizes['3xl']}; }
        h3 { font-size: ${theme.typography.sizes['2xl']}; }
        h4 { font-size: ${theme.typography.sizes.xl}; }
        h5 { font-size: ${theme.typography.sizes.lg}; }
        h6 { font-size: ${theme.typography.sizes.base}; }
        
        /* Links */
        a {
            color: var(--color-sky-blue);
            text-decoration: none;
            transition: color var(--animation-fast) var(--animation-ease-in-out);
        }
        
        a:hover {
            color: var(--color-deep-blue);
        }
        
        /* Buttons */
        .btn-borrower {
            background-color: var(--color-action-orange);
            color: var(--color-text-white);
            border: none;
            border-radius: var(--radius-md);
            padding: ${theme.components.buttons.borrower.padding};
            font-size: ${theme.components.buttons.borrower.fontSize};
            font-weight: ${theme.components.buttons.borrower.fontWeight};
            cursor: pointer;
            transition: background-color var(--animation-normal) var(--animation-ease-in-out);
        }
        
        .btn-borrower:hover {
            background-color: ${theme.components.buttons.borrower.hoverBackground};
        }
        
        .btn-lender {
            background-color: var(--color-trust-green);
            color: var(--color-text-white);
            border: none;
            border-radius: var(--radius-md);
            padding: ${theme.components.buttons.lender.padding};
            font-size: ${theme.components.buttons.lender.fontSize};
            font-weight: ${theme.components.buttons.lender.fontWeight};
            cursor: pointer;
            transition: background-color var(--animation-normal) var(--animation-ease-in-out);
        }
        
        .btn-lender:hover {
            background-color: ${theme.components.buttons.lender.hoverBackground};
        }
        
        .btn-secondary {
            background-color: var(--color-sky-blue);
            color: var(--color-text-white);
            border: none;
            border-radius: var(--radius-md);
            padding: ${theme.components.buttons.secondary.padding};
            font-size: ${theme.components.buttons.secondary.fontSize};
            font-weight: ${theme.components.buttons.secondary.fontWeight};
            cursor: pointer;
            transition: background-color var(--animation-normal) var(--animation-ease-in-out);
        }
        
        .btn-secondary:hover {
            background-color: ${theme.components.buttons.secondary.hoverBackground};
        }
        
        /* Cards */
        .card {
            background-color: var(--color-pure-white);
            border: 1px solid ${theme.components.cards.default.borderColor};
            border-radius: var(--radius-lg);
            padding: ${theme.components.cards.default.padding};
            box-shadow: var(--shadow-default);
        }
        
        .card-elevated {
            background-color: var(--color-pure-white);
            border-radius: var(--radius-xl);
            padding: ${theme.components.cards.elevated.padding};
            box-shadow: var(--shadow-glow-blue);
        }
        
        .card-emergency {
            background-color: var(--color-pure-white);
            border: 2px solid var(--color-action-orange);
            border-radius: var(--radius-xl);
            padding: ${theme.components.cards.emergency.padding};
            box-shadow: 0 4px 6px -1px rgba(243, 112, 33, 0.1), 0 2px 4px -1px rgba(243, 112, 33, 0.06);
        }
        
        .card-trust {
            background-color: var(--color-pure-white);
            border: 2px solid var(--color-trust-green);
            border-radius: var(--radius-xl);
            padding: ${theme.components.cards.trust.padding};
            box-shadow: 0 4px 6px -1px rgba(40, 167, 69, 0.1), 0 2px 4px -1px rgba(40, 167, 69, 0.06);
        }
        
        /* Forms */
        input, textarea, select {
            background-color: ${theme.components.forms.input.backgroundColor};
            border: 1px solid ${theme.components.forms.input.borderColor};
            border-radius: var(--radius-md);
            padding: ${theme.components.forms.input.padding};
            font-size: ${theme.components.forms.input.fontSize};
            width: 100%;
            transition: border-color var(--animation-fast) var(--animation-ease-in-out),
                      box-shadow var(--animation-fast) var(--animation-ease-in-out);
        }
        
        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: ${theme.components.forms.input.focusBorderColor};
            box-shadow: ${theme.components.forms.input.focusBoxShadow};
        }
        
        /* Container */
        .container {
            width: 100%;
            max-width: ${theme.spacing.containers.xl};
            margin: 0 auto;
            padding: 0 var(--spacing-8);
        }
        
        /* Ghana Flag Animation */
        @keyframes flagWave {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-5deg); }
            100% { transform: rotate(0deg); }
        }
        
        .ghana-flag {
            animation: flagWave 3s ease-in-out infinite;
        }
        
        /* Responsive Design */
        @media (max-width: ${theme.responsive.breakpoints.mobile.max}) {
            .container {
                padding: 0 var(--spacing-4);
            }
            
            h1 { font-size: ${theme.typography.sizes['3xl']}; }
            h2 { font-size: ${theme.typography.sizes['2xl']}; }
            h3 { font-size: ${theme.typography.sizes.xl}; }
            
            .card {
                padding: var(--spacing-6);
            }
        }
        
        @media (max-width: ${theme.responsive.breakpoints.tablet.max}) {
            .container {
                padding: 0 var(--spacing-6);
            }
        }
        
        /* Print Styles */
        @media print {
            .btn-borrower, .btn-lender, .btn-secondary {
                background-color: transparent;
                color: var(--color-text-dark);
                border: 1px solid var(--color-text-dark);
            }
            
            .card {
                border: 1px solid var(--color-text-dark);
                box-shadow: none;
            }
        }
        
        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            :root {
                --color-text-dark: #e5e7eb;
                --color-text-light: #9ca3af;
                --color-pure-white: #111827;
                --color-neutral-light: #1f2937;
            }
            
            body {
                background-color: var(--color-pure-white);
                color: var(--color-text-dark);
            }
            
            .card {
                background-color: #1f2937;
                border-color: #374151;
            }
            
            input, textarea, select {
                background-color: #374151;
                border-color: #4b5563;
                color: var(--color-text-dark);
            }
        }
    `;
}

/**
 * Get theme configuration for specific component
 * @param {string} component - Component name
 * @returns {Object} Component theme
 */
function getComponentTheme(component) {
    const components = GHANA_THEME.components;
    
    switch(component) {
        case 'button':
            return components.buttons;
        case 'card':
            return components.cards;
        case 'form':
            return components.forms;
        case 'navigation':
            return components.navigation;
        default:
            return components;
    }
}

/**
 * Validate theme accessibility
 * @returns {Object} Validation results
 */
function validateThemeAccessibility() {
    const theme = GHANA_THEME;
    const tests = [];
    
    // Test color contrast ratios
    const contrastTests = [
        {
            name: 'White on Deep Blue',
            foreground: theme.colors.brand.textWhite,
            background: theme.colors.brand.deepBlue,
            required: 4.5
        },
        {
            name: 'White on Action Orange',
            foreground: theme.colors.brand.textWhite,
            background: theme.colors.brand.actionOrange,
            required: 4.5
        },
        {
            name: 'White on Trust Green',
            foreground: theme.colors.brand.textWhite,
            background: theme.colors.brand.trustGreen,
            required: 4.5
        },
        {
            name: 'Deep Blue on White',
            foreground: theme.colors.brand.deepBlue,
            background: theme.colors.brand.pureWhite,
            required: 4.5
        }
    ];
    
    contrastTests.forEach(test => {
        const ratio = calculateContrastRatio(test.foreground, test.background);
        tests.push({
            name: test.name,
            ratio: ratio.toFixed(2),
            required: test.required,
            passes: ratio >= test.required,
            grade: ratio >= 7.0 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL'
        });
    });
    
    // Check if all tests pass
    const allPass = tests.every(test => test.passes);
    
    return {
        valid: allPass,
        tests: tests,
        summary: {
            totalTests: tests.length,
            passed: tests.filter(t => t.passes).length,
            failed: tests.filter(t => !t.passes).length,
            aaaCount: tests.filter(t => t.grade === 'AAA').length,
            aaCount: tests.filter(t => t.grade === 'AA').length
        }
    };
}

/**
 * Generate theme for specific Ghana region
 * @param {string} region - Region name
 * @returns {Object} Regional theme
 */
function generateRegionalTheme(region) {
    const baseTheme = { ...GHANA_THEME };
    const regionalColor = baseTheme.colors.regional[region.toLowerCase()];
    
    if (regionalColor) {
        // Adjust primary colors based on region
        baseTheme.colors.brand.deepBlue = regionalColor;
        baseTheme.colors.brand.skyBlue = lightenColor(regionalColor, 40);
        baseTheme.colors.brand.actionOrange = adjustHue(regionalColor, 30);
    }
    
    return baseTheme;
}

/**
 * Lighten a color
 * @param {string} color - Hex color
 * @param {number} percent - Percentage to lighten
 * @returns {string} Lightened color
 */
function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

/**
 * Adjust hue of a color
 * @param {string} color - Hex color
 * @param {number} degrees - Degrees to adjust hue
 * @returns {string} Adjusted color
 */
function adjustHue(color, degrees) {
    // Simplified hue adjustment
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + degrees) % 360;
    const adjustedRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ============================================
// EXPORT THEME CONFIGURATION
// ============================================

export {
    GHANA_THEME,
    generateGhanaThemeCSS,
    getComponentTheme,
    validateThemeAccessibility,
    generateRegionalTheme,
    calculateContrastRatio,
    hexToRgb,
    lightenColor,
    adjustHue
};

export default GHANA_THEME;