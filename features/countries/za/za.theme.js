/**
 * South Africa (ZA) Theme Module
 * M-Pesewa Country-Specific Theme - South Africa
 * Last Updated: 2026-01-24
 * 
 * THEME HIERARCHY ENFORCEMENT:
 * 1. Brand Colors (M-Pesewa Global + South Africa Specific)
 * 2. Typography System
 * 3. Spacing & Layout
 * 4. Component Styling
 */

const ZA_THEME = {
    // ============================================
    // 1. COLOR PALETTE - SOUTH AFRICA SPECIFIC
    // ============================================
    colors: {
        // 1.1. Primary Brand Colors (M-Pesewa Global)
        primary: {
            brandBlue: "#003366",      // Primary brand blue - headers, footers, main headings
            secondaryBlue: "#0099ff",  // Secondary brand blue - links, floating glow
            actionOrange: "#f37021",   // Action orange - borrower buttons
            trustGreen: "#28a745",     // Trust green - lender sections, success
            neutralLight: "#f8f9fa",   // Neutral light - section separation
            pureWhite: "#ffffff",      // Pure white - cards, backgrounds
            textDark: "#003366",       // Dark text on white
            textLight: "#ffffff"       // Light text on dark
        },

        // 1.2. South Africa National Colors Integration
        national: {
            green: "#007A4D",          // South Africa green
            gold: "#FFB81C",           // South Africa gold/yellow
            red: "#E03C31",            // South Africa red
            black: "#000000",          // South Africa black
            white: "#FFFFFF",          // South Africa white
            rainbow: {
                red: "#E03C31",
                orange: "#F37021",
                yellow: "#FFB81C",
                green: "#007A4D",
                blue: "#003366",
                indigo: "#4B0082",
                violet: "#9400D3"
            }
        },

        // 1.3. Functional Colors
        functional: {
            success: {
                light: "#d4edda",
                medium: "#28a745",
                dark: "#155724",
                text: "#155724"
            },
            warning: {
                light: "#fff3cd",
                medium: "#ffc107",
                dark: "#856404",
                text: "#856404"
            },
            danger: {
                light: "#f8d7da",
                medium: "#dc3545",
                dark: "#721c24",
                text: "#721c24"
            },
            info: {
                light: "#d1ecf1",
                medium: "#17a2b8",
                dark: "#0c5460",
                text: "#0c5460"
            }
        },

        // 1.4. Status Colors
        status: {
            active: "#28a745",         // Active/approved
            pending: "#ffc107",        // Pending/review
            rejected: "#dc3545",       // Rejected/blocked
            defaulted: "#721c24",      // Defaulted/blacklisted
            completed: "#007A4D",      // Completed/cleared
            overdue: "#f37021"         // Overdue/warning
        },

        // 1.5. Background Colors
        backgrounds: {
            primary: "#ffffff",        // Main background
            secondary: "#f8f9fa",      // Secondary background
            dark: "#003366",           // Dark background (header/footer)
            darker: "#1f2a37",         // Darker background
            card: "#ffffff",           // Card background
            hover: "#f8f9fa",          // Hover background
            selected: "#e3f2fd"        // Selected background
        },

        // 1.6. Border Colors
        borders: {
            light: "#e5e7eb",
            medium: "#d1d5db",
            dark: "#6b7280",
            focus: "#0099ff",
            error: "#dc3545",
            success: "#28a745"
        },

        // 1.7. Gradient Definitions
        gradients: {
            primary: "linear-gradient(135deg, #003366 0%, #0099ff 100%)",
            secondary: "linear-gradient(135deg, #f37021 0%, #ff8c42 100%)",
            success: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            rainbow: "linear-gradient(135deg, #E03C31 0%, #F37021 15%, #FFB81C 30%, #007A4D 45%, #003366 60%, #4B0082 75%, #9400D3 90%)",
            premium: "linear-gradient(135deg, #003366 0%, #007A4D 50%, #FFB81C 100%)"
        }
    },

    // ============================================
    // 2. TYPOGRAPHY SYSTEM - SOUTH AFRICA
    // ============================================
    typography: {
        // 2.1. Font Families
        fonts: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
            secondary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            code: "'SF Mono', 'Roboto Mono', Consolas, 'Liberation Mono', Menlo, monospace",
            saLocal: {
                english: "'Inter', sans-serif",
                afrikaans: "'Inter', sans-serif", // Same for consistency
                zulu: "'Inter', sans-serif",      // Same for consistency
                xhosa: "'Inter', sans-serif"      // Same for consistency
            }
        },

        // 2.2. Font Sizes (REM scale)
        sizes: {
            xs: "0.75rem",    // 12px
            sm: "0.875rem",   // 14px
            base: "1rem",     // 16px
            lg: "1.125rem",   // 18px
            xl: "1.25rem",    // 20px
            "2xl": "1.5rem",  // 24px
            "3xl": "1.875rem", // 30px
            "4xl": "2.25rem",  // 36px
            "5xl": "3rem",     // 48px
            "6xl": "3.75rem"   // 60px
        },

        // 2.3. Font Weights
        weights: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800
        },

        // 2.4. Line Heights
        lineHeights: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
            loose: 2
        },

        // 2.5. Text Colors
        textColors: {
            primary: "#003366",        // Main text color
            secondary: "#6b7280",      // Secondary text
            tertiary: "#9ca3af",       // Tertiary text
            white: "#ffffff",          // Text on dark
            success: "#28a745",        // Success text
            warning: "#f37021",        // Warning text
            error: "#dc3545",          // Error text
            info: "#0099ff"            // Info text
        },

        // 2.6. Headings Configuration
        headings: {
            h1: {
                size: "3rem",          // 48px
                weight: 700,
                lineHeight: 1.2,
                color: "#003366",
                margin: "0 0 1rem 0"
            },
            h2: {
                size: "2.25rem",       // 36px
                weight: 600,
                lineHeight: 1.3,
                color: "#003366",
                margin: "0 0 0.75rem 0"
            },
            h3: {
                size: "1.875rem",      // 30px
                weight: 600,
                lineHeight: 1.4,
                color: "#003366",
                margin: "0 0 0.5rem 0"
            },
            h4: {
                size: "1.5rem",        // 24px
                weight: 600,
                lineHeight: 1.4,
                color: "#003366",
                margin: "0 0 0.5rem 0"
            },
            h5: {
                size: "1.25rem",       // 20px
                weight: 600,
                lineHeight: 1.4,
                color: "#003366",
                margin: "0 0 0.5rem 0"
            },
            h6: {
                size: "1.125rem",      // 18px
                weight: 600,
                lineHeight: 1.4,
                color: "#003366",
                margin: "0 0 0.5rem 0"
            }
        }
    },

    // ============================================
    // 3. SPACING & LAYOUT SYSTEM
    // ============================================
    spacing: {
        // 3.1. Spacing Scale (based on 4px increments)
        scale: {
            0: "0",
            1: "0.25rem",   // 4px
            2: "0.5rem",    // 8px
            3: "0.75rem",   // 12px
            4: "1rem",      // 16px
            5: "1.25rem",   // 20px
            6: "1.5rem",    // 24px
            7: "1.75rem",   // 28px
            8: "2rem",      // 32px
            9: "2.25rem",   // 36px
            10: "2.5rem",   // 40px
            12: "3rem",     // 48px
            14: "3.5rem",   // 56px
            16: "4rem",     // 64px
            20: "5rem",     // 80px
            24: "6rem",     // 96px
            32: "8rem",     // 128px
            40: "10rem",    // 160px
            48: "12rem",    // 192px
            56: "14rem",    // 224px
            64: "16rem"     // 256px
        },

        // 3.2. Container Widths
        containers: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
        },

        // 3.3. Breakpoints
        breakpoints: {
            xs: "320px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
        },

        // 3.4. Section Spacing
        sections: {
            small: "3rem 0",      // 48px vertical
            medium: "5rem 0",     // 80px vertical
            large: "8rem 0",      // 128px vertical
            xlarge: "12rem 0"     // 192px vertical
        }
    },

    // ============================================
    // 4. SHADOWS & ELEVATION
    // ============================================
    shadows: {
        // 4.1. Box Shadows
        box: {
            sm: "0 1px 2px 0 rgba(0, 51, 102, 0.05)",
            md: "0 4px 6px -1px rgba(0, 51, 102, 0.1), 0 2px 4px -1px rgba(0, 51, 102, 0.06)",
            lg: "0 10px 15px -3px rgba(0, 51, 102, 0.1), 0 4px 6px -2px rgba(0, 51, 102, 0.05)",
            xl: "0 20px 25px -5px rgba(0, 51, 102, 0.1), 0 10px 10px -5px rgba(0, 51, 102, 0.04)",
            "2xl": "0 25px 50px -12px rgba(0, 51, 102, 0.25)",
            inner: "inset 0 2px 4px 0 rgba(0, 51, 102, 0.06)",
            glow: "0 0 15px rgba(0, 153, 255, 0.3)"  // Sky blue glow for cards
        },

        // 4.2. Text Shadows
        text: {
            sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
            md: "0 2px 4px rgba(0, 0, 0, 0.1)",
            lg: "0 4px 8px rgba(0, 0, 0, 0.1)"
        },

        // 4.3. Elevation Levels
        elevation: {
            0: "none",
            1: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
            2: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
            3: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
            4: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
            5: "0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)"
        }
    },

    // ============================================
    // 5. BORDER RADIUS SYSTEM
    // ============================================
    borderRadius: {
        none: "0",
        sm: "0.125rem",   // 2px
        md: "0.375rem",   // 6px
        lg: "0.5rem",     // 8px
        xl: "0.75rem",    // 12px
        "2xl": "1rem",    // 16px
        "3xl": "1.5rem",  // 24px
        full: "9999px"
    },

    // ============================================
    // 6. COMPONENT THEMING - SOUTH AFRICA SPECIFIC
    // ============================================
    components: {
        // 6.1. Buttons
        buttons: {
            // Primary Button (Borrower - Orange)
            primary: {
                background: "#f37021",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                hover: {
                    background: "#e65c0d",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(243, 112, 33, 0.3)"
                },
                active: {
                    background: "#cc4e0b",
                    transform: "translateY(0)"
                },
                disabled: {
                    background: "#f8d7da",
                    color: "#721c24",
                    opacity: 0.6
                }
            },

            // Secondary Button (Lender - Green)
            secondary: {
                background: "#28a745",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                hover: {
                    background: "#218838",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)"
                },
                active: {
                    background: "#1e7e34",
                    transform: "translateY(0)"
                }
            },

            // Outline Button
            outline: {
                background: "transparent",
                color: "#003366",
                border: "2px solid #003366",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                hover: {
                    background: "#003366",
                    color: "#ffffff",
                    transform: "translateY(-2px)"
                }
            },

            // South Africa Theme Button
            saTheme: {
                background: "linear-gradient(135deg, #007A4D 0%, #003366 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                hover: {
                    background: "linear-gradient(135deg, #003366 0%, #007A4D 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 51, 102, 0.3)"
                }
            }
        },

        // 6.2. Cards
        cards: {
            // Default Card
            default: {
                background: "#ffffff",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0, 51, 102, 0.1), 0 2px 4px -1px rgba(0, 51, 102, 0.06)",
                hover: {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 25px -5px rgba(0, 51, 102, 0.1), 0 10px 10px -5px rgba(0, 51, 102, 0.04)",
                    borderColor: "#0099ff"
                }
            },

            // Floating Card (with sky blue glow)
            floating: {
                background: "#ffffff",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 0 15px rgba(0, 153, 255, 0.1), 0 4px 6px -1px rgba(0, 51, 102, 0.1)",
                hover: {
                    transform: "translateY(-4px)",
                    boxShadow: "0 0 25px rgba(0, 153, 255, 0.3), 0 20px 25px -5px rgba(0, 51, 102, 0.1)",
                    borderColor: "#0099ff"
                }
            },

            // Premium Card
            premium: {
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                border: "2px solid #FFB81C",
                boxShadow: "0 10px 15px -3px rgba(0, 51, 102, 0.1)",
                hover: {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 25px -5px rgba(0, 51, 102, 0.15)",
                    borderColor: "#007A4D"
                }
            }
        },

        // 6.3. Forms
        forms: {
            // Input Fields
            input: {
                background: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                color: "#003366",
                focus: {
                    borderColor: "#0099ff",
                    boxShadow: "0 0 0 3px rgba(0, 153, 255, 0.1)",
                    outline: "none"
                },
                error: {
                    borderColor: "#dc3545",
                    color: "#721c24",
                    background: "#f8d7da"
                },
                success: {
                    borderColor: "#28a745",
                    color: "#155724",
                    background: "#d4edda"
                }
            },

            // Labels
            label: {
                color: "#003366",
                fontSize: "0.875rem",
                fontWeight: 600,
                marginBottom: "0.5rem"
            },

            // Help Text
            helpText: {
                color: "#6b7280",
                fontSize: "0.75rem",
                marginTop: "0.25rem"
            }
        },

        // 6.4. Navigation
        navigation: {
            // Header
            header: {
                background: "#003366",
                color: "#ffffff",
                height: "72px",
                padding: "0 2rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            },

            // Menu Items
            menuItem: {
                color: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: 500,
                padding: "0.75rem 1rem",
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
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 51, 102, 0.1), 0 4px 6px -2px rgba(0, 51, 102, 0.05)",
                minWidth: "200px"
            }
        },

        // 6.5. Badges
        badges: {
            // Status Badges
            status: {
                success: {
                    background: "#d4edda",
                    color: "#155724",
                    borderRadius: "9999px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600
                },
                warning: {
                    background: "#fff3cd",
                    color: "#856404",
                    borderRadius: "9999px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600
                },
                danger: {
                    background: "#f8d7da",
                    color: "#721c24",
                    borderRadius: "9999px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600
                },
                info: {
                    background: "#d1ecf1",
                    color: "#0c5460",
                    borderRadius: "9999px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600
                }
            },

            // Role Badges
            role: {
                lender: {
                    background: "#28a745",
                    color: "#ffffff",
                    borderRadius: "9999px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600
                },
                borrower: {
                    background: "#f37021",
                    color: "#ffffff",
                    borderRadius: "9999px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600
                },
                admin: {
                    background: "#003366",
                    color: "#ffffff",
                    borderRadius: "9999px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600
                }
            }
        }
    },

    // ============================================
    // 7. ANIMATIONS & TRANSITIONS
    // ============================================
    animations: {
        // 7.1. Transition Durations
        durations: {
            fast: "150ms",
            normal: "300ms",
            slow: "500ms"
        },

        // 7.2. Transition Timing Functions
        timing: {
            ease: "cubic-bezier(0.4, 0, 0.2, 1)",
            easeIn: "cubic-bezier(0.4, 0, 1, 1)",
            easeOut: "cubic-bezier(0, 0, 0.2, 1)",
            linear: "linear"
        },

        // 7.3. Keyframe Animations
        keyframes: {
            fadeIn: {
                from: { opacity: 0 },
                to: { opacity: 1 }
            },
            fadeOut: {
                from: { opacity: 1 },
                to: { opacity: 0 }
            },
            slideUp: {
                from: { transform: "translateY(10px)", opacity: 0 },
                to: { transform: "translateY(0)", opacity: 1 }
            },
            slideDown: {
                from: { transform: "translateY(-10px)", opacity: 0 },
                to: { transform: "translateY(0)", opacity: 1 }
            },
            pulse: {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.5 }
            },
            spin: {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" }
            }
        }
    },

    // ============================================
    // 8. Z-INDEX LAYERING SYSTEM
    // ============================================
    zIndex: {
        hide: -1,
        auto: "auto",
        base: 0,
        docked: 10,
        dropdown: 1000,
        sticky: 1100,
        banner: 1200,
        overlay: 1300,
        modal: 1400,
        popover: 1500,
        skipLink: 1600,
        toast: 1700,
        tooltip: 1800
    },

    // ============================================
    // 9. RESPONSIVE DESIGN CONFIGURATION
    // ============================================
    responsive: {
        // 9.1. Mobile-First Breakpoints
        breakpoints: {
            mobile: {
                maxWidth: "767px",
                gridColumns: 1,
                fontSizeMultiplier: 0.9
            },
            tablet: {
                minWidth: "768px",
                maxWidth: "1023px",
                gridColumns: 2,
                fontSizeMultiplier: 0.95
            },
            desktop: {
                minWidth: "1024px",
                gridColumns: 3,
                fontSizeMultiplier: 1
            },
            largeDesktop: {
                minWidth: "1280px",
                gridColumns: 4,
                fontSizeMultiplier: 1.05
            }
        },

        // 9.2. Responsive Spacing
        spacing: {
            mobile: {
                padding: "1rem",
                margin: "0.5rem",
                gap: "0.75rem"
            },
            tablet: {
                padding: "1.5rem",
                margin: "1rem",
                gap: "1rem"
            },
            desktop: {
                padding: "2rem",
                margin: "1.5rem",
                gap: "1.5rem"
            }
        }
    },

    // ============================================
    // 10. ACCESSIBILITY CONFIGURATION
    // ============================================
    accessibility: {
        // 10.1. Focus Styles
        focus: {
            outline: "2px solid #0099ff",
            outlineOffset: "2px",
            ringWidth: "3px",
            ringColor: "rgba(0, 153, 255, 0.5)",
            ringOffsetWidth: "2px",
            ringOffsetColor: "#ffffff"
        },

        // 10.2. Contrast Ratios
        contrast: {
            normal: {
                text: "4.5:1",
                largeText: "3:1",
                uiComponents: "3:1"
            },
            enhanced: {
                text: "7:1",
                largeText: "4.5:1",
                uiComponents: "4.5:1"
            }
        },

        // 10.3. Screen Reader Only
        screenReaderOnly: {
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: "0"
        }
    },

    // ============================================
    // 11. THEME UTILITY CLASSES
    // ============================================
    utilities: {
        // 11.1. Background Utilities
        background: {
            "bg-brand-blue": "#003366",
            "bg-secondary-blue": "#0099ff",
            "bg-action-orange": "#f37021",
            "bg-trust-green": "#28a745",
            "bg-neutral-light": "#f8f9fa",
            "bg-sa-green": "#007A4D",
            "bg-sa-gold": "#FFB81C",
            "bg-sa-red": "#E03C31"
        },

        // 11.2. Text Utilities
        text: {
            "text-brand-blue": "#003366",
            "text-secondary-blue": "#0099ff",
            "text-action-orange": "#f37021",
            "text-trust-green": "#28a745",
            "text-sa-green": "#007A4D",
            "text-sa-gold": "#FFB81C",
            "text-sa-red": "#E03C31"
        },

        // 11.3. Border Utilities
        border: {
            "border-brand-blue": "#003366",
            "border-secondary-blue": "#0099ff",
            "border-action-orange": "#f37021",
            "border-trust-green": "#28a745",
            "border-sa-green": "#007A4D",
            "border-sa-gold": "#FFB81C"
        },

        // 11.4. Gradient Utilities
        gradient: {
            "gradient-primary": "linear-gradient(135deg, #003366 0%, #0099ff 100%)",
            "gradient-sa-rainbow": "linear-gradient(135deg, #E03C31 0%, #F37021 15%, #FFB81C 30%, #007A4D 45%, #003366 60%, #4B0082 75%, #9400D3 90%)",
            "gradient-lender": "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            "gradient-borrower": "linear-gradient(135deg, #f37021 0%, #ff8c42 100%)"
        }
    },

    // ============================================
    // 12. SOUTH AFRICA SPECIFIC THEME ELEMENTS
    // ============================================
    saSpecific: {
        // 12.1. National Day Themes
        nationalDays: {
            "freedom-day": {
                date: "April 27",
                colors: ["#007A4D", "#000000", "#FFB81C", "#FFFFFF", "#E03C31"],
                gradient: "linear-gradient(135deg, #007A4D 0%, #000000 25%, #FFB81C 50%, #FFFFFF 75%, #E03C31 100%)"
            },
            "heritage-day": {
                date: "September 24",
                colors: ["#007A4D", "#000000", "#FFB81C", "#FFFFFF", "#E03C31"],
                theme: "Rainbow Nation Celebration"
            },
            "youth-day": {
                date: "June 16",
                colors: ["#000000", "#007A4D", "#FFB81C"],
                gradient: "linear-gradient(135deg, #000000 0%, #007A4D 50%, #FFB81C 100%)"
            }
        },

        // 12.2. Provincial Color Schemes
        provinces: {
            "gauteng": {
                colors: ["#003366", "#0099ff", "#f8f9fa"],
                capital: "Johannesburg"
            },
            "western-cape": {
                colors: ["#007A4D", "#FFB81C", "#ffffff"],
                capital: "Cape Town"
            },
            "kwaZulu-natal": {
                colors: ["#000000", "#007A4D", "#FFB81C"],
                capital: "Durban"
            },
            "eastern-cape": {
                colors: ["#007A4D", "#ffffff", "#000000"],
                capital: "Port Elizabeth"
            }
        },

        // 12.3. Cultural Elements
        cultural: {
            patterns: {
                nguni: "Geometric patterns inspired by Nguni cattle",
                beadwork: "Traditional beadwork color patterns",
                san: "San rock art inspired designs"
            },
            icons: {
                protea: "🇿🇦", // National flower
                springbok: "🦌",  // National animal
                galjoen: "🐟",   // National fish
                blueCrane: "🦢",  // National bird
                kingProtea: "🌺"  // National flower emoji
            }
        }
    }
};

