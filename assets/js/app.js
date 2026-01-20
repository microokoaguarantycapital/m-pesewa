/* assets/js/app.js */
/* M-PESEWA - Core Application JavaScript */
/* PWA, State Management, Routing, and Core Functionality */

'use strict';

// ===== GLOBAL STATE & CONFIGURATION =====
const Mpesewa = {
    // App Configuration
    config: {
        appName: 'M-PESEWA',
        version: '1.0.0',
        apiBaseUrl: 'https://api.m-pesewa.com/v1',
        currency: 'KES',
        countries: [],
        groups: [],
        currentUser: null,
        currentRole: null,
        currentCountry: null,
        currentGroup: null
    },

    // State Management
    state: {
        isOnline: navigator.onLine,
        isLoading: false,
        currentPage: 'landing',
        modalOpen: false,
        notifications: [],
        unreadCount: 0
    },

    // Constants
    constants: {
        ROLES: {
            BORROWER: 'borrower',
            LENDER: 'lender',
            ADMIN: 'admin'
        },
        
        STATUS: {
            ACTIVE: 'active',
            PENDING: 'pending',
            OVERDUE: 'overdue',
            DEFAULTED: 'defaulted',
            CLEARED: 'cleared',
            BLACKLISTED: 'blacklisted'
        },
        
        LOAN_CATEGORIES: [
            { id: 'fare', name: 'Fare', emoji: '🚗', description: 'Transport to work or hospital' },
            { id: 'food', name: 'Food', emoji: '🍚', description: 'Daily meal for family' },
            { id: 'gas', name: 'Gas', emoji: '⛽', description: 'Cooking gas refill' },
            { id: 'medicine', name: 'Medicine', emoji: '💊', description: 'Urgent prescription' },
            { id: 'fuel', name: 'Fuel', emoji: '⛽', description: 'Vehicle fuel emergency' },
            { id: 'school_fees', name: 'School Fees', emoji: '🎓', description: 'Child\'s school balance' },
            { id: 'kibanda', name: 'Kibanda', emoji: '🍲', description: 'Small food business stock' },
            { id: 'hawker', name: 'Hawker', emoji: '🛒', description: 'Market goods restock' },
            { id: 'fuliza', name: 'Fuliza', emoji: '💸', description: 'Clear mobile overdraft' },
            { id: 'electricity', name: 'Electricity', emoji: '💡', description: 'Prepaid electricity token' },
            { id: 'water', name: 'Water', emoji: '💧', description: 'Water bill payment' },
            { id: 'airtime', name: 'Airtime', emoji: '📱', description: 'Emergency communication' },
            { id: 'uniform', name: 'Uniform', emoji: '👕', description: 'School or work uniform' },
            { id: 'books', name: 'Books', emoji: '📚', description: 'Educational materials' },
            { id: 'hospital', name: 'Hospital', emoji: '🏥', description: 'Medical bill deposit' },
            { id: 'baby_items', name: 'Baby Items', emoji: '👶', description: 'Diapers, formula, etc.' },
            { id: 'repairs', name: 'Repairs', emoji: '🔧', description: 'Phone or essential item fix' },
            { id: 'rent', name: 'Rent', emoji: '🧹', description: 'Partial rent to avoid eviction' },
            { id: 'tools', name: 'Tools', emoji: '🛠️', description: 'Work tool replacement' },
            { id: 'supplies', name: 'Supplies', emoji: '📦', description: 'Small business supplies' },
            { id: 'emergency', name: 'Emergency', emoji: '🧯', description: 'Other urgent needs' }
        ],

        COUNTRIES: [
            { code: 'KE', name: 'Kenya', currency: 'KES', flag: '🇰🇪' },
            { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
            { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
            { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
            { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
            { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴' },
            { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
            { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' },
            { code: 'CD', name: 'DR Congo', currency: 'CDF', flag: '🇨🇩' },
            { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
            { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
            { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
            { code: 'ZM', name: 'Zambia', currency: 'ZMW', flag: '🇿🇲' },
            { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL', flag: '🇿🇼' },
            { code: 'MW', name: 'Malawi', currency: 'MWK', flag: '🇲🇼' },
            { code: 'MZ', name: 'Mozambique', currency: 'MZN', flag: '🇲🇿' },
            { code: 'SL', name: 'Sierra Leone', currency: 'SLL', flag: '🇸🇱' },
            { code: 'LR', name: 'Liberia', currency: 'LRD', flag: '🇱🇷' },
            { code: 'CM', name: 'Cameroon', currency: 'XAF', flag: '🇨🇲' },
            { code: 'SN', name: 'Senegal', currency: 'XOF', flag: '🇸🇳' },
            { code: 'CI', name: 'Côte d\'Ivoire', currency: 'XOF', flag: '🇨🇮' },
            { code: 'BJ', name: 'Benin', currency: 'XOF', flag: '🇧🇯' },
            { code: 'TG', name: 'Togo', currency: 'XOF', flag: '🇹🇬' },
            { code: 'NE', name: 'Niger', currency: 'XOF', flag: '🇳🇪' },
            { code: 'BF', name: 'Burkina Faso', currency: 'XOF', flag: '🇧🇫' }
        ],

        SUBSCRIPTIONS: {
            BASIC: {
                id: 'basic',
                name: 'Basic',
                weeklyLimit: 1500,
                monthlyPrice: 50,
                biAnnualPrice: 250,
                annualPrice: 500,
                crbRequired: false,
                ledgerLimit: 1500,
                features: [
                    'Max: ≤ KES 1,500 per week',
                    'Bi-annual: KES 250',
                    'Annual: KES 500',
                    'No CRB check required',
                    'Ledgers cannot exceed KES 1,500'
                ]
            },
            PREMIUM: {
                id: 'premium',
                name: 'Premium',
                weeklyLimit: 5000,
                monthlyPrice: 250,
                biAnnualPrice: 1500,
                annualPrice: 2500,
                crbRequired: false,
                ledgerLimit: 10000,
                features: [
                    'Max: ≤ KES 5,000 per week',
                    'Bi-annual: KES 1,500',
                    'Annual: KES 2,500',
                    'No CRB check required',
                    'Ledgers cannot exceed KES 10,000'
                ]
            },
            SUPER: {
                id: 'super',
                name: 'Super',
                weeklyLimit: 20000,
                monthlyPrice: 1000,
                biAnnualPrice: 5000,
                annualPrice: 8500,
                crbRequired: true,
                ledgerLimit: 20000,
                features: [
                    'Max: ≤ KES 20,000 per week',
                    'Bi-annual: KES 5,000',
                    'Annual: KES 8,500',
                    'CRB check required',
                    'Ledgers cannot exceed KES 20,000'
                ]
            },
            LENDER_OF_LENDERS: {
                id: 'lender_of_lenders',
                name: 'Lender of Lenders',
                weeklyLimit: 50000,
                monthlyPrice: 500,
                biAnnualPrice: 3500,
                annualPrice: 6500,
                crbRequired: true,
                ledgerLimit: null, // Unlimited
                features: [
                    'Max: ≤ KES 50,000 per week',
                    'Bi-annual: KES 3,500',
                    'Annual: KES 6,500',
                    'CRB check required',
                    'Set your own interest & terms'
                ]
            }
        },

        LOAN_RULES: {
            MAX_LOANS_PER_BORROWER: 4,
            LOAN_DURATION: 7, // days
            INTEREST_RATE: 0.10, // 10%
            DAILY_PENALTY_RATE: 0.05, // 5%
            DEFAULT_PERIOD: 60, // days
            MIN_AMOUNT: 100,
            MAX_AMOUNT: 50000
        }
    },

    // Cache Storage
    cache: {
        users: new Map(),
        groups: new Map(),
        ledgers: new Map(),
        notifications: new Map()
    }
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // DOM Manipulation
    getElement: (selector) => document.querySelector(selector),
    getElements: (selector) => document.querySelectorAll(selector),
    createElement: (tag, classes = '', attributes = {}) => {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        return element;
    },

    // Formatting
    formatCurrency: (amount, currency = Mpesewa.config.currency) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    formatDate: (date, format = 'medium') => {
        const d = new Date(date);
        const options = format === 'short' 
            ? { day: '2-digit', month: '2-digit', year: 'numeric' }
            : { day: 'numeric', month: 'long', year: 'numeric' };
        return d.toLocaleDateString('en-GB', options);
    },

    formatDateTime: (date) => {
        const d = new Date(date);
        return d.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Validation
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone: (phone) => {
        const re = /^[+]{0,1}[\d\s\-\(\)]{10,}$/;
        return re.test(phone);
    },

    validateAmount: (amount) => {
        const num = parseFloat(amount);
        return !isNaN(num) && num >= Mpesewa.constants.LOAN_RULES.MIN_AMOUNT && 
               num <= Mpesewa.constants.LOAN_RULES.MAX_AMOUNT;
    },

    // Storage
    setLocalStorage: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('LocalStorage set error:', e);
        }
    },

    getLocalStorage: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('LocalStorage get error:', e);
            return defaultValue;
        }
    },

    removeLocalStorage: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('LocalStorage remove error:', e);
        }
    },

    clearLocalStorage: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('LocalStorage clear error:', e);
        }
    },

    // Calculations
    calculateInterest: (principal, interestRate = Mpesewa.constants.LOAN_RULES.INTEREST_RATE) => {
        return Math.round(principal * interestRate);
    },

    calculatePenalty: (principal, daysOverdue, penaltyRate = Mpesewa.constants.LOAN_RULES.DAILY_PENALTY_RATE) => {
        return Math.round(principal * penaltyRate * daysOverdue);
    },

    calculateTotalDue: (principal, daysOverdue = 0) => {
        const interest = Utils.calculateInterest(principal);
        const penalty = daysOverdue > 0 ? Utils.calculatePenalty(principal, daysOverdue) : 0;
        return principal + interest + penalty;
    },

    // Random Data Generation (for demo purposes)
    generateId: (prefix = '') => {
        return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    generateRandomAmount: (min = 500, max = 20000) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

// ===== STATE MANAGEMENT =====
const StateManager = {
    // User State
    setCurrentUser: (user) => {
        Mpesewa.config.currentUser = user;
        Utils.setLocalStorage('currentUser', user);
        
        if (user && user.role) {
            Mpesewa.config.currentRole = user.role;
            Utils.setLocalStorage('currentRole', user.role);
            
            // Update UI based on role
            StateManager.updateRoleBasedUI();
        }
    },

    getCurrentUser: () => {
        return Mpesewa.config.currentUser || Utils.getLocalStorage('currentUser');
    },

    clearCurrentUser: () => {
        Mpesewa.config.currentUser = null;
        Mpesewa.config.currentRole = null;
        Utils.removeLocalStorage('currentUser');
        Utils.removeLocalStorage('currentRole');
        
        // Redirect to landing page
        window.location.href = './index.html';
    },

    // Country State
    setCurrentCountry: (country) => {
        Mpesewa.config.currentCountry = country;
        Utils.setLocalStorage('currentCountry', country);
    },

    getCurrentCountry: () => {
        return Mpesewa.config.currentCountry || Utils.getLocalStorage('currentCountry');
    },

    // Group State
    setCurrentGroup: (group) => {
        Mpesewa.config.currentGroup = group;
        Utils.setLocalStorage('currentGroup', group);
    },

    getCurrentGroup: () => {
        return Mpesewa.config.currentGroup || Utils.getLocalStorage('currentGroup');
    },

    // App State
    setLoading: (isLoading) => {
        Mpesewa.state.isLoading = isLoading;
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.style.display = isLoading ? 'flex' : 'none';
        }
    },

    setOnlineStatus: (isOnline) => {
        Mpesewa.state.isOnline = isOnline;
        StateManager.showNotification(
            isOnline ? 'You are back online' : 'You are offline',
            isOnline ? 'success' : 'warning'
        );
    },

    // Notifications
    showNotification: (message, type = 'info', duration = 5000) => {
        const notification = {
            id: Utils.generateId('notification_'),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };

        Mpesewa.state.notifications.unshift(notification);
        Mpesewa.state.unreadCount++;

        // Update UI
        StateManager.updateNotificationBadge();
        
        // Show toast notification
        StateManager.showToast(message, type, duration);
    },

    showToast: (message, type = 'info', duration = 5000) => {
        const toast = Utils.createElement('div', `toast toast-${type}`);
        toast.textContent = message;
        
        const container = document.getElementById('toastContainer') || 
                         StateManager.createToastContainer();
        container.appendChild(toast);

        // Remove toast after duration
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    },

    createToastContainer: () => {
        const container = Utils.createElement('div', 'toast-container');
        container.id = 'toastContainer';
        document.body.appendChild(container);
        return container;
    },

    updateNotificationBadge: () => {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = Mpesewa.state.unreadCount > 99 ? '99+' : Mpesewa.state.unreadCount;
            badge.style.display = Mpesewa.state.unreadCount > 0 ? 'flex' : 'none';
        }
    },

    // UI Updates based on role
    updateRoleBasedUI: () => {
        const role = Mpesewa.config.currentRole;
        const loginBtn = document.getElementById('loginBtn');
        const dashboardBtn = document.getElementById('dashboardBtn');
        const userMenu = document.getElementById('userMenu');

        if (!role) {
            // Not logged in
            if (loginBtn) loginBtn.style.display = 'flex';
            if (dashboardBtn) dashboardBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'none';
        } else {
            // Logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (dashboardBtn) dashboardBtn.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'flex';

            // Update user info in menu
            const userName = document.getElementById('userName');
            const userRole = document.getElementById('userRole');
            const user = StateManager.getCurrentUser();

            if (userName && user) userName.textContent = user.name || user.email;
            if (userRole) userRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        }
    }
};

// ===== ROUTING & NAVIGATION =====
const Router = {
    // Page routing
    navigateTo: (page, params = {}) => {
        Mpesewa.state.currentPage = page;
        
        // Store params in session storage for page refresh
        if (Object.keys(params).length > 0) {
            sessionStorage.setItem('routeParams', JSON.stringify(params));
        }

        // Update active navigation
        Router.updateActiveNav(page);
        
        // Scroll to top
        window.scrollTo(0, 0);
    },

    updateActiveNav: (currentPage) => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    },

    // Handle back button
    handleBackButton: () => {
        window.history.back();
    },

    // Initialize routing
    init: () => {
        // Handle internal navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-route');
                Router.navigateTo(page);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
            Router.navigateTo(page);
        });
    }
};

// ===== FORM HANDLING =====
const FormHandler = {
    // Form validation
    validateForm: (formId) => {
        const form = document.getElementById(formId);
        if (!form) return false;

        const inputs = form.querySelectorAll('[data-validate]');
        let isValid = true;

        inputs.forEach(input => {
            if (!FormHandler.validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    },

    validateInput: (input) => {
        const value = input.value.trim();
        const type = input.type;
        const dataType = input.getAttribute('data-type');
        const isRequired = input.hasAttribute('required');

        // Clear previous error
        FormHandler.clearError(input);

        // Check required field
        if (isRequired && !value) {
            FormHandler.showError(input, 'This field is required');
            return false;
        }

        // Validate based on type or data-type
        if (value) {
            switch (type) {
                case 'email':
                    if (!Utils.validateEmail(value)) {
                        FormHandler.showError(input, 'Please enter a valid email address');
                        return false;
                    }
                    break;
            }

            switch (dataType) {
                case 'phone':
                    if (!Utils.validatePhone(value)) {
                        FormHandler.showError(input, 'Please enter a valid phone number');
                        return false;
                    }
                    break;
                case 'amount':
                    if (!Utils.validateAmount(value)) {
                        const min = Mpesewa.constants.LOAN_RULES.MIN_AMOUNT;
                        const max = Mpesewa.constants.LOAN_RULES.MAX_AMOUNT;
                        FormHandler.showError(input, `Amount must be between ${Utils.formatCurrency(min)} and ${Utils.formatCurrency(max)}`);
                        return false;
                    }
                    break;
                case 'password':
                    if (value.length < 8) {
                        FormHandler.showError(input, 'Password must be at least 8 characters');
                        return false;
                    }
                    break;
            }
        }

        return true;
    },

    showError: (input, message) => {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        FormHandler.clearError(input);

        // Add error class
        input.classList.add('error');

        // Create error message
        const errorElement = Utils.createElement('div', 'form-error');
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    },

    clearError: (input) => {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        input.classList.remove('error');
        
        const existingError = formGroup.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    },

    // Form submission
    handleSubmit: (formId, callback) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!FormHandler.validateForm(formId)) {
                StateManager.showNotification('Please correct the errors in the form', 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            try {
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Call callback with form data
                if (callback) {
                    await callback(data);
                }

                // Reset form
                form.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                StateManager.showNotification('An error occurred. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
};

// ===== MODAL MANAGEMENT =====
const ModalManager = {
    // Open modal
    open: (modalId, options = {}) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        Mpesewa.state.modalOpen = true;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on first input if exists
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // Call onOpen callback if provided
        if (options.onOpen && typeof options.onOpen === 'function') {
            options.onOpen();
        }
    },

    // Close modal
    close: (modalId, options = {}) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        Mpesewa.state.modalOpen = false;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';

        // Call onClose callback if provided
        if (options.onClose && typeof options.onClose === 'function') {
            options.onClose();
        }
    },

    // Initialize all modals
    init: () => {
        // Close modal on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    ModalManager.close(modal.id);
                }
            });
        });

        // Close modal on close button click
        document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.getAttribute('data-modal-close') || 
                              btn.closest('.modal').id;
                ModalManager.close(modalId);
            });
        });

        // Open modal triggers
        document.querySelectorAll('[data-modal-open]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.getAttribute('data-modal-open');
                ModalManager.open(modalId);
            });
        });
    }
};

