/* ============================================
   M-PESEWA - MAIN APPLICATION JS
   Core functionality, routing, and PWA features
   ============================================ */

// ============================================
// 1. APP CONFIGURATION & STATE
// ============================================
const Mpesewa = {
    config: {
        appName: 'M-PESEWA',
        version: '1.0.0',
        apiBase: 'https://api.mpesewa.com/v1',
        countryCode: null,
        currency: 'KES',
        userRole: null,
        userData: null
    },

    state: {
        isOnline: navigator.onLine,
        isInstalled: false,
        currentPage: null,
        authToken: localStorage.getItem('auth_token') || null,
        userSubscription: localStorage.getItem('user_subscription') || null,
        countryLock: localStorage.getItem('country_lock') || null
    },

    // ============================================
    // 2. INITIALIZATION
    // ============================================
    init: function() {
        console.log(`${this.config.appName} v${this.config.version} initializing...`);
        
        // Initialize core modules
        this.initPWA();
        this.initOfflineDetection();
        this.initRouting();
        this.initAuth();
        this.initUI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log(`${this.config.appName} initialized successfully.`);
    },

    // ============================================
    // 3. PWA FUNCTIONALITY
    // ============================================
    initPWA: function() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered:', registration);
                        this.state.isInstalled = true;
                        this.updateInstallButton();
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
            });
        }

        // Check if app is installed
        window.addEventListener('appinstalled', (event) => {
            console.log('App installed successfully');
            this.state.isInstalled = true;
            this.updateInstallButton();
        });

        // Show install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredPrompt = event;
            this.showInstallPrompt();
        });
    },

    showInstallPrompt: function() {
        const installBtn = document.getElementById('install-pwa');
        if (installBtn) {
            installBtn.style.display = 'block';
            installBtn.addEventListener('click', () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted install');
                        } else {
                            console.log('User dismissed install');
                        }
                        deferredPrompt = null;
                    });
                }
            });
        }
    },

    updateInstallButton: function() {
        const installBtn = document.getElementById('install-pwa');
        if (installBtn) {
            if (this.state.isInstalled) {
                installBtn.style.display = 'none';
            }
        }
    },

    // ============================================
    // 4. OFFLINE DETECTION
    // ============================================
    initOfflineDetection: function() {
        window.addEventListener('online', () => {
            this.state.isOnline = true;
            this.showToast('You are back online', 'success');
            document.body.classList.remove('offline');
        });

        window.addEventListener('offline', () => {
            this.state.isOnline = false;
            this.showToast('You are offline. Some features may be limited.', 'warning');
            document.body.classList.add('offline');
        });

        // Initial state
        if (!this.state.isOnline) {
            document.body.classList.add('offline');
            this.showToast('You are offline. Some features may be limited.', 'warning');
        }
    },

    // ============================================
    // 5. ROUTING & NAVIGATION
    // ============================================
    initRouting: function() {
        // Get current page from URL
        const path = window.location.pathname;
        this.state.currentPage = path.split('/').pop() || 'index.html';
        
        // Update active navigation
        this.updateActiveNav();
        
        // Handle internal navigation for smooth transitions
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin)) {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.includes('mailto:') && !href.includes('tel:')) {
                    e.preventDefault();
                    this.navigateTo(href);
                }
            }
        });

        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.pathname, false);
        });
    },

    navigateTo: function(url, pushState = true) {
        if (pushState) {
            window.history.pushState({}, '', url);
        }
        this.loadPage(url);
    },

    loadPage: function(url) {
        // Show loading indicator
        this.showLoading();
        
        // Update current page state
        this.state.currentPage = url.split('/').pop() || 'index.html';
        this.updateActiveNav();
        
        // Hide loading indicator after a delay
        setTimeout(() => {
            this.hideLoading();
            window.scrollTo(0, 0);
        }, 300);
    },

    updateActiveNav: function() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page link
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
            if (link.getAttribute('href') === currentPath || 
                (currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== 'index.html')) {
                link.classList.add('active');
            }
        });
    },

    // ============================================
    // 6. AUTHENTICATION
    // ============================================
    initAuth: function() {
        // Check for existing auth
        if (this.state.authToken) {
            this.loadUserData();
        }
        
        // Check subscription status
        if (this.state.userSubscription) {
            this.checkSubscriptionStatus();
        }
        
        // Check country lock
        if (this.state.countryLock) {
            this.config.countryCode = this.state.countryLock;
            this.updateCountryDisplay();
        }
    },

    loadUserData: function() {
        // Simulate API call
        setTimeout(() => {
            this.config.userData = {
                id: 'user_123',
                name: 'John Doe',
                role: 'lender',
                groups: ['family_group', 'church_group'],
                rating: 4.5,
                blacklisted: false
            };
            this.config.userRole = this.config.userData.role;
            this.updateUserUI();
        }, 500);
    },

    updateUserUI: function() {
        const userElements = document.querySelectorAll('.user-name, .user-role');
        userElements.forEach(el => {
            if (el.classList.contains('user-name') && this.config.userData) {
                el.textContent = this.config.userData.name;
            }
            if (el.classList.contains('user-role') && this.config.userRole) {
                el.textContent = this.config.userRole.charAt(0).toUpperCase() + this.config.userRole.slice(1);
            }
        });
    },

    checkSubscriptionStatus: function() {
        const subscription = JSON.parse(this.state.userSubscription);
        const expiryDate = new Date(subscription.expires);
        const today = new Date();
        
        if (expiryDate < today) {
            this.showToast('Your subscription has expired. Please renew to continue lending.', 'warning');
            document.body.classList.add('subscription-expired');
        }
    },

    // ============================================
    // 7. COUNTRY MANAGEMENT
    // ============================================
    selectCountry: function(countryCode, currency) {
        this.config.countryCode = countryCode;
        this.config.currency = currency;
        this.state.countryLock = countryCode;
        
        localStorage.setItem('country_lock', countryCode);
        
        this.updateCountryDisplay();
        this.showToast(`Country set to ${this.getCountryName(countryCode)}`, 'success');
    },

    getCountryName: function(code) {
        const countries = {
            'ke': 'Kenya',
            'ug': 'Uganda',
            'tz': 'Tanzania',
            'rw': 'Rwanda',
            'bi': 'Burundi',
            'so': 'Somalia',
            'ss': 'South Sudan',
            'et': 'Ethiopia',
            'cd': 'DR Congo',
            'ng': 'Nigeria',
            'gh': 'Ghana',
            'za': 'South Africa'
        };
        return countries[code] || code;
    },

    updateCountryDisplay: function() {
        const countryElements = document.querySelectorAll('.country-display, .currency-display');
        countryElements.forEach(el => {
            if (el.classList.contains('country-display') && this.config.countryCode) {
                el.textContent = this.getCountryName(this.config.countryCode);
                el.style.display = 'inline-block';
            }
            if (el.classList.contains('currency-display') && this.config.currency) {
                el.textContent = this.config.currency;
            }
        });
    },

    // ============================================
    // 8. UI COMPONENTS & INTERACTIONS
    // ============================================
    initUI: function() {
        // Initialize mobile menu
        this.initMobileMenu();
        
        // Initialize modals
        this.initModals();
        
        // Initialize dropdowns
        this.initDropdowns();
        
        // Initialize tabs
        this.initTabs();
        
        // Initialize forms
        this.initForms();
        
        // Initialize tooltips
        this.initTooltips();
        
        // Initialize notifications
        this.initNotifications();
    },

    initMobileMenu: function() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    },

    initModals: function() {
        // Open modal
        document.addEventListener('click', (e) => {
            const openBtn = e.target.closest('[data-modal]');
            if (openBtn) {
                const modalId = openBtn.getAttribute('data-modal');
                this.openModal(modalId);
            }
            
            // Close modal
            if (e.target.classList.contains('modal-overlay') || 
                e.target.classList.contains('modal-close') ||
                e.target.closest('.modal-close')) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    },

    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal: function() {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    },

    initDropdowns: function() {
        document.addEventListener('click', (e) => {
            const dropdownToggle = e.target.closest('.dropdown-toggle');
            if (dropdownToggle) {
                const dropdown = dropdownToggle.closest('.dropdown');
                dropdown.classList.toggle('active');
            } else {
                // Close all dropdowns when clicking outside
                document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    },

    initTabs: function() {
        document.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (tab && !tab.classList.contains('active')) {
                const tabContainer = tab.closest('.tabs');
                const tabContentId = tab.getAttribute('data-tab');
                
                // Update active tab
                tabContainer.querySelectorAll('.tab').forEach(t => {
                    t.classList.remove('active');
                });
                tab.classList.add('active');
                
                // Update active content
                const tabContentContainer = document.querySelector(tab.getAttribute('data-tabs'));
                if (tabContentContainer) {
                    tabContentContainer.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    const activeContent = tabContentContainer.querySelector(`#${tabContentId}`);
                    if (activeContent) {
                        activeContent.classList.add('active');
                    }
                }
            }
        });
    },

    initForms: function() {
        // Form validation
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.classList.contains('needs-validation')) {
                e.preventDefault();
                if (this.validateForm(form)) {
                    form.submit();
                }
            }
        });
        
        // Real-time validation
        document.addEventListener('input', (e) => {
            const input = e.target;
            if (input.classList.contains('form-control')) {
                this.validateInput(input);
            }
        });
    },

    validateForm: function(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('.form-control[required]');
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            form.classList.remove('was-validated');
        } else {
            form.classList.add('was-validated');
        }
        
        return isValid;
    },

    validateInput: function(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (input.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Password validation
        if (input.type === 'password' && value) {
            if (value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters';
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Update UI
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('success');
            this.clearInputError(input);
        } else {
            input.classList.remove('success');
            input.classList.add('error');
            this.showInputError(input, errorMessage);
        }
        
        return isValid;
    },

    showInputError: function(input, message) {
        this.clearInputError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-text error';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    },

    clearInputError: function(input) {
        const existingError = input.parentNode.querySelector('.form-text.error');
        if (existingError) {
            existingError.remove();
        }
    },

    initTooltips: function() {
        // Tooltips are handled by CSS
        // This function can be extended for dynamic tooltips
    },

    initNotifications: function() {
        // Notification system setup
    },

    // ============================================
    // 9. UTILITY FUNCTIONS
    // ============================================
    showLoading: function() {
        let loader = document.getElementById('global-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.className = 'global-loader';
            loader.innerHTML = '<div class="loading"></div>';
            document.body.appendChild(loader);
        }
        loader.classList.add('active');
    },

    hideLoading: function() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.classList.remove('active');
        }
    },

    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${this.getToastIcon(type)}</div>
                <div class="toast-message">${message}</div>
                <button class="toast-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
        
        // Close on click
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        });
    },

    getToastIcon: function(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    },

    formatCurrency: function(amount, currency = null) {
        const curr = currency || this.config.currency;
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: curr,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        return formatter.format(amount);
    },

    formatDate: function(date, format = 'medium') {
        const d = new Date(date);
        const options = {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            medium: {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            },
            long: {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        };
        
        return d.toLocaleDateString('en-US', options[format] || options.medium);
    },

    // ============================================
    // 10. EVENT LISTENERS SETUP
    // ============================================
    setupEventListeners: function() {
        // Country selection
        document.addEventListener('click', (e) => {
            const countryBtn = e.target.closest('.country-select');
            if (countryBtn) {
                const countryCode = countryBtn.getAttribute('data-country');
                const currency = countryBtn.getAttribute('data-currency');
                this.selectCountry(countryCode, currency);
            }
        });
        
        // Role selection (borrower/lender)
        document.addEventListener('click', (e) => {
            const roleBtn = e.target.closest('.role-select');
            if (roleBtn) {
                const role = roleBtn.getAttribute('data-role');
                this.selectRole(role);
            }
        });
        
        // Logout
        document.addEventListener('click', (e) => {
            if (e.target.closest('.logout-btn')) {
                this.logout();
            }
        });
        
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        });
    },

    selectRole: function(role) {
        this.config.userRole = role;
        localStorage.setItem('user_role', role);
        this.showToast(`Role set to ${role}`, 'success');
        
        // Redirect to appropriate dashboard
        if (role === 'borrower') {
            this.navigateTo('pages/dashboard/borrower-dashboard.html');
        } else if (role === 'lender') {
            this.navigateTo('pages/dashboard/lender-dashboard.html');
        }
    },

    logout: function() {
        this.state.authToken = null;
        this.config.userData = null;
        this.config.userRole = null;
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        this.showToast('Logged out successfully', 'success');
        setTimeout(() => {
            this.navigateTo('index.html');
        }, 1000);
    },

    toggleTheme: function() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = isDark ? '☀️' : '🌙';
        }
    },

    // ============================================
    // 11. ERROR HANDLING
    // ============================================
    handleError: function(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        let userMessage = 'An error occurred. Please try again.';
        
        if (error.message) {
            userMessage = error.message;
        }
        
        this.showToast(userMessage, 'error');
        
        // Log to error tracking service
        this.logError(error, context);
    },

    logError: function(error, context) {
        // In production, this would send to error tracking service
        const errorData = {
            timestamp: new Date().toISOString(),
            context: context,
            error: error.toString(),
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.log('Error logged:', errorData);
        
        // Store locally for debugging
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        errors.push(errorData);
        if (errors.length > 50) errors.shift(); // Keep only last 50 errors
        localStorage.setItem('app_errors', JSON.stringify(errors));
    },

    // ============================================
    // 12. CLEANUP & DESTRUCTION
    // ============================================
    cleanup: function() {
        // Clean up event listeners and resources
        console.log('Cleaning up application...');
        
        // Remove event listeners
        document.removeEventListener('click', this.handleClick);
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
        
        // Clear intervals and timeouts
        // (You should store timeout/interval IDs if you create any)
    }
};

// ============================================
// 13. INITIALIZE APP ON DOM CONTENT LOADED
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    Mpesewa.init();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = '☀️';
        }
    }
});

// ============================================
// 14. GLOBAL ERROR HANDLING
// ============================================
window.addEventListener('error', function(event) {
    Mpesewa.handleError(event.error, 'Global error');
});

window.addEventListener('unhandledrejection', function(event) {
    Mpesewa.handleError(event.reason, 'Unhandled promise rejection');
});

// ============================================
// 15. EXPORT FOR MODULES
// ============================================
// Export for module system if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Mpesewa;
}