// ============================================
// THEME UTILITY FUNCTIONS
// ============================================

/**
 * Generate CSS variables for South Africa theme
 * @returns {string} CSS variables
 */
function generateCSSVariables() {
    let css = `:root {\n`;
    
    // Color variables
    Object.entries(ZA_THEME.colors.primary).forEach(([key, value]) => {
        css += `  --color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};\n`;
    });
    
    // National colors
    Object.entries(ZA_THEME.colors.national).forEach(([key, value]) => {
        if (typeof value === 'string') {
            css += `  --sa-${key}: ${value};\n`;
        }
    });
    
    // Typography
    Object.entries(ZA_THEME.typography.sizes).forEach(([key, value]) => {
        css += `  --text-${key}: ${value};\n`;
    });
    
    Object.entries(ZA_THEME.typography.weights).forEach(([key, value]) => {
        css += `  --font-weight-${key}: ${value};\n`;
    });
    
    // Spacing
    Object.entries(ZA_THEME.spacing.scale).forEach(([key, value]) => {
        css += `  --spacing-${key}: ${value};\n`;
    });
    
    // Border radius
    Object.entries(ZA_THEME.borderRadius).forEach(([key, value]) => {
        css += `  --radius-${key}: ${value};\n`;
    });
    
    // Z-index
    Object.entries(ZA_THEME.zIndex).forEach(([key, value]) => {
        css += `  --z-${key}: ${value};\n`;
    });
    
    css += `}\n\n`;
    
    // South Africa specific theme
    css += `.za-theme {\n`;
    css += `  --primary-gradient: ${ZA_THEME.colors.gradients.primary};\n`;
    css += `  --sa-gradient: ${ZA_THEME.colors.gradients.rainbow};\n`;
    css += `  --header-bg: var(--color-brand-blue);\n`;
    css += `  --footer-bg: #1f2a37;\n`;
    css += `}\n`;
    
    return css;
}

