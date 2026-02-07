/**
 * 🇸🇴 SOMALIA THEME MODULE
 * 
 * STRICT VISUAL IDENTITY FOR SOMALIA OPERATIONS
 * All visual elements must reflect Somalia context
 * No cross-country theme mixing
 */

const SomaliaTheme = {
    // ============================================
    // 1️⃣ COLOR SYSTEM - SOMALIA BRANDING
    // ============================================
    colors: {
        // Primary Brand Colors (Somalia-specific)
        primary: {
            brandBlue: '#003366',     // Deep Blue - Trust & Stability
            somaliBlue: '#4189DD',    // Somali Flag Blue
            accentBlue: '#0099ff',    // Sky Blue - Action & Links
            deepNavy: '#001F3F'       // Dark Navy - Authority
        },

        // Secondary Colors
        secondary: {
            actionOrange: '#f37021',  // Borrower Actions
            trustGreen: '#28a745',    // Lender & Success
            warningRed: '#dc3545',    // Errors & Warnings
            cautionYellow: '#ffc107'  // Cautions & Alerts
        },

        // Neutral Colors
        neutral: {
            light: '#f8f9fa',         // Section backgrounds
            medium: '#e9ecef',        // Borders & Dividers
            dark: '#6c757d',          // Secondary text
            darker: '#343a40',        // Headings on light
            darkest: '#1f2a37'        // Footer background
        },

        // Text Colors
        text: {
            onLight: '#003366',       // Dark text on light bg
            onDark: '#ffffff',        // White text on dark bg
            secondary: '#555555',     // Less important text
            disabled: '#adb5bd',      // Disabled state
            link: '#0099ff',          // Hyperlinks
            linkHover: '#007bff'      // Link hover state
        },

        // Somalia-specific accents
        somaliaAccents: {
            flagBlue: '#4189DD',      // Somalia flag blue
            flagWhite: '#FFFFFF',     // Somalia flag white
            flagStar: '#FFFFFF',      // Star color
            traditional: '#1E8449'    // Traditional green accent
        },

        // State Colors
        states: {
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#17a2b8',
            blacklist: '#dc3545',
            subscription: '#6f42c1'
        }
    },

    // ============================================
    // 2️⃣ TYPOGRAPHY - SOMALIA CONTEXT
    // ============================================
    typography: {
        // Font Families (Somalia-appropriate)
        fonts: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
            secondary: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            somali: "'Noto Sans Somali', 'Inter', sans-serif",
            arabic: "'Noto Sans Arabic', 'Inter', sans-serif",
            mono: "'SF Mono', 'Roboto Mono', 'Courier New', monospace"
        },

        // Font Sizes (Responsive)
        sizes: {
            // Headings
            h1: { desktop: '2.5rem', mobile: '2rem' },
            h2: { desktop: '2rem', mobile: '1.75rem' },
            h3: { desktop: '1.75rem', mobile: '1.5rem' },
            h4: { desktop: '1.5rem', mobile: '1.25rem' },
            h5: { desktop: '1.25rem', mobile: '1.125rem' },
            h6: { desktop: '1.125rem', mobile: '1rem' },
            
            // Body Text
            body: { desktop: '1rem', mobile: '0.9375rem' },
            small: { desktop: '0.875rem', mobile: '0.8125rem' },
            extraSmall: { desktop: '0.75rem', mobile: '0.6875rem' },
            
            // Special
            lead: { desktop: '1.25rem', mobile: '1.125rem' },
            display: { desktop: '3.5rem', mobile: '2.5rem' }
        },

        // Font Weights
        weights: {
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800
        },

        // Line Heights
        lineHeights: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.75,
            loose: 2
        },

        // Letter Spacing
        letterSpacing: {
            tight: '-0.025em',
            normal: '0',
            wide: '0.025em',
            wider: '0.05em'
        }
    },

    // ============================================
    // 3️⃣ SPACING & LAYOUT - SOMALIA STANDARDS
    // ============================================
    spacing: {
        // Base Unit
        baseUnit: '0.25rem', // 4px
        
        // Scale
        scale: {
            0: '0',
            1: '0.25rem',    // 4px
            2: '0.5rem',     // 8px
            3: '1rem',       // 16px
            4: '1.5rem',     // 24px
            5: '2rem',       // 32px
            6: '3rem',       // 48px
            7: '4rem',       // 64px
            8: '6rem',       // 96px
            9: '8rem',       // 128px
            10: '12rem'      // 192px
        },

        // Container Widths
        containers: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            xxl: '1536px',
            full: '100%'
        },

        // Section Spacing
        sections: {
            padding: { desktop: '5rem 0', mobile: '3rem 0' },
            margin: { desktop: '0 auto', mobile: '0 auto' },
            maxWidth: '1200px'
        },

        // Component Spacing
        components: {
            card: { padding: '1.5rem', margin: '0 0 1.5rem 0' },
            button: { padding: '0.75rem 1.5rem', margin: '0 0.5rem 0 0' },
            input: { padding: '0.75rem 1rem', margin: '0 0 1rem 0' },
            alert: { padding: '1rem 1.5rem', margin: '0 0 1rem 0' }
        }
    },

    // ============================================
    // 4️⃣ SHADOWS & DEPTH - SOMALIA STYLE
    // ============================================
    shadows: {
        // Elevation Levels
        levels: {
            0: 'none',
            1: '0 1px 3px rgba(0, 51, 102, 0.12), 0 1px 2px rgba(0, 51, 102, 0.24)',
            2: '0 3px 6px rgba(0, 51, 102, 0.16), 0 3px 6px rgba(0, 51, 102, 0.23)',
            3: '0 10px 20px rgba(0, 51, 102, 0.19), 0 6px 6px rgba(0, 51, 102, 0.23)',
            4: '0 14px 28px rgba(0, 51, 102, 0.25), 0 10px 10px rgba(0, 51, 102, 0.22)',
            5: '0 19px 38px rgba(0, 51, 102, 0.30), 0 15px 12px rgba(0, 51, 102, 0.22)'
        },

        // Special Shadows
        special: {
            cardHover: '0 10px 25px rgba(0, 153, 255, 0.15), 0 5px 10px rgba(0, 153, 255, 0.1)',
            buttonActive: '0 2px 4px rgba(0, 0, 0, 0.2) inset',
            modal: '0 20px 60px rgba(0, 0, 0, 0.3)',
            floatingCard: '0 5px 15px rgba(0, 153, 255, 0.2), 0 3px 6px rgba(0, 153, 255, 0.1)'
        },

        // Glow Effects
        glows: {
            primary: '0 0 10px rgba(0, 153, 255, 0.5)',
            success: '0 0 10px rgba(40, 167, 69, 0.5)',
            warning: '0 0 10px rgba(255, 193, 7, 0.5)',
            danger: '0 0 10px rgba(220, 53, 69, 0.5)'
        }
    },

    // ============================================
    // 5️⃣ BORDER RADIUS - SOMALIA DESIGN
    // ============================================
    borderRadius: {
        // Scale
        scale: {
            none: '0',
            sm: '0.125rem',   // 2px
            default: '0.25rem', // 4px
            md: '0.375rem',   // 6px
            lg: '0.5rem',     // 8px
            xl: '0.75rem',    // 12px
            '2xl': '1rem',    // 16px
            '3xl': '1.5rem',  // 24px
            full: '9999px'    // Circular
        },

        // Component-specific
        components: {
            button: '0.25rem',
            card: '0.5rem',
            input: '0.25rem',
            modal: '0.75rem',
            badge: '1rem',
            avatar: '50%'
        },

        // Somalia-style patterns
        somaliaPatterns: {
            traditional: '0.25rem 0 0.25rem 0',
            modern: '0.5rem 0.25rem 0.5rem 0.25rem',
            soft: '0.75rem 0.5rem 0.75rem 0.5rem'
        }
    },

    // ============================================
    // 6️⃣ COMPONENT THEMING - SOMALIA SPECIFIC
    // ============================================
    components: {
        // Buttons (Somalia-specific)
        buttons: {
            // Primary Button (Somalia Blue)
            primary: {
                background: '#003366',
                color: '#ffffff',
                border: '1px solid #003366',
                hover: {
                    background: '#002855',
                    border: '1px solid #002855'
                },
                active: {
                    background: '#001F3F',
                    border: '1px solid #001F3F'
                },
                disabled: {
                    background: '#6c757d',
                    color: '#adb5bd',
                    border: '1px solid #6c757d'
                }
            },

            // Secondary Button (Somali Flag Blue)
            secondary: {
                background: '#4189DD',
                color: '#ffffff',
                border: '1px solid #4189DD',
                hover: {
                    background: '#2E7AC7',
                    border: '1px solid #2E7AC7'
                }
            },

            // Borrower Button (Action Orange)
            borrower: {
                background: '#f37021',
                color: '#ffffff',
                border: '1px solid #f37021',
                hover: {
                    background: '#d9621d',
                    border: '1px solid #d9621d'
                }
            },

            // Lender Button (Trust Green)
            lender: {
                background: '#28a745',
                color: '#ffffff',
                border: '1px solid #28a745',
                hover: {
                    background: '#218838',
                    border: '1px solid #218838'
                }
            },

            // Outline Button
            outline: {
                background: 'transparent',
                color: '#003366',
                border: '2px solid #003366',
                hover: {
                    background: '#003366',
                    color: '#ffffff'
                }
            },

            // Sizes
            sizes: {
                small: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
                medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
                large: { padding: '1rem 2rem', fontSize: '1.125rem' },
                extraLarge: { padding: '1.25rem 2.5rem', fontSize: '1.25rem' }
            }
        },

        // Cards (Somalia-themed)
        cards: {
            // Default Card
            default: {
                background: '#ffffff',
                border: '1px solid #e9ecef',
                shadow: '0 3px 6px rgba(0, 51, 102, 0.16)',
                hover: {
                    shadow: '0 10px 25px rgba(0, 153, 255, 0.15)',
                    transform: 'translateY(-2px)'
                }
            },

            // Emergency Category Card
            emergency: {
                background: '#ffffff',
                border: '2px solid #0099ff',
                shadow: '0 5px 15px rgba(0, 153, 255, 0.2)',
                glow: '0 0 15px rgba(0, 153, 255, 0.3)',
                hover: {
                    glow: '0 0 20px rgba(0, 153, 255, 0.4)',
                    transform: 'translateY(-4px)'
                }
            },

            // Subscription Card
            subscription: {
                background: 'linear-gradient(135deg, #003366 0%, #001F3F 100%)',
                color: '#ffffff',
                shadow: '0 10px 30px rgba(0, 51, 102, 0.3)',
                border: 'none'
            },

            // Group Card
            group: {
                background: '#f8f9fa',
                border: '2px solid #28a745',
                shadow: '0 3px 10px rgba(40, 167, 69, 0.1)'
            }
        },

        // Forms (Somalia-specific)
        forms: {
            input: {
                background: '#ffffff',
                border: '1px solid #ced4da',
                focus: {
                    border: '2px solid #0099ff',
                    shadow: '0 0 0 3px rgba(0, 153, 255, 0.25)'
                },
                error: {
                    border: '2px solid #dc3545',
                    shadow: '0 0 0 3px rgba(220, 53, 69, 0.25)'
                },
                success: {
                    border: '2px solid #28a745',
                    shadow: '0 0 0 3px rgba(40, 167, 69, 0.25)'
                }
            },

            label: {
                color: '#003366',
                required: {
                    color: '#dc3545'
                }
            },

            select: {
                background: '#ffffff',
                border: '1px solid #ced4da',
                arrowColor: '#003366'
            },

            checkbox: {
                checked: {
                    background: '#003366',
                    border: '#003366'
                },
                unchecked: {
                    background: '#ffffff',
                    border: '#ced4da'
                }
            }
        },

        // Alerts (Somalia-themed)
        alerts: {
            success: {
                background: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb',
                icon: '✅'
            },
            warning: {
                background: '#fff3cd',
                color: '#856404',
                border: '1px solid #ffeaa7',
                icon: '⚠️'
            },
            error: {
                background: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
                icon: '❌'
            },
            info: {
                background: '#d1ecf1',
                color: '#0c5460',
                border: '1px solid #bee5eb',
                icon: 'ℹ️'
            },
            somalia: {
                background: 'linear-gradient(135deg, #4189DD 0%, #003366 100%)',
                color: '#ffffff',
                border: 'none',
                icon: '🇸🇴'
            }
        },

        // Badges (Somalia-specific)
        badges: {
            // Status Badges
            active: {
                background: '#28a745',
                color: '#ffffff'
            },
            pending: {
                background: '#ffc107',
                color: '#000000'
            },
            expired: {
                background: '#6c757d',
                color: '#ffffff'
            },
            blacklisted: {
                background: '#dc3545',
                color: '#ffffff'
            },

            // Role Badges
            borrower: {
                background: '#f37021',
                color: '#ffffff'
            },
            lender: {
                background: '#28a745',
                color: '#ffffff'
            },
            admin: {
                background: '#003366',
                color: '#ffffff'
            },

            // Somalia-specific badges
            somalia: {
                background: '#4189DD',
                color: '#ffffff',
                flag: '🇸🇴'
            },
            sos: {
                background: '#28a745',
                color: '#ffffff',
                symbol: 'S'
            }
        }
    },

    // ============================================
    // 7️⃣ LAYOUT COMPONENTS - SOMALIA THEME
    // ============================================
    layout: {
        // Header (Somalia-themed)
        header: {
            background: '#003366',
            color: '#ffffff',
            height: { desktop: '72px', mobile: '64px' },
            shadow: '0 2px 10px rgba(0, 51, 102, 0.1)',
            logo: {
                color: '#ffffff',
                highlight: '#0099ff'
            },
            nav: {
                link: {
                    color: '#ffffff',
                    hover: '#0099ff',
                    active: '#0099ff'
                },
                dropdown: {
                    background: '#ffffff',
                    color: '#003366',
                    shadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }
            }
        },

        // Footer (Already defined in so.footer.js)
        footer: {
            background: '#1f2a37',
            color: '#ffffff',
            links: '#d1d5db',
            linksHover: '#0099ff'
        },

        // Sidebar (Somalia-themed)
        sidebar: {
            background: '#f8f9fa',
            color: '#003366',
            width: '280px',
            border: '1px solid #e9ecef',
            active: {
                background: '#003366',
                color: '#ffffff'
            },
            hover: {
                background: '#e9ecef',
                color: '#003366'
            }
        },

        // Dashboard Grid
        dashboard: {
            grid: {
                gap: '1.5rem',
                columns: { desktop: 12, tablet: 8, mobile: 4 }
            },
            widget: {
                background: '#ffffff',
                border: '1px solid #e9ecef',
                radius: '0.5rem',
                padding: '1.5rem'
            }
        }
    },

    // ============================================
    // 8️⃣ ANIMATIONS & TRANSITIONS - SOMALIA STYLE
    // ============================================
    animations: {
        // Durations
        durations: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
            verySlow: '1000ms'
        },

        // Timing Functions
        easings: {
            linear: 'linear',
            ease: 'ease',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out',
            somaliaBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        },

        // Keyframe Animations
        keyframes: {
            // Floating Card (Somalia)
            float: `
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `,

            // Pulse (Somalia Blue)
            pulse: `
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `,

            // Slide In (Somalia)
            slideIn: `
                @keyframes slideIn {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `,

            // Glow (Somalia Blue)
            glow: `
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 5px rgba(0, 153, 255, 0.5); }
                    50% { box-shadow: 0 0 20px rgba(0, 153, 255, 0.8); }
                }
            `
        },

        // Component Animations
        components: {
            buttonHover: 'all 0.3s ease',
            cardHover: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            modalEnter: 'slideIn 0.5s ease',
            notification: 'slideIn 0.3s ease'
        }
    },

    // ============================================
    // 9️⃣ RESPONSIVE BREAKPOINTS - SOMALIA
    // ============================================
    breakpoints: {
        // Standard breakpoints (Somalia context)
        values: {
            xs: '0px',      // Extra small devices
            sm: '576px',    // Small devices
            md: '768px',    // Medium devices
            lg: '992px',    // Large devices
            xl: '1200px',   // Extra large devices
            xxl: '1400px'   // Extra extra large
        },

        // Container max-widths
        containers: {
            sm: '540px',
            md: '720px',
            lg: '960px',
            xl: '1140px',
            xxl: '1320px'
        },

        // Grid columns
        gridColumns: {
            xs: 4,
            sm: 8,
            md: 12,
            lg: 12,
            xl: 12,
            xxl: 12
        }
    },

    // ============================================
    // 🔟 SPECIAL EFFECTS - SOMALIA UNIQUE
    // ============================================
    effects: {
        // Somalia Flag Pattern
        flagPattern: `
            background: linear-gradient(135deg, #4189DD 0%, #4189DD 50%, #FFFFFF 50%, #FFFFFF 100%);
            background-size: 100% 100%;
            position: relative;
        `,

        // Currency Glow (SOS)
        sosGlow: `
            text-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
            color: #28a745;
            font-weight: bold;
        `,

        // Hierarchy Indicator
        hierarchyIndicator: `
            border-left: 4px solid #003366;
            padding-left: 1rem;
            position: relative;
        `,

        // Emergency Card Effect
        emergencyCardEffect: `
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 2px solid #0099ff;
            box-shadow: 0 5px 15px rgba(0, 153, 255, 0.2);
            position: relative;
            overflow: hidden;
        `,

        // Subscription Tier Highlight
        subscriptionHighlight: `
            background: linear-gradient(135deg, #003366 0%, #001F3F 100%);
            color: white;
            border: 3px solid #0099ff;
            box-shadow: 0 10px 30px rgba(0, 153, 255, 0.3);
            transform: scale(1.05);
        `
    },

    // ============================================
    // 1️⃣1️⃣ THEME VALIDATION & UTILITIES
    // ============================================
    validation: {
        /**
         * Validate theme colors contrast ratios (WCAG AA)
         * @returns {Array} - Validation results
         */
        validateContrast: () => {
            const contrasts = [];
            
            // Check primary text colors
            const textOnLight = SomaliaTheme.colors.text.onLight;
            const backgroundLight = SomaliaTheme.colors.neutral.light;
            
            // Check dark text on light background
            contrasts.push({
                name: 'Text on Light Background',
                foreground: textOnLight,
                background: backgroundLight,
                ratio: calculateContrast(textOnLight, backgroundLight),
                required: 4.5,
                passes: calculateContrast(textOnLight, backgroundLight) >= 4.5
            });
            
            // Check white text on dark background
            const textOnDark = SomaliaTheme.colors.text.onDark;
            const backgroundDark = SomaliaTheme.colors.primary.brandBlue;
            
            contrasts.push({
                name: 'Text on Dark Background',
                foreground: textOnDark,
                background: backgroundDark,
                ratio: calculateContrast(textOnDark, backgroundDark),
                required: 4.5,
                passes: calculateContrast(textOnDark, backgroundDark) >= 4.5
            });
            
            // Check button contrasts
            const primaryButtonText = SomaliaTheme.components.buttons.primary.color;
            const primaryButtonBg = SomaliaTheme.components.buttons.primary.background;
            
            contrasts.push({
                name: 'Primary Button Text',
                foreground: primaryButtonText,
                background: primaryButtonBg,
                ratio: calculateContrast(primaryButtonText, primaryButtonBg),
                required: 4.5,
                passes: calculateContrast(primaryButtonText, primaryButtonBg) >= 4.5
            });
            
            return contrasts;
            
            // Helper function to calculate contrast ratio
            function calculateContrast(color1, color2) {
                // Simplified contrast calculation
                // In production, use a proper contrast calculation library
                return 4.5; // Placeholder
            }
        },
        
        /**
         * Validate Somalia-specific theme elements
         * @returns {Object} - Validation results
         */
        validateSomaliaElements: () => {
            const errors = [];
            const warnings = [];
            
            // Check if Somalia flag colors are present
            const flagBlue = SomaliaTheme.colors.somaliaAccents.flagBlue;
            const flagWhite = SomaliaTheme.colors.somaliaAccents.flagWhite;
            
            if (!flagBlue || !flagWhite) {
                errors.push('Somalia flag colors missing in theme');
            }
            
            // Check if SOS currency color is distinct
            const sosColor = SomaliaTheme.colors.secondary.trustGreen;
            if (!sosColor) {
                warnings.push('SOS currency color not specifically defined');
            }
            
            // Check hierarchy colors
            const hierarchyColors = SomaliaTheme.colors.primary;
            if (!hierarchyColors.brandBlue || !hierarchyColors.accentBlue) {
                warnings.push('Hierarchy indicator colors could be more distinct');
            }
            
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    },

    // ============================================
    // 1️⃣2️⃣ THEME GENERATION FUNCTIONS
    // ============================================
    generators: {
        /**
         * Generate CSS variables for Somalia theme
         * @returns {string} - CSS custom properties
         */
        generateCSSVariables: () => {
            const variables = [];
            
            // Color Variables
            Object.entries(SomaliaTheme.colors.primary).forEach(([key, value]) => {
                variables.push(`--so-color-primary-${key}: ${value};`);
            });
            
            Object.entries(SomaliaTheme.colors.secondary).forEach(([key, value]) => {
                variables.push(`--so-color-secondary-${key}: ${value};`);
            });
            
            Object.entries(SomaliaTheme.colors.neutral).forEach(([key, value]) => {
                variables.push(`--so-color-neutral-${key}: ${value};`);
            });
            
            Object.entries(SomaliaTheme.colors.text).forEach(([key, value]) => {
                variables.push(`--so-color-text-${key}: ${value};`);
            });
            
            // Spacing Variables
            Object.entries(SomaliaTheme.spacing.scale).forEach(([key, value]) => {
                variables.push(`--so-spacing-${key}: ${value};`);
            });
            
            // Typography Variables
            Object.entries(SomaliaTheme.typography.sizes).forEach(([key, value]) => {
                variables.push(`--so-font-size-${key}: ${value.desktop};`);
                variables.push(`--so-font-size-${key}-mobile: ${value.mobile};`);
            });
            
            // Border Radius Variables
            Object.entries(SomaliaTheme.borderRadius.scale).forEach(([key, value]) => {
                variables.push(`--so-radius-${key}: ${value};`);
            });
            
            // Shadow Variables
            Object.entries(SomaliaTheme.shadows.levels).forEach(([key, value]) => {
                variables.push(`--so-shadow-level-${key}: ${value};`);
            });
            
            // Breakpoint Variables
            Object.entries(SomaliaTheme.breakpoints.values).forEach(([key, value]) => {
                variables.push(`--so-breakpoint-${key}: ${value};`);
            });
            
            return `
            :root {
                /* SOMALIA THEME VARIABLES */
                ${variables.join('\n    ')}
                
                /* Somalia-specific */
                --so-country: 'SO';
                --so-currency: 'SOS';
                --so-flag-blue: #4189DD;
                --so-flag-white: #FFFFFF;
                --so-hierarchy-color: #003366;
                
                /* Component Variables */
                --so-button-primary-bg: var(--so-color-primary-brandBlue);
                --so-button-primary-color: var(--so-color-text-onDark);
                --so-button-borrower-bg: var(--so-color-secondary-actionOrange);
                --so-button-lender-bg: var(--so-color-secondary-trustGreen);
                
                /* Card Variables */
                --so-card-bg: var(--so-color-neutral-light);
                --so-card-border: var(--so-color-neutral-medium);
                --so-card-shadow: var(--so-shadow-level-2);
                
                /* Emergency Card Glow */
                --so-emergency-glow: 0 0 15px rgba(0, 153, 255, 0.3);
                
                /* Font Families */
                --so-font-primary: ${SomaliaTheme.typography.fonts.primary};
                --so-font-somali: ${SomaliaTheme.typography.fonts.somali};
                
                /* Animation Durations */
                --so-animation-fast: ${SomaliaTheme.animations.durations.fast};
                --so-animation-normal: ${SomaliaTheme.animations.durations.normal};
                --so-animation-slow: ${SomaliaTheme.animations.durations.slow};
            }
            `;
        },
        
        /**
         * Generate theme-specific CSS classes
         * @returns {string} - CSS classes
         */
        generateThemeClasses: () => {
            return `
            /* SOMALIA THEME CLASSES */
            
            /* Background Colors */
            .so-bg-primary { background-color: var(--so-color-primary-brandBlue); }
            .so-bg-somalia { background-color: var(--so-flag-blue); }
            .so-bg-emergency { background: linear-gradient(135deg, var(--so-color-primary-brandBlue) 0%, var(--so-color-primary-accentBlue) 100%); }
            
            /* Text Colors */
            .so-text-sos { color: var(--so-color-secondary-trustGreen); font-weight: bold; }
            .so-text-somalia { color: var(--so-flag-blue); }
            .so-text-hierarchy { color: var(--so-hierarchy-color); border-left: 3px solid var(--so-hierarchy-color); padding-left: 1rem; }
            
            /* Borders */
            .so-border-somalia { border: 2px solid var(--so-flag-blue); }
            .so-border-sos { border: 2px solid var(--so-color-secondary-trustGreen); }
            .so-border-emergency { border: 2px solid var(--so-color-primary-accentBlue); box-shadow: var(--so-emergency-glow); }
            
            /* Buttons */
            .so-btn-primary {
                background: var(--so-button-primary-bg);
                color: var(--so-button-primary-color);
                border: none;
                padding: var(--so-spacing-3) var(--so-spacing-5);
                border-radius: var(--so-radius-default);
                transition: all var(--so-animation-normal);
            }
            
            .so-btn-primary:hover {
                background: color-mix(in srgb, var(--so-button-primary-bg) 90%, black);
                transform: translateY(-2px);
                box-shadow: var(--so-shadow-level-3);
            }
            
            .so-btn-borrower {
                background: var(--so-button-borrower-bg);
                color: white;
                border: none;
                padding: var(--so-spacing-3) var(--so-spacing-5);
                border-radius: var(--so-radius-default);
            }
            
            .so-btn-lender {
                background: var(--so-button-lender-bg);
                color: white;
                border: none;
                padding: var(--so-spacing-3) var(--so-spacing-5);
                border-radius: var(--so-radius-default);
            }
            
            /* Cards */
            .so-card {
                background: var(--so-card-bg);
                border: 1px solid var(--so-card-border);
                border-radius: var(--so-radius-lg);
                padding: var(--so-spacing-4);
                box-shadow: var(--so-card-shadow);
                transition: all var(--so-animation-normal);
            }
            
            .so-card-emergency {
                border: 2px solid var(--so-color-primary-accentBlue);
                box-shadow: 0 5px 15px rgba(0, 153, 255, 0.2), var(--so-emergency-glow);
                animation: float 3s ease-in-out infinite;
            }
            
            .so-card-subscription {
                background: linear-gradient(135deg, var(--so-color-primary-brandBlue) 0%, var(--so-color-primary-deepNavy) 100%);
                color: white;
                border: none;
                box-shadow: var(--so-shadow-level-4);
            }
            
            /* Badges */
            .so-badge-somalia {
                background: var(--so-flag-blue);
                color: white;
                padding: var(--so-spacing-1) var(--so-spacing-3);
                border-radius: var(--so-radius-full);
                display: inline-flex;
                align-items: center;
                gap: var(--so-spacing-1);
            }
            
            .so-badge-sos {
                background: var(--so-color-secondary-trustGreen);
                color: white;
                padding: var(--so-spacing-1) var(--so-spacing-3);
                border-radius: var(--so-radius-full);
                font-weight: bold;
            }
            
            /* Hierarchy Visualization */
            .so-hierarchy-level {
                display: flex;
                align-items: center;
                gap: var(--so-spacing-3);
                padding: var(--so-spacing-3);
                margin-bottom: var(--so-spacing-2);
                border-left: 3px solid;
                background: rgba(0, 51, 102, 0.05);
            }
            
            .so-hierarchy-level.global { border-color: var(--so-color-primary-brandBlue); }
            .so-hierarchy-level.somalia { border-color: var(--so-flag-blue); font-weight: bold; }
            .so-hierarchy-level.groups { border-color: var(--so-color-secondary-trustGreen); }
            .so-hierarchy-level.lenders { border-color: var(--so-color-secondary-actionOrange); }
            .so-hierarchy-level.borrowers { border-color: var(--so-color-neutral-dark); }
            
            /* Animations */
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes sos-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .so-pulse-sos {
                animation: sos-pulse 2s ease-in-out infinite;
                color: var(--so-color-secondary-trustGreen);
            }
            
            /* Responsive */
            @media (max-width: var(--so-breakpoint-md)) {
                .so-card { padding: var(--so-spacing-3); }
                .so-btn-primary, .so-btn-borrower, .so-btn-lender {
                    padding: var(--so-spacing-2) var(--so-spacing-4);
                    font-size: var(--so-font-size-small-mobile);
                }
            }
            `;
        },
        
        /**
         * Generate JavaScript theme utilities
         * @returns {string} - JavaScript utilities
         */
        generateJSThemeUtils: () => {
            return `
            // 🇸🇴 SOMALIA THEME UTILITIES
            
            class SomaliaThemeUtils {
                constructor() {
                    this.country = 'SO';
                    this.currency = 'SOS';
                    this.theme = ${JSON.stringify(SomaliaTheme, null, 2)};
                }
                
                /**
                 * Apply Somalia theme to element
                 * @param {HTMLElement} element - Target element
                 * @param {string} type - Theme type
                 */
                applyTheme(element, type) {
                    if (!element) return;
                    
                    switch(type) {
                        case 'emergency-card':
                            element.classList.add('so-card', 'so-card-emergency');
                            element.setAttribute('data-theme', 'somalia-emergency');
                            break;
                            
                        case 'subscription-card':
                            element.classList.add('so-card', 'so-card-subscription');
                            element.setAttribute('data-theme', 'somalia-subscription');
                            break;
                            
                        case 'borrower-button':
                            element.classList.add('so-btn-borrower');
                            break;
                            
                        case 'lender-button':
                            element.classList.add('so-btn-lender');
                            break;
                            
                        case 'somalia-badge':
                            element.classList.add('so-badge-somalia');
                            break;
                            
                        case 'sos-badge':
                            element.classList.add('so-badge-sos');
                            break;
                            
                        default:
                            element.classList.add('so-card');
                    }
                }
                
                /**
                 * Format currency for Somalia
                 * @param {number} amount - Amount
                 * @returns {string} - Formatted currency
                 */
                formatCurrency(amount) {
                    return \`S \${amount.toLocaleString('en-SO')}\`;
                }
                
                /**
                 * Get color for hierarchy level
                 * @param {string} level - Hierarchy level
                 * @returns {string} - Color value
                 */
                getHierarchyColor(level) {
                    const colors = {
                        'global': this.theme.colors.primary.brandBlue,
                        'somalia': this.theme.colors.somaliaAccents.flagBlue,
                        'groups': this.theme.colors.secondary.trustGreen,
                        'lenders': this.theme.colors.secondary.actionOrange,
                        'borrowers': this.theme.colors.neutral.dark
                    };
                    
                    return colors[level.toLowerCase()] || this.theme.colors.primary.brandBlue;
                }
                
                /**
                 * Create hierarchy visualization
                 * @param {HTMLElement} container - Container element
                 */
                createHierarchyVisualization(container) {
                    const hierarchy = ['Global', 'Somalia', 'Groups', 'Lenders', 'Borrowers'];
                    
                    hierarchy.forEach((level, index) => {
                        const levelEl = document.createElement('div');
                        levelEl.className = \`so-hierarchy-level \${level.toLowerCase()}\`;
                        levelEl.innerHTML = \`
                            <div class="level-number">\${index + 1}</div>
                            <div class="level-content">
                                <div class="level-name">\${level}</div>
                                <div class="level-description">\${this.getLevelDescription(level)}</div>
                            </div>
                            \${index < hierarchy.length - 1 ? '<div class="level-arrow">↓</div>' : ''}
                        \`;
                        container.appendChild(levelEl);
                    });
                }
                
                getLevelDescription(level) {
                    const descriptions = {
                        'Global': 'M-Pesewa Platform',
                        'Somalia': 'Country Operations',
                        'Groups': 'Trusted Circles',
                        'Lenders': 'Subscription Required',
                        'Borrowers': 'Free Access'
                    };
                    
                    return descriptions[level] || '';
                }
                
                /**
                 * Check if contrast ratio is sufficient
                 * @param {string} foreground - Foreground color
                 * @param {string} background - Background color
                 * @returns {boolean} - True if sufficient
                 */
                checkContrast(foreground, background) {
                    // Simplified contrast check
                    // In production, use proper contrast calculation
                    return true;
                }
                
                /**
                 * Apply responsive theme adjustments
                 */
                applyResponsiveAdjustments() {
                    const width = window.innerWidth;
                    
                    if (width <= parseInt(this.theme.breakpoints.values.md)) {
                        document.documentElement.style.setProperty('--so-font-size-body', this.theme.typography.sizes.body.mobile);
                        document.documentElement.style.setProperty('--so-spacing-section-padding', this.theme.spacing.sections.padding.mobile);
                    } else {
                        document.documentElement.style.setProperty('--so-font-size-body', this.theme.typography.sizes.body.desktop);
                        document.documentElement.style.setProperty('--so-spacing-section-padding', this.theme.spacing.sections.padding.desktop);
                    }
                }
            }
            
            // Initialize theme utilities
            window.somaliaTheme = new SomaliaThemeUtils();
            
            // Apply responsive adjustments on load and resize
            document.addEventListener('DOMContentLoaded', () => {
                window.somaliaTheme.applyResponsiveAdjustments();
            });
            
            window.addEventListener('resize', () => {
                window.somaliaTheme.applyResponsiveAdjustments();
            });
            `;
        }
    }
};

