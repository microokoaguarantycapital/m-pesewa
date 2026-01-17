// M-PESEWA - App.js
// Main application bootstrap, routing, and core functionality

class MpesewaApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.currentCountry = null;
        this.currentGroup = null;
        this.isOnline = true;
        this.installPrompt = null;
        
        // Initialize the app
        this.init();
    }

    // ======================
    // INITIALIZATION
    // ======================

    async init() {
        console.log('M-Pesewa PWA Initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Initialize core modules
        this.initServiceWorker();
        this.initAuth();
        this.initNavigation();
        this.initModals();
        this.initForms();
        this.initPWA();
        this.initEventListeners();
        this.initPageSpecific();

        // Load initial data
        await this.loadInitialData();

        // Update UI based on auth state
        this.updateAuthUI();

        console.log('M-Pesewa PWA Initialized');
    }

    // ======================
    // SERVICE WORKER
    // ======================

    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/m-pesewa/service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered:', registration.scope);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    this.showUpdateNotification();
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                    });
            });

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'CACHE_UPDATED') {
                    this.showToast('App updated! Refresh for latest version.', 'info');
                }
            });
        }
    }

    showUpdateNotification() {
        const toast = this.createToast({
            title: 'Update Available',
            message: 'A new version of M-Pesewa is available.',
            type: 'info',
            actions: [
                {
                    label: 'Refresh',
                    action: () => window.location.reload()
                }
            ]
        });
        toast.show();
    }

    // ======================
    // AUTHENTICATION
    // ======================

    initAuth() {
        // Load user from localStorage
        const userData = localStorage.getItem('mpesewa_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.currentRole = localStorage.getItem('mpesewa_role');
                this.currentCountry = localStorage.getItem('mpesewa_country');
                this.currentGroup = localStorage.getItem('mpesewa_group');
            } catch (e) {
                console.error('Failed to parse user data:', e);
                this.clearAuth();
            }
        }
    }

    async login(credentials) {
        // Simulate login with demo data
        const { username, password, country } = credentials;
        
        // Validate credentials
        if (!username || !password || !country) {
            throw new Error('Please fill in all required fields');
        }

        // Load demo users
        try {
            const response = await fetch('/m-pesewa/data/demo-users.json');
            const users = await response.json();
            
            // Find user (simplified for demo)
            const user = users.find(u => 
                (u.username === username || u.email === username) && 
                u.country === country
            );

            if (!user) {
                throw new Error('Invalid credentials or country');
            }

            // In real app, we would verify password here
            // For demo, we just check if password is not empty
            if (!password) {
                throw new Error('Invalid password');
            }

            // Set user session
            this.currentUser = user;
            this.currentRole = user.role;
            this.currentCountry = user.country;
            
            // Save to localStorage
            localStorage.setItem('mpesewa_user', JSON.stringify(user));
            localStorage.setItem('mpesewa_role', user.role);
            localStorage.setItem('mpesewa_country', user.country);
            localStorage.setItem('mpesewa_group', user.groupId || '');

            // Update UI
            this.updateAuthUI();

            // Show success message
            this.showToast(`Welcome back, ${user.name}!`, 'success');

            // Redirect based on role
            this.redirectToDashboard();

            return user;

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData) {
        // Validate required fields
        const required = ['fullName', 'phone', 'country', 'role'];
        const missing = required.filter(field => !userData[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        // Check if lender has selected subscription
        if (userData.role === 'lender' && !userData.subscriptionTier) {
            throw new Error('Lenders must select a subscription tier');
        }

        // Create user object
        const user = {
            id: `user_${Date.now()}`,
            ...userData,
            createdAt: new Date().toISOString(),
            status: 'active',
            rating: 5,
            groups: [],
            isVerified: false
        };

        // For lenders, add subscription info
        if (user.role === 'lender') {
            user.subscription = {
                tier: userData.subscriptionTier,
                startDate: new Date().toISOString(),
                expiryDate: this.calculateExpiryDate(),
                status: 'pending' // Requires payment
            };
        }

        // In a real app, this would be sent to a backend
        // For demo, we'll save to localStorage
        this.currentUser = user;
        this.currentRole = user.role;
        this.currentCountry = user.country;

        // Save to localStorage
        localStorage.setItem('mpesewa_user', JSON.stringify(user));
        localStorage.setItem('mpesewa_role', user.role);
        localStorage.setItem('mpesewa_country', user.country);

        // Update UI
        this.updateAuthUI();

        // Show success message
        this.showToast(`Account created successfully! Welcome to M-Pesewa.`, 'success');

        // Redirect to payment for lenders, dashboard for borrowers
        if (user.role === 'lender') {
            this.showModal('subscription-payment');
        } else {
            this.redirectToDashboard();
        }

        return user;
    }

    logout() {
        this.clearAuth();
        this.updateAuthUI();
        this.showToast('You have been logged out.', 'info');
        
        // Redirect to home
        window.location.href = '/m-pesewa/';
    }

    clearAuth() {
        this.currentUser = null;
        this.currentRole = null;
        this.currentCountry = null;
        this.currentGroup = null;
        
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_role');
        localStorage.removeItem('mpesewa_country');
        localStorage.removeItem('mpesewa_group');
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');
        
        if (this.currentUser) {
            // Update buttons to show user is logged in
            if (loginBtn) loginBtn.textContent = 'Dashboard';
            if (signupBtn) signupBtn.textContent = 'Logout';
            
            // Update user menu if exists
            if (userMenu && userName) {
                userMenu.style.display = 'block';
                userName.textContent = this.currentUser.name.split(' ')[0];
            }
            
            // Update role-specific UI
            this.updateRoleUI();
        } else {
            // Reset to default
            if (loginBtn) loginBtn.textContent = 'Sign In';
            if (signupBtn) signupBtn.textContent = 'Get Started';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    updateRoleUI() {
        // Hide/show role-specific elements
        const borrowerElements = document.querySelectorAll('.borrower-only');
        const lenderElements = document.querySelectorAll('.lender-only');
        
        if (this.currentRole === 'borrower') {
            borrowerElements.forEach(el => el.style.display = 'block');
            lenderElements.forEach(el => el.style.display = 'none');
        } else if (this.currentRole === 'lender') {
            borrowerElements.forEach(el => el.style.display = 'none');
            lenderElements.forEach(el => el.style.display = 'block');
        }
    }

    redirectToDashboard() {
        if (!this.currentUser) return;
        
        if (this.currentRole === 'borrower') {
            window.location.href = '/m-pesewa/pages/dashboard/borrower-dashboard.html';
        } else if (this.currentRole === 'lender') {
            window.location.href = '/m-pesewa/pages/dashboard/lender-dashboard.html';
        }
    }

    // ======================
    // NAVIGATION
    // ======================

    initNavigation() {
        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu || !navToggle) return;
            
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.main-nav');
            if (window.scrollY > 50) {
                nav?.classList.add('scrolled');
            } else {
                nav?.classList.remove('scrolled');
            }
        });

        // Country dropdown
        const countryDropdowns = document.querySelectorAll('.nav-dropdown');
        countryDropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            countryDropdowns.forEach(dropdown => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                }
            });
        });
    }

    // ======================
    // MODALS
    // ======================

    initModals() {
        // Modal open/close functionality
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.showModal(modalId);
            });
        });

        // Close modal buttons
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal(btn.closest('.modal'));
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    this.closeModal(modal);
                });
            }
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(`${modalId}-modal`);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            
            // Focus first input if exists
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }

    // ======================
    // FORMS
    // ======================

    initForms() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    username: document.getElementById('login-username').value,
                    password: document.getElementById('login-password').value,
                    country: document.getElementById('login-country').value
                };

                try {
                    await this.login(formData);
                } catch (error) {
                    this.showFormError(loginForm, error.message);
                }
            });
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            // Show/hide subscription tier based on role
            const roleRadios = signupForm.querySelectorAll('input[name="role"]');
            const subscriptionGroup = document.getElementById('subscription-tier-group');
            
            roleRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.value === 'lender') {
                        subscriptionGroup.style.display = 'block';
                    } else {
                        subscriptionGroup.style.display = 'none';
                    }
                });
            });

            // Form submission
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    fullName: document.getElementById('signup-fullname')?.value,
                    phone: document.getElementById('signup-phone')?.value,
                    email: document.getElementById('signup-email')?.value,
                    country: document.getElementById('signup-country').value,
                    role: signupForm.querySelector('input[name="role"]:checked').value,
                    subscriptionTier: document.getElementById('subscription-tier')?.value
                };

                try {
                    await this.register(formData);
                } catch (error) {
                    this.showFormError(signupForm, error.message);
                }
            });
        }

        // Modal switching
        const switchToSignup = document.getElementById('switch-to-signup');
        const switchToLogin = document.getElementById('switch-to-login');
        
        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal(document.getElementById('login-modal'));
                this.showModal('signup');
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal(document.getElementById('signup-modal'));
                this.showModal('login');
            });
        }

        // Form validation
        this.initFormValidation();
    }

    initFormValidation() {
        // Add validation to all forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });

            // Real-time validation
            form.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('is-invalid')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        const feedback = field.nextElementSibling;
        
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            if (!isValid) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                feedback.style.display = 'block';
                feedback.textContent = field.validationMessage;
            } else {
                field.classList.add('is-valid');
                field.classList.remove('is-invalid');
                feedback.style.display = 'none';
            }
        }
    }

    showFormError(form, message) {
        // Remove existing error messages
        form.querySelectorAll('.form-error').forEach(el => el.remove());
        
        // Create error element
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.innerHTML = `
            <div class="form-error-title">Error</div>
            <div class="form-error-message">${message}</div>
        `;
        
        // Insert at top of form
        form.insertBefore(errorEl, form.firstChild);
        
        // Scroll to error
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // ======================
    // PWA FUNCTIONALITY
    // ======================

    initPWA() {
        // Install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            
            // Show install button
            const installBtn = document.getElementById('install-btn');
            if (installBtn) {
                installBtn.style.display = 'flex';
                installBtn.addEventListener('click', () => this.installApp());
            }
        });

        // Check if app is already installed
        window.addEventListener('appinstalled', () => {
            console.log('M-Pesewa installed successfully');
            this.installPrompt = null;
            
            // Hide install button
            const installBtn = document.getElementById('install-btn');
            if (installBtn) installBtn.style.display = 'none';
            
            this.showToast('M-Pesewa installed successfully!', 'success');
        });

        // Online/offline detection
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.hideOfflineIndicator();
            this.showToast('You are back online.', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineIndicator();
            this.showToast('You are offline. Some features may not work.', 'warning');
        });

        // Initial online status
        this.isOnline = navigator.onLine;
        if (!this.isOnline) {
            this.showOfflineIndicator();
        }
    }

    async installApp() {
        if (!this.installPrompt) return;
        
        this.installPrompt.prompt();
        const { outcome } = await this.installPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted install prompt');
        } else {
            console.log('User dismissed install prompt');
        }
        
        this.installPrompt = null;
    }

    showOfflineIndicator() {
        let indicator = document.getElementById('offline-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.className = 'offline-indicator';
            indicator.textContent = 'Offline';
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'block';
    }

    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // ======================
    // DATA LOADING
    // ======================

    async loadInitialData() {
        try {
            // Load countries data
            const countriesResponse = await fetch('/m-pesewa/data/countries.json');
            this.countries = await countriesResponse.json();
            
            // Load categories data
            const categoriesResponse = await fetch('/m-pesewa/data/categories.json');
            this.categories = await categoriesResponse.json();
            
            // Update UI with loaded data
            this.updateCountriesDropdown();
            this.updateCategoriesUI();
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }

    updateCountriesDropdown() {
        const countrySelects = document.querySelectorAll('select[id*="country"], select[name*="country"]');
        
        countrySelects.forEach(select => {
            // Clear existing options except the first one
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Add country options
            if (this.countries) {
                this.countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.code;
                    option.textContent = `${country.name} (${country.currency})`;
                    select.appendChild(option);
                });
            }
        });
    }

    updateCategoriesUI() {
        // Update category cards if they exist
        const categoryCards = document.querySelectorAll('.category-card');
        if (categoryCards.length > 0 && this.categories) {
            categoryCards.forEach(card => {
                const categoryId = card.getAttribute('data-category');
                const category = this.categories.find(c => c.id === categoryId);
                if (category) {
                    const icon = card.querySelector('.category-icon');
                    const title = card.querySelector('.category-title');
                    const desc = card.querySelector('.category-description');
                    
                    if (icon) icon.textContent = category.icon;
                    if (title) title.textContent = category.title;
                    if (desc) desc.textContent = category.description;
                }
            });
        }
    }

    // ======================
    // EVENT LISTENERS
    // ======================

    initEventListeners() {
        // Logout button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn' || 
                (e.target.id === 'signup-btn' && this.currentUser)) {
                e.preventDefault();
                this.logout();
            }
        });

        // Dashboard buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'login-btn' && this.currentUser) {
                e.preventDefault();
                this.redirectToDashboard();
            }
        });

        // Start borrowing/lending buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'start-borrowing' || e.target.id === 'start-lending') {
                e.preventDefault();
                
                if (!this.currentUser) {
                    this.showModal('signup');
                    
                    // Pre-select role based on button
                    const role = e.target.id === 'start-borrowing' ? 'borrower' : 'lender';
                    const roleInput = document.querySelector(`input[name="role"][value="${role}"]`);
                    if (roleInput) {
                        roleInput.checked = true;
                        roleInput.dispatchEvent(new Event('change'));
                    }
                } else {
                    this.redirectToDashboard();
                }
            }
        });

        // Category card clicks
        document.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard && !e.target.closest('.category-card').classList.contains('floating-card')) {
                if (!this.currentUser) {
                    this.showModal('signup');
                    
                    // Set borrower role
                    const borrowerRadio = document.querySelector('input[name="role"][value="borrower"]');
                    if (borrowerRadio) {
                        borrowerRadio.checked = true;
                        borrowerRadio.dispatchEvent(new Event('change'));
                    }
                    
                    // Store selected category for later use
                    const category = categoryCard.getAttribute('data-category');
                    localStorage.setItem('selected_category', category);
                } else if (this.currentRole === 'borrower') {
                    // Redirect to borrowing page with category preselected
                    window.location.href = `/m-pesewa/pages/borrowing.html?category=${categoryCard.getAttribute('data-category')}`;
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="search"]');
                if (searchInput) searchInput.focus();
            }
            
            // Esc to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    this.closeModal(modal);
                });
            }
        });
    }

    // ======================
    // PAGE-SPECIFIC
    // ======================

    initPageSpecific() {
        const page = document.body.getAttribute('data-page') || 
                    window.location.pathname.split('/').pop().replace('.html', '');
        
        switch (page) {
            case 'index':
                this.initHomePage();
                break;
            case 'borrowing':
                this.initBorrowingPage();
                break;
            case 'lending':
                this.initLendingPage();
                break;
            case 'dashboard':
                this.initDashboardPage();
                break;
            case 'groups':
                this.initGroupsPage();
                break;
            case 'subscriptions':
                this.initSubscriptionsPage();
                break;
            case 'ledger':
                this.initLedgerPage();
                break;
            case 'blacklist':
                this.initBlacklistPage();
                break;
            case 'debt-collectors':
                this.initCollectorsPage();
                break;
        }
    }

    initHomePage() {
        // Animate stats counters
        this.animateStats();
        
        // Initialize floating cards
        this.initFloatingCards();
        
        // Initialize success stories carousel
        this.initSuccessStories();
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current).toLocaleString() + '+';
            }, 16);
        });
    }

    initFloatingCards() {
        // Already implemented in index.html inline script
        // This is a placeholder for additional floating card functionality
    }

    initSuccessStories() {
        const storiesContainer = document.querySelector('.stories-container');
        if (!storiesContainer) return;
        
        let currentIndex = 0;
        const stories = storiesContainer.querySelectorAll('.story-card');
        const totalStories = stories.length;
        
        if (totalStories > 1) {
            // Auto-rotate stories every 5 seconds
            setInterval(() => {
                currentIndex = (currentIndex + 1) % totalStories;
                this.showStory(currentIndex);
            }, 5000);
            
            // Add navigation dots
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'story-dots';
            
            for (let i = 0; i < totalStories; i++) {
                const dot = document.createElement('button');
                dot.className = `story-dot ${i === 0 ? 'active' : ''}`;
                dot.setAttribute('data-index', i);
                dot.addEventListener('click', () => this.showStory(i));
                dotsContainer.appendChild(dot);
            }
            
            storiesContainer.parentNode.appendChild(dotsContainer);
        }
    }

    showStory(index) {
        const stories = document.querySelectorAll('.story-card');
        const dots = document.querySelectorAll('.story-dot');
        
        stories.forEach((story, i) => {
            story.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // ======================
    // UTILITY FUNCTIONS
    // ======================

    showToast(message, type = 'info', duration = 5000) {
        // Create toast container if it doesn't exist
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${this.getToastIcon(type)}</div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('showing'), 10);
        
        // Auto remove
        const removeToast = () => {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        };
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', removeToast);
        
        // Auto-remove after duration
        setTimeout(removeToast, duration);
        
        return toast;
    }

    getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }

    createToast(options) {
        return {
            show: () => this.showToast(options.message, options.type, options.duration),
            hide: () => {/* Implement hide logic */}
        };
    }

    calculateExpiryDate() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setDate(28); // Expiry on 28th of each month
        return date.toISOString();
    }

    formatCurrency(amount, currency = 'KES') {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // ======================
    // API SIMULATION
    // ======================

    async fetchData(endpoint) {
        try {
            const response = await fetch(`/m-pesewa/data/${endpoint}.json`);
            if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    async getGroups(country) {
        const groups = await this.fetchData('demo-groups');
        return groups.filter(group => group.country === country);
    }

    async getLedgers(userId) {
        const ledgers = await this.fetchData('demo-ledgers');
        return ledgers.filter(ledger => ledger.lenderId === userId || ledger.borrowerId === userId);
    }

    async getCollectors(country) {
        const collectors = await this.fetchData('collectors');
        return collectors.filter(collector => collector.country === country);
    }
}

// Initialize the app
window.mpesewaApp = new MpesewaApp();

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MpesewaApp;
}