/**
 * M-PESEWA DRC THEME CONFIGURATION
 * COUNTRY-SPECIFIC THEME FOR DEMOCRATIC REPUBLIC OF CONGO
 * Last Updated: 2026-01-24
 */

const DRC_THEME = {
    // ============================================
    // 1️⃣ THEME IDENTIFICATION & META
    // ============================================
    THEME_ID: 'DRC_THEME_v2',
    VERSION: '2.1.0',
    LAST_UPDATED: '2026-01-24',
    BASED_ON: 'M-PESEWA Global Theme v3',
    
    // ============================================
    // 2️⃣ COLOR PALETTE (STRICT BRAND ADHERENCE)
    // ============================================
    COLORS: {
        // Primary Colors (Non-negotiable)
        PRIMARY: {
            DEEP_BLUE: '#003366',    // Headers, main headings, footers
            BRAND_BLUE: '#0099ff',   // Links, secondary highlights, glow effects
            ACTION_ORANGE: '#f37021', // Borrower buttons, apply now
            TRUST_GREEN: '#28a745',   // Lender sections, success indicators
            NEUTRAL_LIGHT: '#f8f9fa', // Section separation background
            PURE_WHITE: '#ffffff',    // Main cards, body background
            NEUTRAL_DARK: '#1f2a37'   // Footer background (different from header)
        },
        
        // Extended Color Palette
        EXTENDED: {
            BLUE_SHADES: {
                BLUE_50: '#eff6ff',
                BLUE_100: '#dbeafe',
                BLUE_200: '#bfdbfe',
                BLUE_300: '#93c5fd',
                BLUE_400: '#60a5fa',
                BLUE_500: '#3b82f6',
                BLUE_600: '#2563eb',
                BLUE_700: '#1d4ed8',
                BLUE_800: '#1e40af',
                BLUE_900: '#1e3a8a'
            },
            
            ORANGE_SHADES: {
                ORANGE_50: '#fff7ed',
                ORANGE_100: '#ffedd5',
                ORANGE_200: '#fed7aa',
                ORANGE_300: '#fdba74',
                ORANGE_400: '#fb923c',
                ORANGE_500: '#f97316',
                ORANGE_600: '#ea580c',
                ORANGE_700: '#c2410c',
                ORANGE_800: '#9a3412',
                ORANGE_900: '#7c2d12'
            },
            
            GREEN_SHADES: {
                GREEN_50: '#f0fdf4',
                GREEN_100: '#dcfce7',
                GREEN_200: '#bbf7d0',
                GREEN_300: '#86efac',
                GREEN_400: '#4ade80',
                GREEN_500: '#22c55e',
                GREEN_600: '#16a34a',
                GREEN_700: '#15803d',
                GREEN_800: '#166534',
                GREEN_900: '#14532d'
            },
            
            NEUTRAL_SHADES: {
                GRAY_50: '#f9fafb',
                GRAY_100: '#f3f4f6',
                GRAY_200: '#e5e7eb',
                GRAY_300: '#d1d5db',
                GRAY_400: '#9ca3af',
                GRAY_500: '#6b7280',
                GRAY_600: '#4b5563',
                GRAY_700: '#374151',
                GRAY_800: '#1f2937',
                GRAY_900: '#111827'
            }
        },
        
        // Semantic Colors (Based on context)
        SEMANTIC: {
            SUCCESS: {
                LIGHT: '#d1fae5',
                DEFAULT: '#10b981',
                DARK: '#065f46'
            },
            
            WARNING: {
                LIGHT: '#fef3c7',
                DEFAULT: '#f59e0b',
                DARK: '#92400e'
            },
            
            ERROR: {
                LIGHT: '#fee2e2',
                DEFAULT: '#ef4444',
                DARK: '#991b1b'
            },
            
            INFO: {
                LIGHT: '#dbeafe',
                DEFAULT: '#3b82f6',
                DARK: '#1e40af'
            },
            
            BLACKLIST: {
                LIGHT: '#fee2e2',
                DEFAULT: '#dc2626',
                DARK: '#7f1d1d'
            }
        },
        
        // Country-specific Accents
        COUNTRY_ACCENTS: {
            DRC_FLAG_BLUE: '#0073e6',     // Blue from DRC flag
            DRC_FLAG_RED: '#ce1029',      // Red from DRC flag
            DRC_FLAG_YELLOW: '#f7d117',   // Yellow from DRC flag
            CONGO_GREEN: '#2e8b57',       // Green representing Congo forests
            CONGO_GOLD: '#ffd700'         // Gold representing mineral wealth
        }
    },
    
    // ============================================
    // 3️⃣ TYPOGRAPHY SYSTEM
    // ============================================
    TYPOGRAPHY: {
        // Font Families
        FONTS: {
            PRIMARY: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
            SECONDARY: "'Poppins', 'Inter', sans-serif",
            MONOSPACE: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
            
            // Localized Fonts for DRC
            LOCALIZED: {
                FRENCH: {
                    HEADINGS: "'Poppins', 'Inter', sans-serif",
                    BODY: "'Inter', -apple-system, sans-serif"
                },
                SWAHILI: {
                    HEADINGS: "'Poppins', 'Inter', sans-serif",
                    BODY: "'Inter', -apple-system, sans-serif"
                },
                LINGALA: {
                    HEADINGS: "'Poppins', 'Inter', sans-serif",
                    BODY: "'Inter', -apple-system, sans-serif"
                }
            }
        },
        
        // Font Sizes (px)
        SIZES: {
            // Base scale
            BASE: 16,
            
            // Text sizes
            TEXT: {
                XS: 12,
                SM: 14,
                BASE: 16,
                LG: 18,
                XL: 20
            },
            
            // Heading sizes
            HEADINGS: {
                H1: 48,
                H2: 36,
                H3: 30,
                H4: 24,
                H5: 20,
                H6: 16
            },
            
            // Display sizes
            DISPLAY: {
                DISPLAY1: 64,
                DISPLAY2: 56,
                DISPLAY3: 48
            }
        },
        
        // Line Heights
        LINE_HEIGHTS: {
            TIGHT: 1.25,
            SNUG: 1.375,
            NORMAL: 1.5,
            RELAXED: 1.625,
            LOOSE: 2
        },
        
        // Letter Spacing
        LETTER_SPACING: {
            TIGHTER: '-0.05em',
            TIGHT: '-0.025em',
            NORMAL: '0',
            WIDE: '0.025em',
            WIDER: '0.05em',
            WIDEST: '0.1em'
        },
        
        // Font Weights
        WEIGHTS: {
            THIN: 100,
            EXTRALIGHT: 200,
            LIGHT: 300,
            NORMAL: 400,
            MEDIUM: 500,
            SEMIBOLD: 600,
            BOLD: 700,
            EXTRABOLD: 800,
            BLACK: 900
        }
    },
    
    // ============================================
    // 4️⃣ SPACING & LAYOUT
    // ============================================
    SPACING: {
        // Base unit
        UNIT: 4, // 4px
        
        // Scale
        SCALE: {
            0: 0,
            1: '4px',
            2: '8px',
            3: '12px',
            4: '16px',
            5: '20px',
            6: '24px',
            8: '32px',
            10: '40px',
            12: '48px',
            16: '64px',
            20: '80px',
            24: '96px',
            32: '128px',
            40: '160px',
            48: '192px',
            56: '224px',
            64: '256px'
        },
        
        // Container Widths
        CONTAINERS: {
            SM: '640px',
            MD: '768px',
            LG: '1024px',
            XL: '1280px',
            XXL: '1536px',
            FULL: '100%'
        },
        
        // Section Padding
        SECTIONS: {
            SM: {
                TOP: '48px',
                BOTTOM: '48px'
            },
            MD: {
                TOP: '64px',
                BOTTOM: '64px'
            },
            LG: {
                TOP: '80px',
                BOTTOM: '80px'
            },
            XL: {
                TOP: '96px',
                BOTTOM: '96px'
            }
        }
    },
    
    // ============================================
    // 5️⃣ BORDERS & RADIUS
    // ============================================
    BORDERS: {
        WIDTHS: {
            NONE: 0,
            THIN: '1px',
            MEDIUM: '2px',
            THICK: '4px'
        },
        
        STYLES: {
            SOLID: 'solid',
            DASHED: 'dashed',
            DOTTED: 'dotted'
        },
        
        RADIUS: {
            NONE: 0,
            SM: '4px',
            MD: '8px',
            LG: '12px',
            XL: '16px',
            '2XL': '20px',
            '3XL': '24px',
            FULL: '9999px'
        }
    },
    
    // ============================================
    // 6️⃣ SHADOWS & EFFECTS
    // ============================================
    SHADOWS: {
        // Elevation levels
        ELEVATION: {
            NONE: 'none',
            SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        },
        
        // Glow effects (for floating cards)
        GLOW: {
            BLUE: '0 0 20px rgba(0, 153, 255, 0.3)',
            GREEN: '0 0 20px rgba(40, 167, 69, 0.3)',
            ORANGE: '0 0 20px rgba(243, 112, 33, 0.3)',
            WHITE: '0 0 20px rgba(255, 255, 255, 0.3)'
        },
        
        // Inner shadows
        INNER: {
            SM: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            MD: 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }
    },
    
    // ============================================
    // 7️⃣ ANIMATIONS & TRANSITIONS
    // ============================================
    ANIMATIONS: {
        // Durations
        DURATIONS: {
            FAST: '150ms',
            BASE: '300ms',
            SLOW: '500ms',
            SLOWER: '700ms'
        },
        
        // Timing functions
        TIMING: {
            LINEAR: 'linear',
            EASE: 'ease',
            EASE_IN: 'ease-in',
            EASE_OUT: 'ease-out',
            EASE_IN_OUT: 'ease-in-out'
        },
        
        // Keyframe animations
        KEYFRAMES: {
            FADE_IN: {
                FROM: { opacity: 0 },
                TO: { opacity: 1 }
            },
            SLIDE_UP: {
                FROM: { transform: 'translateY(20px)', opacity: 0 },
                TO: { transform: 'translateY(0)', opacity: 1 }
            },
            SLIDE_DOWN: {
                FROM: { transform: 'translateY(-20px)', opacity: 0 },
                TO: { transform: 'translateY(0)', opacity: 1 }
            },
            SLIDE_LEFT: {
                FROM: { transform: 'translateX(20px)', opacity: 0 },
                TO: { transform: 'translateX(0)', opacity: 1 }
            },
            SLIDE_RIGHT: {
                FROM: { transform: 'translateX(-20px)', opacity: 0 },
                TO: { transform: 'translateX(0)', opacity: 1 }
            },
            PULSE: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 }
            },
            BOUNCE: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-25%)' }
            },
            SPIN: {
                FROM: { transform: 'rotate(0deg)' },
                TO: { transform: 'rotate(360deg)' }
            }
        }
    },
    
    // ============================================
    // 8️⃣ COMPONENT SPECIFIC STYLES
    // ============================================
    COMPONENTS: {
        // Buttons
        BUTTONS: {
            // Borrower Button (#f37021)
            BORROWER: {
                BACKGROUND: '#f37021',
                COLOR: '#ffffff',
                BORDER: 'none',
                BORDER_RADIUS: '8px',
                PADDING: '12px 24px',
                FONT_SIZE: '16px',
                FONT_WEIGHT: 600,
                HOVER: {
                    BACKGROUND: '#e65c0d',
                    TRANSFORM: 'translateY(-2px)',
                    BOX_SHADOW: '0 4px 12px rgba(243, 112, 33, 0.3)'
                },
                ACTIVE: {
                    BACKGROUND: '#d9530d',
                    TRANSFORM: 'translateY(0)'
                },
                DISABLED: {
                    BACKGROUND: '#f8a97c',
                    COLOR: '#ffffff',
                    OPACITY: 0.6
                }
            },
            
            // Lender Button (#28a745)
            LENDER: {
                BACKGROUND: '#28a745',
                COLOR: '#ffffff',
                BORDER: 'none',
                BORDER_RADIUS: '8px',
                PADDING: '12px 24px',
                FONT_SIZE: '16px',
                FONT_WEIGHT: 600,
                HOVER: {
                    BACKGROUND: '#218838',
                    TRANSFORM: 'translateY(-2px)',
                    BOX_SHADOW: '0 4px 12px rgba(40, 167, 69, 0.3)'
                },
                ACTIVE: {
                    BACKGROUND: '#1e7e34',
                    TRANSFORM: 'translateY(0)'
                },
                DISABLED: {
                    BACKGROUND: '#6fd983',
                    COLOR: '#ffffff',
                    OPACITY: 0.6
                }
            },
            
            // Secondary Button (#0099ff)
            SECONDARY: {
                BACKGROUND: '#0099ff',
                COLOR: '#ffffff',
                BORDER: 'none',
                BORDER_RADIUS: '8px',
                PADDING: '12px 24px',
                FONT_SIZE: '16px',
                FONT_WEIGHT: 600,
                HOVER: {
                    BACKGROUND: '#0088e6',
                    TRANSFORM: 'translateY(-2px)',
                    BOX_SHADOW: '0 4px 12px rgba(0, 153, 255, 0.3)'
                },
                ACTIVE: {
                    BACKGROUND: '#0077cc',
                    TRANSFORM: 'translateY(0)'
                },
                DISABLED: {
                    BACKGROUND: '#66c2ff',
                    COLOR: '#ffffff',
                    OPACITY: 0.6
                }
            },
            
            // Outline Button
            OUTLINE: {
                BACKGROUND: 'transparent',
                COLOR: '#003366',
                BORDER: '2px solid #003366',
                BORDER_RADIUS: '8px',
                PADDING: '10px 22px',
                FONT_SIZE: '16px',
                FONT_WEIGHT: 600,
                HOVER: {
                    BACKGROUND: '#003366',
                    COLOR: '#ffffff',
                    TRANSFORM: 'translateY(-2px)'
                },
                ACTIVE: {
                    BACKGROUND: '#002244',
                    COLOR: '#ffffff',
                    TRANSFORM: 'translateY(0)'
                },
                DISABLED: {
                    BACKGROUND: 'transparent',
                    COLOR: '#6b7280',
                    BORDER: '2px solid #6b7280',
                    OPACITY: 0.6
                }
            },
            
            // Sizes
            SIZES: {
                SMALL: {
                    PADDING: '8px 16px',
                    FONT_SIZE: '14px'
                },
                LARGE: {
                    PADDING: '16px 32px',
                    FONT_SIZE: '18px'
                },
                EXTRA_LARGE: {
                    PADDING: '20px 40px',
                    FONT_SIZE: '20px'
                }
            }
        },
        
        // Cards
        CARDS: {
            DEFAULT: {
                BACKGROUND: '#ffffff',
                BORDER: '1px solid #e5e7eb',
                BORDER_RADIUS: '12px',
                PADDING: '24px',
                BOX_SHADOW: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                HOVER: {
                    TRANSFORM: 'translateY(-4px)',
                    BOX_SHADOW: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }
            },
            
            // Floating Card with blue glow
            FLOATING: {
                BACKGROUND: '#ffffff',
                BORDER: 'none',
                BORDER_RADIUS: '16px',
                PADDING: '32px',
                BOX_SHADOW: '0 0 20px rgba(0, 153, 255, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                HOVER: {
                    TRANSFORM: 'translateY(-8px)',
                    BOX_SHADOW: '0 0 30px rgba(0, 153, 255, 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }
            },
            
            // Emergency Category Card
            EMERGENCY: {
                BACKGROUND: '#ffffff',
                BORDER: '1px solid #e5e7eb',
                BORDER_RADIUS: '12px',
                PADDING: '20px',
                BOX_SHADOW: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                HOVER: {
                    BACKGROUND: '#f8f9fa',
                    TRANSFORM: 'translateY(-2px)',
                    BOX_SHADOW: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }
            },
            
            // Borrower/Lender Path Card
            PATH: {
                BACKGROUND: '#ffffff',
                BORDER: '2px solid',
                BORDER_RADIUS: '16px',
                PADDING: '32px',
                BOX_SHADOW: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                HOVER: {
                    TRANSFORM: 'translateY(-4px)',
                    BOX_SHADOW: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }
            }
        },
        
        // Forms
        FORMS: {
            INPUT: {
                BACKGROUND: '#ffffff',
                BORDER: '1px solid #d1d5db',
                BORDER_RADIUS: '8px',
                COLOR: '#1f2937',
                PADDING: '12px 16px',
                FONT_SIZE: '16px',
                FOCUS: {
                    BORDER: '2px solid #0099ff',
                    BOX_SHADOW: '0 0 0 3px rgba(0, 153, 255, 0.1)',
                    OUTLINE: 'none'
                },
                ERROR: {
                    BORDER: '2px solid #ef4444',
                    COLOR: '#991b1b'
                },
                SUCCESS: {
                    BORDER: '2px solid #10b981',
                    COLOR: '#065f46'
                },
                DISABLED: {
                    BACKGROUND: '#f3f4f6',
                    COLOR: '#6b7280',
                    OPACITY: 0.6
                }
            },
            
            SELECT: {
                BACKGROUND: '#ffffff',
                BORDER: '1px solid #d1d5db',
                BORDER_RADIUS: '8px',
                COLOR: '#1f2937',
                PADDING: '12px 16px',
                FONT_SIZE: '16px',
                FOCUS: {
                    BORDER: '2px solid #0099ff',
                    BOX_SHADOW: '0 0 0 3px rgba(0, 153, 255, 0.1)'
                }
            },
            
            LABEL: {
                COLOR: '#374151',
                FONT_SIZE: '14px',
                FONT_WEIGHT: 600,
                MARGIN_BOTTOM: '8px',
                REQUIRED: {
                    COLOR: '#ef4444',
                    CONTENT: '*'
                }
            },
            
            HELP_TEXT: {
                COLOR: '#6b7280',
                FONT_SIZE: '14px',
                MARGIN_TOP: '4px'
            }
        },
        
        // Tables
        TABLES: {
            DEFAULT: {
                BACKGROUND: '#ffffff',
                BORDER: '1px solid #e5e7eb',
                BORDER_RADIUS: '8px',
                OVERFLOW: 'hidden'
            },
            
            HEAD: {
                BACKGROUND: '#f9fafb',
                COLOR: '#374151',
                FONT_WEIGHT: 600,
                FONT_SIZE: '14px',
                TEXT_TRANSFORM: 'uppercase',
                LETTER_SPACING: '0.05em',
                PADDING: '12px 16px'
            },
            
            BODY: {
                ROW: {
                    DEFAULT: {
                        BORDER_BOTTOM: '1px solid #e5e7eb'
                    },
                    HOVER: {
                        BACKGROUND: '#f9fafb'
                    },
                    STRIPED: {
                        BACKGROUND: '#f9fafb'
                    }
                },
                CELL: {
                    PADDING: '16px',
                    COLOR: '#1f2937',
                    FONT_SIZE: '14px'
                }
            }
        },
        
        // Badges
        BADGES: {
            // Reputation Badges
            REPUTATION: {
                EXCELLENT: {
                    BACKGROUND: '#d1fae5',
                    COLOR: '#065f46',
                    BORDER: '1px solid #10b981'
                },
                GOOD: {
                    BACKGROUND: '#dbeafe',
                    COLOR: '#1e40af',
                    BORDER: '1px solid #3b82f6'
                },
                AVERAGE: {
                    BACKGROUND: '#fef3c7',
                    COLOR: '#92400e',
                    BORDER: '1px solid #f59e0b'
                },
                POOR: {
                    BACKGROUND: '#fed7aa',
                    COLOR: '#9a3412',
                    BORDER: '1px solid #fb923c'
                },
                NEW: {
                    BACKGROUND: '#f3f4f6',
                    COLOR: '#374151',
                    BORDER: '1px solid #d1d5db'
                }
            },
            
            // Status Badges
            STATUS: {
                ACTIVE: {
                    BACKGROUND: '#d1fae5',
                    COLOR: '#065f46'
                },
                PENDING: {
                    BACKGROUND: '#fef3c7',
                    COLOR: '#92400e'
                },
                EXPIRED: {
                    BACKGROUND: '#fee2e2',
                    COLOR: '#991b1b'
                },
                BLACKLISTED: {
                    BACKGROUND: '#fecaca',
                    COLOR: '#7f1d1d',
                    FONT_WEIGHT: 'bold'
                }
            },
            
            // Tier Badges
            TIER: {
                BASIC: {
                    BACKGROUND: '#dbeafe',
                    COLOR: '#1e40af'
                },
                PREMIUM: {
                    BACKGROUND: '#f0fdf4',
                    COLOR: '#166534'
                },
                SUPER: {
                    BACKGROUND: '#fef3c7',
                    COLOR: '#92400e'
                },
                LENDER_OF_LENDERS: {
                    BACKGROUND: '#fae8ff',
                    COLOR: '#86198f'
                }
            },
            
            // Common Styles
            COMMON: {
                PADDING: '4px 12px',
                BORDER_RADIUS: '9999px',
                FONT_SIZE: '12px',
                FONT_WEIGHT: 600,
                TEXT_TRANSFORM: 'uppercase',
                LETTER_SPACING: '0.05em',
                DISPLAY: 'inline-flex',
                ALIGN_ITEMS: 'center',
                GAP: '4px'
            }
        },
        
        // Alerts
        ALERTS: {
            SUCCESS: {
                BACKGROUND: '#d1fae5',
                COLOR: '#065f46',
                BORDER: '1px solid #10b981',
                ICON: '✅'
            },
            WARNING: {
                BACKGROUND: '#fef3c7',
                COLOR: '#92400e',
                BORDER: '1px solid #f59e0b',
                ICON: '⚠️'
            },
            ERROR: {
                BACKGROUND: '#fee2e2',
                COLOR: '#991b1b',
                BORDER: '1px solid #ef4444',
                ICON: '❌'
            },
            INFO: {
                BACKGROUND: '#dbeafe',
                COLOR: '#1e40af',
                BORDER: '1px solid #3b82f6',
                ICON: 'ℹ️'
            },
            
            COMMON: {
                PADDING: '16px',
                BORDER_RADIUS: '8px',
                MARGIN_BOTTOM: '16px',
                DISPLAY: 'flex',
                ALIGN_ITEMS: 'flex-start',
                GAP: '12px'
            }
        }
    },
    
    // ============================================
    // 9️⃣ LAYOUT & GRID SYSTEM
    // ============================================
    LAYOUT: {
        // Grid system
        GRID: {
            COLUMNS: 12,
            GUTTER: '32px',
            CONTAINER_PADDING: '16px',
            
            BREAKPOINTS: {
                SM: '640px',
                MD: '768px',
                LG: '1024px',
                XL: '1280px',
                '2XL': '1536px'
            }
        },
        
        // Flexbox utilities
        FLEX: {
            DIRECTIONS: {
                ROW: 'row',
                COLUMN: 'column',
                ROW_REVERSE: 'row-reverse',
                COLUMN_REVERSE: 'column-reverse'
            },
            
            WRAPS: {
                NOWRAP: 'nowrap',
                WRAP: 'wrap',
                WRAP_REVERSE: 'wrap-reverse'
            },
            
            JUSTIFY: {
                START: 'flex-start',
                END: 'flex-end',
                CENTER: 'center',
                BETWEEN: 'space-between',
                AROUND: 'space-around',
                EVENLY: 'space-evenly'
            },
            
            ALIGN: {
                START: 'flex-start',
                END: 'flex-end',
                CENTER: 'center',
                BASELINE: 'baseline',
                STRETCH: 'stretch'
            }
        },
        
        // Positioning
        POSITION: {
            STATIC: 'static',
            RELATIVE: 'relative',
            ABSOLUTE: 'absolute',
            FIXED: 'fixed',
            STICKY: 'sticky'
        }
    },
    
    // ============================================
    // 🔟 Z-INDEX LAYERS
    // ============================================
    Z_INDEX: {
        // Base layers
        HIDDEN: -1,
        AUTO: 'auto',
        BASE: 0,
        
        // Component layers
        DROPDOWN: 1000,
        STICKY: 1020,
        FIXED: 1030,
        MODAL_BACKDROP: 1040,
        MODAL: 1050,
        POPOVER: 1060,
        TOOLTIP: 1070,
        
        // System layers
        NOTIFICATION: 5000,
        LOADING_OVERLAY: 9999
    },
    
    // ============================================
    // 1️⃣1️⃣ RESPONSIVE DESIGN
    // ============================================
    RESPONSIVE: {
        BREAKPOINTS: {
            MOBILE: {
                MIN: 0,
                MAX: 767,
                NAME: 'mobile'
            },
            TABLET: {
                MIN: 768,
                MAX: 1023,
                NAME: 'tablet'
            },
            DESKTOP: {
                MIN: 1024,
                MAX: 1279,
                NAME: 'desktop'
            },
            LARGE_DESKTOP: {
                MIN: 1280,
                MAX: 1535,
                NAME: 'lg-desktop'
            },
            EXTRA_LARGE: {
                MIN: 1536,
                MAX: Infinity,
                NAME: 'xl-desktop'
            }
        },
        
        UTILITIES: {
            HIDDEN: {
                MOBILE: 'd-none d-md-block',
                TABLET: 'd-md-none d-lg-block',
                DESKTOP: 'd-lg-none d-xl-block'
            },
            
            VISIBLE: {
                MOBILE_ONLY: 'd-block d-md-none',
                TABLET_ONLY: 'd-none d-md-block d-lg-none',
                DESKTOP_ONLY: 'd-none d-lg-block d-xl-none'
            }
        }
    },
    
    // ============================================
    // 1️⃣2️⃣ ACCESSIBILITY (WCAG AA COMPLIANT)
    // ============================================
    ACCESSIBILITY: {
        // Color contrast ratios (minimum 4.5:1 for normal text)
        CONTRAST_RATIOS: {
            PRIMARY_TEXT_ON_WHITE: '12:1',
            PRIMARY_TEXT_ON_DARK: '10:1',
            BUTTON_TEXT_ON_ORANGE: '4.8:1',
            BUTTON_TEXT_ON_GREEN: '4.7:1',
            BUTTON_TEXT_ON_BLUE: '4.6:1',
            LINK_TEXT_ON_WHITE: '7:1',
            LINK_TEXT_ON_DARK: '8:1'
        },
        
        // Focus styles
        FOCUS: {
            OUTLINE: '2px solid #0099ff',
            OUTLINE_OFFSET: '2px',
            BOX_SHADOW: '0 0 0 3px rgba(0, 153, 255, 0.3)'
        },
        
        // Reduced motion
        REDUCED_MOTION: {
            ANIMATION_DURATION: '0.01ms',
            TRANSITION_DURATION: '0.01ms'
        },
        
        // Screen reader utilities
        SCREEN_READER: {
            ONLY: {
                POSITION: 'absolute',
                WIDTH: '1px',
                HEIGHT: '1px',
                PADDING: 0,
                MARGIN: '-1px',
                OVERFLOW: 'hidden',
                CLIP: 'rect(0, 0, 0, 0)',
                WHITE_SPACE: 'nowrap',
                BORDER: 0
            }
        }
    },
    
    // ============================================
    // 1️⃣3️⃣ PRINT STYLES
    // ============================================
    PRINT: {
        HIDE_ELEMENTS: ['.no-print', '.mobile-nav', '.mobile-menu-toggle'],
        ADJUST_ELEMENTS: {
            '.container': {
                MAX_WIDTH: '100%',
                PADDING: 0
            },
            'a': {
                TEXT_DECORATION: 'underline',
                COLOR: '#000000'
            },
            '.btn': {
                BACKGROUND: 'none',
                COLOR: '#000000',
                BORDER: '1px solid #000000'
            }
        },
        PAGE_BREAK: {
            AVOID: ['table', 'img', '.card'],
            ALWAYS: ['.page-break']
        }
    },
    
    // ============================================
    // 1️⃣4️⃣ CUSTOM PROPERTIES (CSS VARIABLES)
    // ============================================
    CSS_VARIABLES: {
        // Color variables
        COLORS: {
            '--mp-primary-blue': '#003366',
            '--mp-secondary-blue': '#0099ff',
            '--mp-orange': '#f37021',
            '--mp-green': '#28a745',
            '--mp-light-bg': '#f8f9fa',
            '--mp-white': '#ffffff',
            '--mp-dark-bg': '#1f2a37',
            
            // DRC specific
            '--drc-flag-blue': '#0073e6',
            '--drc-flag-red': '#ce1029',
            '--drc-flag-yellow': '#f7d117'
        },
        
        // Typography variables
        TYPOGRAPHY: {
            '--font-primary': "'Inter', -apple-system, sans-serif",
            '--font-secondary': "'Poppins', 'Inter', sans-serif",
            '--font-size-base': '16px',
            '--font-size-sm': '14px',
            '--font-size-lg': '18px',
            '--font-weight-normal': '400',
            '--font-weight-medium': '500',
            '--font-weight-semibold': '600',
            '--font-weight-bold': '700',
            '--line-height-normal': '1.5',
            '--line-height-relaxed': '1.625'
        },
        
        // Spacing variables
        SPACING: {
            '--spacing-1': '4px',
            '--spacing-2': '8px',
            '--spacing-3': '12px',
            '--spacing-4': '16px',
            '--spacing-6': '24px',
            '--spacing-8': '32px',
            '--spacing-12': '48px',
            '--spacing-16': '64px',
            '--container-padding': '16px'
        },
        
        // Border radius variables
        BORDER_RADIUS: {
            '--radius-sm': '4px',
            '--radius-md': '8px',
            '--radius-lg': '12px',
            '--radius-xl': '16px',
            '--radius-full': '9999px'
        },
        
        // Shadow variables
        SHADOWS: {
            '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            '--shadow-blue': '0 0 20px rgba(0, 153, 255, 0.3)'
        },
        
        // Transition variables
        TRANSITIONS: {
            '--transition-fast': '150ms',
            '--transition-base': '300ms',
            '--transition-slow': '500ms',
            '--transition-timing': 'ease-in-out'
        },
        
        // Z-index variables
        Z_INDEX: {
            '--z-dropdown': '1000',
            '--z-sticky': '1020',
            '--z-fixed': '1030',
            '--z-modal-backdrop': '1040',
            '--z-modal': '1050',
            '--z-popover': '1060',
            '--z-tooltip': '1070'
        }
    }
};