/**
 * Generate component styles for South Africa
 * @returns {string} Component CSS
 */
function generateComponentStyles() {
    let css = '';
    
    // Button styles
    const buttons = ZA_THEME.components.buttons;
    Object.entries(buttons).forEach(([type, config]) => {
        css += `
            .btn-${type} {
                background: ${config.background};
                color: ${config.color};
                border: ${config.border};
                border-radius: ${config.borderRadius};
                padding: ${config.padding};
                font-size: ${config.fontSize};
                font-weight: ${config.fontWeight};
                cursor: pointer;
                transition: all 0.3s ${ZA_THEME.animations.timing.ease};
            }
            
            .btn-${type}:hover {
                background: ${config.hover.background};
                transform: ${config.hover.transform};
                box-shadow: ${config.hover.boxShadow};
            }
            
            .btn-${type}:active {
                background: ${config.active?.background || config.background};
                transform: ${config.active?.transform || 'none'};
            }
        `;
    });
    
    // Card styles
    const cards = ZA_THEME.components.cards;
    Object.entries(cards).forEach(([type, config]) => {
        css += `
            .card-${type} {
                background: ${config.background};
                border-radius: ${config.borderRadius};
                padding: ${config.padding};
                border: ${config.border};
                box-shadow: ${config.boxShadow};
                transition: all 0.3s ${ZA_THEME.animations.timing.ease};
            }
            
            .card-${type}:hover {
                transform: ${config.hover.transform};
                box-shadow: ${config.hover.boxShadow};
                border-color: ${config.hover.borderColor};
            }
        `;
    });
    
    // Badge styles
    const badges = ZA_THEME.components.badges;
    Object.entries(badges.status).forEach(([type, config]) => {
        css += `
            .badge-${type} {
                background: ${config.background};
                color: ${config.color};
                border-radius: ${config.borderRadius};
                padding: ${config.padding};
                font-size: ${config.fontSize};
                font-weight: ${config.fontWeight};
                display: inline-block;
            }
        `;
    });
    
    return css;
}

