/* M-Pesewa - Authentication */

const Auth = {
    // Current session
    currentUser: null,
    currentRole: null,
    
    // Initialize auth module
    init() {
        this.loadSession();
        this.setupAuthForms();
        this.setupLogout();
        this.setupRoleSwitching();
    },
    
    // Load session from storage
    loadSession() {
        const userData = localStorage.getItem('mpesewa_user');
        const roleData = localStorage.getItem('mpesewa_role');
        
        if (userData && roleData) {
            this.currentUser = JSON.parse(userData);
            this.currentRole = roleData;
            this.updateUIForLoggedIn();
            return true;
        }
        return false;
    },
    
    // Save session to storage
    saveSession(user, role) {
        this.currentUser = user;
        this.currentRole = role;
        
        localStorage.setItem('mpesewa_user', JSON.stringify(user));
        localStorage.setItem('mpesewa_role', role);
        
        this.updateUIForLoggedIn();
        this.dispatchAuthEvent('login');
    },
    
    // Clear session
    clearSession() {
        this.currentUser = null;
        this.currentRole = null;
        
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_role');
        localStorage.removeItem('mpesewa_country');
        localStorage.removeItem('mpesewa_group');
        
        this.updateUIForLoggedOut();
        this.dispatchAuthEvent('logout');
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    },
    
    // Check if user has specific role
    hasRole(role) {
        return this.currentRole === role;
    },
    
    // Check if user is admin
    isAdmin() {
        return this.currentRole === 'admin';
    },
    
    // Setup authentication forms
    setupAuthForms() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }
        
        // Borrower registration form
        const borrowerForm = document.getElementById('borrowerRegistration');
        if (borrowerForm) {
            borrowerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBorrowerRegistration(borrowerForm);
            });
        }
        
        // Lender registration form
        const lenderForm = document.getElementById('lenderRegistration');
        if (lenderForm) {
            lenderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLenderRegistration(lenderForm);
            });
        }
        
        // Admin login form (if exists)
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin(adminLoginForm);
            });
        }
    },
    
    // Setup logout functionality
    setupLogout() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="logout"]') || 
                e.target.closest('[data-action="logout"]')) {
                e.preventDefault();
                this.handleLogout();
            }
        });
    },
    
    // Setup role switching
    setupRoleSwitching() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-switch-role]')) {
                e.preventDefault();
                const role = e.target.dataset.switchRole;
                this.switchRole(role);
            }
        });
    },
    
    // Handle login
    async handleLogin(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate
        if (!data.country || !data.phone || !data.password) {
            this.showError('Please fill all required fields');
            return;
        }
        
        this.showLoading('Logging in...');
        
        try {
            // For demo: simulate API call
            const user = await this.mockLogin(data);
            
            if (user) {
                this.saveSession(user, user.role);
                this.showSuccess('Login successful!');
                
                // Redirect based on role
                setTimeout(() => {
                    this.redirectToDashboard(user.role);
                }, 1000);
            } else {
                this.showError('Invalid credentials');
            }
        } catch (error) {
            this.showError('Login failed: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // Handle borrower registration
    async handleBorrowerRegistration(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate
        const errors = this.validateBorrowerRegistration(data);
        if (errors.length > 0) {
            this.showError(errors.join('<br>'));
            return;
        }
        
        this.showLoading('Registering...');
        
        try {
            const user = await this.mockBorrowerRegistration(data);
            this.saveSession(user, 'borrower');
            this.showSuccess('Registration successful!');
            
            // Redirect to borrower dashboard
            setTimeout(() => {
                window.location.href = 'pages/dashboard/borrower-dashboard.html';
            }, 1000);
        } catch (error) {
            this.showError('Registration failed: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // Handle lender registration
    async handleLenderRegistration(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate
        const errors = this.validateLenderRegistration(data);
        if (errors.length > 0) {
            this.showError(errors.join('<br>'));
            return;
        }
        
        this.showLoading('Registering lender...');
        
        try {
            const user = await this.mockLenderRegistration(data);
            this.saveSession(user, 'lender');
            this.showSuccess('Lender registration successful!');
            
            // Simulate subscription payment redirect
            setTimeout(() => {
                if (window.confirm('Redirect to payment gateway to complete subscription?')) {
                    // For demo, simulate successful payment
                    user.subscription.status = 'active';
                    localStorage.setItem('mpesewa_user', JSON.stringify(user));
                    
                    window.location.href = 'pages/dashboard/lender-dashboard.html';
                }
            }, 1500);
        } catch (error) {
            this.showError('Registration failed: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // Handle admin login
    async handleAdminLogin(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        if (!data.username || !data.password) {
            this.showError('Please enter admin credentials');
            return;
        }
        
        this.showLoading('Verifying admin access...');
        
        try {
            // For demo: hardcoded admin credentials
            if (data.username === 'admin' && data.password === 'admin123') {
                const adminUser = {
                    id: 'admin_001',
                    name: 'Platform Admin',
                    role: 'admin',
                    permissions: ['all'],
                    createdAt: new Date().toISOString()
                };
                
                this.saveSession(adminUser, 'admin');
                this.showSuccess('Admin login successful');
                
                setTimeout(() => {
                    window.location.href = 'pages/dashboard/admin-dashboard.html';
                }, 1000);
            } else {
                this.showError('Invalid admin credentials');
            }
        } catch (error) {
            this.showError('Admin login failed');
        } finally {
            this.hideLoading();
        }
    },
    
    // Handle logout
    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.clearSession();
            this.showSuccess('Logged out successfully');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }
    },
    
    // Switch user role (for dual role users)
    switchRole(targetRole) {
        if (!this.currentUser) return;
        
        // Check if user has the target role
        if (this.currentUser.roles && this.currentUser.roles.includes(targetRole)) {
            this.currentRole = targetRole;
            localStorage.setItem('mpesewa_role', targetRole);
            
            this.showSuccess(`Switched to ${targetRole} role`);
            
            // Reload the dashboard for the new role
            setTimeout(() => {
                this.redirectToDashboard(targetRole);
            }, 500);
        } else {
            this.showError(`You don't have ${targetRole} role access`);
        }
    },
    
    // Validate borrower registration
    validateBorrowerRegistration(data) {
        const errors = [];
        
        if (!data.fullName?.trim()) errors.push('Full name is required');
        if (!data.phone?.trim()) errors.push('Phone number is required');
        if (!data.country) errors.push('Country is required');
        if (!data.location?.trim()) errors.push('Location is required');
        if (!data.nationalId?.trim()) errors.push('National ID is required');
        
        // Validate guarantors
        if (!data.guarantor1Name?.trim() || !data.guarantor1Phone?.trim()) {
            errors.push('Guarantor 1 information is required');
        }
        
        if (!data.guarantor2Name?.trim() || !data.guarantor2Phone?.trim()) {
            errors.push('Guarantor 2 information is required');
        }
        
        // Validate phone format (basic)
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (data.phone && !phoneRegex.test(data.phone)) {
            errors.push('Invalid phone number format');
        }
        
        // Validate email if provided
        if (data.email && !this.validateEmail(data.email)) {
            errors.push('Invalid email address');
        }
        
        return errors;
    },
    
    // Validate lender registration
    validateLenderRegistration(data) {
        const errors = [];
        
        if (!data.fullName?.trim()) errors.push('Full name is required');
        if (!data.phone?.trim()) errors.push('Phone number is required');
        if (!data.country) errors.push('Country is required');
        if (!data.location?.trim()) errors.push('Location is required');
        if (!data.nationalId?.trim()) errors.push('National ID is required');
        if (!data.tier) errors.push('Subscription tier is required');
        
        // Validate categories selection for lenders
        const categories = data.categories || [];
        if (categories.length === 0) {
            errors.push('Please select at least one loan category');
        }
        
        return errors;
    },
    
    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Mock login for demo
    async mockLogin(credentials) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load demo users
        const response = await fetch('data/demo-users.json');
        const users = await response.json();
        
        // Find matching user
        return users.find(user => 
            user.phone === credentials.phone && 
            user.country === credentials.country &&
            user.password === credentials.password // In real app, use proper auth
        );
    },
    
    // Mock borrower registration for demo
    async mockBorrowerRegistration(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create user object
        return {
            id: 'borrower_' + Date.now(),
            name: data.fullName,
            phone: data.phone,
            email: data.email || '',
            country: data.country,
            location: data.location,
            nationalId: data.nationalId,
            occupation: data.occupation || '',
            nextOfKin: data.nextOfKinPhone ? {
                phone: data.nextOfKinPhone
            } : null,
            guarantors: [
                {
                    name: data.guarantor1Name,
                    phone: data.guarantor1Phone,
                    relationship: 'guarantor'
                },
                {
                    name: data.guarantor2Name,
                    phone: data.guarantor2Phone,
                    relationship: 'guarantor'
                }
            ],
            categories: data.categories ? data.categories.split(',') : [],
            role: 'borrower',
            rating: 5.0,
            groups: [],
            loans: [],
            createdAt: new Date().toISOString(),
            status: 'active'
        };
    },
    
    // Mock lender registration for demo
    async mockLenderRegistration(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get subscription data
        const response = await fetch('data/subscriptions.json');
        const subscriptions = await response.json();
        const tier = subscriptions.find(s => s.id === data.tier);
        
        if (!tier) throw new Error('Invalid subscription tier');
        
        // Calculate expiry date (28th of next month)
        const now = new Date();
        const expiry = new Date(now.getFullYear(), now.getMonth() + 1, 28);
        
        // Create user object
        return {
            id: 'lender_' + Date.now(),
            name: data.fullName,
            phone: data.phone,
            email: data.email || '',
            country: data.country,
            location: data.location,
            nationalId: data.nationalId,
            brandName: data.brandName || '',
            subscription: {
                tier: tier.id,
                name: tier.name,
                limit: tier.limits.weekly,
                price: tier.pricing.monthly,
                startDate: new Date().toISOString(),
                expiryDate: expiry.toISOString(),
                status: 'pending_payment',
                paymentMethod: 'mpesa'
            },
            categories: data.categories ? data.categories.split(',') : [],
            role: 'lender',
            groups: [],
            ledgers: [],
            totalLent: 0,
            activeLoans: 0,
            rating: 5.0,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
    },
    
    // Redirect to appropriate dashboard
    redirectToDashboard(role) {
        switch (role) {
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
    
    // Update UI for logged in state
    updateUIForLoggedIn() {
        // Update header buttons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
        
        if (loginBtn) loginBtn.textContent = 'Dashboard';
        if (mobileLoginBtn) mobileLoginBtn.textContent = 'Dashboard';
        if (registerBtn) registerBtn.style.display = 'none';
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'none';
        
        // Show user info if element exists
        const userInfoEl = document.getElementById('userInfo');
        if (userInfoEl && this.currentUser) {
            userInfoEl.innerHTML = `
                <div class="user-info">
                    <span class="user-name">${this.currentUser.name}</span>
                    <span class="badge ${this.currentRole === 'lender' ? 'badge-primary' : 'badge-success'}">
                        ${this.currentRole}
                    </span>
                    <button class="btn-logout" data-action="logout">Logout</button>
                </div>
            `;
        }
        
        // Update registration page if user is logged in
        if (window.location.pathname.includes('index.html') && this.currentUser) {
            const registrationSection = document.getElementById('registration');
            if (registrationSection) {
                registrationSection.innerHTML = `
                    <div class="already-logged-in">
                        <h3>You are already logged in as ${this.currentUser.name}</h3>
                        <p>Go to your dashboard to manage your account.</p>
                        <a href="pages/dashboard/${this.currentRole}-dashboard.html" class="btn btn-primary">
                            Go to Dashboard
                        </a>
                    </div>
                `;
            }
        }
    },
    
    // Update UI for logged out state
    updateUIForLoggedOut() {
        // Reset header buttons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
        
        if (loginBtn) loginBtn.textContent = 'Login';
        if (mobileLoginBtn) mobileLoginBtn.textContent = 'Login';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'inline-block';
        
        // Clear user info
        const userInfoEl = document.getElementById('userInfo');
        if (userInfoEl) {
            userInfoEl.innerHTML = '';
        }
    },
    
    // Dispatch auth events
    dispatchAuthEvent(type) {
        const event = new CustomEvent(`auth:${type}`, {
            detail: {
                user: this.currentUser,
                role: this.currentRole
            }
        });
        window.dispatchEvent(event);
    },
    
    // Show loading indicator
    showLoading(message) {
        MPesewa.showLoading(message);
    },
    
    // Hide loading indicator
    hideLoading() {
        MPesewa.hideLoading();
    },
    
    // Show success message
    showSuccess(message) {
        MPesewa.showToast(message, 'success');
    },
    
    // Show error message
    showError(message) {
        MPesewa.showToast(message, 'error');
    },
    
    // Get current user
    getUser() {
        return this.currentUser;
    },
    
    // Get current role
    getRole() {
        return this.currentRole;
    },
    
    // Check if user can access a page based on role
    canAccess(requiredRole) {
        if (!this.isAuthenticated()) return false;
        
        // Admin can access everything
        if (this.isAdmin()) return true;
        
        // Check specific role
        return this.hasRole(requiredRole);
    },
    
    // Protect a page based on role
    protectPage(requiredRole, redirectUrl = '/') {
        if (!this.canAccess(requiredRole)) {
            this.showError(`This page requires ${requiredRole} access`);
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
            return false;
        }
        return true;
    },
    
    // Get user's country
    getUserCountry() {
        return this.currentUser?.country || localStorage.getItem('mpesewa_country');
    },
    
    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) return false;
        
        Object.assign(this.currentUser, updates);
        localStorage.setItem('mpesewa_user', JSON.stringify(this.currentUser));
        
        this.dispatchAuthEvent('profile-updated');
        return true;
    },
    
    // Update subscription status
    updateSubscription(status) {
        if (!this.currentUser?.subscription) return false;
        
        this.currentUser.subscription.status = status;
        this.currentUser.status = status === 'active' ? 'active' : 'pending';
        
        localStorage.setItem('mpesewa_user', JSON.stringify(this.currentUser));
        
        this.dispatchAuthEvent('subscription-updated');
        return true;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// Make Auth available globally
window.Auth = Auth;