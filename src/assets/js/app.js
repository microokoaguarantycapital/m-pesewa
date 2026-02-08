/* M-Pesewa - App Bootstrap */

// Global State
const MPesewa = {
    // User State
    user: null,
    role: null,
    country: null,
    group: null,
    
    // App State
    loading: false,
    offline: false,
    pwaInstalled: false,
    
    // Data Stores
    data: {
        countries: [],
        subscriptions: [],
        categories: [],
        collectors: [],
        groups: [],
        users: [],
        ledgers: []
    },
    
    // Initialize App
    init() {
        console.log('M-Pesewa App Initializing...');
        
        // Load data
        this.loadData();
        
        // Check authentication
        this.checkAuth();
        
        // Initialize components
        this.initComponents();
        
        // Check PWA
        this.checkPWA();
        
        // Check offline status
        this.checkOfflineStatus();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('M-Pesewa App Ready');
    },
    
    // Load demo data
    async loadData() {
        try {
            const promises = [
                this.fetchJSON('data/countries.json'),
                this.fetchJSON('data/subscriptions.json'),
                this.fetchJSON('data/categories.json'),
                this.fetchJSON('data/collectors.json'),
                this.fetchJSON('data/demo-groups.json'),
                this.fetchJSON('data/demo-users.json'),
                this.fetchJSON('data/demo-ledgers.json')
            ];
            
            const [
                countries,
                subscriptions,
                categories,
                collectors,
                groups,
                users,
                ledgers
            ] = await Promise.all(promises);
            
            this.data.countries = countries;
            this.data.subscriptions = subscriptions;
            this.data.categories = categories;
            this.data.collectors = collectors;
            this.data.groups = groups;
            this.data.users = users;
            this.data.ledgers = ledgers;
            
            console.log('Data loaded successfully');
            
            // Dispatch event for other modules
            window.dispatchEvent(new CustomEvent('mpesewa:data-loaded'));
            
        } catch (error) {
            console.error('Failed to load data:', error);
            this.showToast('Failed to load app data. Please refresh.', 'error');
        }
    },
    
    // Fetch JSON helper
    async fetchJSON(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    },
    
    // Check authentication status
    checkAuth() {
        const userData = localStorage.getItem('mpesewa_user');
        const role = localStorage.getItem('mpesewa_role');
        const country = localStorage.getItem('mpesewa_country');
        const group = localStorage.getItem('mpesewa_group');
        
        if (userData && role) {
            this.user = JSON.parse(userData);
            this.role = role;
            this.country = country;
            this.group = group;
            
            // Update UI for logged in state
            this.updateAuthUI();
            
            // Load role-specific data
            this.loadRoleData();
        }
    },
    
    // Update UI based on auth state
    updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
        
        if (this.user) {
            // User is logged in
            if (loginBtn) loginBtn.textContent = 'Dashboard';
            if (mobileLoginBtn) mobileLoginBtn.textContent = 'Dashboard';
            if (registerBtn) registerBtn.style.display = 'none';
            if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'none';
            
            // Show user info in header if element exists
            const userInfoEl = document.getElementById('userInfo');
            if (userInfoEl) {
                userInfoEl.innerHTML = `
                    <div class="user-info">
                        <span>${this.user.name}</span>
                        <span class="badge badge-primary">${this.role}</span>
                    </div>
                `;
            }
        }
    },
    
    // Load role-specific data
    loadRoleData() {
        if (!this.role || !this.user) return;
        
        switch (this.role) {
            case 'borrower':
                // Load borrower-specific data
                this.loadBorrowerData();
                break;
            case 'lender':
                // Load lender-specific data
                this.loadLenderData();
                break;
            case 'admin':
                // Load admin-specific data
                this.loadAdminData();
                break;
        }
    },
    
    // Load borrower data
    loadBorrowerData() {
        // Filter groups for this borrower
        const borrowerGroups = this.data.groups.filter(g => 
            g.members?.some(m => m.userId === this.user.id)
        );
        
        // Filter active loans
        const activeLoans = this.data.ledgers.filter(l => 
            l.borrowerId === this.user.id && l.status === 'active'
        );
        
        // Store in session for quick access
        sessionStorage.setItem('borrower_groups', JSON.stringify(borrowerGroups));
        sessionStorage.setItem('active_loans', JSON.stringify(activeLoans));
    },
    
    // Load lender data
    loadLenderData() {
        // Filter ledgers for this lender
        const lenderLedgers = this.data.ledgers.filter(l => 
            l.lenderId === this.user.id
        );
        
        // Filter active borrowers
        const activeBorrowers = lenderLedgers
            .filter(l => l.status === 'active')
            .map(l => l.borrowerId);
        
        // Store in session
        sessionStorage.setItem('lender_ledgers', JSON.stringify(lenderLedgers));
        sessionStorage.setItem('active_borrowers', JSON.stringify(activeBorrowers));
    },
    
    // Load admin data
    loadAdminData() {
        // Admin gets all data
        sessionStorage.setItem('admin_countries', JSON.stringify(this.data.countries));
        sessionStorage.setItem('admin_groups', JSON.stringify(this.data.groups));
        sessionStorage.setItem('admin_users', JSON.stringify(this.data.users));
        sessionStorage.setItem('admin_ledgers', JSON.stringify(this.data.ledgers));
    },
    
    // Initialize UI components
    initComponents() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeMenuBtn && mobileMenu) {
            closeMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu?.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                e.target !== mobileMenuBtn) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Country selector
        const countrySelect = document.getElementById('countrySelect');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => {
                const country = e.target.value;
                if (country) {
                    this.setCountry(country);
                }
            });
        }
        
        // Login/Register buttons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
        
        const showLoginModal = () => {
            const modal = document.getElementById('loginModal');
            if (modal) modal.style.display = 'flex';
        };
        
        const showRegistration = () => {
            window.location.hash = '#registration';
            document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
        };
        
        if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
        if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', showLoginModal);
        if (registerBtn) registerBtn.addEventListener('click', showRegistration);
        if (mobileRegisterBtn) mobileRegisterBtn.addEventListener('click', showRegistration);
        
        // Close login modal
        const closeLoginModal = document.getElementById('closeLoginModal');
        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', () => {
                document.getElementById('loginModal').style.display = 'none';
            });
        }
        
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Role tabs in registration
        const roleTabs = document.querySelectorAll('.role-tab');
        roleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const role = tab.dataset.role;
                this.switchRegistrationForm(role);
            });
        });
        
        // Tier selection
        const tierCards = document.querySelectorAll('.tier-card');
        tierCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectTier(card);
            });
        });
        
        // Initialize calculator if present
        if (typeof Calculator !== 'undefined') {
            Calculator.init();
        }
        
        // Initialize floating cards animation
        this.initFloatingCards();
        
        // Initialize counters
        this.initCounters();
    },
    
    // Set country
    setCountry(countryCode) {
        this.country = countryCode;
        localStorage.setItem('mpesewa_country', countryCode);
        
        // Update UI
        const countrySelect = document.getElementById('countrySelect');
        if (countrySelect) {
            countrySelect.value = countryCode;
        }
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('mpesewa:country-changed', { 
            detail: { country: countryCode } 
        }));
        
        this.showToast(`Country set to ${this.getCountryName(countryCode)}`, 'success');
    },
    
    // Get country name from code
    getCountryName(code) {
        const country = this.data.countries.find(c => c.code === code);
        return country ? country.name : code;
    },
    
    // Switch registration form based on role
    switchRegistrationForm(role) {
        const forms = document.querySelectorAll('.registration-form');
        const tabs = document.querySelectorAll('.role-tab');
        
        // Update active tab
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.role === role);
        });
        
        // Show corresponding form
        forms.forEach(form => {
            form.classList.toggle('active', form.id === `${role}Form`);
        });
        
        // Update hidden field if exists
        const selectedTier = document.getElementById('selectedTier');
        if (selectedTier && role === 'lender') {
            // Set default tier for lenders
            selectedTier.value = 'premium';
        }
    },
    
    // Select subscription tier
    selectTier(card) {
        const tier = card.dataset.tier;
        const container = card.closest('.tier-options');
        
        // Remove active class from all cards
        container.querySelectorAll('.tier-card').forEach(c => {
            c.classList.remove('active');
        });
        
        // Add active class to selected card
        card.classList.add('active');
        
        // Update hidden field
        const selectedTier = document.getElementById('selectedTier');
        if (selectedTier) {
            selectedTier.value = tier;
        }
        
        // Update calculator if present
        if (typeof Calculator !== 'undefined') {
            Calculator.updateTier(tier);
        }
    },
    
    // Handle login
    async handleLogin() {
        const country = document.getElementById('loginCountry')?.value;
        const phone = document.getElementById('loginPhone')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (!country || !phone || !password) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }
        
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            // For demo, use mock authentication
            const user = this.data.users.find(u => 
                u.phone === phone && u.country === country
            );
            
            if (user) {
                this.loginUser(user);
            } else {
                this.showToast('Invalid credentials', 'error');
            }
            
            this.hideLoading();
        }, 1000);
    },
    
    // Login user
    loginUser(user) {
        this.user = user;
        this.role = user.role;
        this.country = user.country;
        
        // Save to localStorage
        localStorage.setItem('mpesewa_user', JSON.stringify(user));
        localStorage.setItem('mpesewa_role', user.role);
        localStorage.setItem('mpesewa_country', user.country);
        
        // Update UI
        this.updateAuthUI();
        
        // Close login modal
        document.getElementById('loginModal').style.display = 'none';
        
        // Redirect based on role
        this.redirectToDashboard();
        
        this.showToast(`Welcome back, ${user.name}!`, 'success');
    },
    
    // Redirect to appropriate dashboard
    redirectToDashboard() {
        switch (this.role) {
            case 'borrower':
                window.location.href = 'pages/dashboard/borrower-dashboard.html';
                break;
            case 'lender':
                window.location.href = 'pages/dashboard/lender-dashboard.html';
                break;
            case 'admin':
                window.location.href = 'pages/dashboard/admin-dashboard.html';
                break;
            default:
                window.location.href = 'pages/dashboard/';
        }
    },
    
    // Logout
    logout() {
        this.user = null;
        this.role = null;
        this.country = null;
        this.group = null;
        
        // Clear storage
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_role');
        localStorage.removeItem('mpesewa_country');
        localStorage.removeItem('mpesewa_group');
        sessionStorage.clear();
        
        // Update UI
        this.updateAuthUI();
        
        // Redirect to home
        window.location.href = '/';
        
        this.showToast('Logged out successfully', 'success');
    },
    
    // Check PWA capabilities
    checkPWA() {
        // Check if app is installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.pwaInstalled = true;
        }
        
        // Check if beforeinstallprompt is supported
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallBanner();
        });
    },
    
    // Show install banner
    showInstallBanner() {
        const banner = document.getElementById('pwaBanner');
        if (banner && !this.pwaInstalled) {
            banner.style.display = 'flex';
            
            // Install button
            const installBtn = document.getElementById('installApp');
            if (installBtn) {
                installBtn.addEventListener('click', () => {
                    this.installPWA();
                });
            }
            
            // Dismiss button
            const dismissBtn = document.getElementById('dismissBanner');
            if (dismissBtn) {
                dismissBtn.addEventListener('click', () => {
                    banner.style.display = 'none';
                });
            }
        }
    },
    
    // Install PWA
    async installPWA() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            this.pwaInstalled = true;
            this.showToast('App installed successfully!', 'success');
        }
        
        this.deferredPrompt = null;
        document.getElementById('pwaBanner').style.display = 'none';
    },
    
    // Check offline status
    checkOfflineStatus() {
        this.offline = !navigator.onLine;
        
        window.addEventListener('online', () => {
            this.offline = false;
            this.showToast('Back online', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.offline = true;
            this.showToast('You are offline', 'warning');
        });
    },
    
    // Initialize floating cards
    initFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            // Add delay for staggered animation
            card.style.animationDelay = `${index * 0.1}s`;
        });
    },
    
    // Initialize counters
    initCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            // Start when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Global click handler for data attributes
        document.addEventListener('click', (e) => {
            // Handle logout
            if (e.target.matches('[data-action="logout"]')) {
                e.preventDefault();
                this.logout();
            }
            
            // Handle country selection
            if (e.target.matches('[data-country]')) {
                const country = e.target.dataset.country;
                this.setCountry(country);
            }
            
            // Handle role switching
            if (e.target.matches('[data-role]')) {
                const role = e.target.dataset.role;
                this.switchRegistrationForm(role);
            }
        });
        
        // Handle registration form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('#borrowerRegistration')) {
                e.preventDefault();
                this.handleBorrowerRegistration(e.target);
            }
            
            if (e.target.matches('#lenderRegistration')) {
                e.preventDefault();
                this.handleLenderRegistration(e.target);
            }
        });
        
        // Handle emergency category clicks
        document.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard && !window.location.pathname.includes('dashboard')) {
                e.preventDefault();
                const category = categoryCard.querySelector('.category-title')?.textContent;
                this.handleEmergencyCategoryClick(category);
            }
        });
    },
    
    // Handle borrower registration
    async handleBorrowerRegistration(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validation
        if (!data.fullName || !data.phone || !data.country) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }
        
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            // Create user object
            const user = {
                id: 'user_' + Date.now(),
                name: data.fullName,
                phone: data.phone,
                email: data.email || '',
                country: data.country,
                location: data.location,
                nationalId: data.nationalId,
                role: 'borrower',
                createdAt: new Date().toISOString(),
                guarantors: [
                    { name: data.guarantor1Name, phone: data.guarantor1Phone },
                    { name: data.guarantor2Name, phone: data.guarantor2Phone }
                ]
            };
            
            // Save to localStorage for demo
            localStorage.setItem('mpesewa_user', JSON.stringify(user));
            localStorage.setItem('mpesewa_role', 'borrower');
            localStorage.setItem('mpesewa_country', user.country);
            
            this.hideLoading();
            this.showToast('Registration successful!', 'success');
            
            // Redirect to borrower dashboard
            setTimeout(() => {
                window.location.href = 'pages/dashboard/borrower-dashboard.html';
            }, 1000);
            
        }, 1500);
    },
    
    // Handle lender registration
    async handleLenderRegistration(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validation
        if (!data.fullName || !data.phone || !data.country || !data.tier) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }
        
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            // Create user object
            const user = {
                id: 'user_' + Date.now(),
                name: data.fullName,
                phone: data.phone,
                email: data.email || '',
                country: data.country,
                location: data.location,
                nationalId: data.nationalId,
                brandName: data.brandName || '',
                role: 'lender',
                subscription: {
                    tier: data.tier,
                    startDate: new Date().toISOString(),
                    expiryDate: this.calculateExpiryDate(data.tier),
                    status: 'pending_payment'
                },
                categories: data.categories || [],
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage for demo
            localStorage.setItem('mpesewa_user', JSON.stringify(user));
            localStorage.setItem('mpesewa_role', 'lender');
            localStorage.setItem('mpesewa_country', user.country);
            
            this.hideLoading();
            this.showToast('Registration successful! Redirecting to payment...', 'success');
            
            // Simulate payment redirect
            setTimeout(() => {
                // For demo, simulate successful payment
                user.subscription.status = 'active';
                localStorage.setItem('mpesewa_user', JSON.stringify(user));
                
                window.location.href = 'pages/dashboard/lender-dashboard.html';
            }, 2000);
            
        }, 1500);
    },
    
    // Calculate subscription expiry date
    calculateExpiryDate(tier) {
        const now = new Date();
        let expiry = new Date(now);
        
        // For demo, set expiry to next month 28th
        expiry.setMonth(expiry.getMonth() + 1);
        expiry.setDate(28);
        
        return expiry.toISOString();
    },
    
    // Handle emergency category click
    handleEmergencyCategoryClick(category) {
        // Save selected category
        sessionStorage.setItem('selected_category', category);
        
        // Check if user is logged in
        if (this.user) {
            // Redirect to borrower dashboard
            window.location.href = 'pages/dashboard/borrower-dashboard.html';
        } else {
            // Redirect to registration with category pre-selected
            window.location.href = 'index.html#registration';
            this.switchRegistrationForm('borrower');
            
            // Scroll to registration
            setTimeout(() => {
                document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    },
    
    // Show loading overlay
    showLoading(message = 'Loading...') {
        this.loading = true;
        
        // Create or show loading overlay
        let overlay = document.getElementById('loadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="loader"></div>
                    <p>${message}</p>
                </div>
            `;
            document.body.appendChild(overlay);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                .loading-content {
                    text-align: center;
                }
                .loading-content .loader {
                    margin: 0 auto 1rem;
                }
                .loading-content p {
                    color: var(--dark-gray);
                }
            `;
            document.head.appendChild(style);
        } else {
            overlay.style.display = 'flex';
        }
    },
    
    // Hide loading overlay
    hideLoading() {
        this.loading = false;
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
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
        
        // Add styles
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    background: var(--white);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    border-left: 4px solid;
                    animation: slideInLeft 0.3s ease-out;
                }
                .toast-info { border-color: var(--primary-blue); }
                .toast-success { border-color: var(--growth-green); }
                .toast-warning { border-color: var(--warm-orange); }
                .toast-error { border-color: var(--alert-red); }
                .toast-content {
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    min-width: 300px;
                }
                .toast-message {
                    flex: 1;
                    margin-right: 1rem;
                }
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--medium-gray);
                    line-height: 1;
                    padding: 0;
                }
                @keyframes slideInLeft {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        container.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    },
    
    // Utility: Format currency
    formatCurrency(amount, countryCode) {
        const country = this.data.countries.find(c => c.code === countryCode);
        if (!country) return `${amount} ₵`;
        
        const formatter = new Intl.NumberFormat(country.locale, {
            style: 'currency',
            currency: country.currency
        });
        
        return formatter.format(amount);
    },
    
    // Utility: Format date
    formatDate(dateString, format = 'short') {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: format === 'short' ? 'short' : 'long',
            day: 'numeric'
        });
    },
    
    // Utility: Calculate days between dates
    daysBetween(date1, date2) {
        const diff = new Date(date2) - new Date(date1);
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    MPesewa.init();
});

// Make MPesewa available globally
window.MPesewa = MPesewa;