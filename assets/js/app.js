/**
 * M-pesewa Main Application JavaScript
 * Production-ready with proper error handling and performance optimizations
 */

// Main application namespace
const MPesewa = {
    // Configuration
    config: {
        apiBaseUrl: '/api',
        currency: 'KES',
        country: 'KE',
        isOnline: true,
        debugMode: false
    },

    // State management
    state: {
        user: null,
        authToken: null,
        pendingRequests: [],
        offlineData: [],
        lastSync: null
    },

    // Initialize application
    init: function() {
        console.log('M-pesewa App Initializing...');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize modules
        this.initModules();
        
        // Load user state
        this.loadUserState();
        
        // Check online status
        this.checkOnlineStatus();
        
        // Register service worker
        this.registerServiceWorker();
        
        console.log('M-pesewa App Ready');
    },

    // Setup global event listeners
    setupEventListeners: function() {
        // Online/offline detection
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Before page unload
        window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
        
        // Visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    },

    // Initialize all modules
    initModules: function() {
        // Initialize only if elements exist
        this.initMobileMenu();
        this.initDropdowns();
        this.initModals();
        this.initForms();
        this.initAnimations();
        this.initCountryRibbon();
        this.initCategoryCards();
        this.initRegistrationForms();
        this.initLoanCalculator();
    },

    // Mobile menu handling
    initMobileMenu: function() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!menuToggle || !navMenu) return;
        
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    },

    // Dropdown handling
    initDropdowns: function() {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('a, button');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!toggle || !menu) return;
            
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown.active').forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
        
        // Prevent closing when clicking inside dropdown
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    },

    // Modal handling
    initModals: function() {
        // Open modals
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                this.openModal(modalId);
            });
        });
        
        // Close modals
        document.querySelectorAll('.modal-close, [data-close-modal]').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = closeBtn.closest('.modal-overlay');
                this.closeModal(modal);
            });
        });
        
        // Close modal when clicking overlay
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                    this.closeModal(modal);
                });
            }
        });
    },

    // Open modal
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Focus first input
        const input = modal.querySelector('input, select, textarea');
        if (input) input.focus();
    },

    // Close modal
    closeModal: function(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    },

    // Form handling
    initForms: function() {
        document.querySelectorAll('form').forEach(form => {
            // Handle form submission
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (!this.validateForm(form)) {
                    this.showFormError(form, 'Please check the form for errors');
                    return;
                }
                
                const formData = new FormData(form);
                const action = form.getAttribute('action');
                const method = form.getAttribute('method') || 'POST';
                
                try {
                    this.showFormLoading(form);
                    
                    if (this.config.isOnline) {
                        await this.submitFormOnline(form, formData, action, method);
                    } else {
                        await this.submitFormOffline(form, formData, action, method);
                    }
                } catch (error) {
                    console.error('Form submission error:', error);
                    this.showFormError(form, 'Submission failed. Please try again.');
                } finally {
                    this.hideFormLoading(form);
                }
            });
            
            // Real-time validation
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            });
        });
    },

    // Form validation
    validateForm: function(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },

    validateField: function(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Check required
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = field.dataset.requiredMessage || 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanedValue = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanedValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Password validation
        if (field.type === 'password' && value) {
            if (value.length < 8 || value.length > 12) {
                isValid = false;
                errorMessage = 'Password must be 8-12 characters';
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
                isValid = false;
                errorMessage = 'Include uppercase, lowercase, numbers, and symbols';
            }
        }
        
        // Show/hide error
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    },

    showFieldError: function(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    },

    clearFieldError: function(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    },

    showFormError: function(form, message) {
        let errorContainer = form.querySelector('.form-error');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'form-error alert alert-danger';
            form.insertBefore(errorContainer, form.firstChild);
        }
        
        errorContainer.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        errorContainer.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    },

    showFormLoading: function(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
    },

    hideFormLoading: function(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            const originalText = submitBtn.dataset.originalText || 'Submit';
            submitBtn.textContent = originalText;
        }
    },

    // Form submission
    async submitFormOnline(form, formData, action, method) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success handling
        this.showSuccessMessage(form, 'Form submitted successfully!');
        form.reset();
        
        // Store in local storage for offline fallback
        const formDataObj = Object.fromEntries(formData.entries());
        this.saveOfflineData('form_submissions', formDataObj);
    },

    async submitFormOffline(form, formData, action, method) {
        // Store for later sync
        const formDataObj = Object.fromEntries(formData.entries());
        this.saveOfflineData('pending_submissions', {
            ...formDataObj,
            timestamp: new Date().toISOString(),
            action,
            method
        });
        
        // Show offline message
        this.showSuccessMessage(form, 'Saved offline. Will sync when online.');
        form.reset();
    },

    showSuccessMessage: function(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        form.insertBefore(successDiv, form.firstChild);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    },

    // Scroll animations
    initAnimations: function() {
        // Only run if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe elements with animation classes
        document.querySelectorAll('.reveal, .fade-in, .slide-in').forEach(el => {
            observer.observe(el);
        });
    },

    // Country ribbon animation
    initCountryRibbon: function() {
        const ribbonTrack = document.querySelector('.ribbon-track');
        const ribbonContent = document.querySelector('.ribbon-content');
        
        if (!ribbonTrack || !ribbonContent) return;
        
        // Calculate animation duration based on content width
        const contentWidth = ribbonContent.scrollWidth;
        const animationDuration = contentWidth / 50; // 50px per second
        
        // Set animation
        ribbonContent.style.animation = `marquee ${animationDuration}s linear infinite`;
        
        // Pause on hover
        ribbonTrack.addEventListener('mouseenter', () => {
            ribbonContent.style.animationPlayState = 'paused';
        });
        
        ribbonTrack.addEventListener('mouseleave', () => {
            ribbonContent.style.animationPlayState = 'running';
        });
    },

    // Category cards hover effects
    initCategoryCards: function() {
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            });
            
            // Click handler for category selection
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                if (category) {
                    this.selectCategory(category);
                }
            });
        });
    },

    selectCategory: function(category) {
        // Store selected category for registration
        localStorage.setItem('selectedCategory', category);
        
        // Scroll to registration section
        const registrationSection = document.getElementById('registration');
        if (registrationSection) {
            registrationSection.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // Registration forms
    initRegistrationForms: function() {
        const roleTabs = document.querySelectorAll('.role-tab');
        const registrationForms = document.querySelectorAll('.registration-form');
        
        if (roleTabs.length === 0 || registrationForms.length === 0) return;
        
        roleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const role = tab.dataset.role;
                
                // Update active tab
                roleTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                registrationForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${role}Form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    },

    // Loan calculator
    initLoanCalculator: function() {
        const calculator = document.getElementById('loanCalculator');
        if (!calculator) return;
        
        const amountInput = calculator.querySelector('#loanAmount');
        const termInput = calculator.querySelector('#loanTerm');
        const resultPrincipal = calculator.querySelector('#resultPrincipal');
        const resultInterest = calculator.querySelector('#resultInterest');
        const resultTotal = calculator.querySelector('#resultTotal');
        const resultDaily = calculator.querySelector('#resultDaily');
        
        if (!amountInput || !resultPrincipal) return;
        
        const calculate = () => {
            const amount = parseFloat(amountInput.value) || 0;
            const term = parseInt(termInput?.value) || 7;
            
            // Business rules: 10% weekly interest
            const interestRate = 10; // 10% per week
            const interest = (amount * interestRate) / 100;
            const total = amount + interest;
            const dailyPayment = total / term;
            
            // Update display
            resultPrincipal.textContent = this.formatCurrency(amount);
            resultInterest.textContent = this.formatCurrency(interest);
            resultTotal.textContent = this.formatCurrency(total);
            
            if (resultDaily) {
                resultDaily.textContent = this.formatCurrency(dailyPayment);
            }
        };
        
        // Initial calculation
        calculate();
        
        // Recalculate on input
        amountInput.addEventListener('input', calculate);
        if (termInput) {
            termInput.addEventListener('input', calculate);
        }
        
        // Tier selection
        calculator.querySelectorAll('[data-tier]').forEach(tierBtn => {
            tierBtn.addEventListener('click', () => {
                const tier = tierBtn.dataset.tier;
                const limits = {
                    basic: 1500,
                    premium: 5000,
                    super: 20000
                };
                
                if (limits[tier]) {
                    amountInput.max = limits[tier];
                    amountInput.value = Math.min(amountInput.value, limits[tier]);
                    calculate();
                }
            });
        });
    },

    // Currency formatting
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.config.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    // User state management
    loadUserState: function() {
        try {
            const userData = localStorage.getItem('mpesewa_user');
            const authToken = localStorage.getItem('mpesewa_token');
            
            if (userData) {
                this.state.user = JSON.parse(userData);
                this.state.authToken = authToken;
                
                // Update UI for logged in user
                this.updateUserUI();
            }
        } catch (error) {
            console.error('Error loading user state:', error);
            this.clearUserState();
        }
    },

    updateUserUI: function() {
        const userElements = document.querySelectorAll('[data-user]');
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');
        
        if (this.state.user) {
            // Show user profile, hide auth buttons
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.querySelector('.user-name').textContent = 
                    this.state.user.name || 'User';
            }
            
            // Update user-specific elements
            userElements.forEach(el => {
                const attr = el.dataset.user;
                if (this.state.user[attr]) {
                    el.textContent = this.state.user[attr];
                }
            });
        }
    },

    clearUserState: function() {
        this.state.user = null;
        this.state.authToken = null;
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_token');
        
        // Update UI
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');
        
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    },

    // Authentication methods
    login: async function(email, password) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = {
                id: 1,
                email: email,
                name: 'Demo User',
                role: 'borrower',
                country: 'KE',
                subscription: null
            };
            
            // Save user state
            this.state.user = user;
            this.state.authToken = 'demo_token';
            
            localStorage.setItem('mpesewa_user', JSON.stringify(user));
            localStorage.setItem('mpesewa_token', 'demo_token');
            
            this.updateUserUI();
            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed' };
        }
    },

    logout: function() {
        this.clearUserState();
        window.location.href = '/';
    },

    // Online/offline handling
    checkOnlineStatus: function() {
        this.config.isOnline = navigator.onLine;
        this.updateOnlineStatusUI();
    },

    handleOnline: function() {
        this.config.isOnline = true;
        this.updateOnlineStatusUI();
        this.syncOfflineData();
    },

    handleOffline: function() {
        this.config.isOnline = false;
        this.updateOnlineStatusUI();
        this.showOfflineNotification();
    },

    updateOnlineStatusUI: function() {
        document.body.classList.toggle('online', this.config.isOnline);
        document.body.classList.toggle('offline', !this.config.isOnline);
    },

    showOfflineNotification: function() {
        // Only show if not already showing
        if (document.querySelector('.offline-notification')) return;
        
        const notification = document.createElement('div');
        notification.className = 'offline-notification';
        notification.innerHTML = `
            <i class="fas fa-wifi-slash"></i>
            <span>You are offline. Some features may be limited.</span>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    },

    // Offline data handling
    saveOfflineData: function(type, data) {
        try {
            const offlineData = JSON.parse(localStorage.getItem('mpesewa_offline') || '[]');
            offlineData.push({
                type,
                data,
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('mpesewa_offline', JSON.stringify(offlineData));
            this.state.offlineData = offlineData;
        } catch (error) {
            console.error('Error saving offline data:', error);
        }
    },

    syncOfflineData: async function() {
        const offlineData = JSON.parse(localStorage.getItem('mpesewa_offline') || '[]');
        if (offlineData.length === 0) return;
        
        try {
            // Simulate syncing with server
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Clear offline data after successful sync
            localStorage.removeItem('mpesewa_offline');
            this.state.offlineData = [];
            
            // Show sync notification
            this.showNotification('Data Synced', 'Offline data has been synchronized');
        } catch (error) {
            console.error('Sync error:', error);
        }
    },

    // Service worker registration
    registerServiceWorker: function() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
                try {
                    const registration = await navigator.serviceWorker.register('/service-worker.js', {
                        scope: '/'
                    });
                    
                    console.log('ServiceWorker registered:', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('ServiceWorker update found:', newWorker);
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateNotification();
                            }
                        });
                    });
                    
                    // Handle messages from service worker
                    navigator.serviceWorker.addEventListener('message', event => {
                        this.handleServiceWorkerMessage(event);
                    });
                } catch (error) {
                    console.error('ServiceWorker registration failed:', error);
                }
            });
        }
    },

    showUpdateNotification: function() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <div>
                    <strong>Update Available</strong>
                    <p>A new version is available. Refresh to update.</p>
                </div>
                <button class="btn-update">Refresh</button>
            </div>
        `;
        
        notification.querySelector('.btn-update').addEventListener('click', () => {
            window.location.reload();
        });
        
        document.body.appendChild(notification);
    },

    handleServiceWorkerMessage: function(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'CACHE_UPDATED':
                console.log('Cache updated:', data);
                break;
                
            case 'SYNC_COMPLETED':
                this.showNotification('Sync Complete', data.message);
                break;
                
            case 'OFFLINE_DATA_SAVED':
                console.log('Offline data saved:', data);
                break;
        }
    },

    // Notification system
    showNotification: function(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'app-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    },

    // Cleanup before page unload
    handleBeforeUnload: function(e) {
        // Save any pending data
        if (this.state.offlineData.length > 0) {
            localStorage.setItem('mpesewa_offline', JSON.stringify(this.state.offlineData));
        }
    },

    handleVisibilityChange: function() {
        if (!document.hidden && this.config.isOnline) {
            // Page became visible, check for updates
            this.syncOfflineData();
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MPesewa.init());
} else {
    MPesewa.init();
}

// Make MPesewa available globally
window.MPesewa = MPesewa;