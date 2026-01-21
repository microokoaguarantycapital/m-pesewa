// assets/js/auth.js - Authentication logic (UI only)

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.token = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupEventListeners();
        this.updateAuthUI();
    }

    // ===== USER MANAGEMENT =====
    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem('mPesewaUser');
            const token = localStorage.getItem('mPesewaToken');
            const tokenExpiry = localStorage.getItem('mPesewaTokenExpiry');
            
            if (userData && token && tokenExpiry) {
                // Check if token is expired
                if (new Date(tokenExpiry) > new Date()) {
                    this.currentUser = JSON.parse(userData);
                    this.token = token;
                    this.isAuthenticated = true;
                    
                    console.log('User loaded from storage:', this.currentUser.email);
                    this.dispatchAuthEvent('user_loaded');
                } else {
                    // Token expired, clear storage
                    this.clearStorage();
                    console.log('Token expired, clearing storage');
                }
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
            this.clearStorage();
        }
    }

    saveUserToStorage(user, token, expiryHours = 24) {
        try {
            const expiry = new Date();
            expiry.setHours(expiry.getHours() + expiryHours);
            
            localStorage.setItem('mPesewaUser', JSON.stringify(user));
            localStorage.setItem('mPesewaToken', token);
            localStorage.setItem('mPesewaTokenExpiry', expiry.toISOString());
            
            this.currentUser = user;
            this.token = token;
            this.isAuthenticated = true;
            
            console.log('User saved to storage:', user.email);
            this.dispatchAuthEvent('user_saved');
            
        } catch (error) {
            console.error('Error saving user to storage:', error);
            throw new Error('Failed to save user data');
        }
    }

    clearStorage() {
        localStorage.removeItem('mPesewaUser');
        localStorage.removeItem('mPesewaToken');
        localStorage.removeItem('mPesewaTokenExpiry');
        
        this.currentUser = null;
        this.token = null;
        this.isAuthenticated = false;
        
        this.dispatchAuthEvent('user_cleared');
    }

    // ===== AUTHENTICATION METHODS =====
    async register(userData) {
        try {
            // Validate user data
            const validation = this.validateUserData(userData, 'register');
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Check if user already exists (mock - in production, this would be API call)
            const existingUsers = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const userExists = existingUsers.some(user => 
                user.email === userData.email || user.phone === userData.phone
            );
            
            if (userExists) {
                throw new Error('User with this email or phone already exists');
            }

            // Create new user
            const newUser = {
                id: utils.generateId('USR'),
                ...userData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
                rating: 5,
                groups: [],
                blacklisted: false
            };

            // Save to mock database
            existingUsers.push(newUser);
            localStorage.setItem('mPesewaUsers', JSON.stringify(existingUsers));

            // Generate token and save user
            const token = this.generateToken(newUser);
            this.saveUserToStorage(newUser, token);

            this.dispatchAuthEvent('register_success', newUser);
            return { success: true, user: newUser, token };

        } catch (error) {
            console.error('Registration error:', error);
            this.dispatchAuthEvent('register_error', error);
            throw error;
        }
    }

    async login(credentials) {
        try {
            // Validate credentials
            if (!credentials.email && !credentials.phone) {
                throw new Error('Email or phone is required');
            }
            if (!credentials.password) {
                throw new Error('Password is required');
            }

            // Find user (mock - in production, this would be API call)
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const user = users.find(u => 
                (u.email === credentials.email || u.phone === credentials.phone) &&
                u.password === credentials.password // In production, this would be hashed
            );

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check if user is active
            if (user.status !== 'active') {
                throw new Error(`Account is ${user.status}. Please contact support.`);
            }

            // Check if user is blacklisted
            if (user.blacklisted) {
                throw new Error('Account is blacklisted. Please contact support.');
            }

            // Generate token and save user
            const token = this.generateToken(user);
            this.saveUserToStorage(user, token);

            this.dispatchAuthEvent('login_success', user);
            return { success: true, user, token };

        } catch (error) {
            console.error('Login error:', error);
            this.dispatchAuthEvent('login_error', error);
            throw error;
        }
    }

    async logout() {
        try {
            const oldUser = this.currentUser;
            this.clearStorage();
            this.updateAuthUI();
            
            this.dispatchAuthEvent('logout_success', oldUser);
            return { success: true };
            
        } catch (error) {
            console.error('Logout error:', error);
            this.dispatchAuthEvent('logout_error', error);
            throw error;
        }
    }

    async updateProfile(userData) {
        try {
            if (!this.isAuthenticated) {
                throw new Error('User not authenticated');
            }

            // Validate update data
            const validation = this.validateUserData(userData, 'update');
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Update user in mock database
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            // Update user data
            const updatedUser = {
                ...users[userIndex],
                ...userData,
                updatedAt: new Date().toISOString()
            };

            users[userIndex] = updatedUser;
            localStorage.setItem('mPesewaUsers', JSON.stringify(users));

            // Update current user
            this.currentUser = updatedUser;
            localStorage.setItem('mPesewaUser', JSON.stringify(updatedUser));

            this.dispatchAuthEvent('profile_updated', updatedUser);
            return { success: true, user: updatedUser };

        } catch (error) {
            console.error('Update profile error:', error);
            this.dispatchAuthEvent('profile_update_error', error);
            throw error;
        }
    }

    async changePassword(currentPassword, newPassword) {
        try {
            if (!this.isAuthenticated) {
                throw new Error('User not authenticated');
            }

            // Verify current password
            if (this.currentUser.password !== currentPassword) {
                throw new Error('Current password is incorrect');
            }

            // Validate new password
            if (!utils.validatePassword(newPassword)) {
                throw new Error('New password must be at least 8 characters with uppercase, lowercase, and number');
            }

            // Update password in mock database
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            users[userIndex].password = newPassword;
            users[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mPesewaUsers', JSON.stringify(users));

            // Update current user
            this.currentUser.password = newPassword;
            localStorage.setItem('mPesewaUser', JSON.stringify(this.currentUser));

            this.dispatchAuthEvent('password_changed');
            return { success: true };

        } catch (error) {
            console.error('Change password error:', error);
            this.dispatchAuthEvent('password_change_error', error);
            throw error;
        }
    }

    async resetPassword(email) {
        try {
            // Validate email
            if (!utils.validateEmail(email)) {
                throw new Error('Invalid email address');
            }

            // Check if user exists (mock)
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const user = users.find(u => u.email === email);
            
            if (!user) {
                // Don't reveal that user doesn't exist for security
                console.log('Password reset requested for non-existent email:', email);
                // Still return success to prevent email enumeration
                return { success: true };
            }

            // Generate reset token (in production, this would be sent via email)
            const resetToken = utils.generateId('RST');
            const resetExpiry = new Date();
            resetExpiry.setHours(resetExpiry.getHours() + 1);

            // Save reset token (mock)
            localStorage.setItem(`resetToken_${email}`, JSON.stringify({
                token: resetToken,
                expiry: resetExpiry.toISOString()
            }));

            // In production, send email here
            console.log('Password reset token generated:', resetToken);
            
            // For demo purposes, show token in console
            console.info(`Demo Reset Token for ${email}: ${resetToken}`);

            this.dispatchAuthEvent('password_reset_requested', { email, resetToken });
            return { success: true };

        } catch (error) {
            console.error('Reset password error:', error);
            this.dispatchAuthEvent('password_reset_error', error);
            throw error;
        }
    }

    async confirmResetPassword(email, token, newPassword) {
        try {
            // Validate inputs
            if (!utils.validateEmail(email)) {
                throw new Error('Invalid email address');
            }
            if (!token) {
                throw new Error('Reset token is required');
            }
            if (!utils.validatePassword(newPassword)) {
                throw new Error('New password must be at least 8 characters with uppercase, lowercase, and number');
            }

            // Verify reset token
            const storedToken = JSON.parse(localStorage.getItem(`resetToken_${email}`) || 'null');
            
            if (!storedToken || storedToken.token !== token) {
                throw new Error('Invalid or expired reset token');
            }

            if (new Date(storedToken.expiry) < new Date()) {
                throw new Error('Reset token has expired');
            }

            // Update password in mock database
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const userIndex = users.findIndex(u => u.email === email);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            users[userIndex].password = newPassword;
            users[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mPesewaUsers', JSON.stringify(users));

            // Clear reset token
            localStorage.removeItem(`resetToken_${email}`);

            this.dispatchAuthEvent('password_reset_confirmed', { email });
            return { success: true };

        } catch (error) {
            console.error('Confirm reset password error:', error);
            this.dispatchAuthEvent('password_reset_confirm_error', error);
            throw error;
        }
    }

    // ===== VALIDATION METHODS =====
    validateUserData(userData, context) {
        const errors = [];
        
        if (context === 'register' || context === 'update') {
            // Name validation
            if (!userData.name || userData.name.trim().length < 2) {
                errors.push('Name must be at least 2 characters');
            }
            
            // Email validation
            if (!userData.email || !utils.validateEmail(userData.email)) {
                errors.push('Valid email is required');
            }
            
            // Phone validation
            if (!userData.phone || !utils.validatePhone(userData.phone)) {
                errors.push('Valid phone number is required');
            }
            
            // Country validation
            if (!userData.country) {
                errors.push('Country is required');
            }
            
            // Role validation
            if (!userData.role || !['borrower', 'lender', 'both'].includes(userData.role)) {
                errors.push('Valid role is required (borrower, lender, or both)');
            }
        }
        
        if (context === 'register') {
            // Password validation for registration
            if (!userData.password || !utils.validatePassword(userData.password)) {
                errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
            }
            
            // Confirm password
            if (userData.password !== userData.confirmPassword) {
                errors.push('Passwords do not match');
            }
            
            // Terms acceptance
            if (!userData.acceptTerms) {
                errors.push('You must accept the terms and conditions');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ===== TOKEN MANAGEMENT =====
    generateToken(user) {
        // In production, this would be a proper JWT from the server
        // For mock purposes, create a simple token
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: user.id,
            email: user.email,
            role: user.role,
            country: user.country,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        }));
        const signature = btoa('mock-signature-' + Date.now());
        
        return `${header}.${payload}.${signature}`;
    }

    parseToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }
            
            const payload = JSON.parse(atob(parts[1]));
            return payload;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }

    isTokenValid(token) {
        try {
            const payload = this.parseToken(token);
            if (!payload) return false;
            
            // Check expiry
            if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    }

    // ===== ROLE-BASED ACCESS CONTROL =====
    hasRole(requiredRole) {
        if (!this.isAuthenticated || !this.currentUser) {
            return false;
        }
        
        const userRole = this.currentUser.role;
        
        // Handle "both" role
        if (userRole === 'both') {
            return requiredRole === 'borrower' || requiredRole === 'lender';
        }
        
        return userRole === requiredRole;
    }

    hasPermission(permission) {
        if (!this.isAuthenticated || !this.currentUser) {
            return false;
        }
        
        const permissions = {
            'borrower': ['request_loan', 'view_groups', 'view_ledger', 'update_profile'],
            'lender': ['fund_loan', 'view_borrowers', 'manage_ledger', 'update_subscription', 'update_profile'],
            'both': ['request_loan', 'fund_loan', 'view_groups', 'view_borrowers', 'view_ledger', 'manage_ledger', 'update_subscription', 'update_profile']
        };
        
        const userPermissions = permissions[this.currentUser.role] || [];
        return userPermissions.includes(permission);
    }

    requireRole(requiredRole, redirectUrl = '/') {
        if (!this.hasRole(requiredRole)) {
            this.showNotification(`Access denied. ${utils.capitalize(requiredRole)} role required.`, 'error');
            
            if (this.isAuthenticated) {
                window.location.href = redirectUrl;
            } else {
                this.showLoginModal();
            }
            
            return false;
        }
        
        return true;
    }

    requirePermission(permission, redirectUrl = '/') {
        if (!this.hasPermission(permission)) {
            this.showNotification('You do not have permission to perform this action', 'error');
            
            if (this.isAuthenticated) {
                window.location.href = redirectUrl;
            } else {
                this.showLoginModal();
            }
            
            return false;
        }
        
        return true;
    }

    // ===== UI METHODS =====
    updateAuthUI() {
        // Update login/logout buttons
        const loginBtn = document.querySelector('.login-btn');
        const logoutBtn = document.querySelector('.logout-btn');
        const userMenu = document.querySelector('.user-menu');
        const userName = document.querySelector('.user-name');
        
        if (this.isAuthenticated && this.currentUser) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-flex';
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = this.currentUser.name.split(' ')[0];
            
            // Update role-specific UI
            this.updateRoleUI();
            
        } else {
            // User is logged out
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'none';
            if (userName) userName.textContent = '';
        }
    }

    updateRoleUI() {
        if (!this.isAuthenticated || !this.currentUser) return;
        
        const role = this.currentUser.role;
        
        // Show/hide role-specific navigation items
        document.querySelectorAll('[data-role]').forEach(element => {
            const allowedRoles = element.getAttribute('data-role').split(' ');
            if (allowedRoles.includes(role) || allowedRoles.includes('both')) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
        
        // Update dashboard links
        const dashboardLinks = document.querySelectorAll('[href*="dashboard"]');
        dashboardLinks.forEach(link => {
            if (link.href.includes('dashboard')) {
                link.href = `/pages/dashboard/${role}-dashboard.html`;
            }
        });
    }

    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showRegistrationModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideRegistrationModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // ===== EVENT HANDLING =====
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLoginForm(loginForm);
            });
        }
        
        // Registration form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegisterForm(registerForm);
            });
        }
        
        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.logout();
            });
        }
        
        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                (e.target.classList.contains('modal') && e.target.id.includes('Modal'))) {
                this.hideLoginModal();
                this.hideRegistrationModal();
            }
        });
        
        // Auth state change listeners
        window.addEventListener('auth_state_changed', (e) => {
            this.updateAuthUI();
        });
    }

    async handleLoginForm(form) {
        try {
            const formData = new FormData(form);
            const credentials = {
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password')
            };
            
            await this.login(credentials);
            this.hideLoginModal();
            form.reset();
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async handleRegisterForm(form) {
        try {
            const formData = new FormData(form);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                country: formData.get('country'),
                role: formData.get('role'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                acceptTerms: formData.get('acceptTerms') === 'on'
            };
            
            await this.register(userData);
            this.hideRegistrationModal();
            form.reset();
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    dispatchAuthEvent(eventName, data = {}) {
        const event = new CustomEvent(`auth_${eventName}`, {
            detail: { ...data, timestamp: new Date().toISOString() }
        });
        window.dispatchEvent(event);
        
        // Also dispatch general auth state changed event
        if (eventName.includes('success') || eventName.includes('error') || eventName.includes('logout')) {
            const stateEvent = new CustomEvent('auth_state_changed', {
                detail: { 
                    isAuthenticated: this.isAuthenticated,
                    user: this.currentUser,
                    ...data 
                }
            });
            window.dispatchEvent(stateEvent);
        }
    }

    // ===== NOTIFICATION METHODS =====
    showNotification(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showNotification) {
            app.showNotification(message, type);
        } else {
            // Fallback notification
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }

    // ===== SESSION MANAGEMENT =====
    async refreshSession() {
        try {
            if (!this.isAuthenticated || !this.token) {
                throw new Error('No active session to refresh');
            }
            
            // In production, this would call an API endpoint
            // For mock purposes, just extend the expiry
            
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const user = users.find(u => u.id === this.currentUser.id);
            
            if (!user) {
                throw new Error('User not found');
            }
            
            const newToken = this.generateToken(user);
            this.saveUserToStorage(user, newToken);
            
            this.dispatchAuthEvent('session_refreshed');
            return { success: true, token: newToken };
            
        } catch (error) {
            console.error('Session refresh error:', error);
            this.dispatchAuthEvent('session_refresh_error', error);
            throw error;
        }
    }

    getSessionRemainingTime() {
        if (!this.token) return 0;
        
        const payload = this.parseToken(this.token);
        if (!payload || !payload.exp) return 0;
        
        const now = Math.floor(Date.now() / 1000);
        return Math.max(0, payload.exp - now);
    }

    setupSessionTimer() {
        // Check session every minute
        setInterval(() => {
            if (this.isAuthenticated) {
                const remaining = this.getSessionRemainingTime();
                
                // Warn user 5 minutes before expiry
                if (remaining === 300) { // 5 minutes
                    this.showNotification('Your session will expire in 5 minutes', 'warning');
                }
                
                // Auto-refresh 1 minute before expiry
                if (remaining === 60) { // 1 minute
                    this.refreshSession().catch(() => {
                        this.showNotification('Session expired. Please login again.', 'error');
                        this.logout();
                    });
                }
                
                // Auto-logout when expired
                if (remaining === 0) {
                    this.showNotification('Session expired', 'error');
                    this.logout();
                }
            }
        }, 60000); // Check every minute
    }

    // ===== USER DATA MANAGEMENT =====
    getUserProfile() {
        return this.currentUser ? { ...this.currentUser } : null;
    }

    async updateUserProfile(updates) {
        return await this.updateProfile(updates);
    }

    async deleteAccount() {
        try {
            if (!this.isAuthenticated) {
                throw new Error('User not authenticated');
            }
            
            // Confirm deletion
            const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
            if (!confirmed) {
                return { success: false, message: 'Deletion cancelled' };
            }
            
            // Remove from mock database
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const filteredUsers = users.filter(u => u.id !== this.currentUser.id);
            localStorage.setItem('mPesewaUsers', JSON.stringify(filteredUsers));
            
            // Logout and clear storage
            await this.logout();
            
            this.dispatchAuthEvent('account_deleted');
            return { success: true, message: 'Account deleted successfully' };
            
        } catch (error) {
            console.error('Delete account error:', error);
            this.dispatchAuthEvent('account_delete_error', error);
            throw error;
        }
    }

    // ===== DEMO DATA SETUP =====
    setupDemoData() {
        // Check if demo data already exists
        const existingUsers = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
        if (existingUsers.length > 0) {
            return;
        }
        
        const demoUsers = [
            {
                id: 'USR001',
                name: 'John Borrower',
                email: 'borrower@demo.com',
                phone: '+254700000001',
                password: 'Password123',
                country: 'Kenya',
                role: 'borrower',
                rating: 4.5,
                groups: ['GRP001', 'GRP002'],
                activeLoans: 2,
                totalLoans: 5,
                repaymentRate: 95,
                status: 'active',
                blacklisted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'USR002',
                name: 'Mary Lender',
                email: 'lender@demo.com',
                phone: '+254700000002',
                password: 'Password123',
                country: 'Kenya',
                role: 'lender',
                subscription: 'premium',
                subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                totalLent: 150000,
                activeLedgers: 3,
                rating: 4.8,
                status: 'active',
                blacklisted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'USR003',
                name: 'David Both',
                email: 'both@demo.com',
                phone: '+254700000003',
                password: 'Password123',
                country: 'Kenya',
                role: 'both',
                rating: 4.2,
                subscription: 'basic',
                subscriptionExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                groups: ['GRP001'],
                activeLoans: 1,
                totalLoans: 3,
                totalLent: 50000,
                activeLedgers: 1,
                status: 'active',
                blacklisted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('mPesewaUsers', JSON.stringify(demoUsers));
        console.log('Demo users created');
    }
}

// Create global instance
const auth = new AuthManager();

// Make available globally
window.auth = auth;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, auth };
}