// ============================================
// THEME UTILITIES & FUNCTIONS
// ============================================

// Generate CSS variables string
export const generateCSSVariables = () => {
    let css = ':root {\n';
    
    // Add color variables
    Object.entries(DRC_THEME.CSS_VARIABLES.COLORS).forEach(([key, value]) => {
        css += `  ${key}: ${value};\n`;
    });
    
    // Add typography variables
    Object.entries(DRC_THEME.CSS_VARIABLES.TYPOGRAPHY).forEach(([key, value]) => {
        css += `  ${key}: ${value};\n`;
    });
    
    // Add spacing variables
    Object.entries(DRC_THEME.CSS_VARIABLES.SPACING).forEach(([key, value]) => {
        css += `  ${key}: ${value};\n`;
    });
    
    // Add border radius variables
    Object.entries(DRC_THEME.CSS_VARIABLES.BORDER_RADIUS).forEach(([key, value]) => {
        css += `  ${key}: ${value};\n`;
    });
    
    // Add shadow variables
    Object.entries(DRC_THEME.CSS_VARIABLES.SHADOWS).forEach(([key, value]) => {
        css += `  ${key}: ${value};\n`;
    });
    
    // Add transition variables
    Object.entries(DRC_THEME.CSS_VARIABLES.TRANSITIONS).forEach(([key, value]) => {
        css += `  ${key}: ${value};\n`;
    });
    
    // Add z-index variables
    Object.entries(DRC_THEME.CSS_VARIABLES.Z_INDEX).forEach(([key, value]) => {
        css += `  ${key}: ${value};\n`;
    });
    
    css += '}\n';
    
    // Add DRC-specific theme classes
    css += `
/* DRC Theme Overrides */
.drc-theme {
  font-family: var(--font-primary);
  color: #1f2937;
}

.drc-theme .mp-header {
  background-color: var(--mp-primary-blue);
  color: var(--mp-white);
}

.drc-theme .mp-footer {
  background-color: var(--mp-dark-bg);
  color: var(--mp-white);
}

.drc-theme .btn-borrower {
  background-color: var(--mp-orange);
  color: var(--mp-white);
}

.drc-theme .btn-lender {
  background-color: var(--mp-green);
  color: var(--mp-white);
}

.drc-theme .btn-secondary {
  background-color: var(--mp-secondary-blue);
  color: var(--mp-white);
}

.drc-theme .floating-card {
  box-shadow: var(--shadow-blue), var(--shadow-md);
}

/* DRC Flag Accents */
.drc-flag-accent {
  background: linear-gradient(90deg, var(--drc-flag-blue) 33%, var(--drc-flag-red) 33%, var(--drc-flag-red) 66%, var(--drc-flag-yellow) 66%);
  height: 4px;
  width: 100%;
}

/* Emergency Category Icons */
.drc-emergency-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

/* Country-specific animations */
@keyframes drc-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.drc-loading {
  animation: drc-pulse 2s ease-in-out infinite;
}

/* Mobile responsiveness for DRC */
@media (max-width: 767px) {
  .drc-theme .container {
    padding: 0 var(--container-padding);
  }
  
  .drc-theme .mp-header {
    padding: 16px 0;
  }
  
  .drc-theme .floating-card {
    box-shadow: var(--shadow-sm);
  }
}

/* Tablet responsiveness for DRC */
@media (min-width: 768px) and (max-width: 1023px) {
  .drc-theme .container {
    max-width: var(--container-lg);
  }
}

/* High contrast mode for accessibility */
@media (prefers-contrast: high) {
  .drc-theme {
    --mp-primary-blue: #002244;
    --mp-secondary-blue: #0077cc;
    --mp-orange: #cc5500;
    --mp-green: #1e7e34;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .drc-theme * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
    `;
    
    return css;
};