/**
 * Get theme configuration for specific component
 * @param {string} component - Component name
 * @param {string} variant - Component variant
 * @returns {Object} Theme configuration
 */
function getComponentTheme(component, variant = 'default') {
    const componentConfig = ZA_THEME.components[component];
    if (!componentConfig) {
        console.warn(`Component "${component}" not found in theme`);
        return {};
    }
    
    return componentConfig[variant] || componentConfig.default || componentConfig;
}

/**
 * Apply South Africa theme to element
 * @param {HTMLElement} element - Element to theme
 * @param {string} themeType - Type of theme to apply
 */
function applyTheme(element, themeType) {
    if (!element || !element.style) return;
    
    const themes = {
        'za-primary': {
            background: ZA_THEME.colors.primary.brandBlue,
            color: ZA_THEME.colors.primary.pureWhite,
            border: `2px solid ${ZA_THEME.colors.primary.secondaryBlue}`
        },
        'za-secondary': {
            background: ZA_THEME.colors.primary.secondaryBlue,
            color: ZA_THEME.colors.primary.pureWhite
        },
        'za-success': {
            background: ZA_THEME.colors.functional.success.medium,
            color: ZA_THEME.colors.functional.success.text
        },
        'za-warning': {
            background: ZA_THEME.colors.functional.warning.medium,
            color: ZA_THEME.colors.functional.warning.text
        },
        'za-rainbow': {
            background: ZA_THEME.colors.gradients.rainbow,
            color: ZA_THEME.colors.primary.pureWhite
        }
    };
    
    const theme = themes[themeType];
    if (theme) {
        Object.entries(theme).forEach(([property, value]) => {
            element.style[property] = value;
        });
        
        // Add theme class
        element.classList.add(`theme-${themeType}`);
    }
}

