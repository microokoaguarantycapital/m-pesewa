// assets/js/auth.js - Authentication logic for M-Pesewa PWA (UI-only simulation)

// M-Pesewa Authentication Module
const MpesewaAuth = {
    // Current user session
    currentUser: null,
    currentRole: null,
    currentCountry: null,
    currentGroup: null,
    
    // Session state
    isLoggedIn: false,
    sessionExpiry: null,
    
    // Initialize authentication
    init() {
        this.loadSession();
        this.setupEventListeners();
        this.updateAuthUI();
        
        // Check session expiry periodically
        setInterval(() => this.checkSessionExpiry(), 60000); // Every minute
    },
    
    // Load session from localStorage
    loadSession() {
        try {
            const userData = localStorage.getItem('mPesewaCurrentUser');
            const token = localStorage.getItem('mPesewaToken');
            const expiry = localStorage.getItem('mPesewaSessionExpiry');
            
            if (userData && token && expiry) {
                const now = new Date();
                const expiryDate = new Date(expiry);
                
                if (now < expiryDate) {
                    this.currentUser = JSON.parse(userData);
                    this.currentRole = localStorage.getItem('mPesewaCurrentRole');
                    this.currentCountry = localStorage.getItem('mPesewaCurrentCountry');
                    this.currentGroup = localStorage.getItem('mPesewaCurrentGroup');
                    this.sessionExpiry = expiryDate;
                    this.isLoggedIn = true;
                    
                    console.log('Session loaded for user:', this.currentUser.name);
                    return true;
                } else {
                    console.log('Session expired');
                    this.clearSession();
                }
            }
        } catch (error) {
            console.error('Error loading session:', error);
            this.clearSession();
        }
        
        return false;
    },
    
    // Save session to localStorage
    saveSession() {
        if (this.currentUser && this.isLoggedIn) {
            localStorage.setItem('mPesewaCurrentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('mPesewaCurrentRole', this.currentRole);
            localStorage.setItem('mPesewaToken', this.generateToken());
            
            if (this.currentCountry) {
                localStorage.setItem('mPesewaCurrentCountry', this.currentCountry);
            }
            
            if (this.currentGroup) {
                localStorage.setItem('mPesewaCurrentGroup', this.currentGroup);
            }
            
            // Set session expiry (24 hours)
            this.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
            localStorage.setItem('mPesewaSessionExpiry', this.sessionExpiry.toISOString());
            
            return true;
        }
        return false;
    },
    
    // Clear session
    clearSession() {
        this.currentUser = null;
        this.currentRole = null;
        this.currentCountry = null;
        this.currentGroup = null;
        this.isLoggedIn = false;
        this.sessionExpiry = null;
        
        localStorage.removeItem('mPesewaCurrentUser');
        localStorage.removeItem('mPesewaCurrentRole');
        localStorage.removeItem('mPesewaToken');
        localStorage.removeItem('mPesewaSessionExpiry');
        
        // Note: We keep country and group preferences
        console.log('Session cleared');
    },
    
    // Generate a simple token (demo only)
    generateToken() {
        return 'demo_token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
    },
    
    // Check session expiry
    checkSessionExpiry() {
        if (this.isLoggedIn && this.sessionExpiry) {
            const now = new Date();
            if (now >= this.sessionExpiry) {
                console.log('Session expired automatically');
                this.logout();
                this.showToast('Your session has expired. Please log in again.', 'warning');
            } else if ((this.sessionExpiry - now) < 5 * 60 * 1000) {
                // Warn if session expires in less than 5 minutes
                if (!this.sessionWarningShown) {
                    this.showToast('Your session will expire soon. Please save your work.', 'warning');
                    this.sessionWarningShown = true;
                }
            }
        }
    },
    
    // Setup authentication event listeners
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Registration form submissions
        const borrowerForm = document.getElementById('borrowerForm');
        if (borrowerForm) {
            borrowerForm.addEventListener('submit', (e) => this.handleBorrowerRegistration(e));
        }
        
        const lenderForm = document.getElementById('lenderForm');
        if (lenderForm) {
            lenderForm.addEventListener('submit', (e) => this.handleLenderRegistration(e));
        }
        
        // Logout buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.logout-btn') || e.target.id === 'logoutBtn') {
                e.preventDefault();
                this.logout();
            }
        });
        
        // Role switch buttons
        document.addEventListener('click', (e) => {
            const roleSwitchBtn = e.target.closest('.role-switch-btn');
            if (roleSwitchBtn) {
                e.preventDefault();
                this.handleRoleSwitch(roleSwitchBtn.dataset.role);
            }
        });
        
        // Google login button (demo)
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.handleGoogleLogin());
        }
    },
    
    // Update UI based on authentication state
    updateAuthUI() {
        // Navigation buttons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const dashboardLink = document.getElementById('dashboardLink');
        const userMenu = document.getElementById('userMenu');
        
        if (this.isLoggedIn && this.currentUser) {
            // User is logged in
            if (loginBtn) {
                loginBtn.textContent = 'Dashboard';
                loginBtn.href = this.getDashboardUrl();
                loginBtn.onclick = null;
            }
            
            if (registerBtn) {
                registerBtn.textContent = 'Logout';
                registerBtn.href = '#';
                registerBtn.onclick = () => this.logout();
            }
            
            // Show user menu if exists
            if (userMenu) {
                userMenu.style.display = 'block';
                const userName = userMenu.querySelector('.user-name');
                if (userName) {
                    userName.textContent = this.currentUser.name;
                }
                
                const userRole = userMenu.querySelector('.user-role');
                if (userRole) {
                    userRole.textContent = this.currentRole === 'lender' ? 'Lender' : 'Borrower';
                }
            }
            
            // Show dashboard link
            if (dashboardLink) {
                dashboardLink.style.display = 'block';
                dashboardLink.href = this.getDashboardUrl();
            }
            
            // Update dashboard page if we're on one
            this.updateDashboardUI();
            
        } else {
            // User is not logged in
            if (loginBtn) {
                loginBtn.textContent = 'Log In';
                loginBtn.href = '#';
                loginBtn.onclick = () => this.showLoginModal();
            }
            
            if (registerBtn) {
                registerBtn.textContent = 'Get Started';
                registerBtn.href = '#';
                registerBtn.onclick = () => this.showRegistrationModal();
            }
            
            // Hide user menu
            if (userMenu) {
                userMenu.style.display = 'none';
            }
            
            // Hide dashboard link
            if (dashboardLink) {
                dashboardLink.style.display = 'none';
            }
        }
        
        // Update any role-specific UI
        this.updateRoleUI();
    },
    
    // Update dashboard UI with user data
    updateDashboardUI() {
        if (!this.isLoggedIn || !this.currentUser) return;
        
        // Update dashboard welcome message
        const welcomeElement = document.querySelector('.welcome-message, .dashboard-welcome');
        if (welcomeElement) {
            welcomeElement.textContent = `Welcome back, ${this.currentUser.name}!`;
        }
        
        // Update user stats
        this.updateUserStats();
    },
    
    // Update user statistics on dashboard
    updateUserStats() {
        if (!this.currentUser) return;
        
        // Get user-specific data from localStorage
        const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
        const user = users.find(u => u.id === this.currentUser.id);
        
        if (!user) return;
        
        // Update stats based on role
        if (this.currentRole === 'borrower') {
            this.updateBorrowerStats(user);
        } else if (this.currentRole === 'lender') {
            this.updateLenderStats(user);
        }
    },
    
    // Update borrower statistics
    updateBorrowerStats(user) {
        const ledgers = JSON.parse(localStorage.getItem('mPesewaLedgers') || '[]');
        const userLedgers = ledgers.filter(l => l.borrowerId === user.id);
        
        const activeLoans = userLedgers.filter(l => l.status === 'active');
        const repaidLoans = userLedgers.filter(l => l.status === 'repaid');
        const overdueLoans = userLedgers.filter(l => l.status === 'overdue');
        
        // Update stats display
        const stats = {
            activeLoans: activeLoans.length,
            totalBorrowed: activeLoans.reduce((sum, loan) => sum + loan.amount, 0),
            totalRepaid: repaidLoans.reduce((sum, loan) => sum + loan.totalRepaid, 0),
            overdueLoans: overdueLoans.length
        };
        
        // Update UI elements
        document.querySelectorAll('[data-stat="active-loans"]').forEach(el => {
            el.textContent = stats.activeLoans;
        });
        
        document.querySelectorAll('[data-stat="total-borrowed"]').forEach(el => {
            el.textContent = Utils.Format.formatCurrency(stats.totalBorrowed, 'KES');
        });
        
        document.querySelectorAll('[data-stat="overdue-loans"]').forEach(el => {
            el.textContent = stats.overdueLoans;
        });
    },
    
    // Update lender statistics
    updateLenderStats(user) {
        const ledgers = JSON.parse(localStorage.getItem('mPesewaLedgers') || '[]');
        const userLedgers = ledgers.filter(l => l.lenderId === user.id);
        
        const activeLedgers = userLedgers.filter(l => l.status === 'active');
        const repaidLedgers = userLedgers.filter(l => l.status === 'repaid');
        const defaultedLedgers = userLedgers.filter(l => l.status === 'defaulted');
        
        const totalLent = userLedgers.reduce((sum, ledger) => sum + ledger.amount, 0);
        const totalReturns = repaidLedgers.reduce((sum, ledger) => sum + (ledger.interestEarned || 0), 0);
        
        // Update stats display
        const stats = {
            activeLedgers: activeLedgers.length,
            totalLent: totalLent,
            totalReturns: totalReturns,
            defaultRate: userLedgers.length > 0 ? 
                (defaultedLedgers.length / userLedgers.length * 100).toFixed(1) + '%' : '0%'
        };
        
        // Update UI elements
        document.querySelectorAll('[data-stat="active-ledgers"]').forEach(el => {
            el.textContent = stats.activeLedgers;
        });
        
        document.querySelectorAll('[data-stat="total-lent"]').forEach(el => {
            el.textContent = Utils.Format.formatCurrency(stats.totalLent, 'KES');
        });
        
        document.querySelectorAll('[data-stat="total-returns"]').forEach(el => {
            el.textContent = Utils.Format.formatCurrency(stats.totalReturns, 'KES');
        });
    },
    
    // Update role-specific UI
    updateRoleUI() {
        // Show/hide role-specific elements
        const borrowerElements = document.querySelectorAll('.borrower-only');
        const lenderElements = document.querySelectorAll('.lender-only');
        const adminElements = document.querySelectorAll('.admin-only');
        
        if (this.currentRole === 'borrower') {
            borrowerElements.forEach(el => el.style.display = '');
            lenderElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = 'none');
        } else if (this.currentRole === 'lender') {
            borrowerElements.forEach(el => el.style.display = 'none');
            lenderElements.forEach(el => el.style.display = '');
            adminElements.forEach(el => el.style.display = 'none');
        } else if (this.currentRole === 'admin') {
            borrowerElements.forEach(el => el.style.display = 'none');
            lenderElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = '');
        } else {
            // Not logged in - hide all role-specific elements
            borrowerElements.forEach(el => el.style.display = 'none');
            lenderElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = 'none');
        }
    },
    
    // Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const phone = form.querySelector('#loginPhone')?.value;
        const password = form.querySelector('#loginPassword')?.value;
        
        if (!phone || !password) {
            this.showToast('Please enter phone number and password', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;
        if (submitBtn) {
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
        }
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Validate credentials against localStorage
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const user = users.find(u => u.phone === phone && u.password === password);
            
            if (user) {
                // Remove password from user object before storing
                const { password, ...userWithoutPassword } = user;
                
                this.currentUser = userWithoutPassword;
                this.currentRole = user.role;
                this.isLoggedIn = true;
                
                this.saveSession();
                this.updateAuthUI();
                
                this.showToast(`Welcome back, ${user.name}!`, 'success');
                
                // Close modal if open
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.remove('show');
                }
                
                // Redirect to dashboard after delay
                setTimeout(() => {
                    window.location.href = this.getDashboardUrl();
                }, 1000);
                
            } else {
                throw new Error('Invalid phone number or password');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showToast(error.message || 'Login failed. Please try again.', 'error');
        } finally {
            // Reset button
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    },
    
    // Handle borrower registration
    async handleBorrowerRegistration(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate required fields
        const requiredFields = ['borrowerCountry', 'borrowerName', 'borrowerPhone', 
                              'borrowerNationalId', 'guarantor1', 'guarantor2'];
        
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
        
        // Validate phone number
        const phone = formData.get('borrowerPhone');
        if (!Utils.Validation.validatePhone(phone)) {
            this.showToast('Please enter a valid phone number', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;
        if (submitBtn) {
            submitBtn.textContent = 'Registering...';
            submitBtn.disabled = true;
        }
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const existingUser = users.find(u => u.phone === phone);
            
            if (existingUser) {
                throw new Error('User with this phone number already exists');
            }
            
            // Create new user
            const userId = 'user_' + Date.now();
            const user = {
                id: userId,
                role: 'borrower',
                country: formData.get('borrowerCountry'),
                name: formData.get('borrowerName'),
                phone: phone,
                email: formData.get('borrowerEmail') || '',
                nationalId: formData.get('borrowerNationalId'),
                guarantors: [
                    formData.get('guarantor1'),
                    formData.get('guarantor2')
                ],
                rating: 5, // Default rating
                groups: [],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Add to users array
            users.push(user);
            localStorage.setItem('mPesewaUsers', JSON.stringify(users));
            
            // Log the user in
            this.currentUser = user;
            this.currentRole = 'borrower';
            this.currentCountry = user.country;
            this.isLoggedIn = true;
            
            this.saveSession();
            this.updateAuthUI();
            
            this.showToast('Borrower registration successful!', 'success');
            
            // Close modal
            const registrationModal = document.getElementById('registrationModal');
            if (registrationModal) {
                registrationModal.classList.remove('show');
            }
            
            // Redirect to borrower dashboard
            setTimeout(() => {
                window.location.href = 'pages/dashboard/borrower-dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showToast(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            // Reset button
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    },
    
    // Handle lender registration
    async handleLenderRegistration(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate required fields
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
        
        // Validate phone number
        const phone = formData.get('lenderPhone');
        if (!Utils.Validation.validatePhone(phone)) {
            this.showToast('Please enter a valid phone number', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;
        if (submitBtn) {
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
        }
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const existingUser = users.find(u => u.phone === phone);
            
            if (existingUser) {
                throw new Error('User with this phone number already exists');
            }
            
            // Create new user
            const userId = 'user_' + Date.now();
            const subscriptionTier = formData.get('subscriptionTier');
            
            const user = {
                id: userId,
                role: 'lender',
                country: formData.get('lenderCountry'),
                name: formData.get('lenderName'),
                phone: phone,
                email: formData.get('lenderEmail') || '',
                subscriptionTier: subscriptionTier,
                subscriptionStatus: 'pending', // Needs payment
                subscriptionExpiry: null,
                rating: 5, // Default rating
                groups: [],
                ledgers: [],
                isActive: false, // Inactive until payment
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Add to users array
            users.push(user);
            localStorage.setItem('mPesewaUsers', JSON.stringify(users));
            
            // Show payment redirect
            this.showToast('Lender registration submitted. Redirecting to payment...', 'info');
            
            // Simulate payment processing
            setTimeout(() => {
                // Update user with successful payment
                user.subscriptionStatus = 'active';
                user.subscriptionExpiry = this.calculateSubscriptionExpiry();
                user.isActive = true;
                
                // Update in storage
                const updatedUsers = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
                const userIndex = updatedUsers.findIndex(u => u.id === userId);
                if (userIndex !== -1) {
                    updatedUsers[userIndex] = user;
                    localStorage.setItem('mPesewaUsers', JSON.stringify(updatedUsers));
                }
                
                // Log the user in
                this.currentUser = user;
                this.currentRole = 'lender';
                this.currentCountry = user.country;
                this.isLoggedIn = true;
                
                this.saveSession();
                this.updateAuthUI();
                
                this.showToast('Payment successful! Lender account activated.', 'success');
                
                // Close modal
                const registrationModal = document.getElementById('registrationModal');
                if (registrationModal) {
                    registrationModal.classList.remove('show');
                }
                
                // Redirect to lender dashboard
                setTimeout(() => {
                    window.location.href = 'pages/dashboard/lender-dashboard.html';
                }, 1500);
            }, 2000);
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showToast(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            // Reset button
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    },
    
    // Handle Google login (demo)
    async handleGoogleLogin() {
        try {
            this.showToast('Google login is simulated for demo purposes', 'info');
            
            // Simulate Google login
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Create demo user from Google
            const userId = 'user_google_' + Date.now();
            const user = {
                id: userId,
                role: 'borrower', // Default role
                country: 'KE',
                name: 'Google User',
                phone: '+254700000000',
                email: 'google.user@example.com',
                rating: 5,
                groups: [],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Add to users if not exists
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            if (!users.find(u => u.email === user.email)) {
                users.push(user);
                localStorage.setItem('mPesewaUsers', JSON.stringify(users));
            }
            
            // Log the user in
            this.currentUser = user;
            this.currentRole = 'borrower';
            this.currentCountry = 'KE';
            this.isLoggedIn = true;
            
            this.saveSession();
            this.updateAuthUI();
            
            this.showToast('Google login successful!', 'success');
            
            // Close login modal
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.classList.remove('show');
            }
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = this.getDashboardUrl();
            }, 1000);
            
        } catch (error) {
            console.error('Google login error:', error);
            this.showToast('Google login failed. Please try again.', 'error');
        }
    },
    
    // Handle logout
    logout() {
        if (confirm('Are you sure you want to log out?')) {
            this.clearSession();
            this.updateAuthUI();
            this.showToast('Logged out successfully', 'info');
            
            // Redirect to home if not already there
            const currentPage = window.location.pathname;
            if (!currentPage.includes('index.html') && currentPage !== '/') {
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 500);
            }
        }
    },
    
    // Handle role switching
    handleRoleSwitch(newRole) {
        if (!this.isLoggedIn || !this.currentUser) {
            this.showToast('Please log in first', 'warning');
            return;
        }
        
        // Check if user can switch to this role
        if (newRole === 'lender') {
            // Check if user has active lender subscription
            const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
            const user = users.find(u => u.id === this.currentUser.id);
            
            if (user.role !== 'lender' || user.subscriptionStatus !== 'active') {
                this.showToast('You need an active lender subscription to switch to lender role', 'warning');
                return;
            }
        }
        
        // Switch role
        this.currentRole = newRole;
        this.saveSession();
        this.updateAuthUI();
        
        this.showToast(`Switched to ${newRole} role`, 'success');
        
        // Refresh page to show role-specific content
        setTimeout(() => {
            window.location.reload();
        }, 500);
    },
    
    // Calculate subscription expiry (28th of next month)
    calculateSubscriptionExpiry() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 2; // Next month (0-indexed, so +2)
        
        if (month > 12) {
            month = month - 12;
            year++;
        }
        
        // Always expire on 28th
        return new Date(year, month - 1, 28).toISOString();
    },
    
    // Get dashboard URL based on role
    getDashboardUrl() {
        if (!this.currentRole) return '../index.html';
        
        switch (this.currentRole) {
            case 'borrower':
                return 'pages/dashboard/borrower-dashboard.html';
            case 'lender':
                return 'pages/dashboard/lender-dashboard.html';
            case 'admin':
                return 'pages/dashboard/admin-dashboard.html';
            default:
                return '../index.html';
        }
    },
    
    // Show login modal
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('show');
        }
    },
    
    // Show registration modal
    showRegistrationModal() {
        const modal = document.getElementById('registrationModal');
        if (modal) {
            modal.classList.add('show');
            // Switch to borrower tab by default
            this.switchRegistrationTab('borrower');
        }
    },
    
    // Switch registration tab
    switchRegistrationTab(tab) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
        });
        
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tab}Tab`);
        });
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
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            // Fallback to alert if showToast not available
            alert(message);
        }
    },
    
    // Check if user has permission for an action
    hasPermission(permission) {
        if (!this.isLoggedIn) return false;
        
        const permissions = {
            'borrower': ['request_loan', 'view_groups', 'view_ledger'],
            'lender': ['lend_money', 'view_borrowers', 'manage_ledger', 'blacklist_borrower'],
            'admin': ['all']
        };
        
        const rolePermissions = permissions[this.currentRole] || [];
        return rolePermissions.includes('all') || rolePermissions.includes(permission);
    },
    
    // Get user's active subscription status
    getSubscriptionStatus() {
        if (!this.isLoggedIn || this.currentRole !== 'lender') {
            return null;
        }
        
        const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
        const user = users.find(u => u.id === this.currentUser.id);
        
        if (!user) return null;
        
        return {
            tier: user.subscriptionTier,
            status: user.subscriptionStatus,
            expiry: user.subscriptionExpiry,
            isActive: user.isActive
        };
    },
    
    // Check if user is blacklisted
    isBlacklisted() {
        if (!this.currentUser) return false;
        
        const blacklist = JSON.parse(localStorage.getItem('mPesewaBlacklist') || '[]');
        return blacklist.some(entry => entry.userId === this.currentUser.id);
    },
    
    // Get user's rating
    getUserRating() {
        if (!this.currentUser) return 5; // Default
        
        const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
        const user = users.find(u => u.id === this.currentUser.id);
        return user ? user.rating : 5;
    },
    
    // Update user's rating
    updateUserRating(newRating) {
        if (!this.currentUser) return false;
        
        const users = JSON.parse(localStorage.getItem('mPesewaUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].rating = newRating;
            users[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('mPesewaUsers', JSON.stringify(users));
            
            // Update current user
            this.currentUser.rating = newRating;
            this.saveSession();
            
            return true;
        }
        
        return false;
    }
};

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    MpesewaAuth.init();
});

// Make available globally
window.MpesewaAuth = MpesewaAuth;