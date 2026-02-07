/**
 * M-PESEWA RWANDA THEME CONFIGURATION
 * Country-specific theme with Rwandan design elements
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const RwandaTheme = {
    // ============================================
    // 1️⃣ BRAND IDENTITY & COLORS
    // ============================================
    brand: {
        name: "M-Pesewa Rwanda",
        tagline: "Urwego rwo kugurizanya mu Rwanda",
        tagline_en: "The Trusted Lending Platform in Rwanda",
        
        logo: {
            light: "assets/images/rwanda/logo-light.png",
            dark: "assets/images/rwanda/logo-dark.png",
            icon: "assets/images/rwanda/favicon.ico",
            sizes: {
                small: "40x40",
                medium: "80x80",
                large: "160x160"
            }
        },
        
        // Primary brand colors (Rwanda flag inspired)
        colors: {
            primary: {
                // Deep Blue - Trust & Stability
                main: "#003366",
                light: "#336699",
                dark: "#002244",
                contrast: "#ffffff"
            },
            secondary: {
                // Sky Blue - Hope & Progress
                main: "#0099ff",
                light: "#33bbff",
                dark: "#0077cc",
                contrast: "#ffffff"
            },
            accent: {
                // Yellow - Sunshine & Prosperity
                main: "#f9c80e",
                light: "#fadf6d",
                dark: "#c7a00b",
                contrast: "#003366"
            },
            success: {
                // Green - Growth & Success
                main: "#28a745",
                light: "#5cb85c",
                dark: "#1e7e34",
                contrast: "#ffffff"
            },
            warning: {
                // Orange - Caution & Action
                main: "#f37021",
                light: "#f5924f",
                dark: "#c2591a",
                contrast: "#ffffff"
            },
            error: {
                // Red - Danger & Attention
                main: "#dc3545",
                light: "#e57373",
                dark: "#b71c1c",
                contrast: "#ffffff"
            },
            neutral: {
                // Neutral colors for UI
                background: "#f8f9fa",
                surface: "#ffffff",
                border: "#dee2e6",
                text: {
                    primary: "#212529",
                    secondary: "#6c757d",
                    disabled: "#adb5bd"
                }
            }
        }
    },

    // ============================================
    // 2️⃣ TYPOGRAPHY SYSTEM
    // ============================================
    typography: {
        fontFamily: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
            secondary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
            kinyarwanda: "'Noto Sans', 'Segoe UI', sans-serif"
        },
        
        scale: {
            h1: {
                fontSize: "3rem",
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: "-0.02em"
            },
            h2: {
                fontSize: "2.25rem",
                lineHeight: 1.3,
                fontWeight: 600,
                letterSpacing: "-0.01em"
            },
            h3: {
                fontSize: "1.75rem",
                lineHeight: 1.4,
                fontWeight: 600,
                letterSpacing: "0"
            },
            h4: {
                fontSize: "1.5rem",
                lineHeight: 1.4,
                fontWeight: 600,
                letterSpacing: "0.01em"
            },
            h5: {
                fontSize: "1.25rem",
                lineHeight: 1.4,
                fontWeight: 500,
                letterSpacing: "0.01em"
            },
            h6: {
                fontSize: "1rem",
                lineHeight: 1.4,
                fontWeight: 500,
                letterSpacing: "0.01em"
            },
            body: {
                large: {
                    fontSize: "1.125rem",
                    lineHeight: 1.6,
                    fontWeight: 400
                },
                medium: {
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    fontWeight: 400
                },
                small: {
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    fontWeight: 400
                }
            },
            caption: {
                fontSize: "0.75rem",
                lineHeight: 1.4,
                fontWeight: 400,
                letterSpacing: "0.02em"
            }
        },
        
        // Language-specific typography
        languageStyles: {
            kinyarwanda: {
                fontFamily: "'Noto Sans', 'Segoe UI', sans-serif",
                lineHeight: 1.7,
                letterSpacing: "0.01em"
            },
            english: {
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.6,
                letterSpacing: "0"
            },
            french: {
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.65,
                letterSpacing: "0"
            }
        }
    },

    // ============================================
    // 3️⃣ SPACING & LAYOUT SYSTEM
    // ============================================
    spacing: {
        baseUnit: 8, // 8px base unit
        scale: {
            xs: "0.25rem",  // 4px
            sm: "0.5rem",   // 8px
            md: "1rem",     // 16px
            lg: "1.5rem",   // 24px
            xl: "2rem",     // 32px
            "2xl": "3rem",  // 48px
            "3xl": "4rem",  // 64px
            "4xl": "6rem"   // 96px
        },
        
        containers: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
        },
        
        breakpoints: {
            xs: "0px",
            sm: "576px",
            md: "768px",
            lg: "992px",
            xl: "1200px",
            "2xl": "1400px"
        }
    },

    // ============================================
    // 4️⃣ COMPONENT STYLES
    // ============================================
    components: {
        buttons: {
            // Primary Button
            primary: {
                background: "#003366",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: 500,
                hover: {
                    background: "#002244",
                    transform: "translateY(-1px)"
                },
                active: {
                    background: "#001933"
                },
                disabled: {
                    background: "#adb5bd",
                    color: "#6c757d"
                }
            },
            
            // Secondary Button
            secondary: {
                background: "#0099ff",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: 500,
                hover: {
                    background: "#0077cc",
                    transform: "translateY(-1px)"
                }
            },
            
            // Outline Button
            outline: {
                background: "transparent",
                color: "#003366",
                border: "2px solid #003366",
                borderRadius: "8px",
                padding: "10px 22px",
                fontSize: "1rem",
                fontWeight: 500,
                hover: {
                    background: "#003366",
                    color: "#ffffff"
                }
            },
            
            // Borrower Button (Orange)
            borrower: {
                background: "#f37021",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: 500,
                hover: {
                    background: "#c2591a",
                    transform: "translateY(-1px)"
                }
            },
            
            // Lender Button (Green)
            lender: {
                background: "#28a745",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: 500,
                hover: {
                    background: "#1e7e34",
                    transform: "translateY(-1px)"
                }
            },
            
            // Sizes
            sizes: {
                small: {
                    padding: "8px 16px",
                    fontSize: "0.875rem"
                },
                large: {
                    padding: "16px 32px",
                    fontSize: "1.125rem"
                },
                xlarge: {
                    padding: "20px 40px",
                    fontSize: "1.25rem"
                }
            }
        },
        
        cards: {
            // Standard Card
            standard: {
                background: "#ffffff",
                borderRadius: "12px",
                padding: "24px",
                border: "1px solid #dee2e6",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                hover: {
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                    transform: "translateY(-2px)"
                }
            },
            
            // Emergency Card (with glow)
            emergency: {
                background: "#ffffff",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #dee2e6",
                boxShadow: "0 4px 12px rgba(0, 153, 255, 0.15)",
                hover: {
                    boxShadow: "0 8px 24px rgba(0, 153, 255, 0.25)",
                    transform: "translateY(-4px)"
                }
            },
            
            // Premium Card (for lenders)
            premium: {
                background: "linear-gradient(135deg, #003366 0%, #0099ff 100%)",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 6px 20px rgba(0, 51, 102, 0.15)",
                hover: {
                    boxShadow: "0 12px 32px rgba(0, 51, 102, 0.25)"
                }
            },
            
            // Group Card
            group: {
                background: "#ffffff",
                borderRadius: "12px",
                padding: "20px",
                border: "2px solid #003366",
                boxShadow: "0 2px 8px rgba(0, 51, 102, 0.1)",
                hover: {
                    borderColor: "#0099ff",
                    boxShadow: "0 4px 16px rgba(0, 153, 255, 0.15)"
                }
            }
        },
        
        forms: {
            // Input Fields
            input: {
                background: "#ffffff",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "1rem",
                color: "#212529",
                focus: {
                    borderColor: "#0099ff",
                    boxShadow: "0 0 0 3px rgba(0, 153, 255, 0.15)",
                    outline: "none"
                },
                error: {
                    borderColor: "#dc3545",
                    background: "#fff5f5"
                },
                success: {
                    borderColor: "#28a745",
                    background: "#f8fff9"
                }
            },
            
            // Select Dropdowns
            select: {
                background: "#ffffff",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "1rem",
                color: "#212529",
                arrowColor: "#6c757d"
            },
            
            // Checkboxes & Radio Buttons
            checkbox: {
                size: "20px",
                border: "2px solid #dee2e6",
                borderRadius: "4px",
                checked: {
                    background: "#003366",
                    borderColor: "#003366"
                }
            },
            
            // Labels
            label: {
                color: "#212529",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "8px"
            },
            
            // Help Text
            helpText: {
                color: "#6c757d",
                fontSize: "0.75rem",
                marginTop: "4px"
            }
        },
        
        navigation: {
            // Header
            header: {
                background: "#003366",
                height: "72px",
                color: "#ffffff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
            },
            
            // Menu Items
            menuItem: {
                color: "#ffffff",
                fontSize: "1rem",
                padding: "12px 16px",
                hover: {
                    color: "#0099ff",
                    background: "rgba(255, 255, 255, 0.1)"
                },
                active: {
                    color: "#0099ff",
                    borderBottom: "2px solid #0099ff"
                }
            },
            
            // Dropdowns
            dropdown: {
                background: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                border: "1px solid #dee2e6",
                minWidth: "200px"
            },
            
            // Footer
            footer: {
                background: "#1f2a37",
                color: "#ffffff",
                padding: "60px 0 30px"
            }
        },
        
        badges: {
            // Status Badges
            status: {
                active: {
                    background: "#d4edda",
                    color: "#155724",
                    border: "1px solid #c3e6cb"
                },
                pending: {
                    background: "#fff3cd",
                    color: "#856404",
                    border: "1px solid #ffeaa7"
                },
                overdue: {
                    background: "#f8d7da",
                    color: "#721c24",
                    border: "1px solid #f5c6cb"
                },
                blacklisted: {
                    background: "#343a40",
                    color: "#ffffff",
                    border: "1px solid #23272b"
                }
            },
            
            // Rating Stars
            rating: {
                active: "#f9c80e",
                inactive: "#dee2e6",
                size: "20px"
            },
            
            // Subscription Tiers
            subscription: {
                basic: {
                    background: "#6c757d",
                    color: "#ffffff"
                },
                premium: {
                    background: "#0099ff",
                    color: "#ffffff"
                },
                super: {
                    background: "#003366",
                    color: "#ffffff"
                }
            }
        }
    },

    // ============================================
    // 5️⃣ ANIMATIONS & TRANSITIONS
    // ============================================
    animations: {
        durations: {
            fast: "150ms",
            normal: "300ms",
            slow: "500ms"
        },
        
        easing: {
            easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
            easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
            easeIn: "cubic-bezier(0.4, 0, 1, 1)",
            sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
        },
        
        keyframes: {
            fadeIn: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `,
            slideUp: `
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `,
            slideDown: `
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `,
            pulse: `
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `,
            shimmer: `
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
            `
        },
        
        transitions: {
            default: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            fast: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
            slow: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)"
        }
    },

    // ============================================
    // 6️⃣ ICONS & ILLUSTRATIONS
    // ============================================
    icons: {
        // Emergency Category Icons (Rwanda context)
        emergencyCategories: {
            fare: { emoji: "🚌", svg: "assets/icons/rwanda/bus.svg" },
            data: { emoji: "📶", svg: "assets/icons/rwanda/data.svg" },
            gas: { emoji: "🔥", svg: "assets/icons/rwanda/gas.svg" },
            food: { emoji: "🍲", svg: "assets/icons/rwanda/food.svg" },
            water: { emoji: "🚰", svg: "assets/icons/rwanda/water.svg" },
            electricity: { emoji: "⚡", svg: "assets/icons/rwanda/electricity.svg" },
            medicine: { emoji: "💊", svg: "assets/icons/rwanda/medicine.svg" },
            school: { emoji: "🎓", svg: "assets/icons/rwanda/school.svg" }
        },
        
        // Platform Icons
        platform: {
            borrower: { emoji: "💼", svg: "assets/icons/rwanda/borrower.svg" },
            lender: { emoji: "🌱", svg: "assets/icons/rwanda/lender.svg" },
            group: { emoji: "👥", svg: "assets/icons/rwanda/group.svg" },
            ledger: { emoji: "📒", svg: "assets/icons/rwanda/ledger.svg" },
            subscription: { emoji: "📋", svg: "assets/icons/rwanda/subscription.svg" },
            emergency: { emoji: "🚨", svg: "assets/icons/rwanda/emergency.svg" }
        },
        
        // Status Icons
        status: {
            success: { emoji: "✅", svg: "assets/icons/rwanda/success.svg" },
            warning: { emoji: "⚠️", svg: "assets/icons/rwanda/warning.svg" },
            error: { emoji: "❌", svg: "assets/icons/rwanda/error.svg" },
            info: { emoji: "ℹ️", svg: "assets/icons/rwanda/info.svg" }
        },
        
        // Payment Method Icons
        payment: {
            mtn: { emoji: "📱", svg: "assets/icons/rwanda/mtn.svg" },
            airtel: { emoji: "📲", svg: "assets/icons/rwanda/airtel.svg" },
            bank: { emoji: "🏦", svg: "assets/icons/rwanda/bank.svg" }
        }
    },

    // ============================================
    // 7️⃣ RWANDA-SPECIFIC DESIGN ELEMENTS
    // ============================================
    rwandaElements: {
        // Patterns inspired by Rwandan culture
        patterns: {
            imigongo: {
                name: "Imigongo Pattern",
                description: "Traditional Rwandan art pattern",
                css: `
                    background: linear-gradient(45deg, #003366 25%, transparent 25%),
                                linear-gradient(-45deg, #003366 25%, transparent 25%),
                                linear-gradient(45deg, transparent 75%, #003366 75%),
                                linear-gradient(-45deg, transparent 75%, #003366 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                `
            },
            
            agaseke: {
                name: "Agaseke Pattern",
                description: "Traditional basket weave pattern",
                css: `
                    background: repeating-linear-gradient(0deg, 
                        transparent, 
                        transparent 10px, 
                        rgba(0, 51, 102, 0.1) 10px, 
                        rgba(0, 51, 102, 0.1) 20px
                    );
                `
            }
        },
        
        // Color palettes inspired by Rwanda
        colorPalettes: {
            rwandaFlag: {
                blue: "#003366",     // Deep Blue
                yellow: "#f9c80e",   // Sunshine Yellow
                green: "#28a745"     // Rwandan Green
            },
            
            kigaliCity: {
                sky: "#0099ff",      // Kigali Sky
                hills: "#2e8b57",    // Green Hills
                sunset: "#f37021"    // Evening Sunset
            },
            
            traditional: {
                umushanana: "#8b4513", // Traditional attire brown
                inkwano: "#4b0082",    // Purple accents
                urugo: "#d2691e"       // Home/earth tones
            }
        },
        
        // Typography for Kinyarwanda
        kinyarwandaTypography: {
            recommendedFonts: [
                "'Noto Sans', sans-serif",
                "'Segoe UI', sans-serif",
                "Arial, sans-serif"
            ],
            characterSpacing: "0.01em",
            lineHeight: 1.7,
            optimalSizes: {
                body: "16px",
                heading: "24px",
                small: "14px"
            }
        }
    },

    // ============================================
    // 8️⃣ DARK MODE CONFIGURATION
    // ============================================
    darkMode: {
        enabled: true,
        autoDetect: true,
        
        colors: {
            primary: {
                main: "#0099ff",
                light: "#33bbff",
                dark: "#0077cc",
                contrast: "#ffffff"
            },
            background: {
                default: "#121212",
                paper: "#1e1e1e",
                card: "#252525"
            },
            text: {
                primary: "#ffffff",
                secondary: "#b0b0b0",
                disabled: "#666666"
            },
            border: {
                default: "#333333",
                light: "#444444"
            }
        },
        
        overrides: {
            cards: {
                standard: {
                    background: "#252525",
                    border: "1px solid #333333",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
                }
            },
            
            forms: {
                input: {
                    background: "#1e1e1e",
                    border: "1px solid #333333",
                    color: "#ffffff"
                }
            }
        }
    },

    // ============================================
    // 9️⃣ ACCESSIBILITY CONFIGURATION
    // ============================================
    accessibility: {
        // WCAG 2.1 AA Compliance
        contrastRatios: {
            normalText: 4.5,
            largeText: 3,
            uiComponents: 3
        },
        
        focusIndicators: {
            color: "#0099ff",
            width: "2px",
            offset: "2px",
            style: "solid"
        },
        
        reducedMotion: {
            disableAnimations: true,
            simplifiedTransitions: true
        },
        
        screenReader: {
            skipLinks: true,
            ariaLabels: true,
            landmarkRoles: true
        }
    },

    // ============================================
    // 🔟 THEME GENERATION METHODS
    // ============================================
    generate: {
        // Generate CSS variables
        getCSSVariables: function() {
            const colors = this.brand.colors;
            return `
                :root {
                    /* Primary Colors */
                    --color-primary-main: ${colors.primary.main};
                    --color-primary-light: ${colors.primary.light};
                    --color-primary-dark: ${colors.primary.dark};
                    --color-primary-contrast: ${colors.primary.contrast};
                    
                    /* Secondary Colors */
                    --color-secondary-main: ${colors.secondary.main};
                    --color-secondary-light: ${colors.secondary.light};
                    --color-secondary-dark: ${colors.secondary.dark};
                    --color-secondary-contrast: ${colors.secondary.contrast};
                    
                    /* Accent Colors */
                    --color-accent-main: ${colors.accent.main};
                    --color-accent-light: ${colors.accent.light};
                    --color-accent-dark: ${colors.accent.dark};
                    --color-accent-contrast: ${colors.accent.contrast};
                    
                    /* Status Colors */
                    --color-success-main: ${colors.success.main};
                    --color-warning-main: ${colors.warning.main};
                    --color-error-main: ${colors.error.main};
                    
                    /* Neutral Colors */
                    --color-background: ${colors.neutral.background};
                    --color-surface: ${colors.neutral.surface};
                    --color-border: ${colors.neutral.border};
                    --color-text-primary: ${colors.neutral.text.primary};
                    --color-text-secondary: ${colors.neutral.text.secondary};
                    --color-text-disabled: ${colors.neutral.text.disabled};
                    
                    /* Typography */
                    --font-family-primary: ${this.typography.fontFamily.primary};
                    --font-family-secondary: ${this.typography.fontFamily.secondary};
                    --font-family-kinyarwanda: ${this.typography.fontFamily.kinyarwanda};
                    
                    /* Spacing */
                    --spacing-unit: ${this.spacing.baseUnit}px;
                    
                    /* Animations */
                    --transition-default: ${this.animations.transitions.default};
                    --transition-fast: ${this.animations.transitions.fast};
                    --transition-slow: ${this.animations.transitions.slow};
                }
                
                /* Dark Mode Variables */
                [data-theme="dark"] {
                    --color-background: #121212;
                    --color-surface: #1e1e1e;
                    --color-text-primary: #ffffff;
                    --color-text-secondary: #b0b0b0;
                    --color-border: #333333;
                }
                
                /* Kinyarwanda Language */
                [lang="rw"] {
                    font-family: var(--font-family-kinyarwanda);
                    line-height: 1.7;
                }
            `;
        },
        
        // Generate component classes
        getComponentClasses: function() {
            return `
                /* Button Classes */
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 24px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition-default);
                    text-decoration: none;
                }
                
                .btn-primary {
                    background: var(--color-primary-main);
                    color: var(--color-primary-contrast);
                }
                
                .btn-primary:hover {
                    background: var(--color-primary-dark);
                    transform: translateY(-1px);
                }
                
                .btn-borrower {
                    background: var(--color-warning-main);
                    color: white;
                }
                
                .btn-lender {
                    background: var(--color-success-main);
                    color: white;
                }
                
                /* Card Classes */
                .card {
                    background: var(--color-surface);
                    border-radius: 12px;
                    border: 1px solid var(--color-border);
                    padding: 24px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    transition: var(--transition-default);
                }
                
                .card:hover {
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                    transform: translateY(-2px);
                }
                
                .card-emergency {
                    box-shadow: 0 4px 12px rgba(0, 153, 255, 0.15);
                }
                
                .card-emergency:hover {
                    box-shadow: 0 8px 24px rgba(0, 153, 255, 0.25);
                    transform: translateY(-4px);
                }
                
                /* Form Classes */
                .form-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: var(--transition-default);
                    background: white;
                }
                
                .form-input:focus {
                    border-color: var(--color-secondary-main);
                    box-shadow: 0 0 0 3px rgba(0, 153, 255, 0.15);
                    outline: none;
                }
                
                /* Badge Classes */
                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 12px;
                    border-radius: 16px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                
                .badge-success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                
                .badge-warning {
                    background: #fff3cd;
                    color: #856404;
                    border: 1px solid #ffeaa7;
                }
                
                .badge-error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
                
                /* Animation Classes */
                .fade-in {
                    animation: fadeIn 0.3s ease-in;
                }
                
                .slide-up {
                    animation: slideUp 0.3s ease-out;
                }
                
                .pulse {
                    animation: pulse 2s infinite;
                }
                
                /* Rwanda-specific patterns */
                .pattern-imigongo {
                    ${this.rwandaElements.patterns.imigongo.css}
                }
                
                .pattern-agaseke {
                    ${this.rwandaElements.patterns.agaseke.css}
                }
                
                /* Accessibility */
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
                
                .focus-visible:focus {
                    outline: 2px solid var(--color-secondary-main);
                    outline-offset: 2px;
                }
            `;
        },
        
        // Generate keyframe animations
        getKeyframes: function() {
            return this.animations.keyframes.fadeIn + 
                   this.animations.keyframes.slideUp + 
                   this.animations.keyframes.slideDown + 
                   this.animations.keyframes.pulse + 
                   this.animations.keyframes.shimmer;
        },
        
        // Generate complete theme CSS
        getThemeCSS: function() {
            return this.getCSSVariables() + 
                   this.getKeyframes() + 
                   this.getComponentClasses();
        }
    },

    // ============================================
    // 1️⃣1️⃣ INITIALIZATION & APPLICATION
    // ============================================
    apply: function() {
        console.log('Applying Rwanda Theme');
        
        // Create and inject theme CSS
        const style = document.createElement('style');
        style.id = 'mpesewa-rwanda-theme';
        style.textContent = this.generate.getThemeCSS();
        document.head.appendChild(style);
        
        // Set theme attribute on body
        document.body.setAttribute('data-theme', 'light');
        document.body.setAttribute('data-country', 'RW');
        
        // Add Rwandan flag favicon
        this.setFavicon();
        
        // Apply language-specific styles
        this.applyLanguageStyles();
        
        return this;
    },
    
    setFavicon: function() {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = this.brand.logo.icon;
        link.type = 'image/x-icon';
        
        // Remove existing favicon
        const existingFavicon = document.querySelector('link[rel="icon"]');
        if (existingFavicon) {
            existingFavicon.remove();
        }
        
        document.head.appendChild(link);
    },
    
    applyLanguageStyles: function() {
        // Check current language
        const lang = document.documentElement.lang || localStorage.getItem('mpesewa_language') || 'en';
        
        if (lang === 'rw') {
            document.documentElement.style.fontFamily = this.typography.languageStyles.kinyarwanda.fontFamily;
            document.documentElement.style.lineHeight = this.typography.languageStyles.kinyarwanda.lineHeight;
            document.documentElement.style.letterSpacing = this.typography.languageStyles.kinyarwanda.letterSpacing;
        }
    },
    
    toggleDarkMode: function(enable) {
        if (enable === undefined) {
            // Toggle current state
            const current = document.body.getAttribute('data-theme');
            enable = current === 'light' ? 'dark' : 'light';
        }
        
        document.body.setAttribute('data-theme', enable);
        localStorage.setItem('mpesewa_theme', enable);
        
        // Dispatch event for other components
        const event = new CustomEvent('themechange', { detail: { theme: enable } });
        document.dispatchEvent(event);
    },

    // ============================================
    // 1️⃣2️⃣ VERSION & UTILITIES
    // ============================================
    version: {
        major: 1,
        minor: 0,
        patch: 0,
        build: '20240124',
        
        getVersion: function() {
            return `${this.major}.${this.minor}.${this.patch}`;
        }
    },
    
    // Utility functions
    utils: {
        getColor: function(colorPath) {
            // e.g., 'primary.main' -> returns '#003366'
            const paths = colorPath.split('.');
            let current = this.brand.colors;
            
            for (const path of paths) {
                if (current[path] === undefined) {
                    console.warn(`Color path not found: ${colorPath}`);
                    return '#000000';
                }
                current = current[path];
            }
            
            return current;
        },
        
        rgba: function(hex, alpha) {
            // Convert hex to rgba
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        },
        
        getSpacing: function(multiplier = 1) {
            return `${this.spacing.baseUnit * multiplier}px`;
        }
    }
};

// Auto-apply theme if in browser context and on Rwanda pages
if (typeof document !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/rw')) {
        document.addEventListener('DOMContentLoaded', function() {
            RwandaTheme.apply();
        });
    }
}

// Export module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RwandaTheme;
} else if (typeof window !== 'undefined') {
    window.RwandaTheme = RwandaTheme;
}

// Add to global M-Pesewa object
if (typeof window !== 'undefined' && window.MPesewa) {
    window.MPesewa.RwandaTheme = RwandaTheme;
}