/**
 * Generate responsive CSS for South Africa
 * @returns {string} Responsive CSS
 */
function generateResponsiveCSS() {
    let css = '';
    
    Object.entries(ZA_THEME.responsive.breakpoints).forEach(([breakpoint, config]) => {
        const mediaQuery = config.maxWidth 
            ? `@media (max-width: ${config.maxWidth})`
            : `@media (min-width: ${config.minWidth})`;
        
        css += `
            ${mediaQuery} {
                :root {
                    font-size: calc(16px * ${config.fontSizeMultiplier});
                }
                
                .container {
                    padding: ${ZA_THEME.responsive.spacing[breakpoint]?.padding || '1rem'};
                }
                
                .grid {
                    grid-template-columns: repeat(${config.gridColumns}, 1fr);
                    gap: ${ZA_THEME.responsive.spacing[breakpoint]?.gap || '1rem'};
                }
            }
        `;
    });
    
    return css;
}

/**
 * Get theme colors as CSS custom properties
 * @returns {Object} CSS custom properties
 */
function getThemeColors() {
    return {
        '--color-primary': ZA_THEME.colors.primary.brandBlue,
        '--color-secondary': ZA_THEME.colors.primary.secondaryBlue,
        '--color-accent': ZA_THEME.colors.primary.actionOrange,
        '--color-success': ZA_THEME.colors.primary.trustGreen,
        '--color-background': ZA_THEME.colors.backgrounds.primary,
        '--color-text': ZA_THEME.colors.primary.textDark,
        '--color-border': ZA_THEME.colors.borders.medium,
        '--sa-color-green': ZA_THEME.colors.national.green,
        '--sa-color-gold': ZA_THEME.colors.national.gold,
        '--sa-color-red': ZA_THEME.colors.national.red
    };
}

