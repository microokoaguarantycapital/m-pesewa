/**
 * M-Pesewa Uganda - Theme Configuration
 * Uganda-specific UI theme and branding
 * Last Updated: 2026-01-24
 */

class UgandaTheme {
    constructor() {
        // Uganda national colors
        this.nationalColors = {
            black: '#000000',        // Symbolizes African people
            yellow: '#FFD700',       // Symbolizes sunshine
            red: '#DC143C',          // Symbolizes African brotherhood
            white: '#FFFFFF'         // Symbolizes peace
        };

        // M-Pesewa Uganda brand colors
        this.brandColors = {
            primary: '#003366',      // Deep Blue - Trust & Finance
            secondary: '#0099FF',    // Sky Blue - Technology & Innovation
            accent: '#FFD700',       // Uganda Gold - National Pride
            success: '#28A745',      // Green - Success & Growth
            warning: '#F37021',      // Orange - Emergency & Action
            danger: '#DC143C',       // Red - Risk & Warning
            light: '#F8F9FA',        // Light Gray - Backgrounds
            dark: '#212529'          // Dark Gray - Text
        };

        // Uganda-specific color combinations
        this.colorSchemes = {
            default: {
                background: '#FFFFFF',
                text: '#212529',
                primary: '#003366',
                secondary: '#0099FF',
                accent: '#FFD700'
            },
            dark: {
                background: '#121212',
                text: '#FFFFFF',
                primary: '#004488',
                secondary: '#33AAFF',
                accent: '#FFD700'
            },
            highContrast: {
                background: '#000000',
                text: '#FFFFFF',
                primary: '#FFD700',
                secondary: '#FFFFFF',
                accent: '#DC143C'
            }
        };

        // Typography for Uganda
        this.typography = {
            fontFamily: {
                primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                secondary: "'Poppins', 'Arial', sans-serif",
                monospace: "'Courier New', monospace"
            },
            fontSize: {
                xs: '0.75rem',    // 12px
                sm: '0.875rem',   // 14px
                base: '1rem',     // 16px
                lg: '1.125rem',   // 18px
                xl: '1.25rem',    // 20px
                '2xl': '1.5rem',  // 24px
                '3xl': '1.875rem', // 30px
                '4xl': '2.25rem'  // 36px
            },
            fontWeight: {
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800
            }
        };

        // Spacing system for Uganda theme
        this.spacing = {
            scale: '0.25rem', // 4px base unit
            values: {
                0: '0',
                1: '0.25rem',   // 4px
                2: '0.5rem',    // 8px
                3: '0.75rem',   // 12px
                4: '1rem',      // 16px
                5: '1.25rem',   // 20px
                6: '1.5rem',    // 24px
                8: '2rem',      // 32px
                10: '2.5rem',   // 40px
                12: '3rem',     // 48px
                16: '4rem',     // 64px
                20: '5rem',     // 80px
                24: '6rem',     // 96px
                32: '8rem'      // 128px
            }
        };

        // Border radius for Uganda theme
        this.borderRadius = {
            none: '0',
            sm: '0.125rem',    // 2px
            default: '0.25rem', // 4px
            md: '0.375rem',    // 6px
            lg: '0.5rem',      // 8px
            xl: '0.75rem',     // 12px
            '2xl': '1rem',     // 16px
            '3xl': '1.5rem',   // 24px
            full: '9999px'
        };

        // Shadows for Uganda theme
        this.shadows = {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            outline: '0 0 0 3px rgba(0, 51, 102, 0.5)',
            none: 'none'
        };

        // Animations for Uganda theme
        this.animations = {
            durations: {
                fast: '150ms',
                normal: '300ms',
                slow: '500ms'
            },
            timingFunctions: {
                linear: 'linear',
                ease: 'ease',
                'ease-in': 'ease-in',
                'ease-out': 'ease-out',
                'ease-in-out': 'ease-in-out'
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
                pulse: `
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `,
                shake: `
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                        20%, 40%, 60%, 80% { transform: translateX(5px); }
                    }
                `
            }
        };

        // Uganda-specific UI components
        this.components = {
            buttons: this.getButtonStyles(),
            cards: this.getCardStyles(),
            forms: this.getFormStyles(),
            tables: this.getTableStyles(),
            alerts: this.getAlertStyles(),
            badges: this.getBadgeStyles(),
            modals: this.getModalStyles(),
            navigation: this.getNavigationStyles()
        };

        // Uganda-specific patterns and icons
        this.patterns = {
            backgroundPatterns: [
                'uganda-crane',          // Crested Crane pattern
                'uganda-shield',         // Uganda shield pattern
                'african-geometric',     // African geometric patterns
                'boda-boda-pattern',     // Motorcycle pattern
                'coffee-beans'           // Coffee beans pattern
            ],
            icons: {
                currency: 'USh',
                flag: '🇺🇬',
                emergency: '🚨',
                lender: '💰',
                borrower: '🤝',
                group: '👥',
                success: '✅',
                warning: '⚠️',
                error: '❌'
            }
        };
    }