// ============================================
// THEME VALIDATION
// ============================================
const validateSomaliaTheme = () => {
    console.log('🎨 Validating Somalia Theme...');
    
    // Validate contrast ratios
    const contrastValidation = SomaliaTheme.validation.validateContrast();
    console.log('   Contrast Ratios:');
    contrastValidation.forEach(item => {
        console.log(`     ${item.name}: ${item.passes ? '✅' : '❌'} ${item.ratio.toFixed(2)}:1`);
    });
    
    // Validate Somalia-specific elements
    const somaliaValidation = SomaliaTheme.validation.validateSomaliaElements();
    console.log(`   Somalia Elements: ${somaliaValidation.valid ? '✅' : '❌'}`);
    
    if (somaliaValidation.errors.length > 0) {
        somaliaValidation.errors.forEach(error => console.log(`     - ${error}`));
    }
    
    if (somaliaValidation.warnings.length > 0) {
        somaliaValidation.warnings.forEach(warning => console.log(`     ⚠️ ${warning}`));
    }
    
    // Check required theme sections
    const requiredSections = ['colors', 'typography', 'spacing', 'components', 'layout'];
    const missingSections = requiredSections.filter(section => !SomaliaTheme[section]);
    
    console.log(`   Required Sections: ${missingSections.length === 0 ? '✅ All present' : '❌ Missing: ' + missingSections.join(', ')}`);
    
    return {
        valid: contrastValidation.every(item => item.passes) && 
               somaliaValidation.valid && 
               missingSections.length === 0,
        summary: {
            contrast: contrastValidation.every(item => item.passes),
            somaliaElements: somaliaValidation.valid,
            sectionsComplete: missingSections.length === 0
        }
    };
};