/**
 * Generate complete theme CSS for South Africa
 * @returns {string} Complete theme CSS
 */
function generateCompleteTheme() {
    return `
        /* M-Pesewa South Africa Theme */
        ${generateCSSVariables()}
        
        /* Base Styles */
        body.za-theme {
            font-family: ${ZA_THEME.typography.fonts.primary};
            color: ${ZA_THEME.typography.textColors.primary};
            background: ${ZA_THEME.colors.backgrounds.primary};
            line-height: ${ZA_THEME.typography.lineHeights.normal};
        }
        
        /* Headings */
        h1, .h1 {
            font-size: ${ZA_THEME.typography.headings.h1.size};
            font-weight: ${ZA_THEME.typography.headings.h1.weight};
            line-height: ${ZA_THEME.typography.headings.h1.lineHeight};
            color: ${ZA_THEME.typography.headings.h1.color};
            margin: ${ZA_THEME.typography.headings.h1.margin};
        }
        
        h2, .h2 {
            font-size: ${ZA_THEME.typography.headings.h2.size};
            font-weight: ${ZA_THEME.typography.headings.h2.weight};
            line-height: ${ZA_THEME.typography.headings.h2.lineHeight};
            color: ${ZA_THEME.typography.headings.h2.color};
            margin: ${ZA_THEME.typography.headings.h2.margin};
        }
        
        /* Links */
        a {
            color: ${ZA_THEME.colors.primary.secondaryBlue};
            text-decoration: none;
            transition: color 0.2s ${ZA_THEME.animations.timing.ease};
        }
        
        a:hover {
            color: ${ZA_THEME.colors.primary.brandBlue};
            text-decoration: underline;
        }
        
        /* Focus Styles */
        :focus-visible {
            outline: ${ZA_THEME.accessibility.focus.outline};
            outline-offset: ${ZA_THEME.accessibility.focus.outlineOffset};
        }
        
        /* Component Styles */
        ${generateComponentStyles()}
        
        /* Responsive Styles */
        ${generateResponsiveCSS()}
        
        /* South Africa Specific */
        .za-flag-gradient {
            background: ${ZA_THEME.colors.gradients.rainbow};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .za-rainbow-border {
            border: 3px solid;
            border-image: ${ZA_THEME.colors.gradients.rainbow} 1;
        }
        
        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.5s ${ZA_THEME.animations.timing.ease};
        }
        
        .animate-slide-up {
            animation: slideUp 0.5s ${ZA_THEME.animations.timing.ease};
        }
    `;
}

