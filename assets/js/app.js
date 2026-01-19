// Main Application JavaScript - M-pesewa

class MpesewaApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.countryData = null;
        this.groupData = null;
        this.init();
    }

    async init() {
        this.loadCurrentUser();
        this.setupEventListeners();
        this.setupServiceWorker();
        this.setupOfflineDetection();
        
        // Load initial data
        await Promise.all([
            this.loadCountries(),
            this.loadCategories(),
            this.loadDemoData()
        ]);
    }

    // User Management
    loadCurrentUser() {
        const userData = localStorage.getItem('mpesewa_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.currentRole = localStorage.getItem('mpesewa_role') || 'borrower';
            this.updateUIForUser();
        }
    }

    saveCurrentUser(user, role = 'borrower') {
        this.currentUser = user;
        this.currentRole = role;
        localStorage.setItem('mpesewa_user', JSON.stringify(user));
        localStorage.setItem('mpesewa_role', role);
        this.updateUIForUser();
    }

    logout() {
        this.currentUser = null;
        this.currentRole = null;
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_role');
        window.location.href = '/';
    }

    updateUIForUser() {
        const authElements = document.querySelectorAll('.auth-element');
        const guestElements = document.querySelectorAll('.guest-element');
        
        if (this.currentUser) {
            authElements.forEach(el => el.style.display = '');
            guestElements.forEach(el => el.style.display = 'none');
            
            // Update user info in navigation
            const userNav = document.querySelector('.user-nav');
            if (userNav) {
                userNav.innerHTML = `
                    <span>${this.currentUser.name}</span>
                    <span class="badge badge-primary">${this.currentRole}</span>
                `;
            }
        } else {
            authElements.forEach(el => el.style.display = 'none');
            guestElements.forEach(el => el.style.display = '');
        }
    }

    // Data Loading
    async loadCountries() {
        try {
            const response = await fetch('/data/countries.json');
            this.countryData = await response.json();
            this.populateCountrySelects();
        } catch (error) {
            console.error('Failed to load countries:', error);
            // Load fallback data
            this.countryData = this.getFallbackCountries();
            this.populateCountrySelects();
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('/data/categories.json');
            this.categoryData = await response.json();
            this.populateCategoryCards();
        } catch (error) {
            console.error('Failed to load categories:', error);
            this.categoryData = this.getFallbackCategories();
            this.populateCategoryCards();
        }
    }

    async loadDemoData() {
        try {
            const [groups, users, ledgers] = await Promise.all([
                fetch('/data/demo-groups.json').then(r => r.json()),
                fetch('/data/demo-users.json').then(r => r.json()),
                fetch('/data/demo-ledgers.json').then(r => r.json())
            ]);
            
            this.demoData = { groups, users, ledgers };
            this.cacheDemoData();
        } catch (error) {
            console.error('Failed to load demo data:', error);
        }
    }

    // Navigation
    setupEventListeners() {
        // Navigation toggle
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                const navMenu = document.getElementById('navMenu');
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Auth modal
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    this.closeAuthModal();
                }
            });
        }

        // Auth tabs
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                this.switchAuthTab(tabId);
            });
        });

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        const lenderForm = document.getElementById('lenderForm');
        if (lenderForm) {
            lenderForm.addEventListener('submit', (e) => this.handleLenderRegister(e));
        }

        // Install banner
        const installButton = document.getElementById('installButton');
        if (installButton) {
            installButton.addEventListener('click', () => this.installPWA());
        }

        const dismissInstall = document.getElementById('dismissInstall');
        if (dismissInstall) {
            dismissInstall.addEventListener('click', () => this.dismissInstallBanner());
        }
    }

    // PWA Installation
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful:', registration.scope);
                        
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
                        console.error('ServiceWorker registration failed:', error);
                    });
            });
        }
    }

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showNotification('You are back online', 'success');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.showNotification('You are offline. Some features may be limited.', 'warning');
        });
    }

    async syncOfflineData() {
        // Implement offline data sync
        const offlineData = JSON.parse(localStorage.getItem('offline_data') || '[]');
        
        for (const data of offlineData) {
            try {
                // Attempt to sync each offline action
                await this.syncAction(data);
                offlineData.splice(offlineData.indexOf(data), 1);
            } catch (error) {
                console.error('Failed to sync offline action:', error);
            }
        }
        
        localStorage.setItem('offline_data', JSON.stringify(offlineData));
    }

    // Auth Modal
    openAuthModal(mode = 'login') {
        const modal = document.getElementById('authModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (mode === 'register') {
            this.switchAuthTab('register');
        } else if (mode === 'lender') {
            this.switchAuthTab('lender');
        } else {
            this.switchAuthTab('login');
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    switchAuthTab(tabId) {
        // Update tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tabId}Form`);
        });

        // Update modal title
        const titleMap = {
            login: 'Login to M-pesewa',
            register: 'Join as Borrower',
            lender: 'Become a Lender'
        };
        const titleElement = document.getElementById('authModalTitle');
        if (titleElement) {
            titleElement.textContent = titleMap[tabId];
        }
    }

    // Form Handlers
    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginRole').value;

        try {
            // Validate credentials
            const user = await this.validateCredentials(username, password, role);
            
            if (user) {
                this.saveCurrentUser(user, role);
                this.closeAuthModal();
                this.showNotification('Login successful!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = `/pages/dashboard/${role}-dashboard.html`;
                }, 1000);
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            this.showNotification(error.message || 'Login failed. Please check your credentials.', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('regFullName').value,
            country: document.getElementById('regCountry').value,
            phone: document.getElementById('regPhone').value,
            nationalId: document.getElementById('regNationalId').value,
            referrer1: document.getElementById('regReferrer1').value,
            referrer2: document.getElementById('regReferrer2').value,
            dualRole: document.getElementById('regDualRole').checked
        };

        try {
            // Validate form data
            this.validateBorrowerRegistration(formData);
            
            // Create user
            const user = await this.createBorrower(formData);
            
            this.saveCurrentUser(user, 'borrower');
            this.closeAuthModal();
            this.showNotification('Registration successful!', 'success');
            
            // Redirect to borrower dashboard
            setTimeout(() => {
                window.location.href = '/pages/dashboard/borrower-dashboard.html';
            }, 1000);
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async handleLenderRegister(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('lenderFullName').value,
            brand: document.getElementById('lenderBrand').value,
            country: document.getElementById('lenderCountry').value,
            subscription: document.getElementById('lenderSubscription').value,
            categories: Array.from(document.querySelectorAll('.categories-select input:checked')).map(cb => cb.value),
            username: document.getElementById('lenderUsername').value,
            password: document.getElementById('lenderPassword').value
        };

        try {
            // Validate form data
            this.validateLenderRegistration(formData);
            
            // Create lender
            const user = await this.createLender(formData);
            
            this.saveCurrentUser(user, 'lender');
            this.closeAuthModal();
            this.showNotification('Lender registration successful!', 'success');
            
            // Show subscription payment modal
            setTimeout(() => {
                this.showSubscriptionPayment(formData.subscription);
            }, 1500);
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Validation Methods
    validateBorrowerRegistration(data) {
        const errors = [];
        
        if (!data.fullName || data.fullName.length < 3) {
            errors.push('Full name must be at least 3 characters');
        }
        
        if (!data.country) {
            errors.push('Please select a country');
        }
        
        if (!data.phone || !this.validatePhoneNumber(data.phone)) {
            errors.push('Please enter a valid phone number');
        }
        
        if (!data.nationalId || data.nationalId.length < 5) {
            errors.push('Please enter a valid national ID');
        }
        
        if (!data.referrer1) {
            errors.push('Referrer 1 is required');
        }
        
        if (!data.referrer2) {
            errors.push('Referrer 2 is required');
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
    }

    validateLenderRegistration(data) {
        const errors = [];
        
        if (!data.fullName || data.fullName.length < 3) {
            errors.push('Full name must be at least 3 characters');
        }
        
        if (!data.country) {
            errors.push('Please select a country');
        }
        
        if (!data.subscription) {
            errors.push('Please select a subscription level');
        }
        
        if (data.categories.length === 0) {
            errors.push('Please select at least one loan category');
        }
        
        if (!data.username || data.username.length < 3) {
            errors.push('Username must be at least 3 characters');
        }
        
        if (!data.password || data.password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        
        if (!this.validatePassword(data.password)) {
            errors.push('Password must contain uppercase, lowercase, and numbers');
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
    }

    validatePhoneNumber(phone) {
        // Basic phone validation - can be enhanced per country
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    validatePassword(password) {
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        return hasUpper && hasLower && hasNumber && password.length >= 8;
    }

    // Data Methods
    async validateCredentials(username, password, role) {
        // In a real app, this would be an API call
        // For demo, check against demo data or localStorage
        
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const user = users.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password && 
            u.role === role
        );
        
        if (user) {
            return {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                country: user.country
            };
        }
        
        // Check demo data
        if (this.demoData?.users) {
            const demoUser = this.demoData.users.find(u => 
                (u.username === username || u.email === username) && 
                u.password === password && 
                u.role === role
            );
            
            if (demoUser) {
                return {
                    id: demoUser.id,
                    name: demoUser.fullName,
                    email: demoUser.email,
                    role: demoUser.role,
                    country: demoUser.country
                };
            }
        }
        
        return null;
    }

    async createBorrower(data) {
        const user = {
            id: `user_${Date.now()}`,
            fullName: data.fullName,
            country: data.country,
            phone: data.phone,
            nationalId: data.nationalId,
            referrers: [data.referrer1, data.referrer2],
            role: 'borrower',
            createdAt: new Date().toISOString(),
            rating: 5,
            status: 'active'
        };
        
        // Save to localStorage
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        users.push(user);
        localStorage.setItem('mpesewa_users', JSON.stringify(users));
        
        return user;
    }

    async createLender(data) {
        const user = {
            id: `lender_${Date.now()}`,
            fullName: data.fullName,
            brand: data.brand,
            country: data.country,
            subscription: data.subscription,
            categories: data.categories,
            username: data.username,
            password: data.password,
            role: 'lender',
            createdAt: new Date().toISOString(),
            subscriptionExpiry: this.calculateSubscriptionExpiry(),
            status: 'pending_payment'
        };
        
        // Save to localStorage
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        users.push(user);
        localStorage.setItem('mpesewa_users', JSON.stringify(users));
        
        return user;
    }

    calculateSubscriptionExpiry() {
        const today = new Date();
        const expiry = new Date(today.getFullYear(), today.getMonth() + 1, 28);
        return expiry.toISOString();
    }

    // UI Helpers
    populateCountrySelects() {
        const selects = document.querySelectorAll('select[id$="Country"]');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Select Country</option>' +
                this.countryData.map(country => 
                    `<option value="${country.code}">${country.name} (${country.currency})</option>`
                ).join('');
        });
    }

    populateCategoryCards() {
        const container = document.querySelector('.loan-categories-grid');
        if (container && this.categoryData) {
            container.innerHTML = this.categoryData.map(category => `
                <div class="loan-category-card" data-category="${category.id}">
                    <div class="loan-category-icon">${category.icon}</div>
                    <div class="loan-category-name">${category.name}</div>
                </div>
            `).join('');
        }
    }

    showSubscriptionPayment(subscriptionLevel) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Complete Subscription Payment</h2>
                    <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>To activate your lender account, please complete the subscription payment.</p>
                    
                    <div class="payment-details">
                        <h3>Subscription: ${subscriptionLevel.toUpperCase()}</h3>
                        <p>Please send payment to:</p>
                        <div class="payment-info">
                            <p><strong>Paybill:</strong> 123456</p>
                            <p><strong>Account:</strong> M-pesewa Subscription</p>
                            <p><strong>Amount:</strong> ${this.getSubscriptionAmount(subscriptionLevel)}</p>
                        </div>
                    </div>
                    
                    <div class="payment-actions">
                        <button class="btn btn-primary" onclick="app.confirmPayment()">I Have Paid</button>
                        <button class="btn btn-outline" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    getSubscriptionAmount(level) {
        const amounts = {
            basic: '50/month',
            premium: '250/month',
            super: '1000/month'
        };
        return amounts[level] || '50/month';
    }

    async confirmPayment() {
        try {
            // In real app, verify payment with backend
            this.showNotification('Payment confirmed! Your lender account is now active.', 'success');
            
            // Update user status
            const user = this.currentUser;
            user.status = 'active';
            this.saveCurrentUser(user, 'lender');
            
            // Redirect to lender dashboard
            setTimeout(() => {
                window.location.href = '/pages/dashboard/lender-dashboard.html';
            }, 1500);
        } catch (error) {
            this.showNotification('Payment verification failed. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </div>
            <div class="notification-content">${message}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    showUpdateNotification() {
        if (confirm('A new version of M-pesewa is available. Reload to update?')) {
            window.location.reload();
        }
    }

    // PWA Installation
    async installPWA() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                this.showNotification('M-pesewa installed successfully!', 'success');
            }
            
            window.deferredPrompt = null;
            this.dismissInstallBanner();
        }
    }

    dismissInstallBanner() {
        const banner = document.getElementById('installBanner');
        banner.classList.remove('show');
        localStorage.setItem('installBannerDismissed', 'true');
    }

    checkPWAInstall() {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }
        
        // Check if banner was dismissed
        if (localStorage.getItem('installBannerDismissed')) {
            return;
        }
        
        // Show install banner
        const banner = document.getElementById('installBanner');
        if (banner) {
            setTimeout(() => banner.classList.add('show'), 3000);
        }
    }

    // Fallback Data
    getFallbackCountries() {
        return [
            { code: 'ke', name: 'Kenya', currency: 'KSh' },
            { code: 'ug', name: 'Uganda', currency: 'UGX' },
            { code: 'tz', name: 'Tanzania', currency: 'TZS' },
            { code: 'rw', name: 'Rwanda', currency: 'RWF' },
            { code: 'ng', name: 'Nigeria', currency: 'NGN' },
            { code: 'gh', name: 'Ghana', currency: 'GHS' },
            { code: 'za', name: 'South Africa', currency: 'ZAR' },
            { code: 'et', name: 'Ethiopia', currency: 'ETB' }
        ];
    }

    getFallbackCategories() {
        return [
            { id: 'transport', name: 'Transport', icon: '🚗' },
            { id: 'data', name: 'Data/Airtime', icon: '📶' },
            { id: 'food', name: 'Food', icon: '🍲' },
            { id: 'gas', name: 'Cooking Gas', icon: '🔥' },
            { id: 'medicine', name: 'Medicine', icon: '💊' }
        ];
    }

    cacheDemoData() {
        // Cache demo data for offline use
        if (this.demoData) {
            localStorage.setItem('demo_groups', JSON.stringify(this.demoData.groups));
            localStorage.setItem('demo_users', JSON.stringify(this.demoData.users));
            localStorage.setItem('demo_ledgers', JSON.stringify(this.demoData.ledgers));
        }
    }

    syncAction(data) {
        // Implement sync logic for offline actions
        return new Promise((resolve, reject) => {
            // In a real app, this would be an API call
            console.log('Syncing action:', data);
            resolve();
        });
    }
}

// Initialize app
const app = new MpesewaApp();

// Make app available globally
window.app = app;

// Global functions for inline handlers
function openAuthModal(mode = 'login') {
    app.openAuthModal(mode);
}

function closeAuthModal() {
    app.closeAuthModal();
}

function initNavigation() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target) &&
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            
            if (navMenu && navToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

function checkPWAInstall() {
    app.checkPWAInstall();
}

// Service Worker events
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            window.location.reload();
        });
    });
}

// Before install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.deferredPrompt = e;
    
    // Show install banner
    app.checkPWAInstall();
});

// App installed
window.addEventListener('appinstalled', () => {
    console.log('PWA installed');
    localStorage.setItem('appInstalled', 'true');
});