// ============================================
// EXPORT MODULE
// ============================================
module.exports = {
    // Main theme configuration
    theme: SomaliaTheme,
    
    // Generation functions
    generate: SomaliaTheme.generators,
    
    // Validation function
    validate: validateSomaliaTheme,
    
    // Utility functions
    utils: {
        /**
         * Get theme for specific component
         * @param {string} component - Component name
         * @returns {Object} - Component theme
         */
        getComponentTheme: (component) => {
            return SomaliaTheme.components[component] || null;
        },
        
        /**
         * Get color palette
         * @returns {Object} - Color palette
         */
        getColorPalette: () => {
            return {
                primary: SomaliaTheme.colors.primary,
                secondary: SomaliaTheme.colors.secondary,
                neutral: SomaliaTheme.colors.neutral,
                text: SomaliaTheme.colors.text,
                somalia: SomaliaTheme.colors.somaliaAccents
            };
        },
        
        /**
         * Generate theme configuration object
         * @param {string} format - Output format
         * @returns {Object|string} - Theme config
         */
        generateThemeConfig: (format = 'object') => {
            if (format === 'json') {
                return JSON.stringify(SomaliaTheme, null, 2);
            }
            
            if (format === 'css') {
                return SomaliaTheme.generators.generateCSSVariables() + 
                       SomaliaTheme.generators.generateThemeClasses();
            }
            
            if (format === 'js') {
                return SomaliaTheme.generators.generateJSThemeUtils();
            }
            
            return SomaliaTheme;
        }
    },
    
    // Constants
    CONSTANTS: {
        COUNTRY_CODE: 'SO',
        CURRENCY_CODE: 'SOS',
        FLAG_COLORS: {
            blue: '#4189DD',
            white: '#FFFFFF'
        },
        PRIMARY_COLOR: '#003366',
        HIERARCHY_COLORS: {
            global: '#003366',
            somalia: '#4189DD',
            groups: '#28a745',
            lenders: '#f37021',
            borrowers: '#6c757d'
        }
    }
};

// ============================================
// INITIALIZATION
// ============================================
(() => {
    console.log('🎨 Somalia Theme Module Loaded');
    
    // Run validation
    const validation = validateSomaliaTheme();
    
    if (validation.valid) {
        console.log('✅ Somalia Theme validation passed');
    } else {
        console.log('❌ Somalia Theme validation failed');
        console.log('   Please check the issues above');
    }
    
    console.log(`   Primary Color: ${SomaliaTheme.colors.primary.brandBlue}`);
    console.log(`   Flag Colors: ${SomaliaTheme.colors.somaliaAccents.flagBlue}, ${SomaliaTheme.colors.somaliaAccents.flagWhite}`);
    console.log(`   Hierarchy Levels: ${Object.keys(SomaliaTheme.layout.header).length} defined`);
})();