// ============================================
// EXPORT MODULE
// ============================================

export default {
    // Theme Configuration
    theme: ZA_THEME,
    
    // Generation Functions
    generateCSSVariables,
    generateComponentStyles,
    generateResponsiveCSS,
    generateCompleteTheme,
    
    // Utility Functions
    getComponentTheme,
    applyTheme,
    getThemeColors,
    
    // Color Constants
    COLORS: ZA_THEME.colors,
    TYPOGRAPHY: ZA_THEME.typography,
    SPACING: ZA_THEME.spacing,
    
    // Component Themes
    COMPONENTS: ZA_THEME.components,
    
    // South Africa Specific
    SA_SPECIFIC: ZA_THEME.saSpecific,
    
    // Accessibility
    ACCESSIBILITY: ZA_THEME.accessibility,
    
    // Version Information
    VERSION: "2.1.0",
    LAST_UPDATED: "2026-01-24"
};

// Initialize theme module
console.log(`✅ M-Pesewa South Africa theme module loaded`);
console.log(`🎨 Primary Color: ${ZA_THEME.colors.primary.brandBlue}`);
console.log(`🎨 Secondary Color: ${ZA_THEME.colors.primary.secondaryBlue}`);
console.log(`🎨 Action Color: ${ZA_THEME.colors.primary.actionOrange}`);
console.log(`🎨 Trust Color: ${ZA_THEME.colors.primary.trustGreen}`);
console.log(`🇿🇦 South Africa Colors: Green #${ZA_THEME.colors.national.green.slice(1)}, Gold #${ZA_THEME.colors.national.gold.slice(1)}, Red #${ZA_THEME.colors.national.red.slice(1)}`);