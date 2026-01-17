// assets/js/app.js - Main application logic for M-Pesewa PWA

// M-Pesewa Application State
const MPesewaApp = {
    // Current user state
    currentUser: null,
    currentRole: null,
    currentCountry: null,
    currentGroup: null,
    
    // Application state
    isOnline: navigator.onLine,
    isInstalled: false,
    isLoggedIn: false,
    
    // Demo data storage
    demoData: {
        countries: [],
        subscriptions: [],
        categories: [],
        collectors: [],
        groups: [],
        users: [],
        ledgers: []
    },
    
    // Initialize application
    init() {
        console.log('M-Pesewa PWA Initializing...');
        
        // Load demo data
        this.loadDemoData();
        
        // Initialize PWA features
        this.initPWA();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Check authentication state
        this.checkAuthState();
        
        // Check country from URL or localStorage
        this.detectCountry();
        
        // Update online status
        this.updateOnlineStatus();
        
        console.log('M-Pesewa PWA Initialized');
    },
    
    // Load all demo data from JSON files
    async loadDemoData() {
        try {
            const dataFiles = [
                { name: 'countries', url: '../data/countries.json' },
                { name: 'subscriptions', url: '../data/subscriptions.json' },
                { name: 'categories', url: '../data/categories.json' },
                { name: 'collectors', url: '../data/collectors.json' },
                { name: 'demo-groups', url: '../data/demo-groups.json' },
                { name: 'demo-users', url: '../data/demo-users.json' },
                { name: 'demo-ledgers', url: '../data/demo-ledgers.json' }
            ];
            
            for (const file of dataFiles) {
                const response = await fetch(file.url);
                if (response.ok) {
                    this.demoData[file.name] = await response.json();
                    console.log(`Loaded ${file.name}:`, this.demoData[file.name].length || 'data');
                } else {
                    console.warn(`Failed to load ${file.name}, using empty data`);
                    this.demoData[file.name] = [];
                }
            }
            
            // Initialize localStorage with demo data if empty
            this.initLocalStorageData();
            
        } catch (error) {
            console.error('Error loading demo data:', error);
        }
    },
    
    // Initialize localStorage with demo data
    initLocalStorageData() {
        if (!localStorage.getItem('mPesewaUsers')) {
            localStorage.setItem('mPesewaUsers', JSON.stringify(this.demoData['demo-users']));
        }
        
        if (!localStorage.getItem('mPesewaGroups')) {
            localStorage.setItem('mPesewaGroups', JSON.stringify(this.demoData['demo-groups']));
        }
        
        if (!localStorage.getItem('mPesewaLedgers')) {
            localStorage.setItem('mPesewaLedgers', JSON.stringify(this.demoData['demo-ledgers']));
        }
        
        if (!localStorage.getItem('mPesewaBlacklist')) {
            localStorage.setItem('mPesewaBlacklist', JSON.stringify([]));
        }
    },
    
    // Initialize PWA features
    initPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('../service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker registered:', registration.scope);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
        
        // Check if app is installed
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            console.log('M-Pesewa PWA installed');
            this.showToast('M-Pesewa installed successfully!', 'success');
        });
        
        // Before install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button if not already installed
            const installBtn = document.getElementById('installBtn');
            if (installBtn && !this.isInstalled) {
                installBtn.style.display = 'block';
                installBtn.addEventListener('click', () => {
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
    },
    
    // Initialize event listeners
    initEventListeners() {
        // Navigation mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }
        
        // Emergency card clicks
        document.querySelectorAll('.emergency-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = card.getAttribute('data-category');
                this.handleEmergencyCardClick(category, card);
            });
        });
        
        // Registration modal
        const registerBtn = document.getElementById('registerBtn');
        const heroRegisterBtn = document.getElementById('heroRegisterBtn');
        const registrationModal = document.getElementById('registrationModal');
        const modalCloseBtns = document.querySelectorAll('.modal-close');
        
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.showModal('registrationModal'));
        }
        
        if (heroRegisterBtn) {
            heroRegisterBtn.addEventListener('click', () => this.showModal('registrationModal'));
        }
        
        // Modal close buttons
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal(btn.closest('.modal'));
            });
        });
        
        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Registration tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchRegistrationTab(tab);
            });
        });
        
        // Registration forms
        const borrowerForm = document.getElementById('borrowerForm');
        const lenderForm = document.getElementById('lenderForm');
        
        if (borrowerForm) {
            borrowerForm.addEventListener('submit', (e) => this.handleBorrowerRegistration(e));
        }
        
        if (lenderForm) {
            lenderForm.addEventListener('submit', (e) => this.handleLenderRegistration(e));
        }
        
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Switch to registration from login
        const switchToRegister = document.getElementById('switchToRegister');
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal(document.getElementById('loginModal'));
                this.showModal('registrationModal');
            });
        }
        
        // Country selector
        const countrySelect = document.getElementById('countrySelect');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => {
                this.handleCountrySelect(e.target.value);
            });
        }
        
        // Online/offline detection
        window.addEventListener('online', () => this.updateOnlineStatus());
        window.addEventListener('offline', () => this.updateOnlineStatus());
        
        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    },
    
    // Check authentication state
    checkAuthState() {
        const userData = localStorage.getItem('mPesewaCurrentUser');
        const token = localStorage.getItem('mPesewaToken');
        
        if (userData && token) {
            try {
                this.currentUser = JSON.parse(userData);
                this.currentRole = localStorage.getItem('mPesewaCurrentRole');
                this.currentCountry = localStorage.getItem('mPesewaCurrentCountry');
                this.isLoggedIn = true;
                
                this.updateUIForAuthState();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.clearAuthData();
            }
        }
    },
    
    // Update UI based on authentication state
    updateUIForAuthState() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const navActions = document.querySelector('.nav-actions');
        
        if (this.isLoggedIn && this.currentUser) {
            // Update to show user is logged in
            if (loginBtn) loginBtn.textContent = 'Dashboard';
            if (registerBtn) registerBtn.textContent = 'Logout';
            
            // Update event listeners for logout
            if (registerBtn) {
                registerBtn.removeEventListener('click', () => this.showModal('registrationModal'));
                registerBtn.addEventListener('click', () => this.handleLogout());
            }
            
            // Show dashboard link
            if (loginBtn) {
                loginBtn.href = this.getDashboardUrl();
                loginBtn.onclick = null; // Remove modal handler
            }
            
        } else {
            // Reset to default state
            if (loginBtn) {
                loginBtn.textContent = 'Log In';
                loginBtn.href = '#';
                loginBtn.onclick = () => this.showModal('loginModal');
            }
            
            if (registerBtn) {
                registerBtn.textContent = 'Get Started';
                registerBtn.onclick = () => this.showModal('registrationModal');
            }
        }
    },
    
    // Get dashboard URL based on role
    getDashboardUrl() {
        if (!this.currentRole) return '#';
        
        switch (this.currentRole) {
            case 'borrower':
                return 'pages/dashboard/borrower-dashboard.html';
            case 'lender':
                return 'pages/dashboard/lender-dashboard.html';
            case 'admin':
                return 'pages/dashboard/admin-dashboard.html';
            default:
                return '#';
        }
    },
    
    // Detect country from URL or localStorage
    detectCountry() {
        // Try to get country from URL path
        const path = window.location.pathname;
        const countryMatch = path.match(/\/countries\/(\w+)\.html/);
        
        if (countryMatch) {
            this.currentCountry = countryMatch[1];
            localStorage.setItem('mPesewaCurrentCountry', this.currentCountry);
            this.updateCountryUI();
            return;
        }
        
        // Try to get from localStorage
        const savedCountry = localStorage.getItem('mPesewaCurrentCountry');
        if (savedCountry) {
            this.currentCountry = savedCountry;
            this.updateCountryUI();
        }
    },
    
    // Update UI for selected country
    updateCountryUI() {
        // Update country selector if exists
        const countrySelect = document.getElementById('countrySelect');
        const borrowerCountry = document.getElementById('borrowerCountry');
        const lenderCountry = document.getElementById('lenderCountry');
        
        if (countrySelect && this.currentCountry) {
            countrySelect.value = this.currentCountry;
        }
        
        if (borrowerCountry && this.currentCountry) {
            borrowerCountry.value = this.currentCountry;
        }
        
        if (lenderCountry && this.currentCountry) {
            lenderCountry.value = this.currentCountry;
        }
        
        // Update page title or indicators if needed
        if (this.currentCountry) {
            const countryData = this.demoData.countries.find(c => c.code === this.currentCountry);
            if (countryData) {
                document.title = `M-Pesewa ${countryData.name} - ${document.title}`;
            }
        }
    },
    
    // Handle emergency card click
    handleEmergencyCardClick(category, card) {
        console.log('Emergency category selected:', category);
        
        // Store selected category for registration
        sessionStorage.setItem('selectedCategory', category);
        
        // Visual feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
        
        // Show registration modal
        this.showModal('registrationModal');
        
        // Switch to borrower tab and pre-select category
        setTimeout(() => {
            this.switchRegistrationTab('borrower');
            
            // Could pre-fill category in form if needed
            const categorySelect = document.getElementById('loanCategory');
            if (categorySelect) {
                categorySelect.value = category;
            }
        }, 100);
    },
    
    // Handle country selection
    handleCountrySelect(countryCode) {
        if (!countryCode) return;
        
        this.currentCountry = countryCode;
        localStorage.setItem('mPesewaCurrentCountry', countryCode);
        
        // Update forms with selected country
        const borrowerCountry = document.getElementById('borrowerCountry');
        const lenderCountry = document.getElementById('lenderCountry');
        
        if (borrowerCountry) borrowerCountry.value = countryCode;
        if (lenderCountry) lenderCountry.value = countryCode;
        
        this.showToast(`Country set to ${this.getCountryName(countryCode)}`, 'info');
    },
    
    // Get country name from code
    getCountryName(countryCode) {
        const country = this.demoData.countries.find(c => c.code === countryCode);
        return country ? country.name : countryCode;
    },
    
    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },
    
    // Close modal
    closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    },
    
    // Switch registration tab
    switchRegistrationTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tab}Tab`);
        });
    },
    
    // Handle borrower registration
    handleBorrowerRegistration(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Basic validation
        const requiredFields = ['borrowerCountry', 'borrowerName', 'borrowerPhone', 'borrowerNationalId', 'guarantor1', 'guarantor2'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                isValid = false;
                this.showFieldError(field, 'This field is required');
            } else {
                this.clearFieldError(field);
            }
        });
        
        if (!isValid) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }
        
        // Create user object
        const user = {
            id: 'user_' + Date.now(),
            role: 'borrower',
            country: formData.get('borrowerCountry'),
            name: formData.get('borrowerName'),
            phone: formData.get('borrowerPhone'),
            email: formData.get('borrowerEmail') || '',
            nationalId: formData.get('borrowerNationalId'),
            guarantors: [
                formData.get('guarantor1'),
                formData.get('guarantor2')
            ],
            rating: 5, // Default rating
            groups: [],
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        // Save user
        this.saveUser(user);
        
        // Set as current user
        this.currentUser = user;
        this.currentRole = 'borrower';
        this.isLoggedIn = true;
        
        // Save auth data
        this.saveAuthData();
        
        // Close modal
        this.closeModal(document.getElementById('registrationModal'));
        
        // Show success message
        this.showToast('Borrower registration successful!', 'success');
        
        // Redirect to borrower dashboard after delay
        setTimeout(() => {
            window.location.href = 'pages/dashboard/borrower-dashboard.html';
        }, 1500);
    },
    
    // Handle lender registration
    handleLenderRegistration(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Basic validation
        const requiredFields = ['lenderCountry', 'lenderName', 'lenderPhone', 'subscriptionTier'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                isValid = false;
                this.showFieldError(field, 'This field is required');
            } else {
                this.clearFieldError(field);
            }
        });
        
        if (!isValid) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }
        
        // Create user object
        const user = {
            id: 'user_' + Date.now(),
            role: 'lender',
            country: formData.get('lenderCountry'),
            name: formData.get('lenderName'),
            phone: formData.get('lenderPhone'),
            email: formData.get('lenderEmail') || '',
            subscriptionTier: formData.get('subscriptionTier'),
            subscriptionStatus: 'pending', // Needs payment
            rating: 5, // Default rating
            groups: [],
            ledgers: [],
            createdAt: new Date().toISOString(),
            isActive: false // Inactive until payment
        };
        
        // Save user
        this.saveUser(user);
        
        // Set as current user (but not fully active)
        this.currentUser = user;
        this.currentRole = 'lender';
        this.isLoggedIn = true;
        
        // Save auth data
        this.saveAuthData();
        
        // Close modal
        this.closeModal(document.getElementById('registrationModal'));
        
        // Show payment redirect message
        this.showToast('Lender registration submitted. Redirecting to payment...', 'info');
        
        // Simulate payment redirect
        setTimeout(() => {
            // In a real app, this would redirect to payment gateway
            // For demo, we'll simulate successful payment
            user.subscriptionStatus = 'active';
            user.isActive = true;
            user.subscriptionExpiry = this.calculateSubscriptionExpiry();
            
            // Update user in storage
            this.saveUser(user);
            
            this.showToast('Payment successful! Lender account activated.', 'success');
            
            // Redirect to lender dashboard
            setTimeout(() => {
                window.location.href = 'pages/dashboard/lender-dashboard.html';
            }, 2000);
        }, 2000);
    },
    
    // Calculate subscription expiry (28th of next month)
    calculateSubscriptionExpiry() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1; // Next month
        
        if (month === 12) {
            month = 1;
            year++;
        } else {
            month++;
        }
        
        // Always expire on 28th
        return new Date(year, month - 1, 28).toISOString();
    },
    
    // Handle login
    handleLogin(e) {
        e.preventDefault();
        
        const phone = document.getElementById('loginPhone').value;
        const password = document.getElementById('loginPassword').value;
        
        // Demo validation - in real app, this would be server-side
        if (!phone || !password) {
            this.showToast('Please enter phone and password', 'error');
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
        
        // Find user (demo: any user with matching phone)
        const user = users.find(u => u.phone === phone);
        
        if (user) {
            // Demo: accept any password
            this.currentUser = user;
            this.currentRole = user.role;
            this.isLoggedIn = true;
            
            // Save auth data
            this.saveAuthData();
            
            // Close modal
            this.closeModal(document.getElementById('loginModal'));
            
            // Show success
            this.showToast(`Welcome back, ${user.name}!`, 'success');
            
            // Update UI
            this.updateUIForAuthState();
            
            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = this.getDashboardUrl();
            }, 1000);
            
        } else {
            this.showToast('Invalid phone number or password', 'error');
        }
    },
    
    // Handle logout
    handleLogout() {
        if (confirm('Are you sure you want to log out?')) {
            this.clearAuthData();
            this.currentUser = null;
            this.currentRole = null;
            this.isLoggedIn = false;
            
            this.updateUIForAuthState();
            this.showToast('Logged out successfully', 'info');
            
            // Redirect to home page if not already there
            if (!window.location.pathname.includes('index.html') && 
                window.location.pathname !== '/') {
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 500);
            }
        }
    },
    
    // Save user to localStorage
    saveUser(user) {
        const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
        
        // Check if user already exists
        const existingIndex = users.findIndex(u => u.id === user.id || u.phone === user.phone);
        
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem('mPesewaUsers', JSON.stringify(users));
    },
    
    // Save authentication data
    saveAuthData() {
        if (this.currentUser) {
            localStorage.setItem('mPesewaCurrentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('mPesewaCurrentRole', this.currentRole);
            localStorage.setItem('mPesewaToken', 'demo_token_' + Date.now());
            
            if (this.currentCountry) {
                localStorage.setItem('mPesewaCurrentCountry', this.currentCountry);
            }
        }
    },
    
    // Clear authentication data
    clearAuthData() {
        localStorage.removeItem('mPesewaCurrentUser');
        localStorage.removeItem('mPesewaCurrentRole');
        localStorage.removeItem('mPesewaToken');
        // Keep country selection
    },
    
    // Update online status
    updateOnlineStatus() {
        this.isOnline = navigator.onLine;
        
        // Show/hide offline indicator
        const offlineIndicator = document.getElementById('offlineIndicator');
        if (!offlineIndicator && !this.isOnline) {
            // Create offline indicator
            const indicator = document.createElement('div');
            indicator.id = 'offlineIndicator';
            indicator.className = 'offline-indicator';
            indicator.innerHTML = `
                <div class="offline-content">
                    <span>⚠️ You are offline. Some features may be limited.</span>
                </div>
            `;
            document.body.appendChild(indicator);
        } else if (offlineIndicator && this.isOnline) {
            offlineIndicator.remove();
        }
    },
    
    // Show field error
    showFieldError(field, message) {
        if (!field) return;
        
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.form-error-message');
        if (existingError) existingError.remove();
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.innerHTML = `⚠️ ${message}`;
        field.parentNode.appendChild(errorDiv);
    },
    
    // Clear field error
    clearFieldError(field) {
        if (!field) return;
        
        field.classList.remove('error');
        
        const errorDiv = field.parentNode.querySelector('.form-error-message');
        if (errorDiv) errorDiv.remove();
    },
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Add close event
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (toast.parentNode) toast.remove();
                }, 300);
            }
        }, 5000);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
    },
    
    // Get current user's groups
    getUserGroups() {
        if (!this.currentUser) return [];
        
        const allGroups = JSON.parse(localStorage.getItem('mPesewaGroups') || '[]');
        return allGroups.filter(group => 
            group.members?.some(member => member.id === this.currentUser.id)
        );
    },
    
    // Get user's active loans (for borrowers)
    getUserLoans() {
        if (!this.currentUser || this.currentRole !== 'borrower') return [];
        
        const allLedgers = JSON.parse(localStorage.getItem('mPesewaLedgers') || '[]');
        return allLedgers.filter(ledger => 
            ledger.borrowerId === this.currentUser.id && 
            ledger.status === 'active'
        );
    },
    
    // Get lender's active ledgers
    getLenderLedgers() {
        if (!this.currentUser || this.currentRole !== 'lender') return [];
        
        const allLedgers = JSON.parse(localStorage.getItem('mPesewaLedgers') || '[]');
        return allLedgers.filter(ledger => 
            ledger.lenderId === this.currentUser.id && 
            ledger.status === 'active'
        );
    },
    
    // Format currency based on country
    formatCurrency(amount, countryCode = null) {
        const code = countryCode || this.currentCountry || 'ke';
        const country = this.demoData.countries.find(c => c.code === code);
        
        if (!country) {
            return `KES ${amount.toLocaleString()}`;
        }
        
        return `${country.currencySymbol} ${amount.toLocaleString()}`;
    },
    
    // Calculate loan details
    calculateLoanDetails(amount, days = 7) {
        const interestRate = 0.10; // 10%
        const penaltyRate = 0.05; // 5% daily after 7 days
        
        const interest = amount * interestRate;
        const total = amount + interest;
        const dailyRepayment = total / days;
        
        return {
            amount,
            interest,
            total,
            dailyRepayment,
            penaltyRate,
            repaymentPeriod: days
        };
    },
    
    // Check if user is blacklisted
    isUserBlacklisted(userId) {
        const blacklist = JSON.parse(localStorage.getItem('mPesewaBlacklist') || '[]');
        return blacklist.some(entry => entry.userId === userId);
    },
    
    // Get country flag emoji
    getCountryFlag(countryCode) {
        const flagMap = {
            'ke': '🇰🇪',
            'ug': '🇺🇬',
            'tz': '🇹🇿',
            'rw': '🇷🇼',
            'bi': '🇧🇮',
            'so': '🇸🇴',
            'ss': '🇸🇸',
            'et': '🇪🇹',
            'cd': '🇨🇩',
            'ng': '🇳🇬',
            'za': '🇿🇦',
            'gh': '🇬🇭'
        };
        
        return flagMap[countryCode] || '🇺🇳';
    },
    
    // Validate phone number format
    validatePhone(phone, countryCode) {
        // Simple validation - in real app, use proper validation library
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
        return phoneRegex.test(phone);
    },
    
    // Check subscription status
    checkSubscriptionStatus(lenderId) {
        const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
        const lender = users.find(u => u.id === lenderId && u.role === 'lender');
        
        if (!lender) return 'inactive';
        
        if (lender.subscriptionStatus !== 'active') {
            return 'inactive';
        }
        
        // Check expiry
        if (lender.subscriptionExpiry) {
            const expiry = new Date(lender.subscriptionExpiry);
            const now = new Date();
            
            if (now > expiry) {
                return 'expired';
            }
            
            // Check if within 7 days of expiry (warning)
            const daysToExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
            if (daysToExpiry <= 7) {
                return 'expiring_soon';
            }
        }
        
        return 'active';
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    MPesewaApp.init();
});

// Make app available globally
window.MPesewaApp = MPesewaApp;

// Helper functions available globally
window.formatCurrency = (amount, countryCode) => MPesewaApp.formatCurrency(amount, countryCode);
window.getCountryFlag = (countryCode) => MPesewaApp.getCountryFlag(countryCode);
window.showToast = (message, type) => MPesewaApp.showToast(message, type);