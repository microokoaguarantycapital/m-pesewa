/**
 * M-PESEWA BREADCRUMB BUILDER
 * Builds hierarchical breadcrumbs based on strict M-Pesewa structure
 * Version: 1.0.0
 * Last Updated: 2024-01-24
 */

class MpesewaBreadcrumbBuilder {
    constructor(contextResolver) {
        this.contextResolver = contextResolver || window.MpesewaContextResolver;
        this.breadcrumbConfig = this._initializeBreadcrumbConfig();
        this.currentBreadcrumbs = [];
    }

    _initializeBreadcrumbConfig() {
        return {
            // STRICT HIERARCHY MAPPING - NON-NEGOTIABLE
            [HIERARCHY_LEVELS.GLOBAL]: {
                label: 'M-Pesewa',
                path: '/',
                icon: '🏠',
                canSkip: false
            },
            [HIERARCHY_LEVELS.COUNTRY]: {
                template: (countryCode) => {
                    const country = MPESEWA_COUNTRIES.find(c => c.code === countryCode);
                    return {
                        label: `${country?.flag || '🌍'} ${country?.name || countryCode}`,
                        path: `/countries/${countryCode.toLowerCase()}`,
                        icon: '🌍',
                        canSkip: false
                    };
                }
            },
            [HIERARCHY_LEVELS.GROUP]: {
                template: (groupId) => {
                    return {
                        label: `Group: ${groupId.substring(0, 8)}...`,
                        path: `/groups/${groupId}`,
                        icon: '👥',
                        canSkip: false
                    };
                }
            },
            [HIERARCHY_LEVELS.LENDER]: {
                label: 'Lender Dashboard',
                path: '/lender/dashboard.html',
                icon: '💰',
                canSkip: false,
                conditional: (context) => context.role === 'lender'
            },
            [HIERARCHY_LEVELS.BORROWER]: {
                label: 'Borrower Dashboard',
                path: '/borrower/dashboard.html',
                icon: '💼',
                canSkip: false,
                conditional: (context) => context.role === 'borrower'
            },
            [HIERARCHY_LEVELS.LEDGER]: {
                template: (ledgerId) => {
                    return {
                        label: `Ledger: ${ledgerId.substring(0, 10)}...`,
                        path: `/ledgers/${ledgerId}`,
                        icon: '📒',
                        canSkip: true
                    };
                }
            },

            // PAGE-SPECIFIC BREADCRUMBS
            pages: {
                // Borrower Pages
                '/borrower/apply.html': {
                    label: 'Apply for Loan',
                    icon: '📝',
                    parent: HIERARCHY_LEVELS.BORROWER
                },
                '/borrower/history.html': {
                    label: 'Borrow History',
                    icon: '📊',
                    parent: HIERARCHY_LEVELS.BORROWER
                },
                '/borrower/repayments.html': {
                    label: 'Repayments',
                    icon: '💳',
                    parent: HIERARCHY_LEVELS.BORROWER
                },
                '/borrower/disputes.html': {
                    label: 'Disputes',
                    icon: '⚖️',
                    parent: HIERARCHY_LEVELS.BORROWER
                },

                // Lender Pages
                '/lender/portfolio.html': {
                    label: 'Portfolio',
                    icon: '📈',
                    parent: HIERARCHY_LEVELS.LENDER
                },
                '/lender/history.html': {
                    label: 'Lending History',
                    icon: '📊',
                    parent: HIERARCHY_LEVELS.LENDER
                },
                '/lender/rules.html': {
                    label: 'Lending Rules',
                    icon: '📜',
                    parent: HIERARCHY_LEVELS.LENDER
                },
                '/lender/risk.html': {
                    label: 'Risk Assessment',
                    icon: '⚠️',
                    parent: HIERARCHY_LEVELS.LENDER
                },

                // Emergency Hub Categories (20 categories)
                '/emergency/fare.html': {
                    label: 'M-pesewa Fare',
                    icon: '🚌',
                    parent: '/emergency/'
                },
                '/emergency/data.html': {
                    label: 'M-pesewa Data',
                    icon: '📶',
                    parent: '/emergency/'
                },
                '/emergency/gas.html': {
                    label: 'Cooking Gas',
                    icon: '🔥',
                    parent: '/emergency/'
                },
                '/emergency/food.html': {
                    label: 'M-pesewa Food',
                    icon: '🍲',
                    parent: '/emergency/'
                },
                '/emergency/wifi.html': {
                    label: 'M-pesewa Wifi',
                    icon: '📡',
                    parent: '/emergency/'
                },
                '/emergency/water.html': {
                    label: 'Water Bill',
                    icon: '🚰',
                    parent: '/emergency/'
                },
                '/emergency/electricity.html': {
                    label: 'Electricity',
                    icon: '⚡',
                    parent: '/emergency/'
                },
                '/emergency/tv.html': {
                    label: 'TV Subscription',
                    icon: '📺',
                    parent: '/emergency/'
                },
                '/emergency/fuel.html': {
                    label: 'M-pesewa Fuel',
                    icon: '⛽',
                    parent: '/emergency/'
                },
                '/emergency/repair.html': {
                    label: 'M-pesewa Repair',
                    icon: '🔧',
                    parent: '/emergency/'
                },
                '/emergency/credo.html': {
                    label: 'M-pesewa Credo',
                    icon: '🛠️',
                    parent: '/emergency/'
                },
                '/emergency/sales.html': {
                    label: 'Daily Sales Advance',
                    icon: '🧾',
                    parent: '/emergency/'
                },
                '/emergency/capital.html': {
                    label: 'Working Capital',
                    icon: '🏪',
                    parent: '/emergency/'
                },
                '/emergency/soko.html': {
                    label: 'Soko Loan',
                    icon: '🛒',
                    parent: '/emergency/'
                },
                '/emergency/kidandaski.html': {
                    label: 'Kidandaski Loan',
                    icon: '🏗️',
                    parent: '/emergency/'
                },
                '/emergency/hawker.html': {
                    label: 'Hawker Loan',
                    icon: '🚶‍♂️',
                    parent: '/emergency/'
                },
                '/emergency/fuliziwa.html': {
                    label: 'M-fuliziwa Loan',
                    icon: '🔄',
                    parent: '/emergency/'
                },
                '/emergency/medicine.html': {
                    label: 'Medicine',
                    icon: '💊',
                    parent: '/emergency/'
                },
                '/emergency/school.html': {
                    label: 'School Fees',
                    icon: '🎓',
                    parent: '/emergency/'
                },
                '/emergency/advance.html': {
                    label: 'Quick Advance',
                    icon: '💸',
                    parent: '/emergency/'
                },

                // Subscription Pages
                '/subscription/current.html': {
                    label: 'Current Plan',
                    icon: '📋',
                    parent: '/subscription/'
                },
                '/subscription/upgrade.html': {
                    label: 'Upgrade Plan',
                    icon: '⬆️',
                    parent: '/subscription/'
                },
                '/subscription/history.html': {
                    label: 'Subscription History',
                    icon: '📊',
                    parent: '/subscription/'
                },
                '/subscription/invoices.html': {
                    label: 'Invoices',
                    icon: '🧾',
                    parent: '/subscription/'
                },

                // Country Pages
                '/countries/kenya.html': {
                    label: 'Kenya Operations',
                    icon: '🇰🇪',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/uganda.html': {
                    label: 'Uganda Operations',
                    icon: '🇺🇬',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/tanzania.html': {
                    label: 'Tanzania Operations',
                    icon: '🇹🇿',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/rwanda.html': {
                    label: 'Rwanda Operations',
                    icon: '🇷🇼',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/drc.html': {
                    label: 'DRC Operations',
                    icon: '🇨🇩',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/burundi.html': {
                    label: 'Burundi Operations',
                    icon: '🇧🇮',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/nigeria.html': {
                    label: 'Nigeria Operations',
                    icon: '🇳🇬',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/ghana.html': {
                    label: 'Ghana Operations',
                    icon: '🇬🇭',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/south-sudan.html': {
                    label: 'South Sudan Operations',
                    icon: '🇸🇸',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/somalia.html': {
                    label: 'Somalia Operations',
                    icon: '🇸🇴',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/south-africa.html': {
                    label: 'South Africa Operations',
                    icon: '🇿🇦',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },
                '/countries/ethiopia.html': {
                    label: 'Ethiopia Operations',
                    icon: '🇪🇹',
                    parent: HIERARCHY_LEVELS.COUNTRY
                },

                // Admin Pages
                '/admin/dashboard.html': {
                    label: 'Admin Dashboard',
                    icon: '🛡️',
                    parent: HIERARCHY_LEVELS.GLOBAL,
                    restricted: ['platform_admin']
                },
                '/admin/users.html': {
                    label: 'User Management',
                    icon: '👥',
                    parent: '/admin/dashboard.html',
                    restricted: ['platform_admin']
                },
                '/admin/groups.html': {
                    label: 'Group Management',
                    icon: '👥',
                    parent: '/admin/dashboard.html',
                    restricted: ['platform_admin']
                },
                '/admin/ledgers.html': {
                    label: 'Ledger Management',
                    icon: '📒',
                    parent: '/admin/dashboard.html',
                    restricted: ['platform_admin']
                },
                '/admin/blacklist.html': {
                    label: 'Blacklist Management',
                    icon: '🚫',
                    parent: '/admin/dashboard.html',
                    restricted: ['platform_admin']
                }
            }
        };
    }

