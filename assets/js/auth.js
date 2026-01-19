// Authentication Module - M-pesewa

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.init();
    }

    init() {
        this.loadUser();
        this.setupAuthForms();
    }

    // User Management
    loadUser() {
        const userData = localStorage.getItem('mpesewa_user');
        const role = localStorage.getItem('mpesewa_role');
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.currentRole = role || 'borrower';
            this.updateAuthUI();
        }
    }

    saveUser(user, role) {
        this.currentUser = user;
        this.currentRole = role;
        
        localStorage.setItem('mpesewa_user', JSON.stringify(user));
        localStorage.setItem('mpesewa_role', role);
        
        this.updateAuthUI();
        this.dispatchAuthChange();
    }

    clearUser() {
        this.currentUser = null;
        this.currentRole = null;
        
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_role');
        
        this.updateAuthUI();
        this.dispatchAuthChange();
    }

    updateAuthUI() {
        const authButtons = document.querySelector('.nav-auth');
        const userNav = document.querySelector('.user-nav');
        
        if (!authButtons) return;
        
        if (this.currentUser) {
            authButtons.innerHTML = `
                <div class="dropdown">
                    <button class="dropdown-toggle">
                        <span>${this.currentUser.name}</span>
                        <span class="badge badge-primary">${this.currentRole}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="dropdown-menu">
                        <a href="/pages/dashboard/${this.currentRole}-dashboard.html" class="dropdown-item">Dashboard</a>
                        <a href="/pages/profile.html" class="dropdown-item">Profile</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" onclick="auth.logout()">Logout</a>
                    </div>
                </div>
            `;
            
            // Initialize dropdown
            this.initDropdowns();
        } else {
            authButtons.innerHTML = `
                <a href="#" class="btn btn-outline" onclick="openAuthModal()">Login</a>
                <a href="#" class="btn btn-primary" onclick="openAuthModal('register')">Join Now</a>
            `;
        }
    }

    // Authentication Methods
    async login(email, password, role) {
        try {
            // Validate credentials
            const user = await this.validateLogin(email, password, role);
            
            if (!user) {
                throw new Error('Invalid credentials');
            }
            
            this.saveUser(user, role);
            return { success: true, user };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async registerBorrower(data) {
        try {
            // Validate data
            this.validateBorrowerData(data);
            
            // Create borrower
            const user = await this.createBorrowerAccount(data);
            
            this.saveUser(user, 'borrower');
            return { success: true, user };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async registerLender(data) {
        try {
            // Validate data
            this.validateLenderData(data);
            
            // Create lender
            const user = await this.createLenderAccount(data);
            
            this.saveUser(user, 'lender');
            return { success: true, user };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    logout() {
        this.clearUser();
        window.location.href = '/';
    }

    // Validation Methods
    validateBorrowerData(data) {
        const errors = [];
        
        if (!data.fullName?.trim()) {
            errors.push('Full name is required');
        }
        
        if (!data.nationalId?.trim()) {
            errors.push('National ID is required');
        }
        
        if (!data.phone?.trim()) {
            errors.push('Phone number is required');
        } else if (!this.validatePhone(data.phone)) {
            errors.push('Invalid phone number');
        }
        
        if (!data.country) {
            errors.push('Country is required');
        }
        
        if (!data.referrer1?.trim() || !data.referrer2?.trim()) {
            errors.push('Two referrers are required');
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
    }

    validateLenderData(data) {
        const errors = [];
        
        if (!data.fullName?.trim()) {
            errors.push('Full name is required');
        }
        
        if (!data.username?.trim()) {
            errors.push('Username is required');
        } else if (data.username.length < 3) {
            errors.push('Username must be at least 3 characters');
        }
        
        if (!data.password) {
            errors.push('Password is required');
        } else if (data.password.length < 8) {
            errors.push('Password must be at least 8 characters');
        } else if (!this.validatePassword(data.password)) {
            errors.push('Password must contain uppercase, lowercase, and numbers');
        }
        
        if (!data.country) {
            errors.push('Country is required');
        }
        
        if (!data.subscription) {
            errors.push('Subscription level is required');
        }
        
        if (!data.categories || data.categories.length === 0) {
            errors.push('Please select at least one loan category');
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
    }

    validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    validatePassword(password) {
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        return hasUpper && hasLower && hasNumber;
    }

    // Account Creation
    async createBorrowerAccount(data) {
        const user = {
            id: `borrower_${Date.now()}`,
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            nationalId: data.nationalId,
            country: data.country,
            referrers: [data.referrer1, data.referrer2],
            role: 'borrower',
            createdAt: new Date().toISOString(),
            rating: 5,
            status: 'active',
            groups: [],
            blacklisted: false
        };
        
        // Save to local storage
        this.saveUserToStorage(user);
        
        return user;
    }

    async createLenderAccount(data) {
        const user = {
            id: `lender_${Date.now()}`,
            name: data.fullName,
            brand: data.brand,
            username: data.username,
            password: data.password, // Note: In production, hash this!
            country: data.country,
            subscription: data.subscription,
            categories: data.categories,
            role: 'lender',
            createdAt: new Date().toISOString(),
            subscriptionExpiry: this.calculateSubscriptionExpiry(),
            status: 'pending_payment',
            totalLent: 0,
            activeLedgers: 0,
            rating: 5
        };
        
        // Save to local storage
        this.saveUserToStorage(user);
        
        return user;
    }

    // Helper Methods
    async validateLogin(identifier, password, role) {
        // Check local storage first
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        const user = users.find(u => 
            (u.email === identifier || u.username === identifier) &&
            u.password === password &&
            u.role === role
        );
        
        if (user) {
            return {
                id: user.id,
                name: user.name || user.fullName,
                email: user.email,
                role: user.role,
                country: user.country
            };
        }
        
        // Check demo data
        const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
        const demoUser = demoUsers.find(u => 
            (u.email === identifier || u.username === identifier) &&
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
        
        return null;
    }

    saveUserToStorage(user) {
        const users = JSON.parse(localStorage.getItem('mpesewa_users') || '[]');
        users.push(user);
        localStorage.setItem('mpesewa_users', JSON.stringify(users));
    }

    calculateSubscriptionExpiry() {
        const today = new Date();
        const expiry = new Date(today.getFullYear(), today.getMonth() + 1, 28);
        return expiry.toISOString();
    }

    // Event Handling
    setupAuthForms() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        }
        
        // Borrower registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleBorrowerRegister(e));
        }
        
        // Lender registration form
        const lenderForm = document.getElementById('lenderForm');
        if (lenderForm) {
            lenderForm.addEventListener('submit', (e) => this.handleLenderRegister(e));
        }
        
        // Dual role checkbox
        const dualRoleCheckbox = document.getElementById('regDualRole');
        if (dualRoleCheckbox) {
            dualRoleCheckbox.addEventListener('change', (e) => this.handleDualRoleToggle(e));
        }
    }

    async handleLoginSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginRole').value;
        
        const result = await this.login(email, password, role);
        
        if (result.success) {
            this.showNotification('Login successful!', 'success');
            closeAuthModal();
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = `/pages/dashboard/${role}-dashboard.html`;
            }, 1000);
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    async handleBorrowerRegister(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('regFullName').value,
            email: document.getElementById('regEmail')?.value,
            nationalId: document.getElementById('regNationalId').value,
            phone: document.getElementById('regPhone').value,
            country: document.getElementById('regCountry').value,
            referrer1: document.getElementById('regReferrer1').value,
            referrer2: document.getElementById('regReferrer2').value
        };
        
        const result = await this.registerBorrower(formData);
        
        if (result.success) {
            this.showNotification('Registration successful!', 'success');
            closeAuthModal();
            
            // Show dual role option if selected
            const dualRole = document.getElementById('regDualRole')?.checked;
            if (dualRole) {
                setTimeout(() => {
                    openAuthModal('lender');
                }, 1500);
            } else {
                // Redirect to borrower dashboard
                setTimeout(() => {
                    window.location.href = '/pages/dashboard/borrower-dashboard.html';
                }, 1000);
            }
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    async handleLenderRegister(e) {
        e.preventDefault();
        
        const categories = Array.from(
            document.querySelectorAll('.categories-select input:checked')
        ).map(cb => cb.value);
        
        const formData = {
            fullName: document.getElementById('lenderFullName').value,
            brand: document.getElementById('lenderBrand').value,
            username: document.getElementById('lenderUsername').value,
            password: document.getElementById('lenderPassword').value,
            country: document.getElementById('lenderCountry').value,
            subscription: document.getElementById('lenderSubscription').value,
            categories: categories
        };
        
        const result = await this.registerLender(formData);
        
        if (result.success) {
            this.showNotification('Lender registration successful!', 'success');
            closeAuthModal();
            
            // Show payment instructions
            this.showPaymentModal(formData.subscription);
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    handleDualRoleToggle(e) {
        const isChecked = e.target.checked;
        const lenderSection = document.querySelector('.lender-extra-fields');
        
        if (!lenderSection) {
            const form = document.getElementById('registerForm');
            const extraFields = `
                <div class="form-group lender-extra-fields">
                    <label for="lenderUsernameExtra">Username (for Lender role)</label>
                    <input type="text" id="lenderUsernameExtra" required>
                </div>
                <div class="form-group lender-extra-fields">
                    <label for="lenderPasswordExtra">Password (for Lender role)</label>
                    <input type="password" id="lenderPasswordExtra" required>
                </div>
            `;
            form.insertAdjacentHTML('beforeend', extraFields);
        } else {
            lenderSection.style.display = isChecked ? 'block' : 'none';
        }
    }

    // UI Methods
    showPaymentModal(subscriptionLevel) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Complete Subscription Payment</h2>
                    <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="payment-instructions">
                        <h3>Payment Required</h3>
                        <p>To activate your lender account, please complete the subscription payment.</p>
                        
                        <div class="payment-details">
                            <h4>Subscription: ${subscriptionLevel.toUpperCase()}</h4>
                            <div class="payment-methods">
                                <div class="payment-method">
                                    <h5>M-Pesa</h5>
                                    <p><strong>Paybill:</strong> 123456</p>
                                    <p><strong>Account:</strong> MPESEWA-SUB</p>
                                    <p><strong>Amount:</strong> ${this.getSubscriptionAmount(subscriptionLevel)}</p>
                                </div>
                                <div class="payment-method">
                                    <h5>Airtel Money</h5>
                                    <p><strong>Merchant Code:</strong> MPESEWA</p>
                                    <p><strong>Amount:</strong> ${this.getSubscriptionAmount(subscriptionLevel)}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="payment-actions">
                            <button class="btn btn-primary" onclick="auth.confirmPayment('${subscriptionLevel}')">
                                I Have Paid
                            </button>
                            <button class="btn btn-outline" onclick="this.parentElement.parentElement.parentElement.remove()">
                                Pay Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    getSubscriptionAmount(level) {
        const amounts = {
            basic: 'KSh 50',
            premium: 'KSh 250',
            super: 'KSh 1,000'
        };
        return amounts[level] || 'KSh 50';
    }

    async confirmPayment(subscriptionLevel) {
        try {
            // In a real app, verify payment with backend
            // For demo, simulate payment verification
            
            this.showNotification('Payment confirmed! Activating your lender account...', 'success');
            
            // Update user status
            const user = this.currentUser;
            user.status = 'active';
            user.subscription = subscriptionLevel;
            this.saveUser(user, 'lender');
            
            // Close modal
            document.querySelector('.modal.active')?.remove();
            
            // Redirect to lender dashboard
            setTimeout(() => {
                window.location.href = '/pages/dashboard/lender-dashboard.html';
            }, 1500);
            
        } catch (error) {
            this.showNotification('Payment verification failed. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Use app's notification system or create one
        if (window.app?.showNotification) {
            window.app.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    initDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = toggle.nextElementSibling;
                menu.classList.toggle('show');
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        });
    }

    dispatchAuthChange() {
        window.dispatchEvent(new CustomEvent('authchange', {
            detail: { user: this.currentUser, role: this.currentRole }
        }));
    }

    // Utility Methods
    isAuthenticated() {
        return !!this.currentUser;
    }

    hasRole(role) {
        return this.currentRole === role;
    }

    canAccessLenderFeatures() {
        return this.currentRole === 'lender' && 
               this.currentUser?.status === 'active' &&
               !this.isSubscriptionExpired();
    }

    isSubscriptionExpired() {
        if (this.currentRole !== 'lender') return false;
        
        const expiry = this.currentUser?.subscriptionExpiry;
        if (!expiry) return true;
        
        return new Date(expiry) < new Date();
    }

    getDaysUntilExpiry() {
        if (!this.currentUser?.subscriptionExpiry) return 0;
        
        const expiry = new Date(this.currentUser.subscriptionExpiry);
        const today = new Date();
        const diff = expiry.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}

// Initialize auth manager
const auth = new AuthManager();

// Make available globally
window.auth = auth;

// Global auth functions
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Switch to requested tab
        if (mode === 'register' || mode === 'lender') {
            const tabs = modal.querySelectorAll('.auth-tab');
            tabs.forEach(tab => {
                if (tab.dataset.tab === mode) {
                    tab.click();
                }
            });
        }
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Auto-close modals on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAuthModal();
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.remove();
        });
    }
});

// Auth change listener
window.addEventListener('authchange', (e) => {
    console.log('Auth changed:', e.detail);
    
    // Update any auth-dependent components
    const event = new CustomEvent('updateauth', { detail: e.detail });
    window.dispatchEvent(event);
});