    /**
     * Get button styles for Uganda
     */
    getButtonStyles() {
        return {
            primary: {
                background: 'linear-gradient(135deg, #003366 0%, #004488 100%)',
                color: '#FFFFFF',
                border: '2px solid #003366',
                hover: {
                    background: 'linear-gradient(135deg, #004488 0%, #0055AA 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 51, 102, 0.3)'
                },
                active: {
                    background: '#003366',
                    transform: 'translateY(0)'
                },
                disabled: {
                    background: '#6C757D',
                    color: '#ADB5BD',
                    cursor: 'not-allowed'
                }
            },
            secondary: {
                background: 'linear-gradient(135deg, #0099FF 0%, #33AAFF 100%)',
                color: '#FFFFFF',
                border: '2px solid #0099FF',
                hover: {
                    background: 'linear-gradient(135deg, #33AAFF 0%, #66BBFF 100%)',
                    transform: 'translateY(-2px)'
                }
            },
            success: {
                background: 'linear-gradient(135deg, #28A745 0%, #34CE57 100%)',
                color: '#FFFFFF',
                border: '2px solid #28A745',
                hover: {
                    background: 'linear-gradient(135deg, #34CE57 0%, #40E567 100%)'
                }
            },
            warning: {
                background: 'linear-gradient(135deg, #F37021 0%, #FF8C42 100%)',
                color: '#FFFFFF',
                border: '2px solid #F37021',
                hover: {
                    background: 'linear-gradient(135deg, #FF8C42 0%, #FFA366 100%)'
                }
            },
            danger: {
                background: 'linear-gradient(135deg, #DC143C 0%, #FF3366 100%)',
                color: '#FFFFFF',
                border: '2px solid #DC143C',
                hover: {
                    background: 'linear-gradient(135deg, #FF3366 0%, #FF6699 100%)'
                }
            },
            outline: {
                background: 'transparent',
                color: '#003366',
                border: '2px solid #003366',
                hover: {
                    background: '#003366',
                    color: '#FFFFFF'
                }
            },
            ghost: {
                background: 'transparent',
                color: '#6C757D',
                border: '1px solid transparent',
                hover: {
                    background: '#F8F9FA',
                    color: '#212529'
                }
            },
            sizes: {
                sm: {
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.875rem',
                    borderRadius: '0.25rem'
                },
                md: {
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    borderRadius: '0.375rem'
                },
                lg: {
                    padding: '0.75rem 1.5rem',
                    fontSize: '1.125rem',
                    borderRadius: '0.5rem'
                },
                xl: {
                    padding: '1rem 2rem',
                    fontSize: '1.25rem',
                    borderRadius: '0.75rem'
                }
            }
        };
    }