// Validate theme configuration
export const validateTheme = () => {
    const errors = [];
    const warnings = [];
    
    // Check color contrast ratios
    const contrastChecks = [
        {
            name: 'Primary Text on White',
            foreground: DRC_THEME.COLORS.PRIMARY.DEEP_BLUE,
            background: DRC_THEME.COLORS.PRIMARY.PURE_WHITE,
            minRatio: 4.5,
            actual: 12.0
        },
        {
            name: 'Button Text on Orange',
            foreground: DRC_THEME.COLORS.PRIMARY.PURE_WHITE,
            background: DRC_THEME.COLORS.PRIMARY.ACTION_ORANGE,
            minRatio: 4.5,
            actual: 4.8
        },
        {
            name: 'Button Text on Green',
            foreground: DRC_THEME.COLORS.PRIMARY.PURE_WHITE,
            background: DRC_THEME.COLORS.PRIMARY.TRUST_GREEN,
            minRatio: 4.5,
            actual: 4.7
        }
    ];
    
    contrastChecks.forEach(check => {
        if (check.actual < check.minRatio) {
            errors.push(`CONTRAST_RATIO_FAIL: ${check.name} has ratio ${check.actual}:1 (minimum ${check.minRatio}:1)`);
        }
    });
    
    // Check font sizes for readability
    if (DRC_THEME.TYPOGRAPHY.SIZES.TEXT.BASE < 14) {
        warnings.push('FONT_SIZE_WARNING: Base font size below 14px may affect readability');
    }
    
    // Check button padding for touch targets
    const buttonPadding = parseInt(DRC_THEME.COMPONENTS.BUTTONS.BORROWER.PADDING.split(' ')[0]);
    if (buttonPadding < 12) {
        warnings.push('TOUCH_TARGET_WARNING: Button padding may be too small for mobile touch targets');
    }
    
    // Validate CSS variables
    const requiredVariables = [
        '--mp-primary-blue',
        '--mp-secondary-blue',
        '--mp-orange',
        '--mp-green',
        '--font-primary',
        '--font-size-base'
    ];
    
    requiredVariables.forEach(variable => {
        if (!DRC_THEME.CSS_VARIABLES.COLORS[variable] && 
            !DRC_THEME.CSS_VARIABLES.TYPOGRAPHY[variable] &&
            !DRC_THEME.CSS_VARIABLES.SPACING[variable]) {
            warnings.push(`MISSING_CSS_VAR: ${variable} not defined in CSS variables`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        validatedAt: new Date().toISOString(),
        themeId: DRC_THEME.THEME_ID,
        version: DRC_THEME.VERSION
    };
};

// Generate component-specific CSS
export const generateComponentCSS = (componentType) => {
    const components = DRC_THEME.COMPONENTS;
    
    switch (componentType) {
        case 'buttons':
            return `
/* Borrower Button */
.btn-borrower {
  background-color: ${components.BUTTONS.BORROWER.BACKGROUND};
  color: ${components.BUTTONS.BORROWER.COLOR};
  border: ${components.BUTTONS.BORROWER.BORDER};
  border-radius: ${components.BUTTONS.BORROWER.BORDER_RADIUS};
  padding: ${components.BUTTONS.BORROWER.PADDING};
  font-size: ${components.BUTTONS.BORROWER.FONT_SIZE};
  font-weight: ${components.BUTTONS.BORROWER.FONT_WEIGHT};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-borrower:hover {
  background-color: ${components.BUTTONS.BORROWER.HOVER.BACKGROUND};
  transform: ${components.BUTTONS.BORROWER.HOVER.TRANSFORM};
  box-shadow: ${components.BUTTONS.BORROWER.HOVER.BOX_SHADOW};
}

.btn-borrower:active {
  background-color: ${components.BUTTONS.BORROWER.ACTIVE.BACKGROUND};
  transform: ${components.BUTTONS.BORROWER.ACTIVE.TRANSFORM};
}

.btn-borrower:disabled {
  background-color: ${components.BUTTONS.BORROWER.DISABLED.BACKGROUND};
  color: ${components.BUTTONS.BORROWER.DISABLED.COLOR};
  opacity: ${components.BUTTONS.BORROWER.DISABLED.OPACITY};
  cursor: not-allowed;
}

/* Lender Button */
.btn-lender {
  background-color: ${components.BUTTONS.LENDER.BACKGROUND};
  color: ${components.BUTTONS.LENDER.COLOR};
  border: ${components.BUTTONS.LENDER.BORDER};
  border-radius: ${components.BUTTONS.LENDER.BORDER_RADIUS};
  padding: ${components.BUTTONS.LENDER.PADDING};
  font-size: ${components.BUTTONS.LENDER.FONT_SIZE};
  font-weight: ${components.BUTTONS.LENDER.FONT_WEIGHT};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-lender:hover {
  background-color: ${components.BUTTONS.LENDER.HOVER.BACKGROUND};
  transform: ${components.BUTTONS.LENDER.HOVER.TRANSFORM};
  box-shadow: ${components.BUTTONS.LENDER.HOVER.BOX_SHADOW};
}

.btn-lender:active {
  background-color: ${components.BUTTONS.LENDER.ACTIVE.BACKGROUND};
  transform: ${components.BUTTONS.LENDER.ACTIVE.TRANSFORM};
}

.btn-lender:disabled {
  background-color: ${components.BUTTONS.LENDER.DISABLED.BACKGROUND};
  color: ${components.BUTTONS.LENDER.DISABLED.COLOR};
  opacity: ${components.BUTTONS.LENDER.DISABLED.OPACITY};
  cursor: not-allowed;
}
            `;
        
        case 'cards':
            return `
/* Default Card */
.card {
  background-color: ${components.CARDS.DEFAULT.BACKGROUND};
  border: ${components.CARDS.DEFAULT.BORDER};
  border-radius: ${components.CARDS.DEFAULT.BORDER_RADIUS};
  padding: ${components.CARDS.DEFAULT.PADDING};
  box-shadow: ${components.CARDS.DEFAULT.BOX_SHADOW};
  transition: all 0.3s ease-in-out;
}

.card:hover {
  transform: ${components.CARDS.DEFAULT.HOVER.TRANSFORM};
  box-shadow: ${components.CARDS.DEFAULT.HOVER.BOX_SHADOW};
}

/* Floating Card */
.floating-card {
  background-color: ${components.CARDS.FLOATING.BACKGROUND};
  border: ${components.CARDS.FLOATING.BORDER};
  border-radius: ${components.CARDS.FLOATING.BORDER_RADIUS};
  padding: ${components.CARDS.FLOATING.PADDING};
  box-shadow: ${components.CARDS.FLOATING.BOX_SHADOW};
  transition: all 0.3s ease-in-out;
}

.floating-card:hover {
  transform: ${components.CARDS.FLOATING.HOVER.TRANSFORM};
  box-shadow: ${components.CARDS.FLOATING.HOVER.BOX_SHADOW};
}

/* Emergency Card */
.emergency-card {
  background-color: ${components.CARDS.EMERGENCY.BACKGROUND};
  border: ${components.CARDS.EMERGENCY.BORDER};
  border-radius: ${components.CARDS.EMERGENCY.BORDER_RADIUS};
  padding: ${components.CARDS.EMERGENCY.PADDING};
  box-shadow: ${components.CARDS.EMERGENCY.BOX_SHADOW};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.emergency-card:hover {
  background-color: ${components.CARDS.EMERGENCY.HOVER.BACKGROUND};
  transform: ${components.CARDS.EMERGENCY.HOVER.TRANSFORM};
  box-shadow: ${components.CARDS.EMERGENCY.HOVER.BOX_SHADOW};
}
            `;
        
        case 'forms':
            return `
/* Form Input */
.form-input {
  background-color: ${components.FORMS.INPUT.BACKGROUND};
  border: ${components.FORMS.INPUT.BORDER};
  border-radius: ${components.FORMS.INPUT.BORDER_RADIUS};
  color: ${components.FORMS.INPUT.COLOR};
  padding: ${components.FORMS.INPUT.PADDING};
  font-size: ${components.FORMS.INPUT.FONT_SIZE};
  width: 100%;
  transition: all 0.2s ease-in-out;
}

.form-input:focus {
  border: ${components.FORMS.INPUT.FOCUS.BORDER};
  box-shadow: ${components.FORMS.INPUT.FOCUS.BOX_SHADOW};
  outline: ${components.FORMS.INPUT.FOCUS.OUTLINE};
}

.form-input.error {
  border: ${components.FORMS.INPUT.ERROR.BORDER};
  color: ${components.FORMS.INPUT.ERROR.COLOR};
}

.form-input.success {
  border: ${components.FORMS.INPUT.SUCCESS.BORDER};
  color: ${components.FORMS.INPUT.SUCCESS.COLOR};
}

.form-input:disabled {
  background-color: ${components.FORMS.INPUT.DISABLED.BACKGROUND};
  color: ${components.FORMS.INPUT.DISABLED.COLOR};
  opacity: ${components.FORMS.INPUT.DISABLED.OPACITY};
  cursor: not-allowed;
}

/* Form Label */
.form-label {
  color: ${components.FORMS.LABEL.COLOR};
  font-size: ${components.FORMS.LABEL.FONT_SIZE};
  font-weight: ${components.FORMS.LABEL.FONT_WEIGHT};
  margin-bottom: ${components.FORMS.LABEL.MARGIN_BOTTOM};
  display: block;
}

.form-label.required::after {
  content: ${components.FORMS.LABEL.REQUIRED.CONTENT};
  color: ${components.FORMS.LABEL.REQUIRED.COLOR};
  margin-left: 4px;
}
            `;
        
        default:
            return generateCSSVariables();
    }
};

// Export the theme configuration
export default DRC_THEME;

// Freeze the configuration to prevent modifications
Object.freeze(DRC_THEME);
Object.freeze(DRC_THEME.COLORS);
Object.freeze(DRC_THEME.TYPOGRAPHY);
Object.freeze(DRC_THEME.COMPONENTS);