/**
 * M-PESEWA ETHIOPIA THEME CONFIGURATION
 * Complete visual design system for Ethiopia platform
 * Last Updated: 2024-01-24
 * Version: 1.0.0
 */

const EthiopiaTheme = {
    // ============================================
    // 1️⃣ DESIGN TOKENS - FOUNDATION
    // ============================================
    tokens: {
        // Color Palette - M-Pesewa Brand + Ethiopia Specific
        colors: {
            // Primary Brand Colors
            primary: {
                50: '#e6f0ff',
                100: '#cce0ff',
                200: '#99c2ff',
                300: '#66a3ff',
                400: '#3385ff',
                500: '#0066ff', // Primary Blue
                600: '#0052cc',
                700: '#003d99',
                800: '#002966',
                900: '#001433'
            },
            
            // Secondary Colors
            secondary: {
                50: '#f0f9ff',
                100: '#e0f2fe',
                200: '#bae6fd',
                300: '#7dd3fc',
                400: '#38bdf8',
                500: '#0ea5e9', // Secondary Blue
                600: '#0284c7',
                700: '#0369a1',
                800: '#075985',
                900: '#0c4a6e'
            },
            
            // Accent Colors
            accent: {
                borrower: {
                    50: '#fef3e7',
                    100: '#fde8d3',
                    200: '#fbd1a7',
                    300: '#f9ba7b',
                    400: '#f7a34f',
                    500: '#f58c23', // Borrower Orange (#f37021 adjusted for Ethiopia)
                    600: '#c4701c',
                    700: '#935415',
                    800: '#62380e',
                    900: '#311c07'
                },
                lender: {
                    50: '#e8f7ed',
                    100: '#d1efdb',
                    200: '#a3dfb7',
                    300: '#75cf93',
                    400: '#47bf6f',
                    500: '#19af4b', // Lender Green (#28a745 adjusted for Ethiopia)
                    600: '#148c3c',
                    700: '#0f692d',
                    800: '#0a461e',
                    900: '#05230f'
                }
            },
            
            // Neutral Colors
            neutral: {
                50: '#f9fafb',
                100: '#f3f4f6',
                200: '#e5e7eb',
                300: '#d1d5db',
                400: '#9ca3af',
                500: '#6b7280',
                600: '#4b5563',
                700: '#374151',
                800: '#1f2937', // Footer background
                900: '#111827'
            },
            
            // Semantic Colors
            semantic: {
                success: {
                    50: '#f0fdf4',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857'
                },
                warning: {
                    50: '#fffbeb',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309'
                },
                error: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c'
                },
                info: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8'
                }
            },
            
            // Ethiopia Specific Colors
            ethiopia: {
                flag: {
                    green: '#078930',
                    yellow: '#fcdd09',
                    red: '#da121a',
                    blue: '#0F47AF'
                },
                cultural: {
                    coffee: '#6f4e37',
                    injera: '#d4b483',
                    berbere: '#c84c09',
                    teff: '#8b7355'
                }
            }
        },
        
        // Typography Scale
        typography: {
            fontFamily: {
                sans: ['Inter', 'Noto Sans Ethiopic', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                mono: ['Fira Code', 'monospace'],
                amharic: ['Noto Sans Ethiopic', 'Inter', 'sans-serif']
            },
            
            fontSize: {
                xs: '0.75rem',      // 12px
                sm: '0.875rem',     // 14px
                base: '1rem',       // 16px
                lg: '1.125rem',     // 18px
                xl: '1.25rem',      // 20px
                '2xl': '1.5rem',    // 24px
                '3xl': '1.875rem',  // 30px
                '4xl': '2.25rem',   // 36px
                '5xl': '3rem',      // 48px
                '6xl': '3.75rem'    // 60px
            },
            
            fontWeight: {
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800
            },
            
            lineHeight: {
                none: 1,
                tight: 1.25,
                snug: 1.375,
                normal: 1.5,
                relaxed: 1.625,
                loose: 2
            },
            
            letterSpacing: {
                tighter: '-0.05em',
                tight: '-0.025em',
                normal: '0em',
                wide: '0.025em',
                wider: '0.05em',
                widest: '0.1em'
            }
        },
        
        // Spacing Scale
        spacing: {
            px: '1px',
            0: '0px',
            0.5: '0.125rem',   // 2px
            1: '0.25rem',      // 4px
            1.5: '0.375rem',   // 6px
            2: '0.5rem',       // 8px
            2.5: '0.625rem',   // 10px
            3: '0.75rem',      // 12px
            3.5: '0.875rem',   // 14px
            4: '1rem',         // 16px
            5: '1.25rem',      // 20px
            6: '1.5rem',       // 24px
            7: '1.75rem',      // 28px
            8: '2rem',         // 32px
            9: '2.25rem',      // 36px
            10: '2.5rem',      // 40px
            11: '2.75rem',     // 44px
            12: '3rem',        // 48px
            14: '3.5rem',      // 56px
            16: '4rem',        // 64px
            20: '5rem',        // 80px
            24: '6rem',        // 96px
            28: '7rem',        // 112px
            32: '8rem',        // 128px
            36: '9rem',        // 144px
            40: '10rem',       // 160px
            44: '11rem',       // 176px
            48: '12rem',       // 192px
            52: '13rem',       // 208px
            56: '14rem',       // 224px
            60: '15rem',       // 240px
            64: '16rem',       // 256px
            72: '18rem',       // 288px
            80: '20rem',       // 320px
            96: '24rem'        // 384px
        },
        
        // Border Radius
        borderRadius: {
            none: '0px',
            sm: '0.125rem',    // 2px
            DEFAULT: '0.25rem', // 4px
            md: '0.375rem',    // 6px
            lg: '0.5rem',      // 8px
            xl: '0.75rem',     // 12px
            '2xl': '1rem',     // 16px
            '3xl': '1.5rem',   // 24px
            full: '9999px'
        },
        
        // Box Shadow
        boxShadow: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            glow: '0 0 20px rgba(0, 153, 255, 0.3)', // Sky blue glow
            'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
            'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)',
            'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
            none: 'none'
        },
        
        // Z-Index Scale
        zIndex: {
            0: 0,
            10: 10,
            20: 20,
            30: 30,
            40: 40,
            50: 50,
            auto: 'auto'
        },
        
        // Opacity
        opacity: {
            0: '0',
            5: '0.05',
            10: '0.1',
            20: '0.2',
            25: '0.25',
            30: '0.3',
            40: '0.4',
            50: '0.5',
            60: '0.6',
            70: '0.7',
            75: '0.75',
            80: '0.8',
            90: '0.9',
            95: '0.95',
            100: '1'
        }
    },

    // ============================================
    // 2️⃣ COMPONENT STYLES
    // ============================================
    components: {
        // Button Styles
        button: {
            base: 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
            
            sizes: {
                xs: 'px-2.5 py-1.5 text-xs',
                sm: 'px-3 py-2 text-sm',
                md: 'px-4 py-2.5 text-sm',
                lg: 'px-5 py-3 text-base',
                xl: 'px-6 py-3.5 text-base'
            },
            
            variants: {
                primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
                secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
                borrower: 'bg-accent-borrower-500 text-white hover:bg-accent-borrower-600 focus:ring-accent-borrower-500',
                lender: 'bg-accent-lender-500 text-white hover:bg-accent-lender-600 focus:ring-accent-lender-500',
                outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
                ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
                danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500'
            }
        },
        
        // Card Styles
        card: {
            base: 'bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg',
            
            variants: {
                default: 'border border-neutral-200',
                elevated: 'shadow-lg border-0',
                outline: 'border-2 border-primary-200',
                glow: 'shadow-glow border-0',
                dark: 'bg-neutral-800 text-white'
            },
            
            padding: {
                sm: 'p-4',
                md: 'p-6',
                lg: 'p-8'
            }
        },
        
        // Form Styles
        form: {
            input: {
                base: 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
                sizes: {
                    sm: 'px-2.5 py-1.5 text-sm',
                    md: 'px-3 py-2 text-base',
                    lg: 'px-4 py-3 text-lg'
                },
                variants: {
                    default: 'border-neutral-300 bg-white',
                    error: 'border-error-500 bg-error-50',
                    success: 'border-success-500 bg-success-50',
                    disabled: 'border-neutral-200 bg-neutral-100 text-neutral-500'
                }
            },
            
            label: {
                base: 'block text-sm font-medium text-neutral-700 mb-1',
                required: 'after:content-["*"] after:ml-0.5 after:text-error-500'
            },
            
            select: {
                base: 'w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            },
            
            checkbox: {
                base: 'h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded'
            },
            
            radio: {
                base: 'h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300'
            }
        },
        
        // Alert Styles
        alert: {
            base: 'p-4 rounded-lg border',
            
            variants: {
                success: 'bg-success-50 border-success-200 text-success-800',
                warning: 'bg-warning-50 border-warning-200 text-warning-800',
                error: 'bg-error-50 border-error-200 text-error-800',
                info: 'bg-info-50 border-info-200 text-info-800'
            }
        },
        
        // Badge Styles
        badge: {
            base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            
            variants: {
                primary: 'bg-primary-100 text-primary-800',
                secondary: 'bg-secondary-100 text-secondary-800',
                success: 'bg-success-100 text-success-800',
                warning: 'bg-warning-100 text-warning-800',
                error: 'bg-error-100 text-error-800',
                info: 'bg-info-100 text-info-800'
            },
            
            sizes: {
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-2.5 py-0.5 text-sm',
                lg: 'px-3 py-1 text-base'
            }
        },
        
        // Table Styles
        table: {
            base: 'min-w-full divide-y divide-neutral-200',
            header: 'bg-neutral-50',
            row: {
                base: 'hover:bg-neutral-50 transition-colors',
                striped: 'even:bg-neutral-50'
            },
            cell: {
                base: 'px-6 py-4 whitespace-nowrap text-sm',
                header: 'px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider'
            }
        },
        
        // Modal Styles
        modal: {
            overlay: 'fixed inset-0 bg-black bg-opacity-50 transition-opacity',
            container: 'fixed inset-0 overflow-y-auto',
            content: {
                base: 'relative bg-white rounded-lg shadow-xl mx-auto my-8 max-w-lg',
                sizes: {
                    sm: 'max-w-md',
                    md: 'max-w-lg',
                    lg: 'max-w-2xl',
                    xl: 'max-w-4xl',
                    full: 'max-w-full mx-4'
                }
            },
            header: 'px-6 py-4 border-b border-neutral-200',
            body: 'px-6 py-4',
            footer: 'px-6 py-4 border-t border-neutral-200 bg-neutral-50'
        },
        
        // Navigation Styles
        navigation: {
            header: {
                base: 'bg-primary-900 text-white shadow-md',
                height: '4rem', // 64px
                zIndex: 50
            },
            
            sidebar: {
                base: 'bg-white border-r border-neutral-200',
                width: {
                    collapsed: '4rem',
                    expanded: '16rem'
                }
            },
            
            menu: {
                item: {
                    base: 'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    active: 'bg-primary-50 text-primary-700',
                    inactive: 'text-neutral-600 hover:bg-neutral-50',
                    icon: 'mr-3 h-5 w-5'
                }
            }
        },
        
        // Footer Styles
        footer: {
            base: 'bg-neutral-800 text-white',
            column: {
                title: 'text-lg font-semibold mb-4',
                link: 'text-neutral-300 hover:text-white transition-colors'
            }
        }
    },

    // ============================================
    // 3️⃣ LAYOUT SYSTEM
    // ============================================
    layout: {
        // Container widths
        container: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
        },
        
        // Grid system
        grid: {
            columns: 12,
            gap: {
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem'
            }
        },
        
        // Breakpoints
        breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
        },
        
        // Spacing system
        spacingSystem: {
            section: {
                sm: '3rem 0',
                md: '5rem 0',
                lg: '8rem 0',
                xl: '12rem 0'
            },
            
            container: {
                padding: {
                    sm: '1rem',
                    md: '1.5rem',
                    lg: '2rem',
                    xl: '2.5rem'
                }
            }
        }
    },

    // ============================================
    // 4️⃣ TYPOGRAPHY SYSTEM
    // ============================================
    typographySystem: {
        // Headings
        headings: {
            h1: {
                fontSize: '3rem',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                color: 'primary.900'
            },
            h2: {
                fontSize: '2.25rem',
                fontWeight: 600,
                lineHeight: 1.3,
                letterSpacing: '-0.025em',
                color: 'primary.800'
            },
            h3: {
                fontSize: '1.875rem',
                fontWeight: 600,
                lineHeight: 1.4,
                letterSpacing: '-0.025em',
                color: 'primary.700'
            },
            h4: {
                fontSize: '1.5rem',
                fontWeight: 600,
                lineHeight: 1.5,
                letterSpacing: '-0.025em',
                color: 'primary.700'
            },
            h5: {
                fontSize: '1.25rem',
                fontWeight: 600,
                lineHeight: 1.6,
                color: 'primary.700'
            },
            h6: {
                fontSize: '1rem',
                fontWeight: 600,
                lineHeight: 1.6,
                color: 'primary.700'
            }
        },
        
        // Body text
        body: {
            large: {
                fontSize: '1.125rem',
                lineHeight: 1.7,
                color: 'neutral.700'
            },
            base: {
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'neutral.600'
            },
            small: {
                fontSize: '0.875rem',
                lineHeight: 1.5,
                color: 'neutral.500'
            },
            xsmall: {
                fontSize: '0.75rem',
                lineHeight: 1.4,
                color: 'neutral.400'
            }
        },
        
        // Special text
        special: {
            lead: {
                fontSize: '1.25rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'neutral.600'
            },
            quote: {
                fontSize: '1.125rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: 'neutral.600',
                borderLeft: '4px solid primary.500',
                paddingLeft: '1rem'
            },
            code: {
                fontFamily: 'mono',
                fontSize: '0.875em',
                color: 'error.600',
                backgroundColor: 'neutral.100',
                padding: '0.2em 0.4em',
                borderRadius: '0.25rem'
            }
        }
    },

    // ============================================
    // 5️⃣ ANIMATIONS & TRANSITIONS
    // ============================================
    animations: {
        // Transition timings
        transitions: {
            fast: '150ms',
            base: '300ms',
            slow: '500ms',
            verySlow: '1000ms'
        },
        
        // Easing functions
        easing: {
            linear: 'linear',
            ease: 'ease',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        },
        
        // Keyframe animations
        keyframes: {
            fadeIn: {
                from: { opacity: 0 },
                to: { opacity: 1 }
            },
            fadeOut: {
                from: { opacity: 1 },
                to: { opacity: 0 }
            },
            slideInUp: {
                from: { transform: 'translateY(20px)', opacity: 0 },
                to: { transform: 'translateY(0)', opacity: 1 }
            },
            slideInDown: {
                from: { transform: 'translateY(-20px)', opacity: 0 },
                to: { transform: 'translateY(0)', opacity: 1 }
            },
            slideInLeft: {
                from: { transform: 'translateX(-20px)', opacity: 0 },
                to: { transform: 'translateX(0)', opacity: 1 }
            },
            slideInRight: {
                from: { transform: 'translateX(20px)', opacity: 0 },
                to: { transform: 'translateX(0)', opacity: 1 }
            },
            scaleIn: {
                from: { transform: 'scale(0.95)', opacity: 0 },
                to: { transform: 'scale(1)', opacity: 1 }
            },
            pulse: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 }
            },
            bounce: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-25%)' }
            },
            spin: {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' }
            },
            ping: {
                '75%, 100%': { transform: 'scale(2)', opacity: 0 }
            }
        },
        
        // Animation classes
        animationClasses: {
            fadeIn: 'animate-fadeIn 300ms ease-in-out',
            fadeOut: 'animate-fadeOut 300ms ease-in-out',
            slideInUp: 'animate-slideInUp 300ms ease-out',
            slideInDown: 'animate-slideInDown 300ms ease-out',
            slideInLeft: 'animate-slideInLeft 300ms ease-out',
            slideInRight: 'animate-slideInRight 300ms ease-out',
            scaleIn: 'animate-scaleIn 300ms ease-out',
            pulse: 'animate-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            bounce: 'animate-bounce 1s infinite',
            spin: 'animate-spin 1s linear infinite',
            ping: 'animate-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
        }
    },

    // ============================================
    // 6️⃣ RESPONSIVE DESIGN
    // ============================================
    responsive: {
        // Mobile-first breakpoints
        breakpoints: {
            xs: {
                min: '0px',
                max: '639px',
                container: '100%'
            },
            sm: {
                min: '640px',
                max: '767px',
                container: '640px'
            },
            md: {
                min: '768px',
                max: '1023px',
                container: '768px'
            },
            lg: {
                min: '1024px',
                max: '1279px',
                container: '1024px'
            },
            xl: {
                min: '1280px',
                max: '1535px',
                container: '1280px'
            },
            '2xl': {
                min: '1536px',
                max: null,
                container: '1536px'
            }
        },
        
        // Responsive utilities
        utilities: {
            hide: {
                xs: 'hidden',
                sm: 'sm:hidden',
                md: 'md:hidden',
                lg: 'lg:hidden',
                xl: 'xl:hidden',
                '2xl': '2xl:hidden'
            },
            show: {
                xs: 'block',
                sm: 'sm:block',
                md: 'md:block',
                lg: 'lg:block',
                xl: 'xl:block',
                '2xl': '2xl:block'
            },
            textAlign: {
                left: {
                    xs: 'text-left',
                    sm: 'sm:text-left',
                    md: 'md:text-left',
                    lg: 'lg:text-left',
                    xl: 'xl:text-left'
                },
                center: {
                    xs: 'text-center',
                    sm: 'sm:text-center',
                    md: 'md:text-center',
                    lg: 'lg:text-center',
                    xl: 'xl:text-center'
                },
                right: {
                    xs: 'text-right',
                    sm: 'sm:text-right',
                    md: 'md:text-right',
                    lg: 'lg:text-right',
                    xl: 'xl:text-right'
                }
            }
        },
        
        // Grid responsive columns
        gridColumns: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 6,
            '2xl': 8
        }
    },

    // ============================================
    // 7️⃣ ACCESSIBILITY
    // ============================================
    accessibility: {
        // Focus styles
        focus: {
            outline: '2px solid primary.500',
            outlineOffset: '2px',
            ring: '0 0 0 3px rgba(0, 102, 255, 0.5)',
            ringOffset: '2px'
        },
        
        // Reduced motion
        reducedMotion: {
            '@media (prefers-reduced-motion: reduce)': {
                '*': {
                    animationDuration: '0.01ms',
                    animationIterationCount: '1',
                    transitionDuration: '0.01ms'
                }
            }
        },
        
        // Screen reader only
        srOnly: {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: '0'
        },
        
        // Skip to main content
        skipToContent: {
            position: 'absolute',
            top: '-40px',
            left: '0',
            background: 'primary.600',
            color: 'white',
            padding: '8px 16px',
            zIndex: 9999,
            textDecoration: 'none',
            '&:focus': {
                top: '0'
            }
        },
        
        // Color contrast requirements
        contrast: {
            text: {
                normal: '4.5:1',
                large: '3:1'
            },
            ui: {
                nonText: '3:1'
            }
        }
    },

    // ============================================
    // 8️⃣ DARK MODE
    // ============================================
    darkMode: {
        enabled: true,
        strategy: 'class', // or 'media'
        
        colors: {
            background: {
                primary: 'neutral.900',
                secondary: 'neutral.800',
                tertiary: 'neutral.700'
            },
            
            text: {
                primary: 'neutral.100',
                secondary: 'neutral.300',
                tertiary: 'neutral.400'
            },
            
            border: {
                primary: 'neutral.700',
                secondary: 'neutral.600'
            }
        },
        
        components: {
            card: {
                base: 'bg-neutral-800 border-neutral-700',
                variants: {
                    default: 'border-neutral-700',
                    elevated: 'shadow-lg border-0 bg-neutral-800',
                    outline: 'border-2 border-primary-600',
                    glow: 'shadow-glow border-0 bg-neutral-800'
                }
            },
            
            input: {
                base: 'bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400',
                variants: {
                    default: 'border-neutral-600',
                    error: 'border-error-500 bg-error-900',
                    success: 'border-success-500 bg-success-900',
                    disabled: 'border-neutral-700 bg-neutral-900 text-neutral-500'
                }
            }
        }
    },

    // ============================================
    // 9️⃣ ICON SYSTEM
    // ============================================
    icons: {
        // Icon sizes
        sizes: {
            xs: '1rem',
            sm: '1.25rem',
            md: '1.5rem',
            lg: '2rem',
            xl: '3rem',
            '2xl': '4rem'
        },
        
        // Icon colors
        colors: {
            primary: 'primary.600',
            secondary: 'secondary.600',
            success: 'success.500',
            warning: 'warning.500',
            error: 'error.500',
            info: 'info.500',
            white: 'white',
            black: 'black'
        },
        
        // Icon library
        library: {
            // System icons
            system: {
                home: '🏠',
                dashboard: '📊',
                profile: '👤',
                settings: '⚙️',
                logout: '🚪',
                notification: '🔔',
                search: '🔍',
                menu: '☰',
                close: '×',
                arrow: {
                    up: '↑',
                    down: '↓',
                    left: '←',
                    right: '→'
                }
            },
            
            // Financial icons
            financial: {
                money: '💰',
                loan: '📝',
                repayment: '💳',
                interest: '📈',
                debt: '📉',
                savings: '🏦',
                investment: '📊',
                wallet: '👛'
            },
            
            // Emergency categories icons
            emergency: {
                fare: '🚌',
                data: '📶',
                gas: '🔥',
                food: '🍲',
                water: '🚰',
                electricity: '⚡',
                wifi: '📡',
                tv: '📺',
                fuel: '⛽',
                repair: '🔧',
                credo: '🛠️',
                sales: '🧾',
                capital: '🏪',
                soko: '🛒',
                kidandaski: '🏗️',
                hawker: '🚶‍♂️',
                fuliziwa: '🔄',
                medicine: '💊',
                school: '🎓',
                advance: '💸'
            },
            
            // Role icons
            role: {
                borrower: '💼',
                lender: '🌱',
                admin: '🛡️',
                groupAdmin: '👑'
            },
            
            // Status icons
            status: {
                active: '🟢',
                pending: '🟡',
                completed: '✅',
                cancelled: '❌',
                overdue: '🔴',
                warning: '⚠️',
                info: 'ℹ️',
                success: '✓',
                error: '✗'
            }
        }
    },

    // ============================================
    // 🔟 ETHIOPIA-SPECIFIC THEMING
    // ============================================
    ethiopiaSpecific: {
        // Cultural colors
        culturalPalette: {
            traditional: {
                green: '#078930', // Ethiopian green
                yellow: '#fcdd09', // Ethiopian yellow
                red: '#da121a',   // Ethiopian red
                blue: '#0F47AF'   // Ethiopian blue
            },
            
            patterns: {
                basketWeave: 'repeating-linear-gradient(45deg, #d4b483, #d4b483 10px, #8b7355 10px, #8b7355 20px)',
                crossPattern: 'radial-gradient(circle at 10px 10px, #c84c09 2px, transparent 2px)'
            }
        },
        
        // Localized typography
        localizedTypography: {
            amharic: {
                fontFamily: "'Noto Sans Ethiopic', 'Inter', sans-serif",
                lineHeight: 1.8,
                letterSpacing: 'normal'
            },
            
            oromo: {
                fontFamily: "'Noto Sans Ethiopic', 'Inter', sans-serif",
                lineHeight: 1.8,
                letterSpacing: 'normal'
            }
        },
        
        // Holiday themes
        holidayThemes: {
            enkutatash: {
                colors: {
                    primary: '#da121a', // Red
                    secondary: '#fcdd09', // Yellow
                    accent: '#078930' // Green
                },
                patterns: ['🌼', '🌻', '🌸']
            },
            
            timkat: {
                colors: {
                    primary: '#0F47AF', // Blue
                    secondary: '#ffffff', // White
                    accent: '#fcdd09' // Yellow
                },
                patterns: ['✝️', '💦', '🙏']
            }
        },
        
        // Regional variations
        regionalVariations: {
            addisAbaba: {
                colors: {
                    primary: '#0F47AF', // Metropolitan blue
                    accent: '#c84c09' // Berbere spice
                }
            },
            
            bahirDar: {
                colors: {
                    primary: '#078930', // Lake green
                    accent: '#0F47AF' // Blue Nile blue
                }
            },
            
            hawassa: {
                colors: {
                    primary: '#da121a', // Lake red
                    accent: '#fcdd09' // Sunshine yellow
                }
            }
        }
    },

    // ============================================
    // 1️⃣1️⃣ UTILITY CLASSES
    // ============================================
    utilityClasses: {
        // Layout
        layout: {
            container: 'mx-auto px-4 sm:px-6 lg:px-8',
            section: 'py-12 sm:py-16 lg:py-20',
            grid: 'grid grid-cols-1 gap-6',
            flex: {
                center: 'flex items-center justify-center',
                between: 'flex items-center justify-between',
                start: 'flex items-center justify-start',
                end: 'flex items-center justify-end'
            }
        },
        
        // Spacing
        spacing: {
            mt: (value) => `mt-${value}`,
            mb: (value) => `mb-${value}`,
            ml: (value) => `ml-${value}`,
            mr: (value) => `mr-${value}`,
            mx: (value) => `mx-${value}`,
            my: (value) => `my-${value}`,
            p: (value) => `p-${value}`,
            px: (value) => `px-${value}`,
            py: (value) => `py-${value}`
        },
        
        // Typography
        typography: {
            heading: (level) => `text-${level} font-bold text-primary-900`,
            body: (size = 'base') => `text-${size} text-neutral-600`,
            link: 'text-primary-600 hover:text-primary-700 underline transition-colors',
            truncate: 'truncate',
            lineClamp: (lines) => `line-clamp-${lines}`
        },
        
        // Background
        background: {
            primary: 'bg-primary-600',
            secondary: 'bg-secondary-600',
            success: 'bg-success-500',
            warning: 'bg-warning-500',
            error: 'bg-error-500',
            info: 'bg-info-500',
            dark: 'bg-neutral-800',
            light: 'bg-neutral-50'
        },
        
        // Border
        border: {
            primary: 'border-primary-600',
            secondary: 'border-secondary-600',
            success: 'border-success-500',
            warning: 'border-warning-500',
            error: 'border-error-500',
            info: 'border-info-500',
            dark: 'border-neutral-800',
            light: 'border-neutral-200'
        },
        
        // Shadow
        shadow: {
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
            xl: 'shadow-xl',
            inner: 'shadow-inner',
            none: 'shadow-none',
            glow: 'shadow-glow'
        },
        
        // Rounded
        rounded: {
            none: 'rounded-none',
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
            xl: 'rounded-xl',
            '2xl': 'rounded-2xl',
            full: 'rounded-full'
        }
    },

    // ============================================
    // 1️⃣2️⃣ THEME VALIDATION
    // ============================================
    validation: {
        // Color contrast validation
        validateContrast: function(textColor, backgroundColor) {
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            };
            
            const getLuminance = (rgb) => {
                const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
                const sRGBAdjusted = sRGB.map(c => 
                    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
                );
                return 0.2126 * sRGBAdjusted[0] + 0.7152 * sRGBAdjusted[1] + 0.0722 * sRGBAdjusted[2];
            };
            
            const rgb1 = hexToRgb(textColor);
            const rgb2 = hexToRgb(backgroundColor);
            
            if (!rgb1 || !rgb2) return null;
            
            const l1 = getLuminance(rgb1);
            const l2 = getLuminance(rgb2);
            
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            
            return (lighter + 0.05) / (darker + 0.05);
        },
        
        // WCAG compliance check
        checkWCAGCompliance: function() {
            const checks = [];
            
            // Check primary text contrast
            const primaryContrast = this.validateContrast('#1f2937', '#ffffff');
            if (primaryContrast && primaryContrast >= 4.5) {
                checks.push({ check: 'Primary text contrast', passed: true, ratio: primaryContrast });
            } else {
                checks.push({ check: 'Primary text contrast', passed: false, ratio: primaryContrast });
            }
            
            // Check button contrast
            const buttonContrast = this.validateContrast('#ffffff', '#0066ff');
            if (buttonContrast && buttonContrast >= 4.5) {
                checks.push({ check: 'Button contrast', passed: true, ratio: buttonContrast });
            } else {
                checks.push({ check: 'Button contrast', passed: false, ratio: buttonContrast });
            }
            
            // Check error color contrast
            const errorContrast = this.validateContrast('#ffffff', '#ef4444');
            if (errorContrast && errorContrast >= 4.5) {
                checks.push({ check: 'Error color contrast', passed: true, ratio: errorContrast });
            } else {
                checks.push({ check: 'Error color contrast', passed: false, ratio: errorContrast });
            }
            
            return {
                passed: checks.every(c => c.passed),
                checks,
                timestamp: new Date().toISOString()
            };
        }
    },

    // ============================================
    // 1️⃣3️⃣ THEME EXPORT UTILITIES
    // ============================================
    export: {
        // Export as CSS custom properties
        toCSS: function() {
            let css = ':root {\n';
            
            // Export colors
            Object.entries(this.tokens.colors).forEach(([category, shades]) => {
                if (typeof shades === 'object') {
                    Object.entries(shades).forEach(([shade, value]) => {
                        css += `  --color-${category}-${shade}: ${value};\n`;
                    });
                }
            });
            
            // Export spacing
            Object.entries(this.tokens.spacing).forEach(([size, value]) => {
                css += `  --spacing-${size}: ${value};\n`;
            });
            
            // Export typography
            Object.entries(this.tokens.typography.fontSize).forEach(([size, value]) => {
                css += `  --font-size-${size}: ${value};\n`;
            });
            
            css += '}\n\n';
            
            // Export dark mode
            css += '.dark {\n';
            Object.entries(this.darkMode.colors.background).forEach(([type, value]) => {
                css += `  --color-background-${type}: var(--color-neutral-${value.split('.')[1]});\n`;
            });
            css += '}\n';
            
            return css;
        },
        
        // Export as Tailwind config
        toTailwindConfig: function() {
            return {
                theme: {
                    extend: {
                        colors: this.tokens.colors,
                        spacing: this.tokens.spacing,
                        borderRadius: this.tokens.borderRadius,
                        boxShadow: this.tokens.boxShadow,
                        fontFamily: this.tokens.typography.fontFamily,
                        fontSize: this.tokens.typography.fontSize,
                        fontWeight: this.tokens.typography.fontWeight,
                        lineHeight: this.tokens.typography.lineHeight,
                        letterSpacing: this.tokens.typography.letterSpacing
                    }
                }
            };
        },
        
        // Export as design tokens JSON
        toDesignTokens: function() {
            return {
                version: '1.0.0',
                tokens: this.tokens,
                components: this.components,
                typography: this.typographySystem,
                animations: this.animations,
                responsive: this.responsive,
                darkMode: this.darkMode,
                metadata: {
                    generated: new Date().toISOString(),
                    country: 'Ethiopia',
                    platform: 'M-Pesewa'
                }
            };
        }
    },

    // ============================================
    // 1️⃣4️⃣ THEME BUILDER
    // ============================================
    builder: {
        // Create custom theme variant
        createVariant: function(variantName, overrides) {
            const variant = JSON.parse(JSON.stringify(this));
            
            // Apply overrides
            const deepMerge = (target, source) => {
                for (const key in source) {
                    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        if (!target[key]) target[key] = {};
                        deepMerge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
                return target;
            };
            
            return deepMerge(variant, overrides);
        },
        
        // Generate theme CSS
        generateCSS: function(options = {}) {
            const { minify = false, includeReset = true, includeUtilities = true } = options;
            
            let css = '';
            
            // CSS Reset
            if (includeReset) {
                css += `
                    /* CSS Reset */
                    *, *::before, *::after {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }
                    
                    html {
                        font-size: 16px;
                        -webkit-text-size-adjust: 100%;
                    }
                    
                    body {
                        font-family: ${this.tokens.typography.fontFamily.sans.join(', ')};
                        line-height: 1.6;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }
                `;
            }
            
            // CSS Custom Properties
            css += this.export.toCSS();
            
            // Utility Classes
            if (includeUtilities) {
                css += this.generateUtilityClasses();
            }
            
            // Component Styles
            css += this.generateComponentStyles();
            
            // Responsive Styles
            css += this.generateResponsiveStyles();
            
            // Dark Mode
            css += this.generateDarkModeStyles();
            
            // Animations
            css += this.generateAnimationStyles();
            
            // Accessibility
            css += this.generateAccessibilityStyles();
            
            if (minify) {
                css = css.replace(/\s+/g, ' ').replace(/\/\*.*?\*\//g, '').trim();
            }
            
            return css;
        },
        
        // Generate utility classes
        generateUtilityClasses: function() {
            return `
                /* Utility Classes */
                .container {
                    width: 100%;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 1rem;
                    padding-right: 1rem;
                }
                
                @media (min-width: 640px) {
                    .container {
                        max-width: 640px;
                    }
                }
                
                @media (min-width: 768px) {
                    .container {
                        max-width: 768px;
                    }
                }
                
                @media (min-width: 1024px) {
                    .container {
                        max-width: 1024px;
                    }
                }
                
                @media (min-width: 1280px) {
                    .container {
                        max-width: 1280px;
                    }
                }
                
                @media (min-width: 1536px) {
                    .container {
                        max-width: 1536px;
                    }
                }
                
                /* Spacing Utilities */
                .mt-1 { margin-top: 0.25rem; }
                .mt-2 { margin-top: 0.5rem; }
                .mt-3 { margin-top: 0.75rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-5 { margin-top: 1.25rem; }
                .mt-6 { margin-top: 1.5rem; }
                .mt-8 { margin-top: 2rem; }
                .mt-10 { margin-top: 2.5rem; }
                .mt-12 { margin-top: 3rem; }
                
                .mb-1 { margin-bottom: 0.25rem; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-3 { margin-bottom: 0.75rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-5 { margin-bottom: 1.25rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-10 { margin-bottom: 2.5rem; }
                .mb-12 { margin-bottom: 3rem; }
                
                .p-1 { padding: 0.25rem; }
                .p-2 { padding: 0.5rem; }
                .p-3 { padding: 0.75rem; }
                .p-4 { padding: 1rem; }
                .p-5 { padding: 1.25rem; }
                .p-6 { padding: 1.5rem; }
                .p-8 { padding: 2rem; }
                .p-10 { padding: 2.5rem; }
                .p-12 { padding: 3rem; }
                
                /* Text Utilities */
                .text-xs { font-size: 0.75rem; }
                .text-sm { font-size: 0.875rem; }
                .text-base { font-size: 1rem; }
                .text-lg { font-size: 1.125rem; }
                .text-xl { font-size: 1.25rem; }
                .text-2xl { font-size: 1.5rem; }
                .text-3xl { font-size: 1.875rem; }
                .text-4xl { font-size: 2.25rem; }
                .text-5xl { font-size: 3rem; }
                .text-6xl { font-size: 3.75rem; }
                
                .font-light { font-weight: 300; }
                .font-normal { font-weight: 400; }
                .font-medium { font-weight: 500; }
                .font-semibold { font-weight: 600; }
                .font-bold { font-weight: 700; }
                .font-extrabold { font-weight: 800; }
                
                .text-primary { color: var(--color-primary-600); }
                .text-secondary { color: var(--color-secondary-600); }
                .text-success { color: var(--color-semantic-success-500); }
                .text-warning { color: var(--color-semantic-warning-500); }
                .text-error { color: var(--color-semantic-error-500); }
                .text-info { color: var(--color-semantic-info-500); }
                
                /* Background Utilities */
                .bg-primary { background-color: var(--color-primary-600); }
                .bg-secondary { background-color: var(--color-secondary-600); }
                .bg-success { background-color: var(--color-semantic-success-500); }
                .bg-warning { background-color: var(--color-semantic-warning-500); }
                .bg-error { background-color: var(--color-semantic-error-500); }
                .bg-info { background-color: var(--color-semantic-info-500); }
                .bg-dark { background-color: var(--color-neutral-800); }
                .bg-light { background-color: var(--color-neutral-50); }
                
                /* Border Utilities */
                .border { border-width: 1px; }
                .border-2 { border-width: 2px; }
                .border-primary { border-color: var(--color-primary-600); }
                .border-secondary { border-color: var(--color-secondary-600); }
                .border-success { border-color: var(--color-semantic-success-500); }
                .border-warning { border-color: var(--color-semantic-warning-500); }
                .border-error { border-color: var(--color-semantic-error-500); }
                .border-info { border-color: var(--color-semantic-info-500); }
                .border-dark { border-color: var(--color-neutral-800); }
                .border-light { border-color: var(--color-neutral-200); }
                
                /* Rounded Utilities */
                .rounded-none { border-radius: 0; }
                .rounded-sm { border-radius: 0.125rem; }
                .rounded { border-radius: 0.25rem; }
                .rounded-md { border-radius: 0.375rem; }
                .rounded-lg { border-radius: 0.5rem; }
                .rounded-xl { border-radius: 0.75rem; }
                .rounded-2xl { border-radius: 1rem; }
                .rounded-full { border-radius: 9999px; }
                
                /* Shadow Utilities */
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
                .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
                .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
                .shadow-glow { box-shadow: 0 0 20px rgba(0, 153, 255, 0.3); }
                .shadow-none { box-shadow: none; }
                
                /* Display Utilities */
                .block { display: block; }
                .inline-block { display: inline-block; }
                .inline { display: inline; }
                .flex { display: flex; }
                .inline-flex { display: inline-flex; }
                .grid { display: grid; }
                .hidden { display: none; }
                
                /* Flex Utilities */
                .flex-1 { flex: 1 1 0%; }
                .flex-auto { flex: 1 1 auto; }
                .flex-initial { flex: 0 1 auto; }
                .flex-none { flex: none; }
                
                .flex-row { flex-direction: row; }
                .flex-col { flex-direction: column; }
                
                .items-start { align-items: flex-start; }
                .items-center { align-items: center; }
                .items-end { align-items: flex-end; }
                .items-stretch { align-items: stretch; }
                
                .justify-start { justify-content: flex-start; }
                .justify-center { justify-content: center; }
                .justify-end { justify-content: flex-end; }
                .justify-between { justify-content: space-between; }
                .justify-around { justify-content: space-around; }
                .justify-evenly { justify-content: space-evenly; }
                
                /* Grid Utilities */
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
                .grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
                .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
                
                .gap-1 { gap: 0.25rem; }
                .gap-2 { gap: 0.5rem; }
                .gap-3 { gap: 0.75rem; }
                .gap-4 { gap: 1rem; }
                .gap-5 { gap: 1.25rem; }
                .gap-6 { gap: 1.5rem; }
                .gap-8 { gap: 2rem; }
                
                /* Position Utilities */
                .static { position: static; }
                .fixed { position: fixed; }
                .absolute { position: absolute; }
                .relative { position: relative; }
                .sticky { position: sticky; }
                
                .top-0 { top: 0; }
                .right-0 { right: 0; }
                .bottom-0 { bottom: 0; }
                .left-0 { left: 0; }
                
                .z-0 { z-index: 0; }
                .z-10 { z-index: 10; }
                .z-20 { z-index: 20; }
                .z-30 { z-index: 30; }
                .z-40 { z-index: 40; }
                .z-50 { z-index: 50; }
                .z-auto { z-index: auto; }
                
                /* Opacity Utilities */
                .opacity-0 { opacity: 0; }
                .opacity-25 { opacity: 0.25; }
                .opacity-50 { opacity: 0.5; }
                .opacity-75 { opacity: 0.75; }
                .opacity-100 { opacity: 1; }
                
                /* Cursor Utilities */
                .cursor-pointer { cursor: pointer; }
                .cursor-default { cursor: default; }
                .cursor-not-allowed { cursor: not-allowed; }
                .cursor-wait { cursor: wait; }
                .cursor-text { cursor: text; }
                .cursor-move { cursor: move; }
                
                /* User Select Utilities */
                .select-none { user-select: none; }
                .select-text { user-select: text; }
                .select-all { user-select: all; }
                .select-auto { user-select: auto; }
                
                /* Overflow Utilities */
                .overflow-auto { overflow: auto; }
                .overflow-hidden { overflow: hidden; }
                .overflow-visible { overflow: visible; }
                .overflow-scroll { overflow: scroll; }
                .overflow-x-auto { overflow-x: auto; }
                .overflow-y-auto { overflow-y: auto; }
                .overflow-x-hidden { overflow-x: hidden; }
                .overflow-y-hidden { overflow-y: hidden; }
                .overflow-x-scroll { overflow-x: scroll; }
                .overflow-y-scroll { overflow-y: scroll; }
                
                /* Text Overflow Utilities */
                .truncate {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .overflow-ellipsis { text-overflow: ellipsis; }
                .overflow-clip { text-overflow: clip; }
                
                /* Visibility Utilities */
                .visible { visibility: visible; }
                .invisible { visibility: hidden; }
                
                /* Screen Reader Only */
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
            `;
        },
        
        // Generate component styles
        generateComponentStyles: function() {
            return `
                /* Component Styles */
                
                /* Buttons */
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 500;
                    border-radius: 0.5rem;
                    transition: all 150ms;
                    outline: none;
                    border: none;
                    cursor: pointer;
                }
                
                .btn:focus {
                    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.5);
                }
                
                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .btn-xs {
                    padding: 0.5rem 1rem;
                    font-size: 0.75rem;
                }
                
                .btn-sm {
                    padding: 0.625rem 1.25rem;
                    font-size: 0.875rem;
                }
                
                .btn-md {
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                }
                
                .btn-lg {
                    padding: 0.875rem 1.75rem;
                    font-size: 1.125rem;
                }
                
                .btn-xl {
                    padding: 1rem 2rem;
                    font-size: 1.25rem;
                }
                
                .btn-primary {
                    background-color: var(--color-primary-600);
                    color: white;
                }
                
                .btn-primary:hover {
                    background-color: var(--color-primary-700);
                }
                
                .btn-secondary {
                    background-color: var(--color-secondary-600);
                    color: white;
                }
                
                .btn-secondary:hover {
                    background-color: var(--color-secondary-700);
                }
                
                .btn-borrower {
                    background-color: var(--color-accent-borrower-500);
                    color: white;
                }
                
                .btn-borrower:hover {
                    background-color: var(--color-accent-borrower-600);
                }
                
                .btn-lender {
                    background-color: var(--color-accent-lender-500);
                    color: white;
                }
                
                .btn-lender:hover {
                    background-color: var(--color-accent-lender-600);
                }
                
                .btn-outline {
                    background-color: transparent;
                    border: 2px solid var(--color-primary-600);
                    color: var(--color-primary-600);
                }
                
                .btn-outline:hover {
                    background-color: var(--color-primary-50);
                }
                
                .btn-ghost {
                    background-color: transparent;
                    color: var(--color-primary-600);
                }
                
                .btn-ghost:hover {
                    background-color: var(--color-primary-50);
                }
                
                .btn-danger {
                    background-color: var(--color-semantic-error-600);
                    color: white;
                }
                
                .btn-danger:hover {
                    background-color: var(--color-semantic-error-700);
                }
                
                /* Cards */
                .card {
                    background-color: white;
                    border-radius: 0.75rem;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    overflow: hidden;
                    transition: all 300ms;
                }
                
                .card:hover {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                
                .card-default {
                    border: 1px solid var(--color-neutral-200);
                }
                
                .card-elevated {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    border: none;
                }
                
                .card-outline {
                    border: 2px solid var(--color-primary-200);
                }
                
                .card-glow {
                    box-shadow: 0 0 20px rgba(0, 153, 255, 0.3);
                    border: none;
                }
                
                .card-dark {
                    background-color: var(--color-neutral-800);
                    color: white;
                }
                
                .card-sm {
                    padding: 1rem;
                }
                
                .card-md {
                    padding: 1.5rem;
                }
                
                .card-lg {
                    padding: 2rem;
                }
                
                /* Forms */
                .form-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--color-neutral-700);
                    margin-bottom: 0.5rem;
                }
                
                .form-label.required::after {
                    content: "*";
                    margin-left: 0.25rem;
                    color: var(--color-semantic-error-500);
                }
                
                .form-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--color-neutral-300);
                    border-radius: 0.5rem;
                    background-color: white;
                    font-size: 1rem;
                    transition: all 150ms;
                    outline: none;
                }
                
                .form-input:focus {
                    border-color: var(--color-primary-500);
                    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
                }
                
                .form-input.error {
                    border-color: var(--color-semantic-error-500);
                    background-color: var(--color-semantic-error-50);
                }
                
                .form-input.success {
                    border-color: var(--color-semantic-success-500);
                    background-color: var(--color-semantic-success-50);
                }
                
                .form-input:disabled {
                    border-color: var(--color-neutral-200);
                    background-color: var(--color-neutral-100);
                    color: var(--color-neutral-500);
                    cursor: not-allowed;
                }
                
                .form-input-sm {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                }
                
                .form-input-lg {
                    padding: 1rem 1.25rem;
                    font-size: 1.125rem;
                }
                
                .form-select {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--color-neutral-300);
                    border-radius: 0.5rem;
                    background-color: white;
                    font-size: 1rem;
                    transition: all 150ms;
                    outline: none;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                }
                
                .form-select:focus {
                    border-color: var(--color-primary-500);
                    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
                }
                
                .form-checkbox {
                    width: 1rem;
                    height: 1rem;
                    border: 1px solid var(--color-neutral-300);
                    border-radius: 0.25rem;
                    background-color: white;
                    transition: all 150ms;
                    outline: none;
                    cursor: pointer;
                }
                
                .form-checkbox:checked {
                    background-color: var(--color-primary-600);
                    border-color: var(--color-primary-600);
                }
                
                .form-checkbox:focus {
                    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
                }
                
                .form-radio {
                    width: 1rem;
                    height: 1rem;
                    border: 1px solid var(--color-neutral-300);
                    border-radius: 9999px;
                    background-color: white;
                    transition: all 150ms;
                    outline: none;
                    cursor: pointer;
                }
                
                .form-radio:checked {
                    background-color: var(--color-primary-600);
                    border-color: var(--color-primary-600);
                }
                
                .form-radio:focus {
                    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
                }
                
                /* Alerts */
                .alert {
                    padding: 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid;
                }
                
                .alert-success {
                    background-color: var(--color-semantic-success-50);
                    border-color: var(--color-semantic-success-200);
                    color: var(--color-semantic-success-800);
                }
                
                .alert-warning {
                    background-color: var(--color-semantic-warning-50);
                    border-color: var(--color-semantic-warning-200);
                    color: var(--color-semantic-warning-800);
                }
                
                .alert-error {
                    background-color: var(--color-semantic-error-50);
                    border-color: var(--color-semantic-error-200);
                    color: var(--color-semantic-error-800);
                }
                
                .alert-info {
                    background-color: var(--color-semantic-info-50);
                    border-color: var(--color-semantic-info-200);
                    color: var(--color-semantic-info-800);
                }
                
                /* Badges */
                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                
                .badge-sm {
                    padding: 0.125rem 0.5rem;
                    font-size: 0.625rem;
                }
                
                .badge-lg {
                    padding: 0.375rem 1rem;
                    font-size: 0.875rem;
                }
                
                .badge-primary {
                    background-color: var(--color-primary-100);
                    color: var(--color-primary-800);
                }
                
                .badge-secondary {
                    background-color: var(--color-secondary-100);
                    color: var(--color-secondary-800);
                }
                
                .badge-success {
                    background-color: var(--color-semantic-success-100);
                    color: var(--color-semantic-success-800);
                }
                
                .badge-warning {
                    background-color: var(--color-semantic-warning-100);
                    color: var(--color-semantic-warning-800);
                }
                
                .badge-error {
                    background-color: var(--color-semantic-error-100);
                    color: var(--color-semantic-error-800);
                }
                
                .badge-info {
                    background-color: var(--color-semantic-info-100);
                    color: var(--color-semantic-info-800);
                }
                
                /* Tables */
                .table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .table thead {
                    background-color: var(--color-neutral-50);
                }
                
                .table th {
                    padding: 0.75rem 1.5rem;
                    text-align: left;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: var(--color-neutral-500);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .table td {
                    padding: 1rem 1.5rem;
                    font-size: 0.875rem;
                    color: var(--color-neutral-600);
                    border-top: 1px solid var(--color-neutral-200);
                }
                
                .table tbody tr:hover {
                    background-color: var(--color-neutral-50);
                }
                
                .table-striped tbody tr:nth-child(even) {
                    background-color: var(--color-neutral-50);
                }
                
                /* Modals */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                }
                
                .modal-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    overflow-y: auto;
                    z-index: 50;
                }
                
                .modal-content {
                    position: relative;
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    margin: 2rem auto;
                }
                
                .modal-sm {
                    max-width: 24rem;
                }
                
                .modal-md {
                    max-width: 32rem;
                }
                
                .modal-lg {
                    max-width: 48rem;
                }
                
                .modal-xl {
                    max-width: 64rem;
                }
                
                .modal-full {
                    max-width: 100%;
                    margin: 0;
                    border-radius: 0;
                }
                
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--color-neutral-200);
                }
                
                .modal-body {
                    padding: 1.5rem;
                }
                
                .modal-footer {
                    padding: 1.5rem;
                    border-top: 1px solid var(--color-neutral-200);
                    background-color: var(--color-neutral-50);
                }
                
                /* Navigation */
                .header {
                    background-color: var(--color-primary-900);
                    color: white;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    height: 4rem;
                    z-index: 50;
                }
                
                .sidebar {
                    background-color: white;
                    border-right: 1px solid var(--color-neutral-200);
                }
                
                .sidebar-collapsed {
                    width: 4rem;
                }
                
                .sidebar-expanded {
                    width: 16rem;
                }
                
                .menu-item {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    border-radius: 0.5rem;
                    transition: background-color 150ms;
                }
                
                .menu-item.active {
                    background-color: var(--color-primary-50);
                    color: var(--color-primary-700);
                }
                
                .menu-item.inactive {
                    color: var(--color-neutral-600);
                }
                
                .menu-item.inactive:hover {
                    background-color: var(--color-neutral-50);
                }
                
                .menu-icon {
                    margin-right: 0.75rem;
                    width: 1.25rem;
                    height: 1.25rem;
                }
                
                /* Footer */
                .footer {
                    background-color: var(--color-neutral-800);
                    color: white;
                }
                
                .footer-column-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                .footer-link {
                    color: var(--color-neutral-300);
                    text-decoration: none;
                    transition: color 150ms;
                }
                
                .footer-link:hover {
                    color: var(--color-secondary-500);
                }
            `;
        },
        
        // Generate responsive styles
        generateResponsiveStyles: function() {
            return `
                /* Responsive Styles */
                
                @media (max-width: 640px) {
                    .container {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                    
                    .hidden-xs {
                        display: none !important;
                    }
                    
                    .visible-xs {
                        display: block !important;
                    }
                    
                    .grid-cols-xs-1 {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-xs-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                    
                    .text-xs-left {
                        text-align: left !important;
                    }
                    
                    .text-xs-center {
                        text-align: center !important;
                    }
                    
                    .text-xs-right {
                        text-align: right !important;
                    }
                }
                
                @media (min-width: 641px) and (max-width: 768px) {
                    .hidden-sm {
                        display: none !important;
                    }
                    
                    .visible-sm {
                        display: block !important;
                    }
                    
                    .grid-cols-sm-1 {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-sm-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-sm-3 {
                        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                    }
                    
                    .text-sm-left {
                        text-align: left !important;
                    }
                    
                    .text-sm-center {
                        text-align: center !important;
                    }
                    
                    .text-sm-right {
                        text-align: right !important;
                    }
                }
                
                @media (min-width: 769px) and (max-width: 1024px) {
                    .hidden-md {
                        display: none !important;
                    }
                    
                    .visible-md {
                        display: block !important;
                    }
                    
                    .grid-cols-md-1 {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-md-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-md-3 {
                        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-md-4 {
                        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                    }
                    
                    .text-md-left {
                        text-align: left !important;
                    }
                    
                    .text-md-center {
                        text-align: center !important;
                    }
                    
                    .text-md-right {
                        text-align: right !important;
                    }
                }
                
                @media (min-width: 1025px) and (max-width: 1280px) {
                    .hidden-lg {
                        display: none !important;
                    }
                    
                    .visible-lg {
                        display: block !important;
                    }
                    
                    .grid-cols-lg-1 {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-lg-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-lg-3 {
                        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-lg-4 {
                        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-lg-6 {
                        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
                    }
                    
                    .text-lg-left {
                        text-align: left !important;
                    }
                    
                    .text-lg-center {
                        text-align: center !important;
                    }
                    
                    .text-lg-right {
                        text-align: right !important;
                    }
                }
                
                @media (min-width: 1281px) {
                    .hidden-xl {
                        display: none !important;
                    }
                    
                    .visible-xl {
                        display: block !important;
                    }
                    
                    .grid-cols-xl-1 {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-xl-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-xl-3 {
                        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-xl-4 {
                        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-xl-6 {
                        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-xl-8 {
                        grid-template-columns: repeat(8, minmax(0, 1fr)) !important;
                    }
                    
                    .text-xl-left {
                        text-align: left !important;
                    }
                    
                    .text-xl-center {
                        text-align: center !important;
                    }
                    
                    .text-xl-right {
                        text-align: right !important;
                    }
                }
            `;
        },
        
        // Generate dark mode styles
        generateDarkModeStyles: function() {
            return `
                /* Dark Mode Styles */
                
                .dark .card {
                    background-color: var(--color-neutral-800);
                    border-color: var(--color-neutral-700);
                    color: white;
                }
                
                .dark .card-default {
                    border-color: var(--color-neutral-700);
                }
                
                .dark .card-elevated {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
                }
                
                .dark .card-outline {
                    border-color: var(--color-primary-600);
                }
                
                .dark .card-glow {
                    box-shadow: 0 0 20px rgba(0, 153, 255, 0.2);
                }
                
                .dark .form-input {
                    background-color: var(--color-neutral-800);
                    border-color: var(--color-neutral-600);
                    color: white;
                }
                
                .dark .form-input:focus {
                    border-color: var(--color-primary-500);
                    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.2);
                }
                
                .dark .form-input.error {
                    border-color: var(--color-semantic-error-500);
                    background-color: var(--color-semantic-error-900);
                }
                
                .dark .form-input.success {
                    border-color: var(--color-semantic-success-500);
                    background-color: var(--color-semantic-success-900);
                }
                
                .dark .form-input:disabled {
                    border-color: var(--color-neutral-700);
                    background-color: var(--color-neutral-900);
                    color: var(--color-neutral-500);
                }
                
                .dark .form-select {
                    background-color: var(--color-neutral-800);
                    border-color: var(--color-neutral-600);
                    color: white;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                }
                
                .dark .form-select:focus {
                    border-color: var(--color-primary-500);
                    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.2);
                }
                
                .dark .form-checkbox {
                    background-color: var(--color-neutral-800);
                    border-color: var(--color-neutral-600);
                }
                
                .dark .form-radio {
                    background-color: var(--color-neutral-800);
                    border-color: var(--color-neutral-600);
                }
                
                .dark .alert-success {
                    background-color: var(--color-semantic-success-900);
                    border-color: var(--color-semantic-success-700);
                    color: var(--color-semantic-success-200);
                }
                
                .dark .alert-warning {
                    background-color: var(--color-semantic-warning-900);
                    border-color: var(--color-semantic-warning-700);
                    color: var(--color-semantic-warning-200);
                }
                
                .dark .alert-error {
                    background-color: var(--color-semantic-error-900);
                    border-color: var(--color-semantic-error-700);
                    color: var(--color-semantic-error-200);
                }
                
                .dark .alert-info {
                    background-color: var(--color-semantic-info-900);
                    border-color: var(--color-semantic-info-700);
                    color: var(--color-semantic-info-200);
                }
                
                .dark .badge-primary {
                    background-color: var(--color-primary-900);
                    color: var(--color-primary-200);
                }
                
                .dark .badge-secondary {
                    background-color: var(--color-secondary-900);
                    color: var(--color-secondary-200);
                }
                
                .dark .badge-success {
                    background-color: var(--color-semantic-success-900);
                    color: var(--color-semantic-success-200);
                }
                
                .dark .badge-warning {
                    background-color: var(--color-semantic-warning-900);
                    color: var(--color-semantic-warning-200);
                }
                
                .dark .badge-error {
                    background-color: var(--color-semantic-error-900);
                    color: var(--color-semantic-error-200);
                }
                
                .dark .badge-info {
                    background-color: var(--color-semantic-info-900);
                    color: var(--color-semantic-info-200);
                }
                
                .dark .table thead {
                    background-color: var(--color-neutral-900);
                }
                
                .dark .table th {
                    color: var(--color-neutral-400);
                }
                
                .dark .table td {
                    color: var(--color-neutral-300);
                    border-top-color: var(--color-neutral-700);
                }
                
                .dark .table tbody tr:hover {
                    background-color: var(--color-neutral-800);
                }
                
                .dark .table-striped tbody tr:nth-child(even) {
                    background-color: var(--color-neutral-800);
                }
                
                .dark .modal-content {
                    background-color: var(--color-neutral-800);
                    color: white;
                }
                
                .dark .modal-header {
                    border-bottom-color: var(--color-neutral-700);
                }
                
                .dark .modal-footer {
                    border-top-color: var(--color-neutral-700);
                    background-color: var(--color-neutral-900);
                }
                
                .dark .sidebar {
                    background-color: var(--color-neutral-900);
                    border-right-color: var(--color-neutral-700);
                }
                
                .dark .menu-item.active {
                    background-color: var(--color-primary-900);
                    color: var(--color-primary-200);
                }
                
                .dark .menu-item.inactive {
                    color: var(--color-neutral-300);
                }
                
                .dark .menu-item.inactive:hover {
                    background-color: var(--color-neutral-800);
                }
                
                .dark .footer {
                    background-color: var(--color-neutral-900);
                }
                
                .dark .footer-link {
                    color: var(--color-neutral-400);
                }
                
                .dark .footer-link:hover {
                    color: var(--color-secondary-400);
                }
            `;
        },
        
        // Generate animation styles
        generateAnimationStyles: function() {
            return `
                /* Animation Styles */
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                
                @keyframes slideInUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideInDown {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes scaleIn {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
                
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-25%);
                    }
                }
                
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 300ms ease-in-out;
                }
                
                .animate-fadeOut {
                    animation: fadeOut 300ms ease-in-out;
                }
                
                .animate-slideInUp {
                    animation: slideInUp 300ms ease-out;
                }
                
                .animate-slideInDown {
                    animation: slideInDown 300ms ease-out;
                }
                
                .animate-slideInLeft {
                    animation: slideInLeft 300ms ease-out;
                }
                
                .animate-slideInRight {
                    animation: slideInRight 300ms ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 300ms ease-out;
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                .animate-bounce {
                    animation: bounce 1s infinite;
                }
                
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                
                .animate-ping {
                    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                .transition-fast {
                    transition: all 150ms;
                }
                
                .transition-base {
                    transition: all 300ms;
                }
                
                .transition-slow {
                    transition: all 500ms;
                }
                
                .transition-very-slow {
                    transition: all 1000ms;
                }
                
                .ease-linear {
                    transition-timing-function: linear;
                }
                
                .ease-in {
                    transition-timing-function: ease-in;
                }
                
                .ease-out {
                    transition-timing-function: ease-out;
                }
                
                .ease-in-out {
                    transition-timing-function: ease-in-out;
                }
            `;
        },
        
        // Generate accessibility styles
        generateAccessibilityStyles: function() {
            return `
                /* Accessibility Styles */
                
                .focus-ring {
                    outline: 2px solid var(--color-primary-500);
                    outline-offset: 2px;
                }
                
                .focus-ring:focus {
                    outline: 2px solid var(--color-primary-500);
                    outline-offset: 2px;
                }
                
                .focus-ring:focus:not(:focus-visible) {
                    outline: none;
                }
                
                .focus-ring:focus-visible {
                    outline: 2px solid var(--color-primary-500);
                    outline-offset: 2px;
                }
                
                .skip-to-content {
                    position: absolute;
                    top: -40px;
                    left: 0;
                    background-color: var(--color-primary-600);
                    color: white;
                    padding: 8px 16px;
                    z-index: 9999;
                    text-decoration: none;
                }
                
                .skip-to-content:focus {
                    top: 0;
                }
                
                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
                
                /* High contrast mode support */
                @media (prefers-contrast: high) {
                    .btn {
                        border: 2px solid currentColor;
                    }
                    
                    .card {
                        border: 2px solid currentColor;
                    }
                    
                    .form-input {
                        border: 2px solid currentColor;
                    }
                }
            `;
        }
    }
};

// ============================================
// 1️⃣5️⃣ THEME VALIDATION
// ============================================

// Run WCAG compliance check
const wcagCompliance = EthiopiaTheme.validation.checkWCAGCompliance();
if (!wcagCompliance.passed) {
    console.warn('⚠️ Ethiopia Theme WCAG Compliance Issues:', wcagCompliance.checks.filter(c => !c.passed));
} else {
    console.log('✅ Ethiopia Theme WCAG Compliant');
}

// ============================================
// 1️⃣6️⃣ THEME EXPORT
// ============================================

// Freeze theme configuration
Object.freeze(EthiopiaTheme);

// Export the theme configuration
export default EthiopiaTheme;

// For CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthiopiaTheme;
}

// Generate and export CSS
export const EthiopiaThemeCSS = EthiopiaTheme.builder.generateCSS();
export const EthiopiaThemeMinifiedCSS = EthiopiaTheme.builder.generateCSS({ minify: true });
export const EthiopiaThemeTailwindConfig = EthiopiaTheme.export.toTailwindConfig();
export const EthiopiaThemeDesignTokens = EthiopiaTheme.export.toDesignTokens();