    /**
     * Get card styles for Uganda
     */
    getCardStyles() {
        return {
            default: {
                background: '#FFFFFF',
                border: '1px solid #E9ECEF',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                hover: {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }
            },
            elevated: {
                background: '#FFFFFF',
                border: 'none',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            },
            outlined: {
                background: 'transparent',
                border: '2px solid #003366',
                borderRadius: '0.75rem',
                boxShadow: 'none'
            },
            filled: {
                background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
                border: 'none',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            },
            emergency: {
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                border: '2px solid #F37021',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(243, 112, 33, 0.2)'
            },
            lender: {
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                border: '2px solid #28A745',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)'
            },
            borrower: {
                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                border: '2px solid #0099FF',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(0, 153, 255, 0.2)'
            }
        };
    }

    /**
     * Get form styles for Uganda
     */
    getFormStyles() {
        return {
            input: {
                default: {
                    background: '#FFFFFF',
                    border: '1px solid #CED4DA',
                    borderRadius: '0.375rem',
                    color: '#212529',
                    focus: {
                        border: '2px solid #0099FF',
                        boxShadow: '0 0 0 3px rgba(0, 153, 255, 0.25)',
                        outline: 'none'
                    },
                    error: {
                        border: '2px solid #DC143C',
                        background: '#FFF5F5',
                        color: '#DC143C'
                    },
                    success: {
                        border: '2px solid #28A745',
                        background: '#F0FFF4',
                        color: '#28A745'
                    },
                    disabled: {
                        background: '#E9ECEF',
                        color: '#6C757D',
                        cursor: 'not-allowed'
                    }
                },
                sizes: {
                    sm: {
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.875rem'
                    },
                    md: {
                        padding: '0.5rem 0.75rem',
                        fontSize: '1rem'
                    },
                    lg: {
                        padding: '0.75rem 1rem',
                        fontSize: '1.125rem'
                    }
                }
            },
            label: {
                default: {
                    color: '#495057',
                    fontWeight: '500',
                    marginBottom: '0.25rem'
                },
                required: {
                    color: '#DC143C',
                    '&::after': {
                        content: "'*'",
                        marginLeft: '0.25rem'
                    }
                }
            },
            select: {
                default: {
                    background: '#FFFFFF',
                    border: '1px solid #CED4DA',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 2rem 0.5rem 0.75rem',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '16px 12px'
                }
            },
            checkbox: {
                default: {
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid #CED4DA',
                    borderRadius: '0.25rem',
                    checked: {
                        background: '#003366',
                        borderColor: '#003366',
                        '&::after': {
                            content: "''",
                            position: 'absolute',
                            display: 'block',
                            left: '6px',
                            top: '2px',
                            width: '5px',
                            height: '10px',
                            border: 'solid white',
                            borderWidth: '0 2px 2px 0',
                            transform: 'rotate(45deg)'
                        }
                    }
                }
            },
            radio: {
                default: {
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid #CED4DA',
                    borderRadius: '50%',
                    checked: {
                        background: '#003366',
                        borderColor: '#003366',
                        '&::after': {
                            content: "''",
                            position: 'absolute',
                            width: '0.625rem',
                            height: '0.625rem',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }
                    }
                }
            }
        };
    }

    /**
     * Get table styles for Uganda
     */
    getTableStyles() {
        return {
            default: {
                background: '#FFFFFF',
                border: '1px solid #E9ECEF',
                borderRadius: '0.75rem',
                overflow: 'hidden'
            },
            header: {
                background: 'linear-gradient(135deg, #003366 0%, #004488 100%)',
                color: '#FFFFFF',
                fontWeight: '600',
                padding: '1rem',
                textTransform: 'uppercase',
                fontSize: '0.875rem',
                letterSpacing: '0.05em'
            },
            row: {
                default: {
                    background: '#FFFFFF',
                    borderBottom: '1px solid #E9ECEF',
                    hover: {
                        background: '#F8F9FA'
                    }
                },
                striped: {
                    even: {
                        background: '#F8F9FA'
                    },
                    odd: {
                        background: '#FFFFFF'
                    }
                }
            },
            cell: {
                default: {
                    padding: '1rem',
                    color: '#212529'
                },
                header: {
                    padding: '1rem',
                    fontWeight: '600',
                    color: '#495057'
                }
            }
        };
    }

    /**
     * Get alert styles for Uganda
     */
    getAlertStyles() {
        return {
            success: {
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                border: '1px solid #28A745',
                color: '#155724',
                icon: '✅'
            },
            info: {
                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                border: '1px solid #0099FF',
                color: '#004085',
                icon: 'ℹ️'
            },
            warning: {
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                border: '1px solid #F37021',
                color: '#856404',
                icon: '⚠️'
            },
            error: {
                background: 'linear-gradient(135deg, #FFF5F5 0%, #FFE0E0 100%)',
                border: '1px solid #DC143C',
                color: '#721C24',
                icon: '❌'
            },
            emergency: {
                background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
                border: '2px solid #DC143C',
                color: '#B71C1C',
                icon: '🚨'
            },
            uganda: {
                background: 'linear-gradient(135deg, #000000 0%, #FFD700 100%)',
                border: '2px solid #FFD700',
                color: '#FFFFFF',
                icon: '🇺🇬'
            }
        };
    }

    /**
     * Get badge styles for Uganda
     */
    getBadgeStyles() {
        return {
            default: {
                background: '#6C757D',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '600'
            },
            primary: {
                background: '#003366',
                color: '#FFFFFF'
            },
            secondary: {
                background: '#0099FF',
                color: '#FFFFFF'
            },
            success: {
                background: '#28A745',
                color: '#FFFFFF'
            },
            warning: {
                background: '#F37021',
                color: '#FFFFFF'
            },
            danger: {
                background: '#DC143C',
                color: '#FFFFFF'
            },
            lender: {
                background: 'linear-gradient(135deg, #28A745 0%, #34CE57 100%)',
                color: '#FFFFFF',
                border: '1px solid #28A745'
            },
            borrower: {
                background: 'linear-gradient(135deg, #0099FF 0%, #33AAFF 100%)',
                color: '#FFFFFF',
                border: '1px solid #0099FF'
            },
            blacklist: {
                background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                color: '#FFFFFF',
                border: '2px solid #DC143C',
                animation: 'pulse 2s infinite'
            },
            rating: {
                '5-star': {
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFED4E 100%)',
                    color: '#000000'
                },
                '4-star': {
                    background: 'linear-gradient(135deg, #C0C0C0 0%, #E0E0E0 100%)',
                    color: '#000000'
                },
                '3-star': {
                    background: 'linear-gradient(135deg, #CD7F32 0%, #E6A65C 100%)',
                    color: '#000000'
                }
            }
        };
    }

    /**
     * Get modal styles for Uganda
     */
    getModalStyles() {
        return {
            overlay: {
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)'
            },
            content: {
                background: '#FFFFFF',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                maxWidth: '500px',
                margin: 'auto',
                animation: 'slideUp 0.3s ease-out'
            },
            header: {
                background: 'linear-gradient(135deg, #003366 0%, #004488 100%)',
                color: '#FFFFFF',
                padding: '1.5rem',
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '1rem',
                fontWeight: '600',
                fontSize: '1.25rem'
            },
            body: {
                padding: '1.5rem',
                color: '#212529'
            },
            footer: {
                background: '#F8F9FA',
                padding: '1rem 1.5rem',
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem'
            }
        };
    }

    /**
     * Get navigation styles for Uganda
     */
    getNavigationStyles() {
        return {
            header: {
                background: 'linear-gradient(135deg, #003366 0%, #004488 100%)',
                color: '#FFFFFF',
                height: '4rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            },
            navItem: {
                default: {
                    color: '#FFFFFF',
                    padding: '0.75rem 1rem',
                    fontWeight: '500',
                    hover: {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#FFD700'
                    },
                    active: {
                        background: 'rgba(255, 215, 0, 0.2)',
                        color: '#FFD700',
                        borderBottom: '3px solid #FFD700'
                    }
                }
            },
            dropdown: {
                menu: {
                    background: '#FFFFFF',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E9ECEF',
                    minWidth: '200px'
                },
                item: {
                    padding: '0.75rem 1rem',
                    color: '#212529',
                    hover: {
                        background: '#F8F9FA',
                        color: '#003366'
                    }
                }
            },
            footer: {
                background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                color: '#FFFFFF',
                padding: '3rem 0 1.5rem'
            }
        };
    }

    /**
     * Generate complete CSS for Uganda theme
     */
    generateThemeCSS() {
        return `
/* M-Pesewa Uganda Theme CSS */
/* Generated: ${new Date().toISOString()} */
/* Country: Uganda (UG) | Currency: UGX */

:root {
    /* Uganda National Colors */
    --ug-black: #000000;
    --ug-yellow: #FFD700;
    --ug-red: #DC143C;
    --ug-white: #FFFFFF;
    
    /* Brand Colors */
    --primary: #003366;
    --primary-dark: #002244;
    --primary-light: #004488;
    --secondary: #0099FF;
    --accent: #FFD700;
    --success: #28A745;
    --warning: #F37021;
    --danger: #DC143C;
    --light: #F8F9FA;
    --dark: #212529;
    
    /* Typography */
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-secondary: 'Poppins', 'Arial', sans-serif;
    --font-mono: 'Courier New', monospace;
    
    /* Spacing */
    --spacing-unit: 0.25rem;
    
    /* Border Radius */
    --radius-sm: 0.125rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-full: 9999px;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    
    /* Animations */
    --animation-fast: 150ms;
    --animation-normal: 300ms;
    --animation-slow: 500ms;
}

/* Uganda-specific utility classes */
.ug-bg-gradient {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
}

.ug-border-gold {
    border: 2px solid var(--accent);
}

.ug-text-gold {
    color: var(--accent);
}

.ug-shadow-emergency {
    box-shadow: 0 4px 12px rgba(243, 112, 33, 0.2);
}

.ug-shadow-lender {
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
}

.ug-shadow-borrower {
    box-shadow: 0 4px 12px rgba(0, 153, 255, 0.2);
}

/* Uganda Flag Inspired Elements */
.ug-flag-stripe {
    background: linear-gradient(
        to right,
        var(--ug-black) 33%,
        var(--ug-yellow) 33% 66%,
        var(--ug-red) 66%
    );
    height: 4px;
    border-radius: 2px;
}

.ug-flag-badge {
    background: linear-gradient(135deg, var(--ug-black) 0%, var(--ug-yellow) 100%);
    color: var(--ug-white);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: 2px solid var(--ug-yellow);
}

/* Uganda Isolation Warning */
.ug-isolation-warning {
    background: linear-gradient(135deg, var(--danger) 0%, #8B0000 100%);
    color: var(--ug-white);
    padding: 1rem;
    border-radius: var(--radius-lg);
    border: 2px solid var(--accent);
    margin: 1rem 0;
}

.ug-isolation-warning strong {
    color: var(--accent);
}

/* Uganda Currency Display */
.ug-currency {
    font-family: var(--font-mono);
    font-weight: 600;
    color: var(--dark);
}

.ug-currency::before {
    content: 'USh ';
    color: var(--primary);
}

/* Uganda Emergency Categories */
.ug-emergency-category {
    background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
    border: 2px solid var(--warning);
    border-radius: var(--radius-lg);
    padding: 1rem;
    transition: all var(--animation-normal) ease;
}

.ug-emergency-category:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}

/* Uganda Lender Card */
.ug-lender-card {
    background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    border: 2px solid var(--success);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
}

/* Uganda Borrower Card */
.ug-borrower-card {
    background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
    border: 2px solid var(--secondary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
}

/* Uganda Blacklist Badge */
.ug-blacklist-badge {
    background: linear-gradient(135deg, var(--ug-black) 0%, #333333 100%);
    color: var(--ug-white);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    border: 2px solid var(--danger);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    animation: pulse 2s infinite;
}

/* Uganda Rating Stars */
.ug-rating-stars {
    color: var(--accent);
    font-size: 1.25rem;
}

/* Uganda Regulatory Compliance Banner */
.ug-regulatory-banner {
    background: linear-gradient(to right, var(--ug-black), var(--ug-yellow));
    color: var(--ug-white);
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    border-left: 4px solid var(--danger);
}

/* Uganda-specific animations */
@keyframes ug-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

@keyframes ug-shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes ug-slide-in {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* Uganda Dark Mode Support */
@media (prefers-color-scheme: dark) {
    .ug-emergency-category {
        background: linear-gradient(135deg, #333333 0%, #444444 100%);
        border-color: var(--warning);
    }
    
    .ug-lender-card {
        background: linear-gradient(135deg, #1A331A 0%, #2D4A2D 100%);
    }
    
    .ug-borrower-card {
        background: linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%);
    }
}

/* Uganda Print Styles */
@media print {
    .ug-flag-badge,
    .ug-isolation-warning,
    .ug-regulatory-banner {
        border: 1px solid #000000;
        background: #FFFFFF !important;
        color: #000000 !important;
    }
}

/* Uganda High Contrast Mode */
@media (prefers-contrast: high) {
    .ug-emergency-category {
        border: 3px solid var(--warning);
    }
    
    .ug-lender-card {
        border: 3px solid var(--success);
    }
    
    .ug-borrower-card {
        border: 3px solid var(--secondary);
    }
}

/* Uganda Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .ug-emergency-category,
    .ug-lender-card,
    .ug-borrower-card {
        transition: none;
    }
    
    .ug-blacklist-badge {
        animation: none;
    }
}
        `;
    }

    /**
     * Get complete theme configuration
     */
    getTheme() {
        return {
            country: {
                code: 'UG',
                name: 'Uganda',
                currency: 'UGX'
            },
            colors: this.brandColors,
            typography: this.typography,
            spacing: this.spacing,
            borderRadius: this.borderRadius,
            shadows: this.shadows,
            animations: this.animations,
            components: this.components,
            patterns: this.patterns,
            css: this.generateThemeCSS(),
            validation: this.validateTheme(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Validate Uganda theme
     */
    validateTheme() {
        const validations = [];

        // Check for Uganda national colors
        if (!this.brandColors.accent.includes('FFD700')) {
            validations.push('Accent color should include Uganda gold (#FFD700)');
        }

        // Check for primary brand color
        if (this.brandColors.primary !== '#003366') {
            validations.push('Primary color must be #003366 (M-Pesewa blue)');
        }

        // Check for emergency color
        if (this.brandColors.warning !== '#F37021') {
            validations.push('Warning color must be #F37021 (emergency orange)');
        }

        return {
            isValid: validations.length === 0,
            validations,
            passed: validations.length === 0,
            failedCount: validations.length
        };
    }

    /**
     * Initialize Uganda theme
     */
    initialize() {
        console.log(`🎨 Initializing M-Pesewa Uganda Theme...`);
        
        const validation = this.validateTheme();
        
        if (!validation.isValid) {
            console.error('❌ Uganda theme validation failed:');
            validation.validations.forEach(v => console.error(`   - ${v}`));
            throw new Error('Uganda theme validation failed');
        }
        
        console.log('✅ Uganda theme validated successfully');
        console.log(`🎨 Primary color: ${this.brandColors.primary}`);
        console.log(`💰 Accent color: ${this.brandColors.accent} (Uganda Gold)`);
        console.log(`🚨 Emergency color: ${this.brandColors.warning}`);
        console.log(`📏 Spacing unit: ${this.spacing.scale}`);
        
        return this.getTheme();
    }
}

// Create and export Uganda theme
const ugandaTheme = new UgandaTheme();
export default ugandaTheme;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ugandaTheme;
}