    buildBreadcrumbs(currentPath = null) {
        const path = currentPath || window.location.pathname;
        const context = this.contextResolver.getCurrentContext();
        const hierarchyStack = this.contextResolver.getHierarchyStack();
        
        this.currentBreadcrumbs = [];
        
        // 1. Add hierarchy breadcrumbs (Global → Country → Group → Role)
        hierarchyStack.forEach((level, index) => {
            if (index === 0 || !level.canSkip) {
                this.currentBreadcrumbs.push({
                    label: level.label,
                    path: level.path,
                    isActive: index === hierarchyStack.length - 1 && !this._hasPageSpecificBreadcrumb(path),
                    isHierarchy: true
                });
            }
        });

        // 2. Add page-specific breadcrumb if exists
        const pageConfig = this.breadcrumbConfig.pages[path];
        if (pageConfig) {
            // Check if user has access to this page
            if (pageConfig.restricted && !pageConfig.restricted.includes(context.role)) {
                console.warn(`User ${context.role} cannot access restricted page ${path}`);
                return this.currentBreadcrumbs;
            }

            // Add parent breadcrumb if specified
            if (pageConfig.parent && pageConfig.parent !== HIERARCHY_LEVELS.GLOBAL) {
                const parentBreadcrumb = this._resolveParentBreadcrumb(pageConfig.parent, context);
                if (parentBreadcrumb) {
                    this.currentBreadcrumbs.push({
                        ...parentBreadcrumb,
                        isActive: false,
                        isHierarchy: true
                    });
                }
            }

            // Add current page breadcrumb
            this.currentBreadcrumbs.push({
                label: pageConfig.label,
                path: path,
                icon: pageConfig.icon,
                isActive: true,
                isPage: true
            });
        } else if (this._hasPageSpecificBreadcrumb(path)) {
            // Handle nested paths (e.g., /borrower/apply/confirm)
            const basePath = this._findBasePath(path);
            if (basePath && this.breadcrumbConfig.pages[basePath]) {
                const baseConfig = this.breadcrumbConfig.pages[basePath];
                this.currentBreadcrumbs.push({
                    label: baseConfig.label,
                    path: basePath,
                    icon: baseConfig.icon,
                    isActive: false,
                    isPage: true
                });
                
                // Add current nested page
                const pageName = this._extractPageName(path, basePath);
                this.currentBreadcrumbs.push({
                    label: pageName,
                    path: path,
                    isActive: true,
                    isPage: true
                });
            }
        }

        // 3. Add emergency category context if in emergency hub
        if (path.includes('/emergency/') && !path.endsWith('/emergency/')) {
            this._addEmergencyHubContext(path);
        }

        // 4. Add ledger context if viewing ledger
        if (path.includes('/ledgers/')) {
            this._addLedgerContext(path, context);
        }

        // 5. Add subscription context
        if (path.includes('/subscription/')) {
            this._addSubscriptionContext(path, context);
        }

        // 6. Add country-specific context
        if (path.includes('/countries/')) {
            this._addCountryContext(path);
        }

        // Ensure unique breadcrumbs
        this.currentBreadcrumbs = this._deduplicateBreadcrumbs();

        return this.currentBreadcrumbs;
    }

    _resolveParentBreadcrumb(parentRef, context) {
        if (Object.values(HIERARCHY_LEVELS).includes(parentRef)) {
            // Parent is a hierarchy level
            switch(parentRef) {
                case HIERARCHY_LEVELS.COUNTRY:
                    if (context.country) {
                        const country = MPESEWA_COUNTRIES.find(c => c.code === context.country);
                        return {
                            label: `${country?.flag || ''} ${country?.name || context.country}`,
                            path: `/countries/${context.country.toLowerCase()}`
                        };
                    }
                    break;
                    
                case HIERARCHY_LEVELS.GROUP:
                    if (context.group) {
                        return {
                            label: `Group: ${context.group.substring(0, 8)}...`,
                            path: `/groups/${context.group}`
                        };
                    }
                    break;
                    
                case HIERARCHY_LEVELS.LENDER:
                    return {
                        label: 'Lender Dashboard',
                        path: '/lender/dashboard.html'
                    };
                    
                case HIERARCHY_LEVELS.BORROWER:
                    return {
                        label: 'Borrower Dashboard',
                        path: '/borrower/dashboard.html'
                    };
            }
        } else if (parentRef.startsWith('/')) {
            // Parent is a specific path
            const parentConfig = this.breadcrumbConfig.pages[parentRef];
            if (parentConfig) {
                return {
                    label: parentConfig.label,
                    path: parentRef,
                    icon: parentConfig.icon
                };
            }
        }
        
        return null;
    }

    _addEmergencyHubContext(path) {
        // Check if we're already showing an emergency category
        const hasEmergencyCategory = this.currentBreadcrumbs.some(crumb => 
            crumb.path && crumb.path.includes('/emergency/') && 
            !crumb.path.endsWith('/emergency/')
        );
        
        if (!hasEmergencyCategory) {
            // Add Emergency Hub parent
            this.currentBreadcrumbs.push({
                label: 'Emergency Hub',
                path: '/emergency/index.html',
                icon: '🚨',
                isActive: false,
                isEmergencyHub: true
            });
        }
    }

    _addLedgerContext(path, context) {
        const ledgerMatch = path.match(/\/ledgers\/([^\/]+)/);
        if (ledgerMatch && context.ledger) {
            // Check if ledger breadcrumb already exists
            const hasLedger = this.currentBreadcrumbs.some(crumb => 
                crumb.label && crumb.label.includes('Ledger:')
            );
            
            if (!hasLedger) {
                this.currentBreadcrumbs.push({
                    label: `Ledger: ${context.ledger.substring(0, 12)}...`,
                    path: `/ledgers/${context.ledger}`,
                    icon: '📒',
                    isActive: true,
                    isLedger: true
                });
            }
        }
    }

    _addSubscriptionContext(path, context) {
        if (context.subscription) {
            const hasSubscription = this.currentBreadcrumbs.some(crumb => 
                crumb.label && crumb.label.includes('Subscription')
            );
            
            if (!hasSubscription) {
                this.currentBreadcrumbs.push({
                    label: `${context.subscription.tier.toUpperCase()} Subscription`,
                    path: '/subscription/current.html',
                    icon: '📋',
                    isActive: false,
                    isSubscription: true
                });
            }
        }
    }

    _addCountryContext(path) {
        const countryMatch = path.match(/\/countries\/([a-z-]+)/i);
        if (countryMatch) {
            const countryCode = countryMatch[1].toUpperCase();
            const country = MPESEWA_COUNTRIES.find(c => 
                c.code === countryCode || c.name.toLowerCase() === countryMatch[1].toLowerCase()
            );
            
            if (country) {
                const hasCountry = this.currentBreadcrumbs.some(crumb => 
                    crumb.label && crumb.label.includes(country.name)
                );
                
                if (!hasCountry) {
                    this.currentBreadcrumbs.push({
                        label: `${country.flag} ${country.name}`,
                        path: `/countries/${country.code.toLowerCase()}.html`,
                        icon: country.flag,
                        isActive: path.includes(`/countries/${country.code.toLowerCase()}`),
                        isCountry: true
                    });
                }
            }
        }
    }

    _hasPageSpecificBreadcrumb(path) {
        return Object.keys(this.breadcrumbConfig.pages).some(pagePath => 
            path === pagePath || path.startsWith(pagePath + '/')
        );
    }

    _findBasePath(path) {
        const segments = path.split('/').filter(s => s);
        for (let i = segments.length; i > 0; i--) {
            const testPath = '/' + segments.slice(0, i).join('/');
            if (this.breadcrumbConfig.pages[testPath]) {
                return testPath;
            }
        }
        return null;
    }

    _extractPageName(path, basePath) {
        const remaining = path.replace(basePath, '').replace(/^\//, '');
        if (!remaining) return 'Details';
        
        // Convert kebab-case to Title Case
        return remaining.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    _deduplicateBreadcrumbs() {
        const seen = new Set();
        return this.currentBreadcrumbs.filter(crumb => {
            const key = `${crumb.path}-${crumb.label}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    // Generate HTML for breadcrumbs
    renderBreadcrumbs(containerId = 'breadcrumb-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Breadcrumb container #${containerId} not found`);
            return;
        }

        const breadcrumbs = this.buildBreadcrumbs();
        
        if (breadcrumbs.length === 0) {
            container.innerHTML = '';
            return;
        }

        const html = `
            <nav aria-label="Breadcrumb" class="mp-breadcrumb">
                <ol class="breadcrumb-list">
                    ${breadcrumbs.map((crumb, index) => `
                        <li class="breadcrumb-item ${crumb.isActive ? 'active' : ''}">
                            ${index < breadcrumbs.length - 1 && crumb.path ? `
                                <a href="${crumb.path}" class="breadcrumb-link">
                                    ${crumb.icon ? `<span class="breadcrumb-icon">${crumb.icon}</span>` : ''}
                                    <span class="breadcrumb-label">${crumb.label}</span>
                                </a>
                                <span class="breadcrumb-separator">/</span>
                            ` : `
                                <span class="breadcrumb-current">
                                    ${crumb.icon ? `<span class="breadcrumb-icon">${crumb.icon}</span>` : ''}
                                    <span class="breadcrumb-label">${crumb.label}</span>
                                </span>
                            `}
                        </li>
                    `).join('')}
                </ol>
            </nav>
        `;

        container.innerHTML = html;
        
        // Add click handlers for non-active breadcrumbs
        container.querySelectorAll('.breadcrumb-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            });
        });
    }

    // Generate microdata for SEO
    generateMicrodata() {
        const breadcrumbs = this.buildBreadcrumbs();
        
        if (breadcrumbs.length === 0) {
            return '';
        }

        const items = breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.label,
            "item": crumb.path ? `${window.location.origin}${crumb.path}` : window.location.href
        }));

        return `
            <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": ${JSON.stringify(items)}
            }
            </script>
        `;
    }

    // Update breadcrumbs on navigation
    updateOnNavigation() {
        // Listen for pushState and replaceState (SPA navigation)
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', () => {
            this.renderBreadcrumbs();
        });
    }

    // Get breadcrumb trail as array for programmatic use
    getBreadcrumbTrail() {
        return this.buildBreadcrumbs().map(crumb => ({
            label: crumb.label,
            path: crumb.path,
            isActive: crumb.isActive,
            icon: crumb.icon
        }));
    }

    // Clear breadcrumbs
    clear() {
        this.currentBreadcrumbs = [];
        const container = document.getElementById('breadcrumb-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Initialize and export
const breadcrumbBuilder = new MpesewaBreadcrumbBuilder();

// Define HIERARCHY_LEVELS if not already defined
const HIERARCHY_LEVELS = {
    GLOBAL: 'global',
    COUNTRY: 'country',
    GROUP: 'group',
    LENDER: 'lender',
    BORROWER: 'borrower',
    LEDGER: 'ledger'
};

// Define MPESEWA_COUNTRIES if not already defined
const MPESEWA_COUNTRIES = [
    { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
    { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
    { code: 'CD', name: 'DRC', currency: 'CDF', flag: '🇨🇩' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
    { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
    { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MpesewaBreadcrumbBuilder, breadcrumbBuilder };
} else {
    window.MpesewaBreadcrumbBuilder = MpesewaBreadcrumbBuilder;
    window.breadcrumbBuilder = breadcrumbBuilder;
}