// ===== TABLE MANAGEMENT =====
const TableManager = {
    // Initialize sortable tables
    initSortableTables: () => {
        document.querySelectorAll('th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const table = th.closest('table');
                const columnIndex = Array.from(th.parentNode.children).indexOf(th);
                const isAscending = th.classList.contains('asc');
                
                TableManager.sortTable(table, columnIndex, !isAscending);
                
                // Update sort indicators
                table.querySelectorAll('th.sortable').forEach(header => {
                    header.classList.remove('asc', 'desc');
                });
                
                th.classList.add(isAscending ? 'desc' : 'asc');
            });
        });
    },

    // Sort table by column
    sortTable: (table, columnIndex, ascending = true) => {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            const aText = a.children[columnIndex].textContent.trim();
            const bText = b.children[columnIndex].textContent.trim();
            
            // Try to parse as number
            const aNum = parseFloat(aText.replace(/[^0-9.-]+/g, ''));
            const bNum = parseFloat(bText.replace(/[^0-9.-]+/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return ascending ? aNum - bNum : bNum - aNum;
            }
            
            // Otherwise sort as string
            return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });

        // Reorder rows
        rows.forEach(row => tbody.appendChild(row));
    },

    // Filter table
    filterTable: (tableId, searchTerm) => {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        const searchLower = searchTerm.toLowerCase();

        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(searchLower) ? '' : 'none';
        });
    },

    // Paginate table
    paginateTable: (tableId, pageSize = 10) => {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        const totalRows = rows.length;
        const totalPages = Math.ceil(totalRows / pageSize);
        let currentPage = 1;

        // Create pagination controls if they don't exist
        let pagination = table.nextElementSibling;
        if (!pagination || !pagination.classList.contains('pagination')) {
            pagination = Utils.createElement('div', 'pagination');
            table.parentNode.insertBefore(pagination, table.nextSibling);
        }

        // Function to show page
        const showPage = (page) => {
            const start = (page - 1) * pageSize;
            const end = start + pageSize;

            rows.forEach((row, index) => {
                row.style.display = (index >= start && index < end) ? '' : 'none';
            });

            currentPage = page;
            updatePaginationControls();
        };

        // Update pagination controls
        const updatePaginationControls = () => {
            pagination.innerHTML = '';

            // Previous button
            const prevBtn = Utils.createElement('button', 'btn btn-outline btn-sm');
            prevBtn.innerHTML = '&laquo; Previous';
            prevBtn.disabled = currentPage === 1;
            prevBtn.addEventListener('click', () => showPage(currentPage - 1));
            pagination.appendChild(prevBtn);

            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = Utils.createElement('button', 'btn btn-outline btn-sm');
                pageBtn.textContent = i;
                if (i === currentPage) {
                    pageBtn.classList.add('active');
                }
                pageBtn.addEventListener('click', () => showPage(i));
                pagination.appendChild(pageBtn);
            }

            // Next button
            const nextBtn = Utils.createElement('button', 'btn btn-outline btn-sm');
            nextBtn.innerHTML = 'Next &raquo;';
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.addEventListener('click', () => showPage(currentPage + 1));
            pagination.appendChild(nextBtn);

            // Page info
            const pageInfo = Utils.createElement('span', 'page-info');
            pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${totalRows} records)`;
            pagination.appendChild(pageInfo);
        };

        // Initialize
        showPage(1);
    }
};

// ===== CHARTING (Simple charts for dashboard) =====
const ChartManager = {
    // Create simple bar chart
    createBarChart: (canvasId, data, options = {}) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { labels, values, colors } = data;
        
        // Set canvas size
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = options.height || 200;

        // Calculate dimensions
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const barWidth = chartWidth / labels.length * 0.7;
        const maxValue = Math.max(...values);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bars
        labels.forEach((label, index) => {
            const barHeight = (values[index] / maxValue) * chartHeight;
            const x = padding + (chartWidth / labels.length) * index;
            const y = canvas.height - padding - barHeight;

            // Draw bar
            ctx.fillStyle = colors?.[index] || '#2B1D4F';
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw label
            ctx.fillStyle = '#212121';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + barWidth / 2, canvas.height - padding + 15);

            // Draw value
            ctx.fillStyle = '#2B1D4F';
            ctx.font = 'bold 12px Inter';
            ctx.fillText(Utils.formatCurrency(values[index]), x + barWidth / 2, y - 5);
        });

        // Draw axes
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;

        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.stroke();
    },

    // Create simple pie chart
    createPieChart: (canvasId, data) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { labels, values, colors } = data;
        const total = values.reduce((sum, val) => sum + val, 0);

        // Set canvas size
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.width; // Make it square

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        let startAngle = 0;

        // Draw pie slices
        values.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = colors?.[index] || this.getColor(index);
            ctx.fill();

            // Draw label
            const labelAngle = startAngle + sliceAngle / 2;
            const labelRadius = radius * 1.2;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;

            ctx.fillStyle = '#212121';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const percentage = ((value / total) * 100).toFixed(1);
            ctx.fillText(`${labels[index]} (${percentage}%)`, labelX, labelY);

            startAngle = endAngle;
        });
    },

    // Helper to get colors
    getColor: (index) => {
        const colors = ['#2B1D4F', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800'];
        return colors[index % colors.length];
    }
};

// ===== INITIALIZATION =====
const App = {
    // Initialize the application
    init: () => {
        console.log('M-PESEWA App Initializing...');

        // Initialize components in order
        App.initPWA();
        App.initEventListeners();
        App.initModals();
        App.initTables();
        App.initForms();
        App.initRouter();
        App.initUserState();
        App.initOfflineDetection();
        
        // Load initial data
        App.loadInitialData();
        
        // Show welcome message
        setTimeout(() => {
            const user = StateManager.getCurrentUser();
            if (user) {
                StateManager.showNotification(`Welcome back, ${user.name || 'User'}!`, 'info');
            }
        }, 1000);

        console.log('M-PESEWA App Initialized');
    },

    // Initialize PWA features
    initPWA: () => {
        // Check if service worker is supported
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker registered:', registration);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }

        // Handle app installation
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button if not already installed
            const installBtn = document.getElementById('installBtn');
            if (installBtn) {
                installBtn.style.display = 'flex';
                installBtn.addEventListener('click', () => {
                    installBtn.style.display = 'none';
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted install');
                        }
                        deferredPrompt = null;
                    });
                });
            }
        });

        // Check if app is already installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed');
            const installBtn = document.getElementById('installBtn');
            if (installBtn) installBtn.style.display = 'none';
        });
    },

    // Initialize event listeners
    initEventListeners: () => {
        // Online/offline detection
        window.addEventListener('online', () => {
            StateManager.setOnlineStatus(true);
        });

        window.addEventListener('offline', () => {
            StateManager.setOnlineStatus(false);
        });

        // Escape key closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && Mpesewa.state.modalOpen) {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    ModalManager.close(activeModal.id);
                }
            }
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                App.logout();
            });
        }

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                App.showNotifications();
            });
        }
    },

    // Initialize modals
    initModals: () => {
        ModalManager.init();
    },

    // Initialize tables
    initTables: () => {
        TableManager.initSortableTables();
        
        // Initialize table search
        document.querySelectorAll('[data-table-search]').forEach(input => {
            const tableId = input.getAttribute('data-table-search');
            input.addEventListener('input', (e) => {
                TableManager.filterTable(tableId, e.target.value);
            });
        });
    },

    // Initialize forms
    initForms: () => {
        // Real-time validation
        document.querySelectorAll('[data-validate]').forEach(input => {
            input.addEventListener('blur', () => {
                FormHandler.validateInput(input);
            });
        });

        // Initialize specific forms
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            FormHandler.handleSubmit('loginForm', async (data) => {
                // Mock login - in production this would be an API call
                const mockUser = {
                    id: Utils.generateId('user_'),
                    email: data.email,
                    name: 'Demo User',
                    role: data.email.includes('lender') ? 'lender' : 
                          data.email.includes('admin') ? 'admin' : 'borrower',
                    country: 'KE',
                    groups: ['family_group', 'work_group'],
                    subscription: data.email.includes('lender') ? 'premium' : null,
                    joined: new Date().toISOString()
                };

                StateManager.setCurrentUser(mockUser);
                StateManager.showNotification('Login successful!', 'success');
                
                // Redirect to dashboard based on role
                setTimeout(() => {
                    window.location.href = `./pages/dashboard/${mockUser.role}-dashboard.html`;
                }, 1000);
            });
        }
    },

    // Initialize router
    initRouter: () => {
        Router.init();
    },

    // Initialize user state
    initUserState: () => {
        const user = StateManager.getCurrentUser();
        if (user) {
            StateManager.setCurrentUser(user);
        }
    },

    // Initialize offline detection
    initOfflineDetection: () => {
        StateManager.setOnlineStatus(navigator.onLine);
    },

    // Load initial data
    loadInitialData: () => {
        // Load demo data for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            App.loadDemoData();
        }
    },

    // Load demo data (for development only)
    loadDemoData: () => {
        // Mock groups
        Mpesewa.config.groups = [
            { id: 'family_group', name: 'Family Group', type: 'family', country: 'KE', members: 25, lenders: 8, borrowers: 17 },
            { id: 'church_group', name: 'Church Group', type: 'church', country: 'KE', members: 45, lenders: 15, borrowers: 30 },
            { id: 'work_group', name: 'Work Group', type: 'professional', country: 'KE', members: 12, lenders: 4, borrowers: 8 }
        ];

        // Mock ledgers for demo
        if (StateManager.getCurrentUser()?.role === 'lender') {
            Mpesewa.cache.ledgers.set('demo_ledgers', [
                {
                    id: Utils.generateId('ledger_'),
                    borrower: 'John Kamau',
                    amount: 2000,
                    category: 'Food',
                    date: new Date(Date.now() - 86400000 * 3).toISOString(),
                    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
                    status: 'active',
                    interest: 200,
                    penalty: 0,
                    paid: 1000
                },
                {
                    id: Utils.generateId('ledger_'),
                    borrower: 'Mary Wanjiku',
                    amount: 5000,
                    category: 'School Fees',
                    date: new Date(Date.now() - 86400000 * 10).toISOString(),
                    dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
                    status: 'overdue',
                    interest: 500,
                    penalty: 750,
                    paid: 3000
                }
            ]);
        }
    },

    // Logout function
    logout: () => {
        if (confirm('Are you sure you want to logout?')) {
            StateManager.clearCurrentUser();
            StateManager.showNotification('Logged out successfully', 'info');
        }
    },

    // Show notifications panel
    showNotifications: () => {
        const panel = document.getElementById('notificationsPanel');
        if (!panel) {
            App.createNotificationsPanel();
        } else {
            panel.classList.toggle('active');
        }
    },

    // Create notifications panel
    createNotificationsPanel: () => {
        const panel = Utils.createElement('div', 'notifications-panel');
        panel.id = 'notificationsPanel';
        
        const header = Utils.createElement('div', 'notifications-header');
        header.innerHTML = `
            <h3>Notifications</h3>
            <button class="btn btn-sm btn-outline" id="markAllRead">Mark all as read</button>
        `;
        
        const list = Utils.createElement('div', 'notifications-list');
        
        // Add mock notifications for demo
        const notifications = [
            { id: 1, message: 'New loan request from John Kamau', time: '2 hours ago', read: false },
            { id: 2, message: 'Your subscription expires in 3 days', time: '1 day ago', read: true },
            { id: 3, message: 'Mary Wanjiku made a payment of KES 1,000', time: '2 days ago', read: false }
        ];
        
        notifications.forEach(notification => {
            const item = Utils.createElement('div', `notification-item ${notification.read ? 'read' : 'unread'}`);
            item.innerHTML = `
                <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
            `;
            list.appendChild(item);
        });
        
        panel.appendChild(header);
        panel.appendChild(list);
        document.body.appendChild(panel);
        
        // Add event listeners
        document.getElementById('markAllRead')?.addEventListener('click', () => {
            Mpesewa.state.unreadCount = 0;
            StateManager.updateNotificationBadge();
            panel.querySelectorAll('.notification-item').forEach(item => {
                item.classList.add('read');
                item.classList.remove('unread');
            });
        });
        
        // Toggle panel
        panel.classList.add('active');
    }
};

// ===== EXPORT FOR MODULE USAGE =====
// Note: In production, this would be ES6 modules
// For now, we expose to global scope for compatibility
window.Mpesewa = Mpesewa;
window.Utils = Utils;
window.StateManager = StateManager;
window.Router = Router;
window.FormHandler = FormHandler;
window.ModalManager = ModalManager;
window.TableManager = TableManager;
window.ChartManager = ChartManager;
window.App = App;

// ===== INITIALIZE ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Add global loader
    const loader = Utils.createElement('div', 'loader-overlay');
    loader.id = 'globalLoader';
    loader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loader);
    
    // Initialize app
    App.init();
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    StateManager.showNotification('An unexpected error occurred', 'error');
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator && !window.location.hostname.includes('localhost')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js');
    });
}