/**
 * M-PESEWA SIDEBAR CONTROLLER
 * Controls sidebar navigation based on strict hierarchy and user roles
 * Version: 1.0.0
 * Last Updated: 2024-01-24
 */

class MpesewaSidebarController {
    constructor(contextResolver) {
        this.contextResolver = contextResolver || window.MpesewaContextResolver;
        this.sidebarConfig = this._initializeSidebarConfig();
        this.currentSidebar = null;
        this.isCollapsed = false;
        this.activeItem = null;
        this.init();
    }

    init() {
        this._loadState();
        this._setupEventListeners();
        this._renderSidebar();
        this._updateActiveItem();
    }

    _initializeSidebarConfig() {
        return {
            // STRICT SIDEBAR STRUCTURE BY ROLE AND HIERARCHY
            global: {
                guest: this._getGuestSidebar(),
                borrower: this._getBorrowerSidebar(),
                lender: this._getLenderSidebar(),
                group_admin: this._getGroupAdminSidebar(),
                platform_admin: this._getPlatformAdminSidebar()
            },
            
            // COUNTRY-SPECIFIC SIDEBARS
            country: {
                KE: this._getKenyaSidebar(),
                UG: this._getUgandaSidebar(),
                TZ: this._getTanzaniaSidebar(),
                RW: this._getRwandaSidebar(),
                BI: this._getBurundiSidebar(),
                CD: this._getDRCSidebar(),
                NG: this._getNigeriaSidebar(),
                GH: this._getGhanaSidebar(),
                SS: this._getSouthSudanSidebar(),
                SO: this._getSomaliaSidebar(),
                ZA: this._getSouthAfricaSidebar(),
                ET: this._getEthiopiaSidebar()
            },
            
            // GROUP-SPECIFIC SIDEBARS
            group: {
                member: this._getGroupMemberSidebar(),
                admin: this._getGroupAdminSidebarItems()
            },
            
            // SIDEBAR STYLING CONFIG
            styling: {
                colors: {
                    background: '#ffffff',
                    text: '#003366',
                    hover: '#f8f9fa',
                    active: '#0099ff',
                    border: '#e0e0e0',
                    icon: '#003366'
                },
                icons: {
                    dashboard: '📊',
                    portfolio: '📈',
                    history: '📜',
                    rules: '📋',
                    risk: '⚠️',
                    apply: '📝',
                    repayments: '💳',
                    disputes: '⚖️',
                    groups: '👥',
                    ledger: '📒',
                    subscription: '💰',
                    emergency: '🚨',
                    blacklist: '🚫',
                    collectors: '🕵️',
                    admin: '🛡️',
                    settings: '⚙️',
                    logout: '🚪'
                }
            }
        };
    }

    // GUEST SIDEBAR (Unauthenticated users)
    _getGuestSidebar() {
        return {
            id: 'guest-sidebar',
            title: 'M-Pesewa',
            subtitle: 'Trusted Circles Lending',
            items: [
                {
                    id: 'guest-home',
                    label: 'Home',
                    icon: '🏠',
                    path: '/',
                    exact: true
                },
                {
                    id: 'guest-how-it-works',
                    label: 'How It Works',
                    icon: '❓',
                    path: '/how-it-works.html'
                },
                {
                    id: 'guest-emergency-hub',
                    label: 'Emergency Hub',
                    icon: '🚨',
                    path: '/emergency/index.html',
                    badge: '20+'
                },
                {
                    id: 'guest-countries',
                    label: 'Countries',
                    icon: '🌍',
                    path: '/countries/index.html',
                    badge: '12'
                },
                {
                    id: 'guest-subscriptions',
                    label: 'Subscription Plans',
                    icon: '💰',
                    path: '/subscription/plans.html'
                },
                {
                    id: 'guest-testimonials',
                    label: 'Success Stories',
                    icon: '🌟',
                    path: '/testimonials.html'
                },
                {
                    id: 'guest-about',
                    label: 'About Us',
                    icon: '🏢',
                    path: '/about.html'
                },
                {
                    id: 'guest-faq',
                    label: 'FAQ',
                    icon: '💬',
                    path: '/faq.html'
                },
                {
                    id: 'guest-contact',
                    label: 'Contact',
                    icon: '📞',
                    path: '/contact.html'
                }
            ],
            footer: {
                show: true,
                items: [
                    {
                        id: 'guest-login',
                        label: 'Sign In',
                        icon: '🔐',
                        path: '/auth/login.html',
                        type: 'primary'
                    },
                    {
                        id: 'guest-register',
                        label: 'Get Started',
                        icon: '🚀',
                        path: '/auth/register.html',
                        type: 'secondary'
                    }
                ]
            }
        };
    }

    // BORROWER SIDEBAR (Authenticated borrowers)
    _getBorrowerSidebar() {
        const context = this.contextResolver?.getCurrentContext() || {};
        const country = context.country || 'KE';
        const group = context.group ? `Group: ${context.group.substring(0, 8)}...` : 'No Group';
        
        return {
            id: 'borrower-sidebar',
            title: 'Borrower',
            subtitle: `${group} | ${country}`,
            userInfo: {
                show: true,
                rating: true,
                groups: true,
                blacklistStatus: true
            },
            items: [
                {
                    id: 'borrower-dashboard',
                    label: 'Dashboard',
                    icon: '📊',
                    path: '/borrower/dashboard.html',
                    exact: true
                },
                {
                    id: 'borrower-apply',
                    label: 'Apply for Loan',
                    icon: '📝',
                    path: '/borrower/apply.html',
                    badge: 'NEW'
                },
                {
                    id: 'borrower-cart',
                    label: 'Loan Cart',
                    icon: '🛒',
                    path: '/borrower/cart.html',
                    disabled: false
                },
                {
                    id: 'borrower-history',
                    label: 'Borrow History',
                    icon: '📜',
                    path: '/borrower/history.html'
                },
                {
                    id: 'borrower-repayments',
                    label: 'Repayments',
                    icon: '💳',
                    path: '/borrower/repayments.html',
                    badge: (context.overdueLoans || 0) > 0 ? `${context.overdueLoans}` : null
                },
                {
                    id: 'borrower-disputes',
                    label: 'Disputes',
                    icon: '⚖️',
                    path: '/borrower/disputes.html',
                    badge: (context.activeDisputes || 0) > 0 ? `${context.activeDisputes}` : null
                },
                {
                    id: 'borrower-restrictions',
                    label: 'Restrictions',
                    icon: '🚫',
                    path: '/borrower/restrictions.html',
                    disabled: false
                },
                {
                    id: 'borrower-groups',
                    label: 'My Groups',
                    icon: '👥',
                    path: '/borrower/groups.html',
                    badge: (context.groupCount || 0) > 0 ? `${context.groupCount}/4` : null,
                    subItems: [
                        {
                            id: 'borrower-groups-join',
                            label: 'Join New Group',
                            icon: '➕',
                            path: '/groups/join.html',
                            condition: (user) => user.groups?.length < 4 && user.rating >= 3
                        },
                        {
                            id: 'borrower-groups-create',
                            label: 'Create Group',
                            icon: '🏗️',
                            path: '/groups/create.html',
                            condition: (user) => user.rating >= 4
                        },
                        {
                            id: 'borrower-groups-invite',
                            label: 'Invite Members',
                            icon: '📨',
                            path: '/groups/invite.html',
                            condition: (user) => user.groupRole === 'admin'
                        }
                    ]
                },
                {
                    id: 'borrower-emergency',
                    label: 'Emergency Hub',
                    icon: '🚨',
                    path: '/emergency/index.html',
                    subItems: this._getEmergencyCategories()
                },
                {
                    id: 'borrower-profile',
                    label: 'Profile',
                    icon: '👤',
                    path: '/user/profile.html'
                },
                {
                    id: 'borrower-settings',
                    label: 'Settings',
                    icon: '⚙️',
                    path: '/user/settings.html'
                }
            ],
            footer: {
                show: true,
                items: [
                    {
                        id: 'borrower-switch-lender',
                        label: 'Switch to Lender',
                        icon: '🔄',
                        action: 'switchRole',
                        role: 'lender',
                        condition: (user) => user.roles?.includes('lender')
                    },
                    {
                        id: 'borrower-logout',
                        label: 'Logout',
                        icon: '🚪',
                        action: 'logout',
                        type: 'danger'
                    }
                ]
            }
        };
    }

    // LENDER SIDEBAR (Authenticated lenders with subscription)
    _getLenderSidebar() {
        const context = this.contextResolver?.getCurrentContext() || {};
        const subscription = context.subscription || {};
        const country = context.country || 'KE';
        const group = context.group ? `Group: ${context.group.substring(0, 8)}...` : 'No Group';
        
        return {
            id: 'lender-sidebar',
            title: 'Lender',
            subtitle: `${subscription.tier?.toUpperCase() || 'No Sub'} | ${group} | ${country}`,
            userInfo: {
                show: true,
                subscription: true,
                lendingLimit: true,
                totalLent: true,
                activeLedgers: true
            },
            items: [
                {
                    id: 'lender-dashboard',
                    label: 'Dashboard',
                    icon: '📊',
                    path: '/lender/dashboard.html',
                    exact: true
                },
                {
                    id: 'lender-portfolio',
                    label: 'Portfolio',
                    icon: '📈',
                    path: '/lender/portfolio.html'
                },
                {
                    id: 'lender-ledgers',
                    label: 'My Ledgers',
                    icon: '📒',
                    path: '/lender/ledgers.html',
                    badge: (context.activeLedgers || 0) > 0 ? `${context.activeLedgers}` : null,
                    subItems: [
                        {
                            id: 'lender-ledgers-active',
                            label: 'Active Ledgers',
                            icon: '🟢',
                            path: '/lender/ledgers.html?status=active'
                        },
                        {
                            id: 'lender-ledgers-overdue',
                            label: 'Overdue Ledgers',
                            icon: '🔴',
                            path: '/lender/ledgers.html?status=overdue',
                            badge: (context.overdueLedgers || 0) > 0 ? `${context.overdueLedgers}` : null
                        },
                        {
                            id: 'lender-ledgers-cleared',
                            label: 'Cleared Ledgers',
                            icon: '✅',
                            path: '/lender/ledgers.html?status=cleared'
                        },
                        {
                            id: 'lender-ledgers-create',
                            label: 'Create New Ledger',
                            icon: '➕',
                            path: '/lender/ledgers/create.html'
                        }
                    ]
                },
                {
                    id: 'lender-requests',
                    label: 'Loan Requests',
                    icon: '📋',
                    path: '/lender/requests.html',
                    badge: (context.pendingRequests || 0) > 0 ? `${context.pendingRequests}` : null
                },
                {
                    id: 'lender-history',
                    label: 'Lending History',
                    icon: '📜',
                    path: '/lender/history.html'
                },
                {
                    id: 'lender-rules',
                    label: 'Lending Rules',
                    icon: '📋',
                    path: '/lender/rules.html'
                },
                {
                    id: 'lender-risk',
                    label: 'Risk Assessment',
                    icon: '⚠️',
                    path: '/lender/risk.html'
                },
                {
                    id: 'lender-blacklist',
                    label: 'Blacklist',
                    icon: '🚫',
                    path: '/lender/blacklist.html',
                    badge: (context.blacklistedBorrowers || 0) > 0 ? `${context.blacklistedBorrowers}` : null
                },
                {
                    id: 'lender-groups',
                    label: 'My Groups',
                    icon: '👥',
                    path: '/lender/groups.html',
                    subItems: [
                        {
                            id: 'lender-groups-join',
                            label: 'Join New Group',
                            icon: '➕',
                            path: '/groups/join.html'
                        },
                        {
                            id: 'lender-groups-create',
                            label: 'Create Group',
                            icon: '🏗️',
                            path: '/groups/create.html'
                        },
                        {
                            id: 'lender-groups-invite',
                            label: 'Invite Members',
                            icon: '📨',
                            path: '/groups/invite.html',
                            condition: (user) => user.groupRole === 'admin'
                        }
                    ]
                },
                {
                    id: 'lender-subscription',
                    label: 'Subscription',
                    icon: '💰',
                    path: '/subscription/current.html',
                    subItems: [
                        {
                            id: 'lender-subscription-current',
                            label: 'Current Plan',
                            icon: '📋',
                            path: '/subscription/current.html'
                        },
                        {
                            id: 'lender-subscription-upgrade',
                            label: 'Upgrade Plan',
                            icon: '⬆️',
                            path: '/subscription/upgrade.html'
                        },
                        {
                            id: 'lender-subscription-history',
                            label: 'History',
                            icon: '📊',
                            path: '/subscription/history.html'
                        },
                        {
                            id: 'lender-subscription-invoices',
                            label: 'Invoices',
                            icon: '🧾',
                            path: '/subscription/invoices.html'
                        }
                    ]
                },
                {
                    id: 'lender-collectors',
                    label: 'Debt Collectors',
                    icon: '🕵️',
                    path: '/collectors.html'
                },
                {
                    id: 'lender-profile',
                    label: 'Profile',
                    icon: '👤',
                    path: '/user/profile.html'
                },
                {
                    id: 'lender-settings',
                    label: 'Settings',
                    icon: '⚙️',
                    path: '/user/settings.html'
                }
            ],
            footer: {
                show: true,
                items: [
                    {
                        id: 'lender-switch-borrower',
                        label: 'Switch to Borrower',
                        icon: '🔄',
                        action: 'switchRole',
                        role: 'borrower',
                        condition: (user) => user.roles?.includes('borrower')
                    },
                    {
                        id: 'lender-logout',
                        label: 'Logout',
                        icon: '🚪',
                        action: 'logout',
                        type: 'danger'
                    }
                ]
            }
        };
    }

    // GROUP ADMIN SIDEBAR
    _getGroupAdminSidebar() {
        const borrowerSidebar = this._getBorrowerSidebar();
        const lenderSidebar = this._getLenderSidebar();
        
        return {
            id: 'group-admin-sidebar',
            title: 'Group Admin',
            subtitle: 'Full Management Access',
            userInfo: {
                show: true,
                rating: true,
                groups: true,
                subscription: true,
                lendingLimit: true
            },
            items: [
                // Combined items from borrower and lender
                ...borrowerSidebar.items.filter(item => 
                    ['dashboard', 'profile', 'settings', 'groups'].includes(item.id.replace('borrower-', ''))
                ).map(item => ({
                    ...item,
                    id: item.id.replace('borrower-', 'admin-')
                })),
                ...lenderSidebar.items.filter(item => 
                    ['dashboard', 'portfolio', 'ledgers', 'history', 'rules', 'risk', 'blacklist', 'subscription'].includes(item.id.replace('lender-', ''))
                ).map(item => ({
                    ...item,
                    id: item.id.replace('lender-', 'admin-')
                })),
                // Additional admin-only items
                {
                    id: 'admin-group-management',
                    label: 'Group Management',
                    icon: '👥',
                    path: '/group/admin.html',
                    subItems: [
                        {
                            id: 'admin-group-members',
                            label: 'Members',
                            icon: '👤',
                            path: '/group/members.html'
                        },
                        {
                            id: 'admin-group-settings',
                            label: 'Group Settings',
                            icon: '⚙️',
                            path: '/group/settings.html'
                        },
                        {
                            id: 'admin-group-invites',
                            label: 'Invitations',
                            icon: '📨',
                            path: '/group/invites.html'
                        },
                        {
                            id: 'admin-group-rules',
                            label: 'Group Rules',
                            icon: '📜',
                            path: '/group/rules.html'
                        },
                        {
                            id: 'admin-group-reports',
                            label: 'Reports',
                            icon: '📊',
                            path: '/group/reports.html'
                        }
                    ]
                }
            ],
            footer: {
                show: true,
                items: [
                    {
                        id: 'admin-switch-role',
                        label: 'Switch Role',
                        icon: '🔄',
                        action: 'showRoleSelector',
                        type: 'primary'
                    },
                    {
                        id: 'admin-logout',
                        label: 'Logout',
                        icon: '🚪',
                        action: 'logout',
                        type: 'danger'
                    }
                ]
            }
        };
    }

    // PLATFORM ADMIN SIDEBAR
    _getPlatformAdminSidebar() {
        return {
            id: 'platform-admin-sidebar',
            title: 'Platform Admin',
            subtitle: 'System Management',
            userInfo: {
                show: true,
                adminLevel: true,
                lastLogin: true
            },
            items: [
                {
                    id: 'admin-dashboard',
                    label: 'Admin Dashboard',
                    icon: '🛡️',
                    path: '/admin/dashboard.html',
                    exact: true
                },
                {
                    id: 'admin-users',
                    label: 'User Management',
                    icon: '👥',
                    path: '/admin/users.html',
                    subItems: [
                        {
                            id: 'admin-users-all',
                            label: 'All Users',
                            icon: '👤',
                            path: '/admin/users.html'
                        },
                        {
                            id: 'admin-users-lenders',
                            label: 'Lenders',
                            icon: '💰',
                            path: '/admin/users.html?role=lender'
                        },
                        {
                            id: 'admin-users-borrowers',
                            label: 'Borrowers',
                            icon: '💼',
                            path: '/admin/users.html?role=borrower'
                        },
                        {
                            id: 'admin-users-new',
                            label: 'New Registrations',
                            icon: '🆕',
                            path: '/admin/users.html?status=new'
                        },
                        {
                            id: 'admin-users-suspended',
                            label: 'Suspended',
                            icon: '⏸️',
                            path: '/admin/users.html?status=suspended'
                        }
                    ]
                },
                {
                    id: 'admin-groups',
                    label: 'Group Management',
                    icon: '👥',
                    path: '/admin/groups.html',
                    subItems: [
                        {
                            id: 'admin-groups-all',
                            label: 'All Groups',
                            icon: '👥',
                            path: '/admin/groups.html'
                        },
                        {
                            id: 'admin-groups-by-country',
                            label: 'By Country',
                            icon: '🌍',
                            path: '/admin/groups.html?view=country'
                        },
                        {
                            id: 'admin-groups-inactive',
                            label: 'Inactive Groups',
                            icon: '💤',
                            path: '/admin/groups.html?status=inactive'
                        },
                        {
                            id: 'admin-groups-create',
                            label: 'Create Group',
                            icon: '➕',
                            path: '/admin/groups/create.html'
                        }
                    ]
                },
                {
                    id: 'admin-ledgers',
                    label: 'Ledger Management',
                    icon: '📒',
                    path: '/admin/ledgers.html',
                    subItems: [
                        {
                            id: 'admin-ledgers-all',
                            label: 'All Ledgers',
                            icon: '📒',
                            path: '/admin/ledgers.html'
                        },
                        {
                            id: 'admin-ledgers-active',
                            label: 'Active Loans',
                            icon: '🟢',
                            path: '/admin/ledgers.html?status=active'
                        },
                        {
                            id: 'admin-ledgers-overdue',
                            label: 'Overdue Loans',
                            icon: '🔴',
                            path: '/admin/ledgers.html?status=overdue'
                        },
                        {
                            id: 'admin-ledgers-defaulted',
                            label: 'Defaulted Loans',
                            icon: '💀',
                            path: '/admin/ledgers.html?status=defaulted'
                        },
                        {
                            id: 'admin-ledgers-override',
                            label: 'Ledger Override',
                            icon: '🔧',
                            path: '/admin/ledgers/override.html'
                        }
                    ]
                },
                {
                    id: 'admin-blacklist',
                    label: 'Blacklist System',
                    icon: '🚫',
                    path: '/admin/blacklist.html',
                    subItems: [
                        {
                            id: 'admin-blacklist-all',
                            label: 'Blacklisted Users',
                            icon: '🚫',
                            path: '/admin/blacklist.html'
                        },
                        {
                            id: 'admin-blacklist-add',
                            label: 'Add to Blacklist',
                            icon: '➕',
                            path: '/admin/blacklist/add.html'
                        },
                        {
                            id: 'admin-blacklist-remove',
                            label: 'Remove from Blacklist',
                            icon: '➖',
                            path: '/admin/blacklist/remove.html'
                        },
                        {
                            id: 'admin-blacklist-appeals',
                            label: 'Appeals',
                            icon: '⚖️',
                            path: '/admin/blacklist/appeals.html'
                        }
                    ]
                },
                {
                    id: 'admin-subscriptions',
                    label: 'Subscription Management',
                    icon: '💰',
                    path: '/admin/subscriptions.html',
                    subItems: [
                        {
                            id: 'admin-subscriptions-all',
                            label: 'All Subscriptions',
                            icon: '💰',
                            path: '/admin/subscriptions.html'
                        },
                        {
                            id: 'admin-subscriptions-expired',
                            label: 'Expired Subscriptions',
                            icon: '⏰',
                            path: '/admin/subscriptions.html?status=expired'
                        },
                        {
                            id: 'admin-subscriptions-renewals',
                            label: 'Pending Renewals',
                            icon: '🔄',
                            path: '/admin/subscriptions.html?status=pending'
                        },
                        {
                            id: 'admin-subscriptions-reports',
                            label: 'Revenue Reports',
                            icon: '📊',
                            path: '/admin/subscriptions/reports.html'
                        }
                    ]
                },
                {
                    id: 'admin-system',
                    label: 'System Management',
                    icon: '⚙️',
                    path: '/admin/system.html',
                    subItems: [
                        {
                            id: 'admin-system-health',
                            label: 'System Health',
                            icon: '❤️',
                            path: '/admin/system/health.html'
                        },
                        {
                            id: 'admin-system-logs',
                            label: 'System Logs',
                            icon: '📋',
                            path: '/admin/system/logs.html'
                        },
                        {
                            id: 'admin-system-backup',
                            label: 'Backup & Restore',
                            icon: '💾',
                            path: '/admin/system/backup.html'
                        },
                        {
                            id: 'admin-system-settings',
                            label: 'System Settings',
                            icon: '⚙️',
                            path: '/admin/system/settings.html'
                        }
                    ]
                },
                {
                    id: 'admin-audit',
                    label: 'Audit Trail',
                    icon: '👁️',
                    path: '/admin/audit.html'
                },
                {
                    id: 'admin-impersonate',
                    label: 'Impersonate User',
                    icon: '🎭',
                    path: '/admin/impersonate.html'
                }
            ],
            footer: {
                show: true,
                items: [
                    {
                        id: 'admin-exit-admin',
                        label: 'Exit Admin Mode',
                        icon: '🚪',
                        action: 'exitAdmin',
                        type: 'warning'
                    },
                    {
                        id: 'admin-logout',
                        label: 'Logout',
                        icon: '🚪',
                        action: 'logout',
                        type: 'danger'
                    }
                ]
            }
        };
    }

    // COUNTRY-SPECIFIC SIDEBAR METHODS (12 countries)
    _getKenyaSidebar() {
        return {
            currency: 'KSh',
            contact: '+254 709 219 000',
            specificItems: [
                {
                    id: 'ke-mpesa',
                    label: 'M-Pesa Integration',
                    icon: '📱',
                    path: '/countries/ke/mpesa.html'
                },
                {
                    id: 'ke-crb',
                    label: 'CRB Check',
                    icon: '📋',
                    path: '/countries/ke/crb.html'
                },
                {
                    id: 'ke-regulations',
                    label: 'CBK Regulations',
                    icon: '🏛️',
                    path: '/countries/ke/regulations.html'
                }
            ]
        };
    }

    _getUgandaSidebar() {
        return {
            currency: 'UGX',
            contact: '+256 392 175 546',
            specificItems: [
                {
                    id: 'ug-mtn',
                    label: 'MTN Mobile Money',
                    icon: '📱',
                    path: '/countries/ug/mtn.html'
                },
                {
                    id: 'ug-bou',
                    label: 'BOU Regulations',
                    icon: '🏛️',
                    path: '/countries/ug/regulations.html'
                }
            ]
        };
    }

    _getTanzaniaSidebar() {
        return {
            currency: 'TZS',
            contact: '+255 659 073 010',
            specificItems: [
                {
                    id: 'tz-tigopesa',
                    label: 'Tigo Pesa',
                    icon: '📱',
                    path: '/countries/tz/tigopesa.html'
                },
                {
                    id: 'tz-bot',
                    label: 'BOT Regulations',
                    icon: '🏛️',
                    path: '/countries/tz/regulations.html'
                }
            ]
        };
    }

    _getRwandaSidebar() {
        return {
            currency: 'RWF',
            contact: '+250 791 590 801',
            specificItems: [
                {
                    id: 'rw-mtn',
                    label: 'MTN Mobile Money',
                    icon: '📱',
                    path: '/countries/rw/mtn.html'
                },
                {
                    id: 'rw-bnr',
                    label: 'BNR Regulations',
                    icon: '🏛️',
                    path: '/countries/rw/regulations.html'
                }
            ]
        };
    }

    _getBurundiSidebar() {
        return {
            currency: 'BIF',
            contact: '+257 79 000 000',
            specificItems: [
                {
                    id: 'bi-regulations',
                    label: 'BRB Regulations',
                    icon: '🏛️',
                    path: '/countries/bi/regulations.html'
                }
            ]
        };
    }

    _getDRCSidebar() {
        return {
            currency: 'CDF',
            contact: '+243 81 000 0000',
            specificItems: [
                {
                    id: 'cd-regulations',
                    label: 'BCC Regulations',
                    icon: '🏛️',
                    path: '/countries/cd/regulations.html'
                }
            ]
        };
    }

    _getNigeriaSidebar() {
        return {
            currency: 'NGN',
            contact: '+234 800 000 0000',
            specificItems: [
                {
                    id: 'ng-bank',
                    label: 'Bank Transfer',
                    icon: '🏦',
                    path: '/countries/ng/bank.html'
                },
                {
                    id: 'ng-cbn',
                    label: 'CBN Regulations',
                    icon: '🏛️',
                    path: '/countries/ng/regulations.html'
                }
            ]
        };
    }

    _getGhanaSidebar() {
        return {
            currency: 'GHS',
            contact: '+233 24 000 0000',
            specificItems: [
                {
                    id: 'gh-momo',
                    label: 'Mobile Money',
                    icon: '📱',
                    path: '/countries/gh/momo.html'
                },
                {
                    id: 'gh-bog',
                    label: 'BoG Regulations',
                    icon: '🏛️',
                    path: '/countries/gh/regulations.html'
                }
            ]
        };
    }

    _getSouthSudanSidebar() {
        return {
            currency: 'SSP',
            contact: '+211 955 000 000',
            specificItems: [
                {
                    id: 'ss-regulations',
                    label: 'BoSS Regulations',
                    icon: '🏛️',
                    path: '/countries/ss/regulations.html'
                }
            ]
        };
    }

    _getSomaliaSidebar() {
        return {
            currency: 'SOS',
            contact: '+252 63 0000000',
            specificItems: [
                {
                    id: 'so-hawala',
                    label: 'Hawala System',
                    icon: '💸',
                    path: '/countries/so/hawala.html'
                }
            ]
        };
    }

    _getSouthAfricaSidebar() {
        return {
            currency: 'ZAR',
            contact: '+27 11 000 0000',
            specificItems: [
                {
                    id: 'za-banks',
                    label: 'Bank Integration',
                    icon: '🏦',
                    path: '/countries/za/banks.html'
                },
                {
                    id: 'za-sarb',
                    label: 'SARB Regulations',
                    icon: '🏛️',
                    path: '/countries/za/regulations.html'
                }
            ]
        };
    }

    _getEthiopiaSidebar() {
        return {
            currency: 'ETB',
            contact: '+251 11 000 0000',
            specificItems: [
                {
                    id: 'et-cbe',
                    label: 'CBE Regulations',
                    icon: '🏛️',
                    path: '/countries/et/regulations.html'
                }
            ]
        };
    }

    _getGroupMemberSidebar() {
        return {
            items: [
                {
                    id: 'group-dashboard',
                    label: 'Group Dashboard',
                    icon: '📊',
                    path: '/group/dashboard.html'
                },
                {
                    id: 'group-members',
                    label: 'Group Members',
                    icon: '👥',
                    path: '/group/members.html'
                },
                {
                    id: 'group-loans',
                    label: 'Group Loans',
                    icon: '💰',
                    path: '/group/loans.html'
                },
                {
                    id: 'group-repayments',
                    label: 'Group Repayments',
                    icon: '💳',
                    path: '/group/repayments.html'
                }
            ]
        };
    }

    _getGroupAdminSidebarItems() {
        const memberSidebar = this._getGroupMemberSidebar();
        return {
            items: [
                ...memberSidebar.items,
                {
                    id: 'group-admin',
                    label: 'Group Admin',
                    icon: '👑',
                    path: '/group/admin.html',
                    subItems: [
                        {
                            id: 'group-admin-settings',
                            label: 'Settings',
                            icon: '⚙️',
                            path: '/group/admin/settings.html'
                        },
                        {
                            id: 'group-admin-invites',
                            label: 'Invitations',
                            icon: '📨',
                            path: '/group/admin/invites.html'
                        },
                        {
                            id: 'group-admin-reports',
                            label: 'Reports',
                            icon: '📊',
                            path: '/group/admin/reports.html'
                        },
                        {
                            id: 'group-admin-moderation',
                            label: 'Moderation',
                            icon: '🛡️',
                            path: '/group/admin/moderation.html'
                        }
                    ]
                }
            ]
        };
    }

    _getEmergencyCategories() {
        return [
            { id: 'emergency-fare', label: 'M-pesewa Fare', icon: '🚌', path: '/emergency/fare.html' },
            { id: 'emergency-data', label: 'M-pesewa Data', icon: '📶', path: '/emergency/data.html' },
            { id: 'emergency-gas', label: 'Cooking Gas', icon: '🔥', path: '/emergency/gas.html' },
            { id: 'emergency-food', label: 'M-pesewa Food', icon: '🍲', path: '/emergency/food.html' },
            { id: 'emergency-wifi', label: 'M-pesewa Wifi', icon: '📡', path: '/emergency/wifi.html' },
            { id: 'emergency-water', label: 'Water Bill', icon: '🚰', path: '/emergency/water.html' },
            { id: 'emergency-electricity', label: 'Electricity', icon: '⚡', path: '/emergency/electricity.html' },
            { id: 'emergency-tv', label: 'TV Subscription', icon: '📺', path: '/emergency/tv.html' },
            { id: 'emergency-fuel', label: 'M-pesewa Fuel', icon: '⛽', path: '/emergency/fuel.html' },
            { id: 'emergency-repair', label: 'M-pesewa Repair', icon: '🔧', path: '/emergency/repair.html' },
            { id: 'emergency-credo', label: 'M-pesewa Credo', icon: '🛠️', path: '/emergency/credo.html' },
            { id: 'emergency-sales', label: 'Daily Sales Advance', icon: '🧾', path: '/emergency/sales.html' },
            { id: 'emergency-capital', label: 'Working Capital', icon: '🏪', path: '/emergency/capital.html' },
            { id: 'emergency-soko', label: 'Soko Loan', icon: '🛒', path: '/emergency/soko.html' },
            { id: 'emergency-kidandaski', label: 'Kidandaski Loan', icon: '🏗️', path: '/emergency/kidandaski.html' },
            { id: 'emergency-hawker', label: 'Hawker Loan', icon: '🚶‍♂️', path: '/emergency/hawker.html' },
            { id: 'emergency-fuliziwa', label: 'M-fuliziwa Loan', icon: '🔄', path: '/emergency/fuliziwa.html' },
            { id: 'emergency-medicine', label: 'Medicine', icon: '💊', path: '/emergency/medicine.html' },
            { id: 'emergency-school', label: 'School Fees', icon: '🎓', path: '/emergency/school.html' },
            { id: 'emergency-advance', label: 'Quick Advance', icon: '💸', path: '/emergency/advance.html' }
        ];
    }

    // STATE MANAGEMENT
    _loadState() {
        this.isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
        this.activeItem = localStorage.getItem('sidebar-active-item') || null;
    }

    _saveState() {
        localStorage.setItem('sidebar-collapsed', this.isCollapsed);
        if (this.activeItem) {
            localStorage.setItem('sidebar-active-item', this.activeItem);
        }
    }

    // EVENT HANDLERS
    _setupEventListeners() {
        // Window resize handler
        window.addEventListener('resize', () => this._handleResize());
        
        // Click outside handler for mobile
        document.addEventListener('click', (e) => this._handleClickOutside(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this._handleKeyboardShortcuts(e));
    }

    _handleResize() {
        const width = window.innerWidth;
        if (width < 768 && !this.isCollapsed) {
            this.collapse();
        } else if (width >= 768 && this.isCollapsed) {
            this.expand();
        }
    }

    _handleClickOutside(e) {
        const sidebar = document.getElementById('mp-sidebar');
        const toggleBtn = document.getElementById('sidebar-toggle');
        
        if (sidebar && toggleBtn && 
            !sidebar.contains(e.target) && 
            !toggleBtn.contains(e.target) &&
            window.innerWidth < 768) {
            this.collapse();
        }
    }

    _handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + B to toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            this.toggle();
        }
        
        // Escape to collapse on mobile
        if (e.key === 'Escape' && window.innerWidth < 768 && !this.isCollapsed) {
            this.collapse();
        }
    }

    // SIDEBAR RENDERING
    _renderSidebar() {
        const container = document.getElementById('sidebar-container');
        if (!container) {
            console.error('Sidebar container not found');
            return;
        }

        const config = this._getCurrentSidebarConfig();
        if (!config) {
            container.innerHTML = '';
            return;
        }

        this.currentSidebar = config;
        
        const html = this._generateSidebarHTML(config);
        container.innerHTML = html;
        
        // Add event listeners
        this._attachEventListeners();
        
        // Update active item
        this._updateActiveItem();
        
        // Apply collapsed state
        if (this.isCollapsed) {
            container.classList.add('collapsed');
        } else {
            container.classList.remove('collapsed');
        }
    }

    _getCurrentSidebarConfig() {
        const context = this.contextResolver?.getCurrentContext() || {};
        const role = context.role || 'guest';
        const country = context.country;
        
        // Get base sidebar for role
        let sidebar = this.sidebarConfig.global[role];
        
        if (!sidebar) {
            console.error(`No sidebar configuration for role: ${role}`);
            sidebar = this.sidebarConfig.global.guest;
        }
        
        // Merge country-specific items if applicable
        if (country && this.sidebarConfig.country[country]) {
            const countryConfig = this.sidebarConfig.country[country];
            sidebar = this._mergeSidebarConfigs(sidebar, countryConfig);
        }
        
        // Merge group-specific items if applicable
        if (context.group) {
            const groupRole = context.groupRole || 'member';
            const groupConfig = this.sidebarConfig.group[groupRole];
            if (groupConfig) {
                sidebar = this._mergeSidebarConfigs(sidebar, groupConfig);
            }
        }
        
        return sidebar;
    }

    _mergeSidebarConfigs(baseConfig, additionalConfig) {
        const merged = { ...baseConfig };
        
        if (additionalConfig.items) {
            merged.items = [...(merged.items || []), ...additionalConfig.items];
        }
        
        if (additionalConfig.specificItems) {
            merged.items = [...(merged.items || []), ...additionalConfig.specificItems];
        }
        
        return merged;
    }

    _generateSidebarHTML(config) {
        const { colors, icons } = this.sidebarConfig.styling;
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        
        return `
            <aside id="mp-sidebar" class="mp-sidebar" style="
                background-color: ${colors.background};
                color: ${colors.text};
                border-right: 1px solid ${colors.border};
            ">
                <!-- Sidebar Header -->
                <div class="sidebar-header">
                    <div class="sidebar-brand">
                        <h2 class="sidebar-title">${config.title}</h2>
                        ${config.subtitle ? `<p class="sidebar-subtitle">${config.subtitle}</p>` : ''}
                    </div>
                    <button class="sidebar-toggle" id="sidebar-toggle" aria-label="${this.isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}">
                        ${this.isCollapsed ? '→' : '←'}
                    </button>
                </div>
                
                <!-- User Info Section -->
                ${config.userInfo?.show ? this._generateUserInfoHTML(userData, config) : ''}
                
                <!-- Navigation Items -->
                <nav class="sidebar-nav" aria-label="Sidebar navigation">
                    <ul class="sidebar-menu">
                        ${config.items.map(item => this._generateMenuItemHTML(item, userData)).join('')}
                    </ul>
                </nav>
                
                <!-- Footer Section -->
                ${config.footer?.show ? this._generateFooterHTML(config.footer, userData) : ''}
            </aside>
        `;
    }

    _generateUserInfoHTML(userData, config) {
        const context = this.contextResolver?.getCurrentContext() || {};
        
        let infoItems = [];
        
        if (config.userInfo.rating && userData.rating) {
            infoItems.push(`Rating: ${'★'.repeat(userData.rating)}${'☆'.repeat(5 - userData.rating)}`);
        }
        
        if (config.userInfo.groups && userData.groups) {
            infoItems.push(`Groups: ${userData.groups.length}/4`);
        }
        
        if (config.userInfo.subscription && context.subscription) {
            infoItems.push(`Subscription: ${context.subscription.tier}`);
        }
        
        if (config.userInfo.lendingLimit && context.subscription) {
            const tier = context.subscription.tier.toUpperCase();
            const limit = this._getSubscriptionLimit(tier);
            infoItems.push(`Limit: ${limit} ${context.country ? this._getCurrency(context.country) : ''}`);
        }
        
        if (config.userInfo.activeLedgers && userData.activeLedgers) {
            infoItems.push(`Active Ledgers: ${userData.activeLedgers}`);
        }
        
        if (config.userInfo.adminLevel && userData.adminLevel) {
            infoItems.push(`Admin Level: ${userData.adminLevel}`);
        }
        
        if (config.userInfo.lastLogin && userData.lastLogin) {
            infoItems.push(`Last Login: ${new Date(userData.lastLogin).toLocaleDateString()}`);
        }
        
        if (infoItems.length === 0) {
            return '';
        }
        
        return `
            <div class="sidebar-user-info">
                <div class="user-avatar">
                    ${userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div class="user-details">
                    <p class="user-name">${userData.name || 'Guest User'}</p>
                    <div class="user-stats">
                        ${infoItems.map(item => `<span class="user-stat">${item}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    _generateMenuItemHTML(item, userData) {
        // Check if item should be shown based on conditions
        if (item.condition && !item.condition(userData)) {
            return '';
        }
        
        const isActive = this.activeItem === item.id || 
                        (item.exact && window.location.pathname === item.path) ||
                        (!item.exact && window.location.pathname.startsWith(item.path));
        
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const subItemsVisible = hasSubItems && isActive;
        
        let badgeHTML = '';
        if (item.badge) {
            badgeHTML = `<span class="sidebar-badge">${item.badge}</span>`;
        }
        
        let disabledAttr = '';
        if (item.disabled) {
            disabledAttr = 'disabled aria-disabled="true"';
        }
        
        return `
            <li class="sidebar-menu-item ${isActive ? 'active' : ''} ${item.disabled ? 'disabled' : ''}">
                ${item.path && !item.disabled ? `
                    <a href="${item.path}" class="sidebar-menu-link" ${disabledAttr}
                       data-item-id="${item.id}"
                       ${hasSubItems ? 'data-has-subitems="true"' : ''}>
                ` : `
                    <span class="sidebar-menu-link" ${disabledAttr}
                          data-item-id="${item.id}"
                          ${hasSubItems ? 'data-has-subitems="true"' : ''}>
                `}
                    <span class="sidebar-icon">${item.icon}</span>
                    <span class="sidebar-label">${item.label}</span>
                    ${badgeHTML}
                    ${hasSubItems ? `<span class="sidebar-arrow">${subItemsVisible ? '▾' : '▸'}</span>` : ''}
                ${item.path && !item.disabled ? '</a>' : '</span>'}
                
                ${hasSubItems ? `
                    <ul class="sidebar-submenu ${subItemsVisible ? 'visible' : ''}">
                        ${item.subItems.map(subItem => this._generateSubMenuItemHTML(subItem, userData)).join('')}
                    </ul>
                ` : ''}
            </li>
        `;
    }

    _generateSubMenuItemHTML(subItem, userData) {
        if (subItem.condition && !subItem.condition(userData)) {
            return '';
        }
        
        const isActive = window.location.pathname === subItem.path;
        
        let badgeHTML = '';
        if (subItem.badge) {
            badgeHTML = `<span class="sidebar-badge">${subItem.badge}</span>`;
        }
        
        return `
            <li class="sidebar-submenu-item ${isActive ? 'active' : ''}">
                <a href="${subItem.path}" class="sidebar-submenu-link" data-item-id="${subItem.id}">
                    <span class="sidebar-icon">${subItem.icon}</span>
                    <span class="sidebar-label">${subItem.label}</span>
                    ${badgeHTML}
                </a>
            </li>
        `;
    }

    _generateFooterHTML(footerConfig, userData) {
        return `
            <div class="sidebar-footer">
                ${footerConfig.items.map(item => {
                    if (item.condition && !item.condition(userData)) {
                        return '';
                    }
                    
                    const typeClass = item.type ? `sidebar-footer-${item.type}` : '';
                    
                    if (item.action) {
                        return `
                            <button class="sidebar-footer-btn ${typeClass}" 
                                    data-action="${item.action}"
                                    ${item.role ? `data-role="${item.role}"` : ''}>
                                <span class="sidebar-icon">${item.icon}</span>
                                <span class="sidebar-label">${item.label}</span>
                            </button>
                        `;
                    } else {
                        return `
                            <a href="${item.path}" class="sidebar-footer-btn ${typeClass}">
                                <span class="sidebar-icon">${item.icon}</span>
                                <span class="sidebar-label">${item.label}</span>
                            </a>
                        `;
                    }
                }).join('')}
            </div>
        `;
    }

    _attachEventListeners() {
        // Toggle button
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
        
        // Menu item clicks
        document.querySelectorAll('.sidebar-menu-link[data-item-id]').forEach(link => {
            link.addEventListener('click', (e) => {
                const itemId = link.getAttribute('data-item-id');
                const hasSubItems = link.getAttribute('data-has-subitems') === 'true';
                
                if (hasSubItems && !link.hasAttribute('href')) {
                    e.preventDefault();
                    this._toggleSubMenu(itemId);
                } else {
                    this.setActiveItem(itemId);
                }
            });
        });
        
        // Footer button actions
        document.querySelectorAll('.sidebar-footer-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                const role = btn.getAttribute('data-role');
                this._handleFooterAction(action, role);
            });
        });
    }

    _handleFooterAction(action, role) {
        switch(action) {
            case 'switchRole':
                if (role && this.contextResolver?.switchRole) {
                    this.contextResolver.switchRole(role);
                }
                break;
                
            case 'showRoleSelector':
                this._showRoleSelector();
                break;
                
            case 'logout':
                this._logout();
                break;
                
            case 'exitAdmin':
                this._exitAdminMode();
                break;
        }
    }

    _showRoleSelector() {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        const roles = userData.roles || [];
        
        if (roles.length <= 1) return;
        
        const selector = document.createElement('div');
        selector.className = 'role-selector-modal';
        selector.innerHTML = `
            <div class="role-selector-content">
                <h3>Select Role</h3>
                ${roles.map(role => `
                    <button class="role-option" data-role="${role}">
                        ${role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                `).join('')}
                <button class="role-selector-close">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(selector);
        
        selector.querySelectorAll('.role-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const role = btn.getAttribute('data-role');
                if (this.contextResolver?.switchRole) {
                    this.contextResolver.switchRole(role);
                }
                document.body.removeChild(selector);
            });
        });
        
        selector.querySelector('.role-selector-close').addEventListener('click', () => {
            document.body.removeChild(selector);
        });
    }

    _logout() {
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_context');
        localStorage.removeItem('sidebar-collapsed');
        localStorage.removeItem('sidebar-active-item');
        
        window.location.href = '/auth/login.html';
    }

    _exitAdminMode() {
        const userData = JSON.parse(localStorage.getItem('mpesewa_user') || '{}');
        userData.role = userData.defaultRole || 'lender';
        localStorage.setItem('mpesewa_user', JSON.stringify(userData));
        
        window.location.reload();
    }

    _toggleSubMenu(itemId) {
        const item = document.querySelector(`[data-item-id="${itemId}"]`);
        if (!item) return;
        
        const submenu = item.parentElement.querySelector('.sidebar-submenu');
        const arrow = item.querySelector('.sidebar-arrow');
        
        if (submenu && arrow) {
            const isVisible = submenu.classList.contains('visible');
            
            if (isVisible) {
                submenu.classList.remove('visible');
                arrow.textContent = '▸';
            } else {
                // Close other submenus
                document.querySelectorAll('.sidebar-submenu.visible').forEach(sm => {
                    sm.classList.remove('visible');
                    const parentArrow = sm.parentElement.querySelector('.sidebar-arrow');
                    if (parentArrow) parentArrow.textContent = '▸';
                });
                
                submenu.classList.add('visible');
                arrow.textContent = '▾';
            }
        }
    }

    // PUBLIC METHODS
    setActiveItem(itemId) {
        this.activeItem = itemId;
        this._saveState();
        this._updateActiveItem();
    }

    _updateActiveItem() {
        // Remove active class from all items
        document.querySelectorAll('.sidebar-menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current item
        if (this.activeItem) {
            const activeItem = document.querySelector(`[data-item-id="${this.activeItem}"]`);
            if (activeItem) {
                activeItem.closest('.sidebar-menu-item')?.classList.add('active');
            }
        }
    }

    toggle() {
        this.isCollapsed = !this.isCollapsed;
        this._saveState();
        
        const container = document.getElementById('sidebar-container');
        if (container) {
            container.classList.toggle('collapsed', this.isCollapsed);
        }
        
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-label', 
                this.isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
            toggleBtn.textContent = this.isCollapsed ? '→' : '←';
        }
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('sidebar-toggle', {
            detail: { collapsed: this.isCollapsed }
        }));
    }

    collapse() {
        this.isCollapsed = true;
        this._saveState();
        
        const container = document.getElementById('sidebar-container');
        if (container) {
            container.classList.add('collapsed');
        }
        
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-label', 'Expand sidebar');
            toggleBtn.textContent = '→';
        }
    }

    expand() {
        this.isCollapsed = false;
        this._saveState();
        
        const container = document.getElementById('sidebar-container');
        if (container) {
            container.classList.remove('collapsed');
        }
        
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-label', 'Collapse sidebar');
            toggleBtn.textContent = '←';
        }
    }

    refresh() {
        this._renderSidebar();
    }

    // UTILITY METHODS
    _getSubscriptionLimit(tier) {
        const limits = {
            'BASIC': 1500,
            'PREMIUM': 5000,
            'SUPER': 20000,
            'LENDER_OF_LENDERS': 50000
        };
        return limits[tier] || 0;
    }

    _getCurrency(countryCode) {
        const country = MPESEWA_COUNTRIES.find(c => c.code === countryCode);
        return country?.currency || '';
    }
}

// Initialize and export
const sidebarController = new MpesewaSidebarController();

// Define MPESEWA_COUNTRIES if not already defined
const MPESEWA_COUNTRIES = [
    { code: 'KE', name: 'Kenya', currency: 'KSh' },
    { code: 'UG', name: 'Uganda', currency: 'UGX' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF' },
    { code: 'BI', name: 'Burundi', currency: 'BIF' },
    { code: 'CD', name: 'DRC', currency: 'CDF' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'GH', name: 'Ghana', currency: 'GHS' },
    { code: 'SS', name: 'South Sudan', currency: 'SSP' },
    { code: 'SO', name: 'Somalia', currency: 'SOS' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB' }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MpesewaSidebarController, sidebarController };
} else {
    window.MpesewaSidebarController = MpesewaSidebarController;
    window.sidebarController = sidebarController;
}