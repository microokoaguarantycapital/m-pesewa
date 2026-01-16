// Authentication and User Management

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.loadSession();
        this.setupAuthListeners();
    }

    loadSession() {
        const userData = localStorage.getItem('mpesewa_user');
        const userRole = localStorage.getItem('mpesewa_role');
        const userCountry = localStorage.getItem('mpesewa_country');

        if (userData && userRole && userCountry) {
            this.currentUser = JSON.parse(userData);
            this.isAuthenticated = true;
            this.updateUI();
        }
    }

    setupAuthListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Registration form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Logout buttons
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', () => this.logout());
        });

        // Role switching
        const switchRoleButtons = document.querySelectorAll('.switch-role-btn');
        switchRoleButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchRole());
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const users = await this.fetchUsers();
            const user = users.find(u => 
                (u.username === username || u.email === username) && 
                u.password === password
            );

            if (user) {
                this.login(user);
                this.showSuccess('Login successful!');
                
                // Redirect based on role
                setTimeout(() => {
                    this.redirectToDashboard(user.role);
                }, 1000);
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            this.showError('Invalid username or password');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            id: this.generateId(),
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            country: formData.get('country'),
            role: formData.get('role'),
            username: this.generateUsername(formData.get('name')),
            password: this.generatePassword(),
            createdAt: new Date().toISOString(),
            rating: 5,
            groups: [],
            status: 'active'
        };

        // Add subscription for lenders
        if (userData.role === 'lender') {
            userData.subscription = {
                tier: formData.get('subscriptionTier'),
                status: 'active',
                expiresAt: this.calculateExpiryDate(),
                paymentMethod: 'mpesa'
            };
            userData.lendingLimit = this.getLendingLimit(userData.subscription.tier);
        }

        // Add borrower-specific data
        if (userData.role === 'borrower') {
            userData.maxGroups = 4;
            userData.currentGroups = 0;
            userData.blacklisted = false;
        }

        try {
            // Save user locally
            this.saveUser(userData);
            this.login(userData);
            this.showSuccess('Registration successful!');
            
            // Redirect to dashboard
            setTimeout(() => {
                this.redirectToDashboard(userData.role);
            }, 1500);
        } catch (error) {
            this.showError('Registration failed. Please try again.');
        }
    }

    login(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Save to localStorage
        localStorage.setItem('mpesewa_user', JSON.stringify(user));
        localStorage.setItem('mpesewa_role', user.role);
        localStorage.setItem('mpesewa_country', user.country);
        
        // Update UI
        this.updateUI();
        
        // Dispatch login event
        window.dispatchEvent(new CustomEvent('auth:login', { detail: user }));
    }

    logout() {
        // Clear local storage
        localStorage.removeItem('mpesewa_user');
        localStorage.removeItem('mpesewa_role');
        localStorage.removeItem('mpesewa_country');
        
        // Reset state
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Update UI
        this.updateUI();
        
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Redirect to home
        window.location.href = 'index.html';
    }

    switchRole() {
        if (!this.isAuthenticated) return;
        
        // For demo purposes, toggle between borrower and lender
        const newRole = this.currentUser.role === 'borrower' ? 'lender' : 'borrower';
        
        // Update user role
        this.currentUser.role = newRole;
        localStorage.setItem('mpesewa_role', newRole);
        
        // Show confirmation
        this.showSuccess(`Switched to ${newRole} role`);
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
            this.redirectToDashboard(newRole);
        }, 1000);
    }

    updateUI() {
        // Update navigation
        const authButtons = document.querySelector('.nav-auth');
        const userGreeting = document.querySelector('.user-greeting');
        const roleBadge = document.querySelector('.role-badge');
        
        if (this.isAuthenticated) {
            // Update auth buttons
            if (authButtons) {
                authButtons.innerHTML = `
                    <div class="user-menu">
                        <span class="user-name">${this.currentUser.name.split(' ')[0]}</span>
                        <div class="user-dropdown">
                            <a href="#" class="switch-role-btn">Switch Role</a>
                            <a href="#" class="logout-btn">Logout</a>
                        </div>
                    </div>
                `;
            }
            
            // Update greeting
            if (userGreeting) {
                userGreeting.textContent = `Welcome, ${this.currentUser.name}`;
            }
            
            // Update role badge
            if (roleBadge) {
                roleBadge.textContent = this.currentUser.role.toUpperCase();
                roleBadge.className = `role-badge badge-${this.currentUser.role}`;
            }
        } else {
            // Reset to default auth buttons
            if (authButtons) {
                authButtons.innerHTML = `
                    <button class="btn btn-outline" id="loginBtn">Sign In</button>
                    <button class="btn btn-primary" id="registerBtn">Get Started</button>
                `;
            }
        }
    }

    redirectToDashboard(role) {
        const dashboards = {
            'borrower': 'pages/dashboard/borrower-dashboard.html',
            'lender': 'pages/dashboard/lender-dashboard.html',
            'admin': 'pages/dashboard/admin-dashboard.html'
        };
        
        const dashboard = dashboards[role] || 'index.html';
        window.location.href = dashboard;
    }

    async fetchUsers() {
        try {
            const response = await fetch('data/demo-users.json');
            const data = await response.json();
            return data.users || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    saveUser(user) {
        // In a real app, this would be an API call
        // For demo, we just save to localStorage
        const users = JSON.parse(localStorage.getItem('mpesewa_all_users') || '[]');
        users.push(user);
        localStorage.setItem('mpesewa_all_users', JSON.stringify(users));
    }

    generateId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    generateUsername(name) {
        const base = name.toLowerCase().replace(/\s+/g, '');
        const random = Math.floor(Math.random() * 1000);
        return `${base}${random}`;
    }

    generatePassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    calculateExpiryDate() {
        const date = new Date();
        const currentDay = date.getDate();
        
        if (currentDay > 28) {
            date.setMonth(date.getMonth() + 1);
        }
        date.setDate(28);
        date.setHours(23, 59, 59, 999);
        
        return date.toISOString();
    }

    getLendingLimit(tier) {
        const limits = {
            'basic': 1500,
            'premium': 5000,
            'super': 20000,
            'lender-of-lenders': 50000
        };
        return limits[tier] || 1500;
    }

    checkSubscriptionStatus() {
        if (!this.currentUser || this.currentUser.role !== 'lender') {
            return true; // Borrowers don't need subscription
        }
        
        if (!this.currentUser.subscription) {
            return false;
        }
        
        const expiresAt = new Date(this.currentUser.subscription.expiresAt);
        const now = new Date();
        
        return now < expiresAt;
    }

    getDaysUntilExpiry() {
        if (!this.currentUser?.subscription) return 0;
        
        const expiresAt = new Date(this.currentUser.subscription.expiresAt);
        const now = new Date();
        const diffTime = expiresAt - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    showSuccess(message) {
        // Use app's toast system or create one
        if (window.app && window.app.showToast) {
            window.app.showToast(message, 'success');
        } else {
            alert(message);
        }
    }

    showError(message) {
        if (window.app && window.app.showToast) {
            window.app.showToast(message, 'danger');
        } else {
            alert(message);
        }
    }

    // Public methods
    getUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }

    getRole() {
        return this.currentUser?.role;
    }

    getCountry() {
        return this.currentUser?.country;
    }

    hasActiveSubscription() {
        return this.checkSubscriptionStatus();
    }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new